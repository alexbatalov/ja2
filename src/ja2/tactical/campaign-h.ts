const SALARYAMT = 0;
export const HEALTHAMT = 1;
export const AGILAMT = 2;
export const DEXTAMT = 3;
export const WISDOMAMT = 4;
export const MEDICALAMT = 5;
export const EXPLODEAMT = 6;
export const MECHANAMT = 7;
export const MARKAMT = 8;
export const EXPERAMT = 9;
export const STRAMT = 10;
export const LDRAMT = 11;
const ASSIGNAMT = 12;
const NAMEAMT = 13;

export const FIRST_CHANGEABLE_STAT = HEALTHAMT;
export const LAST_CHANGEABLE_STAT = LDRAMT;
const CHANGEABLE_STAT_COUNT = (LDRAMT - HEALTHAMT + 1);

export const MAX_STAT_VALUE = 100; // for stats and skills
export const MAXEXPLEVEL = 10; // maximum merc experience level

export const SKILLS_SUBPOINTS_TO_IMPROVE = 25;
export const ATTRIBS_SUBPOINTS_TO_IMPROVE = 50;
export const LEVEL_SUBPOINTS_TO_IMPROVE = 350; // per current level!	(Can't go over 6500, 10x must fit in USHORT!)

const WORKIMPROVERATE = 2; // increase to make working  mercs improve more
const TRAINIMPROVERATE = 2; // increase to make training mercs improve more

export const SALARY_CHANGE_PER_LEVEL = 1.25; // Mercs salary is multiplied by this
export const MAX_DAILY_SALARY = 30000; // must fit into an INT16 (32k)
export const MAX_LARGE_SALARY = 500000; // no limit, really

// training cap: you can't train any stat/skill beyond this value
export const TRAINING_RATING_CAP = 85;

// stat change causes
const FROM_SUCCESS = 0;
export const FROM_TRAINING = 1;
export const FROM_FAILURE = 2;

// types of experience bonus awards
export const enum Enum200 {
  EXP_BONUS_MINIMUM,
  EXP_BONUS_SMALL,
  EXP_BONUS_AVERAGE,
  EXP_BONUS_LARGE,
  EXP_BONUS_MAXIMUM,
  NUM_EXP_BONUS_TYPES,
}
