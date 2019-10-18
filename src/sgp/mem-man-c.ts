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

STR16 gzJA2ScreenNames[] = {
  L"EDIT_SCREEN",
  L"SAVING_SCREEN",
  L"LOADING_SCREEN",
  L"ERROR_SCREEN",
  L"INIT_SCREEN",
  L"GAME_SCREEN",
  L"ANIEDIT_SCREEN",
  L"PALEDIT_SCREEN",
  L"DEBUG_SCREEN",
  L"MAP_SCREEN",
  L"LAPTOP_SCREEN",
  L"LOADSAVE_SCREEN",
  L"MAPUTILITY_SCREEN",
  L"FADE_SCREEN",
  L"MSG_BOX_SCREEN",
  L"MAINMENU_SCREEN",
  L"AUTORESOLVE_SCREEN",
  L"SAVE_LOAD_SCREEN",
  L"OPTIONS_SCREEN",
  L"SHOPKEEPER_SCREEN",
  L"SEX_SCREEN",
  L"GAME_INIT_OPTIONS_SCREEN",
  L"DEMO_EXIT_SCREEN",
  L"INTRO_SCREEN",
  L"CREDIT_SCREEN",
};

static BOOLEAN gfMemDebug = TRUE;
// debug variable for total memory currently allocated
UINT32 guiMemTotal = 0;
UINT32 guiMemAlloced = 0;
UINT32 guiMemFreed = 0;
UINT32 MemDebugCounter = 0;
BOOLEAN fMemManagerInit = FALSE;

//**************************************************************************
//
//				Function Prototypes
//
//**************************************************************************

void DebugPrint(void);

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

BOOLEAN InitializeMemoryManager(void) {
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

void MemDebug(BOOLEAN f) {
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

void ShutdownMemoryManager(void) {
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

PTR *MemAllocLocked(UINT32 uiSize) {
  PTR ptr;

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

void MemFreeLocked(PTR ptr, UINT32 uiSize) {
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

UINT32 MemGetFree(void) {
  MEMORYSTATUS ms;

  ms.dwLength = sizeof(MEMORYSTATUS);
  GlobalMemoryStatus(&ms);

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

UINT32 MemGetTotalSystem(void) {
  MEMORYSTATUS ms;

  ms.dwLength = sizeof(MEMORYSTATUS);
  GlobalMemoryStatus(&ms);

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

BOOLEAN MemCheckPool(void) {
  BOOLEAN fRet = TRUE;

  return fRet;
}
