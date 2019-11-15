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

export interface LAST_HIRED_MERC_STRUCT {
  fHaveDisplayedPopUpInLaptop: boolean; // Is set when the popup gets displayed, reset when entering laptop again.
  iIdOfMerc: INT32;
  uiArrivalTime: UINT32;
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

}
