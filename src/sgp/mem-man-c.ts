//**************************************************************************
//
// Filename :	MemMan.cpp
//
//	Purpose :	function definitions for the memory manager
//
// Modification history :
//
//		11sep96:HJH	- Creation
//    29may97:ARM - Fix & improve MemDebugCounter handling, logging of
//                    MemAlloc/MemFree, and reporting of any errors
//
//**************************************************************************

//**************************************************************************
//
//				Includes
//
//**************************************************************************

//**************************************************************************
//
//				Variables
//
//**************************************************************************

let gzJA2ScreenNames: STR16[] /* [] */ = [
  "EDIT_SCREEN",
  "SAVING_SCREEN",
  "LOADING_SCREEN",
  "ERROR_SCREEN",
  "INIT_SCREEN",
  "GAME_SCREEN",
  "ANIEDIT_SCREEN",
  "PALEDIT_SCREEN",
  "DEBUG_SCREEN",
  "MAP_SCREEN",
  "LAPTOP_SCREEN",
  "LOADSAVE_SCREEN",
  "MAPUTILITY_SCREEN",
  "FADE_SCREEN",
  "MSG_BOX_SCREEN",
  "MAINMENU_SCREEN",
  "AUTORESOLVE_SCREEN",
  "SAVE_LOAD_SCREEN",
  "OPTIONS_SCREEN",
  "SHOPKEEPER_SCREEN",
  "SEX_SCREEN",
  "GAME_INIT_OPTIONS_SCREEN",
  "DEMO_EXIT_SCREEN",
  "INTRO_SCREEN",
  "CREDIT_SCREEN",
];

/* static */ let gfMemDebug: BOOLEAN = TRUE;
// debug variable for total memory currently allocated
let guiMemTotal: UINT32 = 0;
let guiMemAlloced: UINT32 = 0;
let guiMemFreed: UINT32 = 0;
let MemDebugCounter: UINT32 = 0;
let fMemManagerInit: BOOLEAN = FALSE;

//**************************************************************************
//
//				Function Prototypes
//
//**************************************************************************

//**************************************************************************
//
//				Functions
//
//**************************************************************************

//**************************************************************************
//
// MemInit
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		12sep96:HJH		-> modified for use by Wizardry
//
//**************************************************************************

function InitializeMemoryManager(): BOOLEAN {
  // Register the memory manager with the debugger
  RegisterDebugTopic(TOPIC_MEMORY_MANAGER, "Memory Manager");
  MemDebugCounter = 0;
  guiMemTotal = 0;
  guiMemAlloced = 0;
  guiMemFreed = 0;
  fMemManagerInit = TRUE;

  return TRUE;
}

//**************************************************************************
//
// MemDebug
//
//		To set whether or not we should print debug info.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		12sep96:HJH		-> modified for use by Wizardry
//
//**************************************************************************

function MemDebug(f: BOOLEAN): void {
  gfMemDebug = f;
}

//**************************************************************************
//
// MemShutdown
//
//		Shuts down the memory manager.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		12sep96:HJH		-> modified for use by Wizardry
//
//**************************************************************************

function ShutdownMemoryManager(): void {
  if (MemDebugCounter != 0) {
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String(" "));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("***** WARNING - WARNING - WARNING *****"));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("***** WARNING - WARNING - WARNING *****"));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("***** WARNING - WARNING - WARNING *****"));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String(" "));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("  >>>>> MEMORY LEAK DETECTED!!! <<<<<  "));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("%d memory blocks still allocated", MemDebugCounter));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("%d bytes memory total STILL allocated", guiMemTotal));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("%d bytes memory total was allocated", guiMemAlloced));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("%d bytes memory total was freed", guiMemFreed));

    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String(" "));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("***** WARNING - WARNING - WARNING *****"));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("***** WARNING - WARNING - WARNING *****"));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("***** WARNING - WARNING - WARNING *****"));
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String(" "));
  }

  UnRegisterDebugTopic(TOPIC_MEMORY_MANAGER, "Memory Manager Un-initialized");

  fMemManagerInit = FALSE;
}

function MemAllocLocked(uiSize: UINT32): Pointer<PTR> {
  let ptr: PTR;

  if (!fMemManagerInit)
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("MemAllocLocked: Warning -- Memory manager not initialized!!! "));

  ptr = VirtualAlloc(NULL, uiSize, MEM_COMMIT, PAGE_READWRITE);

  if (ptr) {
    VirtualLock(ptr, uiSize);

    guiMemTotal += uiSize;
    guiMemAlloced += uiSize;
    MemDebugCounter++;
  } else {
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("MemAllocLocked failed: %d bytes", uiSize));
  }

  return ptr;
}

function MemFreeLocked(ptr: PTR, uiSize: UINT32): void {
  if (!fMemManagerInit)
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("MemFreeLocked: Warning -- Memory manager not initialized!!! "));

  if (ptr != NULL) {
    VirtualUnlock(ptr, uiSize);
    VirtualFree(ptr, uiSize, MEM_RELEASE);

    guiMemTotal -= uiSize;
    guiMemFreed += uiSize;
  } else {
    DbgMessage(TOPIC_MEMORY_MANAGER, DBG_LEVEL_0, String("MemFreeLocked ERROR: NULL ptr received, size %d", uiSize));
  }

  // count even a NULL ptr as a MemFree, not because it's really a memory leak, but because it is still an error of some
  // sort (nobody should ever be freeing NULL pointers), and this will help in tracking it down if the above DbgMessage
  // is not noticed.
  MemDebugCounter--;
}

//**************************************************************************
//
// MemGetFree
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		??sep96:HJH		-> modified for use by Wizardry
//
//**************************************************************************

function MemGetFree(): UINT32 {
  let ms: MEMORYSTATUS;

  ms.dwLength = sizeof(MEMORYSTATUS);
  GlobalMemoryStatus(addressof(ms));

  return ms.dwAvailPhys;
}

//**************************************************************************
//
// MemGetTotalSystem
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		May98:HJH		-> Carter
//
//**************************************************************************

function MemGetTotalSystem(): UINT32 {
  let ms: MEMORYSTATUS;

  ms.dwLength = sizeof(MEMORYSTATUS);
  GlobalMemoryStatus(addressof(ms));

  return ms.dwTotalPhys;
}

//**************************************************************************
//
// MemCheckPool
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		23sep96:HJH		-> modified for use by Wizardry
//
//**************************************************************************

function MemCheckPool(): BOOLEAN {
  let fRet: BOOLEAN = TRUE;

  return fRet;
}
