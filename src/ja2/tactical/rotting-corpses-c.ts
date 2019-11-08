namespace ja2 {

const CORPSE_WARNING_MAX = 5;
const CORPSE_WARNING_DIST = 5;

const CORPSE_INDEX_OFFSET = 10000;

//#define		DELAY_UNTIL_ROTTING		( 1 * NUM_SEC_IN_DAY )
const DELAY_UNTIL_ROTTING = (1 * NUM_SEC_IN_DAY / 60);
const DELAY_UNTIL_DONE_ROTTING = (3 * NUM_SEC_IN_DAY / 60);

const MAX_NUM_CROWS = 6;

// When adding a corpse, add struct data...
let zCorpseFilenames: string[] /* CHAR8[NUM_CORPSES][70] */ = [
  "",
  "ANIMS\\CORPSES\\S_D_JFK.STI",
  "ANIMS\\CORPSES\\S_D_BCK.STI",
  "ANIMS\\CORPSES\\S_D_FWD.STI",
  "ANIMS\\CORPSES\\S_D_DHD.STI",
  "ANIMS\\CORPSES\\S_D_PRN.STI",
  "ANIMS\\CORPSES\\S_D_WTR.STI",
  "ANIMS\\CORPSES\\S_D_FALL.STI",
  "ANIMS\\CORPSES\\S_D_FALLF.STI",

  "ANIMS\\CORPSES\\M_D_JFK.STI",
  "ANIMS\\CORPSES\\M_D_BCK.STI",
  "ANIMS\\CORPSES\\M_D_FWD.STI",
  "ANIMS\\CORPSES\\M_D_DHD.STI",
  "ANIMS\\CORPSES\\M_D_PRN.STI",
  "ANIMS\\CORPSES\\S_D_WTR.STI",
  "ANIMS\\CORPSES\\M_D_FALL.STI",
  "ANIMS\\CORPSES\\M_D_FALLF.STI",

  "ANIMS\\CORPSES\\F_D_JFK.STI",
  "ANIMS\\CORPSES\\F_D_BCK.STI",
  "ANIMS\\CORPSES\\F_D_FWD.STI",
  "ANIMS\\CORPSES\\F_D_DHD.STI",
  "ANIMS\\CORPSES\\F_D_PRN.STI",
  "ANIMS\\CORPSES\\S_D_WTR.STI",
  "ANIMS\\CORPSES\\F_D_FALL.STI",
  "ANIMS\\CORPSES\\F_D_FALLF.STI",

  // Civs....
  "ANIMS\\CORPSES\\M_DEAD1.STI",
  "ANIMS\\CORPSES\\K_DEAD2.STI",
  "ANIMS\\CORPSES\\H_DEAD2.STI",
  "ANIMS\\CORPSES\\FT_DEAD1.STI",
  "ANIMS\\CORPSES\\S_DEAD1.STI",
  "ANIMS\\CORPSES\\W_DEAD1.STI",
  "ANIMS\\CORPSES\\CP_DEAD1.STI",
  "ANIMS\\CORPSES\\M_DEAD2.STI",
  "ANIMS\\CORPSES\\K_DEAD1.STI",
  "ANIMS\\CORPSES\\H_DEAD1.STI",

  "ANIMS\\CORPSES\\FT_DEAD2.STI",
  "ANIMS\\CORPSES\\S_DEAD2.STI",
  "ANIMS\\CORPSES\\W_DEAD2.STI",
  "ANIMS\\CORPSES\\CP_DEAD2.STI",
  "ANIMS\\CORPSES\\CT_DEAD.STI",
  "ANIMS\\CORPSES\\CW_DEAD1.STI",
  "ANIMS\\CORPSES\\MN_DEAD2.STI",
  "ANIMS\\CORPSES\\I_DEAD1.STI",
  "ANIMS\\CORPSES\\L_DEAD1.STI",

  "ANIMS\\CORPSES\\P_DECOMP2.STI",
  "ANIMS\\CORPSES\\TK_WREK.STI",
  "ANIMS\\CORPSES\\TK2_WREK.STI",
  "ANIMS\\CORPSES\\HM_WREK.STI",
  "ANIMS\\CORPSES\\IC_WREK.STI",
  "ANIMS\\CORPSES\\QN_DEAD.STI",
  "ANIMS\\CORPSES\\J_DEAD.STI",
  "ANIMS\\CORPSES\\S_BURNT.STI",
  "ANIMS\\CORPSES\\S_EXPLD.STI",
];

// When adding a corpse, add struct data...
let zNoBloodCorpseFilenames: string[] /* CHAR8[NUM_CORPSES][70] */ = [
  "",
  "ANIMS\\CORPSES\\M_D_JFK_NB.STI",
  "ANIMS\\CORPSES\\S_D_BCK_NB.STI",
  "ANIMS\\CORPSES\\S_D_FWD_NB.STI",
  "ANIMS\\CORPSES\\S_D_DHD_NB.STI",
  "ANIMS\\CORPSES\\S_D_PRN_NB.STI",
  "ANIMS\\CORPSES\\S_D_WTR.STI",
  "ANIMS\\CORPSES\\S_D_FALL_NB.STI",
  "ANIMS\\CORPSES\\S_D_FALLF_NB.STI",

  "ANIMS\\CORPSES\\M_D_JFK_NB.STI",
  "ANIMS\\CORPSES\\M_D_BCK_NB.STI",
  "ANIMS\\CORPSES\\M_D_FWD_NB.STI",
  "ANIMS\\CORPSES\\M_D_DHD_NB.STI",
  "ANIMS\\CORPSES\\M_D_PRN_NB.STI",
  "ANIMS\\CORPSES\\S_D_WTR.STI",
  "ANIMS\\CORPSES\\M_D_FALL_NB.STI",
  "ANIMS\\CORPSES\\M_D_FALLF_NB.STI",

  "ANIMS\\CORPSES\\F_D_JFK_NB.STI",
  "ANIMS\\CORPSES\\F_D_BCK_NB.STI",
  "ANIMS\\CORPSES\\F_D_FWD_NB.STI",
  "ANIMS\\CORPSES\\F_D_DHD_NB.STI",
  "ANIMS\\CORPSES\\F_D_PRN_NB.STI",
  "ANIMS\\CORPSES\\S_D_WTR.STI",
  "ANIMS\\CORPSES\\F_D_FALL_NB.STI",
  "ANIMS\\CORPSES\\F_D_FALLF_NB.STI",

  // Civs....
  "ANIMS\\CORPSES\\M_DEAD1_NB.STI",
  "ANIMS\\CORPSES\\K_DEAD2_NB.STI",
  "ANIMS\\CORPSES\\H_DEAD2_NB.STI",
  "ANIMS\\CORPSES\\FT_DEAD1_NB.STI",
  "ANIMS\\CORPSES\\S_DEAD1_NB.STI",
  "ANIMS\\CORPSES\\W_DEAD1_NB.STI",
  "ANIMS\\CORPSES\\CP_DEAD1_NB.STI",
  "ANIMS\\CORPSES\\M_DEAD2_NB.STI",
  "ANIMS\\CORPSES\\K_DEAD1_NB.STI",
  "ANIMS\\CORPSES\\H_DEAD1_NB.STI",

  "ANIMS\\CORPSES\\FT_DEAD2_NB.STI",
  "ANIMS\\CORPSES\\S_DEAD2_NB.STI",
  "ANIMS\\CORPSES\\W_DEAD2_NB.STI",
  "ANIMS\\CORPSES\\CP_DEAD2_NB.STI",
  "ANIMS\\CORPSES\\CT_DEAD.STI",
  "ANIMS\\CORPSES\\CW_DEAD1.STI",
  "ANIMS\\CORPSES\\MN_DEAD2.STI",
  "ANIMS\\CORPSES\\I_DEAD1.STI",
  "ANIMS\\CORPSES\\L_DEAD1.STI",
  "ANIMS\\CORPSES\\P_DECOMP2.STI",

  "ANIMS\\CORPSES\\TK_WREK.STI",
  "ANIMS\\CORPSES\\TK2_WREK.STI",
  "ANIMS\\CORPSES\\HM_WREK.STI",
  "ANIMS\\CORPSES\\IC_WREK.STI",
  "ANIMS\\CORPSES\\QN_DEAD.STI",
  "ANIMS\\CORPSES\\J_DEAD.STI",
  "ANIMS\\CORPSES\\S_BURNT.STI",
  "ANIMS\\CORPSES\\S_EXPLD.STI",
];

export let gb4DirectionsFrom8: UINT8[] /* [8] */ = [
  7, // NORTH
  0, // NE
  0, // E
  0, // SE
  1, // S
  0, // SW,
  2, // W,
  0 // NW
];

let gb2DirectionsFrom8: UINT8[] /* [8] */ = [
  0, // NORTH
  7, // NE
  7, // E
  7, // SE
  0, // S
  7, // SW,
  7, // W,
  7 // NW
];

let gbCorpseValidForDecapitation: boolean[] /* [NUM_CORPSES] */ = [
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,

  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,

  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,

  // Civs....
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,

  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  1,

  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];

let gDecapitatedCorpse: INT8[] /* [NUM_CORPSES] */ = [
  0,
  Enum249.SMERC_JFK,
  Enum249.SMERC_JFK,
  Enum249.SMERC_JFK,
  Enum249.SMERC_JFK,
  Enum249.SMERC_JFK,
  Enum249.SMERC_JFK,
  Enum249.SMERC_JFK,
  Enum249.SMERC_JFK,

  Enum249.MMERC_JFK,
  Enum249.MMERC_JFK,
  Enum249.MMERC_JFK,
  Enum249.MMERC_JFK,
  Enum249.MMERC_JFK,
  Enum249.MMERC_JFK,
  Enum249.MMERC_JFK,
  Enum249.MMERC_JFK,

  Enum249.FMERC_JFK,
  Enum249.FMERC_JFK,
  Enum249.FMERC_JFK,
  Enum249.FMERC_JFK,
  Enum249.FMERC_JFK,
  Enum249.FMERC_JFK,
  Enum249.FMERC_JFK,
  Enum249.FMERC_JFK,

  // Civs....
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];

export let gRottingCorpse: ROTTING_CORPSE[] /* [MAX_ROTTING_CORPSES] */;
export let giNumRottingCorpse: INT32 = 0;

function GetFreeRottingCorpse(): INT32 {
  let iCount: INT32;

  for (iCount = 0; iCount < giNumRottingCorpse; iCount++) {
    if ((gRottingCorpse[iCount].fActivated == false))
      return iCount;
  }

  if (giNumRottingCorpse < MAX_ROTTING_CORPSES)
    return giNumRottingCorpse++;

  return -1;
}

function RecountRottingCorpses(): void {
  let uiCount: INT32;

  if (giNumRottingCorpse > 0) {
    for (uiCount = giNumRottingCorpse - 1; (uiCount >= 0); uiCount--) {
      if ((gRottingCorpse[uiCount].fActivated == false)) {
        giNumRottingCorpse = (uiCount + 1);
        break;
      }
    }
  }
}

export function GetCorpseStructIndex(pCorpseDef: Pointer<ROTTING_CORPSE_DEFINITION>, fForImage: boolean): UINT16 {
  let bDirection: INT8;

  switch (pCorpseDef.value.ubType) {
    case Enum249.QUEEN_MONSTER_DEAD:
    case Enum249.BURNT_DEAD:
    case Enum249.EXPLODE_DEAD:

      bDirection = 0;
      break;

    case Enum249.ICECREAM_DEAD:
    case Enum249.HUMMER_DEAD:

      // OK , these have 2 directions....
      bDirection = gb2DirectionsFrom8[pCorpseDef.value.bDirection];
      if (fForImage) {
        bDirection = gOneCDirection[bDirection];
      }
      break;

    case Enum249.SMERC_FALL:
    case Enum249.SMERC_FALLF:
    case Enum249.MMERC_FALL:
    case Enum249.MMERC_FALLF:
    case Enum249.FMERC_FALL:
    case Enum249.FMERC_FALLF:

      // OK , these have 4 directions....
      bDirection = gb4DirectionsFrom8[pCorpseDef.value.bDirection];

      if (fForImage) {
        bDirection = gOneCDirection[bDirection];
      }
      break;

    default:

      // Uses 8
      bDirection = pCorpseDef.value.bDirection;

      if (fForImage) {
        bDirection = gOneCDirection[bDirection];
      }
      break;
  }

  return bDirection;
}

export function AddRottingCorpse(pCorpseDef: Pointer<ROTTING_CORPSE_DEFINITION>): INT32 {
  let iIndex: INT32;
  let pCorpse: Pointer<ROTTING_CORPSE>;
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
  let ubLevelID: UINT8;
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF> = null;
  let zFilename: string /* INT8[150] */;
  let pDBStructureRef: Pointer<DB_STRUCTURE_REF>;
  let ubLoop: UINT8;
  let sTileGridNo: INT16;
  let ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let usStructIndex: UINT16;
  let uiDirectionUseFlag: UINT32;

  if (pCorpseDef.value.sGridNo == NOWHERE) {
    return -1;
  }

  if (pCorpseDef.value.ubType == Enum249.NO_CORPSE) {
    return -1;
  }

  if ((iIndex = GetFreeRottingCorpse()) == (-1))
    return -1;

  pCorpse = addressof(gRottingCorpse[iIndex]);

  // Copy elements in
  memcpy(pCorpse, pCorpseDef, sizeof(ROTTING_CORPSE_DEFINITION));

  uiDirectionUseFlag = ANITILE_USE_DIRECTION_FOR_START_FRAME;

  // If we are a soecial type...
  switch (pCorpseDef.value.ubType) {
    case Enum249.SMERC_FALL:
    case Enum249.SMERC_FALLF:
    case Enum249.MMERC_FALL:
    case Enum249.MMERC_FALLF:
    case Enum249.FMERC_FALL:
    case Enum249.FMERC_FALLF:

      uiDirectionUseFlag = ANITILE_USE_4DIRECTION_FOR_START_FRAME;
  }

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // OK, AS WE ADD, CHECK FOR TOD AND DECAY APPROPRIATELY
    if (((GetWorldTotalMin() - pCorpse.value.def.uiTimeOfDeath) > DELAY_UNTIL_ROTTING) && (pCorpse.value.def.ubType < Enum249.ROTTING_STAGE2)) {
      if (pCorpse.value.def.ubType <= Enum249.FMERC_FALLF) {
        // Rott!
        pCorpse.value.def.ubType = Enum249.ROTTING_STAGE2;
      }
    }

    // If time of death is a few days, now, don't add at all!
    if (((GetWorldTotalMin() - pCorpse.value.def.uiTimeOfDeath) > DELAY_UNTIL_DONE_ROTTING)) {
      return -1;
    }
  }

  // Check if on roof or not...
  if (pCorpse.value.def.bLevel == 0) {
    // ubLevelID = ANI_OBJECT_LEVEL;
    ubLevelID = ANI_STRUCT_LEVEL;
  } else {
    ubLevelID = ANI_ONROOF_LEVEL;
  }

  memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
  AniParams.sGridNo = pCorpse.value.def.sGridNo;
  AniParams.ubLevelID = ubLevelID;
  AniParams.sDelay = (150);
  AniParams.sStartFrame = 0;
  AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_PAUSED | ANITILE_OPTIMIZEFORSLOWMOVING | ANITILE_ANIMATE_Z | ANITILE_ERASEITEMFROMSAVEBUFFFER | uiDirectionUseFlag;
  AniParams.sX = CenterX(pCorpse.value.def.sGridNo);
  AniParams.sY = CenterY(pCorpse.value.def.sGridNo);
  AniParams.sZ = pCorpse.value.def.sHeightAdjustment;
  AniParams.uiUserData3 = pCorpse.value.def.bDirection;

  if (!gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
    AniParams.zCachedFile = zNoBloodCorpseFilenames[pCorpse.value.def.ubType];
  } else {
    AniParams.zCachedFile = zCorpseFilenames[pCorpse.value.def.ubType];
  }

  pCorpse.value.pAniTile = CreateAnimationTile(addressof(AniParams));

  if (pCorpse.value.pAniTile == null) {
    pCorpse.value.fActivated = false;
    return -1;
  }

  // Set flag and index values
  pCorpse.value.pAniTile.value.pLevelNode.value.uiFlags |= (LEVELNODE_ROTTINGCORPSE);

  pCorpse.value.pAniTile.value.pLevelNode.value.ubShadeLevel = gpWorldLevelData[pCorpse.value.def.sGridNo].pLandHead.value.ubShadeLevel;
  pCorpse.value.pAniTile.value.pLevelNode.value.ubSumLights = gpWorldLevelData[pCorpse.value.def.sGridNo].pLandHead.value.ubSumLights;
  pCorpse.value.pAniTile.value.pLevelNode.value.ubMaxLights = gpWorldLevelData[pCorpse.value.def.sGridNo].pLandHead.value.ubMaxLights;
  pCorpse.value.pAniTile.value.pLevelNode.value.ubNaturalShadeLevel = gpWorldLevelData[pCorpse.value.def.sGridNo].pLandHead.value.ubNaturalShadeLevel;

  pCorpse.value.pAniTile.value.uiUserData = iIndex;
  pCorpse.value.iID = iIndex;

  pCorpse.value.fActivated = true;

  if (Random(100) > 50) {
    pCorpse.value.fAttractCrowsOnlyWhenOnScreen = true;
  } else {
    pCorpse.value.fAttractCrowsOnlyWhenOnScreen = false;
  }

  pCorpse.value.iCachedTileID = pCorpse.value.pAniTile.value.sCachedTileID;

  if (pCorpse.value.iCachedTileID == -1) {
    DeleteAniTile(pCorpse.value.pAniTile);
    pCorpse.value.fActivated = false;
    return -1;
  }

  // Get palette and create palettes and do substitutions
  if (!CreateCorpsePalette(pCorpse)) {
    DeleteAniTile(pCorpse.value.pAniTile);
    pCorpse.value.fActivated = false;
    return -1;
  }

  SetRenderFlags(RENDER_FLAG_FULL);

  if (pCorpse.value.def.usFlags & ROTTING_CORPSE_VEHICLE) {
    pCorpse.value.pAniTile.value.uiFlags |= (ANITILE_FORWARD | ANITILE_LOOPING);

    // Turn off pause...
    pCorpse.value.pAniTile.value.uiFlags &= (~ANITILE_PAUSED);
  }

  InvalidateWorldRedundency();

  // OK, loop through gridnos for corpse and remove blood.....

  // Get root filename... this removes path and extension
  // USed to find struct data fo rthis corpse...
  GetRootName(zFilename, AniParams.zCachedFile);

  // Add structure data.....
  CheckForAndAddTileCacheStructInfo(pCorpse.value.pAniTile.value.pLevelNode, pCorpse.value.def.sGridNo, (pCorpse.value.iCachedTileID), GetCorpseStructIndex(pCorpseDef, true));

  pStructureFileRef = GetCachedTileStructureRefFromFilename(zFilename);

  if (pStructureFileRef != null) {
    usStructIndex = GetCorpseStructIndex(pCorpseDef, true);

    pDBStructureRef = addressof(pStructureFileRef.value.pDBStructureRef[usStructIndex]);

    for (ubLoop = 0; ubLoop < pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles; ubLoop++) {
      ppTile = pDBStructureRef.value.ppTile;

      sTileGridNo = pCorpseDef.value.sGridNo + ppTile[ubLoop].value.sPosRelToBase;

      // Remove blood
      RemoveBlood(sTileGridNo, pCorpseDef.value.bLevel);
    }
  }

  // OK, we're done!
  return iIndex;
}

function FreeCorpsePalettes(pCorpse: Pointer<ROTTING_CORPSE>): void {
  let cnt: INT32;

  // Free palettes
  MemFree(pCorpse.value.p8BPPPalette);
  MemFree(pCorpse.value.p16BPPPalette);

  for (cnt = 0; cnt < NUM_CORPSE_SHADES; cnt++) {
    if (pCorpse.value.pShades[cnt] != null) {
      MemFree(pCorpse.value.pShades[cnt]);
      pCorpse.value.pShades[cnt] = null;
    }
  }
}

export function RemoveCorpses(): void {
  let iCount: INT32;

  for (iCount = 0; iCount < giNumRottingCorpse; iCount++) {
    if ((gRottingCorpse[iCount].fActivated)) {
      RemoveCorpse(iCount);
    }
  }

  giNumRottingCorpse = 0;
}

function RemoveCorpse(iCorpseID: INT32): void {
  // Remove!
  gRottingCorpse[iCorpseID].fActivated = false;

  DeleteAniTile(gRottingCorpse[iCorpseID].pAniTile);

  FreeCorpsePalettes(addressof(gRottingCorpse[iCorpseID]));
}

function CreateCorpsePalette(pCorpse: Pointer<ROTTING_CORPSE>): boolean {
  let zColFilename: string /* CHAR8[100] */;
  let bBodyTypePalette: INT8;
  let Temp8BPPPalette: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);

  pCorpse.value.p8BPPPalette = MemAlloc(sizeof(SGPPaletteEntry) * 256);

  if (pCorpse.value.p8BPPPalette == null) {
    return false;
  }

  bBodyTypePalette = GetBodyTypePaletteSubstitutionCode(null, pCorpse.value.def.ubBodyType, zColFilename);

  // If this corpse has cammo,
  if (pCorpse.value.def.ubType == Enum249.ROTTING_STAGE2) {
    bBodyTypePalette = 0;
  } else if (pCorpse.value.def.usFlags & ROTTING_CORPSE_USE_CAMMO_PALETTE) {
    zColFilename = "ANIMS\\camo.COL";
    bBodyTypePalette = 1;
  }

  if (bBodyTypePalette == -1) {
    // Use palette from HVOBJECT, then use substitution for pants, etc
    memcpy(pCorpse.value.p8BPPPalette, gpTileCache[pCorpse.value.iCachedTileID].pImagery.value.vo.value.pPaletteEntry, sizeof(pCorpse.value.p8BPPPalette) * 256);

    // Substitute based on head, etc
    SetPaletteReplacement(pCorpse.value.p8BPPPalette, pCorpse.value.def.HeadPal);
    SetPaletteReplacement(pCorpse.value.p8BPPPalette, pCorpse.value.def.VestPal);
    SetPaletteReplacement(pCorpse.value.p8BPPPalette, pCorpse.value.def.PantsPal);
    SetPaletteReplacement(pCorpse.value.p8BPPPalette, pCorpse.value.def.SkinPal);
  } else if (bBodyTypePalette == 0) {
    // Use palette from hvobject
    memcpy(pCorpse.value.p8BPPPalette, gpTileCache[pCorpse.value.iCachedTileID].pImagery.value.vo.value.pPaletteEntry, sizeof(pCorpse.value.p8BPPPalette) * 256);
  } else {
    // Use col file
    if (CreateSGPPaletteFromCOLFile(Temp8BPPPalette, zColFilename)) {
      // Copy into palette
      memcpy(pCorpse.value.p8BPPPalette, Temp8BPPPalette, sizeof(pCorpse.value.p8BPPPalette) * 256);
    } else {
      // Use palette from hvobject
      memcpy(pCorpse.value.p8BPPPalette, gpTileCache[pCorpse.value.iCachedTileID].pImagery.value.vo.value.pPaletteEntry, sizeof(pCorpse.value.p8BPPPalette) * 256);
    }
  }

  // -- BUILD 16BPP Palette from this
  pCorpse.value.p16BPPPalette = Create16BPPPalette(pCorpse.value.p8BPPPalette);

  CreateCorpsePaletteTables(pCorpse);

  return true;
}

export function TurnSoldierIntoCorpse(pSoldier: Pointer<SOLDIERTYPE>, fRemoveMerc: boolean, fCheckForLOS: boolean): boolean {
  let Corpse: ROTTING_CORPSE_DEFINITION = createRottingCorpseDefinition();
  let ubType: UINT8;
  let cnt: INT32;
  let usItemFlags: UINT16 = 0; // WORLD_ITEM_DONTRENDER;
  let iCorpseID: INT32;
  let bVisible: INT8 = -1;
  let pObj: Pointer<OBJECTTYPE>;
  let ubNumGoo: UINT8;
  let sNewGridNo: INT16;
  let ItemObject: OBJECTTYPE = createObjectType();

  if (pSoldier.value.sGridNo == NOWHERE) {
    return false;
  }

  // ATE: Change to fix crash when item in hand
  if (gpItemPointer != null && gpItemPointerSoldier == pSoldier) {
    CancelItemPointer();
  }

  // Setup some values!
  memset(addressof(Corpse), 0, sizeof(Corpse));
  Corpse.ubBodyType = pSoldier.value.ubBodyType;
  Corpse.sGridNo = pSoldier.value.sGridNo;
  Corpse.dXPos = pSoldier.value.dXPos;
  Corpse.dYPos = pSoldier.value.dYPos;
  Corpse.bLevel = pSoldier.value.bLevel;
  Corpse.ubProfile = pSoldier.value.ubProfile;

  if (Corpse.bLevel > 0) {
    Corpse.sHeightAdjustment = (pSoldier.value.sHeightAdjustment - WALL_HEIGHT);
  }

  SET_PALETTEREP_ID(Corpse.HeadPal, pSoldier.value.HeadPal);
  SET_PALETTEREP_ID(Corpse.VestPal, pSoldier.value.VestPal);
  SET_PALETTEREP_ID(Corpse.SkinPal, pSoldier.value.SkinPal);
  SET_PALETTEREP_ID(Corpse.PantsPal, pSoldier.value.PantsPal);

  if (pSoldier.value.bCamo != 0) {
    Corpse.usFlags |= ROTTING_CORPSE_USE_CAMMO_PALETTE;
  }

  // Determine corpse type!
  ubType = gubAnimSurfaceCorpseID[pSoldier.value.ubBodyType][pSoldier.value.usAnimState];

  Corpse.bDirection = pSoldier.value.bDirection;

  // If we are a vehicle.... only use 1 direction....
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    Corpse.usFlags |= ROTTING_CORPSE_VEHICLE;

    if (pSoldier.value.ubBodyType != Enum194.ICECREAMTRUCK && pSoldier.value.ubBodyType != Enum194.HUMVEE) {
      Corpse.bDirection = 7;
    } else {
      Corpse.bDirection = gb2DirectionsFrom8[Corpse.bDirection];
    }
  }

  if (ubType == Enum249.QUEEN_MONSTER_DEAD || ubType == Enum249.BURNT_DEAD || ubType == Enum249.EXPLODE_DEAD) {
    Corpse.bDirection = 7;
  }

  // ATE: If bDirection, get opposite
  //	if ( ubType == SMERC_FALLF || ubType == MMERC_FALLF || ubType == FMERC_FALLF )
  //{
  //	Corpse.bDirection = gOppositeDirection[ Corpse.bDirection ];
  //	}

  // Set time of death
  Corpse.uiTimeOfDeath = GetWorldTotalMin();

  // If corpse is not valid. make items visible
  if (ubType == Enum249.NO_CORPSE && pSoldier.value.bTeam != gbPlayerNum) {
    usItemFlags &= (~WORLD_ITEM_DONTRENDER);
  }

  // ATE: If the queen is killed, she should
  // make items visible because it ruins end sequence....
  if (pSoldier.value.ubProfile == Enum268.QUEEN || pSoldier.value.bTeam == gbPlayerNum) {
    bVisible = 1;
  }

  // Not for a robot...
  if (AM_A_ROBOT(pSoldier)) {
  } else if (ubType == Enum249.QUEEN_MONSTER_DEAD) {
    gTacticalStatus.fLockItemLocators = false;

    ubNumGoo = 6 - (gGameOptions.ubDifficultyLevel - Enum9.DIF_LEVEL_EASY);

    sNewGridNo = pSoldier.value.sGridNo + (WORLD_COLS * 2);

    for (cnt = 0; cnt < ubNumGoo; cnt++) {
      CreateItem(Enum225.JAR_QUEEN_CREATURE_BLOOD, 100, addressof(ItemObject));

      AddItemToPool(sNewGridNo, addressof(ItemObject), bVisible, pSoldier.value.bLevel, usItemFlags, -1);
    }
  } else {
    // OK, Place what objects this guy was carrying on the ground!
    for (cnt = 0; cnt < Enum261.NUM_INV_SLOTS; cnt++) {
      pObj = addressof(pSoldier.value.inv[cnt]);

      if (pObj.value.usItem != NOTHING) {
        // Check if it's supposed to be dropped
        if (!(pObj.value.fFlags & OBJECT_UNDROPPABLE) || pSoldier.value.bTeam == gbPlayerNum) {
          // and make sure that it really is a droppable item type
          if (!(Item[pObj.value.usItem].fFlags & ITEM_DEFAULT_UNDROPPABLE)) {
            ReduceAmmoDroppedByNonPlayerSoldiers(pSoldier, cnt);
            AddItemToPool(pSoldier.value.sGridNo, pObj, bVisible, pSoldier.value.bLevel, usItemFlags, -1);
          }
        }
      }
    }

    DropKeysInKeyRing(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bLevel, bVisible, false, 0, false);
  }

  // Make team look for items
  AllSoldiersLookforItems(true);

  // if we are to call TacticalRemoveSoldier after adding the corpse
  if (fRemoveMerc) {
    // If not a player, you can completely remove soldiertype
    // otherwise, just remove their graphic
    if (pSoldier.value.bTeam != gbPlayerNum) {
      // Remove merc!
      // ATE: Remove merc slot first - will disappear if no corpse data found!
      TacticalRemoveSoldier(pSoldier.value.ubID);
    } else {
      RemoveSoldierFromGridNo(pSoldier);
    }

    if (ubType == Enum249.NO_CORPSE) {
      return true;
    }

    // Set type
    Corpse.ubType = ubType;

    // Add corpse!
    iCorpseID = AddRottingCorpse(addressof(Corpse));
  } else {
    if (ubType == Enum249.NO_CORPSE) {
      return true;
    }

    // Set type
    Corpse.ubType = ubType;

    // Add corpse!
    iCorpseID = AddRottingCorpse(addressof(Corpse));
  }

  // If this is our guy......make visible...
  // if ( pSoldier->bTeam == gbPlayerNum )
  { MakeCorpseVisible(pSoldier, addressof(gRottingCorpse[iCorpseID])); }

  return true;
}

export function FindNearestRottingCorpse(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = NOWHERE;
  let cnt: INT32;
  let pCorpse: Pointer<ROTTING_CORPSE>;

  // OK, loop through our current listing of bodies
  for (cnt = 0; cnt < giNumRottingCorpse; cnt++) {
    pCorpse = addressof(gRottingCorpse[cnt]);

    if (pCorpse.value.fActivated) {
      // Check rotting state
      if (pCorpse.value.def.ubType == Enum249.ROTTING_STAGE2) {
        uiRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, pCorpse.value.def.sGridNo);

        if (uiRange < uiLowestRange) {
          sLowestGridNo = pCorpse.value.def.sGridNo;
          uiLowestRange = uiRange;
        }
      }
    }
  }

  return sLowestGridNo;
}

function AddCrowToCorpse(pCorpse: Pointer<ROTTING_CORPSE>): void {
  let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let bBodyType: INT8 = Enum194.CROW;
  let iNewIndex: UINT8;
  let sGridNo: INT16;
  let ubDirection: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubRoomNum: UINT8;

  // No crows inside :(
  if (InARoom(pCorpse.value.def.sGridNo, addressof(ubRoomNum))) {
    return;
  }

  // Put him flying over corpse pisition
  memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
  MercCreateStruct.ubProfile = NO_PROFILE;
  MercCreateStruct.sSectorX = gWorldSectorX;
  MercCreateStruct.sSectorY = gWorldSectorY;
  MercCreateStruct.bSectorZ = gbWorldSectorZ;
  MercCreateStruct.bBodyType = bBodyType;
  MercCreateStruct.bDirection = Enum245.SOUTH;
  MercCreateStruct.bTeam = CIV_TEAM;
  MercCreateStruct.sInsertionGridNo = pCorpse.value.def.sGridNo;
  RandomizeNewSoldierStats(addressof(MercCreateStruct));

  if (TacticalCreateSoldier(addressof(MercCreateStruct), addressof(iNewIndex)) != null) {
    pSoldier = MercPtrs[iNewIndex];

    sGridNo = FindRandomGridNoFromSweetSpot(pSoldier, pCorpse.value.def.sGridNo, 2, addressof(ubDirection));

    if (sGridNo != NOWHERE) {
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      pSoldier.value.usStrategicInsertionData = sGridNo;

      pSoldier.value.sInsertionGridNo = sGridNo;
      pSoldier.value.sDesiredHeight = 0;

      // Add to sector
      AddSoldierToSector(iNewIndex);

      // Change to fly animation
      // sGridNo =  FindRandomGridNoFromSweetSpot( pSoldier, pCorpse->def.sGridNo, 5, &ubDirection );
      // pSoldier->usUIMovementMode = CROW_FLY;
      // EVENT_GetNewSoldierPath( pSoldier, sGridNo, pSoldier->usUIMovementMode );

      // Setup action data to point back to corpse....
      pSoldier.value.uiPendingActionData1 = pCorpse.value.iID;
      pSoldier.value.sPendingActionData2 = pCorpse.value.def.sGridNo;

      pCorpse.value.def.bNumServicingCrows++;
    }
  }
}

export function HandleCrowLeave(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pCorpse: Pointer<ROTTING_CORPSE>;

  // Check if this crow is still referencing the same corpse...
  pCorpse = addressof(gRottingCorpse[pSoldier.value.uiPendingActionData1]);

  // Double check grindo...
  if (pSoldier.value.sPendingActionData2 == pCorpse.value.def.sGridNo) {
    // We have a match
    // Adjust crow servicing count...
    pCorpse.value.def.bNumServicingCrows--;

    if (pCorpse.value.def.bNumServicingCrows < 0) {
      pCorpse.value.def.bNumServicingCrows = 0;
    }
  }
}

export function HandleCrowFlyAway(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubDirection: UINT8;
  let sGridNo: INT16;

  // Set desired height
  pSoldier.value.sDesiredHeight = 100;

  // Change to fly animation
  sGridNo = FindRandomGridNoFromSweetSpot(pSoldier, pSoldier.value.sGridNo, 5, addressof(ubDirection));
  pSoldier.value.usUIMovementMode = Enum193.CROW_FLY;
  SendGetNewSoldierPathEvent(pSoldier, sGridNo, pSoldier.value.usUIMovementMode);
}

export function HandleRottingCorpses(): void {
  let pCorpse: Pointer<ROTTING_CORPSE>;
  let bNumCrows: INT8 = 0;
  let uiChosenCorpseID: UINT32;

  // Don't allow crows here if flags not set
  if (!gTacticalStatus.fGoodToAllowCrows) {
    return;
  }

  // ATE: If it's too late, don't!
  if (NightTime()) {
    return;
  }

  if (gbWorldSectorZ > 0) {
    return;
  }

  // ATE: Check for multiple crows.....
  // Couint how many we have now...
  {
    let bLoop: UINT8;
    let pSoldier: Pointer<SOLDIERTYPE>;

    for (bLoop = gTacticalStatus.Team[CIV_TEAM].bFirstID, pSoldier = MercPtrs[bLoop]; bLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; bLoop++, pSoldier++) {
      if (pSoldier.value.bActive && pSoldier.value.bInSector && (pSoldier.value.bLife >= OKLIFE) && !(pSoldier.value.uiStatusFlags & SOLDIER_GASSED)) {
        if (pSoldier.value.ubBodyType == Enum194.CROW) {
          bNumCrows++;
        }
      }
    }
  }

  // Once population gets down to 0, we can add more again....
  if (bNumCrows == 0) {
    gTacticalStatus.fDontAddNewCrows = false;
  }

  if (gTacticalStatus.fDontAddNewCrows) {
    return;
  }

  if (bNumCrows >= gTacticalStatus.ubNumCrowsPossible) {
    gTacticalStatus.fDontAddNewCrows = true;
    return;
  }

  if (gTacticalStatus.Team[CREATURE_TEAM].bTeamActive) {
    // don't add any crows while there are predators around
    return;
  }

  // Pick one to attact a crow...
  {
    uiChosenCorpseID = Random(giNumRottingCorpse);

    pCorpse = addressof(gRottingCorpse[uiChosenCorpseID]);

    if (pCorpse.value.fActivated) {
      if (!(pCorpse.value.def.usFlags & ROTTING_CORPSE_VEHICLE)) {
        if (pCorpse.value.def.ubType == Enum249.ROTTING_STAGE2) {
          if (GridNoOnScreen(pCorpse.value.def.sGridNo)) {
            return;
          }

          AddCrowToCorpse(pCorpse);
          AddCrowToCorpse(pCorpse);
        }
      }
    }
  }
}

function MakeCorpseVisible(pSoldier: Pointer<SOLDIERTYPE>, pCorpse: Pointer<ROTTING_CORPSE>): void {
  pCorpse.value.def.bVisible = 1;
  SetRenderFlags(RENDER_FLAG_FULL);
}

function AllMercsOnTeamLookForCorpse(pCorpse: Pointer<ROTTING_CORPSE>, bTeam: INT8): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sDistVisible: INT16;
  let sGridNo: INT16;

  // If this cump is already visible, return
  if (pCorpse.value.def.bVisible == 1) {
    return;
  }

  if (!pCorpse.value.fActivated) {
    return;
  }

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[bTeam].bFirstID;

  sGridNo = pCorpse.value.def.sGridNo;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[bTeam].bLastID; cnt++, pSoldier++) {
    // ATE: Ok, lets check for some basic things here!
    if (pSoldier.value.bLife >= OKLIFE && pSoldier.value.sGridNo != NOWHERE && pSoldier.value.bActive && pSoldier.value.bInSector) {
      // is he close enough to see that gridno if he turns his head?
      sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, pCorpse.value.def.bLevel);

      if (PythSpacesAway(pSoldier.value.sGridNo, sGridNo) <= sDistVisible) {
        // and we can trace a line of sight to his x,y coordinates?
        // (taking into account we are definitely aware of this guy now)
        if (SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, pCorpse.value.def.bLevel, 3, sDistVisible, true)) {
          MakeCorpseVisible(pSoldier, pCorpse);
          return;
        }
      }
    }
  }
}

function MercLooksForCorpses(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: INT32;
  let sDistVisible: INT16;
  let sGridNo: INT16;
  let pCorpse: Pointer<ROTTING_CORPSE>;

  // Should we say disgust quote?
  if ((pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_ROTTINGCORPSE)) {
    return;
  }

  if (pSoldier.value.ubProfile == NO_PROFILE) {
    return;
  }

  if (AM_AN_EPC(pSoldier)) {
    return;
  }

  if (QuoteExp_HeadShotOnly[pSoldier.value.ubProfile] == 1) {
    return;
  }

  // Every so often... do a corpse quote...
  if (Random(400) <= 2) {
    // Loop through all corpses....
    for (cnt = 0; cnt < giNumRottingCorpse; cnt++) {
      pCorpse = addressof(gRottingCorpse[cnt]);

      if (!pCorpse.value.fActivated) {
        continue;
      }

      // Has this corpse rotted enough?
      if (pCorpse.value.def.ubType == Enum249.ROTTING_STAGE2) {
        sGridNo = pCorpse.value.def.sGridNo;

        // is he close enough to see that gridno if he turns his head?
        sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, pCorpse.value.def.bLevel);

        if (PythSpacesAway(pSoldier.value.sGridNo, sGridNo) <= sDistVisible) {
          // and we can trace a line of sight to his x,y coordinates?
          // (taking into account we are definitely aware of this guy now)
          if (SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, pCorpse.value.def.bLevel, 3, sDistVisible, true)) {
            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_HEADSHOT);

            pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_ROTTINGCORPSE;

            BeginMultiPurposeLocator(sGridNo, pCorpse.value.def.bLevel, false);

            // Slide to...
            SlideToLocation(0, sGridNo);

            return;
          }
        }
      }
    }
  }
}

export function RebuildAllCorpseShadeTables(): void {
  let cnt: INT32;
  let pCorpse: Pointer<ROTTING_CORPSE>;

  // Loop through all corpses....
  for (cnt = 0; cnt < giNumRottingCorpse; cnt++) {
    pCorpse = addressof(gRottingCorpse[cnt]);

    // If this cump is already visible, continue
    if (pCorpse.value.def.bVisible == 1) {
      continue;
    }

    if (!pCorpse.value.fActivated) {
      continue;
    }

    // Rebuild shades....
  }
}

function CreateCorpsePaletteTables(pCorpse: Pointer<ROTTING_CORPSE>): UINT16 {
  let LightPal: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);
  let uiCount: UINT32;

  // create the basic shade table
  for (uiCount = 0; uiCount < 256; uiCount++) {
    // combine the rgb of the light color with the object's palette
    LightPal[uiCount].peRed = (Math.min(pCorpse.value.p8BPPPalette[uiCount].peRed + gpLightColors[0].peRed, 255));
    LightPal[uiCount].peGreen = (Math.min(pCorpse.value.p8BPPPalette[uiCount].peGreen + gpLightColors[0].peGreen, 255));
    LightPal[uiCount].peBlue = (Math.min(pCorpse.value.p8BPPPalette[uiCount].peBlue + gpLightColors[0].peBlue, 255));
  }
  // build the shade tables
  CreateCorpseShadedPalette(pCorpse, 0, LightPal);

  // build neutral palette as well!
  // Set current shade table to neutral color

  return true;
}

function CreateCorpseShadedPalette(pCorpse: Pointer<ROTTING_CORPSE>, uiBase: UINT32, pShadePal: Pointer<SGPPaletteEntry>): boolean {
  let uiCount: UINT32;

  pCorpse.value.pShades[uiBase] = Create16BPPPaletteShaded(pShadePal, gusShadeLevels[0][0], gusShadeLevels[0][1], gusShadeLevels[0][2], true);

  for (uiCount = 1; uiCount < 16; uiCount++) {
    pCorpse.value.pShades[uiBase + uiCount] = Create16BPPPaletteShaded(pShadePal, gusShadeLevels[uiCount][0], gusShadeLevels[uiCount][1], gusShadeLevels[uiCount][2], false);
  }

  return true;
}

function FindCorpseBasedOnStructure(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): Pointer<ROTTING_CORPSE> {
  let pLevelNode: Pointer<LEVELNODE>;
  let pCorpse: Pointer<ROTTING_CORPSE> = null;

  pLevelNode = gpWorldLevelData[sGridNo].pStructHead;
  while (pLevelNode != null) {
    if (pLevelNode.value.pStructureData == pStructure) {
      break;
    }
    pLevelNode = pLevelNode.value.pNext;
  }

  if (pLevelNode != null) {
    // Get our corpse....
    pCorpse = addressof(gRottingCorpse[pLevelNode.value.pAniTile.value.uiUserData]);
  }

  return pCorpse;
}

export function CorpseHit(sGridNo: INT16, usStructureID: UINT16): void {
}

export function VaporizeCorpse(sGridNo: INT16, usStructureID: UINT16): void {
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let pCorpse: Pointer<ROTTING_CORPSE> = null;
  let sBaseGridNo: INT16;
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();

  pStructure = FindStructureByID(sGridNo, usStructureID);

  // Get base....
  pBaseStructure = FindBaseStructure(pStructure);

  // Find base gridno...
  sBaseGridNo = pBaseStructure.value.sGridNo;

  // Get corpse ID.....
  pCorpse = FindCorpseBasedOnStructure(sBaseGridNo, pBaseStructure);

  if (pCorpse == null) {
    return;
  }

  if (pCorpse.value.def.usFlags & ROTTING_CORPSE_VEHICLE) {
    return;
  }

  if (GridNoOnScreen(sBaseGridNo)) {
    // Add explosion
    memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
    AniParams.sGridNo = sBaseGridNo;
    AniParams.ubLevelID = ANI_STRUCT_LEVEL;
    AniParams.sDelay = (80);
    AniParams.sStartFrame = 0;
    AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD;
    AniParams.sX = CenterX(sBaseGridNo);
    AniParams.sY = CenterY(sBaseGridNo);
    AniParams.sZ = pCorpse.value.def.sHeightAdjustment;

    AniParams.zCachedFile = "TILECACHE\\GEN_BLOW.STI";
    CreateAnimationTile(addressof(AniParams));

    // Remove....
    RemoveCorpse(pCorpse.value.iID);
    SetRenderFlags(RENDER_FLAG_FULL);

    if (pCorpse.value.def.bLevel == 0) {
      // Set some blood......
      SpreadEffect(sBaseGridNo, ((2)), 0, NOBODY, BLOOD_SPREAD_EFFECT, 0, -1);
    }
  }

  // PLay a sound....
  PlayJA2Sample((Enum330.BODY_EXPLODE_1), RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
}

export function FindNearestAvailableGridNoForCorpse(pDef: Pointer<ROTTING_CORPSE_DEFINITION>, ubRadius: INT8): INT16 {
  let sSweetGridNo: INT16;
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let cnt3: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = 0;
  let leftmost: INT32;
  let fFound: boolean = false;
  let soldier: SOLDIERTYPE;
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF> = null;
  let zFilename: string /* INT8[150] */;
  let ubBestDirection: UINT8 = 0;
  let fSetDirection: boolean = false;

  cnt3 = 0;

  // Get root filename... this removes path and extension
  // USed to find struct data fo rthis corpse...
  GetRootName(zFilename, zCorpseFilenames[pDef.value.ubType]);

  pStructureFileRef = GetCachedTileStructureRefFromFilename(zFilename);

  sSweetGridNo = pDef.value.sGridNo;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  memset(addressof(soldier), 0, sizeof(SOLDIERTYPE));
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(addressof(soldier), NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, 0);

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(addressof(soldier), sGridNo, true, soldier.bLevel)) {
          let fDirectionFound: boolean = false;
          let fCanSetDirection: boolean = false;

          // Check each struct in each direction
          if (pStructureFileRef == null) {
            fDirectionFound = true;
          } else {
            for (cnt3 = 0; cnt3 < 8; cnt3++) {
              if (OkayToAddStructureToWorld(sGridNo, pDef.value.bLevel, addressof(pStructureFileRef.value.pDBStructureRef[gOneCDirection[cnt3]]), INVALID_STRUCTURE_ID)) {
                fDirectionFound = true;
                fCanSetDirection = true;
                break;
              }
            }
          }

          if (fDirectionFound) {
            uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

            if (uiRange < uiLowestRange) {
              if (fCanSetDirection) {
                ubBestDirection = cnt3;
                fSetDirection = true;
              }
              sLowestGridNo = sGridNo;
              uiLowestRange = uiRange;
              fFound = true;
            }
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    if (fSetDirection) {
      pDef.value.bDirection = ubBestDirection;
    }

    return sLowestGridNo;
  }
  return NOWHERE;
}

export function IsValidDecapitationCorpse(pCorpse: Pointer<ROTTING_CORPSE>): boolean {
  if (pCorpse.value.def.fHeadTaken) {
    return false;
  }

  return gbCorpseValidForDecapitation[pCorpse.value.def.ubType];
}

export function GetCorpseAtGridNo(sGridNo: INT16, bLevel: INT8): Pointer<ROTTING_CORPSE> {
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let sBaseGridNo: INT16;

  pStructure = FindStructure(sGridNo, STRUCTURE_CORPSE);

  if (pStructure != null) {
    // Get base....
    pBaseStructure = FindBaseStructure(pStructure);

    // Find base gridno...
    sBaseGridNo = pBaseStructure.value.sGridNo;

    if (pBaseStructure != null) {
      return FindCorpseBasedOnStructure(sBaseGridNo, pBaseStructure);
    }
  }

  return null;
}

export function DecapitateCorpse(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bLevel: INT8): void {
  let Object: OBJECTTYPE = createObjectType();
  let pCorpse: Pointer<ROTTING_CORPSE>;
  let CorpseDef: ROTTING_CORPSE_DEFINITION = createRottingCorpseDefinition();
  let usHeadIndex: UINT16 = Enum225.HEAD_1;

  pCorpse = GetCorpseAtGridNo(sGridNo, bLevel);

  if (pCorpse == null) {
    return;
  }

  if (IsValidDecapitationCorpse(pCorpse)) {
    // Decapitate.....
    // Copy corpse definition...
    memcpy(addressof(CorpseDef), addressof(pCorpse.value.def), sizeof(ROTTING_CORPSE_DEFINITION));

    // Add new one...
    CorpseDef.ubType = gDecapitatedCorpse[CorpseDef.ubType];

    pCorpse.value.def.fHeadTaken = true;

    if (CorpseDef.ubType != 0) {
      // Remove old one...
      RemoveCorpse(pCorpse.value.iID);

      AddRottingCorpse(addressof(CorpseDef));
    }

    // Add head item.....

    // Pick the head based on profile type...
    switch (pCorpse.value.def.ubProfile) {
      case 83:
        usHeadIndex = Enum225.HEAD_2;
        break;

      case 111:
        usHeadIndex = Enum225.HEAD_3;
        break;

      case 64:
        usHeadIndex = Enum225.HEAD_4;
        break;

      case 112:
        usHeadIndex = Enum225.HEAD_5;
        break;

      case 82:
        usHeadIndex = Enum225.HEAD_6;
        break;

      case 110:
        usHeadIndex = Enum225.HEAD_7;
        break;
    }

    CreateItem(usHeadIndex, 100, addressof(Object));
    AddItemToPool(sGridNo, addressof(Object), INVISIBLE, 0, 0, 0);

    // All teams lok for this...
    NotifySoldiersToLookforItems();
  }
}

export function GetBloodFromCorpse(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pCorpse: Pointer<ROTTING_CORPSE>;
  let bObjSlot: INT8;
  let Object: OBJECTTYPE = createObjectType();

  // OK, get corpse
  pCorpse = addressof(gRottingCorpse[pSoldier.value.uiPendingActionData4]);

  bObjSlot = FindObj(pSoldier, Enum225.JAR);

  // What kind of corpse ami I?
  switch (pCorpse.value.def.ubType) {
    case Enum249.ADULTMONSTER_DEAD:
    case Enum249.INFANTMONSTER_DEAD:

      // Can get creature blood....
      CreateItem(Enum225.JAR_CREATURE_BLOOD, 100, addressof(Object));
      break;

    case Enum249.QUEEN_MONSTER_DEAD:
      CreateItem(Enum225.JAR_QUEEN_CREATURE_BLOOD, 100, addressof(Object));
      break;

    default:

      CreateItem(Enum225.JAR_HUMAN_BLOOD, 100, addressof(Object));
      break;
  }

  if (bObjSlot != NO_SLOT) {
    SwapObjs(addressof(pSoldier.value.inv[bObjSlot]), addressof(Object));
  }
}

export function ReduceAmmoDroppedByNonPlayerSoldiers(pSoldier: Pointer<SOLDIERTYPE>, iInvSlot: INT32): void {
  let pObj: Pointer<OBJECTTYPE>;

  Assert(pSoldier);
  Assert((iInvSlot >= 0) && (iInvSlot < Enum261.NUM_INV_SLOTS));

  pObj = addressof(pSoldier.value.inv[iInvSlot]);

  // if not a player soldier
  if (pSoldier.value.bTeam != gbPlayerNum) {
    // if it's ammo
    if (Item[pObj.value.usItem].usItemClass == IC_AMMO) {
      // don't drop all the clips, just a random # of them between 1 and how many there are
      pObj.value.ubNumberOfObjects = (1 + Random(pObj.value.ubNumberOfObjects));
      // recalculate the weight
      pObj.value.ubWeight = CalculateObjectWeight(pObj);
    }
  }
}

export function LookForAndMayCommentOnSeeingCorpse(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubLevel: UINT8): void {
  let pCorpse: Pointer<ROTTING_CORPSE>;
  let bToleranceThreshold: INT8 = 0;
  let cnt: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  if (QuoteExp_HeadShotOnly[pSoldier.value.ubProfile] == 1) {
    return;
  }

  pCorpse = GetCorpseAtGridNo(sGridNo, ubLevel);

  if (pCorpse == null) {
    return;
  }

  if (pCorpse.value.def.ubType != Enum249.ROTTING_STAGE2) {
    return;
  }

  // If servicing qrows, tolerance is now 1
  if (pCorpse.value.def.bNumServicingCrows > 0) {
    bToleranceThreshold++;
  }

  // Check tolerance
  if (pSoldier.value.bCorpseQuoteTolerance <= bToleranceThreshold) {
    // Say quote...
    TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_HEADSHOT);

    BeginMultiPurposeLocator(sGridNo, ubLevel, false);

    // Reset values....
    pSoldier.value.bCorpseQuoteTolerance = (Random(3) + 1);

    // 50% chance of adding 1 to other mercs....
    if (Random(2) == 1) {
      // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

      // look for all mercs on the same team,
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
        // ATE: Ok, lets check for some basic things here!
        if (pTeamSoldier.value.bLife >= OKLIFE && pTeamSoldier.value.sGridNo != NOWHERE && pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
          pTeamSoldier.value.bCorpseQuoteTolerance++;
        }
      }
    }
  }
}

export function GetGridNoOfCorpseGivenProfileID(ubProfileID: UINT8): INT16 {
  let cnt: INT32;
  let pCorpse: Pointer<ROTTING_CORPSE>;

  // Loop through all corpses....
  for (cnt = 0; cnt < giNumRottingCorpse; cnt++) {
    pCorpse = addressof(gRottingCorpse[cnt]);

    if (pCorpse.value.fActivated) {
      if (pCorpse.value.def.ubProfile == ubProfileID) {
        return pCorpse.value.def.sGridNo;
      }
    }
  }

  return NOWHERE;
}

export function DecayRottingCorpseAIWarnings(): void {
  let cnt: INT32;
  let pCorpse: Pointer<ROTTING_CORPSE>;

  for (cnt = 0; cnt < giNumRottingCorpse; cnt++) {
    pCorpse = addressof(gRottingCorpse[cnt]);

    if (pCorpse.value.fActivated && pCorpse.value.def.ubAIWarningValue > 0) {
      pCorpse.value.def.ubAIWarningValue--;
    }
  }
}

export function GetNearestRottingCorpseAIWarning(sGridNo: INT16): UINT8 {
  let cnt: INT32;
  let pCorpse: Pointer<ROTTING_CORPSE>;
  let ubHighestWarning: UINT8 = 0;

  for (cnt = 0; cnt < giNumRottingCorpse; cnt++) {
    pCorpse = addressof(gRottingCorpse[cnt]);

    if (pCorpse.value.fActivated && pCorpse.value.def.ubAIWarningValue > 0) {
      if (PythSpacesAway(sGridNo, pCorpse.value.def.sGridNo) <= CORPSE_WARNING_DIST) {
        if (pCorpse.value.def.ubAIWarningValue > ubHighestWarning) {
          ubHighestWarning = pCorpse.value.def.ubAIWarningValue;
        }
      }
    }
  }

  return ubHighestWarning;
}

}
