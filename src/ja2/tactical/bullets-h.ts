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
  pFirer: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;
  sTargetGridNo: UINT32;
  sHitBy: INT16;
  iImpact: INT32;
  iImpactReduction: INT32;
  iRange: INT32;
  iDistanceLimit: INT32;
  usFlags: UINT16;
  pAniTile: ANITILE | null /* Pointer<ANITILE> */;
  pShadowAniTile: ANITILE | null /* Pointer<ANITILE> */;
  ubItemStatus: UINT8;
}

export function createBullet(): BULLET {
  return {
    iBullet: 0,
    ubFirerID: 0,
    ubTargetID: 0,
    bStartCubesAboveLevelZ: 0,
    bEndCubesAboveLevelZ: 0,
    sGridNo: 0,
    sUnused: 0,
    usLastStructureHit: 0,
    qCurrX: 0,
    qCurrY: 0,
    qCurrZ: 0,
    qIncrX: 0,
    qIncrY: 0,
    qIncrZ: 0,
    ddHorizAngle: 0,
    iCurrTileX: 0,
    iCurrTileY: 0,
    bLOSIndexX: 0,
    bLOSIndexY: 0,
    fCheckForRoof: false,
    iCurrCubesZ: 0,
    iLoop: 0,
    fAllocated: false,
    fToDelete: false,
    fLocated: false,
    fReal: false,
    fAimed: false,
    uiLastUpdate: 0,
    ubTilesPerUpdate: 0,
    usClockTicksPerUpdate: 0,
    pFirer: <SOLDIERTYPE><unknown>null,
    sTargetGridNo: 0,
    sHitBy: 0,
    iImpact: 0,
    iImpactReduction: 0,
    iRange: 0,
    iDistanceLimit: 0,
    usFlags: 0,
    pAniTile: null,
    pShadowAniTile: null,
    ubItemStatus: 0,
  };
}

export function resetBullet(o: BULLET) {
  o.iBullet = 0;
  o.ubFirerID = 0;
  o.ubTargetID = 0;
  o.bStartCubesAboveLevelZ = 0;
  o.bEndCubesAboveLevelZ = 0;
  o.sGridNo = 0;
  o.sUnused = 0;
  o.usLastStructureHit = 0;
  o.qCurrX = 0;
  o.qCurrY = 0;
  o.qCurrZ = 0;
  o.qIncrX = 0;
  o.qIncrY = 0;
  o.qIncrZ = 0;
  o.ddHorizAngle = 0;
  o.iCurrTileX = 0;
  o.iCurrTileY = 0;
  o.bLOSIndexX = 0;
  o.bLOSIndexY = 0;
  o.fCheckForRoof = false;
  o.iCurrCubesZ = 0;
  o.iLoop = 0;
  o.fAllocated = false;
  o.fToDelete = false;
  o.fLocated = false;
  o.fReal = false;
  o.fAimed = false;
  o.uiLastUpdate = 0;
  o.ubTilesPerUpdate = 0;
  o.usClockTicksPerUpdate = 0;
  o.pFirer = <SOLDIERTYPE><unknown>null;
  o.sTargetGridNo = 0;
  o.sHitBy = 0;
  o.iImpact = 0;
  o.iImpactReduction = 0;
  o.iRange = 0;
  o.iDistanceLimit = 0;
  o.usFlags = 0;
  o.pAniTile = null;
  o.pShadowAniTile = null;
  o.ubItemStatus = 0;
}

export const BULLET_SIZE = 128;

export function readBullet(o: BULLET, buffer: Buffer, offset: number = 0): number {
  o.iBullet = buffer.readInt32LE(offset); offset += 4;
  o.ubFirerID = buffer.readUInt8(offset++);
  o.ubTargetID = buffer.readUInt8(offset++);
  o.bStartCubesAboveLevelZ = buffer.readInt8(offset++);
  o.bEndCubesAboveLevelZ = buffer.readInt8(offset++);
  o.sGridNo = buffer.readUInt32LE(offset); offset += 4;
  o.sUnused = buffer.readInt16LE(offset); offset += 2;
  o.usLastStructureHit = buffer.readUInt16LE(offset); offset += 2;
  o.qCurrX = buffer.readInt32LE(offset); offset += 4;;
  o.qCurrY = buffer.readInt32LE(offset); offset += 4;;
  o.qCurrZ = buffer.readInt32LE(offset); offset += 4;;
  o.qIncrX = buffer.readInt32LE(offset); offset += 4;;
  o.qIncrY = buffer.readInt32LE(offset); offset += 4;;
  o.qIncrZ = buffer.readInt32LE(offset); offset += 4;;
  o.ddHorizAngle = buffer.readDoubleLE(offset); offset += 8;
  o.iCurrTileX = buffer.readInt32LE(offset); offset += 4;
  o.iCurrTileY = buffer.readInt32LE(offset); offset += 4;
  o.bLOSIndexX = buffer.readInt8(offset++);
  o.bLOSIndexY = buffer.readInt8(offset++);
  o.fCheckForRoof = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.iCurrCubesZ = buffer.readInt32LE(offset); offset += 4;
  o.iLoop = buffer.readInt32LE(offset); offset += 4;
  o.fAllocated = Boolean(buffer.readUInt8(offset++));
  o.fToDelete = Boolean(buffer.readUInt8(offset++));
  o.fLocated = Boolean(buffer.readUInt8(offset++));
  o.fReal = Boolean(buffer.readUInt8(offset++));
  o.fAimed = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.uiLastUpdate = buffer.readUInt32LE(offset); offset += 4;
  o.ubTilesPerUpdate = buffer.readUInt8(offset++);
  offset++; // padding
  o.usClockTicksPerUpdate = buffer.readUInt16LE(offset); offset += 2;
  offset += 4; // pFirer (pointer)
  o.sTargetGridNo = buffer.readUInt32LE(offset); offset += 4;
  o.sHitBy = buffer.readInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.iImpact = buffer.readInt32LE(offset); offset += 4;
  o.iImpactReduction = buffer.readInt32LE(offset); offset += 4;
  o.iRange = buffer.readInt32LE(offset); offset += 4;
  o.iDistanceLimit = buffer.readInt32LE(offset); offset += 4;
  o.usFlags = buffer.readUInt16LE(offset); offset += 2;
  offset += 2; // padding
  offset += 4; // pAniTile (pointer)
  offset += 4; // pShadowAniTile (pointer)
  o.ubItemStatus = buffer.readUInt8(offset++);
  offset += 3; // padding
  return offset;
}

export function writeBullet(o: BULLET, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt32LE(o.iBullet, offset);
  offset = buffer.writeUInt8(o.ubFirerID, offset);
  offset = buffer.writeUInt8(o.ubTargetID, offset);
  offset = buffer.writeInt8(o.bStartCubesAboveLevelZ, offset);
  offset = buffer.writeInt8(o.bEndCubesAboveLevelZ, offset);
  offset = buffer.writeUInt32LE(o.sGridNo, offset);
  offset = buffer.writeInt16LE(o.sUnused, offset);
  offset = buffer.writeUInt16LE(o.usLastStructureHit, offset);
  offset = buffer.writeInt32LE(o.qCurrX, offset);
  offset = buffer.writeInt32LE(o.qCurrY, offset);
  offset = buffer.writeInt32LE(o.qCurrZ, offset);
  offset = buffer.writeInt32LE(o.qIncrX, offset);
  offset = buffer.writeInt32LE(o.qIncrY, offset);
  offset = buffer.writeInt32LE(o.qIncrZ, offset);
  offset = buffer.writeDoubleLE(o.ddHorizAngle, offset);
  offset = buffer.writeInt32LE(o.iCurrTileX, offset);
  offset = buffer.writeInt32LE(o.iCurrTileY, offset);
  offset = buffer.writeInt8(o.bLOSIndexX, offset);
  offset = buffer.writeInt8(o.bLOSIndexY, offset);
  offset = buffer.writeUInt8(Number(o.fCheckForRoof), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt32LE(o.iCurrCubesZ, offset);
  offset = buffer.writeInt32LE(o.iLoop, offset);
  offset = buffer.writeUInt8(Number(o.fAllocated), offset);
  offset = buffer.writeUInt8(Number(o.fToDelete), offset);
  offset = buffer.writeUInt8(Number(o.fLocated), offset);
  offset = buffer.writeUInt8(Number(o.fReal), offset);
  offset = buffer.writeUInt8(Number(o.fAimed), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiLastUpdate, offset);
  offset = buffer.writeUInt8(o.ubTilesPerUpdate, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usClockTicksPerUpdate, offset);
  offset = writePadding(buffer, offset, 4); // pFirer (pointer)
  offset = buffer.writeUInt32LE(o.sTargetGridNo, offset);
  offset = buffer.writeInt16LE(o.sHitBy, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeInt32LE(o.iImpact, offset);
  offset = buffer.writeInt32LE(o.iImpactReduction, offset);
  offset = buffer.writeInt32LE(o.iRange, offset);
  offset = buffer.writeInt32LE(o.iDistanceLimit, offset);
  offset = buffer.writeUInt16LE(o.usFlags, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // pAniTile (pointer)
  offset = writePadding(buffer, offset, 4); // pShadowAniTile (pointer)
  offset = buffer.writeUInt8(o.ubItemStatus, offset);
  offset = writePadding(buffer, offset, 3); // padding
  return offset;
}

}
