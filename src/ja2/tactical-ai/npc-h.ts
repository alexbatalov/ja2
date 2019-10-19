const NUM_NPC_QUOTE_RECORDS = 50;

//#define IRRELEVANT 255
//#define NO_QUEST 255
//#define NO_FACT 255
//#define NO_QUOTE 255
const MUST_BE_NEW_DAY = 254;
const INITIATING_FACTOR = 30;

const TURN_FLAG_ON = (a, b) => (a |= b);
const TURN_FLAG_OFF = (a, b) => (a &= ~(b));
const CHECK_FLAG = (a, b) => (a & b);

const QUOTE_FLAG_SAID = 0x0001;
const QUOTE_FLAG_ERASE_ONCE_SAID = 0x0002;
const QUOTE_FLAG_SAY_ONCE_PER_CONVO = 0x0004;

const NPC_TALK_RADIUS = 4;

const TURN_UI_OFF = 65000;
const TURN_UI_ON = 65001;
const SPECIAL_TURN_UI_OFF = 65002;
const SPECIAL_TURN_UI_ON = 65003;

const LARGE_AMOUNT_MONEY = 1000;

const ACCEPT_ANY_ITEM = 1000;
const ANY_RIFLE = 1001;

interface NPCQuoteInfo {
  fFlags: UINT16;

  /* union { */
  sRequiredItem: INT16; // item NPC must have to say quote
  sRequiredGridno: INT16; // location for NPC req'd to say quote
  /* } */
  usFactMustBeTrue: UINT16; // ...before saying quote
  usFactMustBeFalse: UINT16; // ...before saying quote
  ubQuest: UINT8; // quest must be current to say quote
  ubFirstDay: UINT8; // first day quote can be said
  ubLastDay: UINT8; // last day quote can be said
  ubApproachRequired: UINT8; // must use this approach to generate quote
  ubOpinionRequired: UINT8; // opinion needed for this quote     13 bytes

  // quote to say (if any)
  ubQuoteNum: UINT8; // this is the quote to say
  ubNumQuotes: UINT8; // total # of quotes to say          15 bytes

  // actions
  ubStartQuest: UINT8;
  ubEndQuest: UINT8;
  ubTriggerNPC: UINT8;
  ubTriggerNPCRec: UINT8;
  ubFiller: UINT8; //                                       20 bytes
  usSetFactTrue: UINT16;
  usGiftItem: UINT16; // item NPC gives to merc after saying quote
  usGoToGridno: UINT16;
  sActionData: INT16; // special action value

  ubUnused: UINT8[] /* [4] */;
} // 32 bytes

const enum Enum296 {
  APPROACH_FRIENDLY = 1,
  APPROACH_DIRECT,
  APPROACH_THREATEN,
  APPROACH_RECRUIT,
  APPROACH_REPEAT,

  APPROACH_GIVINGITEM,
  NPC_INITIATING_CONV,
  NPC_INITIAL_QUOTE,
  NPC_WHOAREYOU,
  TRIGGER_NPC,

  APPROACH_GIVEFIRSTAID,
  APPROACH_SPECIAL_INITIAL_QUOTE,
  APPROACH_ENEMY_NPC_QUOTE,
  APPROACH_DECLARATION_OF_HOSTILITY,
  APPROACH_EPC_IN_WRONG_SECTOR,

  APPROACH_EPC_WHO_IS_RECRUITED,
  APPROACH_INITIAL_QUOTE,
  APPROACH_CLOSING_SHOP,
  APPROACH_SECTOR_NOT_SAFE,
  APPROACH_DONE_SLAPPED, // 20

  APPROACH_DONE_PUNCH_0,
  APPROACH_DONE_PUNCH_1,
  APPROACH_DONE_PUNCH_2,
  APPROACH_DONE_OPEN_STRUCTURE,
  APPROACH_DONE_GET_ITEM, // 25

  APPROACH_DONE_GIVING_ITEM,
  APPROACH_DONE_TRAVERSAL,
  APPROACH_BUYSELL,
  APPROACH_ONE_OF_FOUR_STANDARD,
  APPROACH_FRIENDLY_DIRECT_OR_RECRUIT, // 30
}

const enum Enum297 {
  QUOTE_INTRO = 0,
  QUOTE_SUBS_INTRO,
  QUOTE_FRIENDLY_DEFAULT1,
  QUOTE_FRIENDLY_DEFAULT2,
  QUOTE_GIVEITEM_NO,
  QUOTE_DIRECT_DEFAULT,
  QUOTE_THREATEN_DEFAULT,
  QUOTE_RECRUIT_NO,
  QUOTE_BYE,
  QUOTE_GETLOST,
}

const NUM_REAL_APPROACHES = APPROACH_RECRUIT;

const CONVO_DIST = 5;

extern INT8 gbFirstApproachFlags[4];

extern UINT8 gubTeamPenalty;

extern void ShutdownNPCQuotes(void);

extern void SetQuoteRecordAsUsed(UINT8 ubNPC, UINT8 ubRecord);

// uiApproachData is used for approach things like giving items, etc.
extern UINT8 CalcDesireToTalk(UINT8 ubNPC, UINT8 ubMerc, INT8 bApproach);
extern void Converse(UINT8 ubNPC, UINT8 ubMerc, INT8 bApproach, UINT32 uiApproachData);

extern BOOLEAN NPCOkToGiveItem(UINT8 ubNPC, UINT8 ubMerc, UINT16 usItem);
extern void NPCReachedDestination(SOLDIERTYPE *pNPC, BOOLEAN fAlreadyThere);
extern void PCsNearNPC(UINT8 ubNPC);
extern BOOLEAN PCDoesFirstAidOnNPC(UINT8 ubNPC);
extern void TriggerNPCRecord(UINT8 ubTriggerNPC, UINT8 ubTriggerNPCRec);
extern BOOLEAN TriggerNPCWithIHateYouQuote(UINT8 ubTriggerNPC);

extern void TriggerNPCRecordImmediately(UINT8 ubTriggerNPC, UINT8 ubTriggerNPCRec);

extern BOOLEAN TriggerNPCWithGivenApproach(UINT8 ubTriggerNPC, UINT8 ubApproach, BOOLEAN fShowPanel);

extern BOOLEAN ReloadQuoteFile(UINT8 ubNPC);
extern BOOLEAN ReloadAllQuoteFiles(void);

// Save and loads the npc info to a saved game file
extern BOOLEAN SaveNPCInfoToSaveGameFile(HWFILE hFile);
BOOLEAN LoadNPCInfoFromSavedGameFile(HWFILE hFile, UINT32 uiSaveGameVersion);

extern void TriggerFriendWithHostileQuote(UINT8 ubNPC);

extern void ReplaceLocationInNPCDataFromProfileID(UINT8 ubNPC, INT16 sOldGridNo, INT16 sNewGridNo);

extern UINT8 ActionIDForMovementRecord(UINT8 ubNPC, UINT8 ubRecord);

// total amount given to doctors
extern UINT32 uiTotalAmountGivenToDoctors;

// handle money being npc being
extern BOOLEAN HandleNPCBeingGivenMoneyByPlayer(UINT8 ubNPCId, UINT32 uiMoneyAmount, UINT8 *pQuoteValue);

// given a victory in this sector, handle specific facts
void HandleVictoryInNPCSector(INT16 sSectorX, INT16 sSectorY, INT16 sSectorZ);

// check if this shopkeep has been shutdown, if so do soething and return the fact
BOOLEAN HandleShopKeepHasBeenShutDown(UINT8 ubCharNum);

BOOLEAN NPCHasUnusedRecordWithGivenApproach(UINT8 ubNPC, UINT8 ubApproach);
BOOLEAN NPCWillingToAcceptItem(UINT8 ubNPC, UINT8 ubMerc, OBJECTTYPE *pObj);

BOOLEAN SaveBackupNPCInfoToSaveGameFile(HWFILE hFile);
BOOLEAN LoadBackupNPCInfoFromSavedGameFile(HWFILE hFile, UINT32 uiSaveGameVersion);

void UpdateDarrelScriptToGoTo(SOLDIERTYPE *pSoldier);

const WALTER_BRIBE_AMOUNT = 20000;

BOOLEAN GetInfoForAbandoningEPC(UINT8 ubNPC, UINT16 *pusQuoteNum, UINT16 *pusFactToSetTrue);

BOOLEAN RecordHasDialogue(UINT8 ubNPC, UINT8 ubRecord);

INT8 ConsiderCivilianQuotes(INT16 sSectorX, INT16 sSectorY, INT16 sSectorZ, BOOLEAN fSetAsUsed);

void ResetOncePerConvoRecordsForNPC(UINT8 ubNPC);

void HandleNPCChangesForTacticalTraversal(SOLDIERTYPE *pSoldier);

BOOLEAN NPCHasUnusedHostileRecord(UINT8 ubNPC, UINT8 ubApproach);

void ResetOncePerConvoRecordsForAllNPCsInLoadedSector(void);
