let gfPotentialTeamChangeDuringDeath: BOOLEAN = FALSE;

const MIN_BLINK_FREQ = 3000;
const MIN_EXPRESSION_FREQ = 2000;

let gMercProfiles: MERCPROFILESTRUCT[] /* [NUM_PROFILES] */;

let gbSkillTraitBonus: INT8[] /* [NUM_SKILLTRAITS] */ = [
  0, // NO_SKILLTRAIT
  25, // LOCKPICKING
  15, // HANDTOHAND
  15, // ELECTRONICS
  15, // NIGHTOPS
  12, // THROWING
  15, // TEACHING
  15, // HEAVY_WEAPS
  0, // AUTO_WEAPS
  15, // STEALTHY
  0, // AMBIDEXT
  0, // THIEF				// UNUSED!
  30, // MARTIALARTS
  30, // KNIFING
  15, // ONROOF
  0, // CAMOUFLAGED
];

let gubBasicInventoryPositions: UINT8[] /* [] */ = [
  Enum261.HELMETPOS,
  Enum261.VESTPOS,
  Enum261.LEGPOS,
  Enum261.HANDPOS,
  Enum261.BIGPOCK1POS,
  Enum261.BIGPOCK2POS,
  Enum261.BIGPOCK3POS,
  Enum261.BIGPOCK4POS,
];

const NUM_TERRORISTS = 6;

let gubTerrorists: UINT8[] /* [NUM_TERRORISTS + 1] */ = [
  Enum268.DRUGGIST,
  Enum268.SLAY,
  Enum268.ANNIE,
  Enum268.CHRIS,
  Enum268.TIFFANY,
  Enum268.T_REX,
  0,
];

let gubNumTerrorists: UINT8 = 0;

const NUM_TERRORIST_POSSIBLE_LOCATIONS = 5;

let gsTerroristSector: INT16[][][] /* [NUM_TERRORISTS][NUM_TERRORIST_POSSIBLE_LOCATIONS][2] */ = [
  // Elgin... preplaced
  [
    [ 0, 0 ],
    [ 0, 0 ],
    [ 0, 0 ],
    [ 0, 0 ],
    [ 0, 0 ],
  ],
  // Slay
  [
    [ 9, MAP_ROW_F ],
    [ 14, MAP_ROW_I ],
    [ 1, MAP_ROW_G ],
    [ 2, MAP_ROW_G ],
    [ 8, MAP_ROW_G ],
  ],
  // Matron
  [
    [ 14, MAP_ROW_I ],
    [ 6, MAP_ROW_C ],
    [ 2, MAP_ROW_B ],
    [ 11, MAP_ROW_L ],
    [ 8, MAP_ROW_G ],
  ],
  // Imposter
  [
    [ 1, MAP_ROW_G ],
    [ 9, MAP_ROW_F ],
    [ 11, MAP_ROW_L ],
    [ 8, MAP_ROW_G ],
    [ 2, MAP_ROW_G ],
  ],
  // Tiffany
  [
    [ 14, MAP_ROW_I ],
    [ 2, MAP_ROW_G ],
    [ 14, MAP_ROW_H ],
    [ 6, MAP_ROW_C ],
    [ 2, MAP_ROW_B ],
  ],
  // Rexall
  [
    [ 9, MAP_ROW_F ],
    [ 14, MAP_ROW_H ],
    [ 2, MAP_ROW_H ],
    [ 1, MAP_ROW_G ],
    [ 2, MAP_ROW_B ],
  ],
];

let gsRobotGridNo: INT16;

const NUM_ASSASSINS = 6;

let gubAssassins: UINT8[] /* [NUM_ASSASSINS] */ = [
  Enum268.JIM,
  Enum268.JACK,
  Enum268.OLAF,
  Enum268.RAY,
  Enum268.OLGA,
  Enum268.TYRONE,
];

const NUM_ASSASSIN_POSSIBLE_TOWNS = 5;

let gbAssassinTown: INT8[][] /* [NUM_ASSASSINS][NUM_ASSASSIN_POSSIBLE_TOWNS] */ = [
  // Jim
  [ Enum135.CAMBRIA, Enum135.DRASSEN, Enum135.ALMA, Enum135.BALIME, Enum135.GRUMM ],
  // Jack
  [ Enum135.CHITZENA, Enum135.ESTONI, Enum135.ALMA, Enum135.BALIME, Enum135.GRUMM ],
  // Olaf
  [ Enum135.DRASSEN, Enum135.ESTONI, Enum135.ALMA, Enum135.CAMBRIA, Enum135.BALIME ],
  // Ray
  [ Enum135.CAMBRIA, Enum135.OMERTA, Enum135.BALIME, Enum135.GRUMM, Enum135.DRASSEN ],
  // Olga
  [ Enum135.CHITZENA, Enum135.OMERTA, Enum135.CAMBRIA, Enum135.ALMA, Enum135.GRUMM ],
  // Tyrone
  [ Enum135.CAMBRIA, Enum135.BALIME, Enum135.ALMA, Enum135.GRUMM, Enum135.DRASSEN ],
];

function LoadMercProfiles(): BOOLEAN {
  //	FILE *fptr;
  let fptr: HWFILE;
  let pFileName: Pointer<char> = "BINARYDATA\\Prof.dat";
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let uiLoop3: UINT32;
  let usItem: UINT16;
  let usNewGun: UINT16;
  let usAmmo: UINT16;
  let usNewAmmo: UINT16;
  let uiNumBytesRead: UINT32;

  fptr = FileOpen(pFileName, FILE_ACCESS_READ, FALSE);
  if (!fptr) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to LoadMercProfiles from file %s", pFileName));
    return FALSE;
  }

  for (uiLoop = 0; uiLoop < NUM_PROFILES; uiLoop++) {
    if (JA2EncryptedFileRead(fptr, addressof(gMercProfiles[uiLoop]), sizeof(MERCPROFILESTRUCT), addressof(uiNumBytesRead)) != 1) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Read Merc Profiles from File %d %s", uiLoop, pFileName));
      FileClose(fptr);
      return FALSE;
    }

    // if the Dialogue exists for the merc, allow the merc to be hired
    if (DialogueDataFileExistsForProfile(uiLoop, 0, FALSE, NULL)) {
      gMercProfiles[uiLoop].bMercStatus = 0;
    } else
      gMercProfiles[uiLoop].bMercStatus = MERC_HAS_NO_TEXT_FILE;

    // if the merc has a medical deposit
    if (gMercProfiles[uiLoop].bMedicalDeposit) {
      gMercProfiles[uiLoop].sMedicalDepositAmount = CalcMedicalDeposit(addressof(gMercProfiles[uiLoop]));
    } else
      gMercProfiles[uiLoop].sMedicalDepositAmount = 0;

    // ATE: New, face display indipendent of ID num now
    // Setup face index value
    // Default is the ubCharNum
    gMercProfiles[uiLoop].ubFaceIndex = uiLoop;

    if (!gGameOptions.fGunNut) {
      // CJC: replace guns in profile if they aren't available
      for (uiLoop2 = 0; uiLoop2 < Enum261.NUM_INV_SLOTS; uiLoop2++) {
        usItem = gMercProfiles[uiLoop].inv[uiLoop2];

        if ((Item[usItem].usItemClass & IC_GUN) && ExtendedGunListGun(usItem)) {
          usNewGun = StandardGunListReplacement(usItem);
          if (usNewGun != NOTHING) {
            gMercProfiles[uiLoop].inv[uiLoop2] = usNewGun;

            // must search through inventory and replace ammo accordingly
            for (uiLoop3 = 0; uiLoop3 < Enum261.NUM_INV_SLOTS; uiLoop3++) {
              usAmmo = gMercProfiles[uiLoop].inv[uiLoop3];
              if ((Item[usAmmo].usItemClass & IC_AMMO)) {
                usNewAmmo = FindReplacementMagazineIfNecessary(usItem, usAmmo, usNewGun);
                if (usNewAmmo != NOTHING)
                  ;
                {
                  // found a new magazine, replace...
                  gMercProfiles[uiLoop].inv[uiLoop3] = usNewAmmo;
                }
              }
            }
          }
        }
      }
    } // end of if not gun nut

    // ATE: Calculate some inital attractiveness values for buddy's inital equipment...
    // Look for gun and armour
    gMercProfiles[uiLoop].bMainGunAttractiveness = -1;
    gMercProfiles[uiLoop].bArmourAttractiveness = -1;

    for (uiLoop2 = 0; uiLoop2 < Enum261.NUM_INV_SLOTS; uiLoop2++) {
      usItem = gMercProfiles[uiLoop].inv[uiLoop2];

      if (usItem != NOTHING) {
        // Check if it's a gun
        if (Item[usItem].usItemClass & IC_GUN) {
          gMercProfiles[uiLoop].bMainGunAttractiveness = Weapon[usItem].ubDeadliness;
        }

        // If it's armour
        if (Item[usItem].usItemClass & IC_ARMOUR) {
          gMercProfiles[uiLoop].bArmourAttractiveness = Armour[Item[usItem].ubClassIndex].ubProtection;
        }
      }
    }

    // OK, if we are a created slot, this will get overriden at some time..

    // add up the items the merc has for the usOptionalGearCost
    gMercProfiles[uiLoop].usOptionalGearCost = 0;
    for (uiLoop2 = 0; uiLoop2 < Enum261.NUM_INV_SLOTS; uiLoop2++) {
      if (gMercProfiles[uiLoop].inv[uiLoop2] != NOTHING) {
        // get the item
        usItem = gMercProfiles[uiLoop].inv[uiLoop2];

        // add the cost
        gMercProfiles[uiLoop].usOptionalGearCost += Item[usItem].usPrice;
      }
    }

    // These variables to get loaded in
    gMercProfiles[uiLoop].fUseProfileInsertionInfo = FALSE;
    gMercProfiles[uiLoop].sGridNo = 0;

    // ARM: this is also being done inside the profile editor, but put it here too, so this project's code makes sense
    gMercProfiles[uiLoop].bHatedCount[0] = gMercProfiles[uiLoop].bHatedTime[0];
    gMercProfiles[uiLoop].bHatedCount[1] = gMercProfiles[uiLoop].bHatedTime[1];
    gMercProfiles[uiLoop].bLearnToHateCount = gMercProfiles[uiLoop].bLearnToHateTime;
    gMercProfiles[uiLoop].bLearnToLikeCount = gMercProfiles[uiLoop].bLearnToLikeTime;
  }

  // SET SOME DEFAULT LOCATIONS FOR STARTING NPCS

  FileClose(fptr);

// decide which terrorists are active
  DecideActiveTerrorists();

  // initialize mercs' status
  StartSomeMercsOnAssignment();

  // initial recruitable mercs' reputation in each town
  InitializeProfilesForTownReputation();

  gfProfileDataLoaded = TRUE;

  // no better place..heh?.. will load faces for profiles that are 'extern'.....won't have soldiertype instances
  InitalizeStaticExternalNPCFaces();

  // car portrait values
  LoadCarPortraitValues();

  return TRUE;
}

const MAX_ADDITIONAL_TERRORISTS = 4;

function DecideActiveTerrorists(): void {
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let ubTerrorist: UINT8;
  let ubNumAdditionalTerrorists: UINT8;
  let ubNumTerroristsAdded: UINT8 = 0;
  let uiChance: UINT32;
  let uiLocationChoice: UINT32;
  let fFoundSpot: BOOLEAN;
  let sTerroristPlacement: INT16[][] /* [MAX_ADDITIONAL_TERRORISTS][2] */ = [
    [ 0, 0 ],
    [ 0, 0 ],
    [ 0, 0 ],
    [ 0, 0 ],
  ];

  // one terrorist will always be Elgin
  // determine how many more terrorists - 2 to 4 more

  // using this stochastic process(!), the chances for terrorists are:
  // EASY:		3, 9%			4, 42%		5, 49%
  // MEDIUM:	3, 25%		4, 50%		5, 25%
  // HARD:		3, 49%		4, 42%		5, 9%
  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      uiChance = 70;
      break;
    case Enum9.DIF_LEVEL_HARD:
      uiChance = 30;
      break;
    default:
      uiChance = 50;
      break;
  }
  // add at least 2 more
  ubNumAdditionalTerrorists = 2;
  for (ubLoop = 0; ubLoop < (MAX_ADDITIONAL_TERRORISTS - 2); ubLoop++) {
    if (Random(100) < uiChance) {
      ubNumAdditionalTerrorists++;
    }
  }

  while (ubNumTerroristsAdded < ubNumAdditionalTerrorists) {
    ubLoop = 1; // start at beginning of array (well, after Elgin)

    // NB terrorist ID of 0 indicates end of array
    while (ubNumTerroristsAdded < ubNumAdditionalTerrorists && gubTerrorists[ubLoop] != 0) {
      ubTerrorist = gubTerrorists[ubLoop];

      // random 40% chance of adding this terrorist if not yet placed
      if ((gMercProfiles[ubTerrorist].sSectorX == 0) && (Random(100) < 40)) {
        fFoundSpot = FALSE;
        // Since there are 5 spots per terrorist and a maximum of 5 terrorists, we
        // are guaranteed to be able to find a spot for each terrorist since there
        // aren't enough other terrorists to use up all the spots for any one
        // terrorist
        do {
          // pick a random spot, see if it's already been used by another terrorist
          uiLocationChoice = Random(NUM_TERRORIST_POSSIBLE_LOCATIONS);
          for (ubLoop2 = 0; ubLoop2 < ubNumTerroristsAdded; ubLoop2++) {
            if (sTerroristPlacement[ubLoop2][0] == gsTerroristSector[ubLoop][uiLocationChoice][0]) {
              if (sTerroristPlacement[ubLoop2][1] == gsTerroristSector[ubLoop][uiLocationChoice][1]) {
                continue;
              }
            }
          }
          fFoundSpot = TRUE;
        } while (!fFoundSpot);

        // place terrorist!
        gMercProfiles[ubTerrorist].sSectorX = gsTerroristSector[ubLoop][uiLocationChoice][0];
        gMercProfiles[ubTerrorist].sSectorY = gsTerroristSector[ubLoop][uiLocationChoice][1];
        gMercProfiles[ubTerrorist].bSectorZ = 0;
        sTerroristPlacement[ubNumTerroristsAdded][0] = gMercProfiles[ubTerrorist].sSectorX;
        sTerroristPlacement[ubNumTerroristsAdded][1] = gMercProfiles[ubTerrorist].sSectorY;
        ubNumTerroristsAdded++;
      }
      ubLoop++;
    }

    // start over if necessary
  }

  // set total terrorists outstanding in Carmen's info byte
  gMercProfiles[78].bNPCData = 1 + ubNumAdditionalTerrorists;

  // store total terrorists
  gubNumTerrorists = 1 + ubNumAdditionalTerrorists;
}

function MakeRemainingTerroristsTougher(): void {
  let ubRemainingTerrorists: UINT8 = 0;
  let ubLoop: UINT8;
  let usNewItem: UINT16;
  let usOldItem: UINT16;
  let Object: OBJECTTYPE;
  let ubRemainingDifficulty: UINT8;

  for (ubLoop = 0; ubLoop < NUM_TERRORISTS; ubLoop++) {
    if (gMercProfiles[gubTerrorists[ubLoop]].bMercStatus != MERC_IS_DEAD && gMercProfiles[gubTerrorists[ubLoop]].sSectorX != 0 && gMercProfiles[gubTerrorists[ubLoop]].sSectorY != 0) {
      if (gubTerrorists[ubLoop] == Enum268.SLAY) {
        if (FindSoldierByProfileID(Enum268.SLAY, TRUE) != NULL) {
          // Slay on player's team, doesn't count towards remaining terrorists
          continue;
        }
      }
      ubRemainingTerrorists++;
    }
  }

  ubRemainingDifficulty = (60 / gubNumTerrorists) * (gubNumTerrorists - ubRemainingTerrorists);

  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_MEDIUM:
      ubRemainingDifficulty = (ubRemainingDifficulty * 13) / 10;
      break;
    case Enum9.DIF_LEVEL_HARD:
      ubRemainingDifficulty = (ubRemainingDifficulty * 16) / 10;
      break;
    default:
      break;
  }

  if (ubRemainingDifficulty < 14) {
    // nothing
    return;
  } else if (ubRemainingDifficulty < 28) {
    // mini grenade
    usOldItem = NOTHING;
    usNewItem = Enum225.MINI_GRENADE;
  } else if (ubRemainingDifficulty < 42) {
    // hand grenade
    usOldItem = Enum225.MINI_GRENADE;
    usNewItem = Enum225.HAND_GRENADE;
  } else if (ubRemainingDifficulty < 56) {
    // mustard
    usOldItem = Enum225.HAND_GRENADE;
    usNewItem = Enum225.MUSTARD_GRENADE;
  } else if (ubRemainingDifficulty < 70) {
    // LAW
    usOldItem = Enum225.MUSTARD_GRENADE;
    usNewItem = Enum225.ROCKET_LAUNCHER;
  } else {
    // LAW and hand grenade
    usOldItem = NOTHING;
    usNewItem = Enum225.HAND_GRENADE;
  }

  DeleteObj(addressof(Object));
  Object.usItem = usNewItem;
  Object.bStatus[0] = 100;

  for (ubLoop = 0; ubLoop < NUM_TERRORISTS; ubLoop++) {
    if (gMercProfiles[gubTerrorists[ubLoop]].bMercStatus != MERC_IS_DEAD && gMercProfiles[gubTerrorists[ubLoop]].sSectorX != 0 && gMercProfiles[gubTerrorists[ubLoop]].sSectorY != 0) {
      if (gubTerrorists[ubLoop] == Enum268.SLAY) {
        if (FindSoldierByProfileID(Enum268.SLAY, TRUE) != NULL) {
          // Slay on player's team, doesn't count towards remaining terrorists
          continue;
        }
      }

      if (usOldItem != NOTHING) {
        RemoveObjectFromSoldierProfile(gubTerrorists[ubLoop], usOldItem);
      }
      PlaceObjectInSoldierProfile(gubTerrorists[ubLoop], addressof(Object));
    }
  }
}

function DecideOnAssassin(): void {
  let ubAssassinPossibility: UINT8[] /* [NUM_ASSASSINS] */ = [
    NO_PROFILE,
    NO_PROFILE,
    NO_PROFILE,
    NO_PROFILE,
    NO_PROFILE,
    NO_PROFILE,
  ];
  let ubAssassinsPossible: UINT8 = 0;
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let ubTown: UINT8;

  ubTown = GetTownIdForSector(gWorldSectorX, gWorldSectorY);

  for (ubLoop = 0; ubLoop < NUM_ASSASSINS; ubLoop++) {
    // make sure alive and not placed already
    if (gMercProfiles[gubAssassins[ubLoop]].bMercStatus != MERC_IS_DEAD && gMercProfiles[gubAssassins[ubLoop]].sSectorX == 0 && gMercProfiles[gubAssassins[ubLoop]].sSectorY == 0) {
      // check this merc to see if the town is a possibility
      for (ubLoop2 = 0; ubLoop2 < NUM_ASSASSIN_POSSIBLE_TOWNS; ubLoop2++) {
        if (gbAssassinTown[ubLoop][ubLoop2] == ubTown) {
          ubAssassinPossibility[ubAssassinsPossible] = gubAssassins[ubLoop];
          ubAssassinsPossible++;
        }
      }
    }
  }

  if (ubAssassinsPossible != 0) {
    ubLoop = ubAssassinPossibility[Random(ubAssassinsPossible)];
    gMercProfiles[ubLoop].sSectorX = gWorldSectorX;
    gMercProfiles[ubLoop].sSectorY = gWorldSectorY;
    AddStrategicEvent(Enum132.EVENT_REMOVE_ASSASSIN, GetWorldTotalMin() + 60 * (3 + Random(3)), ubLoop);
  }
}

function MakeRemainingAssassinsTougher(): void {
  let ubRemainingAssassins: UINT8 = 0;
  let ubLoop: UINT8;
  let usNewItem: UINT16;
  let usOldItem: UINT16;
  let Object: OBJECTTYPE;
  let ubRemainingDifficulty: UINT8;

  for (ubLoop = 0; ubLoop < NUM_ASSASSINS; ubLoop++) {
    if (gMercProfiles[gubAssassins[ubLoop]].bMercStatus != MERC_IS_DEAD) {
      ubRemainingAssassins++;
    }
  }

  ubRemainingDifficulty = (60 / NUM_ASSASSINS) * (NUM_ASSASSINS - ubRemainingAssassins);

  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_MEDIUM:
      ubRemainingDifficulty = (ubRemainingDifficulty * 13) / 10;
      break;
    case Enum9.DIF_LEVEL_HARD:
      ubRemainingDifficulty = (ubRemainingDifficulty * 16) / 10;
      break;
    default:
      break;
  }

  if (ubRemainingDifficulty < 14) {
    // nothing
    return;
  } else if (ubRemainingDifficulty < 28) {
    // mini grenade
    usOldItem = NOTHING;
    usNewItem = Enum225.MINI_GRENADE;
  } else if (ubRemainingDifficulty < 42) {
    // hand grenade
    usOldItem = Enum225.MINI_GRENADE;
    usNewItem = Enum225.HAND_GRENADE;
  } else if (ubRemainingDifficulty < 56) {
    // mustard
    usOldItem = Enum225.HAND_GRENADE;
    usNewItem = Enum225.MUSTARD_GRENADE;
  } else if (ubRemainingDifficulty < 70) {
    // LAW
    usOldItem = Enum225.MUSTARD_GRENADE;
    usNewItem = Enum225.ROCKET_LAUNCHER;
  } else {
    // LAW and hand grenade
    usOldItem = NOTHING;
    usNewItem = Enum225.HAND_GRENADE;
  }

  DeleteObj(addressof(Object));
  Object.usItem = usNewItem;
  Object.bStatus[0] = 100;

  for (ubLoop = 0; ubLoop < NUM_ASSASSINS; ubLoop++) {
    if (gMercProfiles[gubAssassins[ubLoop]].bMercStatus != MERC_IS_DEAD) {
      if (usOldItem != NOTHING) {
        RemoveObjectFromSoldierProfile(gubAssassins[ubLoop], usOldItem);
      }
      PlaceObjectInSoldierProfile(gubAssassins[ubLoop], addressof(Object));
    }
  }
}

function StartSomeMercsOnAssignment(): void {
  let uiCnt: UINT32;
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let uiChance: UINT32;

  // some randomly picked A.I.M. mercs will start off "on assignment" at the beginning of each new game
  for (uiCnt = 0; uiCnt < AIM_AND_MERC_MERCS; uiCnt++) {
    pProfile = addressof(gMercProfiles[uiCnt]);

    // calc chance to start on assignment
    uiChance = 5 * pProfile.value.bExpLevel;

    if (Random(100) < uiChance) {
      pProfile.value.bMercStatus = MERC_WORKING_ELSEWHERE;
      pProfile.value.uiDayBecomesAvailable = 1 + Random(6 + (pProfile.value.bExpLevel / 2)); // 1-(6 to 11) days
    } else {
      pProfile.value.bMercStatus = MERC_OK;
      pProfile.value.uiDayBecomesAvailable = 0;
    }

    pProfile.value.uiPrecedentQuoteSaid = 0;
    pProfile.value.ubDaysOfMoraleHangover = 0;
  }
}

function SetProfileFaceData(ubCharNum: UINT8, ubFaceIndex: UINT8, usEyesX: UINT16, usEyesY: UINT16, usMouthX: UINT16, usMouthY: UINT16): void {
  gMercProfiles[ubCharNum].ubFaceIndex = ubFaceIndex;
  gMercProfiles[ubCharNum].usEyesX = usEyesX;
  gMercProfiles[ubCharNum].usEyesY = usEyesY;
  gMercProfiles[ubCharNum].usMouthX = usMouthX;
  gMercProfiles[ubCharNum].usMouthY = usMouthY;
}

function CalcCompetence(pProfile: Pointer<MERCPROFILESTRUCT>): UINT16 {
  let uiStats: UINT32;
  let uiSkills: UINT32;
  let uiActionPoints: UINT32;
  let uiSpecialSkills: UINT32;
  let usCompetence: UINT16;

  // count life twice 'cause it's also hit points
  // mental skills are halved 'cause they're actually not that important within the game
  uiStats = ((2 * pProfile.value.bLifeMax) + pProfile.value.bStrength + pProfile.value.bAgility + pProfile.value.bDexterity + ((pProfile.value.bLeadership + pProfile.value.bWisdom) / 2)) / 3;

  // marksmanship is very important, count it double
  uiSkills = ((2 * (pow(pProfile.value.bMarksmanship, 3) / 10000)) + 1.5 * (pow(pProfile.value.bMedical, 3) / 10000) + (pow(pProfile.value.bMechanical, 3) / 10000) + (pow(pProfile.value.bExplosive, 3) / 10000));

  // action points
  uiActionPoints = 5 + (((10 * pProfile.value.bExpLevel + 3 * pProfile.value.bAgility + 2 * pProfile.value.bLifeMax + 2 * pProfile.value.bDexterity) + 20) / 40);

  // count how many he has, don't care what they are
  uiSpecialSkills = ((pProfile.value.bSkillTrait != 0) ? 1 : 0) + ((pProfile.value.bSkillTrait2 != 0) ? 1 : 0);

  usCompetence = ((pow(pProfile.value.bExpLevel, 0.2) * uiStats * uiSkills * (uiActionPoints - 6) * (1 + (0.05 * uiSpecialSkills))) / 1000);

  // this currently varies from about 10 (Flo) to 1200 (Gus)
  return usCompetence;
}

function CalcMedicalDeposit(pProfile: Pointer<MERCPROFILESTRUCT>): INT16 {
  let usDeposit: UINT16;

  // this rounds off to the nearest hundred
  usDeposit = (((5 * CalcCompetence(pProfile)) + 50) / 100) * 100;

  return usDeposit;
}

function FindSoldierByProfileID(ubProfileID: UINT8, fPlayerMercsOnly: BOOLEAN): Pointer<SOLDIERTYPE> {
  let ubLoop: UINT8;
  let ubLoopLimit: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (fPlayerMercsOnly) {
    ubLoopLimit = gTacticalStatus.Team[0].bLastID;
  } else {
    ubLoopLimit = MAX_NUM_SOLDIERS;
  }

  for (ubLoop = 0, pSoldier = MercPtrs[0]; ubLoop < ubLoopLimit; ubLoop++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.ubProfile == ubProfileID) {
      return pSoldier;
    }
  }
  return NULL;
}

function ChangeSoldierTeam(pSoldier: Pointer<SOLDIERTYPE>, ubTeam: UINT8): Pointer<SOLDIERTYPE> {
  let ubID: UINT8;
  let pNewSoldier: Pointer<SOLDIERTYPE> = NULL;
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let cnt: UINT32;
  let sOldGridNo: INT16;

  let ubOldID: UINT8;
  let uiOldUniqueId: UINT32;

  let uiSlot: UINT32;
  let pGroupMember: Pointer<SOLDIERTYPE>;

  if (gfInTalkPanel) {
    DeleteTalkingMenu();
  }

  // Save merc id for this guy...
  ubID = pSoldier.value.ubID;

  ubOldID = ubID;
  uiOldUniqueId = pSoldier.value.uiUniqueSoldierIdValue;

  sOldGridNo = pSoldier.value.sGridNo;

  // Remove him from the game!
  InternalTacticalRemoveSoldier(ubID, FALSE);

  // Create a new one!
  memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
  MercCreateStruct.bTeam = ubTeam;
  MercCreateStruct.ubProfile = pSoldier.value.ubProfile;
  MercCreateStruct.bBodyType = pSoldier.value.ubBodyType;
  MercCreateStruct.sSectorX = pSoldier.value.sSectorX;
  MercCreateStruct.sSectorY = pSoldier.value.sSectorY;
  MercCreateStruct.bSectorZ = pSoldier.value.bSectorZ;
  MercCreateStruct.sInsertionGridNo = pSoldier.value.sGridNo;
  MercCreateStruct.bDirection = pSoldier.value.bDirection;

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    MercCreateStruct.ubProfile = NO_PROFILE;
    MercCreateStruct.fUseGivenVehicle = TRUE;
    MercCreateStruct.bUseGivenVehicleID = pSoldier.value.bVehicleID;
  }

  if (ubTeam == gbPlayerNum) {
    MercCreateStruct.fPlayerMerc = TRUE;
  }

  if (TacticalCreateSoldier(addressof(MercCreateStruct), addressof(ubID))) {
    pNewSoldier = MercPtrs[ubID];

    // Copy vital stats back!
    pNewSoldier.value.bLife = pSoldier.value.bLife;
    pNewSoldier.value.bLifeMax = pSoldier.value.bLifeMax;
    pNewSoldier.value.bAgility = pSoldier.value.bAgility;
    pNewSoldier.value.bLeadership = pSoldier.value.bLeadership;
    pNewSoldier.value.bDexterity = pSoldier.value.bDexterity;
    pNewSoldier.value.bStrength = pSoldier.value.bStrength;
    pNewSoldier.value.bWisdom = pSoldier.value.bWisdom;
    pNewSoldier.value.bExpLevel = pSoldier.value.bExpLevel;
    pNewSoldier.value.bMarksmanship = pSoldier.value.bMarksmanship;
    pNewSoldier.value.bMedical = pSoldier.value.bMedical;
    pNewSoldier.value.bMechanical = pSoldier.value.bMechanical;
    pNewSoldier.value.bExplosive = pSoldier.value.bExplosive;
    pNewSoldier.value.bScientific = pSoldier.value.bScientific;
    pNewSoldier.value.bLastRenderVisibleValue = pSoldier.value.bLastRenderVisibleValue;
    pNewSoldier.value.bVisible = pSoldier.value.bVisible;

    if (ubTeam == gbPlayerNum) {
      pNewSoldier.value.bVisible = 1;
    }

    // Copy over any items....
    for (cnt = 0; cnt < Enum261.NUM_INV_SLOTS; cnt++) {
      pNewSoldier.value.inv[cnt] = pSoldier.value.inv[cnt];
    }

    // OK, loop through all active merc slots, change
    // Change ANY attacker's target if they were once on this guy.....
    for (uiSlot = 0; uiSlot < guiNumMercSlots; uiSlot++) {
      pGroupMember = MercSlots[uiSlot];

      if (pGroupMember != NULL) {
        if (pGroupMember.value.ubTargetID == pSoldier.value.ubID) {
          pGroupMember.value.ubTargetID = pNewSoldier.value.ubID;
        }
      }
    }

    // Set insertion gridNo
    pNewSoldier.value.sInsertionGridNo = sOldGridNo;

    if (gfPotentialTeamChangeDuringDeath) {
      HandleCheckForDeathCommonCode(pSoldier);
    }

    if (gfWorldLoaded && pSoldier.value.bInSector
        // pSoldier->sSectorX == gWorldSectorX && pSoldier->sSectorY == gWorldSectorY && pSoldier->bSectorZ == gbWorldSectorZ
    ) {
      AddSoldierToSectorNoCalculateDirectionUseAnimation(ubID, pSoldier.value.usAnimState, pSoldier.value.usAniCode);
      HandleSight(pNewSoldier, SIGHT_LOOK | SIGHT_RADIO);
    }

    // fix up the event queue...
    //	ChangeSoldierIDInQueuedEvents( ubOldID, uiOldUniqueId, pNewSoldier->ubID, pNewSoldier->uiUniqueSoldierIdValue );

    if (pNewSoldier.value.ubProfile != NO_PROFILE) {
      if (ubTeam == gbPlayerNum) {
        gMercProfiles[pNewSoldier.value.ubProfile].ubMiscFlags |= PROFILE_MISC_FLAG_RECRUITED;
      } else {
        gMercProfiles[pNewSoldier.value.ubProfile].ubMiscFlags &= (~PROFILE_MISC_FLAG_RECRUITED);
      }
    }
  }

  // AT the low level check if this poor guy is in inv panel, else
  // remove....
  if (gsCurInterfacePanel == Enum215.SM_PANEL && gpSMCurrentMerc == pSoldier) {
    // Switch....
    SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
  }

  return pNewSoldier;
}

function RecruitRPC(ubCharNum: UINT8): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pNewSoldier: Pointer<SOLDIERTYPE>;

  // Get soldier pointer
  pSoldier = FindSoldierByProfileID(ubCharNum, FALSE);

  if (!pSoldier) {
    return FALSE;
  }

  // OK, set recruit flag..
  gMercProfiles[ubCharNum].ubMiscFlags |= PROFILE_MISC_FLAG_RECRUITED;

  // Add this guy to our team!
  pNewSoldier = ChangeSoldierTeam(pSoldier, gbPlayerNum);

  // handle set up any RPC's that will leave us in time
  if (ubCharNum == Enum268.SLAY) {
    // slay will leave in a week
    pNewSoldier.value.iEndofContractTime = GetWorldTotalMin() + (7 * 24 * 60);

    KickOutWheelchair(pNewSoldier);
  } else if (ubCharNum == Enum268.DYNAMO && gubQuest[Enum169.QUEST_FREE_DYNAMO] == QUESTINPROGRESS) {
    EndQuest(Enum169.QUEST_FREE_DYNAMO, pSoldier.value.sSectorX, pSoldier.value.sSectorY);
  }
  // handle town loyalty adjustment
  HandleTownLoyaltyForNPCRecruitment(pNewSoldier);

  // Try putting them into the current squad
  if (AddCharacterToSquad(pNewSoldier, CurrentSquad()) == FALSE) {
    AddCharacterToAnySquad(pNewSoldier);
  }

  ResetDeadSquadMemberList(pNewSoldier.value.bAssignment);

  DirtyMercPanelInterface(pNewSoldier, DIRTYLEVEL2);

  if (pNewSoldier.value.inv[Enum261.HANDPOS].usItem == NOTHING) {
    // empty handed - swap in first available weapon
    let bSlot: INT8;

    bSlot = FindObjClass(pNewSoldier, IC_WEAPON);
    if (bSlot != NO_SLOT) {
      if (Item[pNewSoldier.value.inv[bSlot].usItem].fFlags & ITEM_TWO_HANDED) {
        if (bSlot != Enum261.SECONDHANDPOS && pNewSoldier.value.inv[Enum261.SECONDHANDPOS].usItem != NOTHING) {
          // need to move second hand item out first
          AutoPlaceObject(pNewSoldier, addressof(pNewSoldier.value.inv[Enum261.SECONDHANDPOS]), FALSE);
        }
      }
      // swap item to hand
      SwapObjs(addressof(pNewSoldier.value.inv[bSlot]), addressof(pNewSoldier.value.inv[Enum261.HANDPOS]));
    }
  }

  if (ubCharNum == Enum268.IRA) {
    // trigger 0th PCscript line
    TriggerNPCRecord(Enum268.IRA, 0);
  }

  // Set whatkind of merc am i
  pNewSoldier.value.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__NPC;

  //
  // add a history log that tells the user that a npc has joined the team
  //
  // ( pass in pNewSoldier->sSectorX cause if its invalid, -1, n/a will appear as the sector in the history log )
  AddHistoryToPlayersLog(Enum83.HISTORY_RPC_JOINED_TEAM, pNewSoldier.value.ubProfile, GetWorldTotalMin(), pNewSoldier.value.sSectorX, pNewSoldier.value.sSectorY);

  // remove the merc from the Personnel screens departed list ( if they have never been hired before, its ok to call it )
  RemoveNewlyHiredMercFromPersonnelDepartedList(pSoldier.value.ubProfile);

  return TRUE;
}

function RecruitEPC(ubCharNum: UINT8): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pNewSoldier: Pointer<SOLDIERTYPE>;

  // Get soldier pointer
  pSoldier = FindSoldierByProfileID(ubCharNum, FALSE);

  if (!pSoldier) {
    return FALSE;
  }

  // OK, set recruit flag..
  gMercProfiles[ubCharNum].ubMiscFlags |= PROFILE_MISC_FLAG_EPCACTIVE;

  gMercProfiles[ubCharNum].ubMiscFlags3 &= ~PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE;

  // Add this guy to our team!
  pNewSoldier = ChangeSoldierTeam(pSoldier, gbPlayerNum);
  pNewSoldier.value.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__EPC;

  // Try putting them into the current squad
  if (AddCharacterToSquad(pNewSoldier, CurrentSquad()) == FALSE) {
    AddCharacterToAnySquad(pNewSoldier);
  }

  ResetDeadSquadMemberList(pNewSoldier.value.bAssignment);

  DirtyMercPanelInterface(pNewSoldier, DIRTYLEVEL2);
  // Make the interface panel dirty..
  // This will dirty the panel next frame...
  gfRerenderInterfaceFromHelpText = TRUE;

  // If we are a robot, look to update controller....
  if (pNewSoldier.value.uiStatusFlags & SOLDIER_ROBOT) {
    UpdateRobotControllerGivenRobot(pNewSoldier);
  }

  // Set whatkind of merc am i
  pNewSoldier.value.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__EPC;

  UpdateTeamPanelAssignments();

  return TRUE;
}

function UnRecruitEPC(ubCharNum: UINT8): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pNewSoldier: Pointer<SOLDIERTYPE>;

  // Get soldier pointer
  pSoldier = FindSoldierByProfileID(ubCharNum, FALSE);

  if (!pSoldier) {
    return FALSE;
  }

  if (pSoldier.value.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__EPC) {
    return FALSE;
  }

  if (pSoldier.value.bAssignment < Enum117.ON_DUTY) {
    ResetDeadSquadMemberList(pSoldier.value.bAssignment);
  }

  // Rmeove from squad....
  RemoveCharacterFromSquads(pSoldier);

  // O< check if this is the only guy in the sector....
  if (gusSelectedSoldier == pSoldier.value.ubID) {
    gusSelectedSoldier = NOBODY;
  }

  // OK, UN set recruit flag..
  gMercProfiles[ubCharNum].ubMiscFlags &= (~PROFILE_MISC_FLAG_EPCACTIVE);

  // update sector values to current

  // check to see if this person should disappear from the map after this
  if ((ubCharNum == Enum268.JOHN || ubCharNum == Enum268.MARY) && pSoldier.value.sSectorX == 13 && pSoldier.value.sSectorY == MAP_ROW_B && pSoldier.value.bSectorZ == 0) {
    gMercProfiles[ubCharNum].sSectorX = 0;
    gMercProfiles[ubCharNum].sSectorY = 0;
    gMercProfiles[ubCharNum].bSectorZ = 0;
  } else {
    gMercProfiles[ubCharNum].sSectorX = pSoldier.value.sSectorX;
    gMercProfiles[ubCharNum].sSectorY = pSoldier.value.sSectorY;
    gMercProfiles[ubCharNum].bSectorZ = pSoldier.value.bSectorZ;
  }

  // how do we decide whether or not to set this?
  gMercProfiles[ubCharNum].fUseProfileInsertionInfo = TRUE;
  gMercProfiles[ubCharNum].ubMiscFlags3 |= PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE;

  // Add this guy to CIV team!
  pNewSoldier = ChangeSoldierTeam(pSoldier, CIV_TEAM);

  UpdateTeamPanelAssignments();

  return TRUE;
}

function WhichBuddy(ubCharNum: UINT8, ubBuddy: UINT8): INT8 {
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let bLoop: INT8;

  pProfile = addressof(gMercProfiles[ubCharNum]);

  for (bLoop = 0; bLoop < 3; bLoop++) {
    if (pProfile.value.bBuddy[bLoop] == ubBuddy) {
      return bLoop;
    }
  }
  return -1;
}

function WhichHated(ubCharNum: UINT8, ubHated: UINT8): INT8 {
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let bLoop: INT8;

  pProfile = addressof(gMercProfiles[ubCharNum]);

  for (bLoop = 0; bLoop < 3; bLoop++) {
    if (pProfile.value.bHated[bLoop] == ubHated) {
      return bLoop;
    }
  }
  return -1;
}

function IsProfileATerrorist(ubProfile: UINT8): BOOLEAN {
  if (ubProfile == 83 || ubProfile == 111 || ubProfile == 64 || ubProfile == 112 || ubProfile == 82 || ubProfile == 110) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function IsProfileAHeadMiner(ubProfile: UINT8): BOOLEAN {
  if (ubProfile == 106 || ubProfile == 148 || ubProfile == 156 || ubProfile == 157 || ubProfile == 158) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function UpdateSoldierPointerDataIntoProfile(fPlayerMercs: BOOLEAN): void {
  let uiCount: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let fDoCopy: BOOLEAN = FALSE;

  for (uiCount = 0; uiCount < guiNumMercSlots; uiCount++) {
    pSoldier = MercSlots[uiCount];

    if (pSoldier != NULL) {
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        fDoCopy = FALSE;

        // If we are above player mercs
        if (fPlayerMercs) {
          if (pSoldier.value.ubProfile < FIRST_RPC) {
            fDoCopy = TRUE;
          }
        } else {
          if (pSoldier.value.ubProfile >= FIRST_RPC) {
            fDoCopy = TRUE;
          }
        }

        if (fDoCopy) {
          // get profile...
          pProfile = addressof(gMercProfiles[pSoldier.value.ubProfile]);

          // Copy....
          pProfile.value.bLife = pSoldier.value.bLife;
          pProfile.value.bLifeMax = pSoldier.value.bLifeMax;
          pProfile.value.bAgility = pSoldier.value.bAgility;
          pProfile.value.bLeadership = pSoldier.value.bLeadership;
          pProfile.value.bDexterity = pSoldier.value.bDexterity;
          pProfile.value.bStrength = pSoldier.value.bStrength;
          pProfile.value.bWisdom = pSoldier.value.bWisdom;
          pProfile.value.bExpLevel = pSoldier.value.bExpLevel;
          pProfile.value.bMarksmanship = pSoldier.value.bMarksmanship;
          pProfile.value.bMedical = pSoldier.value.bMedical;
          pProfile.value.bMechanical = pSoldier.value.bMechanical;
          pProfile.value.bExplosive = pSoldier.value.bExplosive;
          pProfile.value.bScientific = pSoldier.value.bScientific;
        }
      }
    }
  }
}

function DoesMercHaveABuddyOnTheTeam(ubMercID: UINT8): BOOLEAN {
  let ubCnt: UINT8;
  let bBuddyID: INT8;

  // loop through the list of people the merc is buddies with
  for (ubCnt = 0; ubCnt < 3; ubCnt++) {
    // see if the merc has a buddy on the team
    bBuddyID = gMercProfiles[ubMercID].bBuddy[ubCnt];

    // If its not a valid 'buddy'
    if (bBuddyID < 0)
      continue;

    if (IsMercOnTeam(bBuddyID)) {
      if (!IsMercDead(bBuddyID)) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function MercIsHot(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (pSoldier.value.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.value.ubProfile].bPersonalityTrait == Enum270.HEAT_INTOLERANT) {
    if (SectorTemperature(GetWorldMinutesInDay(), pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ) > 0) {
      return TRUE;
    }
  }
  return FALSE;
}

function SwapLarrysProfiles(pSoldier: Pointer<SOLDIERTYPE>): Pointer<SOLDIERTYPE> {
  let ubSrcProfile: UINT8;
  let ubDestProfile: UINT8;
  let pNewProfile: Pointer<MERCPROFILESTRUCT>;

  ubSrcProfile = pSoldier.value.ubProfile;
  if (ubSrcProfile == Enum268.LARRY_NORMAL) {
    ubDestProfile = Enum268.LARRY_DRUNK;
  } else if (ubSrcProfile == Enum268.LARRY_DRUNK) {
    ubDestProfile = Enum268.LARRY_NORMAL;
  } else {
    // I don't think so!
    return pSoldier;
  }

  pNewProfile = addressof(gMercProfiles[ubDestProfile]);
  pNewProfile.value.ubMiscFlags2 = gMercProfiles[ubSrcProfile].ubMiscFlags2;
  pNewProfile.value.ubMiscFlags = gMercProfiles[ubSrcProfile].ubMiscFlags;
  pNewProfile.value.sSectorX = gMercProfiles[ubSrcProfile].sSectorX;
  pNewProfile.value.sSectorY = gMercProfiles[ubSrcProfile].sSectorY;
  pNewProfile.value.uiDayBecomesAvailable = gMercProfiles[ubSrcProfile].uiDayBecomesAvailable;
  pNewProfile.value.usKills = gMercProfiles[ubSrcProfile].usKills;
  pNewProfile.value.usAssists = gMercProfiles[ubSrcProfile].usAssists;
  pNewProfile.value.usShotsFired = gMercProfiles[ubSrcProfile].usShotsFired;
  pNewProfile.value.usShotsHit = gMercProfiles[ubSrcProfile].usShotsHit;
  pNewProfile.value.usBattlesFought = gMercProfiles[ubSrcProfile].usBattlesFought;
  pNewProfile.value.usTimesWounded = gMercProfiles[ubSrcProfile].usTimesWounded;
  pNewProfile.value.usTotalDaysServed = gMercProfiles[ubSrcProfile].usTotalDaysServed;
  pNewProfile.value.bResigned = gMercProfiles[ubSrcProfile].bResigned;
  pNewProfile.value.bActive = gMercProfiles[ubSrcProfile].bActive;
  pNewProfile.value.fUseProfileInsertionInfo = gMercProfiles[ubSrcProfile].fUseProfileInsertionInfo;
  pNewProfile.value.sGridNo = gMercProfiles[ubSrcProfile].sGridNo;
  pNewProfile.value.ubQuoteActionID = gMercProfiles[ubSrcProfile].ubQuoteActionID;
  pNewProfile.value.ubLastQuoteSaid = gMercProfiles[ubSrcProfile].ubLastQuoteSaid;
  pNewProfile.value.ubStrategicInsertionCode = gMercProfiles[ubSrcProfile].ubStrategicInsertionCode;
  pNewProfile.value.bMercStatus = gMercProfiles[ubSrcProfile].bMercStatus;
  pNewProfile.value.bSectorZ = gMercProfiles[ubSrcProfile].bSectorZ;
  pNewProfile.value.usStrategicInsertionData = gMercProfiles[ubSrcProfile].usStrategicInsertionData;
  pNewProfile.value.sTrueSalary = gMercProfiles[ubSrcProfile].sTrueSalary;
  pNewProfile.value.ubMiscFlags3 = gMercProfiles[ubSrcProfile].ubMiscFlags3;
  pNewProfile.value.ubDaysOfMoraleHangover = gMercProfiles[ubSrcProfile].ubDaysOfMoraleHangover;
  pNewProfile.value.ubNumTimesDrugUseInLifetime = gMercProfiles[ubSrcProfile].ubNumTimesDrugUseInLifetime;
  pNewProfile.value.uiPrecedentQuoteSaid = gMercProfiles[ubSrcProfile].uiPrecedentQuoteSaid;
  pNewProfile.value.sPreCombatGridNo = gMercProfiles[ubSrcProfile].sPreCombatGridNo;

  // CJC: this is causing problems so just skip the transfer of exp...
  /*
          pNewProfile->sLifeGain = gMercProfiles[ ubSrcProfile ].sLifeGain;
          pNewProfile->sAgilityGain = gMercProfiles[ ubSrcProfile ].sAgilityGain;
          pNewProfile->sDexterityGain = gMercProfiles[ ubSrcProfile ].sDexterityGain;
          pNewProfile->sStrengthGain = gMercProfiles[ ubSrcProfile ].sStrengthGain;
          pNewProfile->sLeadershipGain = gMercProfiles[ ubSrcProfile ].sLeadershipGain;
          pNewProfile->sWisdomGain = gMercProfiles[ ubSrcProfile ].sWisdomGain;
          pNewProfile->sExpLevelGain = gMercProfiles[ ubSrcProfile ].sExpLevelGain;
          pNewProfile->sMarksmanshipGain = gMercProfiles[ ubSrcProfile ].sMarksmanshipGain;
          pNewProfile->sMedicalGain = gMercProfiles[ ubSrcProfile ].sMedicalGain;
          pNewProfile->sMechanicGain = gMercProfiles[ ubSrcProfile ].sMechanicGain;
          pNewProfile->sExplosivesGain = gMercProfiles[ ubSrcProfile ].sExplosivesGain;

          pNewProfile->bLifeDelta = gMercProfiles[ ubSrcProfile ].bLifeDelta;
          pNewProfile->bAgilityDelta = gMercProfiles[ ubSrcProfile ].bAgilityDelta;
          pNewProfile->bDexterityDelta = gMercProfiles[ ubSrcProfile ].bDexterityDelta;
          pNewProfile->bStrengthDelta = gMercProfiles[ ubSrcProfile ].bStrengthDelta;
          pNewProfile->bLeadershipDelta = gMercProfiles[ ubSrcProfile ].bLeadershipDelta;
          pNewProfile->bWisdomDelta = gMercProfiles[ ubSrcProfile ].bWisdomDelta;
          pNewProfile->bExpLevelDelta = gMercProfiles[ ubSrcProfile ].bExpLevelDelta;
          pNewProfile->bMarksmanshipDelta = gMercProfiles[ ubSrcProfile ].bMarksmanshipDelta;
          pNewProfile->bMedicalDelta = gMercProfiles[ ubSrcProfile ].bMedicalDelta;
          pNewProfile->bMechanicDelta = gMercProfiles[ ubSrcProfile ].bMechanicDelta;
          pNewProfile->bExplosivesDelta = gMercProfiles[ ubSrcProfile ].bExplosivesDelta;
          */

  memcpy(pNewProfile.value.bInvStatus, gMercProfiles[ubSrcProfile].bInvStatus, sizeof(UINT8) * 19);
  memcpy(pNewProfile.value.bInvStatus, gMercProfiles[ubSrcProfile].bInvStatus, sizeof(UINT8) * 19);
  memcpy(pNewProfile.value.inv, gMercProfiles[ubSrcProfile].inv, sizeof(UINT16) * 19);
  memcpy(pNewProfile.value.bMercTownReputation, gMercProfiles[ubSrcProfile].bMercTownReputation, sizeof(UINT8) * 20);

  // remove face
  DeleteSoldierFace(pSoldier);

  pSoldier.value.ubProfile = ubDestProfile;

  // create new face
  pSoldier.value.iFaceIndex = InitSoldierFace(pSoldier);

  // replace profile in group
  ReplaceSoldierProfileInPlayerGroup(pSoldier.value.ubGroupID, ubSrcProfile, ubDestProfile);

  pSoldier.value.bStrength = pNewProfile.value.bStrength + pNewProfile.value.bStrengthDelta;
  pSoldier.value.bDexterity = pNewProfile.value.bDexterity + pNewProfile.value.bDexterityDelta;
  pSoldier.value.bAgility = pNewProfile.value.bAgility + pNewProfile.value.bAgilityDelta;
  pSoldier.value.bWisdom = pNewProfile.value.bWisdom + pNewProfile.value.bWisdomDelta;
  pSoldier.value.bExpLevel = pNewProfile.value.bExpLevel + pNewProfile.value.bExpLevelDelta;
  pSoldier.value.bLeadership = pNewProfile.value.bLeadership + pNewProfile.value.bLeadershipDelta;

  pSoldier.value.bMarksmanship = pNewProfile.value.bMarksmanship + pNewProfile.value.bMarksmanshipDelta;
  pSoldier.value.bMechanical = pNewProfile.value.bMechanical + pNewProfile.value.bMechanicDelta;
  pSoldier.value.bMedical = pNewProfile.value.bMedical + pNewProfile.value.bMedicalDelta;
  pSoldier.value.bExplosive = pNewProfile.value.bExplosive + pNewProfile.value.bExplosivesDelta;

  if (pSoldier.value.ubProfile == Enum268.LARRY_DRUNK) {
    SetFactTrue(Enum170.FACT_LARRY_CHANGED);
  } else {
    SetFactFalse(Enum170.FACT_LARRY_CHANGED);
  }

  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

  return pSoldier;
}

function DoesNPCOwnBuilding(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): BOOLEAN {
  let ubRoomInfo: UINT8;

  // Get room info
  ubRoomInfo = gubWorldRoomInfo[sGridNo];

  if (ubRoomInfo == NO_ROOM) {
    return FALSE;
  }

  // Are we an NPC?
  if (pSoldier.value.bTeam != CIV_TEAM) {
    return FALSE;
  }

  // OK, check both ranges
  if (ubRoomInfo >= gMercProfiles[pSoldier.value.ubProfile].ubRoomRangeStart[0] && ubRoomInfo <= gMercProfiles[pSoldier.value.ubProfile].ubRoomRangeEnd[0]) {
    return TRUE;
  }

  if (ubRoomInfo >= gMercProfiles[pSoldier.value.ubProfile].ubRoomRangeStart[1] && ubRoomInfo <= gMercProfiles[pSoldier.value.ubProfile].ubRoomRangeEnd[1]) {
    return TRUE;
  }

  return FALSE;
}
