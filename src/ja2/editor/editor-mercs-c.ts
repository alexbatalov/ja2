namespace ja2 {

//--------------------------------------------------
//	NON_CIV_GROUP,
//	REBEL_CIV_GROUP,
//	KINGPIN_CIV_GROUP,
//	SANMONA_ARMS_GROUP,
//	ANGELS_GROUP,
//	NUM_CIV_GROUPS
export let gszCivGroupNames: string[] /* UINT16[NUM_CIV_GROUPS][20] */ = [
  "NONE",
  "REBEL",
  "KINGPIN",
  "SANMONA ARMS",
  "ANGELS",

  "BEGGARS",
  "TOURISTS",
  "ALMA MIL",
  "DOCTORS",
  "COUPLE1",

  "HICKS",
  "WARDEN",
  "JUNKYARD",
  "FACTORY KIDS",
  "QUEENS",
  "UNUSED15",
  "UNUSED16",
  "UNUSED17",
  "UNUSED18",
  "UNUSED19",
];

//--------------------------------------------------

//	SCHEDULE_ACTION_NONE,
//	SCHEDULE_ACTION_LOCKDOOR,
//	SCHEDULE_ACTION_UNLOCKDOOR,
//	SCHEDULE_ACTION_OPENDOOR,
//	SCHEDULE_ACTION_CLOSEDOOR,
//	SCHEDULE_ACTION_GRIDNO,
//	SCHEDULE_ACTION_LEAVESECTOR,
//	SCHEDULE_ACTION_ENTERSECTOR,
//	SCHEDULE_ACTION_STAYINSECTOR,
//  SCHEDULE_ACTION_SLEEP,
export let gszScheduleActions: string[] /* UINT16[NUM_SCHEDULE_ACTIONS][20] */ = [
  "No action",
  "Lock door",
  "Unlock door",
  "Open door",
  "Close door",
  "Move to gridno",
  "Leave sector",
  "Enter sector",
  "Stay in sector",
  "Sleep",
  "Ignore this!",
];

const enum Enum40 {
  SCHEDULE_INSTRUCTIONS_NONE,
  SCHEDULE_INSTRUCTIONS_DOOR1,
  SCHEDULE_INSTRUCTIONS_DOOR2,
  SCHEDULE_INSTRUCTIONS_GRIDNO,
  SCHEDULE_INSTRUCTIONS_SLEEP,
  NUM_SCHEDULE_INSTRUCTIONS,
}

export let gfSingleAction: boolean = false;
export let gfUseScheduleData2: boolean = false;
export let gubCurrentScheduleActionIndex: UINT8 = 0;
export let gCurrSchedule: SCHEDULENODE = createScheduleNode();
let gubScheduleInstructions: UINT8 = Enum40.SCHEDULE_INSTRUCTIONS_NONE;

// array which keeps track of which item is in which slot.  This is dependant on the selected merc, so
// these temp values must be updated when different mercs are selected, and reset when a merc detailed
// placement is created.
let gpMercSlotItem: Pointer<OBJECTTYPE>[] /* [9] */ = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];
// Because we only support these nine slots, they aren't continuous values, so this array helps
// processing functions by referring to this array to get the appropriate slot.
export let gbMercSlotTypes: INT8[] /* [9] */ = [
  Enum261.HELMETPOS,
  Enum261.VESTPOS,
  Enum261.LEGPOS,
  Enum261.HANDPOS,
  Enum261.SECONDHANDPOS,
  Enum261.BIGPOCK1POS,
  Enum261.BIGPOCK2POS,
  Enum261.BIGPOCK3POS,
  Enum261.BIGPOCK4POS,
];
// returns the usItem index of specified slot in the currently selected merc.
const GetSelectedMercSlotItemIndex = (x: number) => (gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[x]].usItem);
const GetSelectedMercSlot = (x: number) => (addressof(gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[x]]));
// values indicating which merc inventory slot is hilited and which slot is selected.
let gbCurrHilite: INT8 = -1;
export let gbCurrSelect: INT8 = -1;

// internal merc variables
let gTempBasicPlacement: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
let gTempDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();

export let gsSelectedMercID: INT16;
export let gsSelectedMercGridNo: INT16;
export let gpSelected: Pointer<SOLDIERINITNODE>;

export let gubCurrMercMode: UINT8 = Enum42.MERC_TEAMMODE;
let gubPrevMercMode: UINT8 = Enum42.MERC_NOMODE;
let gubLastDetailedMercMode: UINT8 = Enum42.MERC_GENERALMODE;
let gbDefaultOrders: INT8 = Enum241.STATIONARY;
let gbDefaultAttitude: INT8 = Enum242.DEFENSIVE;
let gbDefaultRelativeEquipmentLevel: INT8 = 2;
let gbDefaultRelativeAttributeLevel: INT8 = 2;
let gbDefaultDirection: INT8 = Enum245.NORTHWEST;
let gubSoldierClass: INT8 = Enum262.SOLDIER_CLASS_ARMY;
let gubCivGroup: UINT8 = Enum246.NON_CIV_GROUP;

let pTempSoldier: Pointer<SOLDIERTYPE>;
export let gfRoofPlacement: boolean;

// Below are all flags that have to do with editing detailed placement mercs:

// Determines if the user is allowed to edit merc colors.  User must specifically
// click on the checkbox by the colors to confirm that colors will be specified.  If
// not, the colors will be randomly generated upon creation in the game.
let gfCanEditMercColors: boolean = false;
// A rendering flag that is set whenever a full update of the merc editing information
// needs to be done.
export let gfRenderMercInfo: boolean = false;
// When the user specifies a profile index for the merc, all editing is disabled.  This is
// because the profile contains all of the information.  When this happens, all of the editing
// buttons are disabled, but you are allowed to view stats, inventory, etc., as well as specify
// orders, attitude, and direction.
let gfCanEditMercs: boolean = true;
// When in inventory mode, this flag is set when the user wishes to get an item, which requires hooking
// into the item editing features.  This is processed during the editor update, which in turn, sets the
// new mode.
export let gfMercGetItem: boolean = false;
// As soon as an item is selected, the items index is stored here, so the item can be copied into the
// slot for editing and rendering purposes.  This is a temp store value only when leaving the editor items
// mode.
export let gusMercsNewItemIndex: UINT16 = 0xffff;

// old and probably obsolete
// BOOLEAN	fMercEdUseLeftSide = FALSE;
// BOOLEAN fEditingMerc = FALSE;
// BOOLEAN fKeepWindowHidden = FALSE;
let iEditMercPage: INT32 = 1;
let iEditMercEnd: INT32 = -1;
let iEditMercBkgrndArea: INT32 = -1;
let iEditMercLocation: INT32;
let iEditStatTimer: INT32 = 0;
let iEditWhichStat: INT32 = -1;
let iEditMercMode: INT32 = EDIT_MERC_NONE;
let iEditMercColorPage: INT32 = -1;
let iEditMercStatPage: INT32 = -1;
let iEditMercFindButton: INT32 = -1;
let iEditMercSlotNumber: INT32;
let iEditColorStart: INT32[] /* [EDIT_NUM_COLORS] */;

export let gfShowPlayers: boolean = true;
export let gfShowEnemies: boolean = true;
export let gfShowCreatures: boolean = true;
export let gfShowRebels: boolean = true;
export let gfShowCivilians: boolean = true;

const BASE_STAT_DEVIATION = 7;
const BASE_EXPLVL_DEVIATION = 1;
const BASE_PROTLVL_DEVIATION = 0;
const BASE_GUNTYPE_DEVIATION = 4;
const DEFAULT_DIFF = 2;

export let sCurBaseDiff: INT16 = DEFAULT_DIFF;
let fAskForBaseDifficulty: boolean = true;
let zDiffNames: string[] /* Pointer<UINT16>[NUM_DIFF_LVLS] */ = [
  "Wimp",
  "Easy",
  "Average",
  "Tough",
  "Steroid Users Only",
];
let sBaseStat: INT16[] /* [NUM_DIFF_LVLS] */ = [
  50,
  60,
  70,
  80,
  90,
];
let sBaseExpLvl: INT16[] /* [NUM_DIFF_LVLS] */ = [
  1,
  3,
  5,
  7,
  9,
];

let EditMercStat: string[] /* Pointer<UINT16>[12] */ = [
  "Max Health",
  "Cur Health",
  "Strength",
  "Agility",
  "Dexterity",
  "Charisma",
  "Wisdom",
  "Marksmanship",
  "Explosives",
  "Medical",
  "Scientific",
  "Exp Level",
];

const NUM_MERC_ORDERS = 8;
let EditMercOrders: string[] /* Pointer<UINT16>[8] */ = [
  "Stationary",
  "On Guard",
  "Close Patrol",
  "Far Patrol",
  "Point Patrol",
  "On Call",
  "Seek Enemy",
  "Random Point Patrol",
];

let EditMercAttitudes: string[] /* Pointer<UINT16>[6] */ = [
  "Defensive",
  "Brave Loner",
  "Brave Buddy",
  "Cunning Loner",
  "Cunning Buddy",
  "Aggressive",
];

// information for bodytypes.
const RANDOM = -1;
const MAX_ENEMYTYPES = 7;
//#define MAX_ENEMYRANDOMTYPES	5
const MAX_CREATURETYPES = 8;
const MAX_REBELTYPES = 7;
const MAX_CIVTYPES = 18;
//#define MAX_CIVRANDOMTYPES		11
let bEnemyArray: INT8[] /* [MAX_ENEMYTYPES] */ = [
  RANDOM,
  Enum194.REGMALE,
  Enum194.BIGMALE,
  Enum194.STOCKYMALE,
  Enum194.REGFEMALE,
  Enum194.TANK_NW,
  Enum194.TANK_NE,
];
let bCreatureArray: INT8[] /* [MAX_CREATURETYPES] */ = [
  Enum194.BLOODCAT,
  Enum194.LARVAE_MONSTER,
  Enum194.INFANT_MONSTER,
  Enum194.YAF_MONSTER,
  Enum194.YAM_MONSTER,
  Enum194.ADULTFEMALEMONSTER,
  Enum194.AM_MONSTER,
  Enum194.QUEENMONSTER,
];
let bRebelArray: INT8[] /* [MAX_REBELTYPES] */ = [
  RANDOM,
  Enum194.FATCIV,
  Enum194.MANCIV,
  Enum194.REGMALE,
  Enum194.BIGMALE,
  Enum194.STOCKYMALE,
  Enum194.REGFEMALE,
];
let bCivArray: INT8[] /* [MAX_CIVTYPES] */ = [
  RANDOM,
  Enum194.FATCIV,
  Enum194.MANCIV,
  Enum194.MINICIV,
  Enum194.DRESSCIV,
  Enum194.HATKIDCIV,
  Enum194.KIDCIV,
  Enum194.REGMALE,
  Enum194.BIGMALE,
  Enum194.STOCKYMALE,
  Enum194.REGFEMALE,
  Enum194.HUMVEE,
  Enum194.ELDORADO,
  Enum194.ICECREAMTRUCK,
  Enum194.JEEP,
  Enum194.CRIPPLECIV,
  Enum194.ROBOTNOWEAPON,
  Enum194.COW,
];
let gbCurrCreature: INT8 = Enum194.BLOODCAT;

let gfSaveBuffer: boolean = false;
export let gSaveBufferBasicPlacement: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
export let gSaveBufferDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();

export function GameInitEditorMercsInfo(): void {
  let i: INT32;
  // Initialize the placement list
  InitSoldierInitList();
  gMapInformation.ubNumIndividuals = 0;
  memset(addressof(gCurrSchedule), 0, sizeof(SCHEDULENODE));
  for (i = 0; i < 4; i++) {
    gCurrSchedule.usTime[i] = 0xffff;
    gCurrSchedule.usData1[i] = 0xffff;
    gCurrSchedule.usData2[i] = 0xffff;
  }
}

export function GameShutdownEditorMercsInfo(): void {
  UseEditorAlternateList();
  KillSoldierInitList();
  UseEditorOriginalList();
  KillSoldierInitList();
}

export function EntryInitEditorMercsInfo(): void {
  let x: INT32;
  let iCurStart: INT32 = 0;
  iEditColorStart[0] = 0;
  for (x = 1; x < EDIT_NUM_COLORS; x++) {
    iCurStart += gubpNumReplacementsPerRange[x - 1];
    iEditColorStart[x] = iCurStart;
  }
  gsSelectedMercID = -1;
  gsSelectedMercGridNo = 0;

  gfCanEditMercs = true;
}

const enum Enum41 {
  HAIR_PAL,
  SKIN_PAL,
  VEST_PAL,
  PANTS_PAL,
}

export function ProcessMercEditing(): void {
  let ubType: UINT8;
  let ubPaletteRep: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  if (iEditMercMode == EDIT_MERC_NONE) {
    return;
  }
  GetSoldier(addressof(pSoldier), gsSelectedMercID);

  switch (iEditMercMode) {
    case EDIT_MERC_PREV_COLOR:
    case EDIT_MERC_NEXT_COLOR:
      // Handle changes to the merc colors
      switch (iEditWhichStat) {
        case 0:
          ubType = EDIT_COLOR_HEAD;
          GetPaletteRepIndexFromID(pSoldier.value.HeadPal, addressof(ubPaletteRep));

          ubPaletteRep--;
          if ((ubPaletteRep < iEditColorStart[ubType]) || (ubPaletteRep > (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType])))
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.HeadPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.HeadPal = pSoldier.value.HeadPal;
          CreateSoldierPalettes(pSoldier);
          break;
        case 1:
          ubType = EDIT_COLOR_HEAD;
          GetPaletteRepIndexFromID(pSoldier.value.HeadPal, addressof(ubPaletteRep));

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.HeadPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.HeadPal = pSoldier.value.HeadPal;
          CreateSoldierPalettes(pSoldier);
          break;

        case 2:
          ubType = EDIT_COLOR_SKIN;
          GetPaletteRepIndexFromID(pSoldier.value.SkinPal, addressof(ubPaletteRep));

          ubPaletteRep--;
          if (ubPaletteRep < iEditColorStart[ubType])
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.SkinPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.SkinPal = pSoldier.value.SkinPal;
          CreateSoldierPalettes(pSoldier);
          break;
        case 3:
          ubType = EDIT_COLOR_SKIN;
          GetPaletteRepIndexFromID(pSoldier.value.SkinPal, addressof(ubPaletteRep));

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.SkinPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.SkinPal = pSoldier.value.SkinPal;
          CreateSoldierPalettes(pSoldier);
          break;

        case 4:
          ubType = EDIT_COLOR_VEST;
          GetPaletteRepIndexFromID(pSoldier.value.VestPal, addressof(ubPaletteRep));

          ubPaletteRep--;
          if (ubPaletteRep < iEditColorStart[ubType])
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.VestPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.VestPal = pSoldier.value.VestPal;
          CreateSoldierPalettes(pSoldier);
          break;
        case 5:
          ubType = EDIT_COLOR_VEST;
          GetPaletteRepIndexFromID(pSoldier.value.VestPal, addressof(ubPaletteRep));

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.VestPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.VestPal = pSoldier.value.VestPal;
          CreateSoldierPalettes(pSoldier);
          break;

        case 6:
          ubType = EDIT_COLOR_PANTS;
          GetPaletteRepIndexFromID(pSoldier.value.PantsPal, addressof(ubPaletteRep));

          ubPaletteRep--;
          if (ubPaletteRep < iEditColorStart[ubType])
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.PantsPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.PantsPal = pSoldier.value.PantsPal;
          CreateSoldierPalettes(pSoldier);
          break;
        case 7:
          ubType = EDIT_COLOR_PANTS;
          GetPaletteRepIndexFromID(pSoldier.value.PantsPal, addressof(ubPaletteRep));

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.PantsPal, gpPalRep[ubPaletteRep].ID);
          gpSelected.value.pDetailedPlacement.value.PantsPal = pSoldier.value.PantsPal;
          CreateSoldierPalettes(pSoldier);
          break;
      }
      iEditMercMode = EDIT_MERC_NONE;
      break;
  }
}

export function AddMercToWorld(iMapIndex: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;

  memset(addressof(gTempBasicPlacement), 0, sizeof(BASIC_SOLDIERCREATE_STRUCT));

  gTempBasicPlacement.bBodyType = -1;

  // calculate specific information based on the team.
  switch (iDrawMode) {
    case Enum38.DRAW_MODE_ENEMY:
      gTempBasicPlacement.bTeam = ENEMY_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubSoldierClass = gubSoldierClass;
      break;
    case Enum38.DRAW_MODE_CREATURE:
      gTempBasicPlacement.bTeam = CREATURE_TEAM;
      gTempBasicPlacement.bBodyType = gbCurrCreature;
      break;
    case Enum38.DRAW_MODE_REBEL:
      gTempBasicPlacement.bTeam = MILITIA_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      break;
    case Enum38.DRAW_MODE_CIVILIAN:
      gTempBasicPlacement.bTeam = CIV_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubCivilianGroup = gubCivGroup;
      if (giCurrentTilesetID == 1) // caves
      {
        gTempBasicPlacement.ubSoldierClass = Enum262.SOLDIER_CLASS_MINER;
      }
      break;
  }

  if (IsLocationSittable(iMapIndex, gfRoofPlacement)) {
    let ubID: UINT8;
    let sSectorX: INT16;
    let sSectorY: INT16;
    let pNode: Pointer<SOLDIERINITNODE>;

    ({ sSectorX, sSectorY } = GetCurrentWorldSector());

    // Set up some general information.
    gTempBasicPlacement.fDetailedPlacement = false;
    gTempBasicPlacement.fPriorityExistance = false;
    gTempBasicPlacement.usStartingGridNo = iMapIndex;
    gTempBasicPlacement.bOrders = gbDefaultOrders;
    gTempBasicPlacement.bAttitude = gbDefaultAttitude;
    gTempBasicPlacement.bRelativeAttributeLevel = gbDefaultRelativeAttributeLevel;
    gTempBasicPlacement.bRelativeEquipmentLevel = gbDefaultRelativeEquipmentLevel;
    gTempBasicPlacement.bDirection = gbDefaultDirection;

    // Generate detailed placement information given the temp placement information.
    CreateDetailedPlacementGivenBasicPlacementInfo(addressof(gTempDetailedPlacement), addressof(gTempBasicPlacement));

    // Set the sector information -- probably unnecessary.
    gTempDetailedPlacement.sSectorX = sSectorX;
    gTempDetailedPlacement.sSectorY = sSectorY;

    // Create the soldier, but don't place it yet.
    if (pSoldier = TacticalCreateSoldier(addressof(gTempDetailedPlacement), addressof(ubID))) {
      pSoldier.value.bVisible = 1;
      pSoldier.value.bLastRenderVisibleValue = 1;
      // Set up the soldier in the list, so we can track the soldier in the
      // future (saving, loading, strategic AI)
      pNode = AddBasicPlacementToSoldierInitList(addressof(gTempBasicPlacement));
      Assert(pNode);
      pNode.value.pSoldier = pSoldier;

      // Add the soldier to physically appear on the map now.
      InternalAddSoldierToSector(ubID, false, false, 0, 0);
      IndicateSelectedMerc(ubID);

      // Move him to the roof if intended and possible.
      if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
        gpSelected.value.pBasicPlacement.value.fOnRoof = true;
        if (gpSelected.value.pDetailedPlacement)
          gpSelected.value.pDetailedPlacement.value.fOnRoof = true;
        SetSoldierHeight(gpSelected.value.pSoldier, 58.0);
      }
      UnclickEditorButtons(FIRST_MERCS_INVENTORY_BUTTON, LAST_MERCS_INVENTORY_BUTTON);
      for (i = FIRST_MERCS_INVENTORY_BUTTON; i <= LAST_MERCS_INVENTORY_BUTTON; i++) {
        SetEnemyDroppableStatus(gbMercSlotTypes[i - FIRST_MERCS_INVENTORY_BUTTON], false);
      }
    }
  }
}

export function HandleRightClickOnMerc(iMapIndex: INT32): void {
  let pNode: Pointer<SOLDIERINITNODE>;
  let sThisMercID: INT16;
  let sCellX: INT16;
  let sCellY: INT16;

  ({ sCellX, sCellY } = ConvertGridNoToCellXY(iMapIndex));

  sThisMercID = IsMercHere(iMapIndex);

  if (sThisMercID != -1) {
    if (gsSelectedMercID != sThisMercID) {
      // We want to edit a new merc (or different merc)
      // We need to avoid the editing of player mercs.
      pNode = FindSoldierInitNodeWithID(sThisMercID);
      if (!pNode)
        return; // this is a player merc (which isn't in the list), or an error in logic.
      IndicateSelectedMerc(sThisMercID);
    }
  } else if (gsSelectedMercID != -1 && IsLocationSittable(iMapIndex, gfRoofPlacement)) // We want to move the selected merc to this new location.
  {
    RemoveAllObjectsOfTypeRange(gsSelectedMercGridNo, Enum313.CONFIRMMOVE, Enum313.CONFIRMMOVE);
    EVENT_SetSoldierPosition(gpSelected.value.pSoldier, (sCellX + 5), (sCellY + 5));
    if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
      gpSelected.value.pBasicPlacement.value.fOnRoof = true;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.fOnRoof = true;
      SetSoldierHeight(gpSelected.value.pSoldier, 58.0);
    } else {
      gpSelected.value.pBasicPlacement.value.fOnRoof = false;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.fOnRoof = false;
      SetSoldierHeight(gpSelected.value.pSoldier, 0.0);
    }
    gsSelectedMercGridNo = iMapIndex;
    gpSelected.value.pBasicPlacement.value.usStartingGridNo = gsSelectedMercGridNo;
    if (gpSelected.value.pDetailedPlacement)
      gpSelected.value.pDetailedPlacement.value.sInsertionGridNo = gsSelectedMercGridNo;
    AddObjectToHead(gsSelectedMercGridNo, Enum312.CONFIRMMOVE1);
  }
}

export function ResetAllMercPositions(): void {
  let curr: Pointer<SOLDIERINITNODE>;
  // Remove all of the alternate placements (editor takes precedence)
  UseEditorAlternateList();
  curr = gSoldierInitHead;
  while (curr) {
    gpSelected = curr;
    curr = curr.value.next;
    RemoveSoldierNodeFromInitList(gpSelected);
  }
  // Now, remove any existing original list mercs, then readd them.
  UseEditorOriginalList();
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pSoldier) {
      TacticalRemoveSoldier(curr.value.pSoldier.value.ubID);
      curr.value.pSoldier = null;
    }
    // usMapIndex = gpSelected->pBasicPlacement->usStartingGridNo;
    // ConvertGridNoToCellXY( usMapIndex, &sCellX, &sCellY );
    // if( gpSelected->pSoldier )
    //{
    //	EVENT_SetSoldierPosition( gpSelected->pSoldier, (FLOAT)(sCellX + 5), (FLOAT)(sCellY + 5) );
    //	if( gpSelected->pBasicPlacement->fOnRoof )
    //		SetSoldierHeight( gpSelected->pSoldier, 58.0 );
    //	SetMercDirection( gpSelected->pBasicPlacement->bDirection );
    //}
    curr = curr.value.next;
  }
  AddSoldierInitListTeamToWorld(ENEMY_TEAM, 255);
  AddSoldierInitListTeamToWorld(CREATURE_TEAM, 255);
  AddSoldierInitListTeamToWorld(MILITIA_TEAM, 255);
  AddSoldierInitListTeamToWorld(CIV_TEAM, 255);
  gpSelected = null;
  gsSelectedMercID = -1;
}

export function AddMercWaypoint(iMapIndex: UINT32): void {
  let iNum: INT32;
  // index 0 isn't used
  if (iActionParam == 0)
    return;

  if (gsSelectedMercID == -1 || (gsSelectedMercID <= gTacticalStatus.Team[OUR_TEAM].bLastID) || gsSelectedMercID >= MAXMERCS)
    return;

  if (iActionParam > gpSelected.value.pSoldier.value.bPatrolCnt) {
    // Fill up missing waypoints with same value as new one
    for (iNum = gpSelected.value.pSoldier.value.bPatrolCnt + 1; iNum <= iActionParam; iNum++) {
      gpSelected.value.pBasicPlacement.value.sPatrolGrid[iNum] = iMapIndex;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.sPatrolGrid[iNum] = iMapIndex;
      gpSelected.value.pSoldier.value.usPatrolGrid[iNum] = iMapIndex;
    }

    gpSelected.value.pBasicPlacement.value.bPatrolCnt = iActionParam;
    if (gpSelected.value.pDetailedPlacement)
      gpSelected.value.pDetailedPlacement.value.bPatrolCnt = iActionParam;
    gpSelected.value.pSoldier.value.bPatrolCnt = iActionParam;
    gpSelected.value.pSoldier.value.bNextPatrolPnt = 1;
  } else {
    // Set this way point
    gpSelected.value.pBasicPlacement.value.sPatrolGrid[iActionParam] = iMapIndex;
    if (gpSelected.value.pDetailedPlacement)
      gpSelected.value.pDetailedPlacement.value.sPatrolGrid[iActionParam] = iMapIndex;
    gpSelected.value.pSoldier.value.usPatrolGrid[iActionParam] = iMapIndex;
  }
  gfRenderWorld = true;
}

export function EraseMercWaypoint(): void {
  let iNum: INT32;
  // index 0 isn't used
  if (iActionParam == 0)
    return;

  if (gsSelectedMercID == -1 || (gsSelectedMercID <= gTacticalStatus.Team[OUR_TEAM].bLastID) || gsSelectedMercID >= MAXMERCS)
    return;

  // Fill up missing areas
  if (iActionParam > gpSelected.value.pSoldier.value.bPatrolCnt)
    return;

  for (iNum = iActionParam; iNum < gpSelected.value.pSoldier.value.bPatrolCnt; iNum++) {
    gpSelected.value.pBasicPlacement.value.sPatrolGrid[iNum] = gpSelected.value.pBasicPlacement.value.sPatrolGrid[iNum + 1];
    if (gpSelected.value.pDetailedPlacement)
      gpSelected.value.pDetailedPlacement.value.sPatrolGrid[iNum] = gpSelected.value.pDetailedPlacement.value.sPatrolGrid[iNum + 1];
    gpSelected.value.pSoldier.value.usPatrolGrid[iNum] = gpSelected.value.pSoldier.value.usPatrolGrid[iNum + 1];
  }

  gpSelected.value.pBasicPlacement.value.bPatrolCnt--;
  if (gpSelected.value.pDetailedPlacement)
    gpSelected.value.pDetailedPlacement.value.bPatrolCnt--;
  gpSelected.value.pSoldier.value.bPatrolCnt--;
  gfRenderWorld = true;
}

//----------------------------------------------------------------------------------------------
//	ChangeBaseSoldierStats
//
//	This functions changes the stats of a given merc (PC or NPC, though should only be used
//	for NPC mercs) to reflect the base difficulty level selected.
//
function ChangeBaseSoldierStats(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier == null)
    return;

  pSoldier.value.bLifeMax = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bLife = pSoldier.value.bLifeMax;

  pSoldier.value.bBleeding = 0;
  pSoldier.value.bBreath = 100;

  pSoldier.value.bMarksmanship = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bMedical = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bMechanical = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bExplosive = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bAgility = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bDexterity = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));

  pSoldier.value.bStrength = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bLeadership = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bWisdom = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));
  pSoldier.value.bScientific = (sBaseStat[sCurBaseDiff] + (Random(BASE_STAT_DEVIATION * 2) - BASE_STAT_DEVIATION));

  pSoldier.value.bExpLevel = sBaseExpLvl[sCurBaseDiff];
  pSoldier.value.bGunType = Random(BASE_GUNTYPE_DEVIATION);

  pSoldier.value.bActionPoints = CalcActionPoints(pSoldier);
}

//----------------------------------------------------------------------------------------------
//	DisplayEditMercWindow
//
//	Displays the edit merc stat page while editing mercs. If the merc color editing page is
//	to be displayed, this function will dispatch it instead.
//
function DisplayEditMercWindow(): void {
  let iXPos: INT32;
  let iYPos: INT32;
  let iHeight: INT32;
  let iWidth: INT32;
  let usFillColorBack: UINT16;
  let usFillColorDark: UINT16;
  let usFillColorLight: UINT16;
  let usFillColorTextBk: UINT16;
  let x: INT32;
  let iXOff: INT32;
  let TempString: string /* INT16[30] */;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let iEditStat: INT8[] /* [12] */;

  usFillColorBack = 0;

  if (gsSelectedMercID == -1) {
    //		fEditingMerc = FALSE;
    //		DestroyEditMercWindow();
    return;
  }

  GetSoldier(addressof(pSoldier), gsSelectedMercID);

  //	usFillColorBack = GenericButtonFillColors[0];
  usFillColorDark = Get16BPPColor(FROMRGB(24, 61, 81));
  usFillColorLight = Get16BPPColor(FROMRGB(136, 138, 135));
  usFillColorTextBk = Get16BPPColor(FROMRGB(250, 240, 188));

  iWidth = 266;
  iHeight = 360;
  iYPos = 0;
  iXPos = 0;

  // Main window
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos, iYPos, iXPos + iWidth, iYPos + iHeight, usFillColorLight);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 1, iYPos + 1, iXPos + iWidth, iYPos + iHeight, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 1, iYPos + 1, iXPos + iWidth - 1, iYPos + iHeight - 1, usFillColorBack);

  SetFont(FONT12POINT1());

  // Name window
  gprintf(iXPos + 128, iYPos + 3, "Merc Name:");
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 128, iYPos + 16, iXPos + 128 + 104, iYPos + 16 + 19, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 17, iXPos + 128 + 104, iYPos + 17 + 19, usFillColorLight);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 17, iXPos + 128 + 103, iYPos + 17 + 18, usFillColorTextBk);
  iXOff = (105 - StringPixLength(pSoldier.value.name, FONT12POINT1())) / 2;
  gprintf(iXPos + 130 + iXOff, iYPos + 20, "%s", pSoldier.value.name);

  // Orders window
  gprintf(iXPos + 128, iYPos + 38, "Orders:");
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 128, iYPos + 51, iXPos + 128 + 104, iYPos + 51 + 19, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 52, iXPos + 128 + 104, iYPos + 52 + 19, usFillColorLight);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 52, iXPos + 128 + 103, iYPos + 52 + 18, usFillColorTextBk);
  iXOff = (105 - StringPixLength(EditMercOrders[pSoldier.value.bOrders], FONT12POINT1())) / 2;
  gprintf(iXPos + 130 + iXOff, iYPos + 55, "%s", EditMercOrders[pSoldier.value.bOrders]);

  // Combat window
  gprintf(iXPos + 128, iYPos + 73, "Combat Attitude:");
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 128, iYPos + 86, iXPos + 128 + 104, iYPos + 86 + 19, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 87, iXPos + 128 + 104, iYPos + 87 + 19, usFillColorLight);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 87, iXPos + 128 + 103, iYPos + 87 + 18, usFillColorTextBk);
  iXOff = (105 - StringPixLength(EditMercAttitudes[pSoldier.value.bAttitude], FONT12POINT1())) / 2;
  gprintf(iXPos + 130 + iXOff, iYPos + 90, "%s", EditMercAttitudes[pSoldier.value.bAttitude]);

  // Get stats
  iEditStat[0] = pSoldier.value.bLifeMax; // 12 13
  iEditStat[1] = pSoldier.value.bLife; // 14 15
  iEditStat[2] = pSoldier.value.bStrength; // 16 17
  iEditStat[3] = pSoldier.value.bAgility; // 18 19
  iEditStat[4] = pSoldier.value.bDexterity; // 20 21
  iEditStat[5] = pSoldier.value.bLeadership; // 22 23
  iEditStat[6] = pSoldier.value.bWisdom; // 24 25
  iEditStat[7] = pSoldier.value.bMarksmanship; // 26 27
  iEditStat[8] = pSoldier.value.bExplosive; // 28 29
  iEditStat[9] = pSoldier.value.bMedical; // 30 31
  iEditStat[10] = pSoldier.value.bScientific; // 32 33
  iEditStat[11] = pSoldier.value.bExpLevel; // 34 35

  // Stat value windows
  for (x = 0; x < 12; x++) {
    gprintf(iXPos + 6, iYPos + 114 + (20 * x), "%s", EditMercStat[x]);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 116, iYPos + 110 + (20 * x), iXPos + 116 + 30, iYPos + 110 + (20 * x) + 19, usFillColorDark);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 117, iYPos + 111 + (20 * x), iXPos + 116 + 30, iYPos + 111 + (20 * x) + 19, usFillColorLight);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 117, iYPos + 111 + (20 * x), iXPos + 116 + 29, iYPos + 111 + (20 * x) + 18, usFillColorTextBk);

    TempString = swprintf("%d", iEditStat[x]);
    iXOff = (30 - StringPixLength(TempString, FONT12POINT1())) / 2;
    gprintf(iXPos + 118 + iXOff, iYPos + 114 + (20 * x), "%s", TempString);
  }
}

//----------------------------------------------------------------------------------------------
//	IsMercHere
//
//	Checks for a soldier at the given map coordinates. If there is one, it returns it's ID number,
//	otherwise it returns -1.
//
function IsMercHere(iMapIndex: INT32): INT32 {
  let IDNumber: INT32;
  let RetIDNumber: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fSoldierFound: boolean;

  RetIDNumber = -1;
  fSoldierFound = false;
  for (IDNumber = 0; IDNumber < MAX_NUM_SOLDIERS && !fSoldierFound; IDNumber++) {
    if (GetSoldier(addressof(pSoldier), IDNumber)) {
      if (pSoldier.value.sGridNo == iMapIndex) {
        fSoldierFound = true;
        RetIDNumber = IDNumber;
      }
    }
  }

  return RetIDNumber;
}

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//	The following are the button callback functions for the merc editing pages
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

function EditMercChangeToStatsPageCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_TO_STATS;
  }
}

function EditMercChangeToColorPageCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_TO_COLOR;
  }
}

function EditMercDoneEditCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_DONE;
  }
}

function EditMercBkgrndCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_DONE;
  }
}

function EditMercPrevOrderCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_PREV_ORDER;
  }
}

function EditMercNextOrderCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NEXT_ORDER;
  }
}

function EditMercPrevAttCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_PREV_ATT;
  }
}

function EditMercNextAttCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NEXT_ATT;
  }
}

function EditMercStatUpCallback(btn: GUI_BUTTON, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 36 && iEditWhichStat == -1; iBtn++) {
      if (btn.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_INC_STAT;
    }

    btn.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NONE;
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function EditMercStatDwnCallback(btn: GUI_BUTTON, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 36 && iEditWhichStat == -1; iBtn++) {
      if (btn.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_DEC_STAT;
    }

    btn.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NONE;
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function EditMercSetDirCallback(btn: GUI_BUTTON, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 36 && iEditWhichStat == -1; iBtn++) {
      if (btn.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_SET_DIR;
    }

    btn.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function EditMercCenterCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_FIND;

    btn.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function EditMercColorDwnCallback(btn: GUI_BUTTON, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 8 && iEditWhichStat == -1; iBtn++) {
      if (btn.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_PREV_COLOR;
    }

    btn.uiFlags |= BUTTON_CLICKED_ON;
  }
}

export function MercsToggleColorModeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) // button is checked
    {
      EnableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
      gpSelected.value.pDetailedPlacement.value.fVisible = true;
      gpSelected.value.pDetailedPlacement.value.HeadPal = gpSelected.value.pSoldier.value.HeadPal;
      gpSelected.value.pDetailedPlacement.value.SkinPal = gpSelected.value.pSoldier.value.SkinPal;
      gpSelected.value.pDetailedPlacement.value.VestPal = gpSelected.value.pSoldier.value.VestPal;
      gpSelected.value.pDetailedPlacement.value.PantsPal = gpSelected.value.pSoldier.value.PantsPal;
    } else // button is unchecked.
    {
      DisableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
      gpSelected.value.pDetailedPlacement.value.fVisible = false;
    }
    gfRenderMercInfo = true;
    gfRenderTaskbar = true;
  }
}

export function MercsSetColorsCallback(btn: GUI_BUTTON, reason: INT32): void {
  let iBtn: INT32;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = FIRST_MERCS_COLOR_BUTTON; iBtn <= LAST_MERCS_COLOR_BUTTON; iBtn++) {
      if (btn.IDNum == iEditorButton[iBtn]) {
        iEditWhichStat = iBtn - FIRST_MERCS_COLOR_BUTTON;
        iEditStatTimer = 0;
        iEditMercMode = EDIT_MERC_NEXT_COLOR;
        gfRenderMercInfo = true;
        return;
      }
    }
  }
}

export function MercsSetBodyTypeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderMercInfo = true;
    if (btn.IDNum == iEditorButton[Enum32.MERCS_BODYTYPE_DOWN])
      ChangeBodyType(1); // next
    else
      ChangeBodyType(-1); // previous
  }
}

function EditMercDecDifficultyCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags |= BUTTON_CLICKED_ON;

    iEditorToolbarState = Enum35.TBAR_MODE_DEC_DIFF;
  }
}

function EditMercIncDifficultyCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags |= BUTTON_CLICKED_ON;

    iEditorToolbarState = Enum35.TBAR_MODE_INC_DIFF;
  }
}

//----------------------------------------------------------------------------------------------
//	ShowEditMercPalettes
//
//	Displays the palette of the given merc (used by the edit merc color page)
//
function ShowEditMercPalettes(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubPaletteRep: UINT8;
  if (!pSoldier)
    ubPaletteRep = 0xff;

  if (pSoldier) {
    if (!pSoldier.value.HeadPal.length)
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.HeadPal, addressof(ubPaletteRep));
  }
  ShowEditMercColorSet(ubPaletteRep, 0);

  if (pSoldier) {
    if (!pSoldier.value.SkinPal.length)
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.SkinPal, addressof(ubPaletteRep));
  }
  ShowEditMercColorSet(ubPaletteRep, 1);

  if (pSoldier) {
    if (!pSoldier.value.VestPal.length)
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.VestPal, addressof(ubPaletteRep));
  }
  ShowEditMercColorSet(ubPaletteRep, 2);

  if (pSoldier) {
    if (!pSoldier.value.VestPal.length)
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.PantsPal, addressof(ubPaletteRep));
  }
  ShowEditMercColorSet(ubPaletteRep, 3);
}

//----------------------------------------------------------------------------------------------
//	ShowEditMercColorSet
//
//	Displays a single palette set. (used by ShowEditMercPalettes)
//
function ShowEditMercColorSet(ubPaletteRep: UINT8, sSet: INT16): void {
  let us16BPPColor: UINT16;
  let usFillColorDark: UINT16;
  let usFillColorLight: UINT16;
  let cnt1: UINT8;
  let ubSize: UINT8;
  let sUnitSize: INT16;
  let sLeft: INT16;
  let sTop: INT16;
  let sRight: INT16;
  let sBottom: INT16;

  if (ubPaletteRep == 0xff)
    ubSize = 16;
  else
    ubSize = gpPalRep[ubPaletteRep].ubPaletteSize;

  sUnitSize = 128 / (ubSize);

  sTop = 364 + (sSet * 24);
  sBottom = sTop + 20;
  sLeft = 230;
  sRight = 359;

  usFillColorDark = Get16BPPColor(FROMRGB(24, 61, 81));
  usFillColorLight = Get16BPPColor(FROMRGB(136, 138, 135));

  // Draw color bar window area
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sLeft, sTop, sRight, sBottom, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sLeft + 1, sTop + 1, sRight, sBottom, usFillColorLight);
  InvalidateRegion(sLeft, sTop, sRight, sBottom);

  sTop++;
  sBottom--;
  sLeft++;
  sRight = sLeft + sUnitSize;

  // Draw the color bar
  for (cnt1 = 0; cnt1 < ubSize; cnt1++) {
    if (cnt1 == (ubSize - 1))
      sRight = 358;
    if (ubPaletteRep == 0xff)
      us16BPPColor = Get16BPPColor(FROMRGB((16 - cnt1) * 10, (16 - cnt1) * 10, (16 - cnt1) * 10));
    else
      us16BPPColor = Get16BPPColor(FROMRGB(gpPalRep[ubPaletteRep].r[cnt1], gpPalRep[ubPaletteRep].g[cnt1], gpPalRep[ubPaletteRep].b[cnt1]));
    ColorFillVideoSurfaceArea(FRAME_BUFFER, sLeft, sTop, sRight, sBottom, us16BPPColor);

    sLeft += sUnitSize;
    sRight += sUnitSize;
  }
}

//----------------------------------------------------------------------------------------------
//	DisplayWayPoints
//
//	Displays the way points of the currently selected merc.
//
export function DisplayWayPoints(): void {
  let sX: INT16;
  let sY: INT16;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let ScrnX: FLOAT;
  let ScrnY: FLOAT;
  let dOffsetX: FLOAT;
  let dOffsetY: FLOAT;
  let bPoint: INT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sGridNo: INT16;

  if (gsSelectedMercID == -1 || (gsSelectedMercID <= gTacticalStatus.Team[OUR_TEAM].bLastID) || gsSelectedMercID >= MAXMERCS)
    return;

  GetSoldier(addressof(pSoldier), gsSelectedMercID);
  if (pSoldier == null || !pSoldier.value.bActive)
    return;

  // point 0 is not used!
  for (bPoint = 1; bPoint <= pSoldier.value.bPatrolCnt; bPoint++) {
    // Get the next point
    sGridNo = pSoldier.value.usPatrolGrid[bPoint];

    // Can we see it?
    if (!GridNoOnVisibleWorldTile(sGridNo))
      continue;

    if ((sGridNo < 0) || (sGridNo > WORLD_MAX))
      continue;

    // Convert it's location to screen coordinates
    ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(sGridNo));

    dOffsetX = (sXMapPos * CELL_X_SIZE) - gsRenderCenterX;
    dOffsetY = (sYMapPos * CELL_Y_SIZE) - gsRenderCenterY;

    ({ dScreenX: ScrnX, dScreenY: ScrnY } = FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

    sScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + ScrnX;
    sScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + ScrnY;

    // Adjust for tiles height factor!
    sScreenY -= gpWorldLevelData[sGridNo].sHeight;
    // Bring it down a touch
    sScreenY += 5;

    if (sScreenY <= 355) {
      // Shown it on screen!
      SetFont(TINYFONT1());
      if (pSoldier.value.bLevel == 1) {
        SetFontBackground(FONT_LTBLUE);
        sScreenY -= 68;
      } else
        SetFontBackground(FONT_LTRED);
      SetFontForeground(FONT_WHITE);
      ({ sX, sY } = VarFindFontCenterCoordinates(sScreenX, sScreenY, 1, 1, TINYFONT1(), "%d", bPoint));
      mprintf(sX, sY, "%d", bPoint);
    }
  }
}

function CreateEditMercWindow(): void {
  let iXPos: INT32;
  let iYPos: INT32;
  let iHeight: INT32;
  let iWidth: INT32;
  let x: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  iWidth = 266;
  iHeight = 360;
  iYPos = 0;
  iXPos = 0;

  GetSoldier(addressof(pSoldier), gsSelectedMercID);
  iEditMercLocation = pSoldier.value.sGridNo;
  gpWorldLevelData[iEditMercLocation].pObjectHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;

  iEditMercBkgrndArea = CreateHotSpot(iXPos, iYPos, iWidth, iHeight, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), EditMercBkgrndCallback);

  iEditMercColorPage = CreateTextButton("Merc Colors", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, (iXPos + 183), (iYPos + 315), 80, 20, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercChangeToColorPageCallback);
  iEditMercEnd = CreateTextButton("Done", FONT12POINT1(), FONT_MCOLOR_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, (iXPos + 183), (iYPos + 337), 80, 20, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercDoneEditCallback);

  // Disable color editing for PC Mercs
  if (gsSelectedMercID >= gTacticalStatus.Team[OUR_TEAM].bFirstID && gsSelectedMercID <= gTacticalStatus.Team[OUR_TEAM].bLastID)
    DisableButton(iEditMercColorPage);

  iEditorButton[8] = QuickCreateButton(giEditMercImage[0], (iXPos + 98), (iYPos + 51), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercPrevOrderCallback);
  iEditorButton[9] = QuickCreateButton(giEditMercImage[1], (iXPos + 233), (iYPos + 51), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercNextOrderCallback);
  SetButtonFastHelpText(iEditorButton[8], "Previous merc standing orders");
  SetButtonFastHelpText(iEditorButton[9], "Next merc standing orders");

  iEditorButton[10] = QuickCreateButton(giEditMercImage[0], (iXPos + 98), (iYPos + 86), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercPrevAttCallback);
  iEditorButton[11] = QuickCreateButton(giEditMercImage[1], (iXPos + 233), (iYPos + 86), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercNextAttCallback);
  SetButtonFastHelpText(iEditorButton[10], "Previous merc combat attitude");
  SetButtonFastHelpText(iEditorButton[11], "Next merc combat attitude");

  iEditorButton[12] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 110), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[13] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 110), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[14] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 130), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[15] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 130), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[16] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 150), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[17] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 150), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[18] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 170), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[19] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 170), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[20] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 190), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[21] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 190), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[22] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 210), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[23] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 210), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[24] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 230), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[25] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 230), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[26] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 250), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[27] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 250), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[28] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 270), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[29] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 270), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[30] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 290), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[31] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 290), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[32] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 310), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[33] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 310), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  iEditorButton[34] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 330), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatDwnCallback);
  iEditorButton[35] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 330), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), EditMercStatUpCallback);

  for (x = 12; x < 36; x += 2) {
    SetButtonFastHelpText(iEditorButton[x], "Decrease merc stat");
    SetButtonFastHelpText(iEditorButton[x + 1], "Increase merc stat");
  }
}
export function SetMercOrders(bOrders: INT8): void {
  gpSelected.value.pSoldier.value.bOrders = bOrders;
  gpSelected.value.pBasicPlacement.value.bOrders = bOrders;
  UnclickEditorButtons(FIRST_MERCS_ORDERS_BUTTON, LAST_MERCS_ORDERS_BUTTON);
  ClickEditorButton(FIRST_MERCS_ORDERS_BUTTON + bOrders);
  gbDefaultOrders = bOrders;
}

export function SetMercAttitude(bAttitude: INT8): void {
  gpSelected.value.pSoldier.value.bAttitude = bAttitude;
  gpSelected.value.pBasicPlacement.value.bAttitude = bAttitude;
  UnclickEditorButtons(FIRST_MERCS_ATTITUDE_BUTTON, LAST_MERCS_ATTITUDE_BUTTON);
  ClickEditorButton(FIRST_MERCS_ATTITUDE_BUTTON + bAttitude);
  gbDefaultAttitude = bAttitude;
}

export function SetMercDirection(bDirection: INT8): void {
  UnclickEditorButtons(FIRST_MERCS_DIRECTION_BUTTON, LAST_MERCS_DIRECTION_BUTTON);
  ClickEditorButton(FIRST_MERCS_DIRECTION_BUTTON + bDirection);

  gbDefaultDirection = bDirection;
  gpSelected.value.pBasicPlacement.value.bDirection = bDirection;

  // ATE: Changed these to call functions....
  EVENT_SetSoldierDirection(gpSelected.value.pSoldier, bDirection);
  EVENT_SetSoldierDesiredDirection(gpSelected.value.pSoldier, bDirection);

  ConvertAniCodeToAniFrame(gpSelected.value.pSoldier, 0);
}

export function SetMercRelativeEquipment(bLevel: INT8): void {
  gpSelected.value.pBasicPlacement.value.bRelativeEquipmentLevel = bLevel;

  UnclickEditorButtons(FIRST_MERCS_REL_EQUIPMENT_BUTTON, LAST_MERCS_REL_EQUIPMENT_BUTTON);
  ClickEditorButton(FIRST_MERCS_REL_EQUIPMENT_BUTTON + bLevel);
  gbDefaultRelativeEquipmentLevel = bLevel;
}

export function SetMercRelativeAttributes(bLevel: INT8): void {
  gpSelected.value.pBasicPlacement.value.bRelativeAttributeLevel = bLevel;
  // We also have to modify the existing soldier incase the user wishes to enter game.
  ModifySoldierAttributesWithNewRelativeLevel(gpSelected.value.pSoldier, bLevel);

  UnclickEditorButtons(FIRST_MERCS_REL_ATTRIBUTE_BUTTON, LAST_MERCS_REL_ATTRIBUTE_BUTTON);
  ClickEditorButton(FIRST_MERCS_REL_ATTRIBUTE_BUTTON + bLevel);
  gbDefaultRelativeAttributeLevel = bLevel;
}

export function IndicateSelectedMerc(sID: INT16): void {
  let prev: Pointer<SOLDIERINITNODE>;
  let bTeam: INT8;

  // If we are trying to select a merc that is already selected, ignore.
  if (sID >= 0 && sID == gsSelectedMercGridNo)
    return;

  // first remove the cursor of the previous merc.
  // NOTE:  It doesn't matter what the value is, even if a merc isn't selected.
  // There is no need to validate the gridNo value, because it is always valid.
  RemoveAllObjectsOfTypeRange(gsSelectedMercGridNo, Enum313.CONFIRMMOVE, Enum313.CONFIRMMOVE);

  // This is very important, because clearing the merc editing mode actually,
  // updates the edited merc.  If this call isn't here, it is possible to update the
  // newly selected merc with the wrong information.
  SetMercEditingMode(Enum42.MERC_NOMODE);

  bTeam = -1;

  // determine selection method
  switch (sID) {
    case Enum43.SELECT_NEXT_MERC:
      prev = gpSelected;
      if (gsSelectedMercID == -1 || !gpSelected) {
        // if no merc selected, then select the first one in list.
        gpSelected = gSoldierInitHead;
      } else {
        // validate this merc in the list.
        if (gpSelected.value.next) {
          // select the next merc in the list
          gpSelected = gpSelected.value.next;
        } else {
          // we are at the end of the list, so select the first merc in the list.
          gpSelected = gSoldierInitHead;
        }
      }
      if (!gpSelected) // list is empty
      {
        SetMercEditability(true);
        SetMercEditingMode(Enum42.MERC_TEAMMODE);
        return;
      }
      while (gpSelected != prev) {
        if (!gpSelected) {
          gpSelected = gSoldierInitHead;
          continue;
        }
        if (gpSelected.value.pSoldier && gpSelected.value.pSoldier.value.bVisible == 1) {
          // we have found a visible soldier, so select him.
          break;
        }
        gpSelected = gpSelected.value.next;
      }
      // we have a valid merc now.
      break;
    case Enum43.SELECT_NO_MERC:
      SetMercEditability(true);
      gpSelected = null;
      gsSelectedMercID = -1;
      gsSelectedGridNo = 0;
      SetMercEditingMode(Enum42.MERC_TEAMMODE);
      return; // we already deselected the previous merc.
    case Enum43.SELECT_NEXT_ENEMY:
      bTeam = ENEMY_TEAM;
      break;
    case Enum43.SELECT_NEXT_CREATURE:
      bTeam = CREATURE_TEAM;
      break;
    case Enum43.SELECT_NEXT_REBEL:
      bTeam = MILITIA_TEAM;
      break;
    case Enum43.SELECT_NEXT_CIV:
      bTeam = CIV_TEAM;
      break;
    default:
      // search for the merc with the specific ID.
      gpSelected = FindSoldierInitNodeWithID(sID);
      if (!gpSelected) {
        gsSelectedMercID = -1;
        gsSelectedGridNo = 0;
        SetMercEditability(true);
        SetMercEditingMode(Enum42.MERC_TEAMMODE);
        return; // Invalid merc ID.
      }
      break;
  }
  if (bTeam != -1) {
    // We are searching for the next occurence of a particular team.
    prev = gpSelected;
    if (gsSelectedMercID == -1 || !gpSelected) {
      // if no merc selected, then select the first one in list.
      gpSelected = gSoldierInitHead;
    } else {
      // validate this merc in the list.
      if (gpSelected.value.next) {
        // select the next merc in the list
        gpSelected = gpSelected.value.next;
      } else {
        // we are at the end of the list, so select the first merc in the list.
        gpSelected = gSoldierInitHead;
      }
    }
    if (!gpSelected) // list is empty
    {
      SetMercEditability(true);
      SetMercEditingMode(Enum42.MERC_TEAMMODE);
      return;
    }
    while (gpSelected != prev) {
      if (!gpSelected) {
        gpSelected = gSoldierInitHead;
        continue;
      }
      if (gpSelected.value.pSoldier && gpSelected.value.pSoldier.value.bVisible == 1 && gpSelected.value.pSoldier.value.bTeam == bTeam) {
        // we have found a visible soldier on the desired team, so select him.
        break;
      }
      gpSelected = gpSelected.value.next;
    }
    if (!gpSelected)
      return;
    if (gpSelected == prev) {
      // we have cycled through the list already, so choose the same guy (if he is on the desired team)...
      if (!gpSelected.value.pSoldier || gpSelected.value.pSoldier.value.bVisible != 1 || gpSelected.value.pSoldier.value.bTeam != bTeam) {
        SetMercEditability(true);
        SetMercEditingMode(Enum42.MERC_TEAMMODE);
        return;
      }
    }
  }
  // if we made it this far, then we have a new merc cursor indicator to draw.
  if (gpSelected.value.pSoldier)
    gsSelectedMercGridNo = gpSelected.value.pSoldier.value.sGridNo;
  else {
    SetMercEditability(true);
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
    return;
  }
  gsSelectedMercID = gpSelected.value.pSoldier.value.ubID;
  AddObjectToHead(gsSelectedMercGridNo, Enum312.CONFIRMMOVE1);

  // If the merc has a valid profile, then turn off editability
  if (gpSelected.value.pDetailedPlacement)
    SetMercEditability((gpSelected.value.pDetailedPlacement.value.ubProfile == NO_PROFILE));
  else
    SetMercEditability(true);

  if (sID < 0) {
    // We want to center the screen on the next merc, and update the interface.
    gsRenderCenterX = gpSelected.value.pSoldier.value.dXPos;
    gsRenderCenterY = gpSelected.value.pSoldier.value.dYPos;
    gfRenderWorld = true;
  }

  // update the merc item slots to reflect what the merc currently has.
  UpdateMercItemSlots();

  // Whatever the case, we want to update the gui to press the appropriate buttons
  // depending on the merc's attributes.
  // Click the appropriate team button
  UnclickEditorButton(Enum32.MERCS_ENEMY);
  UnclickEditorButton(Enum32.MERCS_CREATURE);
  UnclickEditorButton(Enum32.MERCS_REBEL);
  UnclickEditorButton(Enum32.MERCS_CIVILIAN);
  switch (gpSelected.value.pSoldier.value.bTeam) {
    case ENEMY_TEAM:
      ClickEditorButton(Enum32.MERCS_ENEMY);
      iDrawMode = Enum38.DRAW_MODE_ENEMY;
      break;
    case CREATURE_TEAM:
      ClickEditorButton(Enum32.MERCS_CREATURE);
      iDrawMode = Enum38.DRAW_MODE_CREATURE;
      break;
    case MILITIA_TEAM:
      ClickEditorButton(Enum32.MERCS_REBEL);
      iDrawMode = Enum38.DRAW_MODE_REBEL;
      break;
    case CIV_TEAM:
      ClickEditorButton(Enum32.MERCS_CIVILIAN);
      iDrawMode = Enum38.DRAW_MODE_CIVILIAN;
      break;
  }
  // Update the editing mode
  if (gpSelected.value.pDetailedPlacement)
    SetMercEditingMode(gubLastDetailedMercMode);
  else
    SetMercEditingMode(Enum42.MERC_BASICMODE);
  // Determine which team button to press.
  gfRenderMercInfo = true;
  // These calls will set the proper button states, even though it redundantly
  // assigns the soldier with the same orders/attitude.
  SetMercOrders(gpSelected.value.pSoldier.value.bOrders);
  SetMercAttitude(gpSelected.value.pSoldier.value.bAttitude);
  SetMercDirection(gpSelected.value.pSoldier.value.bDirection);
  if (gpSelected.value.pBasicPlacement.value.fPriorityExistance)
    ClickEditorButton(Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX);
  else
    UnclickEditorButton(Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX);
  if (gpSelected.value.pBasicPlacement.value.fHasKeys)
    ClickEditorButton(Enum32.MERCS_HASKEYS_CHECKBOX);
  else
    UnclickEditorButton(Enum32.MERCS_HASKEYS_CHECKBOX);
  if (gpSelected.value.pSoldier.value.ubProfile == NO_PROFILE) {
    SetMercRelativeEquipment(gpSelected.value.pBasicPlacement.value.bRelativeEquipmentLevel);
    SetMercRelativeAttributes(gpSelected.value.pBasicPlacement.value.bRelativeAttributeLevel);
    SetEnemyColorCode(gpSelected.value.pBasicPlacement.value.ubSoldierClass);
  }
  if (iDrawMode == Enum38.DRAW_MODE_CIVILIAN) {
    ChangeCivGroup(gpSelected.value.pSoldier.value.ubCivilianGroup);
  }
}

export function DeleteSelectedMerc(): void {
  if (gsSelectedMercID != -1) {
    RemoveSoldierNodeFromInitList(gpSelected);
    gpSelected = null;
    gsSelectedMercID = -1;
    gfRenderWorld = true;
    if (TextInputMode())
      KillTextInputMode();
    IndicateSelectedMerc(Enum43.SELECT_NO_MERC);
  }
}

function SetupTextInputForMercProfile(): void {
  let str: string /* UINT16[4] */;
  let sNum: INT16;

  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);

  sNum = gpSelected.value.pDetailedPlacement.value.ubProfile;
  if (sNum == NO_PROFILE)
    str[0] = '\0';
  else
    CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.ubProfile, NUM_PROFILES);
  AddTextInputField(200, 430, 30, 20, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
}

function SetupTextInputForMercAttributes(): void {
  let str: string /* UINT16[4] */;

  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);

  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bExpLevel, 100);
  AddTextInputField(200, 365, 20, 15, MSYS_PRIORITY_NORMAL, str, 1, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bLife, 100);
  AddTextInputField(200, 390, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bLifeMax, 100);
  AddTextInputField(200, 415, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bMarksmanship, 100);
  AddTextInputField(200, 440, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bStrength, 100);
  AddTextInputField(300, 365, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bAgility, 100);
  AddTextInputField(300, 390, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bDexterity, 100);
  AddTextInputField(300, 415, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bWisdom, 100);
  AddTextInputField(300, 440, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bLeadership, 100);
  AddTextInputField(400, 365, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bExplosive, 100);
  AddTextInputField(400, 390, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bMedical, 100);
  AddTextInputField(400, 415, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bMechanical, 100);
  AddTextInputField(400, 440, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.bMorale, 100);
  AddTextInputField(500, 365, 20, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);

  if (!gfCanEditMercs)
    DisableAllTextFields();
}

// In the merc editing, all detailed placement values for generated attributes are set to -1.
// When making a generated attribute static, we then set the value to its applicable value.
// This function is similar to the itoa function except that -1 is converted to a null string.
function CalcStringForValue(str: Pointer<string> /* Pointer<UINT16> */, iValue: INT32, uiMax: UINT32): void {
  if (iValue < 0) // a blank string is determined by a negative value.
    str[0] = '\0';
  else if (iValue > uiMax) // higher than max attribute value, so convert it to the max.
    str = swprintf("%d", uiMax);
  else // this is a valid static value, so convert it to a string.
    str = swprintf("%d", iValue);
}

function ExtractAndUpdateMercAttributes(): void {
  // If we have just deleted the merc's detailed placement in the editor, we don't
  // need to extract the information
  if (!gpSelected.value.pDetailedPlacement)
    return;

  // It just so happens that GetNumericStrict...() will return -1 for any blank fields.
  //-1 values in the detailed placement work nicely, because that signifies that specific
  // field isn't static.  Any other value becomes static, and static values override any
  // generated values.
  gpSelected.value.pDetailedPlacement.value.bExpLevel = Math.min(GetNumericStrictValueFromField(0), 100);
  gpSelected.value.pDetailedPlacement.value.bLife = Math.min(GetNumericStrictValueFromField(1), 100);
  gpSelected.value.pDetailedPlacement.value.bLifeMax = Math.min(GetNumericStrictValueFromField(2), 100);
  gpSelected.value.pDetailedPlacement.value.bMarksmanship = Math.min(GetNumericStrictValueFromField(3), 100);
  gpSelected.value.pDetailedPlacement.value.bStrength = Math.min(GetNumericStrictValueFromField(4), 100);
  gpSelected.value.pDetailedPlacement.value.bAgility = Math.min(GetNumericStrictValueFromField(5), 100);
  gpSelected.value.pDetailedPlacement.value.bDexterity = Math.min(GetNumericStrictValueFromField(6), 100);
  gpSelected.value.pDetailedPlacement.value.bWisdom = Math.min(GetNumericStrictValueFromField(7), 100);
  gpSelected.value.pDetailedPlacement.value.bLeadership = Math.min(GetNumericStrictValueFromField(8), 100);
  gpSelected.value.pDetailedPlacement.value.bExplosive = Math.min(GetNumericStrictValueFromField(9), 100);
  gpSelected.value.pDetailedPlacement.value.bMedical = Math.min(GetNumericStrictValueFromField(10), 100);
  gpSelected.value.pDetailedPlacement.value.bMechanical = Math.min(GetNumericStrictValueFromField(11), 100);
  gpSelected.value.pDetailedPlacement.value.bMorale = Math.min(GetNumericStrictValueFromField(11), 100);

  // make sure that experience level ranges between 1 and 9
  if (gpSelected.value.pDetailedPlacement.value.bExpLevel != -1)
    gpSelected.value.pDetailedPlacement.value.bExpLevel = Math.max(Math.min(gpSelected.value.pDetailedPlacement.value.bExpLevel, 9), 1);

  // no such thing as a life max of 0
  if (!gpSelected.value.pDetailedPlacement.value.bLifeMax)
    gpSelected.value.pDetailedPlacement.value.bLifeMax = 1;

  // make sure the life doesn't exceed the maxlife...
  if (gpSelected.value.pDetailedPlacement.value.bLifeMax != -1 && gpSelected.value.pDetailedPlacement.value.bLife != -1 && gpSelected.value.pDetailedPlacement.value.bLife > gpSelected.value.pDetailedPlacement.value.bLifeMax)
    gpSelected.value.pDetailedPlacement.value.bLife = gpSelected.value.pDetailedPlacement.value.bLifeMax;

  // update the soldier
  UpdateSoldierWithStaticDetailedInformation(gpSelected.value.pSoldier, gpSelected.value.pDetailedPlacement);
}

function ExtractAndUpdateMercProfile(): void {
  let sNum: INT16;
  /* static */ let sPrev: INT16 = NO_PROFILE;

  // If we have just deleted the merc's detailed placement in the editor, we don't
  // need to extract the information
  if (!gpSelected.value.pDetailedPlacement)
    return;

  // if the string is blank, returning -1, then set the value to NO_PROFILE
  // because ubProfile is unsigned.
  sNum = Math.min(GetNumericStrictValueFromField(0), NUM_PROFILES);
  if (sNum == -1) {
    gpSelected.value.pDetailedPlacement.value.ubProfile = NO_PROFILE;
    gpSelected.value.pDetailedPlacement.value.fCopyProfileItemsOver = false;
    SetMercEditability(true);
  } else if (sPrev != sNum) {
    gpSelected.value.pDetailedPlacement.value.ubProfile = sNum;
    gpSelected.value.pDetailedPlacement.value.fCopyProfileItemsOver = true;
    gpSelected.value.pBasicPlacement.value.fPriorityExistance = true;
    ClickEditorButton(Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX);
    SetMercEditability(false);
  } else
    return;

  UpdateSoldierWithStaticDetailedInformation(gpSelected.value.pSoldier, gpSelected.value.pDetailedPlacement);
  if (gpSelected.value.pSoldier.value.bTeam == CIV_TEAM) {
    ChangeCivGroup(gpSelected.value.pSoldier.value.ubCivilianGroup);
  }
}

function SetupTextInputForMercSchedule(): void {
  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);
  AddUserInputField(null);
  AddTextInputField(268, 373, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, Enum383.INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(1, gCurrSchedule.usTime[0]);
  AddTextInputField(268, 394, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, Enum383.INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(2, gCurrSchedule.usTime[1]);
  AddTextInputField(268, 415, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, Enum383.INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(3, gCurrSchedule.usTime[2]);
  AddTextInputField(268, 436, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, Enum383.INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(4, gCurrSchedule.usTime[3]);
}

export function ExtractAndUpdateMercSchedule(): void {
  let i: INT32;
  let fValidSchedule: boolean = false;
  let fScheduleNeedsUpdate: boolean = false;
  let pNext: Pointer<SCHEDULENODE> = null;
  if (!gpSelected)
    return;
  // extract all of the fields into a temp schedulenode.
  // memset( &gScheduleNode, 0, sizeof( SCHEDULENODE ) );
  for (i = 0; i < 4; i++) {
    gCurrSchedule.usTime[i] = GetExclusive24HourTimeValueFromField((i + 1));
    gCurrSchedule.ubAction[i] = MSYS_GetBtnUserData(ButtonList[iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1 + i]], 0);
    if (gCurrSchedule.ubAction[i])
      fValidSchedule = true;
  }

  if (!gpSelected.value.pSoldier.value.ubScheduleID) {
    // The soldier doesn't actually have a schedule yet, so create one if necessary (not blank)
    if (fValidSchedule) {
      // create a new schedule
      if (SortSchedule(addressof(gCurrSchedule)))
        fScheduleNeedsUpdate = true;
      CopyScheduleToList(addressof(gCurrSchedule), gpSelected);
      ShowEditorButton(Enum32.MERCS_GLOWSCHEDULE);
      HideEditorButton(Enum32.MERCS_SCHEDULE);
    }
  } else {
    let pSchedule: Pointer<SCHEDULENODE>;
    pSchedule = GetSchedule(gpSelected.value.pSoldier.value.ubScheduleID);
    if (!pSchedule) {
      gpSelected.value.pSoldier.value.ubScheduleID = 0;
      gpSelected.value.pDetailedPlacement.value.ubScheduleID = 0;
      HideEditorButton(Enum32.MERCS_GLOWSCHEDULE);
      ShowEditorButton(Enum32.MERCS_SCHEDULE);
      return;
    }
    if (fValidSchedule) {
      // overwrite the existing schedule with the new one.
      gCurrSchedule.ubScheduleID = gpSelected.value.pSoldier.value.ubScheduleID;
      if (SortSchedule(addressof(gCurrSchedule)))
        fScheduleNeedsUpdate = true;
      pNext = pSchedule.value.next;
      memcpy(pSchedule, addressof(gCurrSchedule), sizeof(SCHEDULENODE));
      pSchedule.value.next = pNext;
    } else {
      // remove the existing schedule, as the new one is blank.
      DeleteSchedule(pSchedule.value.ubScheduleID);
      gpSelected.value.pSoldier.value.ubScheduleID = 0;
      gpSelected.value.pDetailedPlacement.value.ubScheduleID = 0;
      HideEditorButton(Enum32.MERCS_GLOWSCHEDULE);
      ShowEditorButton(Enum32.MERCS_SCHEDULE);
    }
  }
  if (fScheduleNeedsUpdate) {
    // The schedule was sorted, so update the gui.
    UpdateScheduleInfo();
  }
  SetActiveField(0);
}

export function ExtractCurrentMercModeInfo(fKillTextInputMode: boolean): void {
  // This happens if we deleted a merc
  if (gsSelectedMercID == -1)
    return;
  // Extract and update mercs via text fields if applicable
  switch (gubCurrMercMode) {
    case Enum42.MERC_ATTRIBUTEMODE:
      ExtractAndUpdateMercAttributes();
      break;
    case Enum42.MERC_PROFILEMODE:
      ExtractAndUpdateMercProfile();
      break;
    case Enum42.MERC_SCHEDULEMODE:
      ExtractAndUpdateMercSchedule();
      break;
    default:
      fKillTextInputMode = false;
      break;
  }
  if (fKillTextInputMode)
    KillTextInputMode();
}

export function InitDetailedPlacementForMerc(): void {
  Assert(!gpSelected.value.pDetailedPlacement);

  gpSelected.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));

  Assert(gpSelected.value.pDetailedPlacement);

  gpSelected.value.pBasicPlacement.value.fDetailedPlacement = true;
  gpSelected.value.pBasicPlacement.value.fPriorityExistance = false;
  CreateStaticDetailedPlacementGivenBasicPlacementInfo(gpSelected.value.pDetailedPlacement, gpSelected.value.pBasicPlacement);

  ClearCurrentSchedule();

  // update the soldier
  UpdateSoldierWithStaticDetailedInformation(gpSelected.value.pSoldier, gpSelected.value.pDetailedPlacement);
}

export function KillDetailedPlacementForMerc(): void {
  Assert(gpSelected.value.pDetailedPlacement);
  MemFree(gpSelected.value.pDetailedPlacement);
  gpSelected.value.pDetailedPlacement = null;
  gpSelected.value.pBasicPlacement.value.fDetailedPlacement = false;
  SetMercEditability(true);
}

function ChangeBodyType(bOffset: INT8): void //+1 or -1 only
{
  let pbArray: Pointer<INT8>;
  let iMax: INT32;
  let x: INT32;
  let iIndex: INT32;

  gfRenderTaskbar = true;
  gfRenderMercInfo = true;
  // verify that we have a proper offset ( only +-1 allowed )
  Assert(bOffset == -1 || bOffset == 1);
  // get access to information depending on the team
  switch (gpSelected.value.pBasicPlacement.value.bTeam) {
    case ENEMY_TEAM:
      pbArray = bEnemyArray;
      iMax = MAX_ENEMYTYPES;
      break;
    case CREATURE_TEAM:
      pbArray = bCreatureArray;
      iMax = MAX_CREATURETYPES;
      break;
    case MILITIA_TEAM:
      pbArray = bRebelArray;
      iMax = MAX_REBELTYPES;
      break;
    case CIV_TEAM:
      pbArray = bCivArray;
      iMax = MAX_CIVTYPES;
      break;
  }
  // find the matching bodytype index within the array.
  for (x = 0; x < iMax; x++) {
    iIndex = pbArray[x];
    if (iIndex == gpSelected.value.pBasicPlacement.value.bBodyType)
      break;
  }
  Assert(iIndex == gpSelected.value.pBasicPlacement.value.bBodyType);
  // now we have a match, so go to the next element (depending on offset value)
  x += bOffset;
  if (x >= iMax)
    x = 0;
  else if (x < 0)
    x = iMax - 1;
  iIndex = pbArray[x];
  // Set the new bodytype into the and update the soldier info
  if (iIndex != -1) {
    gpSelected.value.pSoldier.value.ubBodyType = iIndex;
    // Set the flags based on the bodytype
    gpSelected.value.pSoldier.value.uiStatusFlags &= ~(SOLDIER_VEHICLE | SOLDIER_ROBOT | SOLDIER_ANIMAL | SOLDIER_MONSTER);
    switch (gpSelected.value.pSoldier.value.ubBodyType) {
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.AM_MONSTER:
      case Enum194.YAF_MONSTER:
      case Enum194.YAM_MONSTER:
      case Enum194.LARVAE_MONSTER:
      case Enum194.INFANT_MONSTER:
      case Enum194.QUEENMONSTER:
        gpSelected.value.pSoldier.value.uiStatusFlags |= SOLDIER_MONSTER;
        break;
      case Enum194.BLOODCAT:
      case Enum194.COW:
      case Enum194.CROW:
        gpSelected.value.pSoldier.value.uiStatusFlags |= SOLDIER_ANIMAL;
        break;
      case Enum194.ROBOTNOWEAPON:
        gpSelected.value.pSoldier.value.uiStatusFlags |= SOLDIER_ROBOT;
        break;
      case Enum194.HUMVEE:
      case Enum194.ELDORADO:
      case Enum194.ICECREAMTRUCK:
      case Enum194.JEEP:
      case Enum194.TANK_NW:
      case Enum194.TANK_NE:
        gpSelected.value.pSoldier.value.uiStatusFlags |= SOLDIER_VEHICLE;
        break;
    }
    SetSoldierAnimationSurface(gpSelected.value.pSoldier, gpSelected.value.pSoldier.value.usAnimState);
  }
  // Update the placement's info as well.
  gpSelected.value.pBasicPlacement.value.bBodyType = iIndex;
  if (gpSelected.value.pDetailedPlacement) {
    gpSelected.value.pDetailedPlacement.value.bBodyType = iIndex;
  }
  if (gpSelected.value.pSoldier.value.bTeam == CREATURE_TEAM) {
    gbCurrCreature = iIndex;
    AssignCreatureInventory(gpSelected.value.pSoldier);
  }
  CreateSoldierPalettes(gpSelected.value.pSoldier);
}

function SetMercEditability(fEditable: boolean): void {
  gfRenderMercInfo = true;
  if (fEditable == gfCanEditMercs)
    return;
  gfCanEditMercs = fEditable;
  if (gfCanEditMercs) {
    // enable buttons to allow editing
    EnableEditorButtons(Enum32.MERCS_EQUIPMENT_BAD, Enum32.MERCS_ATTRIBUTES_GREAT);
    EnableEditorButtons(FIRST_MERCS_COLORMODE_BUTTON, LAST_MERCS_COLORMODE_BUTTON);
    if (gpSelected && gpSelected.value.pDetailedPlacement && !gpSelected.value.pDetailedPlacement.value.fVisible)
      UnclickEditorButton(Enum32.MERCS_TOGGLECOLOR_BUTTON);
    EnableEditorButton(Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX);
    EnableEditorButton(Enum32.MERCS_CIVILIAN_GROUP);
  } else {
    // disable buttons to prevent editing
    DisableEditorButtons(Enum32.MERCS_EQUIPMENT_BAD, Enum32.MERCS_ATTRIBUTES_GREAT);
    DisableEditorButtons(FIRST_MERCS_COLORMODE_BUTTON, LAST_MERCS_COLORMODE_BUTTON);
    ClickEditorButton(Enum32.MERCS_TOGGLECOLOR_BUTTON);
    DisableEditorButton(Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX);
    DisableEditorButton(Enum32.MERCS_CIVILIAN_GROUP);
  }
}

// There are 4 exclusive entry points in a map.  Only one of each type can exist on a
// map, and these points are used to validate the map by attempting to connect the four
// points together.  If one of the points is isolated, then the map will be rejected.  It
// isn't necessary to specify all four points.  You wouldn't want to specify a north point if
// there isn't going to be any traversing to adjacent maps from that side.
export function SpecifyEntryPoint(iMapIndex: UINT32): void {
  let psEntryGridNo: Pointer<INT16>;
  let fErasing: boolean = false;
  if (iDrawMode >= Enum38.DRAW_MODE_ERASE) {
    iDrawMode -= Enum38.DRAW_MODE_ERASE;
    fErasing = true;
  }
  switch (iDrawMode) {
    case Enum38.DRAW_MODE_NORTHPOINT:
      psEntryGridNo = addressof(gMapInformation.sNorthGridNo);
      break;
    case Enum38.DRAW_MODE_WESTPOINT:
      psEntryGridNo = addressof(gMapInformation.sWestGridNo);
      break;
    case Enum38.DRAW_MODE_EASTPOINT:
      psEntryGridNo = addressof(gMapInformation.sEastGridNo);
      break;
    case Enum38.DRAW_MODE_SOUTHPOINT:
      psEntryGridNo = addressof(gMapInformation.sSouthGridNo);
      break;
    case Enum38.DRAW_MODE_CENTERPOINT:
      psEntryGridNo = addressof(gMapInformation.sCenterGridNo);
      break;
    case Enum38.DRAW_MODE_ISOLATEDPOINT:
      psEntryGridNo = addressof(gMapInformation.sIsolatedGridNo);
      break;
    default:
      return;
  }
  if (!fErasing) {
    if (psEntryGridNo.value >= 0) {
      AddToUndoList(psEntryGridNo.value);
      RemoveAllTopmostsOfTypeRange(psEntryGridNo.value, Enum313.FIRSTPOINTERS, Enum313.FIRSTPOINTERS);
    }
    psEntryGridNo.value = iMapIndex;
    ValidateEntryPointGridNo(psEntryGridNo);
    AddToUndoList(psEntryGridNo.value);
    AddTopmostToTail(psEntryGridNo.value, Enum312.FIRSTPOINTERS2);
  } else {
    let usDummy: UINT16;
    if (TypeExistsInTopmostLayer(iMapIndex, Enum313.FIRSTPOINTERS, addressof(usDummy))) {
      AddToUndoList(iMapIndex);
      RemoveAllTopmostsOfTypeRange(iMapIndex, Enum313.FIRSTPOINTERS, Enum313.FIRSTPOINTERS);
      psEntryGridNo.value = -1;
    }
    // restore the drawmode
    iDrawMode += Enum38.DRAW_MODE_ERASE;
  }
}

export function SetMercEditingMode(ubNewMode: UINT8): void {
  // We need to update the taskbar for the buttons that were erased.
  gfRenderTaskbar = true;

  // set up the new mode values.
  if (gubCurrMercMode >= Enum42.MERC_GENERALMODE)
    gubLastDetailedMercMode = gubCurrMercMode;

  // Depending on the mode we were just in, we may want to extract and update the
  // merc first.  Then we change modes...
  ExtractCurrentMercModeInfo(true);

  // Change modes now.
  gubPrevMercMode = gubCurrMercMode;
  gubCurrMercMode = ubNewMode;

  // Hide all of the merc buttons except the team buttons which are static.
  HideEditorButtons(FIRST_MERCS_BASICMODE_BUTTON, Enum32.LAST_MERCS_BUTTON);

  switch (gubPrevMercMode) {
    case Enum42.MERC_GETITEMMODE:
      EnableEditorButtons(Enum32.TAB_TERRAIN, Enum32.TAB_OPTIONS);
      HideEditorButtons(FIRST_MERCS_GETITEM_BUTTON, LAST_MERCS_GETITEM_BUTTON);
      AddNewItemToSelectedMercsInventory(true);
      break;
    case Enum42.MERC_INVENTORYMODE:
      HideItemStatsPanel();
      DisableEditorRegion(Enum45.MERC_REGION_ID);
      break;
    case Enum42.MERC_GENERALMODE:
      EnableEditorButton(Enum32.MERCS_APPEARANCE);
      break;
    case Enum42.MERC_SCHEDULEMODE:
      // ClearCurrentSchedule();
      break;
  }

  // If we leave the merc tab, then we want to update editable fields such as
  // attributes, which was just handled above, then turn everything off, and exit.
  if (ubNewMode == Enum42.MERC_NOMODE) {
    HideEditorButtons(Enum32.FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
    HideEditorButtons(Enum32.MERCS_SCHEDULE, Enum32.MERCS_GLOWSCHEDULE);
    return;
  }
  if (gubPrevMercMode == Enum42.MERC_NOMODE || gubPrevMercMode == Enum42.MERC_GETITEMMODE) {
    ShowEditorButtons(Enum32.FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
  }

  // Release the currently selected merc if you just selected a new team.
  if (gsSelectedMercID != -1 && ubNewMode == Enum42.MERC_TEAMMODE) {
    // attempt to weed out conditions where we select a team that matches the currently
    // selected merc.  We don't want to deselect him in this case.
    if (gpSelected.value.pSoldier.value.bTeam == ENEMY_TEAM && iDrawMode == Enum38.DRAW_MODE_ENEMY || gpSelected.value.pSoldier.value.bTeam == CREATURE_TEAM && iDrawMode == Enum38.DRAW_MODE_CREATURE || gpSelected.value.pSoldier.value.bTeam == MILITIA_TEAM && iDrawMode == Enum38.DRAW_MODE_REBEL || gpSelected.value.pSoldier.value.bTeam == CIV_TEAM && iDrawMode == Enum38.DRAW_MODE_CIVILIAN) {
      // Same team, so don't deselect merc.  Instead, keep the previous editing mode
      // because we are still editing this merc.
      gubCurrMercMode = gubPrevMercMode;
      // if we don't have a detailed placement, auto set to basic mode.
      if (!gpSelected.value.pDetailedPlacement)
        gubCurrMercMode = Enum42.MERC_BASICMODE;
    } else {
      // Different teams, so deselect the current merc and the detailed checkbox if applicable.
      IndicateSelectedMerc(Enum43.SELECT_NO_MERC);
      ShowEditorButtons(Enum32.FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
      UnclickEditorButton(Enum32.MERCS_DETAILEDCHECKBOX);
    }
  }

  ShowButton(iEditorButton[Enum32.MERCS_NEXT]);
  if (gsSelectedMercID != -1)
    ShowButton(iEditorButton[Enum32.MERCS_DELETE]);

  if (gubCurrMercMode > Enum42.MERC_TEAMMODE) {
    // Add the basic buttons if applicable.
    ShowEditorButtons(FIRST_MERCS_BASICMODE_BUTTON, LAST_MERCS_BASICMODE_BUTTON);
  }
  if (gubCurrMercMode > Enum42.MERC_BASICMODE) {
    // Add the detailed buttons if applicable.
    ClickEditorButton(Enum32.MERCS_DETAILEDCHECKBOX);
    ShowEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
  } else
    UnclickEditorButton(Enum32.MERCS_DETAILEDCHECKBOX);
  // Now we are setting up the button states for the new mode, as well as show the
  // applicable buttons for the detailed placement modes.
  if (gubCurrMercMode == Enum42.MERC_APPEARANCEMODE && iDrawMode == Enum38.DRAW_MODE_CREATURE || gubCurrMercMode == Enum42.MERC_SCHEDULEMODE && iDrawMode != Enum38.DRAW_MODE_CIVILIAN) {
    gubCurrMercMode = Enum42.MERC_GENERALMODE;
  }
  switch (gubCurrMercMode) {
    case Enum42.MERC_GETITEMMODE:
      DisableEditorButtons(Enum32.TAB_TERRAIN, Enum32.TAB_OPTIONS);
      EnableEditorButton(Enum32.TAB_MERCS);
      HideEditorButtons(Enum32.FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
      HideEditorButtons(Enum32.MERCS_SCHEDULE, Enum32.MERCS_GLOWSCHEDULE);
      ShowEditorButtons(FIRST_MERCS_GETITEM_BUTTON, LAST_MERCS_GETITEM_BUTTON);
      InitEditorItemsInfo(eInfo.uiItemType);
      ClickEditorButton(Enum32.ITEMS_WEAPONS + eInfo.uiItemType - Enum35.TBAR_MODE_ITEM_WEAPONS);
      break;
    case Enum42.MERC_INVENTORYMODE:
      UpdateMercItemSlots();
      ShowItemStatsPanel();
      if (gbCurrSelect == -1)
        SpecifyItemToEdit(null, -1);
      else
        SpecifyItemToEdit(gpMercSlotItem[gbCurrSelect], -1);
      HideEditorButtons(Enum32.MERCS_DELETE, Enum32.MERCS_NEXT);
      ShowEditorButtons(FIRST_MERCS_INVENTORY_BUTTON, LAST_MERCS_INVENTORY_BUTTON);
      EnableEditorRegion(Enum45.MERC_REGION_ID);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(Enum32.MERCS_INVENTORY);
      break;
    case Enum42.MERC_BASICMODE:
      ShowEditorButtons(FIRST_MERCS_GENERAL_BUTTON, LAST_MERCS_GENERAL_BUTTON);
      if (iDrawMode == Enum38.DRAW_MODE_CREATURE) {
        // Set up alternate general mode.  This one doesn't allow you to specify relative attributes
        // but requires you to specify a body type.
        HideEditorButtons(FIRST_MERCS_REL_EQUIPMENT_BUTTON, LAST_MERCS_REL_EQUIPMENT_BUTTON);
        ShowEditorButtons(FIRST_MERCS_BODYTYPE_BUTTON, LAST_MERCS_BODYTYPE_BUTTON);
      }
      if (iDrawMode != Enum38.DRAW_MODE_ENEMY)
        HideEditorButtons(FIRST_MERCS_COLORCODE_BUTTON, LAST_MERCS_COLORCODE_BUTTON);
      if (iDrawMode == Enum38.DRAW_MODE_CIVILIAN)
        ShowEditorButton(Enum32.MERCS_CIVILIAN_GROUP);
      break;
    case Enum42.MERC_GENERALMODE:
      ShowEditorButtons(FIRST_MERCS_GENERAL_BUTTON, LAST_MERCS_GENERAL_BUTTON);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(Enum32.MERCS_GENERAL);
      if (iDrawMode == Enum38.DRAW_MODE_CREATURE) {
        // Set up alternate general mode.  This one doesn't allow you to specify relative equipment
        // but requires you to specify a body type.
        HideEditorButtons(FIRST_MERCS_REL_EQUIPMENT_BUTTON, LAST_MERCS_REL_EQUIPMENT_BUTTON);
        ShowEditorButtons(FIRST_MERCS_BODYTYPE_BUTTON, LAST_MERCS_BODYTYPE_BUTTON);
        DisableEditorButton(Enum32.MERCS_APPEARANCE);
      }
      if (iDrawMode != Enum38.DRAW_MODE_ENEMY)
        HideEditorButtons(FIRST_MERCS_COLORCODE_BUTTON, LAST_MERCS_COLORCODE_BUTTON);
      if (iDrawMode == Enum38.DRAW_MODE_CIVILIAN)
        ShowEditorButton(Enum32.MERCS_CIVILIAN_GROUP);
      break;
    case Enum42.MERC_ATTRIBUTEMODE:
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(Enum32.MERCS_ATTRIBUTES);
      SetupTextInputForMercAttributes();
      break;
    case Enum42.MERC_APPEARANCEMODE:
      ShowEditorButtons(FIRST_MERCS_COLORMODE_BUTTON, LAST_MERCS_COLORMODE_BUTTON);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(Enum32.MERCS_APPEARANCE);
      if (gfCanEditMercs && gpSelected && gpSelected.value.pDetailedPlacement) {
        if (!gpSelected.value.pDetailedPlacement.value.fVisible) {
          UnclickEditorButton(Enum32.MERCS_TOGGLECOLOR_BUTTON);
          DisableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
        } else {
          ClickEditorButton(Enum32.MERCS_TOGGLECOLOR_BUTTON);
          EnableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
        }
      }
      break;
    case Enum42.MERC_PROFILEMODE:
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(Enum32.MERCS_PROFILE);
      SetupTextInputForMercProfile();
      break;
    case Enum42.MERC_SCHEDULEMODE:
      ShowEditorButtons(Enum32.MERCS_SCHEDULE_ACTION1, Enum32.MERCS_SCHEDULE_VARIANCE4);
      ShowEditorButton(Enum32.MERCS_SCHEDULE_CLEAR);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(Enum32.MERCS_SCHEDULE);
      SetupTextInputForMercSchedule();
      UpdateScheduleInfo();
      DetermineScheduleEditability();
  }
  // Show or hide the schedule buttons
  if (gpSelected && gubCurrMercMode != Enum42.MERC_GETITEMMODE) {
    if (gpSelected.value.pDetailedPlacement && gpSelected.value.pDetailedPlacement.value.ubScheduleID) {
      HideEditorButton(Enum32.MERCS_SCHEDULE);
      ShowEditorButton(Enum32.MERCS_GLOWSCHEDULE);
    } else {
      HideEditorButton(Enum32.MERCS_GLOWSCHEDULE);
      if (gpSelected.value.pDetailedPlacement) {
        ShowEditorButton(Enum32.MERCS_SCHEDULE);
        if (gpSelected.value.pSoldier.value.bTeam == CIV_TEAM)
          EnableEditorButton(Enum32.MERCS_SCHEDULE);
        else
          DisableEditorButton(Enum32.MERCS_SCHEDULE);
      } else {
        HideEditorButton(Enum32.MERCS_SCHEDULE);
      }
    }
  } else {
    HideEditorButtons(Enum32.MERCS_SCHEDULE, Enum32.MERCS_GLOWSCHEDULE);
  }
}

function DisplayBodyTypeInfo(): void {
  let str: string /* UINT16[20] */;
  switch (gpSelected.value.pBasicPlacement.value.bBodyType) {
    case RANDOM:
      str = "Random";
      break;
    case Enum194.REGMALE:
      str = "Reg Male";
      break;
    case Enum194.BIGMALE:
      str = "Big Male";
      break;
    case Enum194.STOCKYMALE:
      str = "Stocky Male";
      break;
    case Enum194.REGFEMALE:
      str = "Reg Female";
      break;
    case Enum194.TANK_NE:
      str = "NE Tank";
      break;
    case Enum194.TANK_NW:
      str = "NW Tank";
      break;
    case Enum194.FATCIV:
      str = "Fat Civilian";
      break;
    case Enum194.MANCIV:
      str = "M Civilian";
      break;
    case Enum194.MINICIV:
      str = "Miniskirt";
      break;
    case Enum194.DRESSCIV:
      str = "F Civilian";
      break;
    case Enum194.HATKIDCIV:
      str = "Kid w/ Hat";
      break;
    case Enum194.HUMVEE:
      str = "Humvee";
      break;
    case Enum194.ELDORADO:
      str = "Eldorado";
      break;
    case Enum194.ICECREAMTRUCK:
      str = "Icecream Truck";
      break;
    case Enum194.JEEP:
      str = "Jeep";
      break;
    case Enum194.KIDCIV:
      str = "Kid Civilian";
      break;
    case Enum194.COW:
      str = "Domestic Cow";
      break;
    case Enum194.CRIPPLECIV:
      str = "Cripple";
      break;
    case Enum194.ROBOTNOWEAPON:
      str = "Unarmed Robot";
      break;
    case Enum194.LARVAE_MONSTER:
      str = "Larvae";
      break;
    case Enum194.INFANT_MONSTER:
      str = "Infant";
      break;
    case Enum194.YAF_MONSTER:
      str = "Yng F Monster";
      break;
    case Enum194.YAM_MONSTER:
      str = "Yng M Monster";
      break;
    case Enum194.ADULTFEMALEMONSTER:
      str = "Adt F Monster";
      break;
    case Enum194.AM_MONSTER:
      str = "Adt M Monster";
      break;
    case Enum194.QUEENMONSTER:
      str = "Queen Monster";
      break;
    case Enum194.BLOODCAT:
      str = "Bloodcat";
      break;
  }
  DrawEditorInfoBox(str, FONT10ARIAL(), 490, 364, 70, 20);
}

export function UpdateMercsInfo(): void {
  if (!gfRenderMercInfo)
    return;

  // We are rendering it now, so signify that it has been done, so
  // it doesn't get rendered every frame.
  gfRenderMercInfo = false;

  switch (gubCurrMercMode) {
    case Enum42.MERC_GETITEMMODE:
      RenderEditorItemsInfo();
      break;
    case Enum42.MERC_INVENTORYMODE:
      if (gfMercGetItem)
        SetMercEditingMode(Enum42.MERC_GETITEMMODE);
      else
        RenderMercInventoryPanel();
      break;
    case Enum42.MERC_BASICMODE:
    case Enum42.MERC_GENERALMODE:
      BltVideoObjectFromIndex(FRAME_BUFFER, guiExclamation, 0, 188, 362, VO_BLT_SRCTRANSPARENCY, null);
      BltVideoObjectFromIndex(FRAME_BUFFER, guiKeyImage, 0, 186, 387, VO_BLT_SRCTRANSPARENCY, null);
      SetFont(SMALLCOMPFONT());
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      mprintf(240, 363, " --=ORDERS=-- ");
      mprintf(240, 419, "--=ATTITUDE=--");
      if (iDrawMode == Enum38.DRAW_MODE_CREATURE) {
        DisplayBodyTypeInfo();
        SetFont(SMALLCOMPFONT());
        SetFontForeground(FONT_LTBLUE);
        mprintf(493, 416, "RELATIVE");
        mprintf(480, 422, "ATTRIBUTES");
      } else {
        SetFontForeground(FONT_LTGREEN);
        mprintf(480, 363, "RELATIVE");
        mprintf(480, 371, "EQUIPMENT");
        SetFontForeground(FONT_LTBLUE);
        mprintf(530, 363, "RELATIVE");
        mprintf(530, 371, "ATTRIBUTES");
      }
      if (iDrawMode == Enum38.DRAW_MODE_ENEMY) {
        SetFont(FONT10ARIAL());
        SetFontForeground(FONT_YELLOW);
        mprintf(590, 411, "Army");
        mprintf(590, 425, "Admin");
        mprintf(590, 439, "Elite");
      }
      break;
    case Enum42.MERC_ATTRIBUTEMODE:
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      mprintf(225, 370, "Exp. Level");
      mprintf(225, 395, "Life");
      mprintf(225, 420, "LifeMax");
      mprintf(225, 445, "Marksmanship");
      mprintf(325, 370, "Strength");
      mprintf(325, 395, "Agility");
      mprintf(325, 420, "Dexterity");
      mprintf(325, 445, "Wisdom");
      mprintf(425, 370, "Leadership");
      mprintf(425, 395, "Explosives");
      mprintf(425, 420, "Medical");
      mprintf(425, 445, "Mechanical");
      mprintf(525, 370, "Morale");
      break;
    case Enum42.MERC_APPEARANCEMODE:
      SetFont(FONT10ARIAL());
      if (gpSelected.value.pDetailedPlacement.value.fVisible || gpSelected.value.pDetailedPlacement.value.ubProfile != NO_PROFILE)
        SetFontForeground(FONT_YELLOW);
      else
        SetFontForeground(FONT_DKYELLOW);
      SetFontShadow(FONT_NEARBLACK);

      mprintf(396, 364, "Hair color:");
      mprintf(396, 388, "Skin color:");
      mprintf(396, 412, "Vest color:");
      mprintf(396, 436, "Pant color:");

      SetFont(SMALLCOMPFONT());
      SetFontForeground(FONT_BLACK);
      if (gpSelected.value.pDetailedPlacement.value.fVisible || gpSelected.value.pDetailedPlacement.value.ubProfile != NO_PROFILE) {
        mprintfEditor(396, 374, "%S    ", gpSelected.value.pSoldier.value.HeadPal);
        mprintfEditor(396, 398, "%S    ", gpSelected.value.pSoldier.value.SkinPal);
        mprintfEditor(396, 422, "%S    ", gpSelected.value.pSoldier.value.VestPal);
        mprintfEditor(396, 446, "%S    ", gpSelected.value.pSoldier.value.PantsPal);
        ShowEditMercPalettes(gpSelected.value.pSoldier);
      } else {
        mprintf(396, 374, "RANDOM");
        mprintf(396, 398, "RANDOM");
        mprintf(396, 422, "RANDOM");
        mprintf(396, 446, "RANDOM");
        ShowEditMercPalettes(null); // will display grey scale to signify random
      }
      DisplayBodyTypeInfo();
      break;
    case Enum42.MERC_PROFILEMODE:
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      {
        // scope trick
        let tempStr: string /* UINT16[500] */;
        tempStr = swprintf("%s%s%s%s%s%d.", "By specifying a profile index, all of the information will be extracted from the profile ", "and override any values that you have edited.  It will also disable the editing features ", "though, you will still be able to view stats, etc.  Pressing ENTER will automatically ", "extract the number you have typed.  A blank field will clear the profile.  The current ", "number of profiles range from 0 to ", NUM_PROFILES);
        DisplayWrappedString(180, 370, 400, 2, FONT10ARIAL(), 146, tempStr, FONT_BLACK, false, LEFT_JUSTIFIED);
        SetFont(FONT12POINT1());
        if (gpSelected.value.pDetailedPlacement.value.ubProfile == NO_PROFILE) {
          SetFontForeground(FONT_GRAY3);
          mprintfEditor(240, 435, "Current Profile:  n/a                            ");
        } else {
          SetFontForeground(FONT_WHITE);
          ClearTaskbarRegion(240, 435, 580, 445);
          mprintf(240, 435, "Current Profile:  %s", gMercProfiles[gpSelected.value.pDetailedPlacement.value.ubProfile].zName);
        }
      }
      break;
    case Enum42.MERC_SCHEDULEMODE:
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_WHITE);
      SetFontShadow(FONT_NEARBLACK);
      switch (gpSelected.value.pSoldier.value.bOrders) {
        case Enum241.STATIONARY:
          mprintf(430, 363, "STATIONARY");
          break;
        case Enum241.ONCALL:
          mprintf(430, 363, "ON CALL");
          break;
        case Enum241.ONGUARD:
          mprintf(430, 363, "ON GUARD");
          break;
        case Enum241.SEEKENEMY:
          mprintf(430, 363, "SEEK ENEMY");
          break;
        case Enum241.CLOSEPATROL:
          mprintf(430, 363, "CLOSE PATROL");
          break;
        case Enum241.FARPATROL:
          mprintf(430, 363, "FAR PATROL");
          break;
        case Enum241.POINTPATROL:
          mprintf(430, 363, "POINT PATROL");
          break;
        case Enum241.RNDPTPATROL:
          mprintf(430, 363, "RND PT PATROL");
          break;
      }
      SetFontForeground(FONT_YELLOW);
      mprintf(186, 363, "Action");
      mprintf(268, 363, "Time");
      mprintf(309, 363, "V");
      mprintf(331, 363, "GridNo 1");
      mprintf(381, 363, "GridNo 2");
      mprintf(172, 376, "1)");
      mprintf(172, 397, "2)");
      mprintf(172, 418, "3)");
      mprintf(172, 439, "4)");
      if (gubScheduleInstructions) {
        let str: string /* UINT16[255] */;
        let keyword: string /* UINT16[10] */ = "";
        ColorFillVideoSurfaceArea(FRAME_BUFFER, 431, 388, 590, 450, Get16BPPColor(FROMRGB(32, 45, 72)));
        switch (gCurrSchedule.ubAction[gubCurrentScheduleActionIndex]) {
          case Enum171.SCHEDULE_ACTION_LOCKDOOR:
            keyword = "lock";
            break;
          case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
            keyword = "unlock";
            break;
          case Enum171.SCHEDULE_ACTION_OPENDOOR:
            keyword = "open";
            break;
          case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
            keyword = "close";
            break;
        }
        switch (gubScheduleInstructions) {
          case Enum40.SCHEDULE_INSTRUCTIONS_DOOR1:
            str = swprintf("Click on the gridno adjacent to the door that you wish to %s.", keyword);
            break;
          case Enum40.SCHEDULE_INSTRUCTIONS_DOOR2:
            str = swprintf("Click on the gridno where you wish to move after you %s the door.", keyword);
            break;
          case Enum40.SCHEDULE_INSTRUCTIONS_GRIDNO:
            str = "Click on the gridno where you wish to move to.";
            break;
          case Enum40.SCHEDULE_INSTRUCTIONS_SLEEP:
            str = "Click on the gridno where you wish to sleep at.  Person will automatically return to original position after waking up.";
          default:
            return;
        }
        str += "  Hit ESC to abort entering this line in the schedule.";
        DisplayWrappedString(436, 392, 149, 2, FONT10ARIAL(), FONT_YELLOW, str, FONT_BLACK, false, LEFT_JUSTIFIED);
      }
      break;
  }
}

// When a detailed placement merc is in the inventory panel, there is a overall region
// blanketing this panel.  As the user moves the mouse around and clicks, etc., this function
// is called by the region callback functions to handle these cases.  The event types are defined
// in Editor Taskbar Utils.h.  Here are the internal functions...

let mercRects: SGPRect[] /* [9] */ = [
  createSGPRectFrom(75, 0, 104, 19), // head
  createSGPRectFrom(75, 22, 104, 41), // body
  createSGPRectFrom(76, 73, 105, 92), // legs
  createSGPRectFrom(26, 43, 78, 62), // left hand
  createSGPRectFrom(104, 42, 156, 61), // right hand
  createSGPRectFrom(180, 6, 232, 25), // pack 1
  createSGPRectFrom(180, 29, 232, 48), // pack 2
  createSGPRectFrom(180, 52, 232, 71), // pack 3
  createSGPRectFrom(180, 75, 232, 94), // pack 4
];

function PointInRect(pRect: Pointer<SGPRect>, x: INT32, y: INT32): boolean {
  return x >= pRect.value.iLeft && x <= pRect.value.iRight && y >= pRect.value.iTop && y <= pRect.value.iBottom;
}

function DrawRect(pRect: Pointer<SGPRect>, color: INT16): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, pRect.value.iLeft + MERCPANEL_X, pRect.value.iTop + MERCPANEL_Y, pRect.value.iRight + MERCPANEL_X, pRect.value.iBottom + MERCPANEL_Y, color, pDestBuf);
  UnLockVideoSurface(FRAME_BUFFER);
  // InvalidateRegion( pRect->iLeft+175, pRect->iTop+361, pRect->iRight+176, pRect->iBottom+362 );
}

function RenderSelectedMercsInventory(): void {
  let i: INT32;
  let pSrc: Pointer<UINT8>;
  let pDst: Pointer<UINT8>;
  let xp: INT32;
  let yp: INT32;
  let uiSrcPitchBYTES: UINT32;
  let uiDstPitchBYTES: UINT32;
  let pItemName: string /* UINT16[100] */;
  let ubFontColor: UINT8;
  if (gsSelectedMercID == -1)
    return;
  for (i = 0; i < 9; i++) {
    if (gpMercSlotItem[i]) {
      // Render the current image.
      xp = mercRects[i].iLeft + 4 + MERCPANEL_X;
      yp = mercRects[i].iTop + MERCPANEL_Y;
      pDst = LockVideoSurface(FRAME_BUFFER, addressof(uiDstPitchBYTES));
      pSrc = LockVideoSurface(guiMercInvPanelBuffers[i], addressof(uiSrcPitchBYTES));
      Blt16BPPTo16BPPTrans(pDst, uiDstPitchBYTES, pSrc, uiSrcPitchBYTES, xp, yp, 0, 0, i < 3 ? 22 : 44, 15, 0);
      UnLockVideoSurface(FRAME_BUFFER);
      UnLockVideoSurface(guiMercInvPanelBuffers[i]);
      ({ name: pItemName } = LoadItemInfo(gpMercSlotItem[i].value.usItem));
      // Render the text
      switch (i) {
        case 2: // legs (to the right of the box, but move it down to make room for right hand text)
          xp = mercRects[i].iRight + 2;
          yp = mercRects[i].iTop + 8;
          break;
        case 3: // left hand (underneath box and to the left -- obscurred by checkbox)
          xp = mercRects[i].iLeft - 20;
          yp = mercRects[i].iBottom + 2;
          break;
        case 4: // right hand (underneath box)
          xp = mercRects[i].iLeft;
          yp = mercRects[i].iBottom + 2;
          break;
        default: // normal cases (to the right of the box)
          xp = mercRects[i].iRight + 2;
          yp = mercRects[i].iTop;
          break;
      }
      xp += MERCPANEL_X;
      yp += MERCPANEL_Y;
      SetFont(SMALLCOMPFONT());
      if (i == gbCurrSelect)
        ubFontColor = FONT_LTRED;
      else if (i == gbCurrHilite)
        ubFontColor = FONT_YELLOW;
      else
        ubFontColor = FONT_WHITE;
      DisplayWrappedString(xp, yp, 60, 2, SMALLCOMPFONT(), ubFontColor, pItemName, 0, false, LEFT_JUSTIFIED);
    }
  }
}

export function DeleteSelectedMercsItem(): void {
  if (gbCurrSelect != -1) {
    gusMercsNewItemIndex = 0;
    AddNewItemToSelectedMercsInventory(true);
  }
}

// This function does two main things:
// 1)  Allows a new item to be created via usItem and assigned to the currently selected merc.
// 2)  Converts the image from interface size to the smaller panel used by the editor.  The slots
//		 in the editor are approximately 80% of that size.  This involves scaling calculations.  These
//		 images are saved in individual slots are are blitted to the screen during rendering, not here.
// NOTE:  Step one can be skipped (when selecting an existing merc).  By setting the
function AddNewItemToSelectedMercsInventory(fCreate: boolean): void {
  let uiVideoObjectIndex: UINT32;
  let uiSrcID: UINT32;
  let uiDstID: UINT32;
  let hVObject: HVOBJECT;
  let pObject: Pointer<ETRLEObject>;
  let item: Pointer<INVTYPE>;
  let SrcRect: SGPRect = createSGPRect();
  let DstRect: SGPRect = createSGPRect();
  let iSrcWidth: INT32;
  let iSrcHeight: INT32;
  let iDstWidth: INT32;
  let iDstHeight: INT32;
  let rScalar: FLOAT;
  let rWidthScalar: FLOAT;
  let rHeightScalar: FLOAT;
  let fUnDroppable: boolean;

  if (fCreate) {
    /*
    if( gpMercSlotItem[ gbCurrSelect ] && gpMercSlotItem[ gbCurrSelect ]->usItem == gusMercsNewItemIndex )
    { //User selected same item, so ignore.
            gusMercsNewItemIndex = 0xffff;
            return;
    }
    */
    if (gusMercsNewItemIndex == 0xffff) {
      // User selected no item, so ignore.
      return;
    }
    // Create the item, and set up the slot.
    fUnDroppable = gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]].fFlags & OBJECT_UNDROPPABLE ? true : false;

    if (Item[gusMercsNewItemIndex].usItemClass == IC_KEY) {
      CreateKeyObject(addressof(gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]]), 1, eInfo.sSelItemIndex);
    } else {
      CreateItem(gusMercsNewItemIndex, 100, addressof(gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]]));
    }
    if (fUnDroppable) {
      gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]].fFlags |= OBJECT_UNDROPPABLE;
    }

    // randomize the status on non-ammo items.
    if (!(Item[gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]].usItem].usItemClass & IC_AMMO))
      gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]].bStatus[0] = (80 + Random(21));

    if (gusMercsNewItemIndex) {
      gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]].fFlags |= OBJECT_NO_OVERWRITE;
    }
  }
  // allow the slot to point to the selected merc's inventory for editing/rendering purposes.
  gpMercSlotItem[gbCurrSelect] = addressof(gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]]);

  if (!fCreate) {
    // it is possible to have a null item which we don't want to blit!  Also, we need to set the
    // new item index, so that it can extract the item's image using that.
    gusMercsNewItemIndex = gpMercSlotItem[gbCurrSelect].value.usItem;
    if (!gpMercSlotItem[gbCurrSelect])
      return;
  }
  // GOAL:
  // From here on, we are going to first render the new item into a temp buffer, then crop the image in
  // the buffer and scale it down to fit into it's associated slot in the panel (which on average will
  // require scaling the item by 80%).  We have to do a bunch of calculations to override the offsets, etc.
  // Each slot has it's own smaller version buffer, and this is what gets drawn when the rendering happens.

  // assign the buffers
  uiSrcID = guiMercTempBuffer;
  uiDstID = guiMercInvPanelBuffers[gbCurrSelect];

  // build the rects
  iDstWidth = gbCurrSelect < 3 ? MERCINV_SMSLOT_WIDTH : MERCINV_LGSLOT_WIDTH;
  iDstHeight = MERCINV_SLOT_HEIGHT;
  SrcRect.iLeft = 0;
  SrcRect.iTop = 0;
  SrcRect.iRight = 60;
  SrcRect.iBottom = 25;
  DstRect.iLeft = 0;
  DstRect.iTop = 0;
  DstRect.iRight = iDstWidth;
  DstRect.iBottom = iDstHeight;

  // clear both buffers (fill with black to erase previous graphic)
  ColorFillVideoSurfaceArea(uiSrcID, SrcRect.iLeft, SrcRect.iTop, SrcRect.iRight, SrcRect.iBottom, 0);
  ColorFillVideoSurfaceArea(uiDstID, DstRect.iLeft, DstRect.iTop, DstRect.iRight, DstRect.iBottom, 0);

  // if the index is 0, then there is no item.
  if (!gusMercsNewItemIndex)
    return;

  // now draw the fullsize item into the temp buffer
  item = addressof(Item[gusMercsNewItemIndex]);
  uiVideoObjectIndex = GetInterfaceGraphicForItem(item);
  hVObject = GetVideoObject(uiVideoObjectIndex);
  BltVideoObjectOutlineFromIndex(uiSrcID, uiVideoObjectIndex, item.value.ubGraphicNum, 0, 0, 0, false);

  // crop the source image
  pObject = addressof(hVObject.value.pETRLEObject[item.value.ubGraphicNum]);
  iSrcWidth = pObject.value.usWidth;
  iSrcHeight = pObject.value.usHeight;
  SrcRect.iLeft += pObject.value.sOffsetX;
  SrcRect.iRight = SrcRect.iLeft + iSrcWidth;
  SrcRect.iTop += pObject.value.sOffsetY;
  SrcRect.iBottom = SrcRect.iTop + iSrcHeight;

  // if the source image width is less than 30 (small slot), then modify the DstRect.
  if (iSrcWidth < 30)
    iDstWidth = MERCINV_SMSLOT_WIDTH;
  else
    iDstWidth = MERCINV_LGSLOT_WIDTH;

  // compare the sizes of the cropped image to the destination buffer size, and calculate the
  // scalar value.  It is possible to have scalars > 1.0, in which case, we change it to 1.0 and
  // use the other value.
  rWidthScalar = iDstWidth / iSrcWidth;
  if (rWidthScalar > 1.0)
    rWidthScalar = 1.0;
  rHeightScalar = iDstHeight / iSrcHeight;
  if (rHeightScalar > 1.0)
    rHeightScalar = 1.0;

  // determine which scalar to use.
  if (rWidthScalar == 1.0)
    rScalar = rHeightScalar;
  else if (rHeightScalar == 1.0)
    rScalar = rWidthScalar;
  else
    rScalar = Math.max(rWidthScalar, rHeightScalar);

  // apply the scalar to the destination width and height
  iDstWidth = (iSrcWidth * rScalar);
  iDstHeight = (iSrcHeight * rScalar);

  // sometimes it is possible to scale too big, so clip if applicable
  if (iDstWidth > MERCINV_LGSLOT_WIDTH)
    iDstWidth = MERCINV_LGSLOT_WIDTH;
  else if (gbCurrSelect < 3 && iDstWidth > MERCINV_SMSLOT_WIDTH)
    iDstWidth = MERCINV_SMSLOT_WIDTH;
  if (iDstHeight > MERCINV_SLOT_HEIGHT)
    iDstHeight = MERCINV_SLOT_HEIGHT;

  // use the new width and height values to calculate the new dest rect (center the item)
  DstRect.iLeft = (DstRect.iRight - DstRect.iLeft - iDstWidth) / 2;
  DstRect.iRight = DstRect.iLeft + iDstWidth;
  DstRect.iTop = (DstRect.iBottom - DstRect.iTop - iDstHeight) / 2;
  DstRect.iBottom = DstRect.iTop + iDstHeight;

  // scale the item down to the smaller buffer.
  BltStretchVideoSurface(uiDstID, uiSrcID, 0, 0, VO_BLT_SRCTRANSPARENCY, addressof(SrcRect), addressof(DstRect));

  // invalidate the mercs new item index
  gusMercsNewItemIndex = 0xffff;
}

function RenderMercInventoryPanel(): void {
  let x: INT32;
  // Draw the graphical panel
  BltVideoObjectFromIndex(FRAME_BUFFER, guiMercInventoryPanel, 0, MERCPANEL_X, MERCPANEL_Y, VO_BLT_SRCTRANSPARENCY, null);
  // Mark the buttons dirty, so they don't disappear.
  for (x = FIRST_MERCS_INVENTORY_BUTTON; x <= LAST_MERCS_INVENTORY_BUTTON; x++) {
    MarkAButtonDirty(iEditorButton[x]);
  }
  RenderButtons();
  if (gbCurrHilite != -1)
    DrawRect(addressof(mercRects[gbCurrHilite]), Get16BPPColor(FROMRGB(200, 200, 0)));
  if (gbCurrSelect != -1)
    DrawRect(addressof(mercRects[gbCurrSelect]), Get16BPPColor(FROMRGB(200, 0, 0)));
  RenderSelectedMercsInventory();
  InvalidateRegion(MERCPANEL_X, MERCPANEL_Y, 475, 460);
  UpdateItemStatsPanel();
}

// This function is called by the move and click callback functions for the region blanketing the
// 9 slots in the inventory panel.  It passes the event type as well as the relative x and y positions
// which are processed here.  This basically checks for new changes in hilighting and selections, which
// will set the rendering flag, and getitem flag if the user wishes to choose an item.
export function HandleMercInventoryPanel(sX: INT16, sY: INT16, bEvent: INT8): void {
  let x: INT8;
  if (!gfCanEditMercs && bEvent == Enum44.GUI_RCLICK_EVENT) {
    // if we are dealing with a profile merc, we can't allow editing
    // of items, but we can look at them.  So, treat all right clicks
    // as if they were left clicks.
    bEvent = Enum44.GUI_LCLICK_EVENT;
  }
  switch (bEvent) {
    case Enum44.GUI_MOVE_EVENT:
      // user is moving the mouse around the panel, so determine which slot
      // needs to be hilighted yellow.
      for (x = 0; x < 9; x++) {
        if (PointInRect(addressof(mercRects[x]), sX, sY)) {
          if (gbCurrHilite != x) // only render if the slot isn't the same one.
            gfRenderMercInfo = true;
          gbCurrHilite = x;
          return;
        }
      }
      // if we don't find a valid slot, then we need to turn it off.
      if (gbCurrHilite != -1) {
        // only turn off if it isn't already off.  This avoids unecessary rendering.
        gbCurrHilite = -1;
        gfRenderMercInfo = true;
      }
      break;
    case Enum44.GUI_LCLICK_EVENT:
    case Enum44.GUI_RCLICK_EVENT:
      // The user has clicked in the inventory panel.  Determine if he clicked in
      // a slot.  Left click selects the slot for editing, right clicking enables
      // the user to choose an item for that slot.
      for (x = 0; x < 9; x++) {
        if (PointInRect(addressof(mercRects[x]), sX, sY)) {
          if (gbCurrSelect != x) // only if it isn't the same slot.
          {
            gfRenderMercInfo = true;
            if (bEvent == Enum44.GUI_LCLICK_EVENT)
              SpecifyItemToEdit(gpMercSlotItem[x], -1);
          }
          if (bEvent == Enum44.GUI_RCLICK_EVENT) // user r-clicked, so enable item choosing
            gfMercGetItem = true;
          gbCurrSelect = x;
          return;
        }
      }
      break;
  }
}

function UpdateMercItemSlots(): void {
  let x: INT8;
  if (!gpSelected.value.pDetailedPlacement) {
    for (x = 0; x < 9; x++) {
      gpMercSlotItem[x] = null;
    }
  } else {
    if (gpSelected.value.pDetailedPlacement.value.ubProfile != NO_PROFILE) {
      memcpy(gpSelected.value.pDetailedPlacement.value.Inv, gpSelected.value.pSoldier.value.inv, sizeof(OBJECTTYPE) * Enum261.NUM_INV_SLOTS);
    }
    for (x = 0; x < 9; x++) {
      // Set the curr select and the addnewitem function will handle the rest, including rebuilding
      // the nine slot buffers, etc.
      gbCurrSelect = x;
      AddNewItemToSelectedMercsInventory(false);
    }
  }
  SetDroppableCheckboxesBasedOnMercsInventory();
  SpecifyItemToEdit(null, -1);
  gbCurrSelect = -1;
  gbCurrHilite = -1;
}

function SetDroppableCheckboxesBasedOnMercsInventory(): void {
  let pItem: Pointer<OBJECTTYPE>;
  let i: INT32;
  if (gpSelected && gpSelected.value.pDetailedPlacement) {
    for (i = 0; i < 9; i++) {
      pItem = addressof(gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[i]]);
      if (pItem.value.fFlags & OBJECT_UNDROPPABLE) {
        // check box is clear
        UnclickEditorButton(Enum32.MERCS_HEAD_SLOT + i);
      } else {
        ClickEditorButton(Enum32.MERCS_HEAD_SLOT + i);
      }
    }
  }
}

export function SetEnemyColorCode(ubColorCode: UINT8): void {
  if (gpSelected.value.pDetailedPlacement && gpSelected.value.pDetailedPlacement.value.ubProfile != NO_PROFILE)
    return;

  UnclickEditorButtons(FIRST_MERCS_COLORCODE_BUTTON, LAST_MERCS_COLORCODE_BUTTON);
  switch (ubColorCode) {
    case Enum262.SOLDIER_CLASS_ARMY:
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ARMY;
      gubSoldierClass = Enum262.SOLDIER_CLASS_ARMY;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ARMY;
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "REDVEST");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "GREENPANTS");
      ClickEditorButton(Enum32.MERCS_ARMY_CODE);
      break;
    case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ADMINISTRATOR;
      gubSoldierClass = Enum262.SOLDIER_CLASS_ADMINISTRATOR;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ADMINISTRATOR;
      ClickEditorButton(Enum32.MERCS_ADMIN_CODE);
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "BLUEVEST");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "BLUEPANTS");
      break;
    case Enum262.SOLDIER_CLASS_ELITE:
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ELITE;
      gubSoldierClass = Enum262.SOLDIER_CLASS_ELITE;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ELITE;
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "BLACKSHIRT");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "BLACKPANTS");
      ClickEditorButton(Enum32.MERCS_ELITE_CODE);
      break;
    case Enum262.SOLDIER_CLASS_MINER:
      // will probably never get called
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ELITE;
      gubSoldierClass = Enum262.SOLDIER_CLASS_MINER;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = Enum262.SOLDIER_CLASS_ELITE;
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "greyVEST");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "BEIGEPANTS");
      break;

    default:
      return;
  }
  CreateSoldierPalettes(gpSelected.value.pSoldier);
}

export function SetEnemyDroppableStatus(uiSlot: UINT32, fDroppable: boolean): void {
  if (gpSelected) {
    if (fDroppable) {
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.Inv[uiSlot].fFlags &= (~OBJECT_UNDROPPABLE);
      if (gpSelected.value.pSoldier)
        gpSelected.value.pSoldier.value.inv[uiSlot].fFlags &= (~OBJECT_UNDROPPABLE);
    } else {
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.Inv[uiSlot].fFlags |= OBJECT_UNDROPPABLE;
      if (gpSelected.value.pSoldier)
        gpSelected.value.pSoldier.value.inv[uiSlot].fFlags |= OBJECT_UNDROPPABLE;
    }
  }
  if (gbCurrSelect != -1 && uiSlot == gbMercSlotTypes[gbCurrSelect]) {
    if (gpMercSlotItem[gbCurrSelect].value.usItem == NOTHING)
      SpecifyItemToEdit(gpMercSlotItem[gbCurrSelect], -1);
  }
}

export function ChangeCivGroup(ubNewCivGroup: UINT8): void {
  Assert(ubNewCivGroup < Enum246.NUM_CIV_GROUPS);
  if (gubCivGroup == ubNewCivGroup)
    return;
  gubCivGroup = ubNewCivGroup;
  if (gpSelected && gpSelected.value.pSoldier) {
    gpSelected.value.pBasicPlacement.value.ubCivilianGroup = gubCivGroup;
    if (gpSelected.value.pDetailedPlacement)
      gpSelected.value.pDetailedPlacement.value.ubCivilianGroup = gubCivGroup;
    gpSelected.value.pSoldier.value.ubCivilianGroup = gubCivGroup;
  }
  // Adjust the text on the button
  SpecifyButtonText(iEditorButton[Enum32.MERCS_CIVILIAN_GROUP], gszCivGroupNames[gubCivGroup]);
}

export function RenderMercStrings(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sXPos: INT16;
  let sYPos: INT16;
  let sX: INT16;
  let sY: INT16;
  let pStr: string /* Pointer<UINT16> */;
  let curr: Pointer<SOLDIERINITNODE>;
  let str: string /* UINT16[50] */;

  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pSoldier && curr.value.pSoldier.value.bVisible == 1) {
      // Render the health text
      pSoldier = curr.value.pSoldier;
      GetSoldierAboveGuyPositions(pSoldier, addressof(sXPos), addressof(sYPos), false);
      // Display name
      SetFont(TINYFONT1());
      SetFontBackground(FONT_BLACK);
      SetFontForeground(FONT_WHITE);
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        ({ sX, sY } = FindFontCenterCoordinates(sXPos, sYPos, (80), 1, pSoldier.value.name, TINYFONT1()));
        if (sY < 352) {
          gprintfdirty(sX, sY, pSoldier.value.name);
          mprintf(sX, sY, pSoldier.value.name);
        }
        sYPos += 10;

        pStr = GetSoldierHealthString(pSoldier);

        SetFont(TINYFONT1());
        SetFontBackground(FONT_BLACK);
        SetFontForeground(FONT_RED);

        ({ sX, sY } = FindFontCenterCoordinates(sXPos, sYPos, 80, 1, pStr, TINYFONT1()));
        if (sY < 352) {
          gprintfdirty(sX, sY, pStr);
          mprintf(sX, sY, pStr);
        }
        sYPos += 10;

        SetFontForeground(FONT_GRAY2);
        str = swprintf("Slot #%d", pSoldier.value.ubID);
        ({ sX, sY } = FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1()));
        if (sY < 352) {
          gprintfdirty(sX, sY, str);
          mprintf(sX, sY, str);
        }
        sYPos += 10;
      } else {
        pStr = GetSoldierHealthString(pSoldier);

        SetFont(TINYFONT1());
        SetFontBackground(FONT_BLACK);
        SetFontForeground(FONT_RED);

        ({ sX, sY } = FindFontCenterCoordinates(sXPos, sYPos, 80, 1, pStr, TINYFONT1()));
        if (sY < 352) {
          gprintfdirty(sX, sY, pStr);
          mprintf(sX, sY, pStr);
        }
        sYPos += 10;

        SetFontForeground(FONT_GRAY2);
        str = swprintf("Slot #%d", pSoldier.value.ubID);
        ({ sX, sY } = FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1()));
        if (sY < 352) {
          gprintfdirty(sX, sY, str);
          mprintf(sX, sY, str);
        }
        sYPos += 10;
      }
      if (curr.value.pBasicPlacement.value.bOrders == Enum241.RNDPTPATROL || curr.value.pBasicPlacement.value.bOrders == Enum241.POINTPATROL) {
        // make sure the placement has at least one waypoint.
        if (!curr.value.pBasicPlacement.value.bPatrolCnt) {
          if (GetJA2Clock() % 1000 < 500)
            SetFontForeground(FONT_DKRED);
          else
            SetFontForeground(FONT_RED);
          str = "Patrol orders with no waypoints";
          ({ sX, sY } = FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1()));
          if (sY < 352) {
            gprintfdirty(sX, sY, str);
            mprintf(sX, sY, str);
          }
          sYPos += 10;
        }
      } else if (curr.value.pBasicPlacement.value.bPatrolCnt) {
        if (GetJA2Clock() % 1000 < 500)
          SetFontForeground(FONT_DKRED);
        else
          SetFontForeground(FONT_RED);
        str = "Waypoints with no patrol orders";
        ({ sX, sY } = FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1()));
        if (sY < 352) {
          gprintfdirty(sX, sY, str);
          mprintf(sX, sY, str);
        }
        sYPos += 10;
      }
    }
    curr = curr.value.next;
  }
  if (gubCurrMercMode == Enum42.MERC_SCHEDULEMODE) {
    RenderCurrentSchedule();
  }
}

export function SetMercTeamVisibility(bTeam: INT8, fVisible: boolean): void {
  let curr: Pointer<SOLDIERINITNODE>;
  let bVisible: INT8;
  curr = gSoldierInitHead;
  bVisible = fVisible ? 1 : -1;
  while (curr) {
    if (curr.value.pBasicPlacement.value.bTeam == bTeam) {
      if (curr.value.pSoldier) {
        curr.value.pSoldier.value.bLastRenderVisibleValue = bVisible;
        curr.value.pSoldier.value.bVisible = bVisible;
      }
    }
    curr = curr.value.next;
  }
  if (gpSelected && gpSelected.value.pSoldier && gpSelected.value.pSoldier.value.bTeam == bTeam && !fVisible) {
    IndicateSelectedMerc(Enum43.SELECT_NO_MERC);
  }
}

function DetermineScheduleEditability(): void {
  let i: INT32;
  EnableEditorButtons(Enum32.MERCS_SCHEDULE_ACTION1, Enum32.MERCS_SCHEDULE_DATA4B);
  EnableTextFields(1, 4);
  for (i = 0; i < 4; i++) {
    switch (gCurrSchedule.ubAction[i]) {
      case Enum171.SCHEDULE_ACTION_NONE:
      case Enum171.SCHEDULE_ACTION_LEAVESECTOR:
        EnableEditorButton(Enum32.MERCS_SCHEDULE_ACTION1 + i);
        EnableEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE1 + i);
        HideEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + i);
        HideEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + i);
        break;
      case Enum171.SCHEDULE_ACTION_LOCKDOOR:
      case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
      case Enum171.SCHEDULE_ACTION_OPENDOOR:
      case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
        EnableEditorButton(Enum32.MERCS_SCHEDULE_ACTION1 + i);
        EnableEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE1 + i);
        ShowEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + i);
        ShowEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + i);
        EnableEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + i);
        EnableEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + i);
        break;
      case Enum171.SCHEDULE_ACTION_GRIDNO:
      case Enum171.SCHEDULE_ACTION_ENTERSECTOR:
      case Enum171.SCHEDULE_ACTION_SLEEP:
        EnableEditorButton(Enum32.MERCS_SCHEDULE_ACTION1 + i);
        EnableEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE1 + i);
        ShowEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + i);
        HideEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + i);
        EnableEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + i);
        break;
      case Enum171.SCHEDULE_ACTION_STAYINSECTOR:
        DisableTextField((i + 1));
        EnableEditorButton(Enum32.MERCS_SCHEDULE_ACTION1 + i);
        DisableEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE1 + i);
        HideEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + i);
        HideEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + i);
        break;
    }
  }
}

export function CancelCurrentScheduleAction(): void {
  UpdateScheduleAction(Enum171.SCHEDULE_ACTION_NONE);
  DetermineScheduleEditability();
}

export function RegisterCurrentScheduleAction(iMapIndex: INT32): void {
  let str: string /* UINT16[6] */;
  MarkWorldDirty();
  str = swprintf("%d", iMapIndex);
  if (gfUseScheduleData2) {
    if (gfSingleAction)
      return;
    iDrawMode = Enum38.DRAW_MODE_PLAYER + gpSelected.value.pBasicPlacement.value.bTeam;
    gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = iMapIndex;
    SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex], str);
    DetermineScheduleEditability();
    gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_NONE;
    gfRenderTaskbar = true;
    gfUseScheduleData2 = false;
  } else {
    switch (gCurrSchedule.ubAction[gubCurrentScheduleActionIndex]) {
      case Enum171.SCHEDULE_ACTION_LOCKDOOR:
      case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
      case Enum171.SCHEDULE_ACTION_OPENDOOR:
      case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
        if (gfSingleAction) {
          gfSingleAction = false;
          gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_NONE;
          gfRenderTaskbar = true;
          DetermineScheduleEditability();
          break;
        }
        DisableEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
        EnableEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex);
        gfUseScheduleData2 = true;
        iDrawMode = Enum38.DRAW_MODE_SCHEDULEACTION;
        gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_DOOR2;
        gfRenderTaskbar = true;
        break;
      case Enum171.SCHEDULE_ACTION_GRIDNO:
      case Enum171.SCHEDULE_ACTION_ENTERSECTOR:
      case Enum171.SCHEDULE_ACTION_SLEEP:
        iDrawMode = Enum38.DRAW_MODE_PLAYER + gpSelected.value.pBasicPlacement.value.bTeam;
        DetermineScheduleEditability();
        gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_NONE;
        gfRenderTaskbar = true;
        break;
      case Enum171.SCHEDULE_ACTION_LEAVESECTOR:
      case Enum171.SCHEDULE_ACTION_STAYINSECTOR:
      case Enum171.SCHEDULE_ACTION_NONE:
        break;
    }
    gCurrSchedule.usData1[gubCurrentScheduleActionIndex] = iMapIndex;
    SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex], str);
  }
}

export function StartScheduleAction(): void {
  switch (gCurrSchedule.ubAction[gubCurrentScheduleActionIndex]) {
    case Enum171.SCHEDULE_ACTION_NONE:
      EnableEditorButtons(Enum32.MERCS_SCHEDULE_ACTION1, Enum32.MERCS_SCHEDULE_DATA4B);
      EnableTextFields(1, 4);
      gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_NONE;
      gfRenderTaskbar = true;
      gCurrSchedule.usData1[gubCurrentScheduleActionIndex] = 0xffff;
      gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = 0xffff;
      break;
    case Enum171.SCHEDULE_ACTION_LOCKDOOR:
    case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
    case Enum171.SCHEDULE_ACTION_OPENDOOR:
    case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
      // First disable everything -- its easier that way.
      ShowEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      ShowEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex);
      DisableEditorButtons(Enum32.MERCS_SCHEDULE_ACTION1, Enum32.MERCS_SCHEDULE_DATA4B);
      DisableTextFields(1, 4);
      EnableEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      gfUseScheduleData2 = false;
      iDrawMode = Enum38.DRAW_MODE_SCHEDULEACTION;
      gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_DOOR1;
      gfRenderTaskbar = true;
      break;
    case Enum171.SCHEDULE_ACTION_GRIDNO:
    case Enum171.SCHEDULE_ACTION_ENTERSECTOR:
    case Enum171.SCHEDULE_ACTION_SLEEP:
      ShowEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      HideEditorButton(Enum32.MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex);
      DisableEditorButtons(Enum32.MERCS_SCHEDULE_ACTION1, Enum32.MERCS_SCHEDULE_DATA4B);
      DisableTextFields(1, 4);
      EnableEditorButton(Enum32.MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      gfUseScheduleData2 = false;
      iDrawMode = Enum38.DRAW_MODE_SCHEDULEACTION;
      gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_GRIDNO;
      gfRenderTaskbar = true;
      gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = 0xffff;
      break;
    case Enum171.SCHEDULE_ACTION_LEAVESECTOR:
    case Enum171.SCHEDULE_ACTION_STAYINSECTOR:
      gubScheduleInstructions = Enum40.SCHEDULE_INSTRUCTIONS_NONE;
      gfRenderTaskbar = true;
      gCurrSchedule.usData1[gubCurrentScheduleActionIndex] = 0xffff;
      gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = 0xffff;
      break;
  }
  MarkWorldDirty();
}

export function UpdateScheduleAction(ubNewAction: UINT8): void {
  gCurrSchedule.ubAction[gubCurrentScheduleActionIndex] = ubNewAction;
  SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1 + gubCurrentScheduleActionIndex], gszScheduleActions[ubNewAction]);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1 + gubCurrentScheduleActionIndex], 0, ubNewAction);
  // Now, based on this action, disable the other buttons
  StartScheduleAction();
  gfSingleAction = false;
}

// 0:1A, 1:1B, 2:2A, 3:2B, ...
export function FindScheduleGridNo(ubScheduleData: UINT8): void {
  let iMapIndex: INT32;
  switch (ubScheduleData) {
    case 0: // 1a
      iMapIndex = gCurrSchedule.usData1[0];
      break;
    case 1: // 1b
      iMapIndex = gCurrSchedule.usData2[0];
      break;
    case 2: // 2a
      iMapIndex = gCurrSchedule.usData1[1];
      break;
    case 3: // 2b
      iMapIndex = gCurrSchedule.usData2[1];
      break;
    case 4: // 3a
      iMapIndex = gCurrSchedule.usData1[2];
      break;
    case 5: // 3b
      iMapIndex = gCurrSchedule.usData2[2];
      break;
    case 6: // 4a
      iMapIndex = gCurrSchedule.usData1[3];
      break;
    case 7: // 4b
      iMapIndex = gCurrSchedule.usData2[3];
      break;
    default:
      AssertMsg(0, "FindScheduleGridNo passed incorrect dataID.");
  }
  if (iMapIndex != 0xffff) {
    CenterScreenAtMapIndex(iMapIndex);
  }
}

export function ClearCurrentSchedule(): void {
  let i: UINT8;
  memset(addressof(gCurrSchedule), 0, sizeof(SCHEDULENODE));
  for (i = 0; i < 4; i++) {
    MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1 + i], 0, 0);
    SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1 + i], "No action");
    gCurrSchedule.usTime[i] = 0xffff;
    SetExclusive24HourTimeValue((i + 1), gCurrSchedule.usTime[i]); // blanks the field
    gCurrSchedule.usData1[i] = 0xffff;
    SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_DATA1A + i], "");
    gCurrSchedule.usData2[i] = 0xffff;
    SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_DATA1B + i], "");
  }
  // Remove the variance stuff
  gCurrSchedule.usFlags = 0;
  UnclickEditorButtons(Enum32.MERCS_SCHEDULE_VARIANCE1, Enum32.MERCS_SCHEDULE_VARIANCE4);

  gubCurrentScheduleActionIndex = 0;
  DetermineScheduleEditability();
  gfRenderTaskbar = true;
  MarkWorldDirty();
}

function RenderCurrentSchedule(): void {
  let dOffsetX: FLOAT;
  let dOffsetY: FLOAT;
  let ScrnX: FLOAT;
  let ScrnY: FLOAT;
  let i: INT32;
  let iMapIndex: INT32;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sX: INT16;
  let sY: INT16;
  let str: string /* UINT16[3] */;
  for (i = 0; i < 8; i++) {
    if (i % 2)
      iMapIndex = gCurrSchedule.usData2[i / 2];
    else
      iMapIndex = gCurrSchedule.usData1[i / 2];

    if (iMapIndex == 0xffff)
      continue;

    // Convert it's location to screen coordinates
    ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(iMapIndex));

    dOffsetX = (sXMapPos * CELL_X_SIZE) - gsRenderCenterX;
    dOffsetY = (sYMapPos * CELL_Y_SIZE) - gsRenderCenterY;

    ({ dScreenX: ScrnX, dScreenY: ScrnY } = FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

    sScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + ScrnX;
    sScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + ScrnY;

    // Adjust for tiles height factor!
    sScreenY -= gpWorldLevelData[iMapIndex].sHeight;
    // Bring it down a touch
    sScreenY += 5;

    if (sScreenY <= 355) {
      // Shown it on screen!
      SetFont(TINYFONT1());
      SetFontBackground(FONT_LTKHAKI);
      SetFontForeground(FONT_WHITE);
      str = swprintf("%d%c", i / 2 + 1, 'A' + (i % 2));
      ({ sX, sY } = VarFindFontCenterCoordinates(sScreenX, sScreenY, 1, 1, TINYFONT1(), str));
      mprintf(sX, sY, str);
    }
  }
}

function UpdateScheduleInfo(): void {
  let i: INT32;
  let pSchedule: Pointer<SCHEDULENODE>;
  let str: string /* UINT16[6] */;
  if (gpSelected.value.pSoldier.value.ubScheduleID) {
    pSchedule = GetSchedule(gpSelected.value.pSoldier.value.ubScheduleID);
    if (!pSchedule) {
      return;
    }
    for (i = 0; i < 4; i++) {
      // Update the text and buttons
      MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1 + i], 0, pSchedule.value.ubAction[i]);
      SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1 + i], gszScheduleActions[pSchedule.value.ubAction[i]]);
      str = "";
      if (pSchedule.value.usData1[i] != 0xffff)
        str = swprintf("%d", pSchedule.value.usData1[i]);
      SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_DATA1A + i], str);
      str = "";
      if (pSchedule.value.usData2[i] != 0xffff)
        str = swprintf("%d", pSchedule.value.usData2[i]);
      SpecifyButtonText(iEditorButton[Enum32.MERCS_SCHEDULE_DATA1B + i], str);
      if (gubCurrMercMode == Enum42.MERC_SCHEDULEMODE) {
        // Update the text input fields too!
        SetExclusive24HourTimeValue((i + 1), pSchedule.value.usTime[i]);
      }
    }

    // Check or uncheck the checkbox buttons based on the schedule's status.
    UnclickEditorButtons(Enum32.MERCS_SCHEDULE_VARIANCE1, Enum32.MERCS_SCHEDULE_VARIANCE4);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE1)
      ClickEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE1);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE2)
      ClickEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE2);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE3)
      ClickEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE3);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE4)
      ClickEditorButton(Enum32.MERCS_SCHEDULE_VARIANCE4);

    // Copy the schedule over to the current global schedule used for editing purposes.
    memcpy(addressof(gCurrSchedule), pSchedule, sizeof(SCHEDULENODE));
    DetermineScheduleEditability();
  } else {
    ClearCurrentSchedule();
  }
}

export let gSaveBufferBasicPlacement: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
export let gSaveBufferDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();

export function CopyMercPlacement(iMapIndex: INT32): void {
  if (gsSelectedMercID == -1) {
    ScreenMsg(FONT_MCOLOR_LTRED, MSG_INTERFACE, "Placement not copied because no placement selected.");
    return;
  }
  gfSaveBuffer = true;
  memcpy(addressof(gSaveBufferBasicPlacement), gpSelected.value.pBasicPlacement, sizeof(BASIC_SOLDIERCREATE_STRUCT));
  if (gSaveBufferBasicPlacement.fDetailedPlacement) {
    memcpy(addressof(gSaveBufferDetailedPlacement), gpSelected.value.pDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));
  }
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Placement copied.");
}

export function PasteMercPlacement(iMapIndex: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let i: INT32;

  if (!gfSaveBuffer) {
    ScreenMsg(FONT_MCOLOR_LTRED, MSG_INTERFACE, "Placement not pasted as no placement is saved in buffer.");
    return;
  }

  memcpy(addressof(gTempBasicPlacement), addressof(gSaveBufferBasicPlacement), sizeof(BASIC_SOLDIERCREATE_STRUCT));

  gTempBasicPlacement.bBodyType = -1;

  // calculate specific information based on the team.
  switch (iDrawMode) {
    case Enum38.DRAW_MODE_ENEMY:
      gTempBasicPlacement.bTeam = ENEMY_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubSoldierClass = gubSoldierClass;
      break;
    case Enum38.DRAW_MODE_CREATURE:
      gTempBasicPlacement.bTeam = CREATURE_TEAM;
      gTempBasicPlacement.bBodyType = gbCurrCreature;
      break;
    case Enum38.DRAW_MODE_REBEL:
      gTempBasicPlacement.bTeam = MILITIA_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      break;
    case Enum38.DRAW_MODE_CIVILIAN:
      gTempBasicPlacement.bTeam = CIV_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubCivilianGroup = gubCivGroup;
      if (giCurrentTilesetID == 1) // caves
      {
        gTempBasicPlacement.ubSoldierClass = Enum262.SOLDIER_CLASS_MINER;
      }
      break;
  }

  if (IsLocationSittable(iMapIndex, gfRoofPlacement)) {
    let ubID: UINT8;
    let sSectorX: INT16;
    let sSectorY: INT16;
    let pNode: Pointer<SOLDIERINITNODE>;

    ({ sSectorX, sSectorY } = GetCurrentWorldSector());

    // Set up some general information.
    // gTempBasicPlacement.fDetailedPlacement = TRUE;
    gTempBasicPlacement.usStartingGridNo = iMapIndex;

    // Generate detailed placement information given the temp placement information.
    if (gTempBasicPlacement.fDetailedPlacement) {
      memcpy(addressof(gTempDetailedPlacement), addressof(gSaveBufferDetailedPlacement), sizeof(SOLDIERCREATE_STRUCT));
    } else {
      CreateDetailedPlacementGivenBasicPlacementInfo(addressof(gTempDetailedPlacement), addressof(gTempBasicPlacement));
    }

    // Set the sector information -- probably unnecessary.
    gTempDetailedPlacement.sSectorX = sSectorX;
    gTempDetailedPlacement.sSectorY = sSectorY;

    if (gTempBasicPlacement.fDetailedPlacement) {
      CreateDetailedPlacementGivenStaticDetailedPlacementAndBasicPlacementInfo(addressof(tempDetailedPlacement), addressof(gTempDetailedPlacement), addressof(gTempBasicPlacement));
    } else {
      memcpy(addressof(tempDetailedPlacement), addressof(gTempDetailedPlacement), sizeof(SOLDIERCREATE_STRUCT));
    }

    // Create the soldier, but don't place it yet.
    if (pSoldier = TacticalCreateSoldier(addressof(tempDetailedPlacement), addressof(ubID))) {
      pSoldier.value.bVisible = 1;
      pSoldier.value.bLastRenderVisibleValue = 1;
      // Set up the soldier in the list, so we can track the soldier in the
      // future (saving, loading, strategic AI)
      pNode = AddBasicPlacementToSoldierInitList(addressof(gTempBasicPlacement));
      Assert(pNode);
      pNode.value.pSoldier = pSoldier;
      if (gSaveBufferBasicPlacement.fDetailedPlacement) {
        // Add the static detailed placement information in the same newly created node as the basic placement.
        // read static detailed placement from file
        // allocate memory for new static detailed placement
        gTempBasicPlacement.fDetailedPlacement = true;
        gTempBasicPlacement.fPriorityExistance = gSaveBufferBasicPlacement.fPriorityExistance;
        pNode.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
        if (!pNode.value.pDetailedPlacement) {
          AssertMsg(0, "Failed to allocate memory for new detailed placement in PasteMercPlacement.");
          return;
        }
        // copy the file information from temp var to node in list.
        memcpy(pNode.value.pDetailedPlacement, addressof(gSaveBufferDetailedPlacement), sizeof(SOLDIERCREATE_STRUCT));
      }

      // Add the soldier to physically appear on the map now.
      InternalAddSoldierToSector(ubID, false, false, 0, 0);
      IndicateSelectedMerc(ubID);

      // Move him to the roof if intended and possible.
      if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
        gpSelected.value.pBasicPlacement.value.fOnRoof = true;
        if (gpSelected.value.pDetailedPlacement)
          gpSelected.value.pDetailedPlacement.value.fOnRoof = true;
        SetSoldierHeight(gpSelected.value.pSoldier, 58.0);
      }
      UnclickEditorButtons(FIRST_MERCS_INVENTORY_BUTTON, LAST_MERCS_INVENTORY_BUTTON);
      for (i = FIRST_MERCS_INVENTORY_BUTTON; i <= LAST_MERCS_INVENTORY_BUTTON; i++) {
        SetEnemyDroppableStatus(gbMercSlotTypes[i - FIRST_MERCS_INVENTORY_BUTTON], false);
      }
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Placement pasted.");
    } else {
      ScreenMsg(FONT_MCOLOR_LTRED, MSG_INTERFACE, "Placement not pasted as the maximum number of placements for this team is already used.");
    }
  }
}

}
