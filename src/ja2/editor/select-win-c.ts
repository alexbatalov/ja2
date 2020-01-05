namespace ja2 {

let gfRenderSquareArea: boolean = false;
let iStartClickX: INT16;
let iStartClickY: INT16;
let iEndClickX: INT16;
let iEndClickY: INT16;

let iButtonIcons: INT32[] /* [4] */;
let iSelectWin: INT32;
let iCancelWin: INT32;
let iScrollUp: INT32;
let iScrollDown: INT32;
let iOkWin: INT32;

export let fAllDone: boolean = false;
let fButtonsPresent: boolean = false;

let SelWinSpacing: SGPPoint = createSGPPoint();
let SelWinStartPoint: SGPPoint = createSGPPoint();
let SelWinEndPoint: SGPPoint = createSGPPoint();

// These definitions help define the start and end of the various wall indices.
// This needs to be maintained if the walls change.
const WALL_LAST_WALL_OFFSET = 30;
const WALL_FIRST_AFRAME_OFFSET = 31;
const WALL_LAST_AFRAME_OFFSET = 34;
const WALL_FIRST_WINDOW_OFFSET = 35;
const WALL_LAST_WINDOW_OFFSET = 46;
const WALL_FIRST_BROKEN_WALL_OFFSET = 47;
const WALL_LAST_BROKEN_WALL_OFFSET = 54;
const WALL_FIRST_APPENDED_WALL_OFFSET = 55;
const WALL_LAST_APPENDED_WALL_OFFSET = 56;
const WALL_FIRST_WEATHERED_WALL_OFFSET = 57;
const WALL_LAST_WEATHERED_WALL_OFFSET = 64;

// I've added these definitions to add readability, and minimize conversion time for changes
// incase there are new values, etc.
const OSTRUCTS_NUMELEMENTS = (LASTOSTRUCT - Enum313.FIRSTFULLSTRUCT + 22);
const OSTRUCTS1_NUMELEMENTS = 5;
const OSTRUCTS2_NUMELEMENTS = 12;
const BANKSLIST_NUMELEMENTS = 5;
const ROADSLIST_NUMELEMENTS = 1;
const DEBRISLIST_NUMELEMENTS = (LASTDEBRIS - Enum313.DEBRISROCKS + 2 + 1); //+1 for ANOTHERDEBRIS

const SINGLEWALL_NUMELEMENTS = ((LASTWALL - Enum313.FIRSTWALL + 1) * 2);
const SINGLEDOOR_NUMELEMENTS = ((LASTDOOR - Enum313.FIRSTDOOR + 1) * 5);
const SINGLEWINDOW_NUMELEMENTS = (LASTWALL - Enum313.FIRSTWALL + 1);
const SINGLEROOF_NUMELEMENTS = ((LASTROOF - Enum313.FIRSTROOF + 1) + (LASTSLANTROOF - Enum313.FIRSTSLANTROOF + 1) + (LASTWALL - Enum313.FIRSTWALL + 1) + (Enum313.SECONDONROOF - Enum313.FIRSTONROOF + 1));
const SINGLENEWROOF_NUMELEMENTS = (LASTROOF - Enum313.FIRSTROOF + 1);
const SINGLEBROKENWALL_NUMELEMENTS = ((LASTDECORATIONS - Enum313.FIRSTDECORATIONS + 1) + (LASTWALL - Enum313.FIRSTWALL + 1) * 2);
const SINGLEDECOR_NUMELEMENTS = (LASTISTRUCT - Enum313.FIRSTISTRUCT + 1);
const SINGLEDECAL_NUMELEMENTS = (LASTWALLDECAL - Enum313.FIRSTWALLDECAL + Enum313.EIGTHWALLDECAL - Enum313.FIFTHWALLDECAL + 3);
const SINGLEFLOOR_NUMELEMENTS = (LASTFLOOR - Enum313.FIRSTFLOOR + 1);
const SINGLETOILET_NUMELEMENTS = (Enum313.EIGHTISTRUCT - Enum313.FIFTHISTRUCT + 1);
//#define ROOM_NUMELEMENTS							( (LASTWALL-FIRSTWALL+1) + (LASTFLOOR-FIRSTFLOOR+1) + \
//																				(LASTROOF-FIRSTROOF+1) + (LASTSLANTROOF-FIRSTSLANTROOF+1) )
const ROOM_NUMELEMENTS = ((LASTWALL - Enum313.FIRSTWALL + 1) + (LASTFLOOR - Enum313.FIRSTFLOOR + 1) + (LASTROOF - Enum313.FIRSTROOF + 1) + (2));

// This is a special case for trees which may have varying numbers.  There was a problem
// in which we loaded a new tileset which had one less tree in it.  When we called BuildSelectionWindow(),
// it would crash because it thought there was an extra tree which was now invalid.
let gusNumOStructs: UINT16 = 0;

// List of objects to display in the selection window
let OStructs: DisplaySpec[] /* [OSTRUCTS_NUMELEMENTS] */;
let OStructs1: DisplaySpec[] /* [OSTRUCTS1_NUMELEMENTS] */;
let OStructs2: DisplaySpec[] /* [OSTRUCTS2_NUMELEMENTS] */;
let BanksList: DisplaySpec[] /* [BANKSLIST_NUMELEMENTS] */;
let RoadsList: DisplaySpec[] /* [ROADSLIST_NUMELEMENTS] */;
let DebrisList: DisplaySpec[] /* [DEBRISLIST_NUMELEMENTS] */;
let SingleWall: DisplaySpec[] /* [SINGLEWALL_NUMELEMENTS] */;
let SingleDoor: DisplaySpec[] /* [SINGLEDOOR_NUMELEMENTS] */;
let SingleWindow: DisplaySpec[] /* [SINGLEWINDOW_NUMELEMENTS] */;
let SingleRoof: DisplaySpec[] /* [SINGLEROOF_NUMELEMENTS] */;
let SingleNewRoof: DisplaySpec[] /* [SINGLENEWROOF_NUMELEMENTS] */;
let SingleBrokenWall: DisplaySpec[] /* [SINGLEBROKENWALL_NUMELEMENTS] */;
let SingleDecor: DisplaySpec[] /* [SINGLEDECOR_NUMELEMENTS] */;
let SingleDecal: DisplaySpec[] /* [SINGLEDECAL_NUMELEMENTS] */;
let SingleFloor: DisplaySpec[] /* [SINGLEFLOOR_NUMELEMENTS] */;
let SingleToilet: DisplaySpec[] /* [SINGLETOILET_NUMELEMENTS] */;
let Room: DisplaySpec[] /* [ROOM_NUMELEMENTS] */;

// These are all of the different selection lists.  Changing the max_selections will
// change the number of selections values you can have at a time.  This is Bret's gay code,
// though I've cleaned it up a lot.
export let SelOStructs: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTFULLSTRUCT, 0, 1) ]; // Default selections
export let SelOStructs1: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FOURTHOSTRUCT, 0, 1) ]; // Default selections
export let SelOStructs2: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.THIRDOSTRUCT, 0, 1) ]; // Default selections
export let SelBanks: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTCLIFF, 0, 1) ];
export let SelRoads: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTROAD, 0, 1) ];
export let SelDebris: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.DEBRISROCKS, 0, 1) ];
export let SelSingleWall: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTWALL, 0, 1) ];
export let SelSingleDoor: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTDOOR, 0, 1) ];
export let SelSingleWindow: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTWALL, 44, 1) ];
export let SelSingleRoof: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTROOF, 0, 1) ];
export let SelSingleNewRoof: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTROOF, 0, 1) ];
export let SelSingleBrokenWall: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTDECORATIONS, 0, 1) ];
export let SelSingleDecor: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTISTRUCT, 0, 1) ];
export let SelSingleDecal: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTWALLDECAL, 0, 1) ];
export let SelSingleFloor: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTFLOOR, 0, 1) ];
export let SelSingleToilet: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIFTHISTRUCT, 0, 1) ];
export let SelRoom: Selections[] /* [MAX_SELECTIONS] */ = [ createSelectionsFrom(Enum313.FIRSTWALL, 0, 1) ];

// Number of objects currently in the selection list
export let iNumOStructsSelected: INT32 = 1;
export let iNumOStructsSelected__Pointer = createPointer(() => iNumOStructsSelected, (v) => iNumOStructsSelected = v);
export let iNumOStructs1Selected: INT32 = 1;
export let iNumOStructs1Selected__Pointer = createPointer(() => iNumOStructs1Selected, (v) => iNumOStructs1Selected = v);
export let iNumOStructs2Selected: INT32 = 1;
export let iNumOStructs2Selected__Pointer = createPointer(() => iNumOStructs2Selected, (v) => iNumOStructs2Selected = v);
export let iNumBanksSelected: INT32 = 1;
export let iNumBanksSelected__Pointer = createPointer(() => iNumBanksSelected, (v) => iNumBanksSelected = v);
export let iNumRoadsSelected: INT32 = 1;
export let iNumRoadsSelected__Pointer = createPointer(() => iNumRoadsSelected, (v) => iNumRoadsSelected = v);
export let iNumDebrisSelected: INT32 = 1;
export let iNumDebrisSelected__Pointer = createPointer(() => iNumDebrisSelected, (v) => iNumDebrisSelected = v);

export let iNumWallsSelected: INT32 = 1;
export let iNumWallsSelected__Pointer = createPointer(() => iNumWallsSelected, (v) => iNumWallsSelected = v);
export let iNumDoorsSelected: INT32 = 1;
export let iNumDoorsSelected__Pointer = createPointer(() => iNumDoorsSelected, (v) => iNumDoorsSelected = v);
export let iNumWindowsSelected: INT32 = 1;
export let iNumWindowsSelected__Pointer = createPointer(() => iNumWindowsSelected, (v) => iNumWindowsSelected = v);
export let iNumDecorSelected: INT32 = 1;
export let iNumDecorSelected__Pointer = createPointer(() => iNumDecorSelected, (v) => iNumDecorSelected = v);
export let iNumDecalsSelected: INT32 = 1;
export let iNumDecalsSelected__Pointer = createPointer(() => iNumDecalsSelected, (v) => iNumDecalsSelected = v);
export let iNumBrokenWallsSelected: INT32 = 1;
export let iNumBrokenWallsSelected__Pointer = createPointer(() => iNumBrokenWallsSelected, (v) => iNumBrokenWallsSelected = v);
export let iNumFloorsSelected: INT32 = 1;
export let iNumFloorsSelected__Pointer = createPointer(() => iNumFloorsSelected, (v) => iNumFloorsSelected = v);
export let iNumToiletsSelected: INT32 = 1;
export let iNumToiletsSelected__Pointer = createPointer(() => iNumToiletsSelected, (v) => iNumToiletsSelected = v);
export let iNumRoofsSelected: INT32 = 1;
export let iNumRoofsSelected__Pointer = createPointer(() => iNumRoofsSelected, (v) => iNumRoofsSelected = v);
export let iNumNewRoofsSelected: INT32 = 1;
export let iNumNewRoofsSelected__Pointer = createPointer(() => iNumNewRoofsSelected, (v) => iNumNewRoofsSelected = v);
export let iNumRoomsSelected: INT32 = 1;
export let iNumRoomsSelected__Pointer = createPointer(() => iNumRoomsSelected, (v) => iNumRoomsSelected = v);

// Holds the previous selection list when a selection window is up. Used for canceling the selection window
let OldSelList: Selections[] /* [MAX_SELECTIONS] */;
let iOldNumSelList: INT32;

// Global pointers for selection list
export let pSelList: Selections[] /* Pointer<Selections> */;
export let pNumSelList: Pointer<INT32>;

// Global used to indicate which selection to use (changes with the PGUP/PGDWN keys in editor)
export let iCurBank: INT32 = 0;

let pDispList: DisplayList /* Pointer<DisplayList> */;
let iTopWinCutOff: INT16;
let iBotWinCutOff: INT16;
let Selection: DisplayList;

let SelWinFillColor: UINT16 = 0x0000; // Black
let SelWinHilightFillColor: UINT16 = 0x000d; // a kind of medium dark blue

//----------------------------------------------------------------------------------------------
//	CreateJA2SelectionWindow
//
//	Creates a selection window of the given type.
//
export function CreateJA2SelectionWindow(sWhat: INT16): void {
  let pDSpec: DisplaySpec[] /* Pointer<DisplaySpec> */;
  let usNSpecs: UINT16;

  fAllDone = false;

  DisableEditorTaskbar();

  // Load up the button images
  iButtonIcons[CANCEL_ICON] = LoadGenericButtonIcon("EDITOR//bigX.sti");
  iButtonIcons[UP_ICON] = LoadGenericButtonIcon("EDITOR//lgUpArrow.sti");
  iButtonIcons[DOWN_ICON] = LoadGenericButtonIcon("EDITOR//lgDownArrow.sti");
  iButtonIcons[OK_ICON] = LoadGenericButtonIcon("EDITOR//checkmark.sti");

  iSelectWin = CreateHotSpot(0, 0, 600, 360, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SelWinClkCallback);

  iCancelWin = CreateIconButton(iButtonIcons[CANCEL_ICON], 0, BUTTON_USE_DEFAULT, 600, 40, 40, 40, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), CnclClkCallback);
  SetButtonFastHelpText(iCancelWin, "Cancel selections");

  iOkWin = CreateIconButton(iButtonIcons[OK_ICON], 0, BUTTON_USE_DEFAULT, 600, 0, 40, 40, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), OkClkCallback);
  SetButtonFastHelpText(iOkWin, "Accept selections");

  iScrollUp = CreateIconButton(iButtonIcons[UP_ICON], 0, BUTTON_USE_DEFAULT, 600, 80, 40, 160, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), UpClkCallback);
  SetButtonFastHelpText(iScrollUp, "Scroll window up");

  iScrollDown = CreateIconButton(iButtonIcons[DOWN_ICON], 0, BUTTON_USE_DEFAULT, 600, 240, 40, 160, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DwnClkCallback);
  SetButtonFastHelpText(iScrollDown, "Scroll window down");

  fButtonsPresent = true;

  SelWinSpacing.iX = 2;
  SelWinSpacing.iY = 2;

  SelWinStartPoint.iX = 1;
  SelWinStartPoint.iY = 15;

  iTopWinCutOff = 15;

  SelWinEndPoint.iX = 599;
  SelWinEndPoint.iY = 359;

  iBotWinCutOff = 359;

  switch (sWhat) {
    case Enum59.SELWIN_OSTRUCTS:
      pDSpec = OStructs;
      usNSpecs = gusNumOStructs; // OSTRUCTS_NUMELEMENTS;
      pSelList = SelOStructs;
      pNumSelList = iNumOStructsSelected__Pointer;
      break;

    case Enum59.SELWIN_OSTRUCTS1:
      pDSpec = OStructs1;
      usNSpecs = OSTRUCTS1_NUMELEMENTS;
      pSelList = SelOStructs1;
      pNumSelList = iNumOStructs1Selected__Pointer;
      break;

    case Enum59.SELWIN_OSTRUCTS2:
      pDSpec = OStructs2;
      usNSpecs = OSTRUCTS2_NUMELEMENTS;
      pSelList = SelOStructs2;
      pNumSelList = iNumOStructs2Selected__Pointer;
      break;

    case Enum59.SELWIN_BANKS:
      pDSpec = BanksList;
      usNSpecs = BANKSLIST_NUMELEMENTS;
      pSelList = SelBanks;
      pNumSelList = iNumBanksSelected__Pointer;
      break;

    case Enum59.SELWIN_ROADS:
      pDSpec = RoadsList;
      usNSpecs = ROADSLIST_NUMELEMENTS;
      pSelList = SelRoads;
      pNumSelList = iNumRoadsSelected__Pointer;
      break;

    case Enum59.SELWIN_DEBRIS:
      pDSpec = DebrisList;
      usNSpecs = DEBRISLIST_NUMELEMENTS;
      pSelList = SelDebris;
      pNumSelList = iNumDebrisSelected__Pointer;
      break;

    case Enum59.SELWIN_SINGLEWALL:
      pDSpec = SingleWall;
      usNSpecs = SINGLEWALL_NUMELEMENTS;
      pSelList = SelSingleWall;
      pNumSelList = iNumWallsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLEDOOR:
      pDSpec = SingleDoor;
      usNSpecs = SINGLEDOOR_NUMELEMENTS;
      pSelList = SelSingleDoor;
      pNumSelList = iNumDoorsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLEWINDOW:
      pDSpec = SingleWindow;
      usNSpecs = SINGLEWINDOW_NUMELEMENTS;
      pSelList = SelSingleWindow;
      pNumSelList = iNumWindowsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLEROOF:
      pDSpec = SingleRoof;
      usNSpecs = SINGLEROOF_NUMELEMENTS;
      pSelList = SelSingleRoof;
      pNumSelList = iNumRoofsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLENEWROOF:
      pDSpec = SingleNewRoof;
      usNSpecs = SINGLENEWROOF_NUMELEMENTS;
      pSelList = SelSingleNewRoof;
      pNumSelList = iNumNewRoofsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLEBROKENWALL:
      pDSpec = SingleBrokenWall;
      usNSpecs = SINGLEBROKENWALL_NUMELEMENTS;
      pSelList = SelSingleBrokenWall;
      pNumSelList = iNumBrokenWallsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLEDECOR:
      pDSpec = SingleDecor;
      usNSpecs = SINGLEDECOR_NUMELEMENTS;
      pSelList = SelSingleDecor;
      pNumSelList = iNumDecorSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLEDECAL:
      pDSpec = SingleDecal;
      usNSpecs = SINGLEDECAL_NUMELEMENTS;
      pSelList = SelSingleDecal;
      pNumSelList = iNumDecalsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLEFLOOR:
      pDSpec = SingleFloor;
      usNSpecs = SINGLEFLOOR_NUMELEMENTS;
      pSelList = SelSingleFloor;
      pNumSelList = iNumFloorsSelected__Pointer;
      break;
    case Enum59.SELWIN_SINGLETOILET:
      pDSpec = SingleToilet;
      usNSpecs = SINGLETOILET_NUMELEMENTS;
      pSelList = SelSingleToilet;
      pNumSelList = iNumToiletsSelected__Pointer;
      break;
    case Enum59.SELWIN_ROOM:
      pDSpec = Room;
      usNSpecs = ROOM_NUMELEMENTS;
      pSelList = SelRoom;
      pNumSelList = iNumRoomsSelected__Pointer;
      break;
    default:
      throw new Error('Should be unreachable');
  }

  BuildDisplayWindow(pDSpec, usNSpecs, createPointer(() => pDispList, (v) => pDispList = v), SelWinStartPoint, SelWinEndPoint, SelWinSpacing, CLEAR_BACKGROUND);
}

// The selection window method is initialized here.  This is where all the graphics for all
// the categories are organized and loaded.  If you wish to move things around, then this is
// where the initialization part is done.  I have also changed this from previously being loaded
// every single time you go into a selection window which was redundant and CPU consuming.
export function InitJA2SelectionWindow(): void {
  let iCount: INT32;
  let iCount2: INT32;
  let iCount3: INT32;

  let usETRLEObjects: UINT16;
  let hVObject: SGPVObject;

  pDispList = <DisplayList><unknown>null;

  // Init the display spec lists for the types of selection windows

  // Trees & bushes (The tree button in the "terrain" toolbar)
  for (iCount3 = 0, iCount = 0; iCount < (LASTOSTRUCT - Enum313.FIRSTFULLSTRUCT + 1); iCount++) {
    hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTFULLSTRUCT + iCount]].hTileSurface;
    usETRLEObjects = hVObject.usNumberOfObjects;

    for (iCount2 = 0; iCount2 < usETRLEObjects; iCount2 += 3, iCount3++) {
      OStructs[iCount3].ubType = DISPLAY_GRAPHIC;
      OStructs[iCount3].hVObject = hVObject;
      OStructs[iCount3].usStart = iCount2;
      OStructs[iCount3].usEnd = iCount2;
      OStructs[iCount3].uiObjIndx = (Enum313.FIRSTFULLSTRUCT + iCount);
    }
  }

  OStructs[iCount3].ubType = DISPLAY_GRAPHIC;
  OStructs[iCount3].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.SIXTHOSTRUCT]].hTileSurface;
  OStructs[iCount3].usStart = DISPLAY_ALL_OBJECTS;
  OStructs[iCount3].usEnd = 0;
  OStructs[iCount3].uiObjIndx = Enum313.SIXTHOSTRUCT;

  gusNumOStructs = iCount3 + 1;

  // Rocks & barrels! (the "1" button in the "terrain" toolbar)
  OStructs1[0].ubType = DISPLAY_GRAPHIC;
  OStructs1[0].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FOURTHOSTRUCT]].hTileSurface;
  OStructs1[0].usStart = DISPLAY_ALL_OBJECTS;
  OStructs1[0].usEnd = 0;
  OStructs1[0].uiObjIndx = Enum313.FOURTHOSTRUCT;

  for (iCount = 0; iCount < (Enum313.THIRDOSTRUCT - Enum313.FIRSTOSTRUCT); iCount++) {
    OStructs1[iCount + 1].ubType = DISPLAY_GRAPHIC;
    OStructs1[iCount + 1].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTOSTRUCT + iCount]].hTileSurface;
    OStructs1[iCount + 1].usStart = DISPLAY_ALL_OBJECTS;
    OStructs1[iCount + 1].usEnd = 0;
    OStructs1[iCount + 1].uiObjIndx = Enum313.FIRSTOSTRUCT + iCount;
  }

  // Other junk! (the "2" button in the "terrain" toolbar)
  OStructs2[0].ubType = DISPLAY_GRAPHIC;
  OStructs2[0].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.THIRDOSTRUCT]].hTileSurface;
  OStructs2[0].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[0].usEnd = 0;
  OStructs2[0].uiObjIndx = Enum313.THIRDOSTRUCT;

  OStructs2[1].ubType = DISPLAY_GRAPHIC;
  OStructs2[1].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIFTHOSTRUCT]].hTileSurface;
  OStructs2[1].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[1].usEnd = 0;
  OStructs2[1].uiObjIndx = Enum313.FIFTHOSTRUCT;

  OStructs2[2].ubType = DISPLAY_GRAPHIC;
  OStructs2[2].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.SEVENTHOSTRUCT]].hTileSurface;
  OStructs2[2].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[2].usEnd = 0;
  OStructs2[2].uiObjIndx = Enum313.SEVENTHOSTRUCT;

  OStructs2[3].ubType = DISPLAY_GRAPHIC;
  OStructs2[3].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.EIGHTOSTRUCT]].hTileSurface;
  OStructs2[3].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[3].usEnd = 0;
  OStructs2[3].uiObjIndx = Enum313.EIGHTOSTRUCT;

  OStructs2[4].ubType = DISPLAY_GRAPHIC;
  OStructs2[4].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTVEHICLE]].hTileSurface;
  OStructs2[4].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[4].usEnd = 0;
  OStructs2[4].uiObjIndx = Enum313.FIRSTVEHICLE;

  OStructs2[5].ubType = DISPLAY_GRAPHIC;
  OStructs2[5].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.SECONDVEHICLE]].hTileSurface;
  OStructs2[5].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[5].usEnd = 0;
  OStructs2[5].uiObjIndx = Enum313.SECONDVEHICLE;

  OStructs2[6].ubType = DISPLAY_GRAPHIC;
  OStructs2[6].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTDEBRISSTRUCT]].hTileSurface;
  OStructs2[6].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[6].usEnd = 0;
  OStructs2[6].uiObjIndx = Enum313.FIRSTDEBRISSTRUCT;

  OStructs2[7].ubType = DISPLAY_GRAPHIC;
  OStructs2[7].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.SECONDDEBRISSTRUCT]].hTileSurface;
  OStructs2[7].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[7].usEnd = 0;
  OStructs2[7].uiObjIndx = Enum313.SECONDDEBRISSTRUCT;

  OStructs2[8].ubType = DISPLAY_GRAPHIC;
  OStructs2[8].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTLARGEEXPDEBRIS]].hTileSurface;
  OStructs2[8].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[8].usEnd = 0;
  OStructs2[8].uiObjIndx = Enum313.FIRSTLARGEEXPDEBRIS;

  OStructs2[9].ubType = DISPLAY_GRAPHIC;
  OStructs2[9].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.SECONDLARGEEXPDEBRIS]].hTileSurface;
  OStructs2[9].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[9].usEnd = 0;
  OStructs2[9].uiObjIndx = Enum313.SECONDLARGEEXPDEBRIS;

  OStructs2[10].ubType = DISPLAY_GRAPHIC;
  OStructs2[10].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.NINTHOSTRUCT]].hTileSurface;
  OStructs2[10].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[10].usEnd = 0;
  OStructs2[10].uiObjIndx = Enum313.NINTHOSTRUCT;

  OStructs2[11].ubType = DISPLAY_GRAPHIC;
  OStructs2[11].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.TENTHOSTRUCT]].hTileSurface;
  OStructs2[11].usStart = DISPLAY_ALL_OBJECTS;
  OStructs2[11].usEnd = 0;
  OStructs2[11].uiObjIndx = Enum313.TENTHOSTRUCT;

  // River banks and cliffs (the "river" button on the "terrain" toolbar)
  BanksList[0].ubType = DISPLAY_GRAPHIC;
  BanksList[0].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.ANIOSTRUCT]].hTileSurface;
  BanksList[0].usStart = DISPLAY_ALL_OBJECTS;
  BanksList[0].usEnd = 0;
  BanksList[0].uiObjIndx = Enum313.ANIOSTRUCT;

  BanksList[1].ubType = DISPLAY_GRAPHIC;
  BanksList[1].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTCLIFF]].hTileSurface;
  BanksList[1].usStart = DISPLAY_ALL_OBJECTS;
  BanksList[1].usEnd = 0;
  BanksList[1].uiObjIndx = Enum313.FIRSTCLIFF;

  BanksList[2].ubType = DISPLAY_GRAPHIC;
  BanksList[2].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTCLIFFHANG]].hTileSurface;
  BanksList[2].usStart = DISPLAY_ALL_OBJECTS;
  BanksList[2].usEnd = 0;
  BanksList[2].uiObjIndx = Enum313.FIRSTCLIFFHANG;

  BanksList[3].ubType = DISPLAY_GRAPHIC;
  BanksList[3].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTROAD]].hTileSurface;
  BanksList[3].usStart = DISPLAY_ALL_OBJECTS;
  BanksList[3].usEnd = 0;
  BanksList[3].uiObjIndx = Enum313.FIRSTROAD;

  BanksList[4].ubType = DISPLAY_GRAPHIC;
  BanksList[4].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FENCESTRUCT]].hTileSurface;
  BanksList[4].usStart = DISPLAY_ALL_OBJECTS;
  BanksList[4].usEnd = 0;
  BanksList[4].uiObjIndx = Enum313.FENCESTRUCT;

  RoadsList[0].ubType = DISPLAY_GRAPHIC;
  RoadsList[0].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTROAD]].hTileSurface;
  RoadsList[0].usStart = DISPLAY_ALL_OBJECTS;
  RoadsList[0].usEnd = 0;
  RoadsList[0].uiObjIndx = Enum313.FIRSTROAD;

  // Debris (the "bent can" button on the "terrain", and "buildings" toolbars)
  for (iCount = 0; iCount < (LASTDEBRIS - Enum313.DEBRISROCKS + 1); iCount++) {
    DebrisList[iCount].ubType = DISPLAY_GRAPHIC;
    DebrisList[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.DEBRISROCKS + iCount]].hTileSurface;
    DebrisList[iCount].usStart = DISPLAY_ALL_OBJECTS;
    DebrisList[iCount].usEnd = 0;
    DebrisList[iCount].uiObjIndx = Enum313.DEBRISROCKS + iCount;
  }
  // Add one more for new misc debris
  DebrisList[iCount].ubType = DISPLAY_GRAPHIC;
  DebrisList[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.DEBRIS2MISC]].hTileSurface;
  DebrisList[iCount].usStart = DISPLAY_ALL_OBJECTS;
  DebrisList[iCount].usEnd = 0;
  DebrisList[iCount].uiObjIndx = Enum313.DEBRIS2MISC;
  // Add yet another one...
  iCount++;
  DebrisList[iCount].ubType = DISPLAY_GRAPHIC;
  DebrisList[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.ANOTHERDEBRIS]].hTileSurface;
  DebrisList[iCount].usStart = DISPLAY_ALL_OBJECTS;
  DebrisList[iCount].usEnd = 0;
  DebrisList[iCount].uiObjIndx = Enum313.ANOTHERDEBRIS;

  // Rooms
  for (iCount = 0; iCount < (LASTWALL - Enum313.FIRSTWALL + 1); iCount++) {
    Room[iCount].ubType = DISPLAY_GRAPHIC;
    Room[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALL + iCount]].hTileSurface;
    Room[iCount].usStart = 0;
    Room[iCount].usEnd = 0;
    Room[iCount].uiObjIndx = Enum313.FIRSTWALL + iCount;
  }
  for (iCount2 = 0; iCount2 < (LASTFLOOR - Enum313.FIRSTFLOOR + 1); iCount2++, iCount++) {
    Room[iCount].ubType = DISPLAY_GRAPHIC;
    Room[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTFLOOR + iCount2]].hTileSurface;
    Room[iCount].usStart = 0;
    Room[iCount].usEnd = 0;
    Room[iCount].uiObjIndx = Enum313.FIRSTFLOOR + iCount2;
  }
  for (iCount2 = 0; iCount2 < (LASTROOF - Enum313.FIRSTROOF + 1); iCount2++, iCount++) {
    Room[iCount].ubType = DISPLAY_GRAPHIC;
    Room[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTROOF + iCount2]].hTileSurface;
    Room[iCount].usStart = 0;
    Room[iCount].usEnd = 0;
    Room[iCount].uiObjIndx = Enum313.FIRSTROOF + iCount2;
  }
  for (iCount2 = 0; iCount2 < 2 /*(LASTSLANTROOF - FIRSTSLANTROOF + 1)*/; iCount2++, iCount++) {
    Room[iCount].ubType = DISPLAY_GRAPHIC;
    Room[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTSLANTROOF + iCount2]].hTileSurface;
    Room[iCount].usStart = 0;
    Room[iCount].usEnd = 0;
    Room[iCount].uiObjIndx = Enum313.FIRSTSLANTROOF + iCount2;
  }

  // Walls
  for (iCount = 0, iCount2 = 0; iCount < (LASTWALL - Enum313.FIRSTWALL + 1); iCount++, iCount2 += 2) {
    SingleWall[iCount2].ubType = DISPLAY_GRAPHIC;
    SingleWall[iCount2].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALL + iCount]].hTileSurface;
    SingleWall[iCount2].usStart = 0;
    SingleWall[iCount2].usEnd = WALL_LAST_WALL_OFFSET;
    SingleWall[iCount2].uiObjIndx = Enum313.FIRSTWALL + iCount;
    // New appended walls
    SingleWall[iCount2 + 1].ubType = DISPLAY_GRAPHIC;
    SingleWall[iCount2 + 1].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALL + iCount]].hTileSurface;
    SingleWall[iCount2 + 1].usStart = WALL_FIRST_APPENDED_WALL_OFFSET;
    SingleWall[iCount2 + 1].usEnd = WALL_LAST_APPENDED_WALL_OFFSET;
    SingleWall[iCount2 + 1].uiObjIndx = Enum313.FIRSTWALL + iCount;
  }

  // Doors
  for (iCount = 0, iCount2 = 0; iCount < (LASTDOOR - Enum313.FIRSTDOOR + 1); iCount++, iCount2 += 5) {
    // closed
    SingleDoor[iCount2].ubType = DISPLAY_GRAPHIC;
    SingleDoor[iCount2].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTDOOR + iCount]].hTileSurface;
    SingleDoor[iCount2].usStart = 0;
    SingleDoor[iCount2].usEnd = 0;
    SingleDoor[iCount2].uiObjIndx = Enum313.FIRSTDOOR + iCount;
    // open, closed
    SingleDoor[iCount2 + 1].ubType = DISPLAY_GRAPHIC;
    SingleDoor[iCount2 + 1].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTDOOR + iCount]].hTileSurface;
    SingleDoor[iCount2 + 1].usStart = 4;
    SingleDoor[iCount2 + 1].usEnd = 5;
    SingleDoor[iCount2 + 1].uiObjIndx = Enum313.FIRSTDOOR + iCount;
    // open, closed
    SingleDoor[iCount2 + 2].ubType = DISPLAY_GRAPHIC;
    SingleDoor[iCount2 + 2].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTDOOR + iCount]].hTileSurface;
    SingleDoor[iCount2 + 2].usStart = 9;
    SingleDoor[iCount2 + 2].usEnd = 10;
    SingleDoor[iCount2 + 2].uiObjIndx = Enum313.FIRSTDOOR + iCount;
    // open, closed
    SingleDoor[iCount2 + 3].ubType = DISPLAY_GRAPHIC;
    SingleDoor[iCount2 + 3].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTDOOR + iCount]].hTileSurface;
    SingleDoor[iCount2 + 3].usStart = 14;
    SingleDoor[iCount2 + 3].usEnd = 15;
    SingleDoor[iCount2 + 3].uiObjIndx = Enum313.FIRSTDOOR + iCount;
    // open
    SingleDoor[iCount2 + 4].ubType = DISPLAY_GRAPHIC;
    SingleDoor[iCount2 + 4].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTDOOR + iCount]].hTileSurface;
    SingleDoor[iCount2 + 4].usStart = 19;
    SingleDoor[iCount2 + 4].usEnd = 19;
    SingleDoor[iCount2 + 4].uiObjIndx = Enum313.FIRSTDOOR + iCount;
  }
  // Windows
  for (iCount = 0; iCount < (LASTWALL - Enum313.FIRSTWALL + 1); iCount++) {
    SingleWindow[iCount].ubType = DISPLAY_GRAPHIC;
    SingleWindow[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALL + iCount]].hTileSurface;
    SingleWindow[iCount].usStart = WALL_FIRST_WINDOW_OFFSET;
    SingleWindow[iCount].usEnd = WALL_LAST_WINDOW_OFFSET;
    SingleWindow[iCount].uiObjIndx = Enum313.FIRSTWALL + iCount;
  }
  // Roofs and slant roofs
  for (iCount = 0; iCount < (LASTROOF - Enum313.FIRSTROOF + 1); iCount++) {
    // Flat roofs
    SingleRoof[iCount].ubType = DISPLAY_GRAPHIC;
    SingleRoof[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTROOF + iCount]].hTileSurface;
    SingleRoof[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleRoof[iCount].usEnd = 0;
    SingleRoof[iCount].uiObjIndx = Enum313.FIRSTROOF + iCount;
  }
  for (iCount2 = 0; iCount2 < (LASTSLANTROOF - Enum313.FIRSTSLANTROOF + 1); iCount2++, iCount++) {
    // Slanted roofs
    SingleRoof[iCount].ubType = DISPLAY_GRAPHIC;
    SingleRoof[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTSLANTROOF + iCount2]].hTileSurface;
    SingleRoof[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleRoof[iCount].usEnd = 0;
    SingleRoof[iCount].uiObjIndx = Enum313.FIRSTSLANTROOF + iCount2;
  }
  for (iCount2 = 0; iCount2 < (LASTWALL - Enum313.FIRSTWALL + 1); iCount2++, iCount++) {
    // A-Frames
    SingleRoof[iCount].ubType = DISPLAY_GRAPHIC;
    SingleRoof[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALL + iCount2]].hTileSurface;
    SingleRoof[iCount].usStart = WALL_FIRST_AFRAME_OFFSET;
    SingleRoof[iCount].usEnd = WALL_LAST_AFRAME_OFFSET;
    SingleRoof[iCount].uiObjIndx = Enum313.FIRSTWALL + iCount2;
  }
  for (iCount2 = 0; iCount2 < (Enum313.SECONDONROOF - Enum313.FIRSTONROOF + 1); iCount2++, iCount++) {
    // On roofs
    SingleRoof[iCount].ubType = DISPLAY_GRAPHIC;
    SingleRoof[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTONROOF + iCount2]].hTileSurface;
    SingleRoof[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleRoof[iCount].usEnd = 0;
    SingleRoof[iCount].uiObjIndx = Enum313.FIRSTONROOF + iCount2;
  }

  // New replacement roofs
  for (iCount = 0; iCount < (LASTROOF - Enum313.FIRSTROOF + 1); iCount++) {
    // Flat roofs
    SingleNewRoof[iCount].ubType = DISPLAY_GRAPHIC;
    SingleNewRoof[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTROOF + iCount]].hTileSurface;
    SingleNewRoof[iCount].usStart = 9;
    SingleNewRoof[iCount].usEnd = 9;
    SingleNewRoof[iCount].uiObjIndx = Enum313.FIRSTROOF + iCount;
  }

  // Broken walls
  for (iCount = 0; iCount < (LASTDECORATIONS - Enum313.FIRSTDECORATIONS + 1); iCount++) {
    // Old obsolete wall decals, but should be replaced with multitiled decals such as banners, etc.
    SingleBrokenWall[iCount].ubType = DISPLAY_GRAPHIC;
    SingleBrokenWall[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTDECORATIONS + iCount]].hTileSurface;
    SingleBrokenWall[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleBrokenWall[iCount].usEnd = 0;
    SingleBrokenWall[iCount].uiObjIndx = Enum313.FIRSTDECORATIONS + iCount;
  }
  for (iCount2 = 0; iCount2 < (LASTWALL - Enum313.FIRSTWALL + 1); iCount2++, iCount++) {
    // Broken walls
    SingleBrokenWall[iCount].ubType = DISPLAY_GRAPHIC;
    SingleBrokenWall[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALL + iCount2]].hTileSurface;
    SingleBrokenWall[iCount].usStart = WALL_FIRST_BROKEN_WALL_OFFSET;
    SingleBrokenWall[iCount].usEnd = WALL_LAST_BROKEN_WALL_OFFSET;
    SingleBrokenWall[iCount].uiObjIndx = Enum313.FIRSTWALL + iCount2;
  }
  for (iCount2 = 0; iCount2 < (LASTWALL - Enum313.FIRSTWALL + 1); iCount2++, iCount++) {
    // Cracked and smudged walls
    SingleBrokenWall[iCount].ubType = DISPLAY_GRAPHIC;
    SingleBrokenWall[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALL + iCount2]].hTileSurface;
    SingleBrokenWall[iCount].usStart = WALL_FIRST_WEATHERED_WALL_OFFSET;
    SingleBrokenWall[iCount].usEnd = WALL_LAST_WEATHERED_WALL_OFFSET;
    SingleBrokenWall[iCount].uiObjIndx = Enum313.FIRSTWALL + iCount2;
  }

  // Decorations
  for (iCount = 0; iCount < (LASTISTRUCT - Enum313.FIRSTISTRUCT + 1); iCount++) {
    SingleDecor[iCount].ubType = DISPLAY_GRAPHIC;
    SingleDecor[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTISTRUCT + iCount]].hTileSurface;
    SingleDecor[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleDecor[iCount].usEnd = 0;
    SingleDecor[iCount].uiObjIndx = Enum313.FIRSTISTRUCT + iCount;
  }

  // Wall decals
  for (iCount = 0; iCount < (LASTWALLDECAL - Enum313.FIRSTWALLDECAL + 1); iCount++) {
    SingleDecal[iCount].ubType = DISPLAY_GRAPHIC;
    SingleDecal[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTWALLDECAL + iCount]].hTileSurface;
    SingleDecal[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleDecal[iCount].usEnd = 0;
    SingleDecal[iCount].uiObjIndx = Enum313.FIRSTWALLDECAL + iCount;
  }
  for (iCount2 = 0; iCount2 < (Enum313.EIGTHWALLDECAL - Enum313.FIFTHWALLDECAL + 1); iCount++, iCount2++) {
    SingleDecal[iCount].ubType = DISPLAY_GRAPHIC;
    SingleDecal[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIFTHWALLDECAL + iCount2]].hTileSurface;
    SingleDecal[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleDecal[iCount].usEnd = 0;
    SingleDecal[iCount].uiObjIndx = Enum313.FIFTHWALLDECAL + iCount2;
  }
  SingleDecal[iCount].ubType = DISPLAY_GRAPHIC;
  SingleDecal[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTSWITCHES]].hTileSurface;
  SingleDecal[iCount].usStart = DISPLAY_ALL_OBJECTS;
  SingleDecal[iCount].usEnd = 0;
  SingleDecal[iCount].uiObjIndx = Enum313.FIRSTSWITCHES;

  // Floors
  for (iCount = 0; iCount < (LASTFLOOR - Enum313.FIRSTFLOOR + 1); iCount++) {
    SingleFloor[iCount].ubType = DISPLAY_GRAPHIC;
    SingleFloor[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIRSTFLOOR + iCount]].hTileSurface;
    SingleFloor[iCount].usStart = 0;
    SingleFloor[iCount].usEnd = 7;
    SingleFloor[iCount].uiObjIndx = Enum313.FIRSTFLOOR + iCount;
  }

  // Toilets
  for (iCount = 0; iCount < (Enum313.EIGHTISTRUCT - Enum313.FIFTHISTRUCT + 1); iCount++) {
    SingleToilet[iCount].ubType = DISPLAY_GRAPHIC;
    SingleToilet[iCount].hVObject = gTileDatabase[gTileTypeStartIndex[Enum313.FIFTHISTRUCT + iCount]].hTileSurface;
    SingleToilet[iCount].usStart = DISPLAY_ALL_OBJECTS;
    SingleToilet[iCount].usEnd = 0;
    SingleToilet[iCount].uiObjIndx = Enum313.FIFTHISTRUCT + iCount;
  }
}

//----------------------------------------------------------------------------------------------
//	ShutdownJA2SelectionWindow
//
//	Unloads selection window button images and makes sure any display list that may remain in memory
//	is removed.
//
export function ShutdownJA2SelectionWindow(): void {
  let x: INT16;

  for (x = 0; x < 4; x++)
    UnloadGenericButtonIcon(iButtonIcons[x]);

  if (pDispList != null) {
    pDispList = <DisplayList>TrashList(pDispList);
  }
  gfRenderWorld = true;
}

//----------------------------------------------------------------------------------------------
//	RemoveJA2SelectionWindow
//
//	Removes the selection window from the screen.
//
export function RemoveJA2SelectionWindow(): void {
  RemoveButton(iSelectWin);
  RemoveButton(iCancelWin);
  RemoveButton(iScrollUp);
  RemoveButton(iScrollDown);
  RemoveButton(iOkWin);

  gfRenderSquareArea = false;

  if (pDispList != null) {
    pDispList = <DisplayList>TrashList(pDispList);
  }
  gfRenderTaskbar = true;

  gfOverheadMapDirty = true;
  EnableEditorTaskbar();
}

//----------------------------------------------------------------------------------------------
//	TrashList
//
//	Free the current display list for the selection window.
//
function TrashList(pNode: DisplayList | null): DisplayList | null {
  if (pNode == null)
    return null;

  if (pNode.pNext != null)
    pNode.pNext = TrashList(pNode.pNext);

  return null;
}

//----------------------------------------------------------------------------------------------
//	RenderSelectionWindow
//
//	Displays the current selection window
//
/* static */ let RenderSelectionWindow__usFillGreen: UINT8 = 0;
/* static */ let RenderSelectionWindow__usDir: UINT8 = 5;
export function RenderSelectionWindow(): void {
  let button: GUI_BUTTON;
  let iSX: INT32;
  let iSY: INT32;
  let iEX: INT32;
  let iEY: INT32;
  let usFillColor: UINT16;

  if (!fButtonsPresent)
    return;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 600, 400, GenericButtonFillColors[0]);
  DrawSelections();
  MarkButtonsDirty();
  RenderButtons();

  if (gfRenderSquareArea) {
    button = ButtonList[iSelectWin];
    if (button == null)
      return;

    if ((Math.abs(iStartClickX - button.Area.MouseXPos) > 9) || (Math.abs(iStartClickY - (button.Area.MouseYPos + iTopWinCutOff - SelWinStartPoint.iY)) > 9)) {
      //			iSX = (INT32)iStartClickX;
      //			iEX = (INT32)button->Area.MouseXPos;
      //			iSY = (INT32)iStartClickY;
      //			iEY = (INT32)(button->Area.MouseYPos + iTopWinCutOff - (INT16)SelWinStartPoint.iY);

      iSX = iStartClickX;
      iSY = iStartClickY - iTopWinCutOff + SelWinStartPoint.iY;
      iEX = gusMouseXPos;
      iEY = gusMouseYPos;

      if (iEX < iSX) {
        iEX ^= iSX;
        iSX ^= iEX;
        iEX ^= iSX;
      }

      if (iEY < iSY) {
        iEY ^= iSY;
        iSY ^= iEY;
        iEY ^= iSY;
      }

      iEX = Math.min(iEX, 600);
      iSY = Math.max(SelWinStartPoint.iY, iSY);
      iEY = Math.min(359, iEY);
      iEY = Math.max(SelWinStartPoint.iY, iEY);

      usFillColor = Get16BPPColor(FROMRGB(255, RenderSelectionWindow__usFillGreen, 0));
      RenderSelectionWindow__usFillGreen += RenderSelectionWindow__usDir;
      if (RenderSelectionWindow__usFillGreen > 250)
        RenderSelectionWindow__usDir = 251;
      else if (RenderSelectionWindow__usFillGreen < 5)
        RenderSelectionWindow__usDir = 5;

      ColorFillVideoSurfaceArea(FRAME_BUFFER, iSX, iSY, iEX, iSY + 1, usFillColor);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, iSX, iEY, iEX, iEY + 1, usFillColor);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, iSX, iSY, iSX + 1, iEY, usFillColor);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, iEX, iSY, iEX + 1, iEY, usFillColor);
    }
  }
}

//----------------------------------------------------------------------------------------------
//	SelWinClkCallback
//
//	Button callback function for the main selection window. Checks if user clicked on an image,
//	if so selects or de-selects that object. Also handles the multi-object selection (left-click
//	and drag to get the selection rectangle)
//
function SelWinClkCallback(button: GUI_BUTTON, reason: INT32): void {
  let pNode: DisplayList | null;
  let fDone: boolean;
  let iClickX: INT16;
  let iClickY: INT16;
  let iYInc: INT16;
  let iXInc: INT16;

  if (!(button.uiFlags & BUTTON_ENABLED))
    return;

  iClickX = button.Area.MouseXPos;
  iClickY = button.Area.MouseYPos + iTopWinCutOff - SelWinStartPoint.iY;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    button.uiFlags |= BUTTON_CLICKED_ON;
    iStartClickX = iClickX;
    iStartClickY = iClickY;
    gfRenderSquareArea = true;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    button.uiFlags |= BUTTON_CLICKED_ON;

    if (gfRenderSquareArea) {
      gfRenderSquareArea = false;
      return;
    }

    // Code to figure out what image user wants goes here
    pNode = pDispList;

    fDone = false;
    while ((pNode != null) && !fDone) {
      if ((iClickX >= pNode.iX) && (iClickX < (pNode.iX + pNode.iWidth)) && (iClickY >= pNode.iY) && (iClickY < (pNode.iY + pNode.iHeight))) {
        fDone = true;
        if (RemoveFromSelectionList(pNode))
          pNode.fChosen = false;
      } else
        pNode = pNode.pNext;
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    button.uiFlags &= (~BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    button.uiFlags &= (~BUTTON_CLICKED_ON);

    if (!gfRenderSquareArea)
      return;

    iEndClickX = iClickX;
    iEndClickY = iClickY;

    gfRenderSquareArea = false;

    if (iEndClickX < iStartClickX) {
      iStartClickX ^= iEndClickX;
      iEndClickX ^= iStartClickX;
      iStartClickX ^= iEndClickX;
    }

    if (iEndClickY < iStartClickY) {
      iStartClickY ^= iEndClickY;
      iEndClickY ^= iStartClickY;
      iStartClickY ^= iEndClickY;
    }

    iXInc = iYInc = 1;
    for (iClickY = iStartClickY; iClickY <= iEndClickY; iClickY += iYInc) {
      iYInc = 1;
      for (iClickX = iStartClickX; iClickX <= iEndClickX; iClickX += iXInc) {
        iXInc = 1;
        // Code to figure out what image user wants goes here
        pNode = pDispList;

        fDone = false;
        while ((pNode != null) && !fDone) {
          if ((iClickX >= pNode.iX) && (iClickX < (pNode.iX + pNode.iWidth)) && (iClickY >= pNode.iY) && (iClickY < (pNode.iY + pNode.iHeight))) {
            fDone = true;
            AddToSelectionList(pNode);
            pNode.fChosen = true;
            iXInc = (pNode.iX + pNode.iWidth) - iClickX;
            if (iYInc < ((pNode.iY + pNode.iHeight) - iClickY))
              iYInc = (pNode.iY + pNode.iHeight) - iClickY;
          } else
            pNode = pNode.pNext;
        }
      }
    }
  }
}

// When a selection window is up, the file information of the picture will display
// at the top of the screen.
export function DisplaySelectionWindowGraphicalInformation(): void {
  let pNode: DisplayList | null;
  let fDone: boolean;
  // UINT16 usObjIndex, usIndex;
  let y: UINT16;
  // Determine if there is a valid picture at cursor position.
  // iRelX = gusMouseXPos;
  // iRelY = gusMouseYPos + iTopWinCutOff - (INT16)SelWinStartPoint.iY;

  y = gusMouseYPos + iTopWinCutOff - SelWinStartPoint.iY;
  pNode = pDispList;
  fDone = false;
  while ((pNode != null) && !fDone) {
    if ((gusMouseXPos >= pNode.iX) && (gusMouseXPos < (pNode.iX + pNode.iWidth)) && (y >= pNode.iY) && (y < (pNode.iY + pNode.iHeight))) {
      fDone = true;
      // pNode->fChosen = TRUE;
      // iXInc = (pNode->iX + pNode->iWidth) - iClickX;
      // if ( iYInc < ((pNode->iY + pNode->iHeight) - iClickY) )
      //	iYInc = (pNode->iY + pNode->iHeight) - iClickY;
    } else
      pNode = pNode.pNext;
  }
  SetFont(FONT12POINT1());
  SetFontForeground(FONT_WHITE);
  if (pNode) {
    // usObjIndex = (UINT16)pNode->uiObjIndx;
    // usIndex = pNode->uiIndex;
    if (!gTilesets[giCurrentTilesetID].TileSurfaceFilenames[pNode.uiObjIndx][0]) {
      mprintf(2, 2, "%s[%d] is from default tileset %s (%s)", gTilesets[0].TileSurfaceFilenames[pNode.uiObjIndx], pNode.uiIndex, gTilesets[0].zName, gTileSurfaceName[pNode.uiObjIndx]);
    } else {
      mprintf(2, 2, "File:  %s, subindex:  %d (%s)", gTilesets[giCurrentTilesetID].TileSurfaceFilenames[pNode.uiObjIndx], pNode.uiIndex, gTileSurfaceName[pNode.uiObjIndx]);
    }
  }
  mprintf(350, 2, "Current Tileset:  %s", gTilesets[giCurrentTilesetID].zName);
}

//----------------------------------------------------------------------------------------------
//	AddToSelectionList
//
//	Add an object in the display list to the selection list. If the object already exists in the
//	selection list, then it's count is incremented.
//
function AddToSelectionList(pNode: DisplayList): void {
  let iIndex: INT32;
  let iUseIndex: INT32 = 0;
  let fDone: boolean;

  fDone = false;
  for (iIndex = 0; iIndex < (pNumSelList.value) && !fDone; iIndex++) {
    if (pNode.uiObjIndx == pSelList[iIndex].uiObject && pNode.uiIndex == pSelList[iIndex].usIndex) {
      fDone = true;
      iUseIndex = iIndex;
    }
  }

  if (fDone) {
    // Was already in the list, so bump up the count
    pSelList[iUseIndex].sCount++;
  } else {
    // Wasn't in the list, so add to end (if space available)
    if ((pNumSelList.value) < MAX_SELECTIONS) {
      pSelList[(pNumSelList.value)].uiObject = pNode.uiObjIndx;
      pSelList[(pNumSelList.value)].usIndex = pNode.uiIndex;
      pSelList[(pNumSelList.value)].sCount = 1;

      (pNumSelList.value)++;
    }
  }
}

//----------------------------------------------------------------------------------------------
//	ClearSelectionList
//
//	Removes everything from the current selection list
//
export function ClearSelectionList(): boolean {
  let iIndex: INT32;
  let pNode: DisplayList | null;

  if (pNumSelList == null)
    return false;

  pNode = pDispList;
  while (pNode != null) {
    pNode.fChosen = false;
    pNode = pNode.pNext;
  }

  for (iIndex = 0; iIndex < (pNumSelList.value); iIndex++)
    pSelList[iIndex].sCount = 0;

  (pNumSelList.value) = 0;
  return true;
}

//----------------------------------------------------------------------------------------------
//	RemoveFromSelectionList
//
//	Removes the object given n a display list from the selection list. If the objects count is
//	greater than one, then the count is decremented and the object remains in the list.
//
function RemoveFromSelectionList(pNode: DisplayList): boolean {
  let iIndex: INT32;
  let iUseIndex: INT32 = 0;
  let fDone: boolean;
  let fRemoved: boolean;

  // Abort if no entries in list (pretend we removed a node)
  if ((pNumSelList.value) <= 0)
    return true;

  fRemoved = false;
  fDone = false;
  for (iIndex = 0; iIndex < (pNumSelList.value) && !fDone; iIndex++) {
    if (pNode.uiObjIndx == pSelList[iIndex].uiObject && pNode.uiIndex == pSelList[iIndex].usIndex) {
      fDone = true;
      iUseIndex = iIndex;
    }
  }

  if (fDone) {
    // Was already in the list, so bump up the count
    pSelList[iUseIndex].sCount--;

    if (pSelList[iUseIndex].sCount <= 0) {
      // Squash the list to remove old entry
      for (iIndex = iUseIndex; iIndex < ((pNumSelList.value) - 1); iIndex++)
        pSelList[iIndex] = pSelList[iIndex + 1];

      (pNumSelList.value)--;
      fRemoved = true;
    }
  }

  return fRemoved;
}

//----------------------------------------------------------------------------------------------
//	GetRandomSelection
//
//	Randomly selects an item in the selection list. The object counts are taken into account so
//	that objects with higher counts will be chosen more often.
//
export function GetRandomSelection(): INT32 {
  let iRandNum: INT32;
  let iTotalCounts: INT32;
  let iIndex: INT32;
  let iSelectedIndex: INT32;
  let iNextCount: INT32;

  if (fDontUseRandom) {
    fDontUseRandom = false;
    return iCurBank;
  }

  iTotalCounts = 0;
  for (iIndex = 0; iIndex < (pNumSelList.value); iIndex++)
    iTotalCounts += pSelList[iIndex].sCount;

  iRandNum = Random(iTotalCounts);

  iSelectedIndex = -1;
  iNextCount = 0;
  for (iIndex = 0; iIndex < (pNumSelList.value) && iSelectedIndex == -1; iIndex++) {
    iNextCount += pSelList[iIndex].sCount;
    if (iRandNum < iNextCount)
      iSelectedIndex = iIndex;
  }

  return iSelectedIndex;
}

//----------------------------------------------------------------------------------------------
//	IsInSelectionList
//
//	Verifies if a particular display list object exists in the current selection list.
//
function IsInSelectionList(pNode: DisplayList): boolean {
  let iIndex: INT32;
  let fFound: boolean;

  fFound = false;
  for (iIndex = 0; iIndex < (pNumSelList.value) && !fFound; iIndex++) {
    if (pNode.uiObjIndx == pSelList[iIndex].uiObject && pNode.uiIndex == pSelList[iIndex].usIndex) {
      fFound = true;
    }
  }

  return fFound;
}

//----------------------------------------------------------------------------------------------
//	FindInSelectionList
//
//	Finds an occurance of a particular display list object in the current selection list.
//	if found, returns the selection list's index where it can be found. otherwise it
//	returns -1
//
function FindInSelectionList(pNode: DisplayList): INT32 {
  let iIndex: INT32;
  let iUseIndex: INT32;
  let fFound: boolean;

  fFound = false;
  iUseIndex = -1;
  for (iIndex = 0; iIndex < (pNumSelList.value) && !fFound; iIndex++) {
    if (pNode.uiObjIndx == pSelList[iIndex].uiObject && pNode.uiIndex == pSelList[iIndex].usIndex) {
      fFound = true;
      iUseIndex = iIndex;
    }
  }

  return iUseIndex;
}

//----------------------------------------------------------------------------------------------
//	SaveSelectionList
//
//	Copies the current selection list to a save buffer. Used in case we want to cancel a
//	selection window.
//
function SaveSelectionList(): void {
  let iIndex: INT32;

  for (iIndex = 0; iIndex < MAX_SELECTIONS; iIndex++)
    OldSelList[iIndex] = pSelList[iIndex];

  iOldNumSelList = (pNumSelList.value);
}

//----------------------------------------------------------------------------------------------
//	RestoreSelectionList
//
//	Copies the selection list in the save buffer back to the current selection list.
//
export function RestoreSelectionList(): void {
  let iIndex: INT32;

  for (iIndex = 0; iIndex < MAX_SELECTIONS; iIndex++)
    pSelList[iIndex] = OldSelList[iIndex];

  (pNumSelList.value) = iOldNumSelList;
}

//----------------------------------------------------------------------------------------------
//	OkClkCallback
//
//	Button callback function for the selection window's OK button
function OkClkCallback(button: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    button.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    button.uiFlags &= (~BUTTON_CLICKED_ON);
    fAllDone = true;
  }
}

//----------------------------------------------------------------------------------------------
//	CnclClkCallback
//
//	Button callback function for the selection window's CANCEL button
//
function CnclClkCallback(button: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    button.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    button.uiFlags &= (~BUTTON_CLICKED_ON);
    fAllDone = true;
    RestoreSelectionList();
  }
}

//----------------------------------------------------------------------------------------------
//	UpClkCallback
//
//	Button callback function for scrolling the selection window up
//
function UpClkCallback(button: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    button.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    button.uiFlags &= (~BUTTON_CLICKED_ON);
    ScrollSelWinUp();
  }
}

//----------------------------------------------------------------------------------------------
//	ScrollSelWinUp
//
//	Performs the calculations required to actually scroll a selection window up by one line.
//
export function ScrollSelWinUp(): void {
  let pNode: DisplayList | null;
  let iCutOff: INT16;
  let iBotCutOff: INT16;
  let fDone: boolean;

  // Code to scroll window up!
  pNode = pDispList;
  iCutOff = iTopWinCutOff;

  fDone = false;
  while ((pNode != null) && !fDone) {
    if (pNode.iY >= iTopWinCutOff) {
      iCutOff = pNode.iY;
      pNode = pNode.pNext;
    } else {
      iCutOff = pNode.iY;
      fDone = true;
    }
  }

  iBotCutOff = iBotWinCutOff - iTopWinCutOff + iCutOff;
  iTopWinCutOff = iCutOff;
}

//----------------------------------------------------------------------------------------------
//	ScrollSelWinDown
//
//	Performs the actual calculations for scrolling a selection window down.
//
export function ScrollSelWinDown(): void {
  let pNode: DisplayList | null;
  let iCutOff: INT16;
  let iBotCutOff: INT16;
  let fDone: boolean;

  pNode = pDispList;
  iCutOff = iTopWinCutOff;

  fDone = false;
  while ((pNode != null) && !fDone) {
    if (pNode.iY > iTopWinCutOff) {
      iCutOff = pNode.iY;
      pNode = pNode.pNext;
    } else
      fDone = true;
  }

  iBotCutOff = iBotWinCutOff - iTopWinCutOff + iCutOff;
  iTopWinCutOff = iCutOff;
}

//----------------------------------------------------------------------------------------------
//	DwnClkCallback
//
//	Button callback function to scroll the selection window down.
//
function DwnClkCallback(button: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    button.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    button.uiFlags &= (~BUTTON_CLICKED_ON);
    ScrollSelWinDown();
  }
}

//----------------------------------------------------------------------------------------------
//	DrawSelections
//
//	Displays the objects in the display list to the selection window.
//
function DrawSelections(): void {
  let ClipRect: SGPRect = createSGPRect();
  let NewRect: SGPRect = createSGPRect();

  NewRect.iLeft = SelWinStartPoint.iX;
  NewRect.iTop = SelWinStartPoint.iY;
  NewRect.iRight = SelWinEndPoint.iX;
  NewRect.iBottom = SelWinEndPoint.iY;

  GetClippingRect(ClipRect);
  SetClippingRect(NewRect);

  //	SetFont( gpSmallFont );
  SetFont(gpLargeFontType1);
  SetObjectShade(gvoLargeFontType1, 0);
  //	SetObjectShade( gvoLargeFont, 0 );

  DisplayWindowFunc(pDispList, iTopWinCutOff, iBotWinCutOff, SelWinStartPoint, CLEAR_BACKGROUND);

  SetObjectShade(gvoLargeFontType1, 4);

  SetClippingRect(ClipRect);
}

//----------------------------------------------------------------------------------------------
//	BuildDisplayWindow
//
//	Creates a display list from a display specification list. It also sets variables up for
//	properly scrolling the window etc.
//
function BuildDisplayWindow(pDisplaySpecs: DisplaySpec[], usNumSpecs: UINT16, pDisplayList: Pointer<DisplayList>, pUpperLeft: SGPPoint, pBottomRight: SGPPoint, pSpacing: SGPPoint, fFlags: UINT16): boolean {
  let iCurrX: INT32 = pUpperLeft.iX;
  let iCurrY: INT32 = pUpperLeft.iY;
  let usGreatestHeightInRow: UINT16 = 0;
  let usSpecLoop: UINT16;
  let usETRLELoop: UINT16;
  let usETRLEStart: UINT16;
  let usETRLEEnd: UINT16;
  let pDisplaySpec: DisplaySpec;
  let pETRLEObject: ETRLEObject;
  let pCurNode: DisplayList;

  SaveSelectionList();

  for (usSpecLoop = 0; usSpecLoop < usNumSpecs; usSpecLoop++) {
    pDisplaySpec = pDisplaySpecs[usSpecLoop];
    if (pDisplaySpec.ubType == DISPLAY_GRAPHIC) {
      if (!pDisplaySpec.hVObject)
        return false;
      usETRLEStart = pDisplaySpec.usStart;
      usETRLEEnd = pDisplaySpec.usEnd;

      if (usETRLEStart == DISPLAY_ALL_OBJECTS) {
        usETRLEStart = 0;
        usETRLEEnd = pDisplaySpec.hVObject.usNumberOfObjects - 1;
      }

      if (usETRLEStart > usETRLEEnd)
        return false;
      if (usETRLEEnd >= pDisplaySpec.hVObject.usNumberOfObjects)
        return false;

      for (usETRLELoop = usETRLEStart; usETRLELoop <= usETRLEEnd; usETRLELoop++) {
        pETRLEObject = pDisplaySpec.hVObject.pETRLEObject[usETRLELoop];

        if ((iCurrX + pETRLEObject.usWidth > pBottomRight.iX) || (fFlags & ONE_COLUMN)) {
          if (fFlags & ONE_ROW) {
            break;
          }
          iCurrX = pUpperLeft.iX;
          iCurrY += usGreatestHeightInRow + pSpacing.iY;
          usGreatestHeightInRow = 0;
        }

        if ((pCurNode = createDisplayList()) != null) {
          pCurNode.hObj = pDisplaySpec.hVObject;
          pCurNode.uiIndex = usETRLELoop;
          pCurNode.iX = iCurrX;
          pCurNode.iY = iCurrY;
          pCurNode.iWidth = pETRLEObject.usWidth;
          pCurNode.iHeight = pETRLEObject.usHeight;
          pCurNode.pNext = pDisplayList.value;
          pCurNode.uiObjIndx = pDisplaySpec.uiObjIndx;

          if (IsInSelectionList(pCurNode))
            pCurNode.fChosen = true;
          else
            pCurNode.fChosen = false;

          pDisplayList.value = pCurNode;
        } else
          return false;

        if (pETRLEObject.usHeight > usGreatestHeightInRow) {
          usGreatestHeightInRow = pETRLEObject.usHeight;
        }

        iCurrX += pETRLEObject.usWidth + pSpacing.iX;
      }
    }
  }

  return true;
}

//----------------------------------------------------------------------------------------------
//	DisplayWindowFunc
//
//	Blits the actual object images in the display list on the selection window. The objects that
//	have been selected (in the selection list) are highlighted and the count placed in the upper
//	left corner of the image.
//
function DisplayWindowFunc(pNode: DisplayList | null, iTopCutOff: INT16, iBottomCutOff: INT16, pUpperLeft: SGPPoint, fFlags: UINT16): boolean {
  let iCurrY: INT16;
  let sTempOffsetX: INT16;
  let sTempOffsetY: INT16;
  let fReturnVal: boolean;
  let pETRLEObject: ETRLEObject;
  let usFillColor: UINT16;
  let sCount: INT16;

  if (pNode == null)
    return true;

  if (pNode.iY < iTopCutOff)
    return true;

  fReturnVal = false;
  if (DisplayWindowFunc(pNode.pNext, iTopCutOff, iBottomCutOff, pUpperLeft, fFlags)) {
    iCurrY = pUpperLeft.iY + pNode.iY - iTopCutOff;

    if (iCurrY > iBottomCutOff)
      return true;

    pETRLEObject = pNode.hObj.pETRLEObject[pNode.uiIndex];

    // We have to store the offset data in temp variables before zeroing them and blitting
    sTempOffsetX = pETRLEObject.sOffsetX;
    sTempOffsetY = pETRLEObject.sOffsetY;

    // Set the offsets used for blitting to 0
    pETRLEObject.sOffsetX = 0;
    pETRLEObject.sOffsetY = 0;

    if (fFlags & CLEAR_BACKGROUND) {
      usFillColor = SelWinFillColor;
      if (pNode.fChosen)
        usFillColor = SelWinHilightFillColor;

      ColorFillVideoSurfaceArea(FRAME_BUFFER, pNode.iX, iCurrY, pNode.iX + pNode.iWidth, iCurrY + pNode.iHeight, usFillColor);
    }

    sCount = 0;
    if (pNode.fChosen)
      sCount = pSelList[FindInSelectionList(pNode)].sCount;

    SetObjectShade(pNode.hObj, DEFAULT_SHADE_LEVEL);
    fReturnVal = BltVideoObject(FRAME_BUFFER, pNode.hObj, pNode.uiIndex, pNode.iX, iCurrY, VO_BLT_SRCTRANSPARENCY, null);

    if (sCount != 0) {
      gprintf(pNode.iX, iCurrY, "%d", sCount);
    }

    pETRLEObject.sOffsetX = sTempOffsetX;
    pETRLEObject.sOffsetY = sTempOffsetY;
  }

  return fReturnVal;
}

}
