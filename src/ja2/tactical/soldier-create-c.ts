// THESE 3 DIFFICULTY FACTORS MUST ALWAYS ADD UP TO 100% EXACTLY!!!
const DIFF_FACTOR_PLAYER_PROGRESS = 50;
const DIFF_FACTOR_PALACE_DISTANCE = 30;
const DIFF_FACTOR_GAME_DIFFICULTY = 20;

// additional difficulty modifiers
const DIFF_MODIFIER_SOME_PROGRESS = +5;
const DIFF_MODIFIER_NO_INCOME = -5;
const DIFF_MODIFIER_DRASSEN_MILITIA = +10;

const PALACE_SECTOR_X = 3;
const PALACE_SECTOR_Y = 16;

const MAX_PALACE_DISTANCE = 20;

let gfProfiledEnemyAdded: BOOLEAN = FALSE;

let guiCurrentUniqueSoldierId: UINT32 = 1;

// CJC note: trust me, it's easiest just to put this here; this is the only
// place it should need to be used
let gubItemDroppableFlag: UINT8[] /* [NUM_INV_SLOTS] */ = [
  0x01,
  0x02,
  0x04,
  0,
  0,
  0x08,
  0,
  0x10,
  0x20,
  0x40,
  0x80,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];

function RandomizeNewSoldierStats(pCreateStruct: Pointer<SOLDIERCREATE_STRUCT>): void {
  pCreateStruct.value.bLifeMax = Random(50) + 50;
  pCreateStruct.value.bLife = pCreateStruct.value.bLifeMax;
  pCreateStruct.value.bAgility = Random(50) + 50;
  pCreateStruct.value.bDexterity = Random(50) + 50;
  pCreateStruct.value.bExpLevel = 1 + Random(4);

  // Randomize skills (for now)
  pCreateStruct.value.bMarksmanship = Random(50) + 50;
  pCreateStruct.value.bMedical = Random(50) + 50;
  pCreateStruct.value.bMechanical = Random(50) + 50;
  pCreateStruct.value.bExplosive = Random(50) + 50;
  pCreateStruct.value.bLeadership = Random(50) + 50;
  pCreateStruct.value.bStrength = Random(50) + 50;
  pCreateStruct.value.bWisdom = Random(50) + 50;
  pCreateStruct.value.bAttitude = Random(MAXATTITUDES);
  pCreateStruct.value.bOrders = FARPATROL;
  pCreateStruct.value.bMorale = 50;
  pCreateStruct.value.bAIMorale = MORALE_FEARLESS;
}

function TacticalCreateSoldier(pCreateStruct: Pointer<SOLDIERCREATE_STRUCT>, pubID: Pointer<UINT8>): Pointer<SOLDIERTYPE> {
  let Soldier: SOLDIERTYPE;
  let cnt: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let fGuyAvail: BOOLEAN = FALSE;
  let bLastTeamID: UINT8;
  let ubVehicleID: UINT8 = 0;

  *pubID = NOBODY;

  // Kris:
  // Huge no no!  See the header file for description of static detailed placements.
  // If this expression ever evaluates to true, then it will expose serious problems.
  // Simply returning won't help.
  if (pCreateStruct.value.fStatic) {
    Assert(0);
  }

  // Some values initialized here but could be changed before going to the common one
  InitSoldierStruct(&Soldier);

  Soldier.uiUniqueSoldierIdValue = guiCurrentUniqueSoldierId;

  guiCurrentUniqueSoldierId++;

  // OK, CHECK IF WE HAVE A VALID PROFILE ID!
  if (pCreateStruct.value.ubProfile != NO_PROFILE) {
    // We have a merc created by profile, do this!
    TacticalCopySoldierFromProfile(&Soldier, pCreateStruct);
  } else {
    TacticalCopySoldierFromCreateStruct(&Soldier, pCreateStruct);
  }

  // If we are NOT creating an existing soldier ( ie, this is not from a save game ), create soldier normally
  if (!pCreateStruct.value.fUseExistingSoldier) {
    // We want to determine what team to place these guys in...

    // First off, force player team if they are a player guy! ( do some other stuff for only our guys!
    if (pCreateStruct.value.fPlayerMerc) {
      Soldier.uiStatusFlags |= SOLDIER_PC;
      Soldier.bTeam = gbPlayerNum;
      Soldier.bVisible = 1;
    } else if (pCreateStruct.value.fPlayerPlan) {
      Soldier.uiStatusFlags |= SOLDIER_PC;
      Soldier.bVisible = 1;
    } else {
      Soldier.uiStatusFlags |= SOLDIER_ENEMY;
    }

    // Check for auto team
    if (pCreateStruct.value.bTeam == SOLDIER_CREATE_AUTO_TEAM) {
      // Auto determine!
      // OK, if this is our guy, set team as ours!
      if (pCreateStruct.value.fPlayerMerc) {
        Soldier.bTeam = OUR_TEAM;
        Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
      } else if (pCreateStruct.value.fPlayerPlan) {
        Soldier.bTeam = PLAYER_PLAN;
      } else {
        // LOOK AT BODY TYPE!
        switch (pCreateStruct.value.bBodyType) {
          case REGMALE:
          case BIGMALE:
          case STOCKYMALE:
          case REGFEMALE:

            Soldier.bTeam = ENEMY_TEAM;
            break;

          case ADULTFEMALEMONSTER:
          case AM_MONSTER:
          case YAF_MONSTER:
          case YAM_MONSTER:
          case LARVAE_MONSTER:
          case INFANT_MONSTER:
          case QUEENMONSTER:

            Soldier.bTeam = CREATURE_TEAM;
            break;

          case FATCIV:
          case MANCIV:
          case MINICIV:
          case DRESSCIV:
          case HATKIDCIV:
          case KIDCIV:
          case COW:
          case CROW:
          case ROBOTNOWEAPON:

            Soldier.bTeam = CIV_TEAM;
            break;
        }
      }
    } else {
      Soldier.bTeam = pCreateStruct.value.bTeam;
      // if WE_SEE_WHAT_MILITIA_SEES
      if (Soldier.bTeam == MILITIA_TEAM) {
        Soldier.bVisible = 1;
      }
    }

    // Copy the items over for thew soldier, only if we have a valid profile id!
    if (pCreateStruct.value.ubProfile != NO_PROFILE)
      CopyProfileItems(&Soldier, pCreateStruct);

    // Given team, get an ID for this guy!

    if (guiCurrentScreen != AUTORESOLVE_SCREEN) {
      cnt = gTacticalStatus.Team[Soldier.bTeam].bFirstID;

      // ATE: If we are a vehicle, and a player, start at a different slot ( 2 - max )
      if (Soldier.ubBodyType == HUMVEE || Soldier.ubBodyType == ELDORADO || Soldier.ubBodyType == ICECREAMTRUCK || Soldier.ubBodyType == JEEP) {
        if (Soldier.bTeam == gbPlayerNum) {
          cnt = gTacticalStatus.Team[Soldier.bTeam].bLastID - 1;
        }
      }

      bLastTeamID = gTacticalStatus.Team[Soldier.bTeam].bLastID;

      // look for all mercs on the same team,
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pTeamSoldier++) {
        if (!pTeamSoldier.value.bActive) {
          fGuyAvail = TRUE;
          break;
        }
      }

      // Check if there was space!
      if (!fGuyAvail) {
        // No space, so can't create the soldier.
        return NULL;
      }

      // OK, set ID
      Soldier.ubID = cnt;
      *pubID = Soldier.ubID;
    }

    // LOAD MERC's FACE!
    if (pCreateStruct.value.ubProfile != NO_PROFILE && Soldier.bTeam == OUR_TEAM) {
      Soldier.iFaceIndex = InitSoldierFace(&Soldier);
    }

    Soldier.bActionPoints = CalcActionPoints(&Soldier);
    Soldier.bInitialActionPoints = Soldier.bActionPoints;
    Soldier.bSide = gTacticalStatus.Team[Soldier.bTeam].bSide;
    Soldier.bActive = TRUE;
    Soldier.sSectorX = pCreateStruct.value.sSectorX;
    Soldier.sSectorY = pCreateStruct.value.sSectorY;
    Soldier.bSectorZ = pCreateStruct.value.bSectorZ;
    Soldier.ubInsertionDirection = pCreateStruct.value.bDirection;
    Soldier.bDesiredDirection = pCreateStruct.value.bDirection;
    Soldier.bDominantDir = pCreateStruct.value.bDirection;
    Soldier.bDirection = pCreateStruct.value.bDirection;

    Soldier.sInsertionGridNo = pCreateStruct.value.sInsertionGridNo;
    Soldier.bOldLife = Soldier.bLifeMax;

    // If a civvy, set neutral
    if (Soldier.bTeam == CIV_TEAM) {
      if (Soldier.ubProfile == WARDEN) {
        Soldier.bNeutral = FALSE;
      } else if (Soldier.ubCivilianGroup != NON_CIV_GROUP) {
        if (gTacticalStatus.fCivGroupHostile[Soldier.ubCivilianGroup] == CIV_GROUP_HOSTILE) {
          Soldier.bNeutral = FALSE;
        } else {
          Soldier.bNeutral = TRUE;
        }
      } else {
        Soldier.bNeutral = TRUE;
      }

      // Weaken stats based on the bodytype of the civilian.
      if (Soldier.ubProfile == NO_PROFILE) {
        switch (Soldier.ubBodyType) {
          case REGMALE:
          case BIGMALE:
          case STOCKYMALE:
          case REGFEMALE:
            // no adjustments necessary for these "healthy" bodytypes.
            break;
          case FATCIV:
            // fat, so slower
            Soldier.bAgility = (30 + Random(26)); // 30 - 55
            break;
          case MANCIV:
            Soldier.bLife = Soldier.bLifeMax = (35 + Random(26)); // 35 - 60
            break;
          case MINICIV:
          case DRESSCIV:
            Soldier.bLife = Soldier.bLifeMax = (30 + Random(16)); // 30 - 45
            break;
          case HATKIDCIV:
          case KIDCIV:
            Soldier.bLife = Soldier.bLifeMax = (20 + Random(16)); // 20 - 35
            break;
          case CRIPPLECIV:
            Soldier.bLife = Soldier.bLifeMax = (20 + Random(26)); // 20 - 45
            Soldier.bAgility = (30 + Random(16)); // 30 - 45
            break;
        }
      }
    } else if (Soldier.bTeam == CREATURE_TEAM) {
      // bloodcats are neutral to start out
      if (Soldier.ubBodyType == BLOODCAT) {
        Soldier.bNeutral = TRUE;
      } // otherwise (creatures) false
    }

    // OK, If not given a profile num, set a randomized defualt battle sound set
    // and then adjust it according to body type!
    if (Soldier.ubProfile == NO_PROFILE) {
      Soldier.ubBattleSoundID = Random(3);
    }

    // ATE: TEMP : No enemy women mercs (unless elite)!
    if (Soldier.ubProfile == NO_PROFILE && Soldier.bTeam == ENEMY_TEAM && Soldier.ubBodyType == REGFEMALE && Soldier.ubSoldierClass != SOLDIER_CLASS_ELITE) {
      Soldier.ubBodyType = (REGMALE + Random(3));
    }

    // ATE
    // Set some values for variation in anims...
    if (Soldier.ubBodyType == BIGMALE) {
      Soldier.uiAnimSubFlags |= SUB_ANIM_BIGGUYTHREATENSTANCE;
    }

    // For inventory, look for any face class items that may be located in the big pockets and if found, move
    // that item to a face slot and clear the pocket!
    if (Soldier.bTeam != OUR_TEAM) {
      let i: INT32;
      let fSecondFaceItem: BOOLEAN = FALSE;
      for (i = BIGPOCK1POS; i <= BIGPOCK4POS; i++) {
        if (Item[Soldier.inv[i].usItem].usItemClass & IC_FACE) {
          if (!fSecondFaceItem) {
            // Don't check for compatibility...  automatically assume there are no head positions filled.
            fSecondFaceItem = TRUE;
            memcpy(&Soldier.inv[HEAD1POS], &Soldier.inv[i], sizeof(OBJECTTYPE));
            memset(&Soldier.inv[i], 0, sizeof(OBJECTTYPE));
          } else {
            // if there is a second item, compare it to the first one we already added.
            if (CompatibleFaceItem(Soldier.inv[HEAD1POS].usItem, Soldier.inv[i].usItem)) {
              memcpy(&Soldier.inv[HEAD2POS], &Soldier.inv[i], sizeof(OBJECTTYPE));
              memset(&Soldier.inv[i], 0, sizeof(OBJECTTYPE));
              break;
            }
          }
        }
      }

      if (guiCurrentScreen != AUTORESOLVE_SCREEN) {
        // also, if an army guy has camouflage, roll to determine whether they start camouflaged
        if (Soldier.bTeam == ENEMY_TEAM) {
          i = FindObj(&Soldier, CAMOUFLAGEKIT);

          if (i != NO_SLOT && Random(5) < SoldierDifficultyLevel(&Soldier)) {
            // start camouflaged
            Soldier.bCamo = 100;
          }
        }
      }
    }

    // Set some flags, actions based on what body type we are
    // NOTE:  BE VERY CAREFUL WHAT YOU DO IN THIS SECTION!
    //  It is very possible to override editor settings, especially orders and attitude.
    //  In those cases, you can check for !gfEditMode (not in editor).
    switch (Soldier.ubBodyType) {
      case HATKIDCIV:
      case KIDCIV:

        Soldier.ubBattleSoundID = Random(2);
        break;

      case REGFEMALE:
      case MINICIV:
      case DRESSCIV:

        Soldier.ubBattleSoundID = 7 + Random(2);
        Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
        break;

      case BLOODCAT:
        AssignCreatureInventory(&Soldier);
        Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
        Soldier.uiStatusFlags |= SOLDIER_ANIMAL;
        break;

      case ADULTFEMALEMONSTER:
      case AM_MONSTER:
      case YAF_MONSTER:
      case YAM_MONSTER:
      case LARVAE_MONSTER:
      case INFANT_MONSTER:
      case QUEENMONSTER:

        AssignCreatureInventory(&Soldier);
        Soldier.ubCaller = NOBODY;
        if (!gfEditMode) {
          Soldier.bOrders = FARPATROL;
          Soldier.bAttitude = AGGRESSIVE;
        }
        Soldier.uiStatusFlags |= SOLDIER_MONSTER;
        Soldier.bMonsterSmell = NORMAL_CREATURE_SMELL_STRENGTH;
        break;

      case COW:
        Soldier.uiStatusFlags |= SOLDIER_ANIMAL;
        Soldier.bNormalSmell = COW_SMELL_STRENGTH;
        break;
      case CROW:

        Soldier.uiStatusFlags |= SOLDIER_ANIMAL;
        break;

      case ROBOTNOWEAPON:

        Soldier.uiStatusFlags |= SOLDIER_ROBOT;
        break;

      case HUMVEE:
      case ELDORADO:
      case ICECREAMTRUCK:
      case JEEP:
      case TANK_NW:
      case TANK_NE:

        Soldier.uiStatusFlags |= SOLDIER_VEHICLE;

        switch (Soldier.ubBodyType) {
          case HUMVEE:

            ubVehicleID = HUMMER;
            Soldier.bNeutral = TRUE;
            break;

          case ELDORADO:

            ubVehicleID = ELDORADO_CAR;
            Soldier.bNeutral = TRUE;
            break;

          case ICECREAMTRUCK:

            ubVehicleID = ICE_CREAM_TRUCK;
            Soldier.bNeutral = TRUE;
            break;

          case JEEP:

            ubVehicleID = JEEP_CAR;
            break;

          case TANK_NW:
          case TANK_NE:

            ubVehicleID = TANK_CAR;
            break;
        }

        if (pCreateStruct.value.fUseGivenVehicle) {
          Soldier.bVehicleID = pCreateStruct.value.bUseGivenVehicleID;
        } else {
          // Add vehicle to list....
          Soldier.bVehicleID = AddVehicleToList(Soldier.sSectorX, Soldier.sSectorY, Soldier.bSectorZ, ubVehicleID);
        }
        SetVehicleValuesIntoSoldierType(&Soldier);
        break;

      default:
        Soldier.bNormalSmell = NORMAL_HUMAN_SMELL_STRENGTH;
        break;
    }

    if (guiCurrentScreen != AUTORESOLVE_SCREEN) {
      // Copy into merc struct
      memcpy(MercPtrs[Soldier.ubID], &Soldier, sizeof(SOLDIERTYPE));
      // Alrighty then, we are set to create the merc, stuff after here can fail!
      CHECKF(CreateSoldierCommon(Soldier.ubBodyType, MercPtrs[Soldier.ubID], Soldier.ubID, STANDING) != FALSE);
    }
  } else {
    // Copy the data from the existing soldier struct to the new soldier struct
    if (!CopySavedSoldierInfoToNewSoldier(&Soldier, pCreateStruct.value.pExistingSoldier))
      return FALSE;

    // Reset the face index
    Soldier.iFaceIndex = -1;
    Soldier.iFaceIndex = InitSoldierFace(&Soldier);

    // ATE: Reset soldier's light value to -1....
    Soldier.iLight = -1;

    if (Soldier.ubBodyType == HUMVEE || Soldier.ubBodyType == ICECREAMTRUCK) {
      Soldier.bNeutral = TRUE;
    }

    // Copy into merc struct
    memcpy(MercPtrs[Soldier.ubID], &Soldier, sizeof(SOLDIERTYPE));

    // Alrighty then, we are set to create the merc, stuff after here can fail!
    CHECKF(CreateSoldierCommon(Soldier.ubBodyType, MercPtrs[Soldier.ubID], Soldier.ubID, Menptr[Soldier.ubID].usAnimState) != FALSE);

    *pubID = Soldier.ubID;

    // The soldiers animation frame gets reset, set
    //		Menptr[ Soldier.ubID ].usAniCode = pCreateStruct->pExistingSoldier->usAniCode;
    //		Menptr[ Soldier.ubID ].usAnimState = Soldier.usAnimState;
    //		Menptr[ Soldier.ubID ].usAniFrame = Soldier.usAniFrame;
  }

  if (guiCurrentScreen != AUTORESOLVE_SCREEN) {
    if (pCreateStruct.value.fOnRoof && FlatRoofAboveGridNo(pCreateStruct.value.sInsertionGridNo)) {
      SetSoldierHeight(MercPtrs[Soldier.ubID], 58.0);
    }

    // if we are loading DONT add men to team, because the number is restored in gTacticalStatus
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      // Increment men in sector number!
      AddManToTeam(Soldier.bTeam);
    }

    return MercPtrs[Soldier.ubID];
  } else {
    // We are creating a dynamically allocated soldier for autoresolve.
    let pSoldier: Pointer<SOLDIERTYPE>;
    let ubSectorID: UINT8;
    ubSectorID = GetAutoResolveSectorID();
    pSoldier = MemAlloc(sizeof(SOLDIERTYPE));
    if (!pSoldier)
      return NULL;
    memcpy(pSoldier, &Soldier, sizeof(SOLDIERTYPE));
    pSoldier.value.ubID = 255;
    pSoldier.value.sSectorX = SECTORX(ubSectorID);
    pSoldier.value.sSectorY = SECTORY(ubSectorID);
    pSoldier.value.bSectorZ = 0;
    *pubID = 255;
    return pSoldier;
  }
}

function TacticalCopySoldierFromProfile(pSoldier: Pointer<SOLDIERTYPE>, pCreateStruct: Pointer<SOLDIERCREATE_STRUCT>): BOOLEAN {
  let ubProfileIndex: UINT8;
  let pProfile: Pointer<MERCPROFILESTRUCT>;

  ubProfileIndex = pCreateStruct.value.ubProfile;
  pProfile = &(gMercProfiles[ubProfileIndex]);

  SET_PALETTEREP_ID(pSoldier.value.HeadPal, pProfile.value.HAIR);
  SET_PALETTEREP_ID(pSoldier.value.VestPal, pProfile.value.VEST);
  SET_PALETTEREP_ID(pSoldier.value.SkinPal, pProfile.value.SKIN);
  SET_PALETTEREP_ID(pSoldier.value.PantsPal, pProfile.value.PANTS);

  // Set profile index!
  pSoldier.value.ubProfile = ubProfileIndex;
  pSoldier.value.ubScheduleID = pCreateStruct.value.ubScheduleID;
  pSoldier.value.bHasKeys = pCreateStruct.value.fHasKeys;

  wcscpy(pSoldier.value.name, pProfile.value.zNickname);

  pSoldier.value.bLife = pProfile.value.bLife;
  pSoldier.value.bLifeMax = pProfile.value.bLifeMax;
  pSoldier.value.bAgility = pProfile.value.bAgility;
  pSoldier.value.bLeadership = pProfile.value.bLeadership;
  pSoldier.value.bDexterity = pProfile.value.bDexterity;
  pSoldier.value.bStrength = pProfile.value.bStrength;
  pSoldier.value.bWisdom = pProfile.value.bWisdom;
  pSoldier.value.bExpLevel = pProfile.value.bExpLevel;
  pSoldier.value.bMarksmanship = pProfile.value.bMarksmanship;
  pSoldier.value.bMedical = pProfile.value.bMedical;
  pSoldier.value.bMechanical = pProfile.value.bMechanical;
  pSoldier.value.bExplosive = pProfile.value.bExplosive;
  pSoldier.value.bScientific = pProfile.value.bScientific;

  pSoldier.value.bVocalVolume = MIDVOLUME;
  pSoldier.value.uiAnimSubFlags = pProfile.value.uiBodyTypeSubFlags;
  pSoldier.value.ubBodyType = pProfile.value.ubBodyType;
  pSoldier.value.ubCivilianGroup = pProfile.value.ubCivilianGroup;
  // OK set initial duty
  //  pSoldier->bAssignment=ON_DUTY;

  pSoldier.value.bOldAssignment = NO_ASSIGNMENT;
  pSoldier.value.ubSkillTrait1 = pProfile.value.bSkillTrait;
  pSoldier.value.ubSkillTrait2 = pProfile.value.bSkillTrait2;

  pSoldier.value.bOrders = pCreateStruct.value.bOrders;
  pSoldier.value.bAttitude = pCreateStruct.value.bAttitude;
  pSoldier.value.bDirection = pCreateStruct.value.bDirection;
  pSoldier.value.bPatrolCnt = pCreateStruct.value.bPatrolCnt;
  memcpy(pSoldier.value.usPatrolGrid, pCreateStruct.value.sPatrolGrid, sizeof(INT16) * MAXPATROLGRIDS);

  if (HAS_SKILL_TRAIT(pSoldier, CAMOUFLAGED)) {
    // set camouflaged to 100 automatically
    pSoldier.value.bCamo = 100;
  }
  return TRUE;
}

const enum Enum266 {
  PINKSKIN,
  TANSKIN,
  DARKSKIN,
  BLACKSKIN,
  NUMSKINS,
}
const enum Enum267 {
  WHITEHEAD,
  BLACKHEAD, // black skin (only this line )
  BROWNHEAD, // dark skin (this line plus all above)
  BLONDEHEAD,
  REDHEAD, // pink/tan skin (this line plus all above )
  NUMHEADS,
}

function ChooseHairColor(pSoldier: Pointer<SOLDIERTYPE>, skin: INT32): INT32 {
  let iRandom: INT32;
  let hair: INT32 = 0;
  iRandom = Random(100);
  switch (skin) {
    case PINKSKIN:
    case TANSKIN:
      if (iRandom < 12) {
        hair = REDHEAD;
      } else if (iRandom < 34) {
        hair = BLONDEHEAD;
      } else if (iRandom < 60) {
        hair = BROWNHEAD;
      } else if (iRandom < 92) {
        hair = BLACKHEAD;
      } else {
        hair = WHITEHEAD;
        if (pSoldier.value.ubBodyType == REGFEMALE || pSoldier.value.ubBodyType == MINICIV || pSoldier.value.ubBodyType == DRESSCIV || pSoldier.value.ubBodyType == HATKIDCIV || pSoldier.value.ubBodyType == KIDCIV) {
          hair = Random(NUMHEADS - 1) + 1;
        }
      }
      hair = Random(NUMHEADS);
      break;
    case DARKSKIN:
      if (iRandom < 35) {
        hair = BROWNHEAD;
      } else if (iRandom < 84) {
        hair = BLACKHEAD;
      } else {
        hair = WHITEHEAD;
        if (pSoldier.value.ubBodyType == REGFEMALE || pSoldier.value.ubBodyType == MINICIV || pSoldier.value.ubBodyType == DRESSCIV || pSoldier.value.ubBodyType == HATKIDCIV || pSoldier.value.ubBodyType == KIDCIV) {
          hair = Random(2) + 1;
        }
      }
      break;
    case BLACKSKIN:
      if (iRandom < 84) {
        hair = BLACKHEAD;
      } else {
        hair = WHITEHEAD;
        if (pSoldier.value.ubBodyType == REGFEMALE || pSoldier.value.ubBodyType == MINICIV || pSoldier.value.ubBodyType == DRESSCIV || pSoldier.value.ubBodyType == HATKIDCIV || pSoldier.value.ubBodyType == KIDCIV) {
          hair = BLACKHEAD;
        }
      }
      break;
    default:
      AssertMsg(0, "Skin type not accounted for.");
      break;
  }
  if (pSoldier.value.ubBodyType == CRIPPLECIV) {
    if (Chance(50)) {
      hair = WHITEHEAD;
    }
  }
  return hair;
}

function GeneratePaletteForSoldier(pSoldier: Pointer<SOLDIERTYPE>, ubSoldierClass: UINT8): void {
  let skin: INT32;
  let hair: INT32;
  let fMercClothingScheme: BOOLEAN;
  hair = -1;

  // choose random skin tone which will limit the choice of hair colors.
  skin = Random(NUMSKINS);
  switch (skin) {
    case PINKSKIN:
      SET_PALETTEREP_ID(pSoldier.value.SkinPal, "PINKSKIN");
      break;
    case TANSKIN:
      SET_PALETTEREP_ID(pSoldier.value.SkinPal, "TANSKIN");
      break;
    case DARKSKIN:
      SET_PALETTEREP_ID(pSoldier.value.SkinPal, "DARKSKIN");
      break;
    case BLACKSKIN:
      SET_PALETTEREP_ID(pSoldier.value.SkinPal, "BLACKSKIN");
      break;
    default:
      AssertMsg(0, "Skin type not accounted for.");
      break;
  }

  // Choose hair color which uses the skin color to limit choices
  hair = ChooseHairColor(pSoldier, skin);
  switch (hair) {
    case BROWNHEAD:
      SET_PALETTEREP_ID(pSoldier.value.HeadPal, "BROWNHEAD");
      break;
    case BLACKHEAD:
      SET_PALETTEREP_ID(pSoldier.value.HeadPal, "BLACKHEAD");
      break;
    case WHITEHEAD:
      SET_PALETTEREP_ID(pSoldier.value.HeadPal, "WHITEHEAD");
      break;
    case BLONDEHEAD:
      SET_PALETTEREP_ID(pSoldier.value.HeadPal, "BLONDHEAD");
      break;
    case REDHEAD:
      SET_PALETTEREP_ID(pSoldier.value.HeadPal, "REDHEAD");
      break;
    default:
      AssertMsg(0, "Hair type not accounted for.");
      break;
  }

  // OK, After skin, hair we could have a forced color scheme.. use here if so
  switch (ubSoldierClass) {
    case SOLDIER_CLASS_ADMINISTRATOR:
      SET_PALETTEREP_ID(pSoldier.value.VestPal, "YELLOWVEST");
      SET_PALETTEREP_ID(pSoldier.value.PantsPal, "GREENPANTS");
      pSoldier.value.ubSoldierClass = ubSoldierClass;
      return;
    case SOLDIER_CLASS_ELITE:
      SET_PALETTEREP_ID(pSoldier.value.VestPal, "BLACKSHIRT");
      SET_PALETTEREP_ID(pSoldier.value.PantsPal, "BLACKPANTS");
      pSoldier.value.ubSoldierClass = ubSoldierClass;
      return;
    case SOLDIER_CLASS_ARMY:
      SET_PALETTEREP_ID(pSoldier.value.VestPal, "REDVEST");
      SET_PALETTEREP_ID(pSoldier.value.PantsPal, "GREENPANTS");
      pSoldier.value.ubSoldierClass = ubSoldierClass;
      return;
    case SOLDIER_CLASS_GREEN_MILITIA:
      SET_PALETTEREP_ID(pSoldier.value.VestPal, "GREENVEST");
      SET_PALETTEREP_ID(pSoldier.value.PantsPal, "BEIGEPANTS");
      pSoldier.value.ubSoldierClass = ubSoldierClass;
      return;
    case SOLDIER_CLASS_REG_MILITIA:
      SET_PALETTEREP_ID(pSoldier.value.VestPal, "JEANVEST");
      SET_PALETTEREP_ID(pSoldier.value.PantsPal, "BEIGEPANTS");
      pSoldier.value.ubSoldierClass = ubSoldierClass;
      return;
    case SOLDIER_CLASS_ELITE_MILITIA:
      SET_PALETTEREP_ID(pSoldier.value.VestPal, "BLUEVEST");
      SET_PALETTEREP_ID(pSoldier.value.PantsPal, "BEIGEPANTS");
      pSoldier.value.ubSoldierClass = ubSoldierClass;
      return;
    case SOLDIER_CLASS_MINER:
      SET_PALETTEREP_ID(pSoldier.value.VestPal, "greyVEST");
      SET_PALETTEREP_ID(pSoldier.value.PantsPal, "BEIGEPANTS");
      pSoldier.value.ubSoldierClass = ubSoldierClass;
      return;
  }

  // there are 2 clothing schemes, 1 for mercs and 1 for civilians.  The
  // merc clothing scheme is much larger and general and is an exclusive superset
  // of the civilian clothing scheme which means the civilians will choose the
  // merc clothing scheme often ( actually 60% of the time ).
  if (!pSoldier.value.PantsPal[0] || !pSoldier.value.VestPal[0]) {
    fMercClothingScheme = TRUE;
    if (pSoldier.value.bTeam == CIV_TEAM && Random(100) < 40) {
      // 40% chance of using cheezy civilian colors
      fMercClothingScheme = FALSE;
    }
    if (!fMercClothingScheme) // CHEEZY CIVILIAN COLORS
    {
      if (Random(100) < 30) {
        // 30% chance that the civilian will choose a gaudy yellow shirt with pants.
        SET_PALETTEREP_ID(pSoldier.value.VestPal, "GYELLOWSHIRT");
        switch (Random(3)) {
          case 0:
            SET_PALETTEREP_ID(pSoldier.value.PantsPal, "TANPANTS");
            break;
          case 1:
            SET_PALETTEREP_ID(pSoldier.value.PantsPal, "BEIGEPANTS");
            break;
          case 2:
            SET_PALETTEREP_ID(pSoldier.value.PantsPal, "GREENPANTS");
            break;
        }
      } else {
        // 70% chance that the civilian will choose jeans with a shirt.
        SET_PALETTEREP_ID(pSoldier.value.PantsPal, "JEANPANTS");
        switch (Random(7)) {
          case 0:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "WHITEVEST");
            break;
          case 1:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BLACKSHIRT");
            break;
          case 2:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "PURPLESHIRT");
            break;
          case 3:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BLUEVEST");
            break;
          case 4:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BROWNVEST");
            break;
          case 5:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "JEANVEST");
            break;
          case 6:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "REDVEST");
            break;
        }
      }
      return;
    }
    // MERC COLORS
    switch (Random(3)) {
      case 0:
        SET_PALETTEREP_ID(pSoldier.value.PantsPal, "GREENPANTS");
        switch (Random(4)) {
          case 0:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "YELLOWVEST");
            break;
          case 1:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "WHITEVEST");
            break;
          case 2:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BROWNVEST");
            break;
          case 3:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "GREENVEST");
            break;
        }
        break;
      case 1:
        SET_PALETTEREP_ID(pSoldier.value.PantsPal, "TANPANTS");
        switch (Random(8)) {
          case 0:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "YELLOWVEST");
            break;
          case 1:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "WHITEVEST");
            break;
          case 2:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BLACKSHIRT");
            break;
          case 3:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BLUEVEST");
            break;
          case 4:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BROWNVEST");
            break;
          case 5:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "GREENVEST");
            break;
          case 6:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "JEANVEST");
            break;
          case 7:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "REDVEST");
            break;
        }
        break;
      case 2:
        SET_PALETTEREP_ID(pSoldier.value.PantsPal, "BLUEPANTS");
        switch (Random(4)) {
          case 0:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "YELLOWVEST");
            break;
          case 1:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "WHITEVEST");
            break;
          case 2:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "REDVEST");
            break;
          case 3:
            SET_PALETTEREP_ID(pSoldier.value.VestPal, "BLACKSHIRT");
            break;
        }
        break;
    }
  }
}

function TacticalCopySoldierFromCreateStruct(pSoldier: Pointer<SOLDIERTYPE>, pCreateStruct: Pointer<SOLDIERCREATE_STRUCT>): BOOLEAN {
  pSoldier.value.ubProfile = NO_PROFILE;

  // Randomize attributes
  pSoldier.value.bLife = pCreateStruct.value.bLife;
  pSoldier.value.bLifeMax = pCreateStruct.value.bLifeMax;
  pSoldier.value.bAgility = pCreateStruct.value.bAgility;
  pSoldier.value.bDexterity = pCreateStruct.value.bDexterity;
  pSoldier.value.bExpLevel = pCreateStruct.value.bExpLevel;

  pSoldier.value.bMarksmanship = pCreateStruct.value.bMarksmanship;
  pSoldier.value.bMedical = pCreateStruct.value.bMedical;
  pSoldier.value.bMechanical = pCreateStruct.value.bMechanical;
  pSoldier.value.bExplosive = pCreateStruct.value.bExplosive;
  pSoldier.value.bLeadership = pCreateStruct.value.bLeadership;
  pSoldier.value.bStrength = pCreateStruct.value.bStrength;
  pSoldier.value.bWisdom = pCreateStruct.value.bWisdom;

  pSoldier.value.bAttitude = pCreateStruct.value.bAttitude;
  pSoldier.value.bOrders = pCreateStruct.value.bOrders;
  pSoldier.value.bMorale = pCreateStruct.value.bMorale;
  pSoldier.value.bAIMorale = pCreateStruct.value.bAIMorale;
  pSoldier.value.bVocalVolume = MIDVOLUME;
  pSoldier.value.ubBodyType = pCreateStruct.value.bBodyType;
  pSoldier.value.ubCivilianGroup = pCreateStruct.value.ubCivilianGroup;

  pSoldier.value.ubScheduleID = pCreateStruct.value.ubScheduleID;
  pSoldier.value.bHasKeys = pCreateStruct.value.fHasKeys;
  pSoldier.value.ubSoldierClass = pCreateStruct.value.ubSoldierClass;

  if (pCreateStruct.value.fVisible) {
    sprintf(pSoldier.value.HeadPal, pCreateStruct.value.HeadPal);
    sprintf(pSoldier.value.PantsPal, pCreateStruct.value.PantsPal);
    sprintf(pSoldier.value.VestPal, pCreateStruct.value.VestPal);
    sprintf(pSoldier.value.SkinPal, pCreateStruct.value.SkinPal);
  }

  // KM:  March 25, 1999
  // Assign nightops traits to enemies/militia
  if (pSoldier.value.ubSoldierClass == SOLDIER_CLASS_ELITE || pSoldier.value.ubSoldierClass == SOLDIER_CLASS_ELITE_MILITIA) {
    let iChance: INT32;
    let ubProgress: UINT8;

    ubProgress = HighestPlayerProgressPercentage();

    if (ubProgress < 60) {
      // ramp chance from 40 to 80% over the course of 60% progress
      // 60 * 2/3 = 40, and 40+40 = 80
      iChance = 40 + (ubProgress * 2) / 3;
    } else {
      iChance = 80;
    }

    if (Chance(iChance)) {
      pSoldier.value.ubSkillTrait1 = NIGHTOPS;
      if (ubProgress >= 40 && Chance(30)) {
        pSoldier.value.ubSkillTrait2 = NIGHTOPS;
      }
    }
  } else if (pSoldier.value.ubSoldierClass == SOLDIER_CLASS_ARMY || pSoldier.value.ubSoldierClass == SOLDIER_CLASS_REG_MILITIA) {
    let iChance: INT32;
    let ubProgress: UINT8;

    ubProgress = HighestPlayerProgressPercentage();

    if (ubProgress < 60) {
      // ramp chance from 0 to 40% over the course of 60% progress
      // 60 * 2/3 = 40
      iChance = (ubProgress * 2) / 3;
    } else {
      iChance = 40;
    }

    if (Chance(iChance)) {
      pSoldier.value.ubSkillTrait1 = NIGHTOPS;
      if (ubProgress >= 50 && Chance(20)) {
        pSoldier.value.ubSkillTrait2 = NIGHTOPS;
      }
    }
  }

  // KM:  November 10, 1997
  // Adding patrol points
  // CAUTION:  CONVERTING SIGNED TO UNSIGNED though the values should never be negative.
  pSoldier.value.bPatrolCnt = pCreateStruct.value.bPatrolCnt;
  memcpy(pSoldier.value.usPatrolGrid, pCreateStruct.value.sPatrolGrid, sizeof(INT16) * MAXPATROLGRIDS);

  // Kris:  November 10, 1997
  // Expanded the default names based on team.
  switch (pCreateStruct.value.bTeam) {
    case ENEMY_TEAM:
      swprintf(pSoldier.value.name, TacticalStr[ENEMY_TEAM_MERC_NAME]);
      break;
    case MILITIA_TEAM:
      swprintf(pSoldier.value.name, TacticalStr[MILITIA_TEAM_MERC_NAME]);
      break;
    case CIV_TEAM:
      if (pSoldier.value.ubSoldierClass == SOLDIER_CLASS_MINER) {
        swprintf(pSoldier.value.name, TacticalStr[CIV_TEAM_MINER_NAME]);
      } else {
        swprintf(pSoldier.value.name, TacticalStr[CIV_TEAM_MERC_NAME]);
      }
      break;
    case CREATURE_TEAM:
      if (pSoldier.value.ubBodyType == BLOODCAT) {
        swprintf(pSoldier.value.name, gzLateLocalizedString[36]);
      } else {
        swprintf(pSoldier.value.name, TacticalStr[CREATURE_TEAM_MERC_NAME]);
        break;
      }
      break;
  }

  // Generate colors for soldier based on the body type.
  GeneratePaletteForSoldier(pSoldier, pCreateStruct.value.ubSoldierClass);

  // Copy item info over
  memcpy(pSoldier.value.inv, pCreateStruct.value.Inv, sizeof(OBJECTTYPE) * NUM_INV_SLOTS);

  return TRUE;
}

function InitSoldierStruct(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Memset values
  memset(pSoldier, 0, sizeof(SOLDIERTYPE));

  // Set default values
  pSoldier.value.bVisible = -1;
  pSoldier.value.iFaceIndex = -1;

  // Set morale default
  pSoldier.value.bMorale = DEFAULT_MORALE;

  pSoldier.value.ubAttackerID = NOBODY;
  pSoldier.value.ubPreviousAttackerID = NOBODY;
  pSoldier.value.ubNextToPreviousAttackerID = NOBODY;

  // Set AI Delay!
  pSoldier.value.uiAIDelay = 100;

  pSoldier.value.iLight = -1;
  pSoldier.value.iFaceIndex = -1;

  // Set update time to new speed
  pSoldier.value.ubDesiredHeight = NO_DESIRED_HEIGHT;
  pSoldier.value.bViewRange = NORMAL_VIEW_RANGE;
  pSoldier.value.bInSector = FALSE;
  pSoldier.value.sGridNo = NO_MAP_POS;
  pSoldier.value.iMuzFlash = -1;
  pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
  pSoldier.value.usPendingAnimation2 = NO_PENDING_ANIMATION;
  pSoldier.value.ubPendingStanceChange = NO_PENDING_STANCE;
  pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
  pSoldier.value.bLastRenderVisibleValue = -1;
  pSoldier.value.bBreath = 99;
  pSoldier.value.bBreathMax = 100;
  pSoldier.value.bActive = TRUE;
  pSoldier.value.fShowLocator = FALSE;
  pSoldier.value.sLastTarget = NOWHERE;
  pSoldier.value.sAbsoluteFinalDestination = NOWHERE;
  pSoldier.value.sZLevelOverride = -1;
  pSoldier.value.ubServicePartner = NOBODY;
  pSoldier.value.ubAttackingHand = HANDPOS;
  pSoldier.value.usAnimState = STANDING;
  pSoldier.value.bInterruptDuelPts = NO_INTERRUPT;
  pSoldier.value.bMoved = FALSE;
  pSoldier.value.ubRobotRemoteHolderID = NOBODY;
  pSoldier.value.sNoiseGridno = NOWHERE;
  pSoldier.value.ubPrevSectorID = 255;
  pSoldier.value.bNextPatrolPnt = 1;
  pSoldier.value.bCurrentCivQuote = -1;
  pSoldier.value.bCurrentCivQuoteDelta = 0;
  pSoldier.value.uiBattleSoundID = NO_SAMPLE;
  pSoldier.value.ubXRayedBy = NOBODY;
  pSoldier.value.uiXRayActivatedTime = 0;
  pSoldier.value.bBulletsLeft = 0;
  pSoldier.value.bVehicleUnderRepairID = -1;
}

function InternalTacticalRemoveSoldier(usSoldierIndex: UINT16, fRemoveVehicle: BOOLEAN): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Check range of index given
  if (usSoldierIndex < 0 || usSoldierIndex > TOTAL_SOLDIERS - 1) {
    // Set debug message

    return FALSE;
  }

  // ATE: If this guy is our global selected dude, take selection off...
  if (gfUIFullTargetFound && gusUIFullTargetID == usSoldierIndex) {
    gfUIFullTargetFound = FALSE;
  }
  // This one is for a single-gridno guy.....
  if (gfUISelectiveTargetFound && gusUISelectiveTargetID == usSoldierIndex) {
    gfUISelectiveTargetFound = FALSE;
  }

  pSoldier = MercPtrs[usSoldierIndex];

  return TacticalRemoveSoldierPointer(pSoldier, fRemoveVehicle);
}

function TacticalRemoveSoldierPointer(pSoldier: Pointer<SOLDIERTYPE>, fRemoveVehicle: BOOLEAN): BOOLEAN {
  if (!pSoldier.value.bActive)
    return FALSE;

  if (pSoldier.value.ubScheduleID) {
    DeleteSchedule(pSoldier.value.ubScheduleID);
  }

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE && fRemoveVehicle) {
    // remove this vehicle from the list
    RemoveVehicleFromList(pSoldier.value.bVehicleID);
  }

  // Handle crow leave....
  if (pSoldier.value.ubBodyType == CROW) {
    HandleCrowLeave(pSoldier);
  }

  if (guiCurrentScreen != AUTORESOLVE_SCREEN) {
    // remove character from squad list.. if they are on one
    RemoveCharacterFromSquads(pSoldier);

    // remove the soldier from the interface panel
    RemovePlayerFromTeamSlotGivenMercID(pSoldier.value.ubID);

    // Check if a guy exists here
    // Does another soldier exist here?
    if (pSoldier.value.bActive) {
      RemoveSoldierFromGridNo(pSoldier);

      // Delete shadow of crow....
      if (pSoldier.value.pAniTile != NULL) {
        DeleteAniTile(pSoldier.value.pAniTile);
        pSoldier.value.pAniTile = NULL;
      }

      if (!(pSoldier.value.uiStatusFlags & SOLDIER_OFF_MAP)) {
        // Decrement men in sector number!
        RemoveManFromTeam(pSoldier.value.bTeam);
      } // people specified off-map have already been removed from their team count

      pSoldier.value.bActive = FALSE;

      // Delete!
      DeleteSoldier(pSoldier);
    }
  } else {
    if (gfPersistantPBI) {
      DeleteSoldier(pSoldier);
    }
    MemFree(pSoldier);
  }

  return TRUE;
}

function TacticalRemoveSoldier(usSoldierIndex: UINT16): BOOLEAN {
  return InternalTacticalRemoveSoldier(usSoldierIndex, TRUE);
}

// returns a soldier difficulty modifier from 0 to 100 based on player's progress, distance from the Palace, mining income, and
// playing difficulty level.  Used for generating soldier stats, equipment, and AI skill level.
function CalcDifficultyModifier(ubSoldierClass: UINT8): INT8 {
  let bDiffModifier: INT8 = 0;
  let ubProgress: UINT8;
  let ubProgressModifier: UINT8;

  if (gfEditMode) {
    // return an average rating for editor purposes
    return 50;
  }

  // THESE 3 DIFFICULTY FACTORS MUST ALWAYS ADD UP TO 100% EXACTLY!!!
  Assert((DIFF_FACTOR_PLAYER_PROGRESS + DIFF_FACTOR_PALACE_DISTANCE + DIFF_FACTOR_GAME_DIFFICULTY) == 100);

  // adjust for game difficulty level
  switch (gGameOptions.ubDifficultyLevel) {
    case DIF_LEVEL_EASY:
      // very strong militia, very weak enemies/cratures/bloodcats
      if (SOLDIER_CLASS_MILITIA(ubSoldierClass)) {
        // +20
        bDiffModifier += DIFF_FACTOR_GAME_DIFFICULTY;
      }
      break;

    case DIF_LEVEL_MEDIUM:
      // equally strong militia, enemies, creatures, bloodcats (+10)
      bDiffModifier += (DIFF_FACTOR_GAME_DIFFICULTY / 2);
      break;

    case DIF_LEVEL_HARD:
      // equally stronger militia/enemies/creatures/bloodcats (+20)
      bDiffModifier += DIFF_FACTOR_GAME_DIFFICULTY;
      break;
  }

  // the progress returned ranges from 0 to 100
  ubProgress = HighestPlayerProgressPercentage();

  // bump it a bit once we've accomplished something (killed some enemies or taken an important sector)
  if (ubProgress > 0) {
    // +5
    bDiffModifier += DIFF_MODIFIER_SOME_PROGRESS;
  }

  // drop it down a bit if we still don't have any mine income
  if (PredictIncomeFromPlayerMines() == 0) {
    // -5
    bDiffModifier += DIFF_MODIFIER_NO_INCOME;
  }

  // adjust for progress level (0 to +50)
  ubProgressModifier = (ubProgress * DIFF_FACTOR_PLAYER_PROGRESS) / 100;
  bDiffModifier += ubProgressModifier;

  // adjust for map location
  bDiffModifier += GetLocationModifier(ubSoldierClass);

  // should be no way to go over 100, although it's possible to go below 0 when just starting on easy
  // Assert( bDiffModifier <= 100 );

  // limit the range of the combined factors to between 0 and 100
  bDiffModifier = __max(0, bDiffModifier);
  bDiffModifier = __min(100, bDiffModifier);

  // DON'T change this function without carefully considering the impact on GenerateRandomEquipment(),
  // CreateDetailedPlacementGivenBasicPlacementInfo(), and SoldierDifficultyLevel().

  return bDiffModifier;
}

// When the editor modifies the soldier's relative attribute level,
// this function is called to update that information.
// Used to generate a detailed placement from a basic placement.  This assumes that the detailed placement
// doesn't exist, meaning there are no static attributes.  This is called when you wish to convert a basic
// placement into a detailed placement just before creating a soldier.
function CreateDetailedPlacementGivenBasicPlacementInfo(pp: Pointer<SOLDIERCREATE_STRUCT>, bp: Pointer<BASIC_SOLDIERCREATE_STRUCT>): void {
  let bBaseAttribute: INT8;
  let ubSoldierClass: UINT8;
  let ubDiffFactor: UINT8;
  let bExpLevelModifier: INT8;
  let bStatsModifier: INT8;
  let ubStatsLevel: UINT8;

  if (!pp || !bp)
    return;
  pp.value.fStatic = FALSE;
  pp.value.ubProfile = NO_PROFILE;
  pp.value.sInsertionGridNo = bp.value.usStartingGridNo;
  pp.value.fPlayerMerc = FALSE;
  pp.value.fPlayerPlan = FALSE;
  pp.value.fCopyProfileItemsOver = FALSE;
  pp.value.bTeam = bp.value.bTeam;
  pp.value.ubSoldierClass = bp.value.ubSoldierClass;
  pp.value.ubCivilianGroup = bp.value.ubCivilianGroup;
  pp.value.ubScheduleID = 0;
  pp.value.sSectorX = gWorldSectorX;
  pp.value.sSectorY = gWorldSectorY;
  pp.value.bSectorZ = gbWorldSectorZ;
  pp.value.fHasKeys = bp.value.fHasKeys;

  // Choose a body type randomly if none specified.
  if (bp.value.bBodyType < 0) {
    switch (bp.value.bTeam) {
      case OUR_TEAM:
      case ENEMY_TEAM:
      case MILITIA_TEAM:
        switch (Random(4)) {
          case 0:
            pp.value.bBodyType = REGMALE;
            break;
          case 1:
            pp.value.bBodyType = BIGMALE;
            break;
          case 2:
            pp.value.bBodyType = STOCKYMALE;
            break;
          case 3:
            pp.value.bBodyType = REGFEMALE;
            break;
        }
        break;
      case CIV_TEAM:
        if (pp.value.ubSoldierClass == SOLDIER_CLASS_MINER) {
          switch (Random(3)) {
            // only strong and fit men can be miners.
            case 0:
              pp.value.bBodyType = REGMALE;
              break;
            case 1:
              pp.value.bBodyType = BIGMALE;
              break;
            case 2:
              pp.value.bBodyType = MANCIV;
              break;
          }
        } else {
          let iRandom: INT32;
          iRandom = Random(100);
          if (iRandom < 8) {
            // 8% chance FATCIV
            pp.value.bBodyType = FATCIV;
          } else if (iRandom < 38) {
            // 30% chance MANCIV
            pp.value.bBodyType = MANCIV;
          } else if (iRandom < 57) {
            // 19% chance MINICIV
            pp.value.bBodyType = MINICIV;
          } else if (iRandom < 76) {
            // 19% chance DRESSCIV
            pp.value.bBodyType = DRESSCIV;
          } else if (iRandom < 88) {
            // 12% chance HATKIDCIV
            pp.value.bBodyType = HATKIDCIV;
          } else {
            // 12% chance KIDCIV
            pp.value.bBodyType = KIDCIV;
          }
        }
        break;
    }
  } else {
    pp.value.bBodyType = bp.value.bBodyType;
  }

  // Pass over mandatory information specified from the basic placement
  pp.value.bOrders = bp.value.bOrders;
  pp.value.bAttitude = bp.value.bAttitude;
  pp.value.bDirection = bp.value.bDirection;

  // determine this soldier's soldier class
  if (bp.value.bTeam == CREATURE_TEAM) {
    ubSoldierClass = SOLDIER_CLASS_CREATURE;
  } else {
    ubSoldierClass = bp.value.ubSoldierClass;
  }

  ubDiffFactor = CalcDifficultyModifier(ubSoldierClass);

  // experience level is modified by game difficulty, player's progress, & proximity to Queen's Palace, etc.
  // This formula gives the following results:
  //	DIFFICULTY FACTOR			EXP. LEVEL  MODIFIER		LEVEL OF AVG REGULAR TROOP
  //			   0 to 19									-2													2
  //			  20 to 39									-1													3
  //			  41 to 59									-0													4
  //				60 to 79									+1													5
  //				80 to 99									+2													6
  //				  100											+3													7		(can happen in P3 Meduna itself on HARD only!)
  bExpLevelModifier = (ubDiffFactor / 20) - 2;

  // if in the upper half of this difficulty rating (10-19, 30-39, 50-59, 70-79, and 90-99)
  if ((ubDiffFactor % 20) >= 10) {
    // increase stats only by one level's worth
    bStatsModifier = +1;
  } else {
    // normal stats for this level
    bStatsModifier = 0;
  }

  // Adjust level and statistics for Linda's prespecified relative attribute level
  switch (bp.value.bRelativeAttributeLevel) {
    // NOTE: bStatsModifier already includes the bExpLevelModifier since it's based on the level itself!
    case 0:
      bExpLevelModifier += -1;
      bStatsModifier += -1;
      break;
    case 1:
      bExpLevelModifier += -1;
      bStatsModifier += 0;
      break;
    case 2:
      bExpLevelModifier += 0;
      bStatsModifier += 0;
      break;
    case 3:
      bExpLevelModifier += +1;
      bStatsModifier += 0;
      break;
    case 4:
      bExpLevelModifier += +1;
      bStatsModifier += +1;
      break;

    default:
      AssertMsg(FALSE, String("Invalid bRelativeAttributeLevel = %d", bp.value.bRelativeAttributeLevel));
      break;
  }

  // Set the experience level based on the soldier class and exp level modifier or relative attribute level
  switch (ubSoldierClass) {
    case SOLDIER_CLASS_ADMINISTRATOR:
      pp.value.bExpLevel = 2 + bExpLevelModifier;
      break;
    case SOLDIER_CLASS_ARMY:
      pp.value.bExpLevel = 4 + bExpLevelModifier;
      break;
    case SOLDIER_CLASS_ELITE:
      pp.value.bExpLevel = 6 + bExpLevelModifier;
      break;
    case SOLDIER_CLASS_GREEN_MILITIA:
      pp.value.bExpLevel = 2 + bExpLevelModifier;
      break;
    case SOLDIER_CLASS_REG_MILITIA:
      pp.value.bExpLevel = 4 + bExpLevelModifier;
      break;
    case SOLDIER_CLASS_ELITE_MILITIA:
      pp.value.bExpLevel = 6 + bExpLevelModifier;
      break;
    case SOLDIER_CLASS_MINER:
      pp.value.bExpLevel = bp.value.bRelativeAttributeLevel; // avg 2 (1-4)
      break;

    case SOLDIER_CLASS_CREATURE:
      switch (bp.value.bBodyType) {
        case LARVAE_MONSTER:
          pp.value.bExpLevel = 1 + bExpLevelModifier;
          break;
        case INFANT_MONSTER:
          pp.value.bExpLevel = 2 + bExpLevelModifier;
          break;
        case YAF_MONSTER:
        case YAM_MONSTER:
          pp.value.bExpLevel = (3 + Random(2) + bExpLevelModifier); // 3-4
          break;
        case ADULTFEMALEMONSTER:
        case AM_MONSTER:
          pp.value.bExpLevel = (5 + Random(2) + bExpLevelModifier); // 5-6
          break;
        case QUEENMONSTER:
          pp.value.bExpLevel = 7 + bExpLevelModifier;
          break;

        case BLOODCAT:
          pp.value.bExpLevel = 5 + bExpLevelModifier;
          if (SECTOR(gWorldSectorX, gWorldSectorY) == SEC_I16) {
            pp.value.bExpLevel += gGameOptions.ubDifficultyLevel;
          }
          break;
      }
      break;

    default:
      pp.value.bExpLevel = bp.value.bRelativeAttributeLevel; // avg 2 (1-4)
      ubSoldierClass = SOLDIER_CLASS_NONE;
      break;
  }

  pp.value.bExpLevel = max(1, pp.value.bExpLevel); // minimum exp. level of 1
  pp.value.bExpLevel = min(9, pp.value.bExpLevel); // maximum exp. level of 9

  ubStatsLevel = pp.value.bExpLevel + bStatsModifier;
  ubStatsLevel = max(0, ubStatsLevel); // minimum stats level of 0
  ubStatsLevel = min(9, ubStatsLevel); // maximum stats level of 9

  // Set the minimum base attribute
  bBaseAttribute = 49 + (4 * ubStatsLevel);

  // Roll soldier's statistics and skills
  // Stat range is currently 49-99, bell-curved around a range of 16 values dependent on the stats level
  pp.value.bLifeMax = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bLife = pp.value.bLifeMax;
  pp.value.bAgility = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bDexterity = (bBaseAttribute + Random(9) + Random(8));

  pp.value.bMarksmanship = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bMedical = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bMechanical = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bExplosive = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bLeadership = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bStrength = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bWisdom = (bBaseAttribute + Random(9) + Random(8));
  pp.value.bMorale = (bBaseAttribute + Random(9) + Random(8));

  // CJC: now calculate the REAL experience level if in the really upper end
  ReduceHighExpLevels(&(pp.value.bExpLevel));

  pp.value.fVisible = 0;

  pp.value.fOnRoof = bp.value.fOnRoof;

  pp.value.ubSoldierClass = ubSoldierClass;

  // Transfer over the patrol points.
  pp.value.bPatrolCnt = bp.value.bPatrolCnt;
  memcpy(pp.value.sPatrolGrid, bp.value.sPatrolGrid, sizeof(INT16) * MAXPATROLGRIDS);

  // If it is a detailed placement, don't do this yet, as detailed placements may have their
  // own equipment.
  if (!bp.value.fDetailedPlacement && ubSoldierClass != SOLDIER_CLASS_NONE && ubSoldierClass != SOLDIER_CLASS_CREATURE && ubSoldierClass != SOLDIER_CLASS_MINER)
    GenerateRandomEquipment(pp, ubSoldierClass, bp.value.bRelativeEquipmentLevel);
}

// Used exclusively by the editor when the user wishes to change a basic placement into a detailed placement.
// Because the intention is to make some of the attributes static, all of the information that can be generated
// are defaulted to -1.  When an attribute is made to be static, that value in replaced by the new static value.
// This information is NOT compatible with TacticalCreateSoldier.  Before doing so, you must first convert the
// static detailed placement to a regular detailed placement.
function CreateStaticDetailedPlacementGivenBasicPlacementInfo(spp: Pointer<SOLDIERCREATE_STRUCT>, bp: Pointer<BASIC_SOLDIERCREATE_STRUCT>): void {
  let i: INT32;
  if (!spp || !bp)
    return;
  memset(spp, 0, sizeof(SOLDIERCREATE_STRUCT));
  spp.value.fStatic = TRUE;
  spp.value.ubProfile = NO_PROFILE;
  spp.value.sInsertionGridNo = bp.value.usStartingGridNo;
  spp.value.fPlayerMerc = FALSE;
  spp.value.fPlayerPlan = FALSE;
  spp.value.fCopyProfileItemsOver = FALSE;
  spp.value.bTeam = bp.value.bTeam;
  spp.value.ubSoldierClass = bp.value.ubSoldierClass;
  spp.value.ubCivilianGroup = bp.value.ubCivilianGroup;
  spp.value.ubScheduleID = 0;
  spp.value.sSectorX = gWorldSectorX;
  spp.value.sSectorY = gWorldSectorY;
  spp.value.bSectorZ = gbWorldSectorZ;
  spp.value.fHasKeys = bp.value.fHasKeys;

  // Pass over mandatory information specified from the basic placement
  spp.value.bOrders = bp.value.bOrders;
  spp.value.bAttitude = bp.value.bAttitude;
  spp.value.bDirection = bp.value.bDirection;

  // Only creatures have mandatory body types specified.
  if (spp.value.bTeam == CREATURE_TEAM)
    spp.value.bBodyType = bp.value.bBodyType;
  else
    spp.value.bBodyType = -1;

  // Set up all possible static values.
  // By setting them all to -1, that signifies that the attribute isn't static.
  // The static placement needs to be later *regenerated* in order to create a valid soldier.
  spp.value.bExpLevel = -1;
  spp.value.bLifeMax = -1;
  spp.value.bLife = -1;
  spp.value.bAgility = -1;
  spp.value.bDexterity = -1;
  spp.value.bMarksmanship = -1;
  spp.value.bMedical = -1;
  spp.value.bMechanical = -1;
  spp.value.bExplosive = -1;
  spp.value.bLeadership = -1;
  spp.value.bStrength = -1;
  spp.value.bWisdom = -1;
  spp.value.bMorale = -1;

  spp.value.fVisible = 0;

  spp.value.fOnRoof = bp.value.fOnRoof;

  // Transfer over the patrol points.
  spp.value.bPatrolCnt = bp.value.bPatrolCnt;
  memcpy(spp.value.sPatrolGrid, bp.value.sPatrolGrid, sizeof(INT16) * MAXPATROLGRIDS);

  // Starts with nothing
  for (i = 0; i < NUM_INV_SLOTS; i++) {
    memset(&(spp.value.Inv[i]), 0, sizeof(OBJECTTYPE));
    spp.value.Inv[i].usItem = NOTHING;
    spp.value.Inv[i].fFlags |= OBJECT_UNDROPPABLE;
  }
}

// When you are ready to generate a soldier with a static detailed placement slot, this function will generate
// the proper detailed placement slot given the static detailed placement and it's accompanying basic placement.
// For the purposes of merc editing, the static detailed placement is preserved.
function CreateDetailedPlacementGivenStaticDetailedPlacementAndBasicPlacementInfo(pp: Pointer<SOLDIERCREATE_STRUCT>, spp: Pointer<SOLDIERCREATE_STRUCT>, bp: Pointer<BASIC_SOLDIERCREATE_STRUCT>): void {
  let i: INT32;

  memset(pp, 0, sizeof(SOLDIERCREATE_STRUCT));
  pp.value.fOnRoof = spp.value.fOnRoof = bp.value.fOnRoof;
  pp.value.fStatic = FALSE;
  pp.value.ubSoldierClass = bp.value.ubSoldierClass;
  // Generate the new placement
  pp.value.ubProfile = spp.value.ubProfile;
  if (pp.value.ubProfile != NO_PROFILE) {
    // Copy over team
    pp.value.bTeam = bp.value.bTeam;

    pp.value.bDirection = bp.value.bDirection;
    pp.value.sInsertionGridNo = bp.value.usStartingGridNo;

    // ATE: Copy over sector coordinates from profile to create struct
    pp.value.sSectorX = gMercProfiles[pp.value.ubProfile].sSectorX;
    pp.value.sSectorY = gMercProfiles[pp.value.ubProfile].sSectorY;
    pp.value.bSectorZ = gMercProfiles[pp.value.ubProfile].bSectorZ;

    pp.value.ubScheduleID = spp.value.ubScheduleID;

    pp.value.bOrders = bp.value.bOrders;
    pp.value.bAttitude = bp.value.bAttitude;
    pp.value.bDirection = bp.value.bDirection;
    pp.value.bPatrolCnt = bp.value.bPatrolCnt;
    memcpy(pp.value.sPatrolGrid, bp.value.sPatrolGrid, sizeof(INT16) * MAXPATROLGRIDS);
    pp.value.fHasKeys = bp.value.fHasKeys;
    pp.value.ubCivilianGroup = bp.value.ubCivilianGroup;

    return; // done
  }
  CreateDetailedPlacementGivenBasicPlacementInfo(pp, bp);
  pp.value.ubScheduleID = spp.value.ubScheduleID;
  // Replace any of the new placement's attributes with static attributes.
  if (spp.value.bExpLevel != -1)
    pp.value.bExpLevel = spp.value.bExpLevel;
  if (spp.value.bLife != -1)
    pp.value.bLife = spp.value.bLife;
  if (spp.value.bLifeMax != -1)
    pp.value.bLifeMax = spp.value.bLifeMax;
  if (spp.value.bMarksmanship != -1)
    pp.value.bMarksmanship = spp.value.bMarksmanship;
  if (spp.value.bStrength != -1)
    pp.value.bStrength = spp.value.bStrength;
  if (spp.value.bAgility != -1)
    pp.value.bAgility = spp.value.bAgility;
  if (spp.value.bDexterity != -1)
    pp.value.bDexterity = spp.value.bDexterity;
  if (spp.value.bWisdom != -1)
    pp.value.bWisdom = spp.value.bWisdom;
  if (spp.value.bLeadership != -1)
    pp.value.bLeadership = spp.value.bLeadership;
  if (spp.value.bExplosive != -1)
    pp.value.bExplosive = spp.value.bExplosive;
  if (spp.value.bMedical != -1)
    pp.value.bMedical = spp.value.bMedical;
  if (spp.value.bMechanical != -1)
    pp.value.bMechanical = spp.value.bMechanical;
  if (spp.value.bMorale != -1)
    pp.value.bMorale = spp.value.bMorale;

  pp.value.fVisible = spp.value.fVisible;
  if (spp.value.fVisible) {
    sprintf(pp.value.HeadPal, spp.value.HeadPal);
    sprintf(pp.value.PantsPal, spp.value.PantsPal);
    sprintf(pp.value.VestPal, spp.value.VestPal);
    sprintf(pp.value.SkinPal, spp.value.SkinPal);
  }

  // This isn't perfect, however, it blindly brings over the items from the static
  // detailed placement.  Due to the order of things, other items would
  for (i = 0; i < NUM_INV_SLOTS; i++) {
    // copy over static items and empty slots that are droppable (signifies a forced empty slot)
    if (spp.value.Inv[i].fFlags & OBJECT_NO_OVERWRITE) {
      memcpy(&pp.value.Inv[i], &spp.value.Inv[i], sizeof(OBJECTTYPE));
      // memcpy( pp->Inv, spp->Inv, sizeof( OBJECTTYPE ) * NUM_INV_SLOTS );
      // return;
    }
  }
  if (!gGameOptions.fGunNut) {
    ReplaceExtendedGuns(pp, bp.value.ubSoldierClass);
  }
  if (bp.value.ubSoldierClass != SOLDIER_CLASS_NONE && bp.value.ubSoldierClass != SOLDIER_CLASS_CREATURE && bp.value.ubSoldierClass != SOLDIER_CLASS_MINER) {
    GenerateRandomEquipment(pp, bp.value.ubSoldierClass, bp.value.bRelativeEquipmentLevel);
  }
}

// Used to update a existing soldier's attributes with the new static detailed placement info.  This is used
// by the editor upon exiting the editor into the game, to update the existing soldiers with new information.
// This gives flexibility of testing mercs.  Upon entering the editor again, this call will reset all the
// mercs to their original states.
function UpdateSoldierWithStaticDetailedInformation(s: Pointer<SOLDIERTYPE>, spp: Pointer<SOLDIERCREATE_STRUCT>): void {
  // First, check to see if the soldier has a profile.  If so, then it'll extract the information
  // and update the soldier with the profile information instead.  This has complete override
  // authority.
  if (spp.value.ubProfile != NO_PROFILE) {
    TacticalCopySoldierFromProfile(s, spp);
    UpdateStaticDetailedPlacementWithProfileInformation(spp, spp.value.ubProfile);
    SetSoldierAnimationSurface(s, s.value.usAnimState);
    CreateSoldierPalettes(s);
    return;
  }

  switch (spp.value.ubSoldierClass) {
    // If the soldier is an administrator, then
    case SOLDIER_CLASS_ADMINISTRATOR:
    case SOLDIER_CLASS_ARMY:
    case SOLDIER_CLASS_ELITE:
      GeneratePaletteForSoldier(s, spp.value.ubSoldierClass);
      break;
  }

  if (spp.value.bExpLevel != -1) {
    // We have a static experience level, so generate all of the soldier's attributes.
    let bBaseAttribute: INT8;
    s.value.bExpLevel = spp.value.bExpLevel;
    // Set the minimum base attribute
    bBaseAttribute = 49 + (4 * s.value.bExpLevel);

    // Roll enemy's combat statistics, taking bExpLevel into account.
    // Stat range is currently 40-99, slightly bell-curved around the bExpLevel
    s.value.bLifeMax = (bBaseAttribute + Random(9) + Random(8));
    s.value.bLife = s.value.bLifeMax;
    s.value.bAgility = (bBaseAttribute + Random(9) + Random(8));
    s.value.bDexterity = (bBaseAttribute + Random(9) + Random(8));
    s.value.bMarksmanship = (bBaseAttribute + Random(9) + Random(8));
    s.value.bMedical = (bBaseAttribute + Random(9) + Random(8));
    s.value.bMechanical = (bBaseAttribute + Random(9) + Random(8));
    s.value.bExplosive = (bBaseAttribute + Random(9) + Random(8));
    s.value.bLeadership = (bBaseAttribute + Random(9) + Random(8));
    s.value.bStrength = (bBaseAttribute + Random(9) + Random(8));
    s.value.bWisdom = (bBaseAttribute + Random(9) + Random(8));
    s.value.bMorale = (bBaseAttribute + Random(9) + Random(8));
  }
  // Replace any soldier attributes with any static values in the detailed placement.
  if (spp.value.bLife != -1)
    s.value.bLife = spp.value.bLife;
  if (spp.value.bLifeMax != -1)
    s.value.bLifeMax = spp.value.bLifeMax;
  if (spp.value.bMarksmanship != -1)
    s.value.bMarksmanship = spp.value.bMarksmanship;
  if (spp.value.bStrength != -1)
    s.value.bStrength = spp.value.bStrength;
  if (spp.value.bAgility != -1)
    s.value.bAgility = spp.value.bAgility;
  if (spp.value.bDexterity != -1)
    s.value.bDexterity = spp.value.bDexterity;
  if (spp.value.bWisdom != -1)
    s.value.bWisdom = spp.value.bWisdom;
  if (spp.value.bLeadership != -1)
    s.value.bLeadership = spp.value.bLeadership;
  if (spp.value.bExplosive != -1)
    s.value.bExplosive = spp.value.bExplosive;
  if (spp.value.bMedical != -1)
    s.value.bMedical = spp.value.bMedical;
  if (spp.value.bMechanical != -1)
    s.value.bMechanical = spp.value.bMechanical;
  if (spp.value.bMorale != -1)
    s.value.bMorale = spp.value.bMorale;

  // life can't exceed the life max.
  if (s.value.bLife > s.value.bLifeMax)
    s.value.bLife = s.value.bLifeMax;

  s.value.ubScheduleID = spp.value.ubScheduleID;

  // Copy over the current inventory list.
  memcpy(s.value.inv, spp.value.Inv, sizeof(OBJECTTYPE) * NUM_INV_SLOTS);
}

// In the case of setting a profile ID in order to extract a soldier from the profile array, we
// also want to copy that information to the static detailed placement, for editor viewing purposes.
function UpdateStaticDetailedPlacementWithProfileInformation(spp: Pointer<SOLDIERCREATE_STRUCT>, ubProfile: UINT8): void {
  let cnt: UINT32;
  let pProfile: Pointer<MERCPROFILESTRUCT>;

  spp.value.ubProfile = ubProfile;

  pProfile = &(gMercProfiles[ubProfile]);

  SET_PALETTEREP_ID(spp.value.HeadPal, pProfile.value.HAIR);
  SET_PALETTEREP_ID(spp.value.VestPal, pProfile.value.VEST);
  SET_PALETTEREP_ID(spp.value.SkinPal, pProfile.value.SKIN);
  SET_PALETTEREP_ID(spp.value.PantsPal, pProfile.value.PANTS);

  wcscpy(spp.value.name, pProfile.value.zNickname);

  spp.value.bLife = pProfile.value.bLife;
  spp.value.bLifeMax = pProfile.value.bLifeMax;
  spp.value.bAgility = pProfile.value.bAgility;
  spp.value.bLeadership = pProfile.value.bLeadership;
  spp.value.bDexterity = pProfile.value.bDexterity;
  spp.value.bStrength = pProfile.value.bStrength;
  spp.value.bWisdom = pProfile.value.bWisdom;
  spp.value.bExpLevel = pProfile.value.bExpLevel;
  spp.value.bMarksmanship = pProfile.value.bMarksmanship;
  spp.value.bMedical = pProfile.value.bMedical;
  spp.value.bMechanical = pProfile.value.bMechanical;
  spp.value.bExplosive = pProfile.value.bExplosive;

  spp.value.bBodyType = pProfile.value.ubBodyType;

  // Copy over inv if we want to
  for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
    CreateItems(pProfile.value.inv[cnt], pProfile.value.bInvStatus[cnt], pProfile.value.bInvNumber[cnt], &(spp.value.Inv[cnt]));
  }
}

// When the editor modifies the soldier's relative attribute level,
// this function is called to update that information.
function ModifySoldierAttributesWithNewRelativeLevel(s: Pointer<SOLDIERTYPE>, bRelativeAttributeLevel: INT8): void {
  let bBaseAttribute: INT8;
  // Set the experience level based on the relative attribute level
  // NOTE OF WARNING: THIS CURRENTLY IGNORES THE ENEMY CLASS (ADMIN/REG/ELITE) FOR CALCULATING LEVEL & ATTRIBUTES

  // Rel level 0: Lvl 1, 1: Lvl 2-3, 2: Lvl 4-5, 3: Lvl 6-7, 4: Lvl 8-9
  s.value.bExpLevel = (2 * bRelativeAttributeLevel + Random(2));

  s.value.bExpLevel = max(1, s.value.bExpLevel); // minimum level of 1
  s.value.bExpLevel = min(9, s.value.bExpLevel); // maximum level of 9

  // Set the minimum base attribute
  bBaseAttribute = 49 + (4 * s.value.bExpLevel);

  // Roll enemy's combat statistics, taking bExpLevel into account.
  // Stat range is currently 40-99, slightly bell-curved around the bExpLevel
  s.value.bLifeMax = (bBaseAttribute + Random(9) + Random(8));
  s.value.bLife = s.value.bLifeMax;
  s.value.bAgility = (bBaseAttribute + Random(9) + Random(8));
  s.value.bDexterity = (bBaseAttribute + Random(9) + Random(8));
  s.value.bMarksmanship = (bBaseAttribute + Random(9) + Random(8));
  s.value.bMedical = (bBaseAttribute + Random(9) + Random(8));
  s.value.bMechanical = (bBaseAttribute + Random(9) + Random(8));
  s.value.bExplosive = (bBaseAttribute + Random(9) + Random(8));
  s.value.bLeadership = (bBaseAttribute + Random(9) + Random(8));
  s.value.bStrength = (bBaseAttribute + Random(9) + Random(8));
  s.value.bWisdom = (bBaseAttribute + Random(9) + Random(8));
  s.value.bMorale = (bBaseAttribute + Random(9) + Random(8));
}

function ForceSoldierProfileID(pSoldier: Pointer<SOLDIERTYPE>, ubProfileID: UINT8): void {
  let CreateStruct: SOLDIERCREATE_STRUCT;

  memset(&CreateStruct, 0, sizeof(CreateStruct));
  CreateStruct.ubProfile = ubProfileID;

  TacticalCopySoldierFromProfile(pSoldier, &CreateStruct);

  // Delete face and re-create
  DeleteSoldierFace(pSoldier);

  // Init face
  pSoldier.value.iFaceIndex = InitSoldierFace(pSoldier);

  // Update animation, palettes
  SetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  // Re-Create palettes
  CreateSoldierPalettes(pSoldier);
}

const CENTRAL_GRIDNO = 13202;
const CENTRAL_RADIUS = 30;

function ReserveTacticalSoldierForAutoresolve(ubSoldierClass: UINT8): Pointer<SOLDIERTYPE> {
  let i: INT32;
  let iStart: INT32;
  let iEnd: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  // This code looks for a soldier of specified type that currently exists in tactical and
  // returns the pointer to that soldier.  This is used when copying the exact status of
  // all remaining enemy troops (or creatures) to finish the battle in autoresolve.  To
  // signify that the troop has already been reserved, we simply set their gridno to NOWHERE.
  if (ubSoldierClass != SOLDIER_CLASS_CREATURE) {
    // use the enemy team
    iStart = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;
    iEnd = gTacticalStatus.Team[ENEMY_TEAM].bLastID;
  } else {
    // use the creature team
    iStart = gTacticalStatus.Team[CREATURE_TEAM].bFirstID;
    iEnd = gTacticalStatus.Team[CREATURE_TEAM].bLastID;
  }
  for (i = iStart; i <= iEnd; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bInSector && MercPtrs[i].value.bLife && MercPtrs[i].value.sGridNo != NOWHERE) {
      if (MercPtrs[i].value.ubSoldierClass == ubSoldierClass) {
        // reserve this soldier
        MercPtrs[i].value.sGridNo = NOWHERE;

        // Allocate and copy the soldier
        pSoldier = MemAlloc(sizeof(SOLDIERTYPE));
        if (!pSoldier)
          return NULL;
        memcpy(pSoldier, MercPtrs[i], sizeof(SOLDIERTYPE));

        // Assign a bogus ID, then return it
        pSoldier.value.ubID = 255;
        return pSoldier;
      }
    }
  }
  return NULL;
}

// USED BY STRATEGIC AI and AUTORESOLVE
function TacticalCreateAdministrator(): Pointer<SOLDIERTYPE> {
  let bp: BASIC_SOLDIERCREATE_STRUCT;
  let pp: SOLDIERCREATE_STRUCT;
  let ubID: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (guiCurrentScreen == AUTORESOLVE_SCREEN && !gfPersistantPBI) {
    return ReserveTacticalSoldierForAutoresolve(SOLDIER_CLASS_ADMINISTRATOR);
  }

  memset(&bp, 0, sizeof(BASIC_SOLDIERCREATE_STRUCT));
  memset(&pp, 0, sizeof(SOLDIERCREATE_STRUCT));
  RandomizeRelativeLevel(&(bp.bRelativeAttributeLevel), SOLDIER_CLASS_ADMINISTRATOR);
  RandomizeRelativeLevel(&(bp.bRelativeEquipmentLevel), SOLDIER_CLASS_ADMINISTRATOR);
  bp.bTeam = ENEMY_TEAM;
  bp.bOrders = SEEKENEMY;
  bp.bAttitude = Random(MAXATTITUDES);
  bp.bBodyType = -1;
  bp.ubSoldierClass = SOLDIER_CLASS_ADMINISTRATOR;
  CreateDetailedPlacementGivenBasicPlacementInfo(&pp, &bp);
  pSoldier = TacticalCreateSoldier(&pp, &ubID);
  if (pSoldier) {
    // send soldier to centre of map, roughly
    pSoldier.value.sNoiseGridno = (CENTRAL_GRIDNO + (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) + (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) * WORLD_COLS);
    pSoldier.value.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
  }
  return pSoldier;
}

// USED BY STRATEGIC AI and AUTORESOLVE
function TacticalCreateArmyTroop(): Pointer<SOLDIERTYPE> {
  let bp: BASIC_SOLDIERCREATE_STRUCT;
  let pp: SOLDIERCREATE_STRUCT;
  let ubID: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (guiCurrentScreen == AUTORESOLVE_SCREEN && !gfPersistantPBI) {
    return ReserveTacticalSoldierForAutoresolve(SOLDIER_CLASS_ARMY);
  }

  memset(&bp, 0, sizeof(BASIC_SOLDIERCREATE_STRUCT));
  memset(&pp, 0, sizeof(SOLDIERCREATE_STRUCT));
  RandomizeRelativeLevel(&(bp.bRelativeAttributeLevel), SOLDIER_CLASS_ARMY);
  RandomizeRelativeLevel(&(bp.bRelativeEquipmentLevel), SOLDIER_CLASS_ARMY);
  bp.bTeam = ENEMY_TEAM;
  bp.bOrders = SEEKENEMY;
  bp.bAttitude = Random(MAXATTITUDES);
  bp.bBodyType = -1;
  bp.ubSoldierClass = SOLDIER_CLASS_ARMY;
  CreateDetailedPlacementGivenBasicPlacementInfo(&pp, &bp);
  pSoldier = TacticalCreateSoldier(&pp, &ubID);
  if (pSoldier) {
    // send soldier to centre of map, roughly
    pSoldier.value.sNoiseGridno = (CENTRAL_GRIDNO + (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) + (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) * WORLD_COLS);
    pSoldier.value.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
  }
  return pSoldier;
}

// USED BY STRATEGIC AI and AUTORESOLVE
function TacticalCreateEliteEnemy(): Pointer<SOLDIERTYPE> {
  let bp: BASIC_SOLDIERCREATE_STRUCT;
  let pp: SOLDIERCREATE_STRUCT;
  let ubID: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (guiCurrentScreen == AUTORESOLVE_SCREEN && !gfPersistantPBI) {
    return ReserveTacticalSoldierForAutoresolve(SOLDIER_CLASS_ELITE);
  }

  memset(&bp, 0, sizeof(BASIC_SOLDIERCREATE_STRUCT));
  memset(&pp, 0, sizeof(SOLDIERCREATE_STRUCT));

  RandomizeRelativeLevel(&(bp.bRelativeAttributeLevel), SOLDIER_CLASS_ELITE);
  RandomizeRelativeLevel(&(bp.bRelativeEquipmentLevel), SOLDIER_CLASS_ELITE);
  bp.bTeam = ENEMY_TEAM;
  bp.bOrders = SEEKENEMY;
  bp.bAttitude = Random(MAXATTITUDES);
  bp.bBodyType = -1;
  bp.ubSoldierClass = SOLDIER_CLASS_ELITE;
  CreateDetailedPlacementGivenBasicPlacementInfo(&pp, &bp);

  // SPECIAL!  Certain events in the game can cause profiled NPCs to become enemies.  The two cases are
  // adding Mike and Iggy.  We will only add one NPC in any given combat and the conditions for setting
  // the associated facts are done elsewhere.  There is also another place where NPCs can get added, which
  // is in AddPlacementToWorld() used for inserting defensive enemies.
  // NOTE:  We don't want to add Mike or Iggy if this is being called from autoresolve!
  OkayToUpgradeEliteToSpecialProfiledEnemy(&pp);

  pSoldier = TacticalCreateSoldier(&pp, &ubID);
  if (pSoldier) {
    // send soldier to centre of map, roughly
    pSoldier.value.sNoiseGridno = (CENTRAL_GRIDNO + (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) + (Random(CENTRAL_RADIUS * 2 + 1) - CENTRAL_RADIUS) * WORLD_COLS);
    pSoldier.value.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
  }
  return pSoldier;
}

function TacticalCreateMilitia(ubMilitiaClass: UINT8): Pointer<SOLDIERTYPE> {
  let bp: BASIC_SOLDIERCREATE_STRUCT;
  let pp: SOLDIERCREATE_STRUCT;
  let ubID: UINT8;

  memset(&bp, 0, sizeof(BASIC_SOLDIERCREATE_STRUCT));
  memset(&pp, 0, sizeof(SOLDIERCREATE_STRUCT));
  RandomizeRelativeLevel(&(bp.bRelativeAttributeLevel), ubMilitiaClass);
  RandomizeRelativeLevel(&(bp.bRelativeEquipmentLevel), ubMilitiaClass);
  bp.bTeam = MILITIA_TEAM;
  bp.ubSoldierClass = ubMilitiaClass;
  bp.bOrders = STATIONARY;
  bp.bAttitude = Random(MAXATTITUDES);
  // bp.bAttitude = AGGRESSIVE;
  bp.bBodyType = -1;
  CreateDetailedPlacementGivenBasicPlacementInfo(&pp, &bp);
  return TacticalCreateSoldier(&pp, &ubID);
}

function TacticalCreateCreature(bCreatureBodyType: INT8): Pointer<SOLDIERTYPE> {
  let bp: BASIC_SOLDIERCREATE_STRUCT;
  let pp: SOLDIERCREATE_STRUCT;
  let ubID: UINT8;

  if (guiCurrentScreen == AUTORESOLVE_SCREEN && !gfPersistantPBI) {
    return ReserveTacticalSoldierForAutoresolve(SOLDIER_CLASS_CREATURE);
  }

  memset(&bp, 0, sizeof(BASIC_SOLDIERCREATE_STRUCT));
  memset(&pp, 0, sizeof(SOLDIERCREATE_STRUCT));
  RandomizeRelativeLevel(&(bp.bRelativeAttributeLevel), SOLDIER_CLASS_CREATURE);
  RandomizeRelativeLevel(&(bp.bRelativeEquipmentLevel), SOLDIER_CLASS_CREATURE);
  bp.bTeam = CREATURE_TEAM;
  bp.ubSoldierClass = SOLDIER_CLASS_CREATURE;
  bp.bOrders = SEEKENEMY;
  bp.bAttitude = AGGRESSIVE;
  bp.bBodyType = bCreatureBodyType;
  CreateDetailedPlacementGivenBasicPlacementInfo(&pp, &bp);
  return TacticalCreateSoldier(&pp, &ubID);
}

function RandomizeRelativeLevel(pbRelLevel: Pointer<INT8>, ubSoldierClass: UINT8): void {
  let ubLocationModifier: UINT8;
  let bRollModifier: INT8;
  let bRoll: INT8;
  let bAdjustedRoll: INT8;

  // We now adjust the relative level by location on the map, so enemies in NE corner will be generally very crappy (lots
  // of bad and poor, with avg about best), while enemies in the SW will have lots of great and good, with avg about as
  // lousy as it gets.  Militia are generally unmodified by distance, and never get bad or great at all.

  // this returns 0 to DIFF_FACTOR_PALACE_DISTANCE (0 to +30)
  ubLocationModifier = GetLocationModifier(ubSoldierClass);

  // convert to 0 to 10 (divide by 3), the subtract 5 to get a range of -5 to +5
  bRollModifier = (ubLocationModifier / (DIFF_FACTOR_PALACE_DISTANCE / 10)) - 5;

  // roll a number from 0 to 9
  bRoll = Random(10);

  // adjust by the modifier (giving -5 to +14)
  bAdjustedRoll = bRoll + bRollModifier;

  if (SOLDIER_CLASS_MILITIA(ubSoldierClass)) {
    // Militia never get to roll bad/great results at all (to avoid great equipment drops from them if killed)
    bAdjustedRoll = __max(1, bAdjustedRoll);
    bAdjustedRoll = __min(8, bAdjustedRoll);
    if (IsAutoResolveActive()) {
      // Artificially strengthen militia strength for sake of gameplay
      bAdjustedRoll++;
    }
  } else {
    // max-min this to a range of 0-9
    bAdjustedRoll = __max(0, bAdjustedRoll);
    bAdjustedRoll = __min(9, bAdjustedRoll);
    if (IsAutoResolveActive()) {
      // Artificially weaken enemy/creature strength for sake of gameplay
      if (bAdjustedRoll > 0) {
        bAdjustedRoll--;
      }
    }
  }

  switch (bAdjustedRoll) {
    case 0:
      // bad
      *pbRelLevel = 0;
      break;
    case 1:
    case 2:
      // poor
      *pbRelLevel = 1;
      break;
    case 3:
    case 4:
    case 5:
    case 6:
      // average
      *pbRelLevel = 2;
      break;
    case 7:
    case 8:
      // good
      *pbRelLevel = 3;
      break;
    case 9:
      // great
      *pbRelLevel = 4;
      break;

    default:
      Assert(FALSE);
      *pbRelLevel = 2;
      break;
  }

  /*
          if( IsAutoResolveActive() )
          { //Artificially strengthen militia strength for sake of gameplay
                  if ( SOLDIER_CLASS_MILITIA( ubSoldierClass ) )
                  {
                          *pbRelLevel = 4;
                  }
                  else
                  {
                          *pbRelLevel = 0;
                  }
          }
  */
}

// This function shouldn't be called outside of tactical
function QuickCreateProfileMerc(bTeam: INT8, ubProfileID: UINT8): void {
  // Create guy # X
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let sGridX: INT16;
  let sGridY: INT16;
  let ubID: UINT8;
  let usMapPos: UINT16;

  if (GetMouseXY(&sGridX, &sGridY)) {
    usMapPos = MAPROWCOLTOPOS(sGridY, sGridX);
    // Get Grid Coordinates of mouse
    if (GetMouseWorldCoordsInCenter(&sWorldX, &sWorldY)) {
      GetCurrentWorldSector(&sSectorX, &sSectorY);

      memset(&MercCreateStruct, 0, sizeof(MercCreateStruct));
      MercCreateStruct.bTeam = bTeam;
      MercCreateStruct.ubProfile = ubProfileID;
      MercCreateStruct.sSectorX = sSectorX;
      MercCreateStruct.sSectorY = sSectorY;
      MercCreateStruct.bSectorZ = gbWorldSectorZ;
      MercCreateStruct.sInsertionGridNo = usMapPos;

      RandomizeNewSoldierStats(&MercCreateStruct);

      if (TacticalCreateSoldier(&MercCreateStruct, &ubID)) {
        AddSoldierToSector(ubID);

        // So we can see them!
        AllTeamsLookForAll(NO_INTERRUPTS);
      }
    }
  }
}

function CopyProfileItems(pSoldier: Pointer<SOLDIERTYPE>, pCreateStruct: Pointer<SOLDIERCREATE_STRUCT>): void {
  let cnt: UINT32;
  let cnt2: UINT32;
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let Obj: OBJECTTYPE;
  let uiMoneyLeft: UINT32;
  let uiMoneyLimitInSlot: UINT32;
  let bSlot: INT8;

  pProfile = &(gMercProfiles[pCreateStruct.value.ubProfile]);

  // Copy over inv if we want to
  if (pCreateStruct.value.fCopyProfileItemsOver || pSoldier.value.bTeam != OUR_TEAM) {
    if (pCreateStruct.value.fPlayerMerc) {
      // do some special coding to put stuff in the profile in better-looking
      // spots
      memset(pSoldier.value.inv, 0, NUM_INV_SLOTS * sizeof(OBJECTTYPE));
      for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
        if (pProfile.value.inv[cnt] != NOTHING) {
          CreateItems(pProfile.value.inv[cnt], pProfile.value.bInvStatus[cnt], pProfile.value.bInvNumber[cnt], &Obj);
          if (Item[Obj.usItem].fFlags & ITEM_ATTACHMENT) {
            // try to find the appropriate item to attach to!
            for (cnt2 = 0; cnt2 < NUM_INV_SLOTS; cnt2++) {
              if (pSoldier.value.inv[cnt2].usItem != NOTHING && ValidAttachment(Obj.usItem, pSoldier.value.inv[cnt2].usItem)) {
                AttachObject(NULL, &(pSoldier.value.inv[cnt2]), &Obj);
                break;
              }
            }
            if (cnt2 == NUM_INV_SLOTS) {
              // oh well, couldn't find anything to attach to!
              AutoPlaceObject(pSoldier, &Obj, FALSE);
            }
          } else {
            AutoPlaceObject(pSoldier, &Obj, FALSE);
          }
        }
      }
      pProfile.value.usOptionalGearCost = 0;
    } else {
      for (cnt = 0; cnt < NUM_INV_SLOTS; cnt++) {
        if (pProfile.value.inv[cnt] != NOTHING) {
          if (Item[pProfile.value.inv[cnt]].usItemClass == IC_KEY) {
            // since keys depend on 2 values, they pretty much have to be hardcoded.
            // and if a case isn't handled here it's better to not give any key than
            // to provide one which doesn't work and would confuse everything.
            switch (pCreateStruct.value.ubProfile) {
              case BREWSTER:
                if (pProfile.value.inv[cnt] >= KEY_1 && pProfile.value.inv[cnt] <= KEY_32) {
                  CreateKeyObject(&(pSoldier.value.inv[cnt]), pProfile.value.bInvNumber[cnt], 19);
                } else {
                  memset(&(pSoldier.value.inv[cnt]), 0, sizeof(OBJECTTYPE));
                }
                break;
              case SKIPPER:
                if (pProfile.value.inv[cnt] >= KEY_1 && pProfile.value.inv[cnt] <= KEY_32) {
                  CreateKeyObject(&(pSoldier.value.inv[cnt]), pProfile.value.bInvNumber[cnt], 11);
                } else {
                  memset(&(pSoldier.value.inv[cnt]), 0, sizeof(OBJECTTYPE));
                }
                break;
              case DOREEN:
                if (pProfile.value.inv[cnt] >= KEY_1 && pProfile.value.inv[cnt] <= KEY_32) {
                  CreateKeyObject(&(pSoldier.value.inv[cnt]), pProfile.value.bInvNumber[cnt], 32);
                } else {
                  memset(&(pSoldier.value.inv[cnt]), 0, sizeof(OBJECTTYPE));
                }
                break;
              default:
                memset(&(pSoldier.value.inv[cnt]), 0, sizeof(OBJECTTYPE));
                break;
            }
          } else {
            CreateItems(pProfile.value.inv[cnt], pProfile.value.bInvStatus[cnt], pProfile.value.bInvNumber[cnt], &(pSoldier.value.inv[cnt]));
          }
          if (pProfile.value.inv[cnt] == ROCKET_RIFLE || pProfile.value.inv[cnt] == AUTO_ROCKET_RIFLE) {
            pSoldier.value.inv[cnt].ubImprintID = pSoldier.value.ubProfile;
          }
          if (gubItemDroppableFlag[cnt]) {
            if (pProfile.value.ubInvUndroppable & gubItemDroppableFlag[cnt]) {
              pSoldier.value.inv[cnt].fFlags |= OBJECT_UNDROPPABLE;
            }
          }
        } else {
          memset(&(pSoldier.value.inv[cnt]), 0, sizeof(OBJECTTYPE));
        }
      }
      if (pProfile.value.uiMoney > 0) {
        uiMoneyLeft = pProfile.value.uiMoney;
        bSlot = FindEmptySlotWithin(pSoldier, BIGPOCK1POS, SMALLPOCK8POS);

        // add in increments of
        while (bSlot != NO_SLOT) {
          uiMoneyLimitInSlot = MAX_MONEY_PER_SLOT;
          if (bSlot >= SMALLPOCK1POS) {
            uiMoneyLimitInSlot /= 2;
          }

          CreateItem(MONEY, 100, &(pSoldier.value.inv[bSlot]));
          if (uiMoneyLeft > uiMoneyLimitInSlot) {
            // fill pocket with money
            pSoldier.value.inv[bSlot].uiMoneyAmount = uiMoneyLimitInSlot;
            uiMoneyLeft -= uiMoneyLimitInSlot;
          } else {
            pSoldier.value.inv[bSlot].uiMoneyAmount = uiMoneyLeft;
            // done!
            break;
          }

          bSlot = FindEmptySlotWithin(pSoldier, BIGPOCK1POS, SMALLPOCK8POS);
        }
      }
    }
  }
}

// SPECIAL!  Certain events in the game can cause profiled NPCs to become enemies.  The two cases are
// adding Mike and Iggy.  We will only add one NPC in any given combat and the conditions for setting
// the associated facts are done elsewhere.  The function will set the profile for the SOLDIERCREATE_STRUCT
// and the rest will be handled automatically so long the ubProfile field doesn't get changed.
// NOTE:  We don't want to add Mike or Iggy if this is being called from autoresolve!
function OkayToUpgradeEliteToSpecialProfiledEnemy(pp: Pointer<SOLDIERCREATE_STRUCT>): void {
  if (!gfProfiledEnemyAdded && gubEnemyEncounterCode != ENEMY_ENCOUNTER_CODE && gubEnemyEncounterCode != ENEMY_INVASION_CODE) {
    if (gubFact[FACT_MIKE_AVAILABLE_TO_ARMY] == 1 && !pp.value.fOnRoof) {
      gubFact[FACT_MIKE_AVAILABLE_TO_ARMY] = 2; // so it fails all subsequent checks
      pp.value.ubProfile = MIKE;
      gfProfiledEnemyAdded = TRUE;
    } else if (gubFact[FACT_IGGY_AVAILABLE_TO_ARMY] == 1 && !pp.value.fOnRoof) {
      gubFact[FACT_IGGY_AVAILABLE_TO_ARMY] = 2; // so it fails all subsequent checks
      pp.value.ubProfile = IGGY;
      gfProfiledEnemyAdded = TRUE;
    }
  }
}

function TrashAllSoldiers(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  cnt = 0;

  for (pSoldier = MercPtrs[cnt]; cnt < MAX_NUM_SOLDIERS; pSoldier++, cnt++) {
    if (pSoldier.value.bActive) {
      // Delete from world
      TacticalRemoveSoldier(cnt);
    }
  }
}

function GetLocationModifier(ubSoldierClass: UINT8): UINT8 {
  let ubLocationModifier: UINT8;
  let ubPalaceDistance: UINT8;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let sSectorZ: INT16;
  let bTownId: INT8;
  let fSuccess: BOOLEAN;

  // where is all this taking place?
  fSuccess = GetCurrentBattleSectorXYZ(&sSectorX, &sSectorY, &sSectorZ);
  Assert(fSuccess);

  // ignore sSectorZ - treat any underground enemies as if they were on the surface!
  bTownId = GetTownIdForSector(sSectorX, sSectorY);

  switch (bTownId) {
    case ORTA:
    case TIXA:
      // enemy troops in these special places are stronger than geography would indicate
      ubPalaceDistance = 4;
      break;

    case ALMA:
      // enemy troops in these special places are stronger than geography would indicate
      ubPalaceDistance = 10;
      break;

    default:
      // how far is this sector from the palace ?
      // the distance returned is in sectors, and the possible range is about 0-20
      ubPalaceDistance = GetPythDistanceFromPalace(sSectorX, sSectorY);
      if (ubPalaceDistance > MAX_PALACE_DISTANCE) {
        ubPalaceDistance = MAX_PALACE_DISTANCE;
      }
  }

  // adjust for distance from Queen's palace (P3) (0 to +30)
  ubLocationModifier = ((MAX_PALACE_DISTANCE - ubPalaceDistance) * DIFF_FACTOR_PALACE_DISTANCE) / MAX_PALACE_DISTANCE;

  return ubLocationModifier;
}

// grab the distance from the palace
function GetPythDistanceFromPalace(sSectorX: INT16, sSectorY: INT16): UINT8 {
  let ubDistance: UINT8 = 0;
  let sRows: INT16 = 0;
  let sCols: INT16 = 0;
  let fValue: float = 0.0;

  // grab number of rows and cols
  sRows = (abs((sSectorX) - (PALACE_SECTOR_X)));
  sCols = (abs((sSectorY) - (PALACE_SECTOR_Y)));

  // apply Pythagoras's theorem for right-handed triangle:
  // dist^2 = rows^2 + cols^2, so use the square root to get the distance
  fValue = sqrt((sRows * sRows) + (sCols * sCols));

  if (fmod(fValue, 1.0) >= 0.50) {
    ubDistance = (1 + fValue);
  } else {
    ubDistance = fValue;
  }

  return ubDistance;
}

function ReduceHighExpLevels(pbExpLevel: Pointer<INT8>): void {
  let ubRoll: UINT8;
  // important: must reset these to 0 by default for logic to work!
  let ubChanceLvl8: UINT8 = 0;
  let ubChanceLvl7: UINT8 = 0;
  let ubChanceLvl6: UINT8 = 0;
  let ubChanceLvl5: UINT8 = 0;

  // this function reduces the experience levels of very high level enemies to something that player can compete with
  // for interrupts.  It doesn't affect attributes and skills, those are rolled prior to this reduction!

  // adjust for game difficulty level
  switch (gGameOptions.ubDifficultyLevel) {
    case DIF_LEVEL_EASY:
      // max level: 6
      switch (*pbExpLevel) {
        case 6:
          ubChanceLvl6 = 25;
          ubChanceLvl5 = 100;
          break;
        case 7:
          ubChanceLvl6 = 50;
          ubChanceLvl5 = 100;
          break;
        case 8:
          ubChanceLvl6 = 75;
          ubChanceLvl5 = 100;
          break;
        case 9:
          ubChanceLvl6 = 100;
          break;
      }
      break;

    case DIF_LEVEL_MEDIUM:
      // max level: 7
      switch (*pbExpLevel) {
        case 7:
          ubChanceLvl7 = 25;
          ubChanceLvl6 = 100;
          break;
        case 8:
          ubChanceLvl7 = 50;
          ubChanceLvl6 = 100;
          break;
        case 9:
          ubChanceLvl7 = 75;
          ubChanceLvl6 = 100;
          break;
      }
      break;

    case DIF_LEVEL_HARD:
      // max level: 8
      switch (*pbExpLevel) {
        case 8:
          ubChanceLvl8 = 25;
          ubChanceLvl7 = 100;
          break;
        case 9:
          ubChanceLvl8 = 50;
          ubChanceLvl7 = 100;
          break;
      }
      break;
  }

  ubRoll = Random(100);

  if (ubRoll < ubChanceLvl8)
    *pbExpLevel = 8;
  else if (ubRoll < ubChanceLvl7)
    *pbExpLevel = 7;
  else if (ubRoll < ubChanceLvl6)
    *pbExpLevel = 6;
  else if (ubRoll < ubChanceLvl5)
    *pbExpLevel = 5;
  // else leave it alone
}
