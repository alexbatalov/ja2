//=================================================================================================
//	MouseSystem_Macros.h
//
//	Macro definitions for the "mousesystem" mouse region handler.
//
//	This file is included by "mousesystem.h" or can be included by itself.
//
//	Written by Bret Rowdon. Jan 30 '97
//=================================================================================================

const MouseSystemHook = (t, x, y, l, r) => MSYS_SGP_Mouse_Handler_Hook(t, x, y, l, r);

// Special prototype for mouse handler hook
extern void MSYS_SGP_Mouse_Handler_Hook(UINT16 Type, UINT16 Xcoord, UINT16 Ycoord, BOOLEAN LeftButton, BOOLEAN RightButton);
