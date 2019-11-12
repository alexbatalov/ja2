namespace ja2 {

const MAX_CACHE_SIZE = 20;
export const MIN_CACHE_SIZE = 2;

export interface AnimationSurfaceCacheType {
  usCachedSurfaces: UINT16[] /* Pointer<UINT16> */;
  sCacheHits: UINT16[] /* Pointer<INT16> */;
  ubCacheSize: UINT8;
}

export function createAnimationSurfaceCacheType(): AnimationSurfaceCacheType {
  return {
    usCachedSurfaces: <UINT16[]><unknown>null,
    sCacheHits: <UINT16[]><unknown>null,
    ubCacheSize: 0,
  };
}

}
