namespace ja2 {

// various reason an assignment can be aborted before completion
const enum Enum113 {
  NO_MORE_MED_KITS = 40,
  INSUF_DOCTOR_SKILL,
  NO_MORE_TOOL_KITS,
  INSUF_REPAIR_SKILL,

  NUM_ASSIGN_ABORT_REASONS,
}

const enum Enum114 {
  REPAIR_MENU_VEHICLE1 = 0,
  REPAIR_MENU_VEHICLE2,
  REPAIR_MENU_VEHICLE3,
  //	REPAIR_MENU_SAM_SITE,
  REPAIR_MENU_ROBOT,
  REPAIR_MENU_ITEMS,
  REPAIR_MENU_CANCEL,
}

const enum Enum115 {
  VEHICLE_MENU_VEHICLE1 = 0,
  VEHICLE_MENU_VEHICLE2,
  VEHICLE_MENU_VEHICLE3,
  VEHICLE_MENU_CANCEL,
}

const enum Enum116 {
  REPAIR_HANDS_AND_ARMOR = 0,
  REPAIR_HEADGEAR,
  REPAIR_POCKETS,
  NUM_REPAIR_PASS_TYPES,
}

const FINAL_REPAIR_PASS = Enum116.REPAIR_POCKETS;

interface REPAIR_PASS_SLOTS_TYPE {
  ubChoices: UINT8; // how many valid choices there are in this pass
  bSlot: INT8[] /* [12] */; // list of slots to be repaired in this pass
}

function createRepairPassSlotsTypeFrom(ubChoices: UINT8, bSlot: INT8[]): REPAIR_PASS_SLOTS_TYPE {
  return {
    ubChoices,
    bSlot,
  };
}

let gRepairPassSlotList: REPAIR_PASS_SLOTS_TYPE[] /* [NUM_REPAIR_PASS_TYPES] */ = [
  // pass					# choices												slots repaired in this pass
  createRepairPassSlotsTypeFrom(/* hands and armor */ 5, [ Enum261.HANDPOS, Enum261.SECONDHANDPOS, Enum261.VESTPOS, Enum261.HELMETPOS, Enum261.LEGPOS, -1, -1, -1, -1, -1, -1, -1 ]),
  createRepairPassSlotsTypeFrom(/* headgear */ 2, [ Enum261.HEAD1POS, Enum261.HEAD2POS, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ]),
  createRepairPassSlotsTypeFrom(/* pockets */ 12, [ Enum261.BIGPOCK1POS, Enum261.BIGPOCK2POS, Enum261.BIGPOCK3POS, Enum261.BIGPOCK4POS, Enum261.SMALLPOCK1POS, Enum261.SMALLPOCK2POS, Enum261.SMALLPOCK3POS, Enum261.SMALLPOCK4POS, Enum261.SMALLPOCK5POS, Enum261.SMALLPOCK6POS, Enum261.SMALLPOCK7POS, Enum261.SMALLPOCK8POS ]),
];

// PopUp Box Handles
export let ghAssignmentBox: INT32 = -1;
export let ghEpcBox: INT32 = -1;
export let ghSquadBox: INT32 = -1;
export let ghVehicleBox: INT32 = -1;
export let ghRepairBox: INT32 = -1;
export let ghTrainingBox: INT32 = -1;
export let ghAttributeBox: INT32 = -1;
export let ghRemoveMercAssignBox: INT32 = -1;
export let ghContractBox: INT32 = -1;
export let ghMoveBox: INT32 = -1;
// INT32 ghUpdateBox = -1;

// the x,y position of assignment pop up in tactical
let gsAssignmentBoxesX: INT16;
let gsAssignmentBoxesY: INT16;

// assignment menu mouse regions
let gAssignmentMenuRegion: MOUSE_REGION[] /* [MAX_ASSIGN_STRING_COUNT] */ = createArrayFrom(Enum148.MAX_ASSIGN_STRING_COUNT, createMouseRegion);
let gTrainingMenuRegion: MOUSE_REGION[] /* [MAX_TRAIN_STRING_COUNT] */ = createArrayFrom(Enum149.MAX_TRAIN_STRING_COUNT, createMouseRegion);
let gAttributeMenuRegion: MOUSE_REGION[] /* [MAX_ATTRIBUTE_STRING_COUNT] */ = createArrayFrom(Enum146.MAX_ATTRIBUTE_STRING_COUNT, createMouseRegion);
let gSquadMenuRegion: MOUSE_REGION[] /* [MAX_SQUAD_MENU_STRING_COUNT] */ = createArrayFrom(Enum151.MAX_SQUAD_MENU_STRING_COUNT, createMouseRegion);
let gContractMenuRegion: MOUSE_REGION[] /* [MAX_CONTRACT_MENU_STRING_COUNT] */ = createArrayFrom(Enum152.MAX_CONTRACT_MENU_STRING_COUNT, createMouseRegion);
let gRemoveMercAssignRegion: MOUSE_REGION[] /* [MAX_REMOVE_MERC_COUNT] */ = createArrayFrom(Enum150.MAX_REMOVE_MERC_COUNT, createMouseRegion);
let gEpcMenuRegion: MOUSE_REGION[] /* [MAX_EPC_MENU_STRING_COUNT] */ = createArrayFrom(Enum147.MAX_EPC_MENU_STRING_COUNT, createMouseRegion);
let gRepairMenuRegion: MOUSE_REGION[] /* [20] */ = createArrayFrom(20, createMouseRegion);

// mouse region for vehicle menu
let gVehicleMenuRegion: MOUSE_REGION[] /* [20] */ = createArrayFrom(20, createMouseRegion);

let gAssignmentScreenMaskRegion: MOUSE_REGION = createMouseRegion();

export let fShownAssignmentMenu: boolean = false;
let fShowVehicleMenu: boolean = false;
export let fShowRepairMenu: boolean = false;
export let fShownContractMenu: boolean = false;

export let fFirstClickInAssignmentScreenMask: boolean = false;

// we are in fact training?..then who temmates, or self?
let gbTrainingMode: INT8 = -1;

let gfAddDisplayBoxToWaitingQueue: boolean = false;

let gpDismissSoldier: SOLDIERTYPE = <SOLDIERTYPE><unknown>null;

export let gfReEvaluateEveryonesNothingToDo: boolean = false;

// the amount time must be on assignment before it can have any effect
const MINUTES_FOR_ASSIGNMENT_TO_COUNT = 45;

// number we divide the total pts accumlated per day by for each assignment period
const ASSIGNMENT_UNITS_PER_DAY = 24;

// base skill to deal with an emergency
const BASE_MEDICAL_SKILL_TO_DEAL_WITH_EMERGENCY = 20;

// multiplier for skill needed for each point below OKLIFE
const MULTIPLIER_FOR_DIFFERENCE_IN_LIFE_VALUE_FOR_EMERGENCY = 4;

// number of pts needed for each point below OKLIFE
const POINT_COST_PER_HEALTH_BELOW_OKLIFE = 2;

// how many points of healing each hospital patients gains per hour in the hospital
const HOSPITAL_HEALING_RATE = 5; // a top merc doctor can heal about 4 pts/hour maximum, but that's spread among patients!

// increase to reduce repair pts, or vice versa
const REPAIR_RATE_DIVISOR = 2500;
// increase to reduce doctoring pts, or vice versa
const DOCTORING_RATE_DIVISOR = 2400; // at 2400, the theoretical maximum is 150 full healing pts/day

// cost to unjam a weapon in repair pts
const REPAIR_COST_PER_JAM = 2;

// divisor for rate of self-training
const SELF_TRAINING_DIVISOR = 1000;
// the divisor for rate of training bonus due to instructors influence
const INSTRUCTED_TRAINING_DIVISOR = 3000;

// this controls how fast town militia gets trained
const TOWN_TRAINING_RATE = 4;

const MAX_MILITIA_TRAINERS_PER_SECTOR = 2;

// militia training bonus for EACH level of teaching skill (percentage points)
const TEACH_BONUS_TO_TRAIN = 30;
// militia training bonus for RPC (percentage points)
const RPC_BONUS_TO_TRAIN = 10;

// the bonus to training in marksmanship in the Alma gun range sector
const GUN_RANGE_TRAINING_BONUS = 25;

// breath bonus divider
const BREATH_BONUS_DIVIDER = 10;

// the min rating that is need to teach a fellow teammate
const MIN_RATING_TO_TEACH = 25;

// activity levels for natural healing ( the higher the number, the slower the natural recover rate
const LOW_ACTIVITY_LEVEL = 1;
const MEDIUM_ACTIVITY_LEVEL = 4;
const HIGH_ACTIVITY_LEVEL = 12;

/*
// the min breath to stay awake
#define MIN_BREATH_TO_STAY_AWAKE 15

// average number of hours a merc needs to sleep per day
#define AVG_NUMBER_OF_HOURS_OF_SLEEP_NEEDED 7
*/

/* Assignment distance limits removed.  Sep/11/98.  ARM
#define MAX_DISTANCE_FOR_DOCTORING	5
#define MAX_DISTANCE_FOR_REPAIR			5
#define MAX_DISTANCE_FOR_TRAINING		5
*/

/*
// controls how easily SAM sites are repaired
// NOTE: A repairman must generate a least this many points / hour to be ABLE to repair a SAM site at all!
#define SAM_SITE_REPAIR_DIVISOR		10

// minimum condition a SAM site must be in to be fixable
#define MIN_CONDITION_TO_FIX_SAM 20
*/

// a list of which sectors have characters
let fSectorsWithSoldiers: boolean[][] /* [MAP_WORLD_X * MAP_WORLD_Y][4] */ = createArrayFrom(MAP_WORLD_X * MAP_WORLD_Y, () => createArray(4, false));

/*
// auto sleep mercs
BOOLEAN AutoSleepMerc( SOLDIERTYPE *pSoldier );
*/

// glow area for contract region?
export let fGlowContractRegion: boolean = false;

/*
// get how fast the person regains sleep
INT8 GetRegainDueToSleepNeeded( SOLDIERTYPE *pSoldier, INT32 iRateOfReGain );
*/

/* No point in allowing SAM site repair any more.  Jan/13/99.  ARM
BOOLEAN IsTheSAMSiteInSectorRepairable( INT16 sSectorX, INT16 sSectorY, INT16 sSectorZ );
BOOLEAN SoldierInSameSectorAsSAM( SOLDIERTYPE *pSoldier );
BOOLEAN CanSoldierRepairSAM( SOLDIERTYPE *pSoldier, INT8 bRepairPoints );
BOOLEAN IsSoldierCloseEnoughToSAMControlPanel( SOLDIERTYPE *pSoldier );
*/

/* Assignment distance limits removed.  Sep/11/98.  ARM
BOOLEAN IsSoldierCloseEnoughToADoctor( SOLDIERTYPE *pPatient );
*/

export function InitSectorsWithSoldiersList(): void {
  // init list of sectors
  for (let i = 0; i < fSectorsWithSoldiers.length; i++) {
    fSectorsWithSoldiers[i].fill(false);
  }

  return;
}

export function BuildSectorsWithSoldiersList(): void {
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;

  pSoldier = MercPtrs[0];

  // fills array with pressence of player controlled characters
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      fSectorsWithSoldiers[pTeamSoldier.sSectorX + pTeamSoldier.sSectorY * MAP_WORLD_X][pTeamSoldier.bSectorZ] = true;
    }
  }
}

export function ChangeSoldiersAssignment(pSoldier: SOLDIERTYPE, bAssignment: INT8): void {
  // This is the most basic assignment-setting function.  It must be called before setting any subsidiary
  // values like fFixingRobot.  It will clear all subsidiary values so we don't leave the merc in a messed
  // up state!

  pSoldier.bAssignment = bAssignment;
  /// don't kill iVehicleId, though, 'cause militia training tries to put guys back in their vehicles when it's done(!)

  pSoldier.fFixingSAMSite = false;
  pSoldier.fFixingRobot = false;
  pSoldier.bVehicleUnderRepairID = -1;

  if ((bAssignment == Enum117.DOCTOR) || (bAssignment == Enum117.PATIENT) || (bAssignment == Enum117.ASSIGNMENT_HOSPITAL)) {
    AddStrategicEvent(Enum132.EVENT_BANDAGE_BLEEDING_MERCS, GetWorldTotalMin() + 1, 0);
  }

  // update character info, and the team panel
  fCharacterInfoPanelDirty = true;
  fTeamPanelDirty = true;

  // merc may have come on/off duty, make sure map icons are updated
  fMapPanelDirty = true;
}

function BasicCanCharacterAssignment(pSoldier: SOLDIERTYPE, fNotInCombat: boolean): boolean {
  // global conditions restricting all assignment changes
  if (SectorIsImpassable(SECTOR(pSoldier.sSectorX, pSoldier.sSectorY))) {
    return false;
  }

  if (fNotInCombat && pSoldier.bActive && pSoldier.bInSector && gTacticalStatus.fEnemyInSector) {
    return false;
  }

  return true;
}

/*
BOOLEAN CanSoldierAssignment( SOLDIERTYPE *pSoldier, INT8 bAssignment )
{
        switch( bAssignment )
        {
                case( DOCTOR ):
                        return( CanCharacterDoctor( pSoldier ) );
                        break;
                case( PATIENT ):
                        return( CanCharacterPatient( pSoldier ) );
                        break;
                case( REPAIR ):
                        return( CanCharacterRepair( pSoldier ) );
                        break;
                case( TRAIN_TOWN ):
                        return( CanCharacterTrainMilitia( pSoldier ) );
                        break;
                case( TRAIN_SELF ):
                        return( CanCharacterTrainStat( pSoldier, pSoldier -> bTrainStat, TRUE, FALSE ) );
                        break;
                case( TRAIN_TEAMMATE ):
                        return( CanCharacterTrainStat( pSoldier, pSoldier -> bTrainStat, FALSE, TRUE ) );
                        break;
                case TRAIN_BY_OTHER:
                        return( CanCharacterTrainStat( pSoldier, pSoldier -> bTrainStat, TRUE, FALSE ) );
                        break;
                case( VEHICLE ):
                        return( CanCharacterVehicle( pSoldier ) );
                        break;
                default:
                        return( (CanCharacterSquad( pSoldier, bAssignment ) == CHARACTER_CAN_JOIN_SQUAD ) );
                        break;
        }
}
*/

function CanCharacterDoctorButDoesntHaveMedKit(pSoldier: SOLDIERTYPE): boolean {
  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  // make sure character is alive and conscious
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return false;
  }

  // has medical skill?
  if (pSoldier.bMedical <= 0) {
    // no skill whatsoever
    return false;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // character on the move?
  if (CharacterIsBetweenSectors(pSoldier)) {
    return false;
  }

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    // epcs can't do this
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }

  return true;
}

// is character capable of 'playing' doctor?
// check that character is alive, conscious, has medical skill and equipment
function CanCharacterDoctor(pSoldier: SOLDIERTYPE): boolean {
  let fFoundMedKit: boolean = false;
  let bPocket: INT8 = 0;

  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  if (CanCharacterDoctorButDoesntHaveMedKit(pSoldier) == false) {
    return false;
  }

  // find med kit
  for (bPocket = Enum261.HANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
    // doctoring is allowed using either type of med kit (but first aid kit halves doctoring effectiveness)
    if (IsMedicalKitItem(pSoldier.inv[bPocket])) {
      fFoundMedKit = true;
      break;
    }
  }

  if (fFoundMedKit == false) {
    return false;
  }

  // all criteria fit, can doctor
  return true;
}

function IsAnythingAroundForSoldierToRepair(pSoldier: SOLDIERTYPE): boolean {
  let iCounter: INT32;

  // items?
  if (DoesCharacterHaveAnyItemsToRepair(pSoldier, FINAL_REPAIR_PASS)) {
    return true;
  }

  // robot?
  if (CanCharacterRepairRobot(pSoldier)) {
    return true;
  }

  // vehicles?
  if (pSoldier.bSectorZ == 0) {
    for (iCounter = 0; iCounter < ubNumberOfVehicles; iCounter++) {
      if (pVehicleList[iCounter].fValid == true) {
        // the helicopter, is NEVER repairable...
        if (iCounter != iHelicopterVehicleId) {
          if (IsThisVehicleAccessibleToSoldier(pSoldier, iCounter)) {
            if (CanCharacterRepairVehicle(pSoldier, iCounter) == true) {
              // there is a repairable vehicle here
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

function HasCharacterFinishedRepairing(pSoldier: SOLDIERTYPE): boolean {
  let fCanStillRepair: boolean;

  // NOTE: This must detect situations where the vehicle/robot has left the sector, in which case we want the
  // guy to say "assignment done", so we return that he can no longer repair

  // check if we are repairing a vehicle
  if (pSoldier.bVehicleUnderRepairID != -1) {
    fCanStillRepair = CanCharacterRepairVehicle(pSoldier, pSoldier.bVehicleUnderRepairID);
  }
  // check if we are repairing a robot
  else if (pSoldier.fFixingRobot) {
    fCanStillRepair = CanCharacterRepairRobot(pSoldier);
  } else // repairing items
  {
    fCanStillRepair = DoesCharacterHaveAnyItemsToRepair(pSoldier, FINAL_REPAIR_PASS);
  }

  // if it's no longer damaged, we're finished!
  return !fCanStillRepair;
}

function DoesCharacterHaveAnyItemsToRepair(pSoldier: SOLDIERTYPE, bHighestPass: INT8): boolean {
  let bPocket: INT8;
  let ubItemsInPocket: UINT8;
  let ubObjectInPocketCounter: UINT8;
  let bLoop: INT8;
  let pOtherSoldier: SOLDIERTYPE;
  let pObj: OBJECTTYPE;
  let ubPassType: UINT8;

  // check for jams
  for (bPocket = Enum261.HELMETPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
    ubItemsInPocket = pSoldier.inv[bPocket].ubNumberOfObjects;
    // unjam any jammed weapons
    // run through pocket and repair
    for (ubObjectInPocketCounter = 0; ubObjectInPocketCounter < ubItemsInPocket; ubObjectInPocketCounter++) {
      // jammed gun?
      if ((Item[pSoldier.inv[bPocket].usItem].usItemClass == IC_GUN) && (pSoldier.inv[bPocket].bGunAmmoStatus < 0)) {
        return true;
      }
    }
  }

  // now check for items to repair
  for (bPocket = Enum261.HELMETPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
    pObj = pSoldier.inv[bPocket];

    ubItemsInPocket = pObj.ubNumberOfObjects;

    // run through pocket
    for (ubObjectInPocketCounter = 0; ubObjectInPocketCounter < ubItemsInPocket; ubObjectInPocketCounter++) {
      // if it's repairable and NEEDS repairing
      if (IsItemRepairable(pObj.usItem, pObj.bStatus[ubObjectInPocketCounter])) {
        return true;
      }
    }

    // have to check for attachments...
    for (bLoop = 0; bLoop < MAX_ATTACHMENTS; bLoop++) {
      if (pObj.usAttachItem[bLoop] != NOTHING) {
        // if it's repairable and NEEDS repairing
        if (IsItemRepairable(pObj.usAttachItem[bLoop], pObj.bAttachStatus[bLoop])) {
          return true;
        }
      }
    }
  }

  // if we wanna check for the items belonging to others in the sector
  if (bHighestPass != -1) {
    // now look for items to repair on other mercs
    for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; bLoop < gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++) {
      pOtherSoldier = MercPtrs[bLoop];

      if (CanCharacterRepairAnotherSoldiersStuff(pSoldier, pOtherSoldier)) {
        // okay, seems like a candidate!  Check if he has anything that needs unjamming or repairs

        for (bPocket = Enum261.HANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
          // the object a weapon? and jammed?
          if ((Item[pOtherSoldier.inv[bPocket].usItem].usItemClass == IC_GUN) && (pOtherSoldier.inv[bPocket].bGunAmmoStatus < 0)) {
            return true;
          }
        }

        // repair everyone's hands and armor slots first, then headgear, and pockets last
        for (ubPassType = Enum116.REPAIR_HANDS_AND_ARMOR; ubPassType <= bHighestPass; ubPassType++) {
          bPocket = FindRepairableItemOnOtherSoldier(pOtherSoldier, ubPassType);
          if (bPocket != NO_SLOT) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function BasicCanCharacterRepair(pSoldier: SOLDIERTYPE): boolean {
  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  // make sure character is alive and oklife
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return false;
  }

  // has repair skill?
  if (pSoldier.bMechanical <= 0) {
    // no skill whatsoever
    return false;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // character on the move?
  if (CharacterIsBetweenSectors(pSoldier)) {
    return false;
  }

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    // epcs can't do this
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }

  return true;
}

function CanCharacterRepairButDoesntHaveARepairkit(pSoldier: SOLDIERTYPE): boolean {
  if (BasicCanCharacterRepair(pSoldier) == false) {
    return false;
  }

  // make sure he actually doesn't have a toolkit
  if (FindObj(pSoldier, Enum225.TOOLKIT) != NO_SLOT) {
    return false;
  }

  return true;
}

// can character be assigned as repairman?
// check that character is alive, oklife, has repair skill, and equipment, etc.
function CanCharacterRepair(pSoldier: SOLDIERTYPE): boolean {
  let bPocket: INT8 = 0;
  let fToolKitFound: boolean = false;

  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  if (BasicCanCharacterRepair(pSoldier) == false) {
    return false;
  }

  // make sure he has a toolkit
  if (FindObj(pSoldier, Enum225.TOOLKIT) == NO_SLOT) {
    return false;
  }

  // anything around to fix?
  if (!IsAnythingAroundForSoldierToRepair(pSoldier)) {
    return false;
  }

  // NOTE: This will not detect situations where character lacks the SKILL to repair the stuff that needs repairing...
  // So, in that situation, his assignment will NOT flash, but a message to that effect will be reported every hour.

  // all criteria fit, can repair
  return true;
}

// can character be set to patient?
function CanCharacterPatient(pSoldier: SOLDIERTYPE): boolean {
  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  // Robot must be REPAIRED to be "healed", not doctored
  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier)) {
    return false;
  }

  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    return false;
  }

  // is character alive and not in perfect health?
  if ((pSoldier.bLife <= 0) || (pSoldier.bLife == pSoldier.bLifeMax)) {
    // dead or in perfect health
    return false;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // character on the move?
  if (CharacterIsBetweenSectors(pSoldier)) {
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }

  // alive and can be healed
  return true;
}

function BasicCanCharacterTrainMilitia(pSoldier: SOLDIERTYPE): boolean {
  // is the character capable of training a town?
  // they must be alive/conscious and in the sector with the town
  let fSamSitePresent: boolean = false;

  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  // make sure character is alive and conscious
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return false;
  }

  // underground training is not allowed (code doesn't support and it's a reasonable enough limitation)
  if (pSoldier.bSectorZ != 0) {
    return false;
  }

  // is there a town in the character's current sector?
  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(pSoldier.sSectorX, pSoldier.sSectorY)].bNameId == Enum135.BLANK_SECTOR) {
    fSamSitePresent = IsThisSectorASAMSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);

    // check if sam site
    if (fSamSitePresent == false) {
      // nope
      return false;
    }
  }

  if (NumEnemiesInAnySector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ)) {
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // character on the move?
  if (CharacterIsBetweenSectors(pSoldier)) {
    return false;
  }

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    // epcs can't do this
    return false;
  }

  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier)) {
    return false;
  }

  // has leadership skill?
  if (pSoldier.bLeadership <= 0) {
    // no skill whatsoever
    return false;
  }

  // can train militia
  return true;
}

export function CanCharacterTrainMilitia(pSoldier: SOLDIERTYPE): boolean {
  if (BasicCanCharacterTrainMilitia(pSoldier) && MilitiaTrainingAllowedInSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) && DoesSectorMercIsInHaveSufficientLoyaltyToTrainMilitia(pSoldier) && (IsMilitiaTrainableFromSoldiersSectorMaxed(pSoldier) == false) && (CountMilitiaTrainersInSoldiersSector(pSoldier) < MAX_MILITIA_TRAINERS_PER_SECTOR)) {
    return true;
  } else {
    return false;
  }
}

function DoesTownHaveRatingToTrainMilitia(bTownId: INT8): boolean {
  // min loyalty rating?
  if ((gTownLoyalty[bTownId].ubRating < MIN_RATING_TO_TRAIN_TOWN)) {
    // nope
    return false;
  }

  return true;
}

export function DoesSectorMercIsInHaveSufficientLoyaltyToTrainMilitia(pSoldier: SOLDIERTYPE): boolean {
  let bTownId: INT8 = 0;
  let fSamSitePresent: boolean = false;

  // underground training is not allowed (code doesn't support and it's a reasonable enough limitation)
  if (pSoldier.bSectorZ != 0) {
    return false;
  }

  bTownId = GetTownIdForSector(pSoldier.sSectorX, pSoldier.sSectorY);

  // is there a town really here
  if (bTownId == Enum135.BLANK_SECTOR) {
    fSamSitePresent = IsThisSectorASAMSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);

    // if there is a sam site here
    if (fSamSitePresent) {
      return true;
    }

    return false;
  }

  // does this town have sufficient loyalty to train militia
  if (DoesTownHaveRatingToTrainMilitia(bTownId) == false) {
    return false;
  }

  return true;
}

function CountMilitiaTrainersInSoldiersSector(pSoldier: SOLDIERTYPE): INT8 {
  let bLoop: INT8;
  let pOtherSoldier: SOLDIERTYPE;
  let bCount: INT8 = 0;

  for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++) {
    pOtherSoldier = MercPtrs[bLoop];
    if (pSoldier != pOtherSoldier && pOtherSoldier.bActive && pOtherSoldier.bLife >= OKLIFE && pOtherSoldier.sSectorX == pSoldier.sSectorX && pOtherSoldier.sSectorY == pSoldier.sSectorY && pSoldier.bSectorZ == pOtherSoldier.bSectorZ) {
      if (pOtherSoldier.bAssignment == Enum117.TRAIN_TOWN) {
        bCount++;
      }
    }
  }
  return bCount;
}

export function IsMilitiaTrainableFromSoldiersSectorMaxed(pSoldier: SOLDIERTYPE): boolean {
  let bTownId: INT8 = 0;
  let fSamSitePresent: boolean = false;

  if (pSoldier.bSectorZ != 0) {
    return true;
  }

  bTownId = GetTownIdForSector(pSoldier.sSectorX, pSoldier.sSectorY);

  // is there a town really here
  if (bTownId == Enum135.BLANK_SECTOR) {
    fSamSitePresent = IsThisSectorASAMSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);

    // if there is a sam site here
    if (fSamSitePresent) {
      if (IsSAMSiteFullOfMilitia(pSoldier.sSectorX, pSoldier.sSectorY)) {
        return true;
      }
      return false;
    }

    return false;
  }

  // this considers *ALL* safe sectors of the town, not just the one soldier is in
  if (IsTownFullMilitia(bTownId)) {
    // town is full of militia
    return true;
  }

  return false;
}

function CanCharacterTrainStat(pSoldier: SOLDIERTYPE, bStat: INT8, fTrainSelf: boolean, fTrainTeammate: boolean): boolean {
// is the character capable of training this stat? either self or as trainer

  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  // alive and conscious
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return false;
  }

  // underground training is not allowed (code doesn't support and it's a reasonable enough limitation)
  if (pSoldier.bSectorZ != 0) {
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    // epcs can't do this
    return false;
  }

  // check stat values, 0 means no chance in hell
  switch (bStat) {
    case (Enum118.STRENGTH):
      // strength
      if ((pSoldier.bStrength == 0) || ((pSoldier.bStrength < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bStrength >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }
      break;
    case (Enum118.DEXTERITY):
      // dexterity
      if ((pSoldier.bDexterity == 0) || ((pSoldier.bDexterity < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bDexterity >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }
      break;
    case (Enum118.AGILITY):
      // agility
      if ((pSoldier.bAgility == 0) || ((pSoldier.bAgility < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bAgility >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }

      break;
    case (Enum118.HEALTH):
      // wisdom
      if ((pSoldier.bLifeMax == 0) || ((pSoldier.bLifeMax < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bLifeMax >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }

      break;
    case (Enum118.MARKSMANSHIP):
      // marksmanship
      if ((pSoldier.bMarksmanship == 0) || ((pSoldier.bMarksmanship < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bMarksmanship >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }

      break;
    case (Enum118.MEDICAL):
      // medical
      if ((pSoldier.bMedical == 0) || ((pSoldier.bMedical < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bMedical >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }

      break;
    case (Enum118.MECHANICAL):
      // mechanical
      if ((pSoldier.bMechanical == 0) || ((pSoldier.bMechanical < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bMechanical >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }
      break;
    case (Enum118.LEADERSHIP):
      // leadership
      if ((pSoldier.bLeadership == 0) || ((pSoldier.bLeadership < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bLeadership >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }
      break;
    case (Enum118.EXPLOSIVE_ASSIGN):
      // explosives
      if ((pSoldier.bExplosive == 0) || ((pSoldier.bExplosive < MIN_RATING_TO_TEACH) && (fTrainTeammate))) {
        return false;
      } else if ((pSoldier.bExplosive >= TRAINING_RATING_CAP) && (fTrainSelf)) {
        return false;
      }
      break;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // character on the move?
  if (CharacterIsBetweenSectors(pSoldier)) {
    return false;
  }

  // stat is ok and character alive and conscious
  return true;
}

function CanCharacterOnDuty(pSoldier: SOLDIERTYPE): boolean {
  // can character commit themselves to on duty?

  // only need to be alive and well to do so right now
  // alive and conscious
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return false;
  }

  if (!BasicCanCharacterAssignment(pSoldier, false)) {
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }
  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // ARM: New rule: can't change squads or exit vehicles between sectors!
  if (pSoldier.fBetweenSectors) {
    return false;
  }

  /*
          if( pSoldier -> fBetweenSectors )
          {
                  if( pSoldier -> bAssignment == VEHICLE )
                  {
                          if( GetNumberInVehicle( pSoldier -> iVehicleId ) == 1 )
                          {
                                  // can't change, go away
                                  return( FALSE );
                          }
                  }
          }
  */

  return true;
}

function CanCharacterPractise(pSoldier: SOLDIERTYPE): boolean {
// can character practise right now?

  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  // only need to be alive and well to do so right now
  // alive and conscious
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return false;
  }

  if (pSoldier.bSectorZ != 0) {
    return false;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // character on the move?
  if (CharacterIsBetweenSectors(pSoldier)) {
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    // epcs can't do this
    return false;
  }

  // can practise
  return true;
}

function CanCharacterTrainTeammates(pSoldier: SOLDIERTYPE): boolean {
  let cnt: INT32 = 0;
  let pTeamSoldier: SOLDIERTYPE | null = null;

  // can character train at all
  if (CanCharacterPractise(pSoldier) == false) {
    // nope
    return false;
  }

  // if alone in sector, can't enter the attributes submenu at all
  if (PlayerMercsInSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) == 0) {
    return false;
  }

  // ARM: we allow this even if there are no students assigned yet.  Flashing is warning enough.
  return true;
}

function CanCharacterBeTrainedByOther(pSoldier: SOLDIERTYPE): boolean {
  let iCounter: INT32 = 0;

  // can character train at all
  if (CanCharacterPractise(pSoldier) == false) {
    return false;
  }

  // if alone in sector, can't enter the attributes submenu at all
  if (PlayerMercsInSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) == 0) {
    return false;
  }

  // ARM: we now allow this even if there are no trainers assigned yet.  Flashing is warning enough.
  return true;
}

// can character sleep right now?
function CanCharacterSleep(pSoldier: SOLDIERTYPE, fExplainWhyNot: boolean): boolean {
  let sString: string /* CHAR16[128] */;

  // dead or dying?
  if (pSoldier.bLife < OKLIFE) {
    return false;
  }

  // vehicle or robot?
  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier)) {
    return false;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // POW?
  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    return false;
  }

  // traveling?
  if (pSoldier.fBetweenSectors) {
    // if walking
    if (pSoldier.bAssignment != Enum117.VEHICLE) {
      // can't sleep while walking or driving a vehicle
      if (fExplainWhyNot) {
        // on the move, can't sleep
        sString = swprintf(zMarksMapScreenText[5], pSoldier.name);
        DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
      }

      return false;
    } else // in a vehicle
    {
      // if this guy has to drive ('cause nobody else can)
      if (SoldierMustDriveVehicle(pSoldier, pSoldier.iVehicleId, false)) {
        // can't sleep while walking or driving a vehicle
        if (fExplainWhyNot) {
          // is driving, can't sleep
          sString = swprintf(zMarksMapScreenText[7], pSoldier.name);
          DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
        }

        return false;
      }
    }
  } else // in a sector
  {
    // if not above it all...
    if (!SoldierAboardAirborneHeli(pSoldier)) {
      // if he's in the loaded sector, and it's hostile or in combat
      if (pSoldier.bInSector && ((gTacticalStatus.uiFlags & INCOMBAT) || gTacticalStatus.fEnemyInSector)) {
        if (fExplainWhyNot) {
          DoScreenIndependantMessageBox(Message[Enum334.STR_SECTOR_NOT_CLEARED], MSG_BOX_FLAG_OK, null);
        }

        return false;
      }

      // on surface, and enemies are in the sector
      if ((pSoldier.bSectorZ == 0) && (NumEnemiesInAnySector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) > 0)) {
        if (fExplainWhyNot) {
          DoScreenIndependantMessageBox(Message[Enum334.STR_SECTOR_NOT_CLEARED], MSG_BOX_FLAG_OK, null);
        }

        return false;
      }
    }
  }

  // not tired?
  if (pSoldier.bBreathMax >= BREATHMAX_FULLY_RESTED) {
    if (fExplainWhyNot) {
      sString = swprintf(zMarksMapScreenText[4], pSoldier.name);
      DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
    }

    return false;
  }

  // can sleep
  return true;
}

function CanCharacterBeAwakened(pSoldier: SOLDIERTYPE, fExplainWhyNot: boolean): boolean {
  let sString: string /* CHAR16[128] */;

  // if dead tired
  if ((pSoldier.bBreathMax <= BREATHMAX_ABSOLUTE_MINIMUM) && !pSoldier.fMercCollapsedFlag) {
    // should be collapsed, then!
    pSoldier.fMercCollapsedFlag = true;
  }

  // merc collapsed due to being dead tired, you can't wake him up until he recovers substantially
  if (pSoldier.fMercCollapsedFlag == true) {
    if (fExplainWhyNot) {
      sString = swprintf(zMarksMapScreenText[6], pSoldier.name);
      DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
    }

    return false;
  }

  // can be awakened
  return true;
}

function CanCharacterVehicle(pSoldier: SOLDIERTYPE): boolean {
// can character enter/leave vehicle?

  if (!BasicCanCharacterAssignment(pSoldier, true)) {
    return false;
  }

  // only need to be alive and well to do so right now
  // alive and conscious
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return false;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return false;
  }

  // character on the move?
  if (CharacterIsBetweenSectors(pSoldier)) {
    return false;
  }

  // underground?
  if (pSoldier.bSectorZ != 0) {
    return false;
  }

  // check in helicopter in hostile sector
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    if ((iHelicopterVehicleId != -1) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      // enemies in sector
      if (NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY) > 0) {
        return false;
      }
    }
  }

  // any accessible vehicles in soldier's sector (excludes those between sectors, etc.)
  if (AnyAccessibleVehiclesInSoldiersSector(pSoldier) == false) {
    return false;
  }

  // have to be in mapscreen (strictly for visual reasons - we don't want them just vanishing if in tactical)
  if (fInMapMode == false) {
    return false;
  }

  // if we're in BATTLE in the current sector, disallow
  if (gTacticalStatus.fEnemyInSector) {
    if ((pSoldier.sSectorX == gWorldSectorX) && (pSoldier.sSectorY == gWorldSectorY) && (pSoldier.bSectorZ == gbWorldSectorZ)) {
      return false;
    }
  }

  return true;
}

function CanCharacterSquad(pSoldier: SOLDIERTYPE, bSquadValue: INT8): INT8 {
  // can character join this squad?
  let sX: INT16;
  let sY: INT16;
  let sZ: INT16;

  Assert(bSquadValue < Enum117.ON_DUTY);

  if (pSoldier.bAssignment == bSquadValue) {
    return CHARACTER_CANT_JOIN_SQUAD_ALREADY_IN_IT;
  }

  // is the character alive and well?
  if (pSoldier.bLife < OKLIFE) {
    // dead or unconscious...
    return CHARACTER_CANT_JOIN_SQUAD;
  }

  // in transit?
  if (IsCharacterInTransit(pSoldier) == true) {
    return CHARACTER_CANT_JOIN_SQUAD;
  }

  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    // not allowed to be put on a squad
    return CHARACTER_CANT_JOIN_SQUAD;
  }

  /* Driver can't abandon vehicle between sectors - OBSOLETE - nobody is allowed to change squads between sectors now!
          if( pSoldier -> fBetweenSectors )
          {
                  if( pSoldier -> bAssignment == VEHICLE )
                  {
                          if( GetNumberInVehicle( pSoldier -> iVehicleId ) == 1 )
                          {
                                  // can't change, go away
                                  return( CHARACTER_CANT_JOIN_SQUAD );
                          }
                  }
          }
  */

  // see if the squad us at the same x,y,z
  ({ sMapX: sX, sMapY: sY, sMapZ: sZ } = SectorSquadIsIn(bSquadValue));

  // check sector x y and z, if not same, cannot join squad
  if ((sX != pSoldier.sSectorX) || (sY != pSoldier.sSectorY) || (sZ != pSoldier.bSectorZ)) {
    // is there anyone on this squad?
    if (NumberOfPeopleInSquad(bSquadValue) > 0) {
      return CHARACTER_CANT_JOIN_SQUAD_TOO_FAR;
    }
  }

  if (IsThisSquadOnTheMove(bSquadValue) == true) {
    // can't join while squad is moving
    return CHARACTER_CANT_JOIN_SQUAD_SQUAD_MOVING;
  }

  if (DoesVehicleExistInSquad(bSquadValue)) {
    // sorry can't change to this squad that way!
    return CHARACTER_CANT_JOIN_SQUAD_VEHICLE;
  }

  if (NumberOfPeopleInSquad(bSquadValue) >= NUMBER_OF_SOLDIERS_PER_SQUAD) {
    return CHARACTER_CANT_JOIN_SQUAD_FULL;
  }

  return CHARACTER_CAN_JOIN_SQUAD;
}

export function IsCharacterInTransit(pSoldier: SOLDIERTYPE): boolean {
  // valid character?
  if (pSoldier == null) {
    return false;
  }

  // check if character is currently in transit
  if (pSoldier.bAssignment == Enum117.IN_TRANSIT) {
    // yep
    return true;
  }

  // no
  return false;
}

export function UpdateAssignments(): void {
  let sX: INT8;
  let sY: INT8;
  let bZ: INT8;

  // init sectors with soldiers list
  InitSectorsWithSoldiersList();

  // build list
  BuildSectorsWithSoldiersList();

  // handle natural healing
  HandleNaturalHealing();

  // handle any patients in the hospital
  CheckForAndHandleHospitalPatients();

  // see if any grunt or trainer just lost student/teacher
  ReportTrainersTraineesWithoutPartners();

  // clear out the update list
  ClearSectorListForCompletedTrainingOfMilitia();

  // rest resting mercs, fatigue active mercs,
  // check for mercs tired enough go to sleep, and wake up well-rested mercs
  HandleRestFatigueAndSleepStatus();

  // run through sectors and handle each type in sector
  for (sX = 0; sX < MAP_WORLD_X; sX++) {
    for (sY = 0; sY < MAP_WORLD_X; sY++) {
      for (bZ = 0; bZ < 4; bZ++) {
        // is there anyone in this sector?
        if (fSectorsWithSoldiers[sX + sY * MAP_WORLD_X][bZ] == true) {
          // handle any doctors
          HandleDoctorsInSector(sX, sY, bZ);

          // handle any repairmen
          HandleRepairmenInSector(sX, sY, bZ);

          // handle any training
          HandleTrainingInSector(sX, sY, bZ);
        }
      }
    }
  }

  // check to see if anyone is done healing?
  UpdatePatientsWhoAreDoneHealing();

  // check if we have anyone who just finished their assignment
  if (gfAddDisplayBoxToWaitingQueue) {
    AddDisplayBoxToWaitingQueue();
    gfAddDisplayBoxToWaitingQueue = false;
  }

  HandleContinueOfTownTraining();

  // check if anyone is on an assignment where they have nothing to do
  ReEvaluateEveryonesNothingToDo();

  // update mapscreen
  fCharacterInfoPanelDirty = true;
  fTeamPanelDirty = true;
  fMapScreenBottomDirty = true;
}

function FindNumberInSectorWithAssignment(sX: INT16, sY: INT16, bAssignment: INT8): UINT8 {
  // run thought list of characters find number with this assignment
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let bNumberOfPeople: INT8 = 0;

  // set psoldier as first in merc ptrs
  pSoldier = MercPtrs[0];

  // go through list of characters, find all who are on this assignment
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if ((pTeamSoldier.sSectorX == sX) && (pTeamSoldier.sSectorY == sY) && (pTeamSoldier.bAssignment == bAssignment)) {
        // increment number of people who are on this assignment
        if (pTeamSoldier.bActive)
          bNumberOfPeople++;
      }
    }
  }

  return bNumberOfPeople;
}

function GetNumberThatCanBeDoctored(pDoctor: SOLDIERTYPE, fThisHour: boolean, fSkipKitCheck: boolean, fSkipSkillCheck: boolean): UINT8 {
  let cnt: number;
  let pSoldier: SOLDIERTYPE = MercPtrs[0];
  let pTeamSoldier: SOLDIERTYPE;
  let ubNumberOfPeople: UINT8 = 0;

  // go through list of characters, find all who are patients/doctors healable by this doctor
  for (cnt = 0, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if (CanSoldierBeHealedByDoctor(pTeamSoldier, pDoctor, false, fThisHour, fSkipKitCheck, fSkipSkillCheck) == true) {
        // increment number of doctorable patients/doctors
        ubNumberOfPeople++;
      }
    }
  }

  return ubNumberOfPeople;
}

export function AnyDoctorWhoCanHealThisPatient(pPatient: SOLDIERTYPE, fThisHour: boolean): SOLDIERTYPE | null {
  let cnt: number;
  let pSoldier: SOLDIERTYPE = MercPtrs[0];
  let pTeamSoldier: SOLDIERTYPE;

  // go through list of characters, find all who are patients/doctors healable by this doctor
  for (cnt = 0, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // doctor?
    if ((pTeamSoldier.bActive) && (pTeamSoldier.bAssignment == Enum117.DOCTOR)) {
      if (CanSoldierBeHealedByDoctor(pPatient, pTeamSoldier, false, fThisHour, false, false) == true) {
        // found one
        return pTeamSoldier;
      }
    }
  }

  // there aren't any doctors, or the ones there can't do the job
  return null;
}

export function CalculateHealingPointsForDoctor(pDoctor: SOLDIERTYPE, pusMaxPts: Pointer<UINT16>, fMakeSureKitIsInHand: boolean): UINT16 {
  let usHealPts: UINT16 = 0;
  let usKitPts: UINT16 = 0;
  let bMedFactor: INT8;

  // make sure he has a medkit in his hand, and preferably make it a medical bag, not a first aid kit
  if (fMakeSureKitIsInHand) {
    if (!MakeSureMedKitIsInHand(pDoctor)) {
      return 0;
    }
  }

  // calculate effective doctoring rate (adjusted for drugs, alcohol, etc.)
  usHealPts = (EffectiveMedical(pDoctor) * ((EffectiveDexterity(pDoctor) + EffectiveWisdom(pDoctor)) / 2) * (100 + (5 * EffectiveExpLevel(pDoctor)))) / DOCTORING_RATE_DIVISOR;

  // calculate normal doctoring rate - what it would be if his stats were "normal" (ignoring drugs, fatigue, equipment condition)
  // and equipment was not a hindrance
  pusMaxPts.value = (pDoctor.bMedical * ((pDoctor.bDexterity + pDoctor.bWisdom) / 2) * (100 + (5 * pDoctor.bExpLevel))) / DOCTORING_RATE_DIVISOR;

  // adjust for fatigue
  usHealPts = ReducePointsForFatigue(pDoctor, usHealPts);

  // count how much medical supplies we have
  usKitPts = 100 * TotalMedicalKitPoints(pDoctor);

  // if we don't have enough medical KIT points, reduce what we can heal
  if (usKitPts < usHealPts) {
    usHealPts = usKitPts;
  }

  // get the type of medkit being used
  bMedFactor = IsMedicalKitItem(pDoctor.inv[Enum261.HANDPOS]);

  if (bMedFactor != 0) {
    // no med kit left?
    // if he's working with only a first aid kit, the doctoring rate is halved!
    // for simplicity, we're ignoring the situation where a nearly empty medical bag in is hand and the rest are just first aid kits
    usHealPts /= bMedFactor;
  } else {
    usHealPts = 0;
  }

  // return healing pts value
  return usHealPts;
}

export function CalculateRepairPointsForRepairman(pSoldier: SOLDIERTYPE, pusMaxPts: Pointer<UINT16>, fMakeSureKitIsInHand: boolean): UINT8 {
  let usRepairPts: UINT16;
  let usKitPts: UINT16;
  let ubKitEffectiveness: UINT8;

  // make sure toolkit in hand?
  if (fMakeSureKitIsInHand) {
    MakeSureToolKitIsInHand(pSoldier);
  }

  // can't repair at all without a toolkit
  if (pSoldier.inv[Enum261.HANDPOS].usItem != Enum225.TOOLKIT) {
    pusMaxPts.value = 0;
    return 0;
  }

  // calculate effective repair rate (adjusted for drugs, alcohol, etc.)
  usRepairPts = (EffectiveMechanical(pSoldier) * EffectiveDexterity(pSoldier) * (100 + (5 * EffectiveExpLevel(pSoldier)))) / (REPAIR_RATE_DIVISOR * ASSIGNMENT_UNITS_PER_DAY);

  // calculate normal repair rate - what it would be if his stats were "normal" (ignoring drugs, fatigue, equipment condition)
  // and equipment was not a hindrance
  pusMaxPts.value = (pSoldier.bMechanical * pSoldier.bDexterity * (100 + (5 * pSoldier.bExpLevel))) / (REPAIR_RATE_DIVISOR * ASSIGNMENT_UNITS_PER_DAY);

  // adjust for fatigue
  usRepairPts = ReducePointsForFatigue(pSoldier, usRepairPts);

  // figure out what shape his "equipment" is in ("coming" in JA3: Viagra - improves the "shape" your "equipment" is in)
  usKitPts = ToolKitPoints(pSoldier);

  // if kit(s) in extremely bad shape
  if (usKitPts < 25) {
    ubKitEffectiveness = 50;
  }
  // if kit(s) in pretty bad shape
  else if (usKitPts < 50) {
    ubKitEffectiveness = 75;
  } else {
    ubKitEffectiveness = 100;
  }

  // adjust for equipment
  usRepairPts = (usRepairPts * ubKitEffectiveness) / 100;

  // return current repair pts
  return usRepairPts;
}

function ToolKitPoints(pSoldier: SOLDIERTYPE): UINT16 {
  let usKitpts: UINT16 = 0;
  let ubPocket: UINT8;

  // add up kit points
  for (ubPocket = Enum261.HANDPOS; ubPocket <= Enum261.SMALLPOCK8POS; ubPocket++) {
    if (pSoldier.inv[ubPocket].usItem == Enum225.TOOLKIT) {
      usKitpts += TotalPoints(pSoldier.inv[ubPocket]);
    }
  }

  return usKitpts;
}

function TotalMedicalKitPoints(pSoldier: SOLDIERTYPE): UINT16 {
  let ubPocket: UINT8;
  let usKitpts: UINT16 = 0;

  // add up kit points of all medkits
  for (ubPocket = Enum261.HANDPOS; ubPocket <= Enum261.SMALLPOCK8POS; ubPocket++) {
    // NOTE: Here, we don't care whether these are MEDICAL BAGS or FIRST AID KITS!
    if (IsMedicalKitItem(pSoldier.inv[ubPocket])) {
      usKitpts += TotalPoints(pSoldier.inv[ubPocket]);
    }
  }

  return usKitpts;
}

function HandleDoctorsInSector(sX: INT16, sY: INT16, bZ: INT8): void {
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;

  // set psoldier as first in merc ptrs
  pSoldier = MercPtrs[0];

  // will handle doctor/patient relationship in sector

  // go through list of characters, find all doctors in sector
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if ((pTeamSoldier.sSectorX == sX) && (pTeamSoldier.sSectorY == sY) && (pTeamSoldier.bSectorZ == bZ)) {
        if ((pTeamSoldier.bAssignment == Enum117.DOCTOR) && (pTeamSoldier.fMercAsleep == false)) {
          MakeSureMedKitIsInHand(pTeamSoldier);
          // character is in sector, check if can doctor, if so...heal people
          if (CanCharacterDoctor(pTeamSoldier) && EnoughTimeOnAssignment(pTeamSoldier)) {
            HealCharacters(pTeamSoldier, sX, sY, bZ);
          }
        }
        /*
        if( ( pTeamSoldier -> bAssignment == DOCTOR ) && ( pTeamSoldier->fMercAsleep == FALSE ) )
        {
                MakeSureMedKitIsInHand( pTeamSoldier );
        }

        // character is in sector, check if can doctor, if so...heal people
        if( CanCharacterDoctor( pTeamSoldier ) && ( pTeamSoldier -> bAssignment == DOCTOR ) && ( pTeamSoldier->fMercAsleep == FALSE ) && EnoughTimeOnAssignment( pTeamSoldier ) )
        {
                HealCharacters( pTeamSoldier, sX, sY, bZ );
        }
        */
      }
    }
  }

  // total healing pts for this sector, now heal people
  return;
}

function UpdatePatientsWhoAreDoneHealing(): void {
  let cnt: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;

  // set as first in list
  pSoldier = MercPtrs[0];

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // active soldier?
    if (pTeamSoldier.bActive) {
      // patient who doesn't need healing
      if ((pTeamSoldier.bAssignment == Enum117.PATIENT) && (pTeamSoldier.bLife == pTeamSoldier.bLifeMax)) {
        AssignmentDone(pTeamSoldier, true, true);
      }
    }
  }
  return;
}

function HealCharacters(pDoctor: SOLDIERTYPE, sX: INT16, sY: INT16, bZ: INT8): void {
  // heal all patients in this sector
  let usAvailableHealingPts: UINT16 = 0;
  let usRemainingHealingPts: UINT16 = 0;
  let usUsedHealingPts: UINT16 = 0;
  let usEvenHealingAmount: UINT16 = 0;
  let usMax: UINT16 = 0;
  let ubTotalNumberOfPatients: UINT8 = 0;
  let pSoldier: SOLDIERTYPE = MercPtrs[0];
  let pTeamSoldier: SOLDIERTYPE;
  let pWorstHurtSoldier: SOLDIERTYPE | null = null;
  let cnt: INT32 = 0;
  let usOldLeftOvers: UINT16 = 0;

  // now find number of healable mercs in sector that are wounded
  ubTotalNumberOfPatients = GetNumberThatCanBeDoctored(pDoctor, HEALABLE_THIS_HOUR, false, false);

  // if there is anybody who can be healed right now
  if (ubTotalNumberOfPatients > 0) {
    // get available healing pts
    usAvailableHealingPts = CalculateHealingPointsForDoctor(pDoctor, addressof(usMax), true);
    usRemainingHealingPts = usAvailableHealingPts;

    // find how many healing points can be evenly distributed to each wounded, healable merc
    usEvenHealingAmount = usRemainingHealingPts / ubTotalNumberOfPatients;

    // heal each of the healable mercs by this equal amount
    for (cnt = 0, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
      if (pTeamSoldier.bActive) {
        if (CanSoldierBeHealedByDoctor(pTeamSoldier, pDoctor, false, HEALABLE_THIS_HOUR, false, false) == true) {
          // can heal and is patient, heal them
          usRemainingHealingPts -= HealPatient(pTeamSoldier, pDoctor, usEvenHealingAmount);
        }
      }
    }

    // if we have any remaining pts
    if (usRemainingHealingPts > 0) {
      // split those up based on need - lowest life patients get them first
      do {
        // find the worst hurt patient
        pWorstHurtSoldier = null;

        for (cnt = 0, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
          if (pTeamSoldier.bActive) {
            if (CanSoldierBeHealedByDoctor(pTeamSoldier, pDoctor, false, HEALABLE_THIS_HOUR, false, false) == true) {
              if (pWorstHurtSoldier == null) {
                pWorstHurtSoldier = pTeamSoldier;
              } else {
                // check to see if this guy is hurt worse than anyone previous?
                if (pTeamSoldier.bLife < pWorstHurtSoldier.bLife) {
                  // he is now the worse hurt guy
                  pWorstHurtSoldier = pTeamSoldier;
                }
              }
            }
          }
        }

        if (pWorstHurtSoldier != null) {
          // heal the worst hurt guy
          usOldLeftOvers = usRemainingHealingPts;
          usRemainingHealingPts -= HealPatient(pWorstHurtSoldier, pDoctor, usRemainingHealingPts);

          // couldn't expend any pts, leave
          if (usRemainingHealingPts == usOldLeftOvers) {
            usRemainingHealingPts = 0;
          }
        }
      } while ((usRemainingHealingPts > 0) && (pWorstHurtSoldier != null));
    }

    usUsedHealingPts = usAvailableHealingPts - usRemainingHealingPts;

    // increment skills based on healing pts used
    StatChange(pDoctor, MEDICALAMT, (usUsedHealingPts / 100), 0);
    StatChange(pDoctor, DEXTAMT, (usUsedHealingPts / 200), 0);
    StatChange(pDoctor, WISDOMAMT, (usUsedHealingPts / 200), 0);
  }

  // if there's nobody else here who can EVER be helped by this doctor (regardless of whether they got healing this hour)
  if (GetNumberThatCanBeDoctored(pDoctor, HEALABLE_EVER, false, false) == 0) {
    // then this doctor has done all that he can do, but let's find out why and tell player the reason

    // try again, but skip the med kit check!
    if (GetNumberThatCanBeDoctored(pDoctor, HEALABLE_EVER, true, false) > 0) {
      // he could doctor somebody, but can't because he doesn't have a med kit!
      AssignmentAborted(pDoctor, Enum113.NO_MORE_MED_KITS);
    }
    // try again, but skip the skill check!
    else if (GetNumberThatCanBeDoctored(pDoctor, HEALABLE_EVER, false, true) > 0) {
      // he could doctor somebody, but can't because he doesn't have enough skill!
      AssignmentAborted(pDoctor, Enum113.INSUF_DOCTOR_SKILL);
    } else {
      // all patients should now be healed - truly DONE!
      AssignmentDone(pDoctor, true, true);
    }
  }
}

/* Assignment distance limits removed.  Sep/11/98.  ARM
BOOLEAN IsSoldierCloseEnoughToADoctor( SOLDIERTYPE *pPatient )
{
        // run through all doctors in sector, if it is loaded
        // if no - one is close enough and there is a doctor assigned in sector, inform player
        BOOLEAN fDoctorInSector = FALSE;
        BOOLEAN fDoctorCloseEnough = FALSE;
        SOLDIERTYPE *pSoldier = NULL;
        INT32 iCounter = 0;
        CHAR16 sString[ 128 ];

        if( ( pPatient->sSectorX != gWorldSectorX ) || ( pPatient->sSectorY != gWorldSectorY ) || ( pPatient->bSectorZ != gbWorldSectorZ ) )
        {
                // not currently loaded
                return( TRUE );
        }

        for( iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++ )
        {
                pSoldier = &Menptr[ iCounter ];

                if( pSoldier->bActive )
                {

                        // are they two of these guys in the same sector?
                        if( ( pSoldier->sSectorX == pPatient->sSectorX ) && ( pSoldier->sSectorY == pPatient->sSectorY ) && ( pSoldier->bSectorZ == pPatient->bSectorZ ) )
                        {

                                // is a doctor
                                if( pSoldier->bAssignment == DOCTOR )
                                {

                                        // the doctor is in the house
                                        fDoctorInSector = TRUE;

                                        // can this patient be healed by the doctor?
                                        if( CanSoldierBeHealedByDoctor( pPatient, pSoldier, TRUE, HEALABLE_EVER, FALSE, FALSE ) == TRUE )
                                        {
                                                // yep
                                                fDoctorCloseEnough = TRUE;
                                        }
                                }
                        }
                }
        }

        // there are doctors here but noone can heal this guy
        if( ( fDoctorInSector ) && ( fDoctorCloseEnough == FALSE ) )
        {
                swprintf( sString, pDoctorWarningString[ 0 ] , pPatient->name );
                DoScreenIndependantMessageBox( sString, MSG_BOX_FLAG_OK, NULL);
                return( FALSE );
        }

        return( TRUE );
}
*/

function CanSoldierBeHealedByDoctor(pSoldier: SOLDIERTYPE, pDoctor: SOLDIERTYPE, fIgnoreAssignment: boolean, fThisHour: boolean, fSkipKitCheck: boolean, fSkipSkillCheck: boolean): boolean {
  let sDistance: INT16 = 0;

  // must be an active guy
  if (pSoldier.bActive == false) {
    return false;
  }

  // must be a patient or a doctor
  if ((pSoldier.bAssignment != Enum117.PATIENT) && (pSoldier.bAssignment != Enum117.DOCTOR) && (fIgnoreAssignment == false)) {
    return false;
  }

  // if dead or unhurt
  if ((pSoldier.bLife == 0) || (pSoldier.bLife == pSoldier.bLifeMax)) {
    return false;
  }

  // if we care about how long it's been, and he hasn't been on a healable assignment long enough
  if (fThisHour && (EnoughTimeOnAssignment(pSoldier) == false) && (fIgnoreAssignment == false)) {
    return false;
  }

  // must be in the same sector
  if ((pSoldier.sSectorX != pDoctor.sSectorX) || (pSoldier.sSectorY != pDoctor.sSectorY) || (pSoldier.bSectorZ != pDoctor.bSectorZ)) {
    return false;
  }

  // can't be between sectors (possible to get here if ignoring assignment)
  if (pSoldier.fBetweenSectors) {
    return false;
  }

  // if doctor's skill is unsufficient to save this guy
  if (!fSkipSkillCheck && (pDoctor.bMedical < GetMinHealingSkillNeeded(pSoldier))) {
    return false;
  }

  if (!fSkipKitCheck && (FindObj(pDoctor, Enum225.MEDICKIT) == NO_SLOT)) {
    // no medical kit to use!
    return false;
  }

  return true;
}

function GetMinHealingSkillNeeded(pPatient: SOLDIERTYPE): UINT8 {
  // get the minimum skill to handle a character under OKLIFE

  if (pPatient.bLife < OKLIFE) {
    // less than ok life, return skill needed
    return BASE_MEDICAL_SKILL_TO_DEAL_WITH_EMERGENCY + (MULTIPLIER_FOR_DIFFERENCE_IN_LIFE_VALUE_FOR_EMERGENCY * (OKLIFE - pPatient.bLife));
  } else {
    // only need some skill
    return 1;
  }
}

function HealPatient(pPatient: SOLDIERTYPE, pDoctor: SOLDIERTYPE, usHundredthsHealed: UINT16): UINT16 {
  // heal patient and return the number of healing pts used
  let usHealingPtsLeft: UINT16;
  let usTotalFullPtsUsed: UINT16 = 0;
  let usTotalHundredthsUsed: UINT16 = 0;
  let bPointsToUse: INT8 = 0;
  let bPointsUsed: INT8 = 0;
  let bPointsHealed: INT8 = 0;
  let bPocket: INT8 = 0;
  let bMedFactor: INT8;
  //	INT8 bOldPatientLife = pPatient -> bLife;

  pPatient.sFractLife += usHundredthsHealed;
  usTotalHundredthsUsed = usHundredthsHealed; // we'll subtract any unused amount later if we become fully healed...

  // convert fractions into full points
  usHealingPtsLeft = pPatient.sFractLife / 100;
  pPatient.sFractLife %= 100;

  // if we haven't accumulated any full points yet
  if (usHealingPtsLeft == 0) {
    return usTotalHundredthsUsed;
  }

  /* ARM - Eliminated.  We now have other methods of properly using doctors to auto-bandage bleeding,
  // using the correct kits points instead of this 1 pt. "special"

          // stop all bleeding of patient..for 1 pt (it's fast).  But still use up normal kit pts to do it
          if (pPatient -> bBleeding > 0)
          {
                  usHealingPtsLeft--;
                  usTotalFullPtsUsed++;

                  // get points needed to heal him to dress bleeding wounds
                  bPointsToUse = pPatient -> bBleeding;

                  // go through doctor's pockets and heal, starting at with his in-hand item
                  // the healing pts are based on what type of medkit is in his hand, so we HAVE to start there first!
                  for (bPocket = HANDPOS; bPocket <= SMALLPOCK8POS; bPocket++)
                  {
                          bMedFactor = IsMedicalKitItem( &( pDoctor -> inv[ bPocket ] ) );
                          if ( bMedFactor > 0 )
                          {
                                  // ok, we have med kit in this pocket, use it

                                  // The medFactor here doesn't affect how much the doctor can heal (that's already factored into lower healing pts)
                                  // but it does effect how fast the medkit is used up!  First aid kits disappear at double their doctoring rate!
                                  bPointsUsed = (INT8) UseKitPoints( &( pDoctor -> inv[ bPocket ] ), (UINT16) (bPointsToUse * bMedFactor), pDoctor );
                                  bPointsHealed = bPointsUsed / bMedFactor;

                                  bPointsToUse -= bPointsHealed;
                                  pPatient -> bBleeding -= bPointsHealed;

                                  // if we're done all we're supposed to, or the guy's no longer bleeding, bail
                                  if ( ( bPointsToUse <= 0 ) || ( pPatient -> bBleeding == 0 ) )
                                  {
                                          break;
                                  }
                          }
                  }
          }
  */

  // if below ok life, heal these first at double point cost
  if (pPatient.bLife < OKLIFE) {
    // get points needed to heal him to OKLIFE
    bPointsToUse = POINT_COST_PER_HEALTH_BELOW_OKLIFE * (OKLIFE - pPatient.bLife);

    // if he needs more than we have, reduce to that
    if (bPointsToUse > usHealingPtsLeft) {
      bPointsToUse = usHealingPtsLeft;
    }

    // go through doctor's pockets and heal, starting at with his in-hand item
    // the healing pts are based on what type of medkit is in his hand, so we HAVE to start there first!
    for (bPocket = Enum261.HANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
      bMedFactor = IsMedicalKitItem(pDoctor.inv[bPocket]);
      if (bMedFactor > 0) {
        // ok, we have med kit in this pocket, use it

        // The medFactor here doesn't affect how much the doctor can heal (that's already factored into lower healing pts)
        // but it does effect how fast the medkit is used up!  First aid kits disappear at double their doctoring rate!
        bPointsUsed = UseKitPoints(pDoctor.inv[bPocket], (bPointsToUse * bMedFactor), pDoctor);
        bPointsHealed = bPointsUsed / bMedFactor;

        bPointsToUse -= bPointsHealed;
        usHealingPtsLeft -= bPointsHealed;
        usTotalFullPtsUsed += bPointsHealed;

        // heal person the amount / POINT_COST_PER_HEALTH_BELOW_OKLIFE
        pPatient.bLife += (bPointsHealed / POINT_COST_PER_HEALTH_BELOW_OKLIFE);

        // if we're done all we're supposed to, or the guy's at OKLIFE, bail
        if ((bPointsToUse <= 0) || (pPatient.bLife >= OKLIFE)) {
          break;
        }
      }
    }
  }

  // critical conditions handled, now apply normal healing

  if (pPatient.bLife < pPatient.bLifeMax) {
    bPointsToUse = (pPatient.bLifeMax - pPatient.bLife);

    // if guy is hurt more than points we have...heal only what we have
    if (bPointsToUse > usHealingPtsLeft) {
      bPointsToUse = usHealingPtsLeft;
    }

    // go through doctor's pockets and heal, starting at with his in-hand item
    // the healing pts are based on what type of medkit is in his hand, so we HAVE to start there first!
    for (bPocket = Enum261.HANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
      bMedFactor = IsMedicalKitItem(pDoctor.inv[bPocket]);
      if (bMedFactor > 0) {
        // ok, we have med kit in this pocket, use it  (use only half if it's worth double)

        // The medFactor here doesn't affect how much the doctor can heal (that's already factored into lower healing pts)
        // but it does effect how fast the medkit is used up!  First aid kits disappear at double their doctoring rate!
        bPointsUsed = UseKitPoints(pDoctor.inv[bPocket], (bPointsToUse * bMedFactor), pDoctor);
        bPointsHealed = bPointsUsed / bMedFactor;

        bPointsToUse -= bPointsHealed;
        usHealingPtsLeft -= bPointsHealed;
        usTotalFullPtsUsed += bPointsHealed;

        pPatient.bLife += bPointsHealed;

        // if we're done all we're supposed to, or the guy's fully healed, bail
        if ((bPointsToUse <= 0) || (pPatient.bLife == pPatient.bLifeMax)) {
          break;
        }
      }
    }
  }

  // if this patient is fully healed
  if (pPatient.bLife == pPatient.bLifeMax) {
    // don't count unused full healing points as being used
    usTotalHundredthsUsed -= (100 * usHealingPtsLeft);

    // wipe out fractions of extra life, and DON'T count them as used
    usTotalHundredthsUsed -= pPatient.sFractLife;
    pPatient.sFractLife = 0;

    /* ARM Removed.  This is duplicating the check in UpdatePatientsWhoAreDoneHealing(), guy would show up twice!
                    // if it isn't the doctor himself)
                    if( ( pPatient != pDoctor )
                    {
                            AssignmentDone( pPatient, TRUE, TRUE );
                    }
    */
  }

  return usTotalHundredthsUsed;
}

function CheckForAndHandleHospitalPatients(): void {
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;

  if (fSectorsWithSoldiers[HOSPITAL_SECTOR_X + HOSPITAL_SECTOR_Y * MAP_WORLD_X][0] == false) {
    // nobody in the hospital sector... leave
    return;
  }

  // set pSoldier as first in merc ptrs
  pSoldier = MercPtrs[0];

  // go through list of characters, find all who are on this assignment
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if (pTeamSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL) {
        if ((pTeamSoldier.sSectorX == HOSPITAL_SECTOR_X) && (pTeamSoldier.sSectorY == HOSPITAL_SECTOR_Y) && (pTeamSoldier.bSectorZ == 0)) {
          // heal this character
          HealHospitalPatient(pTeamSoldier, HOSPITAL_HEALING_RATE);
        }
      }
    }
  }
}

function HealHospitalPatient(pPatient: SOLDIERTYPE, usHealingPtsLeft: UINT16): void {
  let bPointsToUse: INT8;

  if (usHealingPtsLeft <= 0) {
    return;
  }

  /*  Stopping hospital patients' bleeding must be handled immediately, not during a regular hourly check
          // stop all bleeding of patient..for 1 pt.
          if (pPatient -> bBleeding > 0)
          {
                  usHealingPtsLeft--;
                  pPatient -> bBleeding = 0;
          }
  */

  // if below ok life, heal these first at double cost
  if (pPatient.bLife < OKLIFE) {
    // get points needed to heal him to OKLIFE
    bPointsToUse = POINT_COST_PER_HEALTH_BELOW_OKLIFE * (OKLIFE - pPatient.bLife);

    // if he needs more than we have, reduce to that
    if (bPointsToUse > usHealingPtsLeft) {
      bPointsToUse = usHealingPtsLeft;
    }

    usHealingPtsLeft -= bPointsToUse;

    // heal person the amount / POINT_COST_PER_HEALTH_BELOW_OKLIFE
    pPatient.bLife += (bPointsToUse / POINT_COST_PER_HEALTH_BELOW_OKLIFE);
  }

  // critical condition handled, now solve normal healing

  if (pPatient.bLife < pPatient.bLifeMax) {
    bPointsToUse = (pPatient.bLifeMax - pPatient.bLife);

    // if guy is hurt more than points we have...heal only what we have
    if (bPointsToUse > usHealingPtsLeft) {
      bPointsToUse = usHealingPtsLeft;
    }

    usHealingPtsLeft -= bPointsToUse;

    // heal person the amount
    pPatient.bLife += bPointsToUse;
  }

  // if this patient is fully healed
  if (pPatient.bLife == pPatient.bLifeMax) {
    AssignmentDone(pPatient, true, true);
  }
}

function HandleRepairmenInSector(sX: INT16, sY: INT16, bZ: INT8): void {
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;

  // set psoldier as first in merc ptrs
  pSoldier = MercPtrs[0];

  // will handle doctor/patient relationship in sector

  // go through list of characters, find all doctors in sector
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if ((pTeamSoldier.sSectorX == sX) && (pTeamSoldier.sSectorY == sY) && (pTeamSoldier.bSectorZ == bZ)) {
        if ((pTeamSoldier.bAssignment == Enum117.REPAIR) && (pTeamSoldier.fMercAsleep == false)) {
          MakeSureToolKitIsInHand(pTeamSoldier);
          // character is in sector, check if can repair
          if (CanCharacterRepair(pTeamSoldier) && (EnoughTimeOnAssignment(pTeamSoldier))) {
            HandleRepairBySoldier(pTeamSoldier);
          }
        }
      }
    }
  }

  return;
}

/* No point in allowing SAM site repair any more.  Jan/13/99.  ARM
INT8 HandleRepairOfSAMSite( SOLDIERTYPE *pSoldier, INT8 bPointsAvailable, BOOLEAN * pfNothingLeftToRepair )
{
        INT8 bPtsUsed = 0;
        INT16 sStrategicSector = 0;

        if( IsThisSectorASAMSector( pSoldier -> sSectorX, pSoldier -> sSectorY, pSoldier -> bSectorZ ) == FALSE )
        {
                return( bPtsUsed );
        }
        else if( ( pSoldier -> sSectorX == gWorldSectorX ) && ( pSoldier -> bSectorZ == gbWorldSectorZ )&&( pSoldier -> sSectorY == gWorldSectorY ) )
        {
                if( CanSoldierRepairSAM( pSoldier, bPointsAvailable ) == FALSE )
                {
                        return( bPtsUsed );
                }
        }

        // repair the SAM

        sStrategicSector = CALCULATE_STRATEGIC_INDEX( pSoldier->sSectorX, pSoldier->sSectorY );

        // do we have more than enough?
        if( 100 - StrategicMap[ sStrategicSector ].bSAMCondition >= bPointsAvailable / SAM_SITE_REPAIR_DIVISOR )
        {
                // no, use up all we have
                StrategicMap[ sStrategicSector ].bSAMCondition += bPointsAvailable / SAM_SITE_REPAIR_DIVISOR;
                bPtsUsed = bPointsAvailable - ( bPointsAvailable % SAM_SITE_REPAIR_DIVISOR );

                // SAM site may have been put back into working order...
                UpdateAirspaceControl( );
        }
        else
        {
                // yep
                bPtsUsed = SAM_SITE_REPAIR_DIVISOR * ( 100 - StrategicMap[ sStrategicSector ].bSAMCondition );
                StrategicMap[ sStrategicSector ].bSAMCondition = 100;

//ARM: NOTE THAT IF THIS CODE IS EVER RE-ACTIVATED, THE SAM GRAPHICS SHOULD CHANGE NOT WHEN THE SAM SITE RETURNS TO
// FULL STRENGTH (condition 100), but as soon as it reaches MIN_CONDITION_TO_FIX_SAM!!!

                // Bring Hit points back up to full, adjust graphic to full graphic.....
                UpdateSAMDoneRepair( pSoldier -> sSectorX, pSoldier -> sSectorY, pSoldier -> bSectorZ );
        }

        if ( StrategicMap[ sStrategicSector ].bSAMCondition == 100 )
        {
                *pfNothingLeftToRepair = TRUE;
        }
        else
        {
                *pfNothingLeftToRepair = FALSE;
        }
        return( bPtsUsed );
}
*/

function FindRepairableItemOnOtherSoldier(pSoldier: SOLDIERTYPE, ubPassType: UINT8): INT8 {
  let bLoop: INT8;
  let bLoop2: INT8;
  let pPassList: REPAIR_PASS_SLOTS_TYPE;
  let bSlotToCheck: INT8;
  let pObj: OBJECTTYPE;

  Assert(ubPassType < Enum116.NUM_REPAIR_PASS_TYPES);

  pPassList = gRepairPassSlotList[ubPassType];

  for (bLoop = 0; bLoop < pPassList.ubChoices; bLoop++) {
    bSlotToCheck = pPassList.bSlot[bLoop];
    Assert(bSlotToCheck != -1);

    pObj = pSoldier.inv[bSlotToCheck];
    for (bLoop2 = 0; bLoop2 < pSoldier.inv[bSlotToCheck].ubNumberOfObjects; bLoop2++) {
      if (IsItemRepairable(pObj.usItem, pObj.bStatus[bLoop2])) {
        return bSlotToCheck;
      }
    }

    // have to check for attachments...
    for (bLoop2 = 0; bLoop2 < MAX_ATTACHMENTS; bLoop2++) {
      if (pObj.usAttachItem[bLoop2] != NOTHING) {
        if (IsItemRepairable(pObj.usAttachItem[bLoop2], pObj.bAttachStatus[bLoop2])) {
          return bSlotToCheck;
        }
      }
    }
  }

  return NO_SLOT;
}

function DoActualRepair(pSoldier: SOLDIERTYPE, usItem: UINT16, pbStatus: Pointer<INT8>, pubRepairPtsLeft: Pointer<UINT8>): void {
  let sRepairCostAdj: INT16;
  let usDamagePts: UINT16;
  let usPtsFixed: UINT16;

  // get item's repair ease, for each + point is 10% easier, each - point is 10% harder to repair
  sRepairCostAdj = 100 - (10 * Item[usItem].bRepairEase);

  // make sure it ain't somehow gone too low!
  if (sRepairCostAdj < 10) {
    sRepairCostAdj = 10;
  }

  // repairs on electronic items take twice as long if the guy doesn't have the skill
  if ((Item[usItem].fFlags & ITEM_ELECTRONIC) && (!(HAS_SKILL_TRAIT(pSoldier, Enum269.ELECTRONICS)))) {
    sRepairCostAdj *= 2;
  }

  // how many points of damage is the item down by?
  usDamagePts = 100 - pbStatus.value;

  // adjust that by the repair cost adjustment percentage
  usDamagePts = (usDamagePts * sRepairCostAdj) / 100;

  // do we have enough pts to fully repair the item?
  if (pubRepairPtsLeft.value >= usDamagePts) {
    // fix it to 100%
    pbStatus.value = 100;
    pubRepairPtsLeft.value -= usDamagePts;
  } else // not enough, partial fix only, if any at all
  {
    // fix what we can - add pts left adjusted by the repair cost
    usPtsFixed = (pubRepairPtsLeft.value * 100) / sRepairCostAdj;

    // if we have enough to actually fix anything
    // NOTE: a really crappy repairman with only 1 pt/hr CAN'T repair electronics or difficult items!
    if (usPtsFixed > 0) {
      pbStatus.value += usPtsFixed;

      // make sure we don't somehow end up over 100
      if (pbStatus.value > 100) {
        pbStatus.value = 100;
      }
    }

    pubRepairPtsLeft.value = 0;
  }
}

function RepairObject(pSoldier: SOLDIERTYPE, pOwner: SOLDIERTYPE, pObj: OBJECTTYPE, pubRepairPtsLeft: Pointer<UINT8>): boolean {
  let ubLoop: UINT8;
  let ubItemsInPocket: UINT8;
  let fSomethingWasRepaired: boolean = false;

  ubItemsInPocket = pObj.ubNumberOfObjects;

  for (ubLoop = 0; ubLoop < ubItemsInPocket; ubLoop++) {
    // if it's repairable and NEEDS repairing
    if (IsItemRepairable(pObj.usItem, pObj.bStatus[ubLoop])) {
      // repairable, try to repair it

      // void DoActualRepair( SOLDIERTYPE * pSoldier, UINT16 usItem, INT8 * pbStatus, UINT8 * pubRepairPtsLeft )
      DoActualRepair(pSoldier, pObj.usItem, addressof(pObj.bStatus[ubLoop]), pubRepairPtsLeft);

      fSomethingWasRepaired = true;

      if (pObj.bStatus[ubLoop] == 100) {
        // report it as fixed
        if (pSoldier == pOwner) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_REPAIRED], pSoldier.name, ItemNames[pObj.usItem]);
        } else {
          // NOTE: may need to be changed for localized versions
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[35], pSoldier.name, pOwner.name, ItemNames[pObj.usItem]);
        }
      }

      if (pubRepairPtsLeft.value == 0) {
        // we're out of points!
        break;
      }
    }
  }

  // now check for attachments
  for (ubLoop = 0; ubLoop < MAX_ATTACHMENTS; ubLoop++) {
    if (pObj.usAttachItem[ubLoop] != NOTHING) {
      if (IsItemRepairable(pObj.usAttachItem[ubLoop], pObj.bAttachStatus[ubLoop])) {
        // repairable, try to repair it

        DoActualRepair(pSoldier, pObj.usAttachItem[ubLoop], addressof(pObj.bAttachStatus[ubLoop]), pubRepairPtsLeft);

        fSomethingWasRepaired = true;

        if (pObj.bAttachStatus[ubLoop] == 100) {
          // report it as fixed
          if (pSoldier == pOwner) {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_REPAIRED], pSoldier.name, ItemNames[pObj.usAttachItem[ubLoop]]);
          } else {
            // NOTE: may need to be changed for localized versions
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[35], pSoldier.name, pOwner.name, ItemNames[pObj.usAttachItem[ubLoop]]);
          }
        }

        if (pubRepairPtsLeft.value == 0) {
          // we're out of points!
          break;
        }
      }
    }
  }

  return fSomethingWasRepaired;
}

function HandleRepairBySoldier(pSoldier: SOLDIERTYPE): void {
  let usMax: UINT16 = 0;
  let ubRepairPtsLeft: UINT8 = 0;
  let ubItemsInPocket: UINT8 = 0;
  let ubObjectInPocketCounter: UINT8 = 0;
  let ubInitialRepairPts: UINT8 = 0;
  let ubRepairPtsUsed: UINT8 = 0;
  let bPocket: INT8 = 0;
  let fNothingLeftToRepair: boolean = false;
  let bLoop: INT8;
  let bLoopStart: INT8;
  let bLoopEnd: INT8;
  let fAnyOfSoldiersOwnItemsWereFixed: boolean = false;
  let pObj: OBJECTTYPE;

  // grab max number of repair pts open to this soldier
  ubRepairPtsLeft = CalculateRepairPointsForRepairman(pSoldier, addressof(usMax), true);

  // no points
  if (ubRepairPtsLeft == 0) {
    AssignmentDone(pSoldier, true, true);
    return;
  }

  // remember what we've started off with
  ubInitialRepairPts = ubRepairPtsLeft;

  // check if we are repairing a vehicle
  if (pSoldier.bVehicleUnderRepairID != -1) {
    if (CanCharacterRepairVehicle(pSoldier, pSoldier.bVehicleUnderRepairID)) {
      // attempt to fix vehicle
      ubRepairPtsLeft -= RepairVehicle(pSoldier.bVehicleUnderRepairID, ubRepairPtsLeft, addressof(fNothingLeftToRepair));
    }
  }
  // check if we are repairing a robot
  else if (pSoldier.fFixingRobot) {
    if (CanCharacterRepairRobot(pSoldier)) {
      // repairing the robot is very slow & difficult
      ubRepairPtsLeft /= 2;
      ubInitialRepairPts /= 2;

      if (!(HAS_SKILL_TRAIT(pSoldier, Enum269.ELECTRONICS))) {
        ubRepairPtsLeft /= 2;
        ubInitialRepairPts /= 2;
      }

      // robot
      ubRepairPtsLeft -= HandleRepairOfRobotBySoldier(pSoldier, ubRepairPtsLeft, addressof(fNothingLeftToRepair));
    }
  } else {
    fAnyOfSoldiersOwnItemsWereFixed = UnjamGunsOnSoldier(pSoldier, pSoldier, addressof(ubRepairPtsLeft));

    // repair items on self
    for (bLoop = 0; bLoop < 2; bLoop++) {
      if (bLoop == 0) {
        bLoopStart = Enum261.SECONDHANDPOS;
        bLoopEnd = Enum261.SMALLPOCK8POS;
      } else {
        bLoopStart = Enum261.HELMETPOS;
        bLoopEnd = Enum261.HEAD2POS;
      }

      // now repair objects running from left hand to small pocket
      for (bPocket = bLoopStart; bPocket <= bLoopEnd; bPocket++) {
        pObj = pSoldier.inv[bPocket];

        if (RepairObject(pSoldier, pSoldier, pObj, ubRepairPtsLeft)) {
          fAnyOfSoldiersOwnItemsWereFixed = true;

          // quit looking if we're already out
          if (ubRepairPtsLeft == 0)
            break;
        }
      }
    }

    // if he fixed something of his, and now has no more of his own items to fix
    if (fAnyOfSoldiersOwnItemsWereFixed && !DoesCharacterHaveAnyItemsToRepair(pSoldier, -1)) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, sRepairsDoneString[0], pSoldier.name);

      // let player react
      StopTimeCompression();
    }

    // repair items on others
    RepairItemsOnOthers(pSoldier, ubRepairPtsLeft);
  }

  // what are the total amount of pts used by character?
  ubRepairPtsUsed = ubInitialRepairPts - ubRepairPtsLeft;
  if (ubRepairPtsUsed > 0) {
    // improve stats
    StatChange(pSoldier, MECHANAMT, (ubRepairPtsUsed / 2), 0);
    StatChange(pSoldier, DEXTAMT, (ubRepairPtsUsed / 2), 0);

    // check if kit damaged/depleted
    if ((Random(100)) < (ubRepairPtsUsed * 5)) // CJC: added a x5 as this wasn't going down anywhere fast enough
    {
      // kit item damaged/depleted, burn up points of toolkit..which is in right hand
      UseKitPoints(pSoldier.inv[Enum261.HANDPOS], 1, pSoldier);
    }
  }

  // if he really done
  if (HasCharacterFinishedRepairing(pSoldier)) {
    // yup, that's all folks
    AssignmentDone(pSoldier, true, true);
  } else // still has stuff to repair
  {
    // if nothing got repaired, there's a problem
    if (ubRepairPtsUsed == 0) {
      // see if not having a toolkit is the problem
      if (FindObj(pSoldier, Enum225.TOOLKIT) == NO_SLOT) {
        // he could (maybe) repair something, but can't because he doesn't have a tool kit!
        AssignmentAborted(pSoldier, Enum113.NO_MORE_TOOL_KITS);
      } else {
        // he can't repair anything because he doesn't have enough skill!
        AssignmentAborted(pSoldier, Enum113.INSUF_REPAIR_SKILL);
      }
    }
  }

  return;
}

function IsItemRepairable(usItem: UINT16, bStatus: INT8): boolean {
  // check to see if item can/needs to be repaired
  if ((bStatus < 100) && (Item[usItem].fFlags & ITEM_REPAIRABLE)) {
    // yep
    return true;
  }

  // nope
  return false;
}

function HandleRestAndFatigueInSector(sMapX: INT16, sMapY: INT16, bMapZ: INT8): void {
  // this will handle all sleeping characters in this sector
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;

  pSoldier = MercPtrs[0];

  // go through list of characters, find all sleepers in sector
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if ((pTeamSoldier.bActive) && (pSoldier.bAssignment != Enum117.ASSIGNMENT_POW)) {
      if ((pTeamSoldier.sSectorX == sMapX) && (pTeamSoldier.sSectorY == sMapY) && (pTeamSoldier.bSectorZ == bMapZ)) {
      }
    }
  }
}

/*
INT8 GetRegainDueToSleepNeeded( SOLDIERTYPE *pSoldier, INT32 iRateOfReGain )
{
        // look at persons regain rate,
        // if they infact loses sleep, make sure it doesn't go below the current rate
        INT8 bRate = 0;
        UINT8 ubNeedForSleep = 0;

        // get profile id and then grab sleep need value
        ubNeedForSleep = gMercProfiles[ pSoldier -> ubProfile ].ubNeedForSleep;

        bRate = ( AVG_NUMBER_OF_HOURS_OF_SLEEP_NEEDED - ( INT8 )ubNeedForSleep );

        if( bRate >= iRateOfReGain )
        {
                bRate = ( - iRateOfReGain ) + 1;
        }
        return( bRate );
}
*/

function RestCharacter(pSoldier: SOLDIERTYPE): void {
  // handle the sleep of this character, update bBreathMax based on sleep they have
  let bMaxBreathRegain: INT8 = 0;

  bMaxBreathRegain = 50 / CalcSoldierNeedForSleep(pSoldier);

  // if breath max is below the "really tired" threshold
  if (pSoldier.bBreathMax < BREATHMAX_PRETTY_TIRED) {
    // real tired, rest rate is 50% higher (this is to prevent absurdly long sleep times for totally exhausted mercs)
    bMaxBreathRegain = (bMaxBreathRegain * 3 / 2);
  }

  pSoldier.bBreathMax += bMaxBreathRegain;

  if (pSoldier.bBreathMax > 100) {
    pSoldier.bBreathMax = 100;
  } else if (pSoldier.bBreathMax < BREATHMAX_ABSOLUTE_MINIMUM) {
    pSoldier.bBreathMax = BREATHMAX_ABSOLUTE_MINIMUM;
  }

  pSoldier.bBreath = pSoldier.bBreathMax;

  if (pSoldier.bBreathMax >= BREATHMAX_CANCEL_TIRED) {
    pSoldier.fComplainedThatTired = false;
  }

  return;
}

function FatigueCharacter(pSoldier: SOLDIERTYPE): void {
  // fatigue character
  let iPercentEncumbrance: INT32;
  let iBreathLoss: INT32;
  let bMaxBreathLoss: INT8 = 0;
  let bDivisor: INT8 = 1;

  // vehicle or robot?
  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier)) {
    return;
  }

  // check if in transit, do not wear out
  if (IsCharacterInTransit(pSoldier) == true) {
    return;
  }

  // POW?
  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    return;
  }

  bDivisor = 24 - CalcSoldierNeedForSleep(pSoldier);
  bMaxBreathLoss = 50 / bDivisor;

  if (bMaxBreathLoss < 2) {
    bMaxBreathLoss = 2;
  }

  // KM: Added encumbrance calculation to soldiers moving on foot.  Anything above 100% will increase
  //    rate of fatigue.  200% encumbrance will cause soldiers to tire twice as quickly.
  if (pSoldier.fBetweenSectors && pSoldier.bAssignment != Enum117.VEHICLE) {
    // Soldier is on foot and travelling.  Factor encumbrance into fatigue rate.
    iPercentEncumbrance = CalculateCarriedWeight(pSoldier);
    if (iPercentEncumbrance > 100) {
      iBreathLoss = (bMaxBreathLoss * iPercentEncumbrance / 100);
      bMaxBreathLoss = Math.min(127, iBreathLoss);
    }
  }

  // if breath max is below the "really tired" threshold
  if (pSoldier.bBreathMax < BREATHMAX_PRETTY_TIRED) {
    // real tired, fatigue rate is 50% higher
    bMaxBreathLoss = (bMaxBreathLoss * 3 / 2);
  }

  pSoldier.bBreathMax -= bMaxBreathLoss;

  if (pSoldier.bBreathMax > 100) {
    pSoldier.bBreathMax = 100;
  } else if (pSoldier.bBreathMax < BREATHMAX_ABSOLUTE_MINIMUM) {
    pSoldier.bBreathMax = BREATHMAX_ABSOLUTE_MINIMUM;
  }

  // current breath can't exceed maximum
  if (pSoldier.bBreath > pSoldier.bBreathMax) {
    pSoldier.bBreath = pSoldier.bBreathMax;
  }

  return;
}

// ONCE PER HOUR, will handle ALL kinds of training (self, teaching, and town) in this sector
function HandleTrainingInSector(sMapX: INT16, sMapY: INT16, bZ: INT8): void {
  let pTrainer: SOLDIERTYPE;
  let pStudent: SOLDIERTYPE;
  let ubStat: UINT8;
  let fAtGunRange: boolean = false;
  let uiCnt: UINT32 = 0;
  let sTotalTrainingPts: INT16 = 0;
  let sTrainingPtsDueToInstructor: INT16 = 0;
  let pStatTrainerList: SOLDIERTYPE[] /* Pointer<SOLDIERTYPE>[NUM_TRAINABLE_STATS] */ = createArray(Enum118.NUM_TRAINABLE_STATS, <SOLDIERTYPE><unknown>null); // can't have more "best" trainers than trainable stats
  let sBestTrainingPts: INT16;
  let sTownTrainingPts: INT16;
  let TownTrainer: TOWN_TRAINER_TYPE[] /* [MAX_CHARACTER_COUNT] */ = createArrayFrom(MAX_CHARACTER_COUNT, createTownTrainerType);
  let ubTownTrainers: UINT8;
  let usMaxPts: UINT16;
  let fSamSiteInSector: boolean = false;
  let fTrainingCompleted: boolean = false;

  // find out if a sam site here
  fSamSiteInSector = IsThisSectorASAMSector(sMapX, sMapY, 0);

  // Training in underground sectors is disallowed by the interface code, so there should never be any
  if (bZ != 0) {
    return;
  }

  // if sector not under our control, has enemies in it, or is currently in combat mode
  if (!SectorOursAndPeaceful(sMapX, sMapY, bZ)) {
    // then training is canceled for this hour.
    // This is partly logical, but largely to prevent newly trained militia from appearing in mid-battle
    return;
  }

  // are we training in the sector with gun range in Alma?
  if ((sMapX == GUN_RANGE_X) && (sMapY == GUN_RANGE_Y) && (bZ == GUN_RANGE_Z)) {
    fAtGunRange = true;
  }

  // build list of teammate trainers in this sector.

  // Only the trainer with the HIGHEST training ability in each stat is effective.  This is mainly to avoid having to
  // sort them from highest to lowest if some form of trainer degradation formula was to be used for multiple trainers.

  // for each trainable stat
  for (ubStat = 0; ubStat < Enum118.NUM_TRAINABLE_STATS; ubStat++) {
    sBestTrainingPts = -1;

    // search team for active instructors in this sector
    for (uiCnt = 0, pTrainer = MercPtrs[uiCnt]; uiCnt <= gTacticalStatus.Team[MercPtrs[0].bTeam].bLastID; uiCnt++, pTrainer = MercPtrs[uiCnt]) {
      if (pTrainer.bActive && (pTrainer.sSectorX == sMapX) && (pTrainer.sSectorY == sMapY) && (pTrainer.bSectorZ == bZ)) {
        // if he's training teammates in this stat
        if ((pTrainer.bAssignment == Enum117.TRAIN_TEAMMATE) && (pTrainer.bTrainStat == ubStat) && (EnoughTimeOnAssignment(pTrainer)) && (pTrainer.fMercAsleep == false)) {
          sTrainingPtsDueToInstructor = GetBonusTrainingPtsDueToInstructor(pTrainer, null, ubStat, fAtGunRange, addressof(usMaxPts));

          // if he's the best trainer so far for this stat
          if (sTrainingPtsDueToInstructor > sBestTrainingPts) {
            // then remember him as that, and the points he scored
            pStatTrainerList[ubStat] = pTrainer;
            sBestTrainingPts = sTrainingPtsDueToInstructor;
          }
        }
      }
    }
  }

  // now search team for active self-trainers in this sector
  for (uiCnt = 0, pStudent = MercPtrs[uiCnt]; uiCnt <= gTacticalStatus.Team[MercPtrs[0].bTeam].bLastID; uiCnt++, pStudent = MercPtrs[uiCnt]) {
    // see if this merc is active and in the same sector
    if ((pStudent.bActive) && (pStudent.sSectorX == sMapX) && (pStudent.sSectorY == sMapY) && (pStudent.bSectorZ == bZ)) {
      // if he's training himself (alone, or by others), then he's a student
      if ((pStudent.bAssignment == Enum117.TRAIN_SELF) || (pStudent.bAssignment == Enum117.TRAIN_BY_OTHER)) {
        if (EnoughTimeOnAssignment(pStudent) && (pStudent.fMercAsleep == false)) {
          // figure out how much the grunt can learn in one training period
          sTotalTrainingPts = GetSoldierTrainingPts(pStudent, pStudent.bTrainStat, fAtGunRange, addressof(usMaxPts));

          // if he's getting help
          if (pStudent.bAssignment == Enum117.TRAIN_BY_OTHER) {
            // grab the pointer to the (potential) trainer for this stat
            pTrainer = pStatTrainerList[pStudent.bTrainStat];

            // if this stat HAS a trainer in sector at all
            if (pTrainer != null) {
              /* Assignment distance limits removed.  Sep/11/98.  ARM
                                                                      // if this sector either ISN'T currently loaded, or it is but the trainer is close enough to the student
                                                                      if ( ( sMapX != gWorldSectorX ) || ( sMapY != gWorldSectorY ) || ( pStudent -> bSectorZ != gbWorldSectorZ ) ||
                                                                                       ( PythSpacesAway( pStudent -> sGridNo, pTrainer -> sGridNo ) < MAX_DISTANCE_FOR_TRAINING ) && ( EnoughTimeOnAssignment( pTrainer ) ) )
              */
              // NB this EnoughTimeOnAssignment() call is redundent since it is called up above
              // if ( EnoughTimeOnAssignment( pTrainer ) )
              {
                // valid trainer is available, this gives the student a large training bonus!
                sTrainingPtsDueToInstructor = GetBonusTrainingPtsDueToInstructor(pTrainer, pStudent, pStudent.bTrainStat, fAtGunRange, addressof(usMaxPts));

                // add the bonus to what merc can learn on his own
                sTotalTrainingPts += sTrainingPtsDueToInstructor;
              }
            }
          }

          // now finally train the grunt
          TrainSoldierWithPts(pStudent, sTotalTrainingPts);
        }
      }
    }
  }

  // check if we're doing a sector where militia can be trained
  if (((StrategicMap[sMapX + (sMapY * MAP_WORLD_X)].bNameId != Enum135.BLANK_SECTOR) || (fSamSiteInSector == true)) && (bZ == 0)) {
    // init town trainer list
    ubTownTrainers = 0;

    // build list of all the town trainers in this sector and their training pts
    for (uiCnt = 0, pTrainer = MercPtrs[uiCnt]; uiCnt <= gTacticalStatus.Team[MercPtrs[0].bTeam].bLastID; uiCnt++, pTrainer = MercPtrs[uiCnt]) {
      if (pTrainer.bActive && (pTrainer.sSectorX == sMapX) && (pTrainer.sSectorY == sMapY) && (pTrainer.bSectorZ == bZ)) {
        if ((pTrainer.bAssignment == Enum117.TRAIN_TOWN) && (EnoughTimeOnAssignment(pTrainer)) && (pTrainer.fMercAsleep == false)) {
          sTownTrainingPts = GetTownTrainPtsForCharacter(pTrainer, addressof(usMaxPts));

          // if he's actually worth anything
          if (sTownTrainingPts > 0) {
            // remember this guy as a town trainer
            TownTrainer[ubTownTrainers].sTrainingPts = sTownTrainingPts;
            TownTrainer[ubTownTrainers].pSoldier = pTrainer;
            ubTownTrainers++;
          }
        }
      }
    }

    // if we have more than one
    if (ubTownTrainers > 1) {
      // sort the town trainer list from best trainer to worst
      TownTrainer.sort(TownTrainerQsortCompare);
    }

    // for each trainer, in sorted order from the best to the worst
    for (uiCnt = 0; uiCnt < ubTownTrainers; uiCnt++) {
      // top trainer has full effect (divide by 1), then divide by 2, 4, 8, etc.
      // sTownTrainingPts = TownTrainer[ uiCnt ].sTrainingPts / (UINT16) pow(2, uiCnt);
      // CJC: took this out and replaced with limit of 2 guys per sector
      sTownTrainingPts = TownTrainer[uiCnt].sTrainingPts;

      if (sTownTrainingPts > 0) {
        fTrainingCompleted = TrainTownInSector(TownTrainer[uiCnt].pSoldier, sMapX, sMapY, sTownTrainingPts);

        if (fTrainingCompleted) {
          // there's no carryover into next session for extra training (cause player might cancel), so break out of loop
          break;
        }
      }
    }
  }
}

function TownTrainerQsortCompare(pArg1: TOWN_TRAINER_TYPE, pArg2: TOWN_TRAINER_TYPE): number {
  if ((pArg1).sTrainingPts > (pArg2).sTrainingPts) {
    return -1;
  } else if ((pArg1).sTrainingPts < (pArg2).sTrainingPts) {
    return 1;
  } else {
    return 0;
  }
}

export function GetBonusTrainingPtsDueToInstructor(pInstructor: SOLDIERTYPE, pStudent: SOLDIERTYPE | null, bTrainStat: INT8, fAtGunRange: boolean, pusMaxPts: Pointer<UINT16>): INT16 {
  // return the bonus training pts of this instructor with this student,...if student null, simply assignment student skill of 0 and student wisdom of 100
  let sTrainingPts: INT16 = 0;
  let bTraineeEffWisdom: INT8 = 0;
  let bTraineeNatWisdom: INT8 = 0;
  let bTraineeSkill: INT8 = 0;
  let bTrainerEffSkill: INT8 = 0;
  let bTrainerNatSkill: INT8 = 0;
  let bTrainingBonus: INT8 = 0;
  let bOpinionFactor: INT8;

  // assume training impossible for max pts
  pusMaxPts.value = 0;

  if (pInstructor == null) {
    // no instructor, leave
    return 0;
  }

  switch (bTrainStat) {
    case (Enum118.STRENGTH):
      bTrainerEffSkill = EffectiveStrength(pInstructor);
      bTrainerNatSkill = pInstructor.bStrength;
      break;
    case (Enum118.DEXTERITY):
      bTrainerEffSkill = EffectiveDexterity(pInstructor);
      bTrainerNatSkill = pInstructor.bDexterity;
      break;
    case (Enum118.AGILITY):
      bTrainerEffSkill = EffectiveAgility(pInstructor);
      bTrainerNatSkill = pInstructor.bAgility;
      break;
    case (Enum118.HEALTH):
      bTrainerEffSkill = pInstructor.bLifeMax;
      bTrainerNatSkill = pInstructor.bLifeMax;
      break;
    case (Enum118.LEADERSHIP):
      bTrainerEffSkill = EffectiveLeadership(pInstructor);
      bTrainerNatSkill = pInstructor.bLeadership;
      break;
    case (Enum118.MARKSMANSHIP):
      bTrainerEffSkill = EffectiveMarksmanship(pInstructor);
      bTrainerNatSkill = pInstructor.bMarksmanship;
      break;
    case (Enum118.EXPLOSIVE_ASSIGN):
      bTrainerEffSkill = EffectiveExplosive(pInstructor);
      bTrainerNatSkill = pInstructor.bExplosive;
      break;
    case (Enum118.MEDICAL):
      bTrainerEffSkill = EffectiveMedical(pInstructor);
      bTrainerNatSkill = pInstructor.bMedical;
      break;
    case (Enum118.MECHANICAL):
      bTrainerEffSkill = EffectiveMechanical(pInstructor);
      bTrainerNatSkill = pInstructor.bMechanical;
      break;
    // NOTE: Wisdom can't be trained!
    default:
      return 0;
  }

  // if there's no student
  if (pStudent == null) {
    // assume these default values
    bTraineeEffWisdom = 100;
    bTraineeNatWisdom = 100;
    bTraineeSkill = 0;
    bOpinionFactor = 0;
  } else {
    // set student's variables
    bTraineeEffWisdom = EffectiveWisdom(pStudent);
    bTraineeNatWisdom = pStudent.bWisdom;

    // for trainee's stat skill, must use the natural value, not the effective one, to avoid drunks training beyond cap
    switch (bTrainStat) {
      case (Enum118.STRENGTH):
        bTraineeSkill = pStudent.bStrength;
        break;
      case (Enum118.DEXTERITY):
        bTraineeSkill = pStudent.bDexterity;
        break;
      case (Enum118.AGILITY):
        bTraineeSkill = pStudent.bAgility;
        break;
      case (Enum118.HEALTH):
        bTraineeSkill = pStudent.bLifeMax;
        break;
      case (Enum118.LEADERSHIP):
        bTraineeSkill = pStudent.bLeadership;
        break;
      case (Enum118.MARKSMANSHIP):
        bTraineeSkill = pStudent.bMarksmanship;
        break;
      case (Enum118.EXPLOSIVE_ASSIGN):
        bTraineeSkill = pStudent.bExplosive;
        break;
      case (Enum118.MEDICAL):
        bTraineeSkill = pStudent.bMedical;
        break;
      case (Enum118.MECHANICAL):
        bTraineeSkill = pStudent.bMechanical;
        break;
      // NOTE: Wisdom can't be trained!
      default:
        return 0;
    }

    // if trainee skill 0 or at/beyond the training cap, can't train
    if ((bTraineeSkill == 0) || (bTraineeSkill >= TRAINING_RATING_CAP)) {
      return 0;
    }

    // factor in their mutual relationship
    bOpinionFactor = gMercProfiles[pStudent.ubProfile].bMercOpinion[pInstructor.ubProfile];
    bOpinionFactor += gMercProfiles[pInstructor.ubProfile].bMercOpinion[pStudent.ubProfile] / 2;
  }

  // check to see if student better than/equal to instructor's effective skill, if so, return 0
  // don't use natural skill - if the guy's too doped up to tell what he know, student learns nothing until sobriety returns!
  if (bTraineeSkill >= bTrainerEffSkill) {
    return 0;
  }

  // calculate effective training pts
  sTrainingPts = (bTrainerEffSkill - bTraineeSkill) * (bTraineeEffWisdom + (EffectiveWisdom(pInstructor) + EffectiveLeadership(pInstructor)) / 2) / INSTRUCTED_TRAINING_DIVISOR;

  // calculate normal training pts - what it would be if his stats were "normal" (ignoring drugs, fatigue)
  pusMaxPts.value = (bTrainerNatSkill - bTraineeSkill) * (bTraineeNatWisdom + (pInstructor.bWisdom + pInstructor.bLeadership) / 2) / INSTRUCTED_TRAINING_DIVISOR;

  // put in a minimum (that can be reduced due to instructor being tired?)
  if (pusMaxPts.value == 0) {
    // we know trainer is better than trainee, make sure they are at least 10 pts better
    if (bTrainerEffSkill > bTraineeSkill + 10) {
      sTrainingPts = 1;
      pusMaxPts.value = 1;
    }
  }

  // check for teaching skill bonuses
  if (gMercProfiles[pInstructor.ubProfile].bSkillTrait == Enum269.TEACHING) {
    bTrainingBonus += TEACH_BONUS_TO_TRAIN;
  }
  if (gMercProfiles[pInstructor.ubProfile].bSkillTrait2 == Enum269.TEACHING) {
    bTrainingBonus += TEACH_BONUS_TO_TRAIN;
  }

  // teaching bonus is counted as normal, but gun range bonus is not
  pusMaxPts.value += (((bTrainingBonus + bOpinionFactor) * pusMaxPts.value) / 100);

  // get special bonus if we're training marksmanship and we're in the gun range sector in Alma
  if ((bTrainStat == Enum118.MARKSMANSHIP) && fAtGunRange) {
    bTrainingBonus += GUN_RANGE_TRAINING_BONUS;
  }

  // adjust for any training bonuses and for the relationship
  sTrainingPts += (((bTrainingBonus + bOpinionFactor) * sTrainingPts) / 100);

  // adjust for instructor fatigue
  sTrainingPts = ReducePointsForFatigue(pInstructor, sTrainingPts);

  return sTrainingPts;
}

export function GetSoldierTrainingPts(pSoldier: SOLDIERTYPE, bTrainStat: INT8, fAtGunRange: boolean, pusMaxPts: Pointer<UINT16>): INT16 {
  let sTrainingPts: INT16 = 0;
  let bTrainingBonus: INT8 = 0;
  let bSkill: INT8 = 0;

  // assume training impossible for max pts
  pusMaxPts.value = 0;

  // use NATURAL not EFFECTIVE values here
  switch (bTrainStat) {
    case (Enum118.STRENGTH):
      bSkill = pSoldier.bStrength;
      break;
    case (Enum118.DEXTERITY):
      bSkill = pSoldier.bDexterity;
      break;
    case (Enum118.AGILITY):
      bSkill = pSoldier.bAgility;
      break;
    case (Enum118.HEALTH):
      bSkill = pSoldier.bLifeMax;
      break;
    case (Enum118.LEADERSHIP):
      bSkill = pSoldier.bLeadership;
      break;
    case (Enum118.MARKSMANSHIP):
      bSkill = pSoldier.bMarksmanship;
      break;
    case (Enum118.EXPLOSIVE_ASSIGN):
      bSkill = pSoldier.bExplosive;
      break;
    case (Enum118.MEDICAL):
      bSkill = pSoldier.bMedical;
      break;
    case (Enum118.MECHANICAL):
      bSkill = pSoldier.bMechanical;
      break;
    // NOTE: Wisdom can't be trained!
    default:
      return 0;
  }

  // if skill 0 or at/beyond the training cap, can't train
  if ((bSkill == 0) || (bSkill >= TRAINING_RATING_CAP)) {
    return 0;
  }

  // calculate normal training pts - what it would be if his stats were "normal" (ignoring drugs, fatigue)
  pusMaxPts.value = Math.max(((pSoldier.bWisdom * (TRAINING_RATING_CAP - bSkill)) / SELF_TRAINING_DIVISOR), 1);

  // calculate effective training pts
  sTrainingPts = Math.max(((EffectiveWisdom(pSoldier) * (TRAINING_RATING_CAP - bSkill)) / SELF_TRAINING_DIVISOR), 1);

  // get special bonus if we're training marksmanship and we're in the gun range sector in Alma
  if ((bTrainStat == Enum118.MARKSMANSHIP) && fAtGunRange) {
    bTrainingBonus += GUN_RANGE_TRAINING_BONUS;
  }

  // adjust for any training bonuses
  sTrainingPts += ((bTrainingBonus * sTrainingPts) / 100);

  // adjust for fatigue
  sTrainingPts = ReducePointsForFatigue(pSoldier, sTrainingPts);

  return sTrainingPts;
}

export function GetSoldierStudentPts(pSoldier: SOLDIERTYPE, bTrainStat: INT8, fAtGunRange: boolean, pusMaxPts: Pointer<UINT16>): INT16 {
  let sTrainingPts: INT16 = 0;
  let bTrainingBonus: INT8 = 0;
  let bSkill: INT8 = 0;

  let sBestTrainingPts: INT16;
  let sTrainingPtsDueToInstructor: INT16;
  let usMaxTrainerPts: UINT16;
  let usBestMaxTrainerPts: UINT16;
  let uiCnt: UINT32;
  let pTrainer: SOLDIERTYPE;

  // assume training impossible for max pts
  pusMaxPts.value = 0;

  // use NATURAL not EFFECTIVE values here
  switch (bTrainStat) {
    case (Enum118.STRENGTH):
      bSkill = pSoldier.bStrength;
      break;
    case (Enum118.DEXTERITY):
      bSkill = pSoldier.bDexterity;
      break;
    case (Enum118.AGILITY):
      bSkill = pSoldier.bAgility;
      break;
    case (Enum118.HEALTH):
      bSkill = pSoldier.bLifeMax;
      break;
    case (Enum118.LEADERSHIP):
      bSkill = pSoldier.bLeadership;
      break;
    case (Enum118.MARKSMANSHIP):
      bSkill = pSoldier.bMarksmanship;
      break;
    case (Enum118.EXPLOSIVE_ASSIGN):
      bSkill = pSoldier.bExplosive;
      break;
    case (Enum118.MEDICAL):
      bSkill = pSoldier.bMedical;
      break;
    case (Enum118.MECHANICAL):
      bSkill = pSoldier.bMechanical;
      break;
    // NOTE: Wisdom can't be trained!
    default:
      return 0;
  }

  // if skill 0 or at/beyond the training cap, can't train
  if ((bSkill == 0) || (bSkill >= TRAINING_RATING_CAP)) {
    return 0;
  }

  // calculate normal training pts - what it would be if his stats were "normal" (ignoring drugs, fatigue)
  pusMaxPts.value = Math.max(((pSoldier.bWisdom * (TRAINING_RATING_CAP - bSkill)) / SELF_TRAINING_DIVISOR), 1);

  // calculate effective training pts
  sTrainingPts = Math.max(((EffectiveWisdom(pSoldier) * (TRAINING_RATING_CAP - bSkill)) / SELF_TRAINING_DIVISOR), 1);

  // get special bonus if we're training marksmanship and we're in the gun range sector in Alma
  if ((bTrainStat == Enum118.MARKSMANSHIP) && fAtGunRange) {
    bTrainingBonus += GUN_RANGE_TRAINING_BONUS;
  }

  // adjust for any training bonuses
  sTrainingPts += ((bTrainingBonus * sTrainingPts) / 100);

  // adjust for fatigue
  sTrainingPts = ReducePointsForFatigue(pSoldier, sTrainingPts);

  // now add in stuff for trainer

  // for each trainable stat
  sBestTrainingPts = -1;

  // search team for active instructors in this sector
  for (uiCnt = 0, pTrainer = MercPtrs[uiCnt]; uiCnt <= gTacticalStatus.Team[MercPtrs[0].bTeam].bLastID; uiCnt++, pTrainer = MercPtrs[uiCnt]) {
    if (pTrainer.bActive && (pTrainer.sSectorX == pSoldier.sSectorX) && (pTrainer.sSectorY == pSoldier.sSectorY) && (pTrainer.bSectorZ == pSoldier.bSectorZ)) {
      // if he's training teammates in this stat
      // NB skip the EnoughTime requirement to display what the value should be even if haven't been training long yet...
      if ((pTrainer.bAssignment == Enum117.TRAIN_TEAMMATE) && (pTrainer.bTrainStat == bTrainStat) && (pTrainer.fMercAsleep == false)) {
        sTrainingPtsDueToInstructor = GetBonusTrainingPtsDueToInstructor(pTrainer, pSoldier, bTrainStat, fAtGunRange, addressof(usMaxTrainerPts));

        // if he's the best trainer so far for this stat
        if (sTrainingPtsDueToInstructor > sBestTrainingPts) {
          // then remember him as that, and the points he scored
          sBestTrainingPts = sTrainingPtsDueToInstructor;
          usBestMaxTrainerPts = usMaxTrainerPts;
        }
      }
    }
  }

  if (sBestTrainingPts != -1) {
    // add the bonus to what merc can learn on his own
    sTrainingPts += sBestTrainingPts;
    pusMaxPts.value += usBestMaxTrainerPts;
  }

  return sTrainingPts;
}

function TrainSoldierWithPts(pSoldier: SOLDIERTYPE, sTrainPts: INT16): void {
  let ubChangeStat: UINT8 = 0;

  if (sTrainPts <= 0) {
    return;
  }

  // which stat to modify?
  switch (pSoldier.bTrainStat) {
    case (Enum118.STRENGTH):
      ubChangeStat = STRAMT;
      break;
    case (Enum118.DEXTERITY):
      ubChangeStat = DEXTAMT;
      break;
    case (Enum118.AGILITY):
      ubChangeStat = AGILAMT;
      break;
    case (Enum118.HEALTH):
      ubChangeStat = HEALTHAMT;
      break;
    case (Enum118.LEADERSHIP):
      ubChangeStat = LDRAMT;
      break;
    case (Enum118.MARKSMANSHIP):
      ubChangeStat = MARKAMT;
      break;
    case (Enum118.EXPLOSIVE_ASSIGN):
      ubChangeStat = EXPLODEAMT;
      break;
    case (Enum118.MEDICAL):
      ubChangeStat = MEDICALAMT;
      break;
    case (Enum118.MECHANICAL):
      ubChangeStat = MECHANAMT;
      break;
    // NOTE: Wisdom can't be trained!
    default:
      return;
  }

  // give this merc a few chances to increase a stat (TRUE means it's training, reverse evolution doesn't apply)
  StatChange(pSoldier, ubChangeStat, sTrainPts, FROM_TRAINING);
}

// will train a town in sector by character
function TrainTownInSector(pTrainer: SOLDIERTYPE, sMapX: INT16, sMapY: INT16, sTrainingPts: INT16): boolean {
  let pSectorInfo: SECTORINFO = SectorInfo[SECTOR(sMapX, sMapY)];
  let ubTownId: UINT8 = 0;
  let sCnt: INT16 = 0;
  let bChance: INT8 = 0;
  let fSamSiteInSector: boolean = false;

  // find out if a sam site here
  fSamSiteInSector = IsThisSectorASAMSector(sMapX, sMapY, 0);

  // get town index
  ubTownId = StrategicMap[pTrainer.sSectorX + pTrainer.sSectorY * MAP_WORLD_X].bNameId;
  if (fSamSiteInSector == false) {
    Assert(ubTownId != Enum135.BLANK_SECTOR);
  }

  // trainer gains leadership - training argument is FALSE, because the trainer is not the one training!
  StatChange(pTrainer, LDRAMT, (1 + (sTrainingPts / 200)), 0);
  //	StatChange( pTrainer, WISDOMAMT, (UINT16) ( 1 + ( sTrainingPts / 400 ) ), FALSE );

  // increase town's training completed percentage
  pSectorInfo.ubMilitiaTrainingPercentDone += (sTrainingPts / 100);
  pSectorInfo.ubMilitiaTrainingHundredths += (sTrainingPts % 100);

  if (pSectorInfo.ubMilitiaTrainingHundredths >= 100) {
    pSectorInfo.ubMilitiaTrainingPercentDone++;
    pSectorInfo.ubMilitiaTrainingHundredths -= 100;
  }

  // NOTE: Leave this at 100, change TOWN_TRAINING_RATE if necessary.  This value gets reported to player as a %age!
  if (pSectorInfo.ubMilitiaTrainingPercentDone >= 100) {
    // zero out training completion - there's no carryover to the next training session
    pSectorInfo.ubMilitiaTrainingPercentDone = 0;
    pSectorInfo.ubMilitiaTrainingHundredths = 0;

    // make the player pay again next time he wants to train here
    pSectorInfo.fMilitiaTrainingPaid = false;

    TownMilitiaTrainingCompleted(pTrainer, sMapX, sMapY);

    // training done
    return true;
  } else {
    // not done
    return false;
  }
}

export function GetTownTrainPtsForCharacter(pTrainer: SOLDIERTYPE, pusMaxPts: Pointer<UINT16>): INT16 {
  let sTotalTrainingPts: INT16 = 0;
  let bTrainingBonus: INT8 = 0;
  //	UINT8 ubTownId = 0;

  // calculate normal training pts - what it would be if his stats were "normal" (ignoring drugs, fatigue)
  pusMaxPts.value = (pTrainer.bWisdom + pTrainer.bLeadership + (10 * pTrainer.bExpLevel)) * TOWN_TRAINING_RATE;

  // calculate effective training points (this is hundredths of pts / hour)
  // typical: 300/hr, maximum: 600/hr
  sTotalTrainingPts = (EffectiveWisdom(pTrainer) + EffectiveLeadership(pTrainer) + (10 * EffectiveExpLevel(pTrainer))) * TOWN_TRAINING_RATE;

  // check for teaching bonuses
  if (gMercProfiles[pTrainer.ubProfile].bSkillTrait == Enum269.TEACHING) {
    bTrainingBonus += TEACH_BONUS_TO_TRAIN;
  }
  if (gMercProfiles[pTrainer.ubProfile].bSkillTrait2 == Enum269.TEACHING) {
    bTrainingBonus += TEACH_BONUS_TO_TRAIN;
  }

  // RPCs get a small training bonus for being more familiar with the locals and their customs/needs than outsiders
  if (pTrainer.ubProfile >= FIRST_RPC) {
    bTrainingBonus += RPC_BONUS_TO_TRAIN;
  }

  // adjust for teaching bonus (a percentage)
  sTotalTrainingPts += ((bTrainingBonus * sTotalTrainingPts) / 100);
  // teach bonus is considered "normal" - it's always there
  pusMaxPts.value += ((bTrainingBonus * pusMaxPts.value) / 100);

  // adjust for fatigue of trainer
  sTotalTrainingPts = ReducePointsForFatigue(pTrainer, sTotalTrainingPts);

  /* ARM: Decided this didn't make much sense - the guys I'm training damn well BETTER be loyal - and screw the rest!
          // get town index
          ubTownId = StrategicMap[ pTrainer -> sSectorX + pTrainer -> sSectorY * MAP_WORLD_X ].bNameId;
          Assert(ubTownId != BLANK_SECTOR);

          // adjust for town loyalty
          sTotalTrainingPts = (sTotalTrainingPts * gTownLoyalty[ ubTownId ].ubRating) / 100;
  */

  return sTotalTrainingPts;
}

export function MakeSoldiersTacticalAnimationReflectAssignment(pSoldier: SOLDIERTYPE): void {
  // soldier is in tactical, world loaded, he's OKLIFE
  if ((pSoldier.bInSector) && gfWorldLoaded && (pSoldier.bLife >= OKLIFE)) {
    // Set animation based on his assignment
    if (pSoldier.bAssignment == Enum117.DOCTOR) {
      SoldierInSectorDoctor(pSoldier, pSoldier.usStrategicInsertionData);
    } else if (pSoldier.bAssignment == Enum117.PATIENT) {
      SoldierInSectorPatient(pSoldier, pSoldier.usStrategicInsertionData);
    } else if (pSoldier.bAssignment == Enum117.REPAIR) {
      SoldierInSectorRepair(pSoldier, pSoldier.usStrategicInsertionData);
    } else {
      if (pSoldier.usAnimState != Enum193.WKAEUP_FROM_SLEEP && !(pSoldier.bOldAssignment < Enum117.ON_DUTY)) {
        // default: standing
        ChangeSoldierState(pSoldier, Enum193.STANDING, 1, true);
      }
    }
  }
}

function AssignmentAborted(pSoldier: SOLDIERTYPE, ubReason: UINT8): void {
  Assert(ubReason < Enum113.NUM_ASSIGN_ABORT_REASONS);

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[ubReason], pSoldier.name);

  StopTimeCompression();

  // update mapscreen
  fCharacterInfoPanelDirty = true;
  fTeamPanelDirty = true;
  fMapScreenBottomDirty = true;
}

export function AssignmentDone(pSoldier: SOLDIERTYPE, fSayQuote: boolean, fMeToo: boolean): void {
  if ((pSoldier.bInSector) && (gfWorldLoaded)) {
    if (pSoldier.bAssignment == Enum117.DOCTOR) {
      if (guiCurrentScreen == Enum26.GAME_SCREEN) {
        ChangeSoldierState(pSoldier, Enum193.END_DOCTOR, 1, true);
      } else {
        ChangeSoldierState(pSoldier, Enum193.STANDING, 1, true);
      }
    } else if (pSoldier.bAssignment == Enum117.REPAIR) {
      if (guiCurrentScreen == Enum26.GAME_SCREEN) {
        ChangeSoldierState(pSoldier, Enum193.END_REPAIRMAN, 1, true);
      } else {
        ChangeSoldierState(pSoldier, Enum193.STANDING, 1, true);
      }
    } else if (pSoldier.bAssignment == Enum117.PATIENT) {
      if (guiCurrentScreen == Enum26.GAME_SCREEN) {
        ChangeSoldierStance(pSoldier, ANIM_CROUCH);
      } else {
        ChangeSoldierState(pSoldier, Enum193.STANDING, 1, true);
      }
    }
  }

  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL) {
    // hack - reset AbsoluteFinalDestination in case it was left non-nowhere
    pSoldier.sAbsoluteFinalDestination = NOWHERE;
  }

  if (fSayQuote) {
    if ((fMeToo == false) && (pSoldier.bAssignment == Enum117.TRAIN_TOWN)) {
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_ASSIGNMENT_COMPLETE);

      if (pSoldier.bAssignment == Enum117.TRAIN_TOWN) {
        AddSectorForSoldierToListOfSectorsThatCompletedMilitiaTraining(pSoldier);
      }
    }
  }

  // don't bother telling us again about guys we already know about
  if (!(pSoldier.usQuoteSaidExtFlags & SOLDIER_QUOTE_SAID_DONE_ASSIGNMENT)) {
    pSoldier.usQuoteSaidExtFlags |= SOLDIER_QUOTE_SAID_DONE_ASSIGNMENT;

    if (fSayQuote) {
      if (pSoldier.bAssignment == Enum117.DOCTOR || pSoldier.bAssignment == Enum117.REPAIR || pSoldier.bAssignment == Enum117.PATIENT || pSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL) {
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_ASSIGNMENT_COMPLETE);
      }
    }

    AddReasonToWaitingListQueue(Enum154.ASSIGNMENT_FINISHED_FOR_UPDATE);
    AddSoldierToWaitingListQueue(pSoldier);

    // trigger a single call AddDisplayBoxToWaitingQueue for assignments done
    gfAddDisplayBoxToWaitingQueue = true;
  }

  // update mapscreen
  fCharacterInfoPanelDirty = true;
  fTeamPanelDirty = true;
  fMapScreenBottomDirty = true;
}

function CharacterIsBetweenSectors(pSoldier: SOLDIERTYPE): boolean {
  // is the character on the move
  if (pSoldier == null) {
    return false;
  } else {
    return pSoldier.fBetweenSectors;
  }
}

function HandleNaturalHealing(): void {
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let bNumberOfPeople: INT8 = 0;

  // set psoldier as first in merc ptrs
  pSoldier = MercPtrs[0];

  // go through list of characters, find all who are on this assignment
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      // mechanical members don't regenerate!
      if (!(pTeamSoldier.uiStatusFlags & SOLDIER_VEHICLE) && !(AM_A_ROBOT(pTeamSoldier))) {
        HandleHealingByNaturalCauses(pTeamSoldier);
      }
    }
  }

  return;
}

// handle healing of this soldier by natural causes.
function HandleHealingByNaturalCauses(pSoldier: SOLDIERTYPE): void {
  let uiPercentHealth: UINT32 = 0;
  let bActivityLevelDivisor: INT8 = 0;

  // check if soldier valid
  if (pSoldier == null) {
    return;
  }

  // dead
  if (pSoldier.bLife == 0) {
    return;
  }

  // lost any pts?
  if (pSoldier.bLife == pSoldier.bLifeMax) {
    return;
  }

  // any bleeding pts - can' recover if still bleeding!
  if (pSoldier.bBleeding != 0) {
    return;
  }

  // not bleeding and injured...

  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    // use high activity level to simulate stress, torture, poor conditions for healing
    bActivityLevelDivisor = HIGH_ACTIVITY_LEVEL;
  }
  if ((pSoldier.fMercAsleep == true) || (pSoldier.bAssignment == Enum117.PATIENT) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL)) {
    bActivityLevelDivisor = LOW_ACTIVITY_LEVEL;
  } else if (pSoldier.bAssignment < Enum117.ON_DUTY) {
    // if time is being compressed, and the soldier is not moving strategically
    if (IsTimeBeingCompressed() && !PlayerIDGroupInMotion(pSoldier.ubGroupID)) {
      // basically resting
      bActivityLevelDivisor = LOW_ACTIVITY_LEVEL;
    } else {
      // either they're on the move, or they're being tactically active
      bActivityLevelDivisor = HIGH_ACTIVITY_LEVEL;
    }
  } else // this includes being in a vehicle - that's neither very strenous, nor very restful
  {
    bActivityLevelDivisor = MEDIUM_ACTIVITY_LEVEL;
  }

  // what percentage of health is he down to
  uiPercentHealth = (pSoldier.bLife * 100) / pSoldier.bLifeMax;

  // gain that many hundredths of life points back, divided by the activity level modifier
  pSoldier.sFractLife += (uiPercentHealth / bActivityLevelDivisor);

  // now update the real life values
  UpDateSoldierLife(pSoldier);

  return;
}

function UpDateSoldierLife(pSoldier: SOLDIERTYPE): void {
  // update soldier life, make sure we don't go out of bounds
  pSoldier.bLife += pSoldier.sFractLife / 100;

  // keep remaining fract of life
  pSoldier.sFractLife %= 100;

  // check if we have gone too far
  if (pSoldier.bLife >= pSoldier.bLifeMax) {
    // reduce
    pSoldier.bLife = pSoldier.bLifeMax;
    pSoldier.sFractLife = 0;
  }
  return;
}

/*
// merc is tired, put to sleep
BOOLEAN AutoSleepMerc( SOLDIERTYPE *pSoldier )
{
        if( pSoldier == NULL )
        {
                return ( FALSE );
        }

        // already asleep
        if( pSoldier -> fMercAsleep == TRUE )
        {
                return ( FALSE );
        }

        if( pSoldier -> bBreathMax > MIN_BREATH_TO_STAY_AWAKE )
        {
                if( ( pSoldier -> bAssignment < ON_DUTY ) )
                {
                        return ( FALSE );
                }

                if( pSoldier -> bLife < OKLIFE )
                {
                        // can't sleep
                        return ( FALSE );
                }


                // if  was forced to stay awake, leave
                if( pSoldier -> fForcedToStayAwake == TRUE )
                {
                        return( FALSE );
                }
        }
        else
        {
        //	ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"%s",  pMercFellAsleepString[ 0 ], pSoldier -> name );
        }


        // store old assignment
        pSoldier -> bOldAssignment = pSoldier -> bAssignment;


        if( pSoldier -> bAssignment < ON_DUTY )
        {
                RemoveCharacterFromASquad( pSoldier, pSoldier -> bAssignment );
        }

        if( SetMercAsleep( pSoldier, FALSE ) )
        {
                // change soldier state
                SoldierInSectorSleep( pSoldier, pSoldier -> usStrategicInsertionData );

                // update mapscreen
                fCharacterInfoPanelDirty = TRUE;
                fTeamPanelDirty = TRUE;
                fMapScreenBottomDirty = TRUE;

                return( TRUE );
        }
        else
        {
                return( FALSE );
        }
}
*/

export function CheckIfSoldierUnassigned(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.bAssignment == NO_ASSIGNMENT) {
    // unassigned
    AddCharacterToAnySquad(pSoldier);

    if ((gfWorldLoaded) && (pSoldier.bInSector)) {
      ChangeSoldierState(pSoldier, Enum193.STANDING, 1, true);
    }
  }

  return;
}

/* static */ let CreateDestroyMouseRegionsForAssignmentMenu__fCreated: boolean = false;
/* static */ let CreateDestroyMouseRegionsForAssignmentMenu__fShowRemoveMenu: boolean = false;
function CreateDestroyMouseRegionsForAssignmentMenu(): void {
  let iCounter: UINT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();

  // will create/destroy mouse regions for the map screen assignment main menu
  // check if we can only remove character from team..not assign
  if ((bSelectedAssignChar != -1) || (CreateDestroyMouseRegionsForAssignmentMenu__fShowRemoveMenu == true)) {
    if (CreateDestroyMouseRegionsForAssignmentMenu__fShowRemoveMenu == true) {
      // dead guy handle menu stuff
      CreateDestroyMouseRegionsForAssignmentMenu__fShowRemoveMenu = fShowAssignmentMenu || fShowContractMenu;

      CreateDestroyMouseRegionsForRemoveMenu();

      return;
    }
    if ((Menptr[gCharactersList[bSelectedAssignChar].usSolID].bLife == 0) || (Menptr[gCharactersList[bSelectedAssignChar].usSolID].bAssignment == Enum117.ASSIGNMENT_POW)) {
      // dead guy handle menu stuff
      CreateDestroyMouseRegionsForAssignmentMenu__fShowRemoveMenu = fShowAssignmentMenu || fShowContractMenu;

      CreateDestroyMouseRegionsForRemoveMenu();

      return;
    }
  }

  if ((fShowAssignmentMenu == true) && (CreateDestroyMouseRegionsForAssignmentMenu__fCreated == false)) {
    gfIgnoreScrolling = false;

    if ((fShowAssignmentMenu) && (guiCurrentScreen == Enum26.MAP_SCREEN)) {
      SetBoxPosition(ghAssignmentBox, AssignmentPosition);
    }

    pSoldier = GetSelectedAssignSoldier(false);

    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      // grab height of font
      iFontHeight = GetLineSpace(ghEpcBox) + GetFontHeight(GetBoxFont(ghEpcBox));

      // get x.y position of box
      GetBoxPosition(ghEpcBox, pPosition);

      // grab box x and y position
      iBoxXPosition = pPosition.iX;
      iBoxYPosition = pPosition.iY;

      // get dimensions..mostly for width
      GetBoxSize(ghEpcBox, pDimensions);

      // get width
      iBoxWidth = pDimensions.iRight;

      SetCurrentBox(ghEpcBox);
    } else {
      // grab height of font
      iFontHeight = GetLineSpace(ghAssignmentBox) + GetFontHeight(GetBoxFont(ghAssignmentBox));

      // get x.y position of box
      GetBoxPosition(ghAssignmentBox, pPosition);

      // grab box x and y position
      iBoxXPosition = pPosition.iX;
      iBoxYPosition = pPosition.iY;

      // get dimensions..mostly for width
      GetBoxSize(ghAssignmentBox, pDimensions);

      // get width
      iBoxWidth = pDimensions.iRight;

      SetCurrentBox(ghAssignmentBox);
    }

    // define regions
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghAssignmentBox); iCounter++) {
      // add mouse region for each line of text..and set user data
      MSYS_DefineRegion(gAssignmentMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, AssignmentMenuMvtCallBack, AssignmentMenuBtnCallback);

      MSYS_SetRegionUserData(gAssignmentMenuRegion[iCounter], 0, iCounter);
    }

    // created
    CreateDestroyMouseRegionsForAssignmentMenu__fCreated = true;

    // unhighlight all strings in box
    UnHighLightBox(ghAssignmentBox);
    CheckAndUpdateTacticalAssignmentPopUpPositions();

    PositionCursorForTacticalAssignmentBox();
  } else if ((fShowAssignmentMenu == false) && (CreateDestroyMouseRegionsForAssignmentMenu__fCreated == true)) {
    // destroy
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghAssignmentBox); iCounter++) {
      MSYS_RemoveRegion(gAssignmentMenuRegion[iCounter]);
    }

    fShownAssignmentMenu = false;

    // not created
    CreateDestroyMouseRegionsForAssignmentMenu__fCreated = false;
    SetRenderFlags(RENDER_FLAG_FULL);
  }
}

/* static */ let CreateDestroyMouseRegionForVehicleMenu__fCreated: boolean = false;
function CreateDestroyMouseRegionForVehicleMenu(): void {
  let uiMenuLine: UINT32 = 0;
  let iVehicleId: INT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let pPoint: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();
  let pSoldier: SOLDIERTYPE;

  if (fShowVehicleMenu) {
    GetBoxPosition(ghAssignmentBox, pPoint);

    // get dimensions..mostly for width
    GetBoxSize(ghAssignmentBox, pDimensions);

    // vehicle position
    VehiclePosition.iX = pPoint.iX + pDimensions.iRight;

    SetBoxPosition(ghVehicleBox, VehiclePosition);
  }

  if ((fShowVehicleMenu == true) && (CreateDestroyMouseRegionForVehicleMenu__fCreated == false)) {
    // grab height of font
    iFontHeight = GetLineSpace(ghVehicleBox) + GetFontHeight(GetBoxFont(ghVehicleBox));

    // get x.y position of box
    GetBoxPosition(ghVehicleBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghVehicleBox, pDimensions);
    SetBoxSecondaryShade(ghVehicleBox, FONT_YELLOW);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghVehicleBox);

    pSoldier = GetSelectedAssignSoldier(false);

    // run through list of vehicles in sector
    for (iVehicleId = 0; iVehicleId < ubNumberOfVehicles; iVehicleId++) {
      if (pVehicleList[iVehicleId].fValid == true) {
        if (IsThisVehicleAccessibleToSoldier(pSoldier, iVehicleId)) {
          // add mouse region for each accessible vehicle
          MSYS_DefineRegion(gVehicleMenuRegion[uiMenuLine], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*uiMenuLine), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (uiMenuLine + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, VehicleMenuMvtCallback, VehicleMenuBtnCallback);

          MSYS_SetRegionUserData(gVehicleMenuRegion[uiMenuLine], 0, uiMenuLine);
          // store vehicle ID in the SECOND user data
          MSYS_SetRegionUserData(gVehicleMenuRegion[uiMenuLine], 1, iVehicleId);

          uiMenuLine++;
        }
      }
    }

    // cancel line
    MSYS_DefineRegion(gVehicleMenuRegion[uiMenuLine], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*uiMenuLine), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (uiMenuLine + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, VehicleMenuMvtCallback, VehicleMenuBtnCallback);
    MSYS_SetRegionUserData(gVehicleMenuRegion[uiMenuLine], 0, Enum115.VEHICLE_MENU_CANCEL);

    // created
    CreateDestroyMouseRegionForVehicleMenu__fCreated = true;

    // pause game
    PauseGame();

    // unhighlight all strings in box
    UnHighLightBox(ghVehicleBox);

    CreateDestroyMouseRegionForVehicleMenu__fCreated = true;

    HandleShadingOfLinesForVehicleMenu();
  } else if (((fShowVehicleMenu == false) || (fShowAssignmentMenu == false)) && (CreateDestroyMouseRegionForVehicleMenu__fCreated == true)) {
    CreateDestroyMouseRegionForVehicleMenu__fCreated = false;

    // remove these regions
    for (uiMenuLine = 0; uiMenuLine < GetNumberOfLinesOfTextInBox(ghVehicleBox); uiMenuLine++) {
      MSYS_RemoveRegion(gVehicleMenuRegion[uiMenuLine]);
    }

    fShowVehicleMenu = false;

    SetRenderFlags(RENDER_FLAG_FULL);

    HideBox(ghVehicleBox);

    if (fShowAssignmentMenu) {
      // remove highlight on the parent menu
      UnHighLightBox(ghAssignmentBox);
    }
  }

  return;
}

function HandleShadingOfLinesForVehicleMenu(): void {
  let pSoldier: SOLDIERTYPE;
  let iVehicleId: INT32;
  let uiMenuLine: UINT32 = 0;

  if ((fShowVehicleMenu == false) || (ghVehicleBox == -1)) {
    return;
  }

  pSoldier = GetSelectedAssignSoldier(false);

  // run through list of vehicles
  for (iVehicleId = 0; iVehicleId < ubNumberOfVehicles; iVehicleId++) {
    if (pVehicleList[iVehicleId].fValid == true) {
      // inaccessible vehicles aren't listed at all!
      if (IsThisVehicleAccessibleToSoldier(pSoldier, iVehicleId)) {
        if (IsEnoughSpaceInVehicle(iVehicleId)) {
          // legal vehicle, leave it green
          UnShadeStringInBox(ghVehicleBox, uiMenuLine);
          UnSecondaryShadeStringInBox(ghVehicleBox, uiMenuLine);
        } else {
          // unjoinable vehicle - yellow
          SecondaryShadeStringInBox(ghVehicleBox, uiMenuLine);
        }

        uiMenuLine++;
      }
    }
  }
}

function VehicleMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment region
  let iValue: INT32 = -1;
  let iVehicleID: INT32;
  let pSoldier: SOLDIERTYPE;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (iValue == Enum115.VEHICLE_MENU_CANCEL) {
      fShowVehicleMenu = false;
      UnHighLightBox(ghAssignmentBox);
      fTeamPanelDirty = true;
      fMapScreenBottomDirty = true;
      fCharacterInfoPanelDirty = true;
      return;
    }

    pSoldier = GetSelectedAssignSoldier(false);
    iVehicleID = MSYS_GetRegionUserData(pRegion, 1);

    // inaccessible vehicles shouldn't be listed in the menu!
    Assert(IsThisVehicleAccessibleToSoldier(pSoldier, iVehicleID));

    if (IsEnoughSpaceInVehicle(iVehicleID)) {
      PutSoldierInVehicle(pSoldier, iVehicleID);
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[18], zVehicleName[pVehicleList[iVehicleID].ubVehicleType]);
    }

    fShowAssignmentMenu = false;

    // update mapscreen
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fMapScreenBottomDirty = true;

    giAssignHighLine = -1;

    SetAssignmentForList(Enum117.VEHICLE, iVehicleID);
  }
}

function VehicleMenuMvtCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for assignment region
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (iValue != Enum115.VEHICLE_MENU_CANCEL) {
      // no shaded(disabled) lines actually appear in vehicle menus
      if (GetBoxShadeFlag(ghVehicleBox, iValue) == false) {
        // highlight vehicle line
        HighLightBoxLine(ghVehicleBox, iValue);
      }
    } else {
      // highlight cancel line
      HighLightBoxLine(ghVehicleBox, GetNumberOfLinesOfTextInBox(ghVehicleBox) - 1);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghVehicleBox);

    HandleShadingOfLinesForVehicleMenu();
  }
}

function DisplayRepairMenu(pSoldier: SOLDIERTYPE): boolean {
  let iVehicleIndex: INT32 = 0;
  let hStringHandle: INT32 = 0;

  // run through list of vehicles in sector and add them to pop up box
  // first, clear pop up box
  RemoveBox(ghRepairBox);
  ghRepairBox = -1;

  CreateRepairBox();
  SetCurrentBox(ghRepairBox);

  // PLEASE NOTE: make sure any changes you do here are reflected in all 3 routines which must remain in synch:
  // CreateDestroyMouseRegionForRepairMenu(), DisplayRepairMenu(), and HandleShadingOfLinesForRepairMenu().

  if (pSoldier.bSectorZ == 0) {
    // run through list of vehicles and see if any in sector
    for (iVehicleIndex = 0; iVehicleIndex < ubNumberOfVehicles; iVehicleIndex++) {
      if (pVehicleList[iVehicleIndex].fValid == true) {
        // don't even list the helicopter, because it's NEVER repairable...
        if (iVehicleIndex != iHelicopterVehicleId) {
          if (IsThisVehicleAccessibleToSoldier(pSoldier, iVehicleIndex)) {
            hStringHandle = AddMonoString(pVehicleStrings[pVehicleList[iVehicleIndex].ubVehicleType]);
          }
        }
      }
    }
  }

  /* No point in allowing SAM site repair any more.  Jan/13/99.  ARM
          // is there a SAM SITE Here?
          if( ( IsThisSectorASAMSector( pSoldier->sSectorX, pSoldier->sSectorY, pSoldier->bSectorZ ) == TRUE ) && ( IsTheSAMSiteInSectorRepairable( pSoldier->sSectorX, pSoldier->sSectorY, pSoldier->bSectorZ ) ) )
          {
                  // SAM site
                  AddMonoString(&hStringHandle, pRepairStrings[ 1 ] );
          }
  */

  // is the ROBOT here?
  if (IsRobotInThisSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ)) {
    // robot
    hStringHandle = AddMonoString(pRepairStrings[3]);
  }

  // items
  hStringHandle = AddMonoString(pRepairStrings[0]);

  // cancel
  hStringHandle = AddMonoString(pRepairStrings[2]);

  SetBoxFont(ghRepairBox, MAP_SCREEN_FONT());
  SetBoxHighLight(ghRepairBox, FONT_WHITE);
  SetBoxShade(ghRepairBox, FONT_GRAY7);
  SetBoxForeground(ghRepairBox, FONT_LTGREEN);
  SetBoxBackground(ghRepairBox, FONT_BLACK);

  // resize box to text
  ResizeBoxToText(ghRepairBox);

  CheckAndUpdateTacticalAssignmentPopUpPositions();

  return true;
}

function HandleShadingOfLinesForRepairMenu(): void {
  let pSoldier: SOLDIERTYPE;
  let iVehicleIndex: INT32 = 0;
  let iCount: INT32 = 0;

  if ((fShowRepairMenu == false) || (ghRepairBox == -1)) {
    return;
  }

  pSoldier = GetSelectedAssignSoldier(false);

  // PLEASE NOTE: make sure any changes you do here are reflected in all 3 routines which must remain in synch:
  // CreateDestroyMouseRegionForRepairMenu(), DisplayRepairMenu(), and HandleShadingOfLinesForRepairMenu().

  if (pSoldier.bSectorZ == 0) {
    for (iVehicleIndex = 0; iVehicleIndex < ubNumberOfVehicles; iVehicleIndex++) {
      if (pVehicleList[iVehicleIndex].fValid == true) {
        // don't even list the helicopter, because it's NEVER repairable...
        if (iVehicleIndex != iHelicopterVehicleId) {
          if (IsThisVehicleAccessibleToSoldier(pSoldier, iVehicleIndex)) {
            if (CanCharacterRepairVehicle(pSoldier, iVehicleIndex) == true) {
              // unshade vehicle line
              UnShadeStringInBox(ghRepairBox, iCount);
            } else {
              // shade vehicle line
              ShadeStringInBox(ghRepairBox, iCount);
            }

            iCount++;
          }
        }
      }
    }
  }

  /* No point in allowing SAM site repair any more.  Jan/13/99.  ARM
          if( ( IsThisSectorASAMSector( pSoldier -> sSectorX, pSoldier -> sSectorY, pSoldier -> bSectorZ ) == TRUE ) && ( IsTheSAMSiteInSectorRepairable( pSoldier -> sSectorX, pSoldier -> sSectorY, pSoldier -> bSectorZ ) ) )
          {
                  // handle enable disable of repair sam option
                  if( CanSoldierRepairSAM( pSoldier, SAM_SITE_REPAIR_DIVISOR ) )
                  {
                          // unshade SAM line
                          UnShadeStringInBox( ghRepairBox, iCount );
                  }
                  else
                  {
                          // shade SAM line
                          ShadeStringInBox( ghRepairBox, iCount );
                  }

                  iCount++;
          }
  */

  if (IsRobotInThisSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ)) {
    // handle shading of repair robot option
    if (CanCharacterRepairRobot(pSoldier)) {
      // unshade robot line
      UnShadeStringInBox(ghRepairBox, iCount);
    } else {
      // shade robot line
      ShadeStringInBox(ghRepairBox, iCount);
    }

    iCount++;
  }

  if (DoesCharacterHaveAnyItemsToRepair(pSoldier, FINAL_REPAIR_PASS)) {
    // unshade items line
    UnShadeStringInBox(ghRepairBox, iCount);
  } else {
    // shade items line
    ShadeStringInBox(ghRepairBox, iCount);
  }

  iCount++;

  return;
}

/* static */ let CreateDestroyMouseRegionForRepairMenu__fCreated: boolean = false;
function CreateDestroyMouseRegionForRepairMenu(): void {
  let uiCounter: UINT32 = 0;
  let iCount: INT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();
  let pSoldier: SOLDIERTYPE;
  let iVehicleIndex: INT32 = 0;

  if ((fShowRepairMenu == true) && (CreateDestroyMouseRegionForRepairMenu__fCreated == false)) {
    CheckAndUpdateTacticalAssignmentPopUpPositions();

    if ((fShowRepairMenu) && (guiCurrentScreen == Enum26.MAP_SCREEN)) {
      // SetBoxPosition( ghRepairBox ,RepairPosition);
    }

    // grab height of font
    iFontHeight = GetLineSpace(ghRepairBox) + GetFontHeight(GetBoxFont(ghRepairBox));

    // get x.y position of box
    GetBoxPosition(ghRepairBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghRepairBox, pDimensions);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghRepairBox);

    pSoldier = GetSelectedAssignSoldier(false);

    // PLEASE NOTE: make sure any changes you do here are reflected in all 3 routines which must remain in synch:
    // CreateDestroyMouseRegionForRepairMenu(), DisplayRepairMenu(), and HandleShadingOfLinesForRepairMenu().

    if (pSoldier.bSectorZ == 0) {
      // vehicles
      for (iVehicleIndex = 0; iVehicleIndex < ubNumberOfVehicles; iVehicleIndex++) {
        if (pVehicleList[iVehicleIndex].fValid == true) {
          // don't even list the helicopter, because it's NEVER repairable...
          if (iVehicleIndex != iHelicopterVehicleId) {
            // other vehicles *in the sector* are listed, but later shaded dark if they're not repairable
            if (IsThisVehicleAccessibleToSoldier(pSoldier, iVehicleIndex)) {
              // add mouse region for each line of text..and set user data
              MSYS_DefineRegion(gRepairMenuRegion[iCount], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*iCount), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (iCount + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, RepairMenuMvtCallback, RepairMenuBtnCallback);

              MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 0, iCount);
              // 2nd user data is the vehicle index, which can easily be different from the region index!
              MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 1, iVehicleIndex);
              iCount++;
            }
          }
        }
      }
    }

    /* No point in allowing SAM site repair any more.  Jan/13/99.  ARM
                    // SAM site
                    if( ( IsThisSectorASAMSector( pSoldier -> sSectorX, pSoldier -> sSectorY, pSoldier -> bSectorZ ) == TRUE ) && ( IsTheSAMSiteInSectorRepairable( pSoldier -> sSectorX, pSoldier -> sSectorY, pSoldier -> bSectorZ ) ) )
                    {
                            MSYS_DefineRegion( &gRepairMenuRegion[ iCount ], 	( INT16 )( iBoxXPosition ), ( INT16 )( iBoxYPosition + GetTopMarginSize( ghAssignmentBox ) + ( iFontHeight ) * iCount ), ( INT16 )( iBoxXPosition + iBoxWidth ), ( INT16 )( iBoxYPosition + GetTopMarginSize( ghAssignmentBox ) + ( iFontHeight ) * ( iCount + 1 ) ), MSYS_PRIORITY_HIGHEST - 4 ,
                                                                     MSYS_NO_CURSOR, RepairMenuMvtCallback, RepairMenuBtnCallback );

                            MSYS_SetRegionUserData( &gRepairMenuRegion[ iCount ], 0, REPAIR_MENU_SAM_SITE );
                            iCount++;
                    }
    */

    // robot
    if (IsRobotInThisSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ)) {
      MSYS_DefineRegion(gRepairMenuRegion[iCount], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*iCount), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (iCount + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, RepairMenuMvtCallback, RepairMenuBtnCallback);

      MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 0, iCount);
      MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 1, Enum114.REPAIR_MENU_ROBOT);
      iCount++;
    }

    // items
    MSYS_DefineRegion(gRepairMenuRegion[iCount], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*iCount), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (iCount + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, RepairMenuMvtCallback, RepairMenuBtnCallback);

    MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 0, iCount);
    MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 1, Enum114.REPAIR_MENU_ITEMS);
    iCount++;

    // cancel
    MSYS_DefineRegion(gRepairMenuRegion[iCount], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*iCount), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (iCount + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, RepairMenuMvtCallback, RepairMenuBtnCallback);

    MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 0, iCount);
    MSYS_SetRegionUserData(gRepairMenuRegion[iCount], 1, Enum114.REPAIR_MENU_CANCEL);

    PauseGame();

    // unhighlight all strings in box
    UnHighLightBox(ghRepairBox);

    CreateDestroyMouseRegionForRepairMenu__fCreated = true;
  } else if (((fShowRepairMenu == false) || (fShowAssignmentMenu == false)) && (CreateDestroyMouseRegionForRepairMenu__fCreated == true)) {
    CreateDestroyMouseRegionForRepairMenu__fCreated = false;

    // remove these regions
    for (uiCounter = 0; uiCounter < GetNumberOfLinesOfTextInBox(ghRepairBox); uiCounter++) {
      MSYS_RemoveRegion(gRepairMenuRegion[uiCounter]);
    }

    fShowRepairMenu = false;

    SetRenderFlags(RENDER_FLAG_FULL);

    HideBox(ghRepairBox);

    if (fShowAssignmentMenu) {
      // remove highlight on the parent menu
      UnHighLightBox(ghAssignmentBox);
    }
  }

  return;
}

function RepairMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment region
  let iValue: INT32 = -1;
  let pSoldier: SOLDIERTYPE;
  let iRepairWhat: INT32;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  // ignore clicks on disabled lines
  if (GetBoxShadeFlag(ghRepairBox, iValue) == true) {
    return;
  }

  // WHAT is being repaired is stored in the second user data argument
  iRepairWhat = MSYS_GetRegionUserData(pRegion, 1);

  pSoldier = GetSelectedAssignSoldier(false);

  if (pSoldier && pSoldier.bActive && (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if ((iRepairWhat >= Enum114.REPAIR_MENU_VEHICLE1) && (iRepairWhat <= Enum114.REPAIR_MENU_VEHICLE3)) {
      // repair VEHICLE

      pSoldier.bOldAssignment = pSoldier.bAssignment;

      if ((pSoldier.bAssignment != Enum117.REPAIR) || (pSoldier.fFixingRobot) || (pSoldier.fFixingSAMSite)) {
        SetTimeOfAssignmentChangeForMerc(pSoldier);
      }

      if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
        TakeSoldierOutOfVehicle(pSoldier);
      }

      // remove from squad
      RemoveCharacterFromSquads(pSoldier);
      MakeSureToolKitIsInHand(pSoldier);

      ChangeSoldiersAssignment(pSoldier, Enum117.REPAIR);

      pSoldier.bVehicleUnderRepairID = iRepairWhat;

      MakeSureToolKitIsInHand(pSoldier);

      // assign to a movement group
      AssignMercToAMovementGroup(pSoldier);

      // set assignment for group
      SetAssignmentForList(Enum117.REPAIR, 0);
      fShowAssignmentMenu = false;
    }
    /* No point in allowing SAM site repair any more.  Jan/13/99.  ARM
                    else if( iRepairWhat == REPAIR_MENU_SAM_SITE )
                    {
                            // repair SAM site

                            // remove from squad
                            RemoveCharacterFromSquads( pSoldier );
                            MakeSureToolKitIsInHand( pSoldier );

                            if( ( pSoldier->bAssignment != REPAIR )|| ( pSoldier -> fFixingSAMSite == FALSE ) )
                            {
                                    SetTimeOfAssignmentChangeForMerc( pSoldier );
                            }

                            ChangeSoldiersAssignment( pSoldier, REPAIR );
                            pSoldier -> fFixingSAMSite = TRUE;

                            // the second argument is irrelevant here, function looks at pSoldier itself to know what's being repaired
                            SetAssignmentForList( ( INT8 ) REPAIR, 0 );
                            fShowAssignmentMenu = FALSE;

                            MakeSureToolKitIsInHand( pSoldier );

                            // assign to a movement group
                            AssignMercToAMovementGroup( pSoldier );
                    }
    */
    else if (iRepairWhat == Enum114.REPAIR_MENU_ROBOT) {
      // repair ROBOT
      pSoldier.bOldAssignment = pSoldier.bAssignment;

      // remove from squad
      if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
        TakeSoldierOutOfVehicle(pSoldier);
      }

      RemoveCharacterFromSquads(pSoldier);
      MakeSureToolKitIsInHand(pSoldier);

      if ((pSoldier.bAssignment != Enum117.REPAIR) || (pSoldier.fFixingRobot == false)) {
        SetTimeOfAssignmentChangeForMerc(pSoldier);
      }

      ChangeSoldiersAssignment(pSoldier, Enum117.REPAIR);
      pSoldier.fFixingRobot = true;

      // the second argument is irrelevant here, function looks at pSoldier itself to know what's being repaired
      SetAssignmentForList(Enum117.REPAIR, 0);
      fShowAssignmentMenu = false;

      MakeSureToolKitIsInHand(pSoldier);

      // assign to a movement group
      AssignMercToAMovementGroup(pSoldier);
    } else if (iRepairWhat == Enum114.REPAIR_MENU_ITEMS) {
      // items
      SetSoldierAssignment(pSoldier, Enum117.REPAIR, 0, 0, -1);

      // the second argument is irrelevant here, function looks at pSoldier itself to know what's being repaired
      SetAssignmentForList(Enum117.REPAIR, 0);
      fShowAssignmentMenu = false;
    } else {
      // CANCEL
      fShowRepairMenu = false;
    }

    // update mapscreen
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;

    giAssignHighLine = -1;
  }
}

function RepairMenuMvtCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for assignment region
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (iValue < Enum114.REPAIR_MENU_CANCEL) {
      if (GetBoxShadeFlag(ghRepairBox, iValue) == false) {
        // highlight choice
        HighLightBoxLine(ghRepairBox, iValue);
      }
    } else {
      // highlight cancel line
      HighLightBoxLine(ghRepairBox, GetNumberOfLinesOfTextInBox(ghRepairBox) - 1);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghRepairBox);
  }
}

function MakeSureToolKitIsInHand(pSoldier: SOLDIERTYPE): void {
  let bPocket: INT8 = 0;

  // if there isn't a toolkit in his hand
  if (pSoldier.inv[Enum261.HANDPOS].usItem != Enum225.TOOLKIT) {
    // run through rest of inventory looking for toolkits, swap the first one into hand if found
    for (bPocket = Enum261.SECONDHANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
      if (pSoldier.inv[bPocket].usItem == Enum225.TOOLKIT) {
        SwapObjs(pSoldier.inv[Enum261.HANDPOS], pSoldier.inv[bPocket]);
        break;
      }
    }
  }
}

function MakeSureMedKitIsInHand(pSoldier: SOLDIERTYPE): boolean {
  let bPocket: INT8 = 0;
  let fFoundOne: boolean = false;

  fTeamPanelDirty = true;

  // if there is a MEDICAL BAG in his hand, we're set
  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.MEDICKIT) {
    return true;
  }

  // run through rest of inventory looking 1st for MEDICAL BAGS, swap the first one into hand if found
  for (bPocket = Enum261.SECONDHANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
    if (pSoldier.inv[bPocket].usItem == Enum225.MEDICKIT) {
      fCharacterInfoPanelDirty = true;
      SwapObjs(pSoldier.inv[Enum261.HANDPOS], pSoldier.inv[bPocket]);
      return true;
    }
  }

  // we didn't find a medical bag, so settle for a FIRST AID KIT
  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.FIRSTAIDKIT) {
    return true;
  }

  // run through rest of inventory looking 1st for MEDICAL BAGS, swap the first one into hand if found
  for (bPocket = Enum261.SECONDHANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
    if (pSoldier.inv[bPocket].usItem == Enum225.FIRSTAIDKIT) {
      if ((Item[pSoldier.inv[Enum261.HANDPOS].usItem].fFlags & IF_TWOHANDED_GUN) && (bPocket >= Enum261.SMALLPOCK1POS)) {
        // first move from hand to second hand
        SwapObjs(pSoldier.inv[Enum261.HANDPOS], pSoldier.inv[Enum261.SECONDHANDPOS]);

        // dirty mapscreen and squad panels
        fCharacterInfoPanelDirty = true;
        fInterfacePanelDirty = DIRTYLEVEL2;
      }

      SwapObjs(pSoldier.inv[Enum261.HANDPOS], pSoldier.inv[bPocket]);

      return true;
    }
  }

  // no medkit items in possession!
  return false;
}

export function HandleShadingOfLinesForAssignmentMenus(): void {
  let pSoldier: SOLDIERTYPE;

  // updates which menus are selectable based on character status

  if ((fShowAssignmentMenu == false) || (ghAssignmentBox == -1)) {
    return;
  }

  pSoldier = GetSelectedAssignSoldier(false);

  if (pSoldier && pSoldier.bActive) {
    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      // patient
      if (CanCharacterPatient(pSoldier)) {
        // unshade patient line
        UnShadeStringInBox(ghEpcBox, Enum147.EPC_MENU_PATIENT);
      } else {
        // shade patient line
        ShadeStringInBox(ghEpcBox, Enum147.EPC_MENU_PATIENT);
      }

      if (CanCharacterOnDuty(pSoldier)) {
        // unshade on duty line
        UnShadeStringInBox(ghEpcBox, Enum147.EPC_MENU_ON_DUTY);
      } else {
        // shade on duty line
        ShadeStringInBox(ghEpcBox, Enum147.EPC_MENU_ON_DUTY);
      }

      if (CanCharacterVehicle(pSoldier)) {
        // unshade vehicle line
        UnShadeStringInBox(ghEpcBox, Enum147.EPC_MENU_VEHICLE);
      } else {
        // shade vehicle line
        ShadeStringInBox(ghEpcBox, Enum147.EPC_MENU_VEHICLE);
      }
    } else {
      // doctor
      if (CanCharacterDoctor(pSoldier)) {
        // unshade doctor line
        UnShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_DOCTOR);
        UnSecondaryShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_DOCTOR);
      } else {
        // only missing a med kit
        if (CanCharacterDoctorButDoesntHaveMedKit(pSoldier)) {
          SecondaryShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_DOCTOR);
        } else {
          // shade doctor line
          ShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_DOCTOR);
        }
      }

      // repair
      if (CanCharacterRepair(pSoldier)) {
        // unshade repair line
        UnShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_REPAIR);
        UnSecondaryShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_REPAIR);
      } else {
        // only missing a tool kit
        if (CanCharacterRepairButDoesntHaveARepairkit(pSoldier)) {
          SecondaryShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_REPAIR);
        } else {
          // shade repair line
          ShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_REPAIR);
        }
      }

      // patient
      if (CanCharacterPatient(pSoldier)) {
        // unshade patient line
        UnShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_PATIENT);
      } else {
        // shade patient line
        ShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_PATIENT);
      }

      if (CanCharacterOnDuty(pSoldier)) {
        // unshade on duty line
        UnShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_ON_DUTY);
      } else {
        // shade on duty line
        ShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_ON_DUTY);
      }

      if (CanCharacterPractise(pSoldier)) {
        // unshade train line
        UnShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_TRAIN);
      } else {
        // shade train line
        ShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_TRAIN);
      }

      if (CanCharacterVehicle(pSoldier)) {
        // unshade vehicle line
        UnShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_VEHICLE);
      } else {
        // shade vehicle line
        ShadeStringInBox(ghAssignmentBox, Enum148.ASSIGN_MENU_VEHICLE);
      }
    }
  }

  // squad submenu
  HandleShadingOfLinesForSquadMenu();

  // vehicle submenu
  HandleShadingOfLinesForVehicleMenu();

  // repair submenu
  HandleShadingOfLinesForRepairMenu();

  // training submenu
  HandleShadingOfLinesForTrainingMenu();

  // training attributes submenu
  HandleShadingOfLinesForAttributeMenus();

  return;
}

export function DetermineWhichAssignmentMenusCanBeShown(): void {
  let fCharacterNoLongerValid: boolean = false;
  let pSoldier: SOLDIERTYPE;

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    if (fShowMapScreenMovementList == true) {
      if (bSelectedDestChar == -1) {
        fCharacterNoLongerValid = true;
        HandleShowingOfMovementBox();
      } else {
        fShowMapScreenMovementList = false;
        fCharacterNoLongerValid = true;
      }
    }
    /*
                    else if( fShowUpdateBox )
                    {
                            //handle showing of the merc update box
                            HandleShowingOfUpBox( );
                    }
    */
    else if (bSelectedAssignChar == -1) {
      fCharacterNoLongerValid = true;
    }

    // update the assignment positions
    UpdateMapScreenAssignmentPositions();
  }

  // determine which assign menu needs to be shown
  if (((fShowAssignmentMenu == false)) || (fCharacterNoLongerValid == true)) {
    // reset show assignment menus
    fShowAssignmentMenu = false;
    fShowVehicleMenu = false;
    fShowRepairMenu = false;

    // destroy mask, if needed
    CreateDestroyScreenMaskForAssignmentAndContractMenus();

    // destroy menu if needed
    CreateDestroyMouseRegionForVehicleMenu();
    CreateDestroyMouseRegionsForAssignmentMenu();
    CreateDestroyMouseRegionsForTrainingMenu();
    CreateDestroyMouseRegionsForAttributeMenu();
    CreateDestroyMouseRegionsForSquadMenu(true);
    CreateDestroyMouseRegionForRepairMenu();

    // hide all boxes being shown
    if (IsBoxShown(ghEpcBox)) {
      HideBox(ghEpcBox);
      fTeamPanelDirty = true;
      gfRenderPBInterface = true;
    }
    if (IsBoxShown(ghAssignmentBox)) {
      HideBox(ghAssignmentBox);
      fTeamPanelDirty = true;
      gfRenderPBInterface = true;
    }
    if (IsBoxShown(ghTrainingBox)) {
      HideBox(ghTrainingBox);
      fTeamPanelDirty = true;
      gfRenderPBInterface = true;
    }
    if (IsBoxShown(ghRepairBox)) {
      HideBox(ghRepairBox);
      fTeamPanelDirty = true;
      gfRenderPBInterface = true;
    }
    if (IsBoxShown(ghAttributeBox)) {
      HideBox(ghAttributeBox);
      fTeamPanelDirty = true;
      gfRenderPBInterface = true;
    }
    if (IsBoxShown(ghVehicleBox)) {
      HideBox(ghVehicleBox);
      fTeamPanelDirty = true;
      gfRenderPBInterface = true;
    }

    // do we really want ot hide this box?
    if (fShowContractMenu == false) {
      if (IsBoxShown(ghRemoveMercAssignBox)) {
        HideBox(ghRemoveMercAssignBox);
        fTeamPanelDirty = true;
        gfRenderPBInterface = true;
      }
    }
    // HideBox( ghSquadBox );

    // SetRenderFlags(RENDER_FLAG_FULL);

    // no menus, leave
    return;
  }

  // update the assignment positions
  UpdateMapScreenAssignmentPositions();

  // create mask, if needed
  CreateDestroyScreenMaskForAssignmentAndContractMenus();

  // created assignment menu if needed
  CreateDestroyMouseRegionsForAssignmentMenu();
  CreateDestroyMouseRegionsForTrainingMenu();
  CreateDestroyMouseRegionsForAttributeMenu();
  CreateDestroyMouseRegionsForSquadMenu(true);
  CreateDestroyMouseRegionForRepairMenu();

  if (((Menptr[gCharactersList[bSelectedInfoChar].usSolID].bLife == 0) || (Menptr[gCharactersList[bSelectedInfoChar].usSolID].bAssignment == Enum117.ASSIGNMENT_POW)) && ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN))) {
    // show basic assignment menu
    ShowBox(ghRemoveMercAssignBox);
  } else {
    pSoldier = GetSelectedAssignSoldier(false);

    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      ShowBox(ghEpcBox);
    } else {
      // show basic assignment menu

      ShowBox(ghAssignmentBox);
    }
  }

  // TRAINING menu
  if (fShowTrainingMenu == true) {
    HandleShadingOfLinesForTrainingMenu();
    ShowBox(ghTrainingBox);
  } else {
    if (IsBoxShown(ghTrainingBox)) {
      HideBox(ghTrainingBox);
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      gfRenderPBInterface = true;
      //	SetRenderFlags(RENDER_FLAG_FULL);
    }
  }

  // REPAIR menu
  if (fShowRepairMenu == true) {
    HandleShadingOfLinesForRepairMenu();
    ShowBox(ghRepairBox);
  } else {
    // hide box
    if (IsBoxShown(ghRepairBox)) {
      HideBox(ghRepairBox);
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      gfRenderPBInterface = true;
      //	SetRenderFlags(RENDER_FLAG_FULL);
    }
  }

  // ATTRIBUTE menu
  if (fShowAttributeMenu == true) {
    HandleShadingOfLinesForAttributeMenus();
    ShowBox(ghAttributeBox);
  } else {
    if (IsBoxShown(ghAttributeBox)) {
      HideBox(ghAttributeBox);
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      gfRenderPBInterface = true;
      //	SetRenderFlags(RENDER_FLAG_FULL);
    }
  }

  // VEHICLE menu
  if (fShowVehicleMenu == true) {
    ShowBox(ghVehicleBox);
  } else {
    if (IsBoxShown(ghVehicleBox)) {
      HideBox(ghVehicleBox);
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      gfRenderPBInterface = true;
      //	SetRenderFlags(RENDER_FLAG_FULL);
    }
  }

  CreateDestroyMouseRegionForVehicleMenu();

  return;
}

/* static */ let CreateDestroyScreenMaskForAssignmentAndContractMenus__fCreated: boolean = false;
export function CreateDestroyScreenMaskForAssignmentAndContractMenus(): void {
  // will create a screen mask to catch mouse input to disable assignment menus

  // not created, create
  if ((CreateDestroyScreenMaskForAssignmentAndContractMenus__fCreated == false) && ((fShowAssignmentMenu == true) || (fShowContractMenu == true) || (fShowTownInfo == true))) {
    MSYS_DefineRegion(gAssignmentScreenMaskRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, AssignmentScreenMaskBtnCallback);

    // created
    CreateDestroyScreenMaskForAssignmentAndContractMenus__fCreated = true;

    if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
      MSYS_ChangeRegionCursor(gAssignmentScreenMaskRegion, 0);
    }
  } else if ((CreateDestroyScreenMaskForAssignmentAndContractMenus__fCreated == true) && (fShowAssignmentMenu == false) && (fShowContractMenu == false) && (fShowTownInfo == false)) {
    // created, get rid of it
    MSYS_RemoveRegion(gAssignmentScreenMaskRegion);

    // not created
    CreateDestroyScreenMaskForAssignmentAndContractMenus__fCreated = false;
  }

  return;
}

function AssignmentScreenMaskBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment screen mask region

  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) || (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP)) {
    if (fFirstClickInAssignmentScreenMask == true) {
      fFirstClickInAssignmentScreenMask = false;
      return;
    }

    // button event, stop showing menus
    fShowAssignmentMenu = false;

    fShowVehicleMenu = false;

    fShowContractMenu = false;

    // stop showing town mine info
    fShowTownInfo = false;

    // reset contract character and contract highlight line
    giContractHighLine = -1;
    bSelectedContractChar = -1;
    fGlowContractRegion = false;

    // update mapscreen
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fMapScreenBottomDirty = true;

    gfRenderPBInterface = true;
    SetRenderFlags(RENDER_FLAG_FULL);
  }
  return;
}

export function ClearScreenMaskForMapScreenExit(): void {
  // reset show assignment menu
  fShowAssignmentMenu = false;

  // update the assignment positions
  UpdateMapScreenAssignmentPositions();

  // stop showing town mine info too
  fShowTownInfo = false;

  // destroy mask, if needed
  CreateDestroyScreenMaskForAssignmentAndContractMenus();

  // destroy assignment menu if needed
  CreateDestroyMouseRegionsForAssignmentMenu();
  CreateDestroyMouseRegionsForTrainingMenu();
  CreateDestroyMouseRegionsForAttributeMenu();
  CreateDestroyMouseRegionsForSquadMenu(true);
  CreateDestroyMouseRegionForRepairMenu();

  return;
}

/* static */ let CreateDestroyMouseRegions__fCreated: boolean = false;
function CreateDestroyMouseRegions(): void {
  let iCounter: UINT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();

  // will create/destroy mouse regions for the map screen assignment main menu

  // do we show the remove menu
  if (fShowRemoveMenu) {
    CreateDestroyMouseRegionsForRemoveMenu();
    return;
  }

  if ((fShowAssignmentMenu == true) && (CreateDestroyMouseRegions__fCreated == false)) {
    // grab height of font
    iFontHeight = GetLineSpace(ghAssignmentBox) + GetFontHeight(GetBoxFont(ghAssignmentBox));

    // get x.y position of box
    GetBoxPosition(ghAssignmentBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghAssignmentBox, pDimensions);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghAssignmentBox);

    // define regions
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghAssignmentBox); iCounter++) {
      // add mouse region for each line of text..and set user data

      MSYS_DefineRegion(gAssignmentMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAssignmentBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, AssignmentMenuMvtCallBack, AssignmentMenuBtnCallback);

      // set user defines
      MSYS_SetRegionUserData(gAssignmentMenuRegion[iCounter], 0, iCounter);
    }

    // created
    CreateDestroyMouseRegions__fCreated = true;

    // pause game
    PauseGame();

    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;

    // unhighlight all strings in box
    UnHighLightBox(ghAssignmentBox);
  } else if ((fShowAssignmentMenu == false) && (CreateDestroyMouseRegions__fCreated == true)) {
    // destroy
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghAssignmentBox); iCounter++) {
      MSYS_RemoveRegion(gAssignmentMenuRegion[iCounter]);
    }

    RestorePopUpBoxes();

    // not created
    CreateDestroyMouseRegions__fCreated = false;
  }
}

/* static */ let CreateDestroyMouseRegionsForContractMenu__fCreated: boolean = false;
/* static */ let CreateDestroyMouseRegionsForContractMenu__fShowRemoveMenu: boolean = false;
export function CreateDestroyMouseRegionsForContractMenu(): void {
  let iCounter: UINT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();

  // will create/destroy mouse regions for the map screen Contract main menu
  // will create/destroy mouse regions for the map screen assignment main menu
  // check if we can only remove character from team..not assign
  if ((bSelectedContractChar != -1) || (CreateDestroyMouseRegionsForContractMenu__fShowRemoveMenu == true)) {
    if (CreateDestroyMouseRegionsForContractMenu__fShowRemoveMenu == true) {
      // dead guy handle menu stuff
      CreateDestroyMouseRegionsForContractMenu__fShowRemoveMenu = fShowContractMenu;

      // ATE: Added this setting of global variable 'cause
      // it will cause an assert failure in GetSelectedAssignSoldier()
      bSelectedAssignChar = bSelectedContractChar;

      CreateDestroyMouseRegionsForRemoveMenu();

      return;
    }
    if (Menptr[gCharactersList[bSelectedContractChar].usSolID].bLife == 0) {
      // dead guy handle menu stuff
      CreateDestroyMouseRegionsForContractMenu__fShowRemoveMenu = fShowContractMenu;

      // ATE: Added this setting of global variable 'cause
      // it will cause an assert failure in GetSelectedAssignSoldier()
      bSelectedAssignChar = bSelectedContractChar;

      CreateDestroyMouseRegionsForRemoveMenu();

      return;
    }
  }

  if ((fShowContractMenu == true) && (CreateDestroyMouseRegionsForContractMenu__fCreated == false)) {
    if (bSelectedContractChar == -1) {
      return;
    }

    if (fShowContractMenu) {
      SetBoxPosition(ghContractBox, ContractPosition);
    }
    // grab height of font
    iFontHeight = GetLineSpace(ghContractBox) + GetFontHeight(GetBoxFont(ghContractBox));

    // get x.y position of box
    GetBoxPosition(ghContractBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghContractBox, pDimensions);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghContractBox);

    // define regions
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghContractBox); iCounter++) {
      // add mouse region for each line of text..and set user data

      MSYS_DefineRegion(gContractMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghContractBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghContractBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, ContractMenuMvtCallback, ContractMenuBtnCallback);

      // set user defines
      MSYS_SetRegionUserData(gContractMenuRegion[iCounter], 0, iCounter);
    }

    // created
    CreateDestroyMouseRegionsForContractMenu__fCreated = true;

    // pause game
    PauseGame();

    // unhighlight all strings in box
    UnHighLightBox(ghContractBox);
  } else if ((fShowContractMenu == false) && (CreateDestroyMouseRegionsForContractMenu__fCreated == true)) {
    // destroy
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghContractBox); iCounter++) {
      MSYS_RemoveRegion(gContractMenuRegion[iCounter]);
    }

    fShownContractMenu = false;
    // if( ( fProcessingAMerc ) && ( pProcessingSoldier ) )
    //{
    //	if( (UINT32)(pProcessingSoldier->iEndofContractTime) == GetWorldTotalMin() )
    //	{
    //		StrategicRemoveMerc( pProcessingSoldier, MERC_FIRED );
    //		pProcessingSoldier = NULL;
    //		fProcessingAMerc = FALSE;
    //	}
    //}

    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;

    RestorePopUpBoxes();

    // not created
    CreateDestroyMouseRegionsForContractMenu__fCreated = false;
  }
}

/* static */ let CreateDestroyMouseRegionsForTrainingMenu__fCreated: boolean = false;
function CreateDestroyMouseRegionsForTrainingMenu(): void {
  let iCounter: UINT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();

  // will create/destroy mouse regions for the map screen assignment main menu

  if ((fShowTrainingMenu == true) && (CreateDestroyMouseRegionsForTrainingMenu__fCreated == false)) {
    if ((fShowTrainingMenu) && (guiCurrentScreen == Enum26.MAP_SCREEN)) {
      SetBoxPosition(ghTrainingBox, TrainPosition);
    }

    HandleShadingOfLinesForTrainingMenu();

    CheckAndUpdateTacticalAssignmentPopUpPositions();

    // grab height of font
    iFontHeight = GetLineSpace(ghTrainingBox) + GetFontHeight(GetBoxFont(ghTrainingBox));

    // get x.y position of box
    GetBoxPosition(ghTrainingBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghTrainingBox, pDimensions);
    SetBoxSecondaryShade(ghTrainingBox, FONT_YELLOW);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghTrainingBox);

    // define regions
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghTrainingBox); iCounter++) {
      // add mouse region for each line of text..and set user data

      MSYS_DefineRegion(gTrainingMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghTrainingBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghTrainingBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CURSOR, TrainingMenuMvtCallBack, TrainingMenuBtnCallback);

      // set user defines
      MSYS_SetRegionUserData(gTrainingMenuRegion[iCounter], 0, iCounter);
    }

    // created
    CreateDestroyMouseRegionsForTrainingMenu__fCreated = true;

    // unhighlight all strings in box
    UnHighLightBox(ghTrainingBox);
  } else if (((fShowAssignmentMenu == false) || (fShowTrainingMenu == false)) && (CreateDestroyMouseRegionsForTrainingMenu__fCreated == true)) {
    // destroy
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghTrainingBox); iCounter++) {
      MSYS_RemoveRegion(gTrainingMenuRegion[iCounter]);
    }

    // stop showing training menu
    if (fShowAssignmentMenu == false) {
      fShowTrainingMenu = false;
    }

    RestorePopUpBoxes();

    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;
    HideBox(ghTrainingBox);
    SetRenderFlags(RENDER_FLAG_FULL);

    // not created
    CreateDestroyMouseRegionsForTrainingMenu__fCreated = false;

    if (fShowAssignmentMenu) {
      // remove highlight on the parent menu
      UnHighLightBox(ghAssignmentBox);
    }
  }
}

/* static */ let CreateDestroyMouseRegionsForAttributeMenu__fCreated: boolean = false;
function CreateDestroyMouseRegionsForAttributeMenu(): void {
  let iCounter: UINT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();

  // will create/destroy mouse regions for the map screen attribute  menu

  if ((fShowAttributeMenu == true) && (CreateDestroyMouseRegionsForAttributeMenu__fCreated == false)) {
    if ((fShowAssignmentMenu) && (guiCurrentScreen == Enum26.MAP_SCREEN)) {
      SetBoxPosition(ghAssignmentBox, AssignmentPosition);
    }

    HandleShadingOfLinesForAttributeMenus();
    CheckAndUpdateTacticalAssignmentPopUpPositions();

    // grab height of font
    iFontHeight = GetLineSpace(ghAttributeBox) + GetFontHeight(GetBoxFont(ghAttributeBox));

    // get x.y position of box
    GetBoxPosition(ghAttributeBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghAttributeBox, pDimensions);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghAttributeBox);

    // define regions
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghAttributeBox); iCounter++) {
      // add mouse region for each line of text..and set user data

      MSYS_DefineRegion(gAttributeMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAttributeBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAttributeBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 2, MSYS_NO_CURSOR, AttributeMenuMvtCallBack, AttributesMenuBtnCallback);

      // set user defines
      MSYS_SetRegionUserData(gAttributeMenuRegion[iCounter], 0, iCounter);
    }

    // created
    CreateDestroyMouseRegionsForAttributeMenu__fCreated = true;

    // unhighlight all strings in box
    UnHighLightBox(ghAttributeBox);
  } else if (((fShowAssignmentMenu == false) || (fShowTrainingMenu == false) || (fShowAttributeMenu == false)) && (CreateDestroyMouseRegionsForAttributeMenu__fCreated == true)) {
    // destroy
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghAttributeBox); iCounter++) {
      MSYS_RemoveRegion(gAttributeMenuRegion[iCounter]);
    }

    // stop showing training menu
    if ((fShowAssignmentMenu == false) || (fShowTrainingMenu == false) || (fShowAttributeMenu == false)) {
      fShowAttributeMenu = false;
      gfRenderPBInterface = true;
    }

    RestorePopUpBoxes();

    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;
    HideBox(ghAttributeBox);
    SetRenderFlags(RENDER_FLAG_FULL);

    // not created
    CreateDestroyMouseRegionsForAttributeMenu__fCreated = false;

    if (fShowTrainingMenu) {
      // remove highlight on the parent menu
      UnHighLightBox(ghTrainingBox);
    }
  }
}

/* static */ let CreateDestroyMouseRegionsForRemoveMenu__fCreated: boolean = false;
function CreateDestroyMouseRegionsForRemoveMenu(): void {
  let iCounter: UINT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();

  // will create/destroy mouse regions for the map screen attribute  menu
  if (((fShowAssignmentMenu == true) || (fShowContractMenu == true)) && (CreateDestroyMouseRegionsForRemoveMenu__fCreated == false)) {
    if (fShowContractMenu) {
      SetBoxPosition(ghContractBox, ContractPosition);
    } else {
      SetBoxPosition(ghAssignmentBox, AssignmentPosition);
    }

    if (fShowContractMenu) {
      // set box position to contract box position
      SetBoxPosition(ghRemoveMercAssignBox, ContractPosition);
    } else {
      // set box position to contract box position
      SetBoxPosition(ghRemoveMercAssignBox, AssignmentPosition);
    }

    CheckAndUpdateTacticalAssignmentPopUpPositions();

    // grab height of font
    iFontHeight = GetLineSpace(ghRemoveMercAssignBox) + GetFontHeight(GetBoxFont(ghRemoveMercAssignBox));

    // get x.y position of box
    GetBoxPosition(ghRemoveMercAssignBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghRemoveMercAssignBox, pDimensions);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghRemoveMercAssignBox);

    // define regions
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghRemoveMercAssignBox); iCounter++) {
      // add mouse region for each line of text..and set user data

      MSYS_DefineRegion(gRemoveMercAssignRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghAttributeBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghAttributeBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 2, MSYS_NO_CURSOR, RemoveMercMenuMvtCallBack, RemoveMercMenuBtnCallback);

      // set user defines
      MSYS_SetRegionUserData(gRemoveMercAssignRegion[iCounter], 0, iCounter);
    }

    // created
    CreateDestroyMouseRegionsForRemoveMenu__fCreated = true;

    // unhighlight all strings in box
    UnHighLightBox(ghRemoveMercAssignBox);
  } else if ((fShowAssignmentMenu == false) && (CreateDestroyMouseRegionsForRemoveMenu__fCreated == true) && (fShowContractMenu == false)) {
    // destroy
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghRemoveMercAssignBox); iCounter++) {
      MSYS_RemoveRegion(gRemoveMercAssignRegion[iCounter]);
    }

    fShownContractMenu = false;

    // stop showing  menu
    if (fShowRemoveMenu == false) {
      fShowAttributeMenu = false;
      fMapPanelDirty = true;
      gfRenderPBInterface = true;
    }

    RestorePopUpBoxes();

    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;

    // turn off the GLOBAL fShowRemoveMenu flag!!!
    fShowRemoveMenu = false;
    // and the assignment menu itself!!!
    fShowAssignmentMenu = false;

    // not created
    CreateDestroyMouseRegionsForRemoveMenu__fCreated = false;
  }
}

/* static */ let CreateDestroyMouseRegionsForSquadMenu__fCreated: boolean = false;
function CreateDestroyMouseRegionsForSquadMenu(fPositionBox: boolean): void {
  let iCounter: UINT32 = 0;
  let iFontHeight: INT32 = 0;
  let iBoxXPosition: INT32 = 0;
  let iBoxYPosition: INT32 = 0;
  let pPosition: SGPPoint = createSGPPoint();
  let iBoxWidth: INT32 = 0;
  let pDimensions: SGPRect = createSGPRect();

  // will create/destroy mouse regions for the map screen attribute  menu

  if ((fShowSquadMenu == true) && (CreateDestroyMouseRegionsForSquadMenu__fCreated == false)) {
    // create squad box
    CreateSquadBox();
    GetBoxSize(ghAssignmentBox, pDimensions);

    CheckAndUpdateTacticalAssignmentPopUpPositions();

    // grab height of font
    iFontHeight = GetLineSpace(ghSquadBox) + GetFontHeight(GetBoxFont(ghSquadBox));

    // get x.y position of box
    GetBoxPosition(ghSquadBox, pPosition);

    // grab box x and y position
    iBoxXPosition = pPosition.iX;
    iBoxYPosition = pPosition.iY;

    // get dimensions..mostly for width
    GetBoxSize(ghSquadBox, pDimensions);

    // get width
    iBoxWidth = pDimensions.iRight;

    SetCurrentBox(ghSquadBox);

    // define regions
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghSquadBox) - 1; iCounter++) {
      // add mouse region for each line of text..and set user data
      MSYS_DefineRegion(gSquadMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghSquadBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghSquadBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 2, MSYS_NO_CURSOR, SquadMenuMvtCallBack, SquadMenuBtnCallback);

      MSYS_SetRegionUserData(gSquadMenuRegion[iCounter], 0, iCounter);
    }

    // now create cancel region
    MSYS_DefineRegion(gSquadMenuRegion[iCounter], (iBoxXPosition), (iBoxYPosition + GetTopMarginSize(ghSquadBox) + (iFontHeight)*iCounter), (iBoxXPosition + iBoxWidth), (iBoxYPosition + GetTopMarginSize(ghSquadBox) + (iFontHeight) * (iCounter + 1)), MSYS_PRIORITY_HIGHEST - 2, MSYS_NO_CURSOR, SquadMenuMvtCallBack, SquadMenuBtnCallback);

    MSYS_SetRegionUserData(gSquadMenuRegion[iCounter], 0, Enum151.SQUAD_MENU_CANCEL);

    // created
    CreateDestroyMouseRegionsForSquadMenu__fCreated = true;

    // show the box
    ShowBox(ghSquadBox);

    // unhighlight all strings in box
    UnHighLightBox(ghSquadBox);

    // update based on current squad
    HandleShadingOfLinesForSquadMenu();
  } else if (((fShowAssignmentMenu == false) || (fShowSquadMenu == false)) && (CreateDestroyMouseRegionsForSquadMenu__fCreated == true)) {
    // destroy
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghSquadBox); iCounter++) {
      MSYS_RemoveRegion(gSquadMenuRegion[iCounter]);
    }

    fShowSquadMenu = false;

    // remove squad box
    RemoveBox(ghSquadBox);
    ghSquadBox = -1;

    RestorePopUpBoxes();

    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;
    SetRenderFlags(RENDER_FLAG_FULL);

    // not created
    CreateDestroyMouseRegionsForSquadMenu__fCreated = false;
    fMapPanelDirty = true;

    if (fShowAssignmentMenu) {
      // remove highlight on the parent menu
      UnHighLightBox(ghAssignmentBox);
    }
  }
}

function AssignmentMenuMvtCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for assignment region
  let iValue: INT32 = -1;
  let pSoldier: SOLDIERTYPE;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  pSoldier = GetSelectedAssignSoldier(false);

  if (HandleAssignmentExpansionAndHighLightForAssignMenu(pSoldier) == true) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // is the line shaded?..if so, don't highlight
    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      if (GetBoxShadeFlag(ghEpcBox, iValue) == false) {
        HighLightBoxLine(ghEpcBox, iValue);
      }
    } else {
      if (GetBoxShadeFlag(ghAssignmentBox, iValue) == false) {
        HighLightBoxLine(ghAssignmentBox, iValue);
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      // unhighlight all strings in box
      UnHighLightBox(ghEpcBox);
    } else {
      // unhighlight all strings in box
      UnHighLightBox(ghAssignmentBox);
    }
  }
}

function RemoveMercMenuMvtCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for assignment region
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // highlight string

    // get the string line handle
    // is the line shaded?..if so, don't highlight
    if (GetBoxShadeFlag(ghRemoveMercAssignBox, iValue) == false) {
      HighLightBoxLine(ghRemoveMercAssignBox, iValue);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghRemoveMercAssignBox);
  }
}

function ContractMenuMvtCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for Contract region
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // highlight string

    if (iValue != Enum152.CONTRACT_MENU_CURRENT_FUNDS) {
      if (GetBoxShadeFlag(ghContractBox, iValue) == false) {
        // get the string line handle
        HighLightBoxLine(ghContractBox, iValue);
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghContractBox);
  }
}

function SquadMenuMvtCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for assignment region
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // highlight string

    if (iValue != Enum151.SQUAD_MENU_CANCEL) {
      if (GetBoxShadeFlag(ghSquadBox, iValue) == false) {
        // get the string line handle
        HighLightBoxLine(ghSquadBox, iValue);
      }
    } else {
      // highlight cancel line
      HighLightBoxLine(ghSquadBox, GetNumberOfLinesOfTextInBox(ghSquadBox) - 1);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghSquadBox);

    // update based on current squad
    HandleShadingOfLinesForSquadMenu();
  }
}

function RemoveMercMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for contract region
  let iValue: INT32 = -1;
  let pSoldier: SOLDIERTYPE;

  pSoldier = GetSelectedAssignSoldier(false);

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    switch (iValue) {
      case (Enum150.REMOVE_MERC_CANCEL):

        // stop showing menus
        fShowAssignmentMenu = false;
        fShowContractMenu = false;

        // reset characters
        bSelectedAssignChar = -1;
        bSelectedContractChar = -1;
        giAssignHighLine = -1;

        // dirty regions
        fCharacterInfoPanelDirty = true;
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;
        gfRenderPBInterface = true;

        // stop contratc glow if we are
        fGlowContractRegion = false;
        giContractHighLine = -1;

        break;
      case (Enum150.REMOVE_MERC):
        StrategicRemoveMerc(pSoldier);

        // dirty region
        fCharacterInfoPanelDirty = true;
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;
        gfRenderPBInterface = true;

        // stop contratc glow if we are
        fGlowContractRegion = false;
        giContractHighLine = -1;

        // reset selected characters
        bSelectedAssignChar = -1;
        bSelectedContractChar = -1;
        giAssignHighLine = -1;

        // stop showing menus
        fShowAssignmentMenu = false;
        fShowContractMenu = false;

        // Def: 10/13/99:  When a merc is either dead or a POW, the Remove Merc popup comes up instead of the
        // Assign menu popup.  When the the user removes the merc, we need to make sure the assignment menu
        // doesnt come up ( because the both assign menu and remove menu flags are needed for the remove pop up to appear
        // dont ask why?!! )
        fShownContractMenu = false;
        fShownAssignmentMenu = false;
        fShowRemoveMenu = false;

        break;
    }
  }
}

function BeginRemoveMercFromContract(pSoldier: SOLDIERTYPE): void {
  // This function will setup the quote, then start dialogue beginning the actual leave sequence
  if ((pSoldier.bLife > 0) && (pSoldier.bAssignment != Enum117.ASSIGNMENT_POW)) {
    if ((pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) || (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__NPC)) {
      HandleImportantMercQuote(pSoldier, Enum202.QUOTE_RESPONSE_TO_MIGUEL_SLASH_QUOTE_MERC_OR_RPC_LETGO);

      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING, 1, 0);
    } else
        // quote is different if he's fired in less than 48 hours
        if ((GetWorldTotalMin() - pSoldier.uiTimeOfLastContractUpdate) < 60 * 48) {
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);
      if ((pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC)) {
        // Only do this if they want to renew.....
        if (WillMercRenew(pSoldier, false)) {
          HandleImportantMercQuote(pSoldier, Enum202.QUOTE_DEPART_COMMET_CONTRACT_NOT_RENEWED_OR_TERMINATED_UNDER_48);
        }
      }

      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING, 1, 0);
    } else {
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);
      if ((pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC)) {
        // Only do this if they want to renew.....
        if (WillMercRenew(pSoldier, false)) {
          HandleImportantMercQuote(pSoldier, Enum202.QUOTE_DEPARTING_COMMENT_CONTRACT_NOT_RENEWED_OR_48_OR_MORE);
        }
      } else if ((pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) || (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__NPC)) {
        HandleImportantMercQuote(pSoldier, Enum202.QUOTE_RESPONSE_TO_MIGUEL_SLASH_QUOTE_MERC_OR_RPC_LETGO);
      }

      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING, 1, 0);
    }

    if ((GetWorldTotalMin() - pSoldier.uiTimeOfLastContractUpdate) < 60 * 3) {
      // this will cause him give us lame excuses for a while until he gets over it
      // 3-6 days (but the first 1-2 days of that are spent "returning" home)
      gMercProfiles[pSoldier.ubProfile].ubDaysOfMoraleHangover = (3 + Random(4));

      // if it's an AIM merc, word of this gets back to AIM...  Bad rep.
      if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
        ModifyPlayerReputation(REPUTATION_EARLY_FIRING);
      }
    }
  }
}

function MercDismissConfirmCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    // Setup history code
    gpDismissSoldier.ubLeaveHistoryCode = Enum83.HISTORY_MERC_FIRED;

    BeginRemoveMercFromContract(gpDismissSoldier);
  }
}

function ContractMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for contract region
  let iValue: INT32 = -1;
  let fOkToClose: boolean = false;
  let pSoldier: SOLDIERTYPE = <SOLDIERTYPE><unknown>undefined;

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    pSoldier = Menptr[gCharactersList[bSelectedInfoChar].usSolID];
  } else {
    // can't renew contracts from tactical!
  }

  Assert(pSoldier && pSoldier.bActive);

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    fOkToClose = true;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (GetBoxShadeFlag(ghContractBox, iValue) == true) {
      // not valid
      return;
    }

    if (iValue == Enum152.CONTRACT_MENU_CANCEL) {
      // reset contract character and contract highlight line
      giContractHighLine = -1;
      bSelectedContractChar = -1;
      fGlowContractRegion = false;

      fShowContractMenu = false;
      // dirty region
      fTeamPanelDirty = true;
      fMapScreenBottomDirty = true;
      fCharacterInfoPanelDirty = true;
      gfRenderPBInterface = true;

      if (gfInContractMenuFromRenewSequence) {
        BeginRemoveMercFromContract(pSoldier);
      }
      return;
    }

    // else handle based on contract

    switch (iValue) {
      case (Enum152.CONTRACT_MENU_DAY):
        MercContractHandling(pSoldier, Enum161.CONTRACT_EXTEND_1_DAY);
        PostContractMessage(pSoldier, Enum161.CONTRACT_EXTEND_1_DAY);
        fOkToClose = true;
        break;
      case (Enum152.CONTRACT_MENU_WEEK):
        MercContractHandling(pSoldier, Enum161.CONTRACT_EXTEND_1_WEEK);
        PostContractMessage(pSoldier, Enum161.CONTRACT_EXTEND_1_WEEK);
        fOkToClose = true;
        break;
      case (Enum152.CONTRACT_MENU_TWO_WEEKS):
        MercContractHandling(pSoldier, Enum161.CONTRACT_EXTEND_2_WEEK);
        PostContractMessage(pSoldier, Enum161.CONTRACT_EXTEND_2_WEEK);
        fOkToClose = true;
        break;

      case (Enum152.CONTRACT_MENU_TERMINATE):
        gpDismissSoldier = pSoldier;

        // If in the renewal sequence.. do right away...
        // else put up requester.
        if (gfInContractMenuFromRenewSequence) {
          MercDismissConfirmCallBack(MSG_BOX_RETURN_YES);
        } else {
          DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzLateLocalizedString[48], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, MercDismissConfirmCallBack);
        }

        fOkToClose = true;

        break;
    }

    pProcessingSoldier = null;
    fProcessingAMerc = false;
  }

  if (fOkToClose == true) {
    // reset contract character and contract highlight line
    giContractHighLine = -1;
    bSelectedContractChar = -1;
    fGlowContractRegion = false;
    fShowContractMenu = false;

    // dirty region
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;
    fCharacterInfoPanelDirty = true;
    gfRenderPBInterface = true;
  }

  return;
}

function TrainingMenuMvtCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for assignment region
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (HandleAssignmentExpansionAndHighLightForTrainingMenu() == true) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // highlight string

    // do not highlight current balance
    if (GetBoxShadeFlag(ghTrainingBox, iValue) == false) {
      // get the string line handle
      HighLightBoxLine(ghTrainingBox, iValue);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghTrainingBox);
  }
}

function AttributeMenuMvtCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  // mvt callback handler for assignment region
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // highlight string
    if (GetBoxShadeFlag(ghAttributeBox, iValue) == false) {
      // get the string line handle
      HighLightBoxLine(ghAttributeBox, iValue);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // unhighlight all strings in box
    UnHighLightBox(ghAttributeBox);
  }
}

function SquadMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment region
  let iValue: INT32 = -1;
  let pSoldier: SOLDIERTYPE;
  let sString: string /* CHAR16[128] */;
  let bCanJoinSquad: INT8;
  /* ARM: Squad menu is now disabled for anyone between sectors
          UINT8 ubNextX, ubNextY, ubPrevX, ubPrevY;
          UINT32 uiTraverseTime, uiArriveTime;
          INT32 iOldSquadValue = -1;
          BOOLEAN fCharacterWasBetweenSectors = FALSE;
  */

  pSoldier = GetSelectedAssignSoldier(false);

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (iValue == Enum151.SQUAD_MENU_CANCEL) {
      // stop displaying, leave
      fShowSquadMenu = false;

      // unhighlight the assignment box
      UnHighLightBox(ghAssignmentBox);

      // dirty region
      fTeamPanelDirty = true;
      fMapScreenBottomDirty = true;
      fCharacterInfoPanelDirty = true;
      gfRenderPBInterface = true;

      return;
    }

    bCanJoinSquad = CanCharacterSquad(pSoldier, iValue);
    // can the character join this squad?  (If already in it, accept that as a legal choice and exit menu)
    if ((bCanJoinSquad == CHARACTER_CAN_JOIN_SQUAD) || (bCanJoinSquad == CHARACTER_CANT_JOIN_SQUAD_ALREADY_IN_IT)) {
      if (bCanJoinSquad == CHARACTER_CAN_JOIN_SQUAD) {
        // able to add, do it

        /* ARM: Squad menu is now disabled for anyone between sectors
                                        // old squad character was in
                                        iOldSquadValue = SquadCharacterIsIn( pSoldier );

                                        // grab if char was between sectors
                                        fCharacterWasBetweenSectors = pSoldier -> fBetweenSectors;

                                        if( fCharacterWasBetweenSectors )
                                        {
                                                if( pSoldier -> bAssignment == VEHICLE )
                                                {
                                                        if( GetNumberInVehicle( pSoldier -> iVehicleId ) == 1 )
                                                        {
                                                                // can't change, go away
                                                                return;
                                                        }
                                                }
                                        }

                                        if( pSoldier -> ubGroupID )
                                        {
                                                GetGroupPosition(&ubNextX, &ubNextY, &ubPrevX, &ubPrevY, &uiTraverseTime, &uiArriveTime, pSoldier -> ubGroupID );
                                        }
        */
        pSoldier.bOldAssignment = pSoldier.bAssignment;

        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        AddCharacterToSquad(pSoldier, iValue);

        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          SetSoldierExitVehicleInsertionData(pSoldier, pSoldier.iVehicleId);
        }

        // Clear any desired squad assignments -- seeing the player has physically changed it!
        pSoldier.ubNumTraversalsAllowedToMerge = 0;
        pSoldier.ubDesiredSquadAssignment = NO_ASSIGNMENT;

        /* ARM: Squad menu is now disabled for anyone between sectors
                                        if( fCharacterWasBetweenSectors )
                                        {
                                                // grab location of old squad and set this value for new squad
                                                if( iOldSquadValue != -1 )
                                                {
                                                        GetSquadPosition( &ubNextX, &ubNextY, &ubPrevX, &ubPrevY, &uiTraverseTime, &uiArriveTime,  ( UINT8 )iOldSquadValue );
                                                }

                                                SetGroupPosition( ubNextX, ubNextY, ubPrevX, ubPrevY, uiTraverseTime, uiArriveTime, pSoldier -> ubGroupID );
                                        }
        */

        MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);
      }

      // stop displaying, leave
      fShowAssignmentMenu = false;
      giAssignHighLine = -1;

      // dirty region
      fTeamPanelDirty = true;
      fMapScreenBottomDirty = true;
      fCharacterInfoPanelDirty = true;
      gfRenderPBInterface = true;
    } else {
      let fDisplayError: boolean = true;

      switch (bCanJoinSquad) {
        case CHARACTER_CANT_JOIN_SQUAD_SQUAD_MOVING:
          sString = swprintf(pMapErrorString[36], pSoldier.name, pLongAssignmentStrings[iValue]);
          break;
        case CHARACTER_CANT_JOIN_SQUAD_VEHICLE:
          sString = swprintf(pMapErrorString[37], pSoldier.name);
          break;
        case CHARACTER_CANT_JOIN_SQUAD_TOO_FAR:
          sString = swprintf(pMapErrorString[20], pSoldier.name, pLongAssignmentStrings[iValue]);
          break;
        case CHARACTER_CANT_JOIN_SQUAD_FULL:
          sString = swprintf(pMapErrorString[19], pSoldier.name, pLongAssignmentStrings[iValue]);
          break;
        default:
          // generic "you can't join this squad" msg
          sString = swprintf(pMapErrorString[38], pSoldier.name, pLongAssignmentStrings[iValue]);
          break;
      }

      if (fDisplayError) {
        DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
      }
    }

    // set this assignment for the list too
    SetAssignmentForList(iValue, 0);
  }

  return;
}

function TrainingMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment region
  let iValue: INT32 = -1;
  let pSoldier: SOLDIERTYPE;
  let bTownId: INT8;
  let sString: string /* CHAR16[128] */;
  let sStringA: string /* CHAR16[128] */;

  pSoldier = GetSelectedAssignSoldier(false);

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) || (iReason & MSYS_CALLBACK_REASON_RBUTTON_DWN)) {
    if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) && !fShowMapInventoryPool) {
      UnMarkButtonDirty(giMapBorderButtons[Enum141.MAP_BORDER_TOWN_BTN]);
    }
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fShowAttributeMenu) {
      // cancel attribute submenu
      fShowAttributeMenu = false;
      // rerender tactical stuff
      gfRenderPBInterface = true;

      return;
    }

    switch (iValue) {
      case (Enum149.TRAIN_MENU_SELF):

        // practise in stat
        gbTrainingMode = Enum117.TRAIN_SELF;

        // show menu
        fShowAttributeMenu = true;
        DetermineBoxPositions();

        break;
      case (Enum149.TRAIN_MENU_TOWN):
        if (BasicCanCharacterTrainMilitia(pSoldier)) {
          bTownId = GetTownIdForSector(pSoldier.sSectorX, pSoldier.sSectorY);

          // if it's a town sector (the following 2 errors can't happen at non-town SAM sites)
          if (bTownId != Enum135.BLANK_SECTOR) {
            // can we keep militia in this town?
            if (MilitiaTrainingAllowedInSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) == false) {
              sString = swprintf(pMapErrorString[31], pTownNames[bTownId]);
              DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
              break;
            }

            // is the current loyalty high enough to train some?
            if (DoesSectorMercIsInHaveSufficientLoyaltyToTrainMilitia(pSoldier) == false) {
              DoScreenIndependantMessageBox(zMarksMapScreenText[20], MSG_BOX_FLAG_OK, null);
              break;
            }
          }

          if (IsMilitiaTrainableFromSoldiersSectorMaxed(pSoldier)) {
            if (bTownId == Enum135.BLANK_SECTOR) {
              // SAM site
              sStringA = GetShortSectorString(pSoldier.sSectorX, pSoldier.sSectorY);
              sString = swprintf(zMarksMapScreenText[21], sStringA);
            } else {
              // town
              sString = swprintf(zMarksMapScreenText[21], pTownNames[bTownId]);
            }

            DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
            break;
          }

          if (CountMilitiaTrainersInSoldiersSector(pSoldier) >= MAX_MILITIA_TRAINERS_PER_SECTOR) {
            sString = swprintf(gzLateLocalizedString[47], MAX_MILITIA_TRAINERS_PER_SECTOR);
            DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
            break;
          }

          // PASSED ALL THE TESTS - ALLOW SOLDIER TO TRAIN MILITIA HERE

          pSoldier.bOldAssignment = pSoldier.bAssignment;

          if ((pSoldier.bAssignment != Enum117.TRAIN_TOWN)) {
            SetTimeOfAssignmentChangeForMerc(pSoldier);
          }

          MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);

          // stop showing menu
          fShowAssignmentMenu = false;
          giAssignHighLine = -1;

          // remove from squad

          if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
            TakeSoldierOutOfVehicle(pSoldier);
          }
          RemoveCharacterFromSquads(pSoldier);

          ChangeSoldiersAssignment(pSoldier, Enum117.TRAIN_TOWN);

          // assign to a movement group
          AssignMercToAMovementGroup(pSoldier);
          if (SectorInfo[SECTOR(pSoldier.sSectorX, pSoldier.sSectorY)].fMilitiaTrainingPaid == false) {
            // show a message to confirm player wants to charge cost
            HandleInterfaceMessageForCostOfTrainingMilitia(pSoldier);
          } else {
            SetAssignmentForList(Enum117.TRAIN_TOWN, 0);
          }

          gfRenderPBInterface = true;
        }
        break;
      case (Enum149.TRAIN_MENU_TEAMMATES):

        if (CanCharacterTrainTeammates(pSoldier) == true) {
          // train teammates
          gbTrainingMode = Enum117.TRAIN_TEAMMATE;

          // show menu
          fShowAttributeMenu = true;
          DetermineBoxPositions();
        }
        break;
      case (Enum149.TRAIN_MENU_TRAIN_BY_OTHER):

        if (CanCharacterBeTrainedByOther(pSoldier) == true) {
          // train teammates
          gbTrainingMode = Enum117.TRAIN_BY_OTHER;

          // show menu
          fShowAttributeMenu = true;
          DetermineBoxPositions();
        }
        break;
      case (Enum149.TRAIN_MENU_CANCEL):
        // stop showing menu
        fShowTrainingMenu = false;

        // unhighlight the assignment box
        UnHighLightBox(ghAssignmentBox);

        // reset list
        ResetSelectedListForMapScreen();
        gfRenderPBInterface = true;

        break;
    }

    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (fShowAttributeMenu) {
      // cancel attribute submenu
      fShowAttributeMenu = false;
      // rerender tactical stuff
      gfRenderPBInterface = true;

      return;
    }
  }
}

function AttributesMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment region
  let iValue: INT32 = -1;
  let pSoldier: SOLDIERTYPE;

  pSoldier = GetSelectedAssignSoldier(false);

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (iValue == Enum146.ATTRIB_MENU_CANCEL) {
      // cancel, leave

      // stop showing menu
      fShowAttributeMenu = false;

      // unhighlight the training box
      UnHighLightBox(ghTrainingBox);
    } else if (CanCharacterTrainStat(pSoldier, (iValue), ((gbTrainingMode == Enum117.TRAIN_SELF) || (gbTrainingMode == Enum117.TRAIN_BY_OTHER)), (gbTrainingMode == Enum117.TRAIN_TEAMMATE))) {
      pSoldier.bOldAssignment = pSoldier.bAssignment;

      if ((pSoldier.bAssignment != gbTrainingMode)) {
        SetTimeOfAssignmentChangeForMerc(pSoldier);
      }

      // set stat to train
      pSoldier.bTrainStat = iValue;

      MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);

      // stop showing ALL menus
      fShowAssignmentMenu = false;
      giAssignHighLine = -1;

      // remove from squad/vehicle
      if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
        TakeSoldierOutOfVehicle(pSoldier);
      }
      RemoveCharacterFromSquads(pSoldier);

      // train stat
      ChangeSoldiersAssignment(pSoldier, gbTrainingMode);

      // assign to a movement group
      AssignMercToAMovementGroup(pSoldier);

      // set assignment for group
      SetAssignmentForList(gbTrainingMode, iValue);
    }

    // rerender tactical stuff
    gfRenderPBInterface = true;

    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;
  }
};

function AssignmentMenuBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment region
  let iValue: INT32 = -1;
  let sString: string /* CHAR16[128] */;

  let pSoldier: SOLDIERTYPE;

  pSoldier = GetSelectedAssignSoldier(false);

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if ((fShowAttributeMenu) || (fShowTrainingMenu) || (fShowRepairMenu) || (fShowVehicleMenu) || (fShowSquadMenu)) {
      return;
    }

    UnHighLightBox(ghAssignmentBox);

    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      switch (iValue) {
        case (Enum147.EPC_MENU_ON_DUTY):
          if (CanCharacterOnDuty(pSoldier)) {
            // put character on a team
            fShowSquadMenu = true;
            fShowTrainingMenu = false;
            fShowVehicleMenu = false;
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;
          }
          break;
        case (Enum147.EPC_MENU_PATIENT):
          // can character doctor?
          if (CanCharacterPatient(pSoldier)) {
            /* Assignment distance limits removed.  Sep/11/98.  ARM
                                                            if( IsSoldierCloseEnoughToADoctor( pSoldier ) == FALSE )
                                                            {
                                                                    return;
                                                            }
            */

            pSoldier.bOldAssignment = pSoldier.bAssignment;

            if ((pSoldier.bAssignment != Enum117.PATIENT)) {
              SetTimeOfAssignmentChangeForMerc(pSoldier);
            }

            // stop showing menu
            fShowAssignmentMenu = false;
            giAssignHighLine = -1;

            MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);

            // set dirty flag
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;

            // remove from squad

            if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
              TakeSoldierOutOfVehicle(pSoldier);
            }
            RemoveCharacterFromSquads(pSoldier);
            ChangeSoldiersAssignment(pSoldier, Enum117.PATIENT);
            AssignMercToAMovementGroup(pSoldier);

            // set assignment for group
            SetAssignmentForList(Enum117.PATIENT, 0);
          }
          break;

        case (Enum147.EPC_MENU_VEHICLE):
          if (CanCharacterVehicle(pSoldier)) {
            if (DisplayVehicleMenu(pSoldier)) {
              fShowVehicleMenu = true;
              ShowBox(ghVehicleBox);
            } else {
              fShowVehicleMenu = false;
            }
          }
          break;

        case (Enum147.EPC_MENU_REMOVE):

          fShowAssignmentMenu = false;
          UnEscortEPC(pSoldier);
          break;

        case (Enum147.EPC_MENU_CANCEL):
          fShowAssignmentMenu = false;
          giAssignHighLine = -1;

          // set dirty flag
          fTeamPanelDirty = true;
          fMapScreenBottomDirty = true;

          // reset list of characters
          ResetSelectedListForMapScreen();
          break;
      }
    } else {
      switch (iValue) {
        case (Enum148.ASSIGN_MENU_ON_DUTY):
          if (CanCharacterOnDuty(pSoldier)) {
            // put character on a team
            fShowSquadMenu = true;
            fShowTrainingMenu = false;
            fShowVehicleMenu = false;
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;
            fShowRepairMenu = false;
          }
          break;
        case (Enum148.ASSIGN_MENU_DOCTOR):

          // can character doctor?
          if (CanCharacterDoctor(pSoldier)) {
            // stop showing menu
            fShowAssignmentMenu = false;
            giAssignHighLine = -1;

            pSoldier.bOldAssignment = pSoldier.bAssignment;

            if ((pSoldier.bAssignment != Enum117.DOCTOR)) {
              SetTimeOfAssignmentChangeForMerc(pSoldier);
            }

            // remove from squad

            if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
              TakeSoldierOutOfVehicle(pSoldier);
            }
            RemoveCharacterFromSquads(pSoldier);

            ChangeSoldiersAssignment(pSoldier, Enum117.DOCTOR);

            MakeSureMedKitIsInHand(pSoldier);
            AssignMercToAMovementGroup(pSoldier);

            MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);

            // set dirty flag
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;

            // set assignment for group
            SetAssignmentForList(Enum117.DOCTOR, 0);
          } else if (CanCharacterDoctorButDoesntHaveMedKit(pSoldier)) {
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;
            sString = swprintf(zMarksMapScreenText[19], pSoldier.name);

            DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
          }

          break;
        case (Enum148.ASSIGN_MENU_PATIENT):

          // can character patient?
          if (CanCharacterPatient(pSoldier)) {
            /* Assignment distance limits removed.  Sep/11/98.  ARM
                                                            if( IsSoldierCloseEnoughToADoctor( pSoldier ) == FALSE )
                                                            {
                                                                    return;
                                                            }
            */

            pSoldier.bOldAssignment = pSoldier.bAssignment;

            if ((pSoldier.bAssignment != Enum117.PATIENT)) {
              SetTimeOfAssignmentChangeForMerc(pSoldier);
            }

            MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);

            // stop showing menu
            fShowAssignmentMenu = false;
            giAssignHighLine = -1;

            // set dirty flag
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;

            // remove from squad

            if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
              TakeSoldierOutOfVehicle(pSoldier);
            }
            RemoveCharacterFromSquads(pSoldier);
            ChangeSoldiersAssignment(pSoldier, Enum117.PATIENT);

            AssignMercToAMovementGroup(pSoldier);

            // set assignment for group
            SetAssignmentForList(Enum117.PATIENT, 0);
          }
          break;

        case (Enum148.ASSIGN_MENU_VEHICLE):
          if (CanCharacterVehicle(pSoldier)) {
            if (DisplayVehicleMenu(pSoldier)) {
              fShowVehicleMenu = true;
              ShowBox(ghVehicleBox);
            } else {
              fShowVehicleMenu = false;
            }
          }
          break;
        case (Enum148.ASSIGN_MENU_REPAIR):
          if (CanCharacterRepair(pSoldier)) {
            fShowSquadMenu = false;
            fShowTrainingMenu = false;
            fShowVehicleMenu = false;
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;

            pSoldier.bOldAssignment = pSoldier.bAssignment;

            if (pSoldier.bSectorZ == 0) {
              fShowRepairMenu = false;

              if (DisplayRepairMenu(pSoldier)) {
                fShowRepairMenu = true;
              }
            }
          } else if (CanCharacterRepairButDoesntHaveARepairkit(pSoldier)) {
            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;
            sString = swprintf(zMarksMapScreenText[18], pSoldier.name);

            DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
          }
          break;
        case (Enum148.ASSIGN_MENU_TRAIN):
          if (CanCharacterPractise(pSoldier)) {
            fShowTrainingMenu = true;
            DetermineBoxPositions();
            fShowSquadMenu = false;
            fShowVehicleMenu = false;
            fShowRepairMenu = false;

            fTeamPanelDirty = true;
            fMapScreenBottomDirty = true;
          }
          break;
        case (Enum148.ASSIGN_MENU_CANCEL):
          fShowAssignmentMenu = false;
          giAssignHighLine = -1;

          // set dirty flag
          fTeamPanelDirty = true;
          fMapScreenBottomDirty = true;

          // reset list of characters
          ResetSelectedListForMapScreen();
          break;
      }
    }
    gfRenderPBInterface = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if ((fShowAttributeMenu) || (fShowTrainingMenu) || (fShowRepairMenu) || (fShowVehicleMenu) || (fShowSquadMenu)) {
      fShowAttributeMenu = false;
      fShowTrainingMenu = false;
      fShowRepairMenu = false;
      fShowVehicleMenu = false;
      fShowSquadMenu = false;

      // rerender tactical stuff
      gfRenderPBInterface = true;

      // set dirty flag
      fTeamPanelDirty = true;
      fMapScreenBottomDirty = true;

      return;
    }
  }
}

function RestorePopUpBoxes(): void {
  ContractPosition.iX = OrigContractPosition.iX;
  AttributePosition.iX = OrigAttributePosition.iX;
  SquadPosition.iX = OrigSquadPosition.iX;
  AssignmentPosition.iX = OrigAssignmentPosition.iX;
  TrainPosition.iX = OrigTrainPosition.iX;
  VehiclePosition.iX = OrigVehiclePosition.iX;

  return;
}

function CreateSquadBox(): void {
  // will create a pop up box for squad selection
  let pPoint: SGPPoint = createSGPPoint();
  let pDimensions: SGPRect = createSGPRect();
  let hStringHandle: UINT32;
  let uiCounter: UINT32;
  let sString: string /* CHAR16[64] */;
  let uiMaxSquad: UINT32;

  // create basic box
  ghSquadBox = CreatePopUpBox(SquadDimensions, SquadPosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_RESIZE));

  // which buffer will box render to
  SetBoxBuffer(ghSquadBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghSquadBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghSquadBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghSquadBox, 6, 6, 4, 4);

  // space between lines
  SetLineSpace(ghSquadBox, 2);

  // set current box to this one
  SetCurrentBox(ghSquadBox);

  uiMaxSquad = GetLastSquadListedInSquadMenu();

  // add strings for box
  for (uiCounter = 0; uiCounter <= uiMaxSquad; uiCounter++) {
    // get info about current squad and put in  string
    sString = swprintf("%s ( %d/%d )", pSquadMenuStrings[uiCounter], NumberOfPeopleInSquad(uiCounter), NUMBER_OF_SOLDIERS_PER_SQUAD);
    hStringHandle = AddMonoString(sString);

    // make sure it is unhighlighted
    UnHighLightLine(hStringHandle);
  }

  // add cancel line
  hStringHandle = AddMonoString(pSquadMenuStrings[Enum275.NUMBER_OF_SQUADS]);

  // set font type
  SetBoxFont(ghSquadBox, MAP_SCREEN_FONT());

  // set highlight color
  SetBoxHighLight(ghSquadBox, FONT_WHITE);

  // unhighlighted color
  SetBoxForeground(ghSquadBox, FONT_LTGREEN);

  // the secondary shade color
  SetBoxSecondaryShade(ghSquadBox, FONT_YELLOW);

  // background color
  SetBoxBackground(ghSquadBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghSquadBox, FONT_GRAY7);

  // resize box to text
  ResizeBoxToText(ghSquadBox);

  DetermineBoxPositions();

  GetBoxPosition(ghSquadBox, pPoint);
  GetBoxSize(ghSquadBox, pDimensions);

  if (giBoxY + pDimensions.iBottom > 479) {
    pPoint.iY = SquadPosition.iY = 479 - pDimensions.iBottom;
  }

  SetBoxPosition(ghSquadBox, pPoint);
}

function CreateEPCBox(): void {
  // will create a pop up box for squad selection
  let pPoint: SGPPoint = createSGPPoint();
  let pDimensions: SGPRect = createSGPRect();
  let hStringHandle: UINT32;
  let iCount: INT32;

  // create basic box
  ghEpcBox = CreatePopUpBox(SquadDimensions, AssignmentPosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_RESIZE | POPUP_BOX_FLAG_CENTER_TEXT));

  // which buffer will box render to
  SetBoxBuffer(ghEpcBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghEpcBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghEpcBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghEpcBox, 6, 6, 4, 4);

  // space between lines
  SetLineSpace(ghEpcBox, 2);

  // set current box to this one
  SetCurrentBox(ghEpcBox);

  for (iCount = 0; iCount < Enum147.MAX_EPC_MENU_STRING_COUNT; iCount++) {
    hStringHandle = AddMonoString(pEpcMenuStrings[iCount]);
  }

  // set font type
  SetBoxFont(ghEpcBox, MAP_SCREEN_FONT());

  // set highlight color
  SetBoxHighLight(ghEpcBox, FONT_WHITE);

  // unhighlighted color
  SetBoxForeground(ghEpcBox, FONT_LTGREEN);

  // background color
  SetBoxBackground(ghEpcBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghEpcBox, FONT_GRAY7);

  // resize box to text
  ResizeBoxToText(ghEpcBox);

  GetBoxPosition(ghEpcBox, pPoint);

  GetBoxSize(ghEpcBox, pDimensions);

  if (giBoxY + pDimensions.iBottom > 479) {
    pPoint.iY = AssignmentPosition.iY = 479 - pDimensions.iBottom;
  }

  SetBoxPosition(ghEpcBox, pPoint);
}

function HandleShadingOfLinesForSquadMenu(): void {
  // find current squad and set that line the squad box a lighter green
  let uiCounter: UINT32;
  let pSoldier: SOLDIERTYPE;
  let uiMaxSquad: UINT32;
  let bResult: INT8 = <INT8><unknown>undefined;

  if ((fShowSquadMenu == false) || (ghSquadBox == -1)) {
    return;
  }

  pSoldier = GetSelectedAssignSoldier(false);

  uiMaxSquad = GetLastSquadListedInSquadMenu();

  for (uiCounter = 0; uiCounter <= uiMaxSquad; uiCounter++) {
    if (pSoldier != null) {
      bResult = CanCharacterSquad(pSoldier, uiCounter);
    }

    // if no soldier, or a reason which doesn't have a good explanatory message
    if ((pSoldier == null) || (bResult == CHARACTER_CANT_JOIN_SQUAD)) {
      // darken /disable line
      ShadeStringInBox(ghSquadBox, uiCounter);
    } else {
      if (bResult == CHARACTER_CAN_JOIN_SQUAD) {
        // legal squad, leave it green
        UnShadeStringInBox(ghSquadBox, uiCounter);
        UnSecondaryShadeStringInBox(ghSquadBox, uiCounter);
      } else {
        // unjoinable squad - yellow
        SecondaryShadeStringInBox(ghSquadBox, uiCounter);
      }
    }
  }
}

function PostContractMessage(pCharacter: SOLDIERTYPE, iContract: INT32): void {
  // do nothing
  return;

  // send a message stating that offer of contract extension made
  // MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"Offered to extend %s's contract by another %s.", pCharacter -> name, pContractExtendStrings[ iContract ] );

  return;
}

function PostTerminateMessage(pCharacter: SOLDIERTYPE): void {
  // do nothing
  return;

  // send a message stating that termination of contract done
  // MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"%s's contract has been terminated.", pCharacter -> name );
}

function DisplayVehicleMenu(pSoldier: SOLDIERTYPE): boolean {
  let fVehiclePresent: boolean = false;
  let iCounter: INT32 = 0;
  let hStringHandle: INT32 = 0;

  // first, clear pop up box
  RemoveBox(ghVehicleBox);
  ghVehicleBox = -1;

  CreateVehicleBox();
  SetCurrentBox(ghVehicleBox);

  // run through list of vehicles in sector and add them to pop up box
  for (iCounter = 0; iCounter < ubNumberOfVehicles; iCounter++) {
    if (pVehicleList[iCounter].fValid == true) {
      if (IsThisVehicleAccessibleToSoldier(pSoldier, iCounter)) {
        hStringHandle = AddMonoString(pVehicleStrings[pVehicleList[iCounter].ubVehicleType]);
        fVehiclePresent = true;
      }
    }
  }

  // cancel string (borrow the one in the squad menu)
  hStringHandle = AddMonoString(pSquadMenuStrings[Enum151.SQUAD_MENU_CANCEL]);

  SetBoxFont(ghVehicleBox, MAP_SCREEN_FONT());
  SetBoxHighLight(ghVehicleBox, FONT_WHITE);
  SetBoxForeground(ghVehicleBox, FONT_LTGREEN);
  SetBoxBackground(ghVehicleBox, FONT_BLACK);

  return fVehiclePresent;
}

function CreateVehicleBox(): void {
  ghVehicleBox = CreatePopUpBox(VehicleDimensions, VehiclePosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_CENTER_TEXT | POPUP_BOX_FLAG_RESIZE));
  SetBoxBuffer(ghVehicleBox, FRAME_BUFFER);
  SetBorderType(ghVehicleBox, guiPOPUPBORDERS);
  SetBackGroundSurface(ghVehicleBox, guiPOPUPTEX);
  SetMargins(ghVehicleBox, 6, 6, 4, 4);
  SetLineSpace(ghVehicleBox, 2);
}

function CreateRepairBox(): void {
  ghRepairBox = CreatePopUpBox(RepairDimensions, RepairPosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_CENTER_TEXT | POPUP_BOX_FLAG_RESIZE));
  SetBoxBuffer(ghRepairBox, FRAME_BUFFER);
  SetBorderType(ghRepairBox, guiPOPUPBORDERS);
  SetBackGroundSurface(ghRepairBox, guiPOPUPTEX);
  SetMargins(ghRepairBox, 6, 6, 4, 4);
  SetLineSpace(ghRepairBox, 2);
}

export function CreateContractBox(pCharacter: SOLDIERTYPE | null): void {
  let hStringHandle: UINT32;
  let uiCounter: UINT32;
  let sString: string /* CHAR16[50] */;
  let sDollarString: string /* CHAR16[50] */;

  ContractPosition.iX = OrigContractPosition.iX;

  if (giBoxY != 0) {
    ContractPosition.iX = giBoxY;
  }

  ghContractBox = CreatePopUpBox(ContractDimensions, ContractPosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_RESIZE));
  SetBoxBuffer(ghContractBox, FRAME_BUFFER);
  SetBorderType(ghContractBox, guiPOPUPBORDERS);
  SetBackGroundSurface(ghContractBox, guiPOPUPTEX);
  SetMargins(ghContractBox, 6, 6, 4, 4);
  SetLineSpace(ghContractBox, 2);

  // set current box to this one
  SetCurrentBox(ghContractBox);

  // not null character?
  if (pCharacter != null) {
    for (uiCounter = 0; uiCounter < Enum152.MAX_CONTRACT_MENU_STRING_COUNT; uiCounter++) {
      switch (uiCounter) {
        case (Enum152.CONTRACT_MENU_CURRENT_FUNDS):
          /*
                                          // add current balance after title string
                                           swprintf( sDollarString, L"%d", LaptopSaveInfo.iCurrentBalance);
                                           InsertCommasForDollarFigure( sDollarString );
                                           InsertDollarSignInToString( sDollarString );
                                           swprintf( sString, L"%s %s",  pContractStrings[uiCounter], sDollarString );
                                           AddMonoString(&hStringHandle, sString);
          */
          hStringHandle = AddMonoString(pContractStrings[uiCounter]);
          break;
        case (Enum152.CONTRACT_MENU_DAY):

          if (pCharacter.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC) {
            sDollarString = swprintf("%d", 0);
          } else {
            sDollarString = swprintf("%d", gMercProfiles[pCharacter.ubProfile].sSalary);
          }
          sDollarString = InsertCommasForDollarFigure(sDollarString);
          sDollarString = InsertDollarSignInToString(sDollarString);
          sString = swprintf("%s ( %s )", pContractStrings[uiCounter], sDollarString);
          hStringHandle = AddMonoString(sString);
          break;
        case (Enum152.CONTRACT_MENU_WEEK):

          if (pCharacter.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC) {
            sDollarString = swprintf("%d", 0);
          } else {
            sDollarString = swprintf("%d", gMercProfiles[pCharacter.ubProfile].uiWeeklySalary);
          }

          sDollarString = InsertCommasForDollarFigure(sDollarString);
          sDollarString = InsertDollarSignInToString(sDollarString);
          sString = swprintf("%s ( %s )", pContractStrings[uiCounter], sDollarString);
          hStringHandle = AddMonoString(sString);
          break;
        case (Enum152.CONTRACT_MENU_TWO_WEEKS):

          if (pCharacter.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC) {
            sDollarString = swprintf("%d", 0);
          } else {
            sDollarString = swprintf("%d", gMercProfiles[pCharacter.ubProfile].uiBiWeeklySalary);
          }

          sDollarString = InsertCommasForDollarFigure(sDollarString);
          sDollarString = InsertDollarSignInToString(sDollarString);
          sString = swprintf("%s ( %s )", pContractStrings[uiCounter], sDollarString);
          hStringHandle = AddMonoString(sString);
          break;
        default:
          hStringHandle = AddMonoString(pContractStrings[uiCounter]);
          break;
      }
      UnHighLightLine(hStringHandle);
    }
  }

  SetBoxFont(ghContractBox, MAP_SCREEN_FONT());
  SetBoxHighLight(ghContractBox, FONT_WHITE);
  SetBoxForeground(ghContractBox, FONT_LTGREEN);
  SetBoxBackground(ghContractBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghContractBox, FONT_GRAY7);

  if (pCharacter != null) {
    // now set the color for the current balance value
    SetBoxLineForeground(ghContractBox, 0, FONT_YELLOW);
  }

  // resize box to text
  ResizeBoxToText(ghContractBox);
}

function CreateAttributeBox(): void {
  let hStringHandle: UINT32;
  let uiCounter: UINT32;

  // will create attribute pop up menu for mapscreen assignments

  AttributePosition.iX = OrigAttributePosition.iX;

  if (giBoxY != 0) {
    AttributePosition.iY = giBoxY;
  }

  // update screen assignment positions
  UpdateMapScreenAssignmentPositions();

  // create basic box
  ghAttributeBox = CreatePopUpBox(AttributeDimensions, AttributePosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_CENTER_TEXT | POPUP_BOX_FLAG_RESIZE));

  // which buffer will box render to
  SetBoxBuffer(ghAttributeBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghAttributeBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghAttributeBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghAttributeBox, 6, 6, 4, 4);

  // space between lines
  SetLineSpace(ghAttributeBox, 2);

  // set current box to this one
  SetCurrentBox(ghAttributeBox);

  // add strings for box
  for (uiCounter = 0; uiCounter < Enum146.MAX_ATTRIBUTE_STRING_COUNT; uiCounter++) {
    hStringHandle = AddMonoString(pAttributeMenuStrings[uiCounter]);

    // make sure it is unhighlighted
    UnHighLightLine(hStringHandle);
  }

  // set font type
  SetBoxFont(ghAttributeBox, MAP_SCREEN_FONT());

  // set highlight color
  SetBoxHighLight(ghAttributeBox, FONT_WHITE);

  // unhighlighted color
  SetBoxForeground(ghAttributeBox, FONT_LTGREEN);

  // background color
  SetBoxBackground(ghAttributeBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghAttributeBox, FONT_GRAY7);

  // resize box to text
  ResizeBoxToText(ghAttributeBox);
}

function CreateTrainingBox(): void {
  let hStringHandle: UINT32;
  let uiCounter: UINT32;

  // will create attribute pop up menu for mapscreen assignments

  TrainPosition.iX = OrigTrainPosition.iX;

  if (giBoxY != 0) {
    TrainPosition.iY = giBoxY + (Enum148.ASSIGN_MENU_TRAIN * GetFontHeight(MAP_SCREEN_FONT()));
  }

  // create basic box
  ghTrainingBox = CreatePopUpBox(TrainDimensions, TrainPosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_CENTER_TEXT | POPUP_BOX_FLAG_RESIZE));

  // which buffer will box render to
  SetBoxBuffer(ghTrainingBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghTrainingBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghTrainingBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghTrainingBox, 6, 6, 4, 4);

  // space between lines
  SetLineSpace(ghTrainingBox, 2);

  // set current box to this one
  SetCurrentBox(ghTrainingBox);

  // add strings for box
  for (uiCounter = 0; uiCounter < Enum149.MAX_TRAIN_STRING_COUNT; uiCounter++) {
    hStringHandle = AddMonoString(pTrainingMenuStrings[uiCounter]);

    // make sure it is unhighlighted
    UnHighLightLine(hStringHandle);
  }

  // set font type
  SetBoxFont(ghTrainingBox, MAP_SCREEN_FONT());

  // set highlight color
  SetBoxHighLight(ghTrainingBox, FONT_WHITE);

  // unhighlighted color
  SetBoxForeground(ghTrainingBox, FONT_LTGREEN);

  // background color
  SetBoxBackground(ghTrainingBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghTrainingBox, FONT_GRAY7);

  // resize box to text
  ResizeBoxToText(ghTrainingBox);

  DetermineBoxPositions();
}

function CreateAssignmentsBox(): void {
  let hStringHandle: UINT32;
  let uiCounter: UINT32;
  let sString: string /* CHAR16[128] */;
  let pSoldier: SOLDIERTYPE | null;

  // will create attribute pop up menu for mapscreen assignments

  AssignmentPosition.iX = OrigAssignmentPosition.iX;

  if (giBoxY != 0) {
    AssignmentPosition.iY = giBoxY;
  }

  pSoldier = GetSelectedAssignSoldier(true);
  // pSoldier NULL is legal here!  Gets called during every mapscreen initialization even when nobody is assign char

  // create basic box
  ghAssignmentBox = CreatePopUpBox(AssignmentDimensions, AssignmentPosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_CENTER_TEXT | POPUP_BOX_FLAG_RESIZE));

  // which buffer will box render to
  SetBoxBuffer(ghAssignmentBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghAssignmentBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghAssignmentBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghAssignmentBox, 6, 6, 4, 4);

  // space between lines
  SetLineSpace(ghAssignmentBox, 2);

  // set current box to this one
  SetCurrentBox(ghAssignmentBox);

  // add strings for box
  for (uiCounter = 0; uiCounter < Enum148.MAX_ASSIGN_STRING_COUNT; uiCounter++) {
    // if we have a soldier, and this is the squad line
    if ((uiCounter == Enum148.ASSIGN_MENU_ON_DUTY) && (pSoldier != null) && (pSoldier.bAssignment < Enum117.ON_DUTY)) {
      // show his squad # in brackets
      sString = swprintf("%s(%d)", pAssignMenuStrings[uiCounter], pSoldier.bAssignment + 1);
    } else {
      sString = pAssignMenuStrings[uiCounter];
    }

    hStringHandle = AddMonoString(sString);

    // make sure it is unhighlighted
    UnHighLightLine(hStringHandle);
  }

  // set font type
  SetBoxFont(ghAssignmentBox, MAP_SCREEN_FONT());

  // set highlight color
  SetBoxHighLight(ghAssignmentBox, FONT_WHITE);

  // unhighlighted color
  SetBoxForeground(ghAssignmentBox, FONT_LTGREEN);

  // background color
  SetBoxBackground(ghAssignmentBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghAssignmentBox, FONT_GRAY7);
  SetBoxSecondaryShade(ghAssignmentBox, FONT_YELLOW);

  // resize box to text
  ResizeBoxToText(ghAssignmentBox);

  DetermineBoxPositions();
}

export function CreateMercRemoveAssignBox(): void {
  // will create remove mercbox to be placed in assignment area

  let hStringHandle: UINT32;
  let uiCounter: UINT32;
  // create basic box
  ghRemoveMercAssignBox = CreatePopUpBox(AssignmentDimensions, AssignmentPosition, (POPUP_BOX_FLAG_CLIP_TEXT | POPUP_BOX_FLAG_CENTER_TEXT | POPUP_BOX_FLAG_RESIZE));

  // which buffer will box render to
  SetBoxBuffer(ghRemoveMercAssignBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghRemoveMercAssignBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghRemoveMercAssignBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghRemoveMercAssignBox, 6, 6, 4, 4);

  // space between lines
  SetLineSpace(ghRemoveMercAssignBox, 2);

  // set current box to this one
  SetCurrentBox(ghRemoveMercAssignBox);

  // add strings for box
  for (uiCounter = 0; uiCounter < Enum150.MAX_REMOVE_MERC_COUNT; uiCounter++) {
    hStringHandle = AddMonoString(pRemoveMercStrings[uiCounter]);

    // make sure it is unhighlighted
    UnHighLightLine(hStringHandle);
  }

  // set font type
  SetBoxFont(ghRemoveMercAssignBox, MAP_SCREEN_FONT());

  // set highlight color
  SetBoxHighLight(ghRemoveMercAssignBox, FONT_WHITE);

  // unhighlighted color
  SetBoxForeground(ghRemoveMercAssignBox, FONT_LTGREEN);

  // background color
  SetBoxBackground(ghRemoveMercAssignBox, FONT_BLACK);

  // shaded color..for darkened text
  SetBoxShade(ghRemoveMercAssignBox, FONT_GRAY7);

  // resize box to text
  ResizeBoxToText(ghRemoveMercAssignBox);
}

/* static */ let CreateDestroyAssignmentPopUpBoxes__fCreated: boolean = false;
export function CreateDestroyAssignmentPopUpBoxes(): boolean {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  if ((fShowAssignmentMenu == true) && (CreateDestroyAssignmentPopUpBoxes__fCreated == false)) {
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\popup.sti");
    if (!(guiPOPUPBORDERS = AddVideoObject(VObjectDesc))) {
      return false;
    }

    vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;
    vs_desc.ImageFile = "INTERFACE\\popupbackground.pcx";
    if ((guiPOPUPTEX = AddVideoSurface(vs_desc)) === -1) {
      return false;
    }

    // these boxes are always created while in mapscreen...
    CreateEPCBox();
    CreateAssignmentsBox();
    CreateTrainingBox();
    CreateAttributeBox();
    CreateVehicleBox();
    CreateRepairBox();

    UpdateMapScreenAssignmentPositions();

    CreateDestroyAssignmentPopUpBoxes__fCreated = true;
  } else if ((fShowAssignmentMenu == false) && (CreateDestroyAssignmentPopUpBoxes__fCreated == true)) {
    DeleteVideoObjectFromIndex(guiPOPUPBORDERS);
    DeleteVideoSurfaceFromIndex(guiPOPUPTEX);

    RemoveBox(ghAttributeBox);
    ghAttributeBox = -1;

    RemoveBox(ghVehicleBox);
    ghVehicleBox = -1;

    RemoveBox(ghAssignmentBox);
    ghAssignmentBox = -1;

    RemoveBox(ghEpcBox);
    ghEpcBox = -1;

    RemoveBox(ghRepairBox);
    ghRepairBox = -1;

    RemoveBox(ghTrainingBox);
    ghTrainingBox = -1;

    CreateDestroyAssignmentPopUpBoxes__fCreated = false;
    gfIgnoreScrolling = false;
    RebuildCurrentSquad();
  }

  return true;
}

export function DetermineBoxPositions(): void {
  // depending on how many boxes there are, reposition as needed
  let pPoint: SGPPoint = createSGPPoint();
  let pNewPoint: SGPPoint = createSGPPoint();
  let pDimensions: SGPRect = createSGPRect();
  let pSoldier: SOLDIERTYPE | null;

  if ((fShowAssignmentMenu == false) || (ghAssignmentBox == -1)) {
    return;
  }

  pSoldier = GetSelectedAssignSoldier(true);
  // pSoldier NULL is legal here!  Gets called during every mapscreen initialization even when nobody is assign char
  if (pSoldier == null) {
    return;
  }

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    GetBoxPosition(ghAssignmentBox, pPoint);
    gsAssignmentBoxesX = pPoint.iX;
    gsAssignmentBoxesY = pPoint.iY;
  }

  pPoint.iX = gsAssignmentBoxesX;
  pPoint.iY = gsAssignmentBoxesY;

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    SetBoxPosition(ghEpcBox, pPoint);
    GetBoxSize(ghEpcBox, pDimensions);
  } else {
    SetBoxPosition(ghAssignmentBox, pPoint);
    GetBoxSize(ghAssignmentBox, pDimensions);
  }

  // hang it right beside the assignment/EPC box menu
  pNewPoint.iX = pPoint.iX + pDimensions.iRight;
  pNewPoint.iY = pPoint.iY;

  if ((fShowSquadMenu == true) && (ghSquadBox != -1)) {
    SetBoxPosition(ghSquadBox, pNewPoint);
  }

  if ((fShowRepairMenu == true) && (ghRepairBox != -1)) {
    CreateDestroyMouseRegionForRepairMenu();
    pNewPoint.iY += ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_REPAIR);

    SetBoxPosition(ghRepairBox, pNewPoint);
  }

  if ((fShowTrainingMenu == true) && (ghTrainingBox != -1)) {
    pNewPoint.iY += ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN);
    SetBoxPosition(ghTrainingBox, pNewPoint);
    TrainPosition.iX = pNewPoint.iX;
    TrainPosition.iY = pNewPoint.iY;
    OrigTrainPosition.iY = pNewPoint.iY;
    OrigTrainPosition.iX = pNewPoint.iX;

    GetBoxSize(ghTrainingBox, pDimensions);
    GetBoxPosition(ghTrainingBox, pPoint);

    if ((fShowAttributeMenu == true) && (ghAttributeBox != -1)) {
      // hang it right beside the training box menu
      pNewPoint.iX = pPoint.iX + pDimensions.iRight;
      pNewPoint.iY = pPoint.iY;
      SetBoxPosition(ghAttributeBox, pNewPoint);
    }
  }

  return;
}

export function SetTacticalPopUpAssignmentBoxXY(): void {
  let sX: INT16;
  let sY: INT16;
  let pSoldier: SOLDIERTYPE;

  // get the soldier
  pSoldier = GetSelectedAssignSoldier(false);

  // grab soldier's x,y screen position
  ({ sScreenX: sX, sScreenY: sY } = GetSoldierScreenPos(pSoldier));

  if (sX < 0) {
    sX = 0;
  }

  gsAssignmentBoxesX = sX + 30;

  if (sY < 0) {
    sY = 0;
  }

  gsAssignmentBoxesY = sY;

  // ATE: Check if we are past tactical viewport....
  // Use estimate width's/heights
  if ((gsAssignmentBoxesX + 100) > 640) {
    gsAssignmentBoxesX = 540;
  }

  if ((gsAssignmentBoxesY + 130) > 320) {
    gsAssignmentBoxesY = 190;
  }

  return;
}

function RepositionMouseRegions(): void {
  let sDeltaX: INT16;
  let sDeltaY: INT16;
  let iCounter: INT32 = 0;

  if (fShowAssignmentMenu == true) {
    sDeltaX = gsAssignmentBoxesX - gAssignmentMenuRegion[0].RegionTopLeftX;
    sDeltaY = (gsAssignmentBoxesY - gAssignmentMenuRegion[0].RegionTopLeftY + GetTopMarginSize(ghAssignmentBox));

    // find the delta from the old to the new, and alter values accordingly
    for (iCounter = 0; iCounter < GetNumberOfLinesOfTextInBox(ghAssignmentBox); iCounter++) {
      gAssignmentMenuRegion[iCounter].RegionTopLeftX += sDeltaX;
      gAssignmentMenuRegion[iCounter].RegionTopLeftY += sDeltaY;

      gAssignmentMenuRegion[iCounter].RegionBottomRightX += sDeltaX;
      gAssignmentMenuRegion[iCounter].RegionBottomRightY += sDeltaY;
    }

    gfPausedTacticalRenderFlags = Boolean(RENDER_FLAG_FULL);
  }
}

function CheckAndUpdateTacticalAssignmentPopUpPositions(): void {
  let pDimensions: SGPRect = createSGPRect();
  let pDimensions2: SGPRect = createSGPRect();
  let pDimensions3: SGPRect = createSGPRect();
  let pPoint: SGPPoint = createSGPPoint();
  let sLongest: INT16;
  let pSoldier: SOLDIERTYPE;

  if (fShowAssignmentMenu == false) {
    return;
  }

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    return;
  }

  // get the soldier
  pSoldier = GetSelectedAssignSoldier(false);

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    GetBoxSize(ghEpcBox, pDimensions2);
  } else {
    GetBoxSize(ghAssignmentBox, pDimensions2);
  }

  if (fShowRepairMenu == true) {
    GetBoxSize(ghRepairBox, pDimensions);

    if (gsAssignmentBoxesX + pDimensions2.iRight + pDimensions.iRight >= 640) {
      gsAssignmentBoxesX = (639 - (pDimensions2.iRight + pDimensions.iRight));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    if (pDimensions2.iBottom > pDimensions.iBottom) {
      sLongest = pDimensions2.iBottom + ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_REPAIR);
    } else {
      sLongest = pDimensions.iBottom + ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_REPAIR);
    }

    if (gsAssignmentBoxesY + sLongest >= 360) {
      gsAssignmentBoxesY = (359 - (sLongest));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    pPoint.iX = gsAssignmentBoxesX + pDimensions2.iRight;
    pPoint.iY = gsAssignmentBoxesY + ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_REPAIR);

    SetBoxPosition(ghRepairBox, pPoint);
  } else if (fShowSquadMenu == true) {
    GetBoxSize(ghSquadBox, pDimensions);

    if (gsAssignmentBoxesX + pDimensions2.iRight + pDimensions.iRight >= 640) {
      gsAssignmentBoxesX = (639 - (pDimensions2.iRight + pDimensions.iRight));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    if (pDimensions2.iBottom > pDimensions.iBottom) {
      sLongest = pDimensions2.iBottom;
    } else {
      sLongest = pDimensions.iBottom;
    }

    if (gsAssignmentBoxesY + sLongest >= 360) {
      gsAssignmentBoxesY = (359 - (sLongest));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    pPoint.iX = gsAssignmentBoxesX + pDimensions2.iRight;
    pPoint.iY = gsAssignmentBoxesY;

    SetBoxPosition(ghSquadBox, pPoint);
  } else if (fShowAttributeMenu == true) {
    GetBoxSize(ghTrainingBox, pDimensions);
    GetBoxSize(ghAttributeBox, pDimensions3);

    if (gsAssignmentBoxesX + pDimensions2.iRight + pDimensions.iRight + pDimensions3.iRight >= 640) {
      gsAssignmentBoxesX = (639 - (pDimensions2.iRight + pDimensions.iRight + pDimensions3.iRight));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    if (gsAssignmentBoxesY + pDimensions3.iBottom + (GetFontHeight(MAP_SCREEN_FONT()) * Enum148.ASSIGN_MENU_TRAIN) >= 360) {
      gsAssignmentBoxesY = (359 - (pDimensions3.iBottom));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    pPoint.iX = gsAssignmentBoxesX + pDimensions2.iRight + pDimensions.iRight;
    pPoint.iY = gsAssignmentBoxesY;

    pPoint.iY += ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN);
    SetBoxPosition(ghAttributeBox, pPoint);

    pPoint.iX = gsAssignmentBoxesX + pDimensions2.iRight;
    pPoint.iY = gsAssignmentBoxesY;

    pPoint.iY += ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN);

    SetBoxPosition(ghTrainingBox, pPoint);
  } else if (fShowTrainingMenu == true) {
    GetBoxSize(ghTrainingBox, pDimensions);

    if (gsAssignmentBoxesX + pDimensions2.iRight + pDimensions.iRight >= 640) {
      gsAssignmentBoxesX = (639 - (pDimensions2.iRight + pDimensions.iRight));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    if (gsAssignmentBoxesY + pDimensions2.iBottom + ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN) >= 360) {
      gsAssignmentBoxesY = (359 - (pDimensions2.iBottom) - ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    pPoint.iX = gsAssignmentBoxesX + pDimensions2.iRight;
    pPoint.iY = gsAssignmentBoxesY;
    pPoint.iY += ((GetFontHeight(MAP_SCREEN_FONT()) + 2) * Enum148.ASSIGN_MENU_TRAIN);

    SetBoxPosition(ghTrainingBox, pPoint);
  } else {
    // just the assignment box
    if (gsAssignmentBoxesX + pDimensions2.iRight >= 640) {
      gsAssignmentBoxesX = (639 - (pDimensions2.iRight));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    if (gsAssignmentBoxesY + pDimensions2.iBottom >= 360) {
      gsAssignmentBoxesY = (359 - (pDimensions2.iBottom));
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    pPoint.iX = gsAssignmentBoxesX;
    pPoint.iY = gsAssignmentBoxesY;

    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      SetBoxPosition(ghEpcBox, pPoint);
    } else {
      SetBoxPosition(ghAssignmentBox, pPoint);
    }
  }

  RepositionMouseRegions();
}

function PositionCursorForTacticalAssignmentBox(): void {
  // position cursor over y of on duty in tactical assignments
  let pPosition: SGPPoint = createSGPPoint();
  let pDimensions: SGPRect = createSGPRect();
  let iFontHeight: INT32;

  // get x.y position of box
  GetBoxPosition(ghAssignmentBox, pPosition);

  // get dimensions..mostly for width
  GetBoxSize(ghAssignmentBox, pDimensions);

  iFontHeight = GetLineSpace(ghAssignmentBox) + GetFontHeight(GetBoxFont(ghAssignmentBox));

  if (gGameSettings.fOptions[Enum8.TOPTION_DONT_MOVE_MOUSE] == false) {
    SimulateMouseMovement(pPosition.iX + pDimensions.iRight - 6, pPosition.iY + (iFontHeight / 2) + 2);
  }
}

function HandleRestFatigueAndSleepStatus(): void {
  let iCounter: INT32 = 0;
  let iNumberOnTeam: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let fReasonAdded: boolean = false;
  let fBoxSetUp: boolean = false;
  let fMeToo: boolean = false;

  iNumberOnTeam = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // run through all player characters and handle their rest, fatigue, and going to sleep
  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pSoldier = Menptr[iCounter];

    if (pSoldier.bActive) {
      if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier)) {
        continue;
      }

      if ((pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.bAssignment == Enum117.IN_TRANSIT)) {
        continue;
      }

      // if character CAN sleep, he doesn't actually have to be put asleep to get some rest,
      // many other assignments and conditions allow for automatic recovering from fatigue.
      if (CharacterIsTakingItEasy(pSoldier)) {
        // let them rest some
        RestCharacter(pSoldier);
      } else {
        // wear them down
        FatigueCharacter(pSoldier);
      }

      // CHECK FOR MERCS GOING TO SLEEP

      // if awake
      if (!pSoldier.fMercAsleep) {
        // if dead tired
        if (pSoldier.bBreathMax <= BREATHMAX_ABSOLUTE_MINIMUM) {
          // if between sectors, don't put tired mercs to sleep...  will be handled when they arrive at the next sector
          if (pSoldier.fBetweenSectors) {
            continue;
          }

          // he goes to sleep, provided it's at all possible (it still won't happen in a hostile sector, etc.)
          if (SetMercAsleep(pSoldier, false)) {
            if ((pSoldier.bAssignment < Enum117.ON_DUTY) || (pSoldier.bAssignment == Enum117.VEHICLE)) {
              // on a squad/vehicle, complain, then drop
              TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_NEED_SLEEP);
              TacticalCharacterDialogueWithSpecialEvent(pSoldier, Enum202.QUOTE_NEED_SLEEP, DIALOGUE_SPECIAL_EVENT_SLEEP, 1, 0);
              fMeToo = true;
            }

            // guy collapses
            pSoldier.fMercCollapsedFlag = true;
          }
        }
        // if pretty tired, and not forced to stay awake
        else if ((pSoldier.bBreathMax < BREATHMAX_PRETTY_TIRED) && (pSoldier.fForcedToStayAwake == false)) {
          // if not on squad/ in vehicle
          if ((pSoldier.bAssignment >= Enum117.ON_DUTY) && (pSoldier.bAssignment != Enum117.VEHICLE)) {
            // try to go to sleep on your own
            if (SetMercAsleep(pSoldier, false)) {
              if (gGameSettings.fOptions[Enum8.TOPTION_SLEEPWAKE_NOTIFICATION]) {
                // if the first one
                if (fReasonAdded == false) {
                  // tell player about it
                  AddReasonToWaitingListQueue(Enum154.ASLEEP_GOING_AUTO_FOR_UPDATE);
                  TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_SHOW_UPDATE_MENU, 0, 0);

                  fReasonAdded = true;
                }

                AddSoldierToWaitingListQueue(pSoldier);
                fBoxSetUp = true;
              }

              // seems unnecessary now?  ARM
              pSoldier.bOldAssignment = pSoldier.bAssignment;
            }
          } else // tired, in a squad / vehicle
          {
            // if he hasn't complained yet
            if (!pSoldier.fComplainedThatTired) {
              // say quote
              if (fMeToo == false) {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_NEED_SLEEP);
                fMeToo = true;
              } else {
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_ME_TOO);
              }

              pSoldier.fComplainedThatTired = true;
            }
          }
        }
      }
    }
  }

  if (fBoxSetUp) {
    UnPauseGameDuringNextQuote();
    AddDisplayBoxToWaitingQueue();
    fBoxSetUp = false;
  }

  fReasonAdded = false;

  // now handle waking (needs seperate list queue, that's why it has its own loop)
  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pSoldier = Menptr[iCounter];

    if (pSoldier.bActive) {
      if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier)) {
        continue;
      }

      if ((pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.bAssignment == Enum117.IN_TRANSIT)) {
        continue;
      }

      // guys between sectors CAN wake up while between sectors (sleeping in vehicle)...

      // CHECK FOR MERCS WAKING UP

      if (pSoldier.bBreathMax >= BREATHMAX_CANCEL_COLLAPSE) {
        // reset the collapsed flag well before reaching the wakeup state
        pSoldier.fMercCollapsedFlag = false;
      }

      // if asleep
      if (pSoldier.fMercAsleep) {
        // but has had enough rest?
        if (pSoldier.bBreathMax >= BREATHMAX_FULLY_RESTED) {
          // try to wake merc up
          if (SetMercAwake(pSoldier, false, false)) {
            // if not on squad/ in vehicle, tell player about it
            if ((pSoldier.bAssignment >= Enum117.ON_DUTY) && (pSoldier.bAssignment != Enum117.VEHICLE)) {
              if (gGameSettings.fOptions[Enum8.TOPTION_SLEEPWAKE_NOTIFICATION]) {
                if (fReasonAdded == false) {
                  AddReasonToWaitingListQueue(Enum154.ASSIGNMENT_RETURNING_FOR_UPDATE);
                  fReasonAdded = true;
                }

                AddSoldierToWaitingListQueue(pSoldier);
                fBoxSetUp = true;
              }
            }
          }
        }
      }
    }
  }

  if (fBoxSetUp) {
    UnPauseGameDuringNextQuote();
    AddDisplayBoxToWaitingQueue();
    fBoxSetUp = false;
  }

  return;
}

function CanCharacterRepairVehicle(pSoldier: SOLDIERTYPE, iVehicleId: INT32): boolean {
  // is the vehicle valid?
  if (VehicleIdIsValid(iVehicleId) == false) {
    return false;
  }

  // is vehicle destroyed?
  if (pVehicleList[iVehicleId].fDestroyed) {
    return false;
  }

  // is it damaged at all?
  if (!DoesVehicleNeedAnyRepairs(iVehicleId)) {
    return false;
  }

  // it's not Skyrider's helicopter (which isn't damagable/repairable)
  if (iVehicleId == iHelicopterVehicleId) {
    return false;
  }

  // same sector, neither is between sectors, and OK To Use (player owns it) ?
  if (!IsThisVehicleAccessibleToSoldier(pSoldier, iVehicleId)) {
    return false;
  }

  /* Assignment distance limits removed.  Sep/11/98.  ARM
          // if currently loaded sector, are we close enough?
          if( ( pSoldier->sSectorX == gWorldSectorX ) && ( pSoldier->sSectorY == gWorldSectorY ) && ( pSoldier->bSectorZ == gbWorldSectorZ ) )
          {
                  if( PythSpacesAway( pSoldier -> sGridNo, pVehicleList[ iVehicleId ].sGridNo ) > MAX_DISTANCE_FOR_REPAIR )
                  {
                    return( FALSE );
                  }
          }
  */

  return true;
}

function IsRobotInThisSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let pSoldier: SOLDIERTYPE | null;

  pSoldier = GetRobotSoldier();

  if (pSoldier != null) {
    if ((pSoldier.sSectorX == sSectorX) && (pSoldier.sSectorY == sSectorY) && (pSoldier.bSectorZ == bSectorZ) && (pSoldier.fBetweenSectors == false)) {
      return true;
    }
  }

  return false;
}

function GetRobotSoldier(): SOLDIERTYPE | null {
  let pSoldier: SOLDIERTYPE;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;

  // set pSoldier as first in merc ptrs
  pSoldier = MercPtrs[0];

  // go through list of characters, find all who are on this assignment
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if (AM_A_ROBOT(pTeamSoldier)) {
        return pTeamSoldier;
      }
    }
  }

  return null;
}

function CanCharacterRepairRobot(pSoldier: SOLDIERTYPE): boolean {
  let pRobot: SOLDIERTYPE | null;

  // do we in fact have the robot on the team?
  pRobot = GetRobotSoldier();
  if (pRobot == null) {
    return false;
  }

  // if robot isn't damaged at all
  if (pRobot.bLife == pRobot.bLifeMax) {
    return false;
  }

  // is the robot in the same sector
  if (IsRobotInThisSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) == false) {
    return false;
  }

  /* Assignment distance limits removed.  Sep/11/98.  ARM
          // if that sector is currently loaded, check distance to robot
          if( ( pSoldier -> sSectorX == gWorldSectorX ) && ( pSoldier -> sSectorY == gWorldSectorY ) && ( pSoldier -> bSectorZ == gbWorldSectorZ ) )
          {
                  if( PythSpacesAway( pSoldier -> sGridNo, pRobot -> sGridNo ) > MAX_DISTANCE_FOR_REPAIR )
                  {
                    return( FALSE );
                  }
          }
  */

  return true;
}

function HandleRepairOfRobotBySoldier(pSoldier: SOLDIERTYPE, ubRepairPts: UINT8, pfNothingLeftToRepair: Pointer<boolean>): UINT8 {
  let pRobot: SOLDIERTYPE;

  pRobot = <SOLDIERTYPE>GetRobotSoldier();

  // do the actual repairs
  return RepairRobot(pRobot, ubRepairPts, pfNothingLeftToRepair);
}

function RepairRobot(pRobot: SOLDIERTYPE, ubRepairPts: UINT8, pfNothingLeftToRepair: Pointer<boolean>): UINT8 {
  let ubPointsUsed: UINT8 = 0;

  // is it "dead" ?
  if (pRobot.bLife == 0) {
    pfNothingLeftToRepair.value = true;
    return ubPointsUsed;
  }

  // is it "unhurt" ?
  if (pRobot.bLife == pRobot.bLifeMax) {
    pfNothingLeftToRepair.value = true;
    return ubPointsUsed;
  }

  // if we have enough or more than we need
  if (pRobot.bLife + ubRepairPts >= pRobot.bLifeMax) {
    ubPointsUsed = (pRobot.bLifeMax - pRobot.bLife);
    pRobot.bLife = pRobot.bLifeMax;
  } else {
    // not enough, do what we can
    ubPointsUsed = ubRepairPts;
    pRobot.bLife += ubRepairPts;
  }

  if (pRobot.bLife == pRobot.bLifeMax) {
    pfNothingLeftToRepair.value = true;
  } else {
    pfNothingLeftToRepair.value = false;
  }

  return ubPointsUsed;
}

export function SetSoldierAssignment(pSoldier: SOLDIERTYPE, bAssignment: INT8, iParam1: INT32, iParam2: INT32, iParam3: INT32): void {
  switch (bAssignment) {
    case (Enum117.ASSIGNMENT_HOSPITAL):
      if (CanCharacterPatient(pSoldier)) {
        pSoldier.bOldAssignment = pSoldier.bAssignment;
        pSoldier.bBleeding = 0;

        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;

        // remove from squad

        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.ASSIGNMENT_HOSPITAL)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        RebuildCurrentSquad();

        ChangeSoldiersAssignment(pSoldier, Enum117.ASSIGNMENT_HOSPITAL);

        AssignMercToAMovementGroup(pSoldier);
      }
      break;
    case (Enum117.PATIENT):
      if (CanCharacterPatient(pSoldier)) {
        // set as doctor

        /* Assignment distance limits removed.  Sep/11/98.  ARM
                                        if( IsSoldierCloseEnoughToADoctor( pSoldier ) == FALSE )
                                        {
                                                return;
                                        }
        */

        pSoldier.bOldAssignment = pSoldier.bAssignment;

        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;

        // remove from squad
        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.PATIENT)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        ChangeSoldiersAssignment(pSoldier, Enum117.PATIENT);

        AssignMercToAMovementGroup(pSoldier);
      }

      break;
    case (Enum117.DOCTOR):
      if (CanCharacterDoctor(pSoldier)) {
        pSoldier.bOldAssignment = pSoldier.bAssignment;

        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;
        gfRenderPBInterface = true;

        // remove from squad
        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.DOCTOR)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        ChangeSoldiersAssignment(pSoldier, Enum117.DOCTOR);

        MakeSureMedKitIsInHand(pSoldier);
        AssignMercToAMovementGroup(pSoldier);
      }
      break;
    case (Enum117.TRAIN_TOWN):
      if (CanCharacterTrainMilitia(pSoldier)) {
        // train militia
        pSoldier.bOldAssignment = pSoldier.bAssignment;

        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;

        // remove from squad
        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.TRAIN_TOWN)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        ChangeSoldiersAssignment(pSoldier, Enum117.TRAIN_TOWN);

        if (pMilitiaTrainerSoldier == null) {
          if (SectorInfo[SECTOR(pSoldier.sSectorX, pSoldier.sSectorY)].fMilitiaTrainingPaid == false) {
            // show a message to confirm player wants to charge cost
            HandleInterfaceMessageForCostOfTrainingMilitia(pSoldier);
          }
        }

        AssignMercToAMovementGroup(pSoldier);
        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;
        gfRenderPBInterface = true;
      }
      break;
    case (Enum117.TRAIN_SELF):
      if (CanCharacterTrainStat(pSoldier, iParam1, true, false)) {
        // train stat
        pSoldier.bOldAssignment = pSoldier.bAssignment;

        // remove from squad
        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.TRAIN_SELF)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        ChangeSoldiersAssignment(pSoldier, Enum117.TRAIN_SELF);

        AssignMercToAMovementGroup(pSoldier);

        // set stat to train
        pSoldier.bTrainStat = iParam1;

        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;
        gfRenderPBInterface = true;
      }
      break;
    case (Enum117.TRAIN_TEAMMATE):
      if (CanCharacterTrainStat(pSoldier, iParam1, false, true)) {
        pSoldier.bOldAssignment = pSoldier.bAssignment;
        // remove from squad
        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.TRAIN_TEAMMATE)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        ChangeSoldiersAssignment(pSoldier, Enum117.TRAIN_TEAMMATE);
        AssignMercToAMovementGroup(pSoldier);

        // set stat to train
        pSoldier.bTrainStat = iParam1;

        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;
        gfRenderPBInterface = true;
      }
      break;
    case (Enum117.TRAIN_BY_OTHER):
      if (CanCharacterTrainStat(pSoldier, iParam1, true, false)) {
        // train stat
        pSoldier.bOldAssignment = pSoldier.bAssignment;

        // remove from squad
        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.TRAIN_BY_OTHER)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        ChangeSoldiersAssignment(pSoldier, Enum117.TRAIN_BY_OTHER);

        AssignMercToAMovementGroup(pSoldier);

        // set stat to train
        pSoldier.bTrainStat = iParam1;

        // set dirty flag
        fTeamPanelDirty = true;
        fMapScreenBottomDirty = true;
        gfRenderPBInterface = true;
      }
      break;
    case (Enum117.REPAIR):
      if (CanCharacterRepair(pSoldier)) {
        pSoldier.bOldAssignment = pSoldier.bAssignment;

        // remove from squad
        RemoveCharacterFromSquads(pSoldier);

        // remove from any vehicle
        if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
          TakeSoldierOutOfVehicle(pSoldier);
        }

        if ((pSoldier.bAssignment != Enum117.REPAIR) || (pSoldier.fFixingSAMSite != Boolean(iParam1)) || (pSoldier.fFixingRobot != Boolean(iParam2)) || (pSoldier.bVehicleUnderRepairID != iParam3)) {
          SetTimeOfAssignmentChangeForMerc(pSoldier);
        }

        ChangeSoldiersAssignment(pSoldier, Enum117.REPAIR);
        MakeSureToolKitIsInHand(pSoldier);
        AssignMercToAMovementGroup(pSoldier);
        pSoldier.fFixingSAMSite = Boolean(iParam1);
        pSoldier.fFixingRobot = Boolean(iParam2);
        pSoldier.bVehicleUnderRepairID = iParam3;
      }
      break;
    case (Enum117.VEHICLE):
      if (CanCharacterVehicle(pSoldier) && IsThisVehicleAccessibleToSoldier(pSoldier, iParam1)) {
        if (IsEnoughSpaceInVehicle(iParam1)) {
          pSoldier.bOldAssignment = pSoldier.bAssignment;

          // set dirty flag
          fTeamPanelDirty = true;
          fMapScreenBottomDirty = true;
          gfRenderPBInterface = true;

          if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
            TakeSoldierOutOfVehicle(pSoldier);
          }

          // remove from squad
          RemoveCharacterFromSquads(pSoldier);

          if (PutSoldierInVehicle(pSoldier, (iParam1)) == false) {
            AddCharacterToAnySquad(pSoldier);
          } else {
            if ((pSoldier.bAssignment != Enum117.VEHICLE) || (pSoldier.iVehicleId != iParam1)) {
              SetTimeOfAssignmentChangeForMerc(pSoldier);
            }

            pSoldier.iVehicleId = iParam1;
            ChangeSoldiersAssignment(pSoldier, Enum117.VEHICLE);
            AssignMercToAMovementGroup(pSoldier);
          }
        } else {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[18], zVehicleName[pVehicleList[iParam1].ubVehicleType]);
        }
      }
      break;
  }

  return;
}

/* No point in allowing SAM site repair any more.  Jan/13/99.  ARM
BOOLEAN CanSoldierRepairSAM( SOLDIERTYPE *pSoldier, INT8 bRepairPoints)
{
        INT16 sGridNoA = 0, sGridNoB = 0;

        // is the soldier in the sector as the SAM
        if( SoldierInSameSectorAsSAM( pSoldier ) == FALSE )
        {
                return( FALSE );
        }

        // is the soldier close enough to the control panel?
        if( IsSoldierCloseEnoughToSAMControlPanel( pSoldier ) == FALSE )
        {
                return( FALSE );
        }

        //can it be fixed?
        if( IsTheSAMSiteInSectorRepairable( pSoldier -> sSectorX, pSoldier -> sSectorY, pSoldier -> bSectorZ ) == FALSE )
        {
                return( FALSE );
        }

        // is he good enough?  (Because of the division of repair pts in SAM repair formula, a guy with any less that this
        // can't make any headway
        if (bRepairPoints < SAM_SITE_REPAIR_DIVISOR )
        {
                return( FALSE );
        }

        return( TRUE );
}

BOOLEAN IsTheSAMSiteInSectorRepairable( INT16 sSectorX, INT16 sSectorY, INT16 sSectorZ )
{
        INT32 iCounter = 0;
        INT8 bSAMCondition;


        // is the guy above ground, if not, it can't be fixed, now can it?
        if( sSectorZ != 0 )
        {
                return( FALSE );
        }

        for( iCounter = 0; iCounter < NUMBER_OF_SAMS; iCounter++ )
        {
                if( pSamList[ iCounter ] == SECTOR( sSectorX, sSectorY ) )
                {
                        bSAMCondition = StrategicMap[ CALCULATE_STRATEGIC_INDEX( sSectorX, sSectorY ) ].bSAMCondition;

                        if( ( bSAMCondition < 100 ) && ( bSAMCondition >= MIN_CONDITION_TO_FIX_SAM ) )
                        {
                                return( TRUE );
                        }
                        else
                        {
                                // it's not broken at all, or it's beyond repair
                                return( FALSE );
                        }
                }
        }

        // none found
        return( FALSE );
}

BOOLEAN SoldierInSameSectorAsSAM( SOLDIERTYPE *pSoldier )
{
        INT32 iCounter = 0;

        // is the soldier on the surface?
        if( pSoldier -> bSectorZ != 0 )
        {
                return( FALSE );
        }

        // now check each sam site in the list
        for( iCounter = 0; iCounter < NUMBER_OF_SAMS; iCounter++ )
        {
                if( pSamList[ iCounter] == SECTOR( pSoldier -> sSectorX, pSoldier -> sSectorY ) )
                {
                        return( TRUE );
                }
        }

        return( FALSE );
}

BOOLEAN IsSoldierCloseEnoughToSAMControlPanel( SOLDIERTYPE *pSoldier )
{

        INT32 iCounter = 0;

                // now check each sam site in the list
        for( iCounter = 0; iCounter < NUMBER_OF_SAMS; iCounter++ )
        {
                if( pSamList[ iCounter ] == SECTOR( pSoldier -> sSectorX, pSoldier -> sSectorY ) )
                {
// Assignment distance limits removed.  Sep/11/98.  ARM
//			if( ( PythSpacesAway( pSamGridNoAList[ iCounter ], pSoldier -> sGridNo ) < MAX_DISTANCE_FOR_REPAIR )||( PythSpacesAway( pSamGridNoBList[ iCounter ], pSoldier -> sGridNo ) < MAX_DISTANCE_FOR_REPAIR ) )
                        {
                                return( TRUE );
                        }
                }
        }

        return( FALSE );
}
*/

function HandleAssignmentExpansionAndHighLightForAssignMenu(pSoldier: SOLDIERTYPE): boolean {
  if (fShowSquadMenu) {
    // squad menu up?..if so, highlight squad line the previous menu
    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      HighLightBoxLine(ghEpcBox, Enum147.EPC_MENU_ON_DUTY);
    } else {
      HighLightBoxLine(ghAssignmentBox, Enum148.ASSIGN_MENU_ON_DUTY);
    }

    return true;
  } else if (fShowTrainingMenu) {
    // highlight train line the previous menu
    HighLightBoxLine(ghAssignmentBox, Enum148.ASSIGN_MENU_TRAIN);
    return true;
  } else if (fShowRepairMenu) {
    // highlight repair line the previous menu
    HighLightBoxLine(ghAssignmentBox, Enum148.ASSIGN_MENU_REPAIR);
    return true;
  } else if (fShowVehicleMenu) {
    // highlight vehicle line the previous menu
    HighLightBoxLine(ghAssignmentBox, Enum148.ASSIGN_MENU_VEHICLE);
    return true;
  }

  return false;
}

function HandleAssignmentExpansionAndHighLightForTrainingMenu(): boolean {
  if (fShowAttributeMenu) {
    switch (gbTrainingMode) {
      case Enum117.TRAIN_SELF:
        HighLightBoxLine(ghTrainingBox, Enum149.TRAIN_MENU_SELF);
        return true;
      case Enum117.TRAIN_TEAMMATE:
        HighLightBoxLine(ghTrainingBox, Enum149.TRAIN_MENU_TEAMMATES);
        return true;
      case Enum117.TRAIN_BY_OTHER:
        HighLightBoxLine(ghTrainingBox, Enum149.TRAIN_MENU_TRAIN_BY_OTHER);
        return true;

      default:
        Assert(false);
        break;
    }
  }

  return false;
}

/*
BOOLEAN HandleShowingOfUpBox( void )
{

        // if the list is being shown, then show it
        if( fShowUpdateBox == TRUE )
        {
                MarkAllBoxesAsAltered( );
                ShowBox( ghUpdateBox );
                return( TRUE );
        }
        else
        {
                if( IsBoxShown( ghUpdateBox ) )
                {
                        HideBox( ghUpdateBox );
                        fMapPanelDirty = TRUE;
                        gfRenderPBInterface = TRUE;
                        fTeamPanelDirty = TRUE;
                        fMapScreenBottomDirty = TRUE;
                        fCharacterInfoPanelDirty = TRUE;
                }
        }

        return( FALSE );
}
*/

function HandleShowingOfMovementBox(): boolean {
  // if the list is being shown, then show it
  if (fShowMapScreenMovementList == true) {
    MarkAllBoxesAsAltered();
    ShowBox(ghMoveBox);
    return true;
  } else {
    if (IsBoxShown(ghMoveBox)) {
      HideBox(ghMoveBox);
      fMapPanelDirty = true;
      gfRenderPBInterface = true;
      fTeamPanelDirty = true;
      fMapScreenBottomDirty = true;
      fCharacterInfoPanelDirty = true;
    }
  }

  return false;
}

function HandleShadingOfLinesForTrainingMenu(): void {
  let pSoldier: SOLDIERTYPE;
  let iCounter: INT32 = 0;

  // check if valid
  if ((fShowTrainingMenu == false) || (ghTrainingBox == -1)) {
    return;
  }

  pSoldier = GetSelectedAssignSoldier(false);

  // can character practise?
  if (CanCharacterPractise(pSoldier) == false) {
    ShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_SELF);
  } else {
    UnShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_SELF);
  }

  // can character EVER train militia?
  if (BasicCanCharacterTrainMilitia(pSoldier)) {
    // can he train here, now?
    if (CanCharacterTrainMilitia(pSoldier)) {
      // unshade train militia line
      UnShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TOWN);
      UnSecondaryShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TOWN);
    } else {
      SecondaryShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TOWN);
    }
  } else {
    // shade train militia line
    ShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TOWN);
  }

  // can character train teammates?
  if (CanCharacterTrainTeammates(pSoldier) == false) {
    ShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TEAMMATES);
  } else {
    UnShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TEAMMATES);
  }

  // can character be trained by others?
  if (CanCharacterBeTrainedByOther(pSoldier) == false) {
    ShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TRAIN_BY_OTHER);
  } else {
    UnShadeStringInBox(ghTrainingBox, Enum149.TRAIN_MENU_TRAIN_BY_OTHER);
  }

  return;
}

function HandleShadingOfLinesForAttributeMenus(): void {
  // will do the same as updateassignments...but with training pop up box strings
  let pSoldier: SOLDIERTYPE;
  let bAttrib: INT8 = 0;
  let fStatTrainable: boolean;

  if ((fShowTrainingMenu == false) || (ghTrainingBox == -1)) {
    return;
  }

  if ((fShowAttributeMenu == false) || (ghAttributeBox == -1)) {
    return;
  }

  pSoldier = GetSelectedAssignSoldier(false);

  for (bAttrib = 0; bAttrib < Enum146.ATTRIB_MENU_CANCEL; bAttrib++) {
    switch (gbTrainingMode) {
      case Enum117.TRAIN_SELF:
        fStatTrainable = CanCharacterTrainStat(pSoldier, bAttrib, true, false);
        break;
      case Enum117.TRAIN_TEAMMATE:
        // DO allow trainers to be assigned without any partners (students)
        fStatTrainable = CanCharacterTrainStat(pSoldier, bAttrib, false, true);
        break;
      case Enum117.TRAIN_BY_OTHER:
        // DO allow students to be assigned without any partners (trainers)
        fStatTrainable = CanCharacterTrainStat(pSoldier, bAttrib, true, false);
        break;
      default:
        Assert(false);
        fStatTrainable = false;
        break;
    }

    if (fStatTrainable) {
      // also unshade stat
      UnShadeStringInBox(ghAttributeBox, bAttrib);
    } else {
      // shade stat
      ShadeStringInBox(ghAttributeBox, bAttrib);
    }
  }

  return;
}

function ResetAssignmentsForAllSoldiersInSectorWhoAreTrainingTown(pSoldier: SOLDIERTYPE): void {
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let iNumberOnTeam: INT32 = 0;
  let iCounter: INT32 = 0;
  let pCurSoldier: SOLDIERTYPE;

  iNumberOnTeam = gTacticalStatus.Team[OUR_TEAM].bLastID;

  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pCurSoldier = Menptr[iCounter];

    if ((pCurSoldier.bActive) && (pCurSoldier.bLife >= OKLIFE)) {
      if (pCurSoldier.bAssignment == Enum117.TRAIN_TOWN) {
        if ((pCurSoldier.sSectorX == pSoldier.sSectorX) && (pCurSoldier.sSectorY == pSoldier.sSectorY) && (pSoldier.bSectorZ == 0)) {
          AddCharacterToAnySquad(pCurSoldier);
        }
      }
    }
  }

  return;
}

function ReportTrainersTraineesWithoutPartners(): void {
  let pTeamSoldier: SOLDIERTYPE;
  let iCounter: INT32 = 0;
  let iNumberOnTeam: INT32 = 0;
  let fFound: boolean = false;

  iNumberOnTeam = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // check for each instructor
  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pTeamSoldier = Menptr[iCounter];

    if ((pTeamSoldier.bAssignment == Enum117.TRAIN_TEAMMATE) && (pTeamSoldier.bLife > 0)) {
      if (!ValidTrainingPartnerInSameSectorOnAssignmentFound(pTeamSoldier, Enum117.TRAIN_BY_OTHER, pTeamSoldier.bTrainStat)) {
        AssignmentDone(pTeamSoldier, true, true);
      }
    }
  }

  // check each trainee
  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pTeamSoldier = Menptr[iCounter];

    if ((pTeamSoldier.bAssignment == Enum117.TRAIN_BY_OTHER) && (pTeamSoldier.bLife > 0)) {
      if (!ValidTrainingPartnerInSameSectorOnAssignmentFound(pTeamSoldier, Enum117.TRAIN_TEAMMATE, pTeamSoldier.bTrainStat)) {
        AssignmentDone(pTeamSoldier, true, true);
      }
    }
  }

  return;
}

export function SetMercAsleep(pSoldier: SOLDIERTYPE, fGiveWarning: boolean): boolean {
  if (CanCharacterSleep(pSoldier, fGiveWarning)) {
    // put him to sleep
    PutMercInAsleepState(pSoldier);

    // successful
    return true;
  } else {
    // can't sleep for some other reason
    return false;
  }
}

function PutMercInAsleepState(pSoldier: SOLDIERTYPE): boolean {
  if (pSoldier.fMercAsleep == false) {
    if ((gfWorldLoaded) && (pSoldier.bInSector)) {
      if (guiCurrentScreen == Enum26.GAME_SCREEN) {
        ChangeSoldierState(pSoldier, Enum193.GOTO_SLEEP, 1, true);
      } else {
        ChangeSoldierState(pSoldier, Enum193.SLEEPING, 1, true);
      }
    }

    // set merc asleep
    pSoldier.fMercAsleep = true;

    // refresh panels
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;
  }

  return true;
}

export function SetMercAwake(pSoldier: SOLDIERTYPE, fGiveWarning: boolean, fForceHim: boolean): boolean {
  // forcing him skips all normal checks!
  if (!fForceHim) {
    if (!CanCharacterBeAwakened(pSoldier, fGiveWarning)) {
      return false;
    }
  }

  PutMercInAwakeState(pSoldier);
  return true;
}

export function PutMercInAwakeState(pSoldier: SOLDIERTYPE): boolean {
  if (pSoldier.fMercAsleep) {
    if ((gfWorldLoaded) && (pSoldier.bInSector)) {
      if (guiCurrentScreen == Enum26.GAME_SCREEN) {
        ChangeSoldierState(pSoldier, Enum193.WKAEUP_FROM_SLEEP, 1, true);
      } else {
        ChangeSoldierState(pSoldier, Enum193.STANDING, 1, true);
      }
    }

    // set merc awake
    pSoldier.fMercAsleep = false;

    // refresh panels
    fCharacterInfoPanelDirty = true;
    fTeamPanelDirty = true;

    // determine if merc is being forced to stay awake
    if (pSoldier.bBreathMax < BREATHMAX_PRETTY_TIRED) {
      pSoldier.fForcedToStayAwake = true;
    } else {
      pSoldier.fForcedToStayAwake = false;
    }
  }

  return true;
}

export function IsThereASoldierInThisSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  if (fSectorsWithSoldiers[sSectorX + sSectorY * MAP_WORLD_X][bSectorZ] == true) {
    return true;
  }

  return false;
}

// set the time this soldier's assignment changed
export function SetTimeOfAssignmentChangeForMerc(pSoldier: SOLDIERTYPE): void {
  // if someone is being taken off of HOSPITAL then track how much
  // of payment wasn't used up
  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL) {
    giHospitalRefund += CalcPatientMedicalCost(pSoldier);
    pSoldier.bHospitalPriceModifier = 0;
  }

  // set time of last assignment change
  pSoldier.uiLastAssignmentChangeMin = GetWorldTotalMin();

  // assigning new PATIENTs gives a DOCTOR something to do, etc., so set flag to recheck them all.
  // CAN'T DO IT RIGHT AWAY IN HERE 'CAUSE WE TYPICALLY GET CALLED *BEFORE* bAssignment GETS SET TO NEW VALUE!!
  gfReEvaluateEveryonesNothingToDo = true;

  return;
}

// have we spent enough time on assignment for it to count?
function EnoughTimeOnAssignment(pSoldier: SOLDIERTYPE): boolean {
  if (GetWorldTotalMin() - pSoldier.uiLastAssignmentChangeMin >= MINUTES_FOR_ASSIGNMENT_TO_COUNT) {
    return true;
  }

  return false;
}

export function AnyMercInGroupCantContinueMoving(pGroup: GROUP): boolean {
  let pPlayer: PLAYERGROUP | null;
  let pSoldier: SOLDIERTYPE;
  let fMeToo: boolean = false;
  let fGroupMustStop: boolean = false;

  Assert(pGroup);
  Assert(pGroup.fPlayer);

  pPlayer = pGroup.pPlayerList;

  while (pPlayer) {
    // if group has player list...  and a valid first soldier
    if (pPlayer && pPlayer.pSoldier) {
      pSoldier = pPlayer.pSoldier;

      if (PlayerSoldierTooTiredToTravel(pSoldier)) {
        // NOTE: we only complain about it if it's gonna force the group to stop moving!
        fGroupMustStop = true;

        // say quote
        if (fMeToo == false) {
          HandleImportantMercQuote(pSoldier, Enum202.QUOTE_NEED_SLEEP);
          fMeToo = true;
        } else {
          HandleImportantMercQuote(pSoldier, Enum202.QUOTE_ME_TOO);
        }

        // put him to bed
        PutMercInAsleepState(pSoldier);

        // player can't wake him up right away
        pSoldier.fMercCollapsedFlag = true;
      }
    }

    pPlayer = pPlayer.next;
  }

  return fGroupMustStop;
}

export function PlayerSoldierTooTiredToTravel(pSoldier: SOLDIERTYPE): boolean {
  Assert(pSoldier);

  // if this guy ever needs sleep at all
  if (CanChangeSleepStatusForSoldier(pSoldier)) {
    // if walking, or only remaining possible driver for a vehicle group
    if ((pSoldier.bAssignment != Enum117.VEHICLE) || SoldierMustDriveVehicle(pSoldier, pSoldier.iVehicleId, true)) {
      // if awake, but so tired they can't move/drive anymore
      if ((!pSoldier.fMercAsleep) && (pSoldier.bBreathMax < BREATHMAX_GOTTA_STOP_MOVING)) {
        return true;
      }

      // asleep, and can't be awakened?
      if ((pSoldier.fMercAsleep) && !CanCharacterBeAwakened(pSoldier, false)) {
        return true;
      }
    }
  }

  return false;
}

function AssignMercToAMovementGroup(pSoldier: SOLDIERTYPE): boolean {
  // if merc doesn't have a group or is in a vehicle or on a squad assign to group
  let bGroupId: INT8 = 0;

  // on a squad?
  if (pSoldier.bAssignment < Enum117.ON_DUTY) {
    return false;
  }

  // in a vehicle?
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    return false;
  }

  // in transit
  if (pSoldier.bAssignment == Enum117.IN_TRANSIT) {
    return false;
  }

  // in a movement group?
  if (pSoldier.ubGroupID != 0) {
    return false;
  }

  // create group
  bGroupId = CreateNewPlayerGroupDepartingFromSector((pSoldier.sSectorX), (pSoldier.sSectorY));

  if (bGroupId) {
    // add merc
    AddPlayerToGroup(bGroupId, pSoldier);

    // success
    return true;
  }

  return true;
}

function NotifyPlayerOfAssignmentAttemptFailure(bAssignment: INT8): void {
  // notify player
  if (guiCurrentScreen != Enum26.MSG_BOX_SCREEN) {
    DoScreenIndependantMessageBox(pMapErrorString[18], MSG_BOX_FLAG_OK, null);
  } else {
    // use screen msg instead!
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMapErrorString[18]);
  }

  if (bAssignment == Enum117.TRAIN_TOWN) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMapErrorString[48]);
  }
}

export function HandleSelectedMercsBeingPutAsleep(fWakeUp: boolean, fDisplayWarning: boolean): boolean {
  let fSuccess: boolean = true;
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE | null;
  let ubNumberOfSelectedSoldiers: UINT8 = 0;
  let sString: string /* CHAR16[128] */;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    pSoldier = null;

    // if the current character in the list is valid...then grab soldier pointer for the character
    if (gCharactersList[iCounter].fValid) {
      // get the soldier pointer
      pSoldier = Menptr[gCharactersList[iCounter].usSolID];

      if (pSoldier.bActive == false) {
        continue;
      }

      if (iCounter == bSelectedInfoChar) {
        continue;
      }

      if (IsEntryInSelectedListSet(iCounter) == false) {
        continue;
      }

      // don't try to put vehicles, robots, to sleep if they're also selected
      if (CanChangeSleepStatusForCharSlot(iCounter) == false) {
        continue;
      }

      // up the total number of soldiers
      ubNumberOfSelectedSoldiers++;

      if (fWakeUp) {
        // try to wake merc up
        if (SetMercAwake(pSoldier, false, false) == false) {
          fSuccess = false;
        }
      } else {
        // set this soldier asleep
        if (SetMercAsleep(pSoldier, false) == false) {
          fSuccess = false;
        }
      }
    }
  }

  // if there was anyone processed, check for success and inform player of failure
  if (ubNumberOfSelectedSoldiers) {
    if (fSuccess == false) {
      if (fWakeUp) {
        // inform player not everyone could be woke up
        sString = pMapErrorString[27];
      } else {
        // inform player not everyone could be put to sleep
        sString = pMapErrorString[26];
      }

      if (fDisplayWarning) {
        DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
      }
    }
  }

  return fSuccess;
}

export function IsAnyOneOnPlayersTeamOnThisAssignment(bAssignment: INT8): boolean {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  for (iCounter = gTacticalStatus.Team[OUR_TEAM].bFirstID; iCounter <= gTacticalStatus.Team[OUR_TEAM].bLastID; iCounter++) {
    // get the current soldier
    pSoldier = Menptr[iCounter];

    // active?
    if (pSoldier.bActive == false) {
      continue;
    }

    if (pSoldier.bAssignment == bAssignment) {
      return true;
    }
  }

  return false;
}

export function RebuildAssignmentsBox(): void {
  // destroy and recreate assignments box
  if (ghAssignmentBox != -1) {
    RemoveBox(ghAssignmentBox);
    ghAssignmentBox = -1;
  }

  CreateAssignmentsBox();
}

export function BandageBleedingDyingPatientsBeingTreated(): void {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let pDoctor: SOLDIERTYPE | null;
  let iKitSlot: INT32;
  let pKit: OBJECTTYPE;
  let usKitPts: UINT16;
  let uiKitPtsUsed: UINT32;
  let fSomeoneStillBleedingDying: boolean = false;

  for (iCounter = gTacticalStatus.Team[OUR_TEAM].bFirstID; iCounter <= gTacticalStatus.Team[OUR_TEAM].bLastID; iCounter++) {
    // get the soldier
    pSoldier = Menptr[iCounter];

    // check if the soldier is currently active?
    if (pSoldier.bActive == false) {
      continue;
    }

    // and he is bleeding or dying
    if ((pSoldier.bBleeding) || (pSoldier.bLife < OKLIFE)) {
      // if soldier is receiving care
      if ((pSoldier.bAssignment == Enum117.PATIENT) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL) || (pSoldier.bAssignment == Enum117.DOCTOR)) {
        // if in the hospital
        if (pSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL) {
          // this is instantaneous, and doesn't use up any bandages!

          // stop bleeding automatically
          pSoldier.bBleeding = 0;

          if (pSoldier.bLife < OKLIFE) {
            pSoldier.bLife = OKLIFE;
          }
        } else // assigned to DOCTOR/PATIENT
        {
          // see if there's a doctor around who can help him
          pDoctor = AnyDoctorWhoCanHealThisPatient(pSoldier, HEALABLE_EVER);
          if (pDoctor != null) {
            iKitSlot = FindObjClass(pDoctor, IC_MEDKIT);
            if (iKitSlot != NO_SLOT) {
              pKit = pDoctor.inv[iKitSlot];

              usKitPts = TotalPoints(pKit);
              if (usKitPts) {
                uiKitPtsUsed = VirtualSoldierDressWound(pDoctor, pSoldier, pKit, usKitPts, usKitPts);
                UseKitPoints(pKit, uiKitPtsUsed, pDoctor);

                // if he is STILL bleeding or dying
                if ((pSoldier.bBleeding) || (pSoldier.bLife < OKLIFE)) {
                  fSomeoneStillBleedingDying = true;
                }
              }
            }
          }
        }
      }
    }
  }

  // this event may be posted many times because of multiple assignment changes.  Handle it only once per minute!
  DeleteAllStrategicEventsOfType(Enum132.EVENT_BANDAGE_BLEEDING_MERCS);

  if (fSomeoneStillBleedingDying) {
    AddStrategicEvent(Enum132.EVENT_BANDAGE_BLEEDING_MERCS, GetWorldTotalMin() + 1, 0);
  }
}

export function ReEvaluateEveryonesNothingToDo(): void {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let fNothingToDo: boolean;

  for (iCounter = 0; iCounter <= gTacticalStatus.Team[OUR_TEAM].bLastID; iCounter++) {
    pSoldier = Menptr[iCounter];

    if (pSoldier.bActive) {
      switch (pSoldier.bAssignment) {
        case Enum117.DOCTOR:
          fNothingToDo = !CanCharacterDoctor(pSoldier) || (GetNumberThatCanBeDoctored(pSoldier, HEALABLE_EVER, false, false) == 0);
          break;

        case Enum117.PATIENT:
          fNothingToDo = !CanCharacterPatient(pSoldier) || (AnyDoctorWhoCanHealThisPatient(pSoldier, HEALABLE_EVER) == null);
          break;

        case Enum117.ASSIGNMENT_HOSPITAL:
          fNothingToDo = !CanCharacterPatient(pSoldier);
          break;

        case Enum117.REPAIR:
          fNothingToDo = !CanCharacterRepair(pSoldier) || HasCharacterFinishedRepairing(pSoldier);
          break;

        case Enum117.TRAIN_TOWN:
          fNothingToDo = !CanCharacterTrainMilitia(pSoldier);
          break;

        case Enum117.TRAIN_SELF:
          fNothingToDo = !CanCharacterTrainStat(pSoldier, pSoldier.bTrainStat, true, false);
          break;

        case Enum117.TRAIN_TEAMMATE:
          fNothingToDo = !CanCharacterTrainStat(pSoldier, pSoldier.bTrainStat, false, true) || !ValidTrainingPartnerInSameSectorOnAssignmentFound(pSoldier, Enum117.TRAIN_BY_OTHER, pSoldier.bTrainStat);
          break;

        case Enum117.TRAIN_BY_OTHER:
          fNothingToDo = !CanCharacterTrainStat(pSoldier, pSoldier.bTrainStat, true, false) || !ValidTrainingPartnerInSameSectorOnAssignmentFound(pSoldier, Enum117.TRAIN_TEAMMATE, pSoldier.bTrainStat);
          break;

        case Enum117.VEHICLE:
        default: // squads
          fNothingToDo = false;
          break;
      }

      // if his flag is wrong
      if (fNothingToDo != pSoldier.fDoneAssignmentAndNothingToDoFlag) {
        // update it!
        pSoldier.fDoneAssignmentAndNothingToDoFlag = fNothingToDo;

        // update mapscreen's character list display
        fDrawCharacterList = true;
      }

      // if he now has something to do, reset the quote flag
      if (!fNothingToDo) {
        pSoldier.usQuoteSaidExtFlags &= ~SOLDIER_QUOTE_SAID_DONE_ASSIGNMENT;
      }
    }
  }

  // re-evaluation completed
  gfReEvaluateEveryonesNothingToDo = false;

  // redraw the map, in case we're showing teams, and someone just came on duty or off duty, their icon needs updating
  fMapPanelDirty = true;
}

export function SetAssignmentForList(bAssignment: INT8, bParam: INT8): void {
  let iCounter: INT32 = 0;
  let pSelectedSoldier: SOLDIERTYPE = <SOLDIERTYPE><unknown>null;
  let pSoldier: SOLDIERTYPE;
  let fItWorked: boolean;
  let fRemoveFromSquad: boolean = true;
  let fNotifiedOfFailure: boolean = false;
  let bCanJoinSquad: INT8;

  // if not in mapscreen, there is no functionality available to change multiple assignments simultaneously!
  if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    return;
  }

  // pSelectedSoldier is currently used only for REPAIR, and this block of code is copied from RepairMenuBtnCallback()
  if (bSelectedAssignChar != -1) {
    if (gCharactersList[bSelectedAssignChar].fValid == true) {
      pSelectedSoldier = Menptr[gCharactersList[bSelectedAssignChar].usSolID];
    }
  }

  Assert(pSelectedSoldier && pSelectedSoldier.bActive);

  // sets assignment for the list
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if ((gCharactersList[iCounter].fValid) && (fSelectedListOfMercsForMapScreen[iCounter] == true) && (iCounter != bSelectedAssignChar) && !(Menptr[gCharactersList[iCounter].usSolID].uiStatusFlags & SOLDIER_VEHICLE)) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      // assume it's NOT gonna work
      fItWorked = false;

      switch (bAssignment) {
        case (Enum117.DOCTOR):
          // can character doctor?
          if (CanCharacterDoctor(pSoldier)) {
            // set as doctor
            pSoldier.bOldAssignment = pSoldier.bAssignment;
            SetSoldierAssignment(pSoldier, Enum117.DOCTOR, 0, 0, 0);
            fItWorked = true;
          }
          break;
        case (Enum117.PATIENT):
          // can character patient?
          if (CanCharacterPatient(pSoldier)) {
            // set as patient
            pSoldier.bOldAssignment = pSoldier.bAssignment;
            SetSoldierAssignment(pSoldier, Enum117.PATIENT, 0, 0, 0);
            fItWorked = true;
          }
          break;
        case (Enum117.VEHICLE):
          if (CanCharacterVehicle(pSoldier) && IsThisVehicleAccessibleToSoldier(pSoldier, bParam)) {
            //						if ( IsEnoughSpaceInVehicle( bParam ) )
            {
              // if the vehicle is FULL, then this will return FALSE!
              fItWorked = PutSoldierInVehicle(pSoldier, bParam);
              // failure produces its own error popup
              fNotifiedOfFailure = true;
            }
          }
          break;
        case (Enum117.REPAIR):
          if (CanCharacterRepair(pSoldier)) {
            let fCanFixSpecificTarget: boolean = true;

            // make sure he can repair the SPECIFIC thing being repaired too (must be in its sector, for example)

            /*
                                                            if ( pSelectedSoldier->fFixingSAMSite )
                                                            {
                                                                    fCanFixSpecificTarget = CanSoldierRepairSAM( pSoldier, SAM_SITE_REPAIR_DIVISOR );
                                                            }
                                                            else
            */
            if (pSelectedSoldier.bVehicleUnderRepairID != -1) {
              fCanFixSpecificTarget = CanCharacterRepairVehicle(pSoldier, pSelectedSoldier.bVehicleUnderRepairID);
            } else if (pSoldier.fFixingRobot) {
              fCanFixSpecificTarget = CanCharacterRepairRobot(pSoldier);
            }

            if (fCanFixSpecificTarget) {
              // set as repair
              pSoldier.bOldAssignment = pSoldier.bAssignment;
              SetSoldierAssignment(pSoldier, Enum117.REPAIR, Number(pSelectedSoldier.fFixingSAMSite), Number(pSelectedSoldier.fFixingRobot), pSelectedSoldier.bVehicleUnderRepairID);
              fItWorked = true;
            }
          }
          break;
        case (Enum117.TRAIN_SELF):
          if (CanCharacterTrainStat(pSoldier, bParam, true, false)) {
            pSoldier.bOldAssignment = pSoldier.bAssignment;
            SetSoldierAssignment(pSoldier, Enum117.TRAIN_SELF, bParam, 0, 0);
            fItWorked = true;
          }
          break;
        case (Enum117.TRAIN_TOWN):
          if (CanCharacterTrainMilitia(pSoldier)) {
            pSoldier.bOldAssignment = pSoldier.bAssignment;
            SetSoldierAssignment(pSoldier, Enum117.TRAIN_TOWN, 0, 0, 0);
            fItWorked = true;
          }
          break;
        case (Enum117.TRAIN_TEAMMATE):
          if (CanCharacterTrainStat(pSoldier, bParam, false, true)) {
            pSoldier.bOldAssignment = pSoldier.bAssignment;
            SetSoldierAssignment(pSoldier, Enum117.TRAIN_TEAMMATE, bParam, 0, 0);
            fItWorked = true;
          }
          break;
        case Enum117.TRAIN_BY_OTHER:
          if (CanCharacterTrainStat(pSoldier, bParam, true, false)) {
            pSoldier.bOldAssignment = pSoldier.bAssignment;
            SetSoldierAssignment(pSoldier, Enum117.TRAIN_BY_OTHER, bParam, 0, 0);
            fItWorked = true;
          }
          break;

        case (Enum117.SQUAD_1):
        case (Enum117.SQUAD_2):
        case (Enum117.SQUAD_3):
        case (Enum117.SQUAD_4):
        case (Enum117.SQUAD_5):
        case (Enum117.SQUAD_6):
        case (Enum117.SQUAD_7):
        case (Enum117.SQUAD_8):
        case (Enum117.SQUAD_9):
        case (Enum117.SQUAD_10):
        case (Enum117.SQUAD_11):
        case (Enum117.SQUAD_12):
        case (Enum117.SQUAD_13):
        case (Enum117.SQUAD_14):
        case (Enum117.SQUAD_15):
        case (Enum117.SQUAD_16):
        case (Enum117.SQUAD_17):
        case (Enum117.SQUAD_18):
        case (Enum117.SQUAD_19):
        case (Enum117.SQUAD_20):
          bCanJoinSquad = CanCharacterSquad(pSoldier, bAssignment);

          // if already in it, don't repor that as an error...
          if ((bCanJoinSquad == CHARACTER_CAN_JOIN_SQUAD) || (bCanJoinSquad == CHARACTER_CANT_JOIN_SQUAD_ALREADY_IN_IT)) {
            if (bCanJoinSquad == CHARACTER_CAN_JOIN_SQUAD) {
              pSoldier.bOldAssignment = pSoldier.bAssignment;

              // is the squad between sectors
              if (Squad[bAssignment][0]) {
                if (Squad[bAssignment][0].fBetweenSectors) {
                  // between sectors, remove from old mvt group
                  if (pSoldier.bOldAssignment >= Enum117.ON_DUTY) {
                    // remove from group
                    // the guy wasn't in a sqaud, but moving through a sector?
                    if (pSoldier.ubGroupID != 0) {
                      // now remove from mvt group
                      RemovePlayerFromGroup(pSoldier.ubGroupID, pSoldier);
                    }
                  }
                }
              }

              if (pSoldier.bOldAssignment == Enum117.VEHICLE) {
                TakeSoldierOutOfVehicle(pSoldier);
              }
              // remove from current squad, if any
              RemoveCharacterFromSquads(pSoldier);

              // able to add, do it
              AddCharacterToSquad(pSoldier, bAssignment);
            }

            fItWorked = true;
            fRemoveFromSquad = false; // already done, would screw it up!
          }
          break;

        default:
          // remove from current vehicle/squad, if any
          if (pSoldier.bAssignment == Enum117.VEHICLE) {
            TakeSoldierOutOfVehicle(pSoldier);
          }
          RemoveCharacterFromSquads(pSoldier);

          AddCharacterToAnySquad(pSoldier);

          fItWorked = true;
          fRemoveFromSquad = false; // already done, would screw it up!
          break;
      }

      if (fItWorked) {
        if (fRemoveFromSquad) {
          // remove him from his old squad if he was on one
          RemoveCharacterFromSquads(pSoldier);
        }

        MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);
      } else {
        // didn't work - report it once
        if (!fNotifiedOfFailure) {
          fNotifiedOfFailure = true;
          NotifyPlayerOfAssignmentAttemptFailure(bAssignment);
        }
      }
    }
  }
  // reset list
  //	ResetSelectedListForMapScreen( );

  // check if we should start/stop flashing any mercs' assignment strings after these changes
  gfReEvaluateEveryonesNothingToDo = true;

  return;
}

function IsCharacterAliveAndConscious(pCharacter: SOLDIERTYPE): boolean {
  // is the character alive and conscious?
  if (pCharacter.bLife < CONSCIOUSNESS) {
    return false;
  }

  return true;
}

function ValidTrainingPartnerInSameSectorOnAssignmentFound(pTargetSoldier: SOLDIERTYPE, bTargetAssignment: INT8, bTargetStat: INT8): boolean {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let fFound: boolean = false;
  let sTrainingPts: INT16 = 0;
  let fAtGunRange: boolean = false;
  let usMaxPts: UINT16;

  // this function only makes sense for training teammates or by others, not for self training which doesn't require partners
  Assert((bTargetAssignment == Enum117.TRAIN_TEAMMATE) || (bTargetAssignment == Enum117.TRAIN_BY_OTHER));

  for (iCounter = 0; iCounter <= gTacticalStatus.Team[OUR_TEAM].bLastID; iCounter++) {
    pSoldier = Menptr[iCounter];

    if (pSoldier.bActive) {
      // if the guy is not the target, has the assignment we want, is training the same stat, and is in our sector, alive
      // and is training the stat we want
      if ((pSoldier != pTargetSoldier) && (pSoldier.bAssignment == bTargetAssignment) &&
          // CJC: this seems incorrect in light of the check for bTargetStat and in any case would
          // cause a problem if the trainer was assigned and we weren't!
          //( pSoldier -> bTrainStat == pTargetSoldier -> bTrainStat ) &&
          (pSoldier.sSectorX == pTargetSoldier.sSectorX) && (pSoldier.sSectorY == pTargetSoldier.sSectorY) && (pSoldier.bSectorZ == pTargetSoldier.bSectorZ) && (pSoldier.bTrainStat == bTargetStat) && (pSoldier.bLife > 0)) {
        // so far so good, now let's see if the trainer can really teach the student anything new

        // are we training in the sector with gun range in Alma?
        if ((pSoldier.sSectorX == GUN_RANGE_X) && (pSoldier.sSectorY == GUN_RANGE_Y) && (pSoldier.bSectorZ == GUN_RANGE_Z)) {
          fAtGunRange = true;
        }

        if (pSoldier.bAssignment == Enum117.TRAIN_TEAMMATE) {
          // pSoldier is the instructor, target is the student
          sTrainingPts = GetBonusTrainingPtsDueToInstructor(pSoldier, pTargetSoldier, bTargetStat, fAtGunRange, addressof(usMaxPts));
        } else {
          // target is the instructor, pSoldier is the student
          sTrainingPts = GetBonusTrainingPtsDueToInstructor(pTargetSoldier, pSoldier, bTargetStat, fAtGunRange, addressof(usMaxPts));
        }

        if (sTrainingPts > 0) {
          // yes, then he makes a valid training partner for us!
          return true;
        }
      }
    }
  }

  // no one found
  return false;
}

export function UnEscortEPC(pSoldier: SOLDIERTYPE): void {
  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    let fGotInfo: boolean;
    let usQuoteNum: UINT16;
    let usFactToSetToTrue: UINT16;

    SetupProfileInsertionDataForSoldier(pSoldier);

    fGotInfo = GetInfoForAbandoningEPC(pSoldier.ubProfile, addressof(usQuoteNum), addressof(usFactToSetToTrue));
    if (fGotInfo) {
      // say quote usQuoteNum
      gMercProfiles[pSoldier.ubProfile].ubMiscFlags |= PROFILE_MISC_FLAG_FORCENPCQUOTE;
      TacticalCharacterDialogue(pSoldier, usQuoteNum);
      // the flag will be turned off in the remove-epc event
      // gMercProfiles[ pSoldier->ubProfile ].ubMiscFlags &= ~PROFILE_MISC_FLAG_FORCENPCQUOTE;
      SetFactTrue(usFactToSetToTrue);
    }
    SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_REMOVE_EPC, pSoldier.ubProfile, 0, 0, 0, 0);

    HandleFactForNPCUnescorted(pSoldier.ubProfile);

    if (pSoldier.ubProfile == Enum268.JOHN) {
      let pSoldier2: SOLDIERTYPE | null /* Pointer<SOLDIERTYPE> */;

      // unrecruit Mary as well
      pSoldier2 = FindSoldierByProfileID(Enum268.MARY, true);
      if (pSoldier2) {
        SetupProfileInsertionDataForSoldier(pSoldier2);
        fGotInfo = GetInfoForAbandoningEPC(Enum268.MARY, addressof(usQuoteNum), addressof(usFactToSetToTrue));
        if (fGotInfo) {
          // say quote usQuoteNum
          gMercProfiles[Enum268.MARY].ubMiscFlags |= PROFILE_MISC_FLAG_FORCENPCQUOTE;
          TacticalCharacterDialogue(pSoldier2, usQuoteNum);
          // the flag will be turned off in the remove-epc event
          // gMercProfiles[ MARY ].ubMiscFlags &= ~PROFILE_MISC_FLAG_FORCENPCQUOTE;
          SetFactTrue(usFactToSetToTrue);
        }

        SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_REMOVE_EPC, Enum268.MARY, 0, 0, 0, 0);
      }
    } else if (pSoldier.ubProfile == Enum268.MARY) {
      let pSoldier2: SOLDIERTYPE | null /* Pointer<SOLDIERTYPE> */;

      // unrecruit John as well
      pSoldier2 = FindSoldierByProfileID(Enum268.JOHN, true);
      if (pSoldier2) {
        SetupProfileInsertionDataForSoldier(pSoldier2);
        fGotInfo = GetInfoForAbandoningEPC(Enum268.JOHN, addressof(usQuoteNum), addressof(usFactToSetToTrue));
        if (fGotInfo) {
          // say quote usQuoteNum
          gMercProfiles[Enum268.JOHN].ubMiscFlags |= PROFILE_MISC_FLAG_FORCENPCQUOTE;
          TacticalCharacterDialogue(pSoldier2, usQuoteNum);
          // the flag will be turned off in the remove-epc event
          // gMercProfiles[ JOHN ].ubMiscFlags &= ~PROFILE_MISC_FLAG_FORCENPCQUOTE;
          SetFactTrue(usFactToSetToTrue);
        }
        SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_REMOVE_EPC, Enum268.JOHN, 0, 0, 0, 0);
      }
    }
    // stop showing menu
    giAssignHighLine = -1;

    // set dirty flag
    fTeamPanelDirty = true;
    fMapScreenBottomDirty = true;
    fCharacterInfoPanelDirty = true;
  } else {
    // how do we handle this if it's the right sector?
    TriggerNPCWithGivenApproach(pSoldier.ubProfile, Enum296.APPROACH_EPC_IN_WRONG_SECTOR, true);
  }
}

function CharacterIsTakingItEasy(pSoldier: SOLDIERTYPE): boolean {
  // actually asleep?
  if (pSoldier.fMercAsleep == true) {
    return true;
  }

  // if able to sleep
  if (CanCharacterSleep(pSoldier, false)) {
    // on duty, but able to catch naps (either not traveling, or not the driver of the vehicle)
    // The actual checks for this are in the "can he sleep" check above
    if ((pSoldier.bAssignment < Enum117.ON_DUTY) || (pSoldier.bAssignment == Enum117.VEHICLE)) {
      return true;
    }

    // and healing up?
    if ((pSoldier.bAssignment == Enum117.PATIENT) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_HOSPITAL)) {
      return true;
    }

    // on a real assignment, but done with it?
    if (pSoldier.fDoneAssignmentAndNothingToDoFlag) {
      return true;
    }
  }

  // on assignment, or walking/driving & unable to sleep
  return false;
}

function CalcSoldierNeedForSleep(pSoldier: SOLDIERTYPE): UINT8 {
  let ubNeedForSleep: UINT8;
  let ubPercentHealth: UINT8;

  // base comes from profile
  ubNeedForSleep = gMercProfiles[pSoldier.ubProfile].ubNeedForSleep;

  ubPercentHealth = pSoldier.bLife / pSoldier.bLifeMax;

  if (ubPercentHealth < 75) {
    ubNeedForSleep++;

    if (ubPercentHealth < 50) {
      ubNeedForSleep++;

      if (ubPercentHealth < 25) {
        ubNeedForSleep += 2;
      }
    }
  }

  // reduce for each Night Ops or Martial Arts trait
  ubNeedForSleep -= NUM_SKILL_TRAITS(pSoldier, Enum269.NIGHTOPS);
  ubNeedForSleep -= NUM_SKILL_TRAITS(pSoldier, Enum269.MARTIALARTS);

  if (ubNeedForSleep < 4) {
    ubNeedForSleep = 4;
  }

  if (ubNeedForSleep > 12) {
    ubNeedForSleep = 12;
  }

  return ubNeedForSleep;
}

function GetLastSquadListedInSquadMenu(): UINT32 {
  let uiMaxSquad: UINT32;

  uiMaxSquad = GetLastSquadActive() + 1;

  if (uiMaxSquad >= Enum275.NUMBER_OF_SQUADS) {
    uiMaxSquad = Enum275.NUMBER_OF_SQUADS - 1;
  }

  return uiMaxSquad;
}

function CanCharacterRepairAnotherSoldiersStuff(pSoldier: SOLDIERTYPE, pOtherSoldier: SOLDIERTYPE): boolean {
  if (pOtherSoldier == pSoldier) {
    return false;
  }
  if (!pOtherSoldier.bActive) {
    return false;
  }
  if (pOtherSoldier.bLife == 0) {
    return false;
  }
  if (pOtherSoldier.sSectorX != pSoldier.sSectorX || pOtherSoldier.sSectorY != pSoldier.sSectorY || pOtherSoldier.bSectorZ != pSoldier.bSectorZ) {
    return false;
  }

  if (pOtherSoldier.fBetweenSectors) {
    return false;
  }

  if ((pOtherSoldier.bAssignment == Enum117.IN_TRANSIT) || (pOtherSoldier.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || (AM_A_ROBOT(pSoldier)) || (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) || (pOtherSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD)) {
    return false;
  }

  return true;
}

function GetSelectedAssignSoldier(fNullOK: boolean): SOLDIERTYPE {
  let pSoldier: SOLDIERTYPE = <SOLDIERTYPE><unknown>undefined;

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    // mapscreen version
    if ((bSelectedAssignChar >= 0) && (bSelectedAssignChar < MAX_CHARACTER_COUNT) && (gCharactersList[bSelectedAssignChar].fValid)) {
      pSoldier = Menptr[gCharactersList[bSelectedAssignChar].usSolID];
    }
  } else {
    // tactical version
    pSoldier = Menptr[gusUIFullTargetID];
  }

  if (!fNullOK) {
    Assert(pSoldier);
    if (!pSoldier) {
      throw new Error('Should be unreachable');
    }
  }

  if (pSoldier != null) {
    // better be an active person, not a vehicle
    Assert(pSoldier.bActive);
    Assert(!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE));
  }

  return pSoldier;
}

export function ResumeOldAssignment(pSoldier: SOLDIERTYPE): void {
  let fOldAssignmentInvalid: boolean = false;

  // ARM: I don't think the whole "old assignment" idea is a very good one, and I doubt the code that maintains that
  // variable is very foolproof, plus what meaning does the old assignemnt have later, anyway?
  // so I'd rather just settle for putting him into any squad:
  fOldAssignmentInvalid = true;

  /*
          if ( pSoldier->bOldAssignment == pSoldier->bAssigment )
          {
                  // no good: we rely on this to make sure guys training militia STOP training militia!
                  fOldAssignmentInvalid = TRUE;
          }
          else if( pSoldier->bOldAssignment == VEHICLE )
          {
                  SetSoldierAssignment( pSoldier, ( INT8 )( pSoldier->bOldAssignment ), ( pSoldier->iVehicleId ), 0, 0 );

                  // it might not work - check
                  if ( pSoldier->bAssignment != VEHICLE )
                  {
                          fOldAssignmentInvalid = TRUE;
                  }
          }
          else if( pSoldier->bOldAssignment < ON_DUTY )
          {
                  if( AddCharacterToSquad( pSoldier, pSoldier->bOldAssignment ) == FALSE )
                  {
                          fOldAssignmentInvalid = TRUE;
                  }
          }
          else
          {
                  fOldAssignmentInvalid = TRUE;
          }
  */

  if (fOldAssignmentInvalid) {
    AddCharacterToAnySquad(pSoldier);
  }

  // make sure the player has time to OK this before proceeding
  StopTimeCompression();

  // assignment has changed, redraw left side as well as the map (to update on/off duty icons)
  fTeamPanelDirty = true;
  fCharacterInfoPanelDirty = true;
  fMapPanelDirty = true;
}

function RepairItemsOnOthers(pSoldier: SOLDIERTYPE, pubRepairPtsLeft: Pointer<UINT8>): void {
  let ubPassType: UINT8;
  let bLoop: INT8;
  let bPocket: INT8;
  let pOtherSoldier: SOLDIERTYPE;
  let pBestOtherSoldier: SOLDIERTYPE | null;
  let bPriority: INT8;
  let bBestPriority: INT8 = -1;
  let fSomethingWasRepairedThisPass: boolean;

  // repair everyone's hands and armor slots first, then headgear, and pockets last
  for (ubPassType = Enum116.REPAIR_HANDS_AND_ARMOR; ubPassType <= FINAL_REPAIR_PASS; ubPassType++) {
    fSomethingWasRepairedThisPass = false;

    // look for jammed guns on other soldiers in sector and unjam them
    for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; bLoop < gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++) {
      pOtherSoldier = MercPtrs[bLoop];

      // check character is valid, alive, same sector, not between, has inventory, etc.
      if (CanCharacterRepairAnotherSoldiersStuff(pSoldier, pOtherSoldier)) {
        if (UnjamGunsOnSoldier(pOtherSoldier, pSoldier, pubRepairPtsLeft)) {
          fSomethingWasRepairedThisPass = true;
        }
      }
    }

    while (pubRepairPtsLeft.value > 0) {
      bBestPriority = -1;
      pBestOtherSoldier = null;

      // now look for items to repair on other mercs
      for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; bLoop < gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++) {
        pOtherSoldier = MercPtrs[bLoop];

        // check character is valid, alive, same sector, not between, has inventory, etc.
        if (CanCharacterRepairAnotherSoldiersStuff(pSoldier, pOtherSoldier)) {
          // okay, seems like a candidate!
          if (FindRepairableItemOnOtherSoldier(pOtherSoldier, ubPassType) != NO_SLOT) {
            bPriority = pOtherSoldier.bExpLevel;
            if (bPriority > bBestPriority) {
              bBestPriority = bPriority;
              pBestOtherSoldier = pOtherSoldier;
            }
          }
        }
      }

      // did we find anyone to repair on this pass?
      if (pBestOtherSoldier != null) {
        // yes, repair all items (for this pass type!) on this soldier that need repair
        do {
          bPocket = FindRepairableItemOnOtherSoldier(pBestOtherSoldier, ubPassType);
          if (bPocket != NO_SLOT) {
            if (RepairObject(pSoldier, pBestOtherSoldier, pBestOtherSoldier.inv[bPocket], pubRepairPtsLeft)) {
              fSomethingWasRepairedThisPass = true;
            }
          }
        } while (bPocket != NO_SLOT && pubRepairPtsLeft.value > 0);
      } else {
        break;
      }
    }

    if (fSomethingWasRepairedThisPass && !DoesCharacterHaveAnyItemsToRepair(pSoldier, ubPassType)) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, sRepairsDoneString[1 + ubPassType], pSoldier.name);

      // let player react
      StopTimeCompression();
    }
  }
}

function UnjamGunsOnSoldier(pOwnerSoldier: SOLDIERTYPE, pRepairSoldier: SOLDIERTYPE, pubRepairPtsLeft: Pointer<UINT8>): boolean {
  let fAnyGunsWereUnjammed: boolean = false;
  let bPocket: INT8;

  // try to unjam everything before beginning any actual repairs.. successful unjamming costs 2 points per weapon
  for (bPocket = Enum261.HANDPOS; bPocket <= Enum261.SMALLPOCK8POS; bPocket++) {
    // the object a weapon? and jammed?
    if ((Item[pOwnerSoldier.inv[bPocket].usItem].usItemClass == IC_GUN) && (pOwnerSoldier.inv[bPocket].bGunAmmoStatus < 0)) {
      if (pubRepairPtsLeft.value >= REPAIR_COST_PER_JAM) {
        pubRepairPtsLeft.value -= REPAIR_COST_PER_JAM;

        pOwnerSoldier.inv[bPocket].bGunAmmoStatus *= -1;

        // MECHANICAL/DEXTERITY GAIN: Unjammed a gun
        StatChange(pRepairSoldier, MECHANAMT, 5, 0);
        StatChange(pRepairSoldier, DEXTAMT, 5, 0);

        // report it as unjammed
        if (pRepairSoldier == pOwnerSoldier) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[53], pRepairSoldier.name, ItemNames[pOwnerSoldier.inv[bPocket].usItem]);
        } else {
          // NOTE: may need to be changed for localized versions
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[54], pRepairSoldier.name, pOwnerSoldier.name, ItemNames[pOwnerSoldier.inv[bPocket].usItem]);
        }

        fAnyGunsWereUnjammed = true;
      } else {
        // out of points, we're done for now
        break;
      }
    }
  }

  return fAnyGunsWereUnjammed;
}

}
