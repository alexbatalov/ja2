let gsRScreenCenterX: INT16;
let gsRScreenCenterY: INT16;
let gsRDistToCenterY: INT16;
let gsRDistToCenterX: INT16;

const GetMapXYWorldY = (sWorldCellX, sWorldCellY, sWorldY) => {
  gsRDistToCenterX = (sWorldCellX * CELL_X_SIZE) - gCenterWorldX;
  gsRDistToCenterY = (sWorldCellY * CELL_Y_SIZE) - gCenterWorldY;
  gsRScreenCenterY = gsRDistToCenterX + gsRDistToCenterY;
  sWorldY = gsRScreenCenterY + gsCY - gsTLY;
};

const GetMapXYWorldYFromCellCoords = (sWorldCellX, sWorldCellY, sWorldY) => {
  gsRDistToCenterX = sWorldCellX - gCenterWorldX;
  gsRDistToCenterY = sWorldCellY - gCenterWorldY;
  gsRScreenCenterY = gsRDistToCenterX + gsRDistToCenterY;
  sWorldY = gsRScreenCenterY + gsCY - gsTLY;
};

const LandZLevel = (sMapX, sMapY) => {
  sZLevel = LAND_Z_LEVEL;
};

const ObjectZLevel = (TileElem, pNode, sMapX, sMapY) => {
  GetMapXYWorldY(sMapX, sMapY, sWorldY);
  if (uiTileElemFlags & CLIFFHANG_TILE) {
    sZLevel = LAND_Z_LEVEL;
  } else if (uiTileElemFlags & OBJECTLAYER_USEZHEIGHT) {
    sZLevel = ((sWorldY) * Z_SUBLAYERS) + LAND_Z_LEVEL;
  } else {
    sZLevel = OBJECT_Z_LEVEL;
  }
};

const StructZLevel = (sMapX, sMapY) => {
  GetMapXYWorldY(sMapX, sMapY, sWorldY);
  if ((uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE)) {
    if (pCorpse.value.def.usFlags & ROTTING_CORPSE_VEHICLE) {
      if (pNode.value.pStructureData != null) {
        sZOffsetX = pNode.value.pStructureData.value.pDBStructureRef.value.pDBStructure.value.bZTileOffsetX;
        sZOffsetY = pNode.value.pStructureData.value.pDBStructureRef.value.pDBStructure.value.bZTileOffsetY;
      }
      GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY), sWorldY);
      GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY), sWorldY);
      sZLevel = ((sWorldY) * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
    } else {
      sZOffsetX = -1;
      sZOffsetY = -1;
      GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY), sWorldY);
      sWorldY += 20;
      sZLevel = ((sWorldY) * Z_SUBLAYERS) + LAND_Z_LEVEL;
    }
  } else if (uiLevelNodeFlags & LEVELNODE_PHYSICSOBJECT) {
    sWorldY += pNode.value.sRelativeZ;
    sZLevel = (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
  } else if (uiLevelNodeFlags & LEVELNODE_ITEM) {
    if (pNode.value.pItemPool.value.bRenderZHeightAboveLevel > 0) {
      sZLevel = (sWorldY * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
      sZLevel += (pNode.value.pItemPool.value.bRenderZHeightAboveLevel);
    } else {
      sZLevel = (sWorldY * Z_SUBLAYERS) + OBJECT_Z_LEVEL;
    }
  } else if (uiAniTileFlags & ANITILE_SMOKE_EFFECT) {
    sZLevel = (sWorldY * Z_SUBLAYERS) + OBJECT_Z_LEVEL;
  } else if ((uiLevelNodeFlags & LEVELNODE_USEZ)) {
    if ((uiLevelNodeFlags & LEVELNODE_NOZBLITTER)) {
      sWorldY += 40;
    } else {
      sWorldY += pNode.value.sRelativeZ;
    }
    sZLevel = (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
  } else {
    sZLevel = (sWorldY * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
  }
};

const RoofZLevel = (sMapX, sMapY) => {
  GetMapXYWorldY(sMapX, sMapY, sWorldY);
  sWorldY += WALL_HEIGHT;
  sZLevel = (sWorldY * Z_SUBLAYERS) + ROOF_Z_LEVEL;
};

const OnRoofZLevel = (sMapX, sMapY) => {
  GetMapXYWorldY(sMapX, sMapY, sWorldY);
  if (uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE) {
    sWorldY += (WALL_HEIGHT + 40);
  }
  if (uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE) {
    sWorldY += (WALL_HEIGHT + 40);
  } else {
    sWorldY += WALL_HEIGHT;
  }
  sZLevel = (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
};

const TopmostZLevel = (sMapX, sMapY) => {
  GetMapXYWorldY(sMapX, sMapY, sWorldY);
  sZLevel = TOPMOST_Z_LEVEL;
};

const ShadowZLevel = (sMapX, sMapY) => {
  GetMapXYWorldY(sMapX, sMapY, sWorldY);
  sZLevel = Math.max(((sWorldY - 80) * Z_SUBLAYERS) + SHADOW_Z_LEVEL, 0);
};

const SoldierZLevel = (pSoldier, sMapX, sMapY) => {
  if ((pSoldier.value.uiStatusFlags & SOLDIER_MULTITILE)) {
    if (pNode.value.pStructureData != null) {
      sZOffsetX = pNode.value.pStructureData.value.pDBStructureRef.value.pDBStructure.value.bZTileOffsetX;
      sZOffsetY = pNode.value.pStructureData.value.pDBStructureRef.value.pDBStructure.value.bZTileOffsetY;
    }
    GetMapXYWorldY((sMapX + sZOffsetX), (sMapY + sZOffsetY), sWorldY);
  } else {
    GetMapXYWorldY(sMapX, sMapY, sWorldY);
  }
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    sZLevel = (sWorldY * Z_SUBLAYERS) + STRUCT_Z_LEVEL;
  } else {
    if (pSoldier.value.dHeightAdjustment > 0) {
      sWorldY += (WALL_HEIGHT + 20);
      sZLevel = (sWorldY * Z_SUBLAYERS) + ONROOF_Z_LEVEL;
    } else {
      if ((pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
        sZLevel = (sWorldY * Z_SUBLAYERS) + MERC_Z_LEVEL;
      } else {
        sZLevel = (sWorldY * Z_SUBLAYERS) + MERC_Z_LEVEL;
      }
    }
    if (pSoldier.value.sZLevelOverride != -1) {
      sZLevel = pSoldier.value.sZLevelOverride;
    }
    if (gsForceSoldierZLevel != 0) {
      sZLevel = gsForceSoldierZLevel;
    }
  }
};

//#if 0
//		sZOffsetX = pNode->pStructureData->pDBStructureRef->pDBStructure->bZTileOffsetX;\
////		sZOffsetY = pNode->pStructureData->pDBStructureRef->pDBStructure->bZTileOffsetY;\
//#endif
