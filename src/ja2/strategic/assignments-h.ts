// header for assignment manipulation/updating for characters

// this distinguishes whether we're only looking for patients healable THIS HOUR (those that have been on their assignment
// long enough), or those that will be healable EVER (regardless of whether they're getting healed during this hour)
const HEALABLE_EVER = 0;
const HEALABLE_THIS_HOUR = 1;

// merc collapses from fatigue if max breath drops to this.  Can't go any lower!
const BREATHMAX_ABSOLUTE_MINIMUM = 10;
const BREATHMAX_GOTTA_STOP_MOVING = 30;
const BREATHMAX_PRETTY_TIRED = 50;
const BREATHMAX_CANCEL_COLLAPSE = 60;
const BREATHMAX_CANCEL_TIRED = 75;
const BREATHMAX_FULLY_RESTED = 95;

const VEHICLE_REPAIR_POINTS_DIVISOR = 10;

// Assignments Defines
const enum Enum117 {
  SQUAD_1 = 0,
  SQUAD_2,
  SQUAD_3,
  SQUAD_4,
  SQUAD_5,
  SQUAD_6,
  SQUAD_7,
  SQUAD_8,
  SQUAD_9,
  SQUAD_10,
  SQUAD_11,
  SQUAD_12,
  SQUAD_13,
  SQUAD_14,
  SQUAD_15,
  SQUAD_16,
  SQUAD_17,
  SQUAD_18,
  SQUAD_19,
  SQUAD_20,
  ON_DUTY,
  DOCTOR,
  PATIENT,
  VEHICLE,
  IN_TRANSIT,
  REPAIR,
  TRAIN_SELF,
  TRAIN_TOWN,
  TRAIN_TEAMMATE,
  TRAIN_BY_OTHER,
  ASSIGNMENT_DEAD,
  ASSIGNMENT_UNCONCIOUS, // unused
  ASSIGNMENT_POW,
  ASSIGNMENT_HOSPITAL,
  ASSIGNMENT_EMPTY,
}

const NO_ASSIGNMENT = 127; // used when no pSoldier->ubDesiredSquad

// Train stats defines (must match ATTRIB_MENU_ defines, and pAttributeMenuStrings )
const enum Enum118 {
  STRENGTH = 0,
  DEXTERITY,
  AGILITY,
  HEALTH,
  MARKSMANSHIP,
  MEDICAL,
  MECHANICAL,
  LEADERSHIP,
  EXPLOSIVE_ASSIGN,
  NUM_TRAINABLE_STATS,
  // NOTE: Wisdom isn't trainable!
}

interface TOWN_TRAINER_TYPE {
  pSoldier: Pointer<SOLDIERTYPE>;
  sTrainingPts: INT16;
}

// can character do this assignment?
// BOOLEAN CanSoldierAssignment( SOLDIERTYPE *pSoldier, INT8 bAssignment );

const CHARACTER_CANT_JOIN_SQUAD_ALREADY_IN_IT = -6;
const CHARACTER_CANT_JOIN_SQUAD_SQUAD_MOVING = -5;
const CHARACTER_CANT_JOIN_SQUAD_MOVING = -4;
const CHARACTER_CANT_JOIN_SQUAD_VEHICLE = -3;
const CHARACTER_CANT_JOIN_SQUAD_TOO_FAR = -2;
const CHARACTER_CANT_JOIN_SQUAD_FULL = -1;
const CHARACTER_CANT_JOIN_SQUAD = 0;
const CHARACTER_CAN_JOIN_SQUAD = 1;

// extern INT32 ghUpdateBox;
