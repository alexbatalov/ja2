namespace ja2 {

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
  if (usItem == Enum225.ADRENALINE_BOOSTER) {
    return DRUG_TYPE_ADRENALINE;
  }

  if (usItem == Enum225.REGEN_BOOSTER) {
    return DRUG_TYPE_REGENERATION;
  }

  if (usItem == Enum225.ALCOHOL || usItem == Enum225.WINE || usItem == Enum225.BEER) {
    return DRUG_TYPE_ALCOHOL;
  }

  return NO_DRUG;
}

export function ApplyDrugs(pSoldier: SOLDIERTYPE, pObject: OBJECTTYPE): boolean {
  let ubDrugType: UINT8;
  let ubKitPoints: UINT8;
  let bRegenPointsGained: INT8;
  let usItem: UINT16;

  usItem = pObject.usItem;

  // If not a syringe, return

  ubDrugType = GetDrugType(usItem);

  // Determine what type of drug....
  if (ubDrugType == NO_DRUG) {
    return false;
  }

  // do switch for Larry!!
  if (pSoldier.ubProfile == Enum268.LARRY_NORMAL) {
    pSoldier = SwapLarrysProfiles(pSoldier);
  } else if (pSoldier.ubProfile == Enum268.LARRY_DRUNK) {
    gMercProfiles[Enum268.LARRY_DRUNK].bNPCData = 0;
  }

  if (ubDrugType < NUM_COMPLEX_DRUGS) {
    // Add effects
    if ((pSoldier.bFutureDrugEffect[ubDrugType] + ubDrugEffect[ubDrugType]) < 127) {
      pSoldier.bFutureDrugEffect[ubDrugType] += ubDrugEffect[ubDrugType];
    }
    pSoldier.bDrugEffectRate[ubDrugType] = ubDrugTravelRate[ubDrugType];

    // Increment times used during lifetime...
    // CAP!
    if (ubDrugType == DRUG_TYPE_ADRENALINE) {
      if (gMercProfiles[pSoldier.ubProfile].ubNumTimesDrugUseInLifetime != 255) {
        gMercProfiles[pSoldier.ubProfile].ubNumTimesDrugUseInLifetime++;
      }
    }

    // Reset once we sleep...
    pSoldier.bTimesDrugUsedSinceSleep[ubDrugType]++;

    // Increment side effects..
    if ((pSoldier.bDrugSideEffect[ubDrugType] + ubDrugSideEffect[ubDrugType]) < 127) {
      pSoldier.bDrugSideEffect[ubDrugType] += (ubDrugSideEffect[ubDrugType]);
    }
    // Stop side effects until were done....
    pSoldier.bDrugSideEffectRate[ubDrugType] = 0;

    if (ubDrugType == DRUG_TYPE_ALCOHOL) {
      // ATE: use kit points...
      if (usItem == Enum225.ALCOHOL) {
        ubKitPoints = 10;
      } else if (usItem == Enum225.WINE) {
        ubKitPoints = 20;
      } else {
        ubKitPoints = 100;
      }

      UseKitPoints(pObject, ubKitPoints, pSoldier);
    } else {
      // Remove the object....
      DeleteObj(pObject);

      // ATE: Make guy collapse from heart attack if too much stuff taken....
      if (pSoldier.bDrugSideEffectRate[ubDrugType] > (ubDrugSideEffect[ubDrugType] * 3)) {
        // Keel over...
        DeductPoints(pSoldier, 0, 10000);

        // Permanently lower certain stats...
        pSoldier.bWisdom -= 5;
        pSoldier.bDexterity -= 5;
        pSoldier.bStrength -= 5;

        if (pSoldier.bWisdom < 1)
          pSoldier.bWisdom = 1;
        if (pSoldier.bDexterity < 1)
          pSoldier.bDexterity = 1;
        if (pSoldier.bStrength < 1)
          pSoldier.bStrength = 1;

        // export stat changes to profile
        gMercProfiles[pSoldier.ubProfile].bWisdom = pSoldier.bWisdom;
        gMercProfiles[pSoldier.ubProfile].bDexterity = pSoldier.bDexterity;
        gMercProfiles[pSoldier.ubProfile].bStrength = pSoldier.bStrength;

        // make those stats RED for a while...
        pSoldier.uiChangeWisdomTime = GetJA2Clock();
        pSoldier.usValueGoneUp &= ~(WIS_INCREASE);
        pSoldier.uiChangeDexterityTime = GetJA2Clock();
        pSoldier.usValueGoneUp &= ~(DEX_INCREASE);
        pSoldier.uiChangeStrengthTime = GetJA2Clock();
        pSoldier.usValueGoneUp &= ~(STRENGTH_INCREASE);
      }
    }
  } else {
    if (ubDrugType == DRUG_TYPE_REGENERATION) {
      // each use of a regen booster over 1, each day, reduces the effect
      bRegenPointsGained = REGEN_POINTS_PER_BOOSTER * pObject.bStatus[0] / 100;
      // are there fractional %s left over?
      if ((pObject.bStatus[0] % (100 / REGEN_POINTS_PER_BOOSTER)) != 0) {
        // chance of an extra point
        if (PreRandom(100 / REGEN_POINTS_PER_BOOSTER) < (pObject.bStatus[0] % (100 / REGEN_POINTS_PER_BOOSTER))) {
          bRegenPointsGained++;
        }
      }

      bRegenPointsGained -= pSoldier.bRegenBoostersUsedToday;
      if (bRegenPointsGained > 0) {
        // can't go above the points you get for a full boost
        pSoldier.bRegenerationCounter = Math.min(pSoldier.bRegenerationCounter + bRegenPointsGained, REGEN_POINTS_PER_BOOSTER);
      }
      pSoldier.bRegenBoostersUsedToday++;
    }

    // remove object
    DeleteObj(pObject);
  }

  if (ubDrugType == DRUG_TYPE_ALCOHOL) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_DRANK_SOME], pSoldier.name, ShortItemNames[usItem]);
  } else {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_MERC_TOOK_DRUG], pSoldier.name);
  }

  // Dirty panel
  fInterfacePanelDirty = DIRTYLEVEL2;

  return true;
}

export function HandleEndTurnDrugAdjustments(pSoldier: SOLDIERTYPE): void {
  let cnt: INT32;
  let cnt2: INT32;
  let iNumLoops: INT32;
  //	INT8 bBandaged;

  for (cnt = 0; cnt < NUM_COMPLEX_DRUGS; cnt++) {
    // If side effect aret is non-zero....
    if (pSoldier.bDrugSideEffectRate[cnt] > 0) {
      // Subtract some...
      pSoldier.bDrugSideEffect[cnt] -= pSoldier.bDrugSideEffectRate[cnt];

      // If we're done, we're done!
      if (pSoldier.bDrugSideEffect[cnt] <= 0) {
        pSoldier.bDrugSideEffect[cnt] = 0;
        fInterfacePanelDirty = DIRTYLEVEL1;
      }
    }

    // IF drug rate is -ve, it's being worn off...
    if (pSoldier.bDrugEffectRate[cnt] < 0) {
      pSoldier.bDrugEffect[cnt] -= (-1 * pSoldier.bDrugEffectRate[cnt]);

      // Have we run out?
      if (pSoldier.bDrugEffect[cnt] <= 0) {
        pSoldier.bDrugEffect[cnt] = 0;

        // Dirty panel
        fInterfacePanelDirty = DIRTYLEVEL2;

        // Start the bad news!
        pSoldier.bDrugSideEffectRate[cnt] = ubDrugSideEffectRate[cnt];

        // The drug rate is 0 now too
        pSoldier.bDrugEffectRate[cnt] = 0;

        // Once for each 'level' of crash....
        iNumLoops = (pSoldier.bDrugSideEffect[cnt] / ubDrugSideEffect[cnt]) + 1;

        for (cnt2 = 0; cnt2 < iNumLoops; cnt2++) {
          // OK, give a much BIGGER morale downer
          if (cnt == DRUG_TYPE_ALCOHOL) {
            HandleMoraleEvent(pSoldier, Enum234.MORALE_ALCOHOL_CRASH, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
          } else {
            HandleMoraleEvent(pSoldier, Enum234.MORALE_DRUGS_CRASH, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
          }
        }
      }
    }

    // Add increase ineffect....
    if (pSoldier.bDrugEffectRate[cnt] > 0) {
      // Seap some in....
      pSoldier.bFutureDrugEffect[cnt] -= pSoldier.bDrugEffectRate[cnt];
      pSoldier.bDrugEffect[cnt] += pSoldier.bDrugEffectRate[cnt];

      // Refresh morale w/ new drug value...
      RefreshSoldierMorale(pSoldier);

      // Check if we need to stop 'adding'
      if (pSoldier.bFutureDrugEffect[cnt] <= 0) {
        pSoldier.bFutureDrugEffect[cnt] = 0;
        // Change rate to -ve..
        pSoldier.bDrugEffectRate[cnt] = -ubDrugWearoffRate[cnt];
      }
    }
  }

  if (pSoldier.bRegenerationCounter > 0) {
    //		bBandaged = BANDAGED( pSoldier );

    // increase life
    pSoldier.bLife = Math.min(pSoldier.bLife + LIFE_GAIN_PER_REGEN_POINT, pSoldier.bLifeMax);

    if (pSoldier.bLife == pSoldier.bLifeMax) {
      pSoldier.bBleeding = 0;
    } else if (pSoldier.bBleeding + pSoldier.bLife > pSoldier.bLifeMax) {
      // got to reduce amount of bleeding
      pSoldier.bBleeding = (pSoldier.bLifeMax - pSoldier.bLife);
    }

    // decrement counter
    pSoldier.bRegenerationCounter--;
  }
}

export function GetDrugEffect(pSoldier: SOLDIERTYPE, ubDrugType: UINT8): INT8 {
  return pSoldier.bDrugEffect[ubDrugType];
}

function GetDrugSideEffect(pSoldier: SOLDIERTYPE, ubDrugType: UINT8): INT8 {
  // If we have a o-positive effect
  if (pSoldier.bDrugEffect[ubDrugType] > 0) {
    return 0;
  } else {
    return pSoldier.bDrugSideEffect[ubDrugType];
  }
}

export function HandleAPEffectDueToDrugs(pSoldier: SOLDIERTYPE, ubPoints: UINT8): UINT8 {
  let bDrunkLevel: INT8;
  let sPoints: INT16 = ubPoints;

  // Are we in a side effect or good effect?
  if (pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    sPoints += pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE];
  } else if (pSoldier.bDrugSideEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    sPoints -= pSoldier.bDrugSideEffect[DRUG_TYPE_ADRENALINE];

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

  ubPoints = sPoints;

  return ubPoints;
}

export function HandleBPEffectDueToDrugs(pSoldier: SOLDIERTYPE, sPointReduction: INT16): INT16 {
  let bDrunkLevel: INT8;

  // Are we in a side effect or good effect?
  if (pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    sPointReduction -= (pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE] * BP_RATIO_RED_PTS_TO_NORMAL);
  } else if (pSoldier.bDrugSideEffect[DRUG_TYPE_ADRENALINE]) {
    // Adjust!
    sPointReduction += (pSoldier.bDrugSideEffect[DRUG_TYPE_ADRENALINE] * BP_RATIO_RED_PTS_TO_NORMAL);
  }

  bDrunkLevel = GetDrunkLevel(pSoldier);

  if (bDrunkLevel == HUNGOVER) {
    // Reduce....
    sPointReduction += HANGOVER_BP_REDUCE;
  }

  return sPointReduction;
}

export function GetDrunkLevel(pSoldier: SOLDIERTYPE): INT8 {
  let bNumDrinks: INT8;

  // If we have a -ve effect ...
  if (pSoldier.bDrugEffect[DRUG_TYPE_ALCOHOL] == 0 && pSoldier.bDrugSideEffect[DRUG_TYPE_ALCOHOL] == 0) {
    return SOBER;
  }

  if (pSoldier.bDrugEffect[DRUG_TYPE_ALCOHOL] == 0 && pSoldier.bDrugSideEffect[DRUG_TYPE_ALCOHOL] != 0) {
    return HUNGOVER;
  }

  // Calculate how many dinks we have had....
  bNumDrinks = (pSoldier.bDrugEffect[DRUG_TYPE_ALCOHOL] / ubDrugEffect[DRUG_TYPE_ALCOHOL]);

  if (bNumDrinks <= 3) {
    return FEELING_GOOD;
  } else if (bNumDrinks <= 4) {
    return BORDERLINE;
  } else {
    return DRUNK;
  }
}

export function EffectStatForBeingDrunk(pSoldier: SOLDIERTYPE, iStat: INT32): INT32 {
  return iStat * giDrunkModifier[GetDrunkLevel(pSoldier)] / 100;
}

export function MercUnderTheInfluence(pSoldier: SOLDIERTYPE): boolean {
  // Are we in a side effect or good effect?
  if (pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
    return true;
  } else if (pSoldier.bDrugSideEffect[DRUG_TYPE_ADRENALINE]) {
    return true;
  }

  if (GetDrunkLevel(pSoldier) != SOBER) {
    return true;
  }

  return false;
}

}
