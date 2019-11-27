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

export const EXIT_GRID_SIZE = 6;

export function readExitGrid(o: EXITGRID, buffer: Buffer, offset: number = 0): number {
  o.usGridNo = buffer.readUInt16LE(offset); offset += 2;
  o.ubGotoSectorX = buffer.readUInt8(offset++);
  o.ubGotoSectorY = buffer.readUInt8(offset++);
  o.ubGotoSectorZ = buffer.readUInt8(offset++);
  offset++; // padding
  return offset;
}

export function writeExitGrid(o: EXITGRID, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt16LE(o.usGridNo, offset);
  offset = buffer.writeUInt8(o.ubGotoSectorX, offset);
  offset = buffer.writeUInt8(o.ubGotoSectorY, offset);
  offset = buffer.writeUInt8(o.ubGotoSectorZ, offset);
  offset = writePadding(buffer, offset, 1); // padding
  return offset;
}

}
