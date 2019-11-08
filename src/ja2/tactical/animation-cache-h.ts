namespace ja2 {

const MAX_CACHE_SIZE = 20;
export const MIN_CACHE_SIZE = 2;

export interface AnimationSurfaceCacheType {
  usCachedSurfaces: Pointer<UINT16>;
  sCacheHits: Pointer<INT16>;
  ubCacheSize: UINT8;
}

export function createAnimationSurfaceCacheType(): AnimationSurfaceCacheType {
  return {
    usCachedSurfaces: null,
    sCacheHits: null,
    ubCacheSize: 0,
  };
}

}
