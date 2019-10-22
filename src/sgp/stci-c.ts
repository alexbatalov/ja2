function LoadSTCIFileToImage(hImage: HIMAGE, fContents: UINT16): BOOLEAN {
  let hFile: HWFILE;
  let Header: STCIHeader;
  let uiBytesRead: UINT32;
  let TempImage: image_type;

  // Check that hImage is valid, and that the file in question exists
  Assert(hImage != NULL);

  TempImage = *hImage;

  CHECKF(FileExists(TempImage.ImageFile));

  // Open the file and read the header
  hFile = FileOpen(TempImage.ImageFile, FILE_ACCESS_READ, FALSE);
  CHECKF(hFile);

  if (!FileRead(hFile, &Header, STCI_HEADER_SIZE, &uiBytesRead) || uiBytesRead != STCI_HEADER_SIZE || memcmp(Header.cID, STCI_ID_STRING, STCI_ID_LEN) != 0) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem reading STCI header.");
    FileClose(hFile);
    return FALSE;
  }

  // Determine from the header the data stored in the file. and run the appropriate loader
  if (Header.fFlags & STCI_RGB) {
    if (!STCILoadRGB(&TempImage, fContents, hFile, &Header)) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem loading RGB image.");
      FileClose(hFile);
      return FALSE;
    }
  } else if (Header.fFlags & STCI_INDEXED) {
    if (!STCILoadIndexed(&TempImage, fContents, hFile, &Header)) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem loading palettized image.");
      FileClose(hFile);
      return FALSE;
    }
  } else {
    // unsupported type of data, or the right flags weren't set!
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Unknown data organization in STCI file.");
    FileClose(hFile);
    return FALSE;
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
  *hImage = TempImage;

  return TRUE;
}

function STCILoadRGB(hImage: HIMAGE, fContents: UINT16, hFile: HWFILE, pHeader: Pointer<STCIHeader>): BOOLEAN {
  let uiBytesRead: UINT32;

  if (fContents & IMAGE_PALETTE && !(fContents & IMAGE_ALLIMAGEDATA)) {
    // RGB doesn't have a palette!
    return FALSE;
  }

  if (fContents & IMAGE_BITMAPDATA) {
    // Allocate memory for the image data and read it in
    hImage.value.pImageData = MemAlloc(pHeader.value.uiStoredSize);
    if (hImage.value.pImageData == NULL) {
      return FALSE;
    } else if (!FileRead(hFile, hImage.value.pImageData, pHeader.value.uiStoredSize, &uiBytesRead) || uiBytesRead != pHeader.value.uiStoredSize) {
      MemFree(hImage.value.pImageData);
      return FALSE;
    }

    hImage.value.fFlags |= IMAGE_BITMAPDATA;

    if (pHeader.value.ubDepth == 16) {
      // ASSUMPTION: file data is 565 R,G,B

      if (gusRedMask != pHeader.value.RGB.uiRedMask || gusGreenMask != pHeader.value.RGB.uiGreenMask || gusBlueMask != pHeader.value.RGB.uiBlueMask) {
        // colour distribution of the file is different from hardware!  We have to change it!
        DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Converting to current RGB distribution!");
        // Convert the image to the current hardware's specifications
        if (gusRedMask > gusGreenMask && gusGreenMask > gusBlueMask) {
          // hardware wants RGB!
          if (gusRedMask == 0x7C00 && gusGreenMask == 0x03E0 && gusBlueMask == 0x001F) {
            // hardware is 555
            ConvertRGBDistribution565To555(hImage.value.p16BPPData, pHeader.value.usWidth * pHeader.value.usHeight);
            return TRUE;
          } else if (gusRedMask == 0xFC00 && gusGreenMask == 0x03E0 && gusBlueMask == 0x001F) {
            ConvertRGBDistribution565To655(hImage.value.p16BPPData, pHeader.value.usWidth * pHeader.value.usHeight);
            return TRUE;
          } else if (gusRedMask == 0xF800 && gusGreenMask == 0x07C0 && gusBlueMask == 0x003F) {
            ConvertRGBDistribution565To556(hImage.value.p16BPPData, pHeader.value.usWidth * pHeader.value.usHeight);
            return TRUE;
          } else {
            // take the long route
            ConvertRGBDistribution565ToAny(hImage.value.p16BPPData, pHeader.value.usWidth * pHeader.value.usHeight);
            return TRUE;
          }
        } else {
          // hardware distribution is not R-G-B so we have to take the long route!
          ConvertRGBDistribution565ToAny(hImage.value.p16BPPData, pHeader.value.usWidth * pHeader.value.usHeight);
          return TRUE;
        }
      }
    }
  }
  return TRUE;
}

function STCILoadIndexed(hImage: HIMAGE, fContents: UINT16, hFile: HWFILE, pHeader: Pointer<STCIHeader>): BOOLEAN {
  let uiFileSectionSize: UINT32;
  let uiBytesRead: UINT32;
  let pSTCIPalette: PTR;

  if (fContents & IMAGE_PALETTE) {
    // Allocate memory for reading in the palette
    if (pHeader.value.Indexed.uiNumberOfColours != 256) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Palettized image has bad palette size.");
      return FALSE;
    }
    uiFileSectionSize = pHeader.value.Indexed.uiNumberOfColours * STCI_PALETTE_ELEMENT_SIZE;
    pSTCIPalette = MemAlloc(uiFileSectionSize);
    if (pSTCIPalette == NULL) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Out of memory!");
      FileClose(hFile);
      return FALSE;
    }

    // ATE: Memset: Jan 16/99
    memset(pSTCIPalette, 0, uiFileSectionSize);

    // Read in the palette
    if (!FileRead(hFile, pSTCIPalette, uiFileSectionSize, &uiBytesRead) || uiBytesRead != uiFileSectionSize) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem loading palette!");
      FileClose(hFile);
      MemFree(pSTCIPalette);
      return FALSE;
    } else if (!STCISetPalette(pSTCIPalette, hImage)) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem setting hImage-format palette!");
      FileClose(hFile);
      MemFree(pSTCIPalette);
      return FALSE;
    }
    hImage.value.fFlags |= IMAGE_PALETTE;
    // Free the temporary buffer
    MemFree(pSTCIPalette);
  } else if (fContents & (IMAGE_BITMAPDATA | IMAGE_APPDATA)) {
    // seek past the palette
    uiFileSectionSize = pHeader.value.Indexed.uiNumberOfColours * STCI_PALETTE_ELEMENT_SIZE;
    if (FileSeek(hFile, uiFileSectionSize, FILE_SEEK_FROM_CURRENT) == FALSE) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem seeking past palette!");
      FileClose(hFile);
      return FALSE;
    }
  }
  if (fContents & IMAGE_BITMAPDATA) {
    if (pHeader.value.fFlags & STCI_ETRLE_COMPRESSED) {
      // load data for the subimage (object) structures
      Assert(sizeof(ETRLEObject) == STCI_SUBIMAGE_SIZE);
      hImage.value.usNumberOfObjects = pHeader.value.Indexed.usNumberOfSubImages;
      uiFileSectionSize = hImage.value.usNumberOfObjects * STCI_SUBIMAGE_SIZE;
      hImage.value.pETRLEObject = MemAlloc(uiFileSectionSize);
      if (hImage.value.pETRLEObject == NULL) {
        DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Out of memory!");
        FileClose(hFile);
        if (fContents & IMAGE_PALETTE) {
          MemFree(hImage.value.pPalette);
        }
        return FALSE;
      }
      if (!FileRead(hFile, hImage.value.pETRLEObject, uiFileSectionSize, &uiBytesRead) || uiBytesRead != uiFileSectionSize) {
        DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Error loading subimage structures!");
        FileClose(hFile);
        if (fContents & IMAGE_PALETTE) {
          MemFree(hImage.value.pPalette);
        }
        MemFree(hImage.value.pETRLEObject);
        return FALSE;
      }
      hImage.value.uiSizePixData = pHeader.value.uiStoredSize;
      hImage.value.fFlags |= IMAGE_TRLECOMPRESSED;
    }
    // allocate memory for and read in the image data
    hImage.value.pImageData = MemAlloc(pHeader.value.uiStoredSize);
    if (hImage.value.pImageData == NULL) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Out of memory!");
      FileClose(hFile);
      if (fContents & IMAGE_PALETTE) {
        MemFree(hImage.value.pPalette);
      }
      if (hImage.value.usNumberOfObjects > 0) {
        MemFree(hImage.value.pETRLEObject);
      }
      return FALSE;
    } else if (!FileRead(hFile, hImage.value.pImageData, pHeader.value.uiStoredSize, &uiBytesRead) || uiBytesRead != pHeader.value.uiStoredSize) {
      // Problem reading in the image data!
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Error loading image data!");
      FileClose(hFile);
      MemFree(hImage.value.pImageData);
      if (fContents & IMAGE_PALETTE) {
        MemFree(hImage.value.pPalette);
      }
      if (hImage.value.usNumberOfObjects > 0) {
        MemFree(hImage.value.pETRLEObject);
      }
      return FALSE;
    }
    hImage.value.fFlags |= IMAGE_BITMAPDATA;
  } else if (fContents & IMAGE_APPDATA) // then there's a point in seeking ahead
  {
    if (FileSeek(hFile, pHeader.value.uiStoredSize, FILE_SEEK_FROM_CURRENT) == FALSE) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem seeking past image data!");
      FileClose(hFile);
      return FALSE;
    }
  }

  if (fContents & IMAGE_APPDATA && pHeader.value.uiAppDataSize > 0) {
    // load application-specific data
    hImage.value.pAppData = MemAlloc(pHeader.value.uiAppDataSize);
    if (hImage.value.pAppData == NULL) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Out of memory!");
      FileClose(hFile);
      MemFree(hImage.value.pAppData);
      if (fContents & IMAGE_PALETTE) {
        MemFree(hImage.value.pPalette);
      }
      if (fContents & IMAGE_BITMAPDATA) {
        MemFree(hImage.value.pImageData);
      }
      if (hImage.value.usNumberOfObjects > 0) {
        MemFree(hImage.value.pETRLEObject);
      }
      return FALSE;
    }
    if (!FileRead(hFile, hImage.value.pAppData, pHeader.value.uiAppDataSize, &uiBytesRead) || uiBytesRead != pHeader.value.uiAppDataSize) {
      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Error loading application-specific data!");
      FileClose(hFile);
      MemFree(hImage.value.pAppData);
      if (fContents & IMAGE_PALETTE) {
        MemFree(hImage.value.pPalette);
      }
      if (fContents & IMAGE_BITMAPDATA) {
        MemFree(hImage.value.pImageData);
      }
      if (hImage.value.usNumberOfObjects > 0) {
        MemFree(hImage.value.pETRLEObject);
      }
      return FALSE;
    }
    hImage.value.uiAppDataSize = pHeader.value.uiAppDataSize;
    ;
    hImage.value.fFlags |= IMAGE_APPDATA;
  } else {
    hImage.value.pAppData = NULL;
    hImage.value.uiAppDataSize = 0;
  }
  return TRUE;
}

function STCISetPalette(pSTCIPalette: PTR, hImage: HIMAGE): BOOLEAN {
  let usIndex: UINT16;
  let pubPalette: Pointer<STCIPaletteElement>;

  pubPalette = pSTCIPalette;

  // Allocate memory for palette
  hImage.value.pPalette = MemAlloc(sizeof(SGPPaletteEntry) * 256);
  memset(hImage.value.pPalette, 0, (sizeof(SGPPaletteEntry) * 256));

  if (hImage.value.pPalette == NULL) {
    return FALSE;
  }

  // Initialize the proper palette entries
  for (usIndex = 0; usIndex < 256; usIndex++) {
    hImage.value.pPalette[usIndex].peRed = pubPalette.value.ubRed;
    hImage.value.pPalette[usIndex].peGreen = pubPalette.value.ubGreen;
    hImage.value.pPalette[usIndex].peBlue = pubPalette.value.ubBlue;
    hImage.value.pPalette[usIndex].peFlags = 0;
    pubPalette++;
  }
  return TRUE;
}

function IsSTCIETRLEFile(ImageFile: Pointer<CHAR8>): BOOLEAN {
  let hFile: HWFILE;
  let Header: STCIHeader;
  let uiBytesRead: UINT32;

  CHECKF(FileExists(ImageFile));

  // Open the file and read the header
  hFile = FileOpen(ImageFile, FILE_ACCESS_READ, FALSE);
  CHECKF(hFile);

  if (!FileRead(hFile, &Header, STCI_HEADER_SIZE, &uiBytesRead) || uiBytesRead != STCI_HEADER_SIZE || memcmp(Header.cID, STCI_ID_STRING, STCI_ID_LEN) != 0) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Problem reading STCI header.");
    FileClose(hFile);
    return FALSE;
  }
  FileClose(hFile);
  if (Header.fFlags & STCI_ETRLE_COMPRESSED) {
    return TRUE;
  } else {
    return FALSE;
  }
}
