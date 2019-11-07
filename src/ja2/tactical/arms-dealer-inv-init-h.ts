namespace ja2 {

export const LAST_DEALER_ITEM = -1;
export const NO_DEALER_ITEM = 0;

// item suitability categories for dealer inventory initialization, virtual customer sales, and re-ordering
export const ITEM_SUITABILITY_NONE = 0;
export const ITEM_SUITABILITY_LOW = 1;
export const ITEM_SUITABILITY_MEDIUM = 2;
export const ITEM_SUITABILITY_HIGH = 3;
export const ITEM_SUITABILITY_ALWAYS = 4;

export const DEALER_BUYING = 0;
export const DEALER_SELLING = 1;

export interface DEALER_POSSIBLE_INV {
  sItemIndex: INT16;
  ubOptimalNumber: UINT8;
}

export function createDealerPossibleInvFrom(sItemIndex: INT16, ubOptimalNumber: UINT8): DEALER_POSSIBLE_INV {
  return {
    sItemIndex,
    ubOptimalNumber,
  };
}

export interface ITEM_SORT_ENTRY {
  uiItemClass: UINT32;
  ubWeaponClass: UINT8;
  fAllowUsed: boolean;
}

}
