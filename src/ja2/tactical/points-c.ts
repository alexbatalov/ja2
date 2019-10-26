function TerrainActionPoints(pSoldier: Pointer<SOLDIERTYPE>, sGridno: INT16, bDir: INT8, bLevel: INT8): INT16 {
  let sAPCost: INT16 = 0;
  let sSwitchValue: INT16;
  let fHiddenStructVisible: boolean; // Used for hidden struct visiblity

  if (pSoldier.value.bStealthMode)
    sAPCost += AP_STEALTH_MODIFIER;

  if (pSoldier.value.bReverse || gUIUseReverse)
    sAPCost += AP_REVERSE_MODIFIER;

  // if (GridCost[gridno] == NPCMINECOST)
  //   switchValue = BackupGridCost[gridno];
  // else

  sSwitchValue = gubWorldMovementCosts[sGridno][bDir][bLevel];

  // Check reality vs what the player knows....
  if (pSoldier.value.bTeam == gbPlayerNum) {
    // Is this obstcale a hidden tile that has not been revealed yet?
    if (DoesGridnoContainHiddenStruct(sGridno, addressof(fHiddenStructVisible))) {
      // Are we not visible, if so use terrain costs!
      if (!fHiddenStructVisible) {
        // Set cost of terrain!
        sSwitchValue = gTileTypeMovementCost[gpWorldLevelData[sGridno].ubTerrainID];
      }
    }
  }
  if (sSwitchValue == TRAVELCOST_NOT_STANDING) {
    // use the cost of the terrain!
    sSwitchValue = gTileTypeMovementCost[gpWorldLevelData[sGridno].ubTerrainID];
  } else if (IS_TRAVELCOST_DOOR(sSwitchValue)) {
    sSwitchValue = DoorTravelCost(pSoldier, sGridno, sSwitchValue, (pSoldier.value.bTeam == gbPlayerNum), null);
  }

  if (sSwitchValue >= TRAVELCOST_BLOCKED && sSwitchValue != TRAVELCOST_DOOR) {
    return (100); // Cost too much to be considered!
  }

  switch (sSwitchValue) {
    case TRAVELCOST_DIRTROAD:
    case TRAVELCOST_FLAT:
      sAPCost += AP_MOVEMENT_FLAT;
      break;
      // case TRAVELCOST_BUMPY		:
    case TRAVELCOST_GRASS:
      sAPCost += AP_MOVEMENT_GRASS;
      break;
    case TRAVELCOST_THICK:
      sAPCost += AP_MOVEMENT_BUSH;
      break;
    case TRAVELCOST_DEBRIS:
      sAPCost += AP_MOVEMENT_RUBBLE;
      break;
    case TRAVELCOST_SHORE:
      sAPCost += AP_MOVEMENT_SHORE; // wading shallow water
      break;
    case TRAVELCOST_KNEEDEEP:
      sAPCost += AP_MOVEMENT_LAKE; // wading waist/chest deep - very slow
      break;

    case TRAVELCOST_DEEPWATER:
      sAPCost += AP_MOVEMENT_OCEAN; // can swim, so it's faster than wading
      break;
      /*
         case TRAVELCOST_VEINEND	:
         case TRAVELCOST_VEINMID	: sAPCost += AP_MOVEMENT_FLAT;
                                                                                                                              break;
      */
    case TRAVELCOST_DOOR:
      sAPCost += AP_MOVEMENT_FLAT;
      break;

      // cost for jumping a fence REPLACES all other AP costs!
    case TRAVELCOST_FENCE:
      return AP_JUMPFENCE;

    case TRAVELCOST_NONE:
      return 0;

    default:

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Calc AP: Unrecongnized MP type %d in %d, direction %d", sSwitchValue, sGridno, bDir));
      break;
  }

  if (bDir & 1) {
    sAPCost = (sAPCost * 14) / 10;
  }

  return sAPCost;
}

function BreathPointAdjustmentForCarriedWeight(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  let uiCarriedPercent: UINT32;
  let uiPercentCost: UINT32;

  uiCarriedPercent = CalculateCarriedWeight(pSoldier);
  if (uiCarriedPercent < 101) {
    // normal BP costs
    uiPercentCost = 100;
  } else {
    if (uiCarriedPercent < 151) {
      // between 101 and 150% of max carried weight, extra BP cost
      // of 1% per % above 100... so at 150%, we pay 150%
      uiPercentCost = 100 + (uiCarriedPercent - 100) * 3;
    } else if (uiCarriedPercent < 201) {
      // between 151 and 200% of max carried weight, extra BP cost
      // of 2% per % above 150... so at 200%, we pay 250%
      uiPercentCost = 100 + (uiCarriedPercent - 100) * 3 + (uiCarriedPercent - 150);
    } else {
      // over 200%, extra BP cost of 3% per % above 200
      uiPercentCost = 100 + (uiCarriedPercent - 100) * 3 + (uiCarriedPercent - 150) + (uiCarriedPercent - 200);
      // so at 250% weight, we pay 400% breath!
    }
  }
  return uiPercentCost;
}

function TerrainBreathPoints(pSoldier: Pointer<SOLDIERTYPE>, sGridno: INT16, bDir: INT8, usMovementMode: UINT16): INT16 {
  let iPoints: INT32 = 0;
  let ubMovementCost: UINT8;

  ubMovementCost = gubWorldMovementCosts[sGridno][bDir][0];

  switch (ubMovementCost) {
    case TRAVELCOST_DIRTROAD:
    case TRAVELCOST_FLAT:
      iPoints = BP_MOVEMENT_FLAT;
      break;
      // case TRAVELCOST_BUMPY			:
    case TRAVELCOST_GRASS:
      iPoints = BP_MOVEMENT_GRASS;
      break;
    case TRAVELCOST_THICK:
      iPoints = BP_MOVEMENT_BUSH;
      break;
    case TRAVELCOST_DEBRIS:
      iPoints = BP_MOVEMENT_RUBBLE;
      break;
    case TRAVELCOST_SHORE:
      iPoints = BP_MOVEMENT_SHORE;
      break; // wading shallow water
    case TRAVELCOST_KNEEDEEP:
      iPoints = BP_MOVEMENT_LAKE;
      break; // wading waist/chest deep - very slow
    case TRAVELCOST_DEEPWATER:
      iPoints = BP_MOVEMENT_OCEAN;
      break; // can swim, so it's faster than wading
      //  case TRAVELCOST_VEINEND		:
      //  case TRAVELCOST_VEINMID		: iPoints = BP_MOVEMENT_FLAT;		break;
    default:
      if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
        iPoints = BP_MOVEMENT_FLAT;
        break;
      }
      /*
      #ifdef TESTVERSION
           NumMessage("ERROR: TerrainBreathPoints: Unrecognized grid cost = ",
                                                              GridCost[gridno]);
      #endif
      */
      return 0;
  }

  iPoints = iPoints * BreathPointAdjustmentForCarriedWeight(pSoldier) / 100;

  // ATE - MAKE MOVEMENT ALWAYS WALK IF IN WATER
  if (gpWorldLevelData[sGridno].ubTerrainID == Enum315.DEEP_WATER || gpWorldLevelData[sGridno].ubTerrainID == Enum315.MED_WATER || gpWorldLevelData[sGridno].ubTerrainID == Enum315.LOW_WATER) {
    usMovementMode = Enum193.WALKING;
  }

  // so, then we must modify it for other movement styles and accumulate
  switch (usMovementMode) {
    case Enum193.RUNNING:
    case Enum193.ADULTMONSTER_WALKING:
    case Enum193.BLOODCAT_RUN:

      iPoints *= BP_RUN_ENERGYCOSTFACTOR;
      break;

    case Enum193.SIDE_STEP:
    case Enum193.WALK_BACKWARDS:
    case Enum193.BLOODCAT_WALK_BACKWARDS:
    case Enum193.MONSTER_WALK_BACKWARDS:
    case Enum193.WALKING:
      iPoints *= BP_WALK_ENERGYCOSTFACTOR;
      break;

    case Enum193.START_SWAT:
    case Enum193.SWATTING:
    case Enum193.SWAT_BACKWARDS:
      iPoints *= BP_SWAT_ENERGYCOSTFACTOR;
      break;
    case Enum193.CRAWLING:
      iPoints *= BP_CRAWL_ENERGYCOSTFACTOR;
      break;
  }

  // ATE: Adjust these by realtime movement
  if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    // ATE: ADJUST FOR RT - MAKE BREATH GO A LITTLE FASTER!
    iPoints = (iPoints * TB_BREATH_DEDUCT_MODIFIER);
  }

  return iPoints;
}

function ActionPointCost(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bDir: INT8, usMovementMode: UINT16): INT16 {
  let sTileCost: INT16;
  let sPoints: INT16;
  let sSwitchValue: INT16;

  sPoints = 0;

  // get the tile cost for that tile based on WALKING
  sTileCost = TerrainActionPoints(pSoldier, sGridNo, bDir, pSoldier.value.bLevel);

  // Get switch value...
  sSwitchValue = gubWorldMovementCosts[sGridNo][bDir][pSoldier.value.bLevel];

  // Tile cost should not be reduced based on movement mode...
  if (sSwitchValue == TRAVELCOST_FENCE) {
    return sTileCost;
  }

  // ATE - MAKE MOVEMENT ALWAYS WALK IF IN WATER
  if (gpWorldLevelData[sGridNo].ubTerrainID == Enum315.DEEP_WATER || gpWorldLevelData[sGridNo].ubTerrainID == Enum315.MED_WATER || gpWorldLevelData[sGridNo].ubTerrainID == Enum315.LOW_WATER) {
    usMovementMode = Enum193.WALKING;
  }

  // so, then we must modify it for other movement styles and accumulate
  if (sTileCost > 0) {
    switch (usMovementMode) {
      case Enum193.RUNNING:
      case Enum193.ADULTMONSTER_WALKING:
      case Enum193.BLOODCAT_RUN:
        sPoints = ((sTileCost / RUNDIVISOR));
        break;

      case Enum193.CROW_FLY:
      case Enum193.SIDE_STEP:
      case Enum193.WALK_BACKWARDS:
      case Enum193.ROBOT_WALK:
      case Enum193.BLOODCAT_WALK_BACKWARDS:
      case Enum193.MONSTER_WALK_BACKWARDS:
      case Enum193.LARVAE_WALK:
      case Enum193.WALKING:
        sPoints = (sTileCost + WALKCOST);
        break;

      case Enum193.START_SWAT:
      case Enum193.SWAT_BACKWARDS:
      case Enum193.SWATTING:
        sPoints = (sTileCost + SWATCOST);
        break;
      case Enum193.CRAWLING:
        sPoints = (sTileCost + CRAWLCOST);
        break;

      default:

        // Invalid movement mode
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Invalid movement mode %d used in ActionPointCost", usMovementMode));
        sPoints = 1;
    }
  }

  if (sSwitchValue == TRAVELCOST_NOT_STANDING) {
    switch (usMovementMode) {
      case Enum193.RUNNING:
      case Enum193.WALKING:
      case Enum193.LARVAE_WALK:
      case Enum193.SIDE_STEP:
      case Enum193.WALK_BACKWARDS:
        // charge crouch APs for ducking head!
        sPoints += AP_CROUCH;
        break;

      default:
        break;
    }
  }

  return sPoints;
}

function EstimateActionPointCost(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bDir: INT8, usMovementMode: UINT16, bPathIndex: INT8, bPathLength: INT8): INT16 {
  // This action point cost code includes the penalty for having to change
  // stance after jumping a fence IF our path continues...
  let sTileCost: INT16;
  let sPoints: INT16;
  let sSwitchValue: INT16;
  sPoints = 0;

  // get the tile cost for that tile based on WALKING
  sTileCost = TerrainActionPoints(pSoldier, sGridNo, bDir, pSoldier.value.bLevel);

  // so, then we must modify it for other movement styles and accumulate
  if (sTileCost > 0) {
    switch (usMovementMode) {
      case Enum193.RUNNING:
      case Enum193.ADULTMONSTER_WALKING:
      case Enum193.BLOODCAT_RUN:
        sPoints = ((sTileCost / RUNDIVISOR));
        break;

      case Enum193.CROW_FLY:
      case Enum193.SIDE_STEP:
      case Enum193.ROBOT_WALK:
      case Enum193.WALK_BACKWARDS:
      case Enum193.BLOODCAT_WALK_BACKWARDS:
      case Enum193.MONSTER_WALK_BACKWARDS:
      case Enum193.LARVAE_WALK:
      case Enum193.WALKING:
        sPoints = (sTileCost + WALKCOST);
        break;

      case Enum193.START_SWAT:
      case Enum193.SWAT_BACKWARDS:
      case Enum193.SWATTING:
        sPoints = (sTileCost + SWATCOST);
        break;
      case Enum193.CRAWLING:
        sPoints = (sTileCost + CRAWLCOST);
        break;

      default:

        // Invalid movement mode
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Invalid movement mode %d used in ActionPointCost", usMovementMode));
        sPoints = 1;
    }
  }

  // Get switch value...
  sSwitchValue = gubWorldMovementCosts[sGridNo][bDir][pSoldier.value.bLevel];

  // ATE: If we have a 'special cost, like jump fence...
  if (sSwitchValue == TRAVELCOST_FENCE) {
    // If we are changeing stance ( either before or after getting there....
    // We need to reflect that...
    switch (usMovementMode) {
      case Enum193.SIDE_STEP:
      case Enum193.WALK_BACKWARDS:
      case Enum193.RUNNING:
      case Enum193.WALKING:

        // Add here cost to go from crouch to stand AFTER fence hop....
        // Since it's AFTER.. make sure we will be moving after jump...
        if ((bPathIndex + 2) < bPathLength) {
          sPoints += AP_CROUCH;
        }
        break;

      case Enum193.SWATTING:
      case Enum193.START_SWAT:
      case Enum193.SWAT_BACKWARDS:

        // Add cost to stand once there BEFORE....
        sPoints += AP_CROUCH;
        break;

      case Enum193.CRAWLING:

        // Can't do it here.....
        break;
    }
  } else if (sSwitchValue == TRAVELCOST_NOT_STANDING) {
    switch (usMovementMode) {
      case Enum193.RUNNING:
      case Enum193.WALKING:
      case Enum193.SIDE_STEP:
      case Enum193.WALK_BACKWARDS:
        // charge crouch APs for ducking head!
        sPoints += AP_CROUCH;
        break;

      default:
        break;
    }
  }

  return sPoints;
}

function EnoughPoints(pSoldier: Pointer<SOLDIERTYPE>, sAPCost: INT16, sBPCost: INT16, fDisplayMsg: boolean): boolean {
  let sNewAP: INT16 = 0;

  // If this guy is on a special move... don't care about APS, OR BPSs!
  if (pSoldier.value.ubWaitActionToDo) {
    return true;
  }

  if (pSoldier.value.ubQuoteActionID >= Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST && pSoldier.value.ubQuoteActionID <= Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH) {
    // AI guy on special move off map
    return true;
  }

  // IN realtime.. only care about BPs
  if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    sAPCost = 0;
  }

  // Get New points
  sNewAP = pSoldier.value.bActionPoints - sAPCost;

  // If we cannot deduct points, return FALSE
  if (sNewAP < 0) {
    // Display message if it's our own guy
    if (pSoldier.value.bTeam == gbPlayerNum && fDisplayMsg) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NOT_ENOUGH_APS_STR]);
    }
    return false;
  }

  return true;
}

function DeductPoints(pSoldier: Pointer<SOLDIERTYPE>, sAPCost: INT16, sBPCost: INT16): void {
  let sNewAP: INT16 = 0;
  let sNewBP: INT16 = 0;
  let bNewBreath: INT8;

  // in real time, there IS no AP cost, (only breath cost)
  if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    sAPCost = 0;
  }

  // Get New points
  sNewAP = pSoldier.value.bActionPoints - sAPCost;

  // If this is the first time with no action points, set UI flag
  if (sNewAP <= 0 && pSoldier.value.bActionPoints > 0) {
    pSoldier.value.fUIFirstTimeNOAP = true;
    fInterfacePanelDirty = true;
  }

  // If we cannot deduct points, return FALSE
  if (sNewAP < 0) {
    sNewAP = 0;
  }

  pSoldier.value.bActionPoints = sNewAP;

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Deduct Points (%d at %d) %d %d", pSoldier.value.ubID, pSoldier.value.sGridNo, sAPCost, sBPCost));

  if (AM_A_ROBOT(pSoldier)) {
    // zap all breath costs for robot
    sBPCost = 0;
  }

  // is there a BREATH deduction/transaction to be made?  (REMEMBER: could be a GAIN!)
  if (sBPCost) {
    // Adjust breath changes due to spending or regaining of energy
    sBPCost = AdjustBreathPts(pSoldier, sBPCost);
    sBPCost *= -1;

    pSoldier.value.sBreathRed -= sBPCost;

    // CJC: moved check for high breathred to below so that negative breath can be detected

    // cap breathred
    if (pSoldier.value.sBreathRed < 0) {
      pSoldier.value.sBreathRed = 0;
    }
    if (pSoldier.value.sBreathRed > 10000) {
      pSoldier.value.sBreathRed = 10000;
    }

    // Get new breath
    bNewBreath = (pSoldier.value.bBreathMax - (pSoldier.value.sBreathRed / 100));

    if (bNewBreath > 100) {
      bNewBreath = 100;
    }
    if (bNewBreath < 00) {
      // Take off 1 AP per 5 breath... rem adding a negative subtracts
      pSoldier.value.bActionPoints += (bNewBreath / 5);
      if (pSoldier.value.bActionPoints < 0) {
        pSoldier.value.bActionPoints = 0;
      }

      bNewBreath = 0;
    }

    if (bNewBreath > pSoldier.value.bBreathMax) {
      bNewBreath = pSoldier.value.bBreathMax;
    }
    pSoldier.value.bBreath = bNewBreath;
  }

  // UPDATE BAR
  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL1);
}

function AdjustBreathPts(pSold: Pointer<SOLDIERTYPE>, sBPCost: INT16): INT16 {
  let sBreathFactor: INT16 = 100;
  let ubBandaged: UINT8;

  // NumMessage("BEFORE adjustments, BREATH PTS = ",breathPts);

  // in real time, there IS no AP cost, (only breath cost)
  /*
  if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT ) )
  {
          // ATE: ADJUST FOR RT - MAKE BREATH GO A LITTLE FASTER!
          sBPCost	*= TB_BREATH_DEDUCT_MODIFIER;
  }
  */

  // adjust breath factor for current breath deficiency
  sBreathFactor += (100 - pSold.value.bBreath);

  // adjust breath factor for current life deficiency (but add 1/2 bandaging)
  ubBandaged = pSold.value.bLifeMax - pSold.value.bLife - pSold.value.bBleeding;
  // sBreathFactor += (pSold->bLifeMax - (pSold->bLife + (ubBandaged / 2)));
  sBreathFactor += 100 * (pSold.value.bLifeMax - (pSold.value.bLife + (ubBandaged / 2))) / pSold.value.bLifeMax;

  if (pSold.value.bStrength > 80) {
    // give % reduction to breath costs for high strength mercs
    sBreathFactor -= (pSold.value.bStrength - 80) / 2;
  }

  /*	THIS IS OLD JAGGED ALLIANCE STUFF (left for possible future reference)

   // apply penalty due to high temperature, heat, and hot Metaviran sun
   // if INDOORS, in DEEP WATER, or possessing HEAT TOLERANCE trait
   if ((ptr->terrtype == FLOORTYPE) || (ptr->terr >= OCEAN21) ||
                                         (ptr->trait == HEAT_TOLERANT))
     breathFactor += (Status.heatFactor / 5);	// 20% of normal heat penalty
   else
     breathFactor += Status.heatFactor;		// not used to this!
  */

  // if a non-swimmer type is thrashing around in deep water
  if ((pSold.value.ubProfile != NO_PROFILE) && (gMercProfiles[pSold.value.ubProfile].bPersonalityTrait == Enum270.NONSWIMMER)) {
    if (pSold.value.usAnimState == Enum193.DEEP_WATER_TRED || pSold.value.usAnimState == Enum193.DEEP_WATER_SWIM) {
      sBreathFactor *= 5; // lose breath 5 times faster in deep water!
    }
  }

  if (sBreathFactor == 0) {
    sBPCost = 0;
  } else if (sBPCost > 0) // breath DECREASE
    // increase breath COST by breathFactor
    sBPCost = ((sBPCost * sBreathFactor) / 100);
  else // breath INCREASE
    // decrease breath GAIN by breathFactor
    sBPCost = ((sBPCost * 100) / sBreathFactor);

  return sBPCost;
}

function UnusedAPsToBreath(pSold: Pointer<SOLDIERTYPE>): void {
  let sUnusedAPs: INT16;
  let sBreathPerAP: INT16 = 0;
  let sBreathChange: INT16;
  let sRTBreathMod: INT16;
  let fAnimTypeFound: boolean = false;

  // Note to Andrew (or whomever else it may concern):

  // This function deals with BETWEEN TURN breath/energy gains. The basic concept is:
  //
  //	- look at LAST (current) animation of merc to see what he's now doing
  //	- look at how many AP remain unspent (indicating duration of time doing that anim)
  //
  //  figure out how much breath/energy (if any) he should recover. Obviously if a merc
  //	is STANDING BREATHING and hasn't spent any AP then it means he *stood around* for
  //  the entire duration of one turn (which, instead of spending energy, REGAINS energy)

  // COMMENTED OUT FOR NOW SINCE MOST OF THE ANIMATION DEFINES DO NOT MATCH

  // If we are not in turn-based combat...

  if (pSold.value.uiStatusFlags & SOLDIER_VEHICLE) {
    return;
  }

  if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    // ALRIGHT, GIVE A FULL AMOUNT BACK, UNLES MODIFIED BY WHAT ACTIONS WE WERE DOING
    sBreathPerAP = GetBreathPerAP(pSold, pSold.value.usAnimState);

    // adjust for carried weight
    sBreathPerAP = sBreathPerAP * 100 / BreathPointAdjustmentForCarriedWeight(pSold);

    // If this value is -ve, we have a gain, else we have a loos which we should not really do
    // We just want to limit this to no gain if we were doing stuff...
    sBreathChange = 3 * sBreathPerAP;

    // Adjust for on drugs
    HandleBPEffectDueToDrugs(pSold, addressof(sBreathChange));

    if (sBreathChange > 0) {
      sBreathChange = 0;
    } else {
      // We have a gain, now limit this depending on what we were doing...
      // OK for RT, look at how many tiles we have moved, our last move anim
      if (pSold.value.ubTilesMovedPerRTBreathUpdate > 0) {
        // How long have we done this for?
        // And what anim were we doing?
        sBreathPerAP = GetBreathPerAP(pSold, pSold.value.usLastMovementAnimPerRTBreathUpdate);

        sRTBreathMod = sBreathPerAP * pSold.value.ubTilesMovedPerRTBreathUpdate;

        // Deduct some if we were exerting ourselves
        // We add here because to gain breath, sBreathChange needs to be -ve
        if (sRTBreathMod > 0) {
          sBreathChange += sRTBreathMod;
        }

        if (sBreathChange < 0) {
          sBreathChange = 0;
        }
      }
    }

    // Divide by a number to adjust that in realtimer we do not want to recover as
    // as fast as the TB values do
    sBreathChange *= TB_BREATH_RECOVER_MODIFIER;

    // adjust breath only, don't touch action points!
    DeductPoints(pSold, 0, sBreathChange);

    // Reset value for RT breath update
    pSold.value.ubTilesMovedPerRTBreathUpdate = 0;
  } else {
    // if merc has any APs left unused this turn (that aren't carrying over)
    if (pSold.value.bActionPoints > MAX_AP_CARRIED) {
      sUnusedAPs = pSold.value.bActionPoints - MAX_AP_CARRIED;

      sBreathPerAP = GetBreathPerAP(pSold, pSold.value.usAnimState);

      if (sBreathPerAP < 0) {
        // can't gain any breath when we've just been gassed, OR
        // if standing in tear gas without a gas mask on
        if (pSold.value.uiStatusFlags & SOLDIER_GASSED) {
          return; // can't breathe here, so get no breath back!
        }
      }

      // adjust for carried weight
      sBreathPerAP = sBreathPerAP * 100 / BreathPointAdjustmentForCarriedWeight(pSold);

      sBreathChange = (AP_MAXIMUM - sUnusedAPs) * sBreathPerAP;
    } else {
      sBreathChange = 0;
    }
    // Adjust for on drugs
    HandleBPEffectDueToDrugs(pSold, addressof(sBreathChange));

    // adjust breath only, don't touch action points!
    DeductPoints(pSold, 0, sBreathChange);
  }
}

function GetBreathPerAP(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16): INT16 {
  let sBreathPerAP: INT16 = 0;
  let fAnimTypeFound: boolean = false;

  if (gAnimControl[usAnimState].uiFlags & ANIM_VARIABLE_EFFORT) {
    // Default effort
    sBreathPerAP = BP_PER_AP_MIN_EFFORT;

    // OK, check if we are in water and are waling/standing
    if (MercInWater(pSoldier)) {
      switch (usAnimState) {
        case Enum193.STANDING:

          sBreathPerAP = BP_PER_AP_LT_EFFORT;
          break;

        case Enum193.WALKING:

          sBreathPerAP = BP_PER_AP_MOD_EFFORT;
          break;
      }
    } else {
      switch (usAnimState) {
        case Enum193.STANDING:

          sBreathPerAP = BP_PER_AP_NO_EFFORT;
          break;

        case Enum193.WALKING:

          sBreathPerAP = BP_PER_AP_LT_EFFORT;
          break;
      }
    }
    fAnimTypeFound = true;
  }

  if (gAnimControl[usAnimState].uiFlags & ANIM_NO_EFFORT) {
    sBreathPerAP = BP_PER_AP_NO_EFFORT;
    fAnimTypeFound = true;
  }

  if (gAnimControl[usAnimState].uiFlags & ANIM_MIN_EFFORT) {
    sBreathPerAP = BP_PER_AP_MIN_EFFORT;
    fAnimTypeFound = true;
  }

  if (gAnimControl[usAnimState].uiFlags & ANIM_LIGHT_EFFORT) {
    sBreathPerAP = BP_PER_AP_LT_EFFORT;
    fAnimTypeFound = true;
  }

  if (gAnimControl[usAnimState].uiFlags & ANIM_MODERATE_EFFORT) {
    sBreathPerAP = BP_PER_AP_MOD_EFFORT;
    fAnimTypeFound = true;
  }

  if (!fAnimTypeFound) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Unknown end-of-turn breath anim: %s", gAnimControl[usAnimState].zAnimStr));
  }

  return sBreathPerAP;
}

// UINT8 CalcAPsToBurst( INT8 bBaseActionPoints, UINT16 usItem )
function CalcAPsToBurst(bBaseActionPoints: INT8, pObj: Pointer<OBJECTTYPE>): UINT8 {
  // base APs is what you'd get from CalcActionPoints();
  if (pObj.value.usItem == Enum225.G11) {
    return 1;
  } else {
    // NB round UP, so 21-25 APs pay full

    let bAttachPos: INT8;

    bAttachPos = FindAttachment(pObj, Enum225.SPRING_AND_BOLT_UPGRADE);
    if (bAttachPos != -1) {
      return (Math.max(3, (AP_BURST * bBaseActionPoints + (AP_MAXIMUM - 1)) / AP_MAXIMUM) * 100) / (100 + pObj.value.bAttachStatus[bAttachPos] / 5);
    } else {
      return Math.max(3, (AP_BURST * bBaseActionPoints + (AP_MAXIMUM - 1)) / AP_MAXIMUM);
    }
  }
}

function CalcTotalAPsToAttack(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubAddTurningCost: UINT8, bAimTime: INT8): UINT8 {
  let sAPCost: UINT16 = 0;
  let usItemNum: UINT16;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let sAdjustedGridNo: INT16;
  let uiItemClass: UINT32;

  // LOOK IN BUDDY'S HAND TO DETERMINE WHAT TO DO HERE
  usItemNum = pSoldier.value.inv[Enum261.HANDPOS].usItem;
  uiItemClass = Item[usItemNum].usItemClass;

  if (uiItemClass == IC_GUN || uiItemClass == IC_LAUNCHER || uiItemClass == IC_TENTACLES || uiItemClass == IC_THROWING_KNIFE) {
    sAPCost = MinAPsToAttack(pSoldier, sGridNo, ubAddTurningCost);

    if (pSoldier.value.bDoBurst) {
      sAPCost += CalcAPsToBurst(CalcActionPoints(pSoldier), addressof(pSoldier.value.inv[Enum261.HANDPOS]));
    } else {
      sAPCost += bAimTime;
    }
  }

  // ATE: HERE, need to calculate APs!
  if (uiItemClass & IC_EXPLOSV) {
    sAPCost = MinAPsToAttack(pSoldier, sGridNo, ubAddTurningCost);

    sAPCost = 5;
  }

  if (uiItemClass == IC_PUNCH || (uiItemClass == IC_BLADE && uiItemClass != IC_THROWING_KNIFE)) {
    // IF we are at this gridno, calc min APs but if not, calc cost to goto this lication
    if (pSoldier.value.sGridNo != sGridNo) {
      // OK, in order to avoid path calculations here all the time... save and check if it's changed!
      if (pSoldier.value.sWalkToAttackGridNo == sGridNo) {
        sAdjustedGridNo = sGridNo;
        sAPCost += (pSoldier.value.sWalkToAttackWalkToCost);
      } else {
        // INT32		cnt;
        // INT16		sSpot;
        let ubGuyThere: UINT8;
        let sGotLocation: INT16 = NOWHERE;
        let fGotAdjacent: boolean = false;
        let pTarget: Pointer<SOLDIERTYPE>;

        ubGuyThere = WhoIsThere2(sGridNo, pSoldier.value.bLevel);

        if (ubGuyThere != NOBODY) {
          pTarget = MercPtrs[ubGuyThere];

          if (pSoldier.value.ubBodyType == Enum194.BLOODCAT) {
            sGotLocation = FindNextToAdjacentGridEx(pSoldier, sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
            if (sGotLocation == -1) {
              sGotLocation = NOWHERE;
            }
          } else {
            sGotLocation = FindAdjacentPunchTarget(pSoldier, pTarget, addressof(sAdjustedGridNo), addressof(ubDirection));
          }
        }

        if (sGotLocation == NOWHERE && pSoldier.value.ubBodyType != Enum194.BLOODCAT) {
          sActionGridNo = FindAdjacentGridEx(pSoldier, sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);

          if (sActionGridNo == -1) {
            sGotLocation = NOWHERE;
          } else {
            sGotLocation = sActionGridNo;
          }
          fGotAdjacent = true;
        }

        if (sGotLocation != NOWHERE) {
          if (pSoldier.value.sGridNo == sGotLocation || !fGotAdjacent) {
            pSoldier.value.sWalkToAttackWalkToCost = 0;
          } else {
            // Save for next time...
            pSoldier.value.sWalkToAttackWalkToCost = PlotPath(pSoldier, sGotLocation, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

            if (pSoldier.value.sWalkToAttackWalkToCost == 0) {
              return 99;
            }
          }
        } else {
          return 0;
        }
        sAPCost += pSoldier.value.sWalkToAttackWalkToCost;
      }

      // Save old location!
      pSoldier.value.sWalkToAttackGridNo = sGridNo;

      // Add points to attack
      sAPCost += MinAPsToAttack(pSoldier, sAdjustedGridNo, ubAddTurningCost);
    } else {
      // Add points to attack
      // Use our gridno
      sAPCost += MinAPsToAttack(pSoldier, sGridNo, ubAddTurningCost);
    }

    // Add aim time...
    sAPCost += bAimTime;
  }

  return sAPCost;
}

function MinAPsToAttack(pSoldier: Pointer<SOLDIERTYPE>, sGridno: INT16, ubAddTurningCost: UINT8): UINT8 {
  let sAPCost: UINT16 = 0;
  let uiItemClass: UINT32;

  if (pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED) {
    let bAttachSlot: INT8;
    // look for an attached grenade launcher

    bAttachSlot = FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.UNDER_GLAUNCHER);
    if (bAttachSlot == NO_SLOT) {
      // default to hand
      // LOOK IN BUDDY'S HAND TO DETERMINE WHAT TO DO HERE
      uiItemClass = Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass;
    } else {
      uiItemClass = Item[Enum225.UNDER_GLAUNCHER].usItemClass;
    }
  } else {
    // LOOK IN BUDDY'S HAND TO DETERMINE WHAT TO DO HERE
    uiItemClass = Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass;
  }

  if (uiItemClass == IC_BLADE || uiItemClass == IC_GUN || uiItemClass == IC_LAUNCHER || uiItemClass == IC_TENTACLES || uiItemClass == IC_THROWING_KNIFE) {
    sAPCost = MinAPsToShootOrStab(pSoldier, sGridno, ubAddTurningCost);
  } else if (uiItemClass & (IC_GRENADE | IC_THROWN)) {
    sAPCost = MinAPsToThrow(pSoldier, sGridno, ubAddTurningCost);
  } else if (uiItemClass == IC_PUNCH) {
    sAPCost = MinAPsToPunch(pSoldier, sGridno, ubAddTurningCost);
  }

  return sAPCost;
}

function CalcAimSkill(pSoldier: Pointer<SOLDIERTYPE>, usWeapon: UINT16): INT8 {
  let bAimSkill: INT8;

  if (Item[usWeapon].usItemClass == IC_GUN || Item[usWeapon].usItemClass == IC_LAUNCHER) {
    // GUNS: modify aiming cost by shooter's MARKSMANSHIP
    bAimSkill = EffectiveMarksmanship(pSoldier);
  } else
  // for now use this for all other weapons
  // if ( Item[ usInHand ].usItemClass == IC_BLADE )
  {
    // KNIVES: modify aiming cost by avg of attacker's DEXTERITY & AGILITY
    bAimSkill = (EffectiveDexterity(pSoldier) + EffectiveAgility(pSoldier)) / 2;
    // return( 4 );
  }
  return bAimSkill;
}

function BaseAPsToShootOrStab(bAPs: INT8, bAimSkill: INT8, pObj: Pointer<OBJECTTYPE>): UINT8 {
  let sTop: INT16;
  let sBottom: INT16;
  let bAttachPos: INT8;

  // Calculate default top & bottom of the magic "aiming" formula!

  // get this man's maximum possible action points (ignoring carryovers)
  // the 2 times is here only to allow rounding off using integer math later
  sTop = 2 * bAPs; // CalcActionPoints( pSoldier );

  // Shots per turn rating is for max. aimSkill(100), drops down to 1/2 at = 0
  // DIVIDE BY 4 AT THE END HERE BECAUSE THE SHOTS PER TURN IS NOW QUADRUPLED!
  // NB need to define shots per turn for ALL Weapons then.
  sBottom = ((50 + (bAimSkill / 2)) * Weapon[pObj.value.usItem].ubShotsPer4Turns) / 4;

  bAttachPos = FindAttachment(pObj, Enum225.SPRING_AND_BOLT_UPGRADE);
  if (bAttachPos != -1) {
    sBottom = (sBottom * (100 + pObj.value.bAttachStatus[bAttachPos] / 5)) / 100;
  }

  // add minimum aiming time to the overall minimum AP_cost
  //     This here ROUNDS UP fractions of 0.5 or higher using integer math
  //     This works because 'top' is 2x what it really should be throughout
  return (((100 * sTop) / sBottom) + 1) / 2;
}

function GetAPChargeForShootOrStabWRTGunRaises(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubAddTurningCost: UINT8, pfChargeTurning: Pointer<boolean>, pfChargeRaise: Pointer<boolean>): void {
  let ubDirection: UINT8;
  let uiMercFlags: UINT32;
  let usTargID: UINT16;
  let fAddingTurningCost: boolean = false;
  let fAddingRaiseGunCost: boolean = false;

  if (sGridNo != NOWHERE) {
    // OK, get a direction and see if we need to turn...
    if (ubAddTurningCost) {
      // Given a gridno here, check if we are on a guy - if so - get his gridno
      if (FindSoldier(sGridNo, addressof(usTargID), addressof(uiMercFlags), FIND_SOLDIER_GRIDNO)) {
        sGridNo = MercPtrs[usTargID].value.sGridNo;
      }

      ubDirection = GetDirectionFromGridNo(sGridNo, pSoldier);

      // Is it the same as he's facing?
      if (ubDirection != pSoldier.value.bDirection) {
        fAddingTurningCost = true;
      }
    }
  } else {
    if (ubAddTurningCost) {
      // Assume we need to add cost!
      fAddingTurningCost = true;
    }
  }

  if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_THROWING_KNIFE) {
  } else {
    // Do we need to ready weapon?
    if (!(gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_FIREREADY | ANIM_FIRE))) {
      fAddingRaiseGunCost = true;
    }
  }

  (pfChargeTurning.value) = fAddingTurningCost;
  (pfChargeRaise.value) = fAddingRaiseGunCost;
}

function MinAPsToShootOrStab(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubAddTurningCost: UINT8): UINT8 {
  let uiMercFlags: UINT32;
  let usTargID: UINT16;
  let bFullAPs: INT8;
  let bAimSkill: INT8;
  let bAPCost: UINT8 = AP_MIN_AIM_ATTACK;
  let fAddingTurningCost: boolean = false;
  let fAddingRaiseGunCost: boolean = false;
  let usItem: UINT16;

  if (pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED) {
    usItem = Enum225.UNDER_GLAUNCHER;
  } else {
    usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;
  }

  GetAPChargeForShootOrStabWRTGunRaises(pSoldier, sGridNo, ubAddTurningCost, addressof(fAddingTurningCost), addressof(fAddingRaiseGunCost));

  if (Item[usItem].usItemClass == IC_THROWING_KNIFE) {
    // Do we need to stand up?
    bAPCost += GetAPsToChangeStance(pSoldier, ANIM_STAND);
  }

  // ATE: Look at stance...
  if (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND) {
    // Don't charge turning if gun-ready...
    if (fAddingRaiseGunCost) {
      fAddingTurningCost = false;
    }
  } else {
    // Just charge turning costs...
    if (fAddingTurningCost) {
      fAddingRaiseGunCost = false;
    }
  }

  if (AM_A_ROBOT(pSoldier)) {
    fAddingRaiseGunCost = false;
  }

  if (fAddingTurningCost) {
    if (Item[usItem].usItemClass == IC_THROWING_KNIFE) {
      bAPCost += 1;
    } else {
      bAPCost += GetAPsToLook(pSoldier);
    }
  }

  if (fAddingRaiseGunCost) {
    bAPCost += GetAPsToReadyWeapon(pSoldier, pSoldier.value.usAnimState);
    pSoldier.value.fDontChargeReadyAPs = false;
  }

  if (sGridNo != NOWHERE) {
    // Given a gridno here, check if we are on a guy - if so - get his gridno
    if (FindSoldier(sGridNo, addressof(usTargID), addressof(uiMercFlags), FIND_SOLDIER_GRIDNO)) {
      sGridNo = MercPtrs[usTargID].value.sGridNo;
    }
  }

  // if attacking a new target (or if the specific target is uncertain)
  if ((sGridNo != pSoldier.value.sLastTarget) && usItem != Enum225.ROCKET_LAUNCHER) {
    bAPCost += AP_CHANGE_TARGET;
  }

  bFullAPs = CalcActionPoints(pSoldier);
  // aim skill is the same whether we are using 1 or 2 guns
  bAimSkill = CalcAimSkill(pSoldier, usItem);

  if (pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED) {
    let bAttachSlot: INT8;
    let GrenadeLauncher: OBJECTTYPE;

    // look for an attached grenade launcher
    bAttachSlot = FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.UNDER_GLAUNCHER);

    // create temporary grenade launcher and use that
    if (bAttachSlot != NO_SLOT) {
      CreateItem(Enum225.UNDER_GLAUNCHER, pSoldier.value.inv[Enum261.HANDPOS].bAttachStatus[bAttachSlot], addressof(GrenadeLauncher));
    } else {
      // fake it, use a 100 status...
      CreateItem(Enum225.UNDER_GLAUNCHER, 100, addressof(GrenadeLauncher));
    }

    bAPCost += BaseAPsToShootOrStab(bFullAPs, bAimSkill, addressof(GrenadeLauncher));
  } else if (IsValidSecondHandShot(pSoldier)) {
    // charge the maximum of the two
    bAPCost += Math.max(BaseAPsToShootOrStab(bFullAPs, bAimSkill, addressof(pSoldier.value.inv[Enum261.HANDPOS])), BaseAPsToShootOrStab(bFullAPs, bAimSkill, addressof(pSoldier.value.inv[Enum261.SECONDHANDPOS])));
  } else {
    bAPCost += BaseAPsToShootOrStab(bFullAPs, bAimSkill, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
  }

  // the minimum AP cost of ANY shot can NEVER be more than merc's maximum APs!
  if (bAPCost > bFullAPs)
    bAPCost = bFullAPs;

  // this SHOULD be impossible, but nevertheless...
  if (bAPCost < 1)
    bAPCost = 1;

  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.ROCKET_LAUNCHER) {
    bAPCost += GetAPsToChangeStance(pSoldier, ANIM_STAND);
  }

  return bAPCost;
}

function MinAPsToPunch(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubAddTurningCost: UINT8): UINT8 {
  let bAPCost: UINT8 = 0;
  let usTargID: UINT16;
  let ubDirection: UINT8;

  //  bAimSkill = ( pSoldier->bDexterity + pSoldier->bAgility) / 2;
  if (sGridNo != NOWHERE) {
    usTargID = WhoIsThere2(sGridNo, pSoldier.value.bTargetLevel);

    // Given a gridno here, check if we are on a guy - if so - get his gridno
    if (usTargID != NOBODY) {
      sGridNo = MercPtrs[usTargID].value.sGridNo;

      // Check if target is prone, if so, calc cost...
      if (gAnimControl[MercPtrs[usTargID].value.usAnimState].ubEndHeight == ANIM_PRONE) {
        bAPCost += GetAPsToChangeStance(pSoldier, ANIM_CROUCH);
      } else {
        if (pSoldier.value.sGridNo == sGridNo) {
          bAPCost += GetAPsToChangeStance(pSoldier, ANIM_STAND);
        }
      }
    }

    if (ubAddTurningCost) {
      if (pSoldier.value.sGridNo == sGridNo) {
        // ATE: Use standing turn cost....
        ubDirection = GetDirectionFromGridNo(sGridNo, pSoldier);

        // Is it the same as he's facing?
        if (ubDirection != pSoldier.value.bDirection) {
          bAPCost += AP_LOOK_STANDING;
        }
      }
    }
  }

  bAPCost += 4;

  return bAPCost;
}

function MinPtsToMove(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  // look around all 8 directions and return lowest terrain cost
  let cnt: INT32;
  let sLowest: INT16 = 127;
  let sGridno: INT16;
  let sCost: INT16;

  if (TANK(pSoldier)) {
    return sLowest;
  }

  for (cnt = 0; cnt <= 7; cnt++) {
    sGridno = NewGridNo(pSoldier.value.sGridNo, DirectionInc(cnt));
    if (sGridno != pSoldier.value.sGridNo) {
      if ((sCost = ActionPointCost(pSoldier, sGridno, cnt, pSoldier.value.usUIMovementMode)) < sLowest) {
        sLowest = sCost;
      }
    }
  }
  return sLowest;
}

function PtsToMoveDirection(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8): INT8 {
  let sGridno: INT16;
  let sCost: INT16;
  let bOverTerrainType: INT8;
  let usMoveModeToUse: UINT16;

  sGridno = NewGridNo(pSoldier.value.sGridNo, DirectionInc(bDirection));

  usMoveModeToUse = pSoldier.value.usUIMovementMode;

  // ATE: Check if the new place is watter and we were tying to run....
  bOverTerrainType = GetTerrainType(sGridno);

  if (bOverTerrainType == Enum315.MED_WATER || bOverTerrainType == Enum315.DEEP_WATER || bOverTerrainType == Enum315.LOW_WATER) {
    usMoveModeToUse = Enum193.WALKING;
  }

  sCost = ActionPointCost(pSoldier, sGridno, bDirection, usMoveModeToUse);

  if (gubWorldMovementCosts[sGridno][bDirection][pSoldier.value.bLevel] != TRAVELCOST_FENCE) {
    if (usMoveModeToUse == Enum193.RUNNING && pSoldier.value.usAnimState != Enum193.RUNNING) {
      sCost += AP_START_RUN_COST;
    }
  }

  return sCost;
}

function MinAPsToStartMovement(pSoldier: Pointer<SOLDIERTYPE>, usMovementMode: UINT16): INT8 {
  let bAPs: INT8 = 0;

  switch (usMovementMode) {
    case Enum193.RUNNING:
    case Enum193.WALKING:
      if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_PRONE) {
        bAPs += AP_CROUCH + AP_PRONE;
      } else if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_CROUCH) {
        bAPs += AP_CROUCH;
      }
      break;
    case Enum193.SWATTING:
      if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_PRONE) {
        bAPs += AP_PRONE;
      } else if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
        bAPs += AP_CROUCH;
      }
      break;
    case Enum193.CRAWLING:
      if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
        bAPs += AP_CROUCH + AP_PRONE;
      } else if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_CROUCH) {
        bAPs += AP_CROUCH;
      }
      break;
    default:
      break;
  }

  if (usMovementMode == Enum193.RUNNING && pSoldier.value.usAnimState != Enum193.RUNNING) {
    bAPs += AP_START_RUN_COST;
  }
  return bAPs;
}

function EnoughAmmo(pSoldier: Pointer<SOLDIERTYPE>, fDisplay: boolean, bInvPos: INT8): boolean {
  if (pSoldier.value.inv[bInvPos].usItem != NOTHING) {
    if (pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED) {
      return true;
    } else {
      if (pSoldier.value.inv[bInvPos].usItem == Enum225.ROCKET_LAUNCHER) {
        // hack... they turn empty afterwards anyways
        return true;
      }

      if (Item[pSoldier.value.inv[bInvPos].usItem].usItemClass == IC_LAUNCHER || pSoldier.value.inv[bInvPos].usItem == Enum225.TANK_CANNON) {
        if (FindAttachmentByClass(addressof(pSoldier.value.inv[bInvPos]), IC_GRENADE) != ITEM_NOT_FOUND) {
          return true;
        }

        // ATE: Did an else if here...
        if (FindAttachmentByClass(addressof(pSoldier.value.inv[bInvPos]), IC_BOMB) != ITEM_NOT_FOUND) {
          return true;
        }

        if (fDisplay) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_OUT_OF_AMMO);
        }

        return false;
      } else if (Item[pSoldier.value.inv[bInvPos].usItem].usItemClass == IC_GUN) {
        if (pSoldier.value.inv[bInvPos].ubGunShotsLeft == 0) {
          if (fDisplay) {
            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_OUT_OF_AMMO);
          }
          return false;
        }
      }
    }

    return true;
  }

  return false;
}

function DeductAmmo(pSoldier: Pointer<SOLDIERTYPE>, bInvPos: INT8): void {
  let pObj: Pointer<OBJECTTYPE>;

  // tanks never run out of MG ammo!
  // unlimited cannon ammo is handled in AI
  if (TANK(pSoldier) && pSoldier.value.inv[bInvPos].usItem != Enum225.TANK_CANNON) {
    return;
  }

  pObj = addressof(pSoldier.value.inv[bInvPos]);
  if (pObj.value.usItem != NOTHING) {
    if (pObj.value.usItem == Enum225.TANK_CANNON) {
    } else if (Item[pObj.value.usItem].usItemClass == IC_GUN && pObj.value.usItem != Enum225.TANK_CANNON) {
      if (pSoldier.value.usAttackingWeapon == pObj.value.usItem) {
        // OK, let's see, don't overrun...
        if (pObj.value.ubGunShotsLeft != 0) {
          pObj.value.ubGunShotsLeft--;
        }
      } else {
        // firing an attachment?
      }
    } else if (Item[pObj.value.usItem].usItemClass == IC_LAUNCHER || pObj.value.usItem == Enum225.TANK_CANNON) {
      let bAttachPos: INT8;

      bAttachPos = FindAttachmentByClass(pObj, IC_GRENADE);
      if (bAttachPos == ITEM_NOT_FOUND) {
        bAttachPos = FindAttachmentByClass(pObj, IC_BOMB);
      }

      if (bAttachPos != ITEM_NOT_FOUND) {
        RemoveAttachment(pObj, bAttachPos, null);
      }
    }

    // Dirty Bars
    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL1);
  }
}

function GetAPsToPickupItem(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16): UINT16 {
  let pItemPool: Pointer<ITEM_POOL>;
  let sAPCost: UINT16 = 0;
  let sActionGridNo: INT16;

  // Check if we are over an item pool
  if (GetItemPool(usMapPos, addressof(pItemPool), pSoldier.value.bLevel)) {
    // If we are in the same tile, just return pickup cost
    sActionGridNo = AdjustGridNoForItemPlacement(pSoldier, usMapPos);

    if (pSoldier.value.sGridNo != sActionGridNo) {
      sAPCost = PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

      // If point cost is zero, return 0
      if (sAPCost != 0) {
        // ADD APS TO PICKUP
        sAPCost += AP_PICKUP_ITEM;
      }
    } else {
      sAPCost += AP_PICKUP_ITEM;
    }
  }

  return sAPCost;
}

function GetAPsToGiveItem(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16): UINT16 {
  let sAPCost: UINT16 = 0;

  sAPCost = PlotPath(pSoldier, usMapPos, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

  // If point cost is zero, return 0
  if (sAPCost != 0 || pSoldier.value.sGridNo == usMapPos) {
    // ADD APS TO PICKUP
    sAPCost += AP_GIVE_ITEM;
  }

  return sAPCost;
}

function GetAPsToReloadGunWithAmmo(pGun: Pointer<OBJECTTYPE>, pAmmo: Pointer<OBJECTTYPE>): INT8 {
  if (Item[pGun.value.usItem].usItemClass == IC_LAUNCHER) {
    // always standard AP cost
    return AP_RELOAD_GUN;
  }
  if (Weapon[pGun.value.usItem].ubMagSize == Magazine[Item[pAmmo.value.usItem].ubClassIndex].ubMagSize) {
    // normal situation
    return AP_RELOAD_GUN;
  } else {
    // trying to reload with wrong size of magazine
    return AP_RELOAD_GUN + AP_RELOAD_GUN;
  }
}

function GetAPsToAutoReload(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let pObj: Pointer<OBJECTTYPE>;
  let bSlot: INT8;
  let bSlot2: INT8;
  let bExcludeSlot: INT8;
  let bAPCost: INT8 = 0;
  let bAPCost2: INT8 = 0;
  ;

  CHECKF(pSoldier);
  pObj = addressof(pSoldier.value.inv[Enum261.HANDPOS]);

  if (Item[pObj.value.usItem].usItemClass == IC_GUN || Item[pObj.value.usItem].usItemClass == IC_LAUNCHER) {
    bSlot = FindAmmoToReload(pSoldier, Enum261.HANDPOS, NO_SLOT);
    if (bSlot != NO_SLOT) {
      // we would reload using this ammo!
      bAPCost += GetAPsToReloadGunWithAmmo(pObj, addressof(pSoldier.value.inv[bSlot]));
    }

    if (IsValidSecondHandShotForReloadingPurposes(pSoldier)) {
      pObj = addressof(pSoldier.value.inv[Enum261.SECONDHANDPOS]);
      bExcludeSlot = NO_SLOT;
      bSlot2 = NO_SLOT;

      // if the ammo for the first gun is the same we have to do special checks
      if (ValidAmmoType(pObj.value.usItem, pSoldier.value.inv[bSlot].usItem)) {
        if (pSoldier.value.inv[bSlot].ubNumberOfObjects == 1) {
          // we must not consider this slot for reloading!
          bExcludeSlot = bSlot;
        } else {
          // we can reload the 2nd gun from the same pocket!
          bSlot2 = bSlot;
        }
      }

      if (bSlot2 == NO_SLOT) {
        bSlot2 = FindAmmoToReload(pSoldier, Enum261.SECONDHANDPOS, bExcludeSlot);
      }

      if (bSlot2 != NO_SLOT) {
        // we would reload using this ammo!
        bAPCost2 = GetAPsToReloadGunWithAmmo(pObj, addressof(pSoldier.value.inv[bSlot2]));
        if (EnoughPoints(pSoldier, (bAPCost + bAPCost2), 0, false)) {
          // we can afford to reload both guns; otherwise display just for 1 gun
          bAPCost += bAPCost2;
        }
      }
    }
  }

  return bAPCost;
}

function GetAPsToReloadRobot(pSoldier: Pointer<SOLDIERTYPE>, pRobot: Pointer<SOLDIERTYPE>): UINT16 {
  let sAPCost: UINT16 = 0;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let sAdjustedGridNo: INT16;

  sActionGridNo = FindAdjacentGridEx(pSoldier, pRobot.value.sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);

  sAPCost = PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

  // If point cost is zero, return 0
  if (sAPCost != 0 || sActionGridNo == pSoldier.value.sGridNo) {
    // ADD APS TO RELOAD
    sAPCost += 4;
  }

  return sAPCost;
}

function GetAPsToChangeStance(pSoldier: Pointer<SOLDIERTYPE>, bDesiredHeight: INT8): UINT16 {
  let sAPCost: UINT16 = 0;
  let bCurrentHeight: INT8;

  bCurrentHeight = gAnimControl[pSoldier.value.usAnimState].ubEndHeight;

  if (bCurrentHeight == bDesiredHeight) {
    sAPCost = 0;
  }

  if (bCurrentHeight == ANIM_STAND && bDesiredHeight == ANIM_PRONE) {
    sAPCost = AP_CROUCH + AP_PRONE;
  }
  if (bCurrentHeight == ANIM_STAND && bDesiredHeight == ANIM_CROUCH) {
    sAPCost = AP_CROUCH;
  }
  if (bCurrentHeight == ANIM_CROUCH && bDesiredHeight == ANIM_PRONE) {
    sAPCost = AP_PRONE;
  }
  if (bCurrentHeight == ANIM_CROUCH && bDesiredHeight == ANIM_STAND) {
    sAPCost = AP_CROUCH;
  }
  if (bCurrentHeight == ANIM_PRONE && bDesiredHeight == ANIM_STAND) {
    sAPCost = AP_PRONE + AP_CROUCH;
  }
  if (bCurrentHeight == ANIM_PRONE && bDesiredHeight == ANIM_CROUCH) {
    sAPCost = AP_PRONE;
  }

  return sAPCost;
}

function GetBPsToChangeStance(pSoldier: Pointer<SOLDIERTYPE>, bDesiredHeight: INT8): UINT16 {
  let sBPCost: UINT16 = 0;
  let bCurrentHeight: INT8;

  bCurrentHeight = gAnimControl[pSoldier.value.usAnimState].ubEndHeight;

  if (bCurrentHeight == bDesiredHeight) {
    sBPCost = 0;
  }

  if (bCurrentHeight == ANIM_STAND && bDesiredHeight == ANIM_PRONE) {
    sBPCost = BP_CROUCH + BP_PRONE;
  }
  if (bCurrentHeight == ANIM_STAND && bDesiredHeight == ANIM_CROUCH) {
    sBPCost = BP_CROUCH;
  }
  if (bCurrentHeight == ANIM_CROUCH && bDesiredHeight == ANIM_PRONE) {
    sBPCost = BP_PRONE;
  }
  if (bCurrentHeight == ANIM_CROUCH && bDesiredHeight == ANIM_STAND) {
    sBPCost = BP_CROUCH;
  }
  if (bCurrentHeight == ANIM_PRONE && bDesiredHeight == ANIM_STAND) {
    sBPCost = BP_PRONE + BP_CROUCH;
  }
  if (bCurrentHeight == ANIM_PRONE && bDesiredHeight == ANIM_CROUCH) {
    sBPCost = BP_PRONE;
  }

  return sBPCost;
}

function GetAPsToLook(pSoldier: Pointer<SOLDIERTYPE>): UINT16 {
  // Set # of APs
  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    // Now change to appropriate animation
    case ANIM_STAND:
      return AP_LOOK_STANDING;
      break;

    case ANIM_CROUCH:
      return AP_LOOK_CROUCHED;
      break;

    case ANIM_PRONE:
      // AP_PRONE is the AP cost to go to or from the prone stance.  To turn while prone, your merc has to get up to
      // crouched, turn, and then go back down.  Hence you go up (AP_PRONE), turn (AP_LOOK_PRONE) and down (AP_PRONE).
      return AP_LOOK_PRONE + AP_PRONE + AP_PRONE;
      break;

    // no other values should be possible
    default:
      Assert(false);
      return 0;
      break;
  }
}

function CheckForMercContMove(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  let sAPCost: INT16;
  let sGridNo: INT16;

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    return false;
  }

  if (gpItemPointer != null) {
    return false;
  }

  if (pSoldier.value.bLife >= OKLIFE) {
    if (pSoldier.value.sGridNo != pSoldier.value.sFinalDestination || pSoldier.value.bGoodContPath) {
      // OK< check if we are the selected guy!
      if (pSoldier.value.ubID == gusSelectedSoldier) {
        if (SoldierOnScreen(pSoldier.value.ubID)) {
          sGridNo = pSoldier.value.sFinalDestination;

          if (pSoldier.value.bGoodContPath) {
            sGridNo = pSoldier.value.sContPathLocation;
          }

          // Do a check if we can afford move here!

          // get a path to dest...
          if (FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, 0)) {
            sAPCost = PtsToMoveDirection(pSoldier, guiPathingData[0]);

            if (EnoughPoints(pSoldier, sAPCost, 0, false)) {
              return true;
            }
          } else {
            return false;
          }
        }
      }
    }
  }
  return false;
}

function GetAPsToReadyWeapon(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16): INT16 {
  let usItem: UINT16;

  // If this is a dwel pistol anim
  // ATE: What was I thinking, hooking into animations like this....
  // if ( usAnimState == READY_DUAL_STAND || usAnimState == READY_DUAL_CROUCH )
  //{
  // return( AP_READY_DUAL );
  //}
  if (IsValidSecondHandShot(pSoldier)) {
    return AP_READY_DUAL;
  }

  // OK, now check type of weapon
  usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  if (usItem == NOTHING) {
    return 0;
  } else {
    // CHECK FOR RIFLE
    if (Item[usItem].usItemClass == IC_GUN) {
      return Weapon[usItem].ubReadyTime;
    }
  }

  return 0;
}

function GetAPsToClimbRoof(pSoldier: Pointer<SOLDIERTYPE>, fClimbDown: boolean): INT8 {
  if (!fClimbDown) {
    // OK, add aps to goto stand stance...
    return (AP_CLIMBROOF + GetAPsToChangeStance(pSoldier, ANIM_STAND));
  } else {
    // Add aps to goto crouch
    return (AP_CLIMBOFFROOF + GetAPsToChangeStance(pSoldier, ANIM_CROUCH));
  }
}

function GetBPsToClimbRoof(pSoldier: Pointer<SOLDIERTYPE>, fClimbDown: boolean): INT16 {
  if (!fClimbDown) {
    return BP_CLIMBROOF;
  } else {
    return BP_CLIMBOFFROOF;
  }
}

function GetAPsToCutFence(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  // OK, it's normally just cost, but add some if different stance...
  return GetAPsToChangeStance(pSoldier, ANIM_CROUCH) + AP_USEWIRECUTTERS;
}

function GetAPsToBeginFirstAid(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  // OK, it's normally just cost, but add some if different stance...
  return GetAPsToChangeStance(pSoldier, ANIM_CROUCH) + AP_START_FIRST_AID;
}

function GetAPsToBeginRepair(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  // OK, it's normally just cost, but add some if different stance...
  return GetAPsToChangeStance(pSoldier, ANIM_CROUCH) + AP_START_REPAIR;
}

function GetAPsToRefuelVehicle(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  // OK, it's normally just cost, but add some if different stance...
  return GetAPsToChangeStance(pSoldier, ANIM_CROUCH) + AP_REFUEL_VEHICLE;
}

const TOSSES_PER_10TURNS = 18; // max # of grenades tossable in 10 turns
const AP_MIN_AIM_ATTACK = 0; // minimum permitted extra aiming
const AP_MAX_AIM_ATTACK = 4; // maximum permitted extra aiming

function MinAPsToThrow(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubAddTurningCost: UINT8): INT16 {
  let iTop: INT32;
  let iBottom: INT32;
  let iFullAPs: INT32;
  let iAPCost: INT32 = AP_MIN_AIM_ATTACK;
  let usInHand: UINT16;
  let usTargID: UINT16;
  let uiMercFlags: UINT32;
  let ubDirection: UINT8;

  // make sure the guy's actually got a throwable item in his hand!
  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  if ((!Item[usInHand].usItemClass & IC_GRENADE)) {
    return 0;
  }

  if (sGridNo != NOWHERE) {
    // Given a gridno here, check if we are on a guy - if so - get his gridno
    if (FindSoldier(sGridNo, addressof(usTargID), addressof(uiMercFlags), FIND_SOLDIER_GRIDNO)) {
      sGridNo = MercPtrs[usTargID].value.sGridNo;
    }

    // OK, get a direction and see if we need to turn...
    if (ubAddTurningCost) {
      ubDirection = GetDirectionFromGridNo(sGridNo, pSoldier);

      // Is it the same as he's facing?
      if (ubDirection != pSoldier.value.bDirection) {
        // iAPCost += GetAPsToLook( pSoldier );
      }
    }
  } else {
    // Assume we need to add cost!
    // iAPCost += GetAPsToLook( pSoldier );
  }

  // if attacking a new target (or if the specific target is uncertain)
  if ((sGridNo != pSoldier.value.sLastTarget)) {
    iAPCost += AP_CHANGE_TARGET;
  }

  iAPCost += GetAPsToChangeStance(pSoldier, ANIM_STAND);

  // Calculate default top & bottom of the magic "aiming" formula)

  // get this man's maximum possible action points (ignoring carryovers)
  iFullAPs = CalcActionPoints(pSoldier);

  // the 2 times is here only to around rounding off using integer math later
  iTop = 2 * iFullAPs;

  // if it's anything but a mortar
  //	if ( usInHand != MORTAR)
  // tosses per turn is for max dexterity, drops down to 1/2 at dexterity = 0
  // bottom = (TOSSES_PER_10TURNS * (50 + (ptr->dexterity / 2)) / 10);
  // else
  iBottom = (TOSSES_PER_10TURNS * (50 + (pSoldier.value.bDexterity / 2)) / 10);

  // add minimum aiming time to the overall minimum AP_cost
  //     This here ROUNDS UP fractions of 0.5 or higher using integer math
  //     This works because 'top' is 2x what it really should be throughout
  iAPCost += (((100 * iTop) / iBottom) + 1) / 2;

  // the minimum AP cost of ANY throw can NEVER be more than merc has APs!
  if (iAPCost > iFullAPs)
    iAPCost = iFullAPs;

  // this SHOULD be impossible, but nevertheless...
  if (iAPCost < 1)
    iAPCost = 1;

  return iAPCost;
}

function GetAPsToDropBomb(pSoldier: Pointer<SOLDIERTYPE>): UINT16 {
  return AP_DROP_BOMB;
}

function GetTotalAPsToDropBomb(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): UINT16 {
  let sAPs: INT16 = 0;

  sAPs = PlotPath(pSoldier, sGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

  if (sAPs > 0) {
    sAPs += AP_DROP_BOMB;
  }

  return sAPs;
}

function GetAPsToUseRemote(pSoldier: Pointer<SOLDIERTYPE>): UINT16 {
  return AP_USE_REMOTE;
}

function GetAPsToStealItem(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: INT16): INT8 {
  let sAPCost: UINT16 = 0;

  sAPCost = PlotPath(pSoldier, usMapPos, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

  // ADD APS TO PICKUP
  sAPCost += AP_STEAL_ITEM;

  // CJC August 13 2002: added cost to stand into equation
  if (!(PTR_STANDING())) {
    sAPCost += GetAPsToChangeStance(pSoldier, ANIM_STAND);
  }

  return sAPCost;
}

function GetBPsToStealItem(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  return BP_STEAL_ITEM;
}

function GetAPsToUseJar(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: INT16): INT8 {
  let sAPCost: UINT16 = 0;

  sAPCost = PlotPath(pSoldier, usMapPos, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

  // If point cost is zero, return 0
  if (sAPCost != 0) {
    // ADD APS TO PICKUP
    sAPCost += AP_TAKE_BLOOD;
  }

  return sAPCost;
}

function GetAPsToUseCan(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: INT16): INT8 {
  let sAPCost: UINT16 = 0;

  sAPCost = PlotPath(pSoldier, usMapPos, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

  // If point cost is zero, return 0
  if (sAPCost != 0) {
    // ADD APS TO PICKUP
    sAPCost += AP_ATTACH_CAN;
  }

  return sAPCost;
}

function GetAPsToJumpOver(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  return GetAPsToChangeStance(pSoldier, ANIM_STAND) + AP_JUMP_OVER;
}
