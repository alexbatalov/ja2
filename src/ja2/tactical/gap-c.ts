function AudioGapListInit(zSoundFile: Pointer<CHAR8>, pGapList: Pointer<AudioGapList>): void {
  // This procedure will load in the appropriate .gap file, corresponding
  // to the .wav file in szSoundEffects indexed by uiSampleNum
  // The procedure will then allocate and load in the AUDIO_GAP information,
  // while counting the number of elements loaded

  //	FILE *pFile;
  let pFile: HWFILE;
  let pSourceFileName: STR;
  let pDestFileName: STR;
  let sFileName: char[] /* [256] */;
  let counter: UINT8 = 0;
  let pCurrentGap: Pointer<AUDIO_GAP>;
  let pPreviousGap: Pointer<AUDIO_GAP>;
  let Start: UINT32;
  let uiNumBytesRead: UINT32;

  let End: UINT32;

  pSourceFileName = zSoundFile;
  pDestFileName = sFileName;
  // Initialize GapList
  pGapList->size = 0;
  pGapList->current_time = 0;
  pGapList->pHead = 0;
  pGapList->pCurrent = 0;
  pGapList->audio_gap_active = FALSE;
  pPreviousGap = pCurrentGap = 0;
  // DebugMsg(TOPIC_JA2, DBG_LEVEL_3,String("File is %s", szSoundEffects[uiSampleNum]));
  // Get filename
  strcpy(pDestFileName, pSourceFileName);
  // strip .wav and change to .gap

  while (pDestFileName[counter] != '.') {
    counter++;
  }

  pDestFileName[counter + 1] = 'g';
  pDestFileName[counter + 2] = 'a';
  pDestFileName[counter + 3] = 'p';
  pDestFileName[counter + 4] = '\0';

  pFile = FileOpen(pDestFileName, FILE_ACCESS_READ, FALSE);
  if (pFile) {
    counter = 0;
    // gap file exists
    // now read in the AUDIO_GAPs

    // fread(&Start,sizeof(UINT32), 1, pFile);
    FileRead(pFile, &Start, sizeof(UINT32), &uiNumBytesRead);

    //	while ( !feof(pFile) )
    while (!FileCheckEndOfFile(pFile)) {
      // can read the first element, there exists a second
      // fread(&End, sizeof(UINT32),1,pFile);
      FileRead(pFile, &End, sizeof(UINT32), &uiNumBytesRead);

      // allocate space for AUDIO_GAP
      pCurrentGap = MemAlloc(sizeof(AUDIO_GAP));
      if (pPreviousGap != 0)
        pPreviousGap->pNext = pCurrentGap;
      else {
        // Start of list
        pGapList->pCurrent = pCurrentGap;
        pGapList->pHead = pCurrentGap;
      }

      pGapList->size++;
      pCurrentGap->pNext = 0;
      pCurrentGap->uiStart = Start;
      pCurrentGap->uiEnd = End;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap Start %d and Ends %d", Start, End));

      // Increment pointer
      pPreviousGap = pCurrentGap;

      //	fread(&Start,sizeof(UINT32), 1, pFile);
      FileRead(pFile, &Start, sizeof(UINT32), &uiNumBytesRead);
    }

    pGapList->audio_gap_active = FALSE;
    pGapList->current_time = 0;

    // fclose(pFile);
    FileClose(pFile);
  }
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap List Started From File %s and has %d gaps", pDestFileName, pGapList->size));
}

function AudioGapListDone(pGapList: Pointer<AudioGapList>): void {
  // This procedure will go through the  AudioGapList and free space/nullify pointers
  // for any allocated elements

  let pCurrent: Pointer<AUDIO_GAP>;
  let pNext: Pointer<AUDIO_GAP>;
  if (pGapList->pHead != 0) {
    pCurrent = pGapList->pHead;
    pNext = pCurrent->pNext;
    // There are elements in the list
    while (pNext != 0) {
      // kill pCurrent
      MemFree(pCurrent);
      pCurrent = pNext;
      pNext = pNext->pNext;
    }
    // now kill the last element
    MemFree(pCurrent);
    pCurrent = 0;
  }
  pGapList->pHead = 0;
  pGapList->pCurrent = 0;
  pGapList->size = 0;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Audio Gap List Deleted"));
}

function PollAudioGap(uiSampleNum: UINT32, pGapList: Pointer<AudioGapList>): void {
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

  if (pGapList->size > 0) {
    time = SoundGetPosition(uiSampleNum);
    //  DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("Sound Sample Time is %d", time) );
  } else {
    pGapList->audio_gap_active = (FALSE);
    return;
  }

  // set current ot head of gap list for this sound
  pCurrent = pGapList->pHead;

  // check to see if we have fallen behind
  if ((time > pCurrent->uiEnd)) {
    // fallen behind
    // catchup
    while (time > pCurrent->uiEnd) {
      pCurrent = pCurrent->pNext;
      if (!pCurrent) {
        pGapList->audio_gap_active = (FALSE);
        return;
      }
    }
  }

  // check to see if time is within the next AUDIO_GAPs start time
  if ((time > pCurrent->uiStart) && (time < pCurrent->uiEnd)) {
    if ((time > pCurrent->uiStart) && (time < pCurrent->uiEnd)) {
      // we are within the time frame
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap Started at %d", time));
      pGapList->audio_gap_active = (TRUE);
    } else if ((time > pCurrent->uiEnd) && (pGapList->audio_gap_active == TRUE)) {
      // reset if already set
      pGapList->audio_gap_active = (FALSE);
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Gap Ended at %d", time));
    }
  } else {
    pGapList->audio_gap_active = (FALSE);
  }
}

function PlayJA2GapSample(zSoundFile: Pointer<CHAR8>, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32, pData: Pointer<AudioGapList>): UINT32 {
  let spParms: SOUNDPARMS;

  memset(&spParms, 0xff, sizeof(SOUNDPARMS));

  spParms.uiSpeed = usRate;
  spParms.uiVolume = (UINT32)((ubVolume / (FLOAT)HIGHVOLUME) * GetSpeechVolume());
  spParms.uiLoop = ubLoops;
  spParms.uiPan = uiPan;
  spParms.uiPriority = GROUP_PLAYER;

  // Setup Gap Detection, if it is not null
  if (pData != NULL)
    AudioGapListInit(zSoundFile, pData);

  return SoundPlayStreamedFile(zSoundFile, &spParms);
}
