namespace ja2 {

const GAME_SETTINGS_FILE = "..\\Ja2.set";

const GAME_INI_FILE = "..\\Ja2.ini";

const CD_ROOT_DIR = "DATA\\";

export let gGameSettings: GAME_SETTINGS;
export let gGameOptions: GAME_OPTIONS;

// Change this number when we want any who gets the new build to reset the options
const GAME_SETTING_CURRENT_VERSION = 522;

export function LoadGameSettings(): boolean {
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;

  // if the game settings file does NOT exist, or if it is smaller then what it should be
  if (!FileExists(GAME_SETTINGS_FILE) || FileSize(GAME_SETTINGS_FILE) != sizeof(GAME_SETTINGS)) {
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

    FileRead(hFile, addressof(gGameSettings), sizeof(GAME_SETTINGS), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(GAME_SETTINGS)) {
      FileClose(hFile);
      InitGameSettings();
      return false;
    }

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
  FileWrite(hFile, addressof(gGameSettings), sizeof(GAME_SETTINGS), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(GAME_SETTINGS)) {
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  return true;
}

function InitGameSettings(): void {
  memset(addressof(gGameSettings), 0, sizeof(GAME_SETTINGS));

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
  memset(addressof(gGameOptions), 0, sizeof(GAME_OPTIONS));

  // Init the game options
  gGameOptions.fGunNut = false;
  gGameOptions.fSciFi = true;
  gGameOptions.ubDifficultyLevel = Enum9.DIF_LEVEL_EASY;
  // gGameOptions.fTurnTimeLimit		 = FALSE;
  gGameOptions.fIronManMode = false;
}

export function GetCDLocation(): boolean {
  let uiStrngLength: UINT32 = 0;
  let zCdLocation: string /* CHAR8[SGPFILENAME_LEN] */;
  let uiDriveType: UINT32 = 0;
  let uiRetVal: UINT32 = 0;

  // Do a crude check to make sure the Ja2.ini file is the right on

  uiRetVal = GetPrivateProfileString("Ja2 Settings", "CD", "", zCdLocation, SGPFILENAME_LEN, GAME_INI_FILE);
  if (uiRetVal == 0 || !IsDriveLetterACDromDrive(zCdLocation)) {
    // the user most likely doesnt have the file, or the user has messed with the file
    // build a new one

    // First delete the old file
    FileDelete(GAME_INI_FILE);

    // Get the location of the cdrom drive
    if (GetCDromDriveLetter(zCdLocation)) {
      let pTemp: string /* Pointer<CHAR8> */;

      // if it succeeded
      pTemp = strrchr(zCdLocation, ':');
      pTemp[0] = '\0';
    } else {
      // put in a default location
      zCdLocation = "c";
    }

    // Now create a new file
    WritePrivateProfileString("Ja2 Settings", "CD", zCdLocation, GAME_INI_FILE);

    GetPrivateProfileString("Ja2 Settings", "CD", "", zCdLocation, SGPFILENAME_LEN, GAME_INI_FILE);
  }

  uiStrngLength = strlen(zCdLocation);

  // if the string length is less the 1 character, it is a drive letter
  if (uiStrngLength == 1) {
    gzCdDirectory = sprintf("%s:\\%s", zCdLocation, CD_ROOT_DIR);
  }

  // else it is most likely a network location
  else if (uiStrngLength > 1) {
    gzCdDirectory = sprintf("%s\\%s", zCdLocation, CD_ROOT_DIR);
  } else {
    // no path was entered
    gzCdDirectory[0] = '.';
  }

  return true;
}

function GetCDromDriveLetter(pString: Pointer<string> /* STR8 */): boolean {
  let uiSize: UINT32 = 0;
  let ubCnt: UINT8 = 0;
  let zDriveLetters: string /* CHAR8[512] */;
  let zDriveLetter: string /* CHAR8[16] */;
  let uiDriveType: UINT32;

  uiSize = GetLogicalDriveStrings(512, zDriveLetters);

  for (ubCnt = 0; ubCnt < uiSize; ubCnt++) {
    // if the current char is not null
    if (zDriveLetters[ubCnt] != '\0') {
      // get the string
      zDriveLetter[0] = zDriveLetters[ubCnt];
      ubCnt++;
      zDriveLetter[1] = zDriveLetters[ubCnt];
      ubCnt++;
      zDriveLetter[2] = zDriveLetters[ubCnt];

      zDriveLetter[3] = '\0';

      // Get the drive type
      uiDriveType = GetDriveType(zDriveLetter);
      switch (uiDriveType) {
        // The drive is a CD-ROM drive.
        case DRIVE_CDROM:
          pString = zDriveLetter;

          if (DoJA2FilesExistsOnDrive(pString)) {
            return true;
          }
          break;

        default:
          break;
      }
    }
  }

  return false;
}

/*


        //Determine the type of drive the CDrom is on
        uiDriveType = GetDriveType( zCdLocation );
        switch( uiDriveType )
        {
                // The root directory does not exist.
                case DRIVE_NO_ROOT_DIR:
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("CDrom Info '%s': %s", zCdLocation, "The root directory does not exist." ) );
                        break;


                // The disk can be removed from the drive.
                case DRIVE_REMOVABLE:
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("CDrom Info '%s': %s", zCdLocation, "The disk can be removed from the drive." ) );
                        break;


                // The disk cannot be removed from the drive.
                case DRIVE_FIXED:
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("CDrom Info '%s': %s", zCdLocation, "The disk cannot be removed from the drive." ) );
                        break;


                // The drive is a remote (network) drive.
                case DRIVE_REMOTE:
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("CDrom Info '%s': %s", zCdLocation, "The drive is a remote (network) drive." ) );
                        break;


                // The drive is a CD-ROM drive.
                case DRIVE_CDROM:
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("CDrom Info '%s': %s", zCdLocation, "The drive is a CD-ROM drive." ) );
                        break;


                // The drive is a RAM disk.
                case DRIVE_RAMDISK:
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("CDrom Info '%s': %s", zCdLocation, "The drive is a RAM disk." ) );
                        break;


                // The drive type cannot be determined.
                case DRIVE_UNKNOWN:
                default:
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("CDrom Info '%s': %s", zCdLocation, "The drive type cannot be determined." ) );
                        break;
        }


*/

export function CheckIfGameCdromIsInCDromDrive(): boolean {
  let zVolumeNameBuffer: string /* CHAR8[512] */;
  let uiVolumeSerialNumber: UINT32 = 0;
  let uiMaxComponentLength: UINT32 = 0;
  let uiFileSystemFlags: UINT32 = 0;
  let zFileSystemNameBuffer: string /* CHAR8[512] */;
  let zCdLocation: string /* CHAR8[SGPFILENAME_LEN] */;
  let zCdFile: string /* CHAR8[SGPFILENAME_LEN] */;

  let zCdromRootDrive: string /* CHAR8[512] */;
  let fFailed: boolean = false;
  let uiVolumeReturnValue: UINT32;
  let uiLastError: UINT32 = ERROR_SUCCESS;

  if (!GetCdromLocationFromIniFile(zCdromRootDrive))
    return false;

  uiVolumeReturnValue = GetVolumeInformation(zCdromRootDrive, zVolumeNameBuffer, 512, addressof(uiVolumeSerialNumber), addressof(uiMaxComponentLength), addressof(uiFileSystemFlags), zFileSystemNameBuffer, 512);

  if (!uiVolumeReturnValue) {
    uiLastError = GetLastError();
  }

  // OK, build filename
  zCdFile = sprintf("%s%s", zCdLocation, gCheckFilenames[Random(2)]);

  // If the cdrom drive is no longer in the drive
  if (uiLastError == ERROR_NOT_READY || (!FileExists(zCdFile))) {
    let sString: string /* CHAR8[512] */;

    // if a game has been started, add the msg about saving the game to a different entry
    if (gTacticalStatus.fHasAGameBeenStarted) {
      sString = sprintf("%S  %S", pMessageStrings[Enum333.MSG_INTEGRITY_WARNING], pMessageStrings[Enum333.MSG_CDROM_SAVE_GAME]);

      SaveGame(SAVE__ERROR_NUM, pMessageStrings[Enum333.MSG_CDROM_SAVE]);
    } else {
      sString = sprintf("%S", pMessageStrings[Enum333.MSG_INTEGRITY_WARNING]);
    }

    // ATE: These are ness. due to reference counting
    // in showcursor(). I'm not about to go digging in low level stuff at this
    // point in the game development, so keep these here, as this works...
    ShowCursor(true);
    ShowCursor(true);
    ShutdownWithErrorBox(sString);

    // DoTester( );
    // MessageBox(NULL, sString, "Error", MB_OK | MB_ICONERROR  );

    return false;
  }

  return true;
}

function GetCdromLocationFromIniFile(pRootOfCdromDrive: Pointer<string> /* STR */): boolean {
  let uiRetVal: UINT32 = 0;

  // Do a crude check to make sure the Ja2.ini file is the right on

  uiRetVal = GetPrivateProfileString("Ja2 Settings", "CD", "", pRootOfCdromDrive, SGPFILENAME_LEN, GAME_INI_FILE);
  if (uiRetVal == 0) {
    pRootOfCdromDrive[0] = '\0';
    return false;
  } else {
    // add the :\ to the dir
    pRootOfCdromDrive += ":\\";
    return true;
  }
}

export function CDromEjectionErrorMessageBoxCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_OK) {
    guiPreviousOptionScreen = Enum26.GAME_SCREEN;

    // if we are in a game, save the game
    if (gTacticalStatus.fHasAGameBeenStarted) {
      SaveGame(SAVE__ERROR_NUM, pMessageStrings[Enum333.MSG_CDROM_SAVE]);
    }

    // quit the game
    gfProgramIsRunning = false;
  }
}

function IsDriveLetterACDromDrive(pDriveLetter: string /* STR */): boolean {
  let uiDriveType: UINT32;
  let zRootName: string /* CHAR8[512] */;

  zRootName = sprintf("%s:\\", pDriveLetter);

  // Get the drive type
  uiDriveType = GetDriveType(zRootName);
  switch (uiDriveType) {
    // The drive is a CD-ROM drive.
    case DRIVE_CDROM:
      return true;
      break;
  }

  return false;
}

export function DisplayGameSettings(): void {
  // Display the version number
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s (%S)", pMessageStrings[Enum333.MSG_VERSION], zVersionLabel, czVersionNumber);

  // Display the difficulty level
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_DIF_LEVEL_TEXT], gzGIOScreenText[gGameOptions.ubDifficultyLevel + Enum375.GIO_EASY_TEXT - 1]);

  // Iron man option
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GAME_SAVE_STYLE_TEXT], gzGIOScreenText[Enum375.GIO_SAVE_ANYWHERE_TEXT + gGameOptions.fIronManMode]);

  // Gun option
  if (gGameOptions.fGunNut)
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GUN_OPTIONS_TEXT], gzGIOScreenText[Enum375.GIO_GUN_NUT_TEXT]);
  else
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GUN_OPTIONS_TEXT], gzGIOScreenText[Enum375.GIO_REDUCED_GUNS_TEXT]);

  // Sci fi option
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "%s: %s", gzGIOScreenText[Enum375.GIO_GAME_STYLE_TEXT], gzGIOScreenText[Enum375.GIO_REALISTIC_TEXT + gGameOptions.fSciFi]);

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
