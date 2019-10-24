interface FASTHELPREGION {
  // the string
  FastHelpText: CHAR16[] /* [256] */;

  // the x and y position values
  iX: INT32;
  iY: INT32;
  iW: INT32;
}

// String Lengths Defines
const MAX_NAME_LENGTH = 10;
const MAX_LOCATION_SIZE = 8;
const MAX_DESTETA_SIZE = 8;
const MAX_ASSIGN_SIZE = 10;
const MAX_TIME_REMAINING_SIZE = 8;

// char breath and life position
const BAR_INFO_X = 66;
const BAR_INFO_Y = 61;

// merc icon position
const CHAR_ICON_CONTRACT_Y = 64;
const CHAR_ICON_X = 187;
const CHAR_ICON_WIDTH = 10;
const CHAR_ICON_HEIGHT = 10;
const CHAR_ICON_SPACING = 13;

// max number of characters and vehicles
// Character List Length
const MAX_CHARACTER_COUNT = 20;
const MAX_VEHICLE_COUNT = 20;

// map screen font
const MAP_SCREEN_FONT = () => BLOCKFONT2();

// characterlist regions
const Y_START = 146;
const MAP_START_KEYRING_Y = 107;
const Y_SIZE = () => GetFontHeight(MAP_SCREEN_FONT());

// attribute menu defines (must match NUM_TRAINABLE_STATS defines, and pAttributeMenuStrings )
const enum Enum146 {
  ATTRIB_MENU_STR = 0,
  ATTRIB_MENU_DEX,
  ATTRIB_MENU_AGI,
  ATTRIB_MENU_HEA,
  ATTRIB_MENU_MARK,
  ATTRIB_MENU_MED,
  ATTRIB_MENU_MECH,
  ATTRIB_MENU_LEAD,
  ATTRIB_MENU_EXPLOS,
  ATTRIB_MENU_CANCEL,
  MAX_ATTRIBUTE_STRING_COUNT,
}

// the epc assignment menu
const enum Enum147 {
  EPC_MENU_ON_DUTY = 0,
  EPC_MENU_PATIENT,
  EPC_MENU_VEHICLE,
  EPC_MENU_REMOVE,
  EPC_MENU_CANCEL,
  MAX_EPC_MENU_STRING_COUNT,
}

// assignment menu defines
const enum Enum148 {
  ASSIGN_MENU_ON_DUTY = 0,
  ASSIGN_MENU_DOCTOR,
  ASSIGN_MENU_PATIENT,
  ASSIGN_MENU_VEHICLE,
  ASSIGN_MENU_REPAIR,
  ASSIGN_MENU_TRAIN,
  ASSIGN_MENU_CANCEL,
  MAX_ASSIGN_STRING_COUNT,
}

// training assignment menu defines
const enum Enum149 {
  TRAIN_MENU_SELF,
  TRAIN_MENU_TOWN,
  TRAIN_MENU_TEAMMATES,
  TRAIN_MENU_TRAIN_BY_OTHER,
  TRAIN_MENU_CANCEL,
  MAX_TRAIN_STRING_COUNT,
}

// the remove merc from team pop up box strings
const enum Enum150 {
  REMOVE_MERC = 0,
  REMOVE_MERC_CANCEL,
  MAX_REMOVE_MERC_COUNT,
}

// squad menu defines
const enum Enum151 {
  SQUAD_MENU_1,
  SQUAD_MENU_2,
  SQUAD_MENU_3,
  SQUAD_MENU_4,
  SQUAD_MENU_5,
  SQUAD_MENU_6,
  SQUAD_MENU_7,
  SQUAD_MENU_8,
  SQUAD_MENU_9,
  SQUAD_MENU_10,
  SQUAD_MENU_11,
  SQUAD_MENU_12,
  SQUAD_MENU_13,
  SQUAD_MENU_14,
  SQUAD_MENU_15,
  SQUAD_MENU_16,
  SQUAD_MENU_17,
  SQUAD_MENU_18,
  SQUAD_MENU_19,
  SQUAD_MENU_20,
  SQUAD_MENU_CANCEL,
  MAX_SQUAD_MENU_STRING_COUNT,
}

// contract menu defines
const enum Enum152 {
  CONTRACT_MENU_CURRENT_FUNDS = 0,
  CONTRACT_MENU_SPACE,
  CONTRACT_MENU_DAY,
  CONTRACT_MENU_WEEK,
  CONTRACT_MENU_TWO_WEEKS,
  CONTRACT_MENU_TERMINATE,
  CONTRACT_MENU_CANCEL,
  MAX_CONTRACT_MENU_STRING_COUNT,
}

// enums for pre battle interface pop ups
const enum Enum153 {
  ASSIGNMENT_POPUP,
  DESTINATION_POPUP,
  CONTRACT_POPUP,
}

const enum Enum154 {
  NO_REASON_FOR_UPDATE = 0,
  CONTRACT_FINISHED_FOR_UPDATE,
  ASSIGNMENT_FINISHED_FOR_UPDATE,
  ASSIGNMENT_RETURNING_FOR_UPDATE,
  ASLEEP_GOING_AUTO_FOR_UPDATE,
  CONTRACT_EXPIRE_WARNING_REASON,
}

const enum Enum155 {
  START_RED_SECTOR_LOCATOR = 0,
  STOP_RED_SECTOR_LOCATOR,
  START_YELLOW_SECTOR_LOCATOR,
  STOP_YELLOW_SECTOR_LOCATOR,
}

// dimensions and offset for merc update box
const UPDATE_MERC_FACE_X_WIDTH = 50;
const UPDATE_MERC_FACE_X_HEIGHT = 50;
const UPDATE_MERC_FACE_X_OFFSET = 2;
const UPDATE_MERC_FACE_Y_OFFSET = 2;
const WIDTH_OF_UPDATE_PANEL_BLOCKS = 50;
const HEIGHT_OF_UPDATE_PANEL_BLOCKS = 50;
const UPDATE_MERC_Y_OFFSET = 4;
const UPDATE_MERC_X_OFFSET = 4;

// dimensions and offset for merc update box
const TACT_UPDATE_MERC_FACE_X_WIDTH = 70;
const TACT_UPDATE_MERC_FACE_X_HEIGHT = 49;
const TACT_UPDATE_MERC_FACE_X_OFFSET = 8;
const TACT_UPDATE_MERC_FACE_Y_OFFSET = 6;
const TACT_WIDTH_OF_UPDATE_PANEL_BLOCKS = 70;
const TACT_HEIGHT_OF_UPDATE_PANEL_BLOCKS = 49;
const TACT_UPDATE_MERC_Y_OFFSET = 4;
const TACT_UPDATE_MERC_X_OFFSET = 4;

// the first vehicle slot int he list
const FIRST_VEHICLE = 18;

interface MERC_LEAVE_ITEM {
  o: OBJECTTYPE;
  pNext: Pointer<MERC_LEAVE_ITEM>;
}

// The character data structure
interface MapScreenCharacterSt {
  usSolID: UINT16; // soldier ID in MenPtrs
  fValid: boolean; // is the current soldier a valid soldier
}

/*
// plot path for selected character list
void PlotPathForSelectedCharacterList( INT16 sX, INT16 sY );
*/

// remove item from leave index
// BOOLEAN RemoveItemFromLeaveIndex( MERC_LEAVE_ITEM *pItem, UINT32 uiIndex );

const enum Enum156 {
  LOCATOR_COLOR_NONE,
  LOCATOR_COLOR_RED,
  LOCATOR_COLOR_YELLOW,
}

// the tactical version

// void HandlePlayerEnteringMapScreenBeforeGoingToTactical( void );
