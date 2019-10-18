//**************************************************************************
//
// Filename :	debug.h
//
//	Purpose :	prototypes for the debug manager
//
// Modification history :
//
//		xxxxx96:LH				- Creation
//		xxnov96:HJH				- made it work
//
//**************************************************************************

#define INVALID_TOPIC 0xffff
#define MAX_TOPICS_ALLOTED 1024

extern BOOLEAN gfRecordToFile;
extern BOOLEAN gfRecordToDebugger;
extern UINT32 guiProfileStart, guiExecutions, guiProfileTime;
extern INT32 giProfileCount;

#define PROFILE(x) \
  guiProfileStart = GetTickCount(); \
  guiExecutions = x; \
  for (giProfileCount = 0; giProfileCount < x; giProfileCount++)

#define PROFILE_REPORT() \
  guiProfileTime = (GetTickCount() - guiProfileStart); \
  _RPT3(_CRT_WARN, "*** PROFILE REPORT: %d executions took %dms, average of %.2fms per iteration.\n", guiExecutions, guiProfileTime, (FLOAT)guiProfileTime / guiExecutions);

extern void _Null(void);
extern UINT8 *String(const char *String, ...);

#define Assert(a)
#define AssertMsg(a, b)

//*******************************************************************************************

// Moved these out of the defines - debug mgr always initialized
#define InitializeDebugManager() DbgInitialize()
#define ShutdownDebugManager() DbgShutdown()

extern BOOLEAN DbgInitialize(void);
extern void DbgShutdown(void);

//*******************************************************************************************
// Release Mode
//*******************************************************************************************
#define DebugBreakpoint()

#define RegisterDebugTopic(a, b)
#define UnRegisterDebugTopic(a, b)
#define ClearAllDebugTopics()

#define FastDebugMsg(a)
#define ErrorMsg(a)

#define DbgTopicRegistration(a, b, c) ;
#define DbgMessage(a, b, c)

#define RegisterJA2DebugTopic(a, b)
#define DebugMsg(a, b, c)

//*******************************************************************************************
