namespace ja2 {

// To reduce memory fragmentation from frequent MemRealloc(), we allocate memory for more than one special slot each
// time we run out of space.  Odds are that if we need one, we'll need another soon.
const SPECIAL_ITEMS_ALLOCED_AT_ONCE = 3;
// Once allocated, the special item slots remain allocated for the duration of the game, or until the dealer dies.
// This is a little bit wasteful, but saves an awful lot of hassles, and avoid unnecessary memory fragmentation

const MIN_REPAIR_TIME_IN_MINUTES = 15; // minutes
const MIN_REPAIR_COST = 10; // dollars

// price classes
const PRICE_CLASS_JUNK = 0;
const PRICE_CLASS_CHEAP = 1;
const PRICE_CLASS_EXPENSIVE = 2;

export let gubLastSpecialItemAddedAtElement: UINT8 = 255;

// THIS STRUCTURE HAS UNCHANGING INFO THAT DOESN'T GET SAVED/RESTORED/RESET
export let ArmsDealerInfo: ARMS_DEALER_INFO[] /* [NUM_ARMS_DEALERS] */ = [
  // Buying		Selling	Merc ID#	Type									Initial						Flags
  // Price			Price							Of											Cash
  // Modifier	Modifier					Dealer

  createArmsDealerInfoFrom(0.75, 1.25, Enum268.TONY, Enum198.ARMS_DEALER_BUYS_SELLS, 15000, ARMS_DEALER_SOME_USED_ITEMS | ARMS_DEALER_GIVES_CHANGE), // Tony
  createArmsDealerInfoFrom(1.0, 1.5, Enum268.FRANZ, Enum198.ARMS_DEALER_BUYS_SELLS, 5000, ARMS_DEALER_SOME_USED_ITEMS | ARMS_DEALER_GIVES_CHANGE), // Franz Hinkle
  createArmsDealerInfoFrom(0.75, 1.0, Enum268.KEITH, Enum198.ARMS_DEALER_BUYS_SELLS, 1500, ARMS_DEALER_ONLY_USED_ITEMS | ARMS_DEALER_GIVES_CHANGE), // Keith Hemps
  createArmsDealerInfoFrom(0.8, 1.1, Enum268.JAKE, Enum198.ARMS_DEALER_BUYS_SELLS, 2500, ARMS_DEALER_ONLY_USED_ITEMS | ARMS_DEALER_GIVES_CHANGE), // Jake Cameron
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.GABBY, Enum198.ARMS_DEALER_BUYS_SELLS, 3000, ARMS_DEALER_GIVES_CHANGE), // Gabby Mulnick

  createArmsDealerInfoFrom(0.75, 1.25, Enum268.DEVIN, Enum198.ARMS_DEALER_SELLS_ONLY, 5000, ARMS_DEALER_GIVES_CHANGE), // Devin Connell
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.HOWARD, Enum198.ARMS_DEALER_SELLS_ONLY, 3000, ARMS_DEALER_GIVES_CHANGE), // Howard Filmore
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.SAM, Enum198.ARMS_DEALER_SELLS_ONLY, 3000, ARMS_DEALER_GIVES_CHANGE), // Sam Rozen
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.FRANK, Enum198.ARMS_DEALER_SELLS_ONLY, 500, ARMS_DEALER_ACCEPTS_GIFTS), // Frank

  createArmsDealerInfoFrom(1.0, 1.0, Enum268.HERVE, Enum198.ARMS_DEALER_SELLS_ONLY, 250, ARMS_DEALER_ACCEPTS_GIFTS), // Bar Bro 1
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.PETER, Enum198.ARMS_DEALER_SELLS_ONLY, 250, ARMS_DEALER_ACCEPTS_GIFTS), // Bar Bro 2
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.ALBERTO, Enum198.ARMS_DEALER_SELLS_ONLY, 250, ARMS_DEALER_ACCEPTS_GIFTS), // Bar Bro 3
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.CARLO, Enum198.ARMS_DEALER_SELLS_ONLY, 250, ARMS_DEALER_ACCEPTS_GIFTS), // Bar Bro 4

  createArmsDealerInfoFrom(1.0, 1.4, Enum268.MICKY, Enum198.ARMS_DEALER_BUYS_ONLY, 10000, ARMS_DEALER_HAS_NO_INVENTORY | ARMS_DEALER_GIVES_CHANGE), // Micky O'Brien

  // Repair	Repair
  // Speed		Cost
  createArmsDealerInfoFrom(0.1, 0.8, Enum268.ARNIE, Enum198.ARMS_DEALER_REPAIRS, 1500, ARMS_DEALER_HAS_NO_INVENTORY | ARMS_DEALER_GIVES_CHANGE), // Arnie Brunzwell
  createArmsDealerInfoFrom(0.6, 0.6, Enum268.FREDO, Enum198.ARMS_DEALER_REPAIRS, 1000, ARMS_DEALER_HAS_NO_INVENTORY | ARMS_DEALER_GIVES_CHANGE), // Fredo
  createArmsDealerInfoFrom(1.0, 0.4, Enum268.PERKO, Enum198.ARMS_DEALER_REPAIRS, 1000, ARMS_DEALER_HAS_NO_INVENTORY | ARMS_DEALER_GIVES_CHANGE), // Perko

  createArmsDealerInfoFrom(1.0, 1.0, Enum268.DRUGGIST, Enum198.ARMS_DEALER_SELLS_ONLY, 500, ARMS_DEALER_ACCEPTS_GIFTS), // Elgin
  createArmsDealerInfoFrom(1.0, 1.0, Enum268.MANNY, Enum198.ARMS_DEALER_SELLS_ONLY, 500, ARMS_DEALER_ACCEPTS_GIFTS), // Manny
];

// THESE GET SAVED/RESTORED/RESET
export let gArmsDealerStatus: ARMS_DEALER_STATUS[] /* [NUM_ARMS_DEALERS] */;
export let gArmsDealersInventory: DEALER_ITEM_HEADER[][] /* [NUM_ARMS_DEALERS][MAXITEMS] */;

// INT16 GetSpecialItemFromArmsDealerInventory( UINT8 ubArmsDealer, UINT16 usItemIndex, SPECIAL_ITEM_INFO *pSpclItemInfo );

export function InitAllArmsDealers(): void {
  let ubArmsDealer: UINT8;

  // Memset all dealers' status tables to zeroes
  memset(gArmsDealerStatus, 0, sizeof(gArmsDealerStatus));

  // Memset all dealers' inventory tables to zeroes
  memset(gArmsDealersInventory, 0, sizeof(gArmsDealersInventory));

  // Initialize the initial status & inventory for each of the arms dealers
  for (ubArmsDealer = 0; ubArmsDealer < Enum197.NUM_ARMS_DEALERS; ubArmsDealer++) {
    InitializeOneArmsDealer(ubArmsDealer);
  }

  // make sure certain items are in stock and certain limits are respected
  AdjustCertainDealersInventory();
}

function InitializeOneArmsDealer(ubArmsDealer: UINT8): void {
  let usItemIndex: UINT16;
  let ubNumItems: UINT8 = 0;

  memset(addressof(gArmsDealerStatus[ubArmsDealer]), 0, sizeof(ARMS_DEALER_STATUS));
  memset(addressof(gArmsDealersInventory[ubArmsDealer]), 0, sizeof(DEALER_ITEM_HEADER) * Enum225.MAXITEMS);

  // Reset the arms dealers cash on hand to the default initial value
  gArmsDealerStatus[ubArmsDealer].uiArmsDealersCash = ArmsDealerInfo[ubArmsDealer].iInitialCash;

  // if the arms dealer isn't supposed to have any items (includes all repairmen)
  if (ArmsDealerInfo[ubArmsDealer].uiFlags & ARMS_DEALER_HAS_NO_INVENTORY) {
    return;
  }

  // loop through all the item types
  for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    // Can the item be sold by the arms dealer
    if (CanDealerTransactItem(ubArmsDealer, usItemIndex, false)) {
      // Setup an initial amount for the items (treat items as new, how many are used isn't known yet)
      ubNumItems = DetermineInitialInvItems(ubArmsDealer, usItemIndex, GetDealersMaxItemAmount(ubArmsDealer, usItemIndex), false);

      // if there are any initial items
      if (ubNumItems > 0) {
        ArmsDealerGetsFreshStock(ubArmsDealer, usItemIndex, ubNumItems);
      }
    }
  }
}

export function ShutDownArmsDealers(): void {
  let ubArmsDealer: UINT8;
  let usItemIndex: UINT16;

  // loop through all the dealers
  for (ubArmsDealer = 0; ubArmsDealer < Enum197.NUM_ARMS_DEALERS; ubArmsDealer++) {
    // loop through all the item types
    for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
      if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced > 0) {
        FreeSpecialItemArray(addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex]));
      }
    }
  }
}

export function SaveArmsDealerInventoryToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let ubArmsDealer: UINT8;
  let usItemIndex: UINT16;

  // Save the arms dealers status
  if (!FileWrite(hFile, gArmsDealerStatus, sizeof(gArmsDealerStatus), addressof(uiNumBytesWritten))) {
    return false;
  }

  // save the dealers inventory item headers (all at once)
  if (!FileWrite(hFile, gArmsDealersInventory, sizeof(gArmsDealersInventory), addressof(uiNumBytesWritten))) {
    return false;
  }

  // loop through all the dealers inventories
  for (ubArmsDealer = 0; ubArmsDealer < Enum197.NUM_ARMS_DEALERS; ubArmsDealer++) {
    // loop through this dealer's individual items
    for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
      // if there are any special item elements allocated for this item, save them
      if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced > 0) {
        if (!FileWrite(hFile, addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[0]), sizeof(DEALER_SPECIAL_ITEM) * gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced, addressof(uiNumBytesWritten))) {
          return false;
        }
      }
    }
  }

  return true;
}

export function LoadArmsDealerInventoryFromSavedGameFile(hFile: HWFILE, fIncludesElgin: boolean, fIncludesManny: boolean): boolean {
  let uiNumBytesRead: UINT32;
  let ubArmsDealer: UINT8;
  let usItemIndex: UINT16;

  // Free all the dealers special inventory arrays
  ShutDownArmsDealers();

  // Elgin was added to the dealers list in Game Version #54, enlarging these 2 tables...
  // Manny was added to the dealers list in Game Version #55, enlarging these 2 tables...
  if (fIncludesElgin && fIncludesManny) {
    // info for all dealers is in the save file

    // Load the arms dealers status
    if (!FileRead(hFile, gArmsDealerStatus, sizeof(gArmsDealerStatus), addressof(uiNumBytesRead))) {
      return false;
    }

    // load the dealers inventory item headers (all at once)
    if (!FileRead(hFile, gArmsDealersInventory, sizeof(gArmsDealersInventory), addressof(uiNumBytesRead))) {
      return false;
    }
  } else {
    if (!LoadIncompleteArmsDealersStatus(hFile, fIncludesElgin, fIncludesManny)) {
      return false;
    }
  }

  // loop through all the dealers inventories
  for (ubArmsDealer = 0; ubArmsDealer < Enum197.NUM_ARMS_DEALERS; ubArmsDealer++) {
    // loop through this dealer's individual items
    for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
      // if there are any elements allocated for this item, load them
      if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced > 0) {
        // Allocate memory for the inventory
        if (!AllocMemsetSpecialItemArray(addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex]), gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced))
          return false;

        if (!FileRead(hFile, addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[0]), sizeof(DEALER_SPECIAL_ITEM) * gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced, addressof(uiNumBytesRead))) {
          return false;
        }
      }
    }
  }

  return true;
}

export function DailyUpdateOfArmsDealersInventory(): void {
  // if Gabby has creature blood, start turning it into extra elixir
  ConvertCreatureBloodToElixir();

  // Simulate other customers buying inventory from the dealer
  SimulateArmsDealerCustomer();

  // if there are some items that are out of stock, order some more
  DailyCheckOnItemQuantities();

  // make sure certain items are in stock and certain limits are respected
  AdjustCertainDealersInventory();
}

// Once a day, loop through each dealer's inventory items and possibly sell some
function SimulateArmsDealerCustomer(): void {
  let ubArmsDealer: UINT8 = 0;
  let usItemIndex: UINT16;
  let ubItemsSold: UINT8 = 0;
  let ubElement: UINT8;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  // loop through all the arms dealers
  for (ubArmsDealer = 0; ubArmsDealer < Enum197.NUM_ARMS_DEALERS; ubArmsDealer++) {
    if (gArmsDealerStatus[ubArmsDealer].fOutOfBusiness)
      continue;

    // if the arms dealer isn't supposed to have any items (includes all repairmen)
    if (ArmsDealerInfo[ubArmsDealer].uiFlags & ARMS_DEALER_HAS_NO_INVENTORY)
      continue;

    // loop through all items of the same type
    for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
      // if there are some of these in stock
      if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems > 0) {
        // first, try to sell all the new (perfect) ones
        if (usItemIndex == Enum225.JAR_ELIXIR) {
          // only allow selling of standard # of items so those converted from blood given by player will be available
          ubItemsSold = HowManyItemsAreSold(ubArmsDealer, usItemIndex, Math.min(3, gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems), false);
        } else {
          ubItemsSold = HowManyItemsAreSold(ubArmsDealer, usItemIndex, gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems, false);
        }
        if (ubItemsSold > 0) {
          // create item info describing a perfect item
          SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));
          // Now remove that many NEW ones (condition 100) of that item
          RemoveItemFromArmsDealerInventory(ubArmsDealer, usItemIndex, addressof(SpclItemInfo), ubItemsSold);
        }

        // next, try to sell all the used ones, gotta do these one at a time so we can remove them by element
        for (ubElement = 0; ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
          // don't worry about negative condition, repairmen can't come this far, they don't sell!
          if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive) {
            // try selling just this one
            if (HowManyItemsAreSold(ubArmsDealer, usItemIndex, 1, true) > 0) {
              // Sold, now remove that particular USED one!
              RemoveSpecialItemFromArmsDealerInventoryAtElement(ubArmsDealer, usItemIndex, ubElement);
            }
          }
        }
      }
    }
  }
}

function DailyCheckOnItemQuantities(): void {
  let ubArmsDealer: UINT8;
  let usItemIndex: UINT16;
  let ubMaxSupply: UINT8;
  let ubNumItems: UINT8;
  let uiArrivalDay: UINT32;
  let fPrevElig: boolean;
  let ubReorderDays: UINT8;

  // loop through all the arms dealers
  for (ubArmsDealer = 0; ubArmsDealer < Enum197.NUM_ARMS_DEALERS; ubArmsDealer++) {
    if (gArmsDealerStatus[ubArmsDealer].fOutOfBusiness)
      continue;

    // Reset the arms dealers cash on hand to the default initial value
    gArmsDealerStatus[ubArmsDealer].uiArmsDealersCash = ArmsDealerInfo[ubArmsDealer].iInitialCash;

    // if the arms dealer isn't supposed to have any items (includes all repairmen)
    if (ArmsDealerInfo[ubArmsDealer].uiFlags & ARMS_DEALER_HAS_NO_INVENTORY)
      continue;

    // loop through all items of the same type
    for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
      // if the dealer can sell the item type
      if (CanDealerTransactItem(ubArmsDealer, usItemIndex, false)) {
        // if there are no items on order
        if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubQtyOnOrder == 0) {
          ubMaxSupply = GetDealersMaxItemAmount(ubArmsDealer, usItemIndex);

          // if the qty on hand is half the desired amount or fewer
          if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems <= (ubMaxSupply / 2)) {
            // remember value of the "previously eligible" flag
            fPrevElig = gArmsDealersInventory[ubArmsDealer][usItemIndex].fPreviouslyEligible;

            // determine if the item can be restocked (assume new, use items aren't checked for until the stuff arrives)
            if (ItemTransactionOccurs(ubArmsDealer, usItemIndex, DEALER_BUYING, false)) {
              // figure out how many items to reorder (items are reordered an entire batch at a time)
              ubNumItems = HowManyItemsToReorder(ubMaxSupply, gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems);

              // if this is the first day the player is eligible to have access to this thing
              if (!fPrevElig) {
                // eliminate the ordering delay and stock the items instantly!
                // This is just a way to reward the player right away for making progress without the reordering lag...
                ArmsDealerGetsFreshStock(ubArmsDealer, usItemIndex, ubNumItems);
              } else {
                if ((ubArmsDealer == Enum197.ARMS_DEALER_TONY) || (ubArmsDealer == Enum197.ARMS_DEALER_DEVIN)) {
                  // the stuff Tony and Devin sell is imported, so it takes longer to arrive (for game balance)
                  ubReorderDays = (2 + Random(2)); // 2-3 days
                } else {
                  ubReorderDays = (1 + Random(2)); // 1-2 days
                }

                // Determine when the inventory should arrive
                uiArrivalDay = GetWorldDay() + ubReorderDays; // consider changing this to minutes

                // post new order
                gArmsDealersInventory[ubArmsDealer][usItemIndex].ubQtyOnOrder = ubNumItems;
                gArmsDealersInventory[ubArmsDealer][usItemIndex].uiOrderArrivalTime = uiArrivalDay;
              }
            }
          }
        } else // items are on order
        {
          // and today is the day the items come in
          if (gArmsDealersInventory[ubArmsDealer][usItemIndex].uiOrderArrivalTime >= GetWorldDay()) {
            ArmsDealerGetsFreshStock(ubArmsDealer, usItemIndex, gArmsDealersInventory[ubArmsDealer][usItemIndex].ubQtyOnOrder);

            // reset order
            gArmsDealersInventory[ubArmsDealer][usItemIndex].ubQtyOnOrder = 0;
            gArmsDealersInventory[ubArmsDealer][usItemIndex].uiOrderArrivalTime = 0;
          }
        }
      }
    }
  }
}

function ConvertCreatureBloodToElixir(): void {
  let ubBloodAvailable: UINT8;
  let ubAmountToConvert: UINT8;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  ubBloodAvailable = gArmsDealersInventory[Enum197.ARMS_DEALER_GABBY][Enum225.JAR_CREATURE_BLOOD].ubTotalItems;
  if (ubBloodAvailable) {
    // start converting blood into elixir!
    // ubAmountToConvert = (UINT8) __min( 5 + Random( 3 ), ubBloodAvailable );
    ubAmountToConvert = ubBloodAvailable;

    // create item info describing a perfect item
    SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));

    // Now remove that many NEW ones (condition 100) of that item
    RemoveItemFromArmsDealerInventory(Enum197.ARMS_DEALER_GABBY, Enum225.JAR_CREATURE_BLOOD, addressof(SpclItemInfo), ubAmountToConvert);

    ArmsDealerGetsFreshStock(Enum197.ARMS_DEALER_GABBY, Enum225.JAR_ELIXIR, ubAmountToConvert);
  }
}

function AdjustCertainDealersInventory(): boolean {
  // Adjust Tony's items (this restocks *instantly* 1/day, doesn't use the reorder system)
  GuaranteeAtLeastOneItemOfType(Enum197.ARMS_DEALER_TONY, ARMS_DEALER_BIG_GUNS);
  LimitArmsDealersInventory(Enum197.ARMS_DEALER_TONY, ARMS_DEALER_BIG_GUNS, 2);
  LimitArmsDealersInventory(Enum197.ARMS_DEALER_TONY, ARMS_DEALER_HANDGUNCLASS, 3);
  LimitArmsDealersInventory(Enum197.ARMS_DEALER_TONY, ARMS_DEALER_AMMO, 8);

  // Adjust all bartenders' alcohol levels to a minimum
  GuaranteeMinimumAlcohol(Enum197.ARMS_DEALER_FRANK);
  GuaranteeMinimumAlcohol(Enum197.ARMS_DEALER_BAR_BRO_1);
  GuaranteeMinimumAlcohol(Enum197.ARMS_DEALER_BAR_BRO_2);
  GuaranteeMinimumAlcohol(Enum197.ARMS_DEALER_BAR_BRO_3);
  GuaranteeMinimumAlcohol(Enum197.ARMS_DEALER_BAR_BRO_4);
  GuaranteeMinimumAlcohol(Enum197.ARMS_DEALER_ELGIN);
  GuaranteeMinimumAlcohol(Enum197.ARMS_DEALER_MANNY);

  // make sure Sam (hardware guy) has at least one empty jar
  GuaranteeAtLeastXItemsOfIndex(Enum197.ARMS_DEALER_SAM, Enum225.JAR, 1);

  if (CheckFact(Enum170.FACT_ESTONI_REFUELLING_POSSIBLE, 0)) {
    // gas is restocked regularly, unlike most items
    GuaranteeAtLeastXItemsOfIndex(Enum197.ARMS_DEALER_JAKE, Enum225.GAS_CAN, (4 + Random(3)));
  }

  // If the player hasn't bought a video camera from Franz yet, make sure Franz has one to sell
  if (!(gArmsDealerStatus[Enum197.ARMS_DEALER_FRANZ].ubSpecificDealerFlags & ARMS_DEALER_FLAG__FRANZ_HAS_SOLD_VIDEO_CAMERA_TO_PLAYER)) {
    GuaranteeAtLeastXItemsOfIndex(Enum197.ARMS_DEALER_FRANZ, Enum225.VIDEO_CAMERA, 1);
  }

  return true;
}

function LimitArmsDealersInventory(ubArmsDealer: UINT8, uiDealerItemType: UINT32, ubMaxNumberOfItemType: UINT8): void {
  let usItemIndex: UINT16 = 0;
  let uiItemsToRemove: UINT32 = 0;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  let usAvailableItem: UINT16[] /* [MAXITEMS] */ = [ NOTHING ];
  let ubNumberOfAvailableItem: UINT8[] /* [MAXITEMS] */ = [ 0 ];
  let uiTotalNumberOfItems: UINT32 = 0;
  let uiRandomChoice: UINT32;
  let uiNumAvailableItems: UINT32 = 0;
  let uiIndex: UINT32;

  // not permitted for repair dealers - would take extra code to avoid counting items under repair!
  Assert(!DoesDealerDoRepairs(ubArmsDealer));

  if (gArmsDealerStatus[ubArmsDealer].fOutOfBusiness)
    return;

  // loop through all items of the same class and count the number in stock
  for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    // if there is some items in stock
    if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems > 0) {
      // if the item is of the same dealer item type
      if (uiDealerItemType & GetArmsDealerItemTypeFromItemNumber(usItemIndex)) {
        usAvailableItem[uiNumAvailableItems] = usItemIndex;

        // if the dealer item type is ammo
        if (uiDealerItemType == ARMS_DEALER_AMMO) {
          // all ammo of same type counts as only one item
          ubNumberOfAvailableItem[uiNumAvailableItems] = 1;
          uiTotalNumberOfItems++;
        } else {
          // items being repaired don't count against the limit
          ubNumberOfAvailableItem[uiNumAvailableItems] = gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems;
          uiTotalNumberOfItems += ubNumberOfAvailableItem[uiNumAvailableItems];
        }
        uiNumAvailableItems++;
      }
    }
  }

  // if there is more of the given type than we want
  if (uiNumAvailableItems > ubMaxNumberOfItemType) {
    uiItemsToRemove = uiNumAvailableItems - ubMaxNumberOfItemType;

    do {
      uiRandomChoice = Random(uiTotalNumberOfItems);

      for (uiIndex = 0; uiIndex < uiNumAvailableItems; uiIndex++) {
        if (uiRandomChoice <= ubNumberOfAvailableItem[uiIndex]) {
          usItemIndex = usAvailableItem[uiIndex];
          if (uiDealerItemType == ARMS_DEALER_AMMO) {
            // remove all of them, since each ammo item counts as only one "item" here
            // create item info describing a perfect item
            SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));
            // ammo will always be only condition 100, there's never any in special slots
            RemoveItemFromArmsDealerInventory(ubArmsDealer, usItemIndex, addressof(SpclItemInfo), gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems);
          } else {
            // pick 1 random one, don't care about its condition
            RemoveRandomItemFromArmsDealerInventory(ubArmsDealer, usItemIndex, 1);
          }
          // now remove entry from the array by replacing it with the last and decrementing
          // the size of the array
          usAvailableItem[uiIndex] = usAvailableItem[uiNumAvailableItems - 1];
          ubNumberOfAvailableItem[uiIndex] = ubNumberOfAvailableItem[uiNumAvailableItems - 1];
          uiNumAvailableItems--;

          // decrement count of # of items to remove
          uiItemsToRemove--;
          break; // and out of 'for' loop
        } else {
          // next item!
          uiRandomChoice -= ubNumberOfAvailableItem[uiIndex];
        }
      }

      /*
      //loop through all items of the same type
      for( usItemIndex = 1; usItemIndex < MAXITEMS; usItemIndex++ )
      {
              //if there are some non-repairing items in stock
              if( gArmsDealersInventory[ ubArmsDealer ][ usItemIndex ].ubTotalItems )
              {
                      //if the item is of the same dealer item type
                      if( uiDealerItemType & GetArmsDealerItemTypeFromItemNumber( usItemIndex ) )
                      {
                              // a random chance that the item will be removed
                              if( Random( 100 ) < 30 )
                              {
                                      //remove the item

                                      //if the dealer item type is ammo
                                      if( uiDealerItemType == ARMS_DEALER_AMMO )
                                      {
                                              // remove all of them, since each ammo item counts as only one "item" here

                                              // create item info describing a perfect item
                                              SetSpecialItemInfoToDefaults( &SpclItemInfo );
                                              // ammo will always be only condition 100, there's never any in special slots
                                              RemoveItemFromArmsDealerInventory( ubArmsDealer, usItemIndex, &SpclItemInfo, gArmsDealersInventory[ ubArmsDealer ][ usItemIndex ].ubTotalItems );
                                      }
                                      else
                                      {
                                              // pick 1 random one, don't care about its condition
                                              RemoveRandomItemFromArmsDealerInventory( ubArmsDealer, usItemIndex, 1 );
                                      }

                                      uiItemsToRemove--;
                                      if( uiItemsToRemove == 0)
                                              break;
                              }
                      }
              }
      }
      */
    } while (uiItemsToRemove > 0);
  }
}

function GuaranteeAtLeastOneItemOfType(ubArmsDealer: UINT8, uiDealerItemType: UINT32): void {
  let usItemIndex: UINT16;
  let ubChance: UINT8;
  let fFoundEligibleItemOfSameType: boolean = false;
  let fItemHasBeenAdded: boolean = false;
  let fFailedOnce: boolean = false;
  let usAvailableItem: UINT16[] /* [MAXITEMS] */ = [ NOTHING ];
  let ubChanceForAvailableItem: UINT8[] /* [MAXITEMS] */ = [ 0 ];
  let uiTotalChances: UINT32 = 0;
  let uiNumAvailableItems: UINT32 = 0;
  let uiIndex: UINT32;
  let uiRandomChoice: UINT32;

  // not permitted for repair dealers - would take extra code to avoid counting items under repair!
  Assert(!DoesDealerDoRepairs(ubArmsDealer));

  if (gArmsDealerStatus[ubArmsDealer].fOutOfBusiness)
    return;

  // loop through all items of the same type
  for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    // if the item is of the same dealer item type
    if (uiDealerItemType & GetArmsDealerItemTypeFromItemNumber(usItemIndex)) {
      // if there are any of these in stock
      if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems > 0) {
        // there is already at least 1 item of that type, return
        return;
      }

      // if he can stock it (it appears in his inventory list)
      if (GetDealersMaxItemAmount(ubArmsDealer, usItemIndex) > 0) {
        // and the stage of the game gives him a chance to have it (assume new)
        ubChance = ChanceOfItemTransaction(ubArmsDealer, usItemIndex, DEALER_BUYING, false);
        if (ubChance > 0) {
          usAvailableItem[uiNumAvailableItems] = usItemIndex;
          ubChanceForAvailableItem[uiNumAvailableItems] = ubChance;
          uiNumAvailableItems++;
          uiTotalChances += ubChance;
        }
      }
    }
  }

  // if there aren't any such items, the following loop would never finish, so quit before trying it!
  if (uiNumAvailableItems == 0) {
    return;
  }

  // CJC: randomly pick one of available items by weighted random selection.

  // randomize number within uiTotalChances and then loop forwards till we find that item
  uiRandomChoice = Random(uiTotalChances);

  for (uiIndex = 0; uiIndex < uiNumAvailableItems; uiIndex++) {
    if (uiRandomChoice <= ubChanceForAvailableItem[uiIndex]) {
      ArmsDealerGetsFreshStock(ubArmsDealer, usAvailableItem[uiIndex], 1);
      return;
    } else {
      // next item!
      uiRandomChoice -= ubChanceForAvailableItem[uiIndex];
    }
  }

  // internal logic failure!
}

export function GuaranteeAtLeastXItemsOfIndex(ubArmsDealer: UINT8, usItemIndex: UINT16, ubHowMany: UINT8): void {
  // not permitted for repair dealers - would take extra code to avoid counting items under repair!
  Assert(!DoesDealerDoRepairs(ubArmsDealer));

  if (gArmsDealerStatus[ubArmsDealer].fOutOfBusiness)
    return;

  // if there are any of these in stock
  if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems >= ubHowMany) {
    // have what we need...
    return;
  }

  // if he can stock it (it appears in his inventory list)
  // RESTRICTION REMOVED: Jake must be able to guarantee GAS even though it's not in his list, it's presence is conditional
  //	if( GetDealersMaxItemAmount( ubArmsDealer, usItemIndex ) > 0)
  {
    // add the item
    ArmsDealerGetsFreshStock(ubArmsDealer, usItemIndex, (ubHowMany - gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems));
  }
}

function GetArmsDealerItemTypeFromItemNumber(usItem: UINT16): UINT32 {
  switch (Item[usItem].usItemClass) {
    case IC_NONE:
      return 0;
      break;

    case IC_GUN:
      switch (Weapon[Item[usItem].ubClassIndex].ubWeaponClass) {
        case Enum282.HANDGUNCLASS:
          return ARMS_DEALER_HANDGUNCLASS;
          break;
        case Enum282.RIFLECLASS:
          if (ItemIsARocketRifle(usItem))
            return ARMS_DEALER_ROCKET_RIFLE;
          else
            return ARMS_DEALER_RIFLECLASS;
          break;
        case Enum282.SHOTGUNCLASS:
          return ARMS_DEALER_SHOTGUNCLASS;
          break;
        case Enum282.SMGCLASS:
          return ARMS_DEALER_SMGCLASS;
          break;
        case Enum282.MGCLASS:
          return ARMS_DEALER_MGCLASS;
          break;
        case Enum282.MONSTERCLASS:
          return 0;
          break;
        case Enum282.KNIFECLASS:
          return ARMS_DEALER_KNIFECLASS;
          break;
      }
      break;

    case IC_PUNCH:
      if (usItem == NOTHING) {
        return 0;
      }
      // else treat as blade
    case IC_BLADE:
    case IC_THROWING_KNIFE:
      return ARMS_DEALER_BLADE;
      break;
    case IC_LAUNCHER:
      return ARMS_DEALER_LAUNCHER;
      break;
    case IC_ARMOUR:
      return ARMS_DEALER_ARMOUR;
      break;
    case IC_MEDKIT:
      return ARMS_DEALER_MEDKIT;
      break;
    case IC_KIT:
      return ARMS_DEALER_KIT;
      break;
    case IC_MISC: {
      // switch on the type of item
      switch (usItem) {
        case Enum225.BEER:
        case Enum225.WINE:
        case Enum225.ALCOHOL:
          return ARMS_DEALER_ALCOHOL;
          break;

        case Enum225.METALDETECTOR:
        case Enum225.LASERSCOPE:
          //				case REMDETONATOR:
          return ARMS_DEALER_ELECTRONICS;
          break;

        case Enum225.CANTEEN:
        case Enum225.CROWBAR:
        case Enum225.WIRECUTTERS:
          return ARMS_DEALER_HARDWARE;
          break;

        case Enum225.ADRENALINE_BOOSTER:
        case Enum225.REGEN_BOOSTER:
        case Enum225.SYRINGE_3:
        case Enum225.SYRINGE_4:
        case Enum225.SYRINGE_5:
          return ARMS_DEALER_MEDICAL;
          break;

        case Enum225.SILENCER:
        case Enum225.SNIPERSCOPE:
        case Enum225.BIPOD:
        case Enum225.DUCKBILL:
          return ARMS_DEALER_ATTACHMENTS;
          break;

        case Enum225.DETONATOR:
        case Enum225.REMDETONATOR:
        case Enum225.REMOTEBOMBTRIGGER:
          return ARMS_DEALER_DETONATORS;
          break;

        default:
          return ARMS_DEALER_MISC;
      }
    } break;
    case IC_AMMO:
      return ARMS_DEALER_AMMO;
      break;
    case IC_FACE:
      switch (usItem) {
        case Enum225.EXTENDEDEAR:
        case Enum225.NIGHTGOGGLES:
        case Enum225.ROBOT_REMOTE_CONTROL:
          return ARMS_DEALER_ELECTRONICS;
          break;

        default:
          return ARMS_DEALER_FACE;
      }
      break;
    case IC_THROWN:
      return 0;
      //			return( ARMS_DEALER_THROWN );

      break;
    case IC_KEY:
      return 0;
      //			return( ARMS_DEALER_KEY );
      break;
    case IC_GRENADE:
      return ARMS_DEALER_GRENADE;
      break;
    case IC_BOMB:
      return ARMS_DEALER_BOMB;
      break;
    case IC_EXPLOSV:
      return ARMS_DEALER_EXPLOSV;
      break;
    case IC_TENTACLES:
    case IC_MONEY:
      return 0;
      break;

      //	case IC_APPLIABLE:
      break;

    default:
      AssertMsg(false, String("GetArmsDealerItemTypeFromItemNumber(), invalid class %d for item %d.  DF 0.", Item[usItem].usItemClass, usItem));
      break;
  }
  return 0;
}

export function IsMercADealer(ubMercID: UINT8): boolean {
  let cnt: UINT8;

  // Manny is not actually a valid dealer unless a particular event sets that fact
  if ((ubMercID == Enum268.MANNY) && !CheckFact(Enum170.FACT_MANNY_IS_BARTENDER, 0)) {
    return false;
  }

  // loop through the list of arms dealers
  for (cnt = 0; cnt < Enum197.NUM_ARMS_DEALERS; cnt++) {
    if (ArmsDealerInfo[cnt].ubShopKeeperID == ubMercID)
      return true;
  }
  return false;
}

export function GetArmsDealerIDFromMercID(ubMercID: UINT8): INT8 {
  let cnt: INT8;

  // loop through the list of arms dealers
  for (cnt = 0; cnt < Enum197.NUM_ARMS_DEALERS; cnt++) {
    if (ArmsDealerInfo[cnt].ubShopKeeperID == ubMercID)
      return cnt;
  }

  return -1;
}

export function GetTypeOfArmsDealer(ubDealerID: UINT8): UINT8 {
  return ArmsDealerInfo[ubDealerID].ubTypeOfArmsDealer;
}

export function DoesDealerDoRepairs(ubArmsDealer: UINT8): boolean {
  if (ArmsDealerInfo[ubArmsDealer].ubTypeOfArmsDealer == Enum198.ARMS_DEALER_REPAIRS)
    return true;
  else
    return false;
}

/*
INT16 GetSpecialItemFromArmsDealerInventory( UINT8 ubArmsDealer, UINT16 usItemIndex, SPECIAL_ITEM_INFO *pSpclItemInfo )
{
        UINT8 ubElement;

        // this function won't find perfect items!
        Assert( IsItemInfoSpecial( pSpclItemInfo ) );

        for( ubElement = 0; ubElement < gArmsDealersInventory[ ubArmsDealer ][ usItemIndex ].ubElementsAlloced; ubElement++ )
        {
                // if this is the one we're looking for
                if( memcmp( &(gArmsDealersInventory[ ubArmsDealer ][ usItemIndex ].SpecialItem[ ubElement ].Info), pSpclItemInfo, sizeof( SPECIAL_ITEM_INFO ) ) == 0 )
                {
                        return( ubElement );
                }
        }

        // not found!
        return( -1 );
}
*/

export function RepairmanIsFixingItemsButNoneAreDoneYet(ubProfileID: UINT8): boolean {
  let bArmsDealer: INT8;
  let fHaveOnlyUnRepairedItems: boolean = false;
  let ubElement: UINT8;
  let usItemIndex: UINT16;

  bArmsDealer = GetArmsDealerIDFromMercID(ubProfileID);
  if (bArmsDealer == -1)
    return false;

  // if the dealer is not a repair dealer, return
  if (!DoesDealerDoRepairs(bArmsDealer))
    return false;

  // loop through the dealers inventory and check if there are only unrepaired items
  for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    // if there is some items in stock
    if (gArmsDealersInventory[bArmsDealer][usItemIndex].ubTotalItems) {
      // loop through the array of items
      for (ubElement = 0; ubElement < gArmsDealersInventory[bArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
        if (gArmsDealersInventory[bArmsDealer][usItemIndex].SpecialItem[ubElement].fActive) {
          // if the items status is below 0, the item is being repaired
          if (gArmsDealersInventory[bArmsDealer][usItemIndex].SpecialItem[ubElement].Info.bItemCondition < 0) {
            // if the item has been repaired
            if (gArmsDealersInventory[bArmsDealer][usItemIndex].SpecialItem[ubElement].uiRepairDoneTime <= GetWorldTotalMin()) {
              // A repair item is ready, therefore, return false
              return false;
            } else {
              fHaveOnlyUnRepairedItems = true;
            }
          }
        }
      }
    }
  }

  return fHaveOnlyUnRepairedItems;
}

function GetTimeToFixItemBeingRepaired(ubArmsDealer: UINT8, usItemIndex: UINT16, ubElement: UINT8): UINT32 {
  // dealer must be a repair dealer
  Assert(DoesDealerDoRepairs(ubArmsDealer));
  // element index must be valid
  Assert(ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced);
  // that item must be active
  Assert(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive);
  // that item must be in repair
  Assert(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].Info.bItemCondition < 0);

  // if the item has already been repaired
  if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].uiRepairDoneTime <= GetWorldTotalMin())
    return 0;

  // Return how many more minutes it will take to fix the item
  return gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].uiRepairDoneTime - GetWorldTotalMin();
}

export function CanDealerTransactItem(ubArmsDealer: UINT8, usItemIndex: UINT16, fPurchaseFromPlayer: boolean): boolean {
  switch (ArmsDealerInfo[ubArmsDealer].ubTypeOfArmsDealer) {
    case Enum198.ARMS_DEALER_SELLS_ONLY:
      if (fPurchaseFromPlayer) {
        // this dealer only sells stuff to player, so he can't buy anything from him
        return false;
      }
      break;

    case Enum198.ARMS_DEALER_BUYS_ONLY:
      if (!fPurchaseFromPlayer) {
        // this dealer only buys stuff from player, so he can't sell anything to him
        return false;
      }
      break;

    case Enum198.ARMS_DEALER_BUYS_SELLS:
      switch (ubArmsDealer) {
        case Enum197.ARMS_DEALER_JAKE:
        case Enum197.ARMS_DEALER_KEITH:
        case Enum197.ARMS_DEALER_FRANZ:
          if (fPurchaseFromPlayer) {
            // these guys will buy nearly anything from the player, regardless of what they carry for sale!
            return CalcValueOfItemToDealer(ubArmsDealer, usItemIndex, false) > 0;
          }
          // else selling inventory uses their inventory list
          break;

        default:
          // the others go by their inventory list
          break;
      }
      break;

    case Enum198.ARMS_DEALER_REPAIRS:
      // repairmen don't have a complete list of what they'll repair in their inventory,
      // so we must check the item's properties instead.
      return CanDealerRepairItem(ubArmsDealer, usItemIndex);

    default:
      AssertMsg(false, String("CanDealerTransactItem(), type of dealer %d.  AM 0.", ArmsDealerInfo[ubArmsDealer].ubTypeOfArmsDealer));
      return false;
  }

  return DoesItemAppearInDealerInventoryList(ubArmsDealer, usItemIndex, fPurchaseFromPlayer);
}

export function CanDealerRepairItem(ubArmsDealer: UINT8, usItemIndex: UINT16): boolean {
  let uiFlags: UINT32;

  uiFlags = Item[usItemIndex].fFlags;

  // can't repair anything that's not repairable!
  if (!(uiFlags & ITEM_REPAIRABLE)) {
    return false;
  }

  switch (ubArmsDealer) {
    case Enum197.ARMS_DEALER_ARNIE:
    case Enum197.ARMS_DEALER_PERKO:
      // repairs ANYTHING non-electronic
      if (!(uiFlags & ITEM_ELECTRONIC)) {
        return true;
      }
      break;

    case Enum197.ARMS_DEALER_FREDO:
      // repairs ONLY electronics
      if (uiFlags & ITEM_ELECTRONIC) {
        return true;
      }
      break;

    default:
      AssertMsg(false, String("CanDealerRepairItem(), Arms Dealer %d is not a recognized repairman!.  AM 1.", ubArmsDealer));
  }

  // can't repair this...
  return false;
}

function AllocMemsetSpecialItemArray(pDealerItem: Pointer<DEALER_ITEM_HEADER>, ubElementsNeeded: UINT8): boolean {
  Assert(pDealerItem);
  Assert(ubElementsNeeded > 0);

  pDealerItem.value.SpecialItem = MemAlloc(sizeof(DEALER_SPECIAL_ITEM) * ubElementsNeeded);
  if (pDealerItem.value.SpecialItem == null) {
    Assert(0);
    return false;
  }

  // zero them out (they're inactive until an item is actually added)
  memset(pDealerItem.value.SpecialItem, 0, sizeof(DEALER_SPECIAL_ITEM) * ubElementsNeeded);

  pDealerItem.value.ubElementsAlloced = ubElementsNeeded;

  return true;
}

function ResizeSpecialItemArray(pDealerItem: Pointer<DEALER_ITEM_HEADER>, ubElementsNeeded: UINT8): boolean {
  Assert(pDealerItem);
  // must already have a ptr allocated!
  Assert(pDealerItem.value.SpecialItem);

  if (ubElementsNeeded == pDealerItem.value.ubElementsAlloced) {
    // shouldn't have been called, but what they hey, it's not exactly a problem
    return true;
  }

  // already allocated, but change its size
  pDealerItem.value.SpecialItem = MemRealloc(pDealerItem.value.SpecialItem, sizeof(DEALER_SPECIAL_ITEM) * ubElementsNeeded);
  if (pDealerItem.value.SpecialItem == null) {
    Assert(0);
    return false;
  }

  // if adding more elements
  if (ubElementsNeeded > pDealerItem.value.ubElementsAlloced) {
    // zero them out (they're inactive until an item is actually added)
    memset(addressof(pDealerItem.value.SpecialItem[pDealerItem.value.ubElementsAlloced]), 0, sizeof(DEALER_SPECIAL_ITEM) * (ubElementsNeeded - pDealerItem.value.ubElementsAlloced));
  }

  pDealerItem.value.ubElementsAlloced = ubElementsNeeded;

  return true;
}

function FreeSpecialItemArray(pDealerItem: Pointer<DEALER_ITEM_HEADER>): void {
  Assert(pDealerItem);
  // must already have a ptr allocated!
  Assert(pDealerItem.value.SpecialItem);

  MemFree(pDealerItem.value.SpecialItem);
  pDealerItem.value.SpecialItem = null;

  pDealerItem.value.ubElementsAlloced = 0;
  pDealerItem.value.ubTotalItems = pDealerItem.value.ubPerfectItems;

  // doesn't effect perfect items, orders or stray bullets!
}

function ArmsDealerGetsFreshStock(ubArmsDealer: UINT8, usItemIndex: UINT16, ubNumItems: UINT8): void {
  let ubCnt: UINT8;
  let ubItemCondition: UINT8;
  let ubPerfectOnes: UINT8 = 0;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  // create item info describing a perfect item
  SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));

  // determine the condition of each one, counting up new ones, but adding damaged ones right away
  for (ubCnt = 0; ubCnt < ubNumItems; ubCnt++) {
    ubItemCondition = DetermineDealerItemCondition(ubArmsDealer, usItemIndex);

    // if the item is brand new
    if (ubItemCondition == 100) {
      ubPerfectOnes++;
    } else {
      // add a used item with that condition to his inventory
      SpclItemInfo.bItemCondition = ubItemCondition;
      AddItemToArmsDealerInventory(ubArmsDealer, usItemIndex, addressof(SpclItemInfo), 1);
    }
  }

  // now add all the perfect ones, in one shot
  if (ubPerfectOnes > 0) {
    SpclItemInfo.bItemCondition = 100;
    AddItemToArmsDealerInventory(ubArmsDealer, usItemIndex, addressof(SpclItemInfo), ubPerfectOnes);
  }
}

function DetermineDealerItemCondition(ubArmsDealer: UINT8, usItemIndex: UINT16): UINT8 {
  let ubCondition: UINT8 = 100;

  // if it's a damagable item, and not a liquid (those are always sold full)
  if ((Item[usItemIndex].fFlags & ITEM_DAMAGEABLE) && !ItemContainsLiquid(usItemIndex)) {
    // if he ONLY has used items, or 50% of the time if he carries both used & new items
    if ((ArmsDealerInfo[ubArmsDealer].uiFlags & ARMS_DEALER_ONLY_USED_ITEMS) || ((ArmsDealerInfo[ubArmsDealer].uiFlags & ARMS_DEALER_SOME_USED_ITEMS) && (Random(100) < 50))) {
      // make the item a used one
      ubCondition = (20 + Random(60));
    }
  }

  return ubCondition;
}

function ItemContainsLiquid(usItemIndex: UINT16): boolean {
  switch (usItemIndex) {
    case Enum225.CANTEEN:
    case Enum225.BEER:
    case Enum225.ALCOHOL:
    case Enum225.JAR_HUMAN_BLOOD:
    case Enum225.JAR_CREATURE_BLOOD:
    case Enum225.JAR_QUEEN_CREATURE_BLOOD:
    case Enum225.JAR_ELIXIR:
    case Enum225.GAS_CAN:
      return true;
  }

  return false;
}

/*
UINT32 CountTotalItemsInArmsDealersInventory( UINT8 ubArmsDealer )
{
        UINT32	uiNumOfItems=0;
        UINT16	usItemIndex;

        //loop through all the items in this dealer's inventory
        for( usItemIndex = 1; usItemIndex < MAXITEMS; usItemIndex++ )
        {
                // This counts each pack of ammo or stacked item as one.  See the "distinct" version of this for an alternate version
                uiNumOfItems += gArmsDealersInventory[ ubArmsDealer ][ usItemIndex ].ubTotalItems;
        }

        return( uiNumOfItems );
}
*/

export function CountDistinctItemsInArmsDealersInventory(ubArmsDealer: UINT8): UINT32 {
  let uiNumOfItems: UINT32 = 0;
  let usItemIndex: UINT16;

  for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    // if there are any items
    if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems > 0) {
      // if there are any items in perfect condition
      if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems > 0) {
        // if the items can be stacked
        // NOTE: This test must match the one inside AddItemsToTempDealerInventory() exactly!
        if (DealerItemIsSafeToStack(usItemIndex)) {
          // regardless of how many there are, they count as 1 *distinct* item!  They will all be together in one box...
          uiNumOfItems++;
        } else {
          // non-stacking items must be stored in one / box , because each may have unique fields besides bStatus[]
          // Example: guns all have ammo, ammo type, etc.  We need these uniquely represented for pricing & manipulation
          uiNumOfItems += gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems;
        }
      }

      // each *active* special item counts as one additional distinct item (each one occupied a separate shopkeeper box!)
      // NOTE: This is including items being repaired!!!
      uiNumOfItems += CountActiveSpecialItemsInArmsDealersInventory(ubArmsDealer, usItemIndex);
    }
  }

  return uiNumOfItems;
}

function CountActiveSpecialItemsInArmsDealersInventory(ubArmsDealer: UINT8, usItemIndex: UINT16): UINT8 {
  let ubActiveSpecialItems: UINT8 = 0;
  let ubElement: UINT8;

  // next, try to sell all the used ones, gotta do these one at a time so we can remove them by element
  for (ubElement = 0; ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
    // don't worry about negative condition, repairmen can't come this far, they don't sell!
    if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive) {
      ubActiveSpecialItems++;
    }
  }

  return ubActiveSpecialItems;
}

export function CountTotalItemsRepairDealerHasInForRepairs(ubArmsDealer: UINT8): UINT16 {
  let usItemIndex: UINT16;
  let usHowManyInForRepairs: UINT16 = 0;

  // if the dealer is not a repair dealer, no need to count, return 0
  if (!DoesDealerDoRepairs(ubArmsDealer))
    return 0;

  // loop through the dealers inventory and count the number of items in for repairs
  for (usItemIndex = 0; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    usHowManyInForRepairs += CountSpecificItemsRepairDealerHasInForRepairs(ubArmsDealer, usItemIndex);
  }

  return usHowManyInForRepairs;
}

function CountSpecificItemsRepairDealerHasInForRepairs(ubArmsDealer: UINT8, usItemIndex: UINT16): UINT8 {
  let ubElement: UINT8;
  let ubHowManyInForRepairs: UINT8 = 0;

  // if the dealer is not a repair dealer, no need to count, return 0
  if (!DoesDealerDoRepairs(ubArmsDealer))
    return 0;

  // if there is some items in stock
  if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems) {
    // loop through the array of items
    for (ubElement = 0; ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
      if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive) {
        // if the item's status is below 0, the item is being repaired
        if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].Info.bItemCondition < 0) {
          ubHowManyInForRepairs++;
        }
      }
    }
  }

  return ubHowManyInForRepairs;
}

export function AddObjectToArmsDealerInventory(ubArmsDealer: UINT8, pObject: Pointer<OBJECTTYPE>): void {
  let ubCnt: UINT8;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  SetSpecialItemInfoFromObject(addressof(SpclItemInfo), pObject);

  // split up all the components of an objecttype and add them as seperate items into the dealer's inventory
  switch (Item[pObject.value.usItem].usItemClass) {
    case IC_GUN:
      // add the gun (keeps the object's status and imprintID)
      // if the gun was jammed, this will forget about the jam (i.e. dealer immediately unjams anything he buys)
      AddItemToArmsDealerInventory(ubArmsDealer, pObject.value.usItem, addressof(SpclItemInfo), 1);

      // if any GunAmmoItem is specified
      if (pObject.value.usGunAmmoItem != Enum225.NONE) {
        // if it's regular ammo
        if (Item[pObject.value.usGunAmmoItem].usItemClass == IC_AMMO) {
          // and there are some remaining
          if (pObject.value.ubGunShotsLeft > 0) {
            // add the bullets of its remaining ammo
            AddAmmoToArmsDealerInventory(ubArmsDealer, pObject.value.usGunAmmoItem, pObject.value.ubGunShotsLeft);
          }
        } else // assume it's attached ammo (mortar shells, grenades)
        {
          // add the launchable item (can't be imprinted, or have attachments!)
          SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));
          SpclItemInfo.bItemCondition = pObject.value.bGunAmmoStatus;

          // if the gun it was in was jammed, get rid of the negative status now
          if (SpclItemInfo.bItemCondition < 0) {
            SpclItemInfo.bItemCondition *= -1;
          }

          AddItemToArmsDealerInventory(ubArmsDealer, pObject.value.usGunAmmoItem, addressof(SpclItemInfo), 1);
        }
      }
      break;

    case IC_AMMO:
      // add the contents of each magazine (multiple mags may have vastly different #bullets left)
      for (ubCnt = 0; ubCnt < pObject.value.ubNumberOfObjects; ubCnt++) {
        AddAmmoToArmsDealerInventory(ubArmsDealer, pObject.value.usItem, pObject.value.ubShotsLeft[ubCnt]);
      }
      break;

    default:
      // add each object seperately (multiple objects may have vastly different statuses, keep any imprintID)
      for (ubCnt = 0; ubCnt < pObject.value.ubNumberOfObjects; ubCnt++) {
        SpclItemInfo.bItemCondition = pObject.value.bStatus[ubCnt];
        AddItemToArmsDealerInventory(ubArmsDealer, pObject.value.usItem, addressof(SpclItemInfo), 1);
      }
      break;
  }

  // loop through any detachable attachments and add them as seperate items
  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pObject.value.usAttachItem[ubCnt] != Enum225.NONE) {
      // ARM: Note: this is only used for selling, not repairs, so attachmentes are seperated when sold to a dealer
      // If the attachment is detachable
      if (!(Item[pObject.value.usAttachItem[ubCnt]].fFlags & ITEM_INSEPARABLE)) {
        // add this particular attachment (they can't be imprinted, or themselves have attachments!)
        SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));
        SpclItemInfo.bItemCondition = pObject.value.bAttachStatus[ubCnt];
        AddItemToArmsDealerInventory(ubArmsDealer, pObject.value.usAttachItem[ubCnt], addressof(SpclItemInfo), 1);
      }
    }
  }

  // nuke the original object to prevent any possible item duplication
  memset(pObject, 0, sizeof(OBJECTTYPE));
}

function AddAmmoToArmsDealerInventory(ubArmsDealer: UINT8, usItemIndex: UINT16, ubShotsLeft: UINT8): void {
  let ubMagCapacity: UINT8;
  let pubStrayAmmo: Pointer<UINT8>;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  // Ammo only, please!!!
  if (Item[usItemIndex].usItemClass != IC_AMMO) {
    Assert(0);
    return;
  }

  if (ubShotsLeft == 0) {
    return;
  }

  ubMagCapacity = Magazine[Item[usItemIndex].ubClassIndex].ubMagSize;

  if (ubShotsLeft >= ubMagCapacity) {
    // add however many FULL magazines the #shot left represents
    SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));
    AddItemToArmsDealerInventory(ubArmsDealer, usItemIndex, addressof(SpclItemInfo), (ubShotsLeft / ubMagCapacity));
    ubShotsLeft %= ubMagCapacity;
  }

  // any shots left now are "strays" - not enough to completely fill a magazine of this type
  if (ubShotsLeft > 0) {
    // handle "stray" ammo - add it to the dealer's stray pile
    pubStrayAmmo = addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex].ubStrayAmmo);
    pubStrayAmmo.value += ubShotsLeft;

    // if dealer has accumulated enough stray ammo to make another full magazine, convert it!
    if (pubStrayAmmo.value >= ubMagCapacity) {
      SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));
      AddItemToArmsDealerInventory(ubArmsDealer, usItemIndex, addressof(SpclItemInfo), (pubStrayAmmo.value / ubMagCapacity));
      pubStrayAmmo.value = pubStrayAmmo.value % ubMagCapacity;
    }
    // I know, I know, this is getting pretty anal...  But what the hell, it was easy enough to do.  ARM.
  }
}

// Use AddObjectToArmsDealerInventory() instead of this when converting a complex item in OBJECTTYPE format.
function AddItemToArmsDealerInventory(ubArmsDealer: UINT8, usItemIndex: UINT16, pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>, ubHowMany: UINT8): void {
  let ubRoomLeft: UINT8;
  let ubElement: UINT8;
  let ubElementsToAdd: UINT8;
  let fFoundOne: boolean;
  let fSuccess: boolean;

  Assert(ubHowMany > 0);

  ubRoomLeft = 255 - gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems;

  if (ubHowMany > ubRoomLeft) {
    // not enough room to store that many, any extras vanish into thin air!
    ubHowMany = ubRoomLeft;
  }

  if (ubHowMany == 0) {
    return;
  }

  // decide whether this item is "special" or not
  if (IsItemInfoSpecial(pSpclItemInfo)) {
    // Anything that's used/damaged or imprinted is store as a special item in the SpecialItem array,
    // exactly one item per element.  We (re)allocate memory dynamically as necessary to hold the additional items.

    do {
      // search for an already allocated, empty element in the special item array
      fFoundOne = false;
      for (ubElement = 0; ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
        if (!(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive)) {
          // Great!  Store it here, then.
          AddSpecialItemToArmsDealerInventoryAtElement(ubArmsDealer, usItemIndex, ubElement, pSpclItemInfo);
          fFoundOne = true;
          break;
        }
      }

      // if we didn't find any inactive elements already allocated
      if (!fFoundOne) {
        // then we're going to have to allocate some more space...
        ubElementsToAdd = Math.max(SPECIAL_ITEMS_ALLOCED_AT_ONCE, ubHowMany);

        // if there aren't any allocated at all right now
        if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced == 0) {
          // allocate new memory for the real buffer
          fSuccess = AllocMemsetSpecialItemArray(addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex]), ubElementsToAdd);
        } else {
          // we have some allocated, but they're all full and we need more.  MemRealloc existing amount + # addition elements
          fSuccess = ResizeSpecialItemArray(addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex]), (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced + ubElementsToAdd));
        }

        if (!fSuccess) {
          return;
        }

        // now add the special item at the first of the newly added elements (still stored in ubElement!)
        AddSpecialItemToArmsDealerInventoryAtElement(ubArmsDealer, usItemIndex, ubElement, pSpclItemInfo);
      }

      // store the # of the element it was placed in globally so anyone who needs that can grab it there
      gubLastSpecialItemAddedAtElement = ubElement;

      ubHowMany--;
    } while (ubHowMany > 0);
  } else // adding perfect item(s)
  {
    // then it's stored as a "perfect" item, simply add it to that counter!
    gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems += ubHowMany;
    // increase total items of this type
    gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems += ubHowMany;
  }
}

function AddSpecialItemToArmsDealerInventoryAtElement(ubArmsDealer: UINT8, usItemIndex: UINT16, ubElement: UINT8, pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>): void {
  Assert(gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems < 255);
  Assert(ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced);
  Assert(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive == false);
  Assert(IsItemInfoSpecial(pSpclItemInfo));

  // Store the special values in that element, and make it active
  gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive = true;

  memcpy(addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].Info), pSpclItemInfo, sizeof(SPECIAL_ITEM_INFO));

  // increase the total items
  gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems++;
}

// removes ubHowMany items of usItemIndex with the matching Info from dealer ubArmsDealer
export function RemoveItemFromArmsDealerInventory(ubArmsDealer: UINT8, usItemIndex: UINT16, pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>, ubHowMany: UINT8): void {
  let pSpecialItem: Pointer<DEALER_SPECIAL_ITEM>;
  let ubElement: UINT8;

  Assert(ubHowMany <= gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems);

  if (ubHowMany == 0) {
    return;
  }

  // decide whether this item is "special" or not
  if (IsItemInfoSpecial(pSpclItemInfo)) {
    // look through the elements, trying to find special items matching the specifications
    for (ubElement = 0; ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
      pSpecialItem = addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement]);

      // if this element is in use
      if (pSpecialItem.value.fActive) {
        // and its contents are exactly what we're looking for
        if (memcmp(addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].Info), pSpclItemInfo, sizeof(SPECIAL_ITEM_INFO)) == 0) {
          // Got one!  Remove it
          RemoveSpecialItemFromArmsDealerInventoryAtElement(ubArmsDealer, usItemIndex, ubElement);

          ubHowMany--;
          if (ubHowMany == 0) {
            break;
          }
        }
      }
    }

    // when we've searched all the special item elements, we'd better not have any more items to remove!
    Assert(ubHowMany == 0);
  } else // removing perfect item(s)
  {
    // then it's stored as a "perfect" item, simply subtract from tha counter!
    Assert(ubHowMany <= gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems);
    gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems -= ubHowMany;
    // decrease total items of this type
    gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems -= ubHowMany;
  }
}

function RemoveRandomItemFromArmsDealerInventory(ubArmsDealer: UINT8, usItemIndex: UINT16, ubHowMany: UINT8): void {
  let ubWhichOne: UINT8;
  let ubSkippedAlready: UINT8;
  let fFoundIt: boolean;
  let ubElement: UINT8;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  // not permitted for repair dealers - would take extra code to subtract items under repair from ubTotalItems!!!
  Assert(!DoesDealerDoRepairs(ubArmsDealer));
  // Can't remove any items in for repair, though!
  Assert(ubHowMany <= gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems);

  while (ubHowMany > 0) {
    // pick a random one to get rid of
    ubWhichOne = Random(gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems);

    // if we picked one of the perfect ones...
    if (ubWhichOne < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems) {
      // create item info describing a perfect item
      SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));
      // then that's easy, its condition is 100, so remove one of those
      RemoveItemFromArmsDealerInventory(ubArmsDealer, usItemIndex, addressof(SpclItemInfo), 1);
    } else {
      // Yikes!  Gotta look through the special items.  We already know it's not any of the perfect ones, subtract those
      ubWhichOne -= gArmsDealersInventory[ubArmsDealer][usItemIndex].ubPerfectItems;
      ubSkippedAlready = 0;

      fFoundIt = false;

      for (ubElement = 0; ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
        // if this is an active special item, not in repair
        if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive) // &&
        //					 ( gArmsDealersInventory[ ubArmsDealer ][ usItemIndex ].SpecialItem[ ubElement ].Info.bItemCondition > 0 ) )
        {
          // if we skipped the right amount of them
          if (ubSkippedAlready == ubWhichOne) {
            // then this one is it!  That's the one we're gonna remove
            RemoveSpecialItemFromArmsDealerInventoryAtElement(ubArmsDealer, usItemIndex, ubElement);
            fFoundIt = true;
            break;
          } else {
            // keep looking...
            ubSkippedAlready++;
          }
        }
      }

      // this HAS to work, or the data structure is corrupt!
      Assert(fFoundIt);
    }

    ubHowMany--;
  }
}

export function RemoveSpecialItemFromArmsDealerInventoryAtElement(ubArmsDealer: UINT8, usItemIndex: UINT16, ubElement: UINT8): void {
  Assert(gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems > 0);
  Assert(ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced);
  Assert(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive == true);

  // wipe it out (turning off fActive)
  memset(addressof(gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement]), 0, sizeof(DEALER_SPECIAL_ITEM));

  // one fewer item remains...
  gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems--;
}

export function AddDeadArmsDealerItemsToWorld(ubMercID: UINT8): boolean {
  let bArmsDealer: INT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usItemIndex: UINT16;
  let ubElement: UINT8;
  let ubHowManyMaxAtATime: UINT8;
  let ubLeftToDrop: UINT8;
  let ubNowDropping: UINT8;
  let TempObject: OBJECTTYPE;
  let pSpecialItem: Pointer<DEALER_SPECIAL_ITEM>;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  // Get Dealer ID from from merc Id
  bArmsDealer = GetArmsDealerIDFromMercID(ubMercID);
  if (bArmsDealer == -1) {
    // not a dealer, that's ok, we get called for every dude that croaks.
    return false;
  }

  // mark the dealer as being out of business!
  gArmsDealerStatus[bArmsDealer].fOutOfBusiness = true;

  // Get a pointer to the dealer
  pSoldier = FindSoldierByProfileID(ubMercID, false);
  if (pSoldier == null) {
    // This should never happen, a dealer getting knocked off without the sector being loaded, should it?
    // If it's possible, we should modify code below to dump his belongings into the sector without using pSoldier->sGridNo
    Assert(0);
    return false;
  }

  // loop through all the items in the dealer's inventory, and drop them all where the dealer was set up.

  for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    // if the dealer has any items of this type
    if (gArmsDealersInventory[bArmsDealer][usItemIndex].ubTotalItems > 0) {
      // if he has any perfect items of this time
      if (gArmsDealersInventory[bArmsDealer][usItemIndex].ubPerfectItems > 0) {
        // drop all the perfect items first

        // drop stackable items like ammo in stacks of whatever will fit into a large pocket instead of one at a time
        ubHowManyMaxAtATime = ItemSlotLimit(usItemIndex, Enum261.BIGPOCK1POS);
        if (ubHowManyMaxAtATime < 1) {
          ubHowManyMaxAtATime = 1;
        }

        // create item info describing a perfect item
        SetSpecialItemInfoToDefaults(addressof(SpclItemInfo));

        ubLeftToDrop = gArmsDealersInventory[bArmsDealer][usItemIndex].ubPerfectItems;

        // ATE: While it IS leagal here to use pSoldier->sInitialGridNo, cause of where this
        // function is called, there are times when we're not guarenteed that sGridNo is good
        while (ubLeftToDrop > 0) {
          ubNowDropping = Math.min(ubLeftToDrop, ubHowManyMaxAtATime);

          MakeObjectOutOfDealerItems(usItemIndex, addressof(SpclItemInfo), addressof(TempObject), ubNowDropping);
          AddItemToPool(pSoldier.value.sInitialGridNo, addressof(TempObject), INVISIBLE, 0, 0, 0);

          ubLeftToDrop -= ubNowDropping;
        }

        // remove them all from his inventory
        RemoveItemFromArmsDealerInventory(bArmsDealer, usItemIndex, addressof(SpclItemInfo), gArmsDealersInventory[bArmsDealer][usItemIndex].ubPerfectItems);
      }

      // then drop all the special items
      for (ubElement = 0; ubElement < gArmsDealersInventory[bArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
        pSpecialItem = addressof(gArmsDealersInventory[bArmsDealer][usItemIndex].SpecialItem[ubElement]);

        if (pSpecialItem.value.fActive) {
          MakeObjectOutOfDealerItems(usItemIndex, addressof(pSpecialItem.value.Info), addressof(TempObject), 1);
          AddItemToPool(pSoldier.value.sInitialGridNo, addressof(TempObject), INVISIBLE, 0, 0, 0);
          RemoveItemFromArmsDealerInventory(bArmsDealer, usItemIndex, addressof(pSpecialItem.value.Info), 1);
        }
      }

      // release any memory allocated for special items, he won't need it now...
      if (gArmsDealersInventory[bArmsDealer][usItemIndex].ubElementsAlloced > 0) {
        FreeSpecialItemArray(addressof(gArmsDealersInventory[bArmsDealer][usItemIndex]));
      }
    }
  }

  // if the dealer has money
  if (gArmsDealerStatus[bArmsDealer].uiArmsDealersCash > 0) {
    // Create the object
    memset(addressof(TempObject), 0, sizeof(OBJECTTYPE));
    if (!CreateMoney(gArmsDealerStatus[bArmsDealer].uiArmsDealersCash, addressof(TempObject))) {
      return false;
    }

    // add the money item to the dealers feet
    AddItemToPool(pSoldier.value.sInitialGridNo, addressof(TempObject), INVISIBLE, 0, 0, 0);

    gArmsDealerStatus[bArmsDealer].uiArmsDealersCash = 0;
  }

  return true;
}

export function MakeObjectOutOfDealerItems(usItemIndex: UINT16, pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>, pObject: Pointer<OBJECTTYPE>, ubHowMany: UINT8): void {
  let bItemCondition: INT8;
  let ubCnt: UINT8;

  bItemCondition = pSpclItemInfo.value.bItemCondition;

  // if the item condition is below 0, the item is in for repairs, so flip the sign
  if (bItemCondition < 0) {
    bItemCondition *= -1;
  }

  memset(pObject, 0, sizeof(OBJECTTYPE));

  // Create the item object
  CreateItems(usItemIndex, bItemCondition, ubHowMany, pObject);

  // set the ImprintID
  pObject.value.ubImprintID = pSpclItemInfo.value.ubImprintID;

  // add any attachments we've been storing
  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pSpclItemInfo.value.usAttachment[ubCnt] != Enum225.NONE) {
      // store what it is, and its condition
      pObject.value.usAttachItem[ubCnt] = pSpclItemInfo.value.usAttachment[ubCnt];
      pObject.value.bAttachStatus[ubCnt] = pSpclItemInfo.value.bAttachmentStatus[ubCnt];
    }
  }

  // if it's a gun
  if (Item[pObject.value.usItem].usItemClass == IC_GUN) {
    // Empty out the bullets put in by CreateItem().  We now sell all guns empty of bullets.  This is so that we don't
    // have to keep track of #bullets in a gun throughout dealer inventory.  Without this, players could "reload" guns
    // they don't have ammo for by selling them to Tony & buying them right back fully loaded!  One could repeat this
    // ad nauseum (empty the gun between visits) as a (really expensive) way to get unlimited special ammo like rockets.
    pObject.value.ubGunShotsLeft = 0;
  }
}

export function GiveObjectToArmsDealerForRepair(ubArmsDealer: UINT8, pObject: Pointer<OBJECTTYPE>, ubOwnerProfileId: UINT8): void {
  //	UINT8 ubCnt;
  let SpclItemInfo: SPECIAL_ITEM_INFO;

  Assert(DoesDealerDoRepairs(ubArmsDealer));

  // Any object passed into here must already be:
  //		a) Unstacked
  Assert(pObject.value.ubNumberOfObjects == 1);

  //		b) Repairable
  Assert(CanDealerRepairItem(ubArmsDealer, pObject.value.usItem));

  //		c) Actually damaged, or a rocket rifle (being reset)
  Assert((pObject.value.bStatus[0] < 100) || ItemIsARocketRifle(pObject.value.usItem));

  /* ARM: Can now repair with removeable attachments still attached...
          //		d) Already stripped of all *detachable* attachments
          for( ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++ )
          {
                  if ( pObject->usAttachItem[ ubCnt ] != NONE )
                  {
                          // If the attachment is detachable
                          if (! (Item[ pObject->usAttachItem[ubCnt] ].fFlags & ITEM_INSEPARABLE ) )
                          {
                                  Assert( 0 );
                          }
                  }
          }
  */

  //		e) If a gun, stripped of any non-ammo-class GunAmmoItems, and bullets
  if (Item[pObject.value.usItem].usItemClass == IC_GUN) {
    // if any GunAmmoItem is specified
    if (pObject.value.usGunAmmoItem != Enum225.NONE) {
      // it better be regular ammo, and empty
      Assert(Item[pObject.value.usGunAmmoItem].usItemClass == IC_AMMO);
      Assert(pObject.value.ubGunShotsLeft == 0);
    }
  }

  SetSpecialItemInfoFromObject(addressof(SpclItemInfo), pObject);

  // ok, given all that, now everything is easy!
  // if the gun was jammed, this will forget about the jam (i.e. dealer immediately unjams anything he will be repairing)
  GiveItemToArmsDealerforRepair(ubArmsDealer, pObject.value.usItem, addressof(SpclItemInfo), ubOwnerProfileId);
}

// PLEASE: Use GiveObjectToArmsDealerForRepair() instead of this when repairing a item in OBJECTTYPE format.
function GiveItemToArmsDealerforRepair(ubArmsDealer: UINT8, usItemIndex: UINT16, pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>, ubOwnerProfileId: UINT8): void {
  let uiTimeWhenFreeToStartIt: UINT32;
  let uiMinutesToFix: UINT32;
  let uiMinutesShopClosedBeforeItsDone: UINT32;
  let uiDoneWhen: UINT32;

  Assert(DoesDealerDoRepairs(ubArmsDealer));
  Assert(pSpclItemInfo.value.bItemCondition > 0);
  Assert((pSpclItemInfo.value.bItemCondition < 100) || ItemIsARocketRifle(usItemIndex));

  // figure out the earliest the repairman will be free to start repairing this item
  uiTimeWhenFreeToStartIt = WhenWillRepairmanBeAllDoneRepairing(ubArmsDealer);

  // Determine how long it will take to fix
  uiMinutesToFix = CalculateSpecialItemRepairTime(ubArmsDealer, usItemIndex, pSpclItemInfo);

  uiMinutesShopClosedBeforeItsDone = CalculateOvernightRepairDelay(ubArmsDealer, uiTimeWhenFreeToStartIt, uiMinutesToFix);

  // clock time when this will finally be ready
  uiDoneWhen = uiTimeWhenFreeToStartIt + uiMinutesToFix + uiMinutesShopClosedBeforeItsDone;

  // Negate the status
  pSpclItemInfo.value.bItemCondition *= -1;

  // give it to the dealer
  AddItemToArmsDealerInventory(ubArmsDealer, usItemIndex, pSpclItemInfo, 1);

  // Set the time at which item will be fixed
  gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[gubLastSpecialItemAddedAtElement].uiRepairDoneTime = uiDoneWhen;
  // Remember the original owner of the item
  gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[gubLastSpecialItemAddedAtElement].ubOwnerProfileId = ubOwnerProfileId;
}

function WhenWillRepairmanBeAllDoneRepairing(ubArmsDealer: UINT8): UINT32 {
  let uiWhenFree: UINT32;
  let usItemIndex: UINT16;
  let ubElement: UINT8;

  Assert(DoesDealerDoRepairs(ubArmsDealer));

  // if nothing is in for repairs, he'll be free RIGHT NOW!
  uiWhenFree = GetWorldTotalMin();

  // loop through the dealers inventory
  for (usItemIndex = 1; usItemIndex < Enum225.MAXITEMS; usItemIndex++) {
    // if there is some items in stock
    if (gArmsDealersInventory[ubArmsDealer][usItemIndex].ubTotalItems > 0) {
      for (ubElement = 0; ubElement < gArmsDealersInventory[ubArmsDealer][usItemIndex].ubElementsAlloced; ubElement++) {
        if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].fActive) {
          // if the item is in for repairs
          if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].Info.bItemCondition < 0) {
            // if this item will be done later than the latest we've found so far
            if (gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].uiRepairDoneTime > uiWhenFree) {
              // then we're busy til then!
              uiWhenFree = gArmsDealersInventory[ubArmsDealer][usItemIndex].SpecialItem[ubElement].uiRepairDoneTime;
            }
          }
        }
      }
    }
  }

  return uiWhenFree;
}

function CalculateSpecialItemRepairTime(ubArmsDealer: UINT8, usItemIndex: UINT16, pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>): UINT32 {
  let uiRepairTime: UINT32;
  let ubCnt: UINT8;

  uiRepairTime = CalculateSimpleItemRepairTime(ubArmsDealer, usItemIndex, pSpclItemInfo.value.bItemCondition);

  // add time to repair any attachments on it
  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pSpclItemInfo.value.usAttachment[ubCnt] != Enum225.NONE) {
      // if damaged and repairable
      if ((pSpclItemInfo.value.bAttachmentStatus[ubCnt] < 100) && CanDealerRepairItem(ubArmsDealer, pSpclItemInfo.value.usAttachment[ubCnt])) {
        uiRepairTime += CalculateSimpleItemRepairTime(ubArmsDealer, pSpclItemInfo.value.usAttachment[ubCnt], pSpclItemInfo.value.bAttachmentStatus[ubCnt]);
      }
    }
  }

  return uiRepairTime;
}

export function CalculateObjectItemRepairTime(ubArmsDealer: UINT8, pItemObject: Pointer<OBJECTTYPE>): UINT32 {
  let uiRepairTime: UINT32;
  let ubCnt: UINT8;

  uiRepairTime = CalculateSimpleItemRepairTime(ubArmsDealer, pItemObject.value.usItem, pItemObject.value.bStatus[0]);

  // add time to repair any attachments on it
  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pItemObject.value.usAttachItem[ubCnt] != Enum225.NONE) {
      // if damaged and repairable
      if ((pItemObject.value.bAttachStatus[ubCnt] < 100) && CanDealerRepairItem(ubArmsDealer, pItemObject.value.usAttachItem[ubCnt])) {
        uiRepairTime += CalculateSimpleItemRepairTime(ubArmsDealer, pItemObject.value.usAttachItem[ubCnt], pItemObject.value.bAttachStatus[ubCnt]);
      }
    }
  }

  return uiRepairTime;
}

function CalculateSimpleItemRepairTime(ubArmsDealer: UINT8, usItemIndex: UINT16, bItemCondition: INT8): UINT32 {
  let uiTimeToRepair: UINT32 = 0;
  let uiRepairCost: UINT32 = 0;

  Assert(DoesDealerDoRepairs(ubArmsDealer));

  // first calc what he'll charge - that takes care of item condition, repair ease, and his repair cost "markup"
  uiRepairCost = CalculateSimpleItemRepairCost(ubArmsDealer, usItemIndex, bItemCondition);

  // Now adjust that for the repairman's individual repair speed.
  // For a repairman, his BUY modifier controls his REPAIR SPEED (1.0 means minutes to repair = price in $)
  // with a REPAIR SPEED of 1.0, typical gun price of $2000, and a REPAIR COST of 0.5 this works out to 16.6 hrs
  //		 for a full 100% status repair...  Not bad.
  uiTimeToRepair = (uiRepairCost * ArmsDealerInfo[ubArmsDealer].dRepairSpeed);

  // repairs on electronic items take twice as long if the guy doesn't have the skill
  // for dealers, this means anyone but Fredo the Electronics guy takes twice as long (but doesn't charge double)
  // (Mind you, current he's the ONLY one who CAN repair Electronics at all!  Oh well.)
  if ((Item[usItemIndex].fFlags & ITEM_ELECTRONIC) && (ubArmsDealer != Enum197.ARMS_DEALER_FREDO)) {
    uiTimeToRepair *= 2;
  }

  // avoid "instant" repairs on really cheap, barely damaged crap...
  if (uiTimeToRepair < MIN_REPAIR_TIME_IN_MINUTES) {
    uiTimeToRepair = MIN_REPAIR_TIME_IN_MINUTES;
  }

  return uiTimeToRepair;
}

function CalculateSpecialItemRepairCost(ubArmsDealer: UINT8, usItemIndex: UINT16, pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>): UINT32 {
  let uiRepairCost: UINT32;
  let ubCnt: UINT8;

  uiRepairCost = CalculateSimpleItemRepairCost(ubArmsDealer, usItemIndex, pSpclItemInfo.value.bItemCondition);

  // add cost of repairing any attachments on it
  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pSpclItemInfo.value.usAttachment[ubCnt] != Enum225.NONE) {
      // if damaged and repairable
      if ((pSpclItemInfo.value.bAttachmentStatus[ubCnt] < 100) && CanDealerRepairItem(ubArmsDealer, pSpclItemInfo.value.usAttachment[ubCnt])) {
        uiRepairCost += CalculateSimpleItemRepairCost(ubArmsDealer, pSpclItemInfo.value.usAttachment[ubCnt], pSpclItemInfo.value.bAttachmentStatus[ubCnt]);
      }
    }
  }

  return uiRepairCost;
}

export function CalculateObjectItemRepairCost(ubArmsDealer: UINT8, pItemObject: Pointer<OBJECTTYPE>): UINT32 {
  let uiRepairCost: UINT32;
  let ubCnt: UINT8;

  uiRepairCost = CalculateSimpleItemRepairCost(ubArmsDealer, pItemObject.value.usItem, pItemObject.value.bStatus[0]);

  // add cost of repairing any attachments on it
  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pItemObject.value.usAttachItem[ubCnt] != Enum225.NONE) {
      // if damaged and repairable
      if ((pItemObject.value.bAttachStatus[ubCnt] < 100) && CanDealerRepairItem(ubArmsDealer, pItemObject.value.usAttachItem[ubCnt])) {
        uiRepairCost += CalculateSimpleItemRepairCost(ubArmsDealer, pItemObject.value.usAttachItem[ubCnt], pItemObject.value.bAttachStatus[ubCnt]);
      }
    }
  }

  return uiRepairCost;
}

function CalculateSimpleItemRepairCost(ubArmsDealer: UINT8, usItemIndex: UINT16, bItemCondition: INT8): UINT32 {
  let uiItemCost: UINT32 = 0;
  let uiRepairCost: UINT32 = 0;
  let sRepairCostAdj: INT16 = 0;
  //	UINT32	uiDifFrom10=0;

  // figure out the full value of the item, modified by this dealer's personal Sell (i.e. repair cost) modifier
  // don't use CalcShopKeeperItemPrice - we want FULL value!!!
  uiItemCost = ((Item[usItemIndex].usPrice * ArmsDealerInfo[ubArmsDealer].dRepairCost));

  // get item's repair ease, for each + point is 10% easier, each - point is 10% harder to repair
  sRepairCostAdj = 100 - (10 * Item[usItemIndex].bRepairEase);

  // make sure it ain't somehow gone too low!
  if (sRepairCostAdj < 10) {
    sRepairCostAdj = 10;
  }

  // calculate repair cost, the more broken it is the more it costs, and the difficulty of repair it is also a factor
  uiRepairCost = (uiItemCost * (sRepairCostAdj * (100 - bItemCondition) / (100 * 100)));

  /*
          //if the price is not diviseble by 10, make it so
          uiDifFrom10 = 10 - uiRepairCost % 10;
          if( uiDifFrom10 != 0 )
          {
                  uiRepairCost += uiDifFrom10;
          }
  */

  if (ItemIsARocketRifle(usItemIndex)) {
    // resetting imprinting for a rocket rifle costs something extra even if rifle is at 100%
    uiRepairCost += 100;
  }

  // anything repairable has to have a minimum price
  if (uiRepairCost < MIN_REPAIR_COST) {
    uiRepairCost = MIN_REPAIR_COST;
  }

  return uiRepairCost;
}

export function SetSpecialItemInfoToDefaults(pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>): void {
  let ubCnt: UINT8;

  memset(pSpclItemInfo, 0, sizeof(SPECIAL_ITEM_INFO));

  pSpclItemInfo.value.bItemCondition = 100;
  pSpclItemInfo.value.ubImprintID = NO_PROFILE;

  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    pSpclItemInfo.value.usAttachment[ubCnt] = Enum225.NONE;
    pSpclItemInfo.value.bAttachmentStatus[ubCnt] = 0;
  }
}

export function SetSpecialItemInfoFromObject(pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>, pObject: Pointer<OBJECTTYPE>): void {
  let ubCnt: UINT8;

  memset(pSpclItemInfo, 0, sizeof(SPECIAL_ITEM_INFO));

  if (Item[pObject.value.usItem].usItemClass == IC_AMMO) {
    // ammo condition is always 100, don't use status, which holds the #bullets
    pSpclItemInfo.value.bItemCondition = 100;
  } else {
    pSpclItemInfo.value.bItemCondition = pObject.value.bStatus[0];
  }

  // only guns currently have imprintID properly initialized...
  if (Item[pObject.value.usItem].usItemClass == IC_GUN) {
    pSpclItemInfo.value.ubImprintID = pObject.value.ubImprintID;
  } else {
    // override garbage imprintIDs (generally 0) for non-guns
    pSpclItemInfo.value.ubImprintID = NO_PROFILE;
  }

  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pObject.value.usAttachItem[ubCnt] != Enum225.NONE) {
      // store what it is
      pSpclItemInfo.value.usAttachment[ubCnt] = pObject.value.usAttachItem[ubCnt];
      pSpclItemInfo.value.bAttachmentStatus[ubCnt] = pObject.value.bAttachStatus[ubCnt];
    } else {
      pSpclItemInfo.value.usAttachment[ubCnt] = Enum225.NONE;
      pSpclItemInfo.value.bAttachmentStatus[ubCnt] = 0;
    }
  }
}

function IsItemInfoSpecial(pSpclItemInfo: Pointer<SPECIAL_ITEM_INFO>): boolean {
  let ubCnt: UINT8;

  // being damaged / in repairs makes an item special
  if (pSpclItemInfo.value.bItemCondition != 100) {
    return true;
  }

  // being imprinted makes an item special
  if (pSpclItemInfo.value.ubImprintID != NO_PROFILE) {
    return true;
  }

  // having an attachment makes an item special
  for (ubCnt = 0; ubCnt < MAX_ATTACHMENTS; ubCnt++) {
    if (pSpclItemInfo.value.usAttachment[ubCnt] != Enum225.NONE) {
      return true;
    }
  }

  // otherwise, it's just a "perfect" item, nothing special about it
  return false;
}

function DoesItemAppearInDealerInventoryList(ubArmsDealer: UINT8, usItemIndex: UINT16, fPurchaseFromPlayer: boolean): boolean {
  let pDealerInv: Pointer<DEALER_POSSIBLE_INV> = null;
  let usCnt: UINT16;

  // the others will buy only things that appear in their own "for sale" inventory lists
  pDealerInv = GetPointerToDealersPossibleInventory(ubArmsDealer);
  Assert(pDealerInv != null);

  // loop through the dealers' possible inventory and see if the item exists there
  usCnt = 0;
  while (pDealerInv[usCnt].sItemIndex != LAST_DEALER_ITEM) {
    // if the initial dealer inv contains the required item, the dealer can sell the item
    if (pDealerInv[usCnt].sItemIndex == usItemIndex) {
      // if optimal quantity listed is 0, it means dealer won't sell it himself, but will buy it from the player!
      if ((pDealerInv[usCnt].ubOptimalNumber > 0) || fPurchaseFromPlayer) {
        return true;
      }
    }

    usCnt++;
  }

  return false;
}

export function CalcValueOfItemToDealer(ubArmsDealer: UINT8, usItemIndex: UINT16, fDealerSelling: boolean): UINT16 {
  let usBasePrice: UINT16;
  let ubItemPriceClass: UINT8;
  let ubDealerPriceClass: UINT8;
  let usValueToThisDealer: UINT16;

  usBasePrice = Item[usItemIndex].usPrice;

  if (usBasePrice == 0) {
    // worthless to any dealer
    return 0;
  }

  // figure out the price class this dealer prefers
  switch (ubArmsDealer) {
    case Enum197.ARMS_DEALER_JAKE:
      ubDealerPriceClass = PRICE_CLASS_JUNK;
      break;
    case Enum197.ARMS_DEALER_KEITH:
      ubDealerPriceClass = PRICE_CLASS_CHEAP;
      break;
    case Enum197.ARMS_DEALER_FRANZ:
      ubDealerPriceClass = PRICE_CLASS_EXPENSIVE;
      break;

    // other dealers don't use this system
    default:
      if (DoesItemAppearInDealerInventoryList(ubArmsDealer, usItemIndex, true)) {
        return usBasePrice;
      } else {
        return 0;
      }
  }

  // the rest of this function applies only to the "general" dealers ( Jake, Keith, and Franz )

  // Micky & Gabby specialize in creature parts & such, the others don't buy these at all (exception: jars)
  if ((usItemIndex != Enum225.JAR) && (DoesItemAppearInDealerInventoryList(Enum197.ARMS_DEALER_MICKY, usItemIndex, true) || DoesItemAppearInDealerInventoryList(Enum197.ARMS_DEALER_GABBY, usItemIndex, true))) {
    return 0;
  }

  if ((ubArmsDealer == Enum197.ARMS_DEALER_KEITH) && (Item[usItemIndex].usItemClass & (IC_GUN | IC_LAUNCHER))) {
    // Keith won't buy guns until the Hillbillies are vanquished
    if (CheckFact(Enum170.FACT_HILLBILLIES_KILLED, Enum268.KEITH) == false) {
      return 0;
    }
  }

  // figure out which price class it belongs to
  if (usBasePrice < 100) {
    ubItemPriceClass = PRICE_CLASS_JUNK;
  } else if (usBasePrice < 1000) {
    ubItemPriceClass = PRICE_CLASS_CHEAP;
  } else {
    ubItemPriceClass = PRICE_CLASS_EXPENSIVE;
  }

  if (!fDealerSelling) {
    // junk dealer won't buy expensive stuff at all, expensive dealer won't buy junk at all
    if (Math.abs(ubDealerPriceClass - ubItemPriceClass) == 2) {
      return 0;
    }
  }

  // start with the base price
  usValueToThisDealer = usBasePrice;

  // if it's out of their preferred price class
  if (ubDealerPriceClass != ubItemPriceClass) {
    // exception: Gas (Jake's)
    if (usItemIndex != Enum225.GAS_CAN) {
      // they pay only 1/3 of true value!
      usValueToThisDealer /= 3;
    }
  }

  // Tony specializes in guns, weapons, and ammo, so make others pay much less for that kind of stuff
  if (DoesItemAppearInDealerInventoryList(Enum197.ARMS_DEALER_TONY, usItemIndex, true)) {
    // others pay only 1/2 of that value!
    usValueToThisDealer /= 2;
  }

  // minimum bet $1 !
  if (usValueToThisDealer == 0) {
    usValueToThisDealer = 1;
  }

  return usValueToThisDealer;
}

// this only exists to support saves made with game versions < 54 or 55!
function LoadIncompleteArmsDealersStatus(hFile: HWFILE, fIncludesElgin: boolean, fIncludesManny: boolean): boolean {
  let uiDealersSaved: UINT32;
  let uiNumBytesRead: UINT32;

  Assert(!fIncludesElgin || !fIncludesManny);

  if (!fIncludesElgin) {
    // read 2 fewer element without Elgin or Manny in there...
    uiDealersSaved = Enum197.NUM_ARMS_DEALERS - 2;
  } else {
    // read one fewer element without Elgin in there...
    uiDealersSaved = Enum197.NUM_ARMS_DEALERS - 1;
  }

  // read in all other dealer's status
  if (!FileRead(hFile, gArmsDealerStatus, uiDealersSaved * sizeof(ARMS_DEALER_STATUS), addressof(uiNumBytesRead))) {
    return false;
  }

  // read in all other dealer's inventory
  if (!FileRead(hFile, gArmsDealersInventory, uiDealersSaved * sizeof(DEALER_ITEM_HEADER) * Enum225.MAXITEMS, addressof(uiNumBytesRead))) {
    return false;
  }

  if (!fIncludesElgin) {
    // initialize Elgin now...
    InitializeOneArmsDealer(Enum197.ARMS_DEALER_ELGIN);
  }

  if (!fIncludesManny) {
    // initialize Manny now...
    InitializeOneArmsDealer(Enum197.ARMS_DEALER_MANNY);
  }

  return true;
}

export function DealerItemIsSafeToStack(usItemIndex: UINT16): boolean {
  // basically any item type with nothing unique about it besides its status can be stacked in dealer's inventory boxes...
  // NOTE: This test is only applied to items already KNOWN to be perfect - special items are obviously not-stackable

  if (Item[usItemIndex].usItemClass == IC_GUN) {
    return false;
  }

  /*
          if ( ItemSlotLimit( usItemIndex, BIGPOCK1POS ) > 1 )
          {
                  return( TRUE );
          }
  */

  return true;
}

function GuaranteeMinimumAlcohol(ubArmsDealer: UINT8): void {
  GuaranteeAtLeastXItemsOfIndex(ubArmsDealer, Enum225.BEER, (GetDealersMaxItemAmount(ubArmsDealer, Enum225.BEER) / 3));
  GuaranteeAtLeastXItemsOfIndex(ubArmsDealer, Enum225.WINE, (GetDealersMaxItemAmount(ubArmsDealer, Enum225.WINE) / 3));
  GuaranteeAtLeastXItemsOfIndex(ubArmsDealer, Enum225.ALCOHOL, (GetDealersMaxItemAmount(ubArmsDealer, Enum225.ALCOHOL) / 3));
}

export function ItemIsARocketRifle(sItemIndex: INT16): boolean {
  if ((sItemIndex == Enum225.ROCKET_RIFLE) || (sItemIndex == Enum225.AUTO_ROCKET_RIFLE)) {
    return true;
  } else {
    return false;
  }
}

function GetArmsDealerShopHours(ubArmsDealer: UINT8, puiOpeningTime: Pointer<UINT32>, puiClosingTime: Pointer<UINT32>): boolean {
  let pSoldier: Pointer<SOLDIERTYPE>;

  pSoldier = FindSoldierByProfileID(ArmsDealerInfo[ubArmsDealer].ubShopKeeperID, false);
  if (pSoldier == null) {
    return false;
  }

  if (ExtractScheduleDoorLockAndUnlockInfo(pSoldier, puiOpeningTime, puiClosingTime) == false) {
    return false;
  }

  Assert(puiOpeningTime.value < puiClosingTime.value);

  return true;
}

export function CalculateOvernightRepairDelay(ubArmsDealer: UINT8, uiTimeWhenFreeToStartIt: UINT32, uiMinutesToFix: UINT32): UINT32 {
  let uiOpeningTime: UINT32;
  let uiClosingTime: UINT32;
  let uiMinutesClosedOvernight: UINT32;
  let uiDelayInDays: UINT32 = 0;
  let uiDoneToday: UINT32;

  Assert(uiMinutesToFix > 0);

  // convert world time into 24hr military time for the day he's gonna start on it
  uiTimeWhenFreeToStartIt = uiTimeWhenFreeToStartIt % NUM_MIN_IN_DAY;

  if (GetArmsDealerShopHours(ubArmsDealer, addressof(uiOpeningTime), addressof(uiClosingTime)) == false) {
    return 0;
  }

  // if it won't get done by the end of a day
  while ((uiTimeWhenFreeToStartIt + uiMinutesToFix) > uiClosingTime) {
    // this is to handle existing saves with overnight repairs
    if (uiTimeWhenFreeToStartIt < uiClosingTime) {
      // he gets this much done before closing
      uiDoneToday = uiClosingTime - uiTimeWhenFreeToStartIt;
      // subtract how much he got done
      uiMinutesToFix -= uiDoneToday;
      Assert(uiMinutesToFix > 0);
    }

    // he starts back at it first thing in the morning
    uiTimeWhenFreeToStartIt = uiOpeningTime;
    uiDelayInDays++;
  }

  uiMinutesClosedOvernight = NUM_MIN_IN_DAY - (uiClosingTime - uiOpeningTime);

  return uiDelayInDays * uiMinutesClosedOvernight;
}

export function CalculateMinutesClosedBetween(ubArmsDealer: UINT8, uiStartTime: UINT32, uiEndTime: UINT32): UINT32 {
  let uiOpeningTime: UINT32;
  let uiClosingTime: UINT32;
  let uiMinutesClosedOvernight: UINT32;
  let uiDaysDifference: UINT32 = 0;
  let uiMinutesClosed: UINT32 = 0;

  Assert(uiStartTime <= uiEndTime);

  if (GetArmsDealerShopHours(ubArmsDealer, addressof(uiOpeningTime), addressof(uiClosingTime)) == false) {
    return 0;
  }

  uiMinutesClosedOvernight = NUM_MIN_IN_DAY - (uiClosingTime - uiOpeningTime);

  // NOTE: this assumes stored are only closed overnight, so all we have to do is compare the day portion
  uiDaysDifference = (uiEndTime / NUM_MIN_IN_DAY) - (uiStartTime / NUM_MIN_IN_DAY);

  if (uiDaysDifference >= 2) {
    // close for 1 less than that many full nights...
    uiMinutesClosed = (uiDaysDifference - 1) * uiMinutesClosedOvernight;
  }

  // add partial day's closing

  // convert start and end times into 24hr military time
  uiStartTime = uiStartTime % NUM_MIN_IN_DAY;
  uiEndTime = uiEndTime % NUM_MIN_IN_DAY;

  // treat end time of midnight as 24:00 hours to prevent indefinite recursion and make formulas work
  if (uiEndTime == 0) {
    uiEndTime = NUM_MIN_IN_DAY;
  }

  if (uiStartTime == uiEndTime) {
    if (uiDaysDifference == 0) {
      return 0;
    } else {
      uiMinutesClosed += uiMinutesClosedOvernight;
    }
  }
  if (uiStartTime < uiEndTime) {
    if (uiStartTime < uiOpeningTime) {
      // add how many minutes in the time range BEFORE the store opened that day
      uiMinutesClosed += (Math.min(uiOpeningTime, uiEndTime) - uiStartTime);
    }

    if (uiEndTime > uiClosingTime) {
      // add how many minutes in the time range AFTER the store closed that day
      uiMinutesClosed += (uiEndTime - Math.max(uiClosingTime, uiStartTime));
    }
  } else {
    Assert(uiEndTime < uiStartTime);

    // recursive calls!  Add two separate times: before midnight, and after midnight
    uiMinutesClosed += CalculateMinutesClosedBetween(ubArmsDealer, uiStartTime, NUM_MIN_IN_DAY);
    uiMinutesClosed += CalculateMinutesClosedBetween(ubArmsDealer, 0, uiEndTime);
  }

  return uiMinutesClosed;
}

}
