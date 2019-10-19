interface STORE_INVENTORY {
  usItemIndex: UINT16; // Index into the item table
  ubQtyOnHand: UINT8;
  ubQtyOnOrder: UINT8; // The number of items on order
  ubItemQuality: UINT8; // the % damaged listed from 0 to 100
  fPreviouslyEligible: BOOLEAN; // whether or not dealer has been eligible to sell this item in days prior to today

  filler: UINT8;
}

// Enums used for the access the MAX dealers array
const enum Enum112 {
  BOBBY_RAY_NEW,
  BOBBY_RAY_USED,

  BOBBY_RAY_LISTS,
}

extern UINT8 StoreInventory[MAXITEMS][BOBBY_RAY_LISTS];
extern INT16 WeaponROF[MAX_WEAPONS];

void SetupStoreInventory(STORE_INVENTORY *pInventoryArray, BOOLEAN fUsed);
BOOLEAN DoesGunOfSameClassExistInInventory(UINT8 ubItemIndex, UINT8 ubDealerID);
STORE_INVENTORY *GetPtrToStoreInventory(UINT8 ubDealerID);
// INT16	CountNumberOfItemsInStoreInventory( UINT8 ubArmsDealerID );
