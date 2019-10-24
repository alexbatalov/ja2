const LAST_DEALER_ITEM = -1;
const NO_DEALER_ITEM = 0;

// item suitability categories for dealer inventory initialization, virtual customer sales, and re-ordering
const ITEM_SUITABILITY_NONE = 0;
const ITEM_SUITABILITY_LOW = 1;
const ITEM_SUITABILITY_MEDIUM = 2;
const ITEM_SUITABILITY_HIGH = 3;
const ITEM_SUITABILITY_ALWAYS = 4;

const DEALER_BUYING = 0;
const DEALER_SELLING = 1;

interface DEALER_POSSIBLE_INV {
  sItemIndex: INT16;
  ubOptimalNumber: UINT8;
}

interface ITEM_SORT_ENTRY {
  uiItemClass: UINT32;
  ubWeaponClass: UINT8;
  fAllowUsed: boolean;
}
