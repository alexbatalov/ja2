interface StrategicMapElement {
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

const enum Enum175 {
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
