namespace ja2 {

const MAX_AMBIENT_SOUNDS = 100;

export const AMB_TOD_DAWN = 0;
export const AMB_TOD_DAY = 1;
export const AMB_TOD_DUSK = 2;
export const AMB_TOD_NIGHT = 3;

export interface AMBIENTDATA_STRUCT {
  uiMinTime: UINT32;
  uiMaxTime: UINT32;
  ubTimeCatagory: UINT8;
  zFilename: SGPFILENAME;
  uiVol: UINT32;
}

}
