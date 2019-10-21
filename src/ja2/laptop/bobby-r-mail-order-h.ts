// enums for the various destinations that are available in the bobbyR dest drop down box
const enum Enum70 {
  BR_AUSTIN,
  BR_BAGHDAD,
  BR_DRASSEN,
  BR_HONG_KONG,
  BR_BEIRUT,
  BR_LONDON,
  BR_LOS_ANGELES,
  BR_MEDUNA,
  BR_METAVIRA,
  BR_MIAMI,
  BR_MOSCOW,
  BR_NEW_YORK,
  BR_OTTAWA,
  BR_PARIS,
  BR_TRIPOLI,
  BR_TOKYO,
  BR_VANCOUVER,
}

interface NewBobbyRayOrderStruct {
  fActive: BOOLEAN;
  ubDeliveryLoc: UINT8; // the city the shipment is going to
  ubDeliveryMethod: UINT8; // type of delivery: next day, 2 days ...
  BobbyRayPurchase: BobbyRayPurchaseStruct[] /* [MAX_PURCHASE_AMOUNT] */;
  ubNumberPurchases: UINT8;

  uiPackageWeight: UINT32;
  uiOrderedOnDayNum: UINT32;

  fDisplayedInShipmentPage: BOOLEAN;

  ubFiller: UINT8[] /* [7] */;
}

extern NewBobbyRayOrderStruct *gpNewBobbyrShipments;
extern INT32 giNumberOfNewBobbyRShipment;
