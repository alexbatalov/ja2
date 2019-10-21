const MAX_VEHICLES = 10;

// type of vehicles
const enum Enum279 {
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
const enum Enum281 {
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

extern INT16 sVehicleOrigArmorValues[NUMBER_OF_TYPES_OF_VEHICLES][NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE];

// struct for vehicles
interface VEHICLETYPE {
  pMercPath: PathStPtr; // vehicle's stategic path list
  ubMovementGroup: UINT8; // the movement group this vehicle belongs to
  ubVehicleType: UINT8; // type of vehicle
  sSectorX: INT16; // X position on the Stategic Map
  sSectorY: INT16; // Y position on the Stategic Map
  sSectorZ: INT16;
  fBetweenSectors: BOOLEAN; // between sectors?
  sGridNo: INT16; // location in tactical
  pPassengers: Pointer<SOLDIERTYPE>[] /* [10] */;
  ubDriver: UINT8;
  sInternalHitLocations: INT16[] /* [NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE] */;
  sArmourType: INT16;
  sExternalArmorLocationsStatus: INT16[] /* [NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE] */;
  sCriticalHits: INT16[] /* [NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE] */;
  iOnSound: INT32;
  iOffSound: INT32;
  iMoveSound: INT32;
  iOutOfSound: INT32;
  fFunctional: BOOLEAN;
  fDestroyed: BOOLEAN;
  iMovementSoundID: INT32;
  ubProfileID: UINT8;

  fValid: BOOLEAN;
}

// the list of vehicles
extern VEHICLETYPE *pVehicleList;

// number of vehicles on the list
extern UINT8 ubNumberOfVehicles;

extern INT32 iMvtTypes[];

// get orig armor values for vehicle in this location
// INT16 GetOrigInternalArmorValueForVehicleInLocation( UINT8 ubID, UINT8 ubLocation );
