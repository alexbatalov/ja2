namespace ja2 {

// Used by PickGridNoToWalkIn
const MAX_ATTEMPTS = 200;

const QUEST_CHECK_EVENT_TIME = (8 * 60);
const BOBBYRAY_UPDATE_TIME = (9 * 60);
const INSURANCE_UPDATE_TIME = 0;
const EARLY_MORNING_TIME = (4 * 60);
const ENRICO_MAIL_TIME = (7 * 60);

const enum Enum176 {
  ABOUT_TO_LOAD_NEW_MAP,
  ABOUT_TO_TRASH_WORLD,
}

export let gfGettingNameFromSaveLoadScreen: boolean;

export let gWorldSectorX: INT16 = 0;
export let gWorldSectorY: INT16 = 0;
export let gbWorldSectorZ: INT8 = -1;

let gsAdjacentSectorX: INT16;
let gsAdjacentSectorY: INT16;
let gbAdjacentSectorZ: INT8;
let gpAdjacentGroup: Pointer<GROUP> = null;
let gubAdjacentJumpCode: UINT8;
let guiAdjacentTraverseTime: UINT32;
export let gubTacticalDirection: UINT8;
let gsAdditionalData: INT16;
let gusDestExitGridNo: UINT16;

let fUsingEdgePointsForStrategicEntry: boolean = false;
export let gfInvalidTraversal: boolean = false;
export let gfLoneEPCAttemptingTraversal: boolean = false;
export let gfRobotWithoutControllerAttemptingTraversal: boolean = false;
export let gubLoneMercAttemptingToAbandonEPCs: boolean = 0;
export let gbPotentiallyAbandonedEPCSlotID: INT8 = -1;

export let gbGreenToElitePromotions: INT8 = 0;
export let gbGreenToRegPromotions: INT8 = 0;
export let gbRegToElitePromotions: INT8 = 0;
export let gbMilitiaPromotions: INT8 = 0;

export let gfUseAlternateMap: boolean = false;
// whether or not we have found Orta yet
export let fFoundOrta: boolean = false;

// have any of the sam sites been found
export let fSamSiteFound: boolean[] /* [NUMBER_OF_SAMS] */ = [
  false,
  false,
  false,
  false,
];

export let pSamList: INT16[] /* [NUMBER_OF_SAMS] */ = [
  SECTOR(SAM_1_X, SAM_1_Y),
  SECTOR(SAM_2_X, SAM_2_Y),
  SECTOR(SAM_3_X, SAM_3_Y),
  SECTOR(SAM_4_X, SAM_4_Y),
];

export let pSamGridNoAList: INT16[] /* [NUMBER_OF_SAMS] */ = [
  10196,
  11295,
  16080,
  11913,
];

export let pSamGridNoBList: INT16[] /* [NUMBER_OF_SAMS] */ = [
  10195,
  11135,
  15920,
  11912,
];

// ATE: Update this w/ graphic used
// Use 3 if / orientation, 4 if \ orientation
export let gbSAMGraphicList: INT8[] /* [NUMBER_OF_SAMS] */ = [
  4,
  3,
  3,
  3,
];

export let gbMercIsNewInThisSector: INT8[] /* [MAX_NUM_SOLDIERS] */;

// the amount of time that a soldier will wait to return to desired/old squad
const DESIRE_SQUAD_RESET_DELAY = 12 * 60;

export let ubSAMControlledSectors: UINT8[][] /* [MAP_WORLD_Y][MAP_WORLD_X] */ = [
  //   1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],

  [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2, 2, 2, 2, 0 ], // A
  [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0 ], // B
  [ 0, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 0 ], // C
  [ 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 0 ], // D
  [ 0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 0 ], // E
  [ 0, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 0 ], // F
  [ 0, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 0 ], // G
  [ 0, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 0 ], // H
  [ 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 0 ], // I
  [ 0, 1, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 0 ], // J
  [ 0, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 0 ], // K
  [ 0, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 0 ], // L
  [ 0, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 0 ], // M
  [ 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 0 ], // N
  [ 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 0 ], // O
  [ 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 0 ], // P

  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
];

let DirXIncrementer: INT16[] /* [8] */ = [
  0, // N
  1, // NE
  1, // E
  1, // SE
  0, // S
  -1, // SW
  -1, // W
  -1 // NW
];

let DirYIncrementer: INT16[] /* [8] */ = [
  -1, // N
  -1, // NE
  0, // E
  1, // SE
  1, // S
  1, // SW
  0, // W
  -1 // NW
];

let pVertStrings: string[] /* STR8[] */ = [
  "X",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
];

let pHortStrings: string[] /* STR8[] */ = [
  "X",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
];

function UndergroundTacticalTraversalTime(bExitDirection: INT8): UINT32 {
  // We are attempting to traverse in an underground environment.  We need to use a complete different
  // method.  When underground, all sectors are instantly adjacent.
  switch (bExitDirection) {
    case Enum186.NORTH_STRATEGIC_MOVE:
      if (gMapInformation.sNorthGridNo != -1)
        return 0;
      break;
    case Enum186.EAST_STRATEGIC_MOVE:
      if (gMapInformation.sEastGridNo != -1)
        return 0;
      break;
    case Enum186.SOUTH_STRATEGIC_MOVE:
      if (gMapInformation.sSouthGridNo != -1)
        return 0;
      break;
    case Enum186.WEST_STRATEGIC_MOVE:
      if (gMapInformation.sWestGridNo != -1)
        return 0;
      break;
  }
  return 0xffffffff;
}

export function BeginLoadScreen(): void {
  let SrcRect: SGPRect = createSGPRect();
  let DstRect: SGPRect = createSGPRect();
  let uiStartTime: UINT32;
  let uiCurrTime: UINT32;
  let iPercentage: INT32;
  let iFactor: INT32;
  let uiTimeRange: UINT32;
  let iLastShadePercentage: INT32;
  let ubLoadScreenID: UINT8;

  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  if (guiCurrentScreen == Enum26.MAP_SCREEN && !(gTacticalStatus.uiFlags & LOADING_SAVED_GAME) && !AreInMeanwhile()) {
    DstRect.iLeft = 0;
    DstRect.iTop = 0;
    DstRect.iRight = 640;
    DstRect.iBottom = 480;
    uiTimeRange = 2000;
    iPercentage = 0;
    iLastShadePercentage = 0;
    uiStartTime = GetJA2Clock();
    BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 640, 480);
    PlayJA2SampleFromFile("SOUNDS\\Final Psionic Blast 01 (16-44).wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    while (iPercentage < 100) {
      uiCurrTime = GetJA2Clock();
      iPercentage = (uiCurrTime - uiStartTime) * 100 / uiTimeRange;
      iPercentage = Math.min(iPercentage, 100);

      // Factor the percentage so that it is modified by a gravity falling acceleration effect.
      iFactor = (iPercentage - 50) * 2;
      if (iPercentage < 50)
        iPercentage = (iPercentage + iPercentage * iFactor * 0.01 + 0.5);
      else
        iPercentage = (iPercentage + (100 - iPercentage) * iFactor * 0.01 + 0.05);

      if (iPercentage > 50) {
        // iFactor = (iPercentage - 50) * 2;
        // if( iFactor > iLastShadePercentage )
        //	{
        // Calculate the difference from last shade % to the new one.  Ex:  Going from
        // 50% shade value to 60% shade value requires applying 20% to the 50% to achieve 60%.
        // if( iLastShadePercentage )
        //	iReqShadePercentage = 100 - (iFactor * 100 / iLastShadePercentage);
        // else
        //	iReqShadePercentage = iFactor;
        // Record the new final shade percentage.
        // iLastShadePercentage = iFactor;
        ShadowVideoSurfaceRectUsingLowPercentTable(guiSAVEBUFFER, 0, 0, 640, 480);
        //	}
      }

      SrcRect.iLeft = 536 * iPercentage / 100;
      SrcRect.iRight = 640 - iPercentage / 20;
      SrcRect.iTop = 367 * iPercentage / 100;
      SrcRect.iBottom = 480 - 39 * iPercentage / 100;
      BltStretchVideoSurface(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 0, addressof(SrcRect), addressof(DstRect));
      InvalidateScreen();
      RefreshScreen(null);
    }
  }
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  InvalidateScreen();
  RefreshScreen(null);

  // If we are loading a saved game, use the Loading screen we saved into the SavedGameHeader file
  // ( which gets reloaded into gubLastLoadingScreenID )
  if (!gfGotoSectorTransition) {
    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      DisplayLoadScreenWithID(gubLastLoadingScreenID);
    } else {
      ubLoadScreenID = GetLoadScreenID(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      DisplayLoadScreenWithID(ubLoadScreenID);
    }
  }
}

function EndLoadScreen(): void {
}

export function InitStrategicEngine(): boolean {
  // this runs every time we start the application, so don't put anything in here that's only supposed to run when a new
  // *game* is started!  Those belong in InitStrategicLayer() instead.

  InitializeMapStructure();

  // set up town stuff
  BuildListOfTownSectors();

  // town distances are pre-calculated and read in from a data file
  // since it takes quite a while to plot strategic paths between all pairs of town sectors...

//#define RECALC_TOWN_DISTANCES

  ReadInDistancesBetweenTowns();

  return true;
}

export function GetTownIdForSector(sMapX: INT16, sMapY: INT16): UINT8 {
  // return the name value of the town in this sector

  return StrategicMap[CALCULATE_STRATEGIC_INDEX(sMapX, sMapY)].bNameId;
}

// return number of sectors this town takes up
export function GetTownSectorSize(bTownId: INT8): UINT8 {
  let ubSectorSize: UINT8 = 0;
  let iCounterA: INT32 = 0;
  let iCounterB: INT32 = 0;

  for (iCounterA = 0; iCounterA < (MAP_WORLD_X - 1); iCounterA++) {
    for (iCounterB = 0; iCounterB < (MAP_WORLD_Y - 1); iCounterB++) {
      if (StrategicMap[CALCULATE_STRATEGIC_INDEX(iCounterA, iCounterB)].bNameId == bTownId) {
        ubSectorSize++;
      }
    }
  }

  return ubSectorSize;
}

function GetMilitiaCountAtLevelAnywhereInTown(ubTownValue: UINT8, ubLevelValue: UINT8): UINT8 {
  let iCounter: INT32 = 0;
  let ubCount: UINT8 = 0;

  while (pTownNamesList[iCounter] != 0) {
    if (StrategicMap[pTownLocationsList[iCounter]].bNameId == ubTownValue) {
      // match.  Add the number of civs at this level
      ubCount += SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[ubLevelValue];
    }

    iCounter++;
  }
  return ubCount;
}

// return number of sectors under player control for this town
export function GetTownSectorsUnderControl(bTownId: INT8): UINT8 {
  let ubSectorsControlled: INT8 = 0;
  let iCounterA: INT32 = 0;
  let iCounterB: INT32 = 0;
  let usSector: UINT16 = 0;

  for (iCounterA = 0; iCounterA < (MAP_WORLD_X - 1); iCounterA++) {
    for (iCounterB = 0; iCounterB < (MAP_WORLD_Y - 1); iCounterB++) {
      usSector = CALCULATE_STRATEGIC_INDEX(iCounterA, iCounterB);

      if ((StrategicMap[usSector].bNameId == bTownId) && (StrategicMap[usSector].fEnemyControlled == false) && (NumEnemiesInSector(iCounterA, iCounterB) == 0)) {
        ubSectorsControlled++;
      }
    }
  }

  return ubSectorsControlled;
}

function InitializeMapStructure(): void {
  memset(StrategicMap, 0, sizeof(StrategicMap));

  InitializeStrategicMapSectorTownNames();
}

export function InitializeSAMSites(): void {
  // move the landing zone over to Omerta
  gsMercArriveSectorX = 9;
  gsMercArriveSectorY = 1;

  // all SAM sites start game in perfect working condition
  StrategicMap[(SAM_1_X) + (MAP_WORLD_X * (SAM_1_Y))].bSAMCondition = 100;
  StrategicMap[(SAM_2_X) + (MAP_WORLD_X * (SAM_2_Y))].bSAMCondition = 100;
  StrategicMap[(SAM_3_X) + (MAP_WORLD_X * (SAM_3_Y))].bSAMCondition = 100;
  StrategicMap[(SAM_4_X) + (MAP_WORLD_X * (SAM_4_Y))].bSAMCondition = 100;

  UpdateAirspaceControl();
}

// get short sector name without town name
export function GetShortSectorString(sMapX: INT16, sMapY: INT16): string {
  // OK, build string id like J11
  return swprintf("%S%S", pVertStrings[sMapY], pHortStrings[sMapX]);
}

export function GetMapFileName(sMapX: INT16, sMapY: INT16, bSectorZ: INT8, bString: Pointer<string> /* STR8 */, fUsePlaceholder: boolean, fAddAlternateMapLetter: boolean): void {
  let bTestString: string /* CHAR8[150] */;
  let bExtensionString: string /* CHAR8[15] */;

  if (bSectorZ != 0) {
    bExtensionString = sprintf("_b%d", bSectorZ);
  } else {
    bExtensionString = "";
  }

  // the gfUseAlternateMap flag is set in the loading saved games.  When starting a new game the underground sector
  // info has not been initialized, so we need the flag to load an alternate sector.
  if (gfUseAlternateMap | GetSectorFlagStatus(sMapX, sMapY, bSectorZ, SF_USE_ALTERNATE_MAP)) {
    gfUseAlternateMap = false;

    // if we ARE to use the a map, or if we are saving AND the save game version is before 80, add the a
    if (fAddAlternateMapLetter) {
      bExtensionString += "_a";
    }
  }

  // If we are in a meanwhile...
  if (AreInMeanwhile() && sMapX == 3 && sMapY == 16 && !bSectorZ) // GetMeanwhileID() != INTERROGATION )
  {
    if (fAddAlternateMapLetter) {
      bExtensionString += "_m";
    }
  }

  // This is the string to return, but...
  bString = sprintf("%s%s%s.DAT", pVertStrings[sMapY], pHortStrings[sMapX], bExtensionString);

  // We will test against this string
  bTestString = sprintf("MAPS\\%s", bString);

  if (fUsePlaceholder && !FileExists(bTestString)) {
    // Debug str
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Map does not exist for %s, using default.", bTestString));
    // Set to a string we know!
    bString = sprintf("H10.DAT", pVertStrings[sMapY], pHortStrings[sMapX]);
    ScreenMsg(FONT_YELLOW, MSG_DEBUG, "Using PLACEHOLDER map!");
  }
  return;
}

export function GetCurrentWorldSector(psMapX: Pointer<INT16>, psMapY: Pointer<INT16>): void {
  psMapX.value = gWorldSectorX;
  psMapY.value = gWorldSectorY;
}

function HandleRPCDescriptionOfSector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): void {
  let cnt: UINT32;
  let ubSectorDescription: UINT8[][] /* [33][3] */ = [
    // row (letter), column, quote #
    [ 2, 13, 0 ], // b13	Drassen
    [ 3, 13, 1 ], // c13	Drassen
    [ 4, 13, 2 ], // d13	Drassen
    [ 8, 13, 3 ], // h13	Alma
    [ 8, 14, 4 ], // h14	Alma
    [ 9, 13, 5 ], // i13	Alma * (extra quote 6 if Sci-fi ) *
    [ 9, 14, 7 ], // i14	Alma
    [ 6, 8, 8 ], // f8	Cambria
    [ 6, 9, 9 ], // f9	Cambria
    [ 7, 8, 10 ], // g8	Cambria

    [ 7, 9, 11 ], // g9	Cambria
    [ 3, 6, 12 ], // c6	San Mona
    [ 3, 5, 13 ], // c5	San Mona
    [ 4, 5, 14 ], // d5	San Mona
    [ 2, 2, 15 ], // b2	Chitzena
    [ 1, 2, 16 ], // a2	Chitzena
    [ 7, 1, 17 ], // g1	Grumm
    [ 8, 1, 18 ], // h1	Grumm
    [ 7, 2, 19 ], // g2 	Grumm
    [ 8, 2, 20 ], // h2	Grumm

    [ 9, 6, 21 ], // i6	Estoni
    [ 11, 4, 22 ], // k4	Orta
    [ 12, 11, 23 ], // l11	Balime
    [ 12, 12, 24 ], // l12	Balime
    [ 15, 3, 25 ], // o3	Meduna
    [ 16, 3, 26 ], // p3	Meduna
    [ 14, 4, 27 ], // n4	Meduna
    [ 14, 3, 28 ], // n3	Meduna
    [ 15, 4, 30 ], // o4	Meduna
    [ 10, 9, 31 ], // j9	Tixa

    [ 4, 15, 32 ], // d15	NE SAM
    [ 4, 2, 33 ], // d2	NW SAM
    [ 9, 8, 34 ], // i8	CENTRAL SAM
  ];

  // Default to false
  gTacticalStatus.fCountingDownForGuideDescription = false;

  // OK, if the first time in...
  if (GetSectorFlagStatus(sSectorX, sSectorY, sSectorZ, SF_HAVE_USED_GUIDE_QUOTE) != true) {
    if (sSectorZ != 0) {
      return;
    }

    // OK, check if we are in a good sector....
    for (cnt = 0; cnt < 33; cnt++) {
      if (sSectorX == ubSectorDescription[cnt][1] && sSectorY == ubSectorDescription[cnt][0]) {
        // If we're not scifi, skip some
        if (!gGameOptions.fSciFi && cnt == 3) {
          continue;
        }

        SetSectorFlag(sSectorX, sSectorY, sSectorZ, SF_HAVE_USED_GUIDE_QUOTE);

        gTacticalStatus.fCountingDownForGuideDescription = true;
        gTacticalStatus.bGuideDescriptionCountDown = (4 + Random(5)); // 4 to 8 tactical turns...
        gTacticalStatus.ubGuideDescriptionToUse = ubSectorDescription[cnt][2];
        gTacticalStatus.bGuideDescriptionSectorX = sSectorX;
        gTacticalStatus.bGuideDescriptionSectorY = sSectorY;
      }
    }
  }

  // Handle guide description ( will be needed if a SAM one )
  HandleRPCDescription();
}

export function SetCurrentWorldSector(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let pUnderWorld: Pointer<UNDERGROUND_SECTORINFO> = null;
  let fChangeMusic: boolean = true;

  // ATE: Zero out accounting functions
  memset(gbMercIsNewInThisSector, 0, sizeof(gbMercIsNewInThisSector));

  SyncStrategicTurnTimes();

      // is the sector already loaded?
      if ((gWorldSectorX == sMapX) && (sMapY == gWorldSectorY) && (bMapZ == gbWorldSectorZ)) {
    // Inserts the enemies into the newly loaded map based on the strategic information.
    // Note, the flag will return TRUE only if enemies were added.  The game may wish to
    // do something else in a case where no enemies are present.

    SetPendingNewScreen(Enum26.GAME_SCREEN);
    if (!NumEnemyInSector()) {
      PrepareEnemyForSectorBattle();
    }
    if (gubNumCreaturesAttackingTown && !gbWorldSectorZ && gubSectorIDOfCreatureAttack == SECTOR(gWorldSectorX, gWorldSectorY)) {
      PrepareCreaturesForBattle();
    }
    if (gfGotoSectorTransition) {
      BeginLoadScreen();
      gfGotoSectorTransition = false;
    }

    // Check for helicopter being on the ground in this sector...
    HandleHelicopterOnGroundGraphic();

    ResetMilitia();
    AllTeamsLookForAll(true);
    return true;
  }

  if (gWorldSectorX && gWorldSectorY && gbWorldSectorZ != -1) {
    HandleDefiniteUnloadingOfWorld(Enum176.ABOUT_TO_LOAD_NEW_MAP);
  }

  // make this the currently loaded sector
  gWorldSectorX = sMapX;
  gWorldSectorY = sMapY;
  gbWorldSectorZ = bMapZ;

  // update currently selected map sector to match
  ChangeSelectedMapSector(sMapX, sMapY, bMapZ);

  // Check to see if the sector we are loading is the cave sector under Tixa.  If so
  // then we will set up the meanwhile scene to start the creature quest.
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    StopAnyCurrentlyTalkingSpeech();

    if (gWorldSectorX == 9 && gWorldSectorY == 10 && gbWorldSectorZ == 2) {
      InitCreatureQuest(); // Ignored if already active.
    }
  }

  // Stop playing any music -- will fade out.
  // SetMusicMode( MUSIC_NONE );

  // ATE: Determine if we should set the default music...

  // Are we already in 'tense' music...

  // ATE: Change music only if not loading....
  /*-
  if ( gubMusicMode == MUSIC_TACTICAL_ENEMYPRESENT  )
  {
          fChangeMusic = FALSE;
  }

  // Did we 'tactically traverse' over....
  if ( gfTacticalTraversal )
  {
          fChangeMusic = FALSE;
  }

  // If we have no music playing at all....
  if ( gubMusicMode == MUSIC_NONE  )
  {
          fChangeMusic = TRUE;
  }
  -*/

  if ((gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    fChangeMusic = true;
  } else {
    fChangeMusic = false;
  }

  if (fChangeMusic) {
    SetMusicMode(Enum328.MUSIC_MAIN_MENU);
  }

  // ATE: Do this stuff earlier!
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Update the last time we were in tactical...
    gTacticalStatus.uiTimeSinceLastInTactical = GetWorldTotalMin();

    // init some AI stuff
    InitializeTacticalStatusAtBattleStart();

    // CJC: delay this until after entering the sector!
    // InitAI();

    // Check for helicopter being on the ground in this sector...
    HandleHelicopterOnGroundSkyriderProfile();
  }

  // Load and enter the new sector
  if (EnterSector(gWorldSectorX, gWorldSectorY, bMapZ)) {
    // CJC: moved this here Feb 17
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      InitAI();
    }

    // If there are any people with schedules, now is the time to process them.
    // CJC: doesn't work here if we're going through the tactical placement GUI; moving
    // this call to PrepareLoadedSector()
    // PostSchedules();

    // ATE: OK, add code here to update the states of doors if they should
    // be closed......
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      ExamineDoorsOnEnteringSector();
    }

    // Update all the doors in the sector according to the temp file previously
    // loaded, and any changes made by the schedules
    UpdateDoorGraphicsFromStatus(true, false);

    // Set the fact we have visited the  sector
    SetSectorFlag(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_ALREADY_LOADED);

    // Check for helicopter being on the ground in this sector...
    HandleHelicopterOnGroundGraphic();
  } else
    return false;

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    if ((gubMusicMode != Enum328.MUSIC_TACTICAL_ENEMYPRESENT && gubMusicMode != Enum328.MUSIC_TACTICAL_BATTLE) || (!NumHostilesInSector(sMapX, sMapY, bMapZ) && gubMusicMode == Enum328.MUSIC_TACTICAL_ENEMYPRESENT)) {
      // ATE; Fade FA.T....
      SetMusicFadeSpeed(5);

      SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
    }

    // ATE: Check what sector we are in, to show description if we have an RPC.....
    HandleRPCDescriptionOfSector(sMapX, sMapY, bMapZ);

    // ATE: Set Flag for being visited...
    SetSectorFlag(sMapX, sMapY, bMapZ, SF_HAS_ENTERED_TACTICAL);

    // ATE; Reset some flags for creature sayings....
    gTacticalStatus.fSaidCreatureFlavourQuote = false;
    gTacticalStatus.fHaveSeenCreature = false;
    gTacticalStatus.fBeenInCombatOnce = false;
    gTacticalStatus.fSaidCreatureSmellQuote = false;
    ResetMultiSelection();

    // ATE: Decide if we can have crows here....
    gTacticalStatus.fGoodToAllowCrows = false;
    gTacticalStatus.fHasEnteredCombatModeSinceEntering = false;
    gTacticalStatus.fDontAddNewCrows = false;

    // Adjust delay for tense quote
    gTacticalStatus.sCreatureTenseQuoteDelay = (10 + Random(20));

    {
      let sWarpWorldX: INT16;
      let sWarpWorldY: INT16;
      let bWarpWorldZ: INT8;
      let sWarpGridNo: INT16;

      if (GetWarpOutOfMineCodes(addressof(sWarpWorldX), addressof(sWarpWorldY), addressof(bWarpWorldZ), addressof(sWarpGridNo)) && gbWorldSectorZ >= 2) {
        gTacticalStatus.uiFlags |= IN_CREATURE_LAIR;
      } else {
        gTacticalStatus.uiFlags &= (~IN_CREATURE_LAIR);
      }
    }

    // Every third turn
    // if ( Random( 3 ) == 0  )
    {
      gTacticalStatus.fGoodToAllowCrows = true;
      gTacticalStatus.ubNumCrowsPossible = (5 + Random(5));
    }
  }

  return true;
}

function MapExists(szFilename: string /* Pointer<UINT8> */): boolean {
  let str: string /* UINT8[50] */;
  let fp: HWFILE;
  str = sprintf("MAPS\\%s", szFilename);
  fp = FileOpen(str, FILE_ACCESS_READ, false);
  if (!fp)
    return false;
  FileClose(fp);
  return true;
}

export function RemoveMercsInSector(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // ATE: only for OUR guys.. the rest is taken care of in TrashWorld() when a new sector is added...
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive) {
      RemoveSoldierFromGridNo(pSoldier);
    }
  }
}

export function PrepareLoadedSector(): void {
  let iCounter: INT32 = 0;
  let fEnemyPresenceInThisSector: boolean = false;
  let fUsingOverride: boolean = false;
  let fAddCivs: boolean = true;
  let bMineIndex: INT8 = -1;

  if (AreInMeanwhile() == false) {
    if (gbWorldSectorZ == 0) {
      //			MakePlayerPerceptionOfSectorControlCorrect( gWorldSectorX, gWorldSectorY, gbWorldSectorZ );
    } else {
      // we always think we control underground sectors once we've visited them
      SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)].fPlayer[gbWorldSectorZ] = true;
    }
  }

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    UpdateMercsInSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
  }

  // Reset ambients!
  HandleNewSectorAmbience(gTilesets[giCurrentTilesetID].ubAmbientID);

  // if we are loading a 'pristine' map ( ie, not loading a saved game )
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    if (!AreReloadingFromMeanwhile()) {
      SetPendingNewScreen(Enum26.GAME_SCREEN);

      // Make interface the team panel always...
      SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
    }

    // Check to see if civilians should be added.  Always add civs to maps unless they are
    // in a mine that is shutdown.
    if (gbWorldSectorZ) {
      bMineIndex = GetIdOfMineForSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      if (bMineIndex != -1) {
        if (!AreThereMinersInsideThisMine(bMineIndex)) {
          fAddCivs = false;
        }
      }
    }
    if (fAddCivs) {
      AddSoldierInitListTeamToWorld(CIV_TEAM, 255);
    }

    AddSoldierInitListTeamToWorld(MILITIA_TEAM, 255);
    AddSoldierInitListBloodcats();
    // Creatures are only added if there are actually some of them.  It has to go through some
    // additional checking.

    PrepareCreaturesForBattle();

    PrepareMilitiaForTactical();

    // OK, set varibles for entring this new sector...
    gTacticalStatus.fVirginSector = true;

    // Inserts the enemies into the newly loaded map based on the strategic information.
    // Note, the flag will return TRUE only if enemies were added.  The game may wish to
    // do something else in a case where no enemies are present.
    if (!gfRestoringEnemySoldiersFromTempFile) {
      // AddSoldierInitListTeamToWorld( CIV_TEAM, 255 );
      //			fEnemyPresenceInThisSector = PrepareEnemyForSectorBattle();
    }
    AddProfilesNotUsingProfileInsertionData();

    if (!AreInMeanwhile() || GetMeanwhileID() == Enum160.INTERROGATION) {
      fEnemyPresenceInThisSector = PrepareEnemyForSectorBattle();
    }

    // Regardless whether or not this was set, clear it now.
    gfRestoringEnemySoldiersFromTempFile = false;

    // KM:  FEB 8, 99 -- This call is no longer required!  Done already when group arrives in sector.
    // if( ( gbWorldSectorZ == 0 ) && ( fEnemyPresenceInThisSector == FALSE ) )
    //{
    //	SetThisSectorAsPlayerControlled( gWorldSectorX, gWorldSectorY, 0 );
    //}

    if (gbWorldSectorZ > 0) {
      // we always think we control underground sectors once we've visited them
      SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)].fPlayer[gbWorldSectorZ] = true;
    }

    //@@@Evaluate
    // Add profiles to world using strategic info, not editor placements.
    AddProfilesUsingProfileInsertionData();

    PostSchedules();
  }

  if (gubEnemyEncounterCode == Enum164.ENEMY_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE) {
    if (gMapInformation.sCenterGridNo != -1) {
      CallAvailableEnemiesTo(gMapInformation.sCenterGridNo);
    } else {
    }
  }

  EndLoadScreen();

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // unpause game
    UnPauseGame();
  }

  gpBattleGroup = null;

  if (gfTacticalTraversal) {
    CalculateNonPersistantPBIInfo();
  }

  ScreenMsg(FONT_YELLOW, MSG_DEBUG, "Current Time is: %d", GetWorldTotalMin());

  AllTeamsLookForAll(true);
}

const RANDOM_HEAD_MINERS = 4;
function HandleQuestCodeOnSectorEntry(sNewSectorX: INT16, sNewSectorY: INT16, bNewSectorZ: INT8): void {
  let ubRandomMiner: UINT8[] /* [RANDOM_HEAD_MINERS] */ = [
    106,
    156,
    157,
    158,
  ];
  let ubMiner: UINT8;
  let ubMinersPlaced: UINT8;
  let ubMine: UINT8;
  let ubThisMine: UINT8;
  let cnt: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (CheckFact(Enum170.FACT_ALL_TERRORISTS_KILLED, 0)) {
    // end terrorist quest
    EndQuest(Enum169.QUEST_KILL_TERRORISTS, gMercProfiles[Enum268.CARMEN].sSectorX, gMercProfiles[Enum268.CARMEN].sSectorY);
    // remove Carmen
    gMercProfiles[Enum268.CARMEN].sSectorX = 0;
    gMercProfiles[Enum268.CARMEN].sSectorY = 0;
    gMercProfiles[Enum268.CARMEN].bSectorZ = 0;
  }

  // are we in a mine sector, on the surface?
  if (IsThereAMineInThisSector(sNewSectorX, sNewSectorY) && (bNewSectorZ == 0)) {
    if (CheckFact(Enum170.FACT_MINERS_PLACED, 0) == false) {
      // SET HEAD MINER LOCATIONS

      ubThisMine = GetMineIndexForSector(sNewSectorX, sNewSectorY);

      if (ubThisMine != Enum179.MINE_SAN_MONA) // San Mona is abandoned
      {
        ubMinersPlaced = 0;

        if (ubThisMine != Enum179.MINE_ALMA) {
          // Fred Morris is always in the first mine sector we enter, unless that's Alma (then he's randomized, too)
          gMercProfiles[106].sSectorX = sNewSectorX;
          gMercProfiles[106].sSectorY = sNewSectorY;
          gMercProfiles[106].bSectorZ = 0;
          gMercProfiles[106].bTown = gMineLocation[ubThisMine].bAssociatedTown;

          // mark miner as placed
          ubRandomMiner[0] = 0;
          ubMinersPlaced++;
        }

        // assign the remaining (3) miners randomly
        for (ubMine = 0; ubMine < Enum179.MAX_NUMBER_OF_MINES; ubMine++) {
          if (ubMine == ubThisMine || ubMine == Enum179.MINE_ALMA || ubMine == Enum179.MINE_SAN_MONA) {
            // Alma always has Matt as a miner, and we have assigned Fred to the current mine
            // and San Mona is abandoned
            continue;
          }

          do {
            ubMiner = Random(RANDOM_HEAD_MINERS);
          } while (ubRandomMiner[ubMiner] == 0);

          GetMineSector(ubMine, addressof(gMercProfiles[ubRandomMiner[ubMiner]].sSectorX), addressof(gMercProfiles[ubRandomMiner[ubMiner]].sSectorY));
          gMercProfiles[ubRandomMiner[ubMiner]].bSectorZ = 0;
          gMercProfiles[ubRandomMiner[ubMiner]].bTown = gMineLocation[ubMine].bAssociatedTown;

          // mark miner as placed
          ubRandomMiner[ubMiner] = 0;
          ubMinersPlaced++;

          if (ubMinersPlaced == RANDOM_HEAD_MINERS) {
            break;
          }
        }

        SetFactTrue(Enum170.FACT_MINERS_PLACED);
      }
    }
  }

  if (CheckFact(Enum170.FACT_ROBOT_RECRUITED_AND_MOVED, 0) == false) {
    let pRobot: Pointer<SOLDIERTYPE>;
    pRobot = FindSoldierByProfileID(Enum268.ROBOT, true);
    if (pRobot) {
      // robot is on our team and we have changed sectors, so we can
      // replace the robot-under-construction in Madlab's sector
      RemoveGraphicFromTempFile(gsRobotGridNo, Enum312.SEVENTHISTRUCT1, gMercProfiles[Enum268.MADLAB].sSectorX, gMercProfiles[Enum268.MADLAB].sSectorY, gMercProfiles[Enum268.MADLAB].bSectorZ);
      SetFactTrue(Enum170.FACT_ROBOT_RECRUITED_AND_MOVED);
    }
  }

  // Check to see if any player merc has the Chalice; if so,
  // note it as stolen
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive) {
      if (FindObj(pSoldier, Enum225.CHALICE) != ITEM_NOT_FOUND) {
        SetFactTrue(Enum170.FACT_CHALICE_STOLEN);
      }
    }
  }

  if ((gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTINPROGRESS) && CheckFact(Enum170.FACT_KINGPIN_CAN_SEND_ASSASSINS, 0) && (GetTownIdForSector(sNewSectorX, sNewSectorY) != Enum135.BLANK_SECTOR) && Random(10 + GetNumberOfMilitiaInSector(sNewSectorX, sNewSectorY, bNewSectorZ)) < 3) {
    DecideOnAssassin();
  }

  /*
          if ( sNewSectorX == 5 && sNewSectorY == MAP_ROW_C )
          {
                  // reset Madame Layla counters
                  gMercProfiles[ MADAME ].bNPCData = 0;
                  gMercProfiles[ MADAME ].bNPCData2 = 0;
          }
          */

  if (sNewSectorX == 6 && sNewSectorY == MAP_ROW_C && gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTDONE) {
    // make sure Maria and Angel are gone
    gMercProfiles[Enum268.MARIA].sSectorX = 0;
    gMercProfiles[Enum268.ANGEL].sSectorY = 0;
    gMercProfiles[Enum268.MARIA].sSectorX = 0;
    gMercProfiles[Enum268.ANGEL].sSectorY = 0;
  }

  if (sNewSectorX == 5 && sNewSectorY == MAP_ROW_D) {
    gubBoxerID[0] = NOBODY;
    gubBoxerID[1] = NOBODY;
    gubBoxerID[2] = NOBODY;
  }

  if (sNewSectorX == 3 && sNewSectorY == MAP_ROW_P) {
    // heal up Elliot if he's been hurt
    if (gMercProfiles[Enum268.ELLIOT].bLife < gMercProfiles[Enum268.ELLIOT].bLifeMax) {
      gMercProfiles[Enum268.ELLIOT].bLife = gMercProfiles[Enum268.ELLIOT].bLifeMax;
    }
  }

  ResetOncePerConvoRecordsForAllNPCsInLoadedSector();
}

function HandleQuestCodeOnSectorExit(sOldSectorX: INT16, sOldSectorY: INT16, bOldSectorZ: INT8): void {
  if (sOldSectorX == KINGPIN_MONEY_SECTOR_X && sOldSectorY == KINGPIN_MONEY_SECTOR_Y && bOldSectorZ == KINGPIN_MONEY_SECTOR_Z) {
    CheckForKingpinsMoneyMissing(true);
  }

  if (sOldSectorX == 13 && sOldSectorY == MAP_ROW_H && bOldSectorZ == 0 && CheckFact(Enum170.FACT_CONRAD_SHOULD_GO, 0)) {
    // remove Conrad from the map
    gMercProfiles[Enum268.CONRAD].sSectorX = 0;
    gMercProfiles[Enum268.CONRAD].sSectorY = 0;
  }

  if (sOldSectorX == HOSPITAL_SECTOR_X && sOldSectorY == HOSPITAL_SECTOR_Y && bOldSectorZ == HOSPITAL_SECTOR_Z) {
    CheckForMissingHospitalSupplies();
  }

  // reset the state of the museum alarm for Eldin's quotes
  SetFactFalse(Enum170.FACT_MUSEUM_ALARM_WENT_OFF);
}

function EnterSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let i: INT32;
  let pNode: Pointer<UNDERGROUND_SECTORINFO> = null;
  let bFilename: string /* CHAR8[50] */;

  // pause game
  PauseGame();

  // stop time for this frame
  InterruptTime();

  // Setup the tactical existance of RPCs and CIVs in the last sector before moving on to a new sector.
  //@@@Evaluate
  if (gfWorldLoaded) {
    for (i = gTacticalStatus.Team[CIV_TEAM].bFirstID; i <= gTacticalStatus.Team[CIV_TEAM].bLastID; i++) {
      if (MercPtrs[i].value.bActive && MercPtrs[i].value.bInSector) {
        SetupProfileInsertionDataForSoldier(MercPtrs[i]);
      }
    }
  }

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Handle NPC stuff related to changing sectors
    HandleQuestCodeOnSectorEntry(sSectorX, sSectorY, bSectorZ);
  }

  // Begin Load
  BeginLoadScreen();

  // This has tobe done before loadworld, as it will remmove old gridnos if present
  RemoveMercsInSector();

  if (AreInMeanwhile() == false) {
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ALREADY_VISITED);
  }

  GetMapFileName(sSectorX, sSectorY, bSectorZ, bFilename, true, true);

  // Load the placeholder map if the real map doesn't exist.
  if (!MapExists(bFilename)) {
    if (!MapExists("Placeholder1.dat"))
      AssertMsg(0, "Failed to find Placeholder1.dat (placeholder map).");
  }

  CreateLoadingScreenProgressBar();

  // CreateProgressBar( 0, 160, 380, 480, 400 );
  //#ifdef JA2TESTVERSION
  //	//add more detailed progress bar
  //	DefineProgressBarPanel( 0, 65, 79, 94, 130, 350, 510, 430 );
  //	swprintf( str, L"Loading map:  %S", bFilename );
  //	SetProgressBarTitle( 0, str, FONT12POINT1, FONT_BLACK, FONT_BLACK );
  //#endif
  if (!LoadWorld(bFilename)) {
    return false;
  }

  // underground?
  if (bSectorZ) {
    pNode = FindUnderGroundSector(sSectorX, sSectorY, bSectorZ);

    // is there a sector?..if so set flag
    if (pNode) {
      pNode.value.fVisited = true;
    }
  }

  // if we arent loading a saved game
  // ATE: Moved this form above, so that we can have the benefit of
  // changing the world BEFORE adding guys to it...
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Load the current sectors Information From the temporary files
    if (!LoadCurrentSectorsInformationFromTempItemsFile()) {
      // The integrity of the temp files have been compromised.  Boot out of the game after warning message.
      InitExitGameDialogBecauseFileHackDetected();
      return true;
    }
  }

  RemoveLoadingScreenProgressBar();
  // RemoveProgressBar( 0 );

  if (gfEnterTacticalPlacementGUI) {
    SetPendingNewScreen(Enum26.GAME_SCREEN);
    InitTacticalPlacementGUI();
  } else {
    PrepareLoadedSector();
  }

  //	UnPauseGame( );

  // This function will either hide or display the tree tops, depending on the game setting
  SetTreeTopStateForMap();

  return true; // because the map was loaded.
}

export function UpdateMercsInSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fPOWSquadSet: boolean = false;
  let ubPOWSquad: UINT8 = 0;

  // Remove from interface slot
  RemoveAllPlayersFromSlot();

  // Remove tactical interface stuff
  guiPendingOverrideEvent = Enum207.I_CHANGE_TO_IDLE;

  // If we are in this function during the loading of a sector
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // DONT set these values
    gusSelectedSoldier = NO_SOLDIER;
    gfGameScreenLocateToSoldier = true;
  }

  // Set all faces intactive
  SetAllAutoFacesInactive();

  if (fUsingEdgePointsForStrategicEntry) {
    BeginMapEdgepointSearch();
  }

  // if( !(gTacticalStatus.uiFlags & LOADING_SAVED_GAME ) )
  {
    for (cnt = 0, pSoldier = MercPtrs[cnt]; cnt < MAX_NUM_SOLDIERS; cnt++, pSoldier++) {
      if (gfRestoringEnemySoldiersFromTempFile && cnt >= gTacticalStatus.Team[ENEMY_TEAM].bFirstID && cnt <= gTacticalStatus.Team[CREATURE_TEAM].bLastID) {
        // Don't update enemies/creatures (consec. teams) if they were
        // just restored via the temp map files...
        continue;
      }
      // Remove old merc, if exists
      RemoveMercSlot(pSoldier);

      pSoldier.value.bInSector = false;

      if (pSoldier.value.bActive) {
        if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
          if (gMapInformation.sCenterGridNo != -1 && gfBlitBattleSectorLocator && (gubEnemyEncounterCode == Enum164.ENEMY_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE) && pSoldier.value.bTeam != CIV_TEAM) {
            pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
            pSoldier.value.usStrategicInsertionData = gMapInformation.sCenterGridNo;
          } else if (gfOverrideInsertionWithExitGrid) {
            pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
            pSoldier.value.usStrategicInsertionData = gExitGrid.usGridNo;
          }
        }

        if (pSoldier.value.sSectorX == sSectorX && pSoldier.value.sSectorY == sSectorY && pSoldier.value.bSectorZ == bSectorZ && !pSoldier.value.fBetweenSectors) {
          gbMercIsNewInThisSector[pSoldier.value.ubID] = 1;

          UpdateMercInSector(pSoldier, sSectorX, sSectorY, bSectorZ);

          if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
            if (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
              if (!fPOWSquadSet) {
                fPOWSquadSet = true;

                // ATE: If we are in i13 - pop up message!
                if (sSectorY == MAP_ROW_I && sSectorX == 13) {
                  DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.POW_MERCS_ARE_HERE], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
                } else {
                  AddCharacterToUniqueSquad(pSoldier);
                  ubPOWSquad = pSoldier.value.bAssignment;
                  pSoldier.value.bNeutral = false;
                }
              } else {
                if (sSectorY != MAP_ROW_I && sSectorX != 13) {
                  AddCharacterToSquad(pSoldier, ubPOWSquad);
                }
              }

              // ATE: Call actions based on what POW we are on...
              if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTINPROGRESS) {
                // Complete quest
                EndQuest(Enum169.QUEST_HELD_IN_ALMA, sSectorX, sSectorY);

                // Do action
                HandleNPCDoAction(0, Enum213.NPC_ACTION_GRANT_EXPERIENCE_3, 0);
              }
            }
          }
        } else {
          pSoldier.value.bInSector = false;
        }
      }
    }
  }

  if (fUsingEdgePointsForStrategicEntry) {
    EndMapEdgepointSearch();

    // Set to false
    fUsingEdgePointsForStrategicEntry = false;
  }
}

export function UpdateMercInSector(pSoldier: Pointer<SOLDIERTYPE>, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let fError: boolean = false;
  if (pSoldier.value.uiStatusFlags & SOLDIER_IS_TACTICALLY_VALID) {
    pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
  }
  // OK, determine entrence direction and get sweetspot
  // Only if we are an OK guy to control....
  // SOME CHECKS HERE MUST BE FLESHED OUT......
  if (pSoldier.value.bActive) // This was in the if, removed by DEF:  pSoldier->bLife >= OKLIFE &&
  {
    // If we are not in transit...
    if (pSoldier.value.bAssignment != Enum117.IN_TRANSIT) {
      // CHECK UBINSERTION CODE..
      if (pSoldier.value.ubStrategicInsertionCode == Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX || pSoldier.value.ubStrategicInsertionCode == Enum175.INSERTION_CODE_SECONDARY_EDGEINDEX) {
        if (!fUsingEdgePointsForStrategicEntry) {
          // If we are not supposed to use this now, pick something better...
          pSoldier.value.ubStrategicInsertionCode = pSoldier.value.usStrategicInsertionData;
        }
      }

    MAPEDGEPOINT_SEARCH_FAILED:

      if (pSoldier.value.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE) {
        // override orders
        pSoldier.value.bOrders = Enum241.STATIONARY;
      }

      // Use insertion direction from loaded map!
      switch (pSoldier.value.ubStrategicInsertionCode) {
        case Enum175.INSERTION_CODE_NORTH:
          pSoldier.value.sInsertionGridNo = gMapInformation.sNorthGridNo;
          if (!gfEditMode && gMapInformation.sNorthGridNo == -1)
            fError = true;
          break;
        case Enum175.INSERTION_CODE_SOUTH:
          pSoldier.value.sInsertionGridNo = gMapInformation.sSouthGridNo;
          if (!gfEditMode && gMapInformation.sSouthGridNo == -1)
            fError = true;
          break;
        case Enum175.INSERTION_CODE_EAST:
          pSoldier.value.sInsertionGridNo = gMapInformation.sEastGridNo;
          if (!gfEditMode && gMapInformation.sEastGridNo == -1)
            fError = true;
          break;
        case Enum175.INSERTION_CODE_WEST:
          pSoldier.value.sInsertionGridNo = gMapInformation.sWestGridNo;
          if (!gfEditMode && gMapInformation.sWestGridNo == -1)
            fError = true;
          break;
        case Enum175.INSERTION_CODE_CENTER:
          pSoldier.value.sInsertionGridNo = gMapInformation.sCenterGridNo;
          if (!gfEditMode && gMapInformation.sCenterGridNo == -1)
            fError = true;
          break;
        case Enum175.INSERTION_CODE_GRIDNO:
          pSoldier.value.sInsertionGridNo = pSoldier.value.usStrategicInsertionData;
          break;

        case Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX:
          pSoldier.value.sInsertionGridNo = SearchForClosestPrimaryMapEdgepoint(pSoldier.value.sPendingActionData2, pSoldier.value.usStrategicInsertionData);
          if (pSoldier.value.sInsertionGridNo == NOWHERE) {
            ScreenMsg(FONT_RED, MSG_ERROR, "Main edgepoint search failed for %s -- substituting entrypoint.", pSoldier.value.name);
            pSoldier.value.ubStrategicInsertionCode = pSoldier.value.usStrategicInsertionData;
            goto("MAPEDGEPOINT_SEARCH_FAILED");
          }
          break;
        case Enum175.INSERTION_CODE_SECONDARY_EDGEINDEX:
          pSoldier.value.sInsertionGridNo = SearchForClosestSecondaryMapEdgepoint(pSoldier.value.sPendingActionData2, pSoldier.value.usStrategicInsertionData);
          if (pSoldier.value.sInsertionGridNo == NOWHERE) {
            ScreenMsg(FONT_RED, MSG_ERROR, "Isolated edgepont search failed for %s -- substituting entrypoint.", pSoldier.value.name);
            pSoldier.value.ubStrategicInsertionCode = pSoldier.value.usStrategicInsertionData;
            goto("MAPEDGEPOINT_SEARCH_FAILED");
          }
          break;

        case Enum175.INSERTION_CODE_ARRIVING_GAME:
          // Are we in Omerta!
          if (sSectorX == gWorldSectorX && gWorldSectorX == 9 && sSectorY == gWorldSectorY && gWorldSectorY == 1 && bSectorZ == gbWorldSectorZ && gbWorldSectorZ == 0) {
            // Try another location and walk into map
            pSoldier.value.sInsertionGridNo = 4379;
          } else {
            pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
            pSoldier.value.sInsertionGridNo = gMapInformation.sNorthGridNo;
          }
          break;
        case Enum175.INSERTION_CODE_CHOPPER:
          // Try another location and walk into map
          // Add merc to chopper....
          // pSoldier->sInsertionGridNo = 4058;
          AddMercToHeli(pSoldier.value.ubID);
          return;
          break;
        default:
          pSoldier.value.sInsertionGridNo = 12880;
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Improper insertion code %d given to UpdateMercsInSector", pSoldier.value.ubStrategicInsertionCode));
          break;
      }

      if (fError) {
        // strategic insertion failed because it expected to find an entry point.  This is likely
        // a missing part of the map or possible fault in strategic movement costs, traversal logic, etc.
        let szEntry: string /* UINT16[10] */;
        let szSector: string /* UINT16[10] */;
        let sGridNo: INT16;
        GetLoadedSectorString(szSector);
        if (gMapInformation.sNorthGridNo != -1) {
          szEntry = "north";
          sGridNo = gMapInformation.sNorthGridNo;
        } else if (gMapInformation.sEastGridNo != -1) {
          szEntry = "east";
          sGridNo = gMapInformation.sEastGridNo;
        } else if (gMapInformation.sSouthGridNo != -1) {
          szEntry = "south";
          sGridNo = gMapInformation.sSouthGridNo;
        } else if (gMapInformation.sWestGridNo != -1) {
          szEntry = "west";
          sGridNo = gMapInformation.sWestGridNo;
        } else if (gMapInformation.sCenterGridNo != -1) {
          szEntry = "center";
          sGridNo = gMapInformation.sCenterGridNo;
        } else {
          ScreenMsg(FONT_RED, MSG_BETAVERSION, "Sector %s has NO entrypoints -- using precise center of map for %s.", szSector, pSoldier.value.name);
          pSoldier.value.sInsertionGridNo = 12880;
          AddSoldierToSector(pSoldier.value.ubID);
          return;
        }
        pSoldier.value.sInsertionGridNo = sGridNo;
        switch (pSoldier.value.ubStrategicInsertionCode) {
          case Enum175.INSERTION_CODE_NORTH:
            ScreenMsg(FONT_RED, MSG_BETAVERSION, "Sector %s doesn't have a north entrypoint -- substituting  %s entrypoint for %s.", szSector, szEntry, pSoldier.value.name);
            break;
          case Enum175.INSERTION_CODE_EAST:
            ScreenMsg(FONT_RED, MSG_BETAVERSION, "Sector %s doesn't have a east entrypoint -- substituting  %s entrypoint for %s.", szSector, szEntry, pSoldier.value.name);
            break;
          case Enum175.INSERTION_CODE_SOUTH:
            ScreenMsg(FONT_RED, MSG_BETAVERSION, "Sector %s doesn't have a south entrypoint -- substituting  %s entrypoint for %s.", szSector, szEntry, pSoldier.value.name);
            break;
          case Enum175.INSERTION_CODE_WEST:
            ScreenMsg(FONT_RED, MSG_BETAVERSION, "Sector %s doesn't have a west entrypoint -- substituting  %s entrypoint for %s.", szSector, szEntry, pSoldier.value.name);
            break;
          case Enum175.INSERTION_CODE_CENTER:
            ScreenMsg(FONT_RED, MSG_BETAVERSION, "Sector %s doesn't have a center entrypoint -- substituting  %s entrypoint for %s.", szSector, szEntry, pSoldier.value.name);
            break;
        }
      }
      // If no insertion direction exists, this is bad!
      if (pSoldier.value.sInsertionGridNo == -1) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Insertion gridno for direction %d not added to map sector %d %d", pSoldier.value.ubStrategicInsertionCode, sSectorX, sSectorY));
        pSoldier.value.sInsertionGridNo = 12880;
      }

      AddSoldierToSector(pSoldier.value.ubID);
    }
  }
}

function InitializeStrategicMapSectorTownNames(): void {
  StrategicMap[2 + 2 * MAP_WORLD_X].bNameId = StrategicMap[2 + 1 * MAP_WORLD_X].bNameId = Enum135.CHITZENA;
  StrategicMap[5 + 3 * MAP_WORLD_X].bNameId = StrategicMap[6 + 3 * MAP_WORLD_X].bNameId = StrategicMap[5 + 4 * MAP_WORLD_X].bNameId = StrategicMap[4 + 4 * MAP_WORLD_X].bNameId = Enum135.SAN_MONA;
  StrategicMap[9 + 1 * MAP_WORLD_X].bNameId = StrategicMap[10 + 1 * MAP_WORLD_X].bNameId = Enum135.OMERTA;
  StrategicMap[13 + 2 * MAP_WORLD_X].bNameId = StrategicMap[13 + 3 * MAP_WORLD_X].bNameId = StrategicMap[13 + 4 * MAP_WORLD_X].bNameId = Enum135.DRASSEN;
  StrategicMap[1 + 7 * MAP_WORLD_X].bNameId = StrategicMap[1 + 8 * MAP_WORLD_X].bNameId = StrategicMap[2 + 7 * MAP_WORLD_X].bNameId = StrategicMap[2 + 8 * MAP_WORLD_X].bNameId = StrategicMap[3 + 8 * MAP_WORLD_X].bNameId = Enum135.GRUMM;
  StrategicMap[6 + 9 * MAP_WORLD_X].bNameId = Enum135.ESTONI;
  StrategicMap[9 + 10 * MAP_WORLD_X].bNameId = Enum135.TIXA;
  StrategicMap[8 + 6 * MAP_WORLD_X].bNameId = StrategicMap[9 + 6 * MAP_WORLD_X].bNameId = StrategicMap[8 + 7 * MAP_WORLD_X].bNameId = StrategicMap[9 + 7 * MAP_WORLD_X].bNameId = StrategicMap[8 + 8 * MAP_WORLD_X].bNameId = Enum135.CAMBRIA;
  StrategicMap[13 + 9 * MAP_WORLD_X].bNameId = StrategicMap[14 + 9 * MAP_WORLD_X].bNameId = StrategicMap[13 + 8 * MAP_WORLD_X].bNameId = StrategicMap[14 + 8 * MAP_WORLD_X].bNameId = Enum135.ALMA;
  StrategicMap[4 + 11 * MAP_WORLD_X].bNameId = Enum135.ORTA;
  StrategicMap[11 + 12 * MAP_WORLD_X].bNameId = StrategicMap[12 + 12 * MAP_WORLD_X].bNameId = Enum135.BALIME;
  StrategicMap[3 + 14 * MAP_WORLD_X].bNameId = StrategicMap[4 + 14 * MAP_WORLD_X].bNameId = StrategicMap[5 + 14 * MAP_WORLD_X].bNameId = StrategicMap[3 + 15 * MAP_WORLD_X].bNameId = StrategicMap[4 + 15 * MAP_WORLD_X].bNameId = StrategicMap[3 + 16 * MAP_WORLD_X].bNameId = Enum135.MEDUNA;
  // StrategicMap[3+16*MAP_WORLD_X].bNameId=PALACE;
  return;
}

// Get sector ID string makes a string like 'A9 - OMERTA', or just J11 if no town....
export function GetSectorIDString(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, fDetailed: boolean): string {
  let zString: string = <string><unknown>undefined;

  let pSector: SECTORINFO;
  let pUnderground: UNDERGROUND_SECTORINFO | null;
  let bTownNameID: INT8;
  let bMineIndex: INT8;
  let ubSectorID: UINT8 = 0;
  let ubLandType: UINT8 = 0;

  if (sSectorX <= 0 || sSectorY <= 0 || bSectorZ < 0) {
    // swprintf( zString, L"%s", pErrorStrings[0] );
  } else if (bSectorZ != 0) {
    pUnderground = FindUnderGroundSector(sSectorX, sSectorY, bSectorZ);
    if (pUnderground && (pUnderground.fVisited || gfGettingNameFromSaveLoadScreen)) {
      bMineIndex = GetIdOfMineForSector(sSectorX, sSectorY, bSectorZ);
      if (bMineIndex != -1) {
        zString = swprintf("%c%d: %s %s", String.fromCharCode('A'.charCodeAt(0) + sSectorY - 1), sSectorX, pTownNames[GetTownAssociatedWithMine(bMineIndex)], pwMineStrings[0]);
      } else
        switch (SECTOR(sSectorX, sSectorY)) {
          case Enum123.SEC_A10:
            zString = swprintf("A10: %s", pLandTypeStrings[Enum127.REBEL_HIDEOUT]);
            break;
          case Enum123.SEC_J9:
            zString = swprintf("J9: %s", pLandTypeStrings[Enum127.TIXA_DUNGEON]);
            break;
          case Enum123.SEC_K4:
            zString = swprintf("K4: %s", pLandTypeStrings[Enum127.ORTA_BASEMENT]);
            break;
          case Enum123.SEC_O3:
            zString = swprintf("O3: %s", pLandTypeStrings[Enum127.TUNNEL]);
            break;
          case Enum123.SEC_P3:
            zString = swprintf("P3: %s", pLandTypeStrings[Enum127.SHELTER]);
            break;
          default:
            zString = swprintf("%c%d: %s", String.fromCharCode('A'.charCodeAt(0) + sSectorY - 1), sSectorX, pLandTypeStrings[Enum127.CREATURE_LAIR]);
            break;
        }
    } else {
      // Display nothing
      zString = "";
    }
  } else {
    bTownNameID = StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].bNameId;
    ubSectorID = SECTOR(sSectorX, sSectorY);
    pSector = SectorInfo[ubSectorID];
    ubLandType = pSector.ubTraversability[4];
    zString = swprintf("%c%d: ", String.fromCharCode('A'.charCodeAt(0) + sSectorY - 1), sSectorX);

    if (bTownNameID == Enum135.BLANK_SECTOR) {
      // OK, build string id like J11
      // are we dealing with the unfound towns?
      switch (ubSectorID) {
        case Enum123.SEC_D2: // Chitzena SAM
          if (!fSamSiteFound[Enum138.SAM_SITE_ONE])
            zString += pLandTypeStrings[Enum127.TROPICS];
          else if (fDetailed)
            zString += pLandTypeStrings[Enum127.TROPICS_SAM_SITE];
          else
            zString += pLandTypeStrings[Enum127.SAM_SITE];
          break;
        case Enum123.SEC_D15: // Drassen SAM
          if (!fSamSiteFound[Enum138.SAM_SITE_TWO])
            zString += pLandTypeStrings[Enum127.SPARSE];
          else if (fDetailed)
            zString += pLandTypeStrings[Enum127.SPARSE_SAM_SITE];
          else
            zString += pLandTypeStrings[Enum127.SAM_SITE];
          break;
        case Enum123.SEC_I8: // Cambria SAM
          if (!fSamSiteFound[Enum138.SAM_SITE_THREE])
            zString += pLandTypeStrings[Enum127.SAND];
          else if (fDetailed)
            zString += pLandTypeStrings[Enum127.SAND_SAM_SITE];
          else
            zString += pLandTypeStrings[Enum127.SAM_SITE];
          break;
        default:
          zString += pLandTypeStrings[ubLandType];
          break;
      }
    } else {
      switch (ubSectorID) {
        case Enum123.SEC_B13:
          if (fDetailed)
            zString += pLandTypeStrings[Enum127.DRASSEN_AIRPORT_SITE];
          else
            zString += pTownNames[Enum135.DRASSEN];
          break;
        case Enum123.SEC_F8:
          if (fDetailed)
            zString += pLandTypeStrings[Enum127.CAMBRIA_HOSPITAL_SITE];
          else
            zString += pTownNames[Enum135.CAMBRIA];
          break;
        case Enum123.SEC_J9: // Tixa
          if (!fFoundTixa)
            zString += pLandTypeStrings[Enum127.SAND];
          else
            zString += pTownNames[Enum135.TIXA];
          break;
        case Enum123.SEC_K4: // Orta
          if (!fFoundOrta)
            zString += pLandTypeStrings[Enum127.SWAMP];
          else
            zString += pTownNames[Enum135.ORTA];
          break;
        case Enum123.SEC_N3:
          if (fDetailed)
            zString += pLandTypeStrings[Enum127.MEDUNA_AIRPORT_SITE];
          else
            zString += pTownNames[Enum135.MEDUNA];
          break;
        default:
          if (ubSectorID == Enum123.SEC_N4 && fSamSiteFound[Enum138.SAM_SITE_FOUR]) {
            // Meduna's SAM site
            if (fDetailed)
              zString += pLandTypeStrings[Enum127.MEDUNA_SAM_SITE];
            else
              zString += pLandTypeStrings[Enum127.SAM_SITE];
          } else {
            // All other towns that are known since beginning of the game.
            zString += pTownNames[bTownNameID];
            if (fDetailed) {
              switch (ubSectorID) {
                // Append the word, "mine" for town sectors containing a mine.
                case Enum123.SEC_B2:
                case Enum123.SEC_D4:
                case Enum123.SEC_D13:
                case Enum123.SEC_H3:
                case Enum123.SEC_H8:
                case Enum123.SEC_I14:
                  zString += " "; // space
                  zString += pwMineStrings[0]; // then "Mine"
                  break;
              }
            }
          }
          break;
      }
    }
  }

  return zString;
}

function SetInsertionDataFromAdjacentMoveDirection(pSoldier: Pointer<SOLDIERTYPE>, ubTacticalDirection: UINT8, sAdditionalData: INT16): UINT8 {
  let ubDirection: UINT8;
  let ExitGrid: EXITGRID = createExitGrid();

  // Set insertion code
  switch (ubTacticalDirection) {
      // OK, we are using an exit grid - set insertion values...

    case 255:
      if (!GetExitGrid(sAdditionalData, addressof(ExitGrid))) {
        AssertMsg(0, FormatString("No valid Exit grid can be found when one was expected: SetInsertionDataFromAdjacentMoveDirection."));
      }
      ubDirection = 255;
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      pSoldier.value.usStrategicInsertionData = ExitGrid.usGridNo;
      pSoldier.value.bUseExitGridForReentryDirection = true;
      break;

    case Enum245.NORTH:
      ubDirection = Enum186.NORTH_STRATEGIC_MOVE;
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum245.SOUTH:
      ubDirection = Enum186.SOUTH_STRATEGIC_MOVE;
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
      break;
    case Enum245.EAST:
      ubDirection = Enum186.EAST_STRATEGIC_MOVE;
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
      break;
    case Enum245.WEST:
      ubDirection = Enum186.WEST_STRATEGIC_MOVE;
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_EAST;
      break;
    default:
// Wrong direction given!
      ubDirection = Enum186.EAST_STRATEGIC_MOVE;
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
  }

  return ubDirection;
}

function GetInsertionDataFromAdjacentMoveDirection(ubTacticalDirection: UINT8, sAdditionalData: INT16): UINT8 {
  let ubDirection: UINT8;

  // Set insertion code
  switch (ubTacticalDirection) {
      // OK, we are using an exit grid - set insertion values...

    case 255:

      ubDirection = 255;
      break;

    case Enum245.NORTH:
      ubDirection = Enum186.NORTH_STRATEGIC_MOVE;
      break;
    case Enum245.SOUTH:
      ubDirection = Enum186.SOUTH_STRATEGIC_MOVE;
      break;
    case Enum245.EAST:
      ubDirection = Enum186.EAST_STRATEGIC_MOVE;
      break;
    case Enum245.WEST:
      ubDirection = Enum186.WEST_STRATEGIC_MOVE;
      break;
    default:
// Wrong direction given!
      ubDirection = Enum186.EAST_STRATEGIC_MOVE;
  }

  return ubDirection;
}

function GetStrategicInsertionDataFromAdjacentMoveDirection(ubTacticalDirection: UINT8, sAdditionalData: INT16): UINT8 {
  let ubDirection: UINT8;

  // Set insertion code
  switch (ubTacticalDirection) {
      // OK, we are using an exit grid - set insertion values...

    case 255:

      ubDirection = 255;
      break;

    case Enum245.NORTH:
      ubDirection = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum245.SOUTH:
      ubDirection = Enum175.INSERTION_CODE_NORTH;
      break;
    case Enum245.EAST:
      ubDirection = Enum175.INSERTION_CODE_WEST;
      break;
    case Enum245.WEST:
      ubDirection = Enum175.INSERTION_CODE_EAST;
      break;
    default:
// Wrong direction given!
      ubDirection = Enum186.EAST_STRATEGIC_MOVE;
  }

  return ubDirection;
}

export function JumpIntoAdjacentSector(ubTacticalDirection: UINT8, ubJumpCode: UINT8, sAdditionalData: INT16): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pValidSoldier: Pointer<SOLDIERTYPE> = null;
  let pGroup: Pointer<GROUP>;
  let uiTraverseTime: UINT32 = 0;
  let ubDirection: UINT8;
  let ExitGrid: EXITGRID = createExitGrid();
  let bPrevAssignment: INT8;
  let ubPrevGroupID: UINT8;

  // Set initial selected
  // ATE: moved this towards top...
  gubPreferredInitialSelectedGuy = gusSelectedSoldier;

  if (ubJumpCode == Enum177.JUMP_ALL_LOAD_NEW || ubJumpCode == Enum177.JUMP_ALL_NO_LOAD) {
    // TODO: Check flags to see if we can jump!
    // Move controllable mercs!
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // look for all mercs on the same team,
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
      // If we are controllable
      if (OK_CONTROLLABLE_MERC(pSoldier) && pSoldier.value.bAssignment == CurrentSquad()) {
        pValidSoldier = pSoldier;
        // This now gets handled by strategic movement.  It is possible that the
        // group won't move instantaneously.
        // pSoldier->sSectorX = sNewX;
        // pSoldier->sSectorY = sNewY;

        ubDirection = GetInsertionDataFromAdjacentMoveDirection(ubTacticalDirection, sAdditionalData);
        break;
      }
    }
  } else if ((ubJumpCode == Enum177.JUMP_SINGLE_LOAD_NEW || ubJumpCode == Enum177.JUMP_SINGLE_NO_LOAD)) {
    // Use selected soldier...
    // This guy should always be 1 ) selected and 2 ) close enough to exit sector to leave
    if (gusSelectedSoldier != NOBODY) {
      pValidSoldier = MercPtrs[gusSelectedSoldier];
      ubDirection = GetInsertionDataFromAdjacentMoveDirection(ubTacticalDirection, sAdditionalData);
    }

    // save info for desired squad and and time for all single mercs leaving their squad.
    bPrevAssignment = pValidSoldier.value.bAssignment;
    ubPrevGroupID = pValidSoldier.value.ubGroupID;

    if (ubJumpCode == Enum177.JUMP_SINGLE_NO_LOAD) {
      // handle soldier moving by themselves
      HandleSoldierLeavingSectorByThemSelf(pValidSoldier);
    } else {
      // now add char to a squad all their own
      AddCharacterToUniqueSquad(pValidSoldier);
    }
    if (!pValidSoldier.value.ubNumTraversalsAllowedToMerge && bPrevAssignment < Enum117.ON_DUTY) {
      let pPlayer: Pointer<PLAYERGROUP>;
      pValidSoldier.value.ubDesiredSquadAssignment = bPrevAssignment;
      pValidSoldier.value.ubNumTraversalsAllowedToMerge = 2;
      pGroup = GetGroup(ubPrevGroupID);
      Assert(pGroup);
      Assert(pGroup.value.fPlayer);
      // Assert( pGroup->ubGroupSize );
      pPlayer = pGroup.value.pPlayerList;
      while (pPlayer) {
        if (pPlayer.value.pSoldier != pValidSoldier) {
          pPlayer.value.pSoldier.value.ubNumTraversalsAllowedToMerge = 100;
          pPlayer.value.pSoldier.value.ubDesiredSquadAssignment = NO_ASSIGNMENT;
        }
        pPlayer = pPlayer.value.next;
      }
    }
  } else {
    // OK, no jump code here given...
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Improper jump code %d given to JumpIntoAdjacentSector", ubJumpCode));
  }

  Assert(pValidSoldier);

  // Now, determine the traversal time.
  pGroup = GetGroup(pValidSoldier.value.ubGroupID);
  AssertMsg(pGroup, FormatString("%S is not in a valid group (pSoldier->ubGroupID is %d)", pValidSoldier.value.name, pValidSoldier.value.ubGroupID));

  // If we are going through an exit grid, don't get traversal direction!
  if (ubTacticalDirection != 255) {
    if (!gbWorldSectorZ) {
      uiTraverseTime = GetSectorMvtTimeForGroup(SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY), ubDirection, pGroup);
    } else if (gbWorldSectorZ > 0) {
      // We are attempting to traverse in an underground environment.  We need to use a complete different
      // method.  When underground, all sectors are instantly adjacent.
      uiTraverseTime = UndergroundTacticalTraversalTime(ubDirection);
    }
    if (uiTraverseTime == 0xffffffff)
      AssertMsg(0, "Attempting to tactically traverse to adjacent sector, despite being unable to do so.");
  }

  // Alrighty, we want to do whatever our omnipotent player asked us to do
  // this is what the ubJumpCode is for.
  // Regardless of that we were asked to do, we MUST walk OFF ( Ian loves this... )
  // So..... let's setup our people to walk off...
  // We deal with a pGroup here... if an all move or a group...

  // Setup some globals so our callback that deals when guys go off screen is handled....
  // Look in the handler function AllMercsHaveWalkedOffSector() below...
  gpAdjacentGroup = pGroup;
  gubAdjacentJumpCode = ubJumpCode;
  guiAdjacentTraverseTime = uiTraverseTime;
  gubTacticalDirection = ubTacticalDirection;
  gsAdditionalData = sAdditionalData;

  // If normal direction, use it!
  if (ubTacticalDirection != 255) {
    gsAdjacentSectorX = (gWorldSectorX + DirXIncrementer[ubTacticalDirection]);
    gsAdjacentSectorY = (gWorldSectorY + DirYIncrementer[ubTacticalDirection]);
    gbAdjacentSectorZ = pValidSoldier.value.bSectorZ;
  } else {
    // Take directions from exit grid info!
    if (!GetExitGrid(sAdditionalData, addressof(ExitGrid))) {
      AssertMsg(0, FormatString("Told to use exit grid at %d but one does not exist", sAdditionalData));
    }

    gsAdjacentSectorX = ExitGrid.ubGotoSectorX;
    gsAdjacentSectorY = ExitGrid.ubGotoSectorY;
    gbAdjacentSectorZ = ExitGrid.ubGotoSectorZ;
    gusDestExitGridNo = ExitGrid.usGridNo;
  }

  // Give guy(s) orders to walk off sector...
  if (pGroup.value.fPlayer) {
    // For player groups, update the soldier information
    let curr: Pointer<PLAYERGROUP>;
    let sGridNo: INT16;
    let ubNum: UINT8 = 0;

    curr = pGroup.value.pPlayerList;
    while (curr) {
      if (OK_CONTROLLABLE_MERC(curr.value.pSoldier)) {
        if (ubTacticalDirection != 255) {
          sGridNo = PickGridNoNearestEdge(curr.value.pSoldier, ubTacticalDirection);

          curr.value.pSoldier.value.sPreTraversalGridNo = curr.value.pSoldier.value.sGridNo;

          if (sGridNo != NOWHERE) {
            // Save wait code - this will make buddy walk off screen into oblivion
            curr.value.pSoldier.value.ubWaitActionToDo = 2;
            // This will set the direction so we know now to move into oblivion
            curr.value.pSoldier.value.uiPendingActionData1 = ubTacticalDirection;
          } else {
            AssertMsg(0, FormatString("Failed to get good exit location for adjacentmove"));
          }

          EVENT_GetNewSoldierPath(curr.value.pSoldier, sGridNo, Enum193.WALKING);
        } else {
          // Here, get closest location for exit grid....
          sGridNo = FindGridNoFromSweetSpotCloseToExitGrid(curr.value.pSoldier, sAdditionalData, 10, addressof(ubDirection));

          // curr->pSoldier->
          if (sGridNo != NOWHERE) {
            // Save wait code - this will make buddy walk off screen into oblivion
            //	curr->pSoldier->ubWaitActionToDo = 2;
          } else {
            AssertMsg(0, FormatString("Failed to get good exit location for adjacentmove"));
          }

          // Don't worry about walk off screen, just stay at gridno...
          curr.value.pSoldier.value.ubWaitActionToDo = 1;

          // Set buddy go!
          gfPlotPathToExitGrid = true;
          EVENT_GetNewSoldierPath(curr.value.pSoldier, sGridNo, Enum193.WALKING);
          gfPlotPathToExitGrid = false;
        }
        ubNum++;
      } else {
        // We will remove them later....
      }
      curr = curr.value.next;
    }

    // ATE: Do another round, removing guys from group that can't go on...
  BEGINNING_LOOP:

    curr = pGroup.value.pPlayerList;
    while (curr) {
      if (!OK_CONTROLLABLE_MERC(curr.value.pSoldier)) {
        RemoveCharacterFromSquads(curr.value.pSoldier);
        goto("BEGINNING_LOOP");
      }
      curr = curr.value.next;
    }

    // OK, setup TacticalOverhead polling system that will notify us once everybody
    // has made it to our destination.
    if (ubTacticalDirection != 255) {
      SetActionToDoOnceMercsGetToLocation(Enum238.WAIT_FOR_MERCS_TO_WALKOFF_SCREEN, ubNum, ubJumpCode, 0, 0);
    } else {
      // Add new wait action here...
      SetActionToDoOnceMercsGetToLocation(Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO, ubNum, ubJumpCode, 0, 0);
    }

    // Lock UI!
    guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;
    HandleTacticalUI();
  }
}

export function HandleSoldierLeavingSectorByThemSelf(pSoldier: Pointer<SOLDIERTYPE>): void {
  // soldier leaving thier squad behind, will rejoin later
  // if soldier in a squad, set the fact they want to return here
  let ubGroupId: UINT8;

  if (pSoldier.value.bAssignment < Enum117.ON_DUTY) {
    RemoveCharacterFromSquads(pSoldier);

    // are they in a group?..remove from group
    if (pSoldier.value.ubGroupID != 0) {
      // remove from group
      RemovePlayerFromGroup(pSoldier.value.ubGroupID, pSoldier);
      pSoldier.value.ubGroupID = 0;
    }
  } else {
    // otherwise, they are on thier own, not in a squad, simply remove mvt group
    if (pSoldier.value.ubGroupID && pSoldier.value.bAssignment != Enum117.VEHICLE) {
      // Can only remove groups if they aren't persistant (not in a squad or vehicle)
      // delete group
      RemoveGroup(pSoldier.value.ubGroupID);
      pSoldier.value.ubGroupID = 0;
    }
  }

  // set to guard
  AddCharacterToUniqueSquad(pSoldier);

  if (pSoldier.value.ubGroupID == 0) {
    // create independant group
    ubGroupId = CreateNewPlayerGroupDepartingFromSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY);
    AddPlayerToGroup(ubGroupId, pSoldier);
  }

  return;
}

export function AllMercsWalkedToExitGrid(): void {
  let pPlayer: Pointer<PLAYERGROUP>;
  let fDone: boolean;

  HandlePotentialMoraleHitForSkimmingSectors(gpAdjacentGroup);

  if (gubAdjacentJumpCode == Enum177.JUMP_ALL_NO_LOAD || gubAdjacentJumpCode == Enum177.JUMP_SINGLE_NO_LOAD) {
    Assert(gpAdjacentGroup);
    pPlayer = gpAdjacentGroup.value.pPlayerList;
    pPlayer = gpAdjacentGroup.value.pPlayerList;
    while (pPlayer) {
      SetInsertionDataFromAdjacentMoveDirection(pPlayer.value.pSoldier, gubTacticalDirection, gsAdditionalData);

      RemoveSoldierFromTacticalSector(pPlayer.value.pSoldier, true);

      pPlayer = pPlayer.value.next;
    }

    SetGroupSectorValue(gsAdjacentSectorX, gsAdjacentSectorY, gbAdjacentSectorZ, gpAdjacentGroup.value.ubGroupID);
    AttemptToMergeSeparatedGroups(gpAdjacentGroup, false);

    SetDefaultSquadOnSectorEntry(true);
  } else {
    // Because we are actually loading the new map, and we are physically traversing, we don't want
    // to bring up the prebattle interface when we arrive if there are enemies there.  This flag
    // ignores the initialization of the prebattle interface and clears the flag.
    gfTacticalTraversal = true;
    gpTacticalTraversalGroup = gpAdjacentGroup;

    // Check for any unconcious and/or dead merc and remove them from the current squad, so that they
    // don't get moved to the new sector.
    fDone = false;
    while (!fDone) {
      fDone = false;
      pPlayer = gpAdjacentGroup.value.pPlayerList;
      while (pPlayer) {
        if (pPlayer.value.pSoldier.value.bLife < OKLIFE) {
          AddCharacterToUniqueSquad(pPlayer.value.pSoldier);
          break;
        }
        pPlayer = pPlayer.value.next;
      }
      if (!pPlayer) {
        fDone = true;
      }
    }

    // OK, Set insertion direction for all these guys....
    Assert(gpAdjacentGroup);
    pPlayer = gpAdjacentGroup.value.pPlayerList;
    while (pPlayer) {
      SetInsertionDataFromAdjacentMoveDirection(pPlayer.value.pSoldier, gubTacticalDirection, gsAdditionalData);

      pPlayer = pPlayer.value.next;
    }
    SetGroupSectorValue(gsAdjacentSectorX, gsAdjacentSectorY, gbAdjacentSectorZ, gpAdjacentGroup.value.ubGroupID);
    AttemptToMergeSeparatedGroups(gpAdjacentGroup, false);

    gFadeOutDoneCallback = DoneFadeOutExitGridSector;
    FadeOutGameScreen();
  }
  if (!PlayerMercsInSector(gsAdjacentSectorX, gsAdjacentSectorY, gbAdjacentSectorZ)) {
    HandleLoyaltyImplicationsOfMercRetreat(RETREAT_TACTICAL_TRAVERSAL, gsAdjacentSectorX, gsAdjacentSectorY, gbAdjacentSectorZ);
  }
  if (gubAdjacentJumpCode == Enum177.JUMP_ALL_NO_LOAD || gubAdjacentJumpCode == Enum177.JUMP_SINGLE_NO_LOAD) {
    gfTacticalTraversal = false;
    gpTacticalTraversalGroup = null;
    gpTacticalTraversalChosenSoldier = null;
  }
}

/* BACKUP VERSION -- Before KM rewrote it
         The flaw with this version is that traversing multiple squads to an adjacent sector doesn't properly setup
         tactical traversal information for the first squads to traverse, only the last.  The new version supports this
         feature.
void AllMercsHaveWalkedOffSector( )
{
        PLAYERGROUP *pPlayer;
        SOLDIERTYPE *pSoldier;

        HandleLoyaltyImplicationsOfMercRetreat( RETREAT_TACTICAL_TRAVERSAL, gWorldSectorX, gWorldSectorY, gbWorldSectorZ );

        // ATE: Added here: donot load another screen if we were told not to....
        if( ( gubAdjacentJumpCode == JUMP_ALL_NO_LOAD || gubAdjacentJumpCode == JUMP_SINGLE_NO_LOAD ) )
        {
                //Case 1:
                //Move the group the conventionally strategic method

                // clear their strategic movement (mercpaths and waypoints)
                ClearMercPathsAndWaypointsForAllInGroup( gpAdjacentGroup );

                AddWaypointToPGroup( gpAdjacentGroup, (UINT8)gsAdjacentSectorX, (UINT8)gsAdjacentSectorY );

                pPlayer = gpAdjacentGroup->pPlayerList;
                while( pPlayer )
                {
                        // NOTE: This line is different from case 2 and 3...
                        RemoveSoldierFromTacticalSector( pPlayer->pSoldier, TRUE );

                        // pass flag that this is a tactical traversal, the path built MUST go in the traversed direction even if longer!
                        PlotPathForCharacter( pPlayer->pSoldier, gsAdjacentSectorX, gsAdjacentSectorY, TRUE );
                        pPlayer = pPlayer->next;
                }

                SetDefaultSquadOnSectorEntry( TRUE );
        }
        else
        {
                // OK, Set insertion direction for all these guys....
                Assert( gpAdjacentGroup );
                pPlayer = gpAdjacentGroup->pPlayerList;
                while( pPlayer )
                {
                        SetInsertionDataFromAdjacentMoveDirection( pPlayer->pSoldier, gubTacticalDirection, gsAdditionalData );

                        pPlayer = pPlayer->next;
                }
                // OK, here we want to leave the screen
                // Two things can happen
                // 1 ) We are near a sector were there is a finite amount of time to traverse, so
                // we bring up mapscreen
                // 2 ) We can move right away so do it!
                if( guiAdjacentTraverseTime <= 5 )
                {
                        INT16 sScreenX, sScreenY, sNewGridNo;
                        UINT32	 sWorldX, sWorldY;

                        //Case 2:
                        //Because tactical travel time between town sectors is inconsequential, just warp the group and
                        //the time by 5 minutes.

                        // Loop through each guy and:
                        // Determine 'mirror' gridno to place him
                        // set that gridno in data
                        // change insertion code to use edgepoints....
                        pPlayer = gpAdjacentGroup->pPlayerList;
                        while( pPlayer )
                        {
                                pSoldier = pPlayer->pSoldier;

                                // Determine 'mirror' gridno...
                                // Convert to absolute xy
                                GetWorldXYAbsoluteScreenXY( (INT16)(pSoldier->sX / CELL_X_SIZE ), (INT16)(pSoldier->sY / CELL_Y_SIZE ), &sScreenX, &sScreenY );

                                // Get 'mirror', depending on what direction...
                                switch( gubTacticalDirection )
                                {
                                        case NORTH:			sScreenY = 1520;				break;
                                        case SOUTH:			sScreenY = 0;						break;
                                        case EAST:			sScreenX = 0;						break;
                                        case WEST:			sScreenX = 3160;				break;
                                }

                                // Convert into a gridno again.....
                                GetFromAbsoluteScreenXYWorldXY( &sWorldX, &sWorldY, sScreenX, sScreenY );
                                sNewGridNo = (INT16)GETWORLDINDEXFROMWORLDCOORDS( sWorldY, sWorldX );

                                // Save this gridNo....
                                pSoldier->sPendingActionData2				= sNewGridNo;
                                // Copy CODe computed earlier into data
                                pSoldier->usStrategicInsertionData  = pSoldier->ubStrategicInsertionCode;
                                // Now use NEW code....

                                pSoldier->ubStrategicInsertionCode = CalcMapEdgepointClassInsertionCode( pSoldier->sPreTraversalGridNo );

                                fUsingEdgePointsForStrategicEntry = TRUE;

                                pPlayer = pPlayer->next;
                        }

                        gfTacticalTraversal = TRUE;
                        gpTacticalTraversalGroup = gpAdjacentGroup;

                        if( gbAdjacentSectorZ > 0 )
                        {	//Nasty strategic movement logic doesn't like underground sectors!
                                gfUndergroundTacticalTraversal = TRUE;
                        }

                        // clear their strategic movement (mercpaths and waypoints)
                        ClearMercPathsAndWaypointsForAllInGroup( gpAdjacentGroup );

                        AddWaypointToPGroup( gpAdjacentGroup, (UINT8)gsAdjacentSectorX, (UINT8)gsAdjacentSectorY );

                        pPlayer = gpAdjacentGroup->pPlayerList;
                        while( pPlayer )
                        {
                                // pass flag that this is a tactical traversal, the path built MUST go in the traversed direction even if longer!
                                PlotPathForCharacter( pPlayer->pSoldier, gsAdjacentSectorX, gsAdjacentSectorY, TRUE );
                                pPlayer = pPlayer->next;
                        }

                        if( gbAdjacentSectorZ > 0 )
                        {	//Nasty strategic movement logic doesn't like underground sectors!
                                gfUndergroundTacticalTraversal = FALSE;
                        }

                        //Warp the clock by 5 minutes, but ignore events until that 5 minutes is up.
                        //...BUT only if we are above ground (if underground, traversal is always 1 minute.
                        if( !gbAdjacentSectorZ )
                        {
                                UINT32 uiWarpTime;
                                uiWarpTime = (GetWorldTotalMin() + 5) * 60 - GetWorldTotalSeconds();
                                WarpGameTime( uiWarpTime, WARPTIME_PROCESS_TARGET_TIME_FIRST );
                                //WarpGameTime( 300, WARPTIME_NO_PROCESSING_OF_EVENTS );
                                //WarpGameTime( 1, WARPTIME_PROCESS_EVENTS_NORMALLY );
                        }
                        else if( gbAdjacentSectorZ > 0 )
                        {
                                UINT32 uiWarpTime;
                                uiWarpTime = (GetWorldTotalMin() + 1) * 60 - GetWorldTotalSeconds();
                                WarpGameTime( uiWarpTime, WARPTIME_PROCESS_TARGET_TIME_FIRST );
                                //WarpGameTime( 60, WARPTIME_NO_PROCESSING_OF_EVENTS );
                                //WarpGameTime( 1, WARPTIME_PROCESS_EVENTS_NORMALLY );
                        }

                        //Because we are actually loading the new map, and we are physically traversing, we don't want
                        //to bring up the prebattle interface when we arrive if there are enemies there.  This flag
                        //ignores the initialization of the prebattle interface and clears the flag.
                        gFadeOutDoneCallback = DoneFadeOutAdjacentSector;
                        FadeOutGameScreen( );
                }
                else
                { //Case 3:
                        BOOLEAN fWarpTime = FALSE;

                        if( !gbAdjacentSectorZ && NumEnemiesInSector( gWorldSectorX, gWorldSectorY ) )
                        { //We are retreating from a sector with enemies in it and there are no mercs left  so
                                //warp the game time by 5 minutes to simulate the actual retreat.  This restricts the
                                //player from immediately coming back to the same sector they left to perhaps take advantage
                                //of the tactical placement gui to get into better position.  Additionally, if there are any
                                //enemies in this sector that are part of a movement group, reset that movement group so that they
                                //are "in" the sector rather than 75% of the way to the next sector if that is the case.
                                fWarpTime = TRUE;
                                ResetMovementForEnemyGroupsInLocation( (UINT8)gWorldSectorX, (UINT8)gWorldSectorY );
                        }

                        //Lock game into mapscreen mode, but after the fade is done.
                        gfEnteringMapScreen = TRUE;

                        // ATE; Fade FAST....
                        SetMusicFadeSpeed( 5 );
                        SetMusicMode( MUSIC_TACTICAL_NOTHING );
                        // clear their strategic movement (mercpaths and waypoints)
                        ClearMercPathsAndWaypointsForAllInGroup( gpAdjacentGroup );

                        AddWaypointToPGroup( gpAdjacentGroup, (UINT8)gsAdjacentSectorX, (UINT8)gsAdjacentSectorY );

                        pPlayer = gpAdjacentGroup->pPlayerList;
                        while( pPlayer )
                        {
                                // pass flag that this is a tactical traversal, the path built MUST go in the traversed direction even if longer!
                                PlotPathForCharacter( pPlayer->pSoldier, gsAdjacentSectorX, gsAdjacentSectorY, TRUE );
                                pPlayer = pPlayer->next;
                        }
                        if( fWarpTime )
                        {
                                WarpGameTime( 300, WARPTIME_NO_PROCESSING_OF_EVENTS );
                        }
                }
        }
}
*/

function SetupTacticalTraversalInformation(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pPlayer: Pointer<PLAYERGROUP>;
  let sWorldX: UINT32;
  let sWorldY: UINT32;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sNewGridNo: INT16;

  Assert(gpAdjacentGroup);
  pPlayer = gpAdjacentGroup.value.pPlayerList;
  while (pPlayer) {
    pSoldier = pPlayer.value.pSoldier;

    SetInsertionDataFromAdjacentMoveDirection(pSoldier, gubTacticalDirection, gsAdditionalData);

    // pass flag that this is a tactical traversal, the path built MUST go in the traversed direction even if longer!
    PlotPathForCharacter(pSoldier, gsAdjacentSectorX, gsAdjacentSectorY, true);

    if (guiAdjacentTraverseTime <= 5) {
      // Determine 'mirror' gridno...
      // Convert to absolute xy
      ({ sScreenX, sScreenY } = GetWorldXYAbsoluteScreenXY((pSoldier.value.sX / CELL_X_SIZE), (pSoldier.value.sY / CELL_Y_SIZE)));

      // Get 'mirror', depending on what direction...
      switch (gubTacticalDirection) {
        case Enum245.NORTH:
          sScreenY = 1520;
          break;
        case Enum245.SOUTH:
          sScreenY = 0;
          break;
        case Enum245.EAST:
          sScreenX = 0;
          break;
        case Enum245.WEST:
          sScreenX = 3160;
          break;
      }

      // Convert into a gridno again.....
      ({ uiCellX: sWorldX, uiCellY: sWorldY } = GetFromAbsoluteScreenXYWorldXY(sScreenX, sScreenY));
      sNewGridNo = GETWORLDINDEXFROMWORLDCOORDS(sWorldY, sWorldX);

      // Save this gridNo....
      pSoldier.value.sPendingActionData2 = sNewGridNo;
      // Copy CODe computed earlier into data
      pSoldier.value.usStrategicInsertionData = pSoldier.value.ubStrategicInsertionCode;
      // Now use NEW code....

      pSoldier.value.ubStrategicInsertionCode = CalcMapEdgepointClassInsertionCode(pSoldier.value.sPreTraversalGridNo);

      if (gubAdjacentJumpCode == Enum177.JUMP_SINGLE_LOAD_NEW || gubAdjacentJumpCode == Enum177.JUMP_ALL_LOAD_NEW) {
        fUsingEdgePointsForStrategicEntry = true;
      }
    }

    pPlayer = pPlayer.value.next;
  }
  if (gubAdjacentJumpCode == Enum177.JUMP_ALL_NO_LOAD || gubAdjacentJumpCode == Enum177.JUMP_SINGLE_NO_LOAD) {
    gfTacticalTraversal = false;
    gpTacticalTraversalGroup = null;
    gpTacticalTraversalChosenSoldier = null;
  }
}

export function AllMercsHaveWalkedOffSector(): void {
  let pPlayer: Pointer<PLAYERGROUP>;
  let fEnemiesInLoadedSector: boolean = false;

  if (NumEnemiesInAnySector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fEnemiesInLoadedSector = true;
  }

  HandleLoyaltyImplicationsOfMercRetreat(RETREAT_TACTICAL_TRAVERSAL, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Setup strategic traversal information
  if (guiAdjacentTraverseTime <= 5) {
    gfTacticalTraversal = true;
    gpTacticalTraversalGroup = gpAdjacentGroup;

    if (gbAdjacentSectorZ > 0 && guiAdjacentTraverseTime <= 5) {
      // Nasty strategic movement logic doesn't like underground sectors!
      gfUndergroundTacticalTraversal = true;
    }
  }
  ClearMercPathsAndWaypointsForAllInGroup(gpAdjacentGroup);
  AddWaypointToPGroup(gpAdjacentGroup, gsAdjacentSectorX, gsAdjacentSectorY);
  if (gbAdjacentSectorZ > 0 && guiAdjacentTraverseTime <= 5) {
    // Nasty strategic movement logic doesn't like underground sectors!
    gfUndergroundTacticalTraversal = true;
  }

  SetupTacticalTraversalInformation();

  // ATE: Added here: donot load another screen if we were told not to....
  if ((gubAdjacentJumpCode == Enum177.JUMP_ALL_NO_LOAD || gubAdjacentJumpCode == Enum177.JUMP_SINGLE_NO_LOAD)) {
    // Case 1:  Group is leaving sector, but there are other mercs in sector and player wants to stay, or
    //         there are other mercs in sector while a battle is in progress.
    pPlayer = gpAdjacentGroup.value.pPlayerList;
    while (pPlayer) {
      RemoveSoldierFromTacticalSector(pPlayer.value.pSoldier, true);
      pPlayer = pPlayer.value.next;
    }
    SetDefaultSquadOnSectorEntry(true);
  } else {
    if (fEnemiesInLoadedSector) {
      // We are retreating from a sector with enemies in it and there are no mercs left  so
      // warp the game time by 5 minutes to simulate the actual retreat.  This restricts the
      // player from immediately coming back to the same sector they left to perhaps take advantage
      // of the tactical placement gui to get into better position.  Additionally, if there are any
      // enemies in this sector that are part of a movement group, reset that movement group so that they
      // are "in" the sector rather than 75% of the way to the next sector if that is the case.
      ResetMovementForEnemyGroupsInLocation(gWorldSectorX, gWorldSectorY);

      if (guiAdjacentTraverseTime > 5) {
        // Because this final group is retreating, simulate extra time to retreat, so they can't immediately come back.
        WarpGameTime(300, Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS);
      }
    }
    if (guiAdjacentTraverseTime <= 5) {
      // Case 2:  Immediatly loading the next sector
      if (!gbAdjacentSectorZ) {
        let uiWarpTime: UINT32;
        uiWarpTime = (GetWorldTotalMin() + 5) * 60 - GetWorldTotalSeconds();
        WarpGameTime(uiWarpTime, Enum131.WARPTIME_PROCESS_TARGET_TIME_FIRST);
      } else if (gbAdjacentSectorZ > 0) {
        let uiWarpTime: UINT32;
        uiWarpTime = (GetWorldTotalMin() + 1) * 60 - GetWorldTotalSeconds();
        WarpGameTime(uiWarpTime, Enum131.WARPTIME_PROCESS_TARGET_TIME_FIRST);
      }

      // Because we are actually loading the new map, and we are physically traversing, we don't want
      // to bring up the prebattle interface when we arrive if there are enemies there.  This flag
      // ignores the initialization of the prebattle interface and clears the flag.
      gFadeOutDoneCallback = DoneFadeOutAdjacentSector;
      FadeOutGameScreen();
    } else {
      // Case 3:  Going directly to mapscreen

      // Lock game into mapscreen mode, but after the fade is done.
      gfEnteringMapScreen = true;

      // ATE; Fade FAST....
      SetMusicFadeSpeed(5);
      SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
    }
  }
}

function DoneFadeOutExitGridSector(): void {
  SetCurrentWorldSector(gsAdjacentSectorX, gsAdjacentSectorY, gbAdjacentSectorZ);
  if (gfTacticalTraversal && gpTacticalTraversalGroup && gpTacticalTraversalChosenSoldier) {
    if (gTacticalStatus.fEnemyInSector) {
      TacticalCharacterDialogueWithSpecialEvent(gpTacticalTraversalChosenSoldier, Enum202.QUOTE_ENEMY_PRESENCE, 0, 0, 0);
    }
  }
  gfTacticalTraversal = false;
  gpTacticalTraversalGroup = null;
  gpTacticalTraversalChosenSoldier = null;
  FadeInGameScreen();
}

function DoneFadeOutAdjacentSector(): void {
  let ubDirection: UINT8;
  SetCurrentWorldSector(gsAdjacentSectorX, gsAdjacentSectorY, gbAdjacentSectorZ);

  ubDirection = GetStrategicInsertionDataFromAdjacentMoveDirection(gubTacticalDirection, gsAdditionalData);
  if (gfTacticalTraversal && gpTacticalTraversalGroup && gpTacticalTraversalChosenSoldier) {
    if (gTacticalStatus.fEnemyInSector) {
      TacticalCharacterDialogueWithSpecialEvent(gpTacticalTraversalChosenSoldier, Enum202.QUOTE_ENEMY_PRESENCE, 0, 0, 0);
    }
  }
  gfTacticalTraversal = false;
  gpTacticalTraversalGroup = null;
  gpTacticalTraversalChosenSoldier = null;

  if (gfCaves) {
    // ATE; Set tactical status flag...
    gTacticalStatus.uiFlags |= IGNORE_ALL_OBSTACLES;
    // Set pathing flag to path through anything....
    gfPathAroundObstacles = false;
  }

  // OK, give our guys new orders...
  if (gpAdjacentGroup.value.fPlayer) {
    // For player groups, update the soldier information
    let curr: Pointer<PLAYERGROUP>;
    let uiAttempts: UINT32;
    let sGridNo: INT16;
    let sOldGridNo: INT16;
    let ubNum: UINT8 = 0;
    let sWorldX: INT16;
    let sWorldY: INT16;
    curr = gpAdjacentGroup.value.pPlayerList;
    while (curr) {
      if (!(curr.value.pSoldier.value.uiStatusFlags & SOLDIER_IS_TACTICALLY_VALID)) {
        if (curr.value.pSoldier.value.sGridNo != NOWHERE) {
          sGridNo = PickGridNoToWalkIn(curr.value.pSoldier, ubDirection, addressof(uiAttempts));

          // If the search algorithm failed due to too many attempts, simply reset the
          // the gridno as the destination is a reserved gridno and we will place the
          // merc there without walking into the sector.
          if (sGridNo == NOWHERE && uiAttempts == MAX_ATTEMPTS) {
            sGridNo = curr.value.pSoldier.value.sGridNo;
          }

          if (sGridNo != NOWHERE) {
            curr.value.pSoldier.value.ubWaitActionToDo = 1;
            // OK, here we have been given a position, a gridno has been given to use as well....
            sOldGridNo = curr.value.pSoldier.value.sGridNo;
            sWorldX = CenterX(sGridNo);
            sWorldY = CenterY(sGridNo);
            EVENT_SetSoldierPosition(curr.value.pSoldier, sWorldX, sWorldY);
            if (sGridNo != sOldGridNo) {
              EVENT_GetNewSoldierPath(curr.value.pSoldier, sOldGridNo, Enum193.WALKING);
            }
            ubNum++;
          }
        } else {
        }
      }
      curr = curr.value.next;
    }
    SetActionToDoOnceMercsGetToLocation(Enum238.WAIT_FOR_MERCS_TO_WALKON_SCREEN, ubNum, 0, 0, 0);
    guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;
    HandleTacticalUI();

    // Unset flag here.....
    gfPathAroundObstacles = true;
  }
  FadeInGameScreen();
}

function SoldierOKForSectorExit(pSoldier: Pointer<SOLDIERTYPE>, bExitDirection: INT8, usAdditionalData: UINT16): boolean {
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubDirection: UINT8;
  let sGridNo: INT16;
  let sAPs: INT16;

  // if the soldiers gridno is not NOWHERE
  if (pSoldier.value.sGridNo == NOWHERE)
    return false;

  // OK, anyone on roofs cannot!
  if (pSoldier.value.bLevel > 0)
    return false;

  // get world absolute XY
  ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(pSoldier.value.sGridNo));

  // Get screen coordinates for current position of soldier
  ({ sScreenX: sWorldX, sScreenY: sWorldY } = GetWorldXYAbsoluteScreenXY(sXMapPos, sYMapPos));

  // Check direction
  switch (bExitDirection) {
    case Enum186.EAST_STRATEGIC_MOVE:

      if (sWorldX < ((gsTRX - gsTLX) - CHECK_DIR_X_DELTA)) {
        // NOT OK, return FALSE
        return false;
      }
      break;

    case Enum186.WEST_STRATEGIC_MOVE:

      if (sWorldX > CHECK_DIR_X_DELTA) {
        // NOT OK, return FALSE
        return false;
      }
      break;

    case Enum186.SOUTH_STRATEGIC_MOVE:

      if (sWorldY < ((gsBLY - gsTRY) - CHECK_DIR_Y_DELTA)) {
        // NOT OK, return FALSE
        return false;
      }
      break;

    case Enum186.NORTH_STRATEGIC_MOVE:

      if (sWorldY > CHECK_DIR_Y_DELTA) {
        // NOT OK, return FALSE
        return false;
      }
      break;

      // This case is for an exit grid....
      // check if we are close enough.....

    case -1:

      // FOR REALTIME - DO MOVEMENT BASED ON STANCE!
      if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
        pSoldier.value.usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, gAnimControl[pSoldier.value.usAnimState].ubEndHeight);
      }

      sGridNo = FindGridNoFromSweetSpotCloseToExitGrid(pSoldier, usAdditionalData, 10, addressof(ubDirection));

      if (sGridNo == NOWHERE) {
        return false;
      }

      // ATE: if we are in combat, get cost to move here....
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        // Turn off at end of function...
        sAPs = PlotPath(pSoldier, sGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

        if (!EnoughPoints(pSoldier, sAPs, 0, false)) {
          return false;
        }
      }
      break;
  }
  return true;
}

// ATE: Returns FALSE if NOBODY is close enough, 1 if ONLY selected guy is and 2 if all on squad are...
export function OKForSectorExit(bExitDirection: INT8, usAdditionalData: UINT16, puiTraverseTimeInMinutes: Pointer<UINT32>): boolean {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fAtLeastOneMercControllable: boolean = false;
  let fOnlySelectedGuy: boolean = false;
  let pValidSoldier: Pointer<SOLDIERTYPE> = null;
  let ubReturnVal: UINT8 = false;
  let ubNumControllableMercs: UINT8 = 0;
  let ubNumMercs: UINT8 = 0;
  let ubNumEPCs: UINT8 = 0;
  let ubPlayerControllableMercsInSquad: UINT8 = 0;

  if (gusSelectedSoldier == NOBODY) {
    // must have a selected soldier to be allowed to tactically traverse.
    return false;
  }

  /*
  //Exception code for the two sectors in San Mona that are separated by a cliff.  We want to allow strategic
  //traversal, but NOT tactical traversal.  The only way to tactically go from D4 to D5 (or viceversa) is to enter
  //the cave entrance.
  if( gWorldSectorX == 4 && gWorldSectorY == 4 && !gbWorldSectorZ && bExitDirection == EAST_STRATEGIC_MOVE )
  {
          gfInvalidTraversal = TRUE;
          return FALSE;
  }
  if( gWorldSectorX == 5 && gWorldSectorY == 4 && !gbWorldSectorZ && bExitDirection == WEST_STRATEGIC_MOVE )
  {
          gfInvalidTraversal = TRUE;
          return FALSE;
  }
  */

  gfInvalidTraversal = false;
  gfLoneEPCAttemptingTraversal = false;
  gubLoneMercAttemptingToAbandonEPCs = 0;
  gbPotentiallyAbandonedEPCSlotID = -1;

  // Look through all mercs and check if they are within range of east end....
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // If we are controllable
    if (OK_CONTROLLABLE_MERC(pSoldier) && pSoldier.value.bAssignment == CurrentSquad()) {
      // Need to keep a copy of a good soldier, so we can access it later, and
      // not more than once.
      pValidSoldier = pSoldier;

      ubNumControllableMercs++;

      // We need to keep track of the number of EPCs and mercs in this squad.  If we have
      // only one merc and one or more EPCs, then we can't allow the merc to tactically traverse,
      // if he is the only merc near enough to traverse.
      if (AM_AN_EPC(pSoldier)) {
        ubNumEPCs++;
        // Also record the EPC's slot ID incase we later build a string using the EPC's name.
        gbPotentiallyAbandonedEPCSlotID = cnt;
        if (AM_A_ROBOT(pSoldier) && !CanRobotBeControlled(pSoldier)) {
          gfRobotWithoutControllerAttemptingTraversal = true;
          ubNumControllableMercs--;
          continue;
        }
      } else {
        ubNumMercs++;
      }

      if (SoldierOKForSectorExit(pSoldier, bExitDirection, usAdditionalData)) {
        fAtLeastOneMercControllable++;

        if (cnt == gusSelectedSoldier) {
          fOnlySelectedGuy = true;
        }
      } else {
        let pGroup: Pointer<GROUP>;

        // ATE: Dont's assume exit grids here...
        if (bExitDirection != -1) {
          // Now, determine if this is a valid path.
          pGroup = GetGroup(pValidSoldier.value.ubGroupID);
          AssertMsg(pGroup, FormatString("%S is not in a valid group (pSoldier->ubGroupID is %d)", pValidSoldier.value.name, pValidSoldier.value.ubGroupID));
          if (!gbWorldSectorZ) {
            puiTraverseTimeInMinutes.value = GetSectorMvtTimeForGroup(SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY), bExitDirection, pGroup);
          } else if (gbWorldSectorZ > 1) {
            // We are attempting to traverse in an underground environment.  We need to use a complete different
            // method.  When underground, all sectors are instantly adjacent.
            puiTraverseTimeInMinutes.value = UndergroundTacticalTraversalTime(bExitDirection);
          }
          if (puiTraverseTimeInMinutes.value == 0xffffffff) {
            gfInvalidTraversal = true;
            return false;
          }
        } else {
          puiTraverseTimeInMinutes.value = 0; // exit grid travel is instantaneous
        }
      }
    }
  }

  // If we are here, at least one guy is controllable in this sector, at least he can go!
  if (fAtLeastOneMercControllable) {
    ubPlayerControllableMercsInSquad = NumberOfPlayerControllableMercsInSquad(MercPtrs[gusSelectedSoldier].value.bAssignment);
    if (fAtLeastOneMercControllable <= ubPlayerControllableMercsInSquad) {
      // if the selected merc is an EPC and we can only leave with that merc, then prevent it
      // as EPCs aren't allowed to leave by themselves.  Instead of restricting this in the
      // exiting sector gui, we restrict it by explaining it with a message box.
      if (AM_AN_EPC(MercPtrs[gusSelectedSoldier])) {
        if (AM_A_ROBOT(pSoldier) && !CanRobotBeControlled(pSoldier)) {
          // gfRobotWithoutControllerAttemptingTraversal = TRUE;
          return false;
        } else if (fAtLeastOneMercControllable < ubPlayerControllableMercsInSquad || fAtLeastOneMercControllable == 1) {
          gfLoneEPCAttemptingTraversal = true;
          return false;
        }
      } else {
        // We previously counted the number of EPCs and mercs, and if the selected merc is not an EPC and there are no
        // other mercs in the squad able to escort the EPCs, we will prohibit this merc from tactically traversing.
        if (ubNumEPCs && ubNumMercs == 1 && fAtLeastOneMercControllable < ubPlayerControllableMercsInSquad) {
          gubLoneMercAttemptingToAbandonEPCs = ubNumEPCs;
          return false;
        }
      }
    }
    if (bExitDirection != -1) {
      let pGroup: Pointer<GROUP>;
      // Now, determine if this is a valid path.
      pGroup = GetGroup(pValidSoldier.value.ubGroupID);
      AssertMsg(pGroup, FormatString("%S is not in a valid group (pSoldier->ubGroupID is %d)", pValidSoldier.value.name, pValidSoldier.value.ubGroupID));
      if (!gbWorldSectorZ) {
        puiTraverseTimeInMinutes.value = GetSectorMvtTimeForGroup(SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY), bExitDirection, pGroup);
      } else if (gbWorldSectorZ > 0) {
        // We are attempting to traverse in an underground environment.  We need to use a complete different
        // method.  When underground, all sectors are instantly adjacent.
        puiTraverseTimeInMinutes.value = UndergroundTacticalTraversalTime(bExitDirection);
      }
      if (puiTraverseTimeInMinutes.value == 0xffffffff) {
        gfInvalidTraversal = true;
        ubReturnVal = false;
      } else {
        ubReturnVal = true;
      }
    } else {
      ubReturnVal = true;
      puiTraverseTimeInMinutes.value = 0; // exit grid travel is instantaneous
    }
  }

  if (ubReturnVal) {
    // Default to FALSE again, until we see that we have
    ubReturnVal = false;

    if (fAtLeastOneMercControllable) {
      // Do we contain the selected guy?
      if (fOnlySelectedGuy) {
        ubReturnVal = 1;
      }
      // Is the whole squad able to go here?
      if (fAtLeastOneMercControllable == ubPlayerControllableMercsInSquad) {
        ubReturnVal = 2;
      }
    }
  }

  return ubReturnVal;
}

export function SetupNewStrategicGame(): void {
  let sSectorX: INT16;
  let sSectorY: INT16;

  // Set all sectors as enemy controlled
  for (sSectorX = 0; sSectorX < MAP_WORLD_X; sSectorX++) {
    for (sSectorY = 0; sSectorY < MAP_WORLD_Y; sSectorY++) {
      StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].fEnemyControlled = true;
    }
  }

  // Initialize the game time
  InitNewGameClock();
  // Remove all events
  DeleteAllStrategicEvents();

  // Set up all events that get processed daily...
  //.............................................
  BuildDayLightLevels();
  // Check for quests each morning
  AddEveryDayStrategicEvent(Enum132.EVENT_CHECKFORQUESTS, QUEST_CHECK_EVENT_TIME, 0);
  // Some things get updated in the very early morning
  AddEveryDayStrategicEvent(Enum132.EVENT_DAILY_EARLY_MORNING_EVENTS, EARLY_MORNING_TIME, 0);
  // Daily Update BobbyRay Inventory
  AddEveryDayStrategicEvent(Enum132.EVENT_DAILY_UPDATE_BOBBY_RAY_INVENTORY, BOBBYRAY_UPDATE_TIME, 0);
  // Daily Update of the M.E.R.C. site.
  AddEveryDayStrategicEvent(Enum132.EVENT_DAILY_UPDATE_OF_MERC_SITE, 0, 0);
  // Daily update of insured mercs
  AddEveryDayStrategicEvent(Enum132.EVENT_HANDLE_INSURED_MERCS, INSURANCE_UPDATE_TIME, 0);
  // Daily update of mercs
  AddEveryDayStrategicEvent(Enum132.EVENT_MERC_DAILY_UPDATE, 0, 0);
  // Daily mine production processing events
  AddEveryDayStrategicEvent(Enum132.EVENT_SETUP_MINE_INCOME, 0, 0);
  // Daily merc reputation processing events
  AddEveryDayStrategicEvent(Enum132.EVENT_SETUP_TOWN_OPINION, 0, 0);
  // Daily checks for E-mail from Enrico
  AddEveryDayStrategicEvent(Enum132.EVENT_ENRICO_MAIL, ENRICO_MAIL_TIME, 0);

  // Hourly update of all sorts of things
  AddPeriodStrategicEvent(Enum132.EVENT_HOURLY_UPDATE, 60, 0);
  AddPeriodStrategicEvent(Enum132.EVENT_QUARTER_HOUR_UPDATE, 15, 0);

  // Clear any possible battle locator
  gfBlitBattleSectorLocator = false;

  StrategicTurnsNewGame();
}

// a -1 will be returned upon failure
export function GetSAMIdFromSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): INT8 {
  let bCounter: INT8 = 0;
  let sSectorValue: INT16 = 0;

  // check if valid sector
  if (bSectorZ != 0) {
    return -1;
  }

  // get the sector value
  sSectorValue = SECTOR(sSectorX, sSectorY);

  // run through list of sam sites
  for (bCounter = 0; bCounter < 4; bCounter++) {
    if (pSamList[bCounter] == sSectorValue) {
      return bCounter;
    }
  }

  return -1;
}

export function CanGoToTacticalInSector(sX: INT16, sY: INT16, ubZ: UINT8): boolean {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // if not a valid sector
  if ((sX < 1) || (sX > 16) || (sY < 1) || (sY > 16) || (ubZ > 3)) {
    return false;
  }

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all living, fighting mercs on player's team.  Robot and EPCs qualify!
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // ARM: now allows loading of sector with all mercs below OKLIFE as long as they're alive
    if ((pSoldier.value.bActive && pSoldier.value.bLife) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && (pSoldier.value.bAssignment != Enum117.IN_TRANSIT) && (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW) && (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD) && !SoldierAboardAirborneHeli(pSoldier)) {
      if (!pSoldier.value.fBetweenSectors && pSoldier.value.sSectorX == sX && pSoldier.value.sSectorY == sY && pSoldier.value.bSectorZ == ubZ) {
        return true;
      }
    }
  }

  return false;
}

export function GetNumberOfSAMSitesUnderPlayerControl(): INT32 {
  let iNumber: INT32 = 0;
  let iCounter: INT32 = 0;

  // if the sam site is under player control, up the number
  for (iCounter = 0; iCounter < NUMBER_OF_SAMS; iCounter++) {
    if (StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(pSamList[iCounter])].fEnemyControlled == false) {
      iNumber++;
    }
  }

  return iNumber;
}

export function SAMSitesUnderPlayerControl(sX: INT16, sY: INT16): INT32 {
  let fSamSiteUnderControl: boolean = false;

  // is this sector a SAM sector?
  if (IsThisSectorASAMSector(sX, sY, 0) == true) {
    // is it under control by the player
    if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sX, sY)].fEnemyControlled == false) {
      // yes
      fSamSiteUnderControl = true;
    }
  }

  return fSamSiteUnderControl;
}

export function UpdateAirspaceControl(): void {
  let iCounterA: INT32 = 0;
  let iCounterB: INT32 = 0;
  let ubControllingSAM: UINT8;
  let pSAMStrategicMap: Pointer<StrategicMapElement> = null;
  let fEnemyControlsAir: boolean;

  for (iCounterA = 1; iCounterA < (MAP_WORLD_X - 1); iCounterA++) {
    for (iCounterB = 1; iCounterB < (MAP_WORLD_Y - 1); iCounterB++) {
      // IMPORTANT: B and A are reverse here, since the table is stored transposed
      ubControllingSAM = ubSAMControlledSectors[iCounterB][iCounterA];

      if ((ubControllingSAM >= 1) && (ubControllingSAM <= NUMBER_OF_SAMS)) {
        pSAMStrategicMap = addressof(StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(pSamList[ubControllingSAM - 1])]);

        // if the enemies own the controlling SAM site, and it's in working condition
        if ((pSAMStrategicMap.value.fEnemyControlled) && (pSAMStrategicMap.value.bSAMCondition >= MIN_CONDITION_FOR_SAM_SITE_TO_WORK)) {
          fEnemyControlsAir = true;
        } else {
          fEnemyControlsAir = false;
        }
      } else {
        // no controlling SAM site
        fEnemyControlsAir = false;
      }

      StrategicMap[CALCULATE_STRATEGIC_INDEX(iCounterA, iCounterB)].fEnemyAirControlled = fEnemyControlsAir;
    }
  }

  // check if currently selected arrival sector still has secure airspace

  // if it's not enemy air controlled
  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(gsMercArriveSectorX, gsMercArriveSectorY)].fEnemyAirControlled == true) {
    // NOPE!
    let sMsgString: string /* CHAR16[256] */;
    let sMsgSubString1: string /* CHAR16[64] */;
    let sMsgSubString2: string /* CHAR16[64] */;

    // get the name of the old sector
    sMsgSubString1 = GetSectorIDString(gsMercArriveSectorX, gsMercArriveSectorY, 0, false);

    // move the landing zone over to Omerta
    gsMercArriveSectorX = 9;
    gsMercArriveSectorY = 1;

    // get the name of the new sector
    sMsgSubString2 = GetSectorIDString(gsMercArriveSectorX, gsMercArriveSectorY, 0, false);

    // now build the string
    sMsgString = swprintf(pBullseyeStrings[4], sMsgSubString1, sMsgSubString2);

    // confirm the change with overlay message
    DoScreenIndependantMessageBox(sMsgString, MSG_BOX_FLAG_OK, null);

    // update position of bullseye
    fMapPanelDirty = true;

    // update destination column for any mercs in transit
    fTeamPanelDirty = true;
  }

  // ARM: airspace control now affects refueling site availability, so update that too with every change!
  UpdateRefuelSiteAvailability();
}

export function IsThereAFunctionalSAMSiteInSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  if (IsThisSectorASAMSector(sSectorX, sSectorY, bSectorZ) == false) {
    return false;
  }

  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].bSAMCondition < MIN_CONDITION_FOR_SAM_SITE_TO_WORK) {
    return false;
  }

  return true;
}

export function IsThisSectorASAMSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  // is the sector above ground?
  if (bSectorZ != 0) {
    return false;
  }

  if ((SAM_1_X == sSectorX) && (SAM_1_Y == sSectorY)) {
    return true;
  } else if ((SAM_2_X == sSectorX) && (SAM_2_Y == sSectorY)) {
    return true;
  } else if ((SAM_3_X == sSectorX) && (SAM_3_Y == sSectorY)) {
    return true;
  } else if ((SAM_4_X == sSectorX) && (SAM_4_Y == sSectorY)) {
    return true;
  }

  return false;
}

// is this sector part of the town?
function SectorIsPartOfTown(bTownId: INT8, sSectorX: INT16, sSectorY: INT16): boolean {
  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].bNameId == bTownId) {
    // is in the town
    return true;
  }

  // not in the town
  return false;
}

export function SaveStrategicInfoToSavedFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let uiSize: UINT32 = sizeof(StrategicMapElement) * (MAP_WORLD_X * MAP_WORLD_Y);

  // Save the strategic map information
  FileWrite(hFile, StrategicMap, uiSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSize) {
    return false;
  }

  // Save the Sector Info
  uiSize = sizeof(SECTORINFO) * 256;
  FileWrite(hFile, SectorInfo, uiSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSize) {
    return false;
  }

  // Save the SAM Controlled Sector Information
  uiSize = MAP_WORLD_X * MAP_WORLD_Y;
  /*
          FileWrite( hFile, ubSAMControlledSectors, uiSize, &uiNumBytesWritten );
          if( uiNumBytesWritten != uiSize)
          {
                  return(FALSE);
          }
  */
  FileSeek(hFile, uiSize, FILE_SEEK_FROM_CURRENT);

  // Save the fFoundOrta
  FileWrite(hFile, addressof(fFoundOrta), sizeof(BOOLEAN), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(BOOLEAN)) {
    return false;
  }

  return true;
}

export function LoadStrategicInfoFromSavedFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let uiSize: UINT32 = sizeof(StrategicMapElement) * (MAP_WORLD_X * MAP_WORLD_Y);

  // Load the strategic map information
  FileRead(hFile, StrategicMap, uiSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiSize) {
    return false;
  }

  // Load the Sector Info
  uiSize = sizeof(SECTORINFO) * 256;
  FileRead(hFile, SectorInfo, uiSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiSize) {
    return false;
  }

  // Load the SAM Controlled Sector Information
  uiSize = MAP_WORLD_X * MAP_WORLD_Y;
  /*
          FileRead( hFile, ubSAMControlledSectors, uiSize, &uiNumBytesRead );
          if( uiNumBytesRead != uiSize)
          {
                  return(FALSE);
          }
  */
  FileSeek(hFile, uiSize, FILE_SEEK_FROM_CURRENT);

  // Load the fFoundOrta
  FileRead(hFile, addressof(fFoundOrta), sizeof(BOOLEAN), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(BOOLEAN)) {
    return false;
  }

  return true;
}

function PickGridNoNearestEdge(pSoldier: Pointer<SOLDIERTYPE>, ubTacticalDirection: UINT8): INT16 {
  let sGridNo: INT16;
  let sStartGridNo: INT16;
  let sOldGridNo: INT16;
  let bOdd: INT8 = 1;
  let bOdd2: INT8 = 1;
  let bAdjustedDist: UINT8 = 0;
  let cnt: UINT32;

  switch (ubTacticalDirection) {
    case Enum245.EAST:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the right!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo -= WORLD_COLS;
        } else {
          sGridNo++;
        }

        bOdd = !bOdd;
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      do {
        // OK, here we go back one, check for OK destination...
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate up/down )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS - 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS + 1);
          }
        }

        bOdd2 = (!bOdd2);
      } while (true);

      break;

    case Enum245.WEST:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the left!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo += WORLD_COLS;
        } else {
          sGridNo--;
        }

        bOdd = !bOdd;
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      do {
        // OK, here we go back one, check for OK destination...
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate up/down )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS - 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS + 1);
          }
        }

        bOdd2 = (!bOdd2);
      } while (true);

      break;

    case Enum245.NORTH:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the left!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo -= WORLD_COLS;
        } else {
          sGridNo--;
        }

        bOdd = (!bOdd);
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      do {
        // OK, here we go back one, check for OK destination...
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate left/right )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS - 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS + 1);
          }
        }

        bOdd2 = (!bOdd2);
      } while (true);

      break;

    case Enum245.SOUTH:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the left!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo += WORLD_COLS;
        } else {
          sGridNo++;
        }

        bOdd = (!bOdd);
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      do {
        // OK, here we go back one, check for OK destination...
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate left/right )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS - 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS + 1);
          }
        }

        bOdd2 = (!bOdd2);
      } while (true);

      break;
  }

  return NOWHERE;
}

export function AdjustSoldierPathToGoOffEdge(pSoldier: Pointer<SOLDIERTYPE>, sEndGridNo: INT16, ubTacticalDirection: UINT8): void {
  let sNewGridNo: INT16;
  let sTempGridNo: INT16;
  let iLoop: INT32;

  // will this path segment actually take us to our desired destination in the first place?
  if (pSoldier.value.usPathDataSize + 2 > MAX_PATH_LIST_SIZE) {
    sTempGridNo = pSoldier.value.sGridNo;

    for (iLoop = 0; iLoop < pSoldier.value.usPathDataSize; iLoop++) {
      sTempGridNo += DirectionInc(pSoldier.value.usPathingData[iLoop]);
    }

    if (sTempGridNo == sEndGridNo) {
      // we can make it, but there isn't enough path room for the two steps required.
      // truncate our path so there's guaranteed the merc will have to generate another
      // path later on...
      pSoldier.value.usPathDataSize -= 4;
      return;
    } else {
      // can't even make it there with these 30 tiles of path, abort...
      return;
    }
  }

  switch (ubTacticalDirection) {
    case Enum245.EAST:

      sNewGridNo = NewGridNo(sEndGridNo, DirectionInc(Enum245.NORTHEAST));

      if (OutOfBounds(sEndGridNo, sNewGridNo)) {
        return;
      }

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.NORTHEAST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;

      sTempGridNo = NewGridNo(sNewGridNo, DirectionInc(Enum245.NORTHEAST));

      if (OutOfBounds(sNewGridNo, sTempGridNo)) {
        return;
      }
      sNewGridNo = sTempGridNo;

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.NORTHEAST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;

      break;

    case Enum245.WEST:

      sNewGridNo = NewGridNo(sEndGridNo, DirectionInc(Enum245.SOUTHWEST));

      if (OutOfBounds(sEndGridNo, sNewGridNo)) {
        return;
      }

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.SOUTHWEST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;

      sTempGridNo = NewGridNo(sNewGridNo, DirectionInc(Enum245.SOUTHWEST));

      if (OutOfBounds(sNewGridNo, sTempGridNo)) {
        return;
      }
      sNewGridNo = sTempGridNo;

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.SOUTHWEST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;
      break;

    case Enum245.NORTH:

      sNewGridNo = NewGridNo(sEndGridNo, DirectionInc(Enum245.NORTHWEST));

      if (OutOfBounds(sEndGridNo, sNewGridNo)) {
        return;
      }

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.NORTHWEST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;

      sTempGridNo = NewGridNo(sNewGridNo, DirectionInc(Enum245.NORTHWEST));

      if (OutOfBounds(sNewGridNo, sTempGridNo)) {
        return;
      }
      sNewGridNo = sTempGridNo;

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.NORTHWEST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;

      break;

    case Enum245.SOUTH:

      sNewGridNo = NewGridNo(sEndGridNo, DirectionInc(Enum245.SOUTHEAST));

      if (OutOfBounds(sEndGridNo, sNewGridNo)) {
        return;
      }

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.SOUTHEAST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;

      sTempGridNo = NewGridNo(sNewGridNo, DirectionInc(Enum245.SOUTHEAST));

      if (OutOfBounds(sNewGridNo, sTempGridNo)) {
        return;
      }
      sNewGridNo = sTempGridNo;

      pSoldier.value.usPathingData[pSoldier.value.usPathDataSize] = Enum245.SOUTHEAST;
      pSoldier.value.usPathDataSize++;
      pSoldier.value.sFinalDestination = sNewGridNo;
      pSoldier.value.usActionData = sNewGridNo;
      break;
  }
}

function PickGridNoToWalkIn(pSoldier: Pointer<SOLDIERTYPE>, ubInsertionDirection: UINT8, puiNumAttempts: Pointer<UINT32>): INT16 {
  let sGridNo: INT16;
  let sStartGridNo: INT16;
  let sOldGridNo: INT16;
  let bOdd: INT8 = 1;
  let bOdd2: INT8 = 1;
  let bAdjustedDist: UINT8 = 0;
  let cnt: UINT32;

  puiNumAttempts.value = 0;

  switch (ubInsertionDirection) {
    // OK, we're given a direction on visible map, let's look for the first oone
    // we find that is just on the start of visible map...
    case Enum175.INSERTION_CODE_WEST:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the left!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo += WORLD_COLS;
        } else {
          sGridNo--;
        }

        bOdd = (!bOdd);
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      while (puiNumAttempts.value < MAX_ATTEMPTS) {
        (puiNumAttempts.value)++;
        // OK, here we go back one, check for OK destination...
        if ((gTacticalStatus.uiFlags & IGNORE_ALL_OBSTACLES) || (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE))) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate up/down )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS - 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS + 1);
          }
        }

        bOdd2 = (!bOdd2);
      }
      return NOWHERE;

    case Enum175.INSERTION_CODE_EAST:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the right!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo -= WORLD_COLS;
        } else {
          sGridNo++;
        }

        bOdd = (!bOdd);
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      while (puiNumAttempts.value < MAX_ATTEMPTS) {
        (puiNumAttempts.value)++;
        // OK, here we go back one, check for OK destination...
        if ((gTacticalStatus.uiFlags & IGNORE_ALL_OBSTACLES) || (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE))) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate up/down )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS - 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS + 1);
          }
        }

        bOdd2 = (!bOdd2);
      }
      return NOWHERE;

    case Enum175.INSERTION_CODE_NORTH:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the up!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo -= WORLD_COLS;
        } else {
          sGridNo--;
        }

        bOdd = (!bOdd);
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      while (puiNumAttempts.value < MAX_ATTEMPTS) {
        (puiNumAttempts.value)++;
        // OK, here we go back one, check for OK destination...
        if ((gTacticalStatus.uiFlags & IGNORE_ALL_OBSTACLES) || (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE))) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate left/right )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS + 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS - 1);
          }
        }

        bOdd2 = (!bOdd2);
      }
      return NOWHERE;

    case Enum175.INSERTION_CODE_SOUTH:

      sGridNo = pSoldier.value.sGridNo;
      sStartGridNo = pSoldier.value.sGridNo;
      sOldGridNo = pSoldier.value.sGridNo;

      // Move directly to the down!
      while (GridNoOnVisibleWorldTile(sGridNo)) {
        sOldGridNo = sGridNo;

        if (bOdd) {
          sGridNo += WORLD_COLS;
        } else {
          sGridNo++;
        }

        bOdd = (!bOdd);
      }

      sGridNo = sOldGridNo;
      sStartGridNo = sOldGridNo;

      while (puiNumAttempts.value < MAX_ATTEMPTS) {
        (puiNumAttempts.value)++;
        // OK, here we go back one, check for OK destination...
        if ((gTacticalStatus.uiFlags & IGNORE_ALL_OBSTACLES) || (NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel) && FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE))) {
          return sGridNo;
        }

        // If here, try another place!
        // ( alternate left/right )
        if (bOdd2) {
          bAdjustedDist++;

          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo - WORLD_COLS + 1);
          }
        } else {
          sGridNo = sStartGridNo;

          for (cnt = 0; cnt < bAdjustedDist; cnt++) {
            sGridNo = (sGridNo + WORLD_COLS - 1);
          }
        }

        bOdd2 = (!bOdd2);
      }
      return NOWHERE;
  }

  // Unhandled exit
  puiNumAttempts.value = 0;

  return NOWHERE;
}

function GetLoadedSectorString(pString: Pointer<string> /* Pointer<UINT16> */): void {
  if (!gfWorldLoaded) {
    pString = "";
    return;
  }
  if (gbWorldSectorZ) {
    pString = swprintf("%c%d_b%d", gWorldSectorY + 'A' - 1, gWorldSectorX, gbWorldSectorZ);
  } else if (!gbWorldSectorZ) {
    pString = swprintf("%c%d", gWorldSectorY + 'A' - 1, gWorldSectorX);
  }
}

export function HandleSlayDailyEvent(): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // grab slay
  pSoldier = FindSoldierByProfileID(64, true);

  if (pSoldier == null) {
    return;
  }

  // valid soldier?
  if ((pSoldier.value.bActive == false) || (pSoldier.value.bLife == 0) || (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW)) {
    // no
    return;
  }

  // ATE: This function is used to check for the ultimate last day SLAY can stay for
  // he may decide to leave randomly while asleep...
  // if the user hasnt renewed yet, and is still leaving today
  if ((pSoldier.value.iEndofContractTime / 1440) <= GetWorldDay()) {
    pSoldier.value.ubLeaveHistoryCode = Enum83.HISTORY_SLAY_MYSTERIOUSLY_LEFT;
    TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING_NO_ASK_EQUIP, 0, 0);
  }
}

export function IsSectorDesert(sSectorX: INT16, sSectorY: INT16): boolean {
  if (SectorInfo[SECTOR(sSectorX, sSectorY)].ubTraversability[Enum186.THROUGH_STRATEGIC_MOVE] == Enum127.SAND) {
    // desert
    return true;
  } else {
    return false;
  }
}

function HandleDefiniteUnloadingOfWorld(ubUnloadCode: UINT8): boolean {
  let i: INT32;

  // clear tactical queue
  ClearEventQueue();

  // ATE: End all bullets....
  DeleteAllBullets();

  // End all physics objects...
  RemoveAllPhysicsObjects();

  RemoveAllActiveTimedBombs();

  // handle any quest stuff here so world items can be affected
  HandleQuestCodeOnSectorExit(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // if we arent loading a saved game
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Clear any potential battle flags.  They will be set if necessary.
    gTacticalStatus.fEnemyInSector = false;
    gTacticalStatus.uiFlags &= ~INCOMBAT;
  }

  if (ubUnloadCode == Enum176.ABOUT_TO_LOAD_NEW_MAP) {
    // if we arent loading a saved game
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      // Save the current sectors Item list to a temporary file, if its not the first time in
      SaveCurrentSectorsInformationToTempItemFile();

      // Update any mercs currently in sector, their profile info...
      UpdateSoldierPointerDataIntoProfile(false);
    }
  } else if (ubUnloadCode == Enum176.ABOUT_TO_TRASH_WORLD) {
    // Save the current sectors open temp files to the disk
    if (!SaveCurrentSectorsInformationToTempItemFile()) {
      ScreenMsg(FONT_MCOLOR_WHITE, MSG_TESTVERSION, "ERROR in SaveCurrentSectorsInformationToTempItemFile()");
      return false;
    }

    // Setup the tactical existance of the current soldier.
    //@@@Evaluate
    for (i = gTacticalStatus.Team[CIV_TEAM].bFirstID; i <= gTacticalStatus.Team[CIV_TEAM].bLastID; i++) {
      if (MercPtrs[i].value.bActive && MercPtrs[i].value.bInSector) {
        SetupProfileInsertionDataForSoldier(MercPtrs[i]);
      }
    }

    gfBlitBattleSectorLocator = false;
  }

  // Handle cases for both types of unloading
  HandleMilitiaStatusInCurrentMapBeforeLoadingNewMap();
  return true;
}

export function HandlePotentialBringUpAutoresolveToFinishBattle(): boolean {
  let i: INT32;

  // We don't have mercs in the sector.  Now, we check to see if there are BOTH enemies and militia.  If both
  // co-exist in the sector, then make them fight for control of the sector via autoresolve.
  for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife) {
      if (MercPtrs[i].value.sSectorX == gWorldSectorX && MercPtrs[i].value.sSectorY == gWorldSectorY && MercPtrs[i].value.bSectorZ == gbWorldSectorZ) {
        // We have enemies, now look for militia!
        for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
          if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && MercPtrs[i].value.bSide == OUR_TEAM) {
            if (MercPtrs[i].value.sSectorX == gWorldSectorX && MercPtrs[i].value.sSectorY == gWorldSectorY && MercPtrs[i].value.bSectorZ == gbWorldSectorZ) {
              // We have militia and enemies and no mercs!  Let's finish this battle in autoresolve.
              gfEnteringMapScreen = true;
              gfEnteringMapScreenToEnterPreBattleInterface = true;
              gfAutomaticallyStartAutoResolve = true;
              gfUsePersistantPBI = false;
              gubPBSectorX = gWorldSectorX;
              gubPBSectorY = gWorldSectorY;
              gubPBSectorZ = gbWorldSectorZ;
              gfBlitBattleSectorLocator = true;
              gfTransferTacticalOppositionToAutoResolve = true;
              if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
                gubEnemyEncounterCode = Enum164.ENEMY_INVASION_CODE; // has to be, if militia are here.
              } else {
                // DoScreenIndependantMessageBox( gzLateLocalizedString[ 39 ], MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback );
              }

              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

export function CheckAndHandleUnloadingOfCurrentWorld(): boolean {
  let i: INT32;
  let sBattleSectorX: INT16;
  let sBattleSectorY: INT16;
  let sBattleSectorZ: INT16;

  // Don't bother checking this if we don't have a world loaded.
  if (!gfWorldLoaded) {
    return false;
  }

  if (gTacticalStatus.fDidGameJustStart && gWorldSectorX == 9 && gWorldSectorY == 1 && !gbWorldSectorZ) {
    return false;
  }

  GetCurrentBattleSectorXYZ(addressof(sBattleSectorX), addressof(sBattleSectorY), addressof(sBattleSectorZ));

  if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN) {
    // The user has decided to let the game autoresolve the current battle.
    if (gWorldSectorX == sBattleSectorX && gWorldSectorY == sBattleSectorY && gbWorldSectorZ == sBattleSectorZ) {
      for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
        // If we have a live and valid soldier
        if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && !MercPtrs[i].value.fBetweenSectors && !(MercPtrs[i].value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(MercPtrs[i]) && !AM_AN_EPC(MercPtrs[i])) {
          if (MercPtrs[i].value.sSectorX == gWorldSectorX && MercPtrs[i].value.sSectorY == gWorldSectorY && MercPtrs[i].value.bSectorZ == gbWorldSectorZ) {
            RemoveSoldierFromGridNo(MercPtrs[i]);
            InitSoldierOppList(MercPtrs[i]);
          }
        }
      }
    }
  } else {
    // Check and see if we have any live mercs in the sector.
    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      // If we have a live and valid soldier
      if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && !MercPtrs[i].value.fBetweenSectors && !(MercPtrs[i].value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(MercPtrs[i]) && !AM_AN_EPC(MercPtrs[i])) {
        if (MercPtrs[i].value.sSectorX == gWorldSectorX && MercPtrs[i].value.sSectorY == gWorldSectorY && MercPtrs[i].value.bSectorZ == gbWorldSectorZ) {
          return false;
        }
      }
    }
    // KM : August 6, 1999 Patch fix
    //     Added logic to prevent a crash when player mercs would retreat from a battle involving militia and enemies.
    //		 Without the return here, it would proceed to trash the world, and then when autoresolve would come up to
    //     finish the tactical battle, it would fail to find the existing soldier information (because it was trashed).
    if (HandlePotentialBringUpAutoresolveToFinishBattle()) {
      return false;
    }
    // end

    // HandlePotentialBringUpAutoresolveToFinishBattle( ); //prior patch logic
  }

  CheckForEndOfCombatMode(false);
  EndTacticalBattleForEnemy();

  // ATE: Change cursor to wait cursor for duration of frame.....
  // save old cursor ID....
  SetCurrentCursorFromDatabase(Enum317.CURSOR_WAIT_NODELAY);
  RefreshScreen(null);

  // JA2Gold: Leaving sector, so get rid of ambients!
  DeleteAllAmbients();

  if (guiCurrentScreen == Enum26.GAME_SCREEN) {
    if (!gfTacticalTraversal) {
      // if we are in tactical and don't intend on going to another sector immediately, then
      gfEnteringMapScreen = true;
    } else {
      // The trashing of the world will be handled automatically.
      return false;
    }
  }

  // We have passed all the checks and can Trash the world.
  if (!HandleDefiniteUnloadingOfWorld(Enum176.ABOUT_TO_TRASH_WORLD)) {
    return false;
  }

  if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN) {
    if (gWorldSectorX == sBattleSectorX && gWorldSectorY == sBattleSectorY && gbWorldSectorZ == sBattleSectorZ) {
      // Yes, this is and looks like a hack.  The conditions of this if statement doesn't work inside
      // TrashWorld() or more specifically, TacticalRemoveSoldier() from within TrashWorld().  Because
      // we are in the autoresolve screen, soldiers are internally created different (from pointers instead of
      // the MercPtrs[]).  It keys on the fact that we are in the autoresolve screen.  So, by switching the
      // screen, it'll delete the soldiers in the loaded world properly, then later on, once autoresolve is
      // complete, it'll delete the autoresolve soldiers properly.  As you can now see, the above if conditions
      // don't change throughout this whole process which makes it necessary to do it this way.
      guiCurrentScreen = Enum26.MAP_SCREEN;
      TrashWorld();
      guiCurrentScreen = Enum26.AUTORESOLVE_SCREEN;
    }
  } else {
    TrashWorld();
  }

  // Clear all combat related flags.
  gTacticalStatus.fEnemyInSector = false;
  gTacticalStatus.uiFlags &= ~INCOMBAT;
  EndTopMessage();

  // Clear the world sector values.
  gWorldSectorX = gWorldSectorY = 0;
  gbWorldSectorZ = -1;

  // Clear the flags regarding.
  gfCaves = false;
  gfBasement = false;

  return true;
}

// This is called just before the world is unloaded to preserve location information for RPCs and NPCs either in
// the sector or strategically in the sector (such as firing an NPC in a sector that isn't yet loaded.)  When loading that
// sector, the RPC would be added.
//@@@Evaluate
export function SetupProfileInsertionDataForSoldier(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (!pSoldier || pSoldier.value.ubProfile == NO_PROFILE) {
    // Doesn't have profile information.
    return;
  }

  if (gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE)
  // if ( gMercProfiles[ pSoldier->ubProfile ].ubStrategicInsertionCode == INSERTION_CODE_PERMANENT_GRIDNO )
  {
    // can't be changed!
    return;
  }

  if (gfWorldLoaded && pSoldier.value.bActive && pSoldier.value.bInSector) {
    // This soldier is currently in the sector

    //@@@Evaluate -- insert code here
    // SAMPLE CODE:  There are multiple situations that I didn't code.  The gridno should be the final destination
    // or reset???

    if (pSoldier.value.ubQuoteRecord && pSoldier.value.ubQuoteActionID) {
      // if moving to traverse
      if (pSoldier.value.ubQuoteActionID >= Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST && pSoldier.value.ubQuoteActionID <= Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH) {
        // Handle traversal.  This NPC's sector will NOT already be set correctly, so we have to call for that too
        HandleNPCChangesForTacticalTraversal(pSoldier);
        gMercProfiles[pSoldier.value.ubProfile].fUseProfileInsertionInfo = false;
        if (pSoldier.value.ubProfile != NO_PROFILE && NPCHasUnusedRecordWithGivenApproach(pSoldier.value.ubProfile, Enum296.APPROACH_DONE_TRAVERSAL)) {
          gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 |= PROFILE_MISC_FLAG3_HANDLE_DONE_TRAVERSAL;
        }
      } else {
        if (pSoldier.value.sFinalDestination == pSoldier.value.sGridNo) {
          gMercProfiles[pSoldier.value.ubProfile].usStrategicInsertionData = pSoldier.value.sGridNo;
        } else if (pSoldier.value.sAbsoluteFinalDestination != NOWHERE) {
          gMercProfiles[pSoldier.value.ubProfile].usStrategicInsertionData = pSoldier.value.sAbsoluteFinalDestination;
        } else {
          gMercProfiles[pSoldier.value.ubProfile].usStrategicInsertionData = pSoldier.value.sFinalDestination;
        }

        gMercProfiles[pSoldier.value.ubProfile].fUseProfileInsertionInfo = true;
        gMercProfiles[pSoldier.value.ubProfile].ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        gMercProfiles[pSoldier.value.ubProfile].ubQuoteActionID = pSoldier.value.ubQuoteActionID;
        gMercProfiles[pSoldier.value.ubProfile].ubQuoteRecord = pSoldier.value.ubQuoteActionID;
      }
    } else {
      gMercProfiles[pSoldier.value.ubProfile].fUseProfileInsertionInfo = false;
    }
  } else {
    // use strategic information

    // It appears to set the soldier's strategic insertion code everytime a group arrives in a new sector.  The insertion data
    // isn't needed for these cases as the code is a direction only.
    gMercProfiles[pSoldier.value.ubProfile].ubStrategicInsertionCode = pSoldier.value.ubStrategicInsertionCode;
    gMercProfiles[pSoldier.value.ubProfile].usStrategicInsertionData = 0;

    // Strategic system should now work.
    gMercProfiles[pSoldier.value.ubProfile].fUseProfileInsertionInfo = true;
  }
}

function HandlePotentialMoraleHitForSkimmingSectors(pGroup: Pointer<GROUP>): void {
  let pPlayer: Pointer<PLAYERGROUP>;

  if (!gTacticalStatus.fHasEnteredCombatModeSinceEntering && gTacticalStatus.fEnemyInSector) {
    // Flag is set so if "wilderness" enemies are in the adjacent sector of this group, the group has
    // a 90% chance of ambush.  Because this typically doesn't happen very often, the chance is high.
    // This reflects the enemies radioing ahead to other enemies of the group's arrival, so they have
    // time to setup a good ambush!
    pGroup.value.uiFlags |= GROUPFLAG_HIGH_POTENTIAL_FOR_AMBUSH;

    pPlayer = pGroup.value.pPlayerList;

    while (pPlayer) {
      // Do morale hit...
      // CC look here!
      // pPlayer->pSoldier

      pPlayer = pPlayer.value.next;
    }
  }
}

}
