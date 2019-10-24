// This table controls the order items appear in inventory at BR's and dealers, and which kinds of items are sold used
let DealerItemSortInfo: ITEM_SORT_ENTRY[] /* [] */ = [
  //  item class					weapon class	sold used?
  [ IC_GUN, Enum282.HANDGUNCLASS, TRUE ],
  [ IC_GUN, Enum282.SHOTGUNCLASS, TRUE ],
  [ IC_GUN, Enum282.SMGCLASS, TRUE ],
  [ IC_GUN, Enum282.RIFLECLASS, TRUE ],
  [ IC_GUN, Enum282.MGCLASS, FALSE ],
  [ IC_LAUNCHER, Enum282.NOGUNCLASS, FALSE ],
  [ IC_AMMO, Enum282.NOGUNCLASS, FALSE ],
  [ IC_GRENADE, Enum282.NOGUNCLASS, FALSE ],
  [ IC_BOMB, Enum282.NOGUNCLASS, FALSE ],
  [ IC_BLADE, Enum282.NOGUNCLASS, FALSE ],
  [ IC_THROWING_KNIFE, Enum282.NOGUNCLASS, FALSE ],
  [ IC_PUNCH, Enum282.NOGUNCLASS, FALSE ],
  [ IC_ARMOUR, Enum282.NOGUNCLASS, TRUE ],
  [ IC_FACE, Enum282.NOGUNCLASS, TRUE ],
  [ IC_MEDKIT, Enum282.NOGUNCLASS, FALSE ],
  [ IC_KIT, Enum282.NOGUNCLASS, FALSE ],
  [ IC_MISC, Enum282.NOGUNCLASS, TRUE ],
  [ IC_THROWN, Enum282.NOGUNCLASS, FALSE ],
  [ IC_KEY, Enum282.NOGUNCLASS, FALSE ],

  // marks end of list
  [ IC_NONE, Enum282.NOGUNCLASS, FALSE ],
];

//
// Setup the inventory arrays for each of the arms dealers
//
//	The arrays are composed of pairs of numbers
//		The first is the item index
//		The second is the amount of the items the dealer will try to keep in his inventory

//
// Tony ( Weapons only )
//

let gTonyInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  // Rare guns/ammo that Tony will buy although he won't ever sell them
  [ Enum225.ROCKET_RIFLE, 0 ],
  [ Enum225.AUTO_ROCKET_RIFLE, 0 ],
  [ Enum225.AUTOMAG_III, 0 ],
  //	{ FLAMETHROWER,					0 },

  // Weapons
  [ Enum225.GLOCK_17, 1 ], /* Glock 17        */
  [ Enum225.GLOCK_18, 1 ], /* Glock 18        */
  [ Enum225.BERETTA_92F, 1 ], /* Beretta 92F     */
  [ Enum225.BERETTA_93R, 1 ], /* Beretta 93R     */
  [ Enum225.SW38, 1 ], /* .38 S&W Special */
  [ Enum225.BARRACUDA, 1 ], /* .357 Barracuda  */
  [ Enum225.DESERTEAGLE, 1 ], /* .357 DesertEagle*/
  [ Enum225.M1911, 1 ], /* .45 M1911			 */
  [ Enum225.MP5K, 1 ], /* H&K MP5K      	 */
  [ Enum225.MAC10, 1 ], /* .45 MAC-10	     */

  [ Enum225.THOMPSON, 1 ], /* Thompson M1A1   */
  [ Enum225.COMMANDO, 1 ], /* Colt Commando   */
  [ Enum225.MP53, 1 ], /* H&K MP53		 		 */
  [ Enum225.AKSU74, 1 ], /* AKSU-74         */
  [ Enum225.TYPE85, 1 ], /* Type-85         */
  [ Enum225.SKS, 1 ], /* SKS             */
  [ Enum225.DRAGUNOV, 1 ], /* Dragunov        */
  [ Enum225.M24, 1 ], /* M24             */
  [ Enum225.AUG, 1 ], /* Steyr AUG       */

  [ Enum225.G41, 1 ], /* H&K G41         */
  [ Enum225.MINI14, 1 ], /* Ruger Mini-14   */
  [ Enum225.C7, 1 ], /* C-7             */
  [ Enum225.FAMAS, 1 ], /* FA-MAS          */
  [ Enum225.AK74, 1 ], /* AK-74           */
  [ Enum225.AKM, 1 ], /* AKM             */
  [ Enum225.M14, 1 ], /* M-14            */
  [ Enum225.G3A3, 1 ], /* H&K G3A3        */
  [ Enum225.FNFAL, 1 ], /* FN-FAL          */

  [ Enum225.MINIMI, 1 ],
  [ Enum225.RPK74, 1 ],
  [ Enum225.HK21E, 1 ],

  [ Enum225.M870, 1 ], /* Remington M870  */
  [ Enum225.SPAS15, 1 ], /* SPAS-15         */

  [ Enum225.GLAUNCHER, 1 ], /* grenade launcher*/
  [ Enum225.UNDER_GLAUNCHER, 1 ], /* underslung g.l. */
  [ Enum225.ROCKET_LAUNCHER, 1 ], /* rocket Launcher */
  [ Enum225.MORTAR, 1 ],

  // SAP guns
  [ Enum225.G11, 1 ],
  [ Enum225.CAWS, 1 ],
  [ Enum225.P90, 1 ],

  [ Enum225.DART_GUN, 1 ],

  // Ammo
  [ Enum225.CLIP9_15, 8 ],
  [ Enum225.CLIP9_30, 6 ],
  [ Enum225.CLIP9_15_AP, 3 ], /* CLIP9_15_AP */
  [ Enum225.CLIP9_30_AP, 3 ], /* CLIP9_30_AP */
  [ Enum225.CLIP9_15_HP, 3 ], /* CLIP9_15_HP */
  [ Enum225.CLIP9_30_HP, 3 ], /* CLIP9_30_HP */

  [ Enum225.CLIP38_6, 10 ], /* CLIP38_6 */
  [ Enum225.CLIP38_6_AP, 5 ], /* CLIP38_6_AP */
  [ Enum225.CLIP38_6_HP, 5 ], /* CLIP38_6_HP */

  [ Enum225.CLIP45_7, 6 ],
  /* CLIP45_7 */ // 70

  [ Enum225.CLIP45_30, 8 ], /* CLIP45_30 */
  [ Enum225.CLIP45_7_AP, 3 ], /* CLIP45_7_AP */
  [ Enum225.CLIP45_30_AP, 3 ], /* CLIP45_30_AP */
  [ Enum225.CLIP45_7_HP, 3 ], /* CLIP45_7_HP */
  [ Enum225.CLIP45_30_HP, 3 ], /* CLIP45_30_HP */

  [ Enum225.CLIP357_6, 6 ], /* CLIP357_6 */
  [ Enum225.CLIP357_9, 5 ], /* CLIP357_9 */
  [ Enum225.CLIP357_6_AP, 3 ], /* CLIP357_6_AP */
  [ Enum225.CLIP357_9_AP, 3 ], /* CLIP357_9_AP */
  [ Enum225.CLIP357_6_HP, 3 ],
  /* CLIP357_6_HP */ // 80
  [ Enum225.CLIP357_9_HP, 3 ], /* CLIP357_9_HP */

  [ Enum225.CLIP545_30_AP, 6 ], /* CLIP545_30_AP */
  [ Enum225.CLIP545_30_HP, 3 ], /* CLIP545_30_HP */

  [ Enum225.CLIP556_30_AP, 6 ], /* CLIP556_30_AP */
  [ Enum225.CLIP556_30_HP, 3 ], /* CLIP556_30_HP */

  [ Enum225.CLIP762W_10_AP, 6 ], /* CLIP762W_10_AP */
  [ Enum225.CLIP762W_30_AP, 5 ], /* CLIP762W_30_AP */
  [ Enum225.CLIP762W_10_HP, 3 ], /* CLIP762W_10_HP */
  [ Enum225.CLIP762W_30_HP, 3 ], /* CLIP762W_30_HP */

  [ Enum225.CLIP762N_5_AP, 8 ],
  /* CLIP762N_5_AP */ // 90
  [ Enum225.CLIP762N_20_AP, 5 ], /* CLIP762N_20_AP */
  [ Enum225.CLIP762N_5_HP, 3 ], /* CLIP762N_5_HP */
  [ Enum225.CLIP762N_20_HP, 3 ], /* CLIP762N_20_HP */

  [ Enum225.CLIP47_50_SAP, 5 ], /* CLIP47_50_SAP */

  [ Enum225.CLIP57_50_AP, 6 ], /* CLIP57_50_AP */
  [ Enum225.CLIP57_50_HP, 3 ], /* CLIP57_50_HP */

  [ Enum225.CLIP12G_7, 9 ], /* CLIP12G_7 */
  [ Enum225.CLIP12G_7_BUCKSHOT, 9 ], /* CLIP12G_7_BUCKSHOT */

  [ Enum225.CLIPCAWS_10_SAP, 5 ], /* CLIPCAWS_10_SAP */
  [ Enum225.CLIPCAWS_10_FLECH, 3 ],
  /* CLIPCAWS_10_FLECH */ // 100

  [ Enum225.CLIPROCKET_AP, 3 ],
  [ Enum225.CLIPROCKET_HE, 1 ],
  [ Enum225.CLIPROCKET_HEAT, 1 ],

  [ Enum225.CLIPDART_SLEEP, 5 ],

  //	{ CLIPFLAME,						5	},

  // "launchables" (New! From McCain!) - these are basically ammo
  [ Enum225.GL_HE_GRENADE, 2 ],
  [ Enum225.GL_TEARGAS_GRENADE, 2 ],
  [ Enum225.GL_STUN_GRENADE, 2 ],
  [ Enum225.GL_SMOKE_GRENADE, 2 ],
  [ Enum225.MORTAR_SHELL, 1 ],

  // knives
  [ Enum225.COMBAT_KNIFE, 3 ],
  [ Enum225.THROWING_KNIFE, 6 ],
  [ Enum225.BRASS_KNUCKLES, 1 ],
  [ Enum225.MACHETE, 1 ],

  // attachments
  [ Enum225.SILENCER, 3 ],
  [ Enum225.SNIPERSCOPE, 3 ],
  [ Enum225.LASERSCOPE, 1 ],
  [ Enum225.BIPOD, 3 ],
  [ Enum225.DUCKBILL, 2 ],

  /*
          // grenades
          { STUN_GRENADE,					5 },
          { TEARGAS_GRENADE,			5 },
          { MUSTARD_GRENADE,			5 },
          { MINI_GRENADE,					5 },
          { HAND_GRENADE,					5 },
          { SMOKE_GRENADE,				5 },
  */

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Devin		( Explosives )
//
let gDevinInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.STUN_GRENADE, 3 ],
  [ Enum225.TEARGAS_GRENADE, 3 ],
  [ Enum225.MUSTARD_GRENADE, 2 ],
  [ Enum225.MINI_GRENADE, 3 ],
  [ Enum225.HAND_GRENADE, 2 ],
  [ Enum225.SMOKE_GRENADE, 3 ],

  [ Enum225.GL_HE_GRENADE, 2 ],
  [ Enum225.GL_TEARGAS_GRENADE, 2 ],
  [ Enum225.GL_STUN_GRENADE, 2 ],
  [ Enum225.GL_SMOKE_GRENADE, 2 ],
  [ Enum225.MORTAR_SHELL, 1 ],

  [ Enum225.CLIPROCKET_AP, 1 ],
  [ Enum225.CLIPROCKET_HE, 1 ],
  [ Enum225.CLIPROCKET_HEAT, 1 ],

  [ Enum225.DETONATOR, 10 ],
  [ Enum225.REMDETONATOR, 5 ],
  [ Enum225.REMOTEBOMBTRIGGER, 5 ],

  [ Enum225.MINE, 6 ],
  [ Enum225.RDX, 5 ],
  [ Enum225.TNT, 5 ],
  [ Enum225.C1, 4 ],
  [ Enum225.HMX, 3 ],
  [ Enum225.C4, 2 ],

  [ Enum225.SHAPED_CHARGE, 5 ],

  //	{	TRIP_FLARE,								2 },
  //	{	TRIP_KLAXON,							2 },

  [ Enum225.GLAUNCHER, 1 ], /* grenade launcher*/
  [ Enum225.UNDER_GLAUNCHER, 1 ], /* underslung g.l. */
  [ Enum225.ROCKET_LAUNCHER, 1 ], /* rocket Launcher */
  [ Enum225.MORTAR, 1 ],

  [ Enum225.METALDETECTOR, 2 ],
  [ Enum225.WIRECUTTERS, 1 ],
  [ Enum225.DUCT_TAPE, 1 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Franz	(Expensive pawn shop )
//
let gFranzInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.NIGHTGOGGLES, 3 ],

  [ Enum225.LASERSCOPE, 3 ],
  [ Enum225.METALDETECTOR, 2 ],
  [ Enum225.EXTENDEDEAR, 2 ],

  [ Enum225.DART_GUN, 1 ],

  [ Enum225.KEVLAR_VEST, 1 ],
  [ Enum225.KEVLAR_LEGGINGS, 1 ],
  [ Enum225.KEVLAR_HELMET, 1 ],
  [ Enum225.KEVLAR2_VEST, 1 ],
  [ Enum225.SPECTRA_VEST, 1 ],
  [ Enum225.SPECTRA_LEGGINGS, 1 ],
  [ Enum225.SPECTRA_HELMET, 1 ],

  [ Enum225.CERAMIC_PLATES, 1 ],

  [ Enum225.CAMOUFLAGEKIT, 1 ],

  [ Enum225.VIDEO_CAMERA, 1 ], // for robot quest

  [ Enum225.LAME_BOY, 1 ],
  [ Enum225.FUMBLE_PAK, 1 ],

  [ Enum225.GOLDWATCH, 1 ],
  [ Enum225.GOLFCLUBS, 1 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Keith		( Cheap Pawn Shop )
//
let gKeithInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.FIRSTAIDKIT, 5 ],

  // WARNING: Keith must not carry any guns, it would conflict with his story/quest

  [ Enum225.COMBAT_KNIFE, 2 ],
  [ Enum225.THROWING_KNIFE, 3 ],
  [ Enum225.BRASS_KNUCKLES, 1 ],
  [ Enum225.MACHETE, 1 ],

  [ Enum225.SUNGOGGLES, 3 ],
  [ Enum225.FLAK_JACKET, 2 ],
  [ Enum225.STEEL_HELMET, 3 ],
  [ Enum225.LEATHER_JACKET, 1 ],

  [ Enum225.CANTEEN, 5 ],
  [ Enum225.CROWBAR, 1 ],
  [ Enum225.JAR, 6 ],

  [ Enum225.TOOLKIT, 1 ],
  [ Enum225.GASMASK, 1 ],

  [ Enum225.SILVER_PLATTER, 1 ],

  [ Enum225.WALKMAN, 1 ],
  [ Enum225.PORTABLETV, 1 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Sam		( Hardware )
//
let gSamInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.FIRSTAIDKIT, 3 ],

  [ Enum225.LOCKSMITHKIT, 4 ],
  [ Enum225.TOOLKIT, 3 ],

  [ Enum225.CANTEEN, 5 ],

  [ Enum225.CROWBAR, 3 ],
  [ Enum225.WIRECUTTERS, 3 ],

  [ Enum225.DUCKBILL, 3 ],
  [ Enum225.JAR, 12 ],
  [ Enum225.BREAK_LIGHT, 12 ], // flares

  [ Enum225.METALDETECTOR, 1 ],

  [ Enum225.VIDEO_CAMERA, 1 ],

  [ Enum225.QUICK_GLUE, 3 ],
  [ Enum225.COPPER_WIRE, 5 ],
  [ Enum225.BATTERIES, 10 ],

  [ Enum225.CLIP9_15, 5 ],
  [ Enum225.CLIP9_30, 5 ],
  [ Enum225.CLIP38_6, 5 ],
  [ Enum225.CLIP45_7, 5 ],
  [ Enum225.CLIP45_30, 5 ],
  [ Enum225.CLIP357_6, 5 ],
  [ Enum225.CLIP357_9, 5 ],
  [ Enum225.CLIP12G_7, 9 ],
  [ Enum225.CLIP12G_7_BUCKSHOT, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Jake			( Junk )
//
let gJakeInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.FIRSTAIDKIT, 4 ],
  [ Enum225.MEDICKIT, 3 ],

  [ Enum225.SW38, 1 ],
  [ Enum225.CLIP38_6, 5 ],

  [ Enum225.JAR, 3 ],
  [ Enum225.CANTEEN, 2 ],
  [ Enum225.BEER, 6 ],

  [ Enum225.CROWBAR, 1 ],
  [ Enum225.WIRECUTTERS, 1 ],

  [ Enum225.COMBAT_KNIFE, 1 ],
  [ Enum225.THROWING_KNIFE, 1 ],
  [ Enum225.BRASS_KNUCKLES, 1 ],
  [ Enum225.MACHETE, 1 ],

  [ Enum225.BREAK_LIGHT, 5 ], // flares

  [ Enum225.BIPOD, 1 ],

  [ Enum225.TSHIRT, 6 ],
  [ Enum225.CIGARS, 3 ],
  [ Enum225.PORNOS, 1 ],

  [ Enum225.LOCKSMITHKIT, 1 ],

  // "new" items, presumed unsafe for demo
  [ Enum225.TSHIRT_DEIDRANNA, 2 ],
  [ Enum225.XRAY_BULB, 1 ],

  // additional stuff possible in real game
  [ Enum225.GLOCK_17, 1 ], /* Glock 17        */
  [ Enum225.GLOCK_18, 1 ], /* Glock 18        */
  [ Enum225.BERETTA_92F, 1 ], /* Beretta 92F     */
  [ Enum225.BERETTA_93R, 1 ], /* Beretta 93R     */
  [ Enum225.BARRACUDA, 1 ], /* .357 Barracuda  */
  [ Enum225.DESERTEAGLE, 1 ], /* .357 DesertEagle*/
  [ Enum225.M1911, 1 ], /* .45 M1911			 */

  [ Enum225.DISCARDED_LAW, 1 ],

  [ Enum225.STEEL_HELMET, 1 ],

  [ Enum225.TOOLKIT, 1 ],

  [ Enum225.WINE, 1 ],
  [ Enum225.ALCOHOL, 1 ],

  [ Enum225.GOLDWATCH, 1 ],
  [ Enum225.GOLFCLUBS, 1 ],
  [ Enum225.WALKMAN, 1 ],
  [ Enum225.PORTABLETV, 1 ],

  // stuff a real pawn shop wouldn't have, but it does make him a bit more useful
  [ Enum225.COMPOUND18, 1 ],
  [ Enum225.CERAMIC_PLATES, 1 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Howard		( Pharmaceuticals )
//
let gHowardInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.FIRSTAIDKIT, 10 ],
  [ Enum225.MEDICKIT, 5 ],
  [ Enum225.ADRENALINE_BOOSTER, 5 ],
  [ Enum225.REGEN_BOOSTER, 5 ],

  [ Enum225.ALCOHOL, 3 ],
  [ Enum225.COMBAT_KNIFE, 2 ],

  [ Enum225.CLIPDART_SLEEP, 5 ],

  [ Enum225.CHEWING_GUM, 3 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Gabby			( Creature parts and Blood )
//
let gGabbyInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.JAR, 12 ],
  [ Enum225.JAR_ELIXIR, 3 ],
  // buys these, but can't supply them (player is the only source)
  [ Enum225.JAR_CREATURE_BLOOD, 0 ],
  [ Enum225.JAR_QUEEN_CREATURE_BLOOD, 0 ],
  [ Enum225.BLOODCAT_CLAWS, 0 ],
  [ Enum225.BLOODCAT_TEETH, 0 ],
  [ Enum225.BLOODCAT_PELT, 0 ],
  [ Enum225.CREATURE_PART_CLAWS, 0 ],
  [ Enum225.CREATURE_PART_FLESH, 0 ],
  [ Enum225.CREATURE_PART_ORGAN, 0 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Frank  ( Alcohol )
//
let gFrankInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.BEER, 12 ],
  [ Enum225.WINE, 6 ],
  [ Enum225.ALCOHOL, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Elgin  ( Alcohol )
//
let gElginInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.BEER, 12 ],
  [ Enum225.WINE, 6 ],
  [ Enum225.ALCOHOL, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Manny  ( Alcohol )
//
let gMannyInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.BEER, 12 ],
  [ Enum225.WINE, 6 ],
  [ Enum225.ALCOHOL, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Herve Santos		( Alcohol )
//
let gHerveInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.BEER, 12 ],
  [ Enum225.WINE, 6 ],
  [ Enum225.ALCOHOL, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Peter Santos ( Alcohol )
//
let gPeterInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.BEER, 12 ],
  [ Enum225.WINE, 6 ],
  [ Enum225.ALCOHOL, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Alberto Santos		( Alcohol )
//
let gAlbertoInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.BEER, 12 ],
  [ Enum225.WINE, 6 ],
  [ Enum225.ALCOHOL, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Carlo Santos		( Alcohol )
//
let gCarloInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  [ Enum225.BEER, 12 ],
  [ Enum225.WINE, 6 ],
  [ Enum225.ALCOHOL, 9 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Micky	( BUYS Animal / Creature parts )
//

let gMickyInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  // ONLY BUYS THIS STUFF, DOESN'T SELL IT
  [ Enum225.BLOODCAT_CLAWS, 0 ],
  [ Enum225.BLOODCAT_TEETH, 0 ],
  [ Enum225.BLOODCAT_PELT, 0 ],
  [ Enum225.CREATURE_PART_CLAWS, 0 ],
  [ Enum225.CREATURE_PART_FLESH, 0 ],
  [ Enum225.CREATURE_PART_ORGAN, 0 ],
  [ Enum225.JAR_QUEEN_CREATURE_BLOOD, 0 ],

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Arnie		( Weapons REPAIR )
//
let gArnieInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  // NO INVENTORY

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Perko			( REPAIR)
//
let gPerkoInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  // NO INVENTORY

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

//
// Fredo			( Electronics REPAIR)
//
let gFredoInventory: DEALER_POSSIBLE_INV[] /* [] */ = [
  // NO INVENTORY

  [ LAST_DEALER_ITEM, NO_DEALER_ITEM ], // Last One
];

// prototypes

function GetDealersMaxItemAmount(ubDealerID: UINT8, usItemIndex: UINT16): INT8 {
  switch (ubDealerID) {
    case Enum197.ARMS_DEALER_TONY:
      return GetMaxItemAmount(gTonyInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_FRANK:
      return GetMaxItemAmount(gFrankInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_MICKY:
      return GetMaxItemAmount(gMickyInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_ARNIE:
      return GetMaxItemAmount(gArnieInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_PERKO:
      return GetMaxItemAmount(gPerkoInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_KEITH:
      return GetMaxItemAmount(gKeithInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_1:
      return GetMaxItemAmount(gHerveInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_2:
      return GetMaxItemAmount(gPeterInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_3:
      return GetMaxItemAmount(gAlbertoInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_4:
      return GetMaxItemAmount(gCarloInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_JAKE:
      return GetMaxItemAmount(gJakeInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_FRANZ:
      return GetMaxItemAmount(gFranzInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_HOWARD:
      return GetMaxItemAmount(gHowardInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_SAM:
      return GetMaxItemAmount(gSamInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_FREDO:
      return GetMaxItemAmount(gFredoInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_GABBY:
      return GetMaxItemAmount(gGabbyInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_DEVIN:
      return GetMaxItemAmount(gDevinInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_ELGIN:
      return GetMaxItemAmount(gElginInventory, usItemIndex);
      break;

    case Enum197.ARMS_DEALER_MANNY:
      return GetMaxItemAmount(gMannyInventory, usItemIndex);
      break;

    default:
      Assert(FALSE);
      return 0;
      break;
  }
}

function GetMaxItemAmount(pInv: Pointer<DEALER_POSSIBLE_INV>, usItemIndex: UINT16): INT8 {
  let usCnt: UINT16 = 0;

  // loop through the array until a the LAST_DEALER_ITEM is hit
  while (pInv[usCnt].sItemIndex != LAST_DEALER_ITEM) {
    // if this item is the one we want
    if (pInv[usCnt].sItemIndex == usItemIndex)
      return pInv[usCnt].ubOptimalNumber;

    // move to the next item
    usCnt++;
  }

  return NO_DEALER_ITEM;
}

function GetPointerToDealersPossibleInventory(ubArmsDealerID: UINT8): Pointer<DEALER_POSSIBLE_INV> {
  switch (ubArmsDealerID) {
    case Enum197.ARMS_DEALER_TONY:
      return gTonyInventory;
      break;

    case Enum197.ARMS_DEALER_FRANK:
      return gFrankInventory;
      break;

    case Enum197.ARMS_DEALER_MICKY:
      return gMickyInventory;
      break;

    case Enum197.ARMS_DEALER_ARNIE:
      return gArnieInventory;
      break;

    case Enum197.ARMS_DEALER_PERKO:
      return gPerkoInventory;
      break;

    case Enum197.ARMS_DEALER_KEITH:
      return gKeithInventory;
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_1:
      return gHerveInventory;
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_2:
      return gPeterInventory;
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_3:
      return gAlbertoInventory;
      break;

    case Enum197.ARMS_DEALER_BAR_BRO_4:
      return gCarloInventory;
      break;

    case Enum197.ARMS_DEALER_JAKE:
      return gJakeInventory;
      break;

    case Enum197.ARMS_DEALER_FRANZ:
      return gFranzInventory;
      break;

    case Enum197.ARMS_DEALER_HOWARD:
      return gHowardInventory;
      break;

    case Enum197.ARMS_DEALER_SAM:
      return gSamInventory;
      break;

    case Enum197.ARMS_DEALER_FREDO:
      return gFredoInventory;
      break;

    case Enum197.ARMS_DEALER_GABBY:
      return gGabbyInventory;
      break;

    case Enum197.ARMS_DEALER_DEVIN:
      return gDevinInventory;
      break;

    case Enum197.ARMS_DEALER_ELGIN:
      return gElginInventory;
      break;

    case Enum197.ARMS_DEALER_MANNY:
      return gMannyInventory;
      break;

    default:
      return NULL;
  }
}

function GetCurrentSuitabilityForItem(bArmsDealer: INT8, usItemIndex: UINT16): UINT8 {
  let ubItemCoolness: UINT8;
  let ubMinCoolness: UINT8;
  let ubMaxCoolness: UINT8;

  // item suitability varies with the player's maximum progress through the game.  The farther he gets, the better items
  // we make available.  Weak items become more and more infrequent later in the game, although they never quite vanish.

  // items illegal in this game are unsuitable [this checks guns vs. current GunSet!]
  if (!ItemIsLegal(usItemIndex)) {
    return ITEM_SUITABILITY_NONE;
  }

  // items normally not sold at shops are unsuitable
  if (Item[usItemIndex].fFlags & ITEM_NOT_BUYABLE) {
    return ITEM_SUITABILITY_NONE;
  }

  ubItemCoolness = Item[usItemIndex].ubCoolness;

  if (ubItemCoolness == 0) {
    // items without a coolness rating can't be sold to the player by shopkeepers
    return ITEM_SUITABILITY_NONE;
  }

  // the following staple items are always deemed highly suitable regardless of player's progress:
  switch (usItemIndex) {
    case Enum225.CLIP38_6:
    case Enum225.CLIP9_15:
    case Enum225.CLIP9_30:
    case Enum225.CLIP357_6:
    case Enum225.CLIP357_9:
    case Enum225.CLIP45_7:
    case Enum225.CLIP45_30:
    case Enum225.CLIP12G_7:
    case Enum225.CLIP12G_7_BUCKSHOT:
    case Enum225.CLIP545_30_HP:
    case Enum225.CLIP556_30_HP:
    case Enum225.CLIP762W_10_HP:
    case Enum225.CLIP762W_30_HP:
    case Enum225.CLIP762N_5_HP:
    case Enum225.CLIP762N_20_HP:

    case Enum225.FIRSTAIDKIT:
    case Enum225.MEDICKIT:
    case Enum225.TOOLKIT:
    case Enum225.LOCKSMITHKIT:

    case Enum225.CANTEEN:
    case Enum225.CROWBAR:
    case Enum225.JAR:
    case Enum225.JAR_ELIXIR:
    case Enum225.JAR_CREATURE_BLOOD:

      return ITEM_SUITABILITY_ALWAYS;
  }

  // If it's not BobbyRay, Tony, or Devin
  if ((bArmsDealer != -1) && (bArmsDealer != Enum197.ARMS_DEALER_TONY) && (bArmsDealer != Enum197.ARMS_DEALER_DEVIN)) {
    // all the other dealers have very limited inventories, so their suitability remains constant at all times in game
    return ITEM_SUITABILITY_HIGH;
  }

  // figure out the appropriate range of coolness based on player's maximum progress so far

  ubMinCoolness = HighestPlayerProgressPercentage() / 10;
  ubMaxCoolness = (HighestPlayerProgressPercentage() / 10) + 1;

  // Tony has the better stuff sooner (than Bobby R's)
  if (bArmsDealer == Enum197.ARMS_DEALER_TONY) {
    ubMinCoolness += 1;
    ubMaxCoolness += 1;
  } else if (bArmsDealer == Enum197.ARMS_DEALER_DEVIN) {
    // almost everything Devin sells is pretty cool (4+), so gotta apply a minimum or he'd have nothing early on
    if (ubMinCoolness < 3) {
      ubMinCoolness = 3;
      ubMaxCoolness = 4;
    }
  }

  ubMinCoolness = max(1, min(9, ubMinCoolness));
  ubMaxCoolness = max(2, min(10, ubMaxCoolness));

  // if item is too cool for current level of progress
  if (ubItemCoolness > ubMaxCoolness) {
    return ITEM_SUITABILITY_NONE;
  }

  // if item is exactly within the current coolness window
  if ((ubItemCoolness >= ubMinCoolness) && (ubItemCoolness <= ubMaxCoolness)) {
    return ITEM_SUITABILITY_HIGH;
  }

  // if item is still relatively close to low end of the window
  if ((ubItemCoolness + 2) >= ubMinCoolness) {
    return ITEM_SUITABILITY_MEDIUM;
  }

  // item is way uncool for player's current progress, but it's still possible for it to make an appearance
  return ITEM_SUITABILITY_LOW;
}

function ChanceOfItemTransaction(bArmsDealer: INT8, usItemIndex: UINT16, fDealerIsSelling: BOOLEAN, fUsed: BOOLEAN): UINT8 {
  let ubItemCoolness: UINT8;
  let ubChance: UINT8 = 0;
  let fBobbyRay: BOOLEAN = FALSE;

  // make sure dealers don't carry used items that they shouldn't
  if (fUsed && !fDealerIsSelling && !CanDealerItemBeSoldUsed(usItemIndex))
    return 0;

  if (bArmsDealer == -1) {
    // Bobby Ray has an easier time getting resupplied than the local dealers do
    fBobbyRay = TRUE;
  }

  ubItemCoolness = Item[usItemIndex].ubCoolness;

  switch (GetCurrentSuitabilityForItem(bArmsDealer, usItemIndex)) {
    case ITEM_SUITABILITY_NONE:
      if (fDealerIsSelling) {
        // dealer always gets rid of stuff that is too advanced or inappropriate ASAP
        ubChance = 100;
      } else // dealer is buying
      {
        // can't get these at all
        ubChance = 0;
      }
      break;

    case ITEM_SUITABILITY_LOW:
      ubChance = (fBobbyRay) ? 25 : 15;
      break;

    case ITEM_SUITABILITY_MEDIUM:
      ubChance = (fBobbyRay) ? 50 : 30;
      break;

    case ITEM_SUITABILITY_HIGH:
      ubChance = (fBobbyRay) ? 75 : 50;
      break;

    case ITEM_SUITABILITY_ALWAYS:
      if (fDealerIsSelling) {
        // sells just like suitability high
        ubChance = 75;
      } else // dealer is buying
      {
        // dealer can always get a (re)supply of these
        ubChance = 100;
      }
      break;

    default:
      Assert(0);
      break;
  }

  // if there's any uncertainty
  if ((ubChance > 0) && (ubChance < 100)) {
    // cooler items sell faster
    if (fDealerIsSelling) {
      ubChance += (5 * ubItemCoolness);

      // ARM: New - keep stuff on the shelves longer
      ubChance /= 2;
    }

    // used items are traded more rarely
    if (fUsed) {
      ubChance /= 2;
    }
  }

  return ubChance;
}

function ItemTransactionOccurs(bArmsDealer: INT8, usItemIndex: UINT16, fDealerIsSelling: BOOLEAN, fUsed: BOOLEAN): BOOLEAN {
  let ubChance: UINT8;
  let sInventorySlot: INT16;

  ubChance = ChanceOfItemTransaction(bArmsDealer, usItemIndex, fDealerIsSelling, fUsed);

  // if the dealer is buying, and a chance exists (i.e. the item is "eligible")
  if (!fDealerIsSelling && (ubChance > 0)) {
    // mark it as such
    if (bArmsDealer == -1) {
      if (fUsed) {
        sInventorySlot = GetInventorySlotForItem(LaptopSaveInfo.BobbyRayUsedInventory, usItemIndex, fUsed);
        LaptopSaveInfo.BobbyRayUsedInventory[sInventorySlot].fPreviouslyEligible = TRUE;
      } else {
        sInventorySlot = GetInventorySlotForItem(LaptopSaveInfo.BobbyRayInventory, usItemIndex, fUsed);
        LaptopSaveInfo.BobbyRayInventory[sInventorySlot].fPreviouslyEligible = TRUE;
      }
    } else {
      gArmsDealersInventory[bArmsDealer][usItemIndex].fPreviouslyEligible = TRUE;
    }
  }

  // roll to see if a transaction occurs
  if (Random(100) < ubChance) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function DetermineInitialInvItems(bArmsDealerID: INT8, usItemIndex: UINT16, ubChances: UINT8, fUsed: BOOLEAN): UINT8 {
  let ubNumBought: UINT8;
  let ubCnt: UINT8;

  // initial inventory is now rolled for one item at a time, instead of one type at a time, to improve variety
  ubNumBought = 0;
  for (ubCnt = 0; ubCnt < ubChances; ubCnt++) {
    if (ItemTransactionOccurs(bArmsDealerID, usItemIndex, DEALER_BUYING, fUsed)) {
      ubNumBought++;
    }
  }

  return ubNumBought;
}

function HowManyItemsAreSold(bArmsDealerID: INT8, usItemIndex: UINT16, ubNumInStock: UINT8, fUsed: BOOLEAN): UINT8 {
  let ubNumSold: UINT8;
  let ubCnt: UINT8;

  // items are now virtually "sold" one at a time
  ubNumSold = 0;
  for (ubCnt = 0; ubCnt < ubNumInStock; ubCnt++) {
    if (ItemTransactionOccurs(bArmsDealerID, usItemIndex, DEALER_SELLING, fUsed)) {
      ubNumSold++;
    }
  }

  return ubNumSold;
}

function HowManyItemsToReorder(ubWanted: UINT8, ubStillHave: UINT8): UINT8 {
  let ubNumReordered: UINT8;

  Assert(ubStillHave <= ubWanted);

  ubNumReordered = ubWanted - ubStillHave;

  // randomize the amount. 33% of the time we add to it, 33% we subtract from it, rest leave it alone
  switch (Random(3)) {
    case 0:
      ubNumReordered += ubNumReordered / 2;
      break;
    case 1:
      ubNumReordered -= ubNumReordered / 2;
      break;
  }

  return ubNumReordered;
}

function BobbyRayItemQsortCompare(pArg1: Pointer<void>, pArg2: Pointer<void>): int {
  let usItem1Index: UINT16;
  let usItem2Index: UINT16;
  let ubItem1Quality: UINT8;
  let ubItem2Quality: UINT8;

  usItem1Index = (pArg1).value.usItemIndex;
  usItem2Index = (pArg2).value.usItemIndex;

  ubItem1Quality = (pArg1).value.ubItemQuality;
  ubItem2Quality = (pArg2).value.ubItemQuality;

  return CompareItemsForSorting(usItem1Index, usItem2Index, ubItem1Quality, ubItem2Quality);
}

function ArmsDealerItemQsortCompare(pArg1: Pointer<void>, pArg2: Pointer<void>): int {
  let usItem1Index: UINT16;
  let usItem2Index: UINT16;
  let ubItem1Quality: UINT8;
  let ubItem2Quality: UINT8;

  usItem1Index = (pArg1).value.sItemIndex;
  usItem2Index = (pArg2).value.sItemIndex;

  ubItem1Quality = (pArg1).value.ItemObject.bStatus[0];
  ubItem2Quality = (pArg2).value.ItemObject.bStatus[0];

  return CompareItemsForSorting(usItem1Index, usItem2Index, ubItem1Quality, ubItem2Quality);
}

function RepairmanItemQsortCompare(pArg1: Pointer<void>, pArg2: Pointer<void>): int {
  let pInvSlot1: Pointer<INVENTORY_IN_SLOT>;
  let pInvSlot2: Pointer<INVENTORY_IN_SLOT>;
  let uiRepairTime1: UINT32;
  let uiRepairTime2: UINT32;

  pInvSlot1 = pArg1;
  pInvSlot2 = pArg2;

  Assert(pInvSlot1.value.sSpecialItemElement != -1);
  Assert(pInvSlot2.value.sSpecialItemElement != -1);

  uiRepairTime1 = gArmsDealersInventory[gbSelectedArmsDealerID][pInvSlot1.value.sItemIndex].SpecialItem[pInvSlot1.value.sSpecialItemElement].uiRepairDoneTime;
  uiRepairTime2 = gArmsDealersInventory[gbSelectedArmsDealerID][pInvSlot2.value.sItemIndex].SpecialItem[pInvSlot2.value.sSpecialItemElement].uiRepairDoneTime;

  // lower reapir time first
  if (uiRepairTime1 < uiRepairTime2) {
    return -1;
  } else if (uiRepairTime1 > uiRepairTime2) {
    return 1;
  } else {
    return 0;
  }
}

function CompareItemsForSorting(usItem1Index: UINT16, usItem2Index: UINT16, ubItem1Quality: UINT8, ubItem2Quality: UINT8): int {
  let ubItem1Category: UINT8;
  let ubItem2Category: UINT8;
  let usItem1Price: UINT16;
  let usItem2Price: UINT16;
  let ubItem1Coolness: UINT8;
  let ubItem2Coolness: UINT8;

  ubItem1Category = GetDealerItemCategoryNumber(usItem1Index);
  ubItem2Category = GetDealerItemCategoryNumber(usItem2Index);

  // lower category first
  if (ubItem1Category < ubItem2Category) {
    return -1;
  } else if (ubItem1Category > ubItem2Category) {
    return 1;
  } else {
    // the same category
    if (Item[usItem1Index].usItemClass == IC_AMMO && Item[usItem2Index].usItemClass == IC_AMMO) {
      let ubItem1Calibre: UINT8;
      let ubItem2Calibre: UINT8;
      let ubItem1MagSize: UINT8;
      let ubItem2MagSize: UINT8;

      // AMMO is sorted by caliber first
      ubItem1Calibre = Magazine[Item[usItem1Index].ubClassIndex].ubCalibre;
      ubItem2Calibre = Magazine[Item[usItem2Index].ubClassIndex].ubCalibre;
      if (ubItem1Calibre > ubItem2Calibre) {
        return -1;
      } else if (ubItem1Calibre < ubItem2Calibre) {
        return 1;
      }
      // the same caliber - compare size of magazine, then fall out of if statement
      ubItem1MagSize = Magazine[Item[usItem1Index].ubClassIndex].ubMagSize;
      ubItem2MagSize = Magazine[Item[usItem2Index].ubClassIndex].ubMagSize;
      if (ubItem1MagSize > ubItem2MagSize) {
        return -1;
      } else if (ubItem1MagSize < ubItem2MagSize) {
        return 1;
      }
    } else {
      // items other than ammo are compared on coolness first
      ubItem1Coolness = Item[usItem1Index].ubCoolness;
      ubItem2Coolness = Item[usItem2Index].ubCoolness;

      // higher coolness first
      if (ubItem1Coolness > ubItem2Coolness) {
        return -1;
      } else if (ubItem1Coolness < ubItem2Coolness) {
        return 1;
      }
    }

    // the same coolness/caliber - compare base prices then
    usItem1Price = Item[usItem1Index].usPrice;
    usItem2Price = Item[usItem2Index].usPrice;

    // higher price first
    if (usItem1Price > usItem2Price) {
      return -1;
    } else if (usItem1Price < usItem2Price) {
      return 1;
    } else {
      // the same price - compare item #s, then

      // lower index first
      if (usItem1Index < usItem2Index) {
        return -1;
      } else if (usItem1Index > usItem2Index) {
        return 1;
      } else {
        // same item type = compare item quality, then

        // higher quality first
        if (ubItem1Quality > ubItem2Quality) {
          return -1;
        } else if (ubItem1Quality < ubItem2Quality) {
          return 1;
        } else {
          // identical items!
          return 0;
        }
      }
    }
  }
}

function GetDealerItemCategoryNumber(usItemIndex: UINT16): UINT8 {
  let uiItemClass: UINT32;
  let ubWeaponClass: UINT8;
  let ubCategory: UINT8 = 0;

  uiItemClass = Item[usItemIndex].usItemClass;

  if (usItemIndex < Enum225.MAX_WEAPONS) {
    ubWeaponClass = Weapon[usItemIndex].ubWeaponClass;
  } else {
    // not a weapon, so no weapon class, this won't be needed
    ubWeaponClass = 0;
  }

  ubCategory = 0;

  // search table until end-of-list marker is encountered
  while (DealerItemSortInfo[ubCategory].uiItemClass != IC_NONE) {
    if (DealerItemSortInfo[ubCategory].uiItemClass == uiItemClass) {
      // if not a type of gun
      if (uiItemClass != IC_GUN) {
        // then we're found it
        return ubCategory;
      } else {
        // for guns, must also match on weapon class
        if (DealerItemSortInfo[ubCategory].ubWeaponClass == ubWeaponClass) {
          // then we're found it
          return ubCategory;
        }
      }
    }

    // check vs. next category in the list
    ubCategory++;
  }

  // should never be trying to locate an item that's not covered in the table!
  Assert(FALSE);
  return 0;
}

function CanDealerItemBeSoldUsed(usItemIndex: UINT16): BOOLEAN {
  if (!(Item[usItemIndex].fFlags & ITEM_DAMAGEABLE))
    return FALSE;

  // certain items, although they're damagable, shouldn't be sold in a used condition
  return DealerItemSortInfo[GetDealerItemCategoryNumber(usItemIndex)].fAllowUsed;
}
