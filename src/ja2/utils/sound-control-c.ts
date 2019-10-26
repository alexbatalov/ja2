// MODULE FOR SOUND SYSTEM

const SOUND_FAR_VOLUME_MOD = 25;

/*
UINT32 LOWVOLUME								START_LOWVOLUME;
UINT32 MIDVOLUME								START_MIDVOLUME;
UINT32 HIGHVOLUME								START_HIGHVOLUME;
*/

let guiSpeechVolume: UINT32 = MIDVOLUME;
let guiSoundEffectsVolume: UINT32 = MIDVOLUME;

let szSoundEffects: char[][] /* [NUM_SAMPLES][255] */ = [
  "SOUNDS\\RICOCHET 01.WAV",
  "SOUNDS\\RICOCHET 02.WAV",
  "SOUNDS\\RICOCHET 01.WAV",
  "SOUNDS\\RICOCHET 02.WAV",
  "SOUNDS\\RICOCHET 01.WAV",
  "SOUNDS\\RICOCHET 02.WAV",
  "SOUNDS\\RICOCHET 01.WAV",
  "SOUNDS\\RICOCHET 02.WAV",
  "SOUNDS\\DIRT IMPACT 01.WAV",
  "SOUNDS\\DIRT IMPACT 01.WAV",
  "SOUNDS\\KNIFE HIT GROUND.WAV",
  "SOUNDS\\FALL TO KNEES 01.WAV",
  "SOUNDS\\FALL TO KNEES 02.WAV",
  "SOUNDS\\KNEES TO DIRT 01.WAV",
  "SOUNDS\\KNEES TO DIRT 02.WAV",
  "SOUNDS\\KNEES TO DIRT 03.WAV",
  "SOUNDS\\HEAVY FALL 01.WAV",
  "SOUNDS\\BODY_SPLAT.WAV",
  "SOUNDS\\GLASS_BREAK1.WAV",
  "SOUNDS\\GLASS_BREAK2.WAV",

  "SOUNDS\\DOOR OPEN 01.WAV",
  "SOUNDS\\DOOR OPEN 02.WAV",
  "SOUNDS\\DOOR OPEN 03.WAV",
  "SOUNDS\\DOOR CLOSE 01.WAV",
  "SOUNDS\\DOOR CLOSE 02.WAV",
  "SOUNDS\\UNLOCK LOCK.WAV",
  "SOUNDS\\KICKIN LOCK.WAV",
  "SOUNDS\\BREAK LOCK.WAV",
  "SOUNDS\\PICKING LOCK.WAV",

  "SOUNDS\\GARAGE DOOR OPEN.WAV",
  "SOUNDS\\GARAGE DOOR CLOSE.WAV",
  "SOUNDS\\ELEVATOR DOOR OPEN.WAV",
  "SOUNDS\\ELEVATOR DOOR CLOSE.WAV",
  "SOUNDS\\HIGH TECH DOOR OPEN.WAV",
  "SOUNDS\\HIGH TECH DOOR CLOSE.WAV",
  "SOUNDS\\CURTAINS DOOR OPEN.WAV",
  "SOUNDS\\CURTAINS DOOR CLOSE.WAV",
  "SOUNDS\\METAL DOOR OPEN.WAV",
  "SOUNDS\\METAL DOOR CLOSE.WAV",

  "SOUNDS\\ftp gravel 01.WAV",
  "SOUNDS\\ftp gravel 02.WAV",
  "SOUNDS\\ftp gravel 03.WAV",
  "SOUNDS\\ftp gravel 04.WAV",
  "SOUNDS\\ftp gritty 01.WAV",
  "SOUNDS\\ftp gritty 02.WAV",
  "SOUNDS\\ftp gritty 03.WAV",
  "SOUNDS\\ftp gritty 04.WAV",
  "SOUNDS\\ftp leaves 01.WAV",
  "SOUNDS\\ftp leaves 02.WAV",
  "SOUNDS\\ftp leaves 03.WAV",
  "SOUNDS\\ftp leaves 04.WAV",

  "SOUNDS\\CRAWLING 01.WAV",
  "SOUNDS\\CRAWLING 02.WAV",
  "SOUNDS\\CRAWLING 03.WAV",
  "SOUNDS\\CRAWLING 04.WAV",
  "SOUNDS\\BEEP2.WAV",
  "SOUNDS\\ENDTURN.WAV",
  "SOUNDS\\JA2 DEATH HIT.WAV",
  "SOUNDS\\DOORCR_B.WAV",
  "SOUNDS\\HEAD EXPLODING 01.WAV",
  "SOUNDS\\BODY EXPLODING.WAV",
  "SOUNDS\\EXPLODE1.WAV",
  "SOUNDS\\CROW EXPLODING.WAV",
  "SOUNDS\\SMALL EXPLOSION 01.WAV",

  "SOUNDS\\HELI1.WAV",
  "SOUNDS\\BULLET IMPACT 01.WAV",
  "SOUNDS\\BULLET IMPACT 02.WAV",
  "SOUNDS\\BULLET IMPACT 02.WAV",

  "STSOUNDS\\BLAH.WAV", // CREATURE ATTACK

  "SOUNDS\\STEP INTO WATER.WAV",
  "SOUNDS\\SPLASH FROM SHALLOW TO DEEP.WAV",

  "SOUNDS\\COW HIT.WAV", // COW HIT
  "SOUNDS\\COW DIE.WAV", // COW DIE

  // THREE COMPUTER VOICE SOUNDS FOR RG
  "SOUNDS\\LINE 02 FX.WAV",
  "SOUNDS\\LINE 01 FX.WAV",
  "SOUNDS\\LINE 03 FX.WAV",

  "SOUNDS\\CAVE COLLAPSING.WAV", // CAVE_COLLAPSE

  "SOUNDS\\RAID WHISTLE.WAV", // RAID
  "SOUNDS\\RAID AMBIENT.WAV",
  "SOUNDS\\RAID DIVE.WAV",
  "SOUNDS\\RAID DIVE.WAV",
  "SOUNDS\\RAID WHISTLE.WAV", // RAID

  // VEHICLES
  "SOUNDS\\DRIVING 01.WAV", // DRIVING
  "SOUNDS\\ENGINE START.WAV", // ON
  "SOUNDS\\ENGINE OFF.WAV", // OFF
  "SOUNDS\\INTO VEHICLE.WAV", // INTO

  "SOUNDS\\WEAPONS\\DRY FIRE 1.WAV", // Dry fire sound ( for gun jam )

  // IMPACTS
  "SOUNDS\\WOOD IMPACT 01A.WAV", // S_WOOD_IMPACT1
  "SOUNDS\\WOOD IMPACT 01B.WAV",
  "SOUNDS\\WOOD IMPACT 01A.WAV",
  "SOUNDS\\PORCELAIN IMPACT.WAV",
  "SOUNDS\\TIRE IMPACT 01.WAV",
  "SOUNDS\\STONE IMPACT 01.WAV",
  "SOUNDS\\WATER IMPACT 01.WAV",
  "SOUNDS\\VEG IMPACT 01.WAV",
  "SOUNDS\\METAL HIT 01.WAV", // S_METAL_HIT1
  "SOUNDS\\METAL HIT 01.WAV",
  "SOUNDS\\METAL HIT 01.WAV",

  "SOUNDS\\SLAP_IMPACT.WAV",

  // FIREARM RELOAD
  "SOUNDS\\WEAPONS\\REVOLVER RELOAD.WAV", // REVOLVER
  "SOUNDS\\WEAPONS\\PISTOL RELOAD.WAV", // PISTOL
  "SOUNDS\\WEAPONS\\SMG RELOAD.WAV", // SMG
  "SOUNDS\\WEAPONS\\RIFLE RELOAD.WAV", // RIFLE
  "SOUNDS\\WEAPONS\\SHOTGUN RELOAD.WAV", // SHOTGUN
  "SOUNDS\\WEAPONS\\LMG RELOAD.WAV", // LMG

  // FIREARM LOCKNLOAD
  "SOUNDS\\WEAPONS\\REVOLVER LNL.WAV", // REVOLVER
  "SOUNDS\\WEAPONS\\PISTOL LNL.WAV", // PISTOL
  "SOUNDS\\WEAPONS\\SMG LNL.WAV", // SMG
  "SOUNDS\\WEAPONS\\RIFLE LNL.WAV", // RIFLE
  "SOUNDS\\WEAPONS\\SHOTGUN LNL.WAV", // SHOTGUN
  "SOUNDS\\WEAPONS\\LMG LNL.WAV", // LMG

  // ROCKET LAUCNHER
  "SOUNDS\\WEAPONS\\SMALL ROCKET LAUNCHER.WAV", // SMALL ROCKET LUANCHER
  "SOUNDS\\WEAPONS\\MORTAR FIRE 01.WAV", // GRENADE LAUNCHER
  "SOUNDS\\WEAPONS\\MORTAR FIRE 01.WAV", // UNDERSLUNG GRENADE LAUNCHER
  "SOUNDS\\WEAPONS\\ROCKET LAUNCHER.WAV",
  "SOUNDS\\WEAPONS\\MORTAR FIRE 01.WAV",

  // FIREARMS
  "SOUNDS\\WEAPONS\\9mm SINGLE SHOT.WAV", //	S_GLOCK17				9mm
  "SOUNDS\\WEAPONS\\9mm SINGLE SHOT.WAV", //	S_GLOCK18				9mm
  "SOUNDS\\WEAPONS\\9mm SINGLE SHOT.WAV", //	S_BERETTA92			9mm
  "SOUNDS\\WEAPONS\\9mm SINGLE SHOT.WAV", //	S_BERETTA93			9mm
  "SOUNDS\\WEAPONS\\38 CALIBER.WAV", //	S_SWSPECIAL			.38
  "SOUNDS\\WEAPONS\\357 SINGLE SHOT.WAV", //	S_BARRACUDA			.357
  "SOUNDS\\WEAPONS\\357 SINGLE SHOT.WAV", //	S_DESERTEAGLE		.357
  "SOUNDS\\WEAPONS\\45 CALIBER SINGLE SHOT.WAV", //	S_M1911					.45
  "SOUNDS\\WEAPONS\\9mm SINGLE SHOT.WAV", //	S_MP5K					9mm
  "SOUNDS\\WEAPONS\\45 CALIBER SINGLE SHOT.WAV", //	S_MAC10					.45
  "SOUNDS\\WEAPONS\\45 CALIBER SINGLE SHOT.WAV", //	S_THOMPSON			.45
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_COMMANDO			5.56
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_MP53					5.56?
  "SOUNDS\\WEAPONS\\5,45 SINGLE SHOT.WAV", //	S_AKSU74				5.45
  "SOUNDS\\WEAPONS\\5,7 SINGLE SHOT.WAV", //	S_P90						5.7
  "SOUNDS\\WEAPONS\\7,62 WP SINGLE SHOT.WAV", //	S_TYPE85				7.62 WP
  "SOUNDS\\WEAPONS\\7,62 WP SINGLE SHOT.WAV", //	S_SKS						7.62 WP
  "SOUNDS\\WEAPONS\\7,62 WP SINGLE SHOT.WAV", //	S_DRAGUNOV			7.62 WP
  "SOUNDS\\WEAPONS\\7,62 NATO SINGLE SHOT.WAV", //	S_M24						7.62 NATO
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_AUG						5.56mm
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_G41						5.56mm
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_RUGERMINI			5.56mm
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_C7						5.56mm
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_FAMAS					5.56mm
  "SOUNDS\\WEAPONS\\5,45 SINGLE SHOT.WAV", //	S_AK74					5.45mm
  "SOUNDS\\WEAPONS\\7,62 WP SINGLE SHOT.WAV", //	S_AKM						7.62mm WP
  "SOUNDS\\WEAPONS\\7,62 NATO SINGLE SHOT.WAV", //	S_M14						7.62mm NATO
  "SOUNDS\\WEAPONS\\7,62 NATO SINGLE SHOT.WAV", //	S_FNFAL					7.62mm NATO
  "SOUNDS\\WEAPONS\\7,62 NATO SINGLE SHOT.WAV", //	S_G3A3					7.62mm NATO
  "SOUNDS\\WEAPONS\\4,7 SINGLE SHOT.WAV", //	S_G11						4.7mm
  "SOUNDS\\WEAPONS\\SHOTGUN SINGLE SHOT.WAV", //	S_M870					SHOTGUN
  "SOUNDS\\WEAPONS\\SHOTGUN SINGLE SHOT.WAV", //	S_SPAS					SHOTGUN
  "SOUNDS\\WEAPONS\\SHOTGUN SINGLE SHOT.WAV", //	S_CAWS					SHOTGUN
  "SOUNDS\\WEAPONS\\5,56 SINGLE SHOT.WAV", //	S_FNMINI				5.56mm
  "SOUNDS\\WEAPONS\\5,45 SINGLE SHOT.WAV", //	S_RPK74					5.45mm
  "SOUNDS\\WEAPONS\\7,62 WP SINGLE SHOT.WAV", //	S_21E						7.62mm
  "SOUNDS\\WEAPONS\\KNIFE THROW SWOOSH.WAV", //	KNIFE THROW
  "SOUNDS\\WEAPONS\\TANK_CANNON.WAV",
  "SOUNDS\\WEAPONS\\BURSTTYPE1.WAV",
  "SOUNDS\\WEAPONS\\AUTOMAG SINGLE.WAV",

  "SOUNDS\\WEAPONS\\SILENCER 02.WAV",
  "SOUNDS\\WEAPONS\\SILENCER 03.WAV",

  "SOUNDS\\SWOOSH 01.WAV",
  "SOUNDS\\SWOOSH 03.WAV",
  "SOUNDS\\SWOOSH 05.WAV",
  "SOUNDS\\SWOOSH 06.WAV",
  "SOUNDS\\SWOOSH 11.WAV",
  "SOUNDS\\SWOOSH 14.WAV",

  // CREATURE_SOUNDS
  "SOUNDS\\ADULT FALL 01.WAV",
  "SOUNDS\\ADULT STEP 01.WAV",
  "SOUNDS\\ADULT STEP 02.WAV",
  "SOUNDS\\ADULT SWIPE 01.WAV",
  "SOUNDS\\Eating_Flesh 01.WAV",
  "SOUNDS\\ADULT CRIPPLED.WAV",
  "SOUNDS\\ADULT DYING PART 1.WAV",
  "SOUNDS\\ADULT DYING PART 2.WAV",
  "SOUNDS\\ADULT LUNGE 01.WAV",
  "SOUNDS\\ADULT SMELLS THREAT.WAV",
  "SOUNDS\\ADULT SMELLS PREY.WAV",
  "SOUNDS\\ADULT SPIT.WAV",

  // BABY
  "SOUNDS\\BABY DYING 01.WAV",
  "SOUNDS\\BABY DRAGGING 01.WAV",
  "SOUNDS\\BABY SHRIEK 01.WAV",
  "SOUNDS\\BABY SPITTING 01.WAV",

  // LARVAE
  "SOUNDS\\LARVAE MOVEMENT 01.WAV",
  "SOUNDS\\LARVAE RUPTURE 01.WAV",

  // QUEEN
  "SOUNDS\\QUEEN SHRIEK 01.WAV",
  "SOUNDS\\QUEEN DYING 01.WAV",
  "SOUNDS\\QUEEN ENRAGED ATTACK.WAV",
  "SOUNDS\\QUEEN RUPTURING.WAV",
  "SOUNDS\\QUEEN CRIPPLED.WAV",
  "SOUNDS\\QUEEN SMELLS THREAT.WAV",
  "SOUNDS\\QUEEN WHIP ATTACK.WAV",

  "SOUNDS\\ROCK HIT 01.WAV",
  "SOUNDS\\ROCK HIT 02.WAV",

  "SOUNDS\\SCRATCH.WAV",
  "SOUNDS\\ARMPIT.WAV",
  "SOUNDS\\CRACKING BACK.WAV",

  "SOUNDS\\WEAPONS\\Auto Resolve Composite 02 (8-22).wav", //  The FF sound in autoresolve interface

  "SOUNDS\\Email Alert 01.wav",
  "SOUNDS\\Entering Text 02.wav",
  "SOUNDS\\Removing Text 02.wav",
  "SOUNDS\\Computer Beep 01 In.wav",
  "SOUNDS\\Computer Beep 01 Out.wav",
  "SOUNDS\\Computer Switch 01 In.wav",
  "SOUNDS\\Computer Switch 01 Out.wav",
  "SOUNDS\\Very Small Switch 01 In.wav",
  "SOUNDS\\Very Small Switch 01 Out.wav",
  "SOUNDS\\Very Small Switch 02 In.wav",
  "SOUNDS\\Very Small Switch 02 Out.wav",
  "SOUNDS\\Small Switch 01 In.wav",
  "SOUNDS\\Small Switch 01 Out.wav",
  "SOUNDS\\Small Switch 02 In.wav",
  "SOUNDS\\Small Switch 02 Out.wav",
  "SOUNDS\\Small Switch 03 In.wav",
  "SOUNDS\\Small Switch 03 Out.wav",
  "SOUNDS\\Big Switch 03 In.wav",
  "SOUNDS\\Big Switch 03 Out.wav",
  "SOUNDS\\Alarm.wav",
  "SOUNDS\\Fight Bell.wav",
  "SOUNDS\\Helicopter Crash Sequence.wav",
  "SOUNDS\\Attachment.wav",
  "SOUNDS\\Ceramic Armour Insert.wav",
  "SOUNDS\\Detonator Beep.wav",
  "SOUNDS\\Grab Roof.wav",
  "SOUNDS\\Land On Roof.wav",
  "SOUNDS\\Branch Snap 01.wav",
  "SOUNDS\\Branch Snap 02.wav",
  "SOUNDS\\Indoor Bump 01.wav",

  "SOUNDS\\Fridge Door Open.wav",
  "SOUNDS\\Fridge Door Close.wav",

  "SOUNDS\\Fire 03 Loop.wav",
  "SOUNDS\\GLASS_CRACK.wav",
  "SOUNDS\\SPIT RICOCHET.WAV",
  "SOUNDS\\TIGER HIT.WAV",
  "SOUNDS\\bloodcat dying 02.WAV",
  "SOUNDS\\SLAP.WAV",
  "SOUNDS\\ROBOT BEEP.WAV",
  "SOUNDS\\ELECTRICITY.WAV",
  "SOUNDS\\SWIMMING 01.WAV",
  "SOUNDS\\SWIMMING 02.WAV",
  "SOUNDS\\KEY FAILURE.WAV",
  "SOUNDS\\target cursor.WAV",
  "SOUNDS\\statue open.WAV",
  "SOUNDS\\remote activate.WAV",
  "SOUNDS\\wirecutters.WAV",
  "SOUNDS\\drink from canteen.WAV",
  "SOUNDS\\bloodcat attack.wav",
  "SOUNDS\\bloodcat loud roar.wav",
  "SOUNDS\\robot greeting.wav",
  "SOUNDS\\robot death.wav",
  "SOUNDS\\gas grenade explode.WAV",
  "SOUNDS\\air escaping.WAV",
  "SOUNDS\\drawer open.WAV",
  "SOUNDS\\drawer close.WAV",
  "SOUNDS\\locker door open.WAV",
  "SOUNDS\\locker door close.WAV",
  "SOUNDS\\wooden box open.WAV",
  "SOUNDS\\wooden box close.WAV",
  "SOUNDS\\robot stop moving.WAV",
  "SOUNDS\\water movement 01.wav",
  "SOUNDS\\water movement 02.wav",
  "SOUNDS\\water movement 03.wav",
  "SOUNDS\\water movement 04.wav",
  "SOUNDS\\PRONE TO CROUCH.WAV",
  "SOUNDS\\CROUCH TO PRONE.WAV",
  "SOUNDS\\CROUCH TO STAND.WAV",
  "SOUNDS\\STAND TO CROUCH.WAV",
  "SOUNDS\\picking something up.WAV",
  "SOUNDS\\cow falling.wav",
  "SOUNDS\\bloodcat_growl_01.wav",
  "SOUNDS\\bloodcat_growl_02.wav",
  "SOUNDS\\bloodcat_growl_03.wav",
  "SOUNDS\\bloodcat_growl_04.wav",
  "SOUNDS\\spit ricochet.wav",
  "SOUNDS\\ADULT crippled.WAV",
  "SOUNDS\\death disintegration.wav",
  "SOUNDS\\Queen Ambience.wav",
  "SOUNDS\\Alien Impact.wav",
  "SOUNDS\\crow pecking flesh 01.wav",
  "SOUNDS\\crow fly.wav",
  "SOUNDS\\slap 02.wav",
  "SOUNDS\\setting up mortar.wav",
  "SOUNDS\\mortar whistle.wav",
  "SOUNDS\\load mortar.wav",
  "SOUNDS\\tank turret a.wav",
  "SOUNDS\\tank turret b.wav",
  "SOUNDS\\cow falling b.wav",
  "SOUNDS\\stab into flesh.wav",
  "SOUNDS\\explosion 10.wav",
  "SOUNDS\\explosion 12.wav",
  "SOUNDS\\drink from canteen male.WAV",
  "SOUNDS\\x ray activated.WAV",
  "SOUNDS\\catch object.wav",
  "SOUNDS\\fence open.wav",
];

let szAmbientEffects: char[][] /* [NUM_AMBIENTS][255] */ = [
  "SOUNDS\\storm1.wav",
  "SOUNDS\\storm2.wav",
  "SOUNDS\\rain_loop_22k.wav",
  "SOUNDS\\bird1-22k.wav",
  "SOUNDS\\bird3-22k.wav",
  "SOUNDS\\crickety_loop.wav",
  "SOUNDS\\crickety_loop2.wav",
  "SOUNDS\\cricket1.wav",
  "SOUNDS\\cricket2.wav",
  "SOUNDS\\owl1.wav",
  "SOUNDS\\owl2.wav",
  "SOUNDS\\owl3.wav",
  "SOUNDS\\night_bird1.wav",
  "SOUNDS\\night_bird3.wav",
];

let AmbientVols: UINT8[] /* [NUM_AMBIENTS] */ = [
  25, // lightning 1
  25, // lightning 2
  10, // rain 1
  25, // bird 1
  25, // bird 2
  10, // crickets 1
  10, // crickets 2
  25, // cricket 1
  25, // cricket 2
  25, // owl 1
  25, // owl 2
  25, // owl 3
  25, // night bird 1
  25, // night bird 2
];

let gDelayedSoundParms: SOUNDPARMS;
let guiDelayedSoundNum: UINT32;

export function InitJA2Sound(): boolean {
  // UINT32 uiCount;

  // for(uiCount=0; uiCount < NUM_SAMPLES; uiCount++)
  //{
  //	SoundLoadSample(szSoundEffects[uiCount]);
  //	SoundLockSample(szSoundEffects[uiCount]);
  //}
  return true;
}

export function ShutdownJA2Sound(): boolean {
  // UINT32 uiCount;

  SoundStopAll();

  // for(uiCount=0; uiCount < NUM_SAMPLES; uiCount++)
  //{
  //	SoundUnlockSample(szSoundEffects[uiCount]);
  //	SoundFreeSample(szSoundEffects[uiCount]);
  //}

  return true;
}

export function PlayJA2Sample(usNum: UINT32, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): UINT32 {
  let spParms: SOUNDPARMS;

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiSpeed = usRate;
  spParms.uiVolume = CalculateSoundEffectsVolume(ubVolume);
  spParms.uiLoop = ubLoops;
  spParms.uiPan = uiPan;
  spParms.uiPriority = GROUP_PLAYER;

  return SoundPlay(szSoundEffects[usNum], addressof(spParms));
}

export function PlayJA2StreamingSample(usNum: UINT32, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): UINT32 {
  let spParms: SOUNDPARMS;

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiSpeed = usRate;
  spParms.uiVolume = CalculateSoundEffectsVolume(ubVolume);
  spParms.uiLoop = ubLoops;
  spParms.uiPan = uiPan;
  spParms.uiPriority = GROUP_PLAYER;

  return SoundPlayStreamedFile(szSoundEffects[usNum], addressof(spParms));
}

export function PlayJA2SampleFromFile(szFileName: STR8, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): UINT32 {
  // does the same thing as PlayJA2Sound, but one only has to pass the filename, not the index of the sound array

  let spParms: SOUNDPARMS;

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiSpeed = usRate;
  spParms.uiVolume = CalculateSoundEffectsVolume(ubVolume);
  spParms.uiLoop = ubLoops;
  spParms.uiPan = uiPan;
  spParms.uiPriority = GROUP_PLAYER;

  return SoundPlay(szFileName, addressof(spParms));
}

export function PlayJA2StreamingSampleFromFile(szFileName: STR8, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32, EndsCallback: SOUND_STOP_CALLBACK): UINT32 {
  // does the same thing as PlayJA2Sound, but one only has to pass the filename, not the index of the sound array

  let spParms: SOUNDPARMS;

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiSpeed = usRate;
  spParms.uiVolume = CalculateSoundEffectsVolume(ubVolume);
  spParms.uiLoop = ubLoops;
  spParms.uiPan = uiPan;
  spParms.uiPriority = GROUP_PLAYER;
  spParms.EOSCallback = EndsCallback;

  return SoundPlayStreamedFile(szFileName, addressof(spParms));
}

export function PlayJA2Ambient(usNum: UINT32, ubVolume: UINT32, ubLoops: UINT32): UINT32 {
  let spParms: SOUNDPARMS;

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiVolume = CalculateSoundEffectsVolume(ubVolume);
  spParms.uiLoop = ubLoops;
  spParms.uiPriority = GROUP_AMBIENT;

  return SoundPlay(szAmbientEffects[usNum], addressof(spParms));
}

function PlayJA2AmbientRandom(usNum: UINT32, uiTimeMin: UINT32, uiTimeMax: UINT32): UINT32 {
  let rpParms: RANDOMPARMS;

  memset(addressof(rpParms), 0xff, sizeof(RANDOMPARMS));

  rpParms.uiTimeMin = uiTimeMin;
  rpParms.uiTimeMax = uiTimeMax;
  rpParms.uiVolMin = CalculateSoundEffectsVolume(AmbientVols[usNum]);
  rpParms.uiVolMax = CalculateSoundEffectsVolume(AmbientVols[usNum]);
  rpParms.uiPriority = GROUP_AMBIENT;

  return SoundPlayRandom(szAmbientEffects[usNum], addressof(rpParms));
}

export function PlaySoldierJA2Sample(usID: UINT16, usNum: UINT32, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32, fCheck: boolean): UINT32 {
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // CHECK IF GUY IS ON SCREEN BEFORE PLAYING!
    if ((MercPtrs[usID].value.bVisible != -1) || !fCheck) {
      return PlayJA2Sample(usNum, usRate, CalculateSoundEffectsVolume(ubVolume), ubLoops, uiPan);
    }
  }

  return 0;
}

export function SetSpeechVolume(uiNewVolume: UINT32): void {
  guiSpeechVolume = Math.min(uiNewVolume, 127);
}

export function GetSpeechVolume(): UINT32 {
  return guiSpeechVolume;
}

export function SetSoundEffectsVolume(uiNewVolume: UINT32): void {
  guiSoundEffectsVolume = Math.min(uiNewVolume, 127);
}

export function GetSoundEffectsVolume(): UINT32 {
  return guiSoundEffectsVolume;
}

export function CalculateSpeechVolume(uiVolume: UINT32): UINT32 {
  return ((uiVolume / HIGHVOLUME) * guiSpeechVolume + .5);
}

export function CalculateSoundEffectsVolume(uiVolume: UINT32): UINT32 {
  return ((uiVolume / HIGHVOLUME) * guiSoundEffectsVolume + .5);
}

export function SoundDir(sGridNo: INT16): INT8 {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sMiddleX: INT16;
  let sDif: INT16;
  let sAbsDif: INT16;

  if (sGridNo == NOWHERE) {
    return MIDDLEPAN;
  }

  // OK, get screen position of gridno.....
  ConvertGridNoToXY(sGridNo, addressof(sWorldX), addressof(sWorldY));

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY((sWorldX), (sWorldY), addressof(sScreenX), addressof(sScreenY));

  // Get middle of where we are now....
  sMiddleX = gsTopLeftWorldX + (gsBottomRightWorldX - gsTopLeftWorldX) / 2;

  sDif = sMiddleX - sScreenX;

  if ((sAbsDif = Math.abs(sDif)) > 64) {
    // OK, NOT the middle.

    // Is it outside the screen?
    if (sAbsDif > ((gsBottomRightWorldX - gsTopLeftWorldX) / 2)) {
      // yes, outside...
      if (sDif > 0) {
        // return( FARLEFT );
        return 1;
      } else
        // return( FARRIGHT );
        return 126;
    } else // inside screen
    {
      if (sDif > 0)
        return LEFTSIDE;
      else
        return RIGHTSIDE;
    }
  } else // hardly any difference, so sound should be played from middle
    return MIDDLE;
}

export function SoundVolume(bInitialVolume: INT8, sGridNo: INT16): INT8 {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sMiddleX: INT16;
  let sMiddleY: INT16;
  let sDifX: INT16;
  let sAbsDifX: INT16;
  let sDifY: INT16;
  let sAbsDifY: INT16;

  if (sGridNo == NOWHERE) {
    return bInitialVolume;
  }

  // OK, get screen position of gridno.....
  ConvertGridNoToXY(sGridNo, addressof(sWorldX), addressof(sWorldY));

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY((sWorldX), (sWorldY), addressof(sScreenX), addressof(sScreenY));

  // Get middle of where we are now....
  sMiddleX = gsTopLeftWorldX + (gsBottomRightWorldX - gsTopLeftWorldX) / 2;
  sMiddleY = gsTopLeftWorldY + (gsBottomRightWorldY - gsTopLeftWorldY) / 2;

  sDifX = sMiddleX - sScreenX;
  sDifY = sMiddleY - sScreenY;

  sAbsDifX = Math.abs(sDifX);
  sAbsDifY = Math.abs(sDifY);

  if (sAbsDifX > 64 || sAbsDifY > 64) {
    // OK, NOT the middle.

    // Is it outside the screen?
    if (sAbsDifX > ((gsBottomRightWorldX - gsTopLeftWorldX) / 2) || sAbsDifY > ((gsBottomRightWorldY - gsTopLeftWorldY) / 2)) {
      return Math.max(LOWVOLUME, (bInitialVolume - SOUND_FAR_VOLUME_MOD));
    }
  }

  return bInitialVolume;
}

function PlayDelayedJA2Sample(uiDelay: UINT32, usNum: UINT32, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): void {
  memset(addressof(gDelayedSoundParms), 0xff, sizeof(SOUNDPARMS));

  gDelayedSoundParms.uiSpeed = usRate;
  gDelayedSoundParms.uiVolume = CalculateSoundEffectsVolume(ubVolume);
  gDelayedSoundParms.uiLoop = ubLoops;
  gDelayedSoundParms.uiPan = uiPan;
  gDelayedSoundParms.uiPriority = GROUP_PLAYER;

  guiDelayedSoundNum = usNum;

  // return(SoundPlay(szSoundEffects[usNum], &spParms));

  // Setup multipurpose timer....
  SetCustomizableTimerCallbackAndDelay(uiDelay, DelayedSoundTimerCallback, false);
}

function DelayedSoundTimerCallback(): void {
  SoundPlay(szSoundEffects[guiDelayedSoundNum], addressof(gDelayedSoundParms));
}

/////////////////////////////////////////////////////////
/////////
/////////
/////////////////////////////////////////////////////////
// Positional Ambients
/////////////////////////////////////////////////////////
const NUM_POSITION_SOUND_EFFECT_SLOTS = 10;

interface POSITIONSND {
  uiFlags: UINT32;
  sGridNo: INT16;
  iSoundSampleID: INT32;
  iSoundToPlay: INT32;
  uiData: UINT32;
  fAllocated: boolean;
  fInActive: boolean;
}

// GLOBAL FOR SMOKE LISTING
let gPositionSndData: POSITIONSND[] /* [NUM_POSITION_SOUND_EFFECT_SLOTS] */;
let guiNumPositionSnds: UINT32 = 0;
let gfPositionSoundsActive: boolean = false;

function GetFreePositionSnd(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumPositionSnds; uiCount++) {
    if ((gPositionSndData[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumPositionSnds < NUM_POSITION_SOUND_EFFECT_SLOTS)
    return guiNumPositionSnds++;

  return -1;
}

function RecountPositionSnds(): void {
  let uiCount: INT32;

  for (uiCount = guiNumPositionSnds - 1; (uiCount >= 0); uiCount--) {
    if ((gPositionSndData[uiCount].fAllocated)) {
      guiNumPositionSnds = (uiCount + 1);
      break;
    }
  }
}

export function NewPositionSnd(sGridNo: INT16, uiFlags: UINT32, uiData: UINT32, iSoundToPlay: UINT32): INT32 {
  let pPositionSnd: Pointer<POSITIONSND>;
  let iPositionSndIndex: INT32;

  if ((iPositionSndIndex = GetFreePositionSnd()) == (-1))
    return -1;

  memset(addressof(gPositionSndData[iPositionSndIndex]), 0, sizeof(POSITIONSND));

  pPositionSnd = addressof(gPositionSndData[iPositionSndIndex]);

  // Default to inactive

  if (gfPositionSoundsActive) {
    pPositionSnd.value.fInActive = false;
  } else {
    pPositionSnd.value.fInActive = true;
  }

  pPositionSnd.value.sGridNo = sGridNo;
  pPositionSnd.value.uiData = uiData;
  pPositionSnd.value.uiFlags = uiFlags;
  pPositionSnd.value.fAllocated = true;
  pPositionSnd.value.iSoundToPlay = iSoundToPlay;

  pPositionSnd.value.iSoundSampleID = NO_SAMPLE;

  return iPositionSndIndex;
}

export function DeletePositionSnd(iPositionSndIndex: INT32): void {
  let pPositionSnd: Pointer<POSITIONSND>;

  pPositionSnd = addressof(gPositionSndData[iPositionSndIndex]);

  if (pPositionSnd.value.fAllocated) {
    // Turn inactive first...
    pPositionSnd.value.fInActive = true;

    // End sound...
    if (pPositionSnd.value.iSoundSampleID != NO_SAMPLE) {
      SoundStop(pPositionSnd.value.iSoundSampleID);
    }

    pPositionSnd.value.fAllocated = false;

    RecountPositionSnds();
  }
}

export function SetPositionSndGridNo(iPositionSndIndex: INT32, sGridNo: INT16): void {
  let pPositionSnd: Pointer<POSITIONSND>;

  pPositionSnd = addressof(gPositionSndData[iPositionSndIndex]);

  if (pPositionSnd.value.fAllocated) {
    pPositionSnd.value.sGridNo = sGridNo;

    SetPositionSndsVolumeAndPanning();
  }
}

export function SetPositionSndsActive(): void {
  let cnt: UINT32;
  let pPositionSnd: Pointer<POSITIONSND>;

  gfPositionSoundsActive = true;

  for (cnt = 0; cnt < guiNumPositionSnds; cnt++) {
    pPositionSnd = addressof(gPositionSndData[cnt]);

    if (pPositionSnd.value.fAllocated) {
      if (pPositionSnd.value.fInActive) {
        pPositionSnd.value.fInActive = false;

        // Begin sound effect
        // Volume 0
        pPositionSnd.value.iSoundSampleID = PlayJA2Sample(pPositionSnd.value.iSoundToPlay, RATE_11025, 0, 0, MIDDLEPAN);
      }
    }
  }
}

export function SetPositionSndsInActive(): void {
  let cnt: UINT32;
  let pPositionSnd: Pointer<POSITIONSND>;

  gfPositionSoundsActive = false;

  for (cnt = 0; cnt < guiNumPositionSnds; cnt++) {
    pPositionSnd = addressof(gPositionSndData[cnt]);

    if (pPositionSnd.value.fAllocated) {
      pPositionSnd.value.fInActive = true;

      // End sound...
      if (pPositionSnd.value.iSoundSampleID != NO_SAMPLE) {
        SoundStop(pPositionSnd.value.iSoundSampleID);
        pPositionSnd.value.iSoundSampleID = NO_SAMPLE;
      }
    }
  }
}

function PositionSoundDir(sGridNo: INT16): INT8 {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sMiddleX: INT16;
  let sDif: INT16;
  let sAbsDif: INT16;

  if (sGridNo == NOWHERE) {
    return MIDDLEPAN;
  }

  // OK, get screen position of gridno.....
  ConvertGridNoToXY(sGridNo, addressof(sWorldX), addressof(sWorldY));

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY((sWorldX), (sWorldY), addressof(sScreenX), addressof(sScreenY));

  // Get middle of where we are now....
  sMiddleX = gsTopLeftWorldX + (gsBottomRightWorldX - gsTopLeftWorldX) / 2;

  sDif = sMiddleX - sScreenX;

  if ((sAbsDif = Math.abs(sDif)) > 64) {
    // OK, NOT the middle.

    // Is it outside the screen?
    if (sAbsDif > ((gsBottomRightWorldX - gsTopLeftWorldX) / 2)) {
      // yes, outside...
      if (sDif > 0) {
        // return( FARLEFT );
        return 1;
      } else
        // return( FARRIGHT );
        return 126;
    } else // inside screen
    {
      if (sDif > 0)
        return LEFTSIDE;
      else
        return RIGHTSIDE;
    }
  } else // hardly any difference, so sound should be played from middle
    return MIDDLE;
}

function PositionSoundVolume(bInitialVolume: INT8, sGridNo: INT16): INT8 {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sMiddleX: INT16;
  let sMiddleY: INT16;
  let sDifX: INT16;
  let sAbsDifX: INT16;
  let sDifY: INT16;
  let sAbsDifY: INT16;
  let sMaxDistX: INT16;
  let sMaxDistY: INT16;
  let sMaxSoundDist: double;
  let sSoundDist: double;

  if (sGridNo == NOWHERE) {
    return bInitialVolume;
  }

  // OK, get screen position of gridno.....
  ConvertGridNoToXY(sGridNo, addressof(sWorldX), addressof(sWorldY));

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY((sWorldX), (sWorldY), addressof(sScreenX), addressof(sScreenY));

  // Get middle of where we are now....
  sMiddleX = gsTopLeftWorldX + (gsBottomRightWorldX - gsTopLeftWorldX) / 2;
  sMiddleY = gsTopLeftWorldY + (gsBottomRightWorldY - gsTopLeftWorldY) / 2;

  sDifX = sMiddleX - sScreenX;
  sDifY = sMiddleY - sScreenY;

  sAbsDifX = Math.abs(sDifX);
  sAbsDifY = Math.abs(sDifY);

  sMaxDistX = ((gsBottomRightWorldX - gsTopLeftWorldX) * 1.5);
  sMaxDistY = ((gsBottomRightWorldY - gsTopLeftWorldY) * 1.5);

  sMaxSoundDist = Math.sqrt((sMaxDistX * sMaxDistX) + (sMaxDistY * sMaxDistY));
  sSoundDist = Math.sqrt((sAbsDifX * sAbsDifX) + (sAbsDifY * sAbsDifY));

  if (sSoundDist == 0) {
    return bInitialVolume;
  }

  if (sSoundDist > sMaxSoundDist) {
    sSoundDist = sMaxSoundDist;
  }

  // Scale
  return (bInitialVolume * ((sMaxSoundDist - sSoundDist) / sMaxSoundDist));
}

export function SetPositionSndsVolumeAndPanning(): void {
  let cnt: UINT32;
  let pPositionSnd: Pointer<POSITIONSND>;
  let bVolume: INT8;
  let bPan: INT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (cnt = 0; cnt < guiNumPositionSnds; cnt++) {
    pPositionSnd = addressof(gPositionSndData[cnt]);

    if (pPositionSnd.value.fAllocated) {
      if (!pPositionSnd.value.fInActive) {
        if (pPositionSnd.value.iSoundSampleID != NO_SAMPLE) {
          bVolume = PositionSoundVolume(15, pPositionSnd.value.sGridNo);

          if (pPositionSnd.value.uiFlags & POSITION_SOUND_FROM_SOLDIER) {
            pSoldier = pPositionSnd.value.uiData;

            if (pSoldier.value.bVisible == -1) {
              // Limit volume,,,
              if (bVolume > 10) {
                bVolume = 10;
              }
            }
          }

          SoundSetVolume(pPositionSnd.value.iSoundSampleID, bVolume);

          bPan = PositionSoundDir(pPositionSnd.value.sGridNo);

          SoundSetPan(pPositionSnd.value.iSoundSampleID, bPan);
        }
      }
    }
  }
}
