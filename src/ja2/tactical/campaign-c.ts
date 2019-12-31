namespace ja2 {

type StatKey = 'bLifeMax' | 'bAgility' | 'bDexterity' | 'bWisdom' | 'bMedical' | 'bExplosive' | 'bMechanical' | 'bMarksmanship' | 'bExpLevel' | 'bStrength' | 'bLeadership';
type StatGainKey = 'sLifeGain' | 'sAgilityGain' | 'sDexterityGain' | 'sWisdomGain' | 'sMedicalGain' | 'sExplosivesGain' | 'sMechanicGain' | 'sMarksmanshipGain' | 'sExpLevelGain' | 'sStrengthGain' | 'sLeadershipGain';
type StatDeltaKey = 'bLifeDelta' | 'bAgilityDelta' | 'bDexterityDelta' | 'bWisdomDelta' | 'bMedicalDelta' | 'bExplosivesDelta' | 'bMechanicDelta' | 'bMarksmanshipDelta' | 'bExpLevelDelta' | 'bStrengthDelta' | 'bLeadershipDelta';
type StatTimerKey = 'uiChangeHealthTime' | 'uiChangeAgilityTime' | 'uiChangeDexterityTime' | 'uiChangeWisdomTime' | 'uiChangeMedicalTime' | 'uiChangeExplosivesTime' | 'uiChangeMechanicalTime' | 'uiChangeMarksmanshipTime' | 'uiChangeLevelTime' | 'uiChangeStrengthTime' | 'uiChangeLeadershipTime';

// give pSoldier usNumChances to improve ubStat.  If it's from training, it doesn't count towards experience level gain
export function StatChange(pSoldier: SOLDIERTYPE, ubStat: UINT8, usNumChances: UINT16, ubReason: UINT8): void {
  Assert(pSoldier != null);
  Assert(pSoldier.bActive);

  // ignore non-player soldiers
  if (!PTR_OURTEAM(pSoldier))
    return;

  // ignore anything without a profile
  if (pSoldier.ubProfile == NO_PROFILE)
    return;

  // ignore vehicles and robots
  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.uiStatusFlags & SOLDIER_ROBOT))
    return;

  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    ScreenMsg(FONT_ORANGE, MSG_BETAVERSION, "ERROR: StatChange: %s improving stats while POW! ubStat %d", pSoldier.name, ubStat);
    return;
  }

  // no points earned while somebody is unconscious (for assist XPs, and such)
  if (pSoldier.bLife < CONSCIOUSNESS)
    return;

  ProcessStatChange(gMercProfiles[pSoldier.ubProfile], ubStat, usNumChances, ubReason);

  // Update stats....right away... ATE
  UpdateStats(pSoldier);
}

// this is the equivalent of StatChange(), but for use with mercs not currently on player's team
// give pProfile usNumChances to improve ubStat.  If it's from training, it doesn't count towards experience level gain
function ProfileStatChange(pProfile: MERCPROFILESTRUCT, ubStat: UINT8, usNumChances: UINT16, ubReason: UINT8): void {
  // dead guys don't do nuthin' !
  if (pProfile.bMercStatus == MERC_IS_DEAD)
    return;

  if (pProfile.bLife < OKLIFE)
    return;

  ProcessStatChange(pProfile, ubStat, usNumChances, ubReason);

  // Update stats....right away... ATE
  ProfileUpdateStats(pProfile);
}

function ProcessStatChange(pProfile: MERCPROFILESTRUCT, ubStat: UINT8, usNumChances: UINT16, ubReason: UINT8): void {
  let uiCnt: UINT32;
  let uiEffLevel: UINT32;
  let sSubPointChange: INT16 = 0;
  let usChance: UINT16 = 0;
  let usSubpointsPerPoint: UINT16;
  let usSubpointsPerLevel: UINT16;
  let bCurrentRating: INT8;
  let psStatGainPtr: StatGainKey;
  let fAffectedByWisdom: boolean = true;

  Assert(pProfile != null);

  if (pProfile.bEvolution == Enum274.NO_EVOLUTION)
    return; // No change possible, quit right away

  // if this is a Reverse-Evolving merc who attempting to train
  if ((ubReason == FROM_TRAINING) && (pProfile.bEvolution == Enum274.DEVOLVE))
    return; // he doesn't get any benefit, but isn't penalized either

  if (usNumChances == 0)
    return;

  usSubpointsPerPoint = SubpointsPerPoint(ubStat, pProfile.bExpLevel);
  usSubpointsPerLevel = SubpointsPerPoint(EXPERAMT, pProfile.bExpLevel);

  switch (ubStat) {
    case HEALTHAMT:
      bCurrentRating = pProfile.bLifeMax;
      psStatGainPtr = 'sLifeGain';
      // NB physical stat checks not affected by wisdom, unless training is going on
      fAffectedByWisdom = false;
      break;

    case AGILAMT:
      bCurrentRating = pProfile.bAgility;
      psStatGainPtr = 'sAgilityGain';
      fAffectedByWisdom = false;
      break;

    case DEXTAMT:
      bCurrentRating = pProfile.bDexterity;
      psStatGainPtr = 'sDexterityGain';
      fAffectedByWisdom = false;
      break;

    case WISDOMAMT:
      bCurrentRating = pProfile.bWisdom;
      psStatGainPtr = 'sWisdomGain';
      break;

    case MEDICALAMT:
      bCurrentRating = pProfile.bMedical;
      psStatGainPtr = 'sMedicalGain';
      break;

    case EXPLODEAMT:
      bCurrentRating = pProfile.bExplosive;
      psStatGainPtr = 'sExplosivesGain';
      break;

    case MECHANAMT:
      bCurrentRating = pProfile.bMechanical;
      psStatGainPtr = 'sMechanicGain';
      break;

    case MARKAMT:
      bCurrentRating = pProfile.bMarksmanship;
      psStatGainPtr = 'sMarksmanshipGain';
      break;

    case EXPERAMT:
      bCurrentRating = pProfile.bExpLevel;
      psStatGainPtr = 'sExpLevelGain';
      break;

    case STRAMT:
      bCurrentRating = pProfile.bStrength;
      psStatGainPtr = 'sStrengthGain';
      fAffectedByWisdom = false;
      break;

    case LDRAMT:
      bCurrentRating = pProfile.bLeadership;
      psStatGainPtr = 'sLeadershipGain';
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
    if (pProfile.bEvolution == Enum274.NORMAL_EVOLUTION) // Evolves!
    {
      // if this is improving from a failure, and a successful roll would give us enough to go up a point
      if ((ubReason == FROM_FAILURE) && ((pProfile[psStatGainPtr] + 1) >= usSubpointsPerPoint)) {
        // can't improve any more from this statchange, because Ian don't want failures causin increases!
        break;
      }

      if (ubStat != EXPERAMT) {
        // NON-experience level changes, actual usChance depends on bCurrentRating
        // Base usChance is '100 - bCurrentRating'
        usChance = 100 - (bCurrentRating + Math.trunc(pProfile[psStatGainPtr] / usSubpointsPerPoint));

        // prevent training beyond the training cap
        if ((ubReason == FROM_TRAINING) && (bCurrentRating + Math.trunc(pProfile[psStatGainPtr] / usSubpointsPerPoint) >= TRAINING_RATING_CAP)) {
          usChance = 0;
        }
      } else {
        // Experience level changes, actual usChance depends on level
        // Base usChance is '100 - (10 * current level)'
        usChance = 100 - 10 * (bCurrentRating + Math.trunc(pProfile[psStatGainPtr] / usSubpointsPerPoint));
      }

      // if there IS a usChance, adjust it for high or low wisdom (50 is avg)
      if (usChance > 0 && fAffectedByWisdom) {
        usChance += Math.trunc((usChance * (pProfile.bWisdom + Math.trunc(pProfile.sWisdomGain / SubpointsPerPoint(WISDOMAMT, pProfile.bExpLevel)) - 50)) / 100);
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
        pProfile[psStatGainPtr]++;
        sSubPointChange++;

        // as long as we're not dealing with exp_level changes (already added above!)
        // and it's not from training, and the exp level isn't max'ed out already
        if ((ubStat != EXPERAMT) && (ubReason != FROM_TRAINING)) {
          uiEffLevel = pProfile.bExpLevel + Math.trunc(pProfile.sExpLevelGain / usSubpointsPerLevel);

          // if level is not at maximum
          if (uiEffLevel < MAXEXPLEVEL) {
            // if this is NOT improving from a failure, OR it would NOT give us enough to go up a level
            if ((ubReason != FROM_FAILURE) || ((pProfile.sExpLevelGain + 1) < usSubpointsPerLevel)) {
              // all other stat changes count towards experience level changes (1 for 1 basis)
              pProfile.sExpLevelGain++;
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
            usChance = bCurrentRating + Math.trunc(pProfile[psStatGainPtr] / usSubpointsPerPoint) - 1;
            break;

          case MEDICALAMT:
          case EXPLODEAMT:
          case MECHANAMT:
          case MARKAMT:
          case LDRAMT:
            // Base usChance is 'bCurrentRating', these can drop to 0
            usChance = bCurrentRating + Math.trunc(pProfile[psStatGainPtr] / usSubpointsPerPoint);
            break;
        }
      } else {
        // Experience level changes, actual usChance depends on level
        // Base usChance is '10 * (current level - 1)'
        usChance = 10 * (bCurrentRating + Math.trunc(pProfile[psStatGainPtr] / usSubpointsPerPoint) - 1);

        // if there IS a usChance, adjust it for high or low wisdom (50 is avg)
        if (usChance > 0 && fAffectedByWisdom) {
          usChance -= Math.trunc((usChance * (pProfile.bWisdom + Math.trunc(pProfile.sWisdomGain / SubpointsPerPoint(WISDOMAMT, pProfile.bExpLevel)) - 50)) / 100);
        }

        // if there's ANY usChance, minimum usChance is 1% regardless of wisdom
        if (usChance < 1) {
          usChance = 1;
        }
      }

      if (PreRandom(100) < usChance) {
        pProfile[psStatGainPtr]--;
        sSubPointChange--;

        // as long as we're not dealing with exp_level changes (already added above!)
        // and it's not from training, and the exp level isn't max'ed out already
        if ((ubStat != EXPERAMT) && (ubReason != FROM_TRAINING)) {
          uiEffLevel = pProfile.bExpLevel + Math.trunc(pProfile.sExpLevelGain / usSubpointsPerLevel);

          // if level is not at minimum
          if (uiEffLevel > 1) {
            // all other stat changes count towards experience level changes (1 for 1 basis)
            pProfile.sExpLevelGain--;
          }
        }
      }
    }
  }

  // exclude training, that's not under our control
  if (ubReason != FROM_TRAINING) {
    // increment counters that track how often stat changes are being awarded
    pProfile.usStatChangeChances[ubStat] += usNumChances;
    pProfile.usStatChangeSuccesses[ubStat] += Math.abs(sSubPointChange);
  }
}

// convert hired mercs' stats subpoint changes into actual point changes where warranted
function UpdateStats(pSoldier: SOLDIERTYPE): void {
  ProcessUpdateStats(gMercProfiles[pSoldier.ubProfile], pSoldier);
}

// UpdateStats version for mercs not currently on player's team
function ProfileUpdateStats(pProfile: MERCPROFILESTRUCT): void {
  ProcessUpdateStats(pProfile, null);
}

function ChangeStat(pProfile: MERCPROFILESTRUCT, pSoldier: SOLDIERTYPE | null, ubStat: UINT8, sPtsChanged: INT16): void {
  // this function changes the stat a given amount...
  let psStatGainPtr: StatGainKey;
  let pbStatPtr: StatKey;
  let pbSoldierStatPtr: StatKey = <StatKey><unknown>undefined;
  let pbStatDeltaPtr: StatDeltaKey;
  let puiStatTimerPtr: StatTimerKey = <StatTimerKey><unknown>undefined;
  let fChangeTypeIncrease: boolean;
  let fChangeSalary: boolean;
  let uiLevelCnt: UINT32;
  let ubMercMercIdValue: UINT8 = 0;
  let usIncreaseValue: UINT16 = 0;
  let usSubpointsPerPoint: UINT16;

  usSubpointsPerPoint = SubpointsPerPoint(ubStat, pProfile.bExpLevel);

  // build ptrs to appropriate profiletype stat fields
  switch (ubStat) {
    case HEALTHAMT:
      psStatGainPtr = 'sLifeGain';
      pbStatDeltaPtr = 'bLifeDelta';
      pbStatPtr = 'bLifeMax';
      break;

    case AGILAMT:
      psStatGainPtr = 'sAgilityGain';
      pbStatDeltaPtr = 'bAgilityDelta';
      pbStatPtr = 'bAgility';
      break;

    case DEXTAMT:
      psStatGainPtr = 'sDexterityGain';
      pbStatDeltaPtr = 'bDexterityDelta';
      pbStatPtr = 'bDexterity';
      break;

    case WISDOMAMT:
      psStatGainPtr = 'sWisdomGain';
      pbStatDeltaPtr = 'bWisdomDelta';
      pbStatPtr = 'bWisdom';
      break;

    case MEDICALAMT:
      psStatGainPtr = 'sMedicalGain';
      pbStatDeltaPtr = 'bMedicalDelta';
      pbStatPtr = 'bMedical';
      break;

    case EXPLODEAMT:
      psStatGainPtr = 'sExplosivesGain';
      pbStatDeltaPtr = 'bExplosivesDelta';
      pbStatPtr = 'bExplosive';
      break;

    case MECHANAMT:
      psStatGainPtr = 'sMechanicGain';
      pbStatDeltaPtr = 'bMechanicDelta';
      pbStatPtr = 'bMechanical';
      break;

    case MARKAMT:
      psStatGainPtr = 'sMarksmanshipGain';
      pbStatDeltaPtr = 'bMarksmanshipDelta';
      pbStatPtr = 'bMarksmanship';
      break;

    case EXPERAMT:
      psStatGainPtr = 'sExpLevelGain';
      pbStatDeltaPtr = 'bExpLevelDelta';
      pbStatPtr = 'bExpLevel';
      break;

    case STRAMT:
      psStatGainPtr = 'sStrengthGain';
      pbStatDeltaPtr = 'bStrengthDelta';
      pbStatPtr = 'bStrength';
      break;

    case LDRAMT:
      psStatGainPtr = 'sLeadershipGain';
      pbStatDeltaPtr = 'bLeadershipDelta';
      pbStatPtr = 'bLeadership';
      break;

    default:
      throw new Error('Should be unreachable');
  }

  // if this merc is currently on the player's team
  if (pSoldier != null) {
    // build ptrs to appropriate soldiertype stat fields
    switch (ubStat) {
      case HEALTHAMT:
        pbSoldierStatPtr = 'bLifeMax';
        puiStatTimerPtr = 'uiChangeHealthTime';
        usIncreaseValue = HEALTH_INCREASE;
        break;

      case AGILAMT:
        pbSoldierStatPtr = 'bAgility';
        puiStatTimerPtr = 'uiChangeAgilityTime';
        usIncreaseValue = AGIL_INCREASE;
        break;

      case DEXTAMT:
        pbSoldierStatPtr = 'bDexterity';
        puiStatTimerPtr = 'uiChangeDexterityTime';
        usIncreaseValue = DEX_INCREASE;
        break;

      case WISDOMAMT:
        pbSoldierStatPtr = 'bWisdom';
        puiStatTimerPtr = 'uiChangeWisdomTime';
        usIncreaseValue = WIS_INCREASE;
        break;

      case MEDICALAMT:
        pbSoldierStatPtr = 'bMedical';
        puiStatTimerPtr = 'uiChangeMedicalTime';
        usIncreaseValue = MED_INCREASE;
        break;

      case EXPLODEAMT:
        pbSoldierStatPtr = 'bExplosive';
        puiStatTimerPtr = 'uiChangeExplosivesTime';
        usIncreaseValue = EXP_INCREASE;
        break;

      case MECHANAMT:
        pbSoldierStatPtr = 'bMechanical';
        puiStatTimerPtr = 'uiChangeMechanicalTime';
        usIncreaseValue = MECH_INCREASE;
        break;

      case MARKAMT:
        pbSoldierStatPtr = 'bMarksmanship';
        puiStatTimerPtr = 'uiChangeMarksmanshipTime';
        usIncreaseValue = MRK_INCREASE;
        break;

      case EXPERAMT:
        pbSoldierStatPtr = 'bExpLevel';
        puiStatTimerPtr = 'uiChangeLevelTime';
        usIncreaseValue = LVL_INCREASE;
        break;

      case STRAMT:
        pbSoldierStatPtr = 'bStrength';
        puiStatTimerPtr = 'uiChangeStrengthTime';
        usIncreaseValue = STRENGTH_INCREASE;
        break;

      case LDRAMT:
        pbSoldierStatPtr = 'bLeadership';
        puiStatTimerPtr = 'uiChangeLeadershipTime';
        usIncreaseValue = LDR_INCREASE;
        break;

      default:
        throw new Error('Should be unreachable');
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
    pProfile[pbStatPtr] += sPtsChanged;

    // if this merc is currently on the player's team (DON'T count increases earned outside the player's employ)
    if (pSoldier != null) {
      // also note the delta (how much this stat has changed since start of game)
      pProfile[pbStatDeltaPtr] += sPtsChanged;
    }

    // reduce gain to the unused subpts only
    pProfile[psStatGainPtr] = pProfile[psStatGainPtr] % usSubpointsPerPoint;

    // if the guy is employed by player
    if (pSoldier != null) {
      // transfer over change to soldiertype structure
      pSoldier[pbSoldierStatPtr] = pProfile[pbStatPtr];

      // if it's a level gain, or sometimes for other stats
      // ( except health; not only will it sound silly, but
      // also we give points for health on sector traversal and this would
      // probaby mess up battle handling too )
      if ((ubStat != HEALTHAMT) && ((ubStat == EXPERAMT) || Random(100) < 25))
      // if ( (ubStat != EXPERAMT) && (ubStat != HEALTHAMT) && ( Random( 100 ) < 25 ) )
      {
        // Pipe up with "I'm getting better at this!"
        TacticalCharacterDialogueWithSpecialEventEx(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DISPLAY_STAT_CHANGE, Number(fChangeTypeIncrease), sPtsChanged, ubStat);
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_EXPERIENCE_GAIN);
      } else {
        let wTempString: string /* CHAR16[128] */;

        // tell player about it
        wTempString = BuildStatChangeString(pSoldier.name, fChangeTypeIncrease, sPtsChanged, ubStat);
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, wTempString);
      }

      // update mapscreen soldier info panel
      fCharacterInfoPanelDirty = true;

      // remember what time it changed at, it's displayed in a different color for a while afterwards
      pSoldier[puiStatTimerPtr] = GetJA2Clock();

      if (fChangeTypeIncrease) {
        pSoldier.usValueGoneUp |= usIncreaseValue;
      } else {
        pSoldier.usValueGoneUp &= ~(usIncreaseValue);
      }

      fInterfacePanelDirty = DIRTYLEVEL2;
    }

    // special handling for LIFEMAX
    if (ubStat == HEALTHAMT) {
      // adjust current health by the same amount as max health
      pProfile.bLife += sPtsChanged;

      // don't let this kill a guy or knock him out!!!
      if (pProfile.bLife < OKLIFE) {
        pProfile.bLife = OKLIFE;
      }

      // if the guy is employed by player
      if (pSoldier != null) {
        // adjust current health by the same amount as max health
        pSoldier.bLife += sPtsChanged;

        // don't let this kill a guy or knock him out!!!
        if (pSoldier.bLife < OKLIFE) {
          pSoldier.bLife = OKLIFE;
        }
      }
    }

    // special handling for EXPERIENCE LEVEL
    // merc salaries increase if level goes up (but they don't go down if level drops!)
    if ((ubStat == EXPERAMT) && fChangeTypeIncrease) {
      // if the guy is employed by player
      if (pSoldier != null) {
        switch (pSoldier.ubWhatKindOfMercAmI) {
          case Enum260.MERC_TYPE__AIM_MERC:
            // A.I.M.
            pSoldier.fContractPriceHasIncreased = true;
            fChangeSalary = true;
            break;

          case Enum260.MERC_TYPE__MERC:
            // M.E.R.C.
            ubMercMercIdValue = pSoldier.ubProfile;

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
          pProfile.sSalary = CalcNewSalary(pProfile.sSalary, fChangeTypeIncrease, MAX_DAILY_SALARY);
          pProfile.uiWeeklySalary = CalcNewSalary(pProfile.uiWeeklySalary, fChangeTypeIncrease, MAX_LARGE_SALARY);
          pProfile.uiBiWeeklySalary = CalcNewSalary(pProfile.uiBiWeeklySalary, fChangeTypeIncrease, MAX_LARGE_SALARY);
          pProfile.sTrueSalary = CalcNewSalary(pProfile.sTrueSalary, fChangeTypeIncrease, MAX_DAILY_SALARY);
          pProfile.sMedicalDepositAmount = CalcNewSalary(pProfile.sMedicalDepositAmount, fChangeTypeIncrease, MAX_DAILY_SALARY);

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
function ProcessUpdateStats(pProfile: MERCPROFILESTRUCT, pSoldier: SOLDIERTYPE | null): void {
  // this function will run through the soldier's profile and update their stats based on any accumulated gain pts.
  let ubStat: UINT8 = 0;
  let psStatGainPtr: StatGainKey;
  let pbStatPtr: StatKey;
  let pbSoldierStatPtr: StatKey;
  let pbStatDeltaPtr: StatDeltaKey;
  let bMinStatValue: INT8;
  let bMaxStatValue: INT8;
  let usSubpointsPerPoint: UINT16;
  let sPtsChanged: INT16;

  // if hired, not back at AIM
  if (pSoldier != null) {
    // ATE: if in the midst of an attack, if in the field, delay all stat changes until the check made after the 'attack'...
    if ((gTacticalStatus.ubAttackBusyCount > 0) && pSoldier.bInSector && (gTacticalStatus.uiFlags & INCOMBAT))
      return;

    // ignore non-player soldiers
    if (!PTR_OURTEAM(pSoldier))
      return;

    // ignore anything without a profile
    if (pSoldier.ubProfile == NO_PROFILE)
      return;

    // ignore vehicles and robots
    if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.uiStatusFlags & SOLDIER_ROBOT))
      return;

    // delay increases while merc is dying
    if (pSoldier.bLife < OKLIFE)
      return;

    // ignore POWs - shouldn't ever be getting this far
    if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
      return;
    }
  } else {
    // dead guys don't do nuthin' !
    if (pProfile.bMercStatus == MERC_IS_DEAD)
      return;

    if (pProfile.bLife < OKLIFE)
      return;
  }

  // check every attribute, skill, and exp.level, too
  for (ubStat = FIRST_CHANGEABLE_STAT; ubStat <= LAST_CHANGEABLE_STAT; ubStat++) {
    // set default min & max, subpoints/pt.
    bMinStatValue = 1;
    bMaxStatValue = MAX_STAT_VALUE;
    usSubpointsPerPoint = SubpointsPerPoint(ubStat, pProfile.bExpLevel);

    // build ptrs to appropriate profiletype stat fields
    switch (ubStat) {
      case HEALTHAMT:
        psStatGainPtr = 'sLifeGain';
        pbStatPtr = 'bLifeMax';

        bMinStatValue = OKLIFE;
        break;

      case AGILAMT:
        psStatGainPtr = 'sAgilityGain';
        pbStatPtr = 'bAgility';
        break;

      case DEXTAMT:
        psStatGainPtr = 'sDexterityGain';
        pbStatPtr = 'bDexterity';
        break;

      case WISDOMAMT:
        psStatGainPtr = 'sWisdomGain';
        pbStatPtr = 'bWisdom';
        break;

      case MEDICALAMT:
        psStatGainPtr = 'sMedicalGain';
        pbStatPtr = 'bMedical';

        bMinStatValue = 0;
        break;

      case EXPLODEAMT:
        psStatGainPtr = 'sExplosivesGain';
        pbStatPtr = 'bExplosive';

        bMinStatValue = 0;
        break;

      case MECHANAMT:
        psStatGainPtr = 'sMechanicGain';
        pbStatPtr = 'bMechanical';

        bMinStatValue = 0;
        break;

      case MARKAMT:
        psStatGainPtr = 'sMarksmanshipGain';
        pbStatPtr = 'bMarksmanship';

        bMinStatValue = 0;
        break;

      case EXPERAMT:
        psStatGainPtr = 'sExpLevelGain';
        pbStatPtr = 'bExpLevel';

        bMaxStatValue = MAXEXPLEVEL;
        break;

      case STRAMT:
        psStatGainPtr = 'sStrengthGain';
        pbStatPtr = 'bStrength';
        break;

      case LDRAMT:
        psStatGainPtr = 'sLeadershipGain';
        pbStatPtr = 'bLeadership';
        break;

      default:
        throw new Error('Should be unreachable');
    }

    // if this merc is currently on the player's team
    if (pSoldier != null) {
      // build ptrs to appropriate soldiertype stat fields
      switch (ubStat) {
        case HEALTHAMT:
          pbSoldierStatPtr = 'bLifeMax';
          break;

        case AGILAMT:
          pbSoldierStatPtr = 'bAgility';
          break;

        case DEXTAMT:
          pbSoldierStatPtr = 'bDexterity';
          break;

        case WISDOMAMT:
          pbSoldierStatPtr = 'bWisdom';
          break;

        case MEDICALAMT:
          pbSoldierStatPtr = 'bMedical';
          break;

        case EXPLODEAMT:
          pbSoldierStatPtr = 'bExplosive';
          break;

        case MECHANAMT:
          pbSoldierStatPtr = 'bMechanical';
          break;

        case MARKAMT:
          pbSoldierStatPtr = 'bMarksmanship';
          break;

        case EXPERAMT:
          pbSoldierStatPtr = 'bExpLevel';
          break;

        case STRAMT:
          pbSoldierStatPtr = 'bStrength';
          break;

        case LDRAMT:
          pbSoldierStatPtr = 'bLeadership';
          break;

        default:
          throw new Error('Should be unreachable');
      }
    }

    // ptrs set up, now handle

    // Calc how many full points worth of stat changes we have accumulated in this stat (positive OR negative!)
    // NOTE: for simplicity, this hopes nobody will go up more than one level at once, which would change the subpoints/pt
    sPtsChanged = Math.trunc((pProfile[psStatGainPtr]) / usSubpointsPerPoint);

    // gone too high or too low?..handle the fact
    if ((pProfile[pbStatPtr] + sPtsChanged) > bMaxStatValue) {
      // reduce change to reach max value and reset stat gain ptr
      sPtsChanged = bMaxStatValue - pProfile[pbStatPtr];
      pProfile[psStatGainPtr] = 0;
    } else if ((pProfile[pbStatPtr] + sPtsChanged) < bMinStatValue) {
      // reduce change to reach min value and reset stat gain ptr
      sPtsChanged = bMinStatValue - pProfile[pbStatPtr];
      pProfile[psStatGainPtr] = 0;
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
  let pSoldier: SOLDIERTYPE;

  // must check everyone on player's team, not just the shooter
  for (cnt = 0, pSoldier = MercPtrs[0]; cnt <= gTacticalStatus.Team[MercPtrs[0].bTeam].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive) {
      ProcessUpdateStats(gMercProfiles[pSoldier.ubProfile], pSoldier);
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
    uiNewSalary = Math.trunc(uiOldSalary / SALARY_CHANGE_PER_LEVEL);
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
    uiSalary = Math.trunc((uiSalary + Math.trunc(uiMultiple / 2)) / uiMultiple) * uiMultiple;
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
export function HandleUnhiredMercImprovement(pProfile: MERCPROFILESTRUCT): void {
  let ubNumStats: UINT8;
  let ubStat: UINT8;
  let usNumChances: UINT16;

  ubNumStats = LAST_CHANGEABLE_STAT - FIRST_CHANGEABLE_STAT + 1;

  // if he's working on another job
  if (pProfile.bMercStatus == MERC_WORKING_ELSEWHERE) {
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
    usNumChances = Math.trunc(pProfile.bWisdom / 10);
    for (ubStat = FIRST_CHANGEABLE_STAT; ubStat <= LAST_CHANGEABLE_STAT; ubStat++) {
      ProfileStatChange(pProfile, ubStat, usNumChances, FROM_SUCCESS);
    }
  } else {
    // if the merc just takes it easy (high level or stupid mercs are more likely to)
    if ((Random(10) < pProfile.bExpLevel) || (Random(100) > pProfile.bWisdom)) {
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
    ProfileStatChange(pProfile, ubStat, Math.trunc(pProfile.bWisdom / 2), FROM_TRAINING);
  }

  ProfileUpdateStats(pProfile);
}

// handles possible death of mercs not currently working for the player
export function HandleUnhiredMercDeaths(iProfileID: INT32): void {
  let ubMaxDeaths: UINT8;
  let sChance: INT16;
  let pProfile: MERCPROFILESTRUCT = gMercProfiles[iProfileID];

  // if the player has never yet had the chance to hire this merc
  if (!(pProfile.ubMiscFlags3 & PROFILE_MISC_FLAG3_PLAYER_HAD_CHANCE_TO_HIRE)) {
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
  sChance = 10 - pProfile.bExpLevel;

  switch (pProfile.bPersonalityTrait) {
    case Enum270.FORGETFUL:
    case Enum270.NERVOUS:
    case Enum270.PSYCHO:
      // these guys are somewhat more likely to get killed (they have "problems")
      sChance += 2;
      break;
  }

  // stealthy guys are slightly less likely to get killed (they're careful)
  if (pProfile.bSkillTrait == Enum269.STEALTHY) {
    sChance -= 1;
  }
  if (pProfile.bSkillTrait2 == Enum269.STEALTHY) {
    sChance -= 1;
  }

  if (PreRandom(1000) < sChance) {
    // this merc gets Killed In Action!!!
    pProfile.bMercStatus = MERC_IS_DEAD;
    pProfile.uiDayBecomesAvailable = 0;

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
    ubCurrentProgress = Math.trunc((uiCurrentIncome * PROGRESS_PORTION_INCOME) / uiPossibleIncome);
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

  usKillsProgress = Math.trunc(gStrategicStatus.usPlayerKills / ubKillsPerPoint);
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
  let pSoldier: SOLDIERTYPE;

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
  for (ubGuynum = gTacticalStatus.Team[gbPlayerNum].bFirstID, pSoldier = MercPtrs[ubGuynum]; ubGuynum <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubGuynum++, pSoldier = MercPtrs[ubGuynum]) {
    if (pSoldier.bActive && pSoldier.bInSector && IsMercOnCurrentSquad(pSoldier) && (pSoldier.bLife >= CONSCIOUSNESS) && !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier)) {
      StatChange(pSoldier, EXPERAMT, usXPs, FROM_SUCCESS);
    }
  }
}

export function BuildStatChangeString(wName: string /* STR16 */, fIncrease: boolean, sPtsChanged: INT16, ubStat: UINT8): string {
  let wString: string;

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

  wString = swprintf("%s %s %d %s %s", wName, sPreStatBuildString[fIncrease ? 1 : 0], Math.abs(sPtsChanged), sPreStatBuildString[ubStringIndex], sStatGainStrings[ubStat - FIRST_CHANGEABLE_STAT]);

  return wString;
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
