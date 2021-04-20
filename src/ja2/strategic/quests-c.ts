namespace ja2 {

export let gubQuest: UINT8[] /* [MAX_QUESTS] */ = createArray(MAX_QUESTS, 0);
// Because FACT_MIKE_AVAILABLE_TO_ARMY and FACT_IGGY_AVAILABLE_TO_ARMY use
// values 0, 1 and 2 this array cannot be boolean[]. On the other hand I don't
// want to express it as number[] because it affects many modules and doing
// so will introduce too many compiler errors.
export let gubFact: (boolean | number)[] /* UINT8[NUM_FACTS] */ = createArray(NUM_FACTS, false); // this has to be updated when we figure out how many facts we have

let gsFoodQuestSectorX: INT16;
let gsFoodQuestSectorY: INT16;

export function SetFactTrue(usFact: UINT16): void {
  // This function is here just for control flow purposes (debug breakpoints)
  // and code is more readable that way

  // must intercept when Jake is first trigered to start selling fuel
  if ((usFact == Enum170.FACT_ESTONI_REFUELLING_POSSIBLE) && (CheckFact(usFact, 0) == false)) {
    // give him some gas...
    GuaranteeAtLeastXItemsOfIndex(Enum197.ARMS_DEALER_JAKE, Enum225.GAS_CAN, (4 + Random(3)));
  }

  gubFact[usFact] = true;
}

export function SetFactFalse(usFact: UINT16): void {
  gubFact[usFact] = false;
}

function CheckForNewShipment(): boolean {
  let pItemPool: ITEM_POOL | null;

  if ((gWorldSectorX == BOBBYR_SHIPPING_DEST_SECTOR_X) && (gWorldSectorY == BOBBYR_SHIPPING_DEST_SECTOR_Y) && (gbWorldSectorZ == BOBBYR_SHIPPING_DEST_SECTOR_Z)) {
    if ((pItemPool = GetItemPool(BOBBYR_SHIPPING_DEST_GRIDNO, 0))) {
      return !(ITEMPOOL_VISIBLE(pItemPool));
    }
  }
  return false;
}

function CheckNPCWounded(ubProfileID: UINT8, fByPlayerOnly: boolean): boolean {
  let pSoldier: SOLDIERTYPE | null;

  // is the NPC is wounded at all?
  pSoldier = FindSoldierByProfileID(ubProfileID, false);
  if (pSoldier && pSoldier.bLife < pSoldier.bLifeMax) {
    if (fByPlayerOnly) {
      if (gMercProfiles[ubProfileID].ubMiscFlags & PROFILE_MISC_FLAG_WOUNDEDBYPLAYER) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function CheckNPCInOkayHealth(ubProfileID: UINT8): boolean {
  let pSoldier: SOLDIERTYPE | null;

  // is the NPC at better than half health?
  pSoldier = FindSoldierByProfileID(ubProfileID, false);
  if (pSoldier && pSoldier.bLife > Math.trunc(pSoldier.bLifeMax / 2) && pSoldier.bLife > 30) {
    return true;
  } else {
    return false;
  }
}

function CheckNPCBleeding(ubProfileID: UINT8): boolean {
  let pSoldier: SOLDIERTYPE | null;

  // the NPC is wounded...
  pSoldier = FindSoldierByProfileID(ubProfileID, false);
  if (pSoldier && pSoldier.bLife > 0 && pSoldier.bBleeding > 0) {
    return true;
  } else {
    return false;
  }
}

function CheckNPCWithin(ubFirstNPC: UINT8, ubSecondNPC: UINT8, ubMaxDistance: UINT8): boolean {
  let pFirstNPC: SOLDIERTYPE | null;
  let pSecondNPC: SOLDIERTYPE | null;

  pFirstNPC = FindSoldierByProfileID(ubFirstNPC, false);
  pSecondNPC = FindSoldierByProfileID(ubSecondNPC, false);
  if (!pFirstNPC || !pSecondNPC) {
    return false;
  }
  return PythSpacesAway(pFirstNPC.sGridNo, pSecondNPC.sGridNo) <= ubMaxDistance;
}

function CheckGuyVisible(ubNPC: UINT8, ubGuy: UINT8): boolean {
  // NB ONLY WORKS IF ON DIFFERENT TEAMS
  let pNPC: SOLDIERTYPE | null;
  let pGuy: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubNPC, false);
  pGuy = FindSoldierByProfileID(ubGuy, false);
  if (!pNPC || !pGuy) {
    return false;
  }
  if (pNPC.bOppList[pGuy.ubID] == SEEN_CURRENTLY) {
    return true;
  } else {
    return false;
  }
}

function CheckNPCAt(ubNPC: UINT8, sGridNo: INT16): boolean {
  let pNPC: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubNPC, false);
  if (!pNPC) {
    return false;
  }
  return pNPC.sGridNo == sGridNo;
}

function CheckNPCIsEnemy(ubProfileID: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return false;
  }
  if (pNPC.bSide == gbPlayerNum || pNPC.bNeutral) {
    if (pNPC.ubCivilianGroup != Enum246.NON_CIV_GROUP) {
      // although the soldier is NOW the same side, this civ group could be set to "will become hostile"
      return gTacticalStatus.fCivGroupHostile[pNPC.ubCivilianGroup] >= CIV_GROUP_WILL_BECOME_HOSTILE;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

function CheckIfMercIsNearNPC(pMerc: SOLDIERTYPE, ubProfileId: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;
  let sGridNo: INT16;

  // no merc nearby?
  if (pMerc == null) {
    return false;
  }

  pNPC = FindSoldierByProfileID(ubProfileId, false);
  if (pNPC == null) {
    return false;
  }
  sGridNo = pNPC.sGridNo;

  // is the merc and NPC close enough?
  if (PythSpacesAway(sGridNo, pMerc.sGridNo) <= 9) {
    return true;
  }

  return false;
}

function NumWoundedMercsNearby(ubProfileID: UINT8): INT8 {
  let bNumber: INT8 = 0;
  let uiLoop: UINT32;
  let pNPC: SOLDIERTYPE | null;
  let pSoldier: SOLDIERTYPE | null;
  let sGridNo: INT16;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return 0;
  }
  sGridNo = pNPC.sGridNo;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier && pSoldier.bTeam == gbPlayerNum && pSoldier.bLife > 0 && pSoldier.bLife < pSoldier.bLifeMax && pSoldier.bAssignment != Enum117.ASSIGNMENT_HOSPITAL) {
      if (PythSpacesAway(sGridNo, pSoldier.sGridNo) <= HOSPITAL_PATIENT_DISTANCE) {
        bNumber++;
      }
    }
  }

  return bNumber;
}

function NumMercsNear(ubProfileID: UINT8, ubMaxDist: UINT8): INT8 {
  let bNumber: INT8 = 0;
  let uiLoop: UINT32;
  let pNPC: SOLDIERTYPE | null;
  let pSoldier: SOLDIERTYPE | null;
  let sGridNo: INT16;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return 0;
  }
  sGridNo = pNPC.sGridNo;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier && pSoldier.bTeam == gbPlayerNum && pSoldier.bLife >= OKLIFE) {
      if (PythSpacesAway(sGridNo, pSoldier.sGridNo) <= ubMaxDist) {
        bNumber++;
      }
    }
  }

  return bNumber;
}

function CheckNPCIsEPC(ubProfileID: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;

  if (gMercProfiles[ubProfileID].bMercStatus == MERC_IS_DEAD) {
    return false;
  }

  pNPC = FindSoldierByProfileID(ubProfileID, true);
  if (!pNPC) {
    return false;
  }
  return pNPC.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC;
}

export function NPCInRoom(ubProfileID: UINT8, ubRoomID: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC || (gubWorldRoomInfo[pNPC.sGridNo] != ubRoomID)) {
    return false;
  }
  return true;
}

function NPCInRoomRange(ubProfileID: UINT8, ubRoomID1: UINT8, ubRoomID2: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC || (gubWorldRoomInfo[pNPC.sGridNo] < ubRoomID1) || (gubWorldRoomInfo[pNPC.sGridNo] > ubRoomID2)) {
    return false;
  }
  return true;
}

function PCInSameRoom(ubProfileID: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;
  let ubRoom: UINT8;
  let bLoop: INT8;
  let pSoldier: SOLDIERTYPE;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return false;
  }
  ubRoom = gubWorldRoomInfo[pNPC.sGridNo];

  for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++) {
    pSoldier = MercPtrs[bLoop];
    if (pSoldier && pSoldier.bActive && pSoldier.bInSector) {
      if (gubWorldRoomInfo[pSoldier.sGridNo] == ubRoom) {
        return true;
      }
    }
  }

  return false;
}

function CheckTalkerStrong(): boolean {
  if (gpSrcSoldier && gpSrcSoldier.bTeam == gbPlayerNum) {
    return gpSrcSoldier.bStrength >= 84;
  } else if (gpDestSoldier && gpDestSoldier.bTeam == gbPlayerNum) {
    return gpDestSoldier.bStrength >= 84;
  }
  return false;
}

function CheckTalkerFemale(): boolean {
  if (gpSrcSoldier && gpSrcSoldier.bTeam == gbPlayerNum && gpSrcSoldier.ubProfile != NO_PROFILE) {
    return gMercProfiles[gpSrcSoldier.ubProfile].bSex == Enum272.FEMALE;
  } else if (gpDestSoldier && gpDestSoldier.bTeam == gbPlayerNum && gpDestSoldier.ubProfile != NO_PROFILE) {
    return gMercProfiles[gpDestSoldier.ubProfile].bSex == Enum272.FEMALE;
  }
  return false;
}

function CheckTalkerUnpropositionedFemale(): boolean {
  if (gpSrcSoldier && gpSrcSoldier.bTeam == gbPlayerNum && gpSrcSoldier.ubProfile != NO_PROFILE) {
    if (!(gMercProfiles[gpSrcSoldier.ubProfile].ubMiscFlags2 & PROFILE_MISC_FLAG2_ASKED_BY_HICKS)) {
      return gMercProfiles[gpSrcSoldier.ubProfile].bSex == Enum272.FEMALE;
    }
  } else if (gpDestSoldier && gpDestSoldier.bTeam == gbPlayerNum && gpDestSoldier.ubProfile != NO_PROFILE) {
    if (!(gMercProfiles[gpDestSoldier.ubProfile].ubMiscFlags2 & PROFILE_MISC_FLAG2_ASKED_BY_HICKS)) {
      return gMercProfiles[gpDestSoldier.ubProfile].bSex == Enum272.FEMALE;
    }
  }
  return false;
}

function NumMalesPresent(ubProfileID: UINT8): INT8 {
  let bNumber: INT8 = 0;
  let uiLoop: UINT32;
  let pNPC: SOLDIERTYPE | null;
  let pSoldier: SOLDIERTYPE;
  let sGridNo: INT16;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return 0;
  }
  sGridNo = pNPC.sGridNo;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier && pSoldier.bTeam == gbPlayerNum && pSoldier.bLife >= OKLIFE) {
      if (pSoldier.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.ubProfile].bSex == Enum272.MALE) {
        if (PythSpacesAway(sGridNo, pSoldier.sGridNo) <= 8) {
          bNumber++;
        }
      }
    }
  }

  return bNumber;
}

function FemalePresent(ubProfileID: UINT8): boolean {
  let uiLoop: UINT32;
  let pNPC: SOLDIERTYPE | null;
  let pSoldier: SOLDIERTYPE;
  let sGridNo: INT16;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return false;
  }
  sGridNo = pNPC.sGridNo;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier && pSoldier.bTeam == gbPlayerNum && pSoldier.bLife >= OKLIFE) {
      if (pSoldier.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.ubProfile].bSex == Enum272.FEMALE) {
        if (PythSpacesAway(sGridNo, pSoldier.sGridNo) <= 10) {
          return true;
        }
      }
    }
  }

  return false;
}

function CheckPlayerHasHead(): boolean {
  let bLoop: INT8;
  let pSoldier: SOLDIERTYPE;

  for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++) {
    pSoldier = MercPtrs[bLoop];

    if (pSoldier.bActive && pSoldier.bLife > 0) {
      if (FindObjInObjRange(pSoldier, Enum225.HEAD_2, Enum225.HEAD_7) != NO_SLOT) {
        return true;
      }
    }
  }

  return false;
}

function CheckNPCSector(ubProfileID: UINT8, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let pSoldier: SOLDIERTYPE | null;

  pSoldier = FindSoldierByProfileID(ubProfileID, true);

  if (pSoldier) {
    if (pSoldier.sSectorX == sSectorX && pSoldier.sSectorY == sSectorY && pSoldier.bSectorZ == bSectorZ) {
      return true;
    }
  } else if (gMercProfiles[ubProfileID].sSectorX == sSectorX && gMercProfiles[ubProfileID].sSectorY == sSectorY && gMercProfiles[ubProfileID].bSectorZ == bSectorZ) {
    return true;
  }

  return false;
}

function AIMMercWithin(sGridNo: INT16, sDistance: INT16): boolean {
  let uiLoop: UINT32;
  let pSoldier: SOLDIERTYPE;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier && (pSoldier.bTeam == gbPlayerNum) && (pSoldier.bLife >= OKLIFE) && (pSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC)) {
      if (PythSpacesAway(sGridNo, pSoldier.sGridNo) <= sDistance) {
        return true;
      }
    }
  }

  return false;
}

function CheckNPCCowering(ubProfileID: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return false;
  }
  return (pNPC.uiStatusFlags & SOLDIER_COWERING) != 0;
}

function CountBartenders(): UINT8 {
  let ubLoop: UINT8;
  let ubBartenders: UINT8 = 0;

  for (ubLoop = Enum268.HERVE; ubLoop <= Enum268.CARLO; ubLoop++) {
    if (gMercProfiles[ubLoop].bNPCData != 0) {
      ubBartenders++;
    }
  }
  return ubBartenders;
}

function CheckNPCIsUnderFire(ubProfileID: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return false;
  }
  return pNPC.bUnderFire != 0;
}

function NPCHeardShot(ubProfileID: UINT8): boolean {
  let pNPC: SOLDIERTYPE | null;

  pNPC = FindSoldierByProfileID(ubProfileID, false);
  if (!pNPC) {
    return false;
  }
  return Boolean(pNPC.ubMiscSoldierFlags & SOLDIER_MISC_HEARD_GUNSHOT);
}

function InTownSectorWithTrainingLoyalty(sSectorX: INT16, sSectorY: INT16): boolean {
  let ubTown: UINT8;

  ubTown = GetTownIdForSector(sSectorX, sSectorY);
  if ((ubTown != Enum135.BLANK_SECTOR) && gTownLoyalty[ubTown].fStarted && gfTownUsesLoyalty[ubTown]) {
    return gTownLoyalty[ubTown].ubRating >= MIN_RATING_TO_TRAIN_TOWN;
  } else {
    return false;
  }
}

export function CheckFact(usFact: UINT16, ubProfileID: UINT8): boolean {
  let bTown: INT8 = -1;

  switch (usFact) {
    case Enum170.FACT_DIMITRI_DEAD:
      gubFact[usFact] = (gMercProfiles[Enum268.DIMITRI].bMercStatus == MERC_IS_DEAD);
      break;
    case Enum170.FACT_CURRENT_SECTOR_IS_SAFE:
      gubFact[Enum170.FACT_CURRENT_SECTOR_IS_SAFE] = !(((gTacticalStatus.fEnemyInSector && NPCHeardShot(ubProfileID)) || gTacticalStatus.uiFlags & INCOMBAT));
      break;
    case Enum170.FACT_BOBBYRAY_SHIPMENT_IN_TRANSIT:
    case Enum170.FACT_NEW_BOBBYRAY_SHIPMENT_WAITING:
      if (gubFact[Enum170.FACT_PABLO_PUNISHED_BY_PLAYER] == true && gubFact[Enum170.FACT_PABLO_RETURNED_GOODS] == false && gMercProfiles[Enum268.PABLO].bMercStatus != MERC_IS_DEAD) {
        gubFact[Enum170.FACT_BOBBYRAY_SHIPMENT_IN_TRANSIT] = false;
        gubFact[Enum170.FACT_NEW_BOBBYRAY_SHIPMENT_WAITING] = false;
      } else {
        if (CheckForNewShipment()) // if new stuff waiting unseen in Drassen
        {
          gubFact[Enum170.FACT_BOBBYRAY_SHIPMENT_IN_TRANSIT] = false;
          gubFact[Enum170.FACT_NEW_BOBBYRAY_SHIPMENT_WAITING] = true;
        } else if (CountNumberOfBobbyPurchasesThatAreInTransit() > 0) // if stuff in transit
        {
          if (gubFact[Enum170.FACT_PACKAGE_DAMAGED] == true) {
            gubFact[Enum170.FACT_BOBBYRAY_SHIPMENT_IN_TRANSIT] = false;
          } else {
            gubFact[Enum170.FACT_BOBBYRAY_SHIPMENT_IN_TRANSIT] = true;
          }
          gubFact[Enum170.FACT_NEW_BOBBYRAY_SHIPMENT_WAITING] = false;
        } else {
          gubFact[Enum170.FACT_BOBBYRAY_SHIPMENT_IN_TRANSIT] = false;
          gubFact[Enum170.FACT_NEW_BOBBYRAY_SHIPMENT_WAITING] = false;
        }
      }
      break;
    case Enum170.FACT_NPC_WOUNDED:
      gubFact[Enum170.FACT_NPC_WOUNDED] = CheckNPCWounded(ubProfileID, false);
      break;
    case Enum170.FACT_NPC_WOUNDED_BY_PLAYER:
      gubFact[Enum170.FACT_NPC_WOUNDED_BY_PLAYER] = CheckNPCWounded(ubProfileID, true);
      break;
    case Enum170.FACT_IRA_NOT_PRESENT:
      gubFact[Enum170.FACT_IRA_NOT_PRESENT] = !CheckNPCWithin(ubProfileID, Enum268.IRA, 10);
      break;
    case Enum170.FACT_IRA_TALKING:
      gubFact[Enum170.FACT_IRA_TALKING] = (gubSrcSoldierProfile == 59);
      break;
    case Enum170.FACT_IRA_UNHIRED_AND_ALIVE:
      if (gMercProfiles[Enum268.IRA].bMercStatus != MERC_IS_DEAD && CheckNPCSector(Enum268.IRA, 10, 1, 1) && !(gMercProfiles[Enum268.IRA].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED)) {
        gubFact[Enum170.FACT_IRA_UNHIRED_AND_ALIVE] = true;
      } else {
        gubFact[Enum170.FACT_IRA_UNHIRED_AND_ALIVE] = false;
      }
      break;
    case Enum170.FACT_NPC_BLEEDING:
      gubFact[Enum170.FACT_NPC_BLEEDING] = CheckNPCBleeding(ubProfileID);
      break;
    case Enum170.FACT_NPC_BLEEDING_BUT_OKAY:
      if (CheckNPCBleeding(ubProfileID) && CheckNPCInOkayHealth(ubProfileID)) {
        gubFact[Enum170.FACT_NPC_BLEEDING_BUT_OKAY] = true;
      } else {
        gubFact[Enum170.FACT_NPC_BLEEDING_BUT_OKAY] = false;
      }
      break;

    case Enum170.FACT_PLAYER_HAS_HEAD_AND_CARMEN_IN_SAN_MONA:
      gubFact[usFact] = (CheckNPCSector(Enum268.CARMEN, 5, MAP_ROW_C, 0) && CheckPlayerHasHead());
      break;

    case Enum170.FACT_PLAYER_HAS_HEAD_AND_CARMEN_IN_CAMBRIA:
      gubFact[usFact] = (CheckNPCSector(Enum268.CARMEN, 9, MAP_ROW_G, 0) && CheckPlayerHasHead());
      break;

    case Enum170.FACT_PLAYER_HAS_HEAD_AND_CARMEN_IN_DRASSEN:
      gubFact[usFact] = (CheckNPCSector(Enum268.CARMEN, 13, MAP_ROW_C, 0) && CheckPlayerHasHead());
      break;

    case Enum170.FACT_NPC_OWED_MONEY:
      gubFact[Enum170.FACT_NPC_OWED_MONEY] = (gMercProfiles[ubProfileID].iBalance < 0);
      break;

    case Enum170.FACT_FATHER_DRUNK:
      gubFact[Enum170.FACT_FATHER_DRUNK] = (gMercProfiles[Enum268.FATHER].bNPCData >= 5);
      break;

    case Enum170.FACT_MICKY_DRUNK:
      gubFact[Enum170.FACT_MICKY_DRUNK] = (gMercProfiles[Enum268.MICKY].bNPCData >= 5);
      break;

    case Enum170.FACT_BRENDA_IN_STORE_AND_ALIVE:
      // ensure alive
      if (gMercProfiles[85].bMercStatus == MERC_IS_DEAD) {
        gubFact[Enum170.FACT_BRENDA_IN_STORE_AND_ALIVE] = false;
      }
      // ensure in a building and nearby
      else if (!(NPCInRoom(85, 47))) {
        gubFact[Enum170.FACT_BRENDA_IN_STORE_AND_ALIVE] = false;
      } else {
        gubFact[Enum170.FACT_BRENDA_IN_STORE_AND_ALIVE] = CheckNPCWithin(ubProfileID, 85, 12);
      }
      break;
    case Enum170.FACT_BRENDA_DEAD:
      gubFact[Enum170.FACT_BRENDA_DEAD] = (gMercProfiles[85].bMercStatus == MERC_IS_DEAD);
      break;
    case Enum170.FACT_NPC_IS_ENEMY:
      gubFact[Enum170.FACT_NPC_IS_ENEMY] = CheckNPCIsEnemy(ubProfileID) || Boolean(gMercProfiles[ubProfileID].ubMiscFlags2 & PROFILE_MISC_FLAG2_NEEDS_TO_SAY_HOSTILE_QUOTE);
      break;
      /*
case FACT_SKYRIDER_CLOSE_TO_CHOPPER:
      SetUpHelicopterForPlayer( 13, MAP_ROW_B );
      break;
      */
    case Enum170.FACT_SPIKE_AT_DOOR:
      gubFact[Enum170.FACT_SPIKE_AT_DOOR] = CheckNPCAt(93, 9817);
      break;
    case Enum170.FACT_WOUNDED_MERCS_NEARBY:
      gubFact[usFact] = (NumWoundedMercsNearby(ubProfileID) > 0);
      break;
    case Enum170.FACT_ONE_WOUNDED_MERC_NEARBY:
      gubFact[usFact] = (NumWoundedMercsNearby(ubProfileID) == 1);
      break;
    case Enum170.FACT_MULTIPLE_WOUNDED_MERCS_NEARBY:
      gubFact[usFact] = (NumWoundedMercsNearby(ubProfileID) > 1);
      break;
    case Enum170.FACT_HANS_AT_SPOT:
      gubFact[usFact] = CheckNPCAt(117, 13523);
      break;
    case Enum170.FACT_MULTIPLE_MERCS_CLOSE:
      gubFact[usFact] = (NumMercsNear(ubProfileID, 3) > 1);
      break;
    case Enum170.FACT_SOME_MERCS_CLOSE:
      gubFact[usFact] = (NumMercsNear(ubProfileID, 3) > 0);
      break;
    case Enum170.FACT_MARIA_ESCORTED:
      gubFact[usFact] = CheckNPCIsEPC(Enum268.MARIA);
      break;
    case Enum170.FACT_JOEY_ESCORTED:
      gubFact[usFact] = CheckNPCIsEPC(Enum268.JOEY);
      break;
    case Enum170.FACT_ESCORTING_SKYRIDER:
      gubFact[usFact] = CheckNPCIsEPC(Enum268.SKYRIDER);
      break;
    case Enum170.FACT_MARIA_ESCORTED_AT_LEATHER_SHOP:
      gubFact[usFact] = (CheckNPCIsEPC(Enum268.MARIA) && (NPCInRoom(Enum268.MARIA, 2)));
      break;
    case Enum170.FACT_PC_STRONG_AND_LESS_THAN_3_MALES_PRESENT:
      gubFact[usFact] = (CheckTalkerStrong() && (NumMalesPresent(ubProfileID) < 3));
      break;
    case Enum170.FACT_PC_STRONG_AND_3_PLUS_MALES_PRESENT:
      gubFact[usFact] = (CheckTalkerStrong() && (NumMalesPresent(ubProfileID) >= 3));
      break;
    case Enum170.FACT_FEMALE_SPEAKING_TO_NPC:
      gubFact[usFact] = CheckTalkerFemale();
      break;
    case Enum170.FACT_CARMEN_IN_C5:
      gubFact[usFact] = CheckNPCSector(78, 5, MAP_ROW_C, 0);
      break;
    case Enum170.FACT_JOEY_IN_C5:
      gubFact[usFact] = CheckNPCSector(90, 5, MAP_ROW_C, 0);
      break;
    case Enum170.FACT_JOEY_NEAR_MARTHA:
      gubFact[usFact] = CheckNPCWithin(90, 109, 5) && (CheckGuyVisible(Enum268.MARTHA, Enum268.JOEY) || CheckGuyVisible(Enum268.JOEY, Enum268.MARTHA));
      break;
    case Enum170.FACT_JOEY_DEAD:
      gubFact[usFact] = gMercProfiles[Enum268.JOEY].bMercStatus == MERC_IS_DEAD;
      break;
    case Enum170.FACT_MERC_NEAR_MARTHA:
      gubFact[usFact] = (NumMercsNear(ubProfileID, 5) > 0);
      break;
    case Enum170.FACT_REBELS_HATE_PLAYER:
      gubFact[usFact] = (gTacticalStatus.fCivGroupHostile[Enum246.REBEL_CIV_GROUP] == CIV_GROUP_HOSTILE);
      break;
    case Enum170.FACT_CURRENT_SECTOR_G9:
      gubFact[usFact] = (gWorldSectorX == 9 && gWorldSectorY == MAP_ROW_G && gbWorldSectorZ == 0);
      break;
    case Enum170.FACT_CURRENT_SECTOR_C5:
      gubFact[usFact] = (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0);
      break;
    case Enum170.FACT_CURRENT_SECTOR_C13:
      gubFact[usFact] = (gWorldSectorX == 13 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0);
      break;
    case Enum170.FACT_CARMEN_HAS_TEN_THOUSAND:
      gubFact[usFact] = (gMercProfiles[78].uiMoney >= 10000);
      break;
    case Enum170.FACT_SLAY_IN_SECTOR:
      gubFact[usFact] = (gMercProfiles[Enum268.SLAY].sSectorX == gWorldSectorX && gMercProfiles[Enum268.SLAY].sSectorY == gWorldSectorY && gMercProfiles[Enum268.SLAY].bSectorZ == gbWorldSectorZ);
      break;
    case Enum170.FACT_SLAY_HIRED_AND_WORKED_FOR_48_HOURS:
      gubFact[usFact] = (Boolean(gMercProfiles[Enum268.SLAY].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED) && (gMercProfiles[Enum268.SLAY].usTotalDaysServed > 1));
      break;
    case Enum170.FACT_SHANK_IN_SQUAD_BUT_NOT_SPEAKING:
      gubFact[usFact] = ((FindSoldierByProfileID(Enum268.SHANK, true) != null) && Boolean(gMercProfiles[Enum268.SHANK].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED) && (gpSrcSoldier == null || gpSrcSoldier.ubProfile != Enum268.SHANK));
      break;
    case Enum170.FACT_SHANK_NOT_IN_SECTOR:
      gubFact[usFact] = (FindSoldierByProfileID(Enum268.SHANK, false) == null);
      break;
    case Enum170.FACT_QUEEN_DEAD:
      gubFact[usFact] = (gMercProfiles[Enum268.QUEEN].bMercStatus == MERC_IS_DEAD);
      break;
    case Enum170.FACT_MINE_EMPTY:
      gubFact[usFact] = IsHisMineEmpty(ubProfileID);
      break;
    case Enum170.FACT_MINE_RUNNING_OUT:
      gubFact[usFact] = IsHisMineRunningOut(ubProfileID);
      break;
    case Enum170.FACT_MINE_PRODUCING_BUT_LOYALTY_LOW:
      gubFact[usFact] = HasHisMineBeenProducingForPlayerForSomeTime(ubProfileID) && IsHisMineDisloyal(ubProfileID);
      break;
    case Enum170.FACT_CREATURES_IN_MINE:
      gubFact[usFact] = IsHisMineInfested(ubProfileID);
      break;
    case Enum170.FACT_PLAYER_LOST_MINE:
      gubFact[usFact] = IsHisMineLostAndRegained(ubProfileID);
      break;
    case Enum170.FACT_MINE_AT_FULL_PRODUCTION:
      gubFact[usFact] = IsHisMineAtMaxProduction(ubProfileID);
      break;
    case Enum170.FACT_DYNAMO_IN_J9:
      gubFact[usFact] = CheckNPCSector(Enum268.DYNAMO, 9, MAP_ROW_J, 0) && Boolean(NumEnemiesInAnySector(9, 10, 0));
      break;
    case Enum170.FACT_DYNAMO_ALIVE:
      gubFact[usFact] = (gMercProfiles[Enum268.DYNAMO].bMercStatus != MERC_IS_DEAD);
      break;
    case Enum170.FACT_DYNAMO_SPEAKING_OR_NEARBY:
      gubFact[usFact] = (gpSrcSoldier != null && (gpSrcSoldier.ubProfile == Enum268.DYNAMO || (CheckNPCWithin(gpSrcSoldier.ubProfile, Enum268.DYNAMO, 10) && CheckGuyVisible(gpSrcSoldier.ubProfile, Enum268.DYNAMO))));
      break;
    case Enum170.FACT_JOHN_EPC:
      gubFact[usFact] = CheckNPCIsEPC(Enum268.JOHN);
      break;
    case Enum170.FACT_MARY_EPC:
      gubFact[usFact] = CheckNPCIsEPC(Enum268.MARY);
      break;
    case Enum170.FACT_JOHN_AND_MARY_EPCS:
      gubFact[usFact] = CheckNPCIsEPC(Enum268.JOHN) && CheckNPCIsEPC(Enum268.MARY);
      break;
    case Enum170.FACT_MARY_ALIVE:
      gubFact[usFact] = (gMercProfiles[Enum268.MARY].bMercStatus != MERC_IS_DEAD);
      break;
    case Enum170.FACT_MARY_BLEEDING:
      gubFact[usFact] = CheckNPCBleeding(Enum268.MARY);
      break;
    case Enum170.FACT_JOHN_ALIVE:
      gubFact[usFact] = (gMercProfiles[Enum268.JOHN].bMercStatus != MERC_IS_DEAD);
      break;
    case Enum170.FACT_JOHN_BLEEDING:
      gubFact[usFact] = CheckNPCBleeding(Enum268.JOHN);
      break;
    case Enum170.FACT_MARY_DEAD:
      gubFact[usFact] = (gMercProfiles[Enum268.MARY].bMercStatus == MERC_IS_DEAD);
      break;

    case Enum170.FACT_ANOTHER_FIGHT_POSSIBLE:
      gubFact[usFact] = AnotherFightPossible();
      break;

    case Enum170.FACT_RECEIVING_INCOME_FROM_DCAC:
      gubFact[usFact] = ((PredictDailyIncomeFromAMine(Enum179.MINE_DRASSEN) > 0) && (PredictDailyIncomeFromAMine(Enum179.MINE_ALMA) > 0) && (PredictDailyIncomeFromAMine(Enum179.MINE_CAMBRIA) > 0) && (PredictDailyIncomeFromAMine(Enum179.MINE_CHITZENA) > 0));
      break;

    case Enum170.FACT_PLAYER_BEEN_TO_K4: {
      let pUnderGroundSector: UNDERGROUND_SECTORINFO;

      pUnderGroundSector = <UNDERGROUND_SECTORINFO>FindUnderGroundSector(4, MAP_ROW_K, 1);
      gubFact[usFact] = pUnderGroundSector.fVisited;
    } break;
    case Enum170.FACT_WARDEN_DEAD:
      gubFact[usFact] = (gMercProfiles[Enum268.WARDEN].bMercStatus == MERC_IS_DEAD);
      break;

    case Enum170.FACT_PLAYER_PAID_FOR_TWO_IN_BROTHEL:
      gubFact[usFact] = (gMercProfiles[Enum268.MADAME].bNPCData > 1);
      break;

    case Enum170.FACT_LOYALTY_OKAY:
      bTown = gMercProfiles[ubProfileID].bTown;
      if ((bTown != Enum135.BLANK_SECTOR) && gTownLoyalty[bTown].fStarted && gfTownUsesLoyalty[bTown]) {
        gubFact[usFact] = ((gTownLoyalty[bTown].ubRating >= LOYALTY_LOW_THRESHOLD) && (gTownLoyalty[bTown].ubRating < LOYALTY_OK_THRESHOLD));
      } else {
        gubFact[usFact] = false;
      }
      break;

    case Enum170.FACT_LOYALTY_LOW:
      bTown = gMercProfiles[ubProfileID].bTown;
      if ((bTown != Enum135.BLANK_SECTOR) && gTownLoyalty[bTown].fStarted && gfTownUsesLoyalty[bTown]) {
        // if Skyrider, ignore low loyalty until he has monologues, and wait at least a day since the latest monologue to avoid a hot/cold attitude
        if ((ubProfileID == Enum268.SKYRIDER) && ((guiHelicopterSkyriderTalkState == 0) || ((GetWorldTotalMin() - guiTimeOfLastSkyriderMonologue) < (24 * 60)))) {
          gubFact[usFact] = false;
        } else {
          gubFact[usFact] = (gTownLoyalty[bTown].ubRating < LOYALTY_LOW_THRESHOLD);
        }
      } else {
        gubFact[usFact] = false;
      }
      break;

    case Enum170.FACT_LOYALTY_HIGH:
      bTown = gMercProfiles[ubProfileID].bTown;
      if ((bTown != Enum135.BLANK_SECTOR) && gTownLoyalty[bTown].fStarted && gfTownUsesLoyalty[bTown]) {
        gubFact[usFact] = (gTownLoyalty[gMercProfiles[ubProfileID].bTown].ubRating >= LOYALTY_HIGH_THRESHOLD);
      } else {
        gubFact[usFact] = false;
      }
      break;

    case Enum170.FACT_ELGIN_ALIVE:
      gubFact[usFact] = (gMercProfiles[Enum268.DRUGGIST].bMercStatus != MERC_IS_DEAD);
      break;

    case Enum170.FACT_SPEAKER_AIM_OR_AIM_NEARBY:
      gubFact[usFact] = gpDestSoldier !== null && AIMMercWithin(gpDestSoldier.sGridNo, 10);
      break;

    case Enum170.FACT_MALE_SPEAKING_FEMALE_PRESENT:
      gubFact[usFact] = (!CheckTalkerFemale() && FemalePresent(ubProfileID));
      break;

    case Enum170.FACT_PLAYER_OWNS_2_TOWNS_INCLUDING_OMERTA:
      gubFact[usFact] = ((GetNumberOfWholeTownsUnderControl() == 3) && IsTownUnderCompleteControlByPlayer(Enum135.OMERTA));
      break;

    case Enum170.FACT_PLAYER_OWNS_3_TOWNS_INCLUDING_OMERTA:
      gubFact[usFact] = ((GetNumberOfWholeTownsUnderControl() == 5) && IsTownUnderCompleteControlByPlayer(Enum135.OMERTA));
      break;

    case Enum170.FACT_PLAYER_OWNS_4_TOWNS_INCLUDING_OMERTA:
      gubFact[usFact] = ((GetNumberOfWholeTownsUnderControl() >= 6) && IsTownUnderCompleteControlByPlayer(Enum135.OMERTA));
      break;

    case Enum170.FACT_PLAYER_FOUGHT_THREE_TIMES_TODAY:
      gubFact[usFact] = !BoxerAvailable();
      break;

    case Enum170.FACT_PLAYER_DOING_POORLY:
      gubFact[usFact] = (CurrentPlayerProgressPercentage() < 20);
      break;

    case Enum170.FACT_PLAYER_DOING_WELL:
      gubFact[usFact] = (CurrentPlayerProgressPercentage() > 50);
      break;

    case Enum170.FACT_PLAYER_DOING_VERY_WELL:
      gubFact[usFact] = (CurrentPlayerProgressPercentage() > 80);
      break;

    case Enum170.FACT_FATHER_DRUNK_AND_SCIFI_OPTION_ON:
      gubFact[usFact] = ((gMercProfiles[Enum268.FATHER].bNPCData >= 5) && gGameOptions.fSciFi);
      break;

    case Enum170.FACT_BLOODCAT_QUEST_STARTED_TWO_DAYS_AGO:
      gubFact[usFact] = ((gubQuest[Enum169.QUEST_BLOODCATS] != QUESTNOTSTARTED) && (GetWorldTotalMin() - GetTimeQuestWasStarted(Enum169.QUEST_BLOODCATS) > Math.trunc(2 * NUM_SEC_IN_DAY / NUM_SEC_IN_MIN)));
      break;

    case Enum170.FACT_NOTHING_REPAIRED_YET:
      gubFact[usFact] = RepairmanIsFixingItemsButNoneAreDoneYet(ubProfileID);
      break;

    case Enum170.FACT_NPC_COWERING:
      gubFact[usFact] = CheckNPCCowering(ubProfileID);
      break;

    case Enum170.FACT_TOP_AND_BOTTOM_LEVELS_CLEARED:
      gubFact[usFact] = (gubFact[Enum170.FACT_TOP_LEVEL_CLEARED] && gubFact[Enum170.FACT_BOTTOM_LEVEL_CLEARED]);
      break;

    case Enum170.FACT_FIRST_BARTENDER:
      gubFact[usFact] = (gMercProfiles[ubProfileID].bNPCData == 1 || (gMercProfiles[ubProfileID].bNPCData == 0 && CountBartenders() == 0));
      break;

    case Enum170.FACT_SECOND_BARTENDER:
      gubFact[usFact] = (gMercProfiles[ubProfileID].bNPCData == 2 || (gMercProfiles[ubProfileID].bNPCData == 0 && CountBartenders() == 1));
      break;

    case Enum170.FACT_THIRD_BARTENDER:
      gubFact[usFact] = (gMercProfiles[ubProfileID].bNPCData == 3 || (gMercProfiles[ubProfileID].bNPCData == 0 && CountBartenders() == 2));
      break;

    case Enum170.FACT_FOURTH_BARTENDER:
      gubFact[usFact] = (gMercProfiles[ubProfileID].bNPCData == 4 || (gMercProfiles[ubProfileID].bNPCData == 0 && CountBartenders() == 3));
      break;

    case Enum170.FACT_NPC_NOT_UNDER_FIRE:
      gubFact[usFact] = !CheckNPCIsUnderFire(ubProfileID);
      break;

    case Enum170.FACT_KINGPIN_NOT_IN_OFFICE:
      gubFact[usFact] = !(gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_D && NPCInRoomRange(Enum268.KINGPIN, 30, 39));
      // 30 to 39
      break;

    case Enum170.FACT_DONT_OWE_KINGPIN_MONEY:
      gubFact[usFact] = (gubQuest[Enum169.QUEST_KINGPIN_MONEY] != QUESTINPROGRESS);
      break;

    case Enum170.FACT_NO_CLUB_FIGHTING_ALLOWED:
      gubFact[usFact] = (gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTINPROGRESS || gfBoxersResting); // plus other conditions
      break;

    case Enum170.FACT_MADDOG_IS_SPEAKER:
      gubFact[usFact] = (gubSrcSoldierProfile == Enum268.MADDOG);
      break;

    case Enum170.FACT_PC_HAS_CONRADS_RECRUIT_OPINION:
      gubFact[usFact] = (gpDestSoldier !== null && (CalcDesireToTalk(gpDestSoldier.ubProfile, gubSrcSoldierProfile, Enum296.APPROACH_RECRUIT) >= 50));
      break;

    case Enum170.FACT_NPC_HOSTILE_OR_PISSED_OFF:
      gubFact[usFact] = CheckNPCIsEnemy(ubProfileID) || Boolean(gMercProfiles[ubProfileID].ubMiscFlags3 & PROFILE_MISC_FLAG3_NPC_PISSED_OFF);
      break;

    case Enum170.FACT_TONY_IN_BUILDING:
      gubFact[usFact] = CheckNPCSector(Enum268.TONY, 5, MAP_ROW_C, 0) && NPCInRoom(Enum268.TONY, 50);
      break;

    case Enum170.FACT_SHANK_SPEAKING:
      gubFact[usFact] = (gpSrcSoldier !== null && gpSrcSoldier.ubProfile == Enum268.SHANK);
      break;

    case Enum170.FACT_ROCKET_RIFLE_EXISTS:
      gubFact[usFact] = ItemTypeExistsAtLocation(10472, Enum225.ROCKET_RIFLE, 0, null);
      break;

    case Enum170.FACT_DOREEN_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.DOREEN].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_WALDO_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.WALDO].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_PERKO_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.PERKO].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_TONY_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.TONY].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_VINCE_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.VINCE].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_JENNY_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.JENNY].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_ARNOLD_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.ARNIE].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_I16_BLOODCATS_KILLED:
      gubFact[usFact] = (SectorInfo[Enum123.SEC_I16].bBloodCats == 0);
      break;

    case Enum170.FACT_NPC_BANDAGED_TODAY:
      gubFact[usFact] = (gMercProfiles[ubProfileID].ubMiscFlags2 & PROFILE_MISC_FLAG2_BANDAGED_TODAY) != 0;
      break;

    case Enum170.FACT_PLAYER_IN_SAME_ROOM:
      gubFact[usFact] = PCInSameRoom(ubProfileID);
      break;

    case Enum170.FACT_PLAYER_SPOKE_TO_DRASSEN_MINER:
      gubFact[usFact] = SpokenToHeadMiner(Enum179.MINE_DRASSEN);
      break;
    case Enum170.FACT_PLAYER_IN_CONTROLLED_DRASSEN_MINE:
      gubFact[usFact] = (GetIdOfMineForSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) == Enum179.MINE_DRASSEN && !(StrategicMap[gWorldSectorX + MAP_WORLD_X * gWorldSectorY].fEnemyControlled));
      break;
    case Enum170.FACT_PLAYER_SPOKE_TO_CAMBRIA_MINER:
      gubFact[usFact] = SpokenToHeadMiner(Enum179.MINE_CAMBRIA);
      break;
    case Enum170.FACT_PLAYER_IN_CONTROLLED_CAMBRIA_MINE:
      gubFact[usFact] = (GetIdOfMineForSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) == Enum179.MINE_CAMBRIA && !(StrategicMap[gWorldSectorX + MAP_WORLD_X * gWorldSectorY].fEnemyControlled));
      break;
    case Enum170.FACT_PLAYER_SPOKE_TO_CHITZENA_MINER:
      gubFact[usFact] = SpokenToHeadMiner(Enum179.MINE_CHITZENA);
      break;
    case Enum170.FACT_PLAYER_IN_CONTROLLED_CHITZENA_MINE:
      gubFact[usFact] = (GetIdOfMineForSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) == Enum179.MINE_CHITZENA && !(StrategicMap[gWorldSectorX + MAP_WORLD_X * gWorldSectorY].fEnemyControlled));
      break;
    case Enum170.FACT_PLAYER_SPOKE_TO_ALMA_MINER:
      gubFact[usFact] = SpokenToHeadMiner(Enum179.MINE_ALMA);
      break;
    case Enum170.FACT_PLAYER_IN_CONTROLLED_ALMA_MINE:
      gubFact[usFact] = (GetIdOfMineForSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) == Enum179.MINE_ALMA && !(StrategicMap[gWorldSectorX + MAP_WORLD_X * gWorldSectorY].fEnemyControlled));
      break;
    case Enum170.FACT_PLAYER_SPOKE_TO_GRUMM_MINER:
      gubFact[usFact] = SpokenToHeadMiner(Enum179.MINE_GRUMM);
      break;
    case Enum170.FACT_PLAYER_IN_CONTROLLED_GRUMM_MINE:
      gubFact[usFact] = (GetIdOfMineForSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) == Enum179.MINE_GRUMM && !(StrategicMap[gWorldSectorX + MAP_WORLD_X * gWorldSectorY].fEnemyControlled));
      break;

    case Enum170.FACT_ENOUGH_LOYALTY_TO_TRAIN_MILITIA:
      gubFact[usFact] = InTownSectorWithTrainingLoyalty(gWorldSectorX, gWorldSectorY);
      break;

    case Enum170.FACT_WALKER_AT_BAR:
      gubFact[usFact] = (gMercProfiles[Enum268.FATHER].sSectorX == 13 && gMercProfiles[Enum268.FATHER].sSectorY == MAP_ROW_C);
      break;

    case Enum170.FACT_JOEY_ALIVE:
      gubFact[usFact] = gMercProfiles[Enum268.JOEY].bMercStatus != MERC_IS_DEAD;
      break;

    case Enum170.FACT_UNPROPOSITIONED_FEMALE_SPEAKING_TO_NPC:
      gubFact[usFact] = CheckTalkerUnpropositionedFemale();
      break;

    case Enum170.FACT_84_AND_85_TRUE:
      gubFact[usFact] = CheckFact(84, ubProfileID) && CheckFact(Enum170.FACT_HANS_AT_SPOT, ubProfileID);
      break;

    case Enum170.FACT_SKYRIDER_IN_B15:
      gubFact[usFact] = CheckNPCSector(Enum268.SKYRIDER, 15, MAP_ROW_B, 0);
      break;

    case Enum170.FACT_SKYRIDER_IN_C16:
      gubFact[usFact] = CheckNPCSector(Enum268.SKYRIDER, 16, MAP_ROW_C, 0);
      break;
    case Enum170.FACT_SKYRIDER_IN_E14:
      gubFact[usFact] = CheckNPCSector(Enum268.SKYRIDER, 14, MAP_ROW_E, 0);
      break;
    case Enum170.FACT_SKYRIDER_IN_D12:
      gubFact[usFact] = CheckNPCSector(Enum268.SKYRIDER, 12, MAP_ROW_D, 0);
      break;

    case Enum170.FACT_KINGPIN_IS_ENEMY:
      gubFact[usFact] = (gTacticalStatus.fCivGroupHostile[Enum246.KINGPIN_CIV_GROUP] >= CIV_GROUP_WILL_BECOME_HOSTILE);
      break;

    case Enum170.FACT_DYNAMO_NOT_SPEAKER:
      gubFact[usFact] = !(gpSrcSoldier != null && (gpSrcSoldier.ubProfile == Enum268.DYNAMO));
      break;

    case Enum170.FACT_PABLO_BRIBED:
      gubFact[usFact] = !CheckFact(Enum170.FACT_PABLOS_BRIBED, ubProfileID);
      break;

    case Enum170.FACT_VEHICLE_PRESENT:
      gubFact[usFact] = CheckFact(Enum170.FACT_OK_USE_HUMMER, ubProfileID) && ((FindSoldierByProfileID(Enum268.PROF_HUMMER, true) != null) || (FindSoldierByProfileID(Enum268.PROF_ICECREAM, true) != null));
      break;

    case Enum170.FACT_PLAYER_KILLED_BOXERS:
      gubFact[usFact] = !BoxerExists();
      break;

    case 245: // Can dimitri be recruited? should be true if already true, OR if Miguel has been recruited already
      gubFact[usFact] = (gubFact[usFact] || FindSoldierByProfileID(Enum268.MIGUEL, true) !== null);
      /*
                      case FACT_:
                              gubFact[usFact] = ;
                              break;
      */

    default:
      break;
  }
  return gubFact[usFact] as boolean;
}

export function StartQuest(ubQuest: UINT8, sSectorX: INT16, sSectorY: INT16): void {
  InternalStartQuest(ubQuest, sSectorX, sSectorY, true);
}

export function InternalStartQuest(ubQuest: UINT8, sSectorX: INT16, sSectorY: INT16, fUpdateHistory: boolean): void {
  if (gubQuest[ubQuest] == QUESTNOTSTARTED) {
    gubQuest[ubQuest] = QUESTINPROGRESS;

    if (fUpdateHistory) {
      SetHistoryFact(Enum83.HISTORY_QUEST_STARTED, ubQuest, GetWorldTotalMin(), sSectorX, sSectorY);
    }
  } else {
    gubQuest[ubQuest] = QUESTINPROGRESS;
  }
}

export function EndQuest(ubQuest: UINT8, sSectorX: INT16, sSectorY: INT16): void {
  InternalEndQuest(ubQuest, sSectorX, sSectorY, true);
}

export function InternalEndQuest(ubQuest: UINT8, sSectorX: INT16, sSectorY: INT16, fUpdateHistory: boolean): void {
  if (gubQuest[ubQuest] == QUESTINPROGRESS) {
    gubQuest[ubQuest] = QUESTDONE;

    if (fUpdateHistory) {
      ResetHistoryFact(ubQuest, sSectorX, sSectorY);
    }
  } else {
    gubQuest[ubQuest] = QUESTDONE;
  }

  if (ubQuest == Enum169.QUEST_RESCUE_MARIA) {
    // cheap hack to try to prevent Madame Layla from thinking that you are
    // still in the brothel with Maria...
    gMercProfiles[Enum268.MADAME].bNPCData = 0;
    gMercProfiles[Enum268.MADAME].bNPCData2 = 0;
  }
};

export function InitQuestEngine(): void {
  gubQuest.fill(0);
  gubFact.fill(false);

  // semi-hack to make the letter quest start right away
  CheckForQuests(1);

  if (gGameOptions.fSciFi) {
    // 3 medical boosters
    gubCambriaMedicalObjects = 21;
  } else {
    gubCambriaMedicalObjects = 18;
  }

  gubBoxingMatchesWon = 0;
  gubBoxersRests = 0;
  gfBoxersResting = false;
}

export function CheckForQuests(uiDay: UINT32): void {
  // This function gets called at 8:00 AM time of the day

  ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "Checking For Quests, Day %d", uiDay);

  // -------------------------------------------------------------------------------
  // QUEST 0 : DELIVER LETTER
  // -------------------------------------------------------------------------------
  // The game always starts with DELIVER LETTER quest, so turn it on if it hasn't
  // already started
  if (gubQuest[Enum169.QUEST_DELIVER_LETTER] == QUESTNOTSTARTED) {
    StartQuest(Enum169.QUEST_DELIVER_LETTER, -1, -1);
    ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "Started DELIVER LETTER quest");
  }

  // This quest gets turned OFF through conversation with Miguel - when user hands
  // Miguel the letter
}

export function SaveQuestInfoToSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  // Save all the states if the Quests
  buffer = Buffer.allocUnsafe(MAX_QUESTS);
  writeUIntArray(gubQuest, buffer, 0, 1);
  uiNumBytesWritten = FileWrite(hFile, buffer, MAX_QUESTS);
  if (uiNumBytesWritten != MAX_QUESTS) {
    return false;
  }

  // Save all the states for the facts
  buffer = Buffer.allocUnsafe(NUM_FACTS);
  writeUIntArray(gubFact as number[], buffer, 0, 1);
  uiNumBytesWritten = FileWrite(hFile, buffer, NUM_FACTS);
  if (uiNumBytesWritten != NUM_FACTS) {
    return false;
  }

  return true;
}

export function LoadQuestInfoFromSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // Save all the states if the Quests
  buffer = Buffer.allocUnsafe(MAX_QUESTS);
  uiNumBytesRead = FileRead(hFile, buffer, MAX_QUESTS);
  if (uiNumBytesRead != MAX_QUESTS) {
    return false;
  }

  readUIntArray(gubQuest, buffer, 0, 1);

  // Save all the states for the facts
  buffer = Buffer.allocUnsafe(NUM_FACTS);
  uiNumBytesRead = FileRead(hFile, buffer, NUM_FACTS);
  if (uiNumBytesRead != NUM_FACTS) {
    return false;
  }

  readUIntArray(gubFact as number[], buffer, 0, 1);

  return true;
}

}
