// Sample status flags
const SAMPLE_ALLOCATED = 0x00000001;
const SAMPLE_LOCKED = 0x00000002;
const SAMPLE_RANDOM = 0x00000004;
const SAMPLE_RANDOM_MANUAL = 0x00000008;
const SAMPLE_3D = 0x00000010;

// Sound error values (they're all the same)
const NO_SAMPLE = 0xffffffff;
const SOUND_ERROR = 0xffffffff;

// Maximum allowable priority value
const PRIORITY_MAX = 0xfffffffe;
const PRIORITY_RANDOM = PRIORITY_MAX - 1;

// Structure definition for 3D sound positional information used by
// various other structs and functions
interface SOUND3DPOS {
  flX: FLOAT;
  flY: FLOAT;
  flZ: FLOAT;

  flVelX: FLOAT;
  flVelY: FLOAT;
  flVelZ: FLOAT;

  flFaceX: FLOAT;
  flFaceY: FLOAT;
  flFaceZ: FLOAT;

  flUpX: FLOAT;
  flUpY: FLOAT;
  flUpZ: FLOAT;

  flFalloffMin: FLOAT;
  flFalloffMax: FLOAT;

  uiVolume: UINT32;
}

// Struct definition for sample slots in the cache
//		Holds the regular sample data, as well as the
//		data for the random samples

interface SAMPLETAG {
  pName: CHAR8[] /* [128] */; // Path to sample data
  uiSize: UINT32; // Size of sample data
  uiSoundSize: UINT32; // Playable sound size
  uiFlags: UINT32; // Status flags
  uiSpeed: UINT32; // Playback frequency
  fStereo: BOOLEAN; // Stereo/Mono
  ubBits: UINT8; // 8/16 bits
  pData: PTR; // pointer to sample data memory
  pSoundStart: PTR; // pointer to start of sound data
  uiCacheHits: UINT32;

  uiTimeNext: UINT32; // Random sound data

  uiTimeMin: UINT32;
  uiTimeMax: UINT32;

  uiSpeedMin: UINT32;
  uiSpeedMax: UINT32;

  uiVolMin: UINT32;
  uiVolMax: UINT32;

  uiPanMin: UINT32;
  uiPanMax: UINT32;

  uiPriority: UINT32;
  uiInstances: UINT32;
  uiMaxInstances: UINT32;

  uiAilWaveFormat: UINT32; // AIL wave sample type
  uiADPCMBlockSize: UINT32; // Block size for compressed files
}

// Structure definition for slots in the sound output
//		These are used for both the cached and double-buffered
//		streams
interface SOUNDTAG {
  pSample: Pointer<SAMPLETAG>;
  uiSample: UINT32;
  hMSS: HSAMPLE;
  hMSSStream: HSTREAM;
  hM3D: H3DSAMPLE;
  uiFlags: UINT32;
  uiSoundID: UINT32;
  uiPriority: UINT32;
  pCallback: (a: Pointer<UINT8>, b: UINT32, c: UINT32, d: UINT32, e: Pointer<void>) => void;
  pData: Pointer<void>;
  EOSCallback: (a: Pointer<void>) => void;
  pCallbackData: Pointer<void>;
  uiTimeStamp: UINT32;
  fLooping: BOOLEAN;
  hFile: HWFILE;
  fMusic: BOOLEAN;
  fStopAtZero: BOOLEAN;
  uiFadeVolume: UINT32;
  uiFadeRate: UINT32;
  uiFadeTime: UINT32;
}

// Structure definition for sound parameters being passed down to
//		the sample playing function
interface SOUNDPARMS {
  uiSpeed: UINT32;
  uiPitchBend: UINT32; // Random pitch bend range +/-
  uiVolume: UINT32;
  uiPan: UINT32;
  uiLoop: UINT32;
  uiPriority: UINT32;
  EOSCallback: (a: Pointer<void>) => void;
  pCallbackData: Pointer<void>;
}

// Structure definition for 3D sound parameters being passed down to
//		the sample playing function
interface SOUND3DPARMS {
  uiSpeed: UINT32;
  uiPitchBend: UINT32; // Random pitch bend range +/-
  uiVolume: UINT32; // volume at distance zero
  uiLoop: UINT32;
  uiPriority: UINT32;
  EOSCallback: (a: Pointer<void>) => void;
  pCallbackData: Pointer<void>;

  Pos: SOUND3DPOS; // NOT optional, MUST be set
}

// Structure definition for parameters to the random sample playing
//		function
interface RANDOMPARMS {
  uiTimeMin: UINT32;
  uiTimeMax: UINT32;

  uiSpeedMin: UINT32;
  uiSpeedMax: UINT32;

  uiVolMin: UINT32;
  uiVolMax: UINT32;

  uiPanMin: UINT32;
  uiPanMax: UINT32;

  uiPriority: UINT32;
  uiMaxInstances: UINT32;
}

// Structure definition for parameters to the random 3D sample playing
//		function
interface RANDOM3DPARMS {
  uiTimeMin: UINT32;
  uiTimeMax: UINT32;

  uiSpeedMin: UINT32;
  uiSpeedMax: UINT32;

  uiVolMin: UINT32;
  uiVolMax: UINT32;

  uiPriority: UINT32;
  uiMaxInstances: UINT32;

  Pos: SOUND3DPOS; // NOT optional, MUST be set
}

const enum Enum31 {
  EAXROOMTYPE_NONE = 0,
  EAXROOMTYPE_SMALL_CAVE,
  EAXROOMTYPE_MEDIUM_CAVE,
  EAXROOMTYPE_LARGE_CAVE,
  EAXROOMTYPE_SMALL_ROOM,
  EAXROOMTYPE_MEDIUM_ROOM,
  EAXROOMTYPE_LARGE_ROOM,
  EAXROOMTYPE_OUTDOORS_FLAT,
  EAXROOMTYPE_OUTDOORS_CANYON,
  EAXROOMTYPE_UNDERWATER,

  EAXROOMTYPE_NUM_TYPES,
}

// Global startup/shutdown functions
extern BOOLEAN InitializeSoundManager(void);
extern void ShutdownSoundManager(void);

// Configuration functions
extern BOOLEAN SoundSetMemoryLimit(UINT32 uiLimit);
extern BOOLEAN SoundSetCacheThreshhold(UINT32 uiThreshold);
extern HDIGDRIVER SoundGetDriverHandle(void);

// Master volume control functions
extern BOOLEAN SoundSetDigitalVolume(UINT32 uiVolume);
extern UINT32 SoundGetDigitalVolume(UINT32 uiVolume);
extern void SoundSetDefaultVolume(UINT32 uiVolume);
extern UINT32 SoundGetDefaultVolume(void);

// Cache control functions
extern UINT32 SoundLoadSample(STR pFilename);
extern UINT32 SoundFreeSample(STR pFilename);
extern UINT32 SoundLockSample(STR pFilename);
extern UINT32 SoundUnlockSample(STR pFilename);
extern BOOLEAN SoundEmptyCache(void);
extern BOOLEAN SoundSampleIsInUse(UINT32 uiSample);

// Play/service sample functions
extern UINT32 SoundPlay(STR pFilename, SOUNDPARMS *pParms);
extern UINT32 SoundPlayStreamedFile(STR pFilename, SOUNDPARMS *pParms);

extern UINT32 SoundPlayRandom(STR pFilename, RANDOMPARMS *pParms);
extern BOOLEAN SoundRandomShouldPlay(UINT32 uiSample);
extern UINT32 SoundStartRandom(UINT32 uiSample);
extern UINT32 SoundStreamCallback(STR pFilename, SOUNDPARMS *pParms, void (*pCallback)(UINT8 *, UINT32, UINT32, UINT32, void *), void *);
extern BOOLEAN SoundServiceStreams(void);
extern BOOLEAN SoundServiceRandom(void);
extern void SoundSampleSetVolumeRange(UINT32 uiSample, UINT32 uiVolMin, UINT32 uiVolMax);
extern void SoundSampleSetPanRange(UINT32 uiSample, UINT32 uiPanMin, UINT32 uiPanMax);

// Sound instance manipulation functions
extern void SoundSetMusic(UINT32 uiSound);
extern BOOLEAN SoundStopMusic(void);
extern BOOLEAN SoundStopAll(void);
extern BOOLEAN SoundStopAllRandom(void);
extern BOOLEAN SoundStop(UINT32 uiSoundID);
extern BOOLEAN SoundIsPlaying(UINT32 uiSoundID);
extern BOOLEAN SoundFileIsPlaying(CHAR8 *pFilename);
extern BOOLEAN SoundSetFadeVolume(UINT32 uiSoundID, UINT32 uiVolume, UINT32 uiRate, BOOLEAN fStopAtZero);
extern BOOLEAN SoundSetVolume(UINT32 uiSoundID, UINT32 uiVolume);
extern BOOLEAN SoundSetPan(UINT32 uiSoundID, UINT32 uiPan);
extern BOOLEAN SoundSetFrequency(UINT32 uiSoundID, UINT32 uiFreq);
extern BOOLEAN SoundSetLoop(UINT32 uiSoundID, UINT32 uiLoop);
extern UINT32 SoundGetVolume(UINT32 uiSoundID);
extern UINT32 SoundGetPan(UINT32 uiSoundID);
extern UINT32 SoundGetFrequency(UINT32 uiSoundID);
extern UINT32 SoundGetLoop(UINT32 uiSoundID);
extern UINT32 SoundGetPosition(UINT32 uiSoundID);
extern BOOLEAN SoundGetMilliSecondPosition(UINT32 uiSoundID, UINT32 *puiTotalMilliseconds, UINT32 *puiCurrentMilliseconds);

// Sound instance group functions
extern BOOLEAN SoundStopGroup(UINT32 uiPriority);
extern BOOLEAN SoundFreeGroup(UINT32 uiPriority);

extern void SoundSetSampleFlags(UINT32 uiSample, UINT32 uiFlags);
extern void SoundRemoveSampleFlags(UINT32 uiSample, UINT32 uiFlags);

extern void SoundEnableSound(BOOLEAN fEnable);

// New 3D sound priovider
extern void Sound3DSetProvider(CHAR8 *pProviderName);
extern BOOLEAN Sound3DInitProvider(CHAR8 *pProviderName);
extern void Sound3DShutdownProvider(void);

// 3D sound control
extern void Sound3DSetPosition(UINT32 uiSample, FLOAT flX, FLOAT flY, FLOAT flZ);
extern void Sound3DSetVelocity(UINT32 uiSample, FLOAT flX, FLOAT flY, FLOAT flZ);
extern void Sound3DSetListener(FLOAT flX, FLOAT flY, FLOAT flZ);
extern void Sound3DSetFacing(FLOAT flXFace, FLOAT flYFace, FLOAT flZFace, FLOAT flXUp, FLOAT flYUp, FLOAT flZUp);
extern void Sound3DSetDirection(UINT32 uiSample, FLOAT flXFace, FLOAT flYFace, FLOAT flZFace, FLOAT flXUp, FLOAT flYUp, FLOAT flZUp);
extern void Sound3DSetFalloff(UINT32 uiSample, FLOAT flMax, FLOAT flMin);
extern void Sound3DSetEnvironment(INT32 iEnvironment);
extern UINT32 Sound3DPlay(STR pFilename, SOUND3DPARMS *pParms);
extern UINT32 Sound3DStartSample(UINT32 uiSample, UINT32 uiChannel, SOUND3DPARMS *pParms);
extern void Sound3DStopAll(void);
extern UINT32 Sound3DPlayRandom(STR pFilename, RANDOM3DPARMS *pParms);
extern UINT32 Sound3DStartRandom(UINT32 uiSample, SOUND3DPOS *Pos);
extern void Sound3DSetRoomType(UINT32 uiRoomType);

// Status query functions
extern UINT32 Sound3DChannelsInUse(void);
extern UINT32 SoundStreamsInUse(void);
extern UINT32 Sound2DChannelsInUse(void);
extern UINT32 SoundTotalChannelsInUse(void);
