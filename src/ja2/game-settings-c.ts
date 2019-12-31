namespace ja2 {

const GAME_SETTINGS_FILE = "..\\Ja2.set";

const GAME_INI_FILE = "..\\Ja2.ini";

const CD_ROOT_DIR = "DATA\\";

export let gGameSettings: GAME_SETTINGS = createGameSettings();
export let gGameOptions: GAME_OPTIONS = createGameOptions();

// Change this number when we want any who gets the new build to reset the options
const GAME_SETTING_CURRENT_VERSION = 522;

export function LoadGameSettings(): boolean {
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // if the game settings file does NOT exist, or if it is smaller then what it should be
  if (!FileExists(GAME_SETTINGS_FILE) || FileSize(GAME_SETTINGS_FILE) != GAME_SETTINGS_SIZE) {
    // Initialize the settings
    InitGameSettings();

    // delete the shade tables aswell
    DeleteShadeTableDir();
  } else {
    hFile = FileOpen(GAME_SETTINGS_FILE, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
    if (!hFile) {
      FileClose(hFile);
      InitGameSettings();
      return false;
    }

    buffer = Buffer.allocUnsafe(GAME_SETTINGS_SIZE);
    uiNumBytesRead = FileRead(hFile, buffer, GAME_SETTINGS_SIZE);
    if (uiNumBytesRead != GAME_SETTINGS_SIZE) {
      FileClose(hFile);
      InitGameSettings();
      return false;
    }

    readGameSettings(gGameSettings, buffer);

    FileClose(hFile);
  }

  // if the version in the game setting file is older then the we want, init the game settings
  if (gGameSettings.uiSettingsVersionNumber < GAME_SETTING_CURRENT_VERSION) {
    // Initialize the settings
    InitGameSettings();

    // delete the shade tables aswell
    DeleteShadeTableDir();

    return true;
  }

  //
  // Do checking to make sure the settings are valid
  //
  if (gGameSettings.bLastSavedGameSlot < 0 || gGameSettings.bLastSavedGameSlot >= NUM_SAVE_GAMES)
    gGameSettings.bLastSavedGameSlot = -1;

  if (gGameSettings.ubMusicVolumeSetting > HIGHVOLUME)
    gGameSettings.ubMusicVolumeSetting = MIDVOLUME;

  if (gGameSettings.ubSoundEffectsVolume > HIGHVOLUME)
    gGameSettings.ubSoundEffectsVolume = MIDVOLUME;

  if (gGameSettings.ubSpeechVolume > HIGHVOLUME)
    gGameSettings.ubSpeechVolume = MIDVOLUME;

  // make sure that at least subtitles or speech is enabled
  if (!gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES] && !gGameSettings.fOptions[Enum8.TOPTION_SPEECH]) {
    gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES] = true;
    gGameSettings.fOptions[Enum8.TOPTION_SPEECH] = true;
  }

  //
  //	Set the settings
  //

  SetSoundEffectsVolume(gGameSettings.ubSoundEffectsVolume);
  SetSpeechVolume(gGameSettings.ubSpeechVolume);
  MusicSetVolume(gGameSettings.ubMusicVolumeSetting);

  // if the user doesnt want the help screens present
  if (gGameSettings.fHideHelpInAllScreens) {
    gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen = 0;
  } else {
    // Set it so that every screens help will come up the first time ( the 'x' will be set )
    gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen = 0xffff;
  }

  return true;
}

export function SaveGameSettings(): boolean {
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  // create the file
  hFile = FileOpen(GAME_SETTINGS_FILE, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false);
  if (!hFile) {
    FileClose(hFile);
    return false;
  }

  // Record the current settings into the game settins structure

  gGameSettings.ubSoundEffectsVolume = GetSoundEffectsVolume();
  gGameSettings.ubSpeechVolume = GetSpeechVolume();
  gGameSettings.ubMusicVolumeSetting = MusicGetVolume();

  gGameSettings.zVersionNumber = czVersionNumber;

  gGameSettings.uiSettingsVersionNumber = GAME_SETTING_CURRENT_VERSION;

  // Write the game settings to disk
  buffer = Buffer.allocUnsafe(GAME_SETTINGS_SIZE);
  writeGameSettings(gGameSettings, buffer);

  uiNumBytesWritten = FileWrite(hFile, buffer, GAME_SETTINGS_SIZE);
  if (uiNumBytesWritten != GAME_SETTINGS_SIZE) {
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  return true;
}

function InitGameSettings(): void {
  resetGameSettings(gGameSettings);

  // Init the Game Settings
  gGameSettings.bLastSavedGameSlot = -1;
  gGameSettings.ubMusicVolumeSetting = 63;
  gGameSettings.ubSoundEffectsVolume = 63;
  gGameSettings.ubSpeechVolume = 63;

  // Set the settings
  SetSoundEffectsVolume(gGameSettings.ubSoundEffectsVolume);
  SetSpeechVolume(gGameSettings.ubSpeechVolume);
  MusicSetVolume(gGameSettings.ubMusicVolumeSetting);

  gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES] = true;
  gGameSettings.fOptions[Enum8.TOPTION_SPEECH] = true;
  gGameSettings.fOptions[Enum8.TOPTION_KEY_ADVANCE_SPEECH] = false;
  gGameSettings.fOptions[Enum8.TOPTION_RTCONFIRM] = false;
  gGameSettings.fOptions[Enum8.TOPTION_HIDE_BULLETS] = false;
  gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE] = true;
  gGameSettings.fOptions[Enum8.TOPTION_MUTE_CONFIRMATIONS] = false;
  gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE] = true;
  gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE] = true;
  gGameSettings.fOptions[Enum8.TOPTION_DONT_MOVE_MOUSE] = false;
  gGameSettings.fOptions[Enum8.TOPTION_OLD_SELECTION_METHOD] = false;
  gGameSettings.fOptions[Enum8.TOPTION_ALWAYS_SHOW_MOVEMENT_PATH] = false;

  gGameSettings.fOptions[Enum8.TOPTION_SLEEPWAKE_NOTIFICATION] = true;

  gGameSettings.fOptions[Enum8.TOPTION_USE_METRIC_SYSTEM] = false;

  gGameSettings.fOptions[Enum8.TOPTION_MERC_ALWAYS_LIGHT_UP] = false;
  gGameSettings.fOptions[Enum8.TOPTION_SMART_CURSOR] = false;

  gGameSettings.fOptions[Enum8.TOPTION_SNAP_CURSOR_TO_DOOR] = true;
  gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = true;
  gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS] = true;
  gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME] = true;
  gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR] = false;
  // JA2Gold
  gGameSettings.fOptions[Enum8.TOPTION_MERC_CASTS_LIGHT] = true;

  gGameSettings.ubSizeOfDisplayCover = 4;
  gGameSettings.ubSizeOfLOS = 4;

  // Since we just set the settings, save them
  SaveGameSettings();
}

export function InitGameOptions(): void {
  resetGameOptions(gGameOptions);

  // Init the game options
  gGameOptions.fGunNut = false;
  gGameOptions.fSciFi = true;
  gGameOptions.ubDifficultyLevel = Enum9.DIF_LEVEL_EASY;
  // gGameOptions.fTurnTimeLimit		 = FALSE;
  gGameOptions.fIronManMode = false;
}

export function DisplayGameSettings(): void {
  // Display the version number
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s (%s)", pMessageStrings[Enum333.MSG_VERSION], zVersionLabel, czVersionNumber);

  // Display the difficulty level
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_DIF_LEVEL_TEXT], gzGIOScreenText[gGameOptions.ubDifficultyLevel + Enum375.GIO_EASY_TEXT - 1]);

  // Iron man option
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GAME_SAVE_STYLE_TEXT], gzGIOScreenText[Enum375.GIO_SAVE_ANYWHERE_TEXT + Number(gGameOptions.fIronManMode)]);

  // Gun option
  if (gGameOptions.fGunNut)
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GUN_OPTIONS_TEXT], gzGIOScreenText[Enum375.GIO_GUN_NUT_TEXT]);
  else
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GUN_OPTIONS_TEXT], gzGIOScreenText[Enum375.GIO_REDUCED_GUNS_TEXT]);

  // Sci fi option
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GAME_STYLE_TEXT], gzGIOScreenText[Enum375.GIO_REALISTIC_TEXT + Number(gGameOptions.fSciFi)]);

  // Timed Turns option
  // JA2Gold: no timed turns
  // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"%s: %s", gzGIOScreenText[ GIO_TIMED_TURN_TITLE_TEXT ], gzGIOScreenText[ GIO_NO_TIMED_TURNS_TEXT + gGameOptions.fTurnTimeLimit ] );

  if (CHEATER_CHEAT_LEVEL()) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[58], CurrentPlayerProgressPercentage(), HighestPlayerProgressPercentage());
  }
}

export function MeanwhileSceneSeen(ubMeanwhile: UINT8): boolean {
  let uiCheckFlag: UINT32;

  if (ubMeanwhile > 32 || ubMeanwhile > Enum160.NUM_MEANWHILES) {
    return false;
  }

  uiCheckFlag = 0x1 << ubMeanwhile;

  if (gGameSettings.uiMeanwhileScenesSeenFlags & uiCheckFlag) {
    return true;
  } else {
    return false;
  }
}

export function SetMeanwhileSceneSeen(ubMeanwhile: UINT8): boolean {
  let uiCheckFlag: UINT32;

  if (ubMeanwhile > 32 || ubMeanwhile > Enum160.NUM_MEANWHILES) {
    // can't set such a flag!
    return false;
  }
  uiCheckFlag = 0x1 << ubMeanwhile;
  gGameSettings.uiMeanwhileScenesSeenFlags |= uiCheckFlag;
  return true;
}

export function CanGameBeSaved(): boolean {
  // if the iron man mode is on
  if (gGameOptions.fIronManMode) {
    // if we are in turn based combat
    if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
      // no save for you
      return false;
    }

    // if there are enemies in the current sector
    if (gWorldSectorX != -1 && gWorldSectorY != -1 && gWorldSectorX != 0 && gWorldSectorY != 0 && NumEnemiesInAnySector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) > 0) {
      // no save for you
      return false;
    }

    // All checks failed, so we can save
    return true;
  } else {
    return true;
  }
}

}
