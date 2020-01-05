namespace ja2 {

const DIALOGUE_DEFAULT_WIDTH = 200;
const EXTREAMLY_LOW_TOWN_LOYALTY = 20;
const HIGH_TOWN_LOYALTY = 80;
const CIV_QUOTE_HINT = 99;

interface CIV_QUOTE {
  ubNumEntries: UINT8;
  ubUnusedCurrentEntry: UINT8;
}

function createCivQuote(): CIV_QUOTE {
  return {
    ubNumEntries: 0,
    ubUnusedCurrentEntry: 0,
  };
}

function resetCivQuote(o: CIV_QUOTE) {
  o.ubNumEntries = 0;
  o.ubUnusedCurrentEntry = 0;
}

const CIV_QUOTE_SIZE = 2;

function readCivQuote(o: CIV_QUOTE, buffer: Buffer, offset: number = 0): number {
  o.ubNumEntries = buffer.readUInt8(offset++);
  o.ubUnusedCurrentEntry = buffer.readUInt8(offset++);
  return offset;
}

function writeCivQuote(o: CIV_QUOTE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubNumEntries, offset);
  offset = buffer.writeUInt8(o.ubUnusedCurrentEntry, offset);
  return offset;
}

export let gfSurrendered: boolean = false;

let gCivQuotes: CIV_QUOTE[] /* [NUM_CIV_QUOTES] */ = createArrayFrom(Enum201.NUM_CIV_QUOTES, createCivQuote);

let gubNumEntries: UINT8[] /* [NUM_CIV_QUOTES] */ = [
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,

  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,

  5,
  5,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,

  15,
  15,
  2,
  15,
  15,
  10,
  10,
  5,
  3,
  10,

  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
];

interface QUOTE_SYSTEM_STRUCT {
  bActive: boolean;
  MouseRegion: MOUSE_REGION;
  iVideoOverlay: INT32;
  iDialogueBox: INT32;
  uiTimeOfCreation: UINT32;
  uiDelayTime: UINT32;
  pCiv: SOLDIERTYPE | null;
}

function createQuoteSystemStruct(): QUOTE_SYSTEM_STRUCT {
  return {
    bActive: false,
    MouseRegion: createMouseRegion(),
    iVideoOverlay: 0,
    iDialogueBox: 0,
    uiTimeOfCreation: 0,
    uiDelayTime: 0,
    pCiv: null,
  };
}

function resetQuoteSystemStruct(o: QUOTE_SYSTEM_STRUCT) {
  o.bActive = false;
  resetMouseRegion(o.MouseRegion);
  o.iVideoOverlay = 0;
  o.iDialogueBox = 0;
  o.uiTimeOfCreation = 0;
  o.uiDelayTime = 0;
  o.pCiv = null;
}

let gCivQuoteData: QUOTE_SYSTEM_STRUCT = createQuoteSystemStruct();

let gzCivQuote: string /* INT16[320] */;
let gusCivQuoteBoxWidth: UINT16;
let gusCivQuoteBoxWidth__Pointer = createPointer(() => gusCivQuoteBoxWidth, (v) => gusCivQuoteBoxWidth = v);
let gusCivQuoteBoxHeight: UINT16;
let gusCivQuoteBoxHeight__Pointer = createPointer(() => gusCivQuoteBoxHeight, (v) => gusCivQuoteBoxHeight = v);

function CopyNumEntriesIntoQuoteStruct(): void {
  let cnt: INT32;

  for (cnt = 0; cnt < Enum201.NUM_CIV_QUOTES; cnt++) {
    gCivQuotes[cnt].ubNumEntries = gubNumEntries[cnt];
  }
}

function GetCivQuoteText(ubCivQuoteID: UINT8, ubEntryID: UINT8): string {
  let zQuote: string;

  let zFileName: string /* UINT8[164] */;

  // Build filename....
  if (ubCivQuoteID == CIV_QUOTE_HINT) {
    if (gbWorldSectorZ > 0) {
      // sprintf( zFileName, "NPCData\\miners.edt" );
      zFileName = sprintf("NPCDATA\\CIV%s.edt", (Enum201.CIV_QUOTE_MINERS_NOT_FOR_PLAYER).toString().padStart(2, '0'));
    } else {
      zFileName = sprintf("NPCData\\%s%d.edt", String.fromCharCode('A'.charCodeAt(0) + (gWorldSectorY - 1)), gWorldSectorX);
    }
  } else {
    zFileName = sprintf("NPCDATA\\CIV%s.edt", ubCivQuoteID.toString().padStart(2, '0'));
  }

  if (!FileExists(zFileName)) {
    return <string><unknown>undefined;
  }

  // Get data...
  zQuote = LoadEncryptedDataFromFile(zFileName, ubEntryID * 320, 320);

  if (zQuote == '') {
    return <string><unknown>undefined;
  }

  return zQuote;
}

function SurrenderMessageBoxCallBack(ubExitValue: UINT8): void {
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32 = 0;

  if (ubExitValue == MSG_BOX_RETURN_YES) {
    // CJC Dec 1 2002: fix multiple captures
    BeginCaptureSquence();

    // Do capture....
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
      // Are we active and in sector.....
      if (pTeamSoldier.bActive && pTeamSoldier.bInSector) {
        if (pTeamSoldier.bLife != 0) {
          EnemyCapturesPlayerSoldier(pTeamSoldier);

          RemoveSoldierFromTacticalSector(pTeamSoldier, true);
        }
      }
    }

    EndCaptureSequence();

    gfSurrendered = true;
    SetCustomizableTimerCallbackAndDelay(3000, CaptureTimerCallback, false);

    ActionDone(<SOLDIERTYPE>gCivQuoteData.pCiv);
  } else {
    ActionDone(<SOLDIERTYPE>gCivQuoteData.pCiv);
  }
}

function ShutDownQuoteBox(fForce: boolean): void {
  if (!gCivQuoteData.bActive) {
    return;
  }

  // Check for min time....
  if ((GetJA2Clock() - gCivQuoteData.uiTimeOfCreation) > 300 || fForce) {
    RemoveVideoOverlay(gCivQuoteData.iVideoOverlay);

    // Remove mouse region...
    MSYS_RemoveRegion(gCivQuoteData.MouseRegion);

    RemoveMercPopupBoxFromIndex(gCivQuoteData.iDialogueBox);
    gCivQuoteData.iDialogueBox = -1;

    gCivQuoteData.bActive = false;

    // do we need to do anything at the end of the civ quote?
    if (gCivQuoteData.pCiv && gCivQuoteData.pCiv.bAction == Enum289.AI_ACTION_OFFER_SURRENDER) {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, Message[Enum334.STR_SURRENDER], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, SurrenderMessageBoxCallBack, null);
    }
  }
}

export function ShutDownQuoteBoxIfActive(): boolean {
  if (gCivQuoteData.bActive) {
    ShutDownQuoteBox(true);

    return true;
  }

  return false;
}

export function GetCivType(pCiv: SOLDIERTYPE): INT8 {
  if (pCiv.ubProfile != NO_PROFILE) {
    return CIV_TYPE_NA;
  }

  // ATE: Check if this person is married.....
  // 1 ) check sector....
  if (gWorldSectorX == 10 && gWorldSectorY == 6 && gbWorldSectorZ == 0) {
    // 2 ) the only female....
    if (pCiv.ubCivilianGroup == 0 && pCiv.bTeam != gbPlayerNum && pCiv.ubBodyType == Enum194.REGFEMALE) {
      // She's a ho!
      return CIV_TYPE_MARRIED_PC;
    }
  }

  // OK, look for enemy type - MUST be on enemy team, merc bodytype
  if (pCiv.bTeam == ENEMY_TEAM && IS_MERC_BODY_TYPE(pCiv)) {
    return CIV_TYPE_ENEMY;
  }

  if (pCiv.bTeam != CIV_TEAM && pCiv.bTeam != MILITIA_TEAM) {
    return CIV_TYPE_NA;
  }

  switch (pCiv.ubBodyType) {
    case Enum194.REGMALE:
    case Enum194.BIGMALE:
    case Enum194.STOCKYMALE:
    case Enum194.REGFEMALE:
    case Enum194.FATCIV:
    case Enum194.MANCIV:
    case Enum194.MINICIV:
    case Enum194.DRESSCIV:
    case Enum194.CRIPPLECIV:

      return CIV_TYPE_ADULT;
      break;

    case Enum194.ADULTFEMALEMONSTER:
    case Enum194.AM_MONSTER:
    case Enum194.YAF_MONSTER:
    case Enum194.YAM_MONSTER:
    case Enum194.LARVAE_MONSTER:
    case Enum194.INFANT_MONSTER:
    case Enum194.QUEENMONSTER:

      return CIV_TYPE_NA;

    case Enum194.HATKIDCIV:
    case Enum194.KIDCIV:

      return CIV_TYPE_KID;

    default:

      return CIV_TYPE_NA;
  }

  return CIV_TYPE_NA;
}

function RenderCivQuoteBoxOverlay(pBlitter: VIDEO_OVERLAY): void {
  if (gCivQuoteData.iVideoOverlay != -1) {
    RenderMercPopUpBoxFromIndex(gCivQuoteData.iDialogueBox, pBlitter.sX, pBlitter.sY, pBlitter.uiDestBuff);

    InvalidateRegion(pBlitter.sX, pBlitter.sY, pBlitter.sX + gusCivQuoteBoxWidth, pBlitter.sY + gusCivQuoteBoxHeight);
  }
}

function QuoteOverlayClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  /* static */ let fLButtonDown: boolean = false;

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fLButtonDown = true;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP && fLButtonDown) {
    // Shutdown quote box....
    ShutDownQuoteBox(false);
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = false;
  }
}

export function BeginCivQuote(pCiv: SOLDIERTYPE, ubCivQuoteID: UINT8, ubEntryID: UINT8, sX: INT16, sY: INT16): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();
  let zQuote: string /* INT16[320] */;

  // OK, do we have another on?
  if (gCivQuoteData.bActive) {
    // Delete?
    ShutDownQuoteBox(true);
  }

  // get text
  if ((zQuote = GetCivQuoteText(ubCivQuoteID, ubEntryID)) === undefined) {
    return;
  }

  gzCivQuote = swprintf("\"%s\"", zQuote);

  if (ubCivQuoteID == CIV_QUOTE_HINT) {
    MapScreenMessage(FONT_MCOLOR_WHITE, MSG_DIALOG, "%s", gzCivQuote);
  }

  // Prepare text box
  SET_USE_WINFONTS(true);
  SET_WINFONT(giSubTitleWinFont);
  gCivQuoteData.iDialogueBox = PrepareMercPopupBox(gCivQuoteData.iDialogueBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, gzCivQuote, DIALOGUE_DEFAULT_WIDTH, 0, 0, 0, gusCivQuoteBoxWidth__Pointer, gusCivQuoteBoxHeight__Pointer);
  SET_USE_WINFONTS(false);

  // OK, find center for box......
  sX = sX - Math.trunc(gusCivQuoteBoxWidth / 2);
  sY = sY - Math.trunc(gusCivQuoteBoxHeight / 2);

  // OK, limit to screen......
  {
    if (sX < 0) {
      sX = 0;
    }

    // CHECK FOR LEFT/RIGHT
    if ((sX + gusCivQuoteBoxWidth) > 640) {
      sX = 640 - gusCivQuoteBoxWidth;
    }

    // Now check for top
    if (sY < gsVIEWPORT_WINDOW_START_Y) {
      sY = gsVIEWPORT_WINDOW_START_Y;
    }

    // Check for bottom
    if ((sY + gusCivQuoteBoxHeight) > 340) {
      sY = 340 - gusCivQuoteBoxHeight;
    }
  }

  VideoOverlayDesc.sLeft = sX;
  VideoOverlayDesc.sTop = sY;
  VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + gusCivQuoteBoxWidth;
  VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + gusCivQuoteBoxHeight;
  VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
  VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
  VideoOverlayDesc.BltCallback = RenderCivQuoteBoxOverlay;

  gCivQuoteData.iVideoOverlay = RegisterVideoOverlay(0, VideoOverlayDesc);

  // Define main region
  MSYS_DefineRegion(gCivQuoteData.MouseRegion, VideoOverlayDesc.sLeft, VideoOverlayDesc.sTop, VideoOverlayDesc.sRight, VideoOverlayDesc.sBottom, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, QuoteOverlayClickCallback);
  // Add region
  MSYS_AddRegion(gCivQuoteData.MouseRegion);

  gCivQuoteData.bActive = true;

  gCivQuoteData.uiTimeOfCreation = GetJA2Clock();

  gCivQuoteData.uiDelayTime = FindDelayForString(gzCivQuote) + 500;

  gCivQuoteData.pCiv = pCiv;
}

function DetermineCivQuoteEntry(pCiv: SOLDIERTYPE, pubCivHintToUse: Pointer<UINT8>, fCanUseHints: boolean): UINT8 {
  let ubCivType: UINT8;
  let bTownId: INT8;
  let bCivLowLoyalty: boolean = false;
  let bCivHighLoyalty: boolean = false;
  let bCivHint: INT8;
  let bMineId: INT8;
  let bMiners: boolean = false;

  (pubCivHintToUse.value) = 0;

  ubCivType = GetCivType(pCiv);

  if (ubCivType == CIV_TYPE_ENEMY) {
    // Determine what type of quote to say...
    // Are are we going to attack?

    if (pCiv.bAction == Enum289.AI_ACTION_TOSS_PROJECTILE || pCiv.bAction == Enum289.AI_ACTION_FIRE_GUN || pCiv.bAction == Enum289.AI_ACTION_FIRE_GUN || pCiv.bAction == Enum289.AI_ACTION_KNIFE_MOVE) {
      return Enum201.CIV_QUOTE_ENEMY_THREAT;
    } else if (pCiv.bAction == Enum289.AI_ACTION_OFFER_SURRENDER) {
      return Enum201.CIV_QUOTE_ENEMY_OFFER_SURRENDER;
    }
    // Hurt?
    else if (pCiv.bLife < 30) {
      return Enum201.CIV_QUOTE_ENEMY_HURT;
    }
    // elite?
    else if (pCiv.ubSoldierClass == Enum262.SOLDIER_CLASS_ELITE) {
      return Enum201.CIV_QUOTE_ENEMY_ELITE;
    } else {
      return Enum201.CIV_QUOTE_ENEMY_ADMIN;
    }
  }

  // Are we in a town sector?
  // get town id
  bTownId = GetTownIdForSector(gWorldSectorX, gWorldSectorY);

  // If a married PC...
  if (ubCivType == CIV_TYPE_MARRIED_PC) {
    return Enum201.CIV_QUOTE_PC_MARRIED;
  }

  // CIV GROUPS FIRST!
  // Hicks.....
  if (pCiv.ubCivilianGroup == Enum246.HICKS_CIV_GROUP) {
    // Are they friendly?
    // if ( gTacticalStatus.fCivGroupHostile[ HICKS_CIV_GROUP ] < CIV_GROUP_WILL_BECOME_HOSTILE )
    if (pCiv.bNeutral) {
      return Enum201.CIV_QUOTE_HICKS_FRIENDLY;
    } else {
      return Enum201.CIV_QUOTE_HICKS_ENEMIES;
    }
  }

  // Goons.....
  if (pCiv.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) {
    // Are they friendly?
    // if ( gTacticalStatus.fCivGroupHostile[ KINGPIN_CIV_GROUP ] < CIV_GROUP_WILL_BECOME_HOSTILE )
    if (pCiv.bNeutral) {
      return Enum201.CIV_QUOTE_GOONS_FRIENDLY;
    } else {
      return Enum201.CIV_QUOTE_GOONS_ENEMIES;
    }
  }

  // ATE: Cowering people take precedence....
  if ((pCiv.uiStatusFlags & SOLDIER_COWERING) || (pCiv.bTeam == CIV_TEAM && (gTacticalStatus.uiFlags & INCOMBAT))) {
    if (ubCivType == CIV_TYPE_ADULT) {
      return Enum201.CIV_QUOTE_ADULTS_COWER;
    } else {
      return Enum201.CIV_QUOTE_KIDS_COWER;
    }
  }

  // Kid slaves...
  if (pCiv.ubCivilianGroup == Enum246.FACTORY_KIDS_GROUP) {
    // Check fact.....
    if (CheckFact(Enum170.FACT_DOREEN_HAD_CHANGE_OF_HEART, 0) || !CheckFact(Enum170.FACT_DOREEN_ALIVE, 0)) {
      return Enum201.CIV_QUOTE_KID_SLAVES_FREE;
    } else {
      return Enum201.CIV_QUOTE_KID_SLAVES;
    }
  }

  // BEGGERS
  if (pCiv.ubCivilianGroup == Enum246.BEGGARS_CIV_GROUP) {
    // Check if we are in a town...
    if (bTownId != Enum135.BLANK_SECTOR && gbWorldSectorZ == 0) {
      if (bTownId == Enum135.SAN_MONA && ubCivType == CIV_TYPE_ADULT) {
        return Enum201.CIV_QUOTE_SAN_MONA_BEGGERS;
      }
    }

    // DO normal beggers...
    if (ubCivType == CIV_TYPE_ADULT) {
      return Enum201.CIV_QUOTE_ADULTS_BEGGING;
    } else {
      return Enum201.CIV_QUOTE_KIDS_BEGGING;
    }
  }

  // REBELS
  if (pCiv.ubCivilianGroup == Enum246.REBEL_CIV_GROUP) {
    // DO normal beggers...
    if (ubCivType == CIV_TYPE_ADULT) {
      return Enum201.CIV_QUOTE_ADULTS_REBELS;
    } else {
      return Enum201.CIV_QUOTE_KIDS_REBELS;
    }
  }

  // Do miltitia...
  if (pCiv.bTeam == MILITIA_TEAM) {
    // Different types....
    if (pCiv.ubSoldierClass == Enum262.SOLDIER_CLASS_GREEN_MILITIA) {
      return Enum201.CIV_QUOTE_GREEN_MILITIA;
    }
    if (pCiv.ubSoldierClass == Enum262.SOLDIER_CLASS_REG_MILITIA) {
      return Enum201.CIV_QUOTE_MEDIUM_MILITIA;
    }
    if (pCiv.ubSoldierClass == Enum262.SOLDIER_CLASS_ELITE_MILITIA) {
      return Enum201.CIV_QUOTE_ELITE_MILITIA;
    }
  }

  // If we are in medunna, and queen is dead, use these...
  if (bTownId == Enum135.MEDUNA && CheckFact(Enum170.FACT_QUEEN_DEAD, 0)) {
    return Enum201.CIV_QUOTE_DEIDRANNA_DEAD;
  }

  // if in a town
  if ((bTownId != Enum135.BLANK_SECTOR) && (gbWorldSectorZ == 0) && gfTownUsesLoyalty[bTownId]) {
    // Check loyalty special quotes.....
    // EXTREMELY LOW TOWN LOYALTY...
    if (gTownLoyalty[bTownId].ubRating < EXTREAMLY_LOW_TOWN_LOYALTY) {
      bCivLowLoyalty = true;
    }

    // HIGH TOWN LOYALTY...
    if (gTownLoyalty[bTownId].ubRating >= HIGH_TOWN_LOYALTY) {
      bCivHighLoyalty = true;
    }
  }

  // ATE: OK, check if we should look for a civ hint....
  if (fCanUseHints) {
    bCivHint = ConsiderCivilianQuotes(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, false);
  } else {
    bCivHint = -1;
  }

  // ATE: check miners......
  if (pCiv.ubSoldierClass == Enum262.SOLDIER_CLASS_MINER) {
    bMiners = true;

    // If not a civ hint available...
    if (bCivHint == -1) {
      // Check if they are under our control...

      // Should I go talk to miner?
      // Not done yet.

      // Are they working for us?
      bMineId = GetIdOfMineForSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

      if (PlayerControlsMine(bMineId)) {
        return Enum201.CIV_QUOTE_MINERS_FOR_PLAYER;
      } else {
        return Enum201.CIV_QUOTE_MINERS_NOT_FOR_PLAYER;
      }
    }
  }

  // Is one availible?
  // If we are to say low loyalty, do chance
  if (bCivHint != -1 && bCivLowLoyalty && !bMiners) {
    if (Random(100) < 25) {
      // Get rid of hint...
      bCivHint = -1;
    }
  }

  // Say hint if availible...
  if (bCivHint != -1) {
    if (ubCivType == CIV_TYPE_ADULT) {
      (pubCivHintToUse.value) = bCivHint;

      // Set quote as used...
      ConsiderCivilianQuotes(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, true);

      // retrun value....
      return CIV_QUOTE_HINT;
    }
  }

  if (bCivLowLoyalty) {
    if (ubCivType == CIV_TYPE_ADULT) {
      return Enum201.CIV_QUOTE_ADULTS_EXTREMLY_LOW_LOYALTY;
    } else {
      return Enum201.CIV_QUOTE_KIDS_EXTREMLY_LOW_LOYALTY;
    }
  }

  if (bCivHighLoyalty) {
    if (ubCivType == CIV_TYPE_ADULT) {
      return Enum201.CIV_QUOTE_ADULTS_HIGH_LOYALTY;
    } else {
      return Enum201.CIV_QUOTE_KIDS_HIGH_LOYALTY;
    }
  }

  // All purpose quote here....
  if (ubCivType == CIV_TYPE_ADULT) {
    return Enum201.CIV_QUOTE_ADULTS_ALL_PURPOSE;
  } else {
    return Enum201.CIV_QUOTE_KIDS_ALL_PURPOSE;
  }
}

export function HandleCivQuote(): void {
  if (gCivQuoteData.bActive) {
    // Check for min time....
    if ((GetJA2Clock() - gCivQuoteData.uiTimeOfCreation) > gCivQuoteData.uiDelayTime) {
      // Stop!
      ShutDownQuoteBox(true);
    }
  }
}

export function StartCivQuote(pCiv: SOLDIERTYPE): void {
  let ubCivQuoteID: UINT8;
  let sX: INT16;
  let sY: INT16;
  let ubEntryID: UINT8 = 0;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let ubCivHintToUse: UINT8 = 0;
  let ubCivHintToUse__Pointer = createPointer(() => ubCivHintToUse, (v) => ubCivHintToUse = v);

  // ATE: Check for old quote.....
  // This could have been stored on last attempt...
  if (pCiv.bCurrentCivQuote == CIV_QUOTE_HINT) {
    // Determine which quote to say.....
    // CAN'T USE HINTS, since we just did one...
    pCiv.bCurrentCivQuote = -1;
    pCiv.bCurrentCivQuoteDelta = 0;
    ubCivQuoteID = DetermineCivQuoteEntry(pCiv, ubCivHintToUse__Pointer, false);
  } else {
    // Determine which quote to say.....
    ubCivQuoteID = DetermineCivQuoteEntry(pCiv, ubCivHintToUse__Pointer, true);
  }

  // Determine entry id
  // ATE: Try and get entry from soldier pointer....
  if (ubCivQuoteID != CIV_QUOTE_HINT) {
    if (pCiv.bCurrentCivQuote == -1) {
      // Pick random one
      pCiv.bCurrentCivQuote = Random(gCivQuotes[ubCivQuoteID].ubNumEntries - 2);
      pCiv.bCurrentCivQuoteDelta = 0;
    }

    ubEntryID = pCiv.bCurrentCivQuote + pCiv.bCurrentCivQuoteDelta;
  } else {
    ubEntryID = ubCivHintToUse;

    // ATE: set value for quote ID.....
    pCiv.bCurrentCivQuote = ubCivQuoteID;
    pCiv.bCurrentCivQuoteDelta = ubEntryID;
  }

  // Determine location...
  // Get location of civ on screen.....
  ({ sScreenX, sScreenY } = GetSoldierScreenPos(pCiv));
  sX = sScreenX;
  sY = sScreenY;

  // begin quote
  BeginCivQuote(pCiv, ubCivQuoteID, ubEntryID, sX, sY);

  // Increment use
  if (ubCivQuoteID != CIV_QUOTE_HINT) {
    pCiv.bCurrentCivQuoteDelta++;

    if (pCiv.bCurrentCivQuoteDelta == 2) {
      pCiv.bCurrentCivQuoteDelta = 0;
    }
  }
}

export function InitCivQuoteSystem(): void {
  gCivQuotes.forEach(resetCivQuote);
  CopyNumEntriesIntoQuoteStruct();

  resetQuoteSystemStruct(gCivQuoteData);
  gCivQuoteData.bActive = false;
  gCivQuoteData.iVideoOverlay = -1;
  gCivQuoteData.iDialogueBox = -1;
}

export function SaveCivQuotesToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  buffer = Buffer.allocUnsafe(gCivQuotes.length * CIV_QUOTE_SIZE);
  writeObjectArray(gCivQuotes, buffer, 0, writeCivQuote);

  uiNumBytesWritten = FileWrite(hFile, buffer, buffer.length);
  if (uiNumBytesWritten != buffer.length) {
    return false;
  }

  return true;
}

export function LoadCivQuotesFromLoadGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  buffer = Buffer.allocUnsafe(gCivQuotes.length * CIV_QUOTE_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, buffer.length);
  if (uiNumBytesRead != buffer.length) {
    return false;
  }

  readObjectArray(gCivQuotes, buffer, 0, readCivQuote);

  CopyNumEntriesIntoQuoteStruct();

  return true;
}

}
