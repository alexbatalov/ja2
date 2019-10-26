function DelayEventIfBattleInProgress(pEvent: Pointer<STRATEGICEVENT>): boolean {
  let pNewEvent: Pointer<STRATEGICEVENT>;
  if (gTacticalStatus.fEnemyInSector) {
    pNewEvent = AddAdvancedStrategicEvent(pEvent.value.ubEventType, pEvent.value.ubCallbackID, pEvent.value.uiTimeStamp + 180 + Random(121), pEvent.value.uiParam);
    Assert(pNewEvent);
    pNewEvent.value.uiTimeOffset = pEvent.value.uiTimeOffset;
    return true;
  }
  return false;
}

export function ExecuteStrategicEvent(pEvent: Pointer<STRATEGICEVENT>): boolean {
  let fOrigPreventFlag: boolean;

  fOrigPreventFlag = gfPreventDeletionOfAnyEvent;
  gfPreventDeletionOfAnyEvent = true;
  // No events can be posted before this time when gfProcessingGameEvents is set, otherwise,
  // we have a chance of running into an infinite loop.
  guiTimeStampOfCurrentlyExecutingEvent = pEvent.value.uiTimeStamp;

  if (pEvent.value.ubFlags & SEF_DELETION_PENDING) {
    gfPreventDeletionOfAnyEvent = fOrigPreventFlag;
    return false;
  }

  // Look at the ID of event and do stuff according to that!
  switch (pEvent.value.ubCallbackID) {
    case Enum132.EVENT_CHANGELIGHTVAL:
      // Change light to value
      gubEnvLightValue = pEvent.value.uiParam;
      if (!gfBasement && !gfCaves)
        gfDoLighting = true;
      break;
    case Enum132.EVENT_CHECKFORQUESTS:
      CheckForQuests(GetWorldDay());
      break;
    case Enum132.EVENT_AMBIENT:
      if (pEvent.value.ubEventType == Enum133.ENDRANGED_EVENT) {
        if (pEvent.value.uiParam != NO_SAMPLE) {
          SoundRemoveSampleFlags(pEvent.value.uiParam, SAMPLE_RANDOM);
        }
      } else {
        pEvent.value.uiParam = SetupNewAmbientSound(pEvent.value.uiParam);
      }
      break;
    case Enum132.EVENT_AIM_RESET_MERC_ANNOYANCE:
      ResetMercAnnoyanceAtPlayer(pEvent.value.uiParam);
      break;
    // The players purchase from Bobby Ray has arrived
    case Enum132.EVENT_BOBBYRAY_PURCHASE:
      BobbyRayPurchaseEventCallback(pEvent.value.uiParam);
      break;
    // Gets called once a day ( at BOBBYRAY_UPDATE_TIME).  To simulate the items being bought and sold at bobby rays
    case Enum132.EVENT_DAILY_UPDATE_BOBBY_RAY_INVENTORY:
      DailyUpdateOfBobbyRaysNewInventory();
      DailyUpdateOfBobbyRaysUsedInventory();
      DailyUpdateOfArmsDealersInventory();
      break;
    // Add items to BobbyR's new/used inventory
    case Enum132.EVENT_UPDATE_BOBBY_RAY_INVENTORY:
      AddFreshBobbyRayInventory(pEvent.value.uiParam);
      break;
    // Called once a day to update the number of days that a hired merc from M.E.R.C. has been on contract.
    // Also if the player hasn't paid for a while Specks will start sending e-mails to the player
    case Enum132.EVENT_DAILY_UPDATE_OF_MERC_SITE:
      DailyUpdateOfMercSite(GetWorldDay());
      break;
    case Enum132.EVENT_DAY3_ADD_EMAIL_FROM_SPECK:
      AddEmail(MERC_INTRO, MERC_INTRO_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());
      break;
    case Enum132.EVENT_DAY2_ADD_EMAIL_FROM_IMP:
      AddEmail(IMP_EMAIL_PROFILE_RESULTS, IMP_EMAIL_PROFILE_RESULTS_LENGTH, Enum75.IMP_PROFILE_RESULTS, GetWorldTotalMin());
      break;
    // If a merc gets hired and they dont show up immediately, the merc gets added to the queue and shows up
    // uiTimeTillMercArrives  minutes later
    case Enum132.EVENT_DELAYED_HIRING_OF_MERC:
      MercArrivesCallback(pEvent.value.uiParam);
      break;
    // handles the life insurance contract for a merc from AIM.
    case Enum132.EVENT_HANDLE_INSURED_MERCS:
      DailyUpdateOfInsuredMercs();
      break;
    // handles when a merc is killed an there is a life insurance payout
    case Enum132.EVENT_PAY_LIFE_INSURANCE_FOR_DEAD_MERC:
      InsuranceContractPayLifeInsuranceForDeadMerc(pEvent.value.uiParam);
      break;
    // gets called every day at midnight.
    case Enum132.EVENT_MERC_DAILY_UPDATE:
      MercDailyUpdate();
      break;
    // gets when a merc is about to leave.
    case Enum132.EVENT_MERC_ABOUT_TO_LEAVE_COMMENT:
      break;
    // show the update menu
    case (Enum132.EVENT_SHOW_UPDATE_MENU):
      AddDisplayBoxToWaitingQueue();
      break;
    case Enum132.EVENT_MERC_ABOUT_TO_LEAVE:
      FindOutIfAnyMercAboutToLeaveIsGonnaRenew();
      break;
    // When a merc is supposed to leave
    case Enum132.EVENT_MERC_CONTRACT_OVER:
      MercsContractIsFinished(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_ADDSOLDIER_TO_UPDATE_BOX:
      // if the grunt is currently active, add to update box
      if (Menptr[pEvent.value.uiParam].bActive) {
        AddSoldierToWaitingListQueue(addressof(Menptr[pEvent.value.uiParam]));
      }
      break;
    case Enum132.EVENT_SET_MENU_REASON:
      AddReasonToWaitingListQueue(pEvent.value.uiParam);
      break;
    // Whenever any group (player or enemy) arrives in a new sector during movement.
    case Enum132.EVENT_GROUP_ARRIVAL:
      // ValidateGameEvents();
      GroupArrivedAtSector(pEvent.value.uiParam, true, false);
      // ValidateGameEvents();
      break;
    case Enum132.EVENT_MERC_COMPLAIN_EQUIPMENT:
      MercComplainAboutEquipment(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_HOURLY_UPDATE:
      HandleHourlyUpdate();
      break;
    case Enum132.EVENT_MINUTE_UPDATE:
      HandleMinuteUpdate();
      break;
    case Enum132.EVENT_HANDLE_MINE_INCOME:
      HandleIncomeFromMines();
      // ScreenMsg( FONT_MCOLOR_DKRED, MSG_INTERFACE, L"Income From Mines at %d", GetWorldTotalMin( ) );
      break;
    case Enum132.EVENT_SETUP_MINE_INCOME:
      PostEventsForMineProduction();
      break;
    case Enum132.EVENT_SETUP_TOWN_OPINION:
      PostEventsForSpreadOfTownOpinion();
      break;
    case Enum132.EVENT_HANDLE_TOWN_OPINION:
      HandleSpreadOfAllTownsOpinion();
      break;
    case Enum132.EVENT_SET_BY_NPC_SYSTEM:
      HandleNPCSystemEvent(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_SECOND_AIRPORT_ATTENDANT_ARRIVED:
      AddSecondAirportAttendant();
      break;
    case Enum132.EVENT_HELICOPTER_HOVER_TOO_LONG:
      HandleHeliHoverLong();
      break;
    case Enum132.EVENT_HELICOPTER_HOVER_WAY_TOO_LONG:
      HandleHeliHoverTooLong();
      break;
    case Enum132.EVENT_MERC_LEAVE_EQUIP_IN_DRASSEN:
      HandleEquipmentLeftInDrassen(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_MERC_LEAVE_EQUIP_IN_OMERTA:
      HandleEquipmentLeftInOmerta(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_BANDAGE_BLEEDING_MERCS:
      BandageBleedingDyingPatientsBeingTreated();
      break;
    case Enum132.EVENT_DAILY_EARLY_MORNING_EVENTS:
      HandleEarlyMorningEvents();
      break;
    case Enum132.EVENT_GROUP_ABOUT_TO_ARRIVE:
      HandleGroupAboutToArrive();
      break;
    case Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE:
      ProcessTacticalSchedule(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_BEGINRAINSTORM:
      // EnvBeginRainStorm( (UINT8)pEvent->uiParam );
      break;
    case Enum132.EVENT_ENDRAINSTORM:
      // EnvEndRainStorm( );
      break;
    case Enum132.EVENT_RAINSTORM:

      // ATE: Disabled
      //
      // if( pEvent->ubEventType == ENDRANGED_EVENT )
      //{
      //	EnvEndRainStorm( );
      //}
      // else
      //{
      //	EnvBeginRainStorm( (UINT8)pEvent->uiParam );
      //}
      break;

    case Enum132.EVENT_MAKE_CIV_GROUP_HOSTILE_ON_NEXT_SECTOR_ENTRANCE:
      MakeCivGroupHostileOnNextSectorEntrance(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_BEGIN_AIR_RAID:
      BeginAirRaid();
      break;
    case Enum132.EVENT_MEANWHILE:
      if (!DelayEventIfBattleInProgress(pEvent)) {
        BeginMeanwhile(pEvent.value.uiParam);
        InterruptTime();
      }
      break;
    case Enum132.EVENT_BEGIN_CREATURE_QUEST:
      break;
    case Enum132.EVENT_CREATURE_SPREAD:
      SpreadCreatures();
      break;
    case Enum132.EVENT_DECAY_CREATURES:
      DecayCreatures();
      break;
    case Enum132.EVENT_CREATURE_NIGHT_PLANNING:
      CreatureNightPlanning();
      break;
    case Enum132.EVENT_CREATURE_ATTACK:
      CreatureAttackTown(pEvent.value.uiParam, false);
      break;
    case Enum132.EVENT_EVALUATE_QUEEN_SITUATION:
      EvaluateQueenSituation();
      break;
    case Enum132.EVENT_CHECK_ENEMY_CONTROLLED_SECTOR:
      CheckEnemyControlledSector(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_TURN_ON_NIGHT_LIGHTS:
      TurnOnNightLights();
      break;
    case Enum132.EVENT_TURN_OFF_NIGHT_LIGHTS:
      TurnOffNightLights();
      break;
    case Enum132.EVENT_TURN_ON_PRIME_LIGHTS:
      TurnOnPrimeLights();
      break;
    case Enum132.EVENT_TURN_OFF_PRIME_LIGHTS:
      TurnOffPrimeLights();
      break;
    case Enum132.EVENT_INTERRUPT_TIME:
      InterruptTime();
      break;
    case Enum132.EVENT_ENRICO_MAIL:
      HandleEnricoEmail();
      break;
    case Enum132.EVENT_INSURANCE_INVESTIGATION_STARTED:
      StartInsuranceInvestigation(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_INSURANCE_INVESTIGATION_OVER:
      EndInsuranceInvestigation(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_TEMPERATURE_UPDATE:
      UpdateTemperature(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_KEITH_GOING_OUT_OF_BUSINESS:
      // make sure killbillies are still alive, if so, set fact 274 true
      if (CheckFact(Enum170.FACT_HILLBILLIES_KILLED, Enum268.KEITH) == false) {
        // s et the fact true keith is out of business
        SetFactTrue(Enum170.FACT_KEITH_OUT_OF_BUSINESS);
      }
      break;
    case Enum132.EVENT_MERC_SITE_BACK_ONLINE:
      GetMercSiteBackOnline();
      break;
    case Enum132.EVENT_INVESTIGATE_SECTOR:
      InvestigateSector(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_CHECK_IF_MINE_CLEARED:
      // If so, the head miner will say so, and the mine's shutdown will be ended.
      HourlyMinesUpdate(); // not-so hourly, in this case!
      break;
    case Enum132.EVENT_REMOVE_ASSASSIN:
      RemoveAssassin(pEvent.value.uiParam);
      break;
    case Enum132.EVENT_BEGIN_CONTRACT_RENEWAL_SEQUENCE:
      BeginContractRenewalSequence();
      break;
    case Enum132.EVENT_RPC_WHINE_ABOUT_PAY:
      RPCWhineAboutNoPay(pEvent.value.uiParam);
      break;

    case Enum132.EVENT_HAVENT_MADE_IMP_CHARACTER_EMAIL:
      HaventMadeImpMercEmailCallBack();
      break;

    case Enum132.EVENT_QUARTER_HOUR_UPDATE:
      HandleQuarterHourUpdate();
      break;

    case Enum132.EVENT_MERC_MERC_WENT_UP_LEVEL_EMAIL_DELAY:
      MERCMercWentUpALevelSendEmail(pEvent.value.uiParam);
      break;

    case Enum132.EVENT_MERC_SITE_NEW_MERC_AVAILABLE:
      NewMercsAvailableAtMercSiteCallBack();
      break;
  }
  gfPreventDeletionOfAnyEvent = fOrigPreventFlag;
  return true;
}
