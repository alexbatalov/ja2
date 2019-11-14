namespace ja2 {

const MAP_SIZE = 208;
const MAP_LEFT = 417;
const MAP_TOP = 15;
const MAP_RIGHT = (MAP_LEFT + MAP_SIZE);
const MAP_BOTTOM = (MAP_TOP + MAP_SIZE);

const enum Enum55 {
  PRE_ALPHA,
  ALPHA,
  DEMO,
  BETA,
  RELEASE,
}
let gszVersionType: string[] /* UINT16[5][10] */ = [
  "Pre-Alpha",
  "Alpha",
  "Demo",
  "Beta",
  "Release",
];
const GLOBAL_SUMMARY_STATE = Enum55.RELEASE;

// Regular masks
const GROUND_LEVEL_MASK = 0x01;
const BASEMENT1_LEVEL_MASK = 0x02;
const BASEMENT2_LEVEL_MASK = 0x04;
const BASEMENT3_LEVEL_MASK = 0x08;
const ALL_LEVELS_MASK = 0x0f;
// Alternate masks
const ALTERNATE_GROUND_MASK = 0x10;
const ALTERNATE_B1_MASK = 0x20;
const ALTERNATE_B2_MASK = 0x40;
const ALTERNATE_B3_MASK = 0x80;
const ALTERNATE_LEVELS_MASK = 0xf0;

let giCurrLevel: INT32;

let gfOutdatedDenied: boolean;
let gusNumEntriesWithOutdatedOrNoSummaryInfo: UINT16;

export let gfUpdatingNow: boolean;
let gusTotal: UINT16;
let gusCurrent: UINT16;

let gfMustForceUpdateAllMaps: boolean = false;
let gusNumberOfMapsToBeForceUpdated: UINT16 = 0;
export let gfMajorUpdate: boolean = false;

let giCurrentViewLevel: INT32 = ALL_LEVELS_MASK;

let gbSectorLevels: boolean[][] /* [16][16] */;
let gfGlobalSummaryLoaded: boolean = false;

let gpSectorSummary: Pointer<SUMMARYFILE>[][][] /* [16][16][8] */;
let gpCurrentSectorSummary: Pointer<SUMMARYFILE>;

let MapRegion: MOUSE_REGION = createMouseRegion();

// Set if there is an existing global summary.  The first time this is run on your computer, it
// will not exist, and will have to be generated before this will be set.
export let gfGlobalSummaryExists: boolean;
// If you don't wish to create a global summary, you can deny it.  This safely locks the system
// from generating one.
let gfDeniedSummaryCreation: boolean;
// Set whenever the entire display is to be marked dirty.
let gfRenderSummary: boolean;
// Used externally to determine if the summary window is up or not.
export let gfSummaryWindowActive: boolean;
// When set, the summary window stays up until told otherwise.  When clear, the summary will disappear
// when the assigned key (F5) is released.  The latter mode is initiated when F5 is held down for longer
// than .4 seconds, and is useful for quickly looking at the information in the current map being edited.
let gfPersistantSummary: boolean;
// When set, a grid is overlayed on top of the sector.  This grid defines each of the 256 sectors.  It is
// on by default.
let gfRenderGrid: boolean;
// When set, parts of the map are darkened, showing that those sectors don't exist in the currently selected
// layer.  When clear, the entire map is shown in full color.
let gfRenderProgress: boolean;
// When set, only the map section is rerendered.
let gfRenderMap: boolean;
// Set whenever the ctrl key is held down.  This is used in conjunction with gfFileIO to determine whether the
// selected sector is to be saved instead of loaded when clear.
let gfCtrlPressed: boolean;
// When set, it is time to load or save the selected sector.  If gfCtrlPressed is set, the the map is saved,
// instead of loaded.  It is impossible to load a map that doesn't exist.
let gfFileIO: boolean;
// When set, then we are overriding the ability to use normal methods for selecting sectors for saving and
// loading.  Immediately upon entering the text input mode; for the temp file; then we are assuming that
// the user will type in a name that doesn't follow standard naming conventions for the purposes of the
// campaign editor.  This is useful for naming a temp file for saving or loading.
let gfTempFile: boolean;
// When set, only the alternate version of the maps will be displayed.  This is used for alternate maps in
// particular sectors, such as the SkyRider quest which could be located at one of four maps randomly.  If
// that particular map is chosen, then the alternate map will be used.
let gfAlternateMaps: boolean = false;

const enum Enum56 {
  ITEMMODE_SCIFI,
  ITEMMODE_REAL,
  ITEMMODE_ENEMY,
}
let gubSummaryItemMode: UINT8 = Enum56.ITEMMODE_SCIFI;

let gfItemDetailsMode: boolean = false;

let gpWorldItemsSummaryArray: Pointer<WORLDITEM> = null;
let gusWorldItemsSummaryArraySize: UINT16 = 0;
let gpPEnemyItemsSummaryArray: Pointer<OBJECTTYPE> = null;
let gusPEnemyItemsSummaryArraySize: UINT16 = 0;
let gpNEnemyItemsSummaryArray: Pointer<OBJECTTYPE> = null;
let gusNEnemyItemsSummaryArraySize: UINT16 = 0;

let gfSetupItemDetailsMode: boolean = true;

export let gfUpdateSummaryInfo: boolean;

let usNumSummaryFilesOutOfDate: UINT16;

let gfMapFileDirty: boolean;

// Override status.  Hide is when there is nothing to override, readonly, when checked is to override a
// readonly status file, so that you can write to it, and overwrite, when checked, allows you to save,
// replacing the existing file.  These states are not persistant, which forces the user to check the
// box before saving.
const enum Enum57 {
  INACTIVE,
  READONLY,
  OVERWRITE,
}
let gubOverrideStatus: UINT8;
// Set when the a new sector/level is selected, forcing the user to reselect the override status.
let gfOverrideDirty: boolean;
// The state of the override button, true if overriden intended.
let gfOverride: boolean;

// The sector coordinates of the map currently loaded in memory (blue)
let gsSectorX: INT16;
let gsSectorY: INT16;
// The layer of the sector that is currently loaded in memory.
let gsSectorLayer: INT32;
// The sector coordinates of the mouse position (yellow)
let gsHiSectorX: INT16;
let gsHiSectorY: INT16;
// The sector coordinates of the selected sector (red)
let gsSelSectorX: INT16;
let gsSelSectorY: INT16;

// Used to determine how long the F5 key has been held down for to determine whether or not the
// summary is going to be persistant or not.
let giInitTimer: UINT32;

let gszFilename: string /* UINT16[40] */;
let gszTempFilename: string /* UINT16[21] */;
let gszDisplayName: string /* UINT16[21] */;

const enum Enum58 {
  SUMMARY_BACKGROUND,
  SUMMARY_OKAY,
  SUMMARY_GRIDCHECKBOX,
  SUMMARY_PROGRESSCHECKBOX,
  SUMMARY_ALL,
  SUMMARY_G,
  SUMMARY_B1,
  SUMMARY_B2,
  SUMMARY_B3,
  SUMMARY_ALTERNATE,
  SUMMARY_LOAD,
  SUMMARY_SAVE,
  SUMMARY_OVERRIDE,
  SUMMARY_UPDATE,
  SUMMARY_SCIFI,
  SUMMARY_REAL,
  SUMMARY_ENEMY,
  NUM_SUMMARY_BUTTONS,
}
let iSummaryButton: INT32[] /* [NUM_SUMMARY_BUTTONS] */;

export function CreateSummaryWindow(): void {
  let i: INT32;

  if (!gfGlobalSummaryLoaded) {
    LoadGlobalSummary();
    gfGlobalSummaryLoaded = true;
  }

  if (gfSummaryWindowActive)
    return;

  DisableEditorTaskbar();
  DisableAllTextFields();

  GetCurrentWorldSector(addressof(gsSectorX), addressof(gsSectorY));
  gsSelSectorX = gsSectorX;
  gsSelSectorY = gsSectorY;
  gfSummaryWindowActive = true;
  gfPersistantSummary = false;
  giInitTimer = GetJA2Clock();
  gfDeniedSummaryCreation = false;
  gfRenderSummary = true;
  if (gfWorldLoaded)
    gfMapFileDirty = true;
  // Create all of the buttons here
  iSummaryButton[Enum58.SUMMARY_BACKGROUND] = CreateTextButton(0, 0, 0, 0, BUTTON_USE_DEFAULT, 0, 0, 640, 360, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH - 1, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  SpecifyDisabledButtonStyle(iSummaryButton[Enum58.SUMMARY_BACKGROUND], Enum29.DISABLED_STYLE_NONE);
  DisableButton(iSummaryButton[Enum58.SUMMARY_BACKGROUND]);

  iSummaryButton[Enum58.SUMMARY_OKAY] = CreateTextButton("Okay", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 585, 325, 50, 30, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryOkayCallback);
  // GiveButtonDefaultStatus( iSummaryButton[ SUMMARY_OKAY ], DEFAULT_STATUS_WINDOWS95 );

  iSummaryButton[Enum58.SUMMARY_GRIDCHECKBOX] = CreateCheckBoxButton(MAP_LEFT, (MAP_BOTTOM + 5), "EDITOR//smcheckbox.sti", MSYS_PRIORITY_HIGH, SummaryToggleGridCallback);
  ButtonList[iSummaryButton[Enum58.SUMMARY_GRIDCHECKBOX]].uiFlags |= BUTTON_CLICKED_ON;
  gfRenderGrid = true;

  iSummaryButton[Enum58.SUMMARY_PROGRESSCHECKBOX] = CreateCheckBoxButton((MAP_LEFT + 50), (MAP_BOTTOM + 5), "EDITOR//smcheckbox.sti", MSYS_PRIORITY_HIGH, SummaryToggleProgressCallback);
  ButtonList[iSummaryButton[Enum58.SUMMARY_PROGRESSCHECKBOX]].uiFlags |= BUTTON_CLICKED_ON;
  gfRenderProgress = true;

  iSummaryButton[Enum58.SUMMARY_ALL] = CreateTextButton("A", SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, MAP_LEFT + 110, MAP_BOTTOM + 5, 16, 16, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryToggleLevelCallback);
  if (giCurrentViewLevel == ALL_LEVELS_MASK || giCurrentViewLevel == ALTERNATE_LEVELS_MASK)
    ButtonList[iSummaryButton[Enum58.SUMMARY_ALL]].uiFlags |= BUTTON_CLICKED_ON;
  iSummaryButton[Enum58.SUMMARY_G] = CreateTextButton("G", SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, MAP_LEFT + 128, MAP_BOTTOM + 5, 16, 16, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryToggleLevelCallback);
  if (giCurrentViewLevel == GROUND_LEVEL_MASK || giCurrentViewLevel == ALTERNATE_GROUND_MASK)
    ButtonList[iSummaryButton[Enum58.SUMMARY_G]].uiFlags |= BUTTON_CLICKED_ON;
  iSummaryButton[Enum58.SUMMARY_B1] = CreateTextButton("B1", SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, MAP_LEFT + 146, MAP_BOTTOM + 5, 16, 16, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryToggleLevelCallback);
  if (giCurrentViewLevel == BASEMENT1_LEVEL_MASK || giCurrentViewLevel == ALTERNATE_B1_MASK)
    ButtonList[iSummaryButton[Enum58.SUMMARY_B1]].uiFlags |= BUTTON_CLICKED_ON;
  iSummaryButton[Enum58.SUMMARY_B2] = CreateTextButton("B2", SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, MAP_LEFT + 164, MAP_BOTTOM + 5, 16, 16, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryToggleLevelCallback);
  if (giCurrentViewLevel == BASEMENT2_LEVEL_MASK || giCurrentViewLevel == ALTERNATE_B2_MASK)
    ButtonList[iSummaryButton[Enum58.SUMMARY_B2]].uiFlags |= BUTTON_CLICKED_ON;
  iSummaryButton[Enum58.SUMMARY_B3] = CreateTextButton("B3", SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, MAP_LEFT + 182, MAP_BOTTOM + 5, 16, 16, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryToggleLevelCallback);
  if (giCurrentViewLevel == BASEMENT3_LEVEL_MASK || giCurrentViewLevel == ALTERNATE_B3_MASK)
    ButtonList[iSummaryButton[Enum58.SUMMARY_B3]].uiFlags |= BUTTON_CLICKED_ON;

  iSummaryButton[Enum58.SUMMARY_ALTERNATE] = CreateCheckBoxButton(MAP_LEFT, (MAP_BOTTOM + 25), "EDITOR//smcheckbox.sti", MSYS_PRIORITY_HIGH, SummaryToggleAlternateCallback);
  if (gfAlternateMaps)
    ButtonList[iSummaryButton[Enum58.SUMMARY_ALTERNATE]].uiFlags |= BUTTON_CLICKED_ON;

  iSummaryButton[Enum58.SUMMARY_LOAD] = CreateTextButton("LOAD", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, MAP_LEFT, MAP_BOTTOM + 45, 50, 26, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryLoadMapCallback);
  iSummaryButton[Enum58.SUMMARY_SAVE] = CreateTextButton("SAVE", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, MAP_LEFT + 55, MAP_BOTTOM + 45, 50, 26, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummarySaveMapCallback);
  iSummaryButton[Enum58.SUMMARY_OVERRIDE] = CreateCheckBoxButton((MAP_LEFT + 110), (MAP_BOTTOM + 59), "EDITOR\\smcheckbox.sti", MSYS_PRIORITY_HIGH, SummaryOverrideCallback);

  iSummaryButton[Enum58.SUMMARY_UPDATE] = CreateTextButton("Update", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 255, 15, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SummaryUpdateCallback);

  iSummaryButton[Enum58.SUMMARY_REAL] = CreateCheckBoxButton(350, 47, "EDITOR\\radiobutton.sti", MSYS_PRIORITY_HIGH, SummaryRealCallback);
  iSummaryButton[Enum58.SUMMARY_SCIFI] = CreateCheckBoxButton(376, 47, "EDITOR\\radiobutton.sti", MSYS_PRIORITY_HIGH, SummarySciFiCallback);
  iSummaryButton[Enum58.SUMMARY_ENEMY] = CreateCheckBoxButton(350, 60, "EDITOR\\radiobutton.sti", MSYS_PRIORITY_HIGH, SummaryEnemyCallback);

  // SetButtonFastHelpText( iSummaryButton[ SUMMARY_SCIFI ], L"Display items that appear in SciFi mode." );
  // SetButtonFastHelpText( iSummaryButton[ SUMMARY_REAL ], L"Display items that appear in Realistic mode." );
  switch (gubSummaryItemMode) {
    case Enum56.ITEMMODE_SCIFI:
      ButtonList[iSummaryButton[Enum58.SUMMARY_SCIFI]].uiFlags |= BUTTON_CLICKED_ON;
      break;
    case Enum56.ITEMMODE_REAL:
      ButtonList[iSummaryButton[Enum58.SUMMARY_REAL]].uiFlags |= BUTTON_CLICKED_ON;
      break;
    case Enum56.ITEMMODE_ENEMY:
      ButtonList[iSummaryButton[Enum58.SUMMARY_ENEMY]].uiFlags |= BUTTON_CLICKED_ON;
      break;
  }

  // Init the textinput field.
  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);
  AddUserInputField(null); // just so we can use short cut keys while not typing.
  AddTextInputField(MAP_LEFT + 112, MAP_BOTTOM + 75, 100, 18, MSYS_PRIORITY_HIGH, "", 20, Enum383.INPUTTYPE_EXCLUSIVE_DOSFILENAME);

  for (i = 1; i < Enum58.NUM_SUMMARY_BUTTONS; i++)
    HideButton(iSummaryButton[i]);

  MSYS_DefineRegion(MapRegion, MAP_LEFT, MAP_TOP, MAP_RIGHT, MAP_BOTTOM, MSYS_PRIORITY_HIGH, 0, MapMoveCallback, MapClickCallback);
  MSYS_DisableRegion(MapRegion);

  // if( gfItemDetailsMode )
  //	{
  gfItemDetailsMode = false;
  //	gfSetupItemDetailsMode = TRUE;
  //}
  if (!gfWorldLoaded) {
    gfConfirmExitFirst = false;
    ReleaseSummaryWindow();
    DisableButton(iSummaryButton[Enum58.SUMMARY_OKAY]);
    DisableButton(iSummaryButton[Enum58.SUMMARY_SAVE]);
  }
  if (gfAutoLoadA9) {
    gfAutoLoadA9++;
    gsSelSectorX = 9;
    gsSelSectorY = 1;
    gpCurrentSectorSummary = gpSectorSummary[8][0][0];
    ButtonList[iSummaryButton[Enum58.SUMMARY_LOAD]].uiFlags |= BUTTON_CLICKED_ON;
  }
}

export function AutoLoadMap(): void {
  SummaryLoadMapCallback(ButtonList[iSummaryButton[Enum58.SUMMARY_LOAD]], MSYS_CALLBACK_REASON_LBUTTON_UP);
  if (gfWorldLoaded)
    DestroySummaryWindow();
  gfAutoLoadA9 = false;
  gfConfirmExitFirst = true;
}

function ReleaseSummaryWindow(): void {
  let i: INT32;
  let uiCurrTimer: UINT32;
  if (!gfSummaryWindowActive || gfPersistantSummary)
    return;
  uiCurrTimer = GetJA2Clock();
  if (!gfWorldLoaded || uiCurrTimer - giInitTimer < 400) {
    // make window persistant
    for (i = 1; i < Enum58.NUM_SUMMARY_BUTTONS; i++)
      ShowButton(iSummaryButton[i]);
    HideButton(iSummaryButton[Enum58.SUMMARY_UPDATE]);
    HideButton(iSummaryButton[Enum58.SUMMARY_OVERRIDE]);
    HideButton(iSummaryButton[Enum58.SUMMARY_REAL]);
    HideButton(iSummaryButton[Enum58.SUMMARY_SCIFI]);
    HideButton(iSummaryButton[Enum58.SUMMARY_ENEMY]);
    MSYS_EnableRegion(MapRegion);
    gfPersistantSummary = true;
    gfOverrideDirty = true;
    gfRenderSummary = true;
  } else {
    DestroySummaryWindow();
  }
}

export function DestroySummaryWindow(): void {
  let i: INT32;
  if (!gfSummaryWindowActive)
    return;
  for (i = 0; i < Enum58.NUM_SUMMARY_BUTTONS; i++) {
    RemoveButton(iSummaryButton[i]);
  }

  MSYS_RemoveRegion(MapRegion);

  gfSummaryWindowActive = false;
  gfPersistantSummary = false;
  MarkWorldDirty();
  KillTextInputMode();
  EnableEditorTaskbar();
  EnableAllTextFields();

  if (gpWorldItemsSummaryArray) {
    MemFree(gpWorldItemsSummaryArray);
    gpWorldItemsSummaryArray = null;
    gusWorldItemsSummaryArraySize = 0;
  }
  if (gpPEnemyItemsSummaryArray) {
    MemFree(gpPEnemyItemsSummaryArray);
    gpPEnemyItemsSummaryArray = null;
    gusPEnemyItemsSummaryArraySize = 0;
  }
  if (gpNEnemyItemsSummaryArray) {
    MemFree(gpNEnemyItemsSummaryArray);
    gpNEnemyItemsSummaryArray = null;
    gusNEnemyItemsSummaryArraySize = 0;
  }
  if (gfWorldLoaded) {
    gfConfirmExitFirst = true;
  }
}

function RenderSectorInformation(): void {
  // UINT16 str[ 100 ];
  let m: Pointer<MAPCREATE_STRUCT>;
  let s: Pointer<SUMMARYFILE>;
  let ePoints: UINT8 = 0;
  let usLine: UINT16 = 35;
  let iOverall: INT32;

  SetFont(FONT10ARIAL());
  SetFontShadow(FONT_NEARBLACK);

  s = gpCurrentSectorSummary;
  m = addressof(gpCurrentSectorSummary.value.MapInfo);

  if (m.value.sNorthGridNo != -1)
    ePoints++;
  if (m.value.sEastGridNo != -1)
    ePoints++;
  if (m.value.sSouthGridNo != -1)
    ePoints++;
  if (m.value.sWestGridNo != -1)
    ePoints++;
  if (m.value.sCenterGridNo != -1)
    ePoints++;
  if (m.value.sIsolatedGridNo != -1)
    ePoints++;
  // start at 10,35
  SetFontForeground(FONT_ORANGE);
  mprintf(10, 32, "Tileset:  %s", gTilesets[s.value.ubTilesetID].zName);
  if (m.value.ubMapVersion < 10)
    SetFontForeground(FONT_RED);
  mprintf(10, 42, "Version Info:  Summary:  1.%02d,  Map:  %d.%02d", s.value.ubSummaryVersion, s.value.dMajorMapVersion, m.value.ubMapVersion);
  SetFontForeground(FONT_GRAY2);
  mprintf(10, 55, "Number of items:  %d", s.value.usNumItems);
  mprintf(10, 65, "Number of lights:  %d", s.value.usNumLights);
  mprintf(10, 75, "Number of entry points:  %d", ePoints);
  if (ePoints) {
    let x: INT32;
    x = 140;
    mprintf(x, 75, "(");
    x += StringPixLength("(", FONT10ARIAL()) + 2;
    if (m.value.sNorthGridNo != -1) {
      mprintf(x, 75, "N");
      x += StringPixLength("N", FONT10ARIAL()) + 2;
    }
    if (m.value.sEastGridNo != -1) {
      mprintf(x, 75, "E");
      x += StringPixLength("E", FONT10ARIAL()) + 2;
    }
    if (m.value.sSouthGridNo != -1) {
      mprintf(x, 75, "S");
      x += StringPixLength("S", FONT10ARIAL()) + 2;
    }
    if (m.value.sWestGridNo != -1) {
      mprintf(x, 75, "W");
      x += StringPixLength("W", FONT10ARIAL()) + 2;
    }
    if (m.value.sCenterGridNo != -1) {
      mprintf(x, 75, "C");
      x += StringPixLength("C", FONT10ARIAL()) + 2;
    }
    if (m.value.sIsolatedGridNo != -1) {
      mprintf(x, 75, "I");
      x += StringPixLength("I", FONT10ARIAL()) + 2;
    }
    mprintf(x, 75, ")");
  }
  mprintf(10, 85, "Number of rooms:  %d", s.value.ubNumRooms);
  mprintf(10, 95, "Total map population:  %d", m.value.ubNumIndividuals);
  mprintf(20, 105, "Enemies:  %d", s.value.EnemyTeam.ubTotal);
  mprintf(30, 115, "Admins:  %d", s.value.ubNumAdmins);
  if (s.value.ubNumAdmins)
    mprintf(100, 115, "(%d detailed, %d profile -- %d have priority existance)", s.value.ubAdminDetailed, s.value.ubAdminProfile, s.value.ubAdminExistance);
  mprintf(30, 125, "Troops:  %d", s.value.ubNumTroops);
  if (s.value.ubNumTroops)
    mprintf(100, 125, "(%d detailed, %d profile -- %d have priority existance)", s.value.ubTroopDetailed, s.value.ubTroopProfile, s.value.ubTroopExistance);
  mprintf(30, 135, "Elites:  %d", s.value.ubNumElites);
  if (s.value.ubNumElites)
    mprintf(100, 135, "(%d detailed, %d profile -- %d have priority existance)", s.value.ubEliteDetailed, s.value.ubEliteProfile, s.value.ubEliteExistance);
  mprintf(20, 145, "Civilians:  %d", s.value.CivTeam.ubTotal);
  if (s.value.CivTeam.ubTotal)
    mprintf(100, 145, "(%d detailed, %d profile -- %d have priority existance)", s.value.CivTeam.ubDetailed, s.value.CivTeam.ubProfile, s.value.CivTeam.ubExistance);
  if (s.value.ubSummaryVersion >= 9) {
    mprintf(30, 155, "Humans:  %d", s.value.CivTeam.ubTotal - s.value.ubCivCows - s.value.ubCivBloodcats);
    mprintf(30, 165, "Cows:  %d", s.value.ubCivCows);
    mprintf(30, 175, "Bloodcats:  %d", s.value.ubCivBloodcats);
  }
  mprintf(20, 185, "Creatures:  %d", s.value.CreatureTeam.ubTotal);
  if (s.value.ubSummaryVersion >= 9) {
    mprintf(30, 195, "Monsters:  %d", s.value.CreatureTeam.ubTotal - s.value.CreatureTeam.ubNumAnimals);
    mprintf(30, 205, "Bloodcats:  %d", s.value.CreatureTeam.ubNumAnimals);
  }
  mprintf(10, 215, "Number of locked and/or trapped doors:  %d", s.value.ubNumDoors);
  mprintf(20, 225, "Locked:  %d", s.value.ubNumDoorsLocked);
  mprintf(20, 235, "Trapped:  %d", s.value.ubNumDoorsTrapped);
  mprintf(20, 245, "Locked & Trapped:  %d", s.value.ubNumDoorsLockedAndTrapped);
  if (s.value.ubSummaryVersion >= 8)
    mprintf(10, 255, "Civilians with schedules:  %d", s.value.ubCivSchedules);
  if (s.value.ubSummaryVersion >= 10) {
    if (s.value.fTooManyExitGridDests) {
      SetFontForeground(FONT_RED);
      mprintf(10, 265, "Too many exit grid destinations (more than 4)...");
    } else {
      let i: UINT8;
      let ubNumInvalid: UINT8 = 0;
      for (i = 0; i < 4; i++) {
        if (s.value.fInvalidDest[i])
          ubNumInvalid++;
      }
      if (ubNumInvalid) {
        SetFontForeground(FONT_RED);
        mprintf(10, 265, "ExitGrids:  %d (%d with a long distance destination)", s.value.ubNumExitGridDests, ubNumInvalid);
      } else
        switch (s.value.ubNumExitGridDests) {
          case 0:
            mprintf(10, 265, "ExitGrids:  none");
            break;
          case 1:
            mprintf(10, 265, "ExitGrids:  1 destination using %d exitgrids", s.value.usExitGridSize[0]);
            break;
          case 2:
            mprintf(10, 265, "ExitGrids:  2 -- 1) Qty: %d, 2) Qty: %d", s.value.usExitGridSize[0], s.value.usExitGridSize[1]);
            break;
          case 3:
            mprintf(10, 265, "ExitGrids:  3 -- 1) Qty: %d, 2) Qty: %d, 3) Qty: %d", s.value.usExitGridSize[0], s.value.usExitGridSize[1], s.value.usExitGridSize[2]);
            break;
          case 4:
            mprintf(10, 265, "ExitGrids:  3 -- 1) Qty: %d, 2) Qty: %d, 3) Qty: %d, 4) Qty: %d", s.value.usExitGridSize[0], s.value.usExitGridSize[1], s.value.usExitGridSize[2], s.value.usExitGridSize[3]);
            break;
        }
    }
  }
  iOverall = -(2 * s.value.EnemyTeam.ubBadA) - s.value.EnemyTeam.ubPoorA + s.value.EnemyTeam.ubGoodA + (2 * s.value.EnemyTeam.ubGreatA);
  usLine = 275;
  mprintf(10, usLine, "Enemy Relative Attributes:  %d bad, %d poor, %d norm, %d good, %d great (%+d Overall)", s.value.EnemyTeam.ubBadA, s.value.EnemyTeam.ubPoorA, s.value.EnemyTeam.ubAvgA, s.value.EnemyTeam.ubGoodA, s.value.EnemyTeam.ubGreatA, iOverall);
  iOverall = -(2 * s.value.EnemyTeam.ubBadE) - s.value.EnemyTeam.ubPoorE + s.value.EnemyTeam.ubGoodE + (2 * s.value.EnemyTeam.ubGreatE);
  usLine += 10;
  mprintf(10, usLine, "Enemy Relative Equipment:  %d bad, %d poor, %d norm, %d good, %d great (%+d Overall)", s.value.EnemyTeam.ubBadE, s.value.EnemyTeam.ubPoorE, s.value.EnemyTeam.ubAvgE, s.value.EnemyTeam.ubGoodE, s.value.EnemyTeam.ubGreatE, iOverall);
  usLine += 10;
  if (s.value.ubSummaryVersion >= 11) {
    if (s.value.ubEnemiesReqWaypoints) {
      SetFontForeground(FONT_RED);
      mprintf(10, usLine, "%d placements have patrol orders without any waypoints defined.", s.value.ubEnemiesReqWaypoints);
      usLine += 10;
    }
  }
  if (s.value.ubSummaryVersion >= 13) {
    if (s.value.ubEnemiesHaveWaypoints) {
      SetFontForeground(FONT_RED);
      mprintf(10, usLine, "%d placements have waypoints, but without any patrol orders.", s.value.ubEnemiesHaveWaypoints);
      usLine += 10;
    }
  }
  if (s.value.ubSummaryVersion >= 12) {
    if (s.value.usWarningRoomNums) {
      SetFontForeground(FONT_RED);
      mprintf(10, usLine, "%d gridnos have questionable room numbers.  Please validate.", s.value.usWarningRoomNums);
    }
  }
}

// 2)  CODE TRIGGER/ACTION NAMES
function RenderItemDetails(): void {
  let dAvgExistChance: FLOAT;
  let dAvgStatus: FLOAT;
  let pItem: Pointer<OBJECTTYPE>;
  let index: INT32;
  let i: INT32;
  let str: string /* UINT16[100] */;
  let uiQuantity: UINT32;
  let uiExistChance: UINT32;
  let uiStatus: UINT32;
  let uiTriggerQuantity: UINT32[] /* [8] */;
  let uiActionQuantity: UINT32[] /* [8] */;
  let uiTriggerExistChance: UINT32[] /* [8] */;
  let uiActionExistChance: UINT32[] /* [8] */;
  let xp: UINT32;
  let yp: UINT32;
  let bFreqIndex: INT8;
  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_GRAY2);
  SetFontShadow(FONT_NEARBLACK);
  mprintf(364, 49, "R");
  mprintf(390, 49, "S");
  mprintf(364, 62, "Enemy");
  yp = 20;
  xp = 5;
  if (gubSummaryItemMode != Enum56.ITEMMODE_ENEMY && gpWorldItemsSummaryArray) {
    memset(uiTriggerQuantity, 0, 32);
    memset(uiActionQuantity, 0, 32);
    memset(uiTriggerExistChance, 0, 32);
    memset(uiActionExistChance, 0, 32);
    for (index = 1; index < Enum225.MAXITEMS; index++) {
      uiQuantity = 0;
      uiExistChance = 0;
      uiStatus = 0;
      for (i = 0; i < gusWorldItemsSummaryArraySize; i++) {
        if (index == Enum225.SWITCH || index == Enum225.ACTION_ITEM) {
          if (gpWorldItemsSummaryArray[i].o.usItem == index) {
            if (gubSummaryItemMode == Enum56.ITEMMODE_SCIFI && !(gpWorldItemsSummaryArray[i].usFlags & WORLD_ITEM_REALISTIC_ONLY) || gubSummaryItemMode == Enum56.ITEMMODE_REAL && !(gpWorldItemsSummaryArray[i].usFlags & WORLD_ITEM_SCIFI_ONLY)) {
              pItem = addressof(gpWorldItemsSummaryArray[i].o);
              if (!pItem.value.bFrequency)
                bFreqIndex = 7;
              else if (pItem.value.bFrequency == PANIC_FREQUENCY)
                bFreqIndex = 0;
              else if (pItem.value.bFrequency == PANIC_FREQUENCY_2)
                bFreqIndex = 1;
              else if (pItem.value.bFrequency == PANIC_FREQUENCY_3)
                bFreqIndex = 2;
              else if (pItem.value.bFrequency == FIRST_MAP_PLACED_FREQUENCY + 1)
                bFreqIndex = 3;
              else if (pItem.value.bFrequency == FIRST_MAP_PLACED_FREQUENCY + 2)
                bFreqIndex = 4;
              else if (pItem.value.bFrequency == FIRST_MAP_PLACED_FREQUENCY + 3)
                bFreqIndex = 5;
              else if (pItem.value.bFrequency == FIRST_MAP_PLACED_FREQUENCY + 4)
                bFreqIndex = 6;
              else
                continue;
              if (index == Enum225.SWITCH) {
                uiTriggerQuantity[bFreqIndex]++;
                uiTriggerExistChance[bFreqIndex] += 100 - gpWorldItemsSummaryArray[i].ubNonExistChance;
              } else {
                uiActionQuantity[bFreqIndex]++;
                uiActionExistChance[bFreqIndex] += 100 - gpWorldItemsSummaryArray[i].ubNonExistChance;
              }
            }
          }
          continue;
        }
        if (gpWorldItemsSummaryArray[i].o.usItem == index) {
          if (gubSummaryItemMode == Enum56.ITEMMODE_SCIFI && !(gpWorldItemsSummaryArray[i].usFlags & WORLD_ITEM_REALISTIC_ONLY) || gubSummaryItemMode == Enum56.ITEMMODE_REAL && !(gpWorldItemsSummaryArray[i].usFlags & WORLD_ITEM_SCIFI_ONLY)) {
            pItem = addressof(gpWorldItemsSummaryArray[i].o);
            uiExistChance += (100 - gpWorldItemsSummaryArray[i].ubNonExistChance) * pItem.value.ubNumberOfObjects;
            uiStatus += pItem.value.bStatus[0];
            uiQuantity += pItem.value.ubNumberOfObjects;
          }
        }
      }
      if (uiQuantity) {
        if (!(yp % 20))
          SetFontForeground(FONT_LTKHAKI);
        else
          SetFontForeground(FONT_GRAY2);
        // calc averages
        dAvgExistChance = (uiExistChance / 100.0);
        dAvgStatus = uiStatus / uiQuantity;
        // Display stats.
        str = LoadShortNameItemInfo(index);
        mprintf(xp, yp, "%s", str);
        mprintf(xp + 85, yp, "%3.02f", dAvgExistChance);
        mprintf(xp + 110, yp, "@ %3.02f%%", dAvgStatus);
        yp += 10;
        if (yp >= 355) {
          xp += 170;
          yp = 20;
          if (xp >= 300) {
            SetFontForeground(FONT_RED);
            mprintf(350, 350, "TOO MANY ITEMS TO DISPLAY!");
            return;
          }
        }
      }
    }
    // Now list the number of actions/triggers of each type
    for (i = 0; i < 8; i++) {
      if (uiTriggerQuantity[i] || uiActionQuantity[i]) {
        if (i == 7)
          SetFontForeground(FONT_DKYELLOW);
        else if (!uiTriggerQuantity[i] || !uiActionQuantity[i])
          SetFontForeground(FONT_RED);
        else
          SetFontForeground(77);
        switch (i) {
          case 0:
            str = "Panic1";
            break;
          case 1:
            str = "Panic2";
            break;
          case 2:
            str = "Panic3";
            break;
          case 3:
            str = "Norm1";
            break;
          case 4:
            str = "Norm2";
            break;
          case 5:
            str = "Norm3";
            break;
          case 6:
            str = "Norm4";
            break;
          case 7:
            str = "Pressure Actions";
            break;
        }
        if (i < 7) {
          dAvgExistChance = (uiTriggerExistChance[i] / 100.0);
          dAvgStatus = (uiActionExistChance[i] / 100.0);
          mprintf(xp, yp, "%s:  %3.02f trigger(s), %3.02f action(s)", str, dAvgExistChance, dAvgStatus);
        } else {
          dAvgExistChance = (uiActionExistChance[i] / 100.0);
          mprintf(xp, yp, "%s:  %3.02f", str, dAvgExistChance);
        }
        yp += 10;
        if (yp >= 355) {
          xp += 170;
          yp = 20;
          if (xp >= 300) {
            SetFontForeground(FONT_RED);
            mprintf(350, 350, "TOO MANY ITEMS TO DISPLAY!");
            return;
          }
        }
      }
    }
  } else if (gubSummaryItemMode == Enum56.ITEMMODE_ENEMY) {
    SetFontForeground(FONT_YELLOW);
    mprintf(xp, yp, "PRIORITY ENEMY DROPPED ITEMS");
    yp += 10;

    // Do the priority existance guys first
    if (!gpPEnemyItemsSummaryArray) {
      SetFontForeground(FONT_DKYELLOW);
      mprintf(xp, yp, "None");
      yp += 10;
    } else
      for (index = 1; index < Enum225.MAXITEMS; index++) {
        uiQuantity = 0;
        uiExistChance = 0;
        uiStatus = 0;
        for (i = 0; i < gusPEnemyItemsSummaryArraySize; i++) {
          if (gpPEnemyItemsSummaryArray[i].usItem == index) {
            pItem = addressof(gpPEnemyItemsSummaryArray[i]);
            uiExistChance += 100 * pItem.value.ubNumberOfObjects;
            uiStatus += pItem.value.bStatus[0];
            uiQuantity += pItem.value.ubNumberOfObjects;
          }
        }
        if (uiQuantity) {
          if (!(yp % 20))
            SetFontForeground(FONT_LTKHAKI);
          else
            SetFontForeground(FONT_GRAY2);
          // calc averages
          dAvgExistChance = (uiExistChance / 100.0);
          dAvgStatus = uiStatus / uiQuantity;
          // Display stats.
          str = LoadShortNameItemInfo(index);
          mprintf(xp, yp, "%s", str);
          mprintf(xp + 85, yp, "%3.02f", dAvgExistChance);
          mprintf(xp + 110, yp, "@ %3.02f%%", dAvgStatus);
          yp += 10;
          if (yp >= 355) {
            xp += 170;
            yp = 20;
            if (xp >= 300) {
              SetFontForeground(FONT_RED);
              mprintf(350, 350, "TOO MANY ITEMS TO DISPLAY!");
              return;
            }
          }
        }
      }

    yp += 5;

    SetFontForeground(FONT_YELLOW);
    mprintf(xp, yp, "NORMAL ENEMY DROPPED ITEMS");
    yp += 10;
    if (yp >= 355) {
      xp += 170;
      yp = 20;
      if (xp >= 300) {
        SetFontForeground(FONT_RED);
        mprintf(350, 350, "TOO MANY ITEMS TO DISPLAY!");
        return;
      }
    }

    // Do the priority existance guys first
    if (!gpNEnemyItemsSummaryArray) {
      SetFontForeground(FONT_DKYELLOW);
      mprintf(xp, yp, "None");
      yp += 10;
    }
    for (index = 1; index < Enum225.MAXITEMS; index++) {
      uiQuantity = 0;
      uiExistChance = 0;
      uiStatus = 0;
      for (i = 0; i < gusNEnemyItemsSummaryArraySize; i++) {
        if (gpNEnemyItemsSummaryArray[i].usItem == index) {
          pItem = addressof(gpNEnemyItemsSummaryArray[i]);
          uiExistChance += 100 * pItem.value.ubNumberOfObjects;
          uiStatus += pItem.value.bStatus[0];
          uiQuantity += pItem.value.ubNumberOfObjects;
        }
      }
      if (uiQuantity) {
        if (!(yp % 20))
          SetFontForeground(FONT_LTKHAKI);
        else
          SetFontForeground(FONT_GRAY2);
        // calc averages
        dAvgExistChance = (uiExistChance / 100.0);
        dAvgStatus = uiStatus / uiQuantity;
        // Display stats.
        str = LoadShortNameItemInfo(index);
        mprintf(xp, yp, "%s", str);
        mprintf(xp + 85, yp, "%3.02f", dAvgExistChance);
        mprintf(xp + 110, yp, "@ %3.02f%%", dAvgStatus);
        yp += 10;
        if (yp >= 355) {
          xp += 170;
          yp = 20;
          if (xp >= 300) {
            SetFontForeground(FONT_RED);
            mprintf(350, 350, "TOO MANY ITEMS TO DISPLAY!");
            return;
          }
        }
      }
    }
  } else {
    SetFontForeground(FONT_RED);
    mprintf(5, 50, "ERROR:  Can't load the items for this map.  Reason unknown.");
  }
}

export function RenderSummaryWindow(): void {
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let ClipRect: SGPRect = createSGPRect();
  let i: INT32;
  let x: INT32;
  let y: INT32;
  if ((GetActiveFieldID() == 1) != gfTempFile) {
    gfTempFile ^= 1;
    SetInputFieldStringWith16BitString(1, "");
    gfRenderSummary = true;
  }
  if (gfTempFile) // constantly extract the temp filename for updating purposes.
    ExtractTempFilename();
  if (gfRenderSummary) {
    gfRenderSummary = false;
    gfRenderMap = true;
    for (i = 1; i < Enum58.NUM_SUMMARY_BUTTONS; i++) {
      MarkAButtonDirty(iSummaryButton[i]);
    }

    DrawButton(iSummaryButton[Enum58.SUMMARY_BACKGROUND]);
    InvalidateRegion(0, 0, 640, 360);

    SetFont(BLOCKFONT2());
    SetFontForeground(FONT_LTKHAKI);
    SetFontShadow(FONT_DKKHAKI);
    SetFontBackground(0);
    if (!gfItemDetailsMode) {
      mprintf(10, 5, "CAMPAIGN EDITOR -- %s Version 1.%02d", gszVersionType[GLOBAL_SUMMARY_STATE], GLOBAL_SUMMARY_VERSION);
    }

    // This section builds the proper header to be displayed for an existing global summary.
    if (!gfWorldLoaded) {
      SetFontForeground(FONT_RED);
      SetFontShadow(FONT_NEARBLACK);
      mprintf(270, 5, "(NO MAP LOADED).");
    }
    SetFont(FONT10ARIAL());
    SetFontShadow(FONT_NEARBLACK);
    if (gfGlobalSummaryExists) {
      let str: string /* UINT16[100] */;
      let fSectorSummaryExists: boolean = false;
      if (gusNumEntriesWithOutdatedOrNoSummaryInfo && !gfOutdatedDenied) {
        DisableButton(iSummaryButton[Enum58.SUMMARY_LOAD]);
        SetFontForeground(FONT_YELLOW);
        mprintf(10, 20, "You currently have %d outdated maps.", gusNumEntriesWithOutdatedOrNoSummaryInfo);
        mprintf(10, 30, "The more maps that need to be updated, the longer it takes.  It'll take ");
        mprintf(10, 40, "approximately 4 minutes on a P200MMX to analyse 100 maps, so");
        mprintf(10, 50, "depending on your computer, it may vary.");
        SetFontForeground(FONT_LTRED);
        mprintf(10, 65, "Do you wish to regenerate info for ALL these maps at this time (y/n)?");
      } else if (!gsSelSectorX && !gsSectorX || gfTempFile) {
        DisableButton(iSummaryButton[Enum58.SUMMARY_LOAD]);
        SetFontForeground(FONT_LTRED);
        mprintf(10, 20, "There is no sector currently selected.");
        if (gfTempFile) {
          SetFontForeground(FONT_YELLOW);
          mprintf(10, 30, "Entering a temp file name that doesn't follow campaign editor conventions...");
          goto("SPECIALCASE_LABEL"); // OUCH!!!
        } else if (!gfWorldLoaded) {
          SetFontForeground(FONT_YELLOW);
          mprintf(10, 30, "You need to either load an existing map or create a new map before being");
          mprintf(10, 40, "able to enter the editor, or you can quit (ESC or Alt+x).");
        }
      } else {
        // Build sector string
        if (gsSelSectorX)
          x = gsSelSectorX - 1, y = gsSelSectorY - 1;
        else
          x = gsSectorX - 1, y = gsSectorY - 1;
        str = swprintf("%c%d", y + 'A', x + 1);
        gszFilename = str;
        giCurrLevel = giCurrentViewLevel;
        switch (giCurrentViewLevel) {
          case ALL_LEVELS_MASK:
            // search for the highest level
            fSectorSummaryExists = true;
            if (gbSectorLevels[x][y] & GROUND_LEVEL_MASK)
              giCurrLevel = GROUND_LEVEL_MASK;
            else if (gbSectorLevels[x][y] & BASEMENT1_LEVEL_MASK)
              giCurrLevel = BASEMENT1_LEVEL_MASK;
            else if (gbSectorLevels[x][y] & BASEMENT2_LEVEL_MASK)
              giCurrLevel = BASEMENT2_LEVEL_MASK;
            else if (gbSectorLevels[x][y] & BASEMENT3_LEVEL_MASK)
              giCurrLevel = BASEMENT3_LEVEL_MASK;
            else
              fSectorSummaryExists = false;
            break;
          case ALTERNATE_LEVELS_MASK:
            // search for the highest alternate level
            fSectorSummaryExists = true;
            if (gbSectorLevels[x][y] & ALTERNATE_GROUND_MASK)
              giCurrLevel = ALTERNATE_GROUND_MASK;
            else if (gbSectorLevels[x][y] & ALTERNATE_B1_MASK)
              giCurrLevel = ALTERNATE_B1_MASK;
            else if (gbSectorLevels[x][y] & ALTERNATE_B2_MASK)
              giCurrLevel = ALTERNATE_B2_MASK;
            else if (gbSectorLevels[x][y] & ALTERNATE_B3_MASK)
              giCurrLevel = ALTERNATE_B3_MASK;
            else
              fSectorSummaryExists = false;
            break;
          case GROUND_LEVEL_MASK:
            if (gbSectorLevels[x][y] & GROUND_LEVEL_MASK)
              fSectorSummaryExists = true;
            break;
          case BASEMENT1_LEVEL_MASK:
            if (gbSectorLevels[x][y] & BASEMENT1_LEVEL_MASK)
              fSectorSummaryExists = true;
            break;
          case BASEMENT2_LEVEL_MASK:
            if (gbSectorLevels[x][y] & BASEMENT2_LEVEL_MASK)
              fSectorSummaryExists = true;
            break;
          case BASEMENT3_LEVEL_MASK:
            if (gbSectorLevels[x][y] & BASEMENT3_LEVEL_MASK)
              fSectorSummaryExists = true;
            break;
          case ALTERNATE_GROUND_MASK:
            if (gbSectorLevels[x][y] & ALTERNATE_GROUND_MASK)
              fSectorSummaryExists = true;
            break;
          case ALTERNATE_B1_MASK:
            if (gbSectorLevels[x][y] & ALTERNATE_B1_MASK)
              fSectorSummaryExists = true;
            break;
          case ALTERNATE_B2_MASK:
            if (gbSectorLevels[x][y] & ALTERNATE_B2_MASK)
              fSectorSummaryExists = true;
            break;
          case ALTERNATE_B3_MASK:
            if (gbSectorLevels[x][y] & ALTERNATE_B3_MASK)
              fSectorSummaryExists = true;
            break;
        }
        if (gbSectorLevels[x][y]) {
          switch (giCurrLevel) {
            case GROUND_LEVEL_MASK:
              giCurrLevel = 0;
              str += ", ground level";
              gpCurrentSectorSummary = gpSectorSummary[x][y][0];
              break;
            case BASEMENT1_LEVEL_MASK:
              giCurrLevel = 1;
              str += ", underground level 1";
              gpCurrentSectorSummary = gpSectorSummary[x][y][1];
              break;
            case BASEMENT2_LEVEL_MASK:
              giCurrLevel = 2;
              str += ", underground level 2";
              gpCurrentSectorSummary = gpSectorSummary[x][y][2];
              break;
            case BASEMENT3_LEVEL_MASK:
              giCurrLevel = 3;
              str += ", underground level 3";
              gpCurrentSectorSummary = gpSectorSummary[x][y][3];
              break;
            case ALTERNATE_GROUND_MASK:
              giCurrLevel = 4;
              str += ", alternate G level";
              gpCurrentSectorSummary = gpSectorSummary[x][y][4];
              break;
            case ALTERNATE_B1_MASK:
              giCurrLevel = 5;
              str += ", alternate B1 level";
              gpCurrentSectorSummary = gpSectorSummary[x][y][5];
              break;
            case ALTERNATE_B2_MASK:
              giCurrLevel = 6;
              str += ", alternate B2 level";
              gpCurrentSectorSummary = gpSectorSummary[x][y][6];
              break;
            case ALTERNATE_B3_MASK:
              giCurrLevel = 7;
              str += ", alternate B3 level";
              gpCurrentSectorSummary = gpSectorSummary[x][y][7];
              break;
          }
        } else {
          DisableButton(iSummaryButton[Enum58.SUMMARY_LOAD]);
        }
        if (fSectorSummaryExists) {
          switch (giCurrLevel) {
            case 0:
              gszFilename += ".dat";
              break;
            case 1:
              gszFilename += "_b1.dat";
              break;
            case 2:
              gszFilename += "_b2.dat";
              break;
            case 3:
              gszFilename += "_b3.dat";
              break;
            case 4:
              gszFilename += "_a.dat";
              break;
            case 5:
              gszFilename += "_b1_a.dat";
              break;
            case 6:
              gszFilename += "_b2_a.dat";
              break;
            case 7:
              gszFilename += "_b3_a.dat";
              break;
          }
          gszDisplayName = gszFilename;
          EnableButton(iSummaryButton[Enum58.SUMMARY_LOAD]);
          if (gpCurrentSectorSummary) {
            if (gpCurrentSectorSummary.value.ubSummaryVersion < GLOBAL_SUMMARY_VERSION)
              ShowButton(iSummaryButton[Enum58.SUMMARY_UPDATE]);
            else
              HideButton(iSummaryButton[Enum58.SUMMARY_UPDATE]);
            if (!gfAlternateMaps)
              SetFontForeground(FONT_YELLOW);
            else
              SetFontForeground(FONT_LTBLUE);
            if (gfItemDetailsMode) {
              if (gfSetupItemDetailsMode) {
                SetupItemDetailsMode(true);
                gfSetupItemDetailsMode = false;
              }
              mprintf(10, 5, "ITEM DETAILS -- sector %s", str);
              RenderItemDetails();
            } else {
              mprintf(10, 20, "Summary Information for sector %s:", str);
              HideButton(iSummaryButton[Enum58.SUMMARY_REAL]);
              HideButton(iSummaryButton[Enum58.SUMMARY_SCIFI]);
              HideButton(iSummaryButton[Enum58.SUMMARY_ENEMY]);
              RenderSectorInformation();
            }
          } else {
            SetFontForeground(FONT_RED);
            if (gfItemDetailsMode) {
              mprintf(10, 5, "Summary Information for sector %s", str);
              mprintf(10, 15, "does not exist.");
            } else {
              mprintf(10, 20, "Summary Information for sector %s", str);
              mprintf(10, 30, "does not exist.");
            }
            ShowButton(iSummaryButton[Enum58.SUMMARY_UPDATE]);
          }
        } else {
          if (!gfAlternateMaps)
            SetFontForeground(FONT_ORANGE);
          else {
            SetFontForeground(FONT_DKBLUE);
            SetFontShadow(0);
          }
          if (gfItemDetailsMode)
            mprintf(10, 5, "No information exists for sector %s.", str);
          else
            mprintf(10, 20, "No information exists for sector %s.", str);
          SetFontShadow(FONT_NEARBLACK);

          switch (giCurrentViewLevel) {
            case ALL_LEVELS_MASK:
            case GROUND_LEVEL_MASK:
              gszFilename += ".dat";
              break;
            case BASEMENT1_LEVEL_MASK:
              gszFilename += "_b1.dat";
              break;
            case BASEMENT2_LEVEL_MASK:
              gszFilename += "_b2.dat";
              break;
            case BASEMENT3_LEVEL_MASK:
              gszFilename += "_b3.dat";
              break;
            case ALTERNATE_LEVELS_MASK:
            case ALTERNATE_GROUND_MASK:
              gszFilename += "_a.dat";
              break;
            case ALTERNATE_B1_MASK:
              gszFilename += "_b1_a.dat";
              break;
            case ALTERNATE_B2_MASK:
              gszFilename += "_b2_a.dat";
              break;
            case ALTERNATE_B3_MASK:
              gszFilename += "_b3_a.dat";
              break;
          }
          gszDisplayName = gszFilename;
          DisableButton(iSummaryButton[Enum58.SUMMARY_LOAD]);
        }
      SPECIALCASE_LABEL:
        if (gfOverrideDirty && gfPersistantSummary)
          CalculateOverrideStatus();
        if (gubOverrideStatus == Enum57.INACTIVE) {
          if (!gfAlternateMaps)
            SetFontForeground(FONT_LTKHAKI);
          else
            SetFontForeground(FONT_LTBLUE);
          mprintf(MAP_LEFT + 110, MAP_BOTTOM + 55, "FILE:  %s", gszDisplayName);
        } else // little higher to make room for the override checkbox and text.
        {
          if (!gfAlternateMaps)
            SetFontForeground(FONT_LTKHAKI);
          else
            SetFontForeground(FONT_LTBLUE);
          mprintf(MAP_LEFT + 110, MAP_BOTTOM + 46, "FILE:  %s", gszDisplayName);
          if (gubOverrideStatus == Enum57.READONLY) {
            SetFontForeground((gfOverride ? FONT_YELLOW : FONT_LTRED));
            mprintf(MAP_LEFT + 124, MAP_BOTTOM + 61, "Override READONLY");
          } else {
            SetFontForeground((gfOverride ? FONT_YELLOW : FONT_ORANGE));
            mprintf(MAP_LEFT + 124, MAP_BOTTOM + 61, "Overwrite File");
          }
        }
      }
    } else if (!gfDeniedSummaryCreation) {
      SetFontForeground(FONT_GRAY1);
      mprintf(10, 20, "You currently have no summary data.  By creating one, you will be able to keep track");
      mprintf(10, 30, "of information pertaining to all of the sectors you edit and save.  The creation process");
      mprintf(10, 40, "will analyse all maps in your \\MAPS directory, and generate a new one.  This could");
      mprintf(10, 50, "take a few minutes depending on how many valid maps you have.  Valid maps are");
      mprintf(10, 60, "maps following the proper naming convention from a1.dat - p16.dat.  Underground maps");
      mprintf(10, 70, "are signified by appending _b1 to _b3 before the .dat (ex:  a9_b1.dat). ");
      SetFontForeground(FONT_LTRED);
      mprintf(10, 85, "Do you wish to do this now (y/n)?");
    } else {
      SetFontForeground(FONT_LTRED);
      mprintf(10, 20, "No summary info.  Creation denied.");
    }

    SetFont(FONT10ARIAL());
    SetFontForeground(FONT_GRAY3);
    mprintf(MAP_LEFT + 15, MAP_BOTTOM + 7, "Grid");
    mprintf(MAP_LEFT + 65, MAP_BOTTOM + 7, "Progress");
    mprintf(MAP_LEFT + 15, MAP_BOTTOM + 27, "Use Alternate Maps");
    // Draw the mode tabs
    SetFontForeground(FONT_YELLOW);
    mprintf(354, 18, "Summary");
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
    RectangleDraw(true, 350, 15, 405, 28, 0, pDestBuf);
    UnLockVideoSurface(FRAME_BUFFER);
    ShadowVideoSurfaceRectUsingLowPercentTable(FRAME_BUFFER, 351, 16, 404, 27);
    if (gpCurrentSectorSummary)
    /*&& gpCurrentSectorSummary->usNumItems ||
            gpPEnemyItemsSummaryArray && gusPEnemyItemsSummaryArraySize ||
            gpNEnemyItemsSummaryArray && gusNEnemyItemsSummaryArraySize )*/
    {
      SetFontForeground(FONT_YELLOW);
    } else {
      SetFontForeground(FONT_RED);
    }
    mprintf(354, 33, "Items");
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
    RectangleDraw(true, 350, 30, 405, 43, 0, pDestBuf);
    UnLockVideoSurface(FRAME_BUFFER);
    if (gpCurrentSectorSummary)
    /*&& gpCurrentSectorSummary->usNumItems ||
            gpPEnemyItemsSummaryArray && gusPEnemyItemsSummaryArraySize ||
            gpNEnemyItemsSummaryArray && gusNEnemyItemsSummaryArraySize )
            */
    {
      ShadowVideoSurfaceRectUsingLowPercentTable(FRAME_BUFFER, 351, 31, 404, 42);
    } else {
      ShadowVideoSurfaceRect(FRAME_BUFFER, 351, 31, 404, 42);
    }
    SetFontForeground(FONT_GRAY2);
  }

  RenderButtons();

  if (gfRenderMap) {
    gfRenderMap = false;
    BltVideoObjectFromIndex(FRAME_BUFFER, guiOmertaMap, 0, MAP_LEFT - 2, MAP_TOP - 2, VO_BLT_SRCTRANSPARENCY, null);
    InvalidateRegion(MAP_LEFT - 1, MAP_TOP - 1, MAP_RIGHT + 1, MAP_BOTTOM + 1);
    // Draw the coordinates
    SetFont(SMALLCOMPFONT());
    SetFontForeground(FONT_BLACK);
    for (y = 0; y < 16; y++) {
      mprintf(MAP_LEFT - 8, MAP_TOP + 4 + y * 13, "%c", 65 + y);
    }
    for (x = 1; x <= 16; x++) {
      let str: string /* UINT16[3] */;
      str = swprintf("%d", x);
      mprintf(MAP_LEFT + x * 13 - (13 + StringPixLength(str, SMALLCOMPFONT())) / 2, MAP_TOP - 8, str);
    }
    if (gfRenderGrid) {
      let pos: UINT16;
      pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
      SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
      for (i = 1; i <= 15; i++) {
        // draw vertical lines
        pos = (i * 13 + MAP_LEFT);
        LineDraw(true, pos, MAP_TOP, pos, MAP_BOTTOM - 1, 0, pDestBuf);
        // draw horizontal lines
        pos = (i * 13 + MAP_TOP);
        LineDraw(true, MAP_LEFT, pos, MAP_RIGHT - 1, pos, 0, pDestBuf);
      }
      UnLockVideoSurface(FRAME_BUFFER);
    }
    if (gfRenderProgress) {
      let ubNumUndergroundLevels: UINT8;
      let str: string /* UINT16[2] */;
      for (y = 0; y < 16; y++) {
        ClipRect.iTop = MAP_TOP + y * 13;
        ClipRect.iBottom = ClipRect.iTop + 12;
        for (x = 0; x < 16; x++) {
          if (giCurrentViewLevel == ALL_LEVELS_MASK) {
            ubNumUndergroundLevels = 0;
            if (gbSectorLevels[x][y] & BASEMENT1_LEVEL_MASK)
              ubNumUndergroundLevels++;
            if (gbSectorLevels[x][y] & BASEMENT2_LEVEL_MASK)
              ubNumUndergroundLevels++;
            if (gbSectorLevels[x][y] & BASEMENT3_LEVEL_MASK)
              ubNumUndergroundLevels++;
            if (ubNumUndergroundLevels) {
              // display the number of underground levels.  If there
              // is no ground level, then it'll be shadowed.
              SetFont(SMALLCOMPFONT());
              SetFontForeground(FONT_YELLOW);
              str = swprintf("%d", ubNumUndergroundLevels);
              mprintf(MAP_LEFT + x * 13 + 4, ClipRect.iTop + 4, str);
            }
            if (gbSectorLevels[x][y] & GROUND_LEVEL_MASK) {
              if (!gfItemDetailsMode || !gpSectorSummary[x][y][0] || gpSectorSummary[x][y][0].value.usNumItems)
                continue;
            }
          } else if (giCurrentViewLevel == ALTERNATE_LEVELS_MASK) {
            ubNumUndergroundLevels = 0;
            if (gbSectorLevels[x][y] & ALTERNATE_B1_MASK)
              ubNumUndergroundLevels++;
            if (gbSectorLevels[x][y] & ALTERNATE_B2_MASK)
              ubNumUndergroundLevels++;
            if (gbSectorLevels[x][y] & ALTERNATE_B3_MASK)
              ubNumUndergroundLevels++;
            if (ubNumUndergroundLevels) {
              // display the number of underground levels.  If there
              // is no ground level, then it'll be shadowed.
              SetFont(SMALLCOMPFONT());
              SetFontForeground(FONT_YELLOW);
              str = swprintf("%d", ubNumUndergroundLevels);
              mprintf(MAP_LEFT + x * 13 + 4, ClipRect.iTop + 4, str);
            }
            if (gbSectorLevels[x][y] & ALTERNATE_GROUND_MASK) {
              if (!gfItemDetailsMode || !gpSectorSummary[x][y][4] || gpSectorSummary[x][y][4].value.usNumItems)
                continue;
            }
          } else if (gbSectorLevels[x][y] & giCurrentViewLevel) {
            if (!gfItemDetailsMode || !gpSectorSummary[x][y][giCurrLevel] || gpSectorSummary[x][y][giCurrLevel].value.usNumItems)
              continue;
          }
          ClipRect.iLeft = MAP_LEFT + x * 13;
          ClipRect.iRight = ClipRect.iLeft + 12;
          pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
          Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, addressof(ClipRect));
          if (giCurrentViewLevel == BASEMENT1_LEVEL_MASK || giCurrentViewLevel == BASEMENT2_LEVEL_MASK || giCurrentViewLevel == BASEMENT3_LEVEL_MASK || giCurrentViewLevel == ALTERNATE_B1_MASK || giCurrentViewLevel == ALTERNATE_B2_MASK || giCurrentViewLevel == ALTERNATE_B3_MASK)
            Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, addressof(ClipRect));
          UnLockVideoSurface(FRAME_BUFFER);
        }
      }
    }
  }

  if (gfGlobalSummaryExists) {
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
    // Render the grid for the map currently residing in memory (blue).
    if (gfWorldLoaded && !gfTempFile && gsSectorX) {
      x = MAP_LEFT + (gsSectorX - 1) * 13 + 1;
      y = MAP_TOP + (gsSectorY - 1) * 13 + 1;
      RectangleDraw(true, x, y, x + 11, y + 11, Get16BPPColor(FROMRGB(50, 50, 200)), pDestBuf);
    }

    // Render the grid for the sector currently in focus (red).
    if (gsSelSectorX > 0 && !gfTempFile) {
      x = MAP_LEFT + (gsSelSectorX - 1) * 13;
      y = MAP_TOP + (gsSelSectorY - 1) * 13;
      RectangleDraw(true, x, y, x + 13, y + 13, Get16BPPColor(FROMRGB(200, 50, 50)), pDestBuf);
    }

    // Render the grid for the sector if the mouse is over it (yellow).
    if (gsHiSectorX > 0) {
      x = MAP_LEFT + (gsHiSectorX - 1) * 13 - 1;
      y = MAP_TOP + (gsHiSectorY - 1) * 13 - 1;
      RectangleDraw(true, x, y, x + 15, y + 15, Get16BPPColor(FROMRGB(200, 200, 50)), pDestBuf);
    }
    UnLockVideoSurface(FRAME_BUFFER);
  }
  // Check to see if the user clicked on one of the hot spot mode change areas.
  if (gfLeftButtonState) {
    if (!gfItemDetailsMode) {
      if (gpCurrentSectorSummary)
      /*&& gpCurrentSectorSummary->usNumItems ||
              gpPEnemyItemsSummaryArray && gusPEnemyItemsSummaryArraySize ||
              gpNEnemyItemsSummaryArray && gusNEnemyItemsSummaryArraySize )*/
      {
        if (gusMouseXPos >= 350 && gusMouseYPos >= 30 && gusMouseXPos <= 404 && gusMouseYPos <= 42) {
          gfItemDetailsMode = true;
          gfSetupItemDetailsMode = true;
          gfRenderSummary = true;
        }
      }
    } else if (gfItemDetailsMode && gusMouseXPos >= 350 && gusMouseYPos >= 15 && gusMouseXPos <= 404 && gusMouseYPos <= 27) {
      gfItemDetailsMode = false;
      gfRenderSummary = true;
    }
  }
}

export function UpdateSectorSummary(gszFilename: string /* Pointer<UINT16> */, fUpdate: boolean): void {
  let str: string /* UINT16[50] */;
  let szCoord: string /* UINT8[40] */;
  let ptr: string /* Pointer<UINT16> */;
  let x: INT16;
  let y: INT16;

  gfRenderSummary = true;
  // Extract the sector
  if (gszFilename[2] < '0' || gszFilename[2] > '9')
    x = gszFilename[1] - '0';
  else
    x = (gszFilename[1] - '0') * 10 + gszFilename[2] - '0';
  if (gszFilename[0] >= 'a')
    y = gszFilename[0] - 'a' + 1;
  else
    y = gszFilename[0] - 'A' + 1;
  gfMapFileDirty = false;

  // Validate that the values extracted are in fact a sector
  if (x < 1 || x > 16 || y < 1 || y > 16)
    return;
  gsSectorX = gsSelSectorX = x;
  gsSectorY = gsSelSectorY = y;

  // The idea here is to get a pointer to the filename's period, then
  // focus on the character previous to it.  If it is a 1, 2, or 3, then
  // the filename was in a basement level.  Otherwise, it is a ground level.
  ptr = wcsstr(gszFilename, "_a.dat");
  if (ptr) {
    ptr = wcsstr(gszFilename, "_b");
    if (ptr && ptr[2] >= '1' && ptr[2] <= '3' && ptr[5] == '.') {
      // it's a alternate basement map
      switch (ptr[2]) {
        case '1':
          gsSectorLayer = ALTERNATE_B1_MASK;
          giCurrLevel = 5;
          break;
        case '2':
          gsSectorLayer = ALTERNATE_B2_MASK;
          giCurrLevel = 6;
          break;
        case '3':
          gsSectorLayer = ALTERNATE_B3_MASK;
          giCurrLevel = 7;
          break;
      }
    } else {
      gsSectorLayer = ALTERNATE_GROUND_MASK;
      giCurrLevel = 4;
    }
  } else {
    ptr = wcsstr(gszFilename, "_b");
    if (ptr && ptr[2] >= '1' && ptr[2] <= '3' && ptr[3] == '.') {
      // it's a alternate basement map
      switch (ptr[2]) {
        case '1':
          gsSectorLayer = BASEMENT1_LEVEL_MASK;
          giCurrLevel = 1;
          break;
        case '2':
          gsSectorLayer = BASEMENT2_LEVEL_MASK;
          giCurrLevel = 2;
          break;
        case '3':
          gsSectorLayer = BASEMENT3_LEVEL_MASK;
          giCurrLevel = 3;
          break;
      }
    } else {
      gsSectorLayer = GROUND_LEVEL_MASK;
      giCurrLevel = 0;
    }
  }

  giCurrentViewLevel = gsSectorLayer;
  if (!(gbSectorLevels[gsSectorX - 1][gsSectorY - 1] & gsSectorLayer)) {
    // new sector map saved, so update the global file.
    gbSectorLevels[gsSectorX - 1][gsSectorY - 1] |= gsSectorLayer;
  }

  if (fUpdate) {
    SetFont(FONT10ARIAL());
    SetFontForeground(FONT_LTKHAKI);
    SetFontShadow(FONT_NEARBLACK);
    str = swprintf("Analyzing map:  %s...", gszFilename);

    if (gfSummaryWindowActive) {
      mprintf(MAP_LEFT, MAP_BOTTOM + 100, str);
      InvalidateRegion(MAP_LEFT, MAP_BOTTOM + 100, MAP_LEFT + 150, MAP_BOTTOM + 110);
      CreateProgressBar(0, MAP_LEFT, MAP_BOTTOM + 110, MAP_LEFT + 140, MAP_BOTTOM + 120);
    } else {
      mprintf(320 - StringPixLength(str, FONT10ARIAL()) / 2, 190, str);
      InvalidateRegion(200, 190, 400, 200);
      CreateProgressBar(0, 250, 200, 390, 210);
    }

    szCoord = sprintf("%S", gszFilename);
    if (gsSectorX > 9)
      szCoord[3] = '\0';
    else
      szCoord[2] = '\0';
    gusNumEntriesWithOutdatedOrNoSummaryInfo++;
    EvaluateWorld(szCoord, giCurrLevel);

    RemoveProgressBar(0);
  } else
    gusNumEntriesWithOutdatedOrNoSummaryInfo++;
}

function SummaryOkayCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    DestroySummaryWindow();
  }
}

function SummaryToggleGridCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderGrid = (btn.uiFlags & BUTTON_CLICKED_ON);
    gfRenderMap = true;
  }
}

function SummaryToggleAlternateCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      giCurrentViewLevel <<= 4;
      gfAlternateMaps = true;
    } else {
      giCurrentViewLevel >>= 4;
      gfAlternateMaps = false;
    }
    gfRenderSummary = true;
  }
}

function SummarySciFiCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[iSummaryButton[Enum58.SUMMARY_SCIFI]].uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    ButtonList[iSummaryButton[Enum58.SUMMARY_REAL]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iSummaryButton[Enum58.SUMMARY_REAL]].uiFlags |= BUTTON_DIRTY;
    ButtonList[iSummaryButton[Enum58.SUMMARY_ENEMY]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iSummaryButton[Enum58.SUMMARY_ENEMY]].uiFlags |= BUTTON_DIRTY;
    gubSummaryItemMode = Enum56.ITEMMODE_SCIFI;
    gfRenderSummary = true;
  }
}

function SummaryRealCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[iSummaryButton[Enum58.SUMMARY_SCIFI]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iSummaryButton[Enum58.SUMMARY_SCIFI]].uiFlags |= BUTTON_DIRTY;
    ButtonList[iSummaryButton[Enum58.SUMMARY_REAL]].uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    ButtonList[iSummaryButton[Enum58.SUMMARY_ENEMY]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iSummaryButton[Enum58.SUMMARY_ENEMY]].uiFlags |= BUTTON_DIRTY;
    gubSummaryItemMode = Enum56.ITEMMODE_REAL;
    gfRenderSummary = true;
  }
}

function SummaryEnemyCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[iSummaryButton[Enum58.SUMMARY_SCIFI]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iSummaryButton[Enum58.SUMMARY_SCIFI]].uiFlags |= BUTTON_DIRTY;
    ButtonList[iSummaryButton[Enum58.SUMMARY_REAL]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iSummaryButton[Enum58.SUMMARY_REAL]].uiFlags |= BUTTON_DIRTY;
    ButtonList[iSummaryButton[Enum58.SUMMARY_ENEMY]].uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    gubSummaryItemMode = Enum56.ITEMMODE_ENEMY;
    gfRenderSummary = true;
  }
}

function SummaryToggleProgressCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderProgress = (btn.uiFlags & BUTTON_CLICKED_ON);
    gfRenderMap = true;
  }
}

function PerformTest(): void {
}

export function HandleSummaryInput(pEvent: Pointer<InputAtom>): boolean {
  if (!gfSummaryWindowActive)
    return false;
  gfCtrlPressed = pEvent.value.usKeyState & CTRL_DOWN;
  if (!HandleTextInput(pEvent) && pEvent.value.usEvent == KEY_DOWN || pEvent.value.usEvent == KEY_REPEAT) {
    let x: INT32;
    switch (pEvent.value.usParam) {
      case ESC:
        if (!gfWorldLoaded) {
          DestroySummaryWindow();
          pEvent.value.usParam = 'x';
          pEvent.value.usKeyState |= ALT_DOWN;
          gfOverheadMapDirty = true;
          return false;
        }
      case ENTER:
        if (GetActiveFieldID() == 1)
          SelectNextField();
        else if (gfWorldLoaded)
          DestroySummaryWindow();
        break;
      case F6:
        PerformTest();
        break;
      case F7:
        for (x = 0; x < 10; x++)
          PerformTest();
        break;
      case F8:
        for (x = 0; x < 100; x++)
          PerformTest();
        break;
      case 'y':
      case 'Y':
        if (gusNumEntriesWithOutdatedOrNoSummaryInfo && !gfOutdatedDenied) {
          gfRenderSummary = true;
          RegenerateSummaryInfoForAllOutdatedMaps();
        }
        if (!gfGlobalSummaryExists && !gfDeniedSummaryCreation) {
          gfGlobalSummaryExists = true;
          CreateGlobalSummary();
          gfRenderSummary = true;
        }
        break;
      case 'n':
      case 'N':
        if (gusNumEntriesWithOutdatedOrNoSummaryInfo && !gfOutdatedDenied) {
          gfOutdatedDenied = true;
          gfRenderSummary = true;
        }
        if (!gfGlobalSummaryExists && !gfDeniedSummaryCreation) {
          gfDeniedSummaryCreation = true;
          gfRenderSummary = true;
        }
        break;
      case 'x':
        if (pEvent.value.usKeyState & ALT_DOWN) {
          DestroySummaryWindow();
          return false;
        }
        break;
      case RIGHTARROW:
        gfRenderSummary = true;
        if (!gsSelSectorY)
          gsSelSectorY = 1;
        gsSelSectorX++;
        if (gsSelSectorX > 16)
          gsSelSectorX = 1;
        break;
      case LEFTARROW:
        gfRenderSummary = true;
        if (!gsSelSectorY)
          gsSelSectorY = 1;
        gsSelSectorX--;
        if (gsSelSectorX < 1)
          gsSelSectorX = 16;
        break;
      case UPARROW:
        gfRenderSummary = true;
        if (!gsSelSectorX)
          gsSelSectorX = 1;
        gsSelSectorY--;
        if (gsSelSectorY < 1)
          gsSelSectorY = 16;
        break;
      case DNARROW:
        gfRenderSummary = true;
        if (!gsSelSectorX)
          gsSelSectorX = 1;
        gsSelSectorY++;
        if (gsSelSectorY > 16)
          gsSelSectorY = 1;
        break;
      case SHIFT_LEFTARROW:

        break;
      case SHIFT_RIGHTARROW:

        break;
    }
  } else if (pEvent.value.usEvent == KEY_UP) {
    // for releasing modes requiring persistant state keys
    switch (pEvent.value.usParam) {
      case F5:
        ReleaseSummaryWindow();
        break;
    }
  }
  return true;
}

function CreateGlobalSummary(): void {
  let fp: Pointer<FILE>;
  let Dir: string /* STRING512 */;
  let ExecDir: string /* STRING512 */;

  OutputDebugString("Generating GlobalSummary Information...\n");

  gfGlobalSummaryExists = false;
  // Set current directory to JA2\DevInfo which contains all of the summary data
  GetExecutableDirectory(ExecDir);
  Dir = sprintf("%s\\DevInfo", ExecDir);

  // Directory doesn't exist, so create it, and continue.
  if (!MakeFileManDirectory(Dir))
    AssertMsg(0, "Can't create new directory, JA2\\DevInfo for summary information.");
  if (!SetFileManCurrentDirectory(Dir))
    AssertMsg(0, "Can't set to new directory, JA2\\DevInfo for summary information.");
  // Generate a simple readme file.
  fp = fopen("readme.txt", "w");
  Assert(fp);
  fprintf(fp, "%s\n%s\n", "This information is used in conjunction with the editor.", "This directory or it's contents shouldn't be included with final release.");
  fclose(fp);

  Dir = sprintf("%s\\Data", ExecDir);
  SetFileManCurrentDirectory(Dir);

  LoadGlobalSummary();
  RegenerateSummaryInfoForAllOutdatedMaps();
  gfRenderSummary = true;

  OutputDebugString("GlobalSummary Information generated successfully.\n");
}

function MapMoveCallback(reg: MOUSE_REGION, reason: INT32): void {
  /* static */ let gsPrevX: INT16 = 0;
  /* static */ let gsPrevY: INT16 = 0;
  // calc current sector highlighted.
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gsPrevX = gsHiSectorX = 0;
    gsPrevY = gsHiSectorY = 0;
    gfRenderMap = true;
    return;
  }
  gsHiSectorX = Math.min((reg.RelativeXPos / 13) + 1, 16);
  gsHiSectorY = Math.min((reg.RelativeYPos / 13) + 1, 16);
  if (gsPrevX != gsHiSectorX || gsPrevY != gsHiSectorY) {
    gsPrevX = gsHiSectorX;
    gsPrevY = gsHiSectorY;
    gfRenderMap = true;
  }
}

function MapClickCallback(reg: MOUSE_REGION, reason: INT32): void {
  /* static */ let sLastX: INT16 = -1;
  /* static */ let sLastY: INT16 = -1;
  /* static */ let iLastClickTime: INT32 = 0;
  // calc current sector selected.
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (GetActiveFieldID() == 1) {
      gsSelSectorX = 0;
      SelectNextField();
    }
    gsSelSectorX = Math.min((reg.RelativeXPos / 13) + 1, 16);
    gsSelSectorY = Math.min((reg.RelativeYPos / 13) + 1, 16);
    if (gsSelSectorX != sLastX || gsSelSectorY != sLastY) {
      // clicked in a new sector
      gfOverrideDirty = true;
      sLastX = gsSelSectorX;
      sLastY = gsSelSectorY;
      iLastClickTime = GetJA2Clock();
      switch (giCurrentViewLevel) {
        case ALL_LEVELS_MASK:
          if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][0])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][0];
          else if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][1])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][1];
          else if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][2])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][2];
          else if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][3])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][3];
          else
            gpCurrentSectorSummary = null;
          break;
        case GROUND_LEVEL_MASK: // already pointing to the correct level
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][0];
          break;
        case BASEMENT1_LEVEL_MASK:
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][1];
          break;
        case BASEMENT2_LEVEL_MASK:
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][2];
          break;
        case BASEMENT3_LEVEL_MASK:
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][3];
          break;
        case ALTERNATE_LEVELS_MASK:
          if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][4])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][4];
          else if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][5])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][5];
          else if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][6])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][6];
          else if (gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][7])
            gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][7];
          else
            gpCurrentSectorSummary = null;
          break;
        case ALTERNATE_GROUND_MASK: // already pointing to the correct level
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][4];
          break;
        case ALTERNATE_B1_MASK:
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][5];
          break;
        case ALTERNATE_B2_MASK:
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][6];
          break;
        case ALTERNATE_B3_MASK:
          gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][7];
          break;
      }
      if (gpWorldItemsSummaryArray) {
        MemFree(gpWorldItemsSummaryArray);
        gpWorldItemsSummaryArray = null;
        gusWorldItemsSummaryArraySize = 0;
      }
      if (gfItemDetailsMode) {
        if (gpCurrentSectorSummary)
        /*&& gpCurrentSectorSummary->usNumItems ||
                gpPEnemyItemsSummaryArray && gusPEnemyItemsSummaryArraySize ||
                gpNEnemyItemsSummaryArray && gusNEnemyItemsSummaryArraySize )*/
        {
          gfSetupItemDetailsMode = true;
        }
      }
    } else {
      // clicked in same sector, check for double click
      let iNewClickTime: INT32 = GetJA2Clock();
      if (iNewClickTime - iLastClickTime < 400) {
        gfFileIO = true;
      }
      iLastClickTime = iNewClickTime;
    }
    gfRenderSummary = true;
  }
}

function SummaryToggleLevelCallback(btn: GUI_BUTTON, reason: INT32): void {
  let i: INT8;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (GetActiveFieldID() == 1)
      SelectNextField();
    gfRenderSummary = true;
    for (i = Enum58.SUMMARY_ALL; i <= Enum58.SUMMARY_B3; i++) {
      if (btn.IDNum == iSummaryButton[i]) {
        switch (i) {
          case Enum58.SUMMARY_ALL:
            giCurrentViewLevel = ALL_LEVELS_MASK;
            break;
          case Enum58.SUMMARY_G:
            giCurrentViewLevel = GROUND_LEVEL_MASK;
            break;
          case Enum58.SUMMARY_B1:
            giCurrentViewLevel = BASEMENT1_LEVEL_MASK;
            break;
          case Enum58.SUMMARY_B2:
            giCurrentViewLevel = BASEMENT2_LEVEL_MASK;
            break;
          case Enum58.SUMMARY_B3:
            giCurrentViewLevel = BASEMENT3_LEVEL_MASK;
            break;
        }
        if (gfAlternateMaps)
          giCurrentViewLevel <<= 4;
      } else {
        ButtonList[iSummaryButton[i]].uiFlags &= (~BUTTON_CLICKED_ON);
      }
    }
  }
}

function SummaryLoadMapCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ptr: string /* Pointer<UINT16> */;
    let str: string /* UINT16[50] */;
    gfRenderSummary = true;

    SetFont(FONT10ARIAL());
    SetFontForeground(FONT_LTKHAKI);
    SetFontShadow(FONT_NEARBLACK);

    // swprintf( str, L"Loading map:  %s...", gszDisplayName );
    // mprintf( MAP_LEFT, MAP_BOTTOM+100, str );
    // InvalidateRegion( MAP_LEFT, MAP_BOTTOM+100, MAP_LEFT+150,	MAP_BOTTOM+110 );

    CreateProgressBar(0, MAP_LEFT + 5, MAP_BOTTOM + 110, 573, MAP_BOTTOM + 120);

    DefineProgressBarPanel(0, 65, 79, 94, MAP_LEFT, 318, 578, 356);
    str = swprintf("Loading map:  %s", gszDisplayName);
    SetProgressBarTitle(0, str, BLOCKFONT2(), FONT_RED, FONT_NEARBLACK);
    SetProgressBarMsgAttributes(0, SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK);

    if (ExternalLoadMap(gszDisplayName)) {
      EnableButton(iSummaryButton[Enum58.SUMMARY_OKAY]);
      gsSectorX = gsSelSectorX;
      gsSectorY = gsSelSectorY;
      gfOverrideDirty = true;
      gfMapFileDirty = false;
    }
    RemoveProgressBar(0);
    ptr = wcsstr(gszDisplayName, "_b");
    if (!ptr || ptr[3] != '.') {
      gsSectorLayer = GROUND_LEVEL_MASK;
      giCurrLevel = 0;
    } else {
      switch (ptr[2] - '0') {
        case 1:
          gsSectorLayer = BASEMENT1_LEVEL_MASK;
          break;
        case 2:
          gsSectorLayer = BASEMENT2_LEVEL_MASK;
          break;
        case 3:
          gsSectorLayer = BASEMENT3_LEVEL_MASK;
          break;
        default:
          gsSectorLayer = GROUND_LEVEL_MASK;
          break;
      }
    }
  }
}

function SummarySaveMapCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderSummary = true;
    if (gubOverrideStatus == Enum57.INACTIVE || gfOverride == true) {
      if (gubOverrideStatus == Enum57.READONLY) {
        let filename: string /* UINT8[40] */;
        filename = sprintf("MAPS\\%S", gszDisplayName);
        FileClearAttributes(filename);
      }
      if (ExternalSaveMap(gszDisplayName)) {
        if (gsSelSectorX && gsSelSectorY) {
          gsSectorX = gsSelSectorX;
          gsSectorY = gsSelSectorY;
          gfMapFileDirty = false;
          gfOverrideDirty = true;
        }
      }
    }
  }
}

function SummaryOverrideCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfOverride ^= true;
    gfRenderSummary = true;
    if (gfOverride)
      EnableButton(iSummaryButton[Enum58.SUMMARY_SAVE]);
    else
      DisableButton(iSummaryButton[Enum58.SUMMARY_SAVE]);
  }
}

function CalculateOverrideStatus(): void {
  let FileInfo: GETFILESTRUCT;
  let szFilename: string /* UINT8[40] */;
  gfOverrideDirty = false;
  gfOverride = false;
  if (gfTempFile) {
    let ptr: string /* Pointer<UINT8> */;
    szFilename = sprintf("MAPS\\%S", gszTempFilename);
    if (szFilename.length == 5)
      szFilename += "test.dat";
    ptr = strstr(szFilename, ".");
    if (!ptr)
      szFilename += ".dat";
    else
      ptr = ".dat";
  } else
    szFilename = sprintf("MAPS\\%S", gszFilename);
  gszDisplayName = swprintf("%S", addressof(szFilename[5]));
  if (GetFileFirst(szFilename, addressof(FileInfo))) {
    if (gfWorldLoaded) {
      if (FileInfo.uiFileAttribs & (FILE_IS_READONLY | FILE_IS_SYSTEM))
        gubOverrideStatus = Enum57.READONLY;
      else
        gubOverrideStatus = Enum57.OVERWRITE;
      ShowButton(iSummaryButton[Enum58.SUMMARY_OVERRIDE]);
      ButtonList[iSummaryButton[Enum58.SUMMARY_OVERRIDE]].uiFlags &= (~BUTTON_CLICKED_ON);
      GetFileClose(addressof(FileInfo));
      DisableButton(iSummaryButton[Enum58.SUMMARY_SAVE]);
    }
    if (gfTempFile)
      EnableButton(iSummaryButton[Enum58.SUMMARY_LOAD]);
  } else {
    gubOverrideStatus = Enum57.INACTIVE;
    HideButton(iSummaryButton[Enum58.SUMMARY_OVERRIDE]);
    if (gfWorldLoaded)
      EnableButton(iSummaryButton[Enum58.SUMMARY_SAVE]);
  }
}

function LoadGlobalSummary(): void {
  let hfile: HWFILE;
  let ExecDir: string /* STRING512 */;
  let DevInfoDir: string /* STRING512 */;
  let MapsDir: string /* STRING512 */;
  let uiNumBytesRead: UINT32;
  let dMajorVersion: FLOAT;
  let x: INT32;
  let y: INT32;
  let szFilename: string /* UINT8[40] */;
  let szSector: string /* UINT8[6] */;

  OutputDebugString("Executing LoadGlobalSummary()...\n");

  gfMustForceUpdateAllMaps = false;
  gusNumberOfMapsToBeForceUpdated = 0;
  gfGlobalSummaryExists = false;
  // Set current directory to JA2\DevInfo which contains all of the summary data
  GetExecutableDirectory(ExecDir);
  DevInfoDir = sprintf("%s\\DevInfo", ExecDir);
  MapsDir = sprintf("%s\\Data\\Maps", ExecDir);

  // Check to make sure we have a DevInfo directory.  If we don't create one!
  if (!SetFileManCurrentDirectory(DevInfoDir)) {
    OutputDebugString("LoadGlobalSummary() aborted -- doesn't exist on this local computer.\n");
    return;
  }

  // TEMP
  FileDelete("_global.sum");

  gfGlobalSummaryExists = true;

  // Analyse all sectors to see if matching maps exist.  For any maps found, the information
  // will be stored in the gbSectorLevels array.  Also, it attempts to load summaries for those
  // maps.  If the summary information isn't found, then the occurrences are recorded and reported
  // to the user when finished to give the option to generate them.
  for (y = 0; y < 16; y++) {
    for (x = 0; x < 16; x++) {
      gbSectorLevels[x][y] = 0;
      szSector = sprintf("%c%d", 'A' + y, x + 1);

      // main ground level
      szFilename = sprintf("%c%d.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= GROUND_LEVEL_MASK;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 0, dMajorVersion);
      } else {
        szFilename = sprintf("%s.sum", szSector);
        FileDelete(szFilename);
      }
      // main B1 level
      szFilename = sprintf("%c%d_b1.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= BASEMENT1_LEVEL_MASK;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 1, dMajorVersion);
      } else {
        szFilename = sprintf("%s_b1.sum", szSector);
        FileDelete(szFilename);
      }
      // main B2 level
      szFilename = sprintf("%c%d_b2.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= BASEMENT2_LEVEL_MASK;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 2, dMajorVersion);
      } else {
        szFilename = sprintf("%s_b2.sum", szSector);
        FileDelete(szFilename);
      }
      // main B3 level
      szFilename = sprintf("%c%d_b3.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= BASEMENT3_LEVEL_MASK;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 3, dMajorVersion);
      } else {
        szFilename = sprintf("%s_b3.sum", szSector);
        FileDelete(szFilename);
      }
      // alternate ground level
      szFilename = sprintf("%c%d_a.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= ALTERNATE_GROUND_MASK;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 4, dMajorVersion);
      } else {
        szFilename = sprintf("%s_a.sum", szSector);
        FileDelete(szFilename);
      }
      // alternate B1 level
      szFilename = sprintf("%c%d_b1_a.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= ALTERNATE_B1_MASK;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 5, dMajorVersion);
      } else {
        szFilename = sprintf("%s_b1_a.sum", szSector);
        FileDelete(szFilename);
      }
      // alternate B2 level
      szFilename = sprintf("%c%d_b2_a.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= ALTERNATE_B2_MASK;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 6, dMajorVersion);
      } else {
        szFilename = sprintf("%s_b2_a.sum", szSector);
        FileDelete(szFilename);
      }
      // alternate B3 level
      szFilename = sprintf("%c%d_b3_a.dat", 'A' + y, x + 1);
      SetFileManCurrentDirectory(MapsDir);
      hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      SetFileManCurrentDirectory(DevInfoDir);
      if (hfile) {
        gbSectorLevels[x][y] |= ALTERNATE_B1_MASK;
        ;
        FileRead(hfile, addressof(dMajorVersion), sizeof(FLOAT), addressof(uiNumBytesRead));
        FileClose(hfile);
        LoadSummary(szSector, 7, dMajorVersion);
      } else {
        szFilename = sprintf("%s_b3_a.sum", szSector);
        FileDelete(szFilename);
      }
    }
    OutputDebugString(FormatString("Sector Row %c complete... \n", y + 'A'));
  }

  MapsDir = sprintf("%s\\Data", ExecDir);
  SetFileManCurrentDirectory(MapsDir);

  if (gfMustForceUpdateAllMaps) {
    OutputDebugString(FormatString("A MAJOR MAP UPDATE EVENT HAS BEEN DETECTED FOR %d MAPS!!!!.\n", gusNumberOfMapsToBeForceUpdated));
  }

  OutputDebugString("LoadGlobalSummary() finished...\n");
}

function GenerateSummaryList(): void {
  let fp: Pointer<FILE>;
  let ExecDir: string /* STRING512 */;
  let Dir: string /* STRING512 */;

  // Set current directory to JA2\DevInfo which contains all of the summary data
  GetExecutableDirectory(ExecDir);
  Dir = sprintf("%s\\DevInfo", ExecDir);
  if (!SetFileManCurrentDirectory(Dir)) {
    // Directory doesn't exist, so create it, and continue.
    if (!MakeFileManDirectory(Dir))
      AssertMsg(0, "Can't create new directory, JA2\\DevInfo for summary information.");
    if (!SetFileManCurrentDirectory(Dir))
      AssertMsg(0, "Can't set to new directory, JA2\\DevInfo for summary information.");
    // Generate a simple readme file.
    fp = fopen("readme.txt", "w");
    Assert(fp);
    fprintf(fp, "%s\n%s\n", "This information is used in conjunction with the editor.", "This directory or it's contents shouldn't be included with final release.");
    fclose(fp);
  }

  // Set current directory back to data directory!
  Dir = sprintf("%s\\Data", ExecDir);
  SetFileManCurrentDirectory(Dir);
}

export function WriteSectorSummaryUpdate(puiFilename: string /* Pointer<UINT8> */, ubLevel: UINT8, pSummaryFileInfo: Pointer<SUMMARYFILE>): void {
  let fp: Pointer<FILE>;
  let ExecDir: string /* STRING512 */;
  let Dir: string /* STRING512 */;
  let ptr: string /* Pointer<UINT8> */;
  let x: INT8;
  let y: INT8;

  // Set current directory to JA2\DevInfo which contains all of the summary data
  GetExecutableDirectory(ExecDir);
  Dir = sprintf("%s\\DevInfo", ExecDir);
  if (!SetFileManCurrentDirectory(Dir))
    AssertMsg(0, "JA2\\DevInfo folder not found and should exist!");

  ptr = strstr(puiFilename, ".dat");
  if (!ptr)
    AssertMsg(0, "Illegal sector summary filename.");
  ptr = ".sum";

  // write the summary information
  fp = fopen(puiFilename, "wb");
  Assert(fp);
  fwrite(pSummaryFileInfo, 1, sizeof(SUMMARYFILE), fp);
  fclose(fp);

  gusNumEntriesWithOutdatedOrNoSummaryInfo--;
  UpdateMasterProgress();

  // extract the sector information out of the filename.
  if (puiFilename[0] >= 'a')
    y = puiFilename[0] - 'a';
  else
    y = puiFilename[0] - 'A';
  if (puiFilename[2] < '0' || puiFilename[2] > '9')
    x = puiFilename[1] - '0' - 1;
  else
    x = (puiFilename[1] - '0') * 10 + puiFilename[2] - '0' - 1;

  gpSectorSummary[x][y][ubLevel] = pSummaryFileInfo;

  // Set current directory back to data directory!
  Dir = sprintf("%s\\Data", ExecDir);
  SetFileManCurrentDirectory(Dir);
}

function SummaryNewGroundLevelCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfPendingBasement = false;
    gfPendingCaves = false;
    if (gfWorldLoaded) {
      iCurrentAction = Enum37.ACTION_NEW_MAP;
    } else {
      CreateNewMap();
    }
  }
}

function SummaryNewBasementLevelCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
  }
}

function SummaryNewCaveLevelCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
  }
}

function LoadSummary(pSector: string /* Pointer<UINT8> */, ubLevel: UINT8, dMajorMapVersion: FLOAT): void {
  let filename: string /* UINT8[40] */;
  let temp: SUMMARYFILE;
  let x: INT32;
  let y: INT32;
  let fp: Pointer<FILE>;
  filename = pSector;
  if (ubLevel % 4) {
    let str: string /* UINT8[4] */;
    str = sprintf("_b%d", ubLevel % 4);
    filename += str;
  }
  if (ubLevel >= 4) {
    filename += "_a";
  }
  filename += ".sum";

  fp = fopen(filename, "rb");
  if (!fp) {
    gusNumEntriesWithOutdatedOrNoSummaryInfo++;
    return;
  }
  fread(addressof(temp), 1, sizeof(SUMMARYFILE), fp);
  if (temp.ubSummaryVersion < MINIMUMVERSION || dMajorMapVersion < gdMajorMapVersion) {
    gusNumberOfMapsToBeForceUpdated++;
    gfMustForceUpdateAllMaps = true;
  }
  temp.dMajorMapVersion = dMajorMapVersion;
  UpdateSummaryInfo(addressof(temp));
  // even if the info is outdated (but existing), allocate the structure, but indicate that the info
  // is bad.
  y = pSector[0] - 'A';
  if (pSector[2] >= '0' && pSector[2] <= '9')
    x = (pSector[1] - '0') * 10 + pSector[2] - '0' - 1;
  else
    x = pSector[1] - '0' - 1;
  if (gpSectorSummary[x][y][ubLevel]) {
    MemFree(gpSectorSummary[x][y][ubLevel]);
    gpSectorSummary[x][y][ubLevel] = null;
  }
  gpSectorSummary[x][y][ubLevel] = MemAlloc(sizeof(SUMMARYFILE));
  if (gpSectorSummary[x][y][ubLevel])
    memcpy(gpSectorSummary[x][y][ubLevel], addressof(temp), sizeof(SUMMARYFILE));
  if (gpSectorSummary[x][y][ubLevel].value.ubSummaryVersion < GLOBAL_SUMMARY_VERSION)
    gusNumEntriesWithOutdatedOrNoSummaryInfo++;

  fclose(fp);
}

export let MasterStart: DOUBLE;
export let MasterEnd: DOUBLE;

function UpdateMasterProgress(): void {
  if (gfUpdatingNow && gusTotal) {
    MasterStart = (gusCurrent / gusTotal) * 100.0;
    gusCurrent++;
    MasterEnd = (gusCurrent / gusTotal) * 100.0;
    if (gfMajorUpdate) {
      SetRelativeStartAndEndPercentage(2, MasterStart, MasterEnd, null);
      RenderProgressBar(2, 0);
    } else
      SetRelativeStartAndEndPercentage(1, MasterStart, MasterEnd, null);
  }
}

function ReportError(pSector: string /* Pointer<UINT8> */, ubLevel: UINT8): void {
  /* static */ let yp: INT32 = 180;
  let str: string /* UINT16[40] */;
  let temp: string /* UINT16[10] */;

  // Make sure the file exists... if not, then return false
  str = swprintf("%S", pSector);
  if (ubLevel % 4) {
    temp = swprintf("_b%d.dat", ubLevel % 4);
    str += temp;
  }
  mprintf(10, yp, "Skipping update for %s.  Probably due to tileset conflicts...", str);
  InvalidateScreen();
  yp++;
}

function RegenerateSummaryInfoForAllOutdatedMaps(): void {
  let x: INT32;
  let y: INT32;
  let str: string /* UINT8[40] */;
  let pSF: Pointer<SUMMARYFILE>;
  // CreateProgressBar( 0, 20, 120, 300, 132 ); //slave (individual)
  // CreateProgressBar( 1, 20, 100, 300, 112 ); //master (total)
  // DefineProgressBarPanel( 0, 65, 79, 94, 10, 80, 310, 152 );
  CreateProgressBar(0, 20, 100, 300, 112); // master (total)
  DefineProgressBarPanel(0, 65, 79, 94, 10, 80, 310, 132);
  SetProgressBarTitle(0, "Generating map information", BLOCKFONT2(), FONT_RED, FONT_NEARBLACK);
  SetProgressBarMsgAttributes(0, SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK);
  gfUpdatingNow = true;

  gusCurrent = 0;
  gusTotal = gusNumEntriesWithOutdatedOrNoSummaryInfo;
  UpdateMasterProgress();

  for (y = 0; y < 16; y++)
    for (x = 0; x < 16; x++) {
      str = sprintf("%c%d", y + 'A', x + 1);
      if (gbSectorLevels[x][y] & GROUND_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][0];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 0))
            ReportError(str, 0);
      }
      if (gbSectorLevels[x][y] & BASEMENT1_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][1];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 1))
            ReportError(str, 1);
      }
      if (gbSectorLevels[x][y] & BASEMENT2_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][2];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 2))
            ReportError(str, 2);
      }
      if (gbSectorLevels[x][y] & BASEMENT3_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][3];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 3))
            ReportError(str, 3);
      }
      if (gbSectorLevels[x][y] & ALTERNATE_GROUND_MASK) {
        pSF = gpSectorSummary[x][y][4];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 4))
            ReportError(str, 4);
      }
      if (gbSectorLevels[x][y] & ALTERNATE_B1_MASK) {
        pSF = gpSectorSummary[x][y][5];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 5))
            ReportError(str, 5);
      }
      if (gbSectorLevels[x][y] & ALTERNATE_B2_MASK) {
        pSF = gpSectorSummary[x][y][6];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 6))
            ReportError(str, 6);
      }
      if (gbSectorLevels[x][y] & ALTERNATE_B3_MASK) {
        pSF = gpSectorSummary[x][y][7];
        if (!pSF || pSF.value.ubSummaryVersion != GLOBAL_SUMMARY_VERSION)
          if (!EvaluateWorld(str, 7))
            ReportError(str, 7);
      }
    }
  RemoveProgressBar(0);
  RemoveProgressBar(1);
  gfUpdatingNow = false;
}

function SummaryUpdateCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let str: string /* UINT8[40] */;
    CreateProgressBar(0, 20, 100, 300, 112); // slave (individual)
    DefineProgressBarPanel(0, 65, 79, 94, 10, 80, 310, 132);
    SetProgressBarTitle(0, "Generating map summary", BLOCKFONT2(), FONT_RED, FONT_NEARBLACK);
    SetProgressBarMsgAttributes(0, SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK);

    if (gpCurrentSectorSummary) {
      MemFree(gpCurrentSectorSummary);
      gpCurrentSectorSummary = null;
    }

    str = sprintf("%c%d", gsSelSectorY + 'A' - 1, gsSelSectorX);
    EvaluateWorld(str, giCurrLevel);

    gpSectorSummary[gsSelSectorX][gsSelSectorY][giCurrLevel] = gpCurrentSectorSummary;

    gfRenderSummary = true;

    RemoveProgressBar(0);
  }
}

function ExtractTempFilename(): void {
  let str: string /* UINT16[40] */;
  Get16BitStringFromField(1, str);
  if (wcscmp(gszTempFilename, str)) {
    gszTempFilename = str;
    gfRenderSummary = true;
    gfOverrideDirty = true;
  }
  if (!str.length)
    gszDisplayName = "test.dat";
}

function ApologizeOverrideAndForceUpdateEverything(): void {
  let x: INT32;
  let y: INT32;
  let str: string /* UINT16[50] */;
  let name: string /* UINT8[50] */;
  let pSF: Pointer<SUMMARYFILE>;
  // Create one huge assed button
  gfMajorUpdate = true;
  iSummaryButton[Enum58.SUMMARY_BACKGROUND] = CreateTextButton(0, 0, 0, 0, BUTTON_USE_DEFAULT, 0, 0, 640, 480, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH - 1, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  SpecifyDisabledButtonStyle(iSummaryButton[Enum58.SUMMARY_BACKGROUND], Enum29.DISABLED_STYLE_NONE);
  DisableButton(iSummaryButton[Enum58.SUMMARY_BACKGROUND]);
  // Draw it
  DrawButton(iSummaryButton[Enum58.SUMMARY_BACKGROUND]);
  InvalidateRegion(0, 0, 640, 480);
  SetFont(HUGEFONT());
  SetFontForeground(FONT_RED);
  SetFontShadow(FONT_NEARBLACK);
  str = "MAJOR VERSION UPDATE";
  mprintf(320 - StringPixLength(str, HUGEFONT()) / 2, 105, str);
  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_YELLOW);
  str = swprintf("There are %d maps requiring a major version update.", gusNumberOfMapsToBeForceUpdated);
  mprintf(320 - StringPixLength(str, FONT10ARIAL()) / 2, 130, str);

  CreateProgressBar(2, 120, 170, 520, 202);
  DefineProgressBarPanel(2, 65, 79, 94, 100, 150, 540, 222);
  SetProgressBarTitle(2, "Updating all outdated maps", BLOCKFONT2(), FONT_RED, 0);
  SetProgressBarMsgAttributes(2, SMALLCOMPFONT(), FONT_BLACK, FONT_BLACK);

  gusCurrent = 0;
  gusTotal = gusNumberOfMapsToBeForceUpdated;
  gfUpdatingNow = true;
  UpdateMasterProgress();

  for (y = 0; y < 16; y++)
    for (x = 0; x < 16; x++) {
      name = sprintf("%c%d", y + 'A', x + 1);
      if (gbSectorLevels[x][y] & GROUND_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][0];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 0))
            return;
        }
      }
      if (gbSectorLevels[x][y] & BASEMENT1_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][1];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 1))
            return;
        }
      }
      if (gbSectorLevels[x][y] & BASEMENT2_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][2];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 2))
            return;
        }
      }
      if (gbSectorLevels[x][y] & BASEMENT3_LEVEL_MASK) {
        pSF = gpSectorSummary[x][y][3];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 3))
            return;
        }
      }
      if (gbSectorLevels[x][y] & ALTERNATE_GROUND_MASK) {
        pSF = gpSectorSummary[x][y][4];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 4))
            return;
        }
      }
      if (gbSectorLevels[x][y] & ALTERNATE_B1_MASK) {
        pSF = gpSectorSummary[x][y][5];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 5))
            return;
        }
      }
      if (gbSectorLevels[x][y] & ALTERNATE_B2_MASK) {
        pSF = gpSectorSummary[x][y][6];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 6))
            return;
        }
      }
      if (gbSectorLevels[x][y] & ALTERNATE_B3_MASK) {
        pSF = gpSectorSummary[x][y][7];
        if (!pSF || pSF.value.ubSummaryVersion < MINIMUMVERSION || pSF.value.dMajorMapVersion < gdMajorMapVersion) {
          gpCurrentSectorSummary = pSF;
          if (!EvaluateWorld(name, 7))
            return;
        }
      }
    }

  EvaluateWorld("p3_m.dat", 0);

  RemoveProgressBar(2);
  gfUpdatingNow = false;
  InvalidateScreen();

  RemoveButton(iSummaryButton[Enum58.SUMMARY_BACKGROUND]);
  gfMajorUpdate = false;
  gfMustForceUpdateAllMaps = false;
  gusNumberOfMapsToBeForceUpdated = 0;
}

function SetupItemDetailsMode(fAllowRecursion: boolean): void {
  let hfile: HWFILE;
  let uiNumBytesRead: UINT32;
  let uiNumItems: UINT32;
  let szFilename: string /* UINT8[40] */;
  let basic: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
  let priority: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let i: INT32;
  let j: INT32;
  let usNumItems: UINT16;
  let pItem: Pointer<OBJECTTYPE>;
  let usPEnemyIndex: UINT16;
  let usNEnemyIndex: UINT16;

  // Clear memory for all the item summaries loaded
  if (gpWorldItemsSummaryArray) {
    MemFree(gpWorldItemsSummaryArray);
    gpWorldItemsSummaryArray = null;
    gusWorldItemsSummaryArraySize = 0;
  }
  if (gpPEnemyItemsSummaryArray) {
    MemFree(gpPEnemyItemsSummaryArray);
    gpPEnemyItemsSummaryArray = null;
    gusPEnemyItemsSummaryArraySize = 0;
  }
  if (gpNEnemyItemsSummaryArray) {
    MemFree(gpNEnemyItemsSummaryArray);
    gpNEnemyItemsSummaryArray = null;
    gusNEnemyItemsSummaryArraySize = 0;
  }

  if (!gpCurrentSectorSummary.value.uiNumItemsPosition) {
    // Don't have one, so generate them
    if (gpCurrentSectorSummary.value.ubSummaryVersion == GLOBAL_SUMMARY_VERSION)
      gusNumEntriesWithOutdatedOrNoSummaryInfo++;
    SummaryUpdateCallback(ButtonList[iSummaryButton[Enum58.SUMMARY_UPDATE]], MSYS_CALLBACK_REASON_LBUTTON_UP);
    gpCurrentSectorSummary = gpSectorSummary[gsSelSectorX - 1][gsSelSectorY - 1][giCurrLevel];
  }
  // Open the original map for the sector
  szFilename = sprintf("MAPS\\%S", gszFilename);
  hfile = FileOpen(szFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (!hfile) {
    // The file couldn't be found!
    return;
  }
  // Now fileseek directly to the file position where the number of world items are stored
  if (!FileSeek(hfile, gpCurrentSectorSummary.value.uiNumItemsPosition, FILE_SEEK_FROM_START)) {
    // Position couldn't be found!
    FileClose(hfile);
    return;
  }
  // Now load the number of world items from the map.
  FileRead(hfile, addressof(uiNumItems), 4, addressof(uiNumBytesRead));
  if (uiNumBytesRead != 4) {
    // Invalid situation.
    FileClose(hfile);
    return;
  }
  // Now compare this number with the number the summary thinks we should have.  If they are different,
  // the the summary doesn't match the map.  What we will do is force regenerate the map so that they do
  // match
  if (uiNumItems != gpCurrentSectorSummary.value.usNumItems && fAllowRecursion) {
    FileClose(hfile);
    gpCurrentSectorSummary.value.uiNumItemsPosition = 0;
    SetupItemDetailsMode(false);
    return;
  }
  // Passed the gauntlet, so now allocate memory for it, and load all the world items into this array.
  ShowButton(iSummaryButton[Enum58.SUMMARY_SCIFI]);
  ShowButton(iSummaryButton[Enum58.SUMMARY_REAL]);
  ShowButton(iSummaryButton[Enum58.SUMMARY_ENEMY]);
  gpWorldItemsSummaryArray = MemAlloc(sizeof(WORLDITEM) * uiNumItems);
  gusWorldItemsSummaryArraySize = gpCurrentSectorSummary.value.usNumItems;
  FileRead(hfile, gpWorldItemsSummaryArray, sizeof(WORLDITEM) * uiNumItems, addressof(uiNumBytesRead));

  // NOW, do the enemy's items!
  // We need to do two passes.  The first pass simply processes all the enemies and counts all the droppable items
  // keeping track of two different values.  The first value is the number of droppable items that come off of
  // enemy detailed placements, the other counter keeps track of the number of droppable items that come off of
  // normal enemy placements.  After doing this, the memory is allocated for the tables that will store all the item
  // summary information, then the second pass will repeat the process, except it will record the actual items.

  // PASS #1
  if (!FileSeek(hfile, gpCurrentSectorSummary.value.uiEnemyPlacementPosition, FILE_SEEK_FROM_START)) {
    // Position couldn't be found!
    FileClose(hfile);
    return;
  }
  for (i = 0; i < gpCurrentSectorSummary.value.MapInfo.ubNumIndividuals; i++) {
    FileRead(hfile, addressof(basic), sizeof(BASIC_SOLDIERCREATE_STRUCT), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(BASIC_SOLDIERCREATE_STRUCT)) {
      // Invalid situation.
      FileClose(hfile);
      return;
    }
    if (basic.fDetailedPlacement) {
      // skip static priority placement
      FileRead(hfile, addressof(priority), sizeof(SOLDIERCREATE_STRUCT), addressof(uiNumBytesRead));
      if (uiNumBytesRead != sizeof(SOLDIERCREATE_STRUCT)) {
        // Invalid situation.
        FileClose(hfile);
        return;
      }
    } else {
      // non detailed placements don't have items, so skip
      continue;
    }
    if (basic.bTeam == ENEMY_TEAM) {
      // Count the items that this enemy placement drops
      usNumItems = 0;
      for (j = 0; j < 9; j++) {
        pItem = addressof(priority.Inv[gbMercSlotTypes[j]]);
        if (pItem.value.usItem != NOTHING && !(pItem.value.fFlags & OBJECT_UNDROPPABLE)) {
          usNumItems++;
        }
      }
      if (basic.fPriorityExistance) {
        gusPEnemyItemsSummaryArraySize += usNumItems;
      } else {
        gusNEnemyItemsSummaryArraySize += usNumItems;
      }
    }
  }

  // Pass 1 completed, so now allocate enough space to hold all the items
  if (gusPEnemyItemsSummaryArraySize) {
    gpPEnemyItemsSummaryArray = MemAlloc(sizeof(OBJECTTYPE) * gusPEnemyItemsSummaryArraySize);
    memset(gpPEnemyItemsSummaryArray, 0, sizeof(OBJECTTYPE) * gusPEnemyItemsSummaryArraySize);
  }
  if (gusNEnemyItemsSummaryArraySize) {
    gpNEnemyItemsSummaryArray = MemAlloc(sizeof(OBJECTTYPE) * gusNEnemyItemsSummaryArraySize);
    memset(gpNEnemyItemsSummaryArray, 0, sizeof(OBJECTTYPE) * gusNEnemyItemsSummaryArraySize);
  }

  // PASS #2
  // During this pass, simply copy all the data instead of counting it, now that we have already done so.
  usPEnemyIndex = usNEnemyIndex = 0;
  if (!FileSeek(hfile, gpCurrentSectorSummary.value.uiEnemyPlacementPosition, FILE_SEEK_FROM_START)) {
    // Position couldn't be found!
    FileClose(hfile);
    return;
  }
  for (i = 0; i < gpCurrentSectorSummary.value.MapInfo.ubNumIndividuals; i++) {
    FileRead(hfile, addressof(basic), sizeof(BASIC_SOLDIERCREATE_STRUCT), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(BASIC_SOLDIERCREATE_STRUCT)) {
      // Invalid situation.
      FileClose(hfile);
      return;
    }
    if (basic.fDetailedPlacement) {
      // skip static priority placement
      FileRead(hfile, addressof(priority), sizeof(SOLDIERCREATE_STRUCT), addressof(uiNumBytesRead));
      if (uiNumBytesRead != sizeof(SOLDIERCREATE_STRUCT)) {
        // Invalid situation.
        FileClose(hfile);
        return;
      }
    } else {
      // non detailed placements don't have items, so skip
      continue;
    }
    if (basic.bTeam == ENEMY_TEAM) {
      // Copy the items that this enemy placement drops
      usNumItems = 0;
      for (j = 0; j < 9; j++) {
        pItem = addressof(priority.Inv[gbMercSlotTypes[j]]);
        if (pItem.value.usItem != NOTHING && !(pItem.value.fFlags & OBJECT_UNDROPPABLE)) {
          if (basic.fPriorityExistance) {
            memcpy(addressof(gpPEnemyItemsSummaryArray[usPEnemyIndex]), pItem, sizeof(OBJECTTYPE));
            usPEnemyIndex++;
          } else {
            memcpy(addressof(gpNEnemyItemsSummaryArray[usNEnemyIndex]), pItem, sizeof(OBJECTTYPE));
            usNEnemyIndex++;
          }
        }
      }
    }
  }
  FileClose(hfile);
}

function GetCurrentSummaryVersion(): UINT8 {
  if (gpCurrentSectorSummary) {
    return gpCurrentSectorSummary.value.MapInfo.ubMapVersion;
  }
  return 0;
}

}
