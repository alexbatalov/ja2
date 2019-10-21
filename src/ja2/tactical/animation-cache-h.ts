const MAX_CACHE_SIZE = 20;
const MIN_CACHE_SIZE = 2;

interface AnimationSurfaceCacheType {
  usCachedSurfaces: Pointer<UINT16>;
  sCacheHits: Pointer<INT16>;
  ubCacheSize: UINT8;
}

UINT32 guiCacheSize;
