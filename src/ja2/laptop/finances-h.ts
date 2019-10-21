const FINANCES_DATA_FILE = "TEMP\\finances.dat";

// the financial structure
interface FinanceUnit {
  ubCode: UINT8; // the code index in the finance code table
  uiIdNumber: UINT32; // unique id number
  ubSecondCode: UINT8; // secondary code
  uiDate: UINT32; // time in the world in global time
  iAmount: INT32; // the amount of the transaction
  iBalanceToDate: INT32;
  Next: Pointer<FinanceUnit>; // next unit in the list
}

const enum Enum80 {
  ACCRUED_INTEREST,
  ANONYMOUS_DEPOSIT,
  TRANSACTION_FEE,
  HIRED_MERC,
  BOBBYR_PURCHASE,
  PAY_SPECK_FOR_MERC,
  MEDICAL_DEPOSIT,
  IMP_PROFILE,
  PURCHASED_INSURANCE,
  REDUCED_INSURANCE,
  EXTENDED_INSURANCE,
  CANCELLED_INSURANCE,
  INSURANCE_PAYOUT,
  EXTENDED_CONTRACT_BY_1_DAY,
  EXTENDED_CONTRACT_BY_1_WEEK,
  EXTENDED_CONTRACT_BY_2_WEEKS,
  DEPOSIT_FROM_GOLD_MINE,
  DEPOSIT_FROM_SILVER_MINE,
  PURCHASED_FLOWERS,
  FULL_MEDICAL_REFUND,
  PARTIAL_MEDICAL_REFUND,
  NO_MEDICAL_REFUND,
  PAYMENT_TO_NPC,
  TRANSFER_FUNDS_TO_MERC,
  TRANSFER_FUNDS_FROM_MERC,
  TRAIN_TOWN_MILITIA,
  PURCHASED_ITEM_FROM_DEALER,
  MERC_DEPOSITED_MONEY_TO_PLAYER_ACCOUNT,
}

type FinanceUnitPtr = Pointer<FinanceUnit>;
