// Defines
const NUM_BULLET_SLOTS = 50;

// GLOBAL FOR FACES LISTING
let gBullets: BULLET[] /* [NUM_BULLET_SLOTS] */;
let guiNumBullets: UINT32 = 0;

function GetFreeBullet(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumBullets; uiCount++) {
    if ((gBullets[uiCount].fAllocated == FALSE))
      return uiCount;
  }

  if (guiNumBullets < NUM_BULLET_SLOTS)
    return guiNumBullets++;

  return -1;
}

function RecountBullets(): void {
  let uiCount: INT32;

  for (uiCount = guiNumBullets - 1; (uiCount >= 0); uiCount--) {
    if ((gBullets[uiCount].fAllocated)) {
      guiNumBullets = (uiCount + 1);
      return;
    }
  }
  guiNumBullets = 0;
}

function CreateBullet(ubFirerID: UINT8, fFake: BOOLEAN, usFlags: UINT16): INT32 {
  let iBulletIndex: INT32;
  let pBullet: Pointer<BULLET>;

  if ((iBulletIndex = GetFreeBullet()) == (-1))
    return -1;

  memset(&gBullets[iBulletIndex], 0, sizeof(BULLET));

  pBullet = &gBullets[iBulletIndex];

  pBullet.value.iBullet = iBulletIndex;
  pBullet.value.fAllocated = TRUE;
  pBullet.value.fLocated = FALSE;
  pBullet.value.ubFirerID = ubFirerID;
  pBullet.value.usFlags = usFlags;
  pBullet.value.usLastStructureHit = 0;

  if (fFake) {
    pBullet.value.fReal = FALSE;
  } else {
    pBullet.value.fReal = TRUE;
  }

  return iBulletIndex;
}

function HandleBulletSpecialFlags(iBulletIndex: INT32): void {
  let pBullet: Pointer<BULLET>;
  let AniParams: ANITILE_PARAMS;
  let dX: FLOAT;
  let dY: FLOAT;
  let ubDirection: UINT8;

  pBullet = &(gBullets[iBulletIndex]);

  memset(&AniParams, 0, sizeof(ANITILE_PARAMS));

  if (pBullet.value.fReal) {
    // Create ani tile if this is a spit!
    if (pBullet.value.usFlags & (BULLET_FLAG_KNIFE)) {
      AniParams.sGridNo = pBullet.value.sGridNo;
      AniParams.ubLevelID = ANI_STRUCT_LEVEL;
      AniParams.sDelay = 100;
      AniParams.sStartFrame = 3;
      AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_LOOPING | ANITILE_USE_DIRECTION_FOR_START_FRAME;
      AniParams.sX = FIXEDPT_TO_INT32(pBullet.value.qCurrX);
      AniParams.sY = FIXEDPT_TO_INT32(pBullet.value.qCurrY);
      AniParams.sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(pBullet.value.qCurrZ));

      if (pBullet.value.usFlags & (BULLET_FLAG_CREATURE_SPIT)) {
        strcpy(AniParams.zCachedFile, "TILECACHE\\SPIT2.STI");
      } else if (pBullet.value.usFlags & (BULLET_FLAG_KNIFE)) {
        strcpy(AniParams.zCachedFile, "TILECACHE\\KNIFING.STI");
        pBullet.value.ubItemStatus = pBullet.value.pFirer.value.inv[HANDPOS].bStatus[0];
      }

      // Get direction to use for this guy....
      dX = ((pBullet.value.qIncrX) / FIXEDPT_FRACTIONAL_RESOLUTION);
      dY = ((pBullet.value.qIncrY) / FIXEDPT_FRACTIONAL_RESOLUTION);

      ubDirection = atan8(0, 0, (dX * 100), (dY * 100));

      AniParams.uiUserData3 = ubDirection;

      pBullet.value.pAniTile = CreateAnimationTile(&AniParams);

      // IF we are anything that needs a shadow.. set it here....
      if (pBullet.value.usFlags & (BULLET_FLAG_KNIFE)) {
        AniParams.ubLevelID = ANI_SHADOW_LEVEL;
        AniParams.sZ = 0;
        pBullet.value.pShadowAniTile = CreateAnimationTile(&AniParams);
      }
    }
  }
}

function RemoveBullet(iBullet: INT32): void {
  CHECKV(iBullet < NUM_BULLET_SLOTS);

  // decrease soldier's bullet count

  if (gBullets[iBullet].fReal) {
    // set to be deleted at next update
    gBullets[iBullet].fToDelete = TRUE;

    // decrement reference to bullet in the firer
    gBullets[iBullet].pFirer.value.bBulletsLeft--;
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Ending bullet, bullets left %d", gBullets[iBullet].pFirer.value.bBulletsLeft));

    if (gBullets[iBullet].usFlags & (BULLET_FLAG_KNIFE)) {
      // Delete ani tile
      if (gBullets[iBullet].pAniTile != NULL) {
        DeleteAniTile(gBullets[iBullet].pAniTile);
        gBullets[iBullet].pAniTile = NULL;
      }

      // Delete shadow
      if (gBullets[iBullet].usFlags & (BULLET_FLAG_KNIFE)) {
        if (gBullets[iBullet].pShadowAniTile != NULL) {
          DeleteAniTile(gBullets[iBullet].pShadowAniTile);
          gBullets[iBullet].pShadowAniTile = NULL;
        }
      }
    }
  } else {
    // delete this fake bullet right away!
    gBullets[iBullet].fAllocated = FALSE;
    RecountBullets();
  }
}

function LocateBullet(iBulletIndex: INT32): void {
  if (gGameSettings.fOptions[TOPTION_SHOW_MISSES]) {
    // Check if a bad guy fired!
    if (gBullets[iBulletIndex].ubFirerID != NOBODY) {
      if (MercPtrs[gBullets[iBulletIndex].ubFirerID].value.bSide == gbPlayerNum) {
        if (!gBullets[iBulletIndex].fLocated) {
          gBullets[iBulletIndex].fLocated = TRUE;

          // Only if we are in turnbased and noncombat
          if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
            LocateGridNo(gBullets[iBulletIndex].sGridNo);
          }
        }
      }
    }
  }
}

function UpdateBullets(): void {
  let uiCount: UINT32;
  let pNode: Pointer<LEVELNODE>;
  let fDeletedSome: BOOLEAN = FALSE;

  for (uiCount = 0; uiCount < guiNumBullets; uiCount++) {
    if (gBullets[uiCount].fAllocated) {
      if (gBullets[uiCount].fReal && !(gBullets[uiCount].usFlags & BULLET_STOPPED)) {
        // there are duplicate checks for deletion in case the bullet is deleted by shooting
        // someone at point blank range, in the first MoveBullet call in the FireGun code
        if (gBullets[uiCount].fToDelete) {
          // Remove from old position
          gBullets[uiCount].fAllocated = FALSE;
          fDeletedSome = TRUE;
          continue;
        }

        // if ( !( gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] ) )
        {
          // ALRIGHTY, CHECK WHAT TYPE OF BULLET WE ARE

          if (gBullets[uiCount].usFlags & (BULLET_FLAG_CREATURE_SPIT | BULLET_FLAG_KNIFE | BULLET_FLAG_MISSILE | BULLET_FLAG_SMALL_MISSILE | BULLET_FLAG_TANK_CANNON | BULLET_FLAG_FLAME)) {
          } else {
            RemoveStruct(gBullets[uiCount].sGridNo, BULLETTILE1);
            RemoveStruct(gBullets[uiCount].sGridNo, BULLETTILE2);
          }
        }

        MoveBullet(uiCount);
        if (gBullets[uiCount].fToDelete) {
          // Remove from old position
          gBullets[uiCount].fAllocated = FALSE;
          fDeletedSome = TRUE;
          continue;
        }

        if (gBullets[uiCount].usFlags & BULLET_STOPPED) {
          continue;
        }

        // Display bullet
        // if ( !( gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] ) )
        {
          if (gBullets[uiCount].usFlags & (BULLET_FLAG_KNIFE)) {
            if (gBullets[uiCount].pAniTile != NULL) {
              gBullets[uiCount].pAniTile.value.sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
              gBullets[uiCount].pAniTile.value.sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
              gBullets[uiCount].pAniTile.value.pLevelNode.value.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(gBullets[uiCount].qCurrZ));

              if (gBullets[uiCount].usFlags & (BULLET_FLAG_KNIFE)) {
                gBullets[uiCount].pShadowAniTile.value.sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
                gBullets[uiCount].pShadowAniTile.value.sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
              }
            }
          }
          // Are we a missle?
          else if (gBullets[uiCount].usFlags & (BULLET_FLAG_MISSILE | BULLET_FLAG_SMALL_MISSILE | BULLET_FLAG_TANK_CANNON | BULLET_FLAG_FLAME | BULLET_FLAG_CREATURE_SPIT)) {
          } else {
            pNode = AddStructToTail(gBullets[uiCount].sGridNo, BULLETTILE1);
            pNode.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.value.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT);
            pNode.value.sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
            pNode.value.sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
            pNode.value.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(gBullets[uiCount].qCurrZ));

            // Display shadow
            pNode = AddStructToTail(gBullets[uiCount].sGridNo, BULLETTILE2);
            pNode.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.value.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT);
            pNode.value.sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
            pNode.value.sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
            pNode.value.sRelativeZ = gpWorldLevelData[gBullets[uiCount].sGridNo].sHeight;
          }
        }
      } else {
        if (gBullets[uiCount].fToDelete) {
          gBullets[uiCount].fAllocated = FALSE;
          fDeletedSome = TRUE;
        }
      }
    }
  }

  if (fDeletedSome) {
    RecountBullets();
  }
}

function GetBulletPtr(iBullet: INT32): Pointer<BULLET> {
  let pBullet: Pointer<BULLET>;

  CHECKN(iBullet < NUM_BULLET_SLOTS);

  pBullet = &gBullets[iBullet];

  return pBullet;
}

function AddMissileTrail(pBullet: Pointer<BULLET>, qCurrX: FIXEDPT, qCurrY: FIXEDPT, qCurrZ: FIXEDPT): void {
  let AniParams: ANITILE_PARAMS;

  // If we are a small missle, don't show
  if (pBullet.value.usFlags & (BULLET_FLAG_SMALL_MISSILE | BULLET_FLAG_FLAME | BULLET_FLAG_CREATURE_SPIT)) {
    if (pBullet.value.iLoop < 5) {
      return;
    }
  }

  // If we are a small missle, don't show
  if (pBullet.value.usFlags & (BULLET_FLAG_TANK_CANNON)) {
    // if ( pBullet->iLoop < 40 )
    //{
    return;
    //}
  }

  memset(&AniParams, 0, sizeof(ANITILE_PARAMS));
  AniParams.sGridNo = pBullet.value.sGridNo;
  AniParams.ubLevelID = ANI_STRUCT_LEVEL;
  AniParams.sDelay = (100 + Random(100));
  AniParams.sStartFrame = 0;
  AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_ALWAYS_TRANSLUCENT;
  AniParams.sX = FIXEDPT_TO_INT32(qCurrX);
  AniParams.sY = FIXEDPT_TO_INT32(qCurrY);
  AniParams.sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(qCurrZ));

  if (pBullet.value.usFlags & (BULLET_FLAG_MISSILE | BULLET_FLAG_TANK_CANNON)) {
    strcpy(AniParams.zCachedFile, "TILECACHE\\MSLE_SMK.STI");
  } else if (pBullet.value.usFlags & (BULLET_FLAG_SMALL_MISSILE)) {
    strcpy(AniParams.zCachedFile, "TILECACHE\\MSLE_SMA.STI");
  } else if (pBullet.value.usFlags & (BULLET_FLAG_CREATURE_SPIT)) {
    strcpy(AniParams.zCachedFile, "TILECACHE\\MSLE_SPT.STI");
  } else if (pBullet.value.usFlags & (BULLET_FLAG_FLAME)) {
    strcpy(AniParams.zCachedFile, "TILECACHE\\FLMTHR2.STI");
    AniParams.sDelay = (100);
  }

  CreateAnimationTile(&AniParams);
}

function SaveBulletStructureToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;
  let usCnt: UINT16;
  let uiBulletCount: UINT32 = 0;

  // loop through and count the number of bullets
  for (usCnt = 0; usCnt < NUM_BULLET_SLOTS; usCnt++) {
    // if the bullet is active, save it
    if (gBullets[usCnt].fAllocated) {
      uiBulletCount++;
    }
  }

  // Save the number of Bullets in the array
  FileWrite(hFile, &uiBulletCount, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return FALSE;
  }

  if (uiBulletCount != 0) {
    for (usCnt = 0; usCnt < NUM_BULLET_SLOTS; usCnt++) {
      // if the bullet is active, save it
      if (gBullets[usCnt].fAllocated) {
        // Save the the Bullet structure
        FileWrite(hFile, &gBullets[usCnt], sizeof(BULLET), &uiNumBytesWritten);
        if (uiNumBytesWritten != sizeof(BULLET)) {
          return FALSE;
        }
      }
    }
  }

  return TRUE;
}

function LoadBulletStructureFromSavedGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let usCnt: UINT16;

  // make sure the bullets are not allocated
  memset(gBullets, 0, NUM_BULLET_SLOTS * sizeof(BULLET));

  // Load the number of Bullets in the array
  FileRead(hFile, &guiNumBullets, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32)) {
    return FALSE;
  }

  for (usCnt = 0; usCnt < guiNumBullets; usCnt++) {
    // Load the the Bullet structure
    FileRead(hFile, &gBullets[usCnt], sizeof(BULLET), &uiNumBytesRead);
    if (uiNumBytesRead != sizeof(BULLET)) {
      return FALSE;
    }

    // Set some parameters
    gBullets[usCnt].uiLastUpdate = 0;
    if (gBullets[usCnt].ubFirerID != NOBODY)
      gBullets[usCnt].pFirer = &Menptr[gBullets[usCnt].ubFirerID];
    else
      gBullets[usCnt].pFirer = NULL;

    gBullets[usCnt].pAniTile = NULL;
    gBullets[usCnt].pShadowAniTile = NULL;
    gBullets[usCnt].iBullet = usCnt;

    HandleBulletSpecialFlags(gBullets[usCnt].iBullet);
  }

  return TRUE;
}

function StopBullet(iBullet: INT32): void {
  gBullets[iBullet].usFlags |= BULLET_STOPPED;

  RemoveStruct(gBullets[iBullet].sGridNo, BULLETTILE1);
  RemoveStruct(gBullets[iBullet].sGridNo, BULLETTILE2);
}

function DeleteAllBullets(): void {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumBullets; uiCount++) {
    if (gBullets[uiCount].fAllocated) {
      // Remove from old position
      RemoveBullet(uiCount);
      gBullets[uiCount].fAllocated = FALSE;
    }
  }

  RecountBullets();
}
