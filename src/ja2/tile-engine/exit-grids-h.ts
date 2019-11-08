namespace ja2 {

// for exit grids (object level)
export interface EXITGRID {
  // if an item pool is also in same gridno, then this would be a separate levelnode
  // in the object level list
  usGridNo: UINT16; // sweet spot for placing mercs in new sector.
  ubGotoSectorX: UINT8;
  ubGotoSectorY: UINT8;
  ubGotoSectorZ: UINT8;
}

export function createExitGrid(): EXITGRID {
  return {
    usGridNo: 0,
    ubGotoSectorX: 0,
    ubGotoSectorY: 0,
    ubGotoSectorZ: 0,
  };
}

export function createExitGridFrom(usGridNo: UINT16, ubGotoSectorX: UINT8, ubGotoSectorY: UINT8, ubGotoSectorZ: UINT8): EXITGRID {
  return {
    usGridNo,
    ubGotoSectorX,
    ubGotoSectorY,
    ubGotoSectorZ,
  };
}

}
