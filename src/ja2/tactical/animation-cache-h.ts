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

export function resetAnimationSurfaceCacheType(o: AnimationSurfaceCacheType) {
  o.usCachedSurfaces = <UINT16[]><unknown>null;
  o.sCacheHits = <UINT16[]><unknown>null;
  o.ubCacheSize = 0;
}

export function copyAnimationSurfaceCacheType(destination: AnimationSurfaceCacheType, source: AnimationSurfaceCacheType) {
  destination.usCachedSurfaces = source.usCachedSurfaces;
  destination.sCacheHits = source.sCacheHits;
  destination.ubCacheSize = source.ubCacheSize;
}

export const ANIMATION_SURFACE_CACHE_TYPE_SIZE = 12;

export function readAnimationSurfaceCacheType(o: AnimationSurfaceCacheType, buffer: Buffer, offset: number = 0): number {
  o.usCachedSurfaces = <UINT16[]><unknown>null; offset += 4; // pointer
  o.sCacheHits = <UINT16[]><unknown>null; offset += 4; // pointer
  o.ubCacheSize = buffer.readUInt8(offset++);
  offset += 3; // padding
  return offset;
}

export function writeAnimationSurfaceCacheType(o: AnimationSurfaceCacheType, buffer: Buffer, offset: number = 0): number {
  offset = writePadding(buffer, offset, 4); // usCachedSurfaces (pointer)
  offset = writePadding(buffer, offset, 4); // sCacheHits (pointer)
  offset = buffer.writeUInt8(o.ubCacheSize, offset);
  offset = writePadding(buffer, offset, 3); // padding
  return offset;
}

}
