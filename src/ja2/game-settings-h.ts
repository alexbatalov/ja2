// If you add any options, MAKE sure you add the corresponding string to the Options Screen string array
export const enum Enum8 {
  TOPTION_SPEECH,
  TOPTION_MUTE_CONFIRMATIONS,
  TOPTION_SUBTITLES,
  TOPTION_KEY_ADVANCE_SPEECH,
  TOPTION_ANIMATE_SMOKE,
  //	TOPTION_HIDE_BULLETS,
  //	TOPTION_CONFIRM_MOVE,
  TOPTION_BLOOD_N_GORE,
  TOPTION_DONT_MOVE_MOUSE,
  TOPTION_OLD_SELECTION_METHOD,
  TOPTION_ALWAYS_SHOW_MOVEMENT_PATH,

  //	TOPTION_TIME_LIMIT_TURNS,			//moved to the game init screen

  TOPTION_SHOW_MISSES,

  TOPTION_RTCONFIRM,

  //	TOPTION_DISPLAY_ENEMY_INDICATOR,		//Displays the number of enemies seen by the merc, ontop of their portrait
  TOPTION_SLEEPWAKE_NOTIFICATION,

  TOPTION_USE_METRIC_SYSTEM, // If set, uses the metric system

  TOPTION_MERC_ALWAYS_LIGHT_UP,

  TOPTION_SMART_CURSOR,

  TOPTION_SNAP_CURSOR_TO_DOOR,

  TOPTION_GLOW_ITEMS,
  TOPTION_TOGGLE_TREE_TOPS,
  TOPTION_TOGGLE_WIREFRAME,
  TOPTION_3D_CURSOR,

  NUM_GAME_OPTIONS, // Toggle up this will be able to be Toggled by the player

  // These options will NOT be toggable by the Player
  TOPTION_MERC_CASTS_LIGHT = NUM_GAME_OPTIONS,
  TOPTION_HIDE_BULLETS,
  TOPTION_TRACKING_MODE,

  NUM_ALL_GAME_OPTIONS,
}

export interface GAME_SETTINGS {
  bLastSavedGameSlot: INT8; // The last saved game number goes in here

  ubMusicVolumeSetting: UINT8;
  ubSoundEffectsVolume: UINT8;
  ubSpeechVolume: UINT8;

  // The following are set from the status of the toggle boxes in the Options Screen
  fOptions: UINT8[] /* [NUM_ALL_GAME_OPTIONS] */;

  zVersionNumber: CHAR8[] /* [14] */;

  uiSettingsVersionNumber: UINT32;
  uiMeanwhileScenesSeenFlags: UINT32;

  fHideHelpInAllScreens: boolean;

  fUNUSEDPlayerFinishedTheGame: boolean; // JA2Gold: for UB compatibility
  ubSizeOfDisplayCover: UINT8;
  ubSizeOfLOS: UINT8;

  ubFiller: UINT8[] /* [17] */;
}

// Enums for the difficulty levels
export const enum Enum9 {
  DIF_LEVEL_ZERO,
  DIF_LEVEL_EASY,
  DIF_LEVEL_MEDIUM,
  DIF_LEVEL_HARD,
  DIF_LEVEL_FOUR,
}

export interface GAME_OPTIONS {
  fGunNut: boolean;
  fSciFi: boolean;
  ubDifficultyLevel: UINT8;
  fTurnTimeLimit: boolean;
  fIronManMode: boolean;

  ubFiller: UINT8[] /* [7] */;
}
