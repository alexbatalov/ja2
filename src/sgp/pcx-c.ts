namespace ja2 {

// Local typedefs

const PCX_NORMAL = 1;
const PCX_RLE = 2;
const PCX_256COLOR = 4;
const PCX_TRANSPARENT = 8;
const PCX_CLIPPED = 16;
const PCX_REALIZEPALETTE = 32;
const PCX_X_CLIPPING = 64;
const PCX_Y_CLIPPING = 128;
const PCX_NOTLOADED = 256;

const PCX_ERROROPENING = 1;
const PCX_INVALIDFORMAT = 2;
const PCX_INVALIDLEN = 4;
const PCX_OUTOFMEMORY = 8;

export function LoadPCXFileToImage(hImage: HIMAGE, fContents: UINT16): boolean {
  let pPcxObject: Pointer<PcxObject>;

  // First Load a PCX Image
  pPcxObject = LoadPcx(hImage.value.ImageFile);

  if (pPcxObject == null) {
    return false;
  }

  // Set some header information
  hImage.value.usWidth = pPcxObject.value.usWidth;
  hImage.value.usHeight = pPcxObject.value.usHeight;
  hImage.value.ubBitDepth = 8;
  hImage.value.fFlags = hImage.value.fFlags | fContents;

  // Read and allocate bitmap block if requested
  if (fContents & IMAGE_BITMAPDATA) {
    // Allocate memory for buffer
    hImage.value.p8BPPData = MemAlloc(hImage.value.usWidth * hImage.value.usHeight);

    if (!BlitPcxToBuffer(pPcxObject, hImage.value.p8BPPData, hImage.value.usWidth, hImage.value.usHeight, 0, 0, false)) {
      MemFree(hImage.value.p8BPPData);
      return false;
    }
  }

  if (fContents & IMAGE_PALETTE) {
    SetPcxPalette(pPcxObject, hImage);

    // Create 16 BPP palette if flags and BPP justify
    hImage.value.pui16BPPPalette = Create16BPPPalette(hImage.value.pPalette);
  }

  // Free and remove pcx object
  MemFree(pPcxObject.value.pPcxBuffer);
  MemFree(pPcxObject);

  return true;
}

function LoadPcx(pFilename: Pointer<UINT8>): Pointer<PcxObject> {
  let Header: PcxHeader;
  let pCurrentPcxObject: Pointer<PcxObject>;
  let hFileHandle: HWFILE;
  let uiFileSize: UINT32;
  let pPcxBuffer: Pointer<UINT8>;

  // Open and read in the file
  if ((hFileHandle = FileOpen(pFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false)) == 0) {
    // damn we failed to open the file
    return null;
  }

  uiFileSize = FileGetSize(hFileHandle);
  if (uiFileSize == 0) {
    // we failed to size up the file
    return null;
  }

  // Create enw pCX object
  pCurrentPcxObject = MemAlloc(sizeof(PcxObject));

  if (pCurrentPcxObject == null) {
    return null;
  }

  pCurrentPcxObject.value.pPcxBuffer = MemAlloc(uiFileSize - (sizeof(PcxHeader) + 768));

  if (pCurrentPcxObject.value.pPcxBuffer == null) {
    return null;
  }

  // Ok we now have a file handle, so let's read in the data
  FileRead(hFileHandle, addressof(Header), sizeof(PcxHeader), null);
  if ((Header.ubManufacturer != 10) || (Header.ubEncoding != 1)) {
    // We have an invalid pcx format
    // Delete the object
    MemFree(pCurrentPcxObject.value.pPcxBuffer);
    MemFree(pCurrentPcxObject);
    return null;
  }

  if (Header.ubBitsPerPixel == 8) {
    pCurrentPcxObject.value.usPcxFlags = PCX_256COLOR;
  } else {
    pCurrentPcxObject.value.usPcxFlags = 0;
  }

  pCurrentPcxObject.value.usWidth = 1 + (Header.usRight - Header.usLeft);
  pCurrentPcxObject.value.usHeight = 1 + (Header.usBottom - Header.usTop);
  pCurrentPcxObject.value.uiBufferSize = uiFileSize - 768 - sizeof(PcxHeader);

  // We are ready to read in the pcx buffer data. Therefore we must lock the buffer
  pPcxBuffer = pCurrentPcxObject.value.pPcxBuffer;

  FileRead(hFileHandle, pPcxBuffer, pCurrentPcxObject.value.uiBufferSize, null);

  // Read in the palette
  FileRead(hFileHandle, addressof(pCurrentPcxObject.value.ubPalette[0]), 768, null);

  // Close file
  FileClose(hFileHandle);

  return pCurrentPcxObject;
}

function BlitPcxToBuffer(pCurrentPcxObject: Pointer<PcxObject>, pBuffer: Pointer<UINT8>, usBufferWidth: UINT16, usBufferHeight: UINT16, usX: UINT16, usY: UINT16, fTransp: boolean): boolean {
  let pPcxBuffer: Pointer<UINT8>;
  let ubRepCount: UINT8;
  let usMaxX: UINT16;
  let usMaxY: UINT16;
  let uiImageSize: UINT32;
  let ubCurrentByte: UINT8 = 0;
  let ubMode: UINT8;
  let usCurrentX: UINT16;
  let usCurrentY: UINT16;
  let uiOffset: UINT32;
  let uiIndex: UINT32;
  let uiNextLineOffset: UINT32;
  let uiStartOffset: UINT32;
  let uiCurrentOffset: UINT32;

  pPcxBuffer = pCurrentPcxObject.value.pPcxBuffer;

  if (((pCurrentPcxObject.value.usWidth + usX) == usBufferWidth) && ((pCurrentPcxObject.value.usHeight + usY) == usBufferHeight)) {
    // Pre-compute PCX blitting aspects.
    uiImageSize = usBufferWidth * usBufferHeight;
    ubMode = PCX_NORMAL;
    uiOffset = 0;
    ubRepCount = 0;

    // Blit Pcx object. Two main cases, one for transparency (0's are skipped and for without transparency.
    if (fTransp == true) {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = (pPcxBuffer + uiOffset++).value;
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = (pPcxBuffer + uiOffset++).value;
            if (--ubRepCount > 0) {
              ubMode = PCX_RLE;
            }
          }
        } else {
          if (--ubRepCount == 0) {
            ubMode = PCX_NORMAL;
          }
        }
        if (ubCurrentByte != 0) {
          (pBuffer + uiIndex).value = ubCurrentByte;
        }
      }
    } else {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = (pPcxBuffer + uiOffset++).value;
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = (pPcxBuffer + uiOffset++).value;
            if (--ubRepCount > 0) {
              ubMode = PCX_RLE;
            }
          }
        } else {
          if (--ubRepCount == 0) {
            ubMode = PCX_NORMAL;
          }
        }
        (pBuffer + uiIndex).value = ubCurrentByte;
      }
    }
  } else {
    // Pre-compute PCX blitting aspects.
    if ((pCurrentPcxObject.value.usWidth + usX) >= usBufferWidth) {
      pCurrentPcxObject.value.usPcxFlags |= PCX_X_CLIPPING;
      usMaxX = usBufferWidth - 1;
    } else {
      usMaxX = pCurrentPcxObject.value.usWidth + usX;
    }

    if ((pCurrentPcxObject.value.usHeight + usY) >= usBufferHeight) {
      pCurrentPcxObject.value.usPcxFlags |= PCX_Y_CLIPPING;
      uiImageSize = pCurrentPcxObject.value.usWidth * (usBufferHeight - usY);
      usMaxY = usBufferHeight - 1;
    } else {
      uiImageSize = pCurrentPcxObject.value.usWidth * pCurrentPcxObject.value.usHeight;
      usMaxY = pCurrentPcxObject.value.usHeight + usY;
    }

    ubMode = PCX_NORMAL;
    uiOffset = 0;
    ubRepCount = 0;
    usCurrentX = usX;
    usCurrentY = usY;

    // Blit Pcx object. Two main cases, one for transparency (0's are skipped and for without transparency.
    if (fTransp == true) {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = (pPcxBuffer + uiOffset++).value;
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = (pPcxBuffer + uiOffset++).value;
            if (--ubRepCount > 0) {
              ubMode = PCX_RLE;
            }
          }
        } else {
          if (--ubRepCount == 0) {
            ubMode = PCX_NORMAL;
          }
        }
        if (ubCurrentByte != 0) {
          (pBuffer + (usCurrentY * usBufferWidth) + usCurrentX).value = ubCurrentByte;
        }
        usCurrentX++;
        if (usCurrentX > usMaxX) {
          usCurrentX = usX;
          usCurrentY++;
        }
      }
    } else {
      uiStartOffset = (usCurrentY * usBufferWidth) + usCurrentX;
      uiNextLineOffset = uiStartOffset + usBufferWidth;
      uiCurrentOffset = uiStartOffset;

      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = (pPcxBuffer + uiOffset++).value;
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = (pPcxBuffer + uiOffset++).value;
            if (--ubRepCount > 0) {
              ubMode = PCX_RLE;
            }
          }
        } else {
          if (--ubRepCount == 0) {
            ubMode = PCX_NORMAL;
          }
        }

        if (usCurrentX < usMaxX) {
          // We are within the visible bounds so we write the byte to buffer
          (pBuffer + uiCurrentOffset).value = ubCurrentByte;
          uiCurrentOffset++;
          usCurrentX++;
        } else {
          if ((uiCurrentOffset + 1) < uiNextLineOffset) {
            // Increment the uiCurrentOffset
            uiCurrentOffset++;
          } else {
            // Go to next line
            usCurrentX = usX;
            usCurrentY++;
            if (usCurrentY > usMaxY) {
              break;
            }
            uiStartOffset = (usCurrentY * usBufferWidth) + usCurrentX;
            uiNextLineOffset = uiStartOffset + usBufferWidth;
            uiCurrentOffset = uiStartOffset;
          }
        }
      }
    }
  }

  return true;
}

function SetPcxPalette(pCurrentPcxObject: Pointer<PcxObject>, hImage: HIMAGE): boolean {
  let Index: UINT16;
  let pubPalette: Pointer<UINT8>;

  pubPalette = addressof(pCurrentPcxObject.value.ubPalette[0]);

  // Allocate memory for palette
  hImage.value.pPalette = MemAlloc(sizeof(SGPPaletteEntry) * 256);

  if (hImage.value.pPalette == null) {
    return false;
  }

  // Initialize the proper palette entries
  for (Index = 0; Index < 256; Index++) {
    hImage.value.pPalette[Index].peRed = (pubPalette + (Index * 3)).value;
    hImage.value.pPalette[Index].peGreen = (pubPalette + (Index * 3) + 1).value;
    hImage.value.pPalette[Index].peBlue = (pubPalette + (Index * 3) + 2).value;
    hImage.value.pPalette[Index].peFlags = 0;
  }

  return true;
}

}
