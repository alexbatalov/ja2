namespace ja2 {

export interface SOLDIERINITNODE {
  ubNodeID: UINT8;
  ubSoldierID: UINT8;
  pBasicPlacement: BASIC_SOLDIERCREATE_STRUCT;
  pDetailedPlacement: SOLDIERCREATE_STRUCT | null;
  pSoldier: SOLDIERTYPE | null;
  prev: SOLDIERINITNODE | null;
  next: SOLDIERINITNODE | null;
}

export function createSoldierInitNode(): SOLDIERINITNODE {
  return {
    ubNodeID: 0,
    ubSoldierID: 0,
    pBasicPlacement: <BASIC_SOLDIERCREATE_STRUCT><unknown>null,
    pDetailedPlacement: null,
    pSoldier: null,
    prev: null,
    next: null,
  }
}

}
