const SALARYAMT = 0;
const HEALTHAMT = 1;
const AGILAMT = 2;
const DEXTAMT = 3;
const WISDOMAMT = 4;
const MEDICALAMT = 5;
const EXPLODEAMT = 6;
const MECHANAMT = 7;
const MARKAMT = 8;
const EXPERAMT = 9;
const STRAMT = 10;
const LDRAMT = 11;
const ASSIGNAMT = 12;
const NAMEAMT = 13;

const FIRST_CHANGEABLE_STAT = HEALTHAMT;
const LAST_CHANGEABLE_STAT = LDRAMT;
const CHANGEABLE_STAT_COUNT = (LDRAMT - HEALTHAMT + 1);

const MAX_STAT_VALUE = 100; // for stats and skills
const MAXEXPLEVEL = 10; // maximum merc experience level

const SKILLS_SUBPOINTS_TO_IMPROVE = 25;
const ATTRIBS_SUBPOINTS_TO_IMPROVE = 50;
const LEVEL_SUBPOINTS_TO_IMPROVE = 350; // per current level!	(Can't go over 6500, 10x must fit in USHORT!)

const WORKIMPROVERATE = 2; // increase to make working  mercs improve more
const TRAINIMPROVERATE = 2; // increase to make training mercs improve more

const SALARY_CHANGE_PER_LEVEL = 1.25; // Mercs salary is multiplied by this
const MAX_DAILY_SALARY = 30000; // must fit into an INT16 (32k)
const MAX_LARGE_SALARY = 500000; // no limit, really

// training cap: you can't train any stat/skill beyond this value
const TRAINING_RATING_CAP = 85;

// stat change causes
const FROM_SUCCESS = 0;
const FROM_TRAINING = 1;
const FROM_FAILURE = 2;

// types of experience bonus awards
const enum Enum200 {
  EXP_BONUS_MINIMUM,
  EXP_BONUS_SMALL,
  EXP_BONUS_AVERAGE,
  EXP_BONUS_LARGE,
  EXP_BONUS_MAXIMUM,
  NUM_EXP_BONUS_TYPES,
}
