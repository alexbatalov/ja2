namespace ja2 {

export const MAX_VEHICLES = 10;

// type of vehicles
export const enum Enum279 {
  ELDORADO_CAR = 0,
  HUMMER,
  ICE_CREAM_TRUCK,
  JEEP_CAR,
  TANK_CAR,
  HELICOPTER,
  NUMBER_OF_TYPES_OF_VEHICLES,
}

// external armor hit locations
const enum Enum280 {
  FRONT_EXTERNAL_HIT_LOCATION,
  LEFT_EXTERNAL_HIT_LOCATION,
  RIGHT_EXTERNAL_HIT_LOCATION,
  REAR_EXTERNAL_HIT_LOCATION,
  BOTTOM_EXTERNAL_HIT_LOCATION,
  TOP_EXTERNAL_HIT_LOCATION,
  NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE,
}

// internal critical hit locations
export const enum Enum281 {
  ENGINE_HIT_LOCATION,
  CREW_COMPARTMENT_HIT_LOCATION,
  RF_TIRE_HIT_LOCATION,
  LF_TIRE_HIT_LOCATION,
  RR_TIRE_HIT_LOCATION,
  LR_TIRE_HIT_LOCATION,
  GAS_TANK_HIT_LOCATION,
  NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE,
}

// extern STR16 sCritLocationStrings[];

// extern INT8 bInternalCritHitsByLocation[NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE][ NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE ];

// struct for vehicles
export interface VEHICLETYPE {
  pMercPath: PathSt | null; // vehicle's stategic path list
  ubMovementGroup: UINT8; // the movement group this vehicle belongs to
  ubVehicleType: UINT8; // type of vehicle
  sSectorX: INT16; // X position on the Stategic Map
  sSectorY: INT16; // Y position on the Stategic Map
  sSectorZ: INT16;
  fBetweenSectors: boolean; // between sectors?
  sGridNo: INT16; // location in tactical
  pPassengers: SOLDIERTYPE[] /* Pointer<SOLDIERTYPE>[10] */;
  ubDriver: UINT8;
  sInternalHitLocations: INT16[] /* [NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE] */;
  sArmourType: INT16;
  sExternalArmorLocationsStatus: INT16[] /* [NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE] */;
  sCriticalHits: INT16[] /* [NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE] */;
  iOnSound: INT32;
  iOffSound: INT32;
  iMoveSound: INT32;
  iOutOfSound: INT32;
  fFunctional: boolean;
  fDestroyed: boolean;
  iMovementSoundID: INT32;
  ubProfileID: UINT8;

  fValid: boolean;
}

export function createVehicleType(): VEHICLETYPE {
  return {
    pMercPath: null,
    ubMovementGroup: 0,
    ubVehicleType: 0,
    sSectorX: 0,
    sSectorY: 0,
    sSectorZ: 0,
    fBetweenSectors: false,
    sGridNo: 0,
    pPassengers: createArray(10, <SOLDIERTYPE><unknown>null),
    ubDriver: 0,
    sInternalHitLocations: createArray(Enum280.NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE, 0),
    sArmourType: 0,
    sExternalArmorLocationsStatus: createArray(Enum280.NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE, 0),
    sCriticalHits: createArray(Enum281.NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE, 0),
    iOnSound: 0,
    iOffSound: 0,
    iMoveSound: 0,
    iOutOfSound: 0,
    fFunctional: false,
    fDestroyed: false,
    iMovementSoundID: 0,
    ubProfileID: 0,
    fValid: false,
  };
}

export function resetVehicleType(o: VEHICLETYPE) {
  o.pMercPath = null;
  o.ubMovementGroup = 0;
  o.ubVehicleType = 0;
  o.sSectorX = 0;
  o.sSectorY = 0;
  o.sSectorZ = 0;
  o.fBetweenSectors = false;
  o.sGridNo = 0;
  o.pPassengers.fill(<SOLDIERTYPE><unknown>null);
  o.ubDriver = 0;
  o.sInternalHitLocations.fill(0);
  o.sArmourType = 0;
  o.sExternalArmorLocationsStatus.fill(0);
  o.sCriticalHits.fill(0);
  o.iOnSound = 0;
  o.iOffSound = 0;
  o.iMoveSound = 0;
  o.iOutOfSound = 0;
  o.fFunctional = false;
  o.fDestroyed = false;
  o.iMovementSoundID = 0;
  o.ubProfileID = 0;
  o.fValid = false;
}

export function copyVehicleType(destination: VEHICLETYPE, source: VEHICLETYPE) {
  destination.pMercPath = source.pMercPath;
  destination.ubMovementGroup = source.ubMovementGroup;
  destination.ubVehicleType = source.ubVehicleType;
  destination.sSectorX = source.sSectorX;
  destination.sSectorY = source.sSectorY;
  destination.sSectorZ = source.sSectorZ;
  destination.fBetweenSectors = source.fBetweenSectors;
  destination.sGridNo = source.sGridNo;
  copyArray(destination.pPassengers, source.pPassengers);
  destination.ubDriver = source.ubDriver;
  copyArray(destination.sInternalHitLocations, source.sInternalHitLocations);
  destination.sArmourType = source.sArmourType;
  copyArray(destination.sExternalArmorLocationsStatus, source.sExternalArmorLocationsStatus);
  copyArray(destination.sCriticalHits, source.sCriticalHits);
  destination.iOnSound = source.iOnSound;
  destination.iOffSound = source.iOffSound;
  destination.iMoveSound = source.iMoveSound;
  destination.iOutOfSound = source.iOutOfSound;
  destination.fFunctional = source.fFunctional;
  destination.fDestroyed = source.fDestroyed;
  destination.iMovementSoundID = source.iMovementSoundID;
  destination.ubProfileID = source.ubProfileID;
  destination.fValid = source.fValid;
}

export const VEHICLE_TYPE_SIZE = 128;

export function readVehicleType(o: VEHICLETYPE, buffer: Buffer, offset: number = 0): number {
  o.pMercPath = null; offset += 4; // pointer
  o.ubMovementGroup = buffer.readUInt8(offset++);
  o.ubVehicleType = buffer.readUInt8(offset++);
  o.sSectorX = buffer.readInt16LE(offset); offset += 2;
  o.sSectorY = buffer.readInt16LE(offset); offset += 2;
  o.sSectorZ = buffer.readInt16LE(offset); offset += 2;
  o.fBetweenSectors = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  offset = readUIntArray(<number[]><unknown>o.pPassengers, buffer, offset, 4);
  o.ubDriver = buffer.readUInt8(offset++);
  offset++; // padding
  offset = readIntArray(o.sInternalHitLocations, buffer, offset, 2);
  o.sArmourType = buffer.readInt16LE(offset); offset += 2;
  offset = readIntArray(o.sExternalArmorLocationsStatus, buffer, offset, 2);
  offset = readIntArray(o.sCriticalHits, buffer, offset, 2);
  offset += 2; // padding
  o.iOnSound = buffer.readInt32LE(offset); offset += 4;
  o.iOffSound = buffer.readInt32LE(offset); offset += 4;
  o.iMoveSound = buffer.readInt32LE(offset); offset += 4;
  o.iOutOfSound = buffer.readInt32LE(offset); offset += 4;
  o.fFunctional = Boolean(buffer.readUInt8(offset++));
  o.fDestroyed = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding
  o.iMovementSoundID = buffer.readInt32LE(offset); offset += 4;
  o.ubProfileID = buffer.readUInt8(offset++);
  o.fValid = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding
  return offset;
}

export function writeVehicleType(o: VEHICLETYPE, buffer: Buffer, offset: number = 0): number {
  offset = writePadding(buffer, offset, 4); // pMercPath (pointer)
  offset = buffer.writeUInt8(o.ubMovementGroup, offset);
  offset = buffer.writeUInt8(o.ubVehicleType, offset);
  offset = buffer.writeInt16LE(o.sSectorX, offset);
  offset = buffer.writeInt16LE(o.sSectorY, offset);
  offset = buffer.writeInt16LE(o.sSectorZ, offset);
  offset = buffer.writeUInt8(Number(o.fBetweenSectors), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = writeUIntArray(<number[]><unknown>o.pPassengers, buffer, offset, 4);
  offset = buffer.writeUInt8(o.ubDriver, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writeIntArray(o.sInternalHitLocations, buffer, offset, 2);
  offset = buffer.writeInt16LE(o.sArmourType, offset);
  offset = writeIntArray(o.sExternalArmorLocationsStatus, buffer, offset, 2);
  offset = writeIntArray(o.sCriticalHits, buffer, offset, 2);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeInt32LE(o.iOnSound, offset);
  offset = buffer.writeInt32LE(o.iOffSound, offset);
  offset = buffer.writeInt32LE(o.iMoveSound, offset);
  offset = buffer.writeInt32LE(o.iOutOfSound, offset);
  offset = buffer.writeUInt8(Number(o.fFunctional), offset);
  offset = buffer.writeUInt8(Number(o.fDestroyed), offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeInt32LE(o.iMovementSoundID, offset);
  offset = buffer.writeUInt8(o.ubProfileID, offset);
  offset = buffer.writeUInt8(Number(o.fValid), offset);
  offset = writePadding(buffer, offset, 2); // padding
  return offset;
}

// get orig armor values for vehicle in this location
// INT16 GetOrigInternalArmorValueForVehicleInLocation( UINT8 ubID, UINT8 ubLocation );

}
