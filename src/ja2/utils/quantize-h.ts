namespace ja2 {

export interface NODE {
  bIsLeaf: boolean; // TRUE if node has no children
  nPixelCount: UINT32; // Number of pixels represented by this leaf
  nRedSum: UINT32; // Sum of red components
  nGreenSum: UINT32; // Sum of green components
  nBlueSum: UINT32; // Sum of blue components
  pChild: NODE[] /* [8] */; // Pointers to child nodes
  pNext: NODE | null; // Pointer to next reducible node
}

export function createNode(): NODE {
  return {
    bIsLeaf: false,
    nPixelCount: 0,
    nRedSum: 0,
    nGreenSum: 0,
    nBlueSum: 0,
    pChild: createArray(8, <NODE><unknown>null),
    pNext: null,
  };
}

}
