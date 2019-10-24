interface NODE {
  bIsLeaf: boolean; // TRUE if node has no children
  nPixelCount: UINT; // Number of pixels represented by this leaf
  nRedSum: UINT; // Sum of red components
  nGreenSum: UINT; // Sum of green components
  nBlueSum: UINT; // Sum of blue components
  pChild: Pointer<NODE>[] /* [8] */; // Pointers to child nodes
  pNext: Pointer<NODE>; // Pointer to next reducible node
}
