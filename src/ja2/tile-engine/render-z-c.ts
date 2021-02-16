namespace ja2 {

let gsRScreenCenterX: INT16;
let gsRScreenCenterY: INT16;
let gsRDistToCenterY: INT16;
let gsRDistToCenterX: INT16;

const GetMapXYWorldY = (sWorldCellX: INT16, sWorldCellY: INT16): INT16 => {
  gsRDistToCenterX = (sWorldCellX * CELL_X_SIZE) - gCenterWorldX;
  gsRDistToCenterY = (sWorldCellY * CELL_Y_SIZE) - gCenterWorldY;
  gsRScreenCenterY = gsRDistToCenterX + gsRDistToCenterY;
  return gsRScreenCenterY + gsCY - gsTLY;
};

const GetMapXYWorldYFromCellCoords = (sWorldCellX: INT16, sWorldCellY: INT16, sWorldY: INT16) => {
  gsRDistToCenterX = sWorldCellX - gCenterWorldX;
  gsRDistToCenterY = sWorldCellY - gCenterWorldY;
  gsRScreenCenterY = gsRDistToCenterX + gsRDistToCenterY;
  sWorldY = gsRScreenCenterY + gsCY - gsTLY;
};

export const LandZLevel = (sMapX: INT16, sMapY: INT16): INT16 => {
  return LAND_Z_LEVEL;
};

export const ObjectZLevel = (TileElem: TILE_ELEMENT, uiTileElemFlags: UINT32, sMapX: INT16, sMapY: INT16): INT16 => {
  let sWorldY: INT16 = GetMapXYWorldY(sMapX, sMapY);
  if (uiTileElemFlags & CLIFFHANG_TILE) {
    return LAND_Z_LEVEL;
  } else if (uiTileElemFlags & OBJECTLAYER_USEZHEIGHT) {
    return ((sWorldY) * Z_SUBLAYERS) + LAND_Z_LEVEL;
  } else {
    return OBJECT_Z_LEVEL;
  }
};

export const StructZLevel = (uiLevelNodeFlags: UINT32, pCorpse: ROTTING_CORPSE, pNode: LEVELNODE, uiAniTileFlags: UINT32, sMapX: INT16, sMapY: INT16): INT16 => {
  let sWorldY: INT16 = GetMapXYWorldY(sMapX, sMapY);
  let sZOffsetX: INT16 = -1;
  let sZOffsetY: INT16 = -1;
  let sZLevel: INT16;
  if ((uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE)) {
    if (pCorpse.def.usFlags & ROTTING_CORPSE_VEHICLE) {
      if (pNode.pStructureData != null) {
        sZOffsetX = pNode.pStructureData.pDBStructureRef.pDBStructure.bZTileOffsetX;
        sZOffsetY = pNode.pStructureData.pDBStructureRef.pDBStructure.bZTileOffsetY;
      }
      sWorldY = GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY));
      sWorldY = GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY));
      sZLevel = ((sWorldY) * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
    } else {
      sZOffsetX = -1;
      sZOffsetY = -1;
      sWorldY =GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY));
      sWorldY += 20;
      sZLevel = ((sWorldY) * Z_SUBLAYERS) + LAND_Z_LEVEL;
    }
  } else if (uiLevelNodeFlags & LEVELNODE_PHYSICSOBJECT) {
    sWorldY += pNode.sRelativeZ;
    sZLevel = (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
  } else if (uiLevelNodeFlags & LEVELNODE_ITEM) {
    if (pNode.pItemPool.bRenderZHeightAboveLevel > 0) {
      sZLevel = (sWorldY * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
      sZLevel += (pNode.pItemPool.bRenderZHeightAboveLevel);
    } else {
      sZLevel = (sWorldY * Z_SUBLAYERS) + OBJECT_Z_LEVEL;
    }
  } else if (uiAniTileFlags & ANITILE_SMOKE_EFFECT) {
    sZLevel = (sWorldY * Z_SUBLAYERS) + OBJECT_Z_LEVEL;
  } else if ((uiLevelNodeFlags & LEVELNODE_USEZ)) {
    if ((uiLevelNodeFlags & LEVELNODE_NOZBLITTER)) {
      sWorldY += 40;
    } else {
      sWorldY += pNode.sRelativeZ;
    }
    sZLevel = (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
  } else {
    sZLevel = (sWorldY * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
  }

  return sZLevel;
};

export const RoofZLevel = (sMapX: INT16, sMapY: INT16): INT16 => {
  let sWorldY: INT16 = GetMapXYWorldY(sMapX, sMapY);
  sWorldY += WALL_HEIGHT;
  return (sWorldY * Z_SUBLAYERS) + ROOF_Z_LEVEL;
};

export const OnRoofZLevel = (uiLevelNodeFlags: UINT32, sMapX: INT16, sMapY: INT16): INT16 => {
  let sWorldY: INT16 = GetMapXYWorldY(sMapX, sMapY);
  if (uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE) {
    sWorldY += (WALL_HEIGHT + 40);
  }
  if (uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE) {
    sWorldY += (WALL_HEIGHT + 40);
  } else {
    sWorldY += WALL_HEIGHT;
  }
  return (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
};

export const TopmostZLevel = (sMapX: INT16, sMapY: INT16): INT16 => {
  let sWorldY: INT16 = GetMapXYWorldY(sMapX, sMapY);
  return TOPMOST_Z_LEVEL;
};

export const ShadowZLevel = (sMapX: INT16, sMapY: INT16): INT16 => {
  let sWorldY: INT16 = GetMapXYWorldY(sMapX, sMapY);
  return Math.max(((sWorldY - 80) * Z_SUBLAYERS) + SHADOW_Z_LEVEL, 0);
};

export const SoldierZLevel = (pSoldier: SOLDIERTYPE, pNode: LEVELNODE, sMapX: INT16, sMapY: INT16, gsForceSoldierZLevel: INT16): INT16 => {
  let sWorldY: INT16;
  let sZOffsetX: INT16 = -1;
  let sZOffsetY: INT16 = -1;
  let sZLevel: INT16;
  if ((pSoldier.uiStatusFlags & SOLDIER_MULTITILE)) {
    if (pNode.pStructureData != null) {
      sZOffsetX = pNode.pStructureData.pDBStructureRef.pDBStructure.bZTileOffsetX;
      sZOffsetY = pNode.pStructureData.pDBStructureRef.pDBStructure.bZTileOffsetY;
    }
    sWorldY = GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY));
  } else {
    sWorldY = GetMapXYWorldY(sMapX, sMapY);
  }
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    sZLevel = (sWorldY * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
  } else {
    if (pSoldier.dHeightAdjustment > 0) {
      sWorldY += (WALL_HEIGHT + 20);
      sZLevel = (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
    } else {
      if ((pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
        sZLevel = (sWorldY * Z_SUBLAYERS) + MERC_Z_LEVEL;
      } else {
        sZLevel = (sWorldY * Z_SUBLAYERS) + MERC_Z_LEVEL;
      }
    }
    if (pSoldier.sZLevelOverride != -1) {
      sZLevel = pSoldier.sZLevelOverride;
    }
    if (gsForceSoldierZLevel != 0) {
      sZLevel = gsForceSoldierZLevel;
    }
  }
  return sZLevel;
};

//#if 0
//		sZOffsetX = pNode->pStructureData->pDBStructureRef->pDBStructure->bZTileOffsetX;\
////		sZOffsetY = pNode->pStructureData->pDBStructureRef->pDBStructure->bZTileOffsetY;\
//#endif

export function getZValue(zBuffer: Uint8ClampedArray, index: number) {
  return (zBuffer[index]) | (zBuffer[index + 1] << 8);
}

export function setZValue(zBuffer: Uint8ClampedArray, index: number, value: number) {
  zBuffer[index] = (value & 0xFF);
  zBuffer[index + 1] = ((value >> 8) & 0xFF);
}

}
