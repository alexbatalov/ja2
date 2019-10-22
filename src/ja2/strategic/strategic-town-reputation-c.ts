// init for town reputation at game start
const INITIAL_TOWN_REPUTATION = 0;

// the max and min town opinion of an individual merc can be
const MAX_TOWN_OPINION = 50;
const MIN_TOWN_OPINION = -50;

// town reputation is currently updated 4x per day: at 9am, noon, 3pm, and 6pm

// the number of events per day
const TOWN_OPINION_NUMBER_OF_PERIODS = 4;

// the start time after midnight that first town reputation event takes place .. in minutes
const TOWN_OPINION_START_TIME = (9 * 60);

// how often the town opinion events occur...right now every 3 hours
const TOWN_OPINION_PERIOD = (3 * 60);

function InitializeProfilesForTownReputation(): void {
  let uiProfileId: UINT32 = 0;

  // initialize the town opinion values in each recruitable merc's profile structure
  for (uiProfileId = 0; uiProfileId < FIRST_NPC; uiProfileId++) {
    memset(addressof(gMercProfiles[uiProfileId].bMercTownReputation), INITIAL_TOWN_REPUTATION, sizeof(gMercProfiles[uiProfileId].bMercTownReputation));
  }
}

function PostEventsForSpreadOfTownOpinion(): void {
  /* ARM - Do nothing, this system has been scrapped because it is so marginal and it's too late to bother with it now

          INT32 iCounter = 0;
          // called every day at 3am to set up daily events to handle spreading of town opinion about mercs
          for( iCounter = 0; iCounter < TOWN_OPINION_NUMBER_OF_PERIODS; iCounter++ )
          {
                  AddStrategicEvent( EVENT_HANDLE_TOWN_OPINION, GetWorldDayInMinutes() + TOWN_OPINION_START_TIME + iCounter * TOWN_OPINION_PERIOD, 0 );
          }
  */
}

function GetTownOpinionOfMerc(ubProfileId: UINT8, ubTownId: UINT8): UINT8 {
  Assert(ubProfileId < FIRST_NPC);
  Assert(ubTownId < NUM_TOWNS);

  // return amount
  return gMercProfiles[ubProfileId].bMercTownReputation[ubTownId];
}

function GetTownOpinionOfMercForSoldier(pSoldier: Pointer<SOLDIERTYPE>, ubTownId: UINT8): UINT8 {
  // error check
  if (pSoldier == NULL) {
    return 0;
  }

  Assert(ubTownId < NUM_TOWNS);

  // pass on to
  return GetTownOpinionOfMerc(pSoldier.value.ubProfile, ubTownId);
}

function UpdateTownOpinionOfThisMerc(ubProfileId: UINT8, ubTownId: UINT8, bAmount: INT8): void {
  Assert(ubProfileId < FIRST_NPC);
  Assert(ubTownId < NUM_TOWNS);

  // check if opinion would be affected too greatly
  if (gMercProfiles[ubProfileId].bMercTownReputation[ubTownId] + bAmount > MAX_TOWN_OPINION) {
    // maximize
    gMercProfiles[ubProfileId].bMercTownReputation[ubTownId] = MAX_TOWN_OPINION;
  } else if (gMercProfiles[ubProfileId].bMercTownReputation[ubTownId] + bAmount < MIN_TOWN_OPINION) {
    // minimize
    gMercProfiles[ubProfileId].bMercTownReputation[ubTownId] = MIN_TOWN_OPINION;
  } else {
    // update amount
    gMercProfiles[ubProfileId].bMercTownReputation[ubTownId] += bAmount;
  }
}

function UpdateTownOpinionOfThisMercForSoldier(pSoldier: Pointer<SOLDIERTYPE>, ubTownId: UINT8, bAmount: INT8): void {
  // error check
  if (pSoldier == NULL) {
    return;
  }

  Assert(ubTownId < NUM_TOWNS);

  // pass this on to the profile based function
  UpdateTownOpinionOfThisMerc(pSoldier.value.ubProfile, ubTownId, bAmount);
}

function HandleSpreadOfAllTownsOpinion(): void {
  let ubProfileId: UINT8;

  // debug message
  ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "%s - Spreading town opinions about mercs", WORLDTIMESTR);

  // run though all player-recruitable profiles and update towns opinion of mercs
  for (ubProfileId = 0; ubProfileId < FIRST_NPC; ubProfileId++) {
    HandleSpreadOfTownOpinionForMerc(ubProfileId);
  }
}

function HandleSpreadOfTownOpinionForMerc(ubProfileId: UINT8): void {
  // handle opinion spread for this grunt
  let iDistanceBetweenTowns: INT32;
  let iCounterA: INT8;
  let iCounterB: INT8;
  let bOpinionOfTownA: INT8;
  let bOpinionOfTownB: INT8;

  Assert(ubProfileId < FIRST_NPC);

  for (iCounterA = FIRST_TOWN; iCounterA < NUM_TOWNS; iCounterA++) {
    for (iCounterB = iCounterA; iCounterB < NUM_TOWNS; iCounterB++) {
      if (iCounterA != iCounterB) {
        bOpinionOfTownA = GetTownOpinionOfMerc(ubProfileId, iCounterA);
        bOpinionOfTownB = GetTownOpinionOfMerc(ubProfileId, iCounterB);

        iDistanceBetweenTowns = GetTownDistances(iCounterA, iCounterB);

        // spread opinion between towns
        HandleOpinionOfTownsAboutSoldier(bOpinionOfTownA, bOpinionOfTownB, iDistanceBetweenTowns, ubProfileId);
      }
    }
  }
}

function HandleOpinionOfTownsAboutSoldier(bTownA: INT8, bTownB: INT8, iDistanceBetweenThem: INT32, ubProfile: UINT8): void {
  // ARM: System has been scrapped
}

/*
void HandleSpreadOfTownOpinionForMercForSoldier( SOLDIERTYPE *pSoldier )
{
        // error check
        if( pSoldier == NULL )
        {
                return;
        }

        // let the profile based one do the handling
        HandleSpreadOfTownOpinionForMerc( pSoldier->ubProfile );
}


void HandleSpreadOfTownsOpinionForCurrentMercs( void )
{
        INT32 iCounter = 0, iNumberOnPlayersTeam = 0;

        // get the number on players team
        iNumberOnPlayersTeam = gTacticalStatus.Team[ OUR_TEAM ].bLastID;

        // run through all mercs on players current team
        for(iCounter = 0; iCounter < iNumberOnPlayersTeam; iCounter++ )
        {
                HandleSpreadOfTownOpinionForMercForSoldier( MercPtrs[ iCounter ] );
        }

        return;
}
*/
