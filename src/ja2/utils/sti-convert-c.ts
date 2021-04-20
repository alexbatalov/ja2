namespace ja2 {

const fs: typeof import('fs') = require('fs');

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

export function WriteSTIFile(pData: Buffer, pPalette: SGPPaletteEntry[], sWidth: INT16, sHeight: INT16, cOutputName: string /* STR */, fFlags: UINT32, uiAppDataSize: UINT32): void {
  let pOutput: number;

  let uiOriginalSize: UINT32;
  let pOutputBuffer: Buffer;
  let pOutputBuffer__Pointer = createPointer(() => pOutputBuffer, (v) => pOutputBuffer = v);
  let uiCompressedSize: UINT32;
  let uiCompressedSize__Pointer: Pointer<UINT32> = createPointer(() => uiCompressedSize, (v) => uiCompressedSize = v);

  let Header: STCIHeader = createSTCIHeader();
  let uiLoop: UINT32;
  let Image: ImageType = createImageType();

  let pSGPPaletteEntry: SGPPaletteEntry[];
  let STCIPaletteEntry: STCIPaletteElement = createSTCIPaletteElement();

  let pSubImageBuffer: STCISubImage[];
  let usNumberOfSubImages: UINT16;
  let usNumberOfSubImages__Pointer: Pointer<UINT32> = createPointer(() => usNumberOfSubImages, (v) => usNumberOfSubImages = v);
  let uiSubImageBufferSize: UINT32 = 0;
  let buffer: Buffer;

  // UINT16							usLoop;

  uiCompressedSize = 0;
  usNumberOfSubImages = 0;
  pSubImageBuffer = [];
  pOutputBuffer = Buffer.allocUnsafe(0);

  uiOriginalSize = sWidth * sHeight * (8 / 8);

  // set up STCI header for output
  Header.cID = STCI_ID_STRING;
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
    if (!ConvertToETRLE(pOutputBuffer__Pointer, uiCompressedSize__Pointer, pSubImageBuffer, usNumberOfSubImages__Pointer, pData, sWidth, sHeight, fFlags)) {
    }
    uiSubImageBufferSize = usNumberOfSubImages * STCI_SUBIMAGE_SIZE;

    Header.Indexed.usNumberOfSubImages = usNumberOfSubImages;
    Header.uiStoredSize = uiCompressedSize;
    Header.fFlags |= STCI_ETRLE_COMPRESSED;
  }

  //
  // save file
  //

  pOutput = fs.openSync(cOutputName, "w");
  if (pOutput == null) {
    return;
  }
  // write header
  buffer = Buffer.allocUnsafe(STCI_HEADER_SIZE);
  writeSTCIHeader(Header, buffer, 0);
  fs.writeSync(pOutput, buffer);
  // write palette and subimage structs, if any
  if (Header.fFlags & STCI_INDEXED) {
    if (pPalette != null) {
      // have to convert palette to STCI format!
      pSGPPaletteEntry = pPalette;
      buffer = Buffer.allocUnsafe(STCI_PALETTE_ELEMENT_SIZE);
      for (uiLoop = 0; uiLoop < 256; uiLoop++) {
        STCIPaletteEntry.ubRed = pSGPPaletteEntry[uiLoop].peRed;
        STCIPaletteEntry.ubGreen = pSGPPaletteEntry[uiLoop].peGreen;
        STCIPaletteEntry.ubBlue = pSGPPaletteEntry[uiLoop].peBlue;
        writeSTCIPaletteElement(STCIPaletteEntry, buffer);
        fs.writeSync(pOutput, buffer);
      }
    }
    if (Header.fFlags & STCI_ETRLE_COMPRESSED) {
      buffer = Buffer.allocUnsafe(pSubImageBuffer.length * STCI_SUBIMAGE_SIZE);
      writeObjectArray(pSubImageBuffer, buffer, 0, writeSTCISubImage);
      fs.writeSync(pOutput, pSubImageBuffer);
    }
  }

  // write file data
  if (Header.fFlags & STCI_ZLIB_COMPRESSED || Header.fFlags & STCI_ETRLE_COMPRESSED) {
    fs.writeSync(pOutput, pOutputBuffer);
  } else {
    fs.writeSync(pOutput, Image.pImageData);
  }

  // write app-specific data (blanked to 0)
  if (Image.pAppData == null) {
    if (Header.uiAppDataSize > 0) {
      buffer = Buffer.allocUnsafe(Header.uiAppDataSize);
      buffer.fill(0);
      fs.writeSync(pOutput, buffer);
    }
  } else {
    fs.writeSync(pOutput, Image.pAppData);
  }

  fs.closeSync(pOutput);
}

const COMPRESS_TRANSPARENT = 0x80;
const COMPRESS_NON_TRANSPARENT = 0x00;
const COMPRESS_RUN_LIMIT = 0x7F;

const TCI = 0x00;
const WI = 0xFF;

function ConvertToETRLE(ppDest: Pointer<Buffer>, puiDestLen: Pointer<UINT32>, ppSubImageBuffer: STCISubImage[], pusNumberOfSubImages: Pointer<UINT16>, p8BPPBuffer: Buffer, usWidth: UINT16, usHeight: UINT16, fFlags: UINT32): boolean {
  let sCurrX: INT16;
  let sCurrX__Pointer: Pointer<INT16> = createPointer(() => sCurrX, (v) => sCurrX = v);
  let sCurrY: INT16;
  let sCurrY__Pointer: Pointer<INT16> = createPointer(() => sCurrY, (v) => sCurrY = v);
  let sNextX: INT16;
  let sNextX__Pointer: Pointer<INT16> = createPointer(() => sNextX, (v) => sNextX = v);
  let sNextY: INT16;
  let sNextY__Pointer: Pointer<INT16> = createPointer(() => sNextY, (v) => sNextY = v);
  let pOutputNext: Buffer;
  let pTemp: Pointer<UINT8>;
  let fContinue: boolean = true;
  let fOk: boolean = true;
  let fStore: boolean;
  let fNextExists: boolean;
  let pCurrSubImage: STCISubImage;
  let TempSubImage: STCISubImage = createSTCISubImage();
  let uiCompressedSize: UINT32 = 0;
  let uiSubImageCompressedSize: UINT32;
  let uiSpaceLeft: UINT32;

  sCurrX = 0;
  sCurrY = 0;
  sNextX = 0;
  sNextY = 0;

  // worst-case situation	estimate
  uiSpaceLeft = usWidth * usHeight * 3;
  ppDest.value = Buffer.allocUnsafe(uiSpaceLeft);
  if (!ppDest.value) {
    return false;
  }
  puiDestLen.value = uiSpaceLeft;

  pOutputNext = ppDest.value;

  if (fFlags & CONVERT_ETRLE_COMPRESS_SINGLE) {
    // there are no walls in this image, but we treat it as a "subimage" for
    // the purposes of calling the compressor

    // we want a 1-element SubImage array for this...
    // allocate!
    pusNumberOfSubImages.value = 1;
    ppSubImageBuffer.push(createSTCISubImage());

    pCurrSubImage = ppSubImageBuffer[0];
    pCurrSubImage.sOffsetX = 0;
    pCurrSubImage.sOffsetY = 0;
    pCurrSubImage.usWidth = usWidth;
    pCurrSubImage.usHeight = usHeight;
    if (!(fFlags & CONVERT_ETRLE_NO_SUBIMAGE_SHRINKING)) {
      if (!(DetermineSubImageUsedSize(p8BPPBuffer, usWidth, usHeight, pCurrSubImage))) {
        return false;
      }
    }
    uiSubImageCompressedSize = ETRLECompressSubImage(pOutputNext, uiSpaceLeft, p8BPPBuffer, usWidth, usHeight, pCurrSubImage);
    if (uiSubImageCompressedSize == 0) {
      return false;
    } else {
      pCurrSubImage.uiDataOffset = 0;
      pCurrSubImage.uiDataLength = uiSubImageCompressedSize;
      puiDestLen.value = uiSubImageCompressedSize;
      return true;
    }
  } else {
    // skip any initial wall bytes to find the first subimage
    if (!GoPastWall(sCurrX__Pointer, sCurrY__Pointer, usWidth, usHeight, p8BPPBuffer, 0, 0)) {
      // no subimages!
      return false;
    }
    ppSubImageBuffer.length = 0;
    pusNumberOfSubImages.value = 0;

    while (fContinue) {
      // allocate more memory for SubImage structures, and set the current pointer to the last one
      pCurrSubImage = createSTCISubImage();
      ppSubImageBuffer.push(pCurrSubImage);

      pCurrSubImage.sOffsetX = sCurrX;
      pCurrSubImage.sOffsetY = sCurrY;
      // determine the subimage's full size
      if (!DetermineSubImageSize(p8BPPBuffer, usWidth, usHeight, pCurrSubImage)) {
        fOk = false;
        break;
      }
      if (pusNumberOfSubImages.value == 0 && pCurrSubImage.usWidth == usWidth && pCurrSubImage.usHeight == usHeight) {
        console.log("\tWarning: no walls (subimage delimiters) found.\n");
      }

      copySTCISubImage(TempSubImage, pCurrSubImage);
      if (DetermineSubImageUsedSize(p8BPPBuffer, usWidth, usHeight, TempSubImage)) {
        // image has nontransparent data; we definitely want to store it
        fStore = true;
        if (!(fFlags & CONVERT_ETRLE_NO_SUBIMAGE_SHRINKING)) {
          copySTCISubImage(pCurrSubImage, TempSubImage);
        }
      } else if (fFlags & CONVERT_ETRLE_DONT_SKIP_BLANKS) {
        // image is transparent; we will store it if there is another subimage
        // to the right of it on the same line
        // find the next subimage
        fNextExists = GoToNextSubImage(sNextX__Pointer, sNextY__Pointer, p8BPPBuffer, usWidth, usHeight, sCurrX, sCurrY);
        if (fNextExists && sNextY == sCurrY) {
          fStore = true;
        } else {
          // junk transparent section at the end of the line!
          fStore = false;
        }
      } else {
        // transparent data; discarding
        fStore = false;
      }

      if (fStore) {
        // we want to store this subimage!
        uiSubImageCompressedSize = ETRLECompressSubImage(pOutputNext, uiSpaceLeft, p8BPPBuffer, usWidth, usHeight, pCurrSubImage);
        if (uiSubImageCompressedSize == 0) {
          fOk = false;
          break;
        }
        pCurrSubImage.uiDataOffset = (puiDestLen.value - uiSpaceLeft);
        pCurrSubImage.uiDataLength = uiSubImageCompressedSize;
        // this is a cheap hack; the sOffsetX and sOffsetY values have been used
        // to store the location of the subimage within the whole image.  Now
        // we want the offset within the subimage, so, we subtract the coordatines
        // for the upper-left corner of the subimage.
        pCurrSubImage.sOffsetX -= sCurrX;
        pCurrSubImage.sOffsetY -= sCurrY;
        (pusNumberOfSubImages.value)++;
        pOutputNext = pOutputNext.subarray(uiSubImageCompressedSize);
        uiSpaceLeft -= uiSubImageCompressedSize;
      }
      // find the next subimage
      fContinue = GoToNextSubImage(sCurrX__Pointer, sCurrY__Pointer, p8BPPBuffer, usWidth, usHeight, sCurrX, sCurrY);
    }
  }
  if (fOk) {
    puiDestLen.value -= uiSpaceLeft;
    return true;
  } else {
    return false;
  }
}

function ETRLECompressSubImage(pDest: Buffer, uiDestLen: UINT32, p8BPPBuffer: Buffer, usWidth: UINT16, usHeight: UINT16, pSubImage: STCISubImage): UINT32 {
  let usLoop: UINT16;
  let uiScanLineCompressedSize: UINT32;
  let uiSpaceLeft: UINT32 = uiDestLen;
  let uiOffset: UINT32;
  let uiOffset__Pointer: Pointer<UINT32> = createPointer(() => uiOffset, (v) => uiOffset = uiOffset);
  let pCurrent: number;

  uiOffset = 0;

  if (!DetermineOffset(uiOffset__Pointer, usWidth, usHeight, pSubImage.sOffsetX, pSubImage.sOffsetY)) {
    return 0;
  }  pCurrent = uiOffset;

  for (usLoop = 0; usLoop < pSubImage.usHeight; usLoop++) {
    uiScanLineCompressedSize = ETRLECompress(pDest, uiSpaceLeft, p8BPPBuffer.subarray(pCurrent), pSubImage.usWidth);
    if (uiScanLineCompressedSize == 0) {
      // there wasn't enough room to complete the compression!
      return 0;
    }
    // reduce the amount of available space
    uiSpaceLeft -= uiScanLineCompressedSize;
    pDest = pDest.subarray(uiScanLineCompressedSize);
    // go to the next scanline
    pCurrent += usWidth;
  }
  return uiDestLen - uiSpaceLeft;
}

function ETRLECompress(pDest: Buffer, uiDestLen: UINT32, pSource: Buffer, uiSourceLen: UINT32): UINT32 {
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
        pSource.copy(pDest, uiDestLoc, uiSourceLoc, ubLength);
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

function DetermineOffset(puiOffset: Pointer<UINT32>, usWidth: UINT16, usHeight: UINT16, sX: INT16, sY: INT16): boolean {
  if (sX < 0 || sY < 0) {
    return false;
  }
  puiOffset.value = sY * usWidth + sX;
  if (puiOffset.value >= usWidth * usHeight) {
    return false;
  }
  return true;
}

function GoPastWall(psNewX: Pointer<INT16>, psNewY: Pointer<INT16>, usWidth: UINT16, usHeight: UINT16, pCurrent: Buffer, sCurrX: INT16, sCurrY: INT16): boolean {
  let i: number = 0;

  // If the current pixel is a wall, we assume that it is on a horizontal wall and
  // search right, wrapping around the end of scanlines, until we find non-wall data.
  while (pCurrent[i] == WI) {
    sCurrX++;
    i++;
    if (sCurrX == usWidth) {
      // wrap our logical coordinates!
      sCurrX = 0;
      sCurrY++;
      if (sCurrY == usHeight) {
        // no more images!
        return false;
      }
    }
  }

  psNewX.value = sCurrX;
  psNewY.value = sCurrY;
  return true;
}

function GoToNextSubImage(psNewX: Pointer<INT16>, psNewY: Pointer<INT16>, p8BPPBuffer: Buffer, usWidth: UINT16, usHeight: UINT16, sOrigX: INT16, sOrigY: INT16): boolean {
  // return the coordinates of the next subimage in the image
  // (either to the right, or the first of the next row down
  let sCurrX: INT16 = sOrigX;
  let sCurrY: INT16 = sOrigY;
  let uiOffset: UINT32;
  let uiOffset__Pointer: Pointer<UINT32> = createPointer(() => uiOffset, (v) => uiOffset = v);
  let pCurrent: number;
  let fFound: boolean = true;

  uiOffset = 0;

  if (!DetermineOffset(uiOffset__Pointer, usWidth, usHeight, sCurrX, sCurrY)) {
    return false;
  }  pCurrent = p8BPPBuffer[uiOffset];

  if (pCurrent == WI) {
    return GoPastWall(psNewX, psNewY, usWidth, usHeight, p8BPPBuffer.subarray(pCurrent), sCurrX, sCurrY);
  } else {
    // The current pixel is not a wall.  We scan right past all non-wall data to skip to
    // the right-hand end of the subimage, then right past all wall data to skip a vertical
    // wall, and should find ourselves at another subimage.

    // If we hit the right edge of the image, we back up to our start point, go DOWN to
    // the bottom of the image to the horizontal wall, and then recurse to go along it
    // to the right place on the next scanline

    while (p8BPPBuffer[pCurrent] != WI) {
      sCurrX++;
      pCurrent++;
      if (sCurrX == usWidth) {
        // there are no more images to the right!
        fFound = false;
        break;
      }
    }
    if (sCurrX < usWidth) {
      // skip all wall data to the right, starting at the new current position
      while (p8BPPBuffer[pCurrent] == WI) {
        sCurrX++;
        pCurrent++;
        if (sCurrX == usWidth) {
          // there are no more images to the right!
          fFound = false;
          break;
        }
      }
    }
    if (fFound) {
      psNewX.value = sCurrX;
      psNewY.value = sCurrY;
      return true;
    } else {
      // go back to the beginning of the subimage and scan down
      sCurrX = sOrigX;
      pCurrent = p8BPPBuffer[uiOffset];

      // skip all non-wall data below, starting at the current position
      while (p8BPPBuffer[pCurrent] != WI) {
        sCurrY++;
        pCurrent += usWidth;
        if (sCurrY == usHeight) {
          // there are no more images!
          return false;
        }
      }
      // We are now at the horizontal wall at the bottom of the current image
      return GoPastWall(psNewX, psNewY, usWidth, usHeight, p8BPPBuffer.subarray(pCurrent), sCurrX, sCurrY);
    }
  }
}

function DetermineSubImageSize(p8BPPBuffer: Buffer, usWidth: UINT16, usHeight: UINT16, pSubImage: STCISubImage): boolean {
  let uiOffset: UINT32;
  let uiOffset__Pointer: Pointer<UINT32> = createPointer(() => uiOffset, (v) => uiOffset = v);
  let pCurrent: number;
  let sCurrX: INT16 = pSubImage.sOffsetX;
  let sCurrY: INT16 = pSubImage.sOffsetY;

  uiOffset = 0;

  if (!DetermineOffset(uiOffset__Pointer, usWidth, usHeight, sCurrX, sCurrY)) {
    return false;
  }

  // determine width
  pCurrent = p8BPPBuffer[uiOffset];
  do {
    sCurrX++;
    pCurrent++;
  } while (p8BPPBuffer[pCurrent] != WI && sCurrX < usWidth);
  pSubImage.usWidth = sCurrX - pSubImage.sOffsetX;

  // determine height
  pCurrent = p8BPPBuffer[uiOffset];
  do {
    sCurrY++;
    pCurrent += usWidth;
  } while (p8BPPBuffer[pCurrent] != WI && sCurrY < usHeight);
  pSubImage.usHeight = sCurrY - pSubImage.sOffsetY;

  return true;
}

function DetermineSubImageUsedSize(p8BPPBuffer: Buffer, usWidth: UINT16, usHeight: UINT16, pSubImage: STCISubImage): boolean {
  let sNewValue: INT16;
  let sNewValue__Pointer: Pointer<INT16> = createPointer(() => sNewValue, (v) => sNewValue = v);
  // to do our search loops properly, we can't change the height and width of the
  // subimages until we're done all of our shrinks
  let usNewHeight: UINT16;
  let usNewWidth: UINT16;
  let usNewX: UINT16;
  let usNewY: UINT16;

  sNewValue = 0;

  // shrink from the top
  if (CheckForDataInRows(sNewValue__Pointer, 1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewY = sNewValue;
  } else {
    return false;
  }
  // shrink from the bottom
  if (CheckForDataInRows(sNewValue__Pointer, -1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewHeight = sNewValue - usNewY + 1;
  } else {
    return false;
  }
  // shrink from the left
  if (CheckForDataInCols(sNewValue__Pointer, 1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewX = sNewValue;
  } else {
    return false;
  }
  // shrink from the right
  if (CheckForDataInCols(sNewValue__Pointer, -1, p8BPPBuffer, usWidth, usHeight, pSubImage)) {
    usNewWidth = sNewValue - usNewX + 1;
  } else {
    return false;
  }
  pSubImage.sOffsetX = usNewX;
  pSubImage.sOffsetY = usNewY;
  pSubImage.usHeight = usNewHeight;
  pSubImage.usWidth = usNewWidth;
  return true;
}

function CheckForDataInRows(psYValue: Pointer<INT16>, sYIncrement: INT16, p8BPPBuffer: Buffer, usWidth: UINT16, usHeight: UINT16, pSubImage: STCISubImage): boolean {
  let sCurrY: INT16;
  let uiOffset: UINT32;
  let uiOffset__Pointer: Pointer<UINT32> = createPointer(() => uiOffset, (v) => uiOffset = v);
  let pCurrent: Buffer | null;
  let usLoop: UINT16;

  uiOffset = 0;

  if (sYIncrement == 1) {
    sCurrY = pSubImage.sOffsetY;
  } else if (sYIncrement == -1) {
    sCurrY = pSubImage.sOffsetY + pSubImage.usHeight - 1;
  } else {
    // invalid value!
    return false;
  }
  for (usLoop = 0; usLoop < pSubImage.usHeight; usLoop++) {
    if (!DetermineOffset(uiOffset__Pointer, usWidth, usHeight, pSubImage.sOffsetX, sCurrY)) {
      return false;
    }
    pCurrent = p8BPPBuffer.subarray(uiOffset);
    pCurrent = CheckForDataInRowOrColumn(pCurrent, 1, pSubImage.usWidth);
    if (pCurrent) {
      // non-null data found!
      psYValue.value = sCurrY;
      return true;
    }
    sCurrY += sYIncrement;
  }
  return false;
}

function CheckForDataInCols(psXValue: Pointer<INT16>, sXIncrement: INT16, p8BPPBuffer: Buffer, usWidth: UINT16, usHeight: UINT16, pSubImage: STCISubImage): boolean {
  let sCurrX: INT16;
  let uiOffset: UINT32;
  let uiOffset__Pointer: Pointer<UINT32> = createPointer(() => uiOffset, (v) => uiOffset = v);
  let pCurrent: Buffer | null;
  let usLoop: UINT16;

  uiOffset = 0;

  if (sXIncrement == 1) {
    sCurrX = pSubImage.sOffsetX;
  } else if (sXIncrement == -1) {
    sCurrX = pSubImage.sOffsetX + pSubImage.usWidth - 1;
  } else {
    // invalid value!
    return false;
  }
  for (usLoop = 0; usLoop < pSubImage.usWidth; usLoop++) {
    if (!DetermineOffset(uiOffset__Pointer, usWidth, usHeight, sCurrX, pSubImage.sOffsetY)) {
      return false;
    }
    pCurrent = p8BPPBuffer.subarray(uiOffset);
    pCurrent = CheckForDataInRowOrColumn(pCurrent, usWidth, pSubImage.usHeight);
    if (pCurrent) {
      // non-null data found!
      psXValue.value = sCurrX;
      return true;
    }
    sCurrX += sXIncrement;
  }
  return false;
}

function CheckForDataInRowOrColumn(pPixel: Buffer, usIncrement: UINT16, usNumberOfPixels: UINT16): Buffer | null {
  // This function, passed the right increment value, can scan either across or
  // down an image to find a non-transparent pixel

  let usLoop: UINT16;
  let i: number = 0;

  for (usLoop = 0; usLoop < usNumberOfPixels; usLoop++) {
    if (pPixel[i] != TCI) {
      return pPixel.subarray(i);
    } else {
      i += usIncrement;
    }
  }
  return null;
}

}
