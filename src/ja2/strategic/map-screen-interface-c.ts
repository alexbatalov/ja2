namespace ja2 {

// inventory pool position on screen
const MAP_INVEN_POOL_X = 300;
const MAP_INVEN_POOL_Y = 300;

// the number of help region messages
const NUMBER_OF_MAPSCREEN_HELP_MESSAGES = 5;

// number of LINKED LISTS for sets of leave items (each slot holds an unlimited # of items)
const NUM_LEAVE_LIST_SLOTS = 20;

const SELECTED_CHAR_ARROW_X = 8;

const SIZE_OF_UPDATE_BOX = 20;

// as deep as the map goes
const MAX_DEPTH_OF_MAP = 3;

// number of merc columns for four wide mode
const NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE = 4;

// number of merc columns for 2 wide mode
const NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE = 2;

// number needed for 4 wide mode to activate
const NUMBER_OF_MERCS_FOR_FOUR_WIDTH_UPDATE_PANEL = 4;

const DBL_CLICK_DELAY_FOR_MOVE_MENU = 200;

const TIMER_FOR_SHOW_EXIT_TO_TACTICAL_MESSAGE = 15000;

const REASON_FOR_SOLDIER_UPDATE_OFFSET_Y = (14);

const MAX_MAPSCREEN_FAST_HELP = 100;

const VEHICLE_ONLY = false;
const AND_ALL_ON_BOARD = true;

// the regions int he movemenu
const enum Enum145 {
  SQUAD_REGION = 0,
  VEHICLE_REGION,
  SOLDIER_REGION,
  DONE_REGION,
  CANCEL_REGION,
  OTHER_REGION,
}

// waiting list for update box
let iUpdateBoxWaitingList: INT32[] /* [MAX_CHARACTER_COUNT] */ = createArray(MAX_CHARACTER_COUNT, 0);

let pFastHelpMapScreenList: FASTHELPREGION[] /* [MAX_MAPSCREEN_FAST_HELP] */ = createArrayFrom(MAX_MAPSCREEN_FAST_HELP, createFastHelpRegion);

// the move menu region
let gMoveMenuRegion: MOUSE_REGION[] /* [MAX_POPUP_BOX_STRING_COUNT] */ = createArrayFrom(MAX_POPUP_BOX_STRING_COUNT, createMouseRegion);

let gMapScreenHelpTextMask: MOUSE_REGION = createMouseRegion();

export let fShowMapScreenHelpText: boolean = false;
let fScreenMaskForMoveCreated: boolean = false;
export let fLockOutMapScreenInterface: boolean = false;

let gsCustomErrorString: string /* CHAR16[128] */;

export let fShowUpdateBox: boolean = false;
let fInterfaceFastHelpTextActive: boolean = false;
export let fReBuildCharacterList: boolean = false;
let giSizeOfInterfaceFastHelpTextList: INT32 = 0;

// Animated sector locator icon variables.
export let gsSectorLocatorX: INT16;
export let gsSectorLocatorY: INT16;
export let gubBlitSectorLocatorCode: UINT8; // color
export let guiSectorLocatorGraphicID: UINT32; // icon graphic ID
// the animate time per frame in milliseconds
const ANIMATED_BATTLEICON_FRAME_TIME = 80;
const MAX_FRAME_COUNT_FOR_ANIMATED_BATTLE_ICON = 12;

let pMapScreenFastHelpLocationList: SGPPoint[] /* [] */ = [
  createSGPPointFrom(25, 200),
  createSGPPointFrom(150, 200),
  createSGPPointFrom(450, 430),
  createSGPPointFrom(400, 200),
  createSGPPointFrom(250, 100),
  createSGPPointFrom(100, 100),
  createSGPPointFrom(100, 100),
  createSGPPointFrom(100, 100),
  createSGPPointFrom(100, 100),
  createSGPPointFrom(150, 200),
  createSGPPointFrom(100, 100),
];

let pMapScreenFastHelpWidthList: INT32[] /* [] */ = [
  100,
  100,
  100,
  100,
  100,
  100,
  100,
  100,
  100,
  300,
];

// number of mercs in sector capable of moving
let giNumberOfSoldiersInSectorMoving: INT32 = 0;

// number of squads capable of moving
let giNumberOfSquadsInSectorMoving: INT32 = 0;

// number of vehicles in sector moving
let giNumberOfVehiclesInSectorMoving: INT32 = 0;

let iHeightOfInitFastHelpText: INT32 = 0;

// the list of soldiers that are moving
let pSoldierMovingList: SOLDIERTYPE[] /* Pointer<SOLDIERTYPE>[MAX_CHARACTER_COUNT] */ = createArray(MAX_CHARACTER_COUNT, <SOLDIERTYPE><unknown>null);
let fSoldierIsMoving: boolean[] /* [MAX_CHARACTER_COUNT] */ = createArray(MAX_CHARACTER_COUNT, false);

let pUpdateSoldierBox: SOLDIERTYPE[] /* Pointer<SOLDIERTYPE>[SIZE_OF_UPDATE_BOX] */ = createArray(SIZE_OF_UPDATE_BOX, <SOLDIERTYPE><unknown>null);

let giUpdateSoldierFaces: INT32[] /* [SIZE_OF_UPDATE_BOX] */ = createArray(SIZE_OF_UPDATE_BOX, 0);

// the squads thata re moving
let iSquadMovingList: INT32[] /* [NUMBER_OF_SQUADS] */ = createArray(Enum275.NUMBER_OF_SQUADS, 0);
let fSquadIsMoving: boolean[] /* INT32[NUMBER_OF_SQUADS] */ = createArray(Enum275.NUMBER_OF_SQUADS, false);

// the vehicles thata re moving
let iVehicleMovingList: INT32[] /* [NUMBER_OF_SQUADS] */ = createArray(Enum275.NUMBER_OF_SQUADS, 0);
let fVehicleIsMoving: boolean[] /* INT32[NUMBER_OF_SQUADS] */ = createArray(Enum275.NUMBER_OF_SQUADS, false);

let gMoveBoxScreenMask: MOUSE_REGION = createMouseRegion();

// has the inventory pool been selected to be on or off?
let fMapInventoryPoolInited: boolean = false;
export let fShowMapScreenMovementList: boolean = false;

export let gCharactersList: MapScreenCharacterSt[] /* [MAX_CHARACTER_COUNT + 1] */ = createArrayFrom(MAX_CHARACTER_COUNT + 1, createMapScreenCharacterSt);

export let gMapStatusBarsRegion: MOUSE_REGION = createMouseRegion();

let MovePosition: SGPPoint = createSGPPointFrom(450, 100);

// which lines are selected? .. for assigning groups of mercs to the same thing
export let fSelectedListOfMercsForMapScreen: boolean[] /* [MAX_CHARACTER_COUNT] */ = createArray(MAX_CHARACTER_COUNT, false);
export let fResetTimerForFirstEntryIntoMapScreen: boolean = false;
let iReasonForSoldierUpDate: INT32 = Enum154.NO_REASON_FOR_UPDATE;

// sam and mine icons
export let guiSAMICON: UINT32;

// disable team info panels due to battle roster
export let fDisableDueToBattleRoster: boolean = false;

// track old contract times
let iOldContractTimes: INT32[] /* [MAX_CHARACTER_COUNT] */ = createArray(MAX_CHARACTER_COUNT, 0);

// position of pop up box
export let giBoxY: INT32 = 0;

// screen mask for inventory pop up
let gInventoryScreenMask: MOUSE_REGION = createMouseRegion();

let gContractIconRegion: MOUSE_REGION = createMouseRegion();
let gInsuranceIconRegion: MOUSE_REGION = createMouseRegion();
let gDepositIconRegion: MOUSE_REGION = createMouseRegion();

// general line..current and old
export let giHighLine: INT32 = -1;

// assignment's line...glow box
export let giAssignHighLine: INT32 = -1;

// destination plot line....glow box
export let giDestHighLine: INT32 = -1;

// contract selection glow box
export let giContractHighLine: INT32 = -1;

// the sleep column glow box
export let giSleepHighLine: INT32 = -1;

// pop up box textures
export let guiPOPUPTEX: UINT32;
export let guiPOPUPBORDERS: UINT32;

// the currently selected character arrow
export let guiSelectedCharArrow: UINT32;

let guiUpdatePanelButtonsImage: INT32[] /* [2] */ = createArray(2, 0);
let guiUpdatePanelButtons: INT32[] /* [2] */ = createArray(2, 0);

// the update panel
export let guiUpdatePanel: UINT32;
export let guiUpdatePanelTactical: UINT32;

// the leave item list
let gpLeaveListHead: MERC_LEAVE_ITEM[] /* Pointer<MERC_LEAVE_ITEM>[NUM_LEAVE_LIST_SLOTS] */ = createArray(NUM_LEAVE_LIST_SLOTS, <MERC_LEAVE_ITEM><unknown>null);

// holds ids of mercs who left stuff behind
let guiLeaveListOwnerProfileId: UINT32[] /* [NUM_LEAVE_LIST_SLOTS] */ = createArray(NUM_LEAVE_LIST_SLOTS, 0);;

// flag to reset contract region glow
export let fResetContractGlow: boolean = false;

// timers for double click
let giDblClickTimersForMoveBoxMouseRegions: INT32[] /* [MAX_POPUP_BOX_STRING_COUNT] */ = createArray(MAX_POPUP_BOX_STRING_COUNT, 0);;

export let giExitToTactBaseTime: INT32 = 0;
export let guiSectorLocatorBaseTime: UINT32 = 0;

// which menus are we showing
export let fShowAssignmentMenu: boolean = false;
export let fShowTrainingMenu: boolean = false;
export let fShowAttributeMenu: boolean = false;
export let fShowSquadMenu: boolean = false;
export let fShowContractMenu: boolean = false;
export let fShowRemoveMenu: boolean = false;

let fRebuildMoveBox: boolean = false;

// positions for all the pop up boxes
export let ContractDimensions: SGPRect = createSGPRectFrom(0, 0, 140, 60);
export let ContractPosition: SGPPoint = createSGPPointFrom(120, 50);
export let AttributeDimensions: SGPRect = createSGPRectFrom(0, 0, 100, 95);
export let AttributePosition: SGPPoint = createSGPPointFrom(220, 150);
export let TrainDimensions: SGPRect = createSGPRectFrom(0, 0, 100, 95);
export let TrainPosition: SGPPoint = createSGPPointFrom(160, 150);
export let VehicleDimensions: SGPRect = createSGPRectFrom(0, 0, 80, 60);
export let VehiclePosition: SGPPoint = createSGPPointFrom(160, 150);

export let RepairPosition: SGPPoint = createSGPPointFrom(160, 150);
export let RepairDimensions: SGPRect = createSGPRectFrom(0, 0, 80, 80);

export let AssignmentDimensions: SGPRect = createSGPRectFrom(0, 0, 100, 95);
export let AssignmentPosition: SGPPoint = createSGPPointFrom(120, 150);
export let SquadPosition: SGPPoint = createSGPPointFrom(160, 150);
export let SquadDimensions: SGPRect = createSGPRectFrom(0, 0, 140, 60);

export let OrigContractPosition: SGPPoint = createSGPPointFrom(120, 50);
export let OrigAttributePosition: SGPPoint = createSGPPointFrom(220, 150);
export let OrigSquadPosition: SGPPoint = createSGPPointFrom(160, 150);
export let OrigAssignmentPosition: SGPPoint = createSGPPointFrom(120, 150);
export let OrigTrainPosition: SGPPoint = createSGPPointFrom(160, 150);
export let OrigVehiclePosition: SGPPoint = createSGPPointFrom(160, 150);

// extern BOOLEAN fMapExitDueToMessageBox;

// at least one merc was hired at some time
export let gfAtLeastOneMercWasHired: boolean = false;

// how many people does the player have?
// INT32 GetNumberOfCharactersOnPlayersTeam( void );

export function InitalizeVehicleAndCharacterList(): void {
  // will init the vehicle and character lists to zero
  gCharactersList.forEach(resetMapScreenCharacterSt);

  return;
}

export function SetEntryInSelectedCharacterList(bEntry: INT8): void {
  Assert((bEntry >= 0) && (bEntry < MAX_CHARACTER_COUNT));

  // set this entry to selected
  fSelectedListOfMercsForMapScreen[bEntry] = true;

  return;
}

export function ResetEntryForSelectedList(bEntry: INT8): void {
  Assert((bEntry >= 0) && (bEntry < MAX_CHARACTER_COUNT));

  // set this entry to selected
  fSelectedListOfMercsForMapScreen[bEntry] = false;

  return;
}

export function ResetSelectedListForMapScreen(): void {
  // set all the entries int he selected list to false
  fSelectedListOfMercsForMapScreen.fill(false);

  // if we still have a valid dude selected
  if ((bSelectedInfoChar != -1) && (gCharactersList[bSelectedInfoChar].fValid == true)) {
    // then keep him selected
    SetEntryInSelectedCharacterList(bSelectedInfoChar);
  }

  return;
}

export function IsEntryInSelectedListSet(bEntry: INT8): boolean {
  Assert((bEntry >= 0) && (bEntry < MAX_CHARACTER_COUNT));

  // is this entry in the selected list set?

  return fSelectedListOfMercsForMapScreen[bEntry];
}

export function ToggleEntryInSelectedList(bEntry: INT8): void {
  Assert((bEntry >= 0) && (bEntry < MAX_CHARACTER_COUNT));

  // toggle the value in the selected list
  fSelectedListOfMercsForMapScreen[bEntry] = !(fSelectedListOfMercsForMapScreen[bEntry]);

  return;
}

export function BuildSelectedListFromAToB(bA: INT8, bB: INT8): void {
  let bStart: INT8 = 0;
  let bEnd: INT8 = 0;

  // run from a to b..set slots as selected

  if (bA > bB) {
    bStart = bB;
    bEnd = bA;
  } else {
    bStart = bA;
    bEnd = bB;
  }

  // run through list and set all intermediaries to true

  for (bStart; bStart <= bEnd; bStart++) {
    SetEntryInSelectedCharacterList(bStart);
  }

  return;
}

export function MultipleCharacterListEntriesSelected(): boolean {
  let ubSelectedCnt: UINT8 = 0;
  let iCounter: INT32 = 0;

  // check if more than one person is selected in the selected list
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
      ubSelectedCnt++;
    }
  }

  if (ubSelectedCnt > 1) {
    return true;
  } else {
    return false;
  }
}

export function ResetAssignmentsForMercsTrainingUnpaidSectorsInSelectedList(bAssignment: INT8): void {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // valid character?
    if (gCharactersList[iCounter].fValid == false) {
      // nope
      continue;
    }

    pSoldier = Menptr[gCharactersList[iCounter].usSolID];

    if (pSoldier.bActive == false) {
      continue;
    }

    if (pSoldier.bAssignment == Enum117.TRAIN_TOWN) {
      if (SectorInfo[SECTOR(pSoldier.sSectorX, pSoldier.sSectorY)].fMilitiaTrainingPaid == false) {
        ResumeOldAssignment(pSoldier);
      }
    }
  }
}

export function ResetAssignmentOfMercsThatWereTrainingMilitiaInThisSector(sSectorX: INT16, sSectorY: INT16): void {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // valid character?
    if (gCharactersList[iCounter].fValid == false) {
      // nope
      continue;
    }

    pSoldier = Menptr[gCharactersList[iCounter].usSolID];

    if (pSoldier.bActive == false) {
      continue;
    }

    if (pSoldier.bAssignment == Enum117.TRAIN_TOWN) {
      if ((pSoldier.sSectorX == sSectorX) && (pSoldier.sSectorY == sSectorY) && (pSoldier.bSectorZ == 0)) {
        ResumeOldAssignment(pSoldier);
      }
    }
  }
}

/*
void PlotPathForSelectedCharacterList( INT16 sX, INT16 sY )
{
        INT32 iCounter = 0;
        // run through list and build paths for each character
        for( iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++ )
        {
                if( ( fSelectedListOfMercsForMapScreen[ iCounter ] == TRUE )&&( bSelectedDestChar != iCounter ) )
                {
                        // character is valid.. do this for every one not the bSelectedDestChar
                        PlotPathForCharacter( &Menptr[ gCharactersList[ iCounter ].usSolID ], sX, sY, FALSE );
                }
        }
}
*/

// check if the members of the selected list move with this guy... are they in the same mvt group?
export function DeselectSelectedListMercsWhoCantMoveWithThisGuy(pSoldier: SOLDIERTYPE): void {
  let iCounter: INT32 = 0;
  let pSoldier2: SOLDIERTYPE;

  // deselect any other selected mercs that can't travel together with pSoldier
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
        pSoldier2 = Menptr[gCharactersList[iCounter].usSolID];

        // skip the guy we are
        if (pSoldier == pSoldier2) {
          continue;
        }

        // NOTE ABOUT THE VEHICLE TESTS BELOW:
        // Vehicles and foot squads can't plot movement together!
        // The ETAs are different, and unlike squads, vehicles can't travel everywhere!
        // However, different vehicles CAN plot together, since they all travel at the same rates now

        // if anchor guy is IN a vehicle
        if (pSoldier.bAssignment == Enum117.VEHICLE) {
          if (!CanSoldierMoveWithVehicleId(pSoldier2, pSoldier.iVehicleId)) {
            // reset entry for selected list
            ResetEntryForSelectedList(iCounter);
          }
        }
        // if anchor guy IS a vehicle
        else if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
          if (!CanSoldierMoveWithVehicleId(pSoldier2, pSoldier.bVehicleID)) {
            // reset entry for selected list
            ResetEntryForSelectedList(iCounter);
          }
        }
        // if this guy is IN a vehicle
        else if (pSoldier2.bAssignment == Enum117.VEHICLE) {
          if (!CanSoldierMoveWithVehicleId(pSoldier, pSoldier2.iVehicleId)) {
            // reset entry for selected list
            ResetEntryForSelectedList(iCounter);
          }
        }
        // if this guy IS a vehicle
        else if (pSoldier2.uiStatusFlags & SOLDIER_VEHICLE) {
          if (!CanSoldierMoveWithVehicleId(pSoldier, pSoldier2.bVehicleID)) {
            // reset entry for selected list
            ResetEntryForSelectedList(iCounter);
          }
        }
        // reject those not a squad (vehicle handled above)
        else if (pSoldier2.bAssignment >= Enum117.ON_DUTY) {
          ResetEntryForSelectedList(iCounter);
        } else {
          // reject those not in the same sector
          if ((pSoldier.sSectorX != pSoldier2.sSectorX) || (pSoldier.sSectorY != pSoldier2.sSectorY) || (pSoldier.bSectorZ != pSoldier2.bSectorZ)) {
            ResetEntryForSelectedList(iCounter);
          }

          // if either is between sectors, they must be in the same movement group
          if ((pSoldier.fBetweenSectors || pSoldier2.fBetweenSectors) && (pSoldier.ubGroupID != pSoldier2.ubGroupID)) {
            ResetEntryForSelectedList(iCounter);
          }
        }

        // different movement groups in same sector is OK, even if they're not travelling together
      }
    }
  }

  return;
}

export function SelectUnselectedMercsWhoMustMoveWithThisGuy(): void {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      // if not already selected
      if (fSelectedListOfMercsForMapScreen[iCounter] == false) {
        pSoldier = Menptr[gCharactersList[iCounter].usSolID];

        // if on a squad or in a vehicle
        if ((pSoldier.bAssignment < Enum117.ON_DUTY) || (pSoldier.bAssignment == Enum117.VEHICLE)) {
          // and a member of that squad or vehicle is selected
          if (AnyMercInSameSquadOrVehicleIsSelected(pSoldier)) {
            // then also select this guy
            SetEntryInSelectedCharacterList(iCounter);
          }
        }
      }
    }
  }
}

function AnyMercInSameSquadOrVehicleIsSelected(pSoldier: SOLDIERTYPE): boolean {
  let iCounter: INT32 = 0;
  let pSoldier2: SOLDIERTYPE;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      // if selected
      if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
        pSoldier2 = Menptr[gCharactersList[iCounter].usSolID];

        // if they have the same assignment
        if (pSoldier.bAssignment == pSoldier2.bAssignment) {
          // same squad?
          if (pSoldier.bAssignment < Enum117.ON_DUTY) {
            return true;
          }

          // same vehicle?
          if ((pSoldier.bAssignment == Enum117.VEHICLE) && (pSoldier.iVehicleId == pSoldier2.iVehicleId)) {
            return true;
          }
        }

        // target guy is in a vehicle, and this guy IS that vehicle
        if ((pSoldier.bAssignment == Enum117.VEHICLE) && (pSoldier2.uiStatusFlags & SOLDIER_VEHICLE) && (pSoldier.iVehicleId == pSoldier2.bVehicleID)) {
          return true;
        }

        // this guy is in a vehicle, and the target guy IS that vehicle
        if ((pSoldier2.bAssignment == Enum117.VEHICLE) && (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) && (pSoldier2.iVehicleId == pSoldier.bVehicleID)) {
          return true;
        }
      }
    }
  }

  return false;
}

/* static */ let RestoreBackgroundForAssignmentGlowRegionList__iOldAssignmentLine: INT32 = -1;
export function RestoreBackgroundForAssignmentGlowRegionList(): void {
  // will restore the background region of the assignment list after a glow has ceased
  // ( a _LOST_MOUSE reason to the assignment region mvt callback handler )

  if (fShowAssignmentMenu == true) {
    // force update
    ForceUpDateOfBox(ghAssignmentBox);
    ForceUpDateOfBox(ghEpcBox);
    ForceUpDateOfBox(ghRemoveMercAssignBox);
    if (fShowSquadMenu == true) {
      ForceUpDateOfBox(ghSquadBox);
    } else if (fShowTrainingMenu == true) {
      ForceUpDateOfBox(ghTrainingBox);
    }
  }

  if (fDisableDueToBattleRoster) {
    return;
  }

  if (RestoreBackgroundForAssignmentGlowRegionList__iOldAssignmentLine != giAssignHighLine) {
    // restore background
    RestoreExternBackgroundRect(66, Y_START - 1, 118 + 1 - 67, (((MAX_CHARACTER_COUNT + 1) * (Y_SIZE() + 2)) + 1));

    // ARM: not good enough! must reblit the whole panel to erase glow chunk restored by help text disappearing!!!
    fTeamPanelDirty = true;

    // set old to current
    RestoreBackgroundForAssignmentGlowRegionList__iOldAssignmentLine = giAssignHighLine;
  }

  // leave
  return;
}

/* static */ let RestoreBackgroundForDestinationGlowRegionList__iOldDestinationLine: INT32 = -1;
export function RestoreBackgroundForDestinationGlowRegionList(): void {
  // will restore the background region of the destinationz list after a glow has ceased
  // ( a _LOST_MOUSE reason to the assignment region mvt callback handler )

  if (fDisableDueToBattleRoster) {
    return;
  }

  if (RestoreBackgroundForDestinationGlowRegionList__iOldDestinationLine != giDestHighLine) {
    // restore background
    RestoreExternBackgroundRect(182, Y_START - 1, 217 + 1 - 182, (((MAX_CHARACTER_COUNT + 1) * (Y_SIZE() + 2)) + 1));

    // ARM: not good enough! must reblit the whole panel to erase glow chunk restored by help text disappearing!!!
    fTeamPanelDirty = true;

    // set old to current
    RestoreBackgroundForDestinationGlowRegionList__iOldDestinationLine = giDestHighLine;
  }

  // leave
  return;
}

/* static */ let RestoreBackgroundForContractGlowRegionList__iOldContractLine: INT32 = -1;
export function RestoreBackgroundForContractGlowRegionList(): void {
  // will restore the background region of the destinationz list after a glow has ceased
  // ( a _LOST_MOUSE reason to the assignment region mvt callback handler )

  if (fDisableDueToBattleRoster) {
    return;
  }

  if (RestoreBackgroundForContractGlowRegionList__iOldContractLine != giContractHighLine) {
    // restore background
    RestoreExternBackgroundRect(222, Y_START - 1, 250 + 1 - 222, (((MAX_CHARACTER_COUNT + 1) * (Y_SIZE() + 2)) + 1));

    // ARM: not good enough! must reblit the whole panel to erase glow chunk restored by help text disappearing!!!
    fTeamPanelDirty = true;

    // set old to current
    RestoreBackgroundForContractGlowRegionList__iOldContractLine = giContractHighLine;

    // reset color rotation
    fResetContractGlow = true;
  }

  // leave
  return;
}

/* static */ let RestoreBackgroundForSleepGlowRegionList__iOldSleepHighLine: INT32 = -1;
export function RestoreBackgroundForSleepGlowRegionList(): void {
  // will restore the background region of the destinations list after a glow has ceased
  // ( a _LOST_MOUSE reason to the assignment region mvt callback handler )

  if (fDisableDueToBattleRoster) {
    return;
  }

  if (RestoreBackgroundForSleepGlowRegionList__iOldSleepHighLine != giSleepHighLine) {
    // restore background
    RestoreExternBackgroundRect(123, Y_START - 1, 142 + 1 - 123, (((MAX_CHARACTER_COUNT + 1) * (Y_SIZE() + 2)) + 1));

    // ARM: not good enough! must reblit the whole panel to erase glow chunk restored by help text disappearing!!!
    fTeamPanelDirty = true;

    // set old to current
    RestoreBackgroundForSleepGlowRegionList__iOldSleepHighLine = giSleepHighLine;

    // reset color rotation
    fResetContractGlow = true;
  }

  // leave
  return;
}

/* static */ let PlayGlowRegionSound__uiSoundId: UINT32 = 0;
export function PlayGlowRegionSound(): void {
  // play a new message sound, if there is one playing, do nothing
  if (PlayGlowRegionSound__uiSoundId != 0) {
    // is sound playing?..don't play new one
    if (SoundIsPlaying(PlayGlowRegionSound__uiSoundId) == true) {
      return;
    }
  }

  // otherwise no sound playing, play one
  PlayGlowRegionSound__uiSoundId = PlayJA2SampleFromFile("Sounds\\glowclick.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);

  return;
}

export function CharacterIsGettingPathPlotted(sCharNumber: INT16): boolean {
  // valid character number?
  if ((sCharNumber < 0) || (sCharNumber >= MAX_CHARACTER_COUNT)) {
    return false;
  }

  // is the character a valid one?
  if (gCharactersList[sCharNumber].fValid == false) {
    return false;
  }

  // if the highlighted line character is also selected
  if (((giDestHighLine != -1) && IsEntryInSelectedListSet(giDestHighLine)) || ((bSelectedDestChar != -1) && IsEntryInSelectedListSet(bSelectedDestChar))) {
    // then ALL selected lines will be affected
    if (IsEntryInSelectedListSet(sCharNumber)) {
      return true;
    }
  } else {
    // if he is *the* selected dude
    if (bSelectedDestChar == sCharNumber) {
      return true;
    }

    // ONLY the highlighted line will be affected
    if (sCharNumber == giDestHighLine) {
      return true;
    }
  }

  return false;
}

export function IsCharacterSelectedForAssignment(sCharNumber: INT16): boolean {
  // valid character number?
  if ((sCharNumber < 0) || (sCharNumber >= MAX_CHARACTER_COUNT)) {
    return false;
  }

  // is the character a valid one?
  if (gCharactersList[sCharNumber].fValid == false) {
    return false;
  }

  // if the highlighted line character is also selected
  if ((giAssignHighLine != -1) && IsEntryInSelectedListSet(giAssignHighLine)) {
    // then ALL selected lines will be affected
    if (IsEntryInSelectedListSet(sCharNumber)) {
      return true;
    }
  } else {
    // ONLY the highlighted line will be affected
    if (sCharNumber == giAssignHighLine) {
      return true;
    }
  }

  return false;
}

export function IsCharacterSelectedForSleep(sCharNumber: INT16): boolean {
  // valid character number?
  if ((sCharNumber < 0) || (sCharNumber >= MAX_CHARACTER_COUNT)) {
    return false;
  }

  // is the character a valid one?
  if (gCharactersList[sCharNumber].fValid == false) {
    return false;
  }

  // if the highlighted line character is also selected
  if ((giSleepHighLine != -1) && IsEntryInSelectedListSet(giSleepHighLine)) {
    // then ALL selected lines will be affected
    if (IsEntryInSelectedListSet(sCharNumber)) {
      return true;
    }
  } else {
    // ONLY the highlighted line will be affected
    if (sCharNumber == giSleepHighLine) {
      return true;
    }
  }

  return false;
}

export function DisableTeamInfoPanels(): void {
  // disable team info panel
  fDisableDueToBattleRoster = true;

  return;
}

export function EnableTeamInfoPanels(): void {
  // enable team info panel
  fDisableDueToBattleRoster = false;

  return;
}

/*
void ActivateSoldierPopup( SOLDIERTYPE *pSoldier, UINT8 ubPopupType, INT16 xp, INT16 yp )
{
        // will activate the pop up for prebattle interface

        // get the soldier id number
        INT8 bCounter = 0;
        INT8 bCharacter = -1;


        for( bCounter = 0; bCounter < MAX_CHARACTER_COUNT; bCounter++ )
        {
                if( gCharactersList[ bCounter ].fValid == TRUE )
                {
                        // is this guy the passed soldier?
                        if( pSoldier == &( Menptr[ gCharactersList[ bCounter ].usSolID ] ) )
                        {
                                bCharacter = bCounter;
                                break;
                        }
                }
        }

        giBoxY = ( INT32 ) yp;
        // which type of box do we show?
        switch( ubPopupType )
        {
                case( ASSIGNMENT_POPUP ):
                        bSelectedDestChar = -1;
                        bSelectedContractChar = -1;
                        bSelectedAssignChar = bCharacter;
                        if( ( pSoldier->bLife > 0 ) &&( pSoldier->bAssignment != ASSIGNMENT_POW ) )
                        {
                                fShowAssignmentMenu = TRUE;
                        }
                        else
                        {
                                fShowRemoveMenu = TRUE;
                        }

                        // set box y positions
                        AssignmentPosition.iY =  giBoxY;
                        TrainPosition.iY = AssignmentPosition.iY + GetFontHeight( MAP_SCREEN_FONT )* ASSIGN_MENU_TRAIN;
                        AttributePosition.iY = 	TrainPosition.iY;
                        SquadPosition.iY = 	AssignmentPosition.iY;
                        break;
                case( DESTINATION_POPUP ):
                        bSelectedDestChar = bCharacter;
                        bSelectedContractChar = -1;
                        bSelectedAssignChar = -1;

                        // set box y value
                        ContractPosition.iY = giBoxY;
                        break;
                case( CONTRACT_POPUP ):
                        bSelectedDestChar = -1;
                        bSelectedContractChar = bCharacter;
                        bSelectedAssignChar = -1;
                        RebuildContractBoxForMerc( pSoldier );

                        if( ( pSoldier->bLife > 0 ) &&( pSoldier->bAssignment != ASSIGNMENT_POW ) )
                        {
                                fShowContractMenu = TRUE;
                        }
                        else
                        {
                                fShowRemoveMenu = TRUE;
                        }
                        break;
        }
}
*/

export function DoMapMessageBoxWithRect(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK | null, pCenteringRect: SGPRect): INT32 {
  // reset the highlighted line
  giHighLine = -1;
  return DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, pCenteringRect);
}

export function DoMapMessageBox(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK | null): INT32 {
  let CenteringRect: SGPRect = createSGPRectFrom(0, 0, 640, INV_INTERFACE_START_Y);

  // reset the highlighted line
  giHighLine = -1;

  // do message box and return
  return DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, CenteringRect);
}

export function GoDownOneLevelInMap(): void {
  JumpToLevel(iCurrentMapSectorZ + 1);
}

export function GoUpOneLevelInMap(): void {
  JumpToLevel(iCurrentMapSectorZ - 1);
}

export function JumpToLevel(iLevel: INT32): void {
  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();
    return;
  }

  if (gfPreBattleInterfaceActive == true) {
    return;
  }

  // disable level-changes while in inventory pool (for keyboard equivalents!)
  if (fShowMapInventoryPool)
    return;

  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  if (iLevel < 0) {
    iLevel = 0;
  }

  if (iLevel > MAX_DEPTH_OF_MAP) {
    iLevel = MAX_DEPTH_OF_MAP;
  }

  // set current sector Z to level passed
  ChangeSelectedMapSector(sSelMapX, sSelMapY, iLevel);
}

// check against old contract times, update as nessacary
export function CheckAndUpdateBasedOnContractTimes(): void {
  let iCounter: INT32 = 0;
  let iTimeRemaining: INT32 = 0;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      // what kind of merc
      if (Menptr[gCharactersList[iCounter].usSolID].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
        // amount of time left on contract
        iTimeRemaining = Menptr[gCharactersList[iCounter].usSolID].iEndofContractTime - GetWorldTotalMin();
        if (iTimeRemaining > 60 * 24) {
          // more than a day, display in green
          iTimeRemaining = Math.trunc(iTimeRemaining / (60 * 24));

          // check if real change in contract time
          if (iTimeRemaining != iOldContractTimes[iCounter]) {
            iOldContractTimes[iCounter] = iTimeRemaining;

            // dirty screen
            fTeamPanelDirty = true;
            fCharacterInfoPanelDirty = true;
          }
        } else {
          // less than a day, display hours left in red
          iTimeRemaining = Math.trunc(iTimeRemaining / 60);

          // check if real change in contract time
          if (iTimeRemaining != iOldContractTimes[iCounter]) {
            iOldContractTimes[iCounter] = iTimeRemaining;
            // dirty screen
            fTeamPanelDirty = true;
            fCharacterInfoPanelDirty = true;
          }
        }
      } else if (Menptr[gCharactersList[iCounter].usSolID].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
        iTimeRemaining = Menptr[gCharactersList[iCounter].usSolID].iTotalContractLength;

        if (iTimeRemaining != iOldContractTimes[iCounter]) {
          iOldContractTimes[iCounter] = iTimeRemaining;

          // dirty screen
          fTeamPanelDirty = true;
          fCharacterInfoPanelDirty = true;
        }
      }
    }
  }
}

export function HandleDisplayOfSelectedMercArrows(): void {
  let sYPosition: INT16 = 0;
  let hHandle: SGPVObject;
  let ubCount: UINT8 = 0;
  // blit an arrow by the name of each merc in a selected list
  if (bSelectedInfoChar == -1) {
    return;
  }

  // is the character valid?
  if (gCharactersList[bSelectedInfoChar].fValid == false) {
    return;
  }

  if (fShowInventoryFlag == true) {
    return;
  }
  // now blit one by the selected merc
  sYPosition = Y_START + (bSelectedInfoChar * (Y_SIZE() + 2)) - 1;

  if (bSelectedInfoChar >= FIRST_VEHICLE) {
    sYPosition += 6;
  }

  hHandle = GetVideoObject(guiSelectedCharArrow);
  BltVideoObject(guiSAVEBUFFER, hHandle, 0, SELECTED_CHAR_ARROW_X, sYPosition, VO_BLT_SRCTRANSPARENCY, null);

  // now run through the selected list of guys, an arrow for each
  for (ubCount = 0; ubCount < MAX_CHARACTER_COUNT; ubCount++) {
    if (gCharactersList[ubCount].fValid == true) {
      // are they in the selected list or int he same mvt group as this guy
      if ((IsEntryInSelectedListSet(ubCount) == true) || ((bSelectedDestChar != -1) ? ((Menptr[gCharactersList[ubCount].usSolID].ubGroupID != 0) ? (Menptr[gCharactersList[bSelectedDestChar].usSolID].ubGroupID == Menptr[gCharactersList[ubCount].usSolID].ubGroupID) : false) : false)) {
        sYPosition = Y_START + (ubCount * (Y_SIZE() + 2)) - 1;
        if (ubCount >= FIRST_VEHICLE) {
          sYPosition += 6;
        }

        hHandle = GetVideoObject(guiSelectedCharArrow);
        BltVideoObject(guiSAVEBUFFER, hHandle, 0, SELECTED_CHAR_ARROW_X, sYPosition, VO_BLT_SRCTRANSPARENCY, null);
      }
    }
  }
  return;
}

/* static */ let HandleDisplayOfItemPopUpForSector__fWasInited: boolean = false;
export function HandleDisplayOfItemPopUpForSector(sMapX: INT16, sMapY: INT16, sMapZ: INT16): void {
  // handle display of item pop up for this sector
  // check if anyone alive in this sector
  let pItemPool: ITEM_POOL | null = null;

  if (bSelectedInfoChar == -1) {
    return;
  }

  if ((HandleDisplayOfItemPopUpForSector__fWasInited == false) && (fMapInventoryPoolInited)) {
    if (gCharactersList[bSelectedInfoChar].fValid == true) {
      if ((Menptr[gCharactersList[bSelectedInfoChar].usSolID].sSectorX == sMapX) && (Menptr[gCharactersList[bSelectedInfoChar].usSolID].sSectorY == sMapY) && (Menptr[gCharactersList[bSelectedInfoChar].usSolID].bSectorZ == sMapZ) && (Menptr[gCharactersList[bSelectedInfoChar].usSolID].bActive) && (Menptr[gCharactersList[bSelectedInfoChar].usSolID].bLife >= OKLIFE)) {
        // valid character
        InitializeItemPickupMenu(Menptr[gCharactersList[bSelectedInfoChar].usSolID], NOWHERE, pItemPool, MAP_INVEN_POOL_X, MAP_INVEN_POOL_Y, -1);
        HandleDisplayOfItemPopUpForSector__fWasInited = true;

        CreateScreenMaskForInventoryPoolPopUp();
      }
    }
  } else if ((HandleDisplayOfItemPopUpForSector__fWasInited == true) && (fMapInventoryPoolInited == false)) {
    HandleDisplayOfItemPopUpForSector__fWasInited = false;

    // now clear up the box
    RemoveItemPickupMenu();

    // remove screen mask
    RemoveScreenMaskForInventoryPoolPopUp();

    // drity nessacary regions
    fMapPanelDirty = true;
  }

  // showing it
  if ((fMapInventoryPoolInited) && (HandleDisplayOfItemPopUpForSector__fWasInited)) {
    SetPickUpMenuDirtyLevel(DIRTYLEVEL2);
    RenderItemPickupMenu();
  }

  return;
}

function CreateScreenMaskForInventoryPoolPopUp(): void {
  //  a screen mask for the inventory pop up
  MSYS_DefineRegion(gInventoryScreenMask, 0, 0, 640, 480, MSYS_PRIORITY_HIGH - 1, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, InventoryScreenMaskBtnCallback);
}

function RemoveScreenMaskForInventoryPoolPopUp(): void {
  // remove screen mask
  MSYS_RemoveRegion(gInventoryScreenMask);
}

// invnetory screen mask btn callback
function InventoryScreenMaskBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // inventory screen mask btn callback
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    fMapInventoryPoolInited = false;
  }
}

export function GetMoraleString(pSoldier: SOLDIERTYPE): string {
  let sString: string;

  let bMorale: INT8 = pSoldier.bMorale;

  if (pSoldier.uiStatusFlags & SOLDIER_DEAD) {
    sString = pMoralStrings[5];
  } else if (bMorale > 80) {
    sString = pMoralStrings[0];
  } else if (bMorale > 65) {
    sString = pMoralStrings[1];
  } else if (bMorale > 35) {
    sString = pMoralStrings[2];
  } else if (bMorale > 20) {
    sString = pMoralStrings[3];
  } else {
    sString = pMoralStrings[4];
  }

  return sString;
}

// NOTE: This doesn't use the "LeaveList" system at all!
export function HandleLeavingOfEquipmentInCurrentSector(uiMercId: UINT32): void {
  // just drop the stuff in the current sector
  let iCounter: INT32 = 0;
  let sGridNo: INT16;
  let sTempGridNo: INT16;

  if (Menptr[uiMercId].sSectorX != gWorldSectorX || Menptr[uiMercId].sSectorY != gWorldSectorY || Menptr[uiMercId].bSectorZ != gbWorldSectorZ) {
    // ATE: Use insertion gridno if not nowhere and insertion is gridno
    if (Menptr[uiMercId].ubStrategicInsertionCode == Enum175.INSERTION_CODE_GRIDNO && Menptr[uiMercId].usStrategicInsertionData != NOWHERE) {
      sGridNo = Menptr[uiMercId].usStrategicInsertionData;
    } else {
      // Set flag for item...
      sGridNo = RandomGridNo();
    }
  } else {
    // ATE: Mercs can have a gridno of NOWHERE.....
    sGridNo = Menptr[uiMercId].sGridNo;

    if (sGridNo == NOWHERE) {
      sGridNo = RandomGridNo();

      sTempGridNo = FindNearestAvailableGridNoForItem(sGridNo, 5);
      if (sTempGridNo == NOWHERE)
        sTempGridNo = FindNearestAvailableGridNoForItem(sGridNo, 15);

      if (sTempGridNo != NOWHERE) {
        sGridNo = sTempGridNo;
      }
    }
  }

  for (iCounter = 0; iCounter < Enum261.NUM_INV_SLOTS; iCounter++) {
    // slot found,
    // check if actual item
    if (Menptr[uiMercId].inv[iCounter].ubNumberOfObjects > 0) {
      if (Menptr[uiMercId].sSectorX != gWorldSectorX || Menptr[uiMercId].sSectorY != gWorldSectorY || Menptr[uiMercId].bSectorZ != gbWorldSectorZ) {
        // Set flag for item...
        AddItemsToUnLoadedSector(Menptr[uiMercId].sSectorX, Menptr[uiMercId].sSectorY, Menptr[uiMercId].bSectorZ, sGridNo, 1, [Menptr[uiMercId].inv[iCounter]], Menptr[uiMercId].bLevel, WOLRD_ITEM_FIND_SWEETSPOT_FROM_GRIDNO | WORLD_ITEM_REACHABLE, 0, 1, false);
      } else {
        AddItemToPool(sGridNo, Menptr[uiMercId].inv[iCounter], 1, Menptr[uiMercId].bLevel, WORLD_ITEM_REACHABLE, 0);
      }
    }
  }

  DropKeysInKeyRing(MercPtrs[uiMercId], sGridNo, MercPtrs[uiMercId].bLevel, 1, false, 0, false);
}

export function HandleMercLeavingEquipmentInOmerta(uiMercId: UINT32): void {
  let iSlotIndex: INT32 = 0;

  // stash the items into a linked list hanging of a free "leave item list" slot
  if ((iSlotIndex = SetUpDropItemListForMerc(uiMercId)) != -1) {
    // post event to drop it there 6 hours later
    AddStrategicEvent(Enum132.EVENT_MERC_LEAVE_EQUIP_IN_OMERTA, GetWorldTotalMin() + (6 * 60), iSlotIndex);
  } else {
    // otherwise there's no free slots left (shouldn't ever happen)
    AssertMsg(false, "HandleMercLeavingEquipmentInOmerta: No more free slots, equipment lost");
  }
}

export function HandleMercLeavingEquipmentInDrassen(uiMercId: UINT32): void {
  let iSlotIndex: INT32 = 0;

  // stash the items into a linked list hanging of a free "leave item list" slot
  if ((iSlotIndex = SetUpDropItemListForMerc(uiMercId)) != -1) {
    // post event to drop it there 6 hours later
    AddStrategicEvent(Enum132.EVENT_MERC_LEAVE_EQUIP_IN_DRASSEN, GetWorldTotalMin() + (6 * 60), iSlotIndex);
  } else {
    // otherwise there's no free slots left (shouldn't ever happen)
    AssertMsg(false, "HandleMercLeavingEquipmentInDrassen: No more free slots, equipment lost");
  }
}

export function HandleEquipmentLeftInOmerta(uiSlotIndex: UINT32): void {
  let pItem: MERC_LEAVE_ITEM | null;
  let sString: string /* CHAR16[128] */;

  Assert(uiSlotIndex < NUM_LEAVE_LIST_SLOTS);

  pItem = gpLeaveListHead[uiSlotIndex];

  if (pItem) {
    if (guiLeaveListOwnerProfileId[uiSlotIndex] != NO_PROFILE) {
      sString = swprintf(pLeftEquipmentString[0], gMercProfiles[guiLeaveListOwnerProfileId[uiSlotIndex]].zNickname);
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, sString);
    } else {
      sString = "A departing merc has left their equipment in Omerta.";
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, sString);
    }
  }

  while (pItem) {
    if (gWorldSectorX != OMERTA_LEAVE_EQUIP_SECTOR_X || gWorldSectorY != OMERTA_LEAVE_EQUIP_SECTOR_Y || gbWorldSectorZ != OMERTA_LEAVE_EQUIP_SECTOR_Z) {
      // given this slot value, add to sector item list
      AddItemsToUnLoadedSector(OMERTA_LEAVE_EQUIP_SECTOR_X, OMERTA_LEAVE_EQUIP_SECTOR_Y, OMERTA_LEAVE_EQUIP_SECTOR_Z, OMERTA_LEAVE_EQUIP_GRIDNO, 1, [pItem.o], 0, WORLD_ITEM_REACHABLE, 0, 1, false);
    } else {
      AddItemToPool(OMERTA_LEAVE_EQUIP_GRIDNO, pItem.o, 1, 0, WORLD_ITEM_REACHABLE, 0);
    }
    pItem = pItem.pNext;
  }

  FreeLeaveListSlot(uiSlotIndex);
}

export function HandleEquipmentLeftInDrassen(uiSlotIndex: UINT32): void {
  let pItem: MERC_LEAVE_ITEM | null;
  let sString: string /* CHAR16[128] */;

  Assert(uiSlotIndex < NUM_LEAVE_LIST_SLOTS);

  pItem = gpLeaveListHead[uiSlotIndex];

  if (pItem) {
    if (guiLeaveListOwnerProfileId[uiSlotIndex] != NO_PROFILE) {
      sString = swprintf(pLeftEquipmentString[1], gMercProfiles[guiLeaveListOwnerProfileId[uiSlotIndex]].zNickname);
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, sString);
    } else {
      sString = "A departing merc has left their equipment in Drassen.";
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, sString);
    }
  }

  while (pItem) {
    if (gWorldSectorX != BOBBYR_SHIPPING_DEST_SECTOR_X || gWorldSectorY != BOBBYR_SHIPPING_DEST_SECTOR_Y || gbWorldSectorZ != BOBBYR_SHIPPING_DEST_SECTOR_Z) {
      // given this slot value, add to sector item list
      AddItemsToUnLoadedSector(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, 10433, 1, [pItem.o], 0, WORLD_ITEM_REACHABLE, 0, 1, false);
    } else {
      AddItemToPool(10433, pItem.o, 1, 0, WORLD_ITEM_REACHABLE, 0);
    }
    pItem = pItem.pNext;
  }

  FreeLeaveListSlot(uiSlotIndex);
}

export function InitLeaveList(): void {
  let iCounter: INT32 = 0;

  // init leave list with NULLS/zeroes
  for (iCounter = 0; iCounter < NUM_LEAVE_LIST_SLOTS; iCounter++) {
    gpLeaveListHead[iCounter] = <MERC_LEAVE_ITEM><unknown>null;
    guiLeaveListOwnerProfileId[iCounter] = NO_PROFILE;
  }
}

export function ShutDownLeaveList(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < NUM_LEAVE_LIST_SLOTS; iCounter++) {
    // go through nodes and free them
    if (gpLeaveListHead[iCounter] != null) {
      FreeLeaveListSlot(iCounter);
    }
  }
}

export function AddItemToLeaveIndex(o: OBJECTTYPE, uiSlotIndex: UINT32): boolean {
  let pItem: MERC_LEAVE_ITEM;
  let pCurrentItem: MERC_LEAVE_ITEM | null;

  Assert(uiSlotIndex < NUM_LEAVE_LIST_SLOTS);

  if (o == null) {
    return false;
  }

  // allocate space
  pItem = createMercLeaveItem();

  // copy object
  copyObjectType(pItem.o, o);

  // nobody afterwards
  pItem.pNext = null;

  // now add to list in this index slot
  pCurrentItem = gpLeaveListHead[uiSlotIndex];

  if (pCurrentItem == null) {
    gpLeaveListHead[uiSlotIndex] = pItem;
    return true;
  }

  // move through list
  while (pCurrentItem.pNext) {
    pCurrentItem = pCurrentItem.pNext;
  }

  // found
  pCurrentItem.pNext = pItem;

  return true;
}

// release memory for all items in this slot's leave item list
function FreeLeaveListSlot(uiSlotIndex: UINT32): void {
  let pCurrent: MERC_LEAVE_ITEM | null = null;
  let pTemp: MERC_LEAVE_ITEM | null = null;

  Assert(uiSlotIndex < NUM_LEAVE_LIST_SLOTS);

  pCurrent = gpLeaveListHead[uiSlotIndex];

  // go through nodes and free them
  while (pCurrent) {
    pTemp = pCurrent.pNext;
    pCurrent = pTemp;
  }

  gpLeaveListHead[uiSlotIndex] = <MERC_LEAVE_ITEM><unknown>null;
}

function FindFreeSlotInLeaveList(): INT32 {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < NUM_LEAVE_LIST_SLOTS; iCounter++) {
    if (gpLeaveListHead[iCounter] == null) {
      return iCounter;
    }
  }

  return -1;
}

function SetUpDropItemListForMerc(uiMercId: UINT32): INT32 {
  // will set up a drop list for this grunt, remove items from inventory, and profile
  let iSlotIndex: INT32 = -1;
  let iCounter: INT32 = 0;

  iSlotIndex = FindFreeSlotInLeaveList();
  if (iSlotIndex == -1) {
    return -1;
  }

  for (iCounter = 0; iCounter < Enum261.NUM_INV_SLOTS; iCounter++) {
    // slot found,
    // check if actual item
    if (Menptr[uiMercId].inv[iCounter].ubNumberOfObjects > 0) {
      // make a linked list of the items left behind, with the ptr to its head in this free slot
      AddItemToLeaveIndex(Menptr[uiMercId].inv[iCounter], iSlotIndex);

      // store owner's profile id for the items added to this leave slot index
      SetUpMercAboutToLeaveEquipment(Menptr[uiMercId].ubProfile, iSlotIndex);
    }
  }

  // ATE: Added this to drop keyring keys - the 2nd last paramter says to add it to a leave list...
  // the gridno, level and visiblity are ignored
  DropKeysInKeyRing(MercPtrs[uiMercId], NOWHERE, 0, 0, true, iSlotIndex, false);

  // zero out profiles
  gMercProfiles[Menptr[uiMercId].ubProfile].bInvStatus.fill(0);
  gMercProfiles[Menptr[uiMercId].ubProfile].bInvNumber.fill(0);
  gMercProfiles[Menptr[uiMercId].ubProfile].inv.fill(0);

  return iSlotIndex;
}

// store owner's profile id for the items added to this leave slot index
function SetUpMercAboutToLeaveEquipment(ubProfileId: UINT32, uiSlotIndex: UINT32): void {
  Assert(uiSlotIndex < NUM_LEAVE_LIST_SLOTS);

  // store the profile ID of this merc in the same slot that the items are gonna be dropped in
  guiLeaveListOwnerProfileId[uiSlotIndex] = ubProfileId;
}

/*
BOOLEAN RemoveItemFromLeaveIndex( MERC_LEAVE_ITEM *pItem, UINT32 uiSlotIndex )
{
        MERC_LEAVE_ITEM *pCurrentItem = NULL;

        Assert( uiSlotIndex < NUM_LEAVE_LIST_SLOTS );

        if( pItem == NULL )
        {
                return( FALSE );
        }

        // item is head of list?
//ARM: THIS DOESN'T MAKE SENSE, pCurrentItem is always NULL at this stage!
        if( pItem == pCurrentItem )
        {
                gpLeaveListHead[ uiSlotIndex ] = pCurrentItem ->pNext;
                MemFree( pItem );
                pItem = NULL;
                return( TRUE );
        }

        // in the body
        while( ( pCurrentItem->pNext != pItem ) && ( pCurrentItem -> pNext != NULL ) )
        {
                pCurrentItem = pCurrentItem -> pNext;
        }

        // item not found
        if( pCurrentItem->pNext == NULL )
        {
                return( FALSE );
        }

        // set to next after next
        pCurrentItem->pNext = pCurrentItem->pNext->pNext;

        // free space and null ptr
        MemFree( pItem );
        pItem = NULL;

        return( TRUE );
}
*/

export function HandleGroupAboutToArrive(): void {
  // reblit map to change the color of the "people in motion" marker
  fMapPanelDirty = true;

  // ARM - commented out - don't see why this is needed
  //	fTeamPanelDirty = TRUE;
  //	fCharacterInfoPanelDirty = TRUE;

  return;
}

/*
void HandleMapScreenUpArrow( void )
{
        INT32 iValue = 0;
        INT32 iHighLine = 0;

        // check state and update
        if( fShowAssignmentMenu == TRUE )
        {
                if( GetBoxShadeFlag( ghAssignmentBox, iValue ) == FALSE )
                {
                        if( iHighLine ==  0)
                        {
                                iHighLine = ( INT32 )GetNumberOfLinesOfTextInBox( ghAssignmentBox );
                        }
                        else
                        {
                                iHighLine++;
                        }
                }
        }
        else
        {
                if( ( giHighLine == 0 ) || ( giHighLine  == -1 ) )
                {
                        giHighLine = GetNumberOfCharactersOnPlayersTeam( ) - 1;
                        fTeamPanelDirty = TRUE;
                }
                else
                {
                        giHighLine--;
                        fTeamPanelDirty = TRUE;
                }

        }
}


void HandleMapScreenDownArrow( void )
{
        INT32 iValue = 0;
        INT32 iHighLine = 0;

        // check state and update
        if( fShowContractMenu == TRUE )
        {
                if( iHighLine == ( INT32 )GetNumberOfLinesOfTextInBox( ghContractBox ) - 1 )
                {
                        iHighLine = 0;
                }
                else
                {
                        iHighLine++;
                }

                HighLightBoxLine( ghContractBox, iHighLine );
        }
        else if( fShowAssignmentMenu == TRUE )
        {
                if( GetBoxShadeFlag( ghAssignmentBox, iValue ) == FALSE )
                {
                        if( iHighLine == ( INT32 )GetNumberOfLinesOfTextInBox( ghAssignmentBox ) - 1 )
                        {
                                iHighLine = 0;
                        }
                        else
                        {
                                iHighLine--;
                        }
                }
        }
        else
        {
                if( ( giHighLine == GetNumberOfCharactersOnPlayersTeam( ) - 1 ) || ( giHighLine  == -1 ) )
                {
                        giHighLine = 0;
                        fTeamPanelDirty = TRUE;
                }
                else
                {
                        giHighLine++;
                        fTeamPanelDirty = TRUE;
                }

        }
}


INT32 GetNumberOfCharactersOnPlayersTeam( void )
{
        INT32 iNumberOfPeople = 0, iCounter = 0;

        for(iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++ )
        {
                if( gCharactersList[ iCounter ].fValid == TRUE )
                {
                        iNumberOfPeople++;
                }
        }

        return( iNumberOfPeople );
}
*/

export function CreateMapStatusBarsRegion(): void {
  // create the status region over the bSelectedCharacter info region, to get quick rundown of merc's status
  MSYS_DefineRegion(gMapStatusBarsRegion, BAR_INFO_X - 3, BAR_INFO_Y - 42, (BAR_INFO_X + 17), (BAR_INFO_Y), MSYS_PRIORITY_HIGH + 5, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

  return;
}

export function RemoveMapStatusBarsRegion(): void {
  // remove the bSelectedInfoCharacter helath, breath and morale bars info region
  MSYS_RemoveRegion(gMapStatusBarsRegion);

  return;
}

export function UpdateCharRegionHelpText(): void {
  let sString: string /* CHAR16[128] */;
  let pMoraleStr: string /* CHAR16[128] */;
  let pSoldier: SOLDIERTYPE;

  if ((bSelectedInfoChar != -1) && (gCharactersList[bSelectedInfoChar].fValid == true)) {
    // valid soldier selected
    pSoldier = MercPtrs[gCharactersList[bSelectedInfoChar].usSolID];

    // health/energy/morale
    if (pSoldier.bAssignment != Enum117.ASSIGNMENT_POW) {
      if (pSoldier.bLife != 0) {
        if (AM_A_ROBOT(MercPtrs[gCharactersList[bSelectedInfoChar].usSolID])) {
          // robot (condition only)
          sString = swprintf("%s: %d/%d", pMapScreenStatusStrings[3], pSoldier.bLife, pSoldier.bLifeMax);
        } else if (Menptr[gCharactersList[bSelectedInfoChar].usSolID].uiStatusFlags & SOLDIER_VEHICLE) {
          // vehicle (condition/fuel)
          sString = swprintf("%s: %d/%d, %s: %d/%d", pMapScreenStatusStrings[3], pSoldier.bLife, pSoldier.bLifeMax, pMapScreenStatusStrings[4], pSoldier.bBreath, pSoldier.bBreathMax);
        } else {
          // person (health/energy/morale)
          pMoraleStr = GetMoraleString(pSoldier);
          sString = swprintf("%s: %d/%d, %s: %d/%d, %s: %s", pMapScreenStatusStrings[0], pSoldier.bLife, pSoldier.bLifeMax, pMapScreenStatusStrings[1], pSoldier.bBreath, pSoldier.bBreathMax, pMapScreenStatusStrings[2], pMoraleStr);
        }
      } else {
        sString = "";
      }
    } else {
      // POW - stats unknown
      sString = swprintf("%s: ??, %s: ??, %s: ??", pMapScreenStatusStrings[0], pMapScreenStatusStrings[1], pMapScreenStatusStrings[2]);
    }

    SetRegionFastHelpText(gMapStatusBarsRegion, sString);

    // update CONTRACT button help text
    if (CanExtendContractForCharSlot(bSelectedInfoChar)) {
      SetButtonFastHelpText(giMapContractButton, pMapScreenMouseRegionHelpText[3]);
      EnableButton(giMapContractButton);
    } else {
      SetButtonFastHelpText(giMapContractButton, "");
      DisableButton(giMapContractButton);
    }

    if (CanToggleSelectedCharInventory()) {
      // inventory
      if (fShowInventoryFlag) {
        SetRegionFastHelpText(gCharInfoHandRegion, pMiscMapScreenMouseRegionHelpText[2]);
      } else {
        SetRegionFastHelpText(gCharInfoHandRegion, pMiscMapScreenMouseRegionHelpText[0]);
      }
    } else // can't toggle it, don't show any inventory help text
    {
      SetRegionFastHelpText(gCharInfoHandRegion, "");
    }
  } else {
    // invalid soldier
    SetRegionFastHelpText(gMapStatusBarsRegion, "");
    SetButtonFastHelpText(giMapContractButton, "");
    SetRegionFastHelpText(gCharInfoHandRegion, "");
    DisableButton(giMapContractButton);
  }
}

// find this merc in the mapscreen list and set as selected
export function FindAndSetThisContractSoldier(pSoldier: SOLDIERTYPE): void {
  let iCounter: INT32 = 0;

  fShowContractMenu = false;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      if (gCharactersList[iCounter].usSolID == pSoldier.ubID) {
        ChangeSelectedInfoChar(iCounter, true);
        bSelectedContractChar = iCounter;
        fShowContractMenu = true;

        // create
        RebuildContractBoxForMerc(pSoldier);

        fTeamPanelDirty = true;
        fCharacterInfoPanelDirty = true;
      }
    }
  }
}

export function HandleMAPUILoseCursorFromOtherScreen(): void {
  // rerender map without cursors
  fMapPanelDirty = true;

  if (fInMapMode) {
    RenderMapRegionBackground();
  }
  return;
}

export function UpdateMapScreenAssignmentPositions(): void {
  // set the position of the pop up boxes
  let pPoint: SGPPoint = createSGPPoint();

  if (guiCurrentScreen != Enum26.MAP_SCREEN) {
    return;
  }

  if (bSelectedAssignChar == -1) {
    if (gfPreBattleInterfaceActive == false) {
      giBoxY = 0;
    }
    return;
  }

  if (gCharactersList[bSelectedAssignChar].fValid == false) {
    if (gfPreBattleInterfaceActive == false) {
      giBoxY = 0;
    }
    return;
  }

  if (gfPreBattleInterfaceActive) {
    // do nothing
  } else {
    giBoxY = (Y_START + (bSelectedAssignChar) * (Y_SIZE() + 2));

    /* ARM: Removed this - refreshes fine without it, apparently
                    // make sure the menus don't overlap the map screen bottom panel (but where did 102 come from?)
                    if( giBoxY >= ( MAP_BOTTOM_Y - 102 ) )
                            giBoxY = MAP_BOTTOM_Y - 102;
    */
  }

  AssignmentPosition.iY = giBoxY;

  AttributePosition.iY = TrainPosition.iY = AssignmentPosition.iY + (GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN;

  VehiclePosition.iY = AssignmentPosition.iY + (GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_VEHICLE;
  SquadPosition.iY = AssignmentPosition.iY;

  if (fShowAssignmentMenu) {
    GetBoxPosition(ghAssignmentBox, pPoint);
    pPoint.iY = giBoxY;

    SetBoxPosition(ghAssignmentBox, pPoint);

    GetBoxPosition(ghEpcBox, pPoint);
    pPoint.iY = giBoxY;

    SetBoxPosition(ghEpcBox, pPoint);
  }

  if (fShowAttributeMenu) {
    GetBoxPosition(ghAttributeBox, pPoint);

    pPoint.iY = giBoxY + (GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN;

    SetBoxPosition(ghAttributeBox, pPoint);
  }

  if (fShowRepairMenu) {
    GetBoxPosition(ghRepairBox, pPoint);
    pPoint.iY = giBoxY + (GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_REPAIR;

    SetBoxPosition(ghRepairBox, pPoint);
  }

  return;
}

export function RandomMercInGroupSaysQuote(pGroup: GROUP, usQuoteNum: UINT16): void {
  let pPlayer: PLAYERGROUP | null;
  let pSoldier: SOLDIERTYPE;
  let ubMercsInGroup: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;

  // if traversing tactically, don't do this, unless time compression was required for some reason (don't go to sector)
  if ((gfTacticalTraversal || (pGroup.ubSectorZ > 0)) && !IsTimeBeingCompressed()) {
    return;
  }

  // Let's choose somebody in group.....
  pPlayer = pGroup.pPlayerList;

  while (pPlayer != null) {
    pSoldier = pPlayer.pSoldier;
    Assert(pSoldier);

    if (pSoldier.bLife >= OKLIFE && !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier) && !AM_AN_EPC(pSoldier) && !pSoldier.fMercAsleep) {
      ubMercsInGroup[ubNumMercs] = pSoldier.ubID;
      ubNumMercs++;
    }

    pPlayer = pPlayer.next;
  }

  // At least say quote....
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);
    pSoldier = MercPtrs[ubMercsInGroup[ubChosenMerc]];

    TacticalCharacterDialogue(pSoldier, usQuoteNum);
  }
}

export function GetNumberOfPeopleInCharacterList(): INT32 {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  // get the number of valid mercs in the mapscreen character list
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      // another valid character
      iCount++;
    }
  }

  return iCount;
}

function ValidSelectableCharForNextOrPrev(iNewCharSlot: INT32): boolean {
  let fHoldingItem: boolean = false;

  // if holding an item
  if ((gMPanelRegion.Cursor == EXTERN_CURSOR) || gpItemPointer || fMapInventoryItem) {
    fHoldingItem = true;
  }

  // if showing merc inventory, or holding an item
  if (fShowInventoryFlag || fHoldingItem) {
    // the new guy must have accessible inventory
    if (!MapCharacterHasAccessibleInventory(iNewCharSlot)) {
      return false;
    }
  }

  if (fHoldingItem) {
    return MapscreenCanPassItemToCharNum(iNewCharSlot);
  } else {
    return true;
  }
}

export function MapscreenCanPassItemToCharNum(iNewCharSlot: INT32): boolean {
  let pNewSoldier: SOLDIERTYPE;
  let pOldSoldier: SOLDIERTYPE | null;

  // assumes we're holding an item
  Assert((gMPanelRegion.Cursor == EXTERN_CURSOR) || gpItemPointer || fMapInventoryItem);

  // if in a hostile sector, disallow
  if (gTacticalStatus.fEnemyInSector) {
    return false;
  }

  // can't pass items to nobody!
  if (iNewCharSlot == -1) {
    return false;
  }

  pNewSoldier = MercPtrs[gCharactersList[iNewCharSlot].usSolID];

  // if showing sector inventory, and the item came from there
  if (fShowMapInventoryPool && !gpItemPointerSoldier && fMapInventoryItem) {
    // disallow passing items to anyone not in that sector
    if (pNewSoldier.sSectorX != sSelMapX || pNewSoldier.sSectorY != sSelMapY || pNewSoldier.bSectorZ != (iCurrentMapSectorZ)) {
      return false;
    }

    if (pNewSoldier.fBetweenSectors) {
      return false;
    }
  }

  // if we know who it came from
  if (gpItemPointerSoldier) {
    pOldSoldier = gpItemPointerSoldier;
  } else {
    // it came from either the currently selected merc, or the sector inventory
    if (fMapInventoryItem || (bSelectedInfoChar == -1)) {
      pOldSoldier = null;
    } else {
      pOldSoldier = MercPtrs[gCharactersList[bSelectedInfoChar].usSolID];
    }
  }

  // if another merc had it previously
  if (pOldSoldier != null) {
    // disallow passing items to a merc not in the same sector
    if (pNewSoldier.sSectorX != pOldSoldier.sSectorX || pNewSoldier.sSectorY != pOldSoldier.sSectorY || pNewSoldier.bSectorZ != pOldSoldier.bSectorZ) {
      return false;
    }

    // if on the road
    if (pNewSoldier.fBetweenSectors) {
      // other guy must also be on the road...
      if (!pOldSoldier.fBetweenSectors) {
        return false;
      }

      // only exchanges between those is the same squad or vehicle are permitted
      if (pNewSoldier.bAssignment != pOldSoldier.bAssignment) {
        return false;
      }

      // if in vehicles, make sure it's the same one
      if ((pNewSoldier.bAssignment == Enum117.VEHICLE) && (pNewSoldier.iVehicleId != pOldSoldier.iVehicleId)) {
        return false;
      }
    }
  }

  // passed all tests
  return true;
}

export function GoToNextCharacterInList(): void {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  if (fShowDescriptionFlag == true) {
    return;
  }

  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  // is the current guy invalid or the first one?
  if ((bSelectedInfoChar == -1) || (bSelectedInfoChar == MAX_CHARACTER_COUNT)) {
    iCount = 0;
  } else {
    iCount = bSelectedInfoChar + 1;
  }

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if ((gCharactersList[iCount].fValid) && (iCount < MAX_CHARACTER_COUNT) && ValidSelectableCharForNextOrPrev(iCount)) {
      ChangeSelectedInfoChar(iCount, true);
      break;
    } else {
      iCount++;

      if (iCount >= MAX_CHARACTER_COUNT) {
        iCount = 0;
      }
    }
  }
}

export function GoToPrevCharacterInList(): void {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  if (fShowDescriptionFlag == true) {
    return;
  }

  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  // is the current guy invalid or the first one?
  if ((bSelectedInfoChar == -1) || (bSelectedInfoChar == 0)) {
    iCount = MAX_CHARACTER_COUNT;
  } else {
    iCount = bSelectedInfoChar - 1;
  }

  // now run through the list and find first prev guy
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if ((gCharactersList[iCount].fValid) && (iCount < MAX_CHARACTER_COUNT) && ValidSelectableCharForNextOrPrev(iCount)) {
      ChangeSelectedInfoChar(iCount, true);
      break;
    } else {
      iCount--;

      if (iCount < 0) {
        // was FIRST_VEHICLE
        iCount = MAX_CHARACTER_COUNT;
      }
    }
  }
}

export function HandleMinerEvent(bMinerNumber: UINT8, sSectorX: INT16, sSectorY: INT16, sQuoteNumber: INT16, fForceMapscreen: boolean): void {
  let fFromMapscreen: boolean = false;

  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    fFromMapscreen = true;
  } else {
    // if transition to mapscreen is required
    if (fForceMapscreen) {
      // switch to mapscreen so we can flash the mine sector the guy is talking about
      EnterMapScreen();
      fFromMapscreen = true;
    }
  }

  if (fFromMapscreen) {
    // if not showing map surface level
    if (iCurrentMapSectorZ != 0) {
      // switch to it, because the miner locators wouldn't show up if we're underground while they speak
      ChangeSelectedMapSector(sSelMapX, sSelMapY, 0);
    }

    // set up the mine sector flasher
    gsSectorLocatorX = sSectorX;
    gsSectorLocatorY = sSectorY;

    fMapPanelDirty = true;

    // post dialogue events for miners to say this quote and flash the sector where his mine is
    CharacterDialogueWithSpecialEvent(uiExternalFaceProfileIds[bMinerNumber], sQuoteNumber, bMinerNumber, DIALOGUE_EXTERNAL_NPC_UI, false, false, DIALOGUE_SPECIAL_EVENT_MINESECTOREVENT, Enum155.START_RED_SECTOR_LOCATOR, 1);
    CharacterDialogue(uiExternalFaceProfileIds[bMinerNumber], sQuoteNumber, uiExternalStaticNPCFaces[bMinerNumber], DIALOGUE_EXTERNAL_NPC_UI, false, false);
    CharacterDialogueWithSpecialEvent(uiExternalFaceProfileIds[bMinerNumber], sQuoteNumber, bMinerNumber, DIALOGUE_EXTERNAL_NPC_UI, false, false, DIALOGUE_SPECIAL_EVENT_MINESECTOREVENT, Enum155.STOP_RED_SECTOR_LOCATOR, 1);
  } else // stay in tactical
  {
    // no need to to highlight mine sector
    CharacterDialogue(uiExternalFaceProfileIds[bMinerNumber], sQuoteNumber, uiExternalStaticNPCFaces[bMinerNumber], DIALOGUE_EXTERNAL_NPC_UI, false, false);
  }
}

export function SetUpAnimationOfMineSectors(iEvent: INT32): void {
  // set up the animation of mine sectors
  switch (iEvent) {
    case Enum155.START_RED_SECTOR_LOCATOR:
      gubBlitSectorLocatorCode = Enum156.LOCATOR_COLOR_RED;
      break;

    case Enum155.START_YELLOW_SECTOR_LOCATOR:
      gubBlitSectorLocatorCode = Enum156.LOCATOR_COLOR_YELLOW;
      break;

    case Enum155.STOP_RED_SECTOR_LOCATOR:
    case Enum155.STOP_YELLOW_SECTOR_LOCATOR:
      TurnOffSectorLocator();
      break;
  }
}

export function ShutDownUserDefineHelpTextRegions(): void {
  // dirty the tactical panel
  fInterfacePanelDirty = DIRTYLEVEL2;
  SetRenderFlags(RENDER_FLAG_FULL);

  // dirty the map panel
  StopMapScreenHelpText();

  // r eset tactical flag too
  StopShowingInterfaceFastHelpText();
}

// thsi will setup the fast help text regions that are unrelated to mouse regions
// user is to pass in the x,y position of the box, the width to wrap the strings and the string itself
export function SetUpFastHelpListRegions(iXPosition: INT32[] /* [] */, iYPosition: INT32[] /* [] */, iWidth: INT32[] /* [] */, sString: string[] /* STR16[] */, iSize: INT32): boolean {
  let iCounter: INT32 = 0;

  // reset the size
  giSizeOfInterfaceFastHelpTextList = 0;

  for (iCounter = 0; iCounter < iSize; iCounter++) {
    // forgiving way of making sure we don't go too far
    if (iCounter >= MAX_MAPSCREEN_FAST_HELP) {
      return false;
    }

    // now copy over info
    pFastHelpMapScreenList[iCounter].iX = iXPosition[iCounter];
    pFastHelpMapScreenList[iCounter].iY = iYPosition[iCounter];
    pFastHelpMapScreenList[iCounter].iW = iWidth[iCounter];

    // copy string
    pFastHelpMapScreenList[iCounter].FastHelpText = sString[iCounter];

    // update the size
    giSizeOfInterfaceFastHelpTextList = iCounter + 1;
  }

  return true;
}

// handle the actual showing of the interface fast help text
/* static */ let HandleShowingOfTacticalInterfaceFastHelpText__fTextActive: boolean = false;
export function HandleShowingOfTacticalInterfaceFastHelpText(): void {
  if (fInterfaceFastHelpTextActive) {
    DisplayFastHelpRegions(pFastHelpMapScreenList, giSizeOfInterfaceFastHelpTextList);

    PauseGame();

    // lock out the screen
    SetUpShutDownMapScreenHelpTextScreenMask();

    gfIgnoreScrolling = true;

    // the text is active
    HandleShowingOfTacticalInterfaceFastHelpText__fTextActive = true;
  } else if ((fInterfaceFastHelpTextActive == false) && (HandleShowingOfTacticalInterfaceFastHelpText__fTextActive)) {
    HandleShowingOfTacticalInterfaceFastHelpText__fTextActive = false;
    UnPauseGame();
    gfIgnoreScrolling = false;

    // shut down
    ShutDownUserDefineHelpTextRegions();
  }

  return;
}

// start showing fast help text
export function StartShowingInterfaceFastHelpText(): void {
  fInterfaceFastHelpTextActive = true;
}

// stop showing interface fast help text
function StopShowingInterfaceFastHelpText(): void {
  fInterfaceFastHelpTextActive = false;
}

// is the interface text up?
export function IsTheInterfaceFastHelpTextActive(): boolean {
  return fInterfaceFastHelpTextActive;
}

// display all the regions in the list
function DisplayFastHelpRegions(pRegion: FASTHELPREGION[], iSize: INT32): void {
  let iCounter: INT32 = 0;

  // run through and show all the regions
  for (iCounter = 0; iCounter < iSize; iCounter++) {
    DisplayUserDefineHelpTextRegions(pRegion[iCounter]);
  }

  return;
}

// show one region
function DisplayUserDefineHelpTextRegions(pRegion: FASTHELPREGION): void {
  let usFillColor: UINT16;
  let iX: INT32;
  let iY: INT32;
  let iW: INT32;
  let iH: INT32;
  let iNumberOfLines: INT32 = 1;
  let pDestBuf: Uint8ClampedArray;
  let uiDestPitchBYTES: UINT32 = 0;

  // grab the color for the background region
  usFillColor = Get16BPPColor(FROMRGB(250, 240, 188));

  iX = pRegion.iX;
  iY = pRegion.iY;
  // get the width and height of the string
  iW = (pRegion.iW) + 14;
  iH = IanWrappedStringHeight(iX, iY, (pRegion.iW), 0, FONT10ARIAL(), FONT_BLACK, pRegion.FastHelpText, FONT_BLACK, true, 0);

  // tack on the outer border
  iH += 14;

  // gone not far enough?
  if (iX < 0)
    iX = 0;

  // gone too far
  if ((pRegion.iX + iW) >= SCREEN_WIDTH)
    iX = (SCREEN_WIDTH - iW - 4);

  // what about the y value?
  iY = pRegion.iY - Math.trunc(iH * 3 / 4);

  // not far enough
  if (iY < 0)
    iY = 0;

  // too far
  if ((iY + iH) >= SCREEN_HEIGHT)
    iY = (SCREEN_HEIGHT - iH - 15);

  pDestBuf = LockVideoSurface(FRAME_BUFFER, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, iX + 1, iY + 1, iX + iW - 1, iY + iH - 1, Get16BPPColor(FROMRGB(65, 57, 15)), pDestBuf);
  RectangleDraw(true, iX, iY, iX + iW - 2, iY + iH - 2, Get16BPPColor(FROMRGB(227, 198, 88)), pDestBuf);
  UnLockVideoSurface(FRAME_BUFFER);
  ShadowVideoSurfaceRect(FRAME_BUFFER, iX + 2, iY + 2, iX + iW - 3, iY + iH - 3);
  ShadowVideoSurfaceRect(FRAME_BUFFER, iX + 2, iY + 2, iX + iW - 3, iY + iH - 3);

  // fillt he video surface areas
  // ColorFillVideoSurfaceArea(FRAME_BUFFER, iX, iY, (iX + iW), (iY + iH), 0);
  // ColorFillVideoSurfaceArea(FRAME_BUFFER, (iX + 1), (iY + 1), (iX + iW - 1), (iY + iH - 1), usFillColor);

  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_BEIGE);

  iH = DisplayWrappedString((iX + 10), (iY + 6), pRegion.iW, 0, FONT10ARIAL(), FONT_BEIGE, pRegion.FastHelpText, FONT_NEARBLACK, true, 0);

  iHeightOfInitFastHelpText = iH + 20;

  InvalidateRegion(iX, iY, (iX + iW), (iY + iH + 20));
}

function DisplayFastHelpForInitialTripInToMapScreen(pRegion: FASTHELPREGION): void {
  if (gTacticalStatus.fDidGameJustStart) {
    if (AnyMercsHired() == false) {
      return;
    }

    HandleDisplayOfExitToTacticalMessageForFirstEntryToMapScreen();
    // DEF: removed cause the help screen will replace the help screen
    //		DisplayFastHelpRegions( &pFastHelpMapScreenList[ 9 ], 1 );
  } else {
    DisplayFastHelpRegions(pFastHelpMapScreenList, giSizeOfInterfaceFastHelpTextList);
  }

  SetUpShutDownMapScreenHelpTextScreenMask();

  return;
}

export function DisplayMapScreenFastHelpList(): void {
  let iCounter: INT32 = 0;

  DisplayFastHelpForInitialTripInToMapScreen(pFastHelpMapScreenList[iCounter]);

  return;
}

export function SetUpMapScreenFastHelpText(): void {
  let iCounter: INT32 = 0;

  // now run through and display all the fast help text for the mapscreen functional regions
  for (iCounter = 0; iCounter < NUMBER_OF_MAPSCREEN_HELP_MESSAGES; iCounter++) {
    pFastHelpMapScreenList[iCounter].iX = pMapScreenFastHelpLocationList[iCounter].iX;
    pFastHelpMapScreenList[iCounter].iY = pMapScreenFastHelpLocationList[iCounter].iY;
    pFastHelpMapScreenList[iCounter].iW = pMapScreenFastHelpWidthList[iCounter];
    pFastHelpMapScreenList[iCounter].FastHelpText = pMapScreenFastHelpTextList[iCounter];
  }

  // DEF: removed cause the help screen will replace the help screen
  /*
          pFastHelpMapScreenList[ 9 ].iX = pMapScreenFastHelpLocationList[ 9 ].iX;
          pFastHelpMapScreenList[ 9 ].iY = pMapScreenFastHelpLocationList[ 9 ].iY;
          pFastHelpMapScreenList[ 9 ].iW = pMapScreenFastHelpWidthList[ 9 ];
          wcscpy( pFastHelpMapScreenList[ 9 ].FastHelpText, pMapScreenFastHelpTextList[ 9 ] );
  */
  return;
}

export function StopMapScreenHelpText(): void {
  fShowMapScreenHelpText = false;
  fTeamPanelDirty = true;
  fMapPanelDirty = true;
  fCharacterInfoPanelDirty = true;
  fMapScreenBottomDirty = true;

  SetUpShutDownMapScreenHelpTextScreenMask();
  return;
}

export function IsMapScreenHelpTextUp(): boolean {
  return fShowMapScreenHelpText;
}

/* static */ let SetUpShutDownMapScreenHelpTextScreenMask__fCreated: boolean = false;
function SetUpShutDownMapScreenHelpTextScreenMask(): void {
  // create or destroy the screen mask as needed
  if (((fShowMapScreenHelpText == true) || (fInterfaceFastHelpTextActive == true)) && (SetUpShutDownMapScreenHelpTextScreenMask__fCreated == false)) {
    if (gTacticalStatus.fDidGameJustStart) {
      MSYS_DefineRegion(gMapScreenHelpTextMask, (pMapScreenFastHelpLocationList[9].iX), (pMapScreenFastHelpLocationList[9].iY), (pMapScreenFastHelpLocationList[9].iX + pMapScreenFastHelpWidthList[9]), (pMapScreenFastHelpLocationList[9].iY + iHeightOfInitFastHelpText), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MapScreenHelpTextScreenMaskBtnCallback);
    } else {
      MSYS_DefineRegion(gMapScreenHelpTextMask, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MapScreenHelpTextScreenMaskBtnCallback);
    }

    SetUpShutDownMapScreenHelpTextScreenMask__fCreated = true;
  } else if ((fShowMapScreenHelpText == false) && (fInterfaceFastHelpTextActive == false) && (SetUpShutDownMapScreenHelpTextScreenMask__fCreated == true)) {
    MSYS_RemoveRegion(gMapScreenHelpTextMask);

    SetUpShutDownMapScreenHelpTextScreenMask__fCreated = false;
  }
}

function MapScreenHelpTextScreenMaskBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // stop showing
    ShutDownUserDefineHelpTextRegions();
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // stop showing
    ShutDownUserDefineHelpTextRegions();
  }
}

function IsSoldierSelectedForMovement(pSoldier: SOLDIERTYPE | null): boolean {
  let iCounter: INT32 = 0;

  // run through the list and turn this soldiers value on
  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    if ((pSoldierMovingList[iCounter] == pSoldier) && (fSoldierIsMoving[iCounter])) {
      return true;
    }
  }
  return false;
}

function IsSquadSelectedForMovement(iSquadNumber: INT32): boolean {
  let iCounter: INT32 = 0;

  // run through squad list and set them on
  for (iCounter = 0; iCounter < giNumberOfSquadsInSectorMoving; iCounter++) {
    if ((iSquadMovingList[iCounter] == iSquadNumber) && (fSquadIsMoving[iCounter])) {
      return true;
    }
  }

  return false;
}

function IsVehicleSelectedForMovement(iVehicleId: INT32): boolean {
  let iCounter: INT32 = 0;

  // run through squad list and set them on
  for (iCounter = 0; iCounter < giNumberOfVehiclesInSectorMoving; iCounter++) {
    if ((iVehicleMovingList[iCounter] == iVehicleId) && (fVehicleIsMoving[iCounter])) {
      return true;
    }
  }
  return false;
}

function SelectSoldierForMovement(pSoldier: SOLDIERTYPE): void {
  let iCounter: INT32 = 0;

  if (pSoldier == null) {
    return;
  }

  // run through the list and turn this soldiers value on
  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    if (pSoldierMovingList[iCounter] == pSoldier) {
      // turn the selected soldier ON
      fSoldierIsMoving[iCounter] = true;
      break;
    }
  }
}

function DeselectSoldierForMovement(pSoldier: SOLDIERTYPE): void {
  let iCounter: INT32 = 0;

  if (pSoldier == null) {
    return;
  }

  // run through the list and turn this soldier's value on
  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    if (pSoldierMovingList[iCounter] == pSoldier) {
      // turn the selected soldier off
      fSoldierIsMoving[iCounter] = false;
      break;
    }
  }
}

function SelectSquadForMovement(iSquadNumber: INT32): void {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let fSomeCantMove: boolean = false;
  let pSoldier: SOLDIERTYPE | null = null;
  let fFirstFailure: boolean;

  // run through squad list and set them on
  for (iCounter = 0; iCounter < giNumberOfSquadsInSectorMoving; iCounter++) {
    if (iSquadMovingList[iCounter] == iSquadNumber) {
      // found it

      fFirstFailure = true;

      // try to select everyone in squad
      for (iCount = 0; iCount < NUMBER_OF_SOLDIERS_PER_SQUAD; iCount++) {
        pSoldier = Squad[iSquadNumber][iCount];

        if (pSoldier && pSoldier.bActive) {
          // is he able & allowed to move?  (Report only the first reason for failure encountered)
          if (CanMoveBoxSoldierMoveStrategically(pSoldier, fFirstFailure)) {
            SelectSoldierForMovement(pSoldier);
          } else {
            fSomeCantMove = true;
            fFirstFailure = false;
          }
        }
      }

      if (!fSomeCantMove) {
        fSquadIsMoving[iCounter] = true;
      }

      break;
    }
  }
}

function DeselectSquadForMovement(iSquadNumber: INT32): void {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pSoldier: SOLDIERTYPE | null = null;

  // run through squad list and set them off
  for (iCounter = 0; iCounter < giNumberOfSquadsInSectorMoving; iCounter++) {
    if (iSquadMovingList[iCounter] == iSquadNumber) {
      // found it
      fSquadIsMoving[iCounter] = false;

      // now deselect everyone in squad
      for (iCount = 0; iCount < NUMBER_OF_SOLDIERS_PER_SQUAD; iCount++) {
        pSoldier = Squad[iSquadNumber][iCount];

        if (pSoldier && pSoldier.bActive) {
          DeselectSoldierForMovement(pSoldier);
        }
      }

      break;
    }
  }
}

function AllSoldiersInSquadSelected(iSquadNumber: INT32): boolean {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  // is everyone on this squad moving?
  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    if (pSoldierMovingList[iCounter].bAssignment == iSquadNumber) {
      if (fSoldierIsMoving[iCounter] == false) {
        return false;
      }
    }
  }

  return true;
}

function SelectVehicleForMovement(iVehicleId: INT32, fAndAllOnBoard: boolean): void {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pPassenger: SOLDIERTYPE | null = null;
  let fHasDriver: boolean = false;
  let fFirstFailure: boolean;

  // run through vehicle list and set them on
  for (iCounter = 0; iCounter < giNumberOfVehiclesInSectorMoving; iCounter++) {
    if (iVehicleMovingList[iCounter] == iVehicleId) {
      // found it

      fFirstFailure = true;

      for (iCount = 0; iCount < 10; iCount++) {
        pPassenger = pVehicleList[iVehicleId].pPassengers[iCount];

        if (fAndAllOnBoard) {
          // try to select everyone in vehicle

          if (pPassenger && pPassenger.bActive) {
            // is he able & allowed to move?
            if (CanMoveBoxSoldierMoveStrategically(pPassenger, fFirstFailure)) {
              SelectSoldierForMovement(pPassenger);
            } else {
              fFirstFailure = false;
            }
          }
        }

        if (IsSoldierSelectedForMovement(pPassenger)) {
          fHasDriver = true;
        }
      }

      // vehicle itself can only move if at least one passenger can move and is moving!
      if (fHasDriver) {
        fVehicleIsMoving[iCounter] = true;
      }

      break;
    }
  }
}

function DeselectVehicleForMovement(iVehicleId: INT32): void {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pPassenger: SOLDIERTYPE | null = null;

  // run through vehicle list and set them off
  for (iCounter = 0; iCounter < giNumberOfVehiclesInSectorMoving; iCounter++) {
    if (iVehicleMovingList[iCounter] == iVehicleId) {
      // found it
      fVehicleIsMoving[iCounter] = false;

      // now deselect everyone in vehicle
      for (iCount = 0; iCount < 10; iCount++) {
        pPassenger = pVehicleList[iVehicleId].pPassengers[iCount];

        if (pPassenger && pPassenger.bActive) {
          DeselectSoldierForMovement(pPassenger);
        }
      }

      break;
    }
  }
}

function HowManyMovingSoldiersInVehicle(iVehicleId: INT32): INT32 {
  let iNumber: INT32 = 0;
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    // is he in the right vehicle
    if ((pSoldierMovingList[iCounter].bAssignment == Enum117.VEHICLE) && (pSoldierMovingList[iCounter].iVehicleId == iVehicleId)) {
      // if he moving?
      if (fSoldierIsMoving[iCounter]) {
        // ok, another one in the vehicle that is going to move
        iNumber++;
      }
    }
  }

  return iNumber;
}

function HowManyMovingSoldiersInSquad(iSquadNumber: INT32): INT32 {
  let iNumber: INT32 = 0;
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    // is he in the right squad
    if (pSoldierMovingList[iCounter].bAssignment == iSquadNumber) {
      // if he moving?
      if (fSoldierIsMoving[iCounter]) {
        // ok, another one in the squad that is going to move
        iNumber++;
      }
    }
  }

  return iNumber;
}

// try to add this soldier to the moving lists
function AddSoldierToMovingLists(pSoldier: SOLDIERTYPE): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (pSoldierMovingList[iCounter] == pSoldier) {
      // found
      return;
    } else if (pSoldierMovingList[iCounter] == null) {
      // found a free slot
      pSoldierMovingList[iCounter] = pSoldier;
      fSoldierIsMoving[iCounter] = false;

      giNumberOfSoldiersInSectorMoving++;
      return;
    }
  }
  return;
}

// try to add this soldier to the moving lists
function AddSquadToMovingLists(iSquadNumber: INT32): void {
  let iCounter: INT32 = 0;

  if (iSquadNumber == -1) {
    // invalid squad
    return;
  }

  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    if (iSquadMovingList[iCounter] == iSquadNumber) {
      // found
      return;
    }
    if (iSquadMovingList[iCounter] == -1) {
      // found a free slot
      iSquadMovingList[iCounter] = iSquadNumber;
      fSquadIsMoving[iCounter] = false;

      giNumberOfSquadsInSectorMoving++;
      return;
    }
  }
  return;
}

// try to add this soldier to the moving lists
function AddVehicleToMovingLists(iVehicleId: INT32): void {
  let iCounter: INT32 = 0;

  if (iVehicleId == -1) {
    // invalid squad
    return;
  }

  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    if (iVehicleMovingList[iCounter] == iVehicleId) {
      // found
      return;
    }
    if (iVehicleMovingList[iCounter] == -1) {
      // found a free slot
      iVehicleMovingList[iCounter] = iVehicleId;
      fVehicleIsMoving[iCounter] = false;

      giNumberOfVehiclesInSectorMoving++;
      return;
    }
  }
  return;
}

function InitializeMovingLists(): void {
  let iCounter: INT32 = 0;

  giNumberOfSoldiersInSectorMoving = 0;
  giNumberOfSquadsInSectorMoving = 0;
  giNumberOfVehiclesInSectorMoving = 0;

  // init the soldiers
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // soldier is NOT moving
    pSoldierMovingList[iCounter] = <SOLDIERTYPE><unknown>null;
    // turn the selected soldier off
    fSoldierIsMoving[iCounter] = false;
  }

  // init the squads
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    // reset squad value
    iSquadMovingList[iCounter] = -1;
    // turn it off
    fSquadIsMoving[iCounter] = false;
  }

  // init the vehicles
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    // reset squad value
    iVehicleMovingList[iCounter] = -1;
    // turn it off
    fVehicleIsMoving[iCounter] = false;
  }

  return;
}

function IsAnythingSelectedForMoving(): boolean {
  let iCounter: INT32 = 0;

  // check soldiers
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if ((pSoldierMovingList[iCounter] != null) && fSoldierIsMoving[iCounter]) {
      return true;
    }
  }

  // init the squads
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    if ((iSquadMovingList[iCounter] != -1) && fSquadIsMoving[iCounter]) {
      return true;
    }
  }

  // init the vehicles
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    if ((iVehicleMovingList[iCounter] != -1) && fVehicleIsMoving[iCounter]) {
      return true;
    }
  }

  return false;
}

/* static */ let CreateDestroyMovementBox__fCreated: boolean = false;
export function CreateDestroyMovementBox(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): void {
  // not allowed for underground movement!
  Assert(sSectorZ == 0);

  if ((fShowMapScreenMovementList == true) && (CreateDestroyMovementBox__fCreated == false)) {
    CreateDestroyMovementBox__fCreated = true;

    // create the box and mouse regions
    CreatePopUpBoxForMovementBox();
    BuildMouseRegionsForMoveBox();
    CreateScreenMaskForMoveBox();
    fMapPanelDirty = true;
  } else if ((fShowMapScreenMovementList == false) && (CreateDestroyMovementBox__fCreated == true)) {
    CreateDestroyMovementBox__fCreated = false;

    // destroy the box and mouse regions
    ClearMouseRegionsForMoveBox();
    RemoveBox(ghMoveBox);
    ghMoveBox = -1;
    RemoveScreenMaskForMoveBox();
    fMapPanelDirty = true;
    fMapScreenBottomDirty = true; // really long move boxes can overlap bottom panel
  }
}

export function SetUpMovingListsForSector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): void {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  // not allowed for underground movement!
  Assert(sSectorZ == 0);

  // clear the lists
  InitializeMovingLists();

  // note that Skyrider can't be moved using the move box, and won't appear because the helicoprer is not in the char list

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      if ((pSoldier.bActive) && (pSoldier.bAssignment != Enum117.IN_TRANSIT) && (pSoldier.bAssignment != Enum117.ASSIGNMENT_POW) && (pSoldier.sSectorX == sSectorX) && (pSoldier.sSectorY == sSectorY) && (pSoldier.bSectorZ == sSectorZ)) {
        if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
          // vehicle
          // if it can move (can't be empty)
          if (GetNumberInVehicle(pSoldier.bVehicleID) > 0) {
            // add vehicle
            AddVehicleToMovingLists(pSoldier.bVehicleID);
          }
        } else // soldier
        {
          // alive, not aboard Skyrider (airborne or not!)
          if ((pSoldier.bLife >= OKLIFE) && ((pSoldier.bAssignment != Enum117.VEHICLE) || (pSoldier.iVehicleId != iHelicopterVehicleId))) {
            // add soldier
            AddSoldierToMovingLists(pSoldier);

            // if on a squad,
            if (pSoldier.bAssignment < Enum117.ON_DUTY) {
              // add squad (duplicates ok, they're ignored inside the function)
              AddSquadToMovingLists(pSoldier.bAssignment);
            }
          }
        }
      }
    }
  }

  fShowMapScreenMovementList = true;
  CreateDestroyMovementBox(sSectorX, sSectorY, sSectorZ);
}

function CreatePopUpBoxForMovementBox(): void {
  let Position: SGPPoint = createSGPPoint();
  let Dimensions: SGPRect = createSGPRect();

  // create the pop up box and mouse regions for movement list

  // create basic box
  ghMoveBox = CreatePopUpBox(AssignmentDimensions, MovePosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_RESIZE));

  // which buffer will box render to
  SetBoxBuffer(ghMoveBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghMoveBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghMoveBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghMoveBox, 6, 6, 4, 4);

  // space between lines
  SetLineSpace(ghMoveBox, 2);

  // set current box to this one
  SetCurrentBox(ghMoveBox);

  // add strings
  AddStringsToMoveBox();

  // set font type
  SetBoxFont(ghMoveBox, MAP_SCREEN_FONT());

  // set highlight color
  SetBoxHighLight(ghMoveBox, FONT_WHITE);

  // unhighlighted color
  SetBoxForeground(ghMoveBox, FONT_LTGREEN);

  // make the header line WHITE
  SetBoxLineForeground(ghMoveBox, 0, FONT_WHITE);

  // make the done and cancel lines YELLOW
  SetBoxLineForeground(ghMoveBox, GetNumberOfLinesOfTextInBox(ghMoveBox) - 1, FONT_YELLOW);

  if (IsAnythingSelectedForMoving()) {
    SetBoxLineForeground(ghMoveBox, GetNumberOfLinesOfTextInBox(ghMoveBox) - 2, FONT_YELLOW);
  }

  // background color
  SetBoxBackground(ghMoveBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghMoveBox, FONT_BLACK);

  // resize box to text
  ResizeBoxToText(ghMoveBox);

  GetBoxPosition(ghMoveBox, Position);
  GetBoxSize(ghMoveBox, Dimensions);

  // adjust position to try to keep it in the map area as best as possible
  if (Position.iX + Dimensions.iRight >= (MAP_VIEW_START_X + MAP_VIEW_WIDTH)) {
    Position.iX = Math.max(MAP_VIEW_START_X, (MAP_VIEW_START_X + MAP_VIEW_WIDTH) - Dimensions.iRight);
    SetBoxPosition(ghMoveBox, Position);
  }

  if (Position.iY + Dimensions.iBottom >= (MAP_VIEW_START_Y + MAP_VIEW_HEIGHT)) {
    Position.iY = Math.max(MAP_VIEW_START_Y, (MAP_VIEW_START_Y + MAP_VIEW_HEIGHT) - Dimensions.iBottom);
    SetBoxPosition(ghMoveBox, Position);
  }
}

function AddStringsToMoveBox(): void {
  let iCount: INT32 = 0;
  let iCountB: INT32 = 0;
  let sString: string /* CHAR16[128] */;
  let sStringB: string /* CHAR16[128] */;
  let hStringHandle: UINT32;
  let fFirstOne: boolean = true;

  // set the current box
  SetCurrentBox(ghMoveBox);

  // clear all the strings out of the box
  RemoveAllCurrentBoxStrings();

  // add title
  sStringB = GetShortSectorString(sSelMapX, sSelMapY);
  sString = swprintf("%s %s", pMovementMenuStrings[0], sStringB);
  hStringHandle = AddMonoString(sString);

  // blank line
  hStringHandle = AddMonoString("");

  // add squads
  for (iCount = 0; iCount < giNumberOfSquadsInSectorMoving; iCount++) {
    // add this squad, now add all the grunts in it
    if (fSquadIsMoving[iCount]) {
      sString = swprintf("*%s*", pSquadMenuStrings[iSquadMovingList[iCount]]);
    } else {
      sString = swprintf("%s", pSquadMenuStrings[iSquadMovingList[iCount]]);
    }
    hStringHandle = AddMonoString(sString);

    // now add all the grunts in it
    for (iCountB = 0; iCountB < giNumberOfSoldiersInSectorMoving; iCountB++) {
      if (pSoldierMovingList[iCountB].bAssignment == iSquadMovingList[iCount]) {
        // add mercs in squads
        if (IsSoldierSelectedForMovement(pSoldierMovingList[iCountB]) == true) {
          sString = swprintf("   *%s*", pSoldierMovingList[iCountB].name);
        } else {
          sString = swprintf("   %s", pSoldierMovingList[iCountB].name);
        }
        hStringHandle = AddMonoString(sString);
      }
    }
  }

  // add vehicles
  for (iCount = 0; iCount < giNumberOfVehiclesInSectorMoving; iCount++) {
    // add this vehicle
    if (fVehicleIsMoving[iCount]) {
      sString = swprintf("*%s*", pVehicleStrings[pVehicleList[iVehicleMovingList[iCount]].ubVehicleType]);
    } else {
      sString = swprintf("%s", pVehicleStrings[pVehicleList[iVehicleMovingList[iCount]].ubVehicleType]);
    }
    hStringHandle = AddMonoString(sString);

    // now add all the grunts in it
    for (iCountB = 0; iCountB < giNumberOfSoldiersInSectorMoving; iCountB++) {
      if ((pSoldierMovingList[iCountB].bAssignment == Enum117.VEHICLE) && (pSoldierMovingList[iCountB].iVehicleId == iVehicleMovingList[iCount])) {
        // add mercs in vehicles
        if (IsSoldierSelectedForMovement(pSoldierMovingList[iCountB]) == true) {
          sString = swprintf("   *%s*", pSoldierMovingList[iCountB].name);
        } else {
          sString = swprintf("   %s", pSoldierMovingList[iCountB].name);
        }
        hStringHandle = AddMonoString(sString);
      }
    }
  }

  fFirstOne = true;

  // add "other" soldiers heading, once, if there are any
  for (iCount = 0; iCount < giNumberOfSoldiersInSectorMoving; iCount++) {
    // not on duty, not in a vehicle
    if ((pSoldierMovingList[iCount].bAssignment >= Enum117.ON_DUTY) && (pSoldierMovingList[iCount].bAssignment != Enum117.VEHICLE)) {
      if (fFirstOne) {
        // add OTHER header line
        if (AllOtherSoldiersInListAreSelected()) {
          sString = swprintf("*%s*", pMovementMenuStrings[3]);
        } else {
          sString = swprintf("%s", pMovementMenuStrings[3]);
        }
        hStringHandle = AddMonoString(sString);

        fFirstOne = false;
      }

      // add OTHER soldiers (not on duty nor in a vehicle)
      if (IsSoldierSelectedForMovement(pSoldierMovingList[iCount]) == true) {
        sString = swprintf("  *%s ( %s )*", pSoldierMovingList[iCount].name, pAssignmentStrings[pSoldierMovingList[iCount].bAssignment]);
      } else {
        sString = swprintf("   %s ( %s )", pSoldierMovingList[iCount].name, pAssignmentStrings[pSoldierMovingList[iCount].bAssignment]);
      }
      hStringHandle = AddMonoString(sString);
    }
  }

  // blank line
  hStringHandle = AddMonoString("");

  if (IsAnythingSelectedForMoving()) {
    // add PLOT MOVE line
    sString = swprintf("%s", pMovementMenuStrings[1]);
    hStringHandle = AddMonoString(sString);
  } else {
    // blank line
    hStringHandle = AddMonoString("");
  }

  // add cancel line
  sString = swprintf("%s", pMovementMenuStrings[2]);
  hStringHandle = AddMonoString(sString);

  return;
}

function BuildMouseRegionsForMoveBox(): void {
  let iCounter: INT32 = 0;
  let iTotalNumberOfLines: INT32 = 0;
  let iCount: INT32 = 0;
  let iCountB: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let Dimensions: SGPRect = createSGPRect();
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let fDefinedOtherRegion: boolean = false;

  // grab height of font
  iFontHeight = GetLineSpace(ghMoveBox) + GetFontHeight(GetBoxFont(ghMoveBox));

  // get x.y position of box
  GetBoxPosition(ghMoveBox, pPosition);

  // grab box x and y position
  iBoxXPosition = pPosition.iX;
  iBoxYPosition = pPosition.iY + GetTopMarginSize(ghMoveBox) - 2; // -2 to improve highlighting accuracy between lines

  // get dimensions..mostly for width
  GetBoxSize(ghMoveBox, Dimensions);

  // get width
  iBoxWidth = Dimensions.iRight;

  SetCurrentBox(ghMoveBox);

  // box heading
  MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  iCounter++;

  // blank line
  MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  iCounter++;

  // calc total number of "moving" lines in the box
  iTotalNumberOfLines = giNumberOfSoldiersInSectorMoving + giNumberOfSquadsInSectorMoving + giNumberOfVehiclesInSectorMoving;
  // add the blank lines
  iTotalNumberOfLines += iCounter;

  // now add the strings
  while (iCounter < iTotalNumberOfLines) {
    // define regions for squad lines
    for (iCount = 0; iCount < giNumberOfSquadsInSectorMoving; iCount++) {
      MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

      // set user defines
      MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
      MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.SQUAD_REGION);
      MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, iCount);
      iCounter++;

      for (iCountB = 0; iCountB < giNumberOfSoldiersInSectorMoving; iCountB++) {
        if (pSoldierMovingList[iCountB].bAssignment == iSquadMovingList[iCount]) {
          MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

          // set user defines
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.SOLDIER_REGION);
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, iCountB);
          iCounter++;
        }
      }
    }

    for (iCount = 0; iCount < giNumberOfVehiclesInSectorMoving; iCount++) {
      // define regions for vehicle lines
      MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

      // set user defines
      MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
      MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.VEHICLE_REGION);
      MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, iCount);
      iCounter++;

      for (iCountB = 0; iCountB < giNumberOfSoldiersInSectorMoving; iCountB++) {
        if ((pSoldierMovingList[iCountB].bAssignment == Enum117.VEHICLE) && (pSoldierMovingList[iCountB].iVehicleId == iVehicleMovingList[iCount])) {
          MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

          // set user defines
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.SOLDIER_REGION);
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, iCountB);
          iCounter++;
        }
      }
    }

    // define regions for "other" soldiers
    for (iCount = 0; iCount < giNumberOfSoldiersInSectorMoving; iCount++) {
      // this guy is not in a squad or vehicle
      if ((pSoldierMovingList[iCount].bAssignment >= Enum117.ON_DUTY) && (pSoldierMovingList[iCount].bAssignment != Enum117.VEHICLE)) {
        // this line gets place only once...
        if (!fDefinedOtherRegion) {
          MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

          // set user defines
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.OTHER_REGION);
          MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, 0);
          iCounter++;

          fDefinedOtherRegion = true;
        }

        MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

        // set user defines
        MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
        MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.SOLDIER_REGION);
        MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, iCount);
        iCounter++;
      }
    }
  }

  // blank line
  MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  iCounter++;

  if (IsAnythingSelectedForMoving()) {
    // DONE line
    MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

    // set user defines
    MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
    MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.DONE_REGION);
    MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, 0);
    iCounter++;
  } else {
    // blank line
    MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
    iCounter++;
  }

  // CANCEL line
  MSYS_DefineRegion(gMoveMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + iFontHeight * iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + iFontHeight * (iCounter + 1)), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MoveMenuMvtCallback, MoveMenuBtnCallback);

  // set user defines
  MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 0, iCounter);
  MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 1, Enum145.CANCEL_REGION);
  MSYS_SetRegionUserData(gMoveMenuRegion[iCounter], 2, 0);
  iCounter++;
}

function ClearMouseRegionsForMoveBox(): void {
  let iCounter: INT32 = 0;

  // run through list of mouse regions
  for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghMoveBox); iCounter++) {
    // remove this region
    MSYS_RemoveRegion(gMoveMenuRegion[iCounter]);
  }

  return;
}

function MoveMenuMvtCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for move box line regions
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // highlight string
    HighLightBoxLine(ghMoveBox, iValue);
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghMoveBox);
  }
}

function MoveMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for move box line regions
  let iMoveBoxLine: INT32 = -1;
  let iRegionType: INT32 = -1;
  let iListIndex: INT32 = -1;
  let iClickTime: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  iMoveBoxLine = MSYS_GetRegionUserData(pRegion, 0);
  iRegionType = MSYS_GetRegionUserData(pRegion, 1);
  iListIndex = MSYS_GetRegionUserData(pRegion, 2);
  iClickTime = GetJA2Clock();

  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if (iClickTime - giDblClickTimersForMoveBoxMouseRegions[iMoveBoxLine] < DBL_CLICK_DELAY_FOR_MOVE_MENU) {
      // dbl click, and something is selected?
      if (IsAnythingSelectedForMoving()) {
        // treat like DONE
        HandleMoveoutOfSectorMovementTroops();
        return;
      }
    } else {
      giDblClickTimersForMoveBoxMouseRegions[iMoveBoxLine] = iClickTime;

      if (iRegionType == Enum145.SQUAD_REGION) {
        // is the squad moving
        if (fSquadIsMoving[iListIndex] == true) {
          // squad stays
          DeselectSquadForMovement(iSquadMovingList[iListIndex]);
        } else {
          // squad goes
          SelectSquadForMovement(iSquadMovingList[iListIndex]);
        }
      } else if (iRegionType == Enum145.VEHICLE_REGION) {
        // is the vehicle moving
        if (fVehicleIsMoving[iListIndex] == true) {
          // vehicle stays
          DeselectVehicleForMovement(iVehicleMovingList[iListIndex]);
        } else {
          // vehicle goes
          SelectVehicleForMovement(iVehicleMovingList[iListIndex], AND_ALL_ON_BOARD);
        }
      } else if (iRegionType == Enum145.OTHER_REGION) {
        if (AllOtherSoldiersInListAreSelected() == true) {
          // deselect all others in the list
          DeselectAllOtherSoldiersInList();
        } else {
          // select all others in the list
          SelectAllOtherSoldiersInList();
        }
      } else if (iRegionType == Enum145.SOLDIER_REGION) {
        pSoldier = pSoldierMovingList[iListIndex];

        if (pSoldier.fBetweenSectors) {
          // we don't allow mercs to change squads or get out of vehicles between sectors, easiest way to handle this
          // is to prevent any toggling of individual soldiers on the move at the outset.
          DoScreenIndependantMessageBox(pMapErrorString[41], MSG_BOX_FLAG_OK, null);
          return;
        }

        // if soldier is currently selected to move
        if (IsSoldierSelectedForMovement(pSoldier)) {
          // change him to NOT move instead

          if (pSoldier.bAssignment == Enum117.VEHICLE) {
            // if he's the only one left moving in the vehicle, deselect whole vehicle
            if (HowManyMovingSoldiersInVehicle(pSoldier.iVehicleId) == 1) {
              // whole vehicle stays
              DeselectVehicleForMovement(pSoldier.iVehicleId);
            } else {
              // soldier is staying behind
              DeselectSoldierForMovement(pSoldier);
            }
          } else if (pSoldier.bAssignment < Enum117.ON_DUTY) {
            // if he's the only one left moving in the squad, deselect whole squad
            if (HowManyMovingSoldiersInSquad(pSoldier.bAssignment) == 1) {
              // whole squad stays
              DeselectSquadForMovement(pSoldier.bAssignment);
            } else {
              // soldier is staying behind
              DeselectSoldierForMovement(pSoldier);
            }
          } else {
            // soldier is staying behind
            DeselectSoldierForMovement(pSoldier);
          }
        } else // currently NOT moving
        {
          // is he able & allowed to move?  (Errors with a reason are reported within)
          if (CanMoveBoxSoldierMoveStrategically(pSoldier, true)) {
            // change him to move instead
            SelectSoldierForMovement(pSoldier);

            if (pSoldier.bAssignment < Enum117.ON_DUTY) {
              // if everyone in the squad is now selected, select the squad itself
              if (AllSoldiersInSquadSelected(pSoldier.bAssignment)) {
                SelectSquadForMovement(pSoldier.bAssignment);
              }
            }
            /* ARM: it's more flexible without this - player can take the vehicle along or not without having to exit it.
                                                            else if( pSoldier->bAssignment == VEHICLE )
                                                            {
                                                                    // his vehicle MUST also go while he's moving, but not necessarily others on board
                                                                    SelectVehicleForMovement( pSoldier->iVehicleId, VEHICLE_ONLY );
                                                            }
            */
          }
        }
      } else if (iRegionType == Enum145.DONE_REGION) {
        // is something selected?
        if (IsAnythingSelectedForMoving()) {
          HandleMoveoutOfSectorMovementTroops();
          return;
        }
      } else if (iRegionType == Enum145.CANCEL_REGION) {
        fShowMapScreenMovementList = false;
        return;
      } else {
        AssertMsg(0, FormatString("MoveMenuBtnCallback: Invalid regionType %d, moveBoxLine %d", iRegionType, iMoveBoxLine));
        return;
      }

      fRebuildMoveBox = true;
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      fCharacterInfoPanelDirty = true;
      MarkAllBoxesAsAltered();
    }
  }

  return;
}

function CanMoveBoxSoldierMoveStrategically(pSoldier: SOLDIERTYPE, fShowErrorMessage: boolean): boolean {
  let bErrorNumber: INT8 = -1;

  // valid soldier?
  Assert(pSoldier);
  Assert(pSoldier.bActive);

  if (CanCharacterMoveInStrategic(pSoldier, createPointer(() => bErrorNumber, (v) => bErrorNumber = v))) {
    return true;
  } else {
    // function may fail without returning any specific error # (-1).
    // if it gave us the # of an error msg, and we were told to display it
    if ((bErrorNumber != -1) && fShowErrorMessage) {
      ReportMapScreenMovementError(bErrorNumber);
    }

    return false;
  }
}

function SelectAllOtherSoldiersInList(): void {
  let iCounter: INT32 = 0;
  let fSomeCantMove: boolean = false;

  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    if ((pSoldierMovingList[iCounter].bAssignment >= Enum117.ON_DUTY) && (pSoldierMovingList[iCounter].bAssignment != Enum117.VEHICLE)) {
      if (CanMoveBoxSoldierMoveStrategically(pSoldierMovingList[iCounter], false)) {
        fSoldierIsMoving[iCounter] = true;
      } else {
        fSomeCantMove = true;
      }
    }
  }

  if (fSomeCantMove) {
    // can't - some of the OTHER soldiers can't move
    ReportMapScreenMovementError(46);
  }
}

function DeselectAllOtherSoldiersInList(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    if ((pSoldierMovingList[iCounter].bAssignment >= Enum117.ON_DUTY) && (pSoldierMovingList[iCounter].bAssignment != Enum117.VEHICLE)) {
      fSoldierIsMoving[iCounter] = false;
    }
  }
}

function HandleMoveoutOfSectorMovementTroops(): void {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let iSquadNumber: INT32 = -1;
  let fCheckForCompatibleSquad: boolean = false;

  // cancel move box
  fShowMapScreenMovementList = false;

  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    pSoldier = pSoldierMovingList[iCounter];

    fCheckForCompatibleSquad = false;

    // if he is on a valid squad
    if (pSoldier.bAssignment < Enum117.ON_DUTY) {
      // if he and his squad are parting ways (soldier is staying behind, but squad is leaving, or vice versa)
      if (fSoldierIsMoving[iCounter] != IsSquadSelectedForMovement(pSoldier.bAssignment)) {
        // split the guy from his squad to any other compatible squad
        fCheckForCompatibleSquad = true;
      }
    }
    // if in a vehicle
    else if (pSoldier.bAssignment == Enum117.VEHICLE) {
      // if he and his vehicle are parting ways (soldier is staying behind, but vehicle is leaving, or vice versa)
      if (fSoldierIsMoving[iCounter] != IsVehicleSelectedForMovement(pSoldier.iVehicleId)) {
        // split the guy from his vehicle to any other compatible squad
        fCheckForCompatibleSquad = true;
      }
    } else // on his own - not on a squad or in a vehicle
    {
      // if he's going anywhere
      if (fSoldierIsMoving[iCounter]) {
        // find out if anyone is going with this guy...see if he can tag along
        fCheckForCompatibleSquad = true;
      }
    }

    if (fCheckForCompatibleSquad) {
      // look for a squad that's doing the same thing as this guy is and has room for him
      iSquadNumber = FindSquadThatSoldierCanJoin(pSoldier);
      if (iSquadNumber != -1) {
        if (!AddCharacterToSquad(pSoldier, (iSquadNumber))) {
          AssertMsg(0, FormatString("HandleMoveoutOfSectorMovementTroops: AddCharacterToSquad %d failed, iCounter %d", iSquadNumber, iCounter));
          // toggle whether he's going or not to try and recover somewhat gracefully
          fSoldierIsMoving[iCounter] = !fSoldierIsMoving[iCounter];
        }
      } else {
        // no existing squad is compatible, will have to start his own new squad
        iSquadNumber = AddCharacterToUniqueSquad(pSoldier);
        if (iSquadNumber != -1) {
          // It worked.  Add his new squad to the "moving squads" list so others can join it, too!
          AddSquadToMovingLists(iSquadNumber);

          // If this guy is moving
          if (fSoldierIsMoving[iCounter]) {
            // mark this new squad as moving too, so those moving can join it
            SelectSquadForMovement(iSquadNumber);
          }
        } else {
          // failed - should never happen!
          AssertMsg(0, FormatString("HandleMoveoutOfSectorMovementTroops: AddCharacterToUniqueSquad failed, iCounter %d", iCounter));
          // toggle whether he's going or not to try and recover somewhat gracefully
          fSoldierIsMoving[iCounter] = !fSoldierIsMoving[iCounter];
        }
      }
    }
  }

  // now actually set the list
  HandleSettingTheSelectedListOfMercs();

  return;
}

function HandleSettingTheSelectedListOfMercs(): void {
  let fFirstOne: boolean = true;
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let fSelected: boolean;

  // reset the selected character
  bSelectedDestChar = -1;

  // run through the list of grunts
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // is the current guy a valid character?
    if (gCharactersList[iCounter].fValid == true) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        fSelected = IsVehicleSelectedForMovement(pSoldier.bVehicleID);
      } else {
        fSelected = IsSoldierSelectedForMovement(pSoldier);
      }

      // is he/she selected for movement?
      if (fSelected) {
        // yes, are they the first one to be selected?
        if (fFirstOne == true) {
          // yes, then set them as the destination plotting character for movement arrow purposes
          fFirstOne = false;

          bSelectedDestChar = iCounter;
          // make DEST column glow
          giDestHighLine = iCounter;

          ChangeSelectedInfoChar(iCounter, true);
        }

        // add this guy to the selected list of grunts
        SetEntryInSelectedCharacterList(iCounter);
      }
    }
  }

  if (bSelectedDestChar != -1) {
    // set cursor
    SetUpCursorForStrategicMap();
    fTeamPanelDirty = true;
    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;

    DeselectSelectedListMercsWhoCantMoveWithThisGuy(Menptr[gCharactersList[bSelectedDestChar].usSolID]);

    // remember the current paths for all selected characters so we can restore them if need be
    RememberPreviousPathForAllSelectedChars();
  }
}

/*
INT32 GetSquadListIndexForSquadNumber( INT32 iSquadNumber )
{
        INT32 iCounter = 0;

        for( iCounter = 0; iCounter < giNumberOfSquadsInSectorMoving; iCounter++ )
        {
                if( iSquadMovingList[ iCounter ] == iSquadNumber )
                {
                        return( iCounter );
                }
        }

        return( -1 );
}
*/

function AllOtherSoldiersInListAreSelected(): boolean {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  for (iCounter = 0; iCounter < giNumberOfSoldiersInSectorMoving; iCounter++) {
    if ((pSoldierMovingList[iCounter].bAssignment >= Enum117.ON_DUTY) && (pSoldierMovingList[iCounter].bAssignment >= Enum117.VEHICLE)) {
      if (fSoldierIsMoving[iCounter] == false) {
        return false;
      }

      iCount++;
    }
  }

  // some merc on other assignments and no result?
  if (iCount) {
    return true;
  }

  return false;
}

function IsThisSquadInThisSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, bSquadValue: INT8): boolean {
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let bZ: INT8 = 0;

  // check if the squad is empty
  if (SquadIsEmpty(bSquadValue) == false) {
    // now grab the squad location
    ({ sX, sY, bZ } = GetLocationOfSquad(bSquadValue));

    // check if this non-empty squad is in this sector
    if ((sX == sSectorX) && (sY == sSectorY) && (bSectorZ == bZ)) {
      // a squad that's between sectors isn't *in* this sector
      if (!IsThisSquadOnTheMove(bSquadValue)) {
        // yep
        return true;
      }
    }
  }

  // nope
  return false;
}

function FindSquadThatSoldierCanJoin(pSoldier: SOLDIERTYPE): INT8 {
  // look for a squad that isn't full that can take this character
  let bCounter: INT8 = 0;

  // run through the list of squads
  for (bCounter = 0; bCounter < Enum275.NUMBER_OF_SQUADS; bCounter++) {
    // is this squad in this sector
    if (IsThisSquadInThisSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ, bCounter)) {
      // does it have room?
      if (IsThisSquadFull(bCounter) == false) {
        // is it doing the same thing as the soldier is (staying or going) ?
        if (IsSquadSelectedForMovement(bCounter) == IsSoldierSelectedForMovement(pSoldier)) {
          // go ourselves a match, then
          return bCounter;
        }
      }
    }
  }

  return -1;
}

export function ReBuildMoveBox(): void {
  // check to see if we need to rebuild the movement box and mouse regions
  if (fRebuildMoveBox == false) {
    return;
  }

  // reset the fact
  fRebuildMoveBox = false;
  fTeamPanelDirty = true;
  fMapPanelDirty = true;
  fCharacterInfoPanelDirty = true;

  // stop showing the box
  fShowMapScreenMovementList = false;
  CreateDestroyMovementBox(sSelMapX, sSelMapY, iCurrentMapSectorZ);

  // show the box
  fShowMapScreenMovementList = true;
  CreateDestroyMovementBox(sSelMapX, sSelMapY, iCurrentMapSectorZ);
  ShowBox(ghMoveBox);
  MarkAllBoxesAsAltered();
}

export function CreateScreenMaskForMoveBox(): void {
  if (fScreenMaskForMoveCreated == false) {
    // set up the screen mask
    MSYS_DefineRegion(gMoveBoxScreenMask, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MoveScreenMaskBtnCallback);

    fScreenMaskForMoveCreated = true;
  }
}

export function RemoveScreenMaskForMoveBox(): void {
  if (fScreenMaskForMoveCreated == true) {
    // remove the screen mask
    MSYS_RemoveRegion(gMoveBoxScreenMask);
    fScreenMaskForMoveCreated = false;
  }
}

function MoveScreenMaskBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for move box screen mask region
  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    fShowMapScreenMovementList = false;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    sSelectedMilitiaTown = 0;

    // are we showing the update box
    if (fShowUpdateBox) {
      fShowUpdateBox = false;
    }
  }

  return;
}

function ResetSoldierUpdateBox(): void {
  let iCounter: INT32 = 0;

  // delete any loaded faces
  for (iCounter = 0; iCounter < SIZE_OF_UPDATE_BOX; iCounter++) {
    if (pUpdateSoldierBox[iCounter] != null) {
      DeleteVideoObjectFromIndex(giUpdateSoldierFaces[iCounter]);
    }
  }

  if (giMercPanelImage != 0) {
    DeleteVideoObjectFromIndex(giMercPanelImage);
  }

  // reset the soldier ptrs in the update box
  for (iCounter = 0; iCounter < SIZE_OF_UPDATE_BOX; iCounter++) {
    pUpdateSoldierBox[iCounter] = <SOLDIERTYPE><unknown>null;
  }

  return;
}

export function GetNumberOfMercsInUpdateList(): INT32 {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  // run through the non-empty slots
  for (iCounter = 0; iCounter < SIZE_OF_UPDATE_BOX; iCounter++) {
    // valid guy here
    if (pUpdateSoldierBox[iCounter] != null) {
      iCount++;
    }
  }

  return iCount;
}

function IsThePopUpBoxEmpty(): boolean {
  let iCounter: INT32 = 0;
  let fEmpty: boolean = true;

  // run through the non-empty slots
  for (iCounter = 0; iCounter < SIZE_OF_UPDATE_BOX; iCounter++) {
    // valid guy here
    if (pUpdateSoldierBox[iCounter] != null) {
      fEmpty = false;
    }
  }

  return fEmpty;
}

export function AddSoldierToWaitingListQueue(pSoldier: SOLDIERTYPE): void {
  let iSoldierId: INT32 = 0;

  // get soldier profile
  iSoldierId = pSoldier.ubID;

  SpecialCharacterDialogueEvent(DIALOGUE_ADD_EVENT_FOR_SOLDIER_UPDATE_BOX, Enum204.UPDATE_BOX_REASON_ADDSOLDIER, iSoldierId, 0, 0, 0);
  return;
}

export function AddReasonToWaitingListQueue(iReason: INT32): void {
  SpecialCharacterDialogueEvent(DIALOGUE_ADD_EVENT_FOR_SOLDIER_UPDATE_BOX, Enum204.UPDATE_BOX_REASON_SET_REASON, iReason, 0, 0, 0);
  return;
}

export function AddDisplayBoxToWaitingQueue(): void {
  SpecialCharacterDialogueEvent(DIALOGUE_ADD_EVENT_FOR_SOLDIER_UPDATE_BOX, Enum204.UPDATE_BOX_REASON_SHOW_BOX, 0, 0, 0, 0);

  return;
}

export function ShowUpdateBox(): void {
  // we want to show the box
  fShowUpdateBox = true;
}

export function AddSoldierToUpdateBox(pSoldier: SOLDIERTYPE): void {
  let iCounter: INT32 = 0;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // going to load face
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;

  if (pSoldier.bLife == 0) {
    return;
  }

  if (pSoldier.bActive == false) {
    return;
  }

  // if update
  if (pUpdateSoldierBox[iCounter] == null) {
    VObjectDesc.ImageFile = "Interface\\panels.sti";
    if (!(giMercPanelImage = AddVideoObject(VObjectDesc))) {
      AssertMsg(0, "Failed to load Interface\\panels.sti");
    }
  }

  // run thought list of update soldiers
  for (iCounter = 0; iCounter < SIZE_OF_UPDATE_BOX; iCounter++) {
    // find a free slot
    if (pUpdateSoldierBox[iCounter] == null) {
      // add to box
      pUpdateSoldierBox[iCounter] = pSoldier;

      if (gMercProfiles[pSoldier.ubProfile].ubFaceIndex < 100) {
        // grab filename of face
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%s.sti", gMercProfiles[pSoldier.ubProfile].ubFaceIndex.toString().padStart(2, '0'));
      } else {
        // grab filename of face
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%s.sti", gMercProfiles[pSoldier.ubProfile].ubFaceIndex.toString().padStart(3, '0'));
      }

      // load the face
      giUpdateSoldierFaces[iCounter] = AddVideoObject(VObjectDesc);

      return;
    }
  }
  return;
}

export function SetSoldierUpdateBoxReason(iReason: INT32): void {
  // set the reason for the update
  iReasonForSoldierUpDate = iReason;

  return;
}

export function DisplaySoldierUpdateBox(): void {
  let iNumberOfMercsOnUpdatePanel: INT32 = 0;
  let iNumberHigh: INT32 = 0;
  let iNumberWide: INT32 = 0;
  let iUpdatePanelWidth: INT32 = 0;
  let iUpdatePanelHeight: INT32 = 0;
  let iX: INT32 = 0;
  let iY: INT32 = 0;
  let iFaceX: INT32 = 0;
  let iFaceY: INT32 = 0;
  let fFourWideMode: boolean = false;
  let hBackGroundHandle: SGPVObject;
  let iCounter: INT32 = 0;
  let sString: string /* CHAR16[32] */;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let iHeightOfString: INT32 = 0;
  let iCounterB: INT32 = 0;
  let iOrigNumberHigh: INT32 = 0;
  let iOrigY: INT32 = 0;
  let iUpperLimit: INT32 = 0;

  if (fShowUpdateBox == false) {
    return;
  }

  // get the number of mercs
  iNumberOfMercsOnUpdatePanel = GetNumberOfMercsInUpdateList();

  if (iNumberOfMercsOnUpdatePanel == 0) {
    // nobody home
    fShowUpdateBox = false;
    // unpause
    UnPauseDialogueQueue();
    return;
  }

  giSleepHighLine = -1;
  giDestHighLine = -1;
  giContractHighLine = -1;
  giAssignHighLine = -1;

  // InterruptTime();
  PauseGame();
  LockPauseState(4);

  PauseDialogueQueue();

  // do we have enough for 4 wide, or just 2 wide?
  if (iNumberOfMercsOnUpdatePanel > NUMBER_OF_MERCS_FOR_FOUR_WIDTH_UPDATE_PANEL) {
    fFourWideMode = true;
  }

  // get number of rows
  iNumberHigh = (fFourWideMode ? Math.trunc(iNumberOfMercsOnUpdatePanel / NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE) : Math.trunc(iNumberOfMercsOnUpdatePanel / NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE));

  // number of columns
  iNumberWide = (fFourWideMode ? NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE : NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE);

  // get the height and width of the box .. will need to add in stuff for borders, lower panel...etc
  if (fFourWideMode) {
    // do we need an extra row for left overs
    if (iNumberOfMercsOnUpdatePanel % NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE) {
      iNumberHigh++;
    }
  } else {
    // do we need an extra row for left overs
    if (iNumberOfMercsOnUpdatePanel % NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE) {
      iNumberHigh++;
    }
  }

  // round off
  if (fFourWideMode) {
    if (iNumberOfMercsOnUpdatePanel % NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE) {
      iNumberOfMercsOnUpdatePanel += NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE - (iNumberOfMercsOnUpdatePanel % NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE);
    }
  } else {
    if (iNumberOfMercsOnUpdatePanel % NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE) {
      iNumberOfMercsOnUpdatePanel += NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE - (iNumberOfMercsOnUpdatePanel % NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE);
    }
  }

  iUpdatePanelWidth = iNumberWide * TACT_WIDTH_OF_UPDATE_PANEL_BLOCKS;

  iUpdatePanelHeight = (iNumberHigh + 1) * TACT_HEIGHT_OF_UPDATE_PANEL_BLOCKS;

  // get the x,y offsets on the screen of the panel
  iX = 290 + Math.trunc((336 - iUpdatePanelWidth) / 2);

  //	iY = 28 + ( 288 - iUpdatePanelHeight ) / 2;

  // Have the bottom of the box ALWAYS a set distance from the bottom of the map ( so user doesnt have to move mouse far )
  iY = 280 - iUpdatePanelHeight;

  hBackGroundHandle = GetVideoObject(guiUpdatePanelTactical);

  // Display the 2 TOP corner pieces
  BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 0, iX - 4, iY - 4, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 2, iX + iUpdatePanelWidth, iY - 4, VO_BLT_SRCTRANSPARENCY, null);

  if (fFourWideMode) {
    // Display 2 vertical lines starting at the bottom
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 3, iX - 4, iY + iUpdatePanelHeight - 3 - 70, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 5, iX + iUpdatePanelWidth, iY + iUpdatePanelHeight - 3 - 70, VO_BLT_SRCTRANSPARENCY, null);

    // Display the 2 bottom corner pieces
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 0, iX - 4, iY + iUpdatePanelHeight - 3, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 2, iX + iUpdatePanelWidth, iY + iUpdatePanelHeight - 3, VO_BLT_SRCTRANSPARENCY, null);
  }

  SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);

  iUpperLimit = fFourWideMode ? (iNumberOfMercsOnUpdatePanel + NUMBER_OF_MERC_COLUMNS_FOR_FOUR_WIDE_MODE) : (iNumberOfMercsOnUpdatePanel + NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE);

  // need to put the background down first
  for (iCounter = 0; iCounter < iUpperLimit; iCounter++) {
    // blt the face and name

    // get the face x and y
    iFaceX = iX + (iCounter % iNumberWide) * TACT_UPDATE_MERC_FACE_X_WIDTH;
    iFaceY = iY + Math.trunc(iCounter / iNumberWide) * TACT_UPDATE_MERC_FACE_X_HEIGHT;

    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 20, iFaceX, iFaceY, VO_BLT_SRCTRANSPARENCY, null);
  }

  // loop through the mercs to be displayed
  for (iCounter = 0; iCounter < (iNumberOfMercsOnUpdatePanel <= NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE ? NUMBER_OF_MERC_COLUMNS_FOR_TWO_WIDE_MODE : iNumberOfMercsOnUpdatePanel); iCounter++) {
    //
    // blt the face and name
    //

    // get the face x and y
    iFaceX = iX + (iCounter % iNumberWide) * TACT_UPDATE_MERC_FACE_X_WIDTH;
    iFaceY = iY + Math.trunc(iCounter / iNumberWide) * TACT_UPDATE_MERC_FACE_X_HEIGHT + REASON_FOR_SOLDIER_UPDATE_OFFSET_Y;

    // now get the face
    if (pUpdateSoldierBox[iCounter]) {
      iFaceX += TACT_UPDATE_MERC_FACE_X_OFFSET;
      iFaceY += TACT_UPDATE_MERC_FACE_Y_OFFSET;

      // there is a face
      RenderSoldierSmallFaceForUpdatePanel(iCounter, iFaceX, iFaceY);

      // display the mercs name
      sString = swprintf("%s", pUpdateSoldierBox[iCounter].name);
      DrawTextToScreen(sString, (iFaceX - 5), (iFaceY + 31), 57, TINYFONT1(), FONT_LTRED, FONT_BLACK, false, CENTER_JUSTIFIED);
    }
  }

  // the button container box
  if (fFourWideMode) {
    // def: 3/1/99 WAS SUBINDEX 6,
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 19, iX - 4 + TACT_UPDATE_MERC_FACE_X_WIDTH, iY + iNumberHigh * TACT_UPDATE_MERC_FACE_X_HEIGHT + REASON_FOR_SOLDIER_UPDATE_OFFSET_Y + 3, VO_BLT_SRCTRANSPARENCY, null);

    // ATE: Display string for time compression
    DisplayWrappedString((iX), (iY + iNumberHigh * TACT_UPDATE_MERC_FACE_X_HEIGHT + 5 + REASON_FOR_SOLDIER_UPDATE_OFFSET_Y + 3), (iUpdatePanelWidth), 0, MAP_SCREEN_FONT(), FONT_WHITE, gzLateLocalizedString[49], FONT_BLACK, false, CENTER_JUSTIFIED);
  } else {
    // def: 3/1/99 WAS SUBINDEX 6,
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 19, iX - 4, iY + iNumberHigh * TACT_UPDATE_MERC_FACE_X_HEIGHT + REASON_FOR_SOLDIER_UPDATE_OFFSET_Y + 3, VO_BLT_SRCTRANSPARENCY, null);

    // ATE: Display string for time compression
    DisplayWrappedString((iX), (iY + iNumberHigh * TACT_UPDATE_MERC_FACE_X_HEIGHT + 5 + REASON_FOR_SOLDIER_UPDATE_OFFSET_Y + 3), (iUpdatePanelWidth), 0, MAP_SCREEN_FONT(), FONT_WHITE, gzLateLocalizedString[49], FONT_BLACK, false, CENTER_JUSTIFIED);
  }

  iCounter = 0;

  // now wrap the border
  for (iCounter = 0; iCounter < iNumberHigh; iCounter++) {
    // the sides
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 3, iX - 4, iY + (iCounter)*TACT_UPDATE_MERC_FACE_X_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 5, iX + iUpdatePanelWidth, iY + (iCounter)*TACT_UPDATE_MERC_FACE_X_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
  }

  // big horizontal line
  for (iCounter = 0; iCounter < iNumberWide; iCounter++) {
    // the top bottom
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 1, iX + TACT_UPDATE_MERC_FACE_X_WIDTH * (iCounter), iY - 4, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(guiSAVEBUFFER, hBackGroundHandle, 1, iX + TACT_UPDATE_MERC_FACE_X_WIDTH * (iCounter), iY + iUpdatePanelHeight - 3, VO_BLT_SRCTRANSPARENCY, null);
  }

  // Display the reason for the update box
  if (fFourWideMode) {
    DisplayWrappedString((iX), (iY + 6), iUpdatePanelWidth, 0, MAP_SCREEN_FONT(), FONT_WHITE, pUpdateMercStrings[iReasonForSoldierUpDate], FONT_BLACK, false, CENTER_JUSTIFIED);
  } else {
    DisplayWrappedString((iX), (iY + 3), iUpdatePanelWidth, 0, MAP_SCREEN_FONT(), FONT_WHITE, pUpdateMercStrings[iReasonForSoldierUpDate], FONT_BLACK, false, CENTER_JUSTIFIED);
  }

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  // restore extern background rect
  RestoreExternBackgroundRect((iX - 5), (iY - 5), (iUpdatePanelWidth + 10), (iUpdatePanelHeight + 6));

  CreateDestroyUpdatePanelButtons(iX, (iY + iUpdatePanelHeight - 18), fFourWideMode);
  MarkAButtonDirty(guiUpdatePanelButtons[0]);
  MarkAButtonDirty(guiUpdatePanelButtons[1]);
  return;
}

/* static */ let CreateDestroyUpdatePanelButtons__fCreated: boolean = false;
function CreateDestroyUpdatePanelButtons(iX: INT32, iY: INT32, fFourWideMode: boolean): void {
  if ((fShowUpdateBox == true) && (CreateDestroyUpdatePanelButtons__fCreated == false)) {
    // set to created
    CreateDestroyUpdatePanelButtons__fCreated = true;

    fShowAssignmentMenu = false;
    fShowContractMenu = false;

    //		guiUpdatePanelButtonsImage[ 0 ]=  LoadButtonImage( "INTERFACE\\group_confirm.sti" ,-1,7,-1,8,-1 );
    //		guiUpdatePanelButtonsImage[ 1 ] = LoadButtonImage( "INTERFACE\\group_confirm.sti" ,-1,7,-1,8,-1 );
    guiUpdatePanelButtonsImage[0] = LoadButtonImage("INTERFACE\\group_confirm_tactical.sti", -1, 7, -1, 8, -1);
    guiUpdatePanelButtonsImage[1] = LoadButtonImage("INTERFACE\\group_confirm_tactical.sti", -1, 7, -1, 8, -1);

    if (fFourWideMode) {
      guiUpdatePanelButtons[0] = QuickCreateButton(guiUpdatePanelButtonsImage[0], (iX - 4 + TACT_UPDATE_MERC_FACE_X_WIDTH + 4), iY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, ContinueUpdateButtonCallback);

      guiUpdatePanelButtons[1] = QuickCreateButton(guiUpdatePanelButtonsImage[1], (iX - 4 + 2 * TACT_UPDATE_MERC_FACE_X_WIDTH + 4), iY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, StopUpdateButtonCallback);
    } else {
      guiUpdatePanelButtons[0] = QuickCreateButton(guiUpdatePanelButtonsImage[0], (iX), iY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, ContinueUpdateButtonCallback);

      guiUpdatePanelButtons[1] = QuickCreateButton(guiUpdatePanelButtonsImage[1], (iX + TACT_UPDATE_MERC_FACE_X_WIDTH), iY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, StopUpdateButtonCallback);
    }

    SpecifyButtonText(guiUpdatePanelButtons[0], pUpdatePanelButtons[0]);
    SpecifyButtonFont(guiUpdatePanelButtons[0], MAP_SCREEN_FONT());
    SpecifyButtonUpTextColors(guiUpdatePanelButtons[0], FONT_MCOLOR_BLACK, FONT_BLACK);
    SpecifyButtonDownTextColors(guiUpdatePanelButtons[0], FONT_MCOLOR_BLACK, FONT_BLACK);
    SetButtonFastHelpText(guiUpdatePanelButtons[0], gzLateLocalizedString[51]);

    SpecifyButtonText(guiUpdatePanelButtons[1], pUpdatePanelButtons[1]);
    SpecifyButtonFont(guiUpdatePanelButtons[1], MAP_SCREEN_FONT());
    SpecifyButtonUpTextColors(guiUpdatePanelButtons[1], FONT_MCOLOR_BLACK, FONT_BLACK);
    SpecifyButtonDownTextColors(guiUpdatePanelButtons[1], FONT_MCOLOR_BLACK, FONT_BLACK);
    SetButtonFastHelpText(guiUpdatePanelButtons[1], gzLateLocalizedString[52]);
  } else if ((fShowUpdateBox == false) && (CreateDestroyUpdatePanelButtons__fCreated == true)) {
    // set to uncreated
    CreateDestroyUpdatePanelButtons__fCreated = false;

    // get rid of the buttons and images
    RemoveButton(guiUpdatePanelButtons[0]);
    RemoveButton(guiUpdatePanelButtons[1]);

    UnloadButtonImage(guiUpdatePanelButtonsImage[0]);
    UnloadButtonImage(guiUpdatePanelButtonsImage[1]);

    // unpause
    UnPauseDialogueQueue();
  }
}

/*
void CreateUpdateBox( void )
{
        // create basic box
 CreatePopUpBox(&ghUpdateBox, AssignmentDimensions, MovePosition, (POPUP_BOX_FLAG_CLIP_TEXT|POPUP_BOX_FLAG_RESIZE ));

 // which buffer will box render to
 SetBoxBuffer(ghUpdateBox, FRAME_BUFFER);

 // border type?
 SetBorderType(ghUpdateBox,guiPOPUPBORDERS);

 // background texture
 SetBackGroundSurface(ghUpdateBox, guiPOPUPTEX);

 // margin sizes
 SetMargins( ghUpdateBox, 6, 6, 4, 4 );

 // space between lines
 SetLineSpace(ghUpdateBox, 2);

 // set current box to this one
 SetCurrentBox( ghUpdateBox );

 // add strings
 CreateUpdateBoxStrings( );

 // set font type
 SetBoxFont(ghUpdateBox, MAP_SCREEN_FONT);

 // set highlight color
 SetBoxHighLight(ghUpdateBox, FONT_WHITE);

 // unhighlighted color
 SetBoxForeground(ghUpdateBox, FONT_LTGREEN);

 // background color
 SetBoxBackground(ghUpdateBox, FONT_BLACK);

 // shaded color..for darkened text
 SetBoxShade( ghUpdateBox, FONT_BLACK );

 // resize box to text
 ResizeBoxToText( ghUpdateBox );

 // create screen mask
 CreateScreenMaskForMoveBox( );

 ShowBox( ghUpdateBox );

        return;
}


void CreateUpdateBoxStrings( void )
{
        INT32 iCounter = 0;
        CHAR16 sString[ 64 ];
        INT32 hStringHandle;

        swprintf( sString, L"%s", pUpdateMercStrings[ iReasonForSoldierUpDate ] );
        AddMonoString(&hStringHandle, sString );

        for( iCounter = 0; iCounter < SIZE_OF_UPDATE_BOX; iCounter++ )
        {
                // find valid soldier, add name
                if( pUpdateSoldierBox[ iCounter ] )
                {
                        swprintf( sString, L"%s", pUpdateSoldierBox[ iCounter ]->name );
                        AddMonoString(&hStringHandle, sString );
                }
        }

        // add a few blank lines
        sString[ 0 ] = 0;

        AddMonoString(&hStringHandle, sString );
        AddMonoString(&hStringHandle, sString );
        AddMonoString(&hStringHandle, sString );
        AddMonoString(&hStringHandle, sString );
}



void RemoveUpdateBox( void )
{
        // remove the box
        RemoveBox( ghUpdateBox );
        ghUpdateBox = -1;

        iReasonForSoldierUpDate = NO_REASON_FOR_UPDATE;

        // remove the screen mask
        RemoveScreenMaskForMoveBox( );

        // reset mercs that are in progress of being updated
        ResetSoldierUpdateBox( );
}



void DisplayUpdateBox( void )
{
        if( fShowUpdateBox )
        {
                // show the box
                ShowBox( ghUpdateBox );
                PauseTime( TRUE );
        }
        return;
}
*/

/* static */ let CreateDestroyTheUpdateBox__fCreated: boolean = false;
export function CreateDestroyTheUpdateBox(): void {
  if ((CreateDestroyTheUpdateBox__fCreated == false) && (fShowUpdateBox == true)) {
    if (GetNumberOfMercsInUpdateList() == 0) {
      fShowUpdateBox = false;
      return;
    }

    CreateDestroyTheUpdateBox__fCreated = true;

    // InterruptTime();
    // create screen mask
    CreateScreenMaskForMoveBox();

    // lock it paused
    PauseGame();
    LockPauseState(5);

    // display the box
    DisplaySoldierUpdateBox();

    // Do beep
    PlayJA2SampleFromFile("Sounds\\newbeep.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
  } else if ((CreateDestroyTheUpdateBox__fCreated == true) && (fShowUpdateBox == false)) {
    CreateDestroyTheUpdateBox__fCreated = false;

    UnLockPauseState();
    UnPauseGame();

    // dirty screen
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;

    // remove screen mask
    RemoveScreenMaskForMoveBox();

    ResetSoldierUpdateBox();

    CreateDestroyUpdatePanelButtons(0, 0, false);
  }
}

function UpdateButtonsDuringCharacterDialoguePicture(): void {
  // stop showing buttons during certain instances of dialogue
  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    UnMarkButtonDirty(giCharInfoButton[0]);
    UnMarkButtonDirty(giCharInfoButton[1]);
  }
}

function UpdateButtonsDuringCharacterDialogueSubTitles(): void {
  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) && (gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES])) {
    UnMarkButtonDirty(giMapContractButton);
  }

  return;
}

function RenderSoldierSmallFaceForUpdatePanel(iIndex: INT32, iX: INT32, iY: INT32): void {
  let iStartY: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  // fill the background for the info bars black
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 36, iY + 2, iX + 44, iY + 30, 0);

  // put down the background
  BltVideoObjectFromIndex(guiSAVEBUFFER, giMercPanelImage, 0, iX, iY, VO_BLT_SRCTRANSPARENCY, null);

  // grab the face
  BltVideoObjectFromIndex(guiSAVEBUFFER, giUpdateSoldierFaces[iIndex], 0, iX + 2, iY + 2, VO_BLT_SRCTRANSPARENCY, null);

  // HEALTH BAR
  pSoldier = pUpdateSoldierBox[iIndex];

  // is the merc alive?
  if (!pSoldier.bLife)
    return;

  // yellow one for bleeding
  iStartY = iY + 29 - Math.trunc(27 * pSoldier.bLifeMax / 100);
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 36, iStartY, iX + 37, iY + 29, Get16BPPColor(FROMRGB(107, 107, 57)));
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 37, iStartY, iX + 38, iY + 29, Get16BPPColor(FROMRGB(222, 181, 115)));

  // pink one for bandaged.
  iStartY += Math.trunc(27 * pSoldier.bBleeding / 100);
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 36, iStartY, iX + 37, iY + 29, Get16BPPColor(FROMRGB(156, 57, 57)));
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 37, iStartY, iX + 38, iY + 29, Get16BPPColor(FROMRGB(222, 132, 132)));

  // red one for actual health
  iStartY = iY + 29 - Math.trunc(27 * pSoldier.bLife / 100);
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 36, iStartY, iX + 37, iY + 29, Get16BPPColor(FROMRGB(107, 8, 8)));
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 37, iStartY, iX + 38, iY + 29, Get16BPPColor(FROMRGB(206, 0, 0)));

  // BREATH BAR
  iStartY = iY + 29 - Math.trunc(27 * pSoldier.bBreathMax / 100);
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 39, iStartY, iX + 40, iY + 29, Get16BPPColor(FROMRGB(8, 8, 132)));
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 40, iStartY, iX + 41, iY + 29, Get16BPPColor(FROMRGB(8, 8, 107)));

  // MORALE BAR
  iStartY = iY + 29 - Math.trunc(27 * pSoldier.bMorale / 100);
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 42, iStartY, iX + 43, iY + 29, Get16BPPColor(FROMRGB(8, 156, 8)));
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, iX + 43, iStartY, iX + 44, iY + 29, Get16BPPColor(FROMRGB(8, 107, 8)));

  return;
}

function ContinueUpdateButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      EndUpdateBox(true); // restart time compression
    }
  }

  return;
}

function StopUpdateButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      EndUpdateBox(false); // stop time compression
    }
  }

  return;
}

export function EndUpdateBox(fContinueTimeCompression: boolean): void {
  fShowUpdateBox = false;

  CreateDestroyTheUpdateBox();

  if (fContinueTimeCompression) {
    StartTimeCompression();
  } else {
    StopTimeCompression();
  }
}

export function SetUpdateBoxFlag(fFlag: boolean): void {
  // set the flag
  fShowUpdateBox = fFlag;
  return;
}

export function SetTixaAsFound(): void {
  // set the town of Tixa as found by the player
  fFoundTixa = true;
  fMapPanelDirty = true;
}

export function SetOrtaAsFound(): void {
  // set the town of Orta as found by the player
  fFoundOrta = true;
  fMapPanelDirty = true;
}

export function SetSAMSiteAsFound(uiSamIndex: UINT8): void {
  // set this SAM site as being found by the player
  fSamSiteFound[uiSamIndex] = true;
  fMapPanelDirty = true;
}

// ste up the timers for move menu in mapscreen for double click detection
export function InitTimersForMoveMenuMouseRegions(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    giDblClickTimersForMoveBoxMouseRegions[iCounter] = 0;
  }
}

export function UpdateHelpTextForMapScreenMercIcons(): void {
  if ((bSelectedInfoChar == -1) || (gCharactersList[bSelectedInfoChar].fValid == false)) {
    SetRegionFastHelpText(gContractIconRegion, "");
    SetRegionFastHelpText(gInsuranceIconRegion, "");
    SetRegionFastHelpText(gDepositIconRegion, "");
  } else {
    // if merc is an AIM merc
    if (Menptr[gCharactersList[bSelectedInfoChar].usSolID].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
      SetRegionFastHelpText(gContractIconRegion, zMarksMapScreenText[22]);
    } else {
      SetRegionFastHelpText(gContractIconRegion, "");
    }

    // if merc has life insurance
    if (Menptr[gCharactersList[bSelectedInfoChar].usSolID].usLifeInsurance > 0) {
      SetRegionFastHelpText(gInsuranceIconRegion, zMarksMapScreenText[3]);
    } else {
      SetRegionFastHelpText(gInsuranceIconRegion, "");
    }

    // if merc has a medical deposit
    if (Menptr[gCharactersList[bSelectedInfoChar].usSolID].usMedicalDeposit > 0) {
      SetRegionFastHelpText(gDepositIconRegion, zMarksMapScreenText[12]);
    } else {
      SetRegionFastHelpText(gDepositIconRegion, "");
    }
  }
}

/* static */ let CreateDestroyInsuranceMouseRegionForMercs__fCreated: boolean = false;
export function CreateDestroyInsuranceMouseRegionForMercs(fCreate: boolean): void {
  if ((CreateDestroyInsuranceMouseRegionForMercs__fCreated == false) && (fCreate == true)) {
    MSYS_DefineRegion(gContractIconRegion, CHAR_ICON_X, CHAR_ICON_CONTRACT_Y, CHAR_ICON_X + CHAR_ICON_WIDTH, CHAR_ICON_CONTRACT_Y + CHAR_ICON_HEIGHT, MSYS_PRIORITY_HIGH - 1, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

    MSYS_DefineRegion(gInsuranceIconRegion, CHAR_ICON_X, CHAR_ICON_CONTRACT_Y + CHAR_ICON_SPACING, CHAR_ICON_X + CHAR_ICON_WIDTH, CHAR_ICON_CONTRACT_Y + CHAR_ICON_SPACING + CHAR_ICON_HEIGHT, MSYS_PRIORITY_HIGH - 1, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

    MSYS_DefineRegion(gDepositIconRegion, CHAR_ICON_X, CHAR_ICON_CONTRACT_Y + (2 * CHAR_ICON_SPACING), CHAR_ICON_X + CHAR_ICON_WIDTH, CHAR_ICON_CONTRACT_Y + (2 * CHAR_ICON_SPACING) + CHAR_ICON_HEIGHT, MSYS_PRIORITY_HIGH - 1, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

    CreateDestroyInsuranceMouseRegionForMercs__fCreated = true;
  } else if ((CreateDestroyInsuranceMouseRegionForMercs__fCreated == true) && (fCreate == false)) {
    MSYS_RemoveRegion(gContractIconRegion);
    MSYS_RemoveRegion(gInsuranceIconRegion);
    MSYS_RemoveRegion(gDepositIconRegion);
    CreateDestroyInsuranceMouseRegionForMercs__fCreated = false;
  }
}

/*
void HandlePlayerEnteringMapScreenBeforeGoingToTactical( void )
{
        CHAR16 sString[ 256 ];

        if( !( AnyMercsHired( ) ) )
        {
                // no mercs hired inform player they must hire mercs
                swprintf( sString, pMapScreenJustStartedHelpText[ 0 ] );
                DoMapMessageBox( MSG_BOX_BASIC_STYLE, sString, MAP_SCREEN, MSG_BOX_FLAG_OK, DoneHandlePlayerFirstEntryToMapScreen );

        }
        else
        {
                // player has mercs hired, tell them to time compress to get things underway
                swprintf( sString, pMapScreenJustStartedHelpText[ 1 ] );
                fShowMapScreenHelpText = TRUE;
        }



        // now inform the player

        if( fShowMapScreenHelpText )
        {
                fShowMapScreenHelpText = FALSE;
                SetUpShutDownMapScreenHelpTextScreenMask( );
                fShowMapScreenHelpText = TRUE;
        }

        return;
}


void DoneHandlePlayerFirstEntryToMapScreen(  UINT8 bExitValue )
{
        static BOOLEAN fFirstTime = TRUE;

        if( bExitValue == MSG_BOX_RETURN_OK )
        {
                if( fFirstTime == TRUE )
                {
                        fFirstTime = FALSE;
                        fShowMapScreenHelpText = TRUE;
                }
        }
}
*/

export function HandleTimeCompressWithTeamJackedInAndGearedToGo(): boolean {
  // check a team is ready to go
  if (!(AnyMercsHired())) {
    // no mercs, leave
    return false;
  }

  // make sure the game just started
  if (gTacticalStatus.fDidGameJustStart == false) {
    return false;
  }

  // select starting sector (A9 - Omerta)
  ChangeSelectedMapSector(9, 1, 0);

  // load starting sector
  if (!SetCurrentWorldSector(9, 1, 0)) {
    return false;
  }

  // Setup variables in the PBI for this first battle.  We need to support the
  // non-persistant PBI in case the user goes to mapscreen.
  gfBlitBattleSectorLocator = true;
  gubPBSectorX = 9;
  gubPBSectorY = 1;
  gubPBSectorZ = 0;
  gubEnemyEncounterCode = Enum164.ENTERING_ENEMY_SECTOR_CODE;

  InitHelicopterEntranceByMercs();

  FadeInGameScreen();

  SetUpShutDownMapScreenHelpTextScreenMask();

  // Add e-mail message
  AddEmail(ENRICO_CONGRATS, ENRICO_CONGRATS_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());

  return true;
}

function HandleDisplayOfExitToTacticalMessageForFirstEntryToMapScreen(): void {
  let iTime: INT32 = 0;
  let iDifference: INT32 = 0;

  if (gTacticalStatus.fDidGameJustStart == false) {
    return;
  }

  if (AnyMercsHired() == false) {
    return;
  }

  if (fResetTimerForFirstEntryIntoMapScreen) {
    giExitToTactBaseTime = 0;
    fResetTimerForFirstEntryIntoMapScreen = false;
  }

  // is this the first time in?
  if (giExitToTactBaseTime == 0) {
    // gte the clock, for initing
    giExitToTactBaseTime = GetJA2Clock();
  }

  iTime = GetJA2Clock();

  iDifference = iTime - giExitToTactBaseTime;

  if (iDifference > TIMER_FOR_SHOW_EXIT_TO_TACTICAL_MESSAGE) {
    fShowMapScreenHelpText = false;
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    giExitToTactBaseTime = 0;
  }

  return;
}

export function NotifyPlayerWhenEnemyTakesControlOfImportantSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, fContested: boolean): boolean {
  let sString: string /* CHAR16[128] */;
  let sStringA: string /* CHAR16[64] */;
  let sStringB: string /* CHAR16[256] */;
  let sStringC: string /* CHAR16[64] */;
  let iValue: INT32 = 0;
  let bTownId: INT8 = 0;
  let sSector: INT16 = 0;
  let bMineIndex: INT8;

  // are we below ground?
  if (bSectorZ != 0) {
    // yes we are..there is nothing important to player here
    return false;
  }

  // get the name of the sector
  sString = GetSectorIDString(sSectorX, sSectorY, bSectorZ, true);

  bTownId = GetTownIdForSector(sSectorX, sSectorY);

  // check if SAM site here
  if (IsThisSectorASAMSector(sSectorX, sSectorY, bSectorZ)) {
    sStringB = swprintf(pMapErrorString[15], sString);

    // put up the message informing the player of the event
    DoScreenIndependantMessageBox(sStringB, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
    return true;
  }

  // check if a mine is here
  if (IsThereAMineInThisSector(sSectorX, sSectorY)) {
    bMineIndex = GetMineIndexForSector(sSectorX, sSectorY);

    // if it was producing for us
    if ((GetMaxDailyRemovalFromMine(bMineIndex) > 0) && SpokenToHeadMiner(bMineIndex)) {
      // get how much we now will get from the mines
      iValue = GetProjectedTotalDailyIncome();

      // parse the string
      sStringC = swprintf("%d", iValue);

      // insert
      sStringC = InsertCommasForDollarFigure(sStringC);
      sStringC = InsertDollarSignInToString(sStringC);

      sStringB = swprintf(pMapErrorString[16], sString, sStringC);

      // put up the message informing the player of the event
      DoScreenIndependantMessageBox(sStringB, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
      return true;
    }
  }

  if (fContested && bTownId) {
    if (bTownId == Enum135.SAN_MONA) {
      // San Mona isn't important.
      return true;
    }
    sStringB = swprintf(pMapErrorString[25], sString);

    // put up the message informing the player of the event
    DoScreenIndependantMessageBox(sStringB, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
    return true;
  }

  // get the strategic sector value
  sSector = sSectorX + MAP_WORLD_X * sSectorY;

  if (StrategicMap[sSector].bNameId == Enum135.BLANK_SECTOR) {
    return false;
  }

  // get the name of the sector
  sStringA = GetSectorIDString(sSectorX, sSectorY, bSectorZ, true);

  // now build the string
  sString = swprintf(pMapErrorString[17], sStringA);

  // put up the message box
  DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);

  return true;
}

export function NotifyPlayerOfInvasionByEnemyForces(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, ReturnCallback: MSGBOX_CALLBACK): void {
  let sSector: INT16 = 0;
  let bTownId: INT8 = 0;
  let sString: string /* CHAR16[128] */;
  let sStringA: string /* CHAR16[128] */;

  // check if below ground
  if (bSectorZ != 0) {
    return;
  }

  // grab sector value
  sSector = sSectorX + MAP_WORLD_X * sSectorY;

  if (StrategicMap[sSector].fEnemyControlled == true) {
    // enemy controlled any ways, leave
    return;
  }

  // get the town id
  bTownId = StrategicMap[sSector].bNameId;

  // check if SAM site here
  if (IsThisSectorASAMSector(sSectorX, sSectorY, bSectorZ)) {
    // get sector id value
    sStringA = GetShortSectorString(sSectorX, sSectorY);

    sString = swprintf(pMapErrorString[22], sStringA);
    DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, ReturnCallback);
  } else if (bTownId) {
    // get the name of the sector
    sStringA = GetSectorIDString(sSectorX, sSectorY, bSectorZ, true);

    sString = swprintf(pMapErrorString[23], sStringA);
    DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, ReturnCallback);
  } else {
    // get sector id value
    sStringA = GetShortSectorString(sSectorX, sSectorY);

    sString = swprintf(pMapErrorString[24], sStringA);
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, sString);
  }
}

function CanCharacterMoveInStrategic(pSoldier: SOLDIERTYPE, pbErrorNumber: Pointer<INT8>): boolean {
  let fCanMove: boolean = true;
  let sSector: INT16 = 0;
  let fProblemExists: boolean = false;

  // valid soldier?
  Assert(pSoldier);
  Assert(pSoldier.bActive);

  // NOTE: Check for the most permanent conditions first, and the most easily remedied ones last!
  // In case several cases apply, only the reason found first will be given, so make it a good one!

  // still in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    pbErrorNumber.value = 8;
    return false;
  }

  // a POW?
  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    pbErrorNumber.value = 5;
    return false;
  }

  // underground? (can't move strategically, must use tactical traversal )
  if (pSoldier.bSectorZ != 0) {
    pbErrorNumber.value = 1;
    return false;
  }

  // vehicle checks
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    // empty (needs a driver!)?
    if (GetNumberInVehicle(pSoldier.bVehicleID) == 0) {
      pbErrorNumber.value = 32;
      return false;
    }

    // too damaged?
    if (pSoldier.bLife < OKLIFE) {
      pbErrorNumber.value = 47;
      return false;
    }

    // out of fuel?
    if (!VehicleHasFuel(pSoldier)) {
      pbErrorNumber.value = 42;
      return false;
    }
  } else // non-vehicle
  {
    // dead?
    if (pSoldier.bLife <= 0) {
      gsCustomErrorString = swprintf(pMapErrorString[35], pSoldier.name);
      pbErrorNumber.value = -99; // customized error message!
      return false;
    }

    // too injured?
    if (pSoldier.bLife < OKLIFE) {
      gsCustomErrorString = swprintf(pMapErrorString[33], pSoldier.name);
      pbErrorNumber.value = -99; // customized error message!
      return false;
    }
  }

  // if merc is in a particular sector, not somewhere in between
  if (pSoldier.fBetweenSectors == false) {
    // and he's NOT flying above it all in a working helicopter
    if (!SoldierAboardAirborneHeli(pSoldier)) {
      // and that sector is loaded...
      if ((pSoldier.sSectorX == gWorldSectorX) && (pSoldier.sSectorY == gWorldSectorY) && (pSoldier.bSectorZ == gbWorldSectorZ)) {
        // in combat?
        if (gTacticalStatus.uiFlags & INCOMBAT) {
          pbErrorNumber.value = 11;
          return false;
        }

        // hostile sector?
        if (gTacticalStatus.fEnemyInSector) {
          pbErrorNumber.value = 2;
          return false;
        }

        // air raid in loaded sector where character is?
        if (InAirRaid()) {
          pbErrorNumber.value = 10;
          return false;
        }
      }

      // not necessarily loaded - if there are any hostiles there
      if (NumHostilesInSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) > 0) {
        pbErrorNumber.value = 2;
        return false;
      }
    }
  }

  // if in L12 museum, and the museum alarm went off, and Eldin still around?
  if ((pSoldier.sSectorX == 12) && (pSoldier.sSectorY == MAP_ROW_L) && (pSoldier.bSectorZ == 0) && (!pSoldier.fBetweenSectors) && gMercProfiles[Enum268.ELDIN].bMercStatus != MERC_IS_DEAD) {
    let ubRoom: UINT8;
    let cnt: UINT8;
    let pSoldier2: SOLDIERTYPE;

    if ((ubRoom = InARoom(pSoldier.sGridNo)) !== -1 && ubRoom >= 22 && ubRoom <= 41) {
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

      for (pSoldier2 = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier2 = MercPtrs[cnt]) {
        if (pSoldier2.bActive) {
          if (FindObj(pSoldier2, Enum225.CHALICE) != ITEM_NOT_FOUND) {
            pbErrorNumber.value = 34;
            return false;
          }
        }
      }
    }
  }

  // on assignment, other than just in a VEHICLE?
  if ((pSoldier.bAssignment >= Enum117.ON_DUTY) && (pSoldier.bAssignment != Enum117.VEHICLE)) {
    pbErrorNumber.value = 3;
    return false;
  }

  // if he's walking/driving, and so tired that he would just stop the group anyway in the next sector,
  // or already asleep and can't be awakened
  if (PlayerSoldierTooTiredToTravel(pSoldier)) {
    // too tired
    gsCustomErrorString = swprintf(pMapErrorString[43], pSoldier.name);
    pbErrorNumber.value = -99; // customized error message!
    return false;
  }

  // a robot?
  if (AM_A_ROBOT(pSoldier)) {
    // going alone?
    if (((pSoldier.bAssignment == Enum117.VEHICLE) && (!IsRobotControllerInVehicle(pSoldier.iVehicleId))) || ((pSoldier.bAssignment < Enum117.ON_DUTY) && (!IsRobotControllerInSquad(pSoldier.bAssignment)))) {
      pbErrorNumber.value = 49;
      return false;
    }
  }
  // an Escorted NPC?
  else if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    // going alone?
    if (((pSoldier.bAssignment == Enum117.VEHICLE) && (GetNumberOfNonEPCsInVehicle(pSoldier.iVehicleId) == 0)) || ((pSoldier.bAssignment < Enum117.ON_DUTY) && (NumberOfNonEPCsInSquad(pSoldier.bAssignment) == 0))) {
      // are they male or female
      if (gMercProfiles[pSoldier.ubProfile].bSex == Enum272.MALE) {
        gsCustomErrorString = swprintf("%s %s", pSoldier.name, pMapErrorString[6]);
      } else {
        gsCustomErrorString = swprintf("%s %s", pSoldier.name, pMapErrorString[7]);
      }

      pbErrorNumber.value = -99; // customized error message!
      return false;
    }
  }

  // assume there's no problem
  fProblemExists = false;

  // find out if this particular character can't move for some reason
  switch (pSoldier.ubProfile) {
    case (Enum268.MARIA):
      // Maria can't move if she's in sector C5
      sSector = SECTOR(pSoldier.sSectorX, pSoldier.sSectorY);
      if (sSector == Enum123.SEC_C5) {
        // can't move at this time
        fProblemExists = true;
      }
      break;
  }

  if (fProblemExists) {
    // inform user this specific merc cannot be moved out of the sector
    gsCustomErrorString = swprintf(pMapErrorString[29], pSoldier.name);
    pbErrorNumber.value = -99; // customized error message!
    return false;
  }

  // passed all checks - this character may move strategically!
  return true;
}

export function CanEntireMovementGroupMercIsInMove(pSoldier: SOLDIERTYPE, pbErrorNumber: Pointer<INT8>): boolean {
  let pCurrentSoldier: SOLDIERTYPE;
  let iCounter: INT32 = 0;
  let ubGroup: UINT8 = 0;
  let ubCurrentGroup: UINT8 = 0;

  // first check the requested character himself
  if (CanCharacterMoveInStrategic(pSoldier, pbErrorNumber) == false) {
    // failed no point checking anyone else
    return false;
  }

  // now check anybody who would be travelling with him

  // does character have group?
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    // IS a vehicle - use vehicle's group
    ubGroup = pVehicleList[pSoldier.bVehicleID].ubMovementGroup;
  } else if (pSoldier.bAssignment == Enum117.VEHICLE) {
    // IN a vehicle - use vehicle's group
    ubGroup = pVehicleList[pSoldier.iVehicleId].ubMovementGroup;
  } else {
    ubGroup = pSoldier.ubGroupID;
  }

  // even if group is 0 (not that that should happen, should it?) still loop through for other mercs selected to move

  // if anyone in the merc's group or also selected cannot move for whatever reason return false
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      // get soldier
      pCurrentSoldier = Menptr[gCharactersList[iCounter].usSolID];

      // skip inactive grunts
      if (pCurrentSoldier.bActive == false) {
        continue;
      }

      // skip the same guy we did already
      if (pCurrentSoldier == pSoldier) {
        continue;
      }

      // does character have group?
      if (pCurrentSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        // IS a vehicle
        ubCurrentGroup = pVehicleList[pCurrentSoldier.bVehicleID].ubMovementGroup;
      } else if (pCurrentSoldier.bAssignment == Enum117.VEHICLE) {
        // IN a vehicle
        ubCurrentGroup = pVehicleList[pCurrentSoldier.iVehicleId].ubMovementGroup;
      } else {
        ubCurrentGroup = pCurrentSoldier.ubGroupID;
      }

      // if he is in the same movement group (i.e. squad), or he is still selected to go with us (legal?)
      if ((ubCurrentGroup == ubGroup) || (fSelectedListOfMercsForMapScreen[iCounter] == true)) {
        // can this character also move strategically?
        if (CanCharacterMoveInStrategic(pCurrentSoldier, pbErrorNumber) == false) {
          // cannot move, fail, and don't bother checking anyone else, either
          return false;
        }
      }
    }
  }

  // everybody can move...  Yey!  :-)
  return true;
}

export function ReportMapScreenMovementError(bErrorNumber: INT8): void {
  if (bErrorNumber == -99) {
    // - 99 is a special message # indicating a customized message
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gsCustomErrorString, Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  } else {
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMapErrorString[bErrorNumber], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  }
}

// we are checking to see if we need to in fact rebuild the characterlist for mapscreen
export function HandleRebuildingOfMapScreenCharacterList(): void {
  // check if we need to rebuild the list?
  if (fReBuildCharacterList) {
    // do the actual rebuilding
    ReBuildCharactersList();

    // reset the flag
    fReBuildCharacterList = false;
  }
}

export function RequestToggleTimeCompression(): void {
  if (!IsTimeBeingCompressed()) {
    StartTimeCompression();
  } else // currently compressing
  {
    StopTimeCompression();
  }
}

export function RequestIncreaseInTimeCompression(): void {
  if (IsTimeBeingCompressed()) {
    IncreaseGameTimeCompressionRate();
  } else {
    /*
                    // start compressing
                    StartTimeCompression();
    */
    // ARM Change: start over at 5x compression
    SetGameTimeCompressionLevel(Enum130.TIME_COMPRESS_5MINS);
  }
}

export function RequestDecreaseInTimeCompression(): void {
  if (IsTimeBeingCompressed()) {
    DecreaseGameTimeCompressionRate();
  } else {
    // check that we can
    if (!AllowedToTimeCompress()) {
      // not allowed to compress time
      TellPlayerWhyHeCantCompressTime();
      return;
    }

    // ARM Change: do nothing
    /*
                    // if compression mode is set, just restart time so player can see it
                    if ( giTimeCompressMode > TIME_COMPRESS_X1 )
                    {
                            StartTimeCompression();
                    }
    */
  }
}

function CanSoldierMoveWithVehicleId(pSoldier: SOLDIERTYPE, iVehicle1Id: INT32): boolean {
  let iVehicle2Id: INT32 = -1;
  let pVehicle1: VEHICLETYPE;
  let pVehicle2: VEHICLETYPE;

  Assert(iVehicle1Id != -1);

  // if soldier is IN a vehicle
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    iVehicle2Id = pSoldier.iVehicleId;
  } else
      // if soldier IS a vehicle
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    iVehicle2Id = pSoldier.bVehicleID;
  }

  // if also (in) a vehicle
  if (iVehicle2Id != -1) {
    // if it's the same vehicle
    if (iVehicle1Id == iVehicle2Id) {
      return true;
    }

    // helicopter can't move together with ground vehicles!
    if ((iVehicle1Id == iHelicopterVehicleId) || (iVehicle2Id == iHelicopterVehicleId)) {
      return false;
    }

    pVehicle1 = pVehicleList[iVehicle1Id];
    pVehicle2 = pVehicleList[iVehicle2Id];

    // as long as they're in the same location, amd neither is between sectors, different vehicles is also ok
    if ((pVehicle1.sSectorX == pVehicle2.sSectorX) && (pVehicle1.sSectorY == pVehicle2.sSectorY) && (pVehicle1.sSectorZ == pVehicle2.sSectorZ) && !pVehicle1.fBetweenSectors && !pVehicle2.fBetweenSectors) {
      return true;
    }
  }

  // not in/is a vehicle, or in a different vehicle that isn't in the same location
  return false;
}

export function SaveLeaveItemList(hFile: HWFILE): boolean {
  let iCounter: INT32 = 0;
  let pCurrentItem: MERC_LEAVE_ITEM | null;
  let uiCount: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;
  let fNodeExists: boolean = false;
  let uiCnt: UINT32;
  let buffer: Buffer;

  for (iCounter = 0; iCounter < NUM_LEAVE_LIST_SLOTS; iCounter++) {
    // go through nodes and save them
    if (gpLeaveListHead[iCounter] != null) {
      fNodeExists = true;

      // Save the to specify that a node DOES exist
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(Number(fNodeExists), 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }

      uiCount = 1;
      pCurrentItem = gpLeaveListHead[iCounter];

      // loop through all the nodes to see how many there are
      while (pCurrentItem.pNext) {
        pCurrentItem = pCurrentItem.pNext;
        uiCount++;
      }

      // Save the number specifing how many items there are in the list
      buffer = Buffer.allocUnsafe(4);
      buffer.writeUInt32LE(uiCount, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 4);
      if (uiNumBytesWritten != 4) {
        return false;
      }

      pCurrentItem = gpLeaveListHead[iCounter];

      // loop through all the nodes to see how many there are
      buffer = Buffer.allocUnsafe(MERC_LEAVE_ITEM_SIZE);
      for (uiCnt = 0; uiCnt < uiCount; uiCnt++) {
        // Save the items
        writeMercLeaveItem(<MERC_LEAVE_ITEM>pCurrentItem, buffer);
        uiNumBytesWritten = FileWrite(hFile, buffer, MERC_LEAVE_ITEM_SIZE);
        if (uiNumBytesWritten != MERC_LEAVE_ITEM_SIZE) {
          return false;
        }

        pCurrentItem = (<MERC_LEAVE_ITEM>pCurrentItem).pNext;
      }
    } else {
      fNodeExists = false;
      // Save the to specify that a node DOENST exist
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(Number(fNodeExists), 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }
    }
  }

  // Save the leave list profile id's
  buffer = Buffer.allocUnsafe(4);
  for (iCounter = 0; iCounter < NUM_LEAVE_LIST_SLOTS; iCounter++) {
    buffer.writeUInt32LE(guiLeaveListOwnerProfileId[iCounter], 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) {
      return false;
    }
  }

  return true;
}

export function LoadLeaveItemList(hFile: HWFILE): boolean {
  let iCounter: INT32 = 0;
  let pCurrentItem: MERC_LEAVE_ITEM | null;
  let pItem: MERC_LEAVE_ITEM;
  let uiCount: UINT32 = 0;
  let uiNumBytesRead: UINT32 = 0;
  let fNodeExists: boolean = false;
  let uiSubItem: UINT32;
  let buffer: Buffer;

  // Shutdown the list
  ShutDownLeaveList();

  // init the list
  InitLeaveList();

  // loop through all the lists
  for (iCounter = 0; iCounter < NUM_LEAVE_LIST_SLOTS; iCounter++) {
    // load the flag that specifis that a node DOES exist
    buffer = Buffer.allocUnsafe(1);
    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) {
      return false;
    }

    fNodeExists = Boolean(buffer.readUInt8(0));

    // if a root node is supposed to exist
    if (fNodeExists) {
      // load the number specifing how many items there are in the list
      buffer = Buffer.allocUnsafe(4);
      uiNumBytesRead = FileRead(hFile, buffer, 4);
      if (uiNumBytesRead != 4) {
        return false;
      }

      uiCount = buffer.readUInt32LE(0);

      // allocate space
      gpLeaveListHead[iCounter] = createMercLeaveItem();

      pCurrentItem = gpLeaveListHead[iCounter];

      for (uiSubItem = 0; uiSubItem < uiCount; uiSubItem++) {
        // allocate space
        pItem = createMercLeaveItem();

        // Load the items
        buffer = Buffer.allocUnsafe(MERC_LEAVE_ITEM_SIZE);
        uiNumBytesRead = FileRead(hFile, buffer, MERC_LEAVE_ITEM_SIZE);
        if (uiNumBytesRead != MERC_LEAVE_ITEM_SIZE) {
          return false;
        }

        readMercLeaveItem(pItem, buffer);

        pItem.pNext = null;

        // add the node to the list
        if (uiSubItem == 0) {
          gpLeaveListHead[iCounter] = pItem;
          pCurrentItem = gpLeaveListHead[iCounter];
        } else {
          pCurrentItem.pNext = pItem;
          pCurrentItem = pCurrentItem.pNext;
        }
      }
    }
  }

  // Load the leave list profile id's
  buffer = Buffer.allocUnsafe(4);
  for (iCounter = 0; iCounter < NUM_LEAVE_LIST_SLOTS; iCounter++) {
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      return false;
    }

    guiLeaveListOwnerProfileId[iCounter] = buffer.readUInt32LE(0);
  }

  return true;
}

export function TurnOnSectorLocator(ubProfileID: UINT8): void {
  let pSoldier: SOLDIERTYPE | null;

  Assert(ubProfileID != NO_PROFILE);

  pSoldier = FindSoldierByProfileID(ubProfileID, false);
  if (pSoldier) {
    gsSectorLocatorX = pSoldier.sSectorX;
    gsSectorLocatorY = pSoldier.sSectorY;
  } else {
    // if it's Skyrider (when he's not on our team), and his chopper has been setup
    if ((ubProfileID == Enum268.SKYRIDER) && fSkyRiderSetUp) {
      // if helicopter position is being shown, don't do this, too, cause the helicopter icon is on top and it looks
      // like crap.  I tried moving the heli icon blit to before, but that screws up it's blitting.
      if (!fShowAircraftFlag) {
        // can't use his profile, he's where his chopper is
        Assert(iHelicopterVehicleId != -1);
        gsSectorLocatorX = pVehicleList[iHelicopterVehicleId].sSectorX;
        gsSectorLocatorY = pVehicleList[iHelicopterVehicleId].sSectorY;
      } else {
        return;
      }
    } else {
      gsSectorLocatorX = gMercProfiles[ubProfileID].sSectorX;
      gsSectorLocatorY = gMercProfiles[ubProfileID].sSectorY;
    }
  }
  gubBlitSectorLocatorCode = Enum156.LOCATOR_COLOR_YELLOW;
}

export function TurnOffSectorLocator(): void {
  gubBlitSectorLocatorCode = Enum156.LOCATOR_COLOR_NONE;
  fMapPanelDirty = true;
}

/* static */ let HandleBlitOfSectorLocatorIcon__ubFrame: UINT8 = 0;
export function HandleBlitOfSectorLocatorIcon(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16, ubLocatorID: UINT8): void {
  let ubBaseFrame: UINT8 = 0;
  let uiTimer: UINT32 = 0;
  let hHandle: SGPVObject;
  let sScreenX: INT16;
  let sScreenY: INT16;

  // blits at 0,0 had been observerd...
  Assert((sSectorX >= 1) && (sSectorX <= 16));
  Assert((sSectorY >= 1) && (sSectorY <= 16));
  Assert((sSectorZ >= 0) && (sSectorZ <= 3));

  if (sSectorZ != iCurrentMapSectorZ) {
    // if the z level of the map screen renderer is different than the
    // sector z that we wish to locate, then don't render it
    return;
  }

  // if showing sector inventory, don't do this
  if (fShowMapInventoryPool) {
    return;
  }

  hHandle = GetVideoObject(guiSectorLocatorGraphicID);

  switch (ubLocatorID) {
    // grab zoomed out icon
    case Enum156.LOCATOR_COLOR_RED:
      ubBaseFrame = 0;
      HandleBlitOfSectorLocatorIcon__ubFrame = (HandleBlitOfSectorLocatorIcon__ubFrame % 13);
      break;
    case Enum156.LOCATOR_COLOR_YELLOW:
      ubBaseFrame = 13;
      HandleBlitOfSectorLocatorIcon__ubFrame = (13 + (HandleBlitOfSectorLocatorIcon__ubFrame % 13));
      break;
    default:
      // not supported
      return;
  }

  // Convert the sector value into screen values.
  ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY(sSectorX, sSectorY));
  // make sure we are on the border
  if (sScreenX < MAP_GRID_X) {
    sScreenX = MAP_GRID_X;
  }
  sScreenY--; // Carterism ritual
  if (sScreenY < MAP_GRID_Y) {
    sScreenY = MAP_GRID_Y;
  }

  uiTimer = GetJA2Clock();

  // if first time in, reset value
  if (guiSectorLocatorBaseTime == 0) {
    guiSectorLocatorBaseTime = GetJA2Clock();
  }

  // check if enough time has passed to update the frame counter
  if (ANIMATED_BATTLEICON_FRAME_TIME < (uiTimer - guiSectorLocatorBaseTime)) {
    guiSectorLocatorBaseTime = uiTimer;
    HandleBlitOfSectorLocatorIcon__ubFrame++;

    if (HandleBlitOfSectorLocatorIcon__ubFrame > ubBaseFrame + MAX_FRAME_COUNT_FOR_ANIMATED_BATTLE_ICON) {
      HandleBlitOfSectorLocatorIcon__ubFrame = ubBaseFrame;
    }
  }

  RestoreExternBackgroundRect((sScreenX + 1), (sScreenY - 1), MAP_GRID_X, MAP_GRID_Y);

  // blit object to frame buffer
  BltVideoObject(FRAME_BUFFER, hHandle, HandleBlitOfSectorLocatorIcon__ubFrame, sScreenX, sScreenY, VO_BLT_SRCTRANSPARENCY, null);

  // invalidate region on frame buffer
  InvalidateRegion(sScreenX, sScreenY - 1, sScreenX + MAP_GRID_X, sScreenY + MAP_GRID_Y);
}

export function CheckIfSalaryIncreasedAndSayQuote(pSoldier: SOLDIERTYPE, fTriggerContractMenu: boolean): boolean {
  Assert(pSoldier);

  // OK, check if their price has gone up
  if (pSoldier.fContractPriceHasIncreased) {
    if (fTriggerContractMenu) {
      // have him say so first - post the dialogue event with the contract menu event
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_ENTER_MAPSCREEN, 0, 0, 0, 0, 0);
      HandleImportantMercQuote(pSoldier, Enum202.QUOTE_MERC_GONE_UP_IN_PRICE);
      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_SHOW_CONTRACT_MENU, 0, 0);
    } else {
      // now post the dialogue event and the contratc menu event
      HandleImportantMercQuote(pSoldier, Enum202.QUOTE_MERC_GONE_UP_IN_PRICE);
    }

    pSoldier.fContractPriceHasIncreased = false;

    // said quote / triggered contract menu
    return true;
  } else {
    // nope, nothing to do
    return false;
  }
}

}
