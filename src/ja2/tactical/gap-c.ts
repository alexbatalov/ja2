namespace ja2 {

function AudioGapListInit(zSoundFile: string /* Pointer<CHAR8> */, pGapList: Pointer<AudioGapList>): void {
  // This procedure will load in the appropriate .gap file, corresponding
  // to the .wav file in szSoundEffects indexed by uiSampleNum
  // The procedure will then allocate and load in the AUDIO_GAP information,
  // while counting the number of elements loaded

  //	FILE *pFile;
  let pFile: HWFILE;
  let pSourceFileName: string /* STR */;
  let pDestFileName: string /* STR */;
  let sFileName: string /* char[256] */;
  let counter: UINT8 = 0;
  let pCurrentGap: Pointer<AUDIO_GAP>;
  let pPreviousGap: Pointer<AUDIO_GAP>;
  let Start: UINT32;
  let uiNumBytesRead: UINT32;

  let End: UINT32;

  pSourceFileName = zSoundFile;
  pDestFileName = sFileName;
  // Initialize GapList
  pGapList.value.size = 0;
  pGapList.value.current_time = 0;
  pGapList.value.pHead = 0;
  pGapList.value.pCurrent = 0;
  pGapList.value.audio_gap_active = false;
  pPreviousGap = pCurrentGap = 0;
  // DebugMsg(TOPIC_JA2, DBG_LEVEL_3,String("File is %s", szSoundEffects[uiSampleNum]));
  // Get filename
  pDestFileName = pSourceFileName;
  // strip .wav and change to .gap

  while (pDestFileName[counter] != '.') {
    counter++;
  }

  pDestFileName[counter + 1] = 'g';
  pDestFileName[counter + 2] = 'a';
  pDestFileName[counter + 3] = 'p';
  pDestFileName[counter + 4] = '\0';

  pFile = FileOpen(pDestFileName, FILE_ACCESS_READ, false);
  if (pFile) {
    counter = 0;
    // gap file exists
    // now read in the AUDIO_GAPs

    // fread(&Start,sizeof(UINT32), 1, pFile);
    FileRead(pFile, addressof(Start), sizeof(UINT32), addressof(uiNumBytesRead));

    //	while ( !feof(pFile) )
    while (!FileCheckEndOfFile(pFile)) {
      // can read the first element, there exists a second
      // fread(&End, sizeof(UINT32),1,pFile);
      FileRead(pFile, addressof(End), sizeof(UINT32), addressof(uiNumBytesRead));

      // allocate space for AUDIO_GAP
      pCurrentGap = MemAlloc(sizeof(AUDIO_GAP));
      if (pPreviousGap != 0)
        pPreviousGap.value.pNext = pCurrentGap;
      else {
        // Start of list
        pGapList.value.pCurrent = pCurrentGap;
        pGapList.value.pHead = pCurrentGap;
      }

      pGapList.value.size++;
      pCurrentGap.value.pNext = 0;
      pCurrentGap.value.uiStart = Start;
      pCurrentGap.value.uiEnd = End;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap Start %d and Ends %d", Start, End));

      // Increment pointer
      pPreviousGap = pCurrentGap;

      //	fread(&Start,sizeof(UINT32), 1, pFile);
      FileRead(pFile, addressof(Start), sizeof(UINT32), addressof(uiNumBytesRead));
    }

    pGapList.value.audio_gap_active = false;
    pGapList.value.current_time = 0;

    // fclose(pFile);
    FileClose(pFile);
  }
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap List Started From File %s and has %d gaps", pDestFileName, pGapList.value.size));
}

export function AudioGapListDone(pGapList: Pointer<AudioGapList>): void {
  // This procedure will go through the  AudioGapList and free space/nullify pointers
  // for any allocated elements

  let pCurrent: Pointer<AUDIO_GAP>;
  let pNext: Pointer<AUDIO_GAP>;
  if (pGapList.value.pHead != 0) {
    pCurrent = pGapList.value.pHead;
    pNext = pCurrent.value.pNext;
    // There are elements in the list
    while (pNext != 0) {
      // kill pCurrent
      MemFree(pCurrent);
      pCurrent = pNext;
      pNext = pNext.value.pNext;
    }
    // now kill the last element
    MemFree(pCurrent);
    pCurrent = 0;
  }
  pGapList.value.pHead = 0;
  pGapList.value.pCurrent = 0;
  pGapList.value.size = 0;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Audio Gap List Deleted"));
}

export function PollAudioGap(uiSampleNum: UINT32, pGapList: Pointer<AudioGapList>): void {
  // This procedure will access the AudioGapList pertaining to the .wav about
  // to be played and sets the audio_gap_active flag. This is done by
  // going to the current AUDIO_GAP element in the AudioGapList, comparing to see if
  //	the current time is between the uiStart and uiEnd. If so, set flag..if not and
  // the uiStart of the next element is not greater than current time, set current to next and repeat
  // ...if next elements uiStart is larger than current_time, or no more elements..
  // set flag FALSE

  let time: UINT32;
  let pCurrent: Pointer<AUDIO_GAP>;

  if (!pGapList) {
    // no gap list, return
    return;
  }

  if (pGapList.value.size > 0) {
    time = SoundGetPosition(uiSampleNum);
    //  DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("Sound Sample Time is %d", time) );
  } else {
    pGapList.value.audio_gap_active = (false);
    return;
  }

  // set current ot head of gap list for this sound
  pCurrent = pGapList.value.pHead;

  // check to see if we have fallen behind
  if ((time > pCurrent.value.uiEnd)) {
    // fallen behind
    // catchup
    while (time > pCurrent.value.uiEnd) {
      pCurrent = pCurrent.value.pNext;
      if (!pCurrent) {
        pGapList.value.audio_gap_active = (false);
        return;
      }
    }
  }

  // check to see if time is within the next AUDIO_GAPs start time
  if ((time > pCurrent.value.uiStart) && (time < pCurrent.value.uiEnd)) {
    if ((time > pCurrent.value.uiStart) && (time < pCurrent.value.uiEnd)) {
      // we are within the time frame
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap Started at %d", time));
      pGapList.value.audio_gap_active = (true);
    } else if ((time > pCurrent.value.uiEnd) && (pGapList.value.audio_gap_active == true)) {
      // reset if already set
      pGapList.value.audio_gap_active = (false);
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap Ended at %d", time));
    }
  } else {
    pGapList.value.audio_gap_active = (false);
  }
}

export function PlayJA2GapSample(zSoundFile: string /* Pointer<CHAR8> */, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32, pData: Pointer<AudioGapList>): UINT32 {
  let spParms: SOUNDPARMS = createSoundParams();

  memset(addressof(spParms), 0xff, sizeof(SOUNDPARMS));

  spParms.uiSpeed = usRate;
  spParms.uiVolume = ((ubVolume / HIGHVOLUME) * GetSpeechVolume());
  spParms.uiLoop = ubLoops;
  spParms.uiPan = uiPan;
  spParms.uiPriority = GROUP_PLAYER;

  // Setup Gap Detection, if it is not null
  if (pData != null)
    AudioGapListInit(zSoundFile, pData);

  return SoundPlayStreamedFile(zSoundFile, addressof(spParms));
}

}
