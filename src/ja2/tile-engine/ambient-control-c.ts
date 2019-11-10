namespace ja2 {

export let gAmbData: AMBIENTDATA_STRUCT[] /* [MAX_AMBIENT_SOUNDS] */;
export let gsNumAmbData: INT16 = 0;

let gubCurrentSteadyStateAmbience: UINT8 = Enum301.SSA_NONE;
let gubCurrentSteadyStateSound: UINT8 = 0;
let guiCurrentSteadyStateSoundHandle: UINT32 = NO_SAMPLE;
let gSteadyStateAmbientTable: STEADY_STATE_AMBIENCE[] /* [NUM_STEADY_STATE_AMBIENCES] */ = [
  // NONE
  createSteadyStateAmbienceFrom([
    // DAY
    "",
    "",
    "",
    "",
    // NIGHT
    "",
    "",
    "",
    "",
  ]),

  // COUNTRYSIZE
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\insects Day 01.wav",
    "",
    "",
    "",
    // NIGHT
    "SOUNDS\\SSA\\night_crickets_01D.wav",
    "SOUNDS\\SSA\\night_crickets_01B.wav",
    "SOUNDS\\SSA\\night_crickets_01C.wav",
    "SOUNDS\\SSA\\night_crickets_01A.wav",
  ]),

  // NEAR WATER
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\swamp_day_01a.wav",
    "SOUNDS\\SSA\\swamp_day_01b.wav",
    "SOUNDS\\SSA\\swamp_day_01c.wav",
    "SOUNDS\\SSA\\swamp_day_01d.wav",
    // NIGHT
    "SOUNDS\\SSA\\marsh_at_night_01a.wav",
    "SOUNDS\\SSA\\marsh_at_night_01b.wav",
    "SOUNDS\\SSA\\marsh_at_night_01c.wav",
    "SOUNDS\\SSA\\marsh_at_night_01d.wav",
  ]),

  // INWATER
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\middle_of_water_01d.wav",
    "SOUNDS\\SSA\\middle_of_water_01c.wav",
    "SOUNDS\\SSA\\middle_of_water_01b.wav",
    "SOUNDS\\SSA\\middle_of_water_01a.wav",
    // night
    "SOUNDS\\SSA\\middle_of_water_01d.wav",
    "SOUNDS\\SSA\\middle_of_water_01c.wav",
    "SOUNDS\\SSA\\middle_of_water_01b.wav",
    "SOUNDS\\SSA\\middle_of_water_01a.wav",
  ]),

  // HEAVY FOREST
  createSteadyStateAmbienceFrom([
    // day
    "SOUNDS\\SSA\\JUNGLE_DAY_01a.wav",
    "SOUNDS\\SSA\\JUNGLE_DAY_01b.wav",
    "SOUNDS\\SSA\\JUNGLE_DAY_01c.wav",
    "SOUNDS\\SSA\\JUNGLE_DAY_01d.wav",
    // night
    "SOUNDS\\SSA\\night_crickets_03a.wav",
    "SOUNDS\\SSA\\night_crickets_03b.wav",
    "SOUNDS\\SSA\\night_crickets_03c.wav",
    "SOUNDS\\SSA\\night_crickets_03d.wav",
  ]),

  // PINE FOREST
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\pine_forest_01a.wav",
    "SOUNDS\\SSA\\pine_forest_01b.wav",
    "SOUNDS\\SSA\\pine_forest_01c.wav",
    "SOUNDS\\SSA\\pine_forest_01d.wav",
    // NIGHT
    "SOUNDS\\SSA\\night_crickets_02a.wav",
    "SOUNDS\\SSA\\night_crickets_02b.wav",
    "SOUNDS\\SSA\\night_crickets_02c.wav",
    "SOUNDS\\SSA\\night_crickets_02d.wav",
  ]),

  // ABANDANDED
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\metal_wind_01a.wav",
    "SOUNDS\\SSA\\metal_wind_01b.wav",
    "SOUNDS\\SSA\\metal_wind_01c.wav",
    "SOUNDS\\SSA\\metal_wind_01d.wav",
    // NIGHT
    "SOUNDS\\SSA\\night_insects_01a.wav",
    "SOUNDS\\SSA\\night_insects_01b.wav",
    "SOUNDS\\SSA\\night_insects_01c.wav",
    "SOUNDS\\SSA\\night_insects_01d.wav",
  ]),

  // AIRPORT
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\rotating radar dish.wav",
    "",
    "",
    "",
    // NIGHT
    "SOUNDS\\SSA\\rotating radar dish.wav",
    "",
    "",
    "",
  ]),

  // WASTE LAND
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\gentle_wind.wav",
    "",
    "",
    "",
    // NIGHT
    "SOUNDS\\SSA\\insects_at_night_04.wav",
    "",
    "",
    "",
  ]),

  // UNDERGROUND
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\low ominous ambience.wav",
    "",
    "",
    "",
    // NIGHT
    "SOUNDS\\SSA\\low ominous ambience.wav",
    "",
    "",
    "",
  ]),

  // OCEAN
  createSteadyStateAmbienceFrom([
    // DAY
    "SOUNDS\\SSA\\sea_01a.wav",
    "SOUNDS\\SSA\\sea_01b.wav",
    "SOUNDS\\SSA\\sea_01c.wav",
    "SOUNDS\\SSA\\sea_01d.wav",
    // NIGHT
    "SOUNDS\\SSA\\ocean_waves_01a.wav",
    "SOUNDS\\SSA\\ocean_waves_01b.wav",
    "SOUNDS\\SSA\\ocean_waves_01c.wav",
    "SOUNDS\\SSA\\ocean_waves_01d.wav",
  ]),
];

function LoadAmbientControlFile(ubAmbientID: UINT8): boolean {
  let zFilename: string /* SGPFILENAME */;
  let hFile: HWFILE;
  let cnt: INT32;

  // BUILD FILENAME
  zFilename = sprintf("AMBIENT\\%d.bad", ubAmbientID);

  // OPEN, LOAD
  hFile = FileOpen(zFilename, FILE_ACCESS_READ, false);
  if (!hFile) {
    return false;
  }

  // READ #
  if (!FileRead(hFile, addressof(gsNumAmbData), sizeof(INT16), null)) {
    return false;
  }

  // LOOP FOR OTHERS
  for (cnt = 0; cnt < gsNumAmbData; cnt++) {
    if (!FileRead(hFile, addressof(gAmbData[cnt]), sizeof(AMBIENTDATA_STRUCT), null)) {
      return false;
    }

    zFilename = sprintf("AMBIENT\\%s", gAmbData[cnt].zFilename);
    gAmbData[cnt].zFilename = zFilename;
  }

  FileClose(hFile);

  return true;
}

function GetAmbientDataPtr(ppAmbData: Pointer<Pointer<AMBIENTDATA_STRUCT>>, pusNumData: Pointer<UINT16>): void {
  ppAmbData.value = gAmbData;
  pusNumData.value = gsNumAmbData;
}

export function StopAmbients(): void {
  SoundStopAllRandom();
}

export function HandleNewSectorAmbience(ubAmbientID: UINT8): void {
  // OK, we could have just loaded a sector, erase all ambient sounds from queue, shutdown all ambient groupings
  SoundStopAllRandom();

  DeleteAllStrategicEventsOfType(Enum132.EVENT_AMBIENT);

  if (!gfBasement && !gfCaves) {
    if (LoadAmbientControlFile(ubAmbientID)) {
      // OK, load them up!
      BuildDayAmbientSounds();
    } else {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Cannot load Ambient data for tileset"));
    }
  }
}

export function DeleteAllAmbients(): void {
  // JA2Gold: it seems that ambient sounds don't get unloaded when we exit a sector!?
  SoundStopAllRandom();
  DeleteAllStrategicEventsOfType(Enum132.EVENT_AMBIENT);
}

export function SetupNewAmbientSound(uiAmbientID: UINT32): UINT32 {
  let rpParms: RANDOMPARMS;

  memset(addressof(rpParms), 0xff, sizeof(RANDOMPARMS));

  rpParms.uiTimeMin = gAmbData[uiAmbientID].uiMinTime;
  rpParms.uiTimeMax = gAmbData[uiAmbientID].uiMaxTime;
  rpParms.uiVolMin = CalculateSoundEffectsVolume(gAmbData[uiAmbientID].uiVol);
  rpParms.uiVolMax = CalculateSoundEffectsVolume(gAmbData[uiAmbientID].uiVol);
  rpParms.uiPriority = GROUP_AMBIENT;

  return SoundPlayRandom(gAmbData[uiAmbientID].zFilename, addressof(rpParms));
}

function StartSteadyStateAmbient(ubVolume: UINT32, ubLoops: UINT32): UINT32 {
  let spParms: SOUNDPARMS = createSoundParams();

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiVolume = CalculateSoundEffectsVolume(ubVolume);
  spParms.uiLoop = ubLoops;
  spParms.uiPriority = GROUP_AMBIENT;

  return SoundPlay(gSteadyStateAmbientTable[gubCurrentSteadyStateAmbience].zSoundNames[gubCurrentSteadyStateSound], addressof(spParms));
}

function SetSteadyStateAmbience(ubAmbience: UINT8): boolean {
  let fInNight: boolean = false;
  let cnt: INT32;
  let ubNumSounds: UINT8 = 0;
  let ubChosenSound: UINT8;

  // Stop all ambients...
  if (guiCurrentSteadyStateSoundHandle != NO_SAMPLE) {
    SoundStop(guiCurrentSteadyStateSoundHandle);
    guiCurrentSteadyStateSoundHandle = NO_SAMPLE;
  }

  // Determine what time of day we are in ( day/night)
  if (gubEnvLightValue >= LIGHT_DUSK_CUTOFF) {
    fInNight = true;
  }

  // loop through listing to get num sounds...
  for (cnt = (fInNight * 4); cnt < (NUM_SOUNDS_PER_TIMEFRAME / 2); cnt++) {
    if (gSteadyStateAmbientTable[ubAmbience].zSoundNames[cnt][0] == 0) {
      break;
    }

    ubNumSounds++;
  }

  if (ubNumSounds == 0) {
    return false;
  }

  // Pick one
  ubChosenSound = Random(ubNumSounds);

  // Set!
  gubCurrentSteadyStateAmbience = ubAmbience;
  gubCurrentSteadyStateSound = ubChosenSound;

  guiCurrentSteadyStateSoundHandle = StartSteadyStateAmbient(LOWVOLUME, 0);

  return true;
}

}
