namespace ja2 {

export interface EditorItemsInfo {
  fGameInit: boolean; // Used for initializing save variables the first time.
                      // This flag is initialize at
  fKill: boolean; // flagged for deallocation.
  fActive: boolean; // currently active
  pusItemIndex: UINT16[] /* Pointer<UINT16> */; // a dynamic array of Item indices
  uiBuffer: UINT32; // index of buffer
  uiItemType: UINT32; // Weapons, ammo, armour, explosives, equipment

  // width and height of buffer
  sWidth: INT16;
  sHeight: INT16;

  sNumItems: INT16; // total number of items in the current class of item.
  sSelItemIndex: INT16; // currently selected item index.
  sHilitedItemIndex: INT16;
  sScrollIndex: INT16; // current scroll index (0 is far left, 1 is next tile to the right, ...)

  sSaveSelWeaponsIndex: INT16;
  sSaveSelAmmoIndex: INT16;
  sSaveSelArmourIndex: INT16;
  sSaveSelExplosivesIndex: INT16;
  sSaveSelEquipment1Index: INT16;
  sSaveSelEquipment2Index: INT16;
  sSaveSelEquipment3Index: INT16;
  sSaveSelTriggersIndex: INT16;
  sSaveSelKeysIndex: INT16;

  sSaveWeaponsScrollIndex: INT16;
  sSaveAmmoScrollIndex: INT16;
  sSaveArmourScrollIndex: INT16;
  sSaveExplosivesScrollIndex: INT16;
  sSaveEquipment1ScrollIndex: INT16;
  sSaveEquipment2ScrollIndex: INT16;
  sSaveEquipment3ScrollIndex: INT16;
  sSaveTriggersScrollIndex: INT16;
  sSaveKeysScrollIndex: INT16;

  sNumWeapons: INT16;
  sNumAmmo: INT16;
  sNumArmour: INT16;
  sNumExplosives: INT16;
  sNumEquipment1: INT16;
  sNumEquipment2: INT16;
  sNumEquipment3: INT16;
  sNumTriggers: INT16;
  sNumKeys: INT16;
}

export function createEditorItemsInfo(): EditorItemsInfo {
  return {
    fGameInit: false,
    fKill: false,
    fActive: false,
    pusItemIndex: <UINT16[]><unknown>null,
    uiBuffer: 0,
    uiItemType: 0,
    sWidth: 0,
    sHeight: 0,
    sNumItems: 0,
    sSelItemIndex: 0,
    sHilitedItemIndex: 0,
    sScrollIndex: 0,
    sSaveSelWeaponsIndex: 0,
    sSaveSelAmmoIndex: 0,
    sSaveSelArmourIndex: 0,
    sSaveSelExplosivesIndex: 0,
    sSaveSelEquipment1Index: 0,
    sSaveSelEquipment2Index: 0,
    sSaveSelEquipment3Index: 0,
    sSaveSelTriggersIndex: 0,
    sSaveSelKeysIndex: 0,
    sSaveWeaponsScrollIndex: 0,
    sSaveAmmoScrollIndex: 0,
    sSaveArmourScrollIndex: 0,
    sSaveExplosivesScrollIndex: 0,
    sSaveEquipment1ScrollIndex: 0,
    sSaveEquipment2ScrollIndex: 0,
    sSaveEquipment3ScrollIndex: 0,
    sSaveTriggersScrollIndex: 0,
    sSaveKeysScrollIndex: 0,
    sNumWeapons: 0,
    sNumAmmo: 0,
    sNumArmour: 0,
    sNumExplosives: 0,
    sNumEquipment1: 0,
    sNumEquipment2: 0,
    sNumEquipment3: 0,
    sNumTriggers: 0,
    sNumKeys: 0,
  };
}

export function resetEditorItemsInfo(o: EditorItemsInfo) {
  o.fGameInit = false;
  o.fKill = false;
  o.fActive = false;
  o.pusItemIndex = <UINT16[]><unknown>null;
  o.uiBuffer = 0;
  o.uiItemType = 0;
  o.sWidth = 0;
  o.sHeight = 0;
  o.sNumItems = 0;
  o.sSelItemIndex = 0;
  o.sHilitedItemIndex = 0;
  o.sScrollIndex = 0;
  o.sSaveSelWeaponsIndex = 0;
  o.sSaveSelAmmoIndex = 0;
  o.sSaveSelArmourIndex = 0;
  o.sSaveSelExplosivesIndex = 0;
  o.sSaveSelEquipment1Index = 0;
  o.sSaveSelEquipment2Index = 0;
  o.sSaveSelEquipment3Index = 0;
  o.sSaveSelTriggersIndex = 0;
  o.sSaveSelKeysIndex = 0;
  o.sSaveWeaponsScrollIndex = 0;
  o.sSaveAmmoScrollIndex = 0;
  o.sSaveArmourScrollIndex = 0;
  o.sSaveExplosivesScrollIndex = 0;
  o.sSaveEquipment1ScrollIndex = 0;
  o.sSaveEquipment2ScrollIndex = 0;
  o.sSaveEquipment3ScrollIndex = 0;
  o.sSaveTriggersScrollIndex = 0;
  o.sSaveKeysScrollIndex = 0;
  o.sNumWeapons = 0;
  o.sNumAmmo = 0;
  o.sNumArmour = 0;
  o.sNumExplosives = 0;
  o.sNumEquipment1 = 0;
  o.sNumEquipment2 = 0;
  o.sNumEquipment3 = 0;
  o.sNumTriggers = 0;
  o.sNumKeys = 0;
}

}
