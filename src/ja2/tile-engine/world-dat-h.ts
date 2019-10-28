namespace ja2 {

type TILESET_CALLBACK = () => void;

export interface TILESET {
  zName: string /* INT16[32] */;
  TileSurfaceFilenames: string[] /* CHAR8[NUMBEROFTILETYPES][32] */;
  ubAmbientID: UINT8;
  MovementCostFnc: TILESET_CALLBACK;
}

}
