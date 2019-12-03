namespace ja2 {

export const NUM_NPC_QUOTE_RECORDS = 50;

//#define IRRELEVANT 255
//#define NO_QUEST 255
//#define NO_FACT 255
//#define NO_QUOTE 255
export const MUST_BE_NEW_DAY = 254;
export const INITIATING_FACTOR = 30;

export const TURN_FLAG_ON = (a: number, b: number) => (a | b);
export const TURN_FLAG_OFF = (a: number, b: number) => (a & ~(b));
export const CHECK_FLAG = (a: number, b: number) => (a & b);

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

class _NPCQuoteInfo implements NPCQuoteInfo {
  public fFlags: UINT16;
  public sRequiredItem: INT16;
  public usFactMustBeTrue: UINT16;
  public usFactMustBeFalse: UINT16;
  public ubQuest: UINT8;
  public ubFirstDay: UINT8;
  public ubLastDay: UINT8;
  public ubApproachRequired: UINT8;
  public ubOpinionRequired: UINT8;
  public ubQuoteNum: UINT8;
  public ubNumQuotes: UINT8;
  public ubStartQuest: UINT8;
  public ubEndQuest: UINT8;
  public ubTriggerNPC: UINT8;
  public ubTriggerNPCRec: UINT8;
  public ubFiller: UINT8;
  public usSetFactTrue: UINT16;
  public usGiftItem: UINT16;
  public usGoToGridno: UINT16;
  public sActionData: INT16;
  public ubUnused: UINT8[];

  constructor() {
    this.fFlags = 0;
    this.sRequiredItem = 0;
    this.usFactMustBeTrue = 0;
    this.usFactMustBeFalse = 0;
    this.ubQuest = 0;
    this.ubFirstDay = 0;
    this.ubLastDay = 0;
    this.ubApproachRequired = 0;
    this.ubOpinionRequired = 0;
    this.ubQuoteNum = 0;
    this.ubNumQuotes = 0;
    this.ubStartQuest = 0;
    this.ubEndQuest = 0;
    this.ubTriggerNPC = 0;
    this.ubTriggerNPCRec = 0;
    this.ubFiller = 0;
    this.usSetFactTrue = 0;
    this.usGiftItem = 0;
    this.usGoToGridno = 0;
    this.sActionData = 0;
    this.ubUnused = createArray(4, 0);
  }

  get sRequiredGridno() {
    return this.sRequiredItem;
  }

  set sRequiredGridno(value) {
    this.sRequiredItem = value;
  }
}

export function createNPCQuoteInfo(): NPCQuoteInfo {
  return new _NPCQuoteInfo();
}

export function copyNPCQuoteInfo(destination: NPCQuoteInfo, source: NPCQuoteInfo) {
  destination.fFlags = source.fFlags;
  destination.sRequiredItem = source.sRequiredItem;
  destination.usFactMustBeTrue = source.usFactMustBeTrue;
  destination.usFactMustBeFalse = source.usFactMustBeFalse;
  destination.ubQuest = source.ubQuest;
  destination.ubFirstDay = source.ubFirstDay;
  destination.ubLastDay = source.ubLastDay;
  destination.ubApproachRequired = source.ubApproachRequired;
  destination.ubOpinionRequired = source.ubOpinionRequired;
  destination.ubQuoteNum = source.ubQuoteNum;
  destination.ubNumQuotes = source.ubNumQuotes;
  destination.ubStartQuest = source.ubStartQuest;
  destination.ubEndQuest = source.ubEndQuest;
  destination.ubTriggerNPC = source.ubTriggerNPC;
  destination.ubTriggerNPCRec = source.ubTriggerNPCRec;
  destination.ubFiller = source.ubFiller;
  destination.usSetFactTrue = source.usSetFactTrue;
  destination.usGiftItem = source.usGiftItem;
  destination.usGoToGridno = source.usGoToGridno;
  destination.sActionData = source.sActionData;
  copyArray(destination.ubUnused, source.ubUnused);
}

export const NPC_QUOTE_INFO_SIZE = 32;

export function readNPCQuoteInfo(o: NPCQuoteInfo, buffer: Buffer, offset: number = 0): number {
  o.fFlags = buffer.readUInt16LE(offset); offset += 2;
  o.sRequiredItem = buffer.readInt16LE(offset); offset += 2;
  o.usFactMustBeTrue = buffer.readUInt16LE(offset); offset += 2;
  o.usFactMustBeFalse = buffer.readUInt16LE(offset); offset += 2;
  o.ubQuest = buffer.readUInt8(offset++);
  o.ubFirstDay = buffer.readUInt8(offset++);
  o.ubLastDay = buffer.readUInt8(offset++);
  o.ubApproachRequired = buffer.readUInt8(offset++);
  o.ubOpinionRequired = buffer.readUInt8(offset++);
  o.ubQuoteNum = buffer.readUInt8(offset++);
  o.ubNumQuotes = buffer.readUInt8(offset++);
  o.ubStartQuest = buffer.readUInt8(offset++);
  o.ubEndQuest = buffer.readUInt8(offset++);
  o.ubTriggerNPC = buffer.readUInt8(offset++);
  o.ubTriggerNPCRec = buffer.readUInt8(offset++);
  o.ubFiller = buffer.readUInt8(offset++);
  o.usSetFactTrue = buffer.readUInt16LE(offset); offset += 2;
  o.usGiftItem = buffer.readUInt16LE(offset); offset += 2;
  o.usGoToGridno = buffer.readUInt16LE(offset); offset += 2;
  o.sActionData = buffer.readInt16LE(offset); offset += 2;
  offset = readUIntArray(o.ubUnused, buffer, offset, 1);
  return offset;
}

export function writeNPCQuoteInfo(o: NPCQuoteInfo, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt16LE(o.fFlags, offset);
  offset = buffer.writeInt16LE(o.sRequiredItem, offset);
  offset = buffer.writeUInt16LE(o.usFactMustBeTrue, offset);
  offset = buffer.writeUInt16LE(o.usFactMustBeFalse, offset);
  offset = buffer.writeUInt8(o.ubQuest, offset);
  offset = buffer.writeUInt8(o.ubFirstDay, offset);
  offset = buffer.writeUInt8(o.ubLastDay, offset);
  offset = buffer.writeUInt8(o.ubApproachRequired, offset);
  offset = buffer.writeUInt8(o.ubOpinionRequired, offset);
  offset = buffer.writeUInt8(o.ubQuoteNum, offset);
  offset = buffer.writeUInt8(o.ubNumQuotes, offset);
  offset = buffer.writeUInt8(o.ubStartQuest, offset);
  offset = buffer.writeUInt8(o.ubEndQuest, offset);
  offset = buffer.writeUInt8(o.ubTriggerNPC, offset);
  offset = buffer.writeUInt8(o.ubTriggerNPCRec, offset);
  offset = buffer.writeUInt8(o.ubFiller, offset);
  offset = buffer.writeUInt16LE(o.usSetFactTrue, offset);
  offset = buffer.writeUInt16LE(o.usGiftItem, offset);
  offset = buffer.writeUInt16LE(o.usGoToGridno, offset);
  offset = buffer.writeInt16LE(o.sActionData, offset);
  offset = writeUIntArray(o.ubUnused, buffer, offset, 1);
  return offset;
}

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
