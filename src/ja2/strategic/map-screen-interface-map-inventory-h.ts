// this is how close one has to be in the loaded sector to pickup an item
const MAX_DISTANCE_TO_PICKUP_ITEM = 5;

// number of inventory slots
const MAP_INVENTORY_POOL_SLOT_COUNT = 45;

// whether we are showing the inventory pool graphic
extern BOOLEAN fShowMapInventoryPool;

// the list for the inventory
extern WORLDITEM *pInventoryPoolList;

// the current inventory item
extern INT32 iCurrentlyHighLightedItem;
extern BOOLEAN fFlashHighLightInventoryItemOnradarMap;
extern INT16 sObjectSourceGridNo;
extern WORLDITEM *pInventoryPoolList;
extern INT32 iCurrentInventoryPoolPage;
extern BOOLEAN fMapInventoryItemCompatable[];
