namespace ja2 {

export let gfPotentialTeamChangeDuringDeath: boolean = false;

const MIN_BLINK_FREQ = 3000;
const MIN_EXPRESSION_FREQ = 2000;

export let gMercProfiles: MERCPROFILESTRUCT[] /* [NUM_PROFILES] */ = createArrayFrom(NUM_PROFILES, createMercProfileStruct);

export let gbSkillTraitBonus: INT8[] /* [NUM_SKILLTRAITS] */ = [
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

export let gubTerrorists: UINT8[] /* [NUM_TERRORISTS + 1] */ = [
  Enum268.DRUGGIST,
  Enum268.SLAY,
  Enum268.ANNIE,
  Enum268.CHRIS,
  Enum268.TIFFANY,
  Enum268.T_REX,
  0,
];

export let gubNumTerrorists: UINT8 = 0;

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

export let gsRobotGridNo: INT16;

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

export function LoadMercProfiles(): boolean {
  //	FILE *fptr;
  let fptr: HWFILE;
  let pFileName: string /* Pointer<char> */ = "BINARYDATA\\Prof.dat";
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let uiLoop3: UINT32;
  let usItem: UINT16;
  let usNewGun: UINT16;
  let usAmmo: UINT16;
  let usNewAmmo: UINT16;
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  fptr = FileOpen(pFileName, FILE_ACCESS_READ, false);
  if (!fptr) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("FAILED to LoadMercProfiles from file %s", pFileName));
    return false;
  }

  buffer = Buffer.allocUnsafe(MERC_PROFILE_STRUCT_SIZE);
  for (uiLoop = 0; uiLoop < NUM_PROFILES; uiLoop++) {
    if ((uiNumBytesRead = JA2EncryptedFileRead(fptr, buffer, MERC_PROFILE_STRUCT_SIZE)) === -1) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("FAILED to Read Merc Profiles from File %d %s", uiLoop, pFileName));
      FileClose(fptr);
      return false;
    }

    readMercProfileStruct(gMercProfiles[uiLoop], buffer);

    // if the Dialogue exists for the merc, allow the merc to be hired
    if (DialogueDataFileExistsForProfile(uiLoop, 0, false, null)) {
      gMercProfiles[uiLoop].bMercStatus = 0;
    } else
      gMercProfiles[uiLoop].bMercStatus = MERC_HAS_NO_TEXT_FILE;

    // if the merc has a medical deposit
    if (gMercProfiles[uiLoop].bMedicalDeposit) {
      gMercProfiles[uiLoop].sMedicalDepositAmount = CalcMedicalDeposit(gMercProfiles[uiLoop]);
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
                if (usNewAmmo != NOTHING) {
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
    gMercProfiles[uiLoop].fUseProfileInsertionInfo = false;
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

  gfProfileDataLoaded = true;

  // no better place..heh?.. will load faces for profiles that are 'extern'.....won't have soldiertype instances
  InitalizeStaticExternalNPCFaces();

  // car portrait values
  LoadCarPortraitValues();

  return true;
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
  let fFoundSpot: boolean;
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
        fFoundSpot = false;
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
          fFoundSpot = true;
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

export function MakeRemainingTerroristsTougher(): void {
  let ubRemainingTerrorists: UINT8 = 0;
  let ubLoop: UINT8;
  let usNewItem: UINT16;
  let usOldItem: UINT16;
  let Object: OBJECTTYPE = createObjectType();
  let ubRemainingDifficulty: UINT8;

  for (ubLoop = 0; ubLoop < NUM_TERRORISTS; ubLoop++) {
    if (gMercProfiles[gubTerrorists[ubLoop]].bMercStatus != MERC_IS_DEAD && gMercProfiles[gubTerrorists[ubLoop]].sSectorX != 0 && gMercProfiles[gubTerrorists[ubLoop]].sSectorY != 0) {
      if (gubTerrorists[ubLoop] == Enum268.SLAY) {
        if (FindSoldierByProfileID(Enum268.SLAY, true) != null) {
          // Slay on player's team, doesn't count towards remaining terrorists
          continue;
        }
      }
      ubRemainingTerrorists++;
    }
  }

  ubRemainingDifficulty = Math.trunc(60 / gubNumTerrorists) * (gubNumTerrorists - ubRemainingTerrorists);

  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_MEDIUM:
      ubRemainingDifficulty = Math.trunc((ubRemainingDifficulty * 13) / 10);
      break;
    case Enum9.DIF_LEVEL_HARD:
      ubRemainingDifficulty = Math.trunc((ubRemainingDifficulty * 16) / 10);
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

  DeleteObj(Object);
  Object.usItem = usNewItem;
  Object.bStatus[0] = 100;

  for (ubLoop = 0; ubLoop < NUM_TERRORISTS; ubLoop++) {
    if (gMercProfiles[gubTerrorists[ubLoop]].bMercStatus != MERC_IS_DEAD && gMercProfiles[gubTerrorists[ubLoop]].sSectorX != 0 && gMercProfiles[gubTerrorists[ubLoop]].sSectorY != 0) {
      if (gubTerrorists[ubLoop] == Enum268.SLAY) {
        if (FindSoldierByProfileID(Enum268.SLAY, true) != null) {
          // Slay on player's team, doesn't count towards remaining terrorists
          continue;
        }
      }

      if (usOldItem != NOTHING) {
        RemoveObjectFromSoldierProfile(gubTerrorists[ubLoop], usOldItem);
      }
      PlaceObjectInSoldierProfile(gubTerrorists[ubLoop], Object);
    }
  }
}

export function DecideOnAssassin(): void {
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

export function MakeRemainingAssassinsTougher(): void {
  let ubRemainingAssassins: UINT8 = 0;
  let ubLoop: UINT8;
  let usNewItem: UINT16;
  let usOldItem: UINT16;
  let Object: OBJECTTYPE = createObjectType();
  let ubRemainingDifficulty: UINT8;

  for (ubLoop = 0; ubLoop < NUM_ASSASSINS; ubLoop++) {
    if (gMercProfiles[gubAssassins[ubLoop]].bMercStatus != MERC_IS_DEAD) {
      ubRemainingAssassins++;
    }
  }

  ubRemainingDifficulty = Math.trunc(60 / NUM_ASSASSINS) * (NUM_ASSASSINS - ubRemainingAssassins);

  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_MEDIUM:
      ubRemainingDifficulty = Math.trunc((ubRemainingDifficulty * 13) / 10);
      break;
    case Enum9.DIF_LEVEL_HARD:
      ubRemainingDifficulty = Math.trunc((ubRemainingDifficulty * 16) / 10);
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

  DeleteObj(Object);
  Object.usItem = usNewItem;
  Object.bStatus[0] = 100;

  for (ubLoop = 0; ubLoop < NUM_ASSASSINS; ubLoop++) {
    if (gMercProfiles[gubAssassins[ubLoop]].bMercStatus != MERC_IS_DEAD) {
      if (usOldItem != NOTHING) {
        RemoveObjectFromSoldierProfile(gubAssassins[ubLoop], usOldItem);
      }
      PlaceObjectInSoldierProfile(gubAssassins[ubLoop], Object);
    }
  }
}

function StartSomeMercsOnAssignment(): void {
  let uiCnt: UINT32;
  let pProfile: MERCPROFILESTRUCT;
  let uiChance: UINT32;

  // some randomly picked A.I.M. mercs will start off "on assignment" at the beginning of each new game
  for (uiCnt = 0; uiCnt < AIM_AND_MERC_MERCS; uiCnt++) {
    pProfile = gMercProfiles[uiCnt];

    // calc chance to start on assignment
    uiChance = 5 * pProfile.bExpLevel;

    if (Random(100) < uiChance) {
      pProfile.bMercStatus = MERC_WORKING_ELSEWHERE;
      pProfile.uiDayBecomesAvailable = 1 + Random(6 + Math.trunc(pProfile.bExpLevel / 2)); // 1-(6 to 11) days
    } else {
      pProfile.bMercStatus = MERC_OK;
      pProfile.uiDayBecomesAvailable = 0;
    }

    pProfile.uiPrecedentQuoteSaid = 0;
    pProfile.ubDaysOfMoraleHangover = 0;
  }
}

export function SetProfileFaceData(ubCharNum: UINT8, ubFaceIndex: UINT8, usEyesX: UINT16, usEyesY: UINT16, usMouthX: UINT16, usMouthY: UINT16): void {
  gMercProfiles[ubCharNum].ubFaceIndex = ubFaceIndex;
  gMercProfiles[ubCharNum].usEyesX = usEyesX;
  gMercProfiles[ubCharNum].usEyesY = usEyesY;
  gMercProfiles[ubCharNum].usMouthX = usMouthX;
  gMercProfiles[ubCharNum].usMouthY = usMouthY;
}

function CalcCompetence(pProfile: MERCPROFILESTRUCT): UINT16 {
  let uiStats: UINT32;
  let uiSkills: UINT32;
  let uiActionPoints: UINT32;
  let uiSpecialSkills: UINT32;
  let usCompetence: UINT16;

  // count life twice 'cause it's also hit points
  // mental skills are halved 'cause they're actually not that important within the game
  uiStats = Math.trunc(((2 * pProfile.bLifeMax) + pProfile.bStrength + pProfile.bAgility + pProfile.bDexterity + Math.trunc((pProfile.bLeadership + pProfile.bWisdom) / 2)) / 3);

  // marksmanship is very important, count it double
  uiSkills = Math.trunc(((2 * (Math.pow(pProfile.bMarksmanship, 3) / 10000)) + 1.5 * (Math.pow(pProfile.bMedical, 3) / 10000) + (Math.pow(pProfile.bMechanical, 3) / 10000) + (Math.pow(pProfile.bExplosive, 3) / 10000)));

  // action points
  uiActionPoints = 5 + Math.trunc(((10 * pProfile.bExpLevel + 3 * pProfile.bAgility + 2 * pProfile.bLifeMax + 2 * pProfile.bDexterity) + 20) / 40);

  // count how many he has, don't care what they are
  uiSpecialSkills = ((pProfile.bSkillTrait != 0) ? 1 : 0) + ((pProfile.bSkillTrait2 != 0) ? 1 : 0);

  usCompetence = Math.trunc((Math.pow(pProfile.bExpLevel, 0.2) * uiStats * uiSkills * (uiActionPoints - 6) * (1 + (0.05 * uiSpecialSkills))) / 1000);

  // this currently varies from about 10 (Flo) to 1200 (Gus)
  return usCompetence;
}

function CalcMedicalDeposit(pProfile: MERCPROFILESTRUCT): INT16 {
  let usDeposit: UINT16;

  // this rounds off to the nearest hundred
  usDeposit = Math.trunc(((5 * CalcCompetence(pProfile)) + 50) / 100) * 100;

  return usDeposit;
}

export function FindSoldierByProfileID(ubProfileID: UINT8, fPlayerMercsOnly: boolean): SOLDIERTYPE | null {
  let ubLoop: UINT8;
  let ubLoopLimit: UINT8;
  let pSoldier: SOLDIERTYPE;

  if (fPlayerMercsOnly) {
    ubLoopLimit = gTacticalStatus.Team[0].bLastID;
  } else {
    ubLoopLimit = MAX_NUM_SOLDIERS;
  }

  for (ubLoop = 0, pSoldier = MercPtrs[0]; ubLoop < ubLoopLimit; ubLoop++, pSoldier = MercPtrs[ubLoop]) {
    if (pSoldier.bActive && pSoldier.ubProfile == ubProfileID) {
      return pSoldier;
    }
  }
  return null;
}

export function ChangeSoldierTeam(pSoldier: SOLDIERTYPE, ubTeam: UINT8): SOLDIERTYPE {
  let ubID: UINT8;
  let pNewSoldier: SOLDIERTYPE = <SOLDIERTYPE><unknown>null;
  let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let cnt: UINT32;
  let sOldGridNo: INT16;

  let ubOldID: UINT8;
  let uiOldUniqueId: UINT32;

  let uiSlot: UINT32;
  let pGroupMember: SOLDIERTYPE;

  if (gfInTalkPanel) {
    DeleteTalkingMenu();
  }

  // Save merc id for this guy...
  ubID = pSoldier.ubID;

  ubOldID = ubID;
  uiOldUniqueId = pSoldier.uiUniqueSoldierIdValue;

  sOldGridNo = pSoldier.sGridNo;

  // Remove him from the game!
  InternalTacticalRemoveSoldier(ubID, false);

  // Create a new one!
  MercCreateStruct.bTeam = ubTeam;
  MercCreateStruct.ubProfile = pSoldier.ubProfile;
  MercCreateStruct.bBodyType = pSoldier.ubBodyType;
  MercCreateStruct.sSectorX = pSoldier.sSectorX;
  MercCreateStruct.sSectorY = pSoldier.sSectorY;
  MercCreateStruct.bSectorZ = pSoldier.bSectorZ;
  MercCreateStruct.sInsertionGridNo = pSoldier.sGridNo;
  MercCreateStruct.bDirection = pSoldier.bDirection;

  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    MercCreateStruct.ubProfile = NO_PROFILE;
    MercCreateStruct.fUseGivenVehicle = true;
    MercCreateStruct.bUseGivenVehicleID = pSoldier.bVehicleID;
  }

  if (ubTeam == gbPlayerNum) {
    MercCreateStruct.fPlayerMerc = true;
  }

  if (TacticalCreateSoldier(MercCreateStruct, createPointer(() => ubID, (v) => ubID = v))) {
    pNewSoldier = MercPtrs[ubID];

    // Copy vital stats back!
    pNewSoldier.bLife = pSoldier.bLife;
    pNewSoldier.bLifeMax = pSoldier.bLifeMax;
    pNewSoldier.bAgility = pSoldier.bAgility;
    pNewSoldier.bLeadership = pSoldier.bLeadership;
    pNewSoldier.bDexterity = pSoldier.bDexterity;
    pNewSoldier.bStrength = pSoldier.bStrength;
    pNewSoldier.bWisdom = pSoldier.bWisdom;
    pNewSoldier.bExpLevel = pSoldier.bExpLevel;
    pNewSoldier.bMarksmanship = pSoldier.bMarksmanship;
    pNewSoldier.bMedical = pSoldier.bMedical;
    pNewSoldier.bMechanical = pSoldier.bMechanical;
    pNewSoldier.bExplosive = pSoldier.bExplosive;
    pNewSoldier.bScientific = pSoldier.bScientific;
    pNewSoldier.bLastRenderVisibleValue = pSoldier.bLastRenderVisibleValue;
    pNewSoldier.bVisible = pSoldier.bVisible;

    if (ubTeam == gbPlayerNum) {
      pNewSoldier.bVisible = 1;
    }

    // Copy over any items....
    for (cnt = 0; cnt < Enum261.NUM_INV_SLOTS; cnt++) {
      pNewSoldier.inv[cnt] = pSoldier.inv[cnt];
    }

    // OK, loop through all active merc slots, change
    // Change ANY attacker's target if they were once on this guy.....
    for (uiSlot = 0; uiSlot < guiNumMercSlots; uiSlot++) {
      pGroupMember = MercSlots[uiSlot];

      if (pGroupMember != null) {
        if (pGroupMember.ubTargetID == pSoldier.ubID) {
          pGroupMember.ubTargetID = pNewSoldier.ubID;
        }
      }
    }

    // Set insertion gridNo
    pNewSoldier.sInsertionGridNo = sOldGridNo;

    if (gfPotentialTeamChangeDuringDeath) {
      HandleCheckForDeathCommonCode(pSoldier);
    }

    if (gfWorldLoaded && pSoldier.bInSector
        // pSoldier->sSectorX == gWorldSectorX && pSoldier->sSectorY == gWorldSectorY && pSoldier->bSectorZ == gbWorldSectorZ
    ) {
      AddSoldierToSectorNoCalculateDirectionUseAnimation(ubID, pSoldier.usAnimState, pSoldier.usAniCode);
      HandleSight(pNewSoldier, SIGHT_LOOK | SIGHT_RADIO);
    }

    // fix up the event queue...
    //	ChangeSoldierIDInQueuedEvents( ubOldID, uiOldUniqueId, pNewSoldier->ubID, pNewSoldier->uiUniqueSoldierIdValue );

    if (pNewSoldier.ubProfile != NO_PROFILE) {
      if (ubTeam == gbPlayerNum) {
        gMercProfiles[pNewSoldier.ubProfile].ubMiscFlags |= PROFILE_MISC_FLAG_RECRUITED;
      } else {
        gMercProfiles[pNewSoldier.ubProfile].ubMiscFlags &= (~PROFILE_MISC_FLAG_RECRUITED);
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

export function RecruitRPC(ubCharNum: UINT8): boolean {
  let pSoldier: SOLDIERTYPE | null;
  let pNewSoldier: SOLDIERTYPE;

  // Get soldier pointer
  pSoldier = FindSoldierByProfileID(ubCharNum, false);

  if (!pSoldier) {
    return false;
  }

  // OK, set recruit flag..
  gMercProfiles[ubCharNum].ubMiscFlags |= PROFILE_MISC_FLAG_RECRUITED;

  // Add this guy to our team!
  pNewSoldier = ChangeSoldierTeam(pSoldier, gbPlayerNum);

  // handle set up any RPC's that will leave us in time
  if (ubCharNum == Enum268.SLAY) {
    // slay will leave in a week
    pNewSoldier.iEndofContractTime = GetWorldTotalMin() + (7 * 24 * 60);

    KickOutWheelchair(pNewSoldier);
  } else if (ubCharNum == Enum268.DYNAMO && gubQuest[Enum169.QUEST_FREE_DYNAMO] == QUESTINPROGRESS) {
    EndQuest(Enum169.QUEST_FREE_DYNAMO, pSoldier.sSectorX, pSoldier.sSectorY);
  }
  // handle town loyalty adjustment
  HandleTownLoyaltyForNPCRecruitment(pNewSoldier);

  // Try putting them into the current squad
  if (AddCharacterToSquad(pNewSoldier, CurrentSquad()) == false) {
    AddCharacterToAnySquad(pNewSoldier);
  }

  ResetDeadSquadMemberList(pNewSoldier.bAssignment);

  DirtyMercPanelInterface(pNewSoldier, DIRTYLEVEL2);

  if (pNewSoldier.inv[Enum261.HANDPOS].usItem == NOTHING) {
    // empty handed - swap in first available weapon
    let bSlot: INT8;

    bSlot = FindObjClass(pNewSoldier, IC_WEAPON);
    if (bSlot != NO_SLOT) {
      if (Item[pNewSoldier.inv[bSlot].usItem].fFlags & ITEM_TWO_HANDED) {
        if (bSlot != Enum261.SECONDHANDPOS && pNewSoldier.inv[Enum261.SECONDHANDPOS].usItem != NOTHING) {
          // need to move second hand item out first
          AutoPlaceObject(pNewSoldier, pNewSoldier.inv[Enum261.SECONDHANDPOS], false);
        }
      }
      // swap item to hand
      SwapObjs(pNewSoldier.inv[bSlot], pNewSoldier.inv[Enum261.HANDPOS]);
    }
  }

  if (ubCharNum == Enum268.IRA) {
    // trigger 0th PCscript line
    TriggerNPCRecord(Enum268.IRA, 0);
  }

  // Set whatkind of merc am i
  pNewSoldier.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__NPC;

  //
  // add a history log that tells the user that a npc has joined the team
  //
  // ( pass in pNewSoldier->sSectorX cause if its invalid, -1, n/a will appear as the sector in the history log )
  AddHistoryToPlayersLog(Enum83.HISTORY_RPC_JOINED_TEAM, pNewSoldier.ubProfile, GetWorldTotalMin(), pNewSoldier.sSectorX, pNewSoldier.sSectorY);

  // remove the merc from the Personnel screens departed list ( if they have never been hired before, its ok to call it )
  RemoveNewlyHiredMercFromPersonnelDepartedList(pSoldier.ubProfile);

  return true;
}

export function RecruitEPC(ubCharNum: UINT8): boolean {
  let pSoldier: SOLDIERTYPE | null;
  let pNewSoldier: SOLDIERTYPE;

  // Get soldier pointer
  pSoldier = FindSoldierByProfileID(ubCharNum, false);

  if (!pSoldier) {
    return false;
  }

  // OK, set recruit flag..
  gMercProfiles[ubCharNum].ubMiscFlags |= PROFILE_MISC_FLAG_EPCACTIVE;

  gMercProfiles[ubCharNum].ubMiscFlags3 &= ~PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE;

  // Add this guy to our team!
  pNewSoldier = ChangeSoldierTeam(pSoldier, gbPlayerNum);
  pNewSoldier.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__EPC;

  // Try putting them into the current squad
  if (AddCharacterToSquad(pNewSoldier, CurrentSquad()) == false) {
    AddCharacterToAnySquad(pNewSoldier);
  }

  ResetDeadSquadMemberList(pNewSoldier.bAssignment);

  DirtyMercPanelInterface(pNewSoldier, DIRTYLEVEL2);
  // Make the interface panel dirty..
  // This will dirty the panel next frame...
  gfRerenderInterfaceFromHelpText = true;

  // If we are a robot, look to update controller....
  if (pNewSoldier.uiStatusFlags & SOLDIER_ROBOT) {
    UpdateRobotControllerGivenRobot(pNewSoldier);
  }

  // Set whatkind of merc am i
  pNewSoldier.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__EPC;

  UpdateTeamPanelAssignments();

  return true;
}

export function UnRecruitEPC(ubCharNum: UINT8): boolean {
  let pSoldier: SOLDIERTYPE | null;
  let pNewSoldier: SOLDIERTYPE;

  // Get soldier pointer
  pSoldier = FindSoldierByProfileID(ubCharNum, false);

  if (!pSoldier) {
    return false;
  }

  if (pSoldier.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__EPC) {
    return false;
  }

  if (pSoldier.bAssignment < Enum117.ON_DUTY) {
    ResetDeadSquadMemberList(pSoldier.bAssignment);
  }

  // Rmeove from squad....
  RemoveCharacterFromSquads(pSoldier);

  // O< check if this is the only guy in the sector....
  if (gusSelectedSoldier == pSoldier.ubID) {
    gusSelectedSoldier = NOBODY;
  }

  // OK, UN set recruit flag..
  gMercProfiles[ubCharNum].ubMiscFlags &= (~PROFILE_MISC_FLAG_EPCACTIVE);

  // update sector values to current

  // check to see if this person should disappear from the map after this
  if ((ubCharNum == Enum268.JOHN || ubCharNum == Enum268.MARY) && pSoldier.sSectorX == 13 && pSoldier.sSectorY == MAP_ROW_B && pSoldier.bSectorZ == 0) {
    gMercProfiles[ubCharNum].sSectorX = 0;
    gMercProfiles[ubCharNum].sSectorY = 0;
    gMercProfiles[ubCharNum].bSectorZ = 0;
  } else {
    gMercProfiles[ubCharNum].sSectorX = pSoldier.sSectorX;
    gMercProfiles[ubCharNum].sSectorY = pSoldier.sSectorY;
    gMercProfiles[ubCharNum].bSectorZ = pSoldier.bSectorZ;
  }

  // how do we decide whether or not to set this?
  gMercProfiles[ubCharNum].fUseProfileInsertionInfo = true;
  gMercProfiles[ubCharNum].ubMiscFlags3 |= PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE;

  // Add this guy to CIV team!
  pNewSoldier = ChangeSoldierTeam(pSoldier, CIV_TEAM);

  UpdateTeamPanelAssignments();

  return true;
}

export function WhichBuddy(ubCharNum: UINT8, ubBuddy: UINT8): INT8 {
  let pProfile: MERCPROFILESTRUCT;
  let bLoop: INT8;

  pProfile = gMercProfiles[ubCharNum];

  for (bLoop = 0; bLoop < 3; bLoop++) {
    if (pProfile.bBuddy[bLoop] == ubBuddy) {
      return bLoop;
    }
  }
  return -1;
}

export function WhichHated(ubCharNum: UINT8, ubHated: UINT8): INT8 {
  let pProfile: MERCPROFILESTRUCT;
  let bLoop: INT8;

  pProfile = gMercProfiles[ubCharNum];

  for (bLoop = 0; bLoop < 3; bLoop++) {
    if (pProfile.bHated[bLoop] == ubHated) {
      return bLoop;
    }
  }
  return -1;
}

export function IsProfileATerrorist(ubProfile: UINT8): boolean {
  if (ubProfile == 83 || ubProfile == 111 || ubProfile == 64 || ubProfile == 112 || ubProfile == 82 || ubProfile == 110) {
    return true;
  } else {
    return false;
  }
}

export function IsProfileAHeadMiner(ubProfile: UINT8): boolean {
  if (ubProfile == 106 || ubProfile == 148 || ubProfile == 156 || ubProfile == 157 || ubProfile == 158) {
    return true;
  } else {
    return false;
  }
}

export function UpdateSoldierPointerDataIntoProfile(fPlayerMercs: boolean): void {
  let uiCount: UINT32;
  let pSoldier: SOLDIERTYPE | null;
  let pProfile: MERCPROFILESTRUCT;
  let fDoCopy: boolean = false;

  for (uiCount = 0; uiCount < guiNumMercSlots; uiCount++) {
    pSoldier = MercSlots[uiCount];

    if (pSoldier != null) {
      if (pSoldier.ubProfile != NO_PROFILE) {
        fDoCopy = false;

        // If we are above player mercs
        if (fPlayerMercs) {
          if (pSoldier.ubProfile < FIRST_RPC) {
            fDoCopy = true;
          }
        } else {
          if (pSoldier.ubProfile >= FIRST_RPC) {
            fDoCopy = true;
          }
        }

        if (fDoCopy) {
          // get profile...
          pProfile = gMercProfiles[pSoldier.ubProfile];

          // Copy....
          pProfile.bLife = pSoldier.bLife;
          pProfile.bLifeMax = pSoldier.bLifeMax;
          pProfile.bAgility = pSoldier.bAgility;
          pProfile.bLeadership = pSoldier.bLeadership;
          pProfile.bDexterity = pSoldier.bDexterity;
          pProfile.bStrength = pSoldier.bStrength;
          pProfile.bWisdom = pSoldier.bWisdom;
          pProfile.bExpLevel = pSoldier.bExpLevel;
          pProfile.bMarksmanship = pSoldier.bMarksmanship;
          pProfile.bMedical = pSoldier.bMedical;
          pProfile.bMechanical = pSoldier.bMechanical;
          pProfile.bExplosive = pSoldier.bExplosive;
          pProfile.bScientific = pSoldier.bScientific;
        }
      }
    }
  }
}

export function DoesMercHaveABuddyOnTheTeam(ubMercID: UINT8): boolean {
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
        return true;
      }
    }
  }

  return false;
}

function MercIsHot(pSoldier: SOLDIERTYPE): boolean {
  if (pSoldier.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.ubProfile].bPersonalityTrait == Enum270.HEAT_INTOLERANT) {
    if (SectorTemperature(GetWorldMinutesInDay(), pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ) > 0) {
      return true;
    }
  }
  return false;
}

export function SwapLarrysProfiles(pSoldier: SOLDIERTYPE): SOLDIERTYPE {
  let ubSrcProfile: UINT8;
  let ubDestProfile: UINT8;
  let pNewProfile: MERCPROFILESTRUCT;

  ubSrcProfile = pSoldier.ubProfile;
  if (ubSrcProfile == Enum268.LARRY_NORMAL) {
    ubDestProfile = Enum268.LARRY_DRUNK;
  } else if (ubSrcProfile == Enum268.LARRY_DRUNK) {
    ubDestProfile = Enum268.LARRY_NORMAL;
  } else {
    // I don't think so!
    return pSoldier;
  }

  pNewProfile = gMercProfiles[ubDestProfile];
  pNewProfile.ubMiscFlags2 = gMercProfiles[ubSrcProfile].ubMiscFlags2;
  pNewProfile.ubMiscFlags = gMercProfiles[ubSrcProfile].ubMiscFlags;
  pNewProfile.sSectorX = gMercProfiles[ubSrcProfile].sSectorX;
  pNewProfile.sSectorY = gMercProfiles[ubSrcProfile].sSectorY;
  pNewProfile.uiDayBecomesAvailable = gMercProfiles[ubSrcProfile].uiDayBecomesAvailable;
  pNewProfile.usKills = gMercProfiles[ubSrcProfile].usKills;
  pNewProfile.usAssists = gMercProfiles[ubSrcProfile].usAssists;
  pNewProfile.usShotsFired = gMercProfiles[ubSrcProfile].usShotsFired;
  pNewProfile.usShotsHit = gMercProfiles[ubSrcProfile].usShotsHit;
  pNewProfile.usBattlesFought = gMercProfiles[ubSrcProfile].usBattlesFought;
  pNewProfile.usTimesWounded = gMercProfiles[ubSrcProfile].usTimesWounded;
  pNewProfile.usTotalDaysServed = gMercProfiles[ubSrcProfile].usTotalDaysServed;
  pNewProfile.bResigned = gMercProfiles[ubSrcProfile].bResigned;
  pNewProfile.bActive = gMercProfiles[ubSrcProfile].bActive;
  pNewProfile.fUseProfileInsertionInfo = gMercProfiles[ubSrcProfile].fUseProfileInsertionInfo;
  pNewProfile.sGridNo = gMercProfiles[ubSrcProfile].sGridNo;
  pNewProfile.ubQuoteActionID = gMercProfiles[ubSrcProfile].ubQuoteActionID;
  pNewProfile.ubLastQuoteSaid = gMercProfiles[ubSrcProfile].ubLastQuoteSaid;
  pNewProfile.ubStrategicInsertionCode = gMercProfiles[ubSrcProfile].ubStrategicInsertionCode;
  pNewProfile.bMercStatus = gMercProfiles[ubSrcProfile].bMercStatus;
  pNewProfile.bSectorZ = gMercProfiles[ubSrcProfile].bSectorZ;
  pNewProfile.usStrategicInsertionData = gMercProfiles[ubSrcProfile].usStrategicInsertionData;
  pNewProfile.sTrueSalary = gMercProfiles[ubSrcProfile].sTrueSalary;
  pNewProfile.ubMiscFlags3 = gMercProfiles[ubSrcProfile].ubMiscFlags3;
  pNewProfile.ubDaysOfMoraleHangover = gMercProfiles[ubSrcProfile].ubDaysOfMoraleHangover;
  pNewProfile.ubNumTimesDrugUseInLifetime = gMercProfiles[ubSrcProfile].ubNumTimesDrugUseInLifetime;
  pNewProfile.uiPrecedentQuoteSaid = gMercProfiles[ubSrcProfile].uiPrecedentQuoteSaid;
  pNewProfile.sPreCombatGridNo = gMercProfiles[ubSrcProfile].sPreCombatGridNo;

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

  copyArray(pNewProfile.bInvStatus, gMercProfiles[ubSrcProfile].bInvStatus);
  copyArray(pNewProfile.bInvStatus, gMercProfiles[ubSrcProfile].bInvStatus);
  copyArray(pNewProfile.inv, gMercProfiles[ubSrcProfile].inv);
  copyArray(pNewProfile.bMercTownReputation, gMercProfiles[ubSrcProfile].bMercTownReputation);

  // remove face
  DeleteSoldierFace(pSoldier);

  pSoldier.ubProfile = ubDestProfile;

  // create new face
  pSoldier.iFaceIndex = InitSoldierFace(pSoldier);

  // replace profile in group
  ReplaceSoldierProfileInPlayerGroup(pSoldier.ubGroupID, ubSrcProfile, ubDestProfile);

  pSoldier.bStrength = pNewProfile.bStrength + pNewProfile.bStrengthDelta;
  pSoldier.bDexterity = pNewProfile.bDexterity + pNewProfile.bDexterityDelta;
  pSoldier.bAgility = pNewProfile.bAgility + pNewProfile.bAgilityDelta;
  pSoldier.bWisdom = pNewProfile.bWisdom + pNewProfile.bWisdomDelta;
  pSoldier.bExpLevel = pNewProfile.bExpLevel + pNewProfile.bExpLevelDelta;
  pSoldier.bLeadership = pNewProfile.bLeadership + pNewProfile.bLeadershipDelta;

  pSoldier.bMarksmanship = pNewProfile.bMarksmanship + pNewProfile.bMarksmanshipDelta;
  pSoldier.bMechanical = pNewProfile.bMechanical + pNewProfile.bMechanicDelta;
  pSoldier.bMedical = pNewProfile.bMedical + pNewProfile.bMedicalDelta;
  pSoldier.bExplosive = pNewProfile.bExplosive + pNewProfile.bExplosivesDelta;

  if (pSoldier.ubProfile == Enum268.LARRY_DRUNK) {
    SetFactTrue(Enum170.FACT_LARRY_CHANGED);
  } else {
    SetFactFalse(Enum170.FACT_LARRY_CHANGED);
  }

  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

  return pSoldier;
}

export function DoesNPCOwnBuilding(pSoldier: SOLDIERTYPE, sGridNo: INT16): boolean {
  let ubRoomInfo: UINT8;

  // Get room info
  ubRoomInfo = gubWorldRoomInfo[sGridNo];

  if (ubRoomInfo == NO_ROOM) {
    return false;
  }

  // Are we an NPC?
  if (pSoldier.bTeam != CIV_TEAM) {
    return false;
  }

  // OK, check both ranges
  if (ubRoomInfo >= gMercProfiles[pSoldier.ubProfile].ubRoomRangeStart[0] && ubRoomInfo <= gMercProfiles[pSoldier.ubProfile].ubRoomRangeEnd[0]) {
    return true;
  }

  if (ubRoomInfo >= gMercProfiles[pSoldier.ubProfile].ubRoomRangeStart[1] && ubRoomInfo <= gMercProfiles[pSoldier.ubProfile].ubRoomRangeEnd[1]) {
    return true;
  }

  return false;
}

}
