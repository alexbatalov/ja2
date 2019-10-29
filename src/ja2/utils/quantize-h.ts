namespace ja2 {

export interface NODE {
  bIsLeaf: boolean; // TRUE if node has no children
  nPixelCount: UINT32; // Number of pixels represented by this leaf
  nRedSum: UINT32; // Sum of red components
  nGreenSum: UINT32; // Sum of green components
  nBlueSum: UINT32; // Sum of blue components
  pChild: Pointer<NODE>[] /* [8] */; // Pointers to child nodes
  pNext: Pointer<NODE>; // Pointer to next reducible node
}

}
