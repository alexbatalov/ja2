let uiMusicHandle: UINT32 = NO_SAMPLE;
let uiMusicVolume: UINT32 = 50;
let fMusicPlaying: boolean = false;
let fMusicFadingOut: boolean = false;
let fMusicFadingIn: boolean = false;

let gfMusicEnded: boolean = false;

let gubMusicMode: UINT8 = 0;
let gubOldMusicMode: UINT8 = 0;

let gbVictorySongCount: INT8 = 0;
let gbDeathSongCount: INT8 = 0;

let bNothingModeSong: INT8;
let bEnemyModeSong: INT8;
let bBattleModeSong: INT8;

let gbFadeSpeed: INT8 = 1;

let szMusicList: Pointer<CHAR8>[] /* [NUM_MUSIC] */ = [
  "MUSIC\\marimbad 2.wav",
  "MUSIC\\menumix1.wav",
  "MUSIC\\nothing A.wav",
  "MUSIC\\nothing B.wav",
  "MUSIC\\nothing C.wav",
  "MUSIC\\nothing D.wav",
  "MUSIC\\tensor A.wav",
  "MUSIC\\tensor B.wav",
  "MUSIC\\tensor C.wav",
  "MUSIC\\triumph.wav",
  "MUSIC\\death.wav",
  "MUSIC\\battle A.wav",
  "MUSIC\\tensor B.wav",
  "MUSIC\\creepy.wav",
  "MUSIC\\creature battle.wav",
];

let gfForceMusicToTense: boolean = false;
let gfDontRestartSong: boolean = false;

function NoEnemiesInSight(): boolean {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;

  // Loop through our guys
  // End the turn of player charactors
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE) {
      if (pSoldier.value.bOppCnt != 0) {
        return false;
      }
    }
  }

  return true;
}

//********************************************************************************
// MusicPlay
//
//		Starts up one of the tunes in the music list.
//
//	Returns:	TRUE if the music was started, FALSE if an error occurred
//
//********************************************************************************
function MusicPlay(uiNum: UINT32): boolean {
  let spParms: SOUNDPARMS;

  if (fMusicPlaying)
    MusicStop();

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));
  spParms.uiPriority = PRIORITY_MAX;
  spParms.uiVolume = 0;

  spParms.EOSCallback = MusicStopCallback;

  uiMusicHandle = SoundPlayStreamedFile(szMusicList[uiNum], addressof(spParms));

  if (uiMusicHandle != SOUND_ERROR) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Music PLay %d %d", uiMusicHandle, gubMusicMode));

    gfMusicEnded = false;
    fMusicPlaying = true;
    MusicFadeIn();
    return true;
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Music PLay %d %d", uiMusicHandle, gubMusicMode));

  return false;
}

//********************************************************************************
// MusicSetVolume
//
//		Sets the volume on the currently playing music.
//
//	Returns:	TRUE if the volume was set, FALSE if an error occurred
//
//********************************************************************************
function MusicSetVolume(uiVolume: UINT32): boolean {
  let uiOldMusicVolume: INT32 = uiMusicVolume;

  uiMusicVolume = __min(uiVolume, 127);

  if (uiMusicHandle != NO_SAMPLE) {
    // get volume and if 0 stop music!
    if (uiMusicVolume == 0) {
      gfDontRestartSong = true;
      MusicStop();
      return true;
    }

    SoundSetVolume(uiMusicHandle, uiMusicVolume);

    return true;
  }

  // If here, check if we need to re-start music
  // Have we re-started?
  if (uiMusicVolume > 0 && uiOldMusicVolume == 0) {
    StartMusicBasedOnMode();
  }

  return false;
}

//********************************************************************************
// MusicGetVolume
//
//		Gets the volume on the currently playing music.
//
//	Returns:	TRUE if the volume was set, FALSE if an error occurred
//
//********************************************************************************
function MusicGetVolume(): UINT32 {
  return uiMusicVolume;
}

//********************************************************************************
// MusicStop
//
//		Stops the currently playing music.
//
//	Returns:	TRUE if the music was stopped, FALSE if an error occurred
//
//********************************************************************************
function MusicStop(): boolean {
  if (uiMusicHandle != NO_SAMPLE) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Music Stop %d %d", uiMusicHandle, gubMusicMode));

    SoundStop(uiMusicHandle);
    fMusicPlaying = false;
    uiMusicHandle = NO_SAMPLE;
    return true;
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Music Stop %d %d", uiMusicHandle, gubMusicMode));

  return false;
}

//********************************************************************************
// MusicFadeOut
//
//		Fades out the current song.
//
//	Returns:	TRUE if the music has begun fading, FALSE if an error occurred
//
//********************************************************************************
function MusicFadeOut(): boolean {
  if (uiMusicHandle != NO_SAMPLE) {
    fMusicFadingOut = true;
    return true;
  }
  return false;
}

//********************************************************************************
// MusicFadeIn
//
//		Fades in the current song.
//
//	Returns:	TRUE if the music has begun fading in, FALSE if an error occurred
//
//********************************************************************************
function MusicFadeIn(): boolean {
  if (uiMusicHandle != NO_SAMPLE) {
    fMusicFadingIn = true;
    return true;
  }
  return false;
}

//********************************************************************************
// MusicPoll
//
//		Handles any maintenance the music system needs done. Should be polled from
//	the main loop, or somewhere with a high frequency of calls.
//
//	Returns:	TRUE always
//
//********************************************************************************
function MusicPoll(fForce: boolean): boolean {
  let iVol: INT32;

  SoundServiceStreams();
  SoundServiceRandom();

  // Handle Sound every sound overhead time....
  if (COUNTERDONE(Enum386.MUSICOVERHEAD)) {
    // Reset counter
    RESETCOUNTER(Enum386.MUSICOVERHEAD);

    if (fMusicFadingIn) {
      if (uiMusicHandle != NO_SAMPLE) {
        iVol = SoundGetVolume(uiMusicHandle);
        iVol = __min(uiMusicVolume, iVol + gbFadeSpeed);
        SoundSetVolume(uiMusicHandle, iVol);
        if (iVol == uiMusicVolume) {
          fMusicFadingIn = false;
          gbFadeSpeed = 1;
        }
      }
    } else if (fMusicFadingOut) {
      if (uiMusicHandle != NO_SAMPLE) {
        iVol = SoundGetVolume(uiMusicHandle);
        iVol = (iVol >= 1) ? iVol - gbFadeSpeed : 0;

        iVol = __max(iVol, 0);

        SoundSetVolume(uiMusicHandle, iVol);
        if (iVol == 0) {
          MusicStop();
          fMusicFadingOut = false;
          gbFadeSpeed = 1;
        }
      }
    }

    //#endif

    if (gfMusicEnded) {
      // OK, based on our music mode, play another!
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Music End Loop %d %d", uiMusicHandle, gubMusicMode));

      // If we were in victory mode, change!
      if (gbVictorySongCount == 1 || gbDeathSongCount == 1) {
        if (gbDeathSongCount == 1 && guiCurrentScreen == Enum26.GAME_SCREEN) {
          CheckAndHandleUnloadingOfCurrentWorld();
        }

        if (gbVictorySongCount == 1) {
          SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
        }
      } else {
        if (!gfDontRestartSong) {
          StartMusicBasedOnMode();
        }
      }

      gfMusicEnded = false;
      gfDontRestartSong = false;
    }
  }

  return true;
}

function SetMusicMode(ubMusicMode: UINT8): boolean {
  /* static */ let bPreviousMode: INT8 = 0;

  // OK, check if we want to restore
  if (ubMusicMode == Enum328.MUSIC_RESTORE) {
    if (bPreviousMode == Enum328.MUSIC_TACTICAL_VICTORY || bPreviousMode == Enum328.MUSIC_TACTICAL_DEATH) {
      bPreviousMode = Enum328.MUSIC_TACTICAL_NOTHING;
    }

    ubMusicMode = bPreviousMode;
  } else {
    // Save previous mode...
    bPreviousMode = gubOldMusicMode;
  }

  // if different, start a new music song
  if (gubOldMusicMode != ubMusicMode) {
    // Set mode....
    gubMusicMode = ubMusicMode;

    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Music New Mode %d %d", uiMusicHandle, gubMusicMode));

    gbVictorySongCount = 0;
    gbDeathSongCount = 0;

    if (uiMusicHandle != NO_SAMPLE) {
      // Fade out old music
      MusicFadeOut();
    } else {
      // Change music!
      StartMusicBasedOnMode();
    }
  }
  gubOldMusicMode = gubMusicMode;

  return true;
}

function StartMusicBasedOnMode(): boolean {
  /* static */ let fFirstTime: boolean = true;

  if (fFirstTime) {
    fFirstTime = false;

    bNothingModeSong = Enum327.NOTHING_A_MUSIC + Random(4);

    bEnemyModeSong = Enum327.TENSOR_A_MUSIC + Random(3);

    bBattleModeSong = Enum327.BATTLE_A_MUSIC + Random(2);
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("StartMusicBasedOnMode() %d %d", uiMusicHandle, gubMusicMode));

  // Setup a song based on mode we're in!
  switch (gubMusicMode) {
    case Enum328.MUSIC_MAIN_MENU:
      // ATE: Don't fade in
      gbFadeSpeed = uiMusicVolume;
      MusicPlay(Enum327.MENUMIX_MUSIC);
      break;

    case Enum328.MUSIC_LAPTOP:
      gbFadeSpeed = uiMusicVolume;
      MusicPlay(Enum327.MARIMBAD2_MUSIC);
      break;

    case Enum328.MUSIC_TACTICAL_NOTHING:
      // ATE: Don't fade in
      gbFadeSpeed = uiMusicVolume;
      if (gfUseCreatureMusic) {
        MusicPlay(Enum327.CREEPY_MUSIC);
      } else {
        MusicPlay(bNothingModeSong);
        bNothingModeSong = Enum327.NOTHING_A_MUSIC + Random(4);
      }
      break;

    case Enum328.MUSIC_TACTICAL_ENEMYPRESENT:
      // ATE: Don't fade in EnemyPresent...
      gbFadeSpeed = uiMusicVolume;
      if (gfUseCreatureMusic) {
        MusicPlay(Enum327.CREEPY_MUSIC);
      } else {
        MusicPlay(bEnemyModeSong);
        bEnemyModeSong = Enum327.TENSOR_A_MUSIC + Random(3);
      }
      break;

    case Enum328.MUSIC_TACTICAL_BATTLE:
      // ATE: Don't fade in
      gbFadeSpeed = uiMusicVolume;
      if (gfUseCreatureMusic) {
        MusicPlay(Enum327.CREATURE_BATTLE_MUSIC);
      } else {
        MusicPlay(bBattleModeSong);
      }
      bBattleModeSong = Enum327.BATTLE_A_MUSIC + Random(2);
      break;

    case Enum328.MUSIC_TACTICAL_VICTORY:

      // ATE: Don't fade in EnemyPresent...
      gbFadeSpeed = uiMusicVolume;
      MusicPlay(Enum327.TRIUMPH_MUSIC);
      gbVictorySongCount++;

      if (gfUseCreatureMusic && !gbWorldSectorZ) {
        // We just killed all the creatures that just attacked the town.
        gfUseCreatureMusic = false;
      }
      break;

    case Enum328.MUSIC_TACTICAL_DEATH:

      // ATE: Don't fade in EnemyPresent...
      gbFadeSpeed = uiMusicVolume;
      MusicPlay(Enum327.DEATH_MUSIC);
      gbDeathSongCount++;
      break;

    default:
      MusicFadeOut();
      break;
  }

  return true;
}

function MusicStopCallback(pData: Pointer<void>): void {
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Music EndCallback %d %d", uiMusicHandle, gubMusicMode));

  gfMusicEnded = true;
  uiMusicHandle = NO_SAMPLE;
}

function SetMusicFadeSpeed(bFadeSpeed: INT8): void {
  gbFadeSpeed = bFadeSpeed;
}

function FadeMusicForXSeconds(uiDelay: UINT32): void {
  let sNumTimeSteps: INT16;
  let sNumVolumeSteps: INT16;

  // get # time steps in delay....
  sNumTimeSteps = (uiDelay / 10);

  // Devide this by music volume...
  sNumVolumeSteps = (uiMusicVolume / sNumTimeSteps);

  // Set fade delay...
  SetMusicFadeSpeed(sNumVolumeSteps);
}

function DoneFadeOutDueToEndMusic(): void {
  // Quit game....
  InternalLeaveTacticalScreen(Enum26.MAINMENU_SCREEN);
  // SetPendingNewScreen( MAINMENU_SCREEN );
}
