namespace ja2 {

// These are utilities that are used within the editor.  This function absorbs the expensive
// compile time of the SGP dependencies, while allowing the other editor files to hook into it
// without paying, so to speak.

export const enum Enum44 {
  GUI_CLEAR_EVENT,
  GUI_LCLICK_EVENT,
  GUI_RCLICK_EVENT,
  GUI_MOVE_EVENT,
}

// Region Utils
export const NUM_TERRAIN_TILE_REGIONS = 9;
export const enum Enum45 {
  BASE_TERRAIN_TILE_REGION_ID,
  ITEM_REGION_ID = 9 /* NUM_TERRAIN_TILE_REGIONS */,
  MERC_REGION_ID,
}

}
