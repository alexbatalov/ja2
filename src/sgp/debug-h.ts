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

const INVALID_TOPIC = 0xffff;
const MAX_TOPICS_ALLOTED = 1024;

const PROFILE = (x) => {
  guiProfileStart = GetTickCount();
  guiExecutions = x;
  for (giProfileCount = 0; giProfileCount < x; giProfileCount++);
};

const PROFILE_REPORT = () => {
  guiProfileTime = (GetTickCount() - guiProfileStart);
  _RPT3(_CRT_WARN, "*** PROFILE REPORT: %d executions took %dms, average of %.2fms per iteration.\n", guiExecutions, guiProfileTime, (FLOAT)guiProfileTime / guiExecutions);
};

const Assert = (a) => {};
const AssertMsg = (a, b) => {};

//*******************************************************************************************

// Moved these out of the defines - debug mgr always initialized
const InitializeDebugManager = () => DbgInitialize();
const ShutdownDebugManager = () => DbgShutdown();

//*******************************************************************************************
// Release Mode
//*******************************************************************************************
const DebugBreakpoint = () => {};

const RegisterDebugTopic = (a, b) => {};
const UnRegisterDebugTopic = (a, b) => {};
const ClearAllDebugTopics = () => {};

const FastDebugMsg = (a) => {};
const ErrorMsg = (a) => {};

const DbgTopicRegistration = (a, b, c) => {};
const DbgMessage = (a, b, c) => {};

const RegisterJA2DebugTopic = (a, b) => {};
const DebugMsg = (a, b, c) => {};

//*******************************************************************************************
