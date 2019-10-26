namespace ja2 {

export interface STORE_INVENTORY {
  usItemIndex: UINT16; // Index into the item table
  ubQtyOnHand: UINT8;
  ubQtyOnOrder: UINT8; // The number of items on order
  ubItemQuality: UINT8; // the % damaged listed from 0 to 100
  fPreviouslyEligible: boolean; // whether or not dealer has been eligible to sell this item in days prior to today

  filler: UINT8;
}

// Enums used for the access the MAX dealers array
export const enum Enum112 {
  BOBBY_RAY_NEW,
  BOBBY_RAY_USED,

  BOBBY_RAY_LISTS,
}

// INT16	CountNumberOfItemsInStoreInventory( UINT8 ubArmsDealerID );

}
