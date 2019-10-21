//**************************************************************************
//
// Filename :	impTGA.c
//
//	Purpose :	.tga file importer
//
// Modification history :
//
//		20nov96:HJH				- Creation
//
//**************************************************************************

//**************************************************************************
//
//				Includes
//
//**************************************************************************

//**************************************************************************
//
//				Defines
//
//**************************************************************************

//**************************************************************************
//
//				Typedefs
//
//**************************************************************************

//**************************************************************************
//
//				Function Prototypes
//
//**************************************************************************

// BOOLEAN	ConvertTGAToSystemBPPFormat( HIMAGE hImage );

//**************************************************************************
//
//				Function Definitions
//
//**************************************************************************

function LoadTGAFileToImage(hImage: HIMAGE, fContents: UINT16): BOOLEAN {
  let hFile: HWFILE;
  let uiImgID: UINT8;
  let uiColMap: UINT8;
  let uiType: UINT8;
  let uiBytesRead: UINT32;
  let fReturnVal: BOOLEAN = FALSE;

  Assert(hImage != NULL);

  CHECKF(FileExists(hImage->ImageFile));

  hFile = FileOpen(hImage->ImageFile, FILE_ACCESS_READ, FALSE);
  CHECKF(hFile);

  if (!FileRead(hFile, &uiImgID, sizeof(UINT8), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiColMap, sizeof(UINT8), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiType, sizeof(UINT8), &uiBytesRead))
    goto end;

  switch (uiType) {
    case 1:
      fReturnVal = ReadUncompColMapImage(hImage, hFile, uiImgID, uiColMap, fContents);
      break;
    case 2:
      fReturnVal = ReadUncompRGBImage(hImage, hFile, uiImgID, uiColMap, fContents);
      break;
    case 9:
      fReturnVal = ReadRLEColMapImage(hImage, hFile, uiImgID, uiColMap, fContents);
      break;
    case 10:
      fReturnVal = ReadRLERGBImage(hImage, hFile, uiImgID, uiColMap, fContents);
      break;
    default:
      break;
  }

  // Set remaining values

end:
  FileClose(hFile);
  return fReturnVal;
}

//**************************************************************************
//
// ReadUncompColMapImage
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		20nov96:HJH		-> creation
//
//**************************************************************************

function ReadUncompColMapImage(hImage: HIMAGE, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): BOOLEAN {
  return FALSE;
}

//**************************************************************************
//
// ReadUncompRGBImage
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		20nov96:HJH		-> creation
//
//**************************************************************************

function ReadUncompRGBImage(hImage: HIMAGE, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): BOOLEAN {
  let pBMData: Pointer<UINT8>;
  let pBMPtr: Pointer<UINT8>;

  let uiColMapOrigin: UINT16;
  let uiColMapLength: UINT16;
  let uiColMapEntrySize: UINT8;
  let uiBytesRead: UINT32;
  let uiXOrg: UINT16;
  let uiYOrg: UINT16;
  let uiWidth: UINT16;
  let uiHeight: UINT16;
  let uiImagePixelSize: UINT8;
  let uiImageDescriptor: UINT8;
  let iNumValues: UINT32;
  let cnt: UINT16;

  let i: UINT32;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  if (!FileRead(hFile, &uiColMapOrigin, sizeof(UINT16), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiColMapLength, sizeof(UINT16), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiColMapEntrySize, sizeof(UINT8), &uiBytesRead))
    goto end;

  if (!FileRead(hFile, &uiXOrg, sizeof(UINT16), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiYOrg, sizeof(UINT16), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiWidth, sizeof(UINT16), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiHeight, sizeof(UINT16), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiImagePixelSize, sizeof(UINT8), &uiBytesRead))
    goto end;
  if (!FileRead(hFile, &uiImageDescriptor, sizeof(UINT8), &uiBytesRead))
    goto end;

  // skip the id
  FileSeek(hFile, uiImgID, FILE_SEEK_FROM_CURRENT);

  // skip the colour map
  if (uiColMap != 0) {
    FileSeek(hFile, uiColMapLength * (uiImagePixelSize / 8), FILE_SEEK_FROM_CURRENT);
  }

  // Set some HIMAGE data values
  hImage->usWidth = uiWidth;
  hImage->usHeight = uiHeight;
  hImage->ubBitDepth = uiImagePixelSize;

  // Allocate memory based on bpp, height, width

  // Only do if contents flag is appropriate
  if (fContents & IMAGE_BITMAPDATA) {
    if (uiImagePixelSize == 16) {
      iNumValues = uiWidth * uiHeight;

      hImage->p16BPPData = MemAlloc(iNumValues * (uiImagePixelSize / 8));

      if (hImage->p16BPPData == NULL)
        goto end;

      // Get data pointer
      pBMData = hImage->p8BPPData;

      // Start at end
      pBMData += uiWidth * (uiHeight - 1) * (uiImagePixelSize / 8);

      // Data is stored top-bottom - reverse for SGP HIMAGE format
      for (cnt = 0; cnt < uiHeight - 1; cnt++) {
        if (!FileRead(hFile, pBMData, uiWidth * 2, &uiBytesRead))
          goto freeEnd;

        pBMData -= uiWidth * 2;
      }
      // Do first row
      if (!FileRead(hFile, pBMData, uiWidth * 2, &uiBytesRead))
        goto freeEnd;

      // Convert TGA 5,5,5 16 BPP data into current system 16 BPP Data
      // ConvertTGAToSystemBPPFormat( hImage );

      hImage->fFlags |= IMAGE_BITMAPDATA;
    }

    if (uiImagePixelSize == 24) {
      hImage->p8BPPData = MemAlloc(uiWidth * uiHeight * (uiImagePixelSize / 8));

      if (hImage->p8BPPData == NULL)
        goto end;

      // Get data pointer
      pBMData = (UINT8 *)hImage->p8BPPData;

      // Start at end
      pBMPtr = pBMData + uiWidth * (uiHeight - 1) * 3;

      iNumValues = uiWidth * uiHeight;

      for (cnt = 0; cnt < uiHeight; cnt++) {
        for (i = 0; i < uiWidth; i++) {
          if (!FileRead(hFile, &b, sizeof(UINT8), &uiBytesRead))
            goto freeEnd;
          if (!FileRead(hFile, &g, sizeof(UINT8), &uiBytesRead))
            goto freeEnd;
          if (!FileRead(hFile, &r, sizeof(UINT8), &uiBytesRead))
            goto freeEnd;

          pBMPtr[i * 3] = r;
          pBMPtr[i * 3 + 1] = g;
          pBMPtr[i * 3 + 2] = b;
        }
        pBMPtr -= uiWidth * 3;
      }
      hImage->fFlags |= IMAGE_BITMAPDATA;
    }
  }
  return TRUE;

end:
  return FALSE;

freeEnd:
  MemFree(pBMData);
  return FALSE;
}

//**************************************************************************
//
// ReadRLEColMapImage
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		20nov96:HJH		-> creation
//
//**************************************************************************

function ReadRLEColMapImage(hImage: HIMAGE, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): BOOLEAN {
  return FALSE;
}

//**************************************************************************
//
// ReadRLERGBImage
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		20nov96:HJH		-> creation
//
//**************************************************************************

function ReadRLERGBImage(hImage: HIMAGE, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): BOOLEAN {
  return FALSE;
}

/*
BOOLEAN	ConvertTGAToSystemBPPFormat( HIMAGE hImage )
{
        UINT16		usX, usY;
        UINT16		Old16BPPValue;
        UINT16		*pData;
        UINT16		usR, usG, usB;
        float			scale_val;
        UINT32		uiRBitMask;
        UINT32		uiGBitMask;
        UINT32		uiBBitMask;
        UINT8			ubRNewShift;
        UINT8			ubGNewShift;
        UINT8			ubBNewShift;
        UINT8			ubScaleR;
        UINT8			ubScaleB;
        UINT8			ubScaleG;

        // Basic algorithm for coonverting to different rgb distributions

        // Get current Pixel Format from DirectDraw
        CHECKF( GetPrimaryRGBDistributionMasks( &uiRBitMask, &uiGBitMask, &uiBBitMask ) );

        // Only convert if different
        if ( uiRBitMask == 0x7c00 && uiGBitMask == 0x3e0 && uiBBitMask == 0x1f )
        {
                return( TRUE );
        }

        // Default values
        ubScaleR			= 0;
        ubScaleG			= 0;
        ubScaleB			= 0;
        ubRNewShift   = 10;
        ubGNewShift   = 5;
        ubBNewShift   = 0;

        // Determine values
  switch( uiBBitMask )
  {
                case 0x3f: // 0000000000111111 pixel mask for blue

                        // 5-5-6
                        ubRNewShift = 11;
                        ubGNewShift = 6;
                        ubScaleB		= 1;
                        break;

    case 0x1f: // 0000000000011111 pixel mask for blue
                        switch( uiGBitMask )
      {
                                case 0x7e0: // 0000011111100000 pixel mask for green

                // 5-6-5
                                        ubRNewShift = 11;
                                        ubScaleG    = 1;
                                        break;

        case 0x3e0: // 0000001111100000 pixel mask for green

                                        switch( uiRBitMask )
          {
                                                case 0xfc00: // 1111110000000000 pixel mask for red

                                                        // 6-5-5
                                                        ubScaleR	= 1;
                                                        break;
          }
          break;
      }
      break;
  }

        pData = hImage->pui16BPPPalette;
        usX = 0;
        do
        {

                usY = 0;

                do
                {

                        // Get Old 5,5,5 value
                        Old16BPPValue = hImage->p16BPPData[ usX * hImage->usWidth + usY ];

                        // Get component r,g,b values AT 5 5 5
                        usR = ( Old16BPPValue & 0x7c00 ) >> 10;
                        usG = ( Old16BPPValue & 0x3e0 ) >> 5;
                        usB = Old16BPPValue & 0x1f;

                        // Scale accordingly
                        usR = usR << ubScaleR;
                        usG = usG << ubScaleG;
                        usB = usB << ubScaleB;

                        hImage->p16BPPData[ usX * hImage->usWidth + usY ] = ((UINT16) ( ( usR << ubRNewShift | usG << ubGNewShift ) | usB  ) );

                        usY++;

                } while( usY < hImage->usWidth );

                usX++;

        } while( usX < hImage->usHeight );

        return( TRUE );

}
*/
