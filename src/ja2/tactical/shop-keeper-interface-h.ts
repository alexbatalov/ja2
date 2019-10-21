const SKI_NUM_TRADING_INV_SLOTS = 12;
const SKI_NUM_TRADING_INV_ROWS = 2;
const SKI_NUM_TRADING_INV_COLS = 6;

// Enums used for when the user clicks on an item and the item goes to..
const enum Enum252 {
  ARMS_DEALER_INVENTORY,
  ARMS_DEALER_OFFER_AREA,
  PLAYERS_OFFER_AREA,
  PLAYERS_INVENTORY,
}

const ARMS_INV_ITEM_SELECTED = 0x00000001; // The item has been placed into the offer area
//#define	ARMS_INV_PLAYERS_ITEM_SELECTED						0x00000002			// The source location for the item has been selected
const ARMS_INV_PLAYERS_ITEM_HAS_VALUE = 0x00000004; // The Players item is worth something to this dealer
//#define	ARMS_INV_ITEM_HIGHLIGHTED									0x00000008			// If the items is highlighted
const ARMS_INV_ITEM_NOT_REPAIRED_YET = 0x00000010; // The item is in for repairs but not repaired yet
const ARMS_INV_ITEM_REPAIRED = 0x00000020; // The item is repaired
const ARMS_INV_JUST_PURCHASED = 0x00000040; // The item was just purchased
const ARMS_INV_PLAYERS_ITEM_HAS_BEEN_EVALUATED = 0x00000080; // The Players item has been evaluated

interface INVENTORY_IN_SLOT {
  fActive: BOOLEAN;
  sItemIndex: INT16;
  uiFlags: UINT32;
  ItemObject: OBJECTTYPE;
  ubLocationOfObject: UINT8; // An enum value for the location of the item ( either in the arms dealers inventory, one of the offer areas or in the users inventory)
  bSlotIdInOtherLocation: INT8;

  ubIdOfMercWhoOwnsTheItem: UINT8;
  uiItemPrice: UINT32; // Only used for the players item that have been evaluated

  sSpecialItemElement: INT16; // refers to which special item element an item in a dealer's inventory area
                              // occupies.  -1 Means the item is "perfect" and has no associated special item.
}

// extern	BOOLEAN		gfRedrawSkiScreen;

const enum Enum253 {
  SKI_DIRTY_LEVEL0, // no redraw
  SKI_DIRTY_LEVEL1, // redraw only items
  SKI_DIRTY_LEVEL2, // redraw everything
}
