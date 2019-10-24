// Light effect types
const enum Enum305 {
  NO_LIGHT_EFFECT,
  LIGHT_FLARE_MARK_1,
}

interface LIGHTEFFECT {
  sGridNo: INT16; // gridno at which the tear gas cloud is centered

  ubDuration: UINT8; // the number of turns will remain effective
  bRadius: UINT8; // the current radius
  bAge: INT8; // the number of turns light has been around
  fAllocated: boolean;
  bType: INT8;
  iLight: INT32;
  uiTimeOfLastUpdate: UINT32;
}
