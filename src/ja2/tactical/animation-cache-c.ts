const EMPTY_CACHE_ENTRY = 65000;

let guiCacheSize: UINT32 = MIN_CACHE_SIZE;

function DetermineOptimumAnimationCacheSize(): void {
  // If we have lots-a memory, adjust accordingly!
  guiCacheSize = MIN_CACHE_SIZE;
}

export function InitAnimationCache(usSoldierID: UINT16, pAnimCache: Pointer<AnimationSurfaceCacheType>): boolean {
  let cnt: UINT32;

  // Allocate entries
  AnimDebugMsg(String("*** Initializing anim cache surface for soldier %d", usSoldierID));
  pAnimCache.value.usCachedSurfaces = MemAlloc(sizeof(UINT16) * guiCacheSize);
  CHECKF(pAnimCache.value.usCachedSurfaces != null);

  AnimDebugMsg(String("*** Initializing anim cache hit counter for soldier %d", usSoldierID));
  pAnimCache.value.sCacheHits = MemAlloc(sizeof(UINT16) * guiCacheSize);
  CHECKF(pAnimCache.value.sCacheHits != null);

  // Zero entries
  for (cnt = 0; cnt < guiCacheSize; cnt++) {
    pAnimCache.value.usCachedSurfaces[cnt] = EMPTY_CACHE_ENTRY;
    pAnimCache.value.sCacheHits[cnt] = 0;
  }
  pAnimCache.value.ubCacheSize = 0;

  // Zero surface databse history for this soldeir
  ClearAnimationSurfacesUsageHistory(usSoldierID);

  return true;
}

export function DeleteAnimationCache(usSoldierID: UINT16, pAnimCache: Pointer<AnimationSurfaceCacheType>): void {
  // Allocate entries
  if (pAnimCache.value.usCachedSurfaces != null) {
    AnimDebugMsg(String("*** Removing Anim Cache surface for soldier %d", usSoldierID));
    MemFree(pAnimCache.value.usCachedSurfaces);
  }

  if (pAnimCache.value.sCacheHits != null) {
    AnimDebugMsg(String("*** Removing Anim Cache hit counter for soldier %d", usSoldierID));
    MemFree(pAnimCache.value.sCacheHits);
  }
}

export function GetCachedAnimationSurface(usSoldierID: UINT16, pAnimCache: Pointer<AnimationSurfaceCacheType>, usSurfaceIndex: UINT16, usCurrentAnimation: UINT16): boolean {
  let cnt: UINT8;
  let ubLowestIndex: UINT8 = 0;
  let sMostHits: INT16 = 32000;
  let usCurrentAnimSurface: UINT16;

  // Check to see if surface exists already
  for (cnt = 0; cnt < pAnimCache.value.ubCacheSize; cnt++) {
    if (pAnimCache.value.usCachedSurfaces[cnt] == usSurfaceIndex) {
      // Found surface, return
      AnimDebugMsg(String("Anim Cache: Hit %d ( Soldier %d )", usSurfaceIndex, usSoldierID));
      pAnimCache.value.sCacheHits[cnt]++;
      return true;
    }
  }

  // Check if max size has been reached
  if (pAnimCache.value.ubCacheSize == guiCacheSize) {
    AnimDebugMsg(String("Anim Cache: Determining Bump Candidate ( Soldier %d )", usSoldierID));

    // Determine exisiting surface used by merc
    usCurrentAnimSurface = DetermineSoldierAnimationSurface(MercPtrs[usSoldierID], usCurrentAnimation);
    // If the surface we are going to bump is our existing animation, reject it as a candidate

    // If we get here, we need to remove an animation, pick the best one
    // Loop through and pick one with lowest cache hits
    for (cnt = 0; cnt < pAnimCache.value.ubCacheSize; cnt++) {
      AnimDebugMsg(String("Anim Cache: Slot %d Hits %d ( Soldier %d )", cnt, pAnimCache.value.sCacheHits[cnt], usSoldierID));

      if (pAnimCache.value.usCachedSurfaces[cnt] == usCurrentAnimSurface) {
        AnimDebugMsg(String("Anim Cache: REJECTING Slot %d EXISTING ANIM SURFACE ( Soldier %d )", cnt, usSoldierID));
      } else {
        if (pAnimCache.value.sCacheHits[cnt] < sMostHits) {
          sMostHits = pAnimCache.value.sCacheHits[cnt];
          ubLowestIndex = cnt;
        }
      }
    }

    // Bump off lowest index
    AnimDebugMsg(String("Anim Cache: Bumping %d ( Soldier %d )", ubLowestIndex, usSoldierID));
    UnLoadAnimationSurface(usSoldierID, pAnimCache.value.usCachedSurfaces[ubLowestIndex]);

    // Decrement
    pAnimCache.value.sCacheHits[ubLowestIndex] = 0;
    pAnimCache.value.usCachedSurfaces[ubLowestIndex] = EMPTY_CACHE_ENTRY;
    pAnimCache.value.ubCacheSize--;
  }

  // If here, Insert at an empty slot
  // Find an empty slot
  for (cnt = 0; cnt < guiCacheSize; cnt++) {
    if (pAnimCache.value.usCachedSurfaces[cnt] == EMPTY_CACHE_ENTRY) {
      AnimDebugMsg(String("Anim Cache: Loading Surface %d ( Soldier %d )", usSurfaceIndex, usSoldierID));

      // Insert here
      CHECKF(LoadAnimationSurface(usSoldierID, usSurfaceIndex, usCurrentAnimation) != false);
      pAnimCache.value.sCacheHits[cnt] = 0;
      pAnimCache.value.usCachedSurfaces[cnt] = usSurfaceIndex;
      pAnimCache.value.ubCacheSize++;

      break;
    }
  }

  return true;
}

export function UnLoadCachedAnimationSurfaces(usSoldierID: UINT16, pAnimCache: Pointer<AnimationSurfaceCacheType>): void {
  let cnt: UINT8;

  // Check to see if surface exists already
  for (cnt = 0; cnt < pAnimCache.value.ubCacheSize; cnt++) {
    if (pAnimCache.value.usCachedSurfaces[cnt] != EMPTY_CACHE_ENTRY) {
      UnLoadAnimationSurface(usSoldierID, pAnimCache.value.usCachedSurfaces[cnt]);
    }
  }
}
