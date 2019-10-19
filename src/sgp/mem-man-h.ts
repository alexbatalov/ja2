//**************************************************************************
//
// Filename :	MemMan.h
//
//	Purpose :	prototypes for the memory manager
//
// Modification history :
//
//		11sep96:HJH				- Creation
//
//**************************************************************************

//**************************************************************************
//
//				Includes
//
//**************************************************************************

//**************************************************************************
//
//				Defines
//
//**************************************************************************

//**************************************************************************
//
//				Typedefs
//
//**************************************************************************

//**************************************************************************
//
//				Function Prototypes
//
//**************************************************************************

extern UINT32 MemDebugCounter;
extern UINT32 guiMemTotal;
extern UINT32 guiMemAlloced;
extern UINT32 guiMemFreed;

extern BOOLEAN InitializeMemoryManager(void);
extern void MemDebug(BOOLEAN f);
extern void ShutdownMemoryManager(void);

// Creates and adds a video object to list
const MemAlloc = (size) => malloc((size));
const MemFree = (ptr) => free((ptr));
const MemRealloc = (ptr, size) => realloc((ptr), (size));

extern PTR *MemAllocLocked(UINT32 size);
extern void MemFreeLocked(PTR, UINT32 size);

// get total free on the system at this moment
extern UINT32 MemGetFree(void);

// get the total on the system
extern UINT32 MemGetTotalSystem(void);

extern BOOLEAN MemCheckPool(void);
