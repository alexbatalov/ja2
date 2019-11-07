namespace ja2 {

const MAXCHANCETOHIT = 99;
export const BAD_DODGE_POSITION_PENALTY = 20;

export const GUN_BARREL_RANGE_BONUS = 100;

// Special deaths can only occur within a limited distance to the target
export const MAX_DISTANCE_FOR_MESSY_DEATH = 7;
// If you do a lot of damage with a close-range shot, instant kill
export const MIN_DAMAGE_FOR_INSTANT_KILL = 55;
// If you happen to kill someone with a close-range shot doing a lot of damage to the head, head explosion
export const MIN_DAMAGE_FOR_HEAD_EXPLOSION = 45;
// If you happen to kill someone with a close-range shot doing a lot of damage to the chest, chest explosion
// This value is lower than head because of the damage bonus for shooting the head
export const MIN_DAMAGE_FOR_BLOWN_AWAY = 30;
// If you happen to hit someone in the legs for enough damage, REGARDLESS of distance, person falls down
// Leg damage is halved for these purposes
export const MIN_DAMAGE_FOR_AUTO_FALL_OVER = 20;

// short range at which being prone provides to hit penalty when shooting standing people
export const MIN_PRONE_RANGE = 50;

// can't miss at this range?
export const POINT_BLANK_RANGE = 16;

const BODY_IMPACT_ABSORPTION = 20;

export const BUCKSHOT_SHOTS = 9;

export const MIN_MORTAR_RANGE = 150; // minimum range of a mortar

// WEAPON CLASSES
export const enum Enum282 {
  NOGUNCLASS,
  HANDGUNCLASS,
  SMGCLASS,
  RIFLECLASS,
  MGCLASS,
  SHOTGUNCLASS,
  KNIFECLASS,
  MONSTERCLASS,
  NUM_WEAPON_CLASSES,
}

// exact gun types
export const enum Enum283 {
  NOT_GUN = 0,
  GUN_PISTOL,
  GUN_M_PISTOL,
  GUN_SMG,
  GUN_RIFLE,
  GUN_SN_RIFLE,
  GUN_AS_RIFLE,
  GUN_LMG,
  GUN_SHOTGUN,
}

// ARMOUR CLASSES
export const enum Enum284 {
  ARMOURCLASS_HELMET,
  ARMOURCLASS_VEST,
  ARMOURCLASS_LEGGINGS,
  ARMOURCLASS_PLATE,
  ARMOURCLASS_MONST,
  ARMOURCLASS_VEHICLE,
}

// Warning: There is a table in weapons.c that indexes using these enumberations...
// BurstSndStrings[]....
export const enum Enum285 {
  NOAMMO = 0,
  AMMO38,
  AMMO9,
  AMMO45,
  AMMO357,
  AMMO12G,
  AMMOCAWS,
  AMMO545,
  AMMO556,
  AMMO762N,
  AMMO762W,
  AMMO47,
  AMMO57,
  AMMOMONST,
  AMMOROCKET,
  AMMODART,
  AMMOFLAME,
}

export const enum Enum286 {
  AMMO_REGULAR = 0,
  AMMO_HP,
  AMMO_AP,
  AMMO_SUPER_AP,
  AMMO_BUCKSHOT,
  AMMO_FLECHETTE,
  AMMO_GRENADE,
  AMMO_MONSTER,
  AMMO_KNIFE,
  AMMO_HE,
  AMMO_HEAT,
  AMMO_SLEEP_DART,
  AMMO_FLAME,
}

export const enum Enum287 {
  EXPLOSV_NORMAL,
  EXPLOSV_STUN,
  EXPLOSV_TEARGAS,
  EXPLOSV_MUSTGAS,
  EXPLOSV_FLARE,
  EXPLOSV_NOISE,
  EXPLOSV_SMOKE,
  EXPLOSV_CREATUREGAS,
}

export const AMMO_DAMAGE_ADJUSTMENT_BUCKSHOT = (x) => (x / 4);
export const NUM_BUCKSHOT_PELLETS = 9;

// hollow point bullets do lots of damage to people
export const AMMO_DAMAGE_ADJUSTMENT_HP = (x) => ((x * 17) / 10);
// but they SUCK at penetrating armour
export const AMMO_ARMOUR_ADJUSTMENT_HP = (x) => ((x * 3) / 2);
// armour piercing bullets are good at penetrating armour
export const AMMO_ARMOUR_ADJUSTMENT_AP = (x) => ((x * 3) / 4);
// "super" AP bullets are great at penetrating armour
export const AMMO_ARMOUR_ADJUSTMENT_SAP = (x) => (x / 2);

// high explosive damage value (PRIOR to armour subtraction)
export const AMMO_DAMAGE_ADJUSTMENT_HE = (x) => ((x * 4) / 3);

// but they SUCK at penetrating armour
export const AMMO_STRUCTURE_ADJUSTMENT_HP = (x) => (x * 2);
// armour piercing bullets are good at penetrating structure
export const AMMO_STRUCTURE_ADJUSTMENT_AP = (x) => ((x * 3) / 4);
// "super" AP bullets are great at penetrating structures
export const AMMO_STRUCTURE_ADJUSTMENT_SAP = (x) => (x / 2);

// one quarter of punching damage is "real" rather than breath damage
export const PUNCH_REAL_DAMAGE_PORTION = 4;

export const AIM_BONUS_SAME_TARGET = 10; // chance-to-hit bonus (in %)
export const AIM_BONUS_PER_AP = 10; // chance-to-hit bonus (in %) for aim
export const AIM_BONUS_CROUCHING = 10;
export const AIM_BONUS_PRONE = 20;
const AIM_BONUS_TWO_HANDED_PISTOL = 5;
export const AIM_BONUS_FIRING_DOWN = 15;
const AIM_PENALTY_ONE_HANDED_PISTOL = 5;
export const AIM_PENALTY_DUAL_PISTOLS = 20;
export const AIM_PENALTY_SMG = 5;
export const AIM_PENALTY_GASSED = 50;
export const AIM_PENALTY_GETTINGAID = 20;
export const AIM_PENALTY_PER_SHOCK = 5; // 5% penalty per point of shock
const AIM_BONUS_TARGET_HATED = 20;
export const AIM_BONUS_PSYCHO = 15;
const AIM_PENALTY_TARGET_BUDDY = 20;
const AIM_PENALTY_BURSTING = 10;
const AIM_PENALTY_GENTLEMAN = 15;
export const AIM_PENALTY_TARGET_CROUCHED = 20;
export const AIM_PENALTY_TARGET_PRONE = 40;
export const AIM_PENALTY_BLIND = 80;
export const AIM_PENALTY_FIRING_UP = 25;

export interface WEAPONTYPE {
  ubWeaponClass: UINT8; // handgun/shotgun/rifle/knife
  ubWeaponType: UINT8; // exact type (for display purposes)
  ubCalibre: UINT8; // type of ammunition needed
  ubReadyTime: UINT8; // APs to ready/unready weapon
  ubShotsPer4Turns: UINT8; // maximum (mechanical) firing rate
  ubShotsPerBurst: UINT8;
  ubBurstPenalty: UINT8; // % penalty per shot after first
  ubBulletSpeed: UINT8; // bullet's travelling speed
  ubImpact: UINT8; // weapon's max damage impact (size & speed)
  ubDeadliness: UINT8; // comparative ratings of guns
  bAccuracy: INT8; // accuracy or penalty
  ubMagSize: UINT8;
  usRange: UINT16;
  usReloadDelay: UINT16;
  ubAttackVolume: UINT8;
  ubHitVolume: UINT8;
  sSound: UINT16;
  sBurstSound: UINT16;
  sReloadSound: UINT16;
  sLocknLoadSound: UINT16;
}

export function createWeaponTypeFrom(ubWeaponClass: UINT8, ubWeaponType: UINT8, ubCalibre: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubBurstPenalty: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, usReloadDelay: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16, sReloadSound: UINT16, sLocknLoadSound: UINT16): WEAPONTYPE {
  return {
    ubWeaponClass,
    ubWeaponType,
    ubCalibre,
    ubReadyTime,
    ubShotsPer4Turns,
    ubShotsPerBurst,
    ubBurstPenalty,
    ubBulletSpeed,
    ubImpact,
    ubDeadliness,
    bAccuracy,
    ubMagSize,
    usRange,
    usReloadDelay,
    ubAttackVolume,
    ubHitVolume,
    sSound,
    sBurstSound,
    sReloadSound,
    sLocknLoadSound,
  };
}

export interface MAGTYPE {
  ubCalibre: UINT8;
  ubMagSize: UINT8;
  ubAmmoType: UINT8;
}

export function createMagTypeFrom(ubCalibre: UINT8, ubMagSize: UINT8, ubAmmoType: UINT8): MAGTYPE {
  return {
    ubCalibre,
    ubMagSize,
    ubAmmoType,
  };
}

export interface ARMOURTYPE {
  ubArmourClass: UINT8;
  ubProtection: UINT8;
  ubDegradePercent: UINT8;
}

export interface EXPLOSIVETYPE {
  ubType: UINT8; // type of explosive
  ubDamage: UINT8; // damage value
  ubStunDamage: UINT8; // stun amount / 100
  ubRadius: UINT8; // radius of effect
  ubVolume: UINT8; // sound radius of explosion
  ubVolatility: UINT8; // maximum chance of accidental explosion
  ubAnimationID: UINT8; // Animation enum to use
}

// GLOBALS

}
