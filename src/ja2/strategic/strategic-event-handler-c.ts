const MEDUNA_ITEM_DROP_OFF_GRIDNO = 10959;
const MEDUNA_ITEM_DROP_OFF_SECTOR_X = 3;
const MEDUNA_ITEM_DROP_OFF_SECTOR_Y = 14;
const MEDUNA_ITEM_DROP_OFF_SECTOR_Z = 0;

let guiPabloExtraDaysBribed: UINT32 = 0;

let gubCambriaMedicalObjects: UINT8;

function BobbyRayPurchaseEventCallback(ubOrderID: UINT8): void {
  let i: UINT8;
  let j: UINT8;
  let usItem: UINT16;
  let Object: OBJECTTYPE;
  let usMapPos: UINT16;
  let usStandardMapPos: UINT16;
  let usNumberOfItems: UINT16;
  let fSectorLoaded: boolean = false;
  let usTotalNumberOfItemTypes: UINT16;
  let uiCount: UINT32 = 0;
  let uiStolenCount: UINT32 = 0;
  /* static */ let ubShipmentsSinceNoBribes: UINT8 = 0;
  let uiChanceOfTheft: UINT32;
  let fPablosStoleSomething: boolean = false;
  let fPablosStoleLastItem: boolean = false;
  let pObject: Pointer<OBJECTTYPE> = null;
  let pStolenObject: Pointer<OBJECTTYPE> = null;
  let fThisShipmentIsFromJohnKulba: boolean = false; // if it is, dont add an email
  let ubItemsDelivered: UINT8;
  let ubTempNumItems: UINT8;
  let ubItemsPurchased: UINT8;

  usStandardMapPos = BOBBYR_SHIPPING_DEST_GRIDNO;

  // if the delivery is for meduna, drop the items off there instead
  if (gpNewBobbyrShipments[ubOrderID].fActive && gpNewBobbyrShipments[ubOrderID].ubDeliveryLoc == Enum70.BR_MEDUNA) {
    DropOffItemsInMeduna(ubOrderID);
    return;
  }

  if (CheckFact(Enum170.FACT_NEXT_PACKAGE_CAN_BE_LOST, 0)) {
    SetFactFalse(Enum170.FACT_NEXT_PACKAGE_CAN_BE_LOST);
    if (Random(100) < 50) {
      // lose the whole shipment!
      gpNewBobbyrShipments[ubOrderID].fActive = false;
      SetFactTrue(Enum170.FACT_LAST_SHIPMENT_CRASHED);
      return;
    }
  } else if (CheckFact(Enum170.FACT_NEXT_PACKAGE_CAN_BE_DELAYED, 0)) {
    // shipment went to wrong airport... reroute all items to a temporary
    // gridno to represent the other airport (and damage them)
    SetFactTrue(Enum170.FACT_LAST_SHIPMENT_WENT_TO_WRONG_AIRPORT);
    usStandardMapPos = LOST_SHIPMENT_GRIDNO;
    SetFactFalse(Enum170.FACT_NEXT_PACKAGE_CAN_BE_DELAYED);
  } else if ((gTownLoyalty[Enum135.DRASSEN].ubRating < 20) || StrategicMap[CALCULATE_STRATEGIC_INDEX(13, MAP_ROW_B)].fEnemyControlled) {
    // loss of the whole shipment
    gpNewBobbyrShipments[ubOrderID].fActive = false;

    SetFactTrue(Enum170.FACT_AGENTS_PREVENTED_SHIPMENT);
    return;
  }

  // Get the number of item types
  usTotalNumberOfItemTypes = gpNewBobbyrShipments[ubOrderID].ubNumberPurchases;

  // Must get the total number of items ( all item types plus how many of each item type ordered )
  usNumberOfItems = 0;
  for (i = 0; i < gpNewBobbyrShipments[ubOrderID].ubNumberPurchases; i++) {
    // Count how many items were purchased
    usNumberOfItems += gpNewBobbyrShipments[ubOrderID].BobbyRayPurchase[i].ubNumberPurchased;

    // if any items are AutoMags
    if (gpNewBobbyrShipments[ubOrderID].BobbyRayPurchase[i].usItemIndex == Enum225.AUTOMAG_III) {
      // This shipment is from John Kulba, dont add an email from bobby ray
      fThisShipmentIsFromJohnKulba = true;
    }
  }

  // determine if the sector is loaded
  if ((gWorldSectorX == BOBBYR_SHIPPING_DEST_SECTOR_X) && (gWorldSectorY == BOBBYR_SHIPPING_DEST_SECTOR_Y) && (gbWorldSectorZ == BOBBYR_SHIPPING_DEST_SECTOR_Z))
    fSectorLoaded = true;
  else
    fSectorLoaded = false;

  // set crate to closed!
  if (fSectorLoaded) {
    SetOpenableStructureToClosed(BOBBYR_SHIPPING_DEST_GRIDNO, 0);
  } else {
    ChangeStatusOfOpenableStructInUnloadedSector(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, BOBBYR_SHIPPING_DEST_GRIDNO, false);
  }

  // if we are NOT currently in the right sector
  if (!fSectorLoaded) {
    // build an array of objects to be added
    pObject = MemAlloc(sizeof(OBJECTTYPE) * usNumberOfItems);
    pStolenObject = MemAlloc(sizeof(OBJECTTYPE) * usNumberOfItems);
    if (pObject == null || pStolenObject == null)
      return;
    memset(pObject, 0, sizeof(OBJECTTYPE) * usNumberOfItems);
    memset(pStolenObject, 0, sizeof(OBJECTTYPE) * usNumberOfItems);
  }

  // check for potential theft
  if (CheckFact(Enum170.FACT_PABLO_WONT_STEAL, 0)) {
    uiChanceOfTheft = 0;
  } else if (CheckFact(Enum170.FACT_PABLOS_BRIBED, 0)) {
    // Since Pacos has some money, reduce record of # of shipments since last bribed...
    ubShipmentsSinceNoBribes /= 2;
    uiChanceOfTheft = 0;
  } else {
    ubShipmentsSinceNoBribes++;
    // this chance might seem high but it's only applied at most to every second item
    uiChanceOfTheft = 12 + Random(4 * ubShipmentsSinceNoBribes);
  }

  uiCount = 0;
  for (i = 0; i < gpNewBobbyrShipments[ubOrderID].ubNumberPurchases; i++) {
    // Get the item
    usItem = gpNewBobbyrShipments[ubOrderID].BobbyRayPurchase[i].usItemIndex;

    // Create the item
    CreateItem(usItem, gpNewBobbyrShipments[ubOrderID].BobbyRayPurchase[i].bItemQuality, addressof(Object));

    // if it's a gun
    if (Item[usItem].usItemClass == IC_GUN) {
      // Empty out the bullets put in by CreateItem().  We now sell all guns empty of bullets.  This is done for BobbyR
      // simply to be consistent with the dealers in Arulco, who must sell guns empty to prevent ammo cheats by players.
      Object.ubGunShotsLeft = 0;
    }

    ubItemsDelivered = 0;

    // add all the items that were purchased
    ubItemsPurchased = gpNewBobbyrShipments[ubOrderID].BobbyRayPurchase[i].ubNumberPurchased;
    for (j = 0; j < ubItemsPurchased; j++) {
      // Pablos might steal stuff but only:
      // - if it's one of a group of items
      // - if he didn't steal the previous item in the group (so he never steals > 50%)
      // - if he has been bribed, he only sneaks out stuff which is cheap
      if (fSectorLoaded) {
        // add ubItemsPurchased to the chance of theft so the chance increases when there are more items of a kind being ordered
        if (!fPablosStoleLastItem && uiChanceOfTheft > 0 && Random(100) < (uiChanceOfTheft + ubItemsPurchased)) {
          uiStolenCount++;
          usMapPos = PABLOS_STOLEN_DEST_GRIDNO; // off screen!
          fPablosStoleSomething = true;
          fPablosStoleLastItem = true;
        } else {
          usMapPos = usStandardMapPos;
          fPablosStoleLastItem = false;

          if (usStandardMapPos == LOST_SHIPMENT_GRIDNO) {
            // damage the item a random amount!
            Object.bStatus[0] = (((70 + Random(11)) * Object.bStatus[0]) / 100);
            // make damn sure it can't hit 0
            if (Object.bStatus[0] == 0) {
              Object.bStatus[0] = 1;
            }
            AddItemToPool(usMapPos, addressof(Object), -1, 0, 0, 0);
          } else {
            // record # delivered for later addition...
            ubItemsDelivered++;
          }
        }
      } else {
        if (j > 1 && !fPablosStoleLastItem && uiChanceOfTheft > 0 && Random(100) < (uiChanceOfTheft + j)) {
          memcpy(addressof(pStolenObject[uiStolenCount]), addressof(Object), sizeof(OBJECTTYPE));
          uiStolenCount++;
          fPablosStoleSomething = true;
          fPablosStoleLastItem = true;
        } else {
          fPablosStoleLastItem = false;

          // else we are not currently in the sector, so we build an array of items to add in one lump
          // add the item to the item array

          if (usStandardMapPos == LOST_SHIPMENT_GRIDNO) {
            // damage the item a random amount!
            Object.bStatus[0] = (((70 + Random(11)) * Object.bStatus[0]) / 100);
            // make damn sure it can't hit 0
            if (Object.bStatus[0] == 0) {
              Object.bStatus[0] = 1;
            }
            memcpy(addressof(pObject[uiCount]), addressof(Object), sizeof(OBJECTTYPE));
            uiCount++;
          } else {
            ubItemsDelivered++;
          }
        }
      }
    }

    if (gpNewBobbyrShipments[ubOrderID].BobbyRayPurchase[i].ubNumberPurchased == 1 && ubItemsDelivered == 1) {
      // the item in Object will be the item to deliver
      if (fSectorLoaded) {
        AddItemToPool(usStandardMapPos, addressof(Object), -1, 0, 0, 0);
      } else {
        memcpy(addressof(pObject[uiCount]), addressof(Object), sizeof(OBJECTTYPE));
        uiCount++;
      }
    } else {
      while (ubItemsDelivered) {
        // treat 0s as 1s :-)
        ubTempNumItems = Math.min(ubItemsDelivered, Math.max(1, Item[usItem].ubPerPocket));
        CreateItems(usItem, gpNewBobbyrShipments[ubOrderID].BobbyRayPurchase[i].bItemQuality, ubTempNumItems, addressof(Object));

        // stack as many as possible
        if (fSectorLoaded) {
          AddItemToPool(usStandardMapPos, addressof(Object), -1, 0, 0, 0);
        } else {
          memcpy(addressof(pObject[uiCount]), addressof(Object), sizeof(OBJECTTYPE));
          uiCount++;
        }

        ubItemsDelivered -= ubTempNumItems;
      }
    }
  }

  // if we are NOT currently in the sector
  if (!fSectorLoaded) {
    // add all the items from the array that was built above
    usMapPos = PABLOS_STOLEN_DEST_GRIDNO;
    // The item are to be added to the Top part of Drassen, grid loc's  10112, 9950
    if (!AddItemsToUnLoadedSector(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, usStandardMapPos, uiCount, pObject, 0, 0, 0, -1, false)) {
      // Error adding the items
      // return;
    }
    if (uiStolenCount > 0) {
      if (!AddItemsToUnLoadedSector(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, PABLOS_STOLEN_DEST_GRIDNO, uiStolenCount, pStolenObject, 0, 0, 0, -1, false)) {
        // Error adding the items
        // return;
      }
    }
    MemFree(pObject);
    MemFree(pStolenObject);
    pObject = null;
    pStolenObject = null;
  }

  if (fPablosStoleSomething) {
    SetFactTrue(Enum170.FACT_PABLOS_STOLE_FROM_LATEST_SHIPMENT);
  } else {
    SetFactFalse(Enum170.FACT_PABLOS_STOLE_FROM_LATEST_SHIPMENT);
  }

  SetFactFalse(Enum170.FACT_LARGE_SIZED_OLD_SHIPMENT_WAITING);

  if (CheckFact(Enum170.FACT_NEXT_PACKAGE_CAN_BE_DELAYED, 0)) {
    SetFactFalse(Enum170.FACT_MEDIUM_SIZED_SHIPMENT_WAITING);
    SetFactFalse(Enum170.FACT_LARGE_SIZED_SHIPMENT_WAITING);
    SetFactFalse(Enum170.FACT_REALLY_NEW_BOBBYRAY_SHIPMENT_WAITING);
  } else {
    if (usNumberOfItems - uiStolenCount <= 5) {
      SetFactFalse(Enum170.FACT_MEDIUM_SIZED_SHIPMENT_WAITING);
      SetFactFalse(Enum170.FACT_LARGE_SIZED_SHIPMENT_WAITING);
    } else if (usNumberOfItems - uiStolenCount <= 15) {
      SetFactTrue(Enum170.FACT_MEDIUM_SIZED_SHIPMENT_WAITING);
      SetFactFalse(Enum170.FACT_LARGE_SIZED_SHIPMENT_WAITING);
    } else {
      SetFactFalse(Enum170.FACT_MEDIUM_SIZED_SHIPMENT_WAITING);
      SetFactTrue(Enum170.FACT_LARGE_SIZED_SHIPMENT_WAITING);
    }

    // this shipment isn't old yet...
    SetFactTrue(Enum170.FACT_REALLY_NEW_BOBBYRAY_SHIPMENT_WAITING);

    // set up even to make shipment "old"
    AddSameDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay() + 120, Enum170.FACT_REALLY_NEW_BOBBYRAY_SHIPMENT_WAITING);
  }

  // We have received the shipment so fActice becomes fALSE
  gpNewBobbyrShipments[ubOrderID].fActive = false;

  // Stop time compression the game
  StopTimeCompression();

  // if the shipment is NOT from John Kulba, send an email
  if (!fThisShipmentIsFromJohnKulba) {
    // Add an email from Bobby r telling the user the shipment 'Should' be there
    AddEmail(BOBBYR_SHIPMENT_ARRIVED, BOBBYR_SHIPMENT_ARRIVED_LENGTH, Enum75.BOBBY_R, GetWorldTotalMin());
  } else {
    // if the shipment is from John Kulba

    // Add an email from kulba telling the user the shipment is there
    AddEmail(JOHN_KULBA_GIFT_IN_DRASSEN, JOHN_KULBA_GIFT_IN_DRASSEN_LENGTH, Enum75.JOHN_KULBA, GetWorldTotalMin());
  }
}

function HandleDelayedItemsArrival(uiReason: UINT32): void {
  // This function moves all the items that Pablos has stolen
  // (or items that were delayed) to the arrival location for new shipments,
  let sStartGridNo: INT16;
  let uiNumWorldItems: UINT32;
  let uiLoop: UINT32;
  let fOk: boolean;
  let pTemp: Pointer<WORLDITEM>;
  let ubLoop: UINT8;
  let Object: OBJECTTYPE;

  if (uiReason == NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_RETURN_STOLEN_SHIPMENT_ITEMS) {
    if (gMercProfiles[Enum268.PABLO].bMercStatus == MERC_IS_DEAD) {
      // nothing arrives then!
      return;
    }
    // update some facts...
    SetFactTrue(Enum170.FACT_PABLO_RETURNED_GOODS);
    SetFactFalse(Enum170.FACT_PABLO_PUNISHED_BY_PLAYER);
    sStartGridNo = PABLOS_STOLEN_DEST_GRIDNO;

    // add random items

    for (ubLoop = 0; ubLoop < 2; ubLoop++) {
      switch (Random(10)) {
        case 0:
          // 1 in 10 chance of a badly damaged gas mask
          CreateItem(Enum225.GASMASK, (20 + Random(10)), addressof(Object));
          break;
        case 1:
        case 2:
          // 2 in 10 chance of a battered Desert Eagle
          CreateItem(Enum225.DESERTEAGLE, (40 + Random(10)), addressof(Object));
          break;
        case 3:
        case 4:
        case 5:
          // 3 in 10 chance of a stun grenade
          CreateItem(Enum225.STUN_GRENADE, (70 + Random(10)), addressof(Object));
          break;
        case 6:
        case 7:
        case 8:
        case 9:
          // 4 in 10 chance of two 38s!
          CreateItems(Enum225.SW38, (90 + Random(10)), 2, addressof(Object));
          break;
      }
      if ((gWorldSectorX == BOBBYR_SHIPPING_DEST_SECTOR_X) && (gWorldSectorY == BOBBYR_SHIPPING_DEST_SECTOR_Y) && (gbWorldSectorZ == BOBBYR_SHIPPING_DEST_SECTOR_Z)) {
        AddItemToPool(BOBBYR_SHIPPING_DEST_GRIDNO, addressof(Object), -1, 0, 0, 0);
      } else {
        AddItemsToUnLoadedSector(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, BOBBYR_SHIPPING_DEST_GRIDNO, 1, addressof(Object), 0, 0, 0, -1, false);
      }
    }
  } else if (uiReason == Enum170.FACT_PACKAGE_DAMAGED) {
    sStartGridNo = LOST_SHIPMENT_GRIDNO;
  } else {
    return;
  }

  // If the Drassen airport sector is already loaded, move the item pools...
  if ((gWorldSectorX == BOBBYR_SHIPPING_DEST_SECTOR_X) && (gWorldSectorY == BOBBYR_SHIPPING_DEST_SECTOR_Y) && (gbWorldSectorZ == BOBBYR_SHIPPING_DEST_SECTOR_Z)) {
    // sector is loaded!
    // just move the hidden item pool
    MoveItemPools(sStartGridNo, BOBBYR_SHIPPING_DEST_GRIDNO);
  } else {
    // otherwise load the saved items from the item file and change the records of their locations
    fOk = GetNumberOfWorldItemsFromTempItemFile(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, addressof(uiNumWorldItems), false);
    if (!fOk) {
      return;
    }
    pTemp = MemAlloc(sizeof(WORLDITEM) * uiNumWorldItems);
    if (!pTemp) {
      return;
    }
    fOk = LoadWorldItemsFromTempItemFile(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, pTemp);
    if (fOk) {
      for (uiLoop = 0; uiLoop < uiNumWorldItems; uiLoop++) {
        if (pTemp[uiLoop].sGridNo == PABLOS_STOLEN_DEST_GRIDNO) {
          pTemp[uiLoop].sGridNo = BOBBYR_SHIPPING_DEST_GRIDNO;
        }
      }
      AddWorldItemsToUnLoadedSector(BOBBYR_SHIPPING_DEST_SECTOR_X, BOBBYR_SHIPPING_DEST_SECTOR_Y, BOBBYR_SHIPPING_DEST_SECTOR_Z, 0, uiNumWorldItems, pTemp, true);
    }
  }
}

function AddSecondAirportAttendant(): void {
  // add the second airport attendant to the Drassen airport...
  gMercProfiles[99].sSectorX = BOBBYR_SHIPPING_DEST_SECTOR_X;
  gMercProfiles[99].sSectorY = BOBBYR_SHIPPING_DEST_SECTOR_Y;
  gMercProfiles[99].bSectorZ = BOBBYR_SHIPPING_DEST_SECTOR_Z;
}

function SetPabloToUnbribed(): void {
  if (guiPabloExtraDaysBribed > 0) {
    // set new event for later on, because the player gave Pablo more money!
    AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), Enum170.FACT_PABLOS_BRIBED, guiPabloExtraDaysBribed);
    guiPabloExtraDaysBribed = 0;
  } else {
    SetFactFalse(Enum170.FACT_PABLOS_BRIBED);
  }
}

function HandlePossiblyDamagedPackage(): void {
  if (Random(100) < 70) {
    SetFactTrue(Enum170.FACT_PACKAGE_DAMAGED);
    HandleDelayedItemsArrival(Enum170.FACT_PACKAGE_DAMAGED);
  } else {
    // shipment lost forever!
    SetFactTrue(Enum170.FACT_PACKAGE_LOST_PERMANENTLY);
  }
  // whatever happened, the shipment is no longer delayed
  SetFactFalse(Enum170.FACT_SHIPMENT_DELAYED_24_HOURS);
}

function CheckForKingpinsMoneyMissing(fFirstCheck: boolean): void {
  let uiLoop: UINT32;
  let uiTotalCash: UINT32 = 0;
  let fKingpinWillDiscover: boolean = false;
  let fKingpinDiscovers: boolean = false;

  // money in D5b1 must be less than 30k

  for (uiLoop = 0; uiLoop < guiNumWorldItems; uiLoop++) {
    // loop through all items, look for ownership
    if (gWorldItems[uiLoop].fExists && gWorldItems[uiLoop].o.usItem == Enum225.MONEY) {
      uiTotalCash += gWorldItems[uiLoop].o.uiMoneyAmount;
    }
  }

  // This function should be called every time sector D5/B1 is unloaded!
  if (fFirstCheck) {
    if (CheckFact(Enum170.FACT_KINGPIN_WILL_LEARN_OF_MONEY_GONE, 0) == true) {
      // unnecessary
      return;
    }

    if (uiTotalCash < 30000) {
      // add history log here
      AddHistoryToPlayersLog(Enum83.HISTORY_FOUND_MONEY, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);

      SetFactTrue(Enum170.FACT_KINGPIN_WILL_LEARN_OF_MONEY_GONE);
    }
  }

  if (CheckFact(Enum170.FACT_KINGPIN_DEAD, 0) == true) {
    return;
  }

  if (uiTotalCash < 30000) {
    if (fFirstCheck) {
      // add event to make Kingpin aware, two days from now
      fKingpinWillDiscover = true;
    } else {
      fKingpinDiscovers = true;
    }
  }

  if (fKingpinWillDiscover) {
    // set event for next day to check for real
    AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, Random(120), Enum170.FACT_KINGPIN_KNOWS_MONEY_GONE, 1);

    // the sector is unloaded NOW so set Kingpin's balance and remove the cash
    gMercProfiles[Enum268.KINGPIN].iBalance = -(30000 - uiTotalCash);
    // remove all money from map
    for (uiLoop = 0; uiLoop < guiNumWorldItems; uiLoop++) {
      // loop through all items, look for ownership
      if (gWorldItems[uiLoop].fExists && gWorldItems[uiLoop].o.usItem == Enum225.MONEY) {
        // remove!
        gWorldItems[uiLoop].fExists = false;
      }
    }
  } else if (fKingpinDiscovers) {
    // ok start things up here!
    SetFactTrue(Enum170.FACT_KINGPIN_KNOWS_MONEY_GONE);

    // set event 2 days from now that if the player has not given Kingpin his money back,
    // he sends email to the player
    AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, Random(120), Enum170.FACT_KINGPIN_KNOWS_MONEY_GONE, 2);
  }
}

function HandleNPCSystemEvent(uiEvent: UINT32): void {
  if (uiEvent < NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS) {
    switch (uiEvent) {
      case Enum170.FACT_PABLOS_BRIBED:
        // set Pacos to unbribed
        SetPabloToUnbribed();
        break;

      case Enum170.FACT_REALLY_NEW_BOBBYRAY_SHIPMENT_WAITING:
        // the shipment is no longer really new
        SetFactFalse(Enum170.FACT_REALLY_NEW_BOBBYRAY_SHIPMENT_WAITING);
        if (CheckFact(Enum170.FACT_LARGE_SIZED_SHIPMENT_WAITING, 0)) {
          // set "really heavy old shipment" fact
          SetFactTrue(Enum170.FACT_LARGE_SIZED_OLD_SHIPMENT_WAITING);
        }
        break;

      case Enum170.FACT_SHIPMENT_DELAYED_24_HOURS:
      case Enum170.FACT_24_HOURS_SINCE_DOCTOR_TALKED_TO:
      case Enum170.FACT_24_HOURS_SINCE_JOEY_RESCUED:
        SetFactTrue(uiEvent);
        break;

      case Enum170.FACT_KINGPIN_KNOWS_MONEY_GONE:
        // more generally events for kingpin quest
        if (CheckFact(Enum170.FACT_KINGPIN_KNOWS_MONEY_GONE, 0) == false) {
          // check for real whether to start quest
          CheckForKingpinsMoneyMissing(false);
        } else if (CheckFact(Enum170.FACT_KINGPIN_DEAD, 0) == false) {
          if (gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTNOTSTARTED) {
            // KP knows money is gone, hasn't told player, if this event is called then the 2
            // days are up... send email
            AddEmail(KING_PIN_LETTER, KING_PIN_LETTER_LENGTH, Enum75.KING_PIN, GetWorldTotalMin());
            StartQuest(Enum169.QUEST_KINGPIN_MONEY, 5, MAP_ROW_D);
            // add event to send terrorists two days from now
            AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, Random(120), Enum170.FACT_KINGPIN_KNOWS_MONEY_GONE, 2);
          } else if (gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTINPROGRESS) {
            // knows money gone, quest is still in progress
            // event indicates Kingpin can start to send terrorists
            SetFactTrue(Enum170.FACT_KINGPIN_CAN_SEND_ASSASSINS);
            gMercProfiles[Enum268.SPIKE].sSectorX = 5;
            gMercProfiles[Enum268.SPIKE].sSectorY = MAP_ROW_C;
            gTacticalStatus.fCivGroupHostile[Enum246.KINGPIN_CIV_GROUP] = CIV_GROUP_WILL_BECOME_HOSTILE;
          }
        }
        break;
    }
  } else {
    switch (uiEvent - NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS) {
      case Enum213.NPC_ACTION_RETURN_STOLEN_SHIPMENT_ITEMS:
        HandleDelayedItemsArrival(uiEvent);
        break;
      case Enum213.NPC_ACTION_SET_RANDOM_PACKAGE_DAMAGE_TIMER:
        HandlePossiblyDamagedPackage();
        break;
      case Enum213.NPC_ACTION_ENABLE_CAMBRIA_DOCTOR_BONUS:
        SetFactTrue(Enum170.FACT_WILLIS_HEARD_ABOUT_JOEY_RESCUE);
        break;
      case Enum213.NPC_ACTION_TRIGGER_END_OF_FOOD_QUEST:
        if (gMercProfiles[Enum268.FATHER].bMercStatus != MERC_IS_DEAD) {
          EndQuest(Enum169.QUEST_FOOD_ROUTE, 10, MAP_ROW_A);
          SetFactTrue(Enum170.FACT_FOOD_QUEST_OVER);
        }
        break;
      case Enum213.NPC_ACTION_DELAYED_MAKE_BRENDA_LEAVE:
        // IC:
        // TriggerNPCRecord( 85, 9 );
        SetFactTrue(Enum170.FACT_BRENDA_PATIENCE_TIMER_EXPIRED);
        break;
      case Enum213.NPC_ACTION_SET_DELAY_TILL_GIRLS_AVAILABLE:
        HandleNPCDoAction(107, Enum213.NPC_ACTION_SET_GIRLS_AVAILABLE, 0);
        break;

      case Enum213.NPC_ACTION_READY_ROBOT: {
        if (CheckFact(Enum170.FACT_FIRST_ROBOT_DESTROYED, 0)) {
          // second robot ready
          SetFactTrue(Enum170.FACT_ROBOT_READY_SECOND_TIME);
          // resurrect robot
          gMercProfiles[Enum268.ROBOT].bLife = gMercProfiles[Enum268.ROBOT].bLifeMax;
          gMercProfiles[Enum268.ROBOT].bMercStatus = MERC_OK;
        } else {
          // first robot ready
          SetFactTrue(Enum170.FACT_ROBOT_READY);
        }

        gMercProfiles[Enum268.ROBOT].sSectorX = gMercProfiles[Enum268.MADLAB].sSectorX;
        gMercProfiles[Enum268.ROBOT].sSectorY = gMercProfiles[Enum268.MADLAB].sSectorY;
        gMercProfiles[Enum268.ROBOT].bSectorZ = gMercProfiles[Enum268.MADLAB].bSectorZ;
      } break;

      case Enum213.NPC_ACTION_ADD_JOEY_TO_WORLD:
        // If Joey is not dead, escorted, or already delivered
        if (gMercProfiles[Enum268.JOEY].bMercStatus != MERC_IS_DEAD && !CheckFact(Enum170.FACT_JOEY_ESCORTED, 0) && gMercProfiles[Enum268.JOEY].sSectorX == 4 && gMercProfiles[Enum268.JOEY].sSectorY == MAP_ROW_D && gMercProfiles[Enum268.JOEY].bSectorZ == 1) {
          let pJoey: Pointer<SOLDIERTYPE>;

          pJoey = FindSoldierByProfileID(Enum268.JOEY, false);
          if (pJoey) {
            // he's in the currently loaded sector...delay this an hour!
            AddSameDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay() + 60, NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_ADD_JOEY_TO_WORLD);
          } else {
            // move Joey from caves to San Mona
            gMercProfiles[Enum268.JOEY].sSectorX = 5;
            gMercProfiles[Enum268.JOEY].sSectorY = MAP_ROW_C;
            gMercProfiles[Enum268.JOEY].bSectorZ = 0;
          }
        }
        break;

      case Enum213.NPC_ACTION_SEND_ENRICO_MIGUEL_EMAIL:
        AddEmail(ENRICO_MIGUEL, ENRICO_MIGUEL_LENGTH, Enum75.MAIL_ENRICO, GetWorldTotalMin());
        break;

      case Enum213.NPC_ACTION_TIMER_FOR_VEHICLE:
        SetFactTrue(Enum170.FACT_OK_USE_HUMMER);
        break;

      case Enum213.NPC_ACTION_FREE_KIDS:
        SetFactTrue(Enum170.FACT_KIDS_ARE_FREE);
        break;

      default:
        break;
    }
  }
}

function HandleEarlyMorningEvents(): void {
  let cnt: UINT32;
  let uiAmount: UINT32;

  // loop through all *NPCs* and reset "default response used recently" flags
  for (cnt = FIRST_RPC; cnt < NUM_PROFILES; cnt++) {
    gMercProfiles[cnt].bFriendlyOrDirectDefaultResponseUsedRecently = false;
    gMercProfiles[cnt].bRecruitDefaultResponseUsedRecently = false;
    gMercProfiles[cnt].bThreatenDefaultResponseUsedRecently = false;
    gMercProfiles[cnt].ubMiscFlags2 &= (~PROFILE_MISC_FLAG2_BANDAGED_TODAY);
  }
  // reset Father Walker's drunkenness level!
  gMercProfiles[Enum268.FATHER].bNPCData = Random(4);
  // set Walker's location
  if (Random(2)) {
    // move the father to the other sector, provided neither are loaded
    if (!((gWorldSectorX == 13) && ((gWorldSectorY == MAP_ROW_C) || gWorldSectorY == MAP_ROW_D) && (gbWorldSectorZ == 0))) {
      gMercProfiles[Enum268.FATHER].sSectorX = 13;
      // swap his location
      if (gMercProfiles[Enum268.FATHER].sSectorY == MAP_ROW_C) {
        gMercProfiles[Enum268.FATHER].sSectorY = MAP_ROW_D;
      } else {
        gMercProfiles[Enum268.FATHER].sSectorY = MAP_ROW_C;
      }
    }
  }

  if (gMercProfiles[Enum268.TONY].ubLastDateSpokenTo > 0 && !(gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0)) {
    // San Mona C5 is not loaded so make Tony possibly not available
    if (Random(4)) {
      // Tony IS available
      SetFactFalse(Enum170.FACT_TONY_NOT_AVAILABLE);
      gMercProfiles[Enum268.TONY].sSectorX = 5;
      gMercProfiles[Enum268.TONY].sSectorY = MAP_ROW_C;
    } else {
      // Tony is NOT available
      SetFactTrue(Enum170.FACT_TONY_NOT_AVAILABLE);
      gMercProfiles[Enum268.TONY].sSectorX = 0;
      gMercProfiles[Enum268.TONY].sSectorY = 0;
    }
  }

  if (gMercProfiles[Enum268.DEVIN].ubLastDateSpokenTo == 0) {
    // Does Devin move?
    gMercProfiles[Enum268.DEVIN].bNPCData++;
    if (gMercProfiles[Enum268.DEVIN].bNPCData > 3) {
      if (!((gWorldSectorX == gMercProfiles[Enum268.DEVIN].sSectorX) && (gWorldSectorY == gMercProfiles[Enum268.DEVIN].sSectorY) && (gbWorldSectorZ == 0))) {
        // ok, Devin's sector not loaded, so time to move!
        // might be same sector as before, if so, oh well!
        switch (Random(5)) {
          case 0:
            gMercProfiles[Enum268.DEVIN].sSectorX = 9;
            gMercProfiles[Enum268.DEVIN].sSectorY = MAP_ROW_G;
            break;
          case 1:
            gMercProfiles[Enum268.DEVIN].sSectorX = 13;
            gMercProfiles[Enum268.DEVIN].sSectorY = MAP_ROW_D;
            break;
          case 2:
            gMercProfiles[Enum268.DEVIN].sSectorX = 5;
            gMercProfiles[Enum268.DEVIN].sSectorY = MAP_ROW_C;
            break;
          case 3:
            gMercProfiles[Enum268.DEVIN].sSectorX = 2;
            gMercProfiles[Enum268.DEVIN].sSectorY = MAP_ROW_H;
            break;
          case 4:
            gMercProfiles[Enum268.DEVIN].sSectorX = 6;
            gMercProfiles[Enum268.DEVIN].sSectorY = MAP_ROW_C;
            break;
        }
      }
    }
  }

  // Does Hamous move?

  // stop moving the truck if Hamous is dead!!
  // stop moving them if the player has the truck or Hamous is hired!
  if (gMercProfiles[Enum268.HAMOUS].bLife > 0 && FindSoldierByProfileID(Enum268.HAMOUS, true) == null && FindSoldierByProfileID(Enum268.PROF_ICECREAM, true) == null && (!((gWorldSectorX == gMercProfiles[Enum268.HAMOUS].sSectorX) && (gWorldSectorY == gMercProfiles[Enum268.HAMOUS].sSectorY) && (gbWorldSectorZ == 0)))) {
    // ok, HAMOUS's sector not loaded, so time to move!
    // might be same sector as before, if so, oh well!
    switch (Random(5)) {
      case 0:
        gMercProfiles[Enum268.HAMOUS].sSectorX = 6;
        gMercProfiles[Enum268.HAMOUS].sSectorY = MAP_ROW_G;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorX = 6;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorY = MAP_ROW_G;
        break;
      case 1:
        gMercProfiles[Enum268.HAMOUS].sSectorX = 12;
        gMercProfiles[Enum268.HAMOUS].sSectorY = MAP_ROW_F;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorX = 12;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorY = MAP_ROW_F;
        break;
      case 2:
        gMercProfiles[Enum268.HAMOUS].sSectorX = 7;
        gMercProfiles[Enum268.HAMOUS].sSectorY = MAP_ROW_D;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorX = 7;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorY = MAP_ROW_D;
        break;
      case 3:
        gMercProfiles[Enum268.HAMOUS].sSectorX = 3;
        gMercProfiles[Enum268.HAMOUS].sSectorY = MAP_ROW_D;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorX = 3;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorY = MAP_ROW_D;
        break;
      case 4:
        gMercProfiles[Enum268.HAMOUS].sSectorX = 9;
        gMercProfiles[Enum268.HAMOUS].sSectorY = MAP_ROW_D;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorX = 9;
        gMercProfiles[Enum268.PROF_ICECREAM].sSectorY = MAP_ROW_D;
        break;
    }
  }

  // Does Rat take off?
  if (gMercProfiles[Enum268.RAT].bNPCData != 0) {
    gMercProfiles[Enum268.RAT].sSectorX = 0;
    gMercProfiles[Enum268.RAT].sSectorY = 0;
    gMercProfiles[Enum268.RAT].bSectorZ = 0;
  }

  // Empty money from pockets of Vince 69, Willis 80, and Jenny 132
  SetMoneyInSoldierProfile(Enum268.VINCE, 0);
  SetMoneyInSoldierProfile(Enum268.STEVE, 0); // Steven Willis
  SetMoneyInSoldierProfile(Enum268.JENNY, 0);

  // Vince is no longer expecting money
  SetFactFalse(Enum170.FACT_VINCE_EXPECTING_MONEY);

  // Reset Darren's balance and money
  gMercProfiles[Enum268.DARREN].iBalance = 0;
  SetMoneyInSoldierProfile(Enum268.DARREN, 15000);

  // set Carmen to be placed on the map in case he moved and is waiting off screen
  if (gMercProfiles[Enum268.CARMEN].ubMiscFlags2 & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR) {
    gMercProfiles[Enum268.CARMEN].ubMiscFlags2 &= ~(PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR);
    // move Carmen to C13
    gMercProfiles[Enum268.CARMEN].sSectorX = 13;
    gMercProfiles[Enum268.CARMEN].sSectorY = MAP_ROW_C;
    gMercProfiles[Enum268.CARMEN].bSectorZ = 0;

    // we should also reset # of terrorist heads and give him cash
    if (gMercProfiles[Enum268.CARMEN].bNPCData2 > 0) {
      if (gMercProfiles[Enum268.CARMEN].uiMoney < 10000) {
        uiAmount = 0;
      } else {
        uiAmount = gMercProfiles[Enum268.CARMEN].uiMoney;
      }
      uiAmount += 10000 * gMercProfiles[Enum268.CARMEN].bNPCData2;
      SetMoneyInSoldierProfile(Enum268.CARMEN, uiAmount);
      gMercProfiles[Enum268.CARMEN].bNPCData2 = 0;

      for (cnt = Enum225.HEAD_1; cnt <= Enum225.HEAD_7; cnt++) {
        RemoveObjectFromSoldierProfile(Enum268.CARMEN, cnt);
      }
    }
  } else {
    // randomize where he'll be today... so long as his sector's not loaded

    if (gMercProfiles[Enum268.CARMEN].sSectorX != gWorldSectorX || gMercProfiles[Enum268.CARMEN].sSectorY != gWorldSectorY) {
      switch (Random(3)) {
        case 0:
          gMercProfiles[Enum268.CARMEN].sSectorX = 5;
          gMercProfiles[Enum268.CARMEN].sSectorY = MAP_ROW_C;
          break;
        case 1:
          gMercProfiles[Enum268.CARMEN].sSectorX = 13;
          gMercProfiles[Enum268.CARMEN].sSectorY = MAP_ROW_C;
          break;
        case 2:
          gMercProfiles[Enum268.CARMEN].sSectorX = 9;
          gMercProfiles[Enum268.CARMEN].sSectorY = MAP_ROW_G;
          break;
      }
      // he should have $5000... unless the player forgot to meet him
      if (gMercProfiles[Enum268.CARMEN].uiMoney < 5000) {
        SetMoneyInSoldierProfile(Enum268.CARMEN, 5000);
      }
    }
  }

  if (PreRandom(3) == 0) {
    SetFactTrue(Enum170.FACT_DAVE_HAS_GAS);
  } else {
    SetFactFalse(Enum170.FACT_DAVE_HAS_GAS);
  }

  if (gWorldSectorX == HOSPITAL_SECTOR_X && gWorldSectorY == HOSPITAL_SECTOR_Y && gbWorldSectorZ == HOSPITAL_SECTOR_Z) {
    CheckForMissingHospitalSupplies();
  }
}

function MakeCivGroupHostileOnNextSectorEntrance(ubCivGroup: UINT8): void {
  // if it's the rebels that will become hostile, reduce town loyalties NOW, not later
  if (ubCivGroup == Enum246.REBEL_CIV_GROUP && gTacticalStatus.fCivGroupHostile[ubCivGroup] == CIV_GROUP_NEUTRAL) {
    ReduceLoyaltyForRebelsBetrayed();
  }

  gTacticalStatus.fCivGroupHostile[ubCivGroup] = CIV_GROUP_WILL_BECOME_HOSTILE;
}

function RemoveAssassin(ubProfile: UINT8): void {
  gMercProfiles[ubProfile].sSectorX = 0;
  gMercProfiles[ubProfile].sSectorY = 0;
  gMercProfiles[ubProfile].bLife = gMercProfiles[ubProfile].bLifeMax;
}

function CheckForMissingHospitalSupplies(): void {
  let uiLoop: UINT32;
  let pItemPool: Pointer<ITEM_POOL>;
  let pObj: Pointer<OBJECTTYPE>;
  let ubMedicalObjects: UINT8 = 0;

  for (uiLoop = 0; uiLoop < guiNumWorldItems; uiLoop++) {
    // loop through all items, look for ownership
    if (gWorldItems[uiLoop].fExists && gWorldItems[uiLoop].o.usItem == Enum225.OWNERSHIP && gWorldItems[uiLoop].o.ubOwnerCivGroup == Enum246.DOCTORS_CIV_GROUP) {
      GetItemPool(gWorldItems[uiLoop].sGridNo, addressof(pItemPool), 0);
      while (pItemPool) {
        pObj = addressof(gWorldItems[pItemPool.value.iItemIndex].o);

        if (pObj.value.bStatus[0] > 60) {
          if (pObj.value.usItem == Enum225.FIRSTAIDKIT || pObj.value.usItem == Enum225.MEDICKIT || pObj.value.usItem == Enum225.REGEN_BOOSTER || pObj.value.usItem == Enum225.ADRENALINE_BOOSTER) {
            ubMedicalObjects++;
          }
        }

        pItemPool = pItemPool.value.pNext;
      }
    }
  }

  if (CheckFact(Enum170.FACT_PLAYER_STOLE_MEDICAL_SUPPLIES_AGAIN, 0) == true) {
    // player returning stuff!  if back to full then can operate
    if (ubMedicalObjects >= gubCambriaMedicalObjects) {
      SetFactFalse(Enum170.FACT_PLAYER_STOLE_MEDICAL_SUPPLIES_AGAIN);
      SetFactFalse(Enum170.FACT_PLAYER_STOLE_MEDICAL_SUPPLIES);
      return;
    }
  }

  if (ubMedicalObjects < gubCambriaMedicalObjects) {
    // player's stolen something!
    if (CheckFact(Enum170.FACT_PLAYER_STOLE_MEDICAL_SUPPLIES, 0) == false) {
      SetFactTrue(Enum170.FACT_PLAYER_STOLE_MEDICAL_SUPPLIES);
    }

    // if only 1/5 or less left, give up the ghost
    if (ubMedicalObjects * 5 <= gubCambriaMedicalObjects) {
      // run out!
      SetFactTrue(Enum170.FACT_PLAYER_STOLE_MEDICAL_SUPPLIES_AGAIN);
    }
  }
}

function DropOffItemsInMeduna(ubOrderNum: UINT8): void {
  let fSectorLoaded: boolean = false;
  let Object: OBJECTTYPE;
  let uiCount: UINT32 = 0;
  let pObject: Pointer<OBJECTTYPE> = null;
  let usNumberOfItems: UINT16 = 0;
  let usItem: UINT16;
  let ubItemsDelivered: UINT8;
  let ubTempNumItems: UINT8;
  let i: UINT32;

  // if the player doesnt "own" the sector,
  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(MEDUNA_ITEM_DROP_OFF_SECTOR_X, MEDUNA_ITEM_DROP_OFF_SECTOR_Y)].fEnemyControlled) {
    // the items disappear
    gpNewBobbyrShipments[ubOrderNum].fActive = false;
    return;
  }

  // determine if the sector is loaded
  if ((gWorldSectorX == MEDUNA_ITEM_DROP_OFF_SECTOR_X) && (gWorldSectorY == MEDUNA_ITEM_DROP_OFF_SECTOR_Y) && (gbWorldSectorZ == MEDUNA_ITEM_DROP_OFF_SECTOR_Z))
    fSectorLoaded = true;
  else
    fSectorLoaded = false;

  // set crate to closed!
  if (fSectorLoaded) {
    SetOpenableStructureToClosed(MEDUNA_ITEM_DROP_OFF_GRIDNO, 0);
  } else {
    ChangeStatusOfOpenableStructInUnloadedSector(MEDUNA_ITEM_DROP_OFF_SECTOR_X, MEDUNA_ITEM_DROP_OFF_SECTOR_Y, MEDUNA_ITEM_DROP_OFF_SECTOR_Z, MEDUNA_ITEM_DROP_OFF_GRIDNO, false);
  }

  for (i = 0; i < gpNewBobbyrShipments[ubOrderNum].ubNumberPurchases; i++) {
    // Count how many items were purchased
    usNumberOfItems += gpNewBobbyrShipments[ubOrderNum].BobbyRayPurchase[i].ubNumberPurchased;
  }

  // if we are NOT currently in the right sector
  if (!fSectorLoaded) {
    // build an array of objects to be added
    pObject = MemAlloc(sizeof(OBJECTTYPE) * usNumberOfItems);
    if (pObject == null)
      return;
    memset(pObject, 0, sizeof(OBJECTTYPE) * usNumberOfItems);
  }

  uiCount = 0;

  // loop through the number of purchases
  for (i = 0; i < gpNewBobbyrShipments.value.ubNumberPurchases; i++) {
    ubItemsDelivered = gpNewBobbyrShipments[ubOrderNum].BobbyRayPurchase[i].ubNumberPurchased;
    usItem = gpNewBobbyrShipments[ubOrderNum].BobbyRayPurchase[i].usItemIndex;

    while (ubItemsDelivered) {
      // treat 0s as 1s :-)
      ubTempNumItems = Math.min(ubItemsDelivered, Math.max(1, Item[usItem].ubPerPocket));
      CreateItems(usItem, gpNewBobbyrShipments[ubOrderNum].BobbyRayPurchase[i].bItemQuality, ubTempNumItems, addressof(Object));

      // stack as many as possible
      if (fSectorLoaded) {
        AddItemToPool(MEDUNA_ITEM_DROP_OFF_GRIDNO, addressof(Object), -1, 0, 0, 0);
      } else {
        memcpy(addressof(pObject[uiCount]), addressof(Object), sizeof(OBJECTTYPE));
        uiCount++;
      }

      ubItemsDelivered -= ubTempNumItems;
    }
  }

  // if the sector WASNT loaded
  if (!fSectorLoaded) {
    // add all the items from the array that was built above

    // The item are to be added to the Top part of Drassen, grid loc's  10112, 9950
    if (!AddItemsToUnLoadedSector(MEDUNA_ITEM_DROP_OFF_SECTOR_X, MEDUNA_ITEM_DROP_OFF_SECTOR_Y, MEDUNA_ITEM_DROP_OFF_SECTOR_Z, MEDUNA_ITEM_DROP_OFF_GRIDNO, uiCount, pObject, 0, 0, 0, -1, false)) {
      // error
      Assert(0);
    }
    MemFree(pObject);
    pObject = null;
  }

  // mark that the shipment has arrived
  gpNewBobbyrShipments[ubOrderNum].fActive = false;

  // Add an email from kulba telling the user the shipment is there
  AddEmail(BOBBY_R_MEDUNA_SHIPMENT, BOBBY_R_MEDUNA_SHIPMENT_LENGTH, Enum75.BOBBY_R, GetWorldTotalMin());
}
