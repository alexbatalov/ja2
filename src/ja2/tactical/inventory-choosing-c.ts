const ENEMYAMMODROPRATE = 50; // % of time enemies drop ammunition
const ENEMYGRENADEDROPRATE = 25; // % of time enemies drop grenades
const ENEMYEQUIPDROPRATE = 15; // % of stuff enemies drop equipment

// only 1/10th of what enemies drop...
const MILITIAAMMODROPRATE = 5; // % of time enemies drop ammunition
const MILITIAGRENADEDROPRATE = 3; // % of time enemies drop grenades
const MILITIAEQUIPDROPRATE = 2; // % of stuff enemies drop equipment

const MAX_MORTARS_PER_TEAM = 1; // one team can't randomly roll more than this many mortars per sector

let guiMortarsRolledByTeam: UINT32 = 0;

let gRegularArmyGunChoices: ARMY_GUN_CHOICE_TYPE[] /* [ARMY_GUN_LEVELS] */ = [
  // INDEX		CLASS				 #CHOICES
  [
   /* 0 - lo pistols			*/ 2, Enum225.SW38, Enum225.DESERTEAGLE, -1, -1, -1 ],
  [
   /* 1 - hi pistols			*/ 2, Enum225.GLOCK_17, Enum225.BERETTA_93R, -1, -1, -1 ],
  [
   /* 2 - lo SMG/shotgun	*/ 2, Enum225.M870, Enum225.MP5K, -1, -1, -1 ],
  [
   /* 3 - lo rifles			*/ 1, Enum225.MINI14, -1, -1, -1, -1 ],
  [
   /* 4 - hi SMGs				*/ 2, Enum225.MAC10, Enum225.COMMANDO, -1, -1, -1 ],
  [
   /* 5 - med rifles  		*/ 1, Enum225.G41, -1, -1, -1, -1 ],
  [
   /* 6 - sniper rifles	*/ 1, Enum225.M24, -1, -1, -1, -1 ],
  [
   /* 7 - hi rifles			*/ 2, Enum225.M14, Enum225.C7, -1, -1, -1 ],
  [
   /* 8 - best rifle			*/ 1, Enum225.FNFAL, -1, -1, -1, -1 ],
  [
   /* 9 - machine guns		*/ 1, Enum225.MINIMI, -1, -1, -1, -1 ],
  [
   /* 10- rocket rifle		*/ 2, Enum225.ROCKET_RIFLE, Enum225.MINIMI, -1, -1, -1 ],
];

let gExtendedArmyGunChoices: ARMY_GUN_CHOICE_TYPE[] /* [ARMY_GUN_LEVELS] */ = [
  // INDEX		CLASS				 #CHOICES
  [
   /* 0 - lo pistols			*/ 5, Enum225.SW38, Enum225.BARRACUDA, Enum225.DESERTEAGLE, Enum225.GLOCK_17, Enum225.M1911 ],
  [
   /* 1 - hi pist/shtgn	*/ 4, Enum225.GLOCK_18, Enum225.BERETTA_93R, Enum225.BERETTA_92F, Enum225.M870, -1 ],
  [
   /* 2 - lo SMGs/shtgn	*/ 5, Enum225.TYPE85, Enum225.THOMPSON, Enum225.MP53, Enum225.MP5K, Enum225.SPAS15 ],
  [
   /* 3 - lo rifles    	*/ 2, Enum225.MINI14, Enum225.SKS, -1, -1, -1 ],
  [
   /* 4 - hi SMGs				*/ 3, Enum225.MAC10, Enum225.AKSU74, Enum225.COMMANDO, -1, -1 ],
  [
   /* 5 - med rifles  		*/ 4, Enum225.AKM, Enum225.G3A3, Enum225.G41, Enum225.AK74, -1 ],
  [
   /* 6 - sniper rifles	*/ 2, Enum225.DRAGUNOV, Enum225.M24, -1, -1, -1 ],
  [
   /* 7 - hi rifles			*/ 4, Enum225.FAMAS, Enum225.M14, Enum225.AUG, Enum225.C7, -1 ],
  [
   /* 8 - best rifle			*/ 1, Enum225.FNFAL, -1, -1, -1, -1 ],
  [
   /* 9 - machine guns		*/ 3, Enum225.MINIMI, Enum225.RPK74, Enum225.HK21E, -1, -1 ],
  [
   /* 10- rocket rifle		*/ 4, Enum225.ROCKET_RIFLE, Enum225.ROCKET_RIFLE, Enum225.RPK74, Enum225.HK21E, -1 ],
];

function InitArmyGunTypes(): void {
  let pGunChoiceTable: Pointer<ARMY_GUN_CHOICE_TYPE>;
  let uiGunLevel: UINT32;
  let uiChoice: UINT32;
  let bItemNo: INT8;
  let ubWeapon: UINT8;

  // depending on selection of the gun nut option
  if (gGameOptions.fGunNut) {
    // use table of extended gun choices
    pGunChoiceTable = addressof(gExtendedArmyGunChoices[0]);
  } else {
    // use table of regular gun choices
    pGunChoiceTable = addressof(gRegularArmyGunChoices[0]);
  }

  // for each gun category
  for (uiGunLevel = 0; uiGunLevel < ARMY_GUN_LEVELS; uiGunLevel++) {
    // choose one the of the possible gun choices to be used by the army for this game & store it
    uiChoice = Random(pGunChoiceTable[uiGunLevel].ubChoices);
    bItemNo = pGunChoiceTable[uiGunLevel].bItemNo[uiChoice];
    AssertMsg(bItemNo != -1, "Invalid army gun choice in table");
    gStrategicStatus.ubStandardArmyGunIndex[uiGunLevel] = bItemNo;
  }

  // set all flags that track whether this weapon type has been dropped before to FALSE
  for (ubWeapon = 0; ubWeapon < Enum225.MAX_WEAPONS; ubWeapon++) {
    gStrategicStatus.fWeaponDroppedAlready[ubWeapon] = false;
  }

  // avoid auto-drops for the gun class with the crappiest guns in it
  MarkAllWeaponsOfSameGunClassAsDropped(Enum225.SW38);
}

function GetWeaponClass(usGun: UINT16): INT8 {
  let uiGunLevel: UINT32;
  let uiLoop: UINT32;

  // always use the extended list since it contains all guns...
  for (uiGunLevel = 0; uiGunLevel < ARMY_GUN_LEVELS; uiGunLevel++) {
    for (uiLoop = 0; uiLoop < gExtendedArmyGunChoices[uiGunLevel].ubChoices; uiLoop++) {
      if (gExtendedArmyGunChoices[uiGunLevel].bItemNo[uiLoop] == usGun) {
        return uiGunLevel;
      }
    }
  }
  return -1;
}

function MarkAllWeaponsOfSameGunClassAsDropped(usWeapon: UINT16): void {
  let bGunClass: INT8;
  let uiLoop: UINT32;

  // mark that item itself as dropped, whether or not it's part of a gun class
  gStrategicStatus.fWeaponDroppedAlready[usWeapon] = true;

  bGunClass = GetWeaponClass(usWeapon);

  // if the gun belongs to a gun class (mortars, GLs, LAWs, etc. do not and are handled independently)
  if (bGunClass != -1) {
    // then mark EVERY gun in that class as dropped
    for (uiLoop = 0; uiLoop < gExtendedArmyGunChoices[bGunClass].ubChoices; uiLoop++) {
      gStrategicStatus.fWeaponDroppedAlready[gExtendedArmyGunChoices[bGunClass].bItemNo[uiLoop]] = true;
    }
  }
}

// Chooses equipment based on the relative equipment level (0-4) with best being 4.  It allocates a range
// of equipment to choose from.
// NOTE:  I'm just winging it for the decisions on which items that different groups can have.  Basically,
// there are variations, so a guy at a certain level may get a better gun and worse armour or vice versa.
function GenerateRandomEquipment(pp: Pointer<SOLDIERCREATE_STRUCT>, bSoldierClass: INT8, bEquipmentRating: INT8): void {
  let pItem: Pointer<OBJECTTYPE>;
  // general rating information
  let bRating: INT8 = 0;
  // numbers of items
  let bAmmoClips: INT8 = 0;
  let bGrenades: INT8 = 0;
  let fAttachment: boolean = false;
  // item levels
  let bWeaponClass: INT8 = 0;
  let bHelmetClass: INT8 = 0;
  let bVestClass: INT8 = 0;
  let bLeggingClass: INT8 = 0;
  let bAttachClass: INT8 = 0;
  let bGrenadeClass: INT8 = 0;
  let bKnifeClass: INT8 = 0;
  let bKitClass: INT8 = 0;
  let bMiscClass: INT8 = 0;
  let bBombClass: INT8 = 0;
  // special weapons
  let fMortar: boolean = false;
  let fGrenadeLauncher: boolean = false;
  let fLAW: boolean = false;
  let i: INT32;
  let bEquipmentModifier: INT8;
  let ubMaxSpecialWeaponRoll: UINT8;

  Assert(pp);

  // kids don't get anything 'cause they don't have any weapon animations and the rest is inappropriate
  if ((pp.value.bBodyType == Enum194.HATKIDCIV) || (pp.value.bBodyType == Enum194.KIDCIV)) {
    return;
  }

  if ((pp.value.bBodyType == Enum194.TANK_NE) || (pp.value.bBodyType == Enum194.TANK_NW)) {
    EquipTank(pp);
    return;
  }

  Assert((bSoldierClass >= Enum262.SOLDIER_CLASS_NONE) && (bSoldierClass <= Enum262.SOLDIER_CLASS_ELITE_MILITIA));
  Assert((bEquipmentRating >= 0) && (bEquipmentRating <= 4));

  // equipment level is modified by 1/10 of the difficulty percentage, -5, so it's between -5 to +5
  // (on normal, this is actually -4 to +4, easy is -5 to +3, and hard is -3 to +5)
  bEquipmentModifier = bEquipmentRating + ((CalcDifficultyModifier(bSoldierClass) / 10) - 5);

  switch (bSoldierClass) {
    case Enum262.SOLDIER_CLASS_NONE:
      // ammo is here only so that civilians with pre-assigned ammo will get some clips for it!
      bAmmoClips = (1 + Random(2));

      // civilians get nothing, anyone who should get something should be preassigned by Linda
      break;

    case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
    case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
      bRating = Enum223.BAD_ADMINISTRATOR_EQUIPMENT_RATING + bEquipmentModifier;
      bRating = Math.max(MIN_EQUIPMENT_CLASS, Math.min(MAX_EQUIPMENT_CLASS, bRating));

      bWeaponClass = bRating;

      // Note:  in some cases the class of armour and/or helmet won't be high enough to make
      //			 the lowest level.
      bVestClass = bRating;
      bHelmetClass = bRating;
      // no leggings

      if (Random(2))
        bKnifeClass = bRating;

      bAmmoClips = (1 + Random(2));

      if (bRating >= Enum223.GOOD_ADMINISTRATOR_EQUIPMENT_RATING) {
        bAmmoClips++;

        bKitClass = bRating;
        bMiscClass = bRating;
      }

      if (bRating >= Enum223.GREAT_ADMINISTRATOR_EQUIPMENT_RATING) {
        bGrenades = 1, bGrenadeClass = bRating;
      }

      if ((bRating > MIN_EQUIPMENT_CLASS) && bRating < MAX_EQUIPMENT_CLASS) {
        // Randomly decide if there is to be an upgrade of guns vs armour (one goes up, the other down)
        switch (Random(5)) {
          case 0:
            bWeaponClass++, bVestClass--;
            break; // better gun, worse armour
          case 1:
            bWeaponClass--, bVestClass++;
            break; // worse gun, better armour
        }
      }
      break;

    case Enum262.SOLDIER_CLASS_ARMY:
    case Enum262.SOLDIER_CLASS_REG_MILITIA:
      // army guys tend to have a broad range of equipment
      bRating = Enum223.BAD_ARMY_EQUIPMENT_RATING + bEquipmentModifier;
      bRating = Math.max(MIN_EQUIPMENT_CLASS, Math.min(MAX_EQUIPMENT_CLASS, bRating));

      bWeaponClass = bRating;
      bVestClass = bRating;
      bHelmetClass = bRating;
      bGrenadeClass = bRating;

      if ((bRating >= Enum223.GOOD_ARMY_EQUIPMENT_RATING) && (Random(100) < 33)) {
        fAttachment = true;
        bAttachClass = bRating;
      }

      bAmmoClips = (2 + Random(2));

      if (bRating >= Enum223.AVERAGE_ARMY_EQUIPMENT_RATING) {
        bGrenades = Random(2);
        bKitClass = bRating;
        bMiscClass = bRating;
      }

      if (bRating >= Enum223.GOOD_ARMY_EQUIPMENT_RATING) {
        bGrenades++;
      }

      if (bRating >= Enum223.GREAT_ARMY_EQUIPMENT_RATING) {
        bGrenades++;

        bLeggingClass = bRating;

        if (Chance(25)) {
          bBombClass = bRating;
        }
      }

      if (Random(2))
        bKnifeClass = bRating;

      if ((bRating > MIN_EQUIPMENT_CLASS) && bRating < MAX_EQUIPMENT_CLASS) {
        switch (Random(7)) {
          case 3:
            bWeaponClass++, bVestClass--;
            break; // better gun, worse armour
          case 4:
            bWeaponClass--, bVestClass++;
            break; // worse gun, better armour
          case 5:
            bVestClass++, bHelmetClass--;
            break; // better armour, worse helmet
          case 6:
            bVestClass--, bHelmetClass++;
            break; // worse armour, better helmet
        }
      }

      // if well-enough equipped, 1/5 chance of something really special
      if ((bRating >= Enum223.GREAT_ARMY_EQUIPMENT_RATING) && (Random(100) < 20)) {
        // give this man a special weapon!  No mortars if underground, however
        ubMaxSpecialWeaponRoll = (!IsAutoResolveActive() && (gbWorldSectorZ != 0)) ? 6 : 7;
        switch (Random(ubMaxSpecialWeaponRoll)) {
          case 0:
          case 1:
          case 2:
            if (pp.value.bExpLevel >= 3) {
              // grenade launcher
              fGrenadeLauncher = true;
              bGrenades = 3 + (Random(3)); // 3-5
            }
            break;

          case 3:
          case 4:
          case 5:
            if (pp.value.bExpLevel >= 4) {
              // LAW rocket launcher
              fLAW = true;
            }
            break;

          case 6:
            // one per team maximum!
            if ((pp.value.bExpLevel >= 5) && (guiMortarsRolledByTeam < MAX_MORTARS_PER_TEAM)) {
              // mortar
              fMortar = true;
              guiMortarsRolledByTeam++;

              // the grenades will actually represent mortar shells in this case
              bGrenades = 2 + (Random(3)); // 2-4
              bGrenadeClass = MORTAR_GRENADE_CLASS;
            }
            break;
        }
      }
      break;

    case Enum262.SOLDIER_CLASS_ELITE:
    case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
      bRating = Enum223.BAD_ELITE_EQUIPMENT_RATING + bEquipmentModifier;
      bRating = Math.max(MIN_EQUIPMENT_CLASS, Math.min(MAX_EQUIPMENT_CLASS, bRating));

      bWeaponClass = bRating;
      bHelmetClass = bRating;
      bVestClass = bRating;
      bLeggingClass = bRating;
      bAttachClass = bRating;
      bGrenadeClass = bRating;
      bKitClass = bRating;
      bMiscClass = bRating;

      if (Chance(25)) {
        bBombClass = bRating;
      }

      bAmmoClips = (3 + Random(2));
      bGrenades = (1 + Random(3));

      if ((bRating >= Enum223.AVERAGE_ELITE_EQUIPMENT_RATING) && (Random(100) < 75)) {
        fAttachment = true;
        bAttachClass = bRating;
      }

      if (Random(2))
        bKnifeClass = bRating;

      if ((bRating > MIN_EQUIPMENT_CLASS) && bRating < MAX_EQUIPMENT_CLASS) {
        switch (Random(11)) {
          case 4:
            bWeaponClass++, bVestClass--;
            break;
          case 5:
            bWeaponClass--, bVestClass--;
            break;
          case 6:
            bVestClass++, bHelmetClass--;
            break;
          case 7:
            bGrenades += 2;
            break;
          case 8:
            bHelmetClass++;
            break;
          case 9:
            bVestClass++;
            break;
          case 10:
            bWeaponClass++;
            break;
        }
      }

      // if well-enough equipped, 1/3 chance of something really special
      if ((bRating >= Enum223.GOOD_ELITE_EQUIPMENT_RATING) && (Random(100) < 33)) {
        // give this man a special weapon!  No mortars if underground, however
        ubMaxSpecialWeaponRoll = (!IsAutoResolveActive() && (gbWorldSectorZ != 0)) ? 6 : 7;
        switch (Random(ubMaxSpecialWeaponRoll)) {
          case 0:
          case 1:
          case 2:
            // grenade launcher
            fGrenadeLauncher = true;
            bGrenades = 4 + (Random(4)); // 4-7
            break;
          case 3:
          case 4:
          case 5:
            // LAW rocket launcher
            fLAW = true;
            break;
          case 6:
            // one per team maximum!
            if (guiMortarsRolledByTeam < MAX_MORTARS_PER_TEAM) {
              // mortar
              fMortar = true;
              guiMortarsRolledByTeam++;

              // the grenades will actually represent mortar shells in this case
              bGrenades = 3 + (Random(5)); // 3-7
              bGrenadeClass = MORTAR_GRENADE_CLASS;
            }
            break;
        }
      }
      break;
  }

  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    // clear items, but only if they have write status.
    if (!(pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)) {
      memset(addressof(pp.value.Inv[i]), 0, sizeof(OBJECTTYPE));
      pp.value.Inv[i].fFlags |= OBJECT_UNDROPPABLE;
    } else {
      // check to see what kind of item is here.  If we find a gun, for example, it'll make the
      // bWeaponClass negative to signify that a gun has already been specified, and later
      // code will use that to determine that and to pick ammo for it.
      pItem = addressof(pp.value.Inv[i]);
      if (!pItem)
        continue;
      switch (Item[pItem.value.usItem].usItemClass) {
        case IC_GUN:
          if (pItem.value.usItem != Enum225.ROCKET_LAUNCHER) {
            bWeaponClass *= -1;
          } else // rocket launcher!
          {
            fLAW = false;
          }
          break;
        case IC_AMMO:
          bAmmoClips = 0;
          break;
        case IC_BLADE:
        case IC_THROWING_KNIFE:
          bKnifeClass = 0;
          break;
        case IC_LAUNCHER:
          fGrenadeLauncher = false;
          fMortar = false;
          break;
        case IC_ARMOUR:
          if (i == Enum261.HELMETPOS)
            bHelmetClass = 0;
          else if (i == Enum261.VESTPOS)
            bVestClass = 0;
          else if (i == Enum261.LEGPOS)
            bLeggingClass = 0;
          break;
        case IC_GRENADE:
          bGrenades = 0;
          bGrenadeClass = 0;
          break;
        case IC_MEDKIT:
        case IC_KIT:
          bKitClass = 0;
          break;
        case IC_MISC:
          bMiscClass = 0;
        case IC_BOMB:
          bBombClass = 0;
          break;
      }
    }
  }

  // special: militia shouldn't drop bombs
  if (!(SOLDIER_CLASS_ENEMY(bSoldierClass))) {
    bBombClass = 0;
  }

  // Now actually choose the equipment!
  ChooseWeaponForSoldierCreateStruct(pp, bWeaponClass, bAmmoClips, bAttachClass, fAttachment);
  ChooseGrenadesForSoldierCreateStruct(pp, bGrenades, bGrenadeClass, fGrenadeLauncher);
  ChooseArmourForSoldierCreateStruct(pp, bHelmetClass, bVestClass, bLeggingClass);
  ChooseSpecialWeaponsForSoldierCreateStruct(pp, bKnifeClass, fGrenadeLauncher, fLAW, fMortar);
  ChooseFaceGearForSoldierCreateStruct(pp);
  ChooseKitsForSoldierCreateStruct(pp, bKitClass);
  ChooseMiscGearForSoldierCreateStruct(pp, bMiscClass);
  ChooseBombsForSoldierCreateStruct(pp, bBombClass);
  ChooseLocationSpecificGearForSoldierCreateStruct(pp);
  RandomlyChooseWhichItemsAreDroppable(pp, bSoldierClass);
}

// When using the class values, they should all range from 0-11, 0 meaning that there will be no
// selection for that particular type of item, and 1-11 means to choose an item if possible.  1 is
// the worst class of item, while 11 is the best.

function ChooseWeaponForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, bWeaponClass: INT8, bAmmoClips: INT8, bAttachClass: INT8, fAttachment: boolean): void {
  let pItem: Pointer<INVTYPE>;
  let Object: OBJECTTYPE;
  let i: UINT16;
  let usRandom: UINT16;
  let usNumMatches: UINT16 = 0;
  let usGunIndex: UINT16 = 0;
  let usAmmoIndex: UINT16 = 0;
  let usAttachIndex: UINT16 = 0;
  let ubChanceStandardAmmo: UINT8;
  let bStatus: INT8;

  // Choose weapon:
  // WEAPONS are very important, and are therefore handled differently using special pre-generated tables.
  // It was requested that enemies use only a small subset of guns with a lot duplication of the same gun type.

  // if gun was pre-selected (rcvd negative weapon class) and needs ammo
  if (bWeaponClass < 0 && bAmmoClips) {
    // Linda has added a specific gun to the merc's inventory, but no ammo.  So, we
    // will choose ammunition that works with the gun.
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      if (Item[pp.value.Inv[i].usItem].usItemClass == IC_GUN) {
        usGunIndex = pp.value.Inv[i].usItem;
        ubChanceStandardAmmo = 100 - (bWeaponClass * -9); // weapon class is negative!
        usAmmoIndex = RandomMagazine(usGunIndex, ubChanceStandardAmmo);

        if (usGunIndex == Enum225.ROCKET_RIFLE) {
          pp.value.Inv[i].ubImprintID = (NO_PROFILE + 1);
        }

        break;
      }
    }
    if (bAmmoClips && usAmmoIndex) {
      CreateItems(usAmmoIndex, 100, bAmmoClips, addressof(Object));
      Object.fFlags |= OBJECT_UNDROPPABLE;
      PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
    }

    return;
  }

  if (bWeaponClass < 1)
    return; // empty handed / pre-selected

  // reduce anything over 11 to 11
  if (bWeaponClass > ARMY_GUN_LEVELS) {
    bWeaponClass = ARMY_GUN_LEVELS;
  }

  // the weapon class here ranges from 1 to 11, so subtract 1 to get a gun level
  usGunIndex = SelectStandardArmyGun((bWeaponClass - 1));

  if (bAmmoClips) {
    // We have a gun, so choose ammo clips

    // check default ammo first...
    usAmmoIndex = DefaultMagazine(usGunIndex);
    switch (Magazine[Item[usAmmoIndex].ubClassIndex].ubAmmoType) {
      case Enum286.AMMO_AP:
      case Enum286.AMMO_SUPER_AP:
        // assault rifle, rocket rifle (etc) - high chance of having AP ammo
        ubChanceStandardAmmo = 80;
        break;
      default:
        ubChanceStandardAmmo = 100 - (bWeaponClass * 9);
        break;
    }
    usAmmoIndex = RandomMagazine(usGunIndex, ubChanceStandardAmmo);
  }

  // Choose attachment
  if (bAttachClass && fAttachment) {
    usNumMatches = 0;
    while (bAttachClass && !usNumMatches) {
      // Count the number of valid attachments.
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        pItem = addressof(Item[i]);
        if (pItem.value.usItemClass == IC_MISC && pItem.value.ubCoolness == bAttachClass && ValidAttachment(i, usGunIndex))
          usNumMatches++;
      }
      if (!usNumMatches) {
        bAttachClass--;
      }
    }
    if (usNumMatches) {
      usRandom = Random(usNumMatches);
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        pItem = addressof(Item[i]);
        if (pItem.value.usItemClass == IC_MISC && pItem.value.ubCoolness == bAttachClass && ValidAttachment(i, usGunIndex)) {
          if (usRandom)
            usRandom--;
          else {
            usAttachIndex = i;
            break;
          }
        }
      }
    }
  }
  // Now, we have chosen all of the correct items.  Now, we will assign them into the slots.
  // Because we are dealing with enemies, automatically give them full ammo in their weapon.
  if (!(pp.value.Inv[Enum261.HANDPOS].fFlags & OBJECT_NO_OVERWRITE)) {
    switch (pp.value.ubSoldierClass) {
      case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
      case Enum262.SOLDIER_CLASS_ARMY:
      case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
      case Enum262.SOLDIER_CLASS_REG_MILITIA:
        // Admins/Troops: 60-75% + 1% every 4% progress
        bStatus = (60 + Random(16));
        bStatus += (HighestPlayerProgressPercentage() / 4);
        bStatus = Math.min(100, bStatus);
        break;
      case Enum262.SOLDIER_CLASS_ELITE:
      case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
        // 85-90% +  1% every 10% progress
        bStatus = (85 + Random(6));
        bStatus += (HighestPlayerProgressPercentage() / 10);
        bStatus = Math.min(100, bStatus);
        break;
      default:
        bStatus = (50 + Random(51));
        break;
    }
    // don't allow it to be lower than marksmanship, we don't want it to affect their chances of hitting
    bStatus = Math.max(pp.value.bMarksmanship, bStatus);

    CreateItem(usGunIndex, bStatus, addressof(pp.value.Inv[Enum261.HANDPOS]));
    pp.value.Inv[Enum261.HANDPOS].fFlags |= OBJECT_UNDROPPABLE;

    // Rocket Rifles must come pre-imprinted, in case carrier gets killed without getting a shot off
    if (usGunIndex == Enum225.ROCKET_RIFLE) {
      pp.value.Inv[Enum261.HANDPOS].ubImprintID = (NO_PROFILE + 1);
    }
  } else {
    // slot locked, so don't add any attachments to it!
    usAttachIndex = 0;
  }
  // Ammo
  if (bAmmoClips && usAmmoIndex) {
    CreateItems(usAmmoIndex, 100, bAmmoClips, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
  if (usAttachIndex) {
    CreateItem(usAttachIndex, 100, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    AttachObject(null, addressof(pp.value.Inv[Enum261.HANDPOS]), addressof(Object));
  }
}

function ChooseGrenadesForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, bGrenades: INT8, bGrenadeClass: INT8, fGrenadeLauncher: boolean): void {
  let Object: OBJECTTYPE;
  let sNumPoints: INT16;
  let usItem: UINT16;
  let ubBaseQuality: UINT8;
  let ubQualityVariation: UINT8;
  // numbers of each type the player will get!
  let ubNumStun: UINT8 = 0;
  let ubNumTear: UINT8 = 0;
  let ubNumMustard: UINT8 = 0;
  let ubNumMini: UINT8 = 0;
  let ubNumReg: UINT8 = 0;
  let ubNumSmoke: UINT8 = 0;
  let ubNumFlare: UINT8 = 0;

  // determine how many *points* the enemy will get to spend on grenades...
  sNumPoints = bGrenades * bGrenadeClass;

  // no points, no grenades!
  if (!sNumPoints)
    return;

  // special mortar shell handling
  if (bGrenadeClass == MORTAR_GRENADE_CLASS) {
    CreateItems(Enum225.MORTAR_SHELL, (80 + Random(21)), bGrenades, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
    return;
  }

  Assert(bGrenadeClass <= 11);

  // determine the quality of grenades.  The elite guys get the best quality, while the others
  // get progressively worse.
  ubBaseQuality = Math.min(45 + bGrenadeClass * 5, 90);
  ubQualityVariation = 101 - ubBaseQuality;

  // now, purchase the grenades.
  while (sNumPoints > 0) {
    if (sNumPoints >= 20) {
      // Choose randomly between mustard and regular
      if (Random(2) && !fGrenadeLauncher)
        ubNumMustard++, sNumPoints -= 10;
      else
        ubNumReg++, sNumPoints -= 9;
    }

    if (sNumPoints >= 10) {
      // Choose randomly between any
      switch (Random(7)) {
        case 0:
          if (!fGrenadeLauncher) {
            ubNumMustard++;
            sNumPoints -= 10;
            break;
          }
          // if grenade launcher, pick regular instead
        case 1:
          ubNumReg++;
          sNumPoints -= 9;
          break;
        case 2:
          if (!fGrenadeLauncher) {
            ubNumMini++;
            sNumPoints -= 7;
            break;
          }
          // if grenade launcher, pick tear instead
        case 3:
          ubNumTear++;
          sNumPoints -= 6;
          break;
        case 4:
          ubNumStun++;
          sNumPoints -= 5;
          break;
        case 5:
          ubNumSmoke++;
          sNumPoints -= 4;
          break;
        case 6:
          if (!fGrenadeLauncher) {
            ubNumFlare++;
            sNumPoints -= 3;
          }
          break;
      }
    }

    // JA2 Gold: don't make mini-grenades take all points available, and add chance of break lights
    if (sNumPoints >= 1 && sNumPoints < 10) {
      switch (Random(10)) {
        case 0:
        case 1:
        case 2:
          ubNumSmoke++;
          sNumPoints -= 4;
          break;
        case 3:
        case 4:
          ubNumTear++;
          sNumPoints -= 6;
          break;
        case 5:
        case 6:
          if (!fGrenadeLauncher) {
            ubNumFlare++;
            sNumPoints -= 3;
          }
          break;
        case 7:
        case 8:
          ubNumStun++;
          sNumPoints -= 5;
          break;
        case 9:
          if (!fGrenadeLauncher) {
            ubNumMini++;
            sNumPoints -= 7;
          }
          break;
      }
    }
    /*
    if( usNumPoints >= 1 && usNumPoints < 10 )
    { //choose randomly between either stun or tear, (normal with rare chance)
            switch( Random( 10 ) )
            {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                            ubNumSmoke++;
                            if( usNumPoints > 4 )
                                    usNumPoints -= 4;
                            else
                                    usNumPoints = 0;
                            break;
                    case 4:
                    case 5:
                    case 6:
                            ubNumTear++;
                            if( usNumPoints > 6 )
                                    usNumPoints -= 6;
                            else
                                    usNumPoints = 0;
                            break;
                    case 7:
                    case 8:
                            ubNumStun++;
                            if( usNumPoints > 5 )
                                    usNumPoints -= 5;
                            else
                                    usNumPoints = 0;
                            break;
                    case 9:
                            ubNumMini++;
                            usNumPoints = 0;
                            break;
            }
    }
    */
  }

  // Create the grenades and add them to the soldier

  if (ubNumSmoke) {
    if (fGrenadeLauncher) {
      usItem = Enum225.GL_SMOKE_GRENADE;
    } else {
      usItem = Enum225.SMOKE_GRENADE;
    }
    CreateItems(usItem, (ubBaseQuality + Random(ubQualityVariation)), ubNumSmoke, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
  if (ubNumTear) {
    if (fGrenadeLauncher) {
      usItem = Enum225.GL_TEARGAS_GRENADE;
    } else {
      usItem = Enum225.TEARGAS_GRENADE;
    }
    CreateItems(usItem, (ubBaseQuality + Random(ubQualityVariation)), ubNumTear, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
  if (ubNumStun) {
    if (fGrenadeLauncher) {
      usItem = Enum225.GL_STUN_GRENADE;
    } else {
      usItem = Enum225.STUN_GRENADE;
    }
    CreateItems(usItem, (ubBaseQuality + Random(ubQualityVariation)), ubNumStun, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
  if (ubNumReg) {
    if (fGrenadeLauncher) {
      usItem = Enum225.GL_HE_GRENADE;
    } else {
      usItem = Enum225.HAND_GRENADE;
    }
    CreateItems(usItem, (ubBaseQuality + Random(ubQualityVariation)), ubNumReg, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }

  if (ubNumMini) {
    CreateItems(Enum225.MINI_GRENADE, (ubBaseQuality + Random(ubQualityVariation)), ubNumMini, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
  if (ubNumMustard) {
    CreateItems(Enum225.MUSTARD_GRENADE, (ubBaseQuality + Random(ubQualityVariation)), ubNumMustard, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
  if (ubNumFlare) {
    CreateItems(Enum225.BREAK_LIGHT, (ubBaseQuality + Random(ubQualityVariation)), ubNumFlare, addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
}

function ChooseArmourForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, bHelmetClass: INT8, bVestClass: INT8, bLeggingsClass: INT8): void {
  let i: UINT16;
  let pItem: Pointer<INVTYPE>;
  let usRandom: UINT16;
  let usNumMatches: UINT16;
  let bOrigVestClass: INT8 = bVestClass;
  let Object: OBJECTTYPE;

  // Choose helmet
  if (bHelmetClass) {
    usNumMatches = 0;
    while (bHelmetClass && !usNumMatches) {
      // First step is to count the number of helmets in the helmet class range.  If we
      // don't find one, we keep lowering the class until we do.
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        pItem = addressof(Item[i]);
        // NOTE: This relies on treated armor to have a coolness of 0 in order for enemies not to be equipped with it
        if (pItem.value.usItemClass == IC_ARMOUR && pItem.value.ubCoolness == bHelmetClass) {
          if (Armour[pItem.value.ubClassIndex].ubArmourClass == Enum284.ARMOURCLASS_HELMET)
            usNumMatches++;
        }
      }
      if (!usNumMatches)
        bHelmetClass--;
    }
    if (usNumMatches) {
      // There is a helmet that we can choose.
      usRandom = Random(usNumMatches);
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        pItem = addressof(Item[i]);
        if (pItem.value.usItemClass == IC_ARMOUR && pItem.value.ubCoolness == bHelmetClass) {
          if (Armour[pItem.value.ubClassIndex].ubArmourClass == Enum284.ARMOURCLASS_HELMET) {
            if (usRandom)
              usRandom--;
            else {
              if (!(pp.value.Inv[Enum261.HELMETPOS].fFlags & OBJECT_NO_OVERWRITE)) {
                CreateItem(i, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HELMETPOS]));
                pp.value.Inv[Enum261.HELMETPOS].fFlags |= OBJECT_UNDROPPABLE;
              }
              break;
            }
          }
        }
      }
    }
  }
  // Choose vest
  if (bVestClass) {
    usNumMatches = 0;
    while (bVestClass && !usNumMatches) {
      // First step is to count the number of armours in the armour class range.  If we
      // don't find one, we keep lowering the class until we do.
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        // these 3 have a non-zero coolness, and would otherwise be selected, so skip them
        if ((i == Enum225.TSHIRT) || (i == Enum225.LEATHER_JACKET) || (i == Enum225.TSHIRT_DEIDRANNA))
          continue;

        pItem = addressof(Item[i]);
        // NOTE: This relies on treated armor to have a coolness of 0 in order for enemies not to be equipped with it
        if (pItem.value.usItemClass == IC_ARMOUR && pItem.value.ubCoolness == bVestClass) {
          if (Armour[pItem.value.ubClassIndex].ubArmourClass == Enum284.ARMOURCLASS_VEST)
            usNumMatches++;
        }
      }
      if (!usNumMatches)
        bVestClass--;
    }
    if (usNumMatches) {
      // There is an armour that we can choose.
      usRandom = Random(usNumMatches);
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        // these 3 have a non-zero coolness, and would otherwise be selected, so skip them
        if ((i == Enum225.TSHIRT) || (i == Enum225.LEATHER_JACKET) || (i == Enum225.TSHIRT_DEIDRANNA))
          continue;

        pItem = addressof(Item[i]);
        if (pItem.value.usItemClass == IC_ARMOUR && pItem.value.ubCoolness == bVestClass) {
          if (Armour[pItem.value.ubClassIndex].ubArmourClass == Enum284.ARMOURCLASS_VEST) {
            if (usRandom)
              usRandom--;
            else {
              if (!(pp.value.Inv[Enum261.VESTPOS].fFlags & OBJECT_NO_OVERWRITE)) {
                CreateItem(i, (70 + Random(31)), addressof(pp.value.Inv[Enum261.VESTPOS]));
                pp.value.Inv[Enum261.VESTPOS].fFlags |= OBJECT_UNDROPPABLE;

                if ((i == Enum225.KEVLAR_VEST) || (i == Enum225.SPECTRA_VEST)) {
                  // roll to see if he gets a CERAMIC PLATES, too.  Higher chance the higher his entitled vest class is
                  if (Random(100) < (15 * (bOrigVestClass - pItem.value.ubCoolness))) {
                    CreateItem(Enum225.CERAMIC_PLATES, (70 + Random(31)), addressof(Object));
                    Object.fFlags |= OBJECT_UNDROPPABLE;
                    AttachObject(null, addressof(pp.value.Inv[Enum261.VESTPOS]), addressof(Object));
                  }
                }
              }
              break;
            }
          }
        }
      }
    }
  }
  // Choose Leggings
  if (bLeggingsClass) {
    usNumMatches = 0;
    while (bLeggingsClass && !usNumMatches) {
      // First step is to count the number of Armours in the Armour class range.  If we
      // don't find one, we keep lowering the class until we do.
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        pItem = addressof(Item[i]);
        // NOTE: This relies on treated armor to have a coolness of 0 in order for enemies not to be equipped with it
        if (pItem.value.usItemClass == IC_ARMOUR && pItem.value.ubCoolness == bLeggingsClass) {
          if (Armour[pItem.value.ubClassIndex].ubArmourClass == Enum284.ARMOURCLASS_LEGGINGS)
            usNumMatches++;
        }
      }
      if (!usNumMatches)
        bLeggingsClass--;
    }
    if (usNumMatches) {
      // There is a legging that we can choose.
      usRandom = Random(usNumMatches);
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        pItem = addressof(Item[i]);
        if (pItem.value.usItemClass == IC_ARMOUR && pItem.value.ubCoolness == bLeggingsClass) {
          if (Armour[pItem.value.ubClassIndex].ubArmourClass == Enum284.ARMOURCLASS_LEGGINGS) {
            if (usRandom)
              usRandom--;
            else {
              if (!(pp.value.Inv[Enum261.LEGPOS].fFlags & OBJECT_NO_OVERWRITE)) {
                CreateItem(i, (70 + Random(31)), addressof(pp.value.Inv[Enum261.LEGPOS]));
                pp.value.Inv[Enum261.LEGPOS].fFlags |= OBJECT_UNDROPPABLE;
                break;
              }
            }
          }
        }
      }
    }
  }
}

function ChooseSpecialWeaponsForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, bKnifeClass: INT8, fGrenadeLauncher: boolean, fLAW: boolean, fMortar: boolean): void {
  let i: UINT16;
  let pItem: Pointer<INVTYPE>;
  let usRandom: UINT16;
  let usNumMatches: UINT16 = 0;
  let usKnifeIndex: UINT16 = 0;
  let Object: OBJECTTYPE;

  // Choose knife
  while (bKnifeClass && !usNumMatches) {
    // First step is to count the number of weapons in the weapon class range.  If we
    // don't find one, we keep lowering the class until we do.
    for (i = 0; i < Enum225.MAXITEMS; i++) {
      pItem = addressof(Item[i]);
      if ((pItem.value.usItemClass == IC_BLADE || pItem.value.usItemClass == IC_THROWING_KNIFE) && pItem.value.ubCoolness == bKnifeClass) {
        usNumMatches++;
      }
    }
    if (!usNumMatches)
      bKnifeClass--;
  }
  if (usNumMatches) {
    // There is a knife that we can choose.
    usRandom = Random(usNumMatches);
    for (i = 0; i < Enum225.MAXITEMS; i++) {
      pItem = addressof(Item[i]);
      if ((pItem.value.usItemClass == IC_BLADE || pItem.value.usItemClass == IC_THROWING_KNIFE) && pItem.value.ubCoolness == bKnifeClass) {
        if (usRandom)
          usRandom--;
        else {
          usKnifeIndex = i;
          break;
        }
      }
    }
  }

  if (usKnifeIndex) {
    CreateItem(usKnifeIndex, (70 + Random(31)), addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }

  if (fGrenadeLauncher) {
    // give grenade launcher
    CreateItem(Enum225.GLAUNCHER, (50 + Random(51)), addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }

  if (fLAW) {
    // give rocket launcher
    CreateItem(Enum225.ROCKET_LAUNCHER, (50 + Random(51)), addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }

  if (fMortar) {
    // make sure we're not distributing them underground!
    Assert(IsAutoResolveActive() || (gbWorldSectorZ == 0));

    // give mortar
    CreateItem(Enum225.MORTAR, (50 + Random(51)), addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
}

function ChooseFaceGearForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>): void {
  let i: INT32;
  let bDifficultyRating: INT8 = CalcDifficultyModifier(pp.value.ubSoldierClass);

  if (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y && StrategicMap[TIXA_SECTOR_X + TIXA_SECTOR_Y * MAP_WORLD_X].fEnemyControlled) {
    // Tixa is a special case that is handled differently.
    return;
  }

  // Look for any face item in the big pocket positions (the only place they can be added in the editor)
  // If any are found, then don't assign any
  for (i = Enum261.BIGPOCK1POS; i < Enum261.BIGPOCK4POS; i++) {
    if (Item[pp.value.Inv[i].usItem].usItemClass == IC_FACE) {
      return;
    }
  }

  // KM: (NEW)
  // Note the lack of overwritable item checking here.  This is because faceitems are not
  // supported in the editor, hence they can't have this status.
  switch (pp.value.ubSoldierClass) {
    case Enum262.SOLDIER_CLASS_ELITE:
    case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
      // All elites get a gasmask and either night goggles or uv goggles.
      if (Chance(75)) {
        CreateItem(Enum225.GASMASK, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HEAD1POS]));
        pp.value.Inv[Enum261.HEAD1POS].fFlags |= OBJECT_UNDROPPABLE;
      } else {
        CreateItem(Enum225.EXTENDEDEAR, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HEAD1POS]));
        pp.value.Inv[Enum261.HEAD1POS].fFlags |= OBJECT_UNDROPPABLE;
      }
      if (Chance(75)) {
        CreateItem(Enum225.NIGHTGOGGLES, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HEAD2POS]));
        pp.value.Inv[Enum261.HEAD2POS].fFlags |= OBJECT_UNDROPPABLE;
      } else {
        CreateItem(Enum225.UVGOGGLES, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HEAD2POS]));
        pp.value.Inv[Enum261.HEAD2POS].fFlags |= OBJECT_UNDROPPABLE;
      }
      break;
    case Enum262.SOLDIER_CLASS_ARMY:
    case Enum262.SOLDIER_CLASS_REG_MILITIA:
      if (Chance(bDifficultyRating / 2)) {
        // chance of getting a face item
        if (Chance(50)) {
          CreateItem(Enum225.GASMASK, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HEAD1POS]));
          pp.value.Inv[Enum261.HEAD1POS].fFlags |= OBJECT_UNDROPPABLE;
        } else {
          CreateItem(Enum225.NIGHTGOGGLES, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HEAD1POS]));
          pp.value.Inv[Enum261.HEAD1POS].fFlags |= OBJECT_UNDROPPABLE;
        }
      }
      if (Chance(bDifficultyRating / 3)) {
        // chance of getting a extended ear
        CreateItem(Enum225.EXTENDEDEAR, (70 + Random(31)), addressof(pp.value.Inv[Enum261.HEAD2POS]));
        pp.value.Inv[Enum261.HEAD2POS].fFlags |= OBJECT_UNDROPPABLE;
      }
      break;
    case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
    case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
      break;
  }
}

function ChooseKitsForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, bKitClass: INT8): void {
  let i: UINT16;
  let pItem: Pointer<INVTYPE>;
  let usRandom: UINT16;
  let usNumMatches: UINT16 = 0;
  let Object: OBJECTTYPE;
  let usKitItem: UINT16 = 0;

  // we want these mostly to be first aid and medical kits, and for those kit class doesn't matter, they're always useful
  if (Chance(50)) {
    usKitItem = Enum225.FIRSTAIDKIT;
  } else if (Chance(25)) {
    usKitItem = Enum225.MEDICKIT;
  } else {
    // count how many non-medical KITS are eligible ( of sufficient or lower coolness)
    for (i = 0; i < Enum225.MAXITEMS; i++) {
      pItem = addressof(Item[i]);
      // skip toolkits
      if ((pItem.value.usItemClass == IC_KIT) && (pItem.value.ubCoolness > 0) && pItem.value.ubCoolness <= bKitClass && (i != Enum225.TOOLKIT)) {
        usNumMatches++;
      }
    }

    // if any are eligible, pick one of them at random
    if (usNumMatches) {
      usRandom = Random(usNumMatches);
      for (i = 0; i < Enum225.MAXITEMS; i++) {
        pItem = addressof(Item[i]);
        // skip toolkits
        if ((pItem.value.usItemClass == IC_KIT) && (pItem.value.ubCoolness > 0) && pItem.value.ubCoolness <= bKitClass && (i != Enum225.TOOLKIT)) {
          if (usRandom)
            usRandom--;
          else {
            usKitItem = i;
            break;
          }
        }
      }
    }
  }

  if (usKitItem != 0) {
    CreateItem(usKitItem, (80 + Random(21)), addressof(Object));
    Object.fFlags |= OBJECT_UNDROPPABLE;
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
}

function ChooseMiscGearForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, bMiscClass: INT8): void {
  let i: UINT16;
  let pItem: Pointer<INVTYPE>;
  let usRandom: UINT16;
  let usNumMatches: UINT16 = 0;
  let Object: OBJECTTYPE;

  // not all of these are IC_MISC, some are IC_PUNCH (not covered anywhere else)
  let iMiscItemsList: INT32[] /* [] */ = [
    Enum225.CANTEEN,
    Enum225.CANTEEN,
    Enum225.CANTEEN,
    Enum225.CANTEEN,
    Enum225.ALCOHOL,
    Enum225.ALCOHOL,
    Enum225.ADRENALINE_BOOSTER,
    Enum225.ADRENALINE_BOOSTER,
    Enum225.REGEN_BOOSTER,
    Enum225.BRASS_KNUCKLES,
    Enum225.CHEWING_GUM,
    Enum225.CIGARS,
    Enum225.GOLDWATCH,
    -1,
  ];

  // count how many are eligible
  i = 0;
  while (iMiscItemsList[i] != -1) {
    pItem = addressof(Item[iMiscItemsList[i]]);
    if ((pItem.value.ubCoolness > 0) && (pItem.value.ubCoolness <= bMiscClass)) {
      // exclude REGEN_BOOSTERs unless Sci-Fi flag is on
      if ((iMiscItemsList[i] != Enum225.REGEN_BOOSTER) || (gGameOptions.fSciFi)) {
        usNumMatches++;
      }
    }

    i++;
  }

  // if any are eligible, pick one of them at random
  if (usNumMatches) {
    usRandom = Random(usNumMatches);

    i = 0;
    while (iMiscItemsList[i] != -1) {
      pItem = addressof(Item[iMiscItemsList[i]]);
      if ((pItem.value.ubCoolness > 0) && (pItem.value.ubCoolness <= bMiscClass)) {
        // exclude REGEN_BOOSTERs unless Sci-Fi flag is on
        if ((iMiscItemsList[i] != Enum225.REGEN_BOOSTER) || (gGameOptions.fSciFi)) {
          if (usRandom)
            usRandom--;
          else {
            CreateItem(iMiscItemsList[i], (80 + Random(21)), addressof(Object));
            Object.fFlags |= OBJECT_UNDROPPABLE;
            PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
            break;
          }
        }
      }

      i++;
    }
  }
}

function ChooseBombsForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, bBombClass: INT8): void {
  let i: UINT16;
  let pItem: Pointer<INVTYPE>;
  let usRandom: UINT16;
  let usNumMatches: UINT16 = 0;
  let Object: OBJECTTYPE;

  // count how many are eligible
  for (i = 0; i < Enum225.MAXITEMS; i++) {
    pItem = addressof(Item[i]);
    if ((pItem.value.usItemClass == IC_BOMB) && (pItem.value.ubCoolness > 0) && (pItem.value.ubCoolness <= bBombClass)) {
      usNumMatches++;
    }
  }

  // if any are eligible, pick one of them at random
  if (usNumMatches) {
    usRandom = Random(usNumMatches);
    for (i = 0; i < Enum225.MAXITEMS; i++) {
      pItem = addressof(Item[i]);
      if ((pItem.value.usItemClass == IC_BOMB) && (pItem.value.ubCoolness > 0) && (pItem.value.ubCoolness <= bBombClass)) {
        if (usRandom)
          usRandom--;
        else {
          CreateItem(i, (80 + Random(21)), addressof(Object));
          Object.fFlags |= OBJECT_UNDROPPABLE;
          PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
          break;
        }
      }
    }
  }
}

function ChooseLocationSpecificGearForSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>): void {
  let Object: OBJECTTYPE;

  // If this is Tixa and the player doesn't control Tixa then give all enemies gas masks,
  // but somewhere on their person, not in their face positions
  if (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y && StrategicMap[TIXA_SECTOR_X + TIXA_SECTOR_Y * MAP_WORLD_X].fEnemyControlled) {
    CreateItem(Enum225.GASMASK, (95 + Random(6)), addressof(Object));
    PlaceObjectInSoldierCreateStruct(pp, addressof(Object));
  }
}

function PlaceObjectInSoldierCreateStruct(pp: Pointer<SOLDIERCREATE_STRUCT>, pObject: Pointer<OBJECTTYPE>): boolean {
  let i: INT8;
  if (!Item[pObject.value.usItem].ubPerPocket) {
    // ubPerPocket == 0 will only fit in large pockets.
    pObject.value.ubNumberOfObjects = 1;
    for (i = Enum261.BIGPOCK1POS; i <= Enum261.BIGPOCK4POS; i++) {
      if (!(pp.value.Inv[i].usItem) && !(pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)) {
        memcpy(addressof(pp.value.Inv[i]), pObject, sizeof(OBJECTTYPE));
        return true;
      }
    }
    return false;
  } else {
    pObject.value.ubNumberOfObjects = Math.min(Item[pObject.value.usItem].ubPerPocket, pObject.value.ubNumberOfObjects);
    // try to get it into a small pocket first
    for (i = Enum261.SMALLPOCK1POS; i <= Enum261.SMALLPOCK8POS; i++) {
      if (!(pp.value.Inv[i].usItem) && !(pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)) {
        memcpy(addressof(pp.value.Inv[i]), pObject, sizeof(OBJECTTYPE));
        return true;
      }
    }
    for (i = Enum261.BIGPOCK1POS; i <= Enum261.BIGPOCK4POS; i++) {
      // no space free in small pockets, so put it into a large pocket.
      if (!(pp.value.Inv[i].usItem) && !(pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)) {
        memcpy(addressof(pp.value.Inv[i]), pObject, sizeof(OBJECTTYPE));
        return true;
      }
    }
  }
  return false;
}

function RandomlyChooseWhichItemsAreDroppable(pp: Pointer<SOLDIERCREATE_STRUCT>, bSoldierClass: INT8): void {
  let i: INT32;
  //	UINT16 usRandomNum;
  let uiItemClass: UINT32;
  let ubNumMatches: UINT8 = 0;
  let usItem: UINT16;
  let ubAmmoDropRate: UINT8;
  let ubGrenadeDropRate: UINT8;
  let ubOtherDropRate: UINT8;
  let fWeapon: boolean = false;
  let fGrenades: boolean = false; // this includes all  grenades!
  let fAmmo: boolean = false;
  let fArmour: boolean = false;
  let fKnife: boolean = false;
  let fKit: boolean = false;
  let fFace: boolean = false;
  let fMisc: boolean = false;

  /*
          //40% of soldiers will have droppable items.
          usRandomNum = (UINT16)Random( 1000 );
          if( usRandomNum >= 400 )
                  return;
          //so now the number is 0-399.  This is kind of like a D&D die roll where
          //various numbers drop different items, or even more than one item.  At this
          //point, we don't care if the enemy has anything in the slot that is made droppable.
          //Any items containing the OBJECT_NO_OVERWRITE slot is rejected for droppable
          //consideration.

          if( usRandomNum < 32 ) //3.2% of dead bodies present the possibility of several items (0-5 items : avg 3).
          { //31 is the magic number that allows all 5 item classes to be dropped!
                  if( usRandomNum & 16 )
                          fWeapon = TRUE;
                  if( usRandomNum & 8 )
                          fAmmo = TRUE;
                  if( usRandomNum & 4 )
                          fGrenades = TRUE;
                  if( usRandomNum & 2 )
                          fArmour = TRUE;
                  if( usRandomNum & 1 )
                          fMisc = TRUE;
          }
          else if( usRandomNum < 100 ) //6.8% chance of getting 2-3 different items.
          { //do a more generalized approach to dropping items.
                  switch( usRandomNum / 10 )
                  {
                          case 3:	fWeapon = TRUE;											fAmmo = TRUE;																break;
                          case 4:	fWeapon = TRUE;	fGrenades = TRUE;																							break;
                          case 5:									fGrenades = TRUE;																fMisc = TRUE;	break;
                          case 6:									fGrenades = TRUE;								fArmour = TRUE;								break;
                          case 7:																			fAmmo = TRUE;	fArmour = TRUE;								break;
                          case 8:																			fAmmo = TRUE;	fArmour = TRUE;	fMisc = TRUE;	break;
                          case 9:									fGrenades = TRUE;	fAmmo = TRUE;									fMisc = TRUE;	break;
                  }
          }
          else
          {
                  switch( usRandomNum / 50 ) //30% chance of getting 1-2 items (no weapons)
                  {
                          case 2:									fGrenades = TRUE;																							break;
                          case 3:																			fAmmo = TRUE;																break;
                          case 4:																									fArmour = TRUE;									break;
                          case 5:																																		fMisc = TRUE;	break;
                          case 6:																			fAmmo = TRUE;									fMisc = TRUE;	break;
                          case 7:									fGrenades = TRUE;	fAmmo = TRUE;																break;
                  }
          }

          fKnife = (Random(3)) ? FALSE : TRUE;
  */

  // only enemy soldiers use auto-drop system!
  // don't use the auto-drop system in auto-resolve: player won't see what's being used & enemies will often win & keep'em
  if (SOLDIER_CLASS_ENEMY(bSoldierClass) && !IsAutoResolveActive()) {
    // SPECIAL handling for weapons: we'll always drop a weapon type that has never been dropped before
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      usItem = pp.value.Inv[i].usItem;
      // if it's a weapon (monster parts included - they won't drop due to checks elsewhere!)
      if ((usItem > Enum225.NONE) && (usItem < Enum225.MAX_WEAPONS)) {
        // and we're allowed to change its flags
        if (!(pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)) {
          // and it's never been dropped before in this game
          if (!gStrategicStatus.fWeaponDroppedAlready[usItem]) {
            // mark it as droppable, and remember we did so.  If the player never kills this particular dude, oh well,
            // tough luck, he missed his chance for an easy reward, he'll have to wait til next time and need some luck...
            pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;

            MarkAllWeaponsOfSameGunClassAsDropped(usItem);
          }
        }
      }
    }
  }

  if (SOLDIER_CLASS_MILITIA(bSoldierClass)) {
    // militia (they drop much less stuff)
    ubAmmoDropRate = MILITIAAMMODROPRATE;
    ubGrenadeDropRate = MILITIAGRENADEDROPRATE;
    ubOtherDropRate = MILITIAEQUIPDROPRATE;
  } else {
    // enemy army
    ubAmmoDropRate = ENEMYAMMODROPRATE;
    ubGrenadeDropRate = ENEMYGRENADEDROPRATE;
    ubOtherDropRate = ENEMYEQUIPDROPRATE;
  }

  if (Random(100) < ubAmmoDropRate)
    fAmmo = true;

  if (Random(100) < ubOtherDropRate)
    fWeapon = true;

  if (Random(100) < ubOtherDropRate)
    fArmour = true;

  if (Random(100) < ubOtherDropRate)
    fKnife = true;

  if (Random(100) < ubGrenadeDropRate)
    fGrenades = true;

  if (Random(100) < ubOtherDropRate)
    fKit = true;

  if (Random(100) < (ubOtherDropRate / 3))
    fFace = true;

  if (Random(100) < ubOtherDropRate)
    fMisc = true;

  // Now, that the flags are set for each item, we now have to search through the item slots to
  // see if we can find a matching item, however, if we find any items in a particular class that
  // have the OBJECT_NO_OVERWRITE flag set, we will not make any items droppable for that class
  // because the editor would have specified it already.
  if (fAmmo) {
    // now drops ALL ammo found, not just the first slot
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass == IC_AMMO) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          continue;
        else {
          pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
        }
      }
    }
  }

  if (fWeapon) {
    ubNumMatches = 0;
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass == IC_GUN || uiItemClass == IC_LAUNCHER) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          break;
        else
          ubNumMatches++;
      }
    }
    if (ubNumMatches > 0) {
      for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
        uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
        if (uiItemClass == IC_GUN || uiItemClass == IC_LAUNCHER) {
          if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
            break;
          else if (!Random(ubNumMatches--)) {
            pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
            break;
          }
        }
      }
    }
  }

  if (fArmour) {
    ubNumMatches = 0;
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass == IC_ARMOUR) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          break;
        else
          ubNumMatches++;
      }
    }
    if (ubNumMatches > 0) {
      for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
        uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
        if (uiItemClass == IC_ARMOUR) {
          if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
            break;
          else if (!Random(ubNumMatches--)) {
            pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
            break;
          }
        }
      }
    }
  }

  if (fKnife) {
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      // drops FIRST knife found
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass == IC_BLADE || uiItemClass == IC_THROWING_KNIFE) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          break;
        else {
          pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
          break;
        }
      }
    }
  }

  // note that they'll only drop ONE TYPE of grenade if they have multiple types (very common)
  if (fGrenades) {
    ubNumMatches = 0;
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass & IC_GRENADE) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          break;
        else
          ubNumMatches++;
      }
    }
    if (ubNumMatches > 0) {
      for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
        uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
        if (uiItemClass & IC_GRENADE) {
          if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
            break;
          else if (!Random(ubNumMatches--)) {
            pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
            break;
          }
        }
      }
    }
  }

  if (fKit) {
    ubNumMatches = 0;
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass == IC_MEDKIT || uiItemClass == IC_KIT) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          break;
        else
          ubNumMatches++;
      }
    }
    if (ubNumMatches > 0) {
      for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
        uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
        if (uiItemClass == IC_MEDKIT || uiItemClass == IC_KIT) {
          if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
            break;
          else if (!Random(ubNumMatches--)) {
            pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
            break;
          }
        }
      }
    }
  }

  if (fFace) {
    ubNumMatches = 0;
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass == IC_FACE) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          break;
        else
          ubNumMatches++;
      }
    }
    if (ubNumMatches > 0) {
      for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
        uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
        if (uiItemClass == IC_FACE) {
          if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
            break;
          else if (!Random(ubNumMatches--)) {
            pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
            break;
          }
        }
      }
    }
  }

  if (fMisc) {
    ubNumMatches = 0;
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
      if (uiItemClass == IC_MISC) {
        if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
          break;
        else
          ubNumMatches++;
      }
    }
    if (ubNumMatches > 0) {
      for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
        uiItemClass = Item[pp.value.Inv[i].usItem].usItemClass;
        if (uiItemClass == IC_MISC) {
          if (pp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE)
            break;
          else if (!Random(ubNumMatches--)) {
            pp.value.Inv[i].fFlags &= ~OBJECT_UNDROPPABLE;
            break;
          }
        }
      }
    }
  }
}

function AssignCreatureInventory(pSoldier: Pointer<SOLDIERTYPE>): void {
  let uiChanceToDrop: UINT32 = 0;
  let fMaleCreature: boolean = false;
  let fBloodcat: boolean = false;

  // all creature items in this first section are only offensive/defensive placeholders, and
  // never get dropped, because they're not real items!
  switch (pSoldier.value.ubBodyType) {
    case Enum194.ADULTFEMALEMONSTER:
      CreateItem(Enum225.CREATURE_OLD_FEMALE_CLAWS, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      CreateItem(Enum225.CREATURE_OLD_FEMALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
      CreateItem(Enum225.CREATURE_OLD_FEMALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.VESTPOS]));
      CreateItem(Enum225.CREATURE_OLD_FEMALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.LEGPOS]));
      uiChanceToDrop = 30;
      break;
    case Enum194.AM_MONSTER:
      CreateItem(Enum225.CREATURE_OLD_MALE_CLAWS, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      CreateItem(Enum225.CREATURE_OLD_MALE_SPIT, 100, addressof(pSoldier.value.inv[Enum261.SECONDHANDPOS]));
      CreateItem(Enum225.CREATURE_OLD_MALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
      CreateItem(Enum225.CREATURE_OLD_MALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.VESTPOS]));
      CreateItem(Enum225.CREATURE_OLD_MALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.LEGPOS]));
      uiChanceToDrop = 30;
      fMaleCreature = true;
      break;
    case Enum194.YAF_MONSTER:
      CreateItem(Enum225.CREATURE_YOUNG_FEMALE_CLAWS, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      CreateItem(Enum225.CREATURE_YOUNG_FEMALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
      CreateItem(Enum225.CREATURE_YOUNG_FEMALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.VESTPOS]));
      CreateItem(Enum225.CREATURE_YOUNG_FEMALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.LEGPOS]));
      uiChanceToDrop = 15;
      break;
    case Enum194.YAM_MONSTER:
      CreateItem(Enum225.CREATURE_YOUNG_MALE_CLAWS, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      CreateItem(Enum225.CREATURE_YOUNG_MALE_SPIT, 100, addressof(pSoldier.value.inv[Enum261.SECONDHANDPOS]));
      CreateItem(Enum225.CREATURE_YOUNG_MALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
      CreateItem(Enum225.CREATURE_YOUNG_MALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.VESTPOS]));
      CreateItem(Enum225.CREATURE_YOUNG_MALE_HIDE, 100, addressof(pSoldier.value.inv[Enum261.LEGPOS]));
      uiChanceToDrop = 15;
      fMaleCreature = true;
      break;
    case Enum194.INFANT_MONSTER:
      CreateItem(Enum225.CREATURE_INFANT_SPIT, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      CreateItem(Enum225.CREATURE_INFANT_HIDE, 100, addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
      CreateItem(Enum225.CREATURE_INFANT_HIDE, 100, addressof(pSoldier.value.inv[Enum261.VESTPOS]));
      CreateItem(Enum225.CREATURE_INFANT_HIDE, 100, addressof(pSoldier.value.inv[Enum261.LEGPOS]));
      uiChanceToDrop = 5;
      break;
    case Enum194.LARVAE_MONSTER:
      uiChanceToDrop = 0;
      break;
    case Enum194.QUEENMONSTER:
      CreateItem(Enum225.CREATURE_QUEEN_SPIT, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      CreateItem(Enum225.CREATURE_QUEEN_TENTACLES, 100, addressof(pSoldier.value.inv[Enum261.SECONDHANDPOS]));
      CreateItem(Enum225.CREATURE_QUEEN_HIDE, 100, addressof(pSoldier.value.inv[Enum261.HELMETPOS]));
      CreateItem(Enum225.CREATURE_QUEEN_HIDE, 100, addressof(pSoldier.value.inv[Enum261.VESTPOS]));
      CreateItem(Enum225.CREATURE_QUEEN_HIDE, 100, addressof(pSoldier.value.inv[Enum261.LEGPOS]));
      // she can't drop anything, because the items are unreachable anyways (she's too big!)
      uiChanceToDrop = 0;
      break;
    case Enum194.BLOODCAT:
      CreateItem(Enum225.BLOODCAT_CLAW_ATTACK, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      CreateItem(Enum225.BLOODCAT_BITE, 100, addressof(pSoldier.value.inv[Enum261.SECONDHANDPOS]));
      fBloodcat = true;
      uiChanceToDrop = 30;
      break;

    default:
      AssertMsg(false, String("Invalid creature bodytype %d", pSoldier.value.ubBodyType));
      return;
  }

  // decide if the creature will drop any REAL bodyparts
  if (Random(100) < uiChanceToDrop) {
    CreateItem((fBloodcat ? Enum225.BLOODCAT_CLAWS : Enum225.CREATURE_PART_CLAWS), (80 + Random(21)), addressof(pSoldier.value.inv[Enum261.BIGPOCK1POS]));
  }

  if (Random(100) < uiChanceToDrop) {
    CreateItem((fBloodcat ? Enum225.BLOODCAT_TEETH : Enum225.CREATURE_PART_FLESH), (80 + Random(21)), addressof(pSoldier.value.inv[Enum261.BIGPOCK2POS]));
  }

  // as requested by ATE, males are more likely to drop their "organs" (he actually suggested this, I'm serious!)
  if (fMaleCreature) {
    // increase chance by 50%
    uiChanceToDrop += (uiChanceToDrop / 2);
  }

  if (Random(100) < uiChanceToDrop) {
    CreateItem((fBloodcat ? Enum225.BLOODCAT_PELT : Enum225.CREATURE_PART_ORGAN), (80 + Random(21)), addressof(pSoldier.value.inv[Enum261.BIGPOCK3POS]));
  }
}

function ReplaceExtendedGuns(pp: Pointer<SOLDIERCREATE_STRUCT>, bSoldierClass: INT8): void {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let uiAttachDestIndex: UINT32;
  let bWeaponClass: INT8;
  let OldObj: OBJECTTYPE;
  let usItem: UINT16;
  let usNewGun: UINT16;
  let usAmmo: UINT16;
  let usNewAmmo: UINT16;

  for (uiLoop = 0; uiLoop < Enum261.NUM_INV_SLOTS; uiLoop++) {
    usItem = pp.value.Inv[uiLoop].usItem;

    if ((Item[usItem].usItemClass & IC_GUN) && ExtendedGunListGun(usItem)) {
      if (bSoldierClass == Enum262.SOLDIER_CLASS_NONE) {
        usNewGun = StandardGunListReplacement(usItem);
      } else {
        bWeaponClass = GetWeaponClass(usItem);
        AssertMsg(bWeaponClass != -1, String("Gun %d does not have a match in the extended gun array", usItem));
        usNewGun = SelectStandardArmyGun(bWeaponClass);
      }

      if (usNewGun != NOTHING) {
        // have to replace!  but first (ugh) must store backup (b/c of attachments)
        CopyObj(addressof(pp.value.Inv[uiLoop]), addressof(OldObj));
        CreateItem(usNewGun, OldObj.bGunStatus, addressof(pp.value.Inv[uiLoop]));
        pp.value.Inv[uiLoop].fFlags = OldObj.fFlags;

        // copy any valid attachments; for others, just drop them...
        if (ItemHasAttachments(addressof(OldObj))) {
          // we're going to copy into the first attachment position first :-)
          uiAttachDestIndex = 0;
          // loop!
          for (uiLoop2 = 0; uiLoop2 < MAX_ATTACHMENTS; uiLoop2++) {
            if ((OldObj.usAttachItem[uiLoop2] != NOTHING) && ValidAttachment(OldObj.usAttachItem[uiLoop2], usNewGun)) {
              pp.value.Inv[uiLoop].usAttachItem[uiAttachDestIndex] = OldObj.usAttachItem[uiLoop2];
              pp.value.Inv[uiLoop].bAttachStatus[uiAttachDestIndex] = OldObj.bAttachStatus[uiLoop2];
              uiAttachDestIndex++;
            }
          }
        }

        // must search through inventory and replace ammo accordingly
        for (uiLoop2 = 0; uiLoop2 < Enum261.NUM_INV_SLOTS; uiLoop2++) {
          usAmmo = pp.value.Inv[uiLoop2].usItem;
          if ((Item[usAmmo].usItemClass & IC_AMMO)) {
            usNewAmmo = FindReplacementMagazineIfNecessary(usItem, usAmmo, usNewGun);
            if (usNewAmmo != NOTHING) {
              // found a new magazine, replace...
              CreateItems(usNewAmmo, 100, pp.value.Inv[uiLoop2].ubNumberOfObjects, addressof(pp.value.Inv[uiLoop2]));
            }
          }
        }
      }
    }
  }
}

function SelectStandardArmyGun(uiGunLevel: UINT8): UINT16 {
  let pGunChoiceTable: Pointer<ARMY_GUN_CHOICE_TYPE>;
  let uiChoice: UINT32;
  let usGunIndex: UINT16;

  // pick the standard army gun for this weapon class from table
  //	usGunIndex = gStrategicStatus.ubStandardArmyGunIndex[uiGunLevel];

  // decided to randomize it afterall instead of repeating the same weapon over and over

  // depending on selection of the gun nut option
  if (gGameOptions.fGunNut) {
    // use table of extended gun choices
    pGunChoiceTable = addressof(gExtendedArmyGunChoices[0]);
  } else {
    // use table of regular gun choices
    pGunChoiceTable = addressof(gRegularArmyGunChoices[0]);
  }

  // choose one the of the possible gun choices
  uiChoice = Random(pGunChoiceTable[uiGunLevel].ubChoices);
  usGunIndex = pGunChoiceTable[uiGunLevel].bItemNo[uiChoice];

  Assert(usGunIndex);

  return usGunIndex;
}

function EquipTank(pp: Pointer<SOLDIERCREATE_STRUCT>): void {
  let Object: OBJECTTYPE;

  // tanks get special equipment, and they drop nothing (MGs are hard-mounted & non-removable)

  // main cannon
  CreateItem(Enum225.TANK_CANNON, (80 + Random(21)), addressof(pp.value.Inv[Enum261.HANDPOS]));
  pp.value.Inv[Enum261.HANDPOS].fFlags |= OBJECT_UNDROPPABLE;

  // machine gun
  CreateItems(Enum225.MINIMI, (80 + Random(21)), 1, addressof(Object));
  Object.fFlags |= OBJECT_UNDROPPABLE;
  PlaceObjectInSoldierCreateStruct(pp, addressof(Object));

  // tanks don't deplete shells or ammo...
  CreateItems(Enum225.TANK_SHELL, 100, 1, addressof(Object));
  Object.fFlags |= OBJECT_UNDROPPABLE;
  PlaceObjectInSoldierCreateStruct(pp, addressof(Object));

  // armour equal to spectra all over (for vs explosives)
  CreateItem(Enum225.SPECTRA_VEST, 100, addressof(pp.value.Inv[Enum261.VESTPOS]));
  pp.value.Inv[Enum261.VESTPOS].fFlags |= OBJECT_UNDROPPABLE;
  CreateItem(Enum225.SPECTRA_HELMET, 100, addressof(pp.value.Inv[Enum261.HELMETPOS]));
  pp.value.Inv[Enum261.HELMETPOS].fFlags |= OBJECT_UNDROPPABLE;
  CreateItem(Enum225.SPECTRA_LEGGINGS, 100, addressof(pp.value.Inv[Enum261.LEGPOS]));
  pp.value.Inv[Enum261.LEGPOS].fFlags |= OBJECT_UNDROPPABLE;
}

function ResetMortarsOnTeamCount(): void {
  guiMortarsRolledByTeam = 0;
}
