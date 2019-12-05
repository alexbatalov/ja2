namespace ja2 {

function AudioGapListInit(zSoundFile: string /* Pointer<CHAR8> */, pGapList: AudioGapList): void {
  // This procedure will load in the appropriate .gap file, corresponding
  // to the .wav file in szSoundEffects indexed by uiSampleNum
  // The procedure will then allocate and load in the AUDIO_GAP information,
  // while counting the number of elements loaded

  //	FILE *pFile;
  let pFile: HWFILE;
  let pSourceFileName: string /* STR */;
  let pDestFileName: string /* STR */;
  let sFileName: string /* char[256] */ = '';
  let counter: UINT8 = 0;
  let pCurrentGap: AUDIO_GAP | null = null;
  let pPreviousGap: AUDIO_GAP | null = null;
  let Start: UINT32;
  let uiNumBytesRead: UINT32;

  let End: UINT32;
  let buffer: Buffer;

  pSourceFileName = zSoundFile;
  pDestFileName = sFileName;
  // Initialize GapList
  pGapList.size = 0;
  pGapList.current_time = 0;
  pGapList.pHead = null;
  pGapList.pCurrent = null;
  pGapList.audio_gap_active = false;
  pPreviousGap = pCurrentGap = null;
  // DebugMsg(TOPIC_JA2, DBG_LEVEL_3,String("File is %s", szSoundEffects[uiSampleNum]));
  // Get filename
  pDestFileName = pSourceFileName;
  // strip .wav and change to .gap

  while (pDestFileName[counter] != '.') {
    counter++;
  }

  pDestFileName = pDestFileName.substring(0, counter + 1) + 'gap';

  pFile = FileOpen(pDestFileName, FILE_ACCESS_READ, false);
  if (pFile) {
    counter = 0;
    // gap file exists
    // now read in the AUDIO_GAPs

    buffer = Buffer.allocUnsafe(4);

    // fread(&Start,sizeof(UINT32), 1, pFile);
    uiNumBytesRead = FileRead(pFile, buffer, 4);
    Start = buffer.readUInt32LE(0);

    //	while ( !feof(pFile) )
    while (!FileCheckEndOfFile(pFile)) {
      // can read the first element, there exists a second
      // fread(&End, sizeof(UINT32),1,pFile);
      uiNumBytesRead = FileRead(pFile, buffer, 4);
      End = buffer.readUInt32LE(0);

      // allocate space for AUDIO_GAP
      pCurrentGap = createAudioGap();
      if (pPreviousGap != null)
        pPreviousGap.pNext = pCurrentGap;
      else {
        // Start of list
        pGapList.pCurrent = pCurrentGap;
        pGapList.pHead = pCurrentGap;
      }

      pGapList.size++;
      pCurrentGap.pNext = null;
      pCurrentGap.uiStart = Start;
      pCurrentGap.uiEnd = End;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Gap Start %d and Ends %d", Start, End));

      // Increment pointer
      pPreviousGap = pCurrentGap;

      //	fread(&Start,sizeof(UINT32), 1, pFile);
      uiNumBytesRead = FileRead(pFile, buffer, 4);
      Start = buffer.readUInt32LE(0);
    }

    pGapList.audio_gap_active = false;
    pGapList.current_time = 0;

    // fclose(pFile);
    FileClose(pFile);
  }
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Gap List Started From File %s and has %d gaps", pDestFileName, pGapList.size));
}

export function AudioGapListDone(pGapList: AudioGapList): void {
  // This procedure will go through the  AudioGapList and free space/nullify pointers
  // for any allocated elements

  let pCurrent: AUDIO_GAP | null;
  let pNext: AUDIO_GAP | null;
  if (pGapList.pHead != null) {
    pCurrent = pGapList.pHead;
    pNext = pCurrent.pNext;
    // There are elements in the list
    while (pNext != null) {
      // kill pCurrent
      pCurrent = pNext;
      pNext = pNext.pNext;
    }
    // now kill the last element
    pCurrent = null;
  }
  pGapList.pHead = null;
  pGapList.pCurrent = null;
  pGapList.size = 0;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Audio Gap List Deleted"));
}

export function PollAudioGap(uiSampleNum: UINT32, pGapList: AudioGapList): void {
  // This procedure will access the AudioGapList pertaining to the .wav about
  // to be played and sets the audio_gap_active flag. This is done by
  // going to the current AUDIO_GAP element in the AudioGapList, comparing to see if
  //	the current time is between the uiStart and uiEnd. If so, set flag..if not and
  // the uiStart of the next element is not greater than current time, set current to next and repeat
  // ...if next elements uiStart is larger than current_time, or no more elements..
  // set flag FALSE

  let time: UINT32;
  let pCurrent: AUDIO_GAP | null;

  if (!pGapList) {
    // no gap list, return
    return;
  }

  if (pGapList.size > 0) {
    time = SoundGetPosition(uiSampleNum);
    //  DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("Sound Sample Time is %d", time) );
  } else {
    pGapList.audio_gap_active = (false);
    return;
  }

  // set current ot head of gap list for this sound
  pCurrent = pGapList.pHead;
  Assert(pCurrent);

  // check to see if we have fallen behind
  if ((time > pCurrent.uiEnd)) {
    // fallen behind
    // catchup
    while (time > pCurrent.uiEnd) {
      pCurrent = pCurrent.pNext;
      if (!pCurrent) {
        pGapList.audio_gap_active = (false);
        return;
      }
    }
  }

  // check to see if time is within the next AUDIO_GAPs start time
  if ((time > pCurrent.uiStart) && (time < pCurrent.uiEnd)) {
    if ((time > pCurrent.uiStart) && (time < pCurrent.uiEnd)) {
      // we are within the time frame
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Gap Started at %d", time));
      pGapList.audio_gap_active = (true);
    } else if ((time > pCurrent.uiEnd) && (pGapList.audio_gap_active == true)) {
      // reset if already set
      pGapList.audio_gap_active = (false);
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Gap Ended at %d", time));
    }
  } else {
    pGapList.audio_gap_active = (false);
  }
}

export function PlayJA2GapSample(zSoundFile: string /* Pointer<CHAR8> */, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32, pData: AudioGapList | null): UINT32 {
  let spParms: SOUNDPARMS = createSoundParams();

  spParms.uiSpeed = usRate;
  spParms.uiVolume = ((ubVolume / HIGHVOLUME) * GetSpeechVolume());
  spParms.uiLoop = ubLoops;
  spParms.uiPan = uiPan;
  spParms.uiPriority = GROUP_PLAYER;

  // Setup Gap Detection, if it is not null
  if (pData != null)
    AudioGapListInit(zSoundFile, pData);

  return SoundPlayStreamedFile(zSoundFile, spParms);
}

}
