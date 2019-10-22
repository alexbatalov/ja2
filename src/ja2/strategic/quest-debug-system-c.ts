//#ifdef JA2BETAVERSION

//*******************************
//
//	Defines
//
//*******************************

type DROP_DOWN_DISPLAY_CALLBACK = (a: STR16) => void;
type DROP_DOWN_SELECT_CALLBACK = (a: STR16) => void;

const QUEST_DEBUG_FILE = "QuestDebugRecordLog.txt";

const QUEST_DBS_FONT_TITLE = () => FONT14ARIAL();
const QUEST_DBS_COLOR_TITLE = FONT_MCOLOR_LTGREEN;
const QUEST_DBS_COLOR_SUBTITLE = FONT_MCOLOR_DKGRAY;

const QUEST_DBS_FONT_STATIC_TEXT = () => FONT12ARIAL();
const QUEST_DBS_COLOR_STATIC_TEXT = FONT_MCOLOR_WHITE;

const QUEST_DBS_FONT_DYNAMIC_TEXT = () => FONT12ARIAL();
const QUEST_DBS_COLOR_DYNAMIC_TEXT = FONT_MCOLOR_WHITE;

const QUEST_DBS_FONT_LISTBOX_TEXT = () => FONT12ARIAL();
const QUEST_DBS_COLOR_LISTBOX_TEXT = FONT_MCOLOR_WHITE;

const QUEST_DBS_FONT_TEXT_ENTRY = () => FONT12ARIAL();
const QUEST_DBS_COLOR_TEXT_ENTRY = FONT_MCOLOR_WHITE;

const QUEST_DBS_FIRST_SECTION_WIDTH = 210;
const QUEST_DBS_SECOND_SECTION_WIDTH = 230;
const QUEST_DBS_THIRD_SECTION_WIDTH = 200;

const QUEST_DBS_NUMBER_COL_WIDTH = 40;
const QUEST_DBS_TITLE_COL_WIDTH = 120;
const QUEST_DBS_STATUS_COL_WIDTH = 50;

const QUEST_DBS_FIRST_COL_NUMBER_X = 5;
const QUEST_DBS_FIRST_COL_NUMBER_Y = 50;

const QUEST_DBS_FIRST_COL_TITLE_X = QUEST_DBS_FIRST_COL_NUMBER_X + QUEST_DBS_NUMBER_COL_WIDTH;
const QUEST_DBS_FIRST_COL_TITLE_Y = QUEST_DBS_FIRST_COL_NUMBER_Y;

const QUEST_DBS_FIRST_COL_STATUS_X = QUEST_DBS_FIRST_COL_TITLE_X + QUEST_DBS_TITLE_COL_WIDTH;
const QUEST_DBS_FIRST_COL_STATUS_Y = QUEST_DBS_FIRST_COL_NUMBER_Y;

const QUEST_DBS_SECOND_NUMBER_COL_WIDTH = 40;
const QUEST_DBS_SECOND_TITLE_COL_WIDTH = 140;
const QUEST_DBS_SECOND_STATUS_COL_WIDTH = 50;

const QUEST_DBS_SECOND_COL_NUMBER_X = QUEST_DBS_FIRST_SECTION_WIDTH + 5;
const QUEST_DBS_SECOND_COL_NUMBER_Y = QUEST_DBS_FIRST_COL_NUMBER_Y;

const QUEST_DBS_SECOND_COL_TITLE_X = QUEST_DBS_SECOND_COL_NUMBER_X + QUEST_DBS_NUMBER_COL_WIDTH;
const QUEST_DBS_SECOND_COL_TITLE_Y = QUEST_DBS_SECOND_COL_NUMBER_Y;

const QUEST_DBS_SECOND_COL_STATUS_X = QUEST_DBS_SECOND_COL_TITLE_X + QUEST_DBS_SECOND_TITLE_COL_WIDTH;
const QUEST_DBS_SECOND_COL_STATUS_Y = QUEST_DBS_SECOND_COL_NUMBER_Y;

const QUEST_DBS_SECTION_TITLE_Y = 30;

const QUEST_DBS_MAX_DISPLAYED_ENTRIES = 20; // 25

const QUEST_DBS_THIRD_COL_TITLE_X = QUEST_DBS_FIRST_SECTION_WIDTH + QUEST_DBS_SECOND_SECTION_WIDTH;

const QUEST_DBS_NPC_CHCKBOX_TGL_X = QUEST_DBS_FIRST_SECTION_WIDTH + QUEST_DBS_SECOND_SECTION_WIDTH + 5;
const QUEST_DBS_NPC_CHCKBOX_TGL_Y = QUEST_DBS_FIRST_COL_NUMBER_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_SELECTED_NPC_BUTN_X = QUEST_DBS_NPC_CHCKBOX_TGL_X;
const QUEST_DBS_SELECTED_NPC_BUTN_Y = QUEST_DBS_NPC_CHCKBOX_TGL_Y + 22;

const QUEST_DBS_SELECTED_ITEM_BUTN_X = QUEST_DBS_SELECTED_NPC_BUTN_X; // QUEST_DBS_FIRST_SECTION_WIDTH + QUEST_DBS_SECOND_SECTION_WIDTH + 105
const QUEST_DBS_SELECTED_ITEM_BUTN_Y = QUEST_DBS_SELECTED_NPC_BUTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_LIST_TEXT_OFFSET = 26;

const QUEST_DBS_LIST_BOX_WIDTH = 183; // 80

const QUEST_DBS_SCROLL_BAR_WIDTH = 11;

const QUEST_DBS_SCROLL_ARROW_HEIGHT = 17;

const QUEST_DBS_NUM_INCREMENTS_IN_SCROLL_BAR = 30;

const QUEST_DBS_ADD_NPC_BTN_X = QUEST_DBS_SELECTED_NPC_BUTN_X;
const QUEST_DBS_ADD_NPC_BTN_Y = QUEST_DBS_SELECTED_ITEM_BUTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_ADD_ITEM_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_ADD_ITEM_BTN_Y = QUEST_DBS_ADD_NPC_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_GIVE_ITEM_TO_NPC_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_GIVE_ITEM_TO_NPC_BTN_Y = QUEST_DBS_ADD_ITEM_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_CHANGE_DAY_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_CHANGE_DAY_BTN_Y = QUEST_DBS_GIVE_ITEM_TO_NPC_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_VIEW_NPC_INV_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_VIEW_NPC_INV_BTN_Y = QUEST_DBS_CHANGE_DAY_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_RESTORE_NPC_INV_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_RESTORE_NPC_INV_BTN_Y = QUEST_DBS_VIEW_NPC_INV_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_NPC_LOG_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_NPC_LOG_BTN_Y = QUEST_DBS_RESTORE_NPC_INV_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_NPC_REFRESH_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_NPC_REFRESH_BTN_Y = QUEST_DBS_NPC_LOG_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_START_MERC_TALKING_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_START_MERC_TALKING_BTN_Y = QUEST_DBS_NPC_REFRESH_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_ADD_NPC_TO_TEAM_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_ADD_NPC_TO_TEAM_BTN_Y = QUEST_DBS_START_MERC_TALKING_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_RPC_TO_SAY_SECTOR_DESC_BTN_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_RPC_TO_SAY_SECTOR_DESC_BTN_Y = QUEST_DBS_ADD_NPC_TO_TEAM_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

const QUEST_DBS_NPC_CURRENT_GRIDNO_X = QUEST_DBS_ADD_NPC_BTN_X;
const QUEST_DBS_NPC_CURRENT_GRIDNO_Y = QUEST_DBS_RPC_TO_SAY_SECTOR_DESC_BTN_Y + QUEST_DBS_LIST_TEXT_OFFSET;

// Text Entry Box
const QUEST_DBS_TEB_X = 200;
const QUEST_DBS_TEB_Y = 160;

const QUEST_DBS_TEB_WIDTH = 245;
const QUEST_DBS_TEB_HEIGHT = 140;

const QUEST_DBS_NUM_DISPLAYED_QUESTS = MAX_QUESTS;
const QUEST_DBS_NUM_DISPLAYED_FACTS = 25;

const QUEST_DBS_TEXT_FIELD_WIDTH = 7;

// NPC Inventory Popup box
const QUEST_DBS_NPC_INV_POPUP_X = 150;
const QUEST_DBS_NPC_INV_POPUP_Y = 110;

const QUEST_DBS_NPC_INV_POPUP_WIDTH = 275;
const QUEST_DBS_NPC_INV_POPUP_HEIGHT = 325;

const QUEST_DBS_SIZE_NPC_ARRAY = TOTAL_SOLDIERS;

const QUEST_DBS_FACT_LIST_OFFSET = 28;

const CLOCK_X = 554;
const CLOCK_Y = 459;

const QDS_BUTTON_HEIGHT = 21;

const QDS_CURRENT_QUOTE_NUM_BOX_X = 150;
const QDS_CURRENT_QUOTE_NUM_BOX_Y = 300;
const QDS_CURRENT_QUOTE_NUM_BOX_WIDTH = 285;
const QDS_CURRENT_QUOTE_NUM_BOX_HEIGHT = 80;

//
// drop down list box
//
const enum Enum166 {
  QD_DROP_DOWN_NO_ACTION = 0,
  QD_DROP_DOWN_CREATE,
  QD_DROP_DOWN_DESTROY,
  QD_DROP_DOWN_DISPLAY,
  QD_DROP_DOWN_CANCEL,
}

let QuestStates: STR16[] /* [] */ = [
  "N.S.",
  "In Prog.",
  "Done",
];

let QuestDebugText: STR16[] /* [] */ = [
  "Quest Debug System",
  "Quests",
  "Quest Number",
  "Quest Title",
  "Status",
  "Facts",
  "Fact Number",
  "Desc.",
  "Select Merc",
  "Select Item",
  "NPC RecordLog",
  "Exit Quest Debug",
  "NPC Info",
  "** No Item **",
  "Add Merc To Location",
  "Add Item To Location",
  "Change Day",
  "NPC log Button",
  "Please Enter the grid #",
  "Give Item To NPC",
  "View NPC's Inventory",
  "Please enter the number of days to advance.",
  "NPC Inventory",
  "View NPC's in current sector",
  "No NPC's In Sector",
  "Please Enter New Value for ",
  "0,1,2",
  "0,1",
  "Quest #",
  "Fact #",
  "Pg Facts Up",
  "Pg Facts Down",
  "No Text",
  "CurrentGridNo",
  "Refresh NPC Script",
  "Succesfully Refreshed",
  "Failed Refreshing",
  "Restore All NPC's inventory",
  "Start Merc Talking",
  "Please enter a quote number for the selected merc to start talking from.",
  "RPC is added to team",
  "RPC says Sector Desc",
  "Space:       Toggle Pausing Merc Speech",
  "Left Arrow:  Previous Quote",
  "Right Arrow: Next Quote",
  "ESC:         To Stop the merc from Talking",
  "",
  "",
];

// enums for above strings
const enum Enum167 {
  QUEST_DBS_TITLE = 0,
  QUEST_DBS_QUESTS,
  QUEST_DBS_QUEST_NUMBER,
  QUEST_DBS_QUEST_TITLE,
  QUEST_DBS_STATUS,
  QUEST_DBS_FACTS,
  QUEST_DBS_FACT_NUMBER,
  QUEST_DBS_DESC,
  QUEST_DBS_SELECTED_NPC,
  QUEST_DBS_SELECTED_ITEM,
  QUEST_DBS_NPC_RECORDLOG,
  QUEST_DBS_EXIT_QUEST_DEBUG,
  QUEST_DBS_NPC_INFO,
  QUEST_DBS_NO_ITEM,
  QUEST_DBS_ADD_CURRENT_NPC,
  QUEST_DBS_ADD_CURRENT_ITEM,
  QUEST_DBS_CHANGE_DAY,
  QUEST_DBS_NPC_LOG_BUTTON,
  QUEST_DBS_ENTER_GRID_NUM,
  QUEST_DBS_GIVE_ITEM_TO_NPC,
  QUEST_DBS_VIEW_NPC_INVENTORY,
  QUEST_DBS_PLEASE_ENTER_DAY,
  QUEST_DBS_NPC_INVENTORY,
  QUEST_DBS_VIEW_LOCAL_NPC,
  QUEST_DBS_NO_NPC_IN_SECTOR,
  QUEST_DBS_ENTER_NEW_VALUE,
  QUEST_DBS_0_1_2,
  QUEST_DBS_0_1,
  QUEST_DBS_QUEST_NUM,
  QUEST_DBS_FACT_NUM,
  QUEST_DBS_PG_FACTS_UP,
  QUEST_DBS_PG_FACTS_DOWN,
  QUEST_DBS_NO_TEXT,
  QUEST_DBS_CURRENT_GRIDNO,
  QUEST_DBS_REFRESH_NPC,
  QUEST_DBS_REFRESH_OK,
  QUEST_DBS_REFRESH_FAILED,
  QUEST_DBS_RESTORE_NPC_INVENTORY,
  QUEST_DBS_START_MERC_TALKING,
  QUEST_DBS_START_MERC_TALKING_FROM,
  QUEST_DBS_ADD_NPC_TO_TEAM,
  QUEST_DBS_RPC_SAY_SECTOR_DESC,
  QUEST_DBS_PAUSE_SPEECH,
  QUEST_DBS_LEFT_ARROW_PREVIOUS_QUOTE,
  QUEST_DBS_RIGHT_ARROW_NEXT_QUOTE,
  QUEST_DBS_ESC_TOP_STOP_TALKING,
}

let PocketText: STR16[] /* [] */ = [
  "Helmet",
  "Vest",
  "Leg",
  "Head1",
  "Head2",
  "Hand",
  "Second Hand",
  "Bigpock1",
  "Bigpock2",
  "Bigpock3",
  "Bigpock4",
  "Smallpock1",
  "Smallpock2",
  "Smallpock3",
  "Smallpock4",
  "Smallpock5",
  "Smallpock6",
  "Smallpock7",
  "Smallpock8",
];

//*******************************
//
//	Global Variables
//
//*******************************

type LISTBOX_DISPLAY_FNCTN = () => void; // Define Display Callback function
type TEXT_ENTRY_CALLBACK = (a: INT32) => void; // Callback for when the text entry field is finished

interface SCROLL_BOX {
  DisplayFunction: LISTBOX_DISPLAY_FNCTN; //	The array of items

  usScrollPosX: UINT16; //	Top Left Pos of list box
  usScrollPosY: UINT16; //	Top Left Pos of list box
  usScrollHeight: UINT16; //	Height of list box
  usScrollWidth: UINT16; //	Width of list box

  usScrollBarHeight: UINT16; //	Height of Scroll box
  usScrollBarWidth: UINT16; //	Width of Scroll box
  usScrollBoxY: UINT16; //	Current Vertical location of the scroll box
  usScrollBoxEndY: UINT16; //	Bottom position on the scroll box
  usScrollArrowHeight: UINT16; //	Scroll Arrow height

  sCurSelectedItem: INT16; //	Currently selected item
  usItemDisplayedOnTopOfList: UINT16; //	item at the top of displayed list
  usStartIndex: UINT16; //	index to start at for the array of elements
  usMaxArrayIndex: UINT16; //	Max Size of the array
  usNumDisplayedItems: UINT16; //	Num of displayed item
  usMaxNumDisplayedItems: UINT16; //  Max number of Displayed items

  ubCurScrollBoxAction: UINT8; //	Holds the status of the current action ( create; destroy... )
}

// Enums for the possible panels the mercs can use
const enum Enum168 {
  QDS_REGULAR_PANEL,
  QDS_NPC_PANEL,
  QDS_NO_PANEL,
}

// image identifiers
let guiQdScrollArrowImage: UINT32;

let gfQuestDebugEntry: BOOLEAN = TRUE;
let gfQuestDebugExit: BOOLEAN = FALSE;

let gfRedrawQuestDebugSystem: BOOLEAN = TRUE;

let gusQuestDebugBlue: UINT16;
let gusQuestDebugLtBlue: UINT16;
let gusQuestDebugDkBlue: UINT16;

let gusFactAtTopOfList: UINT16;

// INT16		gsCurScrollBoxY=0;

let gNpcListBox: SCROLL_BOX; // The Npc Scroll box
let gItemListBox: SCROLL_BOX; // The Npc Scroll box

let gpActiveListBox: Pointer<SCROLL_BOX>; // Only 1 scroll box is active at a time, this is set to it.

let gsQdsEnteringGridNo: INT16 = 0;

let gubTextEntryAction: UINT8 = QD_DROP_DOWN_NO_ACTION;
let gfTextEntryActive: BOOLEAN = FALSE;
// wchar_t			gzTextEntryReturnString[ 16 ];

let gfUseLocalNPCs: BOOLEAN = FALSE;

let gubNPCInventoryPopupAction: UINT8 = QD_DROP_DOWN_NO_ACTION;

let gubCurrentNpcInSector: UINT8[] /* [QUEST_DBS_SIZE_NPC_ARRAY] */;
let gubNumNPCinSector: UINT8;

let gubCurQuestSelected: UINT8;
let gusCurFactSelected: UINT16;
let gusFactAtTopOfList: UINT16;

// INT16				gsCurrentNPCLog=-1;						//If this is set, the value will be set to the
let gfNpcLogButton: BOOLEAN = FALSE;

let giHaveSelectedItem: INT32 = -1; // If it is not the first time in, dont reset the Selected ITem
let giHaveSelectedNPC: INT32 = -1; // If it is not the first time in, dont reset the selected NPC

let giSelectedMercCurrentQuote: INT32 = -1;
let gTalkingMercSoldier: Pointer<SOLDIERTYPE> = NULL;
let gfPauseTalkingMercPopup: BOOLEAN = FALSE;
let gfAddNpcToTeam: BOOLEAN = FALSE;
let gfRpcToSaySectorDesc: BOOLEAN = FALSE;
let gfNpcPanelIsUsedForTalkingMerc: BOOLEAN = FALSE;

let gfBackgroundMaskEnabled: BOOLEAN = FALSE;

let gfExitQdsDueToMessageBox: BOOLEAN = FALSE;
let giQdsMessageBox: INT32 = -1; // Qds pop up messages index value

let gfInDropDownBox: BOOLEAN = FALSE;
// BOOLEAN			gfExitOptionsAfterMessageBox = FALSE;

let gfAddKeyNextPass: BOOLEAN = FALSE;
let gfDropDamagedItems: BOOLEAN = FALSE;

//
// Mouse Regions
//
let gQuestDebugSysScreenRegions: MOUSE_REGION;
// void QuestDebugSysScreenRegionCallBack(MOUSE_REGION * pRegion, INT32 iReason );

let guiQuestDebugExitButton: UINT32;

// checkbox for weather to show all npc or just npc in sector
let guiQuestDebugAllOrSectorNPCToggle: UINT32;

let guiQuestDebugCurNPCButton: UINT32;

let guiQuestDebugCurItemButton: UINT32;

let guiQuestDebugAddNpcToLocationButton: UINT32;

let guiQuestDebugAddItemToLocationButton: UINT32;

let guiQuestDebugGiveItemToNPCButton: UINT32;

let guiQuestDebugChangeDayButton: UINT32;

let guiQuestDebugViewNPCInvButton: UINT32;

let guiQuestDebugRestoreNPCInvButton: UINT32;

let guiQuestDebugNPCLogButtonButton: UINT32;

let guiQuestDebugNPCRefreshButtonButton: UINT32;

let guiQuestDebugStartMercTalkingButtonButton: UINT32;

// checkbox for weather to add the merc to the players team
let guiQuestDebugAddNpcToTeamToggle: UINT32;

// checkbox for weather have rpc say the sector description
let guiQuestDebugRPCSaySectorDescToggle: UINT32;

let gSelectedNpcListRegion: MOUSE_REGION[] /* [QUEST_DBS_MAX_DISPLAYED_ENTRIES] */;

let gScrollAreaRegion: MOUSE_REGION[] /* [QUEST_DBS_NUM_INCREMENTS_IN_SCROLL_BAR] */;

let gScrollArrowsRegion: MOUSE_REGION[] /* [2] */;

// Text entry Disable the screen
let gQuestTextEntryDebugDisableScreenRegion: MOUSE_REGION;

// Ok button on the text entry form
let guiQuestDebugTextEntryOkBtn: UINT32;

// Ok button on the NPC inventory form
let guiQuestDebugNPCInventOkBtn: UINT32;

// Mouse regions for the Quests
let gQuestListRegion: MOUSE_REGION[] /* [QUEST_DBS_NUM_DISPLAYED_QUESTS] */;

// Mouse regions for the Facts
let gFactListRegion: MOUSE_REGION[] /* [QUEST_DBS_NUM_DISPLAYED_FACTS] */;

let guiQDPgUpButtonButton: UINT32;

let guiQDPgDownButtonButton: UINT32;

//*******************************
//
//	Function Prototypes
//
//*******************************

// ppp

//*******************************
//
//	Code
//
//*******************************

function QuestDebugScreenInit(): UINT32 {
  let usListBoxFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_LISTBOX_TEXT) + 2;

  // Set so next time we come in, we can set up
  gfQuestDebugEntry = TRUE;

  gusQuestDebugBlue = Get16BPPColor(FROMRGB(65, 79, 94));

  // Initialize which facts are at the top of the list
  gusFactAtTopOfList = 0;

  gubCurQuestSelected = 0;
  gusCurFactSelected = 0;

  //
  // Set the Npc List box
  //
  memset(&gNpcListBox, 0, sizeof(SCROLL_BOX));
  gNpcListBox.DisplayFunction = DisplaySelectedNPC; //	The function to display the entries

  gNpcListBox.usScrollPosX = QUEST_DBS_SELECTED_NPC_BUTN_X;
  gNpcListBox.usScrollPosY = QUEST_DBS_SELECTED_NPC_BUTN_Y + 25;
  gNpcListBox.usScrollHeight = usListBoxFontHeight * QUEST_DBS_MAX_DISPLAYED_ENTRIES;
  gNpcListBox.usScrollWidth = QUEST_DBS_LIST_BOX_WIDTH;
  gNpcListBox.usScrollArrowHeight = QUEST_DBS_SCROLL_ARROW_HEIGHT;
  gNpcListBox.usScrollBarHeight = gNpcListBox.usScrollHeight - (2 * gNpcListBox.usScrollArrowHeight);
  gNpcListBox.usScrollBarWidth = QUEST_DBS_SCROLL_BAR_WIDTH;

  gNpcListBox.sCurSelectedItem = -1;
  gNpcListBox.usItemDisplayedOnTopOfList = 0; // FIRST_RPC;
  gNpcListBox.usStartIndex = 0; // FIRST_RPC;
  gNpcListBox.usMaxArrayIndex = NUM_PROFILES;
  gNpcListBox.usNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;
  gNpcListBox.usMaxNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;

  gNpcListBox.ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;

  //
  // Set the Item List box
  //
  memset(&gItemListBox, 0, sizeof(SCROLL_BOX));
  gItemListBox.DisplayFunction = DisplaySelectedItem; //	The function to display the entries

  gItemListBox.usScrollPosX = QUEST_DBS_SELECTED_ITEM_BUTN_X;
  gItemListBox.usScrollPosY = QUEST_DBS_SELECTED_ITEM_BUTN_Y + 25;
  gItemListBox.usScrollHeight = usListBoxFontHeight * QUEST_DBS_MAX_DISPLAYED_ENTRIES;
  gItemListBox.usScrollWidth = QUEST_DBS_LIST_BOX_WIDTH;
  gItemListBox.usScrollArrowHeight = QUEST_DBS_SCROLL_ARROW_HEIGHT;
  gItemListBox.usScrollBarHeight = gItemListBox.usScrollHeight - (2 * gItemListBox.usScrollArrowHeight);
  gItemListBox.usScrollBarWidth = QUEST_DBS_SCROLL_BAR_WIDTH;

  gItemListBox.sCurSelectedItem = -1;

  gItemListBox.usItemDisplayedOnTopOfList = 1;
  gItemListBox.usStartIndex = 1;
  gItemListBox.usMaxArrayIndex = MAXITEMS;
  gItemListBox.usNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;
  gItemListBox.usMaxNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;

  gItemListBox.ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;

  gfUseLocalNPCs = FALSE;

  // Set up the global list box
  gpActiveListBox = &gNpcListBox;

  return TRUE;
}

function QuestDebugScreenHandle(): UINT32 {
  StartFrameBufferRender();

  if (gfQuestDebugEntry) {
    PauseGame();

    EnterQuestDebugSystem();
    gfQuestDebugEntry = FALSE;
    gfQuestDebugExit = FALSE;

    RenderQuestDebugSystem();

    // At this point the background is pure, copy it to the save buffer
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, 0, 0, 639, 479);
  }
  RestoreBackgroundRects();

  // ATE: Disable messages....
  DisableScrollMessages();

  GetUserInput();

  if (gfTextEntryActive || gubTextEntryAction) {
    if (gubTextEntryAction != QD_DROP_DOWN_NO_ACTION) {
      CreateDestroyDisplayTextEntryBox(gubTextEntryAction, NULL, NULL);
      gubTextEntryAction = QD_DROP_DOWN_NO_ACTION;
    }

    RenderAllTextFields();
  } else
    HandleQuestDebugSystem();

  if (gfRedrawQuestDebugSystem) {
    RenderQuestDebugSystem();

    gfRedrawQuestDebugSystem = FALSE;
  }

  // if the merc is supposed to be talking
  if (giSelectedMercCurrentQuote != -1) {
    // and it is an npc
    if (WhichPanelShouldTalkingMercUse() == QDS_NPC_PANEL) {
      gTalkPanel.fDirtyLevel = DIRTYLEVEL2;
      ButtonList[guiQDPgUpButtonButton]->uiFlags |= BUTTON_FORCE_UNDIRTY;
      RenderTalkingMenu();
    }
  }

  // render buttons marked dirty
  RenderButtons();

  // To handle the dialog
  HandleDialogue();
  HandleAutoFaces();
  HandleTalkingAutoFaces();

  ExecuteVideoOverlays();

  SaveBackgroundRects();
  RenderButtonsFastHelp();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  if (gfQuestDebugExit) {
    ExitQuestDebugSystem();
    gfQuestDebugExit = FALSE;
    gfQuestDebugEntry = TRUE;

    UnPauseGame();
    return GAME_SCREEN;
  }

  return QUEST_DEBUG_SCREEN;
}

function QuestDebugScreenShutdown(): UINT32 {
  return TRUE;
}

function EnterQuestDebugSystem(): BOOLEAN {
  let i: UINT8;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let zName: wchar_t[] /* [128] */;
  //	UINT16	usListBoxFontHeight = GetFontHeight( QUEST_DBS_FONT_LISTBOX_TEXT ) + 2;

  //	UINT16	zItemName[ SIZE_ITEM_NAME ];
  //	UINT16	zItemDesc[ SIZE_ITEM_INFO ];

  let usFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_DYNAMIC_TEXT) + 2;
  let VObjectDesc: VOBJECT_DESC;

  if (gfExitQdsDueToMessageBox) {
    gfRedrawQuestDebugSystem = TRUE;
    gfExitQdsDueToMessageBox = FALSE;
    return TRUE;
  }

  QuestDebug_ExitTactical();

  MSYS_DefineRegion(&gQuestDebugSysScreenRegions, 0, 0, 640, 480, MSYS_PRIORITY_HIGH, CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  // Add region
  MSYS_AddRegion(&gQuestDebugSysScreenRegions);

  guiQuestDebugExitButton = CreateTextButton(QuestDebugText[QUEST_DBS_EXIT_QUEST_DEBUG], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, 535, 450, 100, 25, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 10, BUTTON_NO_CALLBACK, BtnQuestDebugExitButtonCallback);

  // Check box to toggle between all and local npc's
  guiQuestDebugAllOrSectorNPCToggle = CreateCheckBoxButton(QUEST_DBS_NPC_CHCKBOX_TGL_X, QUEST_DBS_NPC_CHCKBOX_TGL_Y, "INTERFACE\\checkbox.sti", MSYS_PRIORITY_HIGH + 2, BtnQuestDebugAllOrSectorNPCToggleCallback);
  //	ButtonList[ iSummaryButton[ SUMMARY_PROGRESSCHECKBOX ] ]->uiFlags |= BUTTON_CLICKED_ON;

  // Currently Selected NPC button
  guiQuestDebugCurNPCButton = CreateTextButton(QuestDebugText[QUEST_DBS_SELECTED_NPC], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_SELECTED_NPC_BUTN_X, QUEST_DBS_SELECTED_NPC_BUTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugCurNPCButtonCallback);

  // Currently Selected item button
  guiQuestDebugCurItemButton = CreateTextButton(QuestDebugText[QUEST_DBS_SELECTED_ITEM], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_SELECTED_ITEM_BUTN_X, QUEST_DBS_SELECTED_ITEM_BUTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugCurItemButtonCallback);

  // Add NPC to location
  guiQuestDebugAddNpcToLocationButton = CreateTextButton(QuestDebugText[QUEST_DBS_ADD_CURRENT_NPC], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_ADD_NPC_BTN_X, QUEST_DBS_ADD_NPC_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugAddNpcToLocationButtonCallback);

  // Add item to location
  guiQuestDebugAddItemToLocationButton = CreateTextButton(QuestDebugText[QUEST_DBS_ADD_CURRENT_ITEM], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_ADD_ITEM_BTN_X, QUEST_DBS_ADD_ITEM_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugAddItemToLocationButtonCallback);

  // Give item to Npc
  guiQuestDebugGiveItemToNPCButton = CreateTextButton(QuestDebugText[QUEST_DBS_GIVE_ITEM_TO_NPC], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_GIVE_ITEM_TO_NPC_BTN_X, QUEST_DBS_GIVE_ITEM_TO_NPC_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugGiveItemToNPCButtonCallback);

  // Change Day
  guiQuestDebugChangeDayButton = CreateTextButton(QuestDebugText[QUEST_DBS_CHANGE_DAY], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_CHANGE_DAY_BTN_X, QUEST_DBS_CHANGE_DAY_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugChangeDayButtonCallback);

  // View NPC Inventory
  guiQuestDebugViewNPCInvButton = CreateTextButton(QuestDebugText[QUEST_DBS_VIEW_NPC_INVENTORY], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_VIEW_NPC_INV_BTN_X, QUEST_DBS_VIEW_NPC_INV_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugViewNPCInvButtonCallback);

  // Restore NPC Inventory
  guiQuestDebugRestoreNPCInvButton = CreateTextButton(QuestDebugText[QUEST_DBS_RESTORE_NPC_INVENTORY], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_RESTORE_NPC_INV_BTN_X, QUEST_DBS_RESTORE_NPC_INV_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugRestoreNPCInvButtonCallback);

  // NPC log button
  swprintf(zName, "%s - (%s)", QuestDebugText[QUEST_DBS_NPC_LOG_BUTTON], gfNpcLogButton ? "On" : "Off");
  guiQuestDebugNPCLogButtonButton = CreateTextButton(zName, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_NPC_LOG_BTN_X, QUEST_DBS_NPC_LOG_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugNPCLogButtonButtonCallback);

  guiQuestDebugNPCRefreshButtonButton = CreateTextButton(QuestDebugText[QUEST_DBS_REFRESH_NPC], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_NPC_REFRESH_BTN_X, QUEST_DBS_NPC_REFRESH_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugNPCRefreshButtonButtonCallback);

  // Start the selected merc talking
  guiQuestDebugStartMercTalkingButtonButton = CreateTextButton(QuestDebugText[QUEST_DBS_START_MERC_TALKING], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_START_MERC_TALKING_BTN_X, QUEST_DBS_START_MERC_TALKING_BTN_Y, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQuestDebugStartMercTalkingButtonButtonCallback);

  guiQDPgUpButtonButton = CreateTextButton(QuestDebugText[QUEST_DBS_PG_FACTS_UP], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_SECOND_COL_NUMBER_X + 5, QUEST_DBS_SECOND_COL_NUMBER_Y + QUEST_DBS_LIST_TEXT_OFFSET, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQDPgUpButtonButtonCallback);

  guiQDPgDownButtonButton = CreateTextButton(QuestDebugText[QUEST_DBS_PG_FACTS_DOWN], QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_SECOND_COL_NUMBER_X + 5, QUEST_DBS_SECOND_COL_NUMBER_Y + 15 * QUEST_DBS_NUM_DISPLAYED_FACTS + QUEST_DBS_LIST_TEXT_OFFSET, QUEST_DBS_LIST_BOX_WIDTH, QDS_BUTTON_HEIGHT, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 2, BUTTON_NO_CALLBACK, BtnQDPgDownButtonButtonCallback);

  // checkbox for weather to add the merc to the players team
  guiQuestDebugAddNpcToTeamToggle = CreateCheckBoxButton(QUEST_DBS_ADD_NPC_TO_TEAM_BTN_X, QUEST_DBS_ADD_NPC_TO_TEAM_BTN_Y, "INTERFACE\\checkbox.sti", MSYS_PRIORITY_HIGH + 2, BtnQuestDebugAddNpcToTeamToggleCallback);
  if (gfAddNpcToTeam)
    ButtonList[guiQuestDebugAddNpcToTeamToggle]->uiFlags |= BUTTON_CLICKED_ON;

  // checkbox for weather have rpc say the sector description
  guiQuestDebugRPCSaySectorDescToggle = CreateCheckBoxButton(QUEST_DBS_RPC_TO_SAY_SECTOR_DESC_BTN_X, QUEST_DBS_RPC_TO_SAY_SECTOR_DESC_BTN_Y, "INTERFACE\\checkbox.sti", MSYS_PRIORITY_HIGH + 2, BtnQuestDebugRPCSaySectorDescToggleCallback);
  if (gfRpcToSaySectorDesc)
    ButtonList[guiQuestDebugRPCSaySectorDescToggle]->uiFlags |= BUTTON_CLICKED_ON;

  // Setup mouse regions for the Quest list
  usPosX = QUEST_DBS_FIRST_COL_NUMBER_X;
  usPosY = QUEST_DBS_FIRST_COL_NUMBER_Y + QUEST_DBS_LIST_TEXT_OFFSET;
  for (i = 0; i < QUEST_DBS_NUM_DISPLAYED_QUESTS; i++) {
    MSYS_DefineRegion(&gQuestListRegion[i], usPosX, usPosY, (usPosX + QUEST_DBS_FIRST_SECTION_WIDTH), (usPosY + usFontHeight), MSYS_PRIORITY_HIGH + 2, CURSOR_WWW, MSYS_NO_CALLBACK, ScrollQuestListRegionCallBack); // CURSOR_LAPTOP_SCREEN
    // Add region
    MSYS_AddRegion(&gQuestListRegion[i]);
    MSYS_SetRegionUserData(&gQuestListRegion[i], 0, i);

    usPosY += usFontHeight;
  }

  // Setup mouse regions for the Fact lists
  usPosX = QUEST_DBS_SECOND_COL_NUMBER_X;
  usPosY = QUEST_DBS_SECOND_COL_NUMBER_Y + QUEST_DBS_LIST_TEXT_OFFSET + QUEST_DBS_FACT_LIST_OFFSET;
  for (i = 0; i < QUEST_DBS_NUM_DISPLAYED_FACTS; i++) {
    MSYS_DefineRegion(&gFactListRegion[i], usPosX, usPosY, (usPosX + QUEST_DBS_SECOND_SECTION_WIDTH), (usPosY + usFontHeight), MSYS_PRIORITY_HIGH + 2, CURSOR_WWW, MSYS_NO_CALLBACK, ScrollFactListRegionCallBack); // CURSOR_LAPTOP_SCREEN
    // Add region
    MSYS_AddRegion(&gFactListRegion[i]);
    MSYS_SetRegionUserData(&gFactListRegion[i], 0, i);

    usPosY += usFontHeight;
  }

  // load Scroll Horizontal Arrow graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\Qd_ScrollArrows.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiQdScrollArrowImage));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\Bars.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBrownBackgroundForTeamPanel));

  gfRedrawQuestDebugSystem = TRUE;

  AddNPCsInSectorToArray();

  // Remove the mouse region over the clock
  RemoveMouseRegionForPauseOfClock();

  // Disable the buttons the depend on a seleted item or npc
  DisableButton(guiQuestDebugAddNpcToLocationButton);
  DisableButton(guiQuestDebugStartMercTalkingButtonButton);
  DisableButton(guiQuestDebugAddItemToLocationButton);
  DisableButton(guiQuestDebugGiveItemToNPCButton);
  DisableButton(guiQuestDebugViewNPCInvButton);
  DisableButton(guiQuestDebugNPCLogButtonButton);
  DisableButton(guiQuestDebugNPCRefreshButtonButton);

  if (giHaveSelectedNPC != -1) {
    let zItemDesc: UINT16[] /* [SIZE_ITEM_INFO] */;

    if (gfUseLocalNPCs)
      swprintf(zItemDesc, "%d - %s", gubCurrentNpcInSector[giHaveSelectedNPC], gMercProfiles[gubCurrentNpcInSector[giHaveSelectedNPC]].zNickname);
    else
      swprintf(zItemDesc, "%d - %s", giHaveSelectedNPC, gMercProfiles[giHaveSelectedNPC].zNickname);
    SpecifyButtonText(guiQuestDebugCurNPCButton, zItemDesc);

    gNpcListBox.sCurSelectedItem = giHaveSelectedNPC;

    EnableQDSButtons();
  }

  if (giHaveSelectedItem != -1) {
    let zItemName: UINT16[] /* [SIZE_ITEM_NAME] */;
    let zItemDesc: UINT16[] /* [SIZE_ITEM_INFO] */;

    wcscpy(zItemName, ShortItemNames[giHaveSelectedItem]);

    swprintf(zItemDesc, "%d - %s", giHaveSelectedItem, zItemName);
    SpecifyButtonText(guiQuestDebugCurItemButton, zItemDesc);

    gItemListBox.sCurSelectedItem = giHaveSelectedItem;

    EnableQDSButtons();
  }

  return TRUE;
}

function ExitQuestDebugSystem(): void {
  let i: UINT16;

  if (gfExitQdsDueToMessageBox) {
    return;
  }
  MSYS_RemoveRegion(&gQuestDebugSysScreenRegions);
  QuestDebug_EnterTactical();

  RemoveButton(guiQuestDebugExitButton);

  RemoveButton(guiQuestDebugCurNPCButton);
  RemoveButton(guiQuestDebugCurItemButton);
  RemoveButton(guiQuestDebugAddNpcToLocationButton);
  RemoveButton(guiQuestDebugAddItemToLocationButton);
  RemoveButton(guiQuestDebugChangeDayButton);
  RemoveButton(guiQuestDebugNPCLogButtonButton);
  RemoveButton(guiQuestDebugGiveItemToNPCButton);
  RemoveButton(guiQuestDebugViewNPCInvButton);
  RemoveButton(guiQuestDebugRestoreNPCInvButton);
  RemoveButton(guiQuestDebugAllOrSectorNPCToggle);
  RemoveButton(guiQuestDebugNPCRefreshButtonButton);
  RemoveButton(guiQuestDebugStartMercTalkingButtonButton);
  RemoveButton(guiQuestDebugAddNpcToTeamToggle);
  RemoveButton(guiQuestDebugRPCSaySectorDescToggle);

  RemoveButton(guiQDPgUpButtonButton);
  RemoveButton(guiQDPgDownButtonButton);

  DeleteVideoObjectFromIndex(guiQdScrollArrowImage);

  //	DeleteVideoObjectFromIndex( guiBrownBackgroundForTeamPanel );

  gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
  CreateDestroyDisplaySelectNpcDropDownBox();
  gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;

  // Remove the quest list mouse regions
  for (i = 0; i < QUEST_DBS_NUM_DISPLAYED_QUESTS; i++)
    MSYS_RemoveRegion(&gQuestListRegion[i]);

  // Remove the fact list mouse regions
  for (i = 0; i < QUEST_DBS_NUM_DISPLAYED_FACTS; i++)
    MSYS_RemoveRegion(&gFactListRegion[i]);

  // Create the clock mouse region
  CreateMouseRegionForPauseOfClock(CLOCK_REGION_START_X, CLOCK_REGION_START_Y);

  giHaveSelectedNPC = gNpcListBox.sCurSelectedItem;
  giHaveSelectedItem = gItemListBox.sCurSelectedItem;

  EndMercTalking();

  giSelectedMercCurrentQuote = -1;
}

function HandleQuestDebugSystem(): void {
  let zTemp: CHAR16[] /* [512] */;

  // hhh

  HandleQDSTalkingMerc();

  //	if( !gfTextEntryActive )
  if (gubTextEntryAction != QD_DROP_DOWN_NO_ACTION) {
  }

  if (gpActiveListBox->ubCurScrollBoxAction != QD_DROP_DOWN_NO_ACTION) {
    CreateDestroyDisplaySelectNpcDropDownBox();

    if (gpActiveListBox->ubCurScrollBoxAction == QD_DROP_DOWN_CREATE)
      gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DISPLAY;
    else
      gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;
  }

  if (gubNPCInventoryPopupAction != QD_DROP_DOWN_NO_ACTION) {
    CreateDestroyDisplayNPCInventoryPopup(gubNPCInventoryPopupAction);

    if (gubNPCInventoryPopupAction == QD_DROP_DOWN_CREATE)
      gubNPCInventoryPopupAction = QD_DROP_DOWN_DISPLAY;
    else
      gubNPCInventoryPopupAction = QD_DROP_DOWN_NO_ACTION;
  }

  if (gfAddKeyNextPass) {
    swprintf(zTemp, "  Please enter the Keys ID. ( 0 - %d )", NUM_KEYS);
    TextEntryBox(zTemp, AddKeyToGridNo);
    gfAddKeyNextPass = FALSE;
  }
}

function RenderQuestDebugSystem(): void {
  ColorFillQuestDebugScreenScreen(0, 0, 640, 480);

  // display the title
  DisplayWrappedString(0, 5, 640, 2, QUEST_DBS_FONT_TITLE, QUEST_DBS_COLOR_TITLE, QuestDebugText[QUEST_DBS_TITLE], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display vertical lines b/n sections
  DisplaySectionLine();

  // Display the Quest Text
  DisplayQuestInformation();

  // Display the Fact Text
  DisplayFactInformation();

  // Display the list of quests
  DisplayQuestList();

  // Display the list of tasks
  DisplayFactList();

  // Display the NPC and Item info
  DisplayNPCInfo();

  // Display the text beside the NPC in current sector toggle box
  DrawTextToScreen(QuestDebugText[QUEST_DBS_VIEW_LOCAL_NPC], QUEST_DBS_NPC_CHCKBOX_TGL_X + 25, QUEST_DBS_NPC_CHCKBOX_TGL_Y + 1, QUEST_DBS_NUMBER_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the text beside the add npc to team toggle box
  DrawTextToScreen(QuestDebugText[QUEST_DBS_ADD_NPC_TO_TEAM], QUEST_DBS_NPC_CHCKBOX_TGL_X + 25, QUEST_DBS_ADD_NPC_TO_TEAM_BTN_Y + 1, QUEST_DBS_NUMBER_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the text beside the rpc say sector desc quotes
  DrawTextToScreen(QuestDebugText[QUEST_DBS_RPC_SAY_SECTOR_DESC], QUEST_DBS_NPC_CHCKBOX_TGL_X + 25, QUEST_DBS_RPC_TO_SAY_SECTOR_DESC_BTN_Y, QUEST_DBS_NUMBER_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  DisplayCurrentGridNo();
  // rr

  if (gfTextEntryActive) {
    gubTextEntryAction = QD_DROP_DOWN_DISPLAY;
    CreateDestroyDisplayTextEntryBox(gubTextEntryAction, NULL, NULL);
    gubTextEntryAction = QD_DROP_DOWN_NO_ACTION;
  }

  // if there is a merc talking
  if (giSelectedMercCurrentQuote != -1)
    DisplayQDSCurrentlyQuoteNum();

  MarkButtonsDirty();
  InvalidateRegion(0, 0, 640, 480);
}

function DisplayCurrentGridNo(): void {
  if (gsQdsEnteringGridNo != 0) {
    let zTemp: CHAR16[] /* [512] */;

    swprintf(zTemp, "%s:  %d", QuestDebugText[QUEST_DBS_CURRENT_GRIDNO], gsQdsEnteringGridNo);
    DrawTextToScreen(zTemp, QUEST_DBS_NPC_CURRENT_GRIDNO_X, QUEST_DBS_NPC_CURRENT_GRIDNO_Y, QUEST_DBS_NUMBER_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  }
}

function GetUserInput(): void {
  let Event: InputAtom;
  let MousePos: POINT;
  let ubPanelMercShouldUse: UINT8 = WhichPanelShouldTalkingMercUse(giSelectedMercCurrentQuote);

  GetCursorPos(&MousePos);

  while (DequeueEvent(&Event)) {
    if (!HandleTextInput(&Event) && Event.usEvent == KEY_DOWN) {
      switch (Event.usParam) {
        case ESC:
          gubTextEntryAction = QD_DROP_DOWN_CANCEL;

          gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
          CreateDestroyDisplaySelectNpcDropDownBox();
          gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;
          gfAddKeyNextPass = FALSE;

          EndMercTalking();

          break;

        case SPACE:
          if (giSelectedMercCurrentQuote != -1)
            SetTalkingMercPauseState(!gfPauseTalkingMercPopup);
          break;

        case LEFTARROW:
          if (giSelectedMercCurrentQuote != -1) {
            if (ubPanelMercShouldUse == QDS_REGULAR_PANEL)
              ShutupaYoFace(gTalkingMercSoldier->iFaceIndex);
            else
              ShutupaYoFace(gTalkPanel.iFaceIndex);

            if (giSelectedMercCurrentQuote > 1) {
              giSelectedMercCurrentQuote--;
              giSelectedMercCurrentQuote--;
            } else
              giSelectedMercCurrentQuote = 0;

            DisplayQDSCurrentlyQuoteNum();
          }
          break;

        case RIGHTARROW:
          if (giSelectedMercCurrentQuote != -1) {
            if (ubPanelMercShouldUse == QDS_REGULAR_PANEL)
              ShutupaYoFace(gTalkingMercSoldier->iFaceIndex);
            else
              ShutupaYoFace(gTalkPanel.iFaceIndex);

            // if( giSelectedMercCurrentQuote < GetMaxNumberOfQuotesToPlay( ) )
            //{
            //	giSelectedMercCurrentQuote++;
            //}
            DisplayQDSCurrentlyQuoteNum();
          }
          break;

        case F11:
          gfQuestDebugExit = TRUE;
          break;

        case 'x':
          if (Event.usKeyState & ALT_DOWN) {
            gfQuestDebugExit = TRUE;
            gfProgramIsRunning = FALSE;
          }
          break;

        case ENTER:
          if (gfTextEntryActive)
            gubTextEntryAction = QD_DROP_DOWN_DESTROY;
          else if (gfInDropDownBox) {
            gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
          }

          break;

        case PGDN:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem + QUEST_DBS_MAX_DISPLAYED_ENTRIES));
          }
          break;

        case PGUP:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem - QUEST_DBS_MAX_DISPLAYED_ENTRIES));
          }
          break;

        case DNARROW:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem + 1));
          }
          break;

        case UPARROW:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem - 1));
          }
          break;

        case 'd': {
          let zTemp: CHAR16[] /* [512] */;

          // toggle whether dropped items are damaged or not
          gfDropDamagedItems ^= 1;
          swprintf(zTemp, "Items dropped will be in %s condition", gfDropDamagedItems ? "DAMAGED" : "PERFECT");
          DoQDSMessageBox(MSG_BOX_BASIC_STYLE, zTemp, QUEST_DEBUG_SCREEN, MSG_BOX_FLAG_OK, NULL);
        } break;
      }
    }

    else if (Event.usEvent == KEY_REPEAT) {
      switch (Event.usParam) {
        case PGDN:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem + QUEST_DBS_MAX_DISPLAYED_ENTRIES));
          }
          break;

        case PGUP:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem - QUEST_DBS_MAX_DISPLAYED_ENTRIES));
          }
          break;

        case DNARROW:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem + 1));
          }
          break;

        case UPARROW:
          if (gfInDropDownBox) {
            IncrementActiveDropDownBox((gpActiveListBox->sCurSelectedItem - 1));
          }
          break;

        case LEFTARROW:
          if (giSelectedMercCurrentQuote != -1) {
            if (ubPanelMercShouldUse == QDS_REGULAR_PANEL)
              ShutupaYoFace(gTalkingMercSoldier->iFaceIndex);
            else
              ShutupaYoFace(gTalkPanel.iFaceIndex);

            if (giSelectedMercCurrentQuote > 1) {
              giSelectedMercCurrentQuote--;
              giSelectedMercCurrentQuote--;
            } else
              giSelectedMercCurrentQuote = 0;

            DisplayQDSCurrentlyQuoteNum();
          }
          break;

        case RIGHTARROW:
          if (giSelectedMercCurrentQuote != -1) {
            DisplayQDSCurrentlyQuoteNum();

            if (ubPanelMercShouldUse == QDS_REGULAR_PANEL)
              ShutupaYoFace(gTalkingMercSoldier->iFaceIndex);
            else
              ShutupaYoFace(gTalkPanel.iFaceIndex);
          }
          break;
      }
    }
  }
}

function ColorFillQuestDebugScreenScreen(sLeft: INT16, sTop: INT16, sRight: INT16, sBottom: INT16): void {
  ColorFillVideoSurfaceArea(ButtonDestBuffer, sLeft, sTop, sRight, sBottom, gusQuestDebugBlue);
}

function QuestDebug_ExitTactical(): void {
}

function QuestDebug_EnterTactical(): void {
  EnterTacticalScreen();
}

function DisplaySectionLine(): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usStartX: UINT16;
  let usStartY: UINT16;
  let usEndX: UINT16;
  let usEndY: UINT16;

  usStartX = usEndX = QUEST_DBS_FIRST_SECTION_WIDTH;

  usStartY = QUEST_DBS_FIRST_COL_NUMBER_Y;
  usEndY = 475;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);

  // draw the line in b/n the first and second section
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  LineDraw(FALSE, usStartX, usStartY, usEndX, usEndY, Get16BPPColor(FROMRGB(255, 255, 255)), pDestBuf);

  // draw the line in b/n the second and third section
  usStartX = usEndX = QUEST_DBS_FIRST_SECTION_WIDTH + QUEST_DBS_SECOND_SECTION_WIDTH;
  LineDraw(FALSE, usStartX, usStartY, usEndX, usEndY, Get16BPPColor(FROMRGB(255, 255, 255)), pDestBuf);

  // draw the horizopntal line under the title
  usStartX = 0;
  usEndX = 639;
  usStartY = usEndY = 75;
  LineDraw(FALSE, usStartX, usStartY, usEndX, usEndY, Get16BPPColor(FROMRGB(255, 255, 255)), pDestBuf);

  // unlock frame buffer
  UnLockVideoSurface(FRAME_BUFFER);
}

function DisplayQuestInformation(): void {
  // Display Quests
  DisplayWrappedString(0, QUEST_DBS_SECTION_TITLE_Y, QUEST_DBS_FIRST_SECTION_WIDTH, 2, QUEST_DBS_FONT_TITLE, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_QUESTS], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display Quest Number text
  DisplayWrappedString(QUEST_DBS_FIRST_COL_NUMBER_X, QUEST_DBS_FIRST_COL_NUMBER_Y, QUEST_DBS_NUMBER_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_QUEST_NUMBER], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display Quest title text
  DisplayWrappedString(QUEST_DBS_FIRST_COL_TITLE_X, QUEST_DBS_FIRST_COL_TITLE_Y, QUEST_DBS_TITLE_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_QUEST_TITLE], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display Quest status text
  DisplayWrappedString(QUEST_DBS_FIRST_COL_STATUS_X, QUEST_DBS_FIRST_COL_STATUS_Y, QUEST_DBS_STATUS_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_STATUS], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
}

function DisplayFactInformation(): void {
  // Display Fact
  DisplayWrappedString(QUEST_DBS_FIRST_SECTION_WIDTH, QUEST_DBS_SECTION_TITLE_Y, QUEST_DBS_SECOND_SECTION_WIDTH, 2, QUEST_DBS_FONT_TITLE, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_FACTS], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display Fact Number text
  DisplayWrappedString(QUEST_DBS_SECOND_COL_NUMBER_X, QUEST_DBS_SECOND_COL_NUMBER_Y, QUEST_DBS_NUMBER_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_FACT_NUMBER], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display Fact title text
  DisplayWrappedString(QUEST_DBS_SECOND_COL_TITLE_X, QUEST_DBS_SECOND_COL_TITLE_Y, QUEST_DBS_TITLE_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_DESC], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display Fact status text
  DisplayWrappedString(QUEST_DBS_SECOND_COL_STATUS_X, QUEST_DBS_SECOND_COL_STATUS_Y, QUEST_DBS_STATUS_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_STATUS], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
}

function BtnQuestDebugExitButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    gfQuestDebugExit = TRUE;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function DisplayQuestList(): void {
  let usLoop1: UINT16;
  let usCount: UINT16;
  let usTextHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_DYNAMIC_TEXT) + 2;
  let sTemp: wchar_t[] /* [15] */;
  let usPosY: UINT16;

  usPosY = QUEST_DBS_FIRST_COL_NUMBER_Y + QUEST_DBS_LIST_TEXT_OFFSET; //&& (usCount < QUEST_DBS_MAX_DISPLAYED_ENTRIES )
  for (usLoop1 = 0, usCount = 0; (usLoop1 < MAX_QUESTS); usLoop1++) {
    // Display Quest Number text
    swprintf(sTemp, "%02d", usLoop1);
    DrawTextToScreen(sTemp, QUEST_DBS_FIRST_COL_NUMBER_X, usPosY, QUEST_DBS_NUMBER_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

    // Display Quest title text
    DisplayWrappedString(QUEST_DBS_FIRST_COL_TITLE_X, usPosY, QUEST_DBS_TITLE_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, QuestDescText[usLoop1], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

    // Display Quest status text
    DisplayWrappedString(QUEST_DBS_FIRST_COL_STATUS_X, usPosY, QUEST_DBS_STATUS_COL_WIDTH, 2, QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, QuestStates[gubQuest[usLoop1]], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
    //		swprintf( sTemp, L"%02d", gubQuest[ usLoop1 ] );
    //		DrawTextToScreen( sTemp, QUEST_DBS_FIRST_COL_STATUS_X, usPosY, QUEST_DBS_NUMBER_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED	);

    usPosY += usTextHeight;
    usCount++;
  }
}

function DisplayFactList(): void {
  let usLoop1: UINT16;
  let usCount: UINT16;
  let usTextHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_DYNAMIC_TEXT) + 2;
  let sTemp: wchar_t[] /* [512] */;
  let usPosY: UINT16;

  usPosY = QUEST_DBS_SECOND_COL_NUMBER_Y + QUEST_DBS_LIST_TEXT_OFFSET + QUEST_DBS_FACT_LIST_OFFSET; //

  if (gusFactAtTopOfList + QUEST_DBS_NUM_DISPLAYED_FACTS > NUM_FACTS)
    gusFactAtTopOfList = NUM_FACTS - QUEST_DBS_NUM_DISPLAYED_FACTS;

  for (usLoop1 = gusFactAtTopOfList, usCount = 0; (usLoop1 < NUM_FACTS) && (usCount < QUEST_DBS_NUM_DISPLAYED_FACTS); usLoop1++) {
    // Display Quest Number text
    swprintf(sTemp, "%02d", usLoop1);
    DrawTextToScreen(sTemp, QUEST_DBS_SECOND_COL_NUMBER_X, usPosY, QUEST_DBS_NUMBER_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

    // Display Quest title text
    if (FactDescText[usLoop1][0] == '\0') {
      swprintf(sTemp, "No Fact %03d Yet", usLoop1);
      DisplayWrappedString(QUEST_DBS_SECOND_COL_TITLE_X, usPosY, QUEST_DBS_SECOND_TITLE_COL_WIDTH, 2, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, sTemp, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
    } else {
      wcscpy(sTemp, FactDescText[usLoop1]);

      if (StringPixLength(sTemp, QUEST_DBS_FONT_DYNAMIC_TEXT) > QUEST_DBS_SECOND_TITLE_COL_WIDTH) {
        ReduceStringLength(sTemp, QUEST_DBS_SECOND_TITLE_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT);
      }

      //			DisplayWrappedString( QUEST_DBS_SECOND_COL_TITLE_X, usPosY, QUEST_DBS_SECOND_TITLE_COL_WIDTH, 2, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FactDescText[ usLoop1 ], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
      DrawTextToScreen(sTemp, QUEST_DBS_SECOND_COL_TITLE_X, usPosY, QUEST_DBS_SECOND_TITLE_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
    }

    DrawTextToScreen(gubFact[usLoop1] ? "True" : "False", QUEST_DBS_SECOND_COL_STATUS_X, usPosY, QUEST_DBS_STATUS_COL_WIDTH, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

    usPosY += usTextHeight;
    usCount++;
  }
}

function BtnQuestDebugCurNPCButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    // if there is an old list box active, destroy the new one
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
    CreateDestroyDisplaySelectNpcDropDownBox();
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;

    // Set up the global list box
    gpActiveListBox = &gNpcListBox;

    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_CREATE;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugCurItemButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    // if there is an old list box active, destroy the new one
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
    CreateDestroyDisplaySelectNpcDropDownBox();
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;

    // Set up the global list box
    gpActiveListBox = &gItemListBox;

    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_CREATE;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function DisplayNPCInfo(): void {
  // display section title
  DisplayWrappedString(QUEST_DBS_THIRD_COL_TITLE_X, QUEST_DBS_SECTION_TITLE_Y, QUEST_DBS_THIRD_SECTION_WIDTH, 2, QUEST_DBS_FONT_TITLE, QUEST_DBS_COLOR_SUBTITLE, QuestDebugText[QUEST_DBS_NPC_INFO], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
}

function CreateDestroyDisplaySelectNpcDropDownBox(): BOOLEAN {
  /* static */ let fMouseRegionsCreated: BOOLEAN = FALSE;
  let i: UINT16;
  let usPosX: UINT16;
  let usPosY: UINT16;

  // if there are
  if (gpActiveListBox->usMaxArrayIndex == 0)
    return FALSE;

  switch (gpActiveListBox->ubCurScrollBoxAction) {
    case QD_DROP_DOWN_NO_ACTION: {
    } break;

    case QD_DROP_DOWN_CREATE: {
      let usFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_LISTBOX_TEXT) + 2;

      // if the mouse regions have already been creates, return
      if (fMouseRegionsCreated)
        break;

      // if the are more entries then can be displayed
      //			if( gpActiveListBox->usMaxArrayIndex > gpActiveListBox->usNumDisplayedItems )
      //			{
      usPosX = gpActiveListBox->usScrollPosX;
      usPosY = gpActiveListBox->usScrollPosY;

      // Set the initial value for the box
      //				if( gpActiveListBox == &gNpcListBox )
      //					gpActiveListBox->sCurSelectedItem = FIRST_RPC;
      //				else
      //					gpActiveListBox->sCurSelectedItem = 1;

      // create the scroll regions
      for (i = 0; i < gpActiveListBox->usNumDisplayedItems; i++) {
        MSYS_DefineRegion(&gSelectedNpcListRegion[i], usPosX, (usPosY), (usPosX + gpActiveListBox->usScrollWidth), (usPosY + usFontHeight), MSYS_PRIORITY_HIGH + 20, CURSOR_WWW, SelectNpcListMovementCallBack, SelectNpcListRegionCallBack);
        MSYS_AddRegion(&gSelectedNpcListRegion[i]);
        MSYS_SetRegionUserData(&gSelectedNpcListRegion[i], 0, i);

        usPosY += usFontHeight;
      }

      fMouseRegionsCreated = TRUE;
      //			}
      //			else
      //				fMouseRegionsCreated = FALSE;

      // Scroll bars
      usPosX = gpActiveListBox->usScrollPosX + gpActiveListBox->usScrollWidth;
      usPosY = gpActiveListBox->usScrollPosY + gpActiveListBox->usScrollArrowHeight + 2;

      for (i = 0; i < QUEST_DBS_NUM_INCREMENTS_IN_SCROLL_BAR; i++) {
        MSYS_DefineRegion(&gScrollAreaRegion[i], usPosX, usPosY, (usPosX + gpActiveListBox->usScrollBarWidth), (usPosY + gpActiveListBox->usScrollBarHeight), MSYS_PRIORITY_HIGH + 20, CURSOR_WWW, ScrollAreaMovementCallBack, ScrollAreaRegionCallBack);
        MSYS_AddRegion(&gScrollAreaRegion[i]);
        MSYS_SetRegionUserData(&gScrollAreaRegion[i], 0, i);
      }

      // Top Scroll arrow
      usPosX = gpActiveListBox->usScrollPosX + gpActiveListBox->usScrollWidth;
      usPosY = gpActiveListBox->usScrollPosY + 2;

      MSYS_DefineRegion(&gScrollArrowsRegion[0], usPosX, (usPosY), (usPosX + gpActiveListBox->usScrollBarWidth), (usPosY + gpActiveListBox->usScrollArrowHeight), MSYS_PRIORITY_HIGH + 20, CURSOR_WWW, MSYS_NO_CALLBACK, ScrollArrowsRegionCallBack);
      MSYS_AddRegion(&gScrollArrowsRegion[0]);
      MSYS_SetRegionUserData(&gScrollArrowsRegion[0], 0, 0);

      // Bottom Scroll arrow
      usPosY = gpActiveListBox->usScrollPosY + gpActiveListBox->usScrollHeight - gpActiveListBox->usScrollArrowHeight - 2;

      MSYS_DefineRegion(&gScrollArrowsRegion[1], usPosX, usPosY, (usPosX + gpActiveListBox->usScrollBarWidth), (usPosY + gpActiveListBox->usScrollArrowHeight), MSYS_PRIORITY_HIGH + 20, CURSOR_WWW, MSYS_NO_CALLBACK, ScrollArrowsRegionCallBack);
      MSYS_AddRegion(&gScrollArrowsRegion[1]);
      MSYS_SetRegionUserData(&gScrollArrowsRegion[1], 0, 1);

      // create a mask to block out the screen
      if (!gfBackgroundMaskEnabled) {
        MSYS_DefineRegion(&gQuestTextEntryDebugDisableScreenRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGH + 15, CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, QuestDebugTextEntryDisableScreenRegionCallBack);
        MSYS_AddRegion(&gQuestTextEntryDebugDisableScreenRegion);
        gfBackgroundMaskEnabled = TRUE;
      }

      gfInDropDownBox = TRUE;

      if (gpActiveListBox->sCurSelectedItem == -1) {
        gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usStartIndex;
        gpActiveListBox->sCurSelectedItem = gpActiveListBox->usStartIndex;
      } else
        gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->sCurSelectedItem;
    } break;

    case QD_DROP_DOWN_DESTROY: {
      // if the mouse regions are creates, destroy them
      if (fMouseRegionsCreated) {
        // delete the mouse regions for the words
        for (i = 0; i < gpActiveListBox->usNumDisplayedItems; i++)
          MSYS_RemoveRegion(&gSelectedNpcListRegion[i]);

        fMouseRegionsCreated = FALSE;

        // scroll arrows
        for (i = 0; i < 2; i++)
          MSYS_RemoveRegion(&gScrollArrowsRegion[i]);

        for (i = 0; i < QUEST_DBS_NUM_INCREMENTS_IN_SCROLL_BAR; i++) {
          MSYS_RemoveRegion(&gScrollAreaRegion[i]);
        }

        // remove the mask of the entire screen
        if (gfBackgroundMaskEnabled) {
          MSYS_RemoveRegion(&gQuestTextEntryDebugDisableScreenRegion);
          gfBackgroundMaskEnabled = FALSE;
        }

        EnableQDSButtons();
      }
      gfRedrawQuestDebugSystem = TRUE;
      gfInDropDownBox = FALSE;
    } break;

    case QD_DROP_DOWN_DISPLAY: {
      //			( *(gpActiveListBox->DisplayFunction))();
      //			(*(MSYS_CurrRegion->ButtonCallback))(MSYS_CurrRegion,ButtonReason);
      DisplaySelectedListBox();
    } break;
  }
  return TRUE;
}

function DisplaySelectedListBox(): void {
  let usFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_LISTBOX_TEXT) + 2;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let hImageHandle: HVOBJECT;

  // DEBUG: make sure it wont go over array bounds
  if (gpActiveListBox->usMaxArrayIndex == 0) {
    return;
  } else {
    if (gpActiveListBox->sCurSelectedItem >= gpActiveListBox->usMaxArrayIndex) {
      if (gpActiveListBox->usMaxArrayIndex > 0)
        gpActiveListBox->sCurSelectedItem = gpActiveListBox->usMaxArrayIndex - 1;
      else
        gpActiveListBox->sCurSelectedItem = 0;

      if ((gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usNumDisplayedItems - 1) < 0)
        gpActiveListBox->usItemDisplayedOnTopOfList = 0;
      else
        gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usNumDisplayedItems - 1;
    } else if (!gfUseLocalNPCs && ((gpActiveListBox->usItemDisplayedOnTopOfList + gpActiveListBox->usMaxNumDisplayedItems) >= gpActiveListBox->usMaxArrayIndex)) {
      gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usMaxNumDisplayedItems - 1;
    }
  }

  usPosX = gpActiveListBox->usScrollPosX;
  usPosY = gpActiveListBox->usScrollPosY + 2;

  // clear the background
  ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY - 1, usPosX + gpActiveListBox->usScrollWidth, usPosY + gpActiveListBox->usScrollHeight, Get16BPPColor(FROMRGB(45, 59, 74)));

  // Display the selected list box's display function
  (*(gpActiveListBox->DisplayFunction))();

  // Display the Scroll BAr area
  // clear the scroll bar background
  usPosX = gpActiveListBox->usScrollPosX + gpActiveListBox->usScrollWidth;
  usPosY = gpActiveListBox->usScrollPosY + 2;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY - 1, usPosX + gpActiveListBox->usScrollBarWidth, usPosY + gpActiveListBox->usScrollHeight, Get16BPPColor(FROMRGB(192, 192, 192)));

  // get and display the up and down arrows
  GetVideoObject(&hImageHandle, guiQdScrollArrowImage);
  // top arrow
  BltVideoObject(FRAME_BUFFER, hImageHandle, 0, usPosX - 5, usPosY - 1, VO_BLT_SRCTRANSPARENCY, NULL);

  // Bottom arrow
  BltVideoObject(FRAME_BUFFER, hImageHandle, 1, usPosX, usPosY + gpActiveListBox->usScrollHeight - gpActiveListBox->usScrollArrowHeight, VO_BLT_SRCTRANSPARENCY, NULL);

  // display the scroll rectangle
  DrawQdsScrollRectangle(); // gpActiveListBox->sCurSelectedItem, usPosX, usPosY, (UINT16)(usPosY + gpActiveListBox->usScrollHeight), NUM_PROFILES-FIRST_RPC );

  InvalidateRegion(0, 0, 640, 480);
}

function DisplaySelectedNPC(): void {
  let i: UINT16;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usLocationX: UINT16 = 0;
  let usLocationY: UINT16 = 0;
  let usFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_LISTBOX_TEXT) + 2;
  let sTempString: CHAR16[] /* [64] */;
  let zButtonName: wchar_t[] /* [256] */;

  usPosX = gpActiveListBox->usScrollPosX;
  usPosY = gpActiveListBox->usScrollPosY + 2;

  // display the names of the NPC's
  for (i = gpActiveListBox->usItemDisplayedOnTopOfList; i < gpActiveListBox->usItemDisplayedOnTopOfList + gpActiveListBox->usNumDisplayedItems; i++) {
    if (gfUseLocalNPCs) {
      DrawTextToScreen(gMercProfiles[gubCurrentNpcInSector[i]].zNickname, usPosX, usPosY, 0, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

      GetDebugLocationString(gubCurrentNpcInSector[i], sTempString);

      // GetShortSectorString( gMercProfiles[ gubCurrentNpcInSector[ i ] ].sSectorX, gMercProfiles[ gubCurrentNpcInSector[ i ] ].sSectorY, sTempString );
    } else {
      DrawTextToScreen(gMercProfiles[i].zNickname, usPosX, usPosY, 0, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

      GetDebugLocationString(i, sTempString);

      //			GetShortSectorString( gMercProfiles[ i ].sSectorX, gMercProfiles[ i ].sSectorY, sTempString );
    }

    FindFontRightCoordinates(gpActiveListBox->usScrollPosX, usPosY, gpActiveListBox->usScrollWidth, 0, sTempString, QUEST_DBS_FONT_LISTBOX_TEXT, &usLocationX, &usLocationY);

    // the location value
    DrawTextToScreen(sTempString, (usLocationX - 2), usPosY, 0, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

    usPosY += usFontHeight;
  }

  // if there is a selected item, highlight it.
  if (gpActiveListBox->sCurSelectedItem >= 0) {
    usPosY = usFontHeight * (gpActiveListBox->sCurSelectedItem - gpActiveListBox->usItemDisplayedOnTopOfList) + gpActiveListBox->usScrollPosY + 2;

    if (usPosY > 424)
      usPosY = usPosY;

    // display the name in the list
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gpActiveListBox->usScrollPosX, usPosY - 1, gpActiveListBox->usScrollPosX + gpActiveListBox->usScrollWidth, usPosY + usFontHeight - 1, Get16BPPColor(FROMRGB(255, 255, 255)));

    SetFontShadow(NO_SHADOW);

    // the highlighted name
    if (gfUseLocalNPCs) {
      DrawTextToScreen(gMercProfiles[gubCurrentNpcInSector[gpActiveListBox->sCurSelectedItem]].zNickname, gpActiveListBox->usScrollPosX, (usPosY), 0, QUEST_DBS_FONT_LISTBOX_TEXT, 2, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
      GetDebugLocationString(gubCurrentNpcInSector[gpActiveListBox->sCurSelectedItem], sTempString);

      //			GetShortSectorString( gMercProfiles[ gubCurrentNpcInSector[ gpActiveListBox->sCurSelectedItem ] ].sSectorX, gMercProfiles[ gubCurrentNpcInSector[ gpActiveListBox->sCurSelectedItem ] ].sSectorY, sTempString );
    } else {
      DrawTextToScreen(gMercProfiles[gpActiveListBox->sCurSelectedItem].zNickname, gpActiveListBox->usScrollPosX, (usPosY), 0, QUEST_DBS_FONT_LISTBOX_TEXT, 2, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

      GetDebugLocationString(gpActiveListBox->sCurSelectedItem, sTempString);
      //			GetShortSectorString( gMercProfiles[ gpActiveListBox->sCurSelectedItem ].sSectorX, gMercProfiles[ gpActiveListBox->sCurSelectedItem ].sSectorY, sTempString );
    }

    FindFontRightCoordinates(gpActiveListBox->usScrollPosX, (usPosY), gpActiveListBox->usScrollWidth, 0, sTempString, QUEST_DBS_FONT_LISTBOX_TEXT, &usLocationX, &usLocationY);

    // the location value
    DrawTextToScreen(sTempString, usLocationX, (usPosY), 0, QUEST_DBS_FONT_LISTBOX_TEXT, 2, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

    SetFontShadow(DEFAULT_SHADOW);

    if (gfUseLocalNPCs)
      swprintf(zButtonName, "%d - %s", gubCurrentNpcInSector[gpActiveListBox->sCurSelectedItem], gMercProfiles[gubCurrentNpcInSector[gpActiveListBox->sCurSelectedItem]].zNickname);
    else
      swprintf(zButtonName, "%d - %s", gpActiveListBox->sCurSelectedItem, gMercProfiles[gpActiveListBox->sCurSelectedItem].zNickname);

    SpecifyButtonText(guiQuestDebugCurNPCButton, zButtonName);
  }

  SetFontShadow(DEFAULT_SHADOW);
}

function DisplaySelectedItem(): void {
  let i: UINT16;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_LISTBOX_TEXT) + 2;
  let zItemName: UINT16[] /* [SIZE_ITEM_NAME] */;
  //	UINT16	zItemDesc[ SIZE_ITEM_INFO ];

  let zButtonName: wchar_t[] /* [256] */;

  usPosX = gpActiveListBox->usScrollPosX;
  usPosY = gpActiveListBox->usScrollPosY + 2;

  // display the names of the NPC's
  for (i = gpActiveListBox->usItemDisplayedOnTopOfList; i < gpActiveListBox->usItemDisplayedOnTopOfList + gpActiveListBox->usNumDisplayedItems; i++) {
    //		if ( !LoadItemInfo( i, zItemName, zItemDesc ) )
    //			Assert(0);
    wcscpy(zItemName, ShortItemNames[i]);

    if (zItemName[0] == '\0')
      wcscpy(zItemName, QuestDebugText[QUEST_DBS_NO_ITEM]);

    DrawTextToScreen(zItemName, usPosX, usPosY, 0, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
    usPosY += usFontHeight;
  }

  // if there is a selected item, highlight it.
  if (gpActiveListBox->sCurSelectedItem >= 0) {
    usPosY = usFontHeight * (gpActiveListBox->sCurSelectedItem - gpActiveListBox->usItemDisplayedOnTopOfList) + gpActiveListBox->usScrollPosY + 2;

    // display the name in the list
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gpActiveListBox->usScrollPosX, usPosY - 1, gpActiveListBox->usScrollPosX + gpActiveListBox->usScrollWidth, usPosY + usFontHeight - 1, Get16BPPColor(FROMRGB(255, 255, 255)));

    SetFontShadow(NO_SHADOW);

    //		if ( !LoadItemInfo( gpActiveListBox->sCurSelectedItem, zItemName, zItemDesc ) )
    //			Assert(0);
    wcscpy(zItemName, ShortItemNames[gpActiveListBox->sCurSelectedItem]);

    if (zItemName[0] == '\0')
      wcscpy(zItemName, QuestDebugText[QUEST_DBS_NO_ITEM]);

    DrawTextToScreen(zItemName, gpActiveListBox->usScrollPosX, (usPosY), 0, QUEST_DBS_FONT_LISTBOX_TEXT, 2, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
    SetFontShadow(DEFAULT_SHADOW);

    swprintf(zButtonName, "%d - %s", gpActiveListBox->sCurSelectedItem, zItemName);

    SpecifyButtonText(guiQuestDebugCurItemButton, zButtonName);
  }

  SetFontShadow(DEFAULT_SHADOW);
}

function SelectNpcListRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubSelected: UINT8 = MSYS_GetRegionUserData(pRegion, 0);

    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY; // qq
    gpActiveListBox->sCurSelectedItem = ubSelected + gpActiveListBox->usItemDisplayedOnTopOfList;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
    CreateDestroyDisplaySelectNpcDropDownBox();
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;
  }
}

function SelectNpcListMovementCallBack(pRegion: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    let sSelected: INT16 = MSYS_GetRegionUserData(pRegion, 0); // + gubCityAtTopOfList;

    pRegion->uiFlags |= BUTTON_CLICKED_ON;

    gpActiveListBox->sCurSelectedItem = sSelected + gpActiveListBox->usItemDisplayedOnTopOfList;

    // if we are at the top of the list
    //		if( sSelected == 0 )
    //			IncrementActiveDropDownBox( (INT16)(gpActiveListBox->sCurSelectedItem - 1 ) );

    // else we are at the bottom of the list
    //		else if( sSelected == gpActiveListBox->usMaxNumDisplayedItems - 1 )
    //			IncrementActiveDropDownBox( (INT16)(gpActiveListBox->sCurSelectedItem + 1 ) );

    DisplaySelectedListBox();

    InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_MOVE) {
    let sSelected: INT16 = MSYS_GetRegionUserData(pRegion, 0); // + gubCityAtTopOfList;

    pRegion->uiFlags &= (~BUTTON_CLICKED_ON);

    if (gpActiveListBox->sCurSelectedItem != (sSelected + gpActiveListBox->usItemDisplayedOnTopOfList)) {
      gpActiveListBox->sCurSelectedItem = sSelected + gpActiveListBox->usItemDisplayedOnTopOfList;

      DisplaySelectedListBox();
    }

    InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
  }
}

function DrawQdsScrollRectangle(): void // INT16 sSelectedEntry, UINT16 usStartPosX, UINT16 usStartPosY, UINT16 usScrollAreaHeight, UINT16 usNumEntries )
{
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usWidth: UINT16;
  let usTempPosY: UINT16;
  let usHeight: UINT16;
  let usPosY: UINT16;
  let usPosX: UINT16;

  let usNumEntries: UINT16 = gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usStartIndex - 1;

  let temp: UINT16;

  usTempPosY = gpActiveListBox->usScrollPosY + gpActiveListBox->usScrollArrowHeight;
  usPosX = gpActiveListBox->usScrollPosX + gpActiveListBox->usScrollWidth;
  usWidth = gpActiveListBox->usScrollBarWidth;

  usHeight = (gpActiveListBox->usScrollBarHeight / (usNumEntries) + .5); // qq+ 1 );

  if (usNumEntries > gpActiveListBox->usMaxNumDisplayedItems)
    usPosY = usTempPosY + ((gpActiveListBox->usScrollBarHeight / (usNumEntries + 1)) * (gpActiveListBox->sCurSelectedItem - gpActiveListBox->usStartIndex));
  else
    usPosY = usTempPosY;

  // bottom
  temp = gpActiveListBox->usScrollPosY + gpActiveListBox->usScrollBarHeight + gpActiveListBox->usScrollArrowHeight;

  if (usPosY >= temp)
    usPosY = gpActiveListBox->usScrollPosY + gpActiveListBox->usScrollBarHeight + gpActiveListBox->usScrollArrowHeight - usHeight;

  gpActiveListBox->usScrollBoxY = usPosY;
  gpActiveListBox->usScrollBoxEndY = usPosY + usHeight;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY, usPosX + usWidth - 1, usPosY + usHeight, Get16BPPColor(FROMRGB(130, 132, 128)));

  // display the line
  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // draw the gold highlite line on the top and left
  LineDraw(FALSE, usPosX, usPosY, usPosX + usWidth - 1, usPosY, Get16BPPColor(FROMRGB(255, 255, 255)), pDestBuf);
  LineDraw(FALSE, usPosX, usPosY, usPosX, usPosY + usHeight, Get16BPPColor(FROMRGB(255, 255, 255)), pDestBuf);

  // draw the shadow line on the bottom and right
  LineDraw(FALSE, usPosX, usPosY + usHeight, usPosX + usWidth - 1, usPosY + usHeight, Get16BPPColor(FROMRGB(112, 110, 112)), pDestBuf);
  LineDraw(FALSE, usPosX + usWidth - 1, usPosY, usPosX + usWidth - 1, usPosY + usHeight, Get16BPPColor(FROMRGB(112, 110, 112)), pDestBuf);

  // unlock frame buffer
  UnLockVideoSurface(FRAME_BUFFER);
}

function ScrollArrowsRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) || (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT)) {
    let ubSelected: UINT8 = MSYS_GetRegionUserData(pRegion, 0);

    // if down arrow
    if (ubSelected) {
      // if not at end of list
      if (gpActiveListBox->sCurSelectedItem < gpActiveListBox->usMaxArrayIndex - 1)
        gpActiveListBox->sCurSelectedItem++;

      // if end of displayed list, increment top of list
      if ((gpActiveListBox->sCurSelectedItem - gpActiveListBox->usItemDisplayedOnTopOfList) >= gpActiveListBox->usNumDisplayedItems)
        gpActiveListBox->usItemDisplayedOnTopOfList++;
    }

    // else, up arrow
    else {
      // if not at end of list
      if (gpActiveListBox->sCurSelectedItem > gpActiveListBox->usStartIndex)
        gpActiveListBox->sCurSelectedItem--;

      // if top of displayed list
      if (gpActiveListBox->sCurSelectedItem < gpActiveListBox->usItemDisplayedOnTopOfList)
        gpActiveListBox->usItemDisplayedOnTopOfList--;
    }

    DisplaySelectedListBox();
  }
}

function ScrollAreaRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    CalcPositionOfNewScrollBoxLocation();
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    CalcPositionOfNewScrollBoxLocation();
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
    CreateDestroyDisplaySelectNpcDropDownBox();
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;
  }
}

function ScrollAreaMovementCallBack(pRegion: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion->uiFlags &= (~BUTTON_CLICKED_ON);

    //		CalcPositionOfNewScrollBoxLocation();

    InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    //		CalcPositionOfNewScrollBoxLocation();

    InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_MOVE) {
    if (gfLeftButtonState) {
      CalcPositionOfNewScrollBoxLocation();
    }

    InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
  }
}

function CalcPositionOfNewScrollBoxLocation(): void {
  let sMouseXPos: INT16;
  let sMouseYPos: INT16;
  let sIncrementValue: INT16;
  let dValue: FLOAT;
  let sHeight: INT16 = 0;
  //	INT16	sHeightOfScrollBox = (INT16)(gpActiveListBox->usScrollBarHeight / (FLOAT)(gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usStartIndex ) + .5);
  let sHeightOfScrollBox: INT16 = (gpActiveListBox->usScrollBarHeight / (gpActiveListBox->usMaxArrayIndex) + .5);
  let sStartPosOfScrollArea: INT16 = gpActiveListBox->usScrollPosY + gpActiveListBox->usScrollArrowHeight;

  sMouseXPos = gusMouseXPos;
  sMouseYPos = gusMouseYPos;

  // if we have to scroll
  if (sMouseYPos > sStartPosOfScrollArea || sMouseYPos < (sStartPosOfScrollArea + gpActiveListBox->usScrollBarHeight)) {
    // Calculate the number of items we have to move
    sHeight = sMouseYPos - sStartPosOfScrollArea;

    dValue = sHeight / (gpActiveListBox->usScrollBarHeight);
    sIncrementValue = ((dValue) * (gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usStartIndex) + .5) + gpActiveListBox->usStartIndex;
    //		sIncrementValue = (INT16)( ( dValue ) * ( gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usStartIndex ) + .5 );

    IncrementActiveDropDownBox(sIncrementValue);
    /*
                    //if the mouse was clicked above the scroll box
                    if( sIncrementValue < gpActiveListBox->sCurSelectedItem )
                    {
                            if( ( gpActiveListBox->usItemDisplayedOnTopOfList - sIncrementValue ) <= 0 )
                                    gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usStartIndex;
                            else
                                    gpActiveListBox->usItemDisplayedOnTopOfList = sIncrementValue;

                    }
                    // else the mouse was clicked below the scroll box
                    else
                    {
                            if( sIncrementValue >= ( gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usMaxNumDisplayedItems ) )
                                    gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usMaxNumDisplayedItems;
                            else
                                    gpActiveListBox->usItemDisplayedOnTopOfList = sIncrementValue;
                    }

                    gpActiveListBox->sCurSelectedItem = sIncrementValue;
    */
  }

  /*
          if( sMouseYPos < gpActiveListBox->usScrollBoxY )
          {
                  if( ( gpActiveListBox->sCurSelectedItem - 10 ) > 0 )
                          sIncrementValue = 10;
                  else
                          sIncrementValue = 1;

                  gpActiveListBox->sCurSelectedItem -= sIncrementValue;

                  //if we dont have to scroll,
                  if( gpActiveListBox->usNumDisplayedItems < gpActiveListBox->usMaxNumDisplayedItems )
                  {

                  }
                  else
                  {
                          if( gpActiveListBox->sCurSelectedItem < gpActiveListBox->usItemDisplayedOnTopOfList )
                                  gpActiveListBox->usItemDisplayedOnTopOfList -= sIncrementValue;
                  }
          }
          else if( sMouseYPos > ( gpActiveListBox->usScrollBoxY + sHeightOfScrollBox ) )//usScrollBoxEndY
          {
                  if( ( gpActiveListBox->sCurSelectedItem + 10 ) < gpActiveListBox->usMaxArrayIndex-1 )
                          sIncrementValue = 10;
                  else
                          sIncrementValue = 1;

                  gpActiveListBox->sCurSelectedItem += sIncrementValue;

                  //if we dont have to scroll,
                  if( gpActiveListBox->usNumDisplayedItems < gpActiveListBox->usMaxNumDisplayedItems )
                  {

                  }
                  else
                  {
                          if( ( gpActiveListBox->sCurSelectedItem - gpActiveListBox->usItemDisplayedOnTopOfList ) >= gpActiveListBox->usNumDisplayedItems )
                                  gpActiveListBox->usItemDisplayedOnTopOfList += sIncrementValue;
                  }
          }
  */

  DisplaySelectedListBox();
}

function BtnQuestDebugAddNpcToLocationButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let zTemp: CHAR16[] /* [512] */;
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    swprintf(zTemp, "%s where %s will be added.", QuestDebugText[QUEST_DBS_ENTER_GRID_NUM], gMercProfiles[gNpcListBox.sCurSelectedItem].zNickname);
    TextEntryBox(zTemp, AddNPCToGridNo);

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugAddItemToLocationButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let zTemp: CHAR16[] /* [512] */;
    let zItemName: UINT16[] /* [SIZE_ITEM_NAME] */;
    //		UINT16	zItemDesc[ SIZE_ITEM_INFO ];
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    //		if ( !LoadItemInfo( gItemListBox.sCurSelectedItem, zItemName, zItemDesc ) )
    //			Assert(0);
    wcscpy(zItemName, ShortItemNames[gItemListBox.sCurSelectedItem]);

    swprintf(zTemp, "%s where the %s will be added.", QuestDebugText[QUEST_DBS_ENTER_GRID_NUM], zItemName);
    TextEntryBox(zTemp, AddItemToGridNo);

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugGiveItemToNPCButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let pSoldier: Pointer<SOLDIERTYPE>;
    let Object: OBJECTTYPE;

    CreateItem(gItemListBox.sCurSelectedItem, 100, &Object);

    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    // if the selected merc is created
    if (gfUseLocalNPCs)
      pSoldier = FindSoldierByProfileID(gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem], FALSE);
    else
      pSoldier = FindSoldierByProfileID(gNpcListBox.sCurSelectedItem, FALSE);

    if (!pSoldier) {
      // Failed to get npc, put error message
      return;
    }

    // Give the selected item to the selected merc
    if (!AutoPlaceObject(pSoldier, &Object, TRUE)) {
      // failed to add item, put error message to screen
    }

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugChangeDayButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let zTemp: CHAR16[] /* [512] */;

    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    swprintf(zTemp, "%s   Current Day is %d", QuestDebugText[QUEST_DBS_PLEASE_ENTER_DAY], GetWorldDay());

    // get the day to change the game day to
    TextEntryBox(zTemp, ChangeDayNumber);

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugViewNPCInvButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    gubNPCInventoryPopupAction = QD_DROP_DOWN_CREATE;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugRestoreNPCInvButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    // loop through all the active NPC's and refresh their inventory
    RefreshAllNPCInventory();

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugNPCLogButtonButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let zName: wchar_t[] /* [128] */;

    //		btn->uiFlags &= (~BUTTON_CLICKED_ON );

    if (gfNpcLogButton) {
      gfNpcLogButton = FALSE;
      btn->uiFlags &= (~BUTTON_CLICKED_ON);
    } else {
      gfNpcLogButton = TRUE;
      btn->uiFlags |= BUTTON_CLICKED_ON;
    }

    swprintf(zName, "%s - (%s)", QuestDebugText[QUEST_DBS_NPC_LOG_BUTTON], gfNpcLogButton ? "On" : "Off");
    SpecifyButtonText(guiQuestDebugNPCLogButtonButton, zName);

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugNPCRefreshButtonButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let fRetVal: BOOLEAN = FALSE;
    let zTemp: CHAR16[] /* [128] */;
    let ubMercID: UINT8 = 0;

    if (gfUseLocalNPCs) {
      ubMercID = gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem];
      fRetVal = ReloadQuoteFile(gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem]);
    } else {
      if (gNpcListBox.sCurSelectedItem != -1) {
        // NB ubMercID is really profile ID
        ubMercID = gNpcListBox.sCurSelectedItem;
        fRetVal = ReloadQuoteFile(gNpcListBox.sCurSelectedItem);
        gMercProfiles[ubMercID].ubLastDateSpokenTo = 0;
      }
    }

    // if the function succeded
    if (fRetVal) {
      swprintf(zTemp, "%s %s", QuestDebugText[QUEST_DBS_REFRESH_OK], gMercProfiles[ubMercID].zNickname);
    } else {
      swprintf(zTemp, "%s %s", QuestDebugText[QUEST_DBS_REFRESH_FAILED], gMercProfiles[ubMercID].zNickname);
    }

    DoQDSMessageBox(MSG_BOX_BASIC_STYLE, zTemp, QUEST_DEBUG_SCREEN, MSG_BOX_FLAG_OK, NULL);

    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugStartMercTalkingButtonButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // Ask for the initial quote num to start talking from
    //		DoQDSMessageBox( MSG_BOX_BASIC_STYLE, zTemp, QUEST_DEBUG_SCREEN, MSG_BOX_FLAG_OK, NULL );

    // set the initial value
    gsQdsEnteringGridNo = 0;

    TextEntryBox(QuestDebugText[QUEST_DBS_START_MERC_TALKING_FROM], StartMercTalkingFromQuoteNum);

    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function CreateDestroyDisplayTextEntryBox(ubAction: UINT8, pString: STR16, EntryCallBack: TEXT_ENTRY_CALLBACK): BOOLEAN {
  /* static */ let fMouseRegionCreated: BOOLEAN = FALSE;
  /* static */ let zString: wchar_t[] /* [256] */;
  /* static */ let TextEntryCallback: TEXT_ENTRY_CALLBACK;

  switch (ubAction) {
    case QD_DROP_DOWN_NO_ACTION: {
    } break;

    case QD_DROP_DOWN_CREATE: {
      if (fMouseRegionCreated)
        break;

      fMouseRegionCreated = TRUE;

      // create a mask to block out the screen
      if (!gfBackgroundMaskEnabled) {
        MSYS_DefineRegion(&gQuestTextEntryDebugDisableScreenRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGH + 40, CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, QuestDebugTextEntryDisableScreenRegionCallBack);
        MSYS_AddRegion(&gQuestTextEntryDebugDisableScreenRegion);
        gfBackgroundMaskEnabled = TRUE;
      }

      // create the ok button
      guiQuestDebugTextEntryOkBtn = CreateTextButton("OK", QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_TEB_X + QUEST_DBS_TEB_WIDTH / 2 - 12, QUEST_DBS_TEB_Y + QUEST_DBS_TEB_HEIGHT - 30, 30, 25, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 50, BUTTON_NO_CALLBACK, BtnQuestDebugTextEntryOkBtnButtonCallback);
      SetButtonCursor(guiQuestDebugTextEntryOkBtn, CURSOR_WWW);

      wcscpy(zString, pString);

      gfTextEntryActive = TRUE;

      InitQuestDebugTextInputBoxes();

      TextEntryCallback = EntryCallBack;
    } break;

    case QD_DROP_DOWN_CANCEL:
    case QD_DROP_DOWN_DESTROY: {
      let zText: wchar_t[] /* [32] */;
      let iTextEntryNumber: INT32;

      if (!fMouseRegionCreated)
        break;

      // Remove the mouse region that disables the screen
      if (gfBackgroundMaskEnabled) {
        MSYS_RemoveRegion(&gQuestTextEntryDebugDisableScreenRegion);
        gfBackgroundMaskEnabled = FALSE;
      }

      // remove the 'ok' button on the text entry field
      RemoveButton(guiQuestDebugTextEntryOkBtn);

      // Mouse regions are removed
      fMouseRegionCreated = FALSE;
      gfTextEntryActive = FALSE;

      // redraw the entire screen
      gfRedrawQuestDebugSystem = TRUE;

      // get the striong from the text field
      Get16BitStringFromField(0, zText);

      // if the text is not null
      if (zText[0] != '\0') {
        // get the number from the string
        swscanf(zText, "%ld", &iTextEntryNumber);
      } else
        iTextEntryNumber = 0;

      // remove the text input field
      DestroyQuestDebugTextInputBoxes();

      if (ubAction != QD_DROP_DOWN_CANCEL)
        (*(TextEntryCallback))(iTextEntryNumber);
    } break;

    case QD_DROP_DOWN_DISPLAY: {
      // Display the text entry box frame
      ColorFillVideoSurfaceArea(FRAME_BUFFER, QUEST_DBS_TEB_X, QUEST_DBS_TEB_Y, QUEST_DBS_TEB_X + QUEST_DBS_TEB_WIDTH, QUEST_DBS_TEB_Y + QUEST_DBS_TEB_HEIGHT, Get16BPPColor(FROMRGB(45, 59, 74)));

      // Display the text box caption
      DisplayWrappedString(QUEST_DBS_TEB_X + 10, QUEST_DBS_TEB_Y + 10, QUEST_DBS_TEB_WIDTH - 20, 2, QUEST_DBS_FONT_TEXT_ENTRY, QUEST_DBS_COLOR_TEXT_ENTRY, zString, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

      InvalidateRegion(QUEST_DBS_TEB_X, QUEST_DBS_TEB_Y, QUEST_DBS_TEB_X + QUEST_DBS_TEB_WIDTH, QUEST_DBS_TEB_Y + QUEST_DBS_TEB_HEIGHT);
    } break;
  }

  return TRUE;
}

function QuestDebugTextEntryDisableScreenRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
    CreateDestroyDisplaySelectNpcDropDownBox();
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DESTROY;
    CreateDestroyDisplaySelectNpcDropDownBox();
    gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_NO_ACTION;
  }
}

function BtnQuestDebugTextEntryOkBtnButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    gubTextEntryAction = QD_DROP_DOWN_DESTROY;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function TextEntryBox(pString: STR16, TextEntryCallBack: TEXT_ENTRY_CALLBACK): void {
  CreateDestroyDisplayTextEntryBox(QD_DROP_DOWN_CREATE, pString, TextEntryCallBack);
  gubTextEntryAction = QD_DROP_DOWN_DISPLAY;
}

function ScrollQuestListRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let String: wchar_t[] /* [512] */;

    gubCurQuestSelected = MSYS_GetRegionUserData(pRegion, 0);

    // qqq
    swprintf(String, "%s %s %d \"%s\" ( %s )", QuestDebugText[QUEST_DBS_ENTER_NEW_VALUE], QuestDebugText[QUEST_DBS_QUEST_NUM], gubCurQuestSelected, QuestDescText[gubCurQuestSelected], QuestDebugText[QUEST_DBS_0_1_2]);

    TextEntryBox(String, ChangeQuestState);
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
  }
}

function ScrollFactListRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let String: wchar_t[] /* [512] */;

    gusCurFactSelected = MSYS_GetRegionUserData(pRegion, 0) + gusFactAtTopOfList;

    if (FactDescText[gusCurFactSelected][0] == '\0')
      swprintf(String, "%s %s %d \"%s\" ( %s )", QuestDebugText[QUEST_DBS_ENTER_NEW_VALUE], QuestDebugText[QUEST_DBS_FACT_NUM], gusCurFactSelected, QuestDebugText[QUEST_DBS_NO_TEXT], QuestDebugText[QUEST_DBS_0_1]);
    else
      swprintf(String, "%s %s %d \"%s\" ( %s )", QuestDebugText[QUEST_DBS_ENTER_NEW_VALUE], QuestDebugText[QUEST_DBS_FACT_NUM], gusCurFactSelected, FactDescText[gusCurFactSelected], QuestDebugText[QUEST_DBS_0_1]);

    TextEntryBox(String, ChangeFactState);
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
  }
}

function InitQuestDebugTextInputBoxes(): void {
  let uiStartLoc: UINT32 = 0;
  let sTemp: wchar_t[] /* [640] */;
  //	wchar_t	sText[ 640 ];

  InitTextInputMode();
  SetTextInputFont(FONT12ARIAL);
  Set16BPPTextFieldColor(Get16BPPColor(FROMRGB(255, 255, 255)));
  SetBevelColors(Get16BPPColor(FROMRGB(136, 138, 135)), Get16BPPColor(FROMRGB(24, 61, 81)));
  SetTextInputRegularColors(2, FONT_WHITE);
  SetTextInputHilitedColors(FONT_WHITE, 2, 141);
  SetCursorColor(Get16BPPColor(FROMRGB(0, 0, 0)));

  //	AddUserInputField( NULL );
  //	AddUserInputField( FlowerOrderUserTextFieldCallBack );

  /*
          if( gbCurrentlySelectedCard != -1 )
          {
          }
  */

  swprintf(sTemp, "%d", gsQdsEnteringGridNo);

  // Text entry field
  AddTextInputField(QUEST_DBS_TEB_X + QUEST_DBS_TEB_WIDTH / 2 - 30, QUEST_DBS_TEB_Y + 65, 60, 15, MSYS_PRIORITY_HIGH + 60, sTemp, QUEST_DBS_TEXT_FIELD_WIDTH, INPUTTYPE_NUMERICSTRICT);
}

function DestroyQuestDebugTextInputBoxes(): void {
  KillTextInputMode();
}

function AddNPCToGridNo(iGridNo: INT32): void {
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let ubID: UINT8;

  GetCurrentWorldSector(&sSectorX, &sSectorY);

  memset(&MercCreateStruct, 0, sizeof(MercCreateStruct));
  MercCreateStruct.bTeam = CIV_TEAM;
  MercCreateStruct.ubProfile = gpActiveListBox->sCurSelectedItem;
  MercCreateStruct.sSectorX = sSectorX;
  MercCreateStruct.sSectorY = sSectorY;
  MercCreateStruct.bSectorZ = gbWorldSectorZ;
  MercCreateStruct.sInsertionGridNo = iGridNo;

  //	RandomizeNewSoldierStats( &MercCreateStruct );

  if (TacticalCreateSoldier(&MercCreateStruct, &ubID)) {
    AddSoldierToSector(ubID);

    // So we can see them!
    AllTeamsLookForAll(NO_INTERRUPTS);
  }

  // Add all the npc in the current sectory the npc array
  AddNPCsInSectorToArray();

  gsQdsEnteringGridNo = iGridNo;
}

function AddItemToGridNo(iGridNo: INT32): void {
  let Object: OBJECTTYPE;

  gsQdsEnteringGridNo = iGridNo;

  if (Item[gItemListBox.sCurSelectedItem].usItemClass == IC_KEY) {
    gfAddKeyNextPass = TRUE;
    //		swprintf( zTemp, L"Please enter the Key ID" );
    //		TextEntryBox( zTemp, AddKeyToGridNo );
  } else {
    CreateItem(gItemListBox.sCurSelectedItem, (gfDropDamagedItems ? (20 + Random(60)) : 100), &Object);

    // add the item to the world
    AddItemToPool(iGridNo, &Object, -1, 0, 0, 0);
  }
}

function AddKeyToGridNo(iKeyID: INT32): void {
  let Object: OBJECTTYPE;

  if (iKeyID < NUM_KEYS) {
    CreateKeyObject(&Object, 1, iKeyID);

    // add the item to the world
    AddItemToPool(gsQdsEnteringGridNo, &Object, -1, 0, 0, 0);
  } else
    gfAddKeyNextPass = TRUE;
}

function ChangeDayNumber(iDayToChangeTo: INT32): void {
  let uiDiff: INT32;
  let uiNewDayTimeInSec: UINT32;

  if (iDayToChangeTo) {
    uiNewDayTimeInSec = (guiDay + iDayToChangeTo) * NUM_SEC_IN_DAY + 8 * NUM_SEC_IN_HOUR + 15 * NUM_SEC_IN_MIN;
    uiDiff = uiNewDayTimeInSec - guiGameClock;
    WarpGameTime(uiDiff, WARPTIME_PROCESS_EVENTS_NORMALLY);

    ForecastDayEvents();

    // empty dialogue que of all sounds ( guys complain about being tired )
    //
    //	ATE: Please Fix Me!
    //		EmptyDialogueQueue();
  }
}

function CreateDestroyDisplayNPCInventoryPopup(ubAction: UINT8): void {
  /* static */ let fMouseRegionCreated: BOOLEAN = FALSE;
  let usPosY: UINT16;
  let i: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;

  switch (ubAction) {
    case QD_DROP_DOWN_NO_ACTION:
      break;

    case QD_DROP_DOWN_CREATE:

      // if the soldier is active
      if (gfUseLocalNPCs)
        pSoldier = FindSoldierByProfileID(gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem], FALSE);
      else
        pSoldier = FindSoldierByProfileID(gNpcListBox.sCurSelectedItem, FALSE);

      if (!pSoldier) {
        // qq Display error box

        gubNPCInventoryPopupAction = QD_DROP_DOWN_NO_ACTION;
        break;
      }

      if (fMouseRegionCreated)
        break;

      fMouseRegionCreated = TRUE;

      // create a mask to block out the screen
      if (!gfBackgroundMaskEnabled) {
        MSYS_DefineRegion(&gQuestTextEntryDebugDisableScreenRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGH + 40, CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, QuestDebugTextEntryDisableScreenRegionCallBack);
        MSYS_AddRegion(&gQuestTextEntryDebugDisableScreenRegion);
        gfBackgroundMaskEnabled = TRUE;
      }

      // create the ok button
      guiQuestDebugNPCInventOkBtn = CreateTextButton("OK", QUEST_DBS_FONT_STATIC_TEXT, QUEST_DBS_COLOR_STATIC_TEXT, FONT_BLACK, BUTTON_USE_DEFAULT, QUEST_DBS_NPC_INV_POPUP_X + QUEST_DBS_NPC_INV_POPUP_WIDTH / 2 - 12, QUEST_DBS_NPC_INV_POPUP_Y + QUEST_DBS_NPC_INV_POPUP_HEIGHT - 30, 30, 25, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 50, BUTTON_NO_CALLBACK, BtnQuestDebugNPCInventOkBtnButtonCallback);
      SetButtonCursor(guiQuestDebugNPCInventOkBtn, CURSOR_WWW);

      break;

    case QD_DROP_DOWN_DESTROY:
      RemoveButton(guiQuestDebugNPCInventOkBtn);

      if (gfBackgroundMaskEnabled)
        MSYS_RemoveRegion(&gQuestTextEntryDebugDisableScreenRegion);
      gfBackgroundMaskEnabled = FALSE;

      gfRedrawQuestDebugSystem = TRUE;

      fMouseRegionCreated = FALSE;

      break;

    case QD_DROP_DOWN_DISPLAY: {
      let zItemName: UINT16[] /* [SIZE_ITEM_NAME] */;
      //			UINT16	zItemDesc[ SIZE_ITEM_INFO ];
      let usFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_LISTBOX_TEXT) + 2;

      // if the soldier is active
      // if the soldier is active
      if (gfUseLocalNPCs)
        pSoldier = FindSoldierByProfileID(gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem], FALSE);
      else
        pSoldier = FindSoldierByProfileID(gNpcListBox.sCurSelectedItem, FALSE);

      if (pSoldier) {
        // color the background of the popup
        ColorFillVideoSurfaceArea(FRAME_BUFFER, QUEST_DBS_NPC_INV_POPUP_X, QUEST_DBS_NPC_INV_POPUP_Y, QUEST_DBS_NPC_INV_POPUP_X + QUEST_DBS_NPC_INV_POPUP_WIDTH, QUEST_DBS_NPC_INV_POPUP_Y + QUEST_DBS_NPC_INV_POPUP_HEIGHT, Get16BPPColor(FROMRGB(45, 59, 74)));

        // Dispaly the NPC inve title
        DrawTextToScreen(QuestDebugText[QUEST_DBS_NPC_INVENTORY], QUEST_DBS_NPC_INV_POPUP_X, QUEST_DBS_NPC_INV_POPUP_Y + 5, QUEST_DBS_NPC_INV_POPUP_WIDTH, QUEST_DBS_FONT_TITLE, QUEST_DBS_COLOR_TITLE, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

        // Dispaly the current npc name
        if (gfUseLocalNPCs)
          DrawTextToScreen(gMercProfiles[gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem]].zNickname, QUEST_DBS_NPC_INV_POPUP_X, QUEST_DBS_NPC_INV_POPUP_Y + 20, QUEST_DBS_NPC_INV_POPUP_WIDTH, QUEST_DBS_FONT_TITLE, QUEST_DBS_COLOR_SUBTITLE, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
        else
          DrawTextToScreen(gMercProfiles[gNpcListBox.sCurSelectedItem].zNickname, QUEST_DBS_NPC_INV_POPUP_X, QUEST_DBS_NPC_INV_POPUP_Y + 20, QUEST_DBS_NPC_INV_POPUP_WIDTH, QUEST_DBS_FONT_TITLE, QUEST_DBS_COLOR_SUBTITLE, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

        usPosY = QUEST_DBS_NPC_INV_POPUP_Y + 40;
        for (i = 0; i < NUM_INV_SLOTS; i++) {
          //					if ( !LoadItemInfo( pSoldier->inv[ i ].usItem, zItemName, zItemDesc ) )
          //						Assert(0);
          wcscpy(zItemName, ShortItemNames[pSoldier->inv[i].usItem]);

          // Display Name of the pocket
          DrawTextToScreen(PocketText[i], QUEST_DBS_NPC_INV_POPUP_X + 10, usPosY, 0, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_SUBTITLE, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

          // Display the contents of the pocket
          DrawTextToScreen(zItemName, QUEST_DBS_NPC_INV_POPUP_X + 140, usPosY, 0, QUEST_DBS_FONT_DYNAMIC_TEXT, QUEST_DBS_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
          usPosY += usFontHeight;
        }
      }
      InvalidateRegion(0, 0, 640, 480);
      MarkButtonsDirty();
    } break;
  }
}

function BtnQuestDebugNPCInventOkBtnButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    gubNPCInventoryPopupAction = QD_DROP_DOWN_DESTROY;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQuestDebugAllOrSectorNPCToggleCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gfUseLocalNPCs) {
      gfUseLocalNPCs = FALSE;

      gNpcListBox.sCurSelectedItem = gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem];
      gNpcListBox.usItemDisplayedOnTopOfList = gNpcListBox.sCurSelectedItem;
      //			gNpcListBox.usStartIndex									= FIRST_RPC;

      gNpcListBox.usMaxArrayIndex = NUM_PROFILES;
      gNpcListBox.usNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;
      gNpcListBox.usMaxNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;
    } else {
      gfUseLocalNPCs = TRUE;

      gNpcListBox.sCurSelectedItem = -1;
      gNpcListBox.usItemDisplayedOnTopOfList = 0;
      gNpcListBox.usStartIndex = 0;
      gNpcListBox.usMaxArrayIndex = gubNumNPCinSector;

      if (gubNumNPCinSector < QUEST_DBS_MAX_DISPLAYED_ENTRIES) {
        gNpcListBox.usNumDisplayedItems = gubNumNPCinSector;
        gNpcListBox.usMaxNumDisplayedItems = gubNumNPCinSector;
      } else {
        gNpcListBox.usNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;
        gNpcListBox.usMaxNumDisplayedItems = QUEST_DBS_MAX_DISPLAYED_ENTRIES;
      }

      if (gNpcListBox.sCurSelectedItem == -1) {
        DisableButton(guiQuestDebugAddNpcToLocationButton);
        DisableButton(guiQuestDebugViewNPCInvButton);
        DisableButton(guiQuestDebugStartMercTalkingButtonButton);
      }

      if (IsMercInTheSector(gNpcListBox.sCurSelectedItem) == -1)
        DisableButton(guiQuestDebugViewNPCInvButton);

      EnableQDSButtons();
    }

    /*
                    if( gubNumNPCinSector == 0 )
                            SpecifyButtonText( guiQuestDebugCurNPCButton, QuestDebugText[ QUEST_DBS_NO_NPC_IN_SECTOR ] );
                    else
                            SpecifyButtonText( guiQuestDebugCurNPCButton, QuestDebugText[ QUEST_DBS_SELECTED_NPC ] );
    */
    gfRedrawQuestDebugSystem = TRUE;
  }
}

function AddNPCsInSectorToArray(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: UINT16;
  let i: UINT16;

  // Setup array of merc who are in the current sector
  i = 0;
  for (pSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pSoldier++, cnt++) {
    if ((pSoldier != NULL) && pSoldier->bActive) {
      // if soldier is a NPC, add him to the local NPC array
      if ((pSoldier->ubProfile >= FIRST_RPC) && (pSoldier->ubProfile < NUM_PROFILES)) {
        gubCurrentNpcInSector[i] = pSoldier->ubProfile;
        i++;
      }
    }
  }
  gubNumNPCinSector = i;
}

function ChangeQuestState(iNumber: INT32): void {
  if ((iNumber >= 0) && (iNumber <= 2)) {
    gubQuest[gubCurQuestSelected] = iNumber;
    gfRedrawQuestDebugSystem = TRUE;
  }
}

function ChangeFactState(iNumber: INT32): void {
  if ((iNumber >= 0) && (iNumber <= 1)) {
    gubFact[gusCurFactSelected] = iNumber;
    gfRedrawQuestDebugSystem = TRUE;
  }
}

function BtnQDPgUpButtonButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    if ((gusFactAtTopOfList - QUEST_DBS_NUM_DISPLAYED_FACTS) >= 0) {
      gusFactAtTopOfList -= QUEST_DBS_NUM_DISPLAYED_FACTS;
    } else
      gusFactAtTopOfList = 0;

    gfRedrawQuestDebugSystem = TRUE;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnQDPgDownButtonButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    if ((gusFactAtTopOfList + QUEST_DBS_NUM_DISPLAYED_FACTS) < NUM_FACTS) {
      gusFactAtTopOfList += QUEST_DBS_NUM_DISPLAYED_FACTS;
    } else
      gusFactAtTopOfList = NUM_FACTS - QUEST_DBS_NUM_DISPLAYED_FACTS;

    gfRedrawQuestDebugSystem = TRUE;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function NpcRecordLoggingInit(ubNpcID: UINT8, ubMercID: UINT8, ubQuoteNum: UINT8, ubApproach: UINT8): void {
  /* static */ let fFirstTimeIn: BOOLEAN = TRUE;

  let hFile: HWFILE;
  let uiByteWritten: UINT32;
  let DestString: char[] /* [1024] */;
  //	char			MercName[ NICKNAME_LENGTH ];
  //	char			NpcName[ NICKNAME_LENGTH ];

  DestString[0] = '\0';

  // if the npc log button is turned off, ignore
  if (!gfNpcLogButton)
    return;

  // if the approach is NPC_INITIATING_CONV, return
  if (ubApproach == NPC_INITIATING_CONV)
    return;

  // if its the first time in the game
  if (fFirstTimeIn) {
    // open a new file for writing

    // if the file exists
    if (FileExists(QUEST_DEBUG_FILE)) {
      // delete the file
      if (!FileDelete(QUEST_DEBUG_FILE)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to delete %s file", QUEST_DEBUG_FILE));
        return;
      }
    }
    fFirstTimeIn = FALSE;
  }

  // open the file
  hFile = FileOpen(QUEST_DEBUG_FILE, FILE_OPEN_ALWAYS | FILE_ACCESS_WRITE, FALSE);
  if (!hFile) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to open Quest Debug File %s", QUEST_DEBUG_FILE));
    return;
  }

  if (FileSeek(hFile, 0, FILE_SEEK_FROM_END) == FALSE) {
    // error
    FileClose(hFile);
    return;
  }

  sprintf(DestString, "\n\n\nNew Approach for NPC ID: %d '%S' against Merc: %d '%S'", ubNpcID, gMercProfiles[ubNpcID].zNickname, ubMercID, gMercProfiles[ubMercID].zNickname);
  //	sprintf( DestString, "\n\n\nNew Approach for NPC ID: %d  against Merc: %d ", ubNpcID, ubMercID );

  if (!FileWrite(hFile, DestString, strlen(DestString), &uiByteWritten)) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to write to %s", QUEST_DEBUG_FILE));
    return;
  }

  // Testing Record #
  sprintf(DestString, "\n\tTesting Record #: %d", ubQuoteNum);

  // append to file
  if (!FileWrite(hFile, DestString, strlen(DestString), &uiByteWritten)) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to write to %s", QUEST_DEBUG_FILE));
    return;
  }

  FileClose(hFile);
}

function NpcRecordLogging(ubApproach: UINT8, pStringA: STR, ...args: any[]): void {
  /* static */ let fFirstTimeIn: BOOLEAN = TRUE;
  //	static UINT32		uiLineNumber = 1;
  //	static UINT32		uiRecordNumber = 1;
  let hFile: HWFILE;
  let uiByteWritten: UINT32;
  let argptr: va_list;
  let TempString: char[] /* [1024] */;
  let DestString: char[] /* [1024] */;

  TempString[0] = '\0';
  DestString[0] = '\0';

  // if the npc log button is turned off, ignore
  if (!gfNpcLogButton)
    return;

  // if the approach is NPC_INITIATING_CONV, return
  if (ubApproach == NPC_INITIATING_CONV)
    return;

  va_start(argptr, pStringA); // Set up variable argument pointer
  vsprintf(TempString, pStringA, argptr); // process gprintf string (get output str)
  va_end(argptr);

  // open the file
  hFile = FileOpen(QUEST_DEBUG_FILE, FILE_OPEN_ALWAYS | FILE_ACCESS_WRITE, FALSE);
  if (!hFile) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to open Quest Debug File %s", QUEST_DEBUG_FILE));
    return;
  }

  if (FileSeek(hFile, 0, FILE_SEEK_FROM_END) == FALSE) {
    // error
    FileClose(hFile);
    return;
  }

  sprintf(DestString, "\n\t\t%s", TempString);

  // append to file
  if (!FileWrite(hFile, DestString, strlen(DestString), &uiByteWritten)) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to write to %s", QUEST_DEBUG_FILE));
    return;
  }

  FileClose(hFile);
}

function EnableQDSButtons(): void {
  if (gNpcListBox.sCurSelectedItem != -1) {
    EnableButton(guiQuestDebugAddNpcToLocationButton);
    EnableButton(guiQuestDebugStartMercTalkingButtonButton);
    EnableButton(guiQuestDebugNPCLogButtonButton);
    EnableButton(guiQuestDebugNPCRefreshButtonButton);
  } else {
    DisableButton(guiQuestDebugStartMercTalkingButtonButton);
    DisableButton(guiQuestDebugAddNpcToLocationButton);
    DisableButton(guiQuestDebugNPCLogButtonButton);
    DisableButton(guiQuestDebugNPCRefreshButtonButton);
  }

  if (gItemListBox.sCurSelectedItem != -1)
    EnableButton(guiQuestDebugAddItemToLocationButton);
  else
    DisableButton(guiQuestDebugAddItemToLocationButton);

  if (gItemListBox.sCurSelectedItem != -1 && gNpcListBox.sCurSelectedItem != 0) {
    EnableButton(guiQuestDebugGiveItemToNPCButton);
  } else {
    DisableButton(guiQuestDebugGiveItemToNPCButton);
  }

  if (gfUseLocalNPCs) {
    if (IsMercInTheSector(gubCurrentNpcInSector[gNpcListBox.sCurSelectedItem]) != -1) {
      EnableButton(guiQuestDebugViewNPCInvButton);
      EnableButton(guiQuestDebugNPCRefreshButtonButton);
      EnableButton(guiQuestDebugAddNpcToLocationButton);
    } else {
      DisableButton(guiQuestDebugAddNpcToLocationButton);
      DisableButton(guiQuestDebugViewNPCInvButton);
      DisableButton(guiQuestDebugNPCRefreshButtonButton);
    }
  }
  /*
          else
          {
                  if( IsMercInTheSector( gNpcListBox.sCurSelectedItem ) != -1 )
                  {
                          EnableButton( guiQuestDebugAddNpcToLocationButton );
                          EnableButton( guiQuestDebugViewNPCInvButton );
                          EnableButton( guiQuestDebugNPCRefreshButtonButton );
                  }
                  else
                  {
  //			DisableButton( guiQuestDebugAddNpcToLocationButton );
  //			DisableButton( guiQuestDebugViewNPCInvButton );
  //			DisableButton( guiQuestDebugNPCRefreshButtonButton );
                  }
          }
  */
}

function DoQDSMessageBox(ubStyle: UINT8, zString: Pointer<INT16>, uiExitScreen: UINT32, ubFlags: UINT8, ReturnCallback: MSGBOX_CALLBACK): BOOLEAN {
  let pCenteringRect: SGPRect = [ 0, 0, 639, 479 ];

  // reset exit mode
  gfExitQdsDueToMessageBox = TRUE;
  gfQuestDebugEntry = TRUE;

  // do message box and return
  giQdsMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (ubFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, &pCenteringRect);

  // send back return state
  return giQdsMessageBox != -1;
}

function IncrementActiveDropDownBox(sIncrementValue: INT16): void {
  if (sIncrementValue < 0)
    sIncrementValue = 0;

  // if the mouse was clicked above the scroll box
  if (sIncrementValue < gpActiveListBox->sCurSelectedItem) {
    if ((sIncrementValue) <= gpActiveListBox->usStartIndex) {
      gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usStartIndex;
      sIncrementValue = gpActiveListBox->usStartIndex;
    } else if (sIncrementValue < gpActiveListBox->usItemDisplayedOnTopOfList && gpActiveListBox->usItemDisplayedOnTopOfList > gpActiveListBox->usStartIndex) {
      gpActiveListBox->usItemDisplayedOnTopOfList = sIncrementValue;
    }
  }
  // else the mouse was clicked below the scroll box
  else {
    if (sIncrementValue >= (gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usMaxNumDisplayedItems)) {
      if (gpActiveListBox->usItemDisplayedOnTopOfList >= gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usMaxNumDisplayedItems)
        gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usMaxNumDisplayedItems;
      else if ((sIncrementValue - gpActiveListBox->usItemDisplayedOnTopOfList) >= gpActiveListBox->usMaxNumDisplayedItems) {
        gpActiveListBox->usItemDisplayedOnTopOfList = sIncrementValue - gpActiveListBox->usMaxNumDisplayedItems + 1;
      }

      if (sIncrementValue >= gpActiveListBox->usMaxArrayIndex)
        sIncrementValue = gpActiveListBox->usMaxArrayIndex - 1;
    } else if (sIncrementValue >= gpActiveListBox->usMaxArrayIndex) {
      sIncrementValue = gpActiveListBox->usMaxArrayIndex - 1;
      gpActiveListBox->usItemDisplayedOnTopOfList = gpActiveListBox->usMaxArrayIndex - gpActiveListBox->usMaxNumDisplayedItems;
    } else if (sIncrementValue >= gpActiveListBox->usItemDisplayedOnTopOfList + gpActiveListBox->usMaxNumDisplayedItems) {
      gpActiveListBox->usItemDisplayedOnTopOfList += sIncrementValue - (gpActiveListBox->usItemDisplayedOnTopOfList + gpActiveListBox->usMaxNumDisplayedItems - 1);
    }
  }

  gpActiveListBox->sCurSelectedItem = sIncrementValue;

  gpActiveListBox->ubCurScrollBoxAction = QD_DROP_DOWN_DISPLAY;
}

function IsMercInTheSector(usMercID: UINT16): INT16 {
  let cnt: UINT8;
  let ubCount: UINT8 = 0;

  if (usMercID == -1)
    return FALSE;

  for (cnt = 0; cnt <= TOTAL_SOLDIERS; cnt++) {
    // if the merc is active
    if (Menptr[cnt].ubProfile == usMercID) {
      if (Menptr[cnt].bActive)
        return Menptr[cnt].ubID;
    }
  }

  return -1;
}

function RefreshAllNPCInventory(): void {
  let usCnt: UINT16;
  let usItemCnt: UINT16;
  let TempObject: OBJECTTYPE;
  let usItem: UINT16;

  for (usCnt = 0; usCnt < TOTAL_SOLDIERS; usCnt++) {
    // if the is active
    if (Menptr[usCnt].bActive == 1) {
      // is the merc a rpc or npc
      if (Menptr[usCnt].ubProfile >= FIRST_RPC) {
        // refresh the mercs inventory
        for (usItemCnt = 0; usItemCnt < NUM_INV_SLOTS; usItemCnt++) {
          // null out the items in the npc inventory
          memset(&Menptr[usCnt].inv[usItemCnt], 0, sizeof(OBJECTTYPE));

          if (gMercProfiles[Menptr[usCnt].ubProfile].inv[usItemCnt] != NOTHING) {
            // get the item
            usItem = gMercProfiles[Menptr[usCnt].ubProfile].inv[usItemCnt];

            // Create the object
            CreateItem(usItem, 100, &TempObject);

            // copy the item into the soldiers inventory
            memcpy(&Menptr[usCnt].inv[usItemCnt], &TempObject, sizeof(OBJECTTYPE));
          }
        }
      }
    }
  }
}

function StartMercTalkingFromQuoteNum(iQuoteToStartTalkingFrom: INT32): void {
  let zTemp: CHAR16[] /* [512] */;
  let uiMaxNumberOfQuotes: INT32 = GetMaxNumberOfQuotesToPlay();

  // make sure the current character is created
  SetQDSMercProfile();

  SetTalkingMercPauseState(FALSE);

  // do some error checks
  if (iQuoteToStartTalkingFrom < 0 || iQuoteToStartTalkingFrom > uiMaxNumberOfQuotes) {
    swprintf(zTemp, "Please enter a value between 0 and %d", uiMaxNumberOfQuotes);
    DoQDSMessageBox(MSG_BOX_BASIC_STYLE, zTemp, QUEST_DEBUG_SCREEN, MSG_BOX_FLAG_OK, NULL);
  } else {
    // Start the merc talking from the selected quote number
    giSelectedMercCurrentQuote = iQuoteToStartTalkingFrom;
  }

  // create a mask to block out the screen
  if (!gfBackgroundMaskEnabled) {
    MSYS_DefineRegion(&gQuestTextEntryDebugDisableScreenRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGH + 3, CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, QuestDebugTextEntryDisableScreenRegionCallBack);
    MSYS_AddRegion(&gQuestTextEntryDebugDisableScreenRegion);
    gfBackgroundMaskEnabled = TRUE;
  }

  DisableFactMouseRegions();
}

function EndMercTalking(): void {
  // remove the talking dialogue
  if (gfNpcPanelIsUsedForTalkingMerc)
    DeleteTalkingMenu();
  gfNpcPanelIsUsedForTalkingMerc = FALSE;

  // remove the mask of the entire screen
  if (gfBackgroundMaskEnabled) {
    MSYS_RemoveRegion(&gQuestTextEntryDebugDisableScreenRegion);
    gfBackgroundMaskEnabled = FALSE;
  }

  giSelectedMercCurrentQuote = -1;

  // make sure we can dirty the button
  if (!gfQuestDebugExit)
    ButtonList[guiQDPgUpButtonButton]->uiFlags &= ~BUTTON_FORCE_UNDIRTY;

  // enable the fact mouse regions
  EnableFactMouseRegions();
}

function HandleQDSTalkingMerc(): void {
  //	static BOOLEAN	fWas
  let fIsTheMercTalking: BOOLEAN = FALSE;
  let ubPanelMercShouldUse: UINT8;

  if (giSelectedMercCurrentQuote != -1) {
    if (gTalkingMercSoldier == NULL)
      return;

    // Call this function to enable or disable the flags in the faces struct ( without modifing the pause state )
    SetTalkingMercPauseState(gfPauseTalkingMercPopup);

    ubPanelMercShouldUse = WhichPanelShouldTalkingMercUse(giSelectedMercCurrentQuote);

    // find out if the merc is talking
    if (ubPanelMercShouldUse == QDS_REGULAR_PANEL)
      fIsTheMercTalking = gFacesData[gTalkingMercSoldier->iFaceIndex].fTalking;
    else
      fIsTheMercTalking = gFacesData[gTalkPanel.iFaceIndex].fTalking;

    // if the merc is not talking
    if (!fIsTheMercTalking) {
      // if we still have more quotes to say
      if (giSelectedMercCurrentQuote < GetMaxNumberOfQuotesToPlay()) {
        // if the user has paused the playing
        if (gfPauseTalkingMercPopup) {
          // get out
          return;
        }

        // Start the merc talking
        if (ubPanelMercShouldUse == QDS_REGULAR_PANEL)
          TacticalCharacterDialogue(gTalkingMercSoldier, giSelectedMercCurrentQuote);
        else if (gfRpcToSaySectorDesc && gTalkingMercSoldier->ubProfile >= 57 && gTalkingMercSoldier->ubProfile <= 60) {
          // ATE: Trigger the sector desc here
          CharacterDialogueWithSpecialEvent(gTalkingMercSoldier->ubProfile, giSelectedMercCurrentQuote, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI, TRUE, FALSE, DIALOGUE_SPECIAL_EVENT_USE_ALTERNATE_FILES, FALSE, FALSE);
        } else
          CharacterDialogue(gTalkingMercSoldier->ubProfile, giSelectedMercCurrentQuote, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI, FALSE, FALSE);

        // Incremenet the current quote number
        giSelectedMercCurrentQuote++;
      } else {
        // Stop the merc from talking
        giSelectedMercCurrentQuote = -1;

        EndMercTalking();
      }
    }

    // Redraw the screen
    gfRedrawQuestDebugSystem = TRUE;
  } else {
    /*
                    //as soon as the panel is no longer active, refresh the screen
                    if( gfFacePanelActive == FALSE )
                    {
                            //Redraw the screen
                            gfRedrawQuestDebugSystem = TRUE;
                    }
    */
  }
}

function SetTalkingMercPauseState(fState: BOOLEAN): void {
  if (fState) {
    gfPauseTalkingMercPopup = TRUE;

    if (gTalkingMercSoldier)
      gFacesData[gTalkingMercSoldier->iFaceIndex].uiFlags |= FACE_POTENTIAL_KEYWAIT;
  } else {
    gfPauseTalkingMercPopup = FALSE;

    if (gTalkingMercSoldier)
      gFacesData[gTalkingMercSoldier->iFaceIndex].uiFlags &= ~FACE_POTENTIAL_KEYWAIT;
  }
}

function SetQDSMercProfile(): void {
  // Get selected soldier
  if (GetSoldier(&gTalkingMercSoldier, gusSelectedSoldier)) {
    // Change guy!
    ForceSoldierProfileID(gTalkingMercSoldier, gNpcListBox.sCurSelectedItem);

    // if it is an rpc
    if (gTalkingMercSoldier->ubProfile >= 57 && gTalkingMercSoldier->ubProfile <= 72) {
      if (gfAddNpcToTeam)
        gMercProfiles[gTalkingMercSoldier->ubProfile].ubMiscFlags |= PROFILE_MISC_FLAG_RECRUITED;
      else
        gMercProfiles[gTalkingMercSoldier->ubProfile].ubMiscFlags &= ~PROFILE_MISC_FLAG_RECRUITED;
    } else {
    }

    if (WhichPanelShouldTalkingMercUse() == QDS_NPC_PANEL) {
      // remove the talking dialogue
      if (gfNpcPanelIsUsedForTalkingMerc)
        DeleteTalkingMenu();

      gfNpcPanelIsUsedForTalkingMerc = TRUE;

      InternalInitTalkingMenu(gTalkingMercSoldier->ubProfile, 10, 10);
      gpDestSoldier = &Menptr[21];
    }
  }
}

function DisplayQDSCurrentlyQuoteNum(): void {
  let zTemp: CHAR16[] /* [512] */;
  let usPosY: UINT16;
  let usFontHeight: UINT16 = GetFontHeight(QUEST_DBS_FONT_TEXT_ENTRY) + 2;

  // Display the box frame
  ColorFillVideoSurfaceArea(FRAME_BUFFER, QDS_CURRENT_QUOTE_NUM_BOX_X, QDS_CURRENT_QUOTE_NUM_BOX_Y, QDS_CURRENT_QUOTE_NUM_BOX_X + QDS_CURRENT_QUOTE_NUM_BOX_WIDTH, QDS_CURRENT_QUOTE_NUM_BOX_Y + QDS_CURRENT_QUOTE_NUM_BOX_HEIGHT, Get16BPPColor(FROMRGB(32, 41, 53)));

  swprintf(zTemp, "'%s' is currently saying quote #%d", gMercProfiles[gTalkingMercSoldier->ubProfile].zNickname, giSelectedMercCurrentQuote - 1);

  // Display the text box caption
  usPosY = QDS_CURRENT_QUOTE_NUM_BOX_Y + 4;
  DisplayWrappedString(QDS_CURRENT_QUOTE_NUM_BOX_X + 5, usPosY, QDS_CURRENT_QUOTE_NUM_BOX_WIDTH - 10, 2, QUEST_DBS_FONT_TEXT_ENTRY, FONT_MCOLOR_WHITE, zTemp, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display the Pause speech text
  usPosY += usFontHeight + 4;
  DisplayWrappedString(QDS_CURRENT_QUOTE_NUM_BOX_X + 5, usPosY, QDS_CURRENT_QUOTE_NUM_BOX_WIDTH - 10, 2, QUEST_DBS_FONT_TEXT_ENTRY, FONT_MCOLOR_WHITE, QuestDebugText[QUEST_DBS_PAUSE_SPEECH], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the left arrow quote
  usPosY += usFontHeight;
  DisplayWrappedString(QDS_CURRENT_QUOTE_NUM_BOX_X + 5, usPosY, QDS_CURRENT_QUOTE_NUM_BOX_WIDTH - 10, 2, QUEST_DBS_FONT_TEXT_ENTRY, FONT_MCOLOR_WHITE, QuestDebugText[QUEST_DBS_LEFT_ARROW_PREVIOUS_QUOTE], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the right arrow quote
  usPosY += usFontHeight;
  DisplayWrappedString(QDS_CURRENT_QUOTE_NUM_BOX_X + 5, usPosY, QDS_CURRENT_QUOTE_NUM_BOX_WIDTH - 10, 2, QUEST_DBS_FONT_TEXT_ENTRY, FONT_MCOLOR_WHITE, QuestDebugText[QUEST_DBS_RIGHT_ARROW_NEXT_QUOTE], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the right arrow quote
  usPosY += usFontHeight;
  DisplayWrappedString(QDS_CURRENT_QUOTE_NUM_BOX_X + 5, usPosY, QDS_CURRENT_QUOTE_NUM_BOX_WIDTH - 10, 2, QUEST_DBS_FONT_TEXT_ENTRY, FONT_MCOLOR_WHITE, QuestDebugText[QUEST_DBS_ESC_TOP_STOP_TALKING], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  InvalidateRegion(QDS_CURRENT_QUOTE_NUM_BOX_X, QDS_CURRENT_QUOTE_NUM_BOX_Y, QDS_CURRENT_QUOTE_NUM_BOX_X + QDS_CURRENT_QUOTE_NUM_BOX_WIDTH, QDS_CURRENT_QUOTE_NUM_BOX_Y + QDS_CURRENT_QUOTE_NUM_BOX_HEIGHT);
}

function BtnQuestDebugAddNpcToTeamToggleCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gfAddNpcToTeam)
      gfAddNpcToTeam = FALSE;
    else
      gfAddNpcToTeam = TRUE;
  }
}

function BtnQuestDebugRPCSaySectorDescToggleCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gfRpcToSaySectorDesc)
      gfRpcToSaySectorDesc = FALSE;
    else
      gfRpcToSaySectorDesc = TRUE;
  }
}

function WhichPanelShouldTalkingMercUse(): UINT8 {
  if (gTalkingMercSoldier == NULL) {
    return QDS_NO_PANEL;
  }

  if (gTalkingMercSoldier->ubProfile < FIRST_RPC) {
    return QDS_REGULAR_PANEL;
  } else {
    return QDS_NPC_PANEL;
  }
}

function DisableFactMouseRegions(): void {
  let i: UINT;

  for (i = 0; i < QUEST_DBS_NUM_DISPLAYED_FACTS; i++) {
    MSYS_DisableRegion(&gFactListRegion[i]);
  }
}

function EnableFactMouseRegions(): void {
  let i: UINT;

  for (i = 0; i < QUEST_DBS_NUM_DISPLAYED_FACTS; i++) {
    MSYS_EnableRegion(&gFactListRegion[i]);
  }
}

function GetMaxNumberOfQuotesToPlay(): INT32 {
  let iNumberOfQuotes: INT32 = 0;
  let ubProfileID: UINT8 = gNpcListBox.sCurSelectedItem;

  // if it is the RPCs and they are to say the sector descs
  if (gfRpcToSaySectorDesc && ubProfileID >= 57 && ubProfileID <= 60) {
    iNumberOfQuotes = 34;
  }

  // else if it is a RPC who is on our team
  else if (gMercProfiles[gNpcListBox.sCurSelectedItem].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED && ubProfileID >= 57 && ubProfileID <= 72) {
    iNumberOfQuotes = 119;
  }

  // else if it is the queen
  else if (ubProfileID == QUEEN) {
    iNumberOfQuotes = 138;
  }

  // else if it is speck
  else if (ubProfileID == 159) {
    iNumberOfQuotes = 72;
  } else
    iNumberOfQuotes = 138;

  return iNumberOfQuotes + 1;
}

function GetDebugLocationString(usProfileID: UINT16, pzText: STR16): void {
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Get a soldier pointer
  pSoldier = FindSoldierByProfileID(usProfileID, FALSE);

  // if their is a soldier, the soldier is alive and the soldier is off the map
  if (pSoldier != NULL && pSoldier->bActive && pSoldier->uiStatusFlags & SOLDIER_OFF_MAP) {
    // the soldier is on schedule
    swprintf(pzText, "On Schdl.");
  }

  // if the soldier is dead
  else if (gMercProfiles[usProfileID].bMercStatus == MERC_IS_DEAD) {
    swprintf(pzText, "Dead");
  }

  // the soldier is in this sector
  else if (pSoldier != NULL) {
    GetShortSectorString(pSoldier->sSectorX, pSoldier->sSectorY, pzText);
  }

  // else the soldier is in a different map
  else {
    GetShortSectorString(gMercProfiles[usProfileID].sSectorX, gMercProfiles[usProfileID].sSectorY, pzText);
  }
}

//#endif
