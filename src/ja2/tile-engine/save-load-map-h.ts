namespace ja2 {

// Used for the ubType in the MODIFY_MAP struct
export const enum Enum307 {
  SLM_NONE,

  // Adding a map graphic
  SLM_LAND,
  SLM_OBJECT,
  SLM_STRUCT,
  SLM_SHADOW,
  SLM_MERC, // Should never be used
  SLM_ROOF,
  SLM_ONROOF,
  SLM_TOPMOST, // Should never be used

  // For Removing
  SLM_REMOVE_LAND,
  SLM_REMOVE_OBJECT,
  SLM_REMOVE_STRUCT,
  SLM_REMOVE_SHADOW,
  SLM_REMOVE_MERC, // Should never be used
  SLM_REMOVE_ROOF,
  SLM_REMOVE_ONROOF,
  SLM_REMOVE_TOPMOST, // Should never be used

  // Smell, or Blood is used
  SLM_BLOOD_SMELL,

  // Damage a particular struct
  SLM_DAMAGED_STRUCT,

  // Exit Grids
  SLM_EXIT_GRIDS,

  // State of Openable structs
  SLM_OPENABLE_STRUCT,

  // Modify window graphic & structure
  SLM_WINDOW_HIT,
}

export interface MODIFY_MAP {
  usGridNo: UINT16; // The gridno the graphic will be applied to
  usImageType: UINT16; // graphic index
  usSubImageIndex: UINT16; //
  //	UINT16	usIndex;
  ubType: UINT8; // the layer it will be applied to

  ubExtra: UINT8; // Misc. variable used to strore arbritary values
}

export function createModifyMap(): MODIFY_MAP {
  return {
    usGridNo: 0,
    usImageType: 0,
    usSubImageIndex: 0,
    ubType: 0,
    ubExtra: 0,
  };
}

export function resetModifyMap(o: MODIFY_MAP) {
  o.usGridNo = 0;
  o.usImageType = 0;
  o.usSubImageIndex = 0;
  o.ubType = 0;
  o.ubExtra = 0;
}

export const MODIFY_MAP_SIZE = 8;

export function readModifyMap(o: MODIFY_MAP, buffer: Buffer, offset: number = 0): number {
  o.usGridNo = buffer.readUInt16LE(offset); offset += 2;
  o.usImageType = buffer.readUInt16LE(offset); offset += 2;
  o.usSubImageIndex = buffer.readUInt16LE(offset); offset += 2;
  o.ubType = buffer.readUInt8(offset++);
  o.ubExtra = buffer.readUInt8(offset++);
  return offset;
}

export function writeModifyMap(o: MODIFY_MAP, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt16LE(o.usGridNo, offset);
  offset = buffer.writeUInt16LE(o.usImageType, offset);
  offset = buffer.writeUInt16LE(o.usSubImageIndex, offset);
  offset = buffer.writeUInt8(o.ubType, offset);
  offset = buffer.writeUInt8(o.ubExtra, offset);
  return offset;
}

}
