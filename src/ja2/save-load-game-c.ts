/////////////////////////////////////////////////////
//
// Local Defines
//
/////////////////////////////////////////////////////

// Global variable used

let gMusicModeToPlay: BOOLEAN = FALSE;

let gfUseConsecutiveQuickSaveSlots: BOOLEAN = FALSE;
let guiCurrentQuickSaveNumber: UINT32 = 0;
let guiLastSaveGameNum: UINT32;

let guiJA2EncryptionSet: UINT32 = 0;

interface GENERAL_SAVE_INFO {
  // The screen that the gaem was saved from
  uiCurrentScreen: UINT32;

  uiCurrentUniqueSoldierId: UINT32;

  // The music that was playing when the game was saved
  ubMusicMode: UINT8;

  // Flag indicating that we have purchased something from Tony
  fHavePurchasedItemsFromTony: BOOLEAN;

  // The selected soldier in tactical
  usSelectedSoldier: UINT16;

  // The x and y scroll position
  sRenderCenterX: INT16;
  sRenderCenterY: INT16;

  fAtLeastOneMercWasHired: BOOLEAN;

  // General Map screen state flags
  fShowItemsFlag: BOOLEAN;
  fShowTownFlag: BOOLEAN;
  fShowTeamFlag: BOOLEAN;
  fShowMineFlag: BOOLEAN;
  fShowAircraftFlag: BOOLEAN;

  // is the helicopter available to player?
  fHelicopterAvailable: BOOLEAN;

  // helicopter vehicle id
  iHelicopterVehicleId: INT32;

  // total distance travelled
  UNUSEDiTotalHeliDistanceSinceRefuel: INT32;

  // total owed to player
  iTotalAccumulatedCostByPlayer: INT32;

  // whether or not skyrider is alive and well? and on our side yet?
  fSkyRiderAvailable: BOOLEAN;

  // skyrider engaging in a monologue
  UNUSEDfSkyriderMonologue: BOOLEAN;

  // list of sector locations
  UNUSED: INT16[][] /* [2][2] */;

  // is the heli in the air?
  fHelicopterIsAirBorne: BOOLEAN;

  // is the pilot returning straight to base?
  fHeliReturnStraightToBase: BOOLEAN;

  // heli hovering
  fHoveringHelicopter: BOOLEAN;

  // time started hovering
  uiStartHoverTime: UINT32;

  // what state is skyrider's dialogue in in?
  uiHelicopterSkyriderTalkState: UINT32;

  // the flags for skyrider events
  fShowEstoniRefuelHighLight: BOOLEAN;
  fShowOtherSAMHighLight: BOOLEAN;
  fShowDrassenSAMHighLight: BOOLEAN;

  uiEnvWeather: UINT32;

  ubDefaultButton: UINT8;

  fSkyriderEmptyHelpGiven: BOOLEAN;
  fEnterMapDueToContract: BOOLEAN;
  ubHelicopterHitsTaken: UINT8;
  ubQuitType: UINT8;
  fSkyriderSaidCongratsOnTakingSAM: BOOLEAN;
  sContractRehireSoldierID: INT16;

  GameOptions: GAME_OPTIONS;

  uiSeedNumber: UINT32;

  // The GetJA2Clock() value
  uiBaseJA2Clock: UINT32;

  sCurInterfacePanel: INT16;

  ubSMCurrentMercID: UINT8;

  fFirstTimeInMapScreen: BOOLEAN;

  fDisableDueToBattleRoster: BOOLEAN;

  fDisableMapInterfaceDueToBattle: BOOLEAN;

  sBoxerGridNo: INT16[] /* [NUM_BOXERS] */;
  ubBoxerID: UINT8[] /* [NUM_BOXERS] */;
  fBoxerFought: BOOLEAN[] /* [NUM_BOXERS] */;

  fHelicopterDestroyed: BOOLEAN; // if the chopper is destroyed
  fShowMapScreenHelpText: BOOLEAN; // If true, displays help in mapscreen

  iSortStateForMapScreenList: INT32;
  fFoundTixa: BOOLEAN;

  uiTimeOfLastSkyriderMonologue: UINT32;
  fShowCambriaHospitalHighLight: BOOLEAN;
  fSkyRiderSetUp: BOOLEAN;
  fRefuelingSiteAvailable: BOOLEAN[] /* [NUMBER_OF_REFUEL_SITES] */;

  // Meanwhile stuff
  gCurrentMeanwhileDef: MEANWHILE_DEFINITION;

  ubPlayerProgressSkyriderLastCommentedOn: BOOLEAN;

  gfMeanwhileTryingToStart: BOOLEAN;
  gfInMeanwhile: BOOLEAN;

  // list of dead guys for squads...in id values -> -1 means no one home
  sDeadMercs: INT16[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */;

  // levels of publicly known noises
  gbPublicNoiseLevel: INT8[] /* [MAXTEAMS] */;

  gubScreenCount: UINT8;

  usOldMeanWhileFlags: UINT16;

  iPortraitNumber: INT32;

  sWorldSectorLocationOfFirstBattle: INT16;

  fUnReadMailFlag: BOOLEAN;
  fNewMailFlag: BOOLEAN;
  fOldUnReadFlag: BOOLEAN;
  fOldNewMailFlag: BOOLEAN;

  fShowMilitia: BOOLEAN;

  fNewFilesInFileViewer: BOOLEAN;

  fLastBoxingMatchWonByPlayer: BOOLEAN;

  uiUNUSED: UINT32;

  fSamSiteFound: BOOLEAN[] /* [NUMBER_OF_SAMS] */;

  ubNumTerrorists: UINT8;
  ubCambriaMedicalObjects: UINT8;

  fDisableTacticalPanelButtons: BOOLEAN;

  sSelMapX: INT16;
  sSelMapY: INT16;
  iCurrentMapSectorZ: INT32;

  usHasPlayerSeenHelpScreenInCurrentScreen: UINT16;
  fHideHelpInAllScreens: BOOLEAN;
  ubBoxingMatchesWon: UINT8;

  ubBoxersRests: UINT8;
  fBoxersResting: BOOLEAN;
  ubDesertTemperature: UINT8;
  ubGlobalTemperature: UINT8;

  sMercArriveSectorX: INT16;
  sMercArriveSectorY: INT16;

  fCreatureMeanwhileScenePlayed: BOOLEAN;
  ubPlayerNum: UINT8;
  // New stuff for the Prebattle interface / autoresolve
  fPersistantPBI: BOOLEAN;
  ubEnemyEncounterCode: UINT8;

  ubExplicitEnemyEncounterCode: BOOLEAN;
  fBlitBattleSectorLocator: BOOLEAN;
  ubPBSectorX: UINT8;
  ubPBSectorY: UINT8;

  ubPBSectorZ: UINT8;
  fCantRetreatInPBI: BOOLEAN;
  fExplosionQueueActive: BOOLEAN;
  ubUnused: UINT8[] /* [1] */;

  uiMeanWhileFlags: UINT32;

  bSelectedInfoChar: INT8;
  bHospitalPriceModifier: INT8;
  bUnused2: INT8[] /* [2] */;

  iHospitalTempBalance: INT32;
  iHospitalRefund: INT32;

  fPlayerTeamSawJoey: INT8;
  fMikeShouldSayHi: INT8;

  ubFiller: UINT8[] /* [550] */; // This structure should be 1024 bytes
}

let guiSaveGameVersion: UINT32 = 0;

/////////////////////////////////////////////////////
//
// Global Variables
//
/////////////////////////////////////////////////////

// CHAR8		gsSaveGameNameWithPath[ 512 ];

let gubSaveGameLoc: UINT8 = 0;

let guiScreenToGotoAfterLoadingSavedGame: UINT32 = 0;

/////////////////////////////////////////////////////
//
// Function Prototypes
//
/////////////////////////////////////////////////////

// BOOLEAN		SavePtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile );
// BOOLEAN		LoadPtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile );

// ppp

/////////////////////////////////////////////////////
//
// Functions
//
/////////////////////////////////////////////////////

function SaveGame(ubSaveGameID: UINT8, pGameDesc: STR16): BOOLEAN {
  let uiNumBytesWritten: UINT32 = 0;
  let hFile: HWFILE = 0;
  let SaveGameHeader: SAVED_GAME_HEADER;
  let zSaveGameName: CHAR8[] /* [512] */;
  let uiSizeOfGeneralInfo: UINT32 = sizeof(GENERAL_SAVE_INFO);
  let saveDir: UINT8[] /* [100] */;
  let fPausedStateBeforeSaving: BOOLEAN = gfGamePaused;
  let fLockPauseStateBeforeSaving: BOOLEAN = gfLockPauseState;
  let iSaveLoadGameMessageBoxID: INT32 = -1;
  let usPosX: UINT16;
  let usActualWidth: UINT16;
  let usActualHeight: UINT16;
  let fWePausedIt: BOOLEAN = FALSE;

  sprintf(saveDir, "%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY]);

  if (ubSaveGameID >= NUM_SAVE_GAMES && ubSaveGameID != SAVE__ERROR_NUM && ubSaveGameID != SAVE__END_TURN_NUM)
    return (FALSE); // ddd

  // clear out the save game header
  memset(addressof(SaveGameHeader), 0, sizeof(SAVED_GAME_HEADER));

  if (!GamePaused()) {
    PauseBeforeSaveGame();
    fWePausedIt = TRUE;
  }

  // Place a message on the screen telling the user that we are saving the game
  iSaveLoadGameMessageBoxID = PrepareMercPopupBox(iSaveLoadGameMessageBoxID, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, zSaveLoadText[Enum371.SLG_SAVING_GAME_MESSAGE], 300, 0, 0, 0, addressof(usActualWidth), addressof(usActualHeight));
  usPosX = (640 - usActualWidth) / 2;

  RenderMercPopUpBoxFromIndex(iSaveLoadGameMessageBoxID, usPosX, 160, FRAME_BUFFER);

  InvalidateRegion(0, 0, 640, 480);

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
  RefreshScreen(null);

  if (RemoveMercPopupBoxFromIndex(iSaveLoadGameMessageBoxID)) {
    iSaveLoadGameMessageBoxID = -1;
  }

  //
  // make sure we redraw the screen when we are done
  //

  // if we are in the game screen
  if (guiCurrentScreen == Enum26.GAME_SCREEN) {
    SetRenderFlags(RENDER_FLAG_FULL);
  }

  else if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    fMapPanelDirty = TRUE;
    fTeamPanelDirty = TRUE;
    fCharacterInfoPanelDirty = TRUE;
  }

  else if (guiCurrentScreen == Enum26.SAVE_LOAD_SCREEN) {
    gfRedrawSaveLoadScreen = TRUE;
  }

  gubSaveGameLoc = ubSaveGameID;

  // Set the fact that we are saving a game
  gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

  // Save the current sectors open temp files to the disk
  if (!SaveCurrentSectorsInformationToTempItemFile()) {
    ScreenMsg(FONT_MCOLOR_WHITE, MSG_TESTVERSION, "ERROR in SaveCurrentSectorsInformationToTempItemFile()");
    goto("FAILED_TO_SAVE");
  }

  // if we are saving the quick save,
  if (ubSaveGameID == 0) {
      swprintf(pGameDesc, pMessageStrings[Enum333.MSG_QUICKSAVE_NAME]);
  }

  // If there was no string, add one
  if (pGameDesc[0] == '\0')
    wcscpy(pGameDesc, pMessageStrings[Enum333.MSG_NODESC]);

  // Check to see if the save directory exists
  if (FileGetAttributes(saveDir) == 0xFFFFFFFF) {
    // ok the direcotry doesnt exist, create it
    if (!MakeFileManDirectory(saveDir)) {
      goto("FAILED_TO_SAVE");
    }
  }

  // Create the name of the file
  CreateSavedGameFileNameFromNumber(ubSaveGameID, zSaveGameName);

  // if the file already exists, delete it
  if (FileExists(zSaveGameName)) {
    if (!FileDelete(zSaveGameName)) {
      goto("FAILED_TO_SAVE");
    }
  }

  // create the save game file
  hFile = FileOpen(zSaveGameName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);
  if (!hFile) {
    goto("FAILED_TO_SAVE");
  }

  //
  // If there are no enemy or civilians to save, we have to check BEFORE savinf the sector info struct because
  // the NewWayOfSavingEnemyAndCivliansToTempFile will RESET the civ or enemy flag AFTER they have been saved.
  //
  NewWayOfSavingEnemyAndCivliansToTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, TRUE, TRUE);
  NewWayOfSavingEnemyAndCivliansToTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, FALSE, TRUE);

  //
  // Setup the save game header
  //

  SaveGameHeader.uiSavedGameVersion = guiSavedGameVersion;
  wcscpy(SaveGameHeader.sSavedGameDesc, pGameDesc);
  strcpy(SaveGameHeader.zGameVersionNumber, czVersionNumber);

  SaveGameHeader.uiFlags;

  // The following will be used to quickly access info to display in the save/load screen
  SaveGameHeader.uiDay = GetWorldDay();
  SaveGameHeader.ubHour = GetWorldHour();
  SaveGameHeader.ubMin = guiMin;

  // copy over the initial game options
  memcpy(addressof(SaveGameHeader.sInitialGameOptions), addressof(gGameOptions), sizeof(GAME_OPTIONS));

  // Get the sector value to save.
  GetBestPossibleSectorXYZValues(addressof(SaveGameHeader.sSectorX), addressof(SaveGameHeader.sSectorY), addressof(SaveGameHeader.bSectorZ));

  /*

          //if the current sector is valid
          if( gfWorldLoaded )
          {
                  SaveGameHeader.sSectorX = gWorldSectorX;
                  SaveGameHeader.sSectorY = gWorldSectorY;
                  SaveGameHeader.bSectorZ = gbWorldSectorZ;
          }
          else if( Squad[ iCurrentTacticalSquad ][ 0 ] && iCurrentTacticalSquad != NO_CURRENT_SQUAD )
          {
  //		if( Squad[ iCurrentTacticalSquad ][ 0 ]->bAssignment != IN_TRANSIT )
                  {
                          SaveGameHeader.sSectorX = Squad[ iCurrentTacticalSquad ][ 0 ]->sSectorX;
                          SaveGameHeader.sSectorY = Squad[ iCurrentTacticalSquad ][ 0 ]->sSectorY;
                          SaveGameHeader.bSectorZ = Squad[ iCurrentTacticalSquad ][ 0 ]->bSectorZ;
                  }
          }
          else
          {
                  INT16					sSoldierCnt;
                  SOLDIERTYPE		*pSoldier;
                  INT16					bLastTeamID;
                  INT8					bCount=0;
                  BOOLEAN				fFoundAMerc=FALSE;

                  // Set locator to first merc
                  sSoldierCnt = gTacticalStatus.Team[ gbPlayerNum ].bFirstID;
                  bLastTeamID = gTacticalStatus.Team[ gbPlayerNum ].bLastID;

                  for ( pSoldier = MercPtrs[ sSoldierCnt ]; sSoldierCnt <= bLastTeamID; sSoldierCnt++,pSoldier++)
                  {
                          if( pSoldier->bActive )
                          {
                                  if ( pSoldier->bAssignment != IN_TRANSIT && !pSoldier->fBetweenSectors)
                                  {
                                          SaveGameHeader.sSectorX = pSoldier->sSectorX;
                                          SaveGameHeader.sSectorY = pSoldier->sSectorY;
                                          SaveGameHeader.bSectorZ = pSoldier->bSectorZ;
                                          fFoundAMerc = TRUE;
                                          break;
                                  }
                          }
                  }

                  if( !fFoundAMerc )
                  {
                          SaveGameHeader.sSectorX = gWorldSectorX;
                          SaveGameHeader.sSectorY = gWorldSectorY;
                          SaveGameHeader.bSectorZ = gbWorldSectorZ;
                  }
          }
  */

  SaveGameHeader.ubNumOfMercsOnPlayersTeam = NumberOfMercsOnPlayerTeam();
  SaveGameHeader.iCurrentBalance = LaptopSaveInfo.iCurrentBalance;

  SaveGameHeader.uiCurrentScreen = guiPreviousOptionScreen;

  SaveGameHeader.fAlternateSector = GetSectorFlagStatus(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_USE_ALTERNATE_MAP);

  if (gfWorldLoaded) {
    SaveGameHeader.fWorldLoaded = TRUE;
    SaveGameHeader.ubLoadScreenID = GetLoadScreenID(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
  } else {
    SaveGameHeader.fWorldLoaded = FALSE;
    SaveGameHeader.ubLoadScreenID = 0;
  }

  SaveGameHeader.uiRandom = Random(RAND_MAX);

  //
  // Save the Save Game header file
  //

  FileWrite(hFile, addressof(SaveGameHeader), sizeof(SAVED_GAME_HEADER), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(SAVED_GAME_HEADER)) {
    goto("FAILED_TO_SAVE");
  }

  guiJA2EncryptionSet = CalcJA2EncryptionSet(addressof(SaveGameHeader));

  //
  // Save the gTactical Status array, plus the curent secotr location
  //
  if (!SaveTacticalStatusToSavedGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // save the game clock info
  if (!SaveGameClock(hFile, fPausedStateBeforeSaving, fLockPauseStateBeforeSaving)) {
    goto("FAILED_TO_SAVE");
  }

  // save the strategic events
  if (!SaveStrategicEventsToSavedGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveLaptopInfoToSavedGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  //
  // Save the merc profiles
  //
  if (!SaveMercProfiles(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  //
  // Save the soldier structure
  //
  if (!SaveSoldierStructure(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save the Finaces Data file
  if (!SaveFilesToSavedGame(FINANCES_DATA_FILE, hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save the history file
  if (!SaveFilesToSavedGame(HISTORY_DATA_FILE, hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save the Laptop File file
  if (!SaveFilesToSavedGame(FILES_DAT_FILE, hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save email stuff to save file
  if (!SaveEmailToSavedGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save the strategic information
  if (!SaveStrategicInfoToSavedFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // save the underground information
  if (!SaveUnderGroundSectorInfoToSaveGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // save the squad info
  if (!SaveSquadInfoToSavedGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveStrategicMovementGroupsToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save all the map temp files from the maps\temp directory into the saved game file
  if (!SaveMapTempFilesToSavedGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveQuestInfoToSavedGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveOppListInfoToSavedGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveMapScreenMessagesToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveNPCInfoToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveKeyTableToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveTempNpcQuoteArrayToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SavePreRandomNumbersToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveSmokeEffectsToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveArmsDealerInventoryToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveGeneralInfo(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveMineStatusToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveStrategicTownLoyaltyToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveVehicleInformationToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveBulletStructureToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SavePhysicsTableToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveAirRaidInfoToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveTeamTurnsToTheSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveExplosionTableToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveCreatureDirectives(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveStrategicStatusToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveStrategicAI(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveLightEffectsToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveWatchedLocsToSavedGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveItemCursorToSavedGame(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveCivQuotesToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveBackupNPCInfoToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  if (!SaveMeanwhileDefsFromSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // save meanwhiledefs

  if (!SaveSchedules(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save extra vehicle info
  if (!NewSaveVehicleMovementInfoToSavedGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save contract renewal sequence stuff
  if (!SaveContractRenewalDataToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // Save leave list stuff
  if (!SaveLeaveItemList(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // do the new way of saving bobbyr mail order items
  if (!NewWayOfSavingBobbyRMailOrdersToSaveGameFile(hFile)) {
    goto("FAILED_TO_SAVE");
  }

  // sss

  // Close the saved game file
  FileClose(hFile);

  // if we succesfully saved the game, mark this entry as the last saved game file
  if (ubSaveGameID != SAVE__ERROR_NUM && ubSaveGameID != SAVE__END_TURN_NUM) {
    gGameSettings.bLastSavedGameSlot = ubSaveGameID;
  }

  // Save the save game settings
  SaveGameSettings();

  //
  // Display a screen message that the save was succesful
  //

  // if its the quick save slot
  if (ubSaveGameID == 0) {
    ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SAVESUCCESS]);
  }
  //#ifdef JA2BETAVERSION
  else if (ubSaveGameID == SAVE__END_TURN_NUM) {
    //		ScreenMsg( FONT_MCOLOR_WHITE, MSG_INTERFACE, pMessageStrings[ MSG_END_TURN_AUTO_SAVE ] );
  }
  //#endif
  else {
    ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SAVESLOTSUCCESS]);
  }

  // restore the music mode
  SetMusicMode(gubMusicMode);

  // Unset the fact that we are saving a game
  gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;

  UnPauseAfterSaveGame();

  // Check for enough free hard drive space
  NextLoopCheckForEnoughFreeHardDriveSpace();

  return TRUE;

  // if there is an error saving the game
FAILED_TO_SAVE:

  FileClose(hFile);

  if (fWePausedIt) {
    UnPauseAfterSaveGame();
  }

  // Delete the failed attempt at saving
  DeleteSaveGameNumber(ubSaveGameID);

  // Put out an error message
  ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, zSaveLoadText[Enum371.SLG_SAVE_GAME_ERROR]);

  // Check for enough free hard drive space
  NextLoopCheckForEnoughFreeHardDriveSpace();

  return FALSE;
}

let guiBrokenSaveGameVersion: UINT32 = 0;

function LoadSavedGame(ubSavedGameID: UINT8): BOOLEAN {
  let hFile: HWFILE;
  let SaveGameHeader: SAVED_GAME_HEADER;
  let uiNumBytesRead: UINT32 = 0;

  let sLoadSectorX: INT16;
  let sLoadSectorY: INT16;
  let bLoadSectorZ: INT8;
  let zSaveGameName: CHAR8[] /* [512] */;
  let uiSizeOfGeneralInfo: UINT32 = sizeof(GENERAL_SAVE_INFO);

  let uiRelStartPerc: UINT32;
  let uiRelEndPerc: UINT32;

  uiRelStartPerc = uiRelEndPerc = 0;

  TrashAllSoldiers();

  // Empty the dialogue Queue cause someone could still have a quote in waiting
  EmptyDialogueQueue();

  // If there is someone talking, stop them
  StopAnyCurrentlyTalkingSpeech();

  ZeroAnimSurfaceCounts();

  ShutdownNPCQuotes();

  // is it a valid save number
  if (ubSavedGameID >= NUM_SAVE_GAMES) {
    if (ubSavedGameID != SAVE__END_TURN_NUM)
      return FALSE;
  } else if (!gbSaveGameArray[ubSavedGameID])
    return FALSE;

  // Used in mapescreen to disable the annoying 'swoosh' transitions
  gfDontStartTransitionFromLaptop = TRUE;

  // Reset timer callbacks
  gpCustomizableTimerCallback = null;

  gubSaveGameLoc = ubSavedGameID;

  // Set the fact that we are loading a saved game
  gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

  // Trash the existing world.  This is done to ensure that if we are loading a game that doesn't have
  // a world loaded, that we trash it beforehand -- else the player could theoretically enter that sector
  // where it would be in a pre-load state.
  TrashWorld();

  // Deletes all the Temp files in the Maps\Temp directory
  InitTacticalSave(TRUE);

  // ATE; Added to empry dialogue q
  EmptyDialogueQueue();

  // Create the name of the file
  CreateSavedGameFileNameFromNumber(ubSavedGameID, zSaveGameName);

  // open the save game file
  hFile = FileOpen(zSaveGameName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (!hFile) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  // Load the Save Game header file
  FileRead(hFile, addressof(SaveGameHeader), sizeof(SAVED_GAME_HEADER), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(SAVED_GAME_HEADER)) {
    FileClose(hFile);
    return FALSE;
  }

  guiJA2EncryptionSet = CalcJA2EncryptionSet(addressof(SaveGameHeader));

  guiBrokenSaveGameVersion = SaveGameHeader.uiSavedGameVersion;

  // if the player is loading up an older version of the game, and the person DOESNT have the cheats on,
  if (SaveGameHeader.uiSavedGameVersion < 65 && !CHEATER_CHEAT_LEVEL()) {
    // Fail loading the save
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  // Store the loading screenID that was saved
  gubLastLoadingScreenID = SaveGameHeader.ubLoadScreenID;

  // HACK
  guiSaveGameVersion = SaveGameHeader.uiSavedGameVersion;

  /*
          if( !LoadGeneralInfo( hFile ) )
          {
                  FileClose( hFile );
                  return(FALSE);
          }
          #ifdef JA2BETAVERSION
                  LoadGameFilePosition( FileGetPos( hFile ), "Misc info" );
          #endif
  */

  // Load the gtactical status structure plus the current sector x,y,z
  if (!LoadTacticalStatusFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  // This gets reset by the above function
  gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

  // Load the game clock ingo
  if (!LoadGameClock(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  // if we are suppose to use the alternate sector
  if (SaveGameHeader.fAlternateSector) {
    SetSectorFlag(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_USE_ALTERNATE_MAP);
    gfUseAlternateMap = TRUE;
  }

  // if the world was loaded when saved, reload it, otherwise dont
  if (SaveGameHeader.fWorldLoaded || SaveGameHeader.uiSavedGameVersion < 50) {
    // Get the current world sector coordinates
    sLoadSectorX = gWorldSectorX;
    sLoadSectorY = gWorldSectorY;
    bLoadSectorZ = gbWorldSectorZ;

    // This will guarantee that the sector will be loaded
    gbWorldSectorZ = -1;

    // if we should load a sector ( if the person didnt just start the game game )
    if ((gWorldSectorX != 0) && (gWorldSectorY != 0)) {
      // Load the sector
      SetCurrentWorldSector(sLoadSectorX, sLoadSectorY, bLoadSectorZ);
    }
  } else {
    // By clearing these values, we can avoid "in sector" checks -- at least, that's the theory.
    gWorldSectorX = gWorldSectorY = 0;

    // Since there is no
    if (SaveGameHeader.sSectorX == -1 || SaveGameHeader.sSectorY == -1 || SaveGameHeader.bSectorZ == -1)
      gubLastLoadingScreenID = Enum22.LOADINGSCREEN_HELI;
    else
      gubLastLoadingScreenID = GetLoadScreenID(SaveGameHeader.sSectorX, SaveGameHeader.sSectorY, SaveGameHeader.bSectorZ);

    BeginLoadScreen();
  }

  CreateLoadingScreenProgressBar();
  SetProgressBarColor(0, 0, 0, 150);

  uiRelStartPerc = 0;

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Events...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // load the game events
  if (!LoadStrategicEventsFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Laptop Info");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadLaptopInfoFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Merc Profiles...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load all the saved Merc profiles
  //
  if (!LoadSavedMercProfiles(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 30;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Soldier Structure...");
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the soldier structure info
  //
  if (!LoadSoldierStructure(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Finances Data File...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the Finances Data and write it to a new file
  //
  if (!LoadFilesFromSavedGame(FINANCES_DATA_FILE, hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "History File...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the History Data and write it to a new file
  //
  if (!LoadFilesFromSavedGame(HISTORY_DATA_FILE, hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "The Laptop FILES file...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the Files Data and write it to a new file
  //
  if (!LoadFilesFromSavedGame(FILES_DAT_FILE, hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Email...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the data for the emails
  if (!LoadEmailFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the strategic Information
  if (!LoadStrategicInfoFromSavedFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "UnderGround Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the underground information
  if (!LoadUnderGroundSectorInfoFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Squad Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load all the squad info from the saved game file
  if (!LoadSquadInfoFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Movement Groups...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the group linked list
  if (!LoadStrategicMovementGroupsFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 30;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "All the Map Temp files...");
  uiRelStartPerc = uiRelEndPerc;

  // Load all the map temp files from the saved game file into the maps\temp directory
  if (!LoadMapTempFilesFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Quest Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadQuestInfoFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "OppList Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadOppListInfoFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "MapScreen Messages...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadMapScreenMessagesFromSaveGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "NPC Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadNPCInfoFromSavedGameFile(hFile, SaveGameHeader.uiSavedGameVersion)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "KeyTable...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadKeyTableFromSaveedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Npc Temp Quote File...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadTempNpcQuoteArrayToSaveGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "PreGenerated Random Files...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadPreRandomNumbersFromSaveGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Smoke Effect Structures...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadSmokeEffectsFromLoadGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Arms Dealers Inventory...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadArmsDealerInventoryFromSavedGameFile(hFile, (SaveGameHeader.uiSavedGameVersion >= 54), (SaveGameHeader.uiSavedGameVersion >= 55))) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Misc info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadGeneralInfo(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Mine Status...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadMineStatusFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return FALSE;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Town Loyalty...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 21) {
    if (!LoadStrategicTownLoyaltyFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Vehicle Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 22) {
    if (!LoadVehicleInformationFromSavedGameFile(hFile, SaveGameHeader.uiSavedGameVersion)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Bullet Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadBulletStructureFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Physics table...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadPhysicsTableFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Air Raid Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadAirRaidInfoFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Team Turn Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadTeamTurnsFromTheSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Explosion Table...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 25) {
    if (!LoadExplosionTableFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Creature Spreading...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 27) {
    if (!LoadCreatureDirectives(hFile, SaveGameHeader.uiSavedGameVersion)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Status...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 28) {
    if (!LoadStrategicStatusFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic AI...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 31) {
    if (!LoadStrategicAI(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Lighting Effects...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 37) {
    if (!LoadLightEffectsFromLoadGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Watched Locs Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 38) {
    if (!LoadWatchedLocsFromSavedGame(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Item cursor Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 39) {
    if (!LoadItemCursorFromSavedGame(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Civ Quote System...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 51) {
    if (!LoadCivQuotesFromLoadGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Backed up NPC Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 53) {
    if (!LoadBackupNPCInfoFromSavedGameFile(hFile, SaveGameHeader.uiSavedGameVersion)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Meanwhile definitions...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 58) {
    if (!LoadMeanwhileDefsFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  } else {
    memcpy(addressof(gMeanwhileDef[gCurrentMeanwhileDef.ubMeanwhileID]), addressof(gCurrentMeanwhileDef), sizeof(MEANWHILE_DEFINITION));
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Schedules...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 59) {
    // trash schedules loaded from map
    DestroyAllSchedulesWithoutDestroyingEvents();
    if (!LoadSchedulesFromSave(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Extra Vehicle Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 61) {
    if (SaveGameHeader.uiSavedGameVersion < 84) {
      if (!LoadVehicleMovementInfoFromSavedGameFile(hFile)) {
        FileClose(hFile);
        guiSaveGameVersion = 0;
        return FALSE;
      }
    } else {
      if (!NewLoadVehicleMovementInfoFromSavedGameFile(hFile)) {
        FileClose(hFile);
        guiSaveGameVersion = 0;
        return FALSE;
      }
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Contract renweal sequence stuff...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion < 62) {
    // the older games had a bug where this flag was never being set
    gfResetAllPlayerKnowsEnemiesFlags = TRUE;
  }

  if (SaveGameHeader.uiSavedGameVersion >= 67) {
    if (!LoadContractRenewalDataFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  if (SaveGameHeader.uiSavedGameVersion >= 70) {
    if (!LoadLeaveItemList(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  if (SaveGameHeader.uiSavedGameVersion <= 73) {
    // Patch vehicle fuel
    AddVehicleFuelToSave();
  }

  if (SaveGameHeader.uiSavedGameVersion >= 85) {
    if (!NewWayOfLoadingBobbyRMailOrdersToSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return FALSE;
    }
  }

  // If there are any old Bobby R Mail orders, tranfer them to the new system
  if (SaveGameHeader.uiSavedGameVersion < 85) {
    HandleOldBobbyRMailOrders();
  }

  /// lll

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Close the saved game file
  //
  FileClose(hFile);

  // ATE: Patch? Patch up groups.....( will only do for old saves.. )
  UpdatePersistantGroupsFromOldSave(SaveGameHeader.uiSavedGameVersion);

  if (SaveGameHeader.uiSavedGameVersion <= 40) {
    // Cancel all pending purchase orders for BobbyRay's.  Starting with version 41, the BR orders events are
    // posted with the usItemIndex itself as the parameter, rather than the inventory slot index.  This was
    // done to make it easier to modify BR's traded inventory lists later on without breaking saves.
    CancelAllPendingBRPurchaseOrders();
  }

  // if the world is loaded, apply the temp files to the loaded map
  if (SaveGameHeader.fWorldLoaded || SaveGameHeader.uiSavedGameVersion < 50) {
    // Load the current sectors Information From the temporary files
    if (!LoadCurrentSectorsInformationFromTempItemsFile()) {
      InitExitGameDialogBecauseFileHackDetected();
      guiSaveGameVersion = 0;
      return TRUE;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  InitAI();

  // Update the mercs in the sector with the new soldier info
  UpdateMercsInSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // ReconnectSchedules();
  PostSchedules();

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Reset the lighting level if we are outside
  if (gbWorldSectorZ == 0)
    LightSetBaseLevel(GetTimeOfDayAmbientLightLevel());

  // if we have been to this sector before
  //	if( SectorInfo[ SECTOR( gWorldSectorX,gWorldSectorY) ].uiFlags & SF_ALREADY_VISITED )
  {
    // Reset the fact that we are loading a saved game
    gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;
  }

  // CJC January 13: we can't do this because (a) it resets militia IN THE MIDDLE OF
  // COMBAT, and (b) if we add militia to the teams while LOADING_SAVED_GAME is set,
  // the team counters will not be updated properly!!!
  //	ResetMilitia();

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // if the UI was locked in the saved game file
  if (gTacticalStatus.ubAttackBusyCount > 1) {
    // Lock the ui
    SetUIBusy(gusSelectedSoldier);
  }

  // Reset the shadow
  SetFontShadow(DEFAULT_SHADOW);

  // if we succesfully LOADED! the game, mark this entry as the last saved game file
  gGameSettings.bLastSavedGameSlot = ubSavedGameID;

  // Save the save game settings
  SaveGameSettings();

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Reset the Ai Timer clock
  giRTAILastUpdateTime = 0;

  // if we are in tactical
  if (guiScreenToGotoAfterLoadingSavedGame == Enum26.GAME_SCREEN) {
    // Initialize the current panel
    InitializeCurrentPanel();

    SelectSoldier(gusSelectedSoldier, FALSE, TRUE);
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // init extern faces
  InitalizeStaticExternalNPCFaces();

  // load portraits
  LoadCarPortraitValues();

  // OK, turn OFF show all enemies....
  gTacticalStatus.uiFlags &= (~SHOW_ALL_MERCS);
  gTacticalStatus.uiFlags &= ~SHOW_ALL_ITEMS;

  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Setting attack busy count to 0 from load"));
    gTacticalStatus.ubAttackBusyCount = 0;
  }

  if (SaveGameHeader.uiSavedGameVersion < 64) {
    // Militia/enemies/creature team sizes have been changed from 32 to 20.  This function
    // will simply kill off the excess.  This will allow the ability to load previous saves, though
    // there will still be problems, though a LOT less than there would be without this call.
    TruncateStrategicGroupSizes();
  }

  // ATE: if we are within this window where skyridder was foobared, fix!
  if (SaveGameHeader.uiSavedGameVersion >= 61 && SaveGameHeader.uiSavedGameVersion <= 65) {
    let pSoldier: Pointer<SOLDIERTYPE>;
    let pProfile: Pointer<MERCPROFILESTRUCT>;

    if (!fSkyRiderSetUp) {
      // see if we can find him and remove him if so....
      pSoldier = FindSoldierByProfileID(Enum268.SKYRIDER, FALSE);

      if (pSoldier != null) {
        TacticalRemoveSoldier(pSoldier.value.ubID);
      }

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
    }
  }

  if (SaveGameHeader.uiSavedGameVersion < 68) {
    // correct bVehicleUnderRepairID for all mercs
    let ubID: UINT8;
    for (ubID = 0; ubID < MAXMERCS; ubID++) {
      Menptr[ubID].bVehicleUnderRepairID = -1;
    }
  }

  if (SaveGameHeader.uiSavedGameVersion < 73) {
    if (LaptopSaveInfo.fMercSiteHasGoneDownYet)
      LaptopSaveInfo.fFirstVisitSinceServerWentDown = 2;
  }

  // Update the MERC merc contract lenght.  Before save version 77 the data was stored in the SOLDIERTYPE,
  // after 77 the data is stored in the profile
  if (SaveGameHeader.uiSavedGameVersion < 77) {
    UpdateMercMercContractInfo();
  }

  if (SaveGameHeader.uiSavedGameVersion <= 89) {
    // ARM: A change was made in version 89 where refuel site availability now also depends on whether the player has
    // airspace control over that sector.  To update the settings immediately, must call it here.
    UpdateRefuelSiteAvailability();
  }

  if (SaveGameHeader.uiSavedGameVersion < 91) {
    // update the amount of money that has been paid to speck
    CalcAproximateAmountPaidToSpeck();
  }

  gfLoadedGame = TRUE;

  uiRelEndPerc = 100;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Done!");
  RenderProgressBar(0, 100);

  RemoveLoadingScreenProgressBar();

  SetMusicMode(gMusicModeToPlay);

  RESET_CHEAT_LEVEL();

  // reset to 0
  guiSaveGameVersion = 0;

  // reset once-per-convo records for everyone in the loaded sector
  ResetOncePerConvoRecordsForAllNPCsInLoadedSector();

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // fix lingering attack busy count problem on loading saved game by resetting a.b.c
    // if we're not in combat.
    gTacticalStatus.ubAttackBusyCount = 0;
  }

  // fix squads
  CheckSquadMovementGroups();

  // The above function LightSetBaseLevel adjusts ALL the level node light values including the merc node,
  // we must reset the values
  HandlePlayerTogglingLightEffects(FALSE);

  return TRUE;
}

function SaveMercProfiles(hFile: HWFILE): BOOLEAN {
  let cnt: UINT16;
  let uiNumBytesWritten: UINT32 = 0;
  let uiSaveSize: UINT32 = sizeof(MERCPROFILESTRUCT);

  // Lopp through all the profiles to save
  for (cnt = 0; cnt < NUM_PROFILES; cnt++) {
    gMercProfiles[cnt].uiProfileChecksum = ProfileChecksum(addressof(gMercProfiles[cnt]));
    if (guiSavedGameVersion < 87) {
      JA2EncryptedFileWrite(hFile, addressof(gMercProfiles[cnt]), uiSaveSize, addressof(uiNumBytesWritten));
    } else {
      NewJA2EncryptedFileWrite(hFile, addressof(gMercProfiles[cnt]), uiSaveSize, addressof(uiNumBytesWritten));
    }
    if (uiNumBytesWritten != uiSaveSize) {
      return FALSE;
    }
  }

  return TRUE;
}

function LoadSavedMercProfiles(hFile: HWFILE): BOOLEAN {
  let cnt: UINT16;
  let uiNumBytesRead: UINT32 = 0;

  // Lopp through all the profiles to Load
  for (cnt = 0; cnt < NUM_PROFILES; cnt++) {
    if (guiSaveGameVersion < 87) {
      JA2EncryptedFileRead(hFile, addressof(gMercProfiles[cnt]), sizeof(MERCPROFILESTRUCT), addressof(uiNumBytesRead));
    } else {
      NewJA2EncryptedFileRead(hFile, addressof(gMercProfiles[cnt]), sizeof(MERCPROFILESTRUCT), addressof(uiNumBytesRead));
    }
    if (uiNumBytesRead != sizeof(MERCPROFILESTRUCT)) {
      return FALSE;
    }
    if (gMercProfiles[cnt].uiProfileChecksum != ProfileChecksum(addressof(gMercProfiles[cnt]))) {
      return FALSE;
    }
  }

  return TRUE;
}

// Not saving any of these in the soldier struct

//	struct TAG_level_node				*pLevelNode;
//	struct TAG_level_node				*pExternShadowLevelNode;
//	struct TAG_level_node				*pRoofUILevelNode;
//	UINT16											*pBackGround;
//	UINT16											*pZBackground;
//	UINT16											*pForcedShade;
//
// 	UINT16											*pEffectShades[ NUM_SOLDIER_EFFECTSHADES ]; // Shading tables for effects
//  THROW_PARAMS								*pThrowParams;
//  UINT16											*pCurrentShade;
//	UINT16											*pGlowShades[ 20 ]; //
//	UINT16											*pShades[ NUM_SOLDIER_SHADES ]; // Shading tables
//	UINT16											*p16BPPPalette;
//	SGPPaletteEntry							*p8BPPPalette
//	OBJECTTYPE									*pTempObject;

function SaveSoldierStructure(hFile: HWFILE): BOOLEAN {
  let cnt: UINT16;
  let uiNumBytesWritten: UINT32 = 0;
  let ubOne: UINT8 = 1;
  let ubZero: UINT8 = 0;

  let uiSaveSize: UINT32 = sizeof(SOLDIERTYPE);

  // Loop through all the soldier structs to save
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    // if the soldier isnt active, dont add them to the saved game file.
    if (!Menptr[cnt].bActive) {
      // Save the byte specifing to NOT load the soldiers
      FileWrite(hFile, addressof(ubZero), 1, addressof(uiNumBytesWritten));
      if (uiNumBytesWritten != 1) {
        return FALSE;
      }
    }

    else {
      // Save the byte specifing to load the soldiers
      FileWrite(hFile, addressof(ubOne), 1, addressof(uiNumBytesWritten));
      if (uiNumBytesWritten != 1) {
        return FALSE;
      }

      // calculate checksum for soldier
      Menptr[cnt].uiMercChecksum = MercChecksum(addressof(Menptr[cnt]));
      // Save the soldier structure
      if (guiSavedGameVersion < 87) {
        JA2EncryptedFileWrite(hFile, addressof(Menptr[cnt]), uiSaveSize, addressof(uiNumBytesWritten));
      } else {
        NewJA2EncryptedFileWrite(hFile, addressof(Menptr[cnt]), uiSaveSize, addressof(uiNumBytesWritten));
      }
      if (uiNumBytesWritten != uiSaveSize) {
        return FALSE;
      }

      //
      // Save all the pointer info from the structure
      //

      // Save the pMercPath
      if (!SaveMercPathFromSoldierStruct(hFile, cnt))
        return FALSE;

      //
      // do we have a 	KEY_ON_RING									*pKeyRing;
      //

      if (Menptr[cnt].pKeyRing != null) {
        // write to the file saying we have the ....
        FileWrite(hFile, addressof(ubOne), 1, addressof(uiNumBytesWritten));
        if (uiNumBytesWritten != 1) {
          return FALSE;
        }

        // Now save the ....
        FileWrite(hFile, Menptr[cnt].pKeyRing, NUM_KEYS * sizeof(KEY_ON_RING), addressof(uiNumBytesWritten));
        if (uiNumBytesWritten != NUM_KEYS * sizeof(KEY_ON_RING)) {
          return FALSE;
        }
      } else {
        // write to the file saying we DO NOT have the Key ring
        FileWrite(hFile, addressof(ubZero), 1, addressof(uiNumBytesWritten));
        if (uiNumBytesWritten != 1) {
          return FALSE;
        }
      }
    }
  }

  return TRUE;
}

function LoadSoldierStructure(hFile: HWFILE): BOOLEAN {
  let cnt: UINT16;
  let uiNumBytesRead: UINT32 = 0;
  let SavedSoldierInfo: SOLDIERTYPE;
  let uiSaveSize: UINT32 = sizeof(SOLDIERTYPE);
  let ubId: UINT8;
  let ubOne: UINT8 = 1;
  let ubActive: UINT8 = 1;
  let uiPercentage: UINT32;

  let CreateStruct: SOLDIERCREATE_STRUCT;

  // Loop through all the soldier and delete them all
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    TacticalRemoveSoldier(cnt);
  }

  // Loop through all the soldier structs to load
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    // update the progress bar
    uiPercentage = (cnt * 100) / (TOTAL_SOLDIERS - 1);

    RenderProgressBar(0, uiPercentage);

    // Read in a byte to tell us whether or not there is a soldier loaded here.
    FileRead(hFile, addressof(ubActive), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }

    // if the soldier is not active, continue
    if (!ubActive) {
      continue;
    }

    // else if there is a soldier
    else {
      // Read in the saved soldier info into a Temp structure
      if (guiSaveGameVersion < 87) {
        JA2EncryptedFileRead(hFile, addressof(SavedSoldierInfo), uiSaveSize, addressof(uiNumBytesRead));
      } else {
        NewJA2EncryptedFileRead(hFile, addressof(SavedSoldierInfo), uiSaveSize, addressof(uiNumBytesRead));
      }
      if (uiNumBytesRead != uiSaveSize) {
        return FALSE;
      }
      // check checksum
      if (MercChecksum(addressof(SavedSoldierInfo)) != SavedSoldierInfo.uiMercChecksum) {
        return FALSE;
      }

      // Make sure all the pointer references are NULL'ed out.
      SavedSoldierInfo.pTempObject = null;
      SavedSoldierInfo.pKeyRing = null;
      SavedSoldierInfo.p8BPPPalette = null;
      SavedSoldierInfo.p16BPPPalette = null;
      memset(SavedSoldierInfo.pShades, 0, sizeof(UINT16 /* Pointer<UINT16> */) * NUM_SOLDIER_SHADES);
      memset(SavedSoldierInfo.pGlowShades, 0, sizeof(UINT16 /* Pointer<UINT16> */) * 20);
      SavedSoldierInfo.pCurrentShade = null;
      SavedSoldierInfo.pThrowParams = null;
      SavedSoldierInfo.pLevelNode = null;
      SavedSoldierInfo.pExternShadowLevelNode = null;
      SavedSoldierInfo.pRoofUILevelNode = null;
      SavedSoldierInfo.pBackGround = null;
      SavedSoldierInfo.pZBackground = null;
      SavedSoldierInfo.pForcedShade = null;
      SavedSoldierInfo.pMercPath = null;
      memset(SavedSoldierInfo.pEffectShades, 0, sizeof(UINT16 /* Pointer<UINT16> */) * NUM_SOLDIER_EFFECTSHADES);

      // if the soldier wasnt active, dont add them now.  Advance to the next merc
      // if( !SavedSoldierInfo.bActive )
      //	continue;

      // Create the new merc
      memset(addressof(CreateStruct), 0, sizeof(SOLDIERCREATE_STRUCT));
      CreateStruct.bTeam = SavedSoldierInfo.bTeam;
      CreateStruct.ubProfile = SavedSoldierInfo.ubProfile;
      CreateStruct.fUseExistingSoldier = TRUE;
      CreateStruct.pExistingSoldier = addressof(SavedSoldierInfo);

      if (!TacticalCreateSoldier(addressof(CreateStruct), addressof(ubId)))
        return FALSE;

      // Load the pMercPath
      if (!LoadMercPathToSoldierStruct(hFile, ubId))
        return FALSE;

      //
      // do we have a 	KEY_ON_RING									*pKeyRing;
      //

      // Read the file to see if we have to load the keys
      FileRead(hFile, addressof(ubOne), 1, addressof(uiNumBytesRead));
      if (uiNumBytesRead != 1) {
        return FALSE;
      }

      if (ubOne) {
        // Now Load the ....
        FileRead(hFile, Menptr[cnt].pKeyRing, NUM_KEYS * sizeof(KEY_ON_RING), addressof(uiNumBytesRead));
        if (uiNumBytesRead != NUM_KEYS * sizeof(KEY_ON_RING)) {
          return FALSE;
        }
      } else {
        Assert(Menptr[cnt].pKeyRing == null);
      }

      // if the soldier is an IMP character
      if (Menptr[cnt].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__PLAYER_CHARACTER && Menptr[cnt].bTeam == gbPlayerNum) {
        ResetIMPCharactersEyesAndMouthOffsets(Menptr[cnt].ubProfile);
      }

      // if the saved game version is before x, calculate the amount of money paid to mercs
      if (guiSaveGameVersion < 83) {
        // if the soldier is someone
        if (Menptr[cnt].ubProfile != NO_PROFILE) {
          if (Menptr[cnt].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
            gMercProfiles[Menptr[cnt].ubProfile].uiTotalCostToDate = gMercProfiles[Menptr[cnt].ubProfile].sSalary * gMercProfiles[Menptr[cnt].ubProfile].iMercMercContractLength;
          } else {
            gMercProfiles[Menptr[cnt].ubProfile].uiTotalCostToDate = gMercProfiles[Menptr[cnt].ubProfile].sSalary * Menptr[cnt].iTotalContractLength;
          }
        }
      }

// FIXME: Language-specific code
// #ifdef GERMAN
//       // Fix neutral flags
//       if (guiSaveGameVersion < 94) {
//         if (Menptr[cnt].bTeam == OUR_TEAM && Menptr[cnt].bNeutral && Menptr[cnt].bAssignment != ASSIGNMENT_POW) {
//           // turn off neutral flag
//           Menptr[cnt].bNeutral = FALSE;
//         }
//       }
// #endif
      // JA2Gold: fix next-to-previous attacker value
      if (guiSaveGameVersion < 99) {
        Menptr[cnt].ubNextToPreviousAttackerID = NOBODY;
      }
    }
  }

  // Fix robot
  if (guiSaveGameVersion <= 87) {
    let pSoldier: Pointer<SOLDIERTYPE>;

    if (gMercProfiles[Enum268.ROBOT].inv[Enum261.VESTPOS] == Enum225.SPECTRA_VEST) {
      // update this
      gMercProfiles[Enum268.ROBOT].inv[Enum261.VESTPOS] = Enum225.SPECTRA_VEST_18;
      gMercProfiles[Enum268.ROBOT].inv[Enum261.HELMETPOS] = Enum225.SPECTRA_HELMET_18;
      gMercProfiles[Enum268.ROBOT].inv[Enum261.LEGPOS] = Enum225.SPECTRA_LEGGINGS_18;
      gMercProfiles[Enum268.ROBOT].bAgility = 50;
      pSoldier = FindSoldierByProfileID(Enum268.ROBOT, FALSE);
      if (pSoldier) {
        pSoldier.value.inv[Enum261.VESTPOS].usItem = Enum225.SPECTRA_VEST_18;
        pSoldier.value.inv[Enum261.HELMETPOS].usItem = Enum225.SPECTRA_HELMET_18;
        pSoldier.value.inv[Enum261.LEGPOS].usItem = Enum225.SPECTRA_LEGGINGS_18;
        pSoldier.value.bAgility = 50;
      }
    }
  }

  return TRUE;
}

/*
BOOLEAN SavePtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile )
{
        UINT8		ubOne = 1;
        UINT8		ubZero = 0;
        UINT32	uiNumBytesWritten;

        if( pData != NULL )
        {
                // write to the file saying we have the ....
                FileWrite( hFile, &ubOne, 1, &uiNumBytesWritten );
                if( uiNumBytesWritten != 1 )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }

                // Now save the ....
                FileWrite( hFile, pData, uiSizeOfObject, &uiNumBytesWritten );
                if( uiNumBytesWritten != uiSizeOfObject )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }
        }
        else
        {
                // write to the file saying we DO NOT have the ...
                FileWrite( hFile, &ubZero, 1, &uiNumBytesWritten );
                if( uiNumBytesWritten != 1 )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }
        }

        return( TRUE );
}



BOOLEAN LoadPtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile )
{
        UINT8		ubOne = 1;
        UINT8		ubZero = 0;
        UINT32	uiNumBytesRead;

        // Read the file to see if we have to load the ....
        FileRead( hFile, &ubOne, 1, &uiNumBytesRead );
        if( uiNumBytesRead != 1 )
        {
                DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Read Soldier Structure from File" ) );
                return(FALSE);
        }

        if( ubOne )
        {
                // if there is memory already allocated, free it
                MemFree( pData );

                //Allocate space for the structure data
                *pData = MemAlloc( uiSizeOfObject );
                if( pData == NULL )
                        return( FALSE );

                // Now Load the ....
                FileRead( hFile, pData, uiSizeOfObject, &uiNumBytesRead );
                if( uiNumBytesRead != uiSizeOfObject )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }
        }
        else
        {
                // if there is memory already allocated, free it
                if( pData )
                {
                        MemFree( pData );
                        pData = NULL;
                }
        }


        return( TRUE );
}
*/

function SaveFilesToSavedGame(pSrcFileName: STR, hFile: HWFILE): BOOLEAN {
  let uiFileSize: UINT32;
  let uiNumBytesWritten: UINT32 = 0;
  let hSrcFile: HWFILE;
  let pData: Pointer<UINT8>;
  let uiNumBytesRead: UINT32;

  // open the file
  hSrcFile = FileOpen(pSrcFileName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (!hSrcFile) {
    return FALSE;
  }

  // Get the file size of the source data file
  uiFileSize = FileGetSize(hSrcFile);
  if (uiFileSize == 0)
    return FALSE;

  // Write the the size of the file to the saved game file
  FileWrite(hFile, addressof(uiFileSize), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return FALSE;
  }

  // Allocate a buffer to read the data into
  pData = MemAlloc(uiFileSize);
  if (pData == null)
    return FALSE;
  memset(pData, 0, uiFileSize);

  // Read the saource file into the buffer
  FileRead(hSrcFile, pData, uiFileSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiFileSize) {
    // Free the buffer
    MemFree(pData);

    return FALSE;
  }

  // Write the buffer to the saved game file
  FileWrite(hFile, pData, uiFileSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiFileSize) {
    // Free the buffer
    MemFree(pData);

    return FALSE;
  }

  // Free the buffer
  MemFree(pData);

  // Clsoe the source data file
  FileClose(hSrcFile);

  return TRUE;
}

function LoadFilesFromSavedGame(pSrcFileName: STR, hFile: HWFILE): BOOLEAN {
  let uiFileSize: UINT32;
  let uiNumBytesWritten: UINT32 = 0;
  let hSrcFile: HWFILE;
  let pData: Pointer<UINT8>;
  let uiNumBytesRead: UINT32;

  // If the source file exists, delete it
  if (FileExists(pSrcFileName)) {
    if (!FileDelete(pSrcFileName)) {
      // unable to delete the original file
      return FALSE;
    }
  }

  // open the destination file to write to
  hSrcFile = FileOpen(pSrcFileName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);
  if (!hSrcFile) {
    // error, we cant open the saved game file
    return FALSE;
  }

  // Read the size of the data
  FileRead(hFile, addressof(uiFileSize), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    FileClose(hSrcFile);

    return FALSE;
  }

  // if there is nothing in the file, return;
  if (uiFileSize == 0) {
    FileClose(hSrcFile);
    return TRUE;
  }

  // Allocate a buffer to read the data into
  pData = MemAlloc(uiFileSize);
  if (pData == null) {
    FileClose(hSrcFile);
    return FALSE;
  }

  // Read into the buffer
  FileRead(hFile, pData, uiFileSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hSrcFile);

    // Free the buffer
    MemFree(pData);

    return FALSE;
  }

  // Write the buffer to the new file
  FileWrite(hSrcFile, pData, uiFileSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiFileSize) {
    FileClose(hSrcFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write to the %s File", pSrcFileName));
    // Free the buffer
    MemFree(pData);

    return FALSE;
  }

  // Free the buffer
  MemFree(pData);

  // Close the source data file
  FileClose(hSrcFile);

  return TRUE;
}

function SaveEmailToSavedGame(hFile: HWFILE): BOOLEAN {
  let uiNumOfEmails: UINT32 = 0;
  let uiSizeOfEmails: UINT32 = 0;
  let pEmail: EmailPtr = pEmailList;
  let pTempEmail: EmailPtr = null;
  let cnt: UINT32;
  let uiStringLength: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;

  let SavedEmail: SavedEmailStruct;

  // loop through all the email to find out the total number
  while (pEmail) {
    pEmail = pEmail.value.Next;
    uiNumOfEmails++;
  }

  uiSizeOfEmails = sizeof(Email) * uiNumOfEmails;

  // write the number of email messages
  FileWrite(hFile, addressof(uiNumOfEmails), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return FALSE;
  }

  // loop trhough all the emails, add each one individually
  pEmail = pEmailList;
  for (cnt = 0; cnt < uiNumOfEmails; cnt++) {
    // Get the strng length of the subject
    uiStringLength = (wcslen(pEmail.value.pSubject) + 1) * 2;

    // write the length of the current emails subject to the saved game file
    FileWrite(hFile, addressof(uiStringLength), sizeof(UINT32), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(UINT32)) {
      return FALSE;
    }

    // write the subject of the current email to the saved game file
    FileWrite(hFile, pEmail.value.pSubject, uiStringLength, addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != uiStringLength) {
      return FALSE;
    }

    // Get the current emails data and asign it to the 'Saved email' struct
    SavedEmail.usOffset = pEmail.value.usOffset;
    SavedEmail.usLength = pEmail.value.usLength;
    SavedEmail.ubSender = pEmail.value.ubSender;
    SavedEmail.iDate = pEmail.value.iDate;
    SavedEmail.iId = pEmail.value.iId;
    SavedEmail.iFirstData = pEmail.value.iFirstData;
    SavedEmail.uiSecondData = pEmail.value.uiSecondData;
    SavedEmail.fRead = pEmail.value.fRead;
    SavedEmail.fNew = pEmail.value.fNew;
    SavedEmail.iThirdData = pEmail.value.iThirdData;
    SavedEmail.iFourthData = pEmail.value.iFourthData;
    SavedEmail.uiFifthData = pEmail.value.uiFifthData;
    SavedEmail.uiSixData = pEmail.value.uiSixData;

    // write the email header to the saved game file
    FileWrite(hFile, addressof(SavedEmail), sizeof(SavedEmailStruct), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(SavedEmailStruct)) {
      return FALSE;
    }

    // advance to the next email
    pEmail = pEmail.value.Next;
  }

  return TRUE;
}

function LoadEmailFromSavedGame(hFile: HWFILE): BOOLEAN {
  let uiNumOfEmails: UINT32 = 0;
  let uiSizeOfSubject: UINT32 = 0;
  let pEmail: EmailPtr = pEmailList;
  let pTempEmail: EmailPtr = null;
  let pData: Pointer<UINT8> = null;
  let cnt: UINT32;
  let SavedEmail: SavedEmailStruct;
  let uiNumBytesRead: UINT32 = 0;

  // Delete the existing list of emails
  ShutDownEmailList();

  pEmailList = null;
  // Allocate memory for the header node
  pEmailList = MemAlloc(sizeof(Email));
  if (pEmailList == null)
    return FALSE;

  memset(pEmailList, 0, sizeof(Email));

  // read in the number of email messages
  FileRead(hFile, addressof(uiNumOfEmails), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return FALSE;
  }

  // loop through all the emails, add each one individually
  pEmail = pEmailList;
  for (cnt = 0; cnt < uiNumOfEmails; cnt++) {
    // get the length of the email subject
    FileRead(hFile, addressof(uiSizeOfSubject), sizeof(UINT32), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(UINT32)) {
      return FALSE;
    }

    // allocate space for the subject
    pData = MemAlloc(EMAIL_SUBJECT_LENGTH * sizeof(wchar_t));
    if (pData == null)
      return FALSE;
    memset(pData, 0, EMAIL_SUBJECT_LENGTH * sizeof(wchar_t));

    // Get the subject
    FileRead(hFile, pData, uiSizeOfSubject, addressof(uiNumBytesRead));
    if (uiNumBytesRead != uiSizeOfSubject) {
      return FALSE;
    }

    // get the rest of the data from the email
    FileRead(hFile, addressof(SavedEmail), sizeof(SavedEmailStruct), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(SavedEmailStruct)) {
      return FALSE;
    }

    //
    // add the email
    //

    // if we havent allocated space yet
    pTempEmail = MemAlloc(sizeof(Email));
    if (pTempEmail == null)
      return FALSE;
    memset(pTempEmail, 0, sizeof(Email));

    pTempEmail.value.usOffset = SavedEmail.usOffset;
    pTempEmail.value.usLength = SavedEmail.usLength;
    pTempEmail.value.ubSender = SavedEmail.ubSender;
    pTempEmail.value.iDate = SavedEmail.iDate;
    pTempEmail.value.iId = SavedEmail.iId;
    pTempEmail.value.fRead = SavedEmail.fRead;
    pTempEmail.value.fNew = SavedEmail.fNew;
    pTempEmail.value.pSubject = pData;
    pTempEmail.value.iFirstData = SavedEmail.iFirstData;
    pTempEmail.value.uiSecondData = SavedEmail.uiSecondData;
    pTempEmail.value.iThirdData = SavedEmail.iThirdData;
    pTempEmail.value.iFourthData = SavedEmail.iFourthData;
    pTempEmail.value.uiFifthData = SavedEmail.uiFifthData;
    pTempEmail.value.uiSixData = SavedEmail.uiSixData;

    // add the current email in
    pEmail.value.Next = pTempEmail;
    pTempEmail.value.Prev = pEmail;

    // moved to the next email
    pEmail = pEmail.value.Next;

    AddMessageToPages(pTempEmail.value.iId);
  }

  // if there are emails
  if (cnt) {
    // the first node of the LL was a dummy, node,get rid  of it
    pTempEmail = pEmailList;
    pEmailList = pEmailList.value.Next;
    pEmailList.value.Prev = null;
    MemFree(pTempEmail);
  } else {
    MemFree(pEmailList);
    pEmailList = null;
  }

  return TRUE;
}

function SaveTacticalStatusToSavedGame(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;

  // write the gTacticalStatus to the saved game file
  FileWrite(hFile, addressof(gTacticalStatus), sizeof(TacticalStatusType), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(TacticalStatusType)) {
    return FALSE;
  }

  //
  // Save the current sector location to the saved game file
  //

  // save gWorldSectorX
  FileWrite(hFile, addressof(gWorldSectorX), sizeof(gWorldSectorX), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(gWorldSectorX)) {
    return FALSE;
  }

  // save gWorldSectorY
  FileWrite(hFile, addressof(gWorldSectorY), sizeof(gWorldSectorY), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(gWorldSectorY)) {
    return FALSE;
  }

  // save gbWorldSectorZ
  FileWrite(hFile, addressof(gbWorldSectorZ), sizeof(gbWorldSectorZ), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(gbWorldSectorZ)) {
    return FALSE;
  }

  return TRUE;
}

function LoadTacticalStatusFromSavedGame(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;

  // Read the gTacticalStatus to the saved game file
  FileRead(hFile, addressof(gTacticalStatus), sizeof(TacticalStatusType), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(TacticalStatusType)) {
    return FALSE;
  }

  //
  // Load the current sector location to the saved game file
  //

  // Load gWorldSectorX
  FileRead(hFile, addressof(gWorldSectorX), sizeof(gWorldSectorX), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(gWorldSectorX)) {
    return FALSE;
  }

  // Load gWorldSectorY
  FileRead(hFile, addressof(gWorldSectorY), sizeof(gWorldSectorY), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(gWorldSectorY)) {
    return FALSE;
  }

  // Load gbWorldSectorZ
  FileRead(hFile, addressof(gbWorldSectorZ), sizeof(gbWorldSectorZ), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(gbWorldSectorZ)) {
    return FALSE;
  }

  return TRUE;
}

function CopySavedSoldierInfoToNewSoldier(pDestSourceInfo: Pointer<SOLDIERTYPE>, pSourceInfo: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Copy the old soldier information over to the new structure
  memcpy(pDestSourceInfo, pSourceInfo, sizeof(SOLDIERTYPE));

  return TRUE;
}

function SetMercsInsertionGridNo(): BOOLEAN {
  let cnt: UINT16 = 0;

  // loop through all the mercs
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    // if the soldier is active
    if (Menptr[cnt].bActive) {
      if (Menptr[cnt].sGridNo != NOWHERE) {
        // set the insertion type to gridno
        Menptr[cnt].ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;

        // set the insertion gridno
        Menptr[cnt].usStrategicInsertionData = Menptr[cnt].sGridNo;

        // set the gridno
        Menptr[cnt].sGridNo = NOWHERE;
      }
    }
  }

  return TRUE;
}

function SaveOppListInfoToSavedGame(hFile: HWFILE): BOOLEAN {
  let uiSaveSize: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;

  // Save the Public Opplist
  uiSaveSize = MAXTEAMS * TOTAL_SOLDIERS;
  FileWrite(hFile, gbPublicOpplist, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save the Seen Oppenents
  uiSaveSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  FileWrite(hFile, gbSeenOpponents, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save the Last Known Opp Locations
  uiSaveSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  FileWrite(hFile, gsLastKnownOppLoc, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save the Last Known Opp Level
  uiSaveSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  FileWrite(hFile, gbLastKnownOppLevel, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save the Public Last Known Opp Locations
  uiSaveSize = MAXTEAMS * TOTAL_SOLDIERS;
  FileWrite(hFile, gsPublicLastKnownOppLoc, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save the Public Last Known Opp Level
  uiSaveSize = MAXTEAMS * TOTAL_SOLDIERS;
  FileWrite(hFile, gbPublicLastKnownOppLevel, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save the Public Noise Volume
  uiSaveSize = MAXTEAMS;
  FileWrite(hFile, gubPublicNoiseVolume, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save the Public Last Noise Gridno
  uiSaveSize = MAXTEAMS;
  FileWrite(hFile, gsPublicNoiseGridno, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  return TRUE;
}

function LoadOppListInfoFromSavedGame(hFile: HWFILE): BOOLEAN {
  let uiLoadSize: UINT32 = 0;
  let uiNumBytesRead: UINT32 = 0;

  // Load the Public Opplist
  uiLoadSize = MAXTEAMS * TOTAL_SOLDIERS;
  FileRead(hFile, gbPublicOpplist, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Load the Seen Oppenents
  uiLoadSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  FileRead(hFile, gbSeenOpponents, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Load the Last Known Opp Locations
  uiLoadSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  FileRead(hFile, gsLastKnownOppLoc, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Load the Last Known Opp Level
  uiLoadSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  FileRead(hFile, gbLastKnownOppLevel, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Load the Public Last Known Opp Locations
  uiLoadSize = MAXTEAMS * TOTAL_SOLDIERS;
  FileRead(hFile, gsPublicLastKnownOppLoc, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Load the Public Last Known Opp Level
  uiLoadSize = MAXTEAMS * TOTAL_SOLDIERS;
  FileRead(hFile, gbPublicLastKnownOppLevel, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Load the Public Noise Volume
  uiLoadSize = MAXTEAMS;
  FileRead(hFile, gubPublicNoiseVolume, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Load the Public Last Noise Gridno
  uiLoadSize = MAXTEAMS;
  FileRead(hFile, gsPublicNoiseGridno, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  return TRUE;
}

function SaveWatchedLocsToSavedGame(hFile: HWFILE): BOOLEAN {
  let uiArraySize: UINT32;
  let uiSaveSize: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;

  uiArraySize = TOTAL_SOLDIERS * NUM_WATCHED_LOCS;

  // save locations of watched points
  uiSaveSize = uiArraySize * sizeof(INT16);
  FileWrite(hFile, gsWatchedLoc, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  uiSaveSize = uiArraySize * sizeof(INT8);

  FileWrite(hFile, gbWatchedLocLevel, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  FileWrite(hFile, gubWatchedLocPoints, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  FileWrite(hFile, gfWatchedLocReset, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  return TRUE;
}

function LoadWatchedLocsFromSavedGame(hFile: HWFILE): BOOLEAN {
  let uiArraySize: UINT32;
  let uiLoadSize: UINT32 = 0;
  let uiNumBytesRead: UINT32 = 0;

  uiArraySize = TOTAL_SOLDIERS * NUM_WATCHED_LOCS;

  uiLoadSize = uiArraySize * sizeof(INT16);
  FileRead(hFile, gsWatchedLoc, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  uiLoadSize = uiArraySize * sizeof(INT8);
  FileRead(hFile, gbWatchedLocLevel, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  FileRead(hFile, gubWatchedLocPoints, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  FileRead(hFile, gfWatchedLocReset, uiLoadSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  return TRUE;
}

function CreateSavedGameFileNameFromNumber(ubSaveGameID: UINT8, pzNewFileName: STR): void {
  // if we are creating the QuickSave file
  if (ubSaveGameID == 0) {
      sprintf(pzNewFileName, "%S\\%S.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], pMessageStrings[Enum333.MSG_QUICKSAVE_NAME], pMessageStrings[Enum333.MSG_SAVEEXTENSION]);
  }
  //#ifdef JA2BETAVERSION
  else if (ubSaveGameID == SAVE__END_TURN_NUM) {
    // The name of the file
    sprintf(pzNewFileName, "%S\\Auto%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], guiLastSaveGameNum, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);

    // increment end turn number
    guiLastSaveGameNum++;

    // just have 2 saves
    if (guiLastSaveGameNum == 2) {
      guiLastSaveGameNum = 0;
    }
  }
  //#endif

  else
    sprintf(pzNewFileName, "%S\\%S%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], pMessageStrings[Enum333.MSG_SAVE_NAME], ubSaveGameID, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);
}

function SaveMercPathFromSoldierStruct(hFile: HWFILE, ubID: UINT8): BOOLEAN {
  let uiNumOfNodes: UINT32 = 0;
  let pTempPath: PathStPtr = Menptr[ubID].pMercPath;
  let uiNumBytesWritten: UINT32 = 0;

  // loop through to get all the nodes
  while (pTempPath) {
    uiNumOfNodes++;
    pTempPath = pTempPath.value.pNext;
  }

  // Save the number of the nodes
  FileWrite(hFile, addressof(uiNumOfNodes), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return FALSE;
  }

  // loop through all the nodes and add them
  pTempPath = Menptr[ubID].pMercPath;

  // loop through nodes and save all the nodes
  while (pTempPath) {
    // Save the number of the nodes
    FileWrite(hFile, pTempPath, sizeof(PathSt), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(PathSt)) {
      return FALSE;
    }

    pTempPath = pTempPath.value.pNext;
  }

  return TRUE;
}

function LoadMercPathToSoldierStruct(hFile: HWFILE, ubID: UINT8): BOOLEAN {
  let uiNumOfNodes: UINT32 = 0;
  let pTempPath: PathStPtr = null;
  let pTemp: PathStPtr = null;
  let uiNumBytesRead: UINT32 = 0;
  let cnt: UINT32;

  // The list SHOULD be empty at this point
  /*
          //if there is nodes, loop through and delete them
          if( Menptr[ ubID ].pMercPath )
          {
                  pTempPath = Menptr[ ubID ].pMercPath;
                  while( pTempPath )
                  {
                          pTemp = pTempPath;
                          pTempPath = pTempPath->pNext;

                          MemFree( pTemp );
                          pTemp=NULL;
                  }

                  Menptr[ ubID ].pMercPath = NULL;
          }
  */

  // Load the number of the nodes
  FileRead(hFile, addressof(uiNumOfNodes), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return FALSE;
  }

  // load all the nodes
  for (cnt = 0; cnt < uiNumOfNodes; cnt++) {
    // Allocate memory for the new node
    pTemp = MemAlloc(sizeof(PathSt));
    if (pTemp == null)
      return FALSE;
    memset(pTemp, 0, sizeof(PathSt));

    // Load the node
    FileRead(hFile, pTemp, sizeof(PathSt), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(PathSt)) {
      return FALSE;
    }

    // Put the node into the list
    if (cnt == 0) {
      pTempPath = pTemp;
      pTemp.value.pPrev = null;
    } else {
      pTempPath.value.pNext = pTemp;
      pTemp.value.pPrev = pTempPath;

      pTempPath = pTempPath.value.pNext;
    }

    pTemp.value.pNext = null;
  }

  // move to beginning of list
  pTempPath = MoveToBeginningOfPathList(pTempPath);

  Menptr[ubID].pMercPath = pTempPath;
  if (Menptr[ubID].pMercPath)
    Menptr[ubID].pMercPath.value.pPrev = null;

  return TRUE;
}

function SaveGeneralInfo(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;

  let sGeneralInfo: GENERAL_SAVE_INFO;
  memset(addressof(sGeneralInfo), 0, sizeof(GENERAL_SAVE_INFO));

  sGeneralInfo.ubMusicMode = gubMusicMode;
  sGeneralInfo.uiCurrentUniqueSoldierId = guiCurrentUniqueSoldierId;
  sGeneralInfo.uiCurrentScreen = guiPreviousOptionScreen;

  sGeneralInfo.usSelectedSoldier = gusSelectedSoldier;
  sGeneralInfo.sRenderCenterX = gsRenderCenterX;
  sGeneralInfo.sRenderCenterY = gsRenderCenterY;
  sGeneralInfo.fAtLeastOneMercWasHired = gfAtLeastOneMercWasHired;
  sGeneralInfo.fHavePurchasedItemsFromTony = gfHavePurchasedItemsFromTony;

  sGeneralInfo.fShowItemsFlag = fShowItemsFlag;
  sGeneralInfo.fShowTownFlag = fShowTownFlag;
  sGeneralInfo.fShowMineFlag = fShowMineFlag;
  sGeneralInfo.fShowAircraftFlag = fShowAircraftFlag;
  sGeneralInfo.fShowTeamFlag = fShowTeamFlag;

  sGeneralInfo.fHelicopterAvailable = fHelicopterAvailable;

  // helicopter vehicle id
  sGeneralInfo.iHelicopterVehicleId = iHelicopterVehicleId;

  // total distance travelled
  //	sGeneralInfo.iTotalHeliDistanceSinceRefuel = iTotalHeliDistanceSinceRefuel;

  // total owed by player
  sGeneralInfo.iTotalAccumulatedCostByPlayer = iTotalAccumulatedCostByPlayer;

  // whether or not skyrider is alive and well? and on our side yet?
  sGeneralInfo.fSkyRiderAvailable = fSkyRiderAvailable;

  // is the heli in the air?
  sGeneralInfo.fHelicopterIsAirBorne = fHelicopterIsAirBorne;

  // is the pilot returning straight to base?
  sGeneralInfo.fHeliReturnStraightToBase = fHeliReturnStraightToBase;

  // heli hovering
  sGeneralInfo.fHoveringHelicopter = fHoveringHelicopter;

  // time started hovering
  sGeneralInfo.uiStartHoverTime = uiStartHoverTime;

  // what state is skyrider's dialogue in in?
  sGeneralInfo.uiHelicopterSkyriderTalkState = guiHelicopterSkyriderTalkState;

  // the flags for skyrider events
  sGeneralInfo.fShowEstoniRefuelHighLight = fShowEstoniRefuelHighLight;
  sGeneralInfo.fShowOtherSAMHighLight = fShowOtherSAMHighLight;
  sGeneralInfo.fShowDrassenSAMHighLight = fShowDrassenSAMHighLight;
  sGeneralInfo.fShowCambriaHospitalHighLight = fShowCambriaHospitalHighLight;

  // The current state of the weather
  sGeneralInfo.uiEnvWeather = guiEnvWeather;

  sGeneralInfo.ubDefaultButton = gubDefaultButton;

  sGeneralInfo.fSkyriderEmptyHelpGiven = gfSkyriderEmptyHelpGiven;
  sGeneralInfo.ubHelicopterHitsTaken = gubHelicopterHitsTaken;
  sGeneralInfo.fSkyriderSaidCongratsOnTakingSAM = gfSkyriderSaidCongratsOnTakingSAM;
  sGeneralInfo.ubPlayerProgressSkyriderLastCommentedOn = gubPlayerProgressSkyriderLastCommentedOn;

  sGeneralInfo.fEnterMapDueToContract = fEnterMapDueToContract;
  sGeneralInfo.ubQuitType = ubQuitType;

  if (pContractReHireSoldier != null)
    sGeneralInfo.sContractRehireSoldierID = pContractReHireSoldier.value.ubID;
  else
    sGeneralInfo.sContractRehireSoldierID = -1;

  memcpy(addressof(sGeneralInfo.GameOptions), addressof(gGameOptions), sizeof(GAME_OPTIONS));

  // Save the Ja2Clock()
  sGeneralInfo.uiBaseJA2Clock = guiBaseJA2Clock;

  // Save the current tactical panel mode
  sGeneralInfo.sCurInterfacePanel = gsCurInterfacePanel;

  // Save the selected merc
  if (gpSMCurrentMerc)
    sGeneralInfo.ubSMCurrentMercID = gpSMCurrentMerc.value.ubID;
  else
    sGeneralInfo.ubSMCurrentMercID = 255;

  // Save the fact that it is the first time in mapscreen
  sGeneralInfo.fFirstTimeInMapScreen = fFirstTimeInMapScreen;

  // save map screen disabling buttons
  sGeneralInfo.fDisableDueToBattleRoster = fDisableDueToBattleRoster;
  sGeneralInfo.fDisableMapInterfaceDueToBattle = fDisableMapInterfaceDueToBattle;

  // Save boxing info
  memcpy(addressof(sGeneralInfo.sBoxerGridNo), addressof(gsBoxerGridNo), NUM_BOXERS * sizeof(INT16));
  memcpy(addressof(sGeneralInfo.ubBoxerID), addressof(gubBoxerID), NUM_BOXERS * sizeof(INT8));
  memcpy(addressof(sGeneralInfo.fBoxerFought), addressof(gfBoxerFought), NUM_BOXERS * sizeof(BOOLEAN));

  // Save the helicopter status
  sGeneralInfo.fHelicopterDestroyed = fHelicopterDestroyed;
  sGeneralInfo.fShowMapScreenHelpText = fShowMapScreenHelpText;

  sGeneralInfo.iSortStateForMapScreenList = giSortStateForMapScreenList;
  sGeneralInfo.fFoundTixa = fFoundTixa;

  sGeneralInfo.uiTimeOfLastSkyriderMonologue = guiTimeOfLastSkyriderMonologue;
  sGeneralInfo.fSkyRiderSetUp = fSkyRiderSetUp;

  memcpy(addressof(sGeneralInfo.fRefuelingSiteAvailable), addressof(fRefuelingSiteAvailable), Enum137.NUMBER_OF_REFUEL_SITES * sizeof(BOOLEAN));

  // Meanwhile stuff
  memcpy(addressof(sGeneralInfo.gCurrentMeanwhileDef), addressof(gCurrentMeanwhileDef), sizeof(MEANWHILE_DEFINITION));
  // sGeneralInfo.gfMeanwhileScheduled = gfMeanwhileScheduled;
  sGeneralInfo.gfMeanwhileTryingToStart = gfMeanwhileTryingToStart;
  sGeneralInfo.gfInMeanwhile = gfInMeanwhile;

  // list of dead guys for squads...in id values -> -1 means no one home
  memcpy(addressof(sGeneralInfo.sDeadMercs), addressof(sDeadMercs), sizeof(INT16) * Enum275.NUMBER_OF_SQUADS * NUMBER_OF_SOLDIERS_PER_SQUAD);

  // level of public noises
  memcpy(addressof(sGeneralInfo.gbPublicNoiseLevel), addressof(gbPublicNoiseLevel), sizeof(INT8) * MAXTEAMS);

  // The screen count for the initscreen
  sGeneralInfo.gubScreenCount = gubScreenCount;

  // used for the mean while screen
  sGeneralInfo.uiMeanWhileFlags = uiMeanWhileFlags;

  // Imp portrait number
  sGeneralInfo.iPortraitNumber = iPortraitNumber;

  // location of first enocunter with enemy
  sGeneralInfo.sWorldSectorLocationOfFirstBattle = sWorldSectorLocationOfFirstBattle;

  // State of email flags
  sGeneralInfo.fUnReadMailFlag = fUnReadMailFlag;
  sGeneralInfo.fNewMailFlag = fNewMailFlag;
  sGeneralInfo.fOldUnReadFlag = fOldUnreadFlag;
  sGeneralInfo.fOldNewMailFlag = fOldNewMailFlag;

  sGeneralInfo.fShowMilitia = fShowMilitia;

  sGeneralInfo.fNewFilesInFileViewer = fNewFilesInFileViewer;

  sGeneralInfo.fLastBoxingMatchWonByPlayer = gfLastBoxingMatchWonByPlayer;

  memcpy(addressof(sGeneralInfo.fSamSiteFound), addressof(fSamSiteFound), NUMBER_OF_SAMS * sizeof(BOOLEAN));

  sGeneralInfo.ubNumTerrorists = gubNumTerrorists;
  sGeneralInfo.ubCambriaMedicalObjects = gubCambriaMedicalObjects;

  sGeneralInfo.fDisableTacticalPanelButtons = gfDisableTacticalPanelButtons;

  sGeneralInfo.sSelMapX = sSelMapX;
  sGeneralInfo.sSelMapY = sSelMapY;
  sGeneralInfo.iCurrentMapSectorZ = iCurrentMapSectorZ;

  // Save the current status of the help screens flag that say wether or not the user has been there before
  sGeneralInfo.usHasPlayerSeenHelpScreenInCurrentScreen = gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen;

  sGeneralInfo.ubBoxingMatchesWon = gubBoxingMatchesWon;
  sGeneralInfo.ubBoxersRests = gubBoxersRests;
  sGeneralInfo.fBoxersResting = gfBoxersResting;

  sGeneralInfo.ubDesertTemperature = gubDesertTemperature;
  sGeneralInfo.ubGlobalTemperature = gubGlobalTemperature;

  sGeneralInfo.sMercArriveSectorX = gsMercArriveSectorX;
  sGeneralInfo.sMercArriveSectorY = gsMercArriveSectorY;

  sGeneralInfo.fCreatureMeanwhileScenePlayed = gfCreatureMeanwhileScenePlayed;

  // save the global player num
  sGeneralInfo.ubPlayerNum = gbPlayerNum;

  // New stuff for the Prebattle interface / autoresolve
  sGeneralInfo.fPersistantPBI = gfPersistantPBI;
  sGeneralInfo.ubEnemyEncounterCode = gubEnemyEncounterCode;
  sGeneralInfo.ubExplicitEnemyEncounterCode = gubExplicitEnemyEncounterCode;
  sGeneralInfo.fBlitBattleSectorLocator = gfBlitBattleSectorLocator;
  sGeneralInfo.ubPBSectorX = gubPBSectorX;
  sGeneralInfo.ubPBSectorY = gubPBSectorY;
  sGeneralInfo.ubPBSectorZ = gubPBSectorZ;
  sGeneralInfo.fCantRetreatInPBI = gfCantRetreatInPBI;
  sGeneralInfo.fExplosionQueueActive = gfExplosionQueueActive;

  sGeneralInfo.bSelectedInfoChar = bSelectedInfoChar;

  sGeneralInfo.iHospitalTempBalance = giHospitalTempBalance;
  sGeneralInfo.iHospitalRefund = giHospitalRefund;
  sGeneralInfo.bHospitalPriceModifier = gbHospitalPriceModifier;
  sGeneralInfo.fPlayerTeamSawJoey = gfPlayerTeamSawJoey;
  sGeneralInfo.fMikeShouldSayHi = gfMikeShouldSayHi;

  // Setup the
  // Save the current music mode
  FileWrite(hFile, addressof(sGeneralInfo), sizeof(GENERAL_SAVE_INFO), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(GENERAL_SAVE_INFO)) {
    FileClose(hFile);
    return FALSE;
  }

  return TRUE;
}

function LoadGeneralInfo(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;

  let sGeneralInfo: GENERAL_SAVE_INFO;
  memset(addressof(sGeneralInfo), 0, sizeof(GENERAL_SAVE_INFO));

  // Load the current music mode
  FileRead(hFile, addressof(sGeneralInfo), sizeof(GENERAL_SAVE_INFO), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(GENERAL_SAVE_INFO)) {
    FileClose(hFile);
    return FALSE;
  }

  gMusicModeToPlay = sGeneralInfo.ubMusicMode;

  guiCurrentUniqueSoldierId = sGeneralInfo.uiCurrentUniqueSoldierId;

  guiScreenToGotoAfterLoadingSavedGame = sGeneralInfo.uiCurrentScreen;

  //	gusSelectedSoldier = NOBODY;
  gusSelectedSoldier = sGeneralInfo.usSelectedSoldier;

  gsRenderCenterX = sGeneralInfo.sRenderCenterX;
  gsRenderCenterY = sGeneralInfo.sRenderCenterY;

  gfAtLeastOneMercWasHired = sGeneralInfo.fAtLeastOneMercWasHired;

  gfHavePurchasedItemsFromTony = sGeneralInfo.fHavePurchasedItemsFromTony;

  fShowItemsFlag = sGeneralInfo.fShowItemsFlag;
  fShowTownFlag = sGeneralInfo.fShowTownFlag;
  fShowMineFlag = sGeneralInfo.fShowMineFlag;
  fShowAircraftFlag = sGeneralInfo.fShowAircraftFlag;
  fShowTeamFlag = sGeneralInfo.fShowTeamFlag;

  fHelicopterAvailable = sGeneralInfo.fHelicopterAvailable;

  // helicopter vehicle id
  iHelicopterVehicleId = sGeneralInfo.iHelicopterVehicleId;

  // total distance travelled
  //	iTotalHeliDistanceSinceRefuel = sGeneralInfo.iTotalHeliDistanceSinceRefuel;

  // total owed to player
  iTotalAccumulatedCostByPlayer = sGeneralInfo.iTotalAccumulatedCostByPlayer;

  // whether or not skyrider is alive and well? and on our side yet?
  fSkyRiderAvailable = sGeneralInfo.fSkyRiderAvailable;

  // is the heli in the air?
  fHelicopterIsAirBorne = sGeneralInfo.fHelicopterIsAirBorne;

  // is the pilot returning straight to base?
  fHeliReturnStraightToBase = sGeneralInfo.fHeliReturnStraightToBase;

  // heli hovering
  fHoveringHelicopter = sGeneralInfo.fHoveringHelicopter;

  // time started hovering
  uiStartHoverTime = sGeneralInfo.uiStartHoverTime;

  // what state is skyrider's dialogue in in?
  guiHelicopterSkyriderTalkState = sGeneralInfo.uiHelicopterSkyriderTalkState;

  // the flags for skyrider events
  fShowEstoniRefuelHighLight = sGeneralInfo.fShowEstoniRefuelHighLight;
  fShowOtherSAMHighLight = sGeneralInfo.fShowOtherSAMHighLight;
  fShowDrassenSAMHighLight = sGeneralInfo.fShowDrassenSAMHighLight;
  fShowCambriaHospitalHighLight = sGeneralInfo.fShowCambriaHospitalHighLight;

  // The current state of the weather
  guiEnvWeather = sGeneralInfo.uiEnvWeather;

  gubDefaultButton = sGeneralInfo.ubDefaultButton;

  gfSkyriderEmptyHelpGiven = sGeneralInfo.fSkyriderEmptyHelpGiven;
  gubHelicopterHitsTaken = sGeneralInfo.ubHelicopterHitsTaken;
  gfSkyriderSaidCongratsOnTakingSAM = sGeneralInfo.fSkyriderSaidCongratsOnTakingSAM;
  gubPlayerProgressSkyriderLastCommentedOn = sGeneralInfo.ubPlayerProgressSkyriderLastCommentedOn;

  fEnterMapDueToContract = sGeneralInfo.fEnterMapDueToContract;
  ubQuitType = sGeneralInfo.ubQuitType;

  // if the soldier id is valid
  if (sGeneralInfo.sContractRehireSoldierID == -1)
    pContractReHireSoldier = null;
  else
    pContractReHireSoldier = addressof(Menptr[sGeneralInfo.sContractRehireSoldierID]);

  memcpy(addressof(gGameOptions), addressof(sGeneralInfo.GameOptions), sizeof(GAME_OPTIONS));

  // Restore the JA2 Clock
  guiBaseJA2Clock = sGeneralInfo.uiBaseJA2Clock;

  // whenever guiBaseJA2Clock changes, we must reset all the timer variables that use it as a reference
  ResetJA2ClockGlobalTimers();

  // Restore the selected merc
  if (sGeneralInfo.ubSMCurrentMercID == 255)
    gpSMCurrentMerc = null;
  else
    gpSMCurrentMerc = addressof(Menptr[sGeneralInfo.ubSMCurrentMercID]);

  // Set the interface panel to the team panel
  ShutdownCurrentPanel();

  // Restore the current tactical panel mode
  gsCurInterfacePanel = sGeneralInfo.sCurInterfacePanel;

  /*
  //moved to last stage in the LoadSaveGame() function
  //if we are in tactical
  if( guiScreenToGotoAfterLoadingSavedGame == GAME_SCREEN )
  {
          //Initialize the current panel
          InitializeCurrentPanel( );

          SelectSoldier( gusSelectedSoldier, FALSE, TRUE );
  }
  */

  // Restore the fact that it is the first time in mapscreen
  fFirstTimeInMapScreen = sGeneralInfo.fFirstTimeInMapScreen;

  // Load map screen disabling buttons
  fDisableDueToBattleRoster = sGeneralInfo.fDisableDueToBattleRoster;
  fDisableMapInterfaceDueToBattle = sGeneralInfo.fDisableMapInterfaceDueToBattle;

  memcpy(addressof(gsBoxerGridNo), addressof(sGeneralInfo.sBoxerGridNo), NUM_BOXERS * sizeof(INT16));
  memcpy(addressof(gubBoxerID), addressof(sGeneralInfo.ubBoxerID), NUM_BOXERS * sizeof(INT8));
  memcpy(addressof(gfBoxerFought), addressof(sGeneralInfo.fBoxerFought), NUM_BOXERS * sizeof(BOOLEAN));

  // Load the helicopter status
  fHelicopterDestroyed = sGeneralInfo.fHelicopterDestroyed;
  fShowMapScreenHelpText = sGeneralInfo.fShowMapScreenHelpText;

  giSortStateForMapScreenList = sGeneralInfo.iSortStateForMapScreenList;
  fFoundTixa = sGeneralInfo.fFoundTixa;

  guiTimeOfLastSkyriderMonologue = sGeneralInfo.uiTimeOfLastSkyriderMonologue;
  fSkyRiderSetUp = sGeneralInfo.fSkyRiderSetUp;

  memcpy(addressof(fRefuelingSiteAvailable), addressof(sGeneralInfo.fRefuelingSiteAvailable), Enum137.NUMBER_OF_REFUEL_SITES * sizeof(BOOLEAN));

  // Meanwhile stuff
  memcpy(addressof(gCurrentMeanwhileDef), addressof(sGeneralInfo.gCurrentMeanwhileDef), sizeof(MEANWHILE_DEFINITION));
  //	gfMeanwhileScheduled = sGeneralInfo.gfMeanwhileScheduled;
  gfMeanwhileTryingToStart = sGeneralInfo.gfMeanwhileTryingToStart;
  gfInMeanwhile = sGeneralInfo.gfInMeanwhile;

  // list of dead guys for squads...in id values -> -1 means no one home
  memcpy(addressof(sDeadMercs), addressof(sGeneralInfo.sDeadMercs), sizeof(INT16) * Enum275.NUMBER_OF_SQUADS * NUMBER_OF_SOLDIERS_PER_SQUAD);

  // level of public noises
  memcpy(addressof(gbPublicNoiseLevel), addressof(sGeneralInfo.gbPublicNoiseLevel), sizeof(INT8) * MAXTEAMS);

  // the screen count for the init screen
  gubScreenCount = sGeneralInfo.gubScreenCount;

  // used for the mean while screen
  if (guiSaveGameVersion < 71) {
    uiMeanWhileFlags = sGeneralInfo.usOldMeanWhileFlags;
  } else {
    uiMeanWhileFlags = sGeneralInfo.uiMeanWhileFlags;
  }

  // Imp portrait number
  iPortraitNumber = sGeneralInfo.iPortraitNumber;

  // location of first enocunter with enemy
  sWorldSectorLocationOfFirstBattle = sGeneralInfo.sWorldSectorLocationOfFirstBattle;

  fShowMilitia = sGeneralInfo.fShowMilitia;

  fNewFilesInFileViewer = sGeneralInfo.fNewFilesInFileViewer;

  gfLastBoxingMatchWonByPlayer = sGeneralInfo.fLastBoxingMatchWonByPlayer;

  memcpy(addressof(fSamSiteFound), addressof(sGeneralInfo.fSamSiteFound), NUMBER_OF_SAMS * sizeof(BOOLEAN));

  gubNumTerrorists = sGeneralInfo.ubNumTerrorists;
  gubCambriaMedicalObjects = sGeneralInfo.ubCambriaMedicalObjects;

  gfDisableTacticalPanelButtons = sGeneralInfo.fDisableTacticalPanelButtons;

  sSelMapX = sGeneralInfo.sSelMapX;
  sSelMapY = sGeneralInfo.sSelMapY;
  iCurrentMapSectorZ = sGeneralInfo.iCurrentMapSectorZ;

  // State of email flags
  fUnReadMailFlag = sGeneralInfo.fUnReadMailFlag;
  fNewMailFlag = sGeneralInfo.fNewMailFlag;
  fOldUnreadFlag = sGeneralInfo.fOldUnReadFlag;
  fOldNewMailFlag = sGeneralInfo.fOldNewMailFlag;

  // Save the current status of the help screens flag that say wether or not the user has been there before
  gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen = sGeneralInfo.usHasPlayerSeenHelpScreenInCurrentScreen;

  gubBoxingMatchesWon = sGeneralInfo.ubBoxingMatchesWon;
  gubBoxersRests = sGeneralInfo.ubBoxersRests;
  gfBoxersResting = sGeneralInfo.fBoxersResting;

  gubDesertTemperature = sGeneralInfo.ubDesertTemperature;
  gubGlobalTemperature = sGeneralInfo.ubGlobalTemperature;

  gsMercArriveSectorX = sGeneralInfo.sMercArriveSectorX;
  gsMercArriveSectorY = sGeneralInfo.sMercArriveSectorY;

  gfCreatureMeanwhileScenePlayed = sGeneralInfo.fCreatureMeanwhileScenePlayed;

  // load the global player num
  gbPlayerNum = sGeneralInfo.ubPlayerNum;

  // New stuff for the Prebattle interface / autoresolve
  gfPersistantPBI = sGeneralInfo.fPersistantPBI;
  gubEnemyEncounterCode = sGeneralInfo.ubEnemyEncounterCode;
  gubExplicitEnemyEncounterCode = sGeneralInfo.ubExplicitEnemyEncounterCode;
  gfBlitBattleSectorLocator = sGeneralInfo.fBlitBattleSectorLocator;
  gubPBSectorX = sGeneralInfo.ubPBSectorX;
  gubPBSectorY = sGeneralInfo.ubPBSectorY;
  gubPBSectorZ = sGeneralInfo.ubPBSectorZ;
  gfCantRetreatInPBI = sGeneralInfo.fCantRetreatInPBI;
  gfExplosionQueueActive = sGeneralInfo.fExplosionQueueActive;

  bSelectedInfoChar = sGeneralInfo.bSelectedInfoChar;

  giHospitalTempBalance = sGeneralInfo.iHospitalTempBalance;
  giHospitalRefund = sGeneralInfo.iHospitalRefund;
  gbHospitalPriceModifier = sGeneralInfo.bHospitalPriceModifier;
  gfPlayerTeamSawJoey = sGeneralInfo.fPlayerTeamSawJoey;
  gfMikeShouldSayHi = sGeneralInfo.fMikeShouldSayHi;

  return TRUE;
}

function SavePreRandomNumbersToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;

  // Save the Prerandom number index
  FileWrite(hFile, addressof(guiPreRandomIndex), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return FALSE;
  }

  // Save the Prerandom number index
  FileWrite(hFile, guiPreRandomNums, sizeof(UINT32) * MAX_PREGENERATED_NUMS, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32) * MAX_PREGENERATED_NUMS) {
    return FALSE;
  }

  return TRUE;
}

function LoadPreRandomNumbersFromSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;

  // Load the Prerandom number index
  FileRead(hFile, addressof(guiPreRandomIndex), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return FALSE;
  }

  // Load the Prerandom number index
  FileRead(hFile, guiPreRandomNums, sizeof(UINT32) * MAX_PREGENERATED_NUMS, addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32) * MAX_PREGENERATED_NUMS) {
    return FALSE;
  }

  return TRUE;
}

function LoadMeanwhileDefsFromSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;

  if (guiSaveGameVersion < 72) {
    // Load the array of meanwhile defs
    FileRead(hFile, gMeanwhileDef, sizeof(MEANWHILE_DEFINITION) * (Enum160.NUM_MEANWHILES - 1), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(MEANWHILE_DEFINITION) * (Enum160.NUM_MEANWHILES - 1)) {
      return FALSE;
    }
    // and set the last one
    memset(addressof(gMeanwhileDef[Enum160.NUM_MEANWHILES - 1]), 0, sizeof(MEANWHILE_DEFINITION));
  } else {
    // Load the array of meanwhile defs
    FileRead(hFile, gMeanwhileDef, sizeof(MEANWHILE_DEFINITION) * Enum160.NUM_MEANWHILES, addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(MEANWHILE_DEFINITION) * Enum160.NUM_MEANWHILES) {
      return FALSE;
    }
  }

  return TRUE;
}

function SaveMeanwhileDefsFromSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;

  // Save the array of meanwhile defs
  FileWrite(hFile, addressof(gMeanwhileDef), sizeof(MEANWHILE_DEFINITION) * Enum160.NUM_MEANWHILES, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(MEANWHILE_DEFINITION) * Enum160.NUM_MEANWHILES) {
    return FALSE;
  }

  return TRUE;
}

function DoesUserHaveEnoughHardDriveSpace(): BOOLEAN {
  let uiBytesFree: UINT32 = 0;

  uiBytesFree = GetFreeSpaceOnHardDriveWhereGameIsRunningFrom();

  // check to see if there is enough hard drive space
  if (uiBytesFree < REQUIRED_FREE_SPACE) {
    return FALSE;
  }

  return TRUE;
}

function GetBestPossibleSectorXYZValues(psSectorX: Pointer<INT16>, psSectorY: Pointer<INT16>, pbSectorZ: Pointer<INT8>): void {
  // if the current sector is valid
  if (gfWorldLoaded) {
    psSectorX.value = gWorldSectorX;
    psSectorY.value = gWorldSectorY;
    pbSectorZ.value = gbWorldSectorZ;
  } else if (iCurrentTacticalSquad != NO_CURRENT_SQUAD && Squad[iCurrentTacticalSquad][0]) {
    if (Squad[iCurrentTacticalSquad][0].value.bAssignment != Enum117.IN_TRANSIT) {
      psSectorX.value = Squad[iCurrentTacticalSquad][0].value.sSectorX;
      psSectorY.value = Squad[iCurrentTacticalSquad][0].value.sSectorY;
      pbSectorZ.value = Squad[iCurrentTacticalSquad][0].value.bSectorZ;
    }
  } else {
    let sSoldierCnt: INT16;
    let pSoldier: Pointer<SOLDIERTYPE>;
    let bLastTeamID: INT16;
    let bCount: INT8 = 0;
    let fFoundAMerc: BOOLEAN = FALSE;

    // Set locator to first merc
    sSoldierCnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

    // loop through all the mercs on the players team to find the one that is not moving
    for (pSoldier = MercPtrs[sSoldierCnt]; sSoldierCnt <= bLastTeamID; sSoldierCnt++, pSoldier++) {
      if (pSoldier.value.bActive) {
        if (pSoldier.value.bAssignment != Enum117.IN_TRANSIT && !pSoldier.value.fBetweenSectors) {
          // we found an alive, merc that is not moving
          psSectorX.value = pSoldier.value.sSectorX;
          psSectorY.value = pSoldier.value.sSectorY;
          pbSectorZ.value = pSoldier.value.bSectorZ;
          fFoundAMerc = TRUE;
          break;
        }
      }
    }

    // if we didnt find a merc
    if (!fFoundAMerc) {
      // Set locator to first merc
      sSoldierCnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

      // loop through all the mercs and find one that is moving
      for (pSoldier = MercPtrs[sSoldierCnt]; sSoldierCnt <= bLastTeamID; sSoldierCnt++, pSoldier++) {
        if (pSoldier.value.bActive) {
          // we found an alive, merc that is not moving
          psSectorX.value = pSoldier.value.sSectorX;
          psSectorY.value = pSoldier.value.sSectorY;
          pbSectorZ.value = pSoldier.value.bSectorZ;
          fFoundAMerc = TRUE;
          break;
        }
      }

      // if we STILL havent found a merc, give up and use the -1, -1, -1
      if (!fFoundAMerc) {
        psSectorX.value = gWorldSectorX;
        psSectorY.value = gWorldSectorY;
        pbSectorZ.value = gbWorldSectorZ;
      }
    }
  }
}

function PauseBeforeSaveGame(): void {
  // if we are not in the save load screen
  if (guiCurrentScreen != Enum26.SAVE_LOAD_SCREEN) {
    // Pause the game
    PauseGame();
  }
}

function UnPauseAfterSaveGame(): void {
  // if we are not in the save load screen
  if (guiCurrentScreen != Enum26.SAVE_LOAD_SCREEN) {
    // UnPause time compression
    UnPauseGame();
  }
}

function TruncateStrategicGroupSizes(): void {
  let pGroup: Pointer<GROUP>;
  let pSector: Pointer<SECTORINFO>;
  let i: INT32;
  for (i = Enum123.SEC_A1; i < Enum123.SEC_P16; i++) {
    pSector = addressof(SectorInfo[i]);
    if (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites > MAX_STRATEGIC_TEAM_SIZE) {
      if (pSector.value.ubNumAdmins > pSector.value.ubNumTroops) {
        if (pSector.value.ubNumAdmins > pSector.value.ubNumElites) {
          pSector.value.ubNumAdmins = 20;
          pSector.value.ubNumTroops = 0;
          pSector.value.ubNumElites = 0;
        } else {
          pSector.value.ubNumAdmins = 0;
          pSector.value.ubNumTroops = 0;
          pSector.value.ubNumElites = 20;
        }
      } else if (pSector.value.ubNumTroops > pSector.value.ubNumElites) {
        if (pSector.value.ubNumTroops > pSector.value.ubNumAdmins) {
          pSector.value.ubNumAdmins = 0;
          pSector.value.ubNumTroops = 20;
          pSector.value.ubNumElites = 0;
        } else {
          pSector.value.ubNumAdmins = 20;
          pSector.value.ubNumTroops = 0;
          pSector.value.ubNumElites = 0;
        }
      } else {
        if (pSector.value.ubNumElites > pSector.value.ubNumTroops) {
          pSector.value.ubNumAdmins = 0;
          pSector.value.ubNumTroops = 0;
          pSector.value.ubNumElites = 20;
        } else {
          pSector.value.ubNumAdmins = 0;
          pSector.value.ubNumTroops = 20;
          pSector.value.ubNumElites = 0;
        }
      }
    }
    // militia
    if (pSector.value.ubNumberOfCivsAtLevel[0] + pSector.value.ubNumberOfCivsAtLevel[1] + pSector.value.ubNumberOfCivsAtLevel[2] > MAX_STRATEGIC_TEAM_SIZE) {
      if (pSector.value.ubNumberOfCivsAtLevel[0] > pSector.value.ubNumberOfCivsAtLevel[1]) {
        if (pSector.value.ubNumberOfCivsAtLevel[0] > pSector.value.ubNumberOfCivsAtLevel[2]) {
          pSector.value.ubNumberOfCivsAtLevel[0] = 20;
          pSector.value.ubNumberOfCivsAtLevel[1] = 0;
          pSector.value.ubNumberOfCivsAtLevel[2] = 0;
        } else {
          pSector.value.ubNumberOfCivsAtLevel[0] = 0;
          pSector.value.ubNumberOfCivsAtLevel[1] = 0;
          pSector.value.ubNumberOfCivsAtLevel[2] = 20;
        }
      } else if (pSector.value.ubNumberOfCivsAtLevel[1] > pSector.value.ubNumberOfCivsAtLevel[2]) {
        if (pSector.value.ubNumberOfCivsAtLevel[1] > pSector.value.ubNumberOfCivsAtLevel[0]) {
          pSector.value.ubNumberOfCivsAtLevel[0] = 0;
          pSector.value.ubNumberOfCivsAtLevel[1] = 20;
          pSector.value.ubNumberOfCivsAtLevel[2] = 0;
        } else {
          pSector.value.ubNumberOfCivsAtLevel[0] = 20;
          pSector.value.ubNumberOfCivsAtLevel[1] = 0;
          pSector.value.ubNumberOfCivsAtLevel[2] = 0;
        }
      } else {
        if (pSector.value.ubNumberOfCivsAtLevel[2] > pSector.value.ubNumberOfCivsAtLevel[1]) {
          pSector.value.ubNumberOfCivsAtLevel[0] = 0;
          pSector.value.ubNumberOfCivsAtLevel[1] = 0;
          pSector.value.ubNumberOfCivsAtLevel[2] = 20;
        } else {
          pSector.value.ubNumberOfCivsAtLevel[0] = 0;
          pSector.value.ubNumberOfCivsAtLevel[1] = 20;
          pSector.value.ubNumberOfCivsAtLevel[2] = 0;
        }
      }
    }
  }
  // Enemy groups
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.value.fPlayer) {
      if (pGroup.value.pEnemyGroup.value.ubNumAdmins + pGroup.value.pEnemyGroup.value.ubNumTroops + pGroup.value.pEnemyGroup.value.ubNumElites > MAX_STRATEGIC_TEAM_SIZE) {
        pGroup.value.ubGroupSize = 20;
        if (pGroup.value.pEnemyGroup.value.ubNumAdmins > pGroup.value.pEnemyGroup.value.ubNumTroops) {
          if (pGroup.value.pEnemyGroup.value.ubNumAdmins > pGroup.value.pEnemyGroup.value.ubNumElites) {
            pGroup.value.pEnemyGroup.value.ubNumAdmins = 20;
            pGroup.value.pEnemyGroup.value.ubNumTroops = 0;
            pGroup.value.pEnemyGroup.value.ubNumElites = 0;
          } else {
            pGroup.value.pEnemyGroup.value.ubNumAdmins = 0;
            pGroup.value.pEnemyGroup.value.ubNumTroops = 0;
            pGroup.value.pEnemyGroup.value.ubNumElites = 20;
          }
        } else if (pGroup.value.pEnemyGroup.value.ubNumTroops > pGroup.value.pEnemyGroup.value.ubNumElites) {
          if (pGroup.value.pEnemyGroup.value.ubNumTroops > pGroup.value.pEnemyGroup.value.ubNumAdmins) {
            pGroup.value.pEnemyGroup.value.ubNumAdmins = 0;
            pGroup.value.pEnemyGroup.value.ubNumTroops = 20;
            pGroup.value.pEnemyGroup.value.ubNumElites = 0;
          } else {
            pGroup.value.pEnemyGroup.value.ubNumAdmins = 20;
            pGroup.value.pEnemyGroup.value.ubNumTroops = 0;
            pGroup.value.pEnemyGroup.value.ubNumElites = 0;
          }
        } else {
          if (pGroup.value.pEnemyGroup.value.ubNumElites > pGroup.value.pEnemyGroup.value.ubNumTroops) {
            pGroup.value.pEnemyGroup.value.ubNumAdmins = 0;
            pGroup.value.pEnemyGroup.value.ubNumTroops = 0;
            pGroup.value.pEnemyGroup.value.ubNumElites = 20;
          } else {
            pGroup.value.pEnemyGroup.value.ubNumAdmins = 0;
            pGroup.value.pEnemyGroup.value.ubNumTroops = 20;
            pGroup.value.pEnemyGroup.value.ubNumElites = 0;
          }
        }
      }
    }
    pGroup = pGroup.value.next;
  }
}

function UpdateMercMercContractInfo(): void {
  let ubCnt: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (ubCnt = Enum268.BIFF; ubCnt <= Enum268.BUBBA; ubCnt++) {
    pSoldier = FindSoldierByProfileID(ubCnt, TRUE);

    // if the merc is on the team
    if (pSoldier == null)
      continue;

    gMercProfiles[ubCnt].iMercMercContractLength = pSoldier.value.iTotalContractLength;

    pSoldier.value.iTotalContractLength = 0;
  }
}

function GetNumberForAutoSave(fLatestAutoSave: BOOLEAN): INT8 {
  let zFileName1: CHAR[] /* [256] */;
  let zFileName2: CHAR[] /* [256] */;
  let hFile: HWFILE;
  let fFile1Exist: BOOLEAN;
  let fFile2Exist: BOOLEAN;
  let CreationTime1: SGP_FILETIME;
  let LastAccessedTime1: SGP_FILETIME;
  let LastWriteTime1: SGP_FILETIME;
  let CreationTime2: SGP_FILETIME;
  let LastAccessedTime2: SGP_FILETIME;
  let LastWriteTime2: SGP_FILETIME;

  fFile1Exist = FALSE;
  fFile2Exist = FALSE;

  // The name of the file
  sprintf(zFileName1, "%S\\Auto%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], 0, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);
  sprintf(zFileName2, "%S\\Auto%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], 1, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);

  if (FileExists(zFileName1)) {
    hFile = FileOpen(zFileName1, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);

    GetFileManFileTime(hFile, addressof(CreationTime1), addressof(LastAccessedTime1), addressof(LastWriteTime1));

    FileClose(hFile);

    fFile1Exist = TRUE;
  }

  if (FileExists(zFileName2)) {
    hFile = FileOpen(zFileName2, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);

    GetFileManFileTime(hFile, addressof(CreationTime2), addressof(LastAccessedTime2), addressof(LastWriteTime2));

    FileClose(hFile);

    fFile2Exist = TRUE;
  }

  if (!fFile1Exist && !fFile2Exist)
    return -1;
  else if (fFile1Exist && !fFile2Exist) {
    if (fLatestAutoSave)
      return 0;
    else
      return -1;
  } else if (!fFile1Exist && fFile2Exist) {
    if (fLatestAutoSave)
      return 1;
    else
      return -1;
  } else {
    if (CompareSGPFileTimes(addressof(LastWriteTime1), addressof(LastWriteTime2)) > 0)
      return 0;
    else
      return 1;
  }
}

function HandleOldBobbyRMailOrders(): void {
  let iCnt: INT32;
  let iNewListCnt: INT32 = 0;

  if (LaptopSaveInfo.usNumberOfBobbyRayOrderUsed != 0) {
    // Allocate memory for the list
    gpNewBobbyrShipments = MemAlloc(sizeof(NewBobbyRayOrderStruct) * LaptopSaveInfo.usNumberOfBobbyRayOrderUsed);
    if (gpNewBobbyrShipments == null) {
      Assert(0);
      return;
    }

    giNumberOfNewBobbyRShipment = LaptopSaveInfo.usNumberOfBobbyRayOrderUsed;

    // loop through and add the old items to the new list
    for (iCnt = 0; iCnt < LaptopSaveInfo.usNumberOfBobbyRayOrderItems; iCnt++) {
      // if this slot is used
      if (LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[iCnt].fActive) {
        // copy over the purchase info
        memcpy(gpNewBobbyrShipments[iNewListCnt].BobbyRayPurchase, LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[iCnt].BobbyRayPurchase, sizeof(BobbyRayPurchaseStruct) * MAX_PURCHASE_AMOUNT);

        gpNewBobbyrShipments[iNewListCnt].fActive = TRUE;
        gpNewBobbyrShipments[iNewListCnt].ubDeliveryLoc = Enum70.BR_DRASSEN;
        gpNewBobbyrShipments[iNewListCnt].ubDeliveryMethod = 0;
        gpNewBobbyrShipments[iNewListCnt].ubNumberPurchases = LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[iCnt].ubNumberPurchases;
        gpNewBobbyrShipments[iNewListCnt].uiPackageWeight = 1;
        gpNewBobbyrShipments[iNewListCnt].uiOrderedOnDayNum = GetWorldDay();
        gpNewBobbyrShipments[iNewListCnt].fDisplayedInShipmentPage = TRUE;

        iNewListCnt++;
      }
    }

    // Clear out the old list
    LaptopSaveInfo.usNumberOfBobbyRayOrderUsed = 0;
    MemFree(LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray);
    LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = null;
  }
}

function CalcJA2EncryptionSet(pSaveGameHeader: Pointer<SAVED_GAME_HEADER>): UINT32 {
  let uiEncryptionSet: UINT32 = 0;

  uiEncryptionSet = pSaveGameHeader.value.uiSavedGameVersion;
  uiEncryptionSet *= pSaveGameHeader.value.uiFlags;
  uiEncryptionSet += pSaveGameHeader.value.iCurrentBalance;
  uiEncryptionSet *= (pSaveGameHeader.value.ubNumOfMercsOnPlayersTeam + 1);
  uiEncryptionSet += pSaveGameHeader.value.bSectorZ * 3;
  uiEncryptionSet += pSaveGameHeader.value.ubLoadScreenID;

  if (pSaveGameHeader.value.fAlternateSector) {
    uiEncryptionSet += 7;
  }

  if (pSaveGameHeader.value.uiRandom % 2 == 0) {
    uiEncryptionSet++;

    if (pSaveGameHeader.value.uiRandom % 7 == 0) {
      uiEncryptionSet++;
      if (pSaveGameHeader.value.uiRandom % 23 == 0) {
        uiEncryptionSet++;
      }
      if (pSaveGameHeader.value.uiRandom % 79 == 0) {
        uiEncryptionSet += 2;
      }
    }
  }

// FIXME: Language-specific code
// #ifdef GERMAN
//   uiEncryptionSet *= 11;
// #endif

  uiEncryptionSet = uiEncryptionSet % 10;

  uiEncryptionSet += pSaveGameHeader.value.uiDay / 10;

  uiEncryptionSet = uiEncryptionSet % 19;

  // now pick a different set of #s depending on what game options we've chosen
  if (pSaveGameHeader.value.sInitialGameOptions.fGunNut) {
    uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS * 6;
  }

  if (pSaveGameHeader.value.sInitialGameOptions.fSciFi) {
    uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS * 3;
  }

  switch (pSaveGameHeader.value.sInitialGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      uiEncryptionSet += 0;
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS;
      break;
    case Enum9.DIF_LEVEL_HARD:
      uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS * 2;
      break;
  }

  return uiEncryptionSet;
}
