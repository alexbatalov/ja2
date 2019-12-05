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

export function LoadPCXFileToImage(hImage: ImageType, fContents: UINT16): boolean {
  let pPcxObject: PcxObject | null;

  // First Load a PCX Image
  pPcxObject = LoadPcx(hImage.ImageFile);

  if (pPcxObject == null) {
    return false;
  }

  // Set some header information
  hImage.usWidth = pPcxObject.usWidth;
  hImage.usHeight = pPcxObject.usHeight;
  hImage.ubBitDepth = 8;
  hImage.fFlags = hImage.fFlags | fContents;

  // Read and allocate bitmap block if requested
  if (fContents & IMAGE_BITMAPDATA) {
    // Allocate memory for buffer
    hImage.p8BPPData = new Uint8Array(hImage.usWidth * hImage.usHeight);

    if (!BlitPcxToBuffer(pPcxObject, hImage.p8BPPData, hImage.usWidth, hImage.usHeight, 0, 0, false)) {
      hImage.p8BPPData = <Uint8Array><unknown>null;
      return false;
    }
  }

  if (fContents & IMAGE_PALETTE) {
    SetPcxPalette(pPcxObject, hImage);

    // Create 16 BPP palette if flags and BPP justify
    hImage.pui16BPPPalette = Create16BPPPalette(hImage.pPalette);
  }

  return true;
}

function LoadPcx(pFilename: string /* Pointer<UINT8> */): PcxObject | null {
  let Header: PcxHeader = createPcxHeader();
  let pCurrentPcxObject: PcxObject;
  let hFileHandle: HWFILE;
  let uiFileSize: UINT32;
  let pPcxBuffer: Uint8Array;
  let buffer: Buffer;

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
  pCurrentPcxObject = createPcxObject();

  // Ok we now have a file handle, so let's read in the data
  buffer = Buffer.allocUnsafe(PCX_HEADER_SIZE);
  FileRead(hFileHandle, buffer, PCX_HEADER_SIZE);
  readPcxHeader(Header, buffer);
  if ((Header.ubManufacturer != 10) || (Header.ubEncoding != 1)) {
    // We have an invalid pcx format
    // Delete the object
    return null;
  }

  if (Header.ubBitsPerPixel == 8) {
    pCurrentPcxObject.usPcxFlags = PCX_256COLOR;
  } else {
    pCurrentPcxObject.usPcxFlags = 0;
  }

  pCurrentPcxObject.usWidth = 1 + (Header.usRight - Header.usLeft);
  pCurrentPcxObject.usHeight = 1 + (Header.usBottom - Header.usTop);
  pCurrentPcxObject.uiBufferSize = uiFileSize - 768 - PCX_HEADER_SIZE;

  buffer = Buffer.allocUnsafe(pCurrentPcxObject.uiBufferSize);
  FileRead(hFileHandle, buffer, pCurrentPcxObject.uiBufferSize);
  pCurrentPcxObject.pPcxBuffer = buffer;

  // Read in the palette
  buffer = Buffer.allocUnsafe(768);
  FileRead(hFileHandle, buffer, 768);
  pCurrentPcxObject.ubPalette = buffer;

  // Close file
  FileClose(hFileHandle);

  return pCurrentPcxObject;
}

function BlitPcxToBuffer(pCurrentPcxObject: PcxObject, pBuffer: Uint8Array, usBufferWidth: UINT16, usBufferHeight: UINT16, usX: UINT16, usY: UINT16, fTransp: boolean): boolean {
  let pPcxBuffer: Uint8Array;
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

  pPcxBuffer = pCurrentPcxObject.pPcxBuffer;

  if (((pCurrentPcxObject.usWidth + usX) == usBufferWidth) && ((pCurrentPcxObject.usHeight + usY) == usBufferHeight)) {
    // Pre-compute PCX blitting aspects.
    uiImageSize = usBufferWidth * usBufferHeight;
    ubMode = PCX_NORMAL;
    uiOffset = 0;
    ubRepCount = 0;

    // Blit Pcx object. Two main cases, one for transparency (0's are skipped and for without transparency.
    if (fTransp == true) {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = pPcxBuffer[uiOffset++];
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = pPcxBuffer[uiOffset++];
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
          pBuffer[uiIndex] = ubCurrentByte;
        }
      }
    } else {
      for (uiIndex = 0; uiIndex < uiImageSize; uiIndex++) {
        if (ubMode == PCX_NORMAL) {
          ubCurrentByte = pPcxBuffer[uiOffset++];
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = pPcxBuffer[uiOffset++];
            if (--ubRepCount > 0) {
              ubMode = PCX_RLE;
            }
          }
        } else {
          if (--ubRepCount == 0) {
            ubMode = PCX_NORMAL;
          }
        }
        pBuffer[uiIndex] = ubCurrentByte;
      }
    }
  } else {
    // Pre-compute PCX blitting aspects.
    if ((pCurrentPcxObject.usWidth + usX) >= usBufferWidth) {
      pCurrentPcxObject.usPcxFlags |= PCX_X_CLIPPING;
      usMaxX = usBufferWidth - 1;
    } else {
      usMaxX = pCurrentPcxObject.usWidth + usX;
    }

    if ((pCurrentPcxObject.usHeight + usY) >= usBufferHeight) {
      pCurrentPcxObject.usPcxFlags |= PCX_Y_CLIPPING;
      uiImageSize = pCurrentPcxObject.usWidth * (usBufferHeight - usY);
      usMaxY = usBufferHeight - 1;
    } else {
      uiImageSize = pCurrentPcxObject.usWidth * pCurrentPcxObject.usHeight;
      usMaxY = pCurrentPcxObject.usHeight + usY;
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
          ubCurrentByte = pPcxBuffer[uiOffset++];
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = pPcxBuffer[uiOffset++];
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
          pBuffer[usCurrentY * usBufferWidth + usCurrentX] = ubCurrentByte;
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
          ubCurrentByte = pPcxBuffer[uiOffset++];
          if (ubCurrentByte > 0x0BF) {
            ubRepCount = ubCurrentByte & 0x03F;
            ubCurrentByte = pPcxBuffer[uiOffset++];
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
          pBuffer[uiCurrentOffset] = ubCurrentByte;
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

function SetPcxPalette(pCurrentPcxObject: PcxObject, hImage: ImageType): boolean {
  let Index: UINT16;
  let pubPalette: Uint8Array;

  pubPalette = pCurrentPcxObject.ubPalette;

  // Allocate memory for palette
  hImage.pPalette = createArrayFrom(256, createSGPPaletteEntry);

  if (hImage.pPalette == null) {
    return false;
  }

  // Initialize the proper palette entries
  for (Index = 0; Index < 256; Index++) {
    hImage.pPalette[Index].peRed = pubPalette[Index * 3];
    hImage.pPalette[Index].peGreen = pubPalette[Index * 3 + 1];
    hImage.pPalette[Index].peBlue = pubPalette[Index * 3 + 2];
    hImage.pPalette[Index].peFlags = 0;
  }

  return true;
}

}
