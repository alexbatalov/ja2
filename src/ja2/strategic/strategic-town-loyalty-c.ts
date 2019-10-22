// the max loyalty rating for any given town
const MAX_LOYALTY_VALUE = 100;

// loyalty Omerta drops to and maxes out at if the player betrays the rebels
const HOSTILE_OMERTA_LOYALTY_RATING = 10;

// the loyalty threshold below which theft of unsupervised items in a town sector can occur
const THRESHOLD_FOR_TOWN_THEFT = 50;

const LOYALTY_EVENT_DISTANCE_THRESHOLD = 3; // in sectors

// effect of unintentional killing /100 vs intentional murder
const REDUCTION_FOR_UNINTENTIONAL_KILLING = 50;
// the effect of a murder by rebel / 100 vs player murdering a civ
const REDUCTION_FOR_MURDER_BY_REBEL = 70;
// reduction % for being falsely blamed for a murder we didn't do, out of 100
const REDUCTION_FOR_MURDER_NOT_OUR_FAULT = 50;
// reduction % if enemies kills civs in our sector / 100
const REDUCTION_FOR_MURDER_OF_INNOCENT_BY_ENEMY_IN_OUR_SECTOR = 25;
// how much worse loyalty hit is for trauma of someone killed by a monster
const MULTIPLIER_FOR_MURDER_BY_MONSTER = 2;

// gain for hiring an NPC from a particular town (represents max. at 100% town attachment)
const MULTIPLIER_LOCAL_RPC_HIRED = 25; // 5%

// multiplier for causing pts of damage directly done to a building
const MULTIPLIER_FOR_DAMAGING_A_BUILDING = 10; // 50 pts = 1%
// multiplier for not preventing pts of damage to a building
const MULTIPLIER_FOR_NOT_PREVENTING_BUILDING_DAMAGE = 3; // 167 pts = 1%

// divisor for dmg to a building by allied rebel
const DIVISOR_FOR_REBEL_BUILDING_DMG = 2;

/*
// max number of soldiers counted towards town loyalty gain
#define MAX_SOLDIER_COUNT_FOR_IN_TOWN_LOYALTY_GAIN 6
// max levels of town militia civs counted towards town loyalty gain
#define MAX_MILITIA_VALUE_FOR_IN_TOWN_LOYALTY_GAIN	18
// max # occupying enemy ranks that count for loyalty penalty
#define MAX_ENEMY_SOLDIER_RANKS_FOR_IN_TOWN_LOYALTY_DROP 15
// number of ranks counted per regular
#define NUMBER_OF_RANKS_PER_REGULAR 2
// number of ranks counted per elite
#define NUMBER_OF_RANKS_PER_ELITE 4

// THESE VALUES ARE ALL AFFECTED BY CHANGES to "GAIN_PTS_PER_LOYALTY_PT", SO BEWARE IF THAT SHOULD CHANGE
//
// max. rate of loyalty gain for local RPC being stationed in his home town
#define HOURLY_GAIN_FOR_LOCAL_NPC_IN_TOWN 20	// roughly 1.00% / day max.
// number of gain pts per merc in town
#define HOURLY_GAIN_PER_MERC_IN_TOWN 5				// roughly 0.25% / day
// number of gain pts per friendly in town
#define HOURLY_GAIN_PER_MILITIA_IN_TOWN 1			// roughly 0.05% / day
// loyalty loss for enemies in town
#define HOURLY_DROP_PER_ENEMY_RANK_IN_TOWN 2	// roughly 0.10% / day
*/
//
// THESE VALUES ARE ALL AFFECTED BY CHANGES to "GAIN_PTS_PER_LOYALTY_PT", SO BEWARE IF THAT SHOULD CHANGE

/* Delayed loyalty effects elimininated.  Sep.12/98.  ARM

// macros for delayed town loyalty events
// get increment
#define GET_TOWN_INCREMENT( iValue ) ( ( uiValue << 31 ) >> 31 )
// town id
#define GET_TOWN_ID_FOR_LOYALTY( iValue ) ( uiValue >> 24 )
// the amount
#define GET_TOWN_LOYALTY_CHANGE( iValue ) ( ( uiValue << 8 ) >> 9 )
*/

// town loyalty table
let gTownLoyalty: TOWN_LOYALTY[] /* [NUM_TOWNS] */;

// town name and locations arrays, for town theft and what not
let pTownNamesList: INT32[] /* [40] */;
let pTownLocationsList: INT32[] /* [40] */;

let iTownDistances: INT32[][] /* [NUM_TOWNS][NUM_TOWNS] */;

const BASIC_COST_FOR_CIV_MURDER = (10 * GAIN_PTS_PER_LOYALTY_PT);

let uiPercentLoyaltyDecreaseForCivMurder: UINT32[] /* [] */ = [
  // These get multiplied by GAIN_PTS_PER_LOYALTY_PT so they're in % of loyalty decrease (for an average town)
  (5 * GAIN_PTS_PER_LOYALTY_PT), // fat civ
  (7 * GAIN_PTS_PER_LOYALTY_PT), // man civ
  (8 * GAIN_PTS_PER_LOYALTY_PT), // min civ
  (10 * GAIN_PTS_PER_LOYALTY_PT), // dress (woman)
  (20 * GAIN_PTS_PER_LOYALTY_PT), // hat kid
  (20 * GAIN_PTS_PER_LOYALTY_PT), // kid
  (20 * GAIN_PTS_PER_LOYALTY_PT), // cripple
  (1 * GAIN_PTS_PER_LOYALTY_PT), // cow
];

// on a scale of 1-100, this is a measure of how much each town hates the Queen's opression & is willing to stand against it
// it primarily controls the RATE of loyalty change in each town: the loyalty effect of the same events depends on it
let gubTownRebelSentiment: UINT8[] /* [NUM_TOWNS] */ = [
  0, // not a town - blank sector index
  90, // OMERTA,	- They ARE the rebels!!!
  30, // DRASSEN,	- Rebel friendly, makes it pretty easy to get first mine's income going at the start
  12, // ALMA			- Military town, high loyalty to Queen, need quests to get 100%
  15, // GRUMM,		- Close to Meduna, strong influence
  20, // TIXA,		- Not a real town
  15, // CAMBRIA, - Artificially much lower 'cause it's big and central and too easy to get loyalty up there
  20, // SAN_MONA,- Neutral ground, loyalty doesn't vary
  20, // ESTONI,	- Not a real town
  20, // ORTA,		- Not a real town
  12, // BALIME,	- Rich town, high loyalty to Queen
  10, // MEDUNA,	- Enemy HQ, for God's sake!
  35, // CHITZENA, - Artificially high 'cause there's not enough fights near it to get the loyalty up otherwise
];

let gfTownUsesLoyalty: BOOLEAN[] /* [NUM_TOWNS] */ = [
  FALSE, // not a town - blank sector index
  TRUE, // OMERTA
  TRUE, // DRASSEN
  TRUE, // ALMA
  TRUE, // GRUMM
  FALSE, // TIXA
  TRUE, // CAMBRIA
  FALSE, // SAN_MONA
  FALSE, // ESTONI
  FALSE, // ORTA
  TRUE, // BALIME
  TRUE, // MEDUNA
  TRUE, // CHITZENA
];

// location of first enocunter with enemy
let sWorldSectorLocationOfFirstBattle: INT16 = 0;

/* ARM: Civilian theft of items was removed
// handle theft by civi in a town sector
void HandleTheftByCiviliansInSector( INT16 sX, INT16 sY, INT32 iLoyalty );

// handle theft in all towns
void HandleTownTheft( void );
*/

function InitTownLoyalty(): void {
  let ubTown: UINT8 = 0;

  // set up town loyalty table
  for (ubTown = FIRST_TOWN; ubTown < NUM_TOWNS; ubTown++) {
    gTownLoyalty[ubTown].ubRating = 0;
    gTownLoyalty[ubTown].sChange = 0;
    gTownLoyalty[ubTown].fStarted = FALSE;
    //		gTownLoyalty[ ubTown ].ubRebelSentiment = gubTownRebelSentiment[ ubTown ];
    gTownLoyalty[ubTown].fLiberatedAlready = FALSE;
  }

  return;
}

function StartTownLoyaltyIfFirstTime(bTownId: INT8): void {
  Assert((bTownId >= FIRST_TOWN) && (bTownId < NUM_TOWNS));

  // if loyalty tracking hasn't yet been started for this town, and the town does use loyalty
  if (!gTownLoyalty[bTownId].fStarted && gfTownUsesLoyalty[bTownId]) {
    // set starting town loyalty now, equally to that town's current rebel sentiment - not all towns begin equally loyal
    gTownLoyalty[bTownId].ubRating = gubTownRebelSentiment[bTownId];

    // if player hasn't made contact with Miguel yet, or the rebels hate the player
    if (!CheckFact(FACT_MIGUEL_READ_LETTER, 0) || CheckFact(FACT_REBELS_HATE_PLAYER, 0)) {
      // if town is Omerta
      if (bTownId == OMERTA) {
        // start loyalty there at 0, since rebels distrust the player until Miguel receives the letter
        gTownLoyalty[bTownId].ubRating = 0;
      } else {
        // starting loyalty is halved - locals not sure what to make of the player's presence
        gTownLoyalty[bTownId].ubRating /= 2;
      }
    }

    gTownLoyalty[bTownId].sChange = 0;

    // remember we've started
    gTownLoyalty[bTownId].fStarted = TRUE;
  }
}

// set a specified town's loyalty rating (ignores previous loyalty value - probably NOT what you want)
function SetTownLoyalty(bTownId: INT8, ubNewLoyaltyRating: UINT8): void {
  Assert((bTownId >= FIRST_TOWN) && (bTownId < NUM_TOWNS));

  // if the town does use loyalty
  if (gfTownUsesLoyalty[bTownId]) {
    gTownLoyalty[bTownId].ubRating = ubNewLoyaltyRating;
    gTownLoyalty[bTownId].sChange = 0;

    // this is just like starting the loyalty if it happens first
    gTownLoyalty[bTownId].fStarted = TRUE;
  }

  return;
}

// increments the town's loyalty rating by that many HUNDREDTHS of loyalty pts
function IncrementTownLoyalty(bTownId: INT8, uiLoyaltyIncrease: UINT32): void {
  let uiRemainingIncrement: UINT32;
  let sThisIncrement: INT16;

  Assert((bTownId >= FIRST_TOWN) && (bTownId < NUM_TOWNS));

  // doesn't affect towns where player hasn't established a "presence" yet
  if (!gTownLoyalty[bTownId].fStarted) {
    return;
  }

  // modify loyalty change by town's individual attitude toward rebelling (20 is typical)
  uiLoyaltyIncrease *= (5 * gubTownRebelSentiment[bTownId]);
  uiLoyaltyIncrease /= 100;

  // this whole thing is a hack to avoid rolling over the -32 to 32k range on the sChange value
  // only do a maximum of 10000 pts at a time...
  uiRemainingIncrement = uiLoyaltyIncrease;
  while (uiRemainingIncrement) {
    sThisIncrement = min(uiRemainingIncrement, 10000);

    // up the gain value
    gTownLoyalty[bTownId].sChange += sThisIncrement;
    // update town value now
    UpdateTownLoyaltyRating(bTownId);

    uiRemainingIncrement -= sThisIncrement;
  }

  return;
}

// decrements the town's loyalty rating by that many HUNDREDTHS of loyalty pts
// NOTE: This function expects a POSITIVE number for a decrease!!!
function DecrementTownLoyalty(bTownId: INT8, uiLoyaltyDecrease: UINT32): void {
  let uiRemainingDecrement: UINT32;
  let sThisDecrement: INT16;

  Assert((bTownId >= FIRST_TOWN) && (bTownId < NUM_TOWNS));

  // doesn't affect towns where player hasn't established a "presence" yet
  if (!gTownLoyalty[bTownId].fStarted) {
    return;
  }

  // modify loyalty change by town's individual attitude toward rebelling (20 is typical)
  uiLoyaltyDecrease *= 100;
  uiLoyaltyDecrease /= (5 * gubTownRebelSentiment[bTownId]);

  // this whole thing is a hack to avoid rolling over the -32 to 32k range on the sChange value
  // only do a maximum of 10000 pts at a time...
  uiRemainingDecrement = uiLoyaltyDecrease;
  while (uiRemainingDecrement) {
    sThisDecrement = min(uiRemainingDecrement, 10000);

    // down the gain value
    gTownLoyalty[bTownId].sChange -= sThisDecrement;
    // update town value now
    UpdateTownLoyaltyRating(bTownId);

    uiRemainingDecrement -= sThisDecrement;
  }

  return;
}

// update town loyalty rating based on gain values
function UpdateTownLoyaltyRating(bTownId: INT8): void {
  // check gain value and update loyaty
  let ubOldLoyaltyRating: UINT8 = 0;
  let sRatingChange: INT16 = 0;
  let ubMaxLoyalty: UINT8 = 0;

  Assert((bTownId >= FIRST_TOWN) && (bTownId < NUM_TOWNS));

  // remember previous loyalty value
  ubOldLoyaltyRating = gTownLoyalty[bTownId].ubRating;

  sRatingChange = gTownLoyalty[bTownId].sChange / GAIN_PTS_PER_LOYALTY_PT;

  // if loyalty is ready to increase
  if (sRatingChange > 0) {
    // if the town is Omerta, and the rebels are/will become hostile
    if ((bTownId == OMERTA) && (gTacticalStatus.fCivGroupHostile[REBEL_CIV_GROUP] != CIV_GROUP_NEUTRAL)) {
      // maximum loyalty is much less than normal
      ubMaxLoyalty = HOSTILE_OMERTA_LOYALTY_RATING;
    } else {
      ubMaxLoyalty = MAX_LOYALTY_VALUE;
    }

    // check if we'd be going over the max
    if ((gTownLoyalty[bTownId].ubRating + sRatingChange) >= ubMaxLoyalty) {
      // set to max and null out gain pts
      gTownLoyalty[bTownId].ubRating = ubMaxLoyalty;
      gTownLoyalty[bTownId].sChange = 0;
    } else {
      // increment loyalty rating, reduce sChange
      gTownLoyalty[bTownId].ubRating += sRatingChange;
      gTownLoyalty[bTownId].sChange %= GAIN_PTS_PER_LOYALTY_PT;
    }
  } else
      // if loyalty is ready to decrease
      if (sRatingChange < 0) {
    // check if we'd be going below zero
    if ((gTownLoyalty[bTownId].ubRating + sRatingChange) < 0) {
      // set to zero and null out gain pts
      gTownLoyalty[bTownId].ubRating = 0;
      gTownLoyalty[bTownId].sChange = 0;
    } else {
      // decrement loyalty rating, reduce sChange
      gTownLoyalty[bTownId].ubRating += sRatingChange;
      gTownLoyalty[bTownId].sChange %= GAIN_PTS_PER_LOYALTY_PT;
    }
  }

  // check old aginst new, if diff, dirty map panel
  if (ubOldLoyaltyRating != gTownLoyalty[bTownId].ubRating) {
    fMapPanelDirty = TRUE;
  }

  return;
}

// strategic handler, goes through and handles all strategic events for town loyalty updates...player controlled, monsters
function HandleTownLoyalty(): void {
  let bTownId: INT8 = 0;

  /* ARM: removed to experiment with keeping loyalty from drifing without any direct causes from the player
          for( bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++ )
          {
                  // update loyalty of controlled/uncontrolled towns
                  UpdateLoyaltyBasedOnControl( bTownId );

                  // update based on number of good guys in sector
                  UpdateTownLoyaltyBasedOnFriendliesInTown( bTownId );

                  // update bad on number of badies in sector
                  UpdateTownLoyaltyBasedOnBadGuysInTown( bTownId );

                  // finally update town loyalty
                  UpdateTownLoyaltyRating( bTownId );
          }
  */

  // now all loyalty is done, handle other stuff

  /* ARM: Civilian theft of items was removed
          // only check for theft every 12 hours, otherwise it's way too slow
          if ( (GetWorldHour() % 12) == 0)
          {
                  HandleTownTheft( );
          }
  */

  return;
}

/*
// update of town loyalty based on if the player controls the town's sectors
void UpdateLoyaltyBasedOnControl( INT8 bTownId )
{
        // compare current loyalty to percent of sectors controlled, adjust in that direction
        INT32 iUnderControl = 0;

        Assert( ( bTownId >= FIRST_TOWN ) && ( bTownId < NUM_TOWNS ) );

        // find how much of town is under control
        iUnderControl = GetTownSectorsUnderControl( bTownId );
        iUnderControl *= 100;
        iUnderControl /= GetTownSectorSize( bTownId );

        // the gain value will be the difference in iUnderControl and the current Loyalty rating / hours_per_day
        if( gTownLoyalty[ bTownId ].ubRating < ( UINT8 ) iUnderControl )
        {
                // we control more of the town, start moving to more loyal
                IncrementTownLoyalty( bTownId, ( iUnderControl - gTownLoyalty[ bTownId ].ubRating) );
        }
        else
        {
                // mere lack of sector control never reduces loyalty below the town's current rebel sentiment
                if (gTownLoyalty[ bTownId ].ubRating > gubTownRebelSentiment[ bTownId ])
                {
                        // we control less of the town, decrement gain
                        DecrementTownLoyalty( bTownId, gTownLoyalty[ bTownId ].ubRating - iUnderControl );
                }
        }

        return;
}


// updates the loyalty of the town in a sector based on number of friendly troops in that sector ...to a point, after max number to
void UpdateTownLoyaltyBasedOnFriendliesInTown( INT8 bTownId )
{
        // check if valid town
        INT32 iUnderControl = 0;
        SOLDIERTYPE *pSoldier;
        INT32 iCounter = 0;
        INT32 iSoldierCount = 0;
        INT32 iLocalNPCBonus = 0;
        INT32 iMilitiaValue = 0;
        UINT8 ubMilitiaLevel = 0;


        Assert( ( bTownId >= FIRST_TOWN ) && ( bTownId < NUM_TOWNS ) );

        // find how much of town is under control
        iUnderControl = GetTownSectorsUnderControl( bTownId );
        iUnderControl *= 100;
        iUnderControl /= GetTownSectorSize( bTownId );


        // count how many of player's mercs are active in this town, then factor by number of sectors under control

        // run through list of grunts on team
  for (iCounter = gTacticalStatus.Team[ OUR_TEAM ].bFirstID; iCounter <= gTacticalStatus.Team[ OUR_TEAM ].bLastID; iCounter++ )
        {
                pSoldier = MercPtrs[ iCounter ];

                if ( pSoldier->bLife >= OKLIFE && pSoldier->bActive )
                {
                        // if soldier is in this sector
                        if( SectorIsPartOfTown( bTownId, pSoldier->sSectorX, pSoldier->sSectorY ) == TRUE )
                        {
                                // if onduty or in a vehicle
                                if( ( pSoldier->bAssignment < ON_DUTY ) || pSoldier->bAssignment == VEHICLE ) )
                                {
                                        // increment soldier count
                                        iSoldierCount++;
                                }

                                // local influence: if the town is the character's home town
                                if( bTownId == gMercProfiles[ pSoldier->ubProfile ].bTown )
                                {
                                        // he needn't be soldiering to have an impact...  presence is enough
                                        if( pSoldier->bAssignment < ASSIGNMENT_DEAD )
                                        {
                                                iLocalNPCBonus = HOURLY_GAIN_FOR_LOCAL_NPC_IN_TOWN;
                                                iLocalNPCBonus *= gMercProfiles[ pSoldier->ubProfile ].bTownAttachment;
                                                iLocalNPCBonus /= 100;

                                                // adjust for % town control
                                                iLocalNPCBonus *= iUnderControl;
                                                iLocalNPCBonus /= 100;

                                                // do we actually gain from this?
                                                if( iLocalNPCBonus > 0 )
                                                {
                                                        // debug message
                                                        ScreenMsg( MSG_FONT_RED, MSG_DEBUG, L"%s influences loyalty in home town of %s, worth %d", pSoldier->name, pTownNames[ bTownId ], iLocalNPCBonus);

                                                        // increment town loyalty
                                                        IncrementTownLoyalty( bTownId, iLocalNPCBonus );
                                                }
                                        }
                                }
                        }
                }
        }


        // soldier count is limited by a max number
        if( iSoldierCount > MAX_SOLDIER_COUNT_FOR_IN_TOWN_LOYALTY_GAIN )
        {
                iSoldierCount = MAX_SOLDIER_COUNT_FOR_IN_TOWN_LOYALTY_GAIN;
        }

        // adjust for % town control
        iSoldierCount *= iUnderControl;
        iSoldierCount /= 100;

        // add loyalty gain due to mercs
        IncrementTownLoyalty( bTownId, iSoldierCount * HOURLY_GAIN_PER_MERC_IN_TOWN );


        // find out if there are any militia anywhere in this town
        iMilitiaValue = 0;
        for( ubMilitiaLevel = 0; ubMilitiaLevel < MAX_MILITIA_LEVELS; ubMilitiaLevel++ )
        {
                // regulars/elites are worth double/triple normal
                iMilitiaValue += ((ubMilitiaLevel + 1) * GetMilitiaCountAtLevelAnywhereInTown( bTownId, ubMilitiaLevel ));
        }

        // militia count is limited by a max number
        if( iMilitiaValue > MAX_MILITIA_VALUE_FOR_IN_TOWN_LOYALTY_GAIN )
        {
                iMilitiaValue = MAX_MILITIA_VALUE_FOR_IN_TOWN_LOYALTY_GAIN;
        }

        // adjust for % town control
        iMilitiaValue *= iUnderControl;
        iMilitiaValue /= 100;

        // add loyalty gain due to militia
        IncrementTownLoyalty( bTownId, iMilitiaValue * HOURLY_GAIN_PER_MILITIA_IN_TOWN );

        return;
}


void UpdateTownLoyaltyBasedOnBadGuysInTown( INT8 bTownId )
{
        // will update a town's loyalty based on number and type of bad guys in it
        INT32 iTotalEnemies = 0;
        INT16 sSectorX =0, sSectorY = 0;
        UINT8 ubAdmins, ubRegs, ubElites;
        INT32 iUnderControl;

        // find which sectors are this town and look at bad guys in those sectors
        // adjust for number of sectors bad guys control...like the player
        for( sSectorX = 0; sSectorX < MAP_WORLD_X; sSectorX++ )
        {
                for( sSectorY = 0; sSectorY < MAP_WORLD_Y; sSectorY++ )
                {
                        // check if sector belongs to this town and is controlled by bad guys
                        if ( ( SectorIsPartOfTown( bTownId, sSectorX, sSectorY ) == TRUE ) && ( StrategicMap[ sSectorX + sSectorY * MAP_WORLD_X ].fEnemyControlled == TRUE ) )
                        {
                                // controlled by bad guys..adjust numbers for type
                                GetNumberOfEnemiesInSector( sSectorX, sSectorY, &ubAdmins, &ubRegs, &ubElites );

                                // administrators
                                iTotalEnemies += ( INT32 ) ubAdmins;
                                // regulars
                                iTotalEnemies += ( INT32 ) ubRegs * NUMBER_OF_RANKS_PER_REGULAR;
                                // elites
                          iTotalEnemies += ( INT32 ) ubElites * NUMBER_OF_RANKS_PER_ELITE;
                        }
                }
        }


        // check vs. maximum influence possible
        if( iTotalEnemies > MAX_ENEMY_SOLDIER_RANKS_FOR_IN_TOWN_LOYALTY_DROP )
        {
                // we have, adjust
                iTotalEnemies = MAX_ENEMY_SOLDIER_RANKS_FOR_IN_TOWN_LOYALTY_DROP;
        }


        // find how much of town is under enemy control
        iUnderControl = GetTownSectorSize( bTownId ) - GetTownSectorsUnderControl( bTownId );
        iUnderControl *= 100;
        iUnderControl /= GetTownSectorSize( bTownId );

        // adjust number of enemies for town control
        iTotalEnemies *= iUnderControl;
        iTotalEnemies /= 100;

        // adjust loyalty downward for enemies
        DecrementTownLoyalty( bTownId, iTotalEnemies * HOURLY_DROP_PER_ENEMY_RANK_IN_TOWN );
}
*/

function HandleMurderOfCivilian(pSoldier: Pointer<SOLDIERTYPE>, fIntentional: BOOLEAN): void {
  // handle the impact on loyalty of the murder of a civilian
  let bTownId: INT8 = 0;
  let iLoyaltyChange: INT32 = 0;
  let bSeenState: INT8 = 0;
  let iCounter: INT32 = 0;
  let pCivSoldier: Pointer<SOLDIERTYPE> = NULL;
  let uiChanceFalseAccusal: UINT32 = 0;
  let bKillerTeam: INT8 = 0;
  let fIncrement: BOOLEAN = FALSE;
  let uiLoyaltyEffectDelay: UINT32 = 0;
  let uiValue: UINT32 = 0;

  // ubAttacker CAN be NOBODY...  Don't treat is as murder if NOBODY killed us...
  if (pSoldier->ubAttackerID == NOBODY) {
    return;
  }

  // ignore murder of non-civilians!
  if ((pSoldier->bTeam != CIV_TEAM) || (pSoldier->ubBodyType == CROW)) {
    return;
  }

  // if this is a profiled civilian NPC
  if (pSoldier->ubProfile != NO_PROFILE) {
    // ignore murder of NPCs if they're not loyal to the rebel cause - they're really just enemies in civilian clothing
    if (gMercProfiles[pSoldier->ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_TOWN_DOESNT_CARE_ABOUT_DEATH) {
      return;
    }
  }

  // if civilian belongs to a civilian group
  if (pSoldier->ubCivilianGroup != NON_CIV_GROUP) {
    // and it's one that is hostile to the player's cause
    switch (pSoldier->ubCivilianGroup) {
      case KINGPIN_CIV_GROUP:
      case ALMA_MILITARY_CIV_GROUP:
      case HICKS_CIV_GROUP:
      case WARDEN_CIV_GROUP:
        return;
    }
  }

  // set killer team
  bKillerTeam = Menptr[pSoldier->ubAttackerID].bTeam;

  // if the player did the killing
  if (bKillerTeam == OUR_TEAM) {
    let pKiller: Pointer<SOLDIERTYPE> = MercPtrs[pSoldier->ubAttackerID];

    // apply morale penalty for killing a civilian!
    HandleMoraleEvent(pKiller, MORALE_KILLED_CIVILIAN, pKiller->sSectorX, pKiller->sSectorY, pKiller->bSectorZ);
  }

  // get town id
  bTownId = GetTownIdForSector(pSoldier->sSectorX, pSoldier->sSectorY);

  // if civilian is NOT in a town
  if (bTownId == BLANK_SECTOR) {
    return;
  }

  // check if this town does use loyalty (to skip a lot of unnecessary computation)
  if (!gfTownUsesLoyalty[bTownId]) {
    return;
  }

  if ((pSoldier->ubBodyType >= FATCIV) && (pSoldier->ubBodyType <= COW)) {
    // adjust value for killer and type
    iLoyaltyChange = uiPercentLoyaltyDecreaseForCivMurder[pSoldier->ubBodyType - FATCIV];
  } else {
    iLoyaltyChange = BASIC_COST_FOR_CIV_MURDER;
  }

  if (!fIntentional) {
    // accidental killing, reduce value
    iLoyaltyChange *= REDUCTION_FOR_UNINTENTIONAL_KILLING;
    iLoyaltyChange /= 100;
  }

  // check if LOS between any civ, killer and killed
  // if so, then do not adjust

  for (iCounter = gTacticalStatus.Team[CIV_TEAM].bFirstID; iCounter <= gTacticalStatus.Team[CIV_TEAM].bLastID; iCounter++) {
    // set current civ soldier
    pCivSoldier = MercPtrs[iCounter];

    if (pCivSoldier == pSoldier) {
      continue;
    }

    // killer seen by civ?
    if (SoldierToSoldierLineOfSightTest(pCivSoldier, MercPtrs[pSoldier->ubAttackerID], STRAIGHT_RANGE, TRUE) != 0) {
      bSeenState |= 1;
    }

    // victim seen by civ?
    if (SoldierToSoldierLineOfSightTest(pCivSoldier, pSoldier, STRAIGHT_RANGE, TRUE) != 0) {
      bSeenState |= 2;
    }
  }

  // if player didn't do it
  if (bKillerTeam != OUR_TEAM) {
    // If the murder is not fully witnessed, there's a chance of player being blamed for it even if it's not his fault
    switch (bSeenState) {
      case 0:
        // nobody saw anything.  When body is found, chance player is blamed depends on the town's loyalty at this time
        uiChanceFalseAccusal = MAX_LOYALTY_VALUE - gTownLoyalty[bTownId].ubRating;
        break;
      case 1:
        // civilians saw the killer, but not the victim. 10 % chance of blaming player whether or not he did it
        uiChanceFalseAccusal = 10;
        break;
      case 2:
        // civilians only saw the victim.  50/50 chance...
        uiChanceFalseAccusal = 50;
        break;
      case 3:
        // civilians have seen it all, and in this case, they're always honest
        uiChanceFalseAccusal = 0;
        break;
      default:
        Assert(FALSE);
        return;
    }

    // check whether player is falsely accused
    if (Random(100) < uiChanceFalseAccusal) {
      // blame player whether or not he did it - set killer team as our team
      bKillerTeam = OUR_TEAM;

      // not really player's fault, reduce penalty, because some will believe it to be a lie
      iLoyaltyChange *= REDUCTION_FOR_MURDER_NOT_OUR_FAULT;
      iLoyaltyChange /= 100;

      // debug message
      ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"You're being blamed for a death you didn't cause!");
    }
  }

  // check who town thinks killed the civ
  switch (bKillerTeam) {
    case OUR_TEAM:
      // town thinks player committed the murder, bad bad bad
      fIncrement = FALSE;

      // debug message
      ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"Civilian killed by friendly forces.");
      break;

    case ENEMY_TEAM:
      // check whose sector this is
      if (StrategicMap[(pSoldier->sSectorX) + (MAP_WORLD_X * (pSoldier->sSectorY))].fEnemyControlled == TRUE) {
        // enemy soldiers... in enemy controlled sector.  Gain loyalty
        fIncrement = TRUE;

        // debug message
        ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"Enemy soldiers murdered a civilian. Town loyalty increases");
      } else {
        // reduce, we're expected to provide some protection, but not miracles
        iLoyaltyChange *= REDUCTION_FOR_MURDER_OF_INNOCENT_BY_ENEMY_IN_OUR_SECTOR;
        iLoyaltyChange /= 100;

        // lose loyalty
        fIncrement = FALSE;

        // debug message
        ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"Town holds you responsible for murder by enemy.");
      }
      break;

    case MILITIA_TEAM:
      // the rebels did it... check if are they on our side
      if (CheckFact(FACT_REBELS_HATE_PLAYER, 0) == FALSE) {
        // on our side, penalty
        iLoyaltyChange *= REDUCTION_FOR_MURDER_BY_REBEL;
        iLoyaltyChange /= 100;

        // lose loyalty
        fIncrement = FALSE;

        // debug message
        ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"Town holds you responsible for murder by rebels.");
      }
      break;

    case CREATURE_TEAM:
      // killed by a monster - make sure it was one
      if ((Menptr[pSoldier->ubAttackerID].ubBodyType >= ADULTFEMALEMONSTER) && (Menptr[pSoldier->ubAttackerID].ubBodyType <= QUEENMONSTER)) {
        // increase for the extreme horror of being killed by a monster
        iLoyaltyChange *= MULTIPLIER_FOR_MURDER_BY_MONSTER;

        // check whose sector this is
        if (StrategicMap[(pSoldier->sSectorX) + (MAP_WORLD_X * (pSoldier->sSectorY))].fEnemyControlled == TRUE) {
          // enemy controlled sector - gain loyalty
          fIncrement = TRUE;
        } else {
          // our sector - lose loyalty
          fIncrement = FALSE;
        }
      }
      break;

    default:
      Assert(FALSE);
      return;
  }

  /* Delayed loyalty effects elimininated.  Sep.12/98.  ARM
          // figure out how long before the news of the murder spreads and lowers town loyalty
          if (bSeenState == 0)
          {
                  // nobody saw nothing.  Will be some time before the grisly remains are discovered...
                  uiLoyaltyEffectDelay = 60 * (1 + Random(12));	// 1-12 hrs in minutes
          }
          else
          {
                  // there are witnesses, news reported & spread very quickly
                  uiLoyaltyEffectDelay = 30;
          }


          // create the event value, with bTownId & for iLoyaltyChange as data
          uiValue = BuildLoyaltyEventValue( bTownId , iLoyaltyChange, fIncrement );
          // post the event
          AddStrategicEvent( EVENT_TOWN_LOYALTY_UPDATE, GetWorldTotalMin() + uiLoyaltyEffectDelay, uiValue );

          // ideally, we'd like to also call AffectAllTownsLoyaltyByDistanceFrom() here to spread the news to all other towns,
          // but we don't have that available on a delay right now, and it would be a bit of a pain, since we only have 32 bits
          // of event data to pass in, and that would have to store iLoyaltyChange, sSectorX, and sSectorY (64 bits)
  */

  // if it's a decrement, negate the value
  if (!fIncrement) {
    iLoyaltyChange *= -1;
  }

  // this is a hack: to avoid having to adjust the values, divide by 1.75 to compensate for the distance 0
  iLoyaltyChange *= 100;
  iLoyaltyChange /= (100 + (25 * LOYALTY_EVENT_DISTANCE_THRESHOLD));

  AffectAllTownsLoyaltyByDistanceFrom(iLoyaltyChange, pSoldier->sSectorX, pSoldier->sSectorY, pSoldier->bSectorZ);
}

// check town and raise loyalty value for hiring a merc from a town...not a lot of a gain, but some
function HandleTownLoyaltyForNPCRecruitment(pSoldier: Pointer<SOLDIERTYPE>): void {
  let bTownId: INT8 = 0;
  let uiLoyaltyValue: UINT32 = 0;
  let iRating: INT32 = 0;

  // get town id civilian
  bTownId = GetTownIdForSector(pSoldier->sSectorX, pSoldier->sSectorY);

  // is the merc currently in their home town?
  if (bTownId == gMercProfiles[pSoldier->ubProfile].bTown) {
    // yep, value of loyalty bonus depends on his importance to this to town
    uiLoyaltyValue = MULTIPLIER_LOCAL_RPC_HIRED * gMercProfiles[pSoldier->ubProfile].bTownAttachment;

    // increment town loyalty gain
    IncrementTownLoyalty(bTownId, uiLoyaltyValue);

    // DESIGN QUESTION: How easy is it to abuse this bonus by repeatedly hiring the guy over & over
    // (at worst daily? even more often if terminated & rehired?)  (ARM)
  }

  return;
}

function HandleLoyaltyAdjustmentForRobbery(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // not to be implemented at this time
  return FALSE;

  /*
          // this function will handle robbery by the passed soldiertype of an object from a town he/she is in
          // it will check LOS code for all civilians around the stealing soldier if any of them have LOS to the soldier
          // then roll against thief's dexterity, if fail then you were caught( adjust loyalty base on theft and value of the object and if the object is owned by one of the people with LOS) and return a TRUE
          // otherwise return false.

          INT8 bTownId = 0;

          // get town id
          bTownId = GetTownIdForSector( pSoldier->sSectorX, pSoldier->sSectorY );


          // debug message
    ScreenMsg( MSG_FONT_RED, MSG_DEBUG, L"Theft not yet implemented.");

          return ( FALSE );
  */
}

// handle loyalty adjustment for dmg inflicted on a building
function HandleLoyaltyForDemolitionOfBuilding(pSoldier: Pointer<SOLDIERTYPE>, sPointsDmg: INT16): void {
  // find this soldier's team and decrement the loyalty rating for them and for the people who police the sector
  // more penalty for the people who did it, a lesser one for those who should have stopped it
  let sLoyaltyValue: INT16 = 0;
  let sPolicingLoyalty: INT16 = 0;
  let bTownId: INT8 = 0;

  // hurt loyalty for damaging the building
  sLoyaltyValue = sPointsDmg * MULTIPLIER_FOR_DAMAGING_A_BUILDING;

  // penalty for not preventing the action
  sPolicingLoyalty = sPointsDmg * MULTIPLIER_FOR_NOT_PREVENTING_BUILDING_DAMAGE;

  // get town id
  bTownId = GetTownIdForSector(pSoldier->sSectorX, pSoldier->sSectorY);

  // penalize the side that did it
  if (pSoldier->bTeam == OUR_TEAM) {
    DecrementTownLoyalty(bTownId, sLoyaltyValue);
  } else if (pSoldier->bTeam == ENEMY_TEAM) {
    // enemy damaged sector, it's their fault
    IncrementTownLoyalty(bTownId, sLoyaltyValue);
  } else if (pSoldier->ubCivilianGroup == REBEL_CIV_GROUP) {
    // the rebels did it...are they on our side
    if (CheckFact(FACT_REBELS_HATE_PLAYER, 0) == FALSE) {
      sLoyaltyValue /= DIVISOR_FOR_REBEL_BUILDING_DMG;

      // decrement loyalty value for rebels on our side dmging town
      DecrementTownLoyalty(bTownId, sLoyaltyValue);
    }
  }

  // penalize the side that should have stopped it
  if (StrategicMap[pSoldier->sSectorX + pSoldier->sSectorY * MAP_WORLD_X].fEnemyControlled == TRUE) {
    // enemy should have prevented it, let them suffer a little
    IncrementTownLoyalty(bTownId, sPolicingLoyalty);
  } else {
    // we should have prevented it, we shall suffer
    DecrementTownLoyalty(bTownId, sPolicingLoyalty);
  }

  return;
}

function RemoveRandomItemsInSector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16, ubChance: UINT8): void {
  // remove random items in sector
  let uiNumberOfItems: UINT32 = 0;
  let iCounter: UINT32 = 0;
  let pItemList: Pointer<WORLDITEM>;
  let uiNewTotal: UINT32 = 0;
  let wSectorName: CHAR16[] /* [128] */;

  // stealing should fail anyway 'cause there shouldn't be a temp file for unvisited sectors, but let's check anyway
  Assert(GetSectorFlagStatus(sSectorX, sSectorY, sSectorZ, SF_ALREADY_VISITED) == TRUE);

  // get sector name string
  GetSectorIDString(sSectorX, sSectorY, sSectorZ, wSectorName, TRUE);

  // go through list of items in sector and randomly remove them

  // if unloaded sector
  if (gWorldSectorX != sSectorX || gWorldSectorY != sSectorY || gbWorldSectorZ != sSectorZ) {
    // if the player has never been there, there's no temp file, and 0 items will get returned, preventing any stealing
    GetNumberOfWorldItemsFromTempItemFile(sSectorX, sSectorY, sSectorZ, &uiNumberOfItems, FALSE);

    if (uiNumberOfItems == 0) {
      return;
    }

    pItemList = MemAlloc(sizeof(WORLDITEM) * uiNumberOfItems);

    // now load items
    LoadWorldItemsFromTempItemFile(sSectorX, sSectorY, sSectorZ, pItemList);
    uiNewTotal = uiNumberOfItems;

    // set up item list ptrs
    for (iCounter = 0; iCounter < uiNumberOfItems; iCounter++) {
      // if the item exists, and is visible and reachable, see if it should be stolen
      if (pItemList[iCounter].fExists && pItemList[iCounter].bVisible == TRUE && pItemList[iCounter].usFlags & WORLD_ITEM_REACHABLE) {
        if (Random(100) < ubChance) {
          // remove
          uiNewTotal--;
          pItemList[iCounter].fExists = FALSE;

          // debug message
          ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"%s stolen in %s!", ItemNames[pItemList[iCounter].o.usItem], wSectorName);
        }
      }
    }

    // only save if something was stolen
    if (uiNewTotal < uiNumberOfItems) {
      AddWorldItemsToUnLoadedSector(sSectorX, sSectorY, sSectorZ, 0, uiNumberOfItems, pItemList, TRUE);
    }

    // mem free
    MemFree(pItemList);
  } else // handle a loaded sector
  {
    for (iCounter = 0; iCounter < guiNumWorldItems; iCounter++) {
      // note, can't do reachable test here because we'd have to do a path call...
      if (gWorldItems[iCounter].fExists && gWorldItems[iCounter].bVisible == TRUE) {
        if (Random(100) < ubChance) {
          RemoveItemFromPool(gWorldItems[iCounter].sGridNo, iCounter, gWorldItems[iCounter].ubLevel);
          // debug message
          ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"%s stolen in %s!", ItemNames[gWorldItems[iCounter].o.usItem], wSectorName);
        }
      }
    }
  }

  return;
}

/* ARM: Civilian theft of items was removed
void HandleTheftByCiviliansInSector( INT16 sX, INT16 sY, INT32 iLoyalty )
{
        UINT8 ubChance = 0;

        // any loyalty under the theft threshhold is chance that thefts will occur
        if( iLoyalty < THRESHOLD_FOR_TOWN_THEFT )
        {
                // sectors with mercs are immune
                if( fSectorsWithSoldiers[ sX + ( MAP_WORLD_X * sY ) ][ 0 ] == FALSE )
                {
                        // sectors not yet visited by player are also immune (other sectors in town could have been visited)
                        if ( GetSectorFlagStatus( sX, sY, 0, SF_ALREADY_VISITED ) == TRUE )
                        {
                                ubChance = 5 + ( THRESHOLD_FOR_TOWN_THEFT - iLoyalty ) / 2;

                                // remove items from sector
                                RemoveRandomItemsInSector( sX, sY, 0, ubChance);
                        }
                }
        }

        return;
}

void HandleTownTheft( void )
{
        INT32 iCounter = 0;
        UINT8 ubTown;

        // init sectors with soldiers list
        InitSectorsWithSoldiersList( );

        // build list
        BuildSectorsWithSoldiersList(  );

        while( pTownNamesList[ iCounter ] != 0 )
        {
                ubTown = StrategicMap[ pTownLocationsList[ iCounter ] ].bNameId;

                // if this town tracks loyalty, and tracking has started
                if ( ( ubTown != BLANK_SECTOR ) && gfTownUsesLoyalty[ ubTown ] && gTownLoyalty[ ubTown ].fStarted )
                {
                        // handle theft in this town sector
                        HandleTheftByCiviliansInSector( ( INT16 )( pTownLocationsList[ iCounter ] % MAP_WORLD_X ), ( INT16 )( pTownLocationsList[ iCounter ] / MAP_WORLD_X ), gTownLoyalty[ ubTown ].ubRating );
                }

                iCounter++;
        }

        return;
}
*/

function BuildListOfTownSectors(): void {
  let iCounterX: INT32 = 0;
  let iCounterY: INT32 = 0;
  let iCounter: INT32 = 0;
  let usSector: UINT16;

  // initialize
  memset(pTownNamesList, BLANK_SECTOR, sizeof(pTownNamesList));
  memset(pTownLocationsList, 0xFF, sizeof(pTownLocationsList));

  // run through list
  for (iCounterX = 0; iCounterX < MAP_WORLD_X; iCounterX++) {
    for (iCounterY = 0; iCounterY < MAP_WORLD_Y; iCounterY++) {
      usSector = iCounterX + iCounterY * MAP_WORLD_X;

      if ((StrategicMap[usSector].bNameId >= FIRST_TOWN) && (StrategicMap[usSector].bNameId < NUM_TOWNS)) {
        pTownNamesList[iCounter] = StrategicMap[usSector].bNameId;
        pTownLocationsList[iCounter] = usSector;

        iCounter++;
      }
    }
  }
}

function ReadInDistancesBetweenTowns(): void {
  let hFileHandle: HWFILE;

  hFileHandle = FileOpen("BinaryData\\TownDistances.dat", FILE_ACCESS_READ, FALSE);

  FileRead(hFileHandle, &(iTownDistances), (sizeof(INT32) * NUM_TOWNS * NUM_TOWNS), NULL);

  // close file
  FileClose(hFileHandle);

  return;
}

function GetTownDistances(ubTown: UINT8, ubTownA: UINT8): INT32 {
  return iTownDistances[ubTown][ubTownA];
}

/* Delayed loyalty effects elimininated.  Sep.12/98.  ARM
void HandleDelayedTownLoyaltyEvent( UINT32 uiValue )
{
        INT8 bTownId = 0;
        UINT32 uiLoyaltyChange = 0;
        BOOLEAN fIncrement = FALSE;

        // first 8 bits are town id, 23 are amount and last is increment or decrement

        // get increment
        fIncrement = ( BOOLEAN )( GET_TOWN_INCREMENT( iValue ) ) ;

        // town id
        bTownId = ( INT8 )( GET_TOWN_ID_FOR_LOYALTY( iValue ) );

        // the amount
        uiLoyaltyChange = ( INT32 )( GET_TOWN_LOYALTY_CHANGE( iValue ) );

        if (fIncrement)
        {
                IncrementTownLoyalty( bTownId, uiLoyaltyChange );
        }
        else
        {
                DecrementTownLoyalty( bTownId, uiLoyaltyChange );
        }
}


UINT32 BuildLoyaltyEventValue( INT8 bTownValue, UINT32 uiValue, BOOLEAN fIncrement )
{
        UINT32 uiReturnValue  = 0;
        UINT32 uiTempValue = 0;

        // the town name in 8 most sig bits
        uiTempValue = ( UINT32 )( bTownValue );

        uiReturnValue += ( uiTempValue << 24 );

        // the incrment decrement amount is
        uiTempValue = ( UINT32 )( uiValue );

        uiTempValue = ( ( uiTempValue << 8 ) >> 7 );
        uiReturnValue += uiTempValue;

        uiReturnValue += ( fIncrement != 0 ? 1: 0 );

        return( uiReturnValue );
}
*/

function SaveStrategicTownLoyaltyToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;

  // Save the Town Loyalty
  FileWrite(hFile, gTownLoyalty, sizeof(TOWN_LOYALTY) * NUM_TOWNS, &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(TOWN_LOYALTY) * NUM_TOWNS) {
    return FALSE;
  }

  return TRUE;
}

function LoadStrategicTownLoyaltyFromSavedGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;

  // Restore the Town Loyalty
  FileRead(hFile, gTownLoyalty, sizeof(TOWN_LOYALTY) * NUM_TOWNS, &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(TOWN_LOYALTY) * NUM_TOWNS) {
    return FALSE;
  }

  return TRUE;
}

function ReduceLoyaltyForRebelsBetrayed(): void {
  let bTownId: INT8;

  // reduce loyalty to player all across Arulco
  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    if (bTownId == OMERTA) {
      // if not already really low
      if (gTownLoyalty[bTownId].ubRating > HOSTILE_OMERTA_LOYALTY_RATING) {
        // loyalty in Omerta tanks big time, and will stay low permanently since this becomes its maximum
        SetTownLoyalty(bTownId, HOSTILE_OMERTA_LOYALTY_RATING);
        // note that rebel sentiment isn't affected - they remain loyal to themselves, after all!
      }
    } else {
      // loyalty in other places is also strongly affected by this falling out with rebels, but this is not permanent
      SetTownLoyalty(bTownId, (gTownLoyalty[bTownId].ubRating / 3));
    }
  }
}

function GetNumberOfWholeTownsUnderControl(): INT32 {
  let iNumber: INT32 = 0;
  let bTownId: INT8 = 0;

  // run through the list of towns..if the entire town is under player control, then increment the number of towns under player control

  // make sure that each town is one for which loyalty matters
  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    if (IsTownUnderCompleteControlByPlayer(bTownId) && gfTownUsesLoyalty[bTownId]) {
      iNumber++;
    }
  }

  return iNumber;
}

function GetNumberOfWholeTownsUnderControlButExcludeCity(bCityToExclude: INT8): INT32 {
  let iNumber: INT32 = 0;
  let bTownId: INT8 = 0;

  // run through the list of towns..if the entire town is under player control, then increment the number of towns under player control
  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    if (IsTownUnderCompleteControlByPlayer(bTownId) && (bCityToExclude != bTownId) && gfTownUsesLoyalty[bTownId]) {
      iNumber++;
    }
  }

  return iNumber;
}

// is the ENTIRE town under player control?
function IsTownUnderCompleteControlByPlayer(bTownId: INT8): INT32 {
  let iNumber: INT32 = 0;

  if (GetTownSectorSize(bTownId) == GetTownSectorsUnderControl(bTownId)) {
    return TRUE;
  }

  return FALSE;
}

// is the ENTIRE town under enemy control?
function IsTownUnderCompleteControlByEnemy(bTownId: INT8): INT32 {
  let iNumber: INT32 = 0;

  if (GetTownSectorsUnderControl(bTownId) == 0) {
    return TRUE;
  }

  return FALSE;
}

function AdjustLoyaltyForCivsEatenByMonsters(sSectorX: INT16, sSectorY: INT16, ubHowMany: UINT8): void {
  let bTownId: INT8 = 0;
  let uiLoyaltyChange: UINT32 = 0;
  let str: UINT16[] /* [256] */;
  let pSectorString: UINT16[] /* [128] */;

  // get town id
  bTownId = GetTownIdForSector(sSectorX, sSectorY);

  // if NOT in a town
  if (bTownId == BLANK_SECTOR) {
    return;
  }

  // Report this to player
  GetSectorIDString(sSectorX, sSectorY, 0, pSectorString, TRUE);
  swprintf(str, gpStrategicString[STR_DIALOG_CREATURES_KILL_CIVILIANS], ubHowMany, pSectorString);
  DoScreenIndependantMessageBox(str, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);

  // use same formula as if it were a civilian "murder" in tactical!!!
  uiLoyaltyChange = ubHowMany * BASIC_COST_FOR_CIV_MURDER * MULTIPLIER_FOR_MURDER_BY_MONSTER;
  DecrementTownLoyalty(bTownId, uiLoyaltyChange);
}

// this applies the SAME change to every town equally, regardless of distance from the event
function IncrementTownLoyaltyEverywhere(uiLoyaltyIncrease: UINT32): void {
  let bTownId: INT8;

  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    IncrementTownLoyalty(bTownId, uiLoyaltyIncrease);
  }
}

function DecrementTownLoyaltyEverywhere(uiLoyaltyDecrease: UINT32): void {
  let bTownId: INT8;

  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    DecrementTownLoyalty(bTownId, uiLoyaltyDecrease);
  }
}
// this applies the change to every town differently, depending on the distance from the event
function HandleGlobalLoyaltyEvent(ubEventType: UINT8, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let iLoyaltyChange: INT32;
  let bTownId: INT8 = 0;

  if (bSectorZ == 0) {
    // grab town id, if this event occured within one
    bTownId = GetTownIdForSector(sSectorX, sSectorY);
  }

  // should other towns ignore events occuring in this town?
  if (bTownId == SAN_MONA) {
    return;
  }

  // determine what the base loyalty change of this event type is worth
  // these are ->hundredths<- of loyalty points, so choose appropriate values accordingly!
  // the closer a town is to the event, the more pronounced the effect upon that town is
  switch (ubEventType) {
    case GLOBAL_LOYALTY_BATTLE_WON:
      CheckConditionsForTriggeringCreatureQuest(sSectorX, sSectorY, bSectorZ);
      iLoyaltyChange = 500;
      break;
    case GLOBAL_LOYALTY_QUEEN_BATTLE_WON:
      CheckConditionsForTriggeringCreatureQuest(sSectorX, sSectorY, bSectorZ);
      iLoyaltyChange = 1000;
      break;
    case GLOBAL_LOYALTY_BATTLE_LOST:
      iLoyaltyChange = -750;
      break;
    case GLOBAL_LOYALTY_ENEMY_KILLED:
      iLoyaltyChange = 50;
      break;
    case GLOBAL_LOYALTY_NATIVE_KILLED:
      // note that there is special code (much more severe) for murdering civilians in the currently loaded sector.
      // this event is intended more for processing militia casualties, and the like
      iLoyaltyChange = -50;
      break;
    case GLOBAL_LOYALTY_ABANDON_MILITIA:
      // it doesn't matter how many of them are being abandoned
      iLoyaltyChange = -750;
      break;
    case GLOBAL_LOYALTY_GAIN_TOWN_SECTOR:
      iLoyaltyChange = 500;
      break;
    case GLOBAL_LOYALTY_LOSE_TOWN_SECTOR:
      iLoyaltyChange = -1000;
      break;
    case GLOBAL_LOYALTY_LIBERATE_WHOLE_TOWN:
      iLoyaltyChange = 1000;
      break;
    case GLOBAL_LOYALTY_GAIN_MINE:
      iLoyaltyChange = 1000;
      break;
    case GLOBAL_LOYALTY_LOSE_MINE:
      iLoyaltyChange = -1500;
      break;
    case GLOBAL_LOYALTY_GAIN_SAM:
      iLoyaltyChange = 250;
      break;
    case GLOBAL_LOYALTY_LOSE_SAM:
      iLoyaltyChange = -250;
      break;

    default:
      Assert(FALSE);
      return;
  }

  AffectAllTownsLoyaltyByDistanceFrom(iLoyaltyChange, sSectorX, sSectorY, bSectorZ);
}

function AffectAllTownsLoyaltyByDistanceFrom(iLoyaltyChange: INT32, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let sEventSector: INT16;
  let ubTempGroupId: UINT8;
  let bTownId: INT8;
  let uiIndex: UINT32;
  let iThisDistance: INT32;
  let iShortestDistance: INT32[] /* [NUM_TOWNS] */;
  let iPercentAdjustment: INT32;
  let iDistanceAdjustedLoyalty: INT32;

  // preset shortest distances to high values prior to searching for a minimum
  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    iShortestDistance[bTownId] = 999999;
  }

  sEventSector = sSectorX + (MAP_WORLD_X * sSectorY);

  // need a temporary group create to use for laying down distance paths
  ubTempGroupId = CreateNewPlayerGroupDepartingFromSector(sSectorX, sSectorY);

  // calc distance to the event sector from EACH SECTOR of each town, keeping only the shortest one for every town
  uiIndex = 0;
  while (pTownNamesList[uiIndex] != 0) {
    bTownId = pTownNamesList[uiIndex];

    // skip path test if distance is already known to be zero to speed this up a bit
    if (iShortestDistance[bTownId] > 0) {
      // calculate across how many sectors the fastest travel path from event to this town sector
      iThisDistance = FindStratPath(sEventSector, pTownLocationsList[uiIndex], ubTempGroupId, FALSE);

      if (iThisDistance < iShortestDistance[bTownId]) {
        iShortestDistance[bTownId] = iThisDistance;
      }
    }

    uiIndex++;
  }

  // must always remove that temporary group!
  RemoveGroup(ubTempGroupId);

  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    // doesn't affect towns where player hasn't established a "presence" yet
    if (!gTownLoyalty[bTownId].fStarted) {
      continue;
    }

    // if event was underground, double effective distance
    if (bSectorZ != 0) {
      iShortestDistance[bTownId] *= 2;
    }

    // This number here controls how many sectors away is the "norm" for the unadjusted loyalty change value
    if (iShortestDistance[bTownId] < LOYALTY_EVENT_DISTANCE_THRESHOLD) {
      // add 25% per sector below the threshold
      iPercentAdjustment = 25 * (LOYALTY_EVENT_DISTANCE_THRESHOLD - iShortestDistance[bTownId]);
    } else if (iShortestDistance[bTownId] > LOYALTY_EVENT_DISTANCE_THRESHOLD) {
      // subtract 10% per sector above the threshold
      iPercentAdjustment = -10 * (iShortestDistance[bTownId] - LOYALTY_EVENT_DISTANCE_THRESHOLD);

      // don't allow it to go below -100, that would change the sign of the loyalty effect!
      if (iPercentAdjustment < -100) {
        iPercentAdjustment = -100;
      }
    } else {
      // no distance adjustment necessary
      iPercentAdjustment = 0;
    }

    // calculate loyalty affects as adjusted for distance to this town
    iDistanceAdjustedLoyalty = (iLoyaltyChange * (100 + iPercentAdjustment)) / 100;

    if (iDistanceAdjustedLoyalty == 0) {
      // no measurable effect, skip this town
      continue;
    }

    if (iDistanceAdjustedLoyalty > 0) {
      IncrementTownLoyalty(bTownId, iDistanceAdjustedLoyalty);
    } else {
      // the decrement amount MUST be positive
      iDistanceAdjustedLoyalty *= -1;
      DecrementTownLoyalty(bTownId, iDistanceAdjustedLoyalty);
    }
  }
}

// to be called whenever player gains control of a sector in any way
function CheckIfEntireTownHasBeenLiberated(bTownId: INT8, sSectorX: INT16, sSectorY: INT16): void {
  // the whole town is under our control, check if we never libed this town before
  if (!gTownLoyalty[bTownId].fLiberatedAlready && IsTownUnderCompleteControlByPlayer(bTownId)) {
    if (MilitiaTrainingAllowedInSector(sSectorX, sSectorY, 0)) {
      // give a loyalty bonus
      HandleGlobalLoyaltyEvent(GLOBAL_LOYALTY_LIBERATE_WHOLE_TOWN, sSectorX, sSectorY, 0);

      // set fact is has been lib'ed and set history event
      AddHistoryToPlayersLog(HISTORY_LIBERATED_TOWN, bTownId, GetWorldTotalMin(), sSectorX, sSectorY);

      HandleMeanWhileEventPostingForTownLiberation(bTownId);
    }

    // even taking over non-trainable "towns" like Orta/Tixa for the first time should count as "player activity"
    if (gGameOptions.ubDifficultyLevel >= DIF_LEVEL_HARD) {
      UpdateLastDayOfPlayerActivity((GetWorldDay() + 4));
    } else {
      UpdateLastDayOfPlayerActivity((GetWorldDay() + 2));
    }

    // set flag even for towns where you can't train militia, useful for knowing Orta/Tixa were previously controlled
    gTownLoyalty[bTownId].fLiberatedAlready = TRUE;
  }
}

function CheckIfEntireTownHasBeenLost(bTownId: INT8, sSectorX: INT16, sSectorY: INT16): void {
  // NOTE:  only towns which allow you to train militia are important enough to get
  // reported here (and they're the only ones you can protect)
  if (MilitiaTrainingAllowedInSector(sSectorX, sSectorY, 0) && IsTownUnderCompleteControlByEnemy(bTownId)) {
    // the whole town is under enemy control, check if we libed this town before
    if (gTownLoyalty[bTownId].fLiberatedAlready) {
      HandleMeanWhileEventPostingForTownLoss(bTownId);
    }
  }
}

function HandleLoyaltyChangeForNPCAction(ubNPCProfileId: UINT8): void {
  switch (ubNPCProfileId) {
    case MIGUEL:
      // Omerta loyalty increases when Miguel receives letter from Enrico
      IncrementTownLoyalty(OMERTA, LOYALTY_BONUS_MIGUEL_READS_LETTER);
      break;

    case DOREEN:
      // having freed the child labourers... she is releasing them herself!
      IncrementTownLoyalty(DRASSEN, LOYALTY_BONUS_CHILDREN_FREED_DOREEN_SPARED);
      break;

    case MARTHA:
      // if Joey is still alive
      if (gMercProfiles[JOEY].bMercStatus != MERC_IS_DEAD) {
        IncrementTownLoyalty(CAMBRIA, LOYALTY_BONUS_MARTHA_WHEN_JOEY_RESCUED);
      }
      break;

    case KEITH:
      // Hillbilly problem solved
      IncrementTownLoyalty(CAMBRIA, LOYALTY_BONUS_KEITH_WHEN_HILLBILLY_SOLVED);
      break;

    case YANNI:
      // Chalice of Chance returned to Chitzena
      IncrementTownLoyalty(CHITZENA, LOYALTY_BONUS_YANNI_WHEN_CHALICE_RETURNED_LOCAL);
      // NOTE: This affects Chitzena,too, a second time, so first value is discounted for it
      IncrementTownLoyaltyEverywhere(LOYALTY_BONUS_YANNI_WHEN_CHALICE_RETURNED_GLOBAL);
      break;

    case AUNTIE:
      // Bloodcats killed
      IncrementTownLoyalty(ALMA, LOYALTY_BONUS_AUNTIE_WHEN_BLOODCATS_KILLED);
      break;

    case MATT:
      // Brother Dynamo freed
      IncrementTownLoyalty(ALMA, LOYALTY_BONUS_MATT_WHEN_DYNAMO_FREED);
      break;
  }
}

// set the location of the first encounter with enemy
function SetTheFirstBattleSector(sSectorValue: INT16): void {
  if (sWorldSectorLocationOfFirstBattle == 0) {
    sWorldSectorLocationOfFirstBattle = sSectorValue;
  }

  return;
}

// did first battle take place here
function DidFirstBattleTakePlaceInThisTown(bTownId: INT8): BOOLEAN {
  let bTownBattleId: INT8 = 0;

  // get town id for sector
  bTownBattleId = GetTownIdForSector((sWorldSectorLocationOfFirstBattle % MAP_WORLD_X), (sWorldSectorLocationOfFirstBattle / MAP_WORLD_X));

  return bTownId == bTownBattleId;
}

function PlayerStrength(): UINT32 {
  let ubLoop: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiStrength: UINT32;
  let uiTotal: UINT32 = 0;

  for (ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++) {
    pSoldier = MercPtrs[ubLoop];
    if (pSoldier->bActive) {
      if (pSoldier->bInSector || (pSoldier->fBetweenSectors && ((pSoldier->ubPrevSectorID % 16) + 1) == gWorldSectorX && ((pSoldier->ubPrevSectorID / 16) + 1) == gWorldSectorY && (pSoldier->bSectorZ == gbWorldSectorZ))) {
        // count this person's strength (condition), calculated as life reduced up to half according to maxbreath
        uiStrength = pSoldier->bLife * (pSoldier->bBreathMax + 100) / 200;
        uiTotal += uiStrength;
      }
    }
  }
  return uiTotal;
}

function EnemyStrength(): UINT32 {
  let ubLoop: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiStrength: UINT32;
  let uiTotal: UINT32 = 0;

  for (ubLoop = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; ubLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; ubLoop++) {
    pSoldier = MercPtrs[ubLoop];
    if (pSoldier->bActive && pSoldier->bInSector && !pSoldier->bNeutral) {
      // count this person's strength (condition), calculated as life reduced up to half according to maxbreath
      uiStrength = pSoldier->bLife * (pSoldier->bBreathMax + 100) / 200;
      uiTotal += uiStrength;
    }
  }

  return uiTotal;
}

// Function assumes that mercs have retreated already.  Handles two cases, one for general merc retreat
// which slightly demoralizes the mercs, the other handles abandonment of militia forces which poses
// as a serious loyalty penalty.
function HandleLoyaltyImplicationsOfMercRetreat(bRetreatCode: INT8, sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): void {
  if (CountAllMilitiaInSector(sSectorX, sSectorY)) {
    // Big morale penalty!
    HandleGlobalLoyaltyEvent(GLOBAL_LOYALTY_ABANDON_MILITIA, sSectorX, sSectorY, sSectorZ);
  }

  // Standard retreat penalty
  if (bRetreatCode == RETREAT_TACTICAL_TRAVERSAL) {
    // if not worse than 2:1 odds, then penalize morale
    if (gTacticalStatus.fEnemyInSector && (PlayerStrength() * 2 >= EnemyStrength())) {
      HandleMoraleEvent(NULL, MORALE_RAN_AWAY, sSectorX, sSectorY, sSectorZ);
    }
  } else {
    HandleMoraleEvent(NULL, MORALE_RAN_AWAY, sSectorX, sSectorY, sSectorZ);
  }
}

function MaximizeLoyaltyForDeidrannaKilled(): void {
  let bTownId: INT8;

  // max out loyalty to player all across Arulco
  for (bTownId = FIRST_TOWN; bTownId < NUM_TOWNS; bTownId++) {
    // it's possible one of the towns still has creature problems, but it's too much of a pain to worry about it now
    SetTownLoyalty(bTownId, 100);
  }
}
