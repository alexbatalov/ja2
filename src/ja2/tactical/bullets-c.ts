namespace ja2 {

// Defines
const NUM_BULLET_SLOTS = 50;

// GLOBAL FOR FACES LISTING
let gBullets: BULLET[] /* [NUM_BULLET_SLOTS] */ = createArrayFrom(NUM_BULLET_SLOTS, createBullet);
export let guiNumBullets: UINT32 = 0;

function GetFreeBullet(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumBullets; uiCount++) {
    if ((gBullets[uiCount].fAllocated == false))
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

export function CreateBullet(ubFirerID: UINT8, fFake: boolean, usFlags: UINT16): INT32 {
  let iBulletIndex: INT32;
  let pBullet: BULLET;

  if ((iBulletIndex = GetFreeBullet()) == (-1))
    return -1;

  resetBullet(gBullets[iBulletIndex]);

  pBullet = gBullets[iBulletIndex];

  pBullet.iBullet = iBulletIndex;
  pBullet.fAllocated = true;
  pBullet.fLocated = false;
  pBullet.ubFirerID = ubFirerID;
  pBullet.usFlags = usFlags;
  pBullet.usLastStructureHit = 0;

  if (fFake) {
    pBullet.fReal = false;
  } else {
    pBullet.fReal = true;
  }

  return iBulletIndex;
}

export function HandleBulletSpecialFlags(iBulletIndex: INT32): void {
  let pBullet: BULLET;
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
  let dX: FLOAT;
  let dY: FLOAT;
  let ubDirection: UINT8;

  pBullet = gBullets[iBulletIndex];

  if (pBullet.fReal) {
    // Create ani tile if this is a spit!
    if (pBullet.usFlags & (BULLET_FLAG_KNIFE)) {
      AniParams.sGridNo = pBullet.sGridNo;
      AniParams.ubLevelID = ANI_STRUCT_LEVEL;
      AniParams.sDelay = 100;
      AniParams.sStartFrame = 3;
      AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_LOOPING | ANITILE_USE_DIRECTION_FOR_START_FRAME;
      AniParams.sX = FIXEDPT_TO_INT32(pBullet.qCurrX);
      AniParams.sY = FIXEDPT_TO_INT32(pBullet.qCurrY);
      AniParams.sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(pBullet.qCurrZ));

      if (pBullet.usFlags & (BULLET_FLAG_CREATURE_SPIT)) {
        AniParams.zCachedFile = "TILECACHE\\SPIT2.STI";
      } else if (pBullet.usFlags & (BULLET_FLAG_KNIFE)) {
        AniParams.zCachedFile = "TILECACHE\\KNIFING.STI";
        pBullet.ubItemStatus = pBullet.pFirer.inv[Enum261.HANDPOS].bStatus[0];
      }

      // Get direction to use for this guy....
      dX = ((pBullet.qIncrX) / FIXEDPT_FRACTIONAL_RESOLUTION);
      dY = ((pBullet.qIncrY) / FIXEDPT_FRACTIONAL_RESOLUTION);

      ubDirection = atan8(0, 0, (dX * 100), (dY * 100));

      AniParams.uiUserData3 = ubDirection;

      pBullet.pAniTile = CreateAnimationTile(AniParams);

      // IF we are anything that needs a shadow.. set it here....
      if (pBullet.usFlags & (BULLET_FLAG_KNIFE)) {
        AniParams.ubLevelID = ANI_SHADOW_LEVEL;
        AniParams.sZ = 0;
        pBullet.pShadowAniTile = CreateAnimationTile(AniParams);
      }
    }
  }
}

export function RemoveBullet(iBullet: INT32): void {
  if (iBullet >= NUM_BULLET_SLOTS) {
    return;
  }

  // decrease soldier's bullet count

  if (gBullets[iBullet].fReal) {
    // set to be deleted at next update
    gBullets[iBullet].fToDelete = true;

    // decrement reference to bullet in the firer
    gBullets[iBullet].pFirer.bBulletsLeft--;
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Ending bullet, bullets left %d", gBullets[iBullet].pFirer.bBulletsLeft));

    if (gBullets[iBullet].usFlags & (BULLET_FLAG_KNIFE)) {
      // Delete ani tile
      if (gBullets[iBullet].pAniTile != null) {
        DeleteAniTile(<ANITILE>gBullets[iBullet].pAniTile);
        gBullets[iBullet].pAniTile = null;
      }

      // Delete shadow
      if (gBullets[iBullet].usFlags & (BULLET_FLAG_KNIFE)) {
        if (gBullets[iBullet].pShadowAniTile != null) {
          DeleteAniTile(<ANITILE>gBullets[iBullet].pShadowAniTile);
          gBullets[iBullet].pShadowAniTile = null;
        }
      }
    }
  } else {
    // delete this fake bullet right away!
    gBullets[iBullet].fAllocated = false;
    RecountBullets();
  }
}

export function LocateBullet(iBulletIndex: INT32): void {
  if (gGameSettings.fOptions[Enum8.TOPTION_SHOW_MISSES]) {
    // Check if a bad guy fired!
    if (gBullets[iBulletIndex].ubFirerID != NOBODY) {
      if (MercPtrs[gBullets[iBulletIndex].ubFirerID].bSide == gbPlayerNum) {
        if (!gBullets[iBulletIndex].fLocated) {
          gBullets[iBulletIndex].fLocated = true;

          // Only if we are in turnbased and noncombat
          if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
            LocateGridNo(gBullets[iBulletIndex].sGridNo);
          }
        }
      }
    }
  }
}

export function UpdateBullets(): void {
  let uiCount: UINT32;
  let pNode: LEVELNODE;
  let fDeletedSome: boolean = false;

  for (uiCount = 0; uiCount < guiNumBullets; uiCount++) {
    if (gBullets[uiCount].fAllocated) {
      if (gBullets[uiCount].fReal && !(gBullets[uiCount].usFlags & BULLET_STOPPED)) {
        // there are duplicate checks for deletion in case the bullet is deleted by shooting
        // someone at point blank range, in the first MoveBullet call in the FireGun code
        if (gBullets[uiCount].fToDelete) {
          // Remove from old position
          gBullets[uiCount].fAllocated = false;
          fDeletedSome = true;
          continue;
        }

        // if ( !( gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] ) )
        {
          // ALRIGHTY, CHECK WHAT TYPE OF BULLET WE ARE

          if (gBullets[uiCount].usFlags & (BULLET_FLAG_CREATURE_SPIT | BULLET_FLAG_KNIFE | BULLET_FLAG_MISSILE | BULLET_FLAG_SMALL_MISSILE | BULLET_FLAG_TANK_CANNON | BULLET_FLAG_FLAME)) {
          } else {
            RemoveStruct(gBullets[uiCount].sGridNo, Enum312.BULLETTILE1);
            RemoveStruct(gBullets[uiCount].sGridNo, Enum312.BULLETTILE2);
          }
        }

        MoveBullet(uiCount);
        if (gBullets[uiCount].fToDelete) {
          // Remove from old position
          gBullets[uiCount].fAllocated = false;
          fDeletedSome = true;
          continue;
        }

        if (gBullets[uiCount].usFlags & BULLET_STOPPED) {
          continue;
        }

        // Display bullet
        // if ( !( gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] ) )
        {
          if (gBullets[uiCount].usFlags & (BULLET_FLAG_KNIFE)) {
            if (gBullets[uiCount].pAniTile != null) {
              (<ANITILE>gBullets[uiCount].pAniTile).sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
              (<ANITILE>gBullets[uiCount].pAniTile).sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
              (<ANITILE>gBullets[uiCount].pAniTile).pLevelNode.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(gBullets[uiCount].qCurrZ));

              if (gBullets[uiCount].usFlags & (BULLET_FLAG_KNIFE)) {
                (<ANITILE>gBullets[uiCount].pShadowAniTile).sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
                (<ANITILE>gBullets[uiCount].pShadowAniTile).sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
              }
            }
          }
          // Are we a missle?
          else if (gBullets[uiCount].usFlags & (BULLET_FLAG_MISSILE | BULLET_FLAG_SMALL_MISSILE | BULLET_FLAG_TANK_CANNON | BULLET_FLAG_FLAME | BULLET_FLAG_CREATURE_SPIT)) {
          } else {
            pNode = <LEVELNODE>AddStructToTail(gBullets[uiCount].sGridNo, Enum312.BULLETTILE1);
            pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT);
            pNode.sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
            pNode.sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
            pNode.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(gBullets[uiCount].qCurrZ));

            // Display shadow
            pNode = <LEVELNODE>AddStructToTail(gBullets[uiCount].sGridNo, Enum312.BULLETTILE2);
            pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT);
            pNode.sRelativeX = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrX);
            pNode.sRelativeY = FIXEDPT_TO_INT32(gBullets[uiCount].qCurrY);
            pNode.sRelativeZ = gpWorldLevelData[gBullets[uiCount].sGridNo].sHeight;
          }
        }
      } else {
        if (gBullets[uiCount].fToDelete) {
          gBullets[uiCount].fAllocated = false;
          fDeletedSome = true;
        }
      }
    }
  }

  if (fDeletedSome) {
    RecountBullets();
  }
}

export function GetBulletPtr(iBullet: INT32): BULLET {
  let pBullet: BULLET;

  if (iBullet >= NUM_BULLET_SLOTS) {
    return <BULLET><unknown>null;
  }

  pBullet = gBullets[iBullet];

  return pBullet;
}

export function AddMissileTrail(pBullet: BULLET, qCurrX: FIXEDPT, qCurrY: FIXEDPT, qCurrZ: FIXEDPT): void {
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();

  // If we are a small missle, don't show
  if (pBullet.usFlags & (BULLET_FLAG_SMALL_MISSILE | BULLET_FLAG_FLAME | BULLET_FLAG_CREATURE_SPIT)) {
    if (pBullet.iLoop < 5) {
      return;
    }
  }

  // If we are a small missle, don't show
  if (pBullet.usFlags & (BULLET_FLAG_TANK_CANNON)) {
    // if ( pBullet->iLoop < 40 )
    //{
    return;
    //}
  }

  AniParams.sGridNo = pBullet.sGridNo;
  AniParams.ubLevelID = ANI_STRUCT_LEVEL;
  AniParams.sDelay = (100 + Random(100));
  AniParams.sStartFrame = 0;
  AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_ALWAYS_TRANSLUCENT;
  AniParams.sX = FIXEDPT_TO_INT32(qCurrX);
  AniParams.sY = FIXEDPT_TO_INT32(qCurrY);
  AniParams.sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(FIXEDPT_TO_INT32(qCurrZ));

  if (pBullet.usFlags & (BULLET_FLAG_MISSILE | BULLET_FLAG_TANK_CANNON)) {
    AniParams.zCachedFile = "TILECACHE\\MSLE_SMK.STI";
  } else if (pBullet.usFlags & (BULLET_FLAG_SMALL_MISSILE)) {
    AniParams.zCachedFile = "TILECACHE\\MSLE_SMA.STI";
  } else if (pBullet.usFlags & (BULLET_FLAG_CREATURE_SPIT)) {
    AniParams.zCachedFile = "TILECACHE\\MSLE_SPT.STI";
  } else if (pBullet.usFlags & (BULLET_FLAG_FLAME)) {
    AniParams.zCachedFile = "TILECACHE\\FLMTHR2.STI";
    AniParams.sDelay = (100);
  }

  CreateAnimationTile(AniParams);
}

export function SaveBulletStructureToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let usCnt: UINT16;
  let uiBulletCount: UINT32 = 0;
  let buffer: Buffer;

  // loop through and count the number of bullets
  for (usCnt = 0; usCnt < NUM_BULLET_SLOTS; usCnt++) {
    // if the bullet is active, save it
    if (gBullets[usCnt].fAllocated) {
      uiBulletCount++;
    }
  }

  // Save the number of Bullets in the array
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiBulletCount, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  if (uiBulletCount != 0) {
    buffer = Buffer.allocUnsafe(BULLET_SIZE);
    for (usCnt = 0; usCnt < NUM_BULLET_SLOTS; usCnt++) {
      // if the bullet is active, save it
      if (gBullets[usCnt].fAllocated) {
        // Save the the Bullet structure
        writeBullet(gBullets[usCnt], buffer);
        uiNumBytesWritten = FileWrite(hFile, buffer, BULLET_SIZE);
        if (uiNumBytesWritten != BULLET_SIZE) {
          return false;
        }
      }
    }
  }

  return true;
}

export function LoadBulletStructureFromSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let usCnt: UINT16;
  let buffer: Buffer;

  // make sure the bullets are not allocated
  gBullets.forEach(resetBullet);

  // Load the number of Bullets in the array
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    return false;
  }

  guiNumBullets = buffer.readUInt32LE(0);

  buffer = Buffer.allocUnsafe(BULLET_SIZE);
  for (usCnt = 0; usCnt < guiNumBullets; usCnt++) {
    // Load the the Bullet structure
    uiNumBytesRead = FileRead(hFile, buffer, BULLET_SIZE);
    if (uiNumBytesRead != BULLET_SIZE) {
      return false;
    }

    readBullet(gBullets[usCnt], buffer);

    // Set some parameters
    gBullets[usCnt].uiLastUpdate = 0;
    if (gBullets[usCnt].ubFirerID != NOBODY)
      gBullets[usCnt].pFirer = Menptr[gBullets[usCnt].ubFirerID];
    else
      gBullets[usCnt].pFirer = <SOLDIERTYPE><unknown>null;

    gBullets[usCnt].pAniTile = null;
    gBullets[usCnt].pShadowAniTile = null;
    gBullets[usCnt].iBullet = usCnt;

    HandleBulletSpecialFlags(gBullets[usCnt].iBullet);
  }

  return true;
}

export function StopBullet(iBullet: INT32): void {
  gBullets[iBullet].usFlags |= BULLET_STOPPED;

  RemoveStruct(gBullets[iBullet].sGridNo, Enum312.BULLETTILE1);
  RemoveStruct(gBullets[iBullet].sGridNo, Enum312.BULLETTILE2);
}

export function DeleteAllBullets(): void {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumBullets; uiCount++) {
    if (gBullets[uiCount].fAllocated) {
      // Remove from old position
      RemoveBullet(uiCount);
      gBullets[uiCount].fAllocated = false;
    }
  }

  RecountBullets();
}

}
