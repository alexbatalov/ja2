namespace ja2 {

// give pSoldier usNumChances to improve ubStat.  If it's from training, it doesn't count towards experience level gain
export function StatChange(pSoldier: Pointer<SOLDIERTYPE>, ubStat: UINT8, usNumChances: UINT16, ubReason: UINT8): void {
  Assert(pSoldier != null);
  Assert(pSoldier.value.bActive);

  // ignore non-player soldiers
  if (!PTR_OURTEAM())
    return;

  // ignore anything without a profile
  if (pSoldier.value.ubProfile == NO_PROFILE)
    return;

  // ignore vehicles and robots
  if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.value.uiStatusFlags & SOLDIER_ROBOT))
    return;

  if (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
    ScreenMsg(FONT_ORANGE, MSG_BETAVERSION, "ERROR: StatChange: %s improving stats while POW! ubStat %d", pSoldier.value.name, ubStat);
    return;
  }

  // no points earned while somebody is unconscious (for assist XPs, and such)
  if (pSoldier.value.bLife < CONSCIOUSNESS)
    return;

  ProcessStatChange(addressof(gMercProfiles[pSoldier.value.ubProfile]), ubStat, usNumChances, ubReason);

  // Update stats....right away... ATE
  UpdateStats(pSoldier);
}

// this is the equivalent of StatChange(), but for use with mercs not currently on player's team
// give pProfile usNumChances to improve ubStat.  If it's from training, it doesn't count towards experience level gain
function ProfileStatChange(pProfile: Pointer<MERCPROFILESTRUCT>, ubStat: UINT8, usNumChances: UINT16, ubReason: UINT8): void {
  // dead guys don't do nuthin' !
  if (pProfile.value.bMercStatus == MERC_IS_DEAD)
    return;

  if (pProfile.value.bLife < OKLIFE)
    return;

  ProcessStatChange(pProfile, ubStat, usNumChances, ubReason);

  // Update stats....right away... ATE
  ProfileUpdateStats(pProfile);
}

function ProcessStatChange(pProfile: Pointer<MERCPROFILESTRUCT>, ubStat: UINT8, usNumChances: UINT16, ubReason: UINT8): void {
  let uiCnt: UINT32;
  let uiEffLevel: UINT32;
  let sSubPointChange: INT16 = 0;
  let usChance: UINT16 = 0;
  let usSubpointsPerPoint: UINT16;
  let usSubpointsPerLevel: UINT16;
  let bCurrentRating: INT8;
  let psStatGainPtr: Pointer<UINT16>;
  let fAffectedByWisdom: boolean = true;

  Assert(pProfile != null);

  if (pProfile.value.bEvolution == Enum274.NO_EVOLUTION)
    return; // No change possible, quit right away

  // if this is a Reverse-Evolving merc who attempting to train
  if ((ubReason == FROM_TRAINING) && (pProfile.value.bEvolution == Enum274.DEVOLVE))
    return; // he doesn't get any benefit, but isn't penalized either

  if (usNumChances == 0)
    return;

  usSubpointsPerPoint = SubpointsPerPoint(ubStat, pProfile.value.bExpLevel);
  usSubpointsPerLevel = SubpointsPerPoint(EXPERAMT, pProfile.value.bExpLevel);

  switch (ubStat) {
    case HEALTHAMT:
      bCurrentRating = pProfile.value.bLifeMax;
      psStatGainPtr = addressof(pProfile.value.sLifeGain);
      // NB physical stat checks not affected by wisdom, unless training is going on
      fAffectedByWisdom = false;
      break;

    case AGILAMT:
      bCurrentRating = pProfile.value.bAgility;
      psStatGainPtr = addressof(pProfile.value.sAgilityGain);
      fAffectedByWisdom = false;
      break;

    case DEXTAMT:
      bCurrentRating = pProfile.value.bDexterity;
      psStatGainPtr = addressof(pProfile.value.sDexterityGain);
      fAffectedByWisdom = false;
      break;

    case WISDOMAMT:
      bCurrentRating = pProfile.value.bWisdom;
      psStatGainPtr = addressof(pProfile.value.sWisdomGain);
      break;

    case MEDICALAMT:
      bCurrentRating = pProfile.value.bMedical;
      psStatGainPtr = addressof(pProfile.value.sMedicalGain);
      break;

    case EXPLODEAMT:
      bCurrentRating = pProfile.value.bExplosive;
      psStatGainPtr = addressof(pProfile.value.sExplosivesGain);
      break;

    case MECHANAMT:
      bCurrentRating = pProfile.value.bMechanical;
      psStatGainPtr = addressof(pProfile.value.sMechanicGain);
      break;

    case MARKAMT:
      bCurrentRating = pProfile.value.bMarksmanship;
      psStatGainPtr = addressof(pProfile.value.sMarksmanshipGain);
      break;

    case EXPERAMT:
      bCurrentRating = pProfile.value.bExpLevel;
      psStatGainPtr = addressof(pProfile.value.sExpLevelGain);
      break;

    case STRAMT:
      bCurrentRating = pProfile.value.bStrength;
      psStatGainPtr = addressof(pProfile.value.sStrengthGain);
      fAffectedByWisdom = false;
      break;

    case LDRAMT:
      bCurrentRating = pProfile.value.bLeadership;
      psStatGainPtr = addressof(pProfile.value.sLeadershipGain);
      break;

    default:
      // BETA message
      ScreenMsg(FONT_ORANGE, MSG_BETAVERSION, "ERROR: ProcessStatChange: Rcvd unknown ubStat %d", ubStat);
      return;
  }

  if (ubReason == FROM_TRAINING) {
    // training always affected by wisdom
    fAffectedByWisdom = true;
  }

  // stats/skills of 0 can NEVER be improved!
  if (bCurrentRating <= 0) {
    return;
  }

  // loop once for each chance to improve
  for (uiCnt = 0; uiCnt < usNumChances; uiCnt++) {
    if (pProfile.value.bEvolution == Enum274.NORMAL_EVOLUTION) // Evolves!
    {
      // if this is improving from a failure, and a successful roll would give us enough to go up a point
      if ((ubReason == FROM_FAILURE) && ((psStatGainPtr.value + 1) >= usSubpointsPerPoint)) {
        // can't improve any more from this statchange, because Ian don't want failures causin increases!
        break;
      }

      if (ubStat != EXPERAMT) {
        // NON-experience level changes, actual usChance depends on bCurrentRating
        // Base usChance is '100 - bCurrentRating'
        usChance = 100 - (bCurrentRating + (psStatGainPtr.value / usSubpointsPerPoint));

        // prevent training beyond the training cap
        if ((ubReason == FROM_TRAINING) && (bCurrentRating + (psStatGainPtr.value / usSubpointsPerPoint) >= TRAINING_RATING_CAP)) {
          usChance = 0;
        }
      } else {
        // Experience level changes, actual usChance depends on level
        // Base usChance is '100 - (10 * current level)'
        usChance = 100 - 10 * (bCurrentRating + (psStatGainPtr.value / usSubpointsPerPoint));
      }

      // if there IS a usChance, adjust it for high or low wisdom (50 is avg)
      if (usChance > 0 && fAffectedByWisdom) {
        usChance += (usChance * (pProfile.value.bWisdom + (pProfile.value.sWisdomGain / SubpointsPerPoint(WISDOMAMT, pProfile.value.bExpLevel)) - 50)) / 100;
      }

      /*
            // if the stat is Marksmanship, and the guy is a hopeless shot
            if ((ubStat == MARKAMT) && (pProfile->bSpecialTrait == HOPELESS_SHOT))
                              {
                                      usChance /= 5;		// MUCH slower to improve, divide usChance by 5
                              }
      */

      // maximum possible usChance is 99%
      if (usChance > 99) {
        usChance = 99;
      }

      if (PreRandom(100) < usChance) {
        (psStatGainPtr.value)++;
        sSubPointChange++;

        // as long as we're not dealing with exp_level changes (already added above!)
        // and it's not from training, and the exp level isn't max'ed out already
        if ((ubStat != EXPERAMT) && (ubReason != FROM_TRAINING)) {
          uiEffLevel = pProfile.value.bExpLevel + (pProfile.value.sExpLevelGain / usSubpointsPerLevel);

          // if level is not at maximum
          if (uiEffLevel < MAXEXPLEVEL) {
            // if this is NOT improving from a failure, OR it would NOT give us enough to go up a level
            if ((ubReason != FROM_FAILURE) || ((pProfile.value.sExpLevelGain + 1) < usSubpointsPerLevel)) {
              // all other stat changes count towards experience level changes (1 for 1 basis)
              pProfile.value.sExpLevelGain++;
            }
          }
        }
      }
    } else // Regresses!
    {
      // regression can happen from both failures and successes (but not training, checked above)

      if (ubStat != EXPERAMT) {
        // NON-experience level changes, actual usChance depends on bCurrentRating
        switch (ubStat) {
          case HEALTHAMT:
          case AGILAMT:
          case DEXTAMT:
          case WISDOMAMT:
          case STRAMT:
            // Base usChance is 'bCurrentRating - 1', since these must remain at 1-100
            usChance = bCurrentRating + (psStatGainPtr.value / usSubpointsPerPoint) - 1;
            break;

          case MEDICALAMT:
          case EXPLODEAMT:
          case MECHANAMT:
          case MARKAMT:
          case LDRAMT:
            // Base usChance is 'bCurrentRating', these can drop to 0
            usChance = bCurrentRating + (psStatGainPtr.value / usSubpointsPerPoint);
            break;
        }
      } else {
        // Experience level changes, actual usChance depends on level
        // Base usChance is '10 * (current level - 1)'
        usChance = 10 * (bCurrentRating + (psStatGainPtr.value / usSubpointsPerPoint) - 1);

        // if there IS a usChance, adjust it for high or low wisdom (50 is avg)
        if (usChance > 0 && fAffectedByWisdom) {
          usChance -= (usChance * (pProfile.value.bWisdom + (pProfile.value.sWisdomGain / SubpointsPerPoint(WISDOMAMT, pProfile.value.bExpLevel)) - 50)) / 100;
        }

        // if there's ANY usChance, minimum usChance is 1% regardless of wisdom
        if (usChance < 1) {
          usChance = 1;
        }
      }

      if (PreRandom(100) < usChance) {
        (psStatGainPtr.value)--;
        sSubPointChange--;

        // as long as we're not dealing with exp_level changes (already added above!)
        // and it's not from training, and the exp level isn't max'ed out already
        if ((ubStat != EXPERAMT) && (ubReason != FROM_TRAINING)) {
          uiEffLevel = pProfile.value.bExpLevel + (pProfile.value.sExpLevelGain / usSubpointsPerLevel);

          // if level is not at minimum
          if (uiEffLevel > 1) {
            // all other stat changes count towards experience level changes (1 for 1 basis)
            pProfile.value.sExpLevelGain--;
          }
        }
      }
    }
  }

  // exclude training, that's not under our control
  if (ubReason != FROM_TRAINING) {
    // increment counters that track how often stat changes are being awarded
    pProfile.value.usStatChangeChances[ubStat] += usNumChances;
    pProfile.value.usStatChangeSuccesses[ubStat] += Math.abs(sSubPointChange);
  }
}

// convert hired mercs' stats subpoint changes into actual point changes where warranted
function UpdateStats(pSoldier: Pointer<SOLDIERTYPE>): void {
  ProcessUpdateStats(addressof(gMercProfiles[pSoldier.value.ubProfile]), pSoldier);
}

// UpdateStats version for mercs not currently on player's team
function ProfileUpdateStats(pProfile: Pointer<MERCPROFILESTRUCT>): void {
  ProcessUpdateStats(pProfile, null);
}

function ChangeStat(pProfile: Pointer<MERCPROFILESTRUCT>, pSoldier: Pointer<SOLDIERTYPE>, ubStat: UINT8, sPtsChanged: INT16): void {
  // this function changes the stat a given amount...
  let psStatGainPtr: Pointer<INT16> = null;
  let pbStatPtr: Pointer<INT8> = null;
  let pbSoldierStatPtr: Pointer<INT8> = null;
  let pbStatDeltaPtr: Pointer<INT8> = null;
  let puiStatTimerPtr: Pointer<UINT32> = null;
  let fChangeTypeIncrease: boolean;
  let fChangeSalary: boolean;
  let uiLevelCnt: UINT32;
  let ubMercMercIdValue: UINT8 = 0;
  let usIncreaseValue: UINT16 = 0;
  let usSubpointsPerPoint: UINT16;

  usSubpointsPerPoint = SubpointsPerPoint(ubStat, pProfile.value.bExpLevel);

  // build ptrs to appropriate profiletype stat fields
  switch (ubStat) {
    case HEALTHAMT:
      psStatGainPtr = addressof(pProfile.value.sLifeGain);
      pbStatDeltaPtr = addressof(pProfile.value.bLifeDelta);
      pbStatPtr = addressof(pProfile.value.bLifeMax);
      break;

    case AGILAMT:
      psStatGainPtr = addressof(pProfile.value.sAgilityGain);
      pbStatDeltaPtr = addressof(pProfile.value.bAgilityDelta);
      pbStatPtr = addressof(pProfile.value.bAgility);
      break;

    case DEXTAMT:
      psStatGainPtr = addressof(pProfile.value.sDexterityGain);
      pbStatDeltaPtr = addressof(pProfile.value.bDexterityDelta);
      pbStatPtr = addressof(pProfile.value.bDexterity);
      break;

    case WISDOMAMT:
      psStatGainPtr = addressof(pProfile.value.sWisdomGain);
      pbStatDeltaPtr = addressof(pProfile.value.bWisdomDelta);
      pbStatPtr = addressof(pProfile.value.bWisdom);
      break;

    case MEDICALAMT:
      psStatGainPtr = addressof(pProfile.value.sMedicalGain);
      pbStatDeltaPtr = addressof(pProfile.value.bMedicalDelta);
      pbStatPtr = addressof(pProfile.value.bMedical);
      break;

    case EXPLODEAMT:
      psStatGainPtr = addressof(pProfile.value.sExplosivesGain);
      pbStatDeltaPtr = addressof(pProfile.value.bExplosivesDelta);
      pbStatPtr = addressof(pProfile.value.bExplosive);
      break;

    case MECHANAMT:
      psStatGainPtr = addressof(pProfile.value.sMechanicGain);
      pbStatDeltaPtr = addressof(pProfile.value.bMechanicDelta);
      pbStatPtr = addressof(pProfile.value.bMechanical);
      break;

    case MARKAMT:
      psStatGainPtr = addressof(pProfile.value.sMarksmanshipGain);
      pbStatDeltaPtr = addressof(pProfile.value.bMarksmanshipDelta);
      pbStatPtr = addressof(pProfile.value.bMarksmanship);
      break;

    case EXPERAMT:
      psStatGainPtr = addressof(pProfile.value.sExpLevelGain);
      pbStatDeltaPtr = addressof(pProfile.value.bExpLevelDelta);
      pbStatPtr = addressof(pProfile.value.bExpLevel);
      break;

    case STRAMT:
      psStatGainPtr = addressof(pProfile.value.sStrengthGain);
      pbStatDeltaPtr = addressof(pProfile.value.bStrengthDelta);
      pbStatPtr = addressof(pProfile.value.bStrength);
      break;

    case LDRAMT:
      psStatGainPtr = addressof(pProfile.value.sLeadershipGain);
      pbStatDeltaPtr = addressof(pProfile.value.bLeadershipDelta);
      pbStatPtr = addressof(pProfile.value.bLeadership);
      break;
  }

  // if this merc is currently on the player's team
  if (pSoldier != null) {
    // build ptrs to appropriate soldiertype stat fields
    switch (ubStat) {
      case HEALTHAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bLifeMax);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeHealthTime);
        usIncreaseValue = HEALTH_INCREASE;
        break;

      case AGILAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bAgility);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeAgilityTime);
        usIncreaseValue = AGIL_INCREASE;
        break;

      case DEXTAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bDexterity);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeDexterityTime);
        usIncreaseValue = DEX_INCREASE;
        break;

      case WISDOMAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bWisdom);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeWisdomTime);
        usIncreaseValue = WIS_INCREASE;
        break;

      case MEDICALAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bMedical);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeMedicalTime);
        usIncreaseValue = MED_INCREASE;
        break;

      case EXPLODEAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bExplosive);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeExplosivesTime);
        usIncreaseValue = EXP_INCREASE;
        break;

      case MECHANAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bMechanical);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeMechanicalTime);
        usIncreaseValue = MECH_INCREASE;
        break;

      case MARKAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bMarksmanship);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeMarksmanshipTime);
        usIncreaseValue = MRK_INCREASE;
        break;

      case EXPERAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bExpLevel);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeLevelTime);
        usIncreaseValue = LVL_INCREASE;
        break;

      case STRAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bStrength);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeStrengthTime);
        usIncreaseValue = STRENGTH_INCREASE;
        break;

      case LDRAMT:
        pbSoldierStatPtr = addressof(pSoldier.value.bLeadership);
        puiStatTimerPtr = addressof(pSoldier.value.uiChangeLeadershipTime);
        usIncreaseValue = LDR_INCREASE;
        break;
    }
  }

  // ptrs set up, now handle
  // if the stat needs to change
  if (sPtsChanged != 0) {
    // if a stat improved
    if (sPtsChanged > 0) {
      fChangeTypeIncrease = true;
    } else {
      fChangeTypeIncrease = false;
    }

    // update merc profile stat
    pbStatPtr.value += sPtsChanged;

    // if this merc is currently on the player's team (DON'T count increases earned outside the player's employ)
    if (pSoldier != null) {
      // also note the delta (how much this stat has changed since start of game)
      pbStatDeltaPtr.value += sPtsChanged;
    }

    // reduce gain to the unused subpts only
    psStatGainPtr.value = (psStatGainPtr.value) % usSubpointsPerPoint;

    // if the guy is employed by player
    if (pSoldier != null) {
      // transfer over change to soldiertype structure
      pbSoldierStatPtr.value = pbStatPtr.value;

      // if it's a level gain, or sometimes for other stats
      // ( except health; not only will it sound silly, but
      // also we give points for health on sector traversal and this would
      // probaby mess up battle handling too )
      if ((ubStat != HEALTHAMT) && ((ubStat == EXPERAMT) || Random(100) < 25))
      // if ( (ubStat != EXPERAMT) && (ubStat != HEALTHAMT) && ( Random( 100 ) < 25 ) )
      {
        // Pipe up with "I'm getting better at this!"
        TacticalCharacterDialogueWithSpecialEventEx(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DISPLAY_STAT_CHANGE, fChangeTypeIncrease, sPtsChanged, ubStat);
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_EXPERIENCE_GAIN);
      } else {
        let wTempString: CHAR16[] /* [128] */;

        // tell player about it
        BuildStatChangeString(wTempString, pSoldier.value.name, fChangeTypeIncrease, sPtsChanged, ubStat);
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, wTempString);
      }

      // update mapscreen soldier info panel
      fCharacterInfoPanelDirty = true;

      // remember what time it changed at, it's displayed in a different color for a while afterwards
      puiStatTimerPtr.value = GetJA2Clock();

      if (fChangeTypeIncrease) {
        pSoldier.value.usValueGoneUp |= usIncreaseValue;
      } else {
        pSoldier.value.usValueGoneUp &= ~(usIncreaseValue);
      }

      fInterfacePanelDirty = DIRTYLEVEL2;
    }

    // special handling for LIFEMAX
    if (ubStat == HEALTHAMT) {
      // adjust current health by the same amount as max health
      pProfile.value.bLife += sPtsChanged;

      // don't let this kill a guy or knock him out!!!
      if (pProfile.value.bLife < OKLIFE) {
        pProfile.value.bLife = OKLIFE;
      }

      // if the guy is employed by player
      if (pSoldier != null) {
        // adjust current health by the same amount as max health
        pSoldier.value.bLife += sPtsChanged;

        // don't let this kill a guy or knock him out!!!
        if (pSoldier.value.bLife < OKLIFE) {
          pSoldier.value.bLife = OKLIFE;
        }
      }
    }

    // special handling for EXPERIENCE LEVEL
    // merc salaries increase if level goes up (but they don't go down if level drops!)
    if ((ubStat == EXPERAMT) && fChangeTypeIncrease) {
      // if the guy is employed by player
      if (pSoldier != null) {
        switch (pSoldier.value.ubWhatKindOfMercAmI) {
          case Enum260.MERC_TYPE__AIM_MERC:
            // A.I.M.
            pSoldier.value.fContractPriceHasIncreased = true;
            fChangeSalary = true;
            break;

          case Enum260.MERC_TYPE__MERC:
            // M.E.R.C.
            ubMercMercIdValue = pSoldier.value.ubProfile;

            // Biff's profile id ( 40 ) is the base
            ubMercMercIdValue -= Enum268.BIFF;

            // offset for the 2 profiles of Larry (we only have one email for Larry..but 2 profile entries
            if (ubMercMercIdValue >= (Enum268.LARRY_DRUNK - Enum268.BIFF)) {
              ubMercMercIdValue--;
            }

            //
            // Send special E-mail
            //

            //	DEF: 03/06/99 Now sets an event that will be processed later in the day
            //						ubEmailOffset = MERC_UP_LEVEL_BIFF + MERC_UP_LEVEL_LENGTH_BIFF * ( ubMercMercIdValue );
            //						AddEmail( ubEmailOffset, MERC_UP_LEVEL_LENGTH_BIFF, SPECK_FROM_MERC, GetWorldTotalMin() );
            AddStrategicEvent(Enum132.EVENT_MERC_MERC_WENT_UP_LEVEL_EMAIL_DELAY, GetWorldTotalMin() + 60 + Random(60), ubMercMercIdValue);

            fChangeSalary = true;
            break;

          default:
            // others don't increase salary
            fChangeSalary = false;
            break;
        }
      } else // not employed by player
      {
        // only AIM and M.E.R.C.s update stats when not on player's team, and both of them DO change salary
        fChangeSalary = true;
      }

      if (fChangeSalary) {
        // increase all salaries and medical deposits, once for each level gained
        for (uiLevelCnt = 0; uiLevelCnt < sPtsChanged; uiLevelCnt++) {
          pProfile.value.sSalary = CalcNewSalary(pProfile.value.sSalary, fChangeTypeIncrease, MAX_DAILY_SALARY);
          pProfile.value.uiWeeklySalary = CalcNewSalary(pProfile.value.uiWeeklySalary, fChangeTypeIncrease, MAX_LARGE_SALARY);
          pProfile.value.uiBiWeeklySalary = CalcNewSalary(pProfile.value.uiBiWeeklySalary, fChangeTypeIncrease, MAX_LARGE_SALARY);
          pProfile.value.sTrueSalary = CalcNewSalary(pProfile.value.sTrueSalary, fChangeTypeIncrease, MAX_DAILY_SALARY);
          pProfile.value.sMedicalDepositAmount = CalcNewSalary(pProfile.value.sMedicalDepositAmount, fChangeTypeIncrease, MAX_DAILY_SALARY);

          // if (pSoldier != NULL)
          // DON'T increase the *effective* medical deposit, it's already been paid out
          // pSoldier->usMedicalDeposit = pProfile->sMedicalDepositAmount;
        }
      }
    }
  }

  return;
}

// pSoldier may be NULL!
function ProcessUpdateStats(pProfile: Pointer<MERCPROFILESTRUCT>, pSoldier: Pointer<SOLDIERTYPE>): void {
  // this function will run through the soldier's profile and update their stats based on any accumulated gain pts.
  let ubStat: UINT8 = 0;
  let psStatGainPtr: Pointer<INT16> = null;
  let pbStatPtr: Pointer<INT8> = null;
  let pbSoldierStatPtr: Pointer<INT8> = null;
  let pbStatDeltaPtr: Pointer<INT8> = null;
  let bMinStatValue: INT8;
  let bMaxStatValue: INT8;
  let usSubpointsPerPoint: UINT16;
  let sPtsChanged: INT16;

  // if hired, not back at AIM
  if (pSoldier != null) {
    // ATE: if in the midst of an attack, if in the field, delay all stat changes until the check made after the 'attack'...
    if ((gTacticalStatus.ubAttackBusyCount > 0) && pSoldier.value.bInSector && (gTacticalStatus.uiFlags & INCOMBAT))
      return;

    // ignore non-player soldiers
    if (!PTR_OURTEAM())
      return;

    // ignore anything without a profile
    if (pSoldier.value.ubProfile == NO_PROFILE)
      return;

    // ignore vehicles and robots
    if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.value.uiStatusFlags & SOLDIER_ROBOT))
      return;

    // delay increases while merc is dying
    if (pSoldier.value.bLife < OKLIFE)
      return;

    // ignore POWs - shouldn't ever be getting this far
    if (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
      return;
    }
  } else {
    // dead guys don't do nuthin' !
    if (pProfile.value.bMercStatus == MERC_IS_DEAD)
      return;

    if (pProfile.value.bLife < OKLIFE)
      return;
  }

  // check every attribute, skill, and exp.level, too
  for (ubStat = FIRST_CHANGEABLE_STAT; ubStat <= LAST_CHANGEABLE_STAT; ubStat++) {
    // set default min & max, subpoints/pt.
    bMinStatValue = 1;
    bMaxStatValue = MAX_STAT_VALUE;
    usSubpointsPerPoint = SubpointsPerPoint(ubStat, pProfile.value.bExpLevel);

    // build ptrs to appropriate profiletype stat fields
    switch (ubStat) {
      case HEALTHAMT:
        psStatGainPtr = addressof(pProfile.value.sLifeGain);
        pbStatPtr = addressof(pProfile.value.bLifeMax);

        bMinStatValue = OKLIFE;
        break;

      case AGILAMT:
        psStatGainPtr = addressof(pProfile.value.sAgilityGain);
        pbStatPtr = addressof(pProfile.value.bAgility);
        break;

      case DEXTAMT:
        psStatGainPtr = addressof(pProfile.value.sDexterityGain);
        pbStatPtr = addressof(pProfile.value.bDexterity);
        break;

      case WISDOMAMT:
        psStatGainPtr = addressof(pProfile.value.sWisdomGain);
        pbStatPtr = addressof(pProfile.value.bWisdom);
        break;

      case MEDICALAMT:
        psStatGainPtr = addressof(pProfile.value.sMedicalGain);
        pbStatPtr = addressof(pProfile.value.bMedical);

        bMinStatValue = 0;
        break;

      case EXPLODEAMT:
        psStatGainPtr = addressof(pProfile.value.sExplosivesGain);
        pbStatPtr = addressof(pProfile.value.bExplosive);

        bMinStatValue = 0;
        break;

      case MECHANAMT:
        psStatGainPtr = addressof(pProfile.value.sMechanicGain);
        pbStatPtr = addressof(pProfile.value.bMechanical);

        bMinStatValue = 0;
        break;

      case MARKAMT:
        psStatGainPtr = addressof(pProfile.value.sMarksmanshipGain);
        pbStatPtr = addressof(pProfile.value.bMarksmanship);

        bMinStatValue = 0;
        break;

      case EXPERAMT:
        psStatGainPtr = addressof(pProfile.value.sExpLevelGain);
        pbStatPtr = addressof(pProfile.value.bExpLevel);

        bMaxStatValue = MAXEXPLEVEL;
        break;

      case STRAMT:
        psStatGainPtr = addressof(pProfile.value.sStrengthGain);
        pbStatPtr = addressof(pProfile.value.bStrength);
        break;

      case LDRAMT:
        psStatGainPtr = addressof(pProfile.value.sLeadershipGain);
        pbStatPtr = addressof(pProfile.value.bLeadership);
        break;
    }

    // if this merc is currently on the player's team
    if (pSoldier != null) {
      // build ptrs to appropriate soldiertype stat fields
      switch (ubStat) {
        case HEALTHAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bLifeMax);
          break;

        case AGILAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bAgility);
          break;

        case DEXTAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bDexterity);
          break;

        case WISDOMAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bWisdom);
          break;

        case MEDICALAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bMedical);
          break;

        case EXPLODEAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bExplosive);
          break;

        case MECHANAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bMechanical);
          break;

        case MARKAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bMarksmanship);
          break;

        case EXPERAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bExpLevel);
          break;

        case STRAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bStrength);
          break;

        case LDRAMT:
          pbSoldierStatPtr = addressof(pSoldier.value.bLeadership);
          break;
      }
    }

    // ptrs set up, now handle

    // Calc how many full points worth of stat changes we have accumulated in this stat (positive OR negative!)
    // NOTE: for simplicity, this hopes nobody will go up more than one level at once, which would change the subpoints/pt
    sPtsChanged = (psStatGainPtr.value) / usSubpointsPerPoint;

    // gone too high or too low?..handle the fact
    if ((pbStatPtr.value + sPtsChanged) > bMaxStatValue) {
      // reduce change to reach max value and reset stat gain ptr
      sPtsChanged = bMaxStatValue - pbStatPtr.value;
      psStatGainPtr.value = 0;
    } else if ((pbStatPtr.value + sPtsChanged) < bMinStatValue) {
      // reduce change to reach min value and reset stat gain ptr
      sPtsChanged = bMinStatValue - pbStatPtr.value;
      psStatGainPtr.value = 0;
    }

    // if the stat needs to change
    if (sPtsChanged != 0) {
      // Otherwise, use normal stat increase stuff...
      ChangeStat(pProfile, pSoldier, ubStat, sPtsChanged);
    }
  }

  return;
}

export function HandleAnyStatChangesAfterAttack(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // must check everyone on player's team, not just the shooter
  for (cnt = 0, pSoldier = MercPtrs[0]; cnt <= gTacticalStatus.Team[MercPtrs[0].value.bTeam].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive) {
      ProcessUpdateStats(addressof(gMercProfiles[pSoldier.value.ubProfile]), pSoldier);
    }
  }
}

function CalcNewSalary(uiOldSalary: UINT32, fIncrease: boolean, uiMaxLimit: UINT32): UINT32 {
  let uiNewSalary: UINT32;

  // if he was working for free, it's still free!
  if (uiOldSalary == 0) {
    return 0;
  }

  if (fIncrease) {
    uiNewSalary = (uiOldSalary * SALARY_CHANGE_PER_LEVEL);
  } else {
    uiNewSalary = (uiOldSalary / SALARY_CHANGE_PER_LEVEL);
  }

  // round it off to a reasonable multiple
  uiNewSalary = RoundOffSalary(uiNewSalary);

  // let's set some reasonable limits here, lest it get silly one day
  if (uiNewSalary > uiMaxLimit)
    uiNewSalary = uiMaxLimit;

  if (uiNewSalary < 5)
    uiNewSalary = 5;

  return uiNewSalary;
}

function RoundOffSalary(uiSalary: UINT32): UINT32 {
  let uiMultiple: UINT32;

  // determine what multiple value the salary should be rounded off to
  if (uiSalary <= 250)
    uiMultiple = 5;
  else if (uiSalary <= 500)
    uiMultiple = 10;
  else if (uiSalary <= 1000)
    uiMultiple = 25;
  else if (uiSalary <= 2000)
    uiMultiple = 50;
  else if (uiSalary <= 5000)
    uiMultiple = 100;
  else if (uiSalary <= 10000)
    uiMultiple = 500;
  else if (uiSalary <= 25000)
    uiMultiple = 1000;
  else if (uiSalary <= 50000)
    uiMultiple = 2000;
  else
    uiMultiple = 5000;

  // if the salary doesn't divide evenly by the multiple
  if (uiSalary % uiMultiple) {
    // then we have to make it so, as Picard would say <- We have to wonder how much Alex gets out
    // and while we're at it, we round up to next higher multiple if halfway
    uiSalary = ((uiSalary + (uiMultiple / 2)) / uiMultiple) * uiMultiple;
  }

  return uiSalary;
}

function SubpointsPerPoint(ubStat: UINT8, bExpLevel: INT8): UINT16 {
  let usSubpointsPerPoint: UINT16;

  // figure out how many subpoints this type of stat needs to change
  switch (ubStat) {
    case HEALTHAMT:
    case AGILAMT:
    case DEXTAMT:
    case WISDOMAMT:
    case STRAMT:
      // attributes
      usSubpointsPerPoint = ATTRIBS_SUBPOINTS_TO_IMPROVE;
      break;

    case MEDICALAMT:
    case EXPLODEAMT:
    case MECHANAMT:
    case MARKAMT:
    case LDRAMT:
      // skills
      usSubpointsPerPoint = SKILLS_SUBPOINTS_TO_IMPROVE;
      break;

    case EXPERAMT:
      usSubpointsPerPoint = LEVEL_SUBPOINTS_TO_IMPROVE * bExpLevel;
      break;

    default:
      // BETA message
      ScreenMsg(FONT_ORANGE, MSG_BETAVERSION, "SubpointsPerPoint: ERROR - Unknown ubStat %d", ubStat);
      return 100;
  }

  return usSubpointsPerPoint;
}

// handles stat changes for mercs not currently working for the player
export function HandleUnhiredMercImprovement(pProfile: Pointer<MERCPROFILESTRUCT>): void {
  let ubNumStats: UINT8;
  let ubStat: UINT8;
  let usNumChances: UINT16;

  ubNumStats = LAST_CHANGEABLE_STAT - FIRST_CHANGEABLE_STAT + 1;

  // if he's working on another job
  if (pProfile.value.bMercStatus == MERC_WORKING_ELSEWHERE) {
    // if he did't do anything interesting today
    if (Random(100) < 20) {
      // no chance to change today
      return;
    }

    // it's real on the job experience, counts towards experience

    // all stats (including experience itself) get an equal chance to improve
    // 80 wisdom gives 8 rolls per stat per day, 10 stats, avg success rate 40% = 32pts per day,
    // so about 10 working days to hit lvl 2.  This seems high, but mercs don't actually "work" that often, and it's twice
    // as long to hit level 3.  If we go lower, attribs & skills will barely move.
    usNumChances = (pProfile.value.bWisdom / 10);
    for (ubStat = FIRST_CHANGEABLE_STAT; ubStat <= LAST_CHANGEABLE_STAT; ubStat++) {
      ProfileStatChange(pProfile, ubStat, usNumChances, false);
    }
  } else {
    // if the merc just takes it easy (high level or stupid mercs are more likely to)
    if ((Random(10) < pProfile.value.bExpLevel) || (Random(100) > pProfile.value.bWisdom)) {
      // no chance to change today
      return;
    }

    // it's just practise/training back home
    do {
      // pick ONE stat at random to focus on (it may be beyond training cap, but so what, too hard to weed those out)
      ubStat = (FIRST_CHANGEABLE_STAT + Random(ubNumStats));
      // except experience - can't practise that!
    } while (ubStat == EXPERAMT);

    // try to improve that one stat
    ProfileStatChange(pProfile, ubStat, (pProfile.value.bWisdom / 2), FROM_TRAINING);
  }

  ProfileUpdateStats(pProfile);
}

// handles possible death of mercs not currently working for the player
export function HandleUnhiredMercDeaths(iProfileID: INT32): void {
  let ubMaxDeaths: UINT8;
  let sChance: INT16;
  let pProfile: Pointer<MERCPROFILESTRUCT> = addressof(gMercProfiles[iProfileID]);

  // if the player has never yet had the chance to hire this merc
  if (!(pProfile.value.ubMiscFlags3 & PROFILE_MISC_FLAG3_PLAYER_HAD_CHANCE_TO_HIRE)) {
    // then we're not allowed to kill him (to avoid really pissing off player by killing his very favorite merc)
    return;
  }

  // how many in total can be killed like this depends on player's difficulty setting
  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      ubMaxDeaths = 1;
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      ubMaxDeaths = 2;
      break;
    case Enum9.DIF_LEVEL_HARD:
      ubMaxDeaths = 3;
      break;
    default:
      Assert(false);
      ubMaxDeaths = 0;
      break;
  }

  // if we've already hit the limit in this game, skip these checks
  if (gStrategicStatus.ubUnhiredMercDeaths >= ubMaxDeaths) {
    return;
  }

  // calculate this merc's (small) chance to get killed today (out of 1000)
  sChance = 10 - pProfile.value.bExpLevel;

  switch (pProfile.value.bPersonalityTrait) {
    case Enum270.FORGETFUL:
    case Enum270.NERVOUS:
    case Enum270.PSYCHO:
      // these guys are somewhat more likely to get killed (they have "problems")
      sChance += 2;
      break;
  }

  // stealthy guys are slightly less likely to get killed (they're careful)
  if (pProfile.value.bSkillTrait == Enum269.STEALTHY) {
    sChance -= 1;
  }
  if (pProfile.value.bSkillTrait2 == Enum269.STEALTHY) {
    sChance -= 1;
  }

  if (PreRandom(1000) < sChance) {
    // this merc gets Killed In Action!!!
    pProfile.value.bMercStatus = MERC_IS_DEAD;
    pProfile.value.uiDayBecomesAvailable = 0;

    // keep count of how many there have been
    gStrategicStatus.ubUnhiredMercDeaths++;

    // send an email as long as the merc is from aim
    if (iProfileID < Enum268.BIFF) {
      // send an email to the player telling the player that a merc died
      AddEmailWithSpecialData(MERC_DIED_ON_OTHER_ASSIGNMENT, MERC_DIED_ON_OTHER_ASSIGNMENT_LENGTH, Enum75.AIM_SITE, GetWorldTotalMin(), 0, iProfileID);
    }
  }
}

// These HAVE to total 100% at all times!!!
const PROGRESS_PORTION_KILLS = 25;
const PROGRESS_PORTION_CONTROL = 25;
const PROGRESS_PORTION_INCOME = 50;

// returns a number between 0-100, this is an estimate of how far a player has progressed through the game
export function CurrentPlayerProgressPercentage(): UINT8 {
  let uiCurrentIncome: UINT32;
  let uiPossibleIncome: UINT32;
  let ubCurrentProgress: UINT8;
  let ubKillsPerPoint: UINT8;
  let usKillsProgress: UINT16;
  let usControlProgress: UINT16;

  if (gfEditMode)
    return 0;

  // figure out the player's current mine income
  uiCurrentIncome = PredictIncomeFromPlayerMines();

  // figure out the player's potential mine income
  uiPossibleIncome = CalcMaxPlayerIncomeFromMines();

  // either of these indicates a critical failure of some sort
  Assert(uiPossibleIncome > 0);
  Assert(uiCurrentIncome <= uiPossibleIncome);

  // for a rough guess as to how well the player is doing,
  // we'll take the current mine income / potential mine income as a percentage

  // Kris:  Make sure you don't divide by zero!!!
  if (uiPossibleIncome > 0) {
    ubCurrentProgress = ((uiCurrentIncome * PROGRESS_PORTION_INCOME) / uiPossibleIncome);
  } else {
    ubCurrentProgress = 0;
  }

  // kills per point depends on difficulty, and should match the ratios of starting enemy populations (730/1050/1500)
  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      ubKillsPerPoint = 7;
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      ubKillsPerPoint = 10;
      break;
    case Enum9.DIF_LEVEL_HARD:
      ubKillsPerPoint = 15;
      break;
    default:
      Assert(false);
      ubKillsPerPoint = 10;
      break;
  }

  usKillsProgress = gStrategicStatus.usPlayerKills / ubKillsPerPoint;
  if (usKillsProgress > PROGRESS_PORTION_KILLS) {
    usKillsProgress = PROGRESS_PORTION_KILLS;
  }

  // add kills progress to income progress
  ubCurrentProgress += usKillsProgress;

  // 19 sectors in mining towns + 3 wilderness SAMs each count double.  Balime & Meduna are extra and not required
  usControlProgress = CalcImportantSectorControl();
  if (usControlProgress > PROGRESS_PORTION_CONTROL) {
    usControlProgress = PROGRESS_PORTION_CONTROL;
  }

  // add control progress
  ubCurrentProgress += usControlProgress;

  return ubCurrentProgress;
}

export function HighestPlayerProgressPercentage(): UINT8 {
  if (gfEditMode)
    return 0;

  return gStrategicStatus.ubHighestProgress;
}

// monitors the highest level of progress that player has achieved so far (checking hourly),
// as opposed to his immediate situation (which may be worse if he's suffered a setback).
export function HourlyProgressUpdate(): void {
  let ubCurrentProgress: UINT8;

  ubCurrentProgress = CurrentPlayerProgressPercentage();

  // if this is new high, remember it as that
  if (ubCurrentProgress > gStrategicStatus.ubHighestProgress) {
    // CJC:  note when progress goes above certain values for the first time

    // at 35% start the Madlab quest
    if (ubCurrentProgress >= 35 && gStrategicStatus.ubHighestProgress < 35) {
      HandleScientistAWOLMeanwhileScene();
    }

    // at 50% make Mike available to the strategic AI
    if (ubCurrentProgress >= 50 && gStrategicStatus.ubHighestProgress < 50) {
      SetFactTrue(Enum170.FACT_MIKE_AVAILABLE_TO_ARMY);
    }

    // at 70% add Iggy to the world
    if (ubCurrentProgress >= 70 && gStrategicStatus.ubHighestProgress < 70) {
      gMercProfiles[Enum268.IGGY].sSectorX = 5;
      gMercProfiles[Enum268.IGGY].sSectorY = MAP_ROW_C;
    }

    gStrategicStatus.ubHighestProgress = ubCurrentProgress;

    // debug message
    ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "New player progress record: %d%%", gStrategicStatus.ubHighestProgress);
  }
}

export function AwardExperienceBonusToActiveSquad(ubExpBonusType: UINT8): void {
  let usXPs: UINT16 = 0;
  let ubGuynum: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  Assert(ubExpBonusType < Enum200.NUM_EXP_BONUS_TYPES);

  switch (ubExpBonusType) {
    case Enum200.EXP_BONUS_MINIMUM:
      usXPs = 25;
      break;
    case Enum200.EXP_BONUS_SMALL:
      usXPs = 50;
      break;
    case Enum200.EXP_BONUS_AVERAGE:
      usXPs = 100;
      break;
    case Enum200.EXP_BONUS_LARGE:
      usXPs = 200;
      break;
    case Enum200.EXP_BONUS_MAXIMUM:
      usXPs = 400;
      break;
  }

  // to do: find guys in sector on the currently active squad, those that are conscious get this amount in XPs
  for (ubGuynum = gTacticalStatus.Team[gbPlayerNum].bFirstID, pSoldier = MercPtrs[ubGuynum]; ubGuynum <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubGuynum++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && IsMercOnCurrentSquad(pSoldier) && (pSoldier.value.bLife >= CONSCIOUSNESS) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier)) {
      StatChange(pSoldier, EXPERAMT, usXPs, false);
    }
  }
}

export function BuildStatChangeString(wString: STR16, wName: STR16, fIncrease: boolean, sPtsChanged: INT16, ubStat: UINT8): void {
  let ubStringIndex: UINT8;

  Assert(sPtsChanged != 0);
  Assert(ubStat >= FIRST_CHANGEABLE_STAT);
  Assert(ubStat <= LAST_CHANGEABLE_STAT);

  // if just a 1 point change
  if (Math.abs(sPtsChanged) == 1) {
    // use singular
    ubStringIndex = 2;
  } else {
    ubStringIndex = 3;
    // use plural
  }

  if (ubStat == EXPERAMT) {
    // use "level/levels instead of point/points
    ubStringIndex += 2;
  }

  swprintf(wString, "%s %s %d %s %s", wName, sPreStatBuildString[fIncrease ? 1 : 0], Math.abs(sPtsChanged), sPreStatBuildString[ubStringIndex], sStatGainStrings[ubStat - FIRST_CHANGEABLE_STAT]);
}

function CalcImportantSectorControl(): UINT8 {
  let ubMapX: UINT8;
  let ubMapY: UINT8;
  let ubSectorControlPts: UINT8 = 0;

  for (ubMapX = 1; ubMapX < MAP_WORLD_X - 1; ubMapX++) {
    for (ubMapY = 1; ubMapY < MAP_WORLD_Y - 1; ubMapY++) {
      // if player controlled
      if (StrategicMap[CALCULATE_STRATEGIC_INDEX(ubMapX, ubMapY)].fEnemyControlled == false) {
        // towns where militia can be trained and SAM sites are important sectors
        if (MilitiaTrainingAllowedInSector(ubMapX, ubMapY, 0)) {
          ubSectorControlPts++;

          // SAM sites count double - they have no income, but have significant air control value
          if (IsThisSectorASAMSector(ubMapX, ubMapY, 0)) {
            ubSectorControlPts++;
          }
        }
      }
    }
  }

  return ubSectorControlPts;
}

export function MERCMercWentUpALevelSendEmail(ubMercMercIdValue: UINT8): void {
  let ubEmailOffset: UINT8 = 0;

  ubEmailOffset = MERC_UP_LEVEL_BIFF + MERC_UP_LEVEL_LENGTH_BIFF * (ubMercMercIdValue);
  AddEmail(ubEmailOffset, MERC_UP_LEVEL_LENGTH_BIFF, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());
}

}
