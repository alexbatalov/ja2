let pAniTileHead: Pointer<ANITILE> = NULL;

function CreateAnimationTile(pAniParams: Pointer<ANITILE_PARAMS>): Pointer<ANITILE> {
  let pAniNode: Pointer<ANITILE>;
  let pNewAniNode: Pointer<ANITILE>;
  let pNode: Pointer<LEVELNODE>;
  let iCachedTile: INT32 = -1;
  let sGridNo: INT16;
  let ubLevel: UINT8;
  let usTileType: INT16;
  let usTileIndex: INT16;
  let sDelay: INT16;
  let sStartFrame: INT16 = -1;
  let uiFlags: UINT32;
  let pGivenNode: Pointer<LEVELNODE>;
  let sX: INT16;
  let sY: INT16;
  let sZ: INT16;
  let ubTempDir: UINT8;

  // Get some parameters from structure sent in...
  sGridNo = pAniParams.value.sGridNo;
  ubLevel = pAniParams.value.ubLevelID;
  usTileType = pAniParams.value.usTileType;
  usTileIndex = pAniParams.value.usTileIndex;
  sDelay = pAniParams.value.sDelay;
  sStartFrame = pAniParams.value.sStartFrame;
  uiFlags = pAniParams.value.uiFlags;
  pGivenNode = pAniParams.value.pGivenLevelNode;
  sX = pAniParams.value.sX;
  sY = pAniParams.value.sY;
  sZ = pAniParams.value.sZ;

  pAniNode = pAniTileHead;

  // Allocate head
  pNewAniNode = MemAlloc(sizeof(ANITILE));

  if ((uiFlags & ANITILE_EXISTINGTILE)) {
    pNewAniNode.value.pLevelNode = pGivenNode;
    pNewAniNode.value.pLevelNode.value.pAniTile = pNewAniNode;
  } else {
    if ((uiFlags & ANITILE_CACHEDTILE)) {
      iCachedTile = GetCachedTile(pAniParams.value.zCachedFile);

      if (iCachedTile == -1) {
        return NULL;
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

        return NULL;
    }

    // SET NEW TILE VALUES
    pNode.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
    pNode.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

    pNewAniNode.value.pLevelNode = pNode;

    if ((uiFlags & ANITILE_CACHEDTILE)) {
      pNewAniNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_CACHEDANITILE);
      pNewAniNode.value.sCachedTileID = iCachedTile;
      pNewAniNode.value.usCachedTileSubIndex = usTileType;
      pNewAniNode.value.pLevelNode.value.pAniTile = pNewAniNode;
      pNewAniNode.value.sRelativeX = sX;
      pNewAniNode.value.sRelativeY = sY;
      pNewAniNode.value.pLevelNode.value.sRelativeZ = sZ;
    }
    // Can't set relative X,Y,Z IF FLAGS ANITILE_CACHEDTILE set!
    else if ((uiFlags & ANITILE_USEABSOLUTEPOS)) {
      pNewAniNode.value.pLevelNode.value.sRelativeX = sX;
      pNewAniNode.value.pLevelNode.value.sRelativeY = sY;
      pNewAniNode.value.pLevelNode.value.sRelativeZ = sZ;
      pNewAniNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_USEABSOLUTEPOS);
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
  pNewAniNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_ANIMATION | LEVELNODE_USEZ | LEVELNODE_DYNAMIC);

  if ((uiFlags & ANITILE_NOZBLITTER)) {
    pNewAniNode.value.pLevelNode.value.uiFlags |= LEVELNODE_NOZBLITTER;
  }

  if ((uiFlags & ANITILE_ALWAYS_TRANSLUCENT)) {
    pNewAniNode.value.pLevelNode.value.uiFlags |= LEVELNODE_REVEAL;
  }

  if ((uiFlags & ANITILE_USEBEST_TRANSLUCENT)) {
    pNewAniNode.value.pLevelNode.value.uiFlags |= LEVELNODE_USEBESTTRANSTYPE;
  }

  if ((uiFlags & ANITILE_ANIMATE_Z)) {
    pNewAniNode.value.pLevelNode.value.uiFlags |= LEVELNODE_DYNAMICZ;
  }

  if ((uiFlags & ANITILE_PAUSED)) {
    pNewAniNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_LASTDYNAMIC | LEVELNODE_UPDATESAVEBUFFERONCE);
    pNewAniNode.value.pLevelNode.value.uiFlags &= (~LEVELNODE_DYNAMIC);
  }

  if ((uiFlags & ANITILE_OPTIMIZEFORSMOKEEFFECT)) {
    pNewAniNode.value.pLevelNode.value.uiFlags |= LEVELNODE_NOWRITEZ;
  }

  // SET ANITILE VALUES
  pNewAniNode.value.ubLevelID = ubLevel;
  pNewAniNode.value.usTileIndex = usTileIndex;

  if ((uiFlags & ANITILE_CACHEDTILE)) {
    pNewAniNode.value.usNumFrames = gpTileCache[iCachedTile].ubNumFrames;
  } else {
    Assert(gTileDatabase[usTileIndex].pAnimData != NULL);
    pNewAniNode.value.usNumFrames = gTileDatabase[usTileIndex].pAnimData.value.ubNumFrames;
  }

  if ((uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gOneCDirection[pAniParams.value.uiUserData3];
    sStartFrame = sStartFrame + (pNewAniNode.value.usNumFrames * ubTempDir);
  }

  if ((uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gb4DirectionsFrom8[pAniParams.value.uiUserData3];
    sStartFrame = sStartFrame + (pNewAniNode.value.usNumFrames * ubTempDir);
  }

  pNewAniNode.value.usTileType = usTileType;
  pNewAniNode.value.pNext = pAniNode;
  pNewAniNode.value.uiFlags = uiFlags;
  pNewAniNode.value.sDelay = sDelay;
  pNewAniNode.value.sCurrentFrame = sStartFrame;
  pNewAniNode.value.uiTimeLastUpdate = GetJA2Clock();
  pNewAniNode.value.sGridNo = sGridNo;

  pNewAniNode.value.sStartFrame = sStartFrame;

  pNewAniNode.value.ubKeyFrame1 = pAniParams.value.ubKeyFrame1;
  pNewAniNode.value.uiKeyFrame1Code = pAniParams.value.uiKeyFrame1Code;
  pNewAniNode.value.ubKeyFrame2 = pAniParams.value.ubKeyFrame2;
  pNewAniNode.value.uiKeyFrame2Code = pAniParams.value.uiKeyFrame2Code;
  pNewAniNode.value.uiUserData = pAniParams.value.uiUserData;
  pNewAniNode.value.ubUserData2 = pAniParams.value.ubUserData2;
  pNewAniNode.value.uiUserData3 = pAniParams.value.uiUserData3;

  // Set head
  pAniTileHead = pNewAniNode;

  // Set some special stuff
  return pNewAniNode;
}

// Loop throug all ani tiles and remove...
function DeleteAniTiles(): void {
  let pAniNode: Pointer<ANITILE> = NULL;
  let pNode: Pointer<ANITILE> = NULL;

  // LOOP THROUGH EACH NODE
  // And call delete function...
  pAniNode = pAniTileHead;

  while (pAniNode != NULL) {
    pNode = pAniNode;
    pAniNode = pAniNode.value.pNext;

    DeleteAniTile(pNode);
  }
}

function DeleteAniTile(pAniTile: Pointer<ANITILE>): void {
  let pAniNode: Pointer<ANITILE> = NULL;
  let pOldAniNode: Pointer<ANITILE> = NULL;
  let TileElem: Pointer<TILE_ELEMENT>;

  pAniNode = pAniTileHead;

  while (pAniNode != NULL) {
    if (pAniNode == pAniTile) {
      // OK, set links
      // Check for head or tail
      if (pOldAniNode == NULL) {
        // It's the head
        pAniTileHead = pAniTile.value.pNext;
      } else {
        pOldAniNode.value.pNext = pAniNode.value.pNext;
      }

      if (!(pAniNode.value.uiFlags & ANITILE_EXISTINGTILE)) {
        // Delete memory assosiated with item
        switch (pAniNode.value.ubLevelID) {
          case ANI_STRUCT_LEVEL:

            RemoveStructFromLevelNode(pAniNode.value.sGridNo, pAniNode.value.pLevelNode);
            break;

          case ANI_SHADOW_LEVEL:

            RemoveShadowFromLevelNode(pAniNode.value.sGridNo, pAniNode.value.pLevelNode);
            break;

          case ANI_OBJECT_LEVEL:

            RemoveObject(pAniNode.value.sGridNo, pAniNode.value.usTileIndex);
            break;

          case ANI_ROOF_LEVEL:

            RemoveRoof(pAniNode.value.sGridNo, pAniNode.value.usTileIndex);
            break;

          case ANI_ONROOF_LEVEL:

            RemoveOnRoof(pAniNode.value.sGridNo, pAniNode.value.usTileIndex);
            break;

          case ANI_TOPMOST_LEVEL:

            RemoveTopmostFromLevelNode(pAniNode.value.sGridNo, pAniNode.value.pLevelNode);
            break;
        }

        if ((pAniNode.value.uiFlags & ANITILE_CACHEDTILE)) {
          RemoveCachedTile(pAniNode.value.sCachedTileID);
        }

        if (pAniNode.value.uiFlags & ANITILE_EXPLOSION) {
          // Talk to the explosion data...
          RemoveExplosionData(pAniNode.value.uiUserData3);

          if (!gfExplosionQueueActive) {
            // turn on sighting again
            // the explosion queue handles all this at the end of the queue
            gTacticalStatus.uiFlags &= (~DISALLOW_SIGHT);
          }

          // Freeup attacker from explosion
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Reducing attacker busy count..., EXPLOSION effect gone off"));
          ReduceAttackBusyCount(pAniNode.value.ubUserData2, FALSE);
        }

        if (pAniNode.value.uiFlags & ANITILE_RELEASE_ATTACKER_WHEN_DONE) {
          // First delete the bullet!
          RemoveBullet(pAniNode.value.uiUserData3);

          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - miss finished animation"));
          FreeUpAttacker(pAniNode.value.ubAttackerMissed);
        }
      } else {
        TileElem = addressof(gTileDatabase[pAniNode.value.usTileIndex]);

        // OK, update existing tile usIndex....
        Assert(TileElem.value.pAnimData != NULL);
        pAniNode.value.pLevelNode.value.usIndex = TileElem.value.pAnimData.value.pusFrames[pAniNode.value.pLevelNode.value.sCurrentFrame];

        // OK, set our frame data back to zero....
        pAniNode.value.pLevelNode.value.sCurrentFrame = 0;

        // Set some flags to write to Z / update save buffer
        // pAniNode->pLevelNode->uiFlags |=( LEVELNODE_LASTDYNAMIC | LEVELNODE_UPDATESAVEBUFFERONCE );
        pAniNode.value.pLevelNode.value.uiFlags &= ~(LEVELNODE_DYNAMIC | LEVELNODE_USEZ | LEVELNODE_ANIMATION);

        if (pAniNode.value.uiFlags & ANITILE_DOOR) {
          // unset door busy!
          let pDoorStatus: Pointer<DOOR_STATUS>;

          pDoorStatus = GetDoorStatus(pAniNode.value.sGridNo);
          if (pDoorStatus) {
            pDoorStatus.value.ubFlags &= ~(DOOR_BUSY);
          }

          if (GridNoOnScreen(pAniNode.value.sGridNo)) {
            SetRenderFlags(RENDER_FLAG_FULL);
          }
        }
      }

      MemFree(pAniNode);
      return;
    }

    pOldAniNode = pAniNode;
    pAniNode = pAniNode.value.pNext;
  }
}

function UpdateAniTiles(): void {
  let pAniNode: Pointer<ANITILE> = NULL;
  let pNode: Pointer<ANITILE> = NULL;
  let uiClock: UINT32 = GetJA2Clock();
  let usMaxFrames: UINT16;
  let usMinFrames: UINT16;
  let ubTempDir: UINT8;

  // LOOP THROUGH EACH NODE
  pAniNode = pAniTileHead;

  while (pAniNode != NULL) {
    pNode = pAniNode;
    pAniNode = pAniNode.value.pNext;

    if ((uiClock - pNode.value.uiTimeLastUpdate) > pNode.value.sDelay && !(pNode.value.uiFlags & ANITILE_PAUSED)) {
      pNode.value.uiTimeLastUpdate = GetJA2Clock();

      if (pNode.value.uiFlags & (ANITILE_OPTIMIZEFORSLOWMOVING)) {
        pNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_DYNAMIC);
        pNode.value.pLevelNode.value.uiFlags &= (~LEVELNODE_LASTDYNAMIC);
      } else if (pNode.value.uiFlags & (ANITILE_OPTIMIZEFORSMOKEEFFECT)) {
        //	pNode->pLevelNode->uiFlags |= LEVELNODE_DYNAMICZ;
        ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
        pNode.value.pLevelNode.value.uiFlags &= (~LEVELNODE_LASTDYNAMIC);
        pNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_DYNAMIC);
      }

      if (pNode.value.uiFlags & ANITILE_FORWARD) {
        usMaxFrames = pNode.value.usNumFrames;

        if (pNode.value.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME) {
          ubTempDir = gOneCDirection[pNode.value.uiUserData3];
          usMaxFrames = usMaxFrames + (pNode.value.usNumFrames * ubTempDir);
        }

        if (pNode.value.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME) {
          ubTempDir = gb4DirectionsFrom8[pNode.value.uiUserData3];
          usMaxFrames = usMaxFrames + (pNode.value.usNumFrames * ubTempDir);
        }

        if ((pNode.value.sCurrentFrame + 1) < usMaxFrames) {
          pNode.value.sCurrentFrame++;
          pNode.value.pLevelNode.value.sCurrentFrame = pNode.value.sCurrentFrame;

          if (pNode.value.uiFlags & ANITILE_EXPLOSION) {
            // Talk to the explosion data...
            UpdateExplosionFrame(pNode.value.uiUserData3, pNode.value.sCurrentFrame);
          }

          // CHECK IF WE SHOULD BE DISPLAYING TRANSLUCENTLY!
          if (pNode.value.sCurrentFrame == pNode.value.ubKeyFrame1) {
            switch (pNode.value.uiKeyFrame1Code) {
              case Enum311.ANI_KEYFRAME_BEGIN_TRANSLUCENCY:

                pNode.value.pLevelNode.value.uiFlags |= LEVELNODE_REVEAL;
                break;

              case Enum311.ANI_KEYFRAME_CHAIN_WATER_EXPLOSION:

                IgniteExplosion(pNode.value.ubUserData2, pNode.value.pLevelNode.value.sRelativeX, pNode.value.pLevelNode.value.sRelativeY, 0, pNode.value.sGridNo, (pNode.value.uiUserData), 0);
                break;

              case Enum311.ANI_KEYFRAME_DO_SOUND:

                PlayJA2Sample(pNode.value.uiUserData, RATE_11025, SoundVolume(MIDVOLUME, pNode.value.uiUserData3), 1, SoundDir(pNode.value.uiUserData3));
                break;
            }
          }

          // CHECK IF WE SHOULD BE DISPLAYING TRANSLUCENTLY!
          if (pNode.value.sCurrentFrame == pNode.value.ubKeyFrame2) {
            let ubExpType: UINT8;

            switch (pNode.value.uiKeyFrame2Code) {
              case Enum311.ANI_KEYFRAME_BEGIN_DAMAGE:

                ubExpType = Explosive[Item[pNode.value.uiUserData].ubClassIndex].ubType;

                if (ubExpType == Enum287.EXPLOSV_TEARGAS || ubExpType == Enum287.EXPLOSV_MUSTGAS || ubExpType == Enum287.EXPLOSV_SMOKE) {
                  // Do sound....
                  // PlayJA2Sample( AIR_ESCAPING_1, RATE_11025, SoundVolume( HIGHVOLUME, pNode->sGridNo ), 1, SoundDir( pNode->sGridNo ) );
                  NewSmokeEffect(pNode.value.sGridNo, pNode.value.uiUserData, gExplosionData[pNode.value.uiUserData3].Params.bLevel, pNode.value.ubUserData2);
                } else {
                  SpreadEffect(pNode.value.sGridNo, Explosive[Item[pNode.value.uiUserData].ubClassIndex].ubRadius, pNode.value.uiUserData, pNode.value.ubUserData2, FALSE, gExplosionData[pNode.value.uiUserData3].Params.bLevel, -1);
                }
                // Forfait any other animations this frame....
                return;
            }
          }
        } else {
          // We are done!
          if (pNode.value.uiFlags & ANITILE_LOOPING) {
            pNode.value.sCurrentFrame = pNode.value.sStartFrame;

            if ((pNode.value.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gOneCDirection[pNode.value.uiUserData3];
              pNode.value.sCurrentFrame = (pNode.value.usNumFrames * ubTempDir);
            }

            if ((pNode.value.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gb4DirectionsFrom8[pNode.value.uiUserData3];
              pNode.value.sCurrentFrame = (pNode.value.usNumFrames * ubTempDir);
            }
          } else if (pNode.value.uiFlags & ANITILE_REVERSE_LOOPING) {
            // Turn off backwards flag
            pNode.value.uiFlags &= (~ANITILE_FORWARD);

            // Turn onn forwards flag
            pNode.value.uiFlags |= ANITILE_BACKWARD;
          } else {
            // Delete from world!
            DeleteAniTile(pNode);

            // Turn back on redunency checks!
            gTacticalStatus.uiFlags &= (~NOHIDE_REDUNDENCY);

            return;
          }
        }
      }

      if (pNode.value.uiFlags & ANITILE_BACKWARD) {
        if (pNode.value.uiFlags & ANITILE_ERASEITEMFROMSAVEBUFFFER) {
          // ATE: Check if bounding box is on the screen...
          if (pNode.value.bFrameCountAfterStart == 0) {
            pNode.value.bFrameCountAfterStart = 1;
            pNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_DYNAMIC);

            // Dangerous here, since we may not even be on the screen...
            SetRenderFlags(RENDER_FLAG_FULL);

            continue;
          }
        }

        usMinFrames = 0;

        if (pNode.value.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME) {
          ubTempDir = gOneCDirection[pNode.value.uiUserData3];
          usMinFrames = (pNode.value.usNumFrames * ubTempDir);
        }

        if (pNode.value.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME) {
          ubTempDir = gb4DirectionsFrom8[pNode.value.uiUserData3];
          usMinFrames = (pNode.value.usNumFrames * ubTempDir);
        }

        if ((pNode.value.sCurrentFrame - 1) >= usMinFrames) {
          pNode.value.sCurrentFrame--;
          pNode.value.pLevelNode.value.sCurrentFrame = pNode.value.sCurrentFrame;

          if (pNode.value.uiFlags & ANITILE_EXPLOSION) {
            // Talk to the explosion data...
            UpdateExplosionFrame(pNode.value.uiUserData3, pNode.value.sCurrentFrame);
          }
        } else {
          // We are done!
          if (pNode.value.uiFlags & ANITILE_PAUSE_AFTER_LOOP) {
            // Turn off backwards flag
            pNode.value.uiFlags &= (~ANITILE_BACKWARD);

            // Pause
            pNode.value.uiFlags |= ANITILE_PAUSED;
          } else if (pNode.value.uiFlags & ANITILE_LOOPING) {
            pNode.value.sCurrentFrame = pNode.value.sStartFrame;

            if ((pNode.value.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gOneCDirection[pNode.value.uiUserData3];
              pNode.value.sCurrentFrame = (pNode.value.usNumFrames * ubTempDir);
            }
            if ((pNode.value.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
              // Our start frame is actually a direction indicator
              ubTempDir = gb4DirectionsFrom8[pNode.value.uiUserData3];
              pNode.value.sCurrentFrame = (pNode.value.usNumFrames * ubTempDir);
            }
          } else if (pNode.value.uiFlags & ANITILE_REVERSE_LOOPING) {
            // Turn off backwards flag
            pNode.value.uiFlags &= (~ANITILE_BACKWARD);

            // Turn onn forwards flag
            pNode.value.uiFlags |= ANITILE_FORWARD;
          } else {
            // Delete from world!
            DeleteAniTile(pNode);

            return;
          }

          if (pNode.value.uiFlags & ANITILE_ERASEITEMFROMSAVEBUFFFER) {
            // ATE: Check if bounding box is on the screen...
            pNode.value.bFrameCountAfterStart = 0;
            // pNode->pLevelNode->uiFlags |= LEVELNODE_UPDATESAVEBUFFERONCE;

            // Dangerous here, since we may not even be on the screen...
            SetRenderFlags(RENDER_FLAG_FULL);
          }
        }
      }
    } else {
      if (pNode.value.uiFlags & (ANITILE_OPTIMIZEFORSLOWMOVING)) {
        // ONLY TURN OFF IF PAUSED...
        if ((pNode.value.uiFlags & ANITILE_ERASEITEMFROMSAVEBUFFFER)) {
          if (pNode.value.uiFlags & ANITILE_PAUSED) {
            if (pNode.value.pLevelNode.value.uiFlags & LEVELNODE_DYNAMIC) {
              pNode.value.pLevelNode.value.uiFlags &= (~LEVELNODE_DYNAMIC);
              pNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_LASTDYNAMIC);
              SetRenderFlags(RENDER_FLAG_FULL);
            }
          }
        } else {
          pNode.value.pLevelNode.value.uiFlags &= (~LEVELNODE_DYNAMIC);
          pNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_LASTDYNAMIC);
        }
      } else if (pNode.value.uiFlags & (ANITILE_OPTIMIZEFORSMOKEEFFECT)) {
        pNode.value.pLevelNode.value.uiFlags |= (LEVELNODE_LASTDYNAMIC);
        pNode.value.pLevelNode.value.uiFlags &= (~LEVELNODE_DYNAMIC);
      }
    }
  }
}

function SetAniTileFrame(pAniTile: Pointer<ANITILE>, sFrame: INT16): void {
  let ubTempDir: UINT8;
  let sStartFrame: INT16 = 0;

  if ((pAniTile.value.uiFlags & ANITILE_USE_DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gOneCDirection[pAniTile.value.uiUserData3];
    sStartFrame = sFrame + (pAniTile.value.usNumFrames * ubTempDir);
  }

  if ((pAniTile.value.uiFlags & ANITILE_USE_4DIRECTION_FOR_START_FRAME)) {
    // Our start frame is actually a direction indicator
    ubTempDir = gb4DirectionsFrom8[pAniTile.value.uiUserData3];
    sStartFrame = sFrame + (pAniTile.value.usNumFrames * ubTempDir);
  }

  pAniTile.value.sCurrentFrame = sStartFrame;
}

function GetCachedAniTileOfType(sGridNo: INT16, ubLevelID: UINT8, uiFlags: UINT32): Pointer<ANITILE> {
  let pNode: Pointer<LEVELNODE> = NULL;

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

      return NULL;
  }

  while (pNode != NULL) {
    if (pNode.value.uiFlags & LEVELNODE_CACHEDANITILE) {
      if (pNode.value.pAniTile.value.uiFlags & uiFlags) {
        return pNode.value.pAniTile;
      }
    }

    pNode = pNode.value.pNext;
  }

  return NULL;
}

function HideAniTile(pAniTile: Pointer<ANITILE>, fHide: BOOLEAN): void {
  if (fHide) {
    pAniTile.value.pLevelNode.value.uiFlags |= LEVELNODE_HIDDEN;
  } else {
    pAniTile.value.pLevelNode.value.uiFlags &= (~LEVELNODE_HIDDEN);
  }
}

function PauseAniTile(pAniTile: Pointer<ANITILE>, fPause: BOOLEAN): void {
  if (fPause) {
    pAniTile.value.uiFlags |= ANITILE_PAUSED;
  } else {
    pAniTile.value.uiFlags &= (~ANITILE_PAUSED);
  }
}

function PauseAllAniTilesOfType(uiType: UINT32, fPause: BOOLEAN): void {
  let pAniNode: Pointer<ANITILE> = NULL;
  let pNode: Pointer<ANITILE> = NULL;

  // LOOP THROUGH EACH NODE
  pAniNode = pAniTileHead;

  while (pAniNode != NULL) {
    pNode = pAniNode;
    pAniNode = pAniNode.value.pNext;

    if (pNode.value.uiFlags & uiType) {
      PauseAniTile(pNode, fPause);
    }
  }
}
