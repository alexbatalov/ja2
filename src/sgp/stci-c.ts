namespace ja2 {

export function LoadSTCIFileToImage(hImage: ImageType, fContents: UINT16): boolean {
  let hFile: HWFILE;
  let Header: STCIHeader = createSTCIHeader();
  let uiBytesRead: UINT32;
  let TempImage: ImageType;
  let buffer: Buffer;

  // Check that hImage is valid, and that the file in question exists
  Assert(hImage != null);

  TempImage = hImage;

  if (!FileExists(TempImage.ImageFile)) {
    return false;
  }

  // Open the file and read the header
  hFile = FileOpen(TempImage.ImageFile, FILE_ACCESS_READ, false);
  if (!hFile) {
    return false;
  }

  buffer = Buffer.allocUnsafe(STCI_HEADER_SIZE);
  if ((uiBytesRead = FileRead(hFile, buffer, STCI_HEADER_SIZE)) === -1 || uiBytesRead != STCI_HEADER_SIZE) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem reading STCI header.");
    FileClose(hFile);
    return false;
  }
  readSTCIHeader(Header, buffer);

  if (Header.cID !== STCI_ID_STRING) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem reading STCI header.");
    FileClose(hFile);
    return false;
  }


  // Determine from the header the data stored in the file. and run the appropriate loader
  if (Header.fFlags & STCI_RGB) {
    if (!STCILoadRGB(TempImage, fContents, hFile, Header)) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem loading RGB image.");
      FileClose(hFile);
      return false;
    }
  } else if (Header.fFlags & STCI_INDEXED) {
    if (!STCILoadIndexed(TempImage, fContents, hFile, Header)) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem loading palettized image.");
      FileClose(hFile);
      return false;
    }
  } else {
    // unsupported type of data, or the right flags weren't set!
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Unknown data organization in STCI file.");
    FileClose(hFile);
    return false;
  }

  // Requested data loaded successfully.
  FileClose(hFile);

  // Set some more flags in the temporary image structure, copy it so that hImage points
  // to it, and return.
  if (Header.fFlags & STCI_ZLIB_COMPRESSED) {
    TempImage.fFlags |= IMAGE_COMPRESSED;
  }
  TempImage.usWidth = Header.usWidth;
  TempImage.usHeight = Header.usHeight;
  TempImage.ubBitDepth = Header.ubDepth;

  return true;
}

function STCILoadRGB(hImage: ImageType, fContents: UINT16, hFile: HWFILE, pHeader: STCIHeader): boolean {
  let uiBytesRead: UINT32;
  let buffer: Buffer;

  if (fContents & IMAGE_PALETTE && !(fContents & IMAGE_ALLIMAGEDATA)) {
    // RGB doesn't have a palette!
    return false;
  }

  if (fContents & IMAGE_BITMAPDATA) {
    // Allocate memory for the image data and read it in
    buffer = Buffer.allocUnsafe(pHeader.uiStoredSize);

    if ((uiBytesRead = FileRead(hFile, buffer, pHeader.uiStoredSize)) === -1 || uiBytesRead != pHeader.uiStoredSize) {
      return false;
    }
    hImage.pImageData = buffer;
    hImage.pCompressedImageData = buffer;
    hImage.p8BPPData = buffer;
    hImage.p16BPPData = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
    hImage.pPixData8 = buffer;

    hImage.fFlags |= IMAGE_BITMAPDATA;

    if (pHeader.ubDepth == 16) {
      // ASSUMPTION: file data is 565 R,G,B

      if (gusRedMask != pHeader.RGB.uiRedMask || gusGreenMask != pHeader.RGB.uiGreenMask || gusBlueMask != pHeader.RGB.uiBlueMask) {
        // colour distribution of the file is different from hardware!  We have to change it!
        DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Converting to current RGB distribution!");
        // Convert the image to the current hardware's specifications
        if (gusRedMask > gusGreenMask && gusGreenMask > gusBlueMask) {
          // hardware wants RGB!
          if (gusRedMask == 0x7C00 && gusGreenMask == 0x03E0 && gusBlueMask == 0x001F) {
            // hardware is 555
            ConvertRGBDistribution565To555(hImage.p16BPPData, pHeader.usWidth * pHeader.usHeight);
            return true;
          } else if (gusRedMask == 0xFC00 && gusGreenMask == 0x03E0 && gusBlueMask == 0x001F) {
            ConvertRGBDistribution565To655(hImage.p16BPPData, pHeader.usWidth * pHeader.usHeight);
            return true;
          } else if (gusRedMask == 0xF800 && gusGreenMask == 0x07C0 && gusBlueMask == 0x003F) {
            ConvertRGBDistribution565To556(hImage.p16BPPData, pHeader.usWidth * pHeader.usHeight);
            return true;
          } else {
            // take the long route
            ConvertRGBDistribution565ToAny(hImage.p16BPPData, pHeader.usWidth * pHeader.usHeight);
            return true;
          }
        } else {
          // hardware distribution is not R-G-B so we have to take the long route!
          ConvertRGBDistribution565ToAny(hImage.p16BPPData, pHeader.usWidth * pHeader.usHeight);
          return true;
        }
      }
    }
  }
  return true;
}

function STCILoadIndexed(hImage: ImageType, fContents: UINT16, hFile: HWFILE, pHeader: STCIHeader): boolean {
  let uiFileSectionSize: UINT32;
  let uiBytesRead: UINT32;
  let pSTCIPalette: PTR;
  let buffer: Buffer;

  if (fContents & IMAGE_PALETTE) {
    // Allocate memory for reading in the palette
    if (pHeader.Indexed.uiNumberOfColours != 256) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Palettized image has bad palette size.");
      return false;
    }
    uiFileSectionSize = pHeader.Indexed.uiNumberOfColours * STCI_PALETTE_ELEMENT_SIZE;

    // Read in the palette
    buffer = Buffer.allocUnsafe(uiFileSectionSize);
    if ((uiBytesRead = FileRead(hFile, buffer, uiFileSectionSize)) === -1 || uiBytesRead != uiFileSectionSize) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem loading palette!");
      FileClose(hFile);
      return false;
    }

    if (!STCISetPalette(buffer, hImage)) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem setting hImage-format palette!");
      FileClose(hFile);
      return false;
    }
    hImage.fFlags |= IMAGE_PALETTE;
  } else if (fContents & (IMAGE_BITMAPDATA | IMAGE_APPDATA)) {
    // seek past the palette
    uiFileSectionSize = pHeader.Indexed.uiNumberOfColours * STCI_PALETTE_ELEMENT_SIZE;
    if (FileSeek(hFile, uiFileSectionSize, FILE_SEEK_FROM_CURRENT) == false) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem seeking past palette!");
      FileClose(hFile);
      return false;
    }
  }
  if (fContents & IMAGE_BITMAPDATA) {
    if (pHeader.fFlags & STCI_ETRLE_COMPRESSED) {
      // load data for the subimage (object) structures
      hImage.usNumberOfObjects = pHeader.Indexed.usNumberOfSubImages;
      uiFileSectionSize = hImage.usNumberOfObjects * STCI_SUBIMAGE_SIZE;
      hImage.pETRLEObject = createArrayFrom(hImage.usNumberOfObjects, createETRLEObject);

      buffer = Buffer.allocUnsafe(uiFileSectionSize);
      if ((uiBytesRead = FileRead(hFile, buffer, uiFileSectionSize)) === -1 || uiBytesRead != uiFileSectionSize) {
        DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Error loading subimage structures!");
        FileClose(hFile);
        if (fContents & IMAGE_PALETTE) {
          hImage.pPalette = <SGPPaletteEntry[]><unknown>null;
        }
        hImage.pETRLEObject = <ETRLEObject[]><unknown>null;
        return false;
      }
      readObjectArray(hImage.pETRLEObject, buffer, 0, readETRLEObject);
      hImage.uiSizePixData = pHeader.uiStoredSize;
      hImage.fFlags |= IMAGE_TRLECOMPRESSED;
    }

    // allocate memory for and read in the image data
    buffer = Buffer.allocUnsafe(pHeader.uiStoredSize);
    if ((uiBytesRead = FileRead(hFile, buffer, pHeader.uiStoredSize)) === -1 || uiBytesRead != pHeader.uiStoredSize) {
      // Problem reading in the image data!
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Error loading image data!");
      FileClose(hFile);
      hImage.pImageData = <Buffer><unknown>null;
      if (fContents & IMAGE_PALETTE) {
        hImage.pPalette = <SGPPaletteEntry[]><unknown>null;
      }
      if (hImage.usNumberOfObjects > 0) {
        hImage.pETRLEObject = <ETRLEObject[]><unknown>null;
      }
      return false;
    }
    hImage.pImageData = buffer;
    hImage.pCompressedImageData = buffer;
    hImage.p8BPPData = buffer;
    hImage.p16BPPData = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
    hImage.pPixData8 = buffer;

    hImage.fFlags |= IMAGE_BITMAPDATA;
  } else if (fContents & IMAGE_APPDATA) // then there's a point in seeking ahead
  {
    if (FileSeek(hFile, pHeader.uiStoredSize, FILE_SEEK_FROM_CURRENT) == false) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem seeking past image data!");
      FileClose(hFile);
      return false;
    }
  }

  if (fContents & IMAGE_APPDATA && pHeader.uiAppDataSize > 0) {
    // load application-specific data
    hImage.pAppData = Buffer.allocUnsafe(pHeader.uiAppDataSize);
    if ((uiBytesRead = FileRead(hFile, hImage.pAppData, pHeader.uiAppDataSize)) === -1 || uiBytesRead != pHeader.uiAppDataSize) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Error loading application-specific data!");
      FileClose(hFile);
      hImage.pAppData = <Buffer><unknown>null;
      if (fContents & IMAGE_PALETTE) {
        hImage.pPalette = <SGPPaletteEntry[]><unknown>null;
      }
      if (fContents & IMAGE_BITMAPDATA) {
        hImage.pImageData = <Buffer><unknown>null;
        hImage.pCompressedImageData = <Buffer><unknown>null;
        hImage.p8BPPData = <Uint8Array><unknown>null;
        hImage.p16BPPData = <Uint16Array><unknown>null;
        hImage.pPixData8 = <Uint8Array><unknown>null;
      }
      if (hImage.usNumberOfObjects > 0) {
        hImage.pETRLEObject = <ETRLEObject[]><unknown>null;
      }
      return false;
    }
    hImage.uiAppDataSize = pHeader.uiAppDataSize;
    ;
    hImage.fFlags |= IMAGE_APPDATA;
  } else {
    hImage.pAppData = <Buffer><unknown>null;
    hImage.uiAppDataSize = 0;
  }
  return true;
}

function STCISetPalette(pSTCIPalette: Buffer, hImage: ImageType): boolean {
  let usIndex: UINT16;

  // Allocate memory for palette
  hImage.pPalette = createArrayFrom(256, createSGPPaletteEntry);

  // Initialize the proper palette entries
  for (usIndex = 0; usIndex < 256; usIndex++) {
    hImage.pPalette[usIndex].peRed = pSTCIPalette[usIndex * 3];
    hImage.pPalette[usIndex].peGreen = pSTCIPalette[usIndex * 3 + 1];
    hImage.pPalette[usIndex].peBlue = pSTCIPalette[usIndex * 3 + 2];
    hImage.pPalette[usIndex].peFlags = 0;
  }
  return true;
}

function IsSTCIETRLEFile(ImageFile: string /* Pointer<CHAR8> */): boolean {
  let hFile: HWFILE;
  let Header: STCIHeader = createSTCIHeader();
  let uiBytesRead: UINT32;
  let buffer: Buffer;

  if (!FileExists(ImageFile)) {
    return false;
  }

  // Open the file and read the header
  hFile = FileOpen(ImageFile, FILE_ACCESS_READ, false);
  if (!hFile) {
    return false;
  }

  buffer = Buffer.allocUnsafe(STCI_HEADER_SIZE);
  if ((uiBytesRead = FileRead(hFile, buffer, STCI_HEADER_SIZE)) === -1 || uiBytesRead != STCI_HEADER_SIZE) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem reading STCI header.");
    FileClose(hFile);
    return false;
  }
  readSTCIHeader(Header, buffer);

  if (Header.cID === STCI_ID_STRING) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem reading STCI header.");
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);
  if (Header.fFlags & STCI_ETRLE_COMPRESSED) {
    return true;
  } else {
    return false;
  }
}

}
