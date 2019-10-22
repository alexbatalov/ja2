const ITEMDESC_FONT = () => BLOCKFONT2();
const ITEMDESC_FONTSHADOW1 = MILITARY_SHADOW;
const ITEMDESC_FONTSHADOW2 = 32;
const ITEMDESC_FONTSHADOW3 = 34;
const ITEMDESC_FONTFORE1 = 33;
const ITEMDESC_FONTFORE2 = 32;

const ITEMDESC_FONTAPFORE = 218;
const ITEMDESC_FONTHPFORE = 24;
const ITEMDESC_FONTBSFORE = 125;
const ITEMDESC_FONTHEFORE = 75;
const ITEMDESC_FONTHEAPFORE = 76;

const ITEMDESC_AMMO_FORE = 209;

const ITEMDESC_FONTHIGHLIGHT = FONT_MCOLOR_WHITE;

const STATUS_BAR_SHADOW = () => FROMRGB(140, 136, 119);
const STATUS_BAR = () => FROMRGB(201, 172, 133);
const DESC_STATUS_BAR_SHADOW = () => STATUS_BAR_SHADOW();
const DESC_STATUS_BAR = () => STATUS_BAR();

const MIN_LOB_RANGE = 4;

const INV_BAR_DX = 5;
const INV_BAR_DY = 21;

const RENDER_ITEM_NOSTATUS = 20;
const RENDER_ITEM_ATTACHMENT1 = 200;

const ITEM_STATS_WIDTH = 26;
const ITEM_STATS_HEIGHT = 8;

const ITEMDESC_START_X = 214;
const ITEMDESC_START_Y = 1 + INV_INTERFACE_START_Y;
const ITEMDESC_HEIGHT = 133;
const ITEMDESC_WIDTH = 320;
const MAP_ITEMDESC_HEIGHT = 268;
const MAP_ITEMDESC_WIDTH = 272;
const ITEMDESC_NAME_X = () => (16 + gsInvDescX);
const ITEMDESC_NAME_Y = () => (67 + gsInvDescY);
const ITEMDESC_CALIBER_X = () => (162 + gsInvDescX);
const ITEMDESC_CALIBER_Y = () => (67 + gsInvDescY);
const ITEMDESC_CALIBER_WIDTH = 142;
const MAP_ITEMDESC_CALIBER_X = () => (105 + gsInvDescX);
const MAP_ITEMDESC_CALIBER_Y = () => (66 + gsInvDescY);
const MAP_ITEMDESC_CALIBER_WIDTH = 149;
const ITEMDESC_ITEM_X = () => (8 + gsInvDescX);
const ITEMDESC_ITEM_Y = () => (11 + gsInvDescY);

const CAMO_REGION_HEIGHT = 75;
const CAMO_REGION_WIDTH = 75;

const BULLET_SING_X = () => (222 + gsInvDescX);
const BULLET_SING_Y = () => (49 + gsInvDescY);
const BULLET_BURST_X = () => (263 + gsInvDescX);
const BULLET_BURST_Y = () => (49 + gsInvDescY);
const BULLET_WIDTH = 3;
const BULLET_GAP = 5;

const MAP_BULLET_SING_X = () => (77 + gsInvDescX);
const MAP_BULLET_SING_Y = () => (135 + gsInvDescY);
const MAP_BULLET_BURST_X = () => (117 + gsInvDescX);
const MAP_BULLET_BURST_Y = () => (135 + gsInvDescY);

const MAP_ITEMDESC_NAME_X = () => (7 + gsInvDescX);
const MAP_ITEMDESC_NAME_Y = () => (65 + gsInvDescY);
const MAP_ITEMDESC_ITEM_X = () => (25 + gsInvDescX);
const MAP_ITEMDESC_ITEM_Y = () => (6 + gsInvDescY);

const ITEMDESC_DESC_START_X = () => (11 + gsInvDescX);
const ITEMDESC_DESC_START_Y = () => (80 + gsInvDescY);
const ITEMDESC_PROS_START_X = () => (11 + gsInvDescX);
const ITEMDESC_PROS_START_Y = () => (110 + gsInvDescY);
const ITEMDESC_CONS_START_X = () => (11 + gsInvDescX);
const ITEMDESC_CONS_START_Y = () => (120 + gsInvDescY);
const ITEMDESC_ITEM_STATUS_X = () => (6 + gsInvDescX);
const ITEMDESC_ITEM_STATUS_Y = () => (60 + gsInvDescY);
const DOTDOTDOT = L"...";
const COMMA_AND_SPACE = L", ";

const ITEM_PROS_AND_CONS = (usItem) => ((Item[usItem].usItemClass & IC_GUN));

const MAP_ITEMDESC_DESC_START_X = () => (23 + gsInvDescX);
const MAP_ITEMDESC_DESC_START_Y = () => (170 + gsInvDescY);
const MAP_ITEMDESC_PROS_START_X = () => (23 + gsInvDescX);
const MAP_ITEMDESC_PROS_START_Y = () => (230 + gsInvDescY);
const MAP_ITEMDESC_CONS_START_X = () => (23 + gsInvDescX);
const MAP_ITEMDESC_CONS_START_Y = () => (240 + gsInvDescY);
const MAP_ITEMDESC_ITEM_STATUS_X = () => (18 + gsInvDescX);
const MAP_ITEMDESC_ITEM_STATUS_Y = () => (53 + gsInvDescY);

const ITEMDESC_ITEM_STATUS_WIDTH = 2;
const ITEMDESC_ITEM_STATUS_HEIGHT = 50;
const ITEMDESC_ITEM_STATUS_HEIGHT_MAP = 40;
const ITEMDESC_DESC_WIDTH = 301;
const MAP_ITEMDESC_DESC_WIDTH = 220;
const ITEMDESC_ITEM_WIDTH = 117;
const ITEMDESC_ITEM_HEIGHT = 54;

const ITEMDESC_AMMO_X = () => (10 + gsInvDescX);
const ITEMDESC_AMMO_Y = () => (50 + gsInvDescY);
const MAP_ITEMDESC_AMMO_X = () => (28 + gsInvDescX);
const MAP_ITEMDESC_AMMO_Y = () => (45 + gsInvDescY);

const ITEMDESC_AMMO_TEXT_X = 3;
const ITEMDESC_AMMO_TEXT_Y = 1;
const ITEMDESC_AMMO_TEXT_WIDTH = 31;

const WORD_WRAP_INV_WIDTH = 58;

const ITEM_BAR_WIDTH = 2;
const ITEM_BAR_HEIGHT = 20;

const ITEM_FONT = () => TINYFONT1();

const EXCEPTIONAL_DAMAGE = 30;
const EXCEPTIONAL_WEIGHT = 20;
const EXCEPTIONAL_RANGE = 300;
const EXCEPTIONAL_MAGAZINE = 30;
const EXCEPTIONAL_AP_COST = 7;
const EXCEPTIONAL_BURST_SIZE = 5;
const EXCEPTIONAL_RELIABILITY = 2;
const EXCEPTIONAL_REPAIR_EASE = 2;

const BAD_DAMAGE = 23;
const BAD_WEIGHT = 45;
const BAD_RANGE = 150;
const BAD_MAGAZINE = 10;
const BAD_AP_COST = 11;
const BAD_RELIABILITY = -2;
const BAD_REPAIR_EASE = -2;

const KEYRING_X = 487;
const KEYRING_Y = 445;
const MAP_KEYRING_X = 217;
const MAP_KEYRING_Y = 271;
const KEYRING_WIDTH = 517 - 487;
const KEYRING_HEIGHT = 469 - 445;
const TACTICAL_INVENTORY_KEYRING_GRAPHIC_OFFSET_X = 215;
// enum used for the money buttons
const enum Enum217 {
  M_1000,
  M_100,
  M_10,
  M_DONE,
}

// AN ARRAY OF MOUSE REGIONS, ONE FOR EACH OBJECT POSITION ON BUDDY
let gInvRegions: MOUSE_REGION[] /* [NUM_INV_SLOTS] */;

let gInvDesc: MOUSE_REGION;

let gpItemPointer: Pointer<OBJECTTYPE> = NULL;
let gItemPointer: OBJECTTYPE;
let gfItemPointerDifferentThanDefault: BOOLEAN = FALSE;
let gpItemPointerSoldier: Pointer<SOLDIERTYPE>;
let gbItemPointerSrcSlot: INT8;
let gusItemPointer: UINT16 = 255;
let usItemSnapCursor: UINT16;
let guiNewlyPlacedItemTimer: UINT32 = 0;
let gfBadThrowItemCTGH: BOOLEAN;
let gfDontChargeAPsToPickup: BOOLEAN = FALSE;
let gbItemPointerLocateGood: BOOLEAN = FALSE;

// ITEM DESCRIPTION BOX STUFF
let guiItemDescBox: UINT32;
let guiMapItemDescBox: UINT32;
let guiItemGraphic: UINT32;
let guiMoneyGraphicsForDescBox: UINT32;
let guiBullet: UINT32;
let gfInItemDescBox: BOOLEAN = FALSE;
let guiCurrentItemDescriptionScreen: UINT32 = 0;
let gpItemDescObject: Pointer<OBJECTTYPE> = NULL;
let gfItemDescObjectIsAttachment: BOOLEAN = FALSE;
let gzItemName: UINT16[] /* [SIZE_ITEM_NAME] */;
let gzItemDesc: UINT16[] /* [SIZE_ITEM_INFO] */;
let gzItemPros: UINT16[] /* [SIZE_ITEM_PROS] */;
let gzItemCons: UINT16[] /* [SIZE_ITEM_CONS] */;
let gzFullItemPros: UINT16[] /* [SIZE_ITEM_PROS] */;
let gzFullItemCons: UINT16[] /* [SIZE_ITEM_PROS] */;
let gzFullItemTemp: UINT16[] /* [SIZE_ITEM_PROS] */; // necessary, unfortunately
let gsInvDescX: INT16;
let gsInvDescY: INT16;
let gubItemDescStatusIndex: UINT8;
let giItemDescAmmoButtonImages: INT32;
let giItemDescAmmoButton: INT32;
let gfItemAmmoDown: BOOLEAN = FALSE;
let gpItemDescSoldier: Pointer<SOLDIERTYPE>;
let fItemDescDelete: BOOLEAN = FALSE;
let gItemDescAttachmentRegions: MOUSE_REGION[] /* [4] */;
let gProsAndConsRegions: MOUSE_REGION[] /* [2] */;

let guiMoneyButtonBtn: UINT32[] /* [MAX_ATTACHMENTS] */;
let guiMoneyButtonImage: INT32;
let guiMoneyDoneButtonImage: INT32;

let gusOriginalAttachItem: UINT16[] /* [MAX_ATTACHMENTS] */;
let gbOriginalAttachStatus: UINT8[] /* [MAX_ATTACHMENTS] */;
let gpAttachSoldier: Pointer<SOLDIERTYPE>;

interface MoneyLoc {
  x: UINT16;
  y: UINT16;
}

let gMoneyButtonLoc: MoneyLoc = { 343, 351 };
let gMoneyButtonOffsets: MoneyLoc[] /* [] */ = {
  { 0, 0 },
  { 34, 0 },
  { 0, 32 },
  { 34, 32 },
  { 8, 22 },
};
let gMapMoneyButtonLoc: MoneyLoc = { 174, 115 };

// number of keys on keyring, temp for now
const NUMBER_KEYS_ON_KEYRING = 28;
const KEY_RING_ROW_WIDTH = 7;
const MAP_KEY_RING_ROW_WIDTH = 4;

// ITEM STACK POPUP STUFF
let gfInItemStackPopup: BOOLEAN = FALSE;
let guiItemPopupBoxes: UINT32;
let gpItemPopupObject: Pointer<OBJECTTYPE>;
let gsItemPopupWidth: INT16;
let gsItemPopupHeight: INT16;
let gsItemPopupX: INT16;
let gsItemPopupY: INT16;
let gItemPopupRegions: MOUSE_REGION[] /* [8] */;
let gKeyRingRegions: MOUSE_REGION[] /* [NUMBER_KEYS_ON_KEYRING] */;
let gfInKeyRingPopup: BOOLEAN = FALSE;
let gubNumItemPopups: UINT8 = 0;
let gItemPopupRegion: MOUSE_REGION;
let gsItemPopupInvX: INT16;
let gsItemPopupInvY: INT16;
let gsItemPopupInvWidth: INT16;
let gsItemPopupInvHeight: INT16;

let gsKeyRingPopupInvX: INT16;
let gsKeyRingPopupInvY: INT16;
let gsKeyRingPopupInvWidth: INT16;
let gsKeyRingPopupInvHeight: INT16;

let gpItemPopupSoldier: Pointer<SOLDIERTYPE>;

// inventory description done button for mapscreen
let giMapInvDescButtonImage: INT32;
let giMapInvDescButton: INT32 = -1;

let gfItemPopupRegionCallbackEndFix: BOOLEAN = FALSE;

let ubRGBItemCyclePlacedItemColors: UINT8[] /* [] */ = {
  25, 25, 25,
  50, 50, 50,
  75, 75, 75,
  100, 100, 100,
  125, 125, 125,
  150, 150, 150,
  175, 175, 175,
  200, 200, 200,
  225, 225, 225,
  250, 250, 250,

  250, 250, 250,
  225, 225, 225,
  200, 200, 200,
  175, 175, 175,
  150, 150, 150,
  125, 125, 125,
  100, 100, 100,
  75, 75, 75,
  50, 50, 50,
  25, 25, 25,
};

interface INV_DESC_STATS {
  sX: INT16;
  sY: INT16;
  sValDx: INT16;
}

interface INV_ATTACHXY {
  sX: INT16;
  sY: INT16;
  sHeight: INT16;
  sWidth: INT16;
  sBarDx: INT16;
  sBarDy: INT16;
}

const NUM_INV_HELPTEXT_ENTRIES = 1;

interface INV_HELPTEXT {
  iXPosition: INT32[] /* [NUM_INV_HELPTEXT_ENTRIES] */;
  iYPosition: INT32[] /* [NUM_INV_HELPTEXT_ENTRIES] */;
  iWidth: INT32[] /* [NUM_INV_HELPTEXT_ENTRIES] */;
  sString1: STR16[] /* [NUM_INV_HELPTEXT_ENTRIES] */;
  sString2: STR16[] /* [NUM_INV_HELPTEXT_ENTRIES] */;
}

let gWeaponStats: INV_DESC_STATS[] /* [] */ = {
  { 202, 25, 83 },
  { 202, 15, 83 },
  { 202, 15, 83 },
  { 265, 40, 20 },
  { 202, 40, 32 },
  { 202, 50, 32 },
  { 265, 50, 20 },
  { 234, 50, 0 },
  { 290, 50, 0 },
};

// displayed AFTER the mass/weight/"Kg" line
let gMoneyStats: INV_DESC_STATS[] /* [] */ = {
  { 202, 14, 78 },
  { 212, 25, 78 },
  { 202, 40, 78 },
  { 212, 51, 78 },
};

// displayed AFTER the mass/weight/"Kg" line
let gMapMoneyStats: INV_DESC_STATS[] /* [] */ = {
  { 51, 97, 45 },
  { 61, 107, 75 },
  { 51, 125, 45 },
  { 61, 135, 70 },
};

let gMapWeaponStats: INV_DESC_STATS[] /* [] */ = {
  { 72 - 20, 20 + 80 + 8, 80 },
  { 72 - 20, 20 + 80 - 2, 80 },
  { 72 - 20, 20 + 80 - 2, 80 },
  { 72 + 65 - 20, 40 + 80 + 4, 21 },
  { 72 - 20, 40 + 80 + 4, 30 },
  { 72 - 20, 53 + 80 + 2, 30 },
  { 72 + 65 - 20, 53 + 80 + 2, 25 },
  { 86, 53 + 80 + 2, 0 },
  { 145, 53 + 80 + 2, 0 },
};

let gItemDescAttachmentsXY: INV_ATTACHXY[] /* [] */ = {
  { 129, 12, SM_INV_SLOT_HEIGHT, SM_INV_SLOT_WIDTH, INV_BAR_DX - 1, INV_BAR_DY + 1 },
  { 163, 12, SM_INV_SLOT_HEIGHT, SM_INV_SLOT_WIDTH, INV_BAR_DX - 1, INV_BAR_DY + 1 },
  { 129, 39, SM_INV_SLOT_HEIGHT, SM_INV_SLOT_WIDTH, INV_BAR_DX - 1, INV_BAR_DY + 1 },
  { 163, 39, SM_INV_SLOT_HEIGHT, SM_INV_SLOT_WIDTH, INV_BAR_DX - 1, INV_BAR_DY + 1 },
};

let gMapItemDescAttachmentsXY: INV_ATTACHXY[] /* [] */ = {
  { 173, 10, SM_INV_SLOT_HEIGHT, 26, INV_BAR_DX + 2, INV_BAR_DY },
  { 211, 10, SM_INV_SLOT_HEIGHT, 26, INV_BAR_DX + 2, INV_BAR_DY },
  { 173, 36, SM_INV_SLOT_HEIGHT, 26, INV_BAR_DX + 2, INV_BAR_DY },
  { 211, 36, SM_INV_SLOT_HEIGHT, 26, INV_BAR_DX + 2, INV_BAR_DY },
};

let gItemDescProsConsRects: SGPRect[] /* [] */ = {
  // NB the left value is calculated based on the width of the 'pros' and 'cons' labels
  { 0, 111, 313, 118 },
  { 0, 119, 313, 126 },
};

let gMapItemDescProsConsRects: SGPRect[] /* [] */ = {
  { 0, 231, 313, 238 },
  { 0, 239, 313, 246 },
};

let gItemDescHelpText: INV_HELPTEXT = {
  { 69 }, // x locations
  { 12 }, // y locations
  { 170 }, // widths
  { Message[STR_ATTACHMENT_HELP] },
  { Message[STR_ATTACHMENT_INVALID_HELP] },
};

let gfItemDescHelpTextOffset: BOOLEAN = FALSE;

// ARRAY FOR INV PANEL INTERFACE ITEM POSITIONS (sX,sY get set via InitInvSlotInterface() )
let gSMInvData: INV_REGIONS[] /* [] */ = {
  { FALSE, INV_BAR_DX, INV_BAR_DY, HEAD_INV_SLOT_WIDTH, HEAD_INV_SLOT_HEIGHT, 0, 0 }, // HELMETPOS
  { FALSE, INV_BAR_DX, INV_BAR_DY, VEST_INV_SLOT_WIDTH, VEST_INV_SLOT_HEIGHT, 0, 0 }, // VESTPOS
  { FALSE, INV_BAR_DX, INV_BAR_DY, LEGS_INV_SLOT_WIDTH, LEGS_INV_SLOT_HEIGHT, 0, 0 }, // LEGPOS,
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // HEAD1POS
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // HEAD2POS
  { TRUE, INV_BAR_DX, INV_BAR_DY, BIG_INV_SLOT_WIDTH, BIG_INV_SLOT_HEIGHT, 0, 0 }, // HANDPOS,
  { TRUE, INV_BAR_DX, INV_BAR_DY, BIG_INV_SLOT_WIDTH, BIG_INV_SLOT_HEIGHT, 0, 0 }, // SECONDHANDPOS
  { TRUE, INV_BAR_DX, INV_BAR_DY, BIG_INV_SLOT_WIDTH, BIG_INV_SLOT_HEIGHT, 0, 0 }, // BIGPOCK1
  { TRUE, INV_BAR_DX, INV_BAR_DY, BIG_INV_SLOT_WIDTH, BIG_INV_SLOT_HEIGHT, 0, 0 }, // BIGPOCK2
  { TRUE, INV_BAR_DX, INV_BAR_DY, BIG_INV_SLOT_WIDTH, BIG_INV_SLOT_HEIGHT, 0, 0 }, // BIGPOCK3
  { TRUE, INV_BAR_DX, INV_BAR_DY, BIG_INV_SLOT_WIDTH, BIG_INV_SLOT_HEIGHT, 0, 0 }, // BIGPOCK4
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK1
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK2
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK3
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK4
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK5
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK6
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK7
  { FALSE, INV_BAR_DX, INV_BAR_DY, SM_INV_SLOT_WIDTH, SM_INV_SLOT_HEIGHT, 0, 0 }, // SMALLPOCK8
};

interface REMOVE_MONEY {
  uiTotalAmount: UINT32;
  uiMoneyRemaining: UINT32;
  uiMoneyRemoving: UINT32;
}
let gRemoveMoney: REMOVE_MONEY;

let gSMInvRegion: MOUSE_REGION[] /* [NUM_INV_SLOTS] */;
let gKeyRingPanel: MOUSE_REGION;
let gSMInvCamoRegion: MOUSE_REGION;
let gbCompatibleAmmo: INT8[] /* [NUM_INV_SLOTS] */;
let gbInvalidPlacementSlot: INT8[] /* [NUM_INV_SLOTS] */;
let us16BPPItemCyclePlacedItemColors: UINT16[] /* [20] */;
let guiBodyInvVO: UINT32[][] /* [4][2] */;
let guiGoldKeyVO: UINT32;
let gbCompatibleApplyItem: INT8 = FALSE;

function AttemptToAddSubstring(zDest: STR16, zTemp: STR16, puiStringLength: Pointer<UINT32>, uiPixLimit: UINT32): BOOLEAN {
  let uiRequiredStringLength: UINT32;
  let uiTempStringLength: UINT32;

  uiTempStringLength = StringPixLength(zTemp, ITEMDESC_FONT);
  uiRequiredStringLength = *puiStringLength + uiTempStringLength;
  if (zDest[0] != 0) {
    uiRequiredStringLength += StringPixLength(COMMA_AND_SPACE, ITEMDESC_FONT);
  }
  if (uiRequiredStringLength < uiPixLimit) {
    if (zDest[0] != 0) {
      wcscat(zDest, COMMA_AND_SPACE);
    }
    wcscat(zDest, zTemp);
    *puiStringLength = uiRequiredStringLength;
    return TRUE;
  } else {
    wcscat(zDest, DOTDOTDOT);
    return FALSE;
  }
}

function GenerateProsString(zItemPros: Pointer<UINT16>, pObject: Pointer<OBJECTTYPE>, uiPixLimit: UINT32): void {
  let uiStringLength: UINT32 = 0;
  let zTemp: Pointer<UINT16>;
  let usItem: UINT16 = pObject->usItem;
  let ubWeight: UINT8;

  zItemPros[0] = 0;

  ubWeight = Item[usItem].ubWeight;
  if (Item[usItem].usItemClass == IC_GUN) {
    ubWeight += Item[pObject->usGunAmmoItem].ubWeight;
  }

  if (Item[usItem].ubWeight <= EXCEPTIONAL_WEIGHT) {
    zTemp = Message[STR_LIGHT];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Item[usItem].ubPerPocket >= 1) // fits in a small pocket
  {
    zTemp = Message[STR_SMALL];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (GunRange(pObject) >= EXCEPTIONAL_RANGE) {
    zTemp = Message[STR_LONG_RANGE];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Weapon[usItem].ubImpact >= EXCEPTIONAL_DAMAGE) {
    zTemp = Message[STR_HIGH_DAMAGE];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (BaseAPsToShootOrStab(DEFAULT_APS, DEFAULT_AIMSKILL, gpItemDescObject) <= EXCEPTIONAL_AP_COST) {
    zTemp = Message[STR_QUICK_FIRING];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Weapon[usItem].ubShotsPerBurst >= EXCEPTIONAL_BURST_SIZE || usItem == G11) {
    zTemp = Message[STR_FAST_BURST];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Weapon[usItem].ubMagSize > EXCEPTIONAL_MAGAZINE) {
    zTemp = Message[STR_LARGE_AMMO_CAPACITY];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Item[usItem].bReliability >= EXCEPTIONAL_RELIABILITY) {
    zTemp = Message[STR_RELIABLE];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Item[usItem].bRepairEase >= EXCEPTIONAL_REPAIR_EASE) {
    zTemp = Message[STR_EASY_TO_REPAIR];
    if (!AttemptToAddSubstring(zItemPros, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (zItemPros[0] == 0) {
    // empty string, so display "None"
    if (!AttemptToAddSubstring(zItemPros, Message[STR_NONE], &uiStringLength, uiPixLimit)) {
      return;
    }
  }
}

function GenerateConsString(zItemCons: Pointer<UINT16>, pObject: Pointer<OBJECTTYPE>, uiPixLimit: UINT32): void {
  let uiStringLength: UINT32 = 0;
  let zTemp: Pointer<UINT16>;
  let ubWeight: UINT8;
  let usItem: UINT16 = pObject->usItem;

  zItemCons[0] = 0;

  // calculate the weight of the item plus ammunition but not including any attachments
  ubWeight = Item[usItem].ubWeight;
  if (Item[usItem].usItemClass == IC_GUN) {
    ubWeight += Item[pObject->usGunAmmoItem].ubWeight;
  }

  if (ubWeight >= BAD_WEIGHT) {
    zTemp = Message[STR_HEAVY];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (GunRange(pObject) <= BAD_RANGE) {
    zTemp = Message[STR_SHORT_RANGE];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Weapon[usItem].ubImpact <= BAD_DAMAGE) {
    zTemp = Message[STR_LOW_DAMAGE];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (BaseAPsToShootOrStab(DEFAULT_APS, DEFAULT_AIMSKILL, gpItemDescObject) >= BAD_AP_COST) {
    zTemp = Message[STR_SLOW_FIRING];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Weapon[usItem].ubShotsPerBurst == 0) {
    zTemp = Message[STR_NO_BURST];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Weapon[usItem].ubMagSize < BAD_MAGAZINE) {
    zTemp = Message[STR_SMALL_AMMO_CAPACITY];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Item[usItem].bReliability <= BAD_RELIABILITY) {
    zTemp = Message[STR_UNRELIABLE];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (Item[usItem].bRepairEase <= BAD_REPAIR_EASE) {
    zTemp = Message[STR_HARD_TO_REPAIR];
    if (!AttemptToAddSubstring(zItemCons, zTemp, &uiStringLength, uiPixLimit)) {
      return;
    }
  }

  if (zItemCons[0] == 0) {
    // empty string, so display "None"
    if (!AttemptToAddSubstring(zItemCons, Message[STR_NONE], &uiStringLength, uiPixLimit)) {
      return;
    }
  }
}

function InitInvSlotInterface(pRegionDesc: Pointer<INV_REGION_DESC>, pCamoRegion: Pointer<INV_REGION_DESC>, INVMoveCallback: MOUSE_CALLBACK, INVClickCallback: MOUSE_CALLBACK, INVMoveCammoCallback: MOUSE_CALLBACK, INVClickCammoCallback: MOUSE_CALLBACK, fSetHighestPrioity: BOOLEAN): BOOLEAN {
  let cnt: INT32;
  let VObjectDesc: VOBJECT_DESC;

  // Load all four body type images
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_figure_large_male.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[1][0])));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_figure_large_male_H.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[1][1])));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_normal_male.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[0][0])));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_normal_male_H.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[0][1])));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_normal_male.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[2][0])));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_normal_male.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[2][1])));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_figure_female.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[3][0])));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\inventory_figure_female_H.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(guiBodyInvVO[3][1])));

  // add gold key graphic
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\gold_key_button.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiGoldKeyVO));

  // Add cammo region
  MSYS_DefineRegion(&gSMInvCamoRegion, pCamoRegion->sX, pCamoRegion->sY, (pCamoRegion->sX + CAMO_REGION_WIDTH), (pCamoRegion->sY + CAMO_REGION_HEIGHT), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, INVMoveCammoCallback, INVClickCammoCallback);
  // Add region
  MSYS_AddRegion(&gSMInvCamoRegion);

  // Add regions for inventory slots
  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    // set inventory pocket coordinates from the table passed in
    gSMInvData[cnt].sX = pRegionDesc[cnt].sX;
    gSMInvData[cnt].sY = pRegionDesc[cnt].sY;

    MSYS_DefineRegion(&gSMInvRegion[cnt], gSMInvData[cnt].sX, gSMInvData[cnt].sY, (gSMInvData[cnt].sX + gSMInvData[cnt].sWidth), (gSMInvData[cnt].sY + gSMInvData[cnt].sHeight), (fSetHighestPrioity ? MSYS_PRIORITY_HIGHEST : MSYS_PRIORITY_HIGH), MSYS_NO_CURSOR, INVMoveCallback, INVClickCallback);
    // Add region
    MSYS_AddRegion(&gSMInvRegion[cnt]);
    MSYS_SetRegionUserData(&gSMInvRegion[cnt], 0, cnt);
  }

  memset(gbCompatibleAmmo, 0, sizeof(gbCompatibleAmmo));

  return TRUE;
}

function InitKeyRingInterface(KeyRingClickCallback: MOUSE_CALLBACK): void {
  MSYS_DefineRegion(&gKeyRingPanel, KEYRING_X, KEYRING_Y, KEYRING_X + KEYRING_WIDTH, KEYRING_X + KEYRING_HEIGHT, MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, KeyRingClickCallback);

  SetRegionFastHelpText(&(gKeyRingPanel), TacticalStr[KEYRING_HELP_TEXT]);
}

function InitMapKeyRingInterface(KeyRingClickCallback: MOUSE_CALLBACK): void {
  MSYS_DefineRegion(&gKeyRingPanel, MAP_KEYRING_X, MAP_KEYRING_Y, MAP_KEYRING_X + KEYRING_WIDTH, MAP_KEYRING_Y + KEYRING_HEIGHT, MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, KeyRingClickCallback);

  SetRegionFastHelpText(&(gKeyRingPanel), TacticalStr[KEYRING_HELP_TEXT]);
}

function EnableKeyRing(fEnable: BOOLEAN): void {
  if (fEnable) {
    MSYS_EnableRegion(&gKeyRingPanel);
  } else {
    MSYS_DisableRegion(&gKeyRingPanel);
  }
}

function ShutdownKeyRingInterface(): void {
  MSYS_RemoveRegion(&gKeyRingPanel);
  return;
}

function DisableInvRegions(fDisable: BOOLEAN): void {
  let cnt: INT32;

  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    if (fDisable) {
      MSYS_DisableRegion(&gSMInvRegion[cnt]);
    } else {
      MSYS_EnableRegion(&gSMInvRegion[cnt]);
    }
  }

  if (fDisable) {
    MSYS_DisableRegion(&gSMInvCamoRegion);

    MSYS_DisableRegion(&gSM_SELMERCMoneyRegion);
    EnableKeyRing(FALSE);
  } else {
    MSYS_EnableRegion(&gSMInvCamoRegion);

    MSYS_EnableRegion(&gSM_SELMERCMoneyRegion);
    EnableKeyRing(TRUE);
  }
}

function ShutdownInvSlotInterface(): void {
  let cnt: UINT32;

  // Remove all body type panels
  DeleteVideoObjectFromIndex(guiBodyInvVO[0][0]);
  DeleteVideoObjectFromIndex(guiBodyInvVO[2][0]);
  DeleteVideoObjectFromIndex(guiBodyInvVO[1][0]);
  DeleteVideoObjectFromIndex(guiBodyInvVO[3][0]);
  DeleteVideoObjectFromIndex(guiBodyInvVO[0][1]);
  DeleteVideoObjectFromIndex(guiBodyInvVO[2][1]);
  DeleteVideoObjectFromIndex(guiBodyInvVO[1][1]);
  DeleteVideoObjectFromIndex(guiBodyInvVO[3][1]);

  DeleteVideoObjectFromIndex(guiGoldKeyVO);

  // Remove regions
  // Add regions for inventory slots
  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    // Remove region
    MSYS_RemoveRegion(&gSMInvRegion[cnt]);
  }

  // Remove cammo
  MSYS_RemoveRegion(&gSMInvCamoRegion);
}

function RenderInvBodyPanel(pSoldier: Pointer<SOLDIERTYPE>, sX: INT16, sY: INT16): void {
  // Blit body inv, based on body type
  let bSubImageIndex: INT8 = gbCompatibleApplyItem;

  BltVideoObjectFromIndex(guiSAVEBUFFER, guiBodyInvVO[pSoldier->ubBodyType][bSubImageIndex], 0, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL);
}

function HandleRenderInvSlots(pSoldier: Pointer<SOLDIERTYPE>, fDirtyLevel: UINT8): void {
  let cnt: INT32;
  /* static */ let pStr: INT16[] /* [150] */;

  if (InItemDescriptionBox() || InItemStackPopup() || InKeyRingPopup()) {
  } else {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      if (fDirtyLevel == DIRTYLEVEL2) {
        GetHelpTextForItem(pStr, &(pSoldier->inv[cnt]), pSoldier);

        SetRegionFastHelpText(&(gSMInvRegion[cnt]), pStr);
      }

      INVRenderINVPanelItem(pSoldier, cnt, fDirtyLevel);
    }

    if (KeyExistsInKeyRing(pSoldier, ANYKEY, NULL)) {
      // blit gold key here?
      if (guiCurrentItemDescriptionScreen != MAP_SCREEN) {
        BltVideoObjectFromIndex(guiSAVEBUFFER, guiGoldKeyVO, 0, 496, 446, VO_BLT_SRCTRANSPARENCY, NULL);
        RestoreExternBackgroundRect(496, 446, 29, 23);
      } else {
        BltVideoObjectFromIndex(guiSAVEBUFFER, guiGoldKeyVO, 0, 217, 271, VO_BLT_SRCTRANSPARENCY, NULL);
        RestoreExternBackgroundRect(217, 271, 29, 23);
      }
    }
  }
}

function INVRenderINVPanelItem(pSoldier: Pointer<SOLDIERTYPE>, sPocket: INT16, fDirtyLevel: UINT8): void {
  let sX: INT16;
  let sY: INT16;
  let sBarX: INT16;
  let sBarY: INT16;
  let pObject: Pointer<OBJECTTYPE>;
  let fOutline: BOOLEAN = FALSE;
  let sOutlineColor: INT16 = 0;
  let fRenderDirtyLevel: UINT8;
  let fHatchItOut: BOOLEAN = FALSE;

  // Assign the screen
  guiCurrentItemDescriptionScreen = guiCurrentScreen;

  pObject = &(pSoldier->inv[sPocket]);

  sX = gSMInvData[sPocket].sX;
  sY = gSMInvData[sPocket].sY;

  if (fDirtyLevel == DIRTYLEVEL2) {
    // CHECK FOR COMPATIBILITY WITH MAGAZINES

    /*	OLD VERSION OF GUN/AMMO MATCH HIGHLIGHTING
                    UINT32	uiDestPitchBYTES;
                    UINT8		*pDestBuf;
                    UINT16	usLineColor;

                    if ( ( Item [ pSoldier->inv[ HANDPOS ].usItem ].usItemClass & IC_GUN )  && ( Item[ pObject->usItem ].usItemClass & IC_AMMO ) )
                    {
                            // CHECK
                            if (Weapon[pSoldier->inv[ HANDPOS ].usItem].ubCalibre == Magazine[Item[pObject->usItem].ubClassIndex].ubCalibre )
                            {
                                    // IT's an OK calibre ammo, do something!
                                    // Render Item with specific color
                                    //fOutline = TRUE;
                                    //sOutlineColor = Get16BPPColor( FROMRGB( 96, 104, 128 ) );
                                    //sOutlineColor = Get16BPPColor( FROMRGB( 20, 20, 120 ) );

                                    // Draw rectangle!
                                    pDestBuf = LockVideoSurface( guiSAVEBUFFER, &uiDestPitchBYTES );
                                    SetClippingRegionAndImageWidth( uiDestPitchBYTES, 0, 0, 640, 480 );

                                    //usLineColor = Get16BPPColor( FROMRGB( 255, 255, 0 ) );
                                    usLineColor = Get16BPPColor( FROMRGB( 230, 215, 196 ) );
                                    RectangleDraw( TRUE, (sX+1), (sY+1), (sX + gSMInvData[ sPocket ].sWidth - 2 ),( sY + gSMInvData[ sPocket ].sHeight - 2 ), usLineColor, pDestBuf );

                                    SetClippingRegionAndImageWidth( uiDestPitchBYTES, 0, 0, 640, 480 );

                                    UnLockVideoSurface( guiSAVEBUFFER );
                            }
                    }
    */

    if (gbCompatibleAmmo[sPocket]) {
      fOutline = TRUE;
      sOutlineColor = Get16BPPColor(FROMRGB(255, 255, 255));
    }

    // IF it's the second hand and this hand cannot contain anything, remove the second hand position graphic
    if (sPocket == SECONDHANDPOS && Item[pSoldier->inv[HANDPOS].usItem].fFlags & ITEM_TWO_HANDED) {
      //			if( guiCurrentScreen != MAP_SCREEN )
      if (guiCurrentItemDescriptionScreen != MAP_SCREEN) {
        BltVideoObjectFromIndex(guiSAVEBUFFER, guiSecItemHiddenVO, 0, 217, 448, VO_BLT_SRCTRANSPARENCY, NULL);
        RestoreExternBackgroundRect(217, 448, 72, 28);
      } else {
        BltVideoObjectFromIndex(guiSAVEBUFFER, guiMapInvSecondHandBlockout, 0, 14, 218, VO_BLT_SRCTRANSPARENCY, NULL);
        RestoreExternBackgroundRect(14, 218, 102, 24);
      }
    }
  }

  // If we have a new item and we are in the right panel...
  if (pSoldier->bNewItemCount[sPocket] > 0 && gsCurInterfacePanel == SM_PANEL && fInterfacePanelDirty != DIRTYLEVEL2) {
    fRenderDirtyLevel = DIRTYLEVEL0;
    // fRenderDirtyLevel = fDirtyLevel;
  } else {
    fRenderDirtyLevel = fDirtyLevel;
  }

  // Now render as normal
  // INVRenderItem( guiSAVEBUFFER, pObject, (INT16)(sX + gSMInvData[ sPocket ].sSubX), (INT16)(sY + gSMInvData[ sPocket ].sSubY), gSMInvData[ sPocket ].sWidth, gSMInvData[ sPocket ].sHeight, fDirtyLevel, &(gfSM_HandInvDispText[ sPocket ] ) );
  INVRenderItem(guiSAVEBUFFER, pSoldier, pObject, sX, sY, gSMInvData[sPocket].sWidth, gSMInvData[sPocket].sHeight, fRenderDirtyLevel, NULL, 0, fOutline, sOutlineColor);

  if (gbInvalidPlacementSlot[sPocket]) {
    if (sPocket != SECONDHANDPOS) {
      // If we are in inv panel and our guy is not = cursor guy...
      if (!gfSMDisableForItems) {
        fHatchItOut = TRUE;
      }
    }
  }

  // if we are in the shop keeper interface
  if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
    if (ShouldSoldierDisplayHatchOnItem(pSoldier->ubProfile, sPocket) && !gbInvalidPlacementSlot[sPocket]) {
      fHatchItOut = TRUE;
    }
  }

  if (fHatchItOut) {
    let uiWhichBuffer: UINT32 = (guiCurrentItemDescriptionScreen == MAP_SCREEN) ? guiSAVEBUFFER : guiRENDERBUFFER;
    DrawHatchOnInventory(uiWhichBuffer, sX, sY, (gSMInvData[sPocket].sWidth - 1), (gSMInvData[sPocket].sHeight - 1));
  }

  // if there's an item in there
  if (pObject->usItem != NOTHING) {
    // Add item status bar
    sBarX = sX - gSMInvData[sPocket].sBarDx;
    sBarY = sY + gSMInvData[sPocket].sBarDy;
    DrawItemUIBarEx(pObject, 0, sBarX, sBarY, ITEM_BAR_WIDTH, ITEM_BAR_HEIGHT, Get16BPPColor(STATUS_BAR), Get16BPPColor(STATUS_BAR_SHADOW), TRUE, guiSAVEBUFFER);
  }
}

function CompatibleAmmoForGun(pTryObject: Pointer<OBJECTTYPE>, pTestObject: Pointer<OBJECTTYPE>): BOOLEAN {
  if ((Item[pTryObject->usItem].usItemClass & IC_AMMO)) {
    // CHECK
    if (Weapon[pTestObject->usItem].ubCalibre == Magazine[Item[pTryObject->usItem].ubClassIndex].ubCalibre) {
      return TRUE;
    }
  }
  return FALSE;
}

function CompatibleGunForAmmo(pTryObject: Pointer<OBJECTTYPE>, pTestObject: Pointer<OBJECTTYPE>): BOOLEAN {
  if ((Item[pTryObject->usItem].usItemClass & IC_GUN)) {
    // CHECK
    if (Weapon[pTryObject->usItem].ubCalibre == Magazine[Item[pTestObject->usItem].ubClassIndex].ubCalibre) {
      return TRUE;
    }
  }
  return FALSE;
}

function CompatibleItemForApplyingOnMerc(pTestObject: Pointer<OBJECTTYPE>): BOOLEAN {
  let usItem: UINT16 = pTestObject->usItem;

  // ATE: If in mapscreen, return false always....
  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    return FALSE;
  }

  // ATE: Would be nice to have flag here to check for these types....
  if (usItem == CAMOUFLAGEKIT || usItem == ADRENALINE_BOOSTER || usItem == REGEN_BOOSTER || usItem == SYRINGE_3 || usItem == SYRINGE_4 || usItem == SYRINGE_5 || usItem == ALCOHOL || usItem == WINE || usItem == BEER || usItem == CANTEEN || usItem == JAR_ELIXIR) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function SoldierContainsAnyCompatibleStuff(pSoldier: Pointer<SOLDIERTYPE>, pTestObject: Pointer<OBJECTTYPE>): BOOLEAN {
  let cnt: INT32;
  let pObject: Pointer<OBJECTTYPE>;

  if ((Item[pTestObject->usItem].usItemClass & IC_GUN)) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleAmmoForGun(pObject, pTestObject)) {
        return TRUE;
      }
    }
  }

  if ((Item[pTestObject->usItem].usItemClass & IC_AMMO)) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleGunForAmmo(pObject, pTestObject)) {
        return TRUE;
      }
    }
  }

  // ATE: Put attachment checking here.....

  return FALSE;
}

function HandleAnyMercInSquadHasCompatibleStuff(ubSquad: UINT8, pObject: Pointer<OBJECTTYPE>, fReset: BOOLEAN): void {
  let iCounter: INT32 = 0;

  if (ubSquad == NUMBER_OF_SQUADS) {
    return;
  }

  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (Squad[iCurrentTacticalSquad][iCounter] != NULL) {
      if (!fReset) {
        if (SoldierContainsAnyCompatibleStuff(Squad[iCurrentTacticalSquad][iCounter], pObject)) {
          // Get face and set value....
          gFacesData[Squad[iCurrentTacticalSquad][iCounter]->iFaceIndex].fCompatibleItems = TRUE;
        }
      } else {
        gFacesData[Squad[iCurrentTacticalSquad][iCounter]->iFaceIndex].fCompatibleItems = FALSE;
      }
    }
  }
}

function HandleCompatibleAmmoUIForMapScreen(pSoldier: Pointer<SOLDIERTYPE>, bInvPos: INT32, fOn: BOOLEAN, fFromMerc: BOOLEAN): BOOLEAN {
  let fFound: BOOLEAN = FALSE;
  let cnt: INT32;
  let pObject: Pointer<OBJECTTYPE>;
  let pTestObject: Pointer<OBJECTTYPE>;
  let fFoundAttachment: BOOLEAN = FALSE;

  if (fFromMerc == FALSE) {
    pTestObject = &(pInventoryPoolList[bInvPos].o);
  } else {
    if (bInvPos == NO_SLOT) {
      pTestObject = NULL;
    } else {
      pTestObject = &(pSoldier->inv[bInvPos]);
    }
  }

  // ATE: If pTest object is NULL, test only for existence of syringes, etc...
  if (pTestObject == NULL) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleItemForApplyingOnMerc(pObject)) {
        if (fOn != gbCompatibleAmmo[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        gbCompatibleAmmo[cnt] = fOn;
      }
    }

    if (gpItemPointer != NULL) {
      if (CompatibleItemForApplyingOnMerc(gpItemPointer)) {
        // OK, Light up portrait as well.....
        if (fOn) {
          gbCompatibleApplyItem = TRUE;
        } else {
          gbCompatibleApplyItem = FALSE;
        }

        fFound = TRUE;
      }
    }

    if (fFound) {
      fInterfacePanelDirty = DIRTYLEVEL2;
      // HandleRenderInvSlots( pSoldier, DIRTYLEVEL2 );
    }

    return fFound;
  }

  if ((!Item[pTestObject->usItem].fFlags & ITEM_HIDDEN_ADDON)) {
    // First test attachments, which almost any type of item can have....
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (Item[pObject->usItem].fFlags & ITEM_HIDDEN_ADDON) {
        // don't consider for UI purposes
        continue;
      }

      if (ValidAttachment(pObject->usItem, pTestObject->usItem) || ValidAttachment(pTestObject->usItem, pObject->usItem) || ValidLaunchable(pTestObject->usItem, pObject->usItem) || ValidLaunchable(pObject->usItem, pTestObject->usItem)) {
        fFoundAttachment = TRUE;

        if (fOn != gbCompatibleAmmo[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        gbCompatibleAmmo[cnt] = fOn;
      }
    }
  }

  if ((Item[pTestObject->usItem].usItemClass & IC_GUN)) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleAmmoForGun(pObject, pTestObject)) {
        if (fOn != gbCompatibleAmmo[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        gbCompatibleAmmo[cnt] = fOn;
      }
    }
  } else if ((Item[pTestObject->usItem].usItemClass & IC_AMMO)) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleGunForAmmo(pObject, pTestObject)) {
        if (fOn != gbCompatibleAmmo[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        gbCompatibleAmmo[cnt] = fOn;
      }
    }
  }

  return fFound;
}

function HandleCompatibleAmmoUIForMapInventory(pSoldier: Pointer<SOLDIERTYPE>, bInvPos: INT32, iStartSlotNumber: INT32, fOn: BOOLEAN, fFromMerc: BOOLEAN): BOOLEAN {
  // CJC: ATE, needs fixing here!

  let fFound: BOOLEAN = FALSE;
  let cnt: INT32;
  let pObject: Pointer<OBJECTTYPE>;
  let pTestObject: Pointer<OBJECTTYPE>;
  let fFoundAttachment: BOOLEAN = FALSE;

  if (fFromMerc == FALSE) {
    pTestObject = &(pInventoryPoolList[iStartSlotNumber + bInvPos].o);
  } else {
    if (bInvPos == NO_SLOT) {
      pTestObject = NULL;
    } else {
      pTestObject = &(pSoldier->inv[bInvPos]);
    }
  }

  // First test attachments, which almost any type of item can have....
  for (cnt = 0; cnt < MAP_INVENTORY_POOL_SLOT_COUNT; cnt++) {
    pObject = &(pInventoryPoolList[iStartSlotNumber + cnt].o);

    if (Item[pObject->usItem].fFlags & ITEM_HIDDEN_ADDON) {
      // don't consider for UI purposes
      continue;
    }

    if (ValidAttachment(pObject->usItem, pTestObject->usItem) || ValidAttachment(pTestObject->usItem, pObject->usItem) || ValidLaunchable(pTestObject->usItem, pObject->usItem) || ValidLaunchable(pObject->usItem, pTestObject->usItem)) {
      fFoundAttachment = TRUE;

      if (fOn != fMapInventoryItemCompatable[cnt]) {
        fFound = TRUE;
      }

      // IT's an OK calibere ammo, do something!
      // Render Item with specific color
      fMapInventoryItemCompatable[cnt] = fOn;
    }
  }

  if ((Item[pTestObject->usItem].usItemClass & IC_GUN)) {
    for (cnt = 0; cnt < MAP_INVENTORY_POOL_SLOT_COUNT; cnt++) {
      pObject = &(pInventoryPoolList[iStartSlotNumber + cnt].o);

      if (CompatibleAmmoForGun(pObject, pTestObject)) {
        if (fOn != fMapInventoryItemCompatable[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        fMapInventoryItemCompatable[cnt] = fOn;
      }
    }
  } else if ((Item[pTestObject->usItem].usItemClass & IC_AMMO)) {
    for (cnt = 0; cnt < MAP_INVENTORY_POOL_SLOT_COUNT; cnt++) {
      pObject = &(pInventoryPoolList[iStartSlotNumber + cnt].o);

      if (CompatibleGunForAmmo(pObject, pTestObject)) {
        if (fOn != fMapInventoryItemCompatable[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        fMapInventoryItemCompatable[cnt] = fOn;
      }
    }
  }

  return fFound;
}

function InternalHandleCompatibleAmmoUI(pSoldier: Pointer<SOLDIERTYPE>, pTestObject: Pointer<OBJECTTYPE>, fOn: BOOLEAN): BOOLEAN {
  let fFound: BOOLEAN = FALSE;
  let cnt: INT32;
  let pObject: Pointer<OBJECTTYPE>;
  let fFoundAttachment: BOOLEAN = FALSE;

  // ATE: If pTest object is NULL, test only for existence of syringes, etc...
  if (pTestObject == NULL) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleItemForApplyingOnMerc(pObject)) {
        if (fOn != gbCompatibleAmmo[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        gbCompatibleAmmo[cnt] = fOn;
      }
    }

    if (gpItemPointer != NULL) {
      if (CompatibleItemForApplyingOnMerc(gpItemPointer)) {
        // OK, Light up portrait as well.....
        if (fOn) {
          gbCompatibleApplyItem = TRUE;
        } else {
          gbCompatibleApplyItem = FALSE;
        }

        fFound = TRUE;
      }
    }

    if (fFound) {
      fInterfacePanelDirty = DIRTYLEVEL2;
      // HandleRenderInvSlots( pSoldier, DIRTYLEVEL2 );
    }

    return fFound;
  }

  // First test attachments, which almost any type of item can have....
  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    pObject = &(pSoldier->inv[cnt]);

    if (Item[pObject->usItem].fFlags & ITEM_HIDDEN_ADDON) {
      // don't consider for UI purposes
      continue;
    }

    if (ValidAttachment(pObject->usItem, pTestObject->usItem) || ValidAttachment(pTestObject->usItem, pObject->usItem) || ValidLaunchable(pTestObject->usItem, pObject->usItem) || ValidLaunchable(pObject->usItem, pTestObject->usItem)) {
      fFoundAttachment = TRUE;

      if (fOn != gbCompatibleAmmo[cnt]) {
        fFound = TRUE;
      }

      // IT's an OK calibere ammo, do something!
      // Render Item with specific color
      gbCompatibleAmmo[cnt] = fOn;
    }
  }

  // if ( !fFoundAttachment )
  //{
  if ((Item[pTestObject->usItem].usItemClass & IC_GUN)) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleAmmoForGun(pObject, pTestObject)) {
        if (fOn != gbCompatibleAmmo[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        gbCompatibleAmmo[cnt] = fOn;
      }
    }
  }

  else if ((Item[pTestObject->usItem].usItemClass & IC_AMMO)) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      pObject = &(pSoldier->inv[cnt]);

      if (CompatibleGunForAmmo(pObject, pTestObject)) {
        if (fOn != gbCompatibleAmmo[cnt]) {
          fFound = TRUE;
        }

        // IT's an OK calibere ammo, do something!
        // Render Item with specific color
        gbCompatibleAmmo[cnt] = fOn;
      }
    }
  } else if (CompatibleItemForApplyingOnMerc(pTestObject)) {
    // If we are currently NOT in the Shopkeeper interface
    if (!(guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE)) {
      fFound = TRUE;
      gbCompatibleApplyItem = fOn;
    }
  }
  //}

  if (!fFound) {
    for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
      if (gbCompatibleAmmo[cnt]) {
        fFound = TRUE;
        gbCompatibleAmmo[cnt] = FALSE;
      }

      if (gbCompatibleApplyItem) {
        fFound = TRUE;
        gbCompatibleApplyItem = FALSE;
      }
    }
  }

  if (fFound) {
    fInterfacePanelDirty = DIRTYLEVEL2;
    // HandleRenderInvSlots( pSoldier, DIRTYLEVEL2 );
  }

  return fFound;
}

function ResetCompatibleItemArray(): void {
  let cnt: INT32 = 0;

  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    if (gbCompatibleAmmo[cnt]) {
      gbCompatibleAmmo[cnt] = FALSE;
    }
  }
}

function HandleCompatibleAmmoUI(pSoldier: Pointer<SOLDIERTYPE>, bInvPos: INT8, fOn: BOOLEAN): BOOLEAN {
  let cnt: INT32;
  let pTestObject: Pointer<OBJECTTYPE>;
  let fFound: BOOLEAN = FALSE;

  // if we are in the shopkeeper interface
  if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
    // if the inventory position is -1, this is a flag from the Shopkeeper interface screen
    // indicating that we are to use a different object to do the search
    if (bInvPos == -1) {
      if (fOn) {
        if (gpHighLightedItemObject) {
          pTestObject = gpHighLightedItemObject;
          //					gubSkiDirtyLevel = SKI_DIRTY_LEVEL2;
        } else
          return FALSE;
      } else {
        gpHighLightedItemObject = NULL;

        for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
          if (gbCompatibleAmmo[cnt]) {
            fFound = TRUE;
            gbCompatibleAmmo[cnt] = FALSE;
          }
        }

        gubSkiDirtyLevel = SKI_DIRTY_LEVEL1;
        return TRUE;
      }
    } else {
      if (fOn) {
        pTestObject = &(pSoldier->inv[bInvPos]);
        gpHighLightedItemObject = pTestObject;
      } else {
        pTestObject = &(pSoldier->inv[bInvPos]);
        gpHighLightedItemObject = NULL;
        gubSkiDirtyLevel = SKI_DIRTY_LEVEL1;
      }
    }
  } else {
    //		if( fOn )

    if (bInvPos == NO_SLOT) {
      pTestObject = NULL;
    } else {
      pTestObject = &(pSoldier->inv[bInvPos]);
    }
  }

  return InternalHandleCompatibleAmmoUI(pSoldier, pTestObject, fOn);
}

function GetSlotInvXY(ubPos: UINT8, psX: Pointer<INT16>, psY: Pointer<INT16>): void {
  *psX = gSMInvData[ubPos].sX;
  *psY = gSMInvData[ubPos].sY;
}

function GetSlotInvHeightWidth(ubPos: UINT8, psWidth: Pointer<INT16>, psHeight: Pointer<INT16>): void {
  *psWidth = gSMInvData[ubPos].sWidth;
  *psHeight = gSMInvData[ubPos].sHeight;
}

function HandleNewlyAddedItems(pSoldier: Pointer<SOLDIERTYPE>, fDirtyLevel: Pointer<BOOLEAN>): void {
  let cnt: UINT32;
  let sX: INT16;
  let sY: INT16;
  let pObject: Pointer<OBJECTTYPE>;

  // If item description up.... stop
  if (gfInItemDescBox) {
    return;
  }

  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    if (pSoldier->bNewItemCount[cnt] == -2) {
      // Stop
      *fDirtyLevel = DIRTYLEVEL2;
      pSoldier->bNewItemCount[cnt] = 0;
    }

    if (pSoldier->bNewItemCount[cnt] > 0) {
      sX = gSMInvData[cnt].sX;
      sY = gSMInvData[cnt].sY;

      pObject = &(pSoldier->inv[cnt]);

      if (pObject->usItem == NOTHING) {
        gbNewItem[cnt] = 0;
        continue;
      }

      INVRenderItem(guiSAVEBUFFER, pSoldier, pObject, sX, sY, gSMInvData[cnt].sWidth, gSMInvData[cnt].sHeight, DIRTYLEVEL2, NULL, 0, TRUE, us16BPPItemCyclePlacedItemColors[pSoldier->bNewItemCycleCount[cnt]]);
    }
  }
}

function CheckForAnyNewlyAddedItems(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: UINT32;

  // OK, l0ok for any new...
  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    if (pSoldier->bNewItemCount[cnt] == -1) {
      pSoldier->bNewItemCount[cnt] = NEW_ITEM_CYCLES - 1;
    }
  }
}

function DegradeNewlyAddedItems(): void {
  let uiTime: UINT32;
  let cnt: UINT32;
  let cnt2: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // If time done
  uiTime = GetJA2Clock();

  if ((uiTime - guiNewlyPlacedItemTimer) > 100) {
    guiNewlyPlacedItemTimer = uiTime;

    for (cnt2 = 0; cnt2 < NUM_TEAM_SLOTS; cnt2++) {
      // GET SOLDIER
      if (gTeamPanel[cnt2].fOccupied) {
        pSoldier = MercPtrs[gTeamPanel[cnt2].ubID];

        for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
          if (pSoldier->bNewItemCount[cnt] > 0) {
            // Decrement all the time!
            pSoldier->bNewItemCycleCount[cnt]--;

            if (pSoldier->bNewItemCycleCount[cnt] == 0) {
              // OK, cycle down....
              pSoldier->bNewItemCount[cnt]--;

              if (pSoldier->bNewItemCount[cnt] == 0) {
                // Stop...
                pSoldier->bNewItemCount[cnt] = -2;
              } else {
                // Reset!
                pSoldier->bNewItemCycleCount[cnt] = NEW_ITEM_CYCLE_COUNT;
                continue;
              }
            }
          }
        }
      }
    }
  }
}

function InitItemInterface(): void {
  let cnt: UINT32;
  let cnt2: UINT32;

  for (cnt = 0, cnt2 = 0; cnt2 < 20; cnt += 3, cnt2++) {
    us16BPPItemCyclePlacedItemColors[cnt2] = Get16BPPColor(FROMRGB(ubRGBItemCyclePlacedItemColors[cnt], ubRGBItemCyclePlacedItemColors[cnt + 1], ubRGBItemCyclePlacedItemColors[cnt + 2]));
  }
}

function INVRenderItem(uiBuffer: UINT32, pSoldier: Pointer<SOLDIERTYPE>, pObject: Pointer<OBJECTTYPE>, sX: INT16, sY: INT16, sWidth: INT16, sHeight: INT16, fDirtyLevel: UINT8, pubHighlightCounter: Pointer<UINT8>, ubStatusIndex: UINT8, fOutline: BOOLEAN, sOutlineColor: INT16): void {
  let uiStringLength: UINT16;
  let pItem: Pointer<INVTYPE>;
  let pTrav: Pointer<ETRLEObject>;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let sCenX: INT16;
  let sCenY: INT16;
  let sNewY: INT16;
  let sNewX: INT16;
  let hVObject: HVOBJECT;
  let fLineSplit: BOOLEAN = FALSE;
  let sFontX2: INT16;
  let sFontY2: INT16;
  let sFontX: INT16;
  let sFontY: INT16;

  /* static */ let pStr: INT16[] /* [100] */;
  /* static */ let pStr2: INT16[] /* [100] */;

  if (pObject->usItem == NOTHING) {
    return;
  }

  if (ubStatusIndex < RENDER_ITEM_ATTACHMENT1) {
    pItem = &Item[pObject->usItem];
  } else {
    pItem = &Item[pObject->usAttachItem[ubStatusIndex - RENDER_ITEM_ATTACHMENT1]];
  }

  if (fDirtyLevel == DIRTYLEVEL2) {
    // TAKE A LOOK AT THE VIDEO OBJECT SIZE ( ONE OF TWO SIZES ) AND CENTER!
    GetVideoObject(&hVObject, GetInterfaceGraphicForItem(pItem));
    pTrav = &(hVObject->pETRLEObject[pItem->ubGraphicNum]);
    usHeight = pTrav->usHeight;
    usWidth = pTrav->usWidth;

    // CENTER IN SLOT!
    // CANCEL OFFSETS!
    sCenX = sX + (abs(sWidth - usWidth) / 2) - pTrav->sOffsetX;
    sCenY = sY + (abs(sHeight - usHeight) / 2) - pTrav->sOffsetY;

    // Shadow area
    BltVideoObjectOutlineShadowFromIndex(uiBuffer, GetInterfaceGraphicForItem(pItem), pItem->ubGraphicNum, sCenX - 2, sCenY + 2);

    BltVideoObjectOutlineFromIndex(uiBuffer, GetInterfaceGraphicForItem(pItem), pItem->ubGraphicNum, sCenX, sCenY, sOutlineColor, fOutline);

    if (uiBuffer == FRAME_BUFFER) {
      InvalidateRegion(sX, sY, (sX + sWidth), (sY + sHeight));
    } else {
      RestoreExternBackgroundRect(sX, sY, sWidth, sHeight);
    }
  }

  SetFont(ITEM_FONT);

  if (fDirtyLevel != DIRTYLEVEL0) {
    if (ubStatusIndex < RENDER_ITEM_ATTACHMENT1) {
      SetFontBackground(FONT_MCOLOR_BLACK);
      SetFontForeground(FONT_MCOLOR_DKGRAY);

      // FIRST DISPLAY FREE ROUNDS REMIANING
      if (pItem->usItemClass == IC_GUN && pObject->usItem != ROCKET_LAUNCHER) {
        sNewY = sY + sHeight - 10;
        sNewX = sX + 1;

        switch (pObject->ubGunAmmoType) {
          case AMMO_AP:
          case AMMO_SUPER_AP:
            SetFontForeground(ITEMDESC_FONTAPFORE);
            break;
          case AMMO_HP:
            SetFontForeground(ITEMDESC_FONTHPFORE);
            break;
          case AMMO_BUCKSHOT:
            SetFontForeground(ITEMDESC_FONTBSFORE);
            break;
          case AMMO_HE:
            SetFontForeground(ITEMDESC_FONTHEFORE);
            break;
          case AMMO_HEAT:
            SetFontForeground(ITEMDESC_FONTHEAPFORE);
            break;
          default:
            SetFontForeground(FONT_MCOLOR_DKGRAY);
            break;
        }

        swprintf(pStr, L"%d", pObject->ubGunShotsLeft);
        if (uiBuffer == guiSAVEBUFFER) {
          RestoreExternBackgroundRect(sNewX, sNewY, 20, 15);
        }
        mprintf(sNewX, sNewY, pStr);
        gprintfinvalidate(sNewX, sNewY, pStr);

        SetFontForeground(FONT_MCOLOR_DKGRAY);

        // Display 'JAMMED' if we are jammed
        if (pObject->bGunAmmoStatus < 0) {
          SetFontForeground(FONT_MCOLOR_RED);

          if (sWidth >= (BIG_INV_SLOT_WIDTH - 10)) {
            swprintf(pStr, TacticalStr[JAMMED_ITEM_STR]);
          } else {
            swprintf(pStr, TacticalStr[SHORT_JAMMED_GUN]);
          }

          VarFindFontCenterCoordinates(sX, sY, sWidth, sHeight, ITEM_FONT, &sNewX, &sNewY, pStr);

          mprintf(sNewX, sNewY, pStr);
          gprintfinvalidate(sNewX, sNewY, pStr);
        }
      } else {
        if (ubStatusIndex != RENDER_ITEM_NOSTATUS) {
          // Now display # of items
          if (pObject->ubNumberOfObjects > 1) {
            SetFontForeground(FONT_GRAY4);

            sNewY = sY + sHeight - 10;
            swprintf(pStr, L"%d", pObject->ubNumberOfObjects);

            // Get length of string
            uiStringLength = StringPixLength(pStr, ITEM_FONT);

            sNewX = sX + sWidth - uiStringLength - 4;

            if (uiBuffer == guiSAVEBUFFER) {
              RestoreExternBackgroundRect(sNewX, sNewY, 15, 15);
            }
            mprintf(sNewX, sNewY, pStr);
            gprintfinvalidate(sNewX, sNewY, pStr);
          }
        }
      }

      if (ItemHasAttachments(pObject)) {
        if (FindAttachment(pObject, UNDER_GLAUNCHER) == NO_SLOT) {
          SetFontForeground(FONT_GREEN);
        } else {
          SetFontForeground(FONT_YELLOW);
        }

        sNewY = sY;
        swprintf(pStr, L"*");

        // Get length of string
        uiStringLength = StringPixLength(pStr, ITEM_FONT);

        sNewX = sX + sWidth - uiStringLength - 4;

        if (uiBuffer == guiSAVEBUFFER) {
          RestoreExternBackgroundRect(sNewX, sNewY, 15, 15);
        }
        mprintf(sNewX, sNewY, pStr);
        gprintfinvalidate(sNewX, sNewY, pStr);
      }

      if (pSoldier && pObject == &(pSoldier->inv[HANDPOS]) && (Item[pSoldier->inv[HANDPOS].usItem].usItemClass == IC_GUN) && pSoldier->bWeaponMode != WM_NORMAL) {
        SetFontForeground(FONT_DKRED);

        sNewY = sY + 13; // rather arbitrary
        if (pSoldier->bWeaponMode == WM_BURST) {
          swprintf(pStr, L"*");
        } else {
          swprintf(pStr, L"+");
        }

        // Get length of string
        uiStringLength = StringPixLength(pStr, ITEM_FONT);

        sNewX = sX + sWidth - uiStringLength - 4;

        if (uiBuffer == guiSAVEBUFFER) {
          RestoreExternBackgroundRect(sNewX, sNewY, 15, 15);
        }
        mprintf(sNewX, sNewY, pStr);
        gprintfinvalidate(sNewX, sNewY, pStr);
      }
    }
  }

  if (pubHighlightCounter != NULL) {
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_LTGRAY);

    // DO HIGHLIGHT
    if (*pubHighlightCounter) {
      // Set string
      if (ubStatusIndex < RENDER_ITEM_ATTACHMENT1) {
        swprintf(pStr, L"%s", ShortItemNames[pObject->usItem]);
      } else {
        swprintf(pStr, L"%s", ShortItemNames[pObject->usAttachItem[ubStatusIndex - RENDER_ITEM_ATTACHMENT1]]);
      }

      fLineSplit = WrapString(pStr, pStr2, WORD_WRAP_INV_WIDTH, ITEM_FONT);

      VarFindFontCenterCoordinates(sX, sY, sWidth, sHeight, ITEM_FONT, &sFontX, &sFontY, pStr);
      sFontY = sY + 1;
      gprintfinvalidate(sFontX, sFontY, pStr);

      if (fLineSplit) {
        VarFindFontCenterCoordinates(sX, sY, sWidth, sHeight, ITEM_FONT, &sFontX2, &sFontY2, pStr2);
        sFontY2 = sY + 13;
        gprintfinvalidate(sFontX2, sFontY2, pStr2);
      }
    }

    if (*pubHighlightCounter == 2) {
      mprintf(sFontX, sFontY, pStr);

      if (fLineSplit) {
        mprintf(sFontX2, sFontY2, pStr2);
      }
    } else if (*pubHighlightCounter == 1) {
      *pubHighlightCounter = 0;
      gprintfRestore(sFontX, sFontY, pStr);

      if (fLineSplit) {
        gprintfRestore(sFontX2, sFontY2, pStr2);
      }
    }
  }
}

function InItemDescriptionBox(): BOOLEAN {
  return gfInItemDescBox;
}

function CycleItemDescriptionItem(): void {
  let usOldItem: INT16;

  // Delete old box...
  DeleteItemDescriptionBox();

  // Make new item....
  usOldItem = gpItemDescSoldier->inv[HANDPOS].usItem;

  if (_KeyDown(SHIFT)) {
    usOldItem--;

    if (usOldItem < 0) {
      usOldItem = MAXITEMS - 1;
    }
  } else {
    usOldItem++;

    if (usOldItem > MAXITEMS) {
      usOldItem = 0;
    }
  }

  CreateItem(usOldItem, 100, &(gpItemDescSoldier->inv[HANDPOS]));

  InternalInitItemDescriptionBox(&(gpItemDescSoldier->inv[HANDPOS]), 214, (INV_INTERFACE_START_Y + 1), gubItemDescStatusIndex, gpItemDescSoldier);
}

function InitItemDescriptionBox(pSoldier: Pointer<SOLDIERTYPE>, ubPosition: UINT8, sX: INT16, sY: INT16, ubStatusIndex: UINT8): BOOLEAN {
  let pObject: Pointer<OBJECTTYPE>;

  // DEF:
  // if we are in the shopkeeper screen, and we are to use the
  if (guiCurrentScreen == SHOPKEEPER_SCREEN && ubPosition == 255) {
    pObject = pShopKeeperItemDescObject;
  }

  // else use item from the hand position
  else {
    pObject = &(pSoldier->inv[ubPosition]);
  }

  return InternalInitItemDescriptionBox(pObject, sX, sY, ubStatusIndex, pSoldier);
}

function InitKeyItemDescriptionBox(pSoldier: Pointer<SOLDIERTYPE>, ubPosition: UINT8, sX: INT16, sY: INT16, ubStatusIndex: UINT8): BOOLEAN {
  let pObject: Pointer<OBJECTTYPE>;

  AllocateObject(&pObject);
  CreateKeyObject(pObject, pSoldier->pKeyRing[ubPosition].ubNumber, pSoldier->pKeyRing[ubPosition].ubKeyID);

  return InternalInitItemDescriptionBox(pObject, sX, sY, ubStatusIndex, pSoldier);
}

function InternalInitItemDescriptionBox(pObject: Pointer<OBJECTTYPE>, sX: INT16, sY: INT16, ubStatusIndex: UINT8, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let ubString: UINT8[] /* [48] */;
  let cnt: INT32;
  let pStr: INT16[] /* [10] */;
  let usX: UINT16;
  let usY: UINT16;
  let sForeColour: INT16;
  let sProsConsIndent: INT16;

  // Set the current screen
  guiCurrentItemDescriptionScreen = guiCurrentScreen;

  // Set X, Y
  gsInvDescX = sX;
  gsInvDescY = sY;

  gpItemDescObject = pObject;
  gubItemDescStatusIndex = ubStatusIndex;
  gpItemDescSoldier = pSoldier;
  fItemDescDelete = FALSE;

  // Build a mouse region here that is over any others.....
  if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
    // return( FALSE );

    MSYS_DefineRegion(&gInvDesc, gsInvDescX, gsInvDescY, (gsInvDescX + MAP_ITEMDESC_WIDTH), (gsInvDescY + MAP_ITEMDESC_HEIGHT), MSYS_PRIORITY_HIGHEST - 2, CURSOR_NORMAL, MSYS_NO_CALLBACK, ItemDescCallback);
    MSYS_AddRegion(&gInvDesc);

    giMapInvDescButtonImage = LoadButtonImage("INTERFACE\\itemdescdonebutton.sti", -1, 0, -1, 1, -1);

    // create button
    giMapInvDescButton = QuickCreateButton(giMapInvDescButtonImage, (gsInvDescX + 204), (gsInvDescY + 107), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, BtnGenericMouseMoveButtonCallback, ItemDescDoneButtonCallback);

    fShowDescriptionFlag = TRUE;
  } else {
    MSYS_DefineRegion(&gInvDesc, gsInvDescX, gsInvDescY, (gsInvDescX + ITEMDESC_WIDTH), (gsInvDescY + ITEMDESC_HEIGHT), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemDescCallback);
    MSYS_AddRegion(&gInvDesc);
  }
  // Add region
  if ((Item[pObject->usItem].usItemClass & IC_GUN) && pObject->usItem != ROCKET_LAUNCHER) {
    // Add button
    //    if( guiCurrentScreen != MAP_SCREEN )
    // if( guiCurrentItemDescriptionScreen != MAP_SCREEN )
    swprintf(pStr, L"%d/%d", gpItemDescObject->ubGunShotsLeft, Weapon[gpItemDescObject->usItem].ubMagSize);
    FilenameForBPP("INTERFACE\\infobox.sti", ubString);
    sForeColour = ITEMDESC_AMMO_FORE;

    switch (pObject->ubGunAmmoType) {
      case AMMO_AP:
      case AMMO_SUPER_AP:
        // sForeColour = ITEMDESC_FONTAPFORE;
        giItemDescAmmoButtonImages = LoadButtonImage(ubString, 8, 5, -1, 7, -1);
        break;
      case AMMO_HP:
        // sForeColour = ITEMDESC_FONTHPFORE;

        giItemDescAmmoButtonImages = LoadButtonImage(ubString, 12, 9, -1, 11, -1);
        break;
      default:
        // sForeColour = FONT_MCOLOR_WHITE;
        giItemDescAmmoButtonImages = LoadButtonImage(ubString, 4, 1, -1, 3, -1);
        break;
    }

    if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
      // in mapscreen, move over a bit
      giItemDescAmmoButton = CreateIconAndTextButton(giItemDescAmmoButtonImages, pStr, TINYFONT1, sForeColour, FONT_MCOLOR_BLACK, sForeColour, FONT_MCOLOR_BLACK, TEXT_CJUSTIFIED, (ITEMDESC_AMMO_X + 18), (ITEMDESC_AMMO_Y - 5), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, ItemDescAmmoCallback);
    } else {
      // not in mapscreen
      giItemDescAmmoButton = CreateIconAndTextButton(giItemDescAmmoButtonImages, pStr, TINYFONT1, sForeColour, FONT_MCOLOR_BLACK, sForeColour, FONT_MCOLOR_BLACK, TEXT_CJUSTIFIED, (ITEMDESC_AMMO_X), (ITEMDESC_AMMO_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, ItemDescAmmoCallback);

      // if we are being called from the
    }
    // if we are being init from the shop keeper screen and this is a dealer item we are getting info from
    if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE && pShopKeeperItemDescObject != NULL) {
      // disable the eject button
      SpecifyDisabledButtonStyle(giItemDescAmmoButton, DISABLED_STYLE_HATCHED);

      DisableButton(giItemDescAmmoButton);
      SetButtonFastHelpText(giItemDescAmmoButton, L"\0");
    } else
      SetButtonFastHelpText(giItemDescAmmoButton, Message[STR_EJECT_AMMO]);

    FindFontCenterCoordinates(ITEMDESC_AMMO_TEXT_X, ITEMDESC_AMMO_TEXT_Y, ITEMDESC_AMMO_TEXT_WIDTH, GetFontHeight(TINYFONT1), pStr, TINYFONT1, &usX, &usY);

    SpecifyButtonTextOffsets(giItemDescAmmoButton, usX, usY, TRUE);

    gfItemAmmoDown = FALSE;
  }

  if (ITEM_PROS_AND_CONS(gpItemDescObject->usItem)) {
    if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
      sProsConsIndent = __max(StringPixLength(gzProsLabel, ITEMDESC_FONT), StringPixLength(gzConsLabel, ITEMDESC_FONT)) + 10;
      for (cnt = 0; cnt < 2; cnt++) {
        // Add region for pros/cons help text
        MSYS_DefineRegion(&gProsAndConsRegions[cnt], (ITEMDESC_PROS_START_X + sProsConsIndent), (gsInvDescY + gMapItemDescProsConsRects[cnt].iTop), (gsInvDescX + gMapItemDescProsConsRects[cnt].iRight), (gsInvDescY + gMapItemDescProsConsRects[cnt].iBottom), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemDescCallback);

        MSYS_AddRegion(&gProsAndConsRegions[cnt]);

        if (cnt == 0) {
          wcscpy(gzFullItemPros, gzProsLabel);
          wcscat(gzFullItemPros, L" ");
          // use temp variable to prevent an initial comma from being displayed
          GenerateProsString(gzFullItemTemp, gpItemDescObject, 1000);
          wcscat(gzFullItemPros, gzFullItemTemp);
          SetRegionFastHelpText(&(gProsAndConsRegions[cnt]), gzFullItemPros);
        } else {
          wcscpy(gzFullItemCons, gzConsLabel);
          wcscat(gzFullItemCons, L" ");
          // use temp variable to prevent an initial comma from being displayed
          GenerateConsString(gzFullItemTemp, gpItemDescObject, 1000);
          wcscat(gzFullItemCons, gzFullItemTemp);
          SetRegionFastHelpText(&(gProsAndConsRegions[cnt]), gzFullItemCons);
        }
        SetRegionHelpEndCallback(&(gProsAndConsRegions[cnt]), HelpTextDoneCallback);
      }
    } else {
      sProsConsIndent = __max(StringPixLength(gzProsLabel, ITEMDESC_FONT), StringPixLength(gzConsLabel, ITEMDESC_FONT)) + 10;
      for (cnt = 0; cnt < 2; cnt++) {
        // Add region for pros/cons help text
        MSYS_DefineRegion(&gProsAndConsRegions[cnt], (ITEMDESC_PROS_START_X + sProsConsIndent), (gsInvDescY + gItemDescProsConsRects[cnt].iTop), (gsInvDescX + gItemDescProsConsRects[cnt].iRight), (gsInvDescY + gItemDescProsConsRects[cnt].iBottom), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemDescCallback);

        MSYS_AddRegion(&gProsAndConsRegions[cnt]);

        if (cnt == 0) {
          wcscpy(gzFullItemPros, gzProsLabel);
          wcscat(gzFullItemPros, L" ");
          // use temp variable to prevent an initial comma from being displayed
          GenerateProsString(gzFullItemTemp, gpItemDescObject, 1000);
          wcscat(gzFullItemPros, gzFullItemTemp);
          SetRegionFastHelpText(&(gProsAndConsRegions[cnt]), gzFullItemPros);
        } else {
          wcscpy(gzFullItemCons, gzConsLabel);
          wcscat(gzFullItemCons, L" ");
          // use temp variable to prevent an initial comma from being displayed
          GenerateConsString(gzFullItemTemp, gpItemDescObject, 1000);
          wcscat(gzFullItemCons, gzFullItemTemp);
          SetRegionFastHelpText(&(gProsAndConsRegions[cnt]), gzFullItemCons);
        }
        SetRegionHelpEndCallback(&(gProsAndConsRegions[cnt]), HelpTextDoneCallback);
      }
    }
  }

  // Load graphic
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(VObjectDesc.ImageFile, "INTERFACE\\infobox.sti");
  CHECKF(AddVideoObject(&VObjectDesc, &guiItemDescBox));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(VObjectDesc.ImageFile, "INTERFACE\\iteminfoc.STI");
  CHECKF(AddVideoObject(&VObjectDesc, &guiMapItemDescBox));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(VObjectDesc.ImageFile, "INTERFACE\\bullet.STI");
  CHECKF(AddVideoObject(&VObjectDesc, &guiBullet));

  if (gpItemDescObject->usItem != MONEY) {
    for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
      // Build a mouse region here that is over any others.....
      //			if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN )
      if (guiCurrentItemDescriptionScreen == MAP_SCREEN)
        MSYS_DefineRegion(&gItemDescAttachmentRegions[cnt], (gsInvDescX + gMapItemDescAttachmentsXY[cnt].sX), (gsInvDescY + gMapItemDescAttachmentsXY[cnt].sY), (gsInvDescX + gMapItemDescAttachmentsXY[cnt].sX + gMapItemDescAttachmentsXY[cnt].sWidth), (gsInvDescY + gMapItemDescAttachmentsXY[cnt].sY + gMapItemDescAttachmentsXY[cnt].sHeight), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemDescAttachmentsCallback);
      else
        MSYS_DefineRegion(&gItemDescAttachmentRegions[cnt], (gsInvDescX + gItemDescAttachmentsXY[cnt].sX), (gsInvDescY + gItemDescAttachmentsXY[cnt].sY), (gsInvDescX + gItemDescAttachmentsXY[cnt].sX + gItemDescAttachmentsXY[cnt].sBarDx + gItemDescAttachmentsXY[cnt].sWidth), (gsInvDescY + gItemDescAttachmentsXY[cnt].sY + gItemDescAttachmentsXY[cnt].sHeight), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemDescAttachmentsCallback);
      // Add region
      MSYS_AddRegion(&gItemDescAttachmentRegions[cnt]);
      MSYS_SetRegionUserData(&gItemDescAttachmentRegions[cnt], 0, cnt);

      if (gpItemDescObject->usAttachItem[cnt] != NOTHING) {
        SetRegionFastHelpText(&(gItemDescAttachmentRegions[cnt]), ItemNames[gpItemDescObject->usAttachItem[cnt]]);
        SetRegionHelpEndCallback(&(gItemDescAttachmentRegions[cnt]), HelpTextDoneCallback);
      } else {
        SetRegionFastHelpText(&(gItemDescAttachmentRegions[cnt]), Message[STR_ATTACHMENTS]);
        SetRegionHelpEndCallback(&(gItemDescAttachmentRegions[cnt]), HelpTextDoneCallback);
      }
    }
  } else {
    memset(&gRemoveMoney, 0, sizeof(REMOVE_MONEY));
    gRemoveMoney.uiTotalAmount = gpItemDescObject->uiMoneyAmount;
    gRemoveMoney.uiMoneyRemaining = gpItemDescObject->uiMoneyAmount;
    gRemoveMoney.uiMoneyRemoving = 0;

    // Load graphic
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    strcpy(VObjectDesc.ImageFile, "INTERFACE\\info_bil.sti");
    CHECKF(AddVideoObject(&VObjectDesc, &guiMoneyGraphicsForDescBox));

    // Create buttons for the money
    //		if (guiCurrentScreen ==  MAP_SCREEN )
    if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
      guiMoneyButtonImage = LoadButtonImage("INTERFACE\\Info_bil.sti", -1, 1, -1, 2, -1);
      for (cnt = 0; cnt < MAX_ATTACHMENTS - 1; cnt++) {
        guiMoneyButtonBtn[cnt] = CreateIconAndTextButton(guiMoneyButtonImage, gzMoneyAmounts[cnt], BLOCKFONT2, 5, DEFAULT_SHADOW, 5, DEFAULT_SHADOW, TEXT_CJUSTIFIED, (gMapMoneyButtonLoc.x + gMoneyButtonOffsets[cnt].x), (gMapMoneyButtonLoc.y + gMoneyButtonOffsets[cnt].y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, BtnMoneyButtonCallback);
        MSYS_SetBtnUserData(guiMoneyButtonBtn[cnt], 0, cnt);
        if (cnt == M_1000 && gRemoveMoney.uiTotalAmount < 1000)
          DisableButton(guiMoneyButtonBtn[cnt]);
        else if (cnt == M_100 && gRemoveMoney.uiTotalAmount < 100)
          DisableButton(guiMoneyButtonBtn[cnt]);
        else if (cnt == M_10 && gRemoveMoney.uiTotalAmount < 10)
          DisableButton(guiMoneyButtonBtn[cnt]);
      }
      // Create the Done button
      guiMoneyDoneButtonImage = UseLoadedButtonImage(guiMoneyButtonImage, -1, 3, -1, 4, -1);
      guiMoneyButtonBtn[cnt] = CreateIconAndTextButton(guiMoneyDoneButtonImage, gzMoneyAmounts[cnt], BLOCKFONT2, 5, DEFAULT_SHADOW, 5, DEFAULT_SHADOW, TEXT_CJUSTIFIED, (gMapMoneyButtonLoc.x + gMoneyButtonOffsets[cnt].x), (gMapMoneyButtonLoc.y + gMoneyButtonOffsets[cnt].y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, BtnMoneyButtonCallback);
      MSYS_SetBtnUserData(guiMoneyButtonBtn[cnt], 0, cnt);
    } else {
      guiMoneyButtonImage = LoadButtonImage("INTERFACE\\Info_bil.sti", -1, 1, -1, 2, -1);
      for (cnt = 0; cnt < MAX_ATTACHMENTS - 1; cnt++) {
        guiMoneyButtonBtn[cnt] = CreateIconAndTextButton(guiMoneyButtonImage, gzMoneyAmounts[cnt], BLOCKFONT2, 5, DEFAULT_SHADOW, 5, DEFAULT_SHADOW, TEXT_CJUSTIFIED, (gMoneyButtonLoc.x + gMoneyButtonOffsets[cnt].x), (gMoneyButtonLoc.y + gMoneyButtonOffsets[cnt].y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, BtnMoneyButtonCallback);
        MSYS_SetBtnUserData(guiMoneyButtonBtn[cnt], 0, cnt);
        if (cnt == M_1000 && gRemoveMoney.uiTotalAmount < 1000)
          DisableButton(guiMoneyButtonBtn[cnt]);
        else if (cnt == M_100 && gRemoveMoney.uiTotalAmount < 100)
          DisableButton(guiMoneyButtonBtn[cnt]);
        else if (cnt == M_10 && gRemoveMoney.uiTotalAmount < 10)
          DisableButton(guiMoneyButtonBtn[cnt]);
      }

      // Create the Done button
      guiMoneyDoneButtonImage = UseLoadedButtonImage(guiMoneyButtonImage, -1, 3, 6, 4, 5);
      guiMoneyButtonBtn[cnt] = CreateIconAndTextButton(guiMoneyDoneButtonImage, gzMoneyAmounts[cnt], BLOCKFONT2, 5, DEFAULT_SHADOW, 5, DEFAULT_SHADOW, TEXT_CJUSTIFIED, (gMoneyButtonLoc.x + gMoneyButtonOffsets[cnt].x), (gMoneyButtonLoc.y + gMoneyButtonOffsets[cnt].y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, BtnMoneyButtonCallback);
      MSYS_SetBtnUserData(guiMoneyButtonBtn[cnt], 0, cnt);
    }
  }

  fInterfacePanelDirty = DIRTYLEVEL2;

  gfInItemDescBox = TRUE;

  CHECKF(ReloadItemDesc());

  if (gpItemPointer) {
    gpAttachSoldier = gpItemPointerSoldier;
  } else {
    gpAttachSoldier = pSoldier;
  }
  // store attachments that item originally had
  for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
    gusOriginalAttachItem[cnt] = pObject->usAttachItem[cnt];
    gbOriginalAttachStatus[cnt] = pObject->bAttachStatus[cnt];
  }

  if ((gpItemPointer != NULL) && (gfItemDescHelpTextOffset == FALSE) && (CheckFact(FACT_ATTACHED_ITEM_BEFORE, 0) == FALSE)) {
    // set up help text for attachments
    for (cnt = 0; cnt < NUM_INV_HELPTEXT_ENTRIES; cnt++) {
      gItemDescHelpText.iXPosition[cnt] += gsInvDescX;
      gItemDescHelpText.iYPosition[cnt] += gsInvDescY;
    }

    if (!(Item[pObject->usItem].fFlags & ITEM_HIDDEN_ADDON) && (ValidAttachment(gpItemPointer->usItem, pObject->usItem) || ValidLaunchable(gpItemPointer->usItem, pObject->usItem) || ValidMerge(gpItemPointer->usItem, pObject->usItem))) {
      SetUpFastHelpListRegions(gItemDescHelpText.iXPosition, gItemDescHelpText.iYPosition, gItemDescHelpText.iWidth, gItemDescHelpText.sString1, NUM_INV_HELPTEXT_ENTRIES);
    } else {
      SetUpFastHelpListRegions(gItemDescHelpText.iXPosition, gItemDescHelpText.iYPosition, gItemDescHelpText.iWidth, gItemDescHelpText.sString2, NUM_INV_HELPTEXT_ENTRIES);
    }

    StartShowingInterfaceFastHelpText();

    SetFactTrue(FACT_ATTACHED_ITEM_BEFORE);
    gfItemDescHelpTextOffset = TRUE;
  }

  return TRUE;
}

function ReloadItemDesc(): BOOLEAN {
  if (!LoadTileGraphicForItem(&(Item[gpItemDescObject->usItem]), &guiItemGraphic)) {
    return FALSE;
  }

  //
  // Load name, desc
  //

  // if the player is extracting money from the players account, use a different item name and description
  if (gfAddingMoneyToMercFromPlayersAccount && gpItemDescObject->usItem == MONEY) {
    if (!LoadItemInfo(MONEY_FOR_PLAYERS_ACCOUNT, gzItemName, gzItemDesc)) {
      return FALSE;
    }
  } else {
    if (!LoadItemInfo(gpItemDescObject->usItem, gzItemName, gzItemDesc)) {
      return FALSE;
    }
  }

  /*
          if (Item[ gpItemDescObject->usItem ].usItemClass & IC_WEAPON)
          {
                  // load item pros and cons
                  if ( !LoadItemProsAndCons( gpItemDescObject->usItem, gzItemPros, gzItemCons ) )
                  {
                          return( FALSE );
                  }
          }
          else
          {
                  wcscpy( gzItemPros, L"" );
                  wcscpy( gzItemCons, L"" );
          }
          */

  return TRUE;
}

function ItemDescAmmoCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  /* static */ let fRightDown: BOOLEAN = FALSE;
  let pStr: INT16[] /* [10] */;

  /*	region gets disabled in SKI for shopkeeper boxes.  It now works normally for merc's inventory boxes!
          //if we are currently in the shopkeeper interface, return;
          if( guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE )
          {
                  btn->uiFlags &= (~BUTTON_CLICKED_ON );
                  return;
          }
  */

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fRightDown = TRUE;
    gfItemAmmoDown = TRUE;
    btn->uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP && fRightDown) {
    fRightDown = FALSE;
    gfItemAmmoDown = FALSE;

    if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
      if (gpItemPointer == NULL && EmptyWeaponMagazine(gpItemDescObject, &gItemPointer)) {
        // OK, END the description box
        // fItemDescDelete = TRUE;
        fInterfacePanelDirty = DIRTYLEVEL2;
        gpItemPointer = &gItemPointer;
        gpItemPointerSoldier = gpItemDescSoldier;

        swprintf(pStr, L"0");
        SpecifyButtonText(giItemDescAmmoButton, pStr);

        // Set mouse
        guiExternVo = GetInterfaceGraphicForItem(&(Item[gpItemPointer->usItem]));
        gusExternVoSubIndex = Item[gpItemPointer->usItem].ubGraphicNum;

        MSYS_ChangeRegionCursor(&gMPanelRegion, EXTERN_CURSOR);
        MSYS_SetCurrentCursor(EXTERN_CURSOR);
        fMapInventoryItem = TRUE;
        fTeamPanelDirty = TRUE;
      }
    } else {
      // Set pointer to item
      if (gpItemPointer == NULL && EmptyWeaponMagazine(gpItemDescObject, &gItemPointer)) {
        gpItemPointer = &gItemPointer;
        gpItemPointerSoldier = gpItemDescSoldier;

        // if in SKI, load item into SKI's item pointer
        if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
          // pick up bullets from weapon into cursor (don't try to sell)
          BeginSkiItemPointer(PLAYERS_INVENTORY, -1, FALSE);
        }

        // OK, END the description box
        // fItemDescDelete = TRUE;
        fInterfacePanelDirty = DIRTYLEVEL2;

        swprintf(pStr, L"0");
        SpecifyButtonText(giItemDescAmmoButton, pStr);

        fItemDescDelete = TRUE;
      }
    }
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function DoAttachment(): void {
  if (AttachObject(gpItemDescSoldier, gpItemDescObject, gpItemPointer)) {
    if (gpItemPointer->usItem == NOTHING) {
      // attachment attached, merge item consumed, etc

      if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
        MAPEndItemPointer();
      } else {
        // End Item pickup
        gpItemPointer = NULL;
        EnableSMPanelButtons(TRUE, TRUE);

        MSYS_ChangeRegionCursor(&gSMPanelRegion, CURSOR_NORMAL);
        SetCurrentCursorFromDatabase(CURSOR_NORMAL);

        // if we are currently in the shopkeeper interface
        if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
          // Clear out the moving cursor
          memset(&gMoveingItem, 0, sizeof(INVENTORY_IN_SLOT));

          // change the curosr back to the normal one
          SetSkiCursor(CURSOR_NORMAL);
        }
      }
    }

    if (gpItemDescObject->usItem == NOTHING) {
      // close desc panel panel
      DeleteItemDescriptionBox();
    }
    // Dirty interface
    fInterfacePanelDirty = DIRTYLEVEL2;

    ReloadItemDesc();
  }

  // re-evaluate repairs
  gfReEvaluateEveryonesNothingToDo = TRUE;
}

function PermanantAttachmentMessageBoxCallBack(ubExitValue: UINT8): void {
  if (ubExitValue == MSG_BOX_RETURN_YES) {
    DoAttachment();
  }
  // else do nothing
}

function ItemDescAttachmentsCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let uiItemPos: UINT32;
  /* static */ let fRightDown: BOOLEAN = FALSE;

  if (gfItemDescObjectIsAttachment) {
    // screen out completely
    return;
  }

  uiItemPos = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // if the item being described belongs to a shopkeeper, ignore attempts to pick it up / replace it
    if ((guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) && (pShopKeeperItemDescObject != NULL)) {
      return;
    }

    // Try to place attachment if something is in our hand
    // require as many APs as to reload
    if (gpItemPointer != NULL) {
      // nb pointer could be NULL because of inventory manipulation in mapscreen from sector inv
      if (!gpItemPointerSoldier || EnoughPoints(gpItemPointerSoldier, AP_RELOAD_GUN, 0, TRUE)) {
        if ((Item[gpItemPointer->usItem].fFlags & ITEM_INSEPARABLE) && ValidAttachment(gpItemPointer->usItem, gpItemDescObject->usItem)) {
          DoScreenIndependantMessageBox(Message[STR_PERMANENT_ATTACHMENT], MSG_BOX_FLAG_YESNO, PermanantAttachmentMessageBoxCallBack);
          return;
        }

        DoAttachment();
      }
    } else {
      // ATE: Make sure we have enough AP's to drop it if we pick it up!
      if (EnoughPoints(gpItemDescSoldier, (AP_RELOAD_GUN + AP_PICKUP_ITEM), 0, TRUE)) {
        // Get attachment if there is one
        // The follwing function will handle if no attachment is here
        if (RemoveAttachment(gpItemDescObject, uiItemPos, &gItemPointer)) {
          gpItemPointer = &gItemPointer;
          gpItemPointerSoldier = gpItemDescSoldier;

          //				if( guiCurrentScreen == MAP_SCREEN )
          if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
            // Set mouse
            guiExternVo = GetInterfaceGraphicForItem(&(Item[gpItemPointer->usItem]));
            gusExternVoSubIndex = Item[gpItemPointer->usItem].ubGraphicNum;

            MSYS_ChangeRegionCursor(&gMPanelRegion, EXTERN_CURSOR);
            MSYS_SetCurrentCursor(EXTERN_CURSOR);
            fMapInventoryItem = TRUE;
            fTeamPanelDirty = TRUE;
          }

          // if we are currently in the shopkeeper interface
          else if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
            // pick up attachment from item into cursor (don't try to sell)
            BeginSkiItemPointer(PLAYERS_INVENTORY, -1, FALSE);
          }

          // Dirty interface
          fInterfacePanelDirty = DIRTYLEVEL2;

          // re-evaluate repairs
          gfReEvaluateEveryonesNothingToDo = TRUE;

          UpdateItemHatches();
        }
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    fRightDown = TRUE;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP && fRightDown) {
    /* static */ let Object2: OBJECTTYPE;

    fRightDown = FALSE;

    if (gpItemDescObject->usAttachItem[uiItemPos] != NOTHING) {
      let fShopkeeperItem: BOOLEAN = FALSE;

      // remember if this is a shopkeeper's item we're viewing ( pShopKeeperItemDescObject will get nuked on deletion )
      if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE && pShopKeeperItemDescObject != NULL) {
        fShopkeeperItem = TRUE;
      }

      DeleteItemDescriptionBox();

      if (CreateItem(gpItemDescObject->usAttachItem[uiItemPos], gpItemDescObject->bAttachStatus[uiItemPos], &Object2)) {
        gfItemDescObjectIsAttachment = TRUE;
        InternalInitItemDescriptionBox(&Object2, gsInvDescX, gsInvDescY, 0, gpItemDescSoldier);

        if (fShopkeeperItem) {
          pShopKeeperItemDescObject = &Object2;
          StartSKIDescriptionBox();
        }
      }
    }
  }
}

function RenderItemDescriptionBox(): void {
  let pTrav: Pointer<ETRLEObject>;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let sCenX: INT16;
  let sCenY: INT16;
  let sStrX: INT16;
  let hVObject: HVOBJECT;
  let sTempString: CHAR16[] /* [128] */;

  let uiStringLength: UINT16;
  let uiRightLength: UINT16;
  /* static */ let pStr: INT16[] /* [100] */;
  let cnt: INT32;
  let fWeight: FLOAT;
  let usX: UINT16;
  let usY: UINT16;
  let ubAttackAPs: UINT8;
  let fHatchOutAttachments: BOOLEAN = gfItemDescObjectIsAttachment; // if examining attachment, always hatch out attachment slots
  let sProsConsIndent: INT16;

  if ((guiCurrentItemDescriptionScreen == MAP_SCREEN) && (gfInItemDescBox)) {
    // TAKE A LOOK AT THE VIDEO OBJECT SIZE ( ONE OF TWO SIZES ) AND CENTER!
    GetVideoObject(&hVObject, guiItemGraphic);
    pTrav = &(hVObject->pETRLEObject[0]);
    usHeight = pTrav->usHeight;
    usWidth = pTrav->usWidth;

    // CENTER IN SLOT!
    // REMOVE OFFSETS!
    sCenX = MAP_ITEMDESC_ITEM_X + (abs(ITEMDESC_ITEM_WIDTH - usWidth) / 2) - pTrav->sOffsetX;
    sCenY = MAP_ITEMDESC_ITEM_Y + (abs(ITEMDESC_ITEM_HEIGHT - usHeight) / 2) - pTrav->sOffsetY;

    BltVideoObjectFromIndex(guiSAVEBUFFER, guiMapItemDescBox, 0, gsInvDescX, gsInvDescY, VO_BLT_SRCTRANSPARENCY, NULL);

    // Display the money 'seperating' border
    if (gpItemDescObject->usItem == MONEY) {
      // Render the money Boxes
      BltVideoObjectFromIndex(guiSAVEBUFFER, guiMoneyGraphicsForDescBox, 0, (gMapMoneyButtonLoc.x + gMoneyButtonOffsets[0].x), (gMapMoneyButtonLoc.y + gMoneyButtonOffsets[0].y), VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // Display item
    BltVideoObjectOutlineShadowFromIndex(guiSAVEBUFFER, guiItemGraphic, 0, sCenX - 2, sCenY + 2);

    BltVideoObjectFromIndex(guiSAVEBUFFER, guiItemGraphic, 0, sCenX, sCenY, VO_BLT_SRCTRANSPARENCY, NULL);

    // Display ststus
    DrawItemUIBarEx(gpItemDescObject, gubItemDescStatusIndex, MAP_ITEMDESC_ITEM_STATUS_X, MAP_ITEMDESC_ITEM_STATUS_Y, ITEMDESC_ITEM_STATUS_WIDTH, ITEMDESC_ITEM_STATUS_HEIGHT_MAP, Get16BPPColor(DESC_STATUS_BAR), Get16BPPColor(DESC_STATUS_BAR_SHADOW), TRUE, guiSAVEBUFFER);

    if (gpItemPointer) {
      if ((Item[gpItemPointer->usItem].fFlags & ITEM_HIDDEN_ADDON) ||

          (!ValidItemAttachment(gpItemDescObject, gpItemPointer->usItem, FALSE) && !ValidMerge(gpItemPointer->usItem, gpItemDescObject->usItem) && !ValidLaunchable(gpItemPointer->usItem, gpItemDescObject->usItem))) {
        // hatch out the attachment panels
        fHatchOutAttachments = TRUE;
      }
    }

    // Display attachments
    for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
      if (gpItemDescObject->usAttachItem[cnt] != NOTHING) {
        //        if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN )
        if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
          sCenX = (gsInvDescX + gMapItemDescAttachmentsXY[cnt].sX + 5);
          sCenY = (gsInvDescY + gMapItemDescAttachmentsXY[cnt].sY - 1);

          INVRenderItem(guiSAVEBUFFER, NULL, gpItemDescObject, sCenX, sCenY, gMapItemDescAttachmentsXY[cnt].sWidth, gMapItemDescAttachmentsXY[cnt].sHeight, DIRTYLEVEL2, NULL, (RENDER_ITEM_ATTACHMENT1 + cnt), FALSE, 0);

          sCenX = sCenX - gMapItemDescAttachmentsXY[cnt].sBarDx;
          sCenY = sCenY + gMapItemDescAttachmentsXY[cnt].sBarDy;
          DrawItemUIBarEx(gpItemDescObject, (DRAW_ITEM_STATUS_ATTACHMENT1 + cnt), sCenX, sCenY, ITEM_BAR_WIDTH, ITEM_BAR_HEIGHT, Get16BPPColor(STATUS_BAR), Get16BPPColor(STATUS_BAR_SHADOW), TRUE, guiSAVEBUFFER);
        } else {
          sCenX = (gsInvDescX + gMapItemDescAttachmentsXY[cnt].sX + 5);
          sCenY = (gsInvDescY + gMapItemDescAttachmentsXY[cnt].sY - 1);

          INVRenderItem(guiSAVEBUFFER, NULL, gpItemDescObject, sCenX, sCenY, gMapItemDescAttachmentsXY[cnt].sWidth, gMapItemDescAttachmentsXY[cnt].sHeight, DIRTYLEVEL2, NULL, (RENDER_ITEM_ATTACHMENT1 + cnt), FALSE, 0);

          sCenX = sCenX - gItemDescAttachmentsXY[cnt].sBarDx;
          sCenY = sCenY + gItemDescAttachmentsXY[cnt].sBarDy;
          DrawItemUIBarEx(gpItemDescObject, (DRAW_ITEM_STATUS_ATTACHMENT1 + cnt), sCenX, sCenY, ITEM_BAR_WIDTH, ITEM_BAR_HEIGHT, Get16BPPColor(STATUS_BAR), Get16BPPColor(STATUS_BAR_SHADOW), TRUE, guiSAVEBUFFER);
        }
      }

      if (fHatchOutAttachments) {
        DrawHatchOnInventory(guiSAVEBUFFER, (gsInvDescX + gMapItemDescAttachmentsXY[cnt].sX), (gsInvDescY + gMapItemDescAttachmentsXY[cnt].sY - 2), (gMapItemDescAttachmentsXY[cnt].sWidth + gMapItemDescAttachmentsXY[cnt].sBarDx), (gMapItemDescAttachmentsXY[cnt].sHeight + 2));
      }
    }

    if (Item[gpItemDescObject->usItem].usItemClass & IC_GUN) {
      // display bullets for ROF
      BltVideoObjectFromIndex(guiSAVEBUFFER, guiBullet, 0, MAP_BULLET_SING_X, MAP_BULLET_SING_Y, VO_BLT_SRCTRANSPARENCY, NULL);

      if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst > 0) {
        for (cnt = 0; cnt < Weapon[gpItemDescObject->usItem].ubShotsPerBurst; cnt++) {
          BltVideoObjectFromIndex(guiSAVEBUFFER, guiBullet, 0, MAP_BULLET_BURST_X + cnt * (BULLET_WIDTH + 1), MAP_BULLET_BURST_Y, VO_BLT_SRCTRANSPARENCY, NULL);
        }
      }
    }

    RestoreExternBackgroundRect(gsInvDescX, gsInvDescY, MAP_ITEMDESC_WIDTH, MAP_ITEMDESC_HEIGHT);

    // Render font desc
    SetFont(ITEMDESC_FONT);
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_FCOLOR_WHITE);
    SetFontShadow(ITEMDESC_FONTSHADOW3);

// Render name
    mprintf(MAP_ITEMDESC_NAME_X, MAP_ITEMDESC_NAME_Y, L"%s", gzItemName);

    SetFontForeground(FONT_BLACK);
    SetFontShadow(ITEMDESC_FONTSHADOW2);

    DisplayWrappedString(MAP_ITEMDESC_DESC_START_X, MAP_ITEMDESC_DESC_START_Y, MAP_ITEMDESC_DESC_WIDTH, 2, ITEMDESC_FONT, FONT_BLACK, gzItemDesc, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

    if (ITEM_PROS_AND_CONS(gpItemDescObject->usItem)) {
      if ((gpItemDescObject->usItem == ROCKET_RIFLE || gpItemDescObject->usItem == AUTO_ROCKET_RIFLE) && gpItemDescObject->ubImprintID < NO_PROFILE) {
        // add name noting imprint
        swprintf(pStr, L"%s %s (%s)", AmmoCaliber[Weapon[gpItemDescObject->usItem].ubCalibre], WeaponType[Weapon[gpItemDescObject->usItem].ubWeaponType], gMercProfiles[gpItemDescObject->ubImprintID].zNickname);
      } else {
        swprintf(pStr, L"%s %s", AmmoCaliber[Weapon[gpItemDescObject->usItem].ubCalibre], WeaponType[Weapon[gpItemDescObject->usItem].ubWeaponType]);
      }

      FindFontRightCoordinates(MAP_ITEMDESC_CALIBER_X, MAP_ITEMDESC_CALIBER_Y, MAP_ITEMDESC_CALIBER_WIDTH, ITEM_STATS_HEIGHT, pStr, ITEMDESC_FONT, &usX, &usY);
      mprintf(usX, usY, pStr);

      SetFontForeground(FONT_MCOLOR_DKWHITE2);
      SetFontShadow(ITEMDESC_FONTSHADOW3);
      mprintf(MAP_ITEMDESC_PROS_START_X, MAP_ITEMDESC_PROS_START_Y, gzProsLabel);

      sProsConsIndent = __max(StringPixLength(gzProsLabel, ITEMDESC_FONT), StringPixLength(gzConsLabel, ITEMDESC_FONT)) + 10;

      GenerateProsString(gzItemPros, gpItemDescObject, MAP_ITEMDESC_DESC_WIDTH - sProsConsIndent - StringPixLength(DOTDOTDOT, ITEMDESC_FONT));
      if (gzItemPros[0] != 0) {
        SetFontForeground(FONT_BLACK);
        SetFontShadow(ITEMDESC_FONTSHADOW2);
        DisplayWrappedString((MAP_ITEMDESC_PROS_START_X + sProsConsIndent), MAP_ITEMDESC_PROS_START_Y, (ITEMDESC_DESC_WIDTH - sProsConsIndent), 2, ITEMDESC_FONT, FONT_BLACK, gzItemPros, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
      }

      SetFontForeground(FONT_MCOLOR_DKWHITE2);
      SetFontShadow(ITEMDESC_FONTSHADOW3);
      mprintf(MAP_ITEMDESC_CONS_START_X, MAP_ITEMDESC_CONS_START_Y, gzConsLabel);

      GenerateConsString(gzItemCons, gpItemDescObject, MAP_ITEMDESC_DESC_WIDTH - sProsConsIndent - StringPixLength(DOTDOTDOT, ITEMDESC_FONT));
      if (gzItemCons[0] != 0) {
        SetFontForeground(FONT_BLACK);
        SetFontShadow(ITEMDESC_FONTSHADOW2);
        DisplayWrappedString((MAP_ITEMDESC_CONS_START_X + sProsConsIndent), MAP_ITEMDESC_CONS_START_Y, (ITEMDESC_DESC_WIDTH - sProsConsIndent), 2, ITEMDESC_FONT, FONT_BLACK, gzItemCons, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
      }
    }

    /*
                    DisplayWrappedString( (INT16)MAP_ITEMDESC_PROS_START_X, (INT16)MAP_ITEMDESC_PROS_START_Y, MAP_ITEMDESC_DESC_WIDTH, 2, ITEMDESC_FONT, FONT_BLACK,  gzProsLabel, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
                    if (gzItemPros[0] != 0)
                    {
                            DisplayWrappedString( (INT16)MAP_ITEMDESC_PROS_START_X, (INT16)MAP_ITEMDESC_PROS_START_Y, MAP_ITEMDESC_DESC_WIDTH, 2, ITEMDESC_FONT, FONT_BLACK,  gzItemPros, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
                    }

                    DisplayWrappedString( (INT16)MAP_ITEMDESC_CONS_START_X, (INT16)MAP_ITEMDESC_CONS_START_Y, MAP_ITEMDESC_DESC_WIDTH, 2, ITEMDESC_FONT, FONT_BLACK,  gzConsLabel, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
                    if (gzItemCons[0] != 0)
                    {
                            DisplayWrappedString( (INT16)MAP_ITEMDESC_CONS_START_X, (INT16)MAP_ITEMDESC_CONS_START_Y, MAP_ITEMDESC_DESC_WIDTH, 2, ITEMDESC_FONT, FONT_BLACK,  gzItemCons, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
                    }
    */

    // Get length of string
    uiRightLength = 35;

    fWeight = (CalculateObjectWeight(gpItemDescObject)) / 10;
    if (!gGameSettings.fOptions[TOPTION_USE_METRIC_SYSTEM]) // metric units not enabled
    {
      fWeight = fWeight * 2.2f;
    }

    // Add weight of attachments here !

    if (fWeight < 0.1) {
      fWeight = 0.1f;
    }

    // Render, stat  name
    if (Item[gpItemDescObject->usItem].usItemClass & IC_WEAPON) {
      SetFont(BLOCKFONT2);
      SetFontForeground(6);
      SetFontShadow(DEFAULT_SHADOW);

      // LABELS
      swprintf(sTempString, gWeaponStatsDesc[0], GetWeightUnitString());
      mprintf(gMapWeaponStats[0].sX + gsInvDescX, gMapWeaponStats[0].sY + gsInvDescY, L"%s", sTempString);
      // mprintf( gMapWeaponStats[ 2 ].sX + gsInvDescX, gMapWeaponStats[ 2 ].sY + gsInvDescY, L"%s", gMapWeaponStats[ 2 ].zDesc );
      if (Item[gpItemDescObject->usItem].usItemClass & (IC_GUN | IC_LAUNCHER)) {
        mprintf(gMapWeaponStats[3].sX + gsInvDescX, gMapWeaponStats[3].sY + gsInvDescY, L"%s", gWeaponStatsDesc[3]);
      }
      if (!(Item[gpItemDescObject->usItem].usItemClass & IC_LAUNCHER) && gpItemDescObject->usItem != ROCKET_LAUNCHER) {
        mprintf(gMapWeaponStats[4].sX + gsInvDescX, gMapWeaponStats[4].sY + gsInvDescY, L"%s", gWeaponStatsDesc[4]);
      }
      mprintf(gMapWeaponStats[5].sX + gsInvDescX, gMapWeaponStats[5].sY + gsInvDescY, L"%s", gWeaponStatsDesc[5]);
      if (Item[gpItemDescObject->usItem].usItemClass & IC_GUN) {
        // equals sign
        mprintf(gMapWeaponStats[7].sX + gsInvDescX, gMapWeaponStats[7].sY + gsInvDescY, L"%s", gWeaponStatsDesc[7]);
      }
      mprintf(gMapWeaponStats[1].sX + gsInvDescX, gMapWeaponStats[1].sY + gsInvDescY, L"%s", gWeaponStatsDesc[1]);

      if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst > 0) {
        mprintf(gMapWeaponStats[8].sX + gsInvDescX, gMapWeaponStats[8].sY + gsInvDescY, L"%s", gWeaponStatsDesc[8]);
      }

      SetFontForeground(5);
      // Status
      // This is gross, but to get the % to work out right...
      swprintf(pStr, L"%2d%%", gpItemDescObject->bStatus[gubItemDescStatusIndex]);
      FindFontRightCoordinates((gMapWeaponStats[1].sX + gsInvDescX + gMapWeaponStats[1].sValDx + 6), (gMapWeaponStats[1].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      wcscat(pStr, L"%%");
      mprintf(usX, usY, pStr);

      // Values
      if (fWeight <= (EXCEPTIONAL_WEIGHT / 10)) {
        SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
      } else {
        SetFontForeground(5);
      }
      // Weight
      swprintf(pStr, L"%1.1f", fWeight);
      FindFontRightCoordinates((gMapWeaponStats[0].sX + gsInvDescX + gMapWeaponStats[0].sValDx + 6), (gMapWeaponStats[0].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);

      if (Item[gpItemDescObject->usItem].usItemClass & (IC_GUN | IC_LAUNCHER)) {
        if (GunRange(gpItemDescObject) >= EXCEPTIONAL_RANGE) {
          SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
        } else {
          SetFontForeground(5);
        }

        // Range
        swprintf(pStr, L"%2d", (GunRange(gpItemDescObject)) / 10);
        FindFontRightCoordinates((gMapWeaponStats[3].sX + gsInvDescX + gMapWeaponStats[3].sValDx), (gMapWeaponStats[3].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }

      if (!(Item[gpItemDescObject->usItem].usItemClass & IC_LAUNCHER) && gpItemDescObject->usItem != ROCKET_LAUNCHER) {
        if (Weapon[gpItemDescObject->usItem].ubImpact >= EXCEPTIONAL_DAMAGE) {
          SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
        } else {
          SetFontForeground(5);
        }

        // Damage
        swprintf(pStr, L"%2d", Weapon[gpItemDescObject->usItem].ubImpact);
        FindFontRightCoordinates((gMapWeaponStats[4].sX + gsInvDescX + gMapWeaponStats[4].sValDx), (gMapWeaponStats[4].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }

      ubAttackAPs = BaseAPsToShootOrStab(DEFAULT_APS, DEFAULT_AIMSKILL, gpItemDescObject);

      if (ubAttackAPs <= EXCEPTIONAL_AP_COST) {
        SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
      } else {
        SetFontForeground(5);
      }

      // Ap's
      swprintf(pStr, L"%2d", ubAttackAPs);
      FindFontRightCoordinates((gMapWeaponStats[5].sX + gsInvDescX + gMapWeaponStats[5].sValDx), (gMapWeaponStats[5].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);

      if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst > 0) {
        if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst >= EXCEPTIONAL_BURST_SIZE || gpItemDescObject->usItem == G11) {
          SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
        } else {
          SetFontForeground(5);
        }

        swprintf(pStr, L"%2d", ubAttackAPs + CalcAPsToBurst(DEFAULT_APS, gpItemDescObject));
        FindFontRightCoordinates((gMapWeaponStats[6].sX + gsInvDescX + gMapWeaponStats[6].sValDx), (gMapWeaponStats[6].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }
    } else if (gpItemDescObject->usItem == MONEY) {
      SetFontForeground(FONT_FCOLOR_WHITE);
      SetFontShadow(DEFAULT_SHADOW);

      //
      // Display the total amount of money
      //

      // if the player is taking money from their account
      if (gfAddingMoneyToMercFromPlayersAccount)
        swprintf(pStr, L"%ld", LaptopSaveInfo.iCurrentBalance);
      else
        swprintf(pStr, L"%ld", gRemoveMoney.uiTotalAmount);

      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);
      uiStringLength = StringPixLength(pStr, ITEMDESC_FONT);
      sStrX = MAP_ITEMDESC_NAME_X + (245 - uiStringLength);
      mprintf(sStrX, MAP_ITEMDESC_NAME_Y, pStr);

      SetFont(BLOCKFONT2);

      SetFontForeground(6);
      SetFontShadow(DEFAULT_SHADOW);

      // Display the 'Removing'
      mprintf(gMapMoneyStats[0].sX + gsInvDescX, gMapMoneyStats[0].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_AMOUNT]);
      // Display the 'REmaining'
      mprintf(gMapMoneyStats[2].sX + gsInvDescX, gMapMoneyStats[2].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_AMOUNT_2_SPLIT]);

      // Display the 'Amt removing'
      mprintf(gMapMoneyStats[1].sX + gsInvDescX, gMapMoneyStats[1].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_REMAINING]);
      // Display the 'REmaining amount'
      mprintf(gMapMoneyStats[3].sX + gsInvDescX, gMapMoneyStats[3].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_TO_SPLIT]);

      SetFontForeground(5);

      // Display the 'Seperate text'
      mprintf((gMapMoneyButtonLoc.x + gMoneyButtonOffsets[cnt].x), (gMapMoneyButtonLoc.y + gMoneyButtonOffsets[cnt].y), gzMoneyAmounts[4]);

      // The Money Remaining
      swprintf(pStr, L"%ld", gRemoveMoney.uiMoneyRemaining);
      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);
      uiStringLength = StringPixLength(pStr, ITEMDESC_FONT);
      sStrX = gMapMoneyStats[1].sX + gsInvDescX + gMapMoneyStats[1].sValDx + (uiRightLength - uiStringLength);
      mprintf(sStrX, gMapMoneyStats[1].sY + gsInvDescY, pStr);

      // The money removing
      SetFontForeground(5);
      swprintf(pStr, L"%ld", gRemoveMoney.uiMoneyRemoving);
      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);
      uiStringLength = StringPixLength(pStr, ITEMDESC_FONT);
      sStrX = gMapMoneyStats[3].sX + gsInvDescX + gMapMoneyStats[3].sValDx + (uiRightLength - uiStringLength);
      mprintf(sStrX, gMapMoneyStats[3].sY + gsInvDescY, pStr);

      // print label for amount

      //			SetFontForeground( ITEMDESC_FONTFORE1 );
      //			mprintf( gMapMoneyStats[ 1 ].sX + gsInvDescX, gMapMoneyStats[ 1 ].sY + gsInvDescY, L"%s", gMapMoneyStats[ 1 ].zDesc );
    } else if (Item[gpItemDescObject->usItem].usItemClass == IC_MONEY) {
      SetFontForeground(FONT_FCOLOR_WHITE);
      SetFontShadow(DEFAULT_SHADOW);
      swprintf(pStr, L"%ld", gpItemDescObject->uiMoneyAmount);
      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);
      uiStringLength = StringPixLength(pStr, ITEMDESC_FONT);
      sStrX = MAP_ITEMDESC_NAME_X + (245 - uiStringLength);
      mprintf(sStrX, MAP_ITEMDESC_NAME_Y, pStr);
    } else {
      // Labels
      SetFont(BLOCKFONT2);

      SetFontForeground(6);
      SetFontShadow(DEFAULT_SHADOW);

      if (Item[gpItemDescObject->usItem].usItemClass & IC_AMMO) {
        mprintf(gMapWeaponStats[2].sX + gsInvDescX, gMapWeaponStats[2].sY + gsInvDescY, L"%s", gWeaponStatsDesc[2]);
      } else {
        mprintf(gMapWeaponStats[1].sX + gsInvDescX, gMapWeaponStats[1].sY + gsInvDescY, L"%s", gWeaponStatsDesc[1]);
      }
      swprintf(sTempString, gWeaponStatsDesc[0], GetWeightUnitString());
      mprintf(gMapWeaponStats[0].sX + gsInvDescX, gMapWeaponStats[0].sY + gsInvDescY, sTempString);

      // Values
      SetFontForeground(5);

      if (Item[gpItemDescObject->usItem].usItemClass & IC_AMMO) {
        // Ammo
        swprintf(pStr, L"%d/%d", gpItemDescObject->ubShotsLeft[0], Magazine[Item[gpItemDescObject->usItem].ubClassIndex].ubMagSize);
        uiStringLength = StringPixLength(pStr, ITEMDESC_FONT);
        //			sStrX =  gMapWeaponStats[ 0 ].sX + gsInvDescX + gMapWeaponStats[ 0 ].sValDx + ( uiRightLength - uiStringLength );
        FindFontRightCoordinates((gMapWeaponStats[2].sX + gsInvDescX + gMapWeaponStats[2].sValDx + 6), (gMapWeaponStats[2].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &sStrX, &usY);
        mprintf(sStrX, gMapWeaponStats[2].sY + gsInvDescY, pStr);
      } else {
        // Status
        swprintf(pStr, L"%2d%%", gpItemDescObject->bStatus[gubItemDescStatusIndex]);
        uiStringLength = StringPixLength(pStr, ITEMDESC_FONT);
        //			sStrX =  gMapWeaponStats[ 1 ].sX + gsInvDescX + gMapWeaponStats[ 1 ].sValDx + ( uiRightLength - uiStringLength );
        FindFontRightCoordinates((gMapWeaponStats[1].sX + gsInvDescX + gMapWeaponStats[1].sValDx + 6), (gMapWeaponStats[1].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &sStrX, &usY);
        wcscat(pStr, L"%%");
        mprintf(sStrX, gMapWeaponStats[1].sY + gsInvDescY, pStr);
      }

      // Weight
      swprintf(pStr, L"%1.1f", fWeight);
      uiStringLength = StringPixLength(pStr, ITEMDESC_FONT);
      //			sStrX =  gMapWeaponStats[ 0 ].sX + gsInvDescX + gMapWeaponStats[ 0 ].sValDx + ( uiRightLength - uiStringLength );
      FindFontRightCoordinates((gMapWeaponStats[0].sX + gsInvDescX + gMapWeaponStats[0].sValDx + 6), (gMapWeaponStats[0].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &sStrX, &usY);
      mprintf(sStrX, gMapWeaponStats[0].sY + gsInvDescY, pStr);

      if ((InKeyRingPopup() == TRUE) || (Item[gpItemDescObject->usItem].usItemClass & IC_KEY)) {
        SetFontForeground(6);

        // build description for keys .. the sector found
        swprintf(pStr, L"%s", sKeyDescriptionStrings[0]);
        mprintf(gMapWeaponStats[4].sX + gsInvDescX, gMapWeaponStats[4].sY + gsInvDescY, pStr);
        swprintf(pStr, L"%s", sKeyDescriptionStrings[1]);
        mprintf(gMapWeaponStats[4].sX + gsInvDescX, gMapWeaponStats[4].sY + gsInvDescY + GetFontHeight(BLOCKFONT) + 2, pStr);

        SetFontForeground(5);
        GetShortSectorString(SECTORX(KeyTable[gpItemDescObject->ubKeyID].usSectorFound), SECTORY(KeyTable[gpItemDescObject->ubKeyID].usSectorFound), sTempString);
        swprintf(pStr, L"%s", sTempString);
        FindFontRightCoordinates((gMapWeaponStats[4].sX + gsInvDescX), (gMapWeaponStats[4].sY + gsInvDescY), 110, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);

        swprintf(pStr, L"%d", KeyTable[gpItemDescObject->ubKeyID].usDateFound);
        FindFontRightCoordinates((gMapWeaponStats[4].sX + gsInvDescX), (gMapWeaponStats[4].sY + gsInvDescY + GetFontHeight(BLOCKFONT) + 2), 110, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }
    }

    SetFontShadow(DEFAULT_SHADOW);
  } else if (gfInItemDescBox) {
    // TAKE A LOOK AT THE VIDEO OBJECT SIZE ( ONE OF TWO SIZES ) AND CENTER!
    GetVideoObject(&hVObject, guiItemGraphic);
    pTrav = &(hVObject->pETRLEObject[0]);
    usHeight = pTrav->usHeight;
    usWidth = pTrav->usWidth;

    // CENTER IN SLOT!
    sCenX = ITEMDESC_ITEM_X + (abs(ITEMDESC_ITEM_WIDTH - usWidth) / 2) - pTrav->sOffsetX;
    sCenY = ITEMDESC_ITEM_Y + (abs(ITEMDESC_ITEM_HEIGHT - usHeight) / 2) - pTrav->sOffsetY;

    BltVideoObjectFromIndex(guiSAVEBUFFER, guiItemDescBox, 0, gsInvDescX, gsInvDescY, VO_BLT_SRCTRANSPARENCY, NULL);

    if (gpItemDescObject->usItem == MONEY) {
      // Render the money Boxes
      BltVideoObjectFromIndex(guiSAVEBUFFER, guiMoneyGraphicsForDescBox, 0, (gsInvDescX + gItemDescAttachmentsXY[0].sX - 1), (gsInvDescY + gItemDescAttachmentsXY[0].sY - 2), VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // Display item
    BltVideoObjectOutlineShadowFromIndex(guiSAVEBUFFER, guiItemGraphic, 0, sCenX - 2, sCenY + 2);
    BltVideoObjectFromIndex(guiSAVEBUFFER, guiItemGraphic, 0, sCenX, sCenY, VO_BLT_SRCTRANSPARENCY, NULL);

    // Display status
    DrawItemUIBarEx(gpItemDescObject, gubItemDescStatusIndex, ITEMDESC_ITEM_STATUS_X, ITEMDESC_ITEM_STATUS_Y, ITEMDESC_ITEM_STATUS_WIDTH, ITEMDESC_ITEM_STATUS_HEIGHT, Get16BPPColor(DESC_STATUS_BAR), Get16BPPColor(DESC_STATUS_BAR_SHADOW), TRUE, guiSAVEBUFFER);

    if (gpItemPointer) {
      if ((Item[gpItemPointer->usItem].fFlags & ITEM_HIDDEN_ADDON) ||

          (!ValidItemAttachment(gpItemDescObject, gpItemPointer->usItem, FALSE) && !ValidMerge(gpItemPointer->usItem, gpItemDescObject->usItem) && !ValidLaunchable(gpItemPointer->usItem, gpItemDescObject->usItem))) {
        // hatch out the attachment panels
        fHatchOutAttachments = TRUE;
      }
    }

    // Display attachments
    for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
      if (gpItemDescObject->usAttachItem[cnt] != NOTHING) {
        sCenX = (gsInvDescX + gItemDescAttachmentsXY[cnt].sX + 5);
        sCenY = (gsInvDescY + gItemDescAttachmentsXY[cnt].sY - 1);

        INVRenderItem(guiSAVEBUFFER, NULL, gpItemDescObject, sCenX, sCenY, gItemDescAttachmentsXY[cnt].sWidth, gItemDescAttachmentsXY[cnt].sHeight, DIRTYLEVEL2, NULL, (RENDER_ITEM_ATTACHMENT1 + cnt), FALSE, 0);

        sCenX = sCenX - gItemDescAttachmentsXY[cnt].sBarDx;
        sCenY = sCenY + gItemDescAttachmentsXY[cnt].sBarDy;
        DrawItemUIBarEx(gpItemDescObject, (DRAW_ITEM_STATUS_ATTACHMENT1 + cnt), sCenX, sCenY, ITEM_BAR_WIDTH, ITEM_BAR_HEIGHT, Get16BPPColor(STATUS_BAR), Get16BPPColor(STATUS_BAR_SHADOW), TRUE, guiSAVEBUFFER);

        SetRegionFastHelpText(&(gItemDescAttachmentRegions[cnt]), ItemNames[gpItemDescObject->usAttachItem[cnt]]);
        SetRegionHelpEndCallback(&(gItemDescAttachmentRegions[cnt]), HelpTextDoneCallback);
      } else {
        SetRegionFastHelpText(&(gItemDescAttachmentRegions[cnt]), Message[STR_ATTACHMENTS]);
        SetRegionHelpEndCallback(&(gItemDescAttachmentRegions[cnt]), HelpTextDoneCallback);
      }
      if (fHatchOutAttachments) {
        // UINT32 uiWhichBuffer = ( guiCurrentItemDescriptionScreen == MAP_SCREEN ) ? guiSAVEBUFFER : guiRENDERBUFFER;
        DrawHatchOnInventory(guiSAVEBUFFER, (gsInvDescX + gItemDescAttachmentsXY[cnt].sX), (gsInvDescY + gItemDescAttachmentsXY[cnt].sY - 2), (gItemDescAttachmentsXY[cnt].sWidth + gItemDescAttachmentsXY[cnt].sBarDx), (gItemDescAttachmentsXY[cnt].sHeight + 2));
      }
    }

    if (Item[gpItemDescObject->usItem].usItemClass & IC_GUN) {
      // display bullets for ROF
      BltVideoObjectFromIndex(guiSAVEBUFFER, guiBullet, 0, BULLET_SING_X, BULLET_SING_Y, VO_BLT_SRCTRANSPARENCY, NULL);

      if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst > 0) {
        for (cnt = 0; cnt < Weapon[gpItemDescObject->usItem].ubShotsPerBurst; cnt++) {
          BltVideoObjectFromIndex(guiSAVEBUFFER, guiBullet, 0, BULLET_BURST_X + cnt * (BULLET_WIDTH + 1), BULLET_BURST_Y, VO_BLT_SRCTRANSPARENCY, NULL);
        }
      }
    }

    RestoreExternBackgroundRect(gsInvDescX, gsInvDescY, ITEMDESC_WIDTH, ITEMDESC_HEIGHT);

    // Render font desc
    SetFont(ITEMDESC_FONT);
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_FCOLOR_WHITE);
    SetFontShadow(ITEMDESC_FONTSHADOW3);

// Render name
// SET CLIPPING RECT FOR FONTS
    mprintf(ITEMDESC_NAME_X, ITEMDESC_NAME_Y, L"%s", gzItemName);

    // Render caliber and description

    SetFontForeground(FONT_BLACK);
    SetFontShadow(ITEMDESC_FONTSHADOW2);

    DisplayWrappedString(ITEMDESC_DESC_START_X, ITEMDESC_DESC_START_Y, ITEMDESC_DESC_WIDTH, 2, ITEMDESC_FONT, FONT_BLACK, gzItemDesc, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

    if (ITEM_PROS_AND_CONS(gpItemDescObject->usItem)) {
      if ((gpItemDescObject->usItem == ROCKET_RIFLE || gpItemDescObject->usItem == AUTO_ROCKET_RIFLE) && gpItemDescObject->ubImprintID < NO_PROFILE) {
        // add name noting imprint
        swprintf(pStr, L"%s %s (%s)", AmmoCaliber[Weapon[gpItemDescObject->usItem].ubCalibre], WeaponType[Weapon[gpItemDescObject->usItem].ubWeaponType], gMercProfiles[gpItemDescObject->ubImprintID].zNickname);
      } else {
        swprintf(pStr, L"%s %s", AmmoCaliber[Weapon[gpItemDescObject->usItem].ubCalibre], WeaponType[Weapon[gpItemDescObject->usItem].ubWeaponType]);
      }

      FindFontRightCoordinates(ITEMDESC_CALIBER_X, ITEMDESC_CALIBER_Y, ITEMDESC_CALIBER_WIDTH, ITEM_STATS_HEIGHT, pStr, ITEMDESC_FONT, &usX, &usY);
      mprintf(usX, usY, pStr);

      SetFontForeground(FONT_MCOLOR_DKWHITE2);
      SetFontShadow(ITEMDESC_FONTSHADOW3);
      mprintf(ITEMDESC_PROS_START_X, ITEMDESC_PROS_START_Y, gzProsLabel);

      sProsConsIndent = __max(StringPixLength(gzProsLabel, ITEMDESC_FONT), StringPixLength(gzConsLabel, ITEMDESC_FONT)) + 10;

      gzItemPros[0] = 0;
      GenerateProsString(gzItemPros, gpItemDescObject, ITEMDESC_DESC_WIDTH - sProsConsIndent - StringPixLength(DOTDOTDOT, ITEMDESC_FONT));
      if (gzItemPros[0] != 0) {
        SetFontForeground(FONT_BLACK);
        SetFontShadow(ITEMDESC_FONTSHADOW2);
        DisplayWrappedString((ITEMDESC_PROS_START_X + sProsConsIndent), ITEMDESC_PROS_START_Y, (ITEMDESC_DESC_WIDTH - sProsConsIndent), 2, ITEMDESC_FONT, FONT_BLACK, gzItemPros, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
      }

      SetFontForeground(FONT_MCOLOR_DKWHITE2);
      SetFontShadow(ITEMDESC_FONTSHADOW3);
      mprintf(ITEMDESC_CONS_START_X, ITEMDESC_CONS_START_Y, gzConsLabel);

      GenerateConsString(gzItemCons, gpItemDescObject, ITEMDESC_DESC_WIDTH - sProsConsIndent - StringPixLength(DOTDOTDOT, ITEMDESC_FONT));
      if (gzItemCons[0] != 0) {
        SetFontForeground(FONT_BLACK);
        SetFontShadow(ITEMDESC_FONTSHADOW2);
        DisplayWrappedString((ITEMDESC_CONS_START_X + sProsConsIndent), ITEMDESC_CONS_START_Y, (ITEMDESC_DESC_WIDTH - sProsConsIndent), 2, ITEMDESC_FONT, FONT_BLACK, gzItemCons, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
      }
    }

    // Get length of string
    uiRightLength = 35;

    // Calculate total weight of item and attachments
    fWeight = (CalculateObjectWeight(gpItemDescObject)) / 10;
    if (!gGameSettings.fOptions[TOPTION_USE_METRIC_SYSTEM]) {
      fWeight = fWeight * 2.2f;
    }

    if (fWeight < 0.1) {
      fWeight = 0.1;
    }

    // Render, stat  name
    if (Item[gpItemDescObject->usItem].usItemClass & IC_WEAPON) {
      SetFont(BLOCKFONT2);
      SetFontForeground(6);
      SetFontShadow(DEFAULT_SHADOW);

      // LABELS
      swprintf(sTempString, gWeaponStatsDesc[0], GetWeightUnitString());
      mprintf(gWeaponStats[0].sX + gsInvDescX, gWeaponStats[0].sY + gsInvDescY, sTempString);
      //		mprintf( gWeaponStats[ 1 ].sX + gsInvDescX, gWeaponStats[ 1 ].sY + gsInvDescY, L"%s", gWeaponStatsDesc[ 1 ].zDesc );
      //		mprintf( gWeaponStats[ 2 ].sX + gsInvDescX, gWeaponStats[ 2 ].sY + gsInvDescY, L"%s", gWeaponStats[ 2 ].zDesc );
      if (Item[gpItemDescObject->usItem].usItemClass & (IC_GUN | IC_LAUNCHER)) {
        mprintf(gWeaponStats[3].sX + gsInvDescX, gWeaponStats[3].sY + gsInvDescY, L"%s", gWeaponStatsDesc[3]);
      }
      if (!(Item[gpItemDescObject->usItem].usItemClass & IC_LAUNCHER) && gpItemDescObject->usItem != ROCKET_LAUNCHER) {
        mprintf(gWeaponStats[4].sX + gsInvDescX, gWeaponStats[4].sY + gsInvDescY, L"%s", gWeaponStatsDesc[4]);
      }
      mprintf(gWeaponStats[5].sX + gsInvDescX, gWeaponStats[5].sY + gsInvDescY, L"%s", gWeaponStatsDesc[5]);
      if (Item[gpItemDescObject->usItem].usItemClass & IC_GUN) {
        mprintf(gWeaponStats[7].sX + gsInvDescX, gWeaponStats[7].sY + gsInvDescY, L"%s", gWeaponStatsDesc[7]);
      }
      mprintf(gWeaponStats[1].sX + gsInvDescX, gWeaponStats[1].sY + gsInvDescY, L"%s", gWeaponStatsDesc[1]);

      if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst > 0) {
        mprintf(gWeaponStats[8].sX + gsInvDescX, gWeaponStats[8].sY + gsInvDescY, L"%s", gWeaponStatsDesc[8]);
      }

      // Values
      if (fWeight <= (EXCEPTIONAL_WEIGHT / 10)) {
        SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
      } else {
        SetFontForeground(5);
      }

      // Status
      swprintf(pStr, L"%2d%%", gpItemDescObject->bGunStatus);
      FindFontRightCoordinates((gWeaponStats[1].sX + gsInvDescX + gWeaponStats[1].sValDx), (gWeaponStats[1].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      wcscat(pStr, L"%%");
      mprintf(usX, usY, pStr);

      // Wieght
      swprintf(pStr, L"%1.1f", fWeight);
      FindFontRightCoordinates((gWeaponStats[0].sX + gsInvDescX + gWeaponStats[0].sValDx), (gWeaponStats[0].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);

      if (Item[gpItemDescObject->usItem].usItemClass & (IC_GUN | IC_LAUNCHER)) {
        if (GunRange(gpItemDescObject) >= EXCEPTIONAL_RANGE) {
          SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
        } else {
          SetFontForeground(5);
        }

        swprintf(pStr, L"%2d", (GunRange(gpItemDescObject)) / 10);
        FindFontRightCoordinates((gWeaponStats[3].sX + gsInvDescX + gWeaponStats[3].sValDx), (gWeaponStats[3].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }

      if (!(Item[gpItemDescObject->usItem].usItemClass & IC_LAUNCHER) && gpItemDescObject->usItem != ROCKET_LAUNCHER) {
        if (Weapon[gpItemDescObject->usItem].ubImpact >= EXCEPTIONAL_DAMAGE) {
          SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
        } else {
          SetFontForeground(5);
        }

        swprintf(pStr, L"%2d", Weapon[gpItemDescObject->usItem].ubImpact);
        FindFontRightCoordinates((gWeaponStats[4].sX + gsInvDescX + gWeaponStats[4].sValDx), (gWeaponStats[4].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }

      ubAttackAPs = BaseAPsToShootOrStab(DEFAULT_APS, DEFAULT_AIMSKILL, gpItemDescObject);

      if (ubAttackAPs <= EXCEPTIONAL_AP_COST) {
        SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
      } else {
        SetFontForeground(5);
      }

      swprintf(pStr, L"%2d", ubAttackAPs);
      FindFontRightCoordinates((gWeaponStats[5].sX + gsInvDescX + gWeaponStats[5].sValDx), (gWeaponStats[5].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);

      if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst > 0) {
        if (Weapon[gpItemDescObject->usItem].ubShotsPerBurst >= EXCEPTIONAL_BURST_SIZE || gpItemDescObject->usItem == G11) {
          SetFontForeground(ITEMDESC_FONTHIGHLIGHT);
        } else {
          SetFontForeground(5);
        }

        swprintf(pStr, L"%2d", ubAttackAPs + CalcAPsToBurst(DEFAULT_APS, gpItemDescObject));
        FindFontRightCoordinates((gWeaponStats[6].sX + gsInvDescX + gWeaponStats[6].sValDx), (gWeaponStats[6].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }
    } else if (gpItemDescObject->usItem == MONEY) {
      // Labels
      SetFont(BLOCKFONT2);
      SetFontShadow(DEFAULT_SHADOW);

      SetFontForeground(6);

      // Display the 'Seperate text'

      // if the player is removing money from the players account
      if (gfAddingMoneyToMercFromPlayersAccount)
        mprintf((gMoneyButtonLoc.x + gMoneyButtonOffsets[4].x), (gMoneyButtonLoc.y + gMoneyButtonOffsets[4].y), gzMoneyAmounts[5]);
      else
        mprintf((gMoneyButtonLoc.x + gMoneyButtonOffsets[4].x), (gMoneyButtonLoc.y + gMoneyButtonOffsets[4].y), gzMoneyAmounts[4]);

      // if the player is taking money from their account
      if (gfAddingMoneyToMercFromPlayersAccount) {
        // Display the 'Removing'
        mprintf(gMoneyStats[0].sX + gsInvDescX, gMoneyStats[0].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_PLAYERS]);
        // Display the 'REmaining'
        mprintf(gMoneyStats[2].sX + gsInvDescX, gMoneyStats[2].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_AMOUNT_2_WITHDRAW]);
      } else {
        // Display the 'Removing'
        mprintf(gMoneyStats[0].sX + gsInvDescX, gMoneyStats[0].sY + gsInvDescY, L"%s", gMoneyStatsDesc[0]);
        // Display the 'REmaining'
        mprintf(gMoneyStats[2].sX + gsInvDescX, gMoneyStats[2].sY + gsInvDescY, L"%s", gMoneyStatsDesc[2]);
      }

      // Total Amount
      SetFontForeground(FONT_WHITE);
      swprintf(pStr, L"%d", gRemoveMoney.uiTotalAmount);
      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);
      FindFontRightCoordinates((ITEMDESC_NAME_X), (ITEMDESC_NAME_Y), 295, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);

      SetFontForeground(6);

      // if the player is taking money from their account
      if (gfAddingMoneyToMercFromPlayersAccount) {
        // Display the 'Amt removing'
        mprintf(gMoneyStats[1].sX + gsInvDescX, gMoneyStats[1].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_BALANCE]);
        // Display the 'REmaining amount'
        mprintf(gMoneyStats[3].sX + gsInvDescX, gMoneyStats[3].sY + gsInvDescY, L"%s", gMoneyStatsDesc[MONEY_DESC_TO_WITHDRAW]);
      } else {
        // Display the 'Amt removing'
        mprintf(gMoneyStats[1].sX + gsInvDescX, gMoneyStats[1].sY + gsInvDescY, L"%s", gMoneyStatsDesc[1]);
        // Display the 'REmaining amount'
        mprintf(gMoneyStats[3].sX + gsInvDescX, gMoneyStats[3].sY + gsInvDescY, L"%s", gMoneyStatsDesc[3]);
      }

      // Values
      SetFontForeground(5);

      // Display the total amount of money remaining
      swprintf(pStr, L"%ld", gRemoveMoney.uiMoneyRemaining);
      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);
      FindFontRightCoordinates((gMoneyStats[1].sX + gsInvDescX + gMoneyStats[1].sValDx), (gMoneyStats[1].sY + gsInvDescY), (ITEM_STATS_WIDTH - 3), ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);

      // Display the total amount of money removing
      swprintf(pStr, L"%ld", gRemoveMoney.uiMoneyRemoving);
      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);
      FindFontRightCoordinates((gMoneyStats[3].sX + gsInvDescX + gMoneyStats[3].sValDx), (gMoneyStats[3].sY + gsInvDescY), (ITEM_STATS_WIDTH - 3), ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);
    } else if (Item[gpItemDescObject->usItem].usItemClass == IC_MONEY) {
      SetFontForeground(FONT_FCOLOR_WHITE);
      SetFontShadow(DEFAULT_SHADOW);
      swprintf(pStr, L"%ld", gpItemDescObject->uiMoneyAmount);
      InsertCommasForDollarFigure(pStr);
      InsertDollarSignInToString(pStr);

      FindFontRightCoordinates((ITEMDESC_NAME_X), (ITEMDESC_NAME_Y), 295, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);
    } else {
      // Labels
      SetFont(BLOCKFONT2);
      SetFontForeground(6);
      SetFontShadow(DEFAULT_SHADOW);

      if (Item[gpItemDescObject->usItem].usItemClass & IC_AMMO) {
        // Status
        mprintf(gWeaponStats[2].sX + gsInvDescX, gWeaponStats[2].sY + gsInvDescY, L"%s", gWeaponStatsDesc[2]);
      } else {
        mprintf(gWeaponStats[1].sX + gsInvDescX, gWeaponStats[1].sY + gsInvDescY, L"%s", gWeaponStatsDesc[1]);
      }

      // Weight
      swprintf(sTempString, gWeaponStatsDesc[0], GetWeightUnitString());
      mprintf(gWeaponStats[0].sX + gsInvDescX, gWeaponStats[0].sY + gsInvDescY, sTempString);

      // Values
      SetFontForeground(5);

      if (Item[gpItemDescObject->usItem].usItemClass & IC_AMMO) {
        // Ammo - print amount
        // Status
        swprintf(pStr, L"%d/%d", gpItemDescObject->ubShotsLeft[0], Magazine[Item[gpItemDescObject->usItem].ubClassIndex].ubMagSize);
        FindFontRightCoordinates((gWeaponStats[2].sX + gsInvDescX + gWeaponStats[2].sValDx), (gWeaponStats[2].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      } else {
        // Status
        swprintf(pStr, L"%2d%%", gpItemDescObject->bStatus[gubItemDescStatusIndex]);
        FindFontRightCoordinates((gWeaponStats[1].sX + gsInvDescX + gWeaponStats[1].sValDx), (gWeaponStats[1].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        wcscat(pStr, L"%%");
        mprintf(usX, usY, pStr);
      }

      if ((InKeyRingPopup() == TRUE) || (Item[gpItemDescObject->usItem].usItemClass & IC_KEY)) {
        SetFontForeground(6);

        // build description for keys .. the sector found
        swprintf(pStr, L"%s", sKeyDescriptionStrings[0]);
        mprintf(gWeaponStats[4].sX + gsInvDescX, gWeaponStats[4].sY + gsInvDescY, pStr);
        swprintf(pStr, L"%s", sKeyDescriptionStrings[1]);
        mprintf(gWeaponStats[4].sX + gsInvDescX, gWeaponStats[4].sY + gsInvDescY + GetFontHeight(BLOCKFONT) + 2, pStr);

        SetFontForeground(5);
        GetShortSectorString(SECTORX(KeyTable[gpItemDescObject->ubKeyID].usSectorFound), SECTORY(KeyTable[gpItemDescObject->ubKeyID].usSectorFound), sTempString);
        swprintf(pStr, L"%s", sTempString);
        FindFontRightCoordinates((gWeaponStats[4].sX + gsInvDescX), (gWeaponStats[4].sY + gsInvDescY), 110, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);

        swprintf(pStr, L"%d", KeyTable[gpItemDescObject->ubKeyID].usDateFound);
        FindFontRightCoordinates((gWeaponStats[4].sX + gsInvDescX), (gWeaponStats[4].sY + gsInvDescY + GetFontHeight(BLOCKFONT) + 2), 110, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
        mprintf(usX, usY, pStr);
      }

      // Weight
      swprintf(pStr, L"%1.1f", fWeight);
      FindFontRightCoordinates((gWeaponStats[0].sX + gsInvDescX + gWeaponStats[0].sValDx), (gWeaponStats[0].sY + gsInvDescY), ITEM_STATS_WIDTH, ITEM_STATS_HEIGHT, pStr, BLOCKFONT2, &usX, &usY);
      mprintf(usX, usY, pStr);
    }

    SetFontShadow(DEFAULT_SHADOW);
  }
}

function HandleItemDescriptionBox(pfDirty: Pointer<BOOLEAN>): void {
  if (fItemDescDelete) {
    DeleteItemDescriptionBox();
    fItemDescDelete = FALSE;
    *pfDirty = DIRTYLEVEL2;
  }
}

function DeleteItemDescriptionBox(): void {
  let cnt: INT32;
  let cnt2: INT32;
  let fFound: BOOLEAN;
  let fAllFound: BOOLEAN;

  if (gfInItemDescBox == FALSE) {
    return;
  }

  //	DEF:

  // Used in the shopkeeper interface
  if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
    DeleteShopKeeperItemDescBox();
  }

  // check for any AP costs
  if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gpAttachSoldier) {
      // check for change in attachments, starting with removed attachments
      fAllFound = TRUE;
      for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
        if (gusOriginalAttachItem[cnt] != NOTHING) {
          fFound = FALSE;
          for (cnt2 = 0; cnt2 < MAX_ATTACHMENTS; cnt2++) {
            if ((gusOriginalAttachItem[cnt] == gpItemDescObject->usAttachItem[cnt2]) && (gpItemDescObject->bAttachStatus[cnt2] == gbOriginalAttachStatus[cnt])) {
              fFound = TRUE;
            }
          }
          if (!fFound) {
            // charge APs
            fAllFound = FALSE;
            break;
          }
        }
      }

      if (fAllFound) {
        // nothing was removed; search for attachment added
        for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
          if (gpItemDescObject->usAttachItem[cnt] != NOTHING) {
            fFound = FALSE;
            for (cnt2 = 0; cnt2 < MAX_ATTACHMENTS; cnt2++) {
              if ((gpItemDescObject->usAttachItem[cnt] == gusOriginalAttachItem[cnt2]) && (gbOriginalAttachStatus[cnt2] == gpItemDescObject->bAttachStatus[cnt])) {
                fFound = TRUE;
              }
            }
            if (!fFound) {
              // charge APs
              fAllFound = FALSE;
              break;
            }
          }
        }
      }

      if (!fAllFound) {
        DeductPoints(gpAttachSoldier, AP_RELOAD_GUN, 0);
      }
    }
  }

  // Remove
  DeleteVideoObjectFromIndex(guiItemDescBox);
  DeleteVideoObjectFromIndex(guiMapItemDescBox);
  DeleteVideoObjectFromIndex(guiBullet);
  // Delete item graphic
  DeleteVideoObjectFromIndex(guiItemGraphic);

  gfInItemDescBox = FALSE;

  //	if( guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN  )
  if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
    UnloadButtonImage(giMapInvDescButtonImage);
    RemoveButton(giMapInvDescButton);
  }

  // Remove region
  MSYS_RemoveRegion(&gInvDesc);

  if (gpItemDescObject->usItem != MONEY) {
    for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
      MSYS_RemoveRegion(&gItemDescAttachmentRegions[cnt]);
    }
  } else {
    UnloadButtonImage(guiMoneyButtonImage);
    UnloadButtonImage(guiMoneyDoneButtonImage);
    for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
      RemoveButton(guiMoneyButtonBtn[cnt]);
    }
  }

  if (ITEM_PROS_AND_CONS(gpItemDescObject->usItem)) {
    MSYS_RemoveRegion(&gProsAndConsRegions[0]);
    MSYS_RemoveRegion(&gProsAndConsRegions[1]);
  }

  if (((Item[gpItemDescObject->usItem].usItemClass & IC_GUN) && gpItemDescObject->usItem != ROCKET_LAUNCHER)) {
    // Remove button
    UnloadButtonImage(giItemDescAmmoButtonImages);
    RemoveButton(giItemDescAmmoButton);
  }
  //	if(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN )
  if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
    fCharacterInfoPanelDirty = TRUE;
    fMapPanelDirty = TRUE;
    fTeamPanelDirty = TRUE;
    fMapScreenBottomDirty = TRUE;
  }

  if (InKeyRingPopup() == TRUE) {
    DeleteKeyObject(gpItemDescObject);
    gpItemDescObject = NULL;
    fShowDescriptionFlag = FALSE;
    fInterfacePanelDirty = DIRTYLEVEL2;
    return;
  }

  fShowDescriptionFlag = FALSE;
  fInterfacePanelDirty = DIRTYLEVEL2;

  if (gpItemDescObject->usItem == MONEY) {
    // if there is no money remaining
    if (gRemoveMoney.uiMoneyRemaining == 0 && !gfAddingMoneyToMercFromPlayersAccount) {
      // get rid of the money in the slot
      memset(gpItemDescObject, 0, sizeof(OBJECTTYPE));
      gpItemDescObject = NULL;
    }
  }

  if (gfAddingMoneyToMercFromPlayersAccount)
    gfAddingMoneyToMercFromPlayersAccount = FALSE;

  gfItemDescObjectIsAttachment = FALSE;
}

function InternalBeginItemPointer(pSoldier: Pointer<SOLDIERTYPE>, pObject: Pointer<OBJECTTYPE>, bHandPos: INT8): void {
  //	BOOLEAN fOk;

  // If not null return
  if (gpItemPointer != NULL) {
    return;
  }

  // Copy into cursor...
  memcpy(&gItemPointer, pObject, sizeof(OBJECTTYPE));

  // Dirty interface
  fInterfacePanelDirty = DIRTYLEVEL2;
  gpItemPointer = &gItemPointer;
  gpItemPointerSoldier = pSoldier;
  gbItemPointerSrcSlot = bHandPos;
  gbItemPointerLocateGood = TRUE;

  CheckForDisabledForGiveItem();

  EnableSMPanelButtons(FALSE, TRUE);

  gfItemPointerDifferentThanDefault = FALSE;

  // re-evaluate repairs
  gfReEvaluateEveryonesNothingToDo = TRUE;
}

function BeginItemPointer(pSoldier: Pointer<SOLDIERTYPE>, ubHandPos: UINT8): void {
  let fOk: BOOLEAN;
  let pObject: OBJECTTYPE;

  memset(&pObject, 0, sizeof(OBJECTTYPE));

  if (_KeyDown(SHIFT)) {
    // Remove all from soldier's slot
    fOk = RemoveObjectFromSlot(pSoldier, ubHandPos, &pObject);
  } else {
    GetObjFrom(&(pSoldier->inv[ubHandPos]), 0, &pObject);
    fOk = (pObject.ubNumberOfObjects == 1);
  }
  if (fOk) {
    InternalBeginItemPointer(pSoldier, &pObject, ubHandPos);
  }
}

function BeginKeyRingItemPointer(pSoldier: Pointer<SOLDIERTYPE>, ubKeyRingPosition: UINT8): void {
  let fOk: BOOLEAN;

  // If not null return
  if (gpItemPointer != NULL) {
    return;
  }

  if (_KeyDown(SHIFT)) {
    // Remove all from soldier's slot
    fOk = RemoveKeysFromSlot(pSoldier, ubKeyRingPosition, pSoldier->pKeyRing[ubKeyRingPosition].ubNumber, &gItemPointer);
  } else {
    RemoveKeyFromSlot(pSoldier, ubKeyRingPosition, &gItemPointer);
    fOk = (gItemPointer.ubNumberOfObjects == 1);
  }

  if (fOk) {
    // ATE: Look if we are a BLOODIED KNIFE, and change if so, making guy scream...

    // Dirty interface
    fInterfacePanelDirty = DIRTYLEVEL2;
    gpItemPointer = &gItemPointer;
    gpItemPointerSoldier = pSoldier;
    gbItemPointerSrcSlot = ubKeyRingPosition;

    if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
      guiExternVo = GetInterfaceGraphicForItem(&(Item[gpItemPointer->usItem]));
      gusExternVoSubIndex = Item[gpItemPointer->usItem].ubGraphicNum;

      fMapInventoryItem = TRUE;
      MSYS_ChangeRegionCursor(&gMPanelRegion, EXTERN_CURSOR);
      MSYS_SetCurrentCursor(EXTERN_CURSOR);
    }
  } else {
    // Debug mesg
  }

  gfItemPointerDifferentThanDefault = FALSE;
}

function EndItemPointer(): void {
  if (gpItemPointer != NULL) {
    gpItemPointer = NULL;
    gbItemPointerSrcSlot = NO_SLOT;
    MSYS_ChangeRegionCursor(&gSMPanelRegion, CURSOR_NORMAL);
    MSYS_SetCurrentCursor(CURSOR_NORMAL);

    if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
      memset(&gMoveingItem, 0, sizeof(INVENTORY_IN_SLOT));
      SetSkiCursor(CURSOR_NORMAL);
    } else {
      EnableSMPanelButtons(TRUE, TRUE);
    }

    gbItemPointerLocateGood = FALSE;

    // re-evaluate repairs
    gfReEvaluateEveryonesNothingToDo = TRUE;
  }
}

function DrawItemFreeCursor(): void {
  // OBJECTTYPE		*gpItemPointer;
  // UINT16				usItemSnapCursor;

  // Get usIndex and then graphic for item
  guiExternVo = GetInterfaceGraphicForItem(&(Item[gpItemPointer->usItem]));
  gusExternVoSubIndex = Item[gpItemPointer->usItem].ubGraphicNum;

  MSYS_ChangeRegionCursor(&gSMPanelRegion, EXTERN_CURSOR);
  MSYS_SetCurrentCursor(EXTERN_CURSOR);
}

function HideItemTileCursor(): void {
  //	RemoveTopmost( gusCurMousePos, gusItemPointer );
}

function SoldierCanSeeCatchComing(pSoldier: Pointer<SOLDIERTYPE>, sSrcGridNo: INT16): BOOLEAN {
  return TRUE;
  /*-
          INT32							cnt;
          INT8							bDirection, bTargetDirection;

          bTargetDirection = (INT8)GetDirectionToGridNoFromGridNo( pSoldier->sGridNo, sSrcGridNo );

          // Look 3 directions Clockwise from what we are facing....
          bDirection = pSoldier->bDirection;

          for ( cnt = 0; cnt < 3; cnt++ )
          {
                  if ( bDirection == bTargetDirection )
                  {
                          return( TRUE );
                  }

                  bDirection = gOneCDirection[ bDirection ];
          }

          // Look 3 directions CounterClockwise from what we are facing....
          bDirection = pSoldier->bDirection;

          for ( cnt = 0; cnt < 3; cnt++ )
          {
                  if ( bDirection == bTargetDirection )
                  {
                          return( TRUE );
                  }

                  bDirection = gOneCCDirection[ bDirection ];
          }

          // If here, nothing good can happen!
          return( FALSE );
  -*/
}

function DrawItemTileCursor(): void {
  let usMapPos: UINT16;
  let usIndex: UINT16;
  let ubSoldierID: UINT8;
  let sAPCost: INT16;
  let fRecalc: BOOLEAN;
  let uiCursorFlags: UINT32;
  let sFinalGridNo: INT16;
  let uiCursorId: UINT32 = CURSOR_ITEM_GOOD_THROW;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fGiveItem: BOOLEAN = FALSE;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  /* static */ let uiOldCursorId: UINT32 = 0;
  /* static */ let usOldMousePos: UINT16 = 0;
  let sEndZ: INT16 = 0;
  let sDist: INT16;
  let bLevel: INT8;

  if (GetMouseMapPos(&usMapPos)) {
    if (gfUIFullTargetFound) {
      // Force mouse position to guy...
      usMapPos = MercPtrs[gusUIFullTargetID]->sGridNo;
    }

    gusCurMousePos = usMapPos;

    if (gusCurMousePos != usOldMousePos) {
      gfItemPointerDifferentThanDefault = FALSE;
    }

    // Save old one..
    usOldMousePos = gusCurMousePos;

    // Default to turning adjacent area gridno off....
    gfUIHandleShowMoveGrid = FALSE;

    // If we are over a talkable guy, set flag
    if (IsValidTalkableNPCFromMouse(&ubSoldierID, TRUE, FALSE, TRUE)) {
      fGiveItem = TRUE;
    }

    // OK, if different than default, change....
    if (gfItemPointerDifferentThanDefault) {
      fGiveItem = !fGiveItem;
    }

    // Get recalc and cursor flags
    fRecalc = GetMouseRecalcAndShowAPFlags(&uiCursorFlags, NULL);

    // OK, if we begin to move, reset the cursor...
    if (uiCursorFlags & MOUSE_MOVING) {
      EndPhysicsTrajectoryUI();
    }

    // Get Pyth spaces away.....
    sDist = PythSpacesAway(gpItemPointerSoldier->sGridNo, gusCurMousePos);

    // If we are here and we are not selected, select!
    // ATE Design discussion propably needed here...
    if (gpItemPointerSoldier->ubID != gusSelectedSoldier) {
      SelectSoldier(gpItemPointerSoldier->ubID, FALSE, FALSE);
    }

    // ATE: if good for locate, locate to selected soldier....
    if (gbItemPointerLocateGood) {
      gbItemPointerLocateGood = FALSE;
      LocateSoldier(gusSelectedSoldier, FALSE);
    }

    if (!fGiveItem) {
      if (UIHandleOnMerc(FALSE) && usMapPos != gpItemPointerSoldier->sGridNo) {
        // We are on a guy.. check if they can catch or not....
        if (gfUIFullTargetFound) {
          // Get soldier
          pSoldier = MercPtrs[gusUIFullTargetID];

          // Are they on our team?
          // ATE: Can't be an EPC
          if (pSoldier->bTeam == gbPlayerNum && !AM_AN_EPC(pSoldier) && !(pSoldier->uiStatusFlags & SOLDIER_VEHICLE)) {
            if (sDist <= PASSING_ITEM_DISTANCE_OKLIFE) {
              // OK, on a valid pass
              gfUIMouseOnValidCatcher = 4;
              gubUIValidCatcherID = gusUIFullTargetID;
            } else {
              // Can they see the throw?
              if (SoldierCanSeeCatchComing(pSoldier, gpItemPointerSoldier->sGridNo)) {
                // OK, set global that this buddy can see catch...
                gfUIMouseOnValidCatcher = TRUE;
                gubUIValidCatcherID = gusUIFullTargetID;
              }
            }
          }
        }
      }

      // We're going to toss it!
      if (gTacticalStatus.uiFlags & INCOMBAT) {
        gfUIDisplayActionPoints = TRUE;
        gUIDisplayActionPointsOffX = 15;
        gUIDisplayActionPointsOffY = 15;
      }

      // If we are tossing...
      if (sDist <= 1 && gfUIMouseOnValidCatcher == 0 || gfUIMouseOnValidCatcher == 4) {
        gsCurrentActionPoints = AP_PICKUP_ITEM;
      } else {
        gsCurrentActionPoints = AP_TOSS_ITEM;
      }
    } else {
      if (gfUIFullTargetFound) {
        UIHandleOnMerc(FALSE);

        // OK, set global that this buddy can see catch...
        gfUIMouseOnValidCatcher = 2;
        gubUIValidCatcherID = gusUIFullTargetID;

        // If this is a robot, change to say 'reload'
        if (MercPtrs[gusUIFullTargetID]->uiStatusFlags & SOLDIER_ROBOT) {
          gfUIMouseOnValidCatcher = 3;
        }

        if (!(uiCursorFlags & MOUSE_MOVING)) {
          // Find adjacent gridno...
          sActionGridNo = FindAdjacentGridEx(gpItemPointerSoldier, gusCurMousePos, &ubDirection, NULL, FALSE, FALSE);
          if (sActionGridNo == -1) {
            sActionGridNo = gusCurMousePos;
          }

          // Display location...
          gsUIHandleShowMoveGridLocation = sActionGridNo;
          gfUIHandleShowMoveGrid = TRUE;

          // Get AP cost
          if (MercPtrs[gusUIFullTargetID]->uiStatusFlags & SOLDIER_ROBOT) {
            sAPCost = GetAPsToReloadRobot(gpItemPointerSoldier, MercPtrs[gusUIFullTargetID]);
          } else {
            sAPCost = GetAPsToGiveItem(gpItemPointerSoldier, sActionGridNo);
          }

          gsCurrentActionPoints = sAPCost;
        }

        // Set value
        if (gTacticalStatus.uiFlags & INCOMBAT) {
          gfUIDisplayActionPoints = TRUE;
          gUIDisplayActionPointsOffX = 15;
          gUIDisplayActionPointsOffY = 15;
        }
      }
    }

    if (fGiveItem) {
      uiCursorId = CURSOR_ITEM_GIVE;
    } else {
      // How afar away are we?
      if (sDist <= 1 && gfUIMouseOnValidCatcher == 0) {
        // OK, we want to drop.....

        // Write the word 'drop' on cursor...
        wcscpy(gzIntTileLocation, pMessageStrings[MSG_DROP]);
        gfUIIntTileLocation = TRUE;
      } else {
        if (usMapPos == gpItemPointerSoldier->sGridNo) {
          EndPhysicsTrajectoryUI();
        } else if (gfUIMouseOnValidCatcher == 4) {
          // ATE: Don't do if we are passing....
        } else
        // ( sDist > PASSING_ITEM_DISTANCE_OKLIFE )
        {
          // Write the word 'drop' on cursor...
          if (gfUIMouseOnValidCatcher == 0) {
            wcscpy(gzIntTileLocation, pMessageStrings[MSG_THROW]);
            gfUIIntTileLocation = TRUE;
          }

          gfUIHandlePhysicsTrajectory = TRUE;

          if (fRecalc && usMapPos != gpItemPointerSoldier->sGridNo) {
            if (gfUIMouseOnValidCatcher) {
              switch (gAnimControl[MercPtrs[gubUIValidCatcherID]->usAnimState].ubHeight) {
                case ANIM_STAND:

                  sEndZ = 150;
                  break;

                case ANIM_CROUCH:

                  sEndZ = 80;
                  break;

                case ANIM_PRONE:

                  sEndZ = 10;
                  break;
              }

              if (MercPtrs[gubUIValidCatcherID]->bLevel > 0) {
                sEndZ = 0;
              }
            }

            // Calculate chance to throw here.....
            if (!CalculateLaunchItemChanceToGetThrough(gpItemPointerSoldier, gpItemPointer, usMapPos, gsInterfaceLevel, ((gsInterfaceLevel * 256) + sEndZ), &sFinalGridNo, FALSE, &bLevel, TRUE)) {
              gfBadThrowItemCTGH = TRUE;
            } else {
              gfBadThrowItemCTGH = FALSE;
            }

            BeginPhysicsTrajectoryUI(sFinalGridNo, bLevel, gfBadThrowItemCTGH);
          }
        }

        if (gfBadThrowItemCTGH) {
          uiCursorId = CURSOR_ITEM_BAD_THROW;
        }
      }
    }

    // Erase any cursor in viewport
    // MSYS_ChangeRegionCursor( &gViewportRegion , VIDEO_NO_CURSOR );

    // Get tile graphic fro item
    usIndex = GetTileGraphicForItem(&(Item[gpItemPointer->usItem]));

    // ONly load if different....
    if (usIndex != gusItemPointer || uiOldCursorId != uiCursorId) {
      // OK, Tile database gives me subregion and video object to use...
      SetExternVOData(uiCursorId, gTileDatabase[usIndex].hTileSurface, gTileDatabase[usIndex].usRegionIndex);
      gusItemPointer = usIndex;
      uiOldCursorId = uiCursorId;
    }

    MSYS_ChangeRegionCursor(&gViewportRegion, uiCursorId);
  }
}

function IsValidAmmoToReloadRobot(pSoldier: Pointer<SOLDIERTYPE>, pObject: Pointer<OBJECTTYPE>): BOOLEAN {
  if (!CompatibleAmmoForGun(pObject, &(pSoldier->inv[HANDPOS]))) {
    // Build string...
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ROBOT_NEEDS_GIVEN_CALIBER_STR], AmmoCaliber[Weapon[pSoldier->inv[HANDPOS].usItem].ubCalibre]);

    return FALSE;
  }

  return TRUE;
}

function HandleItemPointerClick(usMapPos: UINT16): BOOLEAN {
  // Determine what to do
  let ubDirection: UINT8;
  let ubSoldierID: UINT8;
  let usItem: UINT16;
  let sAPCost: INT16;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let ubThrowActionCode: UINT8 = 0;
  let uiThrowActionData: UINT32 = 0;
  let sEndZ: INT16 = 0;
  let fGiveItem: BOOLEAN = FALSE;
  let TempObject: OBJECTTYPE;
  let sGridNo: INT16;
  let sDist: INT16;
  let sDistVisible: INT16;

  if (SelectedGuyInBusyAnimation()) {
    return FALSE;
  }

  if (giUIMessageOverlay != -1) {
    EndUIMessage();
    return FALSE;
  }

  // Don't allow if our soldier is a # of things...
  if (AM_AN_EPC(gpItemPointerSoldier) || gpItemPointerSoldier->bLife < OKLIFE || gpItemPointerSoldier->bOverTerrainType == DEEP_WATER) {
    return FALSE;
  }

  // This implies we have no path....
  if (gsCurrentActionPoints == 0) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[NO_PATH]);
    return FALSE;
  }

  if (gfUIFullTargetFound) {
    // Force mouse position to guy...
    usMapPos = MercPtrs[gusUIFullTargetID]->sGridNo;

    if (gAnimControl[MercPtrs[gusUIFullTargetID]->usAnimState].uiFlags & ANIM_MOVING) {
      return FALSE;
    }
  }

  // Check if we have APs....
  if (!EnoughPoints(gpItemPointerSoldier, gsCurrentActionPoints, 0, TRUE)) {
    if (gfDontChargeAPsToPickup && gsCurrentActionPoints == AP_PICKUP_ITEM) {
    } else {
      return FALSE;
    }
  }

  // SEE IF WE ARE OVER A TALKABLE GUY!
  if (IsValidTalkableNPCFromMouse(&ubSoldierID, TRUE, FALSE, TRUE)) {
    fGiveItem = TRUE;
  }

  // OK, if different than default, change....
  if (gfItemPointerDifferentThanDefault) {
    fGiveItem = !fGiveItem;
  }

  // Get Pyth spaces away.....
  sDist = PythSpacesAway(gpItemPointerSoldier->sGridNo, gusCurMousePos);

  if (fGiveItem) {
    usItem = gpItemPointer->usItem;

    // If the target is a robot,
    if (MercPtrs[ubSoldierID]->uiStatusFlags & SOLDIER_ROBOT) {
      // Charge APs to reload robot!
      sAPCost = GetAPsToReloadRobot(gpItemPointerSoldier, MercPtrs[ubSoldierID]);
    } else {
      // Calculate action point costs!
      sAPCost = GetAPsToGiveItem(gpItemPointerSoldier, usMapPos);
    }

    // Place it back in our hands!

    memcpy(&TempObject, gpItemPointer, sizeof(OBJECTTYPE));

    if (gbItemPointerSrcSlot != NO_SLOT) {
      PlaceObject(gpItemPointerSoldier, gbItemPointerSrcSlot, gpItemPointer);
      fInterfacePanelDirty = DIRTYLEVEL2;
    }
    /*
                    //if the user just clicked on an arms dealer
                    if( IsMercADealer( MercPtrs[ ubSoldierID ]->ubProfile ) )
                    {
                            if ( EnoughPoints( gpItemPointerSoldier, sAPCost, 0, TRUE ) )
                            {
                                    //Enter the shopkeeper interface
                                    EnterShopKeeperInterfaceScreen( MercPtrs[ ubSoldierID ]->ubProfile );

                                    EndItemPointer( );
                            }

                            return( TRUE );
                    }
    */

    if (EnoughPoints(gpItemPointerSoldier, sAPCost, 0, TRUE)) {
      // If we are a robot, check if this is proper item to reload!
      if (MercPtrs[ubSoldierID]->uiStatusFlags & SOLDIER_ROBOT) {
        // Check if we can reload robot....
        if (IsValidAmmoToReloadRobot(MercPtrs[ubSoldierID], &TempObject)) {
          let sActionGridNo: INT16;
          let ubDirection: UINT8;
          let sAdjustedGridNo: INT16;

          // Walk up to him and reload!
          // See if we can get there to stab
          sActionGridNo = FindAdjacentGridEx(gpItemPointerSoldier, MercPtrs[ubSoldierID]->sGridNo, &ubDirection, &sAdjustedGridNo, TRUE, FALSE);

          if (sActionGridNo != -1 && gbItemPointerSrcSlot != NO_SLOT) {
            // Make a temp object for ammo...
            gpItemPointerSoldier->pTempObject = MemAlloc(sizeof(OBJECTTYPE));
            memcpy(gpItemPointerSoldier->pTempObject, &TempObject, sizeof(OBJECTTYPE));

            // Remove from soldier's inv...
            RemoveObjs(&(gpItemPointerSoldier->inv[gbItemPointerSrcSlot]), 1);

            gpItemPointerSoldier->sPendingActionData2 = sAdjustedGridNo;
            gpItemPointerSoldier->uiPendingActionData1 = gbItemPointerSrcSlot;
            gpItemPointerSoldier->bPendingActionData3 = ubDirection;
            gpItemPointerSoldier->ubPendingActionAnimCount = 0;

            // CHECK IF WE ARE AT THIS GRIDNO NOW
            if (gpItemPointerSoldier->sGridNo != sActionGridNo) {
              // SEND PENDING ACTION
              gpItemPointerSoldier->ubPendingAction = MERC_RELOADROBOT;

              // WALK UP TO DEST FIRST
              EVENT_InternalGetNewSoldierPath(gpItemPointerSoldier, sActionGridNo, gpItemPointerSoldier->usUIMovementMode, FALSE, FALSE);
            } else {
              EVENT_SoldierBeginReloadRobot(gpItemPointerSoldier, sAdjustedGridNo, ubDirection, gbItemPointerSrcSlot);
            }

            // OK, set UI
            SetUIBusy(gpItemPointerSoldier->ubID);
          }
        }

        gfDontChargeAPsToPickup = FALSE;
        EndItemPointer();
      } else {
        // if (gbItemPointerSrcSlot != NO_SLOT )
        {
          // Give guy this item.....
          SoldierGiveItem(gpItemPointerSoldier, MercPtrs[ubSoldierID], &TempObject, gbItemPointerSrcSlot);

          gfDontChargeAPsToPickup = FALSE;
          EndItemPointer();

          // If we are giving it to somebody not on our team....
          if (MercPtrs[ubSoldierID]->ubProfile < FIRST_RPC || RPC_RECRUITED(MercPtrs[ubSoldierID])) {
          } else {
            SetEngagedInConvFromPCAction(gpItemPointerSoldier);
          }
        }
      }
    }

    return TRUE;
  }

  // CHECK IF WE ARE NOT ON THE SAME GRIDNO
  if (sDist <= 1 && !(gfUIFullTargetFound && gusUIFullTargetID != gpItemPointerSoldier->ubID)) {
    // Check some things here....
    // 1 ) are we at the exact gridno that we stand on?
    if (usMapPos == gpItemPointerSoldier->sGridNo) {
      // Drop
      if (!gfDontChargeAPsToPickup) {
        // Deduct points
        DeductPoints(gpItemPointerSoldier, AP_PICKUP_ITEM, 0);
      }

      SoldierDropItem(gpItemPointerSoldier, gpItemPointer);
    } else {
      // Try to drop in an adjacent area....
      // 1 ) is this not a good OK destination
      // this will sound strange, but this is OK......
      if (!NewOKDestination(gpItemPointerSoldier, usMapPos, FALSE, gpItemPointerSoldier->bLevel) || FindBestPath(gpItemPointerSoldier, usMapPos, gpItemPointerSoldier->bLevel, WALKING, NO_COPYROUTE, 0) == 1) {
        // Drop
        if (!gfDontChargeAPsToPickup) {
          // Deduct points
          DeductPoints(gpItemPointerSoldier, AP_PICKUP_ITEM, 0);
        }

        // Play animation....
        // Don't show animation of dropping item, if we are not standing

        switch (gAnimControl[gpItemPointerSoldier->usAnimState].ubHeight) {
          case ANIM_STAND:

            gpItemPointerSoldier->pTempObject = MemAlloc(sizeof(OBJECTTYPE));
            if (gpItemPointerSoldier->pTempObject != NULL) {
              memcpy(gpItemPointerSoldier->pTempObject, gpItemPointer, sizeof(OBJECTTYPE));
              gpItemPointerSoldier->sPendingActionData2 = usMapPos;

              // Turn towards.....gridno
              EVENT_SetSoldierDesiredDirection(gpItemPointerSoldier, GetDirectionFromGridNo(usMapPos, gpItemPointerSoldier));

              EVENT_InitNewSoldierAnim(gpItemPointerSoldier, DROP_ADJACENT_OBJECT, 0, FALSE);
            }
            break;

          case ANIM_CROUCH:
          case ANIM_PRONE:

            AddItemToPool(usMapPos, gpItemPointer, 1, gpItemPointerSoldier->bLevel, 0, -1);
            NotifySoldiersToLookforItems();
            break;
        }
      } else {
        // Drop in place...
        if (!gfDontChargeAPsToPickup) {
          // Deduct points
          DeductPoints(gpItemPointerSoldier, AP_PICKUP_ITEM, 0);
        }

        SoldierDropItem(gpItemPointerSoldier, gpItemPointer);
      }
    }
  } else {
    sGridNo = usMapPos;

    if (sDist <= PASSING_ITEM_DISTANCE_OKLIFE && gfUIFullTargetFound && MercPtrs[gusUIFullTargetID]->bTeam == gbPlayerNum && !AM_AN_EPC(MercPtrs[gusUIFullTargetID]) && !(MercPtrs[gusUIFullTargetID]->uiStatusFlags & SOLDIER_VEHICLE)) {
      // OK, do the transfer...
      {
        pSoldier = MercPtrs[gusUIFullTargetID];

        {
          // Change to inventory....
          // gfSwitchPanel = TRUE;
          // gbNewPanel = SM_PANEL;
          // gubNewPanelParam = (UINT8)pSoldier->ubID;
          if (!EnoughPoints(pSoldier, 3, 0, TRUE) || !EnoughPoints(gpItemPointerSoldier, 3, 0, TRUE)) {
            return FALSE;
          }

          sDistVisible = DistanceVisible(pSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, gpItemPointerSoldier->sGridNo, gpItemPointerSoldier->bLevel);

          // Check LOS....
          if (!SoldierTo3DLocationLineOfSightTest(pSoldier, gpItemPointerSoldier->sGridNo, gpItemPointerSoldier->bLevel, 3, sDistVisible, TRUE)) {
            return FALSE;
          }

          // Charge AP values...
          DeductPoints(pSoldier, 3, 0);
          DeductPoints(gpItemPointerSoldier, 3, 0);

          usItem = gpItemPointer->usItem;

          // try to auto place object....
          if (AutoPlaceObject(pSoldier, gpItemPointer, TRUE)) {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[MSG_ITEM_PASSED_TO_MERC], ShortItemNames[usItem], pSoldier->name);

            // Check if it's the same now!
            if (gpItemPointer->ubNumberOfObjects == 0) {
              EndItemPointer();
            }

            // OK, make guys turn towards each other and do animation...
            {
              let ubFacingDirection: UINT8;

              // Get direction to face.....
              ubFacingDirection = GetDirectionFromGridNo(gpItemPointerSoldier->sGridNo, pSoldier);

              // Stop merc first....
              EVENT_StopMerc(pSoldier, pSoldier->sGridNo, pSoldier->bDirection);

              // If we are standing only...
              if (gAnimControl[pSoldier->usAnimState].ubEndHeight == ANIM_STAND && !MercInWater(pSoldier)) {
                // Turn to face, then do animation....
                EVENT_SetSoldierDesiredDirection(pSoldier, ubFacingDirection);
                pSoldier->fTurningUntilDone = TRUE;
                pSoldier->usPendingAnimation = PASS_OBJECT;
              }

              if (gAnimControl[gpItemPointerSoldier->usAnimState].ubEndHeight == ANIM_STAND && !MercInWater(gpItemPointerSoldier)) {
                EVENT_SetSoldierDesiredDirection(gpItemPointerSoldier, gOppositeDirection[ubFacingDirection]);
                gpItemPointerSoldier->fTurningUntilDone = TRUE;
                gpItemPointerSoldier->usPendingAnimation = PASS_OBJECT;
              }
            }

            return TRUE;
          } else {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[MSG_NO_ROOM_TO_PASS_ITEM], ShortItemNames[usItem], pSoldier->name);
            return FALSE;
          }
        }
      }
    } else {
      // CHECK FOR VALID CTGH
      if (gfBadThrowItemCTGH) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[CANNOT_THROW_TO_DEST_STR]);
        return FALSE;
      }

      // Deduct points
      // DeductPoints( gpItemPointerSoldier, AP_TOSS_ITEM, 0 );
      gpItemPointerSoldier->fDontChargeTurningAPs = TRUE;
      // Will be dome later....

      ubThrowActionCode = NO_THROW_ACTION;

      // OK, CHECK FOR VALID THROW/CATCH
      // IF OVER OUR GUY...
      if (gfUIFullTargetFound) {
        pSoldier = MercPtrs[gusUIFullTargetID];

        if (pSoldier->bTeam == gbPlayerNum && pSoldier->bLife >= OKLIFE && !AM_AN_EPC(pSoldier) && !(pSoldier->uiStatusFlags & SOLDIER_VEHICLE)) {
          // OK, on our team,

          // How's our direction?
          if (SoldierCanSeeCatchComing(pSoldier, gpItemPointerSoldier->sGridNo)) {
            // Setup as being the catch target
            ubThrowActionCode = THROW_TARGET_MERC_CATCH;
            uiThrowActionData = pSoldier->ubID;

            sGridNo = pSoldier->sGridNo;

            switch (gAnimControl[pSoldier->usAnimState].ubHeight) {
              case ANIM_STAND:

                sEndZ = 150;
                break;

              case ANIM_CROUCH:

                sEndZ = 80;
                break;

              case ANIM_PRONE:

                sEndZ = 10;
                break;
            }

            if (pSoldier->bLevel > 0) {
              sEndZ = 0;
            }

            // Get direction
            ubDirection = GetDirectionFromGridNo(gpItemPointerSoldier->sGridNo, pSoldier);

            // ATE: Goto stationary...
            SoldierGotoStationaryStance(pSoldier);

            // Set direction to turn...
            EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
          }
        }
      }

      // CHANGE DIRECTION AT LEAST
      ubDirection = GetDirectionFromGridNo(sGridNo, gpItemPointerSoldier);
      EVENT_SetSoldierDesiredDirection(gpItemPointerSoldier, ubDirection);
      gpItemPointerSoldier->fTurningUntilDone = TRUE;

      // Increment attacker count...
      gTacticalStatus.ubAttackBusyCount++;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("INcremtning ABC: Throw item to %d", gTacticalStatus.ubAttackBusyCount));

      // Given our gridno, throw grenate!
      CalculateLaunchItemParamsForThrow(gpItemPointerSoldier, sGridNo, gpItemPointerSoldier->bLevel, ((gsInterfaceLevel * 256) + sEndZ), gpItemPointer, 0, ubThrowActionCode, uiThrowActionData);

      // OK, goto throw animation
      HandleSoldierThrowItem(gpItemPointerSoldier, usMapPos);
    }
  }

  gfDontChargeAPsToPickup = FALSE;
  EndItemPointer();

  return TRUE;
}

function ItemCursorInLobRange(usMapPos: UINT16): BOOLEAN {
  // Draw item depending on distance from buddy
  if (GetRangeFromGridNoDiff(usMapPos, gpItemPointerSoldier->sGridNo) > MIN_LOB_RANGE) {
    return FALSE;
  } else {
    return TRUE;
  }
}

function InItemStackPopup(): BOOLEAN {
  return gfInItemStackPopup;
}

function InKeyRingPopup(): BOOLEAN {
  return gfInKeyRingPopup;
}

function InitItemStackPopup(pSoldier: Pointer<SOLDIERTYPE>, ubPosition: UINT8, sInvX: INT16, sInvY: INT16, sInvWidth: INT16, sInvHeight: INT16): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let sX: INT16;
  let sY: INT16;
  let sCenX: INT16;
  let sCenY: INT16;
  let aRect: SGPRect;
  let ubLimit: UINT8;
  let pTrav: Pointer<ETRLEObject>;
  let hVObject: HVOBJECT;
  let cnt: INT32;
  let usPopupWidth: UINT16;
  let sItemSlotWidth: INT16;
  let sItemSlotHeight: INT16;

  // Set some globals
  gsItemPopupInvX = sInvX;
  gsItemPopupInvY = sInvY;
  gsItemPopupInvWidth = sInvWidth;
  gsItemPopupInvHeight = sInvHeight;

  gpItemPopupSoldier = pSoldier;

  // Determine # of items
  gpItemPopupObject = &(pSoldier->inv[ubPosition]);
  ubLimit = ItemSlotLimit(gpItemPopupObject->usItem, ubPosition);

  // Return false if #objects not >1
  if (ubLimit < 1) {
    return FALSE;
  }

  if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
    if (ubLimit > 6) {
      ubLimit = 6;
    }
  }

  // Load graphics
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(VObjectDesc.ImageFile, "INTERFACE\\extra_inventory.STI");
  CHECKF(AddVideoObject(&VObjectDesc, &guiItemPopupBoxes));

  // Get size
  GetVideoObject(&hVObject, guiItemPopupBoxes);
  pTrav = &(hVObject->pETRLEObject[0]);
  usPopupWidth = pTrav->usWidth;

  // Determine position, height and width of mouse region, area
  GetSlotInvXY(ubPosition, &sX, &sY);
  GetSlotInvHeightWidth(ubPosition, &sItemSlotWidth, &sItemSlotHeight);

  // Get Width, Height
  gsItemPopupWidth = ubLimit * usPopupWidth;
  gsItemPopupHeight = pTrav->usHeight;
  gubNumItemPopups = ubLimit;

  // Calculate X,Y, first center
  sCenX = sX - ((gsItemPopupWidth / 2) + (sItemSlotWidth / 2));
  sCenY = sY;

  // Limit it to window for item desc
  if (sCenX < gsItemPopupInvX) {
    sCenX = gsItemPopupInvX;
  }
  if ((sCenX + gsItemPopupWidth) > (gsItemPopupInvX + gsItemPopupInvWidth)) {
    sCenX = gsItemPopupInvX;
  }

  // Cap it at 0....
  if (sCenX < 0) {
    sCenX = 0;
  }

  // Set
  gsItemPopupX = sCenX;
  gsItemPopupY = sCenY;

  for (cnt = 0; cnt < gubNumItemPopups; cnt++) {
    // Build a mouse region here that is over any others.....
    MSYS_DefineRegion(&gItemPopupRegions[cnt], (sCenX + (cnt * usPopupWidth)), sCenY, (sCenX + ((cnt + 1) * usPopupWidth)), (sCenY + gsItemPopupHeight), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemPopupRegionCallback);
    // Add region
    MSYS_AddRegion(&gItemPopupRegions[cnt]);
    MSYS_SetRegionUserData(&gItemPopupRegions[cnt], 0, cnt);

    // OK, for each item, set dirty text if applicable!
    SetRegionFastHelpText(&(gItemPopupRegions[cnt]), ItemNames[pSoldier->inv[ubPosition].usItem]);
    SetRegionHelpEndCallback(&(gItemPopupRegions[cnt]), HelpTextDoneCallback);
    gfItemPopupRegionCallbackEndFix = FALSE;
  }

  // Build a mouse region here that is over any others.....
  MSYS_DefineRegion(&gItemPopupRegion, gsItemPopupInvX, gsItemPopupInvY, (gsItemPopupInvX + gsItemPopupInvWidth), (gsItemPopupInvY + gsItemPopupInvHeight), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemPopupFullRegionCallback);
  // Add region
  MSYS_AddRegion(&gItemPopupRegion);

  // Disable all faces
  SetAllAutoFacesInactive();

  fInterfacePanelDirty = DIRTYLEVEL2;

  // guiTacticalInterfaceFlags |= INTERFACE_NORENDERBUTTONS;

  gfInItemStackPopup = TRUE;

  //	if ( !(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN ) )
  if (guiCurrentItemDescriptionScreen != MAP_SCREEN) {
    EnableSMPanelButtons(FALSE, FALSE);
  }

  // Reserict mouse cursor to panel
  aRect.iTop = sInvY;
  aRect.iLeft = sInvX;
  aRect.iBottom = sInvY + sInvHeight;
  aRect.iRight = sInvX + sInvWidth;

  RestrictMouseCursor(&aRect);

  return TRUE;
}

function EndItemStackPopupWithItemInHand(): void {
  if (gpItemPointer != NULL) {
    DeleteItemStackPopup();
  }
}

function RenderItemStackPopup(fFullRender: BOOLEAN): void {
  let pTrav: Pointer<ETRLEObject>;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let hVObject: HVOBJECT;
  let cnt: UINT32;
  let sX: INT16;
  let sY: INT16;
  let sNewX: INT16;
  let sNewY: INT16;

  if (gfInItemStackPopup) {
    // Disable all faces
    SetAllAutoFacesInactive();

    // Shadow Area
    if (fFullRender) {
      ShadowVideoSurfaceRect(FRAME_BUFFER, gsItemPopupInvX, gsItemPopupInvY, gsItemPopupInvX + gsItemPopupInvWidth, gsItemPopupInvY + gsItemPopupInvHeight);
    }
  }
  // TAKE A LOOK AT THE VIDEO OBJECT SIZE ( ONE OF TWO SIZES ) AND CENTER!
  GetVideoObject(&hVObject, guiItemPopupBoxes);
  pTrav = &(hVObject->pETRLEObject[0]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;

  for (cnt = 0; cnt < gubNumItemPopups; cnt++) {
    BltVideoObjectFromIndex(FRAME_BUFFER, guiItemPopupBoxes, 0, gsItemPopupX + (cnt * usWidth), gsItemPopupY, VO_BLT_SRCTRANSPARENCY, NULL);

    if (cnt < gpItemPopupObject->ubNumberOfObjects) {
      sX = (gsItemPopupX + (cnt * usWidth) + 11);
      sY = (gsItemPopupY + 3);

      INVRenderItem(FRAME_BUFFER, NULL, gpItemPopupObject, sX, sY, 29, 23, DIRTYLEVEL2, NULL, RENDER_ITEM_NOSTATUS, FALSE, 0);

      // Do status bar here...
      sNewX = (gsItemPopupX + (cnt * usWidth) + 7);
      sNewY = gsItemPopupY + INV_BAR_DY + 3;
      DrawItemUIBarEx(gpItemPopupObject, cnt, sNewX, sNewY, ITEM_BAR_WIDTH, ITEM_BAR_HEIGHT, Get16BPPColor(STATUS_BAR), Get16BPPColor(STATUS_BAR_SHADOW), TRUE, FRAME_BUFFER);
    }
  }

  // RestoreExternBackgroundRect( gsItemPopupInvX, gsItemPopupInvY, gsItemPopupInvWidth, gsItemPopupInvHeight );
  InvalidateRegion(gsItemPopupInvX, gsItemPopupInvY, gsItemPopupInvX + gsItemPopupInvWidth, gsItemPopupInvY + gsItemPopupInvHeight);
}

function HandleItemStackPopup(): void {
}

function DeleteItemStackPopup(): void {
  let cnt: INT32;

  // Remove
  DeleteVideoObjectFromIndex(guiItemPopupBoxes);

  MSYS_RemoveRegion(&gItemPopupRegion);

  gfInItemStackPopup = FALSE;

  for (cnt = 0; cnt < gubNumItemPopups; cnt++) {
    MSYS_RemoveRegion(&gItemPopupRegions[cnt]);
  }

  fInterfacePanelDirty = DIRTYLEVEL2;

  // guiTacticalInterfaceFlags &= (~INTERFACE_NORENDERBUTTONS);

  //	if ( !(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN ) )
  if (guiCurrentItemDescriptionScreen != MAP_SCREEN) {
    EnableSMPanelButtons(TRUE, FALSE);
  }

  FreeMouseCursor();
}

function InitKeyRingPopup(pSoldier: Pointer<SOLDIERTYPE>, sInvX: INT16, sInvY: INT16, sInvWidth: INT16, sInvHeight: INT16): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let aRect: SGPRect;
  let pTrav: Pointer<ETRLEObject>;
  let hVObject: HVOBJECT;
  let cnt: INT32;
  let usPopupWidth: UINT16;
  let usPopupHeight: UINT16;
  let ubSlotSimilarToKeySlot: UINT8 = 10;
  let sKeyRingItemWidth: INT16 = 0;
  let sOffSetY: INT16 = 0;
  let sOffSetX: INT16 = 0;

  if (guiCurrentScreen == MAP_SCREEN) {
    gsKeyRingPopupInvX = 0;
    sKeyRingItemWidth = MAP_KEY_RING_ROW_WIDTH;
    sOffSetX = 40;
    sOffSetY = 15;
  } else {
    // Set some globals
    gsKeyRingPopupInvX = sInvX + TACTICAL_INVENTORY_KEYRING_GRAPHIC_OFFSET_X;
    sKeyRingItemWidth = KEY_RING_ROW_WIDTH;
    sOffSetY = 8;
  }

  gsKeyRingPopupInvY = sInvY;
  gsKeyRingPopupInvWidth = sInvWidth;
  gsKeyRingPopupInvHeight = sInvHeight;

  gpItemPopupSoldier = pSoldier;

  // Load graphics
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(VObjectDesc.ImageFile, "INTERFACE\\extra_inventory.STI");
  CHECKF(AddVideoObject(&VObjectDesc, &guiItemPopupBoxes));

  // Get size
  GetVideoObject(&hVObject, guiItemPopupBoxes);
  pTrav = &(hVObject->pETRLEObject[0]);
  usPopupWidth = pTrav->usWidth;
  usPopupHeight = pTrav->usHeight;

  // Determine position, height and width of mouse region, area
  // GetSlotInvHeightWidth( ubSlotSimilarToKeySlot, &sItemSlotWidth, &sItemSlotHeight );

  for (cnt = 0; cnt < NUMBER_KEYS_ON_KEYRING; cnt++) {
    // Build a mouse region here that is over any others.....
    MSYS_DefineRegion(&gKeyRingRegions[cnt],
                      (gsKeyRingPopupInvX + (cnt % sKeyRingItemWidth * usPopupWidth) + sOffSetX), // top left
                      (sInvY + sOffSetY + (cnt / sKeyRingItemWidth * usPopupHeight)), // top right
                      (gsKeyRingPopupInvX + ((cnt % sKeyRingItemWidth) + 1) * usPopupWidth + sOffSetX), // bottom left
                      (sInvY + ((cnt / sKeyRingItemWidth + 1) * usPopupHeight) + sOffSetY), // bottom right
                      MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, KeyRingSlotInvClickCallback);
    // Add region
    MSYS_AddRegion(&gKeyRingRegions[cnt]);
    MSYS_SetRegionUserData(&gKeyRingRegions[cnt], 0, cnt);
    // gfItemPopupRegionCallbackEndFix = FALSE;
  }

  // Build a mouse region here that is over any others.....
  MSYS_DefineRegion(&gItemPopupRegion, sInvX, sInvY, (sInvX + sInvWidth), (sInvY + sInvHeight), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, ItemPopupFullRegionCallback);

  // Add region
  MSYS_AddRegion(&gItemPopupRegion);

  // Disable all faces
  SetAllAutoFacesInactive();

  fInterfacePanelDirty = DIRTYLEVEL2;

  // guiTacticalInterfaceFlags |= INTERFACE_NORENDERBUTTONS;

  //	if ( !(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN ) )
  if (guiCurrentItemDescriptionScreen != MAP_SCREEN) {
    EnableSMPanelButtons(FALSE, FALSE);
  }

  gfInKeyRingPopup = TRUE;

  // Reserict mouse cursor to panel
  aRect.iTop = sInvY;
  aRect.iLeft = sInvX;
  aRect.iBottom = sInvY + sInvHeight;
  aRect.iRight = sInvX + sInvWidth;

  RestrictMouseCursor(&aRect);

  return TRUE;
}

function RenderKeyRingPopup(fFullRender: BOOLEAN): void {
  let pTrav: Pointer<ETRLEObject>;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let hVObject: HVOBJECT;
  let cnt: UINT32;
  let pObject: OBJECTTYPE;
  let sKeyRingItemWidth: INT16 = 0;
  let sOffSetY: INT16 = 0;
  let sOffSetX: INT16 = 0;

  if (guiCurrentScreen != MAP_SCREEN) {
    sOffSetY = 8;
  } else {
    sOffSetX = 40;
    sOffSetY = 15;
  }

  if (gfInKeyRingPopup) {
    // Disable all faces
    SetAllAutoFacesInactive();

    // Shadow Area
    if (fFullRender) {
      ShadowVideoSurfaceRect(FRAME_BUFFER, 0, gsKeyRingPopupInvY, gsKeyRingPopupInvX + gsKeyRingPopupInvWidth, gsKeyRingPopupInvY + gsKeyRingPopupInvHeight);
    }
  }

  memset(&pObject, 0, sizeof(OBJECTTYPE));

  pObject.usItem = KEY_1;
  pObject.bStatus[0] = 100;

  // TAKE A LOOK AT THE VIDEO OBJECT SIZE ( ONE OF TWO SIZES ) AND CENTER!
  GetVideoObject(&hVObject, guiItemPopupBoxes);
  pTrav = &(hVObject->pETRLEObject[0]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;

  if (guiCurrentScreen == MAP_SCREEN) {
    sKeyRingItemWidth = MAP_KEY_RING_ROW_WIDTH;
  } else {
    // Set some globals
    sKeyRingItemWidth = KEY_RING_ROW_WIDTH;
  }

  for (cnt = 0; cnt < NUMBER_KEYS_ON_KEYRING; cnt++) {
    BltVideoObjectFromIndex(FRAME_BUFFER, guiItemPopupBoxes, 0, (gsKeyRingPopupInvX + (cnt % sKeyRingItemWidth * usWidth) + sOffSetX), (gsKeyRingPopupInvY + sOffSetY + (cnt / sKeyRingItemWidth * usHeight)), VO_BLT_SRCTRANSPARENCY, NULL);

    // will want to draw key here.. if there is one
    if ((gpItemPopupSoldier->pKeyRing[cnt].ubKeyID != INVALID_KEY_NUMBER) && (gpItemPopupSoldier->pKeyRing[cnt].ubNumber > 0)) {
      pObject.ubNumberOfObjects = gpItemPopupSoldier->pKeyRing[cnt].ubNumber;

      // show 100% status for each
      DrawItemUIBarEx(&pObject, 0, (gsKeyRingPopupInvX + sOffSetX + (cnt % sKeyRingItemWidth * usWidth) + 7), (gsKeyRingPopupInvY + sOffSetY + (cnt / sKeyRingItemWidth * usHeight) + 24), ITEM_BAR_WIDTH, ITEM_BAR_HEIGHT, Get16BPPColor(STATUS_BAR), Get16BPPColor(STATUS_BAR_SHADOW), TRUE, FRAME_BUFFER);

      // set item type
      pObject.usItem = FIRST_KEY + LockTable[gpItemPopupSoldier->pKeyRing[cnt].ubKeyID].usKeyItem;

      // render the item
      INVRenderItem(FRAME_BUFFER, NULL, &pObject, (gsKeyRingPopupInvX + sOffSetX + (cnt % sKeyRingItemWidth * usWidth) + 8), (gsKeyRingPopupInvY + sOffSetY + (cnt / sKeyRingItemWidth * usHeight)), (usWidth - 8), (usHeight - 2), DIRTYLEVEL2, NULL, 0, 0, 0);
    }

    // BltVideoObjectFromIndex( FRAME_BUFFER, guiItemPopupBoxes, 0, (INT16)(gsKeyRingPopupInvX + ( cnt % KEY_RING_ROW_WIDTH * usWidth ) ), ( INT16 )( gsKeyRingPopupInvY + ( cnt / KEY_RING_ROW_WIDTH * usHeight ) ), VO_BLT_SRCTRANSPARENCY, NULL );
  }

  // RestoreExternBackgroundRect( gsItemPopupInvX, gsItemPopupInvY, gsItemPopupInvWidth, gsItemPopupInvHeight );
  InvalidateRegion(gsKeyRingPopupInvX, gsKeyRingPopupInvY, gsKeyRingPopupInvX + gsKeyRingPopupInvWidth, gsKeyRingPopupInvY + gsKeyRingPopupInvHeight);
}

function DeleteKeyRingPopup(): void {
  let cnt: INT32;

  if (gfInKeyRingPopup == FALSE) {
    // done,
    return;
  }

  // Remove
  DeleteVideoObjectFromIndex(guiItemPopupBoxes);

  MSYS_RemoveRegion(&gItemPopupRegion);

  gfInKeyRingPopup = FALSE;

  for (cnt = 0; cnt < NUMBER_KEYS_ON_KEYRING; cnt++) {
    MSYS_RemoveRegion(&gKeyRingRegions[cnt]);
  }

  fInterfacePanelDirty = DIRTYLEVEL2;

  // guiTacticalInterfaceFlags &= (~INTERFACE_NORENDERBUTTONS);

  //	if ( !(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN ) )
  if (guiCurrentItemDescriptionScreen != MAP_SCREEN) {
    EnableSMPanelButtons(TRUE, FALSE);
  }

  FreeMouseCursor();
}

function GetInterfaceGraphicForItem(pItem: Pointer<INVTYPE>): UINT32 {
  // CHECK SUBCLASS
  if (pItem->ubGraphicType == 0) {
    return guiGUNSM;
  } else if (pItem->ubGraphicType == 1) {
    return guiP1ITEMS;
  } else if (pItem->ubGraphicType == 2) {
    return guiP2ITEMS;
  } else {
    return guiP3ITEMS;
  }
}

function GetTileGraphicForItem(pItem: Pointer<INVTYPE>): UINT16 {
  let usIndex: UINT16;

  // CHECK SUBCLASS
  if (pItem->ubGraphicType == 0) {
    GetTileIndexFromTypeSubIndex(GUNS, (pItem->ubGraphicNum + 1), &usIndex);
  } else if (pItem->ubGraphicType == 1) {
    GetTileIndexFromTypeSubIndex(P1ITEMS, (pItem->ubGraphicNum + 1), &usIndex);
  } else if (pItem->ubGraphicType == 2) {
    GetTileIndexFromTypeSubIndex(P2ITEMS, (pItem->ubGraphicNum + 1), &usIndex);
  } else {
    GetTileIndexFromTypeSubIndex(P3ITEMS, (pItem->ubGraphicNum + 1), &usIndex);
  }
  return usIndex;
}

function LoadTileGraphicForItem(pItem: Pointer<INVTYPE>, puiVo: Pointer<UINT32>): BOOLEAN {
  let zName: CHAR8[] /* [100] */;
  let uiVo: UINT32;
  let VObjectDesc: VOBJECT_DESC;
  let ubGraphic: UINT8;

  // CHECK SUBCLASS
  ubGraphic = pItem->ubGraphicNum;

  if (pItem->ubGraphicType == 0) {
    // CHECK SUBCLASS
    // ubGraphic++;

    if (ubGraphic < 10) {
      sprintf(zName, "gun0%d.sti", ubGraphic);
    } else {
      sprintf(zName, "gun%d.sti", ubGraphic);
    }
  } else if (pItem->ubGraphicType == 1) {
    if (ubGraphic < 10) {
      sprintf(zName, "p1item0%d.sti", ubGraphic);
    } else {
      sprintf(zName, "p1item%d.sti", ubGraphic);
    }
  } else if (pItem->ubGraphicType == 2) {
    if (ubGraphic < 10) {
      sprintf(zName, "p2item0%d.sti", ubGraphic);
    } else {
      sprintf(zName, "p2item%d.sti", ubGraphic);
    }
  } else {
    if (ubGraphic < 10) {
      sprintf(zName, "p3item0%d.sti", ubGraphic);
    } else {
      sprintf(zName, "p3item%d.sti", ubGraphic);
    }
  }

  // Load item
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  sprintf(VObjectDesc.ImageFile, "BIGITEMS\\%s", zName);
  CHECKF(AddVideoObject(&VObjectDesc, &uiVo));

  *puiVo = uiVo;

  return TRUE;
}

function ItemDescMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
}

function ItemDescCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /* static */ let fRightDown: BOOLEAN = FALSE;
  /* static */ let fLeftDown: BOOLEAN = FALSE;

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fLeftDown = TRUE;
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fLeftDown) {
      fLeftDown = FALSE;

      // Only exit the screen if we are NOT in the money interface.  Only the DONE button should exit the money interface.
      if (gpItemDescObject->usItem != MONEY) {
        DeleteItemDescriptionBox();
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    fRightDown = TRUE;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (fRightDown) {
      fRightDown = FALSE;

      // Only exit the screen if we are NOT in the money interface.  Only the DONE button should exit the money interface.
      //			if( gpItemDescObject->usItem != MONEY )
      { DeleteItemDescriptionBox(); }
    }
  }
}

function ItemDescDoneButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON) {
      btn->uiFlags &= ~(BUTTON_CLICKED_ON);

      if (gpItemDescObject->usItem == MONEY) {
        RemoveMoney();
      }

      DeleteItemDescriptionBox();
    }
  }

  if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    btn->uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON) {
      btn->uiFlags &= ~(BUTTON_CLICKED_ON);
      DeleteItemDescriptionBox();
    }
  }
}

function ItemPopupRegionCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let uiItemPos: UINT32;

  uiItemPos = MSYS_GetRegionUserData(pRegion, 0);

  // TO ALLOW ME TO DELETE REGIONS IN CALLBACKS!
  if (gfItemPopupRegionCallbackEndFix) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    // If one in our hand, place it
    if (gpItemPointer != NULL) {
      if (!PlaceObjectAtObjectIndex(gpItemPointer, gpItemPopupObject, uiItemPos)) {
        if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
          MAPEndItemPointer();
        } else {
          gpItemPointer = NULL;
          MSYS_ChangeRegionCursor(&gSMPanelRegion, CURSOR_NORMAL);
          SetCurrentCursorFromDatabase(CURSOR_NORMAL);

          if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
            memset(&gMoveingItem, 0, sizeof(INVENTORY_IN_SLOT));
            SetSkiCursor(CURSOR_NORMAL);
          }
        }

        // re-evaluate repairs
        gfReEvaluateEveryonesNothingToDo = TRUE;
      }

      // Dirty interface
      // fInterfacePanelDirty = DIRTYLEVEL2;
      // RenderItemStackPopup( FALSE );
    } else {
      if (uiItemPos < gpItemPopupObject->ubNumberOfObjects) {
        // Here, grab an item and put in cursor to swap
        // RemoveObjFrom( OBJECTTYPE * pObj, UINT8 ubRemoveIndex )
        GetObjFrom(gpItemPopupObject, uiItemPos, &gItemPointer);

        if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
          // pick it up
          InternalMAPBeginItemPointer(gpItemPopupSoldier);
        } else {
          gpItemPointer = &gItemPointer;
          gpItemPointerSoldier = gpItemPopupSoldier;
        }

        // if we are in the shop keeper interface
        if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
          // pick up stacked item into cursor and try to sell it ( unless CTRL is held down )
          BeginSkiItemPointer(PLAYERS_INVENTORY, -1, !gfKeyState[CTRL]);

          // if we've just removed the last one there
          if (gpItemPopupObject->ubNumberOfObjects == 0) {
            // we must immediately get out of item stack popup, because the item has been deleted (memset to 0), and
            // errors like a right bringing up an item description for item 0 could happen then.  ARM.
            DeleteItemStackPopup();
          }
        }

        // re-evaluate repairs
        gfReEvaluateEveryonesNothingToDo = TRUE;

        // Dirty interface
        // RenderItemStackPopup( FALSE );
        // fInterfacePanelDirty = DIRTYLEVEL2;
      }
    }

    UpdateItemHatches();
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // Get Description....
    // Some global stuff here - for esc, etc
    // Remove
    gfItemPopupRegionCallbackEndFix = TRUE;

    DeleteItemStackPopup();

    if (!InItemDescriptionBox()) {
      // RESTORE BACKGROUND
      RestoreExternBackgroundRect(gsItemPopupInvX, gsItemPopupInvY, gsItemPopupInvWidth, gsItemPopupInvHeight);
      if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
        MAPInternalInitItemDescriptionBox(gpItemPopupObject, uiItemPos, gpItemPopupSoldier);
      } else {
        InternalInitItemDescriptionBox(gpItemPopupObject, ITEMDESC_START_X, ITEMDESC_START_Y, uiItemPos, gpItemPopupSoldier);
      }
    }
  }
}

function ItemPopupFullRegionCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let uiItemPos: UINT32;

  uiItemPos = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (InItemStackPopup()) {
      // End stack popup and retain pointer
      EndItemStackPopupWithItemInHand();
    } else if (InKeyRingPopup()) {
      // end pop up with key in hand
      DeleteKeyRingPopup();
      fTeamPanelDirty = TRUE;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (InItemStackPopup()) {
      DeleteItemStackPopup();
      fTeamPanelDirty = TRUE;
    } else {
      DeleteKeyRingPopup();
      fTeamPanelDirty = TRUE;
    }
  }
}

const NUM_PICKUP_SLOTS = 6;

interface ITEM_PICKUP_MENU_STRUCT {
  pItemPool: Pointer<ITEM_POOL>;
  sX: INT16;
  sY: INT16;
  sWidth: INT16;
  sHeight: INT16;
  bScrollPage: INT8;
  ubScrollAnchor: INT32;
  ubTotalItems: INT32;
  bCurSelect: INT32;
  bNumSlotsPerPage: UINT8;
  uiPanelVo: UINT32;
  iUpButtonImages: INT32;
  iDownButtonImages: INT32;
  iAllButtonImages: INT32;
  iCancelButtonImages: INT32;
  iOKButtonImages: INT32;
  iUpButton: INT32;
  iDownButton: INT32;
  iAllButton: INT32;
  iOKButton: INT32;
  iCancelButton: INT32;
  fCanScrollUp: BOOLEAN;
  fCanScrollDown: BOOLEAN;
  fDirtyLevel: BOOLEAN;
  iDirtyRect: INT32;
  fHandled: BOOLEAN;
  sGridNo: INT16;
  bZLevel: INT8;
  sButtomPanelStartY: INT16;
  pSoldier: Pointer<SOLDIERTYPE>;
  ItemPoolSlots: Pointer<ITEM_POOL>[] /* [NUM_PICKUP_SLOTS] */;
  Regions: MOUSE_REGION[] /* [NUM_PICKUP_SLOTS] */;
  BackRegions: MOUSE_REGION;
  BackRegion: MOUSE_REGION;
  pfSelectedArray: Pointer<BOOLEAN>;
  fAtLeastOneSelected: BOOLEAN;
  CompAmmoObject: OBJECTTYPE;
  fAllSelected: BOOLEAN;
}

const ITEMPICK_UP_X = 55;
const ITEMPICK_UP_Y = 5;
const ITEMPICK_DOWN_X = 111;
const ITEMPICK_DOWN_Y = 5;
const ITEMPICK_ALL_X = 79;
const ITEMPICK_ALL_Y = 6;
const ITEMPICK_OK_X = 16;
const ITEMPICK_OK_Y = 6;
const ITEMPICK_CANCEL_X = 141;
const ITEMPICK_CANCEL_Y = 6;

const ITEMPICK_START_X_OFFSET = 10;
const ITEMPICK_START_Y_OFFSET = 20;

const ITEMPICK_GRAPHIC_X = 10;
const ITEMPICK_GRAPHIC_Y = 12;
const ITEMPICK_GRAPHIC_YSPACE = 26;

const ITEMPICK_TEXT_X = 56;
const ITEMPICK_TEXT_Y = 22;
const ITEMPICK_TEXT_YSPACE = 26;
const ITEMPICK_TEXT_WIDTH = 109;
const ITEMPICK_TEXT_HEIGHT = 17;

let gItemPickupMenu: ITEM_PICKUP_MENU_STRUCT;
let gfInItemPickupMenu: BOOLEAN = FALSE;

// STUFF FOR POPUP ITEM INFO BOX
function SetItemPickupMenuDirty(fDirtyLevel: BOOLEAN): void {
  gItemPickupMenu.fDirtyLevel = fDirtyLevel;
}

function InitializeItemPickupMenu(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, pItemPool: Pointer<ITEM_POOL>, sScreenX: INT16, sScreenY: INT16, bZLevel: INT8): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let ubString: UINT8[] /* [48] */;
  let pTempItemPool: Pointer<ITEM_POOL>;
  let cnt: INT32;
  let sCenX: INT16;
  let sCenY: INT16;
  let sX: INT16;
  let sY: INT16;
  let sCenterYVal: INT16;

  // Erase other menus....
  EraseInterfaceMenus(TRUE);

  // Make sure menu is located if not on screen
  LocateSoldier(pSoldier->ubID, FALSE);

  // memset values
  memset(&gItemPickupMenu, 0, sizeof(gItemPickupMenu));

  // Set item pool value
  gItemPickupMenu.pItemPool = pItemPool;

  InterruptTime();
  PauseGame();
  LockPauseState(18);
  // Pause timers as well....
  PauseTime(TRUE);

  // Alrighty, cancel lock UI if we havn't done so already
  UnSetUIBusy(pSoldier->ubID);

  // Change to INV panel if not there already...
  gfSwitchPanel = TRUE;
  gbNewPanel = SM_PANEL;
  gubNewPanelParam = pSoldier->ubID;

  // Determine total #
  cnt = 0;
  pTempItemPool = pItemPool;
  while (pTempItemPool != NULL) {
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      cnt++;
    }

    pTempItemPool = pTempItemPool->pNext;
  }
  gItemPickupMenu.ubTotalItems = cnt;

  // Determine # of slots per page
  if (gItemPickupMenu.ubTotalItems > NUM_PICKUP_SLOTS) {
    gItemPickupMenu.bNumSlotsPerPage = NUM_PICKUP_SLOTS;
  } else {
    gItemPickupMenu.bNumSlotsPerPage = gItemPickupMenu.ubTotalItems;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\itembox.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &(gItemPickupMenu.uiPanelVo)));

  // Memalloc selection array...
  gItemPickupMenu.pfSelectedArray = MemAlloc((sizeof(UINT8) * gItemPickupMenu.ubTotalItems));
  // seto to 0
  memset(gItemPickupMenu.pfSelectedArray, 0, (sizeof(UINT8) * gItemPickupMenu.ubTotalItems));

  // Calcualate dimensions
  CalculateItemPickupMenuDimensions();

  // Get XY
  {
    // First get mouse xy screen location
    if (sGridNo != NOWHERE) {
      sX = gusMouseXPos;
      sY = gusMouseYPos;
    } else {
      sX = sScreenX;
      sY = sScreenY;
    }

    // CHECK FOR LEFT/RIGHT
    if ((sX + gItemPickupMenu.sWidth) > 640) {
      sX = 640 - gItemPickupMenu.sWidth - ITEMPICK_START_X_OFFSET;
    } else {
      sX = sX + ITEMPICK_START_X_OFFSET;
    }

    // Now check for top
    // Center in the y
    sCenterYVal = gItemPickupMenu.sHeight / 2;

    sY -= sCenterYVal;

    if (sY < gsVIEWPORT_WINDOW_START_Y) {
      sY = gsVIEWPORT_WINDOW_START_Y;
    }

    // Check for bottom
    if ((sY + gItemPickupMenu.sHeight) > 340) {
      sY = 340 - gItemPickupMenu.sHeight;
    }
  }

  // Set some values
  gItemPickupMenu.sX = sX;
  gItemPickupMenu.sY = sY;
  gItemPickupMenu.bCurSelect = 0;
  gItemPickupMenu.pSoldier = pSoldier;
  gItemPickupMenu.fHandled = FALSE;
  gItemPickupMenu.sGridNo = sGridNo;
  gItemPickupMenu.bZLevel = bZLevel;
  gItemPickupMenu.fAtLeastOneSelected = FALSE;
  gItemPickupMenu.fAllSelected = FALSE;

  // Load images for buttons
  FilenameForBPP("INTERFACE\\itembox.sti", ubString);
  gItemPickupMenu.iUpButtonImages = LoadButtonImage(ubString, -1, 5, -1, 10, -1);
  gItemPickupMenu.iDownButtonImages = UseLoadedButtonImage(gItemPickupMenu.iUpButtonImages, -1, 7, -1, 12, -1);
  gItemPickupMenu.iAllButtonImages = UseLoadedButtonImage(gItemPickupMenu.iUpButtonImages, -1, 6, -1, 11, -1);
  gItemPickupMenu.iCancelButtonImages = UseLoadedButtonImage(gItemPickupMenu.iUpButtonImages, -1, 8, -1, 13, -1);
  gItemPickupMenu.iOKButtonImages = UseLoadedButtonImage(gItemPickupMenu.iUpButtonImages, -1, 4, -1, 9, -1);

  // Build a mouse region here that is over any others.....
  MSYS_DefineRegion(&(gItemPickupMenu.BackRegion), (532), (367), (640), (480), MSYS_PRIORITY_HIGHEST, CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  // Add region
  MSYS_AddRegion(&(gItemPickupMenu.BackRegion));

  // Build a mouse region here that is over any others.....
  MSYS_DefineRegion(&(gItemPickupMenu.BackRegions), (gItemPickupMenu.sX), (gItemPickupMenu.sY), (gItemPickupMenu.sX + gItemPickupMenu.sWidth), (gItemPickupMenu.sY + gItemPickupMenu.sHeight), MSYS_PRIORITY_HIGHEST, CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  // Add region
  MSYS_AddRegion(&(gItemPickupMenu.BackRegions));

  // Create buttons
  if (gItemPickupMenu.bNumSlotsPerPage == NUM_PICKUP_SLOTS && gItemPickupMenu.ubTotalItems > NUM_PICKUP_SLOTS) {
    gItemPickupMenu.iUpButton = QuickCreateButton(gItemPickupMenu.iUpButtonImages, (sX + ITEMPICK_UP_X), (sY + gItemPickupMenu.sButtomPanelStartY + ITEMPICK_UP_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, ItemPickupScrollUp);

    SetButtonFastHelpText(gItemPickupMenu.iUpButton, ItemPickupHelpPopup[1]);

    gItemPickupMenu.iDownButton = QuickCreateButton(gItemPickupMenu.iDownButtonImages, (sX + ITEMPICK_DOWN_X), (sY + gItemPickupMenu.sButtomPanelStartY + ITEMPICK_DOWN_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, ItemPickupScrollDown);

    SetButtonFastHelpText(gItemPickupMenu.iDownButton, ItemPickupHelpPopup[3]);
  }

  gItemPickupMenu.iOKButton = QuickCreateButton(gItemPickupMenu.iOKButtonImages, (sX + ITEMPICK_OK_X), (sY + gItemPickupMenu.sButtomPanelStartY + ITEMPICK_OK_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, ItemPickupOK);
  SetButtonFastHelpText(gItemPickupMenu.iOKButton, ItemPickupHelpPopup[0]);

  gItemPickupMenu.iAllButton = QuickCreateButton(gItemPickupMenu.iAllButtonImages, (sX + ITEMPICK_ALL_X), (sY + gItemPickupMenu.sButtomPanelStartY + ITEMPICK_ALL_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, ItemPickupAll);
  SetButtonFastHelpText(gItemPickupMenu.iAllButton, ItemPickupHelpPopup[2]);

  gItemPickupMenu.iCancelButton = QuickCreateButton(gItemPickupMenu.iCancelButtonImages, (sX + ITEMPICK_CANCEL_X), (sY + gItemPickupMenu.sButtomPanelStartY + ITEMPICK_CANCEL_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK, ItemPickupCancel);
  SetButtonFastHelpText(gItemPickupMenu.iCancelButton, ItemPickupHelpPopup[4]);

  DisableButton(gItemPickupMenu.iOKButton);

  // Create regions...
  sCenX = gItemPickupMenu.sX;
  sCenY = gItemPickupMenu.sY + ITEMPICK_GRAPHIC_Y;

  for (cnt = 0; cnt < gItemPickupMenu.bNumSlotsPerPage; cnt++) {
    // Build a mouse region here that is over any others.....
    MSYS_DefineRegion(&(gItemPickupMenu.Regions[cnt]), (sCenX), (sCenY + 1), (sCenX + gItemPickupMenu.sWidth), (sCenY + ITEMPICK_GRAPHIC_YSPACE), MSYS_PRIORITY_HIGHEST, CURSOR_NORMAL, ItemPickMenuMouseMoveCallback, ItemPickMenuMouseClickCallback);
    // Add region
    MSYS_AddRegion(&(gItemPickupMenu.Regions[cnt]));
    MSYS_SetRegionUserData(&(gItemPickupMenu.Regions[cnt]), 0, cnt);

    sCenY += ITEMPICK_GRAPHIC_YSPACE;
  }

  // Save dirty rect
  // gItemPickupMenu.iDirtyRect = RegisterBackgroundRect( BGND_FLAG_PERMANENT | BGND_FLAG_SAVERECT, NULL, gItemPickupMenu.sX, gItemPickupMenu.sY, (INT16)(gItemPickupMenu.sX + gItemPickupMenu.sWidth ) , (INT16)(gItemPickupMenu.sY + gItemPickupMenu.sHeight ) );

  SetupPickupPage(0);

  gfInItemPickupMenu = TRUE;

  // Ignore scrolling
  gfIgnoreScrolling = TRUE;

  HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), NULL, TRUE);
  gubSelectSMPanelToMerc = pSoldier->ubID;
  ReEvaluateDisabledINVPanelButtons();
  DisableTacticalTeamPanelButtons(TRUE);

  // gfSMDisableForItems = TRUE;
  return TRUE;
}

function SetupPickupPage(bPage: INT8): void {
  let cnt: INT32;
  let iStart: INT32;
  let iEnd: INT32;
  let pTempItemPool: Pointer<ITEM_POOL>;
  let sValue: INT16;
  let pObject: Pointer<OBJECTTYPE>;
  /* static */ let pStr: INT16[] /* [200] */;

  // Zero out page slots
  memset(gItemPickupMenu.ItemPoolSlots, 0, sizeof(gItemPickupMenu.ItemPoolSlots));

  // Zero page flags
  gItemPickupMenu.fCanScrollUp = FALSE;
  gItemPickupMenu.fCanScrollDown = FALSE;

  // Get lower bound
  iStart = bPage * NUM_PICKUP_SLOTS;
  if (iStart > gItemPickupMenu.ubTotalItems) {
    return;
  }

  if (bPage > 0) {
    gItemPickupMenu.fCanScrollUp = TRUE;
  }

  iEnd = iStart + NUM_PICKUP_SLOTS;
  if (iEnd >= gItemPickupMenu.ubTotalItems) {
    iEnd = gItemPickupMenu.ubTotalItems;
  } else {
    // We can go for more!
    gItemPickupMenu.fCanScrollDown = TRUE;
  }

  // Setup slots!
  // These slots contain an inventory pool pointer for each slot...
  pTempItemPool = gItemPickupMenu.pItemPool;

  // ATE: Patch fix here for crash :(
  // Clear help text!
  for (cnt = 0; cnt < NUM_PICKUP_SLOTS; cnt++) {
    SetRegionFastHelpText(&(gItemPickupMenu.Regions[cnt]), L"");
  }

  for (cnt = 0; cnt < iEnd;) {
    // Move to the closest one that can be displayed....
    while (!ItemPoolOKForDisplay(pTempItemPool, gItemPickupMenu.bZLevel)) {
      pTempItemPool = pTempItemPool->pNext;
    }

    if (cnt >= iStart) {
      gItemPickupMenu.ItemPoolSlots[cnt - iStart] = pTempItemPool;

      pObject = &(gWorldItems[pTempItemPool->iItemIndex].o);

      sValue = pObject->bStatus[0];

      // Adjust for ammo, other thingys..
      if (Item[pObject->usItem].usItemClass & IC_AMMO || Item[pObject->usItem].usItemClass & IC_KEY) {
        swprintf(pStr, L"");
      } else {
        swprintf(pStr, L"%d%%", sValue);
      }

      SetRegionFastHelpText(&(gItemPickupMenu.Regions[cnt - iStart]), pStr);
    }

    cnt++;

    pTempItemPool = pTempItemPool->pNext;
  }

  gItemPickupMenu.bScrollPage = bPage;
  gItemPickupMenu.ubScrollAnchor = iStart;

  if (gItemPickupMenu.bNumSlotsPerPage == NUM_PICKUP_SLOTS && gItemPickupMenu.ubTotalItems > NUM_PICKUP_SLOTS) {
    // Setup enabled/disabled buttons
    if (gItemPickupMenu.fCanScrollUp) {
      EnableButton(gItemPickupMenu.iUpButton);
    } else {
      DisableButton(gItemPickupMenu.iUpButton);
    }

    // Setup enabled/disabled buttons
    if (gItemPickupMenu.fCanScrollDown) {
      EnableButton(gItemPickupMenu.iDownButton);
    } else {
      DisableButton(gItemPickupMenu.iDownButton);
    }
  }
  SetItemPickupMenuDirty(DIRTYLEVEL2);
}

function CalculateItemPickupMenuDimensions(): void {
  let cnt: INT32;
  let sX: INT16;
  let sY: INT16;
  let usSubRegion: UINT16;
  let usHeight: UINT16;
  let usWidth: UINT16;

  // Build background
  sX = 0;
  sY = 0;

  for (cnt = 0; cnt < gItemPickupMenu.bNumSlotsPerPage; cnt++) {
    if (cnt == 0) {
      usSubRegion = 0;
    } else {
      usSubRegion = 1;
    }

    // Add hieght of object
    GetVideoObjectETRLESubregionProperties(gItemPickupMenu.uiPanelVo, usSubRegion, &usWidth, &usHeight);

    sY += usHeight;
  }
  gItemPickupMenu.sButtomPanelStartY = sY;

  // Do end
  GetVideoObjectETRLESubregionProperties(gItemPickupMenu.uiPanelVo, 2, &usWidth, &usHeight);

  sY += usHeight;

  // Set height, width
  gItemPickupMenu.sHeight = sY;
  gItemPickupMenu.sWidth = usWidth;
}

// set pick up menu dirty level
function SetPickUpMenuDirtyLevel(fDirtyLevel: BOOLEAN): void {
  gItemPickupMenu.fDirtyLevel = fDirtyLevel;

  return;
}

function RenderItemPickupMenu(): void {
  let cnt: INT32;
  let usItemTileIndex: UINT16;
  let sX: INT16;
  let sY: INT16;
  let sCenX: INT16;
  let sCenY: INT16;
  let sFontX: INT16;
  let sFontY: INT16;
  let sNewX: INT16;
  let sNewY: INT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let pStr: INT16[] /* [100] */;
  let usSubRegion: UINT16;
  let usHeight: UINT16;
  let usWidth: UINT16;
  let pItem: Pointer<INVTYPE>;
  let pObject: Pointer<OBJECTTYPE>;
  let uiStringLength: UINT16;

  if (!gfInItemPickupMenu) {
    return;
  }

  // Do everything!
  if (gItemPickupMenu.fDirtyLevel == DIRTYLEVEL2) {
    MarkButtonsDirty();

    // Build background
    sX = gItemPickupMenu.sX;
    sY = gItemPickupMenu.sY;

    for (cnt = 0; cnt < gItemPickupMenu.bNumSlotsPerPage; cnt++) {
      if (cnt == 0) {
        usSubRegion = 0;
      } else {
        usSubRegion = 1;
      }

      BltVideoObjectFromIndex(FRAME_BUFFER, gItemPickupMenu.uiPanelVo, usSubRegion, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL);

      // Add hieght of object
      GetVideoObjectETRLESubregionProperties(gItemPickupMenu.uiPanelVo, usSubRegion, &usWidth, &usHeight);

      sY += usHeight;
    }

    // Do end
    if (gItemPickupMenu.bNumSlotsPerPage == NUM_PICKUP_SLOTS && gItemPickupMenu.ubTotalItems > NUM_PICKUP_SLOTS) {
      BltVideoObjectFromIndex(FRAME_BUFFER, gItemPickupMenu.uiPanelVo, 2, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL);
    } else {
      BltVideoObjectFromIndex(FRAME_BUFFER, gItemPickupMenu.uiPanelVo, 3, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // Render items....
    sX = ITEMPICK_GRAPHIC_X + gItemPickupMenu.sX;
    sY = ITEMPICK_GRAPHIC_Y + gItemPickupMenu.sY;

    pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);

    SetFont(ITEMDESC_FONT);
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontShadow(ITEMDESC_FONTSHADOW2);

    for (cnt = 0; cnt < gItemPickupMenu.bNumSlotsPerPage; cnt++) {
      if (gItemPickupMenu.ItemPoolSlots[cnt] != NULL) {
        // Get item to render
        pObject = &(gWorldItems[gItemPickupMenu.ItemPoolSlots[cnt]->iItemIndex].o);
        pItem = &(Item[pObject->usItem]);

        usItemTileIndex = GetTileGraphicForItem(pItem);

        // Render
        sX = ITEMPICK_GRAPHIC_X + gItemPickupMenu.sX;

        sCenX = sX;
        sCenY = sY;

        // ATE: Adjust to basic shade.....
        gTileDatabase[usItemTileIndex].hTileSurface->pShadeCurrent = gTileDatabase[usItemTileIndex].hTileSurface->pShades[4];

        // else
        {
          if (gItemPickupMenu.pfSelectedArray[cnt + gItemPickupMenu.ubScrollAnchor]) {
            // SetFontForeground( FONT_MCOLOR_LTYELLOW );
            // SetFontShadow( ITEMDESC_FONTSHADOW2 );
            Blt8BPPDataTo16BPPBufferOutline(pDestBuf, uiDestPitchBYTES, gTileDatabase[usItemTileIndex].hTileSurface, sCenX, sCenY, gTileDatabase[usItemTileIndex].usRegionIndex, Get16BPPColor(FROMRGB(255, 255, 0)), TRUE);
          } else {
            // SetFontForeground( FONT_BLACK );
            // SetFontShadow( ITEMDESC_FONTSHADOW2 );
            Blt8BPPDataTo16BPPBufferOutline(pDestBuf, uiDestPitchBYTES, gTileDatabase[usItemTileIndex].hTileSurface, sCenX, sCenY, gTileDatabase[usItemTileIndex].usRegionIndex, 0, FALSE);
          }
        }

        // Draw text.....
        SetFont(ITEM_FONT);
        if (pObject->ubNumberOfObjects > 1) {
          SetFontForeground(FONT_GRAY4);
          SetFontShadow(DEFAULT_SHADOW);

          sCenX = sX - 4;
          sCenY = sY + 14;

          swprintf(pStr, L"%d", pObject->ubNumberOfObjects);

          VarFindFontRightCoordinates(sCenX, sCenY, 42, 1, ITEM_FONT, &sFontX, &sFontY, pStr);
          mprintf_buffer(pDestBuf, uiDestPitchBYTES, ITEM_FONT, sFontX, sFontY, pStr);
        }
        SetFont(ITEMDESC_FONT);

        // Render attachment symbols
        if (ItemHasAttachments(pObject)) {
          SetFontForeground(FONT_GREEN);
          SetFontShadow(DEFAULT_SHADOW);

          sNewY = sCenY + 2;
          swprintf(pStr, L"*");

          // Get length of string
          uiStringLength = StringPixLength(pStr, ITEM_FONT);

          sNewX = sCenX + 43 - uiStringLength - 4;

          mprintf_buffer(pDestBuf, uiDestPitchBYTES, ITEMDESC_FONT, sNewX, sNewY, pStr);
          // gprintfinvalidate( sNewX, sNewY, pStr );
        }

        if (gItemPickupMenu.bCurSelect == (cnt + gItemPickupMenu.ubScrollAnchor)) {
          // SetFontForeground( ITEMDESC_FONTSHADOW2 );
          // if ( gItemPickupMenu.pfSelectedArray[  cnt + gItemPickupMenu.ubScrollAnchor ] )
          //{
          //	SetFontForeground( FONT_MCOLOR_LTYELLOW );
          //	SetFontShadow( ITEMDESC_FONTSHADOW2 );
          //}
          // else
          //{
          SetFontForeground(FONT_WHITE);
          SetFontShadow(DEFAULT_SHADOW);
          //}
          // Blt8BPPDataTo16BPPBufferOutline( (UINT16*)pDestBuf, uiDestPitchBYTES, gTileDatabase[ usItemTileIndex ].hTileSurface, sCenX, sCenY, gTileDatabase[ usItemTileIndex ].usRegionIndex, Get16BPPColor( FROMRGB( 255, 0, 0 ) ), TRUE );
          // Blt8BPPDataTo16BPPBufferOutline( (UINT16*)pDestBuf, uiDestPitchBYTES, gTileDatabase[ usItemTileIndex ].hTileSurface, sCenX, sCenY, gTileDatabase[ usItemTileIndex ].usRegionIndex, Get16BPPColor( FROMRGB( 255, 0, 0 ) ), TRUE );
        } else {
          SetFontForeground(FONT_BLACK);
          SetFontShadow(ITEMDESC_FONTSHADOW2);
        }

        // Render name
        sCenX = ITEMPICK_TEXT_X + gItemPickupMenu.sX;
        sCenY = ITEMPICK_TEXT_Y + gItemPickupMenu.sY + (ITEMPICK_TEXT_YSPACE * cnt);

        // If we are money...
        if (Item[pObject->usItem].usItemClass == IC_MONEY) {
          let pStr2: INT16[] /* [20] */;
          swprintf(pStr2, L"%ld", pObject->uiMoneyAmount);
          InsertCommasForDollarFigure(pStr2);
          InsertDollarSignInToString(pStr2);

          swprintf(pStr, L"%s (%ls)", ItemNames[pObject->usItem], pStr2);
        } else {
          swprintf(pStr, L"%s", ShortItemNames[pObject->usItem]);
        }
        VarFindFontCenterCoordinates(sCenX, sCenY, ITEMPICK_TEXT_WIDTH, 1, ITEMDESC_FONT, &sFontX, &sFontY, pStr);
        mprintf_buffer(pDestBuf, uiDestPitchBYTES, ITEMDESC_FONT, sFontX, sFontY, pStr);

        sY += ITEMPICK_GRAPHIC_YSPACE;
      }
    }

    SetFontShadow(DEFAULT_SHADOW);

    UnLockVideoSurface(FRAME_BUFFER);

    InvalidateRegion(gItemPickupMenu.sX, gItemPickupMenu.sY, gItemPickupMenu.sX + gItemPickupMenu.sWidth, gItemPickupMenu.sY + gItemPickupMenu.sHeight);

    gItemPickupMenu.fDirtyLevel = 0;
  }
}

function RemoveItemPickupMenu(): void {
  let cnt: INT32;

  if (gfInItemPickupMenu) {
    gfSMDisableForItems = FALSE;

    HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), NULL, TRUE);

    UnLockPauseState();
    UnPauseGame();
    // UnPause timers as well....
    PauseTime(FALSE);

    // Unfreese guy!
    gItemPickupMenu.pSoldier->fPauseAllAnimation = FALSE;

    // Remove graphics!
    DeleteVideoObjectFromIndex(gItemPickupMenu.uiPanelVo);

    // Remove buttons
    if (gItemPickupMenu.bNumSlotsPerPage == NUM_PICKUP_SLOTS && gItemPickupMenu.ubTotalItems > NUM_PICKUP_SLOTS) {
      RemoveButton(gItemPickupMenu.iUpButton);
      RemoveButton(gItemPickupMenu.iDownButton);
    }
    RemoveButton(gItemPickupMenu.iAllButton);
    RemoveButton(gItemPickupMenu.iOKButton);
    RemoveButton(gItemPickupMenu.iCancelButton);

    // Remove button images
    UnloadButtonImage(gItemPickupMenu.iUpButtonImages);
    UnloadButtonImage(gItemPickupMenu.iDownButtonImages);
    UnloadButtonImage(gItemPickupMenu.iAllButtonImages);
    UnloadButtonImage(gItemPickupMenu.iCancelButtonImages);
    UnloadButtonImage(gItemPickupMenu.iOKButtonImages);

    MSYS_RemoveRegion(&(gItemPickupMenu.BackRegions));
    MSYS_RemoveRegion(&(gItemPickupMenu.BackRegion));

    // Remove regions
    for (cnt = 0; cnt < gItemPickupMenu.bNumSlotsPerPage; cnt++) {
      MSYS_RemoveRegion(&(gItemPickupMenu.Regions[cnt]));
    }

    // Remove register rect
    if (gItemPickupMenu.iDirtyRect != -1) {
      // FreeBackgroundRect( gItemPickupMenu.iDirtyRect );
    }

    // Free selection list...
    MemFree(gItemPickupMenu.pfSelectedArray);
    gItemPickupMenu.pfSelectedArray = NULL;

    // Set cursor back to normal mode...
    guiPendingOverrideEvent = A_CHANGE_TO_MOVE;

    // Rerender world
    SetRenderFlags(RENDER_FLAG_FULL);

    gfInItemPickupMenu = FALSE;

    // gfSMDisableForItems = FALSE;
    // EnableButtonsForInItemBox( TRUE );
    EnableSMPanelButtons(TRUE, TRUE);
    gfSMDisableForItems = FALSE;

    fInterfacePanelDirty = DIRTYLEVEL2;

    // Turn off Ignore scrolling
    gfIgnoreScrolling = FALSE;
    DisableTacticalTeamPanelButtons(FALSE);
    gubSelectSMPanelToMerc = gpSMCurrentMerc->ubID;
  }
}

function ItemPickupScrollUp(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    SetupPickupPage((gItemPickupMenu.bScrollPage - 1));
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function ItemPickupScrollDown(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    SetupPickupPage((gItemPickupMenu.bScrollPage + 1));
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function ItemPickupAll(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let cnt: INT32;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    gItemPickupMenu.fAllSelected = !gItemPickupMenu.fAllSelected;

    // OK, pickup item....
    // gItemPickupMenu.fHandled = TRUE;
    // Tell our soldier to pickup this item!
    // SoldierGetItemFromWorld( gItemPickupMenu.pSoldier, ITEM_PICKUP_ACTION_ALL, gItemPickupMenu.sGridNo, gItemPickupMenu.bZLevel, NULL );
    for (cnt = 0; cnt < gItemPickupMenu.ubTotalItems; cnt++) {
      gItemPickupMenu.pfSelectedArray[cnt] = gItemPickupMenu.fAllSelected;
    }

    if (gItemPickupMenu.fAllSelected) {
      EnableButton(gItemPickupMenu.iOKButton);
    } else {
      DisableButton(gItemPickupMenu.iOKButton);
    }
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function ItemPickupOK(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let cnt: INT32 = 0;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, pickup item....
    gItemPickupMenu.fHandled = TRUE;

    // Tell our soldier to pickup this item!
    SoldierGetItemFromWorld(gItemPickupMenu.pSoldier, ITEM_PICKUP_SELECTION, gItemPickupMenu.sGridNo, gItemPickupMenu.bZLevel, gItemPickupMenu.pfSelectedArray);
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function ItemPickupCancel(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let cnt: INT32 = 0;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, pickup item....
    gItemPickupMenu.fHandled = TRUE;
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function ItemPickMenuMouseMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let uiItemPos: UINT32;
  let pTempItemPool: Pointer<ITEM_POOL>;
  let bPos: INT32;
  /* static */ let bChecked: BOOLEAN = FALSE;

  uiItemPos = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    bPos = (uiItemPos + gItemPickupMenu.ubScrollAnchor);

    if (bPos < gItemPickupMenu.ubTotalItems) {
      // Set current selected guy....
      gItemPickupMenu.bCurSelect = bPos;

      if (!bChecked) {
        // Show compatible ammo...
        pTempItemPool = gItemPickupMenu.ItemPoolSlots[gItemPickupMenu.bCurSelect - gItemPickupMenu.ubScrollAnchor];

        memcpy(&(gItemPickupMenu.CompAmmoObject), &(gWorldItems[pTempItemPool->iItemIndex].o), sizeof(OBJECTTYPE));

        // Turn off first...
        HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), NULL, TRUE);
        InternalHandleCompatibleAmmoUI(gpSMCurrentMerc, &(gItemPickupMenu.CompAmmoObject), TRUE);

        HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), &(gWorldItems[pTempItemPool->iItemIndex].o), FALSE);

        SetItemPickupMenuDirty(DIRTYLEVEL2);

        bChecked = TRUE;
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gItemPickupMenu.bCurSelect = 255;

    InternalHandleCompatibleAmmoUI(gpSMCurrentMerc, &(gItemPickupMenu.CompAmmoObject), FALSE);
    HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), NULL, TRUE);

    SetItemPickupMenuDirty(DIRTYLEVEL2);

    bChecked = FALSE;
  }
}

function ItemPickupBackgroundClick(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // OK, goto team panel....
    ToggleTacticalPanels();
  }
}

function ItemPickMenuMouseClickCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let uiItemPos: INT32;
  let cnt: UINT8;
  let fEnable: BOOLEAN = FALSE;

  uiItemPos = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (uiItemPos + gItemPickupMenu.ubScrollAnchor < gItemPickupMenu.ubTotalItems) {
      // Toggle selection... ONLY IF LEGAL!!
      gItemPickupMenu.pfSelectedArray[uiItemPos + gItemPickupMenu.ubScrollAnchor] = !gItemPickupMenu.pfSelectedArray[uiItemPos + gItemPickupMenu.ubScrollAnchor];

      // OK, pickup item....
      // gItemPickupMenu.fHandled = TRUE;

      // pTempItemPool = gItemPickupMenu.ItemPoolSlots[ gItemPickupMenu.bCurSelect - gItemPickupMenu.ubScrollAnchor ];

      // Tell our soldier to pickup this item!
      // SoldierGetItemFromWorld( gItemPickupMenu.pSoldier, pTempItemPool->iItemIndex, gItemPickupMenu.sGridNo, gItemPickupMenu.bZLevel );
    }

    // Loop through all and set /unset OK
    for (cnt = 0; cnt < gItemPickupMenu.ubTotalItems; cnt++) {
      if (gItemPickupMenu.pfSelectedArray[cnt]) {
        fEnable = TRUE;
        break;
      }
    }

    if (fEnable) {
      EnableButton(gItemPickupMenu.iOKButton);
    } else {
      DisableButton(gItemPickupMenu.iOKButton);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function HandleItemPickupMenu(): BOOLEAN {
  if (!gfInItemPickupMenu) {
    return FALSE;
  }

  if (gItemPickupMenu.fHandled) {
    RemoveItemPickupMenu();
  }

  return gItemPickupMenu.fHandled;
}

function BtnMoneyButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let i: INT8;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);

    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    switch (ubButton) {
      case M_1000:
        if (gRemoveMoney.uiMoneyRemaining >= 1000) {
          // if the player is removing money from their account, and they are removing more then $20,000
          if (gfAddingMoneyToMercFromPlayersAccount && (gRemoveMoney.uiMoneyRemoving + 1000) > MAX_MONEY_PER_SLOT) {
            if (guiCurrentScreen == SHOPKEEPER_SCREEN)
              DoMessageBox(MSG_BOX_BASIC_STYLE, gzMoneyWithdrawMessageText[MONEY_TEXT_WITHDRAW_MORE_THEN_MAXIMUM], SHOPKEEPER_SCREEN, MSG_BOX_FLAG_OK, NULL, NULL);
            else
              DoMessageBox(MSG_BOX_BASIC_STYLE, gzMoneyWithdrawMessageText[MONEY_TEXT_WITHDRAW_MORE_THEN_MAXIMUM], GAME_SCREEN, MSG_BOX_FLAG_OK, NULL, NULL);
            return;
          }

          gRemoveMoney.uiMoneyRemaining -= 1000;
          gRemoveMoney.uiMoneyRemoving += 1000;
        }
        break;
      case M_100:
        if (gRemoveMoney.uiMoneyRemaining >= 100) {
          // if the player is removing money from their account, and they are removing more then $20,000
          if (gfAddingMoneyToMercFromPlayersAccount && (gRemoveMoney.uiMoneyRemoving + 100) > MAX_MONEY_PER_SLOT) {
            DoMessageBox(MSG_BOX_BASIC_STYLE, gzMoneyWithdrawMessageText[MONEY_TEXT_WITHDRAW_MORE_THEN_MAXIMUM], GAME_SCREEN, MSG_BOX_FLAG_OK, NULL, NULL);
            return;
          }

          gRemoveMoney.uiMoneyRemaining -= 100;
          gRemoveMoney.uiMoneyRemoving += 100;
        }
        break;
      case M_10:
        if (gRemoveMoney.uiMoneyRemaining >= 10) {
          // if the player is removing money from their account, and they are removing more then $20,000
          if (gfAddingMoneyToMercFromPlayersAccount && (gRemoveMoney.uiMoneyRemoving + 10) > MAX_MONEY_PER_SLOT) {
            DoMessageBox(MSG_BOX_BASIC_STYLE, gzMoneyWithdrawMessageText[MONEY_TEXT_WITHDRAW_MORE_THEN_MAXIMUM], GAME_SCREEN, MSG_BOX_FLAG_OK, NULL, NULL);
            return;
          }

          gRemoveMoney.uiMoneyRemaining -= 10;
          gRemoveMoney.uiMoneyRemoving += 10;
        }
        break;
      case M_DONE: {
        RemoveMoney();

        DeleteItemDescriptionBox();
      } break;
    }
    if (ubButton != M_DONE) {
      RenderItemDescriptionBox();
      for (i = 0; i < MAX_ATTACHMENTS; i++) {
        MarkAButtonDirty(guiMoneyButtonBtn[i]);
      }
    }

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }

  if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);

    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    switch (ubButton) {
      case M_1000:
        if (gRemoveMoney.uiMoneyRemoving >= 1000) {
          gRemoveMoney.uiMoneyRemaining += 1000;
          gRemoveMoney.uiMoneyRemoving -= 1000;
        }
        break;
      case M_100:
        if (gRemoveMoney.uiMoneyRemoving >= 100) {
          gRemoveMoney.uiMoneyRemaining += 100;
          gRemoveMoney.uiMoneyRemoving -= 100;
        }
        break;
      case M_10:
        if (gRemoveMoney.uiMoneyRemoving >= 10) {
          gRemoveMoney.uiMoneyRemaining += 10;
          gRemoveMoney.uiMoneyRemoving -= 10;
        }
        break;
    }

    RenderItemDescriptionBox();
    for (i = 0; i < MAX_ATTACHMENTS; i++) {
      MarkAButtonDirty(guiMoneyButtonBtn[i]);
    }

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function RemoveMoney(): void {
  if (gRemoveMoney.uiMoneyRemoving != 0) {
    // if we are in the shop keeper interface
    if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
      let InvSlot: INVENTORY_IN_SLOT;

      memset(&InvSlot, 0, sizeof(INVENTORY_IN_SLOT));

      InvSlot.fActive = TRUE;
      InvSlot.sItemIndex = MONEY;
      InvSlot.bSlotIdInOtherLocation = -1;

      // Remove the money from the money in the pocket
      gpItemDescObject->uiMoneyAmount = gRemoveMoney.uiMoneyRemaining;

      // Create an item to get the money that is being removed
      CreateItem(MONEY, 0, &InvSlot.ItemObject);

      // Set the amount thast is being removed
      InvSlot.ItemObject.uiMoneyAmount = gRemoveMoney.uiMoneyRemoving;
      InvSlot.ubIdOfMercWhoOwnsTheItem = gpItemDescSoldier->ubProfile;

      // if we are removing money from the players account
      if (gfAddingMoneyToMercFromPlayersAccount) {
        gpItemDescObject->uiMoneyAmount = gRemoveMoney.uiMoneyRemoving;

        // take the money from the player
        AddTransactionToPlayersBook(TRANSFER_FUNDS_TO_MERC, gpSMCurrentMerc->ubProfile, GetWorldTotalMin(), -(gpItemDescObject->uiMoneyAmount));
      }

      memcpy(&gMoveingItem, &InvSlot, sizeof(INVENTORY_IN_SLOT));

      memcpy(&gItemPointer, &InvSlot.ItemObject, sizeof(OBJECTTYPE));
      gpItemPointer = &gItemPointer;
      gpItemPointerSoldier = gpSMCurrentMerc;

      // Set mouse
      SetSkiCursor(EXTERN_CURSOR);

      // Restrict the cursor to the proper area
      RestrictSkiMouseCursor();
    } else {
      CreateMoney(gRemoveMoney.uiMoneyRemoving, &gItemPointer);
      gpItemPointer = &gItemPointer;
      // Asign the soldier to be the currently selected soldier
      gpItemPointerSoldier = gpItemDescSoldier;

      // Remove the money from the money in the pocket
      // if we are removing money from the players account
      if (gfAddingMoneyToMercFromPlayersAccount) {
        gpItemDescObject->uiMoneyAmount = gRemoveMoney.uiMoneyRemoving;

        // take the money from the player
        AddTransactionToPlayersBook(TRANSFER_FUNDS_TO_MERC, gpSMCurrentMerc->ubProfile, GetWorldTotalMin(), -(gpItemDescObject->uiMoneyAmount));
      } else
        gpItemDescObject->uiMoneyAmount = gRemoveMoney.uiMoneyRemaining;

      if (guiCurrentItemDescriptionScreen == MAP_SCREEN) {
        // Set mouse
        guiExternVo = GetInterfaceGraphicForItem(&(Item[gpItemPointer->usItem]));
        gusExternVoSubIndex = Item[gpItemPointer->usItem].ubGraphicNum;

        MSYS_ChangeRegionCursor(&gMPanelRegion, EXTERN_CURSOR);
        MSYS_SetCurrentCursor(EXTERN_CURSOR);
        fMapInventoryItem = TRUE;
        fTeamPanelDirty = TRUE;
      }
    }
  }

  //	if( gfAddingMoneyToMercFromPlayersAccount )
  //		gfAddingMoneyToMercFromPlayersAccount = FALSE;
}

function AttemptToApplyCamo(pSoldier: Pointer<SOLDIERTYPE>, usItemIndex: UINT16): BOOLEAN {
  return FALSE;
}

function GetHelpTextForItem(pzStr: Pointer<INT16>, pObject: Pointer<OBJECTTYPE>, pSoldier: Pointer<SOLDIERTYPE>): void {
  let pStr: INT16[] /* [250] */;
  let usItem: UINT16 = pObject->usItem;
  let cnt: INT32 = 0;
  let iNumAttachments: INT32 = 0;

  if (pSoldier != NULL) {
    if (pSoldier->uiStatusFlags & SOLDIER_DEAD) {
      swprintf(pStr, L"");
      swprintf(pzStr, L"%s", pStr);
      return;
    }
  }

  if (usItem == MONEY) {
    swprintf(pStr, L"%ld", pObject->uiMoneyAmount);
    InsertCommasForDollarFigure(pStr);
    InsertDollarSignInToString(pStr);
  } else if (Item[usItem].usItemClass == IC_MONEY) {
    // alternate money like silver or gold
    let pStr2: INT16[] /* [20] */;
    swprintf(pStr2, L"%ld", pObject->uiMoneyAmount);
    InsertCommasForDollarFigure(pStr2);
    InsertDollarSignInToString(pStr2);

    swprintf(pStr, L"%s (%ls)", ItemNames[usItem], pStr2);
  } else if (usItem != NOTHING) {
    if (!gGameOptions.fGunNut && Item[usItem].usItemClass == IC_GUN && usItem != ROCKET_LAUNCHER && usItem != ROCKET_RIFLE) {
      swprintf(pStr, L"%s (%s)", ItemNames[usItem], AmmoCaliber[Weapon[usItem].ubCalibre]);
    } else {
      swprintf(pStr, L"%s", ItemNames[usItem]);
    }

    if ((pObject->usItem == ROCKET_RIFLE || pObject->usItem == AUTO_ROCKET_RIFLE) && pObject->ubImprintID < NO_PROFILE) {
      let pStr2: INT16[] /* [20] */;
      swprintf(pStr2, L" [%s]", gMercProfiles[pObject->ubImprintID].zNickname);
      wcscat(pStr, pStr2);
    }

    // Add attachment string....
    for (cnt = 0; cnt < MAX_ATTACHMENTS; cnt++) {
      if (pObject->usAttachItem[cnt] != NOTHING) {
        iNumAttachments++;

        if (iNumAttachments == 1) {
          wcscat(pStr, L" ( ");
        } else {
          wcscat(pStr, L", \n");
        }

        wcscat(pStr, ItemNames[pObject->usAttachItem[cnt]]);
      }
    }

    if (iNumAttachments > 0) {
      wcscat(pStr, pMessageStrings[MSG_END_ATTACHMENT_LIST]);
    }
  } else {
    swprintf(pStr, L"");
  }

  // Copy over...
  swprintf(pzStr, L"%s", pStr);
}

function GetPrefferedItemSlotGraphicNum(usItem: UINT16): UINT8 {
  // Check for small item...
  if (Item[usItem].ubPerPocket >= 1) {
    // Small
    return 2;
  }

  // Now it could be large or armour, check class...
  if (Item[usItem].usItemClass == IC_ARMOUR) {
    return 1;
  }

  // OK, it's a big one...
  return 0;
}

function CancelItemPointer(): void {
  // ATE: If we have an item pointer end it!
  if (gpItemPointer != NULL) {
    if (gbItemPointerSrcSlot != NO_SLOT) {
      // Place it back in our hands!
      PlaceObject(gpItemPointerSoldier, gbItemPointerSrcSlot, gpItemPointer);

      // ATE: This could potnetially swap!
      // Make sure # of items is 0, if not, auto place somewhere else...
      if (gpItemPointer->ubNumberOfObjects > 0) {
        if (!AutoPlaceObject(gpItemPointerSoldier, gpItemPointer, FALSE)) {
          // Alright, place of the friggen ground!
          AddItemToPool(gpItemPointerSoldier->sGridNo, gpItemPointer, 1, gpItemPointerSoldier->bLevel, 0, -1);
          NotifySoldiersToLookforItems();
        }
      }
    } else {
      // We drop it here.....
      AddItemToPool(gpItemPointerSoldier->sGridNo, gpItemPointer, 1, gpItemPointerSoldier->bLevel, 0, -1);
      NotifySoldiersToLookforItems();
    }
    EndItemPointer();
  }
}

interface ITEM_CURSOR_SAVE_INFO {
  ItemPointerInfo: OBJECTTYPE;
  ubSoldierID: UINT8;
  ubInvSlot: UINT8;
  fCursorActive: BOOLEAN;
  bPadding: INT8[] /* [5] */;
}

function LoadItemCursorFromSavedGame(hFile: HWFILE): BOOLEAN {
  let uiLoadSize: UINT32 = 0;
  let uiNumBytesRead: UINT32 = 0;
  let SaveStruct: ITEM_CURSOR_SAVE_INFO;

  // Load structure
  uiLoadSize = sizeof(ITEM_CURSOR_SAVE_INFO);
  FileRead(hFile, &SaveStruct, uiLoadSize, &uiNumBytesRead);
  if (uiNumBytesRead != uiLoadSize) {
    return FALSE;
  }

  // Now set things up.....
  // Copy object
  memcpy(&gItemPointer, &(SaveStruct.ItemPointerInfo), sizeof(OBJECTTYPE));

  // Copy soldier ID
  if (SaveStruct.ubSoldierID == NOBODY) {
    gpItemPointerSoldier = NULL;
  } else {
    gpItemPointerSoldier = MercPtrs[SaveStruct.ubSoldierID];
  }

  // Inv slot
  gbItemPointerSrcSlot = SaveStruct.ubInvSlot;

  // Boolean
  if (SaveStruct.fCursorActive) {
    gpItemPointer = &(gItemPointer);
    ReEvaluateDisabledINVPanelButtons();
  } else {
    gpItemPointer = NULL;
  }

  return TRUE;
}

function SaveItemCursorToSavedGame(hFile: HWFILE): BOOLEAN {
  let uiSaveSize: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;

  let SaveStruct: ITEM_CURSOR_SAVE_INFO;

  // Setup structure;
  memset(&SaveStruct, 0, sizeof(ITEM_CURSOR_SAVE_INFO));
  memcpy(&(SaveStruct.ItemPointerInfo), &gItemPointer, sizeof(OBJECTTYPE));

  // Soldier
  if (gpItemPointerSoldier != NULL) {
    SaveStruct.ubSoldierID = gpItemPointerSoldier->ubID;
  } else {
    SaveStruct.ubSoldierID = NOBODY;
  }

  // INv slot
  SaveStruct.ubInvSlot = gbItemPointerSrcSlot;

  // Boolean
  if (gpItemPointer != NULL) {
    SaveStruct.fCursorActive = TRUE;
  } else {
    SaveStruct.fCursorActive = FALSE;
  }

  // save locations of watched points
  uiSaveSize = sizeof(ITEM_CURSOR_SAVE_INFO);
  FileWrite(hFile, &SaveStruct, uiSaveSize, &uiNumBytesWritten);
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // All done...

  return TRUE;
}

function UpdateItemHatches(): void {
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    if (fShowInventoryFlag && bSelectedInfoChar >= 0) {
      pSoldier = MercPtrs[gCharactersList[bSelectedInfoChar].usSolID];
    }
  } else {
    pSoldier = gpSMCurrentMerc;
  }

  if (pSoldier != NULL) {
    ReevaluateItemHatches(pSoldier, (gpItemPointer == NULL));
  }
}
