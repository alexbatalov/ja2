namespace ja2 {

let uiContractTimeMode: UINT32 = 0;

let pLeaveSoldier: SOLDIERTYPE | null = null;

export let fEnterMapDueToContract: boolean = false;
export let ubQuitType: UINT8 = 0;
let gfFirstMercSayQuote: boolean = false;

export let pContractReHireSoldier: SOLDIERTYPE | null = null;

export let gubContractLength: UINT8 = 0; // used when extending a mercs insurance contract
let gpInsuranceSoldier: SOLDIERTYPE | null = null;

// The values need to be saved!
let ContractRenewalList: CONTRACT_NEWAL_LIST_NODE[] /* [20] */ = createArrayFrom(20, createContractRenewalListNode);
let ubNumContractRenewals: UINT8 = 0;
// end
let ubCurrentContractRenewal: UINT8 = 0;
let ubCurrentContractRenewalInProgress: boolean = false;
export let gfContractRenewalSquenceOn: boolean = false;
export let gfInContractMenuFromRenewSequence: boolean = false;

// the airport sector
const AIRPORT_X = 13;
const AIRPORT_Y = 2;

export function SaveContractRenewalDataToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  buffer = Buffer.allocUnsafe(20 * CONTRACT_RENEWAL_LIST_NODE_SIZE);
  for (let i = 0; i < 20; i++) {
    writeContractRenewalListNode(ContractRenewalList[i], buffer, i * CONTRACT_RENEWAL_LIST_NODE_SIZE);
  }

  uiNumBytesWritten = FileWrite(hFile, buffer, 20 * CONTRACT_RENEWAL_LIST_NODE_SIZE);
  if (uiNumBytesWritten != 20 * CONTRACT_RENEWAL_LIST_NODE_SIZE) {
    return false;
  }

  buffer.writeUInt8(ubNumContractRenewals, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1) {
    return false;
  }

  return true;
}

export function LoadContractRenewalDataFromSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  buffer = Buffer.allocUnsafe(20 * CONTRACT_RENEWAL_LIST_NODE_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, CONTRACT_RENEWAL_LIST_NODE_SIZE);
  if (uiNumBytesRead != CONTRACT_RENEWAL_LIST_NODE_SIZE) {
    return false;
  }

  for (let i = 0; i < 20; i++) {
    readContractRenewalListNode(ContractRenewalList[i], buffer, i * CONTRACT_RENEWAL_LIST_NODE_SIZE);
  }

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1) {
    return false;
  }

  ubNumContractRenewals = buffer.readUInt8(0);

  return true;
}

export function BeginContractRenewalSequence(): void {
  let cnt: INT32;
  let pSoldier: SOLDIERTYPE | null;
  let fFoundAtLeastOne: boolean = false;

  if (ubNumContractRenewals > 0) {
    for (cnt = 0; cnt < ubNumContractRenewals; cnt++) {
      // Get soldier - if there is none, adavance to next
      pSoldier = FindSoldierByProfileID(ContractRenewalList[cnt].ubProfileID, false); // Steve Willis, 80

      if (pSoldier) {
        if ((pSoldier.bActive == false) || (pSoldier.bLife == 0) || (pSoldier.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW)) {
          // no
          continue;
        }

        // Double check there are valid people here that still want to renew...
        // if the user hasnt renewed yet, and is still leaving today
        if (ContractIsExpiring(pSoldier)) {
          fFoundAtLeastOne = true;
        }
      }
    }

    if (fFoundAtLeastOne) {
      // Set sequence on...
      gfContractRenewalSquenceOn = true;

      // Start at first one....
      ubCurrentContractRenewal = 0;
      ubCurrentContractRenewalInProgress = false;

      PauseGame();
      LockPauseState(7);
      InterruptTime();

      // Go into mapscreen if not already...
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_ENTER_MAPSCREEN, 0, 0, 0, 0, 0);
    }
  }
}

export function HandleContractRenewalSequence(): void {
  let pSoldier: SOLDIERTYPE | null;

  if (gfContractRenewalSquenceOn) {
    // Should we stop now?
    if (ubCurrentContractRenewal == ubNumContractRenewals) {
      // Stop and clear any on list...
      ubNumContractRenewals = 0;
      gfContractRenewalSquenceOn = false;
    }

    // Get soldier - if there is none, adavance to next
    pSoldier = FindSoldierByProfileID(ContractRenewalList[ubCurrentContractRenewal].ubProfileID, false); // Steve Willis, 80

    if (pSoldier == null) {
      // Advance to next guy!
      EndCurrentContractRenewal();
      return;
    }

    // OK, check if it's in progress...
    if (!ubCurrentContractRenewalInProgress) {
      // Double check contract situation....
      if (ContractIsExpiring(pSoldier)) {
        // Set this one in motion!
        ubCurrentContractRenewalInProgress = true;

        // Handle start here...

        // Determine what quote to use....
        if (!WillMercRenew(pSoldier, false)) {
          // OK, he does not want to renew.......
          HandleImportantMercQuote(pSoldier, Enum202.QUOTE_MERC_LEAVING_ALSUCO_SOON);

          // Do special dialogue event...
          SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_CONTRACT_NOGO_TO_RENEW, pSoldier.ubID, 0, 0, 0, 0);
        } else {
          // OK check what dialogue to play
          // If we have not used this one before....
          if (pSoldier.ubContractRenewalQuoteCode == SOLDIER_CONTRACT_RENEW_QUOTE_NOT_USED) {
            SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);
            HandleImportantMercQuote(pSoldier, Enum202.QUOTE_CONTRACTS_OVER);
            SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
          }
          // Else if we have said 89 already......
          else if (pSoldier.ubContractRenewalQuoteCode == SOLDIER_CONTRACT_RENEW_QUOTE_89_USED) {
            SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);
            HandleImportantMercQuote(pSoldier, Enum202.QUOTE_MERC_LEAVING_ALSUCO_SOON);
            SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
          }

          // Do special dialogue event...
          SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_CONTRACT_WANTS_TO_RENEW, pSoldier.ubID, 0, 0, 0, 0);
        }
      } else {
        // Skip to next guy!
        EndCurrentContractRenewal();
      }
    }
  }
}

function EndCurrentContractRenewal(): void {
  // Are we in the requence?
  if (gfContractRenewalSquenceOn) {
    // OK stop this one and increment current one
    ubCurrentContractRenewalInProgress = false;
    gfInContractMenuFromRenewSequence = false;

    ubCurrentContractRenewal++;
  }
}

export function HandleMercIsWillingToRenew(ubID: UINT8): void {
  let pSoldier: SOLDIERTYPE = MercPtrs[ubID];

  // We wish to lock interface
  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);

  CheckIfSalaryIncreasedAndSayQuote(pSoldier, false);

  // Setup variable for this....
  gfInContractMenuFromRenewSequence = true;

  // Show contract menu
  TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_SHOW_CONTRACT_MENU, 0, 0);

  // Unlock now
  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
}

export function HandleMercIsNotWillingToRenew(ubID: UINT8): void {
  let pSoldier: SOLDIERTYPE = MercPtrs[ubID];

  // We wish to lock interface
  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);

  // Setup variable for this....
  gfInContractMenuFromRenewSequence = true;

  // Show contract menu
  TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_SHOW_CONTRACT_MENU, 0, 0);

  // Unlock now
  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
}

// This is used only to EXTEND the contract of an AIM merc already on the team
export function MercContractHandling(pSoldier: SOLDIERTYPE, ubDesiredAction: UINT8): boolean {
  let iContractCharge: INT32 = 0;
  let iContractLength: INT32 = 0;
  let ubHistoryContractType: UINT8 = 0;
  let ubFinancesContractType: UINT8 = 0;
  let iCostOfInsurance: INT32 = 0;

  // determins what kind of merc the contract is being extended for (only aim mercs can extend contract)
  if (pSoldier.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC)
    return false;

  switch (ubDesiredAction) {
    case Enum161.CONTRACT_EXTEND_1_DAY:
      // check to see if the merc has enough money
      iContractCharge = gMercProfiles[pSoldier.ubProfile].sSalary;

      // set the contract length and the charge
      iContractLength = 1;

      ubHistoryContractType = Enum83.HISTORY_EXTENDED_CONTRACT_1_DAY;
      ubFinancesContractType = Enum80.EXTENDED_CONTRACT_BY_1_DAY;
      break;

    case Enum161.CONTRACT_EXTEND_1_WEEK:
      iContractCharge = gMercProfiles[pSoldier.ubProfile].uiWeeklySalary;

      // set the contract length and the charge
      iContractLength = 7;

      ubHistoryContractType = Enum83.HISTORY_EXTENDED_CONTRACT_1_WEEK;
      ubFinancesContractType = Enum80.EXTENDED_CONTRACT_BY_1_WEEK;
      break;

    case Enum161.CONTRACT_EXTEND_2_WEEK:
      iContractCharge = gMercProfiles[pSoldier.ubProfile].uiBiWeeklySalary;

      // set the contract length and the charge
      iContractLength = 14;

      ubHistoryContractType = Enum83.HISTORY_EXTENDED_CONTRACT_2_WEEK;
      ubFinancesContractType = Enum80.EXTENDED_CONTRACT_BY_2_WEEKS;
      break;

    default:
      return false;
      break;
  }

  // check to see if the merc has enough money
  if (LaptopSaveInfo.iCurrentBalance < iContractCharge)
    return false;

  // Check to see if merc will renew
  if (!WillMercRenew(pSoldier, true)) {
    // Remove soldier.... ( if this is setup because normal contract ending dequence... )
    if (ContractIsExpiring(pSoldier)) {
      TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING, 1, 0);
    }
    return false;
  }

  fPausedTimeDuringQuote = true;

  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);

  //
  // These calcs need to be done before Getting/Calculating the insurance costs
  //

  // set the contract length and the charge
  pSoldier.iTotalContractLength += iContractLength;
  //	pSoldier->iTotalContractCharge = iContractCharge;
  pSoldier.bTypeOfLastContract = ubDesiredAction;

  // determine the end of the contract
  pSoldier.iEndofContractTime += (iContractLength * 1440);

  if ((pSoldier.usLifeInsurance) && (pSoldier.bAssignment != Enum117.ASSIGNMENT_POW)) //  DEF:  Removed cause they can extend a 1 day contract && ( iContractLength > 1 )
  {
    // check if player can afford insurance, if not, tell them
    iCostOfInsurance = CalculateInsuranceContractCost(iContractLength, pSoldier.ubProfile);

    HandleImportantMercQuote(pSoldier, Enum202.QUOTE_ACCEPT_CONTRACT_RENEWAL);

    if (iCostOfInsurance > LaptopSaveInfo.iCurrentBalance) {
      // no can afford
      HandleNotifyPlayerCantAffordInsurance();

      // OK, handle ending of renew session
      if (gfInContractMenuFromRenewSequence) {
        EndCurrentContractRenewal();
      }
    } else {
      // can afford ask if they want it
      HandleNotifyPlayerCanAffordInsurance(pSoldier, (iContractLength), iCostOfInsurance);
    }
  } else {
    // no need to query for life insurance
    HandleImportantMercQuote(pSoldier, Enum202.QUOTE_ACCEPT_CONTRACT_RENEWAL);

    // OK, handle ending of renew session
    if (gfInContractMenuFromRenewSequence) {
      EndCurrentContractRenewal();
    }
  }

  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);

  // ATE: Setup when they can be signed again!
  // If they are 2-weeks this can be extended
  // otherwise don't change from current
  if (pSoldier.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_2_WEEK) {
    pSoldier.iTimeCanSignElsewhere = pSoldier.iEndofContractTime;
  }

  // ARM: Do not reset because of renewal!  The quote is for early dismissal from *initial* time of hiring
  //	pSoldier->uiTimeOfLastContractUpdate = GetWorldTotalMin();

  // ARM: Do not reset because of renewal!  The deposit in the profile goes up when merc levels, but the one in the soldier
  // structure must always reflect the deposit actually paid (which does NOT change when a merc levels).
  //	pSoldier->usMedicalDeposit = gMercProfiles[ pSoldier->ubProfile ].sMedicalDepositAmount;

  // add an entry in the finacial page for the extending  of the mercs contract
  AddTransactionToPlayersBook(ubFinancesContractType, pSoldier.ubProfile, GetWorldTotalMin(), -iContractCharge);

  // add an entry in the history page for the extending of the merc contract
  AddHistoryToPlayersLog(ubHistoryContractType, pSoldier.ubProfile, GetWorldTotalMin(), pSoldier.sSectorX, pSoldier.sSectorY);

  return true;
}

export function WillMercRenew(pSoldier: SOLDIERTYPE, fSayQuote: boolean): boolean {
  let i: UINT8;
  let bMercID: INT8;
  let fBuddyAround: boolean = false;
  let fUnhappy: boolean = false;
  let usBuddyQuote: UINT16 = 0;
  let usReasonQuote: UINT16 = 0;
  let fSayPrecedent: boolean = false;
  let pHated: SOLDIERTYPE | null;

  if (pSoldier.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC)
    return false;

  // does the merc have another contract already lined up?
  if (pSoldier.fSignedAnotherContract) {
    // NOTE: Having a buddy around will NOT stop a merc from leaving on another contract (IC's call)

    if (fSayQuote == true) {
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);
      HandleImportantMercQuote(pSoldier, Enum202.QUOTE_WONT_RENEW_CONTRACT_LAME_REFUSAL);
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
    }
    return false;
  }

  // find out if the merc has a buddy working for the player
  // loop through the list of people the merc considers buddies
  for (i = 0; i < 5; i++) {
    bMercID = gMercProfiles[pSoldier.ubProfile].bBuddy[i];

    if (bMercID < 0)
      continue;

    // is this buddy on the team?
    if (IsMercOnTeamAndAlive(bMercID)) {
      fBuddyAround = true;

      if (i == 0)
        usBuddyQuote = Enum202.QUOTE_RENEWING_CAUSE_BUDDY_1_ON_TEAM;
      else if (i == 1)
        usBuddyQuote = Enum202.QUOTE_RENEWING_CAUSE_BUDDY_2_ON_TEAM;
      else
        usBuddyQuote = Enum202.QUOTE_RENEWING_CAUSE_LEARNED_TO_LIKE_BUDDY_ON_TEAM;

      // use first buddy in case there are multiple
      break;
    }
  }

  // WE CHECK FOR SOURCES OF UNHAPPINESS IN ORDER OF IMPORTANCE, which is:
  // 1) Hated Mercs (Highest), 2) Death Rate, 3) Morale (lowest)

  // see if someone the merc hates is on the team
  // loop through the list of people the merc hates
  for (i = 0; i < 2; i++) {
    bMercID = gMercProfiles[pSoldier.ubProfile].bHated[i];

    if (bMercID < 0)
      continue;

    if (IsMercOnTeamAndInOmertaAlreadyAndAlive(bMercID)) {
      if (gMercProfiles[pSoldier.ubProfile].bHatedCount[i] == 0) {
        // our tolerance has run out!
        fUnhappy = true;
      } else // else tolerance is > 0, only gripe if in same sector
      {
        pHated = FindSoldierByProfileID(bMercID, true);
        if (pHated && pHated.sSectorX == pSoldier.sSectorX && pHated.sSectorY == pSoldier.sSectorY && pHated.bSectorZ == pSoldier.bSectorZ) {
          fUnhappy = true;
        }
      }

      if (fUnhappy) {
        if (i == 0)
          usReasonQuote = Enum202.QUOTE_HATE_MERC_1_ON_TEAM_WONT_RENEW;
        else
          usReasonQuote = Enum202.QUOTE_HATE_MERC_2_ON_TEAM_WONT_RENEW;

        // use first hated in case there are multiple
        break;
      }
    }
  }

  if (!fUnhappy) {
    // now check for learn to hate
    bMercID = gMercProfiles[pSoldier.ubProfile].bLearnToHate;

    if (bMercID >= 0) {
      if (IsMercOnTeamAndInOmertaAlreadyAndAlive(bMercID)) {
        if (gMercProfiles[pSoldier.ubProfile].bLearnToHateCount == 0) {
          // our tolerance has run out!
          fUnhappy = true;
          usReasonQuote = Enum202.QUOTE_LEARNED_TO_HATE_MERC_1_ON_TEAM_WONT_RENEW;
        } else if (gMercProfiles[pSoldier.ubProfile].bLearnToHateCount <= gMercProfiles[pSoldier.ubProfile].bLearnToHateTime / 2) {
          pHated = FindSoldierByProfileID(bMercID, true);
          if (pHated && pHated.sSectorX == pSoldier.sSectorX && pHated.sSectorY == pSoldier.sSectorY && pHated.bSectorZ == pSoldier.bSectorZ) {
            fUnhappy = true;
            usReasonQuote = Enum202.QUOTE_LEARNED_TO_HATE_MERC_1_ON_TEAM_WONT_RENEW;
          }
        }
      }
    }
  }

  // happy so far?
  if (!fUnhappy) {
    // check if death rate is too high
    if (MercThinksDeathRateTooHigh(pSoldier.ubProfile)) {
      fUnhappy = true;
      usReasonQuote = Enum202.QUOTE_DEATH_RATE_RENEWAL;
    }
  }

  // happy so far?
  if (!fUnhappy) {
    // check if morale is too low
    if (MercThinksHisMoraleIsTooLow(pSoldier)) {
      fUnhappy = true;
      usReasonQuote = Enum202.QUOTE_REFUSAL_RENEW_DUE_TO_MORALE;
    }
  }

  // say the precedent?
  fSayPrecedent = false;

  // check if we say the precdent for merc
  if (fSayQuote) {
    if (fUnhappy) {
      if (fBuddyAround) {
        if (GetMercPrecedentQuoteBitStatus(pSoldier.ubProfile, GetQuoteBitNumberFromQuoteID((usBuddyQuote))) == true) {
          fSayPrecedent = true;
        } else {
          SetMercPrecedentQuoteBitStatus(pSoldier.ubProfile, GetQuoteBitNumberFromQuoteID((usBuddyQuote)));
        }
      } else {
        if (GetMercPrecedentQuoteBitStatus(pSoldier.ubProfile, GetQuoteBitNumberFromQuoteID((usReasonQuote))) == true) {
          fSayPrecedent = true;
        } else {
          SetMercPrecedentQuoteBitStatus(pSoldier.ubProfile, GetQuoteBitNumberFromQuoteID((usReasonQuote)));
        }
      }
    }
  }

  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);

  if (fSayPrecedent) {
    HandleImportantMercQuote(pSoldier, Enum202.QUOTE_PRECEDENT_TO_REPEATING_ONESELF_RENEW);
  }

  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);

  // OK, we got all our info, let's make some decisions!
  if (fUnhappy) {
    if (fBuddyAround) {
      // unhappy, but buddy's around, so will agree to renew, but tell us why we're doing it
      if (fSayQuote == true) {
        SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);
        HandleImportantMercQuote(pSoldier, usBuddyQuote);
        SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
      }
      return true;
    } else {
      // unhappy, no buddies, will refuse to renew
      if (fSayQuote == true) {
        SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);

        /* ARM: Delay quote too vague, no longer to be used
                                        if( ( SoldierWantsToDelayRenewalOfContract( pSoldier ) ) )
                                        {
                                                // has a new job lined up
                                                HandleImportantMercQuote( pSoldier, QUOTE_DELAY_CONTRACT_RENEWAL );
                                        }
                                        else
        */
        {
          Assert(usReasonQuote != 0);
          HandleImportantMercQuote(pSoldier, usReasonQuote);
        }
        SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);
      }
      return false;
    }
  } else {
    // happy, no problem
    return true;
  }
}

function HandleSoldierLeavingWithLowMorale(pSoldier: SOLDIERTYPE): void {
  if (MercThinksHisMoraleIsTooLow(pSoldier)) {
    // this will cause him give us lame excuses for a while until he gets over it
    // 3-6 days (but the first 1-2 days of that are spent "returning" home)
    gMercProfiles[pSoldier.ubProfile].ubDaysOfMoraleHangover = (3 + Random(4));
  }
}

function HandleSoldierLeavingForAnotherContract(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.fSignedAnotherContract) {
    // merc goes to work elsewhere
    gMercProfiles[pSoldier.ubProfile].bMercStatus = MERC_WORKING_ELSEWHERE;
    gMercProfiles[pSoldier.ubProfile].uiDayBecomesAvailable += 1 + Random(6 + (pSoldier.bExpLevel / 2)); // 1-(6 to 11) days
  }
}

/*
BOOLEAN SoldierWantsToDelayRenewalOfContract( SOLDIERTYPE *pSoldier )
{

        INT8 bTypeOfCurrentContract = 0; // what kind of contract the merc has..1 day, week or 2 week
        INT32 iLeftTimeOnContract = 0; // how much time til contract expires..in minutes
        INT32 iToleranceLevelForContract = 0; // how much time before contract ends before merc actually speaks thier mind

        // does the soldier want to delay renew of contract, possibly due to poor performance by player
        if( pSoldier->ubWhatKindOfMercAmI != MERC_TYPE__AIM_MERC )
                return( FALSE );

        // type of contract the merc had
        bTypeOfCurrentContract = pSoldier -> bTypeOfLastContract;
        iLeftTimeOnContract = pSoldier->iEndofContractTime - GetWorldTotalMin();

        // grab tolerance
        switch( bTypeOfCurrentContract )
        {
                case( CONTRACT_EXTEND_1_DAY ):
                        // 20 hour tolerance on 24 hour contract
                        iToleranceLevelForContract = 20 * 60;
                        break;
                case( CONTRACT_EXTEND_1_WEEK ):
                        // two day tolerance for 1 week
                        iToleranceLevelForContract = 2 * 24 * 60;
                        break;
                case( CONTRACT_EXTEND_2_WEEK ):
                        // three day on 2 week contract
                        iToleranceLevelForContract = 3 * 24 * 60;
                        break;
        }

        if( iLeftTimeOnContract > iToleranceLevelForContract )
        {
                return( TRUE );
        }
        else
        {
                return( FALSE );
        }

}
*/

// this is called once a day (daily update) for every merc working for the player
export function CheckIfMercGetsAnotherContract(pSoldier: SOLDIERTYPE): void {
  let uiFullDaysRemaining: UINT32 = 0;
  let iChance: INT32 = 0;

  // aim merc?
  if (pSoldier.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC)
    return;

  // ATE: check time we have and see if we can accept new contracts....
  if (GetWorldTotalMin() <= pSoldier.iTimeCanSignElsewhere) {
    return;
  }

  // if he doesn't already have another contract
  if (!pSoldier.fSignedAnotherContract) {
    // chance depends on how much time he has left in his contract, and his experience level (determines demand)
    uiFullDaysRemaining = (pSoldier.iEndofContractTime - GetWorldTotalMin()) / (24 * 60);

    if (uiFullDaysRemaining == 0) {
      // less than a full day left on contract
      // calc the chance merc will get another contract while working for ya (this is rolled once/day)
      iChance = 3;
    } else if (uiFullDaysRemaining == 1) {
      // < 2 days left
      iChance = 2;
    } else if (uiFullDaysRemaining == 2) {
      // < 3 days left
      iChance = 1;
    } else {
      // 3+ days
      iChance = 0;
    }

    // multiply by experience level
    iChance *= pSoldier.bExpLevel;

    if (Random(100) < iChance) {
      // B'bye!
      pSoldier.fSignedAnotherContract = true;
    }
  }
}

// for ubRemoveType pass in the enum from the .h, 	( MERC_QUIT, MERC_FIRED  )
export function BeginStrategicRemoveMerc(pSoldier: SOLDIERTYPE, fAddRehireButton: boolean): boolean {
  InterruptTime();
  PauseGame();
  LockPauseState(8);

  // if the soldier may have some special action when he/she leaves the party, handle it
  HandleUniqueEventWhenPlayerLeavesTeam(pSoldier);

  // IF the soldier is an EPC, don't ask about equipment
  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
    UnEscortEPC(pSoldier);
  } else {
    NotifyPlayerOfMercDepartureAndPromptEquipmentPlacement(pSoldier, fAddRehireButton);
  }

  return true;
}

export function StrategicRemoveMerc(pSoldier: SOLDIERTYPE): boolean {
  let ubHistoryCode: UINT8 = 0;

  if (gfInContractMenuFromRenewSequence) {
    EndCurrentContractRenewal();
  }

  // ATE: Determine which HISTORY ENTRY to use...
  if (pSoldier.ubLeaveHistoryCode == 0) {
    // Default use contract expired reason...
    pSoldier.ubLeaveHistoryCode = Enum83.HISTORY_MERC_CONTRACT_EXPIRED;
  }

  ubHistoryCode = pSoldier.ubLeaveHistoryCode;

  // if the soldier is DEAD
  if (pSoldier.bLife <= 0) {
    AddCharacterToDeadList(pSoldier);
  }

  // else if the merc was fired
  else if (ubHistoryCode == Enum83.HISTORY_MERC_FIRED || pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    AddCharacterToFiredList(pSoldier);
  }

  // The merc is leaving for some other reason
  else {
    AddCharacterToOtherList(pSoldier);
  }

  if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__NPC) {
    SetupProfileInsertionDataForSoldier(pSoldier);
  }

  // remove him from the soldier structure
  if (pSoldier.bAssignment >= Enum117.ON_DUTY) {
    // is he/she in a mvt group, if so, remove and destroy the group
    if (pSoldier.ubGroupID) {
      if (pSoldier.bAssignment != Enum117.VEHICLE) {
        // Can only remove groups if they aren't persistant (not in a squad or vehicle)
        RemoveGroup(pSoldier.ubGroupID);
      } else {
        // remove him from any existing merc slot he could be in
        RemoveMercSlot(pSoldier);
        TakeSoldierOutOfVehicle(pSoldier);
      }
    }
  } else {
    RemoveCharacterFromSquads(pSoldier);
  }

  // if the merc is not dead
  if (gMercProfiles[pSoldier.ubProfile].bMercStatus != MERC_IS_DEAD) {
    // Set the status to returning home ( delay the merc for rehire )
    gMercProfiles[pSoldier.ubProfile].bMercStatus = MERC_RETURNING_HOME;

    // specify how long the merc will continue to be unavailable
    gMercProfiles[pSoldier.ubProfile].uiDayBecomesAvailable = 1 + Random(2); // 1-2 days

    HandleSoldierLeavingWithLowMorale(pSoldier);
    HandleSoldierLeavingForAnotherContract(pSoldier);
  }

  // add an entry in the history page for the firing/quiting of the merc
  // ATE: Don't do this if they are already dead!
  if (!(pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
    AddHistoryToPlayersLog(ubHistoryCode, pSoldier.ubProfile, GetWorldTotalMin(), pSoldier.sSectorX, pSoldier.sSectorY);
  }

  // if the merc was a POW, remember it becuase the merc cant show up in AIM or MERC anymore
  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    gMercProfiles[pSoldier.ubProfile].bMercStatus = MERC_FIRED_AS_A_POW;
  }

  // else the merc CAN get his medical deposit back
  else {
    // Determine how much of a Medical deposit is going to be refunded to the player
    CalculateMedicalDepositRefund(pSoldier);
  }

  // remove the merc from the tactical
  TacticalRemoveSoldier(pSoldier.ubID);

  // Check if we should remove loaded world...
  CheckAndHandleUnloadingOfCurrentWorld();

  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    ReBuildCharactersList();
  }

  fMapPanelDirty = true;
  fTeamPanelDirty = true;
  fCharacterInfoPanelDirty = true;

  // stop time compression so player can react to the departure
  StopTimeCompression();

  // ATE: update team panels....
  UpdateTeamPanelAssignments();

  return true;
}

function CalculateMedicalDepositRefund(pSoldier: SOLDIERTYPE): void {
  let iRefundAmount: INT32 = 0;

  // if the merc didnt have any medical deposit, exit
  if (!gMercProfiles[pSoldier.ubProfile].bMedicalDeposit)
    return;

  // if the merc is at full health, refund the full medical deposit
  if (pSoldier.bLife == pSoldier.bLifeMax) {
    // add an entry in the finacial page for the FULL refund of the medical deposit
    // use the medical deposit in pSoldier, not in profile, which goes up with leveling
    AddTransactionToPlayersBook(Enum80.FULL_MEDICAL_REFUND, pSoldier.ubProfile, GetWorldTotalMin(), pSoldier.usMedicalDeposit);

    // add an email
    AddEmailWithSpecialData(AIM_MEDICAL_DEPOSIT_REFUND, AIM_MEDICAL_DEPOSIT_REFUND_LENGTH, Enum75.AIM_SITE, GetWorldTotalMin(), pSoldier.usMedicalDeposit, pSoldier.ubProfile);
  }
  // else if the merc is a dead, refund NOTHING!!
  else if (pSoldier.bLife <= 0) {
    // add an entry in the finacial page for NO refund of the medical deposit
    // AddTransactionToPlayersBook( NO_MEDICAL_REFUND, pSoldier->ubProfile, GetWorldTotalMin(), 0 );

    // add an email
    AddEmailWithSpecialData(AIM_MEDICAL_DEPOSIT_NO_REFUND, AIM_MEDICAL_DEPOSIT_NO_REFUND_LENGTH, Enum75.AIM_SITE, GetWorldTotalMin(), pSoldier.usMedicalDeposit, pSoldier.ubProfile);
  }
  // else the player is injured, refund a partial amount
  else {
    // use the medical deposit in pSoldier, not in profile, which goes up with leveling
    iRefundAmount = ((pSoldier.bLife / pSoldier.bLifeMax) * pSoldier.usMedicalDeposit + 0.5);

    // add an entry in the finacial page for a PARTIAL refund of the medical deposit
    AddTransactionToPlayersBook(Enum80.PARTIAL_MEDICAL_REFUND, pSoldier.ubProfile, GetWorldTotalMin(), iRefundAmount);

    // add an email
    AddEmailWithSpecialData(AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND, AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND_LENGTH, Enum75.AIM_SITE, GetWorldTotalMin(), iRefundAmount, pSoldier.ubProfile);
  }
}

function NotifyPlayerOfMercDepartureAndPromptEquipmentPlacement(pSoldier: SOLDIERTYPE, fAddRehireButton: boolean): void {
  // will tell player this character is leaving and ask where they want the equipment left
  let sString: string /* CHAR16[1024] */;
  let fInSector: boolean = false;
  //	INT16					zTownIDString[50];
  let zShortTownIDString: string /* CHAR16[50] */;

  // use YES/NO Pop up box, settup for particular screen
  let pCenteringRect: SGPRect = createSGPRectFrom(0, 0, 640, 480);

  // GetSectorIDString( pSoldier->sSectorX, pSoldier->sSectorY, pSoldier->bSectorZ, zTownIDString, TRUE );

  zShortTownIDString = GetShortSectorString(pSoldier.sSectorX, pSoldier.sSectorY);

  // Set string for generic button
  gzUserDefinedButton1 = swprintf("%s", zShortTownIDString);

  pLeaveSoldier = pSoldier;

  if (pSoldier.fSignedAnotherContract == true) {
    fAddRehireButton = false;
  }

  if (pSoldier.fSignedAnotherContract == true) {
    fAddRehireButton = false;
  }

  if (pSoldier.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC) {
    fAddRehireButton = false;
  }

  // if the character is an RPC
  if (pSoldier.ubProfile >= FIRST_RPC && pSoldier.ubProfile < FIRST_NPC) {
    if (gMercProfiles[pSoldier.ubProfile].bSex == Enum272.MALE) {
      sString = swprintf(pMercHeLeaveString[4], pSoldier.name, zShortTownIDString);
    } else {
      sString = swprintf(pMercSheLeaveString[4], pSoldier.name, zShortTownIDString);
    }
    fInSector = true;
  }

  // check if drassen controlled
  else if (StrategicMap[(AIRPORT_X + (MAP_WORLD_X * AIRPORT_Y))].fEnemyControlled == false) {
    if ((pSoldier.sSectorX == AIRPORT_X) && (pSoldier.sSectorY == AIRPORT_Y) && (pSoldier.bSectorZ == 0)) {
      if (gMercProfiles[pSoldier.ubProfile].bSex == Enum272.MALE) {
        sString = swprintf("%s %s", pSoldier.name, pMercHeLeaveString[3]);
      } else {
        sString = swprintf("%s %s", pSoldier.name, pMercSheLeaveString[3]);
      }
      fInSector = true;
    } else {
      // Set string for generic button
      gzUserDefinedButton2 = "B13";

      if (gMercProfiles[pSoldier.ubProfile].bSex == Enum272.MALE) {
        sString = swprintf(pMercHeLeaveString[0], pSoldier.name, zShortTownIDString);
      } else {
        sString = swprintf(pMercSheLeaveString[0], pSoldier.name, zShortTownIDString);
      }
    }
  } else {
    if ((pSoldier.sSectorX == OMERTA_LEAVE_EQUIP_SECTOR_X) && (pSoldier.sSectorY == OMERTA_LEAVE_EQUIP_SECTOR_Y) && (pSoldier.bSectorZ == 0)) {
      if (gMercProfiles[pSoldier.ubProfile].bSex == Enum272.MALE) {
        sString = swprintf("%s %s", pSoldier.name, pMercHeLeaveString[2]);
      } else {
        sString = swprintf("%s %s", pSoldier.name, pMercSheLeaveString[2]);
      }
      fInSector = true;
    } else {
      // Set string for generic button
      gzUserDefinedButton2 = "A9";

      if (gMercProfiles[pSoldier.ubProfile].bSex == Enum272.MALE) {
        sString = swprintf(pMercHeLeaveString[1], pSoldier.name, zShortTownIDString);
      } else {
        sString = swprintf(pMercSheLeaveString[1], pSoldier.name, zShortTownIDString);
      }
    }
  }

  /// which screen are we in?
  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    if (fInSector == false) {
      // set up for mapscreen
      DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, Enum26.MAP_SCREEN, ((fAddRehireButton ? MSG_BOX_FLAG_GENERICCONTRACT : MSG_BOX_FLAG_GENERIC)), MercDepartEquipmentBoxCallBack);
    } else {
      DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, Enum26.MAP_SCREEN, ((fAddRehireButton ? MSG_BOX_FLAG_OKCONTRACT : MSG_BOX_FLAG_OK)), MercDepartEquipmentBoxCallBack);
    }
  } else {
    if (fInSector == false) {
      // set up for all otherscreens
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, guiCurrentScreen, (MSG_BOX_FLAG_USE_CENTERING_RECT | (fAddRehireButton ? MSG_BOX_FLAG_GENERICCONTRACT : MSG_BOX_FLAG_GENERIC)), MercDepartEquipmentBoxCallBack, pCenteringRect);
    } else {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sString, guiCurrentScreen, (MSG_BOX_FLAG_USE_CENTERING_RECT | (fAddRehireButton ? MSG_BOX_FLAG_OKCONTRACT : MSG_BOX_FLAG_OK)), MercDepartEquipmentBoxCallBack, pCenteringRect);
    }
  }

  if (pSoldier.fSignedAnotherContract == true) {
    // fCurrentMercFired = FALSE;
  }
}

function MercDepartEquipmentBoxCallBack(bExitValue: UINT8): void {
  // gear left in current sector?
  if (pLeaveSoldier == null) {
    return;
  }

  if (bExitValue == MSG_BOX_RETURN_OK) {
    // yep (NOTE that this passes the SOLDIER index, not the PROFILE index as the others do)
    HandleLeavingOfEquipmentInCurrentSector(pLeaveSoldier.ubID);

    // aim merc will say goodbye when leaving
    if ((pLeaveSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) && (ubQuitType != Enum83.HISTORY_MERC_FIRED)) {
      //	TacticalCharacterDialogue( pLeaveSoldier, QUOTE_MERC_LEAVING_ALSUCO_SOON );
    }
  } else if (bExitValue == MSG_BOX_RETURN_CONTRACT) {
    HandleExtendMercsContract(pLeaveSoldier);
    return;
  } else if (bExitValue == MSG_BOX_RETURN_YES) {
    // yep (NOTE that this passes the SOLDIER index, not the PROFILE index as the others do)
    HandleLeavingOfEquipmentInCurrentSector(pLeaveSoldier.ubID);

    // aim merc will say goodbye when leaving
    if ((pLeaveSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) && (ubQuitType != Enum83.HISTORY_MERC_FIRED)) {
      //	TacticalCharacterDialogue( pLeaveSoldier, QUOTE_MERC_LEAVING_ALSUCO_SOON );
    }
  } else {
    // no
    if (StrategicMap[BOBBYR_SHIPPING_DEST_SECTOR_X + (BOBBYR_SHIPPING_DEST_SECTOR_Y * MAP_WORLD_X)].fEnemyControlled == false) {
      HandleMercLeavingEquipmentInDrassen(pLeaveSoldier.ubID);
    } else {
      HandleMercLeavingEquipmentInOmerta(pLeaveSoldier.ubID);
    }
  }

  StrategicRemoveMerc(pLeaveSoldier);

  pLeaveSoldier = null;

  return;
}

function HandleFiredDeadMerc(pSoldier: SOLDIERTYPE): boolean {
  AddCharacterToDeadList(pSoldier);

  return true;
}

function HandleExtendMercsContract(pSoldier: SOLDIERTYPE): void {
  if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    gfEnteringMapScreen = 1;

    fEnterMapDueToContract = true;
    pContractReHireSoldier = pSoldier;
    LeaveTacticalScreen(Enum26.MAP_SCREEN);
    uiContractTimeMode = Enum130.TIME_COMPRESS_5MINS;
  } else {
    FindAndSetThisContractSoldier(pSoldier);
    pContractReHireSoldier = pSoldier;
    uiContractTimeMode = giTimeCompressMode;
  }

  fTeamPanelDirty = true;
  fCharacterInfoPanelDirty = true;

  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);

  CheckIfSalaryIncreasedAndSayQuote(pSoldier, true);

  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);

  return;
}

export function FindOutIfAnyMercAboutToLeaveIsGonnaRenew(): void {
  // find out is something was said
  let pSoldier: SOLDIERTYPE;
  let pSoldierWhoWillQuit: SOLDIERTYPE | null = null;
  let iCounter: INT32 = 0;
  let iNumberOnTeam: INT32 = 0;
  let ubPotentialMercs: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;

  gfFirstMercSayQuote = false;

  pSoldier = Menptr[0];
  iNumberOnTeam = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // run through list of grunts whoose contract are up in the next 2 hours
  // ATE: AND - build list THEN choose one!
  // What we will do here is make a list of mercs that will want
  // to stay if offered. Durning that process, also check if there
  // is any merc that does not want to stay and only display that quote
  // if they are the only one here....
  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pSoldier = Menptr[iCounter];

    // valid soldier?
    if ((pSoldier.bActive == false) || (pSoldier.bLife == 0) || (pSoldier.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW)) {
      // no
      continue;
    }

    if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
      // if the user hasnt renewed yet, and is still leaving today
      if (ContractIsGoingToExpireSoon(pSoldier)) {
        // OK, default value for quote said
        pSoldier.ubContractRenewalQuoteCode = SOLDIER_CONTRACT_RENEW_QUOTE_NOT_USED;

        // Add this guy to the renewal list
        ContractRenewalList[ubNumContractRenewals].ubProfileID = pSoldier.ubProfile;
        ubNumContractRenewals++;

        if (WillMercRenew(pSoldier, false)) {
          ubPotentialMercs[ubNumMercs] = pSoldier.ubID;
          ubNumMercs++;
        } else {
          pSoldierWhoWillQuit = pSoldier;
        }

        // Add to list!
        AddSoldierToWaitingListQueue(pSoldier);
      }
    } else {
      if (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
        // Do nothing here for now...
      }
    }
  }

  // OK, check if we should display line for the guy who does not want
  // to stay
  if (ubNumMercs == 0 && pSoldierWhoWillQuit != null) {
    // OK, he does not want to renew.......
    HandleImportantMercQuote(pSoldierWhoWillQuit, Enum202.QUOTE_MERC_LEAVING_ALSUCO_SOON);

    AddReasonToWaitingListQueue(Enum154.CONTRACT_EXPIRE_WARNING_REASON);
    TacticalCharacterDialogueWithSpecialEvent(pSoldierWhoWillQuit, 0, DIALOGUE_SPECIAL_EVENT_SHOW_UPDATE_MENU, 0, 0);

    pSoldierWhoWillQuit.ubContractRenewalQuoteCode = SOLDIER_CONTRACT_RENEW_QUOTE_115_USED;
  } else {
    // OK, pick one....
    if (ubNumMercs > 0) {
      ubChosenMerc = Random(ubNumMercs);

      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 1, Enum26.MAP_SCREEN, 0, 0, 0);
      HandleImportantMercQuote(MercPtrs[ubPotentialMercs[ubChosenMerc]], Enum202.QUOTE_CONTRACTS_OVER);
      SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE, 0, Enum26.MAP_SCREEN, 0, 0, 0);

      AddReasonToWaitingListQueue(Enum154.CONTRACT_EXPIRE_WARNING_REASON);
      TacticalCharacterDialogueWithSpecialEvent(MercPtrs[ubPotentialMercs[ubChosenMerc]], 0, DIALOGUE_SPECIAL_EVENT_SHOW_UPDATE_MENU, 0, 0);

      MercPtrs[ubPotentialMercs[ubChosenMerc]].ubContractRenewalQuoteCode = SOLDIER_CONTRACT_RENEW_QUOTE_89_USED;
    }
  }
}

function HandleNotifyPlayerCantAffordInsurance(): void {
  DoScreenIndependantMessageBox(zMarksMapScreenText[9], MSG_BOX_FLAG_OK, null);
}

function HandleNotifyPlayerCanAffordInsurance(pSoldier: SOLDIERTYPE, ubLength: UINT8, iCost: INT32): void {
  let sString: string /* CHAR16[128] */;
  let sStringA: string /* CHAR16[32] */;

  // parse the cost
  sStringA = swprintf("%d", iCost);

  // insert the commans and dollar sign
  sStringA = InsertCommasForDollarFigure(sStringA);
  sStringA = InsertDollarSignInToString(sStringA);

  sString = swprintf(zMarksMapScreenText[10], pSoldier.name, sStringA, ubLength);

  // Set the length to the global variable ( so we know how long the contract is in the callback )
  gubContractLength = ubLength;
  gpInsuranceSoldier = pSoldier;

  // Remember the soldier aswell
  pContractReHireSoldier = pSoldier;

  // now pop up the message box
  DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_YESNO, ExtendMercInsuranceContractCallBack);

  return;
}

function ExtendMercInsuranceContractCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    PurchaseOrExtendInsuranceForSoldier(gpInsuranceSoldier, gubContractLength);
  }

  // OK, handle ending of renew session
  if (gfInContractMenuFromRenewSequence) {
    EndCurrentContractRenewal();
  }

  gpInsuranceSoldier = null;
}

function HandleUniqueEventWhenPlayerLeavesTeam(pSoldier: SOLDIERTYPE): void {
  switch (pSoldier.ubProfile) {
    // When iggy leaves the players team,
    case Enum268.IGGY:
      // if he is owed money ( ie the player didnt pay him )
      if (gMercProfiles[pSoldier.ubProfile].iBalance < 0) {
        // iggy is now available to be handled by the enemy
        gubFact[Enum170.FACT_IGGY_AVAILABLE_TO_ARMY] = true;
      }
      break;
  }
}

export function GetHourWhenContractDone(pSoldier: SOLDIERTYPE): UINT32 {
  let uiArriveHour: UINT32;

  // Get the arrival hour - that will give us when they arrived....
  uiArriveHour = ((pSoldier.uiTimeSoldierWillArrive) - (((pSoldier.uiTimeSoldierWillArrive) / 1440) * 1440)) / 60;

  return uiArriveHour;
}

function ContractIsExpiring(pSoldier: SOLDIERTYPE): boolean {
  let uiCheckHour: UINT32;

  // First at least make sure same day....
  if ((pSoldier.iEndofContractTime / 1440) <= GetWorldDay()) {
    uiCheckHour = GetHourWhenContractDone(pSoldier);

    // See if the hour we are on is the same....
    if (GetWorldHour() == uiCheckHour) {
      // All's good for go!
      return true;
    }
  }

  return false;
}

function ContractIsGoingToExpireSoon(pSoldier: SOLDIERTYPE): boolean {
  // get hour contract is going to expire....
  let uiCheckHour: UINT32;

  // First at least make sure same day....
  if ((pSoldier.iEndofContractTime / 1440) <= GetWorldDay()) {
    uiCheckHour = GetHourWhenContractDone(pSoldier);

    // If we are <= 2 hours from expiry.
    if (GetWorldHour() >= (uiCheckHour - 2)) {
      // All's good for go!
      return true;
    }
  }

  return false;
}

}
