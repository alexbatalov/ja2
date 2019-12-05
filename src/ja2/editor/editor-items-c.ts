namespace ja2 {

const NUMBER_TRIGGERS = 27;
const PRESSURE_ACTION_ID = (NUMBER_TRIGGERS - 1);

export let giDefaultExistChance: INT32 = 100;

interface IPListNode {
  sGridNo: INT16;
  next: IPListNode | null;
}

function createIPListNode(): IPListNode {
  return {
    sGridNo: 0,
    next: null,
  };
}

let pIPHead: IPListNode | null /* Pointer<IPListNode> */ = null;

let gpCurrItemPoolNode: IPListNode | null /* Pointer<IPListNode> */ = null;
export let gpItemPool: ITEM_POOL | null /* Pointer<ITEM_POOL> */ = null;

export function BuildItemPoolList(): void {
  let temp: ITEM_POOL | null;
  let tail: IPListNode = <IPListNode><unknown>null;
  let i: UINT16;
  KillItemPoolList();
  for (i = 0; i < WORLD_MAX; i++) {
    if ((temp = GetItemPool(i, 0))) {
      if (!pIPHead) {
        pIPHead = createIPListNode();
        Assert(pIPHead);
        tail = pIPHead;
      } else {
        tail.next = createIPListNode();
        Assert(tail.next);
        tail = tail.next;
      }
      ShowItemCursor(i);
      tail.sGridNo = i;
      tail.next = null;
    }
  }
  gpCurrItemPoolNode = pIPHead;
  SpecifyItemToEdit(null, -1);
}

export function KillItemPoolList(): void {
  let pIPCurr: IPListNode | null;
  pIPCurr = pIPHead;
  while (pIPCurr) {
    HideItemCursor(pIPCurr.sGridNo);
    pIPHead = (<IPListNode>pIPHead).next;
    MemFree(pIPCurr);
    pIPCurr = pIPHead;
  }
  pIPHead = null;
}

// Contains global information about the editor items
// May be expanded to encapsulate the entire editor later.
export let eInfo: EditorItemsInfo = createEditorItemsInfo();

// Does some precalculations regarding the number of each item type, so that it
// isn't calculated every time a player changes categories.
export function EntryInitEditorItemsInfo(): void {
  let i: INT32;
  let item: INVTYPE;
  eInfo.uiBuffer = 0;
  eInfo.fKill = false;
  eInfo.fActive = false;
  eInfo.sWidth = 0;
  eInfo.sHeight = 0;
  eInfo.sScrollIndex = 0;
  eInfo.sSelItemIndex = 0;
  eInfo.sHilitedItemIndex = -1;
  eInfo.sNumItems = 0;
  eInfo.pusItemIndex = <UINT16[]><unknown>null;
  if (eInfo.fGameInit) {
    // This only gets called one time in game execution.
    resetEditorItemsInfo(eInfo);
    eInfo.sHilitedItemIndex = -1;
    eInfo.uiItemType = Enum35.TBAR_MODE_ITEM_WEAPONS;
    // Pre-calculate the number of each item type.
    eInfo.sNumTriggers = NUMBER_TRIGGERS;
    for (i = 0; i < Enum225.MAXITEMS; i++) {
      item = Item[i];
      if (Item[i].fFlags & ITEM_NOT_EDITOR)
        continue;
      if (i == Enum225.SWITCH || i == Enum225.ACTION_ITEM) {
      } else
        switch (item.usItemClass) {
          case IC_GUN:
          case IC_BLADE:
          case IC_THROWN:
          case IC_LAUNCHER:
          case IC_THROWING_KNIFE:
            eInfo.sNumWeapons++;
            break;
          case IC_PUNCH:
            if (i != NOTHING) {
              eInfo.sNumWeapons++;
            }
            break;
          case IC_AMMO:
            eInfo.sNumAmmo++;
            break;
          case IC_ARMOUR:
            eInfo.sNumArmour++;
            break;
          case IC_GRENADE:
          case IC_BOMB:
            eInfo.sNumExplosives++;
            break;
          case IC_MEDKIT:
          case IC_KIT:
          case IC_FACE:
          case IC_MISC:
          case IC_MONEY:
            if (eInfo.sNumEquipment1 < 30)
              eInfo.sNumEquipment1++;
            else if (eInfo.sNumEquipment2 < 30)
              eInfo.sNumEquipment2++;
            else
              eInfo.sNumEquipment3++;
            break;
            // case IC_KEY:
            //	eInfo.sNumKeys++;
            //	break;
        }
    }
    eInfo.sNumKeys = NUM_KEYS;
  }
}

export function InitEditorItemsInfo(uiItemType: UINT32): void {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;
  let uiSrcPitchBYTES: UINT32;
  let uiDestPitchBYTES: UINT32;
  let item: INVTYPE;
  let SaveRect: SGPRect = createSGPRect();
  let NewRect: SGPRect = createSGPRect();
  let hVObject: SGPVObject;
  let uiVideoObjectIndex: UINT32;
  let usUselessWidth: UINT16;
  let usUselessHeight: UINT16;
  let sWidth: INT16;
  let sOffset: INT16;
  let sStart: INT16;
  let i: INT16;
  let x: INT16;
  let y: INT16;
  let usCounter: UINT16;
  let pStr: string /* INT16[100] */; //, pStr2[ 100 ];
  let pItemName: string /* UINT16[SIZE_ITEM_NAME] */;
  let ubBitDepth: UINT8;
  let fTypeMatch: boolean;
  let iEquipCount: INT32 = 0;

  // Check to make sure that there isn't already a valid eInfo
  if (eInfo.fActive) {
    if (eInfo.uiItemType == uiItemType) {
      // User clicked on the same item classification -- ignore
      return;
    } else {
      // User selected a different item classification -- delete it first.
      ClearEditorItemsInfo();
      ClearTaskbarRegion(100, 360, 480, 440);
    }
  } else {
    // Clear the menu area, so that the buffer doesn't get corrupted.
    ClearTaskbarRegion(100, 360, 480, 440);
  }
  EnableEditorRegion(Enum45.ITEM_REGION_ID);

  eInfo.uiItemType = uiItemType;
  eInfo.fActive = true;
  // Begin initialization of data.
  switch (uiItemType) {
    case Enum35.TBAR_MODE_ITEM_WEAPONS:
      eInfo.sNumItems = eInfo.sNumWeapons;
      eInfo.sScrollIndex = eInfo.sSaveWeaponsScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelWeaponsIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_AMMO:
      eInfo.sNumItems = eInfo.sNumAmmo;
      eInfo.sScrollIndex = eInfo.sSaveAmmoScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelAmmoIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_ARMOUR:
      eInfo.sNumItems = eInfo.sNumArmour;
      eInfo.sScrollIndex = eInfo.sSaveArmourScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelArmourIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_EXPLOSIVES:
      eInfo.sNumItems = eInfo.sNumExplosives;
      eInfo.sScrollIndex = eInfo.sSaveExplosivesScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelExplosivesIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_EQUIPMENT1:
      eInfo.sNumItems = eInfo.sNumEquipment1;
      eInfo.sScrollIndex = eInfo.sSaveEquipment1ScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelEquipment1Index;
      break;
    case Enum35.TBAR_MODE_ITEM_EQUIPMENT2:
      eInfo.sNumItems = eInfo.sNumEquipment2;
      eInfo.sScrollIndex = eInfo.sSaveEquipment2ScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelEquipment2Index;
      break;
    case Enum35.TBAR_MODE_ITEM_EQUIPMENT3:
      eInfo.sNumItems = eInfo.sNumEquipment3;
      eInfo.sScrollIndex = eInfo.sSaveEquipment3ScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelEquipment3Index;
      break;
    case Enum35.TBAR_MODE_ITEM_TRIGGERS:
      eInfo.sNumItems = eInfo.sNumTriggers;
      eInfo.sScrollIndex = eInfo.sSaveTriggersScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelTriggersIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_KEYS:
      eInfo.sNumItems = eInfo.sNumKeys;
      eInfo.sScrollIndex = eInfo.sSaveKeysScrollIndex;
      eInfo.sSelItemIndex = eInfo.sSaveSelKeysIndex;
      break;
    default:
      // error
      return;
  }
  // Allocate memory to store all the item pointers.
  eInfo.pusItemIndex = createArray(eInfo.sNumItems, 0);

  // Disable the appropriate scroll buttons based on the saved scroll index if applicable
  // Left most scroll position
  DetermineItemsScrolling();
  // calculate the width of the buffer based on the number of items.
  // every pair of items (odd rounded up) requires 60 pixels for width.
  // the minimum buffer size is 420.  Height is always 80 pixels.
  eInfo.sWidth = (eInfo.sNumItems > 12) ? ((eInfo.sNumItems + 1) / 2) * 60 : 360;
  eInfo.sHeight = 80;
  // Create item buffer
  ({ usWidth: usUselessWidth, usHeight: usUselessHeight, ubBitDepth } = GetCurrentVideoSettings());
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = eInfo.sWidth;
  vs_desc.usHeight = eInfo.sHeight;
  vs_desc.ubBitDepth = ubBitDepth;

  //!!!Memory check.  Create the item buffer
  if ((eInfo.uiBuffer = AddVideoSurface(vs_desc)) === -1) {
    eInfo.fKill = true;
    eInfo.fActive = false;
    return;
  }

  pDestBuf = LockVideoSurface(eInfo.uiBuffer, addressof(uiDestPitchBYTES));
  pSrcBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiSrcPitchBYTES));

  // copy a blank chunk of the editor interface to the new buffer.
  for (i = 0; i < eInfo.sWidth; i += 60) {
    Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, 0 + i, 0, 100, 360, 60, 80);
  }

  UnLockVideoSurface(eInfo.uiBuffer);
  UnLockVideoSurface(FRAME_BUFFER);

  x = 0;
  y = 0;
  usCounter = 0;
  NewRect.iTop = 0;
  NewRect.iBottom = eInfo.sHeight;
  NewRect.iLeft = 0;
  NewRect.iRight = eInfo.sWidth;
  GetClippingRect(SaveRect);
  SetClippingRect(NewRect);
  if (eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_KEYS) {
    // Keys use a totally different method for determining
    for (i = 0; i < eInfo.sNumItems; i++) {
      item = Item[KeyTable[0].usItem + LockTable[i].usKeyItem];
      uiVideoObjectIndex = GetInterfaceGraphicForItem(item);
      hVObject = GetVideoObject(uiVideoObjectIndex);

      // Store these item pointers for later when rendering selected items.
      eInfo.pusItemIndex[i] = KeyTable[0].usItem + LockTable[i].usKeyItem;

      SetFont(SMALLCOMPFONT());
      SetFontForeground(FONT_MCOLOR_WHITE);
      SetFontDestBuffer(eInfo.uiBuffer, 0, 0, eInfo.sWidth, eInfo.sHeight, false);

      pStr = swprintf("%S", LockTable[i].ubEditorName);
      DisplayWrappedString(x, (y + 25), 60, 2, SMALLCOMPFONT(), FONT_WHITE, pStr, FONT_BLACK, true, CENTER_JUSTIFIED);

      // Calculate the center position of the graphic in a 60 pixel wide area.
      sWidth = hVObject.pETRLEObject[item.ubGraphicNum].usWidth;
      sOffset = hVObject.pETRLEObject[item.ubGraphicNum].sOffsetX;
      sStart = x + (60 - sWidth - sOffset * 2) / 2;

      BltVideoObjectOutlineFromIndex(eInfo.uiBuffer, uiVideoObjectIndex, item.ubGraphicNum, sStart, y + 2, 0, false);
      // cycle through the various slot positions (0,0), (0,40), (60,0), (60,40), (120,0)...
      if (y == 0) {
        y = 40;
      } else {
        y = 0;
        x += 60;
      }
    }
  } else
    for (i = 0; i < eInfo.sNumItems; i++) {
      fTypeMatch = false;
      while (usCounter < Enum225.MAXITEMS && !fTypeMatch) {
        item = Item[usCounter];
        if (Item[usCounter].fFlags & ITEM_NOT_EDITOR) {
          usCounter++;
          continue;
        }
        if (eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_TRIGGERS) {
          if (i < PRESSURE_ACTION_ID)
            usCounter = (i % 2) ? Enum225.ACTION_ITEM : Enum225.SWITCH;
          else
            usCounter = Enum225.ACTION_ITEM;
          fTypeMatch = true;
          item = Item[usCounter];
        } else
          switch (item.usItemClass) {
            case IC_GUN:
            case IC_BLADE:
            case IC_LAUNCHER:
            case IC_THROWN:
            case IC_THROWING_KNIFE:
              fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_WEAPONS;
              break;
            case IC_PUNCH:
              if (i != NOTHING) {
                fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_WEAPONS;
              } else {
                fTypeMatch = false;
              }
              break;
            case IC_AMMO:
              fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_AMMO;
              break;
            case IC_ARMOUR:
              fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_ARMOUR;
              break;
            case IC_GRENADE:
            case IC_BOMB:
              fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_EXPLOSIVES;
              break;
            case IC_MEDKIT:
            case IC_KIT:
            case IC_FACE:
            case IC_MISC:
            case IC_MONEY:
              if (usCounter == Enum225.ACTION_ITEM || usCounter == Enum225.SWITCH)
                break;
              if (iEquipCount < 30)
                fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_EQUIPMENT1;
              else if (iEquipCount < 60)
                fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_EQUIPMENT2;
              else
                fTypeMatch = eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_EQUIPMENT3;
              iEquipCount++;
              break;
          }
        if (fTypeMatch) {
          uiVideoObjectIndex = GetInterfaceGraphicForItem(item);
          hVObject = GetVideoObject(uiVideoObjectIndex);

          // Store these item pointers for later when rendering selected items.
          eInfo.pusItemIndex[i] = usCounter;

          SetFont(SMALLCOMPFONT());
          SetFontForeground(FONT_MCOLOR_WHITE);
          SetFontDestBuffer(eInfo.uiBuffer, 0, 0, eInfo.sWidth, eInfo.sHeight, false);

          if (eInfo.uiItemType != Enum35.TBAR_MODE_ITEM_TRIGGERS) {
            ({ name: pItemName } = LoadItemInfo(usCounter));
            pStr = swprintf("%s", pItemName);
          } else {
            if (i == PRESSURE_ACTION_ID) {
              pStr = "Pressure Action";
            } else if (i < 2) {
              if (usCounter == Enum225.SWITCH)
                pStr = "Panic Trigger1";
              else
                pStr = "Panic Action1";
            } else if (i < 4) {
              if (usCounter == Enum225.SWITCH)
                pStr = "Panic Trigger2";
              else
                pStr = "Panic Action2";
            } else if (i < 6) {
              if (usCounter == Enum225.SWITCH)
                pStr = "Panic Trigger3";
              else
                pStr = "Panic Action3";
            } else {
              if (usCounter == Enum225.SWITCH)
                pStr = swprintf("Trigger%d", (i - 4) / 2);
              else
                pStr = swprintf("Action%d", (i - 4) / 2);
            }
          }
          DisplayWrappedString(x, (y + 25), 60, 2, SMALLCOMPFONT(), FONT_WHITE, pStr, FONT_BLACK, true, CENTER_JUSTIFIED);

          // Calculate the center position of the graphic in a 60 pixel wide area.
          sWidth = hVObject.pETRLEObject[item.ubGraphicNum].usWidth;
          sOffset = hVObject.pETRLEObject[item.ubGraphicNum].sOffsetX;
          sStart = x + (60 - sWidth - sOffset * 2) / 2;

          if (sWidth) {
            BltVideoObjectOutlineFromIndex(eInfo.uiBuffer, uiVideoObjectIndex, item.ubGraphicNum, sStart, y + 2, 0, false);
          }
          // cycle through the various slot positions (0,0), (0,40), (60,0), (60,40), (120,0)...
          if (y == 0) {
            y = 40;
          } else {
            y = 0;
            x += 60;
          }
        }
        usCounter++;
      }
    }
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
  SetClippingRect(SaveRect);
  gfRenderTaskbar = true;
}

export function DetermineItemsScrolling(): void {
  if (!eInfo.sScrollIndex)
    DisableEditorButton(Enum32.ITEMS_LEFTSCROLL);
  else
    EnableEditorButton(Enum32.ITEMS_LEFTSCROLL);
  // Right most scroll position.  Calculated by taking every pair of numItems rounded up,
  // and subtracting 7 (because a scroll index 0 is disabled if there are <=12 items,
  // index 1 for <=14 items, index 2 for <=16 items...
  if (eInfo.sScrollIndex == Math.max(((eInfo.sNumItems + 1) / 2) - 6, 0))
    DisableEditorButton(Enum32.ITEMS_RIGHTSCROLL);
  else
    EnableEditorButton(Enum32.ITEMS_RIGHTSCROLL);
}

export function RenderEditorItemsInfo(): void {
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;
  let uiSrcPitchBYTES: UINT32;
  let uiDestPitchBYTES: UINT32;
  let item: INVTYPE;
  let hVObject: SGPVObject;
  let uiVideoObjectIndex: UINT32;
  let i: INT16;
  let minIndex: INT16;
  let maxIndex: INT16;
  let sWidth: INT16;
  let sOffset: INT16;
  let sStart: INT16;
  let x: INT16;
  let y: INT16;
  let usNumItems: UINT16;
  let usQuantity: UINT16 = 0;
  let usQuantity__Pointer = createPointer(() => usQuantity, (v) => usQuantity = v);

  if (!eInfo.fActive) {
    return;
  }
  if (gusMouseXPos < 110 || gusMouseXPos > 480 || gusMouseYPos < 360 || gusMouseYPos > 440) {
    // Mouse has moved out of the items display region -- so nothing can be highlighted.
    eInfo.sHilitedItemIndex = -1;
  }
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  pSrcBuf = LockVideoSurface(eInfo.uiBuffer, addressof(uiSrcPitchBYTES));

  // copy the items buffer to the editor bar
  Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, 110, 360, 60 * eInfo.sScrollIndex, 0, 360, 80);

  UnLockVideoSurface(eInfo.uiBuffer);
  UnLockVideoSurface(FRAME_BUFFER);

  // calculate the min and max index that is currently shown.  This determines
  // if the highlighted and/or selected items are drawn with the outlines.
  minIndex = eInfo.sScrollIndex * 2;
  maxIndex = minIndex + 11;

  // draw the hilighted item if applicable.
  if (eInfo.sHilitedItemIndex >= minIndex && eInfo.sHilitedItemIndex <= maxIndex) {
    if (eInfo.pusItemIndex) {
      item = Item[eInfo.pusItemIndex[eInfo.sHilitedItemIndex]];
      uiVideoObjectIndex = GetInterfaceGraphicForItem(item);
      hVObject = GetVideoObject(uiVideoObjectIndex);
      x = (eInfo.sHilitedItemIndex / 2 - eInfo.sScrollIndex) * 60 + 110;
      y = 360 + (eInfo.sHilitedItemIndex % 2) * 40;
      sWidth = hVObject.pETRLEObject[item.ubGraphicNum].usWidth;
      sOffset = hVObject.pETRLEObject[item.ubGraphicNum].sOffsetX;
      sStart = x + (60 - sWidth - sOffset * 2) / 2;
      if (sWidth) {
        BltVideoObjectOutlineFromIndex(FRAME_BUFFER, uiVideoObjectIndex, item.ubGraphicNum, sStart, y + 2, Get16BPPColor(FROMRGB(250, 250, 0)), true);
      }
    }
  }
  // draw the selected item
  if (eInfo.sSelItemIndex >= minIndex && eInfo.sSelItemIndex <= maxIndex) {
    if (eInfo.pusItemIndex) {
      item = Item[eInfo.pusItemIndex[eInfo.sSelItemIndex]];
      uiVideoObjectIndex = GetInterfaceGraphicForItem(item);
      hVObject = GetVideoObject(uiVideoObjectIndex);
      x = (eInfo.sSelItemIndex / 2 - eInfo.sScrollIndex) * 60 + 110;
      y = 360 + (eInfo.sSelItemIndex % 2) * 40;
      sWidth = hVObject.pETRLEObject[item.ubGraphicNum].usWidth;
      sOffset = hVObject.pETRLEObject[item.ubGraphicNum].sOffsetX;
      sStart = x + (60 - sWidth - sOffset * 2) / 2;
      if (sWidth) {
        BltVideoObjectOutlineFromIndex(FRAME_BUFFER, uiVideoObjectIndex, item.ubGraphicNum, sStart, y + 2, Get16BPPColor(FROMRGB(250, 0, 0)), true);
      }
    }
  }
  // draw the numbers of each visible item that currently resides in the world.
  maxIndex = Math.min(maxIndex, eInfo.sNumItems - 1);
  for (i = minIndex; i <= maxIndex; i++) {
    usNumItems = CountNumberOfEditorPlacementsInWorld(i, usQuantity__Pointer);
    if (usNumItems) {
      x = (i / 2 - eInfo.sScrollIndex) * 60 + 110;
      y = 360 + (i % 2) * 40;
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_YELLOW);
      SetFontShadow(FONT_NEARBLACK);
      if (usNumItems == usQuantity)
        mprintf(x + 12, y + 4, "%d", usNumItems);
      else
        mprintf(x + 12, y + 4, "%d(%d)", usNumItems, usQuantity);
    }
  }
}

export function ClearEditorItemsInfo(): void {
  if (eInfo.uiBuffer) {
    DeleteVideoSurfaceFromIndex(eInfo.uiBuffer);
    eInfo.uiBuffer = 0;
  }
  if (eInfo.pusItemIndex) {
    eInfo.pusItemIndex = <UINT16[]><unknown>null;
  }
  DisableEditorRegion(Enum45.ITEM_REGION_ID);
  eInfo.fKill = false;
  eInfo.fActive = false;
  eInfo.sWidth = 0;
  eInfo.sHeight = 0;
  eInfo.sNumItems = 0;
  // save the highlighted selections
  switch (eInfo.uiItemType) {
    case Enum35.TBAR_MODE_ITEM_WEAPONS:
      eInfo.sSaveSelWeaponsIndex = eInfo.sSelItemIndex;
      eInfo.sSaveWeaponsScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_AMMO:
      eInfo.sSaveSelAmmoIndex = eInfo.sSelItemIndex;
      eInfo.sSaveAmmoScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_ARMOUR:
      eInfo.sSaveSelArmourIndex = eInfo.sSelItemIndex;
      eInfo.sSaveArmourScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_EXPLOSIVES:
      eInfo.sSaveSelExplosivesIndex = eInfo.sSelItemIndex;
      eInfo.sSaveExplosivesScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_EQUIPMENT1:
      eInfo.sSaveSelEquipment1Index = eInfo.sSelItemIndex;
      eInfo.sSaveEquipment1ScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_EQUIPMENT2:
      eInfo.sSaveSelEquipment2Index = eInfo.sSelItemIndex;
      eInfo.sSaveEquipment2ScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_EQUIPMENT3:
      eInfo.sSaveSelEquipment3Index = eInfo.sSelItemIndex;
      eInfo.sSaveEquipment3ScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_TRIGGERS:
      eInfo.sSaveSelTriggersIndex = eInfo.sSelItemIndex;
      eInfo.sSaveTriggersScrollIndex = eInfo.sScrollIndex;
      break;
    case Enum35.TBAR_MODE_ITEM_KEYS:
      eInfo.sSaveSelKeysIndex = eInfo.sSelItemIndex;
      eInfo.sSaveKeysScrollIndex = eInfo.sScrollIndex;
      break;
  }
}

export function HandleItemsPanel(usScreenX: UINT16, usScreenY: UINT16, bEvent: INT8): void {
  let sIndex: INT16;
  let usQuantity: UINT16 = 0;
  // Calc base index from scrolling index
  sIndex = eInfo.sScrollIndex * 2;
  // Determine if the index is in the first row or second row from mouse YPos.
  if (usScreenY >= 400)
    sIndex++;
  // Add the converted mouse's XPos into a relative index;
  // Calc:  starting from 110, for every 60 pixels, add 2 to the index
  sIndex += ((usScreenX - 110) / 60) * 2;
  switch (bEvent) {
    case Enum44.GUI_MOVE_EVENT:
      if (sIndex < eInfo.sNumItems) {
        if (eInfo.sHilitedItemIndex != sIndex)
          gfRenderTaskbar = true;
        // this index will now highlight in yellow.
        eInfo.sHilitedItemIndex = sIndex;
      }
      break;
    case Enum44.GUI_LCLICK_EVENT:
      if (sIndex < eInfo.sNumItems) {
        // this index will now highlight in red.
        if (eInfo.sSelItemIndex != sIndex)
          gfRenderTaskbar = true;
        eInfo.sSelItemIndex = sIndex;
        if (gfMercGetItem) {
          gfMercGetItem = false;
          gusMercsNewItemIndex = eInfo.pusItemIndex[eInfo.sSelItemIndex];
          SetMercEditingMode(Enum42.MERC_INVENTORYMODE);
          ClearEditorItemsInfo();
        }
      }
      break;
    case Enum44.GUI_RCLICK_EVENT:
      if (gfMercGetItem) {
        gfMercGetItem = false;
        gusMercsNewItemIndex = 0xffff;
        SetMercEditingMode(Enum42.MERC_INVENTORYMODE);
        ClearEditorItemsInfo();
      } else if (sIndex < eInfo.sNumItems) {
        eInfo.sSelItemIndex = sIndex;
        gfRenderTaskbar = true;
        if (CountNumberOfEditorPlacementsInWorld(eInfo.sSelItemIndex, createPointer(() => usQuantity, (v) => usQuantity = v))) {
          FindNextItemOfSelectedType();
        }
      }
      break;
  }
}

function ShowItemCursor(iMapIndex: INT32): void {
  let pNode: LEVELNODE | null;
  pNode = gpWorldLevelData[iMapIndex].pTopmostHead;
  while (pNode) {
    if (pNode.usIndex == Enum313.SELRING)
      return;
    pNode = pNode.pNext;
  }
  AddTopmostToTail(iMapIndex, Enum312.SELRING1);
}

function HideItemCursor(iMapIndex: INT32): void {
  RemoveTopmost(iMapIndex, Enum312.SELRING1);
}

function TriggerAtGridNo(sGridNo: INT16): boolean {
  let pItemPool: ITEM_POOL | null;
  if ((pItemPool = GetItemPool(sGridNo, 0)) === null) {
    return false;
  }
  while (pItemPool) {
    if (gWorldItems[pItemPool.iItemIndex].o.usItem == Enum225.SWITCH) {
      return true;
    }
    pItemPool = pItemPool.pNext;
  }
  return false;
}

export function AddSelectedItemToWorld(sGridNo: INT16): void {
  let tempObject: OBJECTTYPE = createObjectType();
  let pObject: OBJECTTYPE;
  let pItem: INVTYPE;
  let pItemPool: ITEM_POOL | null;
  let iItemIndex: INT32 = 0;
  let bVisibility: INT8 = INVISIBLE;
  let fFound: boolean = false;
  let pIPCurr: IPListNode | null;
  let pIPPrev: IPListNode | null;
  let usFlags: UINT16;

  // Extract the currently selected item.
  SpecifyItemToEdit(null, -1);

  // memset( &tempObject, 0, sizeof( OBJECTTYPE ) );
  if (eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_KEYS) {
    CreateKeyObject(tempObject, 1, eInfo.sSelItemIndex);
  } else {
    CreateItem(eInfo.pusItemIndex[eInfo.sSelItemIndex], 100, tempObject);
  }
  usFlags = 0;
  switch (tempObject.usItem) {
    case Enum225.MINE:
      if (bVisibility == BURIED) {
        usFlags |= WORLD_ITEM_ARMED_BOMB;
      }
      break;
    case Enum225.MONEY:
    case Enum225.SILVER:
    case Enum225.GOLD:
      tempObject.bStatus[0] = 100;
      tempObject.uiMoneyAmount = 100 + Random(19901);
      break;
    case Enum225.OWNERSHIP:
      tempObject.ubOwnerProfile = NO_PROFILE;
      bVisibility = BURIED;
      break;
    case Enum225.SWITCH:
      if (TriggerAtGridNo(sGridNo)) {
        // Restricted to one action per gridno.
        return;
      }
      bVisibility = BURIED;
      tempObject.bStatus[0] = 100;
      tempObject.ubBombOwner = 1;
      if (eInfo.sSelItemIndex < 2)
        tempObject.bFrequency = PANIC_FREQUENCY;
      else if (eInfo.sSelItemIndex < 4)
        tempObject.bFrequency = PANIC_FREQUENCY_2;
      else if (eInfo.sSelItemIndex < 6)
        tempObject.bFrequency = PANIC_FREQUENCY_3;
      else
        tempObject.bFrequency = (FIRST_MAP_PLACED_FREQUENCY + (eInfo.sSelItemIndex - 4) / 2);
      usFlags |= WORLD_ITEM_ARMED_BOMB;
      break;
    case Enum225.ACTION_ITEM:
      bVisibility = BURIED;
      tempObject.bStatus[0] = 100;
      tempObject.ubBombOwner = 1;
      tempObject.bTrap = gbDefaultBombTrapLevel;
      if (eInfo.sSelItemIndex < PRESSURE_ACTION_ID) {
        tempObject.bDetonatorType = Enum224.BOMB_REMOTE;
        if (eInfo.sSelItemIndex < 2)
          tempObject.bFrequency = PANIC_FREQUENCY;
        else if (eInfo.sSelItemIndex < 4)
          tempObject.bFrequency = PANIC_FREQUENCY_2;
        else if (eInfo.sSelItemIndex < 6)
          tempObject.bFrequency = PANIC_FREQUENCY_3;
        else
          tempObject.bFrequency = (FIRST_MAP_PLACED_FREQUENCY + (eInfo.sSelItemIndex - 4) / 2);
      } else {
        tempObject.bDetonatorType = Enum224.BOMB_PRESSURE;
        tempObject.bDelay = 0;
      }
      ChangeActionItem(tempObject, gbActionItemIndex);
      tempObject.fFlags |= OBJECT_ARMED_BOMB;
      if (gbActionItemIndex == Enum49.ACTIONITEM_SMPIT)
        Add3X3Pit(sGridNo);
      else if (gbActionItemIndex == Enum49.ACTIONITEM_LGPIT)
        Add5X5Pit(sGridNo);
      usFlags |= WORLD_ITEM_ARMED_BOMB;
      break;
  }

  pObject = <OBJECTTYPE>InternalAddItemToPool(createPointer(() => sGridNo, (v) => sGridNo = v), tempObject, bVisibility, 0, usFlags, 0, createPointer(() => iItemIndex, (v) => iItemIndex = v));
  if (tempObject.usItem != Enum225.OWNERSHIP) {
    gWorldItems[iItemIndex].ubNonExistChance = (100 - giDefaultExistChance);
  } else {
    gWorldItems[iItemIndex].ubNonExistChance = 0;
  }

  pItem = Item[pObject.usItem];
  if (pItem.usItemClass == IC_AMMO) {
    if (Random(2)) {
      pObject.ubShotsLeft[0] = Magazine[pItem.ubClassIndex].ubMagSize;
    } else {
      pObject.ubShotsLeft[0] = Random(Magazine[pItem.ubClassIndex].ubMagSize);
    }
  } else {
    pObject.bStatus[0] = (70 + Random(26));
  }
  if (pItem.usItemClass & IC_GUN) {
    if (pObject.usItem == Enum225.ROCKET_LAUNCHER) {
      pObject.ubGunShotsLeft = 1;
    } else {
      pObject.ubGunShotsLeft = (Random(Weapon[pObject.usItem].ubMagSize));
    }
  }

  if ((pItemPool = GetItemPool(sGridNo, 0)) === null)
    Assert(false);
  while (pItemPool) {
    if ((gWorldItems[pItemPool.iItemIndex].o == pObject)) {
      fFound = true;
      // ShowSelectedItem();
      break;
    }
    pItemPool = pItemPool.pNext;
  }
  Assert(fFound);

  gpItemPool = pItemPool;

  SpecifyItemToEdit(pObject, sGridNo);

  // Get access to the itempool.
  // search for a current node in list containing same mapindex
  pIPCurr = pIPHead;
  pIPPrev = null;
  while (pIPCurr) {
    pIPPrev = pIPCurr;
    if (pIPCurr.sGridNo == sGridNo) {
      // found one, so we don't need to add it
      gpCurrItemPoolNode = pIPCurr;
      return;
    }
    pIPCurr = pIPCurr.next;
  }
  // there isn't one, so we will add it now.
  ShowItemCursor(sGridNo);
  if (pIPPrev) {
    pIPPrev.next = createIPListNode();
    Assert(pIPPrev.next);
    pIPPrev = pIPPrev.next;
    pIPPrev.next = null;
    pIPPrev.sGridNo = sGridNo;
    gpCurrItemPoolNode = pIPPrev;
  } else {
    pIPHead = createIPListNode();
    Assert(pIPHead);
    pIPHead.next = null;
    pIPHead.sGridNo = sGridNo;
    gpCurrItemPoolNode = pIPHead;
  }
}

export function HandleRightClickOnItem(sGridNo: INT16): void {
  let pItemPool: ITEM_POOL | null;
  let pIPCurr: IPListNode | null;

  if (gsItemGridNo == sGridNo) {
    // Clicked on the same gridno as the selected item.  Automatically select the next
    // item in the same pool.
    pItemPool = (<ITEM_POOL>gpItemPool).pNext;
    if (!pItemPool) {
      // currently selected item was last node, so select the head node even if it is the same.
      pItemPool = GetItemPool(sGridNo, 0);
    }
  } else if ((pItemPool = GetItemPool(sGridNo, 0)) === null) {
    // possibly relocate selected item to this gridno?
    return;
  }

  gpItemPool = <ITEM_POOL>pItemPool;

  // set up the item pool pointer to point to the same mapindex node
  pIPCurr = pIPHead;
  gpCurrItemPoolNode = null;
  while (pIPCurr) {
    if (pIPCurr.sGridNo == sGridNo) {
      gpCurrItemPoolNode = pIPCurr;
      break;
    }
    pIPCurr = pIPCurr.next;
  }
  Assert(gpCurrItemPoolNode);
  SpecifyItemToEdit(gWorldItems[gpItemPool.iItemIndex].o, gpItemPool.sGridNo);
}

export function DeleteSelectedItem(): void {
  SpecifyItemToEdit(null, -1);
  // First, check to see if there even is a currently selected item.
  if (iCurrentTaskbar == Enum36.TASK_MERCS) {
    DeleteSelectedMercsItem();
    return;
  }
  if (gpItemPool) {
    // Okay, we have a selected item...
    let sGridNo: INT16;
    // save the mapindex
    if (gpItemPool.pNext) {
      SpecifyItemToEdit(gWorldItems[gpItemPool.pNext.iItemIndex].o, gpItemPool.sGridNo);
    }
    sGridNo = gpItemPool.sGridNo;
    // remove the item
    if (gWorldItems[gpItemPool.iItemIndex].o.usItem == Enum225.ACTION_ITEM) {
      if (gWorldItems[gpItemPool.iItemIndex].o.bActionValue == Enum191.ACTION_ITEM_SMALL_PIT)
        Remove3X3Pit(gWorldItems[gpItemPool.iItemIndex].sGridNo);
      else if (gWorldItems[gpItemPool.iItemIndex].o.bActionValue == Enum191.ACTION_ITEM_LARGE_PIT)
        Remove5X5Pit(gWorldItems[gpItemPool.iItemIndex].sGridNo);
    }
    if (gpEditingItemPool == gpItemPool)
      gpEditingItemPool = <ITEM_POOL><unknown>null;
    RemoveItemFromPool(sGridNo, gpItemPool.iItemIndex, 0);
    gpItemPool = null;
    // determine if there are still any items at this location
    if ((gpItemPool = GetItemPool(sGridNo, 0)) === null) {
      // no items left, so remove the node from the list.
      let pIPPrev: IPListNode | null;
      let pIPCurr: IPListNode | null;
      pIPCurr = pIPHead;
      pIPPrev = null;
      while (pIPCurr) {
        if (pIPCurr.sGridNo == sGridNo) {
          if (pIPPrev) // middle of list
            pIPPrev.next = pIPCurr.next;
          else // head of list
            pIPHead = (<IPListNode>pIPHead).next;
          // move the curr item pool to the next one.
          if (pIPCurr.next)
            gpCurrItemPoolNode = pIPCurr.next;
          else
            gpCurrItemPoolNode = pIPHead;
          if (gpCurrItemPoolNode) {
            gpItemPool = GetItemPool(gpCurrItemPoolNode.sGridNo, 0);
            Assert(gpItemPool);
          }
          // remove node
          HideItemCursor(sGridNo);
          MemFree(pIPCurr);
          pIPCurr = null;
          return;
        }
        pIPPrev = pIPCurr;
        pIPCurr = pIPCurr.next;
      }
    }
  }
}

export function ShowSelectedItem(): void {
  if (gpItemPool) {
    gpItemPool.bVisible = INVISIBLE;
    gWorldItems[gpItemPool.iItemIndex].bVisible = INVISIBLE;
  }
}

export function HideSelectedItem(): void {
  if (gpItemPool) {
    gpItemPool.bVisible = HIDDEN_ITEM;
    gWorldItems[gpItemPool.iItemIndex].bVisible = HIDDEN_ITEM;
  }
}

export function SelectNextItemPool(): void {
  if (!gpCurrItemPoolNode)
    return;
  // remove the current hilight.
  if (gpItemPool) {
    MarkMapIndexDirty(gpItemPool.sGridNo);
  }

  // go to the next node.  If at end of list, choose pIPHead
  if (gpCurrItemPoolNode.next)
    gpCurrItemPoolNode = gpCurrItemPoolNode.next;
  else
    gpCurrItemPoolNode = <IPListNode>pIPHead;
  // get the item pool at this node's gridno.
  gpItemPool = <ITEM_POOL>GetItemPool(gpCurrItemPoolNode.sGridNo, 0);
  MarkMapIndexDirty(gpItemPool.sGridNo);
  SpecifyItemToEdit(gWorldItems[gpItemPool.iItemIndex].o, gpItemPool.sGridNo);
  if (gsItemGridNo != -1) {
    CenterScreenAtMapIndex(gsItemGridNo);
  }
}

export function SelectNextItemInPool(): void {
  if (gpItemPool) {
    if (gpItemPool.pNext) {
      gpItemPool = gpItemPool.pNext;
    } else {
      gpItemPool = <ITEM_POOL>GetItemPool(gpItemPool.sGridNo, 0);
    }
    SpecifyItemToEdit(gWorldItems[gpItemPool.iItemIndex].o, gpItemPool.sGridNo);
    MarkWorldDirty();
  }
}

export function SelectPrevItemInPool(): void {
  if (gpItemPool) {
    if (gpItemPool.pPrev) {
      gpItemPool = gpItemPool.pPrev;
    } else {
      gpItemPool = <ITEM_POOL>GetItemPool(gpItemPool.sGridNo, 0);
      while (gpItemPool.pNext) {
        gpItemPool = gpItemPool.pNext;
      }
    }
    SpecifyItemToEdit(gWorldItems[gpItemPool.iItemIndex].o, gpItemPool.sGridNo);
    MarkWorldDirty();
  }
}

function FindNextItemOfSelectedType(): void {
  let usItem: UINT16;
  usItem = eInfo.pusItemIndex[eInfo.sSelItemIndex];
  if (usItem == Enum225.ACTION_ITEM || usItem == Enum225.SWITCH) {
    if (eInfo.sSelItemIndex < PRESSURE_ACTION_ID) {
      let bFrequency: INT8;
      if (eInfo.sSelItemIndex < 2)
        bFrequency = PANIC_FREQUENCY;
      else if (eInfo.sSelItemIndex < 4)
        bFrequency = PANIC_FREQUENCY_2;
      else if (eInfo.sSelItemIndex < 6)
        bFrequency = PANIC_FREQUENCY_3;
      else
        bFrequency = (FIRST_MAP_PLACED_FREQUENCY + (eInfo.sSelItemIndex - 4) / 2);
      SelectNextTriggerWithFrequency(usItem, bFrequency);
    } else {
      SelectNextPressureAction();
    }
  } else if (Item[usItem].usItemClass == IC_KEY) {
    SelectNextKeyOfType(eInfo.sSelItemIndex);
  } else {
    SelectNextItemOfType(usItem);
  }
}

function SelectNextItemOfType(usItem: UINT16): void {
  let curr: IPListNode | null;
  let pObject: OBJECTTYPE;
  if (gpItemPool) {
    curr = pIPHead;
    while (curr) {
      // skip quickly to the same gridno as the item pool
      if (curr.sGridNo == gWorldItems[gpItemPool.iItemIndex].sGridNo) {
        gpItemPool = gpItemPool.pNext;
        while (gpItemPool) {
          pObject = gWorldItems[gpItemPool.iItemIndex].o;
          if (pObject.usItem == usItem) {
            SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
            CenterScreenAtMapIndex(gsItemGridNo);
            return; // success! (another item in same itempool)
          }
          gpItemPool = gpItemPool.pNext;
        }
        curr = curr.next;
        break;
      }
      curr = curr.next;
    }
    while (curr) {
      // search to the end of the list
      gpItemPool = GetItemPool(curr.sGridNo, 0);
      while (gpItemPool) {
        pObject = gWorldItems[gpItemPool.iItemIndex].o;
        if (pObject.usItem == usItem) {
          SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
          CenterScreenAtMapIndex(gsItemGridNo);
          return; // success! (found another item before reaching the end of the list)
        }
        gpItemPool = gpItemPool.pNext;
      }
      curr = curr.next;
    }
  }
  curr = pIPHead;
  while (curr) {
    // search to the end of the list
    gpItemPool = GetItemPool(curr.sGridNo, 0);
    while (gpItemPool) {
      pObject = gWorldItems[gpItemPool.iItemIndex].o;
      if (pObject.usItem == usItem) {
        SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
        CenterScreenAtMapIndex(gsItemGridNo);
        return; // success! (found first item in the list)
      }
      gpItemPool = gpItemPool.pNext;
    }
    curr = curr.next;
  }
}

function SelectNextKeyOfType(ubKeyID: UINT8): void {
  let curr: IPListNode | null;
  let pObject: OBJECTTYPE;
  if (gpItemPool) {
    curr = pIPHead;
    while (curr) {
      // skip quickly to the same gridno as the item pool
      if (curr.sGridNo == gWorldItems[gpItemPool.iItemIndex].sGridNo) {
        gpItemPool = gpItemPool.pNext;
        while (gpItemPool) {
          pObject = gWorldItems[gpItemPool.iItemIndex].o;
          if (Item[pObject.usItem].usItemClass == IC_KEY && pObject.ubKeyID == ubKeyID) {
            SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
            CenterScreenAtMapIndex(gsItemGridNo);
            return; // success! (another item in same itempool)
          }
          gpItemPool = gpItemPool.pNext;
        }
        curr = curr.next;
        break;
      }
      curr = curr.next;
    }
    while (curr) {
      // search to the end of the list
      gpItemPool = GetItemPool(curr.sGridNo, 0);
      while (gpItemPool) {
        pObject = gWorldItems[gpItemPool.iItemIndex].o;
        if (Item[pObject.usItem].usItemClass == IC_KEY && pObject.ubKeyID == ubKeyID) {
          SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
          CenterScreenAtMapIndex(gsItemGridNo);
          return; // success! (found another item before reaching the end of the list)
        }
        gpItemPool = gpItemPool.pNext;
      }
      curr = curr.next;
    }
  }
  curr = pIPHead;
  while (curr) {
    // search to the end of the list
    gpItemPool = GetItemPool(curr.sGridNo, 0);
    while (gpItemPool) {
      pObject = gWorldItems[gpItemPool.iItemIndex].o;
      if (Item[pObject.usItem].usItemClass == IC_KEY && pObject.ubKeyID == ubKeyID) {
        SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
        CenterScreenAtMapIndex(gsItemGridNo);
        return; // success! (found first item in the list)
      }
      gpItemPool = gpItemPool.pNext;
    }
    curr = curr.next;
  }
}

function SelectNextTriggerWithFrequency(usItem: UINT16, bFrequency: INT8): void {
  let curr: IPListNode | null;
  let pObject: OBJECTTYPE;
  if (gpItemPool) {
    curr = pIPHead;
    while (curr) {
      // skip quickly to the same gridno as the item pool
      if (curr.sGridNo == gWorldItems[gpItemPool.iItemIndex].sGridNo) {
        gpItemPool = gpItemPool.pNext;
        while (gpItemPool) {
          pObject = gWorldItems[gpItemPool.iItemIndex].o;
          if (pObject.usItem == usItem && pObject.bFrequency == bFrequency) {
            SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
            CenterScreenAtMapIndex(gsItemGridNo);
            return; // success! (another item in same itempool)
          }
          gpItemPool = gpItemPool.pNext;
        }
        curr = curr.next;
        break;
      }
      curr = curr.next;
    }
    while (curr) {
      // search to the end of the list
      gpItemPool = GetItemPool(curr.sGridNo, 0);
      while (gpItemPool) {
        pObject = gWorldItems[gpItemPool.iItemIndex].o;
        if (pObject.usItem == usItem && pObject.bFrequency == bFrequency) {
          SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
          CenterScreenAtMapIndex(gsItemGridNo);
          return; // success! (found another item before reaching the end of the list)
        }
        gpItemPool = gpItemPool.pNext;
      }
      curr = curr.next;
    }
  }
  curr = pIPHead;
  while (curr) {
    // search to the end of the list
    gpItemPool = GetItemPool(curr.sGridNo, 0);
    while (gpItemPool) {
      pObject = gWorldItems[gpItemPool.iItemIndex].o;
      if (pObject.usItem == usItem && pObject.bFrequency == bFrequency) {
        SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
        CenterScreenAtMapIndex(gsItemGridNo);
        return; // success! (found first item in the list)
      }
      gpItemPool = gpItemPool.pNext;
    }
    curr = curr.next;
  }
}

function SelectNextPressureAction(): void {
  let curr: IPListNode | null;
  let pObject: OBJECTTYPE;
  if (gpItemPool) {
    curr = pIPHead;
    while (curr) {
      // skip quickly to the same gridno as the item pool
      if (curr.sGridNo == gWorldItems[gpItemPool.iItemIndex].sGridNo) {
        gpItemPool = gpItemPool.pNext;
        while (gpItemPool) {
          pObject = gWorldItems[gpItemPool.iItemIndex].o;
          if (pObject.usItem == Enum225.ACTION_ITEM && pObject.bDetonatorType == Enum224.BOMB_PRESSURE) {
            SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
            CenterScreenAtMapIndex(gsItemGridNo);
            return; // success! (another item in same itempool)
          }
          gpItemPool = gpItemPool.pNext;
        }
        curr = curr.next;
        break;
      }
      curr = curr.next;
    }
    while (curr) {
      // search to the end of the list
      gpItemPool = GetItemPool(curr.sGridNo, 0);
      while (gpItemPool) {
        pObject = gWorldItems[gpItemPool.iItemIndex].o;
        if (pObject.usItem == Enum225.ACTION_ITEM && pObject.bDetonatorType == Enum224.BOMB_PRESSURE) {
          SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
          CenterScreenAtMapIndex(gsItemGridNo);
          return; // success! (found another item before reaching the end of the list)
        }
        gpItemPool = gpItemPool.pNext;
      }
      curr = curr.next;
    }
  }
  curr = pIPHead;
  while (curr) {
    // search to the end of the list
    gpItemPool = GetItemPool(curr.sGridNo, 0);
    while (gpItemPool) {
      pObject = gWorldItems[gpItemPool.iItemIndex].o;
      if (pObject.usItem == Enum225.ACTION_ITEM && pObject.bDetonatorType == Enum224.BOMB_PRESSURE) {
        SpecifyItemToEdit(pObject, gWorldItems[gpItemPool.iItemIndex].sGridNo);
        CenterScreenAtMapIndex(gsItemGridNo);
        return; // success! (found first item in the list)
      }
      gpItemPool = gpItemPool.pNext;
    }
    curr = curr.next;
  }
}

function CountNumberOfItemPlacementsInWorld(usItem: UINT16, pusQuantity: Pointer<UINT16>): UINT16 {
  let pItemPool: ITEM_POOL | null;
  let pIPCurr: IPListNode | null;
  let num: INT16 = 0;
  pusQuantity.value = 0;
  pIPCurr = pIPHead;
  while (pIPCurr) {
    pItemPool = GetItemPool(pIPCurr.sGridNo, 0);
    while (pItemPool) {
      if (gWorldItems[pItemPool.iItemIndex].o.usItem == usItem) {
        num++;
        pusQuantity.value += gWorldItems[pItemPool.iItemIndex].o.ubNumberOfObjects;
      }
      pItemPool = pItemPool.pNext;
    }
    pIPCurr = pIPCurr.next;
  }
  return num;
}

function CountNumberOfItemsWithFrequency(usItem: UINT16, bFrequency: INT8): UINT16 {
  let pItemPool: ITEM_POOL | null;
  let pIPCurr: IPListNode | null;
  let num: UINT16 = 0;
  pIPCurr = pIPHead;
  while (pIPCurr) {
    pItemPool = GetItemPool(pIPCurr.sGridNo, 0);
    while (pItemPool) {
      if (gWorldItems[pItemPool.iItemIndex].o.usItem == usItem && gWorldItems[pItemPool.iItemIndex].o.bFrequency == bFrequency) {
        num++;
      }
      pItemPool = pItemPool.pNext;
    }
    pIPCurr = pIPCurr.next;
  }
  return num;
}

function CountNumberOfPressureActionsInWorld(): UINT16 {
  let pItemPool: ITEM_POOL | null;
  let pIPCurr: IPListNode | null;
  let num: UINT16 = 0;
  pIPCurr = pIPHead;
  while (pIPCurr) {
    pItemPool = GetItemPool(pIPCurr.sGridNo, 0);
    while (pItemPool) {
      if (gWorldItems[pItemPool.iItemIndex].o.usItem == Enum225.ACTION_ITEM && gWorldItems[pItemPool.iItemIndex].o.bDetonatorType == Enum224.BOMB_PRESSURE) {
        num++;
      }
      pItemPool = pItemPool.pNext;
    }
    pIPCurr = pIPCurr.next;
  }
  return num;
}

function CountNumberOfEditorPlacementsInWorld(usEInfoIndex: UINT16, pusQuantity: Pointer<UINT16>): UINT16 {
  let usNumPlacements: UINT16;
  if (eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_TRIGGERS) {
    // find identical items with same frequency
    let bFrequency: INT8;
    if (usEInfoIndex < PRESSURE_ACTION_ID) {
      if (usEInfoIndex < 2)
        bFrequency = PANIC_FREQUENCY;
      else if (usEInfoIndex < 4)
        bFrequency = PANIC_FREQUENCY_2;
      else if (usEInfoIndex < 6)
        bFrequency = PANIC_FREQUENCY_3;
      else
        bFrequency = (FIRST_MAP_PLACED_FREQUENCY + (usEInfoIndex - 4) / 2);
      usNumPlacements = CountNumberOfItemsWithFrequency(eInfo.pusItemIndex[usEInfoIndex], bFrequency);
      pusQuantity.value = usNumPlacements;
    } else {
      usNumPlacements = CountNumberOfPressureActionsInWorld();
      pusQuantity.value = usNumPlacements;
    }
  } else if (eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_KEYS) {
    usNumPlacements = CountNumberOfKeysOfTypeInWorld(usEInfoIndex);
    pusQuantity.value = usNumPlacements;
  } else {
    usNumPlacements = CountNumberOfItemPlacementsInWorld(eInfo.pusItemIndex[usEInfoIndex], pusQuantity);
  }
  return usNumPlacements;
}

function CountNumberOfKeysOfTypeInWorld(ubKeyID: UINT8): UINT16 {
  let pItemPool: ITEM_POOL | null;
  let pIPCurr: IPListNode | null;
  let num: INT16 = 0;
  pIPCurr = pIPHead;
  while (pIPCurr) {
    pItemPool = GetItemPool(pIPCurr.sGridNo, 0);
    while (pItemPool) {
      if (Item[gWorldItems[pItemPool.iItemIndex].o.usItem].usItemClass == IC_KEY) {
        if (gWorldItems[pItemPool.iItemIndex].o.ubKeyID == ubKeyID) {
          num++;
        }
      }
      pItemPool = pItemPool.pNext;
    }
    pIPCurr = pIPCurr.next;
  }
  return num;
}

export function DisplayItemStatistics(): void {
  let fUseSelectedItem: boolean;
  let usItemIndex: INT16;
  let pItemName: string /* UINT16[SIZE_ITEM_NAME] */;
  let pItem: INVTYPE;

  if (!eInfo.fActive) {
    return;
  }

  // If there is nothing else currently highlited by the mouse, use the selected item.
  fUseSelectedItem = eInfo.sHilitedItemIndex == -1 || eInfo.sHilitedItemIndex == eInfo.sSelItemIndex;

  SetFont(SMALLCOMPFONT());
  SetFontForeground((fUseSelectedItem ? FONT_LTRED : FONT_YELLOW));

  // Extract all of the item information.
  if (!eInfo.pusItemIndex)
    return;
  usItemIndex = eInfo.pusItemIndex[fUseSelectedItem ? eInfo.sSelItemIndex : eInfo.sHilitedItemIndex];
  pItem = Item[usItemIndex];
  ({ name: pItemName } = LoadItemInfo(usItemIndex));

  mprintf(50 - StringPixLength(pItemName, SMALLCOMPFONT()) / 2, 403, pItemName);
  mprintf(2, 410, "Status Info Line 1");
  mprintf(2, 420, "Status Info Line 2");
  mprintf(2, 430, "Status Info Line 3");
  mprintf(2, 440, "Status Info Line 4");
  mprintf(2, 450, "Status Info Line 5");
}

}
