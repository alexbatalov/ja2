namespace ja2 {

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

export function LoadTGAFileToImage(hImage: ImageType, fContents: UINT16): boolean {
  let hFile: HWFILE;
  let uiImgID: UINT8;
  let uiColMap: UINT8;
  let uiType: UINT8;
  let uiBytesRead: UINT32;
  let fReturnVal: boolean = false;
  let buffer: Buffer;

  Assert(hImage != null);

  if (!FileExists(hImage.ImageFile)) {
    return false;
  }

  hFile = FileOpen(hImage.ImageFile, FILE_ACCESS_READ, false);
  if (!hFile) {
    return false;
  }

  buffer = Buffer.allocUnsafe(1);

  if ((uiBytesRead = FileRead(hFile, buffer, 1)) === -1) {
    FileClose(hFile);
    return false;
  }
  uiImgID = buffer.readUInt8(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 1)) === -1) {
    FileClose(hFile);
    return false;
  }
  uiColMap = buffer.readUInt8(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 1)) === -1) {
    FileClose(hFile);
    return false;
  }
  uiType = buffer.readUInt8(0);

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

function ReadUncompColMapImage(hImage: ImageType, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): boolean {
  return false;
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

function ReadUncompRGBImage(hImage: ImageType, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): boolean {
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
  let buffer: Buffer;
  let chunk: Buffer;
  let offset: number;

  buffer = Buffer.allocUnsafe(2);

  if ((uiBytesRead = FileRead(hFile, buffer, 2)) === -1) {
    return false;
  }
  uiColMapOrigin = buffer.readUInt16LE(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 2)) === -1) {
    return false;
  }
  uiColMapLength = buffer.readUInt16LE(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 1)) === -1) {
    return false;
  }
  uiColMapEntrySize = buffer.readUInt8(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 2)) === -1) {
    return false;
  }
  uiXOrg = buffer.readUInt16LE(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 2)) === -1) {
    return false;
  }
  uiYOrg = buffer.readUInt16LE(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 2)) === -1) {
    return false;
  }
  uiWidth = buffer.readUInt16LE(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 2)) === -1) {
    return false;
  }
  uiHeight = buffer.readUInt16LE(0);

  if ((uiBytesRead = FileRead(hFile, buffer, 1)) === -1) {
    return false;
  }
  uiImagePixelSize = buffer.readUInt8(0);
  if ((uiBytesRead = FileRead(hFile, buffer, 1)) === -1) {
    return false;
  }
  uiImageDescriptor = buffer.readUInt8(0);

  // skip the id
  FileSeek(hFile, uiImgID, FILE_SEEK_FROM_CURRENT);

  // skip the colour map
  if (uiColMap != 0) {
    FileSeek(hFile, uiColMapLength * (uiImagePixelSize / 8), FILE_SEEK_FROM_CURRENT);
  }

  // Set some HIMAGE data values
  hImage.usWidth = uiWidth;
  hImage.usHeight = uiHeight;
  hImage.ubBitDepth = uiImagePixelSize;

  // Allocate memory based on bpp, height, width

  // Only do if contents flag is appropriate
  if (fContents & IMAGE_BITMAPDATA) {
    if (uiImagePixelSize == 16) {
      iNumValues = uiWidth * uiHeight;

      buffer = Buffer.allocUnsafe(iNumValues * (uiImagePixelSize / 8));

      // Start at end
      offset = uiWidth * (uiHeight - 1) * (uiImagePixelSize / 8);

      // Data is stored top-bottom - reverse for SGP HIMAGE format
      chunk = Buffer.allocUnsafe(uiWidth * 2);
      for (cnt = 0; cnt < uiHeight - 1; cnt++) {
        if ((uiBytesRead = FileRead(hFile, chunk, uiWidth * 2)) === -1)
          return false;

        chunk.copy(buffer, offset);

        offset -= uiWidth * 2;
      }
      // Do first row
      if ((uiBytesRead = FileRead(hFile, chunk, uiWidth * 2)) === -1)
        return false;

      chunk.copy(buffer, 0);

      // Convert TGA 5,5,5 16 BPP data into current system 16 BPP Data
      // ConvertTGAToSystemBPPFormat( hImage );

      hImage.pImageData = buffer;
      hImage.pCompressedImageData = buffer;
      hImage.p8BPPData = buffer;
      hImage.p16BPPData = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
      hImage.pPixData8 = buffer;

      hImage.fFlags |= IMAGE_BITMAPDATA;
    }

    if (uiImagePixelSize == 24) {
      buffer = Buffer.allocUnsafe(uiWidth * uiHeight * (uiImagePixelSize / 8));

      // Start at end
      offset = uiWidth * (uiHeight - 1) * 3;

      iNumValues = uiWidth * uiHeight;

      chunk = Buffer.allocUnsafe(1);
      for (cnt = 0; cnt < uiHeight; cnt++) {
        for (i = 0; i < uiWidth; i++) {
          if ((uiBytesRead = FileRead(hFile, chunk, 1)) === -1)
            return false;
          b = chunk.readUInt8(0);

          if ((uiBytesRead = FileRead(hFile, chunk, 1)) === -1)
            return false;
          g = chunk.readUInt8(0);

          if ((uiBytesRead = FileRead(hFile, chunk, 1)) === -1)
            return false;
          r = chunk.readUInt8(0);

          buffer[offset + i * 3] = r;
          buffer[offset + i * 3 + 1] = g;
          buffer[offset + i * 3 + 2] = b;
        }
        offset -= uiWidth * 3;
      }

      hImage.pImageData = buffer;
      hImage.pCompressedImageData = buffer;
      hImage.p8BPPData = buffer;
      hImage.p16BPPData = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
      hImage.pPixData8 = buffer;

      hImage.fFlags |= IMAGE_BITMAPDATA;
    }
  }
  return true;
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

function ReadRLEColMapImage(hImage: ImageType, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): boolean {
  return false;
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

function ReadRLERGBImage(hImage: ImageType, hFile: HWFILE, uiImgID: UINT8, uiColMap: UINT8, fContents: UINT16): boolean {
  return false;
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

}
