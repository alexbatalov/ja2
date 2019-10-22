const MIN_FLIGHT_PREP_TIME = 6;

// ATE: Globals that dictate where the mercs will land once being hired
// Default to Omerta
// Saved in general saved game structure
let gsMercArriveSectorX: INT16 = 9;
let gsMercArriveSectorY: INT16 = 1;

function HireMerc(pHireMerc: Pointer<MERC_HIRE_STRUCT>): INT8 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let iNewIndex: UINT8;
  let ubCount: UINT8 = 0;
  let ubCurrentSoldier: UINT8 = pHireMerc->ubProfileID;
  let pMerc: Pointer<MERCPROFILESTRUCT>;
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let fReturn: BOOLEAN = FALSE;
  pMerc = &gMercProfiles[ubCurrentSoldier];

// If we are to disregard the ststus of the merc
    // If the merc is away, Dont hire him, or if the merc is only slightly annoyed at the player
    if ((pMerc->bMercStatus != 0) && (pMerc->bMercStatus != MERC_ANNOYED_BUT_CAN_STILL_CONTACT) && (pMerc->bMercStatus != MERC_HIRED_BUT_NOT_ARRIVED_YET))
      return MERC_HIRE_FAILED;

  if (NumberOfMercsOnPlayerTeam() >= 18)
    return MERC_HIRE_OVER_20_MERCS_HIRED;

  // ATE: if we are to use landing zone, update to latest value
  // they will be updated again just before arrival...
  if (pHireMerc->fUseLandingZoneForArrival) {
    pHireMerc->sSectorX = gsMercArriveSectorX;
    pHireMerc->sSectorY = gsMercArriveSectorY;
    pHireMerc->bSectorZ = 0;
  }

  // BUILD STRUCTURES
  memset(&MercCreateStruct, 0, sizeof(MercCreateStruct));
  MercCreateStruct.ubProfile = ubCurrentSoldier;
  MercCreateStruct.fPlayerMerc = TRUE;
  MercCreateStruct.sSectorX = pHireMerc->sSectorX;
  MercCreateStruct.sSectorY = pHireMerc->sSectorY;
  MercCreateStruct.bSectorZ = pHireMerc->bSectorZ;
  MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
  MercCreateStruct.fCopyProfileItemsOver = pHireMerc->fCopyProfileItemsOver;

  if (!TacticalCreateSoldier(&MercCreateStruct, &iNewIndex)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "TacticalCreateSoldier in HireMerc():  Failed to Add Merc");
    return MERC_HIRE_FAILED;
  }

  if (DidGameJustStart()) {
// OK, CHECK FOR FIRST GUY, GIVE HIM SPECIAL ITEM!
    if (iNewIndex == 0) {
      // OK, give this item to our merc!
      let Object: OBJECTTYPE;

      // make an objecttype
      memset(&Object, 0, sizeof(OBJECTTYPE));
      Object.usItem = LETTER;
      Object.ubNumberOfObjects = 1;
      Object.bStatus[0] = 100;
      // Give it
      fReturn = AutoPlaceObject(MercPtrs[iNewIndex], &Object, FALSE);
      Assert(fReturn);
    }

    // Set insertion for first time in chopper

    // ATE: Insert for demo , not using the heli sequence....
    pHireMerc->ubInsertionCode = INSERTION_CODE_CHOPPER;
  }

  // record how long the merc will be gone for
  pMerc->bMercStatus = pHireMerc->iTotalContractLength;

  pSoldier = &Menptr[iNewIndex];

  // Copy over insertion data....
  pSoldier->ubStrategicInsertionCode = pHireMerc->ubInsertionCode;
  pSoldier->usStrategicInsertionData = pHireMerc->usInsertionData;
  // ATE: Copy over value for using alnding zone to soldier type
  pSoldier->fUseLandingZoneForArrival = pHireMerc->fUseLandingZoneForArrival;

  // Set assignment
  // ATE: If first time, make ON_DUTY, otherwise GUARD
  if ((pSoldier->bAssignment != IN_TRANSIT)) {
    SetTimeOfAssignmentChangeForMerc(pSoldier);
  }
  ChangeSoldiersAssignment(pSoldier, IN_TRANSIT);

  // set the contract length
  pSoldier->iTotalContractLength = pHireMerc->iTotalContractLength;

  // reset the insurance values
  pSoldier->iStartOfInsuranceContract = 0;
  pSoldier->iTotalLengthOfInsuranceContract = 0;

  // Init the contract charge
  //	pSoldier->iTotalContractCharge = 0;

  // store arrival time in soldier structure so map screen can display it
  pSoldier->uiTimeSoldierWillArrive = pHireMerc->uiTimeTillMercArrives;

  // Set the type of merc

  if (DidGameJustStart()) {
    // Set time of initial merc arrival in minutes
    pHireMerc->uiTimeTillMercArrives = (STARTING_TIME + FIRST_ARRIVAL_DELAY) / NUM_SEC_IN_MIN;

// ATE: Insert for demo , not using the heli sequence....
    // Set insertion for first time in chopper
    pHireMerc->ubInsertionCode = INSERTION_CODE_CHOPPER;

    // set when the merc's contract is finished
    pSoldier->iEndofContractTime = GetMidnightOfFutureDayInMinutes(pSoldier->iTotalContractLength) + (GetHourWhenContractDone(pSoldier) * 60);
  } else {
    // set when the merc's contract is finished ( + 1 cause it takes a day for the merc to arrive )
    pSoldier->iEndofContractTime = GetMidnightOfFutureDayInMinutes(1 + pSoldier->iTotalContractLength) + (GetHourWhenContractDone(pSoldier) * 60);
  }

  // Set the time and ID of the last hired merc will arrive
  LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = pHireMerc->ubProfileID;
  LaptopSaveInfo.sLastHiredMerc.uiArrivalTime = pHireMerc->uiTimeTillMercArrives;

  // if we are trying to hire a merc that should arrive later, put the merc in the queue
  if (pHireMerc->uiTimeTillMercArrives != 0) {
    AddStrategicEvent(EVENT_DELAYED_HIRING_OF_MERC, pHireMerc->uiTimeTillMercArrives, pSoldier->ubID);

    // specify that the merc is hired but hasnt arrived yet
    pMerc->bMercStatus = MERC_HIRED_BUT_NOT_ARRIVED_YET;
  }

  // if the merc is an AIM merc
  if (ubCurrentSoldier < 40) {
    pSoldier->ubWhatKindOfMercAmI = MERC_TYPE__AIM_MERC;
    // determine how much the contract is, and remember what type of contract he got
    if (pHireMerc->iTotalContractLength == 1) {
      // pSoldier->iTotalContractCharge = gMercProfiles[ pSoldier->ubProfile ].sSalary;
      pSoldier->bTypeOfLastContract = CONTRACT_EXTEND_1_DAY;
      pSoldier->iTimeCanSignElsewhere = GetWorldTotalMin();
    } else if (pHireMerc->iTotalContractLength == 7) {
      // pSoldier->iTotalContractCharge = gMercProfiles[ pSoldier->ubProfile ].uiWeeklySalary;
      pSoldier->bTypeOfLastContract = CONTRACT_EXTEND_1_WEEK;
      pSoldier->iTimeCanSignElsewhere = GetWorldTotalMin();
    } else if (pHireMerc->iTotalContractLength == 14) {
      // pSoldier->iTotalContractCharge = gMercProfiles[ pSoldier->ubProfile ].uiBiWeeklySalary;
      pSoldier->bTypeOfLastContract = CONTRACT_EXTEND_2_WEEK;
      // These luck fellows need to stay the whole duration!
      pSoldier->iTimeCanSignElsewhere = pSoldier->iEndofContractTime;
    }

    // remember the medical deposit we PAID.  The one in his profile can increase when he levels!
    pSoldier->usMedicalDeposit = gMercProfiles[pSoldier->ubProfile].sMedicalDepositAmount;
  }
  // if the merc is from M.E.R.C.
  else if ((ubCurrentSoldier >= 40) && (ubCurrentSoldier <= 50)) {
    pSoldier->ubWhatKindOfMercAmI = MERC_TYPE__MERC;
    // pSoldier->iTotalContractCharge = -1;

    gMercProfiles[pSoldier->ubProfile].iMercMercContractLength = 1;

    // Set starting conditions for the merc
    pSoldier->iStartContractTime = GetWorldDay();

    AddHistoryToPlayersLog(HISTORY_HIRED_MERC_FROM_MERC, ubCurrentSoldier, GetWorldTotalMin(), -1, -1);
  }
  // If the merc is from IMP, (ie a player character)
  else if ((ubCurrentSoldier >= 51) && (ubCurrentSoldier < 57)) {
    pSoldier->ubWhatKindOfMercAmI = MERC_TYPE__PLAYER_CHARACTER;
    // pSoldier->iTotalContractCharge = -1;
  }
  // else its a NPC merc
  else {
    pSoldier->ubWhatKindOfMercAmI = MERC_TYPE__NPC;
    // pSoldier->iTotalContractCharge = -1;
  }

  // remove the merc from the Personnel screens departed list ( if they have never been hired before, its ok to call it )
  RemoveNewlyHiredMercFromPersonnelDepartedList(pSoldier->ubProfile);

  gfAtLeastOneMercWasHired = TRUE;
  return MERC_HIRE_OK;
}

function MercArrivesCallback(ubSoldierID: UINT8): void {
  let pMerc: Pointer<MERCPROFILESTRUCT>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiTimeOfPost: UINT32;

  if (!DidGameJustStart() && gsMercArriveSectorX == 9 && gsMercArriveSectorY == 1) {
    // Mercs arriving in A9.  This sector has been deemed as the always safe sector.
    // Seeing we don't support entry into a hostile sector (except for the beginning),
    // we will nuke any enemies in this sector first.
    if (gWorldSectorX != 9 || gWorldSectorY != 1 || gbWorldSectorZ) {
      EliminateAllEnemies(gsMercArriveSectorX, gsMercArriveSectorY);
    }
  }

  // This will update ANY soldiers currently schedules to arrive too
  CheckForValidArrivalSector();

  // stop time compression until player restarts it
  StopTimeCompression();

  pSoldier = &Menptr[ubSoldierID];

  pMerc = &gMercProfiles[pSoldier->ubProfile];

  // add the guy to a squad
  AddCharacterToAnySquad(pSoldier);

  // ATE: Make sure we use global.....
  if (pSoldier->fUseLandingZoneForArrival) {
    pSoldier->sSectorX = gsMercArriveSectorX;
    pSoldier->sSectorY = gsMercArriveSectorY;
    pSoldier->bSectorZ = 0;
  }

  // Add merc to sector ( if it's the current one )
  if (gWorldSectorX == pSoldier->sSectorX && gWorldSectorY == pSoldier->sSectorY && pSoldier->bSectorZ == gbWorldSectorZ) {
    // OK, If this sector is currently loaded, and guy does not have CHOPPER insertion code....
    // ( which means we are at beginning of game if so )
    // Setup chopper....
    if (pSoldier->ubStrategicInsertionCode != INSERTION_CODE_CHOPPER && pSoldier->sSectorX == 9 && pSoldier->sSectorY == 1) {
      gfTacticalDoHeliRun = TRUE;

      // OK, If we are in mapscreen, get out...
      if (guiCurrentScreen == MAP_SCREEN) {
        // ATE: Make sure the current one is selected!
        ChangeSelectedMapSector(gWorldSectorX, gWorldSectorY, 0);

        RequestTriggerExitFromMapscreen(MAP_EXIT_TO_TACTICAL);
      }

      pSoldier->ubStrategicInsertionCode = INSERTION_CODE_CHOPPER;
    }

    UpdateMercInSector(pSoldier, pSoldier->sSectorX, pSoldier->sSectorY, pSoldier->bSectorZ);
  } else {
    // OK, otherwise, set them in north area, so once we load again, they are here.
    pSoldier->ubStrategicInsertionCode = INSERTION_CODE_NORTH;
  }

  if (pSoldier->ubStrategicInsertionCode != INSERTION_CODE_CHOPPER) {
    ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, TacticalStr[MERC_HAS_ARRIVED_STR], pSoldier->name);

    // ATE: He's going to say something, now that they've arrived...
    if (gTacticalStatus.bMercArrivingQuoteBeingUsed == FALSE && !gfFirstHeliRun) {
      gTacticalStatus.bMercArrivingQuoteBeingUsed = TRUE;

      // Setup the highlight sector value (note this isn't for mines but using same system)
      gsSectorLocatorX = pSoldier->sSectorX;
      gsSectorLocatorY = pSoldier->sSectorY;

      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_MINESECTOREVENT, 2, 0);
      TacticalCharacterDialogue(pSoldier, QUOTE_MERC_REACHED_DESTINATION);
      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_MINESECTOREVENT, 3, 0);
      TacticalCharacterDialogueWithSpecialEventEx(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_UNSET_ARRIVES_FLAG, 0, 0, 0);
    }
  }

  // record how long the merc will be gone for
  pMerc->bMercStatus = pSoldier->iTotalContractLength;

  // remember when excatly he ARRIVED in Arulco, in case he gets fired early
  pSoldier->uiTimeOfLastContractUpdate = GetWorldTotalMin();

  // set when the merc's contract is finished
  pSoldier->iEndofContractTime = GetMidnightOfFutureDayInMinutes(pSoldier->iTotalContractLength) + (GetHourWhenContractDone(pSoldier) * 60);

  // Do initial check for bad items
  if (pSoldier->bTeam == gbPlayerNum) {
    // ATE: Try to see if our equipment sucks!
    if (SoldierHasWorseEquipmentThanUsedTo(pSoldier)) {
      // Randomly anytime between 9:00, and 10:00
      uiTimeOfPost = 540 + Random(660);

      if (GetWorldMinutesInDay() < uiTimeOfPost) {
        AddSameDayStrategicEvent(EVENT_MERC_COMPLAIN_EQUIPMENT, uiTimeOfPost, pSoldier->ubProfile);
      }
    }
  }

  HandleMercArrivesQuotes(pSoldier);

  fTeamPanelDirty = TRUE;

  // if the currently selected sector has no one in it, select this one instead
  if (!CanGoToTacticalInSector(sSelMapX, sSelMapY, iCurrentMapSectorZ)) {
    ChangeSelectedMapSector(pSoldier->sSectorX, pSoldier->sSectorY, 0);
  }

  return;
}

function IsMercHireable(ubMercID: UINT8): BOOLEAN {
  // If the merc has an .EDT file, is not away on assignment, and isnt already hired (but not arrived yet), he is not DEAD and he isnt returning home
  if ((gMercProfiles[ubMercID].bMercStatus == MERC_HAS_NO_TEXT_FILE) || (gMercProfiles[ubMercID].bMercStatus > 0) || (gMercProfiles[ubMercID].bMercStatus == MERC_HIRED_BUT_NOT_ARRIVED_YET) || (gMercProfiles[ubMercID].bMercStatus == MERC_IS_DEAD) || (gMercProfiles[ubMercID].uiDayBecomesAvailable > 0) || (gMercProfiles[ubMercID].bMercStatus == MERC_WORKING_ELSEWHERE) || (gMercProfiles[ubMercID].bMercStatus == MERC_FIRED_AS_A_POW) || (gMercProfiles[ubMercID].bMercStatus == MERC_RETURNING_HOME))
    return FALSE;
  else
    return TRUE;
}

function IsMercDead(ubMercID: UINT8): BOOLEAN {
  if (gMercProfiles[ubMercID].bMercStatus == MERC_IS_DEAD)
    return TRUE;
  else
    return FALSE;
}

function IsTheSoldierAliveAndConcious(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (pSoldier->bLife >= CONSCIOUSNESS)
    return TRUE;
  else
    return FALSE;
}

function NumberOfMercsOnPlayerTeam(): UINT8 {
  let cnt: INT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bLastTeamID: INT16;
  let ubCount: UINT8 = 0;

  // Set locator to first merc
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

  for (pSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pSoldier++) {
    // if the is active, and is not a vehicle
    if (pSoldier->bActive && !(pSoldier->uiStatusFlags & SOLDIER_VEHICLE)) {
      ubCount++;
    }
  }

  return ubCount;
}

function HandleMercArrivesQuotes(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: INT8;
  let bHated: INT8;
  let bLastTeamID: INT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  // If we are approaching with helicopter, don't say any ( yet )
  if (pSoldier->ubStrategicInsertionCode != INSERTION_CODE_CHOPPER) {
    // Player-generated characters issue a comment about arriving in Omerta.
    if (pSoldier->ubWhatKindOfMercAmI == MERC_TYPE__PLAYER_CHARACTER) {
      if (gubQuest[QUEST_DELIVER_LETTER] == QUESTINPROGRESS) {
        TacticalCharacterDialogue(pSoldier, QUOTE_PC_DROPPED_OMERTA);
      }
    }

    // Check to see if anyone hates this merc and will now complain
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;
    // loop though all the mercs
    for (pTeamSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pTeamSoldier++) {
      if (pTeamSoldier->bActive) {
        if (pTeamSoldier->ubWhatKindOfMercAmI == MERC_TYPE__AIM_MERC) {
          bHated = WhichHated(pTeamSoldier->ubProfile, pSoldier->ubProfile);
          if (bHated != -1) {
            // hates the merc who has arrived and is going to gripe about it!
            switch (bHated) {
              case 0:
                TacticalCharacterDialogue(pTeamSoldier, QUOTE_HATED_1_ARRIVES);
                break;
              case 1:
                TacticalCharacterDialogue(pTeamSoldier, QUOTE_HATED_2_ARRIVES);
                break;
              default:
                break;
            }
          }
        }
      }
    }
  }
}

function GetMercArrivalTimeOfDay(): UINT32 {
  let uiCurrHour: UINT32;
  let uiMinHour: UINT32;

  // Pick a time...

  // First get the current time of day.....
  uiCurrHour = GetWorldHour();

  // Subtract the min time for any arrival....
  uiMinHour = uiCurrHour + MIN_FLIGHT_PREP_TIME;

  // OK, first check if we need to advance a whole day's time...
  // See if we have missed the last flight for the day...
  if ((uiCurrHour) > 13) // ( > 1:00 pm - too bad )
  {
    // 7:30 flight....
    return GetMidnightOfFutureDayInMinutes(1) + MERC_ARRIVE_TIME_SLOT_1;
  }

  // Well, now we can handle flights all in one day....
  // Find next possible flight
  if (uiMinHour <= 7) {
    return (GetWorldDayInMinutes() + MERC_ARRIVE_TIME_SLOT_1); // 7:30 am
  } else if (uiMinHour <= 13) {
    return (GetWorldDayInMinutes() + MERC_ARRIVE_TIME_SLOT_2); // 1:30 pm
  } else {
    return (GetWorldDayInMinutes() + MERC_ARRIVE_TIME_SLOT_3); // 7:30 pm
  }
}

function UpdateAnyInTransitMercsWithGlobalArrivalSector(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    if (pSoldier->bActive) {
      if (pSoldier->bAssignment == IN_TRANSIT) {
        if (pSoldier->fUseLandingZoneForArrival) {
          pSoldier->sSectorX = gsMercArriveSectorX;
          pSoldier->sSectorY = gsMercArriveSectorY;
          pSoldier->bSectorZ = 0;
        }
      }
    }
  }
}

function StrategicPythSpacesAway(sOrigin: INT16, sDest: INT16): INT16 {
  let sRows: INT16;
  let sCols: INT16;
  let sResult: INT16;

  sRows = abs((sOrigin / MAP_WORLD_X) - (sDest / MAP_WORLD_X));
  sCols = abs((sOrigin % MAP_WORLD_X) - (sDest % MAP_WORLD_X));

  // apply Pythagoras's theorem for right-handed triangle:
  // dist^2 = rows^2 + cols^2, so use the square root to get the distance
  sResult = sqrt((sRows * sRows) + (sCols * sCols));

  return sResult;
}

// ATE: This function will check if the current arrival sector
// is valid
// if there are enemies present, it's invalid
// if so, search around for nearest non-occupied sector.
function CheckForValidArrivalSector(): void {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGoodX: INT16;
  let sGoodY: INT16;
  let ubRadius: UINT8 = 4;
  let leftmost: INT32;
  let sSectorGridNo: INT16;
  let sSectorGridNo2: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let fFound: BOOLEAN = FALSE;
  let sString: CHAR16[] /* [1024] */;
  let zShortTownIDString1: CHAR16[] /* [50] */;
  let zShortTownIDString2: CHAR16[] /* [50] */;

  sSectorGridNo = gsMercArriveSectorX + (MAP_WORLD_X * gsMercArriveSectorY);

  // Check if valid...
  if (!StrategicMap[sSectorGridNo].fEnemyControlled) {
    return;
  }

  GetShortSectorString(gsMercArriveSectorX, gsMercArriveSectorY, zShortTownIDString1);

  // If here - we need to do a search!
  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSectorGridNo + (MAP_WORLD_X * cnt1)) / MAP_WORLD_X) * MAP_WORLD_X;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sSectorGridNo2 = sSectorGridNo + (MAP_WORLD_X * cnt1) + cnt2;

      if (sSectorGridNo2 >= 1 && sSectorGridNo2 < ((MAP_WORLD_X - 1) * (MAP_WORLD_X - 1)) && sSectorGridNo2 >= leftmost && sSectorGridNo2 < (leftmost + MAP_WORLD_X)) {
        if (!StrategicMap[sSectorGridNo2].fEnemyControlled && !StrategicMap[sSectorGridNo2].fEnemyAirControlled) {
          uiRange = StrategicPythSpacesAway(sSectorGridNo2, sSectorGridNo);

          if (uiRange < uiLowestRange) {
            sGoodY = cnt1;
            sGoodX = cnt2;
            uiLowestRange = uiRange;
            fFound = TRUE;
          }
        }
      }
    }
  }

  if (fFound) {
    gsMercArriveSectorX = gsMercArriveSectorX + sGoodX;
    gsMercArriveSectorY = gsMercArriveSectorY + sGoodY;

    UpdateAnyInTransitMercsWithGlobalArrivalSector();

    GetShortSectorString(gsMercArriveSectorX, gsMercArriveSectorY, zShortTownIDString2);

    swprintf(sString, L"Arrival of new recruits is being rerouted to sector %s, as scheduled drop-off point of sector %s is enemy occupied.", zShortTownIDString2, zShortTownIDString1);

    DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, NULL);
  }
}
