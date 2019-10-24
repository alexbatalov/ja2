const PALETTEFILENAME = "BINARYDATA\\ja2pal.dat";

const LOW_MORALE_BATTLE_SND_THREASHOLD = 35;

const TURNING_FROM_PRONE_OFF = 0;
const TURNING_FROM_PRONE_ON = 1;
const TURNING_FROM_PRONE_START_UP_FROM_MOVE = 2;
const TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE = 3;

const MIN_SUBSEQUENT_SNDS_DELAY = 2000;

// Enumerate extended directions
const enum Enum256 {
  EX_NORTH = 0,
  EX_NORTHEAST = 4,
  EX_EAST = 8,
  EX_SOUTHEAST = 12,
  EX_SOUTH = 16,
  EX_SOUTHWEST = 20,
  EX_WEST = 24,
  EX_NORTHWEST = 28,
  EX_NUM_WORLD_DIRECTIONS = 32,
  EX_DIRECTION_IRRELEVANT,
}

// LUT for conversion from 8-direction to extended direction
let ubExtDirection: UINT8[] /* [] */ = [
  Enum256.EX_NORTH,
  Enum256.EX_NORTHEAST,
  Enum256.EX_EAST,
  Enum256.EX_SOUTHEAST,
  Enum256.EX_SOUTH,
  Enum256.EX_SOUTHWEST,
  Enum256.EX_WEST,
  Enum256.EX_NORTHWEST,
];

let gExtOneCDirection: UINT8[] /* [EX_NUM_WORLD_DIRECTIONS] */ = [
  4,
  5,
  6,
  7,

  8,
  9,
  10,
  11,

  12,
  13,
  14,
  15,

  16,
  17,
  18,
  19,

  20,
  21,
  22,
  23,

  24,
  25,
  26,
  27,

  28,
  29,
  30,
  31,

  0,
  1,
  2,
  3,
];

interface BATTLESNDS_STRUCT {
  zName: CHAR8[] /* [20] */;
  ubRandomVal: UINT8;
  fPreload: BOOLEAN;
  fBadGuy: BOOLEAN;
  fDontAllowTwoInRow: BOOLEAN;
  fStopDialogue: BOOLEAN;
}

let gBattleSndsData: BATTLESNDS_STRUCT[] /* [] */ = [
  [ "ok1", 2, 1, 1, 1, 2 ],
  [ "ok2", 0, 1, 1, 1, 2 ],
  [ "cool", 0, 1, 0, 1, 0 ],
  [ "curse", 0, 1, 1, 1, 0 ],
  [ "hit1", 2, 1, 1, 1, 1 ],
  [ "hit2", 0, 1, 1, 1, 1 ],
  [ "laugh", 0, 1, 1, 1, 0 ],
  [ "attn", 0, 1, 0, 1, 0 ],
  [ "dying", 0, 1, 1, 1, 1 ],
  [ "humm", 0, 0, 0, 1, 1 ],
  [ "noth", 0, 0, 0, 1, 1 ],
  [ "gotit", 0, 0, 0, 1, 1 ],
  [ "lmok1", 2, 1, 0, 1, 2 ],
  [ "lmok2", 0, 1, 0, 1, 2 ],
  [ "lmattn", 0, 1, 0, 1, 0 ],
  [ "locked", 0, 0, 0, 1, 0 ],
  [ "enem", 0, 1, 1, 1, 0 ],
];

let bHealthStrRanges: UINT8[] /* [] */ = [
  15,
  30,
  45,
  60,
  75,
  90,
  101,
];

let gsTerrainTypeSpeedModifiers: INT16[] /* [] */ = [
  5, // Flat ground
  5, // Floor
  5, // Paved road
  5, // Dirt road
  10, // LOW GRASS
  15, // HIGH GRASS
  20, // TRAIN TRACKS
  20, // LOW WATER
  25, // MID WATER
  30, // DEEP WATER
];

// Kris:
// Temporary for testing the speed of the translucency.  Pressing Ctrl+L in turn based
// input will toggle this flag.  When clear, the translucency checking is turned off to
// increase the speed of the game.
let gfCalcTranslucency: BOOLEAN = FALSE;

let gsFullTileDirections: INT16[] /* [MAX_FULLTILE_DIRECTIONS] */ = [
  -1,
  -WORLD_COLS - 1,
  -WORLD_COLS,
];

// Palette ranges
let guiNumPaletteSubRanges: UINT32;
let guipPaletteSubRanges: Pointer<PaletteSubRangeType> = NULL;
// Palette replacements
let guiNumReplacements: UINT32;
let guipPaletteReplacements: Pointer<PaletteReplacementType> = NULL;

let gfGetNewPathThroughPeople: BOOLEAN = FALSE;

function HandleVehicleMovementSound(pSoldier: Pointer<SOLDIERTYPE>, fOn: BOOLEAN): void {
  let pVehicle: Pointer<VEHICLETYPE> = addressof(pVehicleList[pSoldier.value.bVehicleID]);

  if (fOn) {
    if (pVehicle.value.iMovementSoundID == NO_SAMPLE) {
      pVehicle.value.iMovementSoundID = PlayJA2Sample(pVehicle.value.iMoveSound, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
    }
  } else {
    if (pVehicle.value.iMovementSoundID != NO_SAMPLE) {
      SoundStop(pVehicle.value.iMovementSoundID);
      pVehicle.value.iMovementSoundID = NO_SAMPLE;
    }
  }
}

function AdjustNoAPToFinishMove(pSoldier: Pointer<SOLDIERTYPE>, fSet: BOOLEAN): void {
  if (pSoldier.value.ubBodyType == Enum194.CROW) {
    return;
  }

  // Check if we are a vehicle first....
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    // Turn off sound effects....
    if (fSet) {
      HandleVehicleMovementSound(pSoldier, FALSE);
    }
  }

  // Turn off sound effects....
  if (fSet) {
    // Position light....
    // SetCheckSoldierLightFlag( pSoldier );
  } else {
    // DeleteSoldierLight( pSoldier );
  }

  pSoldier.value.fNoAPToFinishMove = fSet;

  if (!fSet) {
    // return reason to default value
    pSoldier.value.ubReasonCantFinishMove = Enum263.REASON_STOPPED_NO_APS;
  }
}

function HandleCrowShadowVisibility(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier.value.ubBodyType == Enum194.CROW) {
    if (pSoldier.value.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.value.pAniTile != NULL) {
        if (pSoldier.value.bLastRenderVisibleValue != -1) {
          HideAniTile(pSoldier.value.pAniTile, FALSE);
        } else {
          HideAniTile(pSoldier.value.pAniTile, TRUE);
        }
      }
    }
  }
}

function HandleCrowShadowNewGridNo(pSoldier: Pointer<SOLDIERTYPE>): void {
  let AniParams: ANITILE_PARAMS;

  memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));

  if (pSoldier.value.ubBodyType == Enum194.CROW) {
    if (pSoldier.value.pAniTile != NULL) {
      DeleteAniTile(pSoldier.value.pAniTile);
      pSoldier.value.pAniTile = NULL;
    }

    if (pSoldier.value.sGridNo != NOWHERE) {
      if (pSoldier.value.usAnimState == Enum193.CROW_FLY) {
        AniParams.sGridNo = pSoldier.value.sGridNo;
        AniParams.ubLevelID = ANI_SHADOW_LEVEL;
        AniParams.sDelay = pSoldier.value.sAniDelay;
        AniParams.sStartFrame = 0;
        AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_LOOPING | ANITILE_USE_DIRECTION_FOR_START_FRAME;
        AniParams.sX = pSoldier.value.sX;
        AniParams.sY = pSoldier.value.sY;
        AniParams.sZ = 0;
        strcpy(AniParams.zCachedFile, "TILECACHE\\FLY_SHDW.STI");

        AniParams.uiUserData3 = pSoldier.value.bDirection;

        pSoldier.value.pAniTile = CreateAnimationTile(addressof(AniParams));

        HandleCrowShadowVisibility(pSoldier);
      }
    }
  }
}

function HandleCrowShadowRemoveGridNo(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier.value.ubBodyType == Enum194.CROW) {
    if (pSoldier.value.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.value.pAniTile != NULL) {
        DeleteAniTile(pSoldier.value.pAniTile);
        pSoldier.value.pAniTile = NULL;
      }
    }
  }
}

function HandleCrowShadowNewDirection(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier.value.ubBodyType == Enum194.CROW) {
    if (pSoldier.value.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.value.pAniTile != NULL) {
        pSoldier.value.pAniTile.value.uiUserData3 = pSoldier.value.bDirection;
      }
    }
  }
}

function HandleCrowShadowNewPosition(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier.value.ubBodyType == Enum194.CROW) {
    if (pSoldier.value.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.value.pAniTile != NULL) {
        pSoldier.value.pAniTile.value.sRelativeX = pSoldier.value.sX;
        pSoldier.value.pAniTile.value.sRelativeY = pSoldier.value.sY;
      }
    }
  }
}

function CalcActionPoints(pSold: Pointer<SOLDIERTYPE>): INT8 {
  let ubPoints: UINT8;
  let ubMaxAPs: UINT8;
  let bBandage: INT8;

  // dead guys don't get any APs (they shouldn't be here asking for them!)
  if (!pSold.value.bLife)
    return 0;

  // people with sleep dart drug who have collapsed get no APs
  if ((pSold.value.bSleepDrugCounter > 0) && pSold.value.bCollapsed)
    return 0;

  // Calculate merc's action points at 100% capability (range is 10 - 25)
  // round fractions of .5 up (that's why the +20 before the division!
  ubPoints = 5 + (((10 * EffectiveExpLevel(pSold) + 3 * EffectiveAgility(pSold) + 2 * pSold.value.bLifeMax + 2 * EffectiveDexterity(pSold)) + 20) / 40);

  // if (GameOption[INCREASEDAP] % 2 == 1)
  // points += AP_INCREASE;

  // Calculate bandage
  bBandage = pSold.value.bLifeMax - pSold.value.bLife - pSold.value.bBleeding;

  // If injured, reduce action points accordingly (by up to 2/3rds)
  if (pSold.value.bLife < pSold.value.bLifeMax) {
    ubPoints -= (2 * ubPoints * (pSold.value.bLifeMax - pSold.value.bLife + (bBandage / 2))) / (3 * pSold.value.bLifeMax);
  }

  // If tired, reduce action points accordingly (by up to 1/2)
  if (pSold.value.bBreath < 100)
    ubPoints -= (ubPoints * (100 - pSold.value.bBreath)) / 200;

  if (pSold.value.sWeightCarriedAtTurnStart > 100) {
    ubPoints = ((ubPoints) * 100 / pSold.value.sWeightCarriedAtTurnStart);
  }

  // If resulting APs are below our permitted minimum, raise them to it!
  if (ubPoints < AP_MINIMUM)
    ubPoints = AP_MINIMUM;

  // make sure action points doesn't exceed the permitted maximum
  ubMaxAPs = gubMaxActionPoints[pSold.value.ubBodyType];

  // if (GameOption[INCREASEDAP] % 2 == 1)
  // maxAPs += AP_INCREASE;

  // If resulting APs are below our permitted minimum, raise them to it!
  if (ubPoints > ubMaxAPs)
    ubPoints = ubMaxAPs;

  if (pSold.value.ubBodyType == Enum194.BLOODCAT) {
    // use same as young monsters
    ubPoints = (ubPoints * AP_YOUNG_MONST_FACTOR) / 10;
  } else if (pSold.value.uiStatusFlags & SOLDIER_MONSTER) {
    // young monsters get extra APs
    if (pSold.value.ubBodyType == Enum194.YAF_MONSTER || pSold.value.ubBodyType == Enum194.YAM_MONSTER || pSold.value.ubBodyType == Enum194.INFANT_MONSTER) {
      ubPoints = (ubPoints * AP_YOUNG_MONST_FACTOR) / 10;
    }

    // if frenzied, female monsters get more APs! (for young females, cumulative!)
    if (pSold.value.bFrenzied) {
      ubPoints = (ubPoints * AP_MONST_FRENZY_FACTOR) / 10;
    }
  }

  // adjust APs for phobia situations
  if (pSold.value.ubProfile != NO_PROFILE) {
    if ((gMercProfiles[pSold.value.ubProfile].bPersonalityTrait == Enum270.CLAUSTROPHOBIC) && (gbWorldSectorZ > 0)) {
      ubPoints = (ubPoints * AP_CLAUSTROPHOBE) / 10;
    } else if ((gMercProfiles[pSold.value.ubProfile].bPersonalityTrait == Enum270.FEAR_OF_INSECTS) && (MercSeesCreature(pSold))) {
      ubPoints = (ubPoints * AP_AFRAID_OF_INSECTS) / 10;
    }
  }

  // Adjusat APs due to drugs...
  HandleAPEffectDueToDrugs(pSold, addressof(ubPoints));

  // If we are a vehicle, adjust APS...
  if (pSold.value.uiStatusFlags & SOLDIER_VEHICLE) {
    AdjustVehicleAPs(pSold, addressof(ubPoints));
  }

  // if we are in boxing mode, adjust APs... THIS MUST BE LAST!
  if (gTacticalStatus.bBoxingState == Enum247.BOXING || gTacticalStatus.bBoxingState == Enum247.PRE_BOXING) {
    ubPoints /= 2;
  }

  return ubPoints;
}

function CalcNewActionPoints(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (gTacticalStatus.bBoxingState == Enum247.BOXING || gTacticalStatus.bBoxingState == Enum247.PRE_BOXING) {
    // if we are in boxing mode, carry 1/2 as many points
    if (pSoldier.value.bActionPoints > MAX_AP_CARRIED / 2) {
      pSoldier.value.bActionPoints = MAX_AP_CARRIED / 2;
    }
  } else {
    if (pSoldier.value.bActionPoints > MAX_AP_CARRIED) {
      pSoldier.value.bActionPoints = MAX_AP_CARRIED;
    }
  }

  pSoldier.value.bActionPoints += CalcActionPoints(pSoldier);

  // Don't max out if we are drugged....
  if (!GetDrugEffect(pSoldier, DRUG_TYPE_ADRENALINE)) {
    pSoldier.value.bActionPoints = __min(pSoldier.value.bActionPoints, gubMaxActionPoints[pSoldier.value.ubBodyType]);
  }

  pSoldier.value.bInitialActionPoints = pSoldier.value.bActionPoints;
}

function DoNinjaAttack(pSoldier: Pointer<SOLDIERTYPE>): void {
  // UINT32						uiMercFlags;
  let usSoldierIndex: UINT16;
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let ubTDirection: UINT8;
  let ubTargetStance: UINT8;

  usSoldierIndex = WhoIsThere2(pSoldier.value.sTargetGridNo, pSoldier.value.bLevel);
  if (usSoldierIndex != NOBODY) {
    GetSoldier(addressof(pTSoldier), usSoldierIndex);

    // Look at stance of target
    ubTargetStance = gAnimControl[pTSoldier.value.usAnimState].ubEndHeight;

    // Get his life...if < certain value, do finish!
    if ((pTSoldier.value.bLife <= 30 || pTSoldier.value.bBreath <= 30) && ubTargetStance != ANIM_PRONE) {
      // Do finish!
      ChangeSoldierState(pSoldier, Enum193.NINJA_SPINKICK, 0, FALSE);
    } else {
      if (ubTargetStance != ANIM_PRONE) {
        if (Random(2) == 0) {
          ChangeSoldierState(pSoldier, Enum193.NINJA_LOWKICK, 0, FALSE);
        } else {
          ChangeSoldierState(pSoldier, Enum193.NINJA_PUNCH, 0, FALSE);
        }

        // CHECK IF HE CAN SEE US, IF SO CHANGE DIRECTION
        if (pTSoldier.value.bOppList[pSoldier.value.ubID] == 0 && pTSoldier.value.bTeam != pSoldier.value.bTeam) {
          if (!(pTSoldier.value.uiStatusFlags & (SOLDIER_MONSTER | SOLDIER_ANIMAL | SOLDIER_VEHICLE))) {
            ubTDirection = GetDirectionFromGridNo(pSoldier.value.sGridNo, pTSoldier);
            SendSoldierSetDesiredDirectionEvent(pTSoldier, ubTDirection);
          }
        }
      } else {
        // CHECK OUR STANCE
        if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_CROUCH) {
          // SET DESIRED STANCE AND SET PENDING ANIMATION
          SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
          pSoldier.value.usPendingAnimation = Enum193.PUNCH_LOW;
        } else {
          // USE crouched one
          // NEED TO CHANGE STANCE IF NOT CROUCHD!
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH_LOW, 0, FALSE);
        }
      }
    }
  }

  if (pSoldier.value.ubProfile == 33) {
    let uiSoundID: UINT32;
    let spParms: SOUNDPARMS;
    let iFaceIndex: INT32;

    // Play sound!
    memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

    spParms.uiSpeed = RATE_11025;
    spParms.uiVolume = CalculateSpeechVolume(HIGHVOLUME);

    // If we are an enemy.....reduce due to volume
    if (pSoldier.value.bTeam != gbPlayerNum) {
      spParms.uiVolume = SoundVolume(spParms.uiVolume, pSoldier.value.sGridNo);
    }
    spParms.uiLoop = 1;
    spParms.uiPan = SoundDir(pSoldier.value.sGridNo);
    spParms.uiPriority = GROUP_PLAYER;

    if (pSoldier.value.usAnimState == Enum193.NINJA_SPINKICK) {
      uiSoundID = SoundPlay("BATTLESNDS\\033_CHOP2.WAV", addressof(spParms));
    } else {
      if (Random(2) == 0) {
        uiSoundID = SoundPlay("BATTLESNDS\\033_CHOP3.WAV", addressof(spParms));
      } else {
        uiSoundID = SoundPlay("BATTLESNDS\\033_CHOP1.WAV", addressof(spParms));
      }
    }

    if (uiSoundID != SOUND_ERROR) {
      pSoldier.value.uiBattleSoundID = uiSoundID;

      if (pSoldier.value.ubProfile != NO_PROFILE) {
        // Get soldier's face ID
        iFaceIndex = pSoldier.value.iFaceIndex;

        // Check face index
        if (iFaceIndex != -1) {
          ExternSetFaceTalking(iFaceIndex, uiSoundID);
        }
      }
    }
  }
}

function CreateSoldierCommon(ubBodyType: UINT8, pSoldier: Pointer<SOLDIERTYPE>, usSoldierID: UINT16, usState: UINT16): BOOLEAN {
  let fSuccess: BOOLEAN = FALSE;
  let iCounter: INT32 = 0;

  // if we are loading a saved game, we DO NOT want to reset the opplist, look for enemies, or say a dying commnet
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Set initial values for opplist!
    InitSoldierOppList(pSoldier);
    HandleSight(pSoldier, SIGHT_LOOK);

    // Set some quote flags
    if (pSoldier.value.bLife >= OKLIFE) {
      pSoldier.value.fDyingComment = FALSE;
    } else {
      pSoldier.value.fDyingComment = TRUE;
    }
  }

  // ATE: Reset some timer flags...
  pSoldier.value.uiTimeSameBattleSndDone = 0;
  // ATE: Reset every time.....
  pSoldier.value.fSoldierWasMoving = TRUE;
  pSoldier.value.iTuringSoundID = NO_SAMPLE;
  pSoldier.value.uiTimeSinceLastBleedGrunt = 0;

  if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
    pSoldier.value.iPositionSndID = NewPositionSnd(NOWHERE, POSITION_SOUND_FROM_SOLDIER, pSoldier, Enum330.QUEEN_AMBIENT_NOISE);
  }

  // ANYTHING AFTER HERE CAN FAIL
  do {
    if (usSoldierID <= gTacticalStatus.Team[OUR_TEAM].bLastID) {
      pSoldier.value.pKeyRing = MemAlloc(NUM_KEYS * sizeof(KEY_ON_RING));
      memset(pSoldier.value.pKeyRing, 0, NUM_KEYS * sizeof(KEY_ON_RING));

      for (iCounter = 0; iCounter < NUM_KEYS; iCounter++) {
        pSoldier.value.pKeyRing[iCounter].ubKeyID = INVALID_KEY_NUMBER;
      }
    } else {
      pSoldier.value.pKeyRing = NULL;
    }
    // Create frame cache
    if (InitAnimationCache(usSoldierID, addressof(pSoldier.value.AnimCache)) == FALSE) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Soldier: Failed animation cache creation"));
      break;
    }

    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      // Init new soldier state
      // OFFSET FIRST ANIMATION FRAME FOR NEW MERCS
      if (usState != Enum193.STANDING) {
        EVENT_InitNewSoldierAnim(pSoldier, usState, 0, TRUE);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, usState, Random(10), TRUE);
      }
    } else {
      /// if we don't have a world loaded, and are in a bad anim, goto standing.
      // bad anims are: HOPFENCE,
      // CLIMBDOWNROOF, FALLFORWARD_ROOF,FALLOFF, CLIMBUPROOF
      if (!gfWorldLoaded && (usState == Enum193.HOPFENCE || usState == Enum193.CLIMBDOWNROOF || usState == Enum193.FALLFORWARD_ROOF || usState == Enum193.FALLOFF || usState == Enum193.CLIMBUPROOF)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, TRUE);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, usState, pSoldier.value.usAniCode, TRUE);
      }
    }

    // if ( pSoldier->pBackGround != NULL )
    //	MemFree( pSoldier->pBackGround );

    // INIT ANIMATION DATA
    // if((pSoldier->pBackGround=MemAlloc(SOLDIER_UNBLIT_SIZE))==NULL)
    //{
    //	DebugMsg( TOPIC_JA2, DBG_LEVEL_0, String( "Soldier: Failed unblit memory allocation" ) );
    //	break;
    //}
    // memset(pSoldier->pBackGround, 0, SOLDIER_UNBLIT_SIZE);

    // if((pSoldier->pZBackground=MemAlloc(SOLDIER_UNBLIT_SIZE))==NULL)
    //{
    //	DebugMsg( TOPIC_JA2, DBG_LEVEL_0, String( "Soldier: Failed unblit memory allocation" ) );
    //	break;
    //}
    // memset(pSoldier->pZBackground, 0, SOLDIER_UNBLIT_SIZE);

    // Init palettes
    if (CreateSoldierPalettes(pSoldier) == FALSE) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Soldier: Failed in creating soldier palettes"));
      break;
    }

    fSuccess = TRUE;
  } while (FALSE);

  if (!fSuccess) {
    DeleteSoldier((pSoldier));
  }

  return fSuccess;
}

function DeleteSoldier(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let cnt: UINT32;
  let iGridNo: INT32;
  let bDir: INT8;
  let fRet: BOOLEAN;

  if (pSoldier != NULL) {
    // if(pSoldier->pBackGround!=NULL)
    // MemFree(pSoldier->pBackGround);

    // if(pSoldier->pZBackground!=NULL)
    // MemFree(pSoldier->pZBackground);

    if (pSoldier.value.sGridNo != NOWHERE) {
      // Remove adjacency records
      for (bDir = 0; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir++) {
        iGridNo = pSoldier.value.sGridNo + DirIncrementer[bDir];
        if (iGridNo >= 0 && iGridNo < WORLD_MAX) {
          gpWorldLevelData[iGridNo].ubAdjacentSoldierCnt--;
        }
      }
    }

    // Delete key ring
    if (pSoldier.value.pKeyRing) {
      MemFree(pSoldier.value.pKeyRing);
      pSoldier.value.pKeyRing = NULL;
    }

    // Delete faces
    DeleteSoldierFace(pSoldier);

    // FREE PALETTES
    if (pSoldier.value.p8BPPPalette != NULL) {
      MemFree(pSoldier.value.p8BPPPalette);
      pSoldier.value.p8BPPPalette = NULL;
    }

    if (pSoldier.value.p16BPPPalette != NULL) {
      MemFree(pSoldier.value.p16BPPPalette);
      pSoldier.value.p16BPPPalette = NULL;
    }

    for (cnt = 0; cnt < NUM_SOLDIER_SHADES; cnt++) {
      if (pSoldier.value.pShades[cnt] != NULL) {
        MemFree(pSoldier.value.pShades[cnt]);
        pSoldier.value.pShades[cnt] = NULL;
      }
    }
    for (cnt = 0; cnt < NUM_SOLDIER_EFFECTSHADES; cnt++) {
      if (pSoldier.value.pEffectShades[cnt] != NULL) {
        MemFree(pSoldier.value.pEffectShades[cnt]);
        pSoldier.value.pEffectShades[cnt] = NULL;
      }
    }

    // Delete glows
    for (cnt = 0; cnt < 20; cnt++) {
      if (pSoldier.value.pGlowShades[cnt] != NULL) {
        MemFree(pSoldier.value.pGlowShades[cnt]);
        pSoldier.value.pGlowShades[cnt] = NULL;
      }
    }

    if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
      DeletePositionSnd(pSoldier.value.iPositionSndID);
    }

    // Free any animations we may have locked...
    UnLoadCachedAnimationSurfaces(pSoldier.value.ubID, addressof(pSoldier.value.AnimCache));

    // Free Animation cache
    DeleteAnimationCache(pSoldier.value.ubID, addressof(pSoldier.value.AnimCache));

    // Soldier is not active
    pSoldier.value.bActive = FALSE;

    // Remove light
    DeleteSoldierLight(pSoldier);

    // Remove reseved movement value
    UnMarkMovementReserved(pSoldier);
  }

  // REMOVE SOLDIER FROM SLOT!
  fRet = RemoveMercSlot(pSoldier);

  if (!fRet) {
    RemoveAwaySlot(pSoldier);
  }

  return TRUE;
}

function CreateSoldierLight(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (pSoldier.value.bTeam != gbPlayerNum) {
    return FALSE;
  }

  // DO ONLY IF WE'RE AT A GOOD LEVEL
  if (pSoldier.value.iLight == -1) {
    // ATE: Check for goggles in headpos....
    if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.NIGHTGOGGLES || pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.NIGHTGOGGLES) {
      if ((pSoldier.value.iLight = LightSpriteCreate("Light3", 0)) == (-1)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Soldier: Failed loading light"));
        return FALSE;
      } else {
        LightSprites[pSoldier.value.iLight].uiFlags |= MERC_LIGHT;
      }
    } else if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.UVGOGGLES || pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.UVGOGGLES) {
      if ((pSoldier.value.iLight = LightSpriteCreate("Light4", 0)) == (-1)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Soldier: Failed loading light"));
        return FALSE;
      } else {
        LightSprites[pSoldier.value.iLight].uiFlags |= MERC_LIGHT;
      }
    } else {
      if ((pSoldier.value.iLight = LightSpriteCreate("Light2", 0)) == (-1)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Soldier: Failed loading light"));
        return FALSE;
      } else {
        LightSprites[pSoldier.value.iLight].uiFlags |= MERC_LIGHT;
      }
    }

    if (pSoldier.value.bLevel != 0) {
      LightSpriteRoofStatus(pSoldier.value.iLight, TRUE);
    }
  }

  return TRUE;
}

function ReCreateSoldierLight(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (pSoldier.value.bTeam != gbPlayerNum) {
    return FALSE;
  }

  if (!pSoldier.value.bActive) {
    return FALSE;
  }

  if (!pSoldier.value.bInSector) {
    return FALSE;
  }

  // Delete Light!
  DeleteSoldierLight(pSoldier);

  if (pSoldier.value.iLight == -1) {
    CreateSoldierLight(pSoldier);
  }

  return TRUE;
}

function ReCreateSelectedSoldierLight(): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (gusSelectedSoldier == NO_SOLDIER) {
    return FALSE;
  }

  pSoldier = MercPtrs[gusSelectedSoldier];

  return ReCreateSoldierLight(pSoldier);
}

function DeleteSoldierLight(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (pSoldier.value.iLight != (-1)) {
    LightSpriteDestroy(pSoldier.value.iLight);
    pSoldier.value.iLight = -1;
  }

  return TRUE;
}

// FUNCTIONS CALLED BY EVENT PUMP
/////////////////////////////////

function ChangeSoldierState(pSoldier: Pointer<SOLDIERTYPE>, usNewState: UINT16, usStartingAniCode: UINT16, fForce: BOOLEAN): BOOLEAN {
  let SChangeState: EV_S_CHANGESTATE;

  // Send message that we have changed states
  SChangeState.usNewState = usNewState;
  SChangeState.usSoldierID = pSoldier.value.ubID;
  SChangeState.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;
  SChangeState.usStartingAniCode = usStartingAniCode;
  SChangeState.sXPos = pSoldier.value.sX;
  SChangeState.sYPos = pSoldier.value.sY;
  SChangeState.fForce = fForce;
  SChangeState.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  // AddGameEvent( S_CHANGESTATE, 0, &SChangeState );
  EVENT_InitNewSoldierAnim(pSoldier, SChangeState.usNewState, SChangeState.usStartingAniCode, SChangeState.fForce);

  return TRUE;
}

// This function reevaluates the stance if the guy sees us!
function ReevaluateEnemyStance(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16): BOOLEAN {
  let cnt: INT32;
  let iClosestEnemy: INT32 = NOBODY;
  let sTargetXPos: INT16;
  let sTargetYPos: INT16;
  let fReturnVal: BOOLEAN = FALSE;
  let sDist: INT16;
  let sClosestDist: INT16 = 10000;

  // make the chosen one not turn to face us
  if (OK_ENEMY_MERC(pSoldier) && pSoldier.value.ubID != gTacticalStatus.ubTheChosenOne && gAnimControl[usAnimState].ubEndHeight == ANIM_STAND && !(pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL)) {
    if (pSoldier.value.fTurningFromPronePosition == TURNING_FROM_PRONE_OFF) {
      // If we are a queen and see enemies, goto ready
      if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
        if (gAnimControl[usAnimState].uiFlags & (ANIM_BREATH)) {
          if (pSoldier.value.bOppCnt > 0) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_INTO_READY, 0, TRUE);
            return TRUE;
          }
        }
      }

      // ATE: Don't do this if we're not a merc.....
      if (!IS_MERC_BODY_TYPE(pSoldier)) {
        return FALSE;
      }

      if (gAnimControl[usAnimState].uiFlags & (ANIM_MERCIDLE | ANIM_BREATH)) {
        if (pSoldier.value.bOppCnt > 0) {
          // Pick a guy this buddy sees and turn towards them!
          for (cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++) {
            if (pSoldier.value.bOppList[cnt] == SEEN_CURRENTLY) {
              sDist = PythSpacesAway(pSoldier.value.sGridNo, MercPtrs[cnt].value.sGridNo);
              if (sDist < sClosestDist) {
                sClosestDist = sDist;
                iClosestEnemy = cnt;
              }
            }
          }

          if (iClosestEnemy != NOBODY) {
            // Change to fire ready animation
            ConvertGridNoToXY(MercPtrs[iClosestEnemy].value.sGridNo, addressof(sTargetXPos), addressof(sTargetYPos));

            pSoldier.value.fDontChargeReadyAPs = TRUE;

            // Ready weapon
            fReturnVal = SoldierReadyWeapon(pSoldier, sTargetXPos, sTargetYPos, FALSE);

            return fReturnVal;
          }
        }
      }
    }
  }
  return FALSE;
}

function CheckForFreeupFromHit(pSoldier: Pointer<SOLDIERTYPE>, uiOldAnimFlags: UINT32, uiNewAnimFlags: UINT32, usOldAniState: UINT16, usNewState: UINT16): void {
  // THIS COULD POTENTIALLY CALL EVENT_INITNEWAnim() if the GUY was SUPPRESSED
  // CHECK IF THE OLD ANIMATION WAS A HIT START THAT WAS NOT FOLLOWED BY A HIT FINISH
  // IF SO, RELEASE ATTACKER FROM ATTACKING

  // If old and new animations are the same, do nothing!
  if (usOldAniState == Enum193.QUEEN_HIT && usNewState == Enum193.QUEEN_HIT) {
    return;
  }

  if (usOldAniState != usNewState && (uiOldAnimFlags & ANIM_HITSTART) && !(uiNewAnimFlags & ANIM_HITFINISH) && !(uiNewAnimFlags & ANIM_IGNOREHITFINISH) && !(pSoldier.value.uiStatusFlags & SOLDIER_TURNINGFROMHIT)) {
    // Release attacker
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Releasesoldierattacker, normal hit animation ended NEW: %s ( %d ) OLD: %s ( %d )", gAnimControl[usNewState].zAnimStr, usNewState, gAnimControl[usOldAniState].zAnimStr, pSoldier.value.usOldAniState));
    ReleaseSoldiersAttacker(pSoldier);

    // FREEUP GETTING HIT FLAG
    pSoldier.value.fGettingHit = FALSE;

    // ATE: if our guy, have 10% change of say damn, if still conscious...
    if (pSoldier.value.bTeam == gbPlayerNum && pSoldier.value.bLife >= OKLIFE) {
      if (Random(10) == 0) {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_CURSE1));
      }
    }
  }

  // CHECK IF WE HAVE FINSIHED A HIT WHILE DOWN
  // OBLY DO THIS IF 1 ) We are dead already or 2 ) We are alive still
  if ((uiOldAnimFlags & ANIM_HITWHENDOWN) && ((pSoldier.value.uiStatusFlags & SOLDIER_DEAD) || pSoldier.value.bLife != 0)) {
    // Release attacker
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Releasesoldierattacker, animation of kill on the ground ended"));
    ReleaseSoldiersAttacker(pSoldier);

    // FREEUP GETTING HIT FLAG
    pSoldier.value.fGettingHit = FALSE;

    if (pSoldier.value.bLife == 0) {
      // ATE: Set previous attacker's value!
      // This is so that the killer can say their killed quote....
      pSoldier.value.ubAttackerID = pSoldier.value.ubPreviousAttackerID;
    }
  }
}

// THIS IS CALLED FROM AN EVENT ( S_CHANGESTATE )!
function EVENT_InitNewSoldierAnim(pSoldier: Pointer<SOLDIERTYPE>, usNewState: UINT16, usStartingAniCode: UINT16, fForce: BOOLEAN): BOOLEAN {
  let usNewGridNo: UINT16 = 0;
  let sAPCost: INT16 = 0;
  let sBPCost: INT16 = 0;
  let uiOldAnimFlags: UINT32;
  let uiNewAnimFlags: UINT32;
  let usSubState: UINT16;
  let usItem: UINT16;
  let fTryingToRestart: BOOLEAN = FALSE;

  CHECKF(usNewState < Enum193.NUMANIMATIONSTATES);

  ///////////////////////////////////////////////////////////////////////
  //			DO SOME CHECKS ON OUR NEW ANIMATION!
  /////////////////////////////////////////////////////////////////////

  // If we are NOT loading a game, continue normally
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // CHECK IF WE ARE TRYING TO INTURRUPT A SCRIPT WHICH WE DO NOT WANT INTERRUPTED!
    if (pSoldier.value.fInNonintAnim) {
      return FALSE;
    }

    if (pSoldier.value.fRTInNonintAnim) {
      if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
        return FALSE;
      } else {
        pSoldier.value.fRTInNonintAnim = FALSE;
      }
    }

    // Check if we can restart this animation if it's the same as our current!
    if (usNewState == pSoldier.value.usAnimState) {
      if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_NORESTART) && !fForce) {
        fTryingToRestart = TRUE;
      }
    }

    // Check state, if we are not at the same height, set this ani as the pending one and
    // change stance accordingly
    // ATE: ONLY IF WE ARE STARTING AT START OF ANIMATION!
    if (usStartingAniCode == 0) {
      if (gAnimControl[usNewState].ubHeight != gAnimControl[pSoldier.value.usAnimState].ubEndHeight && !(gAnimControl[usNewState].uiFlags & (ANIM_STANCECHANGEANIM | ANIM_IGNORE_AUTOSTANCE))) {
        // Check if we are going from crouched height to prone height, and adjust fast turning accordingly
        // Make guy turn while crouched THEN go into prone
        if ((gAnimControl[usNewState].ubEndHeight == ANIM_PRONE && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_CROUCH) && !(gTacticalStatus.uiFlags & INCOMBAT)) {
          pSoldier.value.fTurningUntilDone = TRUE;
          pSoldier.value.ubPendingStanceChange = gAnimControl[usNewState].ubEndHeight;
          pSoldier.value.usPendingAnimation = usNewState;
          return TRUE;
        }
        // Check if we are in realtime and we are going from stand to crouch
        else if (gAnimControl[usNewState].ubEndHeight == ANIM_CROUCH && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND && (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_MOVING) && ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
          pSoldier.value.ubDesiredHeight = gAnimControl[usNewState].ubEndHeight;
          // Continue with this course of action IE: Do animation and skip from stand to crouch
        }
        // Check if we are in realtime and we are going from crouch to stand
        else if (gAnimControl[usNewState].ubEndHeight == ANIM_STAND && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_CROUCH && (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_MOVING) && ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) && pSoldier.value.usAnimState != Enum193.HELIDROP) {
          pSoldier.value.ubDesiredHeight = gAnimControl[usNewState].ubEndHeight;
          // Continue with this course of action IE: Do animation and skip from stand to crouch
        } else {
          // ONLY DO FOR EVERYONE BUT PLANNING GUYS
          if (pSoldier.value.ubID < MAX_NUM_SOLDIERS) {
            // Set our next moving animation to be pending, after
            pSoldier.value.usPendingAnimation = usNewState;
            // Set new state to be animation to move to new stance
            SendChangeSoldierStanceEvent(pSoldier, gAnimControl[usNewState].ubHeight);
            return TRUE;
          }
        }
      }
    }

    if (usNewState == Enum193.ADJACENT_GET_ITEM) {
      if (pSoldier.value.ubPendingDirection != NO_PENDING_DIRECTION) {
        EVENT_InternalSetSoldierDesiredDirection(pSoldier, pSoldier.value.ubPendingDirection, FALSE, pSoldier.value.usAnimState);
        pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
        pSoldier.value.usPendingAnimation = Enum193.ADJACENT_GET_ITEM;
        pSoldier.value.fTurningUntilDone = TRUE;
        SoldierGotoStationaryStance(pSoldier);
        return TRUE;
      }
    }

    if (usNewState == Enum193.CLIMBUPROOF) {
      if (pSoldier.value.ubPendingDirection != NO_PENDING_DIRECTION) {
        EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.value.ubPendingDirection);
        pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
        pSoldier.value.usPendingAnimation = Enum193.CLIMBUPROOF;
        pSoldier.value.fTurningUntilDone = TRUE;
        SoldierGotoStationaryStance(pSoldier);
        return TRUE;
      }
    }

    if (usNewState == Enum193.CLIMBDOWNROOF) {
      if (pSoldier.value.ubPendingDirection != NO_PENDING_DIRECTION) {
        EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.value.ubPendingDirection);
        pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
        pSoldier.value.usPendingAnimation = Enum193.CLIMBDOWNROOF;
        pSoldier.value.fTurningFromPronePosition = FALSE;
        pSoldier.value.fTurningUntilDone = TRUE;
        SoldierGotoStationaryStance(pSoldier);
        return TRUE;
      }
    }

    // ATE: Don't raise/lower automatically if we are low on health,
    // as our gun looks lowered anyway....
    // if ( pSoldier->bLife > INJURED_CHANGE_THREASHOLD )
    {
      // Don't do some of this if we are a monster!
      // ATE: LOWER AIMATION IS GOOD, RAISE ONE HOWEVER MAY CAUSE PROBLEMS FOR AI....
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) && pSoldier.value.ubBodyType != Enum194.ROBOTNOWEAPON && pSoldier.value.bTeam == gbPlayerNum) {
        // If this animation is a raise_weapon animation
        if ((gAnimControl[usNewState].uiFlags & ANIM_RAISE_WEAPON) && !(gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_RAISE_WEAPON | ANIM_NOCHANGE_WEAPON))) {
          // We are told that we need to rasie weapon
          // Do so only if
          // 1) We have a rifle in hand...
          usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

          if (usItem != NOTHING && (Item[usItem].fFlags & ITEM_TWO_HANDED) && usItem != Enum225.ROCKET_LAUNCHER) {
            // Switch on height!
            switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
              case ANIM_STAND:

                // 2) OK, all's fine... lower weapon first....
                pSoldier.value.usPendingAnimation = usNewState;
                // Set new state to be animation to move to new stance
                usNewState = Enum193.RAISE_RIFLE;
            }
          }
        }

        // If this animation is a lower_weapon animation
        if ((gAnimControl[usNewState].uiFlags & ANIM_LOWER_WEAPON) && !(gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_LOWER_WEAPON | ANIM_NOCHANGE_WEAPON))) {
          // We are told that we need to rasie weapon
          // Do so only if
          // 1) We have a rifle in hand...
          usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

          if (usItem != NOTHING && (Item[usItem].fFlags & ITEM_TWO_HANDED) && usItem != Enum225.ROCKET_LAUNCHER) {
            // Switch on height!
            switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
              case ANIM_STAND:

                // 2) OK, all's fine... lower weapon first....
                pSoldier.value.usPendingAnimation = usNewState;
                // Set new state to be animation to move to new stance
                usNewState = Enum193.LOWER_RIFLE;
            }
          }
        }
      }
    }

    // Are we cowering and are tyring to move, getup first...
    if (gAnimControl[usNewState].uiFlags & ANIM_MOVING && pSoldier.value.usAnimState == Enum193.COWERING && gAnimControl[usNewState].ubEndHeight == ANIM_STAND) {
      pSoldier.value.usPendingAnimation = usNewState;
      // Set new state to be animation to move to new stance
      usNewState = Enum193.END_COWER;
    }

    // If we want to start swatting, put a pending animation
    if (pSoldier.value.usAnimState != Enum193.START_SWAT && usNewState == Enum193.SWATTING) {
      // Set new state to be animation to move to new stance
      usNewState = Enum193.START_SWAT;
    }

    if (pSoldier.value.usAnimState == Enum193.SWATTING && usNewState == Enum193.CROUCHING) {
      // Set new state to be animation to move to new stance
      usNewState = Enum193.END_SWAT;
    }

    if (pSoldier.value.usAnimState == Enum193.WALKING && usNewState == Enum193.STANDING && pSoldier.value.bLife < INJURED_CHANGE_THREASHOLD && pSoldier.value.ubBodyType <= Enum194.REGFEMALE && !MercInWater(pSoldier)) {
      // Set new state to be animation to move to new stance
      usNewState = Enum193.END_HURT_WALKING;
    }

    // Check if we are an enemy, and we are in an animation what should be overriden
    // by if he sees us or not.
    if (ReevaluateEnemyStance(pSoldier, usNewState)) {
      return TRUE;
    }

    // OK.......
    if (pSoldier.value.ubBodyType > Enum194.REGFEMALE) {
      if (pSoldier.value.bLife < INJURED_CHANGE_THREASHOLD) {
        if (usNewState == Enum193.READY_RIFLE_STAND) {
          //	pSoldier->usPendingAnimation2 = usNewState;
          //	usNewState = FROM_INJURED_TRANSITION;
        }
      }
    }

    // Alrighty, check if we should free buddy up!
    if (usNewState == Enum193.GIVING_AID) {
      UnSetUIBusy(pSoldier.value.ubID);
    }

    // SUBSTITUDE VARIOUS REG ANIMATIONS WITH ODD BODY TYPES
    if (SubstituteBodyTypeAnimation(pSoldier, usNewState, addressof(usSubState))) {
      usNewState = usSubState;
    }

    // CHECK IF WE CAN DO THIS ANIMATION!
    if (IsAnimationValidForBodyType(pSoldier, usNewState) == FALSE) {
      return FALSE;
    }

    // OK, make guy transition if a big merc...
    if (pSoldier.value.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE) {
      if (usNewState == Enum193.KNEEL_DOWN && pSoldier.value.usAnimState != Enum193.BIGMERC_CROUCH_TRANS_INTO) {
        let usItem: UINT16;

        // Do we have a rifle?
        usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

        if (usItem != NOTHING) {
          if (Item[usItem].usItemClass == IC_GUN && usItem != Enum225.ROCKET_LAUNCHER) {
            if ((Item[usItem].fFlags & ITEM_TWO_HANDED)) {
              usNewState = Enum193.BIGMERC_CROUCH_TRANS_INTO;
            }
          }
        }
      }

      if (usNewState == Enum193.KNEEL_UP && pSoldier.value.usAnimState != Enum193.BIGMERC_CROUCH_TRANS_OUTOF) {
        let usItem: UINT16;

        // Do we have a rifle?
        usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

        if (usItem != NOTHING) {
          if (Item[usItem].usItemClass == IC_GUN && usItem != Enum225.ROCKET_LAUNCHER) {
            if ((Item[usItem].fFlags & ITEM_TWO_HANDED)) {
              usNewState = Enum193.BIGMERC_CROUCH_TRANS_OUTOF;
            }
          }
        }
      }
    }

    // OK, if we have reverse set, do the side step!
    if (pSoldier.value.bReverse) {
      if (usNewState == Enum193.WALKING || usNewState == Enum193.RUNNING || usNewState == Enum193.SWATTING) {
        // CHECK FOR SIDEWAYS!
        if (pSoldier.value.bDirection == gPurpendicularDirection[pSoldier.value.bDirection][pSoldier.value.usPathingData[pSoldier.value.usPathIndex]]) {
          // We are perpendicular!
          usNewState = Enum193.SIDE_STEP;
        } else {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_CROUCH) {
            usNewState = Enum193.SWAT_BACKWARDS;
          } else {
            // Here, change to  opposite direction
            usNewState = Enum193.WALK_BACKWARDS;
          }
        }
      }
    }

    // ATE: Patch hole for breath collapse for roofs, fences
    if (usNewState == Enum193.CLIMBUPROOF || usNewState == Enum193.CLIMBDOWNROOF || usNewState == Enum193.HOPFENCE) {
      // Check for breath collapse if a given animation like
      if (CheckForBreathCollapse(pSoldier) || pSoldier.value.bCollapsed) {
        // UNset UI
        UnSetUIBusy(pSoldier.value.ubID);

        SoldierCollapse(pSoldier);

        pSoldier.value.bBreathCollapsed = FALSE;

        return FALSE;
      }
    }

    // If we are in water.....and trying to run, change to run
    if (pSoldier.value.bOverTerrainType == Enum315.LOW_WATER || pSoldier.value.bOverTerrainType == Enum315.MED_WATER) {
      // Check animation
      // Change to walking
      if (usNewState == Enum193.RUNNING) {
        usNewState = Enum193.WALKING;
      }
    }

    // Turn off anipause flag for any anim!
    pSoldier.value.uiStatusFlags &= (~SOLDIER_PAUSEANIMOVE);

    // Unset paused for no APs.....
    AdjustNoAPToFinishMove(pSoldier, FALSE);

    if (usNewState == Enum193.CRAWLING && pSoldier.value.usDontUpdateNewGridNoOnMoveAnimChange == 1) {
      if (pSoldier.value.fTurningFromPronePosition != TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE) {
        pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_START_UP_FROM_MOVE;
      }

      // ATE: IF we are starting to crawl, but have to getup to turn first......
      if (pSoldier.value.fTurningFromPronePosition == TURNING_FROM_PRONE_START_UP_FROM_MOVE) {
        usNewState = Enum193.PRONE_UP;
        pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE;
      }
    }

    // We are about to start moving
    // Handle buddy beginning to move...
    // check new gridno, etc
    // ATE: Added: Make check that old anim is not a moving one as well
    if (gAnimControl[usNewState].uiFlags & ANIM_MOVING && !(gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_MOVING) || (gAnimControl[usNewState].uiFlags & ANIM_MOVING && fForce)) {
      let fKeepMoving: BOOLEAN;

      if (usNewState == Enum193.CRAWLING && pSoldier.value.usDontUpdateNewGridNoOnMoveAnimChange == LOCKED_NO_NEWGRIDNO) {
        // Turn off lock once we are crawling once...
        pSoldier.value.usDontUpdateNewGridNoOnMoveAnimChange = 1;
      }

      // ATE: Additional check here if we have just been told to update animation ONLY, not goto gridno stuff...
      if (!pSoldier.value.usDontUpdateNewGridNoOnMoveAnimChange) {
        if (usNewState != Enum193.SWATTING) {
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Handling New gridNo for %d: Old %s, New %s", pSoldier.value.ubID, gAnimControl[pSoldier.value.usAnimState].zAnimStr, gAnimControl[usNewState].zAnimStr));

          if (!(gAnimControl[usNewState].uiFlags & ANIM_SPECIALMOVE)) {
            // Handle goto new tile...
            if (HandleGotoNewGridNo(pSoldier, addressof(fKeepMoving), TRUE, usNewState)) {
              if (!fKeepMoving) {
                return FALSE;
              }

              // Make sure desy = zeroed out...
              // pSoldier->fPastXDest = pSoldier->fPastYDest = FALSE;
            } else {
              if (pSoldier.value.bBreathCollapsed) {
                // UNset UI
                UnSetUIBusy(pSoldier.value.ubID);

                SoldierCollapse(pSoldier);

                pSoldier.value.bBreathCollapsed = FALSE;
              }
              return FALSE;
            }
          } else {
            // Change desired direction
            // Just change direction
            EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], FALSE, pSoldier.value.usAnimState);
          }

          // check for services
          ReceivingSoldierCancelServices(pSoldier);
          GivingSoldierCancelServices(pSoldier);

          // Check if we are a vehicle, and start playing noise sound....
          if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
            HandleVehicleMovementSound(pSoldier, TRUE);
          }
        }
      }
    } else {
      // Check for stopping movement noise...
      if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
        HandleVehicleMovementSound(pSoldier, FALSE);

        // If a vehicle, set hewight to 0
        SetSoldierHeight(pSoldier, (0));
      }
    }

    // Reset to false always.....
    // ( Unless locked )
    if (gAnimControl[usNewState].uiFlags & ANIM_MOVING) {
      if (pSoldier.value.usDontUpdateNewGridNoOnMoveAnimChange != LOCKED_NO_NEWGRIDNO) {
        pSoldier.value.usDontUpdateNewGridNoOnMoveAnimChange = FALSE;
      }
    }

    if (fTryingToRestart) {
      return FALSE;
    }
  }

  // ATE: If this is an AI guy.. unlock him!
  if (gTacticalStatus.fEnemySightingOnTheirTurn) {
    if (gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID == pSoldier.value.ubID) {
      pSoldier.value.fPauseAllAnimation = FALSE;
      gTacticalStatus.fEnemySightingOnTheirTurn = FALSE;
    }
  }

  ///////////////////////////////////////////////////////////////////////
  //			HERE DOWN - WE HAVE MADE A DESCISION!
  /////////////////////////////////////////////////////////////////////

  uiOldAnimFlags = gAnimControl[pSoldier.value.usAnimState].uiFlags;
  uiNewAnimFlags = gAnimControl[usNewState].uiFlags;

  usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(pSoldier.value.usPathingData[pSoldier.value.usPathIndex]));

  // CHECKING IF WE HAVE A HIT FINISH BUT NO DEATH IS DONE WITH A SPECIAL ANI CODE
  // IN THE HIT FINSIH ANI SCRIPTS

  // CHECKING IF WE HAVE FINISHED A DEATH ANIMATION IS DONE WITH A SPECIAL ANI CODE
  // IN THE DEATH SCRIPTS

  // CHECK IF THIS NEW STATE IS NON-INTERRUPTABLE
  // IF SO - SET NON-INT FLAG
  if (uiNewAnimFlags & ANIM_NONINTERRUPT) {
    pSoldier.value.fInNonintAnim = TRUE;
  }

  if (uiNewAnimFlags & ANIM_RT_NONINTERRUPT) {
    pSoldier.value.fRTInNonintAnim = TRUE;
  }

  // CHECK IF WE ARE NOT AIMING, IF NOT, RESET LAST TAGRET!
  if (!(gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_FIREREADY) && !(gAnimControl[usNewState].uiFlags & ANIM_FIREREADY)) {
    // ATE: Also check for the transition anims to not reset this
    // this should have used a flag but we're out of them....
    if (usNewState != Enum193.READY_RIFLE_STAND && usNewState != Enum193.READY_RIFLE_PRONE && usNewState != Enum193.READY_RIFLE_CROUCH && usNewState != Enum193.ROBOT_SHOOT) {
      pSoldier.value.sLastTarget = NOWHERE;
    }
  }

  // If a special move state, release np aps
  if ((gAnimControl[usNewState].uiFlags & ANIM_SPECIALMOVE)) {
    AdjustNoAPToFinishMove(pSoldier, FALSE);
  }

  if (gAnimControl[usNewState].uiFlags & ANIM_UPDATEMOVEMENTMODE) {
    if (pSoldier.value.bTeam == gbPlayerNum) {
      // pSoldier->usUIMovementMode =  GetMoveStateBasedOnStance( pSoldier, gAnimControl[ usNewState ].ubEndHeight );
    }
  }

  // ATE: If not a moving animation - turn off reverse....
  if (!(gAnimControl[usNewState].uiFlags & ANIM_MOVING)) {
    pSoldier.value.bReverse = FALSE;
  }

  // ONLY DO FOR EVERYONE BUT PLANNING GUYS
  if (pSoldier.value.ubID < MAX_NUM_SOLDIERS) {
    // Do special things based on new state
    switch (usNewState) {
      case Enum193.STANDING:

        // Update desired height
        pSoldier.value.ubDesiredHeight = ANIM_STAND;
        break;

      case Enum193.CROUCHING:

        // Update desired height
        pSoldier.value.ubDesiredHeight = ANIM_CROUCH;
        break;

      case Enum193.PRONE:

        // Update desired height
        pSoldier.value.ubDesiredHeight = ANIM_PRONE;
        break;

      case Enum193.READY_RIFLE_STAND:
      case Enum193.READY_RIFLE_PRONE:
      case Enum193.READY_RIFLE_CROUCH:
      case Enum193.READY_DUAL_STAND:
      case Enum193.READY_DUAL_CROUCH:
      case Enum193.READY_DUAL_PRONE:

        // OK, get points to ready weapon....
        if (!pSoldier.value.fDontChargeReadyAPs) {
          sAPCost = GetAPsToReadyWeapon(pSoldier, usNewState);
          DeductPoints(pSoldier, sAPCost, sBPCost);
        } else {
          pSoldier.value.fDontChargeReadyAPs = FALSE;
        }
        break;

      case Enum193.WALKING:

        pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
        pSoldier.value.ubPendingActionAnimCount = 0;
        break;

      case Enum193.SWATTING:

        pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
        pSoldier.value.ubPendingActionAnimCount = 0;
        break;

      case Enum193.CRAWLING:

        // Turn off flag...
        pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
        pSoldier.value.ubPendingActionAnimCount = 0;
        pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
        break;

      case Enum193.RUNNING:

        // Only if our previous is not running
        if (pSoldier.value.usAnimState != Enum193.RUNNING) {
          sAPCost = AP_START_RUN_COST;
          DeductPoints(pSoldier, sAPCost, sBPCost);
        }
        // Set pending action count to 0
        pSoldier.value.ubPendingActionAnimCount = 0;
        pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
        break;

      case Enum193.ADULTMONSTER_WALKING:
        pSoldier.value.ubPendingActionAnimCount = 0;
        break;

      case Enum193.ROBOT_WALK:
        pSoldier.value.ubPendingActionAnimCount = 0;
        break;

      case Enum193.KNEEL_UP:
      case Enum193.KNEEL_DOWN:
      case Enum193.BIGMERC_CROUCH_TRANS_INTO:
      case Enum193.BIGMERC_CROUCH_TRANS_OUTOF:

        if (!pSoldier.value.fDontChargeAPsForStanceChange) {
          DeductPoints(pSoldier, AP_CROUCH, BP_CROUCH);
        }
        pSoldier.value.fDontChargeAPsForStanceChange = FALSE;
        break;

      case Enum193.PRONE_UP:
      case Enum193.PRONE_DOWN:

        // ATE: If we are NOT waiting for prone down...
        if (pSoldier.value.fTurningFromPronePosition < TURNING_FROM_PRONE_START_UP_FROM_MOVE && !pSoldier.value.fDontChargeAPsForStanceChange) {
          // ATE: Don't do this if we are still 'moving'....
          if (pSoldier.value.sGridNo == pSoldier.value.sFinalDestination || pSoldier.value.usPathIndex == 0) {
            DeductPoints(pSoldier, AP_PRONE, BP_PRONE);
          }
        }
        pSoldier.value.fDontChargeAPsForStanceChange = FALSE;
        break;

        // Deduct points for stance change
        // sAPCost = GetAPsToChangeStance( pSoldier, gAnimControl[ usNewState ].ubEndHeight );
        // DeductPoints( pSoldier, sAPCost, 0 );
        // break;

      case Enum193.START_AID:

        DeductPoints(pSoldier, AP_START_FIRST_AID, BP_START_FIRST_AID);
        break;

      case Enum193.CUTTING_FENCE:
        DeductPoints(pSoldier, AP_USEWIRECUTTERS, BP_USEWIRECUTTERS);
        break;

      case Enum193.PLANT_BOMB:

        DeductPoints(pSoldier, AP_DROP_BOMB, 0);
        break;

      case Enum193.STEAL_ITEM:

        DeductPoints(pSoldier, AP_STEAL_ITEM, 0);
        break;

      case Enum193.CROW_DIE:

        // Delete shadow of crow....
        if (pSoldier.value.pAniTile != NULL) {
          DeleteAniTile(pSoldier.value.pAniTile);
          pSoldier.value.pAniTile = NULL;
        }
        break;

      case Enum193.CROW_FLY:

        // Ate: startup a shadow ( if gridno is set )
        HandleCrowShadowNewGridNo(pSoldier);
        break;

      case Enum193.CROW_EAT:

        // ATE: Make sure height level is 0....
        SetSoldierHeight(pSoldier, (0));
        HandleCrowShadowRemoveGridNo(pSoldier);
        break;

      case Enum193.USE_REMOTE:

        DeductPoints(pSoldier, AP_USE_REMOTE, 0);
        break;

        // case PUNCH:

        // Deduct points for punching
        // sAPCost = MinAPsToAttack( pSoldier, pSoldier->sGridNo, FALSE );
        // DeductPoints( pSoldier, sAPCost, 0 );
        // break;

      case Enum193.HOPFENCE:

        DeductPoints(pSoldier, AP_JUMPFENCE, BP_JUMPFENCE);
        break;

      // Deduct aps for falling down....
      case Enum193.FALLBACK_HIT_STAND:
      case Enum193.FALLFORWARD_FROMHIT_STAND:

        DeductPoints(pSoldier, AP_FALL_DOWN, BP_FALL_DOWN);
        break;

      case Enum193.FALLFORWARD_FROMHIT_CROUCH:

        DeductPoints(pSoldier, (AP_FALL_DOWN / 2), (BP_FALL_DOWN / 2));
        break;

      case Enum193.QUEEN_SWIPE:

        // ATE: set damage counter...
        pSoldier.value.uiPendingActionData1 = 0;
        break;

      case Enum193.CLIMBDOWNROOF:

        // disable sight
        gTacticalStatus.uiFlags |= DISALLOW_SIGHT;

        DeductPoints(pSoldier, AP_CLIMBOFFROOF, BP_CLIMBOFFROOF);
        break;

      case Enum193.CLIMBUPROOF:

        // disable sight
        gTacticalStatus.uiFlags |= DISALLOW_SIGHT;

        DeductPoints(pSoldier, AP_CLIMBROOF, BP_CLIMBROOF);
        break;

      case Enum193.JUMP_OVER_BLOCKING_PERSON:

        // Set path....
        {
          let usNewGridNo: UINT16;

          DeductPoints(pSoldier, AP_JUMP_OVER, BP_JUMP_OVER);

          usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(pSoldier.value.bDirection));
          usNewGridNo = NewGridNo(usNewGridNo, DirectionInc(pSoldier.value.bDirection));

          pSoldier.value.usPathDataSize = 0;
          pSoldier.value.usPathIndex = 0;
          pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = pSoldier.value.bDirection;
          pSoldier.value.usPathDataSize++;
          pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = pSoldier.value.bDirection;
          pSoldier.value.usPathDataSize++;
          pSoldier.value.sFinalDestination = usNewGridNo;
          // Set direction
          EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], FALSE, Enum193.JUMP_OVER_BLOCKING_PERSON);
        }
        break;

      case Enum193.GENERIC_HIT_STAND:
      case Enum193.GENERIC_HIT_CROUCH:
      case Enum193.STANDING_BURST_HIT:
      case Enum193.ADULTMONSTER_HIT:
      case Enum193.ADULTMONSTER_DYING:
      case Enum193.COW_HIT:
      case Enum193.COW_DYING:
      case Enum193.BLOODCAT_HIT:
      case Enum193.BLOODCAT_DYING:
      case Enum193.WATER_HIT:
      case Enum193.WATER_DIE:
      case Enum193.DEEP_WATER_HIT:
      case Enum193.DEEP_WATER_DIE:
      case Enum193.RIFLE_STAND_HIT:
      case Enum193.LARVAE_HIT:
      case Enum193.LARVAE_DIE:
      case Enum193.QUEEN_HIT:
      case Enum193.QUEEN_DIE:
      case Enum193.INFANT_HIT:
      case Enum193.INFANT_DIE:
      case Enum193.CRIPPLE_HIT:
      case Enum193.CRIPPLE_DIE:
      case Enum193.CRIPPLE_DIE_FLYBACK:
      case Enum193.ROBOTNW_HIT:
      case Enum193.ROBOTNW_DIE:

        // Set getting hit flag to TRUE
        pSoldier.value.fGettingHit = TRUE;
        break;

      case Enum193.CHARIOTS_OF_FIRE:
      case Enum193.BODYEXPLODING:

        // Merc on fire!
        pSoldier.value.uiPendingActionData1 = PlaySoldierJA2Sample(pSoldier.value.ubID, (Enum330.FIRE_ON_MERC), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 5, SoundDir(pSoldier.value.sGridNo), TRUE);
        break;
    }
  }

  // Remove old animation profile
  HandleAnimationProfile(pSoldier, pSoldier.value.usAnimState, TRUE);

  // From animation control, set surface
  if (SetSoldierAnimationSurface(pSoldier, usNewState) == FALSE) {
    return FALSE;
  }

  // Set state
  pSoldier.value.usOldAniState = pSoldier.value.usAnimState;
  pSoldier.value.sOldAniCode = pSoldier.value.usAniCode;

  // Change state value!
  pSoldier.value.usAnimState = usNewState;

  pSoldier.value.sZLevelOverride = -1;

  if (!(pSoldier.value.uiStatusFlags & SOLDIER_LOCKPENDINGACTIONCOUNTER)) {
    // ATE Cancel ANY pending action...
    if (pSoldier.value.ubPendingActionAnimCount > 0 && (gAnimControl[pSoldier.value.usOldAniState].uiFlags & ANIM_MOVING)) {
      // Do some special things for some actions
      switch (pSoldier.value.ubPendingAction) {
        case Enum257.MERC_GIVEITEM:

          // Unset target as enaged
          MercPtrs[pSoldier.value.uiPendingActionData4].value.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
          break;
      }
      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
    } else {
      // Increment this for almost all animations except some movement ones...
      // That's because this represents ANY animation other than the one we began when the pending action was started
      // ATE: Added to ignore this count if we are waiting for someone to move out of our way...
      if (usNewState != Enum193.START_SWAT && usNewState != Enum193.END_SWAT && !(gAnimControl[usNewState].uiFlags & ANIM_NOCHANGE_PENDINGCOUNT) && !pSoldier.value.fDelayedMovement && !(pSoldier.value.uiStatusFlags & SOLDIER_ENGAGEDINACTION)) {
        pSoldier.value.ubPendingActionAnimCount++;
      }
    }
  }

  // Set new animation profile
  HandleAnimationProfile(pSoldier, usNewState, FALSE);

  // Reset some animation values
  pSoldier.value.fForceShade = FALSE;

  CheckForFreeupFromHit(pSoldier, uiOldAnimFlags, uiNewAnimFlags, pSoldier.value.usOldAniState, usNewState);

  // Set current frame
  pSoldier.value.usAniCode = usStartingAniCode;

  // ATE; For some animations that could use some variations, do so....
  if (usNewState == Enum193.CHARIOTS_OF_FIRE || usNewState == Enum193.BODYEXPLODING) {
    pSoldier.value.usAniCode = (Random(10));
  }

  // ATE: Default to first frame....
  // Will get changed ( probably ) by AdjustToNextAnimationFrame()
  ConvertAniCodeToAniFrame(pSoldier, (0));

  // Set delay speed
  SetSoldierAniSpeed(pSoldier);

  // Reset counters
  RESETTIMECOUNTER(pSoldier.value.UpdateCounter, pSoldier.value.sAniDelay);

  // Adjust to new animation frame ( the first one )
  AdjustToNextAnimationFrame(pSoldier);

  // Setup offset information for UI above guy
  SetSoldierLocatorOffsets(pSoldier);

  // If our own guy...
  if (pSoldier.value.bTeam == gbPlayerNum) {
    // Are we stationary?
    if (gAnimControl[usNewState].uiFlags & ANIM_STATIONARY) {
      // Position light....
      // SetCheckSoldierLightFlag( pSoldier );
    } else {
      // Hide light.....
      // DeleteSoldierLight( pSoldier );
    }
  }

  // If we are certain animations, reload palette
  if (usNewState == Enum193.VEHICLE_DIE || usNewState == Enum193.CHARIOTS_OF_FIRE || usNewState == Enum193.BODYEXPLODING) {
    CreateSoldierPalettes(pSoldier);
  }

  // ATE: if the old animation was a movement, and new is not, play sound...
  // OK, play final footstep sound...
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_STATIONARY) && (gAnimControl[pSoldier.value.usOldAniState].uiFlags & ANIM_MOVING)) {
      PlaySoldierFootstepSound(pSoldier);
    }
  }

  // Free up from stance change
  FreeUpNPCFromStanceChange(pSoldier);

  return TRUE;
}

function InternalRemoveSoldierFromGridNo(pSoldier: Pointer<SOLDIERTYPE>, fForce: BOOLEAN): void {
  let bDir: INT8;
  let iGridNo: INT32;

  if ((pSoldier.value.sGridNo != NO_MAP_POS)) {
    if (pSoldier.value.bInSector || fForce) {
      // Remove from world ( old pos )
      RemoveMerc(pSoldier.value.sGridNo, pSoldier, FALSE);
      HandleAnimationProfile(pSoldier, pSoldier.value.usAnimState, TRUE);

      // Remove records of this guy being adjacent
      for (bDir = 0; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir++) {
        iGridNo = pSoldier.value.sGridNo + DirIncrementer[bDir];
        if (iGridNo >= 0 && iGridNo < WORLD_MAX) {
          gpWorldLevelData[iGridNo].ubAdjacentSoldierCnt--;
        }
      }

      HandlePlacingRoofMarker(pSoldier, pSoldier.value.sGridNo, FALSE, FALSE);

      // Remove reseved movement value
      UnMarkMovementReserved(pSoldier);

      HandleCrowShadowRemoveGridNo(pSoldier);

      // Reset gridno...
      pSoldier.value.sGridNo = NO_MAP_POS;
    }
  }
}

function RemoveSoldierFromGridNo(pSoldier: Pointer<SOLDIERTYPE>): void {
  InternalRemoveSoldierFromGridNo(pSoldier, FALSE);
}

function EVENT_InternalSetSoldierPosition(pSoldier: Pointer<SOLDIERTYPE>, dNewXPos: FLOAT, dNewYPos: FLOAT, fUpdateDest: BOOLEAN, fUpdateFinalDest: BOOLEAN, fForceRemove: BOOLEAN): void {
  let sNewGridNo: INT16;

  // Not if we're dead!
  if ((pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
    return;
  }

  // Set new map index
  sNewGridNo = GETWORLDINDEXFROMWORLDCOORDS(dNewYPos, dNewXPos);

  if (fUpdateDest) {
    pSoldier.value.sDestination = sNewGridNo;
  }

  if (fUpdateFinalDest) {
    pSoldier.value.sFinalDestination = sNewGridNo;
  }

  // Copy old values
  pSoldier.value.dOldXPos = pSoldier.value.dXPos;
  pSoldier.value.dOldYPos = pSoldier.value.dYPos;

  // Set New pos
  pSoldier.value.dXPos = dNewXPos;
  pSoldier.value.dYPos = dNewYPos;

  pSoldier.value.sX = dNewXPos;
  pSoldier.value.sY = dNewYPos;

  HandleCrowShadowNewPosition(pSoldier);

  SetSoldierGridNo(pSoldier, sNewGridNo, fForceRemove);

  if (!(pSoldier.value.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
    if (gGameSettings.fOptions[Enum8.TOPTION_MERC_ALWAYS_LIGHT_UP]) {
      SetCheckSoldierLightFlag(pSoldier);
    }
  }

  // ATE: Mirror calls if we are a vehicle ( for all our passengers )
  UpdateAllVehiclePassengersGridNo(pSoldier);
}

function EVENT_SetSoldierPosition(pSoldier: Pointer<SOLDIERTYPE>, dNewXPos: FLOAT, dNewYPos: FLOAT): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, TRUE, TRUE, FALSE);
}

function EVENT_SetSoldierPositionForceDelete(pSoldier: Pointer<SOLDIERTYPE>, dNewXPos: FLOAT, dNewYPos: FLOAT): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, TRUE, TRUE, TRUE);
}

function EVENT_SetSoldierPositionAndMaybeFinalDest(pSoldier: Pointer<SOLDIERTYPE>, dNewXPos: FLOAT, dNewYPos: FLOAT, fUpdateFinalDest: BOOLEAN): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, TRUE, fUpdateFinalDest, FALSE);
}

function EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination(pSoldier: Pointer<SOLDIERTYPE>, dNewXPos: FLOAT, dNewYPos: FLOAT, fUpdateDest: BOOLEAN, fUpdateFinalDest: BOOLEAN): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, fUpdateDest, fUpdateFinalDest, FALSE);
}

function InternalSetSoldierHeight(pSoldier: Pointer<SOLDIERTYPE>, dNewHeight: FLOAT, fUpdateLevel: BOOLEAN): void {
  let bOldLevel: INT8 = pSoldier.value.bLevel;

  pSoldier.value.dHeightAdjustment = dNewHeight;
  pSoldier.value.sHeightAdjustment = pSoldier.value.dHeightAdjustment;

  if (!fUpdateLevel) {
    return;
  }

  if (pSoldier.value.sHeightAdjustment > 0) {
    pSoldier.value.bLevel = SECOND_LEVEL;

    ApplyTranslucencyToWalls((pSoldier.value.dXPos / CELL_X_SIZE), (pSoldier.value.dYPos / CELL_Y_SIZE));
    // LightHideTrees((INT16)(pSoldier->dXPos/CELL_X_SIZE), (INT16)(pSoldier->dYPos/CELL_Y_SIZE));
    // ConcealAllWalls();

    // pSoldier->pLevelNode->ubShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubShadeLevel;
    // pSoldier->pLevelNode->ubSumLights=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubSumLights;
    // pSoldier->pLevelNode->ubMaxLights=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubMaxLights;
    // pSoldier->pLevelNode->ubNaturalShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubNaturalShadeLevel;
  } else {
    pSoldier.value.bLevel = FIRST_LEVEL;

    // pSoldier->pLevelNode->ubShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubShadeLevel;
    // pSoldier->pLevelNode->ubSumLights=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubSumLights;
    // pSoldier->pLevelNode->ubMaxLights=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubMaxLights;
    // pSoldier->pLevelNode->ubNaturalShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubNaturalShadeLevel;
  }

  if (bOldLevel == 0 && pSoldier.value.bLevel == 0) {
  } else {
    // Show room at new level
    // HideRoom( pSoldier->sGridNo, pSoldier );
  }
}

function SetSoldierHeight(pSoldier: Pointer<SOLDIERTYPE>, dNewHeight: FLOAT): void {
  InternalSetSoldierHeight(pSoldier, dNewHeight, TRUE);
}

function SetSoldierGridNo(pSoldier: Pointer<SOLDIERTYPE>, sNewGridNo: INT16, fForceRemove: BOOLEAN): void {
  let fInWaterValue: BOOLEAN;
  let bDir: INT8;
  let cnt: INT32;
  let pEnemy: Pointer<SOLDIERTYPE>;

  // INT16	sX, sY, sWorldX, sZLevel;

  // Not if we're dead!
  if ((pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
    return;
  }

  if (sNewGridNo != pSoldier.value.sGridNo || pSoldier.value.pLevelNode == NULL) {
    // Check if we are moving AND this is our next dest gridno....
    if (gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_MOVING | ANIM_SPECIALMOVE)) {
      if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
        if (sNewGridNo != pSoldier.value.sDestination) {
          // THIS MUST be our new one......MAKE IT SO
          sNewGridNo = pSoldier.value.sDestination;
        }

        // Now check this baby....
        if (sNewGridNo == pSoldier.value.sGridNo) {
          return;
        }
      }
    }

    pSoldier.value.sOldGridNo = pSoldier.value.sGridNo;

    if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
      SetPositionSndGridNo(pSoldier.value.iPositionSndID, sNewGridNo);
    }

    if (!(pSoldier.value.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      InternalRemoveSoldierFromGridNo(pSoldier, fForceRemove);
    }

    // CHECK IF OUR NEW GIRDNO IS VALID,IF NOT DONOT SET!
    if (!GridNoOnVisibleWorldTile(sNewGridNo)) {
      pSoldier.value.sGridNo = sNewGridNo;
      return;
    }

    // Alrighty, update UI for this guy, if he's the selected guy...
    if (gusSelectedSoldier == pSoldier.value.ubID) {
      if (guiCurrentEvent == Enum207.C_WAIT_FOR_CONFIRM) {
        // Update path!
        gfPlotNewMovement = TRUE;
      }
    }

    // Reset some flags for optimizations..
    pSoldier.value.sWalkToAttackGridNo = NOWHERE;

    // ATE: Make sure!
    // RemoveMerc( pSoldier->sGridNo, pSoldier, FALSE );

    pSoldier.value.sGridNo = sNewGridNo;

    // OK, check for special code to close door...
    if (pSoldier.value.bEndDoorOpenCode == 2) {
      pSoldier.value.bEndDoorOpenCode = 0;

      HandleDoorChangeFromGridNo(pSoldier, pSoldier.value.sEndDoorOpenCodeData, FALSE);
    }

    // OK, Update buddy's strategic insertion code....
    pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.value.usStrategicInsertionData = sNewGridNo;

    // Remove this gridno as a reserved place!
    if (!(pSoldier.value.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      UnMarkMovementReserved(pSoldier);
    }

    if (pSoldier.value.sInitialGridNo == 0) {
      pSoldier.value.sInitialGridNo = sNewGridNo;
      pSoldier.value.usPatrolGrid[0] = sNewGridNo;
    }

    // Add records of this guy being adjacent
    for (bDir = 0; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir++) {
      gpWorldLevelData[pSoldier.value.sGridNo + DirIncrementer[bDir]].ubAdjacentSoldierCnt++;
    }

    if (!(pSoldier.value.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      DropSmell(pSoldier);
    }

    // HANDLE ANY SPECIAL RENDERING SITUATIONS
    pSoldier.value.sZLevelOverride = -1;
    // If we are over a fence ( hopping ), make us higher!

    if (IsJumpableFencePresentAtGridno(sNewGridNo)) {
      // sX = MapX( sNewGridNo );
      // sY = MapY( sNewGridNo );
      // GetWorldXYAbsoluteScreenXY( sX, sY, &sWorldX, &sZLevel);
      // pSoldier->sZLevelOverride = (sZLevel*Z_SUBLAYERS)+ROOF_Z_LEVEL;
      pSoldier.value.sZLevelOverride = TOPMOST_Z_LEVEL;
    }

    // Add/ remove tree if we are near it
    // CheckForFullStructures( pSoldier );

    // Add merc at new pos
    if (!(pSoldier.value.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      AddMercToHead(pSoldier.value.sGridNo, pSoldier, TRUE);

      // If we are in the middle of climbing the roof!
      if (pSoldier.value.usAnimState == Enum193.CLIMBUPROOF) {
        if (pSoldier.value.iLight != (-1))
          LightSpriteRoofStatus(pSoldier.value.iLight, TRUE);
      } else if (pSoldier.value.usAnimState == Enum193.CLIMBDOWNROOF) {
        if (pSoldier.value.iLight != (-1))
          LightSpriteRoofStatus(pSoldier.value.iLight, FALSE);
      }

      // JA2Gold:
      // if the player wants the merc to cast the fake light AND it is night
      if (pSoldier.value.bTeam != OUR_TEAM || gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT] && NightTime()) {
        if (pSoldier.value.bLevel > 0 && gpWorldLevelData[pSoldier.value.sGridNo].pRoofHead != NULL) {
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubShadeLevel = gpWorldLevelData[pSoldier.value.sGridNo].pRoofHead.value.ubShadeLevel;
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubSumLights = gpWorldLevelData[pSoldier.value.sGridNo].pRoofHead.value.ubSumLights;
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubMaxLights = gpWorldLevelData[pSoldier.value.sGridNo].pRoofHead.value.ubMaxLights;
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubNaturalShadeLevel = gpWorldLevelData[pSoldier.value.sGridNo].pRoofHead.value.ubNaturalShadeLevel;
        } else {
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubShadeLevel = gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubShadeLevel;
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubSumLights = gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubSumLights;
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubMaxLights = gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubMaxLights;
          gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubNaturalShadeLevel = gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubNaturalShadeLevel;
        }
      }

      /// HandlePlacingRoofMarker( pSoldier, pSoldier->sGridNo, TRUE, FALSE );

      HandleAnimationProfile(pSoldier, pSoldier.value.usAnimState, FALSE);

      HandleCrowShadowNewGridNo(pSoldier);
    }

    pSoldier.value.bOldOverTerrainType = pSoldier.value.bOverTerrainType;
    pSoldier.value.bOverTerrainType = GetTerrainType(pSoldier.value.sGridNo);

    // OK, check that our animation is up to date!
    // Check our water value

    if (!(pSoldier.value.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      fInWaterValue = MercInWater(pSoldier);

      // ATE: If ever in water MAKE SURE WE WALK AFTERWOODS!
      if (fInWaterValue) {
        pSoldier.value.usUIMovementMode = Enum193.WALKING;
      }

      if (fInWaterValue != pSoldier.value.fPrevInWater) {
        // Update Animation data
        SetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

        // Update flag
        pSoldier.value.fPrevInWater = fInWaterValue;

        // Update sound...
        if (fInWaterValue) {
          PlaySoldierJA2Sample(pSoldier.value.ubID, Enum330.ENTER_WATER_1, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo), TRUE);
        } else {
          // ATE: Check if we are going from water to land - if so, resume
          // with regular movement mode...
          EVENT_InitNewSoldierAnim(pSoldier, pSoldier.value.usUIMovementMode, 0, FALSE);
        }
      }

      // OK, If we were not in deep water but we are now, handle deep animations!
      if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER && pSoldier.value.bOldOverTerrainType != Enum315.DEEP_WATER) {
        // Based on our current animation, change!
        switch (pSoldier.value.usAnimState) {
          case Enum193.WALKING:
          case Enum193.RUNNING:

            // IN deep water, swim!

            // Make transition from low to deep
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.LOW_TO_DEEP_WATER, 0, FALSE);
            pSoldier.value.usPendingAnimation = Enum193.DEEP_WATER_SWIM;

            PlayJA2Sample(Enum330.ENTER_DEEP_WATER_1, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
        }
      }

      // Damage water if in deep water....
      if (pSoldier.value.bOverTerrainType == Enum315.MED_WATER || pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
        WaterDamage(pSoldier);
      }

      // OK, If we were in deep water but we are NOT now, handle mid animations!
      if (pSoldier.value.bOverTerrainType != Enum315.DEEP_WATER && pSoldier.value.bOldOverTerrainType == Enum315.DEEP_WATER) {
        // Make transition from low to deep
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_TO_LOW_WATER, 0, FALSE);
        pSoldier.value.usPendingAnimation = pSoldier.value.usUIMovementMode;
      }
    }

    // are we now standing in tear gas without a decently working gas mask?
    if (GetSmokeEffectOnTile(sNewGridNo, pSoldier.value.bLevel)) {
      let fSetGassed: BOOLEAN = TRUE;

      // If we have a functioning gas mask...
      if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD1POS].bStatus[0] >= GASMASK_MIN_STATUS) {
        fSetGassed = FALSE;
      }
      if (pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD2POS].bStatus[0] >= GASMASK_MIN_STATUS) {
        fSetGassed = FALSE;
      }

      if (fSetGassed) {
        pSoldier.value.uiStatusFlags |= SOLDIER_GASSED;
      }
    }

    if (pSoldier.value.bTeam == gbPlayerNum && pSoldier.value.bStealthMode) {
      // Merc got to a new tile by "sneaking". Did we theoretically sneak
      // past an enemy?

      if (pSoldier.value.bOppCnt > 0) // opponents in sight
      {
        // check each possible enemy
        for (cnt = 0; cnt < MAX_NUM_SOLDIERS; cnt++) {
          pEnemy = MercPtrs[cnt];
          // if this guy is here and alive enough to be looking for us
          if (pEnemy.value.bActive && pEnemy.value.bInSector && (pEnemy.value.bLife >= OKLIFE)) {
            // no points for sneaking by the neutrals & friendlies!!!
            if (!pEnemy.value.bNeutral && (pSoldier.value.bSide != pEnemy.value.bSide) && (pEnemy.value.ubBodyType != Enum194.COW && pEnemy.value.ubBodyType != Enum194.CROW)) {
              // if we SEE this particular oppponent, and he DOESN'T see us... and he COULD see us...
              if ((pSoldier.value.bOppList[cnt] == SEEN_CURRENTLY) && pEnemy.value.bOppList[pSoldier.value.ubID] != SEEN_CURRENTLY && PythSpacesAway(pSoldier.value.sGridNo, pEnemy.value.sGridNo) < DistanceVisible(pEnemy, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, pSoldier.value.sGridNo, pSoldier.value.bLevel)) {
                // AGILITY (5):  Soldier snuck 1 square past unaware enemy
                StatChange(pSoldier, AGILAMT, 5, FALSE);
                // Keep looping, we'll give'em 1 point for EACH such enemy!
              }
            }
          }
        }
      }
    }

    // Adjust speed based on terrain, etc
    SetSoldierAniSpeed(pSoldier);
  } else {
    let i: int = 0;
  }
}

function EVENT_FireSoldierWeapon(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): void {
  let sTargetXPos: INT16;
  let sTargetYPos: INT16;
  let fDoFireRightAway: BOOLEAN = FALSE;

  // CANNOT BE SAME GRIDNO!
  if (pSoldier.value.sGridNo == sTargetGridNo) {
    return;
  }

  if (pSoldier.value.ubID == 33) {
    let i: int = 0;
  }

  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  //}

  // Set soldier's target gridno
  // This assignment was redundent because it's already set in
  // the actual event call
  pSoldier.value.sTargetGridNo = sTargetGridNo;
  // pSoldier->sLastTarget = sTargetGridNo;
  pSoldier.value.ubTargetID = WhoIsThere2(sTargetGridNo, pSoldier.value.bTargetLevel);

  if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass & IC_GUN) {
    if (pSoldier.value.bDoBurst) {
      // Set the TOTAL number of bullets to be fired
      // Can't shoot more bullets than we have in our magazine!
      pSoldier.value.bBulletsLeft = __min(Weapon[pSoldier.value.inv[pSoldier.value.ubAttackingHand].usItem].ubShotsPerBurst, pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubGunShotsLeft);
    } else if (IsValidSecondHandShot(pSoldier)) {
      // two-pistol attack - two bullets!
      pSoldier.value.bBulletsLeft = 2;
    } else {
      pSoldier.value.bBulletsLeft = 1;
    }
    if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubGunAmmoType == Enum286.AMMO_BUCKSHOT) {
      pSoldier.value.bBulletsLeft *= NUM_BUCKSHOT_PELLETS;
    }
  }
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack, bullets left %d", pSoldier.value.bBulletsLeft));

  // Convert our grid-not into an XY
  ConvertGridNoToXY(sTargetGridNo, addressof(sTargetXPos), addressof(sTargetYPos));

  // Change to fire animation
  // Ready weapon
  SoldierReadyWeapon(pSoldier, sTargetXPos, sTargetYPos, FALSE);

  // IF WE ARE AN NPC, SLIDE VIEW TO SHOW WHO IS SHOOTING
  {
    // if ( pSoldier->fDoSpread )
    //{
    // If we are spreading burst, goto right away!
    // EVENT_InitNewSoldierAnim( pSoldier, SelectFireAnimation( pSoldier, gAnimControl[ pSoldier->usAnimState ].ubEndHeight ), 0, FALSE );

    //}

    // else
    {
      if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
        // Force our direction!
        EVENT_SetSoldierDirection(pSoldier, pSoldier.value.bDesiredDirection);
        EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, gAnimControl[pSoldier.value.usAnimState].ubEndHeight), 0, FALSE);
      } else {
        // IF WE ARE IN REAl-TIME, FIRE IMMEDIATELY!
        if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
          // fDoFireRightAway = TRUE;
        }

        // Check if our weapon has no intermediate anim...
        switch (pSoldier.value.inv[Enum261.HANDPOS].usItem) {
          case Enum225.ROCKET_LAUNCHER:
          case Enum225.MORTAR:
          case Enum225.GLAUNCHER:

            fDoFireRightAway = TRUE;
            break;
        }

        if (fDoFireRightAway) {
          // Set to true so we don't get toasted twice for APs..
          pSoldier.value.fDontUnsetLastTargetFromTurn = TRUE;

          // Make sure we don't try and do fancy prone turning.....
          pSoldier.value.fTurningFromPronePosition = FALSE;

          // Force our direction!
          EVENT_SetSoldierDirection(pSoldier, pSoldier.value.bDesiredDirection);

          EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, gAnimControl[pSoldier.value.usAnimState].ubEndHeight), 0, FALSE);
        } else {
          // Set flag indicating we are about to shoot once destination direction is hit
          pSoldier.value.fTurningToShoot = TRUE;

          if (pSoldier.value.bTeam != gbPlayerNum && pSoldier.value.bVisible != -1) {
            LocateSoldier(pSoldier.value.ubID, DONTSETLOCATOR);
          }
        }
      }
    }
  }
}

// gAnimControl[ pSoldier->usAnimState ].ubEndHeight
//					ChangeSoldierState( pSoldier, SHOOT_RIFLE_STAND, 0 , FALSE );

function SelectFireAnimation(pSoldier: Pointer<SOLDIERTYPE>, ubHeight: UINT8): UINT16 {
  let sDist: INT16;
  let usItem: UINT16;
  let dTargetX: FLOAT;
  let dTargetY: FLOAT;
  let dTargetZ: FLOAT;
  let fDoLowShot: BOOLEAN = FALSE;

  // Do different things if we are a monster
  if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
    switch (pSoldier.value.ubBodyType) {
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.AM_MONSTER:
      case Enum194.YAF_MONSTER:
      case Enum194.YAM_MONSTER:

        return Enum193.MONSTER_SPIT_ATTACK;
        break;

      case Enum194.LARVAE_MONSTER:

        break;

      case Enum194.INFANT_MONSTER:

        return Enum193.INFANT_ATTACK;
        break;

      case Enum194.QUEENMONSTER:

        return Enum193.QUEEN_SPIT;
        break;
    }
    return TRUE;
  }

  if (pSoldier.value.ubBodyType == Enum194.ROBOTNOWEAPON) {
    if (pSoldier.value.bDoBurst > 0) {
      return Enum193.ROBOT_BURST_SHOOT;
    } else {
      return Enum193.ROBOT_SHOOT;
    }
  }

  // Check for rocket laucncher....
  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.ROCKET_LAUNCHER) {
    return Enum193.SHOOT_ROCKET;
  }

  // Check for rocket laucncher....
  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.MORTAR) {
    return Enum193.SHOOT_MORTAR;
  }

  // Check for tank cannon
  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.TANK_CANNON) {
    return Enum193.TANK_SHOOT;
  }

  if (pSoldier.value.ubBodyType == Enum194.TANK_NW || pSoldier.value.ubBodyType == Enum194.TANK_NE) {
    return Enum193.TANK_BURST;
  }

  // Determine which animation to do...depending on stance and gun in hand...
  switch (ubHeight) {
    case ANIM_STAND:

      usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

      // CHECK 2ND HAND!
      if (IsValidSecondHandShot(pSoldier)) {
        // Increment the number of people busy doing stuff because of an attack
        // gTacticalStatus.ubAttackBusyCount++;
        // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack with 2 guns, attack count now %d", gTacticalStatus.ubAttackBusyCount) );

        return Enum193.SHOOT_DUAL_STAND;
      } else {
        // OK, while standing check distance away from target, and shoot low if we should!
        sDist = PythSpacesAway(pSoldier.value.sGridNo, pSoldier.value.sTargetGridNo);

        // ATE: OK, SEE WERE WE ARE TARGETING....
        GetTargetWorldPositions(pSoldier, pSoldier.value.sTargetGridNo, addressof(dTargetX), addressof(dTargetY), addressof(dTargetZ));

        // CalculateSoldierZPos( pSoldier, FIRING_POS, &dFirerZ );

        if (sDist <= 2 && dTargetZ <= 100) {
          fDoLowShot = TRUE;
        }

        // ATE: Made distence away long for psitols such that they never use this....
        // if ( !(Item[ usItem ].fFlags & ITEM_TWO_HANDED) )
        //{
        //	fDoLowShot = FALSE;
        //}

        // Don't do any low shots if in water
        if (MercInWater(pSoldier)) {
          fDoLowShot = FALSE;
        }

        if (pSoldier.value.bDoBurst > 0) {
          if (fDoLowShot) {
            return Enum193.FIRE_BURST_LOW_STAND;
          } else {
            return Enum193.STANDING_BURST;
          }
        } else {
          if (fDoLowShot) {
            return Enum193.FIRE_LOW_STAND;
          } else {
            return Enum193.SHOOT_RIFLE_STAND;
          }
        }
      }
      break;

    case ANIM_PRONE:

      if (pSoldier.value.bDoBurst > 0) {
        //				pSoldier->fBurstCompleted = FALSE;
        return Enum193.PRONE_BURST;
      } else {
        if (IsValidSecondHandShot(pSoldier)) {
          return Enum193.SHOOT_DUAL_PRONE;
        } else {
          return Enum193.SHOOT_RIFLE_PRONE;
        }
      }
      break;

    case ANIM_CROUCH:

      if (IsValidSecondHandShot(pSoldier)) {
        // Increment the number of people busy doing stuff because of an attack
        // gTacticalStatus.ubAttackBusyCount++;
        // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack with 2 guns, attack count now %d", gTacticalStatus.ubAttackBusyCount) );

        return Enum193.SHOOT_DUAL_CROUCH;
      } else {
        if (pSoldier.value.bDoBurst > 0) {
          //				pSoldier->fBurstCompleted = FALSE;
          return Enum193.CROUCHED_BURST;
        } else {
          return Enum193.SHOOT_RIFLE_CROUCH;
        }
      }
      break;

    default:
      AssertMsg(FALSE, String("SelectFireAnimation: ERROR - Invalid height %d", ubHeight));
      break;
  }

  // If here, an internal error has occured!
  Assert(FALSE);
  return 0;
}

function GetMoveStateBasedOnStance(pSoldier: Pointer<SOLDIERTYPE>, ubStanceHeight: UINT8): UINT16 {
  // Determine which animation to do...depending on stance and gun in hand...
  switch (ubStanceHeight) {
    case ANIM_STAND:
      if (pSoldier.value.fUIMovementFast && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
        return Enum193.RUNNING;
      } else {
        return Enum193.WALKING;
      }
      break;

    case ANIM_PRONE:
      if (pSoldier.value.fUIMovementFast) {
        return Enum193.CRAWLING;
      } else {
        return Enum193.CRAWLING;
      }
      break;

    case ANIM_CROUCH:
      if (pSoldier.value.fUIMovementFast) {
        return Enum193.SWATTING;
      } else {
        return Enum193.SWATTING;
      }
      break;

    default:
      AssertMsg(FALSE, String("GetMoveStateBasedOnStance: ERROR - Invalid height %d", ubStanceHeight));
      break;
  }

  // If here, an internal error has occured!
  Assert(FALSE);
  return 0;
}

function SelectFallAnimation(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Determine which animation to do...depending on stance and gun in hand...
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.FLYBACK_HIT, 0, FALSE);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.FLYBACK_HIT, 0, FALSE);
      break;
  }
}

function SoldierReadyWeapon(pSoldier: Pointer<SOLDIERTYPE>, sTargetXPos: INT16, sTargetYPos: INT16, fEndReady: BOOLEAN): BOOLEAN {
  let sFacingDir: INT16;

  sFacingDir = GetDirectionFromXY(sTargetXPos, sTargetYPos, pSoldier);

  return InternalSoldierReadyWeapon(pSoldier, sFacingDir, fEndReady);
}

function InternalSoldierReadyWeapon(pSoldier: Pointer<SOLDIERTYPE>, sFacingDir: UINT8, fEndReady: BOOLEAN): BOOLEAN {
  let usAnimState: UINT16;
  let fReturnVal: BOOLEAN = FALSE;

  // Handle monsters differently
  if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
    if (!fEndReady) {
      EVENT_SetSoldierDesiredDirection(pSoldier, sFacingDir);
    }
    return FALSE;
  }

  usAnimState = PickSoldierReadyAnimation(pSoldier, fEndReady);

  if (usAnimState != INVALID_ANIMATION) {
    EVENT_InitNewSoldierAnim(pSoldier, usAnimState, 0, FALSE);
    fReturnVal = TRUE;
  }

  if (!fEndReady) {
    // Ready direction for new facing direction
    if (usAnimState == INVALID_ANIMATION) {
      usAnimState = pSoldier.value.usAnimState;
    }

    EVENT_InternalSetSoldierDesiredDirection(pSoldier, sFacingDir, FALSE, usAnimState);

    // Check if facing dir is different from ours and change direction if so!
    // if ( sFacingDir != pSoldier->bDirection )
    //{
    //	DeductPoints( pSoldier, AP_CHANGE_FACING, 0 );
    //}//
  }

  return fReturnVal;
}

function PickSoldierReadyAnimation(pSoldier: Pointer<SOLDIERTYPE>, fEndReady: BOOLEAN): UINT16 {
  // Invalid animation if nothing in our hands
  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == NOTHING) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.value.ubBodyType == Enum194.ROBOTNOWEAPON) {
    return INVALID_ANIMATION;
  }

  // Check if we have a gun.....
  if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass != IC_GUN && pSoldier.value.inv[Enum261.HANDPOS].usItem != Enum225.GLAUNCHER) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.ROCKET_LAUNCHER) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.value.ubBodyType == Enum194.TANK_NW || pSoldier.value.ubBodyType == Enum194.TANK_NE) {
    return INVALID_ANIMATION;
  }

  if (fEndReady) {
    // IF our gun is already drawn, do not change animation, just direction
    if (gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_FIREREADY | ANIM_FIRE)) {
      switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
        case ANIM_STAND:

          // CHECK 2ND HAND!
          if (IsValidSecondHandShot(pSoldier)) {
            return Enum193.END_DUAL_STAND;
          } else {
            return Enum193.END_RIFLE_STAND;
          }
          break;

        case ANIM_PRONE:

          if (IsValidSecondHandShot(pSoldier)) {
            return Enum193.END_DUAL_PRONE;
          } else {
            return Enum193.END_RIFLE_PRONE;
          }
          break;

        case ANIM_CROUCH:

          // CHECK 2ND HAND!
          if (IsValidSecondHandShot(pSoldier)) {
            return Enum193.END_DUAL_CROUCH;
          } else {
            return Enum193.END_RIFLE_CROUCH;
          }
          break;
      }
    }
  } else {
    // IF our gun is already drawn, do not change animation, just direction
    if (!(gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_FIREREADY | ANIM_FIRE))) {
      {
        switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
          case ANIM_STAND:

            // CHECK 2ND HAND!
            if (IsValidSecondHandShot(pSoldier)) {
              return Enum193.READY_DUAL_STAND;
            } else {
              return Enum193.READY_RIFLE_STAND;
            }
            break;

          case ANIM_PRONE:
            // Go into crouch, turn, then go into prone again
            // ChangeSoldierStance( pSoldier, ANIM_CROUCH );
            // pSoldier->ubDesiredHeight = ANIM_PRONE;
            // ChangeSoldierState( pSoldier, PRONE_UP );
            if (IsValidSecondHandShot(pSoldier)) {
              return Enum193.READY_DUAL_PRONE;
            } else {
              return Enum193.READY_RIFLE_PRONE;
            }
            break;

          case ANIM_CROUCH:

            // CHECK 2ND HAND!
            if (IsValidSecondHandShot(pSoldier)) {
              return Enum193.READY_DUAL_CROUCH;
            } else {
              return Enum193.READY_RIFLE_CROUCH;
            }
            break;
        }
      }
    }
  }

  return INVALID_ANIMATION;
}

// ATE: THIS FUNCTION IS USED FOR ALL SOLDIER TAKE DAMAGE FUNCTIONS!
function EVENT_SoldierGotHit(pSoldier: Pointer<SOLDIERTYPE>, usWeaponIndex: UINT16, sDamage: INT16, sBreathLoss: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8, sSubsequent: INT16, sLocationGrid: INT16): void {
  let ubCombinedLoss: UINT8;
  let ubVolume: UINT8;
  let ubReason: UINT8;
  let pNewSoldier: Pointer<SOLDIERTYPE>;

  ubReason = 0;

  // ATE: If we have gotten hit, but are still in our attack animation, reduce count!
  switch (pSoldier.value.usAnimState) {
    case Enum193.SHOOT_ROCKET:
    case Enum193.SHOOT_MORTAR:
    case Enum193.THROW_ITEM:
    case Enum193.LOB_ITEM:

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - ATTACK ANIMATION %s ENDED BY HIT ANIMATION, Now %d", gAnimControl[pSoldier.value.usAnimState].zAnimStr, gTacticalStatus.ubAttackBusyCount));
      ReduceAttackBusyCount(pSoldier.value.ubID, FALSE);
      break;
  }

  // DO STUFF COMMON FOR ALL TYPES
  if (ubAttackerID != NOBODY) {
    MercPtrs[ubAttackerID].value.bLastAttackHit = TRUE;
  }

  // Set attacker's ID
  pSoldier.value.ubAttackerID = ubAttackerID;

  if (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
    // Increment  being attacked count
    pSoldier.value.bBeingAttackedCount++;
  }

  // if defender is a vehicle, there will be no hit animation played!
  if (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
    // Increment the number of people busy doing stuff because of an attack (busy doing hit anim!)
    gTacticalStatus.ubAttackBusyCount++;
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Person got hit, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  }

  // ATE; Save hit location info...( for later anim determination stuff )
  pSoldier.value.ubHitLocation = ubHitLocation;

  // handle morale for heavy damage attacks
  if (sDamage > 25) {
    if (pSoldier.value.ubAttackerID != NOBODY && MercPtrs[pSoldier.value.ubAttackerID].value.bTeam == gbPlayerNum) {
      HandleMoraleEvent(MercPtrs[pSoldier.value.ubAttackerID], Enum234.MORALE_DID_LOTS_OF_DAMAGE, MercPtrs[pSoldier.value.ubAttackerID].value.sSectorX, MercPtrs[pSoldier.value.ubAttackerID].value.sSectorY, MercPtrs[pSoldier.value.ubAttackerID].value.bSectorZ);
    }
    if (pSoldier.value.bTeam == gbPlayerNum) {
      HandleMoraleEvent(pSoldier, Enum234.MORALE_TOOK_LOTS_OF_DAMAGE, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
    }
  }

  // SWITCH IN TYPE OF WEAPON
  if (ubSpecial == FIRE_WEAPON_TOSSED_OBJECT_SPECIAL) {
    ubReason = TAKE_DAMAGE_OBJECT;
  } else if (Item[usWeaponIndex].usItemClass & IC_TENTACLES) {
    ubReason = TAKE_DAMAGE_TENTACLES;
  } else if (Item[usWeaponIndex].usItemClass & (IC_GUN | IC_THROWING_KNIFE)) {
    if (ubSpecial == FIRE_WEAPON_SLEEP_DART_SPECIAL) {
      let uiChance: UINT32;

      // put the drug in!
      pSoldier.value.bSleepDrugCounter = 10;

      uiChance = SleepDartSuccumbChance(pSoldier);

      if (PreRandom(100) < uiChance) {
        // succumb to the drug!
        sBreathLoss = (pSoldier.value.bBreathMax * 100);
      }
    } else if (ubSpecial == FIRE_WEAPON_BLINDED_BY_SPIT_SPECIAL) {
      // blinded!!
      if ((pSoldier.value.bBlindedCounter == 0)) {
        // say quote
        if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BLINDED);
        }
        DecayIndividualOpplist(pSoldier);
      }
      // will always increase counter by at least 1
      pSoldier.value.bBlindedCounter += (sDamage / 8) + 1;

      // Dirty panel
      fInterfacePanelDirty = DIRTYLEVEL2;
    }
    sBreathLoss += BP_GET_HIT;
    ubReason = TAKE_DAMAGE_GUNFIRE;
  } else if (Item[usWeaponIndex].usItemClass & IC_BLADE) {
    sBreathLoss = BP_GET_HIT;
    ubReason = TAKE_DAMAGE_BLADE;
  } else if (Item[usWeaponIndex].usItemClass & IC_PUNCH) {
    // damage from hand-to-hand is 1/4 normal, 3/4 breath.. the sDamage value
    // is actually how much breath we'll take away
    sBreathLoss = sDamage * 100;
    sDamage = sDamage / PUNCH_REAL_DAMAGE_PORTION;
    if (AreInMeanwhile() && gCurrentMeanwhileDef.ubMeanwhileID == Enum160.INTERROGATION) {
      sBreathLoss = 0;
      sDamage /= 2;
    }
    ubReason = TAKE_DAMAGE_HANDTOHAND;
  } else if (Item[usWeaponIndex].usItemClass & IC_EXPLOSV) {
    if (usWeaponIndex == Enum225.STRUCTURE_EXPLOSION) {
      ubReason = TAKE_DAMAGE_STRUCTURE_EXPLOSION;
    } else {
      ubReason = TAKE_DAMAGE_EXPLOSION;
    }
  } else {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Soldier Control: Weapon class not handled in SoldierGotHit( ) %d", usWeaponIndex));
  }

  // CJC: moved to after SoldierTakeDamage so that any quotes from the defender
  // will not be said if they are knocked out or killed
  if (ubReason != TAKE_DAMAGE_TENTACLES && ubReason != TAKE_DAMAGE_OBJECT) {
    // OK, OK: THis is hairy, however, it's ness. because the normal freeup call uses the
    // attckers intended target, and here we want to use thier actual target....

    // ATE: If it's from GUNFIRE damage, keep in mind bullets...
    if (Item[usWeaponIndex].usItemClass & IC_GUN) {
      pNewSoldier = FreeUpAttackerGivenTarget(pSoldier.value.ubAttackerID, pSoldier.value.ubID);
    } else {
      pNewSoldier = ReduceAttackBusyGivenTarget(pSoldier.value.ubAttackerID, pSoldier.value.ubID);
    }

    if (pNewSoldier != NULL) {
      pSoldier = pNewSoldier;
    }
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Tried to free up attacker, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  }

  // OK, If we are a vehicle.... damage vehicle...( people inside... )
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    SoldierTakeDamage(pSoldier, ANIM_CROUCH, sDamage, sBreathLoss, ubReason, pSoldier.value.ubAttackerID, NOWHERE, FALSE, TRUE);
    return;
  }

  // DEDUCT LIFE
  ubCombinedLoss = SoldierTakeDamage(pSoldier, ANIM_CROUCH, sDamage, sBreathLoss, ubReason, pSoldier.value.ubAttackerID, NOWHERE, FALSE, TRUE);

  // ATE: OK, Let's check our ASSIGNMENT state,
  // If anything other than on a squad or guard, make them guard....
  if (pSoldier.value.bTeam == gbPlayerNum) {
    if (pSoldier.value.bAssignment >= Enum117.ON_DUTY && pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW) {
      if (pSoldier.value.fMercAsleep) {
        pSoldier.value.fMercAsleep = FALSE;
        pSoldier.value.fForcedToStayAwake = FALSE;

        // refresh map screen
        fCharacterInfoPanelDirty = TRUE;
        fTeamPanelDirty = TRUE;
      }

      AddCharacterToAnySquad(pSoldier);
    }
  }

  // SCREAM!!!!
  ubVolume = CalcScreamVolume(pSoldier, ubCombinedLoss);

  // IF WE ARE AT A HIT_STOP ANIMATION
  // DO APPROPRIATE HITWHILE DOWN ANIMATION
  if (!(gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_HITSTOP) || pSoldier.value.usAnimState != Enum193.JFK_HITDEATH_STOP) {
    MakeNoise(pSoldier.value.ubID, pSoldier.value.sGridNo, pSoldier.value.bLevel, pSoldier.value.bOverTerrainType, ubVolume, Enum236.NOISE_SCREAM);
  }

  // IAN ADDED THIS SAT JUNE 14th : HAVE TO SHOW VICTIM!
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT) && pSoldier.value.bVisible != -1 && pSoldier.value.bTeam == gbPlayerNum)
    LocateSoldier(pSoldier.value.ubID, DONTSETLOCATOR);

  if (Item[usWeaponIndex].usItemClass & IC_BLADE) {
    PlayJA2Sample((Enum330.KNIFE_IMPACT), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
  } else {
    PlayJA2Sample((Enum330.BULLET_IMPACT_1 + Random(3)), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
  }

  // PLAY RANDOM GETTING HIT SOUND
  // ONLY IF WE ARE CONSCIOUS!
  if (pSoldier.value.bLife >= CONSCIOUSNESS) {
    if (pSoldier.value.ubBodyType == Enum194.CROW) {
      // Exploding crow...
      PlayJA2Sample(Enum330.CROW_EXPLODE_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
    } else {
      // ATE: This is to disallow large amounts of smaples being played which is load!
      if (pSoldier.value.fGettingHit && pSoldier.value.usAniCode != Enum193.STANDING_BURST_HIT) {
      } else {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));
      }
    }
  }

  // CHECK FOR DOING HIT WHILE DOWN
  if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_HITSTOP)) {
    switch (pSoldier.value.usAnimState) {
      case Enum193.FLYBACKHIT_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLBACK_DEATHTWICH, 0, FALSE);
        break;

      case Enum193.STAND_FALLFORWARD_STOP:
        ChangeSoldierState(pSoldier, Enum193.GENERIC_HIT_DEATHTWITCHNB, 0, FALSE);
        break;

      case Enum193.JFK_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.JFK_HITDEATH_TWITCHB, 0, FALSE);
        break;

      case Enum193.FALLBACKHIT_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLBACK_HIT_DEATHTWITCHNB, 0, FALSE);
        break;

      case Enum193.PRONE_LAYFROMHIT_STOP:
        ChangeSoldierState(pSoldier, Enum193.PRONE_HIT_DEATHTWITCHNB, 0, FALSE);
        break;

      case Enum193.PRONE_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.PRONE_HIT_DEATHTWITCHB, 0, FALSE);
        break;

      case Enum193.FALLFORWARD_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.GENERIC_HIT_DEATHTWITCHB, 0, FALSE);
        break;

      case Enum193.FALLBACK_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLBACK_HIT_DEATHTWITCHB, 0, FALSE);
        break;

      case Enum193.FALLOFF_DEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_TWITCHB, 0, FALSE);
        break;

      case Enum193.FALLOFF_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_TWITCHNB, 0, FALSE);
        break;

      case Enum193.FALLOFF_FORWARD_DEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_TWITCHB, 0, FALSE);
        break;

      case Enum193.FALLOFF_FORWARD_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_TWITCHNB, 0, FALSE);
        break;

      default:
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Soldier Control: Death state %d has no death hit", pSoldier.value.usAnimState));
    }
    return;
  }

  // Set goback to aim after hit flag!
  // Only if we were aiming!
  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_FIREREADY) {
    pSoldier.value.fGoBackToAimAfterHit = TRUE;
  }

  // IF COWERING, PLAY SPECIFIC GENERIC HIT STAND...
  if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
    if (pSoldier.value.bLife == 0 || IS_MERC_BODY_TYPE(pSoldier)) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, FALSE);
    } else {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CIV_COWER_HIT, 0, FALSE);
    }
    return;
  }

  // Change based on body type
  switch (pSoldier.value.ubBodyType) {
    case Enum194.COW:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.COW_HIT, 0, FALSE);
      return;
      break;

    case Enum194.BLOODCAT:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.BLOODCAT_HIT, 0, FALSE);
      return;
      break;

    case Enum194.ADULTFEMALEMONSTER:
    case Enum194.AM_MONSTER:
    case Enum194.YAF_MONSTER:
    case Enum194.YAM_MONSTER:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADULTMONSTER_HIT, 0, FALSE);
      return;
      break;

    case Enum194.LARVAE_MONSTER:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.LARVAE_HIT, 0, FALSE);
      return;
      break;

    case Enum194.QUEENMONSTER:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_HIT, 0, FALSE);
      return;
      break;

    case Enum194.CRIPPLECIV:

    {
      // OK, do some code here to allow the fact that poor buddy can be thrown back if it's a big enough hit...
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRIPPLE_HIT, 0, FALSE);

      // pSoldier->bLife = 0;
      // EVENT_InitNewSoldierAnim( pSoldier, CRIPPLE_DIE_FLYBACK, 0 , FALSE );
    }
      return;
      break;

    case Enum194.ROBOTNOWEAPON:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.ROBOTNW_HIT, 0, FALSE);
      return;
      break;

    case Enum194.INFANT_MONSTER:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.INFANT_HIT, 0, FALSE);
      return;

    case Enum194.CROW:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROW_DIE, 0, FALSE);
      return;

    // case FATCIV:
    case Enum194.MANCIV:
    case Enum194.MINICIV:
    case Enum194.DRESSCIV:
    case Enum194.HATKIDCIV:
    case Enum194.KIDCIV:

      // OK, if life is 0 and not set as dead ( this is a death hit... )
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_DEAD) && pSoldier.value.bLife == 0) {
        // Randomize death!
        if (Random(2)) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CIV_DIE2, 0, FALSE);
          return;
        }
      }

      // IF here, go generic hit ALWAYS.....
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, FALSE);
      return;
      break;
  }

  // If here, we are a merc, check if we are in water
  if (pSoldier.value.bOverTerrainType == Enum315.LOW_WATER) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.WATER_HIT, 0, FALSE);
    return;
  }
  if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_WATER_HIT, 0, FALSE);
    return;
  }

  // SWITCH IN TYPE OF WEAPON
  if (Item[usWeaponIndex].usItemClass & (IC_GUN | IC_THROWING_KNIFE)) {
    SoldierGotHitGunFire(pSoldier, usWeaponIndex, sDamage, bDirection, sRange, ubAttackerID, ubSpecial, ubHitLocation);
  }
  if (Item[usWeaponIndex].usItemClass & IC_BLADE) {
    SoldierGotHitBlade(pSoldier, usWeaponIndex, sDamage, bDirection, sRange, ubAttackerID, ubSpecial, ubHitLocation);
  }
  if (Item[usWeaponIndex].usItemClass & IC_EXPLOSV || Item[usWeaponIndex].usItemClass & IC_TENTACLES) {
    SoldierGotHitExplosion(pSoldier, usWeaponIndex, sDamage, bDirection, sRange, ubAttackerID, ubSpecial, ubHitLocation);
  }
  if (Item[usWeaponIndex].usItemClass & IC_PUNCH) {
    SoldierGotHitPunch(pSoldier, usWeaponIndex, sDamage, bDirection, sRange, ubAttackerID, ubSpecial, ubHitLocation);
  }
}

function CalcScreamVolume(pSoldier: Pointer<SOLDIERTYPE>, ubCombinedLoss: UINT8): UINT8 {
  // NB explosions are so loud they should drown out screams
  let ubVolume: UINT8;

  if (ubCombinedLoss < 1) {
    ubVolume = 1;
  } else {
    ubVolume = ubCombinedLoss;
  }

  // Victim yells out in pain, making noise.  Yelps are louder from greater
  // wounds, but softer for more experienced soldiers.

  if (ubVolume > (10 - EffectiveExpLevel(pSoldier))) {
    ubVolume = 10 - EffectiveExpLevel(pSoldier);
  }

  /*
                  // the "Speck factor"...  He's a whiner, and extra-sensitive to pain!
                  if (ptr->trait == NERVOUS)
                          ubVolume += 2;
  */

  if (ubVolume < 0) {
    ubVolume = 0;
  }

  return ubVolume;
}

function DoGenericHit(pSoldier: Pointer<SOLDIERTYPE>, ubSpecial: UINT8, bDirection: INT16): void {
  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      // For now, check if we are affected by a burst
      // For now, if the weapon was a gun, special 1 == burst
      // ATE: Only do this for mercs!
      if (ubSpecial == FIRE_WEAPON_BURST_SPECIAL && pSoldier.value.ubBodyType <= Enum194.REGFEMALE) {
        // SetSoldierDesiredDirection( pSoldier, bDirection );
        EVENT_SetSoldierDirection(pSoldier, bDirection);
        EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.value.bDirection);

        EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING_BURST_HIT, 0, FALSE);
      } else {
        // Check in hand for rifle
        if (SoldierCarriesTwoHandedWeapon(pSoldier)) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.RIFLE_STAND_HIT, 0, FALSE);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, FALSE);
        }
      }
      break;

    case ANIM_PRONE:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_PRONE, 0, FALSE);
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_CROUCH, 0, FALSE);
      break;
  }
}

function SoldierGotHitGunFire(pSoldier: Pointer<SOLDIERTYPE>, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  let usNewGridNo: UINT16;
  let fBlownAway: BOOLEAN = FALSE;
  let fHeadHit: BOOLEAN = FALSE;
  let fFallenOver: BOOLEAN = FALSE;

  // MAYBE CHANGE TO SPECIAL ANIMATION BASED ON VALUE SET BY DAMAGE CALCULATION CODE
  // ALL THESE ONLY WORK ON STANDING PEOPLE
  if (!(pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
    if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
      if (ubSpecial == FIRE_WEAPON_HEAD_EXPLODE_SPECIAL) {
        if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
          if (SpacesAway(pSoldier.value.sGridNo, Menptr[ubAttackerID].sGridNo) <= MAX_DISTANCE_FOR_MESSY_DEATH) {
            usNewGridNo = NewGridNo(pSoldier.value.sGridNo, (DirectionInc(pSoldier.value.bDirection)));

            // CHECK OK DESTINATION!
            if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.value.bLevel, pSoldier.value.bDirection, Enum193.JFK_HITDEATH)) {
              usNewGridNo = NewGridNo(usNewGridNo, (DirectionInc(pSoldier.value.bDirection)));

              if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.value.bLevel, pSoldier.value.bDirection, pSoldier.value.usAnimState)) {
                fHeadHit = TRUE;
              }
            }
          }
        }
      } else if (ubSpecial == FIRE_WEAPON_CHEST_EXPLODE_SPECIAL) {
        if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
          if (SpacesAway(pSoldier.value.sGridNo, Menptr[ubAttackerID].sGridNo) <= MAX_DISTANCE_FOR_MESSY_DEATH) {
            // possibly play torso explosion anim!
            if (pSoldier.value.bDirection == bDirection) {
              usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(gOppositeDirection[pSoldier.value.bDirection]));

              if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.value.bLevel, gOppositeDirection[bDirection], Enum193.FLYBACK_HIT)) {
                usNewGridNo = NewGridNo(usNewGridNo, DirectionInc(gOppositeDirection[bDirection]));

                if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.value.bLevel, gOppositeDirection[bDirection], pSoldier.value.usAnimState)) {
                  fBlownAway = TRUE;
                }
              }
            }
          }
        }
      } else if (ubSpecial == FIRE_WEAPON_LEG_FALLDOWN_SPECIAL) {
        // possibly play fall over anim!
        // this one is NOT restricted by distance
        if (IsValidStance(pSoldier, ANIM_PRONE)) {
          // Can't be in water, or not standing
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND && !MercInWater(pSoldier)) {
            fFallenOver = TRUE;
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[20], pSoldier.value.name);
          }
        }
      }
    }
  }

  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.value.uiStatusFlags & SOLDIER_DEAD) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Releasesoldierattacker,Dead soldier hit"));
    ReleaseSoldiersAttacker(pSoldier);
    return;
  }

  if (fFallenOver) {
    SoldierCollapse(pSoldier);
    return;
  }

  if (fBlownAway) {
    // Only for mercs...
    if (pSoldier.value.ubBodyType < 4) {
      ChangeToFlybackAnimation(pSoldier, bDirection);
      return;
    }
  }

  if (fHeadHit) {
    // Only for mercs ( or KIDS! )
    if (pSoldier.value.ubBodyType < 4 || pSoldier.value.ubBodyType == Enum194.HATKIDCIV || pSoldier.value.ubBodyType == Enum194.KIDCIV) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.JFK_HITDEATH, 0, FALSE);
      return;
    }
  }

  DoGenericHit(pSoldier, ubSpecial, bDirection);
}

function SoldierGotHitExplosion(pSoldier: Pointer<SOLDIERTYPE>, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  let sNewGridNo: INT16;

  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.value.uiStatusFlags & SOLDIER_DEAD) {
    return;
  }

  // check for services
  ReceivingSoldierCancelServices(pSoldier);
  GivingSoldierCancelServices(pSoldier);

  if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
    if (Explosive[Item[usWeaponIndex].ubClassIndex].ubRadius >= 3 && pSoldier.value.bLife == 0 && gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_PRONE) {
      if (sRange >= 2 && sRange <= 4) {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));

        EVENT_InitNewSoldierAnim(pSoldier, Enum193.CHARIOTS_OF_FIRE, 0, FALSE);
        return;
      } else if (sRange <= 1) {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));

        EVENT_InitNewSoldierAnim(pSoldier, Enum193.BODYEXPLODING, 0, FALSE);
        return;
      }
    }
  }

  // If we can't fal back or such, so generic hit...
  if (pSoldier.value.ubBodyType >= 4) {
    DoGenericHit(pSoldier, 0, bDirection);
    return;
  }

  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:
    case ANIM_CROUCH:

      EVENT_SetSoldierDirection(pSoldier, bDirection);
      EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.value.bDirection);

      // Check behind us!
      sNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(gOppositeDirection[bDirection]));

      if (OKFallDirection(pSoldier, sNewGridNo, pSoldier.value.bLevel, gOppositeDirection[bDirection], Enum193.FLYBACK_HIT)) {
        ChangeToFallbackAnimation(pSoldier, bDirection);
      } else {
        if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
          BeginTyingToFall(pSoldier);
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_STAND, 0, FALSE);
        } else {
          SoldierCollapse(pSoldier);
        }
      }
      break;

    case ANIM_PRONE:

      SoldierCollapse(pSoldier);
      break;
  }
}

function SoldierGotHitBlade(pSoldier: Pointer<SOLDIERTYPE>, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.value.uiStatusFlags & SOLDIER_DEAD) {
    return;
  }

  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      // Check in hand for rifle
      if (SoldierCarriesTwoHandedWeapon(pSoldier)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.RIFLE_STAND_HIT, 0, FALSE);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, FALSE);
      }
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_CROUCH, 0, FALSE);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_PRONE, 0, FALSE);
      break;
  }
}

function SoldierGotHitPunch(pSoldier: Pointer<SOLDIERTYPE>, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.value.uiStatusFlags & SOLDIER_DEAD) {
    return;
  }

  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      // Check in hand for rifle
      if (SoldierCarriesTwoHandedWeapon(pSoldier)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.RIFLE_STAND_HIT, 0, FALSE);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, FALSE);
      }
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_CROUCH, 0, FALSE);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_PRONE, 0, FALSE);
      break;
  }
}

function EVENT_InternalGetNewSoldierPath(pSoldier: Pointer<SOLDIERTYPE>, sDestGridNo: UINT16, usMovementAnim: UINT16, fFromUI: BOOLEAN, fForceRestartAnim: BOOLEAN): BOOLEAN {
  let iDest: INT32;
  let sNewGridNo: INT16;
  let fContinue: BOOLEAN;
  let uiDist: UINT32;
  let usAnimState: UINT16;
  let usMoveAnimState: UINT16 = usMovementAnim;
  let sMercGridNo: INT16;
  let usPathingData: UINT16[] /* [MAX_PATH_LIST_SIZE] */;
  let ubPathingMaxDirection: UINT8;
  let fAdvancePath: BOOLEAN = TRUE;
  let fFlags: UINT8 = 0;

  // Ifd this code, make true if a player
  if (fFromUI == 3) {
    if (pSoldier.value.bTeam == gbPlayerNum) {
      fFromUI = 1;
    } else {
      fFromUI = 0;
    }
  }

  // ATE: if a civ, and from UI, and were cowering, remove from cowering
  if (AM_AN_EPC(pSoldier) && fFromUI) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
      SetSoldierCowerState(pSoldier, FALSE);
      usMoveAnimState = Enum193.WALKING;
    }
  }

  pSoldier.value.bGoodContPath = FALSE;

  if (pSoldier.value.fDelayedMovement) {
    if (pSoldier.value.ubDelayedMovementFlags & DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE) {
      fFlags = PATH_THROUGH_PEOPLE;
    } else {
      fFlags = PATH_IGNORE_PERSON_AT_DEST;
    }
    pSoldier.value.fDelayedMovement = FALSE;
  }

  if (gfGetNewPathThroughPeople) {
    fFlags = PATH_THROUGH_PEOPLE;
  }

  // ATE: Some stuff here for realtime, going through interface....
  if ((!(gTacticalStatus.uiFlags & INCOMBAT) && (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_MOVING) && fFromUI == 1) || fFromUI == 2) {
    if (pSoldier.value.bCollapsed) {
      return FALSE;
    }

    sMercGridNo = pSoldier.value.sGridNo;
    pSoldier.value.sGridNo = pSoldier.value.sDestination;

    // Check if path is good before copying it into guy's path...
    if (FindBestPath(pSoldier, sDestGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, fFlags) == 0) {
      // Set to old....
      pSoldier.value.sGridNo = sMercGridNo;

      return FALSE;
    }

    uiDist = FindBestPath(pSoldier, sDestGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, COPYROUTE, fFlags);

    pSoldier.value.sGridNo = sMercGridNo;
    pSoldier.value.sFinalDestination = sDestGridNo;

    if (uiDist > 0) {
      // Add one to path data size....
      if (fAdvancePath) {
        memcpy(usPathingData, pSoldier.value.usPathingData, sizeof(usPathingData));
        ubPathingMaxDirection = usPathingData[MAX_PATH_LIST_SIZE - 1];
        memcpy(addressof(pSoldier.value.usPathingData[1]), usPathingData, sizeof(usPathingData) - sizeof(UINT16));

        // If we have reach the max, go back one sFinalDest....
        if (pSoldier.value.usPathDataSize == MAX_PATH_LIST_SIZE) {
          // pSoldier->sFinalDestination = NewGridNo( (UINT16)pSoldier->sFinalDestination, DirectionInc( gOppositeDirection[ ubPathingMaxDirection ] ) );
        } else {
          pSoldier.value.usPathDataSize++;
        }
      }

      usMoveAnimState = pSoldier.value.usUIMovementMode;

      if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
        usMoveAnimState = Enum193.DEEP_WATER_SWIM;
      }

      // Change animation only.... set value to NOT call any goto new gridno stuff.....
      if (usMoveAnimState != pSoldier.value.usAnimState) {
        //
        pSoldier.value.usDontUpdateNewGridNoOnMoveAnimChange = TRUE;

        EVENT_InitNewSoldierAnim(pSoldier, usMoveAnimState, 0, FALSE);
      }

      return TRUE;
    }

    return FALSE;
  }

  // we can use the soldier's level here because we don't have pathing across levels right now...
  if (pSoldier.value.bPathStored) {
    fContinue = TRUE;
  } else {
    iDest = FindBestPath(pSoldier, sDestGridNo, pSoldier.value.bLevel, usMovementAnim, COPYROUTE, fFlags);
    fContinue = (iDest != 0);
  }

  // Only if we can get a path here
  if (fContinue) {
    // Debug messages
    DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Soldier %d: Get new path", pSoldier.value.ubID));

    // Set final destination
    pSoldier.value.sFinalDestination = sDestGridNo;
    pSoldier.value.fPastXDest = 0;
    pSoldier.value.fPastYDest = 0;

    // CHECK IF FIRST TILE IS FREE
    sNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(pSoldier.value.usPathingData[pSoldier.value.usPathIndex]));

    // If true, we're OK, if not, WAIT for a guy to pass!
    // If we are in deep water, we can only swim!
    if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
      usMoveAnimState = Enum193.DEEP_WATER_SWIM;
    }

    // If we were aiming, end aim!
    usAnimState = PickSoldierReadyAnimation(pSoldier, TRUE);

    // Add a pending animation first!
    // Only if we were standing!
    if (usAnimState != INVALID_ANIMATION && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
      EVENT_InitNewSoldierAnim(pSoldier, usAnimState, 0, FALSE);
      pSoldier.value.usPendingAnimation = usMoveAnimState;
    } else {
      // Call local copy for change soldier state!
      EVENT_InitNewSoldierAnim(pSoldier, usMoveAnimState, 0, fForceRestartAnim);
    }

    // Change desired direction
    // ATE: Here we have a situation where in RT, we may have
    // gotten a new path, but we are alreayd moving.. so
    // at leasty change new dest. This will be redundent if the ANI is a totaly new one

    return TRUE;
  }

  return FALSE;
}

function EVENT_GetNewSoldierPath(pSoldier: Pointer<SOLDIERTYPE>, sDestGridNo: UINT16, usMovementAnim: UINT16): void {
  // ATE: Default restart of animation to TRUE
  EVENT_InternalGetNewSoldierPath(pSoldier, sDestGridNo, usMovementAnim, FALSE, TRUE);
}

// Change our state based on stance, to stop!
function StopSoldier(pSoldier: Pointer<SOLDIERTYPE>): void {
  ReceivingSoldierCancelServices(pSoldier);
  GivingSoldierCancelServices(pSoldier);

  if (!(gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_STATIONARY)) {
    // SoldierGotoStationaryStance( pSoldier );
    EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
  }

  // Set desination
  pSoldier.value.sFinalDestination = pSoldier.value.sGridNo;
}

function SoldierGotoStationaryStance(pSoldier: Pointer<SOLDIERTYPE>): void {
  // ATE: This is to turn off fast movement, that us used to change movement mode
  // for ui display on stance changes....
  if (pSoldier.value.bTeam == gbPlayerNum) {
    // pSoldier->fUIMovementFast = FALSE;
  }

  // The queen, if she sees anybody, goes to ready, not normal breath....
  if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
    if (pSoldier.value.bOppCnt > 0 || pSoldier.value.bTeam == gbPlayerNum) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_READY, 0, TRUE);
      return;
    }
  }

  // Check if we are in deep water!
  if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
    // IN deep water, tred!
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_WATER_TRED, 0, FALSE);
  } else if (pSoldier.value.ubServicePartner != NOBODY && pSoldier.value.bLife >= OKLIFE && pSoldier.value.bBreath > 0) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.GIVING_AID, 0, FALSE);
  } else {
    // Change state back to stationary state for given height
    switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
      case ANIM_STAND:

        // If we are cowering....goto cower state
        if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.START_COWER, 0, FALSE);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, FALSE);
        }
        break;

      case ANIM_CROUCH:

        // If we are cowering....goto cower state
        if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.COWERING, 0, FALSE);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCHING, 0, FALSE);
        }
        break;

      case ANIM_PRONE:
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.PRONE, 0, FALSE);
        break;
    }
  }
}

function ChangeSoldierStance(pSoldier: Pointer<SOLDIERTYPE>, ubDesiredStance: UINT8): void {
  let usNewState: UINT16;

  // Check if they are the same!
  if (ubDesiredStance == gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    // Free up from stance change
    FreeUpNPCFromStanceChange(pSoldier);
    return;
  }

  // Set UI Busy
  SetUIBusy(pSoldier.value.ubID);

  // ATE: If we are an NPC, cower....
  if (pSoldier.value.ubBodyType >= Enum194.FATCIV && pSoldier.value.ubBodyType <= Enum194.KIDCIV) {
    if (ubDesiredStance == ANIM_STAND) {
      SetSoldierCowerState(pSoldier, FALSE);
    } else {
      SetSoldierCowerState(pSoldier, TRUE);
    }
  } else {
    usNewState = GetNewSoldierStateFromNewStance(pSoldier, ubDesiredStance);

    // Set desired stance
    pSoldier.value.ubDesiredHeight = ubDesiredStance;

    // Now change to appropriate animation
    EVENT_InitNewSoldierAnim(pSoldier, usNewState, 0, FALSE);
  }
}

function EVENT_InternalSetSoldierDestination(pSoldier: Pointer<SOLDIERTYPE>, usNewDirection: UINT16, fFromMove: BOOLEAN, usAnimState: UINT16): void {
  let usNewGridNo: UINT16;
  let sXPos: INT16;
  let sYPos: INT16;

  // Get dest gridno, convert to center coords
  usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(usNewDirection));

  ConvertMapPosToWorldTileCenter(usNewGridNo, addressof(sXPos), addressof(sYPos));

  // Save new dest gridno, x, y
  pSoldier.value.sDestination = usNewGridNo;
  pSoldier.value.sDestXPos = sXPos;
  pSoldier.value.sDestYPos = sYPos;

  pSoldier.value.bMovementDirection = usNewDirection;

  // OK, ATE: If we are side_stepping, calculate a NEW desired direction....
  if (pSoldier.value.bReverse && usAnimState == Enum193.SIDE_STEP) {
    let ubPerpDirection: UINT8;

    // Get a new desired direction,
    ubPerpDirection = gPurpendicularDirection[pSoldier.value.bDirection][usNewDirection];

    // CHange actual and desired direction....
    EVENT_SetSoldierDirection(pSoldier, ubPerpDirection);
    pSoldier.value.bDesiredDirection = pSoldier.value.bDirection;
  } else {
    if (!(gAnimControl[usAnimState].uiFlags & ANIM_SPECIALMOVE)) {
      EVENT_InternalSetSoldierDesiredDirection(pSoldier, usNewDirection, fFromMove, usAnimState);
    }
  }
}

function EVENT_SetSoldierDestination(pSoldier: Pointer<SOLDIERTYPE>, usNewDirection: UINT16): void {
  EVENT_InternalSetSoldierDestination(pSoldier, usNewDirection, FALSE, pSoldier.value.usAnimState);
}

// function to determine which direction a creature can turn in
function MultiTiledTurnDirection(pSoldier: Pointer<SOLDIERTYPE>, bStartDirection: INT8, bDesiredDirection: INT8): INT8 {
  let bTurningIncrement: INT8;
  let bCurrentDirection: INT8;
  let bLoop: INT8;
  let usStructureID: UINT16;
  let usAnimSurface: UINT16;
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
  let fOk: BOOLEAN = FALSE;

  // start by trying to turn in quickest direction
  bTurningIncrement = QuickestDirection(bStartDirection, bDesiredDirection);

  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, pSoldier.value.usUIMovementMode);

  pStructureFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, pSoldier.value.usUIMovementMode);
  if (!pStructureFileRef) {
    // without structure data, well, assume quickest direction
    return bTurningIncrement;
  }

  // ATE: Only if we have a levelnode...
  if (pSoldier.value.pLevelNode != NULL && pSoldier.value.pLevelNode.value.pStructureData != NULL) {
    usStructureID = pSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
  } else {
    usStructureID = INVALID_STRUCTURE_ID;
  }

  bLoop = 0;
  bCurrentDirection = bStartDirection;

  while (bLoop < 2) {
    while (bCurrentDirection != bDesiredDirection) {
      bCurrentDirection += bTurningIncrement;

      // did we wrap directions?
      if (bCurrentDirection < 0) {
        bCurrentDirection = (MAXDIR - 1);
      } else if (bCurrentDirection >= MAXDIR) {
        bCurrentDirection = 0;
      }

      // check to see if we can add creature in that direction
      fOk = OkayToAddStructureToWorld(pSoldier.value.sGridNo, pSoldier.value.bLevel, addressof(pStructureFileRef.value.pDBStructureRef[gOneCDirection[bCurrentDirection]]), usStructureID);
      if (!fOk) {
        break;
      }
    }

    if ((bCurrentDirection == bDesiredDirection) && fOk) {
      // success!!
      return bTurningIncrement;
    }

    bLoop++;
    if (bLoop < 2) {
      // change direction of loop etc
      bCurrentDirection = bStartDirection;
      bTurningIncrement *= -1;
    }
  }
  // nothing found... doesn't matter much what we return
  return bTurningIncrement;
}

function EVENT_InternalSetSoldierDesiredDirection(pSoldier: Pointer<SOLDIERTYPE>, usNewDirection: UINT16, fInitalMove: BOOLEAN, usAnimState: UINT16): void {
  // if ( usAnimState == WALK_BACKWARDS )
  if (pSoldier.value.bReverse && usAnimState != Enum193.SIDE_STEP) {
    // OK, check if we are going to go in the exact opposite than our facing....
    usNewDirection = gOppositeDirection[usNewDirection];
  }

  pSoldier.value.bDesiredDirection = usNewDirection;

  // If we are prone, goto crouched first!
  // ONly if we are stationary, and only if directions are differnet!

  // ATE: If we are fNoAPsToFinnishMove, stop what we were doing and
  // reset flag.....
  if (pSoldier.value.fNoAPToFinishMove && (gAnimControl[usAnimState].uiFlags & ANIM_MOVING)) {
    // ATE; Commented this out: NEVER, EVER, start a new anim from this function, as an eternal loop will result....
    // SoldierGotoStationaryStance( pSoldier );
    // Reset flag!
    AdjustNoAPToFinishMove(pSoldier, FALSE);
  }

  if (pSoldier.value.bDesiredDirection != pSoldier.value.bDirection) {
    if (gAnimControl[usAnimState].uiFlags & (ANIM_BREATH | ANIM_OK_CHARGE_AP_FOR_TURN | ANIM_FIREREADY) && !fInitalMove && !pSoldier.value.fDontChargeTurningAPs) {
      // Deduct points for initial turn!
      switch (gAnimControl[usAnimState].ubEndHeight) {
        // Now change to appropriate animation
        case ANIM_STAND:
          DeductPoints(pSoldier, AP_LOOK_STANDING, 0);
          break;

        case ANIM_CROUCH:
          DeductPoints(pSoldier, AP_LOOK_CROUCHED, 0);
          break;

        case ANIM_PRONE:
          DeductPoints(pSoldier, AP_LOOK_PRONE, 0);
          break;
      }
    }

    pSoldier.value.fDontChargeTurningAPs = FALSE;

    if (fInitalMove) {
      if (gAnimControl[usAnimState].ubHeight == ANIM_PRONE) {
        if (pSoldier.value.fTurningFromPronePosition != TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE) {
          pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_START_UP_FROM_MOVE;
        }
      }
    }

    if (gAnimControl[usAnimState].uiFlags & ANIM_STATIONARY || pSoldier.value.fNoAPToFinishMove || fInitalMove) {
      if (gAnimControl[usAnimState].ubHeight == ANIM_PRONE) {
        // Set this beasty of a flag to allow us to go back down to prone if we choose!
        // ATE: Alrighty, set flag to go back down only if we are not moving anywhere
        // if ( pSoldier->sDestination == pSoldier->sGridNo )
        if (!fInitalMove) {
          pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_ON;

          // Set a pending animation to change stance first...
          SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
        }
      }
    }
  }

  // Set desired direction for the extended directions...
  pSoldier.value.ubHiResDesiredDirection = ubExtDirection[pSoldier.value.bDesiredDirection];

  if (pSoldier.value.bDesiredDirection != pSoldier.value.bDirection) {
    if (pSoldier.value.uiStatusFlags & (SOLDIER_VEHICLE) || CREATURE_OR_BLOODCAT(pSoldier)) {
      pSoldier.value.uiStatusFlags |= SOLDIER_PAUSEANIMOVE;
    }
  }

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    pSoldier.value.bTurningIncrement = ExtQuickestDirection(pSoldier.value.ubHiResDirection, pSoldier.value.ubHiResDesiredDirection);
  } else {
    if (pSoldier.value.uiStatusFlags & SOLDIER_MULTITILE) {
      pSoldier.value.bTurningIncrement = MultiTiledTurnDirection(pSoldier, pSoldier.value.bDirection, pSoldier.value.bDesiredDirection);
    } else {
      pSoldier.value.bTurningIncrement = QuickestDirection(pSoldier.value.bDirection, pSoldier.value.bDesiredDirection);
    }
  }
}

function EVENT_SetSoldierDesiredDirection(pSoldier: Pointer<SOLDIERTYPE>, usNewDirection: UINT16): void {
  EVENT_InternalSetSoldierDesiredDirection(pSoldier, usNewDirection, FALSE, pSoldier.value.usAnimState);
}

function EVENT_SetSoldierDirection(pSoldier: Pointer<SOLDIERTYPE>, usNewDirection: UINT16): void {
  // Remove old location data
  HandleAnimationProfile(pSoldier, pSoldier.value.usAnimState, TRUE);

  pSoldier.value.bDirection = usNewDirection;

  // Updated extended direction.....
  pSoldier.value.ubHiResDirection = ubExtDirection[pSoldier.value.bDirection];

  // Add new stuff
  HandleAnimationProfile(pSoldier, pSoldier.value.usAnimState, FALSE);

  // If we are turning, we have chaanged our aim!
  if (!pSoldier.value.fDontUnsetLastTargetFromTurn) {
    pSoldier.value.sLastTarget = NOWHERE;
  }

  AdjustForFastTurnAnimation(pSoldier);

  // Update structure info!
  //	 if ( pSoldier->uiStatusFlags & SOLDIER_MULTITILE )
  { UpdateMercStructureInfo(pSoldier); }

  // Handle Profile data for hit locations
  HandleAnimationProfile(pSoldier, pSoldier.value.usAnimState, TRUE);

  HandleCrowShadowNewDirection(pSoldier);

  // Change values!
  SetSoldierLocatorOffsets(pSoldier);
}

function EVENT_BeginMercTurn(pSoldier: Pointer<SOLDIERTYPE>, fFromRealTime: BOOLEAN, iRealTimeCounter: INT32): void {
  // NB realtimecounter is not used, always passed in as 0 now!

  let iBlood: INT32;

  if (pSoldier.value.bUnderFire) {
    // UnderFire now starts at 2 for "under fire this turn",
    // down to 1 for "under fire last turn", to 0.
    pSoldier.value.bUnderFire--;
  }

  // ATE: Add decay effect sfor drugs...
  if (fFromRealTime) //&& iRealTimeCounter % 300 )
  {
    HandleEndTurnDrugAdjustments(pSoldier);
  } else {
    HandleEndTurnDrugAdjustments(pSoldier);
  }

  // ATE: Don't bleed if in AUTO BANDAGE!
  if (!gTacticalStatus.fAutoBandageMode) {
    // Blood is not for the weak of heart, or mechanical
    if (!(pSoldier.value.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_ROBOT))) {
      if (pSoldier.value.bBleeding || pSoldier.value.bLife < OKLIFE) // is he bleeding or dying?
      {
        iBlood = CheckBleeding(pSoldier); // check if he might lose another life point

        // ATE: Only if in sector!
        if (pSoldier.value.bInSector) {
          if (iBlood != NOBLOOD) {
            DropBlood(pSoldier, iBlood, pSoldier.value.bVisible);
          }
        }
      }
    }
  }

  // survived bleeding, but is he out of breath?
  if (pSoldier.value.bLife && !pSoldier.value.bBreath && MercInWater(pSoldier)) {
    // Drowning...
  }

  // if he is still alive (didn't bleed to death)
  if (pSoldier.value.bLife) {
    // reduce the effects of any residual shock from past injuries by half
    pSoldier.value.bShock /= 2;

    // if this person has heard a noise that hasn't been investigated
    if (pSoldier.value.sNoiseGridno != NOWHERE) {
      if (pSoldier.value.ubNoiseVolume) // and the noise volume is still positive
      {
        pSoldier.value.ubNoiseVolume--; // the volume of the noise "decays" by 1 point

        if (!pSoldier.value.ubNoiseVolume) // if the volume has reached zero
        {
          pSoldier.value.sNoiseGridno = NOWHERE; // forget about the noise!
        }
      }
    }

    // save unused action points up to a maximum
    /*
if ((savedPts = pSoldier->bActionPts) > MAX_AP_CARRIED)
savedPts = MAX_AP_CARRIED;
           */
    if (pSoldier.value.uiStatusFlags & SOLDIER_GASSED) {
      // then must get a gas mask or leave the gassed area to get over it
      if ((pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.GASMASK || pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.GASMASK) || !(GetSmokeEffectOnTile(pSoldier.value.sGridNo, pSoldier.value.bLevel))) {
        // Turn off gassed flag....
        pSoldier.value.uiStatusFlags &= (~SOLDIER_GASSED);
      }
    }

    if (pSoldier.value.bBlindedCounter > 0) {
      pSoldier.value.bBlindedCounter--;
      if (pSoldier.value.bBlindedCounter == 0) {
        // we can SEE!!!!!
        HandleSight(pSoldier, SIGHT_LOOK);
        // Dirty panel
        fInterfacePanelDirty = DIRTYLEVEL2;
      }
    }

    // ATE: To get around a problem...
    // If an AI guy, and we have 0 life, and are still at higher hieght,
    // Kill them.....

    pSoldier.value.sWeightCarriedAtTurnStart = CalculateCarriedWeight(pSoldier);

    UnusedAPsToBreath(pSoldier);

    // Set flag back to normal, after reaching a certain statge
    if (pSoldier.value.bBreath > 80) {
      pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_LOW_BREATH);
    }
    if (pSoldier.value.bBreath > 50) {
      pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_DROWNING);
    }

    if (pSoldier.value.ubTurnsUntilCanSayHeardNoise > 0) {
      pSoldier.value.ubTurnsUntilCanSayHeardNoise--;
    }

    if (pSoldier.value.bInSector) {
      CheckForBreathCollapse(pSoldier);
    }

    CalcNewActionPoints(pSoldier);

    pSoldier.value.bTilesMoved = 0;

    if (pSoldier.value.bInSector) {
      BeginSoldierGetup(pSoldier);

      // CJC Nov 30: handle RT opplist decaying in another function which operates less often
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        VerifyAndDecayOpplist(pSoldier);

        // turn off xray
        if (pSoldier.value.uiXRayActivatedTime) {
          TurnOffXRayEffects(pSoldier);
        }
      }

      if ((pSoldier.value.bTeam == gbPlayerNum) && (pSoldier.value.ubProfile != NO_PROFILE)) {
        switch (gMercProfiles[pSoldier.value.ubProfile].bPersonalityTrait) {
          case Enum270.FEAR_OF_INSECTS:
            if (MercSeesCreature(pSoldier)) {
              HandleMoraleEvent(pSoldier, Enum234.MORALE_INSECT_PHOBIC_SEES_CREATURE, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
              if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
                pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
              }
            }
            break;
          case Enum270.CLAUSTROPHOBIC:
            if (gbWorldSectorZ > 0 && Random(6 - gbWorldSectorZ) == 0) {
              // underground!
              HandleMoraleEvent(pSoldier, Enum234.MORALE_CLAUSTROPHOBE_UNDERGROUND, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
              if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
                pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
              }
            }
            break;
          case Enum270.NERVOUS:
            if (DistanceToClosestFriend(pSoldier) > NERVOUS_RADIUS) {
              // augh!!
              if (pSoldier.value.bMorale < 50) {
                HandleMoraleEvent(pSoldier, Enum234.MORALE_NERVOUS_ALONE, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
                if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
                  TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
                  pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
                }
              }
            } else {
              if (pSoldier.value.bMorale > 45) {
                // turn flag off, so that we say it every two turns
                pSoldier.value.usQuoteSaidFlags &= ~SOLDIER_QUOTE_SAID_PERSONALITY;
              }
            }
            break;
        }
      }
    }

    // Reset quote flags for under heavy fire and close call!
    pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_BEING_PUMMELED);
    pSoldier.value.usQuoteSaidExtFlags &= (~SOLDIER_QUOTE_SAID_EXT_CLOSE_CALL);
    pSoldier.value.bNumHitsThisTurn = 0;
    pSoldier.value.ubSuppressionPoints = 0;
    pSoldier.value.fCloseCall = FALSE;

    pSoldier.value.ubMovementNoiseHeard = 0;

    // If soldier has new APs, reset flags!
    if (pSoldier.value.bActionPoints > 0) {
      pSoldier.value.fUIFirstTimeNOAP = FALSE;
      pSoldier.value.bMoved = FALSE;
      pSoldier.value.bPassedLastInterrupt = FALSE;
    }
  }
}

// UTILITY FUNCTIONS CALLED BY OVERHEAD.H
let gDirectionFrom8to2: UINT8[] /* [] */ = [
  0,
  0,
  1,
  1,
  0,
  1,
  1,
  0,
];

function ConvertAniCodeToAniFrame(pSoldier: Pointer<SOLDIERTYPE>, usAniFrame: UINT16): BOOLEAN {
  let usAnimSurface: UINT16;
  let ubTempDir: UINT8;
  // Given ani code, adjust for facing direction

  // get anim surface and determine # of frames
  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  CHECKF(usAnimSurface != INVALID_ANIMATION_SURFACE);

  // COnvert world direction into sprite direction
  ubTempDir = gOneCDirection[pSoldier.value.bDirection];

  // If we are only one frame, ignore what the script is telling us!
  if (gAnimSurfaceDatabase[usAnimSurface].ubFlags & ANIM_DATA_FLAG_NOFRAMES) {
    usAniFrame = 0;
  }

  if (gAnimSurfaceDatabase[usAnimSurface].uiNumDirections == 32) {
    ubTempDir = gExtOneCDirection[pSoldier.value.ubHiResDirection];
  }
  // Check # of directions /surface, adjust if ness.
  else if (gAnimSurfaceDatabase[usAnimSurface].uiNumDirections == 4) {
    ubTempDir = ubTempDir / 2;
  }
  // Check # of directions /surface, adjust if ness.
  else if (gAnimSurfaceDatabase[usAnimSurface].uiNumDirections == 1) {
    ubTempDir = 0;
  }
  // Check # of directions /surface, adjust if ness.
  else if (gAnimSurfaceDatabase[usAnimSurface].uiNumDirections == 3) {
    if (pSoldier.value.bDirection == Enum245.NORTHWEST) {
      ubTempDir = 1;
    }
    if (pSoldier.value.bDirection == Enum245.WEST) {
      ubTempDir = 0;
    }
    if (pSoldier.value.bDirection == Enum245.EAST) {
      ubTempDir = 2;
    }
  } else if (gAnimSurfaceDatabase[usAnimSurface].uiNumDirections == 2) {
    ubTempDir = gDirectionFrom8to2[pSoldier.value.bDirection];
  }

  pSoldier.value.usAniFrame = usAniFrame + ((gAnimSurfaceDatabase[usAnimSurface].uiNumFramesPerDir * ubTempDir));

  if (gAnimSurfaceDatabase[usAnimSurface].hVideoObject == NULL) {
    pSoldier.value.usAniFrame = 0;
    return TRUE;
  }

  if (pSoldier.value.usAniFrame >= gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.usNumberOfObjects) {
    // Debug msg here....
    //		ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, L"Soldier Animation: Wrong Number of frames per number of objects: %d vs %d, %S",  gAnimSurfaceDatabase[ usAnimSurface ].uiNumFramesPerDir, gAnimSurfaceDatabase[ usAnimSurface ].hVideoObject->usNumberOfObjects, gAnimControl[ pSoldier->usAnimState ].zAnimStr );

    pSoldier.value.usAniFrame = 0;
  }

  return TRUE;
}

function TurnSoldier(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sDirection: INT16;
  let fDoDirectionChange: BOOLEAN = TRUE;
  let cnt: INT32;

  // If we are a vehicle... DON'T TURN!
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    if (pSoldier.value.ubBodyType != Enum194.TANK_NW && pSoldier.value.ubBodyType != Enum194.TANK_NE) {
      return;
    }
  }

  // We handle sight now....
  if (pSoldier.value.uiStatusFlags & SOLDIER_LOOK_NEXT_TURNSOLDIER) {
    if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_STATIONARY && pSoldier.value.usAnimState != Enum193.CLIMBUPROOF && pSoldier.value.usAnimState != Enum193.CLIMBDOWNROOF)) {
      // HANDLE SIGHT!
      HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO);
    }
    // Turn off!
    pSoldier.value.uiStatusFlags &= (~SOLDIER_LOOK_NEXT_TURNSOLDIER);

    HandleSystemNewAISituation(pSoldier, FALSE);
  }

  if (pSoldier.value.fTurningToShoot) {
    if (pSoldier.value.bDirection == pSoldier.value.bDesiredDirection) {
      if (((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_FIREREADY) && !pSoldier.value.fTurningFromPronePosition) || pSoldier.value.ubBodyType == Enum194.ROBOTNOWEAPON || pSoldier.value.ubBodyType == Enum194.TANK_NW || pSoldier.value.ubBodyType == Enum194.TANK_NE) {
        EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, gAnimControl[pSoldier.value.usAnimState].ubEndHeight), 0, FALSE);
        pSoldier.value.fTurningToShoot = FALSE;

        // Save last target gridno!
        // pSoldier->sLastTarget = pSoldier->sTargetGridNo;
      }
      // Else check if we are trying to shoot and once was prone, but am now crouched because we needed to turn...
      else if (pSoldier.value.fTurningFromPronePosition) {
        if (IsValidStance(pSoldier, ANIM_PRONE)) {
          SendChangeSoldierStanceEvent(pSoldier, ANIM_PRONE);
          pSoldier.value.usPendingAnimation = SelectFireAnimation(pSoldier, ANIM_PRONE);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, ANIM_CROUCH), 0, FALSE);
        }
        pSoldier.value.fTurningToShoot = FALSE;
        pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
      }
    }
  }

  if (pSoldier.value.fTurningToFall) {
    if (pSoldier.value.bDirection == pSoldier.value.bDesiredDirection) {
      SelectFallAnimation(pSoldier);
      pSoldier.value.fTurningToFall = FALSE;
    }
  }

  if (pSoldier.value.fTurningUntilDone && (pSoldier.value.ubPendingStanceChange != NO_PENDING_STANCE)) {
    if (pSoldier.value.bDirection == pSoldier.value.bDesiredDirection) {
      SendChangeSoldierStanceEvent(pSoldier, pSoldier.value.ubPendingStanceChange);
      pSoldier.value.ubPendingStanceChange = NO_PENDING_STANCE;
      pSoldier.value.fTurningUntilDone = FALSE;
    }
  }

  if (pSoldier.value.fTurningUntilDone && (pSoldier.value.usPendingAnimation != NO_PENDING_ANIMATION)) {
    if (pSoldier.value.bDirection == pSoldier.value.bDesiredDirection) {
      let usPendingAnimation: UINT16;

      usPendingAnimation = pSoldier.value.usPendingAnimation;
      pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;

      EVENT_InitNewSoldierAnim(pSoldier, usPendingAnimation, 0, FALSE);
      pSoldier.value.fTurningUntilDone = FALSE;
    }
  }

  // Don't do anything if we are at dest direction!
  if (pSoldier.value.bDirection == pSoldier.value.bDesiredDirection) {
    if (pSoldier.value.ubBodyType == Enum194.TANK_NW || pSoldier.value.ubBodyType == Enum194.TANK_NE) {
      if (pSoldier.value.iTuringSoundID != NO_SAMPLE) {
        SoundStop(pSoldier.value.iTuringSoundID);
        pSoldier.value.iTuringSoundID = NO_SAMPLE;

        PlaySoldierJA2Sample(pSoldier.value.ubID, Enum330.TURRET_STOP, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo), TRUE);
      }
    }

    // Turn off!
    pSoldier.value.uiStatusFlags &= (~SOLDIER_LOOK_NEXT_TURNSOLDIER);
    pSoldier.value.fDontUnsetLastTargetFromTurn = FALSE;

    // Unset ui busy if from ui
    if (pSoldier.value.bTurningFromUI && (pSoldier.value.fTurningFromPronePosition != 3) && (pSoldier.value.fTurningFromPronePosition != 1)) {
      UnSetUIBusy(pSoldier.value.ubID);
      pSoldier.value.bTurningFromUI = FALSE;
    }

    if (pSoldier.value.uiStatusFlags & (SOLDIER_VEHICLE) || CREATURE_OR_BLOODCAT(pSoldier)) {
      pSoldier.value.uiStatusFlags &= (~SOLDIER_PAUSEANIMOVE);
    }

    FreeUpNPCFromTurning(pSoldier, LOOK);

    // Undo our flag for prone turning...
    // Else check if we are trying to shoot and once was prone, but am now crouched because we needed to turn...
    if (pSoldier.value.fTurningFromPronePosition == TURNING_FROM_PRONE_ON) {
      // ATE: Don't do this if we have something in our hands we are going to throw!
      if (IsValidStance(pSoldier, ANIM_PRONE) && pSoldier.value.pTempObject == NULL) {
        SendChangeSoldierStanceEvent(pSoldier, ANIM_PRONE);
      }
      pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
    }

    // If a special code, make guy crawl after stance change!
    if (pSoldier.value.fTurningFromPronePosition == TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE && pSoldier.value.usAnimState != Enum193.PRONE_UP && pSoldier.value.usAnimState != Enum193.PRONE_DOWN) {
      if (IsValidStance(pSoldier, ANIM_PRONE)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRAWLING, 0, FALSE);
      }
    }

    if (pSoldier.value.uiStatusFlags & SOLDIER_TURNINGFROMHIT) {
      if (pSoldier.value.fGettingHit == 1) {
        if (pSoldier.value.usPendingAnimation != Enum193.FALLFORWARD_ROOF && pSoldier.value.usPendingAnimation != Enum193.FALLOFF && pSoldier.value.usAnimState != Enum193.FALLFORWARD_ROOF && pSoldier.value.usAnimState != Enum193.FALLOFF) {
          // Go back to original direction
          EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.value.uiPendingActionData1);

          // SETUP GETTING HIT FLAG TO 2
          pSoldier.value.fGettingHit = 2;
        } else {
          pSoldier.value.uiStatusFlags &= (~SOLDIER_TURNINGFROMHIT);
        }
      } else if (pSoldier.value.fGettingHit == 2) {
        // Turn off
        pSoldier.value.uiStatusFlags &= (~SOLDIER_TURNINGFROMHIT);

        // Release attacker
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Releasesoldierattacker, turning from hit animation ended"));
        ReleaseSoldiersAttacker(pSoldier);

        // FREEUP GETTING HIT FLAG
        pSoldier.value.fGettingHit = FALSE;
      }
    }

    return;
  }

  // IF WE ARE HERE, WE ARE IN THE PROCESS OF TURNING

  // DOUBLE CHECK TO UNSET fNOAPs...
  if (pSoldier.value.fNoAPToFinishMove) {
    AdjustNoAPToFinishMove(pSoldier, FALSE);
  }

  // Do something different for vehicles....
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    fDoDirectionChange = FALSE;

    // Get new direction
    /*
    sDirection = pSoldier->ubHiResDirection + ExtQuickestDirection( pSoldier->ubHiResDirection, pSoldier->ubHiResDesiredDirection );
    */
    sDirection = pSoldier.value.ubHiResDirection + pSoldier.value.bTurningIncrement;
    if (sDirection > 31) {
      sDirection = 0;
    } else {
      if (sDirection < 0) {
        sDirection = 31;
      }
    }
    pSoldier.value.ubHiResDirection = sDirection;

    // Are we at a multiple of a 'cardnal' direction?
    for (cnt = 0; cnt < 8; cnt++) {
      if (sDirection == ubExtDirection[cnt]) {
        fDoDirectionChange = TRUE;

        sDirection = cnt;

        break;
      }
    }

    if (pSoldier.value.ubBodyType == Enum194.TANK_NW || pSoldier.value.ubBodyType == Enum194.TANK_NE) {
      if (pSoldier.value.iTuringSoundID == NO_SAMPLE) {
        pSoldier.value.iTuringSoundID = PlaySoldierJA2Sample(pSoldier.value.ubID, Enum330.TURRET_MOVE, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 100, SoundDir(pSoldier.value.sGridNo), TRUE);
      }
    }
  } else {
    // Get new direction
    // sDirection = pSoldier->bDirection + QuickestDirection( pSoldier->bDirection, pSoldier->bDesiredDirection );
    sDirection = pSoldier.value.bDirection + pSoldier.value.bTurningIncrement;
    if (sDirection > 7) {
      sDirection = 0;
    } else {
      if (sDirection < 0) {
        sDirection = 7;
      }
    }
  }

  // CHECK FOR A VALID TURN DIRECTION
  // This is needed for prone animations as well as any multi-tiled structs
  if (fDoDirectionChange) {
    if (OKToAddMercToWorld(pSoldier, sDirection)) {
      // Don't do this if we are walkoing off screen...
      if (gubWaitingForAllMercsToExitCode == Enum238.WAIT_FOR_MERCS_TO_WALKOFF_SCREEN || gubWaitingForAllMercsToExitCode == Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO) {
      } else {
        // ATE: We should only do this if we are STATIONARY!
        if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_STATIONARY)) {
          pSoldier.value.uiStatusFlags |= SOLDIER_LOOK_NEXT_TURNSOLDIER;
        }
        // otherwise, it's handled next tile...
      }

      EVENT_SetSoldierDirection(pSoldier, sDirection);

      if (pSoldier.value.ubBodyType != Enum194.LARVAE_MONSTER && !MercInWater(pSoldier) && pSoldier.value.bOverTerrainType != Enum315.DIRT_ROAD && pSoldier.value.bOverTerrainType != Enum315.PAVED_ROAD) {
        PlaySoldierFootstepSound(pSoldier);
      }
    } else {
      // Are we prone crawling?
      if (pSoldier.value.usAnimState == Enum193.CRAWLING) {
        // OK, we want to getup, turn and go prone again....
        SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
        pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE;
      }
      // If we are a creature, or multi-tiled, cancel AI action.....?
      else if (pSoldier.value.uiStatusFlags & SOLDIER_MULTITILE) {
        pSoldier.value.bDesiredDirection = pSoldier.value.bDirection;
      }
    }
  }
}

let gRedGlowR: UINT8[] /* [] */ = [
  0, // Normal shades
  25,
  50,
  75,
  100,
  125,
  150,
  175,
  200,
  225,

  0, // For gray palettes
  25,
  50,
  75,
  100,
  125,
  150,
  175,
  200,
  225,
];

let gOrangeGlowR: UINT8[] /* [] */ = [
  0, // Normal shades
  25,
  50,
  75,
  100,
  125,
  150,
  175,
  200,
  225,

  0, // For gray palettes
  25,
  50,
  75,
  100,
  125,
  150,
  175,
  200,
  225,
];

let gOrangeGlowG: UINT8[] /* [] */ = [
  0, // Normal shades
  20,
  40,
  60,
  80,
  100,
  120,
  140,
  160,
  180,

  0, // For gray palettes
  20,
  40,
  60,
  80,
  100,
  120,
  140,
  160,
  180,
];

function CreateSoldierPalettes(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let usAnimSurface: UINT16;
  let usPaletteAnimSurface: UINT16;
  let zColFilename: CHAR8[] /* [100] */;
  let iWhich: INT32;
  let cnt: INT32;
  let bBodyTypePalette: INT8;
  let Temp8BPPPalette: SGPPaletteEntry[] /* [256] */;

  // NT32 uiCount;
  // PPaletteEntry Pal[256];

  if (pSoldier.value.p8BPPPalette != NULL) {
    MemFree(pSoldier.value.p8BPPPalette);
    pSoldier.value.p8BPPPalette = NULL;
  }

  // Allocate mem for new palette
  pSoldier.value.p8BPPPalette = MemAlloc(sizeof(SGPPaletteEntry) * 256);
  memset(pSoldier.value.p8BPPPalette, 0, sizeof(SGPPaletteEntry) * 256);

  CHECKF(pSoldier.value.p8BPPPalette != NULL);

  // --- TAKE FROM CURRENT ANIMATION HVOBJECT!
  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  CHECKF(usAnimSurface != INVALID_ANIMATION_SURFACE);

  if ((bBodyTypePalette = GetBodyTypePaletteSubstitutionCode(pSoldier, pSoldier.value.ubBodyType, zColFilename)) == -1) {
    // ATE: here we want to use the breath cycle for the palette.....
    usPaletteAnimSurface = LoadSoldierAnimationSurface(pSoldier, Enum193.STANDING);

    if (usPaletteAnimSurface != INVALID_ANIMATION_SURFACE) {
      // Use palette from HVOBJECT, then use substitution for pants, etc
      memcpy(pSoldier.value.p8BPPPalette, gAnimSurfaceDatabase[usPaletteAnimSurface].hVideoObject.value.pPaletteEntry, sizeof(pSoldier.value.p8BPPPalette) * 256);

      // Substitute based on head, etc
      SetPaletteReplacement(pSoldier.value.p8BPPPalette, pSoldier.value.HeadPal);
      SetPaletteReplacement(pSoldier.value.p8BPPPalette, pSoldier.value.VestPal);
      SetPaletteReplacement(pSoldier.value.p8BPPPalette, pSoldier.value.PantsPal);
      SetPaletteReplacement(pSoldier.value.p8BPPPalette, pSoldier.value.SkinPal);
    }
  } else if (bBodyTypePalette == 0) {
    // Use palette from hvobject
    memcpy(pSoldier.value.p8BPPPalette, gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pPaletteEntry, sizeof(pSoldier.value.p8BPPPalette) * 256);
  } else {
    // Use col file
    if (CreateSGPPaletteFromCOLFile(Temp8BPPPalette, zColFilename)) {
      // Copy into palette
      memcpy(pSoldier.value.p8BPPPalette, Temp8BPPPalette, sizeof(pSoldier.value.p8BPPPalette) * 256);
    } else {
      // Use palette from hvobject
      memcpy(pSoldier.value.p8BPPPalette, gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pPaletteEntry, sizeof(pSoldier.value.p8BPPPalette) * 256);
    }
  }

  if (pSoldier.value.p16BPPPalette != NULL) {
    MemFree(pSoldier.value.p16BPPPalette);
    pSoldier.value.p16BPPPalette = NULL;
  }

  // -- BUILD 16BPP Palette from this
  pSoldier.value.p16BPPPalette = Create16BPPPalette(pSoldier.value.p8BPPPalette);

  for (iWhich = 0; iWhich < NUM_SOLDIER_SHADES; iWhich++) {
    if (pSoldier.value.pShades[iWhich] != NULL) {
      MemFree(pSoldier.value.pShades[iWhich]);
      pSoldier.value.pShades[iWhich] = NULL;
    }
  }

  for (iWhich = 0; iWhich < NUM_SOLDIER_EFFECTSHADES; iWhich++) {
    if (pSoldier.value.pEffectShades[iWhich] != NULL) {
      MemFree(pSoldier.value.pEffectShades[iWhich]);
      pSoldier.value.pEffectShades[iWhich] = NULL;
    }
  }

  for (iWhich = 0; iWhich < 20; iWhich++) {
    if (pSoldier.value.pGlowShades[iWhich] != NULL) {
      MemFree(pSoldier.value.pGlowShades[iWhich]);
      pSoldier.value.pGlowShades[iWhich] = NULL;
    }
  }

  CreateSoldierPaletteTables(pSoldier, HVOBJECT_GLOW_GREEN);

  // Build a grayscale palette for testing grayout of mercs
  // for(uiCount=0; uiCount < 256; uiCount++)
  //{
  //	Pal[uiCount].peRed=(UINT8)(uiCount%128)+128;
  //	Pal[uiCount].peGreen=(UINT8)(uiCount%128)+128;
  //	Pal[uiCount].peBlue=(UINT8)(uiCount%128)+128;
  //}
  pSoldier.value.pEffectShades[0] = Create16BPPPaletteShaded(pSoldier.value.p8BPPPalette, 100, 100, 100, TRUE);
  pSoldier.value.pEffectShades[1] = Create16BPPPaletteShaded(pSoldier.value.p8BPPPalette, 100, 150, 100, TRUE);

  // Build shades for glowing visible bad guy

  // First do visible guy
  pSoldier.value.pGlowShades[0] = Create16BPPPaletteShaded(pSoldier.value.p8BPPPalette, 255, 255, 255, FALSE);
  for (cnt = 1; cnt < 10; cnt++) {
    pSoldier.value.pGlowShades[cnt] = CreateEnemyGlow16BPPPalette(pSoldier.value.p8BPPPalette, gRedGlowR[cnt], 255, FALSE);
  }

  // Now for gray guy...
  pSoldier.value.pGlowShades[10] = Create16BPPPaletteShaded(pSoldier.value.p8BPPPalette, 100, 100, 100, TRUE);
  for (cnt = 11; cnt < 19; cnt++) {
    pSoldier.value.pGlowShades[cnt] = CreateEnemyGreyGlow16BPPPalette(pSoldier.value.p8BPPPalette, gRedGlowR[cnt], 0, FALSE);
  }
  pSoldier.value.pGlowShades[19] = CreateEnemyGreyGlow16BPPPalette(pSoldier.value.p8BPPPalette, gRedGlowR[18], 0, FALSE);

  // ATE: OK, piggyback on the shades we are not using for 2 colored lighting....
  // ORANGE, VISIBLE GUY
  pSoldier.value.pShades[20] = Create16BPPPaletteShaded(pSoldier.value.p8BPPPalette, 255, 255, 255, FALSE);
  for (cnt = 21; cnt < 30; cnt++) {
    pSoldier.value.pShades[cnt] = CreateEnemyGlow16BPPPalette(pSoldier.value.p8BPPPalette, gOrangeGlowR[(cnt - 20)], gOrangeGlowG[(cnt - 20)], TRUE);
  }

  // ORANGE, GREY GUY
  pSoldier.value.pShades[30] = Create16BPPPaletteShaded(pSoldier.value.p8BPPPalette, 100, 100, 100, TRUE);
  for (cnt = 31; cnt < 39; cnt++) {
    pSoldier.value.pShades[cnt] = CreateEnemyGreyGlow16BPPPalette(pSoldier.value.p8BPPPalette, gOrangeGlowR[(cnt - 20)], gOrangeGlowG[(cnt - 20)], TRUE);
  }
  pSoldier.value.pShades[39] = CreateEnemyGreyGlow16BPPPalette(pSoldier.value.p8BPPPalette, gOrangeGlowR[18], gOrangeGlowG[18], TRUE);

  return TRUE;
}

function AdjustAniSpeed(pSoldier: Pointer<SOLDIERTYPE>): void {
  if ((gTacticalStatus.uiFlags & SLOW_ANIMATION)) {
    if (gTacticalStatus.bRealtimeSpeed == -1) {
      pSoldier.value.sAniDelay = 10000;
    } else {
      pSoldier.value.sAniDelay = pSoldier.value.sAniDelay * (1 * gTacticalStatus.bRealtimeSpeed / 2);
    }
  }

  RESETTIMECOUNTER(pSoldier.value.UpdateCounter, pSoldier.value.sAniDelay);
}

function CalculateSoldierAniSpeed(pSoldier: Pointer<SOLDIERTYPE>, pStatsSoldier: Pointer<SOLDIERTYPE>): void {
  let uiTerrainDelay: UINT32;
  let uiSpeed: UINT32 = 0;

  let bBreathDef: INT8;
  let bLifeDef: INT8;
  let bAgilDef: INT8;
  let bAdditional: INT8 = 0;

  // for those animations which have a speed of zero, we have to calculate it
  // here. Some animation, such as water-movement, have an ADDITIONAL speed
  switch (pSoldier.value.usAnimState) {
    case Enum193.PRONE:
    case Enum193.STANDING:

      pSoldier.value.sAniDelay = (pStatsSoldier.value.bBreath * 2) + (100 - pStatsSoldier.value.bLife);

      // Limit it!
      if (pSoldier.value.sAniDelay < 40) {
        pSoldier.value.sAniDelay = 40;
      }
      AdjustAniSpeed(pSoldier);
      return;

    case Enum193.CROUCHING:

      pSoldier.value.sAniDelay = (pStatsSoldier.value.bBreath * 2) + ((100 - pStatsSoldier.value.bLife));

      // Limit it!
      if (pSoldier.value.sAniDelay < 40) {
        pSoldier.value.sAniDelay = 40;
      }
      AdjustAniSpeed(pSoldier);
      return;

    case Enum193.WALKING:

      // Adjust based on body type
      bAdditional = (gubAnimWalkSpeeds[pStatsSoldier.value.ubBodyType].sSpeed);
      if (bAdditional < 0)
        bAdditional = 0;
      break;

    case Enum193.RUNNING:

      // Adjust based on body type
      bAdditional = gubAnimRunSpeeds[pStatsSoldier.value.ubBodyType].sSpeed;
      if (bAdditional < 0)
        bAdditional = 0;
      break;

    case Enum193.SWATTING:

      // Adjust based on body type
      if (pStatsSoldier.value.ubBodyType <= Enum194.REGFEMALE) {
        bAdditional = gubAnimSwatSpeeds[pStatsSoldier.value.ubBodyType].sSpeed;
        if (bAdditional < 0)
          bAdditional = 0;
      }
      break;

    case Enum193.CRAWLING:

      // Adjust based on body type
      if (pStatsSoldier.value.ubBodyType <= Enum194.REGFEMALE) {
        bAdditional = gubAnimCrawlSpeeds[pStatsSoldier.value.ubBodyType].sSpeed;
        if (bAdditional < 0)
          bAdditional = 0;
      }
      break;

    case Enum193.READY_RIFLE_STAND:

      // Raise rifle based on aim vs non-aim.
      if (pSoldier.value.bAimTime == 0) {
        // Quick shot
        pSoldier.value.sAniDelay = 70;
      } else {
        pSoldier.value.sAniDelay = 150;
      }
      AdjustAniSpeed(pSoldier);
      return;
  }

  // figure out movement speed (terrspeed)
  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_MOVING) {
    uiSpeed = gsTerrainTypeSpeedModifiers[pStatsSoldier.value.bOverTerrainType];

    uiTerrainDelay = uiSpeed;
  } else {
    uiTerrainDelay = 40; // standing still
  }

  bBreathDef = 50 - (pStatsSoldier.value.bBreath / 2);

  if (bBreathDef > 30)
    bBreathDef = 30;

  bAgilDef = 50 - (EffectiveAgility(pStatsSoldier) / 4);
  bLifeDef = 50 - (pStatsSoldier.value.bLife / 2);

  uiTerrainDelay += (bLifeDef + bBreathDef + bAgilDef + bAdditional);

  pSoldier.value.sAniDelay = uiTerrainDelay;

  // If a moving animation and w/re on drugs, increase speed....
  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_MOVING) {
    if (GetDrugEffect(pSoldier, DRUG_TYPE_ADRENALINE)) {
      pSoldier.value.sAniDelay = pSoldier.value.sAniDelay / 2;
    }
  }

  // MODIFTY NOW BASED ON REAL-TIME, ETC
  // Adjust speed, make twice as fast if in turn-based!
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    pSoldier.value.sAniDelay = pSoldier.value.sAniDelay / 2;
  }

  // MODIFY IF REALTIME COMBAT
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // ATE: If realtime, and stealth mode...
    if (pStatsSoldier.value.bStealthMode) {
      pSoldier.value.sAniDelay = (pSoldier.value.sAniDelay * 2);
    }

    // pSoldier->sAniDelay = pSoldier->sAniDelay * ( 1 * gTacticalStatus.bRealtimeSpeed / 2 );
  }
}

function SetSoldierAniSpeed(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pStatsSoldier: Pointer<SOLDIERTYPE>;

  // ATE: If we are an enemy and are not visible......
  // Set speed to 0
  if ((gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) || gTacticalStatus.fAutoBandageMode) {
    if (((pSoldier.value.bVisible == -1 && pSoldier.value.bVisible == pSoldier.value.bLastRenderVisibleValue) || gTacticalStatus.fAutoBandageMode) && pSoldier.value.usAnimState != Enum193.MONSTER_UP) {
      pSoldier.value.sAniDelay = 0;
      RESETTIMECOUNTER(pSoldier.value.UpdateCounter, pSoldier.value.sAniDelay);
      return;
    }
  }

  // Default stats soldier to same as normal soldier.....
  pStatsSoldier = pSoldier;

  if (pSoldier.value.fUseMoverrideMoveSpeed) {
    pStatsSoldier = MercPtrs[pSoldier.value.bOverrideMoveSpeed];
  }

  // Only calculate if set to zero
  if ((pSoldier.value.sAniDelay = gAnimControl[pSoldier.value.usAnimState].sSpeed) == 0) {
    CalculateSoldierAniSpeed(pSoldier, pStatsSoldier);
  }

  AdjustAniSpeed(pSoldier);

  if (_KeyDown(SPACE)) {
    // pSoldier->sAniDelay = 1000;
  }
}

///////////////////////////////////////////////////////
// PALETTE REPLACEMENT FUNCTIONS
///////////////////////////////////////////////////////
function LoadPaletteData(): BOOLEAN {
  let hFile: HWFILE;
  let cnt: UINT32;
  let cnt2: UINT32;

  hFile = FileOpen(PALETTEFILENAME, FILE_ACCESS_READ, FALSE);

  // Read # of types
  if (!FileRead(hFile, addressof(guiNumPaletteSubRanges), sizeof(guiNumPaletteSubRanges), NULL)) {
    return FALSE;
  }

  // Malloc!
  gpPaletteSubRanges = MemAlloc(sizeof(PaletteSubRangeType) * guiNumPaletteSubRanges);
  gubpNumReplacementsPerRange = MemAlloc(sizeof(UINT8) * guiNumPaletteSubRanges);

  // Read # of types for each!
  for (cnt = 0; cnt < guiNumPaletteSubRanges; cnt++) {
    if (!FileRead(hFile, addressof(gubpNumReplacementsPerRange[cnt]), sizeof(UINT8), NULL)) {
      return FALSE;
    }
  }

  // Loop for each one, read in data
  for (cnt = 0; cnt < guiNumPaletteSubRanges; cnt++) {
    if (!FileRead(hFile, addressof(gpPaletteSubRanges[cnt].ubStart), sizeof(UINT8), NULL)) {
      return FALSE;
    }
    if (!FileRead(hFile, addressof(gpPaletteSubRanges[cnt].ubEnd), sizeof(UINT8), NULL)) {
      return FALSE;
    }
  }

  // Read # of palettes
  if (!FileRead(hFile, addressof(guiNumReplacements), sizeof(guiNumReplacements), NULL)) {
    return FALSE;
  }

  // Malloc!
  gpPalRep = MemAlloc(sizeof(PaletteReplacementType) * guiNumReplacements);

  // Read!
  for (cnt = 0; cnt < guiNumReplacements; cnt++) {
    // type
    if (!FileRead(hFile, addressof(gpPalRep[cnt].ubType), sizeof(gpPalRep[cnt].ubType), NULL)) {
      return FALSE;
    }

    if (!FileRead(hFile, addressof(gpPalRep[cnt].ID), sizeof(gpPalRep[cnt].ID), NULL)) {
      return FALSE;
    }

    // # entries
    if (!FileRead(hFile, addressof(gpPalRep[cnt].ubPaletteSize), sizeof(gpPalRep[cnt].ubPaletteSize), NULL)) {
      return FALSE;
    }

    // Malloc
    gpPalRep[cnt].r = MemAlloc(gpPalRep[cnt].ubPaletteSize);
    CHECKF(gpPalRep[cnt].r != NULL);
    gpPalRep[cnt].g = MemAlloc(gpPalRep[cnt].ubPaletteSize);
    CHECKF(gpPalRep[cnt].g != NULL);
    gpPalRep[cnt].b = MemAlloc(gpPalRep[cnt].ubPaletteSize);
    CHECKF(gpPalRep[cnt].b != NULL);

    for (cnt2 = 0; cnt2 < gpPalRep[cnt].ubPaletteSize; cnt2++) {
      if (!FileRead(hFile, addressof(gpPalRep[cnt].r[cnt2]), sizeof(UINT8), NULL)) {
        return FALSE;
      }
      if (!FileRead(hFile, addressof(gpPalRep[cnt].g[cnt2]), sizeof(UINT8), NULL)) {
        return FALSE;
      }
      if (!FileRead(hFile, addressof(gpPalRep[cnt].b[cnt2]), sizeof(UINT8), NULL)) {
        return FALSE;
      }
    }
  }

  FileClose(hFile);

  return TRUE;
}

function SetPaletteReplacement(p8BPPPalette: Pointer<SGPPaletteEntry>, aPalRep: PaletteRepID): BOOLEAN {
  let cnt2: UINT32;
  let ubType: UINT8;
  let ubPalIndex: UINT8;

  CHECKF(GetPaletteRepIndexFromID(aPalRep, addressof(ubPalIndex)));

  // Get range type
  ubType = gpPalRep[ubPalIndex].ubType;

  for (cnt2 = gpPaletteSubRanges[ubType].ubStart; cnt2 <= gpPaletteSubRanges[ubType].ubEnd; cnt2++) {
    p8BPPPalette[cnt2].peRed = gpPalRep[ubPalIndex].r[cnt2 - gpPaletteSubRanges[ubType].ubStart];
    p8BPPPalette[cnt2].peGreen = gpPalRep[ubPalIndex].g[cnt2 - gpPaletteSubRanges[ubType].ubStart];
    p8BPPPalette[cnt2].peBlue = gpPalRep[ubPalIndex].b[cnt2 - gpPaletteSubRanges[ubType].ubStart];
  }

  return TRUE;
}

function DeletePaletteData(): BOOLEAN {
  let cnt: UINT32;

  // Free!
  if (gpPaletteSubRanges != NULL) {
    MemFree(gpPaletteSubRanges);
    gpPaletteSubRanges = NULL;
  }

  if (gubpNumReplacementsPerRange != NULL) {
    MemFree(gubpNumReplacementsPerRange);
    gubpNumReplacementsPerRange = NULL;
  }

  for (cnt = 0; cnt < guiNumReplacements; cnt++) {
    // Free
    if (gpPalRep[cnt].r != NULL) {
      MemFree(gpPalRep[cnt].r);
      gpPalRep[cnt].r = NULL;
    }
    if (gpPalRep[cnt].g != NULL) {
      MemFree(gpPalRep[cnt].g);
      gpPalRep[cnt].g = NULL;
    }
    if (gpPalRep[cnt].b != NULL) {
      MemFree(gpPalRep[cnt].b);
      gpPalRep[cnt].b = NULL;
    }
  }

  // Free
  if (gpPalRep != NULL) {
    MemFree(gpPalRep);
    gpPalRep = NULL;
  }

  return TRUE;
}

function GetPaletteRepIndexFromID(aPalRep: PaletteRepID, pubPalIndex: Pointer<UINT8>): BOOLEAN {
  let cnt: UINT32;

  // Check if type exists
  for (cnt = 0; cnt < guiNumReplacements; cnt++) {
    if (COMPARE_PALETTEREP_ID(aPalRep, gpPalRep[cnt].ID)) {
      pubPalIndex.value = cnt;
      return TRUE;
    }
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Invalid Palette Replacement ID given");
  return FALSE;
}

function GetNewSoldierStateFromNewStance(pSoldier: Pointer<SOLDIERTYPE>, ubDesiredStance: UINT8): UINT16 {
  let usNewState: UINT16;
  let bCurrentHeight: INT8;

  bCurrentHeight = (ubDesiredStance - gAnimControl[pSoldier.value.usAnimState].ubEndHeight);

  // Now change to appropriate animation

  switch (bCurrentHeight) {
    case ANIM_STAND - ANIM_CROUCH:
      usNewState = Enum193.KNEEL_UP;
      break;
    case ANIM_CROUCH - ANIM_STAND:
      usNewState = Enum193.KNEEL_DOWN;
      break;

    case ANIM_STAND - ANIM_PRONE:
      usNewState = Enum193.PRONE_UP;
      break;
    case ANIM_PRONE - ANIM_STAND:
      usNewState = Enum193.KNEEL_DOWN;
      break;

    case ANIM_CROUCH - ANIM_PRONE:
      usNewState = Enum193.PRONE_UP;
      break;
    case ANIM_PRONE - ANIM_CROUCH:
      usNewState = Enum193.PRONE_DOWN;
      break;

    default:

      // Cannot get here unless ub desired stance is bogus
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("GetNewSoldierStateFromNewStance bogus ubDesiredStance value %d", ubDesiredStance));
      usNewState = pSoldier.value.usAnimState;
  }

  return usNewState;
}

function MoveMercFacingDirection(pSoldier: Pointer<SOLDIERTYPE>, fReverse: BOOLEAN, dMovementDist: FLOAT): void {
  let dAngle: FLOAT = 0;

  // Determine which direction we are in
  switch (pSoldier.value.bDirection) {
    case Enum245.NORTH:
      dAngle = (-1 * PI);
      break;

    case Enum245.NORTHEAST:
      dAngle = (PI * .75);
      break;

    case Enum245.EAST:
      dAngle = (PI / 2);
      break;

    case Enum245.SOUTHEAST:
      dAngle = (PI / 4);
      break;

    case Enum245.SOUTH:
      dAngle = 0;
      break;

    case Enum245.SOUTHWEST:
      // dAngle = (FLOAT)(  PI * -.25 );
      dAngle = -0.786;
      break;

    case Enum245.WEST:
      dAngle = (PI * -.5);
      break;

    case Enum245.NORTHWEST:
      dAngle = (PI * -.75);
      break;
  }

  if (fReverse) {
    dMovementDist = dMovementDist * -1;
  }

  MoveMerc(pSoldier, dMovementDist, dAngle, FALSE);
}

function BeginSoldierClimbUpRoof(pSoldier: Pointer<SOLDIERTYPE>): void {
  let bNewDirection: INT8;

  if (FindHeigherLevel(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection, addressof(bNewDirection)) && (pSoldier.value.bLevel == 0)) {
    if (EnoughPoints(pSoldier, GetAPsToClimbRoof(pSoldier, FALSE), 0, TRUE)) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        // OK, SET INTERFACE FIRST
        SetUIBusy(pSoldier.value.ubID);
      }

      pSoldier.value.sTempNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(bNewDirection));

      pSoldier.value.ubPendingDirection = bNewDirection;
      // pSoldier->usPendingAnimation = CLIMBUPROOF;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CLIMBUPROOF, 0, FALSE);

      InternalReceivingSoldierCancelServices(pSoldier, FALSE);
      InternalGivingSoldierCancelServices(pSoldier, FALSE);
    }
  }
}

function BeginSoldierClimbFence(pSoldier: Pointer<SOLDIERTYPE>): void {
  let bDirection: INT8;

  if (FindFenceJumpDirection(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection, addressof(bDirection))) {
    pSoldier.value.sTempNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(bDirection));
    pSoldier.value.fDontChargeTurningAPs = TRUE;
    EVENT_InternalSetSoldierDesiredDirection(pSoldier, bDirection, FALSE, pSoldier.value.usAnimState);
    pSoldier.value.fTurningUntilDone = TRUE;
    // ATE: Reset flag to go back to prone...
    pSoldier.value.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
    pSoldier.value.usPendingAnimation = Enum193.HOPFENCE;
  }
}

function SleepDartSuccumbChance(pSoldier: Pointer<SOLDIERTYPE>): UINT32 {
  let uiChance: UINT32;
  let bEffectiveStrength: INT8;

  // figure out base chance of succumbing,
  bEffectiveStrength = EffectiveStrength(pSoldier);

  if (bEffectiveStrength > 90) {
    uiChance = 110 - bEffectiveStrength;
  } else if (bEffectiveStrength > 80) {
    uiChance = 120 - bEffectiveStrength;
  } else if (bEffectiveStrength > 70) {
    uiChance = 130 - bEffectiveStrength;
  } else {
    uiChance = 140 - bEffectiveStrength;
  }

  // add in a bonus based on how long it's been since shot... highest chance at the beginning
  uiChance += (10 - pSoldier.value.bSleepDrugCounter);

  return uiChance;
}

function BeginSoldierGetup(pSoldier: Pointer<SOLDIERTYPE>): void {
  // RETURN IF WE ARE BEING SERVICED
  if (pSoldier.value.ubServiceCount > 0) {
    return;
  }

  // ATE: Don't getup if we are in a meanwhile
  if (AreInMeanwhile()) {
    return;
  }

  if (pSoldier.value.bCollapsed) {
    if (pSoldier.value.bLife >= OKLIFE && pSoldier.value.bBreath >= OKBREATH && (pSoldier.value.bSleepDrugCounter == 0)) {
      // get up you hoser!

      pSoldier.value.bCollapsed = FALSE;
      pSoldier.value.bTurnsCollapsed = 0;

      if (IS_MERC_BODY_TYPE(pSoldier)) {
        switch (pSoldier.value.usAnimState) {
          case Enum193.FALLOFF_FORWARD_STOP:
          case Enum193.PRONE_LAYFROMHIT_STOP:
          case Enum193.STAND_FALLFORWARD_STOP:
            ChangeSoldierStance(pSoldier, ANIM_CROUCH);
            break;

          case Enum193.FALLBACKHIT_STOP:
          case Enum193.FALLOFF_STOP:
          case Enum193.FLYBACKHIT_STOP:
          case Enum193.FALLBACK_HIT_STAND:
          case Enum193.FALLOFF:
          case Enum193.FLYBACK_HIT:

            // ROLL OVER
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.ROLLOVER, 0, FALSE);
            break;

          default:

            ChangeSoldierStance(pSoldier, ANIM_CROUCH);
            break;
        }
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_COWER, 0, FALSE);
      }
    } else {
      pSoldier.value.bTurnsCollapsed++;
      if ((gTacticalStatus.bBoxingState == Enum247.BOXING) && (pSoldier.value.uiStatusFlags & SOLDIER_BOXER)) {
        if (pSoldier.value.bTurnsCollapsed > 1) {
          // We have a winnah!  But it isn't this boxer!
          EndBoxingMatch(pSoldier);
        }
      }
    }
  } else if (pSoldier.value.bSleepDrugCounter > 0) {
    let uiChance: UINT32;

    uiChance = SleepDartSuccumbChance(pSoldier);

    if (PreRandom(100) < uiChance) {
      // succumb to the drug!
      DeductPoints(pSoldier, 0, (pSoldier.value.bBreathMax * 100));
      SoldierCollapse(pSoldier);
    }
  }

  if (pSoldier.value.bSleepDrugCounter > 0) {
    pSoldier.value.bSleepDrugCounter--;
  }
}

function HandleTakeDamageDeath(pSoldier: Pointer<SOLDIERTYPE>, bOldLife: UINT8, ubReason: UINT8): void {
  switch (ubReason) {
    case TAKE_DAMAGE_BLOODLOSS:
    case TAKE_DAMAGE_ELECTRICITY:
    case TAKE_DAMAGE_GAS:

      if (pSoldier.value.bInSector) {
        if (pSoldier.value.bVisible != -1) {
          if (ubReason != TAKE_DAMAGE_BLOODLOSS) {
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
            pSoldier.value.fDeadSoundPlayed = TRUE;
          }
        }

        if ((ubReason == TAKE_DAMAGE_ELECTRICITY) && pSoldier.value.bLife < OKLIFE) {
          pSoldier.value.fInNonintAnim = FALSE;
        }

        // Check for < OKLIFE
        if (pSoldier.value.bLife < OKLIFE && pSoldier.value.bLife != 0 && !pSoldier.value.bCollapsed) {
          SoldierCollapse(pSoldier);
        }

        // THis is for the die animation that will be happening....
        if (pSoldier.value.bLife == 0) {
          pSoldier.value.fDoingExternalDeath = TRUE;
        }

        // Check if he is dead....
        CheckForAndHandleSoldierDyingNotFromHit(pSoldier);
      }

      // if( !( guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN ) )
      { HandleSoldierTakeDamageFeedback(pSoldier); }

      if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) || !pSoldier.value.bInSector) {
        if (pSoldier.value.bLife == 0 && !(pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
          StrategicHandlePlayerTeamMercDeath(pSoldier);

          // ATE: Here, force always to use die sound...
          pSoldier.value.fDieSoundUsed = FALSE;
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
          pSoldier.value.fDeadSoundPlayed = TRUE;

          // ATE: DO death sound
          PlayJA2Sample(Enum330.DOORCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
          PlayJA2Sample(Enum330.HEADCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        }
      }
      break;
  }

  if (ubReason == TAKE_DAMAGE_ELECTRICITY) {
    if (pSoldier.value.bLife >= OKLIFE) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Freeing up attacker from electricity damage"));
      ReleaseSoldiersAttacker(pSoldier);
    }
  }
}

function SoldierTakeDamage(pSoldier: Pointer<SOLDIERTYPE>, bHeight: INT8, sLifeDeduct: INT16, sBreathLoss: INT16, ubReason: UINT8, ubAttacker: UINT8, sSourceGrid: INT16, sSubsequent: INT16, fShowDamage: BOOLEAN): UINT8 {
  let bOldLife: INT8;
  let ubCombinedLoss: UINT8;
  let bBandage: INT8;
  let sAPCost: INT16;
  let ubBlood: UINT8;

  pSoldier.value.ubLastDamageReason = ubReason;

  // CJC Jan 21 99: add check to see if we are hurting an enemy in an enemy-controlled
  // sector; if so, this is a sign of player activity
  switch (pSoldier.value.bTeam) {
    case ENEMY_TEAM:
      // if we're in the wilderness this always counts
      if (StrategicMap[CALCULATE_STRATEGIC_INDEX(gWorldSectorX, gWorldSectorY)].fEnemyControlled || SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)].ubTraversability[Enum186.THROUGH_STRATEGIC_MOVE] != Enum127.TOWN) {
        // update current day of activity!
        UpdateLastDayOfPlayerActivity(GetWorldDay());
      }
      break;
    case CREATURE_TEAM:
      // always a sign of activity?
      UpdateLastDayOfPlayerActivity(GetWorldDay());
      break;
    case CIV_TEAM:
      if (pSoldier.value.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP && gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTINPROGRESS && gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) {
        let pMaria: Pointer<SOLDIERTYPE> = FindSoldierByProfileID(Enum268.MARIA, FALSE);
        if (pMaria && pMaria.value.bActive && pMaria.value.bInSector) {
          SetFactTrue(Enum170.FACT_MARIA_ESCAPE_NOTICED);
        }
      }
      break;
    default:
      break;
  }

  // Deduct life!, Show damage if we want!
  bOldLife = pSoldier.value.bLife;

  // OK, If we are a vehicle.... damage vehicle...( people inside... )
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    if (TANK(pSoldier)) {
      // sLifeDeduct = (sLifeDeduct * 2) / 3;
    } else {
      if (ubReason == TAKE_DAMAGE_GUNFIRE) {
        sLifeDeduct /= 3;
      } else if (ubReason == TAKE_DAMAGE_EXPLOSION && sLifeDeduct > 50) {
        // boom!
        sLifeDeduct *= 2;
      }
    }

    VehicleTakeDamage(pSoldier.value.bVehicleID, ubReason, sLifeDeduct, pSoldier.value.sGridNo, ubAttacker);
    HandleTakeDamageDeath(pSoldier, bOldLife, ubReason);
    return 0;
  }

  // ATE: If we are elloit being attacked in a meanwhile...
  if (pSoldier.value.uiStatusFlags & SOLDIER_NPC_SHOOTING) {
    // Almost kill but not quite.....
    sLifeDeduct = (pSoldier.value.bLife - 1);
    // Turn off
    pSoldier.value.uiStatusFlags &= (~SOLDIER_NPC_SHOOTING);
  }

  // CJC: make sure Elliot doesn't bleed to death!
  if (ubReason == TAKE_DAMAGE_BLOODLOSS && AreInMeanwhile()) {
    return 0;
  }

  // Calculate bandage
  bBandage = pSoldier.value.bLifeMax - pSoldier.value.bLife - pSoldier.value.bBleeding;

  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    fReDrawFace = TRUE;
  }

  if (CREATURE_OR_BLOODCAT(pSoldier)) {
    let sReductionFactor: INT16 = 0;

    if (pSoldier.value.ubBodyType == Enum194.BLOODCAT) {
      sReductionFactor = 2;
    } else if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
      switch (pSoldier.value.ubBodyType) {
        case Enum194.LARVAE_MONSTER:
        case Enum194.INFANT_MONSTER:
          sReductionFactor = 1;
          break;
        case Enum194.YAF_MONSTER:
        case Enum194.YAM_MONSTER:
          sReductionFactor = 4;
          break;
        case Enum194.ADULTFEMALEMONSTER:
        case Enum194.AM_MONSTER:
          sReductionFactor = 6;
          break;
        case Enum194.QUEENMONSTER:
          // increase with range!
          if (ubAttacker == NOBODY) {
            sReductionFactor = 8;
          } else {
            sReductionFactor = 4 + PythSpacesAway(MercPtrs[ubAttacker].value.sGridNo, pSoldier.value.sGridNo) / 2;
          }
          break;
      }
    }

    if (ubReason == TAKE_DAMAGE_EXPLOSION) {
      sReductionFactor /= 4;
    }
    if (sReductionFactor > 1) {
      sLifeDeduct = (sLifeDeduct + (sReductionFactor / 2)) / sReductionFactor;
    } else if (ubReason == TAKE_DAMAGE_EXPLOSION) {
      // take at most 2/3rds
      sLifeDeduct = (sLifeDeduct * 2) / 3;
    }

    // reduce breath loss to a smaller degree, except for the queen...
    if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
      // in fact, reduce breath loss by MORE!
      sReductionFactor = __min(sReductionFactor, 8);
      sReductionFactor *= 2;
    } else {
      sReductionFactor /= 2;
    }
    if (sReductionFactor > 1) {
      sBreathLoss = (sBreathLoss + (sReductionFactor / 2)) / sReductionFactor;
    }
  }

  if (sLifeDeduct > pSoldier.value.bLife) {
    pSoldier.value.bLife = 0;
  } else {
    // Decrease Health
    pSoldier.value.bLife -= sLifeDeduct;
  }

  // ATE: Put some logic in here to allow enemies to die quicker.....
  // Are we an enemy?
  if (pSoldier.value.bSide != gbPlayerNum && !pSoldier.value.bNeutral && pSoldier.value.ubProfile == NO_PROFILE) {
    // ATE: Give them a chance to fall down...
    if (pSoldier.value.bLife > 0 && pSoldier.value.bLife < (OKLIFE - 1)) {
      // Are we taking damage from bleeding?
      if (ubReason == TAKE_DAMAGE_BLOODLOSS) {
        // Fifty-fifty chance to die now!
        if (Random(2) == 0 || gTacticalStatus.Team[pSoldier.value.bTeam].bMenInSector == 1) {
          // Kill!
          pSoldier.value.bLife = 0;
        }
      } else {
        // OK, see how far we are..
        if (pSoldier.value.bLife < (OKLIFE - 3)) {
          // Kill!
          pSoldier.value.bLife = 0;
        }
      }
    }
  }

  if (fShowDamage) {
    pSoldier.value.sDamage += sLifeDeduct;
  }

  // Truncate life
  if (pSoldier.value.bLife < 0) {
    pSoldier.value.bLife = 0;
  }

  // Calculate damage to our items if from an explosion!
  if (ubReason == TAKE_DAMAGE_EXPLOSION || ubReason == TAKE_DAMAGE_STRUCTURE_EXPLOSION) {
    CheckEquipmentForDamage(pSoldier, sLifeDeduct);
  }

  // Calculate bleeding
  if (ubReason != TAKE_DAMAGE_GAS && !AM_A_ROBOT(pSoldier)) {
    if (ubReason == TAKE_DAMAGE_HANDTOHAND) {
      if (sLifeDeduct > 0) {
        // HTH does 1 pt bleeding per hit
        pSoldier.value.bBleeding = pSoldier.value.bBleeding + 1;
      }
    } else {
      pSoldier.value.bBleeding = pSoldier.value.bLifeMax - (pSoldier.value.bLife + bBandage);
    }
  }

  // Deduct breath AND APs!
  sAPCost = (sLifeDeduct / AP_GET_WOUNDED_DIVISOR); // + fallCost;

  // ATE: if the robot, do not deduct
  if (!AM_A_ROBOT(pSoldier)) {
    DeductPoints(pSoldier, sAPCost, sBreathLoss);
  }

  ubCombinedLoss = sLifeDeduct / 10 + sBreathLoss / 2000;

  // Add shock
  if (!AM_A_ROBOT(pSoldier)) {
    pSoldier.value.bShock += ubCombinedLoss;
  }

  // start the stopwatch - the blood is gushing!
  pSoldier.value.dNextBleed = CalcSoldierNextBleed(pSoldier);

  if (pSoldier.value.bInSector && pSoldier.value.bVisible != -1) {
    // If we are already dead, don't show damage!
    if (bOldLife != 0 && fShowDamage && sLifeDeduct != 0 && sLifeDeduct < 1000) {
      // Display damage
      let sOffsetX: INT16;
      let sOffsetY: INT16;

      // Set Damage display counter
      pSoldier.value.fDisplayDamage = TRUE;
      pSoldier.value.bDisplayDamageCount = 0;

      if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
        pSoldier.value.sDamageX = 0;
        pSoldier.value.sDamageY = 0;
      } else {
        GetSoldierAnimOffsets(pSoldier, addressof(sOffsetX), addressof(sOffsetY));
        pSoldier.value.sDamageX = sOffsetX;
        pSoldier.value.sDamageY = sOffsetY;
      }
    }
  }

  // OK, if here, let's see if we should drop our weapon....
  if (ubReason != TAKE_DAMAGE_BLOODLOSS && !(AM_A_ROBOT(pSoldier))) {
    let sTestOne: INT16;
    let sTestTwo: INT16;
    let sChanceToDrop: INT16;
    let bVisible: INT8 = -1;

    sTestOne = EffectiveStrength(pSoldier);
    sTestTwo = (2 * (__max(sLifeDeduct, (sBreathLoss / 100))));

    if (pSoldier.value.ubAttackerID != NOBODY && MercPtrs[pSoldier.value.ubAttackerID].value.ubBodyType == Enum194.BLOODCAT) {
      // bloodcat boost, let them make people drop items more
      sTestTwo += 20;
    }

    // If damage > effective strength....
    sChanceToDrop = (__max(0, (sTestTwo - sTestOne)));

    // ATE: Increase odds of NOT dropping an UNDROPPABLE OBJECT
    if ((pSoldier.value.inv[Enum261.HANDPOS].fFlags & OBJECT_UNDROPPABLE)) {
      sChanceToDrop -= 30;
    }

    if (Random(100) < sChanceToDrop) {
      // OK, drop item in main hand...
      if (pSoldier.value.inv[Enum261.HANDPOS].usItem != NOTHING) {
        if (!(pSoldier.value.inv[Enum261.HANDPOS].fFlags & OBJECT_UNDROPPABLE)) {
          // ATE: if our guy, make visible....
          if (pSoldier.value.bTeam == gbPlayerNum) {
            bVisible = 1;
          }

          AddItemToPool(pSoldier.value.sGridNo, addressof(pSoldier.value.inv[Enum261.HANDPOS]), bVisible, pSoldier.value.bLevel, 0, -1);
          DeleteObj(addressof(pSoldier.value.inv[Enum261.HANDPOS]));
        }
      }
    }
  }

  // Drop some blood!
  // decide blood amt, if any
  ubBlood = (sLifeDeduct / BLOODDIVISOR);
  if (ubBlood > MAXBLOODQUANTITY) {
    ubBlood = MAXBLOODQUANTITY;
  }

  if (!(pSoldier.value.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_ROBOT))) {
    if (ubBlood != 0) {
      if (pSoldier.value.bInSector) {
        DropBlood(pSoldier, ubBlood, pSoldier.value.bVisible);
      }
    }
  }

  // Set UI Flag for unconscious, if it's our own guy!
  if (pSoldier.value.bTeam == gbPlayerNum) {
    if (pSoldier.value.bLife < OKLIFE && pSoldier.value.bLife > 0 && bOldLife >= OKLIFE) {
      pSoldier.value.fUIFirstTimeUNCON = TRUE;
      fInterfacePanelDirty = DIRTYLEVEL2;
    }
  }

  if (pSoldier.value.bInSector) {
    CheckForBreathCollapse(pSoldier);
  }

  // EXPERIENCE CLASS GAIN (combLoss): Getting wounded in battle

  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL1);

  if (ubAttacker != NOBODY) {
    // don't give exp for hitting friends!
    if ((MercPtrs[ubAttacker].value.bTeam == gbPlayerNum) && (pSoldier.value.bTeam != gbPlayerNum)) {
      if (ubReason == TAKE_DAMAGE_EXPLOSION) {
        // EXPLOSIVES GAIN (combLoss):  Causing wounds in battle
        StatChange(MercPtrs[ubAttacker], EXPLODEAMT, (10 * ubCombinedLoss), FROM_FAILURE);
      }
      /*
      else if ( ubReason == TAKE_DAMAGE_GUNFIRE )
      {
              // MARKSMANSHIP GAIN (combLoss):  Causing wounds in battle
              StatChange( MercPtrs[ ubAttacker ], MARKAMT, (UINT16)( 5 * ubCombinedLoss ), FALSE );
      }
      */
    }
  }

  if (PTR_OURTEAM()) {
    // EXPERIENCE GAIN: Took some damage
    StatChange(pSoldier, EXPERAMT, (5 * ubCombinedLoss), FROM_FAILURE);

    // Check for quote
    if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_BEING_PUMMELED)) {
      // Check attacker!
      if (ubAttacker != NOBODY && ubAttacker != pSoldier.value.ubID) {
        pSoldier.value.bNumHitsThisTurn++;

        if ((pSoldier.value.bNumHitsThisTurn >= 3) && (pSoldier.value.bLife - pSoldier.value.bOldLife > 20)) {
          if (Random(100) < ((40 * (pSoldier.value.bNumHitsThisTurn - 2)))) {
            DelayedTacticalCharacterDialogue(pSoldier, Enum202.QUOTE_TAKEN_A_BREATING);
            pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_BEING_PUMMELED;
            pSoldier.value.bNumHitsThisTurn = 0;
          }
        }
      }
    }
  }

  if ((ubAttacker != NOBODY) && (Menptr[ubAttacker].bTeam == OUR_TEAM) && (pSoldier.value.ubProfile != NO_PROFILE) && (pSoldier.value.ubProfile >= FIRST_RPC)) {
    gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags |= PROFILE_MISC_FLAG_WOUNDEDBYPLAYER;
    if (pSoldier.value.ubProfile == 114) {
      SetFactTrue(Enum170.FACT_PACOS_KILLED);
    }
  }

  HandleTakeDamageDeath(pSoldier, bOldLife, ubReason);

  // Check if we are < unconscious, and shutup if so! also wipe sight
  if (pSoldier.value.bLife < CONSCIOUSNESS) {
    ShutupaYoFace(pSoldier.value.iFaceIndex);
  }

  if (pSoldier.value.bLife < OKLIFE) {
    DecayIndividualOpplist(pSoldier);
  }

  return ubCombinedLoss;
}

function InternalDoMercBattleSound(pSoldier: Pointer<SOLDIERTYPE>, ubBattleSoundID: UINT8, bSpecialCode: INT8): BOOLEAN {
  let zFilename: SGPFILENAME;
  let spParms: SOUNDPARMS;
  let ubSoundID: UINT8;
  let uiSoundID: UINT32;
  let iFaceIndex: UINT32;
  let fDoSub: BOOLEAN = FALSE;
  let uiSubSoundID: INT32 = 0;
  let fSpeechSound: BOOLEAN = FALSE;

  // DOUBLECHECK RANGE
  CHECKF(ubBattleSoundID < Enum259.NUM_MERC_BATTLE_SOUNDS);

  if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
    // Pick a passenger from vehicle....
    pSoldier = PickRandomPassengerFromVehicle(pSoldier);

    if (pSoldier == NULL) {
      return FALSE;
    }
  }

  // If a death sound, and we have already done ours...
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_DIE1) {
    if (pSoldier.value.fDieSoundUsed) {
      return TRUE;
    }
  }

  // Are we mute?
  if (pSoldier.value.uiStatusFlags & SOLDIER_MUTE) {
    return FALSE;
  }

  //	uiTimeSameBattleSndDone

  // If we are a creature, etc, pick a better sound...
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_HIT1 || ubBattleSoundID == Enum259.BATTLE_SOUND_HIT2) {
    switch (pSoldier.value.ubBodyType) {
      case Enum194.COW:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.COW_HIT_SND;
        break;

      case Enum194.YAF_MONSTER:
      case Enum194.YAM_MONSTER:
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.AM_MONSTER:

        fDoSub = TRUE;

        if (Random(2) == 0) {
          uiSubSoundID = Enum330.ACR_DIE_PART1;
        } else {
          uiSubSoundID = Enum330.ACR_LUNGE;
        }
        break;

      case Enum194.INFANT_MONSTER:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.BCR_SHRIEK;
        break;

      case Enum194.QUEENMONSTER:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.LQ_SHRIEK;
        break;

      case Enum194.LARVAE_MONSTER:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.BCR_SHRIEK;
        break;

      case Enum194.BLOODCAT:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.BLOODCAT_HIT_1;
        break;

      case Enum194.ROBOTNOWEAPON:

        fDoSub = TRUE;
        uiSubSoundID = (Enum330.S_METAL_IMPACT1 + Random(2));
        break;
    }
  }

  if (ubBattleSoundID == Enum259.BATTLE_SOUND_DIE1) {
    switch (pSoldier.value.ubBodyType) {
      case Enum194.COW:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.COW_DIE_SND;
        break;

      case Enum194.YAF_MONSTER:
      case Enum194.YAM_MONSTER:
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.AM_MONSTER:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.CREATURE_FALL_PART_2;
        break;

      case Enum194.INFANT_MONSTER:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.BCR_DYING;
        break;

      case Enum194.LARVAE_MONSTER:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.LCR_RUPTURE;
        break;

      case Enum194.QUEENMONSTER:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.LQ_DYING;
        break;

      case Enum194.BLOODCAT:

        fDoSub = TRUE;
        uiSubSoundID = Enum330.BLOODCAT_DIE_1;
        break;

      case Enum194.ROBOTNOWEAPON:

        fDoSub = TRUE;
        uiSubSoundID = (Enum330.EXPLOSION_1);
        PlayJA2Sample(Enum330.ROBOT_DEATH, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        break;
    }
  }

  // OK. any other sound, not hits, robot makes a beep
  if (pSoldier.value.ubBodyType == Enum194.ROBOTNOWEAPON && !fDoSub) {
    fDoSub = TRUE;
    if (ubBattleSoundID == Enum259.BATTLE_SOUND_ATTN1) {
      uiSubSoundID = Enum330.ROBOT_GREETING;
    } else {
      uiSubSoundID = Enum330.ROBOT_BEEP;
    }
  }

  if (fDoSub) {
    if (guiCurrentScreen != Enum26.GAME_SCREEN) {
      PlayJA2Sample(uiSubSoundID, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    } else {
      PlayJA2Sample(uiSubSoundID, RATE_11025, SoundVolume(CalculateSpeechVolume(HIGHVOLUME), pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
    }
    return TRUE;
  }

  // Check if this is the same one we just played...
  if (pSoldier.value.bOldBattleSnd == ubBattleSoundID && gBattleSndsData[ubBattleSoundID].fDontAllowTwoInRow) {
    // Are we below the min delay?
    if ((GetJA2Clock() - pSoldier.value.uiTimeSameBattleSndDone) < MIN_SUBSEQUENT_SNDS_DELAY) {
      return TRUE;
    }
  }

  // If a battle snd is STILL playing....
  if (SoundIsPlaying(pSoldier.value.uiBattleSoundID)) {
    // We can do a few things here....
    // Is this a crutial one...?
    if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 1) {
      // Stop playing origonal
      SoundStop(pSoldier.value.uiBattleSoundID);
    } else {
      // Skip this one...
      return TRUE;
    }
  }

  // If we are talking now....
  if (IsMercSayingDialogue(pSoldier.value.ubProfile)) {
    // We can do a couple of things now...
    if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 1) {
      // Stop dialigue...
      DialogueAdvanceSpeech();
    } else if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 2) {
      // Skip battle snd...
      return TRUE;
    }
  }

  // Save this one we're doing...
  pSoldier.value.bOldBattleSnd = ubBattleSoundID;
  pSoldier.value.uiTimeSameBattleSndDone = GetJA2Clock();

  // Adjust based on morale...
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_OK1 && pSoldier.value.bMorale < LOW_MORALE_BATTLE_SND_THREASHOLD) {
    ubBattleSoundID = Enum259.BATTLE_SOUND_LOWMARALE_OK1;
  }
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_ATTN1 && pSoldier.value.bMorale < LOW_MORALE_BATTLE_SND_THREASHOLD) {
    ubBattleSoundID = Enum259.BATTLE_SOUND_LOWMARALE_ATTN1;
  }

  ubSoundID = ubBattleSoundID;

  // if the sound to be played is a confirmation, check to see if we are to play it
  if (ubSoundID == Enum259.BATTLE_SOUND_OK1) {
    if (gGameSettings.fOptions[Enum8.TOPTION_MUTE_CONFIRMATIONS])
      return TRUE;
    // else a speech sound is to be played
    else
      fSpeechSound = TRUE;
  }

  // Randomize between sounds, if appropriate
  if (gBattleSndsData[ubSoundID].ubRandomVal != 0) {
    ubSoundID = ubSoundID + Random(gBattleSndsData[ubSoundID].ubRandomVal);
  }

  // OK, build file and play!
  if (pSoldier.value.ubProfile != NO_PROFILE) {
    sprintf(zFilename, "BATTLESNDS\\%03d_%s.wav", pSoldier.value.ubProfile, gBattleSndsData[ubSoundID].zName);

    if (!FileExists(zFilename)) {
      // OK, temp build file...
      if (pSoldier.value.ubBodyType == Enum194.REGFEMALE) {
        sprintf(zFilename, "BATTLESNDS\\f_%s.wav", gBattleSndsData[ubSoundID].zName);
      } else {
        sprintf(zFilename, "BATTLESNDS\\m_%s.wav", gBattleSndsData[ubSoundID].zName);
      }
    }
  } else {
    // Check if we can play this!
    if (!gBattleSndsData[ubSoundID].fBadGuy) {
      return FALSE;
    }

    if (pSoldier.value.ubBodyType == Enum194.HATKIDCIV || pSoldier.value.ubBodyType == Enum194.KIDCIV) {
      if (ubSoundID == Enum259.BATTLE_SOUND_DIE1) {
        sprintf(zFilename, "BATTLESNDS\\kid%d_dying.wav", pSoldier.value.ubBattleSoundID);
      } else {
        sprintf(zFilename, "BATTLESNDS\\kid%d_%s.wav", pSoldier.value.ubBattleSoundID, gBattleSndsData[ubSoundID].zName);
      }
    } else {
      if (ubSoundID == Enum259.BATTLE_SOUND_DIE1) {
        sprintf(zFilename, "BATTLESNDS\\bad%d_die.wav", pSoldier.value.ubBattleSoundID);
      } else {
        sprintf(zFilename, "BATTLESNDS\\bad%d_%s.wav", pSoldier.value.ubBattleSoundID, gBattleSndsData[ubSoundID].zName);
      }
    }
  }

  // Play sound!
  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiSpeed = RATE_11025;
  // spParms.uiVolume = CalculateSpeechVolume( pSoldier->bVocalVolume );

  spParms.uiVolume = CalculateSpeechVolume(HIGHVOLUME);

  // ATE: Reduce volume for OK sounds...
  // ( Only for all-moves or multi-selection cases... )
  if (bSpecialCode == BATTLE_SND_LOWER_VOLUME) {
    spParms.uiVolume = CalculateSpeechVolume(MIDVOLUME);
  }

  // If we are an enemy.....reduce due to volume
  if (pSoldier.value.bTeam != gbPlayerNum) {
    spParms.uiVolume = SoundVolume(spParms.uiVolume, pSoldier.value.sGridNo);
  }

  spParms.uiLoop = 1;
  spParms.uiPan = SoundDir(pSoldier.value.sGridNo);
  spParms.uiPriority = GROUP_PLAYER;

  if ((uiSoundID = SoundPlay(zFilename, addressof(spParms))) == SOUND_ERROR) {
    return FALSE;
  } else {
    pSoldier.value.uiBattleSoundID = uiSoundID;

    if (pSoldier.value.ubProfile != NO_PROFILE) {
      // Get soldier's face ID
      iFaceIndex = pSoldier.value.iFaceIndex;

      // Check face index
      if (iFaceIndex != -1) {
        ExternSetFaceTalking(iFaceIndex, uiSoundID);
      }
    }

    return TRUE;
  }
}

function DoMercBattleSound(pSoldier: Pointer<SOLDIERTYPE>, ubBattleSoundID: UINT8): BOOLEAN {
  // We WANT to play some RIGHT AWAY.....
  if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 1 || (pSoldier.value.ubProfile == NO_PROFILE) || InOverheadMap()) {
    return InternalDoMercBattleSound(pSoldier, ubBattleSoundID, 0);
  }

  // So here, only if we were currently saying dialogue.....
  if (!IsMercSayingDialogue(pSoldier.value.ubProfile)) {
    return InternalDoMercBattleSound(pSoldier, ubBattleSoundID, 0);
  }

  // OK, queue it up otherwise!
  TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, ubBattleSoundID, 0);

  return TRUE;
}

function PreloadSoldierBattleSounds(pSoldier: Pointer<SOLDIERTYPE>, fRemove: BOOLEAN): BOOLEAN {
  let cnt: UINT32;

  CHECKF(pSoldier.value.bActive != FALSE);

  for (cnt = 0; cnt < Enum259.NUM_MERC_BATTLE_SOUNDS; cnt++) {
    // OK, build file and play!
    if (pSoldier.value.ubProfile != NO_PROFILE) {
      if (gBattleSndsData[cnt].fPreload) {
        if (fRemove) {
          SoundUnlockSample(gBattleSndsData[cnt].zName);
        } else {
          SoundLockSample(gBattleSndsData[cnt].zName);
        }
      }
    } else {
      if (gBattleSndsData[cnt].fPreload && gBattleSndsData[cnt].fBadGuy) {
        if (fRemove) {
          SoundUnlockSample(gBattleSndsData[cnt].zName);
        } else {
          SoundLockSample(gBattleSndsData[cnt].zName);
        }
      }
    }
  }

  return TRUE;
}

function CheckSoldierHitRoof(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Check if we are near a lower level
  let bNewDirection: INT8;
  let fReturnVal: BOOLEAN = FALSE;
  let sNewGridNo: INT16;
  // Default to true
  let fDoForwards: BOOLEAN = TRUE;

  if (pSoldier.value.bLife >= OKLIFE) {
    return FALSE;
  }

  if (FindLowerLevel(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection, addressof(bNewDirection)) && (pSoldier.value.bLevel > 0)) {
    // ONly if standing!
    if (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND) {
      // We are near a lower level.
      // Use opposite direction
      bNewDirection = gOppositeDirection[bNewDirection];

      // Alrighty, let's not blindly change here, look at whether the dest gridno is good!
      sNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(gOppositeDirection[bNewDirection]));
      if (!NewOKDestination(pSoldier, sNewGridNo, TRUE, 0)) {
        return FALSE;
      }
      sNewGridNo = NewGridNo(sNewGridNo, DirectionInc(gOppositeDirection[bNewDirection]));
      if (!NewOKDestination(pSoldier, sNewGridNo, TRUE, 0)) {
        return FALSE;
      }

      // Are wee near enough to fall forwards....
      if (pSoldier.value.bDirection == gOneCDirection[bNewDirection] || pSoldier.value.bDirection == gTwoCDirection[bNewDirection] || pSoldier.value.bDirection == bNewDirection || pSoldier.value.bDirection == gOneCCDirection[bNewDirection] || pSoldier.value.bDirection == gTwoCCDirection[bNewDirection]) {
        // Do backwards...
        fDoForwards = FALSE;
      }

      // If we are facing the opposite direction, fall backwards
      // ATE: Make this more usefull...
      if (fDoForwards) {
        pSoldier.value.sTempNewGridNo = NewGridNo(pSoldier.value.sGridNo, (-1 * DirectionInc(bNewDirection)));
        pSoldier.value.sTempNewGridNo = NewGridNo(pSoldier.value.sTempNewGridNo, (-1 * DirectionInc(bNewDirection)));
        EVENT_SetSoldierDesiredDirection(pSoldier, gOppositeDirection[bNewDirection]);
        pSoldier.value.fTurningUntilDone = TRUE;
        pSoldier.value.usPendingAnimation = Enum193.FALLFORWARD_ROOF;
        // EVENT_InitNewSoldierAnim( pSoldier, FALLFORWARD_ROOF, 0 , FALSE );

        // Deduct hitpoints/breath for falling!
        SoldierTakeDamage(pSoldier, ANIM_CROUCH, 100, 5000, TAKE_DAMAGE_FALLROOF, NOBODY, NOWHERE, 0, TRUE);

        fReturnVal = TRUE;
      } else {
        pSoldier.value.sTempNewGridNo = NewGridNo(pSoldier.value.sGridNo, (-1 * DirectionInc(bNewDirection)));
        pSoldier.value.sTempNewGridNo = NewGridNo(pSoldier.value.sTempNewGridNo, (-1 * DirectionInc(bNewDirection)));
        EVENT_SetSoldierDesiredDirection(pSoldier, bNewDirection);
        pSoldier.value.fTurningUntilDone = TRUE;
        pSoldier.value.usPendingAnimation = Enum193.FALLOFF;

        // Deduct hitpoints/breath for falling!
        SoldierTakeDamage(pSoldier, ANIM_CROUCH, 100, 5000, TAKE_DAMAGE_FALLROOF, NOBODY, NOWHERE, 0, TRUE);

        fReturnVal = TRUE;
      }
    }
  }

  return fReturnVal;
}

function BeginSoldierClimbDownRoof(pSoldier: Pointer<SOLDIERTYPE>): void {
  let bNewDirection: INT8;

  if (FindLowerLevel(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection, addressof(bNewDirection)) && (pSoldier.value.bLevel > 0)) {
    if (EnoughPoints(pSoldier, GetAPsToClimbRoof(pSoldier, TRUE), 0, TRUE)) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        // OK, SET INTERFACE FIRST
        SetUIBusy(pSoldier.value.ubID);
      }

      pSoldier.value.sTempNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(bNewDirection));

      bNewDirection = gTwoCDirection[bNewDirection];

      pSoldier.value.ubPendingDirection = bNewDirection;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CLIMBDOWNROOF, 0, FALSE);

      InternalReceivingSoldierCancelServices(pSoldier, FALSE);
      InternalGivingSoldierCancelServices(pSoldier, FALSE);
    }
  }
}

function MoveMerc(pSoldier: Pointer<SOLDIERTYPE>, dMovementChange: FLOAT, dAngle: FLOAT, fCheckRange: BOOLEAN): void {
  let dDegAngle: INT16;
  let dDeltaPos: FLOAT;
  let dXPos: FLOAT;
  let dYPos: FLOAT;
  let fStop: BOOLEAN = FALSE;

  dDegAngle = (dAngle * 180 / PI);
  // sprintf( gDebugStr, "Move Angle: %d", (int)dDegAngle );

  // Find delta Movement for X pos
  dDeltaPos = (dMovementChange * sin(dAngle));

  // Find new position
  dXPos = pSoldier.value.dXPos + dDeltaPos;

  if (fCheckRange) {
    fStop = FALSE;

    switch (pSoldier.value.bMovementDirection) {
      case Enum245.NORTHEAST:
      case Enum245.EAST:
      case Enum245.SOUTHEAST:

        if (dXPos >= pSoldier.value.sDestXPos) {
          fStop = TRUE;
        }
        break;

      case Enum245.NORTHWEST:
      case Enum245.WEST:
      case Enum245.SOUTHWEST:

        if (dXPos <= pSoldier.value.sDestXPos) {
          fStop = TRUE;
        }
        break;

      case Enum245.NORTH:
      case Enum245.SOUTH:

        fStop = TRUE;
        break;
    }

    if (fStop) {
      // dXPos = pSoldier->sDestXPos;
      pSoldier.value.fPastXDest = TRUE;

      if (pSoldier.value.sGridNo == pSoldier.value.sFinalDestination) {
        dXPos = pSoldier.value.sDestXPos;
      }
    }
  }

  // Find delta Movement for Y pos
  dDeltaPos = (dMovementChange * cos(dAngle));

  // Find new pos
  dYPos = pSoldier.value.dYPos + dDeltaPos;

  if (fCheckRange) {
    fStop = FALSE;

    switch (pSoldier.value.bMovementDirection) {
      case Enum245.NORTH:
      case Enum245.NORTHEAST:
      case Enum245.NORTHWEST:

        if (dYPos <= pSoldier.value.sDestYPos) {
          fStop = TRUE;
        }
        break;

      case Enum245.SOUTH:
      case Enum245.SOUTHWEST:
      case Enum245.SOUTHEAST:

        if (dYPos >= pSoldier.value.sDestYPos) {
          fStop = TRUE;
        }
        break;

      case Enum245.EAST:
      case Enum245.WEST:

        fStop = TRUE;
        break;
    }

    if (fStop) {
      // dYPos = pSoldier->sDestYPos;
      pSoldier.value.fPastYDest = TRUE;

      if (pSoldier.value.sGridNo == pSoldier.value.sFinalDestination) {
        dYPos = pSoldier.value.sDestYPos;
      }
    }
  }

  // OK, set new position
  EVENT_InternalSetSoldierPosition(pSoldier, dXPos, dYPos, FALSE, FALSE, FALSE);

  //	DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("X: %f Y: %f", dXPos, dYPos ) );
}

function GetDirectionFromGridNo(sGridNo: INT16, pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  let sXPos: INT16;
  let sYPos: INT16;

  ConvertGridNoToXY(sGridNo, addressof(sXPos), addressof(sYPos));

  return GetDirectionFromXY(sXPos, sYPos, pSoldier);
}

function GetDirectionToGridNoFromGridNo(sGridNoDest: INT16, sGridNoSrc: INT16): INT16 {
  let sXPos2: INT16;
  let sYPos2: INT16;
  let sXPos: INT16;
  let sYPos: INT16;

  ConvertGridNoToXY(sGridNoSrc, addressof(sXPos), addressof(sYPos));
  ConvertGridNoToXY(sGridNoDest, addressof(sXPos2), addressof(sYPos2));

  return atan8(sXPos2, sYPos2, sXPos, sYPos);
}

function GetDirectionFromXY(sXPos: INT16, sYPos: INT16, pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  let sXPos2: INT16;
  let sYPos2: INT16;

  ConvertGridNoToXY(pSoldier.value.sGridNo, addressof(sXPos2), addressof(sYPos2));

  return atan8(sXPos2, sYPos2, sXPos, sYPos);
}

//#if 0
function atan8(sXPos: INT16, sYPos: INT16, sXPos2: INT16, sYPos2: INT16): UINT8 {
  let test_x: DOUBLE = sXPos2 - sXPos;
  let test_y: DOUBLE = sYPos2 - sYPos;
  let mFacing: UINT8 = Enum245.WEST;
  let dDegAngle: INT16;
  let angle: DOUBLE;

  if (test_x == 0) {
    test_x = 0.04;
  }

  angle = atan2(test_x, test_y);

  dDegAngle = (angle * 180 / PI);
  // sprintf( gDebugStr, "Move Angle: %d", (int)dDegAngle );

  do {
    if (angle >= -PI * .375 && angle <= -PI * .125) {
      mFacing = Enum245.SOUTHWEST;
      break;
    }

    if (angle <= PI * .375 && angle >= PI * .125) {
      mFacing = Enum245.SOUTHEAST;
      break;
    }

    if (angle >= PI * .623 && angle <= PI * .875) {
      mFacing = Enum245.NORTHEAST;
      break;
    }

    if (angle <= -PI * .623 && angle >= -PI * .875) {
      mFacing = Enum245.NORTHWEST;
      break;
    }

    if (angle > -PI * 0.125 && angle < PI * 0.125) {
      mFacing = Enum245.SOUTH;
    }
    if (angle > PI * 0.375 && angle < PI * 0.623) {
      mFacing = Enum245.EAST;
    }
    if ((angle > PI * 0.875 && angle <= PI) || (angle > -PI && angle < -PI * 0.875)) {
      mFacing = Enum245.NORTH;
    }
    if (angle > -PI * 0.623 && angle < -PI * 0.375) {
      mFacing = Enum245.WEST;
    }
  } while (FALSE);

  return mFacing;
}

function atan8FromAngle(angle: DOUBLE): UINT8 {
  let mFacing: UINT8 = Enum245.WEST;

  if (angle > PI) {
    angle = (angle - PI) - PI;
  }
  if (angle < -PI) {
    angle = (PI - (fabs(angle) - PI));
  }

  do {
    if (angle >= -PI * .375 && angle <= -PI * .125) {
      mFacing = Enum245.SOUTHWEST;
      break;
    }

    if (angle <= PI * .375 && angle >= PI * .125) {
      mFacing = Enum245.SOUTHEAST;
      break;
    }

    if (angle >= PI * .623 && angle <= PI * .875) {
      mFacing = Enum245.NORTHEAST;
      break;
    }

    if (angle <= -PI * .623 && angle >= -PI * .875) {
      mFacing = Enum245.NORTHWEST;
      break;
    }

    if (angle > -PI * 0.125 && angle < PI * 0.125) {
      mFacing = Enum245.SOUTH;
    }
    if (angle > PI * 0.375 && angle < PI * 0.623) {
      mFacing = Enum245.EAST;
    }
    if ((angle > PI * 0.875 && angle <= PI) || (angle > -PI && angle < -PI * 0.875)) {
      mFacing = Enum245.NORTH;
    }
    if (angle > -PI * 0.623 && angle < -PI * 0.375) {
      mFacing = Enum245.WEST;
    }
  } while (FALSE);

  return mFacing;
}

function CheckForFullStructures(pSoldier: Pointer<SOLDIERTYPE>): void {
  // This function checks to see if we are near a specific structure type which requires us to blit a
  // small obscuring peice
  let sGridNo: INT16;
  let usFullTileIndex: UINT16;
  let cnt: INT32;

  // Check in all 'Above' directions
  for (cnt = 0; cnt < MAX_FULLTILE_DIRECTIONS; cnt++) {
    sGridNo = pSoldier.value.sGridNo + gsFullTileDirections[cnt];

    if (CheckForFullStruct(sGridNo, addressof(usFullTileIndex))) {
      // Add one for the item's obsuring part
      pSoldier.value.usFrontArcFullTileList[cnt] = usFullTileIndex + 1;
      pSoldier.value.usFrontArcFullTileGridNos[cnt] = sGridNo;
      AddTopmostToHead(sGridNo, pSoldier.value.usFrontArcFullTileList[cnt]);
    } else {
      if (pSoldier.value.usFrontArcFullTileList[cnt] != 0) {
        RemoveTopmost(pSoldier.value.usFrontArcFullTileGridNos[cnt], pSoldier.value.usFrontArcFullTileList[cnt]);
      }
      pSoldier.value.usFrontArcFullTileList[cnt] = 0;
      pSoldier.value.usFrontArcFullTileGridNos[cnt] = 0;
    }
  }
}

function CheckForFullStruct(sGridNo: INT16, pusIndex: Pointer<UINT16>): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let fTileFlags: UINT32;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != NULL) {
    if (pStruct.value.usIndex != NO_TILE && pStruct.value.usIndex < Enum312.NUMBEROFTILES) {
      GetTileFlags(pStruct.value.usIndex, addressof(fTileFlags));

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      // if( (pOldStruct->pStructureData!=NULL) && ( pOldStruct->pStructureData->fFlags&STRUCTURE_TREE ) )
      if (fTileFlags & FULL3D_TILE) {
        // CHECK IF THIS TREE IS FAIRLY ALONE!
        if (FullStructAlone(sGridNo, 2)) {
          // Return true and return index
          pusIndex.value = pOldStruct.value.usIndex;
          return TRUE;
        } else {
          return FALSE;
        }
      }
    } else {
      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;
    }
  }

  // Could not find it, return FALSE
  return FALSE;
}

function FullStructAlone(sGridNo: INT16, ubRadius: UINT8): BOOLEAN {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let iNewIndex: INT16;
  let leftmost: INT32;

  // Determine start end end indicies and num rows
  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      iNewIndex = sGridNo + (WORLD_COLS * cnt1) + cnt2;

      if (iNewIndex >= 0 && iNewIndex < WORLD_MAX && iNewIndex >= leftmost && iNewIndex < (leftmost + WORLD_COLS)) {
        if (iNewIndex != sGridNo) {
          if (FindStructure(iNewIndex, STRUCTURE_TREE) != NULL) {
            return FALSE;
          }
        }
      }
    }
  }

  return TRUE;
}

function AdjustForFastTurnAnimation(pSoldier: Pointer<SOLDIERTYPE>): void {
  // CHECK FOR FASTTURN ANIMATIONS
  // ATE: Mod: Only fastturn for OUR guys!
  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_FASTTURN && pSoldier.value.bTeam == gbPlayerNum && !(pSoldier.value.uiStatusFlags & SOLDIER_TURNINGFROMHIT)) {
    if (pSoldier.value.bDirection != pSoldier.value.bDesiredDirection) {
      pSoldier.value.sAniDelay = FAST_TURN_ANIM_SPEED;
    } else {
      SetSoldierAniSpeed(pSoldier);
      //	FreeUpNPCFromTurning( pSoldier, LOOK);
    }
  }
}

function IsActionInterruptable(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_NONINTERRUPT) {
    return FALSE;
  }
  return TRUE;
}

// WRAPPER FUNCTIONS FOR SOLDIER EVENTS
function SendSoldierPositionEvent(pSoldier: Pointer<SOLDIERTYPE>, dNewXPos: FLOAT, dNewYPos: FLOAT): void {
  // Sent event for position update
  let SSetPosition: EV_S_SETPOSITION;

  SSetPosition.usSoldierID = pSoldier.value.ubID;
  SSetPosition.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  SSetPosition.dNewXPos = dNewXPos;
  SSetPosition.dNewYPos = dNewYPos;

  AddGameEvent(Enum319.S_SETPOSITION, 0, addressof(SSetPosition));
}

function SendSoldierDestinationEvent(pSoldier: Pointer<SOLDIERTYPE>, usNewDestination: UINT16): void {
  // Sent event for position update
  let SChangeDest: EV_S_CHANGEDEST;

  SChangeDest.usSoldierID = pSoldier.value.ubID;
  SChangeDest.usNewDestination = usNewDestination;
  SChangeDest.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_CHANGEDEST, 0, addressof(SChangeDest));
}

function SendSoldierSetDirectionEvent(pSoldier: Pointer<SOLDIERTYPE>, usNewDirection: UINT16): void {
  // Sent event for position update
  let SSetDirection: EV_S_SETDIRECTION;

  SSetDirection.usSoldierID = pSoldier.value.ubID;
  SSetDirection.usNewDirection = usNewDirection;
  SSetDirection.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_SETDIRECTION, 0, addressof(SSetDirection));
}

function SendSoldierSetDesiredDirectionEvent(pSoldier: Pointer<SOLDIERTYPE>, usDesiredDirection: UINT16): void {
  // Sent event for position update
  let SSetDesiredDirection: EV_S_SETDESIREDDIRECTION;

  SSetDesiredDirection.usSoldierID = pSoldier.value.ubID;
  SSetDesiredDirection.usDesiredDirection = usDesiredDirection;
  SSetDesiredDirection.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_SETDESIREDDIRECTION, 0, addressof(SSetDesiredDirection));
}

function SendGetNewSoldierPathEvent(pSoldier: Pointer<SOLDIERTYPE>, sDestGridNo: UINT16, usMovementAnim: UINT16): void {
  let SGetNewPath: EV_S_GETNEWPATH;

  SGetNewPath.usSoldierID = pSoldier.value.ubID;
  SGetNewPath.sDestGridNo = sDestGridNo;
  SGetNewPath.usMovementAnim = usMovementAnim;
  SGetNewPath.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_GETNEWPATH, 0, addressof(SGetNewPath));
}

function SendChangeSoldierStanceEvent(pSoldier: Pointer<SOLDIERTYPE>, ubNewStance: UINT8): void {
  ChangeSoldierStance(pSoldier, ubNewStance);
}

function SendBeginFireWeaponEvent(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): void {
  let SBeginFireWeapon: EV_S_BEGINFIREWEAPON;

  SBeginFireWeapon.usSoldierID = pSoldier.value.ubID;
  SBeginFireWeapon.sTargetGridNo = sTargetGridNo;
  SBeginFireWeapon.bTargetLevel = pSoldier.value.bTargetLevel;
  SBeginFireWeapon.bTargetCubeLevel = pSoldier.value.bTargetCubeLevel;
  SBeginFireWeapon.uiUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_BEGINFIREWEAPON, 0, addressof(SBeginFireWeapon));
}

// This function just encapolates the check for turnbased and having an attacker in the first place
function ReleaseSoldiersAttacker(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: INT32;
  let ubNumToFree: UINT8;

  // if ( gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT) )
  {
    // ATE: Removed...
    // if ( pSoldier->ubAttackerID != NOBODY )
    {
      // JA2 Gold
      // set next-to-previous attacker, so long as this isn't a repeat attack
      if (pSoldier.value.ubPreviousAttackerID != pSoldier.value.ubAttackerID) {
        pSoldier.value.ubNextToPreviousAttackerID = pSoldier.value.ubPreviousAttackerID;
      }

      // get previous attacker id
      pSoldier.value.ubPreviousAttackerID = pSoldier.value.ubAttackerID;

      // Copy BeingAttackedCount here....
      ubNumToFree = pSoldier.value.bBeingAttackedCount;
      // Zero it out BEFORE, as supression may increase it again...
      pSoldier.value.bBeingAttackedCount = 0;

      for (cnt = 0; cnt < ubNumToFree; cnt++) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker of %d (attacker is %d) - releasesoldierattacker num to free is %d", pSoldier.value.ubID, pSoldier.value.ubAttackerID, ubNumToFree));
        ReduceAttackBusyCount(pSoldier.value.ubAttackerID, FALSE);
      }

      // ATE: Set to NOBODY if this person is NOT dead
      // otherise, we keep it so the kill can be awarded!
      if (pSoldier.value.bLife != 0 && pSoldier.value.ubBodyType != Enum194.QUEENMONSTER) {
        pSoldier.value.ubAttackerID = NOBODY;
      }
    }
  }
}

function MercInWater(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Our water texture , for now is of a given type
  if (pSoldier.value.bOverTerrainType == Enum315.LOW_WATER || pSoldier.value.bOverTerrainType == Enum315.MED_WATER || pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function RevivePlayerTeam(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // End the turn of player charactors
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    ReviveSoldier(pSoldier);
  }
}

function ReviveSoldier(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sX: INT16;
  let sY: INT16;

  if (pSoldier.value.bLife < OKLIFE && pSoldier.value.bActive) {
    // If dead or unconscious, revive!
    pSoldier.value.uiStatusFlags &= (~SOLDIER_DEAD);

    pSoldier.value.bLife = pSoldier.value.bLifeMax;
    pSoldier.value.bBleeding = 0;
    pSoldier.value.ubDesiredHeight = ANIM_STAND;

    AddManToTeam(pSoldier.value.bTeam);

    // Set to standing
    pSoldier.value.fInNonintAnim = FALSE;
    pSoldier.value.fRTInNonintAnim = FALSE;

    // Change to standing,unless we can getup with an animation
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, TRUE);
    BeginSoldierGetup(pSoldier);

    // Makesure center of tile
    sX = CenterX(pSoldier.value.sGridNo);
    sY = CenterY(pSoldier.value.sGridNo);

    EVENT_SetSoldierPosition(pSoldier, sX, sY);

    // Dirty INterface
    fInterfacePanelDirty = DIRTYLEVEL2;
  }
}

function HandleAnimationProfile(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16, fRemove: BOOLEAN): void {
  //#if 0
  let pProfile: Pointer<ANIM_PROF>;
  let pProfileDir: Pointer<ANIM_PROF_DIR>;
  let pProfileTile: Pointer<ANIM_PROF_TILE>;
  let bProfileID: INT8;
  let iTileCount: UINT32;
  let sGridNo: INT16;
  let usAnimSurface: UINT16;

  // ATE

  // Get Surface Index
  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);

  CHECKV(usAnimSurface != INVALID_ANIMATION_SURFACE);

  bProfileID = gAnimSurfaceDatabase[usAnimSurface].bProfile;

  // Determine if this animation has a profile
  if (bProfileID != -1) {
    // Getprofile
    pProfile = addressof(gpAnimProfiles[bProfileID]);

    // Get direction
    pProfileDir = addressof(pProfile.value.Dirs[pSoldier.value.bDirection]);

    // Loop tiles and set accordingly into world
    for (iTileCount = 0; iTileCount < pProfileDir.value.ubNumTiles; iTileCount++) {
      pProfileTile = addressof(pProfileDir.value.pTiles[iTileCount]);

      sGridNo = pSoldier.value.sGridNo + ((WORLD_COLS * pProfileTile.value.bTileY) + pProfileTile.value.bTileX);

      // Check if in bounds
      if (!OutOfBounds(pSoldier.value.sGridNo, sGridNo)) {
        if (fRemove) {
          // Remove from world
          RemoveMerc(sGridNo, pSoldier, TRUE);
        } else {
          // PLace into world
          AddMercToHead(sGridNo, pSoldier, FALSE);
          // if ( pProfileTile->bTileY != 0 || pProfileTile->bTileX != 0 )
          {
            gpWorldLevelData[sGridNo].pMercHead.value.uiFlags |= LEVELNODE_MERCPLACEHOLDER;
            gpWorldLevelData[sGridNo].pMercHead.value.uiAnimHitLocationFlags = pProfileTile.value.usTileFlags;
          }
        }
      }
    }
  }

  //#endif
}

function GetAnimProfileFlags(sGridNo: UINT16, usFlags: Pointer<UINT16>, ppTargSoldier: Pointer<Pointer<SOLDIERTYPE>>, pGivenNode: Pointer<LEVELNODE>): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE>;

  (ppTargSoldier.value) = NULL;
  (usFlags.value) = 0;

  if (pGivenNode == NULL) {
    pNode = gpWorldLevelData[sGridNo].pMercHead;
  } else {
    pNode = pGivenNode.value.pNext;
  }

  //#if 0

  if (pNode != NULL) {
    if (pNode.value.uiFlags & LEVELNODE_MERCPLACEHOLDER) {
      (usFlags.value) = pNode.value.uiAnimHitLocationFlags;
      (ppTargSoldier.value) = pNode.value.pSoldier;
    }
  }

  //#endif

  return pNode;
}

function GetProfileFlagsFromGridno(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16, sTestGridNo: UINT16, usFlags: Pointer<UINT16>): BOOLEAN {
  let pProfile: Pointer<ANIM_PROF>;
  let pProfileDir: Pointer<ANIM_PROF_DIR>;
  let pProfileTile: Pointer<ANIM_PROF_TILE>;
  let bProfileID: INT8;
  let iTileCount: UINT32;
  let sGridNo: INT16;
  let usAnimSurface: UINT16;

  // Get Surface Index
  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);

  CHECKF(usAnimSurface != INVALID_ANIMATION_SURFACE);

  bProfileID = gAnimSurfaceDatabase[usAnimSurface].bProfile;

  usFlags.value = 0;

  // Determine if this animation has a profile
  if (bProfileID != -1) {
    // Getprofile
    pProfile = addressof(gpAnimProfiles[bProfileID]);

    // Get direction
    pProfileDir = addressof(pProfile.value.Dirs[pSoldier.value.bDirection]);

    // Loop tiles and set accordingly into world
    for (iTileCount = 0; iTileCount < pProfileDir.value.ubNumTiles; iTileCount++) {
      pProfileTile = addressof(pProfileDir.value.pTiles[iTileCount]);

      sGridNo = pSoldier.value.sGridNo + ((WORLD_COLS * pProfileTile.value.bTileY) + pProfileTile.value.bTileX);

      // Check if in bounds
      if (!OutOfBounds(pSoldier.value.sGridNo, sGridNo)) {
        if (sGridNo == sTestGridNo) {
          usFlags.value = pProfileTile.value.usTileFlags;
          return TRUE;
        }
      }
    }
  }

  return FALSE;
}

function EVENT_SoldierBeginGiveItem(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pTSoldier: Pointer<SOLDIERTYPE>;

  if (VerifyGiveItem(pSoldier, addressof(pTSoldier))) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    pSoldier.value.bDesiredDirection = pSoldier.value.bPendingActionData3;
    pSoldier.value.bDirection = pSoldier.value.bPendingActionData3;

    // begin animation
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.GIVE_ITEM, 0, FALSE);
  } else {
    UnSetEngagedInConvFromPCAction(pSoldier);

    MemFree(pSoldier.value.pTempObject);
  }
}

function EVENT_SoldierBeginBladeAttack(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let pTSoldier: Pointer<SOLDIERTYPE>;
  // UINT32 uiMercFlags;
  let usSoldierIndex: UINT16;
  let ubTDirection: UINT8;
  let fChangeDirection: BOOLEAN = FALSE;
  let pCorpse: Pointer<ROTTING_CORPSE>;

  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Begin blade attack: ATB  %d", gTacticalStatus.ubAttackBusyCount));

  //}

  // CHANGE DIRECTION AND GOTO ANIMATION NOW
  EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  EVENT_SetSoldierDirection(pSoldier, ubDirection);
  // CHANGE TO ANIMATION

  // DETERMINE ANIMATION TO PLAY
  // LATER BASED ON IF TAREGT KNOWS OF US, STANCE, ETC
  // GET POINTER TO TAREGT
  if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
    let ubTargetID: UINT8;

    // Is there an unconscious guy at gridno......
    ubTargetID = WhoIsThere2(sGridNo, pSoldier.value.bTargetLevel);

    if (ubTargetID != NOBODY && ((MercPtrs[ubTargetID].value.bLife < OKLIFE && MercPtrs[ubTargetID].value.bLife > 0) || (MercPtrs[ubTargetID].value.bBreath < OKBREATH && MercPtrs[ubTargetID].value.bCollapsed))) {
      pSoldier.value.uiPendingActionData4 = ubTargetID;
      // add regen bonus
      pSoldier.value.bRegenerationCounter++;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.MONSTER_BEGIN_EATTING_FLESH, 0, FALSE);
    } else {
      if (PythSpacesAway(pSoldier.value.sGridNo, sGridNo) <= 1) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.MONSTER_CLOSE_ATTACK, 0, FALSE);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADULTMONSTER_ATTACKING, 0, FALSE);
      }
    }
  } else if (pSoldier.value.ubBodyType == Enum194.BLOODCAT) {
    // Check if it's a claws or teeth...
    if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.BLOODCAT_CLAW_ATTACK) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.BLOODCAT_SWIPE, 0, FALSE);
    } else {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.BLOODCAT_BITE_ANIM, 0, FALSE);
    }
  } else {
    usSoldierIndex = WhoIsThere2(sGridNo, pSoldier.value.bTargetLevel);
    if (usSoldierIndex != NOBODY) {
      GetSoldier(addressof(pTSoldier), usSoldierIndex);

      // Look at stance of target
      switch (gAnimControl[pTSoldier.value.usAnimState].ubEndHeight) {
        case ANIM_STAND:
        case ANIM_CROUCH:

          // CHECK IF HE CAN SEE US, IF SO RANDOMIZE
          if (pTSoldier.value.bOppList[pSoldier.value.ubID] == 0 && pTSoldier.value.bTeam != pSoldier.value.bTeam) {
            // WE ARE NOT SEEN
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.STAB, 0, FALSE);
          } else {
            // WE ARE SEEN
            if (Random(50) > 25) {
              EVENT_InitNewSoldierAnim(pSoldier, Enum193.STAB, 0, FALSE);
            } else {
              EVENT_InitNewSoldierAnim(pSoldier, Enum193.SLICE, 0, FALSE);
            }

            // IF WE ARE SEEN, MAKE SURE GUY TURNS!
            // Get direction to target
            // IF WE ARE AN ANIMAL, CAR, MONSTER, DONT'T TURN
            if (!(pTSoldier.value.uiStatusFlags & (SOLDIER_MONSTER | SOLDIER_ANIMAL | SOLDIER_VEHICLE))) {
              // OK, stop merc....
              EVENT_StopMerc(pTSoldier, pTSoldier.value.sGridNo, pTSoldier.value.bDirection);

              if (pTSoldier.value.bTeam != gbPlayerNum) {
                CancelAIAction(pTSoldier, TRUE);
              }

              ubTDirection = GetDirectionFromGridNo(pSoldier.value.sGridNo, pTSoldier);
              SendSoldierSetDesiredDirectionEvent(pTSoldier, ubTDirection);
            }
          }

          break;

        case ANIM_PRONE:

          // CHECK OUR STANCE
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_CROUCH) {
            // SET DESIRED STANCE AND SET PENDING ANIMATION
            SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
            pSoldier.value.usPendingAnimation = Enum193.CROUCH_STAB;
          } else {
            // USE crouched one
            // NEED TO CHANGE STANCE IF NOT CROUCHD!
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCH_STAB, 0, FALSE);
          }
          break;
      }
    } else {
      // OK, SEE IF THERE IS AN OBSTACLE HERE...
      if (!NewOKDestination(pSoldier, sGridNo, FALSE, pSoldier.value.bLevel)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.STAB, 0, FALSE);
      } else {
        // Check for corpse!
        pCorpse = GetCorpseAtGridNo(sGridNo, pSoldier.value.bLevel);

        if (pCorpse == NULL) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCH_STAB, 0, FALSE);
        } else {
          if (IsValidDecapitationCorpse(pCorpse)) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.DECAPITATE, 0, FALSE);
          } else {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCH_STAB, 0, FALSE);
          }
        }
      }
    }
  }

  // SET TARGET GRIDNO
  pSoldier.value.sTargetGridNo = sGridNo;
  pSoldier.value.bTargetLevel = pSoldier.value.bLevel;
  pSoldier.value.ubTargetID = WhoIsThere2(sGridNo, pSoldier.value.bTargetLevel);
}

function EVENT_SoldierBeginPunchAttack(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let fMartialArtist: BOOLEAN = FALSE;
  let pTSoldier: Pointer<SOLDIERTYPE>;
  // UINT32 uiMercFlags;
  let usSoldierIndex: UINT16;
  let ubTDirection: UINT8;
  let fChangeDirection: BOOLEAN = FALSE;
  let usItem: UINT16;

  // Get item in hand...
  usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Begin HTH attack: ATB  %d", gTacticalStatus.ubAttackBusyCount));

  //}

  // get target.....
  usSoldierIndex = WhoIsThere2(pSoldier.value.sTargetGridNo, pSoldier.value.bLevel);
  if (usSoldierIndex != NOBODY) {
    GetSoldier(addressof(pTSoldier), usSoldierIndex);

    fChangeDirection = TRUE;
  } else {
    return;
  }

  if (fChangeDirection) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);
  }

  // Are we a martial artist?
  if (HAS_SKILL_TRAIT(pSoldier, Enum269.MARTIALARTS)) {
    fMartialArtist = TRUE;
  }

  if (fMartialArtist && !AreInMeanwhile() && usItem != Enum225.CROWBAR) {
    // Are we in attack mode yet?
    if (pSoldier.value.usAnimState != Enum193.NINJA_BREATH && gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND && gAnimControl[pTSoldier.value.usAnimState].ubHeight != ANIM_PRONE) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.NINJA_GOTOBREATH, 0, FALSE);
    } else {
      DoNinjaAttack(pSoldier);
    }
  } else {
    // Look at stance of target
    switch (gAnimControl[pTSoldier.value.usAnimState].ubEndHeight) {
      case ANIM_STAND:
      case ANIM_CROUCH:

        if (usItem != Enum225.CROWBAR) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH, 0, FALSE);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROWBAR_ATTACK, 0, FALSE);
        }

        // CHECK IF HE CAN SEE US, IF SO CHANGE DIR
        if (pTSoldier.value.bOppList[pSoldier.value.ubID] == 0 && pTSoldier.value.bTeam != pSoldier.value.bTeam) {
          // Get direction to target
          // IF WE ARE AN ANIMAL, CAR, MONSTER, DONT'T TURN
          if (!(pTSoldier.value.uiStatusFlags & (SOLDIER_MONSTER | SOLDIER_ANIMAL | SOLDIER_VEHICLE))) {
            // OK, stop merc....
            EVENT_StopMerc(pTSoldier, pTSoldier.value.sGridNo, pTSoldier.value.bDirection);

            if (pTSoldier.value.bTeam != gbPlayerNum) {
              CancelAIAction(pTSoldier, TRUE);
            }

            ubTDirection = GetDirectionFromGridNo(pSoldier.value.sGridNo, pTSoldier);
            SendSoldierSetDesiredDirectionEvent(pTSoldier, ubTDirection);
          }
        }
        break;

      case ANIM_PRONE:

        // CHECK OUR STANCE
        // ATE: Added this for CIV body types 'cause of elliot
        if (!IS_MERC_BODY_TYPE(pSoldier)) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH, 0, FALSE);
        } else {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_CROUCH) {
            // SET DESIRED STANCE AND SET PENDING ANIMATION
            SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
            pSoldier.value.usPendingAnimation = Enum193.PUNCH_LOW;
          } else {
            // USE crouched one
            // NEED TO CHANGE STANCE IF NOT CROUCHD!
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH_LOW, 0, FALSE);
          }
        }
        break;
    }
  }

  // SET TARGET GRIDNO
  pSoldier.value.sTargetGridNo = sGridNo;
  pSoldier.value.bTargetLevel = pSoldier.value.bLevel;
  pSoldier.value.sLastTarget = sGridNo;
  pSoldier.value.ubTargetID = WhoIsThere2(sGridNo, pSoldier.value.bTargetLevel);
}

function EVENT_SoldierBeginKnifeThrowAttack(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  //}
  pSoldier.value.bBulletsLeft = 1;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting knifethrow attack, bullets left %d", pSoldier.value.bBulletsLeft));

  EVENT_InitNewSoldierAnim(pSoldier, Enum193.THROW_KNIFE, 0, FALSE);

  // CHANGE DIRECTION AND GOTO ANIMATION NOW
  EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  EVENT_SetSoldierDirection(pSoldier, ubDirection);

  // SET TARGET GRIDNO
  pSoldier.value.sTargetGridNo = sGridNo;
  pSoldier.value.sLastTarget = sGridNo;
  pSoldier.value.fTurningFromPronePosition = 0;
  // NB target level must be set by functions outside of here... but I think it
  // is already set in HandleItem or in the AI code - CJC
  pSoldier.value.ubTargetID = WhoIsThere2(sGridNo, pSoldier.value.bTargetLevel);
}

function EVENT_SoldierBeginDropBomb(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Increment the number of people busy doing stuff because of an attack
  switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
    case ANIM_STAND:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.PLANT_BOMB, 0, FALSE);
      break;

    default:

      // Call hander for planting bomb...
      HandleSoldierDropBomb(pSoldier, pSoldier.value.sPendingActionData2);
      SoldierGotoStationaryStance(pSoldier);
      break;
  }
}

function EVENT_SoldierBeginUseDetonator(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Increment the number of people busy doing stuff because of an attack
  switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
    case ANIM_STAND:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.USE_REMOTE, 0, FALSE);
      break;

    default:

      // Call hander for planting bomb...
      HandleSoldierUseRemote(pSoldier, pSoldier.value.sPendingActionData2);
      break;
  }
}

function EVENT_SoldierBeginFirstAid(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let pTSoldier: Pointer<SOLDIERTYPE>;
  // UINT32 uiMercFlags;
  let usSoldierIndex: UINT16;
  let fRefused: BOOLEAN = FALSE;

  usSoldierIndex = WhoIsThere2(sGridNo, pSoldier.value.bLevel);
  if (usSoldierIndex != NOBODY) {
    pTSoldier = MercPtrs[usSoldierIndex];

    // OK, check if we should play quote...
    if (pTSoldier.value.bTeam != gbPlayerNum) {
      if (pTSoldier.value.ubProfile != NO_PROFILE && pTSoldier.value.ubProfile >= FIRST_RPC && !RPC_RECRUITED(pTSoldier)) {
        fRefused = PCDoesFirstAidOnNPC(pTSoldier.value.ubProfile);
      }

      if (!fRefused) {
        if (CREATURE_OR_BLOODCAT(pTSoldier)) {
          // nope!!
          fRefused = TRUE;
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, Message[Enum334.STR_REFUSE_FIRSTAID_FOR_CREATURE]);
        } else if (!pTSoldier.value.bNeutral && pTSoldier.value.bLife >= OKLIFE && pTSoldier.value.bSide != pSoldier.value.bSide) {
          fRefused = TRUE;
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, Message[Enum334.STR_REFUSE_FIRSTAID]);
        }
      }
    }

    if (fRefused) {
      UnSetUIBusy(pSoldier.value.ubID);
      return;
    }

    // ATE: We can only give firsty aid to one perosn at a time... cancel
    // any now...
    InternalGivingSoldierCancelServices(pSoldier, FALSE);

    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    // CHECK OUR STANCE AND GOTO CROUCH IF NEEDED
    // if ( gAnimControl[ pSoldier->usAnimState ].ubEndHeight != ANIM_CROUCH )
    //{
    // SET DESIRED STANCE AND SET PENDING ANIMATION
    //	SendChangeSoldierStanceEvent( pSoldier, ANIM_CROUCH );
    //	pSoldier->usPendingAnimation = START_AID;
    //}
    // else
    {
      // CHANGE TO ANIMATION
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.START_AID, 0, FALSE);
    }

    // SET TARGET GRIDNO
    pSoldier.value.sTargetGridNo = sGridNo;

    // SET PARTNER ID
    pSoldier.value.ubServicePartner = usSoldierIndex;

    // SET PARTNER'S COUNT REFERENCE
    pTSoldier.value.ubServiceCount++;

    // If target and doer are no the same guy...
    if (pTSoldier.value.ubID != pSoldier.value.ubID && !pTSoldier.value.bCollapsed) {
      SoldierGotoStationaryStance(pTSoldier);
    }
  }
}

function EVENT_SoldierEnterVehicle(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let uiMercFlags: UINT32;
  let usSoldierIndex: UINT16;

  if (FindSoldier(sGridNo, addressof(usSoldierIndex), addressof(uiMercFlags), FIND_SOLDIER_GRIDNO)) {
    pTSoldier = MercPtrs[usSoldierIndex];

    // Enter vehicle...
    EnterVehicle(pTSoldier, pSoldier);
  }

  UnSetUIBusy(pSoldier.value.ubID);
}

function SoldierDressWound(pSoldier: Pointer<SOLDIERTYPE>, pVictim: Pointer<SOLDIERTYPE>, sKitPts: INT16, sStatus: INT16): UINT32 {
  let uiDressSkill: UINT32;
  let uiPossible: UINT32;
  let uiActual: UINT32;
  let uiMedcost: UINT32;
  let uiDeficiency: UINT32;
  let uiAvailAPs: UINT32;
  let uiUsedAPs: UINT32;
  let ubBelowOKlife: UINT8;
  let ubPtsLeft: UINT8;
  let fRanOut: BOOLEAN = FALSE;

  if (pVictim.value.bBleeding < 1 && pVictim.value.bLife >= OKLIFE) {
    return (0); // nothing to do, shouldn't have even been called!
  }

  if (pVictim.value.bLife == 0) {
    return 0;
  }

  // in case he has multiple kits in hand, limit influence of kit status to 100%!
  if (sStatus >= 100) {
    sStatus = 100;
  }

  // calculate wound-dressing skill (3x medical, 2x equip, 1x level, 1x dex)
  uiDressSkill = ((3 * EffectiveMedical(pSoldier)) + // medical knowledge
                  (2 * sStatus) + // state of medical kit
                  (10 * EffectiveExpLevel(pSoldier)) + // battle injury experience
                  EffectiveDexterity(pSoldier)) /
                 7; // general "handiness"

  // try to use every AP that the merc has left
  uiAvailAPs = pSoldier.value.bActionPoints;

  // OK, If we are in real-time, use another value...
  if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    // Set to a value which looks good based on our tactical turns duration
    uiAvailAPs = RT_FIRST_AID_GAIN_MODIFIER;
  }

  // calculate how much bandaging CAN be done this turn
  uiPossible = (uiAvailAPs * uiDressSkill) / 50; // max rate is 2 * fullAPs

  // if no healing is possible (insufficient APs or insufficient dressSkill)
  if (!uiPossible)
    return 0;

  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
  {
    uiPossible += (uiPossible / 2); // add extra 50 %
  }

  uiActual = uiPossible; // start by assuming maximum possible

  // figure out how far below OKLIFE the victim is
  if (pVictim.value.bLife >= OKLIFE) {
    ubBelowOKlife = 0;
  } else {
    ubBelowOKlife = OKLIFE - pVictim.value.bLife;
  }

  // figure out how many healing pts we need to stop dying (2x cost)
  uiDeficiency = (2 * ubBelowOKlife);

  // if, after that, the patient will still be bleeding
  if ((pVictim.value.bBleeding - ubBelowOKlife) > 0) {
    // then add how many healing pts we need to stop bleeding (1x cost)
    uiDeficiency += (pVictim.value.bBleeding - ubBelowOKlife);
  }

  // now, make sure we weren't going to give too much
  if (uiActual > uiDeficiency) // if we were about to apply too much
    uiActual = uiDeficiency; // reduce actual not to waste anything

  // now make sure we HAVE that much
  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.MEDICKIT) {
    uiMedcost = (uiActual + 1) / 2; // cost is only half, rounded up

    if (uiMedcost > sKitPts) // if we can't afford this
    {
      fRanOut = TRUE;
      uiMedcost = sKitPts; // what CAN we afford?
      uiActual = uiMedcost * 2; // give double this as aid
    }
  } else {
    uiMedcost = uiActual;

    if (uiMedcost > sKitPts) // can't afford it
    {
      fRanOut = TRUE;
      uiMedcost = uiActual = sKitPts; // recalc cost AND aid
    }
  }

  ubPtsLeft = uiActual;

  // heal real life points first (if below OKLIFE) because we don't want the
  // patient still DYING if bandages run out, or medic is disabled/distracted!
  // NOTE: Dressing wounds for life below OKLIFE now costs 2 pts/life point!
  if (ubPtsLeft && pVictim.value.bLife < OKLIFE) {
    // if we have enough points to bring him all the way to OKLIFE this turn
    if (ubPtsLeft >= (2 * ubBelowOKlife)) {
      // raise life to OKLIFE
      pVictim.value.bLife = OKLIFE;

      // reduce bleeding by the same number of life points healed up
      pVictim.value.bBleeding -= ubBelowOKlife;

      // use up appropriate # of actual healing points
      ubPtsLeft -= (2 * ubBelowOKlife);
    } else {
      pVictim.value.bLife += (ubPtsLeft / 2);
      pVictim.value.bBleeding -= (ubPtsLeft / 2);

      ubPtsLeft = ubPtsLeft % 2; // if ptsLeft was odd, ptsLeft = 1
    }

    // this should never happen any more, but make sure bleeding not negative
    if (pVictim.value.bBleeding < 0) {
      pVictim.value.bBleeding = 0;
    }

    // if this healing brought the patient out of the worst of it, cancel dying
    if (pVictim.value.bLife >= OKLIFE) {
      // pVictim->dying = pVictim->dyingComment = FALSE;
      // pVictim->shootOn = TRUE;

      // turn off merc QUOTE flags
      pVictim.value.fDyingComment = FALSE;
    }

    // update patient's entire panel (could have regained consciousness, etc.)
  }

  // if any healing points remain, apply that to any remaining bleeding (1/1)
  // DON'T spend any APs/kit pts to cure bleeding until merc is no longer dying
  // if ( ubPtsLeft && pVictim->bBleeding && !pVictim->dying)
  if (ubPtsLeft && pVictim.value.bBleeding) {
    // if we have enough points to bandage all remaining bleeding this turn
    if (ubPtsLeft >= pVictim.value.bBleeding) {
      ubPtsLeft -= pVictim.value.bBleeding;
      pVictim.value.bBleeding = 0;
    } else // bandage what we can
    {
      pVictim.value.bBleeding -= ubPtsLeft;
      ubPtsLeft = 0;
    }

    // update patient's life bar only
  }

  // if wound has been dressed enough so that bleeding won't occur, turn off
  // the "warned about bleeding" flag so merc tells us about the next bleeding
  if (pVictim.value.bBleeding <= MIN_BLEEDING_THRESHOLD) {
    pVictim.value.fWarnedAboutBleeding = FALSE;
  }

  // if there are any ptsLeft now, then we didn't actually get to use them
  uiActual -= ubPtsLeft;

  // usedAPs equals (actionPts) * (%of possible points actually used)
  uiUsedAPs = (uiActual * uiAvailAPs) / uiPossible;

  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
  {
    uiUsedAPs = (uiUsedAPs * 2) / 3; // reverse 50% bonus by taking 2/3rds
  }

  DeductPoints(pSoldier, uiUsedAPs, ((uiUsedAPs * BP_PER_AP_LT_EFFORT)));

  if (PTR_OURTEAM()) {
    // MEDICAL GAIN   (actual / 2):  Helped someone by giving first aid
    StatChange(pSoldier, MEDICALAMT, (uiActual / 2), FALSE);

    // DEXTERITY GAIN (actual / 6):  Helped someone by giving first aid
    StatChange(pSoldier, DEXTAMT, (uiActual / 6), FALSE);
  }

  return uiMedcost;
}

function InternalReceivingSoldierCancelServices(pSoldier: Pointer<SOLDIERTYPE>, fPlayEndAnim: BOOLEAN): void {
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;

  if (pSoldier.value.ubServiceCount > 0) {
    // Loop through guys who have us as servicing
    for (pTSoldier = Menptr, cnt = 0; cnt < MAX_NUM_SOLDIERS; pTSoldier++, cnt++) {
      if (pTSoldier.value.bActive) {
        if (pTSoldier.value.ubServicePartner == pSoldier.value.ubID) {
          // END SERVICE!
          pSoldier.value.ubServiceCount--;

          pTSoldier.value.ubServicePartner = NOBODY;

          if (gTacticalStatus.fAutoBandageMode) {
            pSoldier.value.ubAutoBandagingMedic = NOBODY;

            ActionDone(pTSoldier);
          } else {
            // don't use end aid animation in autobandage
            if (pTSoldier.value.bLife >= OKLIFE && pTSoldier.value.bBreath > 0 && fPlayEndAnim) {
              EVENT_InitNewSoldierAnim(pTSoldier, Enum193.END_AID, 0, FALSE);
            }
          }
        }
      }
    }
  }
}

function ReceivingSoldierCancelServices(pSoldier: Pointer<SOLDIERTYPE>): void {
  InternalReceivingSoldierCancelServices(pSoldier, TRUE);
}

function InternalGivingSoldierCancelServices(pSoldier: Pointer<SOLDIERTYPE>, fPlayEndAnim: BOOLEAN): void {
  let pTSoldier: Pointer<SOLDIERTYPE>;

  // GET TARGET SOLDIER
  if (pSoldier.value.ubServicePartner != NOBODY) {
    pTSoldier = MercPtrs[pSoldier.value.ubServicePartner];

    // END SERVICE!
    pTSoldier.value.ubServiceCount--;

    pSoldier.value.ubServicePartner = NOBODY;

    if (gTacticalStatus.fAutoBandageMode) {
      pTSoldier.value.ubAutoBandagingMedic = NOBODY;

      ActionDone(pSoldier);
    } else {
      if (pSoldier.value.bLife >= OKLIFE && pSoldier.value.bBreath > 0 && fPlayEndAnim) {
        // don't use end aid animation in autobandage
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_AID, 0, FALSE);
      }
    }
  }
}

function GivingSoldierCancelServices(pSoldier: Pointer<SOLDIERTYPE>): void {
  InternalGivingSoldierCancelServices(pSoldier, TRUE);
}

function HaultSoldierFromSighting(pSoldier: Pointer<SOLDIERTYPE>, fFromSightingEnemy: BOOLEAN): void {
  // SEND HUALT EVENT!
  // EV_S_STOP_MERC				SStopMerc;

  // SStopMerc.sGridNo					= pSoldier->sGridNo;
  // SStopMerc.bDirection			= pSoldier->bDirection;
  // SStopMerc.usSoldierID			= pSoldier->ubID;
  // AddGameEvent( S_STOP_MERC, 0, &SStopMerc );

  // If we are a 'specialmove... ignore...
  if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_SPECIALMOVE)) {
    return;
  }

  // OK, check if we were going to throw something, and give it back if so!
  if (pSoldier.value.pTempObject != NULL && fFromSightingEnemy) {
    // Place it back into inv....
    AutoPlaceObject(pSoldier, pSoldier.value.pTempObject, FALSE);
    MemFree(pSoldier.value.pTempObject);
    pSoldier.value.pTempObject = NULL;
    pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
    pSoldier.value.usPendingAnimation2 = NO_PENDING_ANIMATION;

    // Decrement attack counter...
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Reducing attacker busy count..., ending throw because saw something"));
    ReduceAttackBusyCount(pSoldier.value.ubID, FALSE);

    // ATE: Goto stationary stance......
    SoldierGotoStationaryStance(pSoldier);

    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
  }

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
  } else {
    // Pause this guy from no APS
    AdjustNoAPToFinishMove(pSoldier, TRUE);

    pSoldier.value.ubReasonCantFinishMove = Enum263.REASON_STOPPED_SIGHT;

    // ATE; IF turning to shoot, stop!
    // ATE: We want to do this only for enemies, not items....
    if (pSoldier.value.fTurningToShoot && fFromSightingEnemy) {
      pSoldier.value.fTurningToShoot = FALSE;
      // Release attacker

      // OK - this is hightly annoying , but due to the huge combinations of
      // things that can happen - 1 of them is that sLastTarget will get unset
      // after turn is done - so set flag here to tell it not to...
      pSoldier.value.fDontUnsetLastTargetFromTurn = TRUE;

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Reducing attacker busy count..., ending fire because saw something"));
      ReduceAttackBusyCount(pSoldier.value.ubID, FALSE);
    }

    // OK, if we are stopped at our destination, cancel pending action...
    if (fFromSightingEnemy) {
      if (pSoldier.value.ubPendingAction != NO_PENDING_ACTION && pSoldier.value.sGridNo == pSoldier.value.sFinalDestination) {
        pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
      }

      // Stop pending animation....
      pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
      pSoldier.value.usPendingAnimation2 = NO_PENDING_ANIMATION;
    }

    if (!pSoldier.value.fTurningToShoot) {
      pSoldier.value.fTurningFromPronePosition = FALSE;
    }
  }

  // Unset UI!
  if (fFromSightingEnemy || (pSoldier.value.pTempObject == NULL && !pSoldier.value.fTurningToShoot)) {
    UnSetUIBusy(pSoldier.value.ubID);
  }

  pSoldier.value.bTurningFromUI = FALSE;

  UnSetEngagedInConvFromPCAction(pSoldier);
}

// HUALT EVENT IS USED TO STOP A MERC - NETWORKING SHOULD CHECK / ADJUST TO GRIDNO?
function EVENT_StopMerc(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bDirection: INT8): void {
  let sX: INT16;
  let sY: INT16;

  // MOVE GUY TO GRIDNO--- SHOULD BE THE SAME UNLESS IN MULTIPLAYER
  // Makesure center of tile
  sX = CenterX(sGridNo);
  sY = CenterY(sGridNo);

  // Cancel pending events
  if (!pSoldier.value.fDelayedMovement) {
    pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
    pSoldier.value.usPendingAnimation2 = NO_PENDING_ANIMATION;
    pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
    pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
  }

  pSoldier.value.bEndDoorOpenCode = 0;
  pSoldier.value.fTurningFromPronePosition = 0;

  // Cancel path data!
  pSoldier.value.usPathIndex = pSoldier.value.usPathDataSize = 0;

  // Set ext tile waiting flag off!
  pSoldier.value.fDelayedMovement = FALSE;

  // Turn off reverse...
  pSoldier.value.bReverse = FALSE;

  EVENT_SetSoldierPosition(pSoldier, sX, sY);
  pSoldier.value.sDestXPos = pSoldier.value.dXPos;
  pSoldier.value.sDestYPos = pSoldier.value.dYPos;
  EVENT_SetSoldierDirection(pSoldier, bDirection);

  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_MOVING) {
    SoldierGotoStationaryStance(pSoldier);
  }

  // ATE; IF turning to shoot, stop!
  if (pSoldier.value.fTurningToShoot) {
    pSoldier.value.fTurningToShoot = FALSE;
    // Release attacker
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Reducing attacker busy count..., ending fire because saw something"));
    ReduceAttackBusyCount(pSoldier.value.ubID, FALSE);
  }

  // Turn off multi-move speed override....
  if (pSoldier.value.sGridNo == pSoldier.value.sFinalDestination) {
    pSoldier.value.fUseMoverrideMoveSpeed = FALSE;
  }

  // Unset UI!
  UnSetUIBusy(pSoldier.value.ubID);

  UnMarkMovementReserved(pSoldier);
}

function ReLoadSoldierAnimationDueToHandItemChange(pSoldier: Pointer<SOLDIERTYPE>, usOldItem: UINT16, usNewItem: UINT16): void {
  // DON'T continue aiming!
  // GOTO STANCE
  // CHECK FOR AIMING ANIMATIONS
  let fOldRifle: BOOLEAN = FALSE;
  let fNewRifle: BOOLEAN = FALSE;

  // Shutoff burst....
  // ( we could be on, then change gun that does not have burst )
  if (Weapon[usNewItem].ubShotsPerBurst == 0) {
    pSoldier.value.bDoBurst = FALSE;
    pSoldier.value.bWeaponMode = Enum265.WM_NORMAL;
  }

  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_FIREREADY) {
    // Stop aiming!
    SoldierGotoStationaryStance(pSoldier);
  }

  // Cancel services...
  GivingSoldierCancelServices(pSoldier);

  // Did we have a rifle and do we now not have one?
  if (usOldItem != NOTHING) {
    if (Item[usOldItem].usItemClass == IC_GUN) {
      if ((Item[usOldItem].fFlags & ITEM_TWO_HANDED) && usOldItem != Enum225.ROCKET_LAUNCHER) {
        fOldRifle = TRUE;
      }
    }
  }

  if (usNewItem != NOTHING) {
    if (Item[usNewItem].usItemClass == IC_GUN) {
      if ((Item[usNewItem].fFlags & ITEM_TWO_HANDED) && usNewItem != Enum225.ROCKET_LAUNCHER) {
        fNewRifle = TRUE;
      }
    }
  }

  // Switch on stance!
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      if (fOldRifle && !fNewRifle) {
        // Put it away!
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.LOWER_RIFLE, 0, FALSE);
      } else if (!fOldRifle && fNewRifle) {
        // Bring it up!
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.RAISE_RIFLE, 0, FALSE);
      } else {
        SetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);
      }
      break;

    case ANIM_CROUCH:
    case ANIM_PRONE:

      SetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);
      break;
  }
}

function CreateEnemyGlow16BPPPalette(pPalette: Pointer<SGPPaletteEntry>, rscale: UINT32, gscale: UINT32, fAdjustGreen: BOOLEAN): Pointer<UINT16> {
  let p16BPPPalette: Pointer<UINT16>;
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let usColor: UINT16;
  let cnt: UINT32;
  let rmod: UINT32;
  let gmod: UINT32;
  let bmod: UINT32;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  Assert(pPalette != NULL);

  p16BPPPalette = MemAlloc(sizeof(UINT16) * 256);

  for (cnt = 0; cnt < 256; cnt++) {
    gmod = (pPalette[cnt].peGreen);
    bmod = (pPalette[cnt].peBlue);

    rmod = __max(rscale, (pPalette[cnt].peRed));

    if (fAdjustGreen) {
      gmod = __max(gscale, (pPalette[cnt].peGreen));
    }

    r = __min(rmod, 255);
    g = __min(gmod, 255);
    b = __min(bmod, 255);

    if (gusRedShift < 0)
      r16 = (r >> (-gusRedShift));
    else
      r16 = (r << gusRedShift);

    if (gusGreenShift < 0)
      g16 = (g >> (-gusGreenShift));
    else
      g16 = (g << gusGreenShift);

    if (gusBlueShift < 0)
      b16 = (b >> (-gusBlueShift));
    else
      b16 = (b << gusBlueShift);

    // Prevent creation of pure black color
    usColor = (r16 & gusRedMask) | (g16 & gusGreenMask) | (b16 & gusBlueMask);

    if ((usColor == 0) && ((r + g + b) != 0))
      usColor = 0x0001;

    p16BPPPalette[cnt] = usColor;
  }
  return p16BPPPalette;
}

function CreateEnemyGreyGlow16BPPPalette(pPalette: Pointer<SGPPaletteEntry>, rscale: UINT32, gscale: UINT32, fAdjustGreen: BOOLEAN): Pointer<UINT16> {
  let p16BPPPalette: Pointer<UINT16>;
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let usColor: UINT16;
  let cnt: UINT32;
  let lumin: UINT32;
  let rmod: UINT32;
  let gmod: UINT32;
  let bmod: UINT32;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  Assert(pPalette != NULL);

  p16BPPPalette = MemAlloc(sizeof(UINT16) * 256);

  for (cnt = 0; cnt < 256; cnt++) {
    lumin = (pPalette[cnt].peRed * 299 / 1000) + (pPalette[cnt].peGreen * 587 / 1000) + (pPalette[cnt].peBlue * 114 / 1000);
    rmod = (100 * lumin) / 256;
    gmod = (100 * lumin) / 256;
    bmod = (100 * lumin) / 256;

    rmod = __max(rscale, rmod);

    if (fAdjustGreen) {
      gmod = __max(gscale, gmod);
    }

    r = __min(rmod, 255);
    g = __min(gmod, 255);
    b = __min(bmod, 255);

    if (gusRedShift < 0)
      r16 = (r >> (-gusRedShift));
    else
      r16 = (r << gusRedShift);

    if (gusGreenShift < 0)
      g16 = (g >> (-gusGreenShift));
    else
      g16 = (g << gusGreenShift);

    if (gusBlueShift < 0)
      b16 = (b >> (-gusBlueShift));
    else
      b16 = (b << gusBlueShift);

    // Prevent creation of pure black color
    usColor = (r16 & gusRedMask) | (g16 & gusGreenMask) | (b16 & gusBlueMask);

    if ((usColor == 0) && ((r + g + b) != 0))
      usColor = 0x0001;

    p16BPPPalette[cnt] = usColor;
  }
  return p16BPPPalette;
}

function ContinueMercMovement(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sAPCost: INT16;
  let sGridNo: INT16;

  sGridNo = pSoldier.value.sFinalDestination;

  // Can we afford this?
  if (pSoldier.value.bGoodContPath) {
    sGridNo = pSoldier.value.sContPathLocation;
  } else {
    // ATE: OK, don't cancel count, so pending actions are still valid...
    pSoldier.value.ubPendingActionAnimCount = 0;
  }

  // get a path to dest...
  if (FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, 0)) {
    sAPCost = PtsToMoveDirection(pSoldier, guiPathingData[0]);

    if (EnoughPoints(pSoldier, sAPCost, 0, (pSoldier.value.bTeam == gbPlayerNum))) {
      // Acknowledge
      if (pSoldier.value.bTeam == gbPlayerNum) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);

        // If we have a face, tell text in it to go away!
        if (pSoldier.value.iFaceIndex != -1) {
          gFacesData[pSoldier.value.iFaceIndex].fDisplayTextOver = FACE_ERASE_TEXT_OVER;
        }
      }

      AdjustNoAPToFinishMove(pSoldier, FALSE);

      SetUIBusy(pSoldier.value.ubID);

      // OK, try and get a path to out dest!
      EVENT_InternalGetNewSoldierPath(pSoldier, sGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
    }
  }
}

function CheckForBreathCollapse(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Check if we are out of breath!
  // Only check if > 70
  if (pSoldier.value.bBreathMax > 70) {
    if (pSoldier.value.bBreath < 20 && !(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_LOW_BREATH) && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
      // WARN!
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_OUT_OF_BREATH);

      // Set flag indicating we were warned!
      pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_LOW_BREATH;
    }
  }

  // Check for drowing.....
  // if ( pSoldier->bBreath < 10 && !(pSoldier->usQuoteSaidFlags & SOLDIER_QUOTE_SAID_DROWNING ) && pSoldier->bOverTerrainType == DEEP_WATER )
  //{
  // WARN!
  //	TacticalCharacterDialogue( pSoldier, QUOTE_DROWNING );

  // Set flag indicating we were warned!
  //	pSoldier->usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_DROWNING;

  // WISDOM GAIN (25):  Starting to drown
  //  StatChange( pSoldier, WISDOMAMT, 25, FALSE );

  //}

  if (pSoldier.value.bBreath == 0 && !pSoldier.value.bCollapsed && !(pSoldier.value.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_ANIMAL | SOLDIER_MONSTER))) {
    // Collapse!
    // OK, Set a flag, because we may still be in the middle of an animation what is not interruptable...
    pSoldier.value.bBreathCollapsed = TRUE;

    return TRUE;
  }

  return FALSE;
}

function InternalIsValidStance(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8, bNewStance: INT8): BOOLEAN {
  let usOKToAddStructID: UINT16 = 0;
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
  let usAnimSurface: UINT16 = 0;
  let usAnimState: UINT16;

  // Check, if dest is prone, we can actually do this!

  // If we are a vehicle, we can only 'stand'
  if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && bNewStance != ANIM_STAND) {
    return FALSE;
  }

  // Check if we are in water?
  if (MercInWater(pSoldier)) {
    if (bNewStance == ANIM_PRONE || bNewStance == ANIM_CROUCH) {
      return FALSE;
    }
  }

  if (pSoldier.value.ubBodyType == Enum194.ROBOTNOWEAPON && bNewStance != ANIM_STAND) {
    return FALSE;
  }

  // Check if we are in water?
  if (AM_AN_EPC(pSoldier)) {
    if (bNewStance == ANIM_PRONE) {
      return FALSE;
    } else {
      return TRUE;
    }
  }

  if (pSoldier.value.bCollapsed) {
    if (bNewStance == ANIM_STAND || bNewStance == ANIM_CROUCH) {
      return FALSE;
    }
  }

  // Check if we can do this....
  if (pSoldier.value.pLevelNode && pSoldier.value.pLevelNode.value.pStructureData != NULL) {
    usOKToAddStructID = pSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
  } else {
    usOKToAddStructID = INVALID_STRUCTURE_ID;
  }

  switch (bNewStance) {
    case ANIM_STAND:

      usAnimState = Enum193.STANDING;
      break;

    case ANIM_CROUCH:

      usAnimState = Enum193.CROUCHING;
      break;

    case ANIM_PRONE:

      usAnimState = Enum193.PRONE;
      break;

    default:

      // Something gone funny here....
      usAnimState = pSoldier.value.usAnimState;
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Wrong desired stance given: %d, %d.", bNewStance, pSoldier.value.usAnimState);
  }

  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);

  // Get structure ref........
  pStructureFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, usAnimState);

  if (pStructureFileRef != NULL) {
    // Can we add structure data for this stance...?
    if (!OkayToAddStructureToWorld(pSoldier.value.sGridNo, pSoldier.value.bLevel, addressof(pStructureFileRef.value.pDBStructureRef[gOneCDirection[bDirection]]), usOKToAddStructID)) {
      return FALSE;
    }
  }

  return TRUE;
}

function IsValidStance(pSoldier: Pointer<SOLDIERTYPE>, bNewStance: INT8): BOOLEAN {
  return InternalIsValidStance(pSoldier, pSoldier.value.bDirection, bNewStance);
}

function IsValidMovementMode(pSoldier: Pointer<SOLDIERTYPE>, usMovementMode: INT16): BOOLEAN {
  // Check, if dest is prone, we can actually do this!

  // Check if we are in water?
  if (MercInWater(pSoldier)) {
    if (usMovementMode == Enum193.RUNNING || usMovementMode == Enum193.SWATTING || usMovementMode == Enum193.CRAWLING) {
      return FALSE;
    }
  }

  return TRUE;
}

function SelectMoveAnimationFromStance(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Determine which animation to do...depending on stance and gun in hand...
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.WALKING, 0, FALSE);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRAWLING, 0, FALSE);
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.SWATTING, 0, FALSE);
      break;
  }
}

function GetActualSoldierAnimDims(pSoldier: Pointer<SOLDIERTYPE>, psHeight: Pointer<INT16>, psWidth: Pointer<INT16>): void {
  let usAnimSurface: UINT16;
  let pTrav: Pointer<ETRLEObject>;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    psHeight.value = 5;
    psWidth.value = 5;

    return;
  }

  if (gAnimSurfaceDatabase[usAnimSurface].hVideoObject == NULL) {
    psHeight.value = 5;
    psWidth.value = 5;
    return;
  }

  // OK, noodle here on what we should do... If we take each frame, it will be different slightly
  // depending on the frame and the value returned here will vary thusly. However, for the
  // uses of this function, we should be able to use just the first frame...

  if (pSoldier.value.usAniFrame >= gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.usNumberOfObjects) {
    let i: int = 0;
  }

  pTrav = addressof(gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pETRLEObject[pSoldier.value.usAniFrame]);

  psHeight.value = pTrav.value.usHeight;
  psWidth.value = pTrav.value.usWidth;
}

function GetActualSoldierAnimOffsets(pSoldier: Pointer<SOLDIERTYPE>, sOffsetX: Pointer<INT16>, sOffsetY: Pointer<INT16>): void {
  let usAnimSurface: UINT16;
  let pTrav: Pointer<ETRLEObject>;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    sOffsetX.value = 0;
    sOffsetY.value = 0;

    return;
  }

  if (gAnimSurfaceDatabase[usAnimSurface].hVideoObject == NULL) {
    sOffsetX.value = 0;
    sOffsetY.value = 0;
    return;
  }

  pTrav = addressof(gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pETRLEObject[pSoldier.value.usAniFrame]);

  sOffsetX.value = pTrav.value.sOffsetX;
  sOffsetY.value = pTrav.value.sOffsetY;
}

function SetSoldierLocatorOffsets(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sHeight: INT16;
  let sWidth: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;

  // OK, from our animation, get height, width
  GetActualSoldierAnimDims(pSoldier, addressof(sHeight), addressof(sWidth));
  GetActualSoldierAnimOffsets(pSoldier, addressof(sOffsetX), addressof(sOffsetY));

  // OK, here, use the difference between center of animation ( sWidth/2 ) and our offset!
  // pSoldier->sLocatorOffX = ( abs( sOffsetX ) ) - ( sWidth / 2 );

  pSoldier.value.sBoundingBoxWidth = sWidth;
  pSoldier.value.sBoundingBoxHeight = sHeight;
  pSoldier.value.sBoundingBoxOffsetX = sOffsetX;
  pSoldier.value.sBoundingBoxOffsetY = sOffsetY;
}

function SoldierCarriesTwoHandedWeapon(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let usItem: UINT16;

  usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  if (usItem != NOTHING && (Item[usItem].fFlags & ITEM_TWO_HANDED)) {
    return TRUE;
  }

  return FALSE;
}

function CheckBleeding(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let bBandaged: INT8; //,savedOurTurn;
  let iBlood: INT32 = NOBLOOD;

  if (pSoldier.value.bLife != 0) {
    // if merc is hurt beyond the minimum required to bleed, or he's dying
    if ((pSoldier.value.bBleeding > MIN_BLEEDING_THRESHOLD) || pSoldier.value.bLife < OKLIFE) {
      // if he's NOT in the process of being bandaged or DOCTORed
      if ((pSoldier.value.ubServiceCount == 0) && (AnyDoctorWhoCanHealThisPatient(pSoldier, HEALABLE_EVER) == NULL)) {
        // may drop blood whether or not any bleeding takes place this turn
        if (pSoldier.value.bTilesMoved < 1) {
          iBlood = ((pSoldier.value.bBleeding - MIN_BLEEDING_THRESHOLD) / BLOODDIVISOR); // + pSoldier->dying;
          if (iBlood > MAXBLOODQUANTITY) {
            iBlood = MAXBLOODQUANTITY;
          }
        } else {
          iBlood = NOBLOOD;
        }

        // Are we in a different mode?
        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
          pSoldier.value.dNextBleed -= RT_NEXT_BLEED_MODIFIER;
        } else {
          // Do a single step descrease
          pSoldier.value.dNextBleed--;
        }

        // if it's time to lose some blood
        if (pSoldier.value.dNextBleed <= 0) {
          // first, calculate if soldier is bandaged
          bBandaged = pSoldier.value.bLifeMax - pSoldier.value.bBleeding - pSoldier.value.bLife;

          // as long as he's bandaged and not "dying"
          if (bBandaged && pSoldier.value.bLife >= OKLIFE) {
            // just bleeding through existing bandages
            pSoldier.value.bBleeding++;

            SoldierBleed(pSoldier, TRUE);
          } else // soldier is either not bandaged at all or is dying
          {
            if (pSoldier.value.bLife < OKLIFE) // if he's dying
            {
              // if he's conscious, and he hasn't already, say his "dying quote"
              if ((pSoldier.value.bLife >= CONSCIOUSNESS) && !pSoldier.value.fDyingComment) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SERIOUSLY_WOUNDED);

                pSoldier.value.fDyingComment = TRUE;
              }

              // can't permit lifemax to ever bleed beneath OKLIFE, or that
              // soldier might as well be dead!
              if (pSoldier.value.bLifeMax >= OKLIFE) {
                // bleeding while "dying" costs a PERMANENT point of life each time!
                pSoldier.value.bLifeMax--;
                pSoldier.value.bBleeding--;
              }
            }
          }

          // either way, a point of life (health) is lost because of bleeding
          // This will also update the life bar

          SoldierBleed(pSoldier, FALSE);

          // if he's not dying (which includes him saying the dying quote just
          // now), and he hasn't warned us that he's bleeding yet, he does so
          // Also, not if they are being bandaged....
          if ((pSoldier.value.bLife >= OKLIFE) && !pSoldier.value.fDyingComment && !pSoldier.value.fWarnedAboutBleeding && !gTacticalStatus.fAutoBandageMode && pSoldier.value.ubServiceCount == 0) {
            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_STARTING_TO_BLEED);

            // "starting to bleed" quote
            pSoldier.value.fWarnedAboutBleeding = TRUE;
          }

          pSoldier.value.dNextBleed = CalcSoldierNextBleed(pSoldier);
        }
      }
    }
  }
  return iBlood;
}

function SoldierBleed(pSoldier: Pointer<SOLDIERTYPE>, fBandagedBleed: BOOLEAN): void {
  let bOldLife: INT8;

  // OK, here make some stuff happen for bleeding
  // A banaged bleed does not show damage taken , just through existing bandages

  // ATE: Do this ONLY if buddy is in sector.....
  if ((pSoldier.value.bInSector && guiCurrentScreen == Enum26.GAME_SCREEN) || guiCurrentScreen != Enum26.GAME_SCREEN) {
    pSoldier.value.fFlashPortrait = TRUE;
    pSoldier.value.bFlashPortraitFrame = FLASH_PORTRAIT_STARTSHADE;
    RESETTIMECOUNTER(pSoldier.value.PortraitFlashCounter, FLASH_PORTRAIT_DELAY);

    // If we are in mapscreen, set this person as selected
    if (guiCurrentScreen == Enum26.MAP_SCREEN) {
      SetInfoChar(pSoldier.value.ubID);
    }
  }

  bOldLife = pSoldier.value.bLife;

  // If we are already dead, don't show damage!
  if (!fBandagedBleed) {
    SoldierTakeDamage(pSoldier, ANIM_CROUCH, 1, 100, TAKE_DAMAGE_BLOODLOSS, NOBODY, NOWHERE, 0, TRUE);
  }
}

function SoldierCollapse(pSoldier: Pointer<SOLDIERTYPE>): void {
  let fMerc: BOOLEAN = FALSE;

  if (pSoldier.value.ubBodyType <= Enum194.REGFEMALE) {
    fMerc = TRUE;
  }

  // If we are an animal, etc, don't do anything....
  switch (pSoldier.value.ubBodyType) {
    case Enum194.ADULTFEMALEMONSTER:
    case Enum194.AM_MONSTER:
    case Enum194.YAF_MONSTER:
    case Enum194.YAM_MONSTER:
    case Enum194.LARVAE_MONSTER:
    case Enum194.INFANT_MONSTER:
    case Enum194.QUEENMONSTER:

      // Give breath back....
      DeductPoints(pSoldier, 0, -5000);
      return;
      break;
  }

  pSoldier.value.bCollapsed = TRUE;

  ReceivingSoldierCancelServices(pSoldier);

  // CC has requested - handle sight here...
  HandleSight(pSoldier, SIGHT_LOOK);

  // Check height
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_WATER_DIE, 0, FALSE);
      } else if (pSoldier.value.bOverTerrainType == Enum315.LOW_WATER) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.WATER_DIE, 0, FALSE);
      } else {
        BeginTyingToFall(pSoldier);
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_STAND, 0, FALSE);
      }
      break;

    case ANIM_CROUCH:

      // Crouched or prone, only for mercs!
      BeginTyingToFall(pSoldier);

      if (fMerc) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_CROUCH, 0, FALSE);
      } else {
        // For civs... use fall from stand...
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_STAND, 0, FALSE);
      }
      break;

    case ANIM_PRONE:

      switch (pSoldier.value.usAnimState) {
        case Enum193.FALLFORWARD_FROMHIT_STAND:
        case Enum193.ENDFALLFORWARD_FROMHIT_CROUCH:

          ChangeSoldierState(pSoldier, Enum193.STAND_FALLFORWARD_STOP, 0, FALSE);
          break;

        case Enum193.FALLBACK_HIT_STAND:
          ChangeSoldierState(pSoldier, Enum193.FALLBACKHIT_STOP, 0, FALSE);
          break;

        default:
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PRONE_LAY_FROMHIT, 0, FALSE);
          break;
      }
      break;
  }

  if (pSoldier.value.uiStatusFlags & SOLDIER_ENEMY) {
    if (!(gTacticalStatus.bPanicTriggerIsAlarm) && (gTacticalStatus.ubTheChosenOne == pSoldier.value.ubID)) {
      // replace this guy as the chosen one!
      gTacticalStatus.ubTheChosenOne = NOBODY;
      MakeClosestEnemyChosenOne();
    }

    if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) && (pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL)) {
      EndAIGuysTurn(pSoldier);
    }
  }

  // DON'T DE-SELECT GUY.....
  // else
  //{
  // Check if this is our selected guy...
  //	if ( pSoldier->ubID == gusSelectedSoldier )
  //	{
  //		SelectNextAvailSoldier( pSoldier );
  //		}
  //}
}

function CalcSoldierNextBleed(pSoldier: Pointer<SOLDIERTYPE>): FLOAT {
  let bBandaged: INT8;

  // calculate how many turns before he bleeds again
  // bleeding faster the lower life gets, and if merc is running around
  // pSoldier->nextbleed = 2 + (pSoldier->life / (10 + pSoldier->tilesMoved));  // min = 2

  // if bandaged, give 1/2 of the bandaged life points back into equation
  bBandaged = pSoldier.value.bLifeMax - pSoldier.value.bLife - pSoldier.value.bBleeding;

  return (1 + ((pSoldier.value.bLife + bBandaged / 2) / (10 + pSoldier.value.bTilesMoved))); // min = 1
}

function CalcSoldierNextUnmovingBleed(pSoldier: Pointer<SOLDIERTYPE>): FLOAT {
  let bBandaged: INT8;

  // calculate bleeding rate without the penalty for tiles moved

  // if bandaged, give 1/2 of the bandaged life points back into equation
  bBandaged = pSoldier.value.bLifeMax - pSoldier.value.bLife - pSoldier.value.bBleeding;

  return (1 + ((pSoldier.value.bLife + bBandaged / 2) / 10)); // min = 1
}

function HandlePlacingRoofMarker(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, fSet: BOOLEAN, fForce: BOOLEAN): void {
  let pRoofNode: Pointer<LEVELNODE>;
  let pNode: Pointer<LEVELNODE>;

  if (pSoldier.value.bVisible == -1 && fSet) {
    return;
  }

  if (pSoldier.value.bTeam != gbPlayerNum) {
    // return;
  }

  // If we are on the roof, add roof UI peice!
  if (pSoldier.value.bLevel == SECOND_LEVEL) {
    // Get roof node
    pRoofNode = gpWorldLevelData[sGridNo].pRoofHead;

    // Return if we are still climbing roof....
    if (pSoldier.value.usAnimState == Enum193.CLIMBUPROOF && !fForce) {
      return;
    }

    if (pRoofNode != NULL) {
      if (fSet) {
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) {
          // Set some flags on this poor thing
          // pRoofNode->uiFlags |= ( LEVELNODE_USEBESTTRANSTYPE | LEVELNODE_REVEAL | LEVELNODE_DYNAMIC  );
          // pRoofNode->uiFlags |= ( LEVELNODE_DYNAMIC );
          // pRoofNode->uiFlags &= ( ~LEVELNODE_HIDDEN );
          // ResetSpecificLayerOptimizing( TILES_DYNAMIC_ROOF );
        }
      } else {
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) {
          // Remove some flags on this poor thing
          // pRoofNode->uiFlags &= ~( LEVELNODE_USEBESTTRANSTYPE | LEVELNODE_REVEAL | LEVELNODE_DYNAMIC );

          // pRoofNode->uiFlags |= LEVELNODE_HIDDEN;
        }
      }

      if (fSet) {
        // If it does not exist already....
        if (!IndexExistsInRoofLayer(sGridNo, Enum312.FIRSTPOINTERS11)) {
          pNode = AddRoofToTail(sGridNo, Enum312.FIRSTPOINTERS11);
          pNode.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
        }
      } else {
        RemoveRoof(sGridNo, Enum312.FIRSTPOINTERS11);
      }
    }
  }
}

function PositionSoldierLight(pSoldier: Pointer<SOLDIERTYPE>): void {
  // DO ONLY IF WE'RE AT A GOOD LEVEL
  if (ubAmbientLightLevel < MIN_AMB_LEVEL_FOR_MERC_LIGHTS) {
    return;
  }

  if (!pSoldier.value.bInSector) {
    return;
  }

  if (pSoldier.value.bTeam != gbPlayerNum) {
    return;
  }

  if (pSoldier.value.bLife < OKLIFE) {
    return;
  }

  // if the player DOESNT want the merc to cast light
  if (!gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT]) {
    return;
  }

  if (pSoldier.value.iLight == -1) {
    CreateSoldierLight(pSoldier);
  }

  // if ( pSoldier->ubID == gusSelectedSoldier )
  {
    LightSpritePower(pSoldier.value.iLight, TRUE);
    LightSpriteFake(pSoldier.value.iLight);

    LightSpritePosition(pSoldier.value.iLight, (pSoldier.value.sX / CELL_X_SIZE), (pSoldier.value.sY / CELL_Y_SIZE));
  }
}

function SetCheckSoldierLightFlag(pSoldier: Pointer<SOLDIERTYPE>): void {
  PositionSoldierLight(pSoldier);
  // pSoldier->uiStatusFlags |= SOLDIER_RECHECKLIGHT;
}

function PickPickupAnimation(pSoldier: Pointer<SOLDIERTYPE>, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8): void {
  let bDirection: INT8;
  let pStructure: Pointer<STRUCTURE>;
  let fDoNormalPickup: BOOLEAN = TRUE;

  // OK, Given the gridno, determine if it's the same one or different....
  if (sGridNo != pSoldier.value.sGridNo) {
    // Get direction to face....
    bDirection = GetDirectionFromGridNo(sGridNo, pSoldier);
    pSoldier.value.ubPendingDirection = bDirection;

    // Change to pickup animation
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADJACENT_GET_ITEM, 0, FALSE);

    if (!(pSoldier.value.uiStatusFlags & SOLDIER_PC)) {
      // set "pending action" value for AI so it will wait
      pSoldier.value.bAction = Enum289.AI_ACTION_PENDING_ACTION;
    }
  } else {
    // If in water....
    if (MercInWater(pSoldier)) {
      UnSetUIBusy(pSoldier.value.ubID);
      HandleSoldierPickupItem(pSoldier, iItemIndex, sGridNo, bZLevel);
      SoldierGotoStationaryStance(pSoldier);
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_PC)) {
        // reset action value for AI because we're done!
        ActionDone(pSoldier);
      }
    } else {
      // Don't show animation of getting item, if we are not standing
      switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
        case ANIM_STAND:

          // OK, if we are looking at z-level >0, AND
          // we have a strucxture with items in it
          // look for orientation and use angle accordingly....
          if (bZLevel > 0) {
            //#if 0
            // Get direction to face....
            if ((pStructure = FindStructure(sGridNo, (STRUCTURE_HASITEMONTOP | STRUCTURE_OPENABLE))) != NULL) {
              fDoNormalPickup = FALSE;

              // OK, look at orientation
              switch (pStructure.value.ubWallOrientation) {
                case Enum314.OUTSIDE_TOP_LEFT:
                case Enum314.INSIDE_TOP_LEFT:

                  bDirection = Enum245.NORTH;
                  break;

                case Enum314.OUTSIDE_TOP_RIGHT:
                case Enum314.INSIDE_TOP_RIGHT:

                  bDirection = Enum245.WEST;
                  break;

                default:

                  bDirection = pSoldier.value.bDirection;
                  break;
              }

              // pSoldier->ubPendingDirection = bDirection;
              EVENT_SetSoldierDesiredDirection(pSoldier, bDirection);
              EVENT_SetSoldierDirection(pSoldier, bDirection);

              // Change to pickup animation
              EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADJACENT_GET_ITEM, 0, FALSE);
            }
            //#endif
          }

          if (fDoNormalPickup) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.PICKUP_ITEM, 0, FALSE);
          }

          if (!(pSoldier.value.uiStatusFlags & SOLDIER_PC)) {
            // set "pending action" value for AI so it will wait
            pSoldier.value.bAction = Enum289.AI_ACTION_PENDING_ACTION;
          }
          break;

        case ANIM_CROUCH:
        case ANIM_PRONE:

          UnSetUIBusy(pSoldier.value.ubID);
          HandleSoldierPickupItem(pSoldier, iItemIndex, sGridNo, bZLevel);
          SoldierGotoStationaryStance(pSoldier);
          if (!(pSoldier.value.uiStatusFlags & SOLDIER_PC)) {
            // reset action value for AI because we're done!
            ActionDone(pSoldier);
          }
          break;
      }
    }
  }
}

function PickDropItemAnimation(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Don't show animation of getting item, if we are not standing
  switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
    case ANIM_STAND:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.DROP_ITEM, 0, FALSE);
      break;

    case ANIM_CROUCH:
    case ANIM_PRONE:

      SoldierHandleDropItem(pSoldier);
      SoldierGotoStationaryStance(pSoldier);
      break;
  }
}

function EVENT_SoldierBeginCutFence(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  // Make sure we have a structure here....
  if (IsCuttableWireFenceAtGridNo(sGridNo)) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    // BOOLEAN CutWireFence( INT16 sGridNo )

    // SET TARGET GRIDNO
    pSoldier.value.sTargetGridNo = sGridNo;

    // CHANGE TO ANIMATION
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.CUTTING_FENCE, 0, FALSE);
  }
}

function EVENT_SoldierBeginRepair(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let bRepairItem: INT8;
  let ubID: UINT8;

  // Make sure we have a structure here....
  bRepairItem = IsRepairableStructAtGridNo(sGridNo, addressof(ubID));

  if (bRepairItem) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    // BOOLEAN CutWireFence( INT16 sGridNo )

    // SET TARGET GRIDNO
    // pSoldier->sTargetGridNo = sGridNo;

    // CHANGE TO ANIMATION
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.GOTO_REPAIRMAN, 0, FALSE);
    // SET BUDDY'S ASSIGNMENT TO REPAIR...

    // Are we a SAM site? ( 3 == SAM )
    if (bRepairItem == 3) {
      SetSoldierAssignment(pSoldier, Enum117.REPAIR, TRUE, FALSE, -1);
    } else if (bRepairItem == 2) // ( 2 == VEHICLE )
    {
      SetSoldierAssignment(pSoldier, Enum117.REPAIR, FALSE, FALSE, ubID);
    }
  }
}

function EVENT_SoldierBeginRefuel(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let bRefuelItem: INT8;
  let ubID: UINT8;

  // Make sure we have a structure here....
  bRefuelItem = IsRefuelableStructAtGridNo(sGridNo, addressof(ubID));

  if (bRefuelItem) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    // BOOLEAN CutWireFence( INT16 sGridNo )

    // SET TARGET GRIDNO
    // pSoldier->sTargetGridNo = sGridNo;

    // CHANGE TO ANIMATION
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.REFUEL_VEHICLE, 0, FALSE);
    // SET BUDDY'S ASSIGNMENT TO REPAIR...
  }
}

function EVENT_SoldierBeginTakeBlood(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let pCorpse: Pointer<ROTTING_CORPSE>;

  // See if these is a corpse here....
  pCorpse = GetCorpseAtGridNo(sGridNo, pSoldier.value.bLevel);

  if (pCorpse != NULL) {
    pSoldier.value.uiPendingActionData4 = pCorpse.value.iID;

    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    EVENT_InitNewSoldierAnim(pSoldier, Enum193.TAKE_BLOOD_FROM_CORPSE, 0, FALSE);
  } else {
    // Say NOTHING quote...
    DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_NOTHING);
  }
}

function EVENT_SoldierBeginAttachCan(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8): void {
  let pStructure: Pointer<STRUCTURE>;
  let pDoorStatus: Pointer<DOOR_STATUS>;

  // OK, find door, attach to door, do animation...., remove item....

  // First make sure we still have item in hand....
  if (pSoldier.value.inv[Enum261.HANDPOS].usItem != Enum225.STRING_TIED_TO_TIN_CAN) {
    return;
  }

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure == NULL) {
    return;
  }

  // Modify door status to make sure one is created for this door
  // Use the current door state for this
  if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
    ModifyDoorStatus(sGridNo, FALSE, FALSE);
  } else {
    ModifyDoorStatus(sGridNo, TRUE, TRUE);
  }

  // Now get door status...
  pDoorStatus = GetDoorStatus(sGridNo);
  if (pDoorStatus == NULL) {
    // SOmething wrong here...
    return;
  }

  // OK set flag!
  pDoorStatus.value.ubFlags |= DOOR_HAS_TIN_CAN;

  // Do animation
  EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  EVENT_SetSoldierDirection(pSoldier, ubDirection);

  EVENT_InitNewSoldierAnim(pSoldier, Enum193.ATTACH_CAN_TO_STRING, 0, FALSE);

  // Remove item...
  DeleteObj(addressof(pSoldier.value.inv[Enum261.HANDPOS]));
  fInterfacePanelDirty = DIRTYLEVEL2;
}

function EVENT_SoldierBeginReloadRobot(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8, ubMercSlot: UINT8): void {
  let ubPerson: UINT8;

  // Make sure we have a robot here....
  ubPerson = WhoIsThere2(sGridNo, pSoldier.value.bLevel);

  if (ubPerson != NOBODY && MercPtrs[ubPerson].value.uiStatusFlags & SOLDIER_ROBOT) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    // CHANGE TO ANIMATION
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.RELOAD_ROBOT, 0, FALSE);
  }
}

function ResetSoldierChangeStatTimer(pSoldier: Pointer<SOLDIERTYPE>): void {
  pSoldier.value.uiChangeLevelTime = 0;
  pSoldier.value.uiChangeHealthTime = 0;
  pSoldier.value.uiChangeStrengthTime = 0;
  pSoldier.value.uiChangeDexterityTime = 0;
  pSoldier.value.uiChangeAgilityTime = 0;
  pSoldier.value.uiChangeWisdomTime = 0;
  pSoldier.value.uiChangeLeadershipTime = 0;
  pSoldier.value.uiChangeMarksmanshipTime = 0;
  pSoldier.value.uiChangeExplosivesTime = 0;
  pSoldier.value.uiChangeMedicalTime = 0;
  pSoldier.value.uiChangeMechanicalTime = 0;

  return;
}

function ChangeToFlybackAnimation(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8): void {
  let usNewGridNo: UINT16;

  // Get dest gridno, convert to center coords
  usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(gOppositeDirection[bDirection]));
  usNewGridNo = NewGridNo(usNewGridNo, DirectionInc(gOppositeDirection[bDirection]));

  // Remove any previous actions
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

  // Set path....
  pSoldier.value.usPathDataSize = 0;
  pSoldier.value.usPathIndex = 0;
  pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = gOppositeDirection[pSoldier.value.bDirection];
  pSoldier.value.usPathDataSize++;
  pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = gOppositeDirection[pSoldier.value.bDirection];
  pSoldier.value.usPathDataSize++;
  pSoldier.value.sFinalDestination = usNewGridNo;
  EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], FALSE, Enum193.FLYBACK_HIT);

  // Get a new direction based on direction
  EVENT_InitNewSoldierAnim(pSoldier, Enum193.FLYBACK_HIT, 0, FALSE);
}

function ChangeToFallbackAnimation(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8): void {
  let usNewGridNo: UINT16;

  // Get dest gridno, convert to center coords
  usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(gOppositeDirection[bDirection]));
  // usNewGridNo = NewGridNo( (UINT16)usNewGridNo, (UINT16)(-1 * DirectionInc( bDirection ) ) );

  // Remove any previous actions
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

  // Set path....
  pSoldier.value.usPathDataSize = 0;
  pSoldier.value.usPathIndex = 0;
  pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = gOppositeDirection[pSoldier.value.bDirection];
  pSoldier.value.usPathDataSize++;
  pSoldier.value.sFinalDestination = usNewGridNo;
  EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], FALSE, Enum193.FALLBACK_HIT_STAND);

  // Get a new direction based on direction
  EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLBACK_HIT_STAND, 0, FALSE);
}

function SetSoldierCowerState(pSoldier: Pointer<SOLDIERTYPE>, fOn: BOOLEAN): void {
  // Robot's don't cower!
  if (pSoldier.value.ubBodyType == Enum194.ROBOTNOWEAPON) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("ERROR: Robot was told to cower!"));
    return;
  }

  // OK< set flag and do anim...
  if (fOn) {
    if (!(pSoldier.value.uiStatusFlags & SOLDIER_COWERING)) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.START_COWER, 0, FALSE);

      pSoldier.value.uiStatusFlags |= SOLDIER_COWERING;

      pSoldier.value.ubDesiredHeight = ANIM_CROUCH;
    }
  } else {
    if ((pSoldier.value.uiStatusFlags & SOLDIER_COWERING)) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_COWER, 0, FALSE);

      pSoldier.value.uiStatusFlags &= (~SOLDIER_COWERING);

      pSoldier.value.ubDesiredHeight = ANIM_STAND;
    }
  }
}

function MercStealFromMerc(pSoldier: Pointer<SOLDIERTYPE>, pTarget: Pointer<SOLDIERTYPE>): void {
  let sActionGridNo: INT16;
  let sGridNo: INT16;
  let sAdjustedGridNo: INT16;
  let ubDirection: UINT8;

  // OK, find an adjacent gridno....
  sGridNo = pTarget.value.sGridNo;

  // See if we can get there to punch
  sActionGridNo = FindAdjacentGridEx(pSoldier, sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
  if (sActionGridNo != -1) {
    // SEND PENDING ACTION
    pSoldier.value.ubPendingAction = Enum257.MERC_STEAL;
    pSoldier.value.sPendingActionData2 = pTarget.value.sGridNo;
    pSoldier.value.bPendingActionData3 = ubDirection;
    pSoldier.value.ubPendingActionAnimCount = 0;

    // CHECK IF WE ARE AT THIS GRIDNO NOW
    if (pSoldier.value.sGridNo != sActionGridNo) {
      // WALK UP TO DEST FIRST
      SendGetNewSoldierPathEvent(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode);
    } else {
      EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.STEAL_ITEM, 0, FALSE);
    }

    // OK, set UI
    gTacticalStatus.ubAttackBusyCount++;
    // reset attacking item (hand)
    pSoldier.value.usAttackingWeapon = 0;
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting STEAL attack, attack count now %d", gTacticalStatus.ubAttackBusyCount));

    SetUIBusy(pSoldier.value.ubID);
  }
}

function PlayerSoldierStartTalking(pSoldier: Pointer<SOLDIERTYPE>, ubTargetID: UINT8, fValidate: BOOLEAN): BOOLEAN {
  let sFacingDir: INT16;
  let sXPos: INT16;
  let sYPos: INT16;
  let sAPCost: INT16;
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let uiRange: UINT32;

  if (ubTargetID == NOBODY) {
    return FALSE;
  }

  pTSoldier = MercPtrs[ubTargetID];

  // Check distance again, to be sure
  if (fValidate) {
    // OK, since we locked this guy from moving
    // we should be close enough, so talk ( unless he is now dead )
    if (!IsValidTalkableNPC(ubTargetID, FALSE, FALSE, FALSE)) {
      return FALSE;
    }

    uiRange = GetRangeFromGridNoDiff(pSoldier.value.sGridNo, pTSoldier.value.sGridNo);

    if (uiRange > (NPC_TALK_RADIUS * 2)) {
      // Todo here - should we follow dude?
      return FALSE;
    }
  }

  // Get APs...
  sAPCost = AP_TALK;

  // Deduct points from our guy....
  DeductPoints(pSoldier, sAPCost, 0);

  ConvertGridNoToXY(pTSoldier.value.sGridNo, addressof(sXPos), addressof(sYPos));

  // Get direction from mouse pos
  sFacingDir = GetDirectionFromXY(sXPos, sYPos, pSoldier);

  // Set our guy facing
  SendSoldierSetDesiredDirectionEvent(pSoldier, sFacingDir);

  // Set NPC facing
  SendSoldierSetDesiredDirectionEvent(pTSoldier, gOppositeDirection[sFacingDir]);

  // Stop our guys...
  EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);

  // ATE; Check for normal civs...
  if (GetCivType(pTSoldier) != CIV_TYPE_NA) {
    StartCivQuote(pTSoldier);
    return FALSE;
  }

  // Are we an EPC that is being escorted?
  if (pTSoldier.value.ubProfile != NO_PROFILE && pTSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    return InitiateConversation(pTSoldier, pSoldier, Enum296.APPROACH_EPC_WHO_IS_RECRUITED, 0);
    // Converse( pTSoldier->ubProfile, pSoldier->ubProfile, APPROACH_EPC_WHO_IS_RECRUITED, 0 );
  } else if (pTSoldier.value.bNeutral) {
    switch (pTSoldier.value.ubProfile) {
      case Enum268.JIM:
      case Enum268.JACK:
      case Enum268.OLAF:
      case Enum268.RAY:
      case Enum268.OLGA:
      case Enum268.TYRONE:
        // Start combat etc
        DeleteTalkingMenu();
        CancelAIAction(pTSoldier, TRUE);
        AddToShouldBecomeHostileOrSayQuoteList(pTSoldier.value.ubID);
        break;
      default:
        // Start talking!
        return InitiateConversation(pTSoldier, pSoldier, Enum296.NPC_INITIAL_QUOTE, 0);
        break;
    }
  } else {
    // Start talking with hostile NPC
    return InitiateConversation(pTSoldier, pSoldier, Enum296.APPROACH_ENEMY_NPC_QUOTE, 0);
  }

  return TRUE;
}

function IsValidSecondHandShot(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (Item[pSoldier.value.inv[Enum261.SECONDHANDPOS].usItem].usItemClass == IC_GUN && !(Item[pSoldier.value.inv[Enum261.SECONDHANDPOS].usItem].fFlags & ITEM_TWO_HANDED) && !pSoldier.value.bDoBurst && pSoldier.value.inv[Enum261.HANDPOS].usItem != Enum225.GLAUNCHER && Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN && pSoldier.value.inv[Enum261.SECONDHANDPOS].bGunStatus >= USABLE && pSoldier.value.inv[Enum261.SECONDHANDPOS].ubGunShotsLeft > 0) {
    return TRUE;
  }

  return FALSE;
}

function IsValidSecondHandShotForReloadingPurposes(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // should be maintained as same as function above with line
  // about ammo taken out!
  if (Item[pSoldier.value.inv[Enum261.SECONDHANDPOS].usItem].usItemClass == IC_GUN && !pSoldier.value.bDoBurst && pSoldier.value.inv[Enum261.HANDPOS].usItem != Enum225.GLAUNCHER && Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN && pSoldier.value.inv[Enum261.SECONDHANDPOS].bGunStatus >= USABLE //&&
      //			 pSoldier->inv[SECONDHANDPOS].ubGunShotsLeft > 0 &&
      //			 gAnimControl[ pSoldier->usAnimState ].ubEndHeight != ANIM_PRONE )
  ) {
    return TRUE;
  }

  return FALSE;
}

function CanRobotBeControlled(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let pController: Pointer<SOLDIERTYPE>;

  if (!(pSoldier.value.uiStatusFlags & SOLDIER_ROBOT)) {
    return FALSE;
  }

  if (pSoldier.value.ubRobotRemoteHolderID == NOBODY) {
    return FALSE;
  }

  pController = MercPtrs[pSoldier.value.ubRobotRemoteHolderID];

  if (pController.value.bActive) {
    if (ControllingRobot(pController)) {
      // ALL'S OK!
      return TRUE;
    }
  }

  return FALSE;
}

function ControllingRobot(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let pRobot: Pointer<SOLDIERTYPE>;
  let bPos: INT8;

  if (!pSoldier.value.bActive) {
    return FALSE;
  }

  // EPCs can't control the robot (no inventory to hold remote, for one)
  if (AM_AN_EPC(pSoldier)) {
    return FALSE;
  }

  // Don't require pSoldier->bInSector here, it must work from mapscreen!

  // are we in ok shape?
  if (pSoldier.value.bLife < OKLIFE || (pSoldier.value.bTeam != gbPlayerNum)) {
    return FALSE;
  }

  // allow control from within vehicles - allows strategic travel in a vehicle with robot!
  if ((pSoldier.value.bAssignment >= Enum117.ON_DUTY) && (pSoldier.value.bAssignment != Enum117.VEHICLE)) {
    return FALSE;
  }

  // is the soldier wearing a robot remote control?
  bPos = FindObj(pSoldier, Enum225.ROBOT_REMOTE_CONTROL);
  if (bPos != Enum261.HEAD1POS && bPos != Enum261.HEAD2POS) {
    return FALSE;
  }

  // Find the robot
  pRobot = FindSoldierByProfileID(Enum268.ROBOT, TRUE);
  if (!pRobot) {
    return FALSE;
  }

  if (pRobot.value.bActive) {
    // Are we in the same sector....?
    // ARM: CHANGED TO WORK IN MAPSCREEN, DON'T USE WorldSector HERE
    if (pRobot.value.sSectorX == pSoldier.value.sSectorX && pRobot.value.sSectorY == pSoldier.value.sSectorY && pRobot.value.bSectorZ == pSoldier.value.bSectorZ) {
      // they have to be either both in sector, or both on the road
      if (pRobot.value.fBetweenSectors == pSoldier.value.fBetweenSectors) {
        // if they're on the road...
        if (pRobot.value.fBetweenSectors) {
          // they have to be in the same squad or vehicle
          if (pRobot.value.bAssignment != pSoldier.value.bAssignment) {
            return FALSE;
          }

          // if in a vehicle, must be the same vehicle
          if (pRobot.value.bAssignment == Enum117.VEHICLE && (pRobot.value.iVehicleId != pSoldier.value.iVehicleId)) {
            return FALSE;
          }
        }

        // all OK!
        return TRUE;
      }
    }
  }

  return FALSE;
}

function GetRobotController(pSoldier: Pointer<SOLDIERTYPE>): Pointer<SOLDIERTYPE> {
  if (pSoldier.value.ubRobotRemoteHolderID == NOBODY) {
    return NULL;
  } else {
    return MercPtrs[pSoldier.value.ubRobotRemoteHolderID];
  }
}

function UpdateRobotControllerGivenRobot(pRobot: Pointer<SOLDIERTYPE>): void {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;

  // Loop through guys and look for a controller!

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bActive) {
      if (ControllingRobot(pTeamSoldier)) {
        pRobot.value.ubRobotRemoteHolderID = pTeamSoldier.value.ubID;
        return;
      }
    }
  }

  pRobot.value.ubRobotRemoteHolderID = NOBODY;
}

function UpdateRobotControllerGivenController(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;

  // First see if are still controlling the robot
  if (!ControllingRobot(pSoldier)) {
    return;
  }

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // Loop through guys to find the robot....
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bActive && (pTeamSoldier.value.uiStatusFlags & SOLDIER_ROBOT)) {
      pTeamSoldier.value.ubRobotRemoteHolderID = pSoldier.value.ubID;
    }
  }
}

function HandleSoldierTakeDamageFeedback(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Do sound.....
  // if ( pSoldier->bLife >= CONSCIOUSNESS )
  {
    // ATE: Limit how often we grunt...
    if ((GetJA2Clock() - pSoldier.value.uiTimeSinceLastBleedGrunt) > 1000) {
      pSoldier.value.uiTimeSinceLastBleedGrunt = GetJA2Clock();

      DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));
    }
  }

  // Flash portrait....
  pSoldier.value.fFlashPortrait = TRUE;
  pSoldier.value.bFlashPortraitFrame = FLASH_PORTRAIT_STARTSHADE;
  RESETTIMECOUNTER(pSoldier.value.PortraitFlashCounter, FLASH_PORTRAIT_DELAY);
}

function HandleSystemNewAISituation(pSoldier: Pointer<SOLDIERTYPE>, fResetABC: BOOLEAN): void {
  // Are we an AI guy?
  if (gTacticalStatus.ubCurrentTeam != gbPlayerNum && pSoldier.value.bTeam != gbPlayerNum) {
    if (pSoldier.value.bNewSituation == IS_NEW_SITUATION) {
      // Cancel what they were doing....
      pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
      pSoldier.value.usPendingAnimation2 = NO_PENDING_ANIMATION;
      pSoldier.value.fTurningFromPronePosition = FALSE;
      pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
      pSoldier.value.bEndDoorOpenCode = 0;

      // if this guy isn't under direct AI control, WHO GIVES A FLYING FLICK?
      if (pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL) {
        if (pSoldier.value.fTurningToShoot) {
          pSoldier.value.fTurningToShoot = FALSE;
          // Release attacker
          // OK - this is hightly annoying , but due to the huge combinations of
          // things that can happen - 1 of them is that sLastTarget will get unset
          // after turn is done - so set flag here to tell it not to...
          pSoldier.value.fDontUnsetLastTargetFromTurn = TRUE;
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Reducing attacker busy count..., ending fire because saw something: DONE IN SYSTEM NEW SITUATION"));
          ReduceAttackBusyCount(pSoldier.value.ubID, FALSE);
        }

        if (pSoldier.value.pTempObject != NULL) {
          // Place it back into inv....
          AutoPlaceObject(pSoldier, pSoldier.value.pTempObject, FALSE);
          MemFree(pSoldier.value.pTempObject);
          pSoldier.value.pTempObject = NULL;
          pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
          pSoldier.value.usPendingAnimation2 = NO_PENDING_ANIMATION;

          // Decrement attack counter...
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Reducing attacker busy count..., ending throw because saw something: DONE IN SYSTEM NEW SITUATION"));
          ReduceAttackBusyCount(pSoldier.value.ubID, FALSE);
        }
      }
    }
  }
}

function InternalPlaySoldierFootstepSound(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubRandomSnd: UINT8;
  let bVolume: INT8 = MIDVOLUME;
  // Assume outside
  let ubSoundBase: UINT32 = Enum330.WALK_LEFT_OUT;
  let ubRandomMax: UINT8 = 4;

  // Determine if we are on the floor
  if (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
    if (pSoldier.value.usAnimState == Enum193.HOPFENCE) {
      bVolume = HIGHVOLUME;
    }

    if (pSoldier.value.uiStatusFlags & SOLDIER_ROBOT) {
      PlaySoldierJA2Sample(pSoldier.value.ubID, Enum330.ROBOT_BEEP, RATE_11025, SoundVolume(bVolume, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo), TRUE);
      return;
    }

    // if ( SoldierOnScreen( pSoldier->ubID ) )
    {
      if (pSoldier.value.usAnimState == Enum193.CRAWLING) {
        ubSoundBase = Enum330.CRAWL_1;
      } else {
        // Pick base based on terrain over....
        if (pSoldier.value.bOverTerrainType == Enum315.FLAT_FLOOR) {
          ubSoundBase = Enum330.WALK_LEFT_IN;
        } else if (pSoldier.value.bOverTerrainType == Enum315.DIRT_ROAD || pSoldier.value.bOverTerrainType == Enum315.PAVED_ROAD) {
          ubSoundBase = Enum330.WALK_LEFT_ROAD;
        } else if (pSoldier.value.bOverTerrainType == Enum315.LOW_WATER || pSoldier.value.bOverTerrainType == Enum315.MED_WATER) {
          ubSoundBase = Enum330.WATER_WALK1_IN;
          ubRandomMax = 2;
        } else if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
          ubSoundBase = Enum330.SWIM_1;
          ubRandomMax = 2;
        }
      }

      // Pick a random sound...
      do {
        ubRandomSnd = Random(ubRandomMax);
      } while (ubRandomSnd == pSoldier.value.ubLastFootPrintSound);

      pSoldier.value.ubLastFootPrintSound = ubRandomSnd;

      // OK, if in realtime, don't play at full volume, because too many people walking around
      // sounds don't sound good - ( unless we are the selected guy, then always play at reg volume )
      if (!(gTacticalStatus.uiFlags & INCOMBAT) && (pSoldier.value.ubID != gusSelectedSoldier)) {
        bVolume = LOWVOLUME;
      }

      PlaySoldierJA2Sample(pSoldier.value.ubID, ubSoundBase + pSoldier.value.ubLastFootPrintSound, RATE_11025, SoundVolume(bVolume, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo), TRUE);
    }
  }
}

function PlaySoldierFootstepSound(pSoldier: Pointer<SOLDIERTYPE>): void {
  // normally, not in stealth mode
  if (!pSoldier.value.bStealthMode) {
    InternalPlaySoldierFootstepSound(pSoldier);
  }
}

function PlayStealthySoldierFootstepSound(pSoldier: Pointer<SOLDIERTYPE>): void {
  // even if in stealth mode
  InternalPlaySoldierFootstepSound(pSoldier);
}

function CrowsFlyAway(ubTeam: UINT8): void {
  let cnt: UINT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  for (cnt = gTacticalStatus.Team[ubTeam].bFirstID, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[ubTeam].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
      if (pTeamSoldier.value.ubBodyType == Enum194.CROW && pTeamSoldier.value.usAnimState != Enum193.CROW_FLY) {
        // fly away even if not seen!
        HandleCrowFlyAway(pTeamSoldier);
      }
    }
  }
}

function BeginTyingToFall(pSoldier: Pointer<SOLDIERTYPE>): void {
  pSoldier.value.bStartFallDir = pSoldier.value.bDirection;
  pSoldier.value.fTryingToFall = TRUE;

  // Randomize direction
  if (Random(50) < 25) {
    pSoldier.value.fFallClockwise = TRUE;
  } else {
    pSoldier.value.fFallClockwise = FALSE;
  }
}

function SetSoldierAsUnderAiControl(pSoldierToSet: Pointer<SOLDIERTYPE>): void {
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let cnt: INT32;

  if (pSoldierToSet == NULL) {
    return;
  }

  // Loop through ALL teams...
  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[LAST_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive) {
      pSoldier.value.uiStatusFlags &= ~SOLDIER_UNDERAICONTROL;
    }
  }

  pSoldierToSet.value.uiStatusFlags |= SOLDIER_UNDERAICONTROL;
}

function HandlePlayerTogglingLightEffects(fToggleValue: BOOLEAN): void {
  if (fToggleValue) {
    // Toggle light status
    gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT] ^= TRUE;
  }

  // Update all the mercs in the sector
  EnableDisableSoldierLightEffects(gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT]);

  SetRenderFlags(RENDER_FLAG_FULL);
}

function EnableDisableSoldierLightEffects(fEnableLights: BOOLEAN): void {
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let cnt: INT32;

  // Loop through player teams...
  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pSoldier++) {
    // if the soldier is in the sector
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE) {
      // if we are to enable the lights
      if (fEnableLights) {
        // Add the light around the merc
        PositionSoldierLight(pSoldier);
      } else {
        // Delete the fake light the merc casts
        DeleteSoldierLight(pSoldier);

        // Light up the merc though
        SetSoldierPersonalLightLevel(pSoldier);
      }
    }
  }
}

function SetSoldierPersonalLightLevel(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier == NULL) {
    return;
  }

  if (pSoldier.value.sGridNo == NOWHERE) {
    return;
  }

  // THe light level for the soldier
  gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubShadeLevel = 3;
  gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubSumLights = 5;
  gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubMaxLights = 5;
  gpWorldLevelData[pSoldier.value.sGridNo].pMercHead.value.ubNaturalShadeLevel = 5;
}
