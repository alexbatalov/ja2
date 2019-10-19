const INVALIDCURS = 0;
const QUESTCURS = 1;
const PUNCHCURS = 2;
const TARGETCURS = 3;
const KNIFECURS = 4;
const AIDCURS = 5;
const TOSSCURS = 6;
const MINECURS = 8;
const LPICKCURS = 9;
const MDETECTCURS = 10;
const CROWBARCURS = 11;
const SURVCAMCURS = 12;
const CAMERACURS = 13;
const KEYCURS = 14;
const SAWCURS = 15;
const WIRECUTCURS = 16;
const REMOTECURS = 17;
const BOMBCURS = 18; // ( only calculated, not set item table )
const REPAIRCURS = 19;
const TRAJECTORYCURS = 20;
const JARCURS = 21;
const TINCANCURS = 22;
const REFUELCURS = 23;

const CAMERARANGE = 10;

const CONDBUL = 0;
const COND = 0;
const SINGLE = 0;
const LIQ = 0;
const USAGE = 0;
const BUCKS = 0;

const ITEM_NOT_FOUND = -1;

const USABLE = 10; // minimum work% of items to still be usable

const MAX_OBJECTS_PER_SLOT = 8;
const MAX_ATTACHMENTS = 4;
const MAX_MONEY_PER_SLOT = 20000;

typedef enum {
  BOMB_TIMED = 1,
  BOMB_REMOTE,
  BOMB_PRESSURE,
  BOMB_SWITCH,
} DetonatorType;

const FIRST_MAP_PLACED_FREQUENCY = 50;
const PANIC_FREQUENCY = 127;
const PANIC_FREQUENCY_2 = 126;
const PANIC_FREQUENCY_3 = 125;

const OBJECT_UNDROPPABLE = 0x01;
const OBJECT_MODIFIED = 0x02;
const OBJECT_AI_UNUSABLE = 0x04;
const OBJECT_ARMED_BOMB = 0x08;
const OBJECT_KNOWN_TO_BE_TRAPPED = 0x10;
const OBJECT_DISABLED_BOMB = 0x20;
const OBJECT_ALARM_TRIGGER = 0x40;
const OBJECT_NO_OVERWRITE = 0x80;

typedef struct {
  UINT16 usItem;
  UINT8 ubNumberOfObjects;
  union {
    struct {
      INT8 bGunStatus; // status % of gun
      UINT8 ubGunAmmoType; // ammo type, as per weapons.h
      UINT8 ubGunShotsLeft; // duh, amount of ammo left
      UINT16 usGunAmmoItem; // the item # for the item table
      INT8 bGunAmmoStatus; // only for "attached ammo" - grenades, mortar shells
      UINT8 ubGunUnused[MAX_OBJECTS_PER_SLOT - 6];
    };
    struct {
      UINT8 ubShotsLeft[MAX_OBJECTS_PER_SLOT];
    };
    struct {
      INT8 bStatus[MAX_OBJECTS_PER_SLOT];
    };
    struct {
      INT8 bMoneyStatus;
      UINT32 uiMoneyAmount;
      UINT8 ubMoneyUnused[MAX_OBJECTS_PER_SLOT - 5];
    };
    struct {
      // this is used by placed bombs, switches, and the action item
      INT8 bBombStatus; // % status
      INT8 bDetonatorType; // timed, remote, or pressure-activated
      UINT16 usBombItem; // the usItem of the bomb.
      union {
        struct {
          INT8 bDelay; // >=0 values used only
        };
        struct {
          INT8 bFrequency; // >=0 values used only
        };
      };
      UINT8 ubBombOwner; // side which placed the bomb
      UINT8 bActionValue; // this is used by the ACTION_ITEM fake item
      union {
        struct {
          UINT8 ubTolerance; // tolerance value for panic triggers
        };
        struct {
          UINT8 ubLocationID; // location value for remote non-bomb (special!) triggers
        };
      };
    };
    struct {
      INT8 bKeyStatus[6];
      UINT8 ubKeyID;
      UINT8 ubKeyUnused[1];
    };
    struct {
      UINT8 ubOwnerProfile;
      UINT8 ubOwnerCivGroup;
      UINT8 ubOwnershipUnused[6];
    };
  };
  // attached objects
  UINT16 usAttachItem[MAX_ATTACHMENTS];
  INT8 bAttachStatus[MAX_ATTACHMENTS];

  INT8 fFlags;
  UINT8 ubMission;
  INT8 bTrap; // 1-10 exp_lvl to detect
  UINT8 ubImprintID; // ID of merc that item is imprinted on
  UINT8 ubWeight;
  UINT8 fUsed; // flags for whether the item is used or not
} OBJECTTYPE;

/*
typedef struct
{
        UINT8		ubCursor;
        INT8		bSoundType;
        UINT8		ubGraphicNum;
        INT8		bMaxLoad;

        UINT8		ubPerPocket;
        UINT8		ubCanDamage;
        UINT8		ubWaterDamage;
        UINT8		ubCanRepair;

        UINT8		ubSeeMeter;
        UINT8		ubRange;
        UINT8		ubMetal;
        UINT8		ubSinkable;

        UINT16	ubPrice;
        UINT8		ubMission;
        UINT8		ubCoolness;
} INVTYPE;

*/

// SUBTYPES
const IC_NONE = 0x00000001;
const IC_GUN = 0x00000002;
const IC_BLADE = 0x00000004;
const IC_THROWING_KNIFE = 0x00000008;

const IC_LAUNCHER = 0x00000010;
const IC_TENTACLES = 0x00000020;

const IC_THROWN = 0x00000040;
const IC_PUNCH = 0x00000080;

const IC_GRENADE = 0x00000100;
const IC_BOMB = 0x00000200;
const IC_AMMO = 0x00000400;
const IC_ARMOUR = 0x00000800;

const IC_MEDKIT = 0x00001000;
const IC_KIT = 0x00002000;
const IC_APPLIABLE = 0x00004000;
const IC_FACE = 0x00008000;

const IC_KEY = 0x00010000;

const IC_MISC = 0x10000000;
const IC_MONEY = 0x20000000;

// PARENT TYPES
const IC_WEAPON = (IC_GUN | IC_BLADE | IC_THROWING_KNIFE | IC_LAUNCHER | IC_TENTACLES);
const IC_EXPLOSV = (IC_GRENADE | IC_BOMB);

const IC_BOBBY_GUN = (IC_GUN | IC_LAUNCHER);
const IC_BOBBY_MISC = (IC_GRENADE | IC_BOMB | IC_MISC | IC_MEDKIT | IC_KIT | IC_BLADE | IC_THROWING_KNIFE | IC_PUNCH | IC_FACE);

// replaces candamage
const ITEM_DAMAGEABLE = 0x0001;
// replaces canrepair
const ITEM_REPAIRABLE = 0x0002;
// replaces waterdamage
const ITEM_WATER_DAMAGES = 0x0004;
// replaces metal
const ITEM_METAL = 0x0008;
// replaces sinkable
const ITEM_SINKS = 0x0010;
// replaces seemeter
const ITEM_SHOW_STATUS = 0x0020;
// for attachers/merges, hidden
const ITEM_HIDDEN_ADDON = 0x0040;
// needs two hands
const ITEM_TWO_HANDED = 0x0080;
// can't be found for sale
const ITEM_NOT_BUYABLE = 0x0100;
// item is an attachment for something
const ITEM_ATTACHMENT = 0x0200;
// item only belongs in the "big gun list"
const ITEM_BIGGUNLIST = 0x0400;
// item should not be placed via the editor
const ITEM_NOT_EDITOR = 0x0800;
// item defaults to undroppable
const ITEM_DEFAULT_UNDROPPABLE = 0x1000;
// item is terrible for throwing
const ITEM_UNAERODYNAMIC = 0x2000;
// item is electronic for repair (etc) purposes
const ITEM_ELECTRONIC = 0x4000;
// item is a PERMANENT attachment
const ITEM_INSEPARABLE = 0x8000;

// item flag combinations

const IF_STANDARD_GUN = ITEM_DAMAGEABLE | ITEM_WATER_DAMAGES | ITEM_REPAIRABLE | ITEM_SHOW_STATUS | ITEM_METAL | ITEM_SINKS;
const IF_TWOHANDED_GUN = IF_STANDARD_GUN | ITEM_TWO_HANDED;
const IF_STANDARD_BLADE = ITEM_DAMAGEABLE | ITEM_WATER_DAMAGES | ITEM_REPAIRABLE | ITEM_SHOW_STATUS | ITEM_METAL | ITEM_SINKS;
const IF_STANDARD_ARMOUR = ITEM_DAMAGEABLE | ITEM_REPAIRABLE | ITEM_SHOW_STATUS | ITEM_SINKS;
const IF_STANDARD_KIT = ITEM_DAMAGEABLE | ITEM_SHOW_STATUS | ITEM_SINKS;
const IF_STANDARD_CLIP = ITEM_SINKS | ITEM_METAL;

const EXPLOSIVE_GUN = (x) => (x == ROCKET_LAUNCHER || x == TANK_CANNON);

typedef struct {
  UINT32 usItemClass;
  UINT8 ubClassIndex;
  UINT8 ubCursor;
  INT8 bSoundType;
  UINT8 ubGraphicType;
  UINT8 ubGraphicNum;
  UINT8 ubWeight; // 2 units per kilogram; roughly 1 unit per pound
  UINT8 ubPerPocket;
  UINT16 usPrice;
  UINT8 ubCoolness;
  INT8 bReliability;
  INT8 bRepairEase;
  UINT16 fFlags;
} INVTYPE;

const FIRST_WEAPON = 1;
const FIRST_AMMO = 71;
const FIRST_EXPLOSIVE = 131;
const FIRST_ARMOUR = 161;
const FIRST_MISC = 201;
const FIRST_KEY = 271;

const NOTHING = NONE;
typedef enum {
  NONE = 0,

  // weapons
  GLOCK_17 = FIRST_WEAPON,
  GLOCK_18,
  BERETTA_92F,
  BERETTA_93R,
  SW38,
  BARRACUDA,
  DESERTEAGLE,
  M1911,
  MP5K,
  MAC10,

  THOMPSON,
  COMMANDO,
  MP53,
  AKSU74,
  P90,
  TYPE85,
  SKS,
  DRAGUNOV,
  M24,
  AUG,

  G41,
  MINI14,
  C7,
  FAMAS,
  AK74,
  AKM,
  M14,
  FNFAL,
  G3A3,
  G11,

  M870,
  SPAS15,
  CAWS,
  MINIMI,
  RPK74,
  HK21E,
  COMBAT_KNIFE,
  THROWING_KNIFE,
  ROCK,
  GLAUNCHER,

  MORTAR,
  ROCK2,
  CREATURE_YOUNG_MALE_CLAWS,
  CREATURE_OLD_MALE_CLAWS,
  CREATURE_YOUNG_FEMALE_CLAWS,
  CREATURE_OLD_FEMALE_CLAWS,
  CREATURE_QUEEN_TENTACLES,
  CREATURE_QUEEN_SPIT,
  BRASS_KNUCKLES,
  UNDER_GLAUNCHER,

  ROCKET_LAUNCHER,
  BLOODCAT_CLAW_ATTACK,
  BLOODCAT_BITE,
  MACHETE,
  ROCKET_RIFLE,
  AUTOMAG_III,
  CREATURE_INFANT_SPIT,
  CREATURE_YOUNG_MALE_SPIT,
  CREATURE_OLD_MALE_SPIT,
  TANK_CANNON,

  DART_GUN,
  BLOODY_THROWING_KNIFE,
  FLAMETHROWER,
  CROWBAR,
  AUTO_ROCKET_RIFLE,

  MAX_WEAPONS = (FIRST_AMMO - 1),

  CLIP9_15 = FIRST_AMMO,
  CLIP9_30,
  CLIP9_15_AP,
  CLIP9_30_AP,
  CLIP9_15_HP,
  CLIP9_30_HP,
  CLIP38_6,
  CLIP38_6_AP,
  CLIP38_6_HP,
  CLIP45_7,

  CLIP45_30,
  CLIP45_7_AP,
  CLIP45_30_AP,
  CLIP45_7_HP,
  CLIP45_30_HP,
  CLIP357_6,
  CLIP357_9,
  CLIP357_6_AP,
  CLIP357_9_AP,
  CLIP357_6_HP,

  CLIP357_9_HP,
  CLIP545_30_AP,
  CLIP545_30_HP,
  CLIP556_30_AP,
  CLIP556_30_HP,
  CLIP762W_10_AP,
  CLIP762W_30_AP,
  CLIP762W_10_HP,
  CLIP762W_30_HP,
  CLIP762N_5_AP,

  CLIP762N_20_AP,
  CLIP762N_5_HP,
  CLIP762N_20_HP,
  CLIP47_50_SAP,
  CLIP57_50_AP,
  CLIP57_50_HP,
  CLIP12G_7,
  CLIP12G_7_BUCKSHOT,
  CLIPCAWS_10_SAP,
  CLIPCAWS_10_FLECH,

  CLIPROCKET_AP,
  CLIPROCKET_HE,
  CLIPROCKET_HEAT,
  CLIPDART_SLEEP,

  CLIPFLAME,

  // explosives
  STUN_GRENADE = FIRST_EXPLOSIVE,
  TEARGAS_GRENADE,
  MUSTARD_GRENADE,
  MINI_GRENADE,
  HAND_GRENADE,
  RDX,
  TNT,
  HMX,
  C1,
  MORTAR_SHELL,

  MINE,
  C4,
  TRIP_FLARE,
  TRIP_KLAXON,
  SHAPED_CHARGE,
  BREAK_LIGHT,
  GL_HE_GRENADE,
  GL_TEARGAS_GRENADE,
  GL_STUN_GRENADE,
  GL_SMOKE_GRENADE,

  SMOKE_GRENADE,
  TANK_SHELL,
  STRUCTURE_IGNITE,
  CREATURE_COCKTAIL,
  STRUCTURE_EXPLOSION,
  GREAT_BIG_EXPLOSION,
  BIG_TEAR_GAS,
  SMALL_CREATURE_GAS,
  LARGE_CREATURE_GAS,
  VERY_SMALL_CREATURE_GAS,

  // armor
  FLAK_JACKET, //= FIRST_ARMOUR, ( We're out of space! )
  FLAK_JACKET_18,
  FLAK_JACKET_Y,
  KEVLAR_VEST,
  KEVLAR_VEST_18,
  KEVLAR_VEST_Y,
  SPECTRA_VEST,
  SPECTRA_VEST_18,
  SPECTRA_VEST_Y,
  KEVLAR_LEGGINGS,

  KEVLAR_LEGGINGS_18,
  KEVLAR_LEGGINGS_Y,
  SPECTRA_LEGGINGS,
  SPECTRA_LEGGINGS_18,
  SPECTRA_LEGGINGS_Y,
  STEEL_HELMET,
  KEVLAR_HELMET,
  KEVLAR_HELMET_18,
  KEVLAR_HELMET_Y,
  SPECTRA_HELMET,

  SPECTRA_HELMET_18,
  SPECTRA_HELMET_Y,
  CERAMIC_PLATES,
  CREATURE_INFANT_HIDE,
  CREATURE_YOUNG_MALE_HIDE,
  CREATURE_OLD_MALE_HIDE,
  CREATURE_QUEEN_HIDE,
  LEATHER_JACKET,
  LEATHER_JACKET_W_KEVLAR,
  LEATHER_JACKET_W_KEVLAR_18,

  LEATHER_JACKET_W_KEVLAR_Y,
  CREATURE_YOUNG_FEMALE_HIDE,
  CREATURE_OLD_FEMALE_HIDE,
  TSHIRT,
  TSHIRT_DEIDRANNA,
  KEVLAR2_VEST,
  KEVLAR2_VEST_18,
  KEVLAR2_VEST_Y,

  // kits
  FIRSTAIDKIT = FIRST_MISC,
  MEDICKIT,
  TOOLKIT,
  LOCKSMITHKIT,
  CAMOUFLAGEKIT,
  BOOBYTRAPKIT,
  // miscellaneous
  SILENCER,
  SNIPERSCOPE,
  BIPOD,
  EXTENDEDEAR,

  NIGHTGOGGLES,
  SUNGOGGLES,
  GASMASK,
  CANTEEN,
  METALDETECTOR,
  COMPOUND18,
  JAR_QUEEN_CREATURE_BLOOD,
  JAR_ELIXIR,
  MONEY,
  JAR,

  JAR_CREATURE_BLOOD,
  ADRENALINE_BOOSTER,
  DETONATOR,
  REMDETONATOR,
  VIDEOTAPE,
  DEED,
  LETTER,
  TERRORIST_INFO,
  CHALICE,
  BLOODCAT_CLAWS,

  BLOODCAT_TEETH,
  BLOODCAT_PELT,
  SWITCH,
  // fake items
  ACTION_ITEM,
  REGEN_BOOSTER,
  SYRINGE_3,
  SYRINGE_4,
  SYRINGE_5,
  JAR_HUMAN_BLOOD,
  OWNERSHIP,

  // additional items
  LASERSCOPE,
  REMOTEBOMBTRIGGER,
  WIRECUTTERS,
  DUCKBILL,
  ALCOHOL,
  UVGOGGLES,
  DISCARDED_LAW,
  HEAD_1,
  HEAD_2,
  HEAD_3,
  HEAD_4,
  HEAD_5,
  HEAD_6,
  HEAD_7,
  WINE,
  BEER,
  PORNOS,
  VIDEO_CAMERA,
  ROBOT_REMOTE_CONTROL,
  CREATURE_PART_CLAWS,
  CREATURE_PART_FLESH,
  CREATURE_PART_ORGAN,
  REMOTETRIGGER,
  GOLDWATCH,
  GOLFCLUBS,
  WALKMAN,
  PORTABLETV,
  MONEY_FOR_PLAYERS_ACCOUNT,
  CIGARS,

  KEY_1 = FIRST_KEY,
  KEY_2,
  KEY_3,
  KEY_4,
  KEY_5,
  KEY_6,
  KEY_7,
  KEY_8,
  KEY_9,
  KEY_10,

  KEY_11,
  KEY_12,
  KEY_13,
  KEY_14,
  KEY_15,
  KEY_16,
  KEY_17,
  KEY_18,
  KEY_19,
  KEY_20,

  KEY_21,
  KEY_22,
  KEY_23,
  KEY_24,
  KEY_25,
  KEY_26,
  KEY_27,
  KEY_28,
  KEY_29,
  KEY_30,

  KEY_31,
  KEY_32, // 302
  SILVER_PLATTER,
  DUCT_TAPE,
  ALUMINUM_ROD,
  SPRING,
  SPRING_AND_BOLT_UPGRADE,
  STEEL_ROD,
  QUICK_GLUE,
  GUN_BARREL_EXTENDER,

  STRING,
  TIN_CAN,
  STRING_TIED_TO_TIN_CAN,
  MARBLES,
  LAME_BOY,
  COPPER_WIRE,
  DISPLAY_UNIT,
  FUMBLE_PAK,
  XRAY_BULB,
  CHEWING_GUM, // 320

  FLASH_DEVICE,
  BATTERIES,
  ELASTIC,
  XRAY_DEVICE,
  SILVER,
  GOLD,
  GAS_CAN,
  UNUSED_26,
  UNUSED_27,
  UNUSED_28,

  UNUSED_29,
  UNUSED_30,
  UNUSED_31,
  UNUSED_32,
  UNUSED_33,
  UNUSED_34,
  UNUSED_35,
  UNUSED_36,
  UNUSED_37,
  UNUSED_38, // 340

  UNUSED_39,
  UNUSED_40,
  UNUSED_41,
  UNUSED_42,
  UNUSED_43,
  UNUSED_44,
  UNUSED_45,
  UNUSED_46,
  UNUSED_47,
  UNUSED_48, // 350

  MAXITEMS,
} ITEMDEFINE;

const FIRST_HELMET = STEEL_HELMET;
const LAST_HELMET = SPECTRA_HELMET_Y;

const FIRST_VEST = FLAK_JACKET;
const LAST_VEST = KEVLAR2_VEST_Y;

const FIRST_LEGGINGS = KEVLAR_LEGGINGS;
const LAST_LEGGINGS = SPECTRA_LEGGINGS_Y;

const FIRST_HEAD_ITEM = EXTENDEDEAR;
const LAST_HEAD_ITEM = SUNGOGGLES;

extern INVTYPE Item[MAXITEMS];
