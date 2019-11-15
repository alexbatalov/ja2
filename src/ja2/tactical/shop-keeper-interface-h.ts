namespace ja2 {

export const SKI_NUM_TRADING_INV_SLOTS = 12;
export const SKI_NUM_TRADING_INV_ROWS = 2;
export const SKI_NUM_TRADING_INV_COLS = 6;

// Enums used for when the user clicks on an item and the item goes to..
export const enum Enum252 {
  ARMS_DEALER_INVENTORY,
  ARMS_DEALER_OFFER_AREA,
  PLAYERS_OFFER_AREA,
  PLAYERS_INVENTORY,
}

export const ARMS_INV_ITEM_SELECTED = 0x00000001; // The item has been placed into the offer area
//#define	ARMS_INV_PLAYERS_ITEM_SELECTED						0x00000002			// The source location for the item has been selected
export const ARMS_INV_PLAYERS_ITEM_HAS_VALUE = 0x00000004; // The Players item is worth something to this dealer
//#define	ARMS_INV_ITEM_HIGHLIGHTED									0x00000008			// If the items is highlighted
export const ARMS_INV_ITEM_NOT_REPAIRED_YET = 0x00000010; // The item is in for repairs but not repaired yet
export const ARMS_INV_ITEM_REPAIRED = 0x00000020; // The item is repaired
export const ARMS_INV_JUST_PURCHASED = 0x00000040; // The item was just purchased
export const ARMS_INV_PLAYERS_ITEM_HAS_BEEN_EVALUATED = 0x00000080; // The Players item has been evaluated

export interface INVENTORY_IN_SLOT {
  fActive: boolean;
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

export function createInventoryInSlot(): INVENTORY_IN_SLOT {
  return {
    fActive: false,
    sItemIndex: 0,
    uiFlags: 0,
    ItemObject: createObjectType(),
    ubLocationOfObject: 0,
    bSlotIdInOtherLocation: 0,

    ubIdOfMercWhoOwnsTheItem: 0,
    uiItemPrice: 0,

    sSpecialItemElement: 0,
  };
}

export function copyInventoryInSlot(destination: INVENTORY_IN_SLOT, source: INVENTORY_IN_SLOT) {
  destination.fActive = source.fActive;
  destination.sItemIndex = source.sItemIndex;
  destination.uiFlags = source.uiFlags;
  copyObjectType(destination.ItemObject, source.ItemObject);
  destination.ubLocationOfObject = source.ubLocationOfObject;
  destination.bSlotIdInOtherLocation = source.bSlotIdInOtherLocation;
  destination.ubIdOfMercWhoOwnsTheItem = source.ubIdOfMercWhoOwnsTheItem;
  destination.uiItemPrice = source.uiItemPrice;
  destination.sSpecialItemElement = source.sSpecialItemElement;
}

export function resetInventoryInSlot(o: INVENTORY_IN_SLOT) {
  o.fActive = false;
  o.sItemIndex = 0;
  o.uiFlags = 0;
  resetObjectType(o.ItemObject);
  o.ubLocationOfObject = 0;
  o.bSlotIdInOtherLocation = 0;
  o.ubIdOfMercWhoOwnsTheItem = 0;
  o.uiItemPrice = 0;
  o.sSpecialItemElement = 0;
}

// extern	BOOLEAN		gfRedrawSkiScreen;

export const enum Enum253 {
  SKI_DIRTY_LEVEL0, // no redraw
  SKI_DIRTY_LEVEL1, // redraw only items
  SKI_DIRTY_LEVEL2, // redraw everything
}

}
