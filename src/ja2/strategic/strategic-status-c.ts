namespace ja2 {

export let gStrategicStatus: STRATEGIC_STATUS = createStrategicStatus();

export function InitStrategicStatus(): void {
  resetStrategicStatus(gStrategicStatus);
  // Add special non-zero start conditions here...

  InitArmyGunTypes();
}

export function SaveStrategicStatusToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  // Save the Strategic Status structure to the saved game file
  buffer = Buffer.allocUnsafe(STRATEGIC_STATUS_SIZE);
  writeStrategicStatus(gStrategicStatus, buffer);
  uiNumBytesWritten = FileWrite(hFile, buffer, STRATEGIC_STATUS_SIZE);
  if (uiNumBytesWritten != STRATEGIC_STATUS_SIZE) {
    return false;
  }

  return true;
}

export function LoadStrategicStatusFromSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // Load the Strategic Status structure from the saved game file
  buffer = Buffer.allocUnsafe(STRATEGIC_STATUS_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, STRATEGIC_STATUS_SIZE);
  if (uiNumBytesRead != STRATEGIC_STATUS_SIZE) {
    return false;
  }

  readStrategicStatus(gStrategicStatus, buffer);

  return true;
}

const DEATH_RATE_SEVERITY = 1.0; // increase to make death rates higher for same # of deaths/time

export function CalcDeathRate(): UINT8 {
  let uiDeathRate: UINT32 = 0;

  // give the player a grace period of 1 day
  if (gStrategicStatus.uiManDaysPlayed > 0) {
    // calculates the player's current death rate
    uiDeathRate = Math.trunc((gStrategicStatus.ubMercDeaths * DEATH_RATE_SEVERITY * 100) / gStrategicStatus.uiManDaysPlayed);
  }

  return uiDeathRate;
}

export function ModifyPlayerReputation(bRepChange: INT8): void {
  let iNewBadRep: INT32;

  // subtract, so that a negative reputation change results in an increase in bad reputation
  iNewBadRep = gStrategicStatus.ubBadReputation - bRepChange;

  // keep within a 0-100 range (0 = Saint, 100 = Satan)
  iNewBadRep = Math.max(0, iNewBadRep);
  iNewBadRep = Math.min(100, iNewBadRep);

  gStrategicStatus.ubBadReputation = iNewBadRep;
}

export function MercThinksDeathRateTooHigh(ubProfileID: UINT8): boolean {
  let bDeathRateTolerance: INT8;

  bDeathRateTolerance = gMercProfiles[ubProfileID].bDeathRate;

  // if he couldn't care less what it is
  if (bDeathRateTolerance == 101) {
    // then obviously it CAN'T be too high...
    return false;
  }

  if (CalcDeathRate() > bDeathRateTolerance) {
    // too high - sorry
    return true;
  } else {
    // within tolerance
    return false;
  }
}

export function MercThinksBadReputationTooHigh(ubProfileID: UINT8): boolean {
  let bRepTolerance: INT8;

  bRepTolerance = gMercProfiles[ubProfileID].bReputationTolerance;

  // if he couldn't care less what it is
  if (bRepTolerance == 101) {
    // then obviously it CAN'T be too high...
    return false;
  }

  if (gStrategicStatus.ubBadReputation > bRepTolerance) {
    // too high - sorry
    return true;
  } else {
    // within tolerance
    return false;
  }
}

// only meaningful for already hired mercs
export function MercThinksHisMoraleIsTooLow(pSoldier: SOLDIERTYPE): boolean {
  let bRepTolerance: INT8;
  let bMoraleTolerance: INT8;

  bRepTolerance = gMercProfiles[pSoldier.ubProfile].bReputationTolerance;

  // if he couldn't care less what it is
  if (bRepTolerance == 101) {
    // that obviously it CAN'T be too low...
    return false;
  }

  // morale tolerance is based directly upon reputation tolerance
  // above 50, morale is GOOD, never below tolerance then
  bMoraleTolerance = Math.trunc((100 - bRepTolerance) / 2);

  if (pSoldier.bMorale < bMoraleTolerance) {
    // too low - sorry
    return true;
  } else {
    // within tolerance
    return false;
  }
}

export function UpdateLastDayOfPlayerActivity(usDay: UINT16): void {
  if (usDay > gStrategicStatus.usLastDayOfPlayerActivity) {
    gStrategicStatus.usLastDayOfPlayerActivity = usDay;
    gStrategicStatus.ubNumberOfDaysOfInactivity = 0;
  }
}

function LackOfProgressTolerance(): UINT8 {
  if (gGameOptions.ubDifficultyLevel >= Enum9.DIF_LEVEL_HARD) {
    // give an EXTRA day over normal
    return 7 - Enum9.DIF_LEVEL_MEDIUM + Math.trunc(gStrategicStatus.ubHighestProgress / 42);
  } else {
    return 6 - gGameOptions.ubDifficultyLevel + Math.trunc(gStrategicStatus.ubHighestProgress / 42);
  }
}

// called once per day in the morning, decides whether Enrico should send any new E-mails to the player
export function HandleEnricoEmail(): void {
  let ubCurrentProgress: UINT8 = CurrentPlayerProgressPercentage();
  let ubHighestProgress: UINT8 = HighestPlayerProgressPercentage();

  // if creatures have attacked a mine (doesn't care if they're still there or not at the moment)
  if (HasAnyMineBeenAttackedByMonsters() && !(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_CREATURES)) {
    AddEmail(ENRICO_CREATURES, ENRICO_CREATURES_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_CREATURES;
    return; // avoid any other E-mail at the same time
  }

  if ((ubCurrentProgress >= SOME_PROGRESS_THRESHOLD) && !(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_SOME_PROGRESS)) {
    AddEmail(ENRICO_PROG_20, ENRICO_PROG_20_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_SOME_PROGRESS;
    return; // avoid any setback E-mail at the same time
  }

  if ((ubCurrentProgress >= ABOUT_HALFWAY_THRESHOLD) && !(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_ABOUT_HALFWAY)) {
    AddEmail(ENRICO_PROG_55, ENRICO_PROG_55_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_ABOUT_HALFWAY;
    return; // avoid any setback E-mail at the same time
  }

  if ((ubCurrentProgress >= NEARLY_DONE_THRESHOLD) && !(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_NEARLY_DONE)) {
    AddEmail(ENRICO_PROG_80, ENRICO_PROG_80_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_NEARLY_DONE;
    return; // avoid any setback E-mail at the same time
  }

  // test for a major setback OR a second minor setback
  if ((((ubHighestProgress - ubCurrentProgress) >= MAJOR_SETBACK_THRESHOLD) || (((ubHighestProgress - ubCurrentProgress) >= MINOR_SETBACK_THRESHOLD) && (gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_FLAG_SETBACK_OVER))) && !(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_MAJOR_SETBACK)) {
    AddEmail(ENRICO_SETBACK, ENRICO_SETBACK_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_MAJOR_SETBACK;
  } else
      // test for a first minor setback
      if (((ubHighestProgress - ubCurrentProgress) >= MINOR_SETBACK_THRESHOLD) && !(gStrategicStatus.usEnricoEmailFlags & (ENRICO_EMAIL_SENT_MINOR_SETBACK | ENRICO_EMAIL_SENT_MAJOR_SETBACK))) {
    AddEmail(ENRICO_SETBACK_2, ENRICO_SETBACK_2_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_MINOR_SETBACK;
  } else
      // if player is back at his maximum progress after having suffered a minor setback
      if ((ubHighestProgress == ubCurrentProgress) && (gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_MINOR_SETBACK)) {
    // remember that the original setback has been overcome, so another one can generate another E-mail
    gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_FLAG_SETBACK_OVER;
  } else if (GetWorldDay() > (gStrategicStatus.usLastDayOfPlayerActivity)) {
    let bComplaint: INT8 = 0;
    let ubTolerance: UINT8;

    gStrategicStatus.ubNumberOfDaysOfInactivity++;
    ubTolerance = LackOfProgressTolerance();

    if (gStrategicStatus.ubNumberOfDaysOfInactivity >= ubTolerance) {
      if (gStrategicStatus.ubNumberOfDaysOfInactivity == ubTolerance) {
        // send email
        if (!(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_LACK_PROGRESS1)) {
          bComplaint = 1;
        } else if (!(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_LACK_PROGRESS2)) {
          bComplaint = 2;
        } else if (!(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_LACK_PROGRESS3)) {
          bComplaint = 3;
        }
      } else if (gStrategicStatus.ubNumberOfDaysOfInactivity == ubTolerance * 2) {
        // six days? send 2nd or 3rd message possibly
        if (!(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_LACK_PROGRESS2)) {
          bComplaint = 2;
        } else if (!(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_LACK_PROGRESS3)) {
          bComplaint = 3;
        }
      } else if (gStrategicStatus.ubNumberOfDaysOfInactivity == ubTolerance * 3) {
        // nine days??? send 3rd message possibly
        if (!(gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_LACK_PROGRESS3)) {
          bComplaint = 3;
        }
      }

      if (bComplaint != 0) {
        switch (bComplaint) {
          case 3:
            AddEmail(LACK_PLAYER_PROGRESS_3, LACK_PLAYER_PROGRESS_3_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
            gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_LACK_PROGRESS3;
            break;
          case 2:
            AddEmail(LACK_PLAYER_PROGRESS_2, LACK_PLAYER_PROGRESS_2_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
            gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_LACK_PROGRESS2;
            break;
          default:
            AddEmail(LACK_PLAYER_PROGRESS_1, LACK_PLAYER_PROGRESS_1_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
            gStrategicStatus.usEnricoEmailFlags |= ENRICO_EMAIL_SENT_LACK_PROGRESS1;
            break;
        }

        AddHistoryToPlayersLog(Enum83.HISTORY_ENRICO_COMPLAINED, 0, GetWorldTotalMin(), -1, -1);
      }

      // penalize loyalty!
      if (gStrategicStatus.usEnricoEmailFlags & ENRICO_EMAIL_SENT_LACK_PROGRESS2) {
        DecrementTownLoyaltyEverywhere(LOYALTY_PENALTY_INACTIVE * (gStrategicStatus.ubNumberOfDaysOfInactivity - LackOfProgressTolerance() + 1));
      } else {
        // on first complaint, give a day's grace...
        DecrementTownLoyaltyEverywhere(LOYALTY_PENALTY_INACTIVE * (gStrategicStatus.ubNumberOfDaysOfInactivity - LackOfProgressTolerance()));
      }
    }
  }

  // reset # of new sectors visited 'today'
  // grant some leeway for the next day, could have started moving
  // at night...
  gStrategicStatus.ubNumNewSectorsVisitedToday = Math.trunc(Math.min(gStrategicStatus.ubNumNewSectorsVisitedToday, NEW_SECTORS_EQUAL_TO_ACTIVITY) / 3);
}

export function TrackEnemiesKilled(ubKilledHow: UINT8, ubSoldierClass: UINT8): void {
  let bRankIndex: INT8;

  bRankIndex = SoldierClassToRankIndex(ubSoldierClass);

  // if it's not a standard enemy-class soldier
  if (bRankIndex == -1) {
    // don't count him as an enemy
    return;
  }

  gStrategicStatus.usEnemiesKilled[ubKilledHow][bRankIndex]++;

  if (ubKilledHow != Enum189.ENEMY_KILLED_TOTAL) {
    gStrategicStatus.usEnemiesKilled[Enum189.ENEMY_KILLED_TOTAL][bRankIndex]++;
  }
}

function SoldierClassToRankIndex(ubSoldierClass: UINT8): INT8 {
  let bRankIndex: INT8 = -1;

  // the soldier class defines are not in natural ascending order, elite comes before army!
  switch (ubSoldierClass) {
    case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
      bRankIndex = 0;
      break;
    case Enum262.SOLDIER_CLASS_ELITE:
      bRankIndex = 2;
      break;
    case Enum262.SOLDIER_CLASS_ARMY:
      bRankIndex = 1;
      break;

    default:
      // this happens when an NPC joins the enemy team (e.g. Conrad, Iggy, Mike)
      break;
  }

  return bRankIndex;
}

export function RankIndexToSoldierClass(ubRankIndex: UINT8): UINT8 {
  let ubSoldierClass: UINT8 = 0;

  Assert(ubRankIndex < Enum188.NUM_ENEMY_RANKS);

  switch (ubRankIndex) {
    case 0:
      ubSoldierClass = Enum262.SOLDIER_CLASS_ADMINISTRATOR;
      break;
    case 1:
      ubSoldierClass = Enum262.SOLDIER_CLASS_ARMY;
      break;
    case 2:
      ubSoldierClass = Enum262.SOLDIER_CLASS_ELITE;
      break;
  }

  return ubSoldierClass;
}

}
