const MAX_AMBIENT_SOUNDS = 100;

const AMB_TOD_DAWN = 0;
const AMB_TOD_DAY = 1;
const AMB_TOD_DUSK = 2;
const AMB_TOD_NIGHT = 3;

interface AMBIENTDATA_STRUCT {
  uiMinTime: UINT32;
  uiMaxTime: UINT32;
  ubTimeCatagory: UINT8;
  zFilename: SGPFILENAME;
  uiVol: UINT32;
}
