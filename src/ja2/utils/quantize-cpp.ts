CQuantizer::CQuantizer(UINT nMaxColors, UINT nColorBits) {
  m_pTree = NULL;
  m_nLeafCount = 0;
  for (int i = 0; i <= nColorBits; i++)
    m_pReducibleNodes[i] = NULL;
  m_nMaxColors = nMaxColors;
  m_nColorBits = nColorBits;
}

CQuantizer::~CQuantizer() {
  if (m_pTree != NULL)
    DeleteTree(&m_pTree);
}

BOOL CQuantizer::ProcessImage(BYTE *pData, int iWidth, int iHeight) {
  BYTE *pbBits;
  BYTE r, g, b;
  int i, j;

  pbBits = pData;
  for (i = 0; i < iHeight; i++) {
    for (j = 0; j < iWidth; j++) {
      b = *pbBits++;
      g = *pbBits++;
      r = *pbBits++;
      AddColor(&m_pTree, r, g, b, m_nColorBits, 0, &m_nLeafCount, m_pReducibleNodes);
      while (m_nLeafCount > m_nMaxColors)
        ReduceTree(m_nColorBits, &m_nLeafCount, m_pReducibleNodes);
    }
    // Padding
    // pbBits ++;
  }
  return TRUE;
}

int CQuantizer::GetLeftShiftCount(DWORD dwVal) {
  int nCount = 0;
  for (int i = 0; i < sizeof(DWORD) * 8; i++) {
    if (dwVal & 1)
      nCount++;
    dwVal >>= 1;
  }
  return 8 - nCount;
}

int CQuantizer::GetRightShiftCount(DWORD dwVal) {
  for (int i = 0; i < sizeof(DWORD) * 8; i++) {
    if (dwVal & 1)
      return i;
    dwVal >>= 1;
  }
  return -1;
}

void CQuantizer::AddColor(NODE **ppNode, BYTE r, BYTE g, BYTE b, UINT nColorBits, UINT nLevel, UINT *pLeafCount, NODE **pReducibleNodes) {
  static BYTE mask[8] = {
    0x80,
    0x40,
    0x20,
    0x10,
    0x08,
    0x04,
    0x02,
    0x01,
  };

  //
  // If the node doesn't exist, create it.
  //
  if (*ppNode == NULL)
    *ppNode = CreateNode(nLevel, nColorBits, pLeafCount, pReducibleNodes);

  //
  // Update color information if it's a leaf node.
  //
  if ((*ppNode).value.bIsLeaf) {
    (*ppNode).value.nPixelCount++;
    (*ppNode).value.nRedSum += r;
    (*ppNode).value.nGreenSum += g;
    (*ppNode).value.nBlueSum += b;
  }

  //
  // Recurse a level deeper if the node is not a leaf.
  //
  else {
    int shift = 7 - nLevel;
    int nIndex = (((r & mask[nLevel]) >> shift) << 2) | (((g & mask[nLevel]) >> shift) << 1) | ((b & mask[nLevel]) >> shift);
    AddColor(&((*ppNode).value.pChild[nIndex]), r, g, b, nColorBits, nLevel + 1, pLeafCount, pReducibleNodes);
  }
}

NODE *CQuantizer::CreateNode(UINT nLevel, UINT nColorBits, UINT *pLeafCount, NODE **pReducibleNodes) {
  NODE *pNode;

  if ((pNode = HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, sizeof(NODE))) == NULL)
    return NULL;

  pNode.value.bIsLeaf = (nLevel == nColorBits) ? TRUE : FALSE;
  if (pNode.value.bIsLeaf)
    (*pLeafCount)++;
  else {
    pNode.value.pNext = pReducibleNodes[nLevel];
    pReducibleNodes[nLevel] = pNode;
  }
  return pNode;
}

void CQuantizer::ReduceTree(UINT nColorBits, UINT *pLeafCount, NODE **pReducibleNodes) {
  //
  // Find the deepest level containing at least one reducible node.
  //
  for (int i = nColorBits - 1; (i > 0) && (pReducibleNodes[i] == NULL); i--)
    ;

  //
  // Reduce the node most recently added to the list at level i.
  //
  NODE *pNode = pReducibleNodes[i];
  pReducibleNodes[i] = pNode.value.pNext;

  UINT nRedSum = 0;
  UINT nGreenSum = 0;
  UINT nBlueSum = 0;
  UINT nChildren = 0;

  for (i = 0; i < 8; i++) {
    if (pNode.value.pChild[i] != NULL) {
      nRedSum += pNode.value.pChild[i].value.nRedSum;
      nGreenSum += pNode.value.pChild[i].value.nGreenSum;
      nBlueSum += pNode.value.pChild[i].value.nBlueSum;
      pNode.value.nPixelCount += pNode.value.pChild[i].value.nPixelCount;
      HeapFree(GetProcessHeap(), 0, pNode.value.pChild[i]);
      pNode.value.pChild[i] = NULL;
      nChildren++;
    }
  }

  pNode.value.bIsLeaf = TRUE;
  pNode.value.nRedSum = nRedSum;
  pNode.value.nGreenSum = nGreenSum;
  pNode.value.nBlueSum = nBlueSum;
  *pLeafCount -= (nChildren - 1);
}

void CQuantizer::DeleteTree(NODE **ppNode) {
  for (int i = 0; i < 8; i++) {
    if ((*ppNode).value.pChild[i] != NULL)
      DeleteTree(&((*ppNode).value.pChild[i]));
  }
  HeapFree(GetProcessHeap(), 0, *ppNode);
  *ppNode = NULL;
}

void CQuantizer::GetPaletteColors(NODE *pTree, RGBQUAD *prgb, UINT *pIndex) {
  if (pTree.value.bIsLeaf) {
    prgb[*pIndex].rgbRed = ((pTree.value.nRedSum) / (pTree.value.nPixelCount));
    prgb[*pIndex].rgbGreen = ((pTree.value.nGreenSum) / (pTree.value.nPixelCount));
    prgb[*pIndex].rgbBlue = ((pTree.value.nBlueSum) / (pTree.value.nPixelCount));
    prgb[*pIndex].rgbReserved = 0;
    (*pIndex)++;
  } else {
    for (int i = 0; i < 8; i++) {
      if (pTree.value.pChild[i] != NULL)
        GetPaletteColors(pTree.value.pChild[i], prgb, pIndex);
    }
  }
}

UINT CQuantizer::GetColorCount() {
  return m_nLeafCount;
}

void CQuantizer::GetColorTable(RGBQUAD *prgb) {
  UINT nIndex = 0;
  GetPaletteColors(m_pTree, prgb, &nIndex);
}
