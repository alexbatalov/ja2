namespace ja2 {

// MODULE FOR EXPLOSIONS

let ubTransKeyFrame: UINT8[] /* [NUM_EXP_TYPES] */ = [
  0,
  17,
  28,
  24,
  1,
  1,
  1,
  1,
  1,
];

let ubDamageKeyFrame: UINT8[] /* [NUM_EXP_TYPES] */ = [
  0,
  3,
  5,
  5,
  5,
  18,
  18,
  18,
  18,
];

let uiExplosionSoundID: UINT32[] /* [NUM_EXP_TYPES] */ = [
  Enum330.EXPLOSION_1,
  Enum330.EXPLOSION_1,
  Enum330.EXPLOSION_BLAST_2, // LARGE
  Enum330.EXPLOSION_BLAST_2,
  Enum330.EXPLOSION_1,
  Enum330.AIR_ESCAPING_1,
  Enum330.AIR_ESCAPING_1,
  Enum330.AIR_ESCAPING_1,
  Enum330.AIR_ESCAPING_1,
];

let zBlastFilenames: string[] /* CHAR8[][70] */ = [
  "",
  "TILECACHE\\ZGRAV_D.STI",
  "TILECACHE\\ZGRAV_C.STI",
  "TILECACHE\\ZGRAV_B.STI",
  "TILECACHE\\shckwave.STI",
  "TILECACHE\\WAT_EXP.STI",
  "TILECACHE\\TEAR_EXP.STI",
  "TILECACHE\\TEAR_EXP.STI",
  "TILECACHE\\MUST_EXP.STI",
];

let sBlastSpeeds: string /* CHAR8[] */ = [
  0,
  80,
  80,
  80,
  20,
  80,
  80,
  80,
  80,
];

const BOMB_QUEUE_DELAY = () => (1000 + Random(500));

const MAX_BOMB_QUEUE = 40;
let gExplosionQueue: ExplosionQueueElement[] /* [MAX_BOMB_QUEUE] */;
export let gubElementsOnExplosionQueue: UINT8 = 0;
export let gfExplosionQueueActive: boolean = false;

let gfExplosionQueueMayHaveChangedSight: boolean = false;
let gubPersonToSetOffExplosions: UINT8 = NOBODY;

let gsTempActionGridNo: INT16 = NOWHERE;

const NUM_EXPLOSION_SLOTS = 100;

// GLOBAL FOR SMOKE LISTING
export let gExplosionData: EXPLOSIONTYPE[] /* [NUM_EXPLOSION_SLOTS] */;
let guiNumExplosions: UINT32 = 0;

function GetFreeExplosion(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumExplosions; uiCount++) {
    if ((gExplosionData[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumExplosions < NUM_EXPLOSION_SLOTS)
    return guiNumExplosions++;

  return -1;
}

function RecountExplosions(): void {
  let uiCount: INT32;

  for (uiCount = guiNumExplosions - 1; (uiCount >= 0); uiCount--) {
    if ((gExplosionData[uiCount].fAllocated)) {
      guiNumExplosions = (uiCount + 1);
      break;
    }
  }
}

// GENERATE EXPLOSION
export function InternalIgniteExplosion(ubOwner: UINT8, sX: INT16, sY: INT16, sZ: INT16, sGridNo: INT16, usItem: UINT16, fLocate: boolean, bLevel: INT8): void {
  let ExpParams: EXPLOSION_PARAMS;

  // Double check that we are using an explosive!
  if (!(Item[usItem].usItemClass & IC_EXPLOSV)) {
    return;
  }

  // Increment attack counter...

  if (gubElementsOnExplosionQueue == 0) {
    // single explosion, disable sight until the end, and set flag
    // to check sight at end of attack

    gTacticalStatus.uiFlags |= (DISALLOW_SIGHT | CHECK_SIGHT_AT_END_OF_ATTACK);
  }

  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Incrementing Attack: Explosion gone off, COunt now %d", gTacticalStatus.ubAttackBusyCount));

  // OK, go on!
  ExpParams.uiFlags = EXPLOSION_FLAG_USEABSPOS;
  ExpParams.ubOwner = ubOwner;
  ExpParams.ubTypeID = Explosive[Item[usItem].ubClassIndex].ubAnimationID;
  ExpParams.sX = sX;
  ExpParams.sY = sY;
  ExpParams.sZ = sZ;
  ExpParams.sGridNo = sGridNo;
  ExpParams.usItem = usItem;
  ExpParams.fLocate = fLocate;
  ExpParams.bLevel = bLevel;

  GenerateExplosion(addressof(ExpParams));
}

export function IgniteExplosion(ubOwner: UINT8, sX: INT16, sY: INT16, sZ: INT16, sGridNo: INT16, usItem: UINT16, bLevel: INT8): void {
  InternalIgniteExplosion(ubOwner, sX, sY, sZ, sGridNo, usItem, true, bLevel);
}

export function GenerateExplosion(pExpParams: Pointer<EXPLOSION_PARAMS>): void {
  let pExplosion: Pointer<EXPLOSIONTYPE>;
  let uiFlags: UINT32;
  let ubOwner: UINT8;
  let ubTypeID: UINT8;
  let sX: INT16;
  let sY: INT16;
  let sZ: INT16;
  let sGridNo: INT16;
  let usItem: UINT16;
  let iIndex: INT32;
  let bLevel: INT8;

  // Assign param values
  uiFlags = pExpParams.value.uiFlags;
  ubOwner = pExpParams.value.ubOwner;
  ubTypeID = pExpParams.value.ubTypeID;
  sX = pExpParams.value.sX;
  sY = pExpParams.value.sY;
  sZ = pExpParams.value.sZ;
  sGridNo = pExpParams.value.sGridNo;
  usItem = pExpParams.value.usItem;
  bLevel = pExpParams.value.bLevel;

  {
    // GET AND SETUP EXPLOSION INFO IN TABLE....
    iIndex = GetFreeExplosion();

    if (iIndex == -1) {
      return;
    }

    // OK, get pointer...
    pExplosion = addressof(gExplosionData[iIndex]);

    memset(pExplosion, 0, sizeof(EXPLOSIONTYPE));

    // Setup some data...
    memcpy(addressof(pExplosion.value.Params), pExpParams, sizeof(EXPLOSION_PARAMS));
    pExplosion.value.fAllocated = true;
    pExplosion.value.iID = iIndex;

    GenerateExplosionFromExplosionPointer(pExplosion);
  }

  // ATE: Locate to explosion....
  if (pExpParams.value.fLocate) {
    LocateGridNo(sGridNo);
  }
}

function GenerateExplosionFromExplosionPointer(pExplosion: Pointer<EXPLOSIONTYPE>): void {
  let uiFlags: UINT32;
  let ubOwner: UINT8;
  let ubTypeID: UINT8;
  let sX: INT16;
  let sY: INT16;
  let sZ: INT16;
  let sGridNo: INT16;
  let usItem: UINT16;
  let ubTerrainType: UINT8;
  let bLevel: INT8;
  let uiSoundID: UINT32;

  let AniParams: ANITILE_PARAMS;

  // Assign param values
  uiFlags = pExplosion.value.Params.uiFlags;
  ubOwner = pExplosion.value.Params.ubOwner;
  ubTypeID = pExplosion.value.Params.ubTypeID;
  sX = pExplosion.value.Params.sX;
  sY = pExplosion.value.Params.sY;
  sZ = pExplosion.value.Params.sZ;
  sGridNo = pExplosion.value.Params.sGridNo;
  usItem = pExplosion.value.Params.usItem;
  bLevel = pExplosion.value.Params.bLevel;

  // If Z value given is 0 and bLevel > 0, make z heigher
  if (sZ == 0 && bLevel > 0) {
    sZ = ROOF_LEVEL_HEIGHT;
  }

  pExplosion.value.iLightID = -1;

  // OK, if we are over water.... use water explosion...
  ubTerrainType = GetTerrainType(sGridNo);

  // Setup explosion!
  memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));

  AniParams.sGridNo = sGridNo;
  AniParams.ubLevelID = ANI_TOPMOST_LEVEL;
  AniParams.sDelay = sBlastSpeeds[ubTypeID];
  AniParams.sStartFrame = pExplosion.value.sCurrentFrame;
  AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_EXPLOSION;

  if (ubTerrainType == Enum315.LOW_WATER || ubTerrainType == Enum315.MED_WATER || ubTerrainType == Enum315.DEEP_WATER) {
    // Change type to water explosion...
    ubTypeID = Enum304.WATER_BLAST;
    AniParams.uiFlags |= ANITILE_ALWAYS_TRANSLUCENT;
  }

  if (sZ < WALL_HEIGHT) {
    AniParams.uiFlags |= ANITILE_NOZBLITTER;
  }

  if (uiFlags & EXPLOSION_FLAG_USEABSPOS) {
    AniParams.sX = sX;
    AniParams.sY = sY;
    AniParams.sZ = sZ;

    // AniParams.uiFlags							|= ANITILE_USEABSOLUTEPOS;
  }

  AniParams.ubKeyFrame1 = ubTransKeyFrame[ubTypeID];
  AniParams.uiKeyFrame1Code = Enum311.ANI_KEYFRAME_BEGIN_TRANSLUCENCY;

  if (!(uiFlags & EXPLOSION_FLAG_DISPLAYONLY)) {
    AniParams.ubKeyFrame2 = ubDamageKeyFrame[ubTypeID];
    AniParams.uiKeyFrame2Code = Enum311.ANI_KEYFRAME_BEGIN_DAMAGE;
  }
  AniParams.uiUserData = usItem;
  AniParams.ubUserData2 = ubOwner;
  AniParams.uiUserData3 = pExplosion.value.iID;

  strcpy(AniParams.zCachedFile, zBlastFilenames[ubTypeID]);

  CreateAnimationTile(addressof(AniParams));

  //  set light source....
  if (pExplosion.value.iLightID == -1) {
    // DO ONLY IF WE'RE AT A GOOD LEVEL
    if (ubAmbientLightLevel >= MIN_AMB_LEVEL_FOR_MERC_LIGHTS) {
      if ((pExplosion.value.iLightID = LightSpriteCreate("L-R04.LHT", 0)) != (-1)) {
        LightSpritePower(pExplosion.value.iLightID, true);

        LightSpritePosition(pExplosion.value.iLightID, (sX / CELL_X_SIZE), (sY / CELL_Y_SIZE));
      }
    }
  }

  uiSoundID = uiExplosionSoundID[ubTypeID];

  if (uiSoundID == Enum330.EXPLOSION_1) {
    // Randomize
    if (Random(2) == 0) {
      uiSoundID = Enum330.EXPLOSION_ALT_BLAST_1;
    }
  }

  PlayJA2Sample(uiSoundID, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
}

export function UpdateExplosionFrame(iIndex: INT32, sCurrentFrame: INT16): void {
  gExplosionData[iIndex].sCurrentFrame = sCurrentFrame;
}

export function RemoveExplosionData(iIndex: INT32): void {
  gExplosionData[iIndex].fAllocated = false;

  if (gExplosionData[iIndex].iLightID != -1) {
    LightSpriteDestroy(gExplosionData[iIndex].iLightID);
  }
}

function HandleFencePartnerCheck(sStructGridNo: INT16): void {
  let pFenceStructure: Pointer<STRUCTURE>;
  let pFenceBaseStructure: Pointer<STRUCTURE>;
  let pFenceNode: Pointer<LEVELNODE>;
  let bFenceDestructionPartner: INT8 = -1;
  let uiFenceType: UINT32;
  let usTileIndex: UINT16;

  pFenceStructure = FindStructure(sStructGridNo, STRUCTURE_FENCE);

  if (pFenceStructure) {
    // How does our explosion partner look?
    if (pFenceStructure.value.pDBStructureRef.value.pDBStructure.value.bDestructionPartner < 0) {
      // Find level node.....
      pFenceBaseStructure = FindBaseStructure(pFenceStructure);

      // Get LEVELNODE for struct and remove!
      pFenceNode = FindLevelNodeBasedOnStructure(pFenceBaseStructure.value.sGridNo, pFenceBaseStructure);

      // Get type from index...
      GetTileType(pFenceNode.value.usIndex, addressof(uiFenceType));

      bFenceDestructionPartner = -1 * (pFenceBaseStructure.value.pDBStructureRef.value.pDBStructure.value.bDestructionPartner);

      // Get new index
      GetTileIndexFromTypeSubIndex(uiFenceType, (bFenceDestructionPartner), addressof(usTileIndex));

      // Set a flag indicating that the following changes are to go the the maps, temp file
      ApplyMapChangesToMapTempFile(true);

      // Remove it!
      RemoveStructFromLevelNode(pFenceBaseStructure.value.sGridNo, pFenceNode);

      // Add it!
      AddStructToHead(pFenceBaseStructure.value.sGridNo, (usTileIndex));

      ApplyMapChangesToMapTempFile(false);
    }
  }
}

function ExplosiveDamageStructureAtGridNo(pCurrent: Pointer<STRUCTURE>, ppNextCurrent: Pointer<Pointer<STRUCTURE>>, sGridNo: INT16, sWoundAmt: INT16, uiDist: UINT32, pfRecompileMovementCosts: Pointer<boolean>, fOnlyWalls: boolean, fSubSequentMultiTilesTransitionDamage: boolean, ubOwner: UINT8, bLevel: INT8): boolean {
  let sX: INT16;
  let sY: INT16;
  let pBase: Pointer<STRUCTURE>;
  let pWallStruct: Pointer<STRUCTURE>;
  let pAttached: Pointer<STRUCTURE>;
  let pAttachedBase: Pointer<STRUCTURE>;
  let pNode: Pointer<LEVELNODE> = null;
  let pNewNode: Pointer<LEVELNODE> = null;
  let pAttachedNode: Pointer<LEVELNODE>;
  let sNewGridNo: INT16;
  let sStructGridNo: INT16;
  let sNewIndex: INT16;
  let sSubIndex: INT16;
  let usObjectIndex: UINT16;
  let usTileIndex: UINT16;
  let ubNumberOfTiles: UINT8;
  let ubLoop: UINT8;
  let ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let bDestructionPartner: INT8 = -1;
  let bDamageReturnVal: INT8;
  let fContinue: boolean;
  let uiTileType: UINT32;
  let sBaseGridNo: INT16;
  let fExplosive: boolean;

  // ATE: Check for O3 statue for special damage..
  // note we do this check every time explosion goes off in game, but it's
  // an effiecnent check...
  if (DoesO3SectorStatueExistHere(sGridNo) && uiDist <= 1) {
    ChangeO3SectorStatue(true);
    return true;
  }

  // Get xy
  sX = CenterX(sGridNo);
  sY = CenterY(sGridNo);

  // ATE: Continue if we are only looking for walls
  if (fOnlyWalls && !(pCurrent.value.fFlags & STRUCTURE_WALLSTUFF)) {
    return true;
  }

  if (bLevel > 0) {
    return true;
  }

  // Is this a corpse?
  if ((pCurrent.value.fFlags & STRUCTURE_CORPSE) && gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE] && sWoundAmt > 10) {
    // Spray corpse in a fine mist....
    if (uiDist <= 1) {
      // Remove corpse...
      VaporizeCorpse(sGridNo, pCurrent.value.usStructureID);
    }
  } else if (!(pCurrent.value.fFlags & STRUCTURE_PERSON)) {
    // Damage structure!
    if ((bDamageReturnVal = DamageStructure(pCurrent, sWoundAmt, STRUCTURE_DAMAGE_EXPLOSION, sGridNo, sX, sY, NOBODY)) != 0) {
      fContinue = false;

      pBase = FindBaseStructure(pCurrent);

      sBaseGridNo = pBase.value.sGridNo;

      // if the structure is openable, destroy all items there
      if (pBase.value.fFlags & STRUCTURE_OPENABLE && !(pBase.value.fFlags & STRUCTURE_DOOR)) {
        RemoveAllUnburiedItems(pBase.value.sGridNo, bLevel);
      }

      fExplosive = ((pCurrent.value.fFlags & STRUCTURE_EXPLOSIVE) != 0);

      // Get LEVELNODE for struct and remove!
      pNode = FindLevelNodeBasedOnStructure(pBase.value.sGridNo, pBase);

      // ATE: if we have completely destroyed a structure,
      // and this structure should have a in-between explosion partner,
      // make damage code 2 - which means only damaged - the normal explosion
      // spreading will cause it do use the proper peices..
      if (bDamageReturnVal == 1 && pBase.value.pDBStructureRef.value.pDBStructure.value.bDestructionPartner < 0) {
        bDamageReturnVal = 2;
      }

      if (bDamageReturnVal == 1) {
        fContinue = true;
      }
      // Check for a damaged looking graphic...
      else if (bDamageReturnVal == 2) {
        if (pBase.value.pDBStructureRef.value.pDBStructure.value.bDestructionPartner < 0) {
          // We swap to another graphic!
          // It's -ve and 1-based, change to +ve, 1 based
          bDestructionPartner = (-1 * pBase.value.pDBStructureRef.value.pDBStructure.value.bDestructionPartner);

          GetTileType(pNode.value.usIndex, addressof(uiTileType));

          fContinue = 2;
        }
      }

      if (fContinue) {
        // Remove the beast!
        while ((ppNextCurrent.value) != null && (ppNextCurrent.value).value.usStructureID == pCurrent.value.usStructureID) {
          // the next structure will also be deleted so we had better
          // skip past it!
          (ppNextCurrent.value) = (ppNextCurrent.value).value.pNext;
        }

        // Replace with explosion debris if there are any....
        // ( and there already sin;t explosion debris there.... )
        if (pBase.value.pDBStructureRef.value.pDBStructure.value.bDestructionPartner > 0) {
          // Alrighty add!

          // Add to every gridno structure is in
          ubNumberOfTiles = pBase.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles;
          ppTile = pBase.value.pDBStructureRef.value.ppTile;

          bDestructionPartner = pBase.value.pDBStructureRef.value.pDBStructure.value.bDestructionPartner;

          // OK, destrcution index is , as default, the partner, until we go over the first set of explsion
          // debris...
          if (bDestructionPartner > 39) {
            GetTileIndexFromTypeSubIndex(Enum313.SECONDEXPLDEBRIS, (bDestructionPartner - 40), addressof(usTileIndex));
          } else {
            GetTileIndexFromTypeSubIndex(Enum313.FIRSTEXPLDEBRIS, bDestructionPartner, addressof(usTileIndex));
          }

          // Free all the non-base tiles; the base tile is at pointer 0
          for (ubLoop = BASE_TILE; ubLoop < ubNumberOfTiles; ubLoop++) {
            if (!(ppTile[ubLoop].value.fFlags & TILE_ON_ROOF)) {
              sStructGridNo = pBase.value.sGridNo + ppTile[ubLoop].value.sPosRelToBase;
              // there might be two structures in this tile, one on each level, but we just want to
              // delete one on each pass

              if (!TypeRangeExistsInObjectLayer(sStructGridNo, Enum313.FIRSTEXPLDEBRIS, Enum313.SECONDEXPLDEBRIS, addressof(usObjectIndex))) {
                // Set a flag indicating that the following changes are to go the the maps, temp file
                ApplyMapChangesToMapTempFile(true);

                AddObjectToHead(sStructGridNo, (usTileIndex + Random(3)));

                ApplyMapChangesToMapTempFile(false);
              }
            }
          }

          // IF we are a wall, add debris for the other side
          if (pCurrent.value.fFlags & STRUCTURE_WALLSTUFF) {
            switch (pCurrent.value.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:

                sStructGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.SOUTH));
                if (!TypeRangeExistsInObjectLayer(sStructGridNo, Enum313.FIRSTEXPLDEBRIS, Enum313.SECONDEXPLDEBRIS, addressof(usObjectIndex))) {
                  // Set a flag indicating that the following changes are to go the the maps, temp file
                  ApplyMapChangesToMapTempFile(true);

                  AddObjectToHead(sStructGridNo, (usTileIndex + Random(3)));

                  ApplyMapChangesToMapTempFile(false);
                }
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:

                sStructGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.EAST));
                if (!TypeRangeExistsInObjectLayer(sStructGridNo, Enum313.FIRSTEXPLDEBRIS, Enum313.SECONDEXPLDEBRIS, addressof(usObjectIndex))) {
                  // Set a flag indicating that the following changes are to go the the maps, temp file
                  ApplyMapChangesToMapTempFile(true);

                  AddObjectToHead(sStructGridNo, (usTileIndex + Random(3)));

                  ApplyMapChangesToMapTempFile(false);
                }
                break;
            }
          }
        }
        // Else look for fences, walk along them to change to destroyed peices...
        else if (pCurrent.value.fFlags & STRUCTURE_FENCE) {
          // walk along based on orientation
          switch (pCurrent.value.ubWallOrientation) {
            case Enum314.OUTSIDE_TOP_RIGHT:
            case Enum314.INSIDE_TOP_RIGHT:

              sStructGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.SOUTH));
              HandleFencePartnerCheck(sStructGridNo);
              sStructGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.NORTH));
              HandleFencePartnerCheck(sStructGridNo);
              break;

            case Enum314.OUTSIDE_TOP_LEFT:
            case Enum314.INSIDE_TOP_LEFT:

              sStructGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.EAST));
              HandleFencePartnerCheck(sStructGridNo);
              sStructGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.WEST));
              HandleFencePartnerCheck(sStructGridNo);
              break;
          }
        }

        // OK, Check if this is a wall, then search and change other walls based on this
        if (pCurrent.value.fFlags & STRUCTURE_WALLSTUFF) {
          // ATE
          // Remove any decals in tile....
          // Use tile database for this as apposed to stuct data
          RemoveAllStructsOfTypeRange(pBase.value.sGridNo, Enum313.FIRSTWALLDECAL, Enum313.FOURTHWALLDECAL);
          RemoveAllStructsOfTypeRange(pBase.value.sGridNo, Enum313.FIFTHWALLDECAL, Enum313.EIGTHWALLDECAL);

          // Alrighty, now do this
          // Get orientation
          // based on orientation, go either x or y dir
          // check for wall in both _ve and -ve directions
          // if found, replace!
          switch (pCurrent.value.ubWallOrientation) {
            case Enum314.OUTSIDE_TOP_LEFT:
            case Enum314.INSIDE_TOP_LEFT:

              // Move WEST
              sNewGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.WEST));

              pNewNode = GetWallLevelNodeAndStructOfSameOrientationAtGridno(sNewGridNo, pCurrent.value.ubWallOrientation, addressof(pWallStruct));

              if (pNewNode != null) {
                if (pWallStruct.value.fFlags & STRUCTURE_WALL) {
                  if (pCurrent.value.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT) {
                    sSubIndex = 48;
                  } else {
                    sSubIndex = 52;
                  }

                  // Replace!
                  GetTileIndexFromTypeSubIndex(gTileDatabase[pNewNode.value.usIndex].fType, sSubIndex, addressof(sNewIndex));

                  // Set a flag indicating that the following changes are to go the the maps temp file
                  ApplyMapChangesToMapTempFile(true);

                  RemoveStructFromLevelNode(sNewGridNo, pNewNode);
                  AddWallToStructLayer(sNewGridNo, sNewIndex, true);

                  ApplyMapChangesToMapTempFile(false);
                }
              }

              // Move in EAST
              sNewGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.EAST));

              pNewNode = GetWallLevelNodeAndStructOfSameOrientationAtGridno(sNewGridNo, pCurrent.value.ubWallOrientation, addressof(pWallStruct));

              if (pNewNode != null) {
                if (pWallStruct.value.fFlags & STRUCTURE_WALL) {
                  if (pCurrent.value.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT) {
                    sSubIndex = 49;
                  } else {
                    sSubIndex = 53;
                  }

                  // Replace!
                  GetTileIndexFromTypeSubIndex(gTileDatabase[pNewNode.value.usIndex].fType, sSubIndex, addressof(sNewIndex));

                  // Set a flag indicating that the following changes are to go the the maps, temp file
                  ApplyMapChangesToMapTempFile(true);

                  RemoveStructFromLevelNode(sNewGridNo, pNewNode);
                  AddWallToStructLayer(sNewGridNo, sNewIndex, true);

                  ApplyMapChangesToMapTempFile(false);
                }
              }

              // look for attached structures in same tile
              sNewGridNo = pBase.value.sGridNo;
              pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_LEFT_WALL);
              while (pAttached) {
                pAttachedBase = FindBaseStructure(pAttached);
                if (pAttachedBase) {
                  // Remove the beast!
                  while ((ppNextCurrent.value) != null && (ppNextCurrent.value).value.usStructureID == pAttachedBase.value.usStructureID) {
                    // the next structure will also be deleted so we had better
                    // skip past it!
                    (ppNextCurrent.value) = (ppNextCurrent.value).value.pNext;
                  }

                  pAttachedNode = FindLevelNodeBasedOnStructure(pAttachedBase.value.sGridNo, pAttachedBase);
                  if (pAttachedNode) {
                    ApplyMapChangesToMapTempFile(true);
                    RemoveStructFromLevelNode(pAttachedBase.value.sGridNo, pAttachedNode);
                    ApplyMapChangesToMapTempFile(false);
                  } else {
// error!
                    break;
                  }
                } else {
// error!
                  break;
                }
                // search for another, from the start of the list
                pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_LEFT_WALL);
              }

              // Move in SOUTH, looking for attached structures to remove
              sNewGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.SOUTH));
              pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_LEFT_WALL);
              while (pAttached) {
                pAttachedBase = FindBaseStructure(pAttached);
                if (pAttachedBase) {
                  pAttachedNode = FindLevelNodeBasedOnStructure(pAttachedBase.value.sGridNo, pAttachedBase);
                  if (pAttachedNode) {
                    ApplyMapChangesToMapTempFile(true);
                    RemoveStructFromLevelNode(pAttachedBase.value.sGridNo, pAttachedNode);
                    ApplyMapChangesToMapTempFile(false);
                  } else {
// error!
                    break;
                  }
                } else {
// error!
                  break;
                }
                // search for another, from the start of the list
                pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_LEFT_WALL);
              }
              break;

            case Enum314.OUTSIDE_TOP_RIGHT:
            case Enum314.INSIDE_TOP_RIGHT:

              // Move in NORTH
              sNewGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.NORTH));

              pNewNode = GetWallLevelNodeAndStructOfSameOrientationAtGridno(sNewGridNo, pCurrent.value.ubWallOrientation, addressof(pWallStruct));

              if (pNewNode != null) {
                if (pWallStruct.value.fFlags & STRUCTURE_WALL) {
                  if (pCurrent.value.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
                    sSubIndex = 51;
                  } else {
                    sSubIndex = 55;
                  }

                  // Replace!
                  GetTileIndexFromTypeSubIndex(gTileDatabase[pNewNode.value.usIndex].fType, sSubIndex, addressof(sNewIndex));

                  // Set a flag indicating that the following changes are to go the the maps, temp file
                  ApplyMapChangesToMapTempFile(true);

                  RemoveStructFromLevelNode(sNewGridNo, pNewNode);
                  AddWallToStructLayer(sNewGridNo, sNewIndex, true);

                  ApplyMapChangesToMapTempFile(false);
                }
              }

              // Move in SOUTH
              sNewGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.SOUTH));

              pNewNode = GetWallLevelNodeAndStructOfSameOrientationAtGridno(sNewGridNo, pCurrent.value.ubWallOrientation, addressof(pWallStruct));

              if (pNewNode != null) {
                if (pWallStruct.value.fFlags & STRUCTURE_WALL) {
                  if (pCurrent.value.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
                    sSubIndex = 50;
                  } else {
                    sSubIndex = 54;
                  }

                  // Replace!
                  GetTileIndexFromTypeSubIndex(gTileDatabase[pNewNode.value.usIndex].fType, sSubIndex, addressof(sNewIndex));

                  // Set a flag indicating that the following changes are to go the the maps, temp file
                  ApplyMapChangesToMapTempFile(true);

                  RemoveStructFromLevelNode(sNewGridNo, pNewNode);
                  AddWallToStructLayer(sNewGridNo, sNewIndex, true);

                  ApplyMapChangesToMapTempFile(false);
                }
              }

              // looking for attached structures to remove in base tile
              sNewGridNo = pBase.value.sGridNo;
              pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_RIGHT_WALL);
              while (pAttached) {
                pAttachedBase = FindBaseStructure(pAttached);
                if (pAttachedBase) {
                  pAttachedNode = FindLevelNodeBasedOnStructure(pAttachedBase.value.sGridNo, pAttachedBase);
                  if (pAttachedNode) {
                    ApplyMapChangesToMapTempFile(true);
                    RemoveStructFromLevelNode(pAttachedBase.value.sGridNo, pAttachedNode);
                    ApplyMapChangesToMapTempFile(false);
                  } else {
// error!
                    break;
                  }
                } else {
// error!
                  break;
                }
                // search for another, from the start of the list
                pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_RIGHT_WALL);
              }

              // Move in EAST, looking for attached structures to remove
              sNewGridNo = NewGridNo(pBase.value.sGridNo, DirectionInc(Enum245.EAST));
              pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_RIGHT_WALL);
              while (pAttached) {
                pAttachedBase = FindBaseStructure(pAttached);
                if (pAttachedBase) {
                  pAttachedNode = FindLevelNodeBasedOnStructure(pAttachedBase.value.sGridNo, pAttachedBase);
                  if (pAttachedNode) {
                    ApplyMapChangesToMapTempFile(true);
                    RemoveStructFromLevelNode(pAttachedBase.value.sGridNo, pAttachedNode);
                    ApplyMapChangesToMapTempFile(false);
                  } else {
// error!
                    break;
                  }
                } else {
// error!
                  break;
                }
                // search for another, from the start of the list
                pAttached = FindStructure(sNewGridNo, STRUCTURE_ON_RIGHT_WALL);
              }

              break;
          }

          // CJC, Sept 16: if we destroy any wall of the brothel, make Kingpin's men hostile!
          if (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0) {
            let ubRoom: UINT8;
            let fInRoom: boolean;

            fInRoom = InARoom(sGridNo, addressof(ubRoom));
            if (!fInRoom) {
              // try to south
              fInRoom = InARoom((sGridNo + DirectionInc(Enum245.SOUTH)), addressof(ubRoom));
              if (!fInRoom) {
                // try to east
                fInRoom = InARoom((sGridNo + DirectionInc(Enum245.EAST)), addressof(ubRoom));
              }
            }

            if (fInRoom && IN_BROTHEL(ubRoom)) {
              CivilianGroupChangesSides(Enum246.KINGPIN_CIV_GROUP);
            }
          }
        }

        // OK, we need to remove the water from the fountain
        // Lots of HARD CODING HERE :(
        // Get tile type
        GetTileType(pNode.value.usIndex, addressof(uiTileType));
        // Check if we are a fountain!
        if (stricmp(gTilesets[giCurrentTilesetID].TileSurfaceFilenames[uiTileType], "fount1.sti") == 0) {
          // Yes we are!
          // Remove water....
          ApplyMapChangesToMapTempFile(true);
          GetTileIndexFromTypeSubIndex(uiTileType, 1, addressof(sNewIndex));
          RemoveStruct(sBaseGridNo, sNewIndex);
          RemoveStruct(sBaseGridNo, sNewIndex);
          GetTileIndexFromTypeSubIndex(uiTileType, 2, addressof(sNewIndex));
          RemoveStruct(sBaseGridNo, sNewIndex);
          RemoveStruct(sBaseGridNo, sNewIndex);
          GetTileIndexFromTypeSubIndex(uiTileType, 3, addressof(sNewIndex));
          RemoveStruct(sBaseGridNo, sNewIndex);
          RemoveStruct(sBaseGridNo, sNewIndex);
          ApplyMapChangesToMapTempFile(false);
        }

        // Remove any interactive tiles we could be over!
        BeginCurInteractiveTileCheck(INTILE_CHECK_SELECTIVE);

        if (pCurrent.value.fFlags & STRUCTURE_WALLSTUFF) {
          RecompileLocalMovementCostsForWall(pBase.value.sGridNo, pBase.value.ubWallOrientation);
        }

        // Remove!
        // Set a flag indicating that the following changes are to go the the maps, temp file
        ApplyMapChangesToMapTempFile(true);
        RemoveStructFromLevelNode(pBase.value.sGridNo, pNode);
        ApplyMapChangesToMapTempFile(false);

        // OK, if we are to swap structures, do it now...
        if (fContinue == 2) {
          // We have a levelnode...
          // Get new index for new grpahic....
          GetTileIndexFromTypeSubIndex(uiTileType, bDestructionPartner, addressof(usTileIndex));

          ApplyMapChangesToMapTempFile(true);

          AddStructToHead(sBaseGridNo, usTileIndex);

          ApplyMapChangesToMapTempFile(false);
        }

        // Rerender world!
        // Reevaluate world movement costs, reduncency!
        gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
        // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
        InvalidateWorldRedundency();
        SetRenderFlags(RENDER_FLAG_FULL);
        // Movement costs!
        (pfRecompileMovementCosts.value) = true;

        {
          // Make secondary explosion if eplosive....
          if (fExplosive) {
            InternalIgniteExplosion(ubOwner, CenterX(sBaseGridNo), CenterY(sBaseGridNo), 0, sBaseGridNo, Enum225.STRUCTURE_EXPLOSION, false, bLevel);
          }
        }

        if (fContinue == 2) {
          return false;
        }
      }

      // 2 is NO DAMAGE
      return 2;
    }
  }

  return 1;
}

let gStruct: Pointer<STRUCTURE>;

function ExplosiveDamageGridNo(sGridNo: INT16, sWoundAmt: INT16, uiDist: UINT32, pfRecompileMovementCosts: Pointer<boolean>, fOnlyWalls: boolean, bMultiStructSpecialFlag: INT8, fSubSequentMultiTilesTransitionDamage: boolean, ubOwner: UINT8, bLevel: INT8): void {
  let pCurrent: Pointer<STRUCTURE>;
  let pNextCurrent: Pointer<STRUCTURE>;
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let sDesiredLevel: INT16;
  let ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let sNewGridNo: INT16;
  let sNewGridNo2: INT16;
  let sBaseGridNo: INT16;
  let fToBreak: boolean = false;
  let fMultiStructure: boolean = false;
  let ubNumberOfTiles: UINT8;
  let fMultiStructSpecialFlag: boolean = false;
  let fExplodeDamageReturn: boolean = false;

  // Based on distance away, damage any struct at this gridno
  // OK, loop through structures and damage!
  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  sDesiredLevel = STRUCTURE_ON_GROUND;

  // This code gets a little hairy because
  // (1) we might need to destroy the currently-examined structure
  while (pCurrent != null) {
    // ATE: These are for the chacks below for multi-structs....
    pBaseStructure = FindBaseStructure(pCurrent);

    if (pBaseStructure) {
      sBaseGridNo = pBaseStructure.value.sGridNo;
      ubNumberOfTiles = pBaseStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles;
      fMultiStructure = ((pBaseStructure.value.fFlags & STRUCTURE_MULTI) != 0);
      ppTile = MemAlloc(sizeof(DB_STRUCTURE_TILE) * ubNumberOfTiles);
      memcpy(ppTile, pBaseStructure.value.pDBStructureRef.value.ppTile, sizeof(DB_STRUCTURE_TILE) * ubNumberOfTiles);

      if (bMultiStructSpecialFlag == -1) {
        // Set it!
        bMultiStructSpecialFlag = ((pBaseStructure.value.fFlags & STRUCTURE_SPECIAL) != 0);
      }

      if (pBaseStructure.value.fFlags & STRUCTURE_EXPLOSIVE) {
        // ATE: Set hit points to zero....
        pBaseStructure.value.ubHitPoints = 0;
      }
    } else {
      fMultiStructure = false;
    }

    pNextCurrent = pCurrent.value.pNext;
    gStruct = pNextCurrent;

    // Check level!
    if (pCurrent.value.sCubeOffset == sDesiredLevel) {
      fExplodeDamageReturn = ExplosiveDamageStructureAtGridNo(pCurrent, addressof(pNextCurrent), sGridNo, sWoundAmt, uiDist, pfRecompileMovementCosts, fOnlyWalls, 0, ubOwner, bLevel);

      // Are we overwritting damage due to multi-tile...?
      if (fExplodeDamageReturn) {
        if (fSubSequentMultiTilesTransitionDamage == 2) {
          fExplodeDamageReturn = 2;
        } else {
          fExplodeDamageReturn = 1;
        }
      }

      if (!fExplodeDamageReturn) {
        fToBreak = true;
      }
    }

    // OK, for multi-structs...
    // AND we took damage...
    if (fMultiStructure && !fOnlyWalls && fExplodeDamageReturn == 0) {
      // ATE: Don't after first attack...
      if (uiDist > 1) {
        if (pBaseStructure) {
          MemFree(ppTile);
        }
        return;
      }

      {
        for (ubLoop = BASE_TILE; ubLoop < ubNumberOfTiles; ubLoop++) {
          sNewGridNo = sBaseGridNo + ppTile[ubLoop].value.sPosRelToBase;

          // look in adjacent tiles
          for (ubLoop2 = 0; ubLoop2 < Enum245.NUM_WORLD_DIRECTIONS; ubLoop2++) {
            sNewGridNo2 = NewGridNo(sNewGridNo, DirectionInc(ubLoop2));
            if (sNewGridNo2 != sNewGridNo && sNewGridNo2 != sGridNo) {
              pStructure = FindStructure(sNewGridNo2, STRUCTURE_MULTI);
              if (pStructure) {
                fMultiStructSpecialFlag = ((pStructure.value.fFlags & STRUCTURE_SPECIAL) != 0);

                if ((bMultiStructSpecialFlag == fMultiStructSpecialFlag)) {
                  // If we just damaged it, use same damage value....
                  if (fMultiStructSpecialFlag) {
                    ExplosiveDamageGridNo(sNewGridNo2, sWoundAmt, uiDist, pfRecompileMovementCosts, fOnlyWalls, bMultiStructSpecialFlag, 1, ubOwner, bLevel);
                  } else {
                    ExplosiveDamageGridNo(sNewGridNo2, sWoundAmt, uiDist, pfRecompileMovementCosts, fOnlyWalls, bMultiStructSpecialFlag, 2, ubOwner, bLevel);
                  }

                  { InternalIgniteExplosion(ubOwner, CenterX(sNewGridNo2), CenterY(sNewGridNo2), 0, sNewGridNo2, Enum225.RDX, false, bLevel); }

                  fToBreak = true;
                }
              }
            }
          }
        }
      }
      if (fToBreak) {
        break;
      }
    }

    if (pBaseStructure) {
      MemFree(ppTile);
    }

    pCurrent = pNextCurrent;
  }
}

function DamageSoldierFromBlast(ubPerson: UINT8, ubOwner: UINT8, sBombGridNo: INT16, sWoundAmt: INT16, sBreathAmt: INT16, uiDist: UINT32, usItem: UINT16, sSubsequent: INT16): boolean {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sNewWoundAmt: INT16 = 0;
  let ubDirection: UINT8;

  pSoldier = MercPtrs[ubPerson]; // someone is here, and they're gonna get hurt

  if (!pSoldier.value.bActive || !pSoldier.value.bInSector || !pSoldier.value.bLife)
    return false;

  if (pSoldier.value.ubMiscSoldierFlags & SOLDIER_MISC_HURT_BY_EXPLOSION) {
    // don't want to damage the guy twice
    return false;
  }

  // Direction to center of explosion
  ubDirection = GetDirectionFromGridNo(sBombGridNo, pSoldier);

  // Increment attack counter...
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Incrementing Attack: Explosion dishing out damage, Count now %d", gTacticalStatus.ubAttackBusyCount));

  sNewWoundAmt = sWoundAmt - Math.min(sWoundAmt, 35) * ArmourVersusExplosivesPercent(pSoldier) / 100;
  if (sNewWoundAmt < 0) {
    sNewWoundAmt = 0;
  }
  EVENT_SoldierGotHit(pSoldier, usItem, sNewWoundAmt, sBreathAmt, ubDirection, uiDist, ubOwner, 0, ANIM_CROUCH, sSubsequent, sBombGridNo);

  pSoldier.value.ubMiscSoldierFlags |= SOLDIER_MISC_HURT_BY_EXPLOSION;

  if (ubOwner != NOBODY && MercPtrs[ubOwner].value.bTeam == gbPlayerNum && pSoldier.value.bTeam != gbPlayerNum) {
    ProcessImplicationsOfPCAttack(MercPtrs[ubOwner], addressof(pSoldier), REASON_EXPLOSION);
  }

  return true;
}

export function DishOutGasDamage(pSoldier: Pointer<SOLDIERTYPE>, pExplosive: Pointer<EXPLOSIVETYPE>, sSubsequent: INT16, fRecompileMovementCosts: boolean, sWoundAmt: INT16, sBreathAmt: INT16, ubOwner: UINT8): boolean {
  let bPosOfMask: INT8 = NO_SLOT;

  if (!pSoldier.value.bActive || !pSoldier.value.bInSector || !pSoldier.value.bLife || AM_A_ROBOT(pSoldier)) {
    return fRecompileMovementCosts;
  }

  if (pExplosive.value.ubType == Enum287.EXPLOSV_CREATUREGAS) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
      // unaffected by own gas effects
      return fRecompileMovementCosts;
    }
    if (sSubsequent && pSoldier.value.fHitByGasFlags & Enum264.HIT_BY_CREATUREGAS) {
      // already affected by creature gas this turn
      return fRecompileMovementCosts;
    }
  } else // no gas mask help from creature attacks
         // ATE/CJC: gas stuff
  {
    if (pExplosive.value.ubType == Enum287.EXPLOSV_TEARGAS) {
      if (AM_A_ROBOT(pSoldier)) {
        return fRecompileMovementCosts;
      }

      // ignore whether subsequent or not if hit this turn
      if (pSoldier.value.fHitByGasFlags & Enum264.HIT_BY_TEARGAS) {
        // already affected by creature gas this turn
        return fRecompileMovementCosts;
      }
    } else if (pExplosive.value.ubType == Enum287.EXPLOSV_MUSTGAS) {
      if (AM_A_ROBOT(pSoldier)) {
        return fRecompileMovementCosts;
      }

      if (sSubsequent && pSoldier.value.fHitByGasFlags & Enum264.HIT_BY_MUSTARDGAS) {
        // already affected by creature gas this turn
        return fRecompileMovementCosts;
      }
    }

    if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD1POS].bStatus[0] >= USABLE) {
      bPosOfMask = Enum261.HEAD1POS;
    } else if (pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD2POS].bStatus[0] >= USABLE) {
      bPosOfMask = Enum261.HEAD2POS;
    }

    if (bPosOfMask != NO_SLOT) {
      if (pSoldier.value.inv[bPosOfMask].bStatus[0] < GASMASK_MIN_STATUS) {
        // GAS MASK reduces breath loss by its work% (it leaks if not at least 70%)
        sBreathAmt = (sBreathAmt * (100 - pSoldier.value.inv[bPosOfMask].bStatus[0])) / 100;
        if (sBreathAmt > 500) {
          // if at least 500 of breath damage got through
          // the soldier within the blast radius is gassed for at least one
          // turn, possibly more if it's tear gas (which hangs around a while)
          pSoldier.value.uiStatusFlags |= SOLDIER_GASSED;
        }

        if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
          if (sWoundAmt > 1) {
            pSoldier.value.inv[bPosOfMask].bStatus[0] -= Random(4);
            sWoundAmt = (sWoundAmt * (100 - pSoldier.value.inv[bPosOfMask].bStatus[0])) / 100;
          } else if (sWoundAmt == 1) {
            pSoldier.value.inv[bPosOfMask].bStatus[0] -= Random(2);
          }
        }
      } else {
        sBreathAmt = 0;
        if (sWoundAmt > 0) {
          if (sWoundAmt == 1) {
            pSoldier.value.inv[bPosOfMask].bStatus[0] -= Random(2);
          } else {
            // use up gas mask
            pSoldier.value.inv[bPosOfMask].bStatus[0] -= Random(4);
          }
        }
        sWoundAmt = 0;
      }
    }
  }

  if (sWoundAmt != 0 || sBreathAmt != 0) {
    switch (pExplosive.value.ubType) {
      case Enum287.EXPLOSV_CREATUREGAS:
        pSoldier.value.fHitByGasFlags |= Enum264.HIT_BY_CREATUREGAS;
        break;
      case Enum287.EXPLOSV_TEARGAS:
        pSoldier.value.fHitByGasFlags |= Enum264.HIT_BY_TEARGAS;
        break;
      case Enum287.EXPLOSV_MUSTGAS:
        pSoldier.value.fHitByGasFlags |= Enum264.HIT_BY_MUSTARDGAS;
        break;
      default:
        break;
    }
    // a gas effect, take damage directly...
    SoldierTakeDamage(pSoldier, ANIM_STAND, sWoundAmt, sBreathAmt, TAKE_DAMAGE_GAS, NOBODY, NOWHERE, 0, true);
    if (pSoldier.value.bLife >= CONSCIOUSNESS) {
      DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));
    }

    if (ubOwner != NOBODY && MercPtrs[ubOwner].value.bTeam == gbPlayerNum && pSoldier.value.bTeam != gbPlayerNum) {
      ProcessImplicationsOfPCAttack(MercPtrs[ubOwner], addressof(pSoldier), REASON_EXPLOSION);
    }
  }
  return fRecompileMovementCosts;
}

function ExpAffect(sBombGridNo: INT16, sGridNo: INT16, uiDist: UINT32, usItem: UINT16, ubOwner: UINT8, sSubsequent: INT16, pfMercHit: Pointer<boolean>, bLevel: INT8, iSmokeEffectID: INT32): boolean {
  let sWoundAmt: INT16 = 0;
  let sBreathAmt: INT16 = 0;
  let sNewWoundAmt: INT16 = 0;
  let sNewBreathAmt: INT16 = 0;
  let sStructDmgAmt: INT16;
  let ubPerson: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pExplosive: Pointer<EXPLOSIVETYPE>;
  let sX: INT16;
  let sY: INT16;
  let fRecompileMovementCosts: boolean = false;
  let fSmokeEffect: boolean = false;
  let fStunEffect: boolean = false;
  let bSmokeEffectType: INT8 = 0;
  let fBlastEffect: boolean = true;
  let sNewGridNo: INT16;
  let fBloodEffect: boolean = false;
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolNext: Pointer<ITEM_POOL>;
  let uiRoll: UINT32;

  // Init the variables
  sX = sY = -1;

  if (sSubsequent == BLOOD_SPREAD_EFFECT) {
    fSmokeEffect = false;
    fBlastEffect = false;
    fBloodEffect = true;
  } else {
    // Turn off blast effect if some types of items...
    switch (usItem) {
      case Enum225.MUSTARD_GRENADE:

        fSmokeEffect = true;
        bSmokeEffectType = Enum308.MUSTARDGAS_SMOKE_EFFECT;
        fBlastEffect = false;
        break;

      case Enum225.TEARGAS_GRENADE:
      case Enum225.GL_TEARGAS_GRENADE:
      case Enum225.BIG_TEAR_GAS:

        fSmokeEffect = true;
        bSmokeEffectType = Enum308.TEARGAS_SMOKE_EFFECT;
        fBlastEffect = false;
        break;

      case Enum225.SMOKE_GRENADE:
      case Enum225.GL_SMOKE_GRENADE:

        fSmokeEffect = true;
        bSmokeEffectType = Enum308.NORMAL_SMOKE_EFFECT;
        fBlastEffect = false;
        break;

      case Enum225.STUN_GRENADE:
      case Enum225.GL_STUN_GRENADE:
        fStunEffect = true;
        break;

      case Enum225.SMALL_CREATURE_GAS:
      case Enum225.LARGE_CREATURE_GAS:
      case Enum225.VERY_SMALL_CREATURE_GAS:

        fSmokeEffect = true;
        bSmokeEffectType = Enum308.CREATURE_SMOKE_EFFECT;
        fBlastEffect = false;
        break;
    }
  }

  // OK, here we:
  // Get explosive data from table
  pExplosive = addressof(Explosive[Item[usItem].ubClassIndex]);

  uiRoll = PreRandom(100);

  // Calculate wound amount
  sWoundAmt = pExplosive.value.ubDamage + ((pExplosive.value.ubDamage * uiRoll) / 100);

  // Calculate breath amount ( if stun damage applicable )
  sBreathAmt = (pExplosive.value.ubStunDamage * 100) + (((pExplosive.value.ubStunDamage / 2) * 100 * uiRoll) / 100);

  // ATE: Make sure guys get pissed at us!
  HandleBuldingDestruction(sGridNo, ubOwner);

  if (fBlastEffect) {
    // lower effects for distance away from center of explosion
    // If radius is 3, damage % is (100)/66/33/17
    // If radius is 5, damage % is (100)/80/60/40/20/10
    // If radius is 8, damage % is (100)/88/75/63/50/37/25/13/6

    if (pExplosive.value.ubRadius == 0) {
      // leave as is, has to be at range 0 here
    } else if (uiDist < pExplosive.value.ubRadius) {
      // if radius is 5, go down by 5ths ~ 20%
      sWoundAmt -= (sWoundAmt * uiDist / pExplosive.value.ubRadius);
      sBreathAmt -= (sBreathAmt * uiDist / pExplosive.value.ubRadius);
    } else {
      // at the edge of the explosion, do half the previous damage
      sWoundAmt = ((sWoundAmt / pExplosive.value.ubRadius) / 2);
      sBreathAmt = ((sBreathAmt / pExplosive.value.ubRadius) / 2);
    }

    if (sWoundAmt < 0)
      sWoundAmt = 0;

    if (sBreathAmt < 0)
      sBreathAmt = 0;

    // damage structures
    if (uiDist <= Math.max(1, (pExplosive.value.ubDamage / 30))) {
      if (Item[usItem].usItemClass & IC_GRENADE) {
        sStructDmgAmt = sWoundAmt / 3;
      } else // most explosives
      {
        sStructDmgAmt = sWoundAmt;
      }

      ExplosiveDamageGridNo(sGridNo, sStructDmgAmt, uiDist, addressof(fRecompileMovementCosts), false, -1, 0, ubOwner, bLevel);

      // ATE: Look for damage to walls ONLY for next two gridnos
      sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.NORTH));

      if (GridNoOnVisibleWorldTile(sNewGridNo)) {
        ExplosiveDamageGridNo(sNewGridNo, sStructDmgAmt, uiDist, addressof(fRecompileMovementCosts), true, -1, 0, ubOwner, bLevel);
      }

      // ATE: Look for damage to walls ONLY for next two gridnos
      sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.WEST));

      if (GridNoOnVisibleWorldTile(sNewGridNo)) {
        ExplosiveDamageGridNo(sNewGridNo, sStructDmgAmt, uiDist, addressof(fRecompileMovementCosts), true, -1, 0, ubOwner, bLevel);
      }
    }

    // Add burn marks to ground randomly....
    if (Random(50) < 15 && uiDist == 1) {
      // if ( !TypeRangeExistsInObjectLayer( sGridNo, FIRSTEXPLDEBRIS, SECONDEXPLDEBRIS, &usObjectIndex ) )
      //{
      //	GetTileIndexFromTypeSubIndex( SECONDEXPLDEBRIS, (UINT16)( Random( 10 ) + 1 ), &usTileIndex );
      //	AddObjectToHead( sGridNo, usTileIndex );

      //	SetRenderFlags(RENDER_FLAG_FULL);

      //}
    }

    // NB radius can be 0 so cannot divide it by 2 here
    if (!fStunEffect && (uiDist * 2 <= pExplosive.value.ubRadius)) {
      GetItemPool(sGridNo, addressof(pItemPool), bLevel);

      while (pItemPool) {
        pItemPoolNext = pItemPool.value.pNext;

        if (DamageItemOnGround(addressof(gWorldItems[pItemPool.value.iItemIndex].o), sGridNo, bLevel, (sWoundAmt * 2), ubOwner)) {
          // item was destroyed
          RemoveItemFromPool(sGridNo, pItemPool.value.iItemIndex, bLevel);
        }
        pItemPool = pItemPoolNext;
      }

      /*
      // Search for an explosive item in item pool
      while ( ( iWorldItem = GetItemOfClassTypeInPool( sGridNo, IC_EXPLOSV, bLevel ) ) != -1 )
      {
              // Get usItem
              usItem = gWorldItems[ iWorldItem ].o.usItem;

              DamageItem

              if ( CheckForChainReaction( usItem, gWorldItems[ iWorldItem ].o.bStatus[0], sWoundAmt, TRUE ) )
              {
                      RemoveItemFromPool( sGridNo, iWorldItem, bLevel );

                      // OK, Ignite this explosion!
                      IgniteExplosion( NOBODY, sX, sY, 0, sGridNo, usItem, bLevel );
              }
              else
              {
                      RemoveItemFromPool( sGridNo, iWorldItem, bLevel );
              }

      }

      // Remove any unburied items here!
      RemoveAllUnburiedItems( sGridNo, bLevel );
      */
    }
  } else if (fSmokeEffect) {
    // If tear gar, determine turns to spread.....
    if (sSubsequent == ERASE_SPREAD_EFFECT) {
      RemoveSmokeEffectFromTile(sGridNo, bLevel);
    } else if (sSubsequent != REDO_SPREAD_EFFECT) {
      AddSmokeEffectToTile(iSmokeEffectID, bSmokeEffectType, sGridNo, bLevel);
    }
  } else {
    // Drop blood ....
    // Get blood quantity....
    InternalDropBlood(sGridNo, 0, 0, (Math.max((MAXBLOODQUANTITY - (uiDist * 2)), 0)), 1);
  }

  if (sSubsequent != ERASE_SPREAD_EFFECT && sSubsequent != BLOOD_SPREAD_EFFECT) {
    // if an explosion effect....
    if (fBlastEffect) {
      // don't hurt anyone who is already dead & waiting to be removed
      if ((ubPerson = WhoIsThere2(sGridNo, bLevel)) != NOBODY) {
        DamageSoldierFromBlast(ubPerson, ubOwner, sBombGridNo, sWoundAmt, sBreathAmt, uiDist, usItem, sSubsequent);
      }

      if (bLevel == 1) {
        if ((ubPerson = WhoIsThere2(sGridNo, 0)) != NOBODY) {
          if ((sWoundAmt / 2) > 20) {
            // debris damage!
            if ((sBreathAmt / 2) > 20) {
              DamageSoldierFromBlast(ubPerson, ubOwner, sBombGridNo, Random((sWoundAmt / 2) - 20), Random((sBreathAmt / 2) - 20), uiDist, usItem, sSubsequent);
            } else {
              DamageSoldierFromBlast(ubPerson, ubOwner, sBombGridNo, Random((sWoundAmt / 2) - 20), 1, uiDist, usItem, sSubsequent);
            }
          }
        }
      }
    } else {
      if ((ubPerson = WhoIsThere2(sGridNo, bLevel)) >= NOBODY) {
        return fRecompileMovementCosts;
      }

      pSoldier = MercPtrs[ubPerson]; // someone is here, and they're gonna get hurt

      fRecompileMovementCosts = DishOutGasDamage(pSoldier, pExplosive, sSubsequent, fRecompileMovementCosts, sWoundAmt, sBreathAmt, ubOwner);
      /*
                       if (!pSoldier->bActive || !pSoldier->bInSector || !pSoldier->bLife || AM_A_ROBOT( pSoldier ) )
                       {
                               return( fRecompileMovementCosts );
                       }

                       if ( pExplosive->ubType == EXPLOSV_CREATUREGAS )
                       {
                               if ( pSoldier->uiStatusFlags & SOLDIER_MONSTER )
                               {
                                      // unaffected by own gas effects
                                      return( fRecompileMovementCosts );
                               }
                               if ( sSubsequent && pSoldier->fHitByGasFlags & HIT_BY_CREATUREGAS )
                               {
                                      // already affected by creature gas this turn
                                      return( fRecompileMovementCosts );
                               }
                       }
                       else // no gas mask help from creature attacks
                              // ATE/CJC: gas stuff
                              {
                               INT8 bPosOfMask = NO_SLOT;


                               if ( pExplosive->ubType == EXPLOSV_TEARGAS )
                               {
                                      // ignore whether subsequent or not if hit this turn
                                       if ( pSoldier->fHitByGasFlags & HIT_BY_TEARGAS )
                                       {
                                              // already affected by creature gas this turn
                                              return( fRecompileMovementCosts );
                                       }
                               }
                               else if ( pExplosive->ubType == EXPLOSV_MUSTGAS )
                               {
                                       if ( sSubsequent && pSoldier->fHitByGasFlags & HIT_BY_MUSTARDGAS )
                                       {
                                              // already affected by creature gas this turn
                                              return( fRecompileMovementCosts );
                                       }

                               }

                               if ( sSubsequent && pSoldier->fHitByGasFlags & HIT_BY_CREATUREGAS )
                               {
                                      // already affected by creature gas this turn
                                      return( fRecompileMovementCosts );
                               }


                               if ( pSoldier->inv[ HEAD1POS ].usItem == GASMASK && pSoldier->inv[ HEAD1POS ].bStatus[0] >= USABLE )
                               {
                                              bPosOfMask = HEAD1POS;
                               }
                               else if ( pSoldier->inv[ HEAD2POS ].usItem == GASMASK && pSoldier->inv[ HEAD2POS ].bStatus[0] >= USABLE )
                               {
                                              bPosOfMask = HEAD2POS;
                               }

                               if ( bPosOfMask != NO_SLOT  )
                               {
                                       if ( pSoldier->inv[ bPosOfMask ].bStatus[0] < GASMASK_MIN_STATUS )
                                       {
                                               // GAS MASK reduces breath loss by its work% (it leaks if not at least 70%)
                                               sBreathAmt = ( sBreathAmt * ( 100 - pSoldier->inv[ bPosOfMask ].bStatus[0] ) ) / 100;
                                               if ( sBreathAmt > 500 )
                                               {
                                                              // if at least 500 of breath damage got through
                                                              // the soldier within the blast radius is gassed for at least one
                                                              // turn, possibly more if it's tear gas (which hangs around a while)
                                                              pSoldier->uiStatusFlags |= SOLDIER_GASSED;
                                               }

                                               if ( sWoundAmt > 1 )
                                               {
                                                pSoldier->inv[ bPosOfMask ].bStatus[0] -= (INT8) Random( 4 );
                                                      sWoundAmt = ( sWoundAmt * ( 100 -  pSoldier->inv[ bPosOfMask ].bStatus[0] ) ) / 100;
                                               }
                                               else if ( sWoundAmt == 1 )
                                               {
                                                      pSoldier->inv[ bPosOfMask ].bStatus[0] -= (INT8) Random( 2 );
                                               }
                                       }
                                       else
                                       {
                                              sBreathAmt = 0;
                                              if ( sWoundAmt > 0 )
                                              {
                                               if ( sWoundAmt == 1 )
                                               {
                                                      pSoldier->inv[ bPosOfMask ].bStatus[0] -= (INT8) Random( 2 );
                                               }
                                               else
                                               {
                                                      // use up gas mask
                                                      pSoldier->inv[ bPosOfMask ].bStatus[0] -= (INT8) Random( 4 );
                                               }
                                              }
                                              sWoundAmt = 0;
                                       }

                               }
                              }

                              if ( sWoundAmt != 0 || sBreathAmt != 0 )
                              {
                                      switch( pExplosive->ubType )
                                      {
                                              case EXPLOSV_CREATUREGAS:
                                                      pSoldier->fHitByGasFlags |= HIT_BY_CREATUREGAS;
                                                      break;
                                              case EXPLOSV_TEARGAS:
                                                      pSoldier->fHitByGasFlags |= HIT_BY_TEARGAS;
                                                      break;
                                              case EXPLOSV_MUSTGAS:
                                                      pSoldier->fHitByGasFlags |= HIT_BY_MUSTARDGAS;
                                                      break;
                                              default:
                                                      break;
                                      }
                                      // a gas effect, take damage directly...
                                      SoldierTakeDamage( pSoldier, ANIM_STAND, sWoundAmt, sBreathAmt, TAKE_DAMAGE_GAS, NOBODY, NOWHERE, 0, TRUE );
                                      if ( pSoldier->bLife >= CONSCIOUSNESS )
                                      {
                                              DoMercBattleSound( pSoldier, (INT8)( BATTLE_SOUND_HIT1 + Random( 2 ) ) );
                                      }
                              }
                              */
    }

    (pfMercHit.value) = true;
  }

  return fRecompileMovementCosts;
}

function GetRayStopInfo(uiNewSpot: UINT32, ubDir: UINT8, bLevel: INT8, fSmokeEffect: boolean, uiCurRange: INT32, piMaxRange: Pointer<INT32>, pubKeepGoing: Pointer<UINT8>): void {
  let bStructHeight: INT8;
  let ubMovementCost: UINT8;
  let Blocking: INT8;
  let BlockingTemp: INT8;
  let fTravelCostObs: boolean = false;
  let uiRangeReduce: UINT32;
  let sNewGridNo: INT16;
  let pBlockingStructure: Pointer<STRUCTURE>;
  let fBlowWindowSouth: boolean = false;
  let fReduceRay: boolean = true;

  ubMovementCost = gubWorldMovementCosts[uiNewSpot][ubDir][bLevel];

  if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
    ubMovementCost = DoorTravelCost(null, uiNewSpot, ubMovementCost, false, null);
    // If we have hit a wall, STOP HERE
    if (ubMovementCost >= TRAVELCOST_BLOCKED) {
      fTravelCostObs = true;
    }
  } else {
    // If we have hit a wall, STOP HERE
    if (ubMovementCost == TRAVELCOST_WALL) {
      // We have an obstacle here..
      fTravelCostObs = true;
    }
  }

  Blocking = GetBlockingStructureInfo(uiNewSpot, ubDir, 0, bLevel, addressof(bStructHeight), addressof(pBlockingStructure), true);

  if (pBlockingStructure) {
    if (pBlockingStructure.value.fFlags & STRUCTURE_CAVEWALL) {
      // block completely!
      fTravelCostObs = true;
    } else if (pBlockingStructure.value.pDBStructureRef.value.pDBStructure.value.ubDensity <= 15) {
      // not stopped
      fTravelCostObs = false;
      fReduceRay = false;
    }
  }

  if (fTravelCostObs) {
    if (fSmokeEffect) {
      if (Blocking == BLOCKING_TOPRIGHT_OPEN_WINDOW || Blocking == BLOCKING_TOPLEFT_OPEN_WINDOW) {
        // If open, fTravelCostObs set to false and reduce range....
        fTravelCostObs = false;
        // Range will be reduced below...
      }

      if (fTravelCostObs) {
        // ATE: For windows, check to the west and north for a broken window, as movement costs
        // will override there...
        sNewGridNo = NewGridNo(uiNewSpot, DirectionInc(Enum245.WEST));

        BlockingTemp = GetBlockingStructureInfo(sNewGridNo, ubDir, 0, bLevel, addressof(bStructHeight), addressof(pBlockingStructure), true);
        if (BlockingTemp == BLOCKING_TOPRIGHT_OPEN_WINDOW || BlockingTemp == BLOCKING_TOPLEFT_OPEN_WINDOW) {
          // If open, fTravelCostObs set to false and reduce range....
          fTravelCostObs = false;
          // Range will be reduced below...
        }
        if (pBlockingStructure && pBlockingStructure.value.pDBStructureRef.value.pDBStructure.value.ubDensity <= 15) {
          fTravelCostObs = false;
          fReduceRay = false;
        }
      }

      if (fTravelCostObs) {
        sNewGridNo = NewGridNo(uiNewSpot, DirectionInc(Enum245.NORTH));

        BlockingTemp = GetBlockingStructureInfo(sNewGridNo, ubDir, 0, bLevel, addressof(bStructHeight), addressof(pBlockingStructure), true);
        if (BlockingTemp == BLOCKING_TOPRIGHT_OPEN_WINDOW || BlockingTemp == BLOCKING_TOPLEFT_OPEN_WINDOW) {
          // If open, fTravelCostObs set to false and reduce range....
          fTravelCostObs = false;
          // Range will be reduced below...
        }
        if (pBlockingStructure && pBlockingStructure.value.pDBStructureRef.value.pDBStructure.value.ubDensity <= 15) {
          fTravelCostObs = false;
          fReduceRay = false;
        }
      }
    } else {
      // We are a blast effect....

      // ATE: explode windows!!!!
      if (Blocking == BLOCKING_TOPLEFT_WINDOW || Blocking == BLOCKING_TOPRIGHT_WINDOW) {
        // Explode!
        if (ubDir == Enum245.SOUTH || ubDir == Enum245.SOUTHEAST || ubDir == Enum245.SOUTHWEST) {
          fBlowWindowSouth = true;
        }

        if (pBlockingStructure != null) {
          WindowHit(uiNewSpot, pBlockingStructure.value.usStructureID, fBlowWindowSouth, true);
        }
      }

      // ATE: For windows, check to the west and north for a broken window, as movement costs
      // will override there...
      sNewGridNo = NewGridNo(uiNewSpot, DirectionInc(Enum245.WEST));

      BlockingTemp = GetBlockingStructureInfo(sNewGridNo, ubDir, 0, bLevel, addressof(bStructHeight), addressof(pBlockingStructure), true);
      if (pBlockingStructure && pBlockingStructure.value.pDBStructureRef.value.pDBStructure.value.ubDensity <= 15) {
        fTravelCostObs = false;
        fReduceRay = false;
      }
      if (BlockingTemp == BLOCKING_TOPRIGHT_WINDOW || BlockingTemp == BLOCKING_TOPLEFT_WINDOW) {
        if (pBlockingStructure != null) {
          WindowHit(sNewGridNo, pBlockingStructure.value.usStructureID, false, true);
        }
      }

      sNewGridNo = NewGridNo(uiNewSpot, DirectionInc(Enum245.NORTH));
      BlockingTemp = GetBlockingStructureInfo(sNewGridNo, ubDir, 0, bLevel, addressof(bStructHeight), addressof(pBlockingStructure), true);

      if (pBlockingStructure && pBlockingStructure.value.pDBStructureRef.value.pDBStructure.value.ubDensity <= 15) {
        fTravelCostObs = false;
        fReduceRay = false;
      }
      if (BlockingTemp == BLOCKING_TOPRIGHT_WINDOW || BlockingTemp == BLOCKING_TOPLEFT_WINDOW) {
        if (pBlockingStructure != null) {
          WindowHit(sNewGridNo, pBlockingStructure.value.usStructureID, false, true);
        }
      }
    }
  }

  // Have we hit things like furniture, etc?
  if (Blocking != NOTHING_BLOCKING && !fTravelCostObs) {
    // ATE: Tall things should blaock all
    if (bStructHeight == 4) {
      (pubKeepGoing.value) = false;
    } else {
      // If we are smoke, reduce range variably....
      if (fReduceRay) {
        if (fSmokeEffect) {
          switch (bStructHeight) {
            case 3:
              uiRangeReduce = 2;
              break;

            case 2:

              uiRangeReduce = 1;
              break;

            default:

              uiRangeReduce = 0;
              break;
          }
        } else {
          uiRangeReduce = 2;
        }

        (piMaxRange.value) -= uiRangeReduce;
      }

      if (uiCurRange <= (piMaxRange.value)) {
        (pubKeepGoing.value) = true;
      } else {
        (pubKeepGoing.value) = false;
      }
    }
  } else {
    if (fTravelCostObs) {
      (pubKeepGoing.value) = false;
    } else {
      (pubKeepGoing.value) = true;
    }
  }
}

export function SpreadEffect(sGridNo: INT16, ubRadius: UINT8, usItem: UINT16, ubOwner: UINT8, fSubsequent: boolean, bLevel: INT8, iSmokeEffectID: INT32): void {
  let uiNewSpot: INT32;
  let uiTempSpot: INT32;
  let uiBranchSpot: INT32;
  let cnt: INT32;
  let branchCnt: INT32;
  let uiTempRange: INT32;
  let ubBranchRange: INT32;
  let ubDir: UINT8;
  let ubBranchDir: UINT8;
  let ubKeepGoing: UINT8;
  let sRange: INT16;
  let fRecompileMovement: boolean = false;
  let fAnyMercHit: boolean = false;
  let fSmokeEffect: boolean = false;

  switch (usItem) {
    case Enum225.MUSTARD_GRENADE:
    case Enum225.TEARGAS_GRENADE:
    case Enum225.GL_TEARGAS_GRENADE:
    case Enum225.BIG_TEAR_GAS:
    case Enum225.SMOKE_GRENADE:
    case Enum225.GL_SMOKE_GRENADE:
    case Enum225.SMALL_CREATURE_GAS:
    case Enum225.LARGE_CREATURE_GAS:
    case Enum225.VERY_SMALL_CREATURE_GAS:

      fSmokeEffect = true;
      break;
  }

  // Set values for recompile region to optimize area we need to recompile for MPs
  gsRecompileAreaTop = sGridNo / WORLD_COLS;
  gsRecompileAreaLeft = sGridNo % WORLD_COLS;
  gsRecompileAreaRight = gsRecompileAreaLeft;
  gsRecompileAreaBottom = gsRecompileAreaTop;

  // multiply range by 2 so we can correctly calculate approximately round explosion regions
  sRange = ubRadius * 2;

  // first, affect main spot
  if (ExpAffect(sGridNo, sGridNo, 0, usItem, ubOwner, fSubsequent, addressof(fAnyMercHit), bLevel, iSmokeEffectID)) {
    fRecompileMovement = true;
  }

  for (ubDir = Enum245.NORTH; ubDir <= Enum245.NORTHWEST; ubDir++) {
    uiTempSpot = sGridNo;

    uiTempRange = sRange;

    if (ubDir & 1) {
      cnt = 3;
    } else {
      cnt = 2;
    }
    while (cnt <= uiTempRange) // end of range loop
    {
      // move one tile in direction
      uiNewSpot = NewGridNo(uiTempSpot, DirectionInc(ubDir));

      // see if this was a different spot & if we should be able to reach
      // this spot
      if (uiNewSpot == uiTempSpot) {
        ubKeepGoing = false;
      } else {
        // Check if struct is a tree, etc and reduce range...
        GetRayStopInfo(uiNewSpot, ubDir, bLevel, fSmokeEffect, cnt, addressof(uiTempRange), addressof(ubKeepGoing));
      }

      if (ubKeepGoing) {
        uiTempSpot = uiNewSpot;

        // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("Explosion affects %d", uiNewSpot) );
        // ok, do what we do here...
        if (ExpAffect(sGridNo, uiNewSpot, cnt / 2, usItem, ubOwner, fSubsequent, addressof(fAnyMercHit), bLevel, iSmokeEffectID)) {
          fRecompileMovement = true;
        }

        // how far should we branch out here?
        ubBranchRange = (sRange - cnt);

        if (ubBranchRange) {
          // ok, there's a branch here. Mark where we start this branch.
          uiBranchSpot = uiNewSpot;

          // figure the branch direction - which is one dir clockwise
          ubBranchDir = (ubDir + 1) % 8;

          if (ubBranchDir & 1) {
            branchCnt = 3;
          } else {
            branchCnt = 2;
          }

          while (branchCnt <= ubBranchRange) // end of range loop
          {
            ubKeepGoing = true;
            uiNewSpot = NewGridNo(uiBranchSpot, DirectionInc(ubBranchDir));

            if (uiNewSpot != uiBranchSpot) {
              // Check if struct is a tree, etc and reduce range...
              GetRayStopInfo(uiNewSpot, ubBranchDir, bLevel, fSmokeEffect, branchCnt, addressof(ubBranchRange), addressof(ubKeepGoing));

              if (ubKeepGoing) {
                // ok, do what we do here
                // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("Explosion affects %d", uiNewSpot) );
                if (ExpAffect(sGridNo, uiNewSpot, ((cnt + branchCnt) / 2), usItem, ubOwner, fSubsequent, addressof(fAnyMercHit), bLevel, iSmokeEffectID)) {
                  fRecompileMovement = true;
                }
                uiBranchSpot = uiNewSpot;
              }
              // else
              {
                // check if it's ANY door, and if so, affect that spot so it's damaged
                //   if (RealDoorAt(uiNewSpot))
                //	 {
                //      ExpAffect(sGridNo,uiNewSpot,cnt,ubReason,fSubsequent);
                //	 }
                // blocked, break out of the the sub-branch loop
                //	 break;
              }
            }

            if (ubBranchDir & 1) {
              branchCnt += 3;
            } else {
              branchCnt += 2;
            }
          }
        } // end of if a branch to do
      } else // at edge, or tile blocks further spread in that direction
      {
        break;
      }

      if (ubDir & 1) {
        cnt += 3;
      } else {
        cnt += 2;
      }
    }
  } // end of dir loop

  // Recompile movement costs...
  if (fRecompileMovement) {
    let sX: INT16;
    let sY: INT16;

    // DO wireframes as well
    ConvertGridNoToXY(sGridNo, addressof(sX), addressof(sY));
    SetRecalculateWireFrameFlagRadius(sX, sY, ubRadius);
    CalculateWorldWireFrameTiles(false);

    RecompileLocalMovementCostsInAreaWithFlags();
    RecompileLocalMovementCostsFromRadius(sGridNo, MAX_DISTANCE_EXPLOSIVE_CAN_DESTROY_STRUCTURES);

    // if anything has been done to change movement costs and this is a potential POW situation, check
    // paths for POWs
    if (gWorldSectorX == 13 && gWorldSectorY == MAP_ROW_I) {
      DoPOWPathChecks();
    }
  }

  // do sight checks if something damaged or smoke stuff involved
  if (fRecompileMovement || fSmokeEffect) {
    if (gubElementsOnExplosionQueue) {
      gfExplosionQueueMayHaveChangedSight = true;
    }
  }

  gsRecompileAreaTop = 0;
  gsRecompileAreaLeft = 0;
  gsRecompileAreaRight = 0;
  gsRecompileAreaBottom = 0;

  if (fAnyMercHit) {
    // reset explosion hit flag so we can damage mercs again
    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      if (MercSlots[cnt]) {
        MercSlots[cnt].value.ubMiscSoldierFlags &= ~SOLDIER_MISC_HURT_BY_EXPLOSION;
      }
    }
  }

  if (fSubsequent != BLOOD_SPREAD_EFFECT) {
    MakeNoise(NOBODY, sGridNo, bLevel, gpWorldLevelData[sGridNo].ubTerrainID, Explosive[Item[usItem].ubClassIndex].ubVolume, Enum236.NOISE_EXPLOSION);
  }
}

function ToggleActionItemsByFrequency(bFrequency: INT8): void {
  let uiWorldBombIndex: UINT32;
  let pObj: Pointer<OBJECTTYPE>;

  // Go through all the bombs in the world, and look for remote ones
  for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
    if (gWorldBombs[uiWorldBombIndex].fExists) {
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
      if (pObj.value.bDetonatorType == Enum224.BOMB_REMOTE) {
        // Found a remote bomb, so check to see if it has the same frequency
        if (pObj.value.bFrequency == bFrequency) {
          // toggle its active flag
          if (pObj.value.fFlags & OBJECT_DISABLED_BOMB) {
            pObj.value.fFlags &= (~OBJECT_DISABLED_BOMB);
          } else {
            pObj.value.fFlags |= OBJECT_DISABLED_BOMB;
          }
        }
      }
    }
  }
}

function TogglePressureActionItemsInGridNo(sGridNo: INT16): void {
  let uiWorldBombIndex: UINT32;
  let pObj: Pointer<OBJECTTYPE>;

  // Go through all the bombs in the world, and look for remote ones
  for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
    if (gWorldBombs[uiWorldBombIndex].fExists && gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].sGridNo == sGridNo) {
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
      if (pObj.value.bDetonatorType == Enum224.BOMB_PRESSURE) {
        // Found a pressure item
        // toggle its active flag
        if (pObj.value.fFlags & OBJECT_DISABLED_BOMB) {
          pObj.value.fFlags &= (~OBJECT_DISABLED_BOMB);
        } else {
          pObj.value.fFlags |= OBJECT_DISABLED_BOMB;
        }
      }
    }
  }
}

function DelayedBillyTriggerToBlockOnExit(): void {
  if (WhoIsThere2(gsTempActionGridNo, 0) == NOBODY) {
    TriggerNPCRecord(Enum268.BILLY, 6);
  } else {
    // delay further!
    SetCustomizableTimerCallbackAndDelay(1000, DelayedBillyTriggerToBlockOnExit, true);
  }
}

function BillyBlocksDoorCallback(): void {
  TriggerNPCRecord(Enum268.BILLY, 6);
}

function HookerInRoom(ubRoom: UINT8): boolean {
  let ubLoop: UINT8;
  let ubTempRoom: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (ubLoop = gTacticalStatus.Team[CIV_TEAM].bFirstID; ubLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; ubLoop++) {
    pSoldier = MercPtrs[ubLoop];

    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE && pSoldier.value.bNeutral && pSoldier.value.ubBodyType == Enum194.MINICIV) {
      if (InARoom(pSoldier.value.sGridNo, addressof(ubTempRoom)) && ubTempRoom == ubRoom) {
        return true;
      }
    }
  }

  return false;
}

function PerformItemAction(sGridNo: INT16, pObj: Pointer<OBJECTTYPE>): void {
  let pStructure: Pointer<STRUCTURE>;

  switch (pObj.value.bActionValue) {
    case Enum191.ACTION_ITEM_OPEN_DOOR:
      pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
      if (pStructure) {
        if (pStructure.value.fFlags & STRUCTURE_OPEN) {
          // it's already open - this MIGHT be an error but probably not
          // because we are basically just ensuring that the door is open
        } else {
          if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
            HandleDoorChangeFromGridNo(null, sGridNo, false);
          } else {
            HandleDoorChangeFromGridNo(null, pStructure.value.sBaseGridNo, false);
          }
          gfExplosionQueueMayHaveChangedSight = true;
        }
      } else {
// error message here
      }
      break;
    case Enum191.ACTION_ITEM_CLOSE_DOOR:
      pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
      if (pStructure) {
        if (pStructure.value.fFlags & STRUCTURE_OPEN) {
          if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
            HandleDoorChangeFromGridNo(null, sGridNo, false);
          } else {
            HandleDoorChangeFromGridNo(null, pStructure.value.sBaseGridNo, false);
          }
          gfExplosionQueueMayHaveChangedSight = true;
        } else {
          // it's already closed - this MIGHT be an error but probably not
          // because we are basically just ensuring that the door is closed
        }
      } else {
// error message here
      }
      break;
    case Enum191.ACTION_ITEM_TOGGLE_DOOR:
      pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
      if (pStructure) {
        if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
          HandleDoorChangeFromGridNo(null, sGridNo, false);
        } else {
          HandleDoorChangeFromGridNo(null, pStructure.value.sBaseGridNo, false);
        }
        gfExplosionQueueMayHaveChangedSight = true;
      } else {
// error message here
      }
      break;
    case Enum191.ACTION_ITEM_UNLOCK_DOOR: {
      let pDoor: Pointer<DOOR>;

      pDoor = FindDoorInfoAtGridNo(sGridNo);
      if (pDoor) {
        pDoor.value.fLocked = false;
      }
    } break;
    case Enum191.ACTION_ITEM_TOGGLE_LOCK: {
      let pDoor: Pointer<DOOR>;

      pDoor = FindDoorInfoAtGridNo(sGridNo);
      if (pDoor) {
        if (pDoor.value.fLocked) {
          pDoor.value.fLocked = false;
        } else {
          pDoor.value.fLocked = true;
        }
      }
    } break;
    case Enum191.ACTION_ITEM_UNTRAP_DOOR: {
      let pDoor: Pointer<DOOR>;

      pDoor = FindDoorInfoAtGridNo(sGridNo);
      if (pDoor) {
        pDoor.value.ubTrapLevel = 0;
        pDoor.value.ubTrapID = Enum227.NO_TRAP;
      }
    } break;
    case Enum191.ACTION_ITEM_SMALL_PIT:
      Add3X3Pit(sGridNo);
      SearchForOtherMembersWithinPitRadiusAndMakeThemFall(sGridNo, 1);
      break;
    case Enum191.ACTION_ITEM_LARGE_PIT:
      Add5X5Pit(sGridNo);
      SearchForOtherMembersWithinPitRadiusAndMakeThemFall(sGridNo, 2);
      break;
    case Enum191.ACTION_ITEM_TOGGLE_ACTION1:
      ToggleActionItemsByFrequency(FIRST_MAP_PLACED_FREQUENCY + 1);
      break;
    case Enum191.ACTION_ITEM_TOGGLE_ACTION2:
      ToggleActionItemsByFrequency(FIRST_MAP_PLACED_FREQUENCY + 2);
      break;
    case Enum191.ACTION_ITEM_TOGGLE_ACTION3:
      ToggleActionItemsByFrequency(FIRST_MAP_PLACED_FREQUENCY + 3);
      break;
    case Enum191.ACTION_ITEM_TOGGLE_ACTION4:
      ToggleActionItemsByFrequency(FIRST_MAP_PLACED_FREQUENCY + 4);
      break;
    case Enum191.ACTION_ITEM_TOGGLE_PRESSURE_ITEMS:
      TogglePressureActionItemsInGridNo(sGridNo);
      break;
    case Enum191.ACTION_ITEM_ENTER_BROTHEL:
      // JA2Gold: Disable brothel tracking
      /*
      if ( ! (gTacticalStatus.uiFlags & INCOMBAT) )
      {
              UINT8		ubID;

              ubID = WhoIsThere2( sGridNo, 0 );
              if ( (ubID != NOBODY) && (MercPtrs[ ubID ]->bTeam == gbPlayerNum) )
              {
                      if ( MercPtrs[ ubID ]->sOldGridNo == sGridNo + DirectionInc( SOUTH ) )
                      {
                              gMercProfiles[ MADAME ].bNPCData2++;

                              SetFactTrue( FACT_PLAYER_USED_BROTHEL );
                              SetFactTrue( FACT_PLAYER_PASSED_GOON );

                              // If we for any reason trigger Madame's record 34 then we don't bother to do
                              // anything else

                              // Billy always moves back on a timer so that the player has a chance to sneak
                              // someone else through

                              // Madame's quote about female mercs should therefore not be made on a timer

                              if ( gMercProfiles[ MADAME ].bNPCData2 > 2 )
                              {
                                      // more than 2 entering brothel
                                      TriggerNPCRecord( MADAME, 35 );
                                      return;
                              }

                              if ( gMercProfiles[ MADAME ].bNPCData2 == gMercProfiles[ MADAME ].bNPCData )
                              {
                                      // full # of mercs who paid have entered brothel
                                      // have Billy block the way again
                                      SetCustomizableTimerCallbackAndDelay( 2000, BillyBlocksDoorCallback, FALSE );
                                      //TriggerNPCRecord( BILLY, 6 );
                              }
                              else if ( gMercProfiles[ MADAME ].bNPCData2 > gMercProfiles[ MADAME ].bNPCData )
                              {
                                      // more than full # of mercs who paid have entered brothel
                                      // have Billy block the way again?
                                      if ( CheckFact( FACT_PLAYER_FORCED_WAY_INTO_BROTHEL, 0 ) )
                                      {
                                              // player already did this once!
                                              TriggerNPCRecord( MADAME, 35 );
                                              return;
                                      }
                                      else
                                      {
                                              SetCustomizableTimerCallbackAndDelay( 2000, BillyBlocksDoorCallback, FALSE );
                                              SetFactTrue( FACT_PLAYER_FORCED_WAY_INTO_BROTHEL );
                                              TriggerNPCRecord( MADAME, 34 );
                                      }
                              }

                              if ( gMercProfiles[ MercPtrs[ ubID ]->ubProfile ].bSex == FEMALE )
                              {
                                      // woman walking into brothel
                                      TriggerNPCRecordImmediately( MADAME, 33 );
                              }

                      }
                      else
                      {
                              // someone wants to leave the brothel
                              TriggerNPCRecord( BILLY, 5 );
                      }

              }

      }
      */
      break;
    case Enum191.ACTION_ITEM_EXIT_BROTHEL:
      // JA2Gold: Disable brothel tracking
      /*
      if ( ! (gTacticalStatus.uiFlags & INCOMBAT) )
      {
              UINT8		ubID;

              ubID = WhoIsThere2( sGridNo, 0 );
              if ( (ubID != NOBODY) && (MercPtrs[ ubID ]->bTeam == gbPlayerNum) && MercPtrs[ ubID ]->sOldGridNo == sGridNo + DirectionInc( NORTH ) )
              {
                      gMercProfiles[ MADAME ].bNPCData2--;
                      if ( gMercProfiles[ MADAME ].bNPCData2 == 0 )
                      {
                              // reset paid #
                              gMercProfiles[ MADAME ].bNPCData = 0;
                      }
                      // Billy should move back to block the door again
                      gsTempActionGridNo = sGridNo;
                      SetCustomizableTimerCallbackAndDelay( 1000, DelayedBillyTriggerToBlockOnExit, TRUE );
              }
      }
      */
      break;
    case Enum191.ACTION_ITEM_KINGPIN_ALARM:
      PlayJA2Sample(Enum330.KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, sGridNo), 5, SoundDir(sGridNo));
      CallAvailableKingpinMenTo(sGridNo);

      gTacticalStatus.fCivGroupHostile[Enum246.KINGPIN_CIV_GROUP] = CIV_GROUP_HOSTILE;

      {
        let ubID: UINT8;
        let ubID2: UINT8;
        let fEnterCombat: boolean = false;

        for (ubID = gTacticalStatus.Team[CIV_TEAM].bFirstID; ubID <= gTacticalStatus.Team[CIV_TEAM].bLastID; ubID++) {
          if (MercPtrs[ubID].value.bActive && MercPtrs[ubID].value.bInSector && MercPtrs[ubID].value.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) {
            for (ubID2 = gTacticalStatus.Team[gbPlayerNum].bFirstID; ubID2 <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubID2++) {
              if (MercPtrs[ubID].value.bOppList[ubID2] == SEEN_CURRENTLY) {
                MakeCivHostile(MercPtrs[ubID], 2);
                fEnterCombat = true;
              }
            }
          }
        }

        if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
          EnterCombatMode(CIV_TEAM);
        }
      }

      // now zap this object so it won't activate again
      pObj.value.fFlags &= (~OBJECT_DISABLED_BOMB);
      break;
    case Enum191.ACTION_ITEM_SEX:
      // JA2Gold: Disable brothel sex
      /*
      if ( ! (gTacticalStatus.uiFlags & INCOMBAT) )
      {
              UINT8		ubID;
              OBJECTTYPE DoorCloser;
              INT16		sTeleportSpot;
              INT16		sDoorSpot;
              UINT8		ubDirection;
              UINT8		ubRoom, ubOldRoom;

              ubID = WhoIsThere2( sGridNo, 0 );
              if ( (ubID != NOBODY) && (MercPtrs[ ubID ]->bTeam == gbPlayerNum) )
              {
                      if ( InARoom( sGridNo, &ubRoom ) && InARoom( MercPtrs[ ubID ]->sOldGridNo, &ubOldRoom ) && ubOldRoom != ubRoom )
                      {
                              // also require there to be a miniskirt civ in the room
                              if ( HookerInRoom( ubRoom ) )
                              {

                                      // stop the merc...
                                      EVENT_StopMerc( MercPtrs[ ubID ], MercPtrs[ ubID ]->sGridNo, MercPtrs[ ubID ]->bDirection );

                                      switch( sGridNo )
                                      {
                                              case 13414:
                                                      sDoorSpot = 13413;
                                                      sTeleportSpot = 13413;
                                                      break;
                                              case 11174:
                                                      sDoorSpot = 11173;
                                                      sTeleportSpot = 11173;
                                                      break;
                                              case 12290:
                                                      sDoorSpot = 12290;
                                                      sTeleportSpot = 12291;
                                                      break;

                                              default:

                                                      sDoorSpot = NOWHERE;
                                                      sTeleportSpot = NOWHERE;


                                      }

                                      if ( sDoorSpot != NOWHERE && sTeleportSpot != NOWHERE )
                                      {
                                              // close the door...
                                              DoorCloser.bActionValue = ACTION_ITEM_CLOSE_DOOR;
                                              PerformItemAction( sDoorSpot, &DoorCloser );

                                              // have sex
                                              HandleNPCDoAction( 0, NPC_ACTION_SEX, 0 );

                                              // move the merc outside of the room again
                                              sTeleportSpot = FindGridNoFromSweetSpotWithStructData( MercPtrs[ ubID ], STANDING, sTeleportSpot, 2, &ubDirection, FALSE );
                                              ChangeSoldierState( MercPtrs[ ubID ], STANDING, 0, TRUE );
                                              TeleportSoldier( MercPtrs[ ubID ], sTeleportSpot, FALSE );

                                              HandleMoraleEvent( MercPtrs[ ubID ], MORALE_SEX, gWorldSectorX, gWorldSectorY, gbWorldSectorZ );
                                              FatigueCharacter( MercPtrs[ ubID ] );
                                              FatigueCharacter( MercPtrs[ ubID ] );
                                              FatigueCharacter( MercPtrs[ ubID ] );
                                              FatigueCharacter( MercPtrs[ ubID ] );
                                              DirtyMercPanelInterface( MercPtrs[ ubID ], DIRTYLEVEL1 );
                                      }
                              }

                      }
                      break;

              }
      }
      */
      break;
    case Enum191.ACTION_ITEM_REVEAL_ROOM: {
      let ubRoom: UINT8;
      if (InAHiddenRoom(sGridNo, addressof(ubRoom))) {
        RemoveRoomRoof(sGridNo, ubRoom, null);
      }
    } break;
    case Enum191.ACTION_ITEM_LOCAL_ALARM:
      MakeNoise(NOBODY, sGridNo, 0, gpWorldLevelData[sGridNo].ubTerrainID, 30, Enum236.NOISE_SILENT_ALARM);
      break;
    case Enum191.ACTION_ITEM_GLOBAL_ALARM:
      CallAvailableEnemiesTo(sGridNo);
      break;
    case Enum191.ACTION_ITEM_BLOODCAT_ALARM:
      CallAvailableTeamEnemiesTo(sGridNo, CREATURE_TEAM);
      break;
    case Enum191.ACTION_ITEM_KLAXON:
      PlayJA2Sample(Enum330.KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, sGridNo), 5, SoundDir(sGridNo));
      break;
    case Enum191.ACTION_ITEM_MUSEUM_ALARM:
      PlayJA2Sample(Enum330.KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, sGridNo), 5, SoundDir(sGridNo));
      CallEldinTo(sGridNo);
      break;
    default:
// error message here
      break;
  }
}

function AddBombToQueue(uiWorldBombIndex: UINT32, uiTimeStamp: UINT32): void {
  if (gubElementsOnExplosionQueue == MAX_BOMB_QUEUE) {
    return;
  }

  gExplosionQueue[gubElementsOnExplosionQueue].uiWorldBombIndex = uiWorldBombIndex;
  gExplosionQueue[gubElementsOnExplosionQueue].uiTimeStamp = uiTimeStamp;
  gExplosionQueue[gubElementsOnExplosionQueue].fExists = true;
  if (!gfExplosionQueueActive) {
    // lock UI
    guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;
    // disable sight
    gTacticalStatus.uiFlags |= DISALLOW_SIGHT;
  }
  gubElementsOnExplosionQueue++;
  gfExplosionQueueActive = true;
}

export function HandleExplosionQueue(): void {
  let uiIndex: UINT32;
  let uiWorldBombIndex: UINT32;
  let uiCurrentTime: UINT32;
  let sGridNo: INT16;
  let pObj: Pointer<OBJECTTYPE>;
  let ubLevel: UINT8;

  if (!gfExplosionQueueActive) {
    return;
  }

  uiCurrentTime = GetJA2Clock();
  for (uiIndex = 0; uiIndex < gubElementsOnExplosionQueue; uiIndex++) {
    if (gExplosionQueue[uiIndex].fExists && uiCurrentTime >= gExplosionQueue[uiIndex].uiTimeStamp) {
      // Set off this bomb now!

      // Preliminary assignments:
      uiWorldBombIndex = gExplosionQueue[uiIndex].uiWorldBombIndex;
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
      sGridNo = gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].sGridNo;
      ubLevel = gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].ubLevel;

      if (pObj.value.usItem == Enum225.ACTION_ITEM && pObj.value.bActionValue != Enum191.ACTION_ITEM_BLOW_UP) {
        PerformItemAction(sGridNo, pObj);
      } else if (pObj.value.usBombItem == Enum225.TRIP_KLAXON) {
        PlayJA2Sample(Enum330.KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, sGridNo), 5, SoundDir(sGridNo));
        CallAvailableEnemiesTo(sGridNo);
        // RemoveItemFromPool( sGridNo, gWorldBombs[ uiWorldBombIndex ].iItemIndex, 0 );
      } else if (pObj.value.usBombItem == Enum225.TRIP_FLARE) {
        NewLightEffect(sGridNo, Enum305.LIGHT_FLARE_MARK_1);
        RemoveItemFromPool(sGridNo, gWorldBombs[uiWorldBombIndex].iItemIndex, ubLevel);
      } else {
        gfExplosionQueueMayHaveChangedSight = true;

        // We have to remove the item first to prevent the explosion from detonating it
        // a second time :-)
        RemoveItemFromPool(sGridNo, gWorldBombs[uiWorldBombIndex].iItemIndex, ubLevel);

        // make sure no one thinks there is a bomb here any more!
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_PLAYER_MINE_PRESENT) {
          RemoveBlueFlag(sGridNo, ubLevel);
        }
        gpWorldLevelData[sGridNo].uiFlags &= ~(MAPELEMENT_ENEMY_MINE_PRESENT);

        // BOOM!

        // bomb objects only store the SIDE who placed the bomb! :-(
        if (pObj.value.ubBombOwner > 1) {
          IgniteExplosion((pObj.value.ubBombOwner - 2), CenterX(sGridNo), CenterY(sGridNo), 0, sGridNo, pObj.value.usBombItem, ubLevel);
        } else {
          // pre-placed
          IgniteExplosion(NOBODY, CenterX(sGridNo), CenterY(sGridNo), 0, sGridNo, pObj.value.usBombItem, ubLevel);
        }
      }

      // Bye bye bomb
      gExplosionQueue[uiIndex].fExists = false;
    }
  }

  // See if we can reduce the # of elements on the queue that we have recorded
  // Easier to do it at this time rather than in the loop above
  while (gubElementsOnExplosionQueue > 0 && gExplosionQueue[gubElementsOnExplosionQueue - 1].fExists == false) {
    gubElementsOnExplosionQueue--;
  }

  if (gubElementsOnExplosionQueue == 0 && (gubPersonToSetOffExplosions == NOBODY || gTacticalStatus.ubAttackBusyCount == 0)) {
    // turn off explosion queue

    // re-enable sight
    gTacticalStatus.uiFlags &= (~DISALLOW_SIGHT);

    if (gubPersonToSetOffExplosions != NOBODY && !(MercPtrs[gubPersonToSetOffExplosions].value.uiStatusFlags & SOLDIER_PC)) {
      FreeUpNPCFromPendingAction(MercPtrs[gubPersonToSetOffExplosions]);
    }

    if (gfExplosionQueueMayHaveChangedSight) {
      let ubLoop: UINT8;
      let pTeamSoldier: Pointer<SOLDIERTYPE>;

      // set variable so we may at least have someone to resolve interrupts vs
      gubInterruptProvoker = gubPersonToSetOffExplosions;
      AllTeamsLookForAll(true);

      // call fov code
      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier++) {
        if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
          RevealRoofsAndItems(pTeamSoldier, true, false, pTeamSoldier.value.bLevel, false);
        }
      }

      gfExplosionQueueMayHaveChangedSight = false;
      gubPersonToSetOffExplosions = NOBODY;
    }

    // unlock UI
    // UnSetUIBusy( (UINT8)gusSelectedSoldier );
    if (!(gTacticalStatus.uiFlags & INCOMBAT) || gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
      // don't end UI lock when it's a computer turn
      guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
    }

    gfExplosionQueueActive = false;
  }
}

export function DecayBombTimers(): void {
  let uiWorldBombIndex: UINT32;
  let uiTimeStamp: UINT32;
  let pObj: Pointer<OBJECTTYPE>;

  uiTimeStamp = GetJA2Clock();

  // Go through all the bombs in the world, and look for timed ones
  for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
    if (gWorldBombs[uiWorldBombIndex].fExists) {
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
      if (pObj.value.bDetonatorType == Enum224.BOMB_TIMED && !(pObj.value.fFlags & OBJECT_DISABLED_BOMB)) {
        // Found a timed bomb, so decay its delay value and see if it goes off
        pObj.value.bDelay--;
        if (pObj.value.bDelay == 0) {
          // put this bomb on the queue
          AddBombToQueue(uiWorldBombIndex, uiTimeStamp);
          // ATE: CC black magic....
          if (pObj.value.ubBombOwner > 1) {
            gubPersonToSetOffExplosions = (pObj.value.ubBombOwner - 2);
          } else {
            gubPersonToSetOffExplosions = NOBODY;
          }

          if (pObj.value.usItem != Enum225.ACTION_ITEM || pObj.value.bActionValue == Enum191.ACTION_ITEM_BLOW_UP) {
            uiTimeStamp += BOMB_QUEUE_DELAY();
          }
        }
      }
    }
  }
}

export function SetOffBombsByFrequency(ubID: UINT8, bFrequency: INT8): void {
  let uiWorldBombIndex: UINT32;
  let uiTimeStamp: UINT32;
  let pObj: Pointer<OBJECTTYPE>;

  uiTimeStamp = GetJA2Clock();

  // Go through all the bombs in the world, and look for remote ones
  for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
    if (gWorldBombs[uiWorldBombIndex].fExists) {
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
      if (pObj.value.bDetonatorType == Enum224.BOMB_REMOTE && !(pObj.value.fFlags & OBJECT_DISABLED_BOMB)) {
        // Found a remote bomb, so check to see if it has the same frequency
        if (pObj.value.bFrequency == bFrequency) {
          gubPersonToSetOffExplosions = ubID;

          // put this bomb on the queue
          AddBombToQueue(uiWorldBombIndex, uiTimeStamp);
          if (pObj.value.usItem != Enum225.ACTION_ITEM || pObj.value.bActionValue == Enum191.ACTION_ITEM_BLOW_UP) {
            uiTimeStamp += BOMB_QUEUE_DELAY();
          }
        }
      }
    }
  }
}

export function SetOffPanicBombs(ubID: UINT8, bPanicTrigger: INT8): void {
  // need to turn off gridnos & flags in gTacticalStatus
  gTacticalStatus.sPanicTriggerGridNo[bPanicTrigger] = NOWHERE;
  if ((gTacticalStatus.sPanicTriggerGridNo[0] == NOWHERE) && (gTacticalStatus.sPanicTriggerGridNo[1] == NOWHERE) && (gTacticalStatus.sPanicTriggerGridNo[2] == NOWHERE)) {
    gTacticalStatus.fPanicFlags &= ~(PANIC_TRIGGERS_HERE);
  }

  switch (bPanicTrigger) {
    case 0:
      SetOffBombsByFrequency(ubID, PANIC_FREQUENCY);
      gTacticalStatus.fPanicFlags &= ~(PANIC_BOMBS_HERE);
      break;

    case 1:
      SetOffBombsByFrequency(ubID, PANIC_FREQUENCY_2);
      break;

    case 2:
      SetOffBombsByFrequency(ubID, PANIC_FREQUENCY_3);
      break;

    default:
      break;
  }

  if (gTacticalStatus.fPanicFlags) {
    // find a new "closest one"
    MakeClosestEnemyChosenOne();
  }
}

export function SetOffBombsInGridNo(ubID: UINT8, sGridNo: INT16, fAllBombs: boolean, bLevel: INT8): boolean {
  let uiWorldBombIndex: UINT32;
  let uiTimeStamp: UINT32;
  let pObj: Pointer<OBJECTTYPE>;
  let fFoundMine: boolean = false;

  uiTimeStamp = GetJA2Clock();

  // Go through all the bombs in the world, and look for mines at this location
  for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
    if (gWorldBombs[uiWorldBombIndex].fExists && gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].sGridNo == sGridNo && gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].ubLevel == bLevel) {
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
      if (!(pObj.value.fFlags & OBJECT_DISABLED_BOMB)) {
        if (fAllBombs || pObj.value.bDetonatorType == Enum224.BOMB_PRESSURE) {
          if (!fAllBombs && MercPtrs[ubID].value.bTeam != gbPlayerNum) {
            // ignore this unless it is a mine, etc which would have to have been placed by the
            // player, seeing as how the others are all marked as known to the AI.
            if (!(pObj.value.usItem == Enum225.MINE || pObj.value.usItem == Enum225.TRIP_FLARE || pObj.value.usItem == Enum225.TRIP_KLAXON)) {
              continue;
            }
          }

          // player and militia ignore bombs set by player
          if (pObj.value.ubBombOwner > 1 && (MercPtrs[ubID].value.bTeam == gbPlayerNum || MercPtrs[ubID].value.bTeam == MILITIA_TEAM)) {
            continue;
          }

          if (pObj.value.usItem == Enum225.SWITCH) {
            // send out a signal to detonate other bombs, rather than this which
            // isn't a bomb but a trigger
            SetOffBombsByFrequency(ubID, pObj.value.bFrequency);
          } else {
            gubPersonToSetOffExplosions = ubID;

            // put this bomb on the queue
            AddBombToQueue(uiWorldBombIndex, uiTimeStamp);
            if (pObj.value.usItem != Enum225.ACTION_ITEM || pObj.value.bActionValue == Enum191.ACTION_ITEM_BLOW_UP) {
              uiTimeStamp += BOMB_QUEUE_DELAY();
            }

            if (pObj.value.usBombItem != NOTHING && Item[pObj.value.usBombItem].usItemClass & IC_EXPLOSV) {
              fFoundMine = true;
            }
          }
        }
      }
    }
  }
  return fFoundMine;
}

export function ActivateSwitchInGridNo(ubID: UINT8, sGridNo: INT16): void {
  let uiWorldBombIndex: UINT32;
  let pObj: Pointer<OBJECTTYPE>;

  // Go through all the bombs in the world, and look for mines at this location
  for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
    if (gWorldBombs[uiWorldBombIndex].fExists && gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].sGridNo == sGridNo) {
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);

      if (pObj.value.usItem == Enum225.SWITCH && (!(pObj.value.fFlags & OBJECT_DISABLED_BOMB)) && pObj.value.bDetonatorType == Enum224.BOMB_SWITCH) {
        // send out a signal to detonate other bombs, rather than this which
        // isn't a bomb but a trigger

        // first set attack busy count to 0 in case of a lingering a.b.c. problem...
        gTacticalStatus.ubAttackBusyCount = 0;

        SetOffBombsByFrequency(ubID, pObj.value.bFrequency);
      }
    }
  }
}

export function SaveExplosionTableToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let uiExplosionCount: UINT32 = 0;
  let uiCnt: UINT32;

  //
  //	Explosion queue Info
  //

  // Write the number of explosion queues
  FileWrite(hFile, addressof(gubElementsOnExplosionQueue), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    FileClose(hFile);
    return false;
  }

  // loop through and add all the explosions
  for (uiCnt = 0; uiCnt < MAX_BOMB_QUEUE; uiCnt++) {
    FileWrite(hFile, addressof(gExplosionQueue[uiCnt]), sizeof(ExplosionQueueElement), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(ExplosionQueueElement)) {
      FileClose(hFile);
      return false;
    }
  }

  //
  //	Explosion Data
  //

  // loop through and count all the active explosions
  uiExplosionCount = 0;
  for (uiCnt = 0; uiCnt < NUM_EXPLOSION_SLOTS; uiCnt++) {
    if (gExplosionData[uiCnt].fAllocated) {
      uiExplosionCount++;
    }
  }

  // Save the number of explosions
  FileWrite(hFile, addressof(uiExplosionCount), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    FileClose(hFile);
    return false;
  }

  // loop through and count all the active explosions
  for (uiCnt = 0; uiCnt < NUM_EXPLOSION_SLOTS; uiCnt++) {
    if (gExplosionData[uiCnt].fAllocated) {
      FileWrite(hFile, addressof(gExplosionData[uiCnt]), sizeof(EXPLOSIONTYPE), addressof(uiNumBytesWritten));
      if (uiNumBytesWritten != sizeof(EXPLOSIONTYPE)) {
        FileClose(hFile);
        return false;
      }
    }
  }

  return true;
}

export function LoadExplosionTableFromSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let uiExplosionCount: UINT32 = 0;
  let uiCnt: UINT32;

  //
  //	Explosion Queue
  //

  // Clear the Explosion queue
  memset(gExplosionQueue, 0, sizeof(ExplosionQueueElement) * MAX_BOMB_QUEUE);

  // Read the number of explosions queue's
  FileRead(hFile, addressof(gubElementsOnExplosionQueue), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return false;
  }

  // loop through read all the active explosions fro the file
  for (uiCnt = 0; uiCnt < MAX_BOMB_QUEUE; uiCnt++) {
    FileRead(hFile, addressof(gExplosionQueue[uiCnt]), sizeof(ExplosionQueueElement), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(ExplosionQueueElement)) {
      return false;
    }
  }

  //
  //	Explosion Data
  //

  // Load the number of explosions
  FileRead(hFile, addressof(guiNumExplosions), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return false;
  }

  // loop through and load all the active explosions
  for (uiCnt = 0; uiCnt < guiNumExplosions; uiCnt++) {
    FileRead(hFile, addressof(gExplosionData[uiCnt]), sizeof(EXPLOSIONTYPE), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(EXPLOSIONTYPE)) {
      return false;
    }
    gExplosionData[uiCnt].iID = uiCnt;
    gExplosionData[uiCnt].iLightID = -1;

    GenerateExplosionFromExplosionPointer(addressof(gExplosionData[uiCnt]));
  }

  return true;
}

export function DoesSAMExistHere(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16, sGridNo: INT16): boolean {
  let cnt: INT32;
  let sSectorNo: INT16;

  // ATE: If we are belwo, return right away...
  if (sSectorZ != 0) {
    return false;
  }

  sSectorNo = SECTOR(sSectorX, sSectorY);

  for (cnt = 0; cnt < NUMBER_OF_SAMS; cnt++) {
    // Are we i nthe same sector...
    if (pSamList[cnt] == sSectorNo) {
      // Are we in the same gridno?
      if (pSamGridNoAList[cnt] == sGridNo || pSamGridNoBList[cnt] == sGridNo) {
        return true;
      }
    }
  }

  return false;
}

export function UpdateAndDamageSAMIfFound(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16, sGridNo: INT16, ubDamage: UINT8): void {
  let sSectorNo: INT16;

  // OK, First check if SAM exists, and if not, return
  if (!DoesSAMExistHere(sSectorX, sSectorY, sSectorZ, sGridNo)) {
    return;
  }

  // Damage.....
  sSectorNo = CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY);

  if (StrategicMap[sSectorNo].bSAMCondition >= ubDamage) {
    StrategicMap[sSectorNo].bSAMCondition -= ubDamage;
  } else {
    StrategicMap[sSectorNo].bSAMCondition = 0;
  }

  // SAM site may have been put out of commission...
  UpdateAirspaceControl();

  // ATE: GRAPHICS UPDATE WILL GET DONE VIA NORMAL EXPLOSION CODE.....
}

export function UpdateSAMDoneRepair(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): void {
  let cnt: INT32;
  let sSectorNo: INT16;
  let fInSector: boolean = false;
  let usGoodGraphic: UINT16;
  let usDamagedGraphic: UINT16;

  // ATE: If we are below, return right away...
  if (sSectorZ != 0) {
    return;
  }

  if (sSectorX == gWorldSectorX && sSectorY == gWorldSectorY && sSectorZ == gbWorldSectorZ) {
    fInSector = true;
  }

  sSectorNo = SECTOR(sSectorX, sSectorY);

  for (cnt = 0; cnt < NUMBER_OF_SAMS; cnt++) {
    // Are we i nthe same sector...
    if (pSamList[cnt] == sSectorNo) {
      // get graphic.......
      GetTileIndexFromTypeSubIndex(Enum313.EIGHTISTRUCT, (gbSAMGraphicList[cnt]), addressof(usGoodGraphic));

      // Damaged one ( current ) is 2 less...
      usDamagedGraphic = usGoodGraphic - 2;

      // First gridno listed is base gridno....

      // if this is loaded....
      if (fInSector) {
        // Update graphic.....
        // Remove old!
        ApplyMapChangesToMapTempFile(true);

        RemoveStruct(pSamGridNoAList[cnt], usDamagedGraphic);
        AddStructToHead(pSamGridNoAList[cnt], usGoodGraphic);

        ApplyMapChangesToMapTempFile(false);
      } else {
        // We add temp changes to map not loaded....
        // Remove old
        RemoveStructFromUnLoadedMapTempFile(pSamGridNoAList[cnt], usDamagedGraphic, sSectorX, sSectorY, sSectorZ);
        // Add new
        AddStructToUnLoadedMapTempFile(pSamGridNoAList[cnt], usGoodGraphic, sSectorX, sSectorY, sSectorZ);
      }
    }
  }

  // SAM site may have been put back into working order...
  UpdateAirspaceControl();
}

// loop through civ team and find
// anybody who is an NPC and
// see if they get angry
function HandleBuldingDestruction(sGridNo: INT16, ubOwner: UINT8): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: UINT8;

  if (ubOwner == NOBODY) {
    return;
  }

  if (MercPtrs[ubOwner].value.bTeam != gbPlayerNum) {
    return;
  }

  cnt = gTacticalStatus.Team[CIV_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife && pSoldier.value.bNeutral) {
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        // ignore if the player is fighting the enemy here and this is a good guy
        if (gTacticalStatus.Team[ENEMY_TEAM].bMenInSector > 0 && (gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_GOODGUY)) {
          continue;
        }

        if (DoesNPCOwnBuilding(pSoldier, sGridNo)) {
          MakeNPCGrumpyForMinorOffense(pSoldier, MercPtrs[ubOwner]);
        }
      }
    }
  }
}

function FindActiveTimedBomb(): INT32 {
  let uiWorldBombIndex: UINT32;
  let uiTimeStamp: UINT32;
  let pObj: Pointer<OBJECTTYPE>;

  uiTimeStamp = GetJA2Clock();

  // Go through all the bombs in the world, and look for timed ones
  for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
    if (gWorldBombs[uiWorldBombIndex].fExists) {
      pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
      if (pObj.value.bDetonatorType == Enum224.BOMB_TIMED && !(pObj.value.fFlags & OBJECT_DISABLED_BOMB)) {
        return gWorldBombs[uiWorldBombIndex].iItemIndex;
      }
    }
  }

  return -1;
}

export function ActiveTimedBombExists(): boolean {
  if (gfWorldLoaded) {
    return FindActiveTimedBomb() != -1;
  } else {
    return false;
  }
}

export function RemoveAllActiveTimedBombs(): void {
  let iItemIndex: INT32;

  do {
    iItemIndex = FindActiveTimedBomb();
    if (iItemIndex != -1) {
      RemoveItemFromWorld(iItemIndex);
    }
  } while (iItemIndex != -1);
}

}
