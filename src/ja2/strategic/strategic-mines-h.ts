namespace ja2 {

// the .h to the mine management system

// the mines
export const enum Enum179 {
  MINE_SAN_MONA = 0,
  MINE_DRASSEN,
  MINE_ALMA,
  MINE_CAMBRIA,
  MINE_CHITZENA,
  MINE_GRUMM,
  MAX_NUMBER_OF_MINES,
}

export const enum Enum180 {
  MINER_FRED = 0,
  MINER_MATT,
  MINER_OSWALD,
  MINER_CALVIN,
  MINER_CARL,
  NUM_HEAD_MINERS,
}

// different types of mines
export const enum Enum181 {
  SILVER_MINE = 0,
  GOLD_MINE,
  NUM_MINE_TYPES,
}

// monster infestatation level, as percieved by the villagers
const enum Enum182 {
  MINES_NO_MONSTERS = 0, // nothing there at all
  MINES_TRACE_MONSTERS, // monsters leave traces behind, but no one has seen them yet
  MINES_SOME_MONSTERS, // there have been sightings but no one believes the witnesses
  MINES_MODERATE_MONSTERS, // scattered reports of monsters in lower levels, leaves workers uneasy
  MINES_HIGH_MONSTERS, // workers know they are there and all but a few refuse to work
  MINES_RAMPANT_MONSTERS, // the few that go down don't seem to return, no one wants to work period
  MINES_MONSTERS_SURFACE, // monsters are coming out of the mines into the town looking for any edibles
}

// head miner quote types
export const enum Enum183 {
  HEAD_MINER_STRATEGIC_QUOTE_RUNNING_OUT = 0,
  HEAD_MINER_STRATEGIC_QUOTE_CREATURES_ATTACK,
  HEAD_MINER_STRATEGIC_QUOTE_CREATURES_GONE,
  HEAD_MINER_STRATEGIC_QUOTE_CREATURES_AGAIN,
  NUM_HEAD_MINER_STRATEGIC_QUOTES,
}

// the strategic mine structures
export interface MINE_LOCATION_TYPE {
  sSectorX: INT16; // x value of sector mine is in
  sSectorY: INT16; // y value of sector mine is in
  bAssociatedTown: INT8; // associated town of this mine
}

export function createMineLocationTypeFrom(sSectorX: INT16, sSectorY: INT16, bAssociatedTown: INT8): MINE_LOCATION_TYPE {
  return {
    sSectorX,
    sSectorY,
    bAssociatedTown,
  };
}

export interface MINE_STATUS_TYPE {
  ubMineType: UINT8; // type of mine (silver or gold)
  filler1: BYTE[] /* [3] */;
  uiMaxRemovalRate: UINT32; // fastest rate we can move ore from this mine in period

  uiRemainingOreSupply: UINT32; // the total value left to this mine (-1 means unlimited)
  uiOreRunningOutPoint: UINT32; // when supply drop below this, workers tell player the mine is running out of ore

  fEmpty: boolean; // whether no longer minable
  fRunningOut: boolean; // whether mine is beginning to run out
  fWarnedOfRunningOut: boolean; // whether mine foreman has already told player the mine's running out
  fShutDownIsPermanent: boolean; // means will never produce again in the game (head miner was attacked & died/quit)
  fShutDown: boolean; // TRUE means mine production has been shut off
  fPrevInvadedByMonsters: boolean; // whether or not mine has been previously invaded by monsters
  fSpokeToHeadMiner: boolean; // player doesn't receive income from mine without speaking to the head miner first
  fMineHasProducedForPlayer: boolean; // player has earned income from this mine at least once

  fQueenRetookProducingMine: boolean; // whether or not queen ever retook a mine after a player had produced from it
  fAttackedHeadMiner: boolean; // player has attacked the head miner, shutting down mine & decreasing loyalty
  usValidDayCreaturesCanInfest: UINT16; // Creatures will be permitted to spread if the game day is greater than this value.
  uiTimePlayerProductionStarted: UINT32; // time in minutes when 'fMineHasProducedForPlayer' was first set

  filler: BYTE[] /* [11] */; // reserved for expansion
}

export interface HEAD_MINER_TYPE {
  usProfileId: UINT16;
  bQuoteNum: INT8[] /* [NUM_HEAD_MINER_STRATEGIC_QUOTES] */;
  ubExternalFace: UINT8;
}

export function createHeadMinerTypeFrom(usProfileId: UINT16, bQuoteNum: INT8[], ubExternalFace: UINT8): HEAD_MINER_TYPE {
  return {
    usProfileId,
    bQuoteNum,
    ubExternalFace,
  };
}

}
