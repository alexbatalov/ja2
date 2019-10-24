let gubScreenCount: UINT8 = 0;

function InitNPCs(): void {
  let pProfile: Pointer<MERCPROFILESTRUCT>;

  // add the pilot at a random location!
  pProfile = addressof(gMercProfiles[Enum268.SKYRIDER]);
  switch (Random(4)) {
    case 0:
      pProfile.value.sSectorX = 15;
      pProfile.value.sSectorY = MAP_ROW_B;
      pProfile.value.bSectorZ = 0;
      break;
    case 1:
      pProfile.value.sSectorX = 14;
      pProfile.value.sSectorY = MAP_ROW_E;
      pProfile.value.bSectorZ = 0;
      break;
    case 2:
      pProfile.value.sSectorX = 12;
      pProfile.value.sSectorY = MAP_ROW_D;
      pProfile.value.bSectorZ = 0;
      break;
    case 3:
      pProfile.value.sSectorX = 16;
      pProfile.value.sSectorY = MAP_ROW_C;
      pProfile.value.bSectorZ = 0;
      break;
  }

  // use alternate map, with Skyrider's shack, in this sector
  SectorInfo[SECTOR(pProfile.value.sSectorX, pProfile.value.sSectorY)].uiFlags |= SF_USE_ALTERNATE_MAP;

  // set up Madlab's secret lab (he'll be added when the meanwhile scene occurs)

  switch (Random(4)) {
    case 0:
      // use alternate map in this sector
      SectorInfo[SECTOR(7, MAP_ROW_H)].uiFlags |= SF_USE_ALTERNATE_MAP;
      break;
    case 1:
      SectorInfo[SECTOR(16, MAP_ROW_H)].uiFlags |= SF_USE_ALTERNATE_MAP;
      break;
    case 2:
      SectorInfo[SECTOR(11, MAP_ROW_I)].uiFlags |= SF_USE_ALTERNATE_MAP;
      break;
    case 3:
      SectorInfo[SECTOR(4, MAP_ROW_E)].uiFlags |= SF_USE_ALTERNATE_MAP;
      break;
  }

  // add Micky in random location

  pProfile = addressof(gMercProfiles[Enum268.MICKY]);
  switch (Random(5)) {
    case 0:
      pProfile.value.sSectorX = 9;
      pProfile.value.sSectorY = MAP_ROW_G;
      pProfile.value.bSectorZ = 0;
      break;
    case 1:
      pProfile.value.sSectorX = 13;
      pProfile.value.sSectorY = MAP_ROW_D;
      pProfile.value.bSectorZ = 0;
      break;
    case 2:
      pProfile.value.sSectorX = 5;
      pProfile.value.sSectorY = MAP_ROW_C;
      pProfile.value.bSectorZ = 0;
      break;
    case 3:
      pProfile.value.sSectorX = 2;
      pProfile.value.sSectorY = MAP_ROW_H;
      pProfile.value.bSectorZ = 0;
      break;
    case 4:
      pProfile.value.sSectorX = 6;
      pProfile.value.sSectorY = MAP_ROW_C;
      pProfile.value.bSectorZ = 0;
      break;
  }

  // use alternate map in this sector
  // SectorInfo[ SECTOR( pProfile->sSectorX, pProfile->sSectorY ) ].uiFlags |= SF_USE_ALTERNATE_MAP;

  gfPlayerTeamSawJoey = false;

  if (gGameOptions.fSciFi) {
    // add Bob
    pProfile = addressof(gMercProfiles[Enum268.BOB]);
    pProfile.value.sSectorX = 8;
    pProfile.value.sSectorY = MAP_ROW_F;
    pProfile.value.bSectorZ = 0;

    // add Gabby in random location
    pProfile = addressof(gMercProfiles[Enum268.GABBY]);
    switch (Random(2)) {
      case 0:
        pProfile.value.sSectorX = 11;
        pProfile.value.sSectorY = MAP_ROW_H;
        pProfile.value.bSectorZ = 0;
        break;
      case 1:
        pProfile.value.sSectorX = 4;
        pProfile.value.sSectorY = MAP_ROW_I;
        pProfile.value.bSectorZ = 0;
        break;
    }

    // use alternate map in this sector
    SectorInfo[SECTOR(pProfile.value.sSectorX, pProfile.value.sSectorY)].uiFlags |= SF_USE_ALTERNATE_MAP;
  } else {
    // not scifi, so use alternate map in Tixa's b1 level that doesn't have the stairs going down to the caves.
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(9, 10, 1); // j9_b1
    if (pSector) {
      pSector.value.uiFlags |= SF_USE_ALTERNATE_MAP;
    }
  }

  // init hospital variables
  giHospitalTempBalance = 0;
  giHospitalRefund = 0;
  gbHospitalPriceModifier = 0;

  // set up Devin so he will be placed ASAP
  gMercProfiles[Enum268.DEVIN].bNPCData = 3;
}

function InitBloodCatSectors(): void {
  let i: INT32;
  // Hard coded table of bloodcat populations.  We don't have
  // access to the real population (if different) until we physically
  // load the map.  If the real population is different, then an error
  // will be reported.
  for (i = 0; i < 255; i++) {
    SectorInfo[i].bBloodCats = -1;
  }
  SectorInfo[Enum123.SEC_A15].bBloodCatPlacements = 9;
  SectorInfo[Enum123.SEC_B4].bBloodCatPlacements = 9;
  SectorInfo[Enum123.SEC_B16].bBloodCatPlacements = 8;
  SectorInfo[Enum123.SEC_C3].bBloodCatPlacements = 12;
  SectorInfo[Enum123.SEC_C8].bBloodCatPlacements = 13;
  SectorInfo[Enum123.SEC_C11].bBloodCatPlacements = 7;
  SectorInfo[Enum123.SEC_D4].bBloodCatPlacements = 8;
  SectorInfo[Enum123.SEC_D9].bBloodCatPlacements = 12;
  SectorInfo[Enum123.SEC_E11].bBloodCatPlacements = 10;
  SectorInfo[Enum123.SEC_E13].bBloodCatPlacements = 14;
  SectorInfo[Enum123.SEC_F3].bBloodCatPlacements = 13;
  SectorInfo[Enum123.SEC_F5].bBloodCatPlacements = 7;
  SectorInfo[Enum123.SEC_F7].bBloodCatPlacements = 12;
  SectorInfo[Enum123.SEC_F12].bBloodCatPlacements = 9;
  SectorInfo[Enum123.SEC_F14].bBloodCatPlacements = 14;
  SectorInfo[Enum123.SEC_F15].bBloodCatPlacements = 8;
  SectorInfo[Enum123.SEC_G6].bBloodCatPlacements = 7;
  SectorInfo[Enum123.SEC_G10].bBloodCatPlacements = 12;
  SectorInfo[Enum123.SEC_G12].bBloodCatPlacements = 11;
  SectorInfo[Enum123.SEC_H5].bBloodCatPlacements = 9;
  SectorInfo[Enum123.SEC_I4].bBloodCatPlacements = 8;
  SectorInfo[Enum123.SEC_I15].bBloodCatPlacements = 8;
  SectorInfo[Enum123.SEC_J6].bBloodCatPlacements = 11;
  SectorInfo[Enum123.SEC_K3].bBloodCatPlacements = 12;
  SectorInfo[Enum123.SEC_K6].bBloodCatPlacements = 14;
  SectorInfo[Enum123.SEC_K10].bBloodCatPlacements = 12;
  SectorInfo[Enum123.SEC_K14].bBloodCatPlacements = 14;

  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY: // 50%
      SectorInfo[Enum123.SEC_I16].bBloodCatPlacements = 14;
      SectorInfo[Enum123.SEC_I16].bBloodCats = 14;
      SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 8;
      SectorInfo[Enum123.SEC_N5].bBloodCats = 8;
      break;
    case Enum9.DIF_LEVEL_MEDIUM: // 75%
      SectorInfo[Enum123.SEC_I16].bBloodCatPlacements = 19;
      SectorInfo[Enum123.SEC_I16].bBloodCats = 19;
      SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 10;
      SectorInfo[Enum123.SEC_N5].bBloodCats = 10;
      break;
    case Enum9.DIF_LEVEL_HARD: // 100%
      SectorInfo[Enum123.SEC_I16].bBloodCatPlacements = 26;
      SectorInfo[Enum123.SEC_I16].bBloodCats = 26;
      SectorInfo[Enum123.SEC_N5].bBloodCatPlacements = 12;
      SectorInfo[Enum123.SEC_N5].bBloodCats = 12;
      break;
  }
}

function InitStrategicLayer(): void {
  // Clear starategic layer!
  SetupNewStrategicGame();
  InitQuestEngine();

  // Setup a new campaign via the enemy perspective.
  InitNewCampaign();
  // Init Squad Lists
  InitSquads();
  // Init vehicles
  InitVehicles();
  // init town loyalty
  InitTownLoyalty();
  // init the mine management system
  InitializeMines();
  // initialize map screen flags
  InitMapScreenFlags();
  // initialize NPCs, select alternate maps, etc
  InitNPCs();
  // init Skyrider and his helicopter
  InitializeHelicopter();
  // Clear out the vehicle list
  ClearOutVehicleList();

  InitBloodCatSectors();

  InitializeSAMSites();

  // make Orta, Tixa, SAM sites not found
  InitMapSecrets();

  // free up any leave list arrays that were left allocated
  ShutDownLeaveList();
  // re-set up leave list arrays for dismissed mercs
  InitLeaveList();

  // reset time compression mode to X0 (this will also pause it)
  SetGameTimeCompressionLevel(Enum130.TIME_COMPRESS_X0);

  // select A9 Omerta as the initial selected sector
  ChangeSelectedMapSector(9, 1, 0);

  // Reset these flags or mapscreen could be disabled and cause major headache.
  fDisableDueToBattleRoster = false;
  fDisableMapInterfaceDueToBattle = false;
}

function ShutdownStrategicLayer(): void {
  DeleteAllStrategicEvents();
  RemoveAllGroups();
  TrashUndergroundSectorInfo();
  DeleteCreatureDirectives();
  KillStrategicAI();
}

function InitNewGame(fReset: boolean): boolean {
  let iStartingCash: INT32;

  //	static fScreenCount = 0;

  if (fReset) {
    gubScreenCount = 0;
    return true;
  }

  // reset meanwhile flags
  uiMeanWhileFlags = 0;

  // Reset the selected soldier
  gusSelectedSoldier = NOBODY;

  if (gubScreenCount == 0) {
    if (!LoadMercProfiles())
      return false;
  }

  // Initialize the Arms Dealers and Bobby Rays inventory
  if (gubScreenCount == 0) {
    // Init all the arms dealers inventory
    InitAllArmsDealers();
    InitBobbyRayInventory();
  }

  // clear tactical
  ClearTacticalMessageQueue();

  // clear mapscreen messages
  FreeGlobalMessageList();

  // IF our first time, go into laptop!
  if (gubScreenCount == 0) {
    // Init the laptop here
    InitLaptopAndLaptopScreens();

    InitStrategicLayer();

    // Set new game flag
    SetLaptopNewGameFlag();

    // this is for the "mercs climbing down from a rope" animation, NOT Skyrider!!
    ResetHeliSeats();

    // Setup two new messages!
    AddPreReadEmail(OLD_ENRICO_1, OLD_ENRICO_1_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    AddPreReadEmail(OLD_ENRICO_2, OLD_ENRICO_2_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    AddPreReadEmail(RIS_REPORT, RIS_REPORT_LENGTH, Enum75.RIS_EMAIL, GetWorldTotalMin());
    AddPreReadEmail(OLD_ENRICO_3, OLD_ENRICO_3_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
    AddEmail(IMP_EMAIL_INTRO, IMP_EMAIL_INTRO_LENGTH, Enum75.CHAR_PROFILE_SITE, GetWorldTotalMin());
    // AddEmail(ENRICO_CONGRATS,ENRICO_CONGRATS_LENGTH,MAIL_ENRICO, GetWorldTotalMin() );

    // ATE: Set starting cash....
    switch (gGameOptions.ubDifficultyLevel) {
      case Enum9.DIF_LEVEL_EASY:

        iStartingCash = 45000;
        break;

      case Enum9.DIF_LEVEL_MEDIUM:

        iStartingCash = 35000;
        break;

      case Enum9.DIF_LEVEL_HARD:

        iStartingCash = 30000;
        break;

      default:
        Assert(0);
        return false;
    }

    // Setup initial money
    AddTransactionToPlayersBook(Enum80.ANONYMOUS_DEPOSIT, 0, GetWorldTotalMin(), iStartingCash);

    {
      let uiDaysTimeMercSiteAvailable: UINT32 = Random(2) + 1;

      // schedule email for message from spec at 7am 3 days in the future
      AddFutureDayStrategicEvent(Enum132.EVENT_DAY3_ADD_EMAIL_FROM_SPECK, 60 * 7, 0, uiDaysTimeMercSiteAvailable);
    }

    SetLaptopExitScreen(Enum26.INIT_SCREEN);
    SetPendingNewScreen(Enum26.LAPTOP_SCREEN);
    gubScreenCount = 1;

    // Set the fact the game is in progress
    gTacticalStatus.fHasAGameBeenStarted = true;

    return true;
  }

  /*
  if( ( guiExitScreen == MAP_SCREEN ) && ( LaptopSaveInfo.gfNewGameLaptop ) )
  {
          SetLaptopExitScreen( GAME_SCREEN );
          return( TRUE );
  }
*/
  if (gubScreenCount == 1) {
    // OK , FADE HERE
    // BeginFade( INIT_SCREEN, 35, FADE_OUT_REALFADE, 5 );
    // BeginFade( INIT_SCREEN, 35, FADE_OUT_VERSION_FASTER, 25 );
    // BeginFade( INIT_SCREEN, 35, FADE_OUT_VERSION_SIDE, 0 );

    gubScreenCount = 2;
    return true;
  }

/*
        if ( gubScreenCount == 2 )
        {

                if ( !SetCurrentWorldSector( 9, 1, 0 ) )
                {

                }

                SetLaptopExitScreen( MAP_SCREEN );

                FadeInGameScreen( );

                EnterTacticalScreen( );

                if( gfAtLeastOneMercWasHired == TRUE )
                {
                        gubScreenCount = 3;
                }
                else
                {

                }

                return( TRUE );
        }

        */

  return true;
}

function AnyMercsHired(): boolean {
  let cnt: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let bLastTeamID: INT16;

  // Find first guy availible in team
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bActive) {
      return true;
    }
  }

  return false;
}

function QuickStartGame(): void {
  let cnt: INT32;
  let usVal: UINT16;
  let ub1: UINT8 = 0;
  let ub2: UINT8 = 0;

  for (cnt = 0; cnt < 3; cnt++) {
    if (cnt == 0) {
      usVal = Random(40);

      QuickSetupOfMercProfileItems(cnt, usVal);
      QuickGameMemberHireMerc(usVal);
    } else if (cnt == 1) {
      do {
        usVal = Random(40);
      } while (usVal != ub1);

      QuickSetupOfMercProfileItems(cnt, usVal);
      QuickGameMemberHireMerc(usVal);
    } else if (cnt == 2) {
      do {
        usVal = Random(40);
      } while (usVal != ub1 && usVal != ub2);

      QuickSetupOfMercProfileItems(cnt, usVal);
      QuickGameMemberHireMerc(usVal);
    }
  }
}

// TEMP FUNCTION!
function QuickSetupOfMercProfileItems(uiCount: UINT32, ubProfileIndex: UINT8): void {
  // Quickly give some guys we hire some items

  if (uiCount == 0) {
    // CreateGun( GLOCK_17, &(pSoldier->inv[ HANDPOS ] ) );
    // gMercProfiles[ ubProfileIndex ].inv[ HANDPOS ] = HAND_GRENADE;
    // gMercProfiles[ ubProfileIndex ].bInvStatus[ HANDPOS ] = 100;
    // gMercProfiles[ ubProfileIndex ].bInvNumber[ HANDPOS ] = 3;
    gMercProfiles[ubProfileIndex].inv[Enum261.HANDPOS] = Enum225.C7;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.HANDPOS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.HANDPOS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.BIGPOCK1POS] = Enum225.CAWS;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.BIGPOCK1POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.BIGPOCK1POS] = 1;

    gMercProfiles[ubProfileIndex].bSkillTrait = Enum269.MARTIALARTS;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK3POS] = Enum225.KEY_2;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK3POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK3POS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK5POS] = Enum225.LOCKSMITHKIT;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK5POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK5POS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.BIGPOCK3POS] = Enum225.MEDICKIT;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.BIGPOCK3POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.BIGPOCK3POS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.BIGPOCK4POS] = Enum225.SHAPED_CHARGE;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.BIGPOCK4POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.BIGPOCK4POS] = 1;

    // TEMP!
    // make carman's opinion of us high!
    gMercProfiles[78].bMercOpinion[ubProfileIndex] = 25;
  } else if (uiCount == 1) {
    gMercProfiles[ubProfileIndex].inv[Enum261.HANDPOS] = Enum225.CAWS;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.HANDPOS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.HANDPOS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK3POS] = Enum225.KEY_1;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK3POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK3POS] = 1;
  } else if (uiCount == 2) {
    gMercProfiles[ubProfileIndex].inv[Enum261.HANDPOS] = Enum225.GLOCK_17;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.HANDPOS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.HANDPOS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SECONDHANDPOS] = 5;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SECONDHANDPOS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SECONDHANDPOS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK1POS] = Enum225.SILENCER;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK1POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK1POS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK2POS] = Enum225.SNIPERSCOPE;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK2POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK2POS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK3POS] = Enum225.LASERSCOPE;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK3POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK3POS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK5POS] = Enum225.BIPOD;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK5POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK5POS] = 1;

    gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK6POS] = Enum225.LOCKSMITHKIT;
    gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK6POS] = 100;
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK6POS] = 1;
  } else {
    gMercProfiles[ubProfileIndex].inv[Enum261.HANDPOS] = Random(30);
    gMercProfiles[ubProfileIndex].bInvNumber[Enum261.HANDPOS] = 1;
  }

  gMercProfiles[ubProfileIndex].inv[Enum261.HELMETPOS] = Enum225.KEVLAR_HELMET;
  gMercProfiles[ubProfileIndex].bInvStatus[Enum261.HELMETPOS] = 100;
  gMercProfiles[ubProfileIndex].bInvNumber[Enum261.HELMETPOS] = 1;

  gMercProfiles[ubProfileIndex].inv[Enum261.VESTPOS] = Enum225.KEVLAR_VEST;
  gMercProfiles[ubProfileIndex].bInvStatus[Enum261.VESTPOS] = 100;
  gMercProfiles[ubProfileIndex].bInvNumber[Enum261.VESTPOS] = 1;

  gMercProfiles[ubProfileIndex].inv[Enum261.BIGPOCK2POS] = Enum225.RDX;
  gMercProfiles[ubProfileIndex].bInvStatus[Enum261.BIGPOCK2POS] = 10;
  gMercProfiles[ubProfileIndex].bInvNumber[Enum261.BIGPOCK2POS] = 1;

  gMercProfiles[ubProfileIndex].inv[Enum261.SMALLPOCK4POS] = Enum225.HAND_GRENADE;
  gMercProfiles[ubProfileIndex].bInvStatus[Enum261.SMALLPOCK4POS] = 100;
  gMercProfiles[ubProfileIndex].bInvNumber[Enum261.SMALLPOCK4POS] = 4;

  // Give special items to some NPCs
  // gMercProfiles[ 78 ].inv[ SMALLPOCK4POS ] = TERRORIST_INFO;
  // gMercProfiles[ 78 ].bInvStatus[ SMALLPOCK4POS ] = 100;
  // gMercProfiles[ 78 ].bInvNumber[ SMALLPOCK4POS ] = 1;
}

function QuickGameMemberHireMerc(ubCurrentSoldier: UINT8): boolean {
  let HireMercStruct: MERC_HIRE_STRUCT;

  memset(addressof(HireMercStruct), 0, sizeof(MERC_HIRE_STRUCT));

  HireMercStruct.ubProfileID = ubCurrentSoldier;

  HireMercStruct.sSectorX = gsMercArriveSectorX;
  HireMercStruct.sSectorY = gsMercArriveSectorY;
  HireMercStruct.fUseLandingZoneForArrival = true;

  HireMercStruct.fCopyProfileItemsOver = true;
  HireMercStruct.ubInsertionCode = Enum175.INSERTION_CODE_CHOPPER;

  HireMercStruct.iTotalContractLength = 7;

  // specify when the merc should arrive
  HireMercStruct.uiTimeTillMercArrives = 0;

  // if we succesfully hired the merc
  if (!HireMerc(addressof(HireMercStruct))) {
    return false;
  }

  // add an entry in the finacial page for the hiring of the merc
  AddTransactionToPlayersBook(Enum80.HIRED_MERC, ubCurrentSoldier, GetWorldTotalMin(), -gMercProfiles[ubCurrentSoldier].uiWeeklySalary);

  if (gMercProfiles[ubCurrentSoldier].bMedicalDeposit) {
    // add an entry in the finacial page for the medical deposit
    AddTransactionToPlayersBook(Enum80.MEDICAL_DEPOSIT, ubCurrentSoldier, GetWorldTotalMin(), -(gMercProfiles[ubCurrentSoldier].sMedicalDepositAmount));
  }

  // add an entry in the history page for the hiring of the merc
  AddHistoryToPlayersLog(Enum83.HISTORY_HIRED_MERC_FROM_AIM, ubCurrentSoldier, GetWorldTotalMin(), -1, -1);

  return true;
}

// This function is called when the game is REstarted.  Things that need to be reinited are placed in here
function ReStartingGame(): void {
  let cnt: UINT16;

  // Pause the game
  gfGamePaused = true;

  // Reset the sectors
  gWorldSectorX = gWorldSectorY = 0;
  gbWorldSectorZ = -1;

  SoundStopAll();

  // we are going to restart a game so initialize the variable so we can initialize a new game
  InitNewGame(true);

  // Deletes all the Temp files in the Maps\Temp directory
  InitTacticalSave(true);

  // Loop through all the soldier and delete them all
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    TacticalRemoveSoldier(cnt);
  }

  // Re-init overhead...
  InitOverhead();

  // Reset the email list
  ShutDownEmailList();

  // Reinit the laptopn screen variables
  InitLaptopAndLaptopScreens();
  LaptopScreenInit();

  // Reload the Merc profiles
  LoadMercProfiles();

  // Reload quote files
  ReloadAllQuoteFiles();

  // Initialize the ShopKeeper Interface ( arms dealer inventory, etc. )
  ShopKeeperScreenInit();

  // Delete the world info
  TrashWorld();

  // Init the help screen system
  InitHelpScreenSystem();

  EmptyDialogueQueue();

  if (InAirRaid()) {
    EndAirRaid();
  }

  // Make sure the game starts in the TEAM panel ( it wasnt being reset )
  gsCurInterfacePanel = Enum215.TEAM_PANEL;

  // Delete all the strategic events
  DeleteAllStrategicEvents();

  // This function gets called when ur in a game a click the quit to main menu button, therefore no game is in progress
  gTacticalStatus.fHasAGameBeenStarted = false;

  // Reset timer callbacks
  gpCustomizableTimerCallback = null;

  gubCheatLevel = STARTING_CHEAT_LEVEL;
}
