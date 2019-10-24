let giBothCheckboxButton: INT32 = -1;
let giRealisticCheckboxButton: INT32 = -1;
let giSciFiCheckboxButton: INT32 = -1;
let giAlarmTriggerButton: INT32 = -1;
let giOwnershipGroupButton: INT32 = -1;

let gszActionItemDesc: UINT16[][] /* [NUM_ACTIONITEMS][30] */ = [
  "Klaxon Mine",
  "Flare Mine",
  "Teargas Explosion",
  "Stun Explosion",
  "Smoke Explosion",
  "Mustard Gas",
  "Land Mine",
  "Open Door",
  "Close Door",
  "3x3 Hidden Pit",
  "5x5 Hidden Pit",
  "Small Explosion",
  "Medium Explosion",
  "Large Explosion",
  "Toggle Door",
  "Toggle Action1s",
  "Toggle Action2s",
  "Toggle Action3s",
  "Toggle Action4s",
  "Enter Brothel",
  "Exit Brothel",
  "Kingpin Alarm",
  "Sex with Prostitute",
  "Reveal Room",
  "Local Alarm",
  "Global Alarm",
  "Klaxon Sound",
  "Unlock door",
  "Toggle lock",
  "Untrap door",
  "Tog pressure items",
  "Museum alarm",
  "Bloodcat alarm",
  "Big teargas",
];

function GetActionItemName(pItem: Pointer<OBJECTTYPE>): Pointer<UINT16> {
  if (!pItem || pItem.value.usItem != Enum225.ACTION_ITEM)
    return null;
  if (pItem.value.bActionValue != Enum191.ACTION_ITEM_BLOW_UP) {
    switch (pItem.value.bActionValue) {
      case Enum191.ACTION_ITEM_OPEN_DOOR:
        return gszActionItemDesc[Enum49.ACTIONITEM_OPEN];
      case Enum191.ACTION_ITEM_CLOSE_DOOR:
        return gszActionItemDesc[Enum49.ACTIONITEM_CLOSE];
      case Enum191.ACTION_ITEM_SMALL_PIT:
        return gszActionItemDesc[Enum49.ACTIONITEM_SMPIT];
      case Enum191.ACTION_ITEM_LARGE_PIT:
        return gszActionItemDesc[Enum49.ACTIONITEM_LGPIT];
      case Enum191.ACTION_ITEM_TOGGLE_DOOR:
        return gszActionItemDesc[Enum49.ACTIONITEM_TOGGLE_DOOR];
      case Enum191.ACTION_ITEM_TOGGLE_ACTION1:
        return gszActionItemDesc[Enum49.ACTIONITEM_TOGGLE_ACTION1];
      case Enum191.ACTION_ITEM_TOGGLE_ACTION2:
        return gszActionItemDesc[Enum49.ACTIONITEM_TOGGLE_ACTION2];
      case Enum191.ACTION_ITEM_TOGGLE_ACTION3:
        return gszActionItemDesc[Enum49.ACTIONITEM_TOGGLE_ACTION3];
      case Enum191.ACTION_ITEM_TOGGLE_ACTION4:
        return gszActionItemDesc[Enum49.ACTIONITEM_TOGGLE_ACTION4];
      case Enum191.ACTION_ITEM_ENTER_BROTHEL:
        return gszActionItemDesc[Enum49.ACTIONITEM_ENTER_BROTHEL];
      case Enum191.ACTION_ITEM_EXIT_BROTHEL:
        return gszActionItemDesc[Enum49.ACTIONITEM_EXIT_BROTHEL];
      case Enum191.ACTION_ITEM_KINGPIN_ALARM:
        return gszActionItemDesc[Enum49.ACTIONITEM_KINGPIN_ALARM];
      case Enum191.ACTION_ITEM_SEX:
        return gszActionItemDesc[Enum49.ACTIONITEM_SEX];
      case Enum191.ACTION_ITEM_REVEAL_ROOM:
        return gszActionItemDesc[Enum49.ACTIONITEM_REVEAL_ROOM];
      case Enum191.ACTION_ITEM_LOCAL_ALARM:
        return gszActionItemDesc[Enum49.ACTIONITEM_LOCAL_ALARM];
      case Enum191.ACTION_ITEM_GLOBAL_ALARM:
        return gszActionItemDesc[Enum49.ACTIONITEM_GLOBAL_ALARM];
      case Enum191.ACTION_ITEM_KLAXON:
        return gszActionItemDesc[Enum49.ACTIONITEM_KLAXON];
      case Enum191.ACTION_ITEM_UNLOCK_DOOR:
        return gszActionItemDesc[Enum49.ACTIONITEM_UNLOCK_DOOR];
      case Enum191.ACTION_ITEM_TOGGLE_LOCK:
        return gszActionItemDesc[Enum49.ACTIONITEM_TOGGLE_LOCK];
      case Enum191.ACTION_ITEM_UNTRAP_DOOR:
        return gszActionItemDesc[Enum49.ACTIONITEM_UNTRAP_DOOR];
      case Enum191.ACTION_ITEM_TOGGLE_PRESSURE_ITEMS:
        return gszActionItemDesc[Enum49.ACTIONITEM_TOGGLE_PRESSURE_ITEMS];
      case Enum191.ACTION_ITEM_MUSEUM_ALARM:
        return gszActionItemDesc[Enum49.ACTIONITEM_MUSEUM_ALARM];
      case Enum191.ACTION_ITEM_BLOODCAT_ALARM:
        return gszActionItemDesc[Enum49.ACTIONITEM_BLOODCAT_ALARM];
      default:
        return null;
    }
  } else
    switch (pItem.value.usBombItem) {
      case Enum225.STUN_GRENADE:
        return gszActionItemDesc[Enum49.ACTIONITEM_STUN];
      case Enum225.SMOKE_GRENADE:
        return gszActionItemDesc[Enum49.ACTIONITEM_SMOKE];
      case Enum225.TEARGAS_GRENADE:
        return gszActionItemDesc[Enum49.ACTIONITEM_TEARGAS];
      case Enum225.MUSTARD_GRENADE:
        return gszActionItemDesc[Enum49.ACTIONITEM_MUSTARD];
      case Enum225.HAND_GRENADE:
        return gszActionItemDesc[Enum49.ACTIONITEM_SMALL];
      case Enum225.TNT:
        return gszActionItemDesc[Enum49.ACTIONITEM_MEDIUM];
      case Enum225.C4:
        return gszActionItemDesc[Enum49.ACTIONITEM_LARGE];
      case Enum225.MINE:
        return gszActionItemDesc[Enum49.ACTIONITEM_MINE];
      case Enum225.TRIP_FLARE:
        return gszActionItemDesc[Enum49.ACTIONITEM_FLARE];
      case Enum225.TRIP_KLAXON:
        return gszActionItemDesc[Enum49.ACTIONITEM_TRIP_KLAXON];
      case Enum225.BIG_TEAR_GAS:
        return gszActionItemDesc[Enum49.ACTIONITEM_BIG_TEAR_GAS];
      default:
        return null;
    }
}

const enum Enum46 {
  SILENCER_ATTACHMENT_BUTTON,
  SNIPERSCOPE_ATTACHMENT_BUTTON,
  LASERSCOPE_ATTACHMENT_BUTTON,
  BIPOD_ATTACHMENT_BUTTON,
  DUCKBILL_ATTACHMENT_BUTTON,
  GLAUNCHER_ATTACHMENT_BUTTON,
  NUM_ATTACHMENT_BUTTONS,
}
let guiAttachmentButton: UINT32[] /* [NUM_ATTACHMENT_BUTTONS] */;
let gfAttachment: boolean[] /* [NUM_ATTACHMENT_BUTTONS] */;

let guiCeramicPlatesButton: UINT32;
let gfCeramicPlates: boolean;

let guiDetonatorButton: UINT32;
let gfDetonator: boolean;

let guiActionItemButton: UINT32;
let gbActionItemIndex: INT8 = Enum49.ACTIONITEM_MEDIUM;
let gbDefaultBombTrapLevel: INT8 = 9;

const enum Enum47 {
  EDITING_NOTHING,
  EDITING_NOT_YET_IMPLEMENTED,
  EDITING_DROPPABLE,
  EDITING_GUNS,
  EDITING_AMMO,
  EDITING_ARMOUR,
  EDITING_EQUIPMENT,
  EDITING_EXPLOSIVES,
  EDITING_MONEY,
  EDITING_ACTIONITEMS,
  EDITING_TRIGGERS,
  EDITING_KEYS,
  EDITING_OWNERSHIP,
}

let gbEditingMode: INT8 = Enum47.EDITING_NOTHING;

let gpItem: Pointer<OBJECTTYPE> = null;
let gfShowItemStatsPanel: boolean;
let gsItemGridNo: INT16;

let gpEditingItemPool: Pointer<ITEM_POOL> = null;

function ShowItemStatsPanel(): void {
  ShowEditorButtons(Enum32.FIRST_ITEMSTATS_BUTTON, Enum32.LAST_ITEMSTATS_BUTTON);
  if (iCurrentTaskbar == Enum36.TASK_MERCS || !gpItem)
    HideEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);
  gfShowItemStatsPanel = true;
}

function HideItemStatsPanel(): void {
  HideEditorButtons(Enum32.FIRST_ITEMSTATS_BUTTON, Enum32.LAST_ITEMSTATS_BUTTON);
  SpecifyItemToEdit(null, -1);
  gfShowItemStatsPanel = false;
}

function EnableItemStatsPanel(): void {
}

function DisableItemStatsPanel(): void {
}

function ExecuteItemStatsCmd(ubAction: UINT8): void {
  switch (ubAction) {
    case Enum48.ITEMSTATS_APPLY:
      if (gpItem && gpItem.value.usItem == Enum225.ACTION_ITEM) {
        ExtractAndUpdateActionItemsGUI();
      } else if (gpItem && gpItem.value.usItem == Enum225.SWITCH) {
        ExtractAndUpdateTriggersGUI();
      } else if (gpItem && gpItem.value.usItem == Enum225.OWNERSHIP) {
        ExtractAndUpdateOwnershipGUI();
      } else
        switch (gbEditingMode) {
          case Enum47.EDITING_GUNS:
            ExtractAndUpdateGunGUI();
            break;
          case Enum47.EDITING_AMMO:
            ExtractAndUpdateAmmoGUI();
            break;
          case Enum47.EDITING_ARMOUR:
            ExtractAndUpdateArmourGUI();
            break;
          case Enum47.EDITING_EQUIPMENT:
            ExtractAndUpdateEquipGUI();
            break;
          case Enum47.EDITING_EXPLOSIVES:
            ExtractAndUpdateExplosivesGUI();
            break;
          case Enum47.EDITING_MONEY:
            ExtractAndUpdateMoneyGUI();
            break;
          case Enum47.EDITING_KEYS:
            ExtractAndUpdateKeysGUI();
            break;
        }
      SetActiveField(0);
      gfRenderTaskbar = true;
      break;
    case Enum48.ITEMSTATS_CANCEL:
      SpecifyItemToEdit(gpItem, gsItemGridNo);
      SetActiveField(0);
      break;
    case Enum48.ITEMSTATS_DEFAULT:
      break;
    case Enum48.ITEMSTATS_DELETE:
      DeleteSelectedItem();
      break;
    case Enum48.ITEMSTATS_SHOW:
      ShowSelectedItem();
      break;
    case Enum48.ITEMSTATS_HIDE:
      HideSelectedItem();
      break;
  }
}

function RemoveItemGUI(): void {
  if (!gpItem)
    return;
  if (TextInputMode())
    KillTextInputMode();
  HideEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);
  RemoveGameTypeFlags();
  if (gpItem && gpItem.value.usItem == Enum225.ACTION_ITEM) {
    RemoveActionItemsGUI();
  } else if (gpItem && gpItem.value.usItem == Enum225.SWITCH) {
    RemoveTriggersGUI();
  } else if (gpItem && gpItem.value.usItem == Enum225.OWNERSHIP) {
    RemoveOwnershipGUI();
  } else
    switch (gbEditingMode) {
      case Enum47.EDITING_GUNS:
        RemoveGunGUI();
        break;
      case Enum47.EDITING_AMMO:
        RemoveAmmoGUI();
        break;
      case Enum47.EDITING_ARMOUR:
        RemoveArmourGUI();
        break;
      case Enum47.EDITING_EQUIPMENT:
        RemoveEquipGUI();
        break;
      case Enum47.EDITING_EXPLOSIVES:
        RemoveExplosivesGUI();
        break;
      case Enum47.EDITING_MONEY:
        RemoveMoneyGUI();
        break;
      case Enum47.EDITING_KEYS:
        RemoveKeysGUI();
        break;
    }
}

function SpecifyItemToEdit(pItem: Pointer<OBJECTTYPE>, iMapIndex: INT32): void {
  // Set the global item pointer to point to the new item
  if (gpItem == pItem)
    return;
  if (gpItem != pItem) {
    ExecuteItemStatsCmd(Enum48.ITEMSTATS_APPLY);
    RemoveItemGUI();
    gpItem = pItem;
    if (gpItemPool) {
      gpEditingItemPool = gpItemPool;
    }
    gsItemGridNo = iMapIndex;
  } else
    RemoveItemGUI();

  gfRenderTaskbar = true;

  if (!gpItem) {
    // Hide all edit features.
    gbEditingMode = Enum47.EDITING_NOTHING;
    gsItemGridNo = -1;
    return;
  }

  // Setup the text mode
  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);

  if (iCurrentTaskbar == Enum36.TASK_ITEMS)
    ShowEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);

  // Determine the type of item so that we can determine the dynamic editing mode.
  AddUserInputField(null);

  SetupGameTypeFlags();

  if (Item[gpItem.value.usItem].usItemClass == IC_MONEY) {
    gbEditingMode = Enum47.EDITING_MONEY;
    SetupMoneyGUI();
  } else if (gpItem.value.usItem == Enum225.ACTION_ITEM) {
    gbEditingMode = Enum47.EDITING_ACTIONITEMS;
    SetupActionItemsGUI();
    HideEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);
  } else if (gpItem.value.usItem == Enum225.SWITCH) {
    gbEditingMode = Enum47.EDITING_TRIGGERS;
    SetupTriggersGUI();
    HideEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);
  } else if (gpItem.value.usItem == Enum225.OWNERSHIP) {
    gbEditingMode = Enum47.EDITING_OWNERSHIP;
    SetupOwnershipGUI();
    HideEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);
  } else
    switch (Item[gpItem.value.usItem].usItemClass) {
      case IC_GUN:
        gbEditingMode = Enum47.EDITING_GUNS;
        SetupGunGUI();
        break;
      case IC_AMMO:
        gbEditingMode = Enum47.EDITING_AMMO;
        SetupAmmoGUI();
        break;
      case IC_ARMOUR:
        gbEditingMode = Enum47.EDITING_ARMOUR;
        SetupArmourGUI();
        break;
      case IC_MEDKIT:
      case IC_KIT:
      case IC_MISC:
      case IC_FACE:
      case IC_BLADE:
      case IC_LAUNCHER:
      case IC_THROWING_KNIFE:
      case IC_MONEY:
        gbEditingMode = Enum47.EDITING_EQUIPMENT;
        SetupEquipGUI();
        break;
      case IC_THROWN:
      case IC_GRENADE:
      case IC_EXPLOSV:
      case IC_BOMB:
        gbEditingMode = Enum47.EDITING_EXPLOSIVES;
        SetupExplosivesGUI();
        break;
      case IC_KEY:
        gbEditingMode = Enum47.EDITING_KEYS;
        SetupKeysGUI();
        break;
      case IC_PUNCH:
        if (gpItem.value.usItem != NOTHING) {
          gbEditingMode = Enum47.EDITING_EQUIPMENT;
          SetupEquipGUI();
          break;
        }
        // else fall through and act as nothing
      case IC_NONE:
        gbEditingMode = Enum47.EDITING_NOTHING;
        if (!(gpItem.value.fFlags & OBJECT_UNDROPPABLE))
          gbEditingMode = Enum47.EDITING_DROPPABLE;
        break;
      default:
        gbEditingMode = Enum47.EDITING_NOT_YET_IMPLEMENTED;
        break;
    }
  if (gpItemPool) {
    if (gWorldItems[gpItemPool.value.iItemIndex].bVisible == INVISIBLE) {
      UnclickEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);
      ShowSelectedItem();
    } else {
      ClickEditorButton(Enum32.ITEMSTATS_HIDDEN_BTN);
      HideSelectedItem();
    }
  }
}

// called from the taskbar renderer.
function UpdateItemStatsPanel(): void {
  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_GRAY2);
  SetFontShadow(FONT_NEARBLACK);
  SetFontBackground(FONT_BLACK);
  if (gpItem && iCurrentTaskbar == Enum36.TASK_ITEMS && gbEditingMode != Enum47.EDITING_TRIGGERS && gbEditingMode != Enum47.EDITING_ACTIONITEMS) {
    mprintf(500, 366, "Toggle hide flag");
  }
  SetFontForeground(FONT_YELLOW);
  switch (gbEditingMode) {
    case Enum47.EDITING_NOTHING:
      if (iCurrentTaskbar == Enum36.TASK_ITEMS)
        mprintf(520, 400, "No item selected.");
      else {
        mprintf(500, 390, "Slot available for");
        mprintf(500, 400, "random generation.");
      }
      return;
    case Enum47.EDITING_KEYS:
      if (!gpEditingItemPool) {
        mprintf(500, 400, "Keys not editable.");
        return;
      }
      break;
    case Enum47.EDITING_OWNERSHIP:
      mprintf(512, 384, "ProfileID of owner");
      return;
    case Enum47.EDITING_NOT_YET_IMPLEMENTED:
      mprintf(500, 400, "Item class not implemented.");
      return;
    case Enum47.EDITING_DROPPABLE:
      mprintf(500, 400, "Slot locked as empty.");
      return;
    case Enum47.EDITING_GUNS:
      mprintf(512, 384, "Status");
      mprintf(512, 404, "Rounds");
      mprintf(512, 424, "Trap Level");
      break;
    case Enum47.EDITING_AMMO:
      mprintf(512, 384, "Quantity");
      mprintf(512, 404, "Trap Level");
      break;
    case Enum47.EDITING_ARMOUR:
    case Enum47.EDITING_EQUIPMENT:
      mprintf(512, 384, "Status");
      mprintf(512, 404, "Trap Level");
      break;
    case Enum47.EDITING_EXPLOSIVES:
      mprintf(512, 380, "Status");
      mprintf(512, 404, "Quantity");
      mprintf(512, 424, "Trap Level");
      break;
    case Enum47.EDITING_MONEY:
      mprintf(532, 384, "Dollars");
      break;
    case Enum47.EDITING_ACTIONITEMS:
      mprintf(512, 369, "Status");
      mprintf(512, 389, "Trap Level");
      break;
    case Enum47.EDITING_TRIGGERS:
      mprintf(512, 369, "Trap Level");
      mprintf(512, 389, "Tolerance");
      if (gpEditingItemPool && gpItem.value.bFrequency >= PANIC_FREQUENCY_3 && gpItem.value.bFrequency <= PANIC_FREQUENCY)
        mprintf(500, 407, "Alarm Trigger");
      break;
  }
  if (gpEditingItemPool) {
    let iPercent: INT32 = 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance;
    if (iPercent == 100)
      SetFontForeground(FONT_YELLOW);
    else if (iPercent >= 50)
      SetFontForeground(FONT_ORANGE);
    else
      SetFontForeground(FONT_RED);
    mprintf(512, 444, "Exist Chance");
    mprintf(587, 366, "B");
    mprintf(609, 366, "R");
    mprintf(630, 366, "S");
  }
  InvalidateRegion(477, 362, 161, 97);
}

function RealisticOnlyCheckboxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[giRealisticCheckboxButton].value.uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    ButtonList[giSciFiCheckboxButton].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giSciFiCheckboxButton].value.uiFlags |= BUTTON_DIRTY;
    ButtonList[giBothCheckboxButton].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giBothCheckboxButton].value.uiFlags |= BUTTON_DIRTY;
    gWorldItems[gpEditingItemPool.value.iItemIndex].usFlags &= ~(WORLD_ITEM_REALISTIC_ONLY | WORLD_ITEM_SCIFI_ONLY);
    gWorldItems[gpEditingItemPool.value.iItemIndex].usFlags |= WORLD_ITEM_REALISTIC_ONLY;
  }
}

function SciFiOnlyCheckboxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[giRealisticCheckboxButton].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giRealisticCheckboxButton].value.uiFlags |= BUTTON_DIRTY;
    ButtonList[giSciFiCheckboxButton].value.uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    ButtonList[giBothCheckboxButton].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giBothCheckboxButton].value.uiFlags |= BUTTON_DIRTY;
    gWorldItems[gpEditingItemPool.value.iItemIndex].usFlags &= ~(WORLD_ITEM_REALISTIC_ONLY | WORLD_ITEM_SCIFI_ONLY);
    gWorldItems[gpEditingItemPool.value.iItemIndex].usFlags |= WORLD_ITEM_SCIFI_ONLY;
  }
}

function BothModesCheckboxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[giRealisticCheckboxButton].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giRealisticCheckboxButton].value.uiFlags |= BUTTON_DIRTY;
    ButtonList[giSciFiCheckboxButton].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giSciFiCheckboxButton].value.uiFlags |= BUTTON_DIRTY;
    ButtonList[giBothCheckboxButton].value.uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    gWorldItems[gpEditingItemPool.value.iItemIndex].usFlags &= ~(WORLD_ITEM_REALISTIC_ONLY | WORLD_ITEM_SCIFI_ONLY);
  }
}

function SetupGameTypeFlags(): void {
  if (gpEditingItemPool) {
    giBothCheckboxButton = CreateCheckBoxButton(573, 365, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, BothModesCheckboxCallback);
    SetButtonFastHelpText(giBothCheckboxButton, "Item appears in both Sci-Fi and Realistic modes. (|B)");
    giRealisticCheckboxButton = CreateCheckBoxButton(595, 365, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, RealisticOnlyCheckboxCallback);
    SetButtonFastHelpText(giRealisticCheckboxButton, "Item appears in |Realistic mode only.");
    giSciFiCheckboxButton = CreateCheckBoxButton(616, 365, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, SciFiOnlyCheckboxCallback);
    SetButtonFastHelpText(giSciFiCheckboxButton, "Item appears in |Sci-Fi mode only.");

    if (gWorldItems[gpEditingItemPool.value.iItemIndex].usFlags & WORLD_ITEM_REALISTIC_ONLY)
      ButtonList[giRealisticCheckboxButton].value.uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    else if (gWorldItems[gpEditingItemPool.value.iItemIndex].usFlags & WORLD_ITEM_SCIFI_ONLY)
      ButtonList[giSciFiCheckboxButton].value.uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
    else
      ButtonList[giBothCheckboxButton].value.uiFlags |= (BUTTON_CLICKED_ON | BUTTON_DIRTY);
  }
}

function RemoveGameTypeFlags(): void {
  if (giBothCheckboxButton != -1) {
    RemoveButton(giBothCheckboxButton);
    giBothCheckboxButton = -1;
  }
  if (giRealisticCheckboxButton != -1) {
    RemoveButton(giRealisticCheckboxButton);
    giRealisticCheckboxButton = -1;
  }
  if (giSciFiCheckboxButton != -1) {
    RemoveButton(giSciFiCheckboxButton);
    giSciFiCheckboxButton = -1;
  }
}

function SetupGunGUI(): void {
  let str: UINT16[] /* [20] */;
  let yp: INT16;
  memset(gfAttachment, 0, Enum46.NUM_ATTACHMENT_BUTTONS);
  swprintf(str, "%d", gpItem.value.bGunStatus);
  AddTextInputField(485, 380, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.ubGunShotsLeft);
  AddTextInputField(485, 400, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.bTrap);
  AddTextInputField(485, 420, 25, 15, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }
  // Attachments are a dynamic part of guns.  None, some, or all attachments could be available
  // for a particular weapon.  Show only the ones that we can apply to this gun.
  yp = 383;
  guiAttachmentButton[Enum46.SILENCER_ATTACHMENT_BUTTON] = -1;
  if (ValidAttachment(Enum225.SILENCER, gpItem.value.usItem)) {
    guiAttachmentButton[Enum46.SILENCER_ATTACHMENT_BUTTON] = CreateTextButton("SILENCER", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 570, yp, 60, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleAttachment);
    yp += 14;
    if (FindAttachment(gpItem, Enum225.SILENCER) != -1) {
      ButtonList[guiAttachmentButton[Enum46.SILENCER_ATTACHMENT_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
      gfAttachment[0] = true;
    }
  }
  guiAttachmentButton[Enum46.SNIPERSCOPE_ATTACHMENT_BUTTON] = -1;
  if (ValidAttachment(Enum225.SNIPERSCOPE, gpItem.value.usItem)) {
    guiAttachmentButton[Enum46.SNIPERSCOPE_ATTACHMENT_BUTTON] = CreateTextButton("SNIPERSCOPE", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 570, yp, 60, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleAttachment);
    yp += 14;
    if (FindAttachment(gpItem, Enum225.SNIPERSCOPE) != -1) {
      ButtonList[guiAttachmentButton[Enum46.SNIPERSCOPE_ATTACHMENT_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
      gfAttachment[1] = true;
    }
  }
  guiAttachmentButton[Enum46.LASERSCOPE_ATTACHMENT_BUTTON] = -1;
  if (ValidAttachment(Enum225.LASERSCOPE, gpItem.value.usItem)) {
    guiAttachmentButton[Enum46.LASERSCOPE_ATTACHMENT_BUTTON] = CreateTextButton("LASERSCOPE", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 570, yp, 60, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleAttachment);
    yp += 14;
    if (FindAttachment(gpItem, Enum225.LASERSCOPE) != -1) {
      ButtonList[guiAttachmentButton[Enum46.LASERSCOPE_ATTACHMENT_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
      gfAttachment[2] = true;
    }
  }
  guiAttachmentButton[Enum46.BIPOD_ATTACHMENT_BUTTON] = -1;
  if (ValidAttachment(Enum225.BIPOD, gpItem.value.usItem)) {
    guiAttachmentButton[Enum46.BIPOD_ATTACHMENT_BUTTON] = CreateTextButton("BIPOD", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 570, yp, 60, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleAttachment);
    yp += 14;
    if (FindAttachment(gpItem, Enum225.BIPOD) != -1) {
      ButtonList[guiAttachmentButton[Enum46.BIPOD_ATTACHMENT_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
      gfAttachment[3] = true;
    }
  }
  guiAttachmentButton[Enum46.DUCKBILL_ATTACHMENT_BUTTON] = -1;
  if (ValidAttachment(Enum225.DUCKBILL, gpItem.value.usItem)) {
    guiAttachmentButton[Enum46.DUCKBILL_ATTACHMENT_BUTTON] = CreateTextButton("DUCKBILL", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 570, yp, 60, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleAttachment);
    yp += 14;
    if (FindAttachment(gpItem, Enum225.DUCKBILL) != -1) {
      ButtonList[guiAttachmentButton[Enum46.DUCKBILL_ATTACHMENT_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
      gfAttachment[4] = true;
    }
  }
  guiAttachmentButton[Enum46.GLAUNCHER_ATTACHMENT_BUTTON] = -1;
  if (ValidAttachment(Enum225.UNDER_GLAUNCHER, gpItem.value.usItem)) {
    guiAttachmentButton[Enum46.GLAUNCHER_ATTACHMENT_BUTTON] = CreateTextButton("G-LAUNCHER", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 570, yp, 60, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleAttachment);
    yp += 14;
    if (FindAttachment(gpItem, Enum225.UNDER_GLAUNCHER) != -1) {
      ButtonList[guiAttachmentButton[Enum46.GLAUNCHER_ATTACHMENT_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
      gfAttachment[5] = true;
    }
  }
  ReEvaluateAttachmentStatii();
}

function RemoveGunGUI(): void {
  let i: INT32;
  for (i = 0; i < Enum46.NUM_ATTACHMENT_BUTTONS; i++) {
    if (guiAttachmentButton[i] != -1) {
      RemoveButton(guiAttachmentButton[i]);
      guiAttachmentButton[i] = -1;
    }
  }
}

function ExtractAndUpdateGunGUI(): void {
  let i: INT32;
  // Update the gun status
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = 20 + Random(81);
  else
    i = min(i, 100);
  gpItem.value.bGunStatus = i;
  SetInputFieldStringWithNumericStrictValue(1, i);
  // Update the ammo
  i = GetNumericStrictValueFromField(2);
  if (i == -1)
    i = Random(1 + Weapon[gpItem.value.usItem].ubMagSize);
  else
    i = min(i, Weapon[gpItem.value.usItem].ubMagSize);
  gpItem.value.ubGunShotsLeft = i;
  SetInputFieldStringWithNumericStrictValue(2, i);
  // Update the trap level
  i = GetNumericStrictValueFromField(3);
  i = (i == -1) ? 0 : min(i, 20);
  gpItem.value.bTrap = i;
  SetInputFieldStringWithNumericStrictValue(3, i);
  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(4);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(4, giDefaultExistChance);
  }
}

function SetupAmmoGUI(): void {
  let str: UINT16[] /* [20] */;
  swprintf(str, "%d", gpItem.value.ubNumberOfObjects);
  AddTextInputField(485, 380, 25, 15, MSYS_PRIORITY_NORMAL, str, 1, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.bTrap);
  AddTextInputField(485, 400, 25, 15, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }
}

function RemoveAmmoGUI(): void {
  // nothing to remove
}

function ExtractAndUpdateAmmoGUI(): void {
  let i: INT32;
  // Update the number of clips
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = 1 + Random(Item[gpItem.value.usItem].ubPerPocket);
  else
    i = max(1, min(i, Item[gpItem.value.usItem].ubPerPocket));
  gpItem.value.ubNumberOfObjects = i;
  SetInputFieldStringWithNumericStrictValue(1, i);
  CreateItems(gpItem.value.usItem, 100, gpItem.value.ubNumberOfObjects, gpItem);
  // Update the trap level
  i = GetNumericStrictValueFromField(2);
  i = (i == -1) ? 0 : min(i, 20);
  gpItem.value.bTrap = i;
  SetInputFieldStringWithNumericStrictValue(2, i);
  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(3);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(3, giDefaultExistChance);
  }
}

function SetupArmourGUI(): void {
  let str: UINT16[] /* [20] */;
  swprintf(str, "%d", gpItem.value.bStatus[0]);
  AddTextInputField(485, 380, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.bTrap);
  AddTextInputField(485, 400, 25, 15, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }

  guiCeramicPlatesButton = -1;
  if (ValidAttachment(Enum225.CERAMIC_PLATES, gpItem.value.usItem)) {
    guiCeramicPlatesButton = CreateTextButton("CERAMIC PLATES", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 558, 375, 72, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleCeramicPlates);
    if (FindAttachment(gpItem, Enum225.CERAMIC_PLATES) != -1) {
      ButtonList[guiCeramicPlatesButton].value.uiFlags |= BUTTON_CLICKED_ON;
      gfCeramicPlates = true;
    }
  }
}

function RemoveArmourGUI(): void {
  if (guiCeramicPlatesButton != -1) {
    RemoveButton(guiCeramicPlatesButton);
    guiCeramicPlatesButton = -1;
  }
}

function ExtractAndUpdateArmourGUI(): void {
  let i: INT32;
  // Update the armour status
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = 20 + Random(81);
  else
    i = min(i, 100);
  gpItem.value.bStatus[0] = i;
  SetInputFieldStringWithNumericStrictValue(1, i);
  // Update the trap level
  i = GetNumericStrictValueFromField(2);
  i = (i == -1) ? 0 : min(i, 20);
  gpItem.value.bTrap = i;
  SetInputFieldStringWithNumericStrictValue(2, i);
  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(3);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(3, giDefaultExistChance);
  }
}

function SetupEquipGUI(): void {
  let str: UINT16[] /* [20] */;
  swprintf(str, "%d", gpItem.value.bStatus[0]);
  AddTextInputField(485, 380, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.bTrap);
  AddTextInputField(485, 400, 25, 15, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }
}

function RemoveEquipGUI(): void {
  // nothing to remove
}

function ExtractAndUpdateEquipGUI(): void {
  let i: INT32;
  // Update the equipment status
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = 20 + Random(81);
  else
    i = min(i, 100);
  gpItem.value.bStatus[0] = i;
  SetInputFieldStringWithNumericStrictValue(1, i);
  // Update the trap level
  i = GetNumericStrictValueFromField(2);
  i = (i == -1) ? 0 : min(i, 20);
  gpItem.value.bTrap = i;
  SetInputFieldStringWithNumericStrictValue(2, i);
  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(3);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(3, giDefaultExistChance);
  }
}

function SetupExplosivesGUI(): void {
  let str: UINT16[] /* [20] */;
  let yp: INT16;
  swprintf(str, "%d", gpItem.value.bStatus[0]);
  AddTextInputField(485, 380, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.ubNumberOfObjects);
  AddTextInputField(485, 400, 25, 15, MSYS_PRIORITY_NORMAL, str, 1, INPUTTYPE_NUMERICSTRICT);
  if (Item[gpItem.value.usItem].ubPerPocket == 1) {
    DisableTextField(2);
  }
  swprintf(str, "%d", gpItem.value.bTrap);
  AddTextInputField(485, 420, 25, 15, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }
  yp = 375;
  gfDetonator = false;
  guiDetonatorButton = -1;
  if (ValidAttachment(Enum225.DETONATOR, gpItem.value.usItem)) {
    guiDetonatorButton = CreateTextButton("DETONATOR", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 570, yp, 60, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ToggleDetonator);
    yp += 14;
    if (FindAttachment(gpItem, Enum225.DETONATOR) != -1) {
      ButtonList[guiDetonatorButton].value.uiFlags |= BUTTON_CLICKED_ON;
      gfDetonator = true;
    }
  }
}

function RemoveExplosivesGUI(): void {
  if (guiDetonatorButton != -1) {
    RemoveButton(guiDetonatorButton);
    guiDetonatorButton = -1;
  }
}

function ExtractAndUpdateExplosivesGUI(): void {
  let i: INT32;
  // Update the explosives status
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = 20 + Random(81);
  else
    i = min(i, 100);
  gpItem.value.bStatus[0] = i;
  SetInputFieldStringWithNumericStrictValue(1, i);
  // Update the quantity
  if (Item[gpItem.value.usItem].ubPerPocket > 1) {
    i = GetNumericStrictValueFromField(2);
    if (i == -1)
      i = 1 + Random(Item[gpItem.value.usItem].ubPerPocket);
    else
      i = max(1, min(i, Item[gpItem.value.usItem].ubPerPocket));
    gpItem.value.ubNumberOfObjects = i;
    SetInputFieldStringWithNumericStrictValue(2, i);
    CreateItems(gpItem.value.usItem, gpItem.value.bStatus[0], gpItem.value.ubNumberOfObjects, gpItem);
  }
  // Update the trap level
  i = GetNumericStrictValueFromField(3);
  i = (i == -1) ? 0 : min(i, 20);
  gpItem.value.bTrap = i;
  SetInputFieldStringWithNumericStrictValue(3, i);
  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(4);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(4, giDefaultExistChance);
  }
}

function SetupMoneyGUI(): void {
  let str: UINT16[] /* [20] */;
  swprintf(str, "%d", gpItem.value.uiMoneyAmount);
  AddTextInputField(485, 380, 45, 15, MSYS_PRIORITY_NORMAL, str, 5, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }
}

function ExtractAndUpdateMoneyGUI(): void {
  let i: INT32;
  // Update the amount of cash
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = Random(20000);
  else
    i = max(1, min(i, 20000));
  gpItem.value.uiMoneyAmount = i;
  gpItem.value.bStatus[0] = 100;
  SetInputFieldStringWithNumericStrictValue(1, i);
  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(2);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(2, giDefaultExistChance);
  }
}

function RemoveMoneyGUI(): void {
}

function SetupOwnershipGUI(): void {
  let str: UINT16[] /* [20] */;
  swprintf(str, "%d", gpItem.value.ubOwnerProfile);
  AddTextInputField(485, 380, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  giOwnershipGroupButton = CreateTextButton(gszCivGroupNames[gpItem.value.ubOwnerCivGroup], SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 485, 415, 80, 25, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), OwnershipGroupButtonCallback);
}

function OwnershipGroupButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    InitPopupMenu(btn.value.IDNum, Enum53.OWNERSHIPGROUP_POPUP, DIR_UPLEFT);
  }
}

function SetOwnershipGroup(ubNewGroup: UINT8): void {
  gpItem.value.ubOwnerCivGroup = ubNewGroup;
  SpecifyButtonText(giOwnershipGroupButton, gszCivGroupNames[ubNewGroup]);
}

function ExtractAndUpdateOwnershipGUI(): void {
  let i: INT32;
  // Update the amount of cash
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = Random(0);
  else
    i = max(0, min(i, 255));
  gpItem.value.ubOwnerProfile = i;
  SetInputFieldStringWithNumericStrictValue(1, i);
}

function RemoveOwnershipGUI(): void {
  if (giOwnershipGroupButton != -1) {
    RemoveButton(giOwnershipGroupButton);
    giOwnershipGroupButton = -1;
  }
}

function SetupKeysGUI(): void {
  let str: UINT16[] /* [20] */;
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }
}

function ExtractAndUpdateKeysGUI(): void {
  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(1);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(1, giDefaultExistChance);
  }
}

function RemoveKeysGUI(): void {
}

function SetupActionItemsGUI(): void {
  let str: UINT16[] /* [4] */;
  let pStr: Pointer<UINT16>;
  swprintf(str, "%d", gpItem.value.bStatus[0]);
  AddTextInputField(485, 365, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.bTrap);
  AddTextInputField(485, 385, 25, 15, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  }
  pStr = GetActionItemName(gpItem);
  guiActionItemButton = CreateTextButton(pStr, FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 510, 410, 100, 20, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ActionItemCallback);
}

function ExtractAndUpdateActionItemsGUI(): void {
  let i: INT32;
  // Update the equipment status
  i = GetNumericStrictValueFromField(1);
  if (i == -1)
    i = 20 + Random(81);
  else
    i = min(i, 100);
  gpItem.value.bStatus[0] = i;
  SetInputFieldStringWithNumericStrictValue(1, i);
  // Update the trap level
  i = GetNumericStrictValueFromField(2);
  i = (i == -1) ? 0 : min(i, 20);
  if (i != gpItem.value.bTrap)
    gbDefaultBombTrapLevel = i;
  gpItem.value.bTrap = i;
  SetInputFieldStringWithNumericStrictValue(2, i);

  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(3);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(3, giDefaultExistChance);
  }
}

function RemoveActionItemsGUI(): void {
  if (guiActionItemButton != -1) {
    RemoveButton(guiActionItemButton);
    guiActionItemButton = -1;
  }
}

function AlarmTriggerCheckboxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
      gpItem.value.fFlags |= OBJECT_ALARM_TRIGGER;
    else
      gpItem.value.fFlags &= ~OBJECT_ALARM_TRIGGER;
  }
}

function SetupTriggersGUI(): void {
  let str: UINT16[] /* [4] */;
  swprintf(str, "%d", gpItem.value.bTrap);
  AddTextInputField(485, 365, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  swprintf(str, "%d", gpItem.value.ubTolerance);
  AddTextInputField(485, 385, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  if (gpEditingItemPool) {
    swprintf(str, "%d", 100 - gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance);
    AddTextInputField(485, 440, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
    if (gpItem.value.bFrequency <= PANIC_FREQUENCY && gpItem.value.bFrequency >= PANIC_FREQUENCY_3) {
      giAlarmTriggerButton = CreateCheckBoxButton(485, 405, "EDITOR//smCheckBox.sti", MSYS_PRIORITY_NORMAL, AlarmTriggerCheckboxCallback);
      SetButtonFastHelpText(giAlarmTriggerButton, "If the panic trigger is an alarm trigger,\nenemies won't attempt to use it if they\nare already aware of your presence.");
      if (gpItem.value.fFlags & OBJECT_ALARM_TRIGGER)
        ButtonList[giAlarmTriggerButton].value.uiFlags |= BUTTON_CLICKED_ON;
    }
  }
}

function ExtractAndUpdateTriggersGUI(): void {
  let i: INT32;
  // Update the trap level
  i = GetNumericStrictValueFromField(1);
  i = (i == -1) ? 0 : min(i, 20);
  gpItem.value.bTrap = i;
  SetInputFieldStringWithNumericStrictValue(1, i);

  i = GetNumericStrictValueFromField(2);
  i = (i == -1) ? 0 : max(0, min(i, 99));
  gpItem.value.ubTolerance = i;
  SetInputFieldStringWithNumericStrictValue(2, i);

  if (gpEditingItemPool) {
    giDefaultExistChance = GetNumericStrictValueFromField(3);
    giDefaultExistChance = (giDefaultExistChance == -1) ? 100 : max(1, min(giDefaultExistChance, 100));
    gWorldItems[gpEditingItemPool.value.iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
    SetInputFieldStringWithNumericStrictValue(3, giDefaultExistChance);
  }
}

function RemoveTriggersGUI(): void {
  if (gpEditingItemPool && gpItem.value.bFrequency <= PANIC_FREQUENCY && gpItem.value.bFrequency >= PANIC_FREQUENCY_3) {
    if (giAlarmTriggerButton != -1) {
      RemoveButton(giAlarmTriggerButton);
      giAlarmTriggerButton = -1;
    }
  }
}

function ToggleAttachment(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let i: INT32;
    let usAttachment: UINT16;
    let temp: OBJECTTYPE;
    for (i = 0; i < Enum46.NUM_ATTACHMENT_BUTTONS; i++) {
      // Loop through and find the button that was just modified
      switch (i) {
        case 0:
          usAttachment = Enum225.SILENCER;
          break;
        case 1:
          usAttachment = Enum225.SNIPERSCOPE;
          break;
        case 2:
          usAttachment = Enum225.LASERSCOPE;
          break;
        case 3:
          usAttachment = Enum225.BIPOD;
          break;
        case 4:
          usAttachment = Enum225.DUCKBILL;
          break;
        case 5:
          usAttachment = Enum225.UNDER_GLAUNCHER;
          break;
      }
      if (guiAttachmentButton[i] != -1 && btn == ButtonList[guiAttachmentButton[i]]) {
        // Found it, now check the state of the button.
        if (!gfAttachment[i]) {
          gfAttachment[i] = true;
          btn.value.uiFlags |= BUTTON_CLICKED_ON;
          CreateItem(usAttachment, gpItem.value.bGunStatus, addressof(temp));
          AttachObject(null, gpItem, addressof(temp));
        } else {
          // Button is out, so remove the attachment
          let slot: INT8;
          gfAttachment[i] = false;
          btn.value.uiFlags &= ~BUTTON_CLICKED_ON;
          slot = FindAttachment(gpItem, usAttachment);
          if (slot != -1)
            RemoveAttachment(gpItem, slot, addressof(temp));
        }
      }
    }
    ReEvaluateAttachmentStatii();
  }
}

function ToggleCeramicPlates(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let temp: OBJECTTYPE;
    gfCeramicPlates ^= true;
    if (gfCeramicPlates) {
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
      CreateItem(Enum225.CERAMIC_PLATES, gpItem.value.bStatus[0], addressof(temp));
      AttachObject(null, gpItem, addressof(temp));
    } else {
      let slot: INT8;
      btn.value.uiFlags &= ~BUTTON_CLICKED_ON;
      slot = FindAttachment(gpItem, Enum225.CERAMIC_PLATES);
      if (slot != -1)
        RemoveAttachment(gpItem, slot, addressof(temp));
    }
  }
}

function ToggleDetonator(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let temp: OBJECTTYPE;
    if (!gfDetonator) {
      gfDetonator = true;
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
      CreateItem(Enum225.DETONATOR, gpItem.value.bStatus[0], addressof(temp));
      AttachObject(null, gpItem, addressof(temp));
    } else {
      // Button is out, so remove the attachment
      let slot: INT8;
      gfDetonator = false;
      btn.value.uiFlags &= ~BUTTON_CLICKED_ON;
      slot = FindAttachment(gpItem, Enum225.DETONATOR);
      if (slot != -1)
        RemoveAttachment(gpItem, slot, addressof(temp));
    }
  }
}

function ActionItemCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    InitPopupMenu(guiActionItemButton, Enum53.ACTIONITEM_POPUP, DIR_UPLEFT);
  }
}

function ChangeActionItem(pItem: Pointer<OBJECTTYPE>, bActionItemIndex: INT8): void {
  pItem.value.usItem = Enum225.ACTION_ITEM;
  pItem.value.bActionValue = Enum191.ACTION_ITEM_BLOW_UP;
  switch (bActionItemIndex) {
    case Enum49.ACTIONITEM_TRIP_KLAXON:
      pItem.value.usBombItem = Enum225.TRIP_KLAXON;
      break;
    case Enum49.ACTIONITEM_FLARE:
      pItem.value.usBombItem = Enum225.TRIP_FLARE;
      break;
    case Enum49.ACTIONITEM_TEARGAS:
      pItem.value.usBombItem = Enum225.TEARGAS_GRENADE;
      break;
    case Enum49.ACTIONITEM_STUN:
      pItem.value.usBombItem = Enum225.STUN_GRENADE;
      break;
    case Enum49.ACTIONITEM_SMOKE:
      pItem.value.usBombItem = Enum225.SMOKE_GRENADE;
      break;
    case Enum49.ACTIONITEM_MUSTARD:
      pItem.value.usBombItem = Enum225.MUSTARD_GRENADE;
      break;
    case Enum49.ACTIONITEM_MINE:
      pItem.value.usBombItem = Enum225.MINE;
      break;
    case Enum49.ACTIONITEM_OPEN:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_OPEN_DOOR;
      break;
    case Enum49.ACTIONITEM_CLOSE:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_CLOSE_DOOR;
      break;
    case Enum49.ACTIONITEM_UNLOCK_DOOR:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_UNLOCK_DOOR;
      break;
    case Enum49.ACTIONITEM_TOGGLE_LOCK:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_TOGGLE_LOCK;
      break;
    case Enum49.ACTIONITEM_UNTRAP_DOOR:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_UNTRAP_DOOR;
      break;
    case Enum49.ACTIONITEM_TOGGLE_PRESSURE_ITEMS:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_TOGGLE_PRESSURE_ITEMS;
      break;
    case Enum49.ACTIONITEM_SMPIT:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_SMALL_PIT;
      break;
    case Enum49.ACTIONITEM_LGPIT:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_LARGE_PIT;
      break;
    case Enum49.ACTIONITEM_TOGGLE_DOOR:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_TOGGLE_DOOR;
      break;
    case Enum49.ACTIONITEM_TOGGLE_ACTION1:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_TOGGLE_ACTION1;
      break;
    case Enum49.ACTIONITEM_TOGGLE_ACTION2:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_TOGGLE_ACTION2;
      break;
    case Enum49.ACTIONITEM_TOGGLE_ACTION3:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_TOGGLE_ACTION3;
      break;
    case Enum49.ACTIONITEM_TOGGLE_ACTION4:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_TOGGLE_ACTION4;
      break;
    case Enum49.ACTIONITEM_ENTER_BROTHEL:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_ENTER_BROTHEL;
      break;
    case Enum49.ACTIONITEM_EXIT_BROTHEL:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_EXIT_BROTHEL;
      break;
    case Enum49.ACTIONITEM_KINGPIN_ALARM:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_KINGPIN_ALARM;
      break;
    case Enum49.ACTIONITEM_SEX:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_SEX;
      break;
    case Enum49.ACTIONITEM_REVEAL_ROOM:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_REVEAL_ROOM;
      break;
    case Enum49.ACTIONITEM_LOCAL_ALARM:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_LOCAL_ALARM;
      break;
    case Enum49.ACTIONITEM_GLOBAL_ALARM:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_GLOBAL_ALARM;
      break;
    case Enum49.ACTIONITEM_KLAXON:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_KLAXON;
      break;
    case Enum49.ACTIONITEM_SMALL:
      pItem.value.usBombItem = Enum225.HAND_GRENADE;
      break;
    case Enum49.ACTIONITEM_MEDIUM:
      pItem.value.usBombItem = Enum225.TNT;
      break;
    case Enum49.ACTIONITEM_LARGE:
      pItem.value.usBombItem = Enum225.C4;
      break;
    case Enum49.ACTIONITEM_MUSEUM_ALARM:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_MUSEUM_ALARM;
      break;
    case Enum49.ACTIONITEM_BLOODCAT_ALARM:
      pItem.value.usBombItem = NOTHING;
      pItem.value.bActionValue = Enum191.ACTION_ITEM_BLOODCAT_ALARM;
      break;
    case Enum49.ACTIONITEM_BIG_TEAR_GAS:
      pItem.value.usBombItem = Enum225.BIG_TEAR_GAS;
      break;
  }
}

function UpdateActionItem(bActionItemIndex: INT8): void {
  gbActionItemIndex = bActionItemIndex; // used for future new actionitems as the default.

  if (!gpItemPool || !gpItem)
    return;

  // If the previous item was a pit, remove it before changing it
  if (gpItem.value.usItem == Enum225.ACTION_ITEM) {
    if (gpItem.value.bActionValue == Enum191.ACTION_ITEM_SMALL_PIT)
      Remove3X3Pit(gWorldItems[gpItemPool.value.iItemIndex].sGridNo);
    else if (gpItem.value.bActionValue == Enum191.ACTION_ITEM_LARGE_PIT)
      Remove5X5Pit(gWorldItems[gpItemPool.value.iItemIndex].sGridNo);
  }

  ChangeActionItem(gpItem, gbActionItemIndex);
  SpecifyButtonText(guiActionItemButton, GetActionItemName(gpItem));

  // If the new item is a pit, add it so we can see how it looks.
  if (gpItem.value.usItem == Enum225.ACTION_ITEM) {
    if (gpItem.value.bActionValue == Enum191.ACTION_ITEM_SMALL_PIT)
      Add3X3Pit(gWorldItems[gpItemPool.value.iItemIndex].sGridNo);
    else if (gpItem.value.bActionValue == Enum191.ACTION_ITEM_LARGE_PIT)
      Add5X5Pit(gWorldItems[gpItemPool.value.iItemIndex].sGridNo);
  }
}

function ReEvaluateAttachmentStatii(): void {
  let i: INT32;
  let usAttachment: UINT16;
  for (i = 0; i < Enum46.NUM_ATTACHMENT_BUTTONS; i++) {
    if (guiAttachmentButton[i] != -1 && !(ButtonList[guiAttachmentButton[i]].value.uiFlags & BUTTON_CLICKED_ON)) {
      // if button exists and button isn't clicked
      switch (i) {
        case 0:
          usAttachment = Enum225.SILENCER;
          break;
        case 1:
          usAttachment = Enum225.SNIPERSCOPE;
          break;
        case 2:
          usAttachment = Enum225.LASERSCOPE;
          break;
        case 3:
          usAttachment = Enum225.BIPOD;
          break;
        case 4:
          usAttachment = Enum225.DUCKBILL;
          break;
        case 5:
          usAttachment = Enum225.UNDER_GLAUNCHER;
          break;
      }
      if (ValidItemAttachment(gpItem, usAttachment, true))
        EnableButton(guiAttachmentButton[i]);
      else
        DisableButton(guiAttachmentButton[i]);
    }
  }
}
