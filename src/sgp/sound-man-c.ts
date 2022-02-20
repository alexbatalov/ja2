namespace ja2 {

/*********************************************************************************
 * SGP Digital Sound Module
 *
 *		This module handles the playing of digital samples, preloaded or streamed.
 *
 * Derek Beland, May 28, 1997
 *********************************************************************************/

// Uncomment this to disable the startup of sound hardware
//#define SOUND_DISABLE

// WAV file chunk definitions
interface WAVCHUNK {
  // General chunk header
  cTag: string /* CHAR8[4] */;
  uiChunkSize: UINT32;
}

interface WAVRIFF {
  // WAV header
  cRiff: string /* CHAR8[4] */; // "RIFF"
  uiChunkSize: UINT32; // Chunk length
  cFileType: string /* CHAR8[4] */; // "WAVE"
}

interface WAVFMT {
  // FMT chunk
  cFormat: string /* CHAR8[4] */; // "FMT "
  uiChunkSize: UINT32; // Chunk length
  uiStereo: UINT16; // 1 if stereo, 0 if mono (Not reliable, use channels instead)
  uiChannels: UINT16; // number of channels used 1=mono, 2=stereo, etc.
  uiSpeed: UINT32; // Sampling Rate (speed)
  uiBytesSec: UINT32; // Number of bytes per sec
  uiBytesSample: UINT16; // Number of bytes per sample (1 = 8 bit mono,
                         // 2 = 8 bit stereo or 16 bit mono, 4 = 16 bit stereo
  uiBitsSample: UINT16; // bits per sample
}

interface WAVDATA {
  // Data chunk
  cName: string /* CHAR8[4] */; // "DATA"
  uiChunkSize: UINT32; // Chunk length
}

const WAV_CHUNK_RIFF = 0;
const WAV_CHUNK_FMT = 1;
const WAV_CHUNK_DATA = 2;

const NUM_WAV_CHUNKS = 3;

let cWAVChunks: string[] /* Pointer<CHAR8>[3] */ = [
  "RIFF",
  "FMT ",
  "DATA",
];

// global settings
const SOUND_MAX_CACHED = 128; // number of cache slots

const SOUND_MAX_CHANNELS = 16; // number of mixer channels

const SOUND_DEFAULT_MEMORY = (8048 * 1024); // default memory limit
const SOUND_DEFAULT_THRESH = (256 * 8024); // size for sample to be double-buffered
const SOUND_DEFAULT_STREAM = (64 * 1024); // double-buffered buffer size

/*#define		SOUND_DEFAULT_MEMORY	(2048*1024)		// default memory limit
#define		SOUND_DEFAULT_THRESH	(256*1024)		// size for sample to be double-buffered
#define		SOUND_DEFAULT_STREAM	(64*1024)			// double-buffered buffer size
*/
// playing/random value to indicate default
const SOUND_PARMS_DEFAULT = 0xffffffff;

// Sound status flags
const SOUND_CALLBACK = 0x00000008;

// Global variables
let guiSoundDefaultVolume: UINT32 = 127;
let guiSoundMemoryLimit: UINT32 = SOUND_DEFAULT_MEMORY; // Maximum memory used for sounds
let guiSoundMemoryUsed: UINT32 = 0; // Memory currently in use
let guiSoundCacheThreshold: UINT32 = SOUND_DEFAULT_THRESH; // Double-buffered threshold

let hSoundDriver: HDIGDRIVER; // Sound driver handle
let fDirectSound: boolean = true; // Using Direct Sound

// Local module variables
let fSoundSystemInit: boolean = false; // Startup called T/F
let gfEnableStartup: boolean = true; // Allow hardware to starup

// Sample cache list for files loaded
let pSampleList: SAMPLETAG[] /* [SOUND_MAX_CACHED] */ = createArrayFrom(SOUND_MAX_CACHED, createSampleTag);
// Sound channel list for output channels
let pSoundList: SOUNDTAG[] /* [SOUND_MAX_CHANNELS] */ = createArrayFrom(SOUND_MAX_CHANNELS, createSoundTag);

// 3D sound globals

//*******************************************************************************
// High Level Interface
//*******************************************************************************

//*******************************************************************************
// SoundEnableSound
//
//	Allows or disallows the startup of the sound hardware.
//
//	Returns:	Nothing.
//
//*******************************************************************************
export function SoundEnableSound(fEnable: boolean): void {
  gfEnableStartup = fEnable;
}

//*******************************************************************************
// InitializeSoundManager
//
//	Zeros out the structs for the system info, and initializes the cache.
//
//	Returns:	TRUE always
//
//*******************************************************************************
export function InitializeSoundManager(): boolean {
  let uiCount: UINT32;

  if (fSoundSystemInit)
    ShutdownSoundManager();

  for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++)
  pSoundList.forEach(resetSoundTag);

  if (gfEnableStartup && SoundInitHardware())
    fSoundSystemInit = true;

  SoundInitCache();

  guiSoundMemoryLimit = SOUND_DEFAULT_MEMORY;
  guiSoundMemoryUsed = 0;
  guiSoundCacheThreshold = SOUND_DEFAULT_THRESH;

  return true;
}

//*******************************************************************************
// ShutdownSoundManager
//
//		Silences all currently playing sound, deallocates any memory allocated,
//	and releases the sound hardware.
//
//*******************************************************************************
export function ShutdownSoundManager(): void {
  SoundStopAll();
  SoundStopMusic();
  SoundShutdownCache();
  SoundShutdownHardware();
  // Sleep(1000);
  fSoundSystemInit = false;
}

//*******************************************************************************
// SoundPlay
//
//		Starts a sample playing. If the sample is not loaded in the cache, it will
//	be found and loaded. The pParms structure is used to
//	override the attributes of the sample such as playback speed, and to specify
//	a volume. Any entry containing SOUND_PARMS_DEFAULT will be set by the system.
//
//	Returns:	If the sound was started, it returns a sound ID unique to that
//						instance of the sound
//						If an error occured, SOUND_ERROR will be returned
//
//
//	!!Note:  Can no longer play streamed files
//
//*******************************************************************************

export function SoundPlay(pFilename: string /* STR */, pParms: SOUNDPARMS): UINT32 {
  let uiSample: UINT32;
  let uiChannel: UINT32;

  if (fSoundSystemInit) {
    if (!SoundPlayStreamed(pFilename)) {
      if ((uiSample = SoundLoadSample(pFilename)) != NO_SAMPLE) {
        if ((uiChannel = SoundGetFreeChannel()) != SOUND_ERROR) {
          return SoundStartSample(uiSample, uiChannel, pParms);
        }
      }
    } else {
      // Trying to play a sound which is bigger then the 'guiSoundCacheThreshold'

      // This line was causing a page fault in the Wiz 8 project, so
      // I changed it to the second line, which works OK. -- DB

      // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("\n*******\nSoundPlay():  ERROR:  trying to play %s which is bigger then the 'guiSoundCacheThreshold', use SoundPlayStreamedFile() instead\n", pFilename ) );

      FastDebugMsg(FormatString("SoundPlay: ERROR: Trying to play %s sound is too lardge to load into cache, use SoundPlayStreamedFile() instead\n", pFilename));
    }
  }

  return SOUND_ERROR;
}

//*******************************************************************************
// SoundPlayStreamedFile
//
//		The sample will
//	be played as a double-buffered sample. The pParms structure is used to
//	override the attributes of the sample such as playback speed, and to specify
//	a volume. Any entry containing SOUND_PARMS_DEFAULT will be set by the system.
//
//	Returns:	If the sound was started, it returns a sound ID unique to that
//						instance of the sound
//						If an error occured, SOUND_ERROR will be returned
//
//*******************************************************************************
export function SoundPlayStreamedFile(pFilename: string /* STR */, pParms: SOUNDPARMS): UINT32 {
  let uiChannel: UINT32;
  let hRealFileHandle: HANDLE;
  let pFileHandlefileName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiRetVal: UINT32 = 0;

  if (fSoundSystemInit) {
    if ((uiChannel = SoundGetFreeChannel()) != SOUND_ERROR) {
      // Open the file
      hFile = FileOpen(pFilename, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
      if (!hFile) {
        FastDebugMsg(FormatString("\n*******\nSoundPlayStreamedFile():  ERROR:  Couldnt open '%s' in SoundPlayStreamedFile()\n", pFilename));
        return SOUND_ERROR;
      }

      // MSS cannot determine which provider to play if you don't give it a real filename
      // so if the file isn't in a library, play it normally
      if (DB_EXTRACT_LIBRARY(hFile) == REAL_FILE_LIBRARY_ID) {
        FileClose(hFile);
        return SoundStartStream(pFilename, uiChannel, pParms);
      }

      // Get the real file handle of the file
      hRealFileHandle = GetRealFileHandleFromFileManFileHandle(hFile);
      if (hRealFileHandle == 0) {
        FastDebugMsg(FormatString("\n*******\nSoundPlayStreamedFile():  ERROR:  Couldnt get a real file handle for '%s' in SoundPlayStreamedFile()\n", pFilename));
        return SOUND_ERROR;
      }

      // Convert the file handle into a 'name'
      pFileHandlefileName = sprintf("\\\\\\\\%d", hRealFileHandle);

      // Start the sound stream
      uiRetVal = SoundStartStream(pFilename, uiChannel, pParms);

      // if it succeeded, record the file handle
      if (uiRetVal != SOUND_ERROR)
        pSoundList[uiChannel].hFile = hFile;
      else
        FileClose(hFile);

      return uiRetVal;
    }
  }

  return SOUND_ERROR;
}

//*******************************************************************************
// SoundPlayRandom
//
//		Registers a sample to be played randomly within the specified parameters.
//	Parameters are passed in through pParms. Any parameter containing
//	SOUND_PARMS_DEFAULT will be set by the system. Only the uiTimeMin entry may
//	NOT be defaulted.
//
//	* Samples designated "random" are ALWAYS loaded into the cache, and locked
//	in place. They are never double-buffered, and this call will fail if they
//	cannot be loaded. *
//
//	Returns:	If successful, it returns the sample index it is loaded to, else
//						SOUND_ERROR is returned.
//
//*******************************************************************************
export function SoundPlayRandom(pFilename: string /* STR */, pParms: RANDOMPARMS): UINT32 {
  let uiSample: UINT32;
  let uiTicks: UINT32;

  if (fSoundSystemInit) {
    if ((uiSample = SoundLoadSample(pFilename)) != NO_SAMPLE) {
      pSampleList[uiSample].uiFlags |= (SAMPLE_RANDOM | SAMPLE_LOCKED);

      if (pParms.uiTimeMin == SOUND_PARMS_DEFAULT)
        return SOUND_ERROR;
      else
        pSampleList[uiSample].uiTimeMin = pParms.uiTimeMin;

      if (pParms.uiTimeMax == SOUND_PARMS_DEFAULT)
        pSampleList[uiSample].uiTimeMax = pParms.uiTimeMin;
      else
        pSampleList[uiSample].uiTimeMax = pParms.uiTimeMax;

      pSampleList[uiSample].uiSpeedMin = pParms.uiSpeedMin;

      pSampleList[uiSample].uiSpeedMax = pParms.uiSpeedMax;

      if (pParms.uiVolMin == SOUND_PARMS_DEFAULT)
        pSampleList[uiSample].uiVolMin = guiSoundDefaultVolume;
      else
        pSampleList[uiSample].uiVolMin = pParms.uiVolMin;

      if (pParms.uiVolMax == SOUND_PARMS_DEFAULT)
        pSampleList[uiSample].uiVolMax = guiSoundDefaultVolume;
      else
        pSampleList[uiSample].uiVolMax = pParms.uiVolMax;

      if (pParms.uiPanMin == SOUND_PARMS_DEFAULT)
        pSampleList[uiSample].uiPanMin = 64;
      else
        pSampleList[uiSample].uiPanMin = pParms.uiPanMin;

      if (pParms.uiPanMax == SOUND_PARMS_DEFAULT)
        pSampleList[uiSample].uiPanMax = 64;
      else
        pSampleList[uiSample].uiPanMax = pParms.uiPanMax;

      if (pParms.uiMaxInstances == SOUND_PARMS_DEFAULT)
        pSampleList[uiSample].uiMaxInstances = 1;
      else
        pSampleList[uiSample].uiMaxInstances = pParms.uiMaxInstances;

      if (pParms.uiPriority == SOUND_PARMS_DEFAULT)
        pSampleList[uiSample].uiPriority = PRIORITY_RANDOM;
      else
        pSampleList[uiSample].uiPriority = pParms.uiPriority;

      pSampleList[uiSample].uiInstances = 0;

      uiTicks = GetTickCount();
      pSampleList[uiSample].uiTimeNext = GetTickCount() + pSampleList[uiSample].uiTimeMin + Random(pSampleList[uiSample].uiTimeMax - pSampleList[uiSample].uiTimeMin);
      return uiSample;
    }
  }

  return SOUND_ERROR;
}

//*******************************************************************************
// SoundIsPlaying
//
//		Returns TRUE/FALSE that an instance of a sound is still playing.
//
//*******************************************************************************
export function SoundIsPlaying(uiSoundID: UINT32): boolean {
  let uiSound: UINT32;

  if (fSoundSystemInit) {
    uiSound = SoundGetIndexByID(uiSoundID);
    if (uiSound != NO_SAMPLE)
      return SoundIndexIsPlaying(uiSound);
  }

  return false;
}

//*****************************************************************************************
// SoundIndexIsPlaying
//
// Returns TRUE/FALSE whether a sound channel's sample is currently playing.
//
// Returns BOOLEAN            - TRUE = playing, FALSE = stopped or nothing allocated
//
// UINT32 uiSound             - Channel number of sound
//
// Created:  2/24/00 Derek Beland
//*****************************************************************************************
function SoundIndexIsPlaying(uiSound: UINT32): boolean {
  let iStatus: INT32 = SMP_DONE;

  if (fSoundSystemInit) {
    if (pSoundList[uiSound].hMSS != null)
      iStatus = AIL_sample_status(pSoundList[uiSound].hMSS);

    if (pSoundList[uiSound].hMSSStream != null)
      iStatus = AIL_stream_status(pSoundList[uiSound].hMSSStream);

    return (iStatus != SMP_DONE) && (iStatus != SMP_STOPPED);
  }

  return false;
}

//*******************************************************************************
// SoundStop
//
//		Stops the playing of a sound instance, if still playing.
//
//	Returns:	TRUE if the sample was actually stopped, FALSE if it could not be
//						found, or was not playing.
//
//*******************************************************************************
export function SoundStop(uiSoundID: UINT32): boolean {
  let uiSound: UINT32;

  if (fSoundSystemInit) {
    if (SoundIsPlaying(uiSoundID)) {
      uiSound = SoundGetIndexByID(uiSoundID);
      if (uiSound != NO_SAMPLE) {
        SoundStopIndex(uiSound);
        return true;
      }
    }
  }
  return false;
}

//*******************************************************************************
// SoundStopAll
//
//		Stops all currently playing sounds.
//
//	Returns:	TRUE, always
//
//*******************************************************************************
export function SoundStopAll(): boolean {
  let uiCount: UINT32;

  if (fSoundSystemInit) {
    for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++)
      if (!pSoundList[uiCount].fMusic)
        SoundStopIndex(uiCount);
  }

  return true;
}

//*******************************************************************************
// SoundSetVolume
//
//		Sets the volume on a currently playing sound.
//
//	Returns:	TRUE if the volume was actually set on the sample, FALSE if the
//						sample had already expired or couldn't be found
//
//*******************************************************************************
export function SoundSetVolume(uiSoundID: UINT32, uiVolume: UINT32): boolean {
  let uiSound: UINT32;
  let uiVolCap: UINT32;

  if (fSoundSystemInit) {
    uiVolCap = Math.min(uiVolume, 127);

    if ((uiSound = SoundGetIndexByID(uiSoundID)) != NO_SAMPLE) {
      pSoundList[uiSound].uiFadeVolume = uiVolume;
      return SoundSetVolumeIndex(uiSound, uiVolume);
    }
  }

  return false;
}

//*****************************************************************************************
// SoundSetVolumeIndex
//
// Sounds the volume on a sound channel.
//
// Returns BOOLEAN            - TRUE if the volume was set
//
// UINT32 uiChannel           - Sound channel
// UINT32 uiVolume            - New volume 0-127
//
// Created:  3/17/00 Derek Beland
//*****************************************************************************************
function SoundSetVolumeIndex(uiChannel: UINT32, uiVolume: UINT32): boolean {
  let uiVolCap: UINT32;

  if (fSoundSystemInit) {
    uiVolCap = Math.min(uiVolume, 127);

    if (pSoundList[uiChannel].hMSS != null)
      AIL_set_sample_volume(pSoundList[uiChannel].hMSS, uiVolCap);

    if (pSoundList[uiChannel].hMSSStream != null)
      AIL_set_stream_volume(pSoundList[uiChannel].hMSSStream, uiVolCap);

    return true;
  }

  return false;
}

//*******************************************************************************
// SoundSetPan
//
//		Sets the pan on a currently playing sound.
//
//	Returns:	TRUE if the pan was actually set on the sample, FALSE if the
//						sample had already expired or couldn't be found
//
//*******************************************************************************
export function SoundSetPan(uiSoundID: UINT32, uiPan: UINT32): boolean {
  let uiSound: UINT32;
  let uiPanCap: UINT32;

  if (fSoundSystemInit) {
    uiPanCap = Math.min(uiPan, 127);

    if ((uiSound = SoundGetIndexByID(uiSoundID)) != NO_SAMPLE) {
      if (pSoundList[uiSound].hMSS != null)
        AIL_set_sample_pan(pSoundList[uiSound].hMSS, uiPanCap);

      if (pSoundList[uiSound].hMSSStream != null)
        AIL_set_stream_pan(pSoundList[uiSound].hMSSStream, uiPanCap);

      return true;
    }
  }

  return false;
}

//*******************************************************************************
// SoundGetVolume
//
//		Returns the current volume setting of a sound that is playing. If the sound
//	has expired, or could not be found, SOUND_ERROR is returned.
//
//*******************************************************************************
export function SoundGetVolume(uiSoundID: UINT32): UINT32 {
  let uiSound: UINT32;

  if (fSoundSystemInit) {
    if ((uiSound = SoundGetIndexByID(uiSoundID)) != NO_SAMPLE)
      return SoundGetVolumeIndex(uiSound);
  }

  return SOUND_ERROR;
}

//*****************************************************************************************
// SoundGetVolumeIndex
//
// Returns the current volume of a sound channel.
//
// Returns UINT32             - Volume 0-127
//
// UINT32 uiChannel           - Channel
//
// Created:  3/17/00 Derek Beland
//*****************************************************************************************
function SoundGetVolumeIndex(uiChannel: UINT32): UINT32 {
  if (fSoundSystemInit) {
    if (pSoundList[uiChannel].hMSS != null)
      return AIL_sample_volume(pSoundList[uiChannel].hMSS);

    if (pSoundList[uiChannel].hMSSStream != null)
      return AIL_stream_volume(pSoundList[uiChannel].hMSSStream);
  }

  return SOUND_ERROR;
}

//*******************************************************************************
// SoundServiceRandom
//
//		This function should be polled by the application if random samples are
//	used. The time marks on each are checked and if it is time to spawn a new
//	instance of the sound, the number already in existance are checked, and if
//	there is room, a new one is made and the count updated.
//		If random samples are not being used, there is no purpose in polling this
//	function.
//
//	Returns:	TRUE if a new random sound was created, FALSE if nothing was done.
//
//*******************************************************************************
export function SoundServiceRandom(): boolean {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CACHED; uiCount++) {
    if (!(pSampleList[uiCount].uiFlags & SAMPLE_RANDOM_MANUAL) && SoundRandomShouldPlay(uiCount))
      SoundStartRandom(uiCount);
  }

  return false;
}

//*******************************************************************************
// SoundRandomShouldPlay
//
//	Determines whether a random sound is ready for playing or not.
//
//	Returns:	TRUE if a the sample should be played.
//
//*******************************************************************************
function SoundRandomShouldPlay(uiSample: UINT32): boolean {
  let uiTicks: UINT32;

  uiTicks = GetTickCount();
  if (pSampleList[uiSample].uiFlags & SAMPLE_RANDOM)
    if (pSampleList[uiSample].uiTimeNext <= GetTickCount())
      if (pSampleList[uiSample].uiInstances < pSampleList[uiSample].uiMaxInstances)
        return true;

  return false;
}

//*******************************************************************************
// SoundStartRandom
//
//	Starts an instance of a random sample.
//
//	Returns:	TRUE if a new random sound was created, FALSE if nothing was done.
//
//*******************************************************************************
function SoundStartRandom(uiSample: UINT32): UINT32 {
  let uiChannel: UINT32;
  let uiSoundID: UINT32;
  let spParms: SOUNDPARMS = createSoundParams();

  if ((uiChannel = SoundGetFreeChannel()) != SOUND_ERROR) {
    //		spParms.uiSpeed=pSampleList[uiSample].uiSpeedMin+Random(pSampleList[uiSample].uiSpeedMax-pSampleList[uiSample].uiSpeedMin);
    spParms.uiVolume = pSampleList[uiSample].uiVolMin + Random(pSampleList[uiSample].uiVolMax - pSampleList[uiSample].uiVolMin);
    spParms.uiPan = pSampleList[uiSample].uiPanMin + Random(pSampleList[uiSample].uiPanMax - pSampleList[uiSample].uiPanMin);
    spParms.uiLoop = 1;
    spParms.uiPriority = pSampleList[uiSample].uiPriority;

    if ((uiSoundID = SoundStartSample(uiSample, uiChannel, spParms)) != SOUND_ERROR) {
      pSampleList[uiSample].uiTimeNext = GetTickCount() + pSampleList[uiSample].uiTimeMin + Random(pSampleList[uiSample].uiTimeMax - pSampleList[uiSample].uiTimeMin);
      pSampleList[uiSample].uiInstances++;
      return uiSoundID;
    }
  }
  return NO_SAMPLE;
}

//*******************************************************************************
// SoundStopAllRandom
//
//		This function should be polled by the application if random samples are
//	used. The time marks on each are checked and if it is time to spawn a new
//	instance of the sound, the number already in existance are checked, and if
//	there is room, a new one is made and the count updated.
//		If random samples are not being used, there is no purpose in polling this
//	function.
//
//	Returns:	TRUE if a new random sound was created, FALSE if nothing was done.
//
//*******************************************************************************
export function SoundStopAllRandom(): boolean {
  let uiChannel: UINT32;
  let uiSample: UINT32;

  // Stop all currently playing random sounds
  for (uiChannel = 0; uiChannel < SOUND_MAX_CHANNELS; uiChannel++) {
    if ((pSoundList[uiChannel].hMSS != null) || (pSoundList[uiChannel].hM3D != null)) {
      uiSample = pSoundList[uiChannel].uiSample;

      // if this was a random sample, decrease the iteration count
      if (pSampleList[uiSample].uiFlags & SAMPLE_RANDOM)
        SoundStopIndex(uiChannel);
    }
  }

  // Unlock all random sounds so they can be dumped from the cache, and
  // take the random flag off so they won't be serviced/played
  for (uiSample = 0; uiSample < SOUND_MAX_CACHED; uiSample++) {
    if (pSampleList[uiSample].uiFlags & SAMPLE_RANDOM)
      pSampleList[uiSample].uiFlags &= (~(SAMPLE_RANDOM | SAMPLE_LOCKED));
  }

  return false;
}

//*******************************************************************************
// SoundServiceStreams
//
//		Can be polled in tight loops where sound buffers might starve due to heavy
//	hardware use, etc. Streams DO NOT normally need to be serviced manually, but
//	in some cases (heavy file loading) it might be desirable.
//
//		If you are using the end of sample callbacks, you must call this function
//	periodically to check the sample's status.
//
//	Returns:	TRUE always.
//
//*******************************************************************************
export function SoundServiceStreams(): boolean {
  let uiCount: UINT32;
  let uiSpeed: UINT32;
  let uiBuffLen: UINT32;
  let uiBytesPerSample: UINT32;
  let pBuffer: Pointer<UINT8>;
  let pData: Pointer<void>;

  if (fSoundSystemInit) {
    for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++) {
      if (pSoundList[uiCount].hMSS || pSoundList[uiCount].hMSSStream || pSoundList[uiCount].hM3D) {
        // If a sound has a handle, but isn't playing, stop it and free up the handle
        if (!SoundIsPlaying(pSoundList[uiCount].uiSoundID))
          SoundStopIndex(uiCount);
        else {
          // Check the volume fades on currently playing sounds
          let uiVolume: UINT32 = SoundGetVolumeIndex(uiCount);
          let uiTime: UINT32 = GetTickCount();

          if ((uiVolume != pSoundList[uiCount].uiFadeVolume) && (uiTime >= (pSoundList[uiCount].uiFadeTime + pSoundList[uiCount].uiFadeRate))) {
            if (uiVolume < pSoundList[uiCount].uiFadeVolume)
              SoundSetVolumeIndex(uiCount, ++uiVolume);
            else if (uiVolume > pSoundList[uiCount].uiFadeVolume) {
              uiVolume--;
              if (!uiVolume && pSoundList[uiCount].fStopAtZero)
                SoundStopIndex(uiCount);
              else
                SoundSetVolumeIndex(uiCount, uiVolume);
            }

            pSoundList[uiCount].uiFadeTime = uiTime;
          }
        }
      }
    }
  }

  return true;
}

//*******************************************************************************
// SoundGetPosition
//
//	Reports the current time position of the sample.
//
//	Note: You should be checking SoundIsPlaying very carefully while
//	calling this function.
//
//	Returns:	The current time of the sample in milliseconds.
//
//*******************************************************************************
export function SoundGetPosition(uiSoundID: UINT32): UINT32 {
  // UINT32 uiSound, uiFreq=0, uiPosition=0, uiBytesPerSample=0, uiFormat=0;
  let uiSound: UINT32;
  let uiTime: UINT32;
  let uiPosition: UINT32;

  if (fSoundSystemInit) {
    if ((uiSound = SoundGetIndexByID(uiSoundID)) != NO_SAMPLE) {
      /*			if(pSoundList[uiSound].hMSSStream!=NULL)
                              {
                                      uiPosition=(UINT32)AIL_stream_position(pSoundList[uiSound].hMSSStream);
                                      uiFreq=(UINT32)pSoundList[uiSound].hMSSStream->samp->playback_rate;
                                      uiFormat=(UINT32)pSoundList[uiSound].hMSSStream->samp->format;

                              }
                              else if(pSoundList[uiSound].hMSS!=NULL)
                              {
                                      uiPosition=(UINT32)AIL_sample_position(pSoundList[uiSound].hMSS);
                                      uiFreq=(UINT32)pSoundList[uiSound].hMSS->playback_rate;
                                      uiFormat=(UINT32)pSoundList[uiSound].hMSS->format;
                              }
                      }

                      switch(uiFormat)
                      {
                              case DIG_F_MONO_8:		uiBytesPerSample=1;
                                                                                                                      break;
                              case DIG_F_MONO_16:		uiBytesPerSample=2;
                                                                                                                      break;
                              case DIG_F_STEREO_8:	uiBytesPerSample=2;
                                                                                                                      break;
                              case DIG_F_STEREO_16:	uiBytesPerSample=4;
                                                                                                                      break;
                      }

                      if(uiFreq)
                      {
                              return((uiPosition/uiBytesPerSample)/(uiFreq/1000));
                      }
              }
      */
      uiTime = GetTickCount();
      // check for rollover
      if (uiTime < pSoundList[uiSound].uiTimeStamp)
        uiPosition = (0 - pSoundList[uiSound].uiTimeStamp) + uiTime;
      else
        uiPosition = (uiTime - pSoundList[uiSound].uiTimeStamp);

      return uiPosition;
    }
  }

  return 0;
}

//*******************************************************************************
// Cacheing Subsystem
//*******************************************************************************

//*******************************************************************************
// SoundInitCache
//
//		Zeros out the structures of the sample list.
//
//*******************************************************************************
function SoundInitCache(): boolean {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CACHED; uiCount++)
    resetSampleTag(pSampleList[uiCount]);

  return true;
}

//*******************************************************************************
// SoundShutdownCache
//
//		Empties out the cache.
//
//	Returns: TRUE, always
//
//*******************************************************************************
function SoundShutdownCache(): boolean {
  SoundEmptyCache();
  return true;
}

//*******************************************************************************
// SoundEmptyCache
//
//		Frees up all samples in the cache.
//
//	Returns: TRUE, always
//
//*******************************************************************************
function SoundEmptyCache(): boolean {
  let uiCount: UINT32;

  SoundStopAll();

  for (uiCount = 0; uiCount < SOUND_MAX_CACHED; uiCount++)
    SoundFreeSampleIndex(uiCount);

  return true;
}

//*******************************************************************************
// SoundLoadSample
//
//		Frees up all samples in the cache.
//
//	Returns: TRUE, always
//
//*******************************************************************************
export function SoundLoadSample(pFilename: string /* STR */): UINT32 {
  let uiSample: UINT32 = NO_SAMPLE;

  if ((uiSample = SoundGetCached(pFilename)) != NO_SAMPLE)
    return uiSample;

  return SoundLoadDisk(pFilename);
}

//*******************************************************************************
// SoundLockSample
//
//		Locks a sample into cache memory, so the cacheing system won't release it
//	when it needs room.
//
//	Returns: The sample index if successful, NO_SAMPLE if the file wasn't found
//						in the cache.
//
//*******************************************************************************
export function SoundLockSample(pFilename: string /* STR */): UINT32 {
  let uiSample: UINT32;

  if ((uiSample = SoundGetCached(pFilename)) != NO_SAMPLE) {
    pSampleList[uiSample].uiFlags |= SAMPLE_LOCKED;
    return uiSample;
  }

  return NO_SAMPLE;
}

//*******************************************************************************
// SoundUnlockSample
//
//		Removes the lock on a sample so the cache is free to dump it when necessary.
//
//	Returns: The sample index if successful, NO_SAMPLE if the file wasn't found
//						in the cache.
//
//*******************************************************************************
export function SoundUnlockSample(pFilename: string /* STR */): UINT32 {
  let uiSample: UINT32;

  if ((uiSample = SoundGetCached(pFilename)) != NO_SAMPLE) {
    pSampleList[uiSample].uiFlags &= (~SAMPLE_LOCKED);
    return uiSample;
  }

  return NO_SAMPLE;
}

//*******************************************************************************
// SoundGetCached
//
//		Tries to locate a sound by looking at what is currently loaded in the
//	cache.
//
//	Returns: The sample index if successful, NO_SAMPLE if the file wasn't found
//						in the cache.
//
//*******************************************************************************
function SoundGetCached(pFilename: string /* STR */): UINT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CACHED; uiCount++) {
    if (pSampleList[uiCount].pName.toLowerCase() === pFilename.toLowerCase())
      return uiCount;
  }

  return NO_SAMPLE;
}

//*******************************************************************************
// SoundLoadDisk
//
//		Loads a sound file from disk into the cache, allocating memory and a slot
//	for storage.
//
//
//	Returns: The sample index if successful, NO_SAMPLE if the file wasn't found
//						in the cache.
//
//*******************************************************************************
function SoundLoadDisk(pFilename: string /* STR */): UINT32 {
  let hFile: HWFILE;
  let uiSize: UINT32;
  let uiSample: UINT32;
  let fRemoved: boolean = true;

  Assert(pFilename != null);

  if ((hFile = FileOpen(pFilename, FILE_ACCESS_READ, false)) != 0) {
    uiSize = FileGetSize(hFile);

    // if insufficient memory, start unloading old samples until either
    // there's nothing left to unload, or we fit
    fRemoved = true;
    while (((uiSize + guiSoundMemoryUsed) > guiSoundMemoryLimit) && (fRemoved))
      fRemoved = SoundCleanCache();

    // if we still don't fit
    if ((uiSize + guiSoundMemoryUsed) > guiSoundMemoryLimit) {
      FastDebugMsg(FormatString("SoundLoadDisk:  ERROR:  trying to play %s, not enough memory\n", pFilename));
      FileClose(hFile);
      return NO_SAMPLE;
    }

    // if all the sample slots are full, unloading one
    if ((uiSample = SoundGetEmptySample()) == NO_SAMPLE) {
      SoundCleanCache();
      uiSample = SoundGetEmptySample();
    }

    // if we still don't have a sample slot
    if (uiSample == NO_SAMPLE) {
      FastDebugMsg(FormatString("SoundLoadDisk:  ERROR: Trying to play %s, sound channels are full\n", pFilename));
      FileClose(hFile);
      return NO_SAMPLE;
    }

    resetSampleTag(pSampleList[uiSample]);

    if ((pSampleList[uiSample].pData = Buffer.allocUnsafe(uiSize)) == null) {
      FastDebugMsg(FormatString("SoundLoadDisk:  ERROR: Trying to play %s, AIL channels are full\n", pFilename));
      FileClose(hFile);
      return NO_SAMPLE;
    }

    guiSoundMemoryUsed += uiSize;

    FileRead(hFile, pSampleList[uiSample].pData as Buffer, uiSize);
    FileClose(hFile);

    pSampleList[uiSample].pName = pFilename;
    pSampleList[uiSample].pName = pSampleList[uiSample].pName.toUpperCase();
    pSampleList[uiSample].uiSize = uiSize;
    pSampleList[uiSample].uiFlags |= SAMPLE_ALLOCATED;

    /*		if(!strstr(pFilename, ".MP3"))
                            SoundProcessWAVHeader(uiSample);
    */
    return uiSample;
  }

  return NO_SAMPLE;
}

//*******************************************************************************
// SoundCleanCache
//
//		Removes the least-used sound from the cache to make room.
//
//	Returns:	TRUE if a sample was freed, FALSE if none
//
//*******************************************************************************
function SoundCleanCache(): boolean {
  let uiCount: UINT32;
  let uiLowestHits: UINT32 = NO_SAMPLE;
  let uiLowestHitsCount: UINT32 = 0;

  for (uiCount = 0; uiCount < SOUND_MAX_CACHED; uiCount++) {
    if ((pSampleList[uiCount].uiFlags & SAMPLE_ALLOCATED) && !(pSampleList[uiCount].uiFlags & SAMPLE_LOCKED)) {
      if ((uiLowestHits == NO_SAMPLE) || (uiLowestHitsCount < pSampleList[uiCount].uiCacheHits)) {
        if (!SoundSampleIsPlaying(uiCount)) {
          uiLowestHits = uiCount;
          uiLowestHitsCount = pSampleList[uiCount].uiCacheHits;
        }
      }
    }
  }

  if (uiLowestHits != NO_SAMPLE) {
    SoundFreeSampleIndex(uiLowestHits);
    return true;
  }

  return false;
}

//*******************************************************************************
// Low Level Interface (Local use only)
//*******************************************************************************

//*******************************************************************************
// SoundSampleIsPlaying
//
//		Returns TRUE/FALSE that a sample is currently in use for playing a sound.
//
//*******************************************************************************
function SoundSampleIsPlaying(uiSample: UINT32): boolean {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++) {
    if (pSoundList[uiCount].uiSample == uiSample)
      return true;
  }

  return false;
}

//*******************************************************************************
// SoundGetEmptySample
//
//		Returns the slot number of an available sample index.
//
//	Returns:	A free sample index, or NO_SAMPLE if none are left.
//
//*******************************************************************************
function SoundGetEmptySample(): UINT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CACHED; uiCount++) {
    if (!(pSampleList[uiCount].uiFlags & SAMPLE_ALLOCATED))
      return uiCount;
  }

  return NO_SAMPLE;
}

//*******************************************************************************
// SoundFreeSampleIndex
//
//		Frees up a sample referred to by it's index slot number.
//
//	Returns:	Slot number if something was free, NO_SAMPLE otherwise.
//
//*******************************************************************************
function SoundFreeSampleIndex(uiSample: UINT32): UINT32 {
  if (pSampleList[uiSample].uiFlags & SAMPLE_ALLOCATED) {
    if (pSampleList[uiSample].pData != null) {
      guiSoundMemoryUsed -= pSampleList[uiSample].uiSize;
      pSampleList[uiSample].pData = null;
    }

    resetSampleTag(pSampleList[uiSample]);
    return uiSample;
  }

  return NO_SAMPLE;
}

//*******************************************************************************
// SoundGetIndexByID
//
//		Searches out a sound instance referred to by it's ID number.
//
//	Returns:	If the instance was found, the slot number. NO_SAMPLE otherwise.
//
//*******************************************************************************
function SoundGetIndexByID(uiSoundID: UINT32): UINT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++) {
    if (pSoundList[uiCount].uiSoundID == uiSoundID)
      return uiCount;
  }

  return NO_SAMPLE;
}

//*******************************************************************************
// SoundInitHardware
//
//		Initializes the sound hardware through Windows/DirectX. THe highest possible
//	mixing rate and capabilities set are searched out and used.
//
//	Returns:	TRUE if the hardware was initialized, FALSE otherwise.
//
//*******************************************************************************
function SoundInitHardware(): boolean {
  let uiCount: UINT32;
  let cDriverName: string /* CHAR8[128] */;

  // Initialize the driver handle
  hSoundDriver = new AudioContext({ sampleRate: 44100 / 2 });

  fDirectSound = true;

  if (hSoundDriver != null) {
    for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++)
      resetSoundTag(pSoundList[uiCount]);

    return true;
  }

  return false;

  /*
          // midi startup
          if (hSoundDriver!=NULL)
          {
                  soundMDI = MIDI_init_driver();
                  if (soundMDI==NULL)
                  {
                          _RPT1(_CRT_WARN, "MIDI: %s", AIL_last_error());
                  }
                  else
                  {
                          soundSEQ = MIDI_load_sequence(soundMDI, "SOUNDS\\DEMO.XMI");
                          if (soundSEQ==NULL)
                          _RPT1(_CRT_WARN, "MIDI: %s", AIL_last_error());
                  }
          }
  */
}

//*******************************************************************************
// SoundShutdownHardware
//
//		Shuts down the system hardware.
//
//	Returns:	TRUE always.
//
//*******************************************************************************
function SoundShutdownHardware(): boolean {
  if (fSoundSystemInit)
    hSoundDriver.close();

  return true;
}

//*******************************************************************************
// SoundGetFreeChannel
//
//		Finds an unused sound channel in the channel list.
//
//	Returns:	Index of a sound channel if one was found, SOUND_ERROR if not.
//
//*******************************************************************************
function SoundGetFreeChannel(): UINT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++) {
    if (!SoundIsPlaying(pSoundList[uiCount].uiSoundID)) {
      SoundStopIndex(uiCount);
    }

    if ((pSoundList[uiCount].hMSS == null) && (pSoundList[uiCount].hMSSStream == null) && (pSoundList[uiCount].hM3D == null))
      return uiCount;
  }

  return SOUND_ERROR;
}

//*******************************************************************************
// SoundStartSample
//
//		Starts up a sample on the specified channel. Override parameters are passed
//	in through the structure pointer pParms. Any entry with a value of 0xffffffff
//	will be filled in by the system.
//
//	Returns:	Unique sound ID if successful, SOUND_ERROR if not.
//
//*******************************************************************************
function SoundStartSample(uiSample: UINT32, uiChannel: UINT32, pParms: SOUNDPARMS | null): UINT32 {
  let uiSoundID: UINT32;
  let AILString: string /* CHAR8[200] */;

  if (!fSoundSystemInit)
    return SOUND_ERROR;

    if ((pSoundList[uiChannel].hMSS = AIL_allocate_sample_handle(hSoundDriver)) == null) {
      AILString = sprintf("Sample Error: %s", AIL_last_error());
      FastDebugMsg(AILString);
      return SOUND_ERROR;
    }

    AIL_init_sample(pSoundList[uiChannel].hMSS);

    if (!AIL_set_named_sample_file(pSoundList[uiChannel].hMSS, pSampleList[uiSample].pName, pSampleList[uiSample].pData, pSampleList[uiSample].uiSize, 0)) {
      AIL_release_sample_handle(pSoundList[uiChannel].hMSS);
      pSoundList[uiChannel].hMSS = <HSAMPLE><unknown>null;

      AILString = sprintf("AIL Set Sample Error: %s", AIL_last_error());
      DbgMessage(TOPIC_GAME, DBG_LEVEL_0, AILString);
      return SOUND_ERROR;
    }

  // Store the natural playback rate before we modify it below
  pSampleList[uiSample].uiSpeed = AIL_sample_playback_rate(pSoundList[uiChannel].hMSS);

  if (pSampleList[uiSample].uiFlags & SAMPLE_RANDOM) {
    if ((pSampleList[uiSample].uiSpeedMin != SOUND_PARMS_DEFAULT) && (pSampleList[uiSample].uiSpeedMin != SOUND_PARMS_DEFAULT)) {
      let uiSpeed: UINT32 = pSampleList[uiSample].uiSpeedMin + Random(pSampleList[uiSample].uiSpeedMax - pSampleList[uiSample].uiSpeedMin);

      AIL_set_sample_playback_rate(pSoundList[uiChannel].hMSS, uiSpeed);
    }
  } else {
    if ((pParms != null) && (pParms.uiSpeed != SOUND_PARMS_DEFAULT)) {
      Assert((pParms.uiSpeed > 0) && (pParms.uiSpeed <= 60000));
      AIL_set_sample_playback_rate(pSoundList[uiChannel].hMSS, pParms.uiSpeed);
    }
  }

  if ((pParms != null) && (pParms.uiPitchBend != SOUND_PARMS_DEFAULT)) {
    let uiRate: UINT32 = AIL_sample_playback_rate(pSoundList[uiChannel].hMSS);
    let uiBend: UINT32 = uiRate * pParms.uiPitchBend / 100;
    AIL_set_sample_playback_rate(pSoundList[uiChannel].hMSS, uiRate + (Random(uiBend * 2) - uiBend));
  }

  if ((pParms != null) && (pParms.uiVolume != SOUND_PARMS_DEFAULT))
    AIL_set_sample_volume(pSoundList[uiChannel].hMSS, pParms.uiVolume);
  else
    AIL_set_sample_volume(pSoundList[uiChannel].hMSS, guiSoundDefaultVolume);

  if ((pParms != null) && (pParms.uiLoop != SOUND_PARMS_DEFAULT)) {
    AIL_set_sample_loop_count(pSoundList[uiChannel].hMSS, pParms.uiLoop);

    // If looping infinately, lock the sample so it can't be unloaded
    // and mark it as a looping sound
    if (pParms.uiLoop == 0) {
      pSampleList[uiSample].uiFlags |= SAMPLE_LOCKED;
      pSoundList[uiChannel].fLooping = true;
    }
  }

  if ((pParms != null) && (pParms.uiPan != SOUND_PARMS_DEFAULT))
    AIL_set_sample_pan(pSoundList[uiChannel].hMSS, pParms.uiPan);

  if ((pParms != null) && (pParms.uiPriority != SOUND_PARMS_DEFAULT))
    pSoundList[uiChannel].uiPriority = pParms.uiPriority;
  else
    pSoundList[uiChannel].uiPriority = PRIORITY_MAX;

  if ((pParms != null) && (pParms.EOSCallback as any != SOUND_PARMS_DEFAULT)) {
    pSoundList[uiChannel].EOSCallback = pParms.EOSCallback;
    pSoundList[uiChannel].pCallbackData = pParms.pCallbackData;
  } else {
    pSoundList[uiChannel].EOSCallback = null;
    pSoundList[uiChannel].pCallbackData = null;
  }

  uiSoundID = SoundGetUniqueID();
  pSoundList[uiChannel].uiSoundID = uiSoundID;
  pSoundList[uiChannel].uiSample = uiSample;
  pSoundList[uiChannel].uiTimeStamp = GetTickCount();
  pSoundList[uiChannel].uiFadeVolume = SoundGetVolumeIndex(uiChannel);

  pSampleList[uiSample].uiCacheHits++;

  AIL_start_sample(pSoundList[uiChannel].hMSS);

  return uiSoundID;
}

//*******************************************************************************
// SoundStartStream
//
//		Starts up a stream on the specified channel. Override parameters are passed
//	in through the structure pointer pParms. Any entry with a value of 0xffffffff
//	will be filled in by the system.
//
//	Returns:	Unique sound ID if successful, SOUND_ERROR if not.
//
//*******************************************************************************
function SoundStartStream(pFilename: string /* STR */, uiChannel: UINT32, pParms: SOUNDPARMS | null): UINT32 {
  let uiSoundID: UINT32;
  let uiSpeed: UINT32;
  let AILString: string /* CHAR8[200] */;

  if (!fSoundSystemInit)
    return SOUND_ERROR;

  if ((pSoundList[uiChannel].hMSSStream = AIL_open_stream(hSoundDriver, pFilename, SOUND_DEFAULT_STREAM)) == null) {
    SoundCleanCache();
    pSoundList[uiChannel].hMSSStream = AIL_open_stream(hSoundDriver, pFilename, SOUND_DEFAULT_STREAM);
  }

  if (pSoundList[uiChannel].hMSSStream == null) {
    AILString = sprintf("Stream Error: %s", AIL_last_error());
    DbgMessage(TOPIC_GAME, DBG_LEVEL_0, AILString);
    return SOUND_ERROR;
  }

  if ((pParms != null) && (pParms.uiSpeed != SOUND_PARMS_DEFAULT))
    uiSpeed = pParms.uiSpeed;
  else
    uiSpeed = AIL_stream_playback_rate(pSoundList[uiChannel].hMSSStream);

  if ((pParms != null) && (pParms.uiPitchBend != SOUND_PARMS_DEFAULT)) {
    let uiBend: UINT32 = uiSpeed * pParms.uiPitchBend / 100;
    uiSpeed += (Random(uiBend * 2) - uiBend);
  }

  AIL_set_stream_playback_rate(pSoundList[uiChannel].hMSSStream, uiSpeed);

  if ((pParms != null) && (pParms.uiVolume != SOUND_PARMS_DEFAULT))
    AIL_set_stream_volume(pSoundList[uiChannel].hMSSStream, pParms.uiVolume);
  else
    AIL_set_stream_volume(pSoundList[uiChannel].hMSSStream, guiSoundDefaultVolume);

  if (pParms != null) {
    if (pParms.uiLoop != SOUND_PARMS_DEFAULT)
      AIL_set_stream_loop_count(pSoundList[uiChannel].hMSSStream, pParms.uiLoop);
  }

  if ((pParms != null) && (pParms.uiPan != SOUND_PARMS_DEFAULT))
    AIL_set_stream_pan(pSoundList[uiChannel].hMSSStream, pParms.uiPan);

  AIL_start_stream(pSoundList[uiChannel].hMSSStream);

  uiSoundID = SoundGetUniqueID();
  pSoundList[uiChannel].uiSoundID = uiSoundID;
  if (pParms)
    pSoundList[uiChannel].uiPriority = pParms.uiPriority;
  else
    pSoundList[uiChannel].uiPriority = SOUND_PARMS_DEFAULT;

  if ((pParms != null) && (pParms.EOSCallback as any != SOUND_PARMS_DEFAULT)) {
    pSoundList[uiChannel].EOSCallback = pParms.EOSCallback;
    pSoundList[uiChannel].pCallbackData = pParms.pCallbackData;
  } else {
    pSoundList[uiChannel].EOSCallback = null;
    pSoundList[uiChannel].pCallbackData = null;
  }

  pSoundList[uiChannel].uiTimeStamp = GetTickCount();
  pSoundList[uiChannel].uiFadeVolume = SoundGetVolumeIndex(uiChannel);

  return uiSoundID;
}

//*******************************************************************************
// SoundGetUniqueID
//
//		Returns a unique ID number with every call. Basically it's just a 32-bit
// static value that is incremented each time.
//
//*******************************************************************************
/* static */ let SoundGetUniqueID__uiNextID: UINT32 = 0;
function SoundGetUniqueID(): UINT32 {
  if (SoundGetUniqueID__uiNextID == SOUND_ERROR)
    SoundGetUniqueID__uiNextID++;

  return SoundGetUniqueID__uiNextID++;
}

//*******************************************************************************
// SoundPlayStreamed
//
//		Returns TRUE/FALSE whether a sound file should be played as a streamed
//	sample, or loaded into the cache. The decision is based on the size of the
//	file compared to the guiSoundCacheThreshold.
//
//	Returns:	TRUE if it should be streamed, FALSE if loaded.
//
//*******************************************************************************
function SoundPlayStreamed(pFilename: string /* STR */): boolean {
  let hDisk: HWFILE;
  let uiFilesize: UINT32;

  if ((hDisk = FileOpen(pFilename, FILE_ACCESS_READ, false)) != 0) {
    uiFilesize = FileGetSize(hDisk);
    FileClose(hDisk);
    return uiFilesize >= guiSoundCacheThreshold;
  }

  return false;
}

//*******************************************************************************
// SoundStopIndex
//
//		Stops a sound referred to by it's slot number. This function is the only
//	one that should be deallocating sample handles. The random sounds have to have
//	their counters maintained, and using this as the central function ensures
//	that they stay in sync.
//
//	Returns:	TRUE if the sample was stopped, FALSE if it could not be found.
//
//*******************************************************************************
function SoundStopIndex(uiChannel: UINT32): boolean {
  let uiSample: UINT32;

  if (fSoundSystemInit) {
    if (uiChannel != NO_SAMPLE) {
      if (pSoundList[uiChannel].hMSS != null) {
        AIL_stop_sample(pSoundList[uiChannel].hMSS);
        AIL_release_sample_handle(pSoundList[uiChannel].hMSS);
        pSoundList[uiChannel].hMSS = <HSAMPLE><unknown>null;
        uiSample = pSoundList[uiChannel].uiSample;

        // if this was a random sample, decrease the iteration count
        if (pSampleList[uiSample].uiFlags & SAMPLE_RANDOM)
          pSampleList[uiSample].uiInstances--;

        if (pSoundList[uiChannel].EOSCallback != null)
          pSoundList[uiChannel].EOSCallback!(pSoundList[uiChannel].pCallbackData);

        if (pSoundList[uiChannel].fLooping && !SoundSampleIsInUse(uiChannel))
          SoundRemoveSampleFlags(uiSample, SAMPLE_LOCKED);

        pSoundList[uiChannel].uiSample = NO_SAMPLE;
      }

      if (pSoundList[uiChannel].hMSSStream != null) {
        AIL_close_stream(pSoundList[uiChannel].hMSSStream);
        pSoundList[uiChannel].hMSSStream = <HSTREAM><unknown>null;
        if (pSoundList[uiChannel].EOSCallback != null)
          pSoundList[uiChannel].EOSCallback!(pSoundList[uiChannel].pCallbackData);

        pSoundList[uiChannel].uiSample = NO_SAMPLE;
      }

      if (pSoundList[uiChannel].hFile != 0) {
        FileClose(pSoundList[uiChannel].hFile);
        pSoundList[uiChannel].hFile = 0;

        pSoundList[uiChannel].uiSample = NO_SAMPLE;
      }

      return true;
    }
  }

  return false;
}

//*******************************************************************************
// SoundGetDriverHandle
//
//	Returns:	Pointer to the current sound driver
//
//*******************************************************************************
export function SoundGetDriverHandle(): HDIGDRIVER {
  return hSoundDriver;
}

export function SoundRemoveSampleFlags(uiSample: UINT32, uiFlags: UINT32): void {
  // CHECK FOR VALID SAMPLE
  if ((pSampleList[uiSample].uiFlags & SAMPLE_ALLOCATED)) {
    // REMOVE
    pSampleList[uiSample].uiFlags &= (~uiFlags);
  }
}

//*******************************************************************************
// SoundSampleIsInUse
//
//	Returns:	TRUE if the sample index is currently being played by the system.
//
//*******************************************************************************
function SoundSampleIsInUse(uiSample: UINT32): boolean {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++) {
    if ((pSoundList[uiCount].uiSample == uiSample) && SoundIsPlaying(uiCount))
      return true;
  }

  return false;
}

//*****************************************************************************************
// SoundStopMusic
//
// Stops any sound instance with the music flag.
//
// Returns nothing.
//
// Created:  3/16/00 Derek Beland
//*****************************************************************************************
function SoundStopMusic(): boolean {
  let uiCount: UINT32;
  let fStopped: boolean = false;

  if (fSoundSystemInit) {
    for (uiCount = 0; uiCount < SOUND_MAX_CHANNELS; uiCount++) {
      if ((pSoundList[uiCount].hMSS != null) || (pSoundList[uiCount].hMSSStream != null) || (pSoundList[uiCount].hM3D != null)) {
        if (pSoundList[uiCount].fMusic) {
          SoundStop(pSoundList[uiCount].uiSoundID);
          fStopped = true;
        }
      }
    }
  }

  return fStopped;
}

type HDIGDRIVER = AudioContext;

const SMP_DONE = 0x0002;
const SMP_PLAYING = 0x0004;
const SMP_STOPPED = 0x0008;

const mssPanToStereoPannerNode = new Map([
  [0, -1], // FARLEFT
  [1, -1],
  [LEFTSIDE, -0.25],
  [MIDDLEPAN, 0],
  [RIGHTSIDE, 0.25],
  [126, 1],
  [127, 1], // FARRIGHT
]);

let lastError = '';

function setPan(stereoPannerNode: StereoPannerNode, pan: number) {
  stereoPannerNode.pan.value = mssPanToStereoPannerNode.get(pan) || 0;
}

function getVolume(gainNode: GainNode) {
  return gainNode.gain.value * 127;
}

function setVolume(gainNode: GainNode, volume: number) {
  gainNode.gain.value = volume / 127;
}

function AIL_last_error() {
  return lastError;
}

function AIL_allocate_sample_handle(context: AudioContext): HSAMPLE {
  const gainNode = context.createGain();
  gainNode.connect(context.destination);

  const stereoPannerNode = context.createStereoPanner();
  stereoPannerNode.connect(gainNode);

  const audioBufferSourceNode = context.createBufferSource();
  audioBufferSourceNode.connect(stereoPannerNode);

  return {
    context,
    gainNode,
    stereoPannerNode,
    audioBufferSourceNode,
    data: null,
    loops: 1,
    status: SMP_DONE,
  };
}

function AIL_init_sample(sample: HSAMPLE) {

}

function AIL_set_named_sample_file(sample: HSAMPLE, fileName: string, data: Buffer | null, size: number, flags: number) {
  if (data == null) {
    lastError = 'data';
    return false;
  }

  sample.data = data;

  return true;
}

function AIL_start_sample(sample: HSAMPLE) {
  const data = <Buffer>sample.data;
  // const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteLength);

  const audioBuffer = decodeWav(data);
  if (audioBuffer) {
    sample.audioBufferSourceNode.buffer = audioBuffer;

    sample.audioBufferSourceNode.addEventListener('ended', sampleEnded.bind(sample));

    sample.audioBufferSourceNode.start();

    sample.status = SMP_PLAYING;
  } else {
    sample.status = SMP_STOPPED;
  }
}

function sampleEnded(this: HSAMPLE) {
  if (--this.loops) {
    const buffer = this.audioBufferSourceNode.buffer;
    this.audioBufferSourceNode = this.context.createBufferSource();
    this.audioBufferSourceNode.buffer = buffer;
    this.audioBufferSourceNode.connect(this.stereoPannerNode);

    AIL_start_stream(this);
  } else {
    this.status = SMP_DONE;
  }
}

function AIL_stop_sample(sample: HSAMPLE) {
  if (sample.status !== SMP_STOPPED) {
    sample.audioBufferSourceNode.stop();
    sample.status = SMP_STOPPED;
  }
}

function AIL_release_sample_handle(sample: HSAMPLE) {
  sample.gainNode.disconnect(sample.context.destination);
  sample.stereoPannerNode.disconnect(sample.gainNode);
  sample.audioBufferSourceNode.disconnect(sample.stereoPannerNode);
  sample.audioBufferSourceNode.buffer = null;
  sample.data = null;
}

function AIL_sample_playback_rate(sample: HSAMPLE) {
  return Math.trunc(sample.audioBufferSourceNode.playbackRate.value * sample.context.sampleRate);
}

function AIL_set_sample_playback_rate(sample: HSAMPLE, playbackRate: number) {
  sample.audioBufferSourceNode.playbackRate.value = (playbackRate !== 0 ? sample.context.sampleRate / playbackRate : 0);
}

function AIL_set_sample_pan(sample: HSAMPLE, pan: number) {
  setPan(sample.stereoPannerNode, pan);
}

function AIL_sample_volume(sample: HSAMPLE) {
  return getVolume(sample.gainNode);
}

function AIL_set_sample_volume(sample: HSAMPLE, volume: number) {
  setVolume(sample.gainNode, volume);
}

function AIL_set_sample_loop_count(sample: HSAMPLE, loops: number) {
  sample.loops = loops === 0 ? Infinity : loops;
}

function AIL_sample_status(sample: HSAMPLE) {
  return sample.status;
}

function AIL_open_stream(context: AudioContext, fileName: string, flags: number): HSTREAM {
  const file = FileOpen(fileName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  const size = FileGetSize(file);
  const data = Buffer.allocUnsafe(size);
  FileRead(file, data, size);
  FileClose(file);

  const gainNode = context.createGain();
  gainNode.connect(context.destination);

  const stereoPannerNode = context.createStereoPanner();
  stereoPannerNode.connect(gainNode);

  const audioBufferSourceNode = context.createBufferSource();
  audioBufferSourceNode.buffer = decodeWav(data);
  audioBufferSourceNode.connect(stereoPannerNode);

  return {
    context,
    stereoPannerNode,
    gainNode,
    audioBufferSourceNode,
    data,
    status: SMP_DONE,
    loops: 1,
  };
}

function AIL_start_stream(stream: HSTREAM) {
  stream.audioBufferSourceNode.addEventListener('ended', streamEnded.bind(stream));

  stream.audioBufferSourceNode.start();

  stream.status = SMP_PLAYING;
}

function streamEnded(this: HSTREAM) {
  if (--this.loops) {
    const buffer = this.audioBufferSourceNode.buffer;
    this.audioBufferSourceNode = this.context.createBufferSource();
    this.audioBufferSourceNode.buffer = buffer;
    this.audioBufferSourceNode.connect(this.stereoPannerNode);

    AIL_start_stream(this);

    return;
  } else {
    this.status = SMP_DONE;
  }
}

function AIL_close_stream(stream: HSTREAM) {
  stream.gainNode.disconnect(stream.context.destination);
  stream.stereoPannerNode.disconnect(stream.gainNode);
  stream.audioBufferSourceNode.disconnect(stream.stereoPannerNode);
  stream.audioBufferSourceNode.buffer = null;
  stream.data = null;
}

function AIL_stream_playback_rate(stream: HSTREAM) {
  return Math.trunc(stream.audioBufferSourceNode.playbackRate.value * stream.context.sampleRate);
}

function AIL_set_stream_playback_rate(stream: HSTREAM, playbackRate: number) {
  stream.audioBufferSourceNode.playbackRate.value = (playbackRate !== 0 ? stream.context.sampleRate / playbackRate : 0);
}

function AIL_set_stream_pan(stream: HSTREAM, pan: number) {
  setPan(stream.stereoPannerNode, pan);
}

function AIL_stream_volume(stream: HSTREAM) {
  return getVolume(stream.gainNode);
}

function AIL_set_stream_volume(stream: HSTREAM, volume: number) {
  setVolume(stream.gainNode, volume);
}

function AIL_stream_status(stream: HSTREAM) {
  return stream.status;
}

function AIL_set_stream_loop_count(stream: HSTREAM, loops: number) {
  stream.loops = loops;
}

const RIFF = 0x46464952;
const WAVE = 0x45564157;
const FMT = 0x20746d66;
const DATA = 0x61746164;
const FACT = 0x74636166;

function decodeWav(buffer: Buffer): AudioBuffer | null {
  try {
  if (buffer.readUInt32LE(0) !== RIFF) {
    return null;
  }

  if (buffer.readUInt32LE(8) !== WAVE) {
    return null;
  }
  } catch(err) {
      console.warn(err);
  }

  let audioFormat = 0;
  let numberOfChannels = 0;
  let sampleRate = 0;
  let byteRate = 0;
  let blockAlign = 0;
  let bitsPerSample = 0;
  let samplesPerBlock = 0;
  let samplesCount = 0;

  let dataOffset = 0;
  let dataSize = 0;

  let offset = 12;
  let chunkTag = 0;
  let chunkSize = 0;

  while (offset < buffer.length) {
    chunkTag = buffer.readUInt32LE(offset); offset += 4;
    chunkSize = buffer.readUInt32LE(offset); offset += 4;

    switch (chunkTag) {
      case FMT:
        audioFormat = buffer.readUInt16LE(offset);
        numberOfChannels = buffer.readUInt16LE(offset + 2);
        sampleRate = buffer.readUInt32LE(offset + 4);
        byteRate = buffer.readUInt32LE(offset + 8);
        blockAlign = buffer.readUInt16LE(offset + 12);
        bitsPerSample = buffer.readUInt16LE(offset + 14);
        if (audioFormat === 0x0011 && chunkSize === 20) {
          samplesPerBlock = buffer.readUInt16LE(offset + 18);
        }
        break;
      case FACT:
        samplesCount = buffer.readUInt32LE(offset);
        break;
      case DATA:
        dataOffset = offset;
        dataSize = chunkSize;
        break;
    }

    offset += chunkSize + (chunkSize & 1);
  }

  if (samplesCount === 0) {
    samplesCount = (dataSize * 8) / (numberOfChannels * bitsPerSample);
  }

  if (audioFormat === 0x0001) {
    const numberOfFrames = dataSize / (bitsPerSample / 8) / numberOfChannels;

    const audioBuffer = new AudioBuffer({
      numberOfChannels,
      sampleRate,
      length: numberOfFrames,
    });

    const audioData = new Array(numberOfChannels);
    for (let ch = 0; ch < numberOfChannels; ch++) {
      audioData[ch] = audioBuffer.getChannelData(ch);
    }

    offset = dataOffset;
    if (bitsPerSample === 8) {
      for (let frame = 0; frame < numberOfFrames; frame++) {
        audioData[0][frame] = (buffer.readUInt8(offset++) - 128) / 128;
      }
    } else if (bitsPerSample === 16) {
      for (let frame = 0; frame < numberOfFrames; frame++) {
        for (let ch = 0; ch < numberOfChannels; ch++) {
          audioData[ch][frame] = buffer.readInt16LE(offset) / 32768;
          offset += 2;
        }
      }
    }

    return audioBuffer;
  } else if (audioFormat === 0x0011) {
    const numberOfFrames = (dataSize / blockAlign) * samplesPerBlock;

    const audioBuffer = new AudioBuffer({
      numberOfChannels,
      sampleRate,
      length: numberOfFrames,
    });

    const audioData = new Array(numberOfChannels);
    for (let ch = 0; ch < numberOfChannels; ch++) {
      audioData[ch] = audioBuffer.getChannelData(ch);
    }

    const decodingContext: WavDecodingContext = {
      predictor: 0,
      stepIndex: 0,
    };

    offset = dataOffset;

    let frame = 0;
    let numberOfBlocks = dataSize / blockAlign;
    while (numberOfBlocks--) {
      decodingContext.predictor = buffer.readInt16LE(offset); offset += 2;
      decodingContext.stepIndex = buffer.readUInt8(offset); offset += 2;

      for (let i = 4; i < blockAlign; i++) {
        const nibble = buffer.readUInt8(offset++);
        audioData[0][frame++] = adpcmDecode(decodingContext, nibble & 0x0F, 3) / 32768;
        audioData[0][frame++] = adpcmDecode(decodingContext, nibble >> 4, 3) / 32768;
      }
    }

    return audioBuffer;
  }

  return null;
}

const adpcmIndexTable = [
  -1, -1, -1, -1, 2, 4, 6, 8,
  -1, -1, -1, -1, 2, 4, 6, 8,
];

const adpcmStepTable = [
      7,     8,     9,    10,    11,    12,    13,    14,    16,    17,
     19,    21,    23,    25,    28,    31,    34,    37,    41,    45,
     50,    55,    60,    66,    73,    80,    88,    97,   107,   118,
    130,   143,   157,   173,   190,   209,   230,   253,   279,   307,
    337,   371,   408,   449,   494,   544,   598,   658,   724,   796,
    876,   963,  1060,  1166,  1282,  1411,  1552,  1707,  1878,  2066,
   2272,  2499,  2749,  3024,  3327,  3660,  4026,  4428,  4871,  5358,
   5894,  6484,  7132,  7845,  8630,  9493, 10442, 11487, 12635, 13899,
  15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767,
];

interface WavDecodingContext {
  predictor: number;
  stepIndex: number;
}

function adpcmDecode(context: WavDecodingContext, nibble: number, shift: number) {
  let stepIndex: number;
  let predictor: number;
  let sign: number;
  let delta: number;
  let diff: number;
  let step: number;

  step = adpcmStepTable[context.stepIndex];
  stepIndex = context.stepIndex + adpcmIndexTable[nibble];
  stepIndex = Math.min(Math.max(stepIndex, 0), 88);

  sign = nibble & 8;
  delta = nibble & 7;

  diff = ((2 * delta + 1) * step) >> shift;
  predictor = context.predictor;
  if (sign) {
    predictor -= diff;
  } else {
    predictor += diff;
  }

  context.predictor = Math.min(Math.max(predictor, -32767), 32768);
  context.stepIndex = stepIndex;

  return context.predictor;
}

}
