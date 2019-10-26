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

}
