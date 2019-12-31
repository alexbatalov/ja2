namespace ja2 {

const DISPLAY_AP_INDEX = Enum312.MOCKFLOOR1;

const SNAPCURSOR_AP_X_STARTVAL = 18;
const SNAPCURSOR_AP_Y_STARTVAL = 9;

const LOOSE_CURSOR_DELAY = 300;
/* static */ let gfLooseCursorOn: boolean = false;
/* static */ let gsLooseCursorGridNo: INT16 = NOWHERE;
/* static */ let guiLooseCursorID: UINT32 = 0;
/* static */ let guiLooseCursorTimeOfLastUpdate: UINT32 = 0;

export let gUICursors: UICursor[] /* [NUM_UI_CURSORS] */ = [
  createUICursorFrom(Enum210.NO_UICURSOR, 0, 0, 0),
  createUICursorFrom(Enum210.NORMAL_FREEUICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_NORMAL, 0),
  createUICursorFrom(Enum210.NORMAL_SNAPUICURSOR, UICURSOR_SNAPPING, 0, 0),
  createUICursorFrom(Enum210.MOVE_RUN_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILEAPDEPENDENT | UICURSOR_DONTSHOW2NDLEVEL, Enum317.CURSOR_RUN1, Enum312.FIRSTPOINTERS2),
  createUICursorFrom(Enum210.MOVE_WALK_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILEAPDEPENDENT | UICURSOR_DONTSHOW2NDLEVEL | UICURSOR_CENTERAPS, Enum317.CURSOR_WALK1, Enum312.FIRSTPOINTERS2),
  createUICursorFrom(Enum210.MOVE_SWAT_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILEAPDEPENDENT | UICURSOR_DONTSHOW2NDLEVEL, Enum317.CURSOR_SWAT1, Enum312.FIRSTPOINTERS2),
  createUICursorFrom(Enum210.MOVE_PRONE_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILEAPDEPENDENT | UICURSOR_DONTSHOW2NDLEVEL, Enum317.CURSOR_PRONE1, Enum312.FIRSTPOINTERS2),
  createUICursorFrom(Enum210.MOVE_VEHICLE_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILEAPDEPENDENT | UICURSOR_DONTSHOW2NDLEVEL, Enum317.CURSOR_DRIVEV, Enum312.FIRSTPOINTERS2),

  createUICursorFrom(Enum210.CONFIRM_MOVE_RUN_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS4),
  createUICursorFrom(Enum210.CONFIRM_MOVE_WALK_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS4),
  createUICursorFrom(Enum210.CONFIRM_MOVE_SWAT_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS4),
  createUICursorFrom(Enum210.CONFIRM_MOVE_PRONE_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS4),
  createUICursorFrom(Enum210.CONFIRM_MOVE_VEHICLE_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS4),

  createUICursorFrom(Enum210.ALL_MOVE_RUN_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS5),
  createUICursorFrom(Enum210.ALL_MOVE_WALK_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS5),
  createUICursorFrom(Enum210.ALL_MOVE_SWAT_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS5),
  createUICursorFrom(Enum210.ALL_MOVE_PRONE_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS5),
  createUICursorFrom(Enum210.ALL_MOVE_VEHICLE_UICURSOR, UICURSOR_SNAPPING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, 0, Enum312.FIRSTPOINTERS5),

  createUICursorFrom(Enum210.MOVE_REALTIME_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILEAPDEPENDENT | UICURSOR_DONTSHOW2NDLEVEL, VIDEO_NO_CURSOR, Enum312.FIRSTPOINTERS2),
  createUICursorFrom(Enum210.MOVE_RUN_REALTIME_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, VIDEO_NO_CURSOR, Enum312.FIRSTPOINTERS7),

  createUICursorFrom(Enum210.CONFIRM_MOVE_REALTIME_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, VIDEO_NO_CURSOR, Enum312.FIRSTPOINTERS4),
  createUICursorFrom(Enum210.ALL_MOVE_REALTIME_UICURSOR, UICURSOR_FREEFLOWING | UICURSOR_SHOWTILE | UICURSOR_DONTSHOW2NDLEVEL, VIDEO_NO_CURSOR, Enum312.FIRSTPOINTERS5),

  createUICursorFrom(Enum210.ON_OWNED_MERC_UICURSOR, UICURSOR_SNAPPING, 0, 0),
  createUICursorFrom(Enum210.ON_OWNED_SELMERC_UICURSOR, UICURSOR_SNAPPING, 0, 0),
  createUICursorFrom(Enum210.ACTION_SHOOT_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGET, 0),
  createUICursorFrom(Enum210.ACTION_NOCHANCE_SHOOT_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETDKBLACK, 0),
  createUICursorFrom(Enum210.ACTION_NOCHANCE_BURST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETBURSTDKBLACK, 0),

  createUICursorFrom(Enum210.ACTION_FLASH_TOSS_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGET, 0),
  createUICursorFrom(Enum210.ACTION_TOSS_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGET, 0),
  createUICursorFrom(Enum210.ACTION_RED_TOSS_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETRED, 0),

  createUICursorFrom(Enum210.ACTION_FLASH_SHOOT_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_FLASH_TARGET, 0),
  createUICursorFrom(Enum210.ACTION_FLASH_BURST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_FLASH_TARGETBURST, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON1, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON2, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM3_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON3, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM4_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON4, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM5_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON5, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM6_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON6, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM7_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON7, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM8_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON8, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIM8_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETON9, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMCANT1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETW1, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMCANT2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETW2, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMCANT3_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETW3, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMCANT4_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETW4, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMCANT5_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETW5, 0),
  createUICursorFrom(Enum210.ACTION_TARGETRED_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETRED, 0),
  createUICursorFrom(Enum210.ACTION_TARGETBURST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETBURST, 0),
  createUICursorFrom(Enum210.ACTION_TARGETREDBURST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETBURSTRED, 0),
  createUICursorFrom(Enum210.ACTION_TARGETCONFIRMBURST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETBURSTCONFIRM, 0),

  createUICursorFrom(Enum210.ACTION_TARGETAIMFULL_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETWR1, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMYELLOW1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETYELLOW1, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMYELLOW2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETYELLOW2, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMYELLOW3_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETYELLOW3, 0),
  createUICursorFrom(Enum210.ACTION_TARGETAIMYELLOW4_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETYELLOW4, 0),

  createUICursorFrom(Enum210.ACTION_TARGET_RELOADING, UICURSOR_FREEFLOWING, Enum317.CURSOR_TARGETBLACK, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_GRAY, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHGRAY, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_RED, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHRED, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_RED_AIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHRED_ON1, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_RED_AIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHRED_ON2, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_YELLOW_AIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHYELLOW_ON1, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_YELLOW_AIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHYELLOW_ON2, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_NOGO_AIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHNOGO_ON1, 0),
  createUICursorFrom(Enum210.ACTION_PUNCH_NOGO_AIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_PUNCHNOGO_ON2, 0),
  createUICursorFrom(Enum210.ACTION_FIRSTAID_GRAY, UICURSOR_FREEFLOWING, Enum317.CURSOR_CROSS_REG, 0),
  createUICursorFrom(Enum210.ACTION_FIRSTAID_RED, UICURSOR_FREEFLOWING, Enum317.CURSOR_CROSS_ACTIVE, 0),
  createUICursorFrom(Enum210.ACTION_OPEN, UICURSOR_FREEFLOWING, Enum317.CURSOR_HANDGRAB, 0),
  createUICursorFrom(Enum210.CANNOT_MOVE_UICURSOR, UICURSOR_SNAPPING, 0, 0),
  createUICursorFrom(Enum210.NORMALHANDCURSOR_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_NORMGRAB, 0),
  createUICursorFrom(Enum210.OKHANDCURSOR_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_HANDGRAB, 0),
  createUICursorFrom(Enum210.KNIFE_REG_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_REG, 0),
  createUICursorFrom(Enum210.KNIFE_HIT_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_HIT, 0),
  createUICursorFrom(Enum210.KNIFE_HIT_AIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_HIT_ON1, 0),
  createUICursorFrom(Enum210.KNIFE_HIT_AIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_HIT_ON2, 0),
  createUICursorFrom(Enum210.KNIFE_YELLOW_AIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_YELLOW_ON1, 0),
  createUICursorFrom(Enum210.KNIFE_YELLOW_AIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_YELLOW_ON2, 0),
  createUICursorFrom(Enum210.KNIFE_NOGO_AIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_NOGO_ON1, 0),
  createUICursorFrom(Enum210.KNIFE_NOGO_AIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_KNIFE_NOGO_ON2, 0),

  createUICursorFrom(Enum210.LOOK_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_LOOK, 0),
  createUICursorFrom(Enum210.TALK_NA_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_TALK, 0),
  createUICursorFrom(Enum210.TALK_A_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_REDTALK, 0),
  createUICursorFrom(Enum210.TALK_OUT_RANGE_NA_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_FLASH_TALK, Enum317.CURSOR_BLACKTALK),
  createUICursorFrom(Enum210.TALK_OUT_RANGE_A_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_FLASH_REDTALK, Enum317.CURSOR_BLACKTALK),
  createUICursorFrom(Enum210.EXIT_NORTH_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_EXIT_NORTH, 0),
  createUICursorFrom(Enum210.EXIT_SOUTH_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_EXIT_SOUTH, 0),
  createUICursorFrom(Enum210.EXIT_EAST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_EXIT_EAST, 0),
  createUICursorFrom(Enum210.EXIT_WEST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_EXIT_WEST, 0),
  createUICursorFrom(Enum210.EXIT_GRID_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_EXIT_GRID, 0),
  createUICursorFrom(Enum210.NOEXIT_NORTH_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_NOEXIT_NORTH, 0),
  createUICursorFrom(Enum210.NOEXIT_SOUTH_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_NOEXIT_SOUTH, 0),
  createUICursorFrom(Enum210.NOEXIT_EAST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_NOEXIT_EAST, 0),
  createUICursorFrom(Enum210.NOEXIT_WEST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_NOEXIT_WEST, 0),
  createUICursorFrom(Enum210.NOEXIT_GRID_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_NOEXIT_GRID, 0),
  createUICursorFrom(Enum210.CONFIRM_EXIT_NORTH_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_CONEXIT_NORTH, 0),
  createUICursorFrom(Enum210.CONFIRM_EXIT_SOUTH_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_CONEXIT_SOUTH, 0),
  createUICursorFrom(Enum210.CONFIRM_EXIT_EAST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_CONEXIT_EAST, 0),
  createUICursorFrom(Enum210.CONFIRM_EXIT_WEST_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_CONEXIT_WEST, 0),
  createUICursorFrom(Enum210.CONFIRM_EXIT_GRID_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_CONEXIT_GRID, 0),

  createUICursorFrom(Enum210.GOOD_WIRECUTTER_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_GOOD_WIRECUT, 0),
  createUICursorFrom(Enum210.BAD_WIRECUTTER_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_BAD_WIRECUT, 0),
  createUICursorFrom(Enum210.GOOD_REPAIR_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_REPAIR, 0),
  createUICursorFrom(Enum210.BAD_REPAIR_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_REPAIRRED, 0),
  createUICursorFrom(Enum210.GOOD_RELOAD_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_GOOD_RELOAD, 0),
  createUICursorFrom(Enum210.BAD_RELOAD_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_BAD_RELOAD, 0),
  createUICursorFrom(Enum210.GOOD_JAR_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_JARRED, 0),
  createUICursorFrom(Enum210.BAD_JAR_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_JAR, 0),

  createUICursorFrom(Enum210.GOOD_THROW_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_GOOD_THROW, 0),
  createUICursorFrom(Enum210.BAD_THROW_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_BAD_THROW, 0),
  createUICursorFrom(Enum210.RED_THROW_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_RED_THROW, 0),
  createUICursorFrom(Enum210.FLASH_THROW_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_FLASH_THROW, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON1, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON2, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM3_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON3, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM4_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON4, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM5_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON5, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM6_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON6, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM7_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON7, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM8_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON8, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIM8_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKON9, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMCANT1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKW1, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMCANT2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKW2, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMCANT3_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKW3, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMCANT4_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKW4, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMCANT5_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKW5, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMFULL_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKWR1, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMYELLOW1_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKYELLOW1, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMYELLOW2_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKYELLOW2, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMYELLOW3_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKYELLOW3, 0),
  createUICursorFrom(Enum210.ACTION_THROWAIMYELLOW4_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_THROWKYELLOW4, 0),

  createUICursorFrom(Enum210.THROW_ITEM_GOOD_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_ITEM_GOOD_THROW, 0),
  createUICursorFrom(Enum210.THROW_ITEM_BAD_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_ITEM_BAD_THROW, 0),
  createUICursorFrom(Enum210.THROW_ITEM_RED_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_ITEM_RED_THROW, 0),
  createUICursorFrom(Enum210.THROW_ITEM_FLASH_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_ITEM_FLASH_THROW, 0),

  createUICursorFrom(Enum210.PLACE_BOMB_GREY_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_BOMB_GRAY, 0),
  createUICursorFrom(Enum210.PLACE_BOMB_RED_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_BOMB_RED, 0),
  createUICursorFrom(Enum210.PLACE_REMOTE_GREY_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_REMOTE_GRAY, 0),
  createUICursorFrom(Enum210.PLACE_REMOTE_RED_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_REMOTE_RED, 0),
  createUICursorFrom(Enum210.PLACE_TINCAN_GREY_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_CAN, 0),
  createUICursorFrom(Enum210.PLACE_TINCAN_RED_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_CANRED, 0),

  createUICursorFrom(Enum210.ENTER_VEHICLE_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_ENTERV, 0),

  createUICursorFrom(Enum210.INVALID_ACTION_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_INVALID_ACTION, 0),

  createUICursorFrom(Enum210.FLOATING_X_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_X, 0),

  createUICursorFrom(Enum210.EXCHANGE_PLACES_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_EXCHANGE_PLACES, 0),
  createUICursorFrom(Enum210.JUMP_OVER_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_JUMP_OVER, 0),

  createUICursorFrom(Enum210.REFUEL_GREY_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_FUEL, 0),
  createUICursorFrom(Enum210.REFUEL_RED_UICURSOR, UICURSOR_FREEFLOWING, Enum317.CURSOR_FUEL_RED, 0),
];

let guiCurUICursor: UINT32 = Enum210.NO_UICURSOR;
let guiOldUICursor: UINT32 = Enum210.NO_UICURSOR;
export let gusCurMousePos: UINT16 = 0;
let gusTargetDropPos: UINT16;
let gfTargetDropPos: boolean = false;

export function SetUICursor(uiNewCursor: UINT32): boolean {
  guiOldUICursor = guiCurUICursor;
  guiCurUICursor = uiNewCursor;

  return true;
}

/* static */ let DrawUICursor__fHideCursor: boolean = false;
export function DrawUICursor(): boolean {
  let usMapPos: UINT16 = 0;
  let pNode: LEVELNODE;
  let usTileCursor: UINT16;

  // RaiseMouseToLevel( (INT8)gsInterfaceLevel );

  HandleLooseCursorDraw();

  // OK, WE OVERRIDE HERE CURSOR DRAWING FOR THINGS LIKE
  if (gpItemPointer != null) {
    MSYS_ChangeRegionCursor(gViewportRegion, VIDEO_NO_CURSOR);

    // Check if we are in the viewport region...
    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      DrawItemTileCursor();
    } else {
      DrawItemFreeCursor();
    }
    return true;
  }

  if (GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    gusCurMousePos = usMapPos;

    if (guiCurUICursor == Enum210.NO_UICURSOR) {
      MSYS_ChangeRegionCursor(gViewportRegion, VIDEO_NO_CURSOR);
      return true;
    }

    if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_SHOWTILE) {
      if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
        pNode = AddTopmostToTail(gusCurMousePos, GetSnapCursorIndex(Enum312.FIRSTPOINTERS3));
      } else {
        pNode = AddTopmostToTail(gusCurMousePos, GetSnapCursorIndex(gUICursors[guiCurUICursor].usAdditionalData));
      }
      pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

      if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
        // Put one on the roof as well
        AddOnRoofToHead(gusCurMousePos, GetSnapCursorIndex(gUICursors[guiCurUICursor].usAdditionalData));
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pOnRoofHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pOnRoofHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      }
    }

    gfTargetDropPos = false;

    if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_FREEFLOWING && !(gUICursors[guiCurUICursor].uiFlags & UICURSOR_DONTSHOW2NDLEVEL)) {
      gfTargetDropPos = true;
      gusTargetDropPos = gusCurMousePos;

      if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
        // If we are over a target, jump to that....
        if (gfUIFullTargetFound) {
          gusTargetDropPos = MercPtrs[gusUIFullTargetID].sGridNo;
        }

        // Put tile on the floor
        AddTopmostToTail(gusTargetDropPos, Enum312.FIRSTPOINTERS14);
        (<LEVELNODE>gpWorldLevelData[gusTargetDropPos].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
        (<LEVELNODE>gpWorldLevelData[gusTargetDropPos].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      }
    }

    if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_SHOWTILEAPDEPENDENT) {
      // Add depending on AP status
      usTileCursor = gUICursors[guiCurUICursor].usAdditionalData;

      // ATE; Is the current guy in steath mode?
      if (gusSelectedSoldier != NOBODY) {
        if (MercPtrs[gusSelectedSoldier].bStealthMode) {
          usTileCursor = Enum312.FIRSTPOINTERS9;
        }
      }

      if (gfUIDisplayActionPointsInvalid || gsCurrentActionPoints == 0) {
        usTileCursor = Enum312.FIRSTPOINTERS6;

        // ATE; Is the current guy in steath mode?
        if (gusSelectedSoldier != NOBODY) {
          if (MercPtrs[gusSelectedSoldier].bStealthMode) {
            usTileCursor = Enum312.FIRSTPOINTERS10;
          }
        }
      }

      if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
        pNode = AddTopmostToTail(gusCurMousePos, GetSnapCursorIndex(Enum312.FIRSTPOINTERS14));
      } else {
        pNode = AddTopmostToTail(gusCurMousePos, GetSnapCursorIndex(usTileCursor));
      }

      pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

      if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
        // Put one on the roof as well
        AddOnRoofToHead(gusCurMousePos, GetSnapCursorIndex(usTileCursor));
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pOnRoofHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pOnRoofHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      }
    }

    // If snapping - remove from main viewport
    if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_SNAPPING) {
      // Hide mouse region cursor
      MSYS_ChangeRegionCursor(gViewportRegion, VIDEO_NO_CURSOR);

      // Set Snapping Cursor
      DrawSnappingCursor();
    }

    if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_FREEFLOWING) {
      switch (guiCurUICursor) {
        case Enum210.MOVE_VEHICLE_UICURSOR:

          // Set position for APS
          gfUIDisplayActionPointsCenter = false;
          gUIDisplayActionPointsOffX = 16;
          gUIDisplayActionPointsOffY = 14;
          break;

        case Enum210.MOVE_WALK_UICURSOR:
        case Enum210.MOVE_RUN_UICURSOR:

          // Set position for APS
          gfUIDisplayActionPointsCenter = false;
          gUIDisplayActionPointsOffX = 16;
          gUIDisplayActionPointsOffY = 14;
          break;

        case Enum210.MOVE_SWAT_UICURSOR:

          // Set position for APS
          gfUIDisplayActionPointsCenter = false;
          gUIDisplayActionPointsOffX = 16;
          gUIDisplayActionPointsOffY = 10;
          break;

        case Enum210.MOVE_PRONE_UICURSOR:

          // Set position for APS
          gfUIDisplayActionPointsCenter = false;
          gUIDisplayActionPointsOffX = 16;
          gUIDisplayActionPointsOffY = 9;
          break;
      }

      DrawUICursor__fHideCursor = false;

      if (!DrawUICursor__fHideCursor) {
        MSYS_ChangeRegionCursor(gViewportRegion, gUICursors[guiCurUICursor].usFreeCursorName);
      } else {
        // Hide
        MSYS_ChangeRegionCursor(gViewportRegion, VIDEO_NO_CURSOR);
      }
    }

    if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_CENTERAPS) {
      gfUIDisplayActionPointsCenter = true;
    }
  }
  return true;
}

export function HideUICursor(): boolean {
  HandleLooseCursorHide();

  // OK, WE OVERRIDE HERE CURSOR DRAWING FOR THINGS LIKE
  if (gpItemPointer != null) {
    // Check if we are in the viewport region...
    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      HideItemTileCursor();
      return true;
    }
  }

  if (guiCurUICursor == Enum210.NO_UICURSOR) {
    // Do nothing here
    return true;
  }

  if (gUICursors[guiCurUICursor].uiFlags & (UICURSOR_SHOWTILE | UICURSOR_SHOWTILEAPDEPENDENT)) {
    RemoveAllTopmostsOfTypeRange(gusCurMousePos, Enum313.FIRSTPOINTERS, Enum313.FIRSTPOINTERS);
    RemoveAllOnRoofsOfTypeRange(gusCurMousePos, Enum313.FIRSTPOINTERS, Enum313.FIRSTPOINTERS);
  }

  if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_FREEFLOWING && !(gUICursors[guiCurUICursor].uiFlags & UICURSOR_DONTSHOW2NDLEVEL)) {
    if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
      RemoveTopmost(gusCurMousePos, Enum312.FIRSTPOINTERS14);
      RemoveTopmost(gusCurMousePos, Enum312.FIRSTPOINTERS9);

      if (gfTargetDropPos) {
        RemoveTopmost(gusTargetDropPos, Enum312.FIRSTPOINTERS14);
        RemoveTopmost(gusTargetDropPos, Enum312.FIRSTPOINTERS9);
      }
    }
  }

  // If snapping - remove from main viewport
  if ((gUICursors[guiCurUICursor].uiFlags & UICURSOR_SNAPPING)) {
    // hide Snapping Cursor
    EraseSnappingCursor();
  }

  if (gUICursors[guiCurUICursor].uiFlags & UICURSOR_FREEFLOWING) {
    // Nothing special here...
  }

  return true;
}

/* static */ let DrawSnappingCursor__fShowAP: boolean = true;
function DrawSnappingCursor(): void {
  let pNewUIElem: LEVELNODE;
  let pSoldier: SOLDIERTYPE | null;

  if (gusSelectedSoldier != NO_SOLDIER) {
    pSoldier = GetSoldier(gusSelectedSoldier);
  }

  // If we are in draw item mode, do nothing here but call the fuctiuon
  switch (guiCurUICursor) {
    case Enum210.NO_UICURSOR:
      break;

    case Enum210.NORMAL_SNAPUICURSOR:

      AddTopmostToHead(gusCurMousePos, Enum312.FIRSTPOINTERS1);
      (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
      (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      break;

    case Enum210.ALL_MOVE_RUN_UICURSOR:
    case Enum210.CONFIRM_MOVE_RUN_UICURSOR:
      if (gsInterfaceLevel > 0) {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODRUN1, 0, -WALL_HEIGHT - 8);
      } else {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODRUN1, 0, 0);
      }
      pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      break;

    case Enum210.ALL_MOVE_WALK_UICURSOR:
    case Enum210.CONFIRM_MOVE_WALK_UICURSOR:
      if (gsInterfaceLevel > 0) {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODWALK1, 0, -WALL_HEIGHT - 8);
      } else {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODWALK1, 0, 0);
      }
      pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      break;

    case Enum210.ALL_MOVE_SWAT_UICURSOR:
    case Enum210.CONFIRM_MOVE_SWAT_UICURSOR:
      if (gsInterfaceLevel > 0) {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODSWAT1, 0, -WALL_HEIGHT - 8);
      } else {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODSWAT1, 0, 0);
      }
      pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      break;

    case Enum210.ALL_MOVE_PRONE_UICURSOR:
    case Enum210.CONFIRM_MOVE_PRONE_UICURSOR:
      if (gsInterfaceLevel > 0) {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODPRONE1, 0, -WALL_HEIGHT - 8 - 6);
      } else {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.GOODPRONE1, 0, -6);
      }
      pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      break;

    case Enum210.ALL_MOVE_VEHICLE_UICURSOR:
    case Enum210.CONFIRM_MOVE_VEHICLE_UICURSOR:
      if (gsInterfaceLevel > 0) {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.VEHICLEMOVE1, 0, -WALL_HEIGHT - 8);
      } else {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.VEHICLEMOVE1, 0, 0);
      }
      pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      break;

    case Enum210.MOVE_REALTIME_UICURSOR:
      break;

    case Enum210.CANNOT_MOVE_UICURSOR:

      if (gsInterfaceLevel > 0) {
        pNewUIElem = AddUIElem(gusCurMousePos, Enum312.BADMARKER1, 0, -WALL_HEIGHT - 8);
        pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
        pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

        if (gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR]) {
          AddTopmostToHead(gusCurMousePos, Enum312.FIRSTPOINTERS13);
          (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
          (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
        }

        AddOnRoofToHead(gusCurMousePos, Enum312.FIRSTPOINTERS14);
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pOnRoofHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pOnRoofHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
      } else {
        AddTopmostToHead(gusCurMousePos, Enum312.BADMARKER1);
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
        (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

        if (gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR]) {
          AddTopmostToHead(gusCurMousePos, Enum312.FIRSTPOINTERS13);
          (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
          (<LEVELNODE>gpWorldLevelData[gusCurMousePos].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
        }
      }
      break;
  }

  // Add action points
  if (gfUIDisplayActionPoints) {
    if (gfUIDisplayActionPointsInvalid) {
      if (COUNTERDONE(Enum386.CURSORFLASH)) {
        RESETCOUNTER(Enum386.CURSORFLASH);

        DrawSnappingCursor__fShowAP = !DrawSnappingCursor__fShowAP;
      }
    } else {
      DrawSnappingCursor__fShowAP = true;
    }

    if (gsInterfaceLevel > 0) {
      pNewUIElem = AddUIElem(gusCurMousePos, DISPLAY_AP_INDEX, SNAPCURSOR_AP_X_STARTVAL, SNAPCURSOR_AP_Y_STARTVAL - WALL_HEIGHT - 10);
    } else {
      pNewUIElem = AddUIElem(gusCurMousePos, DISPLAY_AP_INDEX, SNAPCURSOR_AP_X_STARTVAL, SNAPCURSOR_AP_Y_STARTVAL);
    }
    pNewUIElem.uiFlags |= LEVELNODE_DISPLAY_AP;
    pNewUIElem.uiAPCost = gsCurrentActionPoints;
    pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
    pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;

    if (!DrawSnappingCursor__fShowAP) {
      gfUIDisplayActionPointsBlack = true;
    }
  }
}

function EraseSnappingCursor(): void {
  RemoveAllTopmostsOfTypeRange(gusCurMousePos, Enum313.MOCKFLOOR, Enum313.MOCKFLOOR);
  RemoveAllTopmostsOfTypeRange(gusCurMousePos, Enum313.FIRSTPOINTERS, LASTPOINTERS);
  RemoveAllObjectsOfTypeRange(gusCurMousePos, Enum313.FIRSTPOINTERS, LASTPOINTERS);
  RemoveAllOnRoofsOfTypeRange(gusCurMousePos, Enum313.FIRSTPOINTERS, LASTPOINTERS);
  RemoveAllOnRoofsOfTypeRange(gusCurMousePos, Enum313.MOCKFLOOR, Enum313.MOCKFLOOR);
}

function StartLooseCursor(sGridNo: INT16, uiCursorID: UINT32): void {
  gfLooseCursorOn = true;

  guiLooseCursorID = uiCursorID;

  guiLooseCursorTimeOfLastUpdate = GetJA2Clock();

  gsLooseCursorGridNo = sGridNo;
}

function HandleLooseCursorDraw(): void {
  let pNewUIElem: LEVELNODE;

  if ((GetJA2Clock() - guiLooseCursorTimeOfLastUpdate) > LOOSE_CURSOR_DELAY) {
    gfLooseCursorOn = false;
  }

  if (gfLooseCursorOn) {
    pNewUIElem = AddUIElem(gsLooseCursorGridNo, Enum312.FIRSTPOINTERS4, 0, 0);
    pNewUIElem.ubShadeLevel = DEFAULT_SHADE_LEVEL;
    pNewUIElem.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
  }
}

function HandleLooseCursorHide(): void {
  if (gfLooseCursorOn) {
    RemoveTopmost(gsLooseCursorGridNo, Enum312.FIRSTPOINTERS4);
  }
}

export function GetSnapCursorIndex(usAdditionalData: UINT16): UINT16 {
  // OK, this function will get the 'true' index for drawing the cursor....
  if (gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR]) {
    switch (usAdditionalData) {
      case Enum312.FIRSTPOINTERS2:

        return Enum312.FIRSTPOINTERS13;
        break;

      case Enum312.FIRSTPOINTERS3:

        return Enum312.FIRSTPOINTERS14;
        break;

      case Enum312.FIRSTPOINTERS4:

        return Enum312.FIRSTPOINTERS15;
        break;

      case Enum312.FIRSTPOINTERS5:

        return Enum312.FIRSTPOINTERS16;
        break;

      case Enum312.FIRSTPOINTERS6:

        return Enum312.FIRSTPOINTERS17;
        break;

      case Enum312.FIRSTPOINTERS7:

        return Enum312.FIRSTPOINTERS18;
        break;

      case Enum312.FIRSTPOINTERS9:

        return Enum312.FIRSTPOINTERS19;
        break;

      case Enum312.FIRSTPOINTERS10:

        return Enum312.FIRSTPOINTERS20;
        break;

      default:

        return usAdditionalData;
    }
  } else {
    return usAdditionalData;
  }
}

}
