namespace ja2 {

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

export const PROFILE = (x) => {
  guiProfileStart = GetTickCount();
  guiExecutions = x;
  for (giProfileCount = 0; giProfileCount < x; giProfileCount++);
};

const PROFILE_REPORT = () => {
  guiProfileTime = (GetTickCount() - guiProfileStart);
  _RPT3(_CRT_WARN, "*** PROFILE REPORT: %d executions took %dms, average of %.2fms per iteration.\n", guiExecutions, guiProfileTime, guiProfileTime / guiExecutions);
};

export const Assert = (a) => {};
export const AssertMsg = (a, b) => {};

//*******************************************************************************************

// Moved these out of the defines - debug mgr always initialized
export const InitializeDebugManager = () => DbgInitialize();
export const ShutdownDebugManager = () => DbgShutdown();

//*******************************************************************************************
// Release Mode
//*******************************************************************************************
const DebugBreakpoint = () => {};

export const RegisterDebugTopic = (a, b) => {};
export const UnRegisterDebugTopic = (a, b) => {};
export const ClearAllDebugTopics = () => {};

export const FastDebugMsg = (a) => {};
export const ErrorMsg = (a) => {};

const DbgTopicRegistration = (a, b, c) => {};
export const DbgMessage = (a, b, c) => {};

export const RegisterJA2DebugTopic = (a, b) => {};
export const DebugMsg = (a, b, c) => {};

//*******************************************************************************************

}
