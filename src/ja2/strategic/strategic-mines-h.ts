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

export function createMineStatusType(): MINE_STATUS_TYPE {
  return {
    ubMineType: 0,
    filler1: createArray(3, 0),
    uiMaxRemovalRate: 0,
    uiRemainingOreSupply: 0,
    uiOreRunningOutPoint: 0,
    fEmpty: false,
    fRunningOut: false,
    fWarnedOfRunningOut: false,
    fShutDownIsPermanent: false,
    fShutDown: false,
    fPrevInvadedByMonsters: false,
    fSpokeToHeadMiner: false,
    fMineHasProducedForPlayer: false,
    fQueenRetookProducingMine: false,
    fAttackedHeadMiner: false,
    usValidDayCreaturesCanInfest: 0,
    uiTimePlayerProductionStarted: 0,
    filler: createArray(11, 0),
  };
}

export function resetMineStatusType(o: MINE_STATUS_TYPE) {
  o.ubMineType = 0;
  o.filler1.fill(0);
  o.uiMaxRemovalRate = 0;
  o.uiRemainingOreSupply = 0;
  o.uiOreRunningOutPoint = 0;
  o.fEmpty = false;
  o.fRunningOut = false;
  o.fWarnedOfRunningOut = false;
  o.fShutDownIsPermanent = false;
  o.fShutDown = false;
  o.fPrevInvadedByMonsters = false;
  o.fSpokeToHeadMiner = false;
  o.fMineHasProducedForPlayer = false;
  o.fQueenRetookProducingMine = false;
  o.fAttackedHeadMiner = false;
  o.usValidDayCreaturesCanInfest = 0;
  o.uiTimePlayerProductionStarted = 0;
  o.filler.fill(0);
}

export const MINE_STATUS_TYPE_SIZE = 44;

export function readMineStatusType(o: MINE_STATUS_TYPE, buffer: Buffer, offset: number = 0): number {
  o.ubMineType = buffer.readUInt8(offset++);
  offset = readUIntArray(o.filler1, buffer, offset, 1);
  o.uiMaxRemovalRate = buffer.readUInt32LE(offset); offset += 4;
  o.uiRemainingOreSupply = buffer.readUInt32LE(offset); offset += 4;
  o.uiOreRunningOutPoint = buffer.readUInt32LE(offset); offset += 4;
  o.fEmpty = Boolean(buffer.readUInt8(offset++));
  o.fRunningOut = Boolean(buffer.readUInt8(offset++));
  o.fWarnedOfRunningOut = Boolean(buffer.readUInt8(offset++));
  o.fShutDownIsPermanent = Boolean(buffer.readUInt8(offset++));
  o.fShutDown = Boolean(buffer.readUInt8(offset++));
  o.fPrevInvadedByMonsters = Boolean(buffer.readUInt8(offset++));
  o.fSpokeToHeadMiner = Boolean(buffer.readUInt8(offset++));
  o.fMineHasProducedForPlayer = Boolean(buffer.readUInt8(offset++));
  o.fQueenRetookProducingMine = Boolean(buffer.readUInt8(offset++));
  o.fAttackedHeadMiner = Boolean(buffer.readUInt8(offset++));
  o.usValidDayCreaturesCanInfest = buffer.readUInt16LE(offset); offset += 2;
  o.uiTimePlayerProductionStarted = buffer.readUInt32LE(offset); offset += 4;
  offset = readUIntArray(o.filler, buffer, offset, 1);
  offset++; // padding;
  return offset;
}

export function writeMineStatusType(o: MINE_STATUS_TYPE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubMineType, offset);
  offset = writeUIntArray(o.filler1, buffer, offset, 1);
  offset = buffer.writeUInt32LE(o.uiMaxRemovalRate, offset);
  offset = buffer.writeUInt32LE(o.uiRemainingOreSupply, offset);
  offset = buffer.writeUInt32LE(o.uiOreRunningOutPoint, offset);
  offset = buffer.writeUInt8(Number(o.fEmpty), offset);
  offset = buffer.writeUInt8(Number(o.fRunningOut), offset);
  offset = buffer.writeUInt8(Number(o.fWarnedOfRunningOut), offset);
  offset = buffer.writeUInt8(Number(o.fShutDownIsPermanent), offset);
  offset = buffer.writeUInt8(Number(o.fShutDown), offset);
  offset = buffer.writeUInt8(Number(o.fPrevInvadedByMonsters), offset);
  offset = buffer.writeUInt8(Number(o.fSpokeToHeadMiner), offset);
  offset = buffer.writeUInt8(Number(o.fMineHasProducedForPlayer), offset);
  offset = buffer.writeUInt8(Number(o.fQueenRetookProducingMine), offset);
  offset = buffer.writeUInt8(Number(o.fAttackedHeadMiner), offset);
  offset = buffer.writeUInt16LE(o.usValidDayCreaturesCanInfest, offset);
  offset = buffer.writeUInt32LE(o.uiTimePlayerProductionStarted, offset);
  offset = writeUIntArray(o.filler, buffer, offset, 1);
  offset = writePadding(buffer, offset, 1);
  return offset;
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
