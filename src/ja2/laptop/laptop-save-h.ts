namespace ja2 {

export const MAX_BOOKMARKS = 20;

export const MAX_PURCHASE_AMOUNT = 10;

export const SPECK_QUOTE__ALREADY_TOLD_PLAYER_THAT_LARRY_RELAPSED = 0x00000001;
export const SPECK_QUOTE__SENT_EMAIL_ABOUT_LACK_OF_PAYMENT = 0x00000002;

export interface LIFE_INSURANCE_PAYOUT {
  fActive: boolean;
  ubSoldierID: UINT8;
  ubMercID: UINT8;
  iPayOutPrice: INT32;
}

export function createLifeInsurancePayout(): LIFE_INSURANCE_PAYOUT {
  return {
    fActive: false,
    ubSoldierID: 0,
    ubMercID: 0,
    iPayOutPrice: 0,
  };
}

export const LIFE_INSURANCE_PAYOUT_SIZE = 8;

export function readLifeInsurancePayout(o: LIFE_INSURANCE_PAYOUT, buffer: Buffer, offset: number = 0): number {
  o.fActive = Boolean(buffer.readUInt8(offset++));
  o.ubSoldierID = buffer.readUInt8(offset++);
  o.ubMercID = buffer.readUInt8(offset++);
  offset++; // padding
  o.iPayOutPrice = buffer.readInt32LE(offset); offset += 4;
  return offset;
}

export function writeLifeInsurancePayout(o: LIFE_INSURANCE_PAYOUT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fActive), offset);
  offset = buffer.writeUInt8(o.ubSoldierID, offset);
  offset = buffer.writeUInt8(o.ubMercID, offset);
  buffer.fill(0, offset, offset + 1); offset++; // padding
  offset = buffer.writeInt32LE(o.iPayOutPrice, offset);
  return offset;
}

export interface LAST_HIRED_MERC_STRUCT {
  fHaveDisplayedPopUpInLaptop: boolean; // Is set when the popup gets displayed, reset when entering laptop again.
  iIdOfMerc: INT32;
  uiArrivalTime: UINT32;
}

export function createLastHiredMercStruct(): LAST_HIRED_MERC_STRUCT {
  return {
    fHaveDisplayedPopUpInLaptop: false,
    iIdOfMerc: 0,
    uiArrivalTime: 0,
  };
}

export const LAST_HIRED_MERC_STRUCT_SIZE = 12;

export function readLastHiredMercStruct(o: LAST_HIRED_MERC_STRUCT, buffer: Buffer, offset: number = 0): number {
  o.fHaveDisplayedPopUpInLaptop = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.iIdOfMerc = buffer.readInt32LE(offset); offset += 4;
  o.uiArrivalTime = buffer.readUInt32LE(offset); offset += 4;
  return offset;
}

export function writeLastHiredMercStruct(o: LAST_HIRED_MERC_STRUCT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fHaveDisplayedPopUpInLaptop), offset);
  buffer.fill(0, offset, offset + 3); offset += 3; // padding
  offset = buffer.writeInt32LE(o.iIdOfMerc, offset);
  offset = buffer.writeUInt32LE(o.uiArrivalTime, offset);
  return offset;
}

export interface BobbyRayPurchaseStruct {
  usItemIndex: UINT16;
  ubNumberPurchased: UINT8;
  bItemQuality: INT8;
  usBobbyItemIndex: UINT16; // Item number in the BobbyRayInventory structure
  fUsed: boolean; // Indicates wether or not the item is from the used inventory or the regular inventory
}

export function createBobbyRayPurchaseStruct(): BobbyRayPurchaseStruct {
  return {
    usItemIndex: 0,
    ubNumberPurchased: 0,
    bItemQuality: 0,
    usBobbyItemIndex: 0,
    fUsed: false,
  };
}

export function copyBobbyRayPurchaseStruct(destination: BobbyRayPurchaseStruct, source: BobbyRayPurchaseStruct) {
  destination.usItemIndex = source.usItemIndex;
  destination.ubNumberPurchased = source.ubNumberPurchased;
  destination.bItemQuality = source.bItemQuality;
  destination.usBobbyItemIndex = source.usBobbyItemIndex;
  destination.fUsed = source.fUsed;
}

export function resetBobbyRayPurchaseStruct(o: BobbyRayPurchaseStruct) {
  o.usItemIndex = 0;
  o.ubNumberPurchased = 0;
  o.bItemQuality = 0;
  o.usBobbyItemIndex = 0;
  o.fUsed = false;
}

export const BOBBY_RAY_PURCHASE_STRUCT_SIZE = 8;

export function readBobbyRayPurchaseStruct(o: BobbyRayPurchaseStruct, buffer: Buffer, offset: number = 0): number {
  o.usItemIndex = buffer.readUInt16LE(offset); offset += 2;
  o.ubNumberPurchased = buffer.readUInt8(offset++);
  o.bItemQuality = buffer.readInt8(offset++);
  o.usBobbyItemIndex = buffer.readUInt16LE(offset); offset += 2;
  o.fUsed = Boolean(buffer.readUInt8(offset++));

  offset++; // padding

  return offset;
}

export function writeBobbyRayPurchaseStruct(o: BobbyRayPurchaseStruct, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt16LE(o.usItemIndex, offset);
  offset = buffer.writeUInt8(o.ubNumberPurchased, offset);
  offset = buffer.writeInt8(o.bItemQuality, offset);
  offset = buffer.writeUInt16LE(o.usBobbyItemIndex, offset);
  offset = buffer.writeUInt8(Number(o.fUsed), offset);

  offset = buffer.writeUInt8(0, offset); // padding

  return offset;
}

export interface BobbyRayOrderStruct {
  fActive: boolean;
  BobbyRayPurchase: BobbyRayPurchaseStruct[] /* [MAX_PURCHASE_AMOUNT] */;
  ubNumberPurchases: UINT8;
}

export function createBobbyRayOrderStruct(): BobbyRayOrderStruct {
  return {
    fActive: false,
    BobbyRayPurchase: createArrayFrom(MAX_PURCHASE_AMOUNT, createBobbyRayPurchaseStruct),
    ubNumberPurchases: 0,
  }
}

export const BOBBY_RAY_ORDER_STRUCT_SIZE = 84;

export function readBobbyRayOrderStruct(o: BobbyRayOrderStruct, buffer: Buffer, offset: number = 0): number {
  o.fActive = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  offset = readObjectArray(o.BobbyRayPurchase, buffer, offset, readBobbyRayPurchaseStruct);
  o.ubNumberPurchases = buffer.readUInt8(offset++);
  offset++; // padding
  return offset;
}

export function writeBobbyRayOrderStruct(o: BobbyRayOrderStruct, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fActive), offset);
  buffer.fill(0, offset, offset + 1); offset++; // padding
  offset = writeObjectArray(o.BobbyRayPurchase, buffer, offset, writeBobbyRayPurchaseStruct);
  offset = buffer.writeUInt8(o.ubNumberPurchases, offset);
  buffer.fill(0, offset, offset + 1); offset++; // padding
  return offset;
}

// used when the player goes to bobby rays when it is still down
export const enum Enum99 {
  BOBBYR_NEVER_BEEN_TO_SITE,
  BOBBYR_BEEN_TO_SITE_ONCE,
  BOBBYR_ALREADY_SENT_EMAIL,
}

export interface LaptopSaveInfoStruct {
  // General Laptop Info
  gfNewGameLaptop: boolean; // Is it the firs time in Laptop
  fVisitedBookmarkAlready: boolean[] /* [20] */; // have we visitied this site already?
  iBookMarkList: INT32[] /* [MAX_BOOKMARKS] */;

  iCurrentBalance: INT32; // current players balance

  // IMP Information
  fIMPCompletedFlag: boolean; // Has the player Completed the IMP process
  fSentImpWarningAlready: boolean; // Has the Imp email warning already been sent

  // Personnel Info
  ubDeadCharactersList: INT16[] /* [256] */;
  ubLeftCharactersList: INT16[] /* [256] */;
  ubOtherCharactersList: INT16[] /* [256] */;

  // MERC site info
  gubPlayersMercAccountStatus: UINT8;
  guiPlayersMercAccountNumber: UINT32;
  gubLastMercIndex: UINT8;

  // BobbyRay Site
  BobbyRayInventory: STORE_INVENTORY[] /* [MAXITEMS] */;
  BobbyRayUsedInventory: STORE_INVENTORY[] /* [MAXITEMS] */;

  BobbyRayOrdersOnDeliveryArray: BobbyRayOrderStruct[] /* Pointer<BobbyRayOrderStruct> */;
  usNumberOfBobbyRayOrderItems: UINT8; // The number of elements in the array
  usNumberOfBobbyRayOrderUsed: UINT8; // The number of items in the array that are used

  // Insurance Site
  pLifeInsurancePayouts: LIFE_INSURANCE_PAYOUT[] /* Pointer<LIFE_INSURANCE_PAYOUT> */;
  ubNumberLifeInsurancePayouts: UINT8; // The number of elements in the array
  ubNumberLifeInsurancePayoutUsed: UINT8; // The number of items in the array that are used

  fBobbyRSiteCanBeAccessed: boolean;

  ubPlayerBeenToMercSiteStatus: UINT8;
  fFirstVisitSinceServerWentDown: boolean;
  fNewMercsAvailableAtMercSite: boolean;
  fSaidGenericOpeningInMercSite: boolean;
  fSpeckSaidFloMarriedCousinQuote: boolean;
  fHasAMercDiedAtMercSite: boolean;

  gbNumDaysTillFirstMercArrives: INT8;
  gbNumDaysTillSecondMercArrives: INT8;
  gbNumDaysTillThirdMercArrives: INT8;
  gbNumDaysTillFourthMercArrives: INT8;

  guiNumberOfMercPaymentsInDays: UINT32; // Keeps track of each day of payment the MERC site gets

  usInventoryListLength: UINT16[] /* [BOBBY_RAY_LISTS] */;

  iVoiceId: INT32;

  ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction: UINT8;

  fMercSiteHasGoneDownYet: boolean;

  ubSpeckCanSayPlayersLostQuote: UINT8;

  sLastHiredMerc: LAST_HIRED_MERC_STRUCT;

  iCurrentHistoryPage: INT32;
  iCurrentFinancesPage: INT32;
  iCurrentEmailPage: INT32;

  uiSpeckQuoteFlags: UINT32;

  uiFlowerOrderNumber: UINT32;

  uiTotalMoneyPaidToSpeck: UINT32;

  ubLastMercAvailableId: UINT8;
  bPadding: UINT8[] /* [86] */;
}

export function createLaptopSaveInfoStruct(): LaptopSaveInfoStruct {
  return {
    gfNewGameLaptop: false,
    fVisitedBookmarkAlready: createArray(20, false),
    iBookMarkList: createArray(MAX_BOOKMARKS, 0),

    iCurrentBalance: 0,

    fIMPCompletedFlag: false,
    fSentImpWarningAlready: false,

    ubDeadCharactersList: createArray(256, 0),
    ubLeftCharactersList: createArray(256, 0),
    ubOtherCharactersList: createArray(256, 0),

    gubPlayersMercAccountStatus: 0,
    guiPlayersMercAccountNumber: 0,
    gubLastMercIndex: 0,

    BobbyRayInventory: createArrayFrom(Enum225.MAXITEMS, createStoreInventory),
    BobbyRayUsedInventory: createArrayFrom(Enum225.MAXITEMS, createStoreInventory),

    BobbyRayOrdersOnDeliveryArray: <BobbyRayOrderStruct[]><unknown>null,
    usNumberOfBobbyRayOrderItems: 0,
    usNumberOfBobbyRayOrderUsed: 0,

    pLifeInsurancePayouts: <LIFE_INSURANCE_PAYOUT[]><unknown>null,
    ubNumberLifeInsurancePayouts: 0,
    ubNumberLifeInsurancePayoutUsed: 0,

    fBobbyRSiteCanBeAccessed: false,

    ubPlayerBeenToMercSiteStatus: 0,
    fFirstVisitSinceServerWentDown: false,
    fNewMercsAvailableAtMercSite: false,
    fSaidGenericOpeningInMercSite: false,
    fSpeckSaidFloMarriedCousinQuote: false,
    fHasAMercDiedAtMercSite: false,

    gbNumDaysTillFirstMercArrives: 0,
    gbNumDaysTillSecondMercArrives: 0,
    gbNumDaysTillThirdMercArrives: 0,
    gbNumDaysTillFourthMercArrives: 0,

    guiNumberOfMercPaymentsInDays: 0,

    usInventoryListLength: createArray(Enum112.BOBBY_RAY_LISTS, 0),

    iVoiceId: 0,

    ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction: 0,

    fMercSiteHasGoneDownYet: false,

    ubSpeckCanSayPlayersLostQuote: 0,

    sLastHiredMerc: createLastHiredMercStruct(),

    iCurrentHistoryPage: 0,
    iCurrentFinancesPage: 0,
    iCurrentEmailPage: 0,

    uiSpeckQuoteFlags: 0,

    uiFlowerOrderNumber: 0,

    uiTotalMoneyPaidToSpeck: 0,

    ubLastMercAvailableId: 0,
    bPadding: createArray(86, 0),
  };
}

export const LAPTOP_SAVE_INFO_STRUCT_SIZE = 7440;

export function readLaptopSaveInfoStruct(o: LaptopSaveInfoStruct, buffer: Buffer, offset: number = 0): number {
  o.gfNewGameLaptop = Boolean(buffer.readUInt8(offset++));
  offset = readBooleanArray(o.fVisitedBookmarkAlready, buffer, offset);
  offset += 3; // padding
  offset = readIntArray(o.iBookMarkList, buffer, offset, 4);

  o.iCurrentBalance = buffer.readInt32LE(offset); offset += 4;

  o.fIMPCompletedFlag = Boolean(buffer.readUInt8(offset++));
  o.fSentImpWarningAlready = Boolean(buffer.readUInt8(offset++));

  offset = readIntArray(o.ubDeadCharactersList, buffer, offset, 2);
  offset = readIntArray(o.ubLeftCharactersList, buffer, offset, 2);
  offset = readIntArray(o.ubOtherCharactersList, buffer, offset, 2);

  o.gubPlayersMercAccountStatus = buffer.readUInt8(offset++);
  offset++; // padding
  o.guiPlayersMercAccountNumber = buffer.readUInt32LE(offset); offset += 4;
  o.gubLastMercIndex = buffer.readUInt8(offset++);
  offset++; // padding

  offset = readObjectArray(o.BobbyRayInventory, buffer, offset, readStoreInventory);
  offset = readObjectArray(o.BobbyRayUsedInventory, buffer, offset, readStoreInventory);
  offset += 2; // padding

  o.BobbyRayOrdersOnDeliveryArray = <BobbyRayOrderStruct[]><unknown>null; offset += 4; // pointer
  o.usNumberOfBobbyRayOrderItems = buffer.readUInt8(offset++);
  o.usNumberOfBobbyRayOrderUsed = buffer.readUInt8(offset++);
  offset += 2; // padding

  o.pLifeInsurancePayouts = <LIFE_INSURANCE_PAYOUT[]><unknown>null; offset += 4; // pointer
  o.ubNumberLifeInsurancePayouts = buffer.readUInt8(offset++);
  o.ubNumberLifeInsurancePayoutUsed = buffer.readUInt8(offset++);

  o.fBobbyRSiteCanBeAccessed = Boolean(buffer.readUInt8(offset++));

  o.ubPlayerBeenToMercSiteStatus = buffer.readUInt8(offset++);
  o.fFirstVisitSinceServerWentDown = Boolean(buffer.readUInt8(offset++));
  o.fNewMercsAvailableAtMercSite = Boolean(buffer.readUInt8(offset++));
  o.fSaidGenericOpeningInMercSite = Boolean(buffer.readUInt8(offset++));
  o.fSpeckSaidFloMarriedCousinQuote = Boolean(buffer.readUInt8(offset++));
  o.fHasAMercDiedAtMercSite = Boolean(buffer.readUInt8(offset++));

  o.gbNumDaysTillFirstMercArrives = buffer.readInt8(offset++);
  o.gbNumDaysTillSecondMercArrives = buffer.readInt8(offset++);
  o.gbNumDaysTillThirdMercArrives = buffer.readInt8(offset++);
  o.gbNumDaysTillFourthMercArrives = buffer.readInt8(offset++);
  offset += 3; // padding

  o.guiNumberOfMercPaymentsInDays = buffer.readUInt32LE(offset); offset += 4;

  offset = readUIntArray(o.usInventoryListLength,  buffer, offset, 2);

  o.iVoiceId = buffer.readInt32LE(offset); offset += 4;

  o.ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction = buffer.readUInt8(offset++);

  o.fMercSiteHasGoneDownYet = Boolean(buffer.readUInt8(offset++));

  o.ubSpeckCanSayPlayersLostQuote = buffer.readUInt8(offset++);
  offset++; // padding

  offset = readLastHiredMercStruct(o.sLastHiredMerc, buffer, offset);

  o.iCurrentHistoryPage = buffer.readInt32LE(offset); offset += 4;
  o.iCurrentFinancesPage = buffer.readInt32LE(offset); offset += 4;
  o.iCurrentEmailPage = buffer.readInt32LE(offset); offset += 4;

  o.uiSpeckQuoteFlags = buffer.readUInt32LE(offset); offset += 4;

  o.uiFlowerOrderNumber = buffer.readUInt32LE(offset); offset += 4;

  o.uiTotalMoneyPaidToSpeck = buffer.readUInt32LE(offset); offset += 4;

  o.ubLastMercAvailableId = buffer.readUInt8(offset++);
  offset = readUIntArray(o.bPadding, buffer, offset, 1);

  offset++; // padding

  return offset;
}

export function writeLaptopSaveInfoStruct(o: LaptopSaveInfoStruct, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.gfNewGameLaptop), offset);
  offset = writeBooleanArray(o.fVisitedBookmarkAlready, buffer, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = writeIntArray(o.iBookMarkList, buffer, offset, 4);

  offset = buffer.writeInt32LE(o.iCurrentBalance, offset);

  offset = buffer.writeUInt8(Number(o.fIMPCompletedFlag), offset);
  offset = buffer.writeUInt8(Number(o.fSentImpWarningAlready), offset);

  offset = writeIntArray(o.ubDeadCharactersList, buffer, offset, 2);
  offset = writeIntArray(o.ubLeftCharactersList, buffer, offset, 2);
  offset = writeIntArray(o.ubOtherCharactersList, buffer, offset, 2);

  offset = buffer.writeUInt8(o.gubPlayersMercAccountStatus, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.guiPlayersMercAccountNumber, offset);
  offset = buffer.writeUInt8(o.gubLastMercIndex, offset);
  offset = writePadding(buffer, offset, 1); // padding

  offset = writeObjectArray(o.BobbyRayInventory, buffer, offset, writeStoreInventory);
  offset = writeObjectArray(o.BobbyRayUsedInventory, buffer, offset, writeStoreInventory);
  offset = writePadding(buffer, offset, 2); // padding

  offset = buffer.writeUInt32LE(0, offset); // pointer
  offset = buffer.writeUInt8(o.usNumberOfBobbyRayOrderItems, offset);
  offset = buffer.writeUInt8(o.usNumberOfBobbyRayOrderUsed, offset);
  offset = writePadding(buffer, offset, 2); // padding

  offset = buffer.writeUInt32LE(0, offset); // pointer
  offset = buffer.writeUInt8(o.ubNumberLifeInsurancePayouts, offset);
  offset = buffer.writeUInt8(o.ubNumberLifeInsurancePayoutUsed, offset);

  offset = buffer.writeUInt8(Number(o.fBobbyRSiteCanBeAccessed), offset);

  offset = buffer.writeUInt8(Number(o.ubPlayerBeenToMercSiteStatus), offset);
  offset = buffer.writeUInt8(Number(o.fFirstVisitSinceServerWentDown), offset);
  offset = buffer.writeUInt8(Number(o.fNewMercsAvailableAtMercSite), offset);
  offset = buffer.writeUInt8(Number(o.fSaidGenericOpeningInMercSite), offset);
  offset = buffer.writeUInt8(Number(o.fSpeckSaidFloMarriedCousinQuote), offset);
  offset = buffer.writeUInt8(Number(o.fHasAMercDiedAtMercSite), offset);

  offset = buffer.writeInt8(o.gbNumDaysTillFirstMercArrives, offset);
  offset = buffer.writeInt8(o.gbNumDaysTillSecondMercArrives, offset);
  offset = buffer.writeInt8(o.gbNumDaysTillThirdMercArrives, offset);
  offset = buffer.writeInt8(o.gbNumDaysTillFourthMercArrives, offset);
  offset = writePadding(buffer, offset, 3);

  offset = buffer.writeUInt32LE(o.guiNumberOfMercPaymentsInDays, offset);

  offset = writeUIntArray(o.usInventoryListLength,  buffer, offset, 2);

  offset = buffer.writeInt32LE(o.iVoiceId, offset);

  offset = buffer.writeUInt8(o.ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction, offset);

  offset = buffer.writeUInt8(Number(o.fMercSiteHasGoneDownYet), offset);

  offset = buffer.writeUInt8(o.ubSpeckCanSayPlayersLostQuote, offset);
  offset = writePadding(buffer, offset, 1);

  offset = writeLastHiredMercStruct(o.sLastHiredMerc, buffer, offset);

  offset = buffer.writeInt32LE(o.iCurrentHistoryPage, offset);
  offset = buffer.writeInt32LE(o.iCurrentFinancesPage, offset);
  offset = buffer.writeInt32LE(o.iCurrentEmailPage, offset);

  offset = buffer.writeUInt32LE(o.uiSpeckQuoteFlags, offset);

  offset = buffer.writeUInt32LE(o.uiFlowerOrderNumber, offset);

  offset = buffer.writeUInt32LE(o.uiTotalMoneyPaidToSpeck, offset);

  offset = buffer.writeUInt8(o.ubLastMercAvailableId, offset);
  offset = writeUIntArray(o.bPadding, buffer, offset, 1);

  offset = writePadding(buffer, offset, 1); // padding

  return offset;
}

}
