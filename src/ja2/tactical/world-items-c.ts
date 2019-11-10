namespace ja2 {

// Global dynamic array of all of the items in a loaded map.
export let gWorldItems: Pointer<WORLDITEM> = null;
export let guiNumWorldItems: UINT32 = 0;

export let gWorldBombs: Pointer<WORLDBOMB> = null;
export let guiNumWorldBombs: UINT32 = 0;

function GetFreeWorldBombIndex(): INT32 {
  let uiCount: UINT32;
  let newWorldBombs: Pointer<WORLDBOMB>;
  let uiOldNumWorldBombs: UINT32;

  for (uiCount = 0; uiCount < guiNumWorldBombs; uiCount++) {
    if (gWorldBombs[uiCount].fExists == false)
      return uiCount;
  }

  uiOldNumWorldBombs = guiNumWorldBombs;
  guiNumWorldBombs += 10;
  // Allocate new table with max+10 items.
  newWorldBombs = MemRealloc(gWorldBombs, sizeof(WORLDBOMB) * guiNumWorldBombs);
  if (newWorldBombs == null) {
    return -1;
  }

  // Clear the rest of the new array
  memset(addressof(newWorldBombs[uiOldNumWorldBombs]), 0, sizeof(WORLDBOMB) * (guiNumWorldBombs - uiOldNumWorldBombs));
  gWorldBombs = newWorldBombs;

  // Return uiCount.....
  return uiCount;
}

function GetNumUsedWorldBombs(): UINT32 {
  let uiCount: UINT32;
  let uiNumItems: UINT32;
  uiNumItems = 0;

  if (guiNumWorldBombs == 0) {
    return 0;
  }

  for (uiCount = 0; uiCount < guiNumWorldBombs; uiCount++) {
    if (gWorldBombs[uiCount].fExists) {
      uiNumItems++;
    }
  }

  return uiNumItems;
}

function AddBombToWorld(iItemIndex: INT32): INT32 {
  let iBombIndex: UINT32;

  iBombIndex = GetFreeWorldBombIndex();

  // Add the new world item to the table.
  gWorldBombs[iBombIndex].fExists = true;
  gWorldBombs[iBombIndex].iItemIndex = iItemIndex;

  return iBombIndex;
}

function RemoveBombFromWorld(iBombIndex: INT32): void {
  // Remove the world bomb from the table.
  gWorldBombs[iBombIndex].fExists = false;
}

function RemoveBombFromWorldByItemIndex(iItemIndex: INT32): void {
  // Find the world bomb which corresponds with a particular world item, then
  // remove the world bomb from the table.
  let uiBombIndex: UINT32;

  for (uiBombIndex = 0; uiBombIndex < guiNumWorldBombs; uiBombIndex++) {
    if (gWorldBombs[uiBombIndex].fExists && gWorldBombs[uiBombIndex].iItemIndex == iItemIndex) {
      RemoveBombFromWorld(uiBombIndex);
      return;
    }
  }
}

export function FindWorldItemForBombInGridNo(sGridNo: INT16, bLevel: INT8): INT32 {
  let uiBombIndex: UINT32;

  for (uiBombIndex = 0; uiBombIndex < guiNumWorldBombs; uiBombIndex++) {
    if (gWorldBombs[uiBombIndex].fExists && gWorldItems[gWorldBombs[uiBombIndex].iItemIndex].sGridNo == sGridNo && gWorldItems[gWorldBombs[uiBombIndex].iItemIndex].ubLevel == bLevel) {
      return gWorldBombs[uiBombIndex].iItemIndex;
    }
  }
  return -1;
}

export function FindPanicBombsAndTriggers(): void {
  // This function searches the bomb table to find panic-trigger-tuned bombs and triggers

  let uiBombIndex: UINT32;
  let pObj: Pointer<OBJECTTYPE>;
  let pSwitch: Pointer<STRUCTURE>;
  let sGridNo: INT16 = NOWHERE;
  let fPanicTriggerIsAlarm: boolean = false;
  let bPanicIndex: INT8;

  for (uiBombIndex = 0; uiBombIndex < guiNumWorldBombs; uiBombIndex++) {
    if (gWorldBombs[uiBombIndex].fExists) {
      pObj = addressof(gWorldItems[gWorldBombs[uiBombIndex].iItemIndex].o);
      if (pObj.value.bFrequency == PANIC_FREQUENCY || pObj.value.bFrequency == PANIC_FREQUENCY_2 || pObj.value.bFrequency == PANIC_FREQUENCY_3) {
        if (pObj.value.usItem == Enum225.SWITCH) {
          sGridNo = gWorldItems[gWorldBombs[uiBombIndex].iItemIndex].sGridNo;
          switch (pObj.value.bFrequency) {
            case PANIC_FREQUENCY:
              bPanicIndex = 0;
              break;

            case PANIC_FREQUENCY_2:
              bPanicIndex = 1;
              break;

            case PANIC_FREQUENCY_3:
              bPanicIndex = 2;
              break;

            default:
              // augh!!!
              continue;
          }

          pSwitch = FindStructure(sGridNo, STRUCTURE_SWITCH);
          if (pSwitch) {
            switch (pSwitch.value.ubWallOrientation) {
              case Enum314.INSIDE_TOP_LEFT:
              case Enum314.OUTSIDE_TOP_LEFT:
                sGridNo += DirectionInc(Enum245.SOUTH);
                break;
              case Enum314.INSIDE_TOP_RIGHT:
              case Enum314.OUTSIDE_TOP_RIGHT:
                sGridNo += DirectionInc(Enum245.EAST);
                break;
              default:
                break;
            }
          }

          gTacticalStatus.sPanicTriggerGridNo[bPanicIndex] = sGridNo;
          gTacticalStatus.ubPanicTolerance[bPanicIndex] = pObj.value.ubTolerance;
          if (pObj.value.fFlags & OBJECT_ALARM_TRIGGER) {
            gTacticalStatus.bPanicTriggerIsAlarm[bPanicIndex] = true;
          }
          gTacticalStatus.fPanicFlags |= PANIC_TRIGGERS_HERE;
          bPanicIndex++;
          if (bPanicIndex == NUM_PANIC_TRIGGERS) {
            return;
          }
        } else {
          gTacticalStatus.fPanicFlags |= PANIC_BOMBS_HERE;
        }
      }
    }
  }
}

function GetFreeWorldItemIndex(): INT32 {
  let uiCount: UINT32;
  let newWorldItems: Pointer<WORLDITEM>;
  let uiOldNumWorldItems: UINT32;

  for (uiCount = 0; uiCount < guiNumWorldItems; uiCount++) {
    if (gWorldItems[uiCount].fExists == false)
      return uiCount;
  }

  uiOldNumWorldItems = guiNumWorldItems;
  guiNumWorldItems += 10;
  // Allocate new table with max+10 items.
  newWorldItems = MemRealloc(gWorldItems, sizeof(WORLDITEM) * guiNumWorldItems);
  if (newWorldItems == null) {
    return -1;
  }

  // Clear the rest of the new array
  memset(addressof(newWorldItems[uiOldNumWorldItems]), 0, sizeof(WORLDITEM) * (guiNumWorldItems - uiOldNumWorldItems));
  gWorldItems = newWorldItems;

  // Return uiCount.....
  return uiCount;
}

function GetNumUsedWorldItems(): UINT32 {
  let uiCount: UINT32;
  let uiNumItems: UINT32;
  uiNumItems = 0;

  if (guiNumWorldItems == 0) {
    return 0;
  }

  for (uiCount = 0; uiCount < guiNumWorldItems; uiCount++) {
    if (gWorldItems[uiCount].fExists) {
      uiNumItems++;
    }
  }

  return uiNumItems;
}

export function AddItemToWorld(sGridNo: INT16, pObject: Pointer<OBJECTTYPE>, ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8, bVisible: INT8): INT32 {
  let iItemIndex: UINT32;
  let iReturn: INT32;

  // ATE: Check if the gridno is OK
  if ((sGridNo) == NOWHERE) {
// Display warning.....
    return -1;
  }

  iItemIndex = GetFreeWorldItemIndex();

  // Add the new world item to the table.
  gWorldItems[iItemIndex].fExists = true;
  gWorldItems[iItemIndex].sGridNo = sGridNo;
  gWorldItems[iItemIndex].ubLevel = ubLevel;
  gWorldItems[iItemIndex].usFlags = usFlags;
  gWorldItems[iItemIndex].bVisible = bVisible;
  gWorldItems[iItemIndex].bRenderZHeightAboveLevel = bRenderZHeightAboveLevel;

  memcpy(addressof(gWorldItems[iItemIndex].o), pObject, sizeof(OBJECTTYPE));

  // Add a bomb reference if needed
  if (usFlags & WORLD_ITEM_ARMED_BOMB) {
    iReturn = AddBombToWorld(iItemIndex);
    if (iReturn == -1) {
      return -1;
    }
  }

  return iItemIndex;
}

export function RemoveItemFromWorld(iItemIndex: INT32): void {
  // Ensure the item still exists, then if it's a bomb,
  // remove the appropriate entry from the bomb table
  if (gWorldItems[iItemIndex].fExists) {
    if (gWorldItems[iItemIndex].usFlags & WORLD_ITEM_ARMED_BOMB) {
      RemoveBombFromWorldByItemIndex(iItemIndex);
    }
    gWorldItems[iItemIndex].fExists = false;
  }
}

export function TrashWorldItems(): void {
  let i: UINT32;
  if (gWorldItems) {
    for (i = 0; i < guiNumWorldItems; i++) {
      if (gWorldItems[i].fExists) {
        RemoveItemFromPool(gWorldItems[i].sGridNo, i, gWorldItems[i].ubLevel);
      }
    }
    MemFree(gWorldItems);
    gWorldItems = null;
    guiNumWorldItems = 0;
  }
  if (gWorldBombs) {
    MemFree(gWorldBombs);
    gWorldBombs = null;
    guiNumWorldBombs = 0;
  }
}

export function SaveWorldItemsToMap(fp: HWFILE): void {
  let i: UINT32;
  let uiBytesWritten: UINT32;
  let uiActualNumWorldItems: UINT32;

  uiActualNumWorldItems = GetNumUsedWorldItems();

  FileWrite(fp, addressof(uiActualNumWorldItems), 4, addressof(uiBytesWritten));

  for (i = 0; i < guiNumWorldItems; i++) {
    if (gWorldItems[i].fExists)
      FileWrite(fp, addressof(gWorldItems[i]), sizeof(WORLDITEM), addressof(uiBytesWritten));
  }
}

export function LoadWorldItemsFromMap(hBuffer: Pointer<Pointer<INT8>>): void {
  // Start loading itmes...

  let i: UINT32;
  let uiLevelItems: UINT32 = 0;
  let dummyItem: WORLDITEM = createWorldItem();
  let iItemIndex: INT32;
  let uiNumWorldItems: UINT32;

  // If any world items exist, we must delete them now.
  TrashWorldItems();

  // Read the number of items that were saved in the map.
  LOADDATA(addressof(uiNumWorldItems), hBuffer.value, 4);

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME && !gfEditMode) {
    // The sector has already been visited.  The items are saved in a different format that will be
    // loaded later on.  So, all we need to do is skip the data entirely.
    hBuffer.value += sizeof(WORLDITEM) * uiNumWorldItems;
    return;
  } else
    for (i = 0; i < uiNumWorldItems; i++) {
      // Add all of the items to the world indirectly through AddItemToPool, but only if the chance
      // associated with them succeed.
      LOADDATA(addressof(dummyItem), hBuffer.value, sizeof(WORLDITEM));
      if (dummyItem.o.usItem == Enum225.OWNERSHIP) {
        dummyItem.ubNonExistChance = 0;
      }
      if (gfEditMode || dummyItem.ubNonExistChance <= PreRandom(100)) {
        if (!gfEditMode) {
          // check for matching item existance modes and only add if there is a match!
          if (dummyItem.usFlags & WORLD_ITEM_SCIFI_ONLY && !gGameOptions.fSciFi || dummyItem.usFlags & WORLD_ITEM_REALISTIC_ONLY && gGameOptions.fSciFi) {
            // no match, so don't add item to world
            continue;
          }

          if (!gGameOptions.fGunNut) {
            let usReplacement: UINT16;

            // do replacements?
            if (Item[dummyItem.o.usItem].usItemClass == IC_GUN) {
              let bAmmo: INT8;
              let bNewAmmo: INT8;

              usReplacement = StandardGunListReplacement(dummyItem.o.usItem);
              if (usReplacement) {
                // everything else can be the same? no.
                bAmmo = dummyItem.o.ubGunShotsLeft;
                bNewAmmo = (Weapon[usReplacement].ubMagSize * bAmmo) / Weapon[dummyItem.o.usItem].ubMagSize;
                if (bAmmo > 0 && bNewAmmo == 0) {
                  bNewAmmo = 1;
                }

                dummyItem.o.usItem = usReplacement;
                dummyItem.o.ubGunShotsLeft = bNewAmmo;
              }
            }
            if (Item[dummyItem.o.usItem].usItemClass == IC_AMMO) {
              usReplacement = StandardGunListAmmoReplacement(dummyItem.o.usItem);
              if (usReplacement) {
                let ubLoop: UINT8;

                // go through status values and scale up/down
                for (ubLoop = 0; ubLoop < dummyItem.o.ubNumberOfObjects; ubLoop++) {
                  dummyItem.o.bStatus[ubLoop] = dummyItem.o.bStatus[ubLoop] * Magazine[Item[usReplacement].ubClassIndex].ubMagSize / Magazine[Item[dummyItem.o.usItem].ubClassIndex].ubMagSize;
                }

                // then replace item #
                dummyItem.o.usItem = usReplacement;
              }
            }
          }
        }
        if (dummyItem.o.usItem == Enum225.ACTION_ITEM && gfLoadPitsWithoutArming) {
          // if we are loading a pit, they are typically loaded without being armed.
          if (dummyItem.o.bActionValue == Enum191.ACTION_ITEM_SMALL_PIT || dummyItem.o.bActionValue == Enum191.ACTION_ITEM_LARGE_PIT) {
            dummyItem.usFlags &= ~WORLD_ITEM_ARMED_BOMB;
            dummyItem.bVisible = BURIED;
            dummyItem.o.bDetonatorType = 0;
          }
        }

        else if (dummyItem.bVisible == HIDDEN_ITEM && dummyItem.o.bTrap > 0 && (dummyItem.o.usItem == Enum225.MINE || dummyItem.o.usItem == Enum225.TRIP_FLARE || dummyItem.o.usItem == Enum225.TRIP_KLAXON)) {
          ArmBomb(addressof(dummyItem.o), Enum224.BOMB_PRESSURE);
          dummyItem.usFlags |= WORLD_ITEM_ARMED_BOMB;
          // this is coming from the map so the enemy must know about it.
          gpWorldLevelData[dummyItem.sGridNo].uiFlags |= MAPELEMENT_ENEMY_MINE_PRESENT;
        }

        if (dummyItem.usFlags & WORLD_ITEM_ARMED_BOMB) {
          // all armed bombs are buried
          dummyItem.bVisible = BURIED;
        }
        AddItemToPoolAndGetIndex(dummyItem.sGridNo, addressof(dummyItem.o), dummyItem.bVisible, dummyItem.ubLevel, dummyItem.usFlags, dummyItem.bRenderZHeightAboveLevel, addressof(iItemIndex));
        gWorldItems[iItemIndex].ubNonExistChance = dummyItem.ubNonExistChance;
      }
    }

  if (!gfEditMode) {
    DeleteWorldItemsBelongingToTerroristsWhoAreNotThere();
    if (gWorldSectorX == 3 && gWorldSectorY == MAP_ROW_P && gbWorldSectorZ == 1) {
      DeleteWorldItemsBelongingToQueenIfThere();
    }
  }
}

function DeleteWorldItemsBelongingToTerroristsWhoAreNotThere(): void {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let sGridNo: INT16;
  let ubLevel: UINT8;

  // only do this after Carmen has talked to player and terrorists have been placed
  // if ( CheckFact( FACT_CARMEN_EXPLAINED_DEAL, 0 ) == TRUE )
  {
    for (uiLoop = 0; uiLoop < guiNumWorldItems; uiLoop++) {
      // loop through all items, look for ownership
      if (gWorldItems[uiLoop].fExists && gWorldItems[uiLoop].o.usItem == Enum225.OWNERSHIP) {
        // if owner is a terrorist
        if (IsProfileATerrorist(gWorldItems[uiLoop].o.ubOwnerProfile)) {
          // and they were not set in the current sector
          if (gMercProfiles[gWorldItems[uiLoop].o.ubOwnerProfile].sSectorX != gWorldSectorX || gMercProfiles[gWorldItems[uiLoop].o.ubOwnerProfile].sSectorY != gWorldSectorY) {
            // then all items in this location should be deleted
            sGridNo = gWorldItems[uiLoop].sGridNo;
            ubLevel = gWorldItems[uiLoop].ubLevel;
            for (uiLoop2 = 0; uiLoop2 < guiNumWorldItems; uiLoop2++) {
              // loop through all items, look for ownership
              if (gWorldItems[uiLoop2].fExists && gWorldItems[uiLoop2].sGridNo == sGridNo && gWorldItems[uiLoop2].ubLevel == ubLevel) {
                RemoveItemFromPool(sGridNo, uiLoop2, ubLevel);
              }
            }
          }
        }
      }
    }
  }
  // else the terrorists haven't been placed yet!
}

function DeleteWorldItemsBelongingToQueenIfThere(): void {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let sGridNo: INT16;
  let ubLevel: UINT8;
  let bSlot: INT8;

  if (gMercProfiles[Enum268.QUEEN].sSectorX == gWorldSectorX && gMercProfiles[Enum268.QUEEN].sSectorY == gWorldSectorY && gMercProfiles[Enum268.QUEEN].bSectorZ == gbWorldSectorZ) {
    for (uiLoop = 0; uiLoop < guiNumWorldItems; uiLoop++) {
      // loop through all items, look for ownership
      if (gWorldItems[uiLoop].fExists && gWorldItems[uiLoop].o.usItem == Enum225.OWNERSHIP) {
        // if owner is the Queen
        if (gWorldItems[uiLoop].o.ubOwnerProfile == Enum268.QUEEN) {
          // then all items in this location should be deleted
          sGridNo = gWorldItems[uiLoop].sGridNo;
          ubLevel = gWorldItems[uiLoop].ubLevel;
          for (uiLoop2 = 0; uiLoop2 < guiNumWorldItems; uiLoop2++) {
            // loop through all items, look for those in same tile
            if (gWorldItems[uiLoop2].fExists && gWorldItems[uiLoop2].sGridNo == sGridNo && gWorldItems[uiLoop2].ubLevel == ubLevel) {
              // upgrade equipment
              switch (gWorldItems[uiLoop2].o.usItem) {
                case Enum225.AUTO_ROCKET_RIFLE:
                  bSlot = FindObjectInSoldierProfile(Enum268.QUEEN, Enum225.ROCKET_RIFLE);
                  if (bSlot != NO_SLOT) {
                    // give her auto rifle
                    gMercProfiles[Enum268.QUEEN].inv[bSlot] = Enum225.AUTO_ROCKET_RIFLE;
                  }
                  break;
                case Enum225.SPECTRA_HELMET_18:
                  gMercProfiles[Enum268.QUEEN].inv[Enum261.HELMETPOS] = Enum225.SPECTRA_HELMET_18;
                  break;
                case Enum225.SPECTRA_VEST_18:
                  gMercProfiles[Enum268.QUEEN].inv[Enum261.VESTPOS] = Enum225.SPECTRA_VEST_18;
                  break;
                case Enum225.SPECTRA_LEGGINGS_18:
                  gMercProfiles[Enum268.QUEEN].inv[Enum261.LEGPOS] = Enum225.SPECTRA_LEGGINGS_18;
                  break;
                default:
                  break;
              }
              RemoveItemFromPool(sGridNo, uiLoop2, ubLevel);
            }
          }
        }
      }
    }
  }
}

// Refresh item pools
export function RefreshWorldItemsIntoItemPools(pItemList: Pointer<WORLDITEM>, iNumberOfItems: INT32): void {
  let i: INT32;
  let dummyItem: WORLDITEM = createWorldItem();

  for (i = 0; i < iNumberOfItems; i++) {
    if (pItemList[i].fExists) {
      memcpy(addressof(dummyItem), addressof(pItemList[i]), sizeof(WORLDITEM));

      AddItemToPool(dummyItem.sGridNo, addressof(dummyItem.o), dummyItem.bVisible, dummyItem.ubLevel, dummyItem.usFlags, dummyItem.bRenderZHeightAboveLevel);
    }
  }
}

}
