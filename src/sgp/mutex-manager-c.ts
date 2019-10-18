//#define __MUTEX_TYPE

//
// Use defines to allocate slots in the mutex manager. Put these defines in LOCAL.H
//

CRITICAL_SECTION MutexTable[MAX_MUTEX_HANDLES];

BOOLEAN InitializeMutexManager(void) {
  UINT32 uiIndex;

  //
  // Make sure all mutex handles are opened
  //

  for (uiIndex = 0; uiIndex < MAX_MUTEX_HANDLES; uiIndex++) {
    InitializeCriticalSection(&MutexTable[uiIndex]);
  }

  RegisterDebugTopic(TOPIC_MUTEX, "Mutex Manager");

  return TRUE;
}

void ShutdownMutexManager(void) {
  UINT32 uiIndex;

  DbgMessage(TOPIC_MUTEX, DBG_LEVEL_0, "Shutting down the Mutex Manager");

  //
  // Make sure all mutex handles are closed
  //

  for (uiIndex = 0; uiIndex < MAX_MUTEX_HANDLES; uiIndex++) {
    DeleteCriticalSection(&MutexTable[uiIndex]);
  }

  UnRegisterDebugTopic(TOPIC_MUTEX, "Mutex Manager");
}

BOOLEAN InitializeMutex(UINT32 uiMutexIndex, UINT8 *ubMutexName) {
  // InitializeCriticalSection(&MutexTable[uiMutexIndex]);

  return TRUE;
}

BOOLEAN DeleteMutex(UINT32 uiMutexIndex) {
  // DeleteCriticalSection(&MutexTable[uiMutexIndex]);

  return TRUE;
}

BOOLEAN EnterMutex(UINT32 uiMutexIndex, INT32 nLine, char *szFilename) {
  EnterCriticalSection(&MutexTable[uiMutexIndex]);
  return TRUE;
}

BOOLEAN EnterMutexWithTimeout(UINT32 uiMutexIndex, UINT32 uiTimeout, INT32 nLine, char *szFilename) {
  EnterCriticalSection(&MutexTable[uiMutexIndex]);
  return TRUE;
}

BOOLEAN LeaveMutex(UINT32 uiMutexIndex, INT32 nLine, char *szFilename) {
  LeaveCriticalSection(&MutexTable[uiMutexIndex]);

  return TRUE;
}
