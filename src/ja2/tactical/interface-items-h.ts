// DEFINES FOR ITEM SLOT SIZES IN PIXELS
const BIG_INV_SLOT_WIDTH = 61;
const BIG_INV_SLOT_HEIGHT = 22;
const SM_INV_SLOT_WIDTH = 30;
const SM_INV_SLOT_HEIGHT = 23;
const VEST_INV_SLOT_WIDTH = 43;
const VEST_INV_SLOT_HEIGHT = 24;
const LEGS_INV_SLOT_WIDTH = 43;
const LEGS_INV_SLOT_HEIGHT = 24;
const HEAD_INV_SLOT_WIDTH = 43;
const HEAD_INV_SLOT_HEIGHT = 24;

// A STRUCT USED INTERNALLY FOR INV SLOT REGIONS
interface INV_REGIONS {
  fBigPocket: BOOLEAN;
  sBarDx: INT16;
  sBarDy: INT16;
  sWidth: INT16;
  sHeight: INT16;
  sX: INT16; // starts at 0, gets set via InitInvSlotInterface()
  sY: INT16; // starts at 0, gets set via InitInvSlotInterface()
}

// USED TO SETUP REGION POSITIONS, ETC
interface INV_REGION_DESC {
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

BOOLEAN gfInItemDescBox;

OBJECTTYPE *gpItemPointer;
OBJECTTYPE gItemPointer;
SOLDIERTYPE *gpItemPointerSoldier;
UINT16 usItemSnapCursor;
UINT16 us16BPPItemCyclePlacedItemColors[20];
BOOLEAN gfItemPointerDifferentThanDefault;
