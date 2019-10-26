namespace ja2 {

// header for squad management system
export const NUMBER_OF_SOLDIERS_PER_SQUAD = 6;

// enums for squads
export const enum Enum275 {
  FIRST_SQUAD = 0,
  SECOND_SQUAD,
  THIRD_SQUAD,
  FOURTH_SQUAD,
  FIFTH_SQUAD,
  SIXTH_SQUAD,
  SEVENTH_SQUAD,
  EIGTH_SQUAD,
  NINTH_SQUAD,
  TENTH_SQUAD,
  ELEVENTH_SQUAD,
  TWELTH_SQUAD,
  THIRTEENTH_SQUAD,
  FOURTEENTH_SQUAD,
  FIFTHTEEN_SQUAD,
  SIXTEENTH_SQUAD,
  SEVENTEENTH_SQUAD,
  EIGTHTEENTH_SQUAD,
  NINTEENTH_SQUAD,
  TWENTYTH_SQUAD,
  NUMBER_OF_SQUADS,
}

// ATE: Added so we can have no current squad
// happens in we move off sector via tactical, but nobody is left!
export const NO_CURRENT_SQUAD = Enum275.NUMBER_OF_SQUADS;

// ptrs to soldier types of squads and their members

}
