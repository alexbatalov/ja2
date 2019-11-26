namespace ja2 {

export interface StrategicMapElement {
  UNUSEDuiFootEta: UINT8[] /* [4] */; // eta/mvt costs for feet
  UNUSEDuiVehicleEta: UINT8[] /* [4] */; // eta/mvt costs for vehicles
  uiBadFootSector: UINT8[] /* [4] */; // blocking mvt for foot
  uiBadVehicleSector: UINT8[] /* [4] */; // blocking mvt from vehicles
  bNameId: INT8;
  fEnemyControlled: boolean; // enemy controlled or not
  fEnemyAirControlled: boolean;
  UNUSEDfLostControlAtSomeTime: boolean;
  bSAMCondition: INT8; // SAM Condition .. 0 - 100, just like an item's status
  bPadding: INT8[] /* [20] */;
}

export function createStrategicMapElement(): StrategicMapElement {
  return {
    UNUSEDuiFootEta: createArray(4, 0),
    UNUSEDuiVehicleEta: createArray(4, 0),
    uiBadFootSector: createArray(4, 0),
    uiBadVehicleSector: createArray(4, 0),
    bNameId: 0,
    fEnemyControlled: false,
    fEnemyAirControlled: false,
    UNUSEDfLostControlAtSomeTime: false,
    bSAMCondition: 0,
    bPadding: createArray(20, 0),
  };
}

export function resetStrategicMapElement(o: StrategicMapElement) {
  o.UNUSEDuiFootEta.fill(0);
  o.UNUSEDuiVehicleEta.fill(0);
  o.uiBadFootSector.fill(0);
  o.uiBadVehicleSector.fill(0);
  o.bNameId = 0;
  o.fEnemyControlled = false;
  o.fEnemyAirControlled = false;
  o.UNUSEDfLostControlAtSomeTime = false;
  o.bSAMCondition = 0;
  o.bPadding.fill(0);
}

export const STRATEGIC_MAP_ELEMENT_SIZE = 41;

export function readStrategicMapElement(o: StrategicMapElement, buffer: Buffer, offset: number = 0): number {
  offset = readUIntArray(o.UNUSEDuiFootEta, buffer, offset, 1);
  offset = readUIntArray(o.UNUSEDuiVehicleEta, buffer, offset, 1);
  offset = readUIntArray(o.uiBadFootSector, buffer, offset, 1);
  offset = readUIntArray(o.uiBadVehicleSector, buffer, offset, 1);
  o.bNameId = buffer.readInt8(offset++);
  o.fEnemyControlled = Boolean(buffer.readUInt8(offset++));
  o.fEnemyAirControlled = Boolean(buffer.readUInt8(offset++));
  o.UNUSEDfLostControlAtSomeTime = Boolean(buffer.readUInt8(offset++));
  o.bSAMCondition = buffer.readInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);
  return offset;
}

export function writeStrategicMapElement(o: StrategicMapElement, buffer: Buffer, offset: number = 0): number {
  offset = writeUIntArray(o.UNUSEDuiFootEta, buffer, offset, 1);
  offset = writeUIntArray(o.UNUSEDuiVehicleEta, buffer, offset, 1);
  offset = writeUIntArray(o.uiBadFootSector, buffer, offset, 1);
  offset = writeUIntArray(o.uiBadVehicleSector, buffer, offset, 1);
  offset = buffer.writeInt8(o.bNameId, offset++);
  offset = buffer.writeUInt8(Number(o.fEnemyControlled), offset++);
  offset = buffer.writeUInt8(Number(o.fEnemyAirControlled), offset++);
  offset = buffer.writeUInt8(Number(o.UNUSEDfLostControlAtSomeTime), offset++);
  offset = buffer.writeInt8(o.bSAMCondition, offset++);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);
  return offset;
}

export const enum Enum175 {
  INSERTION_CODE_NORTH,
  INSERTION_CODE_SOUTH,
  INSERTION_CODE_EAST,
  INSERTION_CODE_WEST,
  INSERTION_CODE_GRIDNO,
  INSERTION_CODE_ARRIVING_GAME,
  INSERTION_CODE_CHOPPER,
  INSERTION_CODE_PRIMARY_EDGEINDEX,
  INSERTION_CODE_SECONDARY_EDGEINDEX,
  INSERTION_CODE_CENTER,
}

// PLEASE USE CALCULATE_STRATEGIC_INDEX() macro instead (they're identical).
//#define			GETWORLDMAPNO( x, y )		( x+(MAP_WORLD_X*y) )

}
