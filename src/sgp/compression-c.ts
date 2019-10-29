namespace ja2 {

// mem allocation functions for ZLIB's purposes

function ZAlloc(opaque: voidpf, items: uInt, size: uInt): voidpf {
  return MemAlloc(items * size);
}

function ZFree(opaque: voidpf, address: voidpf): void {
  MemFree(address);
}

function DecompressInit(pCompressedData: Pointer<BYTE>, uiDataSize: UINT32): PTR {
  let pZStream: Pointer<z_stream>;
  let iZRetCode: number;

  // allocate memory for the z_stream struct
  pZStream = MemAlloc(sizeof(z_stream));
  if (pZStream == null) {
    // out of memory!
    return null;
  }

  // initial defines
  pZStream.value.zalloc = ZAlloc;
  pZStream.value.zfree = ZFree;
  pZStream.value.opaque = null;

  // call the ZLIB init routine
  iZRetCode = inflateInit(pZStream);
  if (iZRetCode != Z_OK) {
    // ZLIB init error!
    MemFree(pZStream);
    return null;
  }

  // set up our parameters
  pZStream.value.next_in = pCompressedData;
  pZStream.value.avail_in = uiDataSize;
  return pZStream;
}

function Decompress(pDecompPtr: PTR, pBuffer: Pointer<BYTE>, uiBufferLen: UINT32): UINT32 {
  let iZRetCode: number;
  let pZStream: Pointer<z_stream> = pDecompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != null);
  Assert(pZStream.value.zalloc == ZAlloc);

  if (pZStream.value.avail_in == 0) {
    // There is nothing left to decompress!
    return 0;
  }

  // set up the z_stream with our parameters
  pZStream.value.next_out = pBuffer;
  pZStream.value.avail_out = uiBufferLen;

  // decompress!
  iZRetCode = inflate(pZStream, Z_PARTIAL_FLUSH);
  Assert(iZRetCode == Z_OK || iZRetCode == Z_STREAM_END);

  return uiBufferLen - pZStream.value.avail_out;
}

function DecompressFini(pDecompPtr: PTR): void {
  let pZStream: Pointer<z_stream> = pDecompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != null);
  Assert(pZStream.value.zalloc == ZAlloc);

  inflateEnd(pZStream);
  MemFree(pZStream);
}

function CompressedBufferSize(uiDataSize: UINT32): UINT32 {
  // Function that calculates the worst-case buffer size needed to
  // hold uiDataSize bytes compressed

  return uiDataSize + uiDataSize / 10 + 13;
}

function CompressInit(pUncompressedData: Pointer<BYTE>, uiDataSize: UINT32): PTR {
  let pZStream: Pointer<z_stream>;
  let iZRetCode: number;

  // allocate memory for the z_stream struct
  pZStream = MemAlloc(sizeof(z_stream));
  if (pZStream == null) {
    // out of memory!
    return null;
  }

  // initial defines
  pZStream.value.zalloc = ZAlloc;
  pZStream.value.zfree = ZFree;
  pZStream.value.opaque = null;

  // call the ZLIB init routine
  iZRetCode = deflateInit(pZStream, Z_BEST_COMPRESSION);
  if (iZRetCode != Z_OK) {
    // ZLIB init error!
    MemFree(pZStream);
    return null;
  }

  // set up our parameters
  pZStream.value.next_in = pUncompressedData;
  pZStream.value.avail_in = uiDataSize;
  return pZStream;
}

function Compress(pCompPtr: PTR, pBuffer: Pointer<BYTE>, uiBufferLen: UINT32): UINT32 {
  let iZRetCode: number;
  let pZStream: Pointer<z_stream> = pCompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != null);
  Assert(pZStream.value.zalloc == ZAlloc);

  if (pZStream.value.avail_in == 0) {
    // There is nothing left to compress!
    return 0;
  }

  // set up the z_stream with our parameters
  pZStream.value.next_out = pBuffer;
  pZStream.value.avail_out = uiBufferLen;

  // decompress!
  iZRetCode = deflate(pZStream, Z_FINISH);
  Assert(iZRetCode == Z_STREAM_END);

  return uiBufferLen - pZStream.value.avail_out;
}

function CompressFini(pCompPtr: PTR): void {
  let pZStream: Pointer<z_stream> = pCompPtr;

  // these assertions is in here to ensure that we get passed a proper z_stream pointer
  Assert(pZStream != null);
  Assert(pZStream.value.zalloc == ZAlloc);

  deflateEnd(pZStream);
  MemFree(pZStream);
}

}
