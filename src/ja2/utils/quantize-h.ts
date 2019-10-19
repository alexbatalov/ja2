interface NODE {
  bIsLeaf: BOOL; // TRUE if node has no children
  nPixelCount: UINT; // Number of pixels represented by this leaf
  nRedSum: UINT; // Sum of red components
  nGreenSum: UINT; // Sum of green components
  nBlueSum: UINT; // Sum of blue components
  pChild: Pointer<NODE>[] /* [8] */; // Pointers to child nodes
  pNext: Pointer<NODE>; // Pointer to next reducible node
}

class CQuantizer {
protected:
  NODE *m_pTree;
  UINT m_nLeafCount;
  NODE *m_pReducibleNodes[9];
  UINT m_nMaxColors;
  UINT m_nColorBits;

public:
  CQuantizer(UINT nMaxColors, UINT nColorBits);
  virtual ~CQuantizer();
  ProcessImage(BYTE *pData, int iWidth, int iHeight);
  UINT GetColorCount();
  void GetColorTable(RGBQUAD *prgb);

protected:
  int GetLeftShiftCount(DWORD dwVal);
  int GetRightShiftCount(DWORD dwVal);
  void AddColor(NODE **ppNode, BYTE r, BYTE g, BYTE b, UINT nColorBits, UINT nLevel, UINT *pLeafCount, NODE **pReducibleNodes);
  NODE *CreateNode(UINT nLevel, UINT nColorBits, UINT *pLeafCount, NODE **pReducibleNodes);
  void ReduceTree(UINT nColorBits, UINT *pLeafCount, NODE **pReducibleNodes);
  void DeleteTree(NODE **ppNode);
  void GetPaletteColors(NODE *pTree, RGBQUAD *prgb, UINT *pIndex);
};
