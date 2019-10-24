const enum Enum32 {
  // Main Editor tabs
  TAB_TERRAIN,
  FIRST_EDITORTAB_BUTTON = TAB_TERRAIN,
  TAB_BUILDINGS,
  TAB_ITEMS,
  TAB_MERCS,
  TAB_MAPINFO,
  TAB_OPTIONS,
  LAST_EDITORTAB_BUTTON = TAB_OPTIONS,

  // Terrain menu
  TERRAIN_FGROUND_TEXTURES,
  FIRST_TERRAIN_BUTTON = TERRAIN_FGROUND_TEXTURES,
  TERRAIN_BGROUND_TEXTURES,
  TERRAIN_PLACE_CLIFFS,
  TERRAIN_PLACE_ROADS,
  TERRAIN_PLACE_DEBRIS,
  TERRAIN_FILL_AREA,
  TERRAIN_PLACE_TREES,
  TERRAIN_PLACE_ROCKS,
  TERRAIN_PLACE_MISC,
  TERRAIN_TOGGLE_ERASEMODE,
  TERRAIN_CYCLE_BRUSHSIZE,
  TERRAIN_RAISE_DENSITY,
  TERRAIN_LOWER_DENSITY,
  TERRAIN_UNDO,
  LAST_TERRAIN_BUTTON = TERRAIN_UNDO,
  // Buildings menu
  BUILDING_PLACE_WALLS,
  FIRST_BUILDINGS_BUTTON = BUILDING_PLACE_WALLS,
  BUILDING_PLACE_DOORS,
  BUILDING_PLACE_WINDOWS,
  BUILDING_PLACE_ROOFS,
  BUILDING_PLACE_BROKEN_WALLS,
  BUILDING_PLACE_FURNITURE,
  BUILDING_PLACE_DECALS,
  BUILDING_PLACE_TOILETS,
  BUILDING_PLACE_FLOORS,
  BUILDING_SMART_WALLS,
  BUILDING_SMART_DOORS,
  BUILDING_SMART_WINDOWS,
  BUILDING_SMART_BROKEN_WALLS,
  BUILDING_DOORKEY,
  BUILDING_NEW_ROOM,
  BUILDING_SAW_ROOM,
  BUILDING_NEW_ROOF,
  BUILDING_KILL_BUILDING,
  BUILDING_COPY_BUILDING,
  BUILDING_MOVE_BUILDING,
  BUILDING_CAVE_DRAWING,
  BUILDING_DRAW_ROOMNUM,
  BUILDING_ERASE_ROOMNUM,
  BUILDING_TOGGLE_ERASEMODE,
  BUILDING_UNDO,
  BUILDING_CYCLE_BRUSHSIZE,
  BUILDING_TOGGLE_ROOF_VIEW,
  BUILDING_TOGGLE_WALL_VIEW,
  BUILDING_TOGGLE_INFO_VIEW,
  LAST_BUILDINGS_BUTTON = BUILDING_TOGGLE_INFO_VIEW,
  // Items menu
  ITEMS_WEAPONS,
  FIRST_ITEMS_BUTTON = ITEMS_WEAPONS,
  ITEMS_AMMO,
  ITEMS_ARMOUR,
  ITEMS_EXPLOSIVES,
  ITEMS_EQUIPMENT1,
  ITEMS_EQUIPMENT2,
  ITEMS_EQUIPMENT3,
  ITEMS_TRIGGERS,
  ITEMS_KEYS,
  ITEMS_LEFTSCROLL,
  ITEMS_RIGHTSCROLL,
  LAST_ITEMS_BUTTON = ITEMS_RIGHTSCROLL,
  // MapInfo menu
  MAPINFO_ADD_LIGHT1_SOURCE,
  FIRST_MAPINFO_BUTTON = MAPINFO_ADD_LIGHT1_SOURCE,
  MAPINFO_LIGHT_PANEL,
  MAPINFO_PRIMETIME_LIGHT,
  MAPINFO_NIGHTTIME_LIGHT,
  MAPINFO_24HOUR_LIGHT,
  MAPINFO_TOGGLE_FAKE_LIGHTS,
  MAPINFO_TOGGLE_ERASEMODE,
  MAPINFO_DRAW_EXITGRIDS,
  MAPINFO_CYCLE_BRUSHSIZE,
  MAPINFO_UNDO,
  MAPINFO_RADIO_PANEL,
  MAPINFO_RADIO_NORMAL,
  MAPINFO_RADIO_BASEMENT,
  MAPINFO_RADIO_CAVES,
  MAPINFO_NORTH_POINT,
  MAPINFO_WEST_POINT,
  MAPINFO_EAST_POINT,
  MAPINFO_SOUTH_POINT,
  MAPINFO_CENTER_POINT,
  MAPINFO_ISOLATED_POINT,
  LAST_MAPINFO_BUTTON = MAPINFO_ISOLATED_POINT,

  // Options menu
  OPTIONS_NEW_MAP,
  FIRST_OPTIONS_BUTTON = OPTIONS_NEW_MAP,
  OPTIONS_NEW_BASEMENT,
  OPTIONS_NEW_CAVES,
  OPTIONS_LOAD_MAP,
  OPTIONS_SAVE_MAP,
  OPTIONS_CHANGE_TILESET,
  OPTIONS_LEAVE_EDITOR,
  OPTIONS_QUIT_GAME,
  LAST_OPTIONS_BUTTON = OPTIONS_QUIT_GAME,
  // Mercs menu
  MERCS_PLAYER,
  FIRST_MERCS_BUTTON = MERCS_PLAYER,
  MERCS_ENEMY,
  MERCS_CREATURE,
  MERCS_REBEL,
  MERCS_CIVILIAN,

  MERCS_PLAYERTOGGLE,
  MERCS_ENEMYTOGGLE,
  MERCS_CREATURETOGGLE,
  MERCS_REBELTOGGLE,
  MERCS_CIVILIANTOGGLE,

  MERCS_1,
  MERCS_DETAILEDCHECKBOX,
  MERCS_GENERAL,
  MERCS_ATTRIBUTES,
  MERCS_INVENTORY,
  MERCS_APPEARANCE,
  MERCS_PROFILE,
  MERCS_SCHEDULE,
  MERCS_GLOWSCHEDULE,

  MERCS_DELETE,
  MERCS_NEXT,

  MERCS_PRIORITYEXISTANCE_CHECKBOX,
  MERCS_HASKEYS_CHECKBOX,

  MERCS_ORDERS_STATIONARY,
  MERCS_ORDERS_ONGUARD,
  MERCS_ORDERS_CLOSEPATROL,
  MERCS_ORDERS_FARPATROL,
  MERCS_ORDERS_POINTPATROL,
  MERCS_ORDERS_ONCALL,
  MERCS_ORDERS_SEEKENEMY,
  MERCS_ORDERS_RNDPTPATROL,

  MERCS_ATTITUDE_DEFENSIVE,
  MERCS_ATTITUDE_BRAVESOLO,
  MERCS_ATTITUDE_BRAVEAID,
  MERCS_ATTITUDE_CUNNINGSOLO,
  MERCS_ATTITUDE_CUNNINGAID,
  MERCS_ATTITUDE_AGGRESSIVE,

  MERCS_DIRECTION_N,
  MERCS_DIRECTION_NE,
  MERCS_DIRECTION_E,
  MERCS_DIRECTION_SE,
  MERCS_DIRECTION_S,
  MERCS_DIRECTION_SW,
  MERCS_DIRECTION_W,
  MERCS_DIRECTION_NW,
  MERCS_DIRECTION_FIND,

  MERCS_EQUIPMENT_BAD,
  MERCS_EQUIPMENT_POOR,
  MERCS_EQUIPMENT_AVERAGE,
  MERCS_EQUIPMENT_GOOD,
  MERCS_EQUIPMENT_GREAT,

  MERCS_ATTRIBUTES_BAD,
  MERCS_ATTRIBUTES_POOR,
  MERCS_ATTRIBUTES_AVERAGE,
  MERCS_ATTRIBUTES_GOOD,
  MERCS_ATTRIBUTES_GREAT,

  MERCS_ARMY_CODE,
  MERCS_ADMIN_CODE,
  MERCS_ELITE_CODE,

  MERCS_CIVILIAN_GROUP,

  MERCS_TOGGLECOLOR_BUTTON,
  MERCS_HAIRCOLOR_DOWN,
  MERCS_HAIRCOLOR_UP,
  MERCS_SKINCOLOR_DOWN,
  MERCS_SKINCOLOR_UP,
  MERCS_VESTCOLOR_DOWN,
  MERCS_VESTCOLOR_UP,
  MERCS_PANTCOLOR_DOWN,
  MERCS_PANTCOLOR_UP,

  MERCS_BODYTYPE_DOWN,
  MERCS_BODYTYPE_UP,

  MERCS_SCHEDULE_ACTION1,
  MERCS_SCHEDULE_ACTION2,
  MERCS_SCHEDULE_ACTION3,
  MERCS_SCHEDULE_ACTION4,
  MERCS_SCHEDULE_VARIANCE1,
  MERCS_SCHEDULE_VARIANCE2,
  MERCS_SCHEDULE_VARIANCE3,
  MERCS_SCHEDULE_VARIANCE4,
  MERCS_SCHEDULE_DATA1A,
  MERCS_SCHEDULE_DATA2A,
  MERCS_SCHEDULE_DATA3A,
  MERCS_SCHEDULE_DATA4A,
  MERCS_SCHEDULE_DATA1B,
  MERCS_SCHEDULE_DATA2B,
  MERCS_SCHEDULE_DATA3B,
  MERCS_SCHEDULE_DATA4B,
  MERCS_SCHEDULE_CLEAR,

  MERCS_HEAD_SLOT,
  MERCS_BODY_SLOT,
  MERCS_LEGS_SLOT,
  MERCS_LEFTHAND_SLOT,
  MERCS_RIGHTHAND_SLOT,
  MERCS_PACK1_SLOT,
  MERCS_PACK2_SLOT,
  MERCS_PACK3_SLOT,
  MERCS_PACK4_SLOT,
  LAST_MERCS_BUTTON = MERCS_PACK4_SLOT,

  ITEMSTATS_PANEL,
  FIRST_ITEMSTATS_BUTTON = ITEMSTATS_PANEL,
  ITEMSTATS_HIDDEN_BTN,
  ITEMSTATS_DELETE_BTN,
  LAST_ITEMSTATS_BUTTON = ITEMSTATS_DELETE_BTN,

  NUMBER_EDITOR_BUTTONS,
}

const FIRST_MERCS_TEAMMODE_BUTTON = Enum32.MERCS_PLAYER;
const LAST_MERCS_TEAMMODE_BUTTON = Enum32.MERCS_CIVILIANTOGGLE;

const FIRST_MERCS_BASICMODE_BUTTON = Enum32.MERCS_1;
const LAST_MERCS_BASICMODE_BUTTON = Enum32.MERCS_DETAILEDCHECKBOX;

const FIRST_MERCS_PRIORITYMODE_BUTTON = Enum32.MERCS_GENERAL;
const LAST_MERCS_PRIORITYMODE_BUTTON = Enum32.MERCS_SCHEDULE;

const FIRST_MERCS_GENERAL_BUTTON = Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX;
const LAST_MERCS_GENERAL_BUTTON = LAST_MERCS_COLORCODE_BUTTON;
const FIRST_MERCS_ORDERS_BUTTON = Enum32.MERCS_ORDERS_STATIONARY;
const LAST_MERCS_ORDERS_BUTTON = Enum32.MERCS_ORDERS_RNDPTPATROL;
const FIRST_MERCS_ATTITUDE_BUTTON = Enum32.MERCS_ATTITUDE_DEFENSIVE;
const LAST_MERCS_ATTITUDE_BUTTON = Enum32.MERCS_ATTITUDE_AGGRESSIVE;
const FIRST_MERCS_DIRECTION_BUTTON = Enum32.MERCS_DIRECTION_N;
const LAST_MERCS_DIRECTION_BUTTON = Enum32.MERCS_DIRECTION_FIND;
const FIRST_MERCS_REL_EQUIPMENT_BUTTON = Enum32.MERCS_EQUIPMENT_BAD;
const LAST_MERCS_REL_EQUIPMENT_BUTTON = Enum32.MERCS_EQUIPMENT_GREAT;
const FIRST_MERCS_REL_ATTRIBUTE_BUTTON = Enum32.MERCS_ATTRIBUTES_BAD;
const LAST_MERCS_REL_ATTRIBUTE_BUTTON = Enum32.MERCS_ATTRIBUTES_GREAT;
const FIRST_MERCS_COLORCODE_BUTTON = Enum32.MERCS_ARMY_CODE;
const LAST_MERCS_COLORCODE_BUTTON = Enum32.MERCS_ELITE_CODE;

const FIRST_MERCS_COLORMODE_BUTTON = Enum32.MERCS_TOGGLECOLOR_BUTTON;
const LAST_MERCS_COLORMODE_BUTTON = Enum32.MERCS_BODYTYPE_UP;
const FIRST_MERCS_COLOR_BUTTON = Enum32.MERCS_HAIRCOLOR_DOWN;
const LAST_MERCS_COLOR_BUTTON = Enum32.MERCS_PANTCOLOR_UP;
const FIRST_MERCS_BODYTYPE_BUTTON = Enum32.MERCS_BODYTYPE_DOWN;
const LAST_MERCS_BODYTYPE_BUTTON = Enum32.MERCS_BODYTYPE_UP;

const FIRST_MERCS_INVENTORY_BUTTON = Enum32.MERCS_HEAD_SLOT;
const LAST_MERCS_INVENTORY_BUTTON = Enum32.MERCS_PACK4_SLOT;

const FIRST_MERCS_GETITEM_BUTTON = Enum32.FIRST_ITEMS_BUTTON;
const LAST_MERCS_GETITEM_BUTTON = Enum32.LAST_ITEMS_BUTTON;

const FIRST_MERCS_SCHEDULE_BUTTON = Enum32.MERCS_SCHEDULE_ACTION1;
const LAST_MERCS_SCHEDULE_BUTTON = Enum32.MERCS_SCHEDULE_CLEAR;
