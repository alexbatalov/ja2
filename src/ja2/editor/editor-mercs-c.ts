//--------------------------------------------------
//	NON_CIV_GROUP,
//	REBEL_CIV_GROUP,
//	KINGPIN_CIV_GROUP,
//	SANMONA_ARMS_GROUP,
//	ANGELS_GROUP,
//	NUM_CIV_GROUPS
let gszCivGroupNames: UINT16[][] /* [NUM_CIV_GROUPS][20] */ = [
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
let gszScheduleActions: UINT16[][] /* [NUM_SCHEDULE_ACTIONS][20] */ = [
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

let gfSingleAction: BOOLEAN = FALSE;
let gfUseScheduleData2: BOOLEAN = FALSE;
let gubCurrentScheduleActionIndex: UINT8 = 0;
let gCurrSchedule: SCHEDULENODE;
let gubScheduleInstructions: UINT8 = SCHEDULE_INSTRUCTIONS_NONE;

// array which keeps track of which item is in which slot.  This is dependant on the selected merc, so
// these temp values must be updated when different mercs are selected, and reset when a merc detailed
// placement is created.
let gpMercSlotItem: Pointer<OBJECTTYPE>[] /* [9] */ = [
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
];
// Because we only support these nine slots, they aren't continuous values, so this array helps
// processing functions by referring to this array to get the appropriate slot.
let gbMercSlotTypes: INT8[] /* [9] */ = [
  HELMETPOS,
  VESTPOS,
  LEGPOS,
  HANDPOS,
  SECONDHANDPOS,
  BIGPOCK1POS,
  BIGPOCK2POS,
  BIGPOCK3POS,
  BIGPOCK4POS,
];
// returns the usItem index of specified slot in the currently selected merc.
const GetSelectedMercSlotItemIndex = (x) => (gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[x]].usItem);
const GetSelectedMercSlot = (x) => (&gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[x]]);
// values indicating which merc inventory slot is hilited and which slot is selected.
let gbCurrHilite: INT8 = -1;
let gbCurrSelect: INT8 = -1;

// internal merc variables
let gTempBasicPlacement: BASIC_SOLDIERCREATE_STRUCT;
let gTempDetailedPlacement: SOLDIERCREATE_STRUCT;

let gsSelectedMercID: INT16;
let gsSelectedMercGridNo: INT16;
let gpSelected: Pointer<SOLDIERINITNODE>;

let gubCurrMercMode: UINT8 = MERC_TEAMMODE;
let gubPrevMercMode: UINT8 = MERC_NOMODE;
let gubLastDetailedMercMode: UINT8 = MERC_GENERALMODE;
let gbDefaultOrders: INT8 = STATIONARY;
let gbDefaultAttitude: INT8 = DEFENSIVE;
let gbDefaultRelativeEquipmentLevel: INT8 = 2;
let gbDefaultRelativeAttributeLevel: INT8 = 2;
let gbDefaultDirection: INT8 = NORTHWEST;
let gubSoldierClass: INT8 = SOLDIER_CLASS_ARMY;
let gubCivGroup: UINT8 = NON_CIV_GROUP;

let pTempSoldier: Pointer<SOLDIERTYPE>;
let gfRoofPlacement: BOOLEAN;

// Below are all flags that have to do with editing detailed placement mercs:

// Determines if the user is allowed to edit merc colors.  User must specifically
// click on the checkbox by the colors to confirm that colors will be specified.  If
// not, the colors will be randomly generated upon creation in the game.
let gfCanEditMercColors: BOOLEAN = FALSE;
// A rendering flag that is set whenever a full update of the merc editing information
// needs to be done.
let gfRenderMercInfo: BOOLEAN = FALSE;
// When the user specifies a profile index for the merc, all editing is disabled.  This is
// because the profile contains all of the information.  When this happens, all of the editing
// buttons are disabled, but you are allowed to view stats, inventory, etc., as well as specify
// orders, attitude, and direction.
let gfCanEditMercs: BOOLEAN = TRUE;
// When in inventory mode, this flag is set when the user wishes to get an item, which requires hooking
// into the item editing features.  This is processed during the editor update, which in turn, sets the
// new mode.
let gfMercGetItem: BOOLEAN = FALSE;
// As soon as an item is selected, the items index is stored here, so the item can be copied into the
// slot for editing and rendering purposes.  This is a temp store value only when leaving the editor items
// mode.
let gusMercsNewItemIndex: UINT16 = 0xffff;

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

let gfShowPlayers: BOOLEAN = TRUE;
let gfShowEnemies: BOOLEAN = TRUE;
let gfShowCreatures: BOOLEAN = TRUE;
let gfShowRebels: BOOLEAN = TRUE;
let gfShowCivilians: BOOLEAN = TRUE;

const BASE_STAT_DEVIATION = 7;
const BASE_EXPLVL_DEVIATION = 1;
const BASE_PROTLVL_DEVIATION = 0;
const BASE_GUNTYPE_DEVIATION = 4;
const DEFAULT_DIFF = 2;

let sCurBaseDiff: INT16 = DEFAULT_DIFF;
let fAskForBaseDifficulty: BOOLEAN = TRUE;
let zDiffNames: Pointer<UINT16>[] /* [NUM_DIFF_LVLS] */ = [
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

let EditMercStat: Pointer<UINT16>[] /* [12] */ = [
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
let EditMercOrders: Pointer<UINT16>[] /* [8] */ = [
  "Stationary",
  "On Guard",
  "Close Patrol",
  "Far Patrol",
  "Point Patrol",
  "On Call",
  "Seek Enemy",
  "Random Point Patrol",
];

let EditMercAttitudes: Pointer<UINT16>[] /* [6] */ = [
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
  REGMALE,
  BIGMALE,
  STOCKYMALE,
  REGFEMALE,
  TANK_NW,
  TANK_NE,
];
let bCreatureArray: INT8[] /* [MAX_CREATURETYPES] */ = [
  BLOODCAT,
  LARVAE_MONSTER,
  INFANT_MONSTER,
  YAF_MONSTER,
  YAM_MONSTER,
  ADULTFEMALEMONSTER,
  AM_MONSTER,
  QUEENMONSTER,
];
let bRebelArray: INT8[] /* [MAX_REBELTYPES] */ = [
  RANDOM,
  FATCIV,
  MANCIV,
  REGMALE,
  BIGMALE,
  STOCKYMALE,
  REGFEMALE,
];
let bCivArray: INT8[] /* [MAX_CIVTYPES] */ = [
  RANDOM,
  FATCIV,
  MANCIV,
  MINICIV,
  DRESSCIV,
  HATKIDCIV,
  KIDCIV,
  REGMALE,
  BIGMALE,
  STOCKYMALE,
  REGFEMALE,
  HUMVEE,
  ELDORADO,
  ICECREAMTRUCK,
  JEEP,
  CRIPPLECIV,
  ROBOTNOWEAPON,
  COW,
];
let gbCurrCreature: INT8 = BLOODCAT;

let gfSaveBuffer: BOOLEAN = FALSE;
let gSaveBufferBasicPlacement: BASIC_SOLDIERCREATE_STRUCT;
let gSaveBufferDetailedPlacement: SOLDIERCREATE_STRUCT;

function GameInitEditorMercsInfo(): void {
  let i: INT32;
  // Initialize the placement list
  InitSoldierInitList();
  gMapInformation.ubNumIndividuals = 0;
  memset(&gCurrSchedule, 0, sizeof(SCHEDULENODE));
  for (i = 0; i < 4; i++) {
    gCurrSchedule.usTime[i] = 0xffff;
    gCurrSchedule.usData1[i] = 0xffff;
    gCurrSchedule.usData2[i] = 0xffff;
  }
}

function GameShutdownEditorMercsInfo(): void {
  UseEditorAlternateList();
  KillSoldierInitList();
  UseEditorOriginalList();
  KillSoldierInitList();
}

function EntryInitEditorMercsInfo(): void {
  let x: INT32;
  let iCurStart: INT32 = 0;
  iEditColorStart[0] = 0;
  for (x = 1; x < EDIT_NUM_COLORS; x++) {
    iCurStart += gubpNumReplacementsPerRange[x - 1];
    iEditColorStart[x] = iCurStart;
  }
  gsSelectedMercID = -1;
  gsSelectedMercGridNo = 0;

  gfCanEditMercs = TRUE;
}

const enum Enum41 {
  HAIR_PAL,
  SKIN_PAL,
  VEST_PAL,
  PANTS_PAL,
}

function ProcessMercEditing(): void {
  let ubType: UINT8;
  let ubPaletteRep: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  if (iEditMercMode == EDIT_MERC_NONE) {
    return;
  }
  GetSoldier(&pSoldier, gsSelectedMercID);

  switch (iEditMercMode) {
    case EDIT_MERC_PREV_COLOR:
    case EDIT_MERC_NEXT_COLOR:
      // Handle changes to the merc colors
      switch (iEditWhichStat) {
        case 0:
          ubType = EDIT_COLOR_HEAD;
          GetPaletteRepIndexFromID(pSoldier.value.HeadPal, &ubPaletteRep);

          ubPaletteRep--;
          if ((ubPaletteRep < iEditColorStart[ubType]) || (ubPaletteRep > (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType])))
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.HeadPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.HeadPal, pSoldier.value.HeadPal);
          CreateSoldierPalettes(pSoldier);
          break;
        case 1:
          ubType = EDIT_COLOR_HEAD;
          GetPaletteRepIndexFromID(pSoldier.value.HeadPal, &ubPaletteRep);

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.HeadPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.HeadPal, pSoldier.value.HeadPal);
          CreateSoldierPalettes(pSoldier);
          break;

        case 2:
          ubType = EDIT_COLOR_SKIN;
          GetPaletteRepIndexFromID(pSoldier.value.SkinPal, &ubPaletteRep);

          ubPaletteRep--;
          if (ubPaletteRep < iEditColorStart[ubType])
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.SkinPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.SkinPal, pSoldier.value.SkinPal);
          CreateSoldierPalettes(pSoldier);
          break;
        case 3:
          ubType = EDIT_COLOR_SKIN;
          GetPaletteRepIndexFromID(pSoldier.value.SkinPal, &ubPaletteRep);

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.SkinPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.SkinPal, pSoldier.value.SkinPal);
          CreateSoldierPalettes(pSoldier);
          break;

        case 4:
          ubType = EDIT_COLOR_VEST;
          GetPaletteRepIndexFromID(pSoldier.value.VestPal, &ubPaletteRep);

          ubPaletteRep--;
          if (ubPaletteRep < iEditColorStart[ubType])
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.VestPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.VestPal, pSoldier.value.VestPal);
          CreateSoldierPalettes(pSoldier);
          break;
        case 5:
          ubType = EDIT_COLOR_VEST;
          GetPaletteRepIndexFromID(pSoldier.value.VestPal, &ubPaletteRep);

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.VestPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.VestPal, pSoldier.value.VestPal);
          CreateSoldierPalettes(pSoldier);
          break;

        case 6:
          ubType = EDIT_COLOR_PANTS;
          GetPaletteRepIndexFromID(pSoldier.value.PantsPal, &ubPaletteRep);

          ubPaletteRep--;
          if (ubPaletteRep < iEditColorStart[ubType])
            ubPaletteRep = iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType] - 1;

          SET_PALETTEREP_ID(pSoldier.value.PantsPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.PantsPal, pSoldier.value.PantsPal);
          CreateSoldierPalettes(pSoldier);
          break;
        case 7:
          ubType = EDIT_COLOR_PANTS;
          GetPaletteRepIndexFromID(pSoldier.value.PantsPal, &ubPaletteRep);

          ubPaletteRep++;
          if (ubPaletteRep >= (iEditColorStart[ubType] + gubpNumReplacementsPerRange[ubType]))
            ubPaletteRep = iEditColorStart[ubType];

          SET_PALETTEREP_ID(pSoldier.value.PantsPal, gpPalRep[ubPaletteRep].ID);
          sprintf(gpSelected.value.pDetailedPlacement.value.PantsPal, pSoldier.value.PantsPal);
          CreateSoldierPalettes(pSoldier);
          break;
      }
      iEditMercMode = EDIT_MERC_NONE;
      break;
  }
}

function AddMercToWorld(iMapIndex: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;

  memset(&gTempBasicPlacement, 0, sizeof(BASIC_SOLDIERCREATE_STRUCT));

  gTempBasicPlacement.bBodyType = -1;

  // calculate specific information based on the team.
  switch (iDrawMode) {
    case DRAW_MODE_ENEMY:
      gTempBasicPlacement.bTeam = ENEMY_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubSoldierClass = gubSoldierClass;
      break;
    case DRAW_MODE_CREATURE:
      gTempBasicPlacement.bTeam = CREATURE_TEAM;
      gTempBasicPlacement.bBodyType = gbCurrCreature;
      break;
    case DRAW_MODE_REBEL:
      gTempBasicPlacement.bTeam = MILITIA_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      break;
    case DRAW_MODE_CIVILIAN:
      gTempBasicPlacement.bTeam = CIV_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubCivilianGroup = gubCivGroup;
      if (giCurrentTilesetID == 1) // caves
      {
        gTempBasicPlacement.ubSoldierClass = SOLDIER_CLASS_MINER;
      }
      break;
  }

  if (IsLocationSittable(iMapIndex, gfRoofPlacement)) {
    let ubID: UINT8;
    let sSectorX: INT16;
    let sSectorY: INT16;
    let pNode: Pointer<SOLDIERINITNODE>;

    GetCurrentWorldSector(&sSectorX, &sSectorY);

    // Set up some general information.
    gTempBasicPlacement.fDetailedPlacement = FALSE;
    gTempBasicPlacement.fPriorityExistance = FALSE;
    gTempBasicPlacement.usStartingGridNo = iMapIndex;
    gTempBasicPlacement.bOrders = gbDefaultOrders;
    gTempBasicPlacement.bAttitude = gbDefaultAttitude;
    gTempBasicPlacement.bRelativeAttributeLevel = gbDefaultRelativeAttributeLevel;
    gTempBasicPlacement.bRelativeEquipmentLevel = gbDefaultRelativeEquipmentLevel;
    gTempBasicPlacement.bDirection = gbDefaultDirection;

    // Generate detailed placement information given the temp placement information.
    CreateDetailedPlacementGivenBasicPlacementInfo(&gTempDetailedPlacement, &gTempBasicPlacement);

    // Set the sector information -- probably unnecessary.
    gTempDetailedPlacement.sSectorX = sSectorX;
    gTempDetailedPlacement.sSectorY = sSectorY;

    // Create the soldier, but don't place it yet.
    if (pSoldier = TacticalCreateSoldier(&gTempDetailedPlacement, &ubID)) {
      pSoldier.value.bVisible = 1;
      pSoldier.value.bLastRenderVisibleValue = 1;
      // Set up the soldier in the list, so we can track the soldier in the
      // future (saving, loading, strategic AI)
      pNode = AddBasicPlacementToSoldierInitList(&gTempBasicPlacement);
      Assert(pNode);
      pNode.value.pSoldier = pSoldier;

      // Add the soldier to physically appear on the map now.
      InternalAddSoldierToSector(ubID, FALSE, FALSE, 0, 0);
      IndicateSelectedMerc(ubID);

      // Move him to the roof if intended and possible.
      if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
        gpSelected.value.pBasicPlacement.value.fOnRoof = TRUE;
        if (gpSelected.value.pDetailedPlacement)
          gpSelected.value.pDetailedPlacement.value.fOnRoof = TRUE;
        SetSoldierHeight(gpSelected.value.pSoldier, 58.0);
      }
      UnclickEditorButtons(FIRST_MERCS_INVENTORY_BUTTON, LAST_MERCS_INVENTORY_BUTTON);
      for (i = FIRST_MERCS_INVENTORY_BUTTON; i <= LAST_MERCS_INVENTORY_BUTTON; i++) {
        SetEnemyDroppableStatus(gbMercSlotTypes[i - FIRST_MERCS_INVENTORY_BUTTON], FALSE);
      }
    }
  }
}

function HandleRightClickOnMerc(iMapIndex: INT32): void {
  let pNode: Pointer<SOLDIERINITNODE>;
  let sThisMercID: INT16;
  let sCellX: INT16;
  let sCellY: INT16;

  ConvertGridNoToCellXY(iMapIndex, &sCellX, &sCellY);

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
    RemoveAllObjectsOfTypeRange(gsSelectedMercGridNo, CONFIRMMOVE, CONFIRMMOVE);
    EVENT_SetSoldierPosition(gpSelected.value.pSoldier, (sCellX + 5), (sCellY + 5));
    if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
      gpSelected.value.pBasicPlacement.value.fOnRoof = TRUE;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.fOnRoof = TRUE;
      SetSoldierHeight(gpSelected.value.pSoldier, 58.0);
    } else {
      gpSelected.value.pBasicPlacement.value.fOnRoof = FALSE;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.fOnRoof = FALSE;
      SetSoldierHeight(gpSelected.value.pSoldier, 0.0);
    }
    gsSelectedMercGridNo = iMapIndex;
    gpSelected.value.pBasicPlacement.value.usStartingGridNo = gsSelectedMercGridNo;
    if (gpSelected.value.pDetailedPlacement)
      gpSelected.value.pDetailedPlacement.value.sInsertionGridNo = gsSelectedMercGridNo;
    AddObjectToHead(gsSelectedMercGridNo, CONFIRMMOVE1);
  }
}

function ResetAllMercPositions(): void {
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
      curr.value.pSoldier = NULL;
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
  gpSelected = NULL;
  gsSelectedMercID = -1;
}

function AddMercWaypoint(iMapIndex: UINT32): void {
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
  gfRenderWorld = TRUE;
}

function EraseMercWaypoint(): void {
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
  gfRenderWorld = TRUE;
}

//----------------------------------------------------------------------------------------------
//	ChangeBaseSoldierStats
//
//	This functions changes the stats of a given merc (PC or NPC, though should only be used
//	for NPC mercs) to reflect the base difficulty level selected.
//
function ChangeBaseSoldierStats(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier == NULL)
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
  let TempString: INT16[] /* [30] */;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let iEditStat: INT8[] /* [12] */;

  usFillColorBack = 0;

  if (gsSelectedMercID == -1) {
    //		fEditingMerc = FALSE;
    //		DestroyEditMercWindow();
    return;
  }

  GetSoldier(&pSoldier, gsSelectedMercID);

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

  SetFont(FONT12POINT1);

  // Name window
  gprintf(iXPos + 128, iYPos + 3, "Merc Name:");
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 128, iYPos + 16, iXPos + 128 + 104, iYPos + 16 + 19, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 17, iXPos + 128 + 104, iYPos + 17 + 19, usFillColorLight);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 17, iXPos + 128 + 103, iYPos + 17 + 18, usFillColorTextBk);
  iXOff = (105 - StringPixLength(pSoldier.value.name, FONT12POINT1)) / 2;
  gprintf(iXPos + 130 + iXOff, iYPos + 20, "%s", pSoldier.value.name);

  // Orders window
  gprintf(iXPos + 128, iYPos + 38, "Orders:");
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 128, iYPos + 51, iXPos + 128 + 104, iYPos + 51 + 19, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 52, iXPos + 128 + 104, iYPos + 52 + 19, usFillColorLight);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 52, iXPos + 128 + 103, iYPos + 52 + 18, usFillColorTextBk);
  iXOff = (105 - StringPixLength(EditMercOrders[pSoldier.value.bOrders], FONT12POINT1)) / 2;
  gprintf(iXPos + 130 + iXOff, iYPos + 55, "%s", EditMercOrders[pSoldier.value.bOrders]);

  // Combat window
  gprintf(iXPos + 128, iYPos + 73, "Combat Attitude:");
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 128, iYPos + 86, iXPos + 128 + 104, iYPos + 86 + 19, usFillColorDark);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 87, iXPos + 128 + 104, iYPos + 87 + 19, usFillColorLight);
  ColorFillVideoSurfaceArea(FRAME_BUFFER, iXPos + 129, iYPos + 87, iXPos + 128 + 103, iYPos + 87 + 18, usFillColorTextBk);
  iXOff = (105 - StringPixLength(EditMercAttitudes[pSoldier.value.bAttitude], FONT12POINT1)) / 2;
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

    swprintf(TempString, "%d", iEditStat[x]);
    iXOff = (30 - StringPixLength(TempString, FONT12POINT1)) / 2;
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
  let fSoldierFound: BOOLEAN;

  RetIDNumber = -1;
  fSoldierFound = FALSE;
  for (IDNumber = 0; IDNumber < MAX_NUM_SOLDIERS && !fSoldierFound; IDNumber++) {
    if (GetSoldier(&pSoldier, IDNumber)) {
      if (pSoldier.value.sGridNo == iMapIndex) {
        fSoldierFound = TRUE;
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

function EditMercChangeToStatsPageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_TO_STATS;
  }
}

function EditMercChangeToColorPageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_TO_COLOR;
  }
}

function EditMercDoneEditCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_DONE;
  }
}

function EditMercBkgrndCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_DONE;
  }
}

function EditMercPrevOrderCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_PREV_ORDER;
  }
}

function EditMercNextOrderCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NEXT_ORDER;
  }
}

function EditMercPrevAttCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_PREV_ATT;
  }
}

function EditMercNextAttCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NEXT_ATT;
  }
}

function EditMercStatUpCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 36 && iEditWhichStat == -1; iBtn++) {
      if (btn.value.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_INC_STAT;
    }

    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NONE;
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function EditMercStatDwnCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 36 && iEditWhichStat == -1; iBtn++) {
      if (btn.value.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_DEC_STAT;
    }

    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_NONE;
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function EditMercSetDirCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 36 && iEditWhichStat == -1; iBtn++) {
      if (btn.value.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_SET_DIR;
    }

    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function EditMercCenterCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditStatTimer = 0;
    iEditMercMode = EDIT_MERC_FIND;

    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function EditMercColorDwnCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iBtn: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = 0; iBtn < 8 && iEditWhichStat == -1; iBtn++) {
      if (btn.value.IDNum == iEditorButton[iBtn])
        iEditWhichStat = iBtn;
    }

    if (iEditWhichStat != -1) {
      iEditStatTimer = 0;
      iEditMercMode = EDIT_MERC_PREV_COLOR;
    }

    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function MercsToggleColorModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) // button is checked
    {
      EnableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
      gpSelected.value.pDetailedPlacement.value.fVisible = TRUE;
      sprintf(gpSelected.value.pDetailedPlacement.value.HeadPal, gpSelected.value.pSoldier.value.HeadPal);
      sprintf(gpSelected.value.pDetailedPlacement.value.SkinPal, gpSelected.value.pSoldier.value.SkinPal);
      sprintf(gpSelected.value.pDetailedPlacement.value.VestPal, gpSelected.value.pSoldier.value.VestPal);
      sprintf(gpSelected.value.pDetailedPlacement.value.PantsPal, gpSelected.value.pSoldier.value.PantsPal);
    } else // button is unchecked.
    {
      DisableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
      gpSelected.value.pDetailedPlacement.value.fVisible = FALSE;
    }
    gfRenderMercInfo = TRUE;
    gfRenderTaskbar = TRUE;
  }
}

function MercsSetColorsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iBtn: INT32;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditWhichStat = -1;
    for (iBtn = FIRST_MERCS_COLOR_BUTTON; iBtn <= LAST_MERCS_COLOR_BUTTON; iBtn++) {
      if (btn.value.IDNum == iEditorButton[iBtn]) {
        iEditWhichStat = iBtn - FIRST_MERCS_COLOR_BUTTON;
        iEditStatTimer = 0;
        iEditMercMode = EDIT_MERC_NEXT_COLOR;
        gfRenderMercInfo = TRUE;
        return;
      }
    }
  }
}

function MercsSetBodyTypeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderMercInfo = TRUE;
    if (btn.value.IDNum == iEditorButton[MERCS_BODYTYPE_DOWN])
      ChangeBodyType(1); // next
    else
      ChangeBodyType(-1); // previous
  }
}

function EditMercDecDifficultyCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    iEditorToolbarState = TBAR_MODE_DEC_DIFF;
  }
}

function EditMercIncDifficultyCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    iEditorToolbarState = TBAR_MODE_INC_DIFF;
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
    if (!strlen(pSoldier.value.HeadPal))
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.HeadPal, &ubPaletteRep);
  }
  ShowEditMercColorSet(ubPaletteRep, 0);

  if (pSoldier) {
    if (!strlen(pSoldier.value.SkinPal))
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.SkinPal, &ubPaletteRep);
  }
  ShowEditMercColorSet(ubPaletteRep, 1);

  if (pSoldier) {
    if (!strlen(pSoldier.value.VestPal))
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.VestPal, &ubPaletteRep);
  }
  ShowEditMercColorSet(ubPaletteRep, 2);

  if (pSoldier) {
    if (!strlen(pSoldier.value.VestPal))
      ubPaletteRep = 0xff;
    else
      GetPaletteRepIndexFromID(pSoldier.value.PantsPal, &ubPaletteRep);
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
function DisplayWayPoints(): void {
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

  GetSoldier(&pSoldier, gsSelectedMercID);
  if (pSoldier == NULL || !pSoldier.value.bActive)
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
    ConvertGridNoToXY(sGridNo, &sXMapPos, &sYMapPos);

    dOffsetX = (sXMapPos * CELL_X_SIZE) - gsRenderCenterX;
    dOffsetY = (sYMapPos * CELL_Y_SIZE) - gsRenderCenterY;

    FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, &ScrnX, &ScrnY);

    sScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + ScrnX;
    sScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + ScrnY;

    // Adjust for tiles height factor!
    sScreenY -= gpWorldLevelData[sGridNo].sHeight;
    // Bring it down a touch
    sScreenY += 5;

    if (sScreenY <= 355) {
      // Shown it on screen!
      SetFont(TINYFONT1);
      if (pSoldier.value.bLevel == 1) {
        SetFontBackground(FONT_LTBLUE);
        sScreenY -= 68;
      } else
        SetFontBackground(FONT_LTRED);
      SetFontForeground(FONT_WHITE);
      VarFindFontCenterCoordinates(sScreenX, sScreenY, 1, 1, TINYFONT1, &sX, &sY, "%d", bPoint);
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

  GetSoldier(&pSoldier, gsSelectedMercID);
  iEditMercLocation = pSoldier.value.sGridNo;
  gpWorldLevelData[iEditMercLocation].pObjectHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;

  iEditMercBkgrndArea = CreateHotSpot(iXPos, iYPos, iWidth, iHeight, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK, EditMercBkgrndCallback);

  iEditMercColorPage = CreateTextButton("Merc Colors", FONT12POINT1, FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, (iXPos + 183), (iYPos + 315), 80, 20, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercChangeToColorPageCallback);
  iEditMercEnd = CreateTextButton("Done", FONT12POINT1, FONT_MCOLOR_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, (iXPos + 183), (iYPos + 337), 80, 20, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercDoneEditCallback);

  // Disable color editing for PC Mercs
  if (gsSelectedMercID >= gTacticalStatus.Team[OUR_TEAM].bFirstID && gsSelectedMercID <= gTacticalStatus.Team[OUR_TEAM].bLastID)
    DisableButton(iEditMercColorPage);

  iEditorButton[8] = QuickCreateButton(giEditMercImage[0], (iXPos + 98), (iYPos + 51), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercPrevOrderCallback);
  iEditorButton[9] = QuickCreateButton(giEditMercImage[1], (iXPos + 233), (iYPos + 51), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercNextOrderCallback);
  SetButtonFastHelpText(iEditorButton[8], "Previous merc standing orders");
  SetButtonFastHelpText(iEditorButton[9], "Next merc standing orders");

  iEditorButton[10] = QuickCreateButton(giEditMercImage[0], (iXPos + 98), (iYPos + 86), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercPrevAttCallback);
  iEditorButton[11] = QuickCreateButton(giEditMercImage[1], (iXPos + 233), (iYPos + 86), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercNextAttCallback);
  SetButtonFastHelpText(iEditorButton[10], "Previous merc combat attitude");
  SetButtonFastHelpText(iEditorButton[11], "Next merc combat attitude");

  iEditorButton[12] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 110), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[13] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 110), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[14] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 130), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[15] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 130), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[16] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 150), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[17] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 150), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[18] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 170), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[19] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 170), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[20] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 190), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[21] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 190), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[22] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 210), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[23] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 210), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[24] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 230), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[25] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 230), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[26] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 250), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[27] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 250), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[28] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 270), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[29] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 270), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[30] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 290), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[31] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 290), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[32] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 310), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[33] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 310), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  iEditorButton[34] = QuickCreateButton(giEditMercImage[0], (iXPos + 86), (iYPos + 330), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatDwnCallback);
  iEditorButton[35] = QuickCreateButton(giEditMercImage[1], (iXPos + 146), (iYPos + 330), BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK, EditMercStatUpCallback);

  for (x = 12; x < 36; x += 2) {
    SetButtonFastHelpText(iEditorButton[x], "Decrease merc stat");
    SetButtonFastHelpText(iEditorButton[x + 1], "Increase merc stat");
  }
}
function SetMercOrders(bOrders: INT8): void {
  gpSelected.value.pSoldier.value.bOrders = bOrders;
  gpSelected.value.pBasicPlacement.value.bOrders = bOrders;
  UnclickEditorButtons(FIRST_MERCS_ORDERS_BUTTON, LAST_MERCS_ORDERS_BUTTON);
  ClickEditorButton(FIRST_MERCS_ORDERS_BUTTON + bOrders);
  gbDefaultOrders = bOrders;
}

function SetMercAttitude(bAttitude: INT8): void {
  gpSelected.value.pSoldier.value.bAttitude = bAttitude;
  gpSelected.value.pBasicPlacement.value.bAttitude = bAttitude;
  UnclickEditorButtons(FIRST_MERCS_ATTITUDE_BUTTON, LAST_MERCS_ATTITUDE_BUTTON);
  ClickEditorButton(FIRST_MERCS_ATTITUDE_BUTTON + bAttitude);
  gbDefaultAttitude = bAttitude;
}

function SetMercDirection(bDirection: INT8): void {
  UnclickEditorButtons(FIRST_MERCS_DIRECTION_BUTTON, LAST_MERCS_DIRECTION_BUTTON);
  ClickEditorButton(FIRST_MERCS_DIRECTION_BUTTON + bDirection);

  gbDefaultDirection = bDirection;
  gpSelected.value.pBasicPlacement.value.bDirection = bDirection;

  // ATE: Changed these to call functions....
  EVENT_SetSoldierDirection(gpSelected.value.pSoldier, bDirection);
  EVENT_SetSoldierDesiredDirection(gpSelected.value.pSoldier, bDirection);

  ConvertAniCodeToAniFrame(gpSelected.value.pSoldier, 0);
}

function SetMercRelativeEquipment(bLevel: INT8): void {
  gpSelected.value.pBasicPlacement.value.bRelativeEquipmentLevel = bLevel;

  UnclickEditorButtons(FIRST_MERCS_REL_EQUIPMENT_BUTTON, LAST_MERCS_REL_EQUIPMENT_BUTTON);
  ClickEditorButton(FIRST_MERCS_REL_EQUIPMENT_BUTTON + bLevel);
  gbDefaultRelativeEquipmentLevel = bLevel;
}

function SetMercRelativeAttributes(bLevel: INT8): void {
  gpSelected.value.pBasicPlacement.value.bRelativeAttributeLevel = bLevel;
  // We also have to modify the existing soldier incase the user wishes to enter game.
  ModifySoldierAttributesWithNewRelativeLevel(gpSelected.value.pSoldier, bLevel);

  UnclickEditorButtons(FIRST_MERCS_REL_ATTRIBUTE_BUTTON, LAST_MERCS_REL_ATTRIBUTE_BUTTON);
  ClickEditorButton(FIRST_MERCS_REL_ATTRIBUTE_BUTTON + bLevel);
  gbDefaultRelativeAttributeLevel = bLevel;
}

function IndicateSelectedMerc(sID: INT16): void {
  let prev: Pointer<SOLDIERINITNODE>;
  let bTeam: INT8;

  // If we are trying to select a merc that is already selected, ignore.
  if (sID >= 0 && sID == gsSelectedMercGridNo)
    return;

  // first remove the cursor of the previous merc.
  // NOTE:  It doesn't matter what the value is, even if a merc isn't selected.
  // There is no need to validate the gridNo value, because it is always valid.
  RemoveAllObjectsOfTypeRange(gsSelectedMercGridNo, CONFIRMMOVE, CONFIRMMOVE);

  // This is very important, because clearing the merc editing mode actually,
  // updates the edited merc.  If this call isn't here, it is possible to update the
  // newly selected merc with the wrong information.
  SetMercEditingMode(MERC_NOMODE);

  bTeam = -1;

  // determine selection method
  switch (sID) {
    case SELECT_NEXT_MERC:
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
        SetMercEditability(TRUE);
        SetMercEditingMode(MERC_TEAMMODE);
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
    case SELECT_NO_MERC:
      SetMercEditability(TRUE);
      gpSelected = NULL;
      gsSelectedMercID = -1;
      gsSelectedGridNo = 0;
      SetMercEditingMode(MERC_TEAMMODE);
      return; // we already deselected the previous merc.
    case SELECT_NEXT_ENEMY:
      bTeam = ENEMY_TEAM;
      break;
    case SELECT_NEXT_CREATURE:
      bTeam = CREATURE_TEAM;
      break;
    case SELECT_NEXT_REBEL:
      bTeam = MILITIA_TEAM;
      break;
    case SELECT_NEXT_CIV:
      bTeam = CIV_TEAM;
      break;
    default:
      // search for the merc with the specific ID.
      gpSelected = FindSoldierInitNodeWithID(sID);
      if (!gpSelected) {
        gsSelectedMercID = -1;
        gsSelectedGridNo = 0;
        SetMercEditability(TRUE);
        SetMercEditingMode(MERC_TEAMMODE);
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
      SetMercEditability(TRUE);
      SetMercEditingMode(MERC_TEAMMODE);
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
        SetMercEditability(TRUE);
        SetMercEditingMode(MERC_TEAMMODE);
        return;
      }
    }
  }
  // if we made it this far, then we have a new merc cursor indicator to draw.
  if (gpSelected.value.pSoldier)
    gsSelectedMercGridNo = gpSelected.value.pSoldier.value.sGridNo;
  else {
    SetMercEditability(TRUE);
    SetMercEditingMode(MERC_TEAMMODE);
    return;
  }
  gsSelectedMercID = gpSelected.value.pSoldier.value.ubID;
  AddObjectToHead(gsSelectedMercGridNo, CONFIRMMOVE1);

  // If the merc has a valid profile, then turn off editability
  if (gpSelected.value.pDetailedPlacement)
    SetMercEditability((gpSelected.value.pDetailedPlacement.value.ubProfile == NO_PROFILE));
  else
    SetMercEditability(TRUE);

  if (sID < 0) {
    // We want to center the screen on the next merc, and update the interface.
    gsRenderCenterX = gpSelected.value.pSoldier.value.dXPos;
    gsRenderCenterY = gpSelected.value.pSoldier.value.dYPos;
    gfRenderWorld = TRUE;
  }

  // update the merc item slots to reflect what the merc currently has.
  UpdateMercItemSlots();

  // Whatever the case, we want to update the gui to press the appropriate buttons
  // depending on the merc's attributes.
  // Click the appropriate team button
  UnclickEditorButton(MERCS_ENEMY);
  UnclickEditorButton(MERCS_CREATURE);
  UnclickEditorButton(MERCS_REBEL);
  UnclickEditorButton(MERCS_CIVILIAN);
  switch (gpSelected.value.pSoldier.value.bTeam) {
    case ENEMY_TEAM:
      ClickEditorButton(MERCS_ENEMY);
      iDrawMode = DRAW_MODE_ENEMY;
      break;
    case CREATURE_TEAM:
      ClickEditorButton(MERCS_CREATURE);
      iDrawMode = DRAW_MODE_CREATURE;
      break;
    case MILITIA_TEAM:
      ClickEditorButton(MERCS_REBEL);
      iDrawMode = DRAW_MODE_REBEL;
      break;
    case CIV_TEAM:
      ClickEditorButton(MERCS_CIVILIAN);
      iDrawMode = DRAW_MODE_CIVILIAN;
      break;
  }
  // Update the editing mode
  if (gpSelected.value.pDetailedPlacement)
    SetMercEditingMode(gubLastDetailedMercMode);
  else
    SetMercEditingMode(MERC_BASICMODE);
  // Determine which team button to press.
  gfRenderMercInfo = TRUE;
  // These calls will set the proper button states, even though it redundantly
  // assigns the soldier with the same orders/attitude.
  SetMercOrders(gpSelected.value.pSoldier.value.bOrders);
  SetMercAttitude(gpSelected.value.pSoldier.value.bAttitude);
  SetMercDirection(gpSelected.value.pSoldier.value.bDirection);
  if (gpSelected.value.pBasicPlacement.value.fPriorityExistance)
    ClickEditorButton(MERCS_PRIORITYEXISTANCE_CHECKBOX);
  else
    UnclickEditorButton(MERCS_PRIORITYEXISTANCE_CHECKBOX);
  if (gpSelected.value.pBasicPlacement.value.fHasKeys)
    ClickEditorButton(MERCS_HASKEYS_CHECKBOX);
  else
    UnclickEditorButton(MERCS_HASKEYS_CHECKBOX);
  if (gpSelected.value.pSoldier.value.ubProfile == NO_PROFILE) {
    SetMercRelativeEquipment(gpSelected.value.pBasicPlacement.value.bRelativeEquipmentLevel);
    SetMercRelativeAttributes(gpSelected.value.pBasicPlacement.value.bRelativeAttributeLevel);
    SetEnemyColorCode(gpSelected.value.pBasicPlacement.value.ubSoldierClass);
  }
  if (iDrawMode == DRAW_MODE_CIVILIAN) {
    ChangeCivGroup(gpSelected.value.pSoldier.value.ubCivilianGroup);
  }
}

function DeleteSelectedMerc(): void {
  if (gsSelectedMercID != -1) {
    RemoveSoldierNodeFromInitList(gpSelected);
    gpSelected = NULL;
    gsSelectedMercID = -1;
    gfRenderWorld = TRUE;
    if (TextInputMode())
      KillTextInputMode();
    IndicateSelectedMerc(SELECT_NO_MERC);
  }
}

function SetupTextInputForMercProfile(): void {
  let str: UINT16[] /* [4] */;
  let sNum: INT16;

  InitTextInputModeWithScheme(DEFAULT_SCHEME);

  sNum = gpSelected.value.pDetailedPlacement.value.ubProfile;
  if (sNum == NO_PROFILE)
    str[0] = '\0';
  else
    CalcStringForValue(str, gpSelected.value.pDetailedPlacement.value.ubProfile, NUM_PROFILES);
  AddTextInputField(200, 430, 30, 20, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
}

function SetupTextInputForMercAttributes(): void {
  let str: UINT16[] /* [4] */;

  InitTextInputModeWithScheme(DEFAULT_SCHEME);

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
function CalcStringForValue(str: Pointer<UINT16>, iValue: INT32, uiMax: UINT32): void {
  if (iValue < 0) // a blank string is determined by a negative value.
    str[0] = '\0';
  else if (iValue > uiMax) // higher than max attribute value, so convert it to the max.
    swprintf(str, "%d", uiMax);
  else // this is a valid static value, so convert it to a string.
    swprintf(str, "%d", iValue);
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
  gpSelected.value.pDetailedPlacement.value.bExpLevel = min(GetNumericStrictValueFromField(0), 100);
  gpSelected.value.pDetailedPlacement.value.bLife = min(GetNumericStrictValueFromField(1), 100);
  gpSelected.value.pDetailedPlacement.value.bLifeMax = min(GetNumericStrictValueFromField(2), 100);
  gpSelected.value.pDetailedPlacement.value.bMarksmanship = min(GetNumericStrictValueFromField(3), 100);
  gpSelected.value.pDetailedPlacement.value.bStrength = min(GetNumericStrictValueFromField(4), 100);
  gpSelected.value.pDetailedPlacement.value.bAgility = min(GetNumericStrictValueFromField(5), 100);
  gpSelected.value.pDetailedPlacement.value.bDexterity = min(GetNumericStrictValueFromField(6), 100);
  gpSelected.value.pDetailedPlacement.value.bWisdom = min(GetNumericStrictValueFromField(7), 100);
  gpSelected.value.pDetailedPlacement.value.bLeadership = min(GetNumericStrictValueFromField(8), 100);
  gpSelected.value.pDetailedPlacement.value.bExplosive = min(GetNumericStrictValueFromField(9), 100);
  gpSelected.value.pDetailedPlacement.value.bMedical = min(GetNumericStrictValueFromField(10), 100);
  gpSelected.value.pDetailedPlacement.value.bMechanical = min(GetNumericStrictValueFromField(11), 100);
  gpSelected.value.pDetailedPlacement.value.bMorale = min(GetNumericStrictValueFromField(11), 100);

  // make sure that experience level ranges between 1 and 9
  if (gpSelected.value.pDetailedPlacement.value.bExpLevel != -1)
    gpSelected.value.pDetailedPlacement.value.bExpLevel = max(min(gpSelected.value.pDetailedPlacement.value.bExpLevel, 9), 1);

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
  sNum = min(GetNumericStrictValueFromField(0), NUM_PROFILES);
  if (sNum == -1) {
    gpSelected.value.pDetailedPlacement.value.ubProfile = NO_PROFILE;
    gpSelected.value.pDetailedPlacement.value.fCopyProfileItemsOver = FALSE;
    SetMercEditability(TRUE);
  } else if (sPrev != sNum) {
    gpSelected.value.pDetailedPlacement.value.ubProfile = sNum;
    gpSelected.value.pDetailedPlacement.value.fCopyProfileItemsOver = TRUE;
    gpSelected.value.pBasicPlacement.value.fPriorityExistance = TRUE;
    ClickEditorButton(MERCS_PRIORITYEXISTANCE_CHECKBOX);
    SetMercEditability(FALSE);
  } else
    return;

  UpdateSoldierWithStaticDetailedInformation(gpSelected.value.pSoldier, gpSelected.value.pDetailedPlacement);
  if (gpSelected.value.pSoldier.value.bTeam == CIV_TEAM) {
    ChangeCivGroup(gpSelected.value.pSoldier.value.ubCivilianGroup);
  }
}

function SetupTextInputForMercSchedule(): void {
  InitTextInputModeWithScheme(DEFAULT_SCHEME);
  AddUserInputField(NULL);
  AddTextInputField(268, 373, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(1, gCurrSchedule.usTime[0]);
  AddTextInputField(268, 394, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(2, gCurrSchedule.usTime[1]);
  AddTextInputField(268, 415, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(3, gCurrSchedule.usTime[2]);
  AddTextInputField(268, 436, 36, 16, MSYS_PRIORITY_NORMAL, "", 6, INPUTTYPE_EXCLUSIVE_24HOURCLOCK);
  SetExclusive24HourTimeValue(4, gCurrSchedule.usTime[3]);
}

function ExtractAndUpdateMercSchedule(): void {
  let i: INT32;
  let fValidSchedule: BOOLEAN = FALSE;
  let fScheduleNeedsUpdate: BOOLEAN = FALSE;
  let pNext: Pointer<SCHEDULENODE> = NULL;
  if (!gpSelected)
    return;
  // extract all of the fields into a temp schedulenode.
  // memset( &gScheduleNode, 0, sizeof( SCHEDULENODE ) );
  for (i = 0; i < 4; i++) {
    gCurrSchedule.usTime[i] = GetExclusive24HourTimeValueFromField((i + 1));
    gCurrSchedule.ubAction[i] = MSYS_GetBtnUserData(ButtonList[iEditorButton[MERCS_SCHEDULE_ACTION1 + i]], 0);
    if (gCurrSchedule.ubAction[i])
      fValidSchedule = TRUE;
  }

  if (!gpSelected.value.pSoldier.value.ubScheduleID) {
    // The soldier doesn't actually have a schedule yet, so create one if necessary (not blank)
    if (fValidSchedule) {
      // create a new schedule
      if (SortSchedule(&gCurrSchedule))
        fScheduleNeedsUpdate = TRUE;
      CopyScheduleToList(&gCurrSchedule, gpSelected);
      ShowEditorButton(MERCS_GLOWSCHEDULE);
      HideEditorButton(MERCS_SCHEDULE);
    }
  } else {
    let pSchedule: Pointer<SCHEDULENODE>;
    pSchedule = GetSchedule(gpSelected.value.pSoldier.value.ubScheduleID);
    if (!pSchedule) {
      gpSelected.value.pSoldier.value.ubScheduleID = 0;
      gpSelected.value.pDetailedPlacement.value.ubScheduleID = 0;
      HideEditorButton(MERCS_GLOWSCHEDULE);
      ShowEditorButton(MERCS_SCHEDULE);
      return;
    }
    if (fValidSchedule) {
      // overwrite the existing schedule with the new one.
      gCurrSchedule.ubScheduleID = gpSelected.value.pSoldier.value.ubScheduleID;
      if (SortSchedule(&gCurrSchedule))
        fScheduleNeedsUpdate = TRUE;
      pNext = pSchedule.value.next;
      memcpy(pSchedule, &gCurrSchedule, sizeof(SCHEDULENODE));
      pSchedule.value.next = pNext;
    } else {
      // remove the existing schedule, as the new one is blank.
      DeleteSchedule(pSchedule.value.ubScheduleID);
      gpSelected.value.pSoldier.value.ubScheduleID = 0;
      gpSelected.value.pDetailedPlacement.value.ubScheduleID = 0;
      HideEditorButton(MERCS_GLOWSCHEDULE);
      ShowEditorButton(MERCS_SCHEDULE);
    }
  }
  if (fScheduleNeedsUpdate) {
    // The schedule was sorted, so update the gui.
    UpdateScheduleInfo();
  }
  SetActiveField(0);
}

function ExtractCurrentMercModeInfo(fKillTextInputMode: BOOLEAN): void {
  // This happens if we deleted a merc
  if (gsSelectedMercID == -1)
    return;
  // Extract and update mercs via text fields if applicable
  switch (gubCurrMercMode) {
    case MERC_ATTRIBUTEMODE:
      ExtractAndUpdateMercAttributes();
      break;
    case MERC_PROFILEMODE:
      ExtractAndUpdateMercProfile();
      break;
    case MERC_SCHEDULEMODE:
      ExtractAndUpdateMercSchedule();
      break;
    default:
      fKillTextInputMode = FALSE;
      break;
  }
  if (fKillTextInputMode)
    KillTextInputMode();
}

function InitDetailedPlacementForMerc(): void {
  Assert(!gpSelected.value.pDetailedPlacement);

  gpSelected.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));

  Assert(gpSelected.value.pDetailedPlacement);

  gpSelected.value.pBasicPlacement.value.fDetailedPlacement = TRUE;
  gpSelected.value.pBasicPlacement.value.fPriorityExistance = FALSE;
  CreateStaticDetailedPlacementGivenBasicPlacementInfo(gpSelected.value.pDetailedPlacement, gpSelected.value.pBasicPlacement);

  ClearCurrentSchedule();

  // update the soldier
  UpdateSoldierWithStaticDetailedInformation(gpSelected.value.pSoldier, gpSelected.value.pDetailedPlacement);
}

function KillDetailedPlacementForMerc(): void {
  Assert(gpSelected.value.pDetailedPlacement);
  MemFree(gpSelected.value.pDetailedPlacement);
  gpSelected.value.pDetailedPlacement = NULL;
  gpSelected.value.pBasicPlacement.value.fDetailedPlacement = FALSE;
  SetMercEditability(TRUE);
}

function ChangeBodyType(bOffset: INT8): void //+1 or -1 only
{
  let pbArray: Pointer<INT8>;
  let iMax: INT32;
  let x: INT32;
  let iIndex: INT32;

  gfRenderTaskbar = TRUE;
  gfRenderMercInfo = TRUE;
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
      case ADULTFEMALEMONSTER:
      case AM_MONSTER:
      case YAF_MONSTER:
      case YAM_MONSTER:
      case LARVAE_MONSTER:
      case INFANT_MONSTER:
      case QUEENMONSTER:
        gpSelected.value.pSoldier.value.uiStatusFlags |= SOLDIER_MONSTER;
        break;
      case BLOODCAT:
      case COW:
      case CROW:
        gpSelected.value.pSoldier.value.uiStatusFlags |= SOLDIER_ANIMAL;
        break;
      case ROBOTNOWEAPON:
        gpSelected.value.pSoldier.value.uiStatusFlags |= SOLDIER_ROBOT;
        break;
      case HUMVEE:
      case ELDORADO:
      case ICECREAMTRUCK:
      case JEEP:
      case TANK_NW:
      case TANK_NE:
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

function SetMercEditability(fEditable: BOOLEAN): void {
  gfRenderMercInfo = TRUE;
  if (fEditable == gfCanEditMercs)
    return;
  gfCanEditMercs = fEditable;
  if (gfCanEditMercs) {
    // enable buttons to allow editing
    EnableEditorButtons(MERCS_EQUIPMENT_BAD, MERCS_ATTRIBUTES_GREAT);
    EnableEditorButtons(FIRST_MERCS_COLORMODE_BUTTON, LAST_MERCS_COLORMODE_BUTTON);
    if (gpSelected && gpSelected.value.pDetailedPlacement && !gpSelected.value.pDetailedPlacement.value.fVisible)
      UnclickEditorButton(MERCS_TOGGLECOLOR_BUTTON);
    EnableEditorButton(MERCS_PRIORITYEXISTANCE_CHECKBOX);
    EnableEditorButton(MERCS_CIVILIAN_GROUP);
  } else {
    // disable buttons to prevent editing
    DisableEditorButtons(MERCS_EQUIPMENT_BAD, MERCS_ATTRIBUTES_GREAT);
    DisableEditorButtons(FIRST_MERCS_COLORMODE_BUTTON, LAST_MERCS_COLORMODE_BUTTON);
    ClickEditorButton(MERCS_TOGGLECOLOR_BUTTON);
    DisableEditorButton(MERCS_PRIORITYEXISTANCE_CHECKBOX);
    DisableEditorButton(MERCS_CIVILIAN_GROUP);
  }
}

// There are 4 exclusive entry points in a map.  Only one of each type can exist on a
// map, and these points are used to validate the map by attempting to connect the four
// points together.  If one of the points is isolated, then the map will be rejected.  It
// isn't necessary to specify all four points.  You wouldn't want to specify a north point if
// there isn't going to be any traversing to adjacent maps from that side.
function SpecifyEntryPoint(iMapIndex: UINT32): void {
  let psEntryGridNo: Pointer<INT16>;
  let fErasing: BOOLEAN = FALSE;
  if (iDrawMode >= DRAW_MODE_ERASE) {
    iDrawMode -= DRAW_MODE_ERASE;
    fErasing = TRUE;
  }
  switch (iDrawMode) {
    case DRAW_MODE_NORTHPOINT:
      psEntryGridNo = &gMapInformation.sNorthGridNo;
      break;
    case DRAW_MODE_WESTPOINT:
      psEntryGridNo = &gMapInformation.sWestGridNo;
      break;
    case DRAW_MODE_EASTPOINT:
      psEntryGridNo = &gMapInformation.sEastGridNo;
      break;
    case DRAW_MODE_SOUTHPOINT:
      psEntryGridNo = &gMapInformation.sSouthGridNo;
      break;
    case DRAW_MODE_CENTERPOINT:
      psEntryGridNo = &gMapInformation.sCenterGridNo;
      break;
    case DRAW_MODE_ISOLATEDPOINT:
      psEntryGridNo = &gMapInformation.sIsolatedGridNo;
      break;
    default:
      return;
  }
  if (!fErasing) {
    if (*psEntryGridNo >= 0) {
      AddToUndoList(*psEntryGridNo);
      RemoveAllTopmostsOfTypeRange(*psEntryGridNo, FIRSTPOINTERS, FIRSTPOINTERS);
    }
    *psEntryGridNo = iMapIndex;
    ValidateEntryPointGridNo(psEntryGridNo);
    AddToUndoList(*psEntryGridNo);
    AddTopmostToTail(*psEntryGridNo, FIRSTPOINTERS2);
  } else {
    let usDummy: UINT16;
    if (TypeExistsInTopmostLayer(iMapIndex, FIRSTPOINTERS, &usDummy)) {
      AddToUndoList(iMapIndex);
      RemoveAllTopmostsOfTypeRange(iMapIndex, FIRSTPOINTERS, FIRSTPOINTERS);
      *psEntryGridNo = -1;
    }
    // restore the drawmode
    iDrawMode += DRAW_MODE_ERASE;
  }
}

function SetMercEditingMode(ubNewMode: UINT8): void {
  // We need to update the taskbar for the buttons that were erased.
  gfRenderTaskbar = TRUE;

  // set up the new mode values.
  if (gubCurrMercMode >= MERC_GENERALMODE)
    gubLastDetailedMercMode = gubCurrMercMode;

  // Depending on the mode we were just in, we may want to extract and update the
  // merc first.  Then we change modes...
  ExtractCurrentMercModeInfo(TRUE);

  // Change modes now.
  gubPrevMercMode = gubCurrMercMode;
  gubCurrMercMode = ubNewMode;

  // Hide all of the merc buttons except the team buttons which are static.
  HideEditorButtons(FIRST_MERCS_BASICMODE_BUTTON, LAST_MERCS_BUTTON);

  switch (gubPrevMercMode) {
    case MERC_GETITEMMODE:
      EnableEditorButtons(TAB_TERRAIN, TAB_OPTIONS);
      HideEditorButtons(FIRST_MERCS_GETITEM_BUTTON, LAST_MERCS_GETITEM_BUTTON);
      AddNewItemToSelectedMercsInventory(TRUE);
      break;
    case MERC_INVENTORYMODE:
      HideItemStatsPanel();
      DisableEditorRegion(MERC_REGION_ID);
      break;
    case MERC_GENERALMODE:
      EnableEditorButton(MERCS_APPEARANCE);
      break;
    case MERC_SCHEDULEMODE:
      // ClearCurrentSchedule();
      break;
  }

  // If we leave the merc tab, then we want to update editable fields such as
  // attributes, which was just handled above, then turn everything off, and exit.
  if (ubNewMode == MERC_NOMODE) {
    HideEditorButtons(FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
    HideEditorButtons(MERCS_SCHEDULE, MERCS_GLOWSCHEDULE);
    return;
  }
  if (gubPrevMercMode == MERC_NOMODE || gubPrevMercMode == MERC_GETITEMMODE) {
    ShowEditorButtons(FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
  }

  // Release the currently selected merc if you just selected a new team.
  if (gsSelectedMercID != -1 && ubNewMode == MERC_TEAMMODE) {
    // attempt to weed out conditions where we select a team that matches the currently
    // selected merc.  We don't want to deselect him in this case.
    if (gpSelected.value.pSoldier.value.bTeam == ENEMY_TEAM && iDrawMode == DRAW_MODE_ENEMY || gpSelected.value.pSoldier.value.bTeam == CREATURE_TEAM && iDrawMode == DRAW_MODE_CREATURE || gpSelected.value.pSoldier.value.bTeam == MILITIA_TEAM && iDrawMode == DRAW_MODE_REBEL || gpSelected.value.pSoldier.value.bTeam == CIV_TEAM && iDrawMode == DRAW_MODE_CIVILIAN) {
      // Same team, so don't deselect merc.  Instead, keep the previous editing mode
      // because we are still editing this merc.
      gubCurrMercMode = gubPrevMercMode;
      // if we don't have a detailed placement, auto set to basic mode.
      if (!gpSelected.value.pDetailedPlacement)
        gubCurrMercMode = MERC_BASICMODE;
    } else {
      // Different teams, so deselect the current merc and the detailed checkbox if applicable.
      IndicateSelectedMerc(SELECT_NO_MERC);
      ShowEditorButtons(FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
      UnclickEditorButton(MERCS_DETAILEDCHECKBOX);
    }
  }

  ShowButton(iEditorButton[MERCS_NEXT]);
  if (gsSelectedMercID != -1)
    ShowButton(iEditorButton[MERCS_DELETE]);

  if (gubCurrMercMode > MERC_TEAMMODE) {
    // Add the basic buttons if applicable.
    ShowEditorButtons(FIRST_MERCS_BASICMODE_BUTTON, LAST_MERCS_BASICMODE_BUTTON);
  }
  if (gubCurrMercMode > MERC_BASICMODE) {
    // Add the detailed buttons if applicable.
    ClickEditorButton(MERCS_DETAILEDCHECKBOX);
    ShowEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
  } else
    UnclickEditorButton(MERCS_DETAILEDCHECKBOX);
  // Now we are setting up the button states for the new mode, as well as show the
  // applicable buttons for the detailed placement modes.
  if (gubCurrMercMode == MERC_APPEARANCEMODE && iDrawMode == DRAW_MODE_CREATURE || gubCurrMercMode == MERC_SCHEDULEMODE && iDrawMode != DRAW_MODE_CIVILIAN) {
    gubCurrMercMode = MERC_GENERALMODE;
  }
  switch (gubCurrMercMode) {
    case MERC_GETITEMMODE:
      DisableEditorButtons(TAB_TERRAIN, TAB_OPTIONS);
      EnableEditorButton(TAB_MERCS);
      HideEditorButtons(FIRST_MERCS_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
      HideEditorButtons(MERCS_SCHEDULE, MERCS_GLOWSCHEDULE);
      ShowEditorButtons(FIRST_MERCS_GETITEM_BUTTON, LAST_MERCS_GETITEM_BUTTON);
      InitEditorItemsInfo(eInfo.uiItemType);
      ClickEditorButton(ITEMS_WEAPONS + eInfo.uiItemType - TBAR_MODE_ITEM_WEAPONS);
      break;
    case MERC_INVENTORYMODE:
      UpdateMercItemSlots();
      ShowItemStatsPanel();
      if (gbCurrSelect == -1)
        SpecifyItemToEdit(NULL, -1);
      else
        SpecifyItemToEdit(gpMercSlotItem[gbCurrSelect], -1);
      HideEditorButtons(MERCS_DELETE, MERCS_NEXT);
      ShowEditorButtons(FIRST_MERCS_INVENTORY_BUTTON, LAST_MERCS_INVENTORY_BUTTON);
      EnableEditorRegion(MERC_REGION_ID);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(MERCS_INVENTORY);
      break;
    case MERC_BASICMODE:
      ShowEditorButtons(FIRST_MERCS_GENERAL_BUTTON, LAST_MERCS_GENERAL_BUTTON);
      if (iDrawMode == DRAW_MODE_CREATURE) {
        // Set up alternate general mode.  This one doesn't allow you to specify relative attributes
        // but requires you to specify a body type.
        HideEditorButtons(FIRST_MERCS_REL_EQUIPMENT_BUTTON, LAST_MERCS_REL_EQUIPMENT_BUTTON);
        ShowEditorButtons(FIRST_MERCS_BODYTYPE_BUTTON, LAST_MERCS_BODYTYPE_BUTTON);
      }
      if (iDrawMode != DRAW_MODE_ENEMY)
        HideEditorButtons(FIRST_MERCS_COLORCODE_BUTTON, LAST_MERCS_COLORCODE_BUTTON);
      if (iDrawMode == DRAW_MODE_CIVILIAN)
        ShowEditorButton(MERCS_CIVILIAN_GROUP);
      break;
    case MERC_GENERALMODE:
      ShowEditorButtons(FIRST_MERCS_GENERAL_BUTTON, LAST_MERCS_GENERAL_BUTTON);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(MERCS_GENERAL);
      if (iDrawMode == DRAW_MODE_CREATURE) {
        // Set up alternate general mode.  This one doesn't allow you to specify relative equipment
        // but requires you to specify a body type.
        HideEditorButtons(FIRST_MERCS_REL_EQUIPMENT_BUTTON, LAST_MERCS_REL_EQUIPMENT_BUTTON);
        ShowEditorButtons(FIRST_MERCS_BODYTYPE_BUTTON, LAST_MERCS_BODYTYPE_BUTTON);
        DisableEditorButton(MERCS_APPEARANCE);
      }
      if (iDrawMode != DRAW_MODE_ENEMY)
        HideEditorButtons(FIRST_MERCS_COLORCODE_BUTTON, LAST_MERCS_COLORCODE_BUTTON);
      if (iDrawMode == DRAW_MODE_CIVILIAN)
        ShowEditorButton(MERCS_CIVILIAN_GROUP);
      break;
    case MERC_ATTRIBUTEMODE:
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(MERCS_ATTRIBUTES);
      SetupTextInputForMercAttributes();
      break;
    case MERC_APPEARANCEMODE:
      ShowEditorButtons(FIRST_MERCS_COLORMODE_BUTTON, LAST_MERCS_COLORMODE_BUTTON);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(MERCS_APPEARANCE);
      if (gfCanEditMercs && gpSelected && gpSelected.value.pDetailedPlacement) {
        if (!gpSelected.value.pDetailedPlacement.value.fVisible) {
          UnclickEditorButton(MERCS_TOGGLECOLOR_BUTTON);
          DisableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
        } else {
          ClickEditorButton(MERCS_TOGGLECOLOR_BUTTON);
          EnableEditorButtons(FIRST_MERCS_COLOR_BUTTON, LAST_MERCS_COLOR_BUTTON);
        }
      }
      break;
    case MERC_PROFILEMODE:
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(MERCS_PROFILE);
      SetupTextInputForMercProfile();
      break;
    case MERC_SCHEDULEMODE:
      ShowEditorButtons(MERCS_SCHEDULE_ACTION1, MERCS_SCHEDULE_VARIANCE4);
      ShowEditorButton(MERCS_SCHEDULE_CLEAR);
      UnclickEditorButtons(FIRST_MERCS_PRIORITYMODE_BUTTON, LAST_MERCS_PRIORITYMODE_BUTTON);
      ClickEditorButton(MERCS_SCHEDULE);
      SetupTextInputForMercSchedule();
      UpdateScheduleInfo();
      DetermineScheduleEditability();
  }
  // Show or hide the schedule buttons
  if (gpSelected && gubCurrMercMode != MERC_GETITEMMODE) {
    if (gpSelected.value.pDetailedPlacement && gpSelected.value.pDetailedPlacement.value.ubScheduleID) {
      HideEditorButton(MERCS_SCHEDULE);
      ShowEditorButton(MERCS_GLOWSCHEDULE);
    } else {
      HideEditorButton(MERCS_GLOWSCHEDULE);
      if (gpSelected.value.pDetailedPlacement) {
        ShowEditorButton(MERCS_SCHEDULE);
        if (gpSelected.value.pSoldier.value.bTeam == CIV_TEAM)
          EnableEditorButton(MERCS_SCHEDULE);
        else
          DisableEditorButton(MERCS_SCHEDULE);
      } else {
        HideEditorButton(MERCS_SCHEDULE);
      }
    }
  } else {
    HideEditorButtons(MERCS_SCHEDULE, MERCS_GLOWSCHEDULE);
  }
}

function DisplayBodyTypeInfo(): void {
  let str: UINT16[] /* [20] */;
  switch (gpSelected.value.pBasicPlacement.value.bBodyType) {
    case RANDOM:
      swprintf(str, "Random");
      break;
    case REGMALE:
      swprintf(str, "Reg Male");
      break;
    case BIGMALE:
      swprintf(str, "Big Male");
      break;
    case STOCKYMALE:
      swprintf(str, "Stocky Male");
      break;
    case REGFEMALE:
      swprintf(str, "Reg Female");
      break;
    case TANK_NE:
      swprintf(str, "NE Tank");
      break;
    case TANK_NW:
      swprintf(str, "NW Tank");
      break;
    case FATCIV:
      swprintf(str, "Fat Civilian");
      break;
    case MANCIV:
      swprintf(str, "M Civilian");
      break;
    case MINICIV:
      swprintf(str, "Miniskirt");
      break;
    case DRESSCIV:
      swprintf(str, "F Civilian");
      break;
    case HATKIDCIV:
      swprintf(str, "Kid w/ Hat");
      break;
    case HUMVEE:
      swprintf(str, "Humvee");
      break;
    case ELDORADO:
      swprintf(str, "Eldorado");
      break;
    case ICECREAMTRUCK:
      swprintf(str, "Icecream Truck");
      break;
    case JEEP:
      swprintf(str, "Jeep");
      break;
    case KIDCIV:
      swprintf(str, "Kid Civilian");
      break;
    case COW:
      swprintf(str, "Domestic Cow");
      break;
    case CRIPPLECIV:
      swprintf(str, "Cripple");
      break;
    case ROBOTNOWEAPON:
      swprintf(str, "Unarmed Robot");
      break;
    case LARVAE_MONSTER:
      swprintf(str, "Larvae");
      break;
    case INFANT_MONSTER:
      swprintf(str, "Infant");
      break;
    case YAF_MONSTER:
      swprintf(str, "Yng F Monster");
      break;
    case YAM_MONSTER:
      swprintf(str, "Yng M Monster");
      break;
    case ADULTFEMALEMONSTER:
      swprintf(str, "Adt F Monster");
      break;
    case AM_MONSTER:
      swprintf(str, "Adt M Monster");
      break;
    case QUEENMONSTER:
      swprintf(str, "Queen Monster");
      break;
    case BLOODCAT:
      swprintf(str, "Bloodcat");
      break;
  }
  DrawEditorInfoBox(str, FONT10ARIAL, 490, 364, 70, 20);
}

function UpdateMercsInfo(): void {
  if (!gfRenderMercInfo)
    return;

  // We are rendering it now, so signify that it has been done, so
  // it doesn't get rendered every frame.
  gfRenderMercInfo = FALSE;

  switch (gubCurrMercMode) {
    case MERC_GETITEMMODE:
      RenderEditorItemsInfo();
      break;
    case MERC_INVENTORYMODE:
      if (gfMercGetItem)
        SetMercEditingMode(MERC_GETITEMMODE);
      else
        RenderMercInventoryPanel();
      break;
    case MERC_BASICMODE:
    case MERC_GENERALMODE:
      BltVideoObjectFromIndex(FRAME_BUFFER, guiExclamation, 0, 188, 362, VO_BLT_SRCTRANSPARENCY, NULL);
      BltVideoObjectFromIndex(FRAME_BUFFER, guiKeyImage, 0, 186, 387, VO_BLT_SRCTRANSPARENCY, NULL);
      SetFont(SMALLCOMPFONT);
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      mprintf(240, 363, " --=ORDERS=-- ");
      mprintf(240, 419, "--=ATTITUDE=--");
      if (iDrawMode == DRAW_MODE_CREATURE) {
        DisplayBodyTypeInfo();
        SetFont(SMALLCOMPFONT);
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
      if (iDrawMode == DRAW_MODE_ENEMY) {
        SetFont(FONT10ARIAL);
        SetFontForeground(FONT_YELLOW);
        mprintf(590, 411, "Army");
        mprintf(590, 425, "Admin");
        mprintf(590, 439, "Elite");
      }
      break;
    case MERC_ATTRIBUTEMODE:
      SetFont(FONT10ARIAL);
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
    case MERC_APPEARANCEMODE:
      SetFont(FONT10ARIAL);
      if (gpSelected.value.pDetailedPlacement.value.fVisible || gpSelected.value.pDetailedPlacement.value.ubProfile != NO_PROFILE)
        SetFontForeground(FONT_YELLOW);
      else
        SetFontForeground(FONT_DKYELLOW);
      SetFontShadow(FONT_NEARBLACK);

      mprintf(396, 364, "Hair color:");
      mprintf(396, 388, "Skin color:");
      mprintf(396, 412, "Vest color:");
      mprintf(396, 436, "Pant color:");

      SetFont(SMALLCOMPFONT);
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
        ShowEditMercPalettes(NULL); // will display grey scale to signify random
      }
      DisplayBodyTypeInfo();
      break;
    case MERC_PROFILEMODE:
      SetFont(FONT10ARIAL);
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      {
        // scope trick
        let tempStr: UINT16[] /* [500] */;
        swprintf(tempStr, "%s%s%s%s%s%d.", "By specifying a profile index, all of the information will be extracted from the profile ", "and override any values that you have edited.  It will also disable the editing features ", "though, you will still be able to view stats, etc.  Pressing ENTER will automatically ", "extract the number you have typed.  A blank field will clear the profile.  The current ", "number of profiles range from 0 to ", NUM_PROFILES);
        DisplayWrappedString(180, 370, 400, 2, FONT10ARIAL, 146, tempStr, FONT_BLACK, FALSE, LEFT_JUSTIFIED);
        SetFont(FONT12POINT1);
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
    case MERC_SCHEDULEMODE:
      SetFont(FONT10ARIAL);
      SetFontForeground(FONT_WHITE);
      SetFontShadow(FONT_NEARBLACK);
      switch (gpSelected.value.pSoldier.value.bOrders) {
        case STATIONARY:
          mprintf(430, 363, "STATIONARY");
          break;
        case ONCALL:
          mprintf(430, 363, "ON CALL");
          break;
        case ONGUARD:
          mprintf(430, 363, "ON GUARD");
          break;
        case SEEKENEMY:
          mprintf(430, 363, "SEEK ENEMY");
          break;
        case CLOSEPATROL:
          mprintf(430, 363, "CLOSE PATROL");
          break;
        case FARPATROL:
          mprintf(430, 363, "FAR PATROL");
          break;
        case POINTPATROL:
          mprintf(430, 363, "POINT PATROL");
          break;
        case RNDPTPATROL:
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
        let str: UINT16[] /* [255] */;
        let keyword: UINT16[] /* [10] */ = "";
        ColorFillVideoSurfaceArea(FRAME_BUFFER, 431, 388, 590, 450, Get16BPPColor(FROMRGB(32, 45, 72)));
        switch (gCurrSchedule.ubAction[gubCurrentScheduleActionIndex]) {
          case SCHEDULE_ACTION_LOCKDOOR:
            swprintf(keyword, "lock");
            break;
          case SCHEDULE_ACTION_UNLOCKDOOR:
            swprintf(keyword, "unlock");
            break;
          case SCHEDULE_ACTION_OPENDOOR:
            swprintf(keyword, "open");
            break;
          case SCHEDULE_ACTION_CLOSEDOOR:
            swprintf(keyword, "close");
            break;
        }
        switch (gubScheduleInstructions) {
          case SCHEDULE_INSTRUCTIONS_DOOR1:
            swprintf(str, "Click on the gridno adjacent to the door that you wish to %s.", keyword);
            break;
          case SCHEDULE_INSTRUCTIONS_DOOR2:
            swprintf(str, "Click on the gridno where you wish to move after you %s the door.", keyword);
            break;
          case SCHEDULE_INSTRUCTIONS_GRIDNO:
            swprintf(str, "Click on the gridno where you wish to move to.");
            break;
          case SCHEDULE_INSTRUCTIONS_SLEEP:
            swprintf(str, "Click on the gridno where you wish to sleep at.  Person will automatically return to original position after waking up.");
          default:
            return;
        }
        wcscat(str, "  Hit ESC to abort entering this line in the schedule.");
        DisplayWrappedString(436, 392, 149, 2, FONT10ARIAL, FONT_YELLOW, str, FONT_BLACK, FALSE, LEFT_JUSTIFIED);
      }
      break;
  }
}

// When a detailed placement merc is in the inventory panel, there is a overall region
// blanketing this panel.  As the user moves the mouse around and clicks, etc., this function
// is called by the region callback functions to handle these cases.  The event types are defined
// in Editor Taskbar Utils.h.  Here are the internal functions...

let mercRects: SGPRect[] /* [9] */ = [
  [ 75, 0, 104, 19 ], // head
  [ 75, 22, 104, 41 ], // body
  [ 76, 73, 105, 92 ], // legs
  [ 26, 43, 78, 62 ], // left hand
  [ 104, 42, 156, 61 ], // right hand
  [ 180, 6, 232, 25 ], // pack 1
  [ 180, 29, 232, 48 ], // pack 2
  [ 180, 52, 232, 71 ], // pack 3
  [ 180, 75, 232, 94 ], // pack 4
];

function PointInRect(pRect: Pointer<SGPRect>, x: INT32, y: INT32): BOOLEAN {
  return x >= pRect.value.iLeft && x <= pRect.value.iRight && y >= pRect.value.iTop && y <= pRect.value.iBottom;
}

function DrawRect(pRect: Pointer<SGPRect>, color: INT16): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(TRUE, pRect.value.iLeft + MERCPANEL_X, pRect.value.iTop + MERCPANEL_Y, pRect.value.iRight + MERCPANEL_X, pRect.value.iBottom + MERCPANEL_Y, color, pDestBuf);
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
  let pItemName: UINT16[] /* [100] */;
  let ubFontColor: UINT8;
  if (gsSelectedMercID == -1)
    return;
  for (i = 0; i < 9; i++) {
    if (gpMercSlotItem[i]) {
      // Render the current image.
      xp = mercRects[i].iLeft + 4 + MERCPANEL_X;
      yp = mercRects[i].iTop + MERCPANEL_Y;
      pDst = LockVideoSurface(FRAME_BUFFER, &uiDstPitchBYTES);
      pSrc = LockVideoSurface(guiMercInvPanelBuffers[i], &uiSrcPitchBYTES);
      Blt16BPPTo16BPPTrans(pDst, uiDstPitchBYTES, pSrc, uiSrcPitchBYTES, xp, yp, 0, 0, i < 3 ? 22 : 44, 15, 0);
      UnLockVideoSurface(FRAME_BUFFER);
      UnLockVideoSurface(guiMercInvPanelBuffers[i]);
      LoadItemInfo(gpMercSlotItem[i].value.usItem, pItemName, NULL);
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
      SetFont(SMALLCOMPFONT);
      if (i == gbCurrSelect)
        ubFontColor = FONT_LTRED;
      else if (i == gbCurrHilite)
        ubFontColor = FONT_YELLOW;
      else
        ubFontColor = FONT_WHITE;
      DisplayWrappedString(xp, yp, 60, 2, SMALLCOMPFONT, ubFontColor, pItemName, 0, FALSE, LEFT_JUSTIFIED);
    }
  }
}

function DeleteSelectedMercsItem(): void {
  if (gbCurrSelect != -1) {
    gusMercsNewItemIndex = 0;
    AddNewItemToSelectedMercsInventory(TRUE);
  }
}

// This function does two main things:
// 1)  Allows a new item to be created via usItem and assigned to the currently selected merc.
// 2)  Converts the image from interface size to the smaller panel used by the editor.  The slots
//		 in the editor are approximately 80% of that size.  This involves scaling calculations.  These
//		 images are saved in individual slots are are blitted to the screen during rendering, not here.
// NOTE:  Step one can be skipped (when selecting an existing merc).  By setting the
function AddNewItemToSelectedMercsInventory(fCreate: BOOLEAN): void {
  let uiVideoObjectIndex: UINT32;
  let uiSrcID: UINT32;
  let uiDstID: UINT32;
  let hVObject: HVOBJECT;
  let pObject: Pointer<ETRLEObject>;
  let item: Pointer<INVTYPE>;
  let SrcRect: SGPRect;
  let DstRect: SGPRect;
  let iSrcWidth: INT32;
  let iSrcHeight: INT32;
  let iDstWidth: INT32;
  let iDstHeight: INT32;
  let rScalar: float;
  let rWidthScalar: float;
  let rHeightScalar: float;
  let fUnDroppable: BOOLEAN;

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
    fUnDroppable = gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]].fFlags & OBJECT_UNDROPPABLE ? TRUE : FALSE;

    if (Item[gusMercsNewItemIndex].usItemClass == IC_KEY) {
      CreateKeyObject(&gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]], 1, eInfo.sSelItemIndex);
    } else {
      CreateItem(gusMercsNewItemIndex, 100, &gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]]);
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
  gpMercSlotItem[gbCurrSelect] = &gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[gbCurrSelect]];

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
  item = &Item[gusMercsNewItemIndex];
  uiVideoObjectIndex = GetInterfaceGraphicForItem(item);
  GetVideoObject(&hVObject, uiVideoObjectIndex);
  BltVideoObjectOutlineFromIndex(uiSrcID, uiVideoObjectIndex, item.value.ubGraphicNum, 0, 0, 0, FALSE);

  // crop the source image
  pObject = &hVObject.value.pETRLEObject[item.value.ubGraphicNum];
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
    rScalar = max(rWidthScalar, rHeightScalar);

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
  BltStretchVideoSurface(uiDstID, uiSrcID, 0, 0, VO_BLT_SRCTRANSPARENCY, &SrcRect, &DstRect);

  // invalidate the mercs new item index
  gusMercsNewItemIndex = 0xffff;
}

function RenderMercInventoryPanel(): void {
  let x: INT32;
  // Draw the graphical panel
  BltVideoObjectFromIndex(FRAME_BUFFER, guiMercInventoryPanel, 0, MERCPANEL_X, MERCPANEL_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  // Mark the buttons dirty, so they don't disappear.
  for (x = FIRST_MERCS_INVENTORY_BUTTON; x <= LAST_MERCS_INVENTORY_BUTTON; x++) {
    MarkAButtonDirty(iEditorButton[x]);
  }
  RenderButtons();
  if (gbCurrHilite != -1)
    DrawRect(&mercRects[gbCurrHilite], Get16BPPColor(FROMRGB(200, 200, 0)));
  if (gbCurrSelect != -1)
    DrawRect(&mercRects[gbCurrSelect], Get16BPPColor(FROMRGB(200, 0, 0)));
  RenderSelectedMercsInventory();
  InvalidateRegion(MERCPANEL_X, MERCPANEL_Y, 475, 460);
  UpdateItemStatsPanel();
}

// This function is called by the move and click callback functions for the region blanketing the
// 9 slots in the inventory panel.  It passes the event type as well as the relative x and y positions
// which are processed here.  This basically checks for new changes in hilighting and selections, which
// will set the rendering flag, and getitem flag if the user wishes to choose an item.
function HandleMercInventoryPanel(sX: INT16, sY: INT16, bEvent: INT8): void {
  let x: INT8;
  if (!gfCanEditMercs && bEvent == GUI_RCLICK_EVENT) {
    // if we are dealing with a profile merc, we can't allow editing
    // of items, but we can look at them.  So, treat all right clicks
    // as if they were left clicks.
    bEvent = GUI_LCLICK_EVENT;
  }
  switch (bEvent) {
    case GUI_MOVE_EVENT:
      // user is moving the mouse around the panel, so determine which slot
      // needs to be hilighted yellow.
      for (x = 0; x < 9; x++) {
        if (PointInRect(&mercRects[x], sX, sY)) {
          if (gbCurrHilite != x) // only render if the slot isn't the same one.
            gfRenderMercInfo = TRUE;
          gbCurrHilite = x;
          return;
        }
      }
      // if we don't find a valid slot, then we need to turn it off.
      if (gbCurrHilite != -1) {
        // only turn off if it isn't already off.  This avoids unecessary rendering.
        gbCurrHilite = -1;
        gfRenderMercInfo = TRUE;
      }
      break;
    case GUI_LCLICK_EVENT:
    case GUI_RCLICK_EVENT:
      // The user has clicked in the inventory panel.  Determine if he clicked in
      // a slot.  Left click selects the slot for editing, right clicking enables
      // the user to choose an item for that slot.
      for (x = 0; x < 9; x++) {
        if (PointInRect(&mercRects[x], sX, sY)) {
          if (gbCurrSelect != x) // only if it isn't the same slot.
          {
            gfRenderMercInfo = TRUE;
            if (bEvent == GUI_LCLICK_EVENT)
              SpecifyItemToEdit(gpMercSlotItem[x], -1);
          }
          if (bEvent == GUI_RCLICK_EVENT) // user r-clicked, so enable item choosing
            gfMercGetItem = TRUE;
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
      gpMercSlotItem[x] = NULL;
    }
  } else {
    if (gpSelected.value.pDetailedPlacement.value.ubProfile != NO_PROFILE) {
      memcpy(gpSelected.value.pDetailedPlacement.value.Inv, gpSelected.value.pSoldier.value.inv, sizeof(OBJECTTYPE) * NUM_INV_SLOTS);
    }
    for (x = 0; x < 9; x++) {
      // Set the curr select and the addnewitem function will handle the rest, including rebuilding
      // the nine slot buffers, etc.
      gbCurrSelect = x;
      AddNewItemToSelectedMercsInventory(FALSE);
    }
  }
  SetDroppableCheckboxesBasedOnMercsInventory();
  SpecifyItemToEdit(NULL, -1);
  gbCurrSelect = -1;
  gbCurrHilite = -1;
}

function SetDroppableCheckboxesBasedOnMercsInventory(): void {
  let pItem: Pointer<OBJECTTYPE>;
  let i: INT32;
  if (gpSelected && gpSelected.value.pDetailedPlacement) {
    for (i = 0; i < 9; i++) {
      pItem = &gpSelected.value.pDetailedPlacement.value.Inv[gbMercSlotTypes[i]];
      if (pItem.value.fFlags & OBJECT_UNDROPPABLE) {
        // check box is clear
        UnclickEditorButton(MERCS_HEAD_SLOT + i);
      } else {
        ClickEditorButton(MERCS_HEAD_SLOT + i);
      }
    }
  }
}

function SetEnemyColorCode(ubColorCode: UINT8): void {
  if (gpSelected.value.pDetailedPlacement && gpSelected.value.pDetailedPlacement.value.ubProfile != NO_PROFILE)
    return;

  UnclickEditorButtons(FIRST_MERCS_COLORCODE_BUTTON, LAST_MERCS_COLORCODE_BUTTON);
  switch (ubColorCode) {
    case SOLDIER_CLASS_ARMY:
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ARMY;
      gubSoldierClass = SOLDIER_CLASS_ARMY;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = SOLDIER_CLASS_ARMY;
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "REDVEST");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "GREENPANTS");
      ClickEditorButton(MERCS_ARMY_CODE);
      break;
    case SOLDIER_CLASS_ADMINISTRATOR:
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ADMINISTRATOR;
      gubSoldierClass = SOLDIER_CLASS_ADMINISTRATOR;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = SOLDIER_CLASS_ADMINISTRATOR;
      ClickEditorButton(MERCS_ADMIN_CODE);
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "BLUEVEST");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "BLUEPANTS");
      break;
    case SOLDIER_CLASS_ELITE:
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE;
      gubSoldierClass = SOLDIER_CLASS_ELITE;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE;
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "BLACKSHIRT");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "BLACKPANTS");
      ClickEditorButton(MERCS_ELITE_CODE);
      break;
    case SOLDIER_CLASS_MINER:
      // will probably never get called
      gpSelected.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE;
      gubSoldierClass = SOLDIER_CLASS_MINER;
      if (gpSelected.value.pDetailedPlacement)
        gpSelected.value.pDetailedPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE;
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.VestPal, "greyVEST");
      SET_PALETTEREP_ID(gpSelected.value.pSoldier.value.PantsPal, "BEIGEPANTS");
      break;

    default:
      return;
  }
  CreateSoldierPalettes(gpSelected.value.pSoldier);
}

function SetEnemyDroppableStatus(uiSlot: UINT32, fDroppable: BOOLEAN): void {
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

function ChangeCivGroup(ubNewCivGroup: UINT8): void {
  Assert(ubNewCivGroup < NUM_CIV_GROUPS);
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
  SpecifyButtonText(iEditorButton[MERCS_CIVILIAN_GROUP], gszCivGroupNames[gubCivGroup]);
}

function RenderMercStrings(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sXPos: INT16;
  let sYPos: INT16;
  let sX: INT16;
  let sY: INT16;
  let pStr: Pointer<UINT16>;
  let curr: Pointer<SOLDIERINITNODE>;
  let str: UINT16[] /* [50] */;

  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pSoldier && curr.value.pSoldier.value.bVisible == 1) {
      // Render the health text
      pSoldier = curr.value.pSoldier;
      GetSoldierAboveGuyPositions(pSoldier, &sXPos, &sYPos, FALSE);
      // Display name
      SetFont(TINYFONT1);
      SetFontBackground(FONT_BLACK);
      SetFontForeground(FONT_WHITE);
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        FindFontCenterCoordinates(sXPos, sYPos, (80), 1, pSoldier.value.name, TINYFONT1, &sX, &sY);
        if (sY < 352) {
          gprintfdirty(sX, sY, pSoldier.value.name);
          mprintf(sX, sY, pSoldier.value.name);
        }
        sYPos += 10;

        pStr = GetSoldierHealthString(pSoldier);

        SetFont(TINYFONT1);
        SetFontBackground(FONT_BLACK);
        SetFontForeground(FONT_RED);

        FindFontCenterCoordinates(sXPos, sYPos, 80, 1, pStr, TINYFONT1, &sX, &sY);
        if (sY < 352) {
          gprintfdirty(sX, sY, pStr);
          mprintf(sX, sY, pStr);
        }
        sYPos += 10;

        SetFontForeground(FONT_GRAY2);
        swprintf(str, "Slot #%d", pSoldier.value.ubID);
        FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1, &sX, &sY);
        if (sY < 352) {
          gprintfdirty(sX, sY, str);
          mprintf(sX, sY, str);
        }
        sYPos += 10;
      } else {
        pStr = GetSoldierHealthString(pSoldier);

        SetFont(TINYFONT1);
        SetFontBackground(FONT_BLACK);
        SetFontForeground(FONT_RED);

        FindFontCenterCoordinates(sXPos, sYPos, 80, 1, pStr, TINYFONT1, &sX, &sY);
        if (sY < 352) {
          gprintfdirty(sX, sY, pStr);
          mprintf(sX, sY, pStr);
        }
        sYPos += 10;

        SetFontForeground(FONT_GRAY2);
        swprintf(str, "Slot #%d", pSoldier.value.ubID);
        FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1, &sX, &sY);
        if (sY < 352) {
          gprintfdirty(sX, sY, str);
          mprintf(sX, sY, str);
        }
        sYPos += 10;
      }
      if (curr.value.pBasicPlacement.value.bOrders == RNDPTPATROL || curr.value.pBasicPlacement.value.bOrders == POINTPATROL) {
        // make sure the placement has at least one waypoint.
        if (!curr.value.pBasicPlacement.value.bPatrolCnt) {
          if (GetJA2Clock() % 1000 < 500)
            SetFontForeground(FONT_DKRED);
          else
            SetFontForeground(FONT_RED);
          swprintf(str, "Patrol orders with no waypoints");
          FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1, &sX, &sY);
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
        swprintf(str, "Waypoints with no patrol orders");
        FindFontCenterCoordinates(sXPos, sYPos, 80, 1, str, TINYFONT1, &sX, &sY);
        if (sY < 352) {
          gprintfdirty(sX, sY, str);
          mprintf(sX, sY, str);
        }
        sYPos += 10;
      }
    }
    curr = curr.value.next;
  }
  if (gubCurrMercMode == MERC_SCHEDULEMODE) {
    RenderCurrentSchedule();
  }
}

function SetMercTeamVisibility(bTeam: INT8, fVisible: BOOLEAN): void {
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
    IndicateSelectedMerc(SELECT_NO_MERC);
  }
}

function DetermineScheduleEditability(): void {
  let i: INT32;
  EnableEditorButtons(MERCS_SCHEDULE_ACTION1, MERCS_SCHEDULE_DATA4B);
  EnableTextFields(1, 4);
  for (i = 0; i < 4; i++) {
    switch (gCurrSchedule.ubAction[i]) {
      case SCHEDULE_ACTION_NONE:
      case SCHEDULE_ACTION_LEAVESECTOR:
        EnableEditorButton(MERCS_SCHEDULE_ACTION1 + i);
        EnableEditorButton(MERCS_SCHEDULE_VARIANCE1 + i);
        HideEditorButton(MERCS_SCHEDULE_DATA1A + i);
        HideEditorButton(MERCS_SCHEDULE_DATA1B + i);
        break;
      case SCHEDULE_ACTION_LOCKDOOR:
      case SCHEDULE_ACTION_UNLOCKDOOR:
      case SCHEDULE_ACTION_OPENDOOR:
      case SCHEDULE_ACTION_CLOSEDOOR:
        EnableEditorButton(MERCS_SCHEDULE_ACTION1 + i);
        EnableEditorButton(MERCS_SCHEDULE_VARIANCE1 + i);
        ShowEditorButton(MERCS_SCHEDULE_DATA1A + i);
        ShowEditorButton(MERCS_SCHEDULE_DATA1B + i);
        EnableEditorButton(MERCS_SCHEDULE_DATA1A + i);
        EnableEditorButton(MERCS_SCHEDULE_DATA1B + i);
        break;
      case SCHEDULE_ACTION_GRIDNO:
      case SCHEDULE_ACTION_ENTERSECTOR:
      case SCHEDULE_ACTION_SLEEP:
        EnableEditorButton(MERCS_SCHEDULE_ACTION1 + i);
        EnableEditorButton(MERCS_SCHEDULE_VARIANCE1 + i);
        ShowEditorButton(MERCS_SCHEDULE_DATA1A + i);
        HideEditorButton(MERCS_SCHEDULE_DATA1B + i);
        EnableEditorButton(MERCS_SCHEDULE_DATA1A + i);
        break;
      case SCHEDULE_ACTION_STAYINSECTOR:
        DisableTextField((i + 1));
        EnableEditorButton(MERCS_SCHEDULE_ACTION1 + i);
        DisableEditorButton(MERCS_SCHEDULE_VARIANCE1 + i);
        HideEditorButton(MERCS_SCHEDULE_DATA1A + i);
        HideEditorButton(MERCS_SCHEDULE_DATA1B + i);
        break;
    }
  }
}

function CancelCurrentScheduleAction(): void {
  UpdateScheduleAction(SCHEDULE_ACTION_NONE);
  DetermineScheduleEditability();
}

function RegisterCurrentScheduleAction(iMapIndex: INT32): void {
  let str: UINT16[] /* [6] */;
  MarkWorldDirty();
  swprintf(str, "%d", iMapIndex);
  if (gfUseScheduleData2) {
    if (gfSingleAction)
      return;
    iDrawMode = DRAW_MODE_PLAYER + gpSelected.value.pBasicPlacement.value.bTeam;
    gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = iMapIndex;
    SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex], str);
    DetermineScheduleEditability();
    gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_NONE;
    gfRenderTaskbar = TRUE;
    gfUseScheduleData2 = FALSE;
  } else {
    switch (gCurrSchedule.ubAction[gubCurrentScheduleActionIndex]) {
      case SCHEDULE_ACTION_LOCKDOOR:
      case SCHEDULE_ACTION_UNLOCKDOOR:
      case SCHEDULE_ACTION_OPENDOOR:
      case SCHEDULE_ACTION_CLOSEDOOR:
        if (gfSingleAction) {
          gfSingleAction = FALSE;
          gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_NONE;
          gfRenderTaskbar = TRUE;
          DetermineScheduleEditability();
          break;
        }
        DisableEditorButton(MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
        EnableEditorButton(MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex);
        gfUseScheduleData2 = TRUE;
        iDrawMode = DRAW_MODE_SCHEDULEACTION;
        gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_DOOR2;
        gfRenderTaskbar = TRUE;
        break;
      case SCHEDULE_ACTION_GRIDNO:
      case SCHEDULE_ACTION_ENTERSECTOR:
      case SCHEDULE_ACTION_SLEEP:
        iDrawMode = DRAW_MODE_PLAYER + gpSelected.value.pBasicPlacement.value.bTeam;
        DetermineScheduleEditability();
        gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_NONE;
        gfRenderTaskbar = TRUE;
        break;
      case SCHEDULE_ACTION_LEAVESECTOR:
      case SCHEDULE_ACTION_STAYINSECTOR:
      case SCHEDULE_ACTION_NONE:
        break;
    }
    gCurrSchedule.usData1[gubCurrentScheduleActionIndex] = iMapIndex;
    SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex], str);
  }
}

function StartScheduleAction(): void {
  switch (gCurrSchedule.ubAction[gubCurrentScheduleActionIndex]) {
    case SCHEDULE_ACTION_NONE:
      EnableEditorButtons(MERCS_SCHEDULE_ACTION1, MERCS_SCHEDULE_DATA4B);
      EnableTextFields(1, 4);
      gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_NONE;
      gfRenderTaskbar = TRUE;
      gCurrSchedule.usData1[gubCurrentScheduleActionIndex] = 0xffff;
      gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = 0xffff;
      break;
    case SCHEDULE_ACTION_LOCKDOOR:
    case SCHEDULE_ACTION_UNLOCKDOOR:
    case SCHEDULE_ACTION_OPENDOOR:
    case SCHEDULE_ACTION_CLOSEDOOR:
      // First disable everything -- its easier that way.
      ShowEditorButton(MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      ShowEditorButton(MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex);
      DisableEditorButtons(MERCS_SCHEDULE_ACTION1, MERCS_SCHEDULE_DATA4B);
      DisableTextFields(1, 4);
      EnableEditorButton(MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      gfUseScheduleData2 = FALSE;
      iDrawMode = DRAW_MODE_SCHEDULEACTION;
      gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_DOOR1;
      gfRenderTaskbar = TRUE;
      break;
    case SCHEDULE_ACTION_GRIDNO:
    case SCHEDULE_ACTION_ENTERSECTOR:
    case SCHEDULE_ACTION_SLEEP:
      ShowEditorButton(MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      HideEditorButton(MERCS_SCHEDULE_DATA1B + gubCurrentScheduleActionIndex);
      DisableEditorButtons(MERCS_SCHEDULE_ACTION1, MERCS_SCHEDULE_DATA4B);
      DisableTextFields(1, 4);
      EnableEditorButton(MERCS_SCHEDULE_DATA1A + gubCurrentScheduleActionIndex);
      gfUseScheduleData2 = FALSE;
      iDrawMode = DRAW_MODE_SCHEDULEACTION;
      gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_GRIDNO;
      gfRenderTaskbar = TRUE;
      gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = 0xffff;
      break;
    case SCHEDULE_ACTION_LEAVESECTOR:
    case SCHEDULE_ACTION_STAYINSECTOR:
      gubScheduleInstructions = SCHEDULE_INSTRUCTIONS_NONE;
      gfRenderTaskbar = TRUE;
      gCurrSchedule.usData1[gubCurrentScheduleActionIndex] = 0xffff;
      gCurrSchedule.usData2[gubCurrentScheduleActionIndex] = 0xffff;
      break;
  }
  MarkWorldDirty();
}

function UpdateScheduleAction(ubNewAction: UINT8): void {
  gCurrSchedule.ubAction[gubCurrentScheduleActionIndex] = ubNewAction;
  SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_ACTION1 + gubCurrentScheduleActionIndex], gszScheduleActions[ubNewAction]);
  MSYS_SetBtnUserData(iEditorButton[MERCS_SCHEDULE_ACTION1 + gubCurrentScheduleActionIndex], 0, ubNewAction);
  // Now, based on this action, disable the other buttons
  StartScheduleAction();
  gfSingleAction = FALSE;
}

// 0:1A, 1:1B, 2:2A, 3:2B, ...
function FindScheduleGridNo(ubScheduleData: UINT8): void {
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

function ClearCurrentSchedule(): void {
  let i: UINT8;
  memset(&gCurrSchedule, 0, sizeof(SCHEDULENODE));
  for (i = 0; i < 4; i++) {
    MSYS_SetBtnUserData(iEditorButton[MERCS_SCHEDULE_ACTION1 + i], 0, 0);
    SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_ACTION1 + i], "No action");
    gCurrSchedule.usTime[i] = 0xffff;
    SetExclusive24HourTimeValue((i + 1), gCurrSchedule.usTime[i]); // blanks the field
    gCurrSchedule.usData1[i] = 0xffff;
    SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_DATA1A + i], "");
    gCurrSchedule.usData2[i] = 0xffff;
    SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_DATA1B + i], "");
  }
  // Remove the variance stuff
  gCurrSchedule.usFlags = 0;
  UnclickEditorButtons(MERCS_SCHEDULE_VARIANCE1, MERCS_SCHEDULE_VARIANCE4);

  gubCurrentScheduleActionIndex = 0;
  DetermineScheduleEditability();
  gfRenderTaskbar = TRUE;
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
  let str: UINT16[] /* [3] */;
  for (i = 0; i < 8; i++) {
    if (i % 2)
      iMapIndex = gCurrSchedule.usData2[i / 2];
    else
      iMapIndex = gCurrSchedule.usData1[i / 2];

    if (iMapIndex == 0xffff)
      continue;

    // Convert it's location to screen coordinates
    ConvertGridNoToXY(iMapIndex, &sXMapPos, &sYMapPos);

    dOffsetX = (sXMapPos * CELL_X_SIZE) - gsRenderCenterX;
    dOffsetY = (sYMapPos * CELL_Y_SIZE) - gsRenderCenterY;

    FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, &ScrnX, &ScrnY);

    sScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + ScrnX;
    sScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + ScrnY;

    // Adjust for tiles height factor!
    sScreenY -= gpWorldLevelData[iMapIndex].sHeight;
    // Bring it down a touch
    sScreenY += 5;

    if (sScreenY <= 355) {
      // Shown it on screen!
      SetFont(TINYFONT1);
      SetFontBackground(FONT_LTKHAKI);
      SetFontForeground(FONT_WHITE);
      swprintf(str, "%d%c", i / 2 + 1, 'A' + (i % 2));
      VarFindFontCenterCoordinates(sScreenX, sScreenY, 1, 1, TINYFONT1, &sX, &sY, str);
      mprintf(sX, sY, str);
    }
  }
}

function UpdateScheduleInfo(): void {
  let i: INT32;
  let pSchedule: Pointer<SCHEDULENODE>;
  let str: UINT16[] /* [6] */;
  if (gpSelected.value.pSoldier.value.ubScheduleID) {
    pSchedule = GetSchedule(gpSelected.value.pSoldier.value.ubScheduleID);
    if (!pSchedule) {
      return;
    }
    for (i = 0; i < 4; i++) {
      // Update the text and buttons
      MSYS_SetBtnUserData(iEditorButton[MERCS_SCHEDULE_ACTION1 + i], 0, pSchedule.value.ubAction[i]);
      SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_ACTION1 + i], gszScheduleActions[pSchedule.value.ubAction[i]]);
      swprintf(str, "");
      if (pSchedule.value.usData1[i] != 0xffff)
        swprintf(str, "%d", pSchedule.value.usData1[i]);
      SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_DATA1A + i], str);
      swprintf(str, "");
      if (pSchedule.value.usData2[i] != 0xffff)
        swprintf(str, "%d", pSchedule.value.usData2[i]);
      SpecifyButtonText(iEditorButton[MERCS_SCHEDULE_DATA1B + i], str);
      if (gubCurrMercMode == MERC_SCHEDULEMODE) {
        // Update the text input fields too!
        SetExclusive24HourTimeValue((i + 1), pSchedule.value.usTime[i]);
      }
    }

    // Check or uncheck the checkbox buttons based on the schedule's status.
    UnclickEditorButtons(MERCS_SCHEDULE_VARIANCE1, MERCS_SCHEDULE_VARIANCE4);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE1)
      ClickEditorButton(MERCS_SCHEDULE_VARIANCE1);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE2)
      ClickEditorButton(MERCS_SCHEDULE_VARIANCE2);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE3)
      ClickEditorButton(MERCS_SCHEDULE_VARIANCE3);
    if (pSchedule.value.usFlags & SCHEDULE_FLAGS_VARIANCE4)
      ClickEditorButton(MERCS_SCHEDULE_VARIANCE4);

    // Copy the schedule over to the current global schedule used for editing purposes.
    memcpy(&gCurrSchedule, pSchedule, sizeof(SCHEDULENODE));
    DetermineScheduleEditability();
  } else {
    ClearCurrentSchedule();
  }
}

let gSaveBufferBasicPlacement: BASIC_SOLDIERCREATE_STRUCT;
let gSaveBufferDetailedPlacement: SOLDIERCREATE_STRUCT;

function CopyMercPlacement(iMapIndex: INT32): void {
  if (gsSelectedMercID == -1) {
    ScreenMsg(FONT_MCOLOR_LTRED, MSG_INTERFACE, "Placement not copied because no placement selected.");
    return;
  }
  gfSaveBuffer = TRUE;
  memcpy(&gSaveBufferBasicPlacement, gpSelected.value.pBasicPlacement, sizeof(BASIC_SOLDIERCREATE_STRUCT));
  if (gSaveBufferBasicPlacement.fDetailedPlacement) {
    memcpy(&gSaveBufferDetailedPlacement, gpSelected.value.pDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));
  }
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Placement copied.");
}

function PasteMercPlacement(iMapIndex: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT;
  let i: INT32;

  if (!gfSaveBuffer) {
    ScreenMsg(FONT_MCOLOR_LTRED, MSG_INTERFACE, "Placement not pasted as no placement is saved in buffer.");
    return;
  }

  memcpy(&gTempBasicPlacement, &gSaveBufferBasicPlacement, sizeof(BASIC_SOLDIERCREATE_STRUCT));

  gTempBasicPlacement.bBodyType = -1;

  // calculate specific information based on the team.
  switch (iDrawMode) {
    case DRAW_MODE_ENEMY:
      gTempBasicPlacement.bTeam = ENEMY_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubSoldierClass = gubSoldierClass;
      break;
    case DRAW_MODE_CREATURE:
      gTempBasicPlacement.bTeam = CREATURE_TEAM;
      gTempBasicPlacement.bBodyType = gbCurrCreature;
      break;
    case DRAW_MODE_REBEL:
      gTempBasicPlacement.bTeam = MILITIA_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      break;
    case DRAW_MODE_CIVILIAN:
      gTempBasicPlacement.bTeam = CIV_TEAM;
      gTempBasicPlacement.bBodyType = RANDOM;
      gTempBasicPlacement.ubCivilianGroup = gubCivGroup;
      if (giCurrentTilesetID == 1) // caves
      {
        gTempBasicPlacement.ubSoldierClass = SOLDIER_CLASS_MINER;
      }
      break;
  }

  if (IsLocationSittable(iMapIndex, gfRoofPlacement)) {
    let ubID: UINT8;
    let sSectorX: INT16;
    let sSectorY: INT16;
    let pNode: Pointer<SOLDIERINITNODE>;

    GetCurrentWorldSector(&sSectorX, &sSectorY);

    // Set up some general information.
    // gTempBasicPlacement.fDetailedPlacement = TRUE;
    gTempBasicPlacement.usStartingGridNo = iMapIndex;

    // Generate detailed placement information given the temp placement information.
    if (gTempBasicPlacement.fDetailedPlacement) {
      memcpy(&gTempDetailedPlacement, &gSaveBufferDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));
    } else {
      CreateDetailedPlacementGivenBasicPlacementInfo(&gTempDetailedPlacement, &gTempBasicPlacement);
    }

    // Set the sector information -- probably unnecessary.
    gTempDetailedPlacement.sSectorX = sSectorX;
    gTempDetailedPlacement.sSectorY = sSectorY;

    if (gTempBasicPlacement.fDetailedPlacement) {
      CreateDetailedPlacementGivenStaticDetailedPlacementAndBasicPlacementInfo(&tempDetailedPlacement, &gTempDetailedPlacement, &gTempBasicPlacement);
    } else {
      memcpy(&tempDetailedPlacement, &gTempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));
    }

    // Create the soldier, but don't place it yet.
    if (pSoldier = TacticalCreateSoldier(&tempDetailedPlacement, &ubID)) {
      pSoldier.value.bVisible = 1;
      pSoldier.value.bLastRenderVisibleValue = 1;
      // Set up the soldier in the list, so we can track the soldier in the
      // future (saving, loading, strategic AI)
      pNode = AddBasicPlacementToSoldierInitList(&gTempBasicPlacement);
      Assert(pNode);
      pNode.value.pSoldier = pSoldier;
      if (gSaveBufferBasicPlacement.fDetailedPlacement) {
        // Add the static detailed placement information in the same newly created node as the basic placement.
        // read static detailed placement from file
        // allocate memory for new static detailed placement
        gTempBasicPlacement.fDetailedPlacement = TRUE;
        gTempBasicPlacement.fPriorityExistance = gSaveBufferBasicPlacement.fPriorityExistance;
        pNode.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
        if (!pNode.value.pDetailedPlacement) {
          AssertMsg(0, "Failed to allocate memory for new detailed placement in PasteMercPlacement.");
          return;
        }
        // copy the file information from temp var to node in list.
        memcpy(pNode.value.pDetailedPlacement, &gSaveBufferDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));
      }

      // Add the soldier to physically appear on the map now.
      InternalAddSoldierToSector(ubID, FALSE, FALSE, 0, 0);
      IndicateSelectedMerc(ubID);

      // Move him to the roof if intended and possible.
      if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
        gpSelected.value.pBasicPlacement.value.fOnRoof = TRUE;
        if (gpSelected.value.pDetailedPlacement)
          gpSelected.value.pDetailedPlacement.value.fOnRoof = TRUE;
        SetSoldierHeight(gpSelected.value.pSoldier, 58.0);
      }
      UnclickEditorButtons(FIRST_MERCS_INVENTORY_BUTTON, LAST_MERCS_INVENTORY_BUTTON);
      for (i = FIRST_MERCS_INVENTORY_BUTTON; i <= LAST_MERCS_INVENTORY_BUTTON; i++) {
        SetEnemyDroppableStatus(gbMercSlotTypes[i - FIRST_MERCS_INVENTORY_BUTTON], FALSE);
      }
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Placement pasted.");
    } else {
      ScreenMsg(FONT_MCOLOR_LTRED, MSG_INTERFACE, "Placement not pasted as the maximum number of placements for this team is already used.");
    }
  }
}
