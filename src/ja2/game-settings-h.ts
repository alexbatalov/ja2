namespace ja2 {

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
  fOptions: boolean[] /* UINT8[NUM_ALL_GAME_OPTIONS] */;

  zVersionNumber: string /* CHAR8[14] */;

  uiSettingsVersionNumber: UINT32;
  uiMeanwhileScenesSeenFlags: UINT32;

  fHideHelpInAllScreens: boolean;

  fUNUSEDPlayerFinishedTheGame: boolean; // JA2Gold: for UB compatibility
  ubSizeOfDisplayCover: UINT8;
  ubSizeOfLOS: UINT8;

  ubFiller: UINT8[] /* [17] */;
}

export function createGameSettings(): GAME_SETTINGS {
  return {
    bLastSavedGameSlot: 0,
    ubMusicVolumeSetting: 0,
    ubSoundEffectsVolume: 0,
    ubSpeechVolume: 0,
    fOptions: createArray(Enum8.NUM_ALL_GAME_OPTIONS, false),
    zVersionNumber: '',
    uiSettingsVersionNumber: 0,
    uiMeanwhileScenesSeenFlags: 0,
    fHideHelpInAllScreens: false,
    fUNUSEDPlayerFinishedTheGame: false,
    ubSizeOfDisplayCover: 0,
    ubSizeOfLOS: 0,
    ubFiller: createArray(17, 0),
  };
}

export function resetGameSettings(o: GAME_SETTINGS) {
  o.bLastSavedGameSlot = 0;
  o.ubMusicVolumeSetting = 0;
  o.ubSoundEffectsVolume = 0;
  o.ubSpeechVolume = 0;
  o.fOptions.fill(false);
  o.zVersionNumber = '';
  o.uiSettingsVersionNumber = 0;
  o.uiMeanwhileScenesSeenFlags = 0;
  o.fHideHelpInAllScreens = false;
  o.fUNUSEDPlayerFinishedTheGame = false;
  o.ubSizeOfDisplayCover = 0;
  o.ubSizeOfLOS = 0;
  o.ubFiller.fill(0);
}

export const GAME_SETTINGS_SIZE = 76;

export function readGameSettings(o: GAME_SETTINGS, buffer: Buffer, offset: number = 0): number {
  o.bLastSavedGameSlot = buffer.readInt8(offset++);
  o.ubMusicVolumeSetting = buffer.readUInt8(offset++);
  o.ubSoundEffectsVolume = buffer.readUInt8(offset++);
  o.ubSpeechVolume = buffer.readUInt8(offset++);
  offset = readBooleanArray(o.fOptions, buffer, offset);
  o.zVersionNumber = readStringNL(buffer, 'ascii', offset, offset + 14); offset += 14;
  offset += 3; // padding
  o.uiSettingsVersionNumber = buffer.readUInt32LE(offset); offset += 4;
  o.uiMeanwhileScenesSeenFlags = buffer.readUInt32LE(offset); offset += 4;
  o.fHideHelpInAllScreens = Boolean(buffer.readUInt8(offset++));
  o.fUNUSEDPlayerFinishedTheGame = Boolean(buffer.readUInt8(offset++));
  o.ubSizeOfDisplayCover = buffer.readUInt8(offset++);
  o.ubSizeOfLOS = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  offset += 3; // padding
  return offset;
}

export function writeGameSettings(o: GAME_SETTINGS, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt8(o.bLastSavedGameSlot, offset);
  offset = buffer.writeUInt8(o.ubMusicVolumeSetting, offset);
  offset = buffer.writeUInt8(o.ubSoundEffectsVolume, offset);
  offset = buffer.writeUInt8(o.ubSpeechVolume, offset);
  offset = writeBooleanArray(o.fOptions, buffer, offset);
  offset = writeStringNL(o.zVersionNumber, buffer, offset, 14, 'ascii');
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiSettingsVersionNumber, offset);
  offset = buffer.writeUInt32LE(o.uiMeanwhileScenesSeenFlags, offset);
  offset = buffer.writeUInt8(Number(o.fHideHelpInAllScreens), offset);
  offset = buffer.writeUInt8(Number(o.fUNUSEDPlayerFinishedTheGame), offset);
  offset = buffer.writeUInt8(o.ubSizeOfDisplayCover, offset);
  offset = buffer.writeUInt8(o.ubSizeOfLOS, offset);
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  offset = writePadding(buffer, offset, 3); // padding
  return offset;
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

export function createGameOptions(): GAME_OPTIONS {
  return {
    fGunNut: false,
    fSciFi: false,
    ubDifficultyLevel: 0,
    fTurnTimeLimit: false,
    fIronManMode: false,

    ubFiller: createArray(7, 0),
  }
}

export function copyGameOptions(destination: GAME_OPTIONS, source: GAME_OPTIONS) {
  destination.fGunNut = source.fGunNut;
  destination.fSciFi = source.fSciFi;
  destination.ubDifficultyLevel = source.ubDifficultyLevel;
  destination.fTurnTimeLimit = source.fTurnTimeLimit;
  destination.fIronManMode = source.fIronManMode;
  copyArray(destination.ubFiller, source.ubFiller);
}

export function resetGameOptions(o: GAME_OPTIONS) {
  o.fGunNut = false;
  o.fSciFi = false;
  o.ubDifficultyLevel = 0;
  o.fTurnTimeLimit = false;
  o.fIronManMode = false;
  o.ubFiller.fill(0);
}

export const GAME_OPTIONS_SIZE = 12;

export function readGameOptions(o: GAME_OPTIONS, buffer: Buffer, offset: number = 0): number {
  o.fGunNut = Boolean(buffer.readUInt8(offset++));
  o.fSciFi = Boolean(buffer.readUInt8(offset++));
  o.ubDifficultyLevel = buffer.readUInt8(offset++);
  o.fTurnTimeLimit = Boolean(buffer.readUInt8(offset++));
  o.fIronManMode = Boolean(buffer.readUInt8(offset++));
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

export function writeGameOptions(o: GAME_OPTIONS, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fGunNut), offset);
  offset = buffer.writeUInt8(Number(o.fSciFi), offset);
  offset = buffer.writeUInt8(o.ubDifficultyLevel, offset);
  offset = buffer.writeUInt8(Number(o.fTurnTimeLimit), offset);
  offset = buffer.writeUInt8(Number(o.fIronManMode), offset);
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

}
