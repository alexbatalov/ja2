function EffectiveStrength(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let bBandaged: INT8;
  let iEffStrength: INT32;

  // Effective strength is:
  // 1/2 full strength
  // plus 1/2 strength scaled according to how hurt we are
  bBandaged = pSoldier.value.bLifeMax - pSoldier.value.bLife - pSoldier.value.bBleeding;
  iEffStrength = pSoldier.value.bStrength / 2;
  iEffStrength += (pSoldier.value.bStrength / 2) * (pSoldier.value.bLife + bBandaged / 2) / (pSoldier.value.bLifeMax);

  // ATE: Make sure at least 2...
  iEffStrength = __max(iEffStrength, 2);

  return iEffStrength;
}

function EffectiveWisdom(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffWisdom: INT32;

  iEffWisdom = pSoldier.value.bWisdom;

  iEffWisdom = EffectStatForBeingDrunk(pSoldier, iEffWisdom);

  return iEffWisdom;
}

function EffectiveAgility(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffAgility: INT32;

  iEffAgility = pSoldier.value.bAgility;

  iEffAgility = EffectStatForBeingDrunk(pSoldier, iEffAgility);

  if (pSoldier.value.sWeightCarriedAtTurnStart > 100) {
    iEffAgility = (iEffAgility * 100) / pSoldier.value.sWeightCarriedAtTurnStart;
  }

  return iEffAgility;
}

function EffectiveMechanical(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffMechanical: INT32;

  iEffMechanical = pSoldier.value.bMechanical;

  iEffMechanical = EffectStatForBeingDrunk(pSoldier, iEffMechanical);

  return iEffMechanical;
}

function EffectiveExplosive(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffExplosive: INT32;

  iEffExplosive = pSoldier.value.bExplosive;

  iEffExplosive = EffectStatForBeingDrunk(pSoldier, iEffExplosive);

  return iEffExplosive;
}

function EffectiveMedical(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffMedical: INT32;

  iEffMedical = pSoldier.value.bMedical;

  iEffMedical = EffectStatForBeingDrunk(pSoldier, iEffMedical);

  return iEffMedical;
}

function EffectiveLeadership(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffLeadership: INT32;
  let bDrunkLevel: INT8;

  iEffLeadership = pSoldier.value.bLeadership;

  // if we are drunk, effect leader ship in a +ve way...
  bDrunkLevel = GetDrunkLevel(pSoldier);

  if (bDrunkLevel == FEELING_GOOD) {
    iEffLeadership = (iEffLeadership * 120 / 100);
  }

  return iEffLeadership;
}

function EffectiveExpLevel(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffExpLevel: INT32;
  let bDrunkLevel: INT8;
  let iExpModifier: INT32[] /* [] */ = [
    0, // SOBER
    0, // Feeling good
    -1, // Borderline
    -2, // Drunk
    0, // Hung
  ];

  iEffExpLevel = pSoldier.value.bExpLevel;

  bDrunkLevel = GetDrunkLevel(pSoldier);

  iEffExpLevel = iEffExpLevel + iExpModifier[bDrunkLevel];

  if (pSoldier.value.ubProfile != NO_PROFILE) {
    if ((gMercProfiles[pSoldier.value.ubProfile].bPersonalityTrait == CLAUSTROPHOBIC) && pSoldier.value.bActive && pSoldier.value.bInSector && gbWorldSectorZ > 0) {
      // claustrophobic!
      iEffExpLevel--;
    }
  }

  if (iEffExpLevel < 1) {
    // can't go below 1
    return 1;
  } else {
    return iEffExpLevel;
  }
}

function EffectiveMarksmanship(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffMarksmanship: INT32;

  iEffMarksmanship = pSoldier.value.bMarksmanship;

  iEffMarksmanship = EffectStatForBeingDrunk(pSoldier, iEffMarksmanship);

  return iEffMarksmanship;
}

function EffectiveDexterity(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iEffDexterity: INT32;

  iEffDexterity = pSoldier.value.bDexterity;

  iEffDexterity = EffectStatForBeingDrunk(pSoldier, iEffDexterity);

  return iEffDexterity;
}

function GetPenaltyForFatigue(pSoldier: Pointer<SOLDIERTYPE>): UINT8 {
  let ubPercentPenalty: UINT8;

  if (pSoldier.value.bBreathMax >= 85)
    ubPercentPenalty = 0;
  else if (pSoldier.value.bBreathMax >= 70)
    ubPercentPenalty = 10;
  else if (pSoldier.value.bBreathMax >= 50)
    ubPercentPenalty = 25;
  else if (pSoldier.value.bBreathMax >= 30)
    ubPercentPenalty = 50;
  else if (pSoldier.value.bBreathMax >= 15)
    ubPercentPenalty = 75;
  else if (pSoldier.value.bBreathMax > 0)
    ubPercentPenalty = 90;
  else
    ubPercentPenalty = 100;

  return ubPercentPenalty;
}

function ReducePointsForFatigue(pSoldier: Pointer<SOLDIERTYPE>, pusPoints: Pointer<UINT16>): void {
  pusPoints.value -= (pusPoints.value * GetPenaltyForFatigue(pSoldier)) / 100;
}

function GetSkillCheckPenaltyForFatigue(pSoldier: Pointer<SOLDIERTYPE>, iSkill: INT32): INT32 {
  // use only half the full effect of fatigue for skill checks
  return ((iSkill * GetPenaltyForFatigue(pSoldier)) / 100) / 2;
}

function SkillCheck(pSoldier: Pointer<SOLDIERTYPE>, bReason: INT8, bChanceMod: INT8): INT32 {
  let iSkill: INT32;
  let iChance: INT32;
  let iReportChance: INT32;
  let iRoll: INT32;
  let iMadeItBy: INT32;
  let bSlot: INT8;
  let iLoop: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let bBuddyIndex: INT8;
  let fForceDamnSound: BOOLEAN = FALSE;

  iReportChance = -1;

  switch (bReason) {
    case LOCKPICKING_CHECK:
    case ELECTRONIC_LOCKPICKING_CHECK:

      fForceDamnSound = TRUE;

      iSkill = EffectiveMechanical(pSoldier);
      if (iSkill == 0) {
        break;
      }
      // adjust skill based on wisdom (knowledge)
      iSkill = iSkill * (EffectiveWisdom(pSoldier) + 100) / 200;
      // and dexterity (clumsy?)
      iSkill = iSkill * (EffectiveDexterity(pSoldier) + 100) / 200;
      // factor in experience
      iSkill = iSkill + EffectiveExpLevel(pSoldier) * 3;
      if (HAS_SKILL_TRAIT(pSoldier, LOCKPICKING)) {
        // if we specialize in picking locks...
        iSkill += gbSkillTraitBonus[LOCKPICKING] * NUM_SKILL_TRAITS(pSoldier, LOCKPICKING);
      }
      if (bReason == ELECTRONIC_LOCKPICKING_CHECK && !(HAS_SKILL_TRAIT(pSoldier, ELECTRONICS))) {
        // if we are unfamiliar with electronics...
        iSkill /= 2;
      }
      // adjust chance based on status of kit
      bSlot = FindObj(pSoldier, LOCKSMITHKIT);
      if (bSlot == NO_SLOT) {
        // this should never happen, but might as well check...
        iSkill = 0;
      }
      iSkill = iSkill * pSoldier.value.inv[bSlot].bStatus[0] / 100;
      break;
    case ATTACHING_DETONATOR_CHECK:
    case ATTACHING_REMOTE_DETONATOR_CHECK:
      iSkill = EffectiveExplosive(pSoldier);
      if (iSkill == 0) {
        break;
      }
      iSkill = (iSkill * 3 + EffectiveDexterity(pSoldier)) / 4;
      if (bReason == ATTACHING_REMOTE_DETONATOR_CHECK && !(HAS_SKILL_TRAIT(pSoldier, ELECTRONICS))) {
        iSkill /= 2;
      }
      break;
    case PLANTING_BOMB_CHECK:
    case PLANTING_REMOTE_BOMB_CHECK:
      iSkill = EffectiveExplosive(pSoldier) * 7;
      iSkill += EffectiveWisdom(pSoldier) * 2;
      iSkill += EffectiveExpLevel(pSoldier) * 10;
      iSkill = iSkill / 10; // bring the value down to a percentage

      if (bReason == PLANTING_REMOTE_BOMB_CHECK && !(HAS_SKILL_TRAIT(pSoldier, ELECTRONICS))) {
        // deduct only a bit...
        iSkill = (iSkill * 3) / 4;
      }

      // Ok, this is really damn easy, so skew the values...
      // e.g. if calculated skill is 84, skewed up to 96
      // 51 to 84
      // 22 stays as is
      iSkill = (iSkill + 100 * (iSkill / 25)) / (iSkill / 25 + 1);
      break;

    case DISARM_TRAP_CHECK:

      fForceDamnSound = TRUE;

      iSkill = EffectiveExplosive(pSoldier) * 7;
      if (iSkill == 0) {
        break;
      }
      iSkill += EffectiveDexterity(pSoldier) * 2;
      iSkill += EffectiveExpLevel(pSoldier) * 10;
      iSkill = iSkill / 10; // bring the value down to a percentage
      // penalty based on poor wisdom
      iSkill -= (100 - EffectiveWisdom(pSoldier)) / 5;
      break;

    case DISARM_ELECTRONIC_TRAP_CHECK:

      fForceDamnSound = TRUE;

      iSkill = __max(EffectiveMechanical(pSoldier), EffectiveExplosive(pSoldier)) * 7;
      if (iSkill == 0) {
        break;
      }
      iSkill += EffectiveDexterity(pSoldier) * 2;
      iSkill += EffectiveExpLevel(pSoldier) * 10;
      iSkill = iSkill / 10; // bring the value down to a percentage
      // penalty based on poor wisdom
      iSkill -= (100 - EffectiveWisdom(pSoldier)) / 5;

      if (!(HAS_SKILL_TRAIT(pSoldier, ELECTRONICS))) {
        iSkill = (iSkill * 3) / 4;
      }
      break;

    case OPEN_WITH_CROWBAR:
      // Add for crowbar...
      iSkill = EffectiveStrength(pSoldier) + 20;
      fForceDamnSound = TRUE;
      break;

    case SMASH_DOOR_CHECK:
      iSkill = EffectiveStrength(pSoldier);
      break;
    case UNJAM_GUN_CHECK:
      iSkill = 30 + EffectiveMechanical(pSoldier) / 2;
      break;
    case NOTICE_DART_CHECK:
      // only a max of ~20% chance
      iSkill = EffectiveWisdom(pSoldier) / 10 + EffectiveExpLevel(pSoldier);
      break;
    case LIE_TO_QUEEN_CHECK:
      // competitive check vs the queen's wisdom and leadership... poor guy!
      iSkill = 50 * (EffectiveWisdom(pSoldier) + EffectiveLeadership(pSoldier)) / (gMercProfiles[QUEEN].bWisdom + gMercProfiles[QUEEN].bLeadership);
      break;
    case ATTACHING_SPECIAL_ITEM_CHECK:
    case ATTACHING_SPECIAL_ELECTRONIC_ITEM_CHECK:
      iSkill = EffectiveMechanical(pSoldier);
      if (iSkill == 0) {
        break;
      }
      // adjust skill based on wisdom (knowledge)
      iSkill = iSkill * (EffectiveWisdom(pSoldier) + 100) / 200;
      // and dexterity (clumsy?)
      iSkill = iSkill * (EffectiveDexterity(pSoldier) + 100) / 200;
      // factor in experience
      iSkill = iSkill + EffectiveExpLevel(pSoldier) * 3;
      if (bReason == ATTACHING_SPECIAL_ELECTRONIC_ITEM_CHECK && !(HAS_SKILL_TRAIT(pSoldier, ELECTRONICS))) {
        // if we are unfamiliar with electronics...
        iSkill /= 2;
      }
      break;
    default:
      iSkill = 0;
      break;
  }

  iSkill -= GetSkillCheckPenaltyForFatigue(pSoldier, iSkill);

  iChance = iSkill + bChanceMod;

  switch (bReason) {
    case LOCKPICKING_CHECK:
    case ELECTRONIC_LOCKPICKING_CHECK:
    case DISARM_TRAP_CHECK:
    case DISARM_ELECTRONIC_TRAP_CHECK:
    case OPEN_WITH_CROWBAR:
    case SMASH_DOOR_CHECK:
    case ATTACHING_SPECIAL_ITEM_CHECK:
    case ATTACHING_SPECIAL_ELECTRONIC_ITEM_CHECK:
      // for lockpicking and smashing locks, if the chance isn't reasonable
      // we set it to 0 so they can never get through the door if they aren't
      // good enough
      if (iChance < 30) {
        iChance = 0;
        break;
      }
      // else fall through
    default:
      iChance += GetMoraleModifier(pSoldier);
      break;
  }

  if (iChance > 99) {
    iChance = 99;
  } else if (iChance < 0) {
    iChance = 0;
  }

  iRoll = PreRandom(100);
  iMadeItBy = iChance - iRoll;
  if (iMadeItBy < 0) {
    if ((pSoldier.value.bLastSkillCheck == bReason) && (pSoldier.value.sGridNo == pSoldier.value.sSkillCheckGridNo)) {
      pSoldier.value.ubSkillCheckAttempts++;
      if (pSoldier.value.ubSkillCheckAttempts > 2) {
        if (iChance == 0) {
          // do we realize that we just can't do this?
          if ((100 - (pSoldier.value.ubSkillCheckAttempts - 2) * 20) < EffectiveWisdom(pSoldier)) {
            // say "I can't do this" quote
            TacticalCharacterDialogue(pSoldier, QUOTE_DEFINITE_CANT_DO);
            return iMadeItBy;
          }
        }
      }
    } else {
      pSoldier.value.bLastSkillCheck = bReason;
      pSoldier.value.ubSkillCheckAttempts = 1;
      pSoldier.value.sSkillCheckGridNo = pSoldier.value.sGridNo;
    }

    if (fForceDamnSound || Random(100) < 40) {
      switch (bReason) {
        case UNJAM_GUN_CHECK:
        case NOTICE_DART_CHECK:
        case LIE_TO_QUEEN_CHECK:
          // silent check
          break;
        default:
          DoMercBattleSound(pSoldier, BATTLE_SOUND_CURSE1);
          break;
      }
    }
  } else {
    // A buddy might make a positive comment based on our success;
    // Increase the chance for people with higher skill and for more difficult tasks
    iChance = 15 + iSkill / 20 + (-bChanceMod) / 20;
    if (iRoll < iChance) {
      // If a buddy of this merc is standing around nearby, they'll make a positive comment.
      iLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[iLoop]; iLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; iLoop++, pTeamSoldier++) {
        if (OK_INSECTOR_MERC(pTeamSoldier)) {
          bBuddyIndex = WhichBuddy(pTeamSoldier.value.ubProfile, pSoldier.value.ubProfile);
          if (bBuddyIndex >= 0 && SpacesAway(pSoldier.value.sGridNo, pTeamSoldier.value.sGridNo) < 15) {
            switch (bBuddyIndex) {
              case 0:
                // buddy #1 did something good!
                TacticalCharacterDialogue(pTeamSoldier, QUOTE_BUDDY_1_GOOD);
                break;
              case 1:
                // buddy #2 did something good!
                TacticalCharacterDialogue(pTeamSoldier, QUOTE_BUDDY_2_GOOD);
                break;
              case 2:
                // learn to like buddy did something good!
                TacticalCharacterDialogue(pTeamSoldier, QUOTE_LEARNED_TO_LIKE_WITNESSED);
                break;
              default:
                break;
            }
          }
        }
      }
    }
  }
  return iMadeItBy;
}

function CalcTrapDetectLevel(pSoldier: Pointer<SOLDIERTYPE>, fExamining: BOOLEAN): INT8 {
  // return the level of trap which the guy is able to detect

  let bDetectLevel: INT8;

  // formula: 1 pt for every exp_level
  //     plus 1 pt for every 40 explosives
  //     less 1 pt for every 20 wisdom MISSING

  bDetectLevel = EffectiveExpLevel(pSoldier);
  bDetectLevel += (EffectiveExplosive(pSoldier) / 40);
  bDetectLevel -= ((100 - EffectiveWisdom(pSoldier)) / 20);

  // if the examining flag is true, this isn't just a casual glance
  // and the merc should have a higher chance
  if (fExamining) {
    bDetectLevel += PreRandom(bDetectLevel / 3 + 2);
  }

  // if substantially bleeding, or still in serious shock, randomly lower value
  if ((pSoldier.value.bBleeding > 20) || (pSoldier.value.bShock > 1)) {
    bDetectLevel -= PreRandom(3);
  }

  if (bDetectLevel < 1) {
    bDetectLevel = 1;
  }

  return bDetectLevel;
}
