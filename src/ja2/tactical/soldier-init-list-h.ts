interface SOLDIERINITNODE {
  ubNodeID: UINT8;
  ubSoldierID: UINT8;
  pBasicPlacement: Pointer<BASIC_SOLDIERCREATE_STRUCT>;
  pDetailedPlacement: Pointer<SOLDIERCREATE_STRUCT>;
  pSoldier: Pointer<SOLDIERTYPE>;
  prev: Pointer<SOLDIERINITNODE>;
  next: Pointer<SOLDIERINITNODE>;
}
