namespace ja2 {

export interface BUILDINGLAYOUTNODE {
  next: BUILDINGLAYOUTNODE | null /* Pointer<BUILDINGLAYOUTNODE> */;
  sGridNo: INT16;
}

export function createBuildingLayoutNode(): BUILDINGLAYOUTNODE {
  return {
    next: null,
    sGridNo: 0,
  };
}

}
