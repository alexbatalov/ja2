const BULLET_FLAG_CREATURE_SPIT = 0x0001;
const BULLET_FLAG_KNIFE = 0x0002;
const BULLET_FLAG_MISSILE = 0x0004;
const BULLET_FLAG_SMALL_MISSILE = 0x0008;
const BULLET_STOPPED = 0x0010;
const BULLET_FLAG_TANK_CANNON = 0x0020;
const BULLET_FLAG_BUCKSHOT = 0x0040;
const BULLET_FLAG_FLAME = 0x0080;

interface BULLET {
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
  fCheckForRoof: BOOLEAN;
  iCurrCubesZ: INT32;
  iLoop: INT32;
  fAllocated: BOOLEAN;
  fToDelete: BOOLEAN;
  fLocated: BOOLEAN;
  fReal: BOOLEAN;
  fAimed: BOOLEAN;
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

extern UINT32 guiNumBullets;

INT32 CreateBullet(UINT8 ubFirer, BOOLEAN fFake, UINT16 usFlags);
void RemoveBullet(INT32 iBullet);
void StopBullet(INT32 iBullet);
void UpdateBullets();
BULLET *GetBulletPtr(INT32 iBullet);

void DeleteAllBullets();

void LocateBullet(INT32 iBulletIndex);

void HandleBulletSpecialFlags(INT32 iBulletIndex);

void AddMissileTrail(BULLET *pBullet, FIXEDPT qCurrX, FIXEDPT qCurrY, FIXEDPT qCurrZ);

// Save the bullet table to the saved game file
BOOLEAN SaveBulletStructureToSaveGameFile(HWFILE hFile);

// Load the bullet table from the saved game file
BOOLEAN LoadBulletStructureFromSavedGameFile(HWFILE hFile);
