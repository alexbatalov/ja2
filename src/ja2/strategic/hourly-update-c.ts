function HandleMinuteUpdate(): void {
}

// This function gets called every hour, on the hour.
// It spawns the handling of all sorts of stuff:
// Morale changes, assignment progress, town loyalties, etc.

function HandleHourlyUpdate(): void {
  // if the game hasnt even started yet ( we havent arrived in the sector ) dont process this
  if (DidGameJustStart())
    return;

  // hourly update of town loyalty
  HandleTownLoyalty();

  // hourly update of team assignments
  UpdateAssignments();

  // hourly update of hated/liked mercs
  UpdateBuddyAndHatedCounters();

  // update morale!
  HourlyMoraleUpdate();

  // degrade camouflage
  HourlyCamouflageUpdate();

  // check mines for monster infestation/extermination
  HourlyMinesUpdate();

  // check how well the player is doing right now
  HourlyProgressUpdate();

  // do any quest stuff necessary
  HourlyQuestUpdate();

  HourlyLarryUpdate();

  HourlyCheckIfSlayAloneSoHeCanLeave();

  PayOffSkyriderDebtIfAny();

  if (GetWorldHour() % 6 == 0) // 4 times a day
  {
    UpdateRegenCounters();
  }
}

function UpdateRegenCounters(): void {
  let ubID: UINT8;

  for (ubID = gTacticalStatus.Team[gbPlayerNum].bFirstID; ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubID++) {
    if (MercPtrs[ubID].value.bRegenBoostersUsedToday > 0) {
      MercPtrs[ubID].value.bRegenBoostersUsedToday--;
    }
  }
}

function HandleQuarterHourUpdate(): void {
  // if the game hasnt even started yet ( we havent arrived in the sector ) dont process this
  if (DidGameJustStart())
    return;

  DecayTacticalMoraleModifiers();
}

function HourlyQuestUpdate(): void {
  let uiHour: UINT32 = GetWorldHour();

  // brothel
  if (uiHour == 4) {
    SetFactFalse(Enum170.FACT_BROTHEL_OPEN);
  } else if (uiHour == 20) {
    SetFactTrue(Enum170.FACT_BROTHEL_OPEN);
  }

  // bar/nightclub
  if (uiHour == 15) {
    let ubLoop: UINT8;

    SetFactTrue(Enum170.FACT_CLUB_OPEN);
    SetFactFalse(Enum170.FACT_PAST_CLUB_CLOSING_AND_PLAYER_WARNED);

    // reset boxes fought
    for (ubLoop = 0; ubLoop < NUM_BOXERS; ubLoop++) {
      gfBoxerFought[ubLoop] = false;
    }

    // if # of boxing matches the player has won is a multiple of
    // 3, and the boxers haven't rested, then make them rest
    if (gfBoxersResting) {
      // done resting now!
      gfBoxersResting = false;
      gubBoxersRests++;
    } else if (gubBoxingMatchesWon / 3 > gubBoxersRests) {
      // time for the boxers to rest!
      gfBoxersResting = true;
    }
  } else if (uiHour == 2) {
    SetFactFalse(Enum170.FACT_CLUB_OPEN);
  }

  // museum
  if (uiHour == 9) {
    SetFactTrue(Enum170.FACT_MUSEUM_OPEN);
  } else if (uiHour == 18) {
    SetFactFalse(Enum170.FACT_MUSEUM_OPEN);
  }
}

const BAR_TEMPTATION = 4;
const NUM_LARRY_ITEMS = 6;
let LarryItems: UINT16[][] /* [NUM_LARRY_ITEMS][3] */ = [
  [ Enum225.ADRENALINE_BOOSTER, 5, 100 ],
  [ Enum225.ALCOHOL, BAR_TEMPTATION, 25 ],
  [ Enum225.MEDICKIT, 4, 10 ],
  [ Enum225.WINE, 3, 50 ],
  [ Enum225.REGEN_BOOSTER, 3, 100 ],
  [ Enum225.BEER, 2, 100 ],
];

const LARRY_FALLS_OFF_WAGON = 8;

function HourlyLarryUpdate(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bSlot: INT8;
  let bBoozeSlot: INT8;
  let bLarryItemLoop: INT8;
  let usTemptation: UINT16 = 0;
  let usCashAmount: UINT16;
  let fBar: boolean = false;

  pSoldier = FindSoldierByProfileID(Enum268.LARRY_NORMAL, true);
  if (!pSoldier) {
    pSoldier = FindSoldierByProfileID(Enum268.LARRY_DRUNK, true);
  }
  if (pSoldier) {
    if (pSoldier.value.bAssignment >= Enum117.ON_DUTY) {
      return;
    }
    if (pSoldier.value.fBetweenSectors) {
      return;
    }
    if (pSoldier.value.bActive && pSoldier.value.bInSector && (gTacticalStatus.fEnemyInSector || guiCurrentScreen == Enum26.GAME_SCREEN)) {
      return;
    }

    // look for items in Larry's inventory to maybe use
    for (bLarryItemLoop = 0; bLarryItemLoop < NUM_LARRY_ITEMS; bLarryItemLoop++) {
      bSlot = FindObj(pSoldier, LarryItems[bLarryItemLoop][0]);
      if (bSlot != NO_SLOT) {
        usTemptation = LarryItems[bLarryItemLoop][1];
        break;
      }
    }

    // check to see if we're in a bar sector, if we are, we have access to alcohol
    // which may be better than anything we've got...
    if (usTemptation < BAR_TEMPTATION && GetCurrentBalance() >= Item[Enum225.ALCOHOL].usPrice) {
      if (pSoldier.value.bSectorZ == 0 && ((pSoldier.value.sSectorX == 13 && pSoldier.value.sSectorY == MAP_ROW_B) || (pSoldier.value.sSectorX == 13 && pSoldier.value.sSectorY == MAP_ROW_C) || (pSoldier.value.sSectorX == 5 && pSoldier.value.sSectorY == MAP_ROW_C) || (pSoldier.value.sSectorX == 6 && pSoldier.value.sSectorY == MAP_ROW_C) || (pSoldier.value.sSectorX == 5 && pSoldier.value.sSectorY == MAP_ROW_D) || (pSoldier.value.sSectorX == 2 && pSoldier.value.sSectorY == MAP_ROW_H))) {
        // in a bar!
        fBar = true;
        usTemptation = BAR_TEMPTATION;
      }
    }

    if (usTemptation > 0) {
      if (pSoldier.value.ubProfile == Enum268.LARRY_NORMAL) {
        gMercProfiles[Enum268.LARRY_NORMAL].bNPCData += Random(usTemptation);
        if (gMercProfiles[Enum268.LARRY_NORMAL].bNPCData >= LARRY_FALLS_OFF_WAGON) {
          if (fBar) {
            // take $ from player's account
            usCashAmount = Item[Enum225.ALCOHOL].usPrice;
            AddTransactionToPlayersBook(Enum80.TRANSFER_FUNDS_TO_MERC, pSoldier.value.ubProfile, GetWorldTotalMin(), -(usCashAmount));
            // give Larry some booze and set slot etc values appropriately
            bBoozeSlot = FindEmptySlotWithin(pSoldier, Enum261.HANDPOS, Enum261.SMALLPOCK8POS);
            if (bBoozeSlot != NO_SLOT) {
              // give Larry booze here
              CreateItem(Enum225.ALCOHOL, 100, addressof(pSoldier.value.inv[bBoozeSlot]));
            }
            bSlot = bBoozeSlot;
            bLarryItemLoop = 1;
          }
          // ahhhh!!!
          SwapLarrysProfiles(pSoldier);
          if (bSlot != NO_SLOT) {
            UseKitPoints(addressof(pSoldier.value.inv[bSlot]), LarryItems[bLarryItemLoop][2], pSoldier);
          }
        }
      } else {
        // NB store all drunkenness info in LARRY_NORMAL profile (to use same values)
        // so long as he keeps consuming, keep number above level at which he cracked
        gMercProfiles[Enum268.LARRY_NORMAL].bNPCData = __max(gMercProfiles[Enum268.LARRY_NORMAL].bNPCData, LARRY_FALLS_OFF_WAGON);
        gMercProfiles[Enum268.LARRY_NORMAL].bNPCData += Random(usTemptation);
        // allow value to keep going up to 24 (about 2 days since we subtract Random( 2 ) when he has no access )
        gMercProfiles[Enum268.LARRY_NORMAL].bNPCData = __min(gMercProfiles[Enum268.LARRY_NORMAL].bNPCData, 24);
        if (fBar) {
          // take $ from player's account
          usCashAmount = Item[Enum225.ALCOHOL].usPrice;
          AddTransactionToPlayersBook(Enum80.TRANSFER_FUNDS_TO_MERC, pSoldier.value.ubProfile, GetWorldTotalMin(), -(usCashAmount));
          // give Larry some booze and set slot etc values appropriately
          bBoozeSlot = FindEmptySlotWithin(pSoldier, Enum261.HANDPOS, Enum261.SMALLPOCK8POS);
          if (bBoozeSlot != NO_SLOT) {
            // give Larry booze here
            CreateItem(Enum225.ALCOHOL, 100, addressof(pSoldier.value.inv[bBoozeSlot]));
          }
          bSlot = bBoozeSlot;
          bLarryItemLoop = 1;
        }
        if (bSlot != NO_SLOT) {
          // ahhhh!!!
          UseKitPoints(addressof(pSoldier.value.inv[bSlot]), LarryItems[bLarryItemLoop][2], pSoldier);
        }
      }
    } else if (pSoldier.value.ubProfile == Enum268.LARRY_DRUNK) {
      gMercProfiles[Enum268.LARRY_NORMAL].bNPCData -= Random(2);
      if (gMercProfiles[Enum268.LARRY_NORMAL].bNPCData <= 0) {
        // goes sober!
        SwapLarrysProfiles(pSoldier);
      }
    }
  }
}

function HourlyCheckIfSlayAloneSoHeCanLeave(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  pSoldier = FindSoldierByProfileID(Enum268.SLAY, true);
  if (!pSoldier) {
    return;
  }
  if (pSoldier.value.fBetweenSectors) {
    return;
  }
  if (!pSoldier.value.bActive || !pSoldier.value.bLife) {
    return;
  }
  if (PlayerMercsInSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ) == 1) {
    if (Chance(15)) {
      pSoldier.value.ubLeaveHistoryCode = Enum83.HISTORY_SLAY_MYSTERIOUSLY_LEFT;
      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING_NO_ASK_EQUIP, 0, 0);
    }
  }
}
