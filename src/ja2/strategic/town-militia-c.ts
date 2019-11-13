namespace ja2 {

const SIZE_OF_MILITIA_COMPLETED_TRAINING_LIST = 50;

// temporary local global variables
let gubTownSectorServerTownId: UINT8 = Enum135.BLANK_SECTOR;
let gsTownSectorServerSkipX: INT16 = -1;
let gsTownSectorServerSkipY: INT16 = -1;
let gubTownSectorServerIndex: UINT8 = 0;
let gfYesNoPromptIsForContinue: boolean = false; // this flag remembers whether we're starting new training, or continuing
let giTotalCostOfTraining: INT32 = 0;

// the completed list of sector soldiers for training militia
let giListOfMercsInSectorsCompletedMilitiaTraining: INT32[] /* [SIZE_OF_MILITIA_COMPLETED_TRAINING_LIST] */;
export let pMilitiaTrainerSoldier: Pointer<SOLDIERTYPE> = null;

// note that these sector values are STRATEGIC INDEXES, not 0-255!
let gsUnpaidStrategicSector: INT16[] /* [MAX_CHARACTER_COUNT] */;

export function TownMilitiaTrainingCompleted(pTrainer: Pointer<SOLDIERTYPE>, sMapX: INT16, sMapY: INT16): void {
  let pSectorInfo: Pointer<SECTORINFO> = addressof(SectorInfo[SECTOR(sMapX, sMapY)]);
  let ubMilitiaTrained: UINT8 = 0;
  let fFoundOne: boolean;
  let sNeighbourX: INT16;
  let sNeighbourY: INT16;
  let ubTownId: UINT8;

  // get town index
  ubTownId = StrategicMap[sMapX + sMapY * MAP_WORLD_X].bNameId;

  if (ubTownId == Enum135.BLANK_SECTOR) {
    Assert(IsThisSectorASAMSector(sMapX, sMapY, 0));
  }

  // force tactical to update militia status
  gfStrategicMilitiaChangesMade = true;

  // ok, so what do we do with all this training?  Well, in order of decreasing priority:
  // 1) If there's room in training sector, create new GREEN militia guys there
  // 2) If not enough room there, create new GREEN militia guys in friendly sectors of the same town
  // 3) If not enough room anywhere in town, promote a number of GREENs in this sector into regulars
  // 4) If not enough GREENS there to promote, promote GREENs in other sectors.
  // 5) If all friendly sectors of this town are completely filled with REGULAR militia, then training effect is wasted

  while (ubMilitiaTrained < MILITIA_TRAINING_SQUAD_SIZE) {
    // is there room for another militia in the training sector itself?
    if (CountAllMilitiaInSector(sMapX, sMapY) < MAX_ALLOWABLE_MILITIA_PER_SECTOR) {
      // great! Create a new GREEN militia guy in the training sector
      StrategicAddMilitiaToSector(sMapX, sMapY, Enum126.GREEN_MILITIA, 1);
    } else {
      fFoundOne = false;

      if (ubTownId != Enum135.BLANK_SECTOR) {
        InitFriendlyTownSectorServer(ubTownId, sMapX, sMapY);

        // check other eligible sectors in this town for room for another militia
        while (ServeNextFriendlySectorInTown(addressof(sNeighbourX), addressof(sNeighbourY))) {
          // is there room for another militia in this neighbouring sector ?
          if (CountAllMilitiaInSector(sNeighbourX, sNeighbourY) < MAX_ALLOWABLE_MILITIA_PER_SECTOR) {
            // great! Create a new GREEN militia guy in the neighbouring sector
            StrategicAddMilitiaToSector(sNeighbourX, sNeighbourY, Enum126.GREEN_MILITIA, 1);

            fFoundOne = true;
            break;
          }
        }
      }

      // if we still haven't been able to train anyone
      if (!fFoundOne) {
        // alrighty, then.  We'll have to *promote* guys instead.

        // are there any GREEN militia men in the training sector itself?
        if (MilitiaInSectorOfRank(sMapX, sMapY, Enum126.GREEN_MILITIA) > 0) {
          // great! Promote a GREEN militia guy in the training sector to a REGULAR
          StrategicPromoteMilitiaInSector(sMapX, sMapY, Enum126.GREEN_MILITIA, 1);
        } else {
          if (ubTownId != Enum135.BLANK_SECTOR) {
            // dammit! Last chance - try to find other eligible sectors in the same town with a Green guy to be promoted
            InitFriendlyTownSectorServer(ubTownId, sMapX, sMapY);

            // check other eligible sectors in this town for room for another militia
            while (ServeNextFriendlySectorInTown(addressof(sNeighbourX), addressof(sNeighbourY))) {
              // are there any GREEN militia men in the neighbouring sector ?
              if (MilitiaInSectorOfRank(sNeighbourX, sNeighbourY, Enum126.GREEN_MILITIA) > 0) {
                // great! Promote a GREEN militia guy in the neighbouring sector to a REGULAR
                StrategicPromoteMilitiaInSector(sNeighbourX, sNeighbourY, Enum126.GREEN_MILITIA, 1);

                fFoundOne = true;
                break;
              }
            }
          }

          // if we still haven't been able to train anyone
          if (!fFoundOne) {
            // Well, that's it.  All eligible sectors of this town are full of REGULARs or ELITEs.
            // The training goes to waste in this situation.
            break; // the main while loop
          }
        }
      }
    }

    // next, please!
    ubMilitiaTrained++;
  }

  // if anyone actually got trained
  if (ubMilitiaTrained > 0) {
    // update the screen display
    fMapPanelDirty = true;

    if (ubTownId != Enum135.BLANK_SECTOR) {
      // loyalty in this town increases a bit because we obviously care about them...
      IncrementTownLoyalty(ubTownId, LOYALTY_BONUS_FOR_TOWN_TRAINING);
    }
  }

  // the trainer announces to player that he's finished his assignment.  Make his sector flash!
  AssignmentDone(pTrainer, true, false);

  // handle completion of town by training group
  HandleCompletionOfTownTrainingByGroupWithTrainer(pTrainer);
}

// feed this a SOLDIER_CLASS_, it will return you a _MITILIA rank, or -1 if the guy's not militia
export function SoldierClassToMilitiaRank(ubSoldierClass: UINT8): INT8 {
  let bRank: INT8 = -1;

  switch (ubSoldierClass) {
    case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
      bRank = Enum126.GREEN_MILITIA;
      break;
    case Enum262.SOLDIER_CLASS_REG_MILITIA:
      bRank = Enum126.REGULAR_MILITIA;
      break;
    case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
      bRank = Enum126.ELITE_MILITIA;
      break;
  }

  return bRank;
}

// feed this a _MITILIA rank, it will return you a SOLDIER_CLASS_, or -1 if the guy's not militia
function MilitiaRankToSoldierClass(ubRank: UINT8): INT8 {
  let bSoldierClass: INT8 = -1;

  switch (ubRank) {
    case Enum126.GREEN_MILITIA:
      bSoldierClass = Enum262.SOLDIER_CLASS_GREEN_MILITIA;
      break;
    case Enum126.REGULAR_MILITIA:
      bSoldierClass = Enum262.SOLDIER_CLASS_REG_MILITIA;
      break;
    case Enum126.ELITE_MILITIA:
      bSoldierClass = Enum262.SOLDIER_CLASS_ELITE_MILITIA;
      break;
  }

  return bSoldierClass;
}

function StrategicAddMilitiaToSector(sMapX: INT16, sMapY: INT16, ubRank: UINT8, ubHowMany: UINT8): void {
  let pSectorInfo: Pointer<SECTORINFO> = addressof(SectorInfo[SECTOR(sMapX, sMapY)]);

  pSectorInfo.value.ubNumberOfCivsAtLevel[ubRank] += ubHowMany;

  // update the screen display
  fMapPanelDirty = true;
}

function StrategicPromoteMilitiaInSector(sMapX: INT16, sMapY: INT16, ubCurrentRank: UINT8, ubHowMany: UINT8): void {
  let pSectorInfo: Pointer<SECTORINFO> = addressof(SectorInfo[SECTOR(sMapX, sMapY)]);

  // damn well better have that many around to promote!
  Assert(pSectorInfo.value.ubNumberOfCivsAtLevel[ubCurrentRank] >= ubHowMany);

  // KM : July 21, 1999 patch fix
  if (pSectorInfo.value.ubNumberOfCivsAtLevel[ubCurrentRank] < ubHowMany) {
    return;
  }

  pSectorInfo.value.ubNumberOfCivsAtLevel[ubCurrentRank] -= ubHowMany;
  pSectorInfo.value.ubNumberOfCivsAtLevel[ubCurrentRank + 1] += ubHowMany;

  // update the screen display
  fMapPanelDirty = true;
}

export function StrategicRemoveMilitiaFromSector(sMapX: INT16, sMapY: INT16, ubRank: UINT8, ubHowMany: UINT8): void {
  let pSectorInfo: Pointer<SECTORINFO> = addressof(SectorInfo[SECTOR(sMapX, sMapY)]);

  // damn well better have that many around to remove!
  Assert(pSectorInfo.value.ubNumberOfCivsAtLevel[ubRank] >= ubHowMany);

  // KM : July 21, 1999 patch fix
  if (pSectorInfo.value.ubNumberOfCivsAtLevel[ubRank] < ubHowMany) {
    return;
  }

  pSectorInfo.value.ubNumberOfCivsAtLevel[ubRank] -= ubHowMany;

  // update the screen display
  fMapPanelDirty = true;
}

// kill pts are (2 * kills) + assists
export function CheckOneMilitiaForPromotion(sMapX: INT16, sMapY: INT16, ubCurrentRank: UINT8, ubRecentKillPts: UINT8): UINT8 {
  let uiChanceToLevel: UINT32 = 0;

  switch (ubCurrentRank) {
    case Enum126.GREEN_MILITIA:
      // 2 kill pts minimum
      if (ubRecentKillPts >= 2) {
        // 25% chance per kill pt
        uiChanceToLevel = 25 * ubRecentKillPts;
      }
      break;
    case Enum126.REGULAR_MILITIA:
      // 5 kill pts minimum
      if (ubRecentKillPts >= 5) {
        // 10% chance per kill pt.
        uiChanceToLevel = 10 * ubRecentKillPts;
      }
      break;
    case Enum126.ELITE_MILITIA:
      return 0;
      break;
  }
  // roll the bones, and see if he makes it
  if (Random(100) < uiChanceToLevel) {
    StrategicPromoteMilitiaInSector(sMapX, sMapY, ubCurrentRank, 1);
    if (ubCurrentRank == Enum126.GREEN_MILITIA) {
      // Attempt yet another level up if sufficient points
      if (ubRecentKillPts > 2) {
        if (CheckOneMilitiaForPromotion(sMapX, sMapY, Enum126.REGULAR_MILITIA, (ubRecentKillPts - 2))) {
          // success, this militia was promoted twice
          return 2;
        }
      }
    }
    return 1;
  }
  return 0;
}

// call this if the player attacks his own militia
function HandleMilitiaDefections(sMapX: INT16, sMapY: INT16): void {
  let ubRank: UINT8;
  let ubMilitiaCnt: UINT8;
  let ubCount: UINT8;
  let uiChanceToDefect: UINT32;

  for (ubRank = 0; ubRank < Enum126.MAX_MILITIA_LEVELS; ubRank++) {
    ubMilitiaCnt = MilitiaInSectorOfRank(sMapX, sMapY, ubRank);

    // check each guy at each rank to see if he defects
    for (ubCount = 0; ubCount < ubMilitiaCnt; ubCount++) {
      switch (ubRank) {
        case Enum126.GREEN_MILITIA:
          uiChanceToDefect = 50;
          break;
        case Enum126.REGULAR_MILITIA:
          uiChanceToDefect = 75;
          break;
        case Enum126.ELITE_MILITIA:
          uiChanceToDefect = 90;
          break;
        default:
          Assert(0);
          return;
      }

      // roll the bones; should I stay or should I go now?  (for you music fans out there)
      if (Random(100) < uiChanceToDefect) {
        // B'bye!  (for you SNL fans out there)
        StrategicRemoveMilitiaFromSector(sMapX, sMapY, ubRank, 1);
      }
    }
  }
}

export function CountAllMilitiaInSector(sMapX: INT16, sMapY: INT16): UINT8 {
  let ubMilitiaTotal: UINT8 = 0;
  let ubRank: UINT8;

  // find out if there are any town militia in this SECTOR (don't care about other sectors in same town)
  for (ubRank = 0; ubRank < Enum126.MAX_MILITIA_LEVELS; ubRank++) {
    ubMilitiaTotal += MilitiaInSectorOfRank(sMapX, sMapY, ubRank);
  }

  return ubMilitiaTotal;
}

export function MilitiaInSectorOfRank(sMapX: INT16, sMapY: INT16, ubRank: UINT8): UINT8 {
  return SectorInfo[SECTOR(sMapX, sMapY)].ubNumberOfCivsAtLevel[ubRank];
}

export function SectorOursAndPeaceful(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  // if this sector is currently loaded
  if ((sMapX == gWorldSectorX) && (sMapY == gWorldSectorY) && (bMapZ == gbWorldSectorZ)) {
    // and either there are enemies prowling this sector, or combat is in progress
    if (gTacticalStatus.fEnemyInSector || (gTacticalStatus.uiFlags & INCOMBAT)) {
      return false;
    }
  }

  // if sector is controlled by enemies, it's not ours (duh!)
  if (!bMapZ && StrategicMap[sMapX + sMapY * MAP_WORLD_X].fEnemyControlled == true) {
    return false;
  }

  if (NumHostilesInSector(sMapX, sMapY, bMapZ)) {
    return false;
  }

  // safe & secure, s'far as we can tell
  return true;
}

function InitFriendlyTownSectorServer(ubTownId: UINT8, sSkipSectorX: INT16, sSkipSectorY: INT16): void {
  // reset globals
  gubTownSectorServerTownId = ubTownId;
  gsTownSectorServerSkipX = sSkipSectorX;
  gsTownSectorServerSkipY = sSkipSectorY;

  gubTownSectorServerIndex = 0;
}

// this feeds the X,Y of the next town sector on the town list for the town specified at initialization
// it will skip an entry that matches the skip X/Y value if one was specified at initialization
// MUST CALL InitFriendlyTownSectorServer() before using!!!
function ServeNextFriendlySectorInTown(sNeighbourX: Pointer<INT16>, sNeighbourY: Pointer<INT16>): boolean {
  let iTownSector: INT32;
  let sMapX: INT16;
  let sMapY: INT16;
  let fStopLooking: boolean = false;

  do {
    // have we reached the end of the town list?
    if (pTownNamesList[gubTownSectorServerIndex] == Enum135.BLANK_SECTOR) {
      // end of list reached
      return false;
    }

    iTownSector = pTownLocationsList[gubTownSectorServerIndex];

    // if this sector is in the town we're looking for
    if (StrategicMap[iTownSector].bNameId == gubTownSectorServerTownId) {
      // A sector in the specified town.  Calculate its X & Y sector compotents
      sMapX = iTownSector % MAP_WORLD_X;
      sMapY = iTownSector / MAP_WORLD_X;

      // Make sure we're not supposed to skip it
      if ((sMapX != gsTownSectorServerSkipX) || (sMapY != gsTownSectorServerSkipY)) {
        // check if it's "friendly" - not enemy controlled, no enemies in it, no combat in progress
        if (SectorOursAndPeaceful(sMapX, sMapY, 0)) {
          // then that's it!
          sNeighbourX.value = sMapX;
          sNeighbourY.value = sMapY;

          fStopLooking = true;
        }
      }
    }

    // advance to next entry in town list
    gubTownSectorServerIndex++;
  } while (!fStopLooking);

  // found & returning a valid sector
  return true;
}

export function HandleInterfaceMessageForCostOfTrainingMilitia(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sString: string /* CHAR16[128] */;
  let pCenteringRect: SGPRect = createSGPRectFrom(0, 0, 640, INV_INTERFACE_START_Y);
  let iNumberOfSectors: INT32 = 0;

  pMilitiaTrainerSoldier = pSoldier;

  // grab total number of sectors
  iNumberOfSectors = GetNumberOfUnpaidTrainableSectors();
  Assert(iNumberOfSectors > 0);

  // get total cost
  giTotalCostOfTraining = MILITIA_TRAINING_COST * iNumberOfSectors;
  Assert(giTotalCostOfTraining > 0);

  gfYesNoPromptIsForContinue = false;

  if (LaptopSaveInfo.iCurrentBalance < giTotalCostOfTraining) {
    sString = swprintf(pMilitiaConfirmStrings[8], giTotalCostOfTraining);
    DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, CantTrainMilitiaOkBoxCallback);
    return;
  }

  // ok to start training, ask player

  if (iNumberOfSectors > 1) {
    sString = swprintf(pMilitiaConfirmStrings[7], iNumberOfSectors, giTotalCostOfTraining, pMilitiaConfirmStrings[1]);
  } else {
    sString = swprintf("%s%d. %s", pMilitiaConfirmStrings[0], giTotalCostOfTraining, pMilitiaConfirmStrings[1]);
  }

  // if we are in mapscreen, make a pop up
  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, PayMilitiaTrainingYesNoBoxCallback);
  } else {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, PayMilitiaTrainingYesNoBoxCallback, addressof(pCenteringRect));
  }

  return;
}

function DoContinueMilitiaTrainingMessageBox(sSectorX: INT16, sSectorY: INT16, str: string /* Pointer<UINT16> */, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK): void {
  if (sSectorX <= 10 && sSectorY >= 6 && sSectorY <= 11) {
    DoLowerScreenIndependantMessageBox(str, usFlags, ReturnCallback);
  } else {
    DoScreenIndependantMessageBox(str, usFlags, ReturnCallback);
  }
}

export function HandleInterfaceMessageForContinuingTrainingMilitia(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sString: string /* CHAR16[128] */;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let sStringB: string /* CHAR16[128] */;
  let bTownId: INT8;

  sSectorX = pSoldier.value.sSectorX;
  sSectorY = pSoldier.value.sSectorY;

  Assert(SectorInfo[SECTOR(sSectorX, sSectorY)].fMilitiaTrainingPaid == false);

  pMilitiaTrainerSoldier = pSoldier;

  gfYesNoPromptIsForContinue = true;

  // is there enough loyalty to continue training
  if (DoesSectorMercIsInHaveSufficientLoyaltyToTrainMilitia(pSoldier) == false) {
    // loyalty too low to continue training
    sString = swprintf(pMilitiaConfirmStrings[9], pTownNames[GetTownIdForSector(sSectorX, sSectorY)], MIN_RATING_TO_TRAIN_TOWN);
    DoContinueMilitiaTrainingMessageBox(sSectorX, sSectorY, sString, MSG_BOX_FLAG_OK, CantTrainMilitiaOkBoxCallback);
    return;
  }

  if (IsMilitiaTrainableFromSoldiersSectorMaxed(pSoldier)) {
    // we're full!!! go home!
    bTownId = GetTownIdForSector(sSectorX, sSectorY);
    if (bTownId == Enum135.BLANK_SECTOR) {
      // wilderness SAM site
      sStringB = GetSectorIDString(sSectorX, sSectorY, 0, true);
      sString = swprintf(pMilitiaConfirmStrings[10], sStringB, GetSectorIDString, MIN_RATING_TO_TRAIN_TOWN);
    } else {
      // town
      sString = swprintf(pMilitiaConfirmStrings[10], pTownNames[bTownId], MIN_RATING_TO_TRAIN_TOWN);
    }
    DoContinueMilitiaTrainingMessageBox(sSectorX, sSectorY, sString, MSG_BOX_FLAG_OK, CantTrainMilitiaOkBoxCallback);
    return;
  }

  // continue training always handles just one sector at a time
  giTotalCostOfTraining = MILITIA_TRAINING_COST;

  // can player afford to continue training?
  if (LaptopSaveInfo.iCurrentBalance < giTotalCostOfTraining) {
    // can't afford to continue training
    sString = swprintf(pMilitiaConfirmStrings[8], giTotalCostOfTraining);
    DoContinueMilitiaTrainingMessageBox(sSectorX, sSectorY, sString, MSG_BOX_FLAG_OK, CantTrainMilitiaOkBoxCallback);
    return;
  }

  // ok to continue, ask player

  sStringB = GetSectorIDString(sSectorX, sSectorY, 0, true);
  sString = swprintf(pMilitiaConfirmStrings[3], sStringB, pMilitiaConfirmStrings[4], giTotalCostOfTraining);

  // ask player whether he'd like to continue training
  // DoContinueMilitiaTrainingMessageBox( sSectorX, sSectorY, sString, MSG_BOX_FLAG_YESNO, PayMilitiaTrainingYesNoBoxCallback );
  DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, PayMilitiaTrainingYesNoBoxCallback);
}

// IMPORTANT: This same callback is used both for initial training and for continue training prompt
// use 'gfYesNoPromptIsForContinue' flag to tell them apart
function PayMilitiaTrainingYesNoBoxCallback(bExitValue: UINT8): void {
  let sString: string /* CHAR16[128] */;

  Assert(giTotalCostOfTraining > 0);

  // yes
  if (bExitValue == MSG_BOX_RETURN_YES) {
    // does the player have enough
    if (LaptopSaveInfo.iCurrentBalance >= giTotalCostOfTraining) {
      if (gfYesNoPromptIsForContinue) {
        ContinueTrainingInThisSector();
      } else {
        StartTrainingInAllUnpaidTrainableSectors();
      }

      // this completes the training prompt sequence
      pMilitiaTrainerSoldier = null;
    } else // can't afford it
    {
      StopTimeCompression();

      sString = swprintf("%s", pMilitiaConfirmStrings[2]);
      DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, CantTrainMilitiaOkBoxCallback);
    }
  } else if (bExitValue == MSG_BOX_RETURN_NO) {
    StopTimeCompression();

    MilitiaTrainingRejected();
  }

  return;
}

function CantTrainMilitiaOkBoxCallback(bExitValue: UINT8): void {
  MilitiaTrainingRejected();
  return;
}

// IMPORTANT: This same callback is used both for initial training and for continue training prompt
// use 'gfYesNoPromptIsForContinue' flag to tell them apart
function MilitiaTrainingRejected(): void {
  if (gfYesNoPromptIsForContinue) {
    // take all mercs in that sector off militia training
    ResetAssignmentOfMercsThatWereTrainingMilitiaInThisSector(pMilitiaTrainerSoldier.value.sSectorX, pMilitiaTrainerSoldier.value.sSectorY);
  } else {
    // take all mercs in unpaid sectors EVERYWHERE off militia training
    ResetAssignmentsForMercsTrainingUnpaidSectorsInSelectedList(0);
  }

  // this completes the training prompt sequence
  pMilitiaTrainerSoldier = null;
}

export function HandleMilitiaStatusInCurrentMapBeforeLoadingNewMap(): void {
  if (gTacticalStatus.Team[MILITIA_TEAM].bSide != 0) {
    // handle militia defections and reset team to friendly
    HandleMilitiaDefections(gWorldSectorX, gWorldSectorY);
    gTacticalStatus.Team[MILITIA_TEAM].bSide = 0;
  } else if (!gfAutomaticallyStartAutoResolve) {
    // Don't promote militia if we are going directly to autoresolve to finish the current battle.
    HandleMilitiaPromotions();
  }
}

export function CanNearbyMilitiaScoutThisSector(sSectorX: INT16, sSectorY: INT16): boolean {
  let sSectorValue: INT16 = 0;
  let sSector: INT16 = 0;
  let sCounterA: INT16 = 0;
  let sCounterB: INT16 = 0;
  let ubScoutingRange: UINT8 = 1;

  // get the sector value
  sSector = sSectorX + sSectorY * MAP_WORLD_X;

  for (sCounterA = sSectorX - ubScoutingRange; sCounterA <= sSectorX + ubScoutingRange; sCounterA++) {
    for (sCounterB = sSectorY - ubScoutingRange; sCounterB <= sSectorY + ubScoutingRange; sCounterB++) {
      // skip out of bounds sectors
      if ((sCounterA < 1) || (sCounterA > 16) || (sCounterB < 1) || (sCounterB > 16)) {
        continue;
      }

      sSectorValue = SECTOR(sCounterA, sCounterB);

      // check if any sort of militia here
      if (SectorInfo[sSectorValue].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA]) {
        return true;
      } else if (SectorInfo[sSectorValue].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA]) {
        return true;
      } else if (SectorInfo[sSectorValue].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA]) {
        return true;
      }
    }
  }

  return false;
}

export function IsTownFullMilitia(bTownId: INT8): boolean {
  let iCounter: INT32 = 0;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let iNumberOfMilitia: INT32 = 0;
  let iMaxNumber: INT32 = 0;

  while (pTownNamesList[iCounter] != 0) {
    if (pTownNamesList[iCounter] == bTownId) {
      // get the sector x and y
      sSectorX = pTownLocationsList[iCounter] % MAP_WORLD_X;
      sSectorY = pTownLocationsList[iCounter] / MAP_WORLD_X;

      // if sector is ours get number of militia here
      if (SectorOursAndPeaceful(sSectorX, sSectorY, 0)) {
        // don't count GREEN militia, they can be trained into regulars first
        iNumberOfMilitia += MilitiaInSectorOfRank(sSectorX, sSectorY, Enum126.REGULAR_MILITIA);
        iNumberOfMilitia += MilitiaInSectorOfRank(sSectorX, sSectorY, Enum126.ELITE_MILITIA);
        iMaxNumber += MAX_ALLOWABLE_MILITIA_PER_SECTOR;
      }
    }

    iCounter++;
  }

  // now check the number of militia
  if (iMaxNumber > iNumberOfMilitia) {
    return false;
  }

  return true;
}

export function IsSAMSiteFullOfMilitia(sSectorX: INT16, sSectorY: INT16): boolean {
  let fSamSitePresent: boolean = false;
  let iNumberOfMilitia: INT32 = 0;
  let iMaxNumber: INT32 = 0;

  // check if SAM site is ours?
  fSamSitePresent = IsThisSectorASAMSector(sSectorX, sSectorY, 0);

  if (fSamSitePresent == false) {
    return false;
  }

  if (SectorOursAndPeaceful(sSectorX, sSectorY, 0)) {
    // don't count GREEN militia, they can be trained into regulars first
    iNumberOfMilitia += MilitiaInSectorOfRank(sSectorX, sSectorY, Enum126.REGULAR_MILITIA);
    iNumberOfMilitia += MilitiaInSectorOfRank(sSectorX, sSectorY, Enum126.ELITE_MILITIA);
    iMaxNumber += MAX_ALLOWABLE_MILITIA_PER_SECTOR;
  }

  // now check the number of militia
  if (iMaxNumber > iNumberOfMilitia) {
    return false;
  }

  return true;
}

function HandleCompletionOfTownTrainingByGroupWithTrainer(pTrainer: Pointer<SOLDIERTYPE>): void {
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let bSectorZ: INT8 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iCounter: INT32 = 0;

  // get the sector values
  sSectorX = pTrainer.value.sSectorX;
  sSectorY = pTrainer.value.sSectorY;
  bSectorZ = pTrainer.value.bSectorZ;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // valid character?
    if (gCharactersList[iCounter].fValid == false) {
      // nope
      continue;
    }

    pSoldier = addressof(Menptr[gCharactersList[iCounter].usSolID]);

    // valid soldier?
    if (pSoldier.value.bActive == false) {
      continue;
    }

    if ((pSoldier.value.bAssignment == Enum117.TRAIN_TOWN) && (pSoldier.value.sSectorX == sSectorX) && (pSoldier.value.sSectorY == sSectorY) && (pSoldier.value.bSectorZ == bSectorZ)) {
      // done assignment
      AssignmentDone(pSoldier, false, false);
    }
  }

  return;
}

export function AddSectorForSoldierToListOfSectorsThatCompletedMilitiaTraining(pSoldier: Pointer<SOLDIERTYPE>): void {
  let iCounter: INT32 = 0;
  let sSector: INT16 = 0;
  let sCurrentSector: INT16 = 0;
  let pCurrentSoldier: Pointer<SOLDIERTYPE> = null;

  // get the sector value
  sSector = pSoldier.value.sSectorX + pSoldier.value.sSectorY * MAP_WORLD_X;

  while (giListOfMercsInSectorsCompletedMilitiaTraining[iCounter] != -1) {
    // get the current soldier
    pCurrentSoldier = addressof(Menptr[giListOfMercsInSectorsCompletedMilitiaTraining[iCounter]]);

    // get the current sector value
    sCurrentSector = pCurrentSoldier.value.sSectorX + pCurrentSoldier.value.sSectorY * MAP_WORLD_X;

    // is the merc's sector already in the list?
    if (sCurrentSector == sSector) {
      // already here
      return;
    }

    iCounter++;

    Assert(iCounter < SIZE_OF_MILITIA_COMPLETED_TRAINING_LIST);
  }

  // add merc to the list
  giListOfMercsInSectorsCompletedMilitiaTraining[iCounter] = pSoldier.value.ubID;

  return;
}

// clear out the list of training sectors...should be done once the list is posted
export function ClearSectorListForCompletedTrainingOfMilitia(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < SIZE_OF_MILITIA_COMPLETED_TRAINING_LIST; iCounter++) {
    giListOfMercsInSectorsCompletedMilitiaTraining[iCounter] = -1;
  }

  return;
}

export function HandleContinueOfTownTraining(): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iCounter: INT32 = 0;
  let fContinueEventPosted: boolean = false;

  while (giListOfMercsInSectorsCompletedMilitiaTraining[iCounter] != -1) {
    // get the soldier
    pSoldier = addressof(Menptr[giListOfMercsInSectorsCompletedMilitiaTraining[iCounter]]);

    if (pSoldier.value.bActive) {
      fContinueEventPosted = true;
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_CONTINUE_TRAINING_MILITIA, pSoldier.value.ubProfile, 0, 0, 0, 0);

      // now set all of these peoples assignment done too
      // HandleInterfaceMessageForContinuingTrainingMilitia( pSoldier );
    }

    // next entry
    iCounter++;
  }

  // now clear the list
  ClearSectorListForCompletedTrainingOfMilitia();

  if (fContinueEventPosted) {
    // ATE: If this event happens in tactical mode we will be switching at some time to mapscreen...
    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      gfEnteringMapScreen = true;
    }

    // If the militia view isn't currently active, then turn it on when prompting to continue training.
    if (!fShowMilitia) {
      ToggleShowMilitiaMode();
    }
  }

  return;
}

function BuildListOfUnpaidTrainableSectors(): void {
  let iCounter: INT32 = 0;
  let iCounterB: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  memset(gsUnpaidStrategicSector, 0, sizeof(INT16) * MAX_CHARACTER_COUNT);

  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
      // valid character?
      if (gCharactersList[iCounter].fValid) {
        // selected?
        if ((fSelectedListOfMercsForMapScreen[iCounter] == true) || (iCounter == bSelectedAssignChar)) {
          pSoldier = addressof(Menptr[gCharactersList[iCounter].usSolID]);

          if (CanCharacterTrainMilitia(pSoldier) == true) {
            if (SectorInfo[SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY)].fMilitiaTrainingPaid == false) {
              // check to see if this sector is a town and needs equipment
              gsUnpaidStrategicSector[iCounter] = CALCULATE_STRATEGIC_INDEX(pSoldier.value.sSectorX, pSoldier.value.sSectorY);
            }
          }
        }
      }
    }
  } else {
    // handle for tactical
    pSoldier = addressof(Menptr[gusUIFullTargetID]);
    iCounter = 0;

    if (CanCharacterTrainMilitia(pSoldier) == true) {
      if (SectorInfo[SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY)].fMilitiaTrainingPaid == false) {
        // check to see if this sector is a town and needs equipment
        gsUnpaidStrategicSector[iCounter] = CALCULATE_STRATEGIC_INDEX(pSoldier.value.sSectorX, pSoldier.value.sSectorY);
      }
    }
  }

  // now clean out repeated sectors
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT - 1; iCounter++) {
    if (gsUnpaidStrategicSector[iCounter] > 0) {
      for (iCounterB = iCounter + 1; iCounterB < MAX_CHARACTER_COUNT; iCounterB++) {
        if (gsUnpaidStrategicSector[iCounterB] == gsUnpaidStrategicSector[iCounter]) {
          gsUnpaidStrategicSector[iCounterB] = 0;
        }
      }
    }
  }
}

function GetNumberOfUnpaidTrainableSectors(): INT32 {
  let iCounter: INT32 = 0;
  let iNumberOfSectors: INT32 = 0;

  BuildListOfUnpaidTrainableSectors();

  // now count up the results
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gsUnpaidStrategicSector[iCounter] > 0) {
      iNumberOfSectors++;
    }
  }

  // return the result
  return iNumberOfSectors;
}

function StartTrainingInAllUnpaidTrainableSectors(): void {
  let iCounter: INT32 = 0;
  let ubSector: UINT8;

  SetAssignmentForList(Enum117.TRAIN_TOWN, 0);

  BuildListOfUnpaidTrainableSectors();

  // pay up in each sector
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gsUnpaidStrategicSector[iCounter] > 0) {
      // convert strategic sector to 0-255 system
      ubSector = STRATEGIC_INDEX_TO_SECTOR_INFO(gsUnpaidStrategicSector[iCounter]);
      PayForTrainingInSector(ubSector);
    }
  }
}

function ContinueTrainingInThisSector(): void {
  let ubSector: UINT8;

  Assert(pMilitiaTrainerSoldier);

  // pay up in the sector where pMilitiaTrainerSoldier is
  ubSector = SECTOR(pMilitiaTrainerSoldier.value.sSectorX, pMilitiaTrainerSoldier.value.sSectorY);
  PayForTrainingInSector(ubSector);
}

function PayForTrainingInSector(ubSector: UINT8): void {
  Assert(SectorInfo[ubSector].fMilitiaTrainingPaid == false);

  // spend the money
  AddTransactionToPlayersBook(Enum80.TRAIN_TOWN_MILITIA, ubSector, GetWorldTotalMin(), -(MILITIA_TRAINING_COST));

  // mark this sector sectors as being paid up
  SectorInfo[ubSector].fMilitiaTrainingPaid = true;

  // reset done flags
  ResetDoneFlagForAllMilitiaTrainersInSector(ubSector);
}

function ResetDoneFlagForAllMilitiaTrainersInSector(ubSector: UINT8): void {
  let iCounter: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  for (iCounter = 0; iCounter <= gTacticalStatus.Team[OUR_TEAM].bLastID; iCounter++) {
    pSoldier = addressof(Menptr[iCounter]);

    if (pSoldier.value.bActive) {
      if (pSoldier.value.bAssignment == Enum117.TRAIN_TOWN) {
        if ((SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY) == ubSector) && (pSoldier.value.bSectorZ == 0)) {
          pSoldier.value.fDoneAssignmentAndNothingToDoFlag = false;
          pSoldier.value.usQuoteSaidExtFlags &= ~SOLDIER_QUOTE_SAID_DONE_ASSIGNMENT;
        }
      }
    }
  }
}

export function MilitiaTrainingAllowedInSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let bTownId: INT8;
  let fSamSitePresent: boolean = false;

  if (bSectorZ != 0) {
    return false;
  }

  fSamSitePresent = IsThisSectorASAMSector(sSectorX, sSectorY, bSectorZ);

  if (fSamSitePresent) {
    // all SAM sites may have militia trained at them
    return true;
  }

  bTownId = GetTownIdForSector(sSectorX, sSectorY);

  return MilitiaTrainingAllowedInTown(bTownId);
}

export function MilitiaTrainingAllowedInTown(bTownId: INT8): boolean {
  switch (bTownId) {
    case Enum135.DRASSEN:
    case Enum135.ALMA:
    case Enum135.GRUMM:
    case Enum135.CAMBRIA:
    case Enum135.BALIME:
    case Enum135.MEDUNA:
    case Enum135.CHITZENA:
      return true;

    case Enum135.OMERTA:
    case Enum135.ESTONI:
    case Enum135.SAN_MONA:
    case Enum135.TIXA:
    case Enum135.ORTA:
      // can't keep militia in these towns
      return false;

    case Enum135.BLANK_SECTOR:
    default:
      // not a town sector!
      return false;
  }
}

export function BuildMilitiaPromotionsString(str: Pointer<string> /* Pointer<UINT16> */): void {
  let pStr: string /* UINT16[256] */;
  let fAddSpace: boolean = false;
  str = "";

  if (!gbMilitiaPromotions) {
    return;
  }
  if (gbGreenToElitePromotions > 1) {
    pStr = swprintf(gzLateLocalizedString[22], gbGreenToElitePromotions);
    str += pStr;
    fAddSpace = true;
  } else if (gbGreenToElitePromotions == 1) {
    str += gzLateLocalizedString[29];
    fAddSpace = true;
  }

  if (gbGreenToRegPromotions > 1) {
    if (fAddSpace) {
      str += " ";
    }
    pStr = swprintf(gzLateLocalizedString[23], gbGreenToRegPromotions);
    str += pStr;
    fAddSpace = true;
  } else if (gbGreenToRegPromotions == 1) {
    if (fAddSpace) {
      str += " ";
    }
    str += gzLateLocalizedString[30];
    fAddSpace = true;
  }

  if (gbRegToElitePromotions > 1) {
    if (fAddSpace) {
      str += " ";
    }
    pStr = swprintf(gzLateLocalizedString[24], gbRegToElitePromotions);
    str += pStr;
  } else if (gbRegToElitePromotions == 1) {
    if (fAddSpace) {
      str += " ";
    }
    str += gzLateLocalizedString[31];
    fAddSpace = true;
  }

  // Clear the fields
  gbGreenToElitePromotions = 0;
  gbGreenToRegPromotions = 0;
  gbRegToElitePromotions = 0;
  gbMilitiaPromotions = 0;
}

}
