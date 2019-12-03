namespace ja2 {

let pAniTileHead: ANITILE | null = null;

export function CreateAnimationTile(pAniParams: ANITILE_PARAMS): ANITILE | null {
  let pAniNode: ANITILE | null;
  let pNewAniNode: ANITILE;
  let pNode: LEVELNODE | null;
  let iCachedTile: INT32 = -1;
  let sGridNo: INT16;
  let ubLevel: UINT8;
  let usTileType: INT16;
  let usTileIndex: INT16;
  let sDelay: INT16;
  let sStartFrame: INT16 = -1;
  let uiFlags: UINT32;
  let pGivenNode: LEVELNODE | null;
  let sX: INT16;
  let sY: INT16;
  let sZ: INT16;
  let ubTempDir: UINT8;

  // Get some parameters from structure sent in...
  sGridNo = pAniParams.sGridNo;
  ubLevel = pAniParams.ubLevelID;
  usTileType = pAniParams.usTileType;
  usTileIndex = pAniParams.usTileIndex;
  sDelay = pAniParams.sDelay;
  sStartFrame = pAniParams.sStartFrame;
  uiFlags = pAniParams.uiFlags;
  pGivenNode = pAniParams.pGivenLevelNode;
  sX = pAniParams.sX;
  sY = pAniParams.sY;
  sZ = pAniParams.sZ;

  pAniNode = pAniTileHead;

  // Allocate head
  pNewAniNode = createAnimatedTile();

  if ((uiFlags & ANITILE_EXISTINGTILE)) {
    pNewAniNode.pLevelNode = <LEVELNODE>pGivenNode;
    pNewAniNode.pLevelNode.pAniTile = pNewAniNode;
  } else {
    if ((uiFlags & ANITILE_CACHEDTILE)) {
      iCachedTile = GetCachedTile(pAniParams.zCachedFile);

      if (iCachedTile == -1) {
        return null;
      }

      usTileIndex = iCachedTile + TILE_CACHE_START_INDEX;
    }

    // ALLOCATE NEW TILE
    switch (ubLevel) {
      case ANI_STRUCT_LEVEL:

        pNode = ForceStructToTail(sGridNo, usTileIndex);
        break;

      case ANI_SHADOW_LEVEL:

        AddShadowToHead(sGridNo, usTileIndex);
        pNode = gpWorldLevelData[sGridNo].pShadowHead;
        break;

      case ANI_OBJECT_LEVEL:

        AddObjectToHead(sGridNo, usTileIndex);
        pNode = gpWorldLevelData[sGridNo].pObjectHead;
        break;

      case ANI_ROOF_LEVEL:

        AddRoofToHead(sGridNo, usTileIndex);
        pNode = gpWorldLevelData[sGridNo].pRoofHead;
        break;

      case ANI_ONROOF_LEVEL:

        AddOnRoofToHead(sGridNo, usTileIndex);
        pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
        break;

      case ANI_TOPMOST_LEVEL:

        AddTopmostToHead(sGridNo, usTileIndex);
        pNode = gpWorldLevelData[sGridNo].pTopmostHead;
        break;

      default:

        return null;
    }

    // SET NEW TILE VALUES
    Assert(pNode);
    pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
    pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

    pNewAniNode.pLevelNode = pNode;

    if ((uiFlags & ANITILE_CACHEDTILE)) {
      pNewAniNode.pLevelNode.uiFlags |= (LEVELNODE_CACHEDANITILE);
      pNewAniNode.sCachedTileID = iCachedTile;
      pNewAniNode.usCachedTileSubIndex = usTileType;
      pNewAniNode.pLevelNode.pAniTile = pNewAniNode;
      pNewAniNode.sRelativeX = sX;
      pNewAniNode.sRelativeY = sY;
      pNewAniNode.pLevelNode.sRelativeZ = sZ;
    }
    // Can't set relative X,Y,Z IF FLAGS ANITILE_CACHEDTILE set!
    else if ((uiFlags & ANITILE_USEABSOLUTEPOS)) {
      pNewAniNode.pLevelNode.sRelativeX = sX;
      pNewAniNode.pLevelNode.sRelativeY = sY;
      pNewAniNode.pLevelNode.sRelativeZ = sZ;
      pNewAniNode.pLevelNode.uiFlags |= (LEVELNODE_USEABSOLUTEPOS);
    }
  }

  switch (ubLevel) {
    case ANI_STRUCT_LEVEL:

      ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
      break;

    case ANI_SHADOW_LEVEL:

      ResetSpecificLayerOptimizing(TILES_DYNAMIC_SHADOWS);
      break;

    case ANI_OBJECT_LEVEL:

      ResetSpecificLayerOptimizing(TILES_DYNAMIC_OBJECTS);
      break;

    case ANI_ROOF_LEVEL:

      ResetSpecificLayerOptimizing(TILES_DYNAMIC_ROOF);
      break;

    case ANI_ONROOF_LEVEL:

      ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
      break;

    case ANI_TOPMOST_LEVEL:

      ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
      break;
  }

  // SET FLAGS FOR LEVELNODE
  pNewAniNode.pLevelNode.uiFlags |= (LEVELNODE_ANIMATION | LEVELNODE_USEZ | LEVELNODE_DYNAMIC);

  if ((uiFlags & ANITILE_NOZBLITTER)) {
    pNewAniNode.pLevelNode.uiFlags |= LEVELNODE_NOZBLITTER;
  }

  if ((uiFlags & ANITILE_ALWAYS_TRANSLUCENT)) {
    pNewAniNode.pLevelNode.uiFlags |= LEVELNODE_REVEAL;
  }

  if ((uiFlags & ANITILE_USEBEST_TRANSLUCENT)) {
    pNewAniNode.pLevelNode.uiFlags |= LEVELNODE_USEBESTTRANSTYPE;
  }

  if ((uiFlags & ANITILE_ANIMATE_Z)) {
    pNewAniNode.pLevelNode.uiFlags |= LEVELNODE_DYNAMICZ;
  }

  if ((uiFlags & ANITILE_PAUSED)) {
    pNewAniNode.pLevelNode.uiFlags |= (LEVELNODE_LASTDYNAMIC | LEVELNODE_UPDATESAVEBUFFERONCE);
    pNewAniNode.pLevelNode.uiFlags &= (~LEVELNODE_DYNAMIC);
  }

  if ((uiFlags & ANITILE_OPTIMIZEFORSMOKEEFFECT)) {
    pNewAniNode.pLevelNode.uiFlags |= LEVELNODE_NOWRITEZ;
  }

  // SET ANITILE VALUES
  pNewAniNode.ubLevelID = ubLevel;
  pNewAniNode.usTileIndex = usTileIndex;

  if ((uiFlags & ANITILE_CACHEDTILE)) {
    pNewAniNode.usNumFrames = gpTileCache[iCachedTile].ubNumFrames;
  } else {
    Assert(gTileDatabase[usTileIndex].pAnimData != null);
    pNewAniNode.usNumFrames = (<TILE_ANIMATION_DATA>gTileDatabase[usTileIndex].pAnimData).ubNumFrames;
  }

  if ((uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gOneCDirection[pAniParams.uiUserData3];
    sStartFrame = sStartFrame + (pNewAniNode.usNumFrames * ubTempDir);
  }

  if ((uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gb4DirectionsFrom8[pAniParams.uiUserData3];
    sStartFrame = sStartFrame + (pNewAniNode.usNumFrames * ubTempDir);
  }

  pNewAniNode.usTileType = usTileType;
  pNewAniNode.pNext = pAniNode;
  pNewAniNode.uiFlags = uiFlags;
  pNewAniNode.sDelay = sDelay;
  pNewAniNode.sCurrentFrame = sStartFrame;
  pNewAniNode.uiTimeLastUpdate = GetJA2Clock();
  pNewAniNode.sGridNo = sGridNo;

  pNewAniNode.sStartFrame = sStartFrame;

  pNewAniNode.ubKeyFrame1 = pAniParams.ubKeyFrame1;
  pNewAniNode.uiKeyFrame1Code = pAniParams.uiKeyFrame1Code;
  pNewAniNode.ubKeyFrame2 = pAniParams.ubKeyFrame2;
  pNewAniNode.uiKeyFrame2Code = pAniParams.uiKeyFrame2Code;
  pNewAniNode.uiUserData = pAniParams.uiUserData;
  pNewAniNode.ubUserData2 = pAniParams.ubUserData2;
  pNewAniNode.uiUserData3 = pAniParams.uiUserData3;

  // Set head
  pAniTileHead = pNewAniNode;

  // Set some special stuff
  return pNewAniNode;
}

// Loop throug all ani tiles and remove...
export function DeleteAniTiles(): void {
  let pAniNode: ANITILE | null = null;
  let pNode: ANITILE;

  // LOOP THROUGH EACH NODE
  // And call delete function...
  pAniNode = pAniTileHead;

  while (pAniNode != null) {
    pNode = pAniNode;
    pAniNode = pAniNode.pNext;

    DeleteAniTile(pNode);
  }
}

export function DeleteAniTile(pAniTile: ANITILE): void {
  let pAniNode: ANITILE | null = null;
  let pOldAniNode: ANITILE | null = null;
  let TileElem: TILE_ELEMENT;

  pAniNode = pAniTileHead;

  while (pAniNode != null) {
    if (pAniNode == pAniTile) {
      // OK, set links
      // Check for head or tail
      if (pOldAniNode == null) {
        // It's the head
        pAniTileHead = pAniTile.pNext;
      } else {
        pOldAniNode.pNext = pAniNode.pNext;
      }

      if (!(pAniNode.uiFlags & ANITILE_EXISTINGTILE)) {
        // Delete memory assosiated with item
        switch (pAniNode.ubLevelID) {
          case ANI_STRUCT_LEVEL:

            RemoveStructFromLevelNode(pAniNode.sGridNo, pAniNode.pLevelNode);
            break;

          case ANI_SHADOW_LEVEL:

            RemoveShadowFromLevelNode(pAniNode.sGridNo, pAniNode.pLevelNode);
            break;

          case ANI_OBJECT_LEVEL:

            RemoveObject(pAniNode.sGridNo, pAniNode.usTileIndex);
            break;

          case ANI_ROOF_LEVEL:

            RemoveRoof(pAniNode.sGridNo, pAniNode.usTileIndex);
            break;

          case ANI_ONROOF_LEVEL:

            RemoveOnRoof(pAniNode.sGridNo, pAniNode.usTileIndex);
            break;

          case ANI_TOPMOST_LEVEL:

            RemoveTopmostFromLevelNode(pAniNode.sGridNo, pAniNode.pLevelNode);
            break;
        }

        if ((pAniNode.uiFlags & ANITILE_CACHEDTILE)) {
          RemoveCachedTile(pAniNode.sCachedTileID);
        }

        if (pAniNode.uiFlags & ANITILE_EXPLOSION) {
          // Talk to the explosion data...
          RemoveExplosionData(pAniNode.uiUserData3);

          if (!gfExplosionQueueActive) {
            // turn on sighting again
            // the explosion queue handles all this at the end of the queue
            gTacticalStatus.uiFlags &= (~DISALLOW_SIGHT);
          }

          // Freeup attacker from explosion
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., EXPLOSION effect gone off"));
          ReduceAttackBusyCount(pAniNode.ubUserData2, false);
        }

        if (pAniNode.uiFlags & ANITILE_RELEASE_ATTACKER_WHEN_DONE) {
          // First delete the bullet!
          RemoveBullet(pAniNode.uiUserData3);

          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Freeing up attacker - miss finished animation"));
          FreeUpAttacker(pAniNode.ubAttackerMissed);
        }
      } else {
        TileElem = gTileDatabase[pAniNode.usTileIndex];

        // OK, update existing tile usIndex....
        Assert(TileElem.pAnimData != null);
        pAniNode.pLevelNode.usIndex = TileElem.pAnimData.pusFrames[pAniNode.pLevelNode.sCurrentFrame];

        // OK, set our frame data back to zero....
        pAniNode.pLevelNode.sCurrentFrame = 0;

        // Set some flags to write to Z / update save buffer
        // pAniNode->pLevelNode->uiFlags |=( LEVELNODE_LASTDYNAMIC | LEVELNODE_UPDATESAVEBUFFERONCE );
        pAniNode.pLevelNode.uiFlags &= ~(LEVELNODE_DYNAMIC | LEVELNODE_USEZ | LEVELNODE_ANIMATION);

        if (pAniNode.uiFlags & ANITILE_DOOR) {
          // unset door busy!
          let pDoorStatus: DOOR_STATUS | null;

          pDoorStatus = GetDoorStatus(pAniNode.sGridNo);
          if (pDoorStatus) {
            pDoorStatus.ubFlags &= ~(DOOR_BUSY);
          }

          if (GridNoOnScreen(pAniNode.sGridNo)) {
            SetRenderFlags(RENDER_FLAG_FULL);
          }
        }
      }

      MemFree(pAniNode);
      return;
    }

    pOldAniNode = pAniNode;
    pAniNode = pAniNode.pNext;
  }
}

export function UpdateAniTiles(): void {
  let pAniNode: ANITILE | null = null;
  let pNode: ANITILE;
  let uiClock: UINT32 = GetJA2Clock();
  let usMaxFrames: UINT16;
  let usMinFrames: UINT16;
  let ubTempDir: UINT8;

  // LOOP THROUGH EACH NODE
  pAniNode = pAniTileHead;

  while (pAniNode != null) {
    pNode = pAniNode;
    pAniNode = pAniNode.pNext;

    if ((uiClock - pNode.uiTimeLastUpdate) > pNode.sDelay && !(pNode.uiFlags & ANITILE_PAUSED)) {
      pNode.uiTimeLastUpdate = GetJA2Clock();

      if (pNode.uiFlags & (ANITILE_OPTIMIZEFORSLOWMOVING)) {
        pNode.pLevelNode.uiFlags |= (LEVELNODE_DYNAMIC);
        pNode.pLevelNode.uiFlags &= (~LEVELNODE_LASTDYNAMIC);
      } else if (pNode.uiFlags & (ANITILE_OPTIMIZEFORSMOKEEFFECT)) {
        //	pNode->pLevelNode->uiFlags |= LEVELNODE_DYNAMICZ;
        ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
        pNode.pLevelNode.uiFlags &= (~LEVELNODE_LASTDYNAMIC);
        pNode.pLevelNode.uiFlags |= (LEVELNODE_DYNAMIC);
      }

      if (pNode.uiFlags & ANITILE_FORWARD) {
        usMaxFrames = pNode.usNumFrames;

        if (pNode.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME) {
          ubTempDir = gOneCDirection[pNode.uiUserData3];
          usMaxFrames = usMaxFrames + (pNode.usNumFrames * ubTempDir);
        }

        if (pNode.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME) {
          ubTempDir = gb4DirectionsFrom8[pNode.uiUserData3];
          usMaxFrames = usMaxFrames + (pNode.usNumFrames * ubTempDir);
        }

        if ((pNode.sCurrentFrame + 1) < usMaxFrames) {
          pNode.sCurrentFrame++;
          pNode.pLevelNode.sCurrentFrame = pNode.sCurrentFrame;

          if (pNode.uiFlags & ANITILE_EXPLOSION) {
            // Talk to the explosion data...
            UpdateExplosionFrame(pNode.uiUserData3, pNode.sCurrentFrame);
          }

          // CHECK IF WE SHOULD BE DISPLAYING TRANSLUCENTLY!
          if (pNode.sCurrentFrame == pNode.ubKeyFrame1) {
            switch (pNode.uiKeyFrame1Code) {
              case Enum311.ANI_KEYFRAME_BEGIN_TRANSLUCENCY:

                pNode.pLevelNode.uiFlags |= LEVELNODE_REVEAL;
                break;

              case Enum311.ANI_KEYFRAME_CHAIN_WATER_EXPLOSION:

                IgniteExplosion(pNode.ubUserData2, pNode.pLevelNode.sRelativeX, pNode.pLevelNode.sRelativeY, 0, pNode.sGridNo, (pNode.uiUserData), 0);
                break;

              case Enum311.ANI_KEYFRAME_DO_SOUND:

                PlayJA2Sample(pNode.uiUserData, RATE_11025, SoundVolume(MIDVOLUME, pNode.uiUserData3), 1, SoundDir(pNode.uiUserData3));
                break;
            }
          }

          // CHECK IF WE SHOULD BE DISPLAYING TRANSLUCENTLY!
          if (pNode.sCurrentFrame == pNode.ubKeyFrame2) {
            let ubExpType: UINT8;

            switch (pNode.uiKeyFrame2Code) {
              case Enum311.ANI_KEYFRAME_BEGIN_DAMAGE:

                ubExpType = Explosive[Item[pNode.uiUserData].ubClassIndex].ubType;

                if (ubExpType == Enum287.EXPLOSV_TEARGAS || ubExpType == Enum287.EXPLOSV_MUSTGAS || ubExpType == Enum287.EXPLOSV_SMOKE) {
                  // Do sound....
                  // PlayJA2Sample( AIR_ESCAPING_1, RATE_11025, SoundVolume( HIGHVOLUME, pNode->sGridNo ), 1, SoundDir( pNode->sGridNo ) );
                  NewSmokeEffect(pNode.sGridNo, pNode.uiUserData, gExplosionData[pNode.uiUserData3].Params.bLevel, pNode.ubUserData2);
                } else {
                  SpreadEffect(pNode.sGridNo, Explosive[Item[pNode.uiUserData].ubClassIndex].ubRadius, pNode.uiUserData, pNode.ubUserData2, 0, gExplosionData[pNode.uiUserData3].Params.bLevel, -1);
                }
                // Forfait any other animations this frame....
                return;
            }
          }
        } else {
          // We are done!
          if (pNode.uiFlags & ANITILE_LOOPING) {
            pNode.sCurrentFrame = pNode.sStartFrame;

            if ((pNode.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gOneCDirection[pNode.uiUserData3];
              pNode.sCurrentFrame = (pNode.usNumFrames * ubTempDir);
            }

            if ((pNode.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gb4DirectionsFrom8[pNode.uiUserData3];
              pNode.sCurrentFrame = (pNode.usNumFrames * ubTempDir);
            }
          } else if (pNode.uiFlags & ANITILE_REVERSE_LOOPING) {
            // Turn off backwards flag
            pNode.uiFlags &= (~ANITILE_FORWARD);

            // Turn onn forwards flag
            pNode.uiFlags |= ANITILE_BACKWARD;
          } else {
            // Delete from world!
            DeleteAniTile(pNode);

            // Turn back on redunency checks!
            gTacticalStatus.uiFlags &= (~NOHIDE_REDUNDENCY);

            return;
          }
        }
      }

      if (pNode.uiFlags & ANITILE_BACKWARD) {
        if (pNode.uiFlags & ANITILE_ERASEITEMFROMSAVEBUFFFER) {
          // ATE: Check if bounding box is on the screen...
          if (pNode.bFrameCountAfterStart == 0) {
            pNode.bFrameCountAfterStart = 1;
            pNode.pLevelNode.uiFlags |= (LEVELNODE_DYNAMIC);

            // Dangerous here, since we may not even be on the screen...
            SetRenderFlags(RENDER_FLAG_FULL);

            continue;
          }
        }

        usMinFrames = 0;

        if (pNode.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME) {
          ubTempDir = gOneCDirection[pNode.uiUserData3];
          usMinFrames = (pNode.usNumFrames * ubTempDir);
        }

        if (pNode.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME) {
          ubTempDir = gb4DirectionsFrom8[pNode.uiUserData3];
          usMinFrames = (pNode.usNumFrames * ubTempDir);
        }

        if ((pNode.sCurrentFrame - 1) >= usMinFrames) {
          pNode.sCurrentFrame--;
          pNode.pLevelNode.sCurrentFrame = pNode.sCurrentFrame;

          if (pNode.uiFlags & ANITILE_EXPLOSION) {
            // Talk to the explosion data...
            UpdateExplosionFrame(pNode.uiUserData3, pNode.sCurrentFrame);
          }
        } else {
          // We are done!
          if (pNode.uiFlags & ANITILE_PAUSE_AFTER_LOOP) {
            // Turn off backwards flag
            pNode.uiFlags &= (~ANITILE_BACKWARD);

            // Pause
            pNode.uiFlags |= ANITILE_PAUSED;
          } else if (pNode.uiFlags & ANITILE_LOOPING) {
            pNode.sCurrentFrame = pNode.sStartFrame;

            if ((pNode.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gOneCDirection[pNode.uiUserData3];
              pNode.sCurrentFrame = (pNode.usNumFrames * ubTempDir);
            }
            if ((pNode.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gb4DirectionsFrom8[pNode.uiUserData3];
              pNode.sCurrentFrame = (pNode.usNumFrames * ubTempDir);
            }
          } else if (pNode.uiFlags & ANITILE_REVERSE_LOOPING) {
            // Turn off backwards flag
            pNode.uiFlags &= (~ANITILE_BACKWARD);

            // Turn onn forwards flag
            pNode.uiFlags |= ANITILE_FORWARD;
          } else {
            // Delete from world!
            DeleteAniTile(pNode);

            return;
          }

          if (pNode.uiFlags & ANITILE_ERASEITEMFROMSAVEBUFFFER) {
            // ATE: Check if bounding box is on the screen...
            pNode.bFrameCountAfterStart = 0;
            // pNode->pLevelNode->uiFlags |= LEVELNODE_UPDATESAVEBUFFERONCE;

            // Dangerous here, since we may not even be on the screen...
            SetRenderFlags(RENDER_FLAG_FULL);
          }
        }
      }
    } else {
      if (pNode.uiFlags & (ANITILE_OPTIMIZEFORSLOWMOVING)) {
        // ONLY TURN OFF IF PAUSED...
        if ((pNode.uiFlags & ANITILE_ERASEITEMFROMSAVEBUFFFER)) {
          if (pNode.uiFlags & ANITILE_PAUSED) {
            if (pNode.pLevelNode.uiFlags & LEVELNODE_DYNAMIC) {
              pNode.pLevelNode.uiFlags &= (~LEVELNODE_DYNAMIC);
              pNode.pLevelNode.uiFlags |= (LEVELNODE_LASTDYNAMIC);
              SetRenderFlags(RENDER_FLAG_FULL);
            }
          }
        } else {
          pNode.pLevelNode.uiFlags &= (~LEVELNODE_DYNAMIC);
          pNode.pLevelNode.uiFlags |= (LEVELNODE_LASTDYNAMIC);
        }
      } else if (pNode.uiFlags & (ANITILE_OPTIMIZEFORSMOKEEFFECT)) {
        pNode.pLevelNode.uiFlags |= (LEVELNODE_LASTDYNAMIC);
        pNode.pLevelNode.uiFlags &= (~LEVELNODE_DYNAMIC);
      }
    }
  }
}

function SetAniTileFrame(pAniTile: ANITILE, sFrame: INT16): void {
  let ubTempDir: UINT8;
  let sStartFrame: INT16 = 0;

  if ((pAniTile.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gOneCDirection[pAniTile.uiUserData3];
    sStartFrame = sFrame + (pAniTile.usNumFrames * ubTempDir);
  }

  if ((pAniTile.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gb4DirectionsFrom8[pAniTile.uiUserData3];
    sStartFrame = sFrame + (pAniTile.usNumFrames * ubTempDir);
  }

  pAniTile.sCurrentFrame = sStartFrame;
}

export function GetCachedAniTileOfType(sGridNo: INT16, ubLevelID: UINT8, uiFlags: UINT32): ANITILE | null {
  let pNode: LEVELNODE | null = null;

  switch (ubLevelID) {
    case ANI_STRUCT_LEVEL:

      pNode = gpWorldLevelData[sGridNo].pStructHead;
      break;

    case ANI_SHADOW_LEVEL:

      pNode = gpWorldLevelData[sGridNo].pShadowHead;
      break;

    case ANI_OBJECT_LEVEL:

      pNode = gpWorldLevelData[sGridNo].pObjectHead;
      break;

    case ANI_ROOF_LEVEL:

      pNode = gpWorldLevelData[sGridNo].pRoofHead;
      break;

    case ANI_ONROOF_LEVEL:

      pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
      break;

    case ANI_TOPMOST_LEVEL:

      pNode = gpWorldLevelData[sGridNo].pTopmostHead;
      break;

    default:

      return null;
  }

  while (pNode != null) {
    if (pNode.uiFlags & LEVELNODE_CACHEDANITILE) {
      if (pNode.pAniTile.uiFlags & uiFlags) {
        return pNode.pAniTile;
      }
    }

    pNode = pNode.pNext;
  }

  return null;
}

export function HideAniTile(pAniTile: ANITILE, fHide: boolean): void {
  if (fHide) {
    pAniTile.pLevelNode.uiFlags |= LEVELNODE_HIDDEN;
  } else {
    pAniTile.pLevelNode.uiFlags &= (~LEVELNODE_HIDDEN);
  }
}

function PauseAniTile(pAniTile: ANITILE, fPause: boolean): void {
  if (fPause) {
    pAniTile.uiFlags |= ANITILE_PAUSED;
  } else {
    pAniTile.uiFlags &= (~ANITILE_PAUSED);
  }
}

function PauseAllAniTilesOfType(uiType: UINT32, fPause: boolean): void {
  let pAniNode: ANITILE | null = null;
  let pNode: ANITILE;

  // LOOP THROUGH EACH NODE
  pAniNode = pAniTileHead;

  while (pAniNode != null) {
    pNode = pAniNode;
    pAniNode = pAniNode.pNext;

    if (pNode.uiFlags & uiType) {
      PauseAniTile(pNode, fPause);
    }
  }
}

}
