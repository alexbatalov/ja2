namespace ja2 {

const NUM_SMOKE_EFFECT_SLOTS = 25;

// GLOBAL FOR SMOKE LISTING
let gSmokeEffectData: SMOKEEFFECT[] /* [NUM_SMOKE_EFFECT_SLOTS] */ = createArrayFrom(NUM_SMOKE_EFFECT_SLOTS, createSmokeEffect);
let guiNumSmokeEffects: UINT32 = 0;

function GetFreeSmokeEffect(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumSmokeEffects; uiCount++) {
    if ((gSmokeEffectData[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumSmokeEffects < NUM_SMOKE_EFFECT_SLOTS)
    return guiNumSmokeEffects++;

  return -1;
}

function RecountSmokeEffects(): void {
  let uiCount: INT32;

  for (uiCount = guiNumSmokeEffects - 1; (uiCount >= 0); uiCount--) {
    if ((gSmokeEffectData[uiCount].fAllocated)) {
      guiNumSmokeEffects = (uiCount + 1);
      break;
    }
  }
}

// Returns NO_SMOKE_EFFECT if none there...
export function GetSmokeEffectOnTile(sGridNo: INT16, bLevel: INT8): INT8 {
  let ubExtFlags: UINT8;

  ubExtFlags = gpWorldLevelData[sGridNo].ubExtFlags[bLevel];

  // Look at worldleveldata to find flags..
  if (ubExtFlags & ANY_SMOKE_EFFECT) {
    // Which smoke am i?
    return FromWorldFlagsToSmokeType(ubExtFlags);
  }

  return Enum308.NO_SMOKE_EFFECT;
}

function FromWorldFlagsToSmokeType(ubWorldFlags: UINT8): INT8 {
  if (ubWorldFlags & MAPELEMENT_EXT_SMOKE) {
    return Enum308.NORMAL_SMOKE_EFFECT;
  } else if (ubWorldFlags & MAPELEMENT_EXT_TEARGAS) {
    return Enum308.TEARGAS_SMOKE_EFFECT;
  } else if (ubWorldFlags & MAPELEMENT_EXT_MUSTARDGAS) {
    return Enum308.MUSTARDGAS_SMOKE_EFFECT;
  } else if (ubWorldFlags & MAPELEMENT_EXT_CREATUREGAS) {
    return Enum308.CREATURE_SMOKE_EFFECT;
  } else {
    return Enum308.NO_SMOKE_EFFECT;
  }
}

function FromSmokeTypeToWorldFlags(bType: INT8): UINT8 {
  switch (bType) {
    case Enum308.NORMAL_SMOKE_EFFECT:

      return MAPELEMENT_EXT_SMOKE;
      break;

    case Enum308.TEARGAS_SMOKE_EFFECT:

      return MAPELEMENT_EXT_TEARGAS;
      break;

    case Enum308.MUSTARDGAS_SMOKE_EFFECT:

      return MAPELEMENT_EXT_MUSTARDGAS;
      break;

    case Enum308.CREATURE_SMOKE_EFFECT:

      return MAPELEMENT_EXT_CREATUREGAS;
      break;

    default:

      return 0;
  }
}

export function NewSmokeEffect(sGridNo: INT16, usItem: UINT16, bLevel: INT8, ubOwner: UINT8): INT32 {
  let pSmoke: SMOKEEFFECT;
  let iSmokeIndex: INT32;
  let bSmokeEffectType: INT8 = 0;
  let ubDuration: UINT8 = 0;
  let ubStartRadius: UINT8 = 0;

  if ((iSmokeIndex = GetFreeSmokeEffect()) == (-1))
    return -1;

  resetSmokeEffect(gSmokeEffectData[iSmokeIndex]);

  pSmoke = gSmokeEffectData[iSmokeIndex];

  // Set some values...
  pSmoke.sGridNo = sGridNo;
  pSmoke.usItem = usItem;
  pSmoke.uiTimeOfLastUpdate = GetWorldTotalSeconds();

  // Are we indoors?
  if (GetTerrainType(sGridNo) == Enum315.FLAT_FLOOR) {
    pSmoke.bFlags |= SMOKE_EFFECT_INDOORS;
  }

  switch (usItem) {
    case Enum225.MUSTARD_GRENADE:

      bSmokeEffectType = Enum308.MUSTARDGAS_SMOKE_EFFECT;
      ubDuration = 5;
      ubStartRadius = 1;
      break;

    case Enum225.TEARGAS_GRENADE:
    case Enum225.GL_TEARGAS_GRENADE:
      bSmokeEffectType = Enum308.TEARGAS_SMOKE_EFFECT;
      ubDuration = 5;
      ubStartRadius = 1;
      break;

    case Enum225.BIG_TEAR_GAS:
      bSmokeEffectType = Enum308.TEARGAS_SMOKE_EFFECT;
      ubDuration = 5;
      ubStartRadius = 1;
      break;

    case Enum225.SMOKE_GRENADE:
    case Enum225.GL_SMOKE_GRENADE:

      bSmokeEffectType = Enum308.NORMAL_SMOKE_EFFECT;
      ubDuration = 5;
      ubStartRadius = 1;
      break;

    case Enum225.SMALL_CREATURE_GAS:
      bSmokeEffectType = Enum308.CREATURE_SMOKE_EFFECT;
      ubDuration = 3;
      ubStartRadius = 1;
      break;

    case Enum225.LARGE_CREATURE_GAS:
      bSmokeEffectType = Enum308.CREATURE_SMOKE_EFFECT;
      ubDuration = 3;
      ubStartRadius = Explosive[Item[Enum225.LARGE_CREATURE_GAS].ubClassIndex].ubRadius;
      break;

    case Enum225.VERY_SMALL_CREATURE_GAS:

      bSmokeEffectType = Enum308.CREATURE_SMOKE_EFFECT;
      ubDuration = 2;
      ubStartRadius = 0;
      break;
  }

  pSmoke.ubDuration = ubDuration;
  pSmoke.ubRadius = ubStartRadius;
  pSmoke.bAge = 0;
  pSmoke.fAllocated = true;
  pSmoke.bType = bSmokeEffectType;
  pSmoke.ubOwner = ubOwner;

  if (pSmoke.bFlags & SMOKE_EFFECT_INDOORS) {
    // Duration is increased by 2 turns...indoors
    pSmoke.ubDuration += 3;
  }

  if (bLevel) {
    pSmoke.bFlags |= SMOKE_EFFECT_ON_ROOF;
  }

  // ATE: FALSE into subsequent-- it's the first one!
  SpreadEffect(pSmoke.sGridNo, pSmoke.ubRadius, pSmoke.usItem, pSmoke.ubOwner, 0, bLevel, iSmokeIndex);

  return iSmokeIndex;
}

// Add smoke to gridno
// ( Replacement algorithm uses distance away )
export function AddSmokeEffectToTile(iSmokeEffectID: INT32, bType: INT8, sGridNo: INT16, bLevel: INT8): void {
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
  let pAniTile: ANITILE;
  let pSmoke: SMOKEEFFECT;
  let fDissipating: boolean = false;

  pSmoke = gSmokeEffectData[iSmokeEffectID];

  if ((pSmoke.ubDuration - pSmoke.bAge) < 2) {
    fDissipating = true;
    // Remove old one...
    RemoveSmokeEffectFromTile(sGridNo, bLevel);
  }

  // If smoke effect exists already.... stop
  if (gpWorldLevelData[sGridNo].ubExtFlags[bLevel] & ANY_SMOKE_EFFECT) {
    return;
  }

  // OK,  Create anitile....
  AniParams.sGridNo = sGridNo;

  if (bLevel == 0) {
    AniParams.ubLevelID = ANI_STRUCT_LEVEL;
  } else {
    AniParams.ubLevelID = ANI_ONROOF_LEVEL;
  }

  AniParams.sDelay = (300 + Random(300));

  if (!(gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE])) {
    AniParams.sStartFrame = 0;
  } else {
    AniParams.sStartFrame = Random(5);
  }

  // Bare bones flags are...
  //	AniParams.uiFlags							= ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_OPTIMIZEFORSMOKEEFFECT | ANITILE_SMOKE_EFFECT | ANITILE_LOOPING;
  // AniParams.uiFlags							= ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_SMOKE_EFFECT | ANITILE_LOOPING;

  if (!(gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE])) {
    AniParams.uiFlags = ANITILE_PAUSED | ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_SMOKE_EFFECT | ANITILE_LOOPING;
  } else {
    AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_SMOKE_EFFECT | ANITILE_LOOPING | ANITILE_ALWAYS_TRANSLUCENT;
  }

  AniParams.sX = CenterX(sGridNo);
  AniParams.sY = CenterY(sGridNo);
  AniParams.sZ = 0;

  // Use the right graphic based on type..
  switch (bType) {
    case Enum308.NORMAL_SMOKE_EFFECT:

      if (!(gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE])) {
        AniParams.zCachedFile = "TILECACHE\\smkechze.STI";
      } else {
        if (fDissipating) {
          AniParams.zCachedFile = "TILECACHE\\smalsmke.STI";
        } else {
          AniParams.zCachedFile = "TILECACHE\\SMOKE.STI";
        }
      }
      break;

    case Enum308.TEARGAS_SMOKE_EFFECT:

      if (!(gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE])) {
        AniParams.zCachedFile = "TILECACHE\\tearchze.STI";
      } else {
        if (fDissipating) {
          AniParams.zCachedFile = "TILECACHE\\smaltear.STI";
        } else {
          AniParams.zCachedFile = "TILECACHE\\TEARGAS.STI";
        }
      }
      break;

    case Enum308.MUSTARDGAS_SMOKE_EFFECT:

      if (!(gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE])) {
        AniParams.zCachedFile = "TILECACHE\\mustchze.STI";
      } else {
        if (fDissipating) {
          AniParams.zCachedFile = "TILECACHE\\smalmust.STI";
        } else {
          AniParams.zCachedFile = "TILECACHE\\MUSTARD2.STI";
        }
      }
      break;

    case Enum308.CREATURE_SMOKE_EFFECT:

      if (!(gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE])) {
        AniParams.zCachedFile = "TILECACHE\\spit_gas.STI";
      } else {
        if (fDissipating) {
          AniParams.zCachedFile = "TILECACHE\\spit_gas.STI";
        } else {
          AniParams.zCachedFile = "TILECACHE\\spit_gas.STI";
        }
      }
      break;
  }

  // Create tile...
  pAniTile = <ANITILE>CreateAnimationTile(AniParams);

  // Set world flags
  gpWorldLevelData[sGridNo].ubExtFlags[bLevel] |= FromSmokeTypeToWorldFlags(bType);

  // All done...

  // Re-draw..... :(
  SetRenderFlags(RENDER_FLAG_FULL);
}

export function RemoveSmokeEffectFromTile(sGridNo: INT16, bLevel: INT8): void {
  let pAniTile: ANITILE | null;
  let ubLevelID: UINT8;

  // Get ANI tile...
  if (bLevel == 0) {
    ubLevelID = ANI_STRUCT_LEVEL;
  } else {
    ubLevelID = ANI_ONROOF_LEVEL;
  }

  pAniTile = GetCachedAniTileOfType(sGridNo, ubLevelID, ANITILE_SMOKE_EFFECT);

  if (pAniTile != null) {
    DeleteAniTile(pAniTile);

    SetRenderFlags(RENDER_FLAG_FULL);
  }

  // Unset flags in world....
  // ( // check to see if we are the last one....
  if (GetCachedAniTileOfType(sGridNo, ubLevelID, ANITILE_SMOKE_EFFECT) == null) {
    gpWorldLevelData[sGridNo].ubExtFlags[bLevel] &= (~ANY_SMOKE_EFFECT);
  }
}

export function DecaySmokeEffects(uiTime: UINT32): void {
  let pSmoke: SMOKEEFFECT;
  let cnt: UINT32;
  let cnt2: UINT32;
  let fUpdate: boolean = false;
  let fSpreadEffect: boolean;
  let bLevel: INT8;
  let usNumUpdates: UINT16 = 1;

  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    if (MercSlots[cnt]) {
      // reset 'hit by gas' flags
      MercSlots[cnt].fHitByGasFlags = 0;
    }
  }

  // ATE: 1 ) make first pass and delete/mark any smoke effect for update
  // all the deleting has to be done first///

  // age all active tear gas clouds, deactivate those that are just dispersing
  for (cnt = 0; cnt < guiNumSmokeEffects; cnt++) {
    fSpreadEffect = true;

    pSmoke = gSmokeEffectData[cnt];

    if (pSmoke.fAllocated) {
      if (pSmoke.bFlags & SMOKE_EFFECT_ON_ROOF) {
        bLevel = 1;
      } else {
        bLevel = 0;
      }

      // Do things differently for combat /vs realtime
      // always try to update during combat
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        fUpdate = true;
      } else {
        // ATE: Do this every so ofte, to acheive the effect we want...
        if ((uiTime - pSmoke.uiTimeOfLastUpdate) > 10) {
          fUpdate = true;

          usNumUpdates = Math.trunc((uiTime - pSmoke.uiTimeOfLastUpdate) / 10);
        }
      }

      if (fUpdate) {
        pSmoke.uiTimeOfLastUpdate = uiTime;

        for (cnt2 = 0; cnt2 < usNumUpdates; cnt2++) {
          pSmoke.bAge++;

          if (pSmoke.bAge == 1) {
            // ATE: At least mark for update!
            pSmoke.bFlags |= SMOKE_EFFECT_MARK_FOR_UPDATE;
            fSpreadEffect = false;
          } else {
            fSpreadEffect = true;
          }

          if (fSpreadEffect) {
            // if this cloud remains effective (duration not reached)
            if (pSmoke.bAge <= pSmoke.ubDuration) {
              // ATE: Only mark now and increse radius - actual drawing is done
              // in another pass cause it could
              // just get erased...
              pSmoke.bFlags |= SMOKE_EFFECT_MARK_FOR_UPDATE;

              // calculate the new cloud radius
              // cloud expands by 1 every turn outdoors, and every other turn indoors

              // ATE: If radius is < maximun, increase radius, otherwise keep at max
              if (pSmoke.ubRadius < Explosive[Item[pSmoke.usItem].ubClassIndex].ubRadius) {
                pSmoke.ubRadius++;
              }
            } else {
              // deactivate tear gas cloud (use last known radius)
              SpreadEffect(pSmoke.sGridNo, pSmoke.ubRadius, pSmoke.usItem, pSmoke.ubOwner, ERASE_SPREAD_EFFECT, bLevel, cnt);
              pSmoke.fAllocated = false;
              break;
            }
          }
        }
      } else {
        // damage anyone standing in cloud
        SpreadEffect(pSmoke.sGridNo, pSmoke.ubRadius, pSmoke.usItem, pSmoke.ubOwner, REDO_SPREAD_EFFECT, 0, cnt);
      }
    }
  }

  for (cnt = 0; cnt < guiNumSmokeEffects; cnt++) {
    pSmoke = gSmokeEffectData[cnt];

    if (pSmoke.fAllocated) {
      if (pSmoke.bFlags & SMOKE_EFFECT_ON_ROOF) {
        bLevel = 1;
      } else {
        bLevel = 0;
      }

      // if this cloud remains effective (duration not reached)
      if (pSmoke.bFlags & SMOKE_EFFECT_MARK_FOR_UPDATE) {
        SpreadEffect(pSmoke.sGridNo, pSmoke.ubRadius, pSmoke.usItem, pSmoke.ubOwner, 1, bLevel, cnt);
        pSmoke.bFlags &= (~SMOKE_EFFECT_MARK_FOR_UPDATE);
      }
    }
  }

  AllTeamsLookForAll(true);
}

export function SaveSmokeEffectsToSaveGameFile(hFile: HWFILE): boolean {
  /*
          UINT32	uiNumBytesWritten;
          UINT32	uiCnt=0;
          UINT32	uiNumSmokeEffects=0;


          //loop through and count the number of smoke effects
          for( uiCnt=0; uiCnt<guiNumSmokeEffects; uiCnt++)
          {
                  if( gSmokeEffectData[ uiCnt ].fAllocated )
                          uiNumSmokeEffects++;
          }


          //Save the Number of Smoke Effects
          FileWrite( hFile, &uiNumSmokeEffects, sizeof( UINT32 ), &uiNumBytesWritten );
          if( uiNumBytesWritten != sizeof( UINT32 ) )
          {
                  return( FALSE );
          }


          if( uiNumSmokeEffects != 0 )
          {
                  //loop through and save the number of smoke effects
                  for( uiCnt=0; uiCnt < guiNumSmokeEffects; uiCnt++)
                  {
                          //if the smoke is active
                          if( gSmokeEffectData[ uiCnt ].fAllocated )
                          {
                                  //Save the Smoke effect Data
                                  FileWrite( hFile, &gSmokeEffectData[ uiCnt ], sizeof( SMOKEEFFECT ), &uiNumBytesWritten );
                                  if( uiNumBytesWritten != sizeof( SMOKEEFFECT ) )
                                  {
                                          return( FALSE );
                                  }
                          }
                  }
          }
  */
  return true;
}

export function LoadSmokeEffectsFromLoadGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let uiCount: UINT32;
  let uiCnt: UINT32 = 0;
  let bLevel: INT8;
  let buffer: Buffer;

  // no longer need to load smoke effects.  They are now in temp files
  if (guiSaveGameVersion < 75) {
    // Clear out the old list
    gSmokeEffectData.forEach(resetSmokeEffect);

    // Load the Number of Smoke Effects
    buffer = Buffer.allocUnsafe(4);
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      return false;
    }

    guiNumSmokeEffects = buffer.readUInt32LE(0);

    // This is a TEMP hack to allow us to use the saves
    if (guiSaveGameVersion < 37 && guiNumSmokeEffects == 0) {
      // Load the Smoke effect Data
      buffer = Buffer.allocUnsafe(SMOKE_EFFECT_SIZE);
      uiNumBytesRead = FileRead(hFile, buffer, SMOKE_EFFECT_SIZE);
      if (uiNumBytesRead != SMOKE_EFFECT_SIZE) {
        return false;
      }

      readSmokeEffect(gSmokeEffectData[0], buffer);
    }

    // loop through and load the list
    buffer = Buffer.allocUnsafe(SMOKE_EFFECT_SIZE);
    for (uiCnt = 0; uiCnt < guiNumSmokeEffects; uiCnt++) {
      // Load the Smoke effect Data
      uiNumBytesRead = FileRead(hFile, buffer, SMOKE_EFFECT_SIZE);
      if (uiNumBytesRead != SMOKE_EFFECT_SIZE) {
        return false;
      }

      readSmokeEffect(gSmokeEffectData[uiCnt], buffer);

      // This is a TEMP hack to allow us to use the saves
      if (guiSaveGameVersion < 37)
        break;
    }

    // loop through and apply the smoke effects to the map
    for (uiCount = 0; uiCount < guiNumSmokeEffects; uiCount++) {
      // if this slot is allocated
      if (gSmokeEffectData[uiCount].fAllocated) {
        if (gSmokeEffectData[uiCount].bFlags & SMOKE_EFFECT_ON_ROOF) {
          bLevel = 1;
        } else {
          bLevel = 0;
        }

        SpreadEffect(gSmokeEffectData[uiCount].sGridNo, gSmokeEffectData[uiCount].ubRadius, gSmokeEffectData[uiCount].usItem, gSmokeEffectData[uiCount].ubOwner, 1, bLevel, uiCount);
      }
    }
  }

  return true;
}

export function SaveSmokeEffectsToMapTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let uiNumSmokeEffects: UINT32 = 0;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  let zMapName: string /* CHAR8[128] */;
  let uiCnt: UINT32;
  let buffer: Buffer;

  // get the name of the map
  zMapName = GetMapTempFileName(SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // delete file the file.
  FileDelete(zMapName);

  // loop through and count the number of smoke effects
  for (uiCnt = 0; uiCnt < guiNumSmokeEffects; uiCnt++) {
    if (gSmokeEffectData[uiCnt].fAllocated)
      uiNumSmokeEffects++;
  }

  // if there are no smoke effects
  if (uiNumSmokeEffects == 0) {
    // set the fact that there are no smoke effects for this sector
    ReSetSectorFlag(sMapX, sMapY, bMapZ, SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS);

    return true;
  }

  // Open the file for writing
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening file
    return false;
  }

  // Save the Number of Smoke Effects
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumSmokeEffects, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    // Close the file
    FileClose(hFile);

    return false;
  }

  // loop through and save the number of smoke effects
  buffer = Buffer.allocUnsafe(SMOKE_EFFECT_SIZE);
  for (uiCnt = 0; uiCnt < guiNumSmokeEffects; uiCnt++) {
    // if the smoke is active
    if (gSmokeEffectData[uiCnt].fAllocated) {
      // Save the Smoke effect Data
      writeSmokeEffect(gSmokeEffectData[uiCnt], buffer);
      uiNumBytesWritten = FileWrite(hFile, buffer, SMOKE_EFFECT_SIZE);
      if (uiNumBytesWritten != SMOKE_EFFECT_SIZE) {
        // Close the file
        FileClose(hFile);

        return false;
      }
    }
  }

  // Close the file
  FileClose(hFile);

  SetSectorFlag(sMapX, sMapY, bMapZ, SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS);

  return true;
}

export function LoadSmokeEffectsFromMapTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let uiNumBytesRead: UINT32;
  let uiCount: UINT32;
  let uiCnt: UINT32 = 0;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  let zMapName: string /* CHAR8[128] */;
  let bLevel: INT8;
  let buffer: Buffer;

  zMapName = GetMapTempFileName(SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Open the file for reading, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Clear out the old list
  ResetSmokeEffects();

  // Load the Number of Smoke Effects
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hFile);
    return false;
  }

  guiNumSmokeEffects = buffer.readUInt32LE(0);

  // loop through and load the list
  buffer = Buffer.allocUnsafe(SMOKE_EFFECT_SIZE);
  for (uiCnt = 0; uiCnt < guiNumSmokeEffects; uiCnt++) {
    // Load the Smoke effect Data
    uiNumBytesRead = FileRead(hFile, buffer, SMOKE_EFFECT_SIZE);
    if (uiNumBytesRead != SMOKE_EFFECT_SIZE) {
      FileClose(hFile);
      return false;
    }

    readSmokeEffect(gSmokeEffectData[uiCnt], buffer);
  }

  // loop through and apply the smoke effects to the map
  for (uiCount = 0; uiCount < guiNumSmokeEffects; uiCount++) {
    // if this slot is allocated
    if (gSmokeEffectData[uiCount].fAllocated) {
      if (gSmokeEffectData[uiCount].bFlags & SMOKE_EFFECT_ON_ROOF) {
        bLevel = 1;
      } else {
        bLevel = 0;
      }

      SpreadEffect(gSmokeEffectData[uiCount].sGridNo, gSmokeEffectData[uiCount].ubRadius, gSmokeEffectData[uiCount].usItem, gSmokeEffectData[uiCount].ubOwner, 1, bLevel, uiCount);
    }
  }

  FileClose(hFile);

  return true;
}

export function ResetSmokeEffects(): void {
  // Clear out the old list
  gSmokeEffectData.forEach(resetSmokeEffect);
  guiNumSmokeEffects = 0;
}

export function UpdateSmokeEffectGraphics(): void {
  let uiCnt: UINT32;
  let pSmoke: SMOKEEFFECT;
  let bLevel: INT8;

  // loop through and save the number of smoke effects
  for (uiCnt = 0; uiCnt < guiNumSmokeEffects; uiCnt++) {
    pSmoke = gSmokeEffectData[uiCnt];

    // if the smoke is active
    if (gSmokeEffectData[uiCnt].fAllocated) {
      if (gSmokeEffectData[uiCnt].bFlags & SMOKE_EFFECT_ON_ROOF) {
        bLevel = 1;
      } else {
        bLevel = 0;
      }

      SpreadEffect(pSmoke.sGridNo, pSmoke.ubRadius, pSmoke.usItem, pSmoke.ubOwner, ERASE_SPREAD_EFFECT, bLevel, uiCnt);

      SpreadEffect(pSmoke.sGridNo, pSmoke.ubRadius, pSmoke.usItem, pSmoke.ubOwner, 1, bLevel, uiCnt);
    }
  }
}

}
