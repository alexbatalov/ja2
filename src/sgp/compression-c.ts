// mem allocation functions for ZLIB's purposes

function ZAlloc(opaque: voidpf, items: uInt, size: uInt): voidpf {
  return MemAlloc(items * size);
}

function ZFree(opaque: voidpf, address: voidpf): void {
  MemFree(address);
}

function DecompressInit(pCompressedData: Pointer<BYTE>, uiDataSize: UINT32): PTR {
  z_stream *pZStream;
  int iZRetCode;

  // allocate memory for the z_stream struct
  pZStream = MemAlloc(sizeof(z_stream));
  if (pZStream == NULL) {
    // out of memory!
    return NULL;
  }

  // initial defines
  pZStream->zalloc = ZAlloc;
  pZStream->zfree = ZFree;
  pZStream->opaque = NULL;

  // call the ZLIB init routine
  iZRetCode = inflateInit(pZStream);
  if (iZRetCode != Z_OK) {
    // ZLIB init error!
    MemFree(pZStream);
    return NULL;
  }

  // set up our parameters
  pZStream->next_in = pCompressedData;
  pZStream->avail_in = uiDataSize;
  return (PTR)pZStream;
}

function Decompress(pDecompPtr: PTR, pBuffer: Pointer<BYTE>, uiBufferLen: UINT32): UINT32 {
  int iZRetCode;
  z_stream *pZStream = (z_stream *)pDecompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != NULL);
  Assert(pZStream->zalloc == ZAlloc);

  if (pZStream->avail_in == 0) {
    // There is nothing left to decompress!
    return 0;
  }

  // set up the z_stream with our parameters
  pZStream->next_out = pBuffer;
  pZStream->avail_out = uiBufferLen;

  // decompress!
  iZRetCode = inflate(pZStream, Z_PARTIAL_FLUSH);
  Assert(iZRetCode == Z_OK || iZRetCode == Z_STREAM_END);

  return uiBufferLen - pZStream->avail_out;
}

function DecompressFini(pDecompPtr: PTR): void {
  z_stream *pZStream = (z_stream *)pDecompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != NULL);
  Assert(pZStream->zalloc == ZAlloc);

  inflateEnd(pZStream);
  MemFree(pZStream);
}

function CompressedBufferSize(uiDataSize: UINT32): UINT32 {
  // Function that calculates the worst-case buffer size needed to
  // hold uiDataSize bytes compressed

  return uiDataSize + uiDataSize / 10 + 13;
}

function CompressInit(pUncompressedData: Pointer<BYTE>, uiDataSize: UINT32): PTR {
  z_stream *pZStream;
  int iZRetCode;

  // allocate memory for the z_stream struct
  pZStream = MemAlloc(sizeof(z_stream));
  if (pZStream == NULL) {
    // out of memory!
    return NULL;
  }

  // initial defines
  pZStream->zalloc = ZAlloc;
  pZStream->zfree = ZFree;
  pZStream->opaque = NULL;

  // call the ZLIB init routine
  iZRetCode = deflateInit(pZStream, Z_BEST_COMPRESSION);
  if (iZRetCode != Z_OK) {
    // ZLIB init error!
    MemFree(pZStream);
    return NULL;
  }

  // set up our parameters
  pZStream->next_in = pUncompressedData;
  pZStream->avail_in = uiDataSize;
  return (PTR)pZStream;
}

function Compress(pCompPtr: PTR, pBuffer: Pointer<BYTE>, uiBufferLen: UINT32): UINT32 {
  int iZRetCode;
  z_stream *pZStream = (z_stream *)pCompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != NULL);
  Assert(pZStream->zalloc == ZAlloc);

  if (pZStream->avail_in == 0) {
    // There is nothing left to compress!
    return 0;
  }

  // set up the z_stream with our parameters
  pZStream->next_out = pBuffer;
  pZStream->avail_out = uiBufferLen;

  // decompress!
  iZRetCode = deflate(pZStream, Z_FINISH);
  Assert(iZRetCode == Z_STREAM_END);

  return uiBufferLen - pZStream->avail_out;
}

function CompressFini(pCompPtr: PTR): void {
  z_stream *pZStream = (z_stream *)pCompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != NULL);
  Assert(pZStream->zalloc == ZAlloc);

  deflateEnd(pZStream);
  MemFree(pZStream);
}
