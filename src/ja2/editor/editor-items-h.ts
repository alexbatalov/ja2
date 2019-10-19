interface EditorItemsInfo {
  fGameInit: BOOLEAN; // Used for initializing save variables the first time.
                      // This flag is initialize at
  fKill: BOOLEAN; // flagged for deallocation.
  fActive: BOOLEAN; // currently active
  pusItemIndex: Pointer<UINT16>; // a dynamic array of Item indices
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

extern EditorItemsInfo eInfo;

void InitEditorItemsToolbar();
void EntryInitEditorItemsInfo();
void InitEditorItemsInfo(UINT32 uiItemType);
void RenderEditorItemsInfo();
void ClearEditorItemsInfo();
void DisplayItemStatistics();
void DetermineItemsScrolling();

// User actions
void AddSelectedItemToWorld(INT16 sGridNo);
void HandleRightClickOnItem(INT16 sGridNo);
void DeleteSelectedItem();
void ShowSelectedItem();
void HideSelectedItem();
void SelectNextItemPool();
void SelectNextItemInPool();
void SelectPrevItemInPool();

void KillItemPoolList();
void BuildItemPoolList();

void HideItemCursor(INT32 iMapIndex);
void ShowItemCursor(INT32 iMapIndex);

void SetEditorItemsTaskbarMode(UINT16 usNewMode);

void HandleItemsPanel(UINT16 usScreenX, UINT16 usScreenY, INT8 bEvent);

extern INT32 giDefaultExistChance;
