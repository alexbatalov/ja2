namespace ja2 {

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
  zName: string /* CHAR8[20] */;
  ubRandomVal: UINT8;
  fPreload: boolean;
  fBadGuy: boolean;
  fDontAllowTwoInRow: boolean;
  fStopDialogue: UINT8 /* boolean */;
}

function createBattleSoundStructFrom(zName: string, ubRandomVal: UINT8, fPreload: boolean, fBadGuy: boolean, fDontAllowTwoInRow: boolean, fStopDialogue: UINT8 /* boolean */): BATTLESNDS_STRUCT {
  return {
    zName,
    ubRandomVal,
    fPreload,
    fBadGuy,
    fDontAllowTwoInRow,
    fStopDialogue,
  };
}

let gBattleSndsData: BATTLESNDS_STRUCT[] /* [] */ = [
  createBattleSoundStructFrom("ok1", 2, true, true, true, 2),
  createBattleSoundStructFrom("ok2", 0, true, true, true, 2),
  createBattleSoundStructFrom("cool", 0, true, false, true, 0),
  createBattleSoundStructFrom("curse", 0, true, true, true, 0),
  createBattleSoundStructFrom("hit1", 2, true, true, true, 1),
  createBattleSoundStructFrom("hit2", 0, true, true, true, 1),
  createBattleSoundStructFrom("laugh", 0, true, true, true, 0),
  createBattleSoundStructFrom("attn", 0, true, false, true, 0),
  createBattleSoundStructFrom("dying", 0, true, true, true, 1),
  createBattleSoundStructFrom("humm", 0, false, false, true, 1),
  createBattleSoundStructFrom("noth", 0, false, false, true, 1),
  createBattleSoundStructFrom("gotit", 0, false, false, true, 1),
  createBattleSoundStructFrom("lmok1", 2, true, false, true, 2),
  createBattleSoundStructFrom("lmok2", 0, true, false, true, 2),
  createBattleSoundStructFrom("lmattn", 0, true, false, true, 0),
  createBattleSoundStructFrom("locked", 0, false, false, true, 0),
  createBattleSoundStructFrom("enem", 0, true, true, true, 0),
];

export let bHealthStrRanges: UINT8[] /* [] */ = [
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
let gfCalcTranslucency: boolean = false;

let gsFullTileDirections: INT16[] /* [MAX_FULLTILE_DIRECTIONS] */ = [
  -1,
  -WORLD_COLS - 1,
  -WORLD_COLS,
];

// Palette ranges
let guiNumPaletteSubRanges: UINT32;
let guipPaletteSubRanges: Pointer<PaletteSubRangeType> = null;
// Palette replacements
let guiNumReplacements: UINT32;
let guipPaletteReplacements: Pointer<PaletteReplacementType> = null;

export let gfGetNewPathThroughPeople: boolean = false;

let gpPaletteSubRanges: Pointer<PaletteSubRangeType>;

function HandleVehicleMovementSound(pSoldier: SOLDIERTYPE, fOn: boolean): void {
  let pVehicle: VEHICLETYPE = pVehicleList[pSoldier.bVehicleID];

  if (fOn) {
    if (pVehicle.iMovementSoundID == NO_SAMPLE) {
      pVehicle.iMovementSoundID = PlayJA2Sample(pVehicle.iMoveSound, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
    }
  } else {
    if (pVehicle.iMovementSoundID != NO_SAMPLE) {
      SoundStop(pVehicle.iMovementSoundID);
      pVehicle.iMovementSoundID = NO_SAMPLE;
    }
  }
}

export function AdjustNoAPToFinishMove(pSoldier: SOLDIERTYPE, fSet: boolean): void {
  if (pSoldier.ubBodyType == Enum194.CROW) {
    return;
  }

  // Check if we are a vehicle first....
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    // Turn off sound effects....
    if (fSet) {
      HandleVehicleMovementSound(pSoldier, false);
    }
  }

  // Turn off sound effects....
  if (fSet) {
    // Position light....
    // SetCheckSoldierLightFlag( pSoldier );
  } else {
    // DeleteSoldierLight( pSoldier );
  }

  pSoldier.fNoAPToFinishMove = fSet;

  if (!fSet) {
    // return reason to default value
    pSoldier.ubReasonCantFinishMove = Enum263.REASON_STOPPED_NO_APS;
  }
}

export function HandleCrowShadowVisibility(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.ubBodyType == Enum194.CROW) {
    if (pSoldier.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.pAniTile != null) {
        if (pSoldier.bLastRenderVisibleValue != -1) {
          HideAniTile(pSoldier.pAniTile, false);
        } else {
          HideAniTile(pSoldier.pAniTile, true);
        }
      }
    }
  }
}

function HandleCrowShadowNewGridNo(pSoldier: SOLDIERTYPE): void {
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();

  if (pSoldier.ubBodyType == Enum194.CROW) {
    if (pSoldier.pAniTile != null) {
      DeleteAniTile(pSoldier.pAniTile);
      pSoldier.pAniTile = null;
    }

    if (pSoldier.sGridNo != NOWHERE) {
      if (pSoldier.usAnimState == Enum193.CROW_FLY) {
        AniParams.sGridNo = pSoldier.sGridNo;
        AniParams.ubLevelID = ANI_SHADOW_LEVEL;
        AniParams.sDelay = pSoldier.sAniDelay;
        AniParams.sStartFrame = 0;
        AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_LOOPING | ANITILE_USE_DIRECTION_FOR_START_FRAME;
        AniParams.sX = pSoldier.sX;
        AniParams.sY = pSoldier.sY;
        AniParams.sZ = 0;
        AniParams.zCachedFile = "TILECACHE\\FLY_SHDW.STI";

        AniParams.uiUserData3 = pSoldier.bDirection;

        pSoldier.pAniTile = CreateAnimationTile(AniParams);

        HandleCrowShadowVisibility(pSoldier);
      }
    }
  }
}

function HandleCrowShadowRemoveGridNo(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.ubBodyType == Enum194.CROW) {
    if (pSoldier.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.pAniTile != null) {
        DeleteAniTile(pSoldier.pAniTile);
        pSoldier.pAniTile = null;
      }
    }
  }
}

function HandleCrowShadowNewDirection(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.ubBodyType == Enum194.CROW) {
    if (pSoldier.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.pAniTile != null) {
        pSoldier.pAniTile.value.uiUserData3 = pSoldier.bDirection;
      }
    }
  }
}

function HandleCrowShadowNewPosition(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.ubBodyType == Enum194.CROW) {
    if (pSoldier.usAnimState == Enum193.CROW_FLY) {
      if (pSoldier.pAniTile != null) {
        pSoldier.pAniTile.value.sRelativeX = pSoldier.sX;
        pSoldier.pAniTile.value.sRelativeY = pSoldier.sY;
      }
    }
  }
}

export function CalcActionPoints(pSold: SOLDIERTYPE): INT8 {
  let ubPoints: UINT8;
  let ubMaxAPs: UINT8;
  let bBandage: INT8;

  // dead guys don't get any APs (they shouldn't be here asking for them!)
  if (!pSold.bLife)
    return 0;

  // people with sleep dart drug who have collapsed get no APs
  if ((pSold.bSleepDrugCounter > 0) && pSold.bCollapsed)
    return 0;

  // Calculate merc's action points at 100% capability (range is 10 - 25)
  // round fractions of .5 up (that's why the +20 before the division!
  ubPoints = 5 + (((10 * EffectiveExpLevel(pSold) + 3 * EffectiveAgility(pSold) + 2 * pSold.bLifeMax + 2 * EffectiveDexterity(pSold)) + 20) / 40);

  // if (GameOption[INCREASEDAP] % 2 == 1)
  // points += AP_INCREASE;

  // Calculate bandage
  bBandage = pSold.bLifeMax - pSold.bLife - pSold.bBleeding;

  // If injured, reduce action points accordingly (by up to 2/3rds)
  if (pSold.bLife < pSold.bLifeMax) {
    ubPoints -= (2 * ubPoints * (pSold.bLifeMax - pSold.bLife + (bBandage / 2))) / (3 * pSold.bLifeMax);
  }

  // If tired, reduce action points accordingly (by up to 1/2)
  if (pSold.bBreath < 100)
    ubPoints -= (ubPoints * (100 - pSold.bBreath)) / 200;

  if (pSold.sWeightCarriedAtTurnStart > 100) {
    ubPoints = ((ubPoints) * 100 / pSold.sWeightCarriedAtTurnStart);
  }

  // If resulting APs are below our permitted minimum, raise them to it!
  if (ubPoints < AP_MINIMUM)
    ubPoints = AP_MINIMUM;

  // make sure action points doesn't exceed the permitted maximum
  ubMaxAPs = gubMaxActionPoints[pSold.ubBodyType];

  // if (GameOption[INCREASEDAP] % 2 == 1)
  // maxAPs += AP_INCREASE;

  // If resulting APs are below our permitted minimum, raise them to it!
  if (ubPoints > ubMaxAPs)
    ubPoints = ubMaxAPs;

  if (pSold.ubBodyType == Enum194.BLOODCAT) {
    // use same as young monsters
    ubPoints = (ubPoints * AP_YOUNG_MONST_FACTOR) / 10;
  } else if (pSold.uiStatusFlags & SOLDIER_MONSTER) {
    // young monsters get extra APs
    if (pSold.ubBodyType == Enum194.YAF_MONSTER || pSold.ubBodyType == Enum194.YAM_MONSTER || pSold.ubBodyType == Enum194.INFANT_MONSTER) {
      ubPoints = (ubPoints * AP_YOUNG_MONST_FACTOR) / 10;
    }

    // if frenzied, female monsters get more APs! (for young females, cumulative!)
    if (pSold.bFrenzied) {
      ubPoints = (ubPoints * AP_MONST_FRENZY_FACTOR) / 10;
    }
  }

  // adjust APs for phobia situations
  if (pSold.ubProfile != NO_PROFILE) {
    if ((gMercProfiles[pSold.ubProfile].bPersonalityTrait == Enum270.CLAUSTROPHOBIC) && (gbWorldSectorZ > 0)) {
      ubPoints = (ubPoints * AP_CLAUSTROPHOBE) / 10;
    } else if ((gMercProfiles[pSold.ubProfile].bPersonalityTrait == Enum270.FEAR_OF_INSECTS) && (MercSeesCreature(pSold))) {
      ubPoints = (ubPoints * AP_AFRAID_OF_INSECTS) / 10;
    }
  }

  // Adjusat APs due to drugs...
  ubPoints = HandleAPEffectDueToDrugs(pSold, ubPoints);

  // If we are a vehicle, adjust APS...
  if (pSold.uiStatusFlags & SOLDIER_VEHICLE) {
    ubPoints = AdjustVehicleAPs(pSold, ubPoints);
  }

  // if we are in boxing mode, adjust APs... THIS MUST BE LAST!
  if (gTacticalStatus.bBoxingState == Enum247.BOXING || gTacticalStatus.bBoxingState == Enum247.PRE_BOXING) {
    ubPoints /= 2;
  }

  return ubPoints;
}

export function CalcNewActionPoints(pSoldier: SOLDIERTYPE): void {
  if (gTacticalStatus.bBoxingState == Enum247.BOXING || gTacticalStatus.bBoxingState == Enum247.PRE_BOXING) {
    // if we are in boxing mode, carry 1/2 as many points
    if (pSoldier.bActionPoints > MAX_AP_CARRIED / 2) {
      pSoldier.bActionPoints = MAX_AP_CARRIED / 2;
    }
  } else {
    if (pSoldier.bActionPoints > MAX_AP_CARRIED) {
      pSoldier.bActionPoints = MAX_AP_CARRIED;
    }
  }

  pSoldier.bActionPoints += CalcActionPoints(pSoldier);

  // Don't max out if we are drugged....
  if (!GetDrugEffect(pSoldier, DRUG_TYPE_ADRENALINE)) {
    pSoldier.bActionPoints = Math.min(pSoldier.bActionPoints, gubMaxActionPoints[pSoldier.ubBodyType]);
  }

  pSoldier.bInitialActionPoints = pSoldier.bActionPoints;
}

export function DoNinjaAttack(pSoldier: SOLDIERTYPE): void {
  // UINT32						uiMercFlags;
  let usSoldierIndex: UINT16;
  let pTSoldier: SOLDIERTYPE;
  let ubTDirection: UINT8;
  let ubTargetStance: UINT8;

  usSoldierIndex = WhoIsThere2(pSoldier.sTargetGridNo, pSoldier.bLevel);
  if (usSoldierIndex != NOBODY) {
    pTSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

    // Look at stance of target
    ubTargetStance = gAnimControl[pTSoldier.usAnimState].ubEndHeight;

    // Get his life...if < certain value, do finish!
    if ((pTSoldier.bLife <= 30 || pTSoldier.bBreath <= 30) && ubTargetStance != ANIM_PRONE) {
      // Do finish!
      ChangeSoldierState(pSoldier, Enum193.NINJA_SPINKICK, 0, false);
    } else {
      if (ubTargetStance != ANIM_PRONE) {
        if (Random(2) == 0) {
          ChangeSoldierState(pSoldier, Enum193.NINJA_LOWKICK, 0, false);
        } else {
          ChangeSoldierState(pSoldier, Enum193.NINJA_PUNCH, 0, false);
        }

        // CHECK IF HE CAN SEE US, IF SO CHANGE DIRECTION
        if (pTSoldier.bOppList[pSoldier.ubID] == 0 && pTSoldier.bTeam != pSoldier.bTeam) {
          if (!(pTSoldier.uiStatusFlags & (SOLDIER_MONSTER | SOLDIER_ANIMAL | SOLDIER_VEHICLE))) {
            ubTDirection = GetDirectionFromGridNo(pSoldier.sGridNo, pTSoldier);
            SendSoldierSetDesiredDirectionEvent(pTSoldier, ubTDirection);
          }
        }
      } else {
        // CHECK OUR STANCE
        if (gAnimControl[pSoldier.usAnimState].ubEndHeight != ANIM_CROUCH) {
          // SET DESIRED STANCE AND SET PENDING ANIMATION
          SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
          pSoldier.usPendingAnimation = Enum193.PUNCH_LOW;
        } else {
          // USE crouched one
          // NEED TO CHANGE STANCE IF NOT CROUCHD!
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH_LOW, 0, false);
        }
      }
    }
  }

  if (pSoldier.ubProfile == 33) {
    let uiSoundID: UINT32;
    let spParms: SOUNDPARMS = createSoundParams();
    let iFaceIndex: INT32;

    // Play sound!
    spParms.uiSpeed = RATE_11025;
    spParms.uiVolume = CalculateSpeechVolume(HIGHVOLUME);

    // If we are an enemy.....reduce due to volume
    if (pSoldier.bTeam != gbPlayerNum) {
      spParms.uiVolume = SoundVolume(spParms.uiVolume, pSoldier.sGridNo);
    }
    spParms.uiLoop = 1;
    spParms.uiPan = SoundDir(pSoldier.sGridNo);
    spParms.uiPriority = GROUP_PLAYER;

    if (pSoldier.usAnimState == Enum193.NINJA_SPINKICK) {
      uiSoundID = SoundPlay("BATTLESNDS\\033_CHOP2.WAV", spParms);
    } else {
      if (Random(2) == 0) {
        uiSoundID = SoundPlay("BATTLESNDS\\033_CHOP3.WAV", spParms);
      } else {
        uiSoundID = SoundPlay("BATTLESNDS\\033_CHOP1.WAV", spParms);
      }
    }

    if (uiSoundID != SOUND_ERROR) {
      pSoldier.uiBattleSoundID = uiSoundID;

      if (pSoldier.ubProfile != NO_PROFILE) {
        // Get soldier's face ID
        iFaceIndex = pSoldier.iFaceIndex;

        // Check face index
        if (iFaceIndex != -1) {
          ExternSetFaceTalking(iFaceIndex, uiSoundID);
        }
      }
    }
  }
}

export function CreateSoldierCommon(ubBodyType: UINT8, pSoldier: SOLDIERTYPE, usSoldierID: UINT16, usState: UINT16): boolean {
  let fSuccess: boolean = false;
  let iCounter: INT32 = 0;

  // if we are loading a saved game, we DO NOT want to reset the opplist, look for enemies, or say a dying commnet
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Set initial values for opplist!
    InitSoldierOppList(pSoldier);
    HandleSight(pSoldier, SIGHT_LOOK);

    // Set some quote flags
    if (pSoldier.bLife >= OKLIFE) {
      pSoldier.fDyingComment = false;
    } else {
      pSoldier.fDyingComment = true;
    }
  }

  // ATE: Reset some timer flags...
  pSoldier.uiTimeSameBattleSndDone = 0;
  // ATE: Reset every time.....
  pSoldier.fSoldierWasMoving = true;
  pSoldier.iTuringSoundID = NO_SAMPLE;
  pSoldier.uiTimeSinceLastBleedGrunt = 0;

  if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
    pSoldier.iPositionSndID = NewPositionSnd(NOWHERE, POSITION_SOUND_FROM_SOLDIER, pSoldier, Enum330.QUEEN_AMBIENT_NOISE);
  }

  // ANYTHING AFTER HERE CAN FAIL
  do {
    if (usSoldierID <= gTacticalStatus.Team[OUR_TEAM].bLastID) {
      pSoldier.pKeyRing = createArrayFrom(NUM_KEYS, createKeyOnRing);

      for (iCounter = 0; iCounter < NUM_KEYS; iCounter++) {
        pSoldier.pKeyRing[iCounter].ubKeyID = INVALID_KEY_NUMBER;
      }
    } else {
      pSoldier.pKeyRing = <KEY_ON_RING[]><unknown>null;
    }
    // Create frame cache
    if (InitAnimationCache(usSoldierID, pSoldier.AnimCache) == false) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Soldier: Failed animation cache creation"));
      break;
    }

    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      // Init new soldier state
      // OFFSET FIRST ANIMATION FRAME FOR NEW MERCS
      if (usState != Enum193.STANDING) {
        EVENT_InitNewSoldierAnim(pSoldier, usState, 0, true);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, usState, Random(10), true);
      }
    } else {
      /// if we don't have a world loaded, and are in a bad anim, goto standing.
      // bad anims are: HOPFENCE,
      // CLIMBDOWNROOF, FALLFORWARD_ROOF,FALLOFF, CLIMBUPROOF
      if (!gfWorldLoaded && (usState == Enum193.HOPFENCE || usState == Enum193.CLIMBDOWNROOF || usState == Enum193.FALLFORWARD_ROOF || usState == Enum193.FALLOFF || usState == Enum193.CLIMBUPROOF)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, true);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, usState, pSoldier.usAniCode, true);
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
    if (CreateSoldierPalettes(pSoldier) == false) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Soldier: Failed in creating soldier palettes"));
      break;
    }

    fSuccess = true;
  } while (false);

  if (!fSuccess) {
    DeleteSoldier((pSoldier));
  }

  return fSuccess;
}

export function DeleteSoldier(pSoldier: SOLDIERTYPE): boolean {
  let cnt: UINT32;
  let iGridNo: INT32;
  let bDir: INT8;
  let fRet: boolean;

  if (pSoldier != null) {
    // if(pSoldier->pBackGround!=NULL)
    // MemFree(pSoldier->pBackGround);

    // if(pSoldier->pZBackground!=NULL)
    // MemFree(pSoldier->pZBackground);

    if (pSoldier.sGridNo != NOWHERE) {
      // Remove adjacency records
      for (bDir = 0; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir++) {
        iGridNo = pSoldier.sGridNo + DirIncrementer[bDir];
        if (iGridNo >= 0 && iGridNo < WORLD_MAX) {
          gpWorldLevelData[iGridNo].ubAdjacentSoldierCnt--;
        }
      }
    }

    // Delete key ring
    if (pSoldier.pKeyRing) {
      MemFree(pSoldier.pKeyRing);
      pSoldier.pKeyRing = null;
    }

    // Delete faces
    DeleteSoldierFace(pSoldier);

    // FREE PALETTES
    if (pSoldier.p8BPPPalette != null) {
      MemFree(pSoldier.p8BPPPalette);
      pSoldier.p8BPPPalette = null;
    }

    if (pSoldier.p16BPPPalette != null) {
      MemFree(pSoldier.p16BPPPalette);
      pSoldier.p16BPPPalette = null;
    }

    for (cnt = 0; cnt < NUM_SOLDIER_SHADES; cnt++) {
      if (pSoldier.pShades[cnt] != null) {
        MemFree(pSoldier.pShades[cnt]);
        pSoldier.pShades[cnt] = null;
      }
    }
    for (cnt = 0; cnt < NUM_SOLDIER_EFFECTSHADES; cnt++) {
      if (pSoldier.pEffectShades[cnt] != null) {
        MemFree(pSoldier.pEffectShades[cnt]);
        pSoldier.pEffectShades[cnt] = null;
      }
    }

    // Delete glows
    for (cnt = 0; cnt < 20; cnt++) {
      if (pSoldier.pGlowShades[cnt] != null) {
        MemFree(pSoldier.pGlowShades[cnt]);
        pSoldier.pGlowShades[cnt] = null;
      }
    }

    if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
      DeletePositionSnd(pSoldier.iPositionSndID);
    }

    // Free any animations we may have locked...
    UnLoadCachedAnimationSurfaces(pSoldier.ubID, pSoldier.AnimCache);

    // Free Animation cache
    DeleteAnimationCache(pSoldier.ubID, pSoldier.AnimCache);

    // Soldier is not active
    pSoldier.bActive = false;

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

  return true;
}

function CreateSoldierLight(pSoldier: SOLDIERTYPE): boolean {
  if (pSoldier.bTeam != gbPlayerNum) {
    return false;
  }

  // DO ONLY IF WE'RE AT A GOOD LEVEL
  if (pSoldier.iLight == -1) {
    // ATE: Check for goggles in headpos....
    if (pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.NIGHTGOGGLES || pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.NIGHTGOGGLES) {
      if ((pSoldier.iLight = LightSpriteCreate("Light3", 0)) == (-1)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Soldier: Failed loading light"));
        return false;
      } else {
        LightSprites[pSoldier.iLight].uiFlags |= MERC_LIGHT;
      }
    } else if (pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.UVGOGGLES || pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.UVGOGGLES) {
      if ((pSoldier.iLight = LightSpriteCreate("Light4", 0)) == (-1)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Soldier: Failed loading light"));
        return false;
      } else {
        LightSprites[pSoldier.iLight].uiFlags |= MERC_LIGHT;
      }
    } else {
      if ((pSoldier.iLight = LightSpriteCreate("Light2", 0)) == (-1)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Soldier: Failed loading light"));
        return false;
      } else {
        LightSprites[pSoldier.iLight].uiFlags |= MERC_LIGHT;
      }
    }

    if (pSoldier.bLevel != 0) {
      LightSpriteRoofStatus(pSoldier.iLight, true);
    }
  }

  return true;
}

export function ReCreateSoldierLight(pSoldier: SOLDIERTYPE): boolean {
  if (pSoldier.bTeam != gbPlayerNum) {
    return false;
  }

  if (!pSoldier.bActive) {
    return false;
  }

  if (!pSoldier.bInSector) {
    return false;
  }

  // Delete Light!
  DeleteSoldierLight(pSoldier);

  if (pSoldier.iLight == -1) {
    CreateSoldierLight(pSoldier);
  }

  return true;
}

function ReCreateSelectedSoldierLight(): boolean {
  let pSoldier: SOLDIERTYPE;

  if (gusSelectedSoldier == NO_SOLDIER) {
    return false;
  }

  pSoldier = MercPtrs[gusSelectedSoldier];

  return ReCreateSoldierLight(pSoldier);
}

export function DeleteSoldierLight(pSoldier: SOLDIERTYPE): boolean {
  if (pSoldier.iLight != (-1)) {
    LightSpriteDestroy(pSoldier.iLight);
    pSoldier.iLight = -1;
  }

  return true;
}

// FUNCTIONS CALLED BY EVENT PUMP
/////////////////////////////////

export function ChangeSoldierState(pSoldier: SOLDIERTYPE, usNewState: UINT16, usStartingAniCode: UINT16, fForce: boolean): boolean {
  let SChangeState: EV_S_CHANGESTATE = createEvSChangeState();

  // Send message that we have changed states
  SChangeState.usNewState = usNewState;
  SChangeState.usSoldierID = pSoldier.ubID;
  SChangeState.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;
  SChangeState.usStartingAniCode = usStartingAniCode;
  SChangeState.sXPos = pSoldier.sX;
  SChangeState.sYPos = pSoldier.sY;
  SChangeState.fForce = fForce;
  SChangeState.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;

  // AddGameEvent( S_CHANGESTATE, 0, &SChangeState );
  EVENT_InitNewSoldierAnim(pSoldier, SChangeState.usNewState, SChangeState.usStartingAniCode, SChangeState.fForce);

  return true;
}

// This function reevaluates the stance if the guy sees us!
export function ReevaluateEnemyStance(pSoldier: SOLDIERTYPE, usAnimState: UINT16): boolean {
  let cnt: INT32;
  let iClosestEnemy: INT32 = NOBODY;
  let sTargetXPos: INT16;
  let sTargetYPos: INT16;
  let fReturnVal: boolean = false;
  let sDist: INT16;
  let sClosestDist: INT16 = 10000;

  // make the chosen one not turn to face us
  if (OK_ENEMY_MERC(pSoldier) && pSoldier.ubID != gTacticalStatus.ubTheChosenOne && gAnimControl[usAnimState].ubEndHeight == ANIM_STAND && !(pSoldier.uiStatusFlags & SOLDIER_UNDERAICONTROL)) {
    if (pSoldier.fTurningFromPronePosition == TURNING_FROM_PRONE_OFF) {
      // If we are a queen and see enemies, goto ready
      if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
        if (gAnimControl[usAnimState].uiFlags & (ANIM_BREATH)) {
          if (pSoldier.bOppCnt > 0) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_INTO_READY, 0, true);
            return true;
          }
        }
      }

      // ATE: Don't do this if we're not a merc.....
      if (!IS_MERC_BODY_TYPE(pSoldier)) {
        return false;
      }

      if (gAnimControl[usAnimState].uiFlags & (ANIM_MERCIDLE | ANIM_BREATH)) {
        if (pSoldier.bOppCnt > 0) {
          // Pick a guy this buddy sees and turn towards them!
          for (cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++) {
            if (pSoldier.bOppList[cnt] == SEEN_CURRENTLY) {
              sDist = PythSpacesAway(pSoldier.sGridNo, MercPtrs[cnt].sGridNo);
              if (sDist < sClosestDist) {
                sClosestDist = sDist;
                iClosestEnemy = cnt;
              }
            }
          }

          if (iClosestEnemy != NOBODY) {
            // Change to fire ready animation
            ({ sX: sTargetXPos, sY: sTargetYPos } = ConvertGridNoToXY(MercPtrs[iClosestEnemy].sGridNo));

            pSoldier.fDontChargeReadyAPs = true;

            // Ready weapon
            fReturnVal = SoldierReadyWeapon(pSoldier, sTargetXPos, sTargetYPos, false);

            return fReturnVal;
          }
        }
      }
    }
  }
  return false;
}

function CheckForFreeupFromHit(pSoldier: SOLDIERTYPE, uiOldAnimFlags: UINT32, uiNewAnimFlags: UINT32, usOldAniState: UINT16, usNewState: UINT16): void {
  // THIS COULD POTENTIALLY CALL EVENT_INITNEWAnim() if the GUY was SUPPRESSED
  // CHECK IF THE OLD ANIMATION WAS A HIT START THAT WAS NOT FOLLOWED BY A HIT FINISH
  // IF SO, RELEASE ATTACKER FROM ATTACKING

  // If old and new animations are the same, do nothing!
  if (usOldAniState == Enum193.QUEEN_HIT && usNewState == Enum193.QUEEN_HIT) {
    return;
  }

  if (usOldAniState != usNewState && (uiOldAnimFlags & ANIM_HITSTART) && !(uiNewAnimFlags & ANIM_HITFINISH) && !(uiNewAnimFlags & ANIM_IGNOREHITFINISH) && !(pSoldier.uiStatusFlags & SOLDIER_TURNINGFROMHIT)) {
    // Release attacker
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker, normal hit animation ended NEW: %s ( %d ) OLD: %s ( %d )", gAnimControl[usNewState].zAnimStr, usNewState, gAnimControl[usOldAniState].zAnimStr, pSoldier.usOldAniState));
    ReleaseSoldiersAttacker(pSoldier);

    // FREEUP GETTING HIT FLAG
    pSoldier.fGettingHit = 0;

    // ATE: if our guy, have 10% change of say damn, if still conscious...
    if (pSoldier.bTeam == gbPlayerNum && pSoldier.bLife >= OKLIFE) {
      if (Random(10) == 0) {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_CURSE1));
      }
    }
  }

  // CHECK IF WE HAVE FINSIHED A HIT WHILE DOWN
  // OBLY DO THIS IF 1 ) We are dead already or 2 ) We are alive still
  if ((uiOldAnimFlags & ANIM_HITWHENDOWN) && ((pSoldier.uiStatusFlags & SOLDIER_DEAD) || pSoldier.bLife != 0)) {
    // Release attacker
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker, animation of kill on the ground ended"));
    ReleaseSoldiersAttacker(pSoldier);

    // FREEUP GETTING HIT FLAG
    pSoldier.fGettingHit = 0;

    if (pSoldier.bLife == 0) {
      // ATE: Set previous attacker's value!
      // This is so that the killer can say their killed quote....
      pSoldier.ubAttackerID = pSoldier.ubPreviousAttackerID;
    }
  }
}

// THIS IS CALLED FROM AN EVENT ( S_CHANGESTATE )!
export function EVENT_InitNewSoldierAnim(pSoldier: SOLDIERTYPE, usNewState: UINT16, usStartingAniCode: UINT16, fForce: boolean): boolean {
  let usNewGridNo: UINT16 = 0;
  let sAPCost: INT16 = 0;
  let sBPCost: INT16 = 0;
  let uiOldAnimFlags: UINT32;
  let uiNewAnimFlags: UINT32;
  let usSubState: UINT16;
  let usItem: UINT16;
  let fTryingToRestart: boolean = false;

  if (usNewState >= Enum193.NUMANIMATIONSTATES) {
    return false;
  }

  ///////////////////////////////////////////////////////////////////////
  //			DO SOME CHECKS ON OUR NEW ANIMATION!
  /////////////////////////////////////////////////////////////////////

  // If we are NOT loading a game, continue normally
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // CHECK IF WE ARE TRYING TO INTURRUPT A SCRIPT WHICH WE DO NOT WANT INTERRUPTED!
    if (pSoldier.fInNonintAnim) {
      return false;
    }

    if (pSoldier.fRTInNonintAnim) {
      if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
        return false;
      } else {
        pSoldier.fRTInNonintAnim = false;
      }
    }

    // Check if we can restart this animation if it's the same as our current!
    if (usNewState == pSoldier.usAnimState) {
      if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_NORESTART) && !fForce) {
        fTryingToRestart = true;
      }
    }

    // Check state, if we are not at the same height, set this ani as the pending one and
    // change stance accordingly
    // ATE: ONLY IF WE ARE STARTING AT START OF ANIMATION!
    if (usStartingAniCode == 0) {
      if (gAnimControl[usNewState].ubHeight != gAnimControl[pSoldier.usAnimState].ubEndHeight && !(gAnimControl[usNewState].uiFlags & (ANIM_STANCECHANGEANIM | ANIM_IGNORE_AUTOSTANCE))) {
        // Check if we are going from crouched height to prone height, and adjust fast turning accordingly
        // Make guy turn while crouched THEN go into prone
        if ((gAnimControl[usNewState].ubEndHeight == ANIM_PRONE && gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_CROUCH) && !(gTacticalStatus.uiFlags & INCOMBAT)) {
          pSoldier.fTurningUntilDone = true;
          pSoldier.ubPendingStanceChange = gAnimControl[usNewState].ubEndHeight;
          pSoldier.usPendingAnimation = usNewState;
          return true;
        }
        // Check if we are in realtime and we are going from stand to crouch
        else if (gAnimControl[usNewState].ubEndHeight == ANIM_CROUCH && gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_STAND && (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) && ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
          pSoldier.ubDesiredHeight = gAnimControl[usNewState].ubEndHeight;
          // Continue with this course of action IE: Do animation and skip from stand to crouch
        }
        // Check if we are in realtime and we are going from crouch to stand
        else if (gAnimControl[usNewState].ubEndHeight == ANIM_STAND && gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_CROUCH && (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) && ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) && pSoldier.usAnimState != Enum193.HELIDROP) {
          pSoldier.ubDesiredHeight = gAnimControl[usNewState].ubEndHeight;
          // Continue with this course of action IE: Do animation and skip from stand to crouch
        } else {
          // ONLY DO FOR EVERYONE BUT PLANNING GUYS
          if (pSoldier.ubID < MAX_NUM_SOLDIERS) {
            // Set our next moving animation to be pending, after
            pSoldier.usPendingAnimation = usNewState;
            // Set new state to be animation to move to new stance
            SendChangeSoldierStanceEvent(pSoldier, gAnimControl[usNewState].ubHeight);
            return true;
          }
        }
      }
    }

    if (usNewState == Enum193.ADJACENT_GET_ITEM) {
      if (pSoldier.ubPendingDirection != NO_PENDING_DIRECTION) {
        EVENT_InternalSetSoldierDesiredDirection(pSoldier, pSoldier.ubPendingDirection, false, pSoldier.usAnimState);
        pSoldier.ubPendingDirection = NO_PENDING_DIRECTION;
        pSoldier.usPendingAnimation = Enum193.ADJACENT_GET_ITEM;
        pSoldier.fTurningUntilDone = true;
        SoldierGotoStationaryStance(pSoldier);
        return true;
      }
    }

    if (usNewState == Enum193.CLIMBUPROOF) {
      if (pSoldier.ubPendingDirection != NO_PENDING_DIRECTION) {
        EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.ubPendingDirection);
        pSoldier.ubPendingDirection = NO_PENDING_DIRECTION;
        pSoldier.usPendingAnimation = Enum193.CLIMBUPROOF;
        pSoldier.fTurningUntilDone = true;
        SoldierGotoStationaryStance(pSoldier);
        return true;
      }
    }

    if (usNewState == Enum193.CLIMBDOWNROOF) {
      if (pSoldier.ubPendingDirection != NO_PENDING_DIRECTION) {
        EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.ubPendingDirection);
        pSoldier.ubPendingDirection = NO_PENDING_DIRECTION;
        pSoldier.usPendingAnimation = Enum193.CLIMBDOWNROOF;
        pSoldier.fTurningFromPronePosition = 0;
        pSoldier.fTurningUntilDone = true;
        SoldierGotoStationaryStance(pSoldier);
        return true;
      }
    }

    // ATE: Don't raise/lower automatically if we are low on health,
    // as our gun looks lowered anyway....
    // if ( pSoldier->bLife > INJURED_CHANGE_THREASHOLD )
    {
      // Don't do some of this if we are a monster!
      // ATE: LOWER AIMATION IS GOOD, RAISE ONE HOWEVER MAY CAUSE PROBLEMS FOR AI....
      if (!(pSoldier.uiStatusFlags & SOLDIER_MONSTER) && pSoldier.ubBodyType != Enum194.ROBOTNOWEAPON && pSoldier.bTeam == gbPlayerNum) {
        // If this animation is a raise_weapon animation
        if ((gAnimControl[usNewState].uiFlags & ANIM_RAISE_WEAPON) && !(gAnimControl[pSoldier.usAnimState].uiFlags & (ANIM_RAISE_WEAPON | ANIM_NOCHANGE_WEAPON))) {
          // We are told that we need to rasie weapon
          // Do so only if
          // 1) We have a rifle in hand...
          usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

          if (usItem != NOTHING && (Item[usItem].fFlags & ITEM_TWO_HANDED) && usItem != Enum225.ROCKET_LAUNCHER) {
            // Switch on height!
            switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
              case ANIM_STAND:

                // 2) OK, all's fine... lower weapon first....
                pSoldier.usPendingAnimation = usNewState;
                // Set new state to be animation to move to new stance
                usNewState = Enum193.RAISE_RIFLE;
            }
          }
        }

        // If this animation is a lower_weapon animation
        if ((gAnimControl[usNewState].uiFlags & ANIM_LOWER_WEAPON) && !(gAnimControl[pSoldier.usAnimState].uiFlags & (ANIM_LOWER_WEAPON | ANIM_NOCHANGE_WEAPON))) {
          // We are told that we need to rasie weapon
          // Do so only if
          // 1) We have a rifle in hand...
          usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

          if (usItem != NOTHING && (Item[usItem].fFlags & ITEM_TWO_HANDED) && usItem != Enum225.ROCKET_LAUNCHER) {
            // Switch on height!
            switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
              case ANIM_STAND:

                // 2) OK, all's fine... lower weapon first....
                pSoldier.usPendingAnimation = usNewState;
                // Set new state to be animation to move to new stance
                usNewState = Enum193.LOWER_RIFLE;
            }
          }
        }
      }
    }

    // Are we cowering and are tyring to move, getup first...
    if (gAnimControl[usNewState].uiFlags & ANIM_MOVING && pSoldier.usAnimState == Enum193.COWERING && gAnimControl[usNewState].ubEndHeight == ANIM_STAND) {
      pSoldier.usPendingAnimation = usNewState;
      // Set new state to be animation to move to new stance
      usNewState = Enum193.END_COWER;
    }

    // If we want to start swatting, put a pending animation
    if (pSoldier.usAnimState != Enum193.START_SWAT && usNewState == Enum193.SWATTING) {
      // Set new state to be animation to move to new stance
      usNewState = Enum193.START_SWAT;
    }

    if (pSoldier.usAnimState == Enum193.SWATTING && usNewState == Enum193.CROUCHING) {
      // Set new state to be animation to move to new stance
      usNewState = Enum193.END_SWAT;
    }

    if (pSoldier.usAnimState == Enum193.WALKING && usNewState == Enum193.STANDING && pSoldier.bLife < INJURED_CHANGE_THREASHOLD && pSoldier.ubBodyType <= Enum194.REGFEMALE && !MercInWater(pSoldier)) {
      // Set new state to be animation to move to new stance
      usNewState = Enum193.END_HURT_WALKING;
    }

    // Check if we are an enemy, and we are in an animation what should be overriden
    // by if he sees us or not.
    if (ReevaluateEnemyStance(pSoldier, usNewState)) {
      return true;
    }

    // OK.......
    if (pSoldier.ubBodyType > Enum194.REGFEMALE) {
      if (pSoldier.bLife < INJURED_CHANGE_THREASHOLD) {
        if (usNewState == Enum193.READY_RIFLE_STAND) {
          //	pSoldier->usPendingAnimation2 = usNewState;
          //	usNewState = FROM_INJURED_TRANSITION;
        }
      }
    }

    // Alrighty, check if we should free buddy up!
    if (usNewState == Enum193.GIVING_AID) {
      UnSetUIBusy(pSoldier.ubID);
    }

    // SUBSTITUDE VARIOUS REG ANIMATIONS WITH ODD BODY TYPES
    if (SubstituteBodyTypeAnimation(pSoldier, usNewState, addressof(usSubState))) {
      usNewState = usSubState;
    }

    // CHECK IF WE CAN DO THIS ANIMATION!
    if (IsAnimationValidForBodyType(pSoldier, usNewState) == false) {
      return false;
    }

    // OK, make guy transition if a big merc...
    if (pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE) {
      if (usNewState == Enum193.KNEEL_DOWN && pSoldier.usAnimState != Enum193.BIGMERC_CROUCH_TRANS_INTO) {
        let usItem: UINT16;

        // Do we have a rifle?
        usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

        if (usItem != NOTHING) {
          if (Item[usItem].usItemClass == IC_GUN && usItem != Enum225.ROCKET_LAUNCHER) {
            if ((Item[usItem].fFlags & ITEM_TWO_HANDED)) {
              usNewState = Enum193.BIGMERC_CROUCH_TRANS_INTO;
            }
          }
        }
      }

      if (usNewState == Enum193.KNEEL_UP && pSoldier.usAnimState != Enum193.BIGMERC_CROUCH_TRANS_OUTOF) {
        let usItem: UINT16;

        // Do we have a rifle?
        usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

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
    if (pSoldier.bReverse) {
      if (usNewState == Enum193.WALKING || usNewState == Enum193.RUNNING || usNewState == Enum193.SWATTING) {
        // CHECK FOR SIDEWAYS!
        if (pSoldier.bDirection == gPurpendicularDirection[pSoldier.bDirection][pSoldier.usPathingData[pSoldier.usPathIndex]]) {
          // We are perpendicular!
          usNewState = Enum193.SIDE_STEP;
        } else {
          if (gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_CROUCH) {
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
      if (CheckForBreathCollapse(pSoldier) || pSoldier.bCollapsed) {
        // UNset UI
        UnSetUIBusy(pSoldier.ubID);

        SoldierCollapse(pSoldier);

        pSoldier.bBreathCollapsed = false;

        return false;
      }
    }

    // If we are in water.....and trying to run, change to run
    if (pSoldier.bOverTerrainType == Enum315.LOW_WATER || pSoldier.bOverTerrainType == Enum315.MED_WATER) {
      // Check animation
      // Change to walking
      if (usNewState == Enum193.RUNNING) {
        usNewState = Enum193.WALKING;
      }
    }

    // Turn off anipause flag for any anim!
    pSoldier.uiStatusFlags &= (~SOLDIER_PAUSEANIMOVE);

    // Unset paused for no APs.....
    AdjustNoAPToFinishMove(pSoldier, false);

    if (usNewState == Enum193.CRAWLING && pSoldier.usDontUpdateNewGridNoOnMoveAnimChange == 1) {
      if (pSoldier.fTurningFromPronePosition != TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE) {
        pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_START_UP_FROM_MOVE;
      }

      // ATE: IF we are starting to crawl, but have to getup to turn first......
      if (pSoldier.fTurningFromPronePosition == TURNING_FROM_PRONE_START_UP_FROM_MOVE) {
        usNewState = Enum193.PRONE_UP;
        pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE;
      }
    }

    // We are about to start moving
    // Handle buddy beginning to move...
    // check new gridno, etc
    // ATE: Added: Make check that old anim is not a moving one as well
    if (gAnimControl[usNewState].uiFlags & ANIM_MOVING && !(gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) || (gAnimControl[usNewState].uiFlags & ANIM_MOVING && fForce)) {
      let fKeepMoving: boolean;

      if (usNewState == Enum193.CRAWLING && pSoldier.usDontUpdateNewGridNoOnMoveAnimChange == LOCKED_NO_NEWGRIDNO) {
        // Turn off lock once we are crawling once...
        pSoldier.usDontUpdateNewGridNoOnMoveAnimChange = 1;
      }

      // ATE: Additional check here if we have just been told to update animation ONLY, not goto gridno stuff...
      if (!pSoldier.usDontUpdateNewGridNoOnMoveAnimChange) {
        if (usNewState != Enum193.SWATTING) {
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Handling New gridNo for %d: Old %s, New %s", pSoldier.ubID, gAnimControl[pSoldier.usAnimState].zAnimStr, gAnimControl[usNewState].zAnimStr));

          if (!(gAnimControl[usNewState].uiFlags & ANIM_SPECIALMOVE)) {
            // Handle goto new tile...
            if (HandleGotoNewGridNo(pSoldier, addressof(fKeepMoving), true, usNewState)) {
              if (!fKeepMoving) {
                return false;
              }

              // Make sure desy = zeroed out...
              // pSoldier->fPastXDest = pSoldier->fPastYDest = FALSE;
            } else {
              if (pSoldier.bBreathCollapsed) {
                // UNset UI
                UnSetUIBusy(pSoldier.ubID);

                SoldierCollapse(pSoldier);

                pSoldier.bBreathCollapsed = false;
              }
              return false;
            }
          } else {
            // Change desired direction
            // Just change direction
            EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.usPathingData[pSoldier.usPathIndex], false, pSoldier.usAnimState);
          }

          // check for services
          ReceivingSoldierCancelServices(pSoldier);
          GivingSoldierCancelServices(pSoldier);

          // Check if we are a vehicle, and start playing noise sound....
          if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
            HandleVehicleMovementSound(pSoldier, true);
          }
        }
      }
    } else {
      // Check for stopping movement noise...
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        HandleVehicleMovementSound(pSoldier, false);

        // If a vehicle, set hewight to 0
        SetSoldierHeight(pSoldier, (0));
      }
    }

    // Reset to false always.....
    // ( Unless locked )
    if (gAnimControl[usNewState].uiFlags & ANIM_MOVING) {
      if (pSoldier.usDontUpdateNewGridNoOnMoveAnimChange != LOCKED_NO_NEWGRIDNO) {
        pSoldier.usDontUpdateNewGridNoOnMoveAnimChange = 0;
      }
    }

    if (fTryingToRestart) {
      return false;
    }
  }

  // ATE: If this is an AI guy.. unlock him!
  if (gTacticalStatus.fEnemySightingOnTheirTurn) {
    if (gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID == pSoldier.ubID) {
      pSoldier.fPauseAllAnimation = false;
      gTacticalStatus.fEnemySightingOnTheirTurn = false;
    }
  }

  ///////////////////////////////////////////////////////////////////////
  //			HERE DOWN - WE HAVE MADE A DESCISION!
  /////////////////////////////////////////////////////////////////////

  uiOldAnimFlags = gAnimControl[pSoldier.usAnimState].uiFlags;
  uiNewAnimFlags = gAnimControl[usNewState].uiFlags;

  usNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(pSoldier.usPathingData[pSoldier.usPathIndex]));

  // CHECKING IF WE HAVE A HIT FINISH BUT NO DEATH IS DONE WITH A SPECIAL ANI CODE
  // IN THE HIT FINSIH ANI SCRIPTS

  // CHECKING IF WE HAVE FINISHED A DEATH ANIMATION IS DONE WITH A SPECIAL ANI CODE
  // IN THE DEATH SCRIPTS

  // CHECK IF THIS NEW STATE IS NON-INTERRUPTABLE
  // IF SO - SET NON-INT FLAG
  if (uiNewAnimFlags & ANIM_NONINTERRUPT) {
    pSoldier.fInNonintAnim = true;
  }

  if (uiNewAnimFlags & ANIM_RT_NONINTERRUPT) {
    pSoldier.fRTInNonintAnim = true;
  }

  // CHECK IF WE ARE NOT AIMING, IF NOT, RESET LAST TAGRET!
  if (!(gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_FIREREADY) && !(gAnimControl[usNewState].uiFlags & ANIM_FIREREADY)) {
    // ATE: Also check for the transition anims to not reset this
    // this should have used a flag but we're out of them....
    if (usNewState != Enum193.READY_RIFLE_STAND && usNewState != Enum193.READY_RIFLE_PRONE && usNewState != Enum193.READY_RIFLE_CROUCH && usNewState != Enum193.ROBOT_SHOOT) {
      pSoldier.sLastTarget = NOWHERE;
    }
  }

  // If a special move state, release np aps
  if ((gAnimControl[usNewState].uiFlags & ANIM_SPECIALMOVE)) {
    AdjustNoAPToFinishMove(pSoldier, false);
  }

  if (gAnimControl[usNewState].uiFlags & ANIM_UPDATEMOVEMENTMODE) {
    if (pSoldier.bTeam == gbPlayerNum) {
      // pSoldier->usUIMovementMode =  GetMoveStateBasedOnStance( pSoldier, gAnimControl[ usNewState ].ubEndHeight );
    }
  }

  // ATE: If not a moving animation - turn off reverse....
  if (!(gAnimControl[usNewState].uiFlags & ANIM_MOVING)) {
    pSoldier.bReverse = false;
  }

  // ONLY DO FOR EVERYONE BUT PLANNING GUYS
  if (pSoldier.ubID < MAX_NUM_SOLDIERS) {
    // Do special things based on new state
    switch (usNewState) {
      case Enum193.STANDING:

        // Update desired height
        pSoldier.ubDesiredHeight = ANIM_STAND;
        break;

      case Enum193.CROUCHING:

        // Update desired height
        pSoldier.ubDesiredHeight = ANIM_CROUCH;
        break;

      case Enum193.PRONE:

        // Update desired height
        pSoldier.ubDesiredHeight = ANIM_PRONE;
        break;

      case Enum193.READY_RIFLE_STAND:
      case Enum193.READY_RIFLE_PRONE:
      case Enum193.READY_RIFLE_CROUCH:
      case Enum193.READY_DUAL_STAND:
      case Enum193.READY_DUAL_CROUCH:
      case Enum193.READY_DUAL_PRONE:

        // OK, get points to ready weapon....
        if (!pSoldier.fDontChargeReadyAPs) {
          sAPCost = GetAPsToReadyWeapon(pSoldier, usNewState);
          DeductPoints(pSoldier, sAPCost, sBPCost);
        } else {
          pSoldier.fDontChargeReadyAPs = false;
        }
        break;

      case Enum193.WALKING:

        pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
        pSoldier.ubPendingActionAnimCount = 0;
        break;

      case Enum193.SWATTING:

        pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
        pSoldier.ubPendingActionAnimCount = 0;
        break;

      case Enum193.CRAWLING:

        // Turn off flag...
        pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
        pSoldier.ubPendingActionAnimCount = 0;
        pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
        break;

      case Enum193.RUNNING:

        // Only if our previous is not running
        if (pSoldier.usAnimState != Enum193.RUNNING) {
          sAPCost = AP_START_RUN_COST;
          DeductPoints(pSoldier, sAPCost, sBPCost);
        }
        // Set pending action count to 0
        pSoldier.ubPendingActionAnimCount = 0;
        pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
        break;

      case Enum193.ADULTMONSTER_WALKING:
        pSoldier.ubPendingActionAnimCount = 0;
        break;

      case Enum193.ROBOT_WALK:
        pSoldier.ubPendingActionAnimCount = 0;
        break;

      case Enum193.KNEEL_UP:
      case Enum193.KNEEL_DOWN:
      case Enum193.BIGMERC_CROUCH_TRANS_INTO:
      case Enum193.BIGMERC_CROUCH_TRANS_OUTOF:

        if (!pSoldier.fDontChargeAPsForStanceChange) {
          DeductPoints(pSoldier, AP_CROUCH, BP_CROUCH);
        }
        pSoldier.fDontChargeAPsForStanceChange = false;
        break;

      case Enum193.PRONE_UP:
      case Enum193.PRONE_DOWN:

        // ATE: If we are NOT waiting for prone down...
        if (pSoldier.fTurningFromPronePosition < TURNING_FROM_PRONE_START_UP_FROM_MOVE && !pSoldier.fDontChargeAPsForStanceChange) {
          // ATE: Don't do this if we are still 'moving'....
          if (pSoldier.sGridNo == pSoldier.sFinalDestination || pSoldier.usPathIndex == 0) {
            DeductPoints(pSoldier, AP_PRONE, BP_PRONE);
          }
        }
        pSoldier.fDontChargeAPsForStanceChange = false;
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
        if (pSoldier.pAniTile != null) {
          DeleteAniTile(pSoldier.pAniTile);
          pSoldier.pAniTile = null;
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
        pSoldier.uiPendingActionData1 = 0;
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

          usNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(pSoldier.bDirection));
          usNewGridNo = NewGridNo(usNewGridNo, DirectionInc(pSoldier.bDirection));

          pSoldier.usPathDataSize = 0;
          pSoldier.usPathIndex = 0;
          pSoldier.usPathingData[pSoldier.usPathDataSize] = pSoldier.bDirection;
          pSoldier.usPathDataSize++;
          pSoldier.usPathingData[pSoldier.usPathDataSize] = pSoldier.bDirection;
          pSoldier.usPathDataSize++;
          pSoldier.sFinalDestination = usNewGridNo;
          // Set direction
          EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.usPathingData[pSoldier.usPathIndex], false, Enum193.JUMP_OVER_BLOCKING_PERSON);
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
        pSoldier.fGettingHit = 1;
        break;

      case Enum193.CHARIOTS_OF_FIRE:
      case Enum193.BODYEXPLODING:

        // Merc on fire!
        pSoldier.uiPendingActionData1 = PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.FIRE_ON_MERC), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 5, SoundDir(pSoldier.sGridNo), true);
        break;
    }
  }

  // Remove old animation profile
  HandleAnimationProfile(pSoldier, pSoldier.usAnimState, true);

  // From animation control, set surface
  if (SetSoldierAnimationSurface(pSoldier, usNewState) == false) {
    return false;
  }

  // Set state
  pSoldier.usOldAniState = pSoldier.usAnimState;
  pSoldier.sOldAniCode = pSoldier.usAniCode;

  // Change state value!
  pSoldier.usAnimState = usNewState;

  pSoldier.sZLevelOverride = -1;

  if (!(pSoldier.uiStatusFlags & SOLDIER_LOCKPENDINGACTIONCOUNTER)) {
    // ATE Cancel ANY pending action...
    if (pSoldier.ubPendingActionAnimCount > 0 && (gAnimControl[pSoldier.usOldAniState].uiFlags & ANIM_MOVING)) {
      // Do some special things for some actions
      switch (pSoldier.ubPendingAction) {
        case Enum257.MERC_GIVEITEM:

          // Unset target as enaged
          MercPtrs[pSoldier.uiPendingActionData4].uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
          break;
      }
      pSoldier.ubPendingAction = NO_PENDING_ACTION;
    } else {
      // Increment this for almost all animations except some movement ones...
      // That's because this represents ANY animation other than the one we began when the pending action was started
      // ATE: Added to ignore this count if we are waiting for someone to move out of our way...
      if (usNewState != Enum193.START_SWAT && usNewState != Enum193.END_SWAT && !(gAnimControl[usNewState].uiFlags & ANIM_NOCHANGE_PENDINGCOUNT) && !pSoldier.fDelayedMovement && !(pSoldier.uiStatusFlags & SOLDIER_ENGAGEDINACTION)) {
        pSoldier.ubPendingActionAnimCount++;
      }
    }
  }

  // Set new animation profile
  HandleAnimationProfile(pSoldier, usNewState, false);

  // Reset some animation values
  pSoldier.fForceShade = false;

  CheckForFreeupFromHit(pSoldier, uiOldAnimFlags, uiNewAnimFlags, pSoldier.usOldAniState, usNewState);

  // Set current frame
  pSoldier.usAniCode = usStartingAniCode;

  // ATE; For some animations that could use some variations, do so....
  if (usNewState == Enum193.CHARIOTS_OF_FIRE || usNewState == Enum193.BODYEXPLODING) {
    pSoldier.usAniCode = (Random(10));
  }

  // ATE: Default to first frame....
  // Will get changed ( probably ) by AdjustToNextAnimationFrame()
  ConvertAniCodeToAniFrame(pSoldier, (0));

  // Set delay speed
  SetSoldierAniSpeed(pSoldier);

  // Reset counters
  pSoldier.UpdateCounter = RESETTIMECOUNTER(pSoldier.sAniDelay);

  // Adjust to new animation frame ( the first one )
  AdjustToNextAnimationFrame(pSoldier);

  // Setup offset information for UI above guy
  SetSoldierLocatorOffsets(pSoldier);

  // If our own guy...
  if (pSoldier.bTeam == gbPlayerNum) {
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
    if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY) && (gAnimControl[pSoldier.usOldAniState].uiFlags & ANIM_MOVING)) {
      PlaySoldierFootstepSound(pSoldier);
    }
  }

  // Free up from stance change
  FreeUpNPCFromStanceChange(pSoldier);

  return true;
}

function InternalRemoveSoldierFromGridNo(pSoldier: SOLDIERTYPE, fForce: boolean): void {
  let bDir: INT8;
  let iGridNo: INT32;

  if ((pSoldier.sGridNo != NO_MAP_POS)) {
    if (pSoldier.bInSector || fForce) {
      // Remove from world ( old pos )
      RemoveMerc(pSoldier.sGridNo, pSoldier, false);
      HandleAnimationProfile(pSoldier, pSoldier.usAnimState, true);

      // Remove records of this guy being adjacent
      for (bDir = 0; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir++) {
        iGridNo = pSoldier.sGridNo + DirIncrementer[bDir];
        if (iGridNo >= 0 && iGridNo < WORLD_MAX) {
          gpWorldLevelData[iGridNo].ubAdjacentSoldierCnt--;
        }
      }

      HandlePlacingRoofMarker(pSoldier, pSoldier.sGridNo, false, false);

      // Remove reseved movement value
      UnMarkMovementReserved(pSoldier);

      HandleCrowShadowRemoveGridNo(pSoldier);

      // Reset gridno...
      pSoldier.sGridNo = NO_MAP_POS;
    }
  }
}

export function RemoveSoldierFromGridNo(pSoldier: SOLDIERTYPE): void {
  InternalRemoveSoldierFromGridNo(pSoldier, false);
}

export function EVENT_InternalSetSoldierPosition(pSoldier: SOLDIERTYPE, dNewXPos: FLOAT, dNewYPos: FLOAT, fUpdateDest: boolean, fUpdateFinalDest: boolean, fForceRemove: boolean): void {
  let sNewGridNo: INT16;

  // Not if we're dead!
  if ((pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
    return;
  }

  // Set new map index
  sNewGridNo = GETWORLDINDEXFROMWORLDCOORDS(dNewYPos, dNewXPos);

  if (fUpdateDest) {
    pSoldier.sDestination = sNewGridNo;
  }

  if (fUpdateFinalDest) {
    pSoldier.sFinalDestination = sNewGridNo;
  }

  // Copy old values
  pSoldier.dOldXPos = pSoldier.dXPos;
  pSoldier.dOldYPos = pSoldier.dYPos;

  // Set New pos
  pSoldier.dXPos = dNewXPos;
  pSoldier.dYPos = dNewYPos;

  pSoldier.sX = dNewXPos;
  pSoldier.sY = dNewYPos;

  HandleCrowShadowNewPosition(pSoldier);

  SetSoldierGridNo(pSoldier, sNewGridNo, fForceRemove);

  if (!(pSoldier.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
    if (gGameSettings.fOptions[Enum8.TOPTION_MERC_ALWAYS_LIGHT_UP]) {
      SetCheckSoldierLightFlag(pSoldier);
    }
  }

  // ATE: Mirror calls if we are a vehicle ( for all our passengers )
  UpdateAllVehiclePassengersGridNo(pSoldier);
}

export function EVENT_SetSoldierPosition(pSoldier: SOLDIERTYPE, dNewXPos: FLOAT, dNewYPos: FLOAT): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, true, true, false);
}

export function EVENT_SetSoldierPositionForceDelete(pSoldier: SOLDIERTYPE, dNewXPos: FLOAT, dNewYPos: FLOAT): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, true, true, true);
}

function EVENT_SetSoldierPositionAndMaybeFinalDest(pSoldier: SOLDIERTYPE, dNewXPos: FLOAT, dNewYPos: FLOAT, fUpdateFinalDest: boolean): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, true, fUpdateFinalDest, false);
}

export function EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination(pSoldier: SOLDIERTYPE, dNewXPos: FLOAT, dNewYPos: FLOAT, fUpdateDest: boolean, fUpdateFinalDest: boolean): void {
  EVENT_InternalSetSoldierPosition(pSoldier, dNewXPos, dNewYPos, fUpdateDest, fUpdateFinalDest, false);
}

function InternalSetSoldierHeight(pSoldier: SOLDIERTYPE, dNewHeight: FLOAT, fUpdateLevel: boolean): void {
  let bOldLevel: INT8 = pSoldier.bLevel;

  pSoldier.dHeightAdjustment = dNewHeight;
  pSoldier.sHeightAdjustment = pSoldier.dHeightAdjustment;

  if (!fUpdateLevel) {
    return;
  }

  if (pSoldier.sHeightAdjustment > 0) {
    pSoldier.bLevel = SECOND_LEVEL;

    ApplyTranslucencyToWalls((pSoldier.dXPos / CELL_X_SIZE), (pSoldier.dYPos / CELL_Y_SIZE));
    // LightHideTrees((INT16)(pSoldier->dXPos/CELL_X_SIZE), (INT16)(pSoldier->dYPos/CELL_Y_SIZE));
    // ConcealAllWalls();

    // pSoldier->pLevelNode->ubShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubShadeLevel;
    // pSoldier->pLevelNode->ubSumLights=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubSumLights;
    // pSoldier->pLevelNode->ubMaxLights=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubMaxLights;
    // pSoldier->pLevelNode->ubNaturalShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pRoofHead->ubNaturalShadeLevel;
  } else {
    pSoldier.bLevel = FIRST_LEVEL;

    // pSoldier->pLevelNode->ubShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubShadeLevel;
    // pSoldier->pLevelNode->ubSumLights=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubSumLights;
    // pSoldier->pLevelNode->ubMaxLights=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubMaxLights;
    // pSoldier->pLevelNode->ubNaturalShadeLevel=gpWorldLevelData[pSoldier->sGridNo].pLandHead->ubNaturalShadeLevel;
  }

  if (bOldLevel == 0 && pSoldier.bLevel == 0) {
  } else {
    // Show room at new level
    // HideRoom( pSoldier->sGridNo, pSoldier );
  }
}

export function SetSoldierHeight(pSoldier: SOLDIERTYPE, dNewHeight: FLOAT): void {
  InternalSetSoldierHeight(pSoldier, dNewHeight, true);
}

function SetSoldierGridNo(pSoldier: SOLDIERTYPE, sNewGridNo: INT16, fForceRemove: boolean): void {
  let fInWaterValue: boolean;
  let bDir: INT8;
  let cnt: INT32;
  let pEnemy: SOLDIERTYPE;

  // INT16	sX, sY, sWorldX, sZLevel;

  // Not if we're dead!
  if ((pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
    return;
  }

  if (sNewGridNo != pSoldier.sGridNo || pSoldier.pLevelNode == null) {
    // Check if we are moving AND this is our next dest gridno....
    if (gAnimControl[pSoldier.usAnimState].uiFlags & (ANIM_MOVING | ANIM_SPECIALMOVE)) {
      if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
        if (sNewGridNo != pSoldier.sDestination) {
          // THIS MUST be our new one......MAKE IT SO
          sNewGridNo = pSoldier.sDestination;
        }

        // Now check this baby....
        if (sNewGridNo == pSoldier.sGridNo) {
          return;
        }
      }
    }

    pSoldier.sOldGridNo = pSoldier.sGridNo;

    if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
      SetPositionSndGridNo(pSoldier.iPositionSndID, sNewGridNo);
    }

    if (!(pSoldier.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      InternalRemoveSoldierFromGridNo(pSoldier, fForceRemove);
    }

    // CHECK IF OUR NEW GIRDNO IS VALID,IF NOT DONOT SET!
    if (!GridNoOnVisibleWorldTile(sNewGridNo)) {
      pSoldier.sGridNo = sNewGridNo;
      return;
    }

    // Alrighty, update UI for this guy, if he's the selected guy...
    if (gusSelectedSoldier == pSoldier.ubID) {
      if (guiCurrentEvent == Enum207.C_WAIT_FOR_CONFIRM) {
        // Update path!
        gfPlotNewMovement = true;
      }
    }

    // Reset some flags for optimizations..
    pSoldier.sWalkToAttackGridNo = NOWHERE;

    // ATE: Make sure!
    // RemoveMerc( pSoldier->sGridNo, pSoldier, FALSE );

    pSoldier.sGridNo = sNewGridNo;

    // OK, check for special code to close door...
    if (pSoldier.bEndDoorOpenCode == 2) {
      pSoldier.bEndDoorOpenCode = 0;

      HandleDoorChangeFromGridNo(pSoldier, pSoldier.sEndDoorOpenCodeData, false);
    }

    // OK, Update buddy's strategic insertion code....
    pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.usStrategicInsertionData = sNewGridNo;

    // Remove this gridno as a reserved place!
    if (!(pSoldier.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      UnMarkMovementReserved(pSoldier);
    }

    if (pSoldier.sInitialGridNo == 0) {
      pSoldier.sInitialGridNo = sNewGridNo;
      pSoldier.usPatrolGrid[0] = sNewGridNo;
    }

    // Add records of this guy being adjacent
    for (bDir = 0; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir++) {
      gpWorldLevelData[pSoldier.sGridNo + DirIncrementer[bDir]].ubAdjacentSoldierCnt++;
    }

    if (!(pSoldier.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      DropSmell(pSoldier);
    }

    // HANDLE ANY SPECIAL RENDERING SITUATIONS
    pSoldier.sZLevelOverride = -1;
    // If we are over a fence ( hopping ), make us higher!

    if (IsJumpableFencePresentAtGridno(sNewGridNo)) {
      // sX = MapX( sNewGridNo );
      // sY = MapY( sNewGridNo );
      // GetWorldXYAbsoluteScreenXY( sX, sY, &sWorldX, &sZLevel);
      // pSoldier->sZLevelOverride = (sZLevel*Z_SUBLAYERS)+ROOF_Z_LEVEL;
      pSoldier.sZLevelOverride = TOPMOST_Z_LEVEL;
    }

    // Add/ remove tree if we are near it
    // CheckForFullStructures( pSoldier );

    // Add merc at new pos
    if (!(pSoldier.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      AddMercToHead(pSoldier.sGridNo, pSoldier, true);

      // If we are in the middle of climbing the roof!
      if (pSoldier.usAnimState == Enum193.CLIMBUPROOF) {
        if (pSoldier.iLight != (-1))
          LightSpriteRoofStatus(pSoldier.iLight, true);
      } else if (pSoldier.usAnimState == Enum193.CLIMBDOWNROOF) {
        if (pSoldier.iLight != (-1))
          LightSpriteRoofStatus(pSoldier.iLight, false);
      }

      // JA2Gold:
      // if the player wants the merc to cast the fake light AND it is night
      if (pSoldier.bTeam != OUR_TEAM || gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT] && NightTime()) {
        if (pSoldier.bLevel > 0 && gpWorldLevelData[pSoldier.sGridNo].pRoofHead != null) {
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubShadeLevel = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pRoofHead).ubShadeLevel;
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubSumLights = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pRoofHead).ubSumLights;
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubMaxLights = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pRoofHead).ubMaxLights;
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubNaturalShadeLevel = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pRoofHead).ubNaturalShadeLevel;
        } else {
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubShadeLevel = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pLandHead).ubShadeLevel;
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubSumLights = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pLandHead).ubSumLights;
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubMaxLights = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pLandHead).ubMaxLights;
          (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubNaturalShadeLevel = (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pLandHead).ubNaturalShadeLevel;
        }
      }

      /// HandlePlacingRoofMarker( pSoldier, pSoldier->sGridNo, TRUE, FALSE );

      HandleAnimationProfile(pSoldier, pSoldier.usAnimState, false);

      HandleCrowShadowNewGridNo(pSoldier);
    }

    pSoldier.bOldOverTerrainType = pSoldier.bOverTerrainType;
    pSoldier.bOverTerrainType = GetTerrainType(pSoldier.sGridNo);

    // OK, check that our animation is up to date!
    // Check our water value

    if (!(pSoldier.uiStatusFlags & (SOLDIER_DRIVER | SOLDIER_PASSENGER))) {
      fInWaterValue = MercInWater(pSoldier);

      // ATE: If ever in water MAKE SURE WE WALK AFTERWOODS!
      if (fInWaterValue) {
        pSoldier.usUIMovementMode = Enum193.WALKING;
      }

      if (fInWaterValue != pSoldier.fPrevInWater) {
        // Update Animation data
        SetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

        // Update flag
        pSoldier.fPrevInWater = fInWaterValue;

        // Update sound...
        if (fInWaterValue) {
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ENTER_WATER_1, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
        } else {
          // ATE: Check if we are going from water to land - if so, resume
          // with regular movement mode...
          EVENT_InitNewSoldierAnim(pSoldier, pSoldier.usUIMovementMode, 0, false);
        }
      }

      // OK, If we were not in deep water but we are now, handle deep animations!
      if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER && pSoldier.bOldOverTerrainType != Enum315.DEEP_WATER) {
        // Based on our current animation, change!
        switch (pSoldier.usAnimState) {
          case Enum193.WALKING:
          case Enum193.RUNNING:

            // IN deep water, swim!

            // Make transition from low to deep
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.LOW_TO_DEEP_WATER, 0, false);
            pSoldier.usPendingAnimation = Enum193.DEEP_WATER_SWIM;

            PlayJA2Sample(Enum330.ENTER_DEEP_WATER_1, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
        }
      }

      // Damage water if in deep water....
      if (pSoldier.bOverTerrainType == Enum315.MED_WATER || pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
        WaterDamage(pSoldier);
      }

      // OK, If we were in deep water but we are NOT now, handle mid animations!
      if (pSoldier.bOverTerrainType != Enum315.DEEP_WATER && pSoldier.bOldOverTerrainType == Enum315.DEEP_WATER) {
        // Make transition from low to deep
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_TO_LOW_WATER, 0, false);
        pSoldier.usPendingAnimation = pSoldier.usUIMovementMode;
      }
    }

    // are we now standing in tear gas without a decently working gas mask?
    if (GetSmokeEffectOnTile(sNewGridNo, pSoldier.bLevel)) {
      let fSetGassed: boolean = true;

      // If we have a functioning gas mask...
      if (pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.GASMASK && pSoldier.inv[Enum261.HEAD1POS].bStatus[0] >= GASMASK_MIN_STATUS) {
        fSetGassed = false;
      }
      if (pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.GASMASK && pSoldier.inv[Enum261.HEAD2POS].bStatus[0] >= GASMASK_MIN_STATUS) {
        fSetGassed = false;
      }

      if (fSetGassed) {
        pSoldier.uiStatusFlags |= SOLDIER_GASSED;
      }
    }

    if (pSoldier.bTeam == gbPlayerNum && pSoldier.bStealthMode) {
      // Merc got to a new tile by "sneaking". Did we theoretically sneak
      // past an enemy?

      if (pSoldier.bOppCnt > 0) // opponents in sight
      {
        // check each possible enemy
        for (cnt = 0; cnt < MAX_NUM_SOLDIERS; cnt++) {
          pEnemy = MercPtrs[cnt];
          // if this guy is here and alive enough to be looking for us
          if (pEnemy.bActive && pEnemy.bInSector && (pEnemy.bLife >= OKLIFE)) {
            // no points for sneaking by the neutrals & friendlies!!!
            if (!pEnemy.bNeutral && (pSoldier.bSide != pEnemy.bSide) && (pEnemy.ubBodyType != Enum194.COW && pEnemy.ubBodyType != Enum194.CROW)) {
              // if we SEE this particular oppponent, and he DOESN'T see us... and he COULD see us...
              if ((pSoldier.bOppList[cnt] == SEEN_CURRENTLY) && pEnemy.bOppList[pSoldier.ubID] != SEEN_CURRENTLY && PythSpacesAway(pSoldier.sGridNo, pEnemy.sGridNo) < DistanceVisible(pEnemy, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, pSoldier.sGridNo, pSoldier.bLevel)) {
                // AGILITY (5):  Soldier snuck 1 square past unaware enemy
                StatChange(pSoldier, AGILAMT, 5, 0);
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
    let i: number = 0;
  }
}

export function EVENT_FireSoldierWeapon(pSoldier: SOLDIERTYPE, sTargetGridNo: INT16): void {
  let sTargetXPos: INT16;
  let sTargetYPos: INT16;
  let fDoFireRightAway: boolean = false;

  // CANNOT BE SAME GRIDNO!
  if (pSoldier.sGridNo == sTargetGridNo) {
    return;
  }

  if (pSoldier.ubID == 33) {
    let i: number = 0;
  }

  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting attack, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  //}

  // Set soldier's target gridno
  // This assignment was redundent because it's already set in
  // the actual event call
  pSoldier.sTargetGridNo = sTargetGridNo;
  // pSoldier->sLastTarget = sTargetGridNo;
  pSoldier.ubTargetID = WhoIsThere2(sTargetGridNo, pSoldier.bTargetLevel);

  if (Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass & IC_GUN) {
    if (pSoldier.bDoBurst) {
      // Set the TOTAL number of bullets to be fired
      // Can't shoot more bullets than we have in our magazine!
      pSoldier.bBulletsLeft = Math.min(Weapon[pSoldier.inv[pSoldier.ubAttackingHand].usItem].ubShotsPerBurst, pSoldier.inv[pSoldier.ubAttackingHand].ubGunShotsLeft);
    } else if (IsValidSecondHandShot(pSoldier)) {
      // two-pistol attack - two bullets!
      pSoldier.bBulletsLeft = 2;
    } else {
      pSoldier.bBulletsLeft = 1;
    }
    if (pSoldier.inv[pSoldier.ubAttackingHand].ubGunAmmoType == Enum286.AMMO_BUCKSHOT) {
      pSoldier.bBulletsLeft *= NUM_BUCKSHOT_PELLETS;
    }
  }
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting attack, bullets left %d", pSoldier.bBulletsLeft));

  // Convert our grid-not into an XY
  ({ sX: sTargetXPos, sY: sTargetYPos } = ConvertGridNoToXY(sTargetGridNo));

  // Change to fire animation
  // Ready weapon
  SoldierReadyWeapon(pSoldier, sTargetXPos, sTargetYPos, false);

  // IF WE ARE AN NPC, SLIDE VIEW TO SHOW WHO IS SHOOTING
  {
    // if ( pSoldier->fDoSpread )
    //{
    // If we are spreading burst, goto right away!
    // EVENT_InitNewSoldierAnim( pSoldier, SelectFireAnimation( pSoldier, gAnimControl[ pSoldier->usAnimState ].ubEndHeight ), 0, FALSE );

    //}

    // else
    {
      if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
        // Force our direction!
        EVENT_SetSoldierDirection(pSoldier, pSoldier.bDesiredDirection);
        EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight), 0, false);
      } else {
        // IF WE ARE IN REAl-TIME, FIRE IMMEDIATELY!
        if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
          // fDoFireRightAway = TRUE;
        }

        // Check if our weapon has no intermediate anim...
        switch (pSoldier.inv[Enum261.HANDPOS].usItem) {
          case Enum225.ROCKET_LAUNCHER:
          case Enum225.MORTAR:
          case Enum225.GLAUNCHER:

            fDoFireRightAway = true;
            break;
        }

        if (fDoFireRightAway) {
          // Set to true so we don't get toasted twice for APs..
          pSoldier.fDontUnsetLastTargetFromTurn = true;

          // Make sure we don't try and do fancy prone turning.....
          pSoldier.fTurningFromPronePosition = 0;

          // Force our direction!
          EVENT_SetSoldierDirection(pSoldier, pSoldier.bDesiredDirection);

          EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight), 0, false);
        } else {
          // Set flag indicating we are about to shoot once destination direction is hit
          pSoldier.fTurningToShoot = true;

          if (pSoldier.bTeam != gbPlayerNum && pSoldier.bVisible != -1) {
            LocateSoldier(pSoldier.ubID, DONTSETLOCATOR);
          }
        }
      }
    }
  }
}

// gAnimControl[ pSoldier->usAnimState ].ubEndHeight
//					ChangeSoldierState( pSoldier, SHOOT_RIFLE_STAND, 0 , FALSE );

function SelectFireAnimation(pSoldier: SOLDIERTYPE, ubHeight: UINT8): UINT16 {
  let sDist: INT16;
  let usItem: UINT16;
  let dTargetX: FLOAT;
  let dTargetY: FLOAT;
  let dTargetZ: FLOAT;
  let fDoLowShot: boolean = false;

  // Do different things if we are a monster
  if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
    switch (pSoldier.ubBodyType) {
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
    return true;
  }

  if (pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON) {
    if (pSoldier.bDoBurst > 0) {
      return Enum193.ROBOT_BURST_SHOOT;
    } else {
      return Enum193.ROBOT_SHOOT;
    }
  }

  // Check for rocket laucncher....
  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.ROCKET_LAUNCHER) {
    return Enum193.SHOOT_ROCKET;
  }

  // Check for rocket laucncher....
  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.MORTAR) {
    return Enum193.SHOOT_MORTAR;
  }

  // Check for tank cannon
  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.TANK_CANNON) {
    return Enum193.TANK_SHOOT;
  }

  if (pSoldier.ubBodyType == Enum194.TANK_NW || pSoldier.ubBodyType == Enum194.TANK_NE) {
    return Enum193.TANK_BURST;
  }

  // Determine which animation to do...depending on stance and gun in hand...
  switch (ubHeight) {
    case ANIM_STAND:

      usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

      // CHECK 2ND HAND!
      if (IsValidSecondHandShot(pSoldier)) {
        // Increment the number of people busy doing stuff because of an attack
        // gTacticalStatus.ubAttackBusyCount++;
        // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack with 2 guns, attack count now %d", gTacticalStatus.ubAttackBusyCount) );

        return Enum193.SHOOT_DUAL_STAND;
      } else {
        // OK, while standing check distance away from target, and shoot low if we should!
        sDist = PythSpacesAway(pSoldier.sGridNo, pSoldier.sTargetGridNo);

        // ATE: OK, SEE WERE WE ARE TARGETING....
        GetTargetWorldPositions(pSoldier, pSoldier.sTargetGridNo, addressof(dTargetX), addressof(dTargetY), addressof(dTargetZ));

        // CalculateSoldierZPos( pSoldier, FIRING_POS, &dFirerZ );

        if (sDist <= 2 && dTargetZ <= 100) {
          fDoLowShot = true;
        }

        // ATE: Made distence away long for psitols such that they never use this....
        // if ( !(Item[ usItem ].fFlags & ITEM_TWO_HANDED) )
        //{
        //	fDoLowShot = FALSE;
        //}

        // Don't do any low shots if in water
        if (MercInWater(pSoldier)) {
          fDoLowShot = false;
        }

        if (pSoldier.bDoBurst > 0) {
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

      if (pSoldier.bDoBurst > 0) {
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
        if (pSoldier.bDoBurst > 0) {
          //				pSoldier->fBurstCompleted = FALSE;
          return Enum193.CROUCHED_BURST;
        } else {
          return Enum193.SHOOT_RIFLE_CROUCH;
        }
      }
      break;

    default:
      AssertMsg(false, FormatString("SelectFireAnimation: ERROR - Invalid height %d", ubHeight));
      break;
  }

  // If here, an internal error has occured!
  Assert(false);
  return 0;
}

export function GetMoveStateBasedOnStance(pSoldier: SOLDIERTYPE, ubStanceHeight: UINT8): UINT16 {
  // Determine which animation to do...depending on stance and gun in hand...
  switch (ubStanceHeight) {
    case ANIM_STAND:
      if (pSoldier.fUIMovementFast && !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
        return Enum193.RUNNING;
      } else {
        return Enum193.WALKING;
      }
      break;

    case ANIM_PRONE:
      if (pSoldier.fUIMovementFast) {
        return Enum193.CRAWLING;
      } else {
        return Enum193.CRAWLING;
      }
      break;

    case ANIM_CROUCH:
      if (pSoldier.fUIMovementFast) {
        return Enum193.SWATTING;
      } else {
        return Enum193.SWATTING;
      }
      break;

    default:
      AssertMsg(false, FormatString("GetMoveStateBasedOnStance: ERROR - Invalid height %d", ubStanceHeight));
      break;
  }

  // If here, an internal error has occured!
  Assert(false);
  return 0;
}

function SelectFallAnimation(pSoldier: SOLDIERTYPE): void {
  // Determine which animation to do...depending on stance and gun in hand...
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.FLYBACK_HIT, 0, false);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.FLYBACK_HIT, 0, false);
      break;
  }
}

export function SoldierReadyWeapon(pSoldier: SOLDIERTYPE, sTargetXPos: INT16, sTargetYPos: INT16, fEndReady: boolean): boolean {
  let sFacingDir: INT16;

  sFacingDir = GetDirectionFromXY(sTargetXPos, sTargetYPos, pSoldier);

  return InternalSoldierReadyWeapon(pSoldier, sFacingDir, fEndReady);
}

export function InternalSoldierReadyWeapon(pSoldier: SOLDIERTYPE, sFacingDir: UINT8, fEndReady: boolean): boolean {
  let usAnimState: UINT16;
  let fReturnVal: boolean = false;

  // Handle monsters differently
  if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
    if (!fEndReady) {
      EVENT_SetSoldierDesiredDirection(pSoldier, sFacingDir);
    }
    return false;
  }

  usAnimState = PickSoldierReadyAnimation(pSoldier, fEndReady);

  if (usAnimState != INVALID_ANIMATION) {
    EVENT_InitNewSoldierAnim(pSoldier, usAnimState, 0, false);
    fReturnVal = true;
  }

  if (!fEndReady) {
    // Ready direction for new facing direction
    if (usAnimState == INVALID_ANIMATION) {
      usAnimState = pSoldier.usAnimState;
    }

    EVENT_InternalSetSoldierDesiredDirection(pSoldier, sFacingDir, false, usAnimState);

    // Check if facing dir is different from ours and change direction if so!
    // if ( sFacingDir != pSoldier->bDirection )
    //{
    //	DeductPoints( pSoldier, AP_CHANGE_FACING, 0 );
    //}//
  }

  return fReturnVal;
}

export function PickSoldierReadyAnimation(pSoldier: SOLDIERTYPE, fEndReady: boolean): UINT16 {
  // Invalid animation if nothing in our hands
  if (pSoldier.inv[Enum261.HANDPOS].usItem == NOTHING) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON) {
    return INVALID_ANIMATION;
  }

  // Check if we have a gun.....
  if (Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass != IC_GUN && pSoldier.inv[Enum261.HANDPOS].usItem != Enum225.GLAUNCHER) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.ROCKET_LAUNCHER) {
    return INVALID_ANIMATION;
  }

  if (pSoldier.ubBodyType == Enum194.TANK_NW || pSoldier.ubBodyType == Enum194.TANK_NE) {
    return INVALID_ANIMATION;
  }

  if (fEndReady) {
    // IF our gun is already drawn, do not change animation, just direction
    if (gAnimControl[pSoldier.usAnimState].uiFlags & (ANIM_FIREREADY | ANIM_FIRE)) {
      switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
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
    if (!(gAnimControl[pSoldier.usAnimState].uiFlags & (ANIM_FIREREADY | ANIM_FIRE))) {
      {
        switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
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
export function EVENT_SoldierGotHit(pSoldier: SOLDIERTYPE, usWeaponIndex: UINT16, sDamage: INT16, sBreathLoss: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8, sSubsequent: INT16, sLocationGrid: INT16): void {
  let ubCombinedLoss: UINT8;
  let ubVolume: UINT8;
  let ubReason: UINT8;
  let pNewSoldier: SOLDIERTYPE | null;

  ubReason = 0;

  // ATE: If we have gotten hit, but are still in our attack animation, reduce count!
  switch (pSoldier.usAnimState) {
    case Enum193.SHOOT_ROCKET:
    case Enum193.SHOOT_MORTAR:
    case Enum193.THROW_ITEM:
    case Enum193.LOB_ITEM:

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Freeing up attacker - ATTACK ANIMATION %s ENDED BY HIT ANIMATION, Now %d", gAnimControl[pSoldier.usAnimState].zAnimStr, gTacticalStatus.ubAttackBusyCount));
      ReduceAttackBusyCount(pSoldier.ubID, false);
      break;
  }

  // DO STUFF COMMON FOR ALL TYPES
  if (ubAttackerID != NOBODY) {
    MercPtrs[ubAttackerID].bLastAttackHit = true;
  }

  // Set attacker's ID
  pSoldier.ubAttackerID = ubAttackerID;

  if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    // Increment  being attacked count
    pSoldier.bBeingAttackedCount++;
  }

  // if defender is a vehicle, there will be no hit animation played!
  if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    // Increment the number of people busy doing stuff because of an attack (busy doing hit anim!)
    gTacticalStatus.ubAttackBusyCount++;
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Person got hit, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  }

  // ATE; Save hit location info...( for later anim determination stuff )
  pSoldier.ubHitLocation = ubHitLocation;

  // handle morale for heavy damage attacks
  if (sDamage > 25) {
    if (pSoldier.ubAttackerID != NOBODY && MercPtrs[pSoldier.ubAttackerID].bTeam == gbPlayerNum) {
      HandleMoraleEvent(MercPtrs[pSoldier.ubAttackerID], Enum234.MORALE_DID_LOTS_OF_DAMAGE, MercPtrs[pSoldier.ubAttackerID].sSectorX, MercPtrs[pSoldier.ubAttackerID].sSectorY, MercPtrs[pSoldier.ubAttackerID].bSectorZ);
    }
    if (pSoldier.bTeam == gbPlayerNum) {
      HandleMoraleEvent(pSoldier, Enum234.MORALE_TOOK_LOTS_OF_DAMAGE, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
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
      pSoldier.bSleepDrugCounter = 10;

      uiChance = SleepDartSuccumbChance(pSoldier);

      if (PreRandom(100) < uiChance) {
        // succumb to the drug!
        sBreathLoss = (pSoldier.bBreathMax * 100);
      }
    } else if (ubSpecial == FIRE_WEAPON_BLINDED_BY_SPIT_SPECIAL) {
      // blinded!!
      if ((pSoldier.bBlindedCounter == 0)) {
        // say quote
        if (pSoldier.uiStatusFlags & SOLDIER_PC) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BLINDED);
        }
        DecayIndividualOpplist(pSoldier);
      }
      // will always increase counter by at least 1
      pSoldier.bBlindedCounter += (sDamage / 8) + 1;

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
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Soldier Control: Weapon class not handled in SoldierGotHit( ) %d", usWeaponIndex));
  }

  // CJC: moved to after SoldierTakeDamage so that any quotes from the defender
  // will not be said if they are knocked out or killed
  if (ubReason != TAKE_DAMAGE_TENTACLES && ubReason != TAKE_DAMAGE_OBJECT) {
    // OK, OK: THis is hairy, however, it's ness. because the normal freeup call uses the
    // attckers intended target, and here we want to use thier actual target....

    // ATE: If it's from GUNFIRE damage, keep in mind bullets...
    if (Item[usWeaponIndex].usItemClass & IC_GUN) {
      pNewSoldier = FreeUpAttackerGivenTarget(pSoldier.ubAttackerID, pSoldier.ubID);
    } else {
      pNewSoldier = ReduceAttackBusyGivenTarget(pSoldier.ubAttackerID, pSoldier.ubID);
    }

    if (pNewSoldier != null) {
      pSoldier = pNewSoldier;
    }
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Tried to free up attacker, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  }

  // OK, If we are a vehicle.... damage vehicle...( people inside... )
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    SoldierTakeDamage(pSoldier, ANIM_CROUCH, sDamage, sBreathLoss, ubReason, pSoldier.ubAttackerID, NOWHERE, false, true);
    return;
  }

  // DEDUCT LIFE
  ubCombinedLoss = SoldierTakeDamage(pSoldier, ANIM_CROUCH, sDamage, sBreathLoss, ubReason, pSoldier.ubAttackerID, NOWHERE, false, true);

  // ATE: OK, Let's check our ASSIGNMENT state,
  // If anything other than on a squad or guard, make them guard....
  if (pSoldier.bTeam == gbPlayerNum) {
    if (pSoldier.bAssignment >= Enum117.ON_DUTY && pSoldier.bAssignment != Enum117.ASSIGNMENT_POW) {
      if (pSoldier.fMercAsleep) {
        pSoldier.fMercAsleep = false;
        pSoldier.fForcedToStayAwake = false;

        // refresh map screen
        fCharacterInfoPanelDirty = true;
        fTeamPanelDirty = true;
      }

      AddCharacterToAnySquad(pSoldier);
    }
  }

  // SCREAM!!!!
  ubVolume = CalcScreamVolume(pSoldier, ubCombinedLoss);

  // IF WE ARE AT A HIT_STOP ANIMATION
  // DO APPROPRIATE HITWHILE DOWN ANIMATION
  if (!(gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_HITSTOP) || pSoldier.usAnimState != Enum193.JFK_HITDEATH_STOP) {
    MakeNoise(pSoldier.ubID, pSoldier.sGridNo, pSoldier.bLevel, pSoldier.bOverTerrainType, ubVolume, Enum236.NOISE_SCREAM);
  }

  // IAN ADDED THIS SAT JUNE 14th : HAVE TO SHOW VICTIM!
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT) && pSoldier.bVisible != -1 && pSoldier.bTeam == gbPlayerNum)
    LocateSoldier(pSoldier.ubID, DONTSETLOCATOR);

  if (Item[usWeaponIndex].usItemClass & IC_BLADE) {
    PlayJA2Sample((Enum330.KNIFE_IMPACT), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
  } else {
    PlayJA2Sample((Enum330.BULLET_IMPACT_1 + Random(3)), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
  }

  // PLAY RANDOM GETTING HIT SOUND
  // ONLY IF WE ARE CONSCIOUS!
  if (pSoldier.bLife >= CONSCIOUSNESS) {
    if (pSoldier.ubBodyType == Enum194.CROW) {
      // Exploding crow...
      PlayJA2Sample(Enum330.CROW_EXPLODE_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
    } else {
      // ATE: This is to disallow large amounts of smaples being played which is load!
      if (pSoldier.fGettingHit && pSoldier.usAniCode != Enum193.STANDING_BURST_HIT) {
      } else {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));
      }
    }
  }

  // CHECK FOR DOING HIT WHILE DOWN
  if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_HITSTOP)) {
    switch (pSoldier.usAnimState) {
      case Enum193.FLYBACKHIT_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLBACK_DEATHTWICH, 0, false);
        break;

      case Enum193.STAND_FALLFORWARD_STOP:
        ChangeSoldierState(pSoldier, Enum193.GENERIC_HIT_DEATHTWITCHNB, 0, false);
        break;

      case Enum193.JFK_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.JFK_HITDEATH_TWITCHB, 0, false);
        break;

      case Enum193.FALLBACKHIT_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLBACK_HIT_DEATHTWITCHNB, 0, false);
        break;

      case Enum193.PRONE_LAYFROMHIT_STOP:
        ChangeSoldierState(pSoldier, Enum193.PRONE_HIT_DEATHTWITCHNB, 0, false);
        break;

      case Enum193.PRONE_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.PRONE_HIT_DEATHTWITCHB, 0, false);
        break;

      case Enum193.FALLFORWARD_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.GENERIC_HIT_DEATHTWITCHB, 0, false);
        break;

      case Enum193.FALLBACK_HITDEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLBACK_HIT_DEATHTWITCHB, 0, false);
        break;

      case Enum193.FALLOFF_DEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_TWITCHB, 0, false);
        break;

      case Enum193.FALLOFF_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_TWITCHNB, 0, false);
        break;

      case Enum193.FALLOFF_FORWARD_DEATH_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_TWITCHB, 0, false);
        break;

      case Enum193.FALLOFF_FORWARD_STOP:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_TWITCHNB, 0, false);
        break;

      default:
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Soldier Control: Death state %d has no death hit", pSoldier.usAnimState));
    }
    return;
  }

  // Set goback to aim after hit flag!
  // Only if we were aiming!
  if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_FIREREADY) {
    pSoldier.fGoBackToAimAfterHit = true;
  }

  // IF COWERING, PLAY SPECIFIC GENERIC HIT STAND...
  if (pSoldier.uiStatusFlags & SOLDIER_COWERING) {
    if (pSoldier.bLife == 0 || IS_MERC_BODY_TYPE(pSoldier)) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, false);
    } else {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CIV_COWER_HIT, 0, false);
    }
    return;
  }

  // Change based on body type
  switch (pSoldier.ubBodyType) {
    case Enum194.COW:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.COW_HIT, 0, false);
      return;
      break;

    case Enum194.BLOODCAT:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.BLOODCAT_HIT, 0, false);
      return;
      break;

    case Enum194.ADULTFEMALEMONSTER:
    case Enum194.AM_MONSTER:
    case Enum194.YAF_MONSTER:
    case Enum194.YAM_MONSTER:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADULTMONSTER_HIT, 0, false);
      return;
      break;

    case Enum194.LARVAE_MONSTER:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.LARVAE_HIT, 0, false);
      return;
      break;

    case Enum194.QUEENMONSTER:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_HIT, 0, false);
      return;
      break;

    case Enum194.CRIPPLECIV:

    {
      // OK, do some code here to allow the fact that poor buddy can be thrown back if it's a big enough hit...
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRIPPLE_HIT, 0, false);

      // pSoldier->bLife = 0;
      // EVENT_InitNewSoldierAnim( pSoldier, CRIPPLE_DIE_FLYBACK, 0 , FALSE );
    }
      return;
      break;

    case Enum194.ROBOTNOWEAPON:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.ROBOTNW_HIT, 0, false);
      return;
      break;

    case Enum194.INFANT_MONSTER:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.INFANT_HIT, 0, false);
      return;

    case Enum194.CROW:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROW_DIE, 0, false);
      return;

    // case FATCIV:
    case Enum194.MANCIV:
    case Enum194.MINICIV:
    case Enum194.DRESSCIV:
    case Enum194.HATKIDCIV:
    case Enum194.KIDCIV:

      // OK, if life is 0 and not set as dead ( this is a death hit... )
      if (!(pSoldier.uiStatusFlags & SOLDIER_DEAD) && pSoldier.bLife == 0) {
        // Randomize death!
        if (Random(2)) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CIV_DIE2, 0, false);
          return;
        }
      }

      // IF here, go generic hit ALWAYS.....
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, false);
      return;
      break;
  }

  // If here, we are a merc, check if we are in water
  if (pSoldier.bOverTerrainType == Enum315.LOW_WATER) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.WATER_HIT, 0, false);
    return;
  }
  if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_WATER_HIT, 0, false);
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

function CalcScreamVolume(pSoldier: SOLDIERTYPE, ubCombinedLoss: UINT8): UINT8 {
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

function DoGenericHit(pSoldier: SOLDIERTYPE, ubSpecial: UINT8, bDirection: INT16): void {
  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      // For now, check if we are affected by a burst
      // For now, if the weapon was a gun, special 1 == burst
      // ATE: Only do this for mercs!
      if (ubSpecial == FIRE_WEAPON_BURST_SPECIAL && pSoldier.ubBodyType <= Enum194.REGFEMALE) {
        // SetSoldierDesiredDirection( pSoldier, bDirection );
        EVENT_SetSoldierDirection(pSoldier, bDirection);
        EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);

        EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING_BURST_HIT, 0, false);
      } else {
        // Check in hand for rifle
        if (SoldierCarriesTwoHandedWeapon(pSoldier)) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.RIFLE_STAND_HIT, 0, false);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, false);
        }
      }
      break;

    case ANIM_PRONE:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_PRONE, 0, false);
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_CROUCH, 0, false);
      break;
  }
}

function SoldierGotHitGunFire(pSoldier: SOLDIERTYPE, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  let usNewGridNo: UINT16;
  let fBlownAway: boolean = false;
  let fHeadHit: boolean = false;
  let fFallenOver: boolean = false;

  // MAYBE CHANGE TO SPECIAL ANIMATION BASED ON VALUE SET BY DAMAGE CALCULATION CODE
  // ALL THESE ONLY WORK ON STANDING PEOPLE
  if (!(pSoldier.uiStatusFlags & SOLDIER_MONSTER) && gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_STAND) {
    if (gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_STAND) {
      if (ubSpecial == FIRE_WEAPON_HEAD_EXPLODE_SPECIAL) {
        if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
          if (SpacesAway(pSoldier.sGridNo, Menptr[ubAttackerID].sGridNo) <= MAX_DISTANCE_FOR_MESSY_DEATH) {
            usNewGridNo = NewGridNo(pSoldier.sGridNo, (DirectionInc(pSoldier.bDirection)));

            // CHECK OK DESTINATION!
            if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.bLevel, pSoldier.bDirection, Enum193.JFK_HITDEATH)) {
              usNewGridNo = NewGridNo(usNewGridNo, (DirectionInc(pSoldier.bDirection)));

              if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.bLevel, pSoldier.bDirection, pSoldier.usAnimState)) {
                fHeadHit = true;
              }
            }
          }
        }
      } else if (ubSpecial == FIRE_WEAPON_CHEST_EXPLODE_SPECIAL) {
        if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
          if (SpacesAway(pSoldier.sGridNo, Menptr[ubAttackerID].sGridNo) <= MAX_DISTANCE_FOR_MESSY_DEATH) {
            // possibly play torso explosion anim!
            if (pSoldier.bDirection == bDirection) {
              usNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(gOppositeDirection[pSoldier.bDirection]));

              if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.bLevel, gOppositeDirection[bDirection], Enum193.FLYBACK_HIT)) {
                usNewGridNo = NewGridNo(usNewGridNo, DirectionInc(gOppositeDirection[bDirection]));

                if (OKFallDirection(pSoldier, usNewGridNo, pSoldier.bLevel, gOppositeDirection[bDirection], pSoldier.usAnimState)) {
                  fBlownAway = true;
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
          if (gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_STAND && !MercInWater(pSoldier)) {
            fFallenOver = true;
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[20], pSoldier.name);
          }
        }
      }
    }
  }

  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.uiStatusFlags & SOLDIER_DEAD) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker,Dead soldier hit"));
    ReleaseSoldiersAttacker(pSoldier);
    return;
  }

  if (fFallenOver) {
    SoldierCollapse(pSoldier);
    return;
  }

  if (fBlownAway) {
    // Only for mercs...
    if (pSoldier.ubBodyType < 4) {
      ChangeToFlybackAnimation(pSoldier, bDirection);
      return;
    }
  }

  if (fHeadHit) {
    // Only for mercs ( or KIDS! )
    if (pSoldier.ubBodyType < 4 || pSoldier.ubBodyType == Enum194.HATKIDCIV || pSoldier.ubBodyType == Enum194.KIDCIV) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.JFK_HITDEATH, 0, false);
      return;
    }
  }

  DoGenericHit(pSoldier, ubSpecial, bDirection);
}

function SoldierGotHitExplosion(pSoldier: SOLDIERTYPE, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  let sNewGridNo: INT16;

  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.uiStatusFlags & SOLDIER_DEAD) {
    return;
  }

  // check for services
  ReceivingSoldierCancelServices(pSoldier);
  GivingSoldierCancelServices(pSoldier);

  if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
    if (Explosive[Item[usWeaponIndex].ubClassIndex].ubRadius >= 3 && pSoldier.bLife == 0 && gAnimControl[pSoldier.usAnimState].ubEndHeight != ANIM_PRONE) {
      if (sRange >= 2 && sRange <= 4) {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));

        EVENT_InitNewSoldierAnim(pSoldier, Enum193.CHARIOTS_OF_FIRE, 0, false);
        return;
      } else if (sRange <= 1) {
        DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));

        EVENT_InitNewSoldierAnim(pSoldier, Enum193.BODYEXPLODING, 0, false);
        return;
      }
    }
  }

  // If we can't fal back or such, so generic hit...
  if (pSoldier.ubBodyType >= 4) {
    DoGenericHit(pSoldier, 0, bDirection);
    return;
  }

  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:
    case ANIM_CROUCH:

      EVENT_SetSoldierDirection(pSoldier, bDirection);
      EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);

      // Check behind us!
      sNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(gOppositeDirection[bDirection]));

      if (OKFallDirection(pSoldier, sNewGridNo, pSoldier.bLevel, gOppositeDirection[bDirection], Enum193.FLYBACK_HIT)) {
        ChangeToFallbackAnimation(pSoldier, bDirection);
      } else {
        if (gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_STAND) {
          BeginTyingToFall(pSoldier);
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_STAND, 0, false);
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

function SoldierGotHitBlade(pSoldier: SOLDIERTYPE, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.uiStatusFlags & SOLDIER_DEAD) {
    return;
  }

  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      // Check in hand for rifle
      if (SoldierCarriesTwoHandedWeapon(pSoldier)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.RIFLE_STAND_HIT, 0, false);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, false);
      }
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_CROUCH, 0, false);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_PRONE, 0, false);
      break;
  }
}

function SoldierGotHitPunch(pSoldier: SOLDIERTYPE, usWeaponIndex: UINT16, sDamage: INT16, bDirection: UINT16, sRange: UINT16, ubAttackerID: UINT8, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  // IF HERE AND GUY IS DEAD, RETURN!
  if (pSoldier.uiStatusFlags & SOLDIER_DEAD) {
    return;
  }

  // Based on stance, select generic hit animation
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      // Check in hand for rifle
      if (SoldierCarriesTwoHandedWeapon(pSoldier)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.RIFLE_STAND_HIT, 0, false);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_STAND, 0, false);
      }
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_CROUCH, 0, false);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GENERIC_HIT_PRONE, 0, false);
      break;
  }
}

export function EVENT_InternalGetNewSoldierPath(pSoldier: SOLDIERTYPE, sDestGridNo: UINT16, usMovementAnim: UINT16, fFromUI: UINT8 /* boolean */, fForceRestartAnim: boolean): boolean {
  let iDest: INT32;
  let sNewGridNo: INT16;
  let fContinue: boolean;
  let uiDist: UINT32;
  let usAnimState: UINT16;
  let usMoveAnimState: UINT16 = usMovementAnim;
  let sMercGridNo: INT16;
  let usPathingData: UINT16[] /* [MAX_PATH_LIST_SIZE] */;
  let ubPathingMaxDirection: UINT8;
  let fAdvancePath: boolean = true;
  let fFlags: UINT8 = 0;

  // Ifd this code, make true if a player
  if (fFromUI == 3) {
    if (pSoldier.bTeam == gbPlayerNum) {
      fFromUI = 1;
    } else {
      fFromUI = 0;
    }
  }

  // ATE: if a civ, and from UI, and were cowering, remove from cowering
  if (AM_AN_EPC(pSoldier) && fFromUI) {
    if (pSoldier.uiStatusFlags & SOLDIER_COWERING) {
      SetSoldierCowerState(pSoldier, false);
      usMoveAnimState = Enum193.WALKING;
    }
  }

  pSoldier.bGoodContPath = false;

  if (pSoldier.fDelayedMovement) {
    if (pSoldier.ubDelayedMovementFlags & DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE) {
      fFlags = PATH_THROUGH_PEOPLE;
    } else {
      fFlags = PATH_IGNORE_PERSON_AT_DEST;
    }
    pSoldier.fDelayedMovement = false;
  }

  if (gfGetNewPathThroughPeople) {
    fFlags = PATH_THROUGH_PEOPLE;
  }

  // ATE: Some stuff here for realtime, going through interface....
  if ((!(gTacticalStatus.uiFlags & INCOMBAT) && (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) && fFromUI == 1) || fFromUI == 2) {
    if (pSoldier.bCollapsed) {
      return false;
    }

    sMercGridNo = pSoldier.sGridNo;
    pSoldier.sGridNo = pSoldier.sDestination;

    // Check if path is good before copying it into guy's path...
    if (FindBestPath(pSoldier, sDestGridNo, pSoldier.bLevel, pSoldier.usUIMovementMode, NO_COPYROUTE, fFlags) == 0) {
      // Set to old....
      pSoldier.sGridNo = sMercGridNo;

      return false;
    }

    uiDist = FindBestPath(pSoldier, sDestGridNo, pSoldier.bLevel, pSoldier.usUIMovementMode, COPYROUTE, fFlags);

    pSoldier.sGridNo = sMercGridNo;
    pSoldier.sFinalDestination = sDestGridNo;

    if (uiDist > 0) {
      // Add one to path data size....
      if (fAdvancePath) {
        memcpy(usPathingData, pSoldier.usPathingData, sizeof(usPathingData));
        ubPathingMaxDirection = usPathingData[MAX_PATH_LIST_SIZE - 1];
        memcpy(addressof(pSoldier.usPathingData[1]), usPathingData, sizeof(usPathingData) - sizeof(UINT16));

        // If we have reach the max, go back one sFinalDest....
        if (pSoldier.usPathDataSize == MAX_PATH_LIST_SIZE) {
          // pSoldier->sFinalDestination = NewGridNo( (UINT16)pSoldier->sFinalDestination, DirectionInc( gOppositeDirection[ ubPathingMaxDirection ] ) );
        } else {
          pSoldier.usPathDataSize++;
        }
      }

      usMoveAnimState = pSoldier.usUIMovementMode;

      if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
        usMoveAnimState = Enum193.DEEP_WATER_SWIM;
      }

      // Change animation only.... set value to NOT call any goto new gridno stuff.....
      if (usMoveAnimState != pSoldier.usAnimState) {
        //
        pSoldier.usDontUpdateNewGridNoOnMoveAnimChange = 1;

        EVENT_InitNewSoldierAnim(pSoldier, usMoveAnimState, 0, false);
      }

      return true;
    }

    return false;
  }

  // we can use the soldier's level here because we don't have pathing across levels right now...
  if (pSoldier.bPathStored) {
    fContinue = true;
  } else {
    iDest = FindBestPath(pSoldier, sDestGridNo, pSoldier.bLevel, usMovementAnim, COPYROUTE, fFlags);
    fContinue = (iDest != 0);
  }

  // Only if we can get a path here
  if (fContinue) {
    // Debug messages
    DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Soldier %d: Get new path", pSoldier.ubID));

    // Set final destination
    pSoldier.sFinalDestination = sDestGridNo;
    pSoldier.fPastXDest = false;
    pSoldier.fPastYDest = false;

    // CHECK IF FIRST TILE IS FREE
    sNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(pSoldier.usPathingData[pSoldier.usPathIndex]));

    // If true, we're OK, if not, WAIT for a guy to pass!
    // If we are in deep water, we can only swim!
    if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
      usMoveAnimState = Enum193.DEEP_WATER_SWIM;
    }

    // If we were aiming, end aim!
    usAnimState = PickSoldierReadyAnimation(pSoldier, true);

    // Add a pending animation first!
    // Only if we were standing!
    if (usAnimState != INVALID_ANIMATION && gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_STAND) {
      EVENT_InitNewSoldierAnim(pSoldier, usAnimState, 0, false);
      pSoldier.usPendingAnimation = usMoveAnimState;
    } else {
      // Call local copy for change soldier state!
      EVENT_InitNewSoldierAnim(pSoldier, usMoveAnimState, 0, fForceRestartAnim);
    }

    // Change desired direction
    // ATE: Here we have a situation where in RT, we may have
    // gotten a new path, but we are alreayd moving.. so
    // at leasty change new dest. This will be redundent if the ANI is a totaly new one

    return true;
  }

  return false;
}

export function EVENT_GetNewSoldierPath(pSoldier: SOLDIERTYPE, sDestGridNo: UINT16, usMovementAnim: UINT16): void {
  // ATE: Default restart of animation to TRUE
  EVENT_InternalGetNewSoldierPath(pSoldier, sDestGridNo, usMovementAnim, false, true);
}

// Change our state based on stance, to stop!
export function StopSoldier(pSoldier: SOLDIERTYPE): void {
  ReceivingSoldierCancelServices(pSoldier);
  GivingSoldierCancelServices(pSoldier);

  if (!(gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY)) {
    // SoldierGotoStationaryStance( pSoldier );
    EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
  }

  // Set desination
  pSoldier.sFinalDestination = pSoldier.sGridNo;
}

export function SoldierGotoStationaryStance(pSoldier: SOLDIERTYPE): void {
  // ATE: This is to turn off fast movement, that us used to change movement mode
  // for ui display on stance changes....
  if (pSoldier.bTeam == gbPlayerNum) {
    // pSoldier->fUIMovementFast = FALSE;
  }

  // The queen, if she sees anybody, goes to ready, not normal breath....
  if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
    if (pSoldier.bOppCnt > 0 || pSoldier.bTeam == gbPlayerNum) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_READY, 0, true);
      return;
    }
  }

  // Check if we are in deep water!
  if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
    // IN deep water, tred!
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_WATER_TRED, 0, false);
  } else if (pSoldier.ubServicePartner != NOBODY && pSoldier.bLife >= OKLIFE && pSoldier.bBreath > 0) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.GIVING_AID, 0, false);
  } else {
    // Change state back to stationary state for given height
    switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
      case ANIM_STAND:

        // If we are cowering....goto cower state
        if (pSoldier.uiStatusFlags & SOLDIER_COWERING) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.START_COWER, 0, false);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, false);
        }
        break;

      case ANIM_CROUCH:

        // If we are cowering....goto cower state
        if (pSoldier.uiStatusFlags & SOLDIER_COWERING) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.COWERING, 0, false);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCHING, 0, false);
        }
        break;

      case ANIM_PRONE:
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.PRONE, 0, false);
        break;
    }
  }
}

export function ChangeSoldierStance(pSoldier: SOLDIERTYPE, ubDesiredStance: UINT8): void {
  let usNewState: UINT16;

  // Check if they are the same!
  if (ubDesiredStance == gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    // Free up from stance change
    FreeUpNPCFromStanceChange(pSoldier);
    return;
  }

  // Set UI Busy
  SetUIBusy(pSoldier.ubID);

  // ATE: If we are an NPC, cower....
  if (pSoldier.ubBodyType >= Enum194.FATCIV && pSoldier.ubBodyType <= Enum194.KIDCIV) {
    if (ubDesiredStance == ANIM_STAND) {
      SetSoldierCowerState(pSoldier, false);
    } else {
      SetSoldierCowerState(pSoldier, true);
    }
  } else {
    usNewState = GetNewSoldierStateFromNewStance(pSoldier, ubDesiredStance);

    // Set desired stance
    pSoldier.ubDesiredHeight = ubDesiredStance;

    // Now change to appropriate animation
    EVENT_InitNewSoldierAnim(pSoldier, usNewState, 0, false);
  }
}

export function EVENT_InternalSetSoldierDestination(pSoldier: SOLDIERTYPE, usNewDirection: UINT16, fFromMove: boolean, usAnimState: UINT16): void {
  let usNewGridNo: UINT16;
  let sXPos: INT16;
  let sYPos: INT16;

  // Get dest gridno, convert to center coords
  usNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(usNewDirection));

  ConvertMapPosToWorldTileCenter(usNewGridNo, addressof(sXPos), addressof(sYPos));

  // Save new dest gridno, x, y
  pSoldier.sDestination = usNewGridNo;
  pSoldier.sDestXPos = sXPos;
  pSoldier.sDestYPos = sYPos;

  pSoldier.bMovementDirection = usNewDirection;

  // OK, ATE: If we are side_stepping, calculate a NEW desired direction....
  if (pSoldier.bReverse && usAnimState == Enum193.SIDE_STEP) {
    let ubPerpDirection: UINT8;

    // Get a new desired direction,
    ubPerpDirection = gPurpendicularDirection[pSoldier.bDirection][usNewDirection];

    // CHange actual and desired direction....
    EVENT_SetSoldierDirection(pSoldier, ubPerpDirection);
    pSoldier.bDesiredDirection = pSoldier.bDirection;
  } else {
    if (!(gAnimControl[usAnimState].uiFlags & ANIM_SPECIALMOVE)) {
      EVENT_InternalSetSoldierDesiredDirection(pSoldier, usNewDirection, fFromMove, usAnimState);
    }
  }
}

export function EVENT_SetSoldierDestination(pSoldier: SOLDIERTYPE, usNewDirection: UINT16): void {
  EVENT_InternalSetSoldierDestination(pSoldier, usNewDirection, false, pSoldier.usAnimState);
}

// function to determine which direction a creature can turn in
function MultiTiledTurnDirection(pSoldier: SOLDIERTYPE, bStartDirection: INT8, bDesiredDirection: INT8): INT8 {
  let bTurningIncrement: INT8;
  let bCurrentDirection: INT8;
  let bLoop: INT8;
  let usStructureID: UINT16;
  let usAnimSurface: UINT16;
  let pStructureFileRef: STRUCTURE_FILE_REF | null;
  let fOk: boolean = false;

  // start by trying to turn in quickest direction
  bTurningIncrement = QuickestDirection(bStartDirection, bDesiredDirection);

  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, pSoldier.usUIMovementMode);

  pStructureFileRef = GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, pSoldier.usUIMovementMode);
  if (!pStructureFileRef) {
    // without structure data, well, assume quickest direction
    return bTurningIncrement;
  }

  // ATE: Only if we have a levelnode...
  if (pSoldier.pLevelNode != null && pSoldier.pLevelNode.pStructureData != null) {
    usStructureID = pSoldier.pLevelNode.pStructureData.usStructureID;
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
      fOk = OkayToAddStructureToWorld(pSoldier.sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[bCurrentDirection]], usStructureID);
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

export function EVENT_InternalSetSoldierDesiredDirection(pSoldier: SOLDIERTYPE, usNewDirection: UINT16, fInitalMove: boolean, usAnimState: UINT16): void {
  // if ( usAnimState == WALK_BACKWARDS )
  if (pSoldier.bReverse && usAnimState != Enum193.SIDE_STEP) {
    // OK, check if we are going to go in the exact opposite than our facing....
    usNewDirection = gOppositeDirection[usNewDirection];
  }

  pSoldier.bDesiredDirection = usNewDirection;

  // If we are prone, goto crouched first!
  // ONly if we are stationary, and only if directions are differnet!

  // ATE: If we are fNoAPsToFinnishMove, stop what we were doing and
  // reset flag.....
  if (pSoldier.fNoAPToFinishMove && (gAnimControl[usAnimState].uiFlags & ANIM_MOVING)) {
    // ATE; Commented this out: NEVER, EVER, start a new anim from this function, as an eternal loop will result....
    // SoldierGotoStationaryStance( pSoldier );
    // Reset flag!
    AdjustNoAPToFinishMove(pSoldier, false);
  }

  if (pSoldier.bDesiredDirection != pSoldier.bDirection) {
    if (gAnimControl[usAnimState].uiFlags & (ANIM_BREATH | ANIM_OK_CHARGE_AP_FOR_TURN | ANIM_FIREREADY) && !fInitalMove && !pSoldier.fDontChargeTurningAPs) {
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

    pSoldier.fDontChargeTurningAPs = false;

    if (fInitalMove) {
      if (gAnimControl[usAnimState].ubHeight == ANIM_PRONE) {
        if (pSoldier.fTurningFromPronePosition != TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE) {
          pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_START_UP_FROM_MOVE;
        }
      }
    }

    if (gAnimControl[usAnimState].uiFlags & ANIM_STATIONARY || pSoldier.fNoAPToFinishMove || fInitalMove) {
      if (gAnimControl[usAnimState].ubHeight == ANIM_PRONE) {
        // Set this beasty of a flag to allow us to go back down to prone if we choose!
        // ATE: Alrighty, set flag to go back down only if we are not moving anywhere
        // if ( pSoldier->sDestination == pSoldier->sGridNo )
        if (!fInitalMove) {
          pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_ON;

          // Set a pending animation to change stance first...
          SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
        }
      }
    }
  }

  // Set desired direction for the extended directions...
  pSoldier.ubHiResDesiredDirection = ubExtDirection[pSoldier.bDesiredDirection];

  if (pSoldier.bDesiredDirection != pSoldier.bDirection) {
    if (pSoldier.uiStatusFlags & (SOLDIER_VEHICLE) || CREATURE_OR_BLOODCAT(pSoldier)) {
      pSoldier.uiStatusFlags |= SOLDIER_PAUSEANIMOVE;
    }
  }

  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    pSoldier.bTurningIncrement = ExtQuickestDirection(pSoldier.ubHiResDirection, pSoldier.ubHiResDesiredDirection);
  } else {
    if (pSoldier.uiStatusFlags & SOLDIER_MULTITILE) {
      pSoldier.bTurningIncrement = MultiTiledTurnDirection(pSoldier, pSoldier.bDirection, pSoldier.bDesiredDirection);
    } else {
      pSoldier.bTurningIncrement = QuickestDirection(pSoldier.bDirection, pSoldier.bDesiredDirection);
    }
  }
}

export function EVENT_SetSoldierDesiredDirection(pSoldier: SOLDIERTYPE, usNewDirection: UINT16): void {
  EVENT_InternalSetSoldierDesiredDirection(pSoldier, usNewDirection, false, pSoldier.usAnimState);
}

export function EVENT_SetSoldierDirection(pSoldier: SOLDIERTYPE, usNewDirection: UINT16): void {
  // Remove old location data
  HandleAnimationProfile(pSoldier, pSoldier.usAnimState, true);

  pSoldier.bDirection = usNewDirection;

  // Updated extended direction.....
  pSoldier.ubHiResDirection = ubExtDirection[pSoldier.bDirection];

  // Add new stuff
  HandleAnimationProfile(pSoldier, pSoldier.usAnimState, false);

  // If we are turning, we have chaanged our aim!
  if (!pSoldier.fDontUnsetLastTargetFromTurn) {
    pSoldier.sLastTarget = NOWHERE;
  }

  AdjustForFastTurnAnimation(pSoldier);

  // Update structure info!
  //	 if ( pSoldier->uiStatusFlags & SOLDIER_MULTITILE )
  { UpdateMercStructureInfo(pSoldier); }

  // Handle Profile data for hit locations
  HandleAnimationProfile(pSoldier, pSoldier.usAnimState, true);

  HandleCrowShadowNewDirection(pSoldier);

  // Change values!
  SetSoldierLocatorOffsets(pSoldier);
}

export function EVENT_BeginMercTurn(pSoldier: SOLDIERTYPE, fFromRealTime: boolean, iRealTimeCounter: INT32): void {
  // NB realtimecounter is not used, always passed in as 0 now!

  let iBlood: INT32;

  if (pSoldier.bUnderFire) {
    // UnderFire now starts at 2 for "under fire this turn",
    // down to 1 for "under fire last turn", to 0.
    pSoldier.bUnderFire--;
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
    if (!(pSoldier.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_ROBOT))) {
      if (pSoldier.bBleeding || pSoldier.bLife < OKLIFE) // is he bleeding or dying?
      {
        iBlood = CheckBleeding(pSoldier); // check if he might lose another life point

        // ATE: Only if in sector!
        if (pSoldier.bInSector) {
          if (iBlood != NOBLOOD) {
            DropBlood(pSoldier, iBlood, pSoldier.bVisible);
          }
        }
      }
    }
  }

  // survived bleeding, but is he out of breath?
  if (pSoldier.bLife && !pSoldier.bBreath && MercInWater(pSoldier)) {
    // Drowning...
  }

  // if he is still alive (didn't bleed to death)
  if (pSoldier.bLife) {
    // reduce the effects of any residual shock from past injuries by half
    pSoldier.bShock /= 2;

    // if this person has heard a noise that hasn't been investigated
    if (pSoldier.sNoiseGridno != NOWHERE) {
      if (pSoldier.ubNoiseVolume) // and the noise volume is still positive
      {
        pSoldier.ubNoiseVolume--; // the volume of the noise "decays" by 1 point

        if (!pSoldier.ubNoiseVolume) // if the volume has reached zero
        {
          pSoldier.sNoiseGridno = NOWHERE; // forget about the noise!
        }
      }
    }

    // save unused action points up to a maximum
    /*
if ((savedPts = pSoldier->bActionPts) > MAX_AP_CARRIED)
savedPts = MAX_AP_CARRIED;
           */
    if (pSoldier.uiStatusFlags & SOLDIER_GASSED) {
      // then must get a gas mask or leave the gassed area to get over it
      if ((pSoldier.inv[Enum261.HEAD1POS].usItem == Enum225.GASMASK || pSoldier.inv[Enum261.HEAD2POS].usItem == Enum225.GASMASK) || !(GetSmokeEffectOnTile(pSoldier.sGridNo, pSoldier.bLevel))) {
        // Turn off gassed flag....
        pSoldier.uiStatusFlags &= (~SOLDIER_GASSED);
      }
    }

    if (pSoldier.bBlindedCounter > 0) {
      pSoldier.bBlindedCounter--;
      if (pSoldier.bBlindedCounter == 0) {
        // we can SEE!!!!!
        HandleSight(pSoldier, SIGHT_LOOK);
        // Dirty panel
        fInterfacePanelDirty = DIRTYLEVEL2;
      }
    }

    // ATE: To get around a problem...
    // If an AI guy, and we have 0 life, and are still at higher hieght,
    // Kill them.....

    pSoldier.sWeightCarriedAtTurnStart = CalculateCarriedWeight(pSoldier);

    UnusedAPsToBreath(pSoldier);

    // Set flag back to normal, after reaching a certain statge
    if (pSoldier.bBreath > 80) {
      pSoldier.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_LOW_BREATH);
    }
    if (pSoldier.bBreath > 50) {
      pSoldier.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_DROWNING);
    }

    if (pSoldier.ubTurnsUntilCanSayHeardNoise > 0) {
      pSoldier.ubTurnsUntilCanSayHeardNoise--;
    }

    if (pSoldier.bInSector) {
      CheckForBreathCollapse(pSoldier);
    }

    CalcNewActionPoints(pSoldier);

    pSoldier.bTilesMoved = 0;

    if (pSoldier.bInSector) {
      BeginSoldierGetup(pSoldier);

      // CJC Nov 30: handle RT opplist decaying in another function which operates less often
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        VerifyAndDecayOpplist(pSoldier);

        // turn off xray
        if (pSoldier.uiXRayActivatedTime) {
          TurnOffXRayEffects(pSoldier);
        }
      }

      if ((pSoldier.bTeam == gbPlayerNum) && (pSoldier.ubProfile != NO_PROFILE)) {
        switch (gMercProfiles[pSoldier.ubProfile].bPersonalityTrait) {
          case Enum270.FEAR_OF_INSECTS:
            if (MercSeesCreature(pSoldier)) {
              HandleMoraleEvent(pSoldier, Enum234.MORALE_INSECT_PHOBIC_SEES_CREATURE, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
              if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
                pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
              }
            }
            break;
          case Enum270.CLAUSTROPHOBIC:
            if (gbWorldSectorZ > 0 && Random(6 - gbWorldSectorZ) == 0) {
              // underground!
              HandleMoraleEvent(pSoldier, Enum234.MORALE_CLAUSTROPHOBE_UNDERGROUND, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
              if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
                pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
              }
            }
            break;
          case Enum270.NERVOUS:
            if (DistanceToClosestFriend(pSoldier) > NERVOUS_RADIUS) {
              // augh!!
              if (pSoldier.bMorale < 50) {
                HandleMoraleEvent(pSoldier, Enum234.MORALE_NERVOUS_ALONE, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
                if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
                  TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
                  pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
                }
              }
            } else {
              if (pSoldier.bMorale > 45) {
                // turn flag off, so that we say it every two turns
                pSoldier.usQuoteSaidFlags &= ~SOLDIER_QUOTE_SAID_PERSONALITY;
              }
            }
            break;
        }
      }
    }

    // Reset quote flags for under heavy fire and close call!
    pSoldier.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_BEING_PUMMELED);
    pSoldier.usQuoteSaidExtFlags &= (~SOLDIER_QUOTE_SAID_EXT_CLOSE_CALL);
    pSoldier.bNumHitsThisTurn = 0;
    pSoldier.ubSuppressionPoints = 0;
    pSoldier.fCloseCall = false;

    pSoldier.ubMovementNoiseHeard = 0;

    // If soldier has new APs, reset flags!
    if (pSoldier.bActionPoints > 0) {
      pSoldier.fUIFirstTimeNOAP = false;
      pSoldier.bMoved = false;
      pSoldier.bPassedLastInterrupt = false;
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

export function ConvertAniCodeToAniFrame(pSoldier: SOLDIERTYPE, usAniFrame: UINT16): boolean {
  let usAnimSurface: UINT16;
  let ubTempDir: UINT8;
  // Given ani code, adjust for facing direction

  // get anim surface and determine # of frames
  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    return false;
  }

  // COnvert world direction into sprite direction
  ubTempDir = gOneCDirection[pSoldier.bDirection];

  // If we are only one frame, ignore what the script is telling us!
  if (gAnimSurfaceDatabase[usAnimSurface].ubFlags & ANIM_DATA_FLAG_NOFRAMES) {
    usAniFrame = 0;
  }

  if (gAnimSurfaceDatabase[usAnimSurface].uiNumDirections == 32) {
    ubTempDir = gExtOneCDirection[pSoldier.ubHiResDirection];
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
    if (pSoldier.bDirection == Enum245.NORTHWEST) {
      ubTempDir = 1;
    }
    if (pSoldier.bDirection == Enum245.WEST) {
      ubTempDir = 0;
    }
    if (pSoldier.bDirection == Enum245.EAST) {
      ubTempDir = 2;
    }
  } else if (gAnimSurfaceDatabase[usAnimSurface].uiNumDirections == 2) {
    ubTempDir = gDirectionFrom8to2[pSoldier.bDirection];
  }

  pSoldier.usAniFrame = usAniFrame + ((gAnimSurfaceDatabase[usAnimSurface].uiNumFramesPerDir * ubTempDir));

  if (gAnimSurfaceDatabase[usAnimSurface].hVideoObject == null) {
    pSoldier.usAniFrame = 0;
    return true;
  }

  if (pSoldier.usAniFrame >= gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.usNumberOfObjects) {
    // Debug msg here....
    //		ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, L"Soldier Animation: Wrong Number of frames per number of objects: %d vs %d, %S",  gAnimSurfaceDatabase[ usAnimSurface ].uiNumFramesPerDir, gAnimSurfaceDatabase[ usAnimSurface ].hVideoObject->usNumberOfObjects, gAnimControl[ pSoldier->usAnimState ].zAnimStr );

    pSoldier.usAniFrame = 0;
  }

  return true;
}

export function TurnSoldier(pSoldier: SOLDIERTYPE): void {
  let sDirection: INT16;
  let fDoDirectionChange: boolean = true;
  let cnt: INT32;

  // If we are a vehicle... DON'T TURN!
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    if (pSoldier.ubBodyType != Enum194.TANK_NW && pSoldier.ubBodyType != Enum194.TANK_NE) {
      return;
    }
  }

  // We handle sight now....
  if (pSoldier.uiStatusFlags & SOLDIER_LOOK_NEXT_TURNSOLDIER) {
    if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY && pSoldier.usAnimState != Enum193.CLIMBUPROOF && pSoldier.usAnimState != Enum193.CLIMBDOWNROOF)) {
      // HANDLE SIGHT!
      HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO);
    }
    // Turn off!
    pSoldier.uiStatusFlags &= (~SOLDIER_LOOK_NEXT_TURNSOLDIER);

    HandleSystemNewAISituation(pSoldier, false);
  }

  if (pSoldier.fTurningToShoot) {
    if (pSoldier.bDirection == pSoldier.bDesiredDirection) {
      if (((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_FIREREADY) && !pSoldier.fTurningFromPronePosition) || pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON || pSoldier.ubBodyType == Enum194.TANK_NW || pSoldier.ubBodyType == Enum194.TANK_NE) {
        EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight), 0, false);
        pSoldier.fTurningToShoot = false;

        // Save last target gridno!
        // pSoldier->sLastTarget = pSoldier->sTargetGridNo;
      }
      // Else check if we are trying to shoot and once was prone, but am now crouched because we needed to turn...
      else if (pSoldier.fTurningFromPronePosition) {
        if (IsValidStance(pSoldier, ANIM_PRONE)) {
          SendChangeSoldierStanceEvent(pSoldier, ANIM_PRONE);
          pSoldier.usPendingAnimation = SelectFireAnimation(pSoldier, ANIM_PRONE);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, SelectFireAnimation(pSoldier, ANIM_CROUCH), 0, false);
        }
        pSoldier.fTurningToShoot = false;
        pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
      }
    }
  }

  if (pSoldier.fTurningToFall) {
    if (pSoldier.bDirection == pSoldier.bDesiredDirection) {
      SelectFallAnimation(pSoldier);
      pSoldier.fTurningToFall = false;
    }
  }

  if (pSoldier.fTurningUntilDone && (pSoldier.ubPendingStanceChange != NO_PENDING_STANCE)) {
    if (pSoldier.bDirection == pSoldier.bDesiredDirection) {
      SendChangeSoldierStanceEvent(pSoldier, pSoldier.ubPendingStanceChange);
      pSoldier.ubPendingStanceChange = NO_PENDING_STANCE;
      pSoldier.fTurningUntilDone = false;
    }
  }

  if (pSoldier.fTurningUntilDone && (pSoldier.usPendingAnimation != NO_PENDING_ANIMATION)) {
    if (pSoldier.bDirection == pSoldier.bDesiredDirection) {
      let usPendingAnimation: UINT16;

      usPendingAnimation = pSoldier.usPendingAnimation;
      pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;

      EVENT_InitNewSoldierAnim(pSoldier, usPendingAnimation, 0, false);
      pSoldier.fTurningUntilDone = false;
    }
  }

  // Don't do anything if we are at dest direction!
  if (pSoldier.bDirection == pSoldier.bDesiredDirection) {
    if (pSoldier.ubBodyType == Enum194.TANK_NW || pSoldier.ubBodyType == Enum194.TANK_NE) {
      if (pSoldier.iTuringSoundID != NO_SAMPLE) {
        SoundStop(pSoldier.iTuringSoundID);
        pSoldier.iTuringSoundID = NO_SAMPLE;

        PlaySoldierJA2Sample(pSoldier.ubID, Enum330.TURRET_STOP, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
      }
    }

    // Turn off!
    pSoldier.uiStatusFlags &= (~SOLDIER_LOOK_NEXT_TURNSOLDIER);
    pSoldier.fDontUnsetLastTargetFromTurn = false;

    // Unset ui busy if from ui
    if (pSoldier.bTurningFromUI && (pSoldier.fTurningFromPronePosition != 3) && (pSoldier.fTurningFromPronePosition != 1)) {
      UnSetUIBusy(pSoldier.ubID);
      pSoldier.bTurningFromUI = false;
    }

    if (pSoldier.uiStatusFlags & (SOLDIER_VEHICLE) || CREATURE_OR_BLOODCAT(pSoldier)) {
      pSoldier.uiStatusFlags &= (~SOLDIER_PAUSEANIMOVE);
    }

    FreeUpNPCFromTurning(pSoldier, LOOK);

    // Undo our flag for prone turning...
    // Else check if we are trying to shoot and once was prone, but am now crouched because we needed to turn...
    if (pSoldier.fTurningFromPronePosition == TURNING_FROM_PRONE_ON) {
      // ATE: Don't do this if we have something in our hands we are going to throw!
      if (IsValidStance(pSoldier, ANIM_PRONE) && pSoldier.pTempObject == null) {
        SendChangeSoldierStanceEvent(pSoldier, ANIM_PRONE);
      }
      pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
    }

    // If a special code, make guy crawl after stance change!
    if (pSoldier.fTurningFromPronePosition == TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE && pSoldier.usAnimState != Enum193.PRONE_UP && pSoldier.usAnimState != Enum193.PRONE_DOWN) {
      if (IsValidStance(pSoldier, ANIM_PRONE)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRAWLING, 0, false);
      }
    }

    if (pSoldier.uiStatusFlags & SOLDIER_TURNINGFROMHIT) {
      if (pSoldier.fGettingHit == 1) {
        if (pSoldier.usPendingAnimation != Enum193.FALLFORWARD_ROOF && pSoldier.usPendingAnimation != Enum193.FALLOFF && pSoldier.usAnimState != Enum193.FALLFORWARD_ROOF && pSoldier.usAnimState != Enum193.FALLOFF) {
          // Go back to original direction
          EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.uiPendingActionData1);

          // SETUP GETTING HIT FLAG TO 2
          pSoldier.fGettingHit = 2;
        } else {
          pSoldier.uiStatusFlags &= (~SOLDIER_TURNINGFROMHIT);
        }
      } else if (pSoldier.fGettingHit == 2) {
        // Turn off
        pSoldier.uiStatusFlags &= (~SOLDIER_TURNINGFROMHIT);

        // Release attacker
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker, turning from hit animation ended"));
        ReleaseSoldiersAttacker(pSoldier);

        // FREEUP GETTING HIT FLAG
        pSoldier.fGettingHit = 0;
      }
    }

    return;
  }

  // IF WE ARE HERE, WE ARE IN THE PROCESS OF TURNING

  // DOUBLE CHECK TO UNSET fNOAPs...
  if (pSoldier.fNoAPToFinishMove) {
    AdjustNoAPToFinishMove(pSoldier, false);
  }

  // Do something different for vehicles....
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    fDoDirectionChange = false;

    // Get new direction
    /*
    sDirection = pSoldier->ubHiResDirection + ExtQuickestDirection( pSoldier->ubHiResDirection, pSoldier->ubHiResDesiredDirection );
    */
    sDirection = pSoldier.ubHiResDirection + pSoldier.bTurningIncrement;
    if (sDirection > 31) {
      sDirection = 0;
    } else {
      if (sDirection < 0) {
        sDirection = 31;
      }
    }
    pSoldier.ubHiResDirection = sDirection;

    // Are we at a multiple of a 'cardnal' direction?
    for (cnt = 0; cnt < 8; cnt++) {
      if (sDirection == ubExtDirection[cnt]) {
        fDoDirectionChange = true;

        sDirection = cnt;

        break;
      }
    }

    if (pSoldier.ubBodyType == Enum194.TANK_NW || pSoldier.ubBodyType == Enum194.TANK_NE) {
      if (pSoldier.iTuringSoundID == NO_SAMPLE) {
        pSoldier.iTuringSoundID = PlaySoldierJA2Sample(pSoldier.ubID, Enum330.TURRET_MOVE, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 100, SoundDir(pSoldier.sGridNo), true);
      }
    }
  } else {
    // Get new direction
    // sDirection = pSoldier->bDirection + QuickestDirection( pSoldier->bDirection, pSoldier->bDesiredDirection );
    sDirection = pSoldier.bDirection + pSoldier.bTurningIncrement;
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
        if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY)) {
          pSoldier.uiStatusFlags |= SOLDIER_LOOK_NEXT_TURNSOLDIER;
        }
        // otherwise, it's handled next tile...
      }

      EVENT_SetSoldierDirection(pSoldier, sDirection);

      if (pSoldier.ubBodyType != Enum194.LARVAE_MONSTER && !MercInWater(pSoldier) && pSoldier.bOverTerrainType != Enum315.DIRT_ROAD && pSoldier.bOverTerrainType != Enum315.PAVED_ROAD) {
        PlaySoldierFootstepSound(pSoldier);
      }
    } else {
      // Are we prone crawling?
      if (pSoldier.usAnimState == Enum193.CRAWLING) {
        // OK, we want to getup, turn and go prone again....
        SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
        pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_ENDING_UP_FROM_MOVE;
      }
      // If we are a creature, or multi-tiled, cancel AI action.....?
      else if (pSoldier.uiStatusFlags & SOLDIER_MULTITILE) {
        pSoldier.bDesiredDirection = pSoldier.bDirection;
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

export function CreateSoldierPalettes(pSoldier: SOLDIERTYPE): boolean {
  let usAnimSurface: UINT16;
  let usPaletteAnimSurface: UINT16;
  let zColFilename: string /* CHAR8[100] */;
  let iWhich: INT32;
  let cnt: INT32;
  let bBodyTypePalette: INT8;
  let Temp8BPPPalette: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);

  // NT32 uiCount;
  // PPaletteEntry Pal[256];

  if (pSoldier.p8BPPPalette != null) {
    MemFree(pSoldier.p8BPPPalette);
    pSoldier.p8BPPPalette = null;
  }

  // Allocate mem for new palette
  pSoldier.p8BPPPalette = createArrayFrom(256, createSGPPaletteEntry);

  // --- TAKE FROM CURRENT ANIMATION HVOBJECT!
  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    return false;
  }

  if ((bBodyTypePalette = GetBodyTypePaletteSubstitutionCode(pSoldier, pSoldier.ubBodyType, zColFilename)) == -1) {
    // ATE: here we want to use the breath cycle for the palette.....
    usPaletteAnimSurface = LoadSoldierAnimationSurface(pSoldier, Enum193.STANDING);

    if (usPaletteAnimSurface != INVALID_ANIMATION_SURFACE) {
      // Use palette from HVOBJECT, then use substitution for pants, etc
      memcpy(pSoldier.p8BPPPalette, gAnimSurfaceDatabase[usPaletteAnimSurface].hVideoObject.value.pPaletteEntry, sizeof(pSoldier.p8BPPPalette) * 256);

      // Substitute based on head, etc
      SetPaletteReplacement(pSoldier.p8BPPPalette, pSoldier.HeadPal);
      SetPaletteReplacement(pSoldier.p8BPPPalette, pSoldier.VestPal);
      SetPaletteReplacement(pSoldier.p8BPPPalette, pSoldier.PantsPal);
      SetPaletteReplacement(pSoldier.p8BPPPalette, pSoldier.SkinPal);
    }
  } else if (bBodyTypePalette == 0) {
    // Use palette from hvobject
    memcpy(pSoldier.p8BPPPalette, gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pPaletteEntry, sizeof(pSoldier.p8BPPPalette) * 256);
  } else {
    // Use col file
    if (CreateSGPPaletteFromCOLFile(Temp8BPPPalette, zColFilename)) {
      // Copy into palette
      memcpy(pSoldier.p8BPPPalette, Temp8BPPPalette, sizeof(pSoldier.p8BPPPalette) * 256);
    } else {
      // Use palette from hvobject
      memcpy(pSoldier.p8BPPPalette, gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pPaletteEntry, sizeof(pSoldier.p8BPPPalette) * 256);
    }
  }

  if (pSoldier.p16BPPPalette != null) {
    MemFree(pSoldier.p16BPPPalette);
    pSoldier.p16BPPPalette = null;
  }

  // -- BUILD 16BPP Palette from this
  pSoldier.p16BPPPalette = Create16BPPPalette(pSoldier.p8BPPPalette);

  for (iWhich = 0; iWhich < NUM_SOLDIER_SHADES; iWhich++) {
    if (pSoldier.pShades[iWhich] != null) {
      MemFree(pSoldier.pShades[iWhich]);
      pSoldier.pShades[iWhich] = null;
    }
  }

  for (iWhich = 0; iWhich < NUM_SOLDIER_EFFECTSHADES; iWhich++) {
    if (pSoldier.pEffectShades[iWhich] != null) {
      MemFree(pSoldier.pEffectShades[iWhich]);
      pSoldier.pEffectShades[iWhich] = null;
    }
  }

  for (iWhich = 0; iWhich < 20; iWhich++) {
    if (pSoldier.pGlowShades[iWhich] != null) {
      MemFree(pSoldier.pGlowShades[iWhich]);
      pSoldier.pGlowShades[iWhich] = null;
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
  pSoldier.pEffectShades[0] = Create16BPPPaletteShaded(pSoldier.p8BPPPalette, 100, 100, 100, true);
  pSoldier.pEffectShades[1] = Create16BPPPaletteShaded(pSoldier.p8BPPPalette, 100, 150, 100, true);

  // Build shades for glowing visible bad guy

  // First do visible guy
  pSoldier.pGlowShades[0] = Create16BPPPaletteShaded(pSoldier.p8BPPPalette, 255, 255, 255, false);
  for (cnt = 1; cnt < 10; cnt++) {
    pSoldier.pGlowShades[cnt] = CreateEnemyGlow16BPPPalette(pSoldier.p8BPPPalette, gRedGlowR[cnt], 255, false);
  }

  // Now for gray guy...
  pSoldier.pGlowShades[10] = Create16BPPPaletteShaded(pSoldier.p8BPPPalette, 100, 100, 100, true);
  for (cnt = 11; cnt < 19; cnt++) {
    pSoldier.pGlowShades[cnt] = CreateEnemyGreyGlow16BPPPalette(pSoldier.p8BPPPalette, gRedGlowR[cnt], 0, false);
  }
  pSoldier.pGlowShades[19] = CreateEnemyGreyGlow16BPPPalette(pSoldier.p8BPPPalette, gRedGlowR[18], 0, false);

  // ATE: OK, piggyback on the shades we are not using for 2 colored lighting....
  // ORANGE, VISIBLE GUY
  pSoldier.pShades[20] = Create16BPPPaletteShaded(pSoldier.p8BPPPalette, 255, 255, 255, false);
  for (cnt = 21; cnt < 30; cnt++) {
    pSoldier.pShades[cnt] = CreateEnemyGlow16BPPPalette(pSoldier.p8BPPPalette, gOrangeGlowR[(cnt - 20)], gOrangeGlowG[(cnt - 20)], true);
  }

  // ORANGE, GREY GUY
  pSoldier.pShades[30] = Create16BPPPaletteShaded(pSoldier.p8BPPPalette, 100, 100, 100, true);
  for (cnt = 31; cnt < 39; cnt++) {
    pSoldier.pShades[cnt] = CreateEnemyGreyGlow16BPPPalette(pSoldier.p8BPPPalette, gOrangeGlowR[(cnt - 20)], gOrangeGlowG[(cnt - 20)], true);
  }
  pSoldier.pShades[39] = CreateEnemyGreyGlow16BPPPalette(pSoldier.p8BPPPalette, gOrangeGlowR[18], gOrangeGlowG[18], true);

  return true;
}

function AdjustAniSpeed(pSoldier: SOLDIERTYPE): void {
  if ((gTacticalStatus.uiFlags & SLOW_ANIMATION)) {
    if (gTacticalStatus.bRealtimeSpeed == -1) {
      pSoldier.sAniDelay = 10000;
    } else {
      pSoldier.sAniDelay = pSoldier.sAniDelay * (1 * gTacticalStatus.bRealtimeSpeed / 2);
    }
  }

  pSoldier.UpdateCounter = RESETTIMECOUNTER(pSoldier.sAniDelay);
}

function CalculateSoldierAniSpeed(pSoldier: SOLDIERTYPE, pStatsSoldier: SOLDIERTYPE): void {
  let uiTerrainDelay: UINT32;
  let uiSpeed: UINT32 = 0;

  let bBreathDef: INT8;
  let bLifeDef: INT8;
  let bAgilDef: INT8;
  let bAdditional: INT8 = 0;

  // for those animations which have a speed of zero, we have to calculate it
  // here. Some animation, such as water-movement, have an ADDITIONAL speed
  switch (pSoldier.usAnimState) {
    case Enum193.PRONE:
    case Enum193.STANDING:

      pSoldier.sAniDelay = (pStatsSoldier.bBreath * 2) + (100 - pStatsSoldier.bLife);

      // Limit it!
      if (pSoldier.sAniDelay < 40) {
        pSoldier.sAniDelay = 40;
      }
      AdjustAniSpeed(pSoldier);
      return;

    case Enum193.CROUCHING:

      pSoldier.sAniDelay = (pStatsSoldier.bBreath * 2) + ((100 - pStatsSoldier.bLife));

      // Limit it!
      if (pSoldier.sAniDelay < 40) {
        pSoldier.sAniDelay = 40;
      }
      AdjustAniSpeed(pSoldier);
      return;

    case Enum193.WALKING:

      // Adjust based on body type
      bAdditional = (gubAnimWalkSpeeds[pStatsSoldier.ubBodyType].sSpeed);
      if (bAdditional < 0)
        bAdditional = 0;
      break;

    case Enum193.RUNNING:

      // Adjust based on body type
      bAdditional = gubAnimRunSpeeds[pStatsSoldier.ubBodyType].sSpeed;
      if (bAdditional < 0)
        bAdditional = 0;
      break;

    case Enum193.SWATTING:

      // Adjust based on body type
      if (pStatsSoldier.ubBodyType <= Enum194.REGFEMALE) {
        bAdditional = gubAnimSwatSpeeds[pStatsSoldier.ubBodyType].sSpeed;
        if (bAdditional < 0)
          bAdditional = 0;
      }
      break;

    case Enum193.CRAWLING:

      // Adjust based on body type
      if (pStatsSoldier.ubBodyType <= Enum194.REGFEMALE) {
        bAdditional = gubAnimCrawlSpeeds[pStatsSoldier.ubBodyType].sSpeed;
        if (bAdditional < 0)
          bAdditional = 0;
      }
      break;

    case Enum193.READY_RIFLE_STAND:

      // Raise rifle based on aim vs non-aim.
      if (pSoldier.bAimTime == 0) {
        // Quick shot
        pSoldier.sAniDelay = 70;
      } else {
        pSoldier.sAniDelay = 150;
      }
      AdjustAniSpeed(pSoldier);
      return;
  }

  // figure out movement speed (terrspeed)
  if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) {
    uiSpeed = gsTerrainTypeSpeedModifiers[pStatsSoldier.bOverTerrainType];

    uiTerrainDelay = uiSpeed;
  } else {
    uiTerrainDelay = 40; // standing still
  }

  bBreathDef = 50 - (pStatsSoldier.bBreath / 2);

  if (bBreathDef > 30)
    bBreathDef = 30;

  bAgilDef = 50 - (EffectiveAgility(pStatsSoldier) / 4);
  bLifeDef = 50 - (pStatsSoldier.bLife / 2);

  uiTerrainDelay += (bLifeDef + bBreathDef + bAgilDef + bAdditional);

  pSoldier.sAniDelay = uiTerrainDelay;

  // If a moving animation and w/re on drugs, increase speed....
  if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) {
    if (GetDrugEffect(pSoldier, DRUG_TYPE_ADRENALINE)) {
      pSoldier.sAniDelay = pSoldier.sAniDelay / 2;
    }
  }

  // MODIFTY NOW BASED ON REAL-TIME, ETC
  // Adjust speed, make twice as fast if in turn-based!
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    pSoldier.sAniDelay = pSoldier.sAniDelay / 2;
  }

  // MODIFY IF REALTIME COMBAT
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // ATE: If realtime, and stealth mode...
    if (pStatsSoldier.bStealthMode) {
      pSoldier.sAniDelay = (pSoldier.sAniDelay * 2);
    }

    // pSoldier->sAniDelay = pSoldier->sAniDelay * ( 1 * gTacticalStatus.bRealtimeSpeed / 2 );
  }
}

export function SetSoldierAniSpeed(pSoldier: SOLDIERTYPE): void {
  let pStatsSoldier: SOLDIERTYPE;

  // ATE: If we are an enemy and are not visible......
  // Set speed to 0
  if ((gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) || gTacticalStatus.fAutoBandageMode) {
    if (((pSoldier.bVisible == -1 && pSoldier.bVisible == pSoldier.bLastRenderVisibleValue) || gTacticalStatus.fAutoBandageMode) && pSoldier.usAnimState != Enum193.MONSTER_UP) {
      pSoldier.sAniDelay = 0;
      pSoldier.UpdateCounter = RESETTIMECOUNTER(pSoldier.sAniDelay);
      return;
    }
  }

  // Default stats soldier to same as normal soldier.....
  pStatsSoldier = pSoldier;

  if (pSoldier.fUseMoverrideMoveSpeed) {
    pStatsSoldier = MercPtrs[pSoldier.bOverrideMoveSpeed];
  }

  // Only calculate if set to zero
  if ((pSoldier.sAniDelay = gAnimControl[pSoldier.usAnimState].sSpeed) == 0) {
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
export function LoadPaletteData(): boolean {
  let hFile: HWFILE;
  let cnt: UINT32;
  let cnt2: UINT32;

  hFile = FileOpen(PALETTEFILENAME, FILE_ACCESS_READ, false);

  // Read # of types
  if (!FileRead(hFile, addressof(guiNumPaletteSubRanges), sizeof(guiNumPaletteSubRanges))) {
    return false;
  }

  // Malloc!
  gpPaletteSubRanges = MemAlloc(sizeof(PaletteSubRangeType) * guiNumPaletteSubRanges);
  gubpNumReplacementsPerRange = MemAlloc(sizeof(UINT8) * guiNumPaletteSubRanges);

  // Read # of types for each!
  for (cnt = 0; cnt < guiNumPaletteSubRanges; cnt++) {
    if (!FileRead(hFile, addressof(gubpNumReplacementsPerRange[cnt]), sizeof(UINT8))) {
      return false;
    }
  }

  // Loop for each one, read in data
  for (cnt = 0; cnt < guiNumPaletteSubRanges; cnt++) {
    if (!FileRead(hFile, addressof(gpPaletteSubRanges[cnt].ubStart), sizeof(UINT8))) {
      return false;
    }
    if (!FileRead(hFile, addressof(gpPaletteSubRanges[cnt].ubEnd), sizeof(UINT8))) {
      return false;
    }
  }

  // Read # of palettes
  if (!FileRead(hFile, addressof(guiNumReplacements), sizeof(guiNumReplacements))) {
    return false;
  }

  // Malloc!
  gpPalRep = MemAlloc(sizeof(PaletteReplacementType) * guiNumReplacements);

  // Read!
  for (cnt = 0; cnt < guiNumReplacements; cnt++) {
    // type
    if (!FileRead(hFile, addressof(gpPalRep[cnt].ubType), sizeof(gpPalRep[cnt].ubType))) {
      return false;
    }

    if (!FileRead(hFile, addressof(gpPalRep[cnt].ID), sizeof(gpPalRep[cnt].ID))) {
      return false;
    }

    // # entries
    if (!FileRead(hFile, addressof(gpPalRep[cnt].ubPaletteSize), sizeof(gpPalRep[cnt].ubPaletteSize))) {
      return false;
    }

    // Malloc
    gpPalRep[cnt].r = MemAlloc(gpPalRep[cnt].ubPaletteSize);
    if (gpPalRep[cnt].r == null) {
      return false;
    }
    gpPalRep[cnt].g = MemAlloc(gpPalRep[cnt].ubPaletteSize);
    if (gpPalRep[cnt].g == null) {
      return false;
    }
    gpPalRep[cnt].b = MemAlloc(gpPalRep[cnt].ubPaletteSize);
    if (gpPalRep[cnt].b == null) {
      return false;
    }

    for (cnt2 = 0; cnt2 < gpPalRep[cnt].ubPaletteSize; cnt2++) {
      if (!FileRead(hFile, addressof(gpPalRep[cnt].r[cnt2]), sizeof(UINT8), null)) {
        return false;
      }
      if (!FileRead(hFile, addressof(gpPalRep[cnt].g[cnt2]), sizeof(UINT8), null)) {
        return false;
      }
      if (!FileRead(hFile, addressof(gpPalRep[cnt].b[cnt2]), sizeof(UINT8), null)) {
        return false;
      }
    }
  }

  FileClose(hFile);

  return true;
}

export function SetPaletteReplacement(p8BPPPalette: SGPPaletteEntry[], aPalRep: PaletteRepID): boolean {
  let cnt2: UINT32;
  let ubType: UINT8;
  let ubPalIndex: UINT8;

  if ((ubPalIndex = GetPaletteRepIndexFromID(aPalRep)) === -1) {
    return false;
  }

  // Get range type
  ubType = gpPalRep[ubPalIndex].ubType;

  for (cnt2 = gpPaletteSubRanges[ubType].ubStart; cnt2 <= gpPaletteSubRanges[ubType].ubEnd; cnt2++) {
    p8BPPPalette[cnt2].peRed = gpPalRep[ubPalIndex].r[cnt2 - gpPaletteSubRanges[ubType].ubStart];
    p8BPPPalette[cnt2].peGreen = gpPalRep[ubPalIndex].g[cnt2 - gpPaletteSubRanges[ubType].ubStart];
    p8BPPPalette[cnt2].peBlue = gpPalRep[ubPalIndex].b[cnt2 - gpPaletteSubRanges[ubType].ubStart];
  }

  return true;
}

export function DeletePaletteData(): boolean {
  let cnt: UINT32;

  // Free!
  if (gpPaletteSubRanges != null) {
    MemFree(gpPaletteSubRanges);
    gpPaletteSubRanges = null;
  }

  if (gubpNumReplacementsPerRange != null) {
    MemFree(gubpNumReplacementsPerRange);
    gubpNumReplacementsPerRange = null;
  }

  for (cnt = 0; cnt < guiNumReplacements; cnt++) {
    // Free
    if (gpPalRep[cnt].r != null) {
      MemFree(gpPalRep[cnt].r);
      gpPalRep[cnt].r = null;
    }
    if (gpPalRep[cnt].g != null) {
      MemFree(gpPalRep[cnt].g);
      gpPalRep[cnt].g = null;
    }
    if (gpPalRep[cnt].b != null) {
      MemFree(gpPalRep[cnt].b);
      gpPalRep[cnt].b = null;
    }
  }

  // Free
  if (gpPalRep != null) {
    MemFree(gpPalRep);
    gpPalRep = null;
  }

  return true;
}

export function GetPaletteRepIndexFromID(aPalRep: PaletteRepID): UINT8 {
  let cnt: UINT32;

  // Check if type exists
  for (cnt = 0; cnt < guiNumReplacements; cnt++) {
    if (COMPARE_PALETTEREP_ID(aPalRep, gpPalRep[cnt].ID)) {
      return cnt;
    }
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Invalid Palette Replacement ID given");
  return -1;
}

function GetNewSoldierStateFromNewStance(pSoldier: SOLDIERTYPE, ubDesiredStance: UINT8): UINT16 {
  let usNewState: UINT16;
  let bCurrentHeight: INT8;

  bCurrentHeight = (ubDesiredStance - gAnimControl[pSoldier.usAnimState].ubEndHeight);

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
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("GetNewSoldierStateFromNewStance bogus ubDesiredStance value %d", ubDesiredStance));
      usNewState = pSoldier.usAnimState;
  }

  return usNewState;
}

export function MoveMercFacingDirection(pSoldier: SOLDIERTYPE, fReverse: boolean, dMovementDist: FLOAT): void {
  let dAngle: FLOAT = 0;

  // Determine which direction we are in
  switch (pSoldier.bDirection) {
    case Enum245.NORTH:
      dAngle = (-1 * Math.PI);
      break;

    case Enum245.NORTHEAST:
      dAngle = (Math.PI * .75);
      break;

    case Enum245.EAST:
      dAngle = (Math.PI / 2);
      break;

    case Enum245.SOUTHEAST:
      dAngle = (Math.PI / 4);
      break;

    case Enum245.SOUTH:
      dAngle = 0;
      break;

    case Enum245.SOUTHWEST:
      // dAngle = (FLOAT)(  PI * -.25 );
      dAngle = -0.786;
      break;

    case Enum245.WEST:
      dAngle = (Math.PI * -.5);
      break;

    case Enum245.NORTHWEST:
      dAngle = (Math.PI * -.75);
      break;
  }

  if (fReverse) {
    dMovementDist = dMovementDist * -1;
  }

  MoveMerc(pSoldier, dMovementDist, dAngle, false);
}

export function BeginSoldierClimbUpRoof(pSoldier: SOLDIERTYPE): void {
  let bNewDirection: INT8;

  if (FindHeigherLevel(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, addressof(bNewDirection)) && (pSoldier.bLevel == 0)) {
    if (EnoughPoints(pSoldier, GetAPsToClimbRoof(pSoldier, false), 0, true)) {
      if (pSoldier.bTeam == gbPlayerNum) {
        // OK, SET INTERFACE FIRST
        SetUIBusy(pSoldier.ubID);
      }

      pSoldier.sTempNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(bNewDirection));

      pSoldier.ubPendingDirection = bNewDirection;
      // pSoldier->usPendingAnimation = CLIMBUPROOF;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CLIMBUPROOF, 0, false);

      InternalReceivingSoldierCancelServices(pSoldier, false);
      InternalGivingSoldierCancelServices(pSoldier, false);
    }
  }
}

export function BeginSoldierClimbFence(pSoldier: SOLDIERTYPE): void {
  let bDirection: INT8;

  if (FindFenceJumpDirection(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, addressof(bDirection))) {
    pSoldier.sTempNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(bDirection));
    pSoldier.fDontChargeTurningAPs = true;
    EVENT_InternalSetSoldierDesiredDirection(pSoldier, bDirection, false, pSoldier.usAnimState);
    pSoldier.fTurningUntilDone = true;
    // ATE: Reset flag to go back to prone...
    pSoldier.fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
    pSoldier.usPendingAnimation = Enum193.HOPFENCE;
  }
}

function SleepDartSuccumbChance(pSoldier: SOLDIERTYPE): UINT32 {
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
  uiChance += (10 - pSoldier.bSleepDrugCounter);

  return uiChance;
}

export function BeginSoldierGetup(pSoldier: SOLDIERTYPE): void {
  // RETURN IF WE ARE BEING SERVICED
  if (pSoldier.ubServiceCount > 0) {
    return;
  }

  // ATE: Don't getup if we are in a meanwhile
  if (AreInMeanwhile()) {
    return;
  }

  if (pSoldier.bCollapsed) {
    if (pSoldier.bLife >= OKLIFE && pSoldier.bBreath >= OKBREATH && (pSoldier.bSleepDrugCounter == 0)) {
      // get up you hoser!

      pSoldier.bCollapsed = false;
      pSoldier.bTurnsCollapsed = 0;

      if (IS_MERC_BODY_TYPE(pSoldier)) {
        switch (pSoldier.usAnimState) {
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
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.ROLLOVER, 0, false);
            break;

          default:

            ChangeSoldierStance(pSoldier, ANIM_CROUCH);
            break;
        }
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_COWER, 0, false);
      }
    } else {
      pSoldier.bTurnsCollapsed++;
      if ((gTacticalStatus.bBoxingState == Enum247.BOXING) && (pSoldier.uiStatusFlags & SOLDIER_BOXER)) {
        if (pSoldier.bTurnsCollapsed > 1) {
          // We have a winnah!  But it isn't this boxer!
          EndBoxingMatch(pSoldier);
        }
      }
    }
  } else if (pSoldier.bSleepDrugCounter > 0) {
    let uiChance: UINT32;

    uiChance = SleepDartSuccumbChance(pSoldier);

    if (PreRandom(100) < uiChance) {
      // succumb to the drug!
      DeductPoints(pSoldier, 0, (pSoldier.bBreathMax * 100));
      SoldierCollapse(pSoldier);
    }
  }

  if (pSoldier.bSleepDrugCounter > 0) {
    pSoldier.bSleepDrugCounter--;
  }
}

function HandleTakeDamageDeath(pSoldier: SOLDIERTYPE, bOldLife: UINT8, ubReason: UINT8): void {
  switch (ubReason) {
    case TAKE_DAMAGE_BLOODLOSS:
    case TAKE_DAMAGE_ELECTRICITY:
    case TAKE_DAMAGE_GAS:

      if (pSoldier.bInSector) {
        if (pSoldier.bVisible != -1) {
          if (ubReason != TAKE_DAMAGE_BLOODLOSS) {
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
            pSoldier.fDeadSoundPlayed = true;
          }
        }

        if ((ubReason == TAKE_DAMAGE_ELECTRICITY) && pSoldier.bLife < OKLIFE) {
          pSoldier.fInNonintAnim = false;
        }

        // Check for < OKLIFE
        if (pSoldier.bLife < OKLIFE && pSoldier.bLife != 0 && !pSoldier.bCollapsed) {
          SoldierCollapse(pSoldier);
        }

        // THis is for the die animation that will be happening....
        if (pSoldier.bLife == 0) {
          pSoldier.fDoingExternalDeath = true;
        }

        // Check if he is dead....
        CheckForAndHandleSoldierDyingNotFromHit(pSoldier);
      }

      // if( !( guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN ) )
      { HandleSoldierTakeDamageFeedback(pSoldier); }

      if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) || !pSoldier.bInSector) {
        if (pSoldier.bLife == 0 && !(pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
          StrategicHandlePlayerTeamMercDeath(pSoldier);

          // ATE: Here, force always to use die sound...
          pSoldier.fDieSoundUsed = false;
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
          pSoldier.fDeadSoundPlayed = true;

          // ATE: DO death sound
          PlayJA2Sample(Enum330.DOORCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
          PlayJA2Sample(Enum330.HEADCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        }
      }
      break;
  }

  if (ubReason == TAKE_DAMAGE_ELECTRICITY) {
    if (pSoldier.bLife >= OKLIFE) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Freeing up attacker from electricity damage"));
      ReleaseSoldiersAttacker(pSoldier);
    }
  }
}

export function SoldierTakeDamage(pSoldier: SOLDIERTYPE, bHeight: INT8, sLifeDeduct: INT16, sBreathLoss: INT16, ubReason: UINT8, ubAttacker: UINT8, sSourceGrid: INT16, sSubsequent: INT16, fShowDamage: boolean): UINT8 {
  let bOldLife: INT8;
  let ubCombinedLoss: UINT8;
  let bBandage: INT8;
  let sAPCost: INT16;
  let ubBlood: UINT8;

  pSoldier.ubLastDamageReason = ubReason;

  // CJC Jan 21 99: add check to see if we are hurting an enemy in an enemy-controlled
  // sector; if so, this is a sign of player activity
  switch (pSoldier.bTeam) {
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
      if (pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP && gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTINPROGRESS && gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) {
        let pMaria: SOLDIERTYPE | null = FindSoldierByProfileID(Enum268.MARIA, false);
        if (pMaria && pMaria.bActive && pMaria.bInSector) {
          SetFactTrue(Enum170.FACT_MARIA_ESCAPE_NOTICED);
        }
      }
      break;
    default:
      break;
  }

  // Deduct life!, Show damage if we want!
  bOldLife = pSoldier.bLife;

  // OK, If we are a vehicle.... damage vehicle...( people inside... )
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
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

    VehicleTakeDamage(pSoldier.bVehicleID, ubReason, sLifeDeduct, pSoldier.sGridNo, ubAttacker);
    HandleTakeDamageDeath(pSoldier, bOldLife, ubReason);
    return 0;
  }

  // ATE: If we are elloit being attacked in a meanwhile...
  if (pSoldier.uiStatusFlags & SOLDIER_NPC_SHOOTING) {
    // Almost kill but not quite.....
    sLifeDeduct = (pSoldier.bLife - 1);
    // Turn off
    pSoldier.uiStatusFlags &= (~SOLDIER_NPC_SHOOTING);
  }

  // CJC: make sure Elliot doesn't bleed to death!
  if (ubReason == TAKE_DAMAGE_BLOODLOSS && AreInMeanwhile()) {
    return 0;
  }

  // Calculate bandage
  bBandage = pSoldier.bLifeMax - pSoldier.bLife - pSoldier.bBleeding;

  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    fReDrawFace = true;
  }

  if (CREATURE_OR_BLOODCAT(pSoldier)) {
    let sReductionFactor: INT16 = 0;

    if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
      sReductionFactor = 2;
    } else if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
      switch (pSoldier.ubBodyType) {
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
            sReductionFactor = 4 + PythSpacesAway(MercPtrs[ubAttacker].sGridNo, pSoldier.sGridNo) / 2;
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
    if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
      // in fact, reduce breath loss by MORE!
      sReductionFactor = Math.min(sReductionFactor, 8);
      sReductionFactor *= 2;
    } else {
      sReductionFactor /= 2;
    }
    if (sReductionFactor > 1) {
      sBreathLoss = (sBreathLoss + (sReductionFactor / 2)) / sReductionFactor;
    }
  }

  if (sLifeDeduct > pSoldier.bLife) {
    pSoldier.bLife = 0;
  } else {
    // Decrease Health
    pSoldier.bLife -= sLifeDeduct;
  }

  // ATE: Put some logic in here to allow enemies to die quicker.....
  // Are we an enemy?
  if (pSoldier.bSide != gbPlayerNum && !pSoldier.bNeutral && pSoldier.ubProfile == NO_PROFILE) {
    // ATE: Give them a chance to fall down...
    if (pSoldier.bLife > 0 && pSoldier.bLife < (OKLIFE - 1)) {
      // Are we taking damage from bleeding?
      if (ubReason == TAKE_DAMAGE_BLOODLOSS) {
        // Fifty-fifty chance to die now!
        if (Random(2) == 0 || gTacticalStatus.Team[pSoldier.bTeam].bMenInSector == 1) {
          // Kill!
          pSoldier.bLife = 0;
        }
      } else {
        // OK, see how far we are..
        if (pSoldier.bLife < (OKLIFE - 3)) {
          // Kill!
          pSoldier.bLife = 0;
        }
      }
    }
  }

  if (fShowDamage) {
    pSoldier.sDamage += sLifeDeduct;
  }

  // Truncate life
  if (pSoldier.bLife < 0) {
    pSoldier.bLife = 0;
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
        pSoldier.bBleeding = pSoldier.bBleeding + 1;
      }
    } else {
      pSoldier.bBleeding = pSoldier.bLifeMax - (pSoldier.bLife + bBandage);
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
    pSoldier.bShock += ubCombinedLoss;
  }

  // start the stopwatch - the blood is gushing!
  pSoldier.dNextBleed = CalcSoldierNextBleed(pSoldier);

  if (pSoldier.bInSector && pSoldier.bVisible != -1) {
    // If we are already dead, don't show damage!
    if (bOldLife != 0 && fShowDamage && sLifeDeduct != 0 && sLifeDeduct < 1000) {
      // Display damage
      let sOffsetX: INT16;
      let sOffsetY: INT16;

      // Set Damage display counter
      pSoldier.fDisplayDamage = true;
      pSoldier.bDisplayDamageCount = 0;

      if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
        pSoldier.sDamageX = 0;
        pSoldier.sDamageY = 0;
      } else {
        ({ sOffsetX, sOffsetY } = GetSoldierAnimOffsets(pSoldier));
        pSoldier.sDamageX = sOffsetX;
        pSoldier.sDamageY = sOffsetY;
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
    sTestTwo = (2 * (Math.max(sLifeDeduct, (sBreathLoss / 100))));

    if (pSoldier.ubAttackerID != NOBODY && MercPtrs[pSoldier.ubAttackerID].ubBodyType == Enum194.BLOODCAT) {
      // bloodcat boost, let them make people drop items more
      sTestTwo += 20;
    }

    // If damage > effective strength....
    sChanceToDrop = (Math.max(0, (sTestTwo - sTestOne)));

    // ATE: Increase odds of NOT dropping an UNDROPPABLE OBJECT
    if ((pSoldier.inv[Enum261.HANDPOS].fFlags & OBJECT_UNDROPPABLE)) {
      sChanceToDrop -= 30;
    }

    if (Random(100) < sChanceToDrop) {
      // OK, drop item in main hand...
      if (pSoldier.inv[Enum261.HANDPOS].usItem != NOTHING) {
        if (!(pSoldier.inv[Enum261.HANDPOS].fFlags & OBJECT_UNDROPPABLE)) {
          // ATE: if our guy, make visible....
          if (pSoldier.bTeam == gbPlayerNum) {
            bVisible = 1;
          }

          AddItemToPool(pSoldier.sGridNo, addressof(pSoldier.inv[Enum261.HANDPOS]), bVisible, pSoldier.bLevel, 0, -1);
          DeleteObj(addressof(pSoldier.inv[Enum261.HANDPOS]));
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

  if (!(pSoldier.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_ROBOT))) {
    if (ubBlood != 0) {
      if (pSoldier.bInSector) {
        DropBlood(pSoldier, ubBlood, pSoldier.bVisible);
      }
    }
  }

  // Set UI Flag for unconscious, if it's our own guy!
  if (pSoldier.bTeam == gbPlayerNum) {
    if (pSoldier.bLife < OKLIFE && pSoldier.bLife > 0 && bOldLife >= OKLIFE) {
      pSoldier.fUIFirstTimeUNCON = true;
      fInterfacePanelDirty = DIRTYLEVEL2;
    }
  }

  if (pSoldier.bInSector) {
    CheckForBreathCollapse(pSoldier);
  }

  // EXPERIENCE CLASS GAIN (combLoss): Getting wounded in battle

  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL1);

  if (ubAttacker != NOBODY) {
    // don't give exp for hitting friends!
    if ((MercPtrs[ubAttacker].bTeam == gbPlayerNum) && (pSoldier.bTeam != gbPlayerNum)) {
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

  if (PTR_OURTEAM(pSoldier)) {
    // EXPERIENCE GAIN: Took some damage
    StatChange(pSoldier, EXPERAMT, (5 * ubCombinedLoss), FROM_FAILURE);

    // Check for quote
    if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_BEING_PUMMELED)) {
      // Check attacker!
      if (ubAttacker != NOBODY && ubAttacker != pSoldier.ubID) {
        pSoldier.bNumHitsThisTurn++;

        if ((pSoldier.bNumHitsThisTurn >= 3) && (pSoldier.bLife - pSoldier.bOldLife > 20)) {
          if (Random(100) < ((40 * (pSoldier.bNumHitsThisTurn - 2)))) {
            DelayedTacticalCharacterDialogue(pSoldier, Enum202.QUOTE_TAKEN_A_BREATING);
            pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_BEING_PUMMELED;
            pSoldier.bNumHitsThisTurn = 0;
          }
        }
      }
    }
  }

  if ((ubAttacker != NOBODY) && (Menptr[ubAttacker].bTeam == OUR_TEAM) && (pSoldier.ubProfile != NO_PROFILE) && (pSoldier.ubProfile >= FIRST_RPC)) {
    gMercProfiles[pSoldier.ubProfile].ubMiscFlags |= PROFILE_MISC_FLAG_WOUNDEDBYPLAYER;
    if (pSoldier.ubProfile == 114) {
      SetFactTrue(Enum170.FACT_PACOS_KILLED);
    }
  }

  HandleTakeDamageDeath(pSoldier, bOldLife, ubReason);

  // Check if we are < unconscious, and shutup if so! also wipe sight
  if (pSoldier.bLife < CONSCIOUSNESS) {
    ShutupaYoFace(pSoldier.iFaceIndex);
  }

  if (pSoldier.bLife < OKLIFE) {
    DecayIndividualOpplist(pSoldier);
  }

  return ubCombinedLoss;
}

export function InternalDoMercBattleSound(pSoldier: SOLDIERTYPE, ubBattleSoundID: UINT8, bSpecialCode: INT8): boolean {
  let zFilename: string /* SGPFILENAME */;
  let spParms: SOUNDPARMS = createSoundParams();
  let ubSoundID: UINT8;
  let uiSoundID: UINT32;
  let iFaceIndex: UINT32;
  let fDoSub: boolean = false;
  let uiSubSoundID: INT32 = 0;
  let fSpeechSound: boolean = false;

  // DOUBLECHECK RANGE
  if (ubBattleSoundID >= Enum259.NUM_MERC_BATTLE_SOUNDS) {
    return false;
  }

  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    // Pick a passenger from vehicle....
    pSoldier = <SOLDIERTYPE>PickRandomPassengerFromVehicle(pSoldier);

    if (pSoldier == null) {
      return false;
    }
  }

  // If a death sound, and we have already done ours...
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_DIE1) {
    if (pSoldier.fDieSoundUsed) {
      return true;
    }
  }

  // Are we mute?
  if (pSoldier.uiStatusFlags & SOLDIER_MUTE) {
    return false;
  }

  //	uiTimeSameBattleSndDone

  // If we are a creature, etc, pick a better sound...
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_HIT1 || ubBattleSoundID == Enum259.BATTLE_SOUND_HIT2) {
    switch (pSoldier.ubBodyType) {
      case Enum194.COW:

        fDoSub = true;
        uiSubSoundID = Enum330.COW_HIT_SND;
        break;

      case Enum194.YAF_MONSTER:
      case Enum194.YAM_MONSTER:
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.AM_MONSTER:

        fDoSub = true;

        if (Random(2) == 0) {
          uiSubSoundID = Enum330.ACR_DIE_PART1;
        } else {
          uiSubSoundID = Enum330.ACR_LUNGE;
        }
        break;

      case Enum194.INFANT_MONSTER:

        fDoSub = true;
        uiSubSoundID = Enum330.BCR_SHRIEK;
        break;

      case Enum194.QUEENMONSTER:

        fDoSub = true;
        uiSubSoundID = Enum330.LQ_SHRIEK;
        break;

      case Enum194.LARVAE_MONSTER:

        fDoSub = true;
        uiSubSoundID = Enum330.BCR_SHRIEK;
        break;

      case Enum194.BLOODCAT:

        fDoSub = true;
        uiSubSoundID = Enum330.BLOODCAT_HIT_1;
        break;

      case Enum194.ROBOTNOWEAPON:

        fDoSub = true;
        uiSubSoundID = (Enum330.S_METAL_IMPACT1 + Random(2));
        break;
    }
  }

  if (ubBattleSoundID == Enum259.BATTLE_SOUND_DIE1) {
    switch (pSoldier.ubBodyType) {
      case Enum194.COW:

        fDoSub = true;
        uiSubSoundID = Enum330.COW_DIE_SND;
        break;

      case Enum194.YAF_MONSTER:
      case Enum194.YAM_MONSTER:
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.AM_MONSTER:

        fDoSub = true;
        uiSubSoundID = Enum330.CREATURE_FALL_PART_2;
        break;

      case Enum194.INFANT_MONSTER:

        fDoSub = true;
        uiSubSoundID = Enum330.BCR_DYING;
        break;

      case Enum194.LARVAE_MONSTER:

        fDoSub = true;
        uiSubSoundID = Enum330.LCR_RUPTURE;
        break;

      case Enum194.QUEENMONSTER:

        fDoSub = true;
        uiSubSoundID = Enum330.LQ_DYING;
        break;

      case Enum194.BLOODCAT:

        fDoSub = true;
        uiSubSoundID = Enum330.BLOODCAT_DIE_1;
        break;

      case Enum194.ROBOTNOWEAPON:

        fDoSub = true;
        uiSubSoundID = (Enum330.EXPLOSION_1);
        PlayJA2Sample(Enum330.ROBOT_DEATH, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        break;
    }
  }

  // OK. any other sound, not hits, robot makes a beep
  if (pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON && !fDoSub) {
    fDoSub = true;
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
      PlayJA2Sample(uiSubSoundID, RATE_11025, SoundVolume(CalculateSpeechVolume(HIGHVOLUME), pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
    }
    return true;
  }

  // Check if this is the same one we just played...
  if (pSoldier.bOldBattleSnd == ubBattleSoundID && gBattleSndsData[ubBattleSoundID].fDontAllowTwoInRow) {
    // Are we below the min delay?
    if ((GetJA2Clock() - pSoldier.uiTimeSameBattleSndDone) < MIN_SUBSEQUENT_SNDS_DELAY) {
      return true;
    }
  }

  // If a battle snd is STILL playing....
  if (SoundIsPlaying(pSoldier.uiBattleSoundID)) {
    // We can do a few things here....
    // Is this a crutial one...?
    if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 1) {
      // Stop playing origonal
      SoundStop(pSoldier.uiBattleSoundID);
    } else {
      // Skip this one...
      return true;
    }
  }

  // If we are talking now....
  if (IsMercSayingDialogue(pSoldier.ubProfile)) {
    // We can do a couple of things now...
    if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 1) {
      // Stop dialigue...
      DialogueAdvanceSpeech();
    } else if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 2) {
      // Skip battle snd...
      return true;
    }
  }

  // Save this one we're doing...
  pSoldier.bOldBattleSnd = ubBattleSoundID;
  pSoldier.uiTimeSameBattleSndDone = GetJA2Clock();

  // Adjust based on morale...
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_OK1 && pSoldier.bMorale < LOW_MORALE_BATTLE_SND_THREASHOLD) {
    ubBattleSoundID = Enum259.BATTLE_SOUND_LOWMARALE_OK1;
  }
  if (ubBattleSoundID == Enum259.BATTLE_SOUND_ATTN1 && pSoldier.bMorale < LOW_MORALE_BATTLE_SND_THREASHOLD) {
    ubBattleSoundID = Enum259.BATTLE_SOUND_LOWMARALE_ATTN1;
  }

  ubSoundID = ubBattleSoundID;

  // if the sound to be played is a confirmation, check to see if we are to play it
  if (ubSoundID == Enum259.BATTLE_SOUND_OK1) {
    if (gGameSettings.fOptions[Enum8.TOPTION_MUTE_CONFIRMATIONS])
      return true;
    // else a speech sound is to be played
    else
      fSpeechSound = true;
  }

  // Randomize between sounds, if appropriate
  if (gBattleSndsData[ubSoundID].ubRandomVal != 0) {
    ubSoundID = ubSoundID + Random(gBattleSndsData[ubSoundID].ubRandomVal);
  }

  // OK, build file and play!
  if (pSoldier.ubProfile != NO_PROFILE) {
    zFilename = sprintf("BATTLESNDS\\%03d_%s.wav", pSoldier.ubProfile, gBattleSndsData[ubSoundID].zName);

    if (!FileExists(zFilename)) {
      // OK, temp build file...
      if (pSoldier.ubBodyType == Enum194.REGFEMALE) {
        zFilename = sprintf("BATTLESNDS\\f_%s.wav", gBattleSndsData[ubSoundID].zName);
      } else {
        zFilename = sprintf("BATTLESNDS\\m_%s.wav", gBattleSndsData[ubSoundID].zName);
      }
    }
  } else {
    // Check if we can play this!
    if (!gBattleSndsData[ubSoundID].fBadGuy) {
      return false;
    }

    if (pSoldier.ubBodyType == Enum194.HATKIDCIV || pSoldier.ubBodyType == Enum194.KIDCIV) {
      if (ubSoundID == Enum259.BATTLE_SOUND_DIE1) {
        zFilename = sprintf("BATTLESNDS\\kid%d_dying.wav", pSoldier.ubBattleSoundID);
      } else {
        zFilename = sprintf("BATTLESNDS\\kid%d_%s.wav", pSoldier.ubBattleSoundID, gBattleSndsData[ubSoundID].zName);
      }
    } else {
      if (ubSoundID == Enum259.BATTLE_SOUND_DIE1) {
        zFilename = sprintf("BATTLESNDS\\bad%d_die.wav", pSoldier.ubBattleSoundID);
      } else {
        zFilename = sprintf("BATTLESNDS\\bad%d_%s.wav", pSoldier.ubBattleSoundID, gBattleSndsData[ubSoundID].zName);
      }
    }
  }

  // Play sound!
  spParms.uiSpeed = RATE_11025;
  // spParms.uiVolume = CalculateSpeechVolume( pSoldier->bVocalVolume );

  spParms.uiVolume = CalculateSpeechVolume(HIGHVOLUME);

  // ATE: Reduce volume for OK sounds...
  // ( Only for all-moves or multi-selection cases... )
  if (bSpecialCode == BATTLE_SND_LOWER_VOLUME) {
    spParms.uiVolume = CalculateSpeechVolume(MIDVOLUME);
  }

  // If we are an enemy.....reduce due to volume
  if (pSoldier.bTeam != gbPlayerNum) {
    spParms.uiVolume = SoundVolume(spParms.uiVolume, pSoldier.sGridNo);
  }

  spParms.uiLoop = 1;
  spParms.uiPan = SoundDir(pSoldier.sGridNo);
  spParms.uiPriority = GROUP_PLAYER;

  if ((uiSoundID = SoundPlay(zFilename, addressof(spParms))) == SOUND_ERROR) {
    return false;
  } else {
    pSoldier.uiBattleSoundID = uiSoundID;

    if (pSoldier.ubProfile != NO_PROFILE) {
      // Get soldier's face ID
      iFaceIndex = pSoldier.iFaceIndex;

      // Check face index
      if (iFaceIndex != -1) {
        ExternSetFaceTalking(iFaceIndex, uiSoundID);
      }
    }

    return true;
  }
}

export function DoMercBattleSound(pSoldier: SOLDIERTYPE, ubBattleSoundID: UINT8): boolean {
  // We WANT to play some RIGHT AWAY.....
  if (gBattleSndsData[ubBattleSoundID].fStopDialogue == 1 || (pSoldier.ubProfile == NO_PROFILE) || InOverheadMap()) {
    return InternalDoMercBattleSound(pSoldier, ubBattleSoundID, 0);
  }

  // So here, only if we were currently saying dialogue.....
  if (!IsMercSayingDialogue(pSoldier.ubProfile)) {
    return InternalDoMercBattleSound(pSoldier, ubBattleSoundID, 0);
  }

  // OK, queue it up otherwise!
  TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, ubBattleSoundID, 0);

  return true;
}

function PreloadSoldierBattleSounds(pSoldier: SOLDIERTYPE, fRemove: boolean): boolean {
  let cnt: UINT32;

  if (pSoldier.bActive == false) {
    return false;
  }

  for (cnt = 0; cnt < Enum259.NUM_MERC_BATTLE_SOUNDS; cnt++) {
    // OK, build file and play!
    if (pSoldier.ubProfile != NO_PROFILE) {
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

  return true;
}

export function CheckSoldierHitRoof(pSoldier: SOLDIERTYPE): boolean {
  // Check if we are near a lower level
  let bNewDirection: INT8;
  let fReturnVal: boolean = false;
  let sNewGridNo: INT16;
  // Default to true
  let fDoForwards: boolean = true;

  if (pSoldier.bLife >= OKLIFE) {
    return false;
  }

  if (FindLowerLevel(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, addressof(bNewDirection)) && (pSoldier.bLevel > 0)) {
    // ONly if standing!
    if (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_STAND) {
      // We are near a lower level.
      // Use opposite direction
      bNewDirection = gOppositeDirection[bNewDirection];

      // Alrighty, let's not blindly change here, look at whether the dest gridno is good!
      sNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(gOppositeDirection[bNewDirection]));
      if (!NewOKDestination(pSoldier, sNewGridNo, true, 0)) {
        return false;
      }
      sNewGridNo = NewGridNo(sNewGridNo, DirectionInc(gOppositeDirection[bNewDirection]));
      if (!NewOKDestination(pSoldier, sNewGridNo, true, 0)) {
        return false;
      }

      // Are wee near enough to fall forwards....
      if (pSoldier.bDirection == gOneCDirection[bNewDirection] || pSoldier.bDirection == gTwoCDirection[bNewDirection] || pSoldier.bDirection == bNewDirection || pSoldier.bDirection == gOneCCDirection[bNewDirection] || pSoldier.bDirection == gTwoCCDirection[bNewDirection]) {
        // Do backwards...
        fDoForwards = false;
      }

      // If we are facing the opposite direction, fall backwards
      // ATE: Make this more usefull...
      if (fDoForwards) {
        pSoldier.sTempNewGridNo = NewGridNo(pSoldier.sGridNo, (-1 * DirectionInc(bNewDirection)));
        pSoldier.sTempNewGridNo = NewGridNo(pSoldier.sTempNewGridNo, (-1 * DirectionInc(bNewDirection)));
        EVENT_SetSoldierDesiredDirection(pSoldier, gOppositeDirection[bNewDirection]);
        pSoldier.fTurningUntilDone = true;
        pSoldier.usPendingAnimation = Enum193.FALLFORWARD_ROOF;
        // EVENT_InitNewSoldierAnim( pSoldier, FALLFORWARD_ROOF, 0 , FALSE );

        // Deduct hitpoints/breath for falling!
        SoldierTakeDamage(pSoldier, ANIM_CROUCH, 100, 5000, TAKE_DAMAGE_FALLROOF, NOBODY, NOWHERE, 0, true);

        fReturnVal = true;
      } else {
        pSoldier.sTempNewGridNo = NewGridNo(pSoldier.sGridNo, (-1 * DirectionInc(bNewDirection)));
        pSoldier.sTempNewGridNo = NewGridNo(pSoldier.sTempNewGridNo, (-1 * DirectionInc(bNewDirection)));
        EVENT_SetSoldierDesiredDirection(pSoldier, bNewDirection);
        pSoldier.fTurningUntilDone = true;
        pSoldier.usPendingAnimation = Enum193.FALLOFF;

        // Deduct hitpoints/breath for falling!
        SoldierTakeDamage(pSoldier, ANIM_CROUCH, 100, 5000, TAKE_DAMAGE_FALLROOF, NOBODY, NOWHERE, 0, true);

        fReturnVal = true;
      }
    }
  }

  return fReturnVal;
}

export function BeginSoldierClimbDownRoof(pSoldier: SOLDIERTYPE): void {
  let bNewDirection: INT8;

  if (FindLowerLevel(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, addressof(bNewDirection)) && (pSoldier.bLevel > 0)) {
    if (EnoughPoints(pSoldier, GetAPsToClimbRoof(pSoldier, true), 0, true)) {
      if (pSoldier.bTeam == gbPlayerNum) {
        // OK, SET INTERFACE FIRST
        SetUIBusy(pSoldier.ubID);
      }

      pSoldier.sTempNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(bNewDirection));

      bNewDirection = gTwoCDirection[bNewDirection];

      pSoldier.ubPendingDirection = bNewDirection;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CLIMBDOWNROOF, 0, false);

      InternalReceivingSoldierCancelServices(pSoldier, false);
      InternalGivingSoldierCancelServices(pSoldier, false);
    }
  }
}

export function MoveMerc(pSoldier: SOLDIERTYPE, dMovementChange: FLOAT, dAngle: FLOAT, fCheckRange: boolean): void {
  let dDegAngle: INT16;
  let dDeltaPos: FLOAT;
  let dXPos: FLOAT;
  let dYPos: FLOAT;
  let fStop: boolean = false;

  dDegAngle = (dAngle * 180 / Math.PI);
  // sprintf( gDebugStr, "Move Angle: %d", (int)dDegAngle );

  // Find delta Movement for X pos
  dDeltaPos = (dMovementChange * Math.sin(dAngle));

  // Find new position
  dXPos = pSoldier.dXPos + dDeltaPos;

  if (fCheckRange) {
    fStop = false;

    switch (pSoldier.bMovementDirection) {
      case Enum245.NORTHEAST:
      case Enum245.EAST:
      case Enum245.SOUTHEAST:

        if (dXPos >= pSoldier.sDestXPos) {
          fStop = true;
        }
        break;

      case Enum245.NORTHWEST:
      case Enum245.WEST:
      case Enum245.SOUTHWEST:

        if (dXPos <= pSoldier.sDestXPos) {
          fStop = true;
        }
        break;

      case Enum245.NORTH:
      case Enum245.SOUTH:

        fStop = true;
        break;
    }

    if (fStop) {
      // dXPos = pSoldier->sDestXPos;
      pSoldier.fPastXDest = true;

      if (pSoldier.sGridNo == pSoldier.sFinalDestination) {
        dXPos = pSoldier.sDestXPos;
      }
    }
  }

  // Find delta Movement for Y pos
  dDeltaPos = (dMovementChange * Math.cos(dAngle));

  // Find new pos
  dYPos = pSoldier.dYPos + dDeltaPos;

  if (fCheckRange) {
    fStop = false;

    switch (pSoldier.bMovementDirection) {
      case Enum245.NORTH:
      case Enum245.NORTHEAST:
      case Enum245.NORTHWEST:

        if (dYPos <= pSoldier.sDestYPos) {
          fStop = true;
        }
        break;

      case Enum245.SOUTH:
      case Enum245.SOUTHWEST:
      case Enum245.SOUTHEAST:

        if (dYPos >= pSoldier.sDestYPos) {
          fStop = true;
        }
        break;

      case Enum245.EAST:
      case Enum245.WEST:

        fStop = true;
        break;
    }

    if (fStop) {
      // dYPos = pSoldier->sDestYPos;
      pSoldier.fPastYDest = true;

      if (pSoldier.sGridNo == pSoldier.sFinalDestination) {
        dYPos = pSoldier.sDestYPos;
      }
    }
  }

  // OK, set new position
  EVENT_InternalSetSoldierPosition(pSoldier, dXPos, dYPos, false, false, false);

  //	DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("X: %f Y: %f", dXPos, dYPos ) );
}

export function GetDirectionFromGridNo(sGridNo: INT16, pSoldier: SOLDIERTYPE): INT16 {
  let sXPos: INT16;
  let sYPos: INT16;

  ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo));

  return GetDirectionFromXY(sXPos, sYPos, pSoldier);
}

export function GetDirectionToGridNoFromGridNo(sGridNoDest: INT16, sGridNoSrc: INT16): INT16 {
  let sXPos2: INT16;
  let sYPos2: INT16;
  let sXPos: INT16;
  let sYPos: INT16;

  ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNoSrc));
  ({ sX: sXPos2, sY: sYPos2 } = ConvertGridNoToXY(sGridNoDest));

  return atan8(sXPos2, sYPos2, sXPos, sYPos);
}

export function GetDirectionFromXY(sXPos: INT16, sYPos: INT16, pSoldier: SOLDIERTYPE): INT16 {
  let sXPos2: INT16;
  let sYPos2: INT16;

  ({ sX: sXPos2, sY: sYPos2 } = ConvertGridNoToXY(pSoldier.sGridNo));

  return atan8(sXPos2, sYPos2, sXPos, sYPos);
}

//#if 0
export function atan8(sXPos: INT16, sYPos: INT16, sXPos2: INT16, sYPos2: INT16): UINT8 {
  let test_x: DOUBLE = sXPos2 - sXPos;
  let test_y: DOUBLE = sYPos2 - sYPos;
  let mFacing: UINT8 = Enum245.WEST;
  let dDegAngle: INT16;
  let angle: DOUBLE;

  if (test_x == 0) {
    test_x = 0.04;
  }

  angle = Math.atan2(test_x, test_y);

  dDegAngle = (angle * 180 / Math.PI);
  // sprintf( gDebugStr, "Move Angle: %d", (int)dDegAngle );

  do {
    if (angle >= -Math.PI * .375 && angle <= -Math.PI * .125) {
      mFacing = Enum245.SOUTHWEST;
      break;
    }

    if (angle <= Math.PI * .375 && angle >= Math.PI * .125) {
      mFacing = Enum245.SOUTHEAST;
      break;
    }

    if (angle >= Math.PI * .623 && angle <= Math.PI * .875) {
      mFacing = Enum245.NORTHEAST;
      break;
    }

    if (angle <= -Math.PI * .623 && angle >= -Math.PI * .875) {
      mFacing = Enum245.NORTHWEST;
      break;
    }

    if (angle > -Math.PI * 0.125 && angle < Math.PI * 0.125) {
      mFacing = Enum245.SOUTH;
    }
    if (angle > Math.PI * 0.375 && angle < Math.PI * 0.623) {
      mFacing = Enum245.EAST;
    }
    if ((angle > Math.PI * 0.875 && angle <= Math.PI) || (angle > -Math.PI && angle < -Math.PI * 0.875)) {
      mFacing = Enum245.NORTH;
    }
    if (angle > -Math.PI * 0.623 && angle < -Math.PI * 0.375) {
      mFacing = Enum245.WEST;
    }
  } while (false);

  return mFacing;
}

function atan8FromAngle(angle: DOUBLE): UINT8 {
  let mFacing: UINT8 = Enum245.WEST;

  if (angle > Math.PI) {
    angle = (angle - Math.PI) - Math.PI;
  }
  if (angle < -Math.PI) {
    angle = (Math.PI - (Math.abs(angle) - Math.PI));
  }

  do {
    if (angle >= -Math.PI * .375 && angle <= -Math.PI * .125) {
      mFacing = Enum245.SOUTHWEST;
      break;
    }

    if (angle <= Math.PI * .375 && angle >= Math.PI * .125) {
      mFacing = Enum245.SOUTHEAST;
      break;
    }

    if (angle >= Math.PI * .623 && angle <= Math.PI * .875) {
      mFacing = Enum245.NORTHEAST;
      break;
    }

    if (angle <= -Math.PI * .623 && angle >= -Math.PI * .875) {
      mFacing = Enum245.NORTHWEST;
      break;
    }

    if (angle > -Math.PI * 0.125 && angle < Math.PI * 0.125) {
      mFacing = Enum245.SOUTH;
    }
    if (angle > Math.PI * 0.375 && angle < Math.PI * 0.623) {
      mFacing = Enum245.EAST;
    }
    if ((angle > Math.PI * 0.875 && angle <= Math.PI) || (angle > -Math.PI && angle < -Math.PI * 0.875)) {
      mFacing = Enum245.NORTH;
    }
    if (angle > -Math.PI * 0.623 && angle < -Math.PI * 0.375) {
      mFacing = Enum245.WEST;
    }
  } while (false);

  return mFacing;
}

function CheckForFullStructures(pSoldier: SOLDIERTYPE): void {
  // This function checks to see if we are near a specific structure type which requires us to blit a
  // small obscuring peice
  let sGridNo: INT16;
  let usFullTileIndex: UINT16;
  let cnt: INT32;

  // Check in all 'Above' directions
  for (cnt = 0; cnt < MAX_FULLTILE_DIRECTIONS; cnt++) {
    sGridNo = pSoldier.sGridNo + gsFullTileDirections[cnt];

    if (CheckForFullStruct(sGridNo, addressof(usFullTileIndex))) {
      // Add one for the item's obsuring part
      pSoldier.usFrontArcFullTileList[cnt] = usFullTileIndex + 1;
      pSoldier.usFrontArcFullTileGridNos[cnt] = sGridNo;
      AddTopmostToHead(sGridNo, pSoldier.usFrontArcFullTileList[cnt]);
    } else {
      if (pSoldier.usFrontArcFullTileList[cnt] != 0) {
        RemoveTopmost(pSoldier.usFrontArcFullTileGridNos[cnt], pSoldier.usFrontArcFullTileList[cnt]);
      }
      pSoldier.usFrontArcFullTileList[cnt] = 0;
      pSoldier.usFrontArcFullTileGridNos[cnt] = 0;
    }
  }
}

function CheckForFullStruct(sGridNo: INT16, pusIndex: Pointer<UINT16>): boolean {
  let pStruct: Pointer<LEVELNODE> = null;
  let pOldStruct: Pointer<LEVELNODE> = null;
  let fTileFlags: UINT32;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != null) {
    if (pStruct.value.usIndex != NO_TILE && pStruct.value.usIndex < Enum312.NUMBEROFTILES) {
      fTileFlags = GetTileFlags(pStruct.value.usIndex);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      // if( (pOldStruct->pStructureData!=NULL) && ( pOldStruct->pStructureData->fFlags&STRUCTURE_TREE ) )
      if (fTileFlags & FULL3D_TILE) {
        // CHECK IF THIS TREE IS FAIRLY ALONE!
        if (FullStructAlone(sGridNo, 2)) {
          // Return true and return index
          pusIndex.value = pOldStruct.value.usIndex;
          return true;
        } else {
          return false;
        }
      }
    } else {
      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;
    }
  }

  // Could not find it, return FALSE
  return false;
}

function FullStructAlone(sGridNo: INT16, ubRadius: UINT8): boolean {
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
          if (FindStructure(iNewIndex, STRUCTURE_TREE) != null) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

function AdjustForFastTurnAnimation(pSoldier: SOLDIERTYPE): void {
  // CHECK FOR FASTTURN ANIMATIONS
  // ATE: Mod: Only fastturn for OUR guys!
  if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_FASTTURN && pSoldier.bTeam == gbPlayerNum && !(pSoldier.uiStatusFlags & SOLDIER_TURNINGFROMHIT)) {
    if (pSoldier.bDirection != pSoldier.bDesiredDirection) {
      pSoldier.sAniDelay = FAST_TURN_ANIM_SPEED;
    } else {
      SetSoldierAniSpeed(pSoldier);
      //	FreeUpNPCFromTurning( pSoldier, LOOK);
    }
  }
}

function IsActionInterruptable(pSoldier: SOLDIERTYPE): boolean {
  if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_NONINTERRUPT) {
    return false;
  }
  return true;
}

// WRAPPER FUNCTIONS FOR SOLDIER EVENTS
function SendSoldierPositionEvent(pSoldier: SOLDIERTYPE, dNewXPos: FLOAT, dNewYPos: FLOAT): void {
  // Sent event for position update
  let SSetPosition: EV_S_SETPOSITION = createEvSSetPosition();

  SSetPosition.usSoldierID = pSoldier.ubID;
  SSetPosition.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;

  SSetPosition.dNewXPos = dNewXPos;
  SSetPosition.dNewYPos = dNewYPos;

  AddGameEvent(Enum319.S_SETPOSITION, 0, SSetPosition);
}

function SendSoldierDestinationEvent(pSoldier: SOLDIERTYPE, usNewDestination: UINT16): void {
  // Sent event for position update
  let SChangeDest: EV_S_CHANGEDEST = createEvSChangeDest();

  SChangeDest.usSoldierID = pSoldier.ubID;
  SChangeDest.usNewDestination = usNewDestination;
  SChangeDest.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_CHANGEDEST, 0, SChangeDest);
}

function SendSoldierSetDirectionEvent(pSoldier: SOLDIERTYPE, usNewDirection: UINT16): void {
  // Sent event for position update
  let SSetDirection: EV_S_SETDIRECTION = createEvSSetDirection();

  SSetDirection.usSoldierID = pSoldier.ubID;
  SSetDirection.usNewDirection = usNewDirection;
  SSetDirection.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_SETDIRECTION, 0, SSetDirection);
}

export function SendSoldierSetDesiredDirectionEvent(pSoldier: SOLDIERTYPE, usDesiredDirection: UINT16): void {
  // Sent event for position update
  let SSetDesiredDirection: EV_S_SETDESIREDDIRECTION = createEvSSetDesiredDirection();

  SSetDesiredDirection.usSoldierID = pSoldier.ubID;
  SSetDesiredDirection.usDesiredDirection = usDesiredDirection;
  SSetDesiredDirection.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_SETDESIREDDIRECTION, 0, SSetDesiredDirection);
}

export function SendGetNewSoldierPathEvent(pSoldier: SOLDIERTYPE, sDestGridNo: UINT16, usMovementAnim: UINT16): void {
  let SGetNewPath: EV_S_GETNEWPATH = createEvSGetNewPath();

  SGetNewPath.usSoldierID = pSoldier.ubID;
  SGetNewPath.sDestGridNo = sDestGridNo;
  SGetNewPath.usMovementAnim = usMovementAnim;
  SGetNewPath.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_GETNEWPATH, 0, SGetNewPath);
}

export function SendChangeSoldierStanceEvent(pSoldier: SOLDIERTYPE, ubNewStance: UINT8): void {
  ChangeSoldierStance(pSoldier, ubNewStance);
}

export function SendBeginFireWeaponEvent(pSoldier: SOLDIERTYPE, sTargetGridNo: INT16): void {
  let SBeginFireWeapon: EV_S_BEGINFIREWEAPON = createEvSBeginFireWeapon();

  SBeginFireWeapon.usSoldierID = pSoldier.ubID;
  SBeginFireWeapon.sTargetGridNo = sTargetGridNo;
  SBeginFireWeapon.bTargetLevel = pSoldier.bTargetLevel;
  SBeginFireWeapon.bTargetCubeLevel = pSoldier.bTargetCubeLevel;
  SBeginFireWeapon.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;

  AddGameEvent(Enum319.S_BEGINFIREWEAPON, 0, SBeginFireWeapon);
}

// This function just encapolates the check for turnbased and having an attacker in the first place
export function ReleaseSoldiersAttacker(pSoldier: SOLDIERTYPE): void {
  let cnt: INT32;
  let ubNumToFree: UINT8;

  // if ( gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT) )
  {
    // ATE: Removed...
    // if ( pSoldier->ubAttackerID != NOBODY )
    {
      // JA2 Gold
      // set next-to-previous attacker, so long as this isn't a repeat attack
      if (pSoldier.ubPreviousAttackerID != pSoldier.ubAttackerID) {
        pSoldier.ubNextToPreviousAttackerID = pSoldier.ubPreviousAttackerID;
      }

      // get previous attacker id
      pSoldier.ubPreviousAttackerID = pSoldier.ubAttackerID;

      // Copy BeingAttackedCount here....
      ubNumToFree = pSoldier.bBeingAttackedCount;
      // Zero it out BEFORE, as supression may increase it again...
      pSoldier.bBeingAttackedCount = 0;

      for (cnt = 0; cnt < ubNumToFree; cnt++) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Freeing up attacker of %d (attacker is %d) - releasesoldierattacker num to free is %d", pSoldier.ubID, pSoldier.ubAttackerID, ubNumToFree));
        ReduceAttackBusyCount(pSoldier.ubAttackerID, false);
      }

      // ATE: Set to NOBODY if this person is NOT dead
      // otherise, we keep it so the kill can be awarded!
      if (pSoldier.bLife != 0 && pSoldier.ubBodyType != Enum194.QUEENMONSTER) {
        pSoldier.ubAttackerID = NOBODY;
      }
    }
  }
}

export function MercInWater(pSoldier: SOLDIERTYPE): boolean {
  // Our water texture , for now is of a given type
  if (pSoldier.bOverTerrainType == Enum315.LOW_WATER || pSoldier.bOverTerrainType == Enum315.MED_WATER || pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
    return true;
  } else {
    return false;
  }
}

function RevivePlayerTeam(): void {
  let cnt: INT32;
  let pSoldier: SOLDIERTYPE;

  // End the turn of player charactors
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    ReviveSoldier(pSoldier);
  }
}

export function ReviveSoldier(pSoldier: SOLDIERTYPE): void {
  let sX: INT16;
  let sY: INT16;

  if (pSoldier.bLife < OKLIFE && pSoldier.bActive) {
    // If dead or unconscious, revive!
    pSoldier.uiStatusFlags &= (~SOLDIER_DEAD);

    pSoldier.bLife = pSoldier.bLifeMax;
    pSoldier.bBleeding = 0;
    pSoldier.ubDesiredHeight = ANIM_STAND;

    AddManToTeam(pSoldier.bTeam);

    // Set to standing
    pSoldier.fInNonintAnim = false;
    pSoldier.fRTInNonintAnim = false;

    // Change to standing,unless we can getup with an animation
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, true);
    BeginSoldierGetup(pSoldier);

    // Makesure center of tile
    sX = CenterX(pSoldier.sGridNo);
    sY = CenterY(pSoldier.sGridNo);

    EVENT_SetSoldierPosition(pSoldier, sX, sY);

    // Dirty INterface
    fInterfacePanelDirty = DIRTYLEVEL2;
  }
}

function HandleAnimationProfile(pSoldier: SOLDIERTYPE, usAnimState: UINT16, fRemove: boolean): void {
  //#if 0
  let pProfile: ANIM_PROF;
  let pProfileDir: ANIM_PROF_DIR;
  let pProfileTile: ANIM_PROF_TILE;
  let bProfileID: INT8;
  let iTileCount: UINT32;
  let sGridNo: INT16;
  let usAnimSurface: UINT16;

  // ATE

  // Get Surface Index
  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    return;
  }

  bProfileID = gAnimSurfaceDatabase[usAnimSurface].bProfile;

  // Determine if this animation has a profile
  if (bProfileID != -1) {
    // Getprofile
    pProfile = gpAnimProfiles[bProfileID];

    // Get direction
    pProfileDir = pProfile.Dirs[pSoldier.bDirection];

    // Loop tiles and set accordingly into world
    for (iTileCount = 0; iTileCount < pProfileDir.ubNumTiles; iTileCount++) {
      pProfileTile = pProfileDir.pTiles[iTileCount];

      sGridNo = pSoldier.sGridNo + ((WORLD_COLS * pProfileTile.bTileY) + pProfileTile.bTileX);

      // Check if in bounds
      if (!OutOfBounds(pSoldier.sGridNo, sGridNo)) {
        if (fRemove) {
          // Remove from world
          RemoveMerc(sGridNo, pSoldier, true);
        } else {
          // PLace into world
          AddMercToHead(sGridNo, pSoldier, false);
          // if ( pProfileTile->bTileY != 0 || pProfileTile->bTileX != 0 )
          {
            (<LEVELNODE>gpWorldLevelData[sGridNo].pMercHead).uiFlags |= LEVELNODE_MERCPLACEHOLDER;
            (<LEVELNODE>gpWorldLevelData[sGridNo].pMercHead).uiAnimHitLocationFlags = pProfileTile.usTileFlags;
          }
        }
      }
    }
  }

  //#endif
}

export function GetAnimProfileFlags(sGridNo: UINT16, usFlags: Pointer<UINT16>, ppTargSoldier: Pointer<Pointer<SOLDIERTYPE>>, pGivenNode: LEVELNODE | null): LEVELNODE | null {
  let pNode: LEVELNODE | null;

  (ppTargSoldier.value) = null;
  (usFlags.value) = 0;

  if (pGivenNode == null) {
    pNode = gpWorldLevelData[sGridNo].pMercHead;
  } else {
    pNode = pGivenNode.pNext;
  }

  //#if 0

  if (pNode != null) {
    if (pNode.uiFlags & LEVELNODE_MERCPLACEHOLDER) {
      (usFlags.value) = pNode.uiAnimHitLocationFlags;
      (ppTargSoldier.value) = pNode.pSoldier;
    }
  }

  //#endif

  return pNode;
}

function GetProfileFlagsFromGridno(pSoldier: SOLDIERTYPE, usAnimState: UINT16, sTestGridNo: UINT16, usFlags: Pointer<UINT16>): boolean {
  let pProfile: ANIM_PROF;
  let pProfileDir: ANIM_PROF_DIR;
  let pProfileTile: ANIM_PROF_TILE;
  let bProfileID: INT8;
  let iTileCount: UINT32;
  let sGridNo: INT16;
  let usAnimSurface: UINT16;

  // Get Surface Index
  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    return false;
  }

  bProfileID = gAnimSurfaceDatabase[usAnimSurface].bProfile;

  usFlags.value = 0;

  // Determine if this animation has a profile
  if (bProfileID != -1) {
    // Getprofile
    pProfile = gpAnimProfiles[bProfileID];

    // Get direction
    pProfileDir = pProfile.Dirs[pSoldier.bDirection];

    // Loop tiles and set accordingly into world
    for (iTileCount = 0; iTileCount < pProfileDir.ubNumTiles; iTileCount++) {
      pProfileTile = pProfileDir.pTiles[iTileCount];

      sGridNo = pSoldier.sGridNo + ((WORLD_COLS * pProfileTile.bTileY) + pProfileTile.bTileX);

      // Check if in bounds
      if (!OutOfBounds(pSoldier.sGridNo, sGridNo)) {
        if (sGridNo == sTestGridNo) {
          usFlags.value = pProfileTile.usTileFlags;
          return true;
        }
      }
    }
  }

  return false;
}

export function EVENT_SoldierBeginGiveItem(pSoldier: SOLDIERTYPE): void {
  let pTSoldier: SOLDIERTYPE;

  if (VerifyGiveItem(pSoldier, addressof(pTSoldier))) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    pSoldier.bDesiredDirection = pSoldier.bPendingActionData3;
    pSoldier.bDirection = pSoldier.bPendingActionData3;

    // begin animation
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.GIVE_ITEM, 0, false);
  } else {
    UnSetEngagedInConvFromPCAction(pSoldier);

    MemFree(pSoldier.pTempObject);
  }
}

export function EVENT_SoldierBeginBladeAttack(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  let pTSoldier: SOLDIERTYPE;
  // UINT32 uiMercFlags;
  let usSoldierIndex: UINT16;
  let ubTDirection: UINT8;
  let fChangeDirection: boolean = false;
  let pCorpse: ROTTING_CORPSE | null;

  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Begin blade attack: ATB  %d", gTacticalStatus.ubAttackBusyCount));

  //}

  // CHANGE DIRECTION AND GOTO ANIMATION NOW
  EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  EVENT_SetSoldierDirection(pSoldier, ubDirection);
  // CHANGE TO ANIMATION

  // DETERMINE ANIMATION TO PLAY
  // LATER BASED ON IF TAREGT KNOWS OF US, STANCE, ETC
  // GET POINTER TO TAREGT
  if (pSoldier.uiStatusFlags & SOLDIER_MONSTER) {
    let ubTargetID: UINT8;

    // Is there an unconscious guy at gridno......
    ubTargetID = WhoIsThere2(sGridNo, pSoldier.bTargetLevel);

    if (ubTargetID != NOBODY && ((MercPtrs[ubTargetID].bLife < OKLIFE && MercPtrs[ubTargetID].bLife > 0) || (MercPtrs[ubTargetID].bBreath < OKBREATH && MercPtrs[ubTargetID].bCollapsed))) {
      pSoldier.uiPendingActionData4 = ubTargetID;
      // add regen bonus
      pSoldier.bRegenerationCounter++;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.MONSTER_BEGIN_EATTING_FLESH, 0, false);
    } else {
      if (PythSpacesAway(pSoldier.sGridNo, sGridNo) <= 1) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.MONSTER_CLOSE_ATTACK, 0, false);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADULTMONSTER_ATTACKING, 0, false);
      }
    }
  } else if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
    // Check if it's a claws or teeth...
    if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.BLOODCAT_CLAW_ATTACK) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.BLOODCAT_SWIPE, 0, false);
    } else {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.BLOODCAT_BITE_ANIM, 0, false);
    }
  } else {
    usSoldierIndex = WhoIsThere2(sGridNo, pSoldier.bTargetLevel);
    if (usSoldierIndex != NOBODY) {
      pTSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

      // Look at stance of target
      switch (gAnimControl[pTSoldier.usAnimState].ubEndHeight) {
        case ANIM_STAND:
        case ANIM_CROUCH:

          // CHECK IF HE CAN SEE US, IF SO RANDOMIZE
          if (pTSoldier.bOppList[pSoldier.ubID] == 0 && pTSoldier.bTeam != pSoldier.bTeam) {
            // WE ARE NOT SEEN
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.STAB, 0, false);
          } else {
            // WE ARE SEEN
            if (Random(50) > 25) {
              EVENT_InitNewSoldierAnim(pSoldier, Enum193.STAB, 0, false);
            } else {
              EVENT_InitNewSoldierAnim(pSoldier, Enum193.SLICE, 0, false);
            }

            // IF WE ARE SEEN, MAKE SURE GUY TURNS!
            // Get direction to target
            // IF WE ARE AN ANIMAL, CAR, MONSTER, DONT'T TURN
            if (!(pTSoldier.uiStatusFlags & (SOLDIER_MONSTER | SOLDIER_ANIMAL | SOLDIER_VEHICLE))) {
              // OK, stop merc....
              EVENT_StopMerc(pTSoldier, pTSoldier.sGridNo, pTSoldier.bDirection);

              if (pTSoldier.bTeam != gbPlayerNum) {
                CancelAIAction(pTSoldier, 1);
              }

              ubTDirection = GetDirectionFromGridNo(pSoldier.sGridNo, pTSoldier);
              SendSoldierSetDesiredDirectionEvent(pTSoldier, ubTDirection);
            }
          }

          break;

        case ANIM_PRONE:

          // CHECK OUR STANCE
          if (gAnimControl[pSoldier.usAnimState].ubEndHeight != ANIM_CROUCH) {
            // SET DESIRED STANCE AND SET PENDING ANIMATION
            SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
            pSoldier.usPendingAnimation = Enum193.CROUCH_STAB;
          } else {
            // USE crouched one
            // NEED TO CHANGE STANCE IF NOT CROUCHD!
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCH_STAB, 0, false);
          }
          break;
      }
    } else {
      // OK, SEE IF THERE IS AN OBSTACLE HERE...
      if (!NewOKDestination(pSoldier, sGridNo, false, pSoldier.bLevel)) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.STAB, 0, false);
      } else {
        // Check for corpse!
        pCorpse = GetCorpseAtGridNo(sGridNo, pSoldier.bLevel);

        if (pCorpse == null) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCH_STAB, 0, false);
        } else {
          if (IsValidDecapitationCorpse(pCorpse)) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.DECAPITATE, 0, false);
          } else {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROUCH_STAB, 0, false);
          }
        }
      }
    }
  }

  // SET TARGET GRIDNO
  pSoldier.sTargetGridNo = sGridNo;
  pSoldier.bTargetLevel = pSoldier.bLevel;
  pSoldier.ubTargetID = WhoIsThere2(sGridNo, pSoldier.bTargetLevel);
}

export function EVENT_SoldierBeginPunchAttack(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  let fMartialArtist: boolean = false;
  let pTSoldier: SOLDIERTYPE;
  // UINT32 uiMercFlags;
  let usSoldierIndex: UINT16;
  let ubTDirection: UINT8;
  let fChangeDirection: boolean = false;
  let usItem: UINT16;

  // Get item in hand...
  usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Begin HTH attack: ATB  %d", gTacticalStatus.ubAttackBusyCount));

  //}

  // get target.....
  usSoldierIndex = WhoIsThere2(pSoldier.sTargetGridNo, pSoldier.bLevel);
  if (usSoldierIndex != NOBODY) {
    pTSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

    fChangeDirection = true;
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
    fMartialArtist = true;
  }

  if (fMartialArtist && !AreInMeanwhile() && usItem != Enum225.CROWBAR) {
    // Are we in attack mode yet?
    if (pSoldier.usAnimState != Enum193.NINJA_BREATH && gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_STAND && gAnimControl[pTSoldier.usAnimState].ubHeight != ANIM_PRONE) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.NINJA_GOTOBREATH, 0, false);
    } else {
      DoNinjaAttack(pSoldier);
    }
  } else {
    // Look at stance of target
    switch (gAnimControl[pTSoldier.usAnimState].ubEndHeight) {
      case ANIM_STAND:
      case ANIM_CROUCH:

        if (usItem != Enum225.CROWBAR) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH, 0, false);
        } else {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CROWBAR_ATTACK, 0, false);
        }

        // CHECK IF HE CAN SEE US, IF SO CHANGE DIR
        if (pTSoldier.bOppList[pSoldier.ubID] == 0 && pTSoldier.bTeam != pSoldier.bTeam) {
          // Get direction to target
          // IF WE ARE AN ANIMAL, CAR, MONSTER, DONT'T TURN
          if (!(pTSoldier.uiStatusFlags & (SOLDIER_MONSTER | SOLDIER_ANIMAL | SOLDIER_VEHICLE))) {
            // OK, stop merc....
            EVENT_StopMerc(pTSoldier, pTSoldier.sGridNo, pTSoldier.bDirection);

            if (pTSoldier.bTeam != gbPlayerNum) {
              CancelAIAction(pTSoldier, 1);
            }

            ubTDirection = GetDirectionFromGridNo(pSoldier.sGridNo, pTSoldier);
            SendSoldierSetDesiredDirectionEvent(pTSoldier, ubTDirection);
          }
        }
        break;

      case ANIM_PRONE:

        // CHECK OUR STANCE
        // ATE: Added this for CIV body types 'cause of elliot
        if (!IS_MERC_BODY_TYPE(pSoldier)) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH, 0, false);
        } else {
          if (gAnimControl[pSoldier.usAnimState].ubEndHeight != ANIM_CROUCH) {
            // SET DESIRED STANCE AND SET PENDING ANIMATION
            SendChangeSoldierStanceEvent(pSoldier, ANIM_CROUCH);
            pSoldier.usPendingAnimation = Enum193.PUNCH_LOW;
          } else {
            // USE crouched one
            // NEED TO CHANGE STANCE IF NOT CROUCHD!
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.PUNCH_LOW, 0, false);
          }
        }
        break;
    }
  }

  // SET TARGET GRIDNO
  pSoldier.sTargetGridNo = sGridNo;
  pSoldier.bTargetLevel = pSoldier.bLevel;
  pSoldier.sLastTarget = sGridNo;
  pSoldier.ubTargetID = WhoIsThere2(sGridNo, pSoldier.bTargetLevel);
}

export function EVENT_SoldierBeginKnifeThrowAttack(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  // Increment the number of people busy doing stuff because of an attack
  // if ( (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) )
  //{
  gTacticalStatus.ubAttackBusyCount++;
  //}
  pSoldier.bBulletsLeft = 1;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting knifethrow attack, bullets left %d", pSoldier.bBulletsLeft));

  EVENT_InitNewSoldierAnim(pSoldier, Enum193.THROW_KNIFE, 0, false);

  // CHANGE DIRECTION AND GOTO ANIMATION NOW
  EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  EVENT_SetSoldierDirection(pSoldier, ubDirection);

  // SET TARGET GRIDNO
  pSoldier.sTargetGridNo = sGridNo;
  pSoldier.sLastTarget = sGridNo;
  pSoldier.fTurningFromPronePosition = 0;
  // NB target level must be set by functions outside of here... but I think it
  // is already set in HandleItem or in the AI code - CJC
  pSoldier.ubTargetID = WhoIsThere2(sGridNo, pSoldier.bTargetLevel);
}

export function EVENT_SoldierBeginDropBomb(pSoldier: SOLDIERTYPE): void {
  // Increment the number of people busy doing stuff because of an attack
  switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
    case ANIM_STAND:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.PLANT_BOMB, 0, false);
      break;

    default:

      // Call hander for planting bomb...
      HandleSoldierDropBomb(pSoldier, pSoldier.sPendingActionData2);
      SoldierGotoStationaryStance(pSoldier);
      break;
  }
}

export function EVENT_SoldierBeginUseDetonator(pSoldier: SOLDIERTYPE): void {
  // Increment the number of people busy doing stuff because of an attack
  switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
    case ANIM_STAND:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.USE_REMOTE, 0, false);
      break;

    default:

      // Call hander for planting bomb...
      HandleSoldierUseRemote(pSoldier, pSoldier.sPendingActionData2);
      break;
  }
}

export function EVENT_SoldierBeginFirstAid(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  let pTSoldier: SOLDIERTYPE;
  // UINT32 uiMercFlags;
  let usSoldierIndex: UINT16;
  let fRefused: boolean = false;

  usSoldierIndex = WhoIsThere2(sGridNo, pSoldier.bLevel);
  if (usSoldierIndex != NOBODY) {
    pTSoldier = MercPtrs[usSoldierIndex];

    // OK, check if we should play quote...
    if (pTSoldier.bTeam != gbPlayerNum) {
      if (pTSoldier.ubProfile != NO_PROFILE && pTSoldier.ubProfile >= FIRST_RPC && !RPC_RECRUITED(pTSoldier)) {
        fRefused = PCDoesFirstAidOnNPC(pTSoldier.ubProfile);
      }

      if (!fRefused) {
        if (CREATURE_OR_BLOODCAT(pTSoldier)) {
          // nope!!
          fRefused = true;
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, Message[Enum334.STR_REFUSE_FIRSTAID_FOR_CREATURE]);
        } else if (!pTSoldier.bNeutral && pTSoldier.bLife >= OKLIFE && pTSoldier.bSide != pSoldier.bSide) {
          fRefused = true;
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, Message[Enum334.STR_REFUSE_FIRSTAID]);
        }
      }
    }

    if (fRefused) {
      UnSetUIBusy(pSoldier.ubID);
      return;
    }

    // ATE: We can only give firsty aid to one perosn at a time... cancel
    // any now...
    InternalGivingSoldierCancelServices(pSoldier, false);

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
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.START_AID, 0, false);
    }

    // SET TARGET GRIDNO
    pSoldier.sTargetGridNo = sGridNo;

    // SET PARTNER ID
    pSoldier.ubServicePartner = usSoldierIndex;

    // SET PARTNER'S COUNT REFERENCE
    pTSoldier.ubServiceCount++;

    // If target and doer are no the same guy...
    if (pTSoldier.ubID != pSoldier.ubID && !pTSoldier.bCollapsed) {
      SoldierGotoStationaryStance(pTSoldier);
    }
  }
}

export function EVENT_SoldierEnterVehicle(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  let pTSoldier: SOLDIERTYPE;
  let uiMercFlags: UINT32;
  let usSoldierIndex: UINT16;

  if (FindSoldier(sGridNo, addressof(usSoldierIndex), addressof(uiMercFlags), FIND_SOLDIER_GRIDNO)) {
    pTSoldier = MercPtrs[usSoldierIndex];

    // Enter vehicle...
    EnterVehicle(pTSoldier, pSoldier);
  }

  UnSetUIBusy(pSoldier.ubID);
}

export function SoldierDressWound(pSoldier: SOLDIERTYPE, pVictim: SOLDIERTYPE, sKitPts: INT16, sStatus: INT16): UINT32 {
  let uiDressSkill: UINT32;
  let uiPossible: UINT32;
  let uiActual: UINT32;
  let uiMedcost: UINT32;
  let uiDeficiency: UINT32;
  let uiAvailAPs: UINT32;
  let uiUsedAPs: UINT32;
  let ubBelowOKlife: UINT8;
  let ubPtsLeft: UINT8;
  let fRanOut: boolean = false;

  if (pVictim.bBleeding < 1 && pVictim.bLife >= OKLIFE) {
    return (0); // nothing to do, shouldn't have even been called!
  }

  if (pVictim.bLife == 0) {
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
  uiAvailAPs = pSoldier.bActionPoints;

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

  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
  {
    uiPossible += (uiPossible / 2); // add extra 50 %
  }

  uiActual = uiPossible; // start by assuming maximum possible

  // figure out how far below OKLIFE the victim is
  if (pVictim.bLife >= OKLIFE) {
    ubBelowOKlife = 0;
  } else {
    ubBelowOKlife = OKLIFE - pVictim.bLife;
  }

  // figure out how many healing pts we need to stop dying (2x cost)
  uiDeficiency = (2 * ubBelowOKlife);

  // if, after that, the patient will still be bleeding
  if ((pVictim.bBleeding - ubBelowOKlife) > 0) {
    // then add how many healing pts we need to stop bleeding (1x cost)
    uiDeficiency += (pVictim.bBleeding - ubBelowOKlife);
  }

  // now, make sure we weren't going to give too much
  if (uiActual > uiDeficiency) // if we were about to apply too much
    uiActual = uiDeficiency; // reduce actual not to waste anything

  // now make sure we HAVE that much
  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.MEDICKIT) {
    uiMedcost = (uiActual + 1) / 2; // cost is only half, rounded up

    if (uiMedcost > sKitPts) // if we can't afford this
    {
      fRanOut = true;
      uiMedcost = sKitPts; // what CAN we afford?
      uiActual = uiMedcost * 2; // give double this as aid
    }
  } else {
    uiMedcost = uiActual;

    if (uiMedcost > sKitPts) // can't afford it
    {
      fRanOut = true;
      uiMedcost = uiActual = sKitPts; // recalc cost AND aid
    }
  }

  ubPtsLeft = uiActual;

  // heal real life points first (if below OKLIFE) because we don't want the
  // patient still DYING if bandages run out, or medic is disabled/distracted!
  // NOTE: Dressing wounds for life below OKLIFE now costs 2 pts/life point!
  if (ubPtsLeft && pVictim.bLife < OKLIFE) {
    // if we have enough points to bring him all the way to OKLIFE this turn
    if (ubPtsLeft >= (2 * ubBelowOKlife)) {
      // raise life to OKLIFE
      pVictim.bLife = OKLIFE;

      // reduce bleeding by the same number of life points healed up
      pVictim.bBleeding -= ubBelowOKlife;

      // use up appropriate # of actual healing points
      ubPtsLeft -= (2 * ubBelowOKlife);
    } else {
      pVictim.bLife += (ubPtsLeft / 2);
      pVictim.bBleeding -= (ubPtsLeft / 2);

      ubPtsLeft = ubPtsLeft % 2; // if ptsLeft was odd, ptsLeft = 1
    }

    // this should never happen any more, but make sure bleeding not negative
    if (pVictim.bBleeding < 0) {
      pVictim.bBleeding = 0;
    }

    // if this healing brought the patient out of the worst of it, cancel dying
    if (pVictim.bLife >= OKLIFE) {
      // pVictim->dying = pVictim->dyingComment = FALSE;
      // pVictim->shootOn = TRUE;

      // turn off merc QUOTE flags
      pVictim.fDyingComment = false;
    }

    // update patient's entire panel (could have regained consciousness, etc.)
  }

  // if any healing points remain, apply that to any remaining bleeding (1/1)
  // DON'T spend any APs/kit pts to cure bleeding until merc is no longer dying
  // if ( ubPtsLeft && pVictim->bBleeding && !pVictim->dying)
  if (ubPtsLeft && pVictim.bBleeding) {
    // if we have enough points to bandage all remaining bleeding this turn
    if (ubPtsLeft >= pVictim.bBleeding) {
      ubPtsLeft -= pVictim.bBleeding;
      pVictim.bBleeding = 0;
    } else // bandage what we can
    {
      pVictim.bBleeding -= ubPtsLeft;
      ubPtsLeft = 0;
    }

    // update patient's life bar only
  }

  // if wound has been dressed enough so that bleeding won't occur, turn off
  // the "warned about bleeding" flag so merc tells us about the next bleeding
  if (pVictim.bBleeding <= MIN_BLEEDING_THRESHOLD) {
    pVictim.fWarnedAboutBleeding = false;
  }

  // if there are any ptsLeft now, then we didn't actually get to use them
  uiActual -= ubPtsLeft;

  // usedAPs equals (actionPts) * (%of possible points actually used)
  uiUsedAPs = (uiActual * uiAvailAPs) / uiPossible;

  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
  {
    uiUsedAPs = (uiUsedAPs * 2) / 3; // reverse 50% bonus by taking 2/3rds
  }

  DeductPoints(pSoldier, uiUsedAPs, ((uiUsedAPs * BP_PER_AP_LT_EFFORT)));

  if (PTR_OURTEAM(pSoldier)) {
    // MEDICAL GAIN   (actual / 2):  Helped someone by giving first aid
    StatChange(pSoldier, MEDICALAMT, (uiActual / 2), 0);

    // DEXTERITY GAIN (actual / 6):  Helped someone by giving first aid
    StatChange(pSoldier, DEXTAMT, (uiActual / 6), 0);
  }

  return uiMedcost;
}

function InternalReceivingSoldierCancelServices(pSoldier: SOLDIERTYPE, fPlayEndAnim: boolean): void {
  let pTSoldier: SOLDIERTYPE;
  let cnt: INT32;

  if (pSoldier.ubServiceCount > 0) {
    // Loop through guys who have us as servicing
    for (pTSoldier = Menptr[0], cnt = 0; cnt < MAX_NUM_SOLDIERS; cnt++, pTSoldier = Menptr[cnt]) {
      if (pTSoldier.bActive) {
        if (pTSoldier.ubServicePartner == pSoldier.ubID) {
          // END SERVICE!
          pSoldier.ubServiceCount--;

          pTSoldier.ubServicePartner = NOBODY;

          if (gTacticalStatus.fAutoBandageMode) {
            pSoldier.ubAutoBandagingMedic = NOBODY;

            ActionDone(pTSoldier);
          } else {
            // don't use end aid animation in autobandage
            if (pTSoldier.bLife >= OKLIFE && pTSoldier.bBreath > 0 && fPlayEndAnim) {
              EVENT_InitNewSoldierAnim(pTSoldier, Enum193.END_AID, 0, false);
            }
          }
        }
      }
    }
  }
}

export function ReceivingSoldierCancelServices(pSoldier: SOLDIERTYPE): void {
  InternalReceivingSoldierCancelServices(pSoldier, true);
}

export function InternalGivingSoldierCancelServices(pSoldier: SOLDIERTYPE, fPlayEndAnim: boolean): void {
  let pTSoldier: SOLDIERTYPE;

  // GET TARGET SOLDIER
  if (pSoldier.ubServicePartner != NOBODY) {
    pTSoldier = MercPtrs[pSoldier.ubServicePartner];

    // END SERVICE!
    pTSoldier.ubServiceCount--;

    pSoldier.ubServicePartner = NOBODY;

    if (gTacticalStatus.fAutoBandageMode) {
      pTSoldier.ubAutoBandagingMedic = NOBODY;

      ActionDone(pSoldier);
    } else {
      if (pSoldier.bLife >= OKLIFE && pSoldier.bBreath > 0 && fPlayEndAnim) {
        // don't use end aid animation in autobandage
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_AID, 0, false);
      }
    }
  }
}

export function GivingSoldierCancelServices(pSoldier: SOLDIERTYPE): void {
  InternalGivingSoldierCancelServices(pSoldier, true);
}

export function HaultSoldierFromSighting(pSoldier: SOLDIERTYPE, fFromSightingEnemy: boolean): void {
  // SEND HUALT EVENT!
  // EV_S_STOP_MERC				SStopMerc;

  // SStopMerc.sGridNo					= pSoldier->sGridNo;
  // SStopMerc.bDirection			= pSoldier->bDirection;
  // SStopMerc.usSoldierID			= pSoldier->ubID;
  // AddGameEvent( S_STOP_MERC, 0, &SStopMerc );

  // If we are a 'specialmove... ignore...
  if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_SPECIALMOVE)) {
    return;
  }

  // OK, check if we were going to throw something, and give it back if so!
  if (pSoldier.pTempObject != null && fFromSightingEnemy) {
    // Place it back into inv....
    AutoPlaceObject(pSoldier, pSoldier.pTempObject, false);
    MemFree(pSoldier.pTempObject);
    pSoldier.pTempObject = null;
    pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
    pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;

    // Decrement attack counter...
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., ending throw because saw something"));
    ReduceAttackBusyCount(pSoldier.ubID, false);

    // ATE: Goto stationary stance......
    SoldierGotoStationaryStance(pSoldier);

    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
  }

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
  } else {
    // Pause this guy from no APS
    AdjustNoAPToFinishMove(pSoldier, true);

    pSoldier.ubReasonCantFinishMove = Enum263.REASON_STOPPED_SIGHT;

    // ATE; IF turning to shoot, stop!
    // ATE: We want to do this only for enemies, not items....
    if (pSoldier.fTurningToShoot && fFromSightingEnemy) {
      pSoldier.fTurningToShoot = false;
      // Release attacker

      // OK - this is hightly annoying , but due to the huge combinations of
      // things that can happen - 1 of them is that sLastTarget will get unset
      // after turn is done - so set flag here to tell it not to...
      pSoldier.fDontUnsetLastTargetFromTurn = true;

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., ending fire because saw something"));
      ReduceAttackBusyCount(pSoldier.ubID, false);
    }

    // OK, if we are stopped at our destination, cancel pending action...
    if (fFromSightingEnemy) {
      if (pSoldier.ubPendingAction != NO_PENDING_ACTION && pSoldier.sGridNo == pSoldier.sFinalDestination) {
        pSoldier.ubPendingAction = NO_PENDING_ACTION;
      }

      // Stop pending animation....
      pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
      pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;
    }

    if (!pSoldier.fTurningToShoot) {
      pSoldier.fTurningFromPronePosition = 0;
    }
  }

  // Unset UI!
  if (fFromSightingEnemy || (pSoldier.pTempObject == null && !pSoldier.fTurningToShoot)) {
    UnSetUIBusy(pSoldier.ubID);
  }

  pSoldier.bTurningFromUI = false;

  UnSetEngagedInConvFromPCAction(pSoldier);
}

// HUALT EVENT IS USED TO STOP A MERC - NETWORKING SHOULD CHECK / ADJUST TO GRIDNO?
export function EVENT_StopMerc(pSoldier: SOLDIERTYPE, sGridNo: INT16, bDirection: INT8): void {
  let sX: INT16;
  let sY: INT16;

  // MOVE GUY TO GRIDNO--- SHOULD BE THE SAME UNLESS IN MULTIPLAYER
  // Makesure center of tile
  sX = CenterX(sGridNo);
  sY = CenterY(sGridNo);

  // Cancel pending events
  if (!pSoldier.fDelayedMovement) {
    pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
    pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;
    pSoldier.ubPendingDirection = NO_PENDING_DIRECTION;
    pSoldier.ubPendingAction = NO_PENDING_ACTION;
  }

  pSoldier.bEndDoorOpenCode = 0;
  pSoldier.fTurningFromPronePosition = 0;

  // Cancel path data!
  pSoldier.usPathIndex = pSoldier.usPathDataSize = 0;

  // Set ext tile waiting flag off!
  pSoldier.fDelayedMovement = 0;

  // Turn off reverse...
  pSoldier.bReverse = false;

  EVENT_SetSoldierPosition(pSoldier, sX, sY);
  pSoldier.sDestXPos = pSoldier.dXPos;
  pSoldier.sDestYPos = pSoldier.dYPos;
  EVENT_SetSoldierDirection(pSoldier, bDirection);

  if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) {
    SoldierGotoStationaryStance(pSoldier);
  }

  // ATE; IF turning to shoot, stop!
  if (pSoldier.fTurningToShoot) {
    pSoldier.fTurningToShoot = false;
    // Release attacker
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., ending fire because saw something"));
    ReduceAttackBusyCount(pSoldier.ubID, false);
  }

  // Turn off multi-move speed override....
  if (pSoldier.sGridNo == pSoldier.sFinalDestination) {
    pSoldier.fUseMoverrideMoveSpeed = false;
  }

  // Unset UI!
  UnSetUIBusy(pSoldier.ubID);

  UnMarkMovementReserved(pSoldier);
}

export function ReLoadSoldierAnimationDueToHandItemChange(pSoldier: SOLDIERTYPE, usOldItem: UINT16, usNewItem: UINT16): void {
  // DON'T continue aiming!
  // GOTO STANCE
  // CHECK FOR AIMING ANIMATIONS
  let fOldRifle: boolean = false;
  let fNewRifle: boolean = false;

  // Shutoff burst....
  // ( we could be on, then change gun that does not have burst )
  if (Weapon[usNewItem].ubShotsPerBurst == 0) {
    pSoldier.bDoBurst = 0;
    pSoldier.bWeaponMode = Enum265.WM_NORMAL;
  }

  if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_FIREREADY) {
    // Stop aiming!
    SoldierGotoStationaryStance(pSoldier);
  }

  // Cancel services...
  GivingSoldierCancelServices(pSoldier);

  // Did we have a rifle and do we now not have one?
  if (usOldItem != NOTHING) {
    if (Item[usOldItem].usItemClass == IC_GUN) {
      if ((Item[usOldItem].fFlags & ITEM_TWO_HANDED) && usOldItem != Enum225.ROCKET_LAUNCHER) {
        fOldRifle = true;
      }
    }
  }

  if (usNewItem != NOTHING) {
    if (Item[usNewItem].usItemClass == IC_GUN) {
      if ((Item[usNewItem].fFlags & ITEM_TWO_HANDED) && usNewItem != Enum225.ROCKET_LAUNCHER) {
        fNewRifle = true;
      }
    }
  }

  // Switch on stance!
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      if (fOldRifle && !fNewRifle) {
        // Put it away!
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.LOWER_RIFLE, 0, false);
      } else if (!fOldRifle && fNewRifle) {
        // Bring it up!
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.RAISE_RIFLE, 0, false);
      } else {
        SetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);
      }
      break;

    case ANIM_CROUCH:
    case ANIM_PRONE:

      SetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);
      break;
  }
}

function CreateEnemyGlow16BPPPalette(pPalette: SGPPaletteEntry[], rscale: UINT32, gscale: UINT32, fAdjustGreen: boolean): UINT16[] {
  let p16BPPPalette: UINT16[];
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

  Assert(pPalette != null);

  p16BPPPalette = createArray(256, 0);

  for (cnt = 0; cnt < 256; cnt++) {
    gmod = (pPalette[cnt].peGreen);
    bmod = (pPalette[cnt].peBlue);

    rmod = Math.max(rscale, (pPalette[cnt].peRed));

    if (fAdjustGreen) {
      gmod = Math.max(gscale, (pPalette[cnt].peGreen));
    }

    r = Math.min(rmod, 255);
    g = Math.min(gmod, 255);
    b = Math.min(bmod, 255);

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

function CreateEnemyGreyGlow16BPPPalette(pPalette: SGPPaletteEntry[], rscale: UINT32, gscale: UINT32, fAdjustGreen: boolean): UINT16[] {
  let p16BPPPalette: UINT16[];
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

  Assert(pPalette != null);

  p16BPPPalette = createArray(256, 0);

  for (cnt = 0; cnt < 256; cnt++) {
    lumin = (pPalette[cnt].peRed * 299 / 1000) + (pPalette[cnt].peGreen * 587 / 1000) + (pPalette[cnt].peBlue * 114 / 1000);
    rmod = (100 * lumin) / 256;
    gmod = (100 * lumin) / 256;
    bmod = (100 * lumin) / 256;

    rmod = Math.max(rscale, rmod);

    if (fAdjustGreen) {
      gmod = Math.max(gscale, gmod);
    }

    r = Math.min(rmod, 255);
    g = Math.min(gmod, 255);
    b = Math.min(bmod, 255);

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

export function ContinueMercMovement(pSoldier: SOLDIERTYPE): void {
  let sAPCost: INT16;
  let sGridNo: INT16;

  sGridNo = pSoldier.sFinalDestination;

  // Can we afford this?
  if (pSoldier.bGoodContPath) {
    sGridNo = pSoldier.sContPathLocation;
  } else {
    // ATE: OK, don't cancel count, so pending actions are still valid...
    pSoldier.ubPendingActionAnimCount = 0;
  }

  // get a path to dest...
  if (FindBestPath(pSoldier, sGridNo, pSoldier.bLevel, pSoldier.usUIMovementMode, NO_COPYROUTE, 0)) {
    sAPCost = PtsToMoveDirection(pSoldier, guiPathingData[0]);

    if (EnoughPoints(pSoldier, sAPCost, 0, (pSoldier.bTeam == gbPlayerNum))) {
      // Acknowledge
      if (pSoldier.bTeam == gbPlayerNum) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);

        // If we have a face, tell text in it to go away!
        if (pSoldier.iFaceIndex != -1) {
          gFacesData[pSoldier.iFaceIndex].fDisplayTextOver = FACE_ERASE_TEXT_OVER;
        }
      }

      AdjustNoAPToFinishMove(pSoldier, false);

      SetUIBusy(pSoldier.ubID);

      // OK, try and get a path to out dest!
      EVENT_InternalGetNewSoldierPath(pSoldier, sGridNo, pSoldier.usUIMovementMode, false, true);
    }
  }
}

export function CheckForBreathCollapse(pSoldier: SOLDIERTYPE): boolean {
  // Check if we are out of breath!
  // Only check if > 70
  if (pSoldier.bBreathMax > 70) {
    if (pSoldier.bBreath < 20 && !(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_LOW_BREATH) && gAnimControl[pSoldier.usAnimState].ubEndHeight == ANIM_STAND) {
      // WARN!
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_OUT_OF_BREATH);

      // Set flag indicating we were warned!
      pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_LOW_BREATH;
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

  if (pSoldier.bBreath == 0 && !pSoldier.bCollapsed && !(pSoldier.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_ANIMAL | SOLDIER_MONSTER))) {
    // Collapse!
    // OK, Set a flag, because we may still be in the middle of an animation what is not interruptable...
    pSoldier.bBreathCollapsed = true;

    return true;
  }

  return false;
}

export function InternalIsValidStance(pSoldier: SOLDIERTYPE, bDirection: INT8, bNewStance: INT8): boolean {
  let usOKToAddStructID: UINT16 = 0;
  let pStructureFileRef: STRUCTURE_FILE_REF | null;
  let usAnimSurface: UINT16 = 0;
  let usAnimState: UINT16;

  // Check, if dest is prone, we can actually do this!

  // If we are a vehicle, we can only 'stand'
  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) && bNewStance != ANIM_STAND) {
    return false;
  }

  // Check if we are in water?
  if (MercInWater(pSoldier)) {
    if (bNewStance == ANIM_PRONE || bNewStance == ANIM_CROUCH) {
      return false;
    }
  }

  if (pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON && bNewStance != ANIM_STAND) {
    return false;
  }

  // Check if we are in water?
  if (AM_AN_EPC(pSoldier)) {
    if (bNewStance == ANIM_PRONE) {
      return false;
    } else {
      return true;
    }
  }

  if (pSoldier.bCollapsed) {
    if (bNewStance == ANIM_STAND || bNewStance == ANIM_CROUCH) {
      return false;
    }
  }

  // Check if we can do this....
  if (pSoldier.pLevelNode && pSoldier.pLevelNode.pStructureData != null) {
    usOKToAddStructID = pSoldier.pLevelNode.pStructureData.usStructureID;
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
      usAnimState = pSoldier.usAnimState;
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Wrong desired stance given: %d, %d.", bNewStance, pSoldier.usAnimState);
  }

  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);

  // Get structure ref........
  pStructureFileRef = GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, usAnimState);

  if (pStructureFileRef != null) {
    // Can we add structure data for this stance...?
    if (!OkayToAddStructureToWorld(pSoldier.sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[bDirection]], usOKToAddStructID)) {
      return false;
    }
  }

  return true;
}

export function IsValidStance(pSoldier: SOLDIERTYPE, bNewStance: INT8): boolean {
  return InternalIsValidStance(pSoldier, pSoldier.bDirection, bNewStance);
}

export function IsValidMovementMode(pSoldier: SOLDIERTYPE, usMovementMode: INT16): boolean {
  // Check, if dest is prone, we can actually do this!

  // Check if we are in water?
  if (MercInWater(pSoldier)) {
    if (usMovementMode == Enum193.RUNNING || usMovementMode == Enum193.SWATTING || usMovementMode == Enum193.CRAWLING) {
      return false;
    }
  }

  return true;
}

export function SelectMoveAnimationFromStance(pSoldier: SOLDIERTYPE): void {
  // Determine which animation to do...depending on stance and gun in hand...
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.WALKING, 0, false);
      break;

    case ANIM_PRONE:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRAWLING, 0, false);
      break;

    case ANIM_CROUCH:
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.SWATTING, 0, false);
      break;
  }
}

function GetActualSoldierAnimDims(pSoldier: SOLDIERTYPE, psHeight: Pointer<INT16>, psWidth: Pointer<INT16>): void {
  let usAnimSurface: UINT16;
  let pTrav: ETRLEObject;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    psHeight.value = 5;
    psWidth.value = 5;

    return;
  }

  if (gAnimSurfaceDatabase[usAnimSurface].hVideoObject == null) {
    psHeight.value = 5;
    psWidth.value = 5;
    return;
  }

  // OK, noodle here on what we should do... If we take each frame, it will be different slightly
  // depending on the frame and the value returned here will vary thusly. However, for the
  // uses of this function, we should be able to use just the first frame...

  if (pSoldier.usAniFrame >= gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.usNumberOfObjects) {
    let i: number = 0;
  }

  pTrav = gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pETRLEObject[pSoldier.usAniFrame];

  psHeight.value = pTrav.usHeight;
  psWidth.value = pTrav.usWidth;
}

function GetActualSoldierAnimOffsets(pSoldier: SOLDIERTYPE, sOffsetX: Pointer<INT16>, sOffsetY: Pointer<INT16>): void {
  let usAnimSurface: UINT16;
  let pTrav: ETRLEObject;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    sOffsetX.value = 0;
    sOffsetY.value = 0;

    return;
  }

  if (gAnimSurfaceDatabase[usAnimSurface].hVideoObject == null) {
    sOffsetX.value = 0;
    sOffsetY.value = 0;
    return;
  }

  pTrav = gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.pETRLEObject[pSoldier.usAniFrame];

  sOffsetX.value = pTrav.sOffsetX;
  sOffsetY.value = pTrav.sOffsetY;
}

function SetSoldierLocatorOffsets(pSoldier: SOLDIERTYPE): void {
  let sHeight: INT16;
  let sWidth: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;

  // OK, from our animation, get height, width
  GetActualSoldierAnimDims(pSoldier, addressof(sHeight), addressof(sWidth));
  GetActualSoldierAnimOffsets(pSoldier, addressof(sOffsetX), addressof(sOffsetY));

  // OK, here, use the difference between center of animation ( sWidth/2 ) and our offset!
  // pSoldier->sLocatorOffX = ( abs( sOffsetX ) ) - ( sWidth / 2 );

  pSoldier.sBoundingBoxWidth = sWidth;
  pSoldier.sBoundingBoxHeight = sHeight;
  pSoldier.sBoundingBoxOffsetX = sOffsetX;
  pSoldier.sBoundingBoxOffsetY = sOffsetY;
}

function SoldierCarriesTwoHandedWeapon(pSoldier: SOLDIERTYPE): boolean {
  let usItem: UINT16;

  usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

  if (usItem != NOTHING && (Item[usItem].fFlags & ITEM_TWO_HANDED)) {
    return true;
  }

  return false;
}

function CheckBleeding(pSoldier: SOLDIERTYPE): INT32 {
  let bBandaged: INT8; //,savedOurTurn;
  let iBlood: INT32 = NOBLOOD;

  if (pSoldier.bLife != 0) {
    // if merc is hurt beyond the minimum required to bleed, or he's dying
    if ((pSoldier.bBleeding > MIN_BLEEDING_THRESHOLD) || pSoldier.bLife < OKLIFE) {
      // if he's NOT in the process of being bandaged or DOCTORed
      if ((pSoldier.ubServiceCount == 0) && (AnyDoctorWhoCanHealThisPatient(pSoldier, HEALABLE_EVER) == null)) {
        // may drop blood whether or not any bleeding takes place this turn
        if (pSoldier.bTilesMoved < 1) {
          iBlood = ((pSoldier.bBleeding - MIN_BLEEDING_THRESHOLD) / BLOODDIVISOR); // + pSoldier->dying;
          if (iBlood > MAXBLOODQUANTITY) {
            iBlood = MAXBLOODQUANTITY;
          }
        } else {
          iBlood = NOBLOOD;
        }

        // Are we in a different mode?
        if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
          pSoldier.dNextBleed -= RT_NEXT_BLEED_MODIFIER;
        } else {
          // Do a single step descrease
          pSoldier.dNextBleed--;
        }

        // if it's time to lose some blood
        if (pSoldier.dNextBleed <= 0) {
          // first, calculate if soldier is bandaged
          bBandaged = pSoldier.bLifeMax - pSoldier.bBleeding - pSoldier.bLife;

          // as long as he's bandaged and not "dying"
          if (bBandaged && pSoldier.bLife >= OKLIFE) {
            // just bleeding through existing bandages
            pSoldier.bBleeding++;

            SoldierBleed(pSoldier, true);
          } else // soldier is either not bandaged at all or is dying
          {
            if (pSoldier.bLife < OKLIFE) // if he's dying
            {
              // if he's conscious, and he hasn't already, say his "dying quote"
              if ((pSoldier.bLife >= CONSCIOUSNESS) && !pSoldier.fDyingComment) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SERIOUSLY_WOUNDED);

                pSoldier.fDyingComment = true;
              }

              // can't permit lifemax to ever bleed beneath OKLIFE, or that
              // soldier might as well be dead!
              if (pSoldier.bLifeMax >= OKLIFE) {
                // bleeding while "dying" costs a PERMANENT point of life each time!
                pSoldier.bLifeMax--;
                pSoldier.bBleeding--;
              }
            }
          }

          // either way, a point of life (health) is lost because of bleeding
          // This will also update the life bar

          SoldierBleed(pSoldier, false);

          // if he's not dying (which includes him saying the dying quote just
          // now), and he hasn't warned us that he's bleeding yet, he does so
          // Also, not if they are being bandaged....
          if ((pSoldier.bLife >= OKLIFE) && !pSoldier.fDyingComment && !pSoldier.fWarnedAboutBleeding && !gTacticalStatus.fAutoBandageMode && pSoldier.ubServiceCount == 0) {
            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_STARTING_TO_BLEED);

            // "starting to bleed" quote
            pSoldier.fWarnedAboutBleeding = true;
          }

          pSoldier.dNextBleed = CalcSoldierNextBleed(pSoldier);
        }
      }
    }
  }
  return iBlood;
}

function SoldierBleed(pSoldier: SOLDIERTYPE, fBandagedBleed: boolean): void {
  let bOldLife: INT8;

  // OK, here make some stuff happen for bleeding
  // A banaged bleed does not show damage taken , just through existing bandages

  // ATE: Do this ONLY if buddy is in sector.....
  if ((pSoldier.bInSector && guiCurrentScreen == Enum26.GAME_SCREEN) || guiCurrentScreen != Enum26.GAME_SCREEN) {
    pSoldier.fFlashPortrait = 1;
    pSoldier.bFlashPortraitFrame = FLASH_PORTRAIT_STARTSHADE;
    pSoldier.PortraitFlashCounter = RESETTIMECOUNTER(FLASH_PORTRAIT_DELAY);

    // If we are in mapscreen, set this person as selected
    if (guiCurrentScreen == Enum26.MAP_SCREEN) {
      SetInfoChar(pSoldier.ubID);
    }
  }

  bOldLife = pSoldier.bLife;

  // If we are already dead, don't show damage!
  if (!fBandagedBleed) {
    SoldierTakeDamage(pSoldier, ANIM_CROUCH, 1, 100, TAKE_DAMAGE_BLOODLOSS, NOBODY, NOWHERE, 0, true);
  }
}

export function SoldierCollapse(pSoldier: SOLDIERTYPE): void {
  let fMerc: boolean = false;

  if (pSoldier.ubBodyType <= Enum194.REGFEMALE) {
    fMerc = true;
  }

  // If we are an animal, etc, don't do anything....
  switch (pSoldier.ubBodyType) {
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

  pSoldier.bCollapsed = true;

  ReceivingSoldierCancelServices(pSoldier);

  // CC has requested - handle sight here...
  HandleSight(pSoldier, SIGHT_LOOK);

  // Check height
  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.DEEP_WATER_DIE, 0, false);
      } else if (pSoldier.bOverTerrainType == Enum315.LOW_WATER) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.WATER_DIE, 0, false);
      } else {
        BeginTyingToFall(pSoldier);
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_STAND, 0, false);
      }
      break;

    case ANIM_CROUCH:

      // Crouched or prone, only for mercs!
      BeginTyingToFall(pSoldier);

      if (fMerc) {
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_CROUCH, 0, false);
      } else {
        // For civs... use fall from stand...
        EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLFORWARD_FROMHIT_STAND, 0, false);
      }
      break;

    case ANIM_PRONE:

      switch (pSoldier.usAnimState) {
        case Enum193.FALLFORWARD_FROMHIT_STAND:
        case Enum193.ENDFALLFORWARD_FROMHIT_CROUCH:

          ChangeSoldierState(pSoldier, Enum193.STAND_FALLFORWARD_STOP, 0, false);
          break;

        case Enum193.FALLBACK_HIT_STAND:
          ChangeSoldierState(pSoldier, Enum193.FALLBACKHIT_STOP, 0, false);
          break;

        default:
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.PRONE_LAY_FROMHIT, 0, false);
          break;
      }
      break;
  }

  if (pSoldier.uiStatusFlags & SOLDIER_ENEMY) {
    if (!(gTacticalStatus.bPanicTriggerIsAlarm) && (gTacticalStatus.ubTheChosenOne == pSoldier.ubID)) {
      // replace this guy as the chosen one!
      gTacticalStatus.ubTheChosenOne = NOBODY;
      MakeClosestEnemyChosenOne();
    }

    if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT) && (pSoldier.uiStatusFlags & SOLDIER_UNDERAICONTROL)) {
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

function CalcSoldierNextBleed(pSoldier: SOLDIERTYPE): FLOAT {
  let bBandaged: INT8;

  // calculate how many turns before he bleeds again
  // bleeding faster the lower life gets, and if merc is running around
  // pSoldier->nextbleed = 2 + (pSoldier->life / (10 + pSoldier->tilesMoved));  // min = 2

  // if bandaged, give 1/2 of the bandaged life points back into equation
  bBandaged = pSoldier.bLifeMax - pSoldier.bLife - pSoldier.bBleeding;

  return (1 + ((pSoldier.bLife + bBandaged / 2) / (10 + pSoldier.bTilesMoved))); // min = 1
}

function CalcSoldierNextUnmovingBleed(pSoldier: SOLDIERTYPE): FLOAT {
  let bBandaged: INT8;

  // calculate bleeding rate without the penalty for tiles moved

  // if bandaged, give 1/2 of the bandaged life points back into equation
  bBandaged = pSoldier.bLifeMax - pSoldier.bLife - pSoldier.bBleeding;

  return (1 + ((pSoldier.bLife + bBandaged / 2) / 10)); // min = 1
}

export function HandlePlacingRoofMarker(pSoldier: SOLDIERTYPE, sGridNo: INT16, fSet: boolean, fForce: boolean): void {
  let pRoofNode: LEVELNODE | null;
  let pNode: LEVELNODE;

  if (pSoldier.bVisible == -1 && fSet) {
    return;
  }

  if (pSoldier.bTeam != gbPlayerNum) {
    // return;
  }

  // If we are on the roof, add roof UI peice!
  if (pSoldier.bLevel == SECOND_LEVEL) {
    // Get roof node
    pRoofNode = gpWorldLevelData[sGridNo].pRoofHead;

    // Return if we are still climbing roof....
    if (pSoldier.usAnimState == Enum193.CLIMBUPROOF && !fForce) {
      return;
    }

    if (pRoofNode != null) {
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
          pNode = <LEVELNODE>AddRoofToTail(sGridNo, Enum312.FIRSTPOINTERS11);
          pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
        }
      } else {
        RemoveRoof(sGridNo, Enum312.FIRSTPOINTERS11);
      }
    }
  }
}

export function PositionSoldierLight(pSoldier: SOLDIERTYPE): void {
  // DO ONLY IF WE'RE AT A GOOD LEVEL
  if (ubAmbientLightLevel < MIN_AMB_LEVEL_FOR_MERC_LIGHTS) {
    return;
  }

  if (!pSoldier.bInSector) {
    return;
  }

  if (pSoldier.bTeam != gbPlayerNum) {
    return;
  }

  if (pSoldier.bLife < OKLIFE) {
    return;
  }

  // if the player DOESNT want the merc to cast light
  if (!gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT]) {
    return;
  }

  if (pSoldier.iLight == -1) {
    CreateSoldierLight(pSoldier);
  }

  // if ( pSoldier->ubID == gusSelectedSoldier )
  {
    LightSpritePower(pSoldier.iLight, true);
    LightSpriteFake(pSoldier.iLight);

    LightSpritePosition(pSoldier.iLight, (pSoldier.sX / CELL_X_SIZE), (pSoldier.sY / CELL_Y_SIZE));
  }
}

export function SetCheckSoldierLightFlag(pSoldier: SOLDIERTYPE): void {
  PositionSoldierLight(pSoldier);
  // pSoldier->uiStatusFlags |= SOLDIER_RECHECKLIGHT;
}

export function PickPickupAnimation(pSoldier: SOLDIERTYPE, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8): void {
  let bDirection: INT8;
  let pStructure: STRUCTURE | null;
  let fDoNormalPickup: boolean = true;

  // OK, Given the gridno, determine if it's the same one or different....
  if (sGridNo != pSoldier.sGridNo) {
    // Get direction to face....
    bDirection = GetDirectionFromGridNo(sGridNo, pSoldier);
    pSoldier.ubPendingDirection = bDirection;

    // Change to pickup animation
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADJACENT_GET_ITEM, 0, false);

    if (!(pSoldier.uiStatusFlags & SOLDIER_PC)) {
      // set "pending action" value for AI so it will wait
      pSoldier.bAction = Enum289.AI_ACTION_PENDING_ACTION;
    }
  } else {
    // If in water....
    if (MercInWater(pSoldier)) {
      UnSetUIBusy(pSoldier.ubID);
      HandleSoldierPickupItem(pSoldier, iItemIndex, sGridNo, bZLevel);
      SoldierGotoStationaryStance(pSoldier);
      if (!(pSoldier.uiStatusFlags & SOLDIER_PC)) {
        // reset action value for AI because we're done!
        ActionDone(pSoldier);
      }
    } else {
      // Don't show animation of getting item, if we are not standing
      switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
        case ANIM_STAND:

          // OK, if we are looking at z-level >0, AND
          // we have a strucxture with items in it
          // look for orientation and use angle accordingly....
          if (bZLevel > 0) {
            //#if 0
            // Get direction to face....
            if ((pStructure = FindStructure(sGridNo, (STRUCTURE_HASITEMONTOP | STRUCTURE_OPENABLE))) != null) {
              fDoNormalPickup = false;

              // OK, look at orientation
              switch (pStructure.ubWallOrientation) {
                case Enum314.OUTSIDE_TOP_LEFT:
                case Enum314.INSIDE_TOP_LEFT:

                  bDirection = Enum245.NORTH;
                  break;

                case Enum314.OUTSIDE_TOP_RIGHT:
                case Enum314.INSIDE_TOP_RIGHT:

                  bDirection = Enum245.WEST;
                  break;

                default:

                  bDirection = pSoldier.bDirection;
                  break;
              }

              // pSoldier->ubPendingDirection = bDirection;
              EVENT_SetSoldierDesiredDirection(pSoldier, bDirection);
              EVENT_SetSoldierDirection(pSoldier, bDirection);

              // Change to pickup animation
              EVENT_InitNewSoldierAnim(pSoldier, Enum193.ADJACENT_GET_ITEM, 0, false);
            }
            //#endif
          }

          if (fDoNormalPickup) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.PICKUP_ITEM, 0, false);
          }

          if (!(pSoldier.uiStatusFlags & SOLDIER_PC)) {
            // set "pending action" value for AI so it will wait
            pSoldier.bAction = Enum289.AI_ACTION_PENDING_ACTION;
          }
          break;

        case ANIM_CROUCH:
        case ANIM_PRONE:

          UnSetUIBusy(pSoldier.ubID);
          HandleSoldierPickupItem(pSoldier, iItemIndex, sGridNo, bZLevel);
          SoldierGotoStationaryStance(pSoldier);
          if (!(pSoldier.uiStatusFlags & SOLDIER_PC)) {
            // reset action value for AI because we're done!
            ActionDone(pSoldier);
          }
          break;
      }
    }
  }
}

export function PickDropItemAnimation(pSoldier: SOLDIERTYPE): void {
  // Don't show animation of getting item, if we are not standing
  switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
    case ANIM_STAND:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.DROP_ITEM, 0, false);
      break;

    case ANIM_CROUCH:
    case ANIM_PRONE:

      SoldierHandleDropItem(pSoldier);
      SoldierGotoStationaryStance(pSoldier);
      break;
  }
}

export function EVENT_SoldierBeginCutFence(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  // Make sure we have a structure here....
  if (IsCuttableWireFenceAtGridNo(sGridNo)) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    // BOOLEAN CutWireFence( INT16 sGridNo )

    // SET TARGET GRIDNO
    pSoldier.sTargetGridNo = sGridNo;

    // CHANGE TO ANIMATION
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.CUTTING_FENCE, 0, false);
  }
}

export function EVENT_SoldierBeginRepair(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
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
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.GOTO_REPAIRMAN, 0, false);
    // SET BUDDY'S ASSIGNMENT TO REPAIR...

    // Are we a SAM site? ( 3 == SAM )
    if (bRepairItem == 3) {
      SetSoldierAssignment(pSoldier, Enum117.REPAIR, 1, 0, -1);
    } else if (bRepairItem == 2) // ( 2 == VEHICLE )
    {
      SetSoldierAssignment(pSoldier, Enum117.REPAIR, 0, 0, ubID);
    }
  }
}

export function EVENT_SoldierBeginRefuel(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
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
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.REFUEL_VEHICLE, 0, false);
    // SET BUDDY'S ASSIGNMENT TO REPAIR...
  }
}

export function EVENT_SoldierBeginTakeBlood(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  let pCorpse: ROTTING_CORPSE | null;

  // See if these is a corpse here....
  pCorpse = GetCorpseAtGridNo(sGridNo, pSoldier.bLevel);

  if (pCorpse != null) {
    pSoldier.uiPendingActionData4 = pCorpse.iID;

    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    EVENT_InitNewSoldierAnim(pSoldier, Enum193.TAKE_BLOOD_FROM_CORPSE, 0, false);
  } else {
    // Say NOTHING quote...
    DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_NOTHING);
  }
}

export function EVENT_SoldierBeginAttachCan(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8): void {
  let pStructure: STRUCTURE | null;
  let pDoorStatus: DOOR_STATUS | null;

  // OK, find door, attach to door, do animation...., remove item....

  // First make sure we still have item in hand....
  if (pSoldier.inv[Enum261.HANDPOS].usItem != Enum225.STRING_TIED_TO_TIN_CAN) {
    return;
  }

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure == null) {
    return;
  }

  // Modify door status to make sure one is created for this door
  // Use the current door state for this
  if (!(pStructure.fFlags & STRUCTURE_OPEN)) {
    ModifyDoorStatus(sGridNo, false, false);
  } else {
    ModifyDoorStatus(sGridNo, true, true);
  }

  // Now get door status...
  pDoorStatus = GetDoorStatus(sGridNo);
  if (pDoorStatus == null) {
    // SOmething wrong here...
    return;
  }

  // OK set flag!
  pDoorStatus.ubFlags |= DOOR_HAS_TIN_CAN;

  // Do animation
  EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  EVENT_SetSoldierDirection(pSoldier, ubDirection);

  EVENT_InitNewSoldierAnim(pSoldier, Enum193.ATTACH_CAN_TO_STRING, 0, false);

  // Remove item...
  DeleteObj(pSoldier.inv[Enum261.HANDPOS]);
  fInterfacePanelDirty = DIRTYLEVEL2;
}

export function EVENT_SoldierBeginReloadRobot(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8, ubMercSlot: UINT8): void {
  let ubPerson: UINT8;

  // Make sure we have a robot here....
  ubPerson = WhoIsThere2(sGridNo, pSoldier.bLevel);

  if (ubPerson != NOBODY && MercPtrs[ubPerson].uiStatusFlags & SOLDIER_ROBOT) {
    // CHANGE DIRECTION AND GOTO ANIMATION NOW
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);

    // CHANGE TO ANIMATION
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.RELOAD_ROBOT, 0, false);
  }
}

function ResetSoldierChangeStatTimer(pSoldier: SOLDIERTYPE): void {
  pSoldier.uiChangeLevelTime = 0;
  pSoldier.uiChangeHealthTime = 0;
  pSoldier.uiChangeStrengthTime = 0;
  pSoldier.uiChangeDexterityTime = 0;
  pSoldier.uiChangeAgilityTime = 0;
  pSoldier.uiChangeWisdomTime = 0;
  pSoldier.uiChangeLeadershipTime = 0;
  pSoldier.uiChangeMarksmanshipTime = 0;
  pSoldier.uiChangeExplosivesTime = 0;
  pSoldier.uiChangeMedicalTime = 0;
  pSoldier.uiChangeMechanicalTime = 0;

  return;
}

function ChangeToFlybackAnimation(pSoldier: SOLDIERTYPE, bDirection: INT8): void {
  let usNewGridNo: UINT16;

  // Get dest gridno, convert to center coords
  usNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(gOppositeDirection[bDirection]));
  usNewGridNo = NewGridNo(usNewGridNo, DirectionInc(gOppositeDirection[bDirection]));

  // Remove any previous actions
  pSoldier.ubPendingAction = NO_PENDING_ACTION;

  // Set path....
  pSoldier.usPathDataSize = 0;
  pSoldier.usPathIndex = 0;
  pSoldier.usPathingData[pSoldier.usPathDataSize] = gOppositeDirection[pSoldier.bDirection];
  pSoldier.usPathDataSize++;
  pSoldier.usPathingData[pSoldier.usPathDataSize] = gOppositeDirection[pSoldier.bDirection];
  pSoldier.usPathDataSize++;
  pSoldier.sFinalDestination = usNewGridNo;
  EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.usPathingData[pSoldier.usPathIndex], false, Enum193.FLYBACK_HIT);

  // Get a new direction based on direction
  EVENT_InitNewSoldierAnim(pSoldier, Enum193.FLYBACK_HIT, 0, false);
}

export function ChangeToFallbackAnimation(pSoldier: SOLDIERTYPE, bDirection: INT8): void {
  let usNewGridNo: UINT16;

  // Get dest gridno, convert to center coords
  usNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(gOppositeDirection[bDirection]));
  // usNewGridNo = NewGridNo( (UINT16)usNewGridNo, (UINT16)(-1 * DirectionInc( bDirection ) ) );

  // Remove any previous actions
  pSoldier.ubPendingAction = NO_PENDING_ACTION;

  // Set path....
  pSoldier.usPathDataSize = 0;
  pSoldier.usPathIndex = 0;
  pSoldier.usPathingData[pSoldier.usPathDataSize] = gOppositeDirection[pSoldier.bDirection];
  pSoldier.usPathDataSize++;
  pSoldier.sFinalDestination = usNewGridNo;
  EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.usPathingData[pSoldier.usPathIndex], false, Enum193.FALLBACK_HIT_STAND);

  // Get a new direction based on direction
  EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALLBACK_HIT_STAND, 0, false);
}

export function SetSoldierCowerState(pSoldier: SOLDIERTYPE, fOn: boolean): void {
  // Robot's don't cower!
  if (pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("ERROR: Robot was told to cower!"));
    return;
  }

  // OK< set flag and do anim...
  if (fOn) {
    if (!(pSoldier.uiStatusFlags & SOLDIER_COWERING)) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.START_COWER, 0, false);

      pSoldier.uiStatusFlags |= SOLDIER_COWERING;

      pSoldier.ubDesiredHeight = ANIM_CROUCH;
    }
  } else {
    if ((pSoldier.uiStatusFlags & SOLDIER_COWERING)) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_COWER, 0, false);

      pSoldier.uiStatusFlags &= (~SOLDIER_COWERING);

      pSoldier.ubDesiredHeight = ANIM_STAND;
    }
  }
}

export function MercStealFromMerc(pSoldier: SOLDIERTYPE, pTarget: SOLDIERTYPE): void {
  let sActionGridNo: INT16;
  let sGridNo: INT16;
  let sAdjustedGridNo: INT16;
  let ubDirection: UINT8;

  // OK, find an adjacent gridno....
  sGridNo = pTarget.sGridNo;

  // See if we can get there to punch
  sActionGridNo = FindAdjacentGridEx(pSoldier, sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
  if (sActionGridNo != -1) {
    // SEND PENDING ACTION
    pSoldier.ubPendingAction = Enum257.MERC_STEAL;
    pSoldier.sPendingActionData2 = pTarget.sGridNo;
    pSoldier.bPendingActionData3 = ubDirection;
    pSoldier.ubPendingActionAnimCount = 0;

    // CHECK IF WE ARE AT THIS GRIDNO NOW
    if (pSoldier.sGridNo != sActionGridNo) {
      // WALK UP TO DEST FIRST
      SendGetNewSoldierPathEvent(pSoldier, sActionGridNo, pSoldier.usUIMovementMode);
    } else {
      EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.STEAL_ITEM, 0, false);
    }

    // OK, set UI
    gTacticalStatus.ubAttackBusyCount++;
    // reset attacking item (hand)
    pSoldier.usAttackingWeapon = 0;
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting STEAL attack, attack count now %d", gTacticalStatus.ubAttackBusyCount));

    SetUIBusy(pSoldier.ubID);
  }
}

export function PlayerSoldierStartTalking(pSoldier: SOLDIERTYPE, ubTargetID: UINT8, fValidate: boolean): boolean {
  let sFacingDir: INT16;
  let sXPos: INT16;
  let sYPos: INT16;
  let sAPCost: INT16;
  let pTSoldier: SOLDIERTYPE;
  let uiRange: UINT32;

  if (ubTargetID == NOBODY) {
    return false;
  }

  pTSoldier = MercPtrs[ubTargetID];

  // Check distance again, to be sure
  if (fValidate) {
    // OK, since we locked this guy from moving
    // we should be close enough, so talk ( unless he is now dead )
    if (!IsValidTalkableNPC(ubTargetID, false, false, false)) {
      return false;
    }

    uiRange = GetRangeFromGridNoDiff(pSoldier.sGridNo, pTSoldier.sGridNo);

    if (uiRange > (NPC_TALK_RADIUS * 2)) {
      // Todo here - should we follow dude?
      return false;
    }
  }

  // Get APs...
  sAPCost = AP_TALK;

  // Deduct points from our guy....
  DeductPoints(pSoldier, sAPCost, 0);

  ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(pTSoldier.sGridNo));

  // Get direction from mouse pos
  sFacingDir = GetDirectionFromXY(sXPos, sYPos, pSoldier);

  // Set our guy facing
  SendSoldierSetDesiredDirectionEvent(pSoldier, sFacingDir);

  // Set NPC facing
  SendSoldierSetDesiredDirectionEvent(pTSoldier, gOppositeDirection[sFacingDir]);

  // Stop our guys...
  EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);

  // ATE; Check for normal civs...
  if (GetCivType(pTSoldier) != CIV_TYPE_NA) {
    StartCivQuote(pTSoldier);
    return false;
  }

  // Are we an EPC that is being escorted?
  if (pTSoldier.ubProfile != NO_PROFILE && pTSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    return InitiateConversation(pTSoldier, pSoldier, Enum296.APPROACH_EPC_WHO_IS_RECRUITED, 0);
    // Converse( pTSoldier->ubProfile, pSoldier->ubProfile, APPROACH_EPC_WHO_IS_RECRUITED, 0 );
  } else if (pTSoldier.bNeutral) {
    switch (pTSoldier.ubProfile) {
      case Enum268.JIM:
      case Enum268.JACK:
      case Enum268.OLAF:
      case Enum268.RAY:
      case Enum268.OLGA:
      case Enum268.TYRONE:
        // Start combat etc
        DeleteTalkingMenu();
        CancelAIAction(pTSoldier, 1);
        AddToShouldBecomeHostileOrSayQuoteList(pTSoldier.ubID);
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

  return true;
}

export function IsValidSecondHandShot(pSoldier: SOLDIERTYPE): boolean {
  if (Item[pSoldier.inv[Enum261.SECONDHANDPOS].usItem].usItemClass == IC_GUN && !(Item[pSoldier.inv[Enum261.SECONDHANDPOS].usItem].fFlags & ITEM_TWO_HANDED) && !pSoldier.bDoBurst && pSoldier.inv[Enum261.HANDPOS].usItem != Enum225.GLAUNCHER && Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN && pSoldier.inv[Enum261.SECONDHANDPOS].bGunStatus >= USABLE && pSoldier.inv[Enum261.SECONDHANDPOS].ubGunShotsLeft > 0) {
    return true;
  }

  return false;
}

export function IsValidSecondHandShotForReloadingPurposes(pSoldier: SOLDIERTYPE): boolean {
  // should be maintained as same as function above with line
  // about ammo taken out!
  if (Item[pSoldier.inv[Enum261.SECONDHANDPOS].usItem].usItemClass == IC_GUN && !pSoldier.bDoBurst && pSoldier.inv[Enum261.HANDPOS].usItem != Enum225.GLAUNCHER && Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN && pSoldier.inv[Enum261.SECONDHANDPOS].bGunStatus >= USABLE //&&
      //			 pSoldier->inv[SECONDHANDPOS].ubGunShotsLeft > 0 &&
      //			 gAnimControl[ pSoldier->usAnimState ].ubEndHeight != ANIM_PRONE )
  ) {
    return true;
  }

  return false;
}

export function CanRobotBeControlled(pSoldier: SOLDIERTYPE): boolean {
  let pController: SOLDIERTYPE;

  if (!(pSoldier.uiStatusFlags & SOLDIER_ROBOT)) {
    return false;
  }

  if (pSoldier.ubRobotRemoteHolderID == NOBODY) {
    return false;
  }

  pController = MercPtrs[pSoldier.ubRobotRemoteHolderID];

  if (pController.bActive) {
    if (ControllingRobot(pController)) {
      // ALL'S OK!
      return true;
    }
  }

  return false;
}

export function ControllingRobot(pSoldier: SOLDIERTYPE): boolean {
  let pRobot: SOLDIERTYPE | null;
  let bPos: INT8;

  if (!pSoldier.bActive) {
    return false;
  }

  // EPCs can't control the robot (no inventory to hold remote, for one)
  if (AM_AN_EPC(pSoldier)) {
    return false;
  }

  // Don't require pSoldier->bInSector here, it must work from mapscreen!

  // are we in ok shape?
  if (pSoldier.bLife < OKLIFE || (pSoldier.bTeam != gbPlayerNum)) {
    return false;
  }

  // allow control from within vehicles - allows strategic travel in a vehicle with robot!
  if ((pSoldier.bAssignment >= Enum117.ON_DUTY) && (pSoldier.bAssignment != Enum117.VEHICLE)) {
    return false;
  }

  // is the soldier wearing a robot remote control?
  bPos = FindObj(pSoldier, Enum225.ROBOT_REMOTE_CONTROL);
  if (bPos != Enum261.HEAD1POS && bPos != Enum261.HEAD2POS) {
    return false;
  }

  // Find the robot
  pRobot = FindSoldierByProfileID(Enum268.ROBOT, true);
  if (!pRobot) {
    return false;
  }

  if (pRobot.bActive) {
    // Are we in the same sector....?
    // ARM: CHANGED TO WORK IN MAPSCREEN, DON'T USE WorldSector HERE
    if (pRobot.sSectorX == pSoldier.sSectorX && pRobot.sSectorY == pSoldier.sSectorY && pRobot.bSectorZ == pSoldier.bSectorZ) {
      // they have to be either both in sector, or both on the road
      if (pRobot.fBetweenSectors == pSoldier.fBetweenSectors) {
        // if they're on the road...
        if (pRobot.fBetweenSectors) {
          // they have to be in the same squad or vehicle
          if (pRobot.bAssignment != pSoldier.bAssignment) {
            return false;
          }

          // if in a vehicle, must be the same vehicle
          if (pRobot.bAssignment == Enum117.VEHICLE && (pRobot.iVehicleId != pSoldier.iVehicleId)) {
            return false;
          }
        }

        // all OK!
        return true;
      }
    }
  }

  return false;
}

export function GetRobotController(pSoldier: SOLDIERTYPE): SOLDIERTYPE | null {
  if (pSoldier.ubRobotRemoteHolderID == NOBODY) {
    return null;
  } else {
    return MercPtrs[pSoldier.ubRobotRemoteHolderID];
  }
}

export function UpdateRobotControllerGivenRobot(pRobot: SOLDIERTYPE): void {
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;

  // Loop through guys and look for a controller!

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if (ControllingRobot(pTeamSoldier)) {
        pRobot.ubRobotRemoteHolderID = pTeamSoldier.ubID;
        return;
      }
    }
  }

  pRobot.ubRobotRemoteHolderID = NOBODY;
}

export function UpdateRobotControllerGivenController(pSoldier: SOLDIERTYPE): void {
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;

  // First see if are still controlling the robot
  if (!ControllingRobot(pSoldier)) {
    return;
  }

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // Loop through guys to find the robot....
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive && (pTeamSoldier.uiStatusFlags & SOLDIER_ROBOT)) {
      pTeamSoldier.ubRobotRemoteHolderID = pSoldier.ubID;
    }
  }
}

export function HandleSoldierTakeDamageFeedback(pSoldier: SOLDIERTYPE): void {
  // Do sound.....
  // if ( pSoldier->bLife >= CONSCIOUSNESS )
  {
    // ATE: Limit how often we grunt...
    if ((GetJA2Clock() - pSoldier.uiTimeSinceLastBleedGrunt) > 1000) {
      pSoldier.uiTimeSinceLastBleedGrunt = GetJA2Clock();

      DoMercBattleSound(pSoldier, (Enum259.BATTLE_SOUND_HIT1 + Random(2)));
    }
  }

  // Flash portrait....
  pSoldier.fFlashPortrait = 1;
  pSoldier.bFlashPortraitFrame = FLASH_PORTRAIT_STARTSHADE;
  pSoldier.PortraitFlashCounter = RESETTIMECOUNTER(FLASH_PORTRAIT_DELAY);
}

export function HandleSystemNewAISituation(pSoldier: SOLDIERTYPE, fResetABC: boolean): void {
  // Are we an AI guy?
  if (gTacticalStatus.ubCurrentTeam != gbPlayerNum && pSoldier.bTeam != gbPlayerNum) {
    if (pSoldier.bNewSituation == IS_NEW_SITUATION) {
      // Cancel what they were doing....
      pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
      pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;
      pSoldier.fTurningFromPronePosition = 0;
      pSoldier.ubPendingDirection = NO_PENDING_DIRECTION;
      pSoldier.ubPendingAction = NO_PENDING_ACTION;
      pSoldier.bEndDoorOpenCode = 0;

      // if this guy isn't under direct AI control, WHO GIVES A FLYING FLICK?
      if (pSoldier.uiStatusFlags & SOLDIER_UNDERAICONTROL) {
        if (pSoldier.fTurningToShoot) {
          pSoldier.fTurningToShoot = false;
          // Release attacker
          // OK - this is hightly annoying , but due to the huge combinations of
          // things that can happen - 1 of them is that sLastTarget will get unset
          // after turn is done - so set flag here to tell it not to...
          pSoldier.fDontUnsetLastTargetFromTurn = true;
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., ending fire because saw something: DONE IN SYSTEM NEW SITUATION"));
          ReduceAttackBusyCount(pSoldier.ubID, false);
        }

        if (pSoldier.pTempObject != null) {
          // Place it back into inv....
          AutoPlaceObject(pSoldier, pSoldier.pTempObject, false);
          MemFree(pSoldier.pTempObject);
          pSoldier.pTempObject = null;
          pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
          pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;

          // Decrement attack counter...
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., ending throw because saw something: DONE IN SYSTEM NEW SITUATION"));
          ReduceAttackBusyCount(pSoldier.ubID, false);
        }
      }
    }
  }
}

function InternalPlaySoldierFootstepSound(pSoldier: SOLDIERTYPE): void {
  let ubRandomSnd: UINT8;
  let bVolume: INT8 = MIDVOLUME;
  // Assume outside
  let ubSoundBase: UINT32 = Enum330.WALK_LEFT_OUT;
  let ubRandomMax: UINT8 = 4;

  // Determine if we are on the floor
  if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    if (pSoldier.usAnimState == Enum193.HOPFENCE) {
      bVolume = HIGHVOLUME;
    }

    if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
      PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ROBOT_BEEP, RATE_11025, SoundVolume(bVolume, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
      return;
    }

    // if ( SoldierOnScreen( pSoldier->ubID ) )
    {
      if (pSoldier.usAnimState == Enum193.CRAWLING) {
        ubSoundBase = Enum330.CRAWL_1;
      } else {
        // Pick base based on terrain over....
        if (pSoldier.bOverTerrainType == Enum315.FLAT_FLOOR) {
          ubSoundBase = Enum330.WALK_LEFT_IN;
        } else if (pSoldier.bOverTerrainType == Enum315.DIRT_ROAD || pSoldier.bOverTerrainType == Enum315.PAVED_ROAD) {
          ubSoundBase = Enum330.WALK_LEFT_ROAD;
        } else if (pSoldier.bOverTerrainType == Enum315.LOW_WATER || pSoldier.bOverTerrainType == Enum315.MED_WATER) {
          ubSoundBase = Enum330.WATER_WALK1_IN;
          ubRandomMax = 2;
        } else if (pSoldier.bOverTerrainType == Enum315.DEEP_WATER) {
          ubSoundBase = Enum330.SWIM_1;
          ubRandomMax = 2;
        }
      }

      // Pick a random sound...
      do {
        ubRandomSnd = Random(ubRandomMax);
      } while (ubRandomSnd == pSoldier.ubLastFootPrintSound);

      pSoldier.ubLastFootPrintSound = ubRandomSnd;

      // OK, if in realtime, don't play at full volume, because too many people walking around
      // sounds don't sound good - ( unless we are the selected guy, then always play at reg volume )
      if (!(gTacticalStatus.uiFlags & INCOMBAT) && (pSoldier.ubID != gusSelectedSoldier)) {
        bVolume = LOWVOLUME;
      }

      PlaySoldierJA2Sample(pSoldier.ubID, ubSoundBase + pSoldier.ubLastFootPrintSound, RATE_11025, SoundVolume(bVolume, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
    }
  }
}

export function PlaySoldierFootstepSound(pSoldier: SOLDIERTYPE): void {
  // normally, not in stealth mode
  if (!pSoldier.bStealthMode) {
    InternalPlaySoldierFootstepSound(pSoldier);
  }
}

export function PlayStealthySoldierFootstepSound(pSoldier: SOLDIERTYPE): void {
  // even if in stealth mode
  InternalPlaySoldierFootstepSound(pSoldier);
}

export function CrowsFlyAway(ubTeam: UINT8): void {
  let cnt: UINT32;
  let pTeamSoldier: SOLDIERTYPE;

  for (cnt = gTacticalStatus.Team[ubTeam].bFirstID, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[ubTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive && pTeamSoldier.bInSector) {
      if (pTeamSoldier.ubBodyType == Enum194.CROW && pTeamSoldier.usAnimState != Enum193.CROW_FLY) {
        // fly away even if not seen!
        HandleCrowFlyAway(pTeamSoldier);
      }
    }
  }
}

export function BeginTyingToFall(pSoldier: SOLDIERTYPE): void {
  pSoldier.bStartFallDir = pSoldier.bDirection;
  pSoldier.fTryingToFall = true;

  // Randomize direction
  if (Random(50) < 25) {
    pSoldier.fFallClockwise = true;
  } else {
    pSoldier.fFallClockwise = false;
  }
}

export function SetSoldierAsUnderAiControl(pSoldierToSet: SOLDIERTYPE): void {
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;

  if (pSoldierToSet == null) {
    return;
  }

  // Loop through ALL teams...
  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[LAST_TEAM].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive) {
      pSoldier.uiStatusFlags &= ~SOLDIER_UNDERAICONTROL;
    }
  }

  pSoldierToSet.uiStatusFlags |= SOLDIER_UNDERAICONTROL;
}

export function HandlePlayerTogglingLightEffects(fToggleValue: boolean): void {
  if (fToggleValue) {
    // Toggle light status
    gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT] = !gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT];
  }

  // Update all the mercs in the sector
  EnableDisableSoldierLightEffects(gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT]);

  SetRenderFlags(RENDER_FLAG_FULL);
}

function EnableDisableSoldierLightEffects(fEnableLights: boolean): void {
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // Loop through player teams...
  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    // if the soldier is in the sector
    if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE) {
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

function SetSoldierPersonalLightLevel(pSoldier: SOLDIERTYPE): void {
  if (pSoldier == null) {
    return;
  }

  if (pSoldier.sGridNo == NOWHERE) {
    return;
  }

  // THe light level for the soldier
  (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubShadeLevel = 3;
  (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubSumLights = 5;
  (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubMaxLights = 5;
  (<LEVELNODE>gpWorldLevelData[pSoldier.sGridNo].pMercHead).ubNaturalShadeLevel = 5;
}

}
