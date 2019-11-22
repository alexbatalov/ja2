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

export function Assert(condition: any): asserts condition {
  AssertMsg(condition, 'Should be unreachable');
}

export function AssertMsg(condition: any, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

//*******************************************************************************************

// Moved these out of the defines - debug mgr always initialized
export const InitializeDebugManager = () => {};
export const ShutdownDebugManager = () => {};

//*******************************************************************************************
// Release Mode
//*******************************************************************************************
const DebugBreakpoint = () => {};

export const RegisterDebugTopic = (a: number, b: string) => {};
export const UnRegisterDebugTopic = (a: number, b: string) => {};
export const ClearAllDebugTopics = () => {};

export const FastDebugMsg = (a: string) => {};
export const ErrorMsg = (a: string) => {};

const DbgTopicRegistration = (a: number, b: number, c: string) => {};
export const DbgMessage = (a: number, b: number, c: string) => {};

export const RegisterJA2DebugTopic = (a: number, b: string) => {};
export const DebugMsg = (a: number, b: number, c: string) => {};

//*******************************************************************************************

}
