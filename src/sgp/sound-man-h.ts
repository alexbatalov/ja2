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
  pName: string /* CHAR8[128] */; // Path to sample data
  uiSize: UINT32; // Size of sample data
  uiSoundSize: UINT32; // Playable sound size
  uiFlags: UINT32; // Status flags
  uiSpeed: UINT32; // Playback frequency
  fStereo: boolean; // Stereo/Mono
  ubBits: UINT8; // 8/16 bits
  pData: Buffer | null /* PTR */; // pointer to sample data memory
  pSoundStart: number /* PTR */; // pointer to start of sound data
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

export function createSampleTag(): SAMPLETAG {
  return {
    pName: '',
    uiSize: 0,
    uiSoundSize: 0,
    uiFlags: 0,
    uiSpeed: 0,
    fStereo: false,
    ubBits: 0,
    pData: null,
    pSoundStart: 0,
    uiCacheHits: 0,
    uiTimeNext: 0,
    uiTimeMin: 0,
    uiTimeMax: 0,
    uiSpeedMin: 0,
    uiSpeedMax: 0,
    uiVolMin: 0,
    uiVolMax: 0,
    uiPanMin: 0,
    uiPanMax: 0,
    uiPriority: 0,
    uiInstances: 0,
    uiMaxInstances: 0,
    uiAilWaveFormat: 0,
    uiADPCMBlockSize: 0,
  };
}

export function resetSampleTag(o: SAMPLETAG) {
  o.pName = '';
  o.uiSize = 0;
  o.uiSoundSize = 0;
  o.uiFlags = 0;
  o.uiSpeed = 0;
  o.fStereo = false;
  o.ubBits = 0;
  o.pData = null;
  o.pSoundStart = 0;
  o.uiCacheHits = 0;
  o.uiTimeNext = 0;
  o.uiTimeMin = 0;
  o.uiTimeMax = 0;
  o.uiSpeedMin = 0;
  o.uiSpeedMax = 0;
  o.uiVolMin = 0;
  o.uiVolMax = 0;
  o.uiPanMin = 0;
  o.uiPanMax = 0;
  o.uiPriority = 0;
  o.uiInstances = 0;
  o.uiMaxInstances = 0;
  o.uiAilWaveFormat = 0;
  o.uiADPCMBlockSize = 0;
}

// Structure definition for slots in the sound output
//		These are used for both the cached and double-buffered
//		streams
export type SoundTagCallback = (a: Pointer<UINT8>, b: UINT32, c: UINT32, d: UINT32, e: any) => void;
export type EndOfSoundCallback = (a: any) => void;
export interface SOUNDTAG {
  pSample: SAMPLETAG | null;
  uiSample: UINT32;
  hMSS: HSAMPLE;
  hMSSStream: HSTREAM;
  hM3D: H3DSAMPLE;
  uiFlags: UINT32;
  uiSoundID: UINT32;
  uiPriority: UINT32;
  pCallback: SoundTagCallback | null;
  pData: any;
  EOSCallback: EndOfSoundCallback | null;
  pCallbackData: any;
  uiTimeStamp: UINT32;
  fLooping: boolean;
  hFile: HWFILE;
  fMusic: boolean;
  fStopAtZero: boolean;
  uiFadeVolume: UINT32;
  uiFadeRate: UINT32;
  uiFadeTime: UINT32;
}

export function createSoundTag(): SOUNDTAG {
  return {
    pSample: null,
    uiSample: 0,
    hMSS: 0,
    hMSSStream: 0,
    hM3D: 0,
    uiFlags: 0,
    uiSoundID: 0,
    uiPriority: 0,
    pCallback:  null,
    pData: 0,
    EOSCallback: null,
    pCallbackData: 0,
    uiTimeStamp: 0,
    fLooping: false,
    hFile: 0,
    fMusic: false,
    fStopAtZero: false,
    uiFadeVolume: 0,
    uiFadeRate: 0,
    uiFadeTime: 0,
  };
}

export function resetSoundTag(o: SOUNDTAG) {
  o.pSample = null;
  o.uiSample = 0;
  o.hMSS = 0;
  o.hMSSStream = 0;
  o.hM3D = 0;
  o.uiFlags = 0;
  o.uiSoundID = 0;
  o.uiPriority = 0;
  o.pCallback =  null;
  o.pData = 0;
  o.EOSCallback = null;
  o.pCallbackData = 0;
  o.uiTimeStamp = 0;
  o.fLooping = false;
  o.hFile = 0;
  o.fMusic = false;
  o.fStopAtZero = false;
  o.uiFadeVolume = 0;
  o.uiFadeRate = 0;
  o.uiFadeTime = 0;
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
  EOSCallback: (a: any) => void;
  pCallbackData: any;
}

export function createSoundParams(): SOUNDPARMS {
  return {
    uiSpeed: 0xFFFFFFFF,
    uiPitchBend: 0xFFFFFFFF,
    uiVolume: 0xFFFFFFFF,
    uiPan: 0xFFFFFFFF,
    uiLoop: 0xFFFFFFFF,
    uiPriority: 0xFFFFFFFF,
    EOSCallback: <(a: any) => void><unknown>0xFFFFFFFF,
    pCallbackData: 0xFFFFFFFF,
  };
}

export function resetSoundParams(o: SOUNDPARMS) {
  o.uiSpeed = 0xFFFFFFFF;
  o.uiPitchBend = 0xFFFFFFFF;
  o.uiVolume = 0xFFFFFFFF;
  o.uiPan = 0xFFFFFFFF;
  o.uiLoop = 0xFFFFFFFF;
  o.uiPriority = 0xFFFFFFFF;
  o.EOSCallback = <(a: any) => void><unknown>0xFFFFFFFF;
  o.pCallbackData = 0xFFFFFFFF;
}

// Structure definition for 3D sound parameters being passed down to
//		the sample playing function
export interface SOUND3DPARMS {
  uiSpeed: UINT32;
  uiPitchBend: UINT32; // Random pitch bend range +/-
  uiVolume: UINT32; // volume at distance zero
  uiLoop: UINT32;
  uiPriority: UINT32;
  EOSCallback: ((a: any) => void) | null;
  pCallbackData: any;

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

export function createRandomParams(): RANDOMPARMS {
  return {
    uiTimeMin: 0xFFFFFFFF,
    uiTimeMax: 0xFFFFFFFF,
    uiSpeedMin: 0xFFFFFFFF,
    uiSpeedMax: 0xFFFFFFFF,
    uiVolMin: 0xFFFFFFFF,
    uiVolMax: 0xFFFFFFFF,
    uiPanMin: 0xFFFFFFFF,
    uiPanMax: 0xFFFFFFFF,
    uiPriority: 0xFFFFFFFF,
    uiMaxInstances: 0xFFFFFFFF,
  };
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
