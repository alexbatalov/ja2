// Smoke effect types
export const enum Enum308 {
  NO_SMOKE_EFFECT,
  NORMAL_SMOKE_EFFECT,
  TEARGAS_SMOKE_EFFECT,
  MUSTARDGAS_SMOKE_EFFECT,
  CREATURE_SMOKE_EFFECT,
}

export const SMOKE_EFFECT_INDOORS = 0x01;
export const SMOKE_EFFECT_ON_ROOF = 0x02;
export const SMOKE_EFFECT_MARK_FOR_UPDATE = 0x04;

export interface SMOKEEFFECT {
  sGridNo: INT16; // gridno at which the tear gas cloud is centered

  ubDuration: UINT8; // the number of turns gas will remain effective
  ubRadius: UINT8; // the current radius of the cloud in map tiles
  bFlags: UINT8; // 0 - outdoors (fast spread), 1 - indoors (slow)
  bAge: INT8; // the number of turns gas has been around
  fAllocated: boolean;
  bType: INT8;
  usItem: UINT16;
  ubOwner: UINT8;
  ubPadding: UINT8;
  uiTimeOfLastUpdate: UINT32;
}
