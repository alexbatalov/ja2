namespace ja2 {

export const BULLET_FLAG_CREATURE_SPIT = 0x0001;
export const BULLET_FLAG_KNIFE = 0x0002;
export const BULLET_FLAG_MISSILE = 0x0004;
export const BULLET_FLAG_SMALL_MISSILE = 0x0008;
export const BULLET_STOPPED = 0x0010;
export const BULLET_FLAG_TANK_CANNON = 0x0020;
export const BULLET_FLAG_BUCKSHOT = 0x0040;
export const BULLET_FLAG_FLAME = 0x0080;

export interface BULLET {
  iBullet: INT32;
  ubFirerID: UINT8;
  ubTargetID: UINT8;
  bStartCubesAboveLevelZ: INT8;
  bEndCubesAboveLevelZ: INT8;
  sGridNo: UINT32;
  sUnused: INT16;
  usLastStructureHit: UINT16;
  qCurrX: FIXEDPT;
  qCurrY: FIXEDPT;
  qCurrZ: FIXEDPT;
  qIncrX: FIXEDPT;
  qIncrY: FIXEDPT;
  qIncrZ: FIXEDPT;
  ddHorizAngle: DOUBLE;
  iCurrTileX: INT32;
  iCurrTileY: INT32;
  bLOSIndexX: INT8;
  bLOSIndexY: INT8;
  fCheckForRoof: boolean;
  iCurrCubesZ: INT32;
  iLoop: INT32;
  fAllocated: boolean;
  fToDelete: boolean;
  fLocated: boolean;
  fReal: boolean;
  fAimed: boolean;
  uiLastUpdate: UINT32;
  ubTilesPerUpdate: UINT8;
  usClockTicksPerUpdate: UINT16;
  pFirer: Pointer<SOLDIERTYPE>;
  sTargetGridNo: UINT32;
  sHitBy: INT16;
  iImpact: INT32;
  iImpactReduction: INT32;
  iRange: INT32;
  iDistanceLimit: INT32;
  usFlags: UINT16;
  pAniTile: Pointer<ANITILE>;
  pShadowAniTile: Pointer<ANITILE>;
  ubItemStatus: UINT8;
}

}
