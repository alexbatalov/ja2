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

function LoadPCXFileToImage(hImage: HIMAGE, fContents: UINT16): BOOLEAN {
  let pPcxObject: Pointer<PcxObject>;

  // First Load a PCX Image
  pPcxObject = LoadPcx(hImage->ImageFile);

  if (pPcxObject == NULL) {
    return FALSE;
  }

  // Set some header information
  hImage->usWidth = pPcxObject->usWidth;
  hImage->usHeight = pPcxObject->usHeight;
  hImage->ubBitDepth = 8;
  hImage->fFlags = hImage->fFlags | fContents;

  // Read and allocate bitmap block if requested
  if (fContents & IMAGE_BITMAPDATA) {
    // Allocate memory for buffer
    hImage->p8BPPData = MemAlloc(hImage->usWidth * hImage->usHeight);

    if (!BlitPcxToBuffer(pPcxObject, hImage->p8BPPData, hImage->usWidth, hImage->usHeight, 0, 0, FALSE)) {
      MemFree(hImage->p8BPPData);
      return FALSE;
    }
  }

  if (fContents & IMAGE_PALETTE) {
    SetPcxPalette(pPcxObject, hImage);

    // Create 16 BPP palette if flags and BPP justify
    hImage->pui16BPPPalette = Create16BPPPalette(hImage->pPalette);
  }

  // Free and remove pcx object
  MemFree(pPcxObject->pPcxBuffer);
  MemFree(pPcxObject);

  return TRUE;
}

function LoadPcx(pFilename: Pointer<UINT8>): Pointer<PcxObject> {
  let Header: PcxHeader;
  let pCurrentPcxObject: Pointer<PcxObject>;
  let hFileHandle: HWFILE;
  let uiFileSize: UINT32;
  let pPcxBuffer: Pointer<UINT8>;

  // Open and read in the file
  if ((hFileHandle = FileOpen(pFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE)) == 0) {
    // damn we failed to open the file
    return NULL;
  }

  uiFileSize = FileGetSize(hFileHandle);
  if (uiFileSize == 0) {
    // we failed to size up the file
    return NULL;
  }

  // Create enw pCX object
  pCurrentPcxObject = MemAlloc(sizeof(PcxObject));

  if (pCurrentPcxObject == NULL) {
    return NULL;
  }

  pCurrentPcxObject->pPcxBuffer = MemAlloc(uiFileSize - (sizeof(PcxHeader) + 768));

  if (pCurrentPcxObject->pPcxBuffer == NULL) {
    return NULL;
  }

  // Ok we now have a file handle, so let's read in the data
  FileRead(hFileHandle, &Header, sizeof(PcxHeader), NULL);
  if ((Header.ubManufacturer != 10) || (Header.ubEncoding != 1)) {
    // We have an invalid pcx format
    // Delete the object
    MemFree(pCurrentPcxObject->pPcxBuffer);
    MemFree(pCurrentPcxObject);
    return NULL;
  }

  if (Header.ubBitsPerPixel == 8) {
    pCurrentPcxObject->usPcxFlags = PCX_256COLOR;
  } else {
    pCurrentPcxObject->usPcxFlags = 0;
  }

  pCurrentPcxObject->usWidth = 1 + (Header.usRight - Header.usLeft);
  pCurrentPcxObject->usHeight = 1 + (Header.usBottom - Header.usTop);
  pCurrentPcxObject->uiBufferSize = uiFileSize - 768 - sizeof(PcxHeader);

  // We are ready to read in the pcx buffer data. Therefore we must lock the buffer
  pPcxBuffer = pCurrentPcxObject->pPcxBuffer;

  FileRead(hFileHandle, pPcxBuffer, pCurrentPcxObject->uiBufferSize, NULL);

  // Read in the palette
  FileRead(hFileHandle, &(pCurrentPcxObject->ubPalette[0]), 768, NULL);

  // Close file
  FileClose(hFileHandle);

  return pCurrentPcxObject;
}

function BlitPcxToBuffer(pCurrentPcxObject: Pointer<PcxObject>, pBuffer: Pointer<UINT8>, usBufferWidth: UINT16, usBufferHeight: UINT16, usX: UINT16, usY: UINT16, fTransp: BOOLEAN): BOOLEAN {
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

  pPcxBuffer = pCurrentPcxObject->pPcxBuffer;

  if (((pCurrentPcxObject->usWidth + usX) == usBufferWidth) && ((pCurrentPcxObject->usHeight + usY) == usBufferHeight)) {
    // Pre-compute PCX blitting aspects.
    uiImageSize = usBufferWidth * usBufferHeight;
    ubMode = PCX_NORMAL;
    uiOffset = 0;
    ubRepCount = 0;

    // Blit Pcx object. Two main cases, one for transparency (0's are skipped and for without transparency.
    if (fTransp == TRUE) {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = *(pPcxBuffer + uiOffset++);
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = *(pPcxBuffer + uiOffset++);
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
          *(pBuffer + uiIndex) = ubCurrentByte;
        }
      }
    } else {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = *(pPcxBuffer + uiOffset++);
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = *(pPcxBuffer + uiOffset++);
            if (--ubRepCount > 0) {
              ubMode = PCX_RLE;
            }
          }
        } else {
          if (--ubRepCount == 0) {
            ubMode = PCX_NORMAL;
          }
        }
        *(pBuffer + uiIndex) = ubCurrentByte;
      }
    }
  } else {
    // Pre-compute PCX blitting aspects.
    if ((pCurrentPcxObject->usWidth + usX) >= usBufferWidth) {
      pCurrentPcxObject->usPcxFlags |= PCX_X_CLIPPING;
      usMaxX = usBufferWidth - 1;
    } else {
      usMaxX = pCurrentPcxObject->usWidth + usX;
    }

    if ((pCurrentPcxObject->usHeight + usY) >= usBufferHeight) {
      pCurrentPcxObject->usPcxFlags |= PCX_Y_CLIPPING;
      uiImageSize = pCurrentPcxObject->usWidth * (usBufferHeight - usY);
      usMaxY = usBufferHeight - 1;
    } else {
      uiImageSize = pCurrentPcxObject->usWidth * pCurrentPcxObject->usHeight;
      usMaxY = pCurrentPcxObject->usHeight + usY;
    }

    ubMode = PCX_NORMAL;
    uiOffset = 0;
    ubRepCount = 0;
    usCurrentX = usX;
    usCurrentY = usY;

    // Blit Pcx object. Two main cases, one for transparency (0's are skipped and for without transparency.
    if (fTransp == TRUE) {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = *(pPcxBuffer + uiOffset++);
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = *(pPcxBuffer + uiOffset++);
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
          *(pBuffer + (usCurrentY * usBufferWidth) + usCurrentX) = ubCurrentByte;
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
          ubCurrentByte = *(pPcxBuffer + uiOffset++);
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = *(pPcxBuffer + uiOffset++);
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
          *(pBuffer + uiCurrentOffset) = ubCurrentByte;
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

  return TRUE;
}

function SetPcxPalette(pCurrentPcxObject: Pointer<PcxObject>, hImage: HIMAGE): BOOLEAN {
  let Index: UINT16;
  let pubPalette: Pointer<UINT8>;

  pubPalette = &(pCurrentPcxObject->ubPalette[0]);

  // Allocate memory for palette
  hImage->pPalette = MemAlloc(sizeof(SGPPaletteEntry) * 256);

  if (hImage->pPalette == NULL) {
    return FALSE;
  }

  // Initialize the proper palette entries
  for (Index = 0; Index < 256; Index++) {
    hImage->pPalette[Index].peRed = *(pubPalette + (Index * 3));
    hImage->pPalette[Index].peGreen = *(pubPalette + (Index * 3) + 1);
    hImage->pPalette[Index].peBlue = *(pubPalette + (Index * 3) + 2);
    hImage->pPalette[Index].peFlags = 0;
  }

  return TRUE;
}
