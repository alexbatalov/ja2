namespace ja2 {

//#define __MUTEX_TYPE

//
// Use defines to allocate slots in the mutex manager. Put these defines in LOCAL.H
//

let MutexTable: CRITICAL_SECTION[] /* [MAX_MUTEX_HANDLES] */;

export function InitializeMutexManager(): boolean {
  let uiIndex: UINT32;

  //
  // Make sure all mutex handles are opened
  //

  for (uiIndex = 0; uiIndex < MAX_MUTEX_HANDLES; uiIndex++) {
    InitializeCriticalSection(addressof(MutexTable[uiIndex]));
  }

  RegisterDebugTopic(TOPIC_MUTEX, "Mutex Manager");

  return true;
}

export function ShutdownMutexManager(): void {
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

export function InitializeMutex(uiMutexIndex: UINT32, ubMutexName: Pointer<UINT8>): boolean {
  // InitializeCriticalSection(&MutexTable[uiMutexIndex]);

  return true;
}

function DeleteMutex(uiMutexIndex: UINT32): boolean {
  // DeleteCriticalSection(&MutexTable[uiMutexIndex]);

  return true;
}

function EnterMutex(uiMutexIndex: UINT32, nLine: INT32, szFilename: Pointer<char>): boolean {
  EnterCriticalSection(addressof(MutexTable[uiMutexIndex]));
  return true;
}

function EnterMutexWithTimeout(uiMutexIndex: UINT32, uiTimeout: UINT32, nLine: INT32, szFilename: Pointer<char>): boolean {
  EnterCriticalSection(addressof(MutexTable[uiMutexIndex]));
  return true;
}

function LeaveMutex(uiMutexIndex: UINT32, nLine: INT32, szFilename: Pointer<char>): boolean {
  LeaveCriticalSection(addressof(MutexTable[uiMutexIndex]));

  return true;
}

}
