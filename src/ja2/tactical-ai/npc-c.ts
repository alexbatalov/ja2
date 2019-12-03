namespace ja2 {

const NUM_CIVQUOTE_SECTORS = 20;
const MINERS_CIV_QUOTE_INDEX = 16;

let gsCivQuoteSector: INT16[][] /* [NUM_CIVQUOTE_SECTORS][2] */ = [
  [ 2, MAP_ROW_A ],
  [ 2, MAP_ROW_B ],
  [ 13, MAP_ROW_B ],
  [ 13, MAP_ROW_C ],
  [ 13, MAP_ROW_D ],
  [ 8, MAP_ROW_F ],
  [ 9, MAP_ROW_F ],
  [ 8, MAP_ROW_G ],
  [ 9, MAP_ROW_G ],
  [ 1, MAP_ROW_H ],

  [ 2, MAP_ROW_H ],
  [ 3, MAP_ROW_H ],
  [ 8, MAP_ROW_H ],
  [ 13, MAP_ROW_H ],
  [ 14, MAP_ROW_I ],
  [ 11, MAP_ROW_L ],
  [ 12, MAP_ROW_L ],
  [ 0, 0 ], // THIS ONE USED NOW - FOR bSectorZ > 0.....
  [ 0, 0 ],
  [ 0, 0 ],
];

const NO_FACT = (MAX_FACTS - 1);
const NO_QUEST = 255;
const QUEST_NOT_STARTED_NUM = 100;
const QUEST_DONE_NUM = 200;
const NO_QUOTE = 255;
const IRRELEVANT = 255;
const NO_MOVE = 65535;

export let gpNPCQuoteInfoArray: NPCQuoteInfo[][] /* Pointer<NPCQuoteInfo>[NUM_PROFILES] */ = createArray(NUM_PROFILES, <NPCQuoteInfo[]><unknown>null);
let gpBackupNPCQuoteInfoArray: NPCQuoteInfo[][] /* Pointer<NPCQuoteInfo>[NUM_PROFILES] */ = createArray(NUM_PROFILES, <NPCQuoteInfo[]><unknown>null);
let gpCivQuoteInfoArray: NPCQuoteInfo[][] /* Pointer<NPCQuoteInfo>[NUM_CIVQUOTE_SECTORS] */ = createArray(NUM_CIVQUOTE_SECTORS, <NPCQuoteInfo[]><unknown>null);

let gubTeamPenalty: UINT8;

export let gbFirstApproachFlags: INT8[] /* [4] */ = [
  0x01,
  0x02,
  0x04,
  0x08,
];

let gubAlternateNPCFileNumsForQueenMeanwhiles: UINT8[] /* [] */ = [
  160,
  161,
  162,
  163,
  164,
  165,
  166,
  167,
  168,
  169,
  170,
  171,
  172,
  173,
  174,
  175,
  176,
];
let gubAlternateNPCFileNumsForElliotMeanwhiles: UINT8[] /* [] */ = [
  180,
  181,
  182,
  183,
  184,
  185,
  186,
  187,
  188,
  189,
  190,
  191,
  192,
  193,
  194,
  195,
  196,
];

//
// NPC QUOTE LOW LEVEL ROUTINES
//

function LoadQuoteFile(ubNPC: UINT8): NPCQuoteInfo[] | null {
  let zFileName: string /* CHAR8[255] */;
  let hFile: HWFILE;
  let pFileData: NPCQuoteInfo[];
  let uiBytesRead: UINT32;
  let uiFileSize: UINT32;
  let buffer: Buffer;

  if (ubNPC == Enum268.PETER || ubNPC == Enum268.ALBERTO || ubNPC == Enum268.CARLO) {
    // use a copy of Herve's data file instead!
    zFileName = sprintf("NPCData\\%03d.npc", Enum268.HERVE);
  } else if (ubNPC < FIRST_RPC || (ubNPC < FIRST_NPC && gMercProfiles[ubNPC].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED)) {
    zFileName = sprintf("NPCData\\000.npc", ubNPC);
  } else {
    zFileName = sprintf("NPCData\\%03d.npc", ubNPC);
  }

  // ATE: Put some stuff i here to use a different NPC file if we are in a meanwhile.....
  if (AreInMeanwhile()) {
    // If we are the queen....
    if (ubNPC == Enum268.QUEEN) {
      zFileName = sprintf("NPCData\\%03d.npc", gubAlternateNPCFileNumsForQueenMeanwhiles[GetMeanwhileID()]);
    }

    // If we are elliot....
    if (ubNPC == Enum268.ELLIOT) {
      zFileName = sprintf("NPCData\\%03d.npc", gubAlternateNPCFileNumsForElliotMeanwhiles[GetMeanwhileID()]);
    }
  }

  if (!FileExists(zFileName)) {
    return null;
  }

  hFile = FileOpen(zFileName, FILE_ACCESS_READ, false);
  if (!hFile) {
    return null;
  }

  uiFileSize = NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS;
  pFileData = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createNPCQuoteInfo);
  if (pFileData) {
    buffer = Buffer.allocUnsafe(uiFileSize);
    if ((uiBytesRead = FileRead(hFile, buffer, uiFileSize)) === -1 || uiBytesRead != uiFileSize) {
      FileClose(hFile);
      return null;
    }

    readObjectArray(pFileData, buffer, 0, readNPCQuoteInfo);
  }

  FileClose(hFile);

  return pFileData;
}

function RevertToOriginalQuoteFile(ubNPC: UINT8): void {
  if (gpBackupNPCQuoteInfoArray[ubNPC] && gpNPCQuoteInfoArray[ubNPC]) {
    gpNPCQuoteInfoArray[ubNPC] = gpBackupNPCQuoteInfoArray[ubNPC];
    gpBackupNPCQuoteInfoArray[ubNPC] = <NPCQuoteInfo[]><unknown>null;
  }
}

function BackupOriginalQuoteFile(ubNPC: UINT8): void {
  gpBackupNPCQuoteInfoArray[ubNPC] = gpNPCQuoteInfoArray[ubNPC];
  gpNPCQuoteInfoArray[ubNPC] = <NPCQuoteInfo[]><unknown>null;
}

function EnsureQuoteFileLoaded(ubNPC: UINT8): boolean {
  let fLoadFile: boolean = false;

  if (ubNPC == Enum268.ROBOT) {
    return false;
  }

  if (gpNPCQuoteInfoArray[ubNPC] == null) {
    fLoadFile = true;
  }

  if (ubNPC >= FIRST_RPC && ubNPC < FIRST_NPC) {
    if (gMercProfiles[ubNPC].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED) {
      // recruited
      if (gpBackupNPCQuoteInfoArray[ubNPC] == null) {
        // no backup stored of current script, so need to backup
        fLoadFile = true;
        // set pointer to back up script!
        BackupOriginalQuoteFile(ubNPC);
      }
      // else have backup, are recruited, nothing special
    } else {
      // not recruited
      if (gpBackupNPCQuoteInfoArray[ubNPC] != null) {
        // backup stored, restore backup
        RevertToOriginalQuoteFile(ubNPC);
      }
      // else are no backup, nothing special
    }
  }

  if (fLoadFile) {
    gpNPCQuoteInfoArray[ubNPC] = <NPCQuoteInfo[]>LoadQuoteFile(ubNPC);
    if (gpNPCQuoteInfoArray[ubNPC] == null) {
      // error message at this point!
      return false;
    }
  }

  return true;
}

export function ReloadQuoteFile(ubNPC: UINT8): boolean {
  if (gpNPCQuoteInfoArray[ubNPC] != null) {
    gpNPCQuoteInfoArray[ubNPC] = <NPCQuoteInfo[]><unknown>null;
  }
  // zap backup if any
  if (gpBackupNPCQuoteInfoArray[ubNPC] != null) {
    gpBackupNPCQuoteInfoArray[ubNPC] = <NPCQuoteInfo[]><unknown>null;
  }
  return EnsureQuoteFileLoaded(ubNPC);
}

function ReloadQuoteFileIfLoaded(ubNPC: UINT8): boolean {
  if (gpNPCQuoteInfoArray[ubNPC] != null) {
    gpNPCQuoteInfoArray[ubNPC] = <NPCQuoteInfo[]><unknown>null;
    return EnsureQuoteFileLoaded(ubNPC);
  } else {
    return true;
  }
}

function RefreshNPCScriptRecord(ubNPC: UINT8, ubRecord: UINT8): boolean {
  let ubLoop: UINT8;
  let pNewArray: NPCQuoteInfo[] | null;

  if (ubNPC == NO_PROFILE) {
    // we have some work to do...
    // loop through all PCs, and refresh their copy of this record
    for (ubLoop = 0; ubLoop < FIRST_RPC; ubLoop++) // need more finesse here
    {
      RefreshNPCScriptRecord(ubLoop, ubRecord);
    }
    for (ubLoop = FIRST_RPC; ubLoop < FIRST_NPC; ubLoop++) {
      if (gMercProfiles[ubNPC].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED && gpBackupNPCQuoteInfoArray[ubNPC] != null) {
        RefreshNPCScriptRecord(ubLoop, ubRecord);
      }
    }
    return true;
  }

  if (gpNPCQuoteInfoArray[ubNPC]) {
    if (CHECK_FLAG(gpNPCQuoteInfoArray[ubNPC][ubRecord].fFlags, QUOTE_FLAG_SAID)) {
      // already used so we don't have to refresh!
      return true;
    }

    pNewArray = LoadQuoteFile(ubNPC);
    if (pNewArray) {
      copyNPCQuoteInfo(gpNPCQuoteInfoArray[ubNPC][ubRecord], pNewArray[ubRecord]);
    }
  }
  return true;
}

//
// CIV QUOTE LOW LEVEL ROUTINES
//

function LoadCivQuoteFile(ubIndex: UINT8): NPCQuoteInfo[] | null {
  let zFileName: string /* CHAR8[255] */;
  let hFile: HWFILE;
  let pFileData: NPCQuoteInfo[];
  let uiBytesRead: UINT32;
  let uiFileSize: UINT32;
  let buffer: Buffer;

  if (ubIndex == MINERS_CIV_QUOTE_INDEX) {
    zFileName = "NPCData\\miners.npc";
  } else {
    zFileName = sprintf("NPCData\\%c%d.npc", String.fromCharCode('A'.charCodeAt(0) + (gsCivQuoteSector[ubIndex][1] - 1)), gsCivQuoteSector[ubIndex][0]);
  }

  if (!FileExists(zFileName)) {
    return null;
  }

  hFile = FileOpen(zFileName, FILE_ACCESS_READ, false);
  if (!hFile) {
    return null;
  }

  uiFileSize = NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS;
  pFileData = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createNPCQuoteInfo);
  if (pFileData) {
    buffer = Buffer.allocUnsafe(uiFileSize);
    if ((uiBytesRead = FileRead(hFile, buffer, uiFileSize)) === -1 || uiBytesRead != uiFileSize) {
      FileClose(hFile);
      return null;
    }

    readObjectArray(pFileData, buffer, 0, readNPCQuoteInfo);
  }

  FileClose(hFile);

  return pFileData;
}

function EnsureCivQuoteFileLoaded(ubIndex: UINT8): boolean {
  let fLoadFile: boolean = false;

  if (gpCivQuoteInfoArray[ubIndex] == null) {
    fLoadFile = true;
  }

  if (fLoadFile) {
    gpCivQuoteInfoArray[ubIndex] = <NPCQuoteInfo[]>LoadCivQuoteFile(ubIndex);
    if (gpCivQuoteInfoArray[ubIndex] == null) {
      return false;
    }
  }

  return true;
}

function ReloadCivQuoteFile(ubIndex: UINT8): boolean {
  if (gpCivQuoteInfoArray[ubIndex] != null) {
    gpCivQuoteInfoArray[ubIndex] = <NPCQuoteInfo[]><unknown>null;
  }
  return EnsureCivQuoteFileLoaded(ubIndex);
}

function ReloadCivQuoteFileIfLoaded(ubIndex: UINT8): boolean {
  if (gpCivQuoteInfoArray[ubIndex] != null) {
    gpCivQuoteInfoArray[ubIndex] = <NPCQuoteInfo[]><unknown>null;
    return EnsureCivQuoteFileLoaded(ubIndex);
  } else {
    return true;
  }
}

export function ShutdownNPCQuotes(): void {
  let ubLoop: UINT8;

  for (ubLoop = 0; ubLoop < NUM_PROFILES; ubLoop++) {
    if (gpNPCQuoteInfoArray[ubLoop]) {
      gpNPCQuoteInfoArray[ubLoop] = <NPCQuoteInfo[]><unknown>null;
    }

    if (gpBackupNPCQuoteInfoArray[ubLoop] != null) {
      gpBackupNPCQuoteInfoArray[ubLoop] = <NPCQuoteInfo[]><unknown>null;
    }
  }

  for (ubLoop = 0; ubLoop < NUM_CIVQUOTE_SECTORS; ubLoop++) {
    if (gpCivQuoteInfoArray[ubLoop]) {
      gpCivQuoteInfoArray[ubLoop] = <NPCQuoteInfo[]><unknown>null;
    }
  }
}

//
// GENERAL LOW LEVEL ROUTINES
//

export function ReloadAllQuoteFiles(): boolean {
  let ubProfile: UINT8;
  let ubLoop: UINT8;

  for (ubProfile = FIRST_RPC; ubProfile < NUM_PROFILES; ubProfile++) {
    // zap backup if any
    if (gpBackupNPCQuoteInfoArray[ubProfile] != null) {
      gpBackupNPCQuoteInfoArray[ubProfile] = <NPCQuoteInfo[]><unknown>null;
    }
    ReloadQuoteFileIfLoaded(ubProfile);
  }
  // reload all civ quote files
  for (ubLoop = 0; ubLoop < NUM_CIVQUOTE_SECTORS; ubLoop++) {
    ReloadCivQuoteFileIfLoaded(ubLoop);
  }

  return true;
}

//
// THE REST
//

export function SetQuoteRecordAsUsed(ubNPC: UINT8, ubRecord: UINT8): void {
  if (EnsureQuoteFileLoaded(ubNPC)) {
    gpNPCQuoteInfoArray[ubNPC][ubRecord].fFlags |= QUOTE_FLAG_SAID;
  }
}

function CalcThreateningEffectiveness(ubMerc: UINT8): INT32 {
  let pSoldier: SOLDIERTYPE | null;
  let iStrength: INT32;
  let iDeadliness: INT32;

  // effective threat is 1/3 strength, 1/3 weapon deadliness, 1/3 leadership

  pSoldier = FindSoldierByProfileID(ubMerc, true);

  if (!pSoldier) {
    return 0;
  }

  iStrength = EffectiveStrength(pSoldier);

  if (Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass & IC_WEAPON) {
    iDeadliness = Weapon[pSoldier.inv[Enum261.HANDPOS].usItem].ubDeadliness;
  } else {
    iDeadliness = 0;
  }

  if (iDeadliness == 0) {
    // penalize!
    iDeadliness = -30;
  }

  return (EffectiveLeadership(pSoldier) + iStrength + iDeadliness) / 2;
}

export function CalcDesireToTalk(ubNPC: UINT8, ubMerc: UINT8, bApproach: INT8): UINT8 {
  let iWillingness: INT32;
  let iPersonalVal: INT32;
  let iTownVal: INT32;
  let iApproachVal: INT32;
  let iEffectiveLeadership: INT32;
  let pNPCProfile: MERCPROFILESTRUCT;
  let pMercProfile: MERCPROFILESTRUCT;

  pNPCProfile = gMercProfiles[ubNPC];
  pMercProfile = gMercProfiles[ubMerc];

  iPersonalVal = 50 + pNPCProfile.bMercOpinion[ubMerc]; /* + pNPCProfile->bMercTownReputation[ pNPCProfile->bTown ] */
  ;

  // ARM: NOTE - for towns which don't use loyalty (San Mona, Estoni, Tixa, Orta )
  // loyalty will always remain 0 (this was OKed by Ian)
  iTownVal = gTownLoyalty[pNPCProfile.bTown].ubRating;
  iTownVal = iTownVal * pNPCProfile.bTownAttachment / 100;

  if (bApproach == Enum296.NPC_INITIATING_CONV || bApproach == Enum296.APPROACH_GIVINGITEM) {
    iApproachVal = 100;
  } else if (bApproach == Enum296.APPROACH_THREATEN) {
    iEffectiveLeadership = CalcThreateningEffectiveness(ubMerc) * pMercProfile.usApproachFactor[bApproach - 1] / 100;
    iApproachVal = pNPCProfile.ubApproachVal[bApproach - 1] * iEffectiveLeadership / 50;
  } else {
    iEffectiveLeadership = (pMercProfile.bLeadership) * pMercProfile.usApproachFactor[bApproach - 1] / 100;
    iApproachVal = pNPCProfile.ubApproachVal[bApproach - 1] * iEffectiveLeadership / 50;
  }
  // NB if town attachment is less than 100% then we should make personal value proportionately more important!
  if (pNPCProfile.bTownAttachment < 100) {
    iPersonalVal = iPersonalVal * (100 + (100 - pNPCProfile.bTownAttachment)) / 100;
  }
  iWillingness = (iPersonalVal / 2 + iTownVal / 2) * iApproachVal / 100 - gubTeamPenalty;

  if (bApproach == Enum296.NPC_INITIATING_CONV) {
    iWillingness -= INITIATING_FACTOR;
  }

  if (iWillingness < 0) {
    iWillingness = 0;
  }

  return iWillingness;
}

function ApproachedForFirstTime(pNPCProfile: MERCPROFILESTRUCT, bApproach: INT8): void {
  let ubLoop: UINT8;
  let uiTemp: UINT32;

  pNPCProfile.bApproached |= gbFirstApproachFlags[bApproach - 1];
  for (ubLoop = 1; ubLoop <= NUM_REAL_APPROACHES; ubLoop++) {
    uiTemp = pNPCProfile.ubApproachVal[ubLoop - 1] * pNPCProfile.ubApproachMod[bApproach - 1][ubLoop - 1] / 100;
    if (uiTemp > 255) {
      uiTemp = 255;
    }
    pNPCProfile.ubApproachVal[ubLoop - 1] = uiTemp;
  }
}

function NPCConsiderTalking(ubNPC: UINT8, ubMerc: UINT8, bApproach: INT8, ubRecord: UINT8, pNPCQuoteInfoArray: NPCQuoteInfo[], ppResultQuoteInfo: Pointer<Pointer<NPCQuoteInfo>>, pubQuoteNum: Pointer<UINT8>): UINT8 {
  // This function returns the opinion level required of the "most difficult" quote
  // that the NPC is willing to say to the merc.  It can also provide the quote #.
  let pNPCProfile: MERCPROFILESTRUCT;
  let pNPCQuoteInfo: NPCQuoteInfo;
  let ubTalkDesire: UINT8;
  let ubLoop: UINT8;
  let ubQuote: UINT8;
  let ubHighestOpinionRequired: UINT8 = 0;
  let fQuoteFound: boolean = false;
  let uiDay: UINT32;
  let ubFirstQuoteRecord: UINT8;
  let ubLastQuoteRecord: UINT8;
  let pSoldier: SOLDIERTYPE | null = null;

  ubTalkDesire = ubQuote = 0;

  pSoldier = FindSoldierByProfileID(ubNPC, false);
  if (pSoldier == null) {
    return 0;
  }

  if (ppResultQuoteInfo) {
    (ppResultQuoteInfo.value) = null;
  }

  if (pubQuoteNum) {
    (pubQuoteNum.value) = 0;
  }

  if (bApproach <= NUM_REAL_APPROACHES) {
    pNPCProfile = gMercProfiles[ubNPC];
    // What's our willingness to divulge?
    ubTalkDesire = CalcDesireToTalk(ubNPC, ubMerc, bApproach);
    if (bApproach < NUM_REAL_APPROACHES && !(pNPCProfile.bApproached & gbFirstApproachFlags[bApproach - 1])) {
      ApproachedForFirstTime(pNPCProfile, bApproach);
    }
  } else if (ubNPC == Enum268.PABLO && bApproach == Enum296.APPROACH_SECTOR_NOT_SAFE) // for Pablo, consider as threaten
  {
    pNPCProfile = gMercProfiles[ubNPC];
    // What's our willingness to divulge?
    ubTalkDesire = CalcDesireToTalk(ubNPC, ubMerc, Enum296.APPROACH_THREATEN);
    if (pNPCProfile.bApproached & gbFirstApproachFlags[Enum296.APPROACH_THREATEN - 1]) {
      ApproachedForFirstTime(pNPCProfile, Enum296.APPROACH_THREATEN);
    }
  }

  switch (bApproach) {
      /*
              case APPROACH_RECRUIT:
                      ubFirstQuoteRecord = 0;
                      ubLastQuoteRecord = 0;
                      break;
                      */
    case Enum296.TRIGGER_NPC:
      ubFirstQuoteRecord = ubRecord;
      ubLastQuoteRecord = ubRecord;
      break;
    default:
      ubFirstQuoteRecord = 0;
      ubLastQuoteRecord = NUM_NPC_QUOTE_RECORDS - 1;
      break;
  }

  uiDay = GetWorldDay();

  for (ubLoop = ubFirstQuoteRecord; ubLoop <= ubLastQuoteRecord; ubLoop++) {
    pNPCQuoteInfo = pNPCQuoteInfoArray[ubLoop];

    // Check if we have the item / are in right spot
    if (pNPCQuoteInfo.sRequiredItem > 0) {
      if (!ObjectExistsInSoldierProfile(ubNPC, pNPCQuoteInfo.sRequiredItem)) {
        continue;
      }
    } else if (pNPCQuoteInfo.sRequiredGridno < 0) {
      if (pSoldier.sGridNo != -(pNPCQuoteInfo.sRequiredGridno)) {
        continue;
      }
    }

    if (NPCConsiderQuote(ubNPC, ubMerc, bApproach, ubLoop, ubTalkDesire, pNPCQuoteInfoArray)) {
      if (bApproach == Enum296.NPC_INITIATING_CONV) {
        // want to find the quote with the highest required opinion rating that we're willing
        // to say
        if (pNPCQuoteInfo.ubOpinionRequired > ubHighestOpinionRequired) {
          fQuoteFound = true;
          ubHighestOpinionRequired = pNPCQuoteInfo.ubOpinionRequired;
          ubQuote = pNPCQuoteInfo.ubQuoteNum;
        }
      } else {
        // we do have a quote to say, and we want to say this one right away!
        if (ppResultQuoteInfo) {
          (ppResultQuoteInfo.value) = pNPCQuoteInfo;
        }
        if (pubQuoteNum) {
          (pubQuoteNum.value) = ubLoop;
        }

        return pNPCQuoteInfo.ubOpinionRequired;
      }
    }
  }

  // Whew, checked them all.  If we found a quote, return the appropriate values.
  if (fQuoteFound) {
    if (ppResultQuoteInfo) {
      (ppResultQuoteInfo.value) = pNPCQuoteInfo;
    }
    if (pubQuoteNum) {
      (pubQuoteNum.value) = ubQuote;
    }

    return ubHighestOpinionRequired;
  } else {
    if (ppResultQuoteInfo) {
      (ppResultQuoteInfo.value) = null;
    }
    if (pubQuoteNum) {
      (pubQuoteNum.value) = 0;
    }
    return 0;
  }
}

function NPCConsiderReceivingItemFromMerc(ubNPC: UINT8, ubMerc: UINT8, pObj: OBJECTTYPE, pNPCQuoteInfoArray: NPCQuoteInfo[], ppResultQuoteInfo: Pointer<Pointer<NPCQuoteInfo>>, pubQuoteNum: Pointer<UINT8>): UINT8 {
  // This function returns the opinion level required of the "most difficult" quote
  // that the NPC is willing to say to the merc.  It can also provide the quote #.
  let pNPCProfile: MERCPROFILESTRUCT;
  let pNPCQuoteInfo: NPCQuoteInfo;
  let ubTalkDesire: UINT8;
  let ubLoop: UINT8;
  let ubHighestOpinionRequired: UINT8 = 0;
  let fQuoteFound: boolean = false;
  let ubFirstQuoteRecord: UINT8;
  let ubLastQuoteRecord: UINT8;
  let usItemToConsider: UINT16;

  (ppResultQuoteInfo.value) = null;
  (pubQuoteNum.value) = 0;

  if (CheckFact(Enum170.FACT_NPC_IS_ENEMY, ubNPC) && ubNPC != Enum268.JOE) {
    // don't accept any items when we are the player's enemy
    return 0;
  }

  pNPCProfile = gMercProfiles[ubNPC];

  // How much do we want to talk with this merc?

  ubTalkDesire = CalcDesireToTalk(ubNPC, ubMerc, Enum296.APPROACH_GIVINGITEM);

  ubFirstQuoteRecord = 0;
  ubLastQuoteRecord = NUM_NPC_QUOTE_RECORDS - 1;

  usItemToConsider = pObj.usItem;
  if (Item[usItemToConsider].usItemClass == IC_GUN && usItemToConsider != Enum225.ROCKET_LAUNCHER) {
    let ubWeaponClass: UINT8;

    ubWeaponClass = Weapon[usItemToConsider].ubWeaponClass;
    if (ubWeaponClass == Enum282.RIFLECLASS || ubWeaponClass == Enum282.MGCLASS) {
      usItemToConsider = ANY_RIFLE; // treat all rifles the same
    }
  }
  switch (usItemToConsider) {
    case Enum225.HEAD_2:
    case Enum225.HEAD_3:
    // case HEAD_4: // NOT Slay's head; it's different
    case Enum225.HEAD_5:
    case Enum225.HEAD_6:
    case Enum225.HEAD_7:
      // all treated the same in the NPC code
      usItemToConsider = Enum225.HEAD_2;
      break;
    case Enum225.MONEY:
    case Enum225.SILVER:
    case Enum225.GOLD:
      if (pObj.uiMoneyAmount < LARGE_AMOUNT_MONEY) {
        SetFactTrue(Enum170.FACT_SMALL_AMOUNT_OF_MONEY);
      } else {
        SetFactTrue(Enum170.FACT_LARGE_AMOUNT_OF_MONEY);
      }
      usItemToConsider = Enum225.MONEY;
      break;
    case Enum225.WINE:
    case Enum225.BEER:
      usItemToConsider = Enum225.ALCOHOL;
      break;
    default:
      break;
  }

  if (pObj.bStatus[0] < 50) {
    SetFactTrue(Enum170.FACT_ITEM_POOR_CONDITION);
  } else {
    SetFactFalse(Enum170.FACT_ITEM_POOR_CONDITION);
  }

  for (ubLoop = ubFirstQuoteRecord; ubLoop <= ubLastQuoteRecord; ubLoop++) {
    pNPCQuoteInfo = pNPCQuoteInfoArray[ubLoop];

    // First see if we want that item....
    if (pNPCQuoteInfo.sRequiredItem > 0 && (pNPCQuoteInfo.sRequiredItem == usItemToConsider || pNPCQuoteInfo.sRequiredItem == ACCEPT_ANY_ITEM)) {
      // Now see if everyhting else is OK
      if (NPCConsiderQuote(ubNPC, ubMerc, Enum296.APPROACH_GIVINGITEM, ubLoop, ubTalkDesire, pNPCQuoteInfoArray)) {
        switch (ubNPC) {
          case Enum268.DARREN:
            if (usItemToConsider == Enum225.MONEY && pNPCQuoteInfo.sActionData == Enum213.NPC_ACTION_DARREN_GIVEN_CASH) {
              if (pObj.uiMoneyAmount < 1000) {
                // refuse, bet too low - record 15
                (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[15]);
                (pubQuoteNum.value) = 15;
                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              } else if (pObj.uiMoneyAmount > 5000) {
                // refuse, bet too high - record 16
                (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[16]);
                (pubQuoteNum.value) = 16;
                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              } else {
                // accept - record 17
                /*
                {

                        SOLDIERTYPE *					pSoldier;
                        INT8									bMoney;
                        INT8									bEmptySlot;

                        pSoldier = FindSoldierByProfileID( DARREN, FALSE );
                        bMoney = FindObjWithin( pSoldier, MONEY, BIGPOCK1POS, SMALLPOCK8POS );
                        bEmptySlot = FindObjWithin( pSoldier, NOTHING, BIGPOCK1POS, SMALLPOCK8POS );
                }
                */

                // record amount of bet
                gMercProfiles[Enum268.DARREN].iBalance = pObj.uiMoneyAmount;
                SetFactFalse(Enum170.FACT_DARREN_EXPECTING_MONEY);

                // if never fought before, use record 17
                // if fought before, today, use record 31
                // else use record 18
                if (!(gpNPCQuoteInfoArray[Enum268.DARREN][17].fFlags & QUOTE_FLAG_SAID)) // record 17 not used
                {
                  (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[17]);
                  (pubQuoteNum.value) = 17;
                } else {
                  // find Kingpin, if he's in his house, invoke the script to move him to the bar
                  let pKingpin: SOLDIERTYPE | null;
                  let ubKingpinRoom: UINT8;

                  pKingpin = FindSoldierByProfileID(Enum268.KINGPIN, false);
                  if (pKingpin && (ubKingpinRoom = InARoom(pKingpin.sGridNo)) !== -1) {
                    if (IN_KINGPIN_HOUSE(ubKingpinRoom)) {
                      // first boxer, bring kingpin over
                      (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[17]);
                      (pubQuoteNum.value) = 17;
                    } else {
                      (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[31]);
                      (pubQuoteNum.value) = 31;
                    }
                  } else {
                    (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[31]);
                    (pubQuoteNum.value) = 31;
                  }
                }

                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              }
            }
            break;
          case Enum268.ANGEL:
            if (usItemToConsider == Enum225.MONEY && pNPCQuoteInfo.value.sActionData == Enum213.NPC_ACTION_ANGEL_GIVEN_CASH) {
              if (pObj.uiMoneyAmount < Item[Enum225.LEATHER_JACKET_W_KEVLAR].usPrice) {
                // refuse, bet too low - record 8
                (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[8]);
                (pubQuoteNum.value) = 8;
                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              } else if (pObj.uiMoneyAmount > Item[Enum225.LEATHER_JACKET_W_KEVLAR].usPrice) {
                // refuse, bet too high - record 9
                (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[9]);
                (pubQuoteNum.value) = 9;
                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              } else {
                // accept - record 10
                (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[10]);
                (pubQuoteNum.value) = 10;
                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              }
            }
            break;
          case Enum268.MADAME:
            if (usItemToConsider == Enum225.MONEY) {
              if (gMercProfiles[ubMerc].bSex == Enum272.FEMALE) {
                // say quote about not catering to women!
                (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[5]);
                (pubQuoteNum.value) = 5;
                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              }
              switch (pObj.uiMoneyAmount) {
                case 100:
                case 200: // Carla
                  if (CheckFact(Enum170.FACT_CARLA_AVAILABLE, 0)) {
                    gMercProfiles[Enum268.MADAME].bNPCData += (pObj.uiMoneyAmount / 100);
                    TriggerNPCRecord(Enum268.MADAME, 16);
                  } else {
                    // see default case
                    (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[25]);
                    (pubQuoteNum.value) = 25;
                    return (ppResultQuoteInfo.value).value.ubOpinionRequired;
                  }
                  break;
                case 500:
                case 1000: // Cindy
                  if (CheckFact(Enum170.FACT_CINDY_AVAILABLE, 0)) {
                    gMercProfiles[Enum268.MADAME].bNPCData += (pObj.uiMoneyAmount / 500);
                    TriggerNPCRecord(Enum268.MADAME, 17);
                  } else {
                    // see default case
                    (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[25]);
                    (pubQuoteNum.value) = 25;
                    return (ppResultQuoteInfo.value).value.ubOpinionRequired;
                  }
                  break;
                case 300:
                case 600: // Bambi
                  if (CheckFact(Enum170.FACT_BAMBI_AVAILABLE, 0)) {
                    gMercProfiles[Enum268.MADAME].bNPCData += (pObj.uiMoneyAmount / 300);
                    TriggerNPCRecord(Enum268.MADAME, 18);
                  } else {
                    // see default case
                    (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[25]);
                    (pubQuoteNum.value) = 25;
                    return (ppResultQuoteInfo.value).value.ubOpinionRequired;
                  }
                  break;
                case 400:
                case 800: // Maria?
                  if (gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTINPROGRESS) {
                    gMercProfiles[Enum268.MADAME].bNPCData += (pObj.uiMoneyAmount / 400);
                    TriggerNPCRecord(Enum268.MADAME, 19);
                    break;
                  } else {
                    // see default case
                    (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[25]);
                    (pubQuoteNum.value) = 25;
                    return (ppResultQuoteInfo.value).value.ubOpinionRequired;
                  }
                  break;
                default:
                  // play quotes 39-42 (plus 44 if quest 22 on) plus 43 if >1 PC
                  // and return money
                  (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[25]);
                  (pubQuoteNum.value) = 25;
                  return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              }
            }
            break;
          case Enum268.JOE:
            if (ubNPC == Enum268.JOE && usItemToConsider == Enum225.MONEY && pNPCQuoteInfo.sActionData != Enum213.NPC_ACTION_JOE_GIVEN_CASH) {
              break;
            }
            // else fall through
          case Enum268.GERARD:
            if (ubNPC == Enum268.GERARD && usItemToConsider == Enum225.MONEY && pNPCQuoteInfo.sActionData != Enum213.NPC_ACTION_GERARD_GIVEN_CASH) {
              break;
            }
            // else fall through
          case Enum268.STEVE:
          case Enum268.VINCE:
          case Enum268.WALTER:
          case Enum268.FRANK:
            if (usItemToConsider == Enum225.MONEY) {
              if (ubNPC == Enum268.VINCE || ubNPC == Enum268.STEVE) {
                if (CheckFact(Enum170.FACT_VINCE_EXPECTING_MONEY, ubNPC) == false && gMercProfiles[ubNPC].iBalance < 0 && pNPCQuoteInfo.sActionData != Enum213.NPC_ACTION_DONT_ACCEPT_ITEM) {
                  // increment balance
                  gMercProfiles[ubNPC].iBalance += pObj.uiMoneyAmount;
                  gMercProfiles[ubNPC].uiTotalCostToDate += pObj.uiMoneyAmount;
                  if (gMercProfiles[ubNPC].iBalance > 0) {
                    gMercProfiles[ubNPC].iBalance = 0;
                  }
                  ScreenMsg(FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.BALANCE_OWED_STR], gMercProfiles[ubNPC].zNickname, -gMercProfiles[ubNPC].iBalance);
                } else if (CheckFact(Enum170.FACT_VINCE_EXPECTING_MONEY, ubNPC) == false && pNPCQuoteInfo.sActionData != Enum213.NPC_ACTION_DONT_ACCEPT_ITEM) {
                  // just accept cash!
                  if (ubNPC == Enum268.VINCE) {
                    (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[8]);
                  } else {
                    (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[7]);
                  }
                  return (ppResultQuoteInfo.value).value.ubOpinionRequired;
                } else {
                  // handle the player giving NPC some money
                  HandleNPCBeingGivenMoneyByPlayer(ubNPC, pObj.uiMoneyAmount, pubQuoteNum);
                  (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[pubQuoteNum.value]);
                  return (ppResultQuoteInfo.value).value.ubOpinionRequired;
                }
              } else {
                // handle the player giving NPC some money
                HandleNPCBeingGivenMoneyByPlayer(ubNPC, pObj.uiMoneyAmount, pubQuoteNum);
                (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[pubQuoteNum.value]);
                return (ppResultQuoteInfo.value).value.ubOpinionRequired;
              }
            }
            break;
          case Enum268.KINGPIN:
            if (usItemToConsider == Enum225.MONEY && gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTINPROGRESS) {
              HandleNPCBeingGivenMoneyByPlayer(ubNPC, pObj.uiMoneyAmount, pubQuoteNum);
              (ppResultQuoteInfo.value) = addressof(pNPCQuoteInfoArray[pubQuoteNum.value]);
              return (ppResultQuoteInfo.value).value.ubOpinionRequired;
            }
            break;
          default:
            if (usItemToConsider == Enum225.MONEY && (ubNPC == Enum268.SKYRIDER || (ubNPC >= FIRST_RPC && ubNPC < FIRST_NPC))) {
              if (gMercProfiles[ubNPC].iBalance < 0 && pNPCQuoteInfo.sActionData != Enum213.NPC_ACTION_DONT_ACCEPT_ITEM) {
                // increment balance
                gMercProfiles[ubNPC].iBalance += pObj.uiMoneyAmount;
                gMercProfiles[ubNPC].uiTotalCostToDate += pObj.uiMoneyAmount;
                if (gMercProfiles[ubNPC].iBalance > 0) {
                  gMercProfiles[ubNPC].iBalance = 0;
                }
                ScreenMsg(FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.BALANCE_OWED_STR], gMercProfiles[ubNPC].zNickname, -gMercProfiles[ubNPC].iBalance);
              }
            }
            break;
        }
        // This is great!
        // Return desire value
        (ppResultQuoteInfo.value) = pNPCQuoteInfo;
        (pubQuoteNum.value) = ubLoop;

        return pNPCQuoteInfo.ubOpinionRequired;
      }
    }
  }

  return 0;
}

function HandleNPCBeingGivenMoneyByPlayer(ubNPC: UINT8, uiMoneyAmount: UINT32, pQuoteValue: Pointer<UINT8>): boolean {
  switch (ubNPC) {
    // handle for STEVE and VINCE
    case Enum268.STEVE:
    case Enum268.VINCE: {
      let iCost: INT32;

      iCost = CalcMedicalCost(ubNPC);

      // check amount of money
      if (uiMoneyAmount + giHospitalTempBalance + giHospitalRefund >= iCost) {
        // enough cash, check how much help is needed
        if (CheckFact(Enum170.FACT_WOUNDED_MERCS_NEARBY, ubNPC)) {
          pQuoteValue.value = 26;
        } else if (CheckFact(Enum170.FACT_ONE_WOUNDED_MERC_NEARBY, ubNPC)) {
          pQuoteValue.value = 25;
        }

        if (giHospitalRefund > 0) {
          giHospitalRefund = Math.max(0, giHospitalRefund - iCost + uiMoneyAmount);
        }
        giHospitalTempBalance = 0;
      } else {
        let sTempString: string /* INT16[100] */;

        sTempString = swprintf("%ld", iCost - uiMoneyAmount - giHospitalTempBalance);
        sTempString = InsertDollarSignInToString(sTempString);

        // not enough cash
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_NEED_TO_GIVE_MONEY], gMercProfiles[ubNPC].zNickname, sTempString);
        pQuoteValue.value = 27;
        giHospitalTempBalance += uiMoneyAmount;
      }
    } break;
    case Enum268.KINGPIN:
      if (uiMoneyAmount < -gMercProfiles[Enum268.KINGPIN].iBalance) {
        pQuoteValue.value = 9;
      } else {
        pQuoteValue.value = 10;
      }
      gMercProfiles[Enum268.KINGPIN].iBalance += uiMoneyAmount;
      break;
    case Enum268.WALTER:
      if (gMercProfiles[Enum268.WALTER].iBalance == 0) {
        pQuoteValue.value = 12;
      } else {
        pQuoteValue.value = 13;
      }
      gMercProfiles[Enum268.WALTER].iBalance += uiMoneyAmount;
      break;
    case Enum268.FRANK:
      gArmsDealerStatus[Enum197.ARMS_DEALER_FRANK].uiArmsDealersCash += uiMoneyAmount;
      break;
    case Enum268.GERARD:
      gMercProfiles[Enum268.GERARD].iBalance += uiMoneyAmount;
      if ((gMercProfiles[Enum268.GERARD].iBalance) >= 10000) {
        pQuoteValue.value = 12;
      } else {
        pQuoteValue.value = 11;
      }
      break;
    case Enum268.JOE:
      gMercProfiles[Enum268.JOE].iBalance += uiMoneyAmount;
      if ((gMercProfiles[Enum268.JOE].iBalance) >= 10000) {
        pQuoteValue.value = 7;
      } else {
        pQuoteValue.value = 6;
      }
      break;
  }

  return true;
}

function NPCConsiderQuote(ubNPC: UINT8, ubMerc: UINT8, ubApproach: UINT8, ubQuoteNum: UINT8, ubTalkDesire: UINT8, pNPCQuoteInfoArray: NPCQuoteInfo[]): boolean {
  // This function looks at a quote and determines if conditions for it have been met.
  // Returns 0 if none , 1 if one is found
  let pNPCProfile: MERCPROFILESTRUCT | null;
  let pNPCQuoteInfo: NPCQuoteInfo;
  let uiDay: UINT32;
  let fTrue: boolean;

  if (ubNPC == NO_PROFILE) {
    pNPCProfile = null;
  } else {
    pNPCProfile = gMercProfiles[ubNPC];
  }

  // How much do we want to talk with this merc?
  uiDay = GetWorldDay();

  pNPCQuoteInfo = pNPCQuoteInfoArray[ubQuoteNum];

  if (CHECK_FLAG(pNPCQuoteInfo.fFlags, QUOTE_FLAG_SAID)) {
    // skip quotes already said
    return false;
  }

  // if the quote is quest-specific, is the player on that quest?
  if (pNPCQuoteInfo.ubQuest != NO_QUEST) {
    if (pNPCQuoteInfo.ubQuest > QUEST_DONE_NUM) {
      if (gubQuest[pNPCQuoteInfo.ubQuest - QUEST_DONE_NUM] != QUESTDONE) {
        return false;
      }
    } else if (pNPCQuoteInfo.ubQuest > QUEST_NOT_STARTED_NUM) {
      if (gubQuest[pNPCQuoteInfo.ubQuest - QUEST_NOT_STARTED_NUM] != QUESTNOTSTARTED) {
        return false;
      }
    } else {
      if (gubQuest[pNPCQuoteInfo.ubQuest] != QUESTINPROGRESS) {
        return false;
      }
    }
  }

  // if there are facts to be checked, check them
  if (pNPCQuoteInfo.usFactMustBeTrue != NO_FACT) {
    fTrue = CheckFact(pNPCQuoteInfo.usFactMustBeTrue, ubNPC);
    if (fTrue == false) {
      return false;
    }
  }

  if (pNPCQuoteInfo.usFactMustBeFalse != NO_FACT) {
    fTrue = CheckFact(pNPCQuoteInfo.usFactMustBeFalse, ubNPC);

    if (fTrue == true) {
      return false;
    }
  }

  // check for required approach
  // since the "I hate you" code triggers the record, triggering has to work properly
  // with the other value that is stored!
  if (pNPCQuoteInfo.ubApproachRequired || !(ubApproach == Enum296.APPROACH_FRIENDLY || ubApproach == Enum296.APPROACH_DIRECT || ubApproach == Enum296.TRIGGER_NPC)) {
    if (pNPCQuoteInfo.ubApproachRequired == Enum296.APPROACH_ONE_OF_FOUR_STANDARD) {
      // friendly to recruit will match
      if (ubApproach < Enum296.APPROACH_FRIENDLY || ubApproach > Enum296.APPROACH_RECRUIT) {
        return false;
      }
    } else if (pNPCQuoteInfo.ubApproachRequired == Enum296.APPROACH_FRIENDLY_DIRECT_OR_RECRUIT) {
      if (ubApproach != Enum296.APPROACH_FRIENDLY && ubApproach != Enum296.APPROACH_DIRECT && ubApproach != Enum296.APPROACH_RECRUIT) {
        return false;
      }
    } else if (ubApproach != pNPCQuoteInfo.ubApproachRequired) {
      return false;
    }
  }

  // check time constraints on the quotes
  if (pNPCProfile != null && pNPCQuoteInfo.ubFirstDay == MUST_BE_NEW_DAY) {
    if (uiDay <= pNPCProfile.ubLastDateSpokenTo) {
      // too early!
      return false;
    }
  } else if (uiDay < pNPCQuoteInfo.ubFirstDay) {
    // too early!
    return false;
  }

  if (uiDay > pNPCQuoteInfo.ubLastDay && uiDay < 255) {
    // too late!
    return false;
  }

  // check opinion required
  if ((pNPCQuoteInfo.ubOpinionRequired != IRRELEVANT) && (ubApproach != Enum296.TRIGGER_NPC)) {
    if (ubTalkDesire < pNPCQuoteInfo.ubOpinionRequired) {
      return false;
    }
  }

  // Return the quote opinion value!
  return true;
}

function ReplaceLocationInNPCData(pNPCQuoteInfoArray: NPCQuoteInfo[], sOldGridNo: INT16, sNewGridNo: INT16): void {
  let ubFirstQuoteRecord: UINT8;
  let ubLastQuoteRecord: UINT8;
  let ubLoop: UINT8;
  let pNPCQuoteInfo: NPCQuoteInfo;

  ubFirstQuoteRecord = 0;
  ubLastQuoteRecord = NUM_NPC_QUOTE_RECORDS - 1;
  for (ubLoop = ubFirstQuoteRecord; ubLoop <= ubLastQuoteRecord; ubLoop++) {
    pNPCQuoteInfo = pNPCQuoteInfoArray[ubLoop];
    if (sOldGridNo == -pNPCQuoteInfo.sRequiredGridno) {
      pNPCQuoteInfo.sRequiredGridno = -sNewGridNo;
    }
    if (sOldGridNo == pNPCQuoteInfo.usGoToGridno) {
      pNPCQuoteInfo.usGoToGridno = sNewGridNo;
    }
  }
}

export function ReplaceLocationInNPCDataFromProfileID(ubNPC: UINT8, sOldGridNo: INT16, sNewGridNo: INT16): void {
  let pNPCQuoteInfoArray: NPCQuoteInfo[];

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  ReplaceLocationInNPCData(pNPCQuoteInfoArray, sOldGridNo, sNewGridNo);
}

function ResetOncePerConvoRecords(pNPCQuoteInfoArray: NPCQuoteInfo[]): void {
  let ubLoop: UINT8;

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    if (CHECK_FLAG(pNPCQuoteInfoArray[ubLoop].fFlags, QUOTE_FLAG_SAY_ONCE_PER_CONVO)) {
      pNPCQuoteInfoArray[ubLoop].fFlags = TURN_FLAG_OFF(pNPCQuoteInfoArray[ubLoop].fFlags, QUOTE_FLAG_SAID);
    }
  }
}

export function ResetOncePerConvoRecordsForNPC(ubNPC: UINT8): void {
  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return;
  }
  ResetOncePerConvoRecords(gpNPCQuoteInfoArray[ubNPC]);
}

export function ResetOncePerConvoRecordsForAllNPCsInLoadedSector(): void {
  let ubLoop: UINT8;

  if (gWorldSectorX == 0 || gWorldSectorY == 0) {
    return;
  }

  for (ubLoop = FIRST_RPC; ubLoop < NUM_PROFILES; ubLoop++) {
    if (gMercProfiles[ubLoop].sSectorX == gWorldSectorX && gMercProfiles[ubLoop].sSectorY == gWorldSectorY && gMercProfiles[ubLoop].bSectorZ == gbWorldSectorZ && gpNPCQuoteInfoArray[ubLoop] != null) {
      ResetOncePerConvoRecordsForNPC(ubLoop);
    }
  }
}

function ReturnItemToPlayerIfNecessary(ubMerc: UINT8, bApproach: INT8, uiApproachData: UINT32, pQuotePtr: NPCQuoteInfo | null): void {
  let pObj: OBJECTTYPE;
  let pSoldier: SOLDIERTYPE;

  // if the approach was changed, always return the item
  // otherwise check to see if the record in question specified refusal
  if (bApproach != Enum296.APPROACH_GIVINGITEM || (pQuotePtr == null) || (pQuotePtr.sActionData == Enum213.NPC_ACTION_DONT_ACCEPT_ITEM)) {
    pObj = uiApproachData;

    // Find the merc
    pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubMerc, false);

    // Try to auto place object and then if it fails, put into cursor
    if (!AutoPlaceObject(pSoldier, pObj, false)) {
      InternalBeginItemPointer(pSoldier, pObj, NO_SLOT);
    }
    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
  }
}

export function Converse(ubNPC: UINT8, ubMerc: UINT8, bApproach: INT8, uiApproachData: UINT32): void {
  let QuoteInfo: NPCQuoteInfo = createNPCQuoteInfo();
  let pQuotePtr: NPCQuoteInfo = QuoteInfo;
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pProfile: MERCPROFILESTRUCT;
  let ubLoop: UINT8;
  let ubQuoteNum: UINT8;
  let ubRecordNum: UINT8;
  let pSoldier: SOLDIERTYPE | null;
  let uiDay: UINT32;
  let pObj: OBJECTTYPE;
  let pNPC: SOLDIERTYPE;
  let fAttemptingToGiveItem: boolean;

  // we have to record whether an item is being given in order to determine whether,
  // in the case where the approach is overridden, we need to return the item to the
  // player
  fAttemptingToGiveItem = (bApproach == Enum296.APPROACH_GIVINGITEM);

  pNPC = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);
  if (pNPC) {
    // set delay for civ AI movement
    pNPC.uiTimeSinceLastSpoke = GetJA2Clock();

    if (CheckFact(Enum170.FACT_CURRENT_SECTOR_IS_SAFE, ubNPC) == false) {
      if (bApproach != Enum296.TRIGGER_NPC && bApproach != Enum296.APPROACH_GIVEFIRSTAID && bApproach != Enum296.APPROACH_DECLARATION_OF_HOSTILITY && bApproach != Enum296.APPROACH_ENEMY_NPC_QUOTE) {
        if (NPCHasUnusedRecordWithGivenApproach(ubNPC, Enum296.APPROACH_SECTOR_NOT_SAFE)) {
          // override with sector-not-safe approach
          bApproach = Enum296.APPROACH_SECTOR_NOT_SAFE;
        }
      }
    }

    // make sure civ is awake now
    pNPC.fAIFlags &= (~AI_ASLEEP);
  }

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!

    if (fAttemptingToGiveItem) {
      ReturnItemToPlayerIfNecessary(ubMerc, bApproach, uiApproachData, null);
    }
    return;
  }
  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  pProfile = gMercProfiles[ubNPC];
  switch (bApproach) {
    case Enum296.NPC_INITIAL_QUOTE:
      // reset stuff
      ResetOncePerConvoRecords(pNPCQuoteInfoArray);

      // CHEAP HACK
      // Since we don't have CONDITIONAL once-per-convo refreshes, do this in code
      // NB fact 281 is 'Darren has explained boxing rules'
      if (ubNPC == Enum268.DARREN && CheckFact(281, Enum268.DARREN) == false) {
        pNPCQuoteInfoArray[11].fFlags = TURN_FLAG_OFF(pNPCQuoteInfoArray[11].fFlags, QUOTE_FLAG_SAID);
      }

      // turn the NPC to face us
      // this '1' value is a dummy....
      NPCDoAction(ubNPC, Enum213.NPC_ACTION_TURN_TO_FACE_NEAREST_MERC, 1);

      if (pProfile.ubLastDateSpokenTo > 0) {
        uiDay = GetWorldDay();
        if (uiDay > pProfile.ubLastDateSpokenTo)
        {
          NPCConsiderTalking(ubNPC, ubMerc, Enum296.APPROACH_SPECIAL_INITIAL_QUOTE, 0, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
          if (pQuotePtr != null) {
            // converse using this approach instead!
            if (fAttemptingToGiveItem) {
              ReturnItemToPlayerIfNecessary(ubMerc, bApproach, uiApproachData, null);
            }
            Converse(ubNPC, ubMerc, Enum296.APPROACH_SPECIAL_INITIAL_QUOTE, 0);
            return;
          }
          // subsequent times approached intro
          ubQuoteNum = Enum297.QUOTE_SUBS_INTRO;
        } else {
          // say nothing!
          if (fAttemptingToGiveItem) {
            ReturnItemToPlayerIfNecessary(ubMerc, bApproach, uiApproachData, null);
          }
          return;
        }
      } else {
        // try special initial quote first
        NPCConsiderTalking(ubNPC, ubMerc, Enum296.APPROACH_SPECIAL_INITIAL_QUOTE, 0, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
        if (pQuotePtr != null) {
          // converse using this approach instead!
          if (fAttemptingToGiveItem) {
            ReturnItemToPlayerIfNecessary(ubMerc, bApproach, uiApproachData, null);
          }
          Converse(ubNPC, ubMerc, Enum296.APPROACH_SPECIAL_INITIAL_QUOTE, 0);
          return;
        }

        NPCConsiderTalking(ubNPC, ubMerc, Enum296.APPROACH_INITIAL_QUOTE, 0, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
        if (pQuotePtr != null) {
          // converse using this approach instead!
          if (fAttemptingToGiveItem) {
            ReturnItemToPlayerIfNecessary(ubMerc, bApproach, uiApproachData, null);
          }
          Converse(ubNPC, ubMerc, Enum296.APPROACH_INITIAL_QUOTE, 0);
          return;
        }

        // first time approached intro
        ubQuoteNum = Enum297.QUOTE_INTRO;
      }
      TalkingMenuDialogue(ubQuoteNum);
      pProfile.ubLastQuoteSaid = ubQuoteNum;
      pProfile.bLastQuoteSaidWasSpecial = false;
      break;
    case Enum296.NPC_WHOAREYOU:
      ubQuoteNum = Enum297.QUOTE_INTRO;
      TalkingMenuDialogue(ubQuoteNum);
      // For now, DO NOT remember for 'Come again?'
      break;
    case Enum296.APPROACH_REPEAT:
      if (pProfile.ubLastQuoteSaid == NO_QUOTE) {
        // this should never occur now!
        TalkingMenuDialogue(Enum297.QUOTE_INTRO);
      } else {
        if (pProfile.bLastQuoteSaidWasSpecial) {
          pQuotePtr = pNPCQuoteInfoArray[pProfile.ubLastQuoteSaid];
          // say quote and following consecutive quotes
          for (ubLoop = 0; ubLoop < pQuotePtr.ubNumQuotes; ubLoop++) {
            // say quote #(pQuotePtr->ubQuoteNum + ubLoop)
            TalkingMenuDialogue((pQuotePtr.ubQuoteNum + ubLoop));
          }
        } else {
          TalkingMenuDialogue(pProfile.ubLastQuoteSaid);
        }
      }
      break;
    default:
      switch (bApproach) {
        case Enum296.APPROACH_GIVINGITEM:
          // first start by triggering any introduction quote if there is one...
          if (pProfile.ubLastDateSpokenTo > 0) {
            uiDay = GetWorldDay();
            if (uiDay > pProfile.ubLastDateSpokenTo) {
              NPCConsiderTalking(ubNPC, ubMerc, Enum296.APPROACH_SPECIAL_INITIAL_QUOTE, 0, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
              if (pQuotePtr != null) {
                // converse using this approach instead!
                Converse(ubNPC, ubMerc, Enum296.APPROACH_SPECIAL_INITIAL_QUOTE, 0);

                if (ubNPC == Enum268.DARREN) {
                  // then we have to make this give attempt fail
                  ReturnItemToPlayerIfNecessary(ubMerc, bApproach, uiApproachData, null);
                  return;
                }
              }
            }
          } else {
            NPCConsiderTalking(ubNPC, ubMerc, Enum296.APPROACH_INITIAL_QUOTE, 0, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
            if (pQuotePtr != null) {
              // converse using this approach instead!
              Converse(ubNPC, ubMerc, Enum296.APPROACH_INITIAL_QUOTE, 0);
            }
          }

          // If we are approaching because we want to give an item, do something different
          pObj = uiApproachData;
          NPCConsiderReceivingItemFromMerc(ubNPC, ubMerc, pObj, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
          break;
        case Enum296.TRIGGER_NPC:
          // if triggering, pass in the approach data as the record to consider
          DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Handling trigger %S/%d at %ld", gMercProfiles[ubNPC].zNickname, uiApproachData, GetJA2Clock()));
          NPCConsiderTalking(ubNPC, ubMerc, bApproach, uiApproachData, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
          break;
        default:
          NPCConsiderTalking(ubNPC, ubMerc, bApproach, 0, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubRecordNum));
          break;
      }
      if (pQuotePtr == null) {
        // say random everyday quote
        // do NOT set last quote said!
        switch (bApproach) {
          case Enum296.APPROACH_FRIENDLY:
            if (pProfile.bFriendlyOrDirectDefaultResponseUsedRecently) {
              ubQuoteNum = Enum297.QUOTE_GETLOST;
            } else {
              ubQuoteNum = Enum297.QUOTE_FRIENDLY_DEFAULT1 + Random(2);
              pProfile.bFriendlyOrDirectDefaultResponseUsedRecently = true;
            }
            break;
          case Enum296.APPROACH_DIRECT:
            if (pProfile.bFriendlyOrDirectDefaultResponseUsedRecently) {
              ubQuoteNum = Enum297.QUOTE_GETLOST;
            } else {
              ubQuoteNum = Enum297.QUOTE_DIRECT_DEFAULT;
              pProfile.bFriendlyOrDirectDefaultResponseUsedRecently = true;
            }
            break;
          case Enum296.APPROACH_THREATEN:
            if (pProfile.bThreatenDefaultResponseUsedRecently) {
              ubQuoteNum = Enum297.QUOTE_GETLOST;
            } else {
              ubQuoteNum = Enum297.QUOTE_THREATEN_DEFAULT;
              pProfile.bThreatenDefaultResponseUsedRecently = true;
            }
            break;
          case Enum296.APPROACH_RECRUIT:
            if (pProfile.bRecruitDefaultResponseUsedRecently) {
              ubQuoteNum = Enum297.QUOTE_GETLOST;
            } else {
              ubQuoteNum = Enum297.QUOTE_RECRUIT_NO;
              pProfile.bRecruitDefaultResponseUsedRecently = true;
            }
            break;
          case Enum296.APPROACH_GIVINGITEM:
            ubQuoteNum = Enum297.QUOTE_GIVEITEM_NO;

            /*
            CC - now handled below
            */
            break;
          case Enum296.TRIGGER_NPC:
            // trigger did not succeed - abort!!
            return;
          default:
            ubQuoteNum = Enum297.QUOTE_INTRO;
            break;
        }
        TalkingMenuDialogue(ubQuoteNum);
        pProfile.ubLastQuoteSaid = ubQuoteNum;
        pProfile.bLastQuoteSaidWasSpecial = false;
        if (ubQuoteNum == Enum297.QUOTE_GETLOST) {
          if (ubNPC == 70 || ubNPC == 120) {
            // becomes an enemy
            NPCDoAction(ubNPC, Enum213.NPC_ACTION_BECOME_ENEMY, 0);
          }
          // close panel at end of speech
          NPCClosePanel();
        } else if (ubQuoteNum == Enum297.QUOTE_GIVEITEM_NO) {
          // close panel at end of speech
          NPCClosePanel();
          if (pNPC) {
            switch (ubNPC) {
              case Enum268.JIM:
              case Enum268.JACK:
              case Enum268.OLAF:
              case Enum268.RAY:
              case Enum268.OLGA:
              case Enum268.TYRONE:
                // Start combat etc
                CancelAIAction(pNPC, 1);
                AddToShouldBecomeHostileOrSayQuoteList(pNPC.ubID);
              default:
                break;
            }
          }
        }
      } else {
        // turn before speech?
        if (pQuotePtr.sActionData <= -Enum213.NPC_ACTION_TURN_TO_FACE_NEAREST_MERC) {
          pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);
          pSoldier.AICounter = ZEROTIMECOUNTER();
          if (pSoldier.bNextAction == Enum289.AI_ACTION_WAIT) {
            pSoldier.bNextAction = Enum289.AI_ACTION_NONE;
            pSoldier.usNextActionData = 0;
          }
          NPCDoAction(ubNPC,  - (pQuotePtr.sActionData), ubRecordNum);
        }
        if (pQuotePtr.ubQuoteNum != NO_QUOTE) {
          // say quote and following consecutive quotes
          for (ubLoop = 0; ubLoop < pQuotePtr.ubNumQuotes; ubLoop++) {
            TalkingMenuDialogue((pQuotePtr.ubQuoteNum + ubLoop));
          }
          pProfile.ubLastQuoteSaid = ubRecordNum;
          pProfile.bLastQuoteSaidWasSpecial = true;
        }
        // set to "said" if we should do so
        if (pQuotePtr.fFlags & QUOTE_FLAG_ERASE_ONCE_SAID || pQuotePtr.fFlags & QUOTE_FLAG_SAY_ONCE_PER_CONVO) {
          pQuotePtr.fFlags = TURN_FLAG_ON(pQuotePtr.fFlags, QUOTE_FLAG_SAID);
        }

        // Carry out implications (actions) of this record

        // Give NPC item if appropriate
        if (bApproach == Enum296.APPROACH_GIVINGITEM) {
          if (pQuotePtr.sActionData != Enum213.NPC_ACTION_DONT_ACCEPT_ITEM) {
            PlaceObjectInSoldierProfile(ubNPC, pObj);

            // Find the GIVER....
            pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubMerc, false);

            // Is this one of us?
            if (pSoldier.bTeam == gbPlayerNum) {
              let bSlot: INT8;

              bSlot = FindExactObj(pSoldier, pObj);
              if (bSlot != NO_SLOT) {
                RemoveObjs(pSoldier.inv[bSlot], pObj.ubNumberOfObjects);
                DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
              }
            } else {
              RemoveObjectFromSoldierProfile(ubMerc, pObj.usItem);
            }
          }
          // CC: now handled below
          /*
          else
          {
                  // ATE: Here, put back into inventory or place on ground....
                  {
                          // Find the merc
                          pSoldier = FindSoldierByProfileID( ubMerc, FALSE );

                          // Try to auto place object and then if it fails, put into cursor
                          if ( !AutoPlaceObject( pSoldier, pObj, FALSE ) )
                          {
                                  InternalBeginItemPointer( pSoldier, pObj, NO_SLOT );
                          }
                          DirtyMercPanelInterface( pSoldier, DIRTYLEVEL2 );

                  }
          }
          */
        } else if (bApproach == Enum296.APPROACH_RECRUIT) {
          // the guy just joined our party
        }

        // Set things
        if (pQuotePtr.usSetFactTrue != NO_FACT) {
          SetFactTrue(pQuotePtr.usSetFactTrue);
        }
        if (pQuotePtr.ubEndQuest != NO_QUEST) {
          EndQuest(pQuotePtr.ubEndQuest, gWorldSectorX, gWorldSectorY);
        }
        if (pQuotePtr.ubStartQuest != NO_QUEST) {
          StartQuest(pQuotePtr.ubStartQuest, gWorldSectorX, gWorldSectorY);
        }

        // Give item to merc?
        if (pQuotePtr.usGiftItem >= TURN_UI_OFF) {
          switch (pQuotePtr.usGiftItem) {
            case TURN_UI_OFF:
              if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
                gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
                // Increment refrence count...
                giNPCReferenceCount = 1;
              }
              break;
            case TURN_UI_ON:
              // while the special ref count is set, ignore standard off
              if (giNPCSpecialReferenceCount == 0) {
                gTacticalStatus.uiFlags &= ~ENGAGED_IN_CONV;
                // Decrement refrence count...
                giNPCReferenceCount = 0;
              }
              break;
            case SPECIAL_TURN_UI_OFF:
              if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
                gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
                // Increment refrence count...
                giNPCReferenceCount = 1;
                if (giNPCSpecialReferenceCount < 0) {
                  // ???
                  giNPCSpecialReferenceCount = 0;
                }
                // increment SPECIAL reference count
                giNPCSpecialReferenceCount += 1;
              }
              break;
            case SPECIAL_TURN_UI_ON:
              // Decrement SPECIAL reference count
              giNPCSpecialReferenceCount -= 1;
              // if special count is now 0, turn reactivate UI
              if (giNPCSpecialReferenceCount == 0) {
                gTacticalStatus.uiFlags &= ~ENGAGED_IN_CONV;
                giNPCReferenceCount = 0;
              } else if (giNPCSpecialReferenceCount < 0) {
                // ???
                giNPCSpecialReferenceCount = 0;
              }
              break;
          }
        } else if (pQuotePtr.usGiftItem != 0) {
          {
            let bInvPos: INT8;

            // Get soldier
            pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);

            // Look for item....
            bInvPos = FindObj(pSoldier, pQuotePtr.usGiftItem);

            AssertMsg(bInvPos != NO_SLOT, "NPC.C:  Gift item does not exist in NPC.");

            TalkingMenuGiveItem(ubNPC, pSoldier.inv[bInvPos], bInvPos);
          }
        }
        // Action before movement?
        if (pQuotePtr.sActionData < 0 && pQuotePtr.sActionData > -Enum213.NPC_ACTION_TURN_TO_FACE_NEAREST_MERC) {
          pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);
          pSoldier.AICounter = ZEROTIMECOUNTER();
          if (pSoldier.bNextAction == Enum289.AI_ACTION_WAIT) {
            pSoldier.bNextAction = Enum289.AI_ACTION_NONE;
            pSoldier.usNextActionData = 0;
          }
          NPCDoAction(ubNPC,  - (pQuotePtr.sActionData), ubRecordNum);
        } else if (pQuotePtr.usGoToGridno == NO_MOVE && pQuotePtr.sActionData > 0) {
          pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);
          pSoldier.AICounter = ZEROTIMECOUNTER();
          if (pSoldier.bNextAction == Enum289.AI_ACTION_WAIT) {
            pSoldier.bNextAction = Enum289.AI_ACTION_NONE;
            pSoldier.usNextActionData = 0;
          }
          NPCDoAction(ubNPC, (pQuotePtr.sActionData), ubRecordNum);
        }

        // Movement?
        if (pQuotePtr.usGoToGridno != NO_MOVE) {
          pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);

          // stupid hack CC
          if (pSoldier && ubNPC == Enum268.KYLE) {
            // make sure he has keys
            pSoldier.bHasKeys = true;
          }
          if (pSoldier && pSoldier.sGridNo == pQuotePtr.usGoToGridno) {
            // search for quotes to trigger immediately!
            pSoldier.ubQuoteRecord = ubRecordNum + 1; // add 1 so that the value is guaranteed nonzero
            NPCReachedDestination(pSoldier, true);
          } else {
            // turn off cowering
            if (pNPC.uiStatusFlags & SOLDIER_COWERING) {
              // pNPC->uiStatusFlags &= ~SOLDIER_COWERING;
              EVENT_InitNewSoldierAnim(pNPC, Enum193.STANDING, 0, false);
            }

            pSoldier.ubQuoteRecord = ubRecordNum + 1; // add 1 so that the value is guaranteed nonzero

            if (pQuotePtr.sActionData == Enum213.NPC_ACTION_TELEPORT_NPC) {
              BumpAnyExistingMerc(pQuotePtr.usGoToGridno);
              TeleportSoldier(pSoldier, pQuotePtr.usGoToGridno, false);
              // search for quotes to trigger immediately!
              NPCReachedDestination(pSoldier, false);
            } else {
              NPCGotoGridNo(ubNPC, pQuotePtr.usGoToGridno, ubRecordNum);
            }
          }
        }

        // Trigger other NPC?
        // ATE: Do all triggers last!
        if (pQuotePtr.ubTriggerNPC != IRRELEVANT) {
          // Check for special NPC trigger codes
          if (pQuotePtr.ubTriggerNPC == 0) {
            TriggerClosestMercWhoCanSeeNPC(ubNPC, pQuotePtr);
          } else if (pQuotePtr.ubTriggerNPC == 1) {
            // trigger self
            TriggerNPCRecord(ubNPC, pQuotePtr.ubTriggerNPCRec);
          } else {
            TriggerNPCRecord(pQuotePtr.ubTriggerNPC, pQuotePtr.ubTriggerNPCRec);
          }
        }

        // Ian says it is okay to take this out!
        /*
        if (bApproach == APPROACH_ENEMY_NPC_QUOTE)
        {
                NPCClosePanel();
        }
        */
      }
      break;
  }

  // Set last day spoken!
  switch (bApproach) {
    case Enum296.APPROACH_FRIENDLY:
    case Enum296.APPROACH_DIRECT:
    case Enum296.APPROACH_THREATEN:
    case Enum296.APPROACH_RECRUIT:
    case Enum296.NPC_INITIATING_CONV:
    case Enum296.NPC_INITIAL_QUOTE:
    case Enum296.APPROACH_SPECIAL_INITIAL_QUOTE:
    case Enum296.APPROACH_DECLARATION_OF_HOSTILITY:
    case Enum296.APPROACH_INITIAL_QUOTE:
    case Enum296.APPROACH_GIVINGITEM:
      pProfile.ubLastDateSpokenTo = GetWorldDay();
      break;
    default:
      break;
  }

  // return item?
  if (fAttemptingToGiveItem) {
    ReturnItemToPlayerIfNecessary(ubMerc, bApproach, uiApproachData, pQuotePtr);
  }
}

export function NPCConsiderInitiatingConv(pNPC: SOLDIERTYPE, pubDesiredMerc: Pointer<UINT8>): INT16 {
  let sMyGridNo: INT16;
  let sDist: INT16;
  let sDesiredMercDist: INT16 = 100;
  let ubNPC: UINT8;
  let ubMerc: UINT8;
  let ubDesiredMerc: UINT8 = NOBODY;
  let ubTalkDesire: UINT8;
  let ubHighestTalkDesire: UINT8 = 0;
  let pMerc: SOLDIERTYPE;
  let pDesiredMerc: SOLDIERTYPE = <SOLDIERTYPE><unknown>undefined;
  let pNPCQuoteInfoArray: NPCQuoteInfo[];

  if (!pubDesiredMerc) {
    return 0;
  }
  sMyGridNo = pNPC.sGridNo;

  ubNPC = pNPC.ubProfile;
  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return NOWHERE;
  }
  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  // loop through all mercs
  for (ubMerc = 0; ubMerc < guiNumMercSlots; ubMerc++) {
    pMerc = MercSlots[ubMerc];
    if (pMerc != null) {
      // only look for mercs on the side of the player
      if (pMerc.bSide != gbPlayerNum) {
        continue;
      }

      // only look for active mercs
      if (pMerc.bAssignment >= Enum117.ON_DUTY) {
        continue;
      }

      // if they're not visible, don't think about it
      if (pNPC.bOppList[ubMerc] != SEEN_CURRENTLY) {
        continue;
      }

      // what's the opinion required for the highest-opinion quote that we would
      // say to this merc
      ubTalkDesire = NPCConsiderTalking(pNPC.ubProfile, pMerc.ubProfile, Enum296.NPC_INITIATING_CONV, 0, pNPCQuoteInfoArray, null, null);
      if (ubTalkDesire > 0) {
        if (ubTalkDesire > ubHighestTalkDesire) {
          ubHighestTalkDesire = ubTalkDesire;
          ubDesiredMerc = ubMerc;
          pDesiredMerc = MercPtrs[ubMerc];
          sDesiredMercDist = PythSpacesAway(sMyGridNo, pDesiredMerc.sGridNo);
        } else if (ubTalkDesire == ubHighestTalkDesire) {
          sDist = PythSpacesAway(sMyGridNo, MercPtrs[ubMerc].sGridNo);
          if (sDist < sDesiredMercDist) {
            // we can say the same thing to this merc, and they're closer!
            ubDesiredMerc = ubMerc;
            sDesiredMercDist = sDist;
          }
        }
      }
    }
  }

  if (ubDesiredMerc == NOBODY) {
    return NOWHERE;
  } else {
    pubDesiredMerc.value = ubDesiredMerc;
    return pDesiredMerc.sGridNo;
  }
}

function NPCTryToInitiateConv(pNPC: SOLDIERTYPE): UINT8 {
  // assumes current action is ACTION_APPROACH_MERC
  if (pNPC.bAction != Enum289.AI_ACTION_APPROACH_MERC) {
    return Enum289.AI_ACTION_NONE;
  }
  if (PythSpacesAway(pNPC.sGridNo, MercPtrs[pNPC.usActionData].sGridNo) < CONVO_DIST) {
    // initiate conversation!
    Converse(pNPC.ubProfile, MercPtrs[pNPC.usActionData].ubProfile, Enum296.NPC_INITIATING_CONV, 0);
    // after talking, wait a while before moving anywhere else
    return Enum289.AI_ACTION_WAIT;
  } else {
    // try to move towards that merc
    return Enum289.AI_ACTION_APPROACH_MERC;
  }
}

/*
BOOLEAN NPCOkToGiveItem( UINT8 ubNPC, UINT8 ubMerc, UINT16 usItem )
{
        // This function seems to be unused...

        NPCQuoteInfo					QuoteInfo;
        NPCQuoteInfo *				pQuotePtr = &(QuoteInfo);
        NPCQuoteInfo *				pNPCQuoteInfoArray;
        UINT8									ubOpinionVal;
        UINT8									ubQuoteNum;

        if (EnsureQuoteFileLoaded( ubNPC ) == FALSE)
        {
                // error!!!
                return( FALSE );
        }
        pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

        ubOpinionVal =  NPCConsiderReceivingItemFromMerc( ubNPC, ubMerc, usItem, pNPCQuoteInfoArray, &pQuotePtr, &ubQuoteNum );

        if ( ubOpinionVal )
        {
                return( TRUE );
        }
        else
        {
                return( FALSE );
        }
}
*/
export function NPCReachedDestination(pNPC: SOLDIERTYPE, fAlreadyThere: boolean): void {
  // perform action or whatever after reaching our destination
  let ubNPC: UINT8;
  let pQuotePtr: NPCQuoteInfo;
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let ubLoop: UINT8;
  let ubQuoteRecord: UINT8;

  if (pNPC.ubQuoteRecord == 0) {
    ubQuoteRecord = 0;
  } else {
    ubQuoteRecord = (pNPC.ubQuoteRecord - 1);
  }

  // Clear values!
  pNPC.ubQuoteRecord = 0;
  if (pNPC.bTeam == gbPlayerNum) {
    // the "under ai control" flag was set temporarily; better turn it off now
    pNPC.uiStatusFlags &= (~SOLDIER_PCUNDERAICONTROL);
    // make damn sure the AI_HANDLE_EVERY_FRAME flag is turned off
    pNPC.fAIFlags &= (AI_HANDLE_EVERY_FRAME);
  }

  ubNPC = pNPC.ubProfile;
  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];
  pQuotePtr = pNPCQuoteInfoArray[ubQuoteRecord];
  // either we are supposed to consider a new quote record
  // (indicated by a negative gridno in the has-item field)
  // or an action to perform once we reached this gridno

  if (pNPC.sGridNo == pQuotePtr.usGoToGridno) {
    // check for an after-move action
    if (pQuotePtr.sActionData > 0) {
      NPCDoAction(ubNPC, pQuotePtr.sActionData, ubQuoteRecord);
    }
  }

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (pNPC.sGridNo == -(pQuotePtr.sRequiredGridno)) {
      if (NPCConsiderQuote(ubNPC, 0, Enum296.TRIGGER_NPC, ubLoop, 0, pNPCQuoteInfoArray)) {
        if (fAlreadyThere) {
          TriggerNPCRecord(ubNPC, ubLoop);
        } else {
          // trigger this quote
          TriggerNPCRecordImmediately(ubNPC, ubLoop);
        }
        return;
      }
    }
  }
}

export function TriggerNPCRecord(ubTriggerNPC: UINT8, ubTriggerNPCRec: UINT8): void {
  // Check if we have a quote to trigger...
  let pQuotePtr: NPCQuoteInfo;
  let fDisplayDialogue: boolean = true;

  if (EnsureQuoteFileLoaded(ubTriggerNPC) == false) {
    // error!!!
    return;
  }
  pQuotePtr = gpNPCQuoteInfoArray[ubTriggerNPC][ubTriggerNPCRec];
  if (pQuotePtr.ubQuoteNum == IRRELEVANT) {
    fDisplayDialogue = false;
  }

  if (NPCConsiderQuote(ubTriggerNPC, 0, Enum296.TRIGGER_NPC, ubTriggerNPCRec, 0, gpNPCQuoteInfoArray[ubTriggerNPC])) {
    NPCTriggerNPC(ubTriggerNPC, ubTriggerNPCRec, Enum296.TRIGGER_NPC, fDisplayDialogue);
  } else {
    // don't do anything
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("WARNING: trigger of %d, record %d cannot proceed, possible error", ubTriggerNPC, ubTriggerNPCRec));
  }
}

export function TriggerNPCRecordImmediately(ubTriggerNPC: UINT8, ubTriggerNPCRec: UINT8): void {
  // Check if we have a quote to trigger...
  let pQuotePtr: NPCQuoteInfo;
  let fDisplayDialogue: boolean = true;

  if (EnsureQuoteFileLoaded(ubTriggerNPC) == false) {
    // error!!!
    return;
  }
  pQuotePtr = gpNPCQuoteInfoArray[ubTriggerNPC][ubTriggerNPCRec];
  if (pQuotePtr.ubQuoteNum == IRRELEVANT) {
    fDisplayDialogue = false;
  }

  if (NPCConsiderQuote(ubTriggerNPC, 0, Enum296.TRIGGER_NPC, ubTriggerNPCRec, 0, gpNPCQuoteInfoArray[ubTriggerNPC])) {
    // trigger IMMEDIATELY
    HandleNPCTriggerNPC(ubTriggerNPC, ubTriggerNPCRec, fDisplayDialogue, Enum296.TRIGGER_NPC);
  } else {
    // don't do anything
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("WARNING: trigger of %d, record %d cannot proceed, possible error", ubTriggerNPC, ubTriggerNPCRec));
  }
}

export function PCsNearNPC(ubNPC: UINT8): void {
  let ubLoop: UINT8;
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pSoldier: SOLDIERTYPE;
  let pQuotePtr: NPCQuoteInfo;

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return;
  }
  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  // see what this triggers...
  SetFactTrue(Enum170.FACT_PC_NEAR);

  // Clear values!
  // Get value for NPC
  pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);
  pSoldier.ubQuoteRecord = 0;

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (pSoldier.sGridNo == -(pQuotePtr.sRequiredGridno)) {
      if (NPCConsiderQuote(ubNPC, 0, Enum296.TRIGGER_NPC, ubLoop, 0, pNPCQuoteInfoArray)) {
        // trigger this quote IMMEDIATELY!
        TriggerNPCRecordImmediately(ubNPC, ubLoop);
        break;
      }
    }
  }

  // reset fact
  SetFactFalse(Enum170.FACT_PC_NEAR);
}

export function PCDoesFirstAidOnNPC(ubNPC: UINT8): boolean {
  let ubLoop: UINT8;
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pSoldier: SOLDIERTYPE;
  let pQuotePtr: NPCQuoteInfo;

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return false;
  }
  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  // Get ptr to NPC
  pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);
  // Clear values!
  pSoldier.ubQuoteRecord = 0;

  // Set flag...
  gMercProfiles[ubNPC].ubMiscFlags2 |= PROFILE_MISC_FLAG2_BANDAGED_TODAY;

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (pQuotePtr.ubApproachRequired == Enum296.APPROACH_GIVEFIRSTAID) {
      if (NPCConsiderQuote(ubNPC, 0, Enum296.TRIGGER_NPC, ubLoop, 0, pNPCQuoteInfoArray)) {
        // trigger this quote IMMEDIATELY!
        TriggerNPCRecordImmediately(ubNPC, ubLoop);
        return true;
      }
    }
  }
  return false;
}

function TriggerClosestMercWhoCanSeeNPC(ubNPC: UINT8, pQuotePtr: NPCQuoteInfo): void {
  // Loop through all mercs, gather closest mercs who can see and trigger one!
  let ubMercsInSector: UINT8[] /* [40] */ = createArray(40, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // First get pointer to NPC
  pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubNPC, false);

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // Add guy if he's a candidate...
    if (OK_INSECTOR_MERC(pTeamSoldier) && pTeamSoldier.bOppList[pSoldier.ubID] == SEEN_CURRENTLY) {
      ubMercsInSector[ubNumMercs] = cnt;
      ubNumMercs++;
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    // Post action to close panel
    NPCClosePanel();

    // If 64, do something special
    if (pQuotePtr.ubTriggerNPCRec == Enum202.QUOTE_RESPONSE_TO_MIGUEL_SLASH_QUOTE_MERC_OR_RPC_LETGO) {
      TacticalCharacterDialogueWithSpecialEvent(MercPtrs[ubMercsInSector[ubChosenMerc]], pQuotePtr.ubTriggerNPCRec, DIALOGUE_SPECIAL_EVENT_PCTRIGGERNPC, 57, 6);
    } else {
      TacticalCharacterDialogue(MercPtrs[ubMercsInSector[ubChosenMerc]], pQuotePtr.ubTriggerNPCRec);
    }
  }
}

export function TriggerNPCWithIHateYouQuote(ubTriggerNPC: UINT8): boolean {
  // Check if we have a quote to trigger...
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pQuotePtr: NPCQuoteInfo;
  let fDisplayDialogue: boolean = true;
  let ubLoop: UINT8;

  if (EnsureQuoteFileLoaded(ubTriggerNPC) == false) {
    // error!!!
    return false;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubTriggerNPC];

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (NPCConsiderQuote(ubTriggerNPC, 0, Enum296.APPROACH_DECLARATION_OF_HOSTILITY, ubLoop, 0, pNPCQuoteInfoArray)) {
      // trigger this quote!
      // reset approach required value so that we can trigger it
      // pQuotePtr->ubApproachRequired = TRIGGER_NPC;
      NPCTriggerNPC(ubTriggerNPC, ubLoop, Enum296.APPROACH_DECLARATION_OF_HOSTILITY, true);
      gMercProfiles[ubTriggerNPC].ubMiscFlags |= PROFILE_MISC_FLAG_SAID_HOSTILE_QUOTE;
      return true;
    }
  }
  return false;
}

export function NPCHasUnusedRecordWithGivenApproach(ubNPC: UINT8, ubApproach: UINT8): boolean {
  // Check if we have a quote that could be used
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pQuotePtr: NPCQuoteInfo;
  let ubLoop: UINT8;

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return false;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (NPCConsiderQuote(ubNPC, 0, ubApproach, ubLoop, 0, pNPCQuoteInfoArray)) {
      return true;
    }
  }
  return false;
}

export function NPCHasUnusedHostileRecord(ubNPC: UINT8, ubApproach: UINT8): boolean {
  // this is just like the standard check BUT we must skip any
  // records using fact 289 and print debug msg for any records which can't be marked as used
  // Check if we have a quote that could be used
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pQuotePtr: NPCQuoteInfo;
  let ubLoop: UINT8;

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return false;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (NPCConsiderQuote(ubNPC, 0, ubApproach, ubLoop, 0, pNPCQuoteInfoArray)) {
      if (pQuotePtr.usFactMustBeTrue == Enum170.FACT_NPC_HOSTILE_OR_PISSED_OFF) {
        continue;
      }
      return true;
    }
  }
  return false;
}

export function NPCWillingToAcceptItem(ubNPC: UINT8, ubMerc: UINT8, pObj: OBJECTTYPE): boolean {
  // Check if we have a quote that could be used, that applies to this item
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pQuotePtr: NPCQuoteInfo;
  let ubOpinion: UINT8;
  let ubQuoteNum: UINT8;

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return false;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  ubOpinion = NPCConsiderReceivingItemFromMerc(ubNPC, ubMerc, pObj, pNPCQuoteInfoArray, addressof(pQuotePtr), addressof(ubQuoteNum));

  if (pQuotePtr) {
    return true;
  }

  return false;
}

export function GetInfoForAbandoningEPC(ubNPC: UINT8, pusQuoteNum: Pointer<UINT16>, pusFactToSetTrue: Pointer<UINT16>): boolean {
  // Check if we have a quote that could be used
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pQuotePtr: NPCQuoteInfo;
  let ubLoop: UINT8;

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return false;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (NPCConsiderQuote(ubNPC, 0, Enum296.APPROACH_EPC_IN_WRONG_SECTOR, ubLoop, 0, pNPCQuoteInfoArray)) {
      pusQuoteNum.value = pNPCQuoteInfoArray[ubLoop].ubQuoteNum;
      pusFactToSetTrue.value = pNPCQuoteInfoArray[ubLoop].usSetFactTrue;
      return true;
    }
  }
  return false;
}

export function TriggerNPCWithGivenApproach(ubTriggerNPC: UINT8, ubApproach: UINT8, fShowPanel: boolean): boolean {
  // Check if we have a quote to trigger...
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pQuotePtr: NPCQuoteInfo;
  let fDisplayDialogue: boolean = true;
  let ubLoop: UINT8;

  if (EnsureQuoteFileLoaded(ubTriggerNPC) == false) {
    // error!!!
    return false;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubTriggerNPC];

  for (ubLoop = 0; ubLoop < NUM_NPC_QUOTE_RECORDS; ubLoop++) {
    pQuotePtr = pNPCQuoteInfoArray[ubLoop];
    if (NPCConsiderQuote(ubTriggerNPC, 0, ubApproach, ubLoop, 0, pNPCQuoteInfoArray)) {
      if (pQuotePtr.ubQuoteNum == IRRELEVANT) {
        fShowPanel = false;
      } else {
        fShowPanel = true;
      }

      // trigger this quote!
      // reset approach required value so that we can trigger it
      // pQuotePtr->ubApproachRequired = TRIGGER_NPC;
      NPCTriggerNPC(ubTriggerNPC, ubLoop, ubApproach, fShowPanel);
      return true;
    }
  }
  return false;
}

export function SaveNPCInfoToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let cnt: UINT32;
  let ubOne: UINT8 = 1;
  let ubZero: UINT8 = 0;
  let buffer: Buffer;

  // Loop through all the NPC quotes
  for (cnt = 0; cnt < NUM_PROFILES; cnt++) {
    // if there is a npc qutoe
    if (gpNPCQuoteInfoArray[cnt]) {
      // save a byte specify that there is an npc quote saved
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubOne, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }

      // Save the NPC quote entry
      buffer = Buffer.allocUnsafe(NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      writeObjectArray(gpNPCQuoteInfoArray[cnt], buffer, 0, writeNPCQuoteInfo);
      uiNumBytesWritten = FileWrite(hFile, buffer, NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      if (uiNumBytesWritten != NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS) {
        return false;
      }
    } else {
      // save a byte specify that there is an npc quote saved
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubZero, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }
    }
  }

  for (cnt = 0; cnt < NUM_CIVQUOTE_SECTORS; cnt++) {
    // if there is a civ quote
    if (gpCivQuoteInfoArray[cnt]) {
      // save a byte specify that there is an npc quote saved
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubOne, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }

      // Save the NPC quote entry
      buffer = Buffer.allocUnsafe(NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      writeObjectArray(gpCivQuoteInfoArray[cnt], buffer, 0, writeNPCQuoteInfo);
      uiNumBytesWritten = FileWrite(hFile, buffer, (NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS));
      if (uiNumBytesWritten != (NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS)) {
        return false;
      }
    } else {
      // save a byte specify that there is an npc quote saved
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubZero, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }
    }
  }

  return true;
}

export function LoadNPCInfoFromSavedGameFile(hFile: HWFILE, uiSaveGameVersion: UINT32): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let cnt: UINT32;
  let ubLoadQuote: UINT8 = 0;
  let uiNumberToLoad: UINT32 = 0;
  let buffer: Buffer;

  // If we are trying to restore a saved game prior to version 44, use the
  // MAX_NUM_SOLDIERS, else use NUM_PROFILES.  Dave used the wrong define!
  if (uiSaveGameVersion >= 44)
    uiNumberToLoad = NUM_PROFILES;
  else
    uiNumberToLoad = MAX_NUM_SOLDIERS;

  // Loop through all the NPC quotes
  for (cnt = 0; cnt < uiNumberToLoad; cnt++) {
    // Load a byte specify that there is an npc quote Loadd
    buffer = Buffer.allocUnsafe(1);
    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) {
      return false;
    }

    ubLoadQuote = buffer.readUInt8(0);

    // if there is an existing quote
    if (gpNPCQuoteInfoArray[cnt]) {
      // delete it
      gpNPCQuoteInfoArray[cnt] = <NPCQuoteInfo[]><unknown>null;
    }

    // if there is a npc quote
    if (ubLoadQuote) {
      // if there is no memory allocated
      if (gpNPCQuoteInfoArray[cnt] == null) {
        // allocate memory for the quote
        gpNPCQuoteInfoArray[cnt] = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createNPCQuoteInfo);
      }

      // Load the NPC quote entry
      buffer = Buffer.allocUnsafe(NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      uiNumBytesRead = FileRead(hFile, buffer, NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      if (uiNumBytesRead != NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS) {
        return false;
      }

      readObjectArray(gpNPCQuoteInfoArray[cnt], buffer, 0, readNPCQuoteInfo);
    } else {
    }
  }

  if (uiSaveGameVersion >= 56) {
    for (cnt = 0; cnt < NUM_CIVQUOTE_SECTORS; cnt++) {
      buffer = Buffer.allocUnsafe(1);
      uiNumBytesRead = FileRead(hFile, buffer, 1);
      if (uiNumBytesRead != 1) {
        return false;
      }
      ubLoadQuote = buffer.readUInt8(0);

      // if there is an existing quote
      if (gpCivQuoteInfoArray[cnt]) {
        // delete it
        gpCivQuoteInfoArray[cnt] = <NPCQuoteInfo[]><unknown>null;
      }

      // if there is a civ quote file
      if (ubLoadQuote) {
        // if there is no memory allocated
        if (gpCivQuoteInfoArray[cnt] == null) {
          // allocate memory for the quote
          gpCivQuoteInfoArray[cnt] = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createNPCQuoteInfo);
        }

        // Load the civ quote entry
        buffer = Buffer.allocUnsafe(NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
        uiNumBytesRead = FileRead(hFile, buffer, NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
        if (uiNumBytesRead != NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS) {
          return false;
        }
        readObjectArray(gpCivQuoteInfoArray[cnt], buffer, 0, readNPCQuoteInfo);
      }
    }
  }

  if (uiSaveGameVersion < 88) {
    RefreshNPCScriptRecord(NO_PROFILE, 5); // special pass-in value for "replace PC scripts"
    RefreshNPCScriptRecord(Enum268.DARYL, 11);
    RefreshNPCScriptRecord(Enum268.DARYL, 14);
    RefreshNPCScriptRecord(Enum268.DARYL, 15);
  }
  if (uiSaveGameVersion < 89) {
    RefreshNPCScriptRecord(Enum268.KINGPIN, 23);
    RefreshNPCScriptRecord(Enum268.KINGPIN, 27);
  }
  if (uiSaveGameVersion < 90) {
    RefreshNPCScriptRecord(Enum268.KINGPIN, 25);
    RefreshNPCScriptRecord(Enum268.KINGPIN, 26);
  }
  if (uiSaveGameVersion < 92) {
    RefreshNPCScriptRecord(Enum268.MATT, 14);
    RefreshNPCScriptRecord(Enum268.AUNTIE, 8);
  }
  if (uiSaveGameVersion < 93) {
    RefreshNPCScriptRecord(Enum268.JENNY, 7);
    RefreshNPCScriptRecord(Enum268.JENNY, 8);
    RefreshNPCScriptRecord(Enum268.FRANK, 7);
    RefreshNPCScriptRecord(Enum268.FRANK, 8);
    RefreshNPCScriptRecord(Enum268.FATHER, 12);
    RefreshNPCScriptRecord(Enum268.FATHER, 13);
  }
  if (uiSaveGameVersion < 94) {
    RefreshNPCScriptRecord(Enum268.CONRAD, 0);
    RefreshNPCScriptRecord(Enum268.CONRAD, 2);
    RefreshNPCScriptRecord(Enum268.CONRAD, 9);
  }
  if (uiSaveGameVersion < 95) {
    RefreshNPCScriptRecord(Enum268.WALDO, 6);
    RefreshNPCScriptRecord(Enum268.WALDO, 7);
    RefreshNPCScriptRecord(Enum268.WALDO, 10);
    RefreshNPCScriptRecord(Enum268.WALDO, 11);
    RefreshNPCScriptRecord(Enum268.WALDO, 12);
  }
  if (uiSaveGameVersion < 96) {
    RefreshNPCScriptRecord(Enum268.HANS, 18);
    RefreshNPCScriptRecord(Enum268.ARMAND, 13);
    RefreshNPCScriptRecord(Enum268.DARREN, 4);
    RefreshNPCScriptRecord(Enum268.DARREN, 5);
  }
  if (uiSaveGameVersion < 97) {
    RefreshNPCScriptRecord(Enum268.JOHN, 22);
    RefreshNPCScriptRecord(Enum268.JOHN, 23);
    RefreshNPCScriptRecord(Enum268.SKYRIDER, 19);
    RefreshNPCScriptRecord(Enum268.SKYRIDER, 21);
    RefreshNPCScriptRecord(Enum268.SKYRIDER, 22);
  }

  if (uiSaveGameVersion < 98) {
    RefreshNPCScriptRecord(Enum268.SKYRIDER, 19);
    RefreshNPCScriptRecord(Enum268.SKYRIDER, 21);
    RefreshNPCScriptRecord(Enum268.SKYRIDER, 22);
  }

  return true;
}

export function SaveBackupNPCInfoToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let cnt: UINT32;
  let ubOne: UINT8 = 1;
  let ubZero: UINT8 = 0;
  let buffer: Buffer;

  // Loop through all the NPC quotes
  for (cnt = 0; cnt < NUM_PROFILES; cnt++) {
    // if there is a npc qutoe
    if (gpBackupNPCQuoteInfoArray[cnt]) {
      // save a byte specify that there is an npc quote saved
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubOne, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }

      // Save the NPC quote entry
      buffer = Buffer.allocUnsafe(NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      writeObjectArray(gpBackupNPCQuoteInfoArray[cnt], buffer, 0, writeNPCQuoteInfo);
      uiNumBytesWritten = FileWrite(hFile, buffer, NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      if (uiNumBytesWritten != NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS) {
        return false;
      }
    } else {
      // save a byte specify that there is an npc quote saved
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubZero, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }
    }
  }

  return true;
}

export function LoadBackupNPCInfoFromSavedGameFile(hFile: HWFILE, uiSaveGameVersion: UINT32): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let cnt: UINT32;
  let ubLoadQuote: UINT8 = 0;
  let uiNumberOfProfilesToLoad: UINT32 = 0;
  let buffer: Buffer;

  uiNumberOfProfilesToLoad = NUM_PROFILES;

  // Loop through all the NPC quotes
  for (cnt = 0; cnt < uiNumberOfProfilesToLoad; cnt++) {
    // Load a byte specify that there is an npc quote Loadd
    buffer = Buffer.allocUnsafe(1);
    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) {
      return false;
    }
    ubLoadQuote = buffer.readUInt8(0);

    // if there is an existing quote
    if (gpBackupNPCQuoteInfoArray[cnt]) {
      // delete it
      gpBackupNPCQuoteInfoArray[cnt] = <NPCQuoteInfo[]><unknown>null;
    }

    // if there is a npc quote
    if (ubLoadQuote) {
      // if there is no memory allocated
      if (gpBackupNPCQuoteInfoArray[cnt] == null) {
        // allocate memory for the quote
        gpBackupNPCQuoteInfoArray[cnt] = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createNPCQuoteInfo);
      }

      // Load the NPC quote entry
      buffer = Buffer.allocUnsafe(NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      uiNumBytesRead = FileRead(hFile, buffer, NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS);
      if (uiNumBytesRead != NPC_QUOTE_INFO_SIZE * NUM_NPC_QUOTE_RECORDS) {
        return false;
      }
      readObjectArray(gpBackupNPCQuoteInfoArray[cnt], buffer, 0, readNPCQuoteInfo);
    } else {
    }
  }

  return true;
}

export function TriggerFriendWithHostileQuote(ubNPC: UINT8): void {
  let ubMercsAvailable: UINT8[] /* [40] */ = createArray(40, 0);
  let ubNumMercsAvailable: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let pSoldier: SOLDIERTYPE | null;
  let cnt: INT32;
  let bTeam: INT8;

  // First get pointer to NPC
  pSoldier = FindSoldierByProfileID(ubNPC, false);
  if (!pSoldier) {
    return;
  }
  bTeam = pSoldier.bTeam;

  // Loop through all our guys and find one to yell

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[bTeam].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[bTeam].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // Add guy if he's a candidate...
    if (pTeamSoldier.bActive && pSoldier.bInSector && pTeamSoldier.bLife >= OKLIFE && pTeamSoldier.bBreath >= OKBREATH && pTeamSoldier.bOppCnt > 0 && pTeamSoldier.ubProfile != NO_PROFILE) {
      if (bTeam == CIV_TEAM && pSoldier.ubCivilianGroup != Enum246.NON_CIV_GROUP && pTeamSoldier.ubCivilianGroup != pSoldier.ubCivilianGroup) {
        continue;
      }

      if (!(gMercProfiles[pTeamSoldier.ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_SAID_HOSTILE_QUOTE)) {
        ubMercsAvailable[ubNumMercsAvailable] = pTeamSoldier.ubProfile;
        ubNumMercsAvailable++;
      }
    }
  }

  if (bTeam == CIV_TEAM && pSoldier.ubCivilianGroup != Enum246.NON_CIV_GROUP && gTacticalStatus.fCivGroupHostile[pSoldier.ubCivilianGroup] == CIV_GROUP_NEUTRAL) {
    CivilianGroupMemberChangesSides(pSoldier);
  }

  if (ubNumMercsAvailable > 0) {
    PauseAITemporarily();
    ubChosenMerc = Random(ubNumMercsAvailable);
    TriggerNPCWithIHateYouQuote(ubMercsAvailable[ubChosenMerc]);
  } else {
    // done... we should enter combat mode with this soldier's team starting,
    // after all the dialogue is completed
    NPCDoAction(ubNPC, Enum213.NPC_ACTION_ENTER_COMBAT, 0);
  }
}

export function ActionIDForMovementRecord(ubNPC: UINT8, ubRecord: UINT8): UINT8 {
  // Check if we have a quote to trigger...
  let pNPCQuoteInfoArray: NPCQuoteInfo[];
  let pQuotePtr: NPCQuoteInfo;
  let fDisplayDialogue: boolean = true;

  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return 0;
  }

  pNPCQuoteInfoArray = gpNPCQuoteInfoArray[ubNPC];

  pQuotePtr = pNPCQuoteInfoArray[ubRecord];

  switch (pQuotePtr.sActionData) {
    case Enum213.NPC_ACTION_TRAVERSE_MAP_EAST:
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST;

    case Enum213.NPC_ACTION_TRAVERSE_MAP_SOUTH:
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_SOUTH;

    case Enum213.NPC_ACTION_TRAVERSE_MAP_WEST:
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_WEST;

    case Enum213.NPC_ACTION_TRAVERSE_MAP_NORTH:
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH;

    default:
      return Enum290.QUOTE_ACTION_ID_CHECKFORDEST;
  }
}

export function HandleNPCChangesForTacticalTraversal(pSoldier: SOLDIERTYPE): void {
  if (!pSoldier || pSoldier.ubProfile == NO_PROFILE || (pSoldier.fAIFlags & AI_CHECK_SCHEDULE)) {
    return;
  }

  switch (pSoldier.ubQuoteActionID) {
    case Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST:
      gMercProfiles[pSoldier.ubProfile].sSectorX++;

      // Call to change the NPC's Sector Location
      ChangeNpcToDifferentSector(pSoldier.ubProfile, gMercProfiles[pSoldier.ubProfile].sSectorX, gMercProfiles[pSoldier.ubProfile].sSectorY, gMercProfiles[pSoldier.ubProfile].bSectorZ);
      break;
    case Enum290.QUOTE_ACTION_ID_TRAVERSE_SOUTH:
      gMercProfiles[pSoldier.ubProfile].sSectorY++;

      // Call to change the NPC's Sector Location
      ChangeNpcToDifferentSector(pSoldier.ubProfile, gMercProfiles[pSoldier.ubProfile].sSectorX, gMercProfiles[pSoldier.ubProfile].sSectorY, gMercProfiles[pSoldier.ubProfile].bSectorZ);
      break;
    case Enum290.QUOTE_ACTION_ID_TRAVERSE_WEST:
      gMercProfiles[pSoldier.ubProfile].sSectorX--;

      // Call to change the NPC's Sector Location
      ChangeNpcToDifferentSector(pSoldier.ubProfile, gMercProfiles[pSoldier.ubProfile].sSectorX, gMercProfiles[pSoldier.ubProfile].sSectorY, gMercProfiles[pSoldier.ubProfile].bSectorZ);
      break;
    case Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH:
      gMercProfiles[pSoldier.ubProfile].sSectorY--;

      // Call to change the NPC's Sector Location
      ChangeNpcToDifferentSector(pSoldier.ubProfile, gMercProfiles[pSoldier.ubProfile].sSectorX, gMercProfiles[pSoldier.ubProfile].sSectorY, gMercProfiles[pSoldier.ubProfile].bSectorZ);
      break;
    default:
      break;
  }
}

export function HandleVictoryInNPCSector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): void {
  // handle special cases of victory in certain sector
  let sSector: INT16 = 0;

  // not the surface?..leave
  if (sSectorZ != 0) {
    return;
  }

  // grab sector value
  sSector = SECTOR(sSectorX, sSectorY);

  switch (sSector) {
    case (Enum123.SEC_F10): {
      // we won over the hillbillies
      // set fact they are dead
      if (CheckFact(Enum170.FACT_HILLBILLIES_KILLED, Enum268.KEITH) == false) {
        SetFactTrue(Enum170.FACT_HILLBILLIES_KILLED);
      }

      // check if keith is out of business
      if (CheckFact(Enum170.FACT_KEITH_OUT_OF_BUSINESS, Enum268.KEITH) == true) {
        SetFactFalse(Enum170.FACT_KEITH_OUT_OF_BUSINESS);
      }
    }
  }

  return;
}

export function HandleShopKeepHasBeenShutDown(ubCharNum: UINT8): boolean {
  // check if shopkeep has been shutdown, if so handle
  switch (ubCharNum) {
    case (Enum268.KEITH): {
      // if keith out of business, do action and leave
      if (CheckFact(Enum170.FACT_KEITH_OUT_OF_BUSINESS, Enum268.KEITH) == true) {
        TriggerNPCRecord(Enum268.KEITH, 11);

        return true;
      } else if (CheckFact(Enum170.FACT_LOYALTY_LOW, Enum268.KEITH) == true) {
        // loyalty is too low
        TriggerNPCRecord(Enum268.KEITH, 7);

        return true;
      }
    }
  }

  return false;
}

export function UpdateDarrelScriptToGoTo(pSoldier: SOLDIERTYPE): void {
  // change destination in Darrel record 10 to go to a gridno adjacent to the
  // soldier's gridno, and destination in record 11
  let sAdjustedGridNo: INT16;
  let ubDummyDirection: UINT8;
  let pDarrel: SOLDIERTYPE | null;

  pDarrel = FindSoldierByProfileID(Enum268.DARREL, false);
  if (!pDarrel) {
    return;
  }

  // find a spot to an alternate location nearby
  sAdjustedGridNo = FindGridNoFromSweetSpotExcludingSweetSpot(pDarrel, pSoldier.sGridNo, 5, addressof(ubDummyDirection));
  if (sAdjustedGridNo == NOWHERE) {
    // yikes! try again with a bigger radius!
    sAdjustedGridNo = FindGridNoFromSweetSpotExcludingSweetSpot(pDarrel, pSoldier.sGridNo, 10, addressof(ubDummyDirection));
    if (sAdjustedGridNo == NOWHERE) {
      // ok, now we're completely foobar
      return;
    }
  }

  EnsureQuoteFileLoaded(Enum268.DARREL);
  gpNPCQuoteInfoArray[Enum268.DARREL][10].usGoToGridno = sAdjustedGridNo;
  gpNPCQuoteInfoArray[Enum268.DARREL][11].sRequiredGridno = -(sAdjustedGridNo);
  gpNPCQuoteInfoArray[Enum268.DARREL][11].ubTriggerNPC = pSoldier.ubProfile;
}

export function RecordHasDialogue(ubNPC: UINT8, ubRecord: UINT8): boolean {
  if (EnsureQuoteFileLoaded(ubNPC) == false) {
    // error!!!
    return false;
  }

  if (gpNPCQuoteInfoArray[ubNPC][ubRecord].ubQuoteNum != NO_QUOTE && gpNPCQuoteInfoArray[ubNPC][ubRecord].ubQuoteNum != 0) {
    return true;
  } else {
    return false;
  }
}

function FindCivQuoteFileIndex(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): INT8 {
  let ubLoop: UINT8;

  if (sSectorZ > 0) {
    return MINERS_CIV_QUOTE_INDEX;
  } else {
    for (ubLoop = 0; ubLoop < NUM_CIVQUOTE_SECTORS; ubLoop++) {
      if (gsCivQuoteSector[ubLoop][0] == sSectorX && gsCivQuoteSector[ubLoop][1] == sSectorY) {
        return ubLoop;
      }
    }
  }
  return -1;
}

export function ConsiderCivilianQuotes(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16, fSetAsUsed: boolean): INT8 {
  let bLoop: INT8;
  let bCivQuoteSectorIndex: INT8;
  let pCivQuoteInfoArray: NPCQuoteInfo[];

  bCivQuoteSectorIndex = FindCivQuoteFileIndex(sSectorX, sSectorY, sSectorZ);
  if (bCivQuoteSectorIndex == -1) {
    // no hints for this sector!
    return -1;
  }

  if (EnsureCivQuoteFileLoaded(bCivQuoteSectorIndex) == false) {
    // error!!!
    return -1;
  }

  pCivQuoteInfoArray = gpCivQuoteInfoArray[bCivQuoteSectorIndex];

  for (bLoop = 0; bLoop < NUM_NPC_QUOTE_RECORDS; bLoop++) {
    if (NPCConsiderQuote(NO_PROFILE, NO_PROFILE, 0, bLoop, 0, pCivQuoteInfoArray)) {
      if (fSetAsUsed) {
        pCivQuoteInfoArray[bLoop].fFlags = TURN_FLAG_ON(pCivQuoteInfoArray[bLoop].fFlags, QUOTE_FLAG_SAID);
      }

      if (pCivQuoteInfoArray[bLoop].ubStartQuest != NO_QUEST) {
        StartQuest(pCivQuoteInfoArray[bLoop].ubStartQuest, gWorldSectorX, gWorldSectorY);
      }

      // return quote #
      return pCivQuoteInfoArray[bLoop].ubQuoteNum;
    }
  }

  return -1;
}

}
