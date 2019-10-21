type TILESET_CALLBACK = () => void;

interface TILESET {
  zName: INT16[] /* [32] */;
  TileSurfaceFilenames: CHAR8[][] /* [NUMBEROFTILETYPES][32] */;
  ubAmbientID: UINT8;
  MovementCostFnc: TILESET_CALLBACK;
}
