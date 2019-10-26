export const WORLD_ITEM_DONTRENDER = 0x0001;
export const WOLRD_ITEM_FIND_SWEETSPOT_FROM_GRIDNO = 0x0002;
export const WORLD_ITEM_ARMED_BOMB = 0x0040;
export const WORLD_ITEM_SCIFI_ONLY = 0x0080;
export const WORLD_ITEM_REALISTIC_ONLY = 0x0100;
export const WORLD_ITEM_REACHABLE = 0x0200;
export const WORLD_ITEM_GRIDNO_NOT_SET_USE_ENTRY_POINT = 0x0400;

export interface WORLDITEM {
  fExists: boolean;
  sGridNo: INT16;
  ubLevel: UINT8;
  o: OBJECTTYPE;
  usFlags: UINT16;
  bRenderZHeightAboveLevel: INT8;

  bVisible: INT8;

  // This is the chance associated with an item or a trap not-existing in the world.  The reason why
  // this is reversed (10 meaning item has 90% chance of appearing, is because the order that the map
  // is saved, we don't know if the version is older or not until after the items are loaded and added.
  // Because this value is zero in the saved maps, we can't change it to 100, hence the reversal method.
  // This check is only performed the first time a map is loaded.  Later, it is entirely skipped.
  ubNonExistChance: UINT8;
}

export interface WORLDBOMB {
  fExists: boolean;
  iItemIndex: INT32;
}
