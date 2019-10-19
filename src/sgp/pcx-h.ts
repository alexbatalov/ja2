interface PcxHeader {
  ubManufacturer: UINT8;
  ubVersion: UINT8;
  ubEncoding: UINT8;
  ubBitsPerPixel: UINT8;

  usLeft: UINT16;
  usTop: UINT16;

  usRight: UINT16;
  usBottom: UINT16;

  usHorRez: UINT16;
  usVerRez: UINT16;

  ubEgaPalette: UINT8[] /* [48] */;
  ubReserved: UINT8;
  ubColorPlanes: UINT8;
  usBytesPerLine: UINT16;
  usPaletteType: UINT16;
  ubFiller: UINT8[] /* [58] */;
}

interface PcxObject {
  pPcxBuffer: Pointer<UINT8>;
  ubPalette: UINT8[] /* [768] */;

  usWidth: UINT16;
  usHeight: UINT16;

  uiBufferSize: UINT32;
  usPcxFlags: UINT16;
}

BOOLEAN LoadPCXFileToImage(HIMAGE hImage, UINT16 fContents);
PcxObject *LoadPcx(UINT8 *pFilename);
BOOLEAN BlitPcxToBuffer(PcxObject *pCurrentPcxObject, UINT8 *pBuffer, UINT16 usBufferWidth, UINT16 usBufferHeight, UINT16 usX, UINT16 usY, BOOLEAN fTransp);
