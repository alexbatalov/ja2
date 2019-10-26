namespace ja2 {

// how many times should a 'die' be rolled for skills of the same type?

const HOW_MANY_ROLLS_FOR_SAME_SKILL_CHECK = 20;

let AttitudeList: INT32[] /* [ATTITUDE_LIST_SIZE] */;
let iLastElementInAttitudeList: INT32 = 0;

let SkillsList: INT32[] /* [ATTITUDE_LIST_SIZE] */;
let BackupSkillsList: INT32[] /* [ATTITUDE_LIST_SIZE] */;
let iLastElementInSkillsList: INT32 = 0;

let PersonalityList: INT32[] /* [ATTITUDE_LIST_SIZE] */;
let iLastElementInPersonalityList: INT32 = 0;

// positions of the face x and y for eyes and mouth for the 10 portraits
let sFacePositions: INT16[][] /* [NUMBER_OF_PLAYER_PORTRAITS][4] */ = [
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
];

export let pPlayerSelectedFaceFileNames: STR8[] /* [NUMBER_OF_PLAYER_PORTRAITS] */ = [
  "Faces\\200.sti",
  "Faces\\201.sti",
  "Faces\\202.sti",
  "Faces\\203.sti",
  "Faces\\204.sti",
  "Faces\\205.sti",
  "Faces\\206.sti",
  "Faces\\207.sti",
  "Faces\\208.sti",
  "Faces\\209.sti",
  "Faces\\210.sti",
  "Faces\\211.sti",
  "Faces\\212.sti",
  "Faces\\213.sti",
  "Faces\\214.sti",
  "Faces\\215.sti",
];

export let pPlayerSelectedBigFaceFileNames: STR8[] /* [NUMBER_OF_PLAYER_PORTRAITS] */ = [
  "Faces\\BigFaces\\200.sti",
  "Faces\\BigFaces\\201.sti",
  "Faces\\BigFaces\\202.sti",
  "Faces\\BigFaces\\203.sti",
  "Faces\\BigFaces\\204.sti",
  "Faces\\BigFaces\\205.sti",
  "Faces\\BigFaces\\206.sti",
  "Faces\\BigFaces\\207.sti",
  "Faces\\BigFaces\\208.sti",
  "Faces\\BigFaces\\209.sti",
  "Faces\\BigFaces\\210.sti",
  "Faces\\BigFaces\\211.sti",
  "Faces\\BigFaces\\212.sti",
  "Faces\\BigFaces\\213.sti",
  "Faces\\BigFaces\\214.sti",
  "Faces\\BigFaces\\215.sti",
];

export function CreateACharacterFromPlayerEnteredStats(): void {
  // copy over full name
  wcscpy(gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].zName, pFullName);

  // the nickname
  wcscpy(gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].zNickname, pNickName);

  // gender
  if (fCharacterIsMale == true) {
    // male
    gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSex = Enum272.MALE;
  } else {
    // female
    gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSex = Enum272.FEMALE;
  }

  // attributes
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLifeMax = iHealth;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLife = iHealth;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bAgility = iAgility;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bStrength = iStrength;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bDexterity = iDexterity;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bWisdom = iWisdom;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLeadership = iLeadership;

  // skills
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMarksmanship = iMarksmanship;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMedical = iMedical;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMechanical = iMechanical;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bExplosive = iExplosives;

  // personality
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bPersonalityTrait = iPersonality;

  // attitude
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bAttitude = iAttitude;

  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bExpLevel = 1;

  // set time away
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMercStatus = 0;

  // face
  SelectMercFace();

  return;
}

function DoesCharacterHaveAnAttitude(): boolean {
  // simply checks if caracter has an attitude other than normal
  switch (iAttitude) {
    case Enum271.ATT_LONER:
    case Enum271.ATT_PESSIMIST:
    case Enum271.ATT_ARROGANT:
    case Enum271.ATT_BIG_SHOT:
    case Enum271.ATT_ASSHOLE:
    case Enum271.ATT_COWARD:
      return true;
    default:
      return false;
  }
}

function DoesCharacterHaveAPersoanlity(): boolean {
  // only one we can get is PSYCHO, and that is not much of a penalty
  return false;
  /*
  // simply checks if caracter has a personality other than normal
if( iPersonality != NO_PERSONALITYTRAIT )
  {
          // yep
    return ( TRUE );
  }
  else
  {
          // nope
          return ( FALSE );
  }
  */
}

function CreatePlayerAttitude(): void {
  // this function will 'roll a die' and decide if any attitude does exists
  let iDiceValue: INT32 = 0;
  let iCounter: INT32 = 0;
  let iCounter2: INT32 = 0;

  let iAttitudeHits: INT32[] /* [NUM_ATTITUDES] */ = [ 0 ];
  let iHighestHits: INT32 = 0;
  let iNumAttitudesWithHighestHits: INT32 = 0;

  iAttitude = Enum271.ATT_NORMAL;

  if (iLastElementInAttitudeList == 0) {
    return;
  }

  // count # of hits for each attitude
  for (iCounter = 0; iCounter < iLastElementInAttitudeList; iCounter++) {
    iAttitudeHits[AttitudeList[iCounter]]++;
  }

  // find highest # of hits for any attitude
  for (iCounter = 0; iCounter < Enum271.NUM_ATTITUDES; iCounter++) {
    if (iAttitudeHits[iCounter]) {
      if (iAttitudeHits[iCounter] > iHighestHits) {
        iHighestHits = Math.max(iHighestHits, iAttitudeHits[iCounter]);
        iNumAttitudesWithHighestHits = 1;
      } else if (iAttitudeHits[iCounter] == iHighestHits) {
        iNumAttitudesWithHighestHits++;
      }
    }
  }

  // roll dice
  iDiceValue = Random(iNumAttitudesWithHighestHits + 1);

  // find attitude
  for (iCounter = 0; iCounter < Enum271.NUM_ATTITUDES; iCounter++) {
    if (iAttitudeHits[iCounter] == iHighestHits) {
      if (iCounter2 == iDiceValue) {
        // this is it!
        iAttitude = iCounter2;
        break;
      } else {
        // one of the next attitudes...
        iCounter2++;
      }
    }
  }

  /*
          iAttitude = ATT_NORMAL;
          // set attitude
          if ( ( AttitudeList[ iDiceValue ] == ATT_LONER )||( AttitudeList[ iDiceValue ] > ATT_OPTIMIST ) )
          {
                  for ( iCounter = 0; iCounter < iLastElementInAttitudeList; iCounter++ )
                  {
                          if ( iCounter != iDiceValue )
                          {
                                  if ( AttitudeList[ iCounter ] == AttitudeList[ iDiceValue ] )
                                  {
            iAttitude = AttitudeList[ iDiceValue ];
                                  }
                          }
                  }
          }
          else
          {
            iAttitude = AttitudeList[ iDiceValue ];
          }
          */
}

export function AddAnAttitudeToAttitudeList(bAttitude: INT8): void {
  // adds an attitude to attitude list

  if (iLastElementInAttitudeList < ATTITUDE_LIST_SIZE) {
    // add element
    AttitudeList[iLastElementInAttitudeList] = bAttitude;

    // increment attitude list counter
    iLastElementInAttitudeList++;
  }

  return;
}

export function AddSkillToSkillList(bSkill: INT8): void {
  // adds a skill to skills list

  if (iLastElementInSkillsList < ATTITUDE_LIST_SIZE) {
    // add element
    SkillsList[iLastElementInSkillsList] = bSkill;

    // increment attitude list counter
    iLastElementInSkillsList++;
  }

  return;
}

function RemoveSkillFromSkillsList(iIndex: INT32): void {
  let iLoop: INT32;

  // remove a skill from the index given and shorten the list
  if (iIndex < iLastElementInSkillsList) {
    memset(BackupSkillsList, 0, ATTITUDE_LIST_SIZE * sizeof(INT32));

    // use the backup array to create a version of the array without
    // this index
    for (iLoop = 0; iLoop < iIndex; iLoop++) {
      BackupSkillsList[iLoop] = SkillsList[iLoop];
    }
    for (iLoop = iIndex + 1; iLoop < iLastElementInSkillsList; iLoop++) {
      BackupSkillsList[iLoop - 1] = SkillsList[iLoop];
    }
    // now copy this over to the skills list
    memcpy(SkillsList, BackupSkillsList, ATTITUDE_LIST_SIZE * sizeof(INT32));

    // reduce recorded size by 1
    iLastElementInSkillsList--;
  }
}

function FindSkillInSkillsList(iSkill: INT32): INT32 {
  let iLoop: INT32;

  for (iLoop = 0; iLoop < iLastElementInSkillsList; iLoop++) {
    if (SkillsList[iLoop] == iSkill) {
      return iLoop;
    }
  }

  return -1;
}

function ValidateSkillsList(): void {
  let iIndex: INT32;
  let iValue: INT32;
  let pProfile: Pointer<MERCPROFILESTRUCT>;

  // remove from the generated traits list any traits that don't match
  // the character's skills
  pProfile = addressof(gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId]);
  if (pProfile.value.bMechanical == 0) {
    // without mechanical, electronics is useless
    iIndex = FindSkillInSkillsList(Enum269.ELECTRONICS);
    while (iIndex != -1) {
      RemoveSkillFromSkillsList(iIndex);
      iIndex = FindSkillInSkillsList(Enum269.ELECTRONICS);
    }
  }

  // special check for lockpicking
  iValue = pProfile.value.bMechanical;
  iValue = (iValue * pProfile.value.bWisdom) / 100;
  iValue = (iValue * pProfile.value.bDexterity) / 100;
  if (iValue + gbSkillTraitBonus[Enum269.LOCKPICKING] < 50) {
    // not good enough for lockpicking!

    // so is lockpicking
    iIndex = FindSkillInSkillsList(Enum269.LOCKPICKING);
    while (iIndex != -1) {
      RemoveSkillFromSkillsList(iIndex);
      iIndex = FindSkillInSkillsList(Enum269.LOCKPICKING);
    }
  }

  if (pProfile.value.bMarksmanship == 0) {
    // without marksmanship, the following traits are useless:
    // auto weapons, heavy weapons
    iIndex = FindSkillInSkillsList(Enum269.AUTO_WEAPS);
    while (iIndex != -1) {
      RemoveSkillFromSkillsList(iIndex);
      iIndex = FindSkillInSkillsList(Enum269.AUTO_WEAPS);
    }
    // so is lockpicking
    iIndex = FindSkillInSkillsList(Enum269.HEAVY_WEAPS);
    while (iIndex != -1) {
      RemoveSkillFromSkillsList(iIndex);
      iIndex = FindSkillInSkillsList(Enum269.HEAVY_WEAPS);
    }
  }
}

function CreatePlayerSkills(): void {
  // this function will 'roll a die' and decide if any attitude does exists
  let iDiceValue: INT32 = 0;
  let iCounter: INT32 = 0;

  ValidateSkillsList();

  // roll dice
  iDiceValue = Random(iLastElementInSkillsList);

  // set attitude
  iSkillA = SkillsList[iDiceValue];

  // second dice value
  iDiceValue = Random(iLastElementInSkillsList);

  iSkillB = SkillsList[iDiceValue];

  // allow expert level for generated merc so you CAN have two of the same
  // but there is no such thing as expert level for electronics

  while (iSkillA == iSkillB && (iSkillB == Enum269.ELECTRONICS || iSkillB == Enum269.AMBIDEXT)) {
    // remove electronics as an option and roll again
    RemoveSkillFromSkillsList(iDiceValue);
    if (iLastElementInSkillsList == 0) {
      // ok, only one trait!
      iSkillB = Enum269.NO_SKILLTRAIT;
      break;
    } else {
      iDiceValue = Random(iLastElementInSkillsList);
      iSkillB = SkillsList[iDiceValue];
    }
  }

  /*
  // are the same,
// reroll until different, or until ATTITUDE_LIST_SIZE times
  iSkillB = Random( iLastElementInSkillsList + 1 );

  while( (iSkillA == iSkillB ) && ( iCounter < HOW_MANY_ROLLS_FOR_SAME_SKILL_CHECK ) )
  {
          // increment counter
          iCounter++;

          // next random
iSkillB = Random( iLastElementInSkillsList + 1 );

  }
if( iCounter == ATTITUDE_LIST_SIZE )
  {
iSkillB = NO_SKILLTRAIT;
  }
  return;


  */
}

export function AddAPersonalityToPersonalityList(bPersonlity: INT8): void {
  // CJC, Oct 26 98: prevent personality list from being generated
  // because no dialogue was written to support PC personality quotes

  // BUT we can manage this for PSYCHO okay

  if (bPersonlity != Enum270.PSYCHO) {
    return;
  }

  // will add a persoanlity to persoanlity list
  if (iLastElementInPersonalityList < ATTITUDE_LIST_SIZE) {
    // add element
    PersonalityList[iLastElementInPersonalityList] = bPersonlity;

    // increment attitude list counter
    iLastElementInPersonalityList++;
  }

  return;
}

function CreatePlayerPersonality(): void {
  // only psycho is available since we have no quotes
  // SO if the array is not empty, give them psycho!
  if (iLastElementInPersonalityList == 0) {
    iPersonality = Enum270.NO_PERSONALITYTRAIT;
  } else {
    iPersonality = Enum270.PSYCHO;
  }

  /*
    // this function will 'roll a die' and decide if any Personality does exists
    INT32 iDiceValue = 0;
    INT32 iCounter = 0;
          INT32 iSecondAttempt = -1;

          // roll dice
          iDiceValue = Random( iLastElementInPersonalityList + 1 );

          iPersonality = NO_PERSONALITYTRAIT;
    if( PersonalityList[ iDiceValue ] !=  NO_PERSONALITYTRAIT )
          {
                  for( iCounter = 0; iCounter < iLastElementInPersonalityList; iCounter++ )
                  {
                          if( iCounter != iDiceValue )
                          {
                                  if( PersonalityList[ iCounter ] == PersonalityList[ iDiceValue ] )
                                  {
                                          if( PersonalityList[ iDiceValue ] != PSYCHO )
                                          {
              iPersonality = PersonalityList[ iDiceValue ];
                                          }
                                          else
                                          {
              iSecondAttempt = iCounter;
                                          }
                                          if( iSecondAttempt != iCounter )
                                          {
                                                  iPersonality = PersonalityList[ iDiceValue ];
                                          }

                                  }
                          }
                  }
          }

          return;
  */
}

export function CreatePlayersPersonalitySkillsAndAttitude(): void {
  // creates personality, skills and attitudes from curretly built list

  // personality
  CreatePlayerPersonality();

  // skills are now created later after stats have been chosen
  // CreatePlayerSkills( );

  // attitude
  CreatePlayerAttitude();

  return;
}

export function ResetSkillsAttributesAndPersonality(): void {
  // reset count of skills attributes and personality

  iLastElementInPersonalityList = 0;

  iLastElementInSkillsList = 0;

  iLastElementInAttitudeList = 0;
}

export function ResetIncrementCharacterAttributes(): void {
  // this resets any increments due to character generation

  // attributes
  iAddStrength = 0;
  iAddDexterity = 0;
  iAddWisdom = 0;
  iAddAgility = 0;
  iAddHealth = 0;
  iAddLeadership = 0;

  // skills
  iAddMarksmanship = 0;
  iAddExplosives = 0;
  iAddMedical = 0;
  iAddMechanical = 0;
}

function SelectMercFace(): void {
  // this procedure will select the approriate face for the merc and save offsets

  // grab face filename
  //  strcpy( gMercProfiles[ PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId ].ubUnusedFaceFileName , pPlayerSelectedFaceFileNames[ iPortraitNumber ]);

  // now the offsets
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].ubFaceIndex = 200 + iPortraitNumber;

  // eyes
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].usEyesX = sFacePositions[iPortraitNumber][0];
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].usEyesY = sFacePositions[iPortraitNumber][1];

  // mouth
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].usMouthX = sFacePositions[iPortraitNumber][2];
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].usMouthY = sFacePositions[iPortraitNumber][3];

  // set merc skins and hair color
  SetMercSkinAndHairColors();
  return;
}

function SetMercSkinAndHairColors(): void {
  const enum Enum387 {
    PINKSKIN,
    TANSKIN,
    DARKSKIN,
    BLACKSKIN,
    NUMSKINS,
  };
  const enum Enum388 {
    BROWNHEAD,
    BLACKHEAD, // black skin (only this line )
    WHITEHEAD, // dark skin (this line plus all above)
    BLONDHEAD,
    REDHEAD, // pink/tan skin (this line plus all above )
    NUMHEADS,
  };

  // skin strings
  let sSkinStrings: STR[] /* [] */ = [
    "PINKSKIN",
    "TANSKIN",
    "DARKSKIN",
    "BLACKSKIN",
  ];

  // the hair colors
  let sHairStrings: STR[] /* [] */ = [
    "BROWNHEAD",
    "BLACKHEAD",
    "WHITEHEAD",
    "BLONDHEAD",
    "REDHEAD",
  ];

  // given the portrait number, set the merc's skin and hair color
  let sSkinColor: INT16 = 0;
  let sHairColor: INT16 = 0;

  switch (iPortraitNumber) {
    case (0):
      sSkinColor = Enum387.BLACKSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (1):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (2):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (3):
      sSkinColor = Enum387.DARKSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (4):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (5):
      sSkinColor = Enum387.DARKSKIN;
      sHairColor = Enum388.BLACKHEAD;
      break;
    case (6):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (7):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (8):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (9):
      sSkinColor = Enum387.PINKSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (10):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BLACKHEAD;
      break;
    case (11):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BLACKHEAD;
      break;
    case (12):
      sSkinColor = Enum387.PINKSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (13):
      sSkinColor = Enum387.BLACKSKIN;
      sHairColor = Enum388.BROWNHEAD;
      break;
    case (14):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.REDHEAD;
      break;
    case (15):
      sSkinColor = Enum387.TANSKIN;
      sHairColor = Enum388.BLONDHEAD;
      break;
  }

  // now set them
  strcpy(gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].HAIR, sHairStrings[sHairColor]);
  strcpy(gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].SKIN, sSkinStrings[sSkinColor]);
}

export function HandleMercStatsForChangesInFace(): void {
  if (fLoadingCharacterForPreviousImpProfile) {
    return;
  }

  // now figure out skills
  CreatePlayerSkills();

  // body type
  if (fCharacterIsMale) {
    // male
    // big or regular
    if (ShouldThisMercHaveABigBody()) {
      gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].ubBodyType = Enum194.BIGMALE;

      if (iSkillA == Enum269.MARTIALARTS) {
        iSkillA = Enum269.HANDTOHAND;
      }
      if (iSkillB == Enum269.MARTIALARTS) {
        iSkillB = Enum269.HANDTOHAND;
      }
    } else {
      gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].ubBodyType = Enum194.REGMALE;
    }
  } else {
    // female
    gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].ubBodyType = Enum194.REGFEMALE;

    if (iSkillA == Enum269.MARTIALARTS) {
      iSkillA = Enum269.HANDTOHAND;
    }
    if (iSkillB == Enum269.MARTIALARTS) {
      iSkillB = Enum269.HANDTOHAND;
    }
  }

  // skill trait
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait = iSkillA;
  gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 = iSkillB;
}

function ShouldThisMercHaveABigBody(): boolean {
  // should this merc be a big body typ
  if ((iPortraitNumber == 0) || (iPortraitNumber == 6) || (iPortraitNumber == 7)) {
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bStrength >= 75) {
      return true;
    }
  }

  return false;
}

}
