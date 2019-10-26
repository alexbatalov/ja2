namespace ja2 {

export const NUM_NPC_QUOTE_RECORDS = 50;

//#define IRRELEVANT 255
//#define NO_QUEST 255
//#define NO_FACT 255
//#define NO_QUOTE 255
export const MUST_BE_NEW_DAY = 254;
export const INITIATING_FACTOR = 30;

export const TURN_FLAG_ON = (a, b) => (a |= b);
export const TURN_FLAG_OFF = (a, b) => (a &= ~(b));
export const CHECK_FLAG = (a, b) => (a & b);

export const QUOTE_FLAG_SAID = 0x0001;
export const QUOTE_FLAG_ERASE_ONCE_SAID = 0x0002;
export const QUOTE_FLAG_SAY_ONCE_PER_CONVO = 0x0004;

export const NPC_TALK_RADIUS = 4;

export const TURN_UI_OFF = 65000;
export const TURN_UI_ON = 65001;
export const SPECIAL_TURN_UI_OFF = 65002;
export const SPECIAL_TURN_UI_ON = 65003;

export const LARGE_AMOUNT_MONEY = 1000;

export const ACCEPT_ANY_ITEM = 1000;
export const ANY_RIFLE = 1001;

export interface NPCQuoteInfo {
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

export const enum Enum296 {
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

export const enum Enum297 {
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

export const NUM_REAL_APPROACHES = Enum296.APPROACH_RECRUIT;

export const CONVO_DIST = 5;

export const WALTER_BRIBE_AMOUNT = 20000;

}
