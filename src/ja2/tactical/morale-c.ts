namespace ja2 {

const MORALE_MOD_MAX = 50; // morale *mod* range is -50 to 50, if you change this, check the decay formulas!

const DRUG_EFFECT_MORALE_MOD = 150;
const ALCOHOL_EFFECT_MORALE_MOD = 160;

const HOURS_BETWEEN_STRATEGIC_DECAY = 3;

const PHOBIC_LIMIT = -20;

// macros
const SOLDIER_IN_SECTOR = (pSoldier: SOLDIERTYPE, sX: number, sY: number, bZ: number) => (!pSoldier.fBetweenSectors && (pSoldier.sSectorX == sX) && (pSoldier.sSectorY == sY) && (pSoldier.bSectorZ == bZ));

let gbMoraleEvent: MoraleEvent[] /* [NUM_MORALE_EVENTS] */ = [
  // TACTICAL = Short Term Effect, STRATEGIC = Long Term Effect
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, +4), //	MORALE_KILLED_ENEMY
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -5), //	MORALE_SQUADMATE_DIED,		// in same sector (not really squad)... IN ADDITION to strategic loss of morale
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -1), //	MORALE_SUPPRESSED,				// up to 4 times per turn
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -2), //	MORALE_AIRSTRIKE,
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, +2), //	MORALE_DID_LOTS_OF_DAMAGE,
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -3), //	MORALE_TOOK_LOTS_OF_DAMAGE,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -5), //	MORALE_KILLED_CIVILIAN,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +4), //	MORALE_BATTLE_WON,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -5), //	MORALE_RAN_AWAY,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +2), //	MORALE_HEARD_BATTLE_WON,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -2), //	MORALE_HEARD_BATTLE_LOST,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +5), //	MORALE_TOWN_LIBERATED,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -5), //	MORALE_TOWN_LOST,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +8), //	MORALE_MINE_LIBERATED,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -8), //	MORALE_MINE_LOST,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +3), //	MORALE_SAM_SITE_LIBERATED,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -3), //	MORALE_SAM_SITE_LOST,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -15), //	MORALE_BUDDY_DIED,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +5), //	MORALE_HATED_DIED,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -5), //	MORALE_TEAMMATE_DIED,			// not in same sector
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +5), //	MORALE_LOW_DEATHRATE,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -5), //	MORALE_HIGH_DEATHRATE,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +2), //	MORALE_GREAT_MORALE,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -2), //	MORALE_POOR_MORALE,
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -10), //  MORALE_DRUGS_CRASH
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -10), //  MORALE_ALCOHOL_CRASH
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +15), //  MORALE_MONSTER_QUEEN_KILLED
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +25), //  MORALE_DEIDRANNA_KILLED
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -1), //	MORALE_CLAUSTROPHOBE_UNDERGROUND,
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -5), //	MORALE_INSECT_PHOBIC_SEES_CREATURE,
  createMoraleEventFrom(Enum235.TACTICAL_MORALE_EVENT, -1), //	MORALE_NERVOUS_ALONE,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -5), //	MORALE_MERC_CAPTURED,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, -5), //	MORALE_MERC_MARRIED,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +8), //	MORALE_QUEEN_BATTLE_WON,
  createMoraleEventFrom(Enum235.STRATEGIC_MORALE_EVENT, +5), //  MORALE_SEX,
];

let gfSomeoneSaidMoraleQuote: boolean = false;

export function GetMoraleModifier(pSoldier: SOLDIERTYPE): INT8 {
  if (pSoldier.uiStatusFlags & SOLDIER_PC) {
    if (pSoldier.bMorale > 50) {
      // give +1 at 55, +3 at 65, up to +5 at 95 and above
      return Math.trunc((pSoldier.bMorale - 45) / 10);
    } else {
      // give penalties down to -20 at 0 (-2 at 45, -4 by 40...)
      return Math.trunc((pSoldier.bMorale - 50) * 2 / 5);
    }
  } else {
    // use AI morale
    switch (pSoldier.bAIMorale) {
      case Enum244.MORALE_HOPELESS:
        return -15;
      case Enum244.MORALE_WORRIED:
        return -7;
      case Enum244.MORALE_CONFIDENT:
        return 2;
      case Enum244.MORALE_FEARLESS:
        return 5;
      default:
        return 0;
    }
  }
}

function DecayTacticalMorale(pSoldier: SOLDIERTYPE): void {
  // decay the tactical morale modifier
  if (pSoldier.bTacticalMoraleMod != 0) {
    // decay the modifier!
    if (pSoldier.bTacticalMoraleMod > 0) {
      pSoldier.bTacticalMoraleMod = Math.max(0, pSoldier.bTacticalMoraleMod - (8 - Math.trunc(pSoldier.bTacticalMoraleMod / 10)));
    } else {
      pSoldier.bTacticalMoraleMod = Math.min(0, pSoldier.bTacticalMoraleMod + (6 + Math.trunc(pSoldier.bTacticalMoraleMod / 10)));
    }
  }
}

function DecayStrategicMorale(pSoldier: SOLDIERTYPE): void {
  // decay the modifier!
  if (pSoldier.bStrategicMoraleMod > 0) {
    pSoldier.bStrategicMoraleMod = Math.max(0, pSoldier.bStrategicMoraleMod - (8 - Math.trunc(pSoldier.bStrategicMoraleMod / 10)));
  } else {
    pSoldier.bStrategicMoraleMod = Math.min(0, pSoldier.bStrategicMoraleMod + (6 + Math.trunc(pSoldier.bStrategicMoraleMod / 10)));
  }
}

export function DecayTacticalMoraleModifiers(): void {
  let pSoldier: SOLDIERTYPE;
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let fHandleNervous: boolean;

  ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pSoldier = MercPtrs[ubLoop]) {
    // if the merc is active, in Arulco
    // CJC: decay modifiers while asleep! or POW!
    if (pSoldier.bActive && pSoldier.ubProfile != NO_PROFILE && !(pSoldier.bAssignment == Enum117.IN_TRANSIT || pSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD)) {
      // only let morale mod decay if it is positive while merc is a POW
      if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW && pSoldier.bTacticalMoraleMod < 0) {
        continue;
      }

      switch (gMercProfiles[pSoldier.ubProfile].bPersonalityTrait) {
        case Enum270.CLAUSTROPHOBIC:
          if (pSoldier.bSectorZ > 0) {
            // underground, no recovery... in fact, if tact morale is high, decay
            if (pSoldier.bTacticalMoraleMod > PHOBIC_LIMIT) {
              HandleMoraleEvent(pSoldier, Enum234.MORALE_CLAUSTROPHOBE_UNDERGROUND, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
            }
            continue;
          }
          break;
        case Enum270.NERVOUS:
          if (pSoldier.bMorale < 50) {
            if (pSoldier.ubGroupID != 0 && PlayerIDGroupInMotion(pSoldier.ubGroupID)) {
              if (NumberOfPeopleInSquad(pSoldier.bAssignment) == 1) {
                fHandleNervous = true;
              } else {
                fHandleNervous = false;
              }
            } else if (pSoldier.bActive && pSoldier.bInSector) {
              if (DistanceToClosestFriend(pSoldier) > NERVOUS_RADIUS) {
                fHandleNervous = true;
              } else {
                fHandleNervous = false;
              }
            } else {
              // look for anyone else in same sector
              fHandleNervous = true;
              for (ubLoop2 = gTacticalStatus.Team[gbPlayerNum].bFirstID; ubLoop2 <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop2++) {
                if (MercPtrs[ubLoop2] != pSoldier && MercPtrs[ubLoop2].bActive && MercPtrs[ubLoop2].sSectorX == pSoldier.sSectorX && MercPtrs[ubLoop2].sSectorY == pSoldier.sSectorY && MercPtrs[ubLoop2].bSectorZ == pSoldier.bSectorZ) {
                  // found someone!
                  fHandleNervous = false;
                  break;
                }
              }
            }

            if (fHandleNervous) {
              if (pSoldier.bTacticalMoraleMod == PHOBIC_LIMIT) {
                // don't change morale
                continue;
              }

              // alone, no recovery... in fact, if tact morale is high, decay
              if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
                pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
              }
              HandleMoraleEvent(pSoldier, Enum234.MORALE_NERVOUS_ALONE, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
              continue;
            }
          }
      }

      DecayTacticalMorale(pSoldier);
      RefreshSoldierMorale(pSoldier);
    }
  }
}

function DecayStrategicMoraleModifiers(): void {
  let pSoldier: SOLDIERTYPE;
  let ubLoop: UINT8;

  ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pSoldier = MercPtrs[ubLoop]) {
    // if the merc is active, in Arulco
    // CJC: decay modifiers while asleep! or POW!
    if (pSoldier.bActive && pSoldier.ubProfile != NO_PROFILE && !(pSoldier.bAssignment == Enum117.IN_TRANSIT || pSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD)) {
      // only let morale mod decay if it is positive while merc is a POW
      if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW && pSoldier.bStrategicMoraleMod < 0) {
        continue;
      }

      DecayStrategicMorale(pSoldier);
      RefreshSoldierMorale(pSoldier);
    }
  }
}

export function RefreshSoldierMorale(pSoldier: SOLDIERTYPE): void {
  let iActualMorale: INT32;

  if (pSoldier.fMercAsleep) {
    // delay this till later!
    return;
  }

  // CJC, April 19, 1999: added up to 20% morale boost according to progress
  iActualMorale = DEFAULT_MORALE + pSoldier.bTeamMoraleMod + pSoldier.bTacticalMoraleMod + pSoldier.bStrategicMoraleMod + (CurrentPlayerProgressPercentage() / 5);

  // ATE: Modify morale based on drugs....
  iActualMorale += Math.trunc((pSoldier.bDrugEffect[DRUG_TYPE_ADRENALINE] * DRUG_EFFECT_MORALE_MOD) / 100);
  iActualMorale += Math.trunc((pSoldier.bDrugEffect[DRUG_TYPE_ALCOHOL] * ALCOHOL_EFFECT_MORALE_MOD) / 100);

  iActualMorale = Math.min(100, iActualMorale);
  iActualMorale = Math.max(0, iActualMorale);
  pSoldier.bMorale = iActualMorale;

  // update mapscreen as needed
  fCharacterInfoPanelDirty = true;
}

function UpdateSoldierMorale(pSoldier: SOLDIERTYPE, ubType: UINT8, bMoraleMod: INT8): void {
  let pProfile: MERCPROFILESTRUCT;
  let iMoraleModTotal: INT32;

  if (!pSoldier.bActive || (pSoldier.bLife < CONSCIOUSNESS) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier) || AM_AN_EPC(pSoldier)) {
    return;
  }

  if ((pSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.bAssignment == Enum117.IN_TRANSIT)) {
    return;
  }

  if (pSoldier.ubProfile == NO_PROFILE) {
    return;
  }

  pProfile = gMercProfiles[pSoldier.ubProfile];

  if (bMoraleMod > 0) {
    switch (pProfile.bAttitude) {
      case Enum271.ATT_OPTIMIST:
      case Enum271.ATT_AGGRESSIVE:
        bMoraleMod += 1;
        break;
      case Enum271.ATT_PESSIMIST:
        bMoraleMod -= 1;
        break;
      default:
        break;
    }
    if (bMoraleMod < 0) {
      // can't change a positive event into a negative one!
      bMoraleMod = 0;
    }
  } else {
    switch (pProfile.bAttitude) {
      case Enum271.ATT_OPTIMIST:
        bMoraleMod += 1;
        break;
      case Enum271.ATT_PESSIMIST:
        bMoraleMod -= 1;
        break;
      case Enum271.ATT_COWARD:
        bMoraleMod -= 2;
      default:
        break;
    }
    if (pSoldier.bLevel == 1) {
      bMoraleMod--;
    } else if (pSoldier.bLevel > 5) {
      bMoraleMod++;
    }
    if (bMoraleMod > 0) {
      // can't change a negative event into a positive one!
      bMoraleMod = 0;
    }
  }
  // apply change!
  if (ubType == Enum235.TACTICAL_MORALE_EVENT) {
    iMoraleModTotal = pSoldier.bTacticalMoraleMod + bMoraleMod;
    iMoraleModTotal = Math.min(iMoraleModTotal, MORALE_MOD_MAX);
    iMoraleModTotal = Math.max(iMoraleModTotal, -MORALE_MOD_MAX);
    pSoldier.bTacticalMoraleMod = iMoraleModTotal;
  } else if (gTacticalStatus.fEnemyInSector && !pSoldier.bInSector) // delayed strategic
  {
    iMoraleModTotal = pSoldier.bDelayedStrategicMoraleMod + bMoraleMod;
    iMoraleModTotal = Math.min(iMoraleModTotal, MORALE_MOD_MAX);
    iMoraleModTotal = Math.max(iMoraleModTotal, -MORALE_MOD_MAX);
    pSoldier.bDelayedStrategicMoraleMod = iMoraleModTotal;
  } else // strategic
  {
    iMoraleModTotal = pSoldier.bStrategicMoraleMod + bMoraleMod;
    iMoraleModTotal = Math.min(iMoraleModTotal, MORALE_MOD_MAX);
    iMoraleModTotal = Math.max(iMoraleModTotal, -MORALE_MOD_MAX);
    pSoldier.bStrategicMoraleMod = iMoraleModTotal;
  }

  RefreshSoldierMorale(pSoldier);

  if (!pSoldier.fMercAsleep) {
    if (!gfSomeoneSaidMoraleQuote) {
      // Check if we're below a certain value and warn
      if (pSoldier.bMorale < 35) {
        // Have we said this quote yet?
        if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_LOW_MORAL)) {
          gfSomeoneSaidMoraleQuote = true;

          // ATE: Amde it a DELAYED QUOTE - will be delayed by the dialogue Q until it's our turn...
          DelayedTacticalCharacterDialogue(pSoldier, Enum202.QUOTE_STARTING_TO_WHINE);
          pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_LOW_MORAL;
        }
      }
    }
  }

  // Reset flag!
  if (pSoldier.bMorale > 65) {
    pSoldier.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_LOW_MORAL);
  }
}

function HandleMoraleEventForSoldier(pSoldier: SOLDIERTYPE, bMoraleEvent: INT8): void {
  UpdateSoldierMorale(pSoldier, gbMoraleEvent[bMoraleEvent].ubType, gbMoraleEvent[bMoraleEvent].bChange);
}

export function HandleMoraleEvent(pSoldier: SOLDIERTYPE | null, bMoraleEvent: INT8, sMapX: INT16, sMapY: INT16, bMapZ: INT8): void {
  let ubLoop: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let pProfile: MERCPROFILESTRUCT;

  gfSomeoneSaidMoraleQuote = false;

  // NOTE: Many morale events are NOT attached to a specific player soldier at all!
  // Those that do need it have Asserts on a case by case basis below
  if (pSoldier == null) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Handling morale event %d at X=%d, Y=%d,Z=%d", bMoraleEvent, sMapX, sMapY, bMapZ));
  } else {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Handling morale event %d for %S at X=%d, Y=%d, Z=%d", bMoraleEvent, pSoldier.name, sMapX, sMapY, bMapZ));
  }

  switch (bMoraleEvent) {
    case Enum234.MORALE_KILLED_ENEMY:
    case Enum234.MORALE_DID_LOTS_OF_DAMAGE:
    case Enum234.MORALE_DRUGS_CRASH:
    case Enum234.MORALE_ALCOHOL_CRASH:
    case Enum234.MORALE_SUPPRESSED:
    case Enum234.MORALE_TOOK_LOTS_OF_DAMAGE:
    case Enum234.MORALE_HIGH_DEATHRATE:
    case Enum234.MORALE_SEX:
      // needs specific soldier!
      Assert(pSoldier);
      // affects the soldier only
      HandleMoraleEventForSoldier(pSoldier, bMoraleEvent);
      break;

    case Enum234.MORALE_CLAUSTROPHOBE_UNDERGROUND:
    case Enum234.MORALE_INSECT_PHOBIC_SEES_CREATURE:
    case Enum234.MORALE_NERVOUS_ALONE:
      // needs specific soldier!
      Assert(pSoldier);
      // affects the soldier only, should be ignored if tactical morale mod is -20 or less
      if (pSoldier.bTacticalMoraleMod > PHOBIC_LIMIT) {
        HandleMoraleEventForSoldier(pSoldier, bMoraleEvent);
      }
      break;

    case Enum234.MORALE_BATTLE_WON:
      // affects everyone to varying degrees
      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier = MercPtrs[ubLoop]) {
        if (pTeamSoldier.bActive) {
          if (SOLDIER_IN_SECTOR(pTeamSoldier, sMapX, sMapY, bMapZ)) {
            HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_BATTLE_WON);
          } else {
            HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_HEARD_BATTLE_WON);
          }
        }
      }
      break;
    case Enum234.MORALE_RAN_AWAY:
      // affects everyone to varying degrees
      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier = MercPtrs[ubLoop]) {
        if (pTeamSoldier.bActive) {
          // CJC: adding to SOLDIER_IN_SECTOR check special stuff because the old sector values might
          // be appropriate (because in transit going out of that sector!)

          if (SOLDIER_IN_SECTOR(pTeamSoldier, sMapX, sMapY, bMapZ) || (pTeamSoldier.fBetweenSectors && ((pTeamSoldier.ubPrevSectorID % 16) + 1) == sMapX && (Math.trunc(pTeamSoldier.ubPrevSectorID / 16) + 1) == sMapY && (pTeamSoldier.bSectorZ == bMapZ))) {
            switch (gMercProfiles[pTeamSoldier.ubProfile].bAttitude) {
              case Enum271.ATT_AGGRESSIVE:
                // double the penalty - these guys REALLY hate running away
                HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_RAN_AWAY);
                HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_RAN_AWAY);
                break;
              case Enum271.ATT_COWARD:
                // no penalty - cowards are perfectly happy to avoid fights!
                break;
              default:
                HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_RAN_AWAY);
                break;
            }
          } else {
            HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_HEARD_BATTLE_LOST);
          }
        }
      }
      break;

    case Enum234.MORALE_TOWN_LIBERATED:
    case Enum234.MORALE_TOWN_LOST:
    case Enum234.MORALE_MINE_LIBERATED:
    case Enum234.MORALE_MINE_LOST:
    case Enum234.MORALE_SAM_SITE_LIBERATED:
    case Enum234.MORALE_SAM_SITE_LOST:
    case Enum234.MORALE_KILLED_CIVILIAN:
    case Enum234.MORALE_LOW_DEATHRATE:
    case Enum234.MORALE_HEARD_BATTLE_WON:
    case Enum234.MORALE_HEARD_BATTLE_LOST:
    case Enum234.MORALE_MONSTER_QUEEN_KILLED:
    case Enum234.MORALE_DEIDRANNA_KILLED:
      // affects everyone, everywhere
      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier = MercPtrs[ubLoop]) {
        if (pTeamSoldier.bActive) {
          HandleMoraleEventForSoldier(pTeamSoldier, bMoraleEvent);
        }
      }
      break;

    case Enum234.MORALE_POOR_MORALE:
    case Enum234.MORALE_GREAT_MORALE:
    case Enum234.MORALE_AIRSTRIKE:
      // affects every in sector
      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier = MercPtrs[ubLoop]) {
        if (pTeamSoldier.bActive && SOLDIER_IN_SECTOR(pTeamSoldier, sMapX, sMapY, bMapZ)) {
          HandleMoraleEventForSoldier(pTeamSoldier, bMoraleEvent);
        }
      }
      break;

    case Enum234.MORALE_MERC_CAPTURED:
      // needs specific soldier! (for reputation, not here)
      Assert(pSoldier);

      // affects everyone
      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier = MercPtrs[ubLoop]) {
        if (pTeamSoldier.bActive) {
          HandleMoraleEventForSoldier(pTeamSoldier, bMoraleEvent);
        }
      }
      break;
    case Enum234.MORALE_TEAMMATE_DIED:
      // needs specific soldier!
      Assert(pSoldier);

      // affects everyone, in sector differently than not, extra bonuses if it's a buddy or hated merc
      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier = MercPtrs[ubLoop]) {
        if (pTeamSoldier.bActive && pTeamSoldier.ubProfile != NO_PROFILE) {
          pProfile = gMercProfiles[pTeamSoldier.ubProfile];

          if (HATED_MERC(pProfile, pSoldier.ubProfile)) {
            // yesss!
            HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_HATED_DIED);
          } else {
            if (SOLDIER_IN_SECTOR(pTeamSoldier, sMapX, sMapY, bMapZ)) {
              // mate died in my sector!  tactical morale mod
              HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_SQUADMATE_DIED);
            }

            // this is handled for everyone even if in sector, as it's a strategic morale mod
            HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_TEAMMATE_DIED);

            if (BUDDY_MERC(pProfile, pSoldier.ubProfile)) {
              // oh no!  buddy died!
              HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_BUDDY_DIED);
            }
          }
        }
      }
      break;

    case Enum234.MORALE_MERC_MARRIED:
      // female mercs get unhappy based on how sexist they are (=hate men)
      // gentlemen males get unhappy too

      ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pTeamSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pTeamSoldier = MercPtrs[ubLoop]) {
        if (pTeamSoldier.bActive && pTeamSoldier.ubProfile != NO_PROFILE) {
          if (WhichHated(pTeamSoldier.ubProfile, (<SOLDIERTYPE>pSoldier).ubProfile) != -1) {
            // we hate 'em anyways
            continue;
          }

          if (gMercProfiles[pTeamSoldier.ubProfile].bSex == Enum272.FEMALE) {
            switch (gMercProfiles[pTeamSoldier.ubProfile].bSexist) {
              case Enum273.SOMEWHAT_SEXIST:
                HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_MERC_MARRIED);
                break;
              case Enum273.VERY_SEXIST:
                // handle TWICE!
                HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_MERC_MARRIED);
                HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_MERC_MARRIED);
                break;
              default:
                break;
            }
          } else {
            switch (gMercProfiles[pTeamSoldier.ubProfile].bSexist) {
              case Enum273.GENTLEMAN:
                HandleMoraleEventForSoldier(pTeamSoldier, Enum234.MORALE_MERC_MARRIED);
                break;
              default:
                break;
            }
          }
        }
      }
      break;

    default:
      // debug message
      ScreenMsg(MSG_FONT_RED, MSG_BETAVERSION, "Invalid morale event type = %d.  AM/CC-1", bMoraleEvent);
      break;
  }

  // some morale events also impact the player's reputation with the mercs back home
  switch (bMoraleEvent) {
    case Enum234.MORALE_HIGH_DEATHRATE:
      ModifyPlayerReputation(REPUTATION_HIGH_DEATHRATE);
      break;
    case Enum234.MORALE_LOW_DEATHRATE:
      ModifyPlayerReputation(REPUTATION_LOW_DEATHRATE);
      break;
    case Enum234.MORALE_POOR_MORALE:
      ModifyPlayerReputation(REPUTATION_POOR_MORALE);
      break;
    case Enum234.MORALE_GREAT_MORALE:
      ModifyPlayerReputation(REPUTATION_GREAT_MORALE);
      break;
    case Enum234.MORALE_BATTLE_WON:
      ModifyPlayerReputation(REPUTATION_BATTLE_WON);
      break;
    case Enum234.MORALE_RAN_AWAY:
    case Enum234.MORALE_HEARD_BATTLE_LOST:
      ModifyPlayerReputation(REPUTATION_BATTLE_LOST);
      break;
    case Enum234.MORALE_TOWN_LIBERATED:
      ModifyPlayerReputation(REPUTATION_TOWN_WON);
      break;
    case Enum234.MORALE_TOWN_LOST:
      ModifyPlayerReputation(REPUTATION_TOWN_LOST);
      break;
    case Enum234.MORALE_TEAMMATE_DIED:
      // impact depends on that dude's level of experience
      ModifyPlayerReputation(((<SOLDIERTYPE>pSoldier).bExpLevel * REPUTATION_SOLDIER_DIED));
      break;
    case Enum234.MORALE_MERC_CAPTURED:
      // impact depends on that dude's level of experience
      ModifyPlayerReputation(((<SOLDIERTYPE>pSoldier).bExpLevel * REPUTATION_SOLDIER_CAPTURED));
      break;
    case Enum234.MORALE_KILLED_CIVILIAN:
      ModifyPlayerReputation(REPUTATION_KILLED_CIVILIAN);
      break;
    case Enum234.MORALE_MONSTER_QUEEN_KILLED:
      ModifyPlayerReputation(REPUTATION_KILLED_MONSTER_QUEEN);
      break;
    case Enum234.MORALE_DEIDRANNA_KILLED:
      ModifyPlayerReputation(REPUTATION_KILLED_DEIDRANNA);
      break;

    default:
      // no reputation impact
      break;
  }
}

export function HourlyMoraleUpdate(): void {
  let bMercID: INT8;
  let bOtherID: INT8;
  let bActualTeamOpinion: INT8;
  let bTeamMoraleModChange: INT8;
  let bTeamMoraleModDiff: INT8;
  let bOpinion: INT8 = -1;
  let iTotalOpinions: INT32;
  let bNumTeamMembers: INT8;
  let bHighestTeamLeadership: INT8 = 0;
  let bLastTeamID: INT8;
  let pSoldier: SOLDIERTYPE;
  let pOtherSoldier: SOLDIERTYPE;
  let pProfile: MERCPROFILESTRUCT;
  let fSameGroupOnly: boolean;
  /* static */ let bStrategicMoraleUpdateCounter: INT8 = 0;
  let fFoundHated: boolean = false;
  let bHated: INT8;

  bMercID = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

  // loop through all mercs to calculate their morale
  for (pSoldier = MercPtrs[bMercID]; bMercID <= bLastTeamID; bMercID++, pSoldier = MercPtrs[bMercID]) {
    // if the merc is active, in Arulco, and conscious, not POW
    if (pSoldier.bActive && pSoldier.ubProfile != NO_PROFILE && !(pSoldier.bAssignment == Enum117.IN_TRANSIT || pSoldier.fMercAsleep == true || pSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD || pSoldier.bAssignment == Enum117.ASSIGNMENT_POW)) {
      // calculate the guy's opinion of the people he is with
      pProfile = gMercProfiles[pSoldier.ubProfile];

      // if we're moving
      if (pSoldier.ubGroupID != 0 && PlayerIDGroupInMotion(pSoldier.ubGroupID)) {
        // we only check our opinions of people in our squad
        fSameGroupOnly = true;
      } else {
        fSameGroupOnly = false;
      }
      fFoundHated = false;

      // reset counts to calculate average opinion
      iTotalOpinions = 0;
      bNumTeamMembers = 0;

      // let people with high leadership affect their own morale
      bHighestTeamLeadership = EffectiveLeadership(pSoldier);

      // loop through all other mercs
      bOtherID = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      for (pOtherSoldier = MercPtrs[bOtherID]; bOtherID <= bLastTeamID; bOtherID++, pOtherSoldier = MercPtrs[bOtherID]) {
        // skip past ourselves and all inactive mercs
        if (bOtherID != bMercID && pOtherSoldier.bActive && pOtherSoldier.ubProfile != NO_PROFILE && !(pOtherSoldier.bAssignment == Enum117.IN_TRANSIT || pOtherSoldier.fMercAsleep == true || pOtherSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD || pOtherSoldier.bAssignment == Enum117.ASSIGNMENT_POW)) {
          if (fSameGroupOnly) {
            // all we have to check is the group ID
            if (pSoldier.ubGroupID != pOtherSoldier.ubGroupID) {
              continue;
            }
          } else {
            // check to see if the location is the same
            if (pOtherSoldier.sSectorX != pSoldier.sSectorX || pOtherSoldier.sSectorY != pSoldier.sSectorY || pOtherSoldier.bSectorZ != pSoldier.bSectorZ) {
              continue;
            }

            // if the OTHER soldier is in motion then we don't do anything!
            if (pOtherSoldier.ubGroupID != 0 && PlayerIDGroupInMotion(pOtherSoldier.ubGroupID)) {
              continue;
            }
          }
          bOpinion = pProfile.bMercOpinion[pOtherSoldier.ubProfile];
          if (bOpinion == HATED_OPINION) {
            bHated = WhichHated(pSoldier.ubProfile, pOtherSoldier.ubProfile);
            if (bHated >= 2) {
              // learn to hate which has become full-blown hatred, full strength
              fFoundHated = true;
              break;
            } else {
              // scale according to how close to we are to snapping
              // KM : Divide by 0 error found.  Wrapped into an if statement.
              if (pProfile.bHatedTime[bHated]) {
                bOpinion = Math.trunc((bOpinion) * (pProfile.bHatedTime[bHated] - pProfile.bHatedCount[bHated]) / pProfile.bHatedTime[bHated]);
              }

              if (pProfile.bHatedCount[bHated] <= Math.trunc(pProfile.bHatedTime[bHated] / 2)) {
                // Augh, we're teamed with someone we hate!  We HATE this!!  Ignore everyone else!
                fFoundHated = true;
                break;
              }
              // otherwise just mix this opinion in with everyone else...
            }
          }
          iTotalOpinions += bOpinion;
          bNumTeamMembers++;
          if (EffectiveLeadership(pOtherSoldier) > bHighestTeamLeadership) {
            bHighestTeamLeadership = EffectiveLeadership(pOtherSoldier);
          }
        }
      }

      if (fFoundHated) {
        // If teamed with someone we hated, team opinion is automatically minimum
        bActualTeamOpinion = HATED_OPINION;
      } else if (bNumTeamMembers > 0) {
        bActualTeamOpinion = Math.trunc(iTotalOpinions / bNumTeamMembers);
        // give bonus/penalty for highest leadership value on team
        bActualTeamOpinion += Math.trunc((bHighestTeamLeadership - 50) / 10);
      } else // alone
      {
        bActualTeamOpinion = 0;
      }

      // reduce to a range of HATED through BUDDY
      if (bActualTeamOpinion > BUDDY_OPINION) {
        bActualTeamOpinion = BUDDY_OPINION;
      } else if (bActualTeamOpinion < HATED_OPINION) {
        bActualTeamOpinion = HATED_OPINION;
      }

      // shift morale from team by ~10%

      // this should range between -75 and +75
      bTeamMoraleModDiff = bActualTeamOpinion - pSoldier.bTeamMoraleMod;
      if (bTeamMoraleModDiff > 0) {
        bTeamMoraleModChange = 1 + Math.trunc(bTeamMoraleModDiff / 10);
      } else if (bTeamMoraleModDiff < 0) {
        bTeamMoraleModChange = -1 + Math.trunc(bTeamMoraleModDiff / 10);
      } else {
        bTeamMoraleModChange = 0;
      }
      pSoldier.bTeamMoraleMod += bTeamMoraleModChange;
      pSoldier.bTeamMoraleMod = Math.min(pSoldier.bTeamMoraleMod, MORALE_MOD_MAX);
      pSoldier.bTeamMoraleMod = Math.max(pSoldier.bTeamMoraleMod, -MORALE_MOD_MAX);

      // New, December 3rd, 1998, by CJC --
      // If delayed strategic modifier exists then incorporate it in strategic mod
      if (pSoldier.bDelayedStrategicMoraleMod) {
        pSoldier.bStrategicMoraleMod += pSoldier.bDelayedStrategicMoraleMod;
        pSoldier.bDelayedStrategicMoraleMod = 0;
        pSoldier.bStrategicMoraleMod = Math.min(pSoldier.bStrategicMoraleMod, MORALE_MOD_MAX);
        pSoldier.bStrategicMoraleMod = Math.max(pSoldier.bStrategicMoraleMod, -MORALE_MOD_MAX);
      }

      // refresh the morale value for the soldier based on the recalculated team modifier
      RefreshSoldierMorale(pSoldier);
    }
  }

  bStrategicMoraleUpdateCounter++;

  if (bStrategicMoraleUpdateCounter == HOURS_BETWEEN_STRATEGIC_DECAY) {
    DecayStrategicMoraleModifiers();
    bStrategicMoraleUpdateCounter = 0;
  }
}

export function DailyMoraleUpdate(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.ubProfile == NO_PROFILE) {
    return;
  }

  // CJC: made per hour now
  /*
          // decay the merc's strategic morale modifier
          if (pSoldier->bStrategicMoraleMod != 0)
          {
                  // decay the modifier!
                  DecayStrategicMorale( pSoldier );

                  // refresh the morale value for the soldier based on the recalculated modifier
                  RefreshSoldierMorale( pSoldier );
          }
  */

  // check death rate vs. merc's tolerance once/day (ignores buddies!)
  if (MercThinksDeathRateTooHigh(pSoldier.ubProfile)) {
    // too high, morale takes a hit
    HandleMoraleEvent(pSoldier, Enum234.MORALE_HIGH_DEATHRATE, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
  }

  // check his morale vs. his morale tolerance once/day (ignores buddies!)
  if (MercThinksHisMoraleIsTooLow(pSoldier)) {
    // too low, morale sinks further (merc's in a funk and things aren't getting better)
    HandleMoraleEvent(pSoldier, Enum234.MORALE_POOR_MORALE, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
  } else if (pSoldier.bMorale >= 75) {
    // very high morale, merc is cheerleading others
    HandleMoraleEvent(pSoldier, Enum234.MORALE_GREAT_MORALE, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
  }
}

}
