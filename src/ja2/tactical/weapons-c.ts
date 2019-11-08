namespace ja2 {

const MINCHANCETOHIT = 1;
const MAXCHANCETOHIT = 99;

// NB this is arbitrary, chances in DG ranged from 1 in 6 to 1 in 20
const BASIC_DEPRECIATE_CHANCE = 15;

const NORMAL_RANGE = 90; // # world units considered an 'avg' shot
const MIN_SCOPE_RANGE = 60; // # world units after which scope's useful

const MIN_TANK_RANGE = 120; // range at which tank starts really having trouble aiming

// percent reduction in sight range per point of aiming
const SNIPERSCOPE_AIM_BONUS = 20;
// bonus to hit with working laser scope
const LASERSCOPE_BONUS = 20;

const MANDATORY_WEAPON_DELAY = 1200;
const NO_WEAPON_SOUND = 0;

const HEAD_DAMAGE_ADJUSTMENT = (x) => ((x * 3) / 2);
const LEGS_DAMAGE_ADJUSTMENT = (x) => (x / 2);

const CRITICAL_HIT_THRESHOLD = 30;

const HTH_MODE_PUNCH = 1;
const HTH_MODE_STAB = 2;
const HTH_MODE_STEAL = 3;

// JA2 GOLD: for weapons and attachments, give penalties only for status values below 85
const WEAPON_STATUS_MOD = (x) => ((x) >= 85 ? 100 : (((x) * 100) / 85));

export let gfNextShotKills: boolean = false;
export let gfReportHitChances: boolean = false;

// GLOBALS

// TODO: Move strings to extern file

const PISTOL = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubBurstPenalty: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.HANDGUNCLASS, Enum283.GUN_PISTOL, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, ubBurstPenalty, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_PISTOL, Enum330.S_LNL_PISTOL);
const M_PISTOL = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubBurstPenalty: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.HANDGUNCLASS, Enum283.GUN_M_PISTOL, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, ubBurstPenalty, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_PISTOL, Enum330.S_LNL_PISTOL);
const SMG = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubBurstPenalty: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.SMGCLASS, Enum283.GUN_SMG, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, ubBurstPenalty, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_SMG, Enum330.S_LNL_SMG);
const SN_RIFLE = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.RIFLECLASS, Enum283.GUN_SN_RIFLE, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, 0, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_RIFLE, Enum330.S_LNL_RIFLE);
const RIFLE = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.RIFLECLASS, Enum283.GUN_RIFLE, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, 0, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_RIFLE, Enum330.S_LNL_RIFLE);
const ASRIFLE = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubBurstPenalty: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.RIFLECLASS, Enum283.GUN_AS_RIFLE, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, ubBurstPenalty, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_RIFLE, Enum330.S_LNL_RIFLE);
const SHOTGUN = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubBurstPenalty: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.SHOTGUNCLASS, Enum283.GUN_SHOTGUN, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, ubBurstPenalty, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_SHOTGUN, Enum330.S_LNL_SHOTGUN);
const LMG = (ubCalibre: UINT8, ubBulletSpeed: UINT8, ubImpact: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubShotsPerBurst: UINT8, ubBurstPenalty: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16, sBurstSound: UINT16) =>
  createWeaponTypeFrom(Enum282.MGCLASS, Enum283.GUN_LMG, ubCalibre, ubReadyTime, ubShotsPer4Turns, ubShotsPerBurst, ubBurstPenalty, ubBulletSpeed, ubImpact, ubDeadliness, bAccuracy, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, sBurstSound, Enum330.S_RELOAD_LMG, Enum330.S_LNL_LMG);
const BLADE = (ubImpact: UINT8, ubShotsPer4Turns: UINT8, ubDeadliness: UINT8, usRange: UINT16, ubAttackVolume: UINT8, sSound: UINT16) =>
  createWeaponTypeFrom(Enum282.KNIFECLASS, Enum283.NOT_GUN, 0, AP_READY_KNIFE, ubShotsPer4Turns, 0, 0, 0, ubImpact, ubDeadliness, 0, 0, usRange, 200, ubAttackVolume, 0, sSound, NO_WEAPON_SOUND, NO_WEAPON_SOUND, NO_WEAPON_SOUND);
const THROWINGBLADE = (ubImpact: UINT8, ubShotsPer4Turns: UINT8, ubDeadliness: UINT8, usRange: UINT16, ubAttackVolume: UINT8, sSound: UINT16) =>
  createWeaponTypeFrom(Enum282.KNIFECLASS, Enum283.NOT_GUN, 0, AP_READY_KNIFE, ubShotsPer4Turns, 0, 0, 0, ubImpact, ubDeadliness, 0, 0, usRange, 200, ubAttackVolume, 0, sSound, NO_WEAPON_SOUND, NO_WEAPON_SOUND, NO_WEAPON_SOUND);
const PUNCHWEAPON = (ubImpact: UINT8, ubShotsPer4Turns: UINT8, ubDeadliness: UINT8, ubAttackVolume: UINT8, sSound: UINT16) =>
  createWeaponTypeFrom(Enum282.KNIFECLASS, Enum283.NOT_GUN, 0, 0, ubShotsPer4Turns, 0, 0, 0, ubImpact, ubDeadliness, 0, 0, 10, 200, ubAttackVolume, 0, sSound, NO_WEAPON_SOUND, NO_WEAPON_SOUND, NO_WEAPON_SOUND);
const LAUNCHER = (ubBulletSpeed: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16) =>
  createWeaponTypeFrom(Enum282.RIFLECLASS, Enum283.NOT_GUN, Enum285.NOAMMO, ubReadyTime, ubShotsPer4Turns, 0, 0, ubBulletSpeed, 1, ubDeadliness, bAccuracy, 0, usRange, 200, ubAttackVolume, ubHitVolume, sSound, NO_WEAPON_SOUND, NO_WEAPON_SOUND, NO_WEAPON_SOUND);
const LAW = (ubBulletSpeed: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16) =>
  createWeaponTypeFrom(Enum282.RIFLECLASS, Enum283.NOT_GUN, Enum285.NOAMMO, ubReadyTime, ubShotsPer4Turns, 0, 0, ubBulletSpeed, 80, ubDeadliness, bAccuracy, 1, usRange, 200, ubAttackVolume, ubHitVolume, sSound, NO_WEAPON_SOUND, NO_WEAPON_SOUND, NO_WEAPON_SOUND);
const CANNON = (ubBulletSpeed: UINT8, ubReadyTime: UINT8, ubShotsPer4Turns: UINT8, ubDeadliness: UINT8, bAccuracy: INT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16) =>
  createWeaponTypeFrom(Enum282.RIFLECLASS, Enum283.NOT_GUN, Enum285.NOAMMO, ubReadyTime, ubShotsPer4Turns, 0, 0, ubBulletSpeed, 80, ubDeadliness, bAccuracy, 1, usRange, 200, ubAttackVolume, ubHitVolume, sSound, NO_WEAPON_SOUND, NO_WEAPON_SOUND, NO_WEAPON_SOUND);
const MONSTSPIT = (ubImpact: UINT8, ubShotsPer4Turns: UINT8, ubDeadliness: UINT8, ubMagSize: UINT8, usRange: UINT16, ubAttackVolume: UINT8, ubHitVolume: UINT8, sSound: UINT16) =>
  createWeaponTypeFrom(Enum282.MONSTERCLASS, Enum283.NOT_GUN, Enum285.AMMOMONST, AP_READY_KNIFE, ubShotsPer4Turns, 0, 0, 250, ubImpact, ubDeadliness, 0, ubMagSize, usRange, 200, ubAttackVolume, ubHitVolume, sSound, NO_WEAPON_SOUND, NO_WEAPON_SOUND, NO_WEAPON_SOUND);

// ranges are in world units, calculated by:
// 100 + real-range-in-metres/10
// then I scaled them down... I forget how much by!

// Accuracy is based on probability of shot being within 10cm of bullseye target on chest at 25m
// from Compendium of Modern Firearms (Edge of the Sword Vol 1)

// JA2 GOLD: reduced pistol ready time to 0, tweaked sniper rifle values and G11 range
export let Weapon: WEAPONTYPE[] /* [MAX_WEAPONS] */ = [
  //          Description			  Ammo      Bullet	Ready	 4xSng Burst	Burst	Deadl	Accu	Clip	Range Attack Impact		Fire
  //										   Spd  Imp	Time	 ROF	 ROF		penal	iness	racy	Size					Vol   Vol			Sounds
  createWeaponTypeFrom(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0), // nada!  must have min range of 10
  PISTOL(/* Glock 17			*/ Enum285.AMMO9, 24, 21, 0, 14, 0, 0, 8, 0, 15, 120, 60, 5, Enum330.S_GLOCK17, NO_WEAPON_SOUND), // wt 6  // Austria
  M_PISTOL(/* Glock 18		*/ Enum285.AMMO9, 24, 21, 0, 14, 5, 15, 9, 0, 15, 120, 60, 5, Enum330.S_GLOCK18, Enum330.S_BURSTTYPE1), // wt 6  // Austria
  PISTOL(/* Beretta 92F     */ Enum285.AMMO9, 23, 22, 0, 16, 0, 0, 9, 0, 15, 120, 60, 5, Enum330.S_BERETTA92, NO_WEAPON_SOUND), // wt 11 // Italy
  M_PISTOL(/* Beretta 93R   */ Enum285.AMMO9, 23, 22, 0, 13, 5, 15, 9, 0, 15, 120, 60, 5, Enum330.S_BERETTA93, Enum330.S_BURSTTYPE1), // wt 11 // Italy
  PISTOL(/* .38 S&W Special */ Enum285.AMMO38, 23, 22, 0, 11, 0, 0, 6, 0, 6, 130, 63, 5, Enum330.S_SWSPECIAL, NO_WEAPON_SOUND), // wt 11 // Britain
  PISTOL(/* .357 Barracuda  */ Enum285.AMMO357, 23, 24, 0, 11, 0, 0, 7, 0, 6, 135, 66, 6, Enum330.S_BARRACUDA, NO_WEAPON_SOUND), // wt 10 // Belgium
  PISTOL(/* .357 DesertEagle*/ Enum285.AMMO357, 24, 24, 0, 11, 0, 0, 7, 0, 9, 135, 66, 6, Enum330.S_DESERTEAGLE, NO_WEAPON_SOUND), // wt 17 // US
  PISTOL(/* .45 M1911       */ Enum285.AMMO45, 24, 23, 0, 13, 0, 0, 9, 0, 7, 125, 69, 6, Enum330.S_M1911, NO_WEAPON_SOUND), // wt 12 // US

  SMG(/* H&K MP5K      	 */ Enum285.AMMO9, 23, 23, 1, 15, 5, 8, 17, 0, 30, 200, 75, 7, Enum330.S_MP5K, Enum330.S_BURSTTYPE1), // wt 21 // Germany; ROF 900 ?
  SMG(/* .45 MAC-10	     */ Enum285.AMMO45, 23, 27, 2, 13, 5, 8, 20, 0, 30, 200, 75, 7, Enum330.S_MAC10, Enum330.S_BURSTTYPE1), // wt 28 // US; ROF 1090
  SMG(/* Thompson M1A1   */ Enum285.AMMO45, 23, 24, 2, 10, 4, 8, 14, 0, 30, 200, 75, 7, Enum330.S_THOMPSON, Enum330.S_BURSTTYPE1), // wt 48 // US; ROF 700
  SMG(/* Colt Commando   */ Enum285.AMMO556, 20, 29, 2, 15, 4, 8, 23, 0, 30, 200, 75, 7, Enum330.S_COMMANDO, Enum330.S_BURSTTYPE1), // wt 26 // US; ROF
  SMG(/* H&K MP53		 		 */ Enum285.AMMO556, 22, 25, 2, 12, 3, 8, 15, 0, 30, 200, 75, 7, Enum330.S_MP53, Enum330.S_BURSTTYPE1), // wt 31 // Germany // eff range assumed; ROF 700 ?
  SMG(/* AKSU-74         */ Enum285.AMMO545, 21, 26, 2, 17, 4, 8, 21, 0, 30, 200, 75, 7, Enum330.S_AKSU74, Enum330.S_BURSTTYPE1), // wt 39 // USSR; ROF 800
  SMG(/* 5.7mm FN P90    */ Enum285.AMMO57, 21, 30, 2, 15, 5, 8, 42, 0, 50, 225, 75, 7, Enum330.S_P90, Enum330.S_BURSTTYPE1), // wt 28 // Belgium; ROF 800-1000
  SMG(/* Type-85         */ Enum285.AMMO762W, 23, 23, 1, 10, 4, 11, 12, 0, 30, 200, 75, 7, Enum330.S_TYPE85, Enum330.S_BURSTTYPE1), // wt 19 // China; ROF 780

  RIFLE(/* SKS             */ Enum285.AMMO762W, 22, 31, 2, 13, 0, 24, 0, 10, 300, 80, 8, Enum330.S_SKS, Enum330.S_BURSTTYPE1), // wt 39 // USSR
  SN_RIFLE(/* Dragunov      */ Enum285.AMMO762W, 21, 36, 5, 11, 0, 32, 0, 10, 750, 80, 8, Enum330.S_DRAGUNOV, Enum330.S_BURSTTYPE1), // wt 43 // USSR
  SN_RIFLE(/* M24           */ Enum285.AMMO762N, 21, 36, 5, 8, 0, 32, 0, 5, 800, 80, 8, Enum330.S_M24, Enum330.S_BURSTTYPE1), // wt 66 // US

  ASRIFLE(/* Steyr AUG       */ Enum285.AMMO556, 20, 30, 2, 13, 3, 8, 38, 0, 30, 500, 77, 8, Enum330.S_AUG, Enum330.S_BURSTTYPE1), // wt 36 // Austria; ROF 650
  ASRIFLE(/* H&K G41         */ Enum285.AMMO556, 20, 29, 2, 13, 4, 8, 27, 0, 30, 300, 77, 8, Enum330.S_G41, Enum330.S_BURSTTYPE1), // wt 41 // Germany; ROF 850
  RIFLE(/* Ruger Mini-14	 */ Enum285.AMMO556, 20, 30, 2, 13, 0, 20, 0, 30, 250, 77, 8, Enum330.S_RUGERMINI, Enum330.S_BURSTTYPE1), // wt 29 // US; ROF 750
  ASRIFLE(/* C-7             */ Enum285.AMMO556, 20, 30, 2, 15, 5, 8, 41, 0, 30, 400, 77, 8, Enum330.S_C7, Enum330.S_BURSTTYPE1), // wt 36 // Canada; ROF 600-940
  ASRIFLE(/* FA-MAS          */ Enum285.AMMO556, 20, 30, 2, 17, 5, 8, 32, 0, 30, 250, 77, 8, Enum330.S_FAMAS, Enum330.S_BURSTTYPE1), // wt 36 // France; ROF 900-1000
  ASRIFLE(/* AK-74           */ Enum285.AMMO545, 20, 28, 2, 17, 3, 8, 30, 0, 30, 350, 77, 8, Enum330.S_AK74, Enum330.S_BURSTTYPE1), // wt 36 // USSR; ROF 650
  ASRIFLE(/* AKM             */ Enum285.AMMO762W, 22, 29, 2, 17, 3, 11, 25, 0, 30, 250, 77, 8, Enum330.S_AKM, Enum330.S_BURSTTYPE1), // wt 43 // USSR; ROF 600
  ASRIFLE(/* M-14            */ Enum285.AMMO762N, 20, 33, 2, 13, 4, 11, 33, 0, 20, 330, 80, 8, Enum330.S_M14, Enum330.S_BURSTTYPE1), // wt 29 // US; ROF 750
  ASRIFLE(/* FN-FAL          */ Enum285.AMMO762N, 20, 32, 2, 17, 3, 11, 41, 0, 20, 425, 80, 8, Enum330.S_FNFAL, Enum330.S_BURSTTYPE1), // wt 43 // Belgium; ROF
  ASRIFLE(/* H&K G3A3        */ Enum285.AMMO762N, 21, 31, 2, 13, 3, 11, 26, 0, 20, 300, 80, 8, Enum330.S_G3A3, Enum330.S_BURSTTYPE1), // wt 44 // Germany; ROF 500-600
  ASRIFLE(/* H&K G11         */ Enum285.AMMO47, 20, 27, 2, 13, 3, 0, 40, 0, 50, 300, 80, 8, Enum330.S_G11, Enum330.S_BURSTTYPE1), // wt 38 // Germany; ROF 600

  SHOTGUN(/* Remington M870  */ Enum285.AMMO12G, 24, 32, 2, 7, 0, 0, 14, 0, 7, 135, 80, 8, Enum330.S_M870, Enum330.S_BURSTTYPE1), // wt 36 // US; damage for solid slug
  SHOTGUN(/* SPAS-15				 */ Enum285.AMMO12G, 24, 32, 2, 10, 0, 0, 18, 0, 7, 135, 80, 8, Enum330.S_SPAS, Enum330.S_BURSTTYPE1), // wt 38 // Italy; semi-auto; damage for solid slug
  SHOTGUN(/* CAWS            */ Enum285.AMMOCAWS, 24, 40, 2, 10, 3, 11, 44, 0, 10, 135, 80, 8, Enum330.S_CAWS, Enum330.S_BURSTTYPE1), // wt 41 // US; fires 8 flechettes at once in very close fixed pattern

  LMG(/* FN Minimi       */ Enum285.AMMO556, 20, 28, 3, 13, 6, 5, 48, 0, 30, 500, 82, 8, Enum330.S_FNMINI, Enum330.S_BURSTTYPE1), // wt 68 // Belgium; ROF 750-1000
  LMG(/* RPK-74          */ Enum285.AMMO545, 21, 30, 2, 13, 5, 5, 49, 0, 30, 500, 82, 8, Enum330.S_RPK74, Enum330.S_BURSTTYPE1), // wt 48 // USSR; ROF 800?
  LMG(/* H&K 21E         */ Enum285.AMMO762N, 21, 32, 3, 13, 5, 7, 52, 0, 20, 500, 82, 8, Enum330.S_21E, Enum330.S_BURSTTYPE1), // wt 93 // Germany; ROF 800

  // NB blade distances will be = strength + dexterity /2

  BLADE(/* Combat knife    */ 18, 12, 5, 40, 2, NO_WEAPON_SOUND),
  THROWINGBLADE(/* Throwing knife  */ 15, 12, 4, 150, 2, Enum330.S_THROWKNIFE),
  createWeaponTypeFrom(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0), // rock
  LAUNCHER(/* grenade launcher*/ 30, 3, 5, 80, 0, 500, 20, 10, Enum330.S_GLAUNCHER),
  LAUNCHER(/* mortar */ 30, 0, 5, 100, 0, 550, 20, 10, Enum330.S_MORTAR_SHOT),
  createWeaponTypeFrom(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0), // another rock
  BLADE(/* yng male claws */ 14, 10, 1, 10, 2, NO_WEAPON_SOUND),
  BLADE(/* yng fem claws */ 18, 10, 1, 10, 2, NO_WEAPON_SOUND),
  BLADE(/* old male claws */ 20, 10, 1, 10, 2, NO_WEAPON_SOUND),
  BLADE(/* old fem claws */ 24, 10, 1, 10, 2, NO_WEAPON_SOUND),
  BLADE(/* queen's tentacles */ 20, 10, 1, 70, 2, NO_WEAPON_SOUND),
  MONSTSPIT(/* queen's spit */ 20, 10, 1, 50, 300, 10, 5, Enum330.ACR_SPIT),
  PUNCHWEAPON(/* brass knuckles */ 12, 15, 1, 0, 0),
  LAUNCHER(/* underslung GL */ 30, 3, 7, 80, 0, 450, 20, 10, Enum330.S_UNDER_GLAUNCHER),
  LAW(/* rocket laucher */ 30, 0, 5, 80, 0, 500, 80, 10, Enum330.S_ROCKET_LAUNCHER),
  BLADE(/* bloodcat claws */ 12, 14, 1, 10, 2, NO_WEAPON_SOUND),
  BLADE(/* bloodcat bite */ 24, 10, 1, 10, 2, NO_WEAPON_SOUND),
  BLADE(/* machete */ 24, 9, 6, 40, 2, NO_WEAPON_SOUND),
  RIFLE(/* rocket rifle */ Enum285.AMMOROCKET, 20, 38, 2, 10, 0, 62, 0, 5, 600, 80, 10, Enum330.S_SMALL_ROCKET_LAUNCHER, NO_WEAPON_SOUND),
  PISTOL(/* automag III     */ Enum285.AMMO762N, 24, 29, 1, 9, 0, 0, 13, 0, 5, 220, 72, 6, Enum330.S_AUTOMAG, NO_WEAPON_SOUND),
  MONSTSPIT(/* infant spit */ 12, 13, 1, 5, 200, 10, 5, Enum330.ACR_SPIT),
  MONSTSPIT(/* yng male spit */ 16, 10, 1, 10, 200, 10, 5, Enum330.ACR_SPIT),
  MONSTSPIT(/* old male spit */ 20, 10, 1, 20, 200, 10, 5, Enum330.ACR_SPIT),
  CANNON(/* tank cannon*/ 30, 0, 8, 80, 0, 800, 90, 10, Enum330.S_TANK_CANNON),
  PISTOL(/* DART GUN		    */ Enum285.AMMODART, 25, 2, 1, 13, 0, 0, 10, 0, 1, 200, 0, 0, NO_WEAPON_SOUND, NO_WEAPON_SOUND),
  THROWINGBLADE(/* Bloody Thrw KN */ 15, 12, 3, 150, 2, Enum330.S_THROWKNIFE),

  SHOTGUN(/* Flamethrower */ Enum285.AMMOFLAME, 24, 60, 2, 10, 0, 0, 53, 0, 5, 130, 40, 8, Enum330.S_CAWS, Enum330.S_BURSTTYPE1),
  PUNCHWEAPON(/* crowbar */ 25, 10, 4, 0, 0),
  ASRIFLE(/* auto rckt rifle */ Enum285.AMMOROCKET, 20, 38, 2, 12, 5, 10, 97, 0, 5, 600, 80, 10, Enum330.S_SMALL_ROCKET_LAUNCHER, Enum330.S_BURSTTYPE1),
];

export let Magazine: MAGTYPE[] /* [] */ = [
  // calibre,			 mag size,			ammo type
  createMagTypeFrom(Enum285.AMMO9, 15, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMO9, 30, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMO9, 15, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO9, 30, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO9, 15, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO9, 30, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO38, 6, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMO38, 6, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO38, 6, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO45, 7, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMO45, 30, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMO45, 7, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO45, 30, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO45, 7, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO45, 30, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO357, 6, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMO357, 9, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMO357, 6, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO357, 9, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO357, 6, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO357, 9, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO545, 30, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO545, 30, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO556, 30, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO556, 30, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO762W, 10, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO762W, 30, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO762W, 10, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO762W, 30, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO762N, 5, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO762N, 20, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO762N, 5, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO762N, 20, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO47, 50, Enum286.AMMO_SUPER_AP),
  createMagTypeFrom(Enum285.AMMO57, 50, Enum286.AMMO_AP),
  createMagTypeFrom(Enum285.AMMO57, 50, Enum286.AMMO_HP),
  createMagTypeFrom(Enum285.AMMO12G, 7, Enum286.AMMO_BUCKSHOT),
  createMagTypeFrom(Enum285.AMMO12G, 7, Enum286.AMMO_REGULAR),
  createMagTypeFrom(Enum285.AMMOCAWS, 10, Enum286.AMMO_BUCKSHOT),
  createMagTypeFrom(Enum285.AMMOCAWS, 10, Enum286.AMMO_SUPER_AP),
  createMagTypeFrom(Enum285.AMMOROCKET, 5, Enum286.AMMO_SUPER_AP),
  createMagTypeFrom(Enum285.AMMOROCKET, 5, Enum286.AMMO_HE),
  createMagTypeFrom(Enum285.AMMOROCKET, 5, Enum286.AMMO_HEAT),
  createMagTypeFrom(Enum285.AMMODART, 1, Enum286.AMMO_SLEEP_DART),
  createMagTypeFrom(Enum285.AMMOFLAME, 5, Enum286.AMMO_BUCKSHOT),
  createMagTypeFrom(Enum285.NOAMMO, 0, 0),
];

export let Armour: ARMOURTYPE[] /* [] */ = [
  //	Class					      Protection	Degradation%			Description
  //  -------------       ----------  ------------      ----------------
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 10, 25), /* Flak jacket     */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 13, 20), /* Flak jacket w X */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 16, 15), /* Flak jacket w Y */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 15, 20), /* Kevlar jacket   */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 19, 15), /* Kevlar jack w X */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 24, 10), /* Kevlar jack w Y */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 30, 15), /* Spectra jacket  */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 36, 10), /* Spectra jack w X*/
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 42, 5), /* Spectra jack w Y*/
  createArmourTypeFrom(Enum284.ARMOURCLASS_LEGGINGS, 15, 20), /* Kevlar leggings */
  createArmourTypeFrom(Enum284.ARMOURCLASS_LEGGINGS, 19, 15), /* Kevlar legs w X */

  createArmourTypeFrom(Enum284.ARMOURCLASS_LEGGINGS, 24, 10), /* Kevlar legs w Y */
  createArmourTypeFrom(Enum284.ARMOURCLASS_LEGGINGS, 30, 15), /* Spectra leggings*/
  createArmourTypeFrom(Enum284.ARMOURCLASS_LEGGINGS, 36, 10), /* Spectra legs w X*/
  createArmourTypeFrom(Enum284.ARMOURCLASS_LEGGINGS, 42, 5), /* Spectra legs w Y*/
  createArmourTypeFrom(Enum284.ARMOURCLASS_HELMET, 10, 5), /* Steel helmet    */
  createArmourTypeFrom(Enum284.ARMOURCLASS_HELMET, 15, 20), /* Kevlar helmet   */
  createArmourTypeFrom(Enum284.ARMOURCLASS_HELMET, 19, 15), /* Kevlar helm w X */
  createArmourTypeFrom(Enum284.ARMOURCLASS_HELMET, 24, 10), /* Kevlar helm w Y */
  createArmourTypeFrom(Enum284.ARMOURCLASS_HELMET, 30, 15), /* Spectra helmet  */
  createArmourTypeFrom(Enum284.ARMOURCLASS_HELMET, 36, 10), /* Spectra helm w X*/

  createArmourTypeFrom(Enum284.ARMOURCLASS_HELMET, 42, 5), /* Spectra helm w Y*/
  createArmourTypeFrom(Enum284.ARMOURCLASS_PLATE, 15, 200), /* Ceramic plates  */
  createArmourTypeFrom(Enum284.ARMOURCLASS_MONST, 3, 0), /* Infant creature hide */
  createArmourTypeFrom(Enum284.ARMOURCLASS_MONST, 5, 0), /* Young male creature hide  */
  createArmourTypeFrom(Enum284.ARMOURCLASS_MONST, 6, 0), /* Male creature hide  */
  createArmourTypeFrom(Enum284.ARMOURCLASS_MONST, 20, 0), /* Queen creature hide  */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 2, 25), /* Leather jacket    */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 12, 30), /* Leather jacket w kevlar */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 16, 25), /* Leather jacket w kevlar & compound 18 */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 19, 20), /* Leather jacket w kevlar & queen blood */

  createArmourTypeFrom(Enum284.ARMOURCLASS_MONST, 7, 0), /* Young female creature hide */
  createArmourTypeFrom(Enum284.ARMOURCLASS_MONST, 8, 0), /* Old female creature hide  */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 1, 25), /* T-shirt */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 22, 20), /* Kevlar 2 jacket   */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 27, 15), /* Kevlar 2 jack w X */
  createArmourTypeFrom(Enum284.ARMOURCLASS_VEST, 32, 10), /* Kevlar 2 jack w Y */
];

export let Explosive: EXPLOSIVETYPE[] /* [] */ = [
  //	Type							Yield		Yield2		Radius		Volume		Volatility	Animation			Description
  //										-----		-------		------		------		----------	--------- 		------------------
  createExplosiveTypeFrom(Enum287.EXPLOSV_STUN, 1, 70, 4, 0, 0, Enum304.STUN_BLAST), /* stun grenade       */
  createExplosiveTypeFrom(Enum287.EXPLOSV_TEARGAS, 0, 20, 4, 0, 0, Enum304.TARGAS_EXP), /* tear gas grenade   */
  createExplosiveTypeFrom(Enum287.EXPLOSV_MUSTGAS, 15, 40, 4, 0, 0, Enum304.MUSTARD_EXP), /* mustard gas grenade*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 15, 7, 3, 15, 1, Enum304.BLAST_1), /* mini hand grenade  */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 25, 10, 4, 25, 1, Enum304.BLAST_1), /* reg hand grenade   */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 40, 12, 5, 20, 10, Enum304.BLAST_2), /* RDX                */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 50, 15, 5, 50, 2, Enum304.BLAST_2), /* TNT (="explosives")*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 60, 15, 6, 60, 2, Enum304.BLAST_2), /* HMX (=RDX+TNT)     */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 55, 15, 6, 55, 0, Enum304.BLAST_2), /* C1  (=RDX+min oil) */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 50, 22, 6, 50, 2, Enum304.BLAST_2), /* mortar shell       */

  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 30, 30, 2, 30, 2, Enum304.BLAST_1), /* mine               */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 65, 30, 7, 65, 0, Enum304.BLAST_1), /* C4  ("plastique")  */
  createExplosiveTypeFrom(Enum287.EXPLOSV_FLARE, 0, 0, 10, 0, 0, Enum304.BLAST_1), /* trip flare				  */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NOISE, 0, 0, 50, 50, 0, Enum304.BLAST_1), /* trip klaxon        */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 20, 0, 1, 20, 0, Enum304.BLAST_1), /* shaped charge      */
  createExplosiveTypeFrom(Enum287.EXPLOSV_FLARE, 0, 0, 10, 0, 0, Enum304.BLAST_1),  /* break light        */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 25, 5, 4, 25, 1, Enum304.BLAST_1),  /* GL grenade					*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_TEARGAS, 0, 20, 3, 0, 0, Enum304.TARGAS_EXP),  /* GL tear gas grenade*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_STUN, 1, 50, 4, 0, 0, Enum304.STUN_BLAST),  /* GL stun grenade		*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_SMOKE, 0, 0, 3, 0, 0, Enum304.SMOKE_EXP),  /* GL smoke grenade		*/

  createExplosiveTypeFrom(Enum287.EXPLOSV_SMOKE, 0, 0, 4, 0, 0, Enum304.SMOKE_EXP),  /* smoke grenade			*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 60, 20, 6, 60, 2, Enum304.BLAST_2),  /* Tank Shell         */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 100, 0, 0, 0, 0, Enum304.BLAST_1),  /* Fake structure igniter*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 100, 0, 1, 0, 0, Enum304.BLAST_1),  /* creature cocktail */
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 50, 10, 5, 50, 2, Enum304.BLAST_2),  /* fake struct explosion*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_NORMAL, 50, 10, 5, 50, 2, Enum304.BLAST_3),  /* fake vehicle explosion*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_TEARGAS, 0, 40, 4, 0, 0, Enum304.TARGAS_EXP), /* big tear gas */
  createExplosiveTypeFrom(Enum287.EXPLOSV_CREATUREGAS, 5, 0, 1, 0, 0, Enum304.NO_BLAST), /* small creature gas*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_CREATUREGAS, 8, 0, 3, 0, 0, Enum304.NO_BLAST), /* big creature gas*/
  createExplosiveTypeFrom(Enum287.EXPLOSV_CREATUREGAS, 0, 0, 0, 0, 0, Enum304.NO_BLAST), /* vry sm creature gas*/
];

let gzBurstSndStrings: string[] /* INT8[][30] */ = [
  "", // NOAMMO
  "", // 38
  "9mm Burst ", // 9mm
  "45 Caliber Burst ", // 45
  "", // 357
  "", // 12G
  "Shotgun Burst ", // CAWS
  "5,45 Burst ", // 5.45
  "5,56 Burst ", // 5.56
  "7,62 NATO Burst ", // 7,62 N
  "7,62 WP Burst ", // 7,62 W
  "4,7 Caliber Burst ", // 4.7
  "5,7 Burst ", // 5,7
  "", // Monster
  "RL Automatic ", // Rocket
  "", // Dart
  "", // Flame (unused)
];

// the amount of momentum reduction for the head, torso, and legs
// used to determine whether the bullet will go through someone
let BodyImpactReduction: UINT8[] /* [4] */ = [
  0,
  15,
  30,
  23,
];

export function GunRange(pObj: Pointer<OBJECTTYPE>): UINT16 {
  let bAttachPos: INT8;

  if (Item[pObj.value.usItem].usItemClass & IC_WEAPON) {
    bAttachPos = FindAttachment(pObj, Enum225.GUN_BARREL_EXTENDER);

    if (bAttachPos == ITEM_NOT_FOUND) {
      return Weapon[pObj.value.usItem].usRange;
    } else {
      return Weapon[pObj.value.usItem].usRange + (GUN_BARREL_RANGE_BONUS * WEAPON_STATUS_MOD(pObj.value.bAttachStatus[bAttachPos]) / 100);
    }
  } else {
    // return a minimal value of 1 tile
    return CELL_X_SIZE;
  }
}

export function EffectiveArmour(pObj: Pointer<OBJECTTYPE>): INT8 {
  let iValue: INT32;
  let bPlate: INT8;

  if (pObj == null || Item[pObj.value.usItem].usItemClass != IC_ARMOUR) {
    return 0;
  }
  iValue = Armour[Item[pObj.value.usItem].ubClassIndex].ubProtection;
  iValue = iValue * pObj.value.bStatus[0] / 100;

  bPlate = FindAttachment(pObj, Enum225.CERAMIC_PLATES);
  if (bPlate != ITEM_NOT_FOUND) {
    let iValue2: INT32;

    iValue2 = Armour[Item[Enum225.CERAMIC_PLATES].ubClassIndex].ubProtection;
    iValue2 = iValue2 * pObj.value.bAttachStatus[bPlate] / 100;

    iValue += iValue2;
  }
  return iValue;
}

export function ArmourPercent(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iVest: INT32;
  let iHelmet: INT32;
  let iLeg: INT32;

  if (pSoldier.value.inv[Enum261.VESTPOS].usItem) {
    iVest = EffectiveArmour(addressof(pSoldier.value.inv[Enum261.VESTPOS]));
    // convert to % of best; ignoring bug-treated stuff
    iVest = 65 * iVest / (Armour[Item[Enum225.SPECTRA_VEST_18].ubClassIndex].ubProtection + Armour[Item[Enum225.CERAMIC_PLATES].ubClassIndex].ubProtection);
  } else {
    iVest = 0;
  }

  if (pSoldier.value.inv[Enum261.HELMETPOS].usItem) {
    iHelmet = EffectiveArmour(addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
    // convert to % of best; ignoring bug-treated stuff
    iHelmet = 15 * iHelmet / Armour[Item[Enum225.SPECTRA_HELMET_18].ubClassIndex].ubProtection;
  } else {
    iHelmet = 0;
  }

  if (pSoldier.value.inv[Enum261.LEGPOS].usItem) {
    iLeg = EffectiveArmour(addressof(pSoldier.value.inv[Enum261.LEGPOS]));
    // convert to % of best; ignoring bug-treated stuff
    iLeg = 25 * iLeg / Armour[Item[Enum225.SPECTRA_LEGGINGS_18].ubClassIndex].ubProtection;
  } else {
    iLeg = 0;
  }
  return (iHelmet + iVest + iLeg);
}

function ExplosiveEffectiveArmour(pObj: Pointer<OBJECTTYPE>): INT8 {
  let iValue: INT32;
  let bPlate: INT8;

  if (pObj == null || Item[pObj.value.usItem].usItemClass != IC_ARMOUR) {
    return 0;
  }
  iValue = Armour[Item[pObj.value.usItem].ubClassIndex].ubProtection;
  iValue = iValue * pObj.value.bStatus[0] / 100;
  if (pObj.value.usItem == Enum225.FLAK_JACKET || pObj.value.usItem == Enum225.FLAK_JACKET_18 || pObj.value.usItem == Enum225.FLAK_JACKET_Y) {
    // increase value for flak jackets!
    iValue *= 3;
  }

  bPlate = FindAttachment(pObj, Enum225.CERAMIC_PLATES);
  if (bPlate != ITEM_NOT_FOUND) {
    let iValue2: INT32;

    iValue2 = Armour[Item[Enum225.CERAMIC_PLATES].ubClassIndex].ubProtection;
    iValue2 = iValue2 * pObj.value.bAttachStatus[bPlate] / 100;

    iValue += iValue2;
  }
  return iValue;
}

export function ArmourVersusExplosivesPercent(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  // returns the % damage reduction from grenades
  let iVest: INT32;
  let iHelmet: INT32;
  let iLeg: INT32;

  if (pSoldier.value.inv[Enum261.VESTPOS].usItem) {
    iVest = ExplosiveEffectiveArmour(addressof(pSoldier.value.inv[Enum261.VESTPOS]));
    // convert to % of best; ignoring bug-treated stuff
    iVest = Math.min(65, 65 * iVest / (Armour[Item[Enum225.SPECTRA_VEST_18].ubClassIndex].ubProtection + Armour[Item[Enum225.CERAMIC_PLATES].ubClassIndex].ubProtection));
  } else {
    iVest = 0;
  }

  if (pSoldier.value.inv[Enum261.HELMETPOS].usItem) {
    iHelmet = ExplosiveEffectiveArmour(addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
    // convert to % of best; ignoring bug-treated stuff
    iHelmet = Math.min(15, 15 * iHelmet / Armour[Item[Enum225.SPECTRA_HELMET_18].ubClassIndex].ubProtection);
  } else {
    iHelmet = 0;
  }

  if (pSoldier.value.inv[Enum261.LEGPOS].usItem) {
    iLeg = ExplosiveEffectiveArmour(addressof(pSoldier.value.inv[Enum261.LEGPOS]));
    // convert to % of best; ignoring bug-treated stuff
    iLeg = Math.min(25, 25 * iLeg / Armour[Item[Enum225.SPECTRA_LEGGINGS_18].ubClassIndex].ubProtection);
  } else {
    iLeg = 0;
  }
  return (iHelmet + iVest + iLeg);
}

function AdjustImpactByHitLocation(iImpact: INT32, ubHitLocation: UINT8, piNewImpact: Pointer<INT32>, piImpactForCrits: Pointer<INT32>): void {
  switch (ubHitLocation) {
    case AIM_SHOT_HEAD:
      // 1.5x damage from successful hits to the head!
      piImpactForCrits.value = HEAD_DAMAGE_ADJUSTMENT(iImpact);
      piNewImpact.value = piImpactForCrits.value;
      break;
    case AIM_SHOT_LEGS:
      // half damage for determining critical hits
      // quarter actual damage
      piImpactForCrits.value = LEGS_DAMAGE_ADJUSTMENT(iImpact);
      piNewImpact.value = LEGS_DAMAGE_ADJUSTMENT(piImpactForCrits.value);
      break;
    default:
      piImpactForCrits.value = iImpact;
      piNewImpact.value = iImpact;
      break;
  }
}

// #define	TESTGUNJAM

export function CheckForGunJam(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  let pObj: Pointer<OBJECTTYPE>;
  let iChance: INT32;
  let iResult: INT32;

  // should jams apply to enemies?
  if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
    if (Item[pSoldier.value.usAttackingWeapon].usItemClass == IC_GUN && !EXPLOSIVE_GUN(pSoldier.value.usAttackingWeapon)) {
      pObj = addressof(pSoldier.value.inv[pSoldier.value.ubAttackingHand]);
      if (pObj.value.bGunAmmoStatus > 0) {
        // gun might jam, figure out the chance
        iChance = (80 - pObj.value.bGunStatus);

        // CJC: removed reliability from formula...

        // jams can happen to unreliable guns "earlier" than normal or reliable ones.
        // iChance = iChance - Item[pObj->usItem].bReliability * 2;

        // decrease the chance of a jam by 20% per point of reliability;
        // increased by 20% per negative point...
        // iChance = iChance * (10 - Item[pObj->usItem].bReliability * 2) / 10;

        if (pSoldier.value.bDoBurst > 1) {
          // if at bullet in a burst after the first, higher chance
          iChance -= PreRandom(80);
        } else {
          iChance -= PreRandom(100);
        }

        if (PreRandom(100) < iChance || gfNextFireJam)
        {
          gfNextFireJam = false;

          // jam! negate the gun ammo status.
          pObj.value.bGunAmmoStatus *= -1;

          // Deduct AMMO!
          DeductAmmo(pSoldier, pSoldier.value.ubAttackingHand);

          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_JAMMED_GUN);
          return true;
        }
      } else if (pObj.value.bGunAmmoStatus < 0) {
        // try to unjam gun
        iResult = SkillCheck(pSoldier, Enum255.UNJAM_GUN_CHECK, (Item[pObj.value.usItem].bReliability * 4));
        if (iResult > 0) {
          // yay! unjammed the gun
          pObj.value.bGunAmmoStatus *= -1;

          // MECHANICAL/DEXTERITY GAIN: Unjammed a gun
          StatChange(pSoldier, MECHANAMT, 5, false);
          StatChange(pSoldier, DEXTAMT, 5, false);

          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

          // We unjammed gun, return appropriate value!
          return 255;
        } else {
          return true;
        }
      }
    }
  }
  return false;
}

export function OKFireWeapon(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  let bGunJamVal: boolean;

  // 1) Are we attacking with our second hand?
  if (pSoldier.value.ubAttackingHand == Enum261.SECONDHANDPOS) {
    if (!EnoughAmmo(pSoldier, false, pSoldier.value.ubAttackingHand)) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_2ND_CLIP_DEPLETED]);
        return false;
      }
    }
  }

  bGunJamVal = CheckForGunJam(pSoldier);

  if (bGunJamVal == 255) {
    return 255;
  }

  if (bGunJamVal) {
    return false;
  }

  return true;
}

export function FireWeapon(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): boolean {
  // ignore passed in target gridno for now

  // If realtime and we are reloading - do not fire until counter is done!
  if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) && !pSoldier.value.bDoBurst) {
    if (pSoldier.value.fReloading) {
      return false;
    }
  }

  // if target gridno is the same as ours, do not fire!
  if (sTargetGridNo == pSoldier.value.sGridNo) {
    // FREE UP NPC!
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - attack on own gridno!"));
    FreeUpAttacker(pSoldier.value.ubID);
    return false;
  }

  // SET ATTACKER TO NOBODY, WILL GET SET EVENTUALLY
  pSoldier.value.ubOppNum = NOBODY;

  switch (Item[pSoldier.value.usAttackingWeapon].usItemClass) {
    case IC_THROWING_KNIFE:
    case IC_GUN:

      // ATE: PAtch up - bookkeeping for spreading done out of whak
      if (pSoldier.value.fDoSpread && !pSoldier.value.bDoBurst) {
        pSoldier.value.fDoSpread = false;
      }

      if (pSoldier.value.fDoSpread >= 6) {
        pSoldier.value.fDoSpread = false;
      }

      if (pSoldier.value.fDoSpread) {
        if (pSoldier.value.sSpreadLocations[pSoldier.value.fDoSpread - 1] != 0) {
          UseGun(pSoldier, pSoldier.value.sSpreadLocations[pSoldier.value.fDoSpread - 1]);
        } else {
          UseGun(pSoldier, sTargetGridNo);
        }
        pSoldier.value.fDoSpread++;
      } else {
        UseGun(pSoldier, sTargetGridNo);
      }
      break;
    case IC_BLADE:

      UseBlade(pSoldier, sTargetGridNo);
      break;
    case IC_PUNCH:
      UseHandToHand(pSoldier, sTargetGridNo, false);
      break;

    case IC_LAUNCHER:
      UseLauncher(pSoldier, sTargetGridNo);
      break;

    default:
      // attempt to throw
      UseThrown(pSoldier, sTargetGridNo);
      break;
  }
  return true;
}

export function GetTargetWorldPositions(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16, pdXPos: Pointer<FLOAT>, pdYPos: Pointer<FLOAT>, pdZPos: Pointer<FLOAT>): void {
  let dTargetX: FLOAT;
  let dTargetY: FLOAT;
  let dTargetZ: FLOAT;
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let bStructHeight: INT8;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let uiRoll: UINT32;

  pTargetSoldier = SimpleFindSoldier(sTargetGridNo, pSoldier.value.bTargetLevel);
  if (pTargetSoldier) {
    // SAVE OPP ID
    pSoldier.value.ubOppNum = pTargetSoldier.value.ubID;
    dTargetX = CenterX(pTargetSoldier.value.sGridNo);
    dTargetY = CenterY(pTargetSoldier.value.sGridNo);
    if (pSoldier.value.bAimShotLocation == AIM_SHOT_RANDOM) {
      uiRoll = PreRandom(100);
      if (uiRoll < 15) {
        pSoldier.value.bAimShotLocation = AIM_SHOT_LEGS;
      } else if (uiRoll > 94) {
        pSoldier.value.bAimShotLocation = AIM_SHOT_HEAD;
      } else {
        pSoldier.value.bAimShotLocation = AIM_SHOT_TORSO;
      }
      if (pSoldier.value.bAimShotLocation != AIM_SHOT_HEAD) {
        let uiChanceToGetThrough: UINT32 = SoldierToSoldierBodyPartChanceToGetThrough(pSoldier, pTargetSoldier, pSoldier.value.bAimShotLocation);

        if (uiChanceToGetThrough < 25) {
          if (SoldierToSoldierBodyPartChanceToGetThrough(pSoldier, pTargetSoldier, AIM_SHOT_HEAD) > uiChanceToGetThrough * 2) {
            // try for a head shot then
            pSoldier.value.bAimShotLocation = AIM_SHOT_HEAD;
          }
        }
      }
    }

    switch (pSoldier.value.bAimShotLocation) {
      case AIM_SHOT_HEAD:
        CalculateSoldierZPos(pTargetSoldier, Enum230.HEAD_TARGET_POS, addressof(dTargetZ));
        break;
      case AIM_SHOT_TORSO:
        CalculateSoldierZPos(pTargetSoldier, Enum230.TORSO_TARGET_POS, addressof(dTargetZ));
        break;
      case AIM_SHOT_LEGS:
        CalculateSoldierZPos(pTargetSoldier, Enum230.LEGS_TARGET_POS, addressof(dTargetZ));
        break;
      default:
        // %)@#&(%?
        CalculateSoldierZPos(pTargetSoldier, Enum230.TARGET_POS, addressof(dTargetZ));
        break;
    }
  } else {
    // GET TARGET XY VALUES
    ConvertGridNoToCenterCellXY(sTargetGridNo, addressof(sXMapPos), addressof(sYMapPos));

    // fire at centre of tile
    dTargetX = sXMapPos;
    dTargetY = sYMapPos;
    if (pSoldier.value.bTargetCubeLevel) {
      // fire at the centre of the cube specified
      dTargetZ = ((pSoldier.value.bTargetCubeLevel + pSoldier.value.bTargetLevel * PROFILE_Z_SIZE) - 0.5) * HEIGHT_UNITS_PER_INDEX;
    } else {
      bStructHeight = GetStructureTargetHeight(sTargetGridNo, (pSoldier.value.bTargetLevel == 1));
      if (bStructHeight > 0) {
        // fire at the centre of the cube *one below* the tallest of the tallest structure
        if (bStructHeight > 1) {
          // reduce target level by 1
          bStructHeight--;
        }
        dTargetZ = ((bStructHeight + pSoldier.value.bTargetLevel * PROFILE_Z_SIZE) - 0.5) * HEIGHT_UNITS_PER_INDEX;
      } else {
        // fire at 1 unit above the level of the ground
        dTargetZ = (pSoldier.value.bTargetLevel * PROFILE_Z_SIZE) * HEIGHT_UNITS_PER_INDEX + 1;
      }
    }
    // adjust for terrain height
    dTargetZ += CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[sTargetGridNo].sHeight);
  }

  pdXPos.value = dTargetX;
  pdYPos.value = dTargetY;
  pdZPos.value = dTargetZ;
}

function UseGun(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): boolean {
  let uiHitChance: UINT32;
  let uiDiceRoll: UINT32;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sAPCost: INT16;
  let dTargetX: FLOAT;
  let dTargetY: FLOAT;
  let dTargetZ: FLOAT;
  let usItemNum: UINT16;
  let fBuckshot: boolean;
  let ubVolume: UINT8;
  let bSilencerPos: INT8;
  let zBurstString: string /* INT8[50] */;
  let ubDirection: UINT8;
  let sNewGridNo: INT16;
  let ubMerc: UINT8;
  let fGonnaHit: boolean = false;
  let usExpGain: UINT16 = 0;
  let uiDepreciateTest: UINT32;

  // Deduct points!
  sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, false, pSoldier.value.bAimTime);

  usItemNum = pSoldier.value.usAttackingWeapon;

  if (pSoldier.value.bDoBurst) {
    // ONly deduct points once
    if (pSoldier.value.bDoBurst == 1) {
      if (Weapon[usItemNum].sBurstSound != NO_WEAPON_SOUND) {
        // IF we are silenced?
        if (FindAttachment(addressof(pSoldier.value.inv[pSoldier.value.ubAttackingHand]), Enum225.SILENCER) != NO_SLOT) {
          // Pick sound file baed on how many bullets we are going to fire...
          zBurstString = sprintf("SOUNDS\\WEAPONS\\SILENCER BURST %d.wav", pSoldier.value.bBulletsLeft);

          // Try playing sound...
          pSoldier.value.iBurstSoundID = PlayJA2SampleFromFile(zBurstString, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
        } else {
          // Pick sound file baed on how many bullets we are going to fire...
          zBurstString = sprintf("SOUNDS\\WEAPONS\\%s%d.wav", gzBurstSndStrings[Weapon[usItemNum].ubCalibre], pSoldier.value.bBulletsLeft);

          // Try playing sound...
          pSoldier.value.iBurstSoundID = PlayJA2SampleFromFile(zBurstString, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
        }

        if (pSoldier.value.iBurstSoundID == NO_SAMPLE) {
          // If failed, play normal default....
          pSoldier.value.iBurstSoundID = PlayJA2Sample(Weapon[usItemNum].sBurstSound, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
        }
      }

      DeductPoints(pSoldier, sAPCost, 0);
    }
  } else {
    // ONLY DEDUCT FOR THE FIRST HAND when doing two-pistol attacks
    if (IsValidSecondHandShot(pSoldier) && pSoldier.value.inv[Enum261.HANDPOS].bGunStatus >= USABLE && pSoldier.value.inv[Enum261.HANDPOS].bGunAmmoStatus > 0) {
      // only deduct APs when the main gun fires
      if (pSoldier.value.ubAttackingHand == Enum261.HANDPOS) {
        DeductPoints(pSoldier, sAPCost, 0);
      }
    } else {
      DeductPoints(pSoldier, sAPCost, 0);
    }

    // PLAY SOUND
    // ( For throwing knife.. it's earlier in the animation
    if (Weapon[usItemNum].sSound != NO_WEAPON_SOUND && Item[usItemNum].usItemClass != IC_THROWING_KNIFE) {
      // Switch on silencer...
      if (FindAttachment(addressof(pSoldier.value.inv[pSoldier.value.ubAttackingHand]), Enum225.SILENCER) != NO_SLOT) {
        let uiSound: INT32;

        if (Weapon[usItemNum].ubCalibre == Enum285.AMMO9 || Weapon[usItemNum].ubCalibre == Enum285.AMMO38 || Weapon[usItemNum].ubCalibre == Enum285.AMMO57) {
          uiSound = Enum330.S_SILENCER_1;
        } else {
          uiSound = Enum330.S_SILENCER_2;
        }

        PlayJA2Sample(uiSound, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
      } else {
        PlayJA2Sample(Weapon[usItemNum].sSound, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
      }
    }
  }

  // CALC CHANCE TO HIT
  if (Item[usItemNum].usItemClass == IC_THROWING_KNIFE) {
    uiHitChance = CalcThrownChanceToHit(pSoldier, sTargetGridNo, pSoldier.value.bAimTime, pSoldier.value.bAimShotLocation);
  } else {
    uiHitChance = CalcChanceToHitGun(pSoldier, sTargetGridNo, pSoldier.value.bAimTime, pSoldier.value.bAimShotLocation);
  }

  // ATE: Added if we are in meanwhile, we always hit...
  if (AreInMeanwhile()) {
    uiHitChance = 100;
  }

  // ROLL DICE
  uiDiceRoll = PreRandom(100);

  fGonnaHit = uiDiceRoll <= uiHitChance;

  // GET TARGET XY VALUES
  ConvertGridNoToCenterCellXY(sTargetGridNo, addressof(sXMapPos), addressof(sYMapPos));

  // ATE; Moved a whole blotch if logic code for finding target positions to a function
  // so other places can use it
  GetTargetWorldPositions(pSoldier, sTargetGridNo, addressof(dTargetX), addressof(dTargetY), addressof(dTargetZ));

  // Some things we don't do for knives...
  if (Item[usItemNum].usItemClass != IC_THROWING_KNIFE) {
    // If realtime - set counter to freeup from attacking once done
    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      // Set delay based on stats, weapon type, etc
      pSoldier.value.sReloadDelay = (Weapon[usItemNum].usReloadDelay + MANDATORY_WEAPON_DELAY);

      // If a bad guy, double the delay!
      if ((pSoldier.value.uiStatusFlags & SOLDIER_ENEMY)) {
        pSoldier.value.sReloadDelay = (pSoldier.value.sReloadDelay * 2);
      }

      // slow down demo mode!
      if (gTacticalStatus.uiFlags & DEMOMODE) {
        pSoldier.value.sReloadDelay *= 2;
      }

      // pSoldier->fReloading		= TRUE;
      // RESETTIMECOUNTER( pSoldier->ReloadCounter, pSoldier->sReloadDelay );
    }

    // Deduct AMMO!
    DeductAmmo(pSoldier, pSoldier.value.ubAttackingHand);

    // ATE: Check if we should say quote...
    if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubGunShotsLeft == 0 && pSoldier.value.usAttackingWeapon != Enum225.ROCKET_LAUNCHER) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        pSoldier.value.fSayAmmoQuotePending = true;
      }
    }

    // NB bDoBurst will be 2 at this point for the first shot since it was incremented
    // above
    if (PTR_OURTEAM() && pSoldier.value.ubTargetID != NOBODY && (!pSoldier.value.bDoBurst || pSoldier.value.bDoBurst == 2) && (gTacticalStatus.uiFlags & INCOMBAT) && (SoldierToSoldierBodyPartChanceToGetThrough(pSoldier, MercPtrs[pSoldier.value.ubTargetID], pSoldier.value.bAimShotLocation) > 0)) {
      if (fGonnaHit) {
        // grant extra exp for hitting a difficult target
        usExpGain += (100 - uiHitChance) / 25;

        if (pSoldier.value.bAimTime && !pSoldier.value.bDoBurst) {
          // gain extra exp for aiming, up to the amount from
          // the difficulty of the shot
          usExpGain += Math.min(pSoldier.value.bAimTime, usExpGain);
        }

        // base pts extra for hitting
        usExpGain += 3;
      }

      // add base pts for taking a shot, whether it hits or misses
      usExpGain += 3;

      if (IsValidSecondHandShot(pSoldier) && pSoldier.value.inv[Enum261.HANDPOS].bGunStatus >= USABLE && pSoldier.value.inv[Enum261.HANDPOS].bGunAmmoStatus > 0) {
        // reduce exp gain for two pistol shooting since both shots give xp
        usExpGain = (usExpGain * 2) / 3;
      }

      if (MercPtrs[pSoldier.value.ubTargetID].value.ubBodyType == Enum194.COW || MercPtrs[pSoldier.value.ubTargetID].value.ubBodyType == Enum194.CROW) {
        usExpGain /= 2;
      } else if (MercPtrs[pSoldier.value.ubTargetID].value.uiStatusFlags & SOLDIER_VEHICLE || AM_A_ROBOT(MercPtrs[pSoldier.value.ubTargetID]) || TANK(MercPtrs[pSoldier.value.ubTargetID])) {
        // no exp from shooting a vehicle that you can't damage and can't move!
        usExpGain = 0;
      }

      // MARKSMANSHIP GAIN: gun attack
      StatChange(pSoldier, MARKAMT, usExpGain, (fGonnaHit ? false : FROM_FAILURE));
    }

    // set buckshot and muzzle flash
    fBuckshot = false;
    if (!CREATURE_OR_BLOODCAT(pSoldier)) {
      pSoldier.value.fMuzzleFlash = true;
      switch (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubGunAmmoType) {
        case Enum286.AMMO_BUCKSHOT:
          fBuckshot = true;
          break;
        case Enum286.AMMO_SLEEP_DART:
          pSoldier.value.fMuzzleFlash = false;
          break;
        default:
          break;
      }
    }
  } else //  throwing knife
  {
    fBuckshot = false;
    pSoldier.value.fMuzzleFlash = false;

    // Deduct knife from inv! (not here, later?)

    // Improve for using a throwing knife....
    if (PTR_OURTEAM() && pSoldier.value.ubTargetID != NOBODY) {
      if (fGonnaHit) {
        // grant extra exp for hitting a difficult target
        usExpGain += (100 - uiHitChance) / 10;

        if (pSoldier.value.bAimTime) {
          // gain extra exp for aiming, up to the amount from
          // the difficulty of the throw
          usExpGain += (2 * Math.min(pSoldier.value.bAimTime, usExpGain));
        }

        // base pts extra for hitting
        usExpGain += 10;
      }

      // add base pts for taking a shot, whether it hits or misses
      usExpGain += 10;

      if (MercPtrs[pSoldier.value.ubTargetID].value.ubBodyType == Enum194.COW || MercPtrs[pSoldier.value.ubTargetID].value.ubBodyType == Enum194.CROW) {
        usExpGain /= 2;
      } else if (MercPtrs[pSoldier.value.ubTargetID].value.uiStatusFlags & SOLDIER_VEHICLE || AM_A_ROBOT(MercPtrs[pSoldier.value.ubTargetID]) || TANK(MercPtrs[pSoldier.value.ubTargetID])) {
        // no exp from shooting a vehicle that you can't damage and can't move!
        usExpGain = 0;
      }

      // MARKSMANSHIP/DEXTERITY GAIN: throwing knife attack
      StatChange(pSoldier, MARKAMT, (usExpGain / 2), (fGonnaHit ? false : FROM_FAILURE));
      StatChange(pSoldier, DEXTAMT, (usExpGain / 2), (fGonnaHit ? false : FROM_FAILURE));
    }
  }

  if (usItemNum == Enum225.ROCKET_LAUNCHER) {
    if (WillExplosiveWeaponFail(pSoldier, addressof(pSoldier.value.inv[Enum261.HANDPOS]))) {
      CreateItem(Enum225.DISCARDED_LAW, pSoldier.value.inv[Enum261.HANDPOS].bStatus[0], addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

      IgniteExplosion(pSoldier.value.ubID, CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), 0, pSoldier.value.sGridNo, Enum225.C1, pSoldier.value.bLevel);

      // Reduce again for attack end 'cause it has been incremented for a normal attack
      //
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - ATTACK ANIMATION %s ENDED BY BAD EXPLOSIVE CHECK, Now %d", gAnimControl[pSoldier.value.usAnimState].zAnimStr, gTacticalStatus.ubAttackBusyCount));
      ReduceAttackBusyCount(pSoldier.value.ubID, false);

      return false;
    }
  }

  FireBulletGivenTarget(pSoldier, dTargetX, dTargetY, dTargetZ, pSoldier.value.usAttackingWeapon, (uiHitChance - uiDiceRoll), fBuckshot, false);

  ubVolume = Weapon[pSoldier.value.usAttackingWeapon].ubAttackVolume;

  if (Item[usItemNum].usItemClass == IC_THROWING_KNIFE) {
    // Here, remove the knife...	or (for now) rocket launcher
    RemoveObjs(addressof(pSoldier.value.inv[Enum261.HANDPOS]), 1);
    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
  } else if (usItemNum == Enum225.ROCKET_LAUNCHER) {
    CreateItem(Enum225.DISCARDED_LAW, pSoldier.value.inv[Enum261.HANDPOS].bStatus[0], addressof(pSoldier.value.inv[Enum261.HANDPOS]));
    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

    // Direction to center of explosion
    ubDirection = gOppositeDirection[pSoldier.value.bDirection];
    sNewGridNo = NewGridNo(pSoldier.value.sGridNo, (1 * DirectionInc(ubDirection)));

    // Check if a person exists here and is not prone....
    ubMerc = WhoIsThere2(sNewGridNo, pSoldier.value.bLevel);

    if (ubMerc != NOBODY) {
      if (gAnimControl[MercPtrs[ubMerc].value.usAnimState].ubHeight != ANIM_PRONE) {
        // Increment attack counter...
        gTacticalStatus.ubAttackBusyCount++;
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Incrementing Attack: Exaust from LAW", gTacticalStatus.ubAttackBusyCount));

        EVENT_SoldierGotHit(MercPtrs[ubMerc], Enum225.MINI_GRENADE, 10, 200, pSoldier.value.bDirection, 0, pSoldier.value.ubID, 0, ANIM_CROUCH, 0, sNewGridNo);
      }
    }
  } else {
    // if the weapon has a silencer attached
    bSilencerPos = FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.SILENCER);
    if (bSilencerPos != -1) {
      // reduce volume by a percentage equal to silencer's work %age (min 1)
      ubVolume = 1 + ((100 - WEAPON_STATUS_MOD(pSoldier.value.inv[Enum261.HANDPOS].bAttachStatus[bSilencerPos])) / (100 / (ubVolume - 1)));
    }
  }

  MakeNoise(pSoldier.value.ubID, pSoldier.value.sGridNo, pSoldier.value.bLevel, pSoldier.value.bOverTerrainType, ubVolume, Enum236.NOISE_GUNFIRE);

  if (pSoldier.value.bDoBurst) {
    // done, if bursting, increment
    pSoldier.value.bDoBurst++;
  }

  // CJC: since jamming is no longer affected by reliability, increase chance of status going down for really unreliabile guns
  uiDepreciateTest = BASIC_DEPRECIATE_CHANCE + 3 * Item[usItemNum].bReliability;

  if (!PreRandom(uiDepreciateTest) && (pSoldier.value.inv[pSoldier.value.ubAttackingHand].bStatus[0] > 1)) {
    pSoldier.value.inv[pSoldier.value.ubAttackingHand].bStatus[0]--;
  }

  // reduce monster smell (gunpowder smell)
  if (pSoldier.value.bMonsterSmell > 0 && Random(2) == 0) {
    pSoldier.value.bMonsterSmell--;
  }

  return true;
}

function UseBlade(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): boolean {
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let iHitChance: INT32;
  let iDiceRoll: INT32;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sAPCost: INT16;
  let SWeaponHit: EV_S_WEAPONHIT;
  let iImpact: INT32;
  let iImpactForCrits: INT32;
  let fGonnaHit: boolean = false;
  let usExpGain: UINT16 = 0;
  let bMaxDrop: INT8;
  let fSurpriseAttack: boolean;

  // Deduct points!
  sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, false, pSoldier.value.bAimTime);

  DeductPoints(pSoldier, sAPCost, 0);

  // GET TARGET XY VALUES
  ConvertGridNoToCenterCellXY(sTargetGridNo, addressof(sXMapPos), addressof(sYMapPos));

  // See if a guy is here!
  pTargetSoldier = SimpleFindSoldier(sTargetGridNo, pSoldier.value.bTargetLevel);
  if (pTargetSoldier) {
    // set target as noticed attack
    pSoldier.value.uiStatusFlags |= SOLDIER_ATTACK_NOTICED;
    pTargetSoldier.value.fIntendedTarget = true;

    // SAVE OPP ID
    pSoldier.value.ubOppNum = pTargetSoldier.value.ubID;

    // CHECK IF BUDDY KNOWS ABOUT US
    if (pTargetSoldier.value.bOppList[pSoldier.value.ubID] == NOT_HEARD_OR_SEEN || pTargetSoldier.value.bLife < OKLIFE || pTargetSoldier.value.bCollapsed) {
      iHitChance = 100;
      fSurpriseAttack = true;
    } else {
      iHitChance = CalcChanceToStab(pSoldier, pTargetSoldier, pSoldier.value.bAimTime);
      fSurpriseAttack = false;
    }

    // ROLL DICE
    iDiceRoll = PreRandom(100);
    // sprintf( gDebugStr, "Hit Chance: %d %d", (int)uiHitChance, uiDiceRoll );

    if (iDiceRoll <= iHitChance) {
      fGonnaHit = true;

      // CALCULATE DAMAGE!
      // attack HITS, calculate damage (base damage is 1-maximum knife sImpact)
      iImpact = HTHImpact(pSoldier, pTargetSoldier, (iHitChance - iDiceRoll), true);

      // modify this by the knife's condition (if it's dull, not much good)
      iImpact = (iImpact * WEAPON_STATUS_MOD(pSoldier.value.inv[pSoldier.value.ubAttackingHand].bStatus[0])) / 100;

      // modify by hit location
      AdjustImpactByHitLocation(iImpact, pSoldier.value.bAimShotLocation, addressof(iImpact), addressof(iImpactForCrits));

      // bonus for surprise
      if (fSurpriseAttack) {
        iImpact = (iImpact * 3) / 2;
      }

      // any successful hit does at LEAST 1 pt minimum damage
      if (iImpact < 1) {
        iImpact = 1;
      }

      if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].bStatus[0] > USABLE) {
        bMaxDrop = (iImpact / 20);

        // the duller they get, the slower they get any worse...
        bMaxDrop = Math.min(bMaxDrop, pSoldier.value.inv[pSoldier.value.ubAttackingHand].bStatus[0] / 10);

        // as long as its still > USABLE, it drops another point 1/2 the time
        bMaxDrop = Math.max(bMaxDrop, 2);

        pSoldier.value.inv[pSoldier.value.ubAttackingHand].bStatus[0] -= Random(bMaxDrop); // 0 to (maxDrop - 1)
      }

      // Send event for getting hit
      memset(addressof(SWeaponHit), 0, sizeof(SWeaponHit));
      SWeaponHit.usSoldierID = pTargetSoldier.value.ubID;
      SWeaponHit.uiUniqueId = pTargetSoldier.value.uiUniqueSoldierIdValue;
      SWeaponHit.usWeaponIndex = pSoldier.value.usAttackingWeapon;
      SWeaponHit.sDamage = iImpact;
      SWeaponHit.usDirection = GetDirectionFromGridNo(pSoldier.value.sGridNo, pTargetSoldier);
      SWeaponHit.sXPos = pTargetSoldier.value.dXPos;
      SWeaponHit.sYPos = pTargetSoldier.value.dYPos;
      SWeaponHit.sZPos = 20;
      SWeaponHit.sRange = 1;
      SWeaponHit.ubAttackerID = pSoldier.value.ubID;
      SWeaponHit.fHit = true;
      SWeaponHit.ubSpecial = FIRE_WEAPON_NO_SPECIAL;
      AddGameEvent(Enum319.S_WEAPONHIT, 20, addressof(SWeaponHit));
    } else {
      // if it was another team shooting at someone under our control
      if ((pSoldier.value.bTeam != Menptr[pTargetSoldier.value.ubID].bTeam)) {
        if (pTargetSoldier.value.bTeam == gbPlayerNum) {
          // AGILITY GAIN (10):  Target avoids a knife attack
          StatChange(MercPtrs[pTargetSoldier.value.ubID], AGILAMT, 10, false);
        }
      }
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - missed in knife attack"));
      FreeUpAttacker(pSoldier.value.ubID);
    }

    if (PTR_OURTEAM() && pSoldier.value.ubTargetID != NOBODY) {
      if (fGonnaHit) {
        // grant extra exp for hitting a difficult target
        usExpGain += (100 - iHitChance) / 10;

        if (pSoldier.value.bAimTime) {
          // gain extra exp for aiming, up to the amount from
          // the difficulty of the attack
          usExpGain += (2 * Math.min(pSoldier.value.bAimTime, usExpGain));
        }

        // base pts extra for hitting
        usExpGain += 10;
      }

      // add base pts for taking a shot, whether it hits or misses
      usExpGain += 10;

      if (MercPtrs[pSoldier.value.ubTargetID].value.ubBodyType == Enum194.COW || MercPtrs[pSoldier.value.ubTargetID].value.ubBodyType == Enum194.CROW) {
        usExpGain /= 2;
      } else if (MercPtrs[pSoldier.value.ubTargetID].value.uiStatusFlags & SOLDIER_VEHICLE || AM_A_ROBOT(MercPtrs[pSoldier.value.ubTargetID]) || TANK(MercPtrs[pSoldier.value.ubTargetID])) {
        // no exp from shooting a vehicle that you can't damage and can't move!
        usExpGain = 0;
      }

      // DEXTERITY GAIN:  Made a knife attack, successful or not
      StatChange(pSoldier, DEXTAMT, usExpGain, (fGonnaHit ? false : FROM_FAILURE));
    }
  } else {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - missed in knife attack"));
    FreeUpAttacker(pSoldier.value.ubID);
  }

  // possibly reduce monster smell
  if (pSoldier.value.bMonsterSmell > 0 && Random(5) == 0) {
    pSoldier.value.bMonsterSmell--;
  }

  return true;
}

export function UseHandToHand(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16, fStealing: boolean): boolean {
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let iHitChance: INT32;
  let iDiceRoll: INT32;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sAPCost: INT16;
  let SWeaponHit: EV_S_WEAPONHIT;
  let iImpact: INT32;
  let usOldItem: UINT16;
  let ubExpGain: UINT8;

  // Deduct points!
  // August 13 2002: unless stealing - APs already deducted elsewhere

  //	if (!fStealing)
  {
    sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, false, pSoldier.value.bAimTime);

    DeductPoints(pSoldier, sAPCost, 0);
  }

  // See if a guy is here!
  pTargetSoldier = SimpleFindSoldier(sTargetGridNo, pSoldier.value.bTargetLevel);
  if (pTargetSoldier) {
    // set target as noticed attack
    pSoldier.value.uiStatusFlags |= SOLDIER_ATTACK_NOTICED;
    pTargetSoldier.value.fIntendedTarget = true;

    // SAVE OPP ID
    pSoldier.value.ubOppNum = pTargetSoldier.value.ubID;

    if (fStealing) {
      if (AM_A_ROBOT(pTargetSoldier) || TANK(pTargetSoldier) || CREATURE_OR_BLOODCAT(pTargetSoldier) || TANK(pTargetSoldier)) {
        iHitChance = 0;
      } else if (pTargetSoldier.value.bOppList[pSoldier.value.ubID] == NOT_HEARD_OR_SEEN) {
        // give bonus for surprise, but not so much as struggle would still occur
        iHitChance = CalcChanceToSteal(pSoldier, pTargetSoldier, pSoldier.value.bAimTime) + 20;
      } else if (pTargetSoldier.value.bLife < OKLIFE || pTargetSoldier.value.bCollapsed) {
        iHitChance = 100;
      } else {
        iHitChance = CalcChanceToSteal(pSoldier, pTargetSoldier, pSoldier.value.bAimTime);
      }
    } else {
      if (pTargetSoldier.value.bOppList[pSoldier.value.ubID] == NOT_HEARD_OR_SEEN || pTargetSoldier.value.bLife < OKLIFE || pTargetSoldier.value.bCollapsed) {
        iHitChance = 100;
      } else {
        iHitChance = CalcChanceToPunch(pSoldier, pTargetSoldier, pSoldier.value.bAimTime);
      }
    }

    // ROLL DICE
    iDiceRoll = PreRandom(100);
    // sprintf( gDebugStr, "Hit Chance: %d %d", (int)uiHitChance, uiDiceRoll );

    // GET TARGET XY VALUES
    ConvertGridNoToCenterCellXY(sTargetGridNo, addressof(sXMapPos), addressof(sYMapPos));

    if (fStealing) {
      if (pTargetSoldier.value.inv[Enum261.HANDPOS].usItem != NOTHING) {
        if (iDiceRoll <= iHitChance) {
          // Was a good steal!
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_STOLE_SOMETHING], pSoldier.value.name, ShortItemNames[pTargetSoldier.value.inv[Enum261.HANDPOS].usItem]);

          usOldItem = pTargetSoldier.value.inv[Enum261.HANDPOS].usItem;

          if (pSoldier.value.bTeam == gbPlayerNum && pTargetSoldier.value.bTeam != gbPlayerNum && !(pTargetSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pTargetSoldier) && !TANK(pTargetSoldier)) {
            // made a steal; give experience
            StatChange(pSoldier, STRAMT, 8, false);
          }

          if (iDiceRoll <= iHitChance * 2 / 3) {
            // Grabbed item
            if (AutoPlaceObject(pSoldier, addressof(pTargetSoldier.value.inv[Enum261.HANDPOS]), true)) {
              // Item transferred; remove it from the target's inventory
              DeleteObj(addressof(pTargetSoldier.value.inv[Enum261.HANDPOS]));
            } else {
              // No room to hold it so the item should drop in our tile again
              AddItemToPool(pSoldier.value.sGridNo, addressof(pTargetSoldier.value.inv[Enum261.HANDPOS]), 1, pSoldier.value.bLevel, 0, -1);
              DeleteObj(addressof(pTargetSoldier.value.inv[Enum261.HANDPOS]));
            }
          } else {
            if (pSoldier.value.bTeam == gbPlayerNum) {
              DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
            }

            // Item dropped somewhere... roll based on the same chance to determine where!
            iDiceRoll = PreRandom(100);
            if (iDiceRoll < iHitChance) {
              // Drop item in the our tile
              AddItemToPool(pSoldier.value.sGridNo, addressof(pTargetSoldier.value.inv[Enum261.HANDPOS]), 1, pSoldier.value.bLevel, 0, -1);
            } else {
              // Drop item in the target's tile
              AddItemToPool(pTargetSoldier.value.sGridNo, addressof(pTargetSoldier.value.inv[Enum261.HANDPOS]), 1, pSoldier.value.bLevel, 0, -1);
            }
            DeleteObj(addressof(pTargetSoldier.value.inv[Enum261.HANDPOS]));
          }

          // Reload buddy's animation...
          ReLoadSoldierAnimationDueToHandItemChange(pTargetSoldier, usOldItem, NOTHING);
        } else {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_FAILED_TO_STEAL_SOMETHING], pSoldier.value.name, ShortItemNames[pTargetSoldier.value.inv[Enum261.HANDPOS].usItem]);
          if (pSoldier.value.bTeam == gbPlayerNum) {
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
          }

          if (iHitChance > 0 && pSoldier.value.bTeam == gbPlayerNum && pTargetSoldier.value.bTeam != gbPlayerNum && !(pTargetSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pTargetSoldier) && !TANK(pTargetSoldier)) {
            // failed a steal; give some experience
            StatChange(pSoldier, STRAMT, 4, FROM_FAILURE);
          }
        }
      }

      FreeUpAttacker(pSoldier.value.ubID);
    } else {
      // ATE/CC: if doing ninja spin kick (only), automatically make it a hit
      if (pSoldier.value.usAnimState == Enum193.NINJA_SPINKICK) {
        // Let him to succeed by a random amount
        iDiceRoll = PreRandom(iHitChance);
      }

      if (pSoldier.value.bTeam == gbPlayerNum && pTargetSoldier.value.bTeam != gbPlayerNum) {
        // made an HTH attack; give experience
        if (iDiceRoll <= iHitChance) {
          ubExpGain = 8;

          if (pTargetSoldier.value.uiStatusFlags & SOLDIER_VEHICLE || AM_A_ROBOT(pTargetSoldier) || TANK(pTargetSoldier)) {
            ubExpGain = 0;
          } else if (pTargetSoldier.value.ubBodyType == Enum194.COW || pTargetSoldier.value.ubBodyType == Enum194.CROW) {
            ubExpGain /= 2;
          }

          StatChange(pSoldier, STRAMT, ubExpGain, false);
          StatChange(pSoldier, DEXTAMT, ubExpGain, false);
        } else {
          ubExpGain = 4;

          if (pTargetSoldier.value.uiStatusFlags & SOLDIER_VEHICLE || AM_A_ROBOT(pTargetSoldier) || TANK(pTargetSoldier)) {
            ubExpGain = 0;
          } else if (pTargetSoldier.value.ubBodyType == Enum194.COW || pTargetSoldier.value.ubBodyType == Enum194.CROW) {
            ubExpGain /= 2;
          }

          StatChange(pSoldier, STRAMT, ubExpGain, FROM_FAILURE);
          StatChange(pSoldier, DEXTAMT, ubExpGain, FROM_FAILURE);
        }
      } else if (pSoldier.value.bTeam != gbPlayerNum && pTargetSoldier.value.bTeam == gbPlayerNum) {
        // being attacked... if successfully dodged, give experience
        if (iDiceRoll > iHitChance) {
          StatChange(pTargetSoldier, AGILAMT, 8, false);
        }
      }

      if (iDiceRoll <= iHitChance || AreInMeanwhile()) {
        // CALCULATE DAMAGE!
        iImpact = HTHImpact(pSoldier, pTargetSoldier, (iHitChance - iDiceRoll), false);

        // Send event for getting hit
        memset(addressof(SWeaponHit), 0, sizeof(SWeaponHit));
        SWeaponHit.usSoldierID = pTargetSoldier.value.ubID;
        SWeaponHit.usWeaponIndex = pSoldier.value.usAttackingWeapon;
        SWeaponHit.sDamage = iImpact;
        SWeaponHit.usDirection = GetDirectionFromGridNo(pSoldier.value.sGridNo, pTargetSoldier);
        SWeaponHit.sXPos = pTargetSoldier.value.dXPos;
        SWeaponHit.sYPos = pTargetSoldier.value.dYPos;
        SWeaponHit.sZPos = 20;
        SWeaponHit.sRange = 1;
        SWeaponHit.ubAttackerID = pSoldier.value.ubID;
        SWeaponHit.fHit = true;
        SWeaponHit.ubSpecial = FIRE_WEAPON_NO_SPECIAL;
        AddGameEvent(Enum319.S_WEAPONHIT, 20, addressof(SWeaponHit));
      } else {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - missed in HTH attack"));
        FreeUpAttacker(pSoldier.value.ubID);
      }
    }
  }

  // possibly reduce monster smell (gunpowder smell)
  if (pSoldier.value.bMonsterSmell > 0 && Random(5) == 0) {
    pSoldier.value.bMonsterSmell--;
  }

  return true;
}

function UseThrown(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): boolean {
  let uiHitChance: UINT32;
  let uiDiceRoll: UINT32;
  let sAPCost: INT16 = 0;
  let bLoop: INT8;
  let ubTargetID: UINT8;
  let pTargetSoldier: Pointer<SOLDIERTYPE>;

  uiHitChance = CalcThrownChanceToHit(pSoldier, sTargetGridNo, pSoldier.value.bAimTime, AIM_SHOT_TORSO);

  uiDiceRoll = PreRandom(100);

  if (pSoldier.value.bTeam == gbPlayerNum && gTacticalStatus.uiFlags & INCOMBAT) {
    // check target gridno
    ubTargetID = WhoIsThere2(pSoldier.value.sTargetGridNo, pSoldier.value.bTargetLevel);
    if (ubTargetID == NOBODY) {
      pTargetSoldier = null;
    } else {
      pTargetSoldier = MercPtrs[ubTargetID];
    }

    if (pTargetSoldier && pTargetSoldier.value.bTeam == pSoldier.value.bTeam) {
      // ignore!
      pTargetSoldier = null;
    }

    if (pTargetSoldier == null) {
      // search for an opponent near the target gridno
      for (bLoop = 0; bLoop < Enum245.NUM_WORLD_DIRECTIONS; bLoop++) {
        ubTargetID = WhoIsThere2(NewGridNo(pSoldier.value.sTargetGridNo, DirectionInc(bLoop)), pSoldier.value.bTargetLevel);
        pTargetSoldier = null;
        if (ubTargetID != NOBODY) {
          pTargetSoldier = MercPtrs[ubTargetID];
          if (pTargetSoldier.value.bTeam != pSoldier.value.bTeam) {
            break;
          }
        }
      }
    }

    if (pTargetSoldier) {
      // ok this is a real attack on someone, grant experience
      StatChange(pSoldier, STRAMT, 5, false);
      if (uiDiceRoll < uiHitChance) {
        StatChange(pSoldier, DEXTAMT, 5, false);
        StatChange(pSoldier, MARKAMT, 5, false);
      } else {
        StatChange(pSoldier, DEXTAMT, 2, FROM_FAILURE);
        StatChange(pSoldier, MARKAMT, 2, FROM_FAILURE);
      }
    }
  }

  CalculateLaunchItemParamsForThrow(pSoldier, sTargetGridNo, pSoldier.value.bTargetLevel, (pSoldier.value.bTargetLevel * 256), addressof(pSoldier.value.inv[Enum261.HANDPOS]), (uiDiceRoll - uiHitChance), Enum258.THROW_ARM_ITEM, 0);

  // OK, goto throw animation
  HandleSoldierThrowItem(pSoldier, pSoldier.value.sTargetGridNo);

  RemoveObjs(addressof(pSoldier.value.inv[Enum261.HANDPOS]), 1);

  return true;
}

function UseLauncher(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): boolean {
  let uiHitChance: UINT32;
  let uiDiceRoll: UINT32;
  let sAPCost: INT16 = 0;
  let bAttachPos: INT8;
  let Launchable: OBJECTTYPE;
  let pObj: Pointer<OBJECTTYPE>;
  let usItemNum: UINT16;
  let iID: INT32;
  let pObject: Pointer<REAL_OBJECT>;

  usItemNum = pSoldier.value.usAttackingWeapon;

  if (!EnoughAmmo(pSoldier, true, pSoldier.value.ubAttackingHand)) {
    return false;
  }

  pObj = addressof(pSoldier.value.inv[Enum261.HANDPOS]);
  for (bAttachPos = 0; bAttachPos < MAX_ATTACHMENTS; bAttachPos++) {
    if (pObj.value.usAttachItem[bAttachPos] != NOTHING) {
      if (Item[pObj.value.usAttachItem[bAttachPos]].usItemClass & IC_EXPLOSV) {
        break;
      }
    }
  }
  if (bAttachPos == MAX_ATTACHMENTS) {
    // this should not happen!!
    return false;
  }

  CreateItem(pObj.value.usAttachItem[bAttachPos], pObj.value.bAttachStatus[bAttachPos], addressof(Launchable));

  if (pSoldier.value.usAttackingWeapon == pObj.value.usItem) {
    DeductAmmo(pSoldier, Enum261.HANDPOS);
  } else {
    // Firing an attached grenade launcher... the attachment we found above
    // is the one to remove!
    RemoveAttachment(pObj, bAttachPos, null);
  }

  // ATE: Check here if the launcher should fail 'cause of bad status.....
  if (WillExplosiveWeaponFail(pSoldier, pObj)) {
    // Explode dude!

    // So we still should have ABC > 0
    // Begin explosion due to failure...
    IgniteExplosion(pSoldier.value.ubID, CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), 0, pSoldier.value.sGridNo, Launchable.usItem, pSoldier.value.bLevel);

    // Reduce again for attack end 'cause it has been incremented for a normal attack
    //
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - ATTACK ANIMATION %s ENDED BY BAD EXPLOSIVE CHECK, Now %d", gAnimControl[pSoldier.value.usAnimState].zAnimStr, gTacticalStatus.ubAttackBusyCount));
    ReduceAttackBusyCount(pSoldier.value.ubID, false);

    // So all's well, should be good from here....
    return false;
  }

  if (Weapon[usItemNum].sSound != NO_WEAPON_SOUND) {
    PlayJA2Sample(Weapon[usItemNum].sSound, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
  }

  uiHitChance = CalcThrownChanceToHit(pSoldier, sTargetGridNo, pSoldier.value.bAimTime, AIM_SHOT_TORSO);

  uiDiceRoll = PreRandom(100);

  if (Item[usItemNum].usItemClass == IC_LAUNCHER) {
    // Preserve gridno!
    // pSoldier->sLastTarget = sTargetGridNo;

    sAPCost = MinAPsToAttack(pSoldier, sTargetGridNo, true);
  } else {
    // Throw....
    sAPCost = MinAPsToThrow(pSoldier, sTargetGridNo, false);
  }

  DeductPoints(pSoldier, sAPCost, 0);

  CalculateLaunchItemParamsForThrow(pSoldier, pSoldier.value.sTargetGridNo, pSoldier.value.bTargetLevel, 0, addressof(Launchable), (uiDiceRoll - uiHitChance), Enum258.THROW_ARM_ITEM, 0);

  iID = CreatePhysicalObject(pSoldier.value.pTempObject, pSoldier.value.pThrowParams.value.dLifeSpan, pSoldier.value.pThrowParams.value.dX, pSoldier.value.pThrowParams.value.dY, pSoldier.value.pThrowParams.value.dZ, pSoldier.value.pThrowParams.value.dForceX, pSoldier.value.pThrowParams.value.dForceY, pSoldier.value.pThrowParams.value.dForceZ, pSoldier.value.ubID, pSoldier.value.pThrowParams.value.ubActionCode, pSoldier.value.pThrowParams.value.uiActionData);

  pObject = addressof(ObjectSlots[iID]);
  // pObject->fPotentialForDebug = TRUE;

  MemFree(pSoldier.value.pTempObject);
  pSoldier.value.pTempObject = null;

  MemFree(pSoldier.value.pThrowParams);
  pSoldier.value.pThrowParams = null;

  return true;
}

function DoSpecialEffectAmmoMiss(ubAttackerID: UINT8, sGridNo: INT16, sXPos: INT16, sYPos: INT16, sZPos: INT16, fSoundOnly: boolean, fFreeupAttacker: boolean, iBullet: INT32): boolean {
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
  let ubAmmoType: UINT8;
  let usItem: UINT16;

  ubAmmoType = MercPtrs[ubAttackerID].value.inv[MercPtrs[ubAttackerID].value.ubAttackingHand].ubGunAmmoType;
  usItem = MercPtrs[ubAttackerID].value.inv[MercPtrs[ubAttackerID].value.ubAttackingHand].usItem;

  memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));

  if (ubAmmoType == Enum286.AMMO_HE || ubAmmoType == Enum286.AMMO_HEAT) {
    if (!fSoundOnly) {
      AniParams.sGridNo = sGridNo;
      AniParams.ubLevelID = ANI_TOPMOST_LEVEL;
      AniParams.sDelay = (100);
      AniParams.sStartFrame = 0;
      AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_ALWAYS_TRANSLUCENT;
      AniParams.sX = sXPos;
      AniParams.sY = sYPos;
      AniParams.sZ = sZPos;

      AniParams.zCachedFile = "TILECACHE\\MINIBOOM.STI";

      CreateAnimationTile(addressof(AniParams));

      if (fFreeupAttacker) {
        RemoveBullet(iBullet);
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - bullet hit structure - explosive ammo"));
        FreeUpAttacker(ubAttackerID);
      }
    }

    if (sGridNo != NOWHERE) {
      PlayJA2Sample(Enum330.SMALL_EXPLODE_1, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
    } else {
      PlayJA2Sample(Enum330.SMALL_EXPLODE_1, RATE_11025, MIDVOLUME, 1, MIDDLE);
    }

    return true;
  } else if (usItem == Enum225.CREATURE_OLD_MALE_SPIT || usItem == Enum225.CREATURE_QUEEN_SPIT || usItem == Enum225.CREATURE_INFANT_SPIT || usItem == Enum225.CREATURE_YOUNG_MALE_SPIT) {
    // Increment attack busy...
    // gTacticalStatus.ubAttackBusyCount++;
    // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("Incrementing Attack: Explosion gone off, COunt now %d", gTacticalStatus.ubAttackBusyCount ) );

    PlayJA2Sample(Enum330.CREATURE_GAS_NOISE, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));

    // Do Spread effect.......
    switch (usItem) {
      case Enum225.CREATURE_YOUNG_MALE_SPIT:
      case Enum225.CREATURE_INFANT_SPIT:

        NewSmokeEffect(sGridNo, Enum225.VERY_SMALL_CREATURE_GAS, 0, ubAttackerID);
        break;

      case Enum225.CREATURE_OLD_MALE_SPIT:
        NewSmokeEffect(sGridNo, Enum225.SMALL_CREATURE_GAS, 0, ubAttackerID);
        break;

      case Enum225.CREATURE_QUEEN_SPIT:
        NewSmokeEffect(sGridNo, Enum225.LARGE_CREATURE_GAS, 0, ubAttackerID);
        break;
    }
  }

  return false;
}

export function WeaponHit(usSoldierID: UINT16, usWeaponIndex: UINT16, sDamage: INT16, sBreathLoss: INT16, usDirection: UINT16, sXPos: INT16, sYPos: INT16, sZPos: INT16, sRange: INT16, ubAttackerID: UINT8, fHit: boolean, ubSpecial: UINT8, ubHitLocation: UINT8): void {
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Get attacker
  pSoldier = MercPtrs[ubAttackerID];

  // Get Target
  pTargetSoldier = MercPtrs[usSoldierID];

  MakeNoise(ubAttackerID, pTargetSoldier.value.sGridNo, pTargetSoldier.value.bLevel, gpWorldLevelData[pTargetSoldier.value.sGridNo].ubTerrainID, Weapon[usWeaponIndex].ubHitVolume, Enum236.NOISE_BULLET_IMPACT);

  if (EXPLOSIVE_GUN(usWeaponIndex)) {
    // Reduce attacker count!
    if (usWeaponIndex == Enum225.ROCKET_LAUNCHER) {
      IgniteExplosion(ubAttackerID, sXPos, sYPos, 0, (GETWORLDINDEXFROMWORLDCOORDS(sYPos, sXPos)), Enum225.C1, pTargetSoldier.value.bLevel);
    } else // tank cannon
    {
      IgniteExplosion(ubAttackerID, sXPos, sYPos, 0, (GETWORLDINDEXFROMWORLDCOORDS(sYPos, sXPos)), Enum225.TANK_SHELL, pTargetSoldier.value.bLevel);
    }

    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - end of LAW fire"));
    FreeUpAttacker(ubAttackerID);
    return;
  }

  DoSpecialEffectAmmoMiss(ubAttackerID, pTargetSoldier.value.sGridNo, sXPos, sYPos, sZPos, false, false, 0);

  // OK, SHOT HAS HIT, DO THINGS APPROPRIATELY
  // ATE: This is 'cause of that darn smoke effect that could potnetially kill
  // the poor bastard .. so check
  if (!pTargetSoldier.value.fDoingExternalDeath) {
    EVENT_SoldierGotHit(pTargetSoldier, usWeaponIndex, sDamage, sBreathLoss, usDirection, sRange, ubAttackerID, ubSpecial, ubHitLocation, 0, NOWHERE);
  } else {
    // Buddy had died from additional dammage - free up attacker here...
    ReduceAttackBusyCount(pTargetSoldier.value.ubAttackerID, false);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Special effect killed before bullet impact, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  }
}

export function StructureHit(iBullet: INT32, usWeaponIndex: UINT16, bWeaponStatus: INT8, ubAttackerID: UINT8, sXPos: UINT16, sYPos: INT16, sZPos: INT16, usStructureID: UINT16, iImpact: INT32, fStopped: boolean): void {
  let fDoMissForGun: boolean = false;
  let pNode: Pointer<ANITILE>;
  let sGridNo: INT16;
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
  let usMissTileIndex: UINT16;
  let usMissTileType: UINT16;
  let pStructure: Pointer<STRUCTURE> = null;
  let uiMissVolume: UINT32 = MIDVOLUME;
  let fHitSameStructureAsBefore: boolean;
  let pBullet: Pointer<BULLET>;
  let pAttacker: Pointer<SOLDIERTYPE>;

  pBullet = GetBulletPtr(iBullet);

  if (fStopped && ubAttackerID != NOBODY) {
    pAttacker = MercPtrs[ubAttackerID];

    if (pAttacker.value.ubOppNum != NOBODY) {
      // if it was another team shooting at someone under our control
      if ((pAttacker.value.bTeam != Menptr[pAttacker.value.ubOppNum].bTeam)) {
        // if OPPONENT is under our control
        if (Menptr[pAttacker.value.ubOppNum].bTeam == gbPlayerNum) {
          // AGILITY GAIN: Opponent "dodged" a bullet shot at him (it missed)
          StatChange(MercPtrs[pAttacker.value.ubOppNum], AGILAMT, 5, FROM_FAILURE);
        }
      }
    }
  }

  if (pBullet) {
    fHitSameStructureAsBefore = (usStructureID == pBullet.value.usLastStructureHit);
  } else {
    // WTF?
    fHitSameStructureAsBefore = false;
  }

  sGridNo = MAPROWCOLTOPOS((sYPos / CELL_Y_SIZE), (sXPos / CELL_X_SIZE));
  if (!fHitSameStructureAsBefore) {
    if (sZPos > WALL_HEIGHT) {
      MakeNoise(ubAttackerID, sGridNo, 1, gpWorldLevelData[sGridNo].ubTerrainID, Weapon[usWeaponIndex].ubHitVolume, Enum236.NOISE_BULLET_IMPACT);
    } else {
      MakeNoise(ubAttackerID, sGridNo, 0, gpWorldLevelData[sGridNo].ubTerrainID, Weapon[usWeaponIndex].ubHitVolume, Enum236.NOISE_BULLET_IMPACT);
    }
  }

  if (fStopped) {
    if (usWeaponIndex == Enum225.ROCKET_LAUNCHER) {
      RemoveBullet(iBullet);

      // Reduce attacker count!
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - end of LAW fire"));
      FreeUpAttacker(ubAttackerID);

      IgniteExplosion(ubAttackerID, CenterX(sGridNo), CenterY(sGridNo), 0, sGridNo, Enum225.C1, (sZPos >= WALL_HEIGHT));
      // FreeUpAttacker( (UINT8) ubAttackerID );

      return;
    }

    if (usWeaponIndex == Enum225.TANK_CANNON) {
      RemoveBullet(iBullet);

      // Reduce attacker count!
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - end of TANK fire"));
      FreeUpAttacker(ubAttackerID);

      IgniteExplosion(ubAttackerID, CenterX(sGridNo), CenterY(sGridNo), 0, sGridNo, Enum225.TANK_SHELL, (sZPos >= WALL_HEIGHT));
      // FreeUpAttacker( (UINT8) ubAttackerID );

      return;
    }
  }

  // Get Structure pointer and damage it!
  if (usStructureID != INVALID_STRUCTURE_ID) {
    pStructure = FindStructureByID(sGridNo, usStructureID);

    DamageStructure(pStructure, iImpact, STRUCTURE_DAMAGE_GUNFIRE, sGridNo, sXPos, sYPos, ubAttackerID);
  }

  switch (Weapon[usWeaponIndex].ubWeaponClass) {
    case Enum282.HANDGUNCLASS:
    case Enum282.RIFLECLASS:
    case Enum282.SHOTGUNCLASS:
    case Enum282.SMGCLASS:
    case Enum282.MGCLASS:

      // Guy has missed, play random sound
      if (MercPtrs[ubAttackerID].value.bTeam == gbPlayerNum) {
        if (!MercPtrs[ubAttackerID].value.bDoBurst) {
          if (Random(40) == 0) {
            DoMercBattleSound(MercPtrs[ubAttackerID], Enum259.BATTLE_SOUND_CURSE1);
          }
        }
      }
      // fDoMissForGun = TRUE;
      // break;
      fDoMissForGun = true;
      break;

    case Enum282.MONSTERCLASS:

      DoSpecialEffectAmmoMiss(ubAttackerID, sGridNo, sXPos, sYPos, sZPos, false, true, iBullet);

      RemoveBullet(iBullet);
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - monster attack hit structure"));
      FreeUpAttacker(ubAttackerID);

      // PlayJA2Sample( SPIT_RICOCHET , RATE_11025, uiMissVolume, 1, SoundDir( sGridNo ) );
      break;

    case Enum282.KNIFECLASS:

      // When it hits the ground, leave on map...
      if (Item[usWeaponIndex].usItemClass == IC_THROWING_KNIFE) {
        let Object: OBJECTTYPE;

        // OK, have we hit ground?
        if (usStructureID == INVALID_STRUCTURE_ID) {
          // Add item
          CreateItem(Enum225.THROWING_KNIFE, bWeaponStatus, addressof(Object));

          AddItemToPool(sGridNo, addressof(Object), -1, 0, 0, -1);

          // Make team look for items
          NotifySoldiersToLookforItems();
        }

        if (!fHitSameStructureAsBefore) {
          PlayJA2Sample(Enum330.MISS_KNIFE, RATE_11025, uiMissVolume, 1, SoundDir(sGridNo));
        }

        RemoveBullet(iBullet);
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - knife attack hit structure"));
        FreeUpAttacker(ubAttackerID);
      }
  }

  if (fDoMissForGun) {
    // OK, are we a shotgun, if so , make sounds lower...
    if (Weapon[usWeaponIndex].ubWeaponClass == Enum282.SHOTGUNCLASS) {
      uiMissVolume = LOWVOLUME;
    }

    // Free guy!
    // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - bullet hit structure") );
    // FreeUpAttacker( (UINT8) ubAttackerID );

    // PLAY SOUND AND FLING DEBRIS
    // RANDOMIZE SOUND SYSTEM

    // IF WE HIT THE GROUND

    if (fHitSameStructureAsBefore) {
      if (fStopped) {
        RemoveBullet(iBullet);
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - bullet hit same structure twice"));
        FreeUpAttacker(ubAttackerID);
      }
    } else {
      if (!fStopped || !DoSpecialEffectAmmoMiss(ubAttackerID, sGridNo, sXPos, sYPos, sZPos, false, true, iBullet)) {
        if (sZPos == 0) {
          PlayJA2Sample(Enum330.MISS_G2, RATE_11025, uiMissVolume, 1, SoundDir(sGridNo));
        } else {
          PlayJA2Sample(Enum330.MISS_1 + Random(8), RATE_11025, uiMissVolume, 1, SoundDir(sGridNo));
        }

        // Default hit is the ground
        usMissTileIndex = Enum312.FIRSTMISS1;
        usMissTileType = Enum313.FIRSTMISS;

        // Check if we are in water...
        if (gpWorldLevelData[sGridNo].ubTerrainID == Enum315.LOW_WATER || gpWorldLevelData[sGridNo].ubTerrainID == Enum315.DEEP_WATER) {
          usMissTileIndex = Enum312.SECONDMISS1;
          usMissTileType = Enum313.SECONDMISS;

          // Add ripple
          memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
          AniParams.sGridNo = sGridNo;
          AniParams.ubLevelID = ANI_STRUCT_LEVEL;
          AniParams.usTileType = Enum313.THIRDMISS;
          AniParams.usTileIndex = Enum312.THIRDMISS1;
          AniParams.sDelay = 50;
          AniParams.sStartFrame = 0;
          AniParams.uiFlags = ANITILE_FORWARD;

          pNode = CreateAnimationTile(addressof(AniParams));

          // Adjust for absolute positioning
          pNode.value.pLevelNode.value.uiFlags |= LEVELNODE_USEABSOLUTEPOS;
          pNode.value.pLevelNode.value.sRelativeX = sXPos;
          pNode.value.pLevelNode.value.sRelativeY = sYPos;
          pNode.value.pLevelNode.value.sRelativeZ = sZPos;
        }

        memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
        AniParams.sGridNo = sGridNo;
        AniParams.ubLevelID = ANI_STRUCT_LEVEL;
        AniParams.usTileType = usMissTileType;
        AniParams.usTileIndex = usMissTileIndex;
        AniParams.sDelay = 80;
        AniParams.sStartFrame = 0;
        if (fStopped) {
          AniParams.uiFlags = ANITILE_FORWARD | ANITILE_RELEASE_ATTACKER_WHEN_DONE;
        } else {
          AniParams.uiFlags = ANITILE_FORWARD;
        }
        // Save bullet ID!
        AniParams.uiUserData3 = iBullet;

        pNode = CreateAnimationTile(addressof(AniParams));

        // Set attacker ID
        pNode.value.usMissAnimationPlayed = usMissTileType;
        pNode.value.ubAttackerMissed = ubAttackerID;
        // Adjust for absolute positioning
        pNode.value.pLevelNode.value.uiFlags |= LEVELNODE_USEABSOLUTEPOS;
        pNode.value.pLevelNode.value.sRelativeX = sXPos;
        pNode.value.pLevelNode.value.sRelativeY = sYPos;
        pNode.value.pLevelNode.value.sRelativeZ = sZPos;

        // ATE: Show misses...( if our team )
        if (gGameSettings.fOptions[Enum8.TOPTION_SHOW_MISSES]) {
          if (ubAttackerID != NOBODY) {
            if (MercPtrs[ubAttackerID].value.bTeam == gbPlayerNum) {
              LocateGridNo(sGridNo);
            }
          }
        }
      }

      pBullet.value.usLastStructureHit = usStructureID;
    }
  }
}

export function WindowHit(sGridNo: INT16, usStructureID: UINT16, fBlowWindowSouth: boolean, fLargeForce: boolean): void {
  let pWallAndWindow: Pointer<STRUCTURE>;
  let pWallAndWindowInDB: Pointer<DB_STRUCTURE>;
  let sShatterGridNo: INT16;
  let usTileIndex: UINT16;
  let pNode: Pointer<ANITILE>;
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();

  // ATE: Make large force always for now ( feel thing )
  fLargeForce = true;

  // we have to do two things here: swap the window structure
  // (right now just using the partner stuff in a chain from
  // intact to cracked to shattered) and display the
  // animation if we've reached shattered

  // find the wall structure, and go one length along the chain
  pWallAndWindow = FindStructureByID(sGridNo, usStructureID);
  if (pWallAndWindow == null) {
    return;
  }

  pWallAndWindow = SwapStructureForPartner(sGridNo, pWallAndWindow);
  if (pWallAndWindow == null) {
    return;
  }

  // record window smash
  AddWindowHitToMapTempFile(sGridNo);

  pWallAndWindowInDB = pWallAndWindow.value.pDBStructureRef.value.pDBStructure;

  if (fLargeForce) {
    // Force to destruction animation!
    if (pWallAndWindowInDB.value.bPartnerDelta != NO_PARTNER_STRUCTURE) {
      pWallAndWindow = SwapStructureForPartner(sGridNo, pWallAndWindow);
      if (pWallAndWindow) {
        // record 2nd window smash
        AddWindowHitToMapTempFile(sGridNo);

        pWallAndWindowInDB = pWallAndWindow.value.pDBStructureRef.value.pDBStructure;
      }
    }
  }

  SetRenderFlags(RENDER_FLAG_FULL);

  if (pWallAndWindowInDB.value.ubArmour == Enum309.MATERIAL_THICKER_METAL_WITH_SCREEN_WINDOWS) {
    // don't play any sort of animation or sound
    return;
  }

  if (pWallAndWindowInDB.value.bPartnerDelta != NO_PARTNER_STRUCTURE) {
    // just cracked; don't display the animation
    MakeNoise(NOBODY, sGridNo, 0, gpWorldLevelData[sGridNo].ubTerrainID, WINDOW_CRACK_VOLUME, Enum236.NOISE_BULLET_IMPACT);
    return;
  }
  MakeNoise(NOBODY, sGridNo, 0, gpWorldLevelData[sGridNo].ubTerrainID, WINDOW_SMASH_VOLUME, Enum236.NOISE_BULLET_IMPACT);
  if (pWallAndWindowInDB.value.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT || pWallAndWindowInDB.value.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
    /*
            sShatterGridNo = sGridNo + 1;
            // check for wrapping around edge of map
            if (sShatterGridNo % WORLD_COLS == 0)
            {
                    // in which case we don't play the animation!
                    return;
            }*/
    if (fBlowWindowSouth) {
      usTileIndex = Enum312.WINDOWSHATTER1;
      sShatterGridNo = sGridNo + 1;
    } else {
      usTileIndex = Enum312.WINDOWSHATTER11;
      sShatterGridNo = sGridNo;
    }
  } else {
    /*
            sShatterGridNo = sGridNo + WORLD_COLS;
            // check for wrapping around edge of map
            if (sShatterGridNo % WORLD_ROWS == 0)
            {
                    // in which case we don't play the animation!
                    return;
            }*/
    if (fBlowWindowSouth) {
      usTileIndex = Enum312.WINDOWSHATTER6;
      sShatterGridNo = sGridNo + WORLD_COLS;
    } else {
      usTileIndex = Enum312.WINDOWSHATTER16;
      sShatterGridNo = sGridNo;
    }
  }

  memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
  AniParams.sGridNo = sShatterGridNo;
  AniParams.ubLevelID = ANI_STRUCT_LEVEL;
  AniParams.usTileType = Enum313.WINDOWSHATTER;
  AniParams.usTileIndex = usTileIndex;
  AniParams.sDelay = 50;
  AniParams.sStartFrame = 0;
  AniParams.uiFlags = ANITILE_FORWARD;

  pNode = CreateAnimationTile(addressof(AniParams));

  PlayJA2Sample(Enum330.GLASS_SHATTER1 + Random(2), RATE_11025, MIDVOLUME, 1, SoundDir(sGridNo));
}

export function InRange(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): boolean {
  let sRange: INT16;
  let usInHand: UINT16;

  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  if (Item[usInHand].usItemClass == IC_GUN || Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
    // Determine range
    sRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sGridNo);

    if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
      // NB CalcMaxTossRange returns range in tiles, not in world units
      if (sRange <= CalcMaxTossRange(pSoldier, Enum225.THROWING_KNIFE, true) * CELL_X_SIZE) {
        return true;
      }
    } else {
      // For given weapon, check range
      if (sRange <= GunRange(addressof(pSoldier.value.inv[Enum261.HANDPOS]))) {
        return true;
      }
    }
  }
  return false;
}

export function CalcChanceToHitGun(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, ubAimTime: UINT8, ubAimPos: UINT8): UINT32 {
  // SOLDIERTYPE *vicpSoldier;
  let pTarget: Pointer<SOLDIERTYPE>;
  let iChance: INT32;
  let iRange: INT32;
  let iSightRange: INT32;
  let iMaxRange: INT32;
  let iScopeBonus: INT32;
  let iBonus: INT32; //, minRange;
  let iGunCondition: INT32;
  let iMarksmanship: INT32;
  let iPenalty: INT32;
  let usInHand: UINT16;
  let pInHand: Pointer<OBJECTTYPE>;
  let bAttachPos: INT8;
  let bBandaged: INT8;
  let sDistVis: INT16;
  let ubAdjAimPos: UINT8;
  let ubTargetID: UINT8;

  if (pSoldier.value.bMarksmanship == 0) {
    // always min chance
    return MINCHANCETOHIT;
  }

  // make sure the guy's actually got a weapon in his hand!
  pInHand = addressof(pSoldier.value.inv[pSoldier.value.ubAttackingHand]);
  usInHand = pSoldier.value.usAttackingWeapon;

  // DETERMINE BASE CHANCE OF HITTING
  iGunCondition = WEAPON_STATUS_MOD(pInHand.value.bGunStatus);

  if (usInHand == Enum225.ROCKET_LAUNCHER) {
    // use the same calculation as for mechanical thrown weapons
    iMarksmanship = (EffectiveDexterity(pSoldier) + EffectiveMarksmanship(pSoldier) + EffectiveWisdom(pSoldier) + (10 * EffectiveExpLevel(pSoldier))) / 4;
    // heavy weapons trait helps out
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.HEAVY_WEAPS)) {
      iMarksmanship += gbSkillTraitBonus[Enum269.HEAVY_WEAPS] * NUM_SKILL_TRAITS(pSoldier, Enum269.HEAVY_WEAPS);
    }
  } else {
    iMarksmanship = EffectiveMarksmanship(pSoldier);

    if (AM_A_ROBOT(pSoldier)) {
      let pSoldier2: Pointer<SOLDIERTYPE>;

      pSoldier2 = GetRobotController(pSoldier);
      if (pSoldier2) {
        iMarksmanship = Math.max(iMarksmanship, EffectiveMarksmanship(pSoldier2));
      }
    }
  }

  // modify chance to hit by morale
  iMarksmanship += GetMoraleModifier(pSoldier);

  // penalize marksmanship for fatigue
  iMarksmanship -= GetSkillCheckPenaltyForFatigue(pSoldier, iMarksmanship);

  if (iGunCondition >= iMarksmanship)
    // base chance is equal to the shooter's marksmanship skill
    iChance = iMarksmanship;
  else
    // base chance is equal to the average of marksmanship & gun's condition!
    iChance = (iMarksmanship + iGunCondition) / 2;

  // if shooting same target as the last shot
  if (sGridNo == pSoldier.value.sLastTarget)
    iChance += AIM_BONUS_SAME_TARGET; // give a bonus to hit

  if (pSoldier.value.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.value.ubProfile].bPersonalityTrait == Enum270.PSYCHO) {
    iChance += AIM_BONUS_PSYCHO;
  }

  // calculate actual range (in units, 10 units = 1 tile)
  iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sGridNo);

  // if shooter is crouched, he aims slightly better (to max of AIM_BONUS_CROUCHING)
  if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_CROUCH) {
    iBonus = iRange / 10;
    if (iBonus > AIM_BONUS_CROUCHING) {
      iBonus = AIM_BONUS_CROUCHING;
    }
    iChance += iBonus;
  }
  // if shooter is prone, he aims even better, except at really close range
  else if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_PRONE) {
    if (iRange > MIN_PRONE_RANGE) {
      iBonus = iRange / 10;
      if (iBonus > AIM_BONUS_PRONE) {
        iBonus = AIM_BONUS_PRONE;
      }
      bAttachPos = FindAttachment(pInHand, Enum225.BIPOD);
      if (bAttachPos != ITEM_NOT_FOUND) {
        // extra bonus to hit for a bipod, up to half the prone bonus itself
        iBonus += (iBonus * WEAPON_STATUS_MOD(pInHand.value.bAttachStatus[bAttachPos]) / 100) / 2;
      }
      iChance += iBonus;
    }
  }

  if (!(Item[usInHand].fFlags & ITEM_TWO_HANDED)) {
    // SMGs are treated as pistols for these purpose except there is a -5 penalty;
    if (Weapon[usInHand].ubWeaponClass == Enum282.SMGCLASS) {
      iChance -= AIM_PENALTY_SMG;
    }

    /*
    if (pSoldier->inv[SECONDHANDPOS].usItem == NOTHING)
    {
            // firing with pistol in right hand, and second hand empty.
            iChance += AIM_BONUS_TWO_HANDED_PISTOL;
    }
    else */
    if (!HAS_SKILL_TRAIT(pSoldier, Enum269.AMBIDEXT)) {
      if (IsValidSecondHandShot(pSoldier)) {
        // penalty to aim when firing two pistols
        iChance -= AIM_PENALTY_DUAL_PISTOLS;
      }
      /*
      else
      {
              // penalty to aim with pistol being fired one-handed
              iChance -= AIM_PENALTY_ONE_HANDED_PISTOL;
      }
      */
    }
  }

  // If in burst mode, deduct points for change to hit for each shot after the first
  if (pSoldier.value.bDoBurst) {
    iPenalty = Weapon[usInHand].ubBurstPenalty * (pSoldier.value.bDoBurst - 1);

    // halve the penalty for people with the autofire trait
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.AUTO_WEAPS)) {
      iPenalty /= 2 * NUM_SKILL_TRAITS(pSoldier, Enum269.AUTO_WEAPS);
    }
    iChance -= iPenalty;
  }

  sDistVis = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, 0);

  // give some leeway to allow people to spot for each other...
  // use distance limitation for LOS routine of 2 x maximum distance EVER visible, so that we get accurate
  // calculations out to around 50 tiles.  Because we multiply max distance by 2, we must divide by 2 later

  // CJC August 13 2002:  Wow, this has been wrong the whole time.  bTargetCubeLevel seems to be generally set to 2 -
  // but if a character is shooting at an enemy in a particular spot, then we should be using the target position on the body.

  // CJC August 13, 2002
  // If the start soldier has a body part they are aiming at, and know about the person in the tile, then use that height instead
  iSightRange = -1;

  ubTargetID = WhoIsThere2(sGridNo, pSoldier.value.bTargetLevel);
  // best to use team knowledge as well, in case of spotting for someone else
  if (ubTargetID != NOBODY && pSoldier.value.bOppList[ubTargetID] == SEEN_CURRENTLY || gbPublicOpplist[pSoldier.value.bTeam][ubTargetID] == SEEN_CURRENTLY) {
    iSightRange = SoldierToBodyPartLineOfSightTest(pSoldier, sGridNo, pSoldier.value.bTargetLevel, pSoldier.value.bAimShotLocation, (MaxDistanceVisible() * 2), true);
  }

  if (iSightRange == -1) // didn't do a bodypart-based test
  {
    iSightRange = SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, pSoldier.value.bTargetLevel, pSoldier.value.bTargetCubeLevel, (MaxDistanceVisible() * 2), true);
  }

  iSightRange *= 2;

  if (iSightRange > (sDistVis * CELL_X_SIZE)) {
    // shooting beyond max normal vision... penalize such distance at double (also later we halve the remaining chance)
    iSightRange += (iSightRange - sDistVis * CELL_X_SIZE);
  }

  // if shooter spent some extra time aiming and can see the target
  if (iSightRange > 0 && ubAimTime && !pSoldier.value.bDoBurst)
    iChance += (AIM_BONUS_PER_AP * ubAimTime); // bonus for every pt of aiming

  if (!(pSoldier.value.uiStatusFlags & SOLDIER_PC)) // if this is a computer AI controlled enemy
  {
    if (gGameOptions.ubDifficultyLevel == Enum9.DIF_LEVEL_EASY) {
      // On easy, penalize all enemies by 5%
      iChance -= 5;
    } else {
      // max with 0 to prevent this being a bonus, for JA2 it's just a penalty to make early enemies easy
      // CJC note: IDIOT!  This should have been a min.  It's kind of too late now...
      // CJC 2002-05-17: changed the max to a min to make this work.
      iChance += Math.min(0, gbDiff[DIFF_ENEMY_TO_HIT_MOD][SoldierDifficultyLevel(pSoldier)]);
    }
  }

  // if shooter is being affected by gas
  if (pSoldier.value.uiStatusFlags & SOLDIER_GASSED) {
    iChance -= AIM_PENALTY_GASSED;
  }

  // if shooter is being bandaged at the same time, his concentration is off
  if (pSoldier.value.ubServiceCount > 0)
    iChance -= AIM_PENALTY_GETTINGAID;

  // if shooter is still in shock
  if (pSoldier.value.bShock)
    iChance -= (pSoldier.value.bShock * AIM_PENALTY_PER_SHOCK);

  if (Item[usInHand].usItemClass == IC_GUN) {
    bAttachPos = FindAttachment(pInHand, Enum225.GUN_BARREL_EXTENDER);
    if (bAttachPos != ITEM_NOT_FOUND) {
      // reduce status and see if it falls off
      pInHand.value.bAttachStatus[bAttachPos] -= Random(2);

      if (pInHand.value.bAttachStatus[bAttachPos] - Random(35) - Random(35) < USABLE) {
        // barrel extender falls off!
        let Temp: OBJECTTYPE;

        // since barrel extenders are not removable we cannot call RemoveAttachment here
        // and must create the item by hand
        CreateItem(Enum225.GUN_BARREL_EXTENDER, pInHand.value.bAttachStatus[bAttachPos], addressof(Temp));
        pInHand.value.usAttachItem[bAttachPos] = NOTHING;
        pInHand.value.bAttachStatus[bAttachPos] = 0;

        // drop it to ground
        AddItemToPool(pSoldier.value.sGridNo, addressof(Temp), 1, pSoldier.value.bLevel, 0, -1);

        // big penalty to hit
        iChance -= 30;

        // curse!
        if (pSoldier.value.bTeam == OUR_TEAM) {
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);

          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[46], pSoldier.value.name);
        }
      }
    }

    iMaxRange = GunRange(pInHand);
  } else {
    iMaxRange = CELL_X_SIZE; // one tile
  }

  if (iSightRange > 0) {
    if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.SUNGOGGLES || pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.SUNGOGGLES) {
      // decrease effective range by 10% when using sungoggles (w or w/o scope)
      iSightRange -= iRange / 10; // basically, +1% to hit per every 2 squares
    }

    bAttachPos = FindAttachment(pInHand, Enum225.SNIPERSCOPE);

    // does gun have scope, long range recommends its use, and shooter's aiming?
    if (bAttachPos != NO_SLOT && (iRange > MIN_SCOPE_RANGE) && (ubAimTime > 0)) {
      // reduce effective sight range by 20% per extra aiming time AP of the distance
      // beyond MIN_SCOPE_RANGE.  Max reduction is 80% of the range beyond.
      iScopeBonus = ((SNIPERSCOPE_AIM_BONUS * ubAimTime) * (iRange - MIN_SCOPE_RANGE)) / 100;

      // adjust for scope condition, only has full affect at 100%
      iScopeBonus = (iScopeBonus * WEAPON_STATUS_MOD(pInHand.value.bAttachStatus[bAttachPos])) / 100;

      // reduce effective range by the bonus obtained from the scope
      iSightRange -= iScopeBonus;
      if (iSightRange < 1) {
        iSightRange = 1;
      }
    }

    bAttachPos = FindAttachment(pInHand, Enum225.LASERSCOPE);
    if (usInHand == Enum225.ROCKET_RIFLE || usInHand == Enum225.AUTO_ROCKET_RIFLE || bAttachPos != NO_SLOT) // rocket rifle has one built in
    {
      let bLaserStatus: INT8;

      if (usInHand == Enum225.ROCKET_RIFLE || usInHand == Enum225.AUTO_ROCKET_RIFLE) {
        bLaserStatus = WEAPON_STATUS_MOD(pInHand.value.bGunStatus);
      } else {
        bLaserStatus = WEAPON_STATUS_MOD(pInHand.value.bAttachStatus[bAttachPos]);
      }

      // laser scope isn't of much use in high light levels; add something for that
      if (bLaserStatus > 50) {
        iScopeBonus = LASERSCOPE_BONUS * (bLaserStatus - 50) / 50;
      } else {
        // laser scope in bad condition creates aim penalty!
        iScopeBonus = -LASERSCOPE_BONUS * (50 - bLaserStatus) / 50;
      }

      iChance += iScopeBonus;
    }
  }

  // if aiming at the head, reduce chance to hit
  if (ubAimPos == AIM_SHOT_HEAD) {
    // penalty of 3% per tile
    iPenalty = 3 * iSightRange / 10;
    iChance -= iPenalty;
  } else if (ubAimPos == AIM_SHOT_LEGS) {
    // penalty of 1% per tile
    iPenalty = iSightRange / 10;
    iChance -= iPenalty;
  }

  // NumMessage("EFFECTIVE RANGE = ",range);

  // ADJUST FOR RANGE
  // bonus if range is less than normal range, penalty if it's more
  // iChance += (NORMAL_RANGE - iRange) / (CELL_X_SIZE / 5);	// 5% per tile

  // Effects of actual gun max range... the numbers are based on wanting -40%
  // at range 26for a pistol with range 13, and -0 for a sniper rifle with range 80
  iPenalty = ((iMaxRange - iRange * 3) * 10) / (17 * CELL_X_SIZE);
  if (iPenalty < 0) {
    iChance += iPenalty;
  }
  // iChance -= 20 * iRange / iMaxRange;

  if (TANK(pSoldier) && (iRange / CELL_X_SIZE < MaxDistanceVisible())) {
    // tank; penalize at close range!
    // 2 percent per tile closer than max visible distance
    iChance -= 2 * (MaxDistanceVisible() - (iRange / CELL_X_SIZE));
  }

  if (iSightRange == 0) {
    // firing blind!
    iChance -= AIM_PENALTY_BLIND;
  } else {
    // Effects based on aiming & sight
    // From for JA2.5:  3% bonus/penalty for each tile different from range NORMAL_RANGE.
    // This doesn't provide a bigger bonus at close range, but stretches it out, making medium
    // range less penalized, and longer range more penalized
    iChance += 3 * (NORMAL_RANGE - iSightRange) / CELL_X_SIZE;
    /*
    if (iSightRange < NORMAL_RANGE)
    {
            // bonus to hit of 20% at point blank (would be 25% at range 0);
            //at NORMAL_RANGE, bonus is 0
            iChance += 25 * (NORMAL_RANGE - iSightRange) / NORMAL_RANGE;
    }
    else
    {
            // penalty of 2% / tile
            iChance -= (iSightRange - NORMAL_RANGE) / 5;
    }
    */
  }

  // adjust for roof/not on roof
  if (pSoldier.value.bLevel == 0) {
    if (pSoldier.value.bTargetLevel > 0) {
      // penalty for firing up
      iChance -= AIM_PENALTY_FIRING_UP;
    }
  } else // pSoldier->bLevel > 0 )
  {
    if (pSoldier.value.bTargetLevel == 0) {
      iChance += AIM_BONUS_FIRING_DOWN;
    }
    // if have roof trait, give bonus
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.ONROOF)) {
      iChance += gbSkillTraitBonus[Enum269.ONROOF] * NUM_SKILL_TRAITS(pSoldier, Enum269.ONROOF);
    }
  }

  pTarget = SimpleFindSoldier(sGridNo, pSoldier.value.bTargetLevel);
  if (pTarget != null) {
    // targeting a merc
    // adjust for crouched/prone target
    switch (gAnimControl[pTarget.value.usAnimState].ubHeight) {
      case ANIM_CROUCH:
        if (TANK(pSoldier) && iRange < MIN_TANK_RANGE) {
          // 13% penalty per tile closer than min range
          iChance -= 13 * ((MIN_TANK_RANGE - iRange) / CELL_X_SIZE);
        } else {
          // at anything other than point-blank range
          if (iRange > POINT_BLANK_RANGE + 10 * (AIM_PENALTY_TARGET_CROUCHED / 3)) {
            iChance -= AIM_PENALTY_TARGET_CROUCHED;
          } else if (iRange > POINT_BLANK_RANGE) {
            // at close range give same bonus as prone, up to maximum of AIM_PENALTY_TARGET_CROUCHED
            iChance -= 3 * ((iRange - POINT_BLANK_RANGE) / CELL_X_SIZE); // penalty -3%/tile
          }
        }
        break;
      case ANIM_PRONE:
        if (TANK(pSoldier) && iRange < MIN_TANK_RANGE) {
          // 25% penalty per tile closer than min range
          iChance -= 25 * ((MIN_TANK_RANGE - iRange) / CELL_X_SIZE);
        } else {
          // at anything other than point-blank range
          if (iRange > POINT_BLANK_RANGE) {
            // reduce chance to hit with distance to the prone/immersed target
            iPenalty = 3 * ((iRange - POINT_BLANK_RANGE) / CELL_X_SIZE); // penalty -3%/tile
            iPenalty = Math.min(iPenalty, AIM_PENALTY_TARGET_PRONE);

            iChance -= iPenalty;
          }
        }
        break;
      case ANIM_STAND:
        // if we are prone and at close range, then penalize shots to the torso or head!
        if (iRange <= MIN_PRONE_RANGE && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_PRONE) {
          if (ubAimPos == AIM_SHOT_RANDOM || ubAimPos == AIM_SHOT_GLAND) {
            ubAdjAimPos = AIM_SHOT_TORSO;
          } else {
            ubAdjAimPos = ubAimPos;
          }
          // lose 10% per height difference, lessened by distance
          // e.g. 30% to aim at head at range 1, only 10% at range 3
          // or 20% to aim at torso at range 1, no penalty at range 3
          // NB torso aim position is 2, so (5-aimpos) is 3, for legs it's 2, for head 4
          iChance -= (5 - ubAdjAimPos - iRange / CELL_X_SIZE) * 10;
        }
        break;
      default:
        break;
    }

    // penalty for amount that enemy has moved
    iPenalty = Math.min(((pTarget.value.bTilesMoved * 3) / 2), 30);
    iChance -= iPenalty;

    // if target sees us, he may have a chance to dodge before the gun goes off
    // but ability to dodge is reduced if crouched or prone!
    if (pTarget.value.bOppList[pSoldier.value.ubID] == SEEN_CURRENTLY && !TANK(pTarget) && !(pSoldier.value.ubBodyType != Enum194.QUEENMONSTER)) {
      iPenalty = (EffectiveAgility(pTarget) / 5 + EffectiveExpLevel(pTarget) * 2);
      switch (gAnimControl[pTarget.value.usAnimState].ubHeight) {
        case ANIM_CROUCH:
          iPenalty = iPenalty * 2 / 3;
          break;
        case ANIM_PRONE:
          iPenalty /= 3;
          break;
      }

      // reduce dodge ability by the attacker's stats
      iBonus = (EffectiveDexterity(pSoldier) / 5 + EffectiveExpLevel(pSoldier) * 2);
      if (TANK(pTarget) || (pSoldier.value.ubBodyType != Enum194.QUEENMONSTER)) {
        // reduce ability to track shots
        iBonus = iBonus / 2;
      }

      if (iPenalty > iBonus) {
        iChance -= (iPenalty - iBonus);
      }
    }
  } else if (TANK(pSoldier) && iRange < MIN_TANK_RANGE) {
    // 25% penalty per tile closer than min range
    iChance -= 25 * ((MIN_TANK_RANGE - iRange) / CELL_X_SIZE);
  }

  // IF CHANCE EXISTS, BUT SHOOTER IS INJURED
  if ((iChance > 0) && (pSoldier.value.bLife < pSoldier.value.bLifeMax)) {
    // if bandaged, give 1/2 of the bandaged life points back into equation
    bBandaged = pSoldier.value.bLifeMax - pSoldier.value.bLife - pSoldier.value.bBleeding;

    // injury penalty is based on % damage taken (max 2/3rds chance)
    iPenalty = (iChance * 2 * (pSoldier.value.bLifeMax - pSoldier.value.bLife + (bBandaged / 2))) / (3 * pSoldier.value.bLifeMax);

    // reduce injury penalty due to merc's experience level (he can take it!)
    iChance -= (iPenalty * (100 - (10 * (EffectiveExpLevel(pSoldier) - 1)))) / 100;
  }

  // IF CHANCE EXISTS, BUT SHOOTER IS LOW ON BREATH
  if ((iChance > 0) && (pSoldier.value.bBreath < 100)) {
    // breath penalty is based on % breath missing (max 1/2 chance)
    iPenalty = (iChance * (100 - pSoldier.value.bBreath)) / 200;
    // reduce breath penalty due to merc's dexterity (he can compensate!)
    iChance -= (iPenalty * (100 - (EffectiveDexterity(pSoldier) - 10))) / 100;
  }

  // CHECK IF TARGET IS WITHIN GUN'S EFFECTIVE MAXIMUM RANGE
  //#ifdef JA2DEMO
  if (iRange > iMaxRange) {
    // a bullet WILL travel that far if not blocked, but it's NOT accurate,
    // because beyond maximum range, the bullet drops rapidly

    // This won't cause the bullet to be off to the left or right, only make it
    // drop in flight.
    iChance /= 2;
  }
  //#endif
  if (iSightRange > (sDistVis * CELL_X_SIZE)) {
    // penalize out of sight shots, cumulative to effective range penalty
    iChance /= 2;
  }

  // MAKE SURE CHANCE TO HIT IS WITHIN DEFINED LIMITS
  if (iChance < MINCHANCETOHIT) {
    if (TANK(pSoldier)) {
      // allow absolute minimums
      iChance = 0;
    } else {
      iChance = MINCHANCETOHIT;
    }
  } else {
    if (iChance > MAXCHANCETOHIT)
      iChance = MAXCHANCETOHIT;
  }

  //  NumMessage("ChanceToHit = ",chance);
  return iChance;
}

export function AICalcChanceToHitGun(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, ubAimTime: UINT8, ubAimPos: UINT8): UINT32 {
  let usTrueState: UINT16;
  let uiChance: UINT32;

  // same as CCTHG but fakes the attacker always standing
  usTrueState = pSoldier.value.usAnimState;
  pSoldier.value.usAnimState = Enum193.STANDING;
  uiChance = CalcChanceToHitGun(pSoldier, sGridNo, ubAimTime, ubAimPos);
  pSoldier.value.usAnimState = usTrueState;
  return uiChance;
}

export function CalcBodyImpactReduction(ubAmmoType: UINT8, ubHitLocation: UINT8): INT32 {
  // calculate how much bullets are slowed by passing through someone
  let iReduction: INT32 = BodyImpactReduction[ubHitLocation];

  switch (ubAmmoType) {
    case Enum286.AMMO_HP:
      iReduction = AMMO_ARMOUR_ADJUSTMENT_HP(iReduction);
      break;
    case Enum286.AMMO_AP:
    case Enum286.AMMO_HEAT:
      iReduction = AMMO_ARMOUR_ADJUSTMENT_AP(iReduction);
      break;
    case Enum286.AMMO_SUPER_AP:
      iReduction = AMMO_ARMOUR_ADJUSTMENT_SAP(iReduction);
      break;
    default:
      break;
  }
  return iReduction;
}

function ArmourProtection(pTarget: Pointer<SOLDIERTYPE>, ubArmourType: UINT8, pbStatus: Pointer<INT8>, iImpact: INT32, ubAmmoType: UINT8): INT32 {
  let iProtection: INT32;
  let iAppliedProtection: INT32;
  let iFailure: INT32;

  iProtection = Armour[ubArmourType].ubProtection;

  if (!AM_A_ROBOT(pTarget)) {
    // check for the bullet hitting a weak spot in the armour
    iFailure = PreRandom(100) + 1 - pbStatus.value;
    if (iFailure > 0) {
      iProtection -= iFailure;
      if (iProtection < 0) {
        return 0;
      }
    }
  }

  // adjust protection of armour due to different ammo types
  switch (ubAmmoType) {
    case Enum286.AMMO_HP:
      iProtection = AMMO_ARMOUR_ADJUSTMENT_HP(iProtection);
      break;
    case Enum286.AMMO_AP:
    case Enum286.AMMO_HEAT:
      iProtection = AMMO_ARMOUR_ADJUSTMENT_AP(iProtection);
      break;
    case Enum286.AMMO_SUPER_AP:
      iProtection = AMMO_ARMOUR_ADJUSTMENT_SAP(iProtection);
      break;
    default:
      break;
  }

  // figure out how much of the armour's protection value is necessary
  // in defending against this bullet
  if (iProtection > iImpact) {
    iAppliedProtection = iImpact;
  } else {
    // applied protection is the full strength of the armour, before AP/HP changes
    iAppliedProtection = Armour[ubArmourType].ubProtection;
  }

  // reduce armour condition

  if (ubAmmoType == Enum286.AMMO_KNIFE || ubAmmoType == Enum286.AMMO_SLEEP_DART) {
    // knives and darts damage armour but are not stopped by kevlar
    if (Armour[ubArmourType].ubArmourClass == Enum284.ARMOURCLASS_VEST || Armour[ubArmourType].ubArmourClass == Enum284.ARMOURCLASS_LEGGINGS) {
      iProtection = 0;
    }
  } else if (ubAmmoType == Enum286.AMMO_MONSTER) {
    // creature spit damages armour a lot! an extra 3x for a total of 4x normal
    pbStatus.value -= 3 * (iAppliedProtection * Armour[ubArmourType].ubDegradePercent) / 100;

    // reduce amount of protection from armour
    iProtection /= 2;
  }

  if (!AM_A_ROBOT(pTarget)) {
    pbStatus.value -= (iAppliedProtection * Armour[ubArmourType].ubDegradePercent) / 100;
  }

  // return armour protection
  return iProtection;
}

export function TotalArmourProtection(pFirer: Pointer<SOLDIERTYPE>, pTarget: Pointer<SOLDIERTYPE>, ubHitLocation: UINT8, iImpact: INT32, ubAmmoType: UINT8): INT32 {
  let iTotalProtection: INT32 = 0;
  let iSlot: INT32;
  let pArmour: Pointer<OBJECTTYPE>;
  let bPlatePos: INT8 = -1;

  if (pTarget.value.uiStatusFlags & SOLDIER_VEHICLE) {
    let bDummyStatus: INT8 = 100;

    // bDummyStatus = (INT8) pVehicleList[ pTarget->bVehicleID ].sExternalArmorLocationsStatus[ ubHitLocation ];

    iTotalProtection += ArmourProtection(pTarget, pVehicleList[pTarget.value.bVehicleID].sArmourType, addressof(bDummyStatus), iImpact, ubAmmoType);

    // pVehicleList[ pTarget->bVehicleID ].sExternalArmorLocationsStatus[ ubHitLocation ] = bDummyStatus;
  } else {
    switch (ubHitLocation) {
      case AIM_SHOT_GLAND:
        // creature hit in the glands!!! no armour there!
        return 0;
      case AIM_SHOT_HEAD:
        iSlot = Enum261.HELMETPOS;
        break;
      case AIM_SHOT_LEGS:
        iSlot = Enum261.LEGPOS;
        break;
      case AIM_SHOT_TORSO:
      default:
        iSlot = Enum261.VESTPOS;
        break;
    }

    pArmour = addressof(pTarget.value.inv[iSlot]);
    if (pArmour.value.usItem != NOTHING) {
      // check plates first
      if (iSlot == Enum261.VESTPOS) {
        bPlatePos = FindAttachment(pArmour, Enum225.CERAMIC_PLATES);
        if (bPlatePos != -1) {
          // bullet got through jacket; apply ceramic plate armour
          iTotalProtection += ArmourProtection(pTarget, Item[pArmour.value.usAttachItem[bPlatePos]].ubClassIndex, addressof(pArmour.value.bAttachStatus[bPlatePos]), iImpact, ubAmmoType);
          if (pArmour.value.bAttachStatus[bPlatePos] < USABLE) {
            // destroy plates!
            pArmour.value.usAttachItem[bPlatePos] = NOTHING;
            pArmour.value.bAttachStatus[bPlatePos] = 0;
            DirtyMercPanelInterface(pTarget, DIRTYLEVEL2);
// FIXME: Language-specific code
// #ifdef ENGLISH
            if (pTarget.value.bTeam == gbPlayerNum) {
              // report plates destroyed!
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[61], pTarget.value.name);
            }
// #endif
          }
        }
      }

      // if the plate didn't stop the bullet...
      if (iImpact > iTotalProtection) {
        iTotalProtection += ArmourProtection(pTarget, Item[pArmour.value.usItem].ubClassIndex, addressof(pArmour.value.bStatus[0]), iImpact, ubAmmoType);
        if (pArmour.value.bStatus[0] < USABLE) {
          DeleteObj(pArmour);
          DirtyMercPanelInterface(pTarget, DIRTYLEVEL2);
        }
      }
    }
  }
  return iTotalProtection;
}

export function BulletImpact(pFirer: Pointer<SOLDIERTYPE>, pTarget: Pointer<SOLDIERTYPE>, ubHitLocation: UINT8, iOrigImpact: INT32, sHitBy: INT16, pubSpecial: Pointer<UINT8>): INT32 {
  let iImpact: INT32;
  let iFluke: INT32;
  let iBonus: INT32;
  let iImpactForCrits: INT32 = 0;
  let bStatLoss: INT8;
  let ubAmmoType: UINT8;

  // NOTE: reduction of bullet impact due to range and obstacles is handled
  // in MoveBullet.

  // Set a few things up:
  if (Item[pFirer.value.usAttackingWeapon].usItemClass == IC_THROWING_KNIFE) {
    ubAmmoType = Enum286.AMMO_KNIFE;
  } else {
    ubAmmoType = pFirer.value.inv[pFirer.value.ubAttackingHand].ubGunAmmoType;
  }

  if (TANK(pTarget)) {
    if (ubAmmoType != Enum286.AMMO_HEAT) {
      // ping!
      return 0;
    }
  }

  // plus/minus up to 25% due to "random" factors (major organs hit or missed,
  // lucky lighter in breast pocket, divine intervention on behalf of "Rev"...)
  iFluke = PreRandom(51) - 25; // gives (0 to 50 -25) -> -25% to +25%
  // NumMessage("Fluke = ",fluke);

  // up to 50% extra impact for making particularly accurate successful shots
  iBonus = sHitBy / 2;
  // NumMessage("Bonus = ",bonus);

  iOrigImpact = iOrigImpact * (100 + iFluke + iBonus) / 100;

  // at very long ranges (1.5x maxRange and beyond) impact could go negative
  if (iOrigImpact < 1) {
    iOrigImpact = 1; // raise impact to a minimum of 1 for any hit
  }

  // adjust for HE rounds
  if (ubAmmoType == Enum286.AMMO_HE || ubAmmoType == Enum286.AMMO_HEAT) {
    iOrigImpact = AMMO_DAMAGE_ADJUSTMENT_HE(iOrigImpact);

    if (TANK(pTarget)) {
      // HEAT round on tank, divide by 3 for damage
      iOrigImpact /= 2;
    }
  }

  if (pubSpecial && pubSpecial.value == FIRE_WEAPON_BLINDED_BY_SPIT_SPECIAL) {
    iImpact = iOrigImpact;
  } else {
    iImpact = iOrigImpact - TotalArmourProtection(pFirer, pTarget, ubHitLocation, iOrigImpact, ubAmmoType);
  }

  // calc minimum damage
  if (ubAmmoType == Enum286.AMMO_HP || ubAmmoType == Enum286.AMMO_SLEEP_DART) {
    if (iImpact < 0) {
      iImpact = 0;
    }
  } else {
    if (iImpact < ((iOrigImpact + 5) / 10)) {
      iImpact = (iOrigImpact + 5) / 10;
    }

    if ((ubAmmoType == Enum286.AMMO_BUCKSHOT) && (pTarget.value.bNumPelletsHitBy > 0)) {
      iImpact += (pTarget.value.bNumPelletsHitBy - 1) / 2;
    }
  }

  if (gfNextShotKills) {
    // big time cheat key effect!
    iImpact = 100;
    gfNextShotKills = false;
  }

  if (iImpact > 0 && !TANK(pTarget)) {
    if (ubAmmoType == Enum286.AMMO_SLEEP_DART && sHitBy > 20) {
      if (pubSpecial) {
        pubSpecial.value = FIRE_WEAPON_SLEEP_DART_SPECIAL;
      }
      return iImpact;
    }

    if (ubAmmoType == Enum286.AMMO_HP) {
      // good solid hit with a hollow-point bullet, which got through armour!
      iImpact = AMMO_DAMAGE_ADJUSTMENT_HP(iImpact);
    }

    AdjustImpactByHitLocation(iImpact, ubHitLocation, addressof(iImpact), addressof(iImpactForCrits));

    switch (ubHitLocation) {
      case AIM_SHOT_HEAD:
        // is the blow deadly enough for an instant kill?
        if (PythSpacesAway(pFirer.value.sGridNo, pTarget.value.sGridNo) <= MAX_DISTANCE_FOR_MESSY_DEATH) {
          if (iImpactForCrits > MIN_DAMAGE_FOR_INSTANT_KILL && iImpactForCrits < pTarget.value.bLife) {
            // blow to the head is so deadly that it causes instant death;
            // the target has more life than iImpact so we increase it
            iImpact = pTarget.value.bLife + Random(10);
            iImpactForCrits = iImpact;
          }

          if (pubSpecial) {
            // is the blow deadly enough to cause a head explosion?
            if (iImpactForCrits >= pTarget.value.bLife) {
              if (iImpactForCrits > MIN_DAMAGE_FOR_HEAD_EXPLOSION) {
                pubSpecial.value = FIRE_WEAPON_HEAD_EXPLODE_SPECIAL;
              } else if (iImpactForCrits > (MIN_DAMAGE_FOR_HEAD_EXPLOSION / 2) && (PreRandom(MIN_DAMAGE_FOR_HEAD_EXPLOSION / 2) < (iImpactForCrits - MIN_DAMAGE_FOR_HEAD_EXPLOSION / 2))) {
                pubSpecial.value = FIRE_WEAPON_HEAD_EXPLODE_SPECIAL;
              }
            }
          }
        }
        break;
      case AIM_SHOT_LEGS:
        // is the damage enough to make us fall over?
        if (pubSpecial && IS_MERC_BODY_TYPE(pTarget) && gAnimControl[pTarget.value.usAnimState].ubEndHeight == ANIM_STAND && pTarget.value.bOverTerrainType != Enum315.LOW_WATER && pTarget.value.bOverTerrainType != Enum315.MED_WATER && pTarget.value.bOverTerrainType != Enum315.DEEP_WATER) {
          if (iImpactForCrits > MIN_DAMAGE_FOR_AUTO_FALL_OVER) {
            pubSpecial.value = FIRE_WEAPON_LEG_FALLDOWN_SPECIAL;
          }
          // else ramping up chance from 1/2 the automatic value onwards
          else if (iImpactForCrits > (MIN_DAMAGE_FOR_AUTO_FALL_OVER / 2) && (PreRandom(MIN_DAMAGE_FOR_AUTO_FALL_OVER / 2) < (iImpactForCrits - MIN_DAMAGE_FOR_AUTO_FALL_OVER / 2))) {
            pubSpecial.value = FIRE_WEAPON_LEG_FALLDOWN_SPECIAL;
          }
        }
        break;
      case AIM_SHOT_TORSO:
        // normal damage to torso
        // is the blow deadly enough for an instant kill?
        // since this value is much lower than the others, it only applies at short range...
        if (PythSpacesAway(pFirer.value.sGridNo, pTarget.value.sGridNo) <= MAX_DISTANCE_FOR_MESSY_DEATH) {
          if (iImpact > MIN_DAMAGE_FOR_INSTANT_KILL && iImpact < pTarget.value.bLife) {
            // blow to the chest is so deadly that it causes instant death;
            // the target has more life than iImpact so we increase it
            iImpact = pTarget.value.bLife + Random(10);
            iImpactForCrits = iImpact;
          }
          // special thing for hitting chest - allow cumulative damage to count
          else if ((iImpact + pTarget.value.sDamage) > (MIN_DAMAGE_FOR_BLOWN_AWAY + MIN_DAMAGE_FOR_INSTANT_KILL)) {
            iImpact = pTarget.value.bLife + Random(10);
            iImpactForCrits = iImpact;
          }

          // is the blow deadly enough to cause a chest explosion?
          if (pubSpecial) {
            if (iImpact > MIN_DAMAGE_FOR_BLOWN_AWAY && iImpact >= pTarget.value.bLife) {
              pubSpecial.value = FIRE_WEAPON_CHEST_EXPLODE_SPECIAL;
            }
          }
        }
        break;
    }
  }

  if (AM_A_ROBOT(pTarget)) {
    iImpactForCrits = 0;
  }

  // don't do critical hits against people who are gonna die!
  if (!IsAutoResolveActive()) {
    if (ubAmmoType == Enum286.AMMO_KNIFE && pFirer.value.bOppList[pTarget.value.ubID] == SEEN_CURRENTLY) {
      // is this a stealth attack?
      if (pTarget.value.bOppList[pFirer.value.ubID] == NOT_HEARD_OR_SEEN && !CREATURE_OR_BLOODCAT(pTarget) && (ubHitLocation == AIM_SHOT_HEAD || ubHitLocation == AIM_SHOT_TORSO)) {
        if (PreRandom(100) < (sHitBy + 10 * NUM_SKILL_TRAITS(pFirer, Enum269.THROWING))) {
          // instant death!
          iImpact = pTarget.value.bLife + Random(10);
          iImpactForCrits = iImpact;
        }
      }
    }

    if (iImpactForCrits > 0 && iImpactForCrits < pTarget.value.bLife) {
      if (PreRandom(iImpactForCrits / 2 + pFirer.value.bAimTime * 5) + 1 > CRITICAL_HIT_THRESHOLD) {
        bStatLoss = PreRandom(iImpactForCrits / 2) + 1;
        switch (ubHitLocation) {
          case AIM_SHOT_HEAD:
            if (bStatLoss >= pTarget.value.bWisdom) {
              bStatLoss = pTarget.value.bWisdom - 1;
            }
            if (bStatLoss > 0) {
              pTarget.value.bWisdom -= bStatLoss;

              if (pTarget.value.ubProfile != NO_PROFILE) {
                gMercProfiles[pTarget.value.ubProfile].bWisdom = pTarget.value.bWisdom;
              }

              if (pTarget.value.name[0] && pTarget.value.bVisible == true) {
                // make stat RED for a while...
                pTarget.value.uiChangeWisdomTime = GetJA2Clock();
                pTarget.value.usValueGoneUp &= ~(WIS_INCREASE);

                if (bStatLoss == 1) {
                  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_1_WISDOM], pTarget.value.name);
                } else {
                  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_WISDOM], pTarget.value.name, bStatLoss);
                }
              }
            } else if (pTarget.value.bNumPelletsHitBy == 0) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_HEAD_HIT], pTarget.value.name);
            }
            break;
          case AIM_SHOT_TORSO:
            if (PreRandom(1) == 0 && !(pTarget.value.uiStatusFlags & SOLDIER_MONSTER)) {
              if (bStatLoss >= pTarget.value.bDexterity) {
                bStatLoss = pTarget.value.bDexterity - 1;
              }
              if (bStatLoss > 0) {
                pTarget.value.bDexterity -= bStatLoss;

                if (pTarget.value.ubProfile != NO_PROFILE) {
                  gMercProfiles[pTarget.value.ubProfile].bDexterity = pTarget.value.bDexterity;
                }

                if (pTarget.value.name[0] && pTarget.value.bVisible == true) {
                  // make stat RED for a while...
                  pTarget.value.uiChangeDexterityTime = GetJA2Clock();
                  pTarget.value.usValueGoneUp &= ~(DEX_INCREASE);

                  if (bStatLoss == 1) {
                    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_1_DEX], pTarget.value.name);
                  } else {
                    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_DEX], pTarget.value.name, bStatLoss);
                  }
                }
              }
            } else {
              if (bStatLoss >= pTarget.value.bStrength) {
                bStatLoss = pTarget.value.bStrength - 1;
              }
              if (bStatLoss > 0) {
                pTarget.value.bStrength -= bStatLoss;

                if (pTarget.value.ubProfile != NO_PROFILE) {
                  gMercProfiles[pTarget.value.ubProfile].bStrength = pTarget.value.bStrength;
                }

                if (pTarget.value.name[0] && pTarget.value.bVisible == true) {
                  // make stat RED for a while...
                  pTarget.value.uiChangeStrengthTime = GetJA2Clock();
                  pTarget.value.usValueGoneUp &= ~(STRENGTH_INCREASE);

                  if (bStatLoss == 1) {
                    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_1_STRENGTH], pTarget.value.name);
                  } else {
                    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_STRENGTH], pTarget.value.name, bStatLoss);
                  }
                }
              }
            }
            break;
          case AIM_SHOT_LEGS:
            if (bStatLoss >= pTarget.value.bAgility) {
              bStatLoss = pTarget.value.bAgility - 1;
            }
            if (bStatLoss > 0) {
              pTarget.value.bAgility -= bStatLoss;

              if (pTarget.value.ubProfile != NO_PROFILE) {
                gMercProfiles[pTarget.value.ubProfile].bAgility = pTarget.value.bAgility;
              }

              if (pTarget.value.name[0] && pTarget.value.bVisible == true) {
                // make stat RED for a while...
                pTarget.value.uiChangeAgilityTime = GetJA2Clock();
                pTarget.value.usValueGoneUp &= ~(AGIL_INCREASE);

                if (bStatLoss == 1) {
                  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_1_AGIL], pTarget.value.name);
                } else {
                  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_LOSES_AGIL], pTarget.value.name, bStatLoss);
                }
              }
            }
            break;
        }
      } else if (ubHitLocation == AIM_SHOT_HEAD && pTarget.value.bNumPelletsHitBy == 0) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, Message[Enum334.STR_HEAD_HIT], pTarget.value.name);
      }
    }
  }

  return iImpact;
}

export function HTHImpact(pSoldier: Pointer<SOLDIERTYPE>, pTarget: Pointer<SOLDIERTYPE>, iHitBy: INT32, fBladeAttack: boolean): INT32 {
  let iImpact: INT32;
  let iFluke: INT32;
  let iBonus: INT32;

  if (fBladeAttack) {
    iImpact = (EffectiveExpLevel(pSoldier) / 2); // 0 to 4 for level
    iImpact += Weapon[pSoldier.value.usAttackingWeapon].ubImpact;
    iImpact += EffectiveStrength(pSoldier) / 20; // 0 to 5 for strength, adjusted by damage taken

    if (AM_A_ROBOT(pTarget)) {
      iImpact /= 4;
    }
  } else {
    iImpact = (EffectiveExpLevel(pSoldier) / 2); // 0 to 4 for level
    iImpact += EffectiveStrength(pSoldier) / 5; // 0 to 20 for strength, adjusted by damage taken

    // NB martial artists don't get a bonus for using brass knuckles!
    if (pSoldier.value.usAttackingWeapon && !(HAS_SKILL_TRAIT(pSoldier, Enum269.MARTIALARTS))) {
      iImpact += Weapon[pSoldier.value.usAttackingWeapon].ubImpact;

      if (AM_A_ROBOT(pTarget)) {
        iImpact /= 2;
      }
    } else {
      // base HTH damage
      iImpact += 5;
      if (AM_A_ROBOT(pTarget)) {
        iImpact = 0;
      }
    }
  }

  iFluke = PreRandom(51) - 25; // +/-25% bonus due to random factors
  iBonus = iHitBy / 2; // up to 50% extra impact for accurate attacks

  iImpact = iImpact * (100 + iFluke + iBonus) / 100;

  if (!fBladeAttack) {
    // add bonuses for hand-to-hand and martial arts
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.MARTIALARTS)) {
      iImpact = iImpact * (100 + gbSkillTraitBonus[Enum269.MARTIALARTS] * NUM_SKILL_TRAITS(pSoldier, Enum269.MARTIALARTS)) / 100;
      if (pSoldier.value.usAnimState == Enum193.NINJA_SPINKICK) {
        iImpact *= 2;
      }
    }
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.HANDTOHAND)) {
      // SPECIAL  - give TRIPLE bonus for damage for hand-to-hand trait
      // because the HTH bonus is half that of martial arts, and gets only 1x for to-hit bonus
      iImpact = iImpact * (100 + 3 * gbSkillTraitBonus[Enum269.HANDTOHAND] * NUM_SKILL_TRAITS(pSoldier, Enum269.HANDTOHAND)) / 100;
    }
  }

  return iImpact;
}

export function ShotMiss(ubAttackerID: UINT8, iBullet: INT32): void {
  let fDoMissForGun: boolean = false;
  let pAttacker: Pointer<SOLDIERTYPE>;
  let pBullet: Pointer<BULLET>;

  pAttacker = MercPtrs[ubAttackerID];

  if (pAttacker.value.ubOppNum != NOBODY) {
    // if it was another team shooting at someone under our control
    if ((pAttacker.value.bTeam != Menptr[pAttacker.value.ubOppNum].bTeam)) {
      // if OPPONENT is under our control
      if (Menptr[pAttacker.value.ubOppNum].bTeam == gbPlayerNum) {
        // AGILITY GAIN: Opponent "dodged" a bullet shot at him (it missed)
        StatChange(MercPtrs[pAttacker.value.ubOppNum], AGILAMT, 5, FROM_FAILURE);
      }
    }
  }

  switch (Weapon[MercPtrs[ubAttackerID].value.usAttackingWeapon].ubWeaponClass) {
    case Enum282.HANDGUNCLASS:
    case Enum282.RIFLECLASS:
    case Enum282.SHOTGUNCLASS:
    case Enum282.SMGCLASS:
    case Enum282.MGCLASS:

      // Guy has missed, play random sound
      if (MercPtrs[ubAttackerID].value.bTeam == gbPlayerNum) {
        if (Random(40) == 0) {
          DoMercBattleSound(MercPtrs[ubAttackerID], Enum259.BATTLE_SOUND_CURSE1);
        }
      }
      fDoMissForGun = true;
      break;

    case Enum282.MONSTERCLASS:
      PlayJA2Sample(Enum330.SPIT_RICOCHET, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      break;
  }

  if (fDoMissForGun) {
    // PLAY SOUND AND FLING DEBRIS
    // RANDOMIZE SOUND SYSTEM

    if (!DoSpecialEffectAmmoMiss(ubAttackerID, NOWHERE, 0, 0, 0, true, true, 0)) {
      PlayJA2Sample(Enum330.MISS_1 + Random(8), RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    }

    // ATE: Show misses...( if our team )
    if (gGameSettings.fOptions[Enum8.TOPTION_SHOW_MISSES]) {
      pBullet = GetBulletPtr(iBullet);

      if (pAttacker.value.bTeam == gbPlayerNum) {
        LocateGridNo(pBullet.value.sGridNo);
      }
    }
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - bullet missed"));
  FreeUpAttacker(ubAttackerID);
}

function CalcChanceHTH(pAttacker: Pointer<SOLDIERTYPE>, pDefender: Pointer<SOLDIERTYPE>, ubAimTime: UINT8, ubMode: UINT8): UINT32 {
  let usInHand: UINT16;
  let ubBandaged: UINT8;
  let iAttRating: INT32;
  let iDefRating: INT32;
  let iChance: INT32;

  usInHand = pAttacker.value.usAttackingWeapon;

  if ((usInHand != Enum225.CREATURE_QUEEN_TENTACLES) && (pDefender.value.bLife < OKLIFE || pDefender.value.bBreath < OKBREATH)) {
    // there is NO way to miss
    return 100;
  }

  if (ubMode == HTH_MODE_STAB) {
    // safety check
    if (Weapon[usInHand].ubWeaponClass != Enum282.KNIFECLASS) {
      return 0;
    }
  } else {
    if (Item[usInHand].usItemClass != IC_PUNCH) {
      return 0;
    }
  }

  // CALCULATE ATTACKER'S CLOSE COMBAT RATING (1-100)
  if (ubMode == HTH_MODE_STEAL) {
    // this is more of a brute force strength-vs-strength check
    iAttRating = (EffectiveDexterity(pAttacker) + // coordination, accuracy
                  EffectiveAgility(pAttacker) + // speed & reflexes
                  3 * pAttacker.value.bStrength + // physical strength (TRIPLED!)
                  (10 * EffectiveExpLevel(pAttacker))); // experience, knowledge
  } else {
    iAttRating = (3 * EffectiveDexterity(pAttacker) + // coordination, accuracy (TRIPLED!)
                  EffectiveAgility(pAttacker) + // speed & reflexes
                  pAttacker.value.bStrength + // physical strength
                  (10 * EffectiveExpLevel(pAttacker))); // experience, knowledge
  }

  iAttRating /= 6; // convert from 6-600 to 1-100

  // psycho bonus
  if (pAttacker.value.ubProfile != NO_PROFILE && gMercProfiles[pAttacker.value.ubProfile].bPersonalityTrait == Enum270.PSYCHO) {
    iAttRating += AIM_BONUS_PSYCHO;
  }

  // modify chance to hit by morale
  iAttRating += GetMoraleModifier(pAttacker);

  // modify for fatigue
  iAttRating -= GetSkillCheckPenaltyForFatigue(pAttacker, iAttRating);

  // if attacker spent some extra time aiming
  if (ubAimTime) {
    // use only HALF of the normal aiming bonus for knife aiming.
    // since there's no range penalty, the bonus is otherwise too generous
    iAttRating += ((AIM_BONUS_PER_AP * ubAimTime) / 2); // bonus for aiming
  }

  if (!(pAttacker.value.uiStatusFlags & SOLDIER_PC)) // if attacker is a computer AI controlled enemy
  {
    iAttRating += gbDiff[DIFF_ENEMY_TO_HIT_MOD][SoldierDifficultyLevel(pAttacker)];
  }

  // if attacker is being affected by gas
  if (pAttacker.value.uiStatusFlags & SOLDIER_GASSED)
    iAttRating -= AIM_PENALTY_GASSED;

  // if attacker is being bandaged at the same time, his concentration is off
  if (pAttacker.value.ubServiceCount > 0)
    iAttRating -= AIM_PENALTY_GETTINGAID;

  // if attacker is still in shock
  if (pAttacker.value.bShock)
    iAttRating -= (pAttacker.value.bShock * AIM_PENALTY_PER_SHOCK);

  /*
    // if the attacker is an A.I.M. mercenary
    if (pAttacker->characternum < MAX_AIM_MERCS)	// exclude Gus
      iAttRating += AdjustChanceForProfile(pAttacker,pDefender);
  */

  // If attacker injured, reduce chance accordingly (by up to 2/3rds)
  if ((iAttRating > 0) && (pAttacker.value.bLife < pAttacker.value.bLifeMax)) {
    // if bandaged, give 1/2 of the bandaged life points back into equation
    ubBandaged = pAttacker.value.bLifeMax - pAttacker.value.bLife - pAttacker.value.bBleeding;

    iAttRating -= (2 * iAttRating * (pAttacker.value.bLifeMax - pAttacker.value.bLife + (ubBandaged / 2))) / (3 * pAttacker.value.bLifeMax);
  }

  // If attacker tired, reduce chance accordingly (by up to 1/2)
  if ((iAttRating > 0) && (pAttacker.value.bBreath < 100))
    iAttRating -= (iAttRating * (100 - pAttacker.value.bBreath)) / 200;

  if (pAttacker.value.ubProfile != NO_PROFILE) {
    if (ubMode == HTH_MODE_STAB) {
      if (HAS_SKILL_TRAIT(pAttacker, Enum269.KNIFING)) {
        iAttRating += gbSkillTraitBonus[Enum269.KNIFING] * NUM_SKILL_TRAITS(pAttacker, Enum269.KNIFING);
      }
    } else {
      // add bonuses for hand-to-hand and martial arts
      if (HAS_SKILL_TRAIT(pAttacker, Enum269.MARTIALARTS)) {
        iAttRating += gbSkillTraitBonus[Enum269.MARTIALARTS] * NUM_SKILL_TRAITS(pAttacker, Enum269.MARTIALARTS);
      }
      if (HAS_SKILL_TRAIT(pAttacker, Enum269.HANDTOHAND)) {
        iAttRating += gbSkillTraitBonus[Enum269.HANDTOHAND] * NUM_SKILL_TRAITS(pAttacker, Enum269.HANDTOHAND);
      }
    }
  }

  if (iAttRating < 1)
    iAttRating = 1;

  // CALCULATE DEFENDER'S CLOSE COMBAT RATING (0-100)
  if (ubMode == HTH_MODE_STEAL) {
    iDefRating = (EffectiveAgility(pDefender)) + // speed & reflexes
                 EffectiveDexterity(pDefender) + // coordination, accuracy
                 3 * pDefender.value.bStrength + // physical strength (TRIPLED!)
                 (10 * EffectiveExpLevel(pDefender)); // experience, knowledge
  } else {
    iDefRating = (3 * EffectiveAgility(pDefender)) + // speed & reflexes (TRIPLED!)
                 EffectiveDexterity(pDefender) + // coordination, accuracy
                 pDefender.value.bStrength + // physical strength
                 (10 * EffectiveExpLevel(pDefender)); // experience, knowledge
  }

  iDefRating /= 6; // convert from 6-600 to 1-100

  // modify chance to dodge by morale
  iDefRating += GetMoraleModifier(pDefender);

  // modify for fatigue
  iDefRating -= GetSkillCheckPenaltyForFatigue(pDefender, iDefRating);

  // if attacker is being affected by gas
  if (pDefender.value.uiStatusFlags & SOLDIER_GASSED)
    iDefRating -= AIM_PENALTY_GASSED;

  // if defender is being bandaged at the same time, his concentration is off
  if (pDefender.value.ubServiceCount > 0)
    iDefRating -= AIM_PENALTY_GETTINGAID;

  // if defender is still in shock
  if (pDefender.value.bShock)
    iDefRating -= (pDefender.value.bShock * AIM_PENALTY_PER_SHOCK);

  /*
    // if the defender is an A.I.M. mercenary
    if (pDefender->characternum < MAX_AIM_MERCS)	// exclude Gus
      iDefRating += AdjustChanceForProfile(pDefender,pAttacker);
  */

  // If defender injured, reduce chance accordingly (by up to 2/3rds)
  if ((iDefRating > 0) && (pDefender.value.bLife < pDefender.value.bLifeMax)) {
    // if bandaged, give 1/2 of the bandaged life points back into equation
    ubBandaged = pDefender.value.bLifeMax - pDefender.value.bLife - pDefender.value.bBleeding;

    iDefRating -= (2 * iDefRating * (pDefender.value.bLifeMax - pDefender.value.bLife + (ubBandaged / 2))) / (3 * pDefender.value.bLifeMax);
  }

  // If defender tired, reduce chance accordingly (by up to 1/2)
  if ((iDefRating > 0) && (pDefender.value.bBreath < 100))
    iDefRating -= (iDefRating * (100 - pDefender.value.bBreath)) / 200;

  if (usInHand == Enum225.CREATURE_QUEEN_TENTACLES && pDefender.value.ubBodyType == Enum194.LARVAE_MONSTER || pDefender.value.ubBodyType == Enum194.INFANT_MONSTER) {
    // try to prevent queen from killing the kids, ever!
    iDefRating += 10000;
  }

  if (gAnimControl[pDefender.value.usAnimState].ubEndHeight < ANIM_STAND) {
    if (usInHand == Enum225.CREATURE_QUEEN_TENTACLES) {
      if (gAnimControl[pDefender.value.usAnimState].ubEndHeight == ANIM_PRONE) {
        // make it well-nigh impossible to hit someone who is prone!
        iDefRating += 1000;
      } else {
        iDefRating += BAD_DODGE_POSITION_PENALTY * 2;
      }
    } else {
      // if defender crouched, reduce chance accordingly (harder to dodge)
      iDefRating -= BAD_DODGE_POSITION_PENALTY;
      // If our target is prone, double the penalty!
      if (gAnimControl[pDefender.value.usAnimState].ubEndHeight == ANIM_PRONE) {
        iDefRating -= BAD_DODGE_POSITION_PENALTY;
      }
    }
  }

  if (pDefender.value.ubProfile != NO_PROFILE) {
    if (ubMode == HTH_MODE_STAB) {
      if (Item[pDefender.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_BLADE) {
        if (HAS_SKILL_TRAIT(pDefender, Enum269.KNIFING)) {
          // good with knives, got one, so we're good at parrying
          iDefRating += gbSkillTraitBonus[Enum269.KNIFING] * NUM_SKILL_TRAITS(pDefender, Enum269.KNIFING);
        }
        if (HAS_SKILL_TRAIT(pDefender, Enum269.MARTIALARTS)) {
          // the knife gets in the way but we're still better than nobody
          iDefRating += (gbSkillTraitBonus[Enum269.MARTIALARTS] * NUM_SKILL_TRAITS(pDefender, Enum269.MARTIALARTS)) / 3;
        }
      } else {
        if (HAS_SKILL_TRAIT(pDefender, Enum269.KNIFING)) {
          // good with knives, don't have one, but we know a bit about dodging
          iDefRating += (gbSkillTraitBonus[Enum269.KNIFING] * NUM_SKILL_TRAITS(pDefender, Enum269.KNIFING)) / 3;
        }
        if (HAS_SKILL_TRAIT(pDefender, Enum269.MARTIALARTS)) {
          // bonus for dodging knives
          iDefRating += (gbSkillTraitBonus[Enum269.MARTIALARTS] * NUM_SKILL_TRAITS(pDefender, Enum269.MARTIALARTS)) / 2;
        }
      }
    } else {
      // punch/hand-to-hand/martial arts attack/steal
      if (Item[pDefender.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_BLADE && ubMode != HTH_MODE_STEAL) {
        if (HAS_SKILL_TRAIT(pDefender, Enum269.KNIFING)) {
          // with our knife, we get some bonus at defending from HTH attacks
          iDefRating += (gbSkillTraitBonus[Enum269.KNIFING] * NUM_SKILL_TRAITS(pDefender, Enum269.KNIFING)) / 2;
        }
      } else {
        if (HAS_SKILL_TRAIT(pDefender, Enum269.MARTIALARTS)) {
          iDefRating += gbSkillTraitBonus[Enum269.MARTIALARTS] * NUM_SKILL_TRAITS(pDefender, Enum269.MARTIALARTS);
        }
        if (HAS_SKILL_TRAIT(pDefender, Enum269.HANDTOHAND)) {
          iDefRating += gbSkillTraitBonus[Enum269.HANDTOHAND] * NUM_SKILL_TRAITS(pDefender, Enum269.HANDTOHAND);
        }
      }
    }
  }

  if (iDefRating < 1)
    iDefRating = 1;

  // NumMessage("CalcChanceToStab - Attacker's Rating = ",iAttRating);
  // NumMessage("CalcChanceToStab - Defender's Rating = ",iDefRating);

  // calculate chance to hit by comparing the 2 opponent's ratings
  //  iChance = (100 * iAttRating) / (iAttRating + iDefRating);

  if (ubMode == HTH_MODE_STEAL) {
    // make this more extreme so that weak people have a harder time stealing from
    // the stronger
    iChance = 50 * iAttRating / iDefRating;
  } else {
    // Changed from DG by CJC to give higher chances of hitting with a stab or punch
    iChance = 67 + (iAttRating - iDefRating) / 3;

    if (pAttacker.value.bAimShotLocation == AIM_SHOT_HEAD) {
      // make this harder!
      iChance -= 20;
    }
  }

  // MAKE SURE CHANCE TO HIT IS WITHIN DEFINED LIMITS
  if (iChance < MINCHANCETOHIT) {
    iChance = MINCHANCETOHIT;
  } else {
    if (iChance > MAXCHANCETOHIT)
      iChance = MAXCHANCETOHIT;
  }

  // NumMessage("ChanceToStab = ",chance);

  return iChance;
}

export function CalcChanceToStab(pAttacker: Pointer<SOLDIERTYPE>, pDefender: Pointer<SOLDIERTYPE>, ubAimTime: UINT8): UINT32 {
  return CalcChanceHTH(pAttacker, pDefender, ubAimTime, HTH_MODE_STAB);
}

export function CalcChanceToPunch(pAttacker: Pointer<SOLDIERTYPE>, pDefender: Pointer<SOLDIERTYPE>, ubAimTime: UINT8): UINT32 {
  return CalcChanceHTH(pAttacker, pDefender, ubAimTime, HTH_MODE_PUNCH);
}

function CalcChanceToSteal(pAttacker: Pointer<SOLDIERTYPE>, pDefender: Pointer<SOLDIERTYPE>, ubAimTime: UINT8): UINT32 {
  return CalcChanceHTH(pAttacker, pDefender, ubAimTime, HTH_MODE_STEAL);
}

export function ReloadWeapon(pSoldier: Pointer<SOLDIERTYPE>, ubHandPos: UINT8): void {
  // NB this is a cheat function, don't award experience

  if (pSoldier.value.inv[ubHandPos].usItem != NOTHING) {
    pSoldier.value.inv[ubHandPos].ubGunShotsLeft = Weapon[pSoldier.value.inv[ubHandPos].usItem].ubMagSize;
    // Dirty Bars
    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL1);
  }
}

export function IsGunBurstCapable(pSoldier: Pointer<SOLDIERTYPE>, ubHandPos: UINT8, fNotify: boolean): boolean {
  let fCapable: boolean = false;

  if (pSoldier.value.inv[ubHandPos].usItem != NOTHING) {
    // ATE: Check for being a weapon....
    if (Item[pSoldier.value.inv[ubHandPos].usItem].usItemClass & IC_WEAPON) {
      if (Weapon[pSoldier.value.inv[ubHandPos].usItem].ubShotsPerBurst > 0) {
        fCapable = true;
      }
    }
  }

  if (fNotify && !fCapable) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, Message[Enum334.STR_NOT_BURST_CAPABLE], pSoldier.value.name);
  }

  return fCapable;
}

export function CalcMaxTossRange(pSoldier: Pointer<SOLDIERTYPE>, usItem: UINT16, fArmed: boolean): INT32 {
  let iRange: INT32;
  let usSubItem: UINT16;

  if (EXPLOSIVE_GUN(usItem)) {
    // oops! return value in weapons table
    return Weapon[usItem].usRange / CELL_X_SIZE;
  }

  // if item's fired mechanically
  // ATE: If we are sent in a LAUNCHABLE, get the LAUCNHER, and sub ONLY if we are armed...
  usSubItem = GetLauncherFromLaunchable(usItem);

  if (fArmed && usSubItem != NOTHING) {
    usItem = usSubItem;
  }

  if (Item[usItem].usItemClass == IC_LAUNCHER && fArmed) {
    // this function returns range in tiles so, stupidly, we have to divide by 10 here
    iRange = Weapon[usItem].usRange / CELL_X_SIZE;
  } else {
    if (Item[usItem].fFlags & ITEM_UNAERODYNAMIC) {
      iRange = 1;
    } else if (Item[usItem].usItemClass == IC_GRENADE) {
      // start with the range based on the soldier's strength and the item's weight
      let iThrowingStrength: INT32 = (EffectiveStrength(pSoldier) * 2 + 100) / 3;
      iRange = 2 + (iThrowingStrength / Math.min((3 + (Item[usItem].ubWeight) / 3), 4));
    } else {
      // not as aerodynamic!

      // start with the range based on the soldier's strength and the item's weight
      iRange = 2 + ((EffectiveStrength(pSoldier) / (5 + Item[usItem].ubWeight)));
    }

    // adjust for thrower's remaining breath (lose up to 1/2 of range)
    iRange -= (iRange * (100 - pSoldier.value.bBreath)) / 200;

    if (HAS_SKILL_TRAIT(pSoldier, Enum269.THROWING)) {
      // better max range due to expertise
      iRange = iRange * (100 + gbSkillTraitBonus[Enum269.THROWING] * NUM_SKILL_TRAITS(pSoldier, Enum269.THROWING)) / 100;
    }
  }

  if (iRange < 1) {
    iRange = 1;
  }

  return iRange;
}

export function CalcThrownChanceToHit(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubAimTime: UINT8, ubAimPos: UINT8): UINT32 {
  let iChance: INT32;
  let iMaxRange: INT32;
  let iRange: INT32;
  let usHandItem: UINT16;
  let bPenalty: INT8;
  let bBandaged: INT8;

  if (pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED) {
    usHandItem = Enum225.UNDER_GLAUNCHER;
  } else {
    usHandItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;
  }

  /*
          // CJC: Grenade Launchers don't fire in a straight line!
          #ifdef BETAVERSION
          if (usHandItem == GLAUNCHER)
          {
                  PopMessage("CalcThrownChanceToHit: DOESN'T WORK ON GLAUNCHERs!");
                  return(0);
          }
          #endif
  */

  if (Item[usHandItem].usItemClass != IC_LAUNCHER && pSoldier.value.bWeaponMode != Enum265.WM_ATTACHED) {
    // PHYSICALLY THROWN arced projectile (ie. grenade)
    // for lack of anything better, base throwing accuracy on dex & marskmanship
    iChance = (EffectiveDexterity(pSoldier) + EffectiveMarksmanship(pSoldier)) / 2;
    // throwing trait helps out
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.THROWING)) {
      iChance += gbSkillTraitBonus[Enum269.THROWING] * NUM_SKILL_TRAITS(pSoldier, Enum269.THROWING);
    }
  } else {
    // MECHANICALLY FIRED arced projectile (ie. mortar), need brains & know-how
    iChance = (EffectiveDexterity(pSoldier) + EffectiveMarksmanship(pSoldier) + EffectiveWisdom(pSoldier) + pSoldier.value.bExpLevel) / 4;

    // heavy weapons trait helps out
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.HEAVY_WEAPS)) {
      iChance += gbSkillTraitBonus[Enum269.HEAVY_WEAPS] * NUM_SKILL_TRAITS(pSoldier, Enum269.HEAVY_WEAPS);
    }
  }

  // modify based on morale
  iChance += GetMoraleModifier(pSoldier);

  // modify by fatigue
  iChance -= GetSkillCheckPenaltyForFatigue(pSoldier, iChance);

  // if shooting same target from same position as the last shot
  if (sGridNo == pSoldier.value.sLastTarget) {
    iChance += AIM_BONUS_SAME_TARGET; // give a bonus to hit
  }

  // ADJUST FOR EXTRA AIMING TIME
  if (ubAimTime) {
    iChance += (AIM_BONUS_PER_AP * ubAimTime); // bonus for every pt of aiming
  }

  /*
          if (!pSoldier->human)	// if this is a computer AI controlled enemy
          {
                  iChance += Diff[DIFF_ENEMY_TO_HIT_MOD][GameOption[ENEMYDIFFICULTY]];
          }
  */

  // if shooter is being affected by gas
  if (pSoldier.value.uiStatusFlags & SOLDIER_GASSED) {
    iChance -= AIM_PENALTY_GASSED;
  }

  // if shooter is being bandaged at the same time, his concentration is off
  if (pSoldier.value.ubServiceCount > 0) {
    iChance -= AIM_PENALTY_GETTINGAID;
  }

  // if shooter is still in shock
  if (pSoldier.value.bShock) {
    iChance -= (pSoldier.value.bShock * AIM_PENALTY_PER_SHOCK);
  }

  // calculate actual range (in world units)
  iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sGridNo);

  // NumMessage("ACTUAL RANGE = ",range);

  if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.SUNGOGGLES || pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.SUNGOGGLES) {
    // decrease effective range by 10% when using sungoggles (w or w/o scope)
    iRange -= iRange / 10; // basically, +1% to hit per every 2 squares
  }

  // NumMessage("EFFECTIVE RANGE = ",range);

  // ADJUST FOR RANGE

  if (usHandItem == Enum225.MORTAR && iRange < MIN_MORTAR_RANGE) {
    return 0;
  } else {
    iMaxRange = CalcMaxTossRange(pSoldier, usHandItem, true) * CELL_X_SIZE;

    // NumMessage("MAX RANGE = ",maxRange);

    // bonus if range is less than 1/2 maximum range, penalty if it's more

    // bonus is 50% at range 0, -50% at maximum range

    iChance += 50 * 2 * ((iMaxRange / 2) - iRange) / iMaxRange;
    // iChance += ((iMaxRange / 2) - iRange);		// increments of 1% per pixel

    // IF TARGET IS BEYOND MAXIMUM THROWING RANGE
    if (iRange > iMaxRange) {
      // the object CAN travel that far if not blocked, but it's NOT accurate!
      iChance /= 2;
    }
  }

  // IF CHANCE EXISTS, BUT ATTACKER IS INJURED
  if ((iChance > 0) && (pSoldier.value.bLife < pSoldier.value.bLifeMax)) {
    // if bandaged, give 1/2 of the bandaged life points back into equation
    bBandaged = pSoldier.value.bLifeMax - pSoldier.value.bLife - pSoldier.value.bBleeding;

    // injury penalty is based on % damage taken (max 2/3rds iChance)
    bPenalty = (2 * iChance * (pSoldier.value.bLifeMax - pSoldier.value.bLife + (bBandaged / 2))) / (3 * pSoldier.value.bLifeMax);

    // for mechanically-fired projectiles, reduce penalty in half
    if (Item[usHandItem].usItemClass == IC_LAUNCHER) {
      bPenalty /= 2;
    }

    // reduce injury penalty due to merc's experience level (he can take it!)
    iChance -= (bPenalty * (100 - (10 * (EffectiveExpLevel(pSoldier) - 1)))) / 100;
  }

  // IF CHANCE EXISTS, BUT ATTACKER IS LOW ON BREATH
  if ((iChance > 0) && (pSoldier.value.bBreath < 100)) {
    // breath penalty is based on % breath missing (max 1/2 iChance)
    bPenalty = (iChance * (100 - pSoldier.value.bBreath)) / 200;

    // for mechanically-fired projectiles, reduce penalty in half
    if (Item[usHandItem].usItemClass == IC_LAUNCHER)
      bPenalty /= 2;

    // reduce breath penalty due to merc's dexterity (he can compensate!)
    iChance -= (bPenalty * (100 - (EffectiveDexterity(pSoldier) - 10))) / 100;
  }

  // if iChance exists, but it's a mechanical item being used
  if ((iChance > 0) && (Item[usHandItem].usItemClass == IC_LAUNCHER))
    // reduce iChance to hit DIRECTLY by the item's working condition
    iChance = (iChance * WEAPON_STATUS_MOD(pSoldier.value.inv[Enum261.HANDPOS].bStatus[0])) / 100;

  // MAKE SURE CHANCE TO HIT IS WITHIN DEFINED LIMITS
  if (iChance < MINCHANCETOHIT)
    iChance = MINCHANCETOHIT;
  else {
    if (iChance > MAXCHANCETOHIT)
      iChance = MAXCHANCETOHIT;
  }

  // NumMessage("ThrownChanceToHit = ",iChance);
  return iChance;
}

export function ChangeWeaponMode(pSoldier: Pointer<SOLDIERTYPE>): void {
  // ATE: Don't do this if in a fire amimation.....
  if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_FIRE) {
    return;
  }

  if (FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.UNDER_GLAUNCHER) == ITEM_NOT_FOUND || FindLaunchableAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.UNDER_GLAUNCHER) == ITEM_NOT_FOUND) {
    // swap between single/burst fire
    if (IsGunBurstCapable(pSoldier, Enum261.HANDPOS, true)) {
      pSoldier.value.bWeaponMode++;
      if (pSoldier.value.bWeaponMode > Enum265.WM_BURST) {
        // return to normal mode after going past burst
        pSoldier.value.bWeaponMode = Enum265.WM_NORMAL;
      }
    } else {
      // do nothing
      return;
    }
  } else {
    // grenade launcher available, makes things more complicated
    pSoldier.value.bWeaponMode++;
    if (pSoldier.value.bWeaponMode == Enum265.NUM_WEAPON_MODES) {
      // return to the beginning
      pSoldier.value.bWeaponMode = Enum265.WM_NORMAL;
    } else {
      // do NOT give message that gun is burst capable, because if we skip past
      // burst capable then we are going on to the grenade launcher
      if (pSoldier.value.bWeaponMode == Enum265.WM_BURST && !(IsGunBurstCapable(pSoldier, Enum261.HANDPOS, false))) {
        // skip past that mode!
        pSoldier.value.bWeaponMode++;
      }
    }
  }

  if (pSoldier.value.bWeaponMode == Enum265.WM_BURST) {
    pSoldier.value.bDoBurst = true;
  } else {
    pSoldier.value.bDoBurst = false;
  }
  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
  gfUIForceReExamineCursorData = true;
}

export function DishoutQueenSwipeDamage(pQueenSoldier: Pointer<SOLDIERTYPE>): void {
  let bValidDishoutDirs: INT8[][] /* [3][3] */ = [
    [ Enum245.NORTH, Enum245.NORTHEAST, -1 ],
    [ Enum245.EAST, Enum245.SOUTHEAST, -1 ],
    [ Enum245.SOUTH, -1, -1 ],
  ];

  let cnt: UINT32;
  let cnt2: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bDir: INT8;
  let iChance: INT32;
  let iImpact: INT32;
  let iHitBy: INT32;

  // Loop through all mercs and make go
  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (pSoldier != null) {
      if (pSoldier.value.ubID != pQueenSoldier.value.ubID) {
        // ATE: Ok, lets check for some basic things here!
        if (pSoldier.value.bLife >= OKLIFE && pSoldier.value.sGridNo != NOWHERE && pSoldier.value.bActive && pSoldier.value.bInSector) {
          // Get Pyth spaces away....
          if (GetRangeInCellCoordsFromGridNoDiff(pQueenSoldier.value.sGridNo, pSoldier.value.sGridNo) <= Weapon[Enum225.CREATURE_QUEEN_TENTACLES].usRange) {
            // get direction
            bDir = GetDirectionFromGridNo(pSoldier.value.sGridNo, pQueenSoldier);

            //
            for (cnt2 = 0; cnt2 < 2; cnt2++) {
              if (bValidDishoutDirs[pQueenSoldier.value.uiPendingActionData1][cnt2] == bDir) {
                iChance = CalcChanceToStab(pQueenSoldier, pSoldier, 0);

                // CC: Look here for chance to hit, damage, etc...
                // May want to not hit if target is prone, etc....
                iHitBy = iChance - PreRandom(100);
                if (iHitBy > 0) {
                  // Hit!
                  iImpact = HTHImpact(pQueenSoldier, pSoldier, iHitBy, true);
                  EVENT_SoldierGotHit(pSoldier, Enum225.CREATURE_QUEEN_TENTACLES, iImpact, iImpact, gOppositeDirection[bDir], 50, pQueenSoldier.value.ubID, 0, ANIM_CROUCH, 0, 0);
                }
              }
            }
          }
        }
      }
    }
  }

  pQueenSoldier.value.uiPendingActionData1++;
}

function WillExplosiveWeaponFail(pSoldier: Pointer<SOLDIERTYPE>, pObj: Pointer<OBJECTTYPE>): boolean {
  if (pSoldier.value.bTeam == gbPlayerNum || pSoldier.value.bVisible == 1) {
    if ((PreRandom(40) + PreRandom(40)) > pObj.value.bStatus[0]) {
      // Do second dice roll
      if (PreRandom(2) == 1) {
        // Fail
        return true;
      }
    }
  }

  return false;
}

}
