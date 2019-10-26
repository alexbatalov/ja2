namespace ja2 {

// GAME BALANCING DEFINITIONS FOR CREATURE SPREADING
// Hopefully, adjusting these following definitions will ease the balancing of the
// creature spreading.
// The one note here is that for any definitions that have a XXX_BONUS at the end of a definition,
// it gets added on to it's counterpart via:
//								XXX_VALUE + Random( 1 + XXX_BONUS )

// The start day random bonus that the queen begins
//#define EASY_QUEEN_START_DAY								10	//easy start day 10-13
//#define EASY_QUEEN_START_BONUS							3
//#define NORMAL_QUEEN_START_DAY							8		//normal start day 8-10
//#define NORMAL_QUEEN_START_BONUS						2
//#define HARD_QUEEN_START_DAY								7		//hard start day 7-8
//#define HARD_QUEEN_START_BONUS							1

// This is how often the creatures spread, once the quest begins.  The smaller the gap,
// the faster the creatures will advance.  This is also directly related to the reproduction
// rates which are applied each time the creatures spread.
const EASY_SPREAD_TIME_IN_MINUTES = 510; // easy spreads every 8.5 hours
const NORMAL_SPREAD_TIME_IN_MINUTES = 450; // normal spreads every 7.5 hours
const HARD_SPREAD_TIME_IN_MINUTES = 390; // hard spreads every 6.5 hours

// Once the queen is added to the game, we can instantly let her spread x number of times
// to give her a head start.  This can also be a useful tool for having slow reproduction rates
// but quicker head start to compensate to make the creatures less aggressive overall.
const EASY_QUEEN_INIT_BONUS_SPREADS = 1;
const NORMAL_QUEEN_INIT_BONUS_SPREADS = 2;
const HARD_QUEEN_INIT_BONUS_SPREADS = 3;

// This value modifies the chance to populate a given sector.  This is different from the previous definition.
// This value gets applied to a potentially complicated formula, using the creature habitat to modify
// chance to populate, along with factoring in the relative distance to the hive range (to promote deeper lair
// population increases), etc.  I would recommend not tweaking the value too much in either direction from
// zero due to the fact that this can greatly effect spread times and maximum populations.  Basically, if the
// creatures are spreading too quickly, increase the value, otherwise decrease it to a negative value
const EASY_POPULATION_MODIFIER = 0;
const NORMAL_POPULATION_MODIFIER = 0;
const HARD_POPULATION_MODIFIER = 0;

// Augments the chance that the creatures will attack a town.  The conditions for attacking a town
// are based strictly on the occupation of the creatures in each of the four mine exits.  For each creature
// there is a base chance of 10% that the creatures will feed sometime during the night.
const EASY_CREATURE_TOWN_AGGRESSIVENESS = -10;
const NORMAL_CREATURE_TOWN_AGGRESSIVENESS = 0;
const HARD_CREATURE_TOWN_AGGRESSIVENESS = 10;

// This is how many creatures the queen produces for each cycle of spreading.  The higher
// the numbers the faster the creatures will advance.
const EASY_QUEEN_REPRODUCTION_BASE = 6; // 6-7
const EASY_QUEEN_REPRODUCTION_BONUS = 1;
const NORMAL_QUEEN_REPRODUCTION_BASE = 7; // 7-9
const NORMAL_QUEEN_REPRODUCTION_BONUS = 2;
const HARD_QUEEN_REPRODUCTION_BASE = 9; // 9-12
const HARD_QUEEN_REPRODUCTION_BONUS = 3;

// When either in a cave level with blue lights or there is a creature presence, then
// we override the normal music with the creature music.  The conditions are maintained
// inside the function PrepareCreaturesForBattle() in this module.
export let gfUseCreatureMusic: boolean = false;
export let gfCreatureMeanwhileScenePlayed: boolean = false;
const enum Enum128 {
  QUEEN_LAIR, // where the queen lives.  Highly protected
  LAIR, // part of the queen's lair -- lots of babies and defending mothers
  LAIR_ENTRANCE, // where the creatures access the mine.
  INNER_MINE, // parts of the mines that aren't close to the outside world
  OUTER_MINE, // area's where miners work, close to towns, creatures love to eat :)
  FEEDING_GROUNDS, // creatures love to populate these sectors :)
  MINE_EXIT, // the area that creatures can initiate town attacks if lots of monsters.
}

interface CREATURE_DIRECTIVE {
  next: Pointer<CREATURE_DIRECTIVE>;
  pLevel: Pointer<UNDERGROUND_SECTORINFO>;
}

let lair: Pointer<CREATURE_DIRECTIVE>;
let giHabitatedDistance: INT32 = 0;
let giPopulationModifier: INT32 = 0;
let giLairID: INT32 = 0;
let giDestroyedLairID: INT32 = 0;

// various information required for keeping track of the battle sector involved for
// prebattle interface, autoresolve, etc.
let gsCreatureInsertionCode: INT16 = 0;
let gsCreatureInsertionGridNo: INT16 = 0;
export let gubNumCreaturesAttackingTown: UINT8 = 0;
let gubYoungMalesAttackingTown: UINT8 = 0;
let gubYoungFemalesAttackingTown: UINT8 = 0;
let gubAdultMalesAttackingTown: UINT8 = 0;
let gubAdultFemalesAttackingTown: UINT8 = 0;
let gubCreatureBattleCode: UINT8 = Enum129.CREATURE_BATTLE_CODE_NONE;
export let gubSectorIDOfCreatureAttack: UINT8 = 0;

function NewDirective(ubSectorID: UINT8, ubSectorZ: UINT8, ubCreatureHabitat: UINT8): Pointer<CREATURE_DIRECTIVE> {
  let curr: Pointer<CREATURE_DIRECTIVE>;
  let ubSectorX: UINT8;
  let ubSectorY: UINT8;
  curr = MemAlloc(sizeof(CREATURE_DIRECTIVE));
  Assert(curr);
  ubSectorX = ((ubSectorID % 16) + 1);
  ubSectorY = ((ubSectorID / 16) + 1);
  curr.value.pLevel = FindUnderGroundSector(ubSectorX, ubSectorY, ubSectorZ);
  if (!curr.value.pLevel) {
    AssertMsg(0, String("Could not find underground sector node (%c%db_%d) that should exist.", ubSectorY + 'A' - 1, ubSectorX, ubSectorZ));
    return 0;
  }

  curr.value.pLevel.value.ubCreatureHabitat = ubCreatureHabitat;
  Assert(curr.value.pLevel);
  curr.value.next = null;
  return curr;
}

function InitLairDrassen(): void {
  let curr: Pointer<CREATURE_DIRECTIVE>;
  giLairID = 1;
  // initialize the linked list of lairs
  lair = NewDirective(Enum123.SEC_F13, 3, Enum128.QUEEN_LAIR);
  curr = lair;
  if (!curr.value.pLevel.value.ubNumCreatures) {
    curr.value.pLevel.value.ubNumCreatures = 1; // for the queen.
  }
  curr.value.next = NewDirective(Enum123.SEC_G13, 3, Enum128.LAIR);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_G13, 2, Enum128.LAIR_ENTRANCE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_F13, 2, Enum128.INNER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_E13, 2, Enum128.INNER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_E13, 1, Enum128.OUTER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_D13, 1, Enum128.MINE_EXIT);
}

function InitLairCambria(): void {
  let curr: Pointer<CREATURE_DIRECTIVE>;
  giLairID = 2;
  // initialize the linked list of lairs
  lair = NewDirective(Enum123.SEC_J8, 3, Enum128.QUEEN_LAIR);
  curr = lair;
  if (!curr.value.pLevel.value.ubNumCreatures) {
    curr.value.pLevel.value.ubNumCreatures = 1; // for the queen.
  }
  curr.value.next = NewDirective(Enum123.SEC_I8, 3, Enum128.LAIR);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H8, 3, Enum128.LAIR);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H8, 2, Enum128.LAIR_ENTRANCE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H9, 2, Enum128.INNER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H9, 1, Enum128.OUTER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H8, 1, Enum128.MINE_EXIT);
}

function InitLairAlma(): void {
  let curr: Pointer<CREATURE_DIRECTIVE>;
  giLairID = 3;
  // initialize the linked list of lairs
  lair = NewDirective(Enum123.SEC_K13, 3, Enum128.QUEEN_LAIR);
  curr = lair;
  if (!curr.value.pLevel.value.ubNumCreatures) {
    curr.value.pLevel.value.ubNumCreatures = 1; // for the queen.
  }
  curr.value.next = NewDirective(Enum123.SEC_J13, 3, Enum128.LAIR);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_J13, 2, Enum128.LAIR_ENTRANCE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_J14, 2, Enum128.INNER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_J14, 1, Enum128.OUTER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_I14, 1, Enum128.MINE_EXIT);
}

function InitLairGrumm(): void {
  let curr: Pointer<CREATURE_DIRECTIVE>;
  giLairID = 4;
  // initialize the linked list of lairs
  lair = NewDirective(Enum123.SEC_G4, 3, Enum128.QUEEN_LAIR);
  curr = lair;
  if (!curr.value.pLevel.value.ubNumCreatures) {
    curr.value.pLevel.value.ubNumCreatures = 1; // for the queen.
  }
  curr.value.next = NewDirective(Enum123.SEC_H4, 3, Enum128.LAIR);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H4, 2, Enum128.LAIR_ENTRANCE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H3, 2, Enum128.INNER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_I3, 2, Enum128.INNER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_I3, 1, Enum128.OUTER_MINE);
  curr = curr.value.next;
  curr.value.next = NewDirective(Enum123.SEC_H3, 1, Enum128.MINE_EXIT);
}

export function InitCreatureQuest(): void {
  let curr: Pointer<UNDERGROUND_SECTORINFO>;
  let fPlayMeanwhile: boolean = false;
  let i: INT32 = -1;
  let iChosenMine: INT32;
  let iRandom: INT32;
  let iNumMinesInfectible: INT32;
  let fMineInfectible: boolean[] /* [4] */;

  if (giLairID) {
    return; // already active!
  }

  fPlayMeanwhile = true;

  if (fPlayMeanwhile && !gfCreatureMeanwhileScenePlayed) {
    // Start the meanwhile scene for the queen ordering the release of the creatures.
    HandleCreatureRelease();
    gfCreatureMeanwhileScenePlayed = true;
  }

  giHabitatedDistance = 0;
  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      giPopulationModifier = EASY_POPULATION_MODIFIER;
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      giPopulationModifier = NORMAL_POPULATION_MODIFIER;
      break;
    case Enum9.DIF_LEVEL_HARD:
      giPopulationModifier = HARD_POPULATION_MODIFIER;
      break;
  }

  // Determine which of the four maps are infectible by creatures.  Infectible mines
  // are those that are player controlled and unlimited.  We don't want the creatures to
  // infect the mine that runs out.

  // Default them all to infectible
  memset(fMineInfectible, 1, sizeof(BOOLEAN) * 4);

  if (gMineStatus[Enum174.DRASSEN_MINE].fAttackedHeadMiner || gMineStatus[Enum174.DRASSEN_MINE].uiOreRunningOutPoint || StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_D13)].fEnemyControlled) {
    // If head miner was attacked, ore will/has run out, or enemy controlled
    fMineInfectible[0] = false;
  }
  if (gMineStatus[Enum174.CAMBRIA_MINE].fAttackedHeadMiner || gMineStatus[Enum174.CAMBRIA_MINE].uiOreRunningOutPoint || StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_H8)].fEnemyControlled) {
    // If head miner was attacked, ore will/has run out, or enemy controlled
    fMineInfectible[1] = false;
  }
  if (gMineStatus[Enum174.ALMA_MINE].fAttackedHeadMiner || gMineStatus[Enum174.ALMA_MINE].uiOreRunningOutPoint || StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_I14)].fEnemyControlled) {
    // If head miner was attacked, ore will/has run out, or enemy controlled
    fMineInfectible[2] = false;
  }
  if (gMineStatus[Enum174.GRUMM_MINE].fAttackedHeadMiner || gMineStatus[Enum174.GRUMM_MINE].uiOreRunningOutPoint || StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_H3)].fEnemyControlled) {
    // If head miner was attacked, ore will/has run out, or enemy controlled
    fMineInfectible[3] = false;
  }

  iNumMinesInfectible = fMineInfectible[0] + fMineInfectible[1] + fMineInfectible[2] + fMineInfectible[3];

  if (!iNumMinesInfectible) {
    return;
  }

  // Choose one of the infectible mines randomly
  iRandom = Random(iNumMinesInfectible) + 1;

  iChosenMine = 0;

  for (i = 0; i < 4; i++) {
    if (iRandom) {
      iChosenMine++;
      if (fMineInfectible[i]) {
        iRandom--;
      }
    }
  }

  // Now, choose a start location for the queen.
  switch (iChosenMine) {
    case 1: // Drassen
      InitLairDrassen();
      curr = FindUnderGroundSector(13, 5, 1);
      curr.value.uiFlags |= SF_PENDING_ALTERNATE_MAP;
      break;
    case 2: // Cambria
      InitLairCambria();
      curr = FindUnderGroundSector(9, 8, 1);
      curr.value.uiFlags |= SF_PENDING_ALTERNATE_MAP; // entrance
      break;
    case 3: // Alma's mine
      InitLairAlma();
      curr = FindUnderGroundSector(14, 10, 1);
      curr.value.uiFlags |= SF_PENDING_ALTERNATE_MAP;
      break;
    case 4: // Grumm's mine
      InitLairGrumm();
      curr = FindUnderGroundSector(4, 8, 2);
      curr.value.uiFlags |= SF_PENDING_ALTERNATE_MAP;
      break;
    default:
      return;
  }

  // Now determine how often we will spread the creatures.
  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      i = EASY_QUEEN_INIT_BONUS_SPREADS;
      AddPeriodStrategicEvent(Enum132.EVENT_CREATURE_SPREAD, EASY_SPREAD_TIME_IN_MINUTES, 0);
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      i = NORMAL_QUEEN_INIT_BONUS_SPREADS;
      AddPeriodStrategicEvent(Enum132.EVENT_CREATURE_SPREAD, NORMAL_SPREAD_TIME_IN_MINUTES, 0);
      break;
    case Enum9.DIF_LEVEL_HARD:
      i = HARD_QUEEN_INIT_BONUS_SPREADS;
      AddPeriodStrategicEvent(Enum132.EVENT_CREATURE_SPREAD, HARD_SPREAD_TIME_IN_MINUTES, 0);
      break;
  }

  // Set things up so that the creatures can plan attacks on helpless miners and civilians while
  // they are sleeping.  They do their planning at 10PM every day, and decide to attack sometime
  // during the night.
  AddEveryDayStrategicEvent(Enum132.EVENT_CREATURE_NIGHT_PLANNING, 1320, 0);

  // Got to give the queen some early protection, so do some creature spreading.
  while (i--) {
    //# times spread is based on difficulty, and the values in the defines.
    SpreadCreatures();
  }
}

function AddCreatureToNode(node: Pointer<CREATURE_DIRECTIVE>): void {
  node.value.pLevel.value.ubNumCreatures++;

  if (node.value.pLevel.value.uiFlags & SF_PENDING_ALTERNATE_MAP) {
    // there is an alternate map meaning that there is a dynamic opening.  From now on
    // we substitute this map.
    node.value.pLevel.value.uiFlags &= ~SF_PENDING_ALTERNATE_MAP;
    node.value.pLevel.value.uiFlags |= SF_USE_ALTERNATE_MAP;
  }
}

function PlaceNewCreature(node: Pointer<CREATURE_DIRECTIVE>, iDistance: INT32): boolean {
  if (!node)
    return false;
  // check to see if the creatures are permitted to spread into certain areas.  There are 4 mines (human perspective), and
  // creatures won't spread to them until the player controls them.  Additionally, if the player has recently cleared the
  // mine, then temporarily prevent the spreading of creatures.

  if (giHabitatedDistance == iDistance) {
    // FRONT-LINE CONDITIONS -- consider expansion or frontline fortification.  The formulae used
    // in this sector are geared towards outer expansion.
    // we have reached the distance limitation for the spreading.  We will determine if
    // the area is populated enough to spread further.  The minimum population must be 4 before
    // spreading is even considered.
    if (node.value.pLevel.value.ubNumCreatures * 10 - 10 <= Random(60)) {
      // x<=1   100%
      // x==2		 83%
      // x==3		 67%
      // x==4		 50%
      // x==5		 33%
      // x==6		 17%
      // x>=7		  0%
      AddCreatureToNode(node);
      return true;
    }
  } else if (giHabitatedDistance > iDistance) {
    // we are within the "safe" habitated area of the creature's area of influence.  The chance of
    // increasing the population inside this sector depends on how deep we are within the sector.
    if (node.value.pLevel.value.ubNumCreatures < MAX_STRATEGIC_TEAM_SIZE || node.value.pLevel.value.ubNumCreatures < 32 && node.value.pLevel.value.ubCreatureHabitat == Enum128.QUEEN_LAIR) {
      // there is ALWAYS a chance to habitate an interior sector, though the chances are slim for
      // highly occupied sectors.  This chance is modified by the type of area we are in.
      let iAbsoluteMaxPopulation: INT32;
      let iMaxPopulation: INT32 = -1;
      let iChanceToPopulate: INT32;
      switch (node.value.pLevel.value.ubCreatureHabitat) {
        case Enum128.QUEEN_LAIR: // Defend the queen bonus
          iAbsoluteMaxPopulation = 32;
          break;
        case Enum128.LAIR: // Smaller defend the queen bonus
          iAbsoluteMaxPopulation = 18;
          break;
        case Enum128.LAIR_ENTRANCE: // Smallest defend the queen bonus
          iAbsoluteMaxPopulation = 15;
          break;
        case Enum128.INNER_MINE: // neg bonus -- actually promotes expansion over population, and decrease max pop here.
          iAbsoluteMaxPopulation = 12;
          break;
        case Enum128.OUTER_MINE: // neg bonus -- actually promotes expansion over population, and decrease max pop here.
          iAbsoluteMaxPopulation = 10;
          break;
        case Enum128.FEEDING_GROUNDS: // get free food bonus!  yummy humans :)
          iAbsoluteMaxPopulation = 15;
          break;
        case Enum128.MINE_EXIT: // close access to humans (don't want to overwhelm them)
          iAbsoluteMaxPopulation = 10;
          break;
        default:
          Assert(0);
          return false;
      }

      switch (gGameOptions.ubDifficultyLevel) {
        case Enum9.DIF_LEVEL_EASY: // 50%
          iAbsoluteMaxPopulation /= 2; // Half
          break;
        case Enum9.DIF_LEVEL_MEDIUM: // 80%
          iAbsoluteMaxPopulation = iAbsoluteMaxPopulation * 4 / 5;
          break;
        case Enum9.DIF_LEVEL_HARD: // 100%
          break;
      }

      // Calculate the desired max population percentage based purely on current distant to creature range.
      // The closer we are to the lair, the closer this value will be to 100.
      iMaxPopulation = 100 - iDistance * 100 / giHabitatedDistance;
      iMaxPopulation = Math.max(iMaxPopulation, 25);
      // Now, convert the previous value into a numeric population.
      iMaxPopulation = iAbsoluteMaxPopulation * iMaxPopulation / 100;
      iMaxPopulation = Math.max(iMaxPopulation, 4);

      // The chance to populate a sector is higher for lower populations.  This is calculated on
      // the ratio of current population to the max population.
      iChanceToPopulate = 100 - node.value.pLevel.value.ubNumCreatures * 100 / iMaxPopulation;

      if (!node.value.pLevel.value.ubNumCreatures || iChanceToPopulate > Random(100) && iMaxPopulation > node.value.pLevel.value.ubNumCreatures) {
        AddCreatureToNode(node);
        return true;
      }
    }
  } else {
    // we are in a new area, so we will populate it
    AddCreatureToNode(node);
    giHabitatedDistance++;
    return true;
  }
  if (PlaceNewCreature(node.value.next, iDistance + 1))
    return true;
  return false;
}

export function SpreadCreatures(): void {
  let usNewCreatures: UINT16 = 0;

  if (giLairID == -1) {
    DecayCreatures();
    return;
  }

  // queen just produced a litter of creature larvae.  Let's do some spreading now.
  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      usNewCreatures = (EASY_QUEEN_REPRODUCTION_BASE + Random(1 + EASY_QUEEN_REPRODUCTION_BONUS));
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      usNewCreatures = (NORMAL_QUEEN_REPRODUCTION_BASE + Random(1 + NORMAL_QUEEN_REPRODUCTION_BONUS));
      break;
    case Enum9.DIF_LEVEL_HARD:
      usNewCreatures = (HARD_QUEEN_REPRODUCTION_BASE + Random(1 + HARD_QUEEN_REPRODUCTION_BONUS));
      break;
  }

  while (usNewCreatures--) {
    // Note, this function can and will fail if the population gets dense.  This is a necessary
    // feature.  Otherwise, the queen would fill all the cave levels with MAX_STRATEGIC_TEAM_SIZE monsters, and that would
    // be bad.
    PlaceNewCreature(lair, 0);
  }
}

export function DecayCreatures(): void {
  // when the queen dies, we need to kill off the creatures over a period of time.
}

function AddCreaturesToBattle(ubNumYoungMales: UINT8, ubNumYoungFemales: UINT8, ubNumAdultMales: UINT8, ubNumAdultFemales: UINT8): void {
  let iRandom: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let MapEdgepointInfo: MAPEDGEPOINTINFO;
  let bDesiredDirection: UINT8 = 0;
  let ubCurrSlot: UINT8 = 0;

  switch (gsCreatureInsertionCode) {
    case Enum175.INSERTION_CODE_NORTH:
      bDesiredDirection = Enum245.SOUTHEAST;
      break;
    case Enum175.INSERTION_CODE_EAST:
      bDesiredDirection = Enum245.SOUTHWEST;
      break;
    case Enum175.INSERTION_CODE_SOUTH:
      bDesiredDirection = Enum245.NORTHWEST;
      break;
    case Enum175.INSERTION_CODE_WEST:
      bDesiredDirection = Enum245.NORTHEAST;
      break;
    case Enum175.INSERTION_CODE_GRIDNO:
      break;
    default:
      AssertMsg(0, "Illegal direction passed to AddCreaturesToBattle()");
      break;
  }

  if (gsCreatureInsertionCode != Enum175.INSERTION_CODE_GRIDNO) {
    ChooseMapEdgepoints(addressof(MapEdgepointInfo), gsCreatureInsertionCode, (ubNumYoungMales + ubNumYoungFemales + ubNumAdultMales + ubNumAdultFemales));
    ubCurrSlot = 0;
  }
  while (ubNumYoungMales || ubNumYoungFemales || ubNumAdultMales || ubNumAdultFemales) {
    iRandom = Random(ubNumYoungMales + ubNumYoungFemales + ubNumAdultMales + ubNumAdultFemales);
    if (ubNumYoungMales && iRandom < ubNumYoungMales) {
      ubNumYoungMales--;
      pSoldier = TacticalCreateCreature(Enum194.YAM_MONSTER);
    } else if (ubNumYoungFemales && iRandom < (ubNumYoungMales + ubNumYoungFemales)) {
      ubNumYoungFemales--;
      pSoldier = TacticalCreateCreature(Enum194.YAF_MONSTER);
    } else if (ubNumAdultMales && iRandom < (ubNumYoungMales + ubNumYoungFemales + ubNumAdultMales)) {
      ubNumAdultMales--;
      pSoldier = TacticalCreateCreature(Enum194.AM_MONSTER);
    } else if (ubNumAdultFemales && iRandom < (ubNumYoungMales + ubNumYoungFemales + ubNumAdultMales + ubNumAdultFemales)) {
      ubNumAdultFemales--;
      pSoldier = TacticalCreateCreature(Enum194.ADULTFEMALEMONSTER);
    } else {
      gsCreatureInsertionCode = 0;
      gsCreatureInsertionGridNo = 0;
      gubNumCreaturesAttackingTown = 0;
      gubYoungMalesAttackingTown = 0;
      gubYoungFemalesAttackingTown = 0;
      gubAdultMalesAttackingTown = 0;
      gubAdultFemalesAttackingTown = 0;
      gubCreatureBattleCode = Enum129.CREATURE_BATTLE_CODE_NONE;
      gubSectorIDOfCreatureAttack = 0;
      AllTeamsLookForAll(false);

      Assert(0);
      return;
    }
    pSoldier.value.ubInsertionDirection = bDesiredDirection;
    // Setup the position
    pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.value.bHunting = true;
    if (gsCreatureInsertionCode != Enum175.INSERTION_CODE_GRIDNO) {
      if (ubCurrSlot < MapEdgepointInfo.ubNumPoints) {
        // using an edgepoint
        pSoldier.value.usStrategicInsertionData = MapEdgepointInfo.sGridNo[ubCurrSlot++];
      } else {
        // no edgepoints left, so put him at the entrypoint.
        pSoldier.value.ubStrategicInsertionCode = gsCreatureInsertionCode;
      }
    } else {
      pSoldier.value.usStrategicInsertionData = gsCreatureInsertionGridNo;
    }
    UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, 0);
  }
  gsCreatureInsertionCode = 0;
  gsCreatureInsertionGridNo = 0;
  gubNumCreaturesAttackingTown = 0;
  gubYoungMalesAttackingTown = 0;
  gubYoungFemalesAttackingTown = 0;
  gubAdultMalesAttackingTown = 0;
  gubAdultFemalesAttackingTown = 0;
  gubCreatureBattleCode = Enum129.CREATURE_BATTLE_CODE_NONE;
  gubSectorIDOfCreatureAttack = 0;
  AllTeamsLookForAll(false);
}

function ChooseTownSectorToAttack(ubSectorID: UINT8, fOverrideTest: boolean): void {
  let iRandom: INT32;
  let ubSectorX: UINT8;
  let ubSectorY: UINT8;
  ubSectorX = ((ubSectorID % 16) + 1);
  ubSectorY = ((ubSectorID / 16) + 1);

  if (!fOverrideTest) {
    iRandom = PreRandom(100);
    switch (ubSectorID) {
      case Enum123.SEC_D13: // DRASSEN
        if (iRandom < 45)
          ubSectorID = Enum123.SEC_D13;
        else if (iRandom < 70)
          ubSectorID = Enum123.SEC_C13;
        else
          ubSectorID = Enum123.SEC_B13;
        break;
      case Enum123.SEC_H3: // GRUMM
        if (iRandom < 35)
          ubSectorID = Enum123.SEC_H3;
        else if (iRandom < 55)
          ubSectorID = Enum123.SEC_H2;
        else if (iRandom < 70)
          ubSectorID = Enum123.SEC_G2;
        else if (iRandom < 85)
          ubSectorID = Enum123.SEC_H1;
        else
          ubSectorID = Enum123.SEC_G1;
        break;
      case Enum123.SEC_H8: // CAMBRIA
        if (iRandom < 35)
          ubSectorID = Enum123.SEC_H8;
        else if (iRandom < 55)
          ubSectorID = Enum123.SEC_G8;
        else if (iRandom < 70)
          ubSectorID = Enum123.SEC_F8;
        else if (iRandom < 85)
          ubSectorID = Enum123.SEC_G9;
        else
          ubSectorID = Enum123.SEC_F9;
        break;
      case Enum123.SEC_I14: // ALMA
        if (iRandom < 45)
          ubSectorID = Enum123.SEC_I14;
        else if (iRandom < 65)
          ubSectorID = Enum123.SEC_I13;
        else if (iRandom < 85)
          ubSectorID = Enum123.SEC_H14;
        else
          ubSectorID = Enum123.SEC_H13;
        break;
      default:
        Assert(0);
        return;
    }
  }
  switch (ubSectorID) {
    case Enum123.SEC_D13: // DRASSEN
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      gsCreatureInsertionGridNo = 20703;
      break;
    case Enum123.SEC_C13:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_B13:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_H3: // GRUMM
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      gsCreatureInsertionGridNo = 10303;
      break;
    case Enum123.SEC_H2:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_EAST;
      break;
    case Enum123.SEC_G2:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_H1:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_EAST;
      break;
    case Enum123.SEC_G1:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_H8: // CAMBRIA
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      gsCreatureInsertionGridNo = 13005;
      break;
    case Enum123.SEC_G8:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_F8:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_G9:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_WEST;
      break;
    case Enum123.SEC_F9:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_I14: // ALMA
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      gsCreatureInsertionGridNo = 9726;
      break;
    case Enum123.SEC_I13:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_EAST;
      break;
    case Enum123.SEC_H14:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_SOUTH;
      break;
    case Enum123.SEC_H13:
      gsCreatureInsertionCode = Enum175.INSERTION_CODE_EAST;
      break;
    default:
      return;
  }
  gubSectorIDOfCreatureAttack = ubSectorID;
}

export function CreatureAttackTown(ubSectorID: UINT8, fOverrideTest: boolean): void {
  // This is the launching point of the creature attack.
  let pSector: Pointer<UNDERGROUND_SECTORINFO>;
  let ubSectorX: UINT8;
  let ubSectorY: UINT8;

  if (gfWorldLoaded && gTacticalStatus.fEnemyInSector) {
    // Battle currently in progress, repost the event
    AddStrategicEvent(Enum132.EVENT_CREATURE_ATTACK, GetWorldTotalMin() + Random(10), ubSectorID);
    return;
  }

  gubCreatureBattleCode = Enum129.CREATURE_BATTLE_CODE_NONE;

  ubSectorX = ((ubSectorID % 16) + 1);
  ubSectorY = ((ubSectorID / 16) + 1);

  if (!fOverrideTest) {
    // Record the number of creatures in the sector.
    pSector = FindUnderGroundSector(ubSectorX, ubSectorY, 1);
    if (!pSector) {
      CreatureAttackTown(ubSectorID, true);
      return;
    }
    gubNumCreaturesAttackingTown = pSector.value.ubNumCreatures;
    if (!gubNumCreaturesAttackingTown) {
      CreatureAttackTown(ubSectorID, true);
      return;
    }

    pSector.value.ubNumCreatures = 0;

    // Choose one of the town sectors to attack.  Sectors closer to
    // the mine entrance have a greater chance of being chosen.
    ChooseTownSectorToAttack(ubSectorID, false);
    ubSectorX = ((gubSectorIDOfCreatureAttack % 16) + 1);
    ubSectorY = ((gubSectorIDOfCreatureAttack / 16) + 1);
  } else {
    ChooseTownSectorToAttack(ubSectorID, true);
    gubNumCreaturesAttackingTown = 5;
  }

  // Now that the sector has been chosen, attack it!
  if (PlayerGroupsInSector(ubSectorX, ubSectorY, 0)) {
    // we have players in the sector
    if (ubSectorX == gWorldSectorX && ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      // This is the currently loaded sector.  All we have to do is change the music and insert
      // the creatures tactically.
      if (guiCurrentScreen == Enum26.GAME_SCREEN) {
        gubCreatureBattleCode = Enum129.CREATURE_BATTLE_CODE_TACTICALLYADD;
      } else {
        gubCreatureBattleCode = Enum129.CREATURE_BATTLE_CODE_PREBATTLEINTERFACE;
      }
    } else {
      gubCreatureBattleCode = Enum129.CREATURE_BATTLE_CODE_PREBATTLEINTERFACE;
    }
  } else if (CountAllMilitiaInSector(ubSectorX, ubSectorY)) {
    // we have militia in the sector
    gubCreatureBattleCode = Enum129.CREATURE_BATTLE_CODE_AUTORESOLVE;
  } else if (!StrategicMap[ubSectorX + MAP_WORLD_X * ubSectorY].fEnemyControlled) {
    // player controlled sector -- eat some civilians
    AdjustLoyaltyForCivsEatenByMonsters(ubSectorX, ubSectorY, gubNumCreaturesAttackingTown);
    SectorInfo[ubSectorID].ubDayOfLastCreatureAttack = GetWorldDay();
    return;
  } else {
    // enemy controlled sectors don't get attacked.
    return;
  }

  SectorInfo[ubSectorID].ubDayOfLastCreatureAttack = GetWorldDay();
  switch (gubCreatureBattleCode) {
    case Enum129.CREATURE_BATTLE_CODE_PREBATTLEINTERFACE:
      InitPreBattleInterface(null, true);
      break;
    case Enum129.CREATURE_BATTLE_CODE_AUTORESOLVE:
      gfAutomaticallyStartAutoResolve = true;
      InitPreBattleInterface(null, true);
      break;
    case Enum129.CREATURE_BATTLE_CODE_TACTICALLYADD:
      PrepareCreaturesForBattle();
      break;
  }
  InterruptTime();
  PauseGame();
  LockPauseState(2);
}

// Called by campaign init.
function ChooseCreatureQuestStartDay(): void {
  //	INT32 iRandom, iDay;
  if (!gGameOptions.fSciFi)
    return; // only available in science fiction mode.
  // Post the event.  Once it becomes due, it will setup the queen monster's location, and
  // begin spreading and attacking towns from there.
  switch (gGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      // AddPeriodStrategicEvent( EVENT_BEGIN_CREATURE_QUEST, (EASY_QUEEN_START_DAY + Random( 1 + EASY_QUEEN_START_BONUS )) * 1440 , 0 );
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      // AddPeriodStrategicEvent( EVENT_BEGIN_CREATURE_QUEST, (NORMAL_QUEEN_START_DAY + Random( 1 + NORMAL_QUEEN_START_BONUS )) * 1440, 0 );
      break;
    case Enum9.DIF_LEVEL_HARD:
      // AddPeriodStrategicEvent( EVENT_BEGIN_CREATURE_QUEST, (HARD_QUEEN_START_DAY + Random( 1 + HARD_QUEEN_START_BONUS )) * 1440, 0 );
      break;
  }
}

function DeleteDirectiveNode(node: Pointer<Pointer<CREATURE_DIRECTIVE>>): void {
  if ((node.value).value.next)
    DeleteDirectiveNode(addressof((node.value).value.next));
  MemFree(node.value);
  node.value = null;
}

// Recursively delete all nodes (from the top down).
export function DeleteCreatureDirectives(): void {
  if (lair)
    DeleteDirectiveNode(addressof(lair));
  giLairID = 0;
}

function ClearCreatureQuest(): void {
  // This will remove all of the underground sector information and reinitialize it.
  // The only part that doesn't get added are the queen's lair.
  BuildUndergroundSectorInfoList();
  DeleteAllStrategicEventsOfType(Enum132.EVENT_BEGIN_CREATURE_QUEST);
  DeleteCreatureDirectives();
}

export function EndCreatureQuest(): void {
  let curr: Pointer<CREATURE_DIRECTIVE>;
  let pSector: Pointer<UNDERGROUND_SECTORINFO>;
  let i: INT32;

  // By setting the lairID to -1, when it comes time to spread creatures,
  // They will get subtracted instead.
  giDestroyedLairID = giLairID;
  giLairID = -1;

  // Also nuke all of the creatures in all of the other mine sectors.  This
  // is keyed on the fact that the queen monster is killed.
  curr = lair;
  if (curr) {
    // skip first node (there could be other creatures around.
    curr = curr.value.next;
  }
  while (curr) {
    curr.value.pLevel.value.ubNumCreatures = 0;
    curr = curr.value.next;
  }

  // Remove the creatures that are trapped underneath Tixa
  pSector = FindUnderGroundSector(9, 10, 2);
  if (pSector) {
    pSector.value.ubNumCreatures = 0;
  }

  // Also find and nuke all creatures on any surface levels!!!
  // KM: Sept 3, 1999 patch
  for (i = 0; i < 255; i++) {
    SectorInfo[i].ubNumCreatures = 0;
    SectorInfo[i].ubCreaturesInBattle = 0;
  }
}

function CreaturesInUndergroundSector(ubSectorID: UINT8, ubSectorZ: UINT8): UINT8 {
  let pSector: Pointer<UNDERGROUND_SECTORINFO>;
  let ubSectorX: UINT8;
  let ubSectorY: UINT8;
  ubSectorX = SECTORX(ubSectorID);
  ubSectorY = SECTORY(ubSectorID);
  pSector = FindUnderGroundSector(ubSectorX, ubSectorY, ubSectorZ);
  if (pSector)
    return pSector.value.ubNumCreatures;
  return 0;
}

export function MineClearOfMonsters(ubMineIndex: UINT8): boolean {
  Assert((ubMineIndex >= 0) && (ubMineIndex < Enum179.MAX_NUMBER_OF_MINES));

  if (!gMineStatus[ubMineIndex].fPrevInvadedByMonsters) {
    switch (ubMineIndex) {
      case Enum179.MINE_GRUMM:
        if (CreaturesInUndergroundSector(Enum123.SEC_H3, 1))
          return false;
        if (CreaturesInUndergroundSector(Enum123.SEC_I3, 1))
          return false;
        if (CreaturesInUndergroundSector(Enum123.SEC_I3, 2))
          return false;
        if (CreaturesInUndergroundSector(Enum123.SEC_H3, 2))
          return false;
        if (CreaturesInUndergroundSector(Enum123.SEC_H4, 2))
          return false;
        break;
      case Enum179.MINE_CAMBRIA:
        if (CreaturesInUndergroundSector(Enum123.SEC_H8, 1))
          return false;
        if (CreaturesInUndergroundSector(Enum123.SEC_H9, 1))
          return false;
        break;
      case Enum179.MINE_ALMA:
        if (CreaturesInUndergroundSector(Enum123.SEC_I14, 1))
          return false;
        if (CreaturesInUndergroundSector(Enum123.SEC_J14, 1))
          return false;
        break;
      case Enum179.MINE_DRASSEN:
        if (CreaturesInUndergroundSector(Enum123.SEC_D13, 1))
          return false;
        if (CreaturesInUndergroundSector(Enum123.SEC_E13, 1))
          return false;
        break;
      case Enum179.MINE_CHITZENA:
      case Enum179.MINE_SAN_MONA:
        // these are never attacked
        break;

      default:
        break;
    }
  } else {
    // mine was previously invaded by creatures.  Don't allow mine production until queen is dead.
    if (giLairID != -1) {
      return false;
    }
  }
  return true;
}

export function DetermineCreatureTownComposition(ubNumCreatures: UINT8, pubNumYoungMales: Pointer<UINT8>, pubNumYoungFemales: Pointer<UINT8>, pubNumAdultMales: Pointer<UINT8>, pubNumAdultFemales: Pointer<UINT8>): void {
  let i: INT32;
  let iRandom: INT32;
  let ubYoungMalePercentage: UINT8 = 10;
  let ubYoungFemalePercentage: UINT8 = 65;
  let ubAdultMalePercentage: UINT8 = 5;
  let ubAdultFemalePercentage: UINT8 = 20;

  // First step is to convert the percentages into the numbers we will use.
  ubYoungFemalePercentage += ubYoungMalePercentage;
  ubAdultMalePercentage += ubYoungFemalePercentage;
  ubAdultFemalePercentage += ubAdultMalePercentage;
  if (ubAdultFemalePercentage != 100) {
    AssertMsg(0, "Percentage for adding creatures don't add up to 100.");
  }
  // Second step is to determine the breakdown of the creatures randomly.
  i = ubNumCreatures;
  while (i--) {
    iRandom = Random(100);
    if (iRandom < ubYoungMalePercentage)
      (pubNumYoungMales.value)++;
    else if (iRandom < ubYoungFemalePercentage)
      (pubNumYoungFemales.value)++;
    else if (iRandom < ubAdultMalePercentage)
      (pubNumAdultMales.value)++;
    else
      (pubNumAdultFemales.value)++;
  }
}

export function DetermineCreatureTownCompositionBasedOnTacticalInformation(pubNumCreatures: Pointer<UINT8>, pubNumYoungMales: Pointer<UINT8>, pubNumYoungFemales: Pointer<UINT8>, pubNumAdultMales: Pointer<UINT8>, pubNumAdultFemales: Pointer<UINT8>): void {
  let pSector: Pointer<SECTORINFO>;
  let i: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  pSector = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
  pubNumCreatures.value = 0;
  pSector.value.ubNumCreatures = 0;
  pSector.value.ubCreaturesInBattle = 0;
  for (i = gTacticalStatus.Team[CREATURE_TEAM].bFirstID; i <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife) {
      switch (pSoldier.value.ubBodyType) {
        case Enum194.ADULTFEMALEMONSTER:
          (pubNumCreatures.value)++;
          (pubNumAdultFemales.value)++;
          break;
        case Enum194.AM_MONSTER:
          (pubNumCreatures.value)++;
          (pubNumAdultMales.value)++;
          break;
        case Enum194.YAF_MONSTER:
          (pubNumCreatures.value)++;
          (pubNumYoungFemales.value)++;
          break;
        case Enum194.YAM_MONSTER:
          (pubNumCreatures.value)++;
          (pubNumYoungMales.value)++;
          break;
      }
    }
  }
}

export function PrepareCreaturesForBattle(): boolean {
  let pSector: Pointer<UNDERGROUND_SECTORINFO>;
  let i: INT32;
  let iRandom: INT32;
  let LColors: SGPPaletteEntry[] /* [3] */;
  let ubNumColors: UINT8;
  let fQueen: boolean;
  let ubLarvaePercentage: UINT8;
  let ubInfantPercentage: UINT8;
  let ubYoungMalePercentage: UINT8;
  let ubYoungFemalePercentage: UINT8;
  let ubAdultMalePercentage: UINT8;
  let ubAdultFemalePercentage: UINT8;
  let ubCreatureHabitat: UINT8;
  let ubNumLarvae: UINT8 = 0;
  let ubNumInfants: UINT8 = 0;
  let ubNumYoungMales: UINT8 = 0;
  let ubNumYoungFemales: UINT8 = 0;
  let ubNumAdultMales: UINT8 = 0;
  let ubNumAdultFemales: UINT8 = 0;
  let ubPercentage: UINT8 = 0;
  let ubNumCreatures: UINT8;

  if (!gubCreatureBattleCode) {
    ubNumColors = LightGetColors(LColors);
    // if( ubNumColors != 1 )
    //	ScreenMsg( FONT_RED, MSG_ERROR, L"This map has more than one light color -- KM, LC : 1" );

    // By default, we only play creature music in the cave levels (the creature levels all consistently
    // have blue lights while human occupied mines have red lights.  We always play creature music
    // when creatures are in the level.
    if (LColors.value.peBlue)
      gfUseCreatureMusic = true;
    else
      gfUseCreatureMusic = false;

    if (!gbWorldSectorZ)
      return false; // Creatures don't attack overworld with this battle code.
    pSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    if (!pSector) {
      return false;
    }
    if (!pSector.value.ubNumCreatures) {
      return false;
    }
    gfUseCreatureMusic = true; // creatures are here, so play creature music
    ubCreatureHabitat = pSector.value.ubCreatureHabitat;
    ubNumCreatures = pSector.value.ubNumCreatures;
  } else {
    // creatures are attacking a town sector
    gfUseCreatureMusic = true;
    SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
    ubCreatureHabitat = Enum128.MINE_EXIT;
    ubNumCreatures = gubNumCreaturesAttackingTown;
  }

  switch (ubCreatureHabitat) {
    case Enum128.QUEEN_LAIR:
      fQueen = true;
      ubLarvaePercentage = 20;
      ubInfantPercentage = 40;
      ubYoungMalePercentage = 0;
      ubYoungFemalePercentage = 0;
      ubAdultMalePercentage = 30;
      ubAdultFemalePercentage = 10;
      break;
    case Enum128.LAIR:
      fQueen = false;
      ubLarvaePercentage = 15;
      ubInfantPercentage = 35;
      ubYoungMalePercentage = 10;
      ubYoungFemalePercentage = 5;
      ubAdultMalePercentage = 25;
      ubAdultFemalePercentage = 10;
      break;
    case Enum128.LAIR_ENTRANCE:
      fQueen = false;
      ubLarvaePercentage = 0;
      ubInfantPercentage = 15;
      ubYoungMalePercentage = 30;
      ubYoungFemalePercentage = 10;
      ubAdultMalePercentage = 35;
      ubAdultFemalePercentage = 10;
      break;
    case Enum128.INNER_MINE:
      fQueen = false;
      ubLarvaePercentage = 0;
      ubInfantPercentage = 0;
      ubYoungMalePercentage = 20;
      ubYoungFemalePercentage = 40;
      ubAdultMalePercentage = 10;
      ubAdultFemalePercentage = 30;
      break;
    case Enum128.OUTER_MINE:
    case Enum128.MINE_EXIT:
      fQueen = false;
      ubLarvaePercentage = 0;
      ubInfantPercentage = 0;
      ubYoungMalePercentage = 10;
      ubYoungFemalePercentage = 65;
      ubAdultMalePercentage = 5;
      ubAdultFemalePercentage = 20;
      break;
    default:
      return false;
  }

  // First step is to convert the percentages into the numbers we will use.
  if (fQueen) {
    ubNumCreatures--;
  }
  ubInfantPercentage += ubLarvaePercentage;
  ubYoungMalePercentage += ubInfantPercentage;
  ubYoungFemalePercentage += ubYoungMalePercentage;
  ubAdultMalePercentage += ubYoungFemalePercentage;
  ubAdultFemalePercentage += ubAdultMalePercentage;
  if (ubAdultFemalePercentage != 100) {
    AssertMsg(0, "Percentage for adding creatures don't add up to 100.");
  }
  // Second step is to determine the breakdown of the creatures randomly.
  i = ubNumCreatures;
  while (i--) {
    iRandom = Random(100);
    if (iRandom < ubLarvaePercentage)
      ubNumLarvae++;
    else if (iRandom < ubInfantPercentage)
      ubNumInfants++;
    else if (iRandom < ubYoungMalePercentage)
      ubNumYoungMales++;
    else if (iRandom < ubYoungFemalePercentage)
      ubNumYoungFemales++;
    else if (iRandom < ubAdultMalePercentage)
      ubNumAdultMales++;
    else
      ubNumAdultFemales++;
  }

  if (gbWorldSectorZ) {
    let pUndergroundSector: Pointer<UNDERGROUND_SECTORINFO>;
    pUndergroundSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    if (!pUndergroundSector) {
      // No info?!!!!!
      AssertMsg(0, "Please report underground sector you are in or going to and send save if possible.  KM : 0");
      return false;
    }
    pUndergroundSector.value.ubCreaturesInBattle = pUndergroundSector.value.ubNumCreatures;
  } else {
    let pSector: Pointer<SECTORINFO>;
    pSector = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
    pSector.value.ubNumCreatures = ubNumCreatures;
    pSector.value.ubCreaturesInBattle = ubNumCreatures;
  }

  switch (gubCreatureBattleCode) {
    case Enum129.CREATURE_BATTLE_CODE_NONE: // in the mines
      AddSoldierInitListCreatures(fQueen, ubNumLarvae, ubNumInfants, ubNumYoungMales, ubNumYoungFemales, ubNumAdultMales, ubNumAdultFemales);
      break;
    case Enum129.CREATURE_BATTLE_CODE_TACTICALLYADD: // creature attacking a town sector
    case Enum129.CREATURE_BATTLE_CODE_PREBATTLEINTERFACE:
      AddCreaturesToBattle(ubNumYoungMales, ubNumYoungFemales, ubNumAdultMales, ubNumAdultFemales);
      break;
    case Enum129.CREATURE_BATTLE_CODE_AUTORESOLVE:
      return false;
  }
  return true;
}

export function CreatureNightPlanning(): void {
  // Check the populations of the mine exits, and factor a chance for them to attack at night.
  let ubNumCreatures: UINT8;
  ubNumCreatures = CreaturesInUndergroundSector(Enum123.SEC_H3, 1);
  if (ubNumCreatures > 1 && ubNumCreatures * 10 > PreRandom(100)) {
    // 10% chance for each creature to decide it's time to attack.
    AddStrategicEvent(Enum132.EVENT_CREATURE_ATTACK, GetWorldTotalMin() + 1 + PreRandom(429), Enum123.SEC_H3);
  }
  ubNumCreatures = CreaturesInUndergroundSector(Enum123.SEC_D13, 1);
  if (ubNumCreatures > 1 && ubNumCreatures * 10 > PreRandom(100)) {
    // 10% chance for each creature to decide it's time to attack.
    AddStrategicEvent(Enum132.EVENT_CREATURE_ATTACK, GetWorldTotalMin() + 1 + PreRandom(429), Enum123.SEC_D13);
  }
  ubNumCreatures = CreaturesInUndergroundSector(Enum123.SEC_I14, 1);
  if (ubNumCreatures > 1 && ubNumCreatures * 10 > PreRandom(100)) {
    // 10% chance for each creature to decide it's time to attack.
    AddStrategicEvent(Enum132.EVENT_CREATURE_ATTACK, GetWorldTotalMin() + 1 + PreRandom(429), Enum123.SEC_I14);
  }
  ubNumCreatures = CreaturesInUndergroundSector(Enum123.SEC_H8, 1);
  if (ubNumCreatures > 1 && ubNumCreatures * 10 > PreRandom(100)) {
    // 10% chance for each creature to decide it's time to attack.
    AddStrategicEvent(Enum132.EVENT_CREATURE_ATTACK, GetWorldTotalMin() + 1 + PreRandom(429), Enum123.SEC_H8);
  }
}

export function CheckConditionsForTriggeringCreatureQuest(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let ubValidMines: UINT8 = 0;
  if (!gGameOptions.fSciFi)
    return; // No scifi, no creatures...
  if (giLairID)
    return; // Creature quest already begun

  // Count the number of "infectible mines" the player occupies
  if (!StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_D13)].fEnemyControlled) {
    ubValidMines++;
  }
  if (!StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_H8)].fEnemyControlled) {
    ubValidMines++;
  }
  if (!StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_I14)].fEnemyControlled) {
    ubValidMines++;
  }
  if (!StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_H3)].fEnemyControlled) {
    ubValidMines++;
  }

  if (ubValidMines >= 3) {
    InitCreatureQuest();
  }
}

export function SaveCreatureDirectives(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;

  FileWrite(hFile, addressof(giHabitatedDistance), 4, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(INT32)) {
    return false;
  }

  FileWrite(hFile, addressof(giPopulationModifier), 4, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(INT32)) {
    return false;
  }
  FileWrite(hFile, addressof(giLairID), 4, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(INT32)) {
    return false;
  }
  FileWrite(hFile, addressof(gfUseCreatureMusic), 1, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(BOOLEAN)) {
    return false;
  }
  FileWrite(hFile, addressof(giDestroyedLairID), 4, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(INT32)) {
    return false;
  }

  return true;
}

export function LoadCreatureDirectives(hFile: HWFILE, uiSavedGameVersion: UINT32): boolean {
  let uiNumBytesRead: UINT32;
  FileRead(hFile, addressof(giHabitatedDistance), 4, addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(INT32)) {
    return false;
  }

  FileRead(hFile, addressof(giPopulationModifier), 4, addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(INT32)) {
    return false;
  }
  FileRead(hFile, addressof(giLairID), 4, addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(INT32)) {
    return false;
  }

  FileRead(hFile, addressof(gfUseCreatureMusic), 1, addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(BOOLEAN)) {
    return false;
  }

  if (uiSavedGameVersion >= 82) {
    FileRead(hFile, addressof(giDestroyedLairID), 4, addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(INT32)) {
      return false;
    }
  } else {
    giDestroyedLairID = 0;
  }

  switch (giLairID) {
    case -1:
      break; // creature quest finished -- it's okay
    case 0:
      break; // lair doesn't exist yet -- it's okay
    case 1:
      InitLairDrassen();
      break;
    case 2:
      InitLairCambria();
      break;
    case 3:
      InitLairAlma();
      break;
    case 4:
      InitLairGrumm();
      break;
    default:
      break;
  }

  return true;
}

export function ForceCreaturesToAvoidMineTemporarily(ubMineIndex: UINT8): void {
  gMineStatus[Enum179.MINE_GRUMM].usValidDayCreaturesCanInfest = (GetWorldDay() + 2);
}

export function PlayerGroupIsInACreatureInfestedMine(): boolean {
  let curr: Pointer<CREATURE_DIRECTIVE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let bSectorZ: INT8;
  let fPlayerInSector: boolean = false;

  if (giLairID <= 0) {
    // Creature quest inactive
    return false;
  }

  // Lair is active, so look for live soldier in any creature level
  curr = lair;
  while (curr) {
    sSectorX = curr.value.pLevel.value.ubSectorX;
    sSectorY = curr.value.pLevel.value.ubSectorY;
    bSectorZ = curr.value.pLevel.value.ubSectorZ;
    // Loop through all the creature directives (mine sectors that are infectible) and
    // see if players are there.
    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      pSoldier = MercPtrs[i];
      if (pSoldier.value.bActive && pSoldier.value.bLife && pSoldier.value.sSectorX == sSectorX && pSoldier.value.sSectorY == sSectorY && pSoldier.value.bSectorZ == bSectorZ && !pSoldier.value.fBetweenSectors) {
        return true;
      }
    }
    curr = curr.value.next;
  }

  // Lair is active, but no mercs are in these sectors
  return false;
}

// Returns TRUE if valid and creature quest over, FALSE if creature quest active or not yet started
export function GetWarpOutOfMineCodes(psSectorX: Pointer<INT16>, psSectorY: Pointer<INT16>, pbSectorZ: Pointer<INT8>, psInsertionGridNo: Pointer<INT16>): boolean {
  let iSwitchValue: INT32;

  if (!gfWorldLoaded) {
    return false;
  }

  if (gbWorldSectorZ == 0) {
    return false;
  }

  iSwitchValue = giLairID;

  if (iSwitchValue == -1) {
    iSwitchValue = giDestroyedLairID;
  }

  if (!iSwitchValue) {
    return false;
  }

  // Now make sure the mercs are in the previously infested mine
  switch (iSwitchValue) {
    case 1: // Drassen
      if (gWorldSectorX == 13 && gWorldSectorY == 6 && gbWorldSectorZ == 3 || gWorldSectorX == 13 && gWorldSectorY == 7 && gbWorldSectorZ == 3 || gWorldSectorX == 13 && gWorldSectorY == 7 && gbWorldSectorZ == 2 || gWorldSectorX == 13 && gWorldSectorY == 6 && gbWorldSectorZ == 2 || gWorldSectorX == 13 && gWorldSectorY == 5 && gbWorldSectorZ == 2 || gWorldSectorX == 13 && gWorldSectorY == 5 && gbWorldSectorZ == 1 || gWorldSectorX == 13 && gWorldSectorY == 4 && gbWorldSectorZ == 1) {
        psSectorX.value = 13;
        psSectorY.value = 4;
        pbSectorZ.value = 0;
        psInsertionGridNo.value = 20700;
        return true;
      }
      break;
    case 3: // Cambria
      if (gWorldSectorX == 8 && gWorldSectorY == 9 && gbWorldSectorZ == 3 || gWorldSectorX == 8 && gWorldSectorY == 8 && gbWorldSectorZ == 3 || gWorldSectorX == 8 && gWorldSectorY == 8 && gbWorldSectorZ == 2 || gWorldSectorX == 9 && gWorldSectorY == 8 && gbWorldSectorZ == 2 || gWorldSectorX == 9 && gWorldSectorY == 8 && gbWorldSectorZ == 1 || gWorldSectorX == 8 && gWorldSectorY == 8 && gbWorldSectorZ == 1) {
        psSectorX.value = 8;
        psSectorY.value = 8;
        pbSectorZ.value = 0;
        psInsertionGridNo.value = 13002;
        return true;
      }
      break;
    case 2: // Alma
      if (gWorldSectorX == 13 && gWorldSectorY == 11 && gbWorldSectorZ == 3 || gWorldSectorX == 13 && gWorldSectorY == 10 && gbWorldSectorZ == 3 || gWorldSectorX == 13 && gWorldSectorY == 10 && gbWorldSectorZ == 2 || gWorldSectorX == 14 && gWorldSectorY == 10 && gbWorldSectorZ == 2 || gWorldSectorX == 14 && gWorldSectorY == 10 && gbWorldSectorZ == 1 || gWorldSectorX == 14 && gWorldSectorY == 9 && gbWorldSectorZ == 1) {
        psSectorX.value = 14;
        psSectorY.value = 9;
        pbSectorZ.value = 0;
        psInsertionGridNo.value = 9085;
        return true;
      }
      break;
    case 4: // Grumm
      if (gWorldSectorX == 4 && gWorldSectorY == 7 && gbWorldSectorZ == 3 || gWorldSectorX == 4 && gWorldSectorY == 8 && gbWorldSectorZ == 3 || gWorldSectorX == 3 && gWorldSectorY == 8 && gbWorldSectorZ == 2 || gWorldSectorX == 3 && gWorldSectorY == 8 && gbWorldSectorZ == 2 || gWorldSectorX == 3 && gWorldSectorY == 9 && gbWorldSectorZ == 2 || gWorldSectorX == 3 && gWorldSectorY == 9 && gbWorldSectorZ == 1 || gWorldSectorX == 3 && gWorldSectorY == 8 && gbWorldSectorZ == 1) {
        psSectorX.value = 3;
        psSectorY.value = 8;
        pbSectorZ.value = 0;
        psInsertionGridNo.value = 9822;
        return true;
      }
      break;
  }
  return false;
}

}
