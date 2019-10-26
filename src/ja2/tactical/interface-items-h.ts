namespace ja2 {

// DEFINES FOR ITEM SLOT SIZES IN PIXELS
export const BIG_INV_SLOT_WIDTH = 61;
export const BIG_INV_SLOT_HEIGHT = 22;
export const SM_INV_SLOT_WIDTH = 30;
export const SM_INV_SLOT_HEIGHT = 23;
export const VEST_INV_SLOT_WIDTH = 43;
export const VEST_INV_SLOT_HEIGHT = 24;
export const LEGS_INV_SLOT_WIDTH = 43;
export const LEGS_INV_SLOT_HEIGHT = 24;
export const HEAD_INV_SLOT_WIDTH = 43;
export const HEAD_INV_SLOT_HEIGHT = 24;

// A STRUCT USED INTERNALLY FOR INV SLOT REGIONS
export interface INV_REGIONS {
  fBigPocket: boolean;
  sBarDx: INT16;
  sBarDy: INT16;
  sWidth: INT16;
  sHeight: INT16;
  sX: INT16; // starts at 0, gets set via InitInvSlotInterface()
  sY: INT16; // starts at 0, gets set via InitInvSlotInterface()
}

// USED TO SETUP REGION POSITIONS, ETC
export interface INV_REGION_DESC {
  sX: INT16;
  sY: INT16;
}

// THIS FUNCTION IS CALLED TO RENDER AN ITEM.
// uiBuffer - The Dest Video Surface - can only be FRAME_BUFFER or guiSAVEBUFFER
// pSoldier - used for determining whether burst mode needs display
// pObject	- Usually taken from pSoldier->inv[HANDPOS]
// sX, sY, Width, Height,  - Will Center it in the Width
// fDirtyLevel  if == DIRTYLEVEL2 will render everything
//							if == DIRTYLEVEL1 will render bullets and status only
//
//	pubHighlightCounter - if not null, and == 2 - will display name above item
//											-	if == 1 will only dirty the name space and then set counter to 0
//  Last parameter used mainly for when mouse is over item

}
