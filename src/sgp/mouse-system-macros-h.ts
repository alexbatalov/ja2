namespace ja2 {

//=================================================================================================
//	MouseSystem_Macros.h
//
//	Macro definitions for the "mousesystem" mouse region handler.
//
//	This file is included by "mousesystem.h" or can be included by itself.
//
//	Written by Bret Rowdon. Jan 30 '97
//=================================================================================================

export const MouseSystemHook = (t: UINT16, x: UINT16, y: UINT16, l: boolean, r: boolean) => MSYS_SGP_Mouse_Handler_Hook(t, x, y, l, r);

}
