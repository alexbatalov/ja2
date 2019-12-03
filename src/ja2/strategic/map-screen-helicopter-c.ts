namespace ja2 {

// the amounts of time to wait for hover stuff
const TIME_DELAY_FOR_HOVER_WAIT = 10; // minutes
const TIME_DELAY_FOR_HOVER_WAIT_TOO_LONG = 20; // mintues

const MIN_DAYS_BETWEEN_SKYRIDER_MONOLOGUES = 1;

// refuel delay
const REFUEL_HELICOPTER_DELAY = 30; // minutes

// total number of sectors one can go
//#define MAX_HELICOPTER_DISTANCE 25

// maximum chance out of a hundred per unsafe sector that a SAM site in decent working condition will hit Skyrider
const MAX_SAM_SITE_ACCURACY = 33;

// whether helicopted variables have been set up
export let fSkyRiderSetUp: boolean = false;

// plotting for a helicopter
export let fPlotForHelicopter: boolean = false;

// is the helicopter available to player?
export let fHelicopterAvailable: boolean = false;

// helicopter vehicle id
export let iHelicopterVehicleId: INT32 = -1;

// helicopter icon
export let guiHelicopterIcon: UINT32;

// total distance travelled
// INT32 iTotalHeliDistanceSinceRefuel = 0;

// total owed to player
export let iTotalAccumulatedCostByPlayer: INT32 = 0;

// whether or not skyrider is alive and well? and on our side yet?
export let fSkyRiderAvailable: boolean = false;

// helicopter destroyed
export let fHelicopterDestroyed: boolean = false;

// list of sector locations where SkyRider can be refueled
let ubRefuelList: UINT8[][] /* [NUMBER_OF_REFUEL_SITES][2] */ = [
  [ 13, 2 ], // Drassen airport
  [ 6, 9 ], // Estoni
];

let sRefuelStartGridNo: INT16[] /* [NUMBER_OF_REFUEL_SITES] */ = [
  9001, // drassen
  13068, // estoni
];

// whether or not helicopter can refuel at this site
export let fRefuelingSiteAvailable: boolean[] /* [NUMBER_OF_REFUEL_SITES] */ = [
  false,
  false,
];

// is the heli in the air?
export let fHelicopterIsAirBorne: boolean = false;

// is the pilot returning straight to base?
export let fHeliReturnStraightToBase: boolean = false;

// heli hovering
export let fHoveringHelicopter: boolean = false;

// time started hovering
export let uiStartHoverTime: UINT32 = 0;

// what state are skyrider's monologues in in?
export let guiHelicopterSkyriderTalkState: UINT32 = 0;

// the flags for skyrider events
export let fShowEstoniRefuelHighLight: boolean = false;
export let fShowOtherSAMHighLight: boolean = false;
export let fShowDrassenSAMHighLight: boolean = false;
export let fShowCambriaHospitalHighLight: boolean = false;

export let guiTimeOfLastSkyriderMonologue: UINT32 = 0;

export let gubHelicopterHitsTaken: UINT8 = 0;

export let gfSkyriderSaidCongratsOnTakingSAM: boolean = false;
export let gubPlayerProgressSkyriderLastCommentedOn: UINT8 = 0;

// skyrider placeholder
let SoldierSkyRider: SOLDIERTYPE = createSoldierType();

let pSkyRider: SOLDIERTYPE = <SOLDIERTYPE><unknown>null;

export function InitializeHelicopter(): void {
  // must be called whenever a new game starts up!
  fHelicopterAvailable = false;
  iHelicopterVehicleId = -1;

  fSkyRiderAvailable = false;
  fSkyRiderSetUp = false;
  pSkyRider = <SOLDIERTYPE><unknown>null;
  resetSoldierType(SoldierSkyRider);

  fHelicopterIsAirBorne = false;
  fHeliReturnStraightToBase = false;

  fHoveringHelicopter = false;
  uiStartHoverTime = 0;

  fPlotForHelicopter = false;
  pTempHelicopterPath = null;

  //	iTotalHeliDistanceSinceRefuel = 0;
  iTotalAccumulatedCostByPlayer = 0;

  fHelicopterDestroyed = false;

  guiHelicopterSkyriderTalkState = 0;
  guiTimeOfLastSkyriderMonologue = 0;

  fShowEstoniRefuelHighLight = false;
  fShowOtherSAMHighLight = false;
  fShowDrassenSAMHighLight = false;
  fShowCambriaHospitalHighLight = false;

  gfSkyriderEmptyHelpGiven = false;

  gubHelicopterHitsTaken = 0;

  gfSkyriderSaidCongratsOnTakingSAM = false;
  gubPlayerProgressSkyriderLastCommentedOn = 0;
}

function AddSoldierToHelicopter(pSoldier: SOLDIERTYPE): boolean {
  // attempt to add soldier to helicopter
  if (iHelicopterVehicleId == -1) {
    // no heli yet
    return false;
  }

  // check if heli is in motion or if on the ground
  if ((fHelicopterIsAirBorne == true) && (fHoveringHelicopter == false)) {
    return false;
  }

  // is the heli returning to base?..he ain't waiting if so
  if (fHeliReturnStraightToBase == true) {
    return false;
  }

  // attempt to add to vehicle
  return PutSoldierInVehicle(pSoldier, iHelicopterVehicleId);
}

export function RemoveSoldierFromHelicopter(pSoldier: SOLDIERTYPE): boolean {
  // attempt to add soldier to helicopter
  if (iHelicopterVehicleId == -1) {
    // no heli yet
    return false;
  }

  // check if heli is in motion or if on the ground
  if ((fHelicopterIsAirBorne == true) && (fHoveringHelicopter == false)) {
    return false;
  }

  // is the heli returning to base?..he ain't waiting if so
  if (fHeliReturnStraightToBase == true) {
    return false;
  }

  pSoldier.sSectorX = pVehicleList[iHelicopterVehicleId].sSectorX;
  pSoldier.sSectorY = pVehicleList[iHelicopterVehicleId].sSectorY;
  pSoldier.bSectorZ = 0;

  // reset between sectors
  pSoldier.fBetweenSectors = false;

  // remove from the vehicle
  return TakeSoldierOutOfVehicle(pSoldier);
}

export function HandleHeliEnteringSector(sX: INT16, sY: INT16): boolean {
  let ubNumEnemies: UINT8;

  // check for SAM attack upon the chopper.  If it's destroyed by the attack, do nothing else here
  if (HandleSAMSiteAttackOfHelicopterInSector(sX, sY) == true) {
    // destroyed
    return true;
  }

  // count how many enemies are camped there or passing through
  ubNumEnemies = NumEnemiesInSector(sX, sY);

  // any baddies?
  if (ubNumEnemies > 0) {
    // if the player didn't know about these prior to the chopper's arrival
    if (WhatPlayerKnowsAboutEnemiesInSector(sX, sY) == Enum159.KNOWS_NOTHING) {
      // but Skyrider notices them
      if (DoesSkyriderNoticeEnemiesInSector(ubNumEnemies) == true) {
        // if just passing through (different quotes are used below if it's his final destination)
        if (!EndOfHelicoptersPath()) {
          // stop time compression and inform player that there are enemies in the sector below
          StopTimeCompression();

          if (Random(2)) {
            HeliCharacterDialogue(pSkyRider, ENEMIES_SPOTTED_EN_ROUTE_IN_FRIENDLY_SECTOR_A);
          } else {
            HeliCharacterDialogue(pSkyRider, ENEMIES_SPOTTED_EN_ROUTE_IN_FRIENDLY_SECTOR_B);
          }
        }

        // make their presence appear on the map while Skyrider remains in the sector
        SectorInfo[SECTOR(sX, sY)].uiFlags |= SF_SKYRIDER_NOTICED_ENEMIES_HERE;
      }
    }
  }

  // player pays for travel if Skyrider is NOT returning to base (even if empty while scouting/going for pickup)
  if (fHeliReturnStraightToBase == false) {
    // charge cost for flying another sector
    iTotalAccumulatedCostByPlayer += GetCostOfPassageForHelicopter(sX, sY);
  }

  // accumulate distance travelled
  //	AddSectorToHelicopterDistanceTravelled( );

  // check if heli has any real path left
  if (EndOfHelicoptersPath()) {
    // start hovering
    StartHoverTime();

    // if sector is safe, or Skyrider MUST land anyway (returning to base)
    if ((ubNumEnemies == 0) || fHeliReturnStraightToBase) {
      // if he has passengers, or he's not going straight to base, tell player he's arrived
      // (i.e. don't say anything nor stop time compression if he's empty and just returning to base)
      if ((GetNumberOfPassengersInHelicopter() > 0) || !fHeliReturnStraightToBase) {
        // arrived at destination
        HeliCharacterDialogue(pSkyRider, ARRIVED_IN_NON_HOSTILE_SECTOR);
        StopTimeCompression();
      }

      // destination reached, payment due.  If player can't pay, mercs get kicked off and heli flies to base!
      PaySkyriderBill();
    } else {
      // Say quote: "Gonna have to abort.  Enemies below"
      HeliCharacterDialogue(pSkyRider, ARRIVED_IN_HOSTILE_SECTOR);
      StopTimeCompression();
    }

    if (CheckForArrivalAtRefuelPoint()) {
      ReFuelHelicopter();
    }
  }

  return false;
}

/*
INT32 GetTotalDistanceHelicopterCanTravel( void )
{
        return( MAX_HELICOPTER_DISTANCE );
}

INT32 HowFarHelicopterhasTravelledSinceRefueling( void )
{
        // return total distance
        return( iTotalHeliDistanceSinceRefuel );
}

INT32 HowFurtherCanHelicopterTravel( void )
{
        // how many sectors further can we go on remaining fuel?
        return( MAX_HELICOPTER_DISTANCE - ( HowFarHelicopterhasTravelledSinceRefueling( ) + DistanceOfIntendedHelicopterPath( ) ) );
}

void AddSectorToHelicopterDistanceTravelled( void )
{
        // up the distance
        iTotalHeliDistanceSinceRefuel++;

        //reset hover time
        uiStartHoverTime = 0;

        return;
}
*/

function LocationOfNearestRefuelPoint(fNotifyPlayerIfNoSafeLZ: boolean): INT32 {
  let iClosestLocation: INT32 = -1;

  // try to find one, any one under the players control
  iClosestLocation = FindLocationOfClosestRefuelSite(true);

  // no go?...then find
  if (iClosestLocation == -1) {
    if (fNotifyPlayerIfNoSafeLZ) {
      // no refueling sites available, might wanna warn player about this
      ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pHelicopterEtaStrings[5]);
    }

    // find the closest location regardless
    iClosestLocation = FindLocationOfClosestRefuelSite(false);
  }

  // always returns a valid refuel point, picking a hostile one if unavoidable
  Assert(iClosestLocation != -1);

  return iClosestLocation;
}

function FindLocationOfClosestRefuelSite(fMustBeAvailable: boolean): INT32 {
  let iShortestDistance: INT32 = 9999;
  let iCounter: INT32 = 0;
  let iDistance: INT32 = 9999;
  let iClosestLocation: INT32 = -1;

  // find shortest distance to refuel site
  for (iCounter = 0; iCounter < Enum137.NUMBER_OF_REFUEL_SITES; iCounter++) {
    // if this refuelling site is available
    if ((fRefuelingSiteAvailable[iCounter]) || (fMustBeAvailable == false)) {
      // find if sector is under control, find distance from heli to it
      iDistance = FindStratPath((CALCULATE_STRATEGIC_INDEX(pVehicleList[iHelicopterVehicleId].sSectorX, pVehicleList[iHelicopterVehicleId].sSectorY)), (CALCULATE_STRATEGIC_INDEX(ubRefuelList[iCounter][0], ubRefuelList[iCounter][1])), pVehicleList[iHelicopterVehicleId].ubMovementGroup, false);

      if (iDistance < iShortestDistance) {
        // shorter, copy over
        iShortestDistance = iDistance;
        iClosestLocation = iCounter;
      }
    }
  }

  // return the location
  return iClosestLocation;
}

function DistanceToNearestRefuelPoint(sX: INT16, sY: INT16): INT32 {
  let iClosestLocation: INT32;
  let iDistance: INT32;

  // don't notify player during these checks!
  iClosestLocation = LocationOfNearestRefuelPoint(false);

  iDistance = FindStratPath((CALCULATE_STRATEGIC_INDEX(sX, sY)), (CALCULATE_STRATEGIC_INDEX(ubRefuelList[iClosestLocation][0], ubRefuelList[iClosestLocation][1])), pVehicleList[iHelicopterVehicleId].ubMovementGroup, false);
  return iDistance;
}

/*
BOOLEAN IsSectorOutOfTheWay( INT16 sX, INT16 sY )
{
        // check distance to nearest refuel point
        if( DistanceToNearestRefuelPoint( sX, sY ) > HowFurtherCanHelicopterTravel( ) )
        {
                return( TRUE );
        }


        return( FALSE );
}
*/

function ReFuelHelicopter(): void {
  // land, pay the man, and refuel

  LandHelicopter();

  /*
          AddStrategicEvent( EVENT_HELICOPTER_DONE_REFUELING, GetWorldTotalMin() + REFUEL_HELICOPTER_DELAY, 0 );

          // reset distance traveled
          iTotalHeliDistanceSinceRefuel = 0;
  */

  return;
}

function GetCostOfPassageForHelicopter(sX: INT16, sY: INT16): INT32 {
  // check if sector is air controlled or not, if so, then normal cost, otherwise increase the cost
  let iCost: INT32 = 0;

  // if they don't control it
  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sX, sY)].fEnemyAirControlled == false) {
    iCost = COST_AIRSPACE_SAFE;
  } else {
    iCost = COST_AIRSPACE_UNSAFE;
  }

  return iCost;
}

function SkyriderDestroyed(): void {
  // remove any arrival events for the helicopter's group
  DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pVehicleList[iHelicopterVehicleId].ubMovementGroup);

  // kill eveyone on board
  KillAllInVehicle(iHelicopterVehicleId);

  // kill skyrider
  fSkyRiderAvailable = false;
  SoldierSkyRider.bLife = 0;
  gMercProfiles[Enum268.SKYRIDER].bLife = 0;

  // heli no longer available
  fHelicopterAvailable = false;

  // destroy helicopter
  fHelicopterDestroyed = true;

  // zero out balance due
  gMercProfiles[Enum268.SKYRIDER].iBalance = 0;
  //	iTotalHeliDistanceSinceRefuel = 0;
  iTotalAccumulatedCostByPlayer = 0;

  // remove vehicle and reset
  RemoveVehicleFromList(iHelicopterVehicleId);
  iHelicopterVehicleId = -1;

  return;
}

export function CanHelicopterFly(): boolean {
  // check if heli is available for flight?

  // is the heli available
  if (fHelicopterAvailable == false) {
    return false;
  }

  if (VehicleIdIsValid(iHelicopterVehicleId) == false) {
    return false;
  }

  /*
          // travelled too far?
          if( iTotalHeliDistanceSinceRefuel > MAX_HELICOPTER_DISTANCE )
          {
                  return( FALSE );
          }
  */

  // is the pilot alive, well, and willing to help us?
  if (IsHelicopterPilotAvailable() == false) {
    return false;
  }

  if (fHeliReturnStraightToBase == true) {
    return false;
  }

  // grounded by enemies in sector?
  if (CanHelicopterTakeOff() == false) {
    return false;
  }

  // everything A-OK!
  return true;
}

export function IsHelicopterPilotAvailable(): boolean {
  // what is state of skyrider?
  if (fSkyRiderAvailable == false) {
    return false;
  }

  // owe any money to skyrider?
  if (gMercProfiles[Enum268.SKYRIDER].iBalance < 0) {
    return false;
  }

  // Drassen too disloyal to wanna help player?
  if (CheckFact(Enum170.FACT_LOYALTY_LOW, Enum268.SKYRIDER)) {
    return false;
  }

  return true;
}

function LandHelicopter(): void {
  // set the helictoper down, call arrive callback for this mvt group
  fHelicopterIsAirBorne = false;

  // no longer hovering
  fHoveringHelicopter = false;

  // reset fact that we might have returned straight here
  fHeliReturnStraightToBase = false;

  HandleHelicopterOnGroundGraphic();
  HandleHelicopterOnGroundSkyriderProfile();

  // if we'll be unable to take off again (because there are enemies in the sector, or we owe pilot money)
  if (CanHelicopterFly() == false) {
    // kick everyone out!
    MoveAllInHelicopterToFootMovementGroup();
  } else {
    // play meanwhile scene if it hasn't been used yet
    HandleKillChopperMeanwhileScene();
  }
}

export function TakeOffHelicopter(): void {
  // heli in the air
  fHelicopterIsAirBorne = true;

  // no longer hovering
  fHoveringHelicopter = false;

  HandleHelicopterOnGroundGraphic();
  HandleHelicopterOnGroundSkyriderProfile();
}

function StartHoverTime(): void {
  // start hover in this sector
  fHoveringHelicopter = true;

  // post event for x mins in future, save start time, if event time - delay = start time, then hover has gone on too long
  uiStartHoverTime = GetWorldTotalMin();

  // post event..to call handle hover
  AddStrategicEvent(Enum132.EVENT_HELICOPTER_HOVER_TOO_LONG, GetWorldTotalMin() + TIME_DELAY_FOR_HOVER_WAIT, 0);

  return;
}

export function HandleHeliHoverLong(): void {
  // post message about hovering too long
  if (fHoveringHelicopter) {
    // proper event, post next one
    AddStrategicEvent(Enum132.EVENT_HELICOPTER_HOVER_WAY_TOO_LONG, uiStartHoverTime + TIME_DELAY_FOR_HOVER_WAIT_TOO_LONG, 0);

    // inform player
    HeliCharacterDialogue(pSkyRider, HOVERING_A_WHILE);

    // stop time compression if it's on
    StopTimeCompression();
  } else {
    // reset
    uiStartHoverTime = 0;
  }
}

export function HandleHeliHoverTooLong(): void {
  // reset hover time
  uiStartHoverTime = 0;

  if (fHoveringHelicopter == false) {
    return;
  }

  // hovered too long, inform player heli is returning to base
  HeliCharacterDialogue(pSkyRider, RETURN_TO_BASE);

  // If the sector is safe
  if (NumEnemiesInSector(pVehicleList[iHelicopterVehicleId].sSectorX, pVehicleList[iHelicopterVehicleId].sSectorY) == 0) {
    // kick everyone out!
    MoveAllInHelicopterToFootMovementGroup();
  }

  MakeHeliReturnToBase();
}

// check if anyone in the chopper sees any baddies in sector
function DoesSkyriderNoticeEnemiesInSector(ubNumEnemies: UINT8): boolean {
  let ubChance: UINT8;

  // is the pilot and heli around?
  if (CanHelicopterFly() == false) {
    return false;
  }

  // if there aren't any, he obviously won't see them
  if (ubNumEnemies == 0) {
    return false;
  }

  // figure out what the chance is of seeing them
  // make this relatively accurate most of the time, to encourage helicopter scouting by making it useful
  ubChance = 60 + ubNumEnemies;

  if (PreRandom(100) < ubChance) {
    return true;
  }

  return false;
}

// if the heli is on the move, what is the distance it will move..the length of the merc path, less the first node
export function DistanceOfIntendedHelicopterPath(): INT32 {
  let pNode: PathStPtr = null;
  let iLength: INT32 = 0;

  if (CanHelicopterFly() == false) {
    // big number, no go
    return 9999;
  }

  pNode = pVehicleList[iHelicopterVehicleId].pMercPath;

  // any path yet?
  if (pNode != null) {
    while (pNode.value.pNext) {
      iLength++;
      pNode = pNode.value.pNext;
    }
  }

  pNode = MoveToBeginningOfPathList(pTempHelicopterPath);

  // any path yet?
  if (pNode != null) {
    while (pNode.value.pNext) {
      iLength++;
      pNode = pNode.value.pNext;
    }
  }

  return iLength;
}

function CheckForArrivalAtRefuelPoint(): boolean {
  // check if this is our final destination
  if (GetLengthOfPath(pVehicleList[iHelicopterVehicleId].pMercPath) > 0) {
    return false;
  }

  // check if we're at a refuel site
  if (DistanceToNearestRefuelPoint(pVehicleList[iHelicopterVehicleId].sSectorX, pVehicleList[iHelicopterVehicleId].sSectorY) > 0) {
    // not at a refuel point
    return false;
  }

  // we are at a refuel site
  return true;
}

export function SetUpHelicopterForMovement(): void {
  // check if helicopter vehicle has a mvt group, if not, assign one in this sector
  let iCounter: INT32 = 0;

  // if no group, create one for vehicle
  if (pVehicleList[iHelicopterVehicleId].ubMovementGroup == 0) {
    // get the vehicle a mvt group
    pVehicleList[iHelicopterVehicleId].ubMovementGroup = CreateNewVehicleGroupDepartingFromSector((pVehicleList[iHelicopterVehicleId].sSectorX), (pVehicleList[iHelicopterVehicleId].sSectorY), iHelicopterVehicleId);

    // add everyone in vehicle to this mvt group
    for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iHelicopterVehicleId].ubVehicleType]; iCounter++) {
      if (pVehicleList[iHelicopterVehicleId].pPassengers[iCounter] != null) {
        // add character
        AddPlayerToGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup, pVehicleList[iHelicopterVehicleId].pPassengers[iCounter]);
      }
    }
  }
}

function HeliCharacterDialogue(pSoldier: SOLDIERTYPE, usQuoteNum: UINT16): boolean {
  // ARM: we could just return, but since various flags are often being set it's safer to honk so it gets fixed right!
  Assert(fSkyRiderAvailable);

  return CharacterDialogue(Enum268.SKYRIDER, usQuoteNum, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);
}

export function GetNumberOfPassengersInHelicopter(): INT32 {
  let iNumber: INT32 = 0;

  if (iHelicopterVehicleId != -1) {
    iNumber = GetNumberInVehicle(iHelicopterVehicleId);
  }

  return iNumber;
}

export function IsRefuelSiteInSector(sMapX: INT16, sMapY: INT16): boolean {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < Enum137.NUMBER_OF_REFUEL_SITES; iCounter++) {
    if ((ubRefuelList[iCounter][0] == sMapX) && (ubRefuelList[iCounter][1] == sMapY)) {
      return true;
    }
  }

  return false;
}

export function UpdateRefuelSiteAvailability(): void {
  let iCounter: INT32 = 0;

  // Generally, only Drassen is initially available for refuelling
  // Estoni must first be captured (although player may already have it when he gets Skyrider!)

  for (iCounter = 0; iCounter < Enum137.NUMBER_OF_REFUEL_SITES; iCounter++) {
    // if enemy controlled sector (ground OR air, don't want to fly into enemy air territory)
    if ((StrategicMap[CALCULATE_STRATEGIC_INDEX(ubRefuelList[iCounter][0], ubRefuelList[iCounter][1])].fEnemyControlled == true) || (StrategicMap[CALCULATE_STRATEGIC_INDEX(ubRefuelList[iCounter][0], ubRefuelList[iCounter][1])].fEnemyAirControlled == true) || ((iCounter == Enum137.ESTONI_REFUELING_SITE) && (CheckFact(Enum170.FACT_ESTONI_REFUELLING_POSSIBLE, 0) == false))) {
      // mark refueling site as unavailable
      fRefuelingSiteAvailable[iCounter] = false;
    } else {
      // mark refueling site as available
      fRefuelingSiteAvailable[iCounter] = true;

      // reactivate a grounded helicopter, if here
      if (!fHelicopterAvailable && !fHelicopterDestroyed && fSkyRiderAvailable && (iHelicopterVehicleId != -1)) {
        if ((pVehicleList[iHelicopterVehicleId].sSectorX == ubRefuelList[iCounter][0]) && (pVehicleList[iHelicopterVehicleId].sSectorY == ubRefuelList[iCounter][1])) {
          // no longer grounded
          DoScreenIndependantMessageBox(pSkyriderText[5], MSG_BOX_FLAG_OK, null);
        }
      }
    }
  }
}

export function SetUpHelicopterForPlayer(sX: INT16, sY: INT16): void {
  if (fSkyRiderSetUp == false) {
    fHelicopterAvailable = true;
    fSkyRiderAvailable = true;

    iHelicopterVehicleId = AddVehicleToList(sX, sY, 0, Enum279.HELICOPTER);

    Assert(iHelicopterVehicleId != -1);

    resetSoldierType(SoldierSkyRider);
    SoldierSkyRider.ubProfile = Enum268.SKYRIDER;
    SoldierSkyRider.bLife = 80;

    pSkyRider = SoldierSkyRider;

    // set up for movement
    SetUpHelicopterForMovement();
    UpdateRefuelSiteAvailability();

    fSkyRiderSetUp = true;

    gMercProfiles[Enum268.SKYRIDER].fUseProfileInsertionInfo = false;
  }

  return;
}

export function MoveAllInHelicopterToFootMovementGroup(): UINT8 {
  // take everyone out of heli and add to movement group
  let iCounter: INT32 = 0;
  let ubGroupId: UINT8 = 0;
  let pSoldier: SOLDIERTYPE | null;
  let bNewSquad: INT8;
  let fAnyoneAboard: boolean = false;
  let fSuccess: boolean;
  let ubInsertionCode: UINT8 = <UINT8><unknown>undefined;
  let fInsertionCodeSet: boolean = false;
  let usInsertionData: UINT16 = <UINT16><unknown>undefined;;

  // put these guys on their own squad (we need to return their group ID, and can only return one, so they need a unique one
  bNewSquad = GetFirstEmptySquad();
  if (bNewSquad == -1) {
    return 0;
  }

  // go through list of everyone in helicopter
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iHelicopterVehicleId].ubVehicleType]; iCounter++) {
    // get passenger
    pSoldier = pVehicleList[iHelicopterVehicleId].pPassengers[iCounter];

    if (pSoldier != null) {
      // better really be in there!
      Assert(pSoldier.bAssignment == Enum117.VEHICLE);
      Assert(pSoldier.iVehicleId == iHelicopterVehicleId);

      fAnyoneAboard = true;

      fSuccess = RemoveSoldierFromHelicopter(pSoldier);
      Assert(fSuccess);

      AddCharacterToSquad(pSoldier, bNewSquad);

      // ATE: OK - the ubStrategicInsertionCode is set 'cause groupArrivesInsector has been
      // called when buddy is added to a squad. However, the insertion code onlt sets set for
      // the first merc, so the rest are going to use whatever they had previously....
      if (!fInsertionCodeSet) {
        ubInsertionCode = pSoldier.ubStrategicInsertionCode;
        usInsertionData = pSoldier.usStrategicInsertionData;
        fInsertionCodeSet = true;
      } else {
        pSoldier.ubStrategicInsertionCode = ubInsertionCode;
        pSoldier.usStrategicInsertionData = usInsertionData;
      }
    }
  }

  if (fAnyoneAboard) {
    ubGroupId = SquadMovementGroups[bNewSquad];
  }

  return ubGroupId;
}

export function SkyRiderTalk(usQuoteNum: UINT16): void {
  // have skyrider talk to player
  HeliCharacterDialogue(pSkyRider, usQuoteNum);

  fTeamPanelDirty = true;

  return;
}

export function HandleSkyRiderMonologueEvent(uiEventCode: UINT32, uiSpecialCode: UINT32): void {
  // will handle the skyrider monologue about where the SAM sites are and what not

  TurnOnAirSpaceMode();

  switch (uiEventCode) {
    case (Enum136.SKYRIDER_MONOLOGUE_EVENT_DRASSEN_SAM_SITE):
      SetExternMapscreenSpeechPanelXY(DEFAULT_EXTERN_PANEL_X_POS, 117);
      HandleSkyRiderMonologueAboutDrassenSAMSite(uiSpecialCode);
      break;
    case Enum136.SKYRIDER_MONOLOGUE_EVENT_CAMBRIA_HOSPITAL:
      SetExternMapscreenSpeechPanelXY(DEFAULT_EXTERN_PANEL_X_POS, 172);
      HandleSkyRiderMonologueAboutCambriaHospital(uiSpecialCode);
      break;
    case (Enum136.SKYRIDER_MONOLOGUE_EVENT_OTHER_SAM_SITES):
      SetExternMapscreenSpeechPanelXY(335, DEFAULT_EXTERN_PANEL_Y_POS);
      HandleSkyRiderMonologueAboutOtherSAMSites(uiSpecialCode);
      break;
    case (Enum136.SKYRIDER_MONOLOGUE_EVENT_ESTONI_REFUEL):
      SetExternMapscreenSpeechPanelXY(DEFAULT_EXTERN_PANEL_X_POS, DEFAULT_EXTERN_PANEL_Y_POS);
      HandleSkyRiderMonologueAboutEstoniRefuel(uiSpecialCode);
      break;
  }

  // update time
  guiTimeOfLastSkyriderMonologue = GetWorldTotalMin();
}

function HandleSkyRiderMonologueAboutEstoniRefuel(uiSpecialCode: UINT32): void {
  // once estoni is free tell player about refueling

  switch (uiSpecialCode) {
    case (0):
      CharacterDialogueWithSpecialEvent(Enum268.SKYRIDER, SPIEL_ABOUT_ESTONI_AIRSPACE, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false, DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT, Enum136.SKYRIDER_MONOLOGUE_EVENT_ESTONI_REFUEL, 1);
      // if special event data 2 is true, then do dialogue, else this is just a trigger for an event
      CharacterDialogue(Enum268.SKYRIDER, SPIEL_ABOUT_ESTONI_AIRSPACE, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);

      CharacterDialogueWithSpecialEvent(Enum268.SKYRIDER, SPIEL_ABOUT_ESTONI_AIRSPACE, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false, DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT, Enum136.SKYRIDER_MONOLOGUE_EVENT_ESTONI_REFUEL, 2);
      break;

    case (1):
      // highlight Estoni
      fShowEstoniRefuelHighLight = true;
      break;

    case (2):
      fShowEstoniRefuelHighLight = false;
      break;
  }
  return;
}

function HandleSkyRiderMonologueAboutDrassenSAMSite(uiSpecialCode: UINT32): void {
  switch (uiSpecialCode) {
    case (0):
      // gpCurrentTalkingFace = &gFacesData[ uiExternalStaticNPCFaces[ SKYRIDER_EXTERNAL_FACE ] ];
      // gubCurrentTalkingID = SKYRIDER;

      // if special event data 2 is true, then do dialogue, else this is just a trigger for an event
      CharacterDialogue(Enum268.SKYRIDER, MENTION_DRASSEN_SAM_SITE, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);
      CharacterDialogueWithSpecialEvent(Enum268.SKYRIDER, MENTION_DRASSEN_SAM_SITE, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, true, DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT, Enum136.SKYRIDER_MONOLOGUE_EVENT_DRASSEN_SAM_SITE, 1);

      if (SAMSitesUnderPlayerControl(SAM_2_X, SAM_2_Y) == false) {
        CharacterDialogue(Enum268.SKYRIDER, SECOND_HALF_OF_MENTION_DRASSEN_SAM_SITE, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);
      } else {
        // Ian says don't use the SAM site quote unless player has tried flying already
        if (CheckFact(Enum170.FACT_SKYRIDER_USED_IN_MAPSCREEN, Enum268.SKYRIDER)) {
          CharacterDialogue(Enum268.SKYRIDER, SAM_SITE_TAKEN, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);
          gfSkyriderSaidCongratsOnTakingSAM = true;
        }
      }

      CharacterDialogueWithSpecialEvent(Enum268.SKYRIDER, MENTION_DRASSEN_SAM_SITE, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, true, DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT, Enum136.SKYRIDER_MONOLOGUE_EVENT_DRASSEN_SAM_SITE, 2);
      break;

    case (1):
      // highlight Drassen SAM site sector
      fShowDrassenSAMHighLight = true;
      SetSAMSiteAsFound(Enum138.SAM_SITE_TWO);
      break;

    case (2):
      fShowDrassenSAMHighLight = false;
      break;
  }
  return;
}

function HandleSkyRiderMonologueAboutCambriaHospital(uiSpecialCode: UINT32): void {
  switch (uiSpecialCode) {
    case (0):
      // gpCurrentTalkingFace = &gFacesData[ uiExternalStaticNPCFaces[ SKYRIDER_EXTERNAL_FACE ] ];
      // gubCurrentTalkingID = SKYRIDER;

      // if special event data 2 is true, then do dialogue, else this is just a trigger for an event
      CharacterDialogue(Enum268.SKYRIDER, MENTION_HOSPITAL_IN_CAMBRIA, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);
      CharacterDialogueWithSpecialEvent(Enum268.SKYRIDER, MENTION_HOSPITAL_IN_CAMBRIA, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, true, DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT, Enum136.SKYRIDER_MONOLOGUE_EVENT_CAMBRIA_HOSPITAL, 1);

      // highlight Drassen hospital sector
      fShowCambriaHospitalHighLight = true;
      break;

    case (1):
      fShowCambriaHospitalHighLight = false;
      break;
  }
  return;
}

function HandleSkyRiderMonologueAboutOtherSAMSites(uiSpecialCode: UINT32): void {
  // handle skyrider telling player about other sam sites..on fifth hiring or after one near drassen is taken out

  switch (uiSpecialCode) {
    case (0):
      // do quote 21
      gpCurrentTalkingFace = gFacesData[uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE]];
      gubCurrentTalkingID = Enum268.SKYRIDER;

      // if special event data 2 is true, then do dialogue, else this is just a trigger for an event
      CharacterDialogue(Enum268.SKYRIDER, SPIEL_ABOUT_OTHER_SAM_SITES, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);
      CharacterDialogueWithSpecialEvent(Enum268.SKYRIDER, SPIEL_ABOUT_OTHER_SAM_SITES, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false, DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT, Enum136.SKYRIDER_MONOLOGUE_EVENT_OTHER_SAM_SITES, 1);

      CharacterDialogue(Enum268.SKYRIDER, SECOND_HALF_OF_SPIEL_ABOUT_OTHER_SAM_SITES, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false);
      CharacterDialogueWithSpecialEvent(Enum268.SKYRIDER, SPIEL_ABOUT_OTHER_SAM_SITES, uiExternalStaticNPCFaces[Enum203.SKYRIDER_EXTERNAL_FACE], DIALOGUE_EXTERNAL_NPC_UI, false, false, DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT, Enum136.SKYRIDER_MONOLOGUE_EVENT_OTHER_SAM_SITES, 2);

      break;

    case (1):
      // highlight other SAMs
      fShowOtherSAMHighLight = true;
      // reveal other 3 SAM sites
      SetSAMSiteAsFound(Enum138.SAM_SITE_ONE);
      SetSAMSiteAsFound(Enum138.SAM_SITE_THREE);
      SetSAMSiteAsFound(Enum138.SAM_SITE_FOUR);
      break;

    case (2):
      fShowOtherSAMHighLight = false;
      break;
  }
  return;
}

export function CheckAndHandleSkyriderMonologues(): void {
  // wait at least this many days between Skyrider monologues
  if ((GetWorldTotalMin() - guiTimeOfLastSkyriderMonologue) >= (MIN_DAYS_BETWEEN_SKYRIDER_MONOLOGUES * 24 * 60)) {
    if (guiHelicopterSkyriderTalkState == 0) {
      HandleSkyRiderMonologueEvent(Enum136.SKYRIDER_MONOLOGUE_EVENT_DRASSEN_SAM_SITE, 0);
      guiHelicopterSkyriderTalkState = 1;
    } else if (guiHelicopterSkyriderTalkState == 1) {
      // if enemy still controls the Cambria hospital sector
      if (StrategicMap[CALCULATE_STRATEGIC_INDEX(HOSPITAL_SECTOR_X, HOSPITAL_SECTOR_Y)].fEnemyControlled) {
        HandleSkyRiderMonologueEvent(Enum136.SKYRIDER_MONOLOGUE_EVENT_CAMBRIA_HOSPITAL, 0);
      }
      // advance state even if player already has Cambria's hospital sector!!!
      guiHelicopterSkyriderTalkState = 2;
    } else if (guiHelicopterSkyriderTalkState == 2) {
      // wait until player has taken over a SAM site before saying this and advancing state
      if (gfSkyriderSaidCongratsOnTakingSAM) {
        HandleSkyRiderMonologueEvent(Enum136.SKYRIDER_MONOLOGUE_EVENT_OTHER_SAM_SITES, 0);
        guiHelicopterSkyriderTalkState = 3;
      }
    } else if (guiHelicopterSkyriderTalkState == 3) {
      // wait until Estoni refuelling site becomes available
      if (fRefuelingSiteAvailable[Enum137.ESTONI_REFUELING_SITE]) {
        HandleSkyRiderMonologueEvent(Enum136.SKYRIDER_MONOLOGUE_EVENT_ESTONI_REFUEL, 0);
        guiHelicopterSkyriderTalkState = 4;
      }
    }
  }
}

// these don't need to be saved, they merely turn off the highlights after they stop flashing
/* static */ let HandleAnimationOfSectors__fOldShowDrassenSAMHighLight: boolean = false;
/* static */ let HandleAnimationOfSectors__fOldShowCambriaHospitalHighLight: boolean = false;
/* static */ let HandleAnimationOfSectors__fOldShowEstoniRefuelHighLight: boolean = false;
/* static */ let HandleAnimationOfSectors__fOldShowOtherSAMHighLight: boolean = false;
export function HandleAnimationOfSectors(): void {
  let fSkipSpeakersLocator: boolean = false;

  // find out which mode we are in and animate for that mode

  // Drassen SAM site
  if (fShowDrassenSAMHighLight) {
    HandleAnimationOfSectors__fOldShowDrassenSAMHighLight = true;
    // Drassen's SAM site is #3
    HandleBlitOfSectorLocatorIcon(SAM_2_X, SAM_2_Y, 0, Enum156.LOCATOR_COLOR_RED);
    fSkipSpeakersLocator = true;
  } else if (HandleAnimationOfSectors__fOldShowDrassenSAMHighLight) {
    HandleAnimationOfSectors__fOldShowDrassenSAMHighLight = false;
    fMapPanelDirty = true;
  }

  // Cambria hospital
  if (fShowCambriaHospitalHighLight) {
    HandleAnimationOfSectors__fOldShowCambriaHospitalHighLight = true;
    HandleBlitOfSectorLocatorIcon(HOSPITAL_SECTOR_X, HOSPITAL_SECTOR_Y, 0, Enum156.LOCATOR_COLOR_RED);
    fSkipSpeakersLocator = true;
  } else if (HandleAnimationOfSectors__fOldShowCambriaHospitalHighLight) {
    HandleAnimationOfSectors__fOldShowCambriaHospitalHighLight = false;
    fMapPanelDirty = true;
  }

  // show other SAM sites
  if (fShowOtherSAMHighLight) {
    HandleAnimationOfSectors__fOldShowOtherSAMHighLight = true;
    HandleBlitOfSectorLocatorIcon(SAM_1_X, SAM_1_Y, 0, Enum156.LOCATOR_COLOR_RED);
    HandleBlitOfSectorLocatorIcon(SAM_3_X, SAM_3_Y, 0, Enum156.LOCATOR_COLOR_RED);
    HandleBlitOfSectorLocatorIcon(SAM_4_X, SAM_4_Y, 0, Enum156.LOCATOR_COLOR_RED);
    fSkipSpeakersLocator = true;
  } else if (HandleAnimationOfSectors__fOldShowOtherSAMHighLight) {
    HandleAnimationOfSectors__fOldShowOtherSAMHighLight = false;
    fMapPanelDirty = true;
  }

  // show Estoni site
  if (fShowEstoniRefuelHighLight) {
    HandleAnimationOfSectors__fOldShowEstoniRefuelHighLight = true;
    HandleBlitOfSectorLocatorIcon(ubRefuelList[Enum137.ESTONI_REFUELING_SITE][0], ubRefuelList[Enum137.ESTONI_REFUELING_SITE][1], 0, Enum156.LOCATOR_COLOR_RED);
    fSkipSpeakersLocator = true;
  } else if (HandleAnimationOfSectors__fOldShowEstoniRefuelHighLight) {
    HandleAnimationOfSectors__fOldShowEstoniRefuelHighLight = false;
    fMapPanelDirty = true;
  }

  // don't show sector locator over the speaker's sector if he is talking about another sector - it's confusing
  if (!fSkipSpeakersLocator) {
    switch (gubBlitSectorLocatorCode) {
      case Enum156.LOCATOR_COLOR_RED: // normal one used for mines (will now be overriden with yellow)
        HandleBlitOfSectorLocatorIcon(gsSectorLocatorX, gsSectorLocatorY, 0, Enum156.LOCATOR_COLOR_RED);
        break;
      case Enum156.LOCATOR_COLOR_YELLOW: // used for all other dialogues
        HandleBlitOfSectorLocatorIcon(gsSectorLocatorX, gsSectorLocatorY, 0, Enum156.LOCATOR_COLOR_YELLOW);
        break;
    }
  }

  return;
}

function LastSectorInHelicoptersPath(): INT16 {
  // get the last sector value in the helictoper's path
  let pNode: PathStPtr = null;
  let uiLocation: UINT32 = 0;

  // if the heli is on the move, what is the distance it will move..the length of the merc path, less the first node
  if (CanHelicopterFly() == false) {
    // big number, no go
    return 0;
  }

  uiLocation = pVehicleList[iHelicopterVehicleId].sSectorX + pVehicleList[iHelicopterVehicleId].sSectorY * MAP_WORLD_X;

  pNode = pVehicleList[iHelicopterVehicleId].pMercPath;

  // any path yet?
  if (pNode != null) {
    while (pNode) {
      uiLocation = pNode.value.uiSectorId;

      pNode = pNode.value.pNext;
    }
  }

  pNode = MoveToBeginningOfPathList(pTempHelicopterPath);
  // any path yet?
  if (pNode != null) {
    while (pNode) {
      uiLocation = pNode.value.uiSectorId;

      pNode = pNode.value.pNext;
    }
  }

  return uiLocation;
}

/*
INT32 GetTotalCostOfHelicopterTrip( void )
{
        // get cost of helicopter trip

        PathStPtr pNode = NULL, pTempNode = NULL;
        UINT32 uiCost = 0;
        UINT32 uiLastTempPathSectorId = 0;
        UINT32 iClosestRefuelPoint = 0;
        UINT32 uiStartSectorNum = 0;
        UINT32 uiLength = 0;

        // if the heli is on the move, what is the distance it will move..the length of the merc path, less the first node
        if( CanHelicopterFly( ) == FALSE )
        {
                // big number, no go
                return( 0 );
        }

        pNode = pVehicleList[ iHelicopterVehicleId ].pMercPath;

        // any path yet?
        uiLastTempPathSectorId = pVehicleList[ iHelicopterVehicleId ].sSectorX + pVehicleList[ iHelicopterVehicleId ].sSectorY * MAP_WORLD_X;
        uiStartSectorNum = uiLastTempPathSectorId;

        if( pNode )
        {
                pNode = pNode->pNext;
        }

        if( pNode != NULL )
        {
                while( pNode)
                {
                        if( uiLength == 0 )
                        {
                                if( pNode->pNext )
                                {
                                        if( uiLastTempPathSectorId == pNode->pNext->uiSectorId )
                                        {
                                                // do nothing
                                        }
                                        else
                                        {
                                                uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pNode->uiSectorId / MAP_WORLD_X ) );
                                        }
                                }
                                else
                                {
                                        uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pNode->uiSectorId / MAP_WORLD_X ) );
                                }
                        }
                        else
                        {
                                uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pNode->uiSectorId / MAP_WORLD_X ) );
                        }

                        uiLength++;

                        uiLastTempPathSectorId = pNode ->uiSectorId;
                        pNode = pNode ->pNext;
                }
        }


        pNode = NULL;

        if( pTempHelicopterPath )
        {
                pNode = MoveToBeginningOfPathList( pTempHelicopterPath );
        }

        if( pNode )
        {
                pNode = pNode->pNext;
        }

        // any path yet?
        if( pNode != NULL )
        {
                while( pNode )
                {
                        if( uiLength == 0 )
                        {
                                if( pNode->pNext )
                                {
                                        if( uiLastTempPathSectorId == pNode->pNext->uiSectorId )
                                        {
                                                // do nothing
                                        }
                                        else
                                        {
                                                uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pNode->uiSectorId / MAP_WORLD_X ) );
                                        }
                                }
                                else
                                {
                                        uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pNode->uiSectorId / MAP_WORLD_X ) );
                                }
                        }
                        else
                        {
                                uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pNode->uiSectorId / MAP_WORLD_X ) );
                        }

                        uiLength++;

                        //uiCost += GetCostOfPassageForHelicopter( ( UINT16 ) ( pNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pNode->uiSectorId / MAP_WORLD_X ) );
                        uiLastTempPathSectorId = pNode ->uiSectorId;
                        pNode = pNode ->pNext;
                }
        }

        iClosestRefuelPoint = ( INT16 )( CALCULATE_STRATEGIC_INDEX( ubRefuelList[ LocationOfNearestRefuelPoint( FALSE ) ][ 0 ], ubRefuelList[ LocationOfNearestRefuelPoint( FALSE ) ][ 1 ] ) );

        pNode = NULL;

        if( uiLastTempPathSectorId != iClosestRefuelPoint )
        {
                pNode = BuildAStrategicPath( pNode, ( INT16 )( uiLastTempPathSectorId ), ( INT16 )iClosestRefuelPoint, pVehicleList[ iHelicopterVehicleId ].ubMovementGroup, FALSE );
//		pNode = BuildAStrategicPath( pNode, ( INT16 )( uiLastTempPathSectorId ), ( INT16 )iClosestRefuelPoint, pVehicleList[ iHelicopterVehicleId ].ubMovementGroup, FALSE, TRUE );

                pNode = MoveToBeginningOfPathList( pNode );
        }

        pTempNode = pNode;
        uiLength = 0;

        if( pTempNode )
        {
                pTempNode = pTempNode->pNext;
        }

        while( pTempNode )
        {
                if( uiLength == 0 )
                        {
                                if( pTempNode->pNext )
                                {
                                        if( uiLastTempPathSectorId == pNode->pNext->uiSectorId )
                                        {
                                                // do nothing
                                        }
                                        else
                                        {
                                                uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pTempNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pTempNode->uiSectorId / MAP_WORLD_X ) );
                                        }
                                }
                                else
                                {
                                        uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pTempNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pTempNode->uiSectorId / MAP_WORLD_X ) );
                                }
                        }
                        else
                        {
                                uiCost += GetCostOfPassageForHelicopter( ( UINT16 )( pTempNode -> uiSectorId % MAP_WORLD_X ), ( UINT16 ) ( pTempNode->uiSectorId / MAP_WORLD_X ) );
                        }

                uiLength++;
                pTempNode = pTempNode->pNext;
        }

        return( ( INT32 )uiCost );
}
*/

export function HandleHelicopterOnGroundGraphic(): void {
  let ubSite: UINT8 = 0;
  let pSoldier: SOLDIERTYPE | null;

  // no worries if underground
  if (gbWorldSectorZ != 0) {
    return;
  }

  for (ubSite = 0; ubSite < Enum137.NUMBER_OF_REFUEL_SITES; ubSite++) {
    // is this refueling site sector the loaded sector ?
    if ((ubRefuelList[ubSite][0] == gWorldSectorX) && (ubRefuelList[ubSite][1] == gWorldSectorY)) {
      // YES, so find out if the chopper is landed here
      if (IsHelicopterOnGroundAtRefuelingSite(ubSite)) {
        // Add....
        AddHelicopterToMaps(true, ubSite);
        // ATE: Add skyridder too
        // ATE: only if hired......
        if (fHelicopterAvailable) {
          gMercProfiles[Enum268.SKYRIDER].sSectorX = gWorldSectorX;
          gMercProfiles[Enum268.SKYRIDER].sSectorY = gWorldSectorY;
        }
      } else {
        AddHelicopterToMaps(false, ubSite);
        // ATE: Remove skyridder....
        if (fHelicopterAvailable) {
          gMercProfiles[Enum268.SKYRIDER].sSectorX = 0;
          gMercProfiles[Enum268.SKYRIDER].sSectorY = 0;

          // see if we can find him and remove him if so....
          pSoldier = FindSoldierByProfileID(Enum268.SKYRIDER, false);

          // ATE: Don't do this if buddy is on our team!
          if (pSoldier != null && pSoldier.bTeam != gbPlayerNum) {
            TacticalRemoveSoldier(pSoldier.ubID);
          }
        }
      }

      // Invalidate rendering
      InvalidateWorldRedundency();

      // can't be 2 places at once!
      break;
    }
  }
}

export function HandleHelicopterOnGroundSkyriderProfile(): void {
  let ubSite: UINT8 = 0;
  let pSoldier: SOLDIERTYPE | null;

  // no worries if underground
  if (gbWorldSectorZ != 0) {
    return;
  }

  for (ubSite = 0; ubSite < Enum137.NUMBER_OF_REFUEL_SITES; ubSite++) {
    // is this refueling site sector the loaded sector ?
    if ((ubRefuelList[ubSite][0] == gWorldSectorX) && (ubRefuelList[ubSite][1] == gWorldSectorY)) {
      // YES, so find out if the chopper is landed here
      if (IsHelicopterOnGroundAtRefuelingSite(ubSite)) {
        // ATE: Add skyridder too
        // ATE: only if hired......
        if (fHelicopterAvailable) {
          gMercProfiles[Enum268.SKYRIDER].sSectorX = gWorldSectorX;
          gMercProfiles[Enum268.SKYRIDER].sSectorY = gWorldSectorY;
        }
      } else {
        // ATE: Remove skyridder....
        if (fHelicopterAvailable) {
          gMercProfiles[Enum268.SKYRIDER].sSectorX = 0;
          gMercProfiles[Enum268.SKYRIDER].sSectorY = 0;

          // see if we can find him and remove him if so....
          pSoldier = FindSoldierByProfileID(Enum268.SKYRIDER, false);

          // ATE: Don't do this if buddy is on our team!
          if (pSoldier != null && pSoldier.bTeam != gbPlayerNum) {
            TacticalRemoveSoldier(pSoldier.ubID);
          }
        }
      }

      // can't be 2 places at once!
      break;
    }
  }
}

function IsHelicopterOnGroundAtRefuelingSite(ubRefuelingSite: UINT8): boolean {
  if (fHelicopterDestroyed) {
    return false;
  }

  if (fHelicopterIsAirBorne) {
    return false;
  }

  // if we haven't even met SkyRider
  if (!fSkyRiderSetUp) {
    // then it's always at Drassen
    if (ubRefuelingSite == Enum137.DRASSEN_REFUELING_SITE) {
      return true;
    } else {
      return false;
    }
  }

  // skyrider is setup, helicopter isn't destroyed, so this ought to be a valid vehicle id
  Assert(iHelicopterVehicleId != -1);

  // on the ground, but is it at this site or at another one?
  if ((ubRefuelList[ubRefuelingSite][0] == pVehicleList[iHelicopterVehicleId].sSectorX) && (ubRefuelList[ubRefuelingSite][1] == pVehicleList[iHelicopterVehicleId].sSectorY)) {
    return true;
  }

  // not here
  return false;
}

/*
BOOLEAN WillAirRaidBeStopped( INT16 sSectorX, INT16 sSectorY )
{
        UINT8 ubSamNumber = 0;
        INT8 bSAMCondition;
        UINT8 ubChance;


        // if enemy controls this SAM site, then it can't stop an air raid
        if( StrategicMap[CALCULATE_STRATEGIC_INDEX( sSectorX, sSectorY ) ].fEnemyAirControlled == TRUE )
        {
                return( FALSE );
        }

        // which SAM controls this sector?
        ubSamNumber = ubSAMControlledSectors[ sSectorX ][ sSectorY ];

        // if none of them
        if (ubSamNumber == 0)
        {
                return( FALSE);
        }

        // get the condition of that SAM site (NOTE: SAM #s are 1-4, but indexes are 0-3!!!)
        Assert( ubSamNumber <= NUMBER_OF_SAMS );
        bSAMCondition = StrategicMap[ SECTOR_INFO_TO_STRATEGIC_INDEX( pSamList[ ubSamNumber - 1 ] ) ].bSAMCondition;

        // if it's too busted to work, then it can't stop an air raid
        if( bSAMCondition < MIN_CONDITION_FOR_SAM_SITE_TO_WORK )
        {
                // no problem, SAM site not working
                return( FALSE );
        }


        // Friendly airspace controlled by a working SAM site, so SAM site fires a SAM at air raid bomber

        // calc chance that chopper will be shot down
        ubChance = bSAMCondition;

        // there's a fair chance of a miss even if the SAM site is in perfect working order
        if (ubChance > MAX_SAM_SITE_ACCURACY)
        {
                ubChance = MAX_SAM_SITE_ACCURACY;
        }

        if( PreRandom( 100 ) < ubChance)
        {
                return( TRUE );
        }

        return( FALSE );
}
*/

function HeliCrashSoundStopCallback(pData: any): void {
  SkyriderDestroyed();
}

function HandleSAMSiteAttackOfHelicopterInSector(sSectorX: INT16, sSectorY: INT16): boolean {
  let ubSamNumber: UINT8 = 0;
  let bSAMCondition: INT8;
  let ubChance: UINT8;

  // if this sector is in friendly airspace, we're safe
  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].fEnemyAirControlled == false) {
    // no problem, friendly airspace
    return false;
  }

  // which SAM controls this sector?
  ubSamNumber = ubSAMControlledSectors[sSectorX][sSectorY];

  // if none of them
  if (ubSamNumber == 0) {
    return false;
  }

  // get the condition of that SAM site (NOTE: SAM #s are 1-4, but indexes are 0-3!!!)
  Assert(ubSamNumber <= NUMBER_OF_SAMS);
  bSAMCondition = StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(pSamList[ubSamNumber - 1])].bSAMCondition;

  // if the SAM site is too damaged to be a threat
  if (bSAMCondition < MIN_CONDITION_FOR_SAM_SITE_TO_WORK) {
    // no problem, SAM site not working
    return false;
  }

  // Hostile airspace controlled by a working SAM site, so SAM site fires a SAM at Skyrider!!!

  // calc chance that chopper will be shot down
  ubChance = bSAMCondition;

  // there's a fair chance of a miss even if the SAM site is in perfect working order
  if (ubChance > MAX_SAM_SITE_ACCURACY) {
    ubChance = MAX_SAM_SITE_ACCURACY;
  }

  if (PreRandom(100) < ubChance) {
    // another hit!
    gubHelicopterHitsTaken++;

    // Took a hit!  Pause time so player can reconsider
    StopTimeCompression();

    // first hit?
    if (gubHelicopterHitsTaken == 1) {
      HeliCharacterDialogue(pSkyRider, HELI_TOOK_MINOR_DAMAGE);
    }
    // second hit?
    else if (gubHelicopterHitsTaken == 2) {
      // going back to base (no choice, dialogue says so)
      HeliCharacterDialogue(pSkyRider, HELI_TOOK_MAJOR_DAMAGE);
      MakeHeliReturnToBase();
    }
    // third hit!
    else {
      // Important: Skyrider must still be alive when he talks, so must do this before heli is destroyed!
      HeliCharacterDialogue(pSkyRider, HELI_GOING_DOWN);

      // everyone die die die
      // play sound
      if (PlayJA2StreamingSampleFromFile("stsounds\\blah2.wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN, HeliCrashSoundStopCallback) == SOUND_ERROR) {
        // Destroy here if we cannot play streamed sound sample....
        SkyriderDestroyed();
      } else {
        // otherwise it's handled in the callback
        // remove any arrival events for the helicopter's group
        DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, pVehicleList[iHelicopterVehicleId].ubMovementGroup);
      }

      // special return code indicating heli was destroyed
      return true;
    }
  }

  // still flying
  return false;
}

// are we at the end of the path for the heli?
function EndOfHelicoptersPath(): boolean {
  if (pVehicleList[iHelicopterVehicleId].pMercPath == null) {
    return true;
  }

  if ((<PathSt>pVehicleList[iHelicopterVehicleId].pMercPath).pNext == null) {
    return true;
  }

  return false;
}

// check if helicopter can take off?
export function CanHelicopterTakeOff(): boolean {
  let sHelicopterSector: INT16 = 0;

  // if it's already in the air
  if (fHelicopterIsAirBorne == true) {
    return true;
  }

  // grab location
  sHelicopterSector = pVehicleList[iHelicopterVehicleId].sSectorX + pVehicleList[iHelicopterVehicleId].sSectorY * MAP_WORLD_X;
  // if it's not in enemy control, we can take off
  if (StrategicMap[sHelicopterSector].fEnemyControlled == false) {
    return true;
  }

  return false;
}

function AddHeliPeice(sGridNo: INT16, sOStruct: UINT16): void {
  let usDummy: UINT16;

  // ATE: Check first if already exists....
  if ((usDummy = TypeExistsInStructLayer(sGridNo, sOStruct)) === -1) {
    // place in the world
    AddStructToTail(sGridNo, sOStruct);
  }
}

function AddHelicopterToMaps(fAdd: boolean, ubSite: UINT8): void {
  let sGridNo: INT16 = sRefuelStartGridNo[ubSite];
  let sOStruct: INT16 = 0;
  let usGridNo: INT16;
  let sGridX: INT16;
  let sGridY: INT16;
  let sCentreGridX: INT16;
  let sCentreGridY: INT16;

  // find out what slot it is by which site
  if (ubSite == 0) {
    // drassen
    sOStruct = Enum312.FIRSTOSTRUCT1;
  } else {
    // estoni
    sOStruct = Enum312.FOURTHOSTRUCT1;
  }

  // are we adding or taking away
  if (fAdd) {
    AddHeliPeice(sGridNo, sOStruct);
    AddHeliPeice(sGridNo, (sOStruct + 1));
    AddHeliPeice((sGridNo - 800), (sOStruct + 2));
    AddHeliPeice(sGridNo, (sOStruct + 3));
    AddHeliPeice(sGridNo, (sOStruct + 4));
    AddHeliPeice((sGridNo - 800), (sOStruct + 5));

    InvalidateWorldRedundency();
    SetRenderFlags(RENDER_FLAG_FULL);

    // ATE: If any mercs here, bump them off!
    ({ sX: sCentreGridX, sY: sCentreGridY } = ConvertGridNoToXY(sGridNo));

    for (sGridY = sCentreGridY - 5; sGridY < sCentreGridY + 5; sGridY++) {
      for (sGridX = sCentreGridX - 5; sGridX < sCentreGridX + 5; sGridX++) {
        usGridNo = MAPROWCOLTOPOS(sGridY, sGridX);

        BumpAnyExistingMerc(usGridNo);
      }
    }
  } else {
    // remove from the world
    RemoveStruct(sRefuelStartGridNo[ubSite], (sOStruct));
    RemoveStruct(sRefuelStartGridNo[ubSite], (sOStruct + 1));
    RemoveStruct(sRefuelStartGridNo[ubSite] - 800, (sOStruct + 2));
    RemoveStruct(sRefuelStartGridNo[ubSite], (sOStruct + 3));
    RemoveStruct(sRefuelStartGridNo[ubSite], (sOStruct + 4));
    RemoveStruct(sRefuelStartGridNo[ubSite] - 800, (sOStruct + 5));

    InvalidateWorldRedundency();
    SetRenderFlags(RENDER_FLAG_FULL);
  }
}

export function IsSkyriderIsFlyingInSector(sSectorX: INT16, sSectorY: INT16): boolean {
  let pGroup: GROUP;

  // up and about?
  if (fHelicopterAvailable && (iHelicopterVehicleId != -1) && CanHelicopterFly() && fHelicopterIsAirBorne) {
    pGroup = GetGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup);

    // the right sector?
    if ((sSectorX == pGroup.ubSectorX) && (sSectorY == pGroup.ubSectorY)) {
      return true;
    }
  }

  return false;
}

export function IsGroupTheHelicopterGroup(pGroup: GROUP): boolean {
  if ((iHelicopterVehicleId != -1) && VehicleIdIsValid(iHelicopterVehicleId) && (pVehicleList[iHelicopterVehicleId].ubMovementGroup != 0) && (pVehicleList[iHelicopterVehicleId].ubMovementGroup == pGroup.ubGroupID)) {
    return true;
  }

  return false;
}

export function GetNumSafeSectorsInPath(): INT16 {
  // get the last sector value in the helictoper's path
  let pNode: PathStPtr = null;
  let uiLocation: UINT32 = 0;
  let uiCount: UINT32 = 0;
  let iHeliSector: INT32 = -1;
  let pGroup: GROUP;

  // if the heli is on the move, what is the distance it will move..the length of the merc path, less the first node
  if (CanHelicopterFly() == false) {
    // big number, no go
    return 0;
  }

  // may need to skip the sector the chopper is currently in
  iHeliSector = CALCULATE_STRATEGIC_INDEX(pVehicleList[iHelicopterVehicleId].sSectorX, pVehicleList[iHelicopterVehicleId].sSectorY);

  // get chopper's group ptr
  pGroup = GetGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup);

  pNode = pVehicleList[iHelicopterVehicleId].pMercPath;

  // any path yet?
  if (pNode != null) {
    // first node: skip it if that's the sector the chopper is currently in, AND
    // we're NOT gonna be changing directions (not actually performed until waypoints are rebuilt AFTER plotting is done)
    if ((pNode.value.uiSectorId == iHeliSector) && (pNode.value.pNext != null) && !GroupBetweenSectorsAndSectorXYIsInDifferentDirection(pGroup, GET_X_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId), GET_Y_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId))) {
      pNode = pNode.value.pNext;
    }

    while (pNode) {
      uiLocation = pNode.value.uiSectorId;

      if (!StrategicMap[uiLocation].fEnemyAirControlled) {
        uiCount++;
      }

      pNode = pNode.value.pNext;
    }
  }

  pNode = MoveToBeginningOfPathList(pTempHelicopterPath);
  // any path yet?
  if (pNode != null) {
    // first node: skip it if that's the sector the chopper is currently in, AND
    // we're NOT gonna be changing directions (not actually performed until waypoints are rebuilt AFTER plotting is done)
    // OR if the chopper has a mercpath, in which case this a continuation of it that would count the sector twice
    if (((pNode.value.uiSectorId == iHeliSector) && (pNode.value.pNext != null) && !GroupBetweenSectorsAndSectorXYIsInDifferentDirection(pGroup, GET_X_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId), GET_Y_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId))) || (GetLengthOfPath(pVehicleList[iHelicopterVehicleId].pMercPath) > 0)) {
      pNode = pNode.value.pNext;
    }

    while (pNode) {
      uiLocation = pNode.value.uiSectorId;

      if (!StrategicMap[uiLocation].fEnemyAirControlled) {
        uiCount++;
      }

      pNode = pNode.value.pNext;
    }
  }

  return uiCount;
}

export function GetNumUnSafeSectorsInPath(): INT16 {
  // get the last sector value in the helictoper's path
  let pNode: PathStPtr = null;
  let uiLocation: UINT32 = 0;
  let uiCount: UINT32 = 0;
  let iHeliSector: INT32 = -1;
  let pGroup: GROUP;

  // if the heli is on the move, what is the distance it will move..the length of the merc path, less the first node
  if (CanHelicopterFly() == false) {
    // big number, no go
    return 0;
  }

  // may need to skip the sector the chopper is currently in
  iHeliSector = CALCULATE_STRATEGIC_INDEX(pVehicleList[iHelicopterVehicleId].sSectorX, pVehicleList[iHelicopterVehicleId].sSectorY);

  // get chopper's group ptr
  pGroup = GetGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup);

  pNode = pVehicleList[iHelicopterVehicleId].pMercPath;

  // any path yet?
  if (pNode != null) {
    // first node: skip it if that's the sector the chopper is currently in, AND
    // we're NOT gonna be changing directions (not actually performed until waypoints are rebuilt AFTER plotting is done)
    if ((pNode.value.uiSectorId == iHeliSector) && (pNode.value.pNext != null) && !GroupBetweenSectorsAndSectorXYIsInDifferentDirection(pGroup, GET_X_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId), GET_Y_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId))) {
      pNode = pNode.value.pNext;
    }

    while (pNode) {
      uiLocation = pNode.value.uiSectorId;

      if (StrategicMap[uiLocation].fEnemyAirControlled) {
        uiCount++;
      }

      pNode = pNode.value.pNext;
    }
  }

  pNode = MoveToBeginningOfPathList(pTempHelicopterPath);
  // any path yet?
  if (pNode != null) {
    // first node: skip it if that's the sector the chopper is currently in, AND
    // we're NOT gonna be changing directions (not actually performed until waypoints are rebuilt AFTER plotting is done)
    // OR if the chopper has a mercpath, in which case this a continuation of it that would count the sector twice
    if (((pNode.value.uiSectorId == iHeliSector) && (pNode.value.pNext != null) && !GroupBetweenSectorsAndSectorXYIsInDifferentDirection(pGroup, GET_X_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId), GET_Y_FROM_STRATEGIC_INDEX(pNode.value.pNext.value.uiSectorId))) || (GetLengthOfPath(pVehicleList[iHelicopterVehicleId].pMercPath) > 0)) {
      pNode = pNode.value.pNext;
    }

    while (pNode) {
      uiLocation = pNode.value.uiSectorId;

      if (StrategicMap[uiLocation].fEnemyAirControlled) {
        uiCount++;
      }

      pNode = pNode.value.pNext;
    }
  }

  return uiCount;
}

function PaySkyriderBill(): void {
  // if we owe anything for the trip
  if (iTotalAccumulatedCostByPlayer > 0) {
    // if player can afford to pay the Skyrider bill
    if (LaptopSaveInfo.iCurrentBalance >= iTotalAccumulatedCostByPlayer) {
      // no problem, pay the man
      // add the transaction
      AddTransactionToPlayersBook(Enum80.PAYMENT_TO_NPC, Enum268.SKYRIDER, GetWorldTotalMin(), -iTotalAccumulatedCostByPlayer);
      ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pSkyriderText[0], iTotalAccumulatedCostByPlayer);
    } else {
      // money owed
      if (LaptopSaveInfo.iCurrentBalance > 0) {
        ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pSkyriderText[0], LaptopSaveInfo.iCurrentBalance);
        gMercProfiles[Enum268.SKYRIDER].iBalance = LaptopSaveInfo.iCurrentBalance - iTotalAccumulatedCostByPlayer;
        // add the transaction
        AddTransactionToPlayersBook(Enum80.PAYMENT_TO_NPC, Enum268.SKYRIDER, GetWorldTotalMin(), -LaptopSaveInfo.iCurrentBalance);
      } else {
        gMercProfiles[Enum268.SKYRIDER].iBalance = -iTotalAccumulatedCostByPlayer;
      }

      HeliCharacterDialogue(pSkyRider, OWED_MONEY_TO_SKYRIDER);
      ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pSkyriderText[1], -gMercProfiles[Enum268.SKYRIDER].iBalance);

      // kick everyone out! (we know we're in a safe sector if we're paying)
      MoveAllInHelicopterToFootMovementGroup();

      MakeHeliReturnToBase();
    }

    iTotalAccumulatedCostByPlayer = 0;
  }
}

export function PayOffSkyriderDebtIfAny(): void {
  let iAmountOwed: INT32;
  let iPayAmount: INT32;

  iAmountOwed = -gMercProfiles[Enum268.SKYRIDER].iBalance;

  // if we owe him anything, and have any money
  if ((iAmountOwed > 0) && (LaptopSaveInfo.iCurrentBalance > 0)) {
    iPayAmount = Math.min(iAmountOwed, LaptopSaveInfo.iCurrentBalance);

    // pay the man what we can
    gMercProfiles[Enum268.SKYRIDER].iBalance += iPayAmount;
    // add the transaction
    AddTransactionToPlayersBook(Enum80.PAYMENT_TO_NPC, Enum268.SKYRIDER, GetWorldTotalMin(), -iPayAmount);
    // tell player
    ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pSkyriderText[0], iPayAmount);

    // now whaddawe owe?
    iAmountOwed = -gMercProfiles[Enum268.SKYRIDER].iBalance;

    // if it wasn't enough
    if (iAmountOwed > 0) {
      ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pSkyriderText[1], iAmountOwed);
      HeliCharacterDialogue(pSkyRider, OWED_MONEY_TO_SKYRIDER);
    }
  }
}

function MakeHeliReturnToBase(): void {
  let iLocation: INT32 = 0;

  // if already at a refueling point
  if (CheckForArrivalAtRefuelPoint()) {
    ReFuelHelicopter();
  } else {
    // choose destination (closest refueling sector)
    iLocation = LocationOfNearestRefuelPoint(true);

    // null out path
    pVehicleList[iHelicopterVehicleId].pMercPath = ClearStrategicPathList(pVehicleList[iHelicopterVehicleId].pMercPath, pVehicleList[iHelicopterVehicleId].ubMovementGroup);

    // plot path to that sector
    pVehicleList[iHelicopterVehicleId].pMercPath = AppendStrategicPath(MoveToBeginningOfPathList(BuildAStrategicPath(null, GetLastSectorIdInVehiclePath(iHelicopterVehicleId), (CALCULATE_STRATEGIC_INDEX(ubRefuelList[iLocation][0], ubRefuelList[iLocation][1])), pVehicleList[iHelicopterVehicleId].ubMovementGroup, false /*, FALSE */)), pVehicleList[iHelicopterVehicleId].pMercPath);
    pVehicleList[iHelicopterVehicleId].pMercPath = MoveToBeginningOfPathList(pVehicleList[iHelicopterVehicleId].pMercPath);

    // rebuild the movement waypoints
    RebuildWayPointsForGroupPath(pVehicleList[iHelicopterVehicleId].pMercPath, pVehicleList[iHelicopterVehicleId].ubMovementGroup);

    fHeliReturnStraightToBase = true;
    fHoveringHelicopter = false;
  }

  // stop time compression if it's on so player can digest this
  StopTimeCompression();
}

export function SoldierAboardAirborneHeli(pSoldier: SOLDIERTYPE): boolean {
  Assert(pSoldier);

  // if not in a vehicle, or not aboard the helicopter
  if ((pSoldier.bAssignment != Enum117.VEHICLE) || (pSoldier.iVehicleId != iHelicopterVehicleId)) {
    return false;
  }

  // he's in the heli - is it airborne?
  if (!fHelicopterIsAirBorne) {
    // nope, it's currently on the ground
    return false;
  }

  // yes, airborne
  return true;
}

}
