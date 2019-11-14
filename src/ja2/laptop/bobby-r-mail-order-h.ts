namespace ja2 {

// enums for the various destinations that are available in the bobbyR dest drop down box
export const enum Enum70 {
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

export interface NewBobbyRayOrderStruct {
  fActive: boolean;
  ubDeliveryLoc: UINT8; // the city the shipment is going to
  ubDeliveryMethod: UINT8; // type of delivery: next day, 2 days ...
  BobbyRayPurchase: BobbyRayPurchaseStruct[] /* [MAX_PURCHASE_AMOUNT] */;
  ubNumberPurchases: UINT8;

  uiPackageWeight: UINT32;
  uiOrderedOnDayNum: UINT32;

  fDisplayedInShipmentPage: boolean;

  ubFiller: UINT8[] /* [7] */;
}

export function createNewBobbyRayOrderStruct(): NewBobbyRayOrderStruct {
  return {
    fActive: false,
    ubDeliveryLoc: 0,
    ubDeliveryMethod: 0,
    BobbyRayPurchase: createArrayFrom(MAX_PURCHASE_AMOUNT, createBobbyRayPurchaseStruct),
    ubNumberPurchases: 0,
    uiPackageWeight: 0,
    uiOrderedOnDayNum: 0,
    fDisplayedInShipmentPage: false,
    ubFiller: createArray(7, 0),
  };
}

export function resetNewBobbyRayOrderStruct(o: NewBobbyRayOrderStruct) {
  o.fActive = false;
  o.ubDeliveryLoc = 0;
  o.ubDeliveryMethod = 0;
  o.BobbyRayPurchase.forEach(resetBobbyRayPurchaseStruct);
  o.ubNumberPurchases = 0;
  o.uiPackageWeight = 0;
  o.uiOrderedOnDayNum = 0;
  o.fDisplayedInShipmentPage = false;
  o.ubFiller.fill(0);
}

export const NEW_BOBBY_RAY_ORDER_STRUCT_SIZE = 104;

export function readNewBobbyRayOrderStruct(o: NewBobbyRayOrderStruct, buffer: Buffer, offset: number = 0): number {
  o.fActive = Boolean(buffer.readUInt8(offset++));
  o.ubDeliveryLoc = buffer.readUInt8(offset++);
  o.ubDeliveryMethod = buffer.readUInt8(offset++);
  offset++; // padding

  for (let i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    offset = readBobbyRayPurchaseStruct(o.BobbyRayPurchase[i], buffer, offset);
  }

  o.ubNumberPurchases = buffer.readUInt8(offset++);
  offset += 3; // padding
  o.uiPackageWeight = buffer.readUInt32LE(offset); offset += 4;
  o.uiOrderedOnDayNum = buffer.readUInt32LE(offset); offset += 4;
  o.fDisplayedInShipmentPage = Boolean(buffer.readUInt8(offset++));

  for (let i = 0; i < 7; i++) {
    o.ubFiller[i] = buffer.readUInt8(offset++);
  }

  return offset;
}

export function writeNewBobbyRayOrderStruct(o: NewBobbyRayOrderStruct, buffer: Buffer, offset: number = 0) {
  offset = buffer.writeUInt8(Number(o.fActive), offset);
  offset = buffer.writeUInt8(o.ubDeliveryLoc, offset);
  offset = buffer.writeUInt8(o.ubDeliveryMethod, offset);
  buffer.fill(0, offset, offset + 1); offset++; // padding

  for (let i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    offset = writeBobbyRayPurchaseStruct(o.BobbyRayPurchase[i], buffer, offset);
  }

  offset = buffer.writeUInt8(o.ubNumberPurchases, offset);
  buffer.fill(0, offset, offset + 3); offset += 3; // padding
  offset = buffer.writeUInt32LE(o.uiPackageWeight, offset);
  offset = buffer.writeUInt32LE(o.uiOrderedOnDayNum, offset);
  offset = buffer.writeUInt8(Number(o.fDisplayedInShipmentPage), offset);

  for (let i = 0; i < 7; i++) {
    offset = buffer.writeUInt8(o.ubFiller[i], offset);
  }

  return offset;
}

}
