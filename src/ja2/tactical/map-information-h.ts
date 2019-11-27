namespace ja2 {

// for use with MAPCREATE_STRUCT.ubEditorSmoothingType
export const enum Enum231 {
  SMOOTHING_NORMAL,
  SMOOTHING_BASEMENT,
  SMOOTHING_CAVES,
}

export interface MAPCREATE_STRUCT {
  // These are the mandatory entry points for a map.  If any of the values are -1, then that means that
  // the point has been specifically not used and that the map is not traversable to or from an adjacent
  // sector in that direction.  The >0 value points must be validated before saving the map.  This is
  // done by simply checking if those points are sittable by mercs, and that you can plot a path from
  // these points to each other.  These values can only be set by the editor : mapinfo tab
  sNorthGridNo: INT16;
  sEastGridNo: INT16;
  sSouthGridNo: INT16;
  sWestGridNo: INT16;
  // This contains the number of individuals in the map.
  // Individuals include NPCs, enemy placements, creatures, civilians, rebels, and animals.
  ubNumIndividuals: UINT8;
  ubMapVersion: UINT8;
  ubRestrictedScrollID: UINT8;
  ubEditorSmoothingType: UINT8; // normal, basement, or caves
  sCenterGridNo: INT16;
  sIsolatedGridNo: INT16;
  bPadding: INT8[] /* [83] */; // I'm sure lots of map info will be added
} // 99 bytes

export function createMapCreateStruct(): MAPCREATE_STRUCT {
  return {
    sNorthGridNo: 0,
    sEastGridNo: 0,
    sSouthGridNo: 0,
    sWestGridNo: 0,
    ubNumIndividuals: 0,
    ubMapVersion: 0,
    ubRestrictedScrollID: 0,
    ubEditorSmoothingType: 0,
    sCenterGridNo: 0,
    sIsolatedGridNo: 0,
    bPadding: createArray(83, 0),
  };
}

export function copyMapCreateStruct(destination: MAPCREATE_STRUCT, source: MAPCREATE_STRUCT) {
  destination.sNorthGridNo = source.sNorthGridNo;
  destination.sEastGridNo = source.sEastGridNo;
  destination.sSouthGridNo = source.sSouthGridNo;
  destination.sWestGridNo = source.sWestGridNo;
  destination.ubNumIndividuals = source.ubNumIndividuals;
  destination.ubMapVersion = source.ubMapVersion;
  destination.ubRestrictedScrollID = source.ubRestrictedScrollID;
  destination.ubEditorSmoothingType = source.ubEditorSmoothingType;
  destination.sCenterGridNo = source.sCenterGridNo;
  destination.sIsolatedGridNo = source.sIsolatedGridNo;
  copyArray(destination.bPadding, source.bPadding);
}

export const MAP_CREATE_STRUCT_SIZE = 100;

export function readMapCreateStruct(o: MAPCREATE_STRUCT, buffer: Buffer, offset: number = 0): number {
  o.sNorthGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sEastGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sSouthGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sWestGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubNumIndividuals = buffer.readUInt8(offset++);
  o.ubMapVersion = buffer.readUInt8(offset++);
  o.ubRestrictedScrollID = buffer.readUInt8(offset++);
  o.ubEditorSmoothingType = buffer.readUInt8(offset++);
  o.sCenterGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sIsolatedGridNo = buffer.readInt16LE(offset); offset += 2;
  offset = readIntArray(o.bPadding, buffer, offset, 1);
  offset++; // padding
  return offset;
}

export function writeMapCreateStruct(o: MAPCREATE_STRUCT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sNorthGridNo, offset);
  offset = buffer.writeInt16LE(o.sEastGridNo, offset);
  offset = buffer.writeInt16LE(o.sSouthGridNo, offset);
  offset = buffer.writeInt16LE(o.sWestGridNo, offset);
  offset = buffer.writeUInt8(o.ubNumIndividuals, offset);
  offset = buffer.writeUInt8(o.ubMapVersion, offset);
  offset = buffer.writeUInt8(o.ubRestrictedScrollID, offset);
  offset = buffer.writeUInt8(o.ubEditorSmoothingType, offset);
  offset = buffer.writeInt16LE(o.sCenterGridNo, offset);
  offset = buffer.writeInt16LE(o.sIsolatedGridNo, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);
  offset = writePadding(buffer, offset, 1); // padding
  return offset;
}

}
