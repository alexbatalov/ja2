namespace ja2 {

export interface STORE_INVENTORY {
  usItemIndex: UINT16; // Index into the item table
  ubQtyOnHand: UINT8;
  ubQtyOnOrder: UINT8; // The number of items on order
  ubItemQuality: UINT8; // the % damaged listed from 0 to 100
  fPreviouslyEligible: boolean; // whether or not dealer has been eligible to sell this item in days prior to today

  filler: UINT8;
}

export function createStoreInventory(): STORE_INVENTORY {
  return {
    usItemIndex: 0,
    ubQtyOnHand: 0,
    ubQtyOnOrder: 0,
    ubItemQuality: 0,
    fPreviouslyEligible: false,
    filler: 0,
  };
}

export function resetStoreInventory(o: STORE_INVENTORY) {
  o.usItemIndex = 0;
  o.ubQtyOnHand = 0;
  o.ubQtyOnOrder = 0;
  o.ubItemQuality = 0;
  o.fPreviouslyEligible = false;
  o.filler = 0;
}

export const STORE_INVENTORY_SIZE = 8;

export function readStoreInventory(o: STORE_INVENTORY, buffer: Buffer, offset: number = 0): number {
  o.usItemIndex = buffer.readUInt16LE(offset); offset += 2;
  o.ubQtyOnHand = buffer.readUInt8(offset++);
  o.ubQtyOnOrder = buffer.readUInt8(offset++);
  o.ubItemQuality = buffer.readUInt8(offset++);
  o.fPreviouslyEligible = Boolean(buffer.readUInt8(offset++));
  o.filler = buffer.readUInt8(offset++);
  offset++; // padding
  return offset;
}

export function writeStoreInventory(o: STORE_INVENTORY, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt16LE(o.usItemIndex, offset);
  offset = buffer.writeUInt8(o.ubQtyOnHand, offset);
  offset = buffer.writeUInt8(o.ubQtyOnOrder, offset);
  offset = buffer.writeUInt8(o.ubItemQuality, offset);
  offset = buffer.writeUInt8(Number(o.fPreviouslyEligible), offset);
  offset = buffer.writeUInt8(o.filler, offset);
  buffer.fill(0, offset, offset + 1); offset++; // padding
  return offset;
}

// Enums used for the access the MAX dealers array
export const enum Enum112 {
  BOBBY_RAY_NEW,
  BOBBY_RAY_USED,

  BOBBY_RAY_LISTS,
}

// INT16	CountNumberOfItemsInStoreInventory( UINT8 ubArmsDealerID );

}
