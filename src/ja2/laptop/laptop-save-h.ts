const MAX_BOOKMARKS = 20;

const MAX_PURCHASE_AMOUNT = 10;

const SPECK_QUOTE__ALREADY_TOLD_PLAYER_THAT_LARRY_RELAPSED = 0x00000001;
const SPECK_QUOTE__SENT_EMAIL_ABOUT_LACK_OF_PAYMENT = 0x00000002;

interface LIFE_INSURANCE_PAYOUT {
  fActive: BOOLEAN;
  ubSoldierID: UINT8;
  ubMercID: UINT8;
  iPayOutPrice: INT32;
}

interface LAST_HIRED_MERC_STRUCT {
  fHaveDisplayedPopUpInLaptop: BOOLEAN; // Is set when the popup gets displayed, reset when entering laptop again.
  iIdOfMerc: INT32;
  uiArrivalTime: UINT32;
}

interface BobbyRayPurchaseStruct {
  usItemIndex: UINT16;
  ubNumberPurchased: UINT8;
  bItemQuality: INT8;
  usBobbyItemIndex: UINT16; // Item number in the BobbyRayInventory structure
  fUsed: BOOLEAN; // Indicates wether or not the item is from the used inventory or the regular inventory
}

interface BobbyRayOrderStruct {
  fActive: BOOLEAN;
  BobbyRayPurchase: BobbyRayPurchaseStruct[] /* [MAX_PURCHASE_AMOUNT] */;
  ubNumberPurchases: UINT8;
}

// used when the player goes to bobby rays when it is still down
const enum Enum99 {
  BOBBYR_NEVER_BEEN_TO_SITE,
  BOBBYR_BEEN_TO_SITE_ONCE,
  BOBBYR_ALREADY_SENT_EMAIL,
}

interface LaptopSaveInfoStruct {
  // General Laptop Info
  gfNewGameLaptop: BOOLEAN; // Is it the firs time in Laptop
  fVisitedBookmarkAlready: BOOLEAN[] /* [20] */; // have we visitied this site already?
  iBookMarkList: INT32[] /* [MAX_BOOKMARKS] */;

  iCurrentBalance: INT32; // current players balance

  // IMP Information
  fIMPCompletedFlag: BOOLEAN; // Has the player Completed the IMP process
  fSentImpWarningAlready: BOOLEAN; // Has the Imp email warning already been sent

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

  BobbyRayOrdersOnDeliveryArray: Pointer<BobbyRayOrderStruct>;
  usNumberOfBobbyRayOrderItems: UINT8; // The number of elements in the array
  usNumberOfBobbyRayOrderUsed: UINT8; // The number of items in the array that are used

  // Insurance Site
  pLifeInsurancePayouts: Pointer<LIFE_INSURANCE_PAYOUT>;
  ubNumberLifeInsurancePayouts: UINT8; // The number of elements in the array
  ubNumberLifeInsurancePayoutUsed: UINT8; // The number of items in the array that are used

  fBobbyRSiteCanBeAccessed: BOOLEAN;

  ubPlayerBeenToMercSiteStatus: UINT8;
  fFirstVisitSinceServerWentDown: BOOLEAN;
  fNewMercsAvailableAtMercSite: BOOLEAN;
  fSaidGenericOpeningInMercSite: BOOLEAN;
  fSpeckSaidFloMarriedCousinQuote: BOOLEAN;
  fHasAMercDiedAtMercSite: BOOLEAN;

  gbNumDaysTillFirstMercArrives: INT8;
  gbNumDaysTillSecondMercArrives: INT8;
  gbNumDaysTillThirdMercArrives: INT8;
  gbNumDaysTillFourthMercArrives: INT8;

  guiNumberOfMercPaymentsInDays: UINT32; // Keeps track of each day of payment the MERC site gets

  usInventoryListLength: UINT16[] /* [BOBBY_RAY_LISTS] */;

  iVoiceId: INT32;

  ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction: UINT8;

  fMercSiteHasGoneDownYet: BOOLEAN;

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

extern LaptopSaveInfoStruct LaptopSaveInfo;

extern BobbyRayPurchaseStruct BobbyRayPurchases[MAX_PURCHASE_AMOUNT];
