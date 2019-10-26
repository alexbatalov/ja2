namespace ja2 {

// Sample status flags
export const SAMPLE_ALLOCATED = 0x00000001;
export const SAMPLE_LOCKED = 0x00000002;
export const SAMPLE_RANDOM = 0x00000004;
export const SAMPLE_RANDOM_MANUAL = 0x00000008;
const SAMPLE_3D = 0x00000010;

// Sound error values (they're all the same)
export const NO_SAMPLE = 0xffffffff;
export const SOUND_ERROR = 0xffffffff;

// Maximum allowable priority value
export const PRIORITY_MAX = 0xfffffffe;
export const PRIORITY_RANDOM = PRIORITY_MAX - 1;

// Structure definition for 3D sound positional information used by
// various other structs and functions
export interface SOUND3DPOS {
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

export interface SAMPLETAG {
  pName: CHAR8[] /* [128] */; // Path to sample data
  uiSize: UINT32; // Size of sample data
  uiSoundSize: UINT32; // Playable sound size
  uiFlags: UINT32; // Status flags
  uiSpeed: UINT32; // Playback frequency
  fStereo: boolean; // Stereo/Mono
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
export interface SOUNDTAG {
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
  fLooping: boolean;
  hFile: HWFILE;
  fMusic: boolean;
  fStopAtZero: boolean;
  uiFadeVolume: UINT32;
  uiFadeRate: UINT32;
  uiFadeTime: UINT32;
}

// Structure definition for sound parameters being passed down to
//		the sample playing function
export interface SOUNDPARMS {
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
export interface SOUND3DPARMS {
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
export interface RANDOMPARMS {
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

}
