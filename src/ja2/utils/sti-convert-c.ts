const CONVERT_ADD_APPDATA = 0x0001;
const CONVERT_ADD_JA2DATA = 0x0003;
const CONVERT_ZLIB_COMPRESS = 0x0010;
const CONVERT_ETRLE_COMPRESS = 0x0020;
const CONVERT_ETRLE_COMPRESS_SINGLE = 0x0040;
const CONVERT_ETRLE_NO_SUBIMAGE_SHRINKING = 0x0080;
const CONVERT_ETRLE_DONT_SKIP_BLANKS = 0x0100;
const CONVERT_ETRLE_FLIC = 0x0200;
const CONVERT_ETRLE_FLIC_TRIM = 0x0400;
const CONVERT_ETRLE_FLIC_NAME = 0x0800;
const CONVERT_TO_8_BIT = 0x1000;
const CONVERT_TO_16_BIT = 0x2000;
// NB 18-bit is actually 24 bit but with only 6 bits used in each byte.  I implemented
// it to see how well such images would compress with ZLIB.
const CONVERT_TO_18_BIT = 0x4000;

// Defines for inserting red/green/blue values into a 16-bit pixel.
// MASK is the mask to use to get the proper bits out of a byte (part of a 24-bit pixel)
// use SHIFT_RIGHT to move the masked bits to the lowest bits of the byte
// use SHIFT_LEFT to put the bits in their proper place in the 16-bit pixel
const RED_DEPTH_16 = 5;
const GREEN_DEPTH_16 = 6;
const BLUE_DEPTH_16 = 5;
const RED_MASK_16 = 0xF8;
const RED_SHIFT_RIGHT_16 = 3;
const RED_SHIFT_LEFT_16 = 11;
const GREEN_MASK_16 = 0xFC;
const GREEN_SHIFT_RIGHT_16 = 2;
const GREEN_SHIFT_LEFT_16 = 5;
const BLUE_MASK_16 = 0xF8;
const BLUE_SHIFT_RIGHT_16 = 3;
const BLUE_SHIFT_LEFT_16 = 0;

const RED_DEPTH_24 = 8;
const GREEN_DEPTH_24 = 8;
const BLUE_DEPTH_24 = 8;
const RED_MASK_24 = 0x00FF0000;
const GREEN_MASK_24 = 0x0000FF00;
const BLUE_MASK_24 = 0x000000FF;

//#define JA2_OBJECT_DATA_SIZE	16

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

function ConvertRGBDistribution555To565(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32;

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
    // right shift the blue value (at the bottom) into the LOWER word to keep it
    // out of the way
    Pixel.usHigher = pPixel.value;
    Pixel.uiValue >>= 5;
    // add a least significant bit to green
    Pixel.usHigher <<= 1;
    // now shift back into the upper word
    Pixel.uiValue <<= 5;
    // and copy back
    pPixel.value = Pixel.usHigher;
    pPixel++;
  }
}

function WriteSTIFile(pData: Pointer<INT8>, pPalette: Pointer<SGPPaletteEntry>, sWidth: INT16, sHeight: INT16, cOutputName: STR, fFlags: UINT32, uiAppDataSize: UINT32): void {
  let pOutput: Pointer<FILE>;

  let uiOriginalSize: UINT32;
  let pOutputBuffer: Pointer<UINT8> = null;
  let uiCompressedSize: UINT32;

  let Header: STCIHeader;
  let uiLoop: UINT32;
  let Image: image_type;

  let pSGPPaletteEntry: Pointer<SGPPaletteEntry>;
  let STCIPaletteEntry: STCIPaletteElement;

  let pSubImageBuffer: Pointer<STCISubImage>;
  let usNumberOfSubImages: UINT16;
  let uiSubImageBufferSize: UINT32 = 0;

  // UINT16							usLoop;

  memset(addressof(Header), 0, STCI_HEADER_SIZE);
  memset(addressof(Image), 0, sizeof(image_type));

  uiOriginalSize = sWidth * sHeight * (8 / 8);

  // set up STCI header for output
  memcpy(Header.cID, STCI_ID_STRING, STCI_ID_LEN);
  Header.uiTransparentValue = 0;
  Header.usHeight = sHeight;
  Header.usWidth = sWidth;
  Header.ubDepth = 8;
  Header.uiOriginalSize = uiOriginalSize;
  Header.uiStoredSize = uiOriginalSize;
  Header.uiAppDataSize = uiAppDataSize;

  Header.fFlags |= STCI_INDEXED;
  if (Header.ubDepth == 8) {
    // assume 8-bit pixels indexing into 256 colour palette with 24 bit values in
    // the palette
    Header.Indexed.uiNumberOfColours = 256;
    Header.Indexed.ubRedDepth = 8;
    Header.Indexed.ubGreenDepth = 8;
    Header.Indexed.ubBlueDepth = 8;
  }

  if ((Header.fFlags & STCI_INDEXED) && (fFlags & CONVERT_ETRLE_COMPRESS)) {
    if (!ConvertToETRLE(addressof(pOutputBuffer), addressof(uiCompressedSize), addressof(pSubImageBuffer), addressof(usNumberOfSubImages), pData, sWidth, sHeight, fFlags)) {
    }
    uiSubImageBufferSize = usNumberOfSubImages * STCI_SUBIMAGE_SIZE;

    Header.Indexed.usNumberOfSubImages = usNumberOfSubImages;
    Header.uiStoredSize = uiCompressedSize;
    Header.fFlags |= STCI_ETRLE_COMPRESSED;
  }

  //
  // save file
  //

  pOutput = fopen(cOutputName, "wb");
  if (pOutput == null) {
    return;
  }
  // write header
  fwrite(addressof(Header), STCI_HEADER_SIZE, 1, pOutput);
  // write palette and subimage structs, if any
  if (Header.fFlags & STCI_INDEXED) {
    if (pPalette != null) {
      // have to convert palette to STCI format!
      pSGPPaletteEntry = pPalette;
      for (uiLoop = 0; uiLoop < 256; uiLoop++) {
        STCIPaletteEntry.ubRed = pSGPPaletteEntry[uiLoop].peRed;
        STCIPaletteEntry.ubGreen = pSGPPaletteEntry[uiLoop].peGreen;
        STCIPaletteEntry.ubBlue = pSGPPaletteEntry[uiLoop].peBlue;
        fwrite(addressof(STCIPaletteEntry), STCI_PALETTE_ELEMENT_SIZE, 1, pOutput);
      }
    }
    if (Header.fFlags & STCI_ETRLE_COMPRESSED) {
      fwrite(pSubImageBuffer, uiSubImageBufferSize, 1, pOutput);
    }
  }

  // write file data
  if (Header.fFlags & STCI_ZLIB_COMPRESSED || Header.fFlags & STCI_ETRLE_COMPRESSED) {
    fwrite(pOutputBuffer, Header.uiStoredSize, 1, pOutput);
  } else {
    fwrite(Image.pImageData, Header.uiStoredSize, 1, pOutput);
  }

  // write app-specific data (blanked to 0)
  if (Image.pAppData == null) {
    if (Header.uiAppDataSize > 0) {
      for (uiLoop = 0; uiLoop < Header.uiAppDataSize; uiLoop++) {
        fputc(0, pOutput);
      }
    }
  } else {
    fwrite(Image.pAppData, Header.uiAppDataSize, 1, pOutput);
  }

  fclose(pOutput);

  if (pOutputBuffer != null) {
    MemFree(pOutputBuffer);
  }
}

const COMPRESS_TRANSPARENT = 0x80;
const COMPRESS_NON_TRANSPARENT = 0x00;
const COMPRESS_RUN_LIMIT = 0x7F;

const TCI = 0x00;
const WI = 0xFF;

function ConvertToETRLE(ppDest: Pointer<Pointer<UINT8>>, puiDestLen: Pointer<UINT32>, ppSubImageBuffer: Pointer<Pointer<UINT8>>, pusNumberOfSubImages: Pointer<UINT16>, p8BPPBuffer: Pointer<UINT8>, usWidth: UINT16, usHeight: UINT16, fFlags: UINT32): BOOLEAN {
  let sCurrX: INT16;
  let sCurrY: INT16;
  let sNextX: INT16;
  let sNextY: INT16;
  let pOutputNext: Pointer<UINT8>;
  let pTemp: Pointer<UINT8>;
  let fContinue: BOOLEAN = TRUE;
  let fOk: BOOLEAN = TRUE;
  let fStore: BOOLEAN;
  let fNextExists: BOOLEAN;
  let pCurrSubImage: Pointer<STCISubImage>;
  let TempSubImage: STCISubImage;
  let uiCompressedSize: UINT32 = 0;
  let uiSubImageCompressedSize: UINT32;
  let uiSpaceLeft: UINT32;

  // worst-case situation	estimate
  uiSpaceLeft = usWidth * usHeight * 3;
  ppDest.value = MemAlloc(uiSpaceLeft);
  CHECKF(ppDest.value);
  puiDestLen.value = uiSpaceLeft;

  pOutputNext = ppDest.value;

  if (fFlags & CONVERT_ETRLE_COMPRESS_SINGLE) {
    // there are no walls in this image, but we treat it as a "subimage" for
    // the purposes of calling the compressor

    // we want a 1-element SubImage array for this...
    // allocate!
    pusNumberOfSubImages.value = 1;
    ppSubImageBuffer.value = MemAlloc(STCI_SUBIMAGE_SIZE);
    if (!(ppSubImageBuffer.value)) {
      MemFree(ppDest.value);
      return FALSE;
    }
    pCurrSubImage = ppSubImageBuffer.value;
    pCurrSubImage.value.sOffsetX = 0;
    pCurrSubImage.value.sOffsetY = 0;
    pCurrSubImage.value.usWidth = usWidth;
    pCurrSubImage.value.usHeight = usHeight;
    if (!(fFlags & CONVERT_ETRLE_NO_SUBIMAGE_SHRINKING)) {
      if (!(DetermineSubImageUsedSize(p8BPPBuffer, usWidth, usHeight, pCurrSubImage))) {
        MemFree(ppDest.value);
        return FALSE;
      }
    }
    uiSubImageCompressedSize = ETRLECompressSubImage(pOutputNext, uiSpaceLeft, p8BPPBuffer, usWidth, usHeight, pCurrSubImage);
    if (uiSubImageCompressedSize == 0) {
      MemFree(ppDest.value);
      return FALSE;
    } else {
      pCurrSubImage.value.uiDataOffset = 0;
      pCurrSubImage.value.uiDataLength = uiSubImageCompressedSize;
      puiDestLen.value = uiSubImageCompressedSize;
      return TRUE;
    }
  } else {
    // skip any initial wall bytes to find the first subimage
    if (!GoPastWall(addressof(sCurrX), addressof(sCurrY), usWidth, usHeight, p8BPPBuffer, 0, 0)) {
      // no subimages!
      MemFree(ppDest.value);
      return FALSE;
    }
    ppSubImageBuffer.value = null;
    pusNumberOfSubImages.value = 0;

    while (fContinue) {
      // allocate more memory for SubImage structures, and set the current pointer to the last one
      pTemp = MemRealloc(ppSubImageBuffer.value, (pusNumberOfSubImages.value + 1) * STCI_SUBIMAGE_SIZE);
      if (pTemp == null) {
        fOk = FALSE;
        break;
      } else {
        ppSubImageBuffer.value = pTemp;
      }
      pCurrSubImage = (ppSubImageBuffer.value + (pusNumberOfSubImages.value) * STCI_SUBIMAGE_SIZE);

      pCurrSubImage.value.sOffsetX = sCurrX;
      pCurrSubImage.value.sOffsetY = sCurrY;
      // determine the subimage's full size
      if (!DetermineSubImageSize(p8BPPBuffer, usWidth, usHeight, pCurrSubImage)) {
        fOk = FALSE;
        break;
      }
      if (pusNumberOfSubImages.value == 0 && pCurrSubImage.value.usWidth == usWidth && pCurrSubImage.value.usHeight == usHeight) {
        printf("\tWarning: no walls (subimage delimiters) found.\n");
      }

      memcpy(addressof(TempSubImage), pCurrSubImage, STCI_SUBIMAGE_SIZE);
      if (DetermineSubImageUsedSize(p8BPPBuffer, usWidth, usHeight, addressof(TempSubImage))) {
        // image has nontransparent data; we definitely want to store it
        fStore = TRUE;
        if (!(fFlags & CONVERT_ETRLE_NO_SUBIMAGE_SHRINKING)) {
          memcpy(pCurrSubImage, addressof(TempSubImage), STCI_SUBIMAGE_SIZE);
        }
      } else if (fFlags & CONVERT_ETRLE_DONT_SKIP_BLANKS) {
        // image is transparent; we will store it if there is another subimage
        // to the right of it on the same line
        // find the next subimage
        fNextExists = GoToNextSubImage(addressof(sNextX), addressof(sNextY), p8BPPBuffer, usWidth, usHeight, sCurrX, sCurrY);
        if (fNextExists && sNextY == sCurrY) {
          fStore = TRUE;
        } else {
          // junk transparent section at the end of the line!
          fStore = FALSE;
        }
      } else {
        // transparent data; discarding
        fStore = FALSE;
      }

      if (fStore) {
        // we want to store this subimage!
        uiSubImageCompressedSize = ETRLECompressSubImage(pOutputNext, uiSpaceLeft, p8BPPBuffer, usWidth, usHeight, pCurrSubImage);
        if (uiSubImageCompressedSize == 0) {
          fOk = FALSE;
          break;
        }
        pCurrSubImage.value.uiDataOffset = (puiDestLen.value - uiSpaceLeft);
        pCurrSubImage.value.uiDataLength = uiSubImageCompressedSize;
        // this is a cheap hack; the sOffsetX and sOffsetY values have been used
        // to store the location of the subimage within the whole image.  Now
        // we want the offset within the subimage, so, we subtract the coordatines
        // for the upper-left corner of the subimage.
        pCurrSubImage.value.sOffsetX -= sCurrX;
        pCurrSubImage.value.sOffsetY -= sCurrY;
        (pusNumberOfSubImages.value)++;
        pOutputNext += uiSubImageCompressedSize;
        uiSpaceLeft -= uiSubImageCompressedSize;
      }
      // find the next subimage
      fContinue = GoToNextSubImage(addressof(sCurrX), addressof(sCurrY), p8BPPBuffer, usWidth, usHeight, sCurrX, sCurrY);
    }
  }
  if (fOk) {
    puiDestLen.value -= uiSpaceLeft;
    return TRUE;
  } else {
    MemFree(ppDest.value);
    if (ppSubImageBuffer.value != null) {
      MemFree(ppSubImageBuffer.value);
    }
    return FALSE;
  }
}

function ETRLECompressSubImage(pDest: Pointer<UINT8>, uiDestLen: UINT32, p8BPPBuffer: Pointer<UINT8>, usWidth: UINT16, usHeight: UINT16, pSubImage: Pointer<STCISubImage>): UINT32 {
  let usLoop: UINT16;
  let uiScanLineCompressedSize: UINT32;
  let uiSpaceLeft: UINT32 = uiDestLen;
  let uiOffset: UINT32;
  let pCurrent: Pointer<UINT8>;

  CHECKF(DetermineOffset(addressof(uiOffset), usWidth, usHeight, pSubImage.value.sOffsetX, pSubImage.value.sOffsetY))
  pCurrent = p8BPPBuffer + uiOffset;

  for (usLoop = 0; usLoop < pSubImage.value.usHeight; usLoop++) {
    uiScanLineCompressedSize = ETRLECompress(pDest, uiSpaceLeft, pCurrent, pSubImage.value.usWidth);
    if (uiScanLineCompressedSize == 0) {
      // there wasn't enough room to complete the compression!
      return 0;
    }
    // reduce the amount of available space
    uiSpaceLeft -= uiScanLineCompressedSize;
    pDest += uiScanLineCompressedSize;
    // go to the next scanline
    pCurrent += usWidth;
  }
  return uiDestLen - uiSpaceLeft;
}

function ETRLECompress(pDest: Pointer<UINT8>, uiDestLen: UINT32, pSource: Pointer<UINT8>, uiSourceLen: UINT32): UINT32 {
  // Compress a buffer (a scanline) into ETRLE format, which is a series of runs.
                                                                                           // Each run starts with a byte whose high bit is 1 if the run is compressed, 0 otherwise.
  // The lower seven bits of that byte indicate the length of the run

  // ETRLECompress returns the number of bytes used by the compressed buffer, or 0 if an error
  // occurred

  // uiSourceLoc keeps track of our current position in the
  // source
  let uiSourceLoc: UINT32 = 0;
  // uiCurrentSourceLoc is used to look ahead in the source to
  // determine the length of runs
  let uiCurrentSourceLoc: UINT32 = 0;
  let uiDestLoc: UINT32 = 0;
  let ubLength: UINT8 = 0;

  while (uiSourceLoc < uiSourceLen && uiDestLoc < uiDestLen) {
    if (pSource[uiSourceLoc] == TCI) {
      // transparent run - determine its length
      do {
        uiCurrentSourceLoc++;
        ubLength++;
      } while ((uiCurrentSourceLoc < uiSourceLen) && pSource[uiCurrentSourceLoc] == TCI && (ubLength < COMPRESS_RUN_LIMIT));
      // output run-byte
      pDest[uiDestLoc] = ubLength | COMPRESS_TRANSPARENT;

      // update location
      uiSourceLoc += ubLength;
      uiDestLoc += 1;
    } else {
      // non-transparent run - determine its length
      do {
        uiCurrentSourceLoc++;
        ubLength++;
      } while ((uiCurrentSourceLoc < uiSourceLen) && (pSource[uiCurrentSourceLoc] != TCI) && (ubLength < COMPRESS_RUN_LIMIT));
      if (uiDestLoc + ubLength < uiDestLen) {
        // output run-byte
        pDest[uiDestLoc++] = ubLength | COMPRESS_NON_TRANSPARENT;

        // output run (and update location)
        memcpy(pDest + uiDestLoc, pSource + uiSourceLoc, ubLength);
        uiSourceLoc += ubLength;
        uiDestLoc += ubLength;
      } else {
        // not enough room in dest buffer to copy the run!
        return 0;
      }
    }
    uiCurrentSourceLoc = uiSourceLoc;
    ubLength = 0;
  }
  if (uiDestLoc >= uiDestLen) {
    return 0;
  } else {
    // end with a run of 0 length (which might as well be non-transparent,
    // giving a 0-byte
    pDest[uiDestLoc++] = 0;
    return uiDestLoc;
  }
}

function DetermineOffset(puiOffset: Pointer<UINT32>, usWidth: UINT16, usHeight: UINT16, sX: INT16, sY: INT16): BOOLEAN {
  if (sX < 0 || sY < 0) {
    return FALSE;
  }
  puiOffset.value = sY * usWidth + sX;
  if (puiOffset.value >= usWidth * usHeight) {
    return FALSE;
  }
  return TRUE;
}

function GoPastWall(psNewX: Pointer<INT16>, psNewY: Pointer<INT16>, usWidth: UINT16, usHeight: UINT16, pCurrent: Pointer<UINT8>, sCurrX: INT16, sCurrY: INT16): BOOLEAN {
  // If the current pixel is a wall, we assume that it is on a horizontal wall and
  // search right, wrapping around the end of scanlines, until we find non-wall data.
  while (pCurrent.value == WI) {
    sCurrX++;
    pCurrent++;
    if (sCurrX == usWidth) {
      // wrap our logical coordinates!
      sCurrX = 0;
      sCurrY++;
      if (sCurrY == usHeight) {
        // no more images!
        return FALSE;
      }
    }
  }

  psNewX.value = sCurrX;
  psNewY.value = sCurrY;
  return TRUE;
}

function GoToNextSubImage(psNewX: Pointer<INT16>, psNewY: Pointer<INT16>, p8BPPBuffer: Pointer<UINT8>, usWidth: UINT16, usHeight: UINT16, sOrigX: INT16, sOrigY: INT16): BOOLEAN {
  // return the coordinates of the next subimage in the image
  // (either to the right, or the first of the next row down
  let sCurrX: INT16 = sOrigX;
  let sCurrY: INT16 = sOrigY;
  let uiOffset: UINT32;
  let pCurrent: Pointer<UINT8>;
  let fFound: BOOLEAN = TRUE;

  CHECKF(DetermineOffset(addressof(uiOffset), usWidth, usHeight, sCurrX, sCurrY))
  pCurrent = p8BPPBuffer + uiOffset;

  if (pCurrent.value == WI) {
    return GoPastWall(psNewX, psNewY, usWidth, usHeight, pCurrent, sCurrX, sCurrY);
  } else {
    // The current pixel is not a wall.  We scan right past all non-wall data to skip to
    // the right-hand end of the subimage, then right past all wall data to skip a vertical
    // wall, and should find ourselves at another subimage.

    // If we hit the right edge of the image, we back up to our start point, go DOWN to
    // the bottom of the image to the horizontal wall, and then recurse to go along it
    // to the right place on the next scanline

    while (pCurrent.value != WI) {
      sCurrX++;
      pCurrent++;
      if (sCurrX == usWidth) {
        // there are no more images to the right!
        fFound = FALSE;
        break;
      }
    }
    if (sCurrX < usWidth) {
      // skip all wall data to the right, starting at the new current position
      while (pCurrent.value == WI) {
        sCurrX++;
        pCurrent++;
        if (sCurrX == usWidth) {
          // there are no more images to the right!
          fFound = FALSE;
          break;
        }
      }
    }
    if (fFound) {
      psNewX.value = sCurrX;
      psNewY.value = sCurrY;
      return TRUE;
    } else {
      // go back to the beginning of the subimage and scan down
      sCurrX = sOrigX;
      pCurrent = p8BPPBuffer + uiOffset;

      // skip all non-wall data below, starting at the current position
      while (pCurrent.value != WI) {
        sCurrY++;
        pCurrent += usWidth;
        if (sCurrY == usHeight) {
          // there are no more images!
          return FALSE;
        }
      }
      // We are now at the horizontal wall at the bottom of the current image
      return GoPastWall(psNewX, psNewY, usWidth, usHeight, pCurrent, sCurrX, sCurrY);
    }
  }
}

function DetermineSubImageSize(p8BPPBuffer: Pointer<UINT8>, usWidth: UINT16, usHeight: UINT16, pSubImage: Pointer<STCISubImage>): BOOLEAN {
  let uiOffset: UINT32;
  let pCurrent: Pointer<UINT8>;
  let sCurrX: INT16 = pSubImage.value.sOffsetX;
  let sCurrY: INT16 = pSubImage.value.sOffsetY;

  if (!DetermineOffset(addressof(uiOffset), usWidth, usHeight, sCurrX, sCurrY)) {
    return FALSE;
  }

  // determine width
  pCurrent = p8BPPBuffer + uiOffset;
  do {
    sCurrX++;
    pCurrent++;
  } while (pCurrent.value != WI && sCurrX < usWidth);
  pSubImage.value.usWidth = sCurrX - pSubImage.value.sOffsetX;

  // determine height
  pCurrent = p8BPPBuffer + uiOffset;
  do {
    sCurrY++;
    pCurrent += usWidth;
  } while (pCurrent.value != WI && sCurrY < usHeight);
  pSubImage.value.usHeight = sCurrY - pSubImage.value.sOffsetY;

  return TRUE;
}

function DetermineSubImageUsedSize(p8BPPBuffer: Pointer<UINT8>, usWidth: UINT16, usHeight: UINT16, pSubImage: Pointer<STCISubImage>): BOOLEAN {
  let sNewValue: INT16;
  // to do our search loops properly, we can't change the height and width of the
  // subimages until we're done all of our shrinks
  let usNewHeight: UINT16;
  let usNewWidth: UINT16;
  let usNewX: UINT16;
  let usNewY: UINT16;

  // shrink from the top
  if (CheckForDataInRows(addressof(sNewValue), 1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewY = sNewValue;
  } else {
    return FALSE;
  }
  // shrink from the bottom
  if (CheckForDataInRows(addressof(sNewValue), -1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewHeight = sNewValue - usNewY + 1;
  } else {
    return FALSE;
  }
  // shrink from the left
  if (CheckForDataInCols(addressof(sNewValue), 1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewX = sNewValue;
  } else {
    return FALSE;
  }
  // shrink from the right
  if (CheckForDataInCols(addressof(sNewValue), -1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewWidth = sNewValue - usNewX + 1;
  } else {
    return FALSE;
  }
  pSubImage.value.sOffsetX = usNewX;
  pSubImage.value.sOffsetY = usNewY;
  pSubImage.value.usHeight = usNewHeight;
  pSubImage.value.usWidth = usNewWidth;
  return TRUE;
}

function CheckForDataInRows(psYValue: Pointer<INT16>, sYIncrement: INT16, p8BPPBuffer: Pointer<UINT8>, usWidth: UINT16, usHeight: UINT16, pSubImage: Pointer<STCISubImage>): BOOLEAN {
  let sCurrY: INT16;
  let uiOffset: UINT32;
  let pCurrent: Pointer<UINT8>;
  let usLoop: UINT16;

  if (sYIncrement == 1) {
    sCurrY = pSubImage.value.sOffsetY;
  } else if (sYIncrement == -1) {
    sCurrY = pSubImage.value.sOffsetY + pSubImage.value.usHeight - 1;
  } else {
    // invalid value!
    return FALSE;
  }
  for (usLoop = 0; usLoop < pSubImage.value.usHeight; usLoop++) {
    if (!DetermineOffset(addressof(uiOffset), usWidth, usHeight, pSubImage.value.sOffsetX, sCurrY)) {
      return FALSE;
    }
    pCurrent = p8BPPBuffer + uiOffset;
    pCurrent = CheckForDataInRowOrColumn(pCurrent, 1, pSubImage.value.usWidth);
    if (pCurrent) {
      // non-null data found!
      psYValue.value = sCurrY;
      return TRUE;
    }
    sCurrY += sYIncrement;
  }
  return FALSE;
}

function CheckForDataInCols(psXValue: Pointer<INT16>, sXIncrement: INT16, p8BPPBuffer: Pointer<UINT8>, usWidth: UINT16, usHeight: UINT16, pSubImage: Pointer<STCISubImage>): BOOLEAN {
  let sCurrX: INT16;
  let uiOffset: UINT32;
  let pCurrent: Pointer<UINT8>;
  let usLoop: UINT16;

  if (sXIncrement == 1) {
    sCurrX = pSubImage.value.sOffsetX;
  } else if (sXIncrement == -1) {
    sCurrX = pSubImage.value.sOffsetX + pSubImage.value.usWidth - 1;
  } else {
    // invalid value!
    return FALSE;
  }
  for (usLoop = 0; usLoop < pSubImage.value.usWidth; usLoop++) {
    if (!DetermineOffset(addressof(uiOffset), usWidth, usHeight, sCurrX, pSubImage.value.sOffsetY)) {
      return FALSE;
    }
    pCurrent = p8BPPBuffer + uiOffset;
    pCurrent = CheckForDataInRowOrColumn(pCurrent, usWidth, pSubImage.value.usHeight);
    if (pCurrent) {
      // non-null data found!
      psXValue.value = sCurrX;
      return TRUE;
    }
    sCurrX += sXIncrement;
  }
  return FALSE;
}

function CheckForDataInRowOrColumn(pPixel: Pointer<UINT8>, usIncrement: UINT16, usNumberOfPixels: UINT16): Pointer<UINT8> {
  // This function, passed the right increment value, can scan either across or
  // down an image to find a non-transparent pixel

  let usLoop: UINT16;

  for (usLoop = 0; usLoop < usNumberOfPixels; usLoop++) {
    if (pPixel.value != TCI) {
      return pPixel;
    } else {
      pPixel += usIncrement;
    }
  }
  return null;
}
