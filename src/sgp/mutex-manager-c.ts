//#define __MUTEX_TYPE

//
// Use defines to allocate slots in the mutex manager. Put these defines in LOCAL.H
//

let MutexTable: CRITICAL_SECTION[] /* [MAX_MUTEX_HANDLES] */;

function InitializeMutexManager(): BOOLEAN {
  let uiIndex: UINT32;

  //
  // Make sure all mutex handles are opened
  //

  for (uiIndex = 0; uiIndex < MAX_MUTEX_HANDLES; uiIndex++) {
    InitializeCriticalSection(addressof(MutexTable[uiIndex]));
  }

  RegisterDebugTopic(TOPIC_MUTEX, "Mutex Manager");

  return TRUE;
}

function ShutdownMutexManager(): void {
  let uiIndex: UINT32;

  DbgMessage(TOPIC_MUTEX, DBG_LEVEL_0, "Shutting down the Mutex Manager");

  //
  // Make sure all mutex handles are closed
  //

  for (uiIndex = 0; uiIndex < MAX_MUTEX_HANDLES; uiIndex++) {
    DeleteCriticalSection(addressof(MutexTable[uiIndex]));
  }

  UnRegisterDebugTopic(TOPIC_MUTEX, "Mutex Manager");
}

function InitializeMutex(uiMutexIndex: UINT32, ubMutexName: Pointer<UINT8>): BOOLEAN {
  // InitializeCriticalSection(&MutexTable[uiMutexIndex]);

  return TRUE;
}

function DeleteMutex(uiMutexIndex: UINT32): BOOLEAN {
  // DeleteCriticalSection(&MutexTable[uiMutexIndex]);

  return TRUE;
}

function EnterMutex(uiMutexIndex: UINT32, nLine: INT32, szFilename: Pointer<char>): BOOLEAN {
  EnterCriticalSection(addressof(MutexTable[uiMutexIndex]));
  return TRUE;
}

function EnterMutexWithTimeout(uiMutexIndex: UINT32, uiTimeout: UINT32, nLine: INT32, szFilename: Pointer<char>): BOOLEAN {
  EnterCriticalSection(addressof(MutexTable[uiMutexIndex]));
  return TRUE;
}

function LeaveMutex(uiMutexIndex: UINT32, nLine: INT32, szFilename: Pointer<char>): BOOLEAN {
  LeaveCriticalSection(addressof(MutexTable[uiMutexIndex]));

  return TRUE;
}
