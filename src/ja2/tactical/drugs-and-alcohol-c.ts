let ubDrugTravelRate: UINT8[] /* [] */ = [
  4,
  2,
];
let ubDrugWearoffRate: UINT8[] /* [] */ = [
  2,
  2,
];
let ubDrugEffect: UINT8[] /* [] */ = [
  15,
  8,
];
let ubDrugSideEffect: UINT8[] /* [] */ = [
  20,
  10,
];
let ubDrugSideEffectRate: UINT8[] /* [] */ = [
  2,
  1,
];

let giDrunkModifier: INT32[] /* [] */ = [
  100, // Sober
  75, // Feeling good,
  65, // Bporderline
  50, // Drunk
  100, // HungOver
];

const HANGOVER_AP_REDUCE = 5;
const HANGOVER_BP_REDUCE = 200;

function GetDrugType(usItem: UINT16): UINT8 {
  if (usItem == ADRENALINE_BOOSTER) {
    return DRUG_TYPE_ADRENALINE;
  }

  if (usItem == REGEN_BOOSTER) {
    return DRUG_TYPE_REGENERATION;
  }

  if (usItem == ALCOHOL || usItem == WINE || usItem == BEER) {
    return DRUG_TYPE_ALCOHOL;
  }

  return NO_DRUG;
}

function ApplyDrugs(pSoldier: Pointer<SOLDIERTYPE>, pObject: Pointer<OBJECTTYPE>): BOOLEAN {
  let ubDrugType: UINT8;
  let ubKitPoints: UINT8;
  let bRegenPointsGained: INT8;
  let usItem: UINT16;

  usItem = pObject.value.usItem;

  // If not a syringe, return

  ubDrugType = GetDrugType(usItem);

  // Determine what type of drug....
  if (ubDrugType == NO_DRUG) {
    return FALSE;
  }

  // do switch for Larry!!
  if (pSoldier.value.ubProfile == LARRY_NORMAL) {
    pSoldier = SwapLarrysProfiles(pSoldier);
  } else if (pSoldier.value.ubProfile == LARRY_DRUNK) {
    gMercProfiles[LARRY_DRUNK].bNPCData = 0;
  }

  if (ubDrugType < NUM_COMPLEX_DRUGS) {
    // Add effects
    if ((pSoldier.value.bFutureDrugEffect[ubDrugType] + ubDrugEffect[ubDrugType]) < 127) {
      pSoldier.value.bFutureDrugEffect[ubDrugType] += ubDrugEffect[ubDrugType];
    }
    pSoldier.value.bDrugEffectRate[ubDrugType] = ubDrugTravelRate[ubDrugType];

    // Increment times used during lifetime...
    // CAP!
    if (ubDrugType == DRUG_TYPE_ADRENALINE) {
      if (gMercProfiles[pSoldier.value.ubProfile].ubNumTimesDrugUseInLifetime != 255) {
        gMercProfiles[pSoldier.value.ubProfile].ubNumTimesDrugUseInLifetime++;
      }
    }

    // Reset once we sleep...
    pSoldier.value.bTimesDrugUsedSinceSleep[ubDrugType]++;

    // Increment side effects..
    if ((pSoldier.value.bDrugSideEffect[ubDrugType] + ubDrugSideEffect[ubDrugType]) < 127) {
      pSoldier.value.bDrugSideEffect[ubDrugType] += (ubDrugSideEffect[ubDrugType]);
    }
    // Stop side effects until were done....
    pSoldier.value.bDrugSideEffectRate[ubDrugType] = 0;

    if (ubDrugType == DRUG_TYPE_ALCOHOL) {
      // ATE: use kit points...
      if (usItem == ALCOHOL) {
        ubKitPoints = 10;
      } else if (usItem == WINE) {
        ubKitPoints = 20;
      } else {
        ubKitPoints = 100;
      }

      UseKitPoints(pObject, ubKitPoints, pSoldier);
    } else {
      // Remove the object....
      DeleteObj(pObject);

      // ATE: Make guy collapse from heart attack if too much stuff taken....
      if (pSoldier.value.bDrugSideEffectRate[ubDrugType] > (ubDrugSideEffect[ubDrugType] * 3)) {
        // Keel over...
        DeductPoints(pSoldier, 0, 10000);

        // Permanently lower certain stats...
        pSoldier.value.bWisdom -= 5;
        pSoldier.value.bDexterity -= 5;
        pSoldier.value.bStrength -= 5;

        if (pSoldier.value.bWisdom < 1)
          pSoldier.value.bWisdom = 1;
        if (pSoldier.value.bDexterity < 1)
          pSoldier.value.bDexterity = 1;
        if (pSoldier.value.bStrength < 1)
          pSoldier.value.bStrength = 1;

        // export stat changes to profile
        gMercProfiles[pSoldier.value.ubProfile].bWisdom = pSoldier.value.bWisdom;
        gMercProfiles[pSoldier.value.ubProfile].bDexterity = pSoldier.value.bDexterity;
        gMercProfiles[pSoldier.value.ubProfile].bStrength = pSoldier.value.bStrength;

        // make those stats RED for a while...
        pSoldier.value.uiChangeWisdomTime = GetJA2Clock();
        pSoldier.value.usValueGoneUp &= ~(WIS_INCREASE);
        pSoldier.value.uiChangeDexterityTime = GetJA2Clock();
        pSoldier.value.usValueGoneUp &= ~(DEX_INCREASE);
        pSoldier.value.uiChangeStrengthTime = GetJA2Clock();
        pSoldier.value.usValueGoneUp &= ~(STRENGTH_INCREASE);
      }
    }
  } else {
    if (ubDrugType == DRUG_TYPE_REGENERATION) {
      // each use of a regen booster over 1, each day, reduces the effect
      bRegenPointsGained = REGEN_POINTS_PER_BOOSTER * pObject.value.bStatus[0] / 100;
      // are there fractional %s left over?
      if ((pObject.value.bStatus[0] % (100 / REGEN_POINTS_PER_BOOSTER)) != 0) {
        // chance of an extra point
        if (PreRandom(100 / REGEN_POINTS_PER_BOOSTER) < (pObject.value.bStatus[0] % (100 / REGEN_POINTS_PER_BOOSTER))) {
          bRegenPointsGained++;
        }
      }

      bRegenPointsGained -= pSoldier.value.bRegenBoostersUsedToday;
      if (bRegenPointsGained > 0) {
        // can't go above the points you get for a full boost
        pSoldier.value.bRegenerationCounter = __min(pSoldier.value.bRegenerationCounter + bRegenPointsGained, REGEN_POINTS_PER_BOOSTER);
      }
      pSoldier.value.bRegenBoostersUsedToday++;
    }

    // remove object
    DeleteObj(pObject);
  }

  if (ubDrugType == DRUG_TYPE_ALCOHOL) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[MSG_DRANK_SOME], pSoldier.value.name, ShortItemNames[usItem]);
  } else {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[MSG_MERC_TOOK_DRUG], pSoldier.value.name);
  }

  // Dirty panel
  fInterfacePanelDirty = DIRTYLEVEL2;

  return TRUE;
}

function HandleEndTurnDrugAdjustments(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: INT32;
  let cnt2: INT32;
  let iNumLoops: INT32;
  //	INT8 bBandaged;

  for (cnt = 0; cnt < NUM_COMPLEX_DRUGS; cnt++) {
    // If side effect aret is non-zero....
    if (pSoldier.value.bDrugSideEffectRate[cnt] > 0) {
      // Subtract some...
      pSoldier.value.bDrugSideEffect[cnt] -= pSoldier.value.bDrugSideEffectRate[cnt];

      // If we're done, we're done!
      if (pSoldier.value.bDrugSideEffect[cnt] <= 0) {
        pSoldier.value.bDrugSideEffect[cnt] = 0;
        fInterfacePanelDirty = DIRTYLEVEL1;
      }
    }

    // IF drug rate is -ve, it's being worn off...
    if (pSoldier.value.bDrugEffectRate[cnt] < 0) {
      pSoldier.value.bDrugEffect[cnt] -= (-1 * pSoldier.value.bDrugEffectRate[cnt]);

      // Have we run out?
      if (pSoldier.value.bDrugEffect[cnt] <= 0) {
        pSoldier.value.bDrugEffect[cnt] = 0;

        // Dirty panel
        fInterfacePanelDirty = DIRTYLEVEL2;

        // Start the bad news!
        pSoldier.value.bDrugSideEffectRate[cnt] = ubDrugSideEffectRate[cnt];

        // The drug rate is 0 now too
        pSoldier.value.bDrugEffectRate[cnt] = 0;

        // Once for each 'level' of crash....
        iNumLoops = (pSoldier.value.bDrugSideEffect[cnt] / ubDrugSideEffect[cnt]) + 1;

        for (cnt2 = 0; cnt2 < iNumLoops; cnt2++) {
          // OK, give a much BIGGER morale downer
          if (cnt == DRUG_TYPE_ALCOHOL) {
            HandleMoraleEvent(pSoldier, MORALE_ALCOHOL_CRASH, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
          } else {
            HandleMoraleEvent(pSoldier, MORALE_DRUGS_CRASH, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
          }
        }
      }
    }

    // Add increase ineffect....
    if (pSoldier.value.bDrugEffectRate[cnt] > 0) {
      // Seap some in....
      pSoldier.value.bFutureDrugEffect[cnt] -= pSoldier.value.bDrugEffectRate[cnt];
      pSoldier.value.bDrugEffect[cnt] += pSoldier.value.bDrugEffectRate[cnt];

      // Refresh morale w/ new drug value...
      RefreshSoldierMorale(pSoldier);

      // Check if we need to stop 'adding'
      if (pSoldier.value.bFutureDrugEffect[cnt] <= 0) {
        pSoldier.value.bFutureDrugEffect[cnt] = 0;
        // Change rate to -ve..
        pSoldier.value.bDrugEffectRate[cnt] = -ubDrugWearoffRate[cnt];
      }
    }
  }

  if (pSoldier.value.bRegenerationCounter > 0) {
    //		bBandaged = BANDAGED( pSoldier );

    // increase life
    pSoldier.value.bLife = __min(pSoldier.value.bLife + LIFE_GAIN_PER_REGEN_POINT, pSoldier.value.bLifeMax);

    if (pSoldier.value.bLife == pSoldier.value.bLifeMax) {
      pSoldier.value.bBleeding = 0;
    } else if (pSoldier.value.bBleeding + pSoldier.value.bLife > pSoldier.value.bLifeMax) {
      // got to reduce amount of bleeding
      pSoldier.value.bBleeding = (pSoldier.value.bLifeMax - pSoldier.value.bLife);
    }

    // decrement counter
    pSoldier.value.bRegenerationCounter--;
  }
}

function GetDrugEffect(pSoldier: Pointer<SOLDIERTYPE>, ubDrugType: UINT8): INT8 {
  return pSoldier.value.bDrugEffect[ubDrugType];
}

function GetDrugSideEffect(pSoldier: Pointer<SOLDIERTYPE>, ubDrugType: UINT8): INT8 {
  // If we have a o-positive effect
  if (pSoldier.value.bDrugEffect[ubDrugType] > 0) {
    return 0;
  } else {
    return pSoldier.value.bDrugSideEffect[ubDrugType];
  }
}

function HandleAPEffectDueToDrugs(pSoldier: Pointer<SOLDIERTYPE>, pubPoints: Pointer<UINT8>): void {
  let bDrunkLevel: INT8;
  let sPoints: INT16 = (*pubPoints);

  // Are we in a side effect or good effect?
  if (pSoldier.value.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    sPoints += pSoldier.value.bDrugEffect[DRUG_TYPE_ADRENALINE];
  } else if (pSoldier.value.bDrugSideEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    sPoints -= pSoldier.value.bDrugSideEffect[DRUG_TYPE_ADRENALINE];

    if (sPoints < AP_MINIMUM) {
      sPoints = AP_MINIMUM;
    }
  }

  bDrunkLevel = GetDrunkLevel(pSoldier);

  if (bDrunkLevel == HUNGOVER) {
    // Reduce....
    sPoints -= HANGOVER_AP_REDUCE;

    if (sPoints < AP_MINIMUM) {
      sPoints = AP_MINIMUM;
    }
  }

  (*pubPoints) = sPoints;
}

function HandleBPEffectDueToDrugs(pSoldier: Pointer<SOLDIERTYPE>, psPointReduction: Pointer<INT16>): void {
  let bDrunkLevel: INT8;

  // Are we in a side effect or good effect?
  if (pSoldier.value.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    (*psPointReduction) -= (pSoldier.value.bDrugEffect[DRUG_TYPE_ADRENALINE] * BP_RATIO_RED_PTS_TO_NORMAL);
  } else if (pSoldier.value.bDrugSideEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    (*psPointReduction) += (pSoldier.value.bDrugSideEffect[DRUG_TYPE_ADRENALINE] * BP_RATIO_RED_PTS_TO_NORMAL);
  }

  bDrunkLevel = GetDrunkLevel(pSoldier);

  if (bDrunkLevel == HUNGOVER) {
    // Reduce....
    (*psPointReduction) += HANGOVER_BP_REDUCE;
  }
}

function GetDrunkLevel(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let bNumDrinks: INT8;

  // If we have a -ve effect ...
  if (pSoldier.value.bDrugEffect[DRUG_TYPE_ALCOHOL] == 0 && pSoldier.value.bDrugSideEffect[DRUG_TYPE_ALCOHOL] == 0) {
    return SOBER;
  }

  if (pSoldier.value.bDrugEffect[DRUG_TYPE_ALCOHOL] == 0 && pSoldier.value.bDrugSideEffect[DRUG_TYPE_ALCOHOL] != 0) {
    return HUNGOVER;
  }

  // Calculate how many dinks we have had....
  bNumDrinks = (pSoldier.value.bDrugEffect[DRUG_TYPE_ALCOHOL] / ubDrugEffect[DRUG_TYPE_ALCOHOL]);

  if (bNumDrinks <= 3) {
    return FEELING_GOOD;
  } else if (bNumDrinks <= 4) {
    return BORDERLINE;
  } else {
    return DRUNK;
  }
}

function EffectStatForBeingDrunk(pSoldier: Pointer<SOLDIERTYPE>, iStat: INT32): INT32 {
  return iStat * giDrunkModifier[GetDrunkLevel(pSoldier)] / 100;
}

function MercUnderTheInfluence(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Are we in a side effect or good effect?
  if (pSoldier.value.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
    return TRUE;
  } else if (pSoldier.value.bDrugSideEffect[DRUG_TYPE_ADRENALINE]) {
    return TRUE;
  }

  if (GetDrunkLevel(pSoldier) != SOBER) {
    return TRUE;
  }

  return FALSE;
}
