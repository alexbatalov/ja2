class CQuantizer {
  protected m_pTree: Pointer<NODE>;
  protected m_nLeafCount: UINT;
  protected m_pReducibleNodes: Pointer<NODE>[] /* [9] */;
  protected m_nMaxColors: UINT;
  protected m_nColorBits: UINT;

  constructor(nMaxColors: UINT, nColorBits: UINT) {
    m_pTree = null;
    m_nLeafCount = 0;
    for (let i: int = 0; i <= nColorBits; i++)
      m_pReducibleNodes[i] = null;
    m_nMaxColors = nMaxColors;
    m_nColorBits = nColorBits;
  }

  dispose(): void {
    if (m_pTree != null)
      DeleteTree(addressof(m_pTree));
  }

  ProcessImage(pData: Pointer<BYTE>, iWidth: int, iHeight: int): boolean {
    let pbBits: Pointer<BYTE>;
    let r: BYTE;
    let g: BYTE;
    let b: BYTE;
    let i: int;
    let j: int;

    pbBits = pData;
    for (i = 0; i < iHeight; i++) {
      for (j = 0; j < iWidth; j++) {
        b = (pbBits++).value;
        g = (pbBits++).value;
        r = (pbBits++).value;
        AddColor(addressof(m_pTree), r, g, b, m_nColorBits, 0, addressof(m_nLeafCount), m_pReducibleNodes);
        while (m_nLeafCount > m_nMaxColors)
          ReduceTree(m_nColorBits, addressof(m_nLeafCount), m_pReducibleNodes);
      }
      // Padding
      // pbBits ++;
    }
    return true;
  }

  GetLeftShiftCount(dwVal: DWORD): int {
    let nCount: int = 0;
    for (let i: int = 0; i < sizeof(DWORD) * 8; i++) {
      if (dwVal & 1)
        nCount++;
      dwVal >>= 1;
    }
    return 8 - nCount;
  }

  GetRightShiftCount(dwVal: DWORD): int {
    for (let i: int = 0; i < sizeof(DWORD) * 8; i++) {
      if (dwVal & 1)
        return i;
      dwVal >>= 1;
    }
    return -1;
  }

  AddColor(ppNode: Pointer<Pointer<NODE>>, r: BYTE, g: BYTE, b: BYTE, nColorBits: UINT, nLevel: UINT, pLeafCount: Pointer<UINT>, pReducibleNodes: Pointer<Pointer<NODE>>): void {
    /* static */ let mask: BYTE[] /* [8] */ = [
      0x80,
      0x40,
      0x20,
      0x10,
      0x08,
      0x04,
      0x02,
      0x01,
    ];

    //
    // If the node doesn't exist, create it.
    //
    if (ppNode.value == null)
      ppNode.value = CreateNode(nLevel, nColorBits, pLeafCount, pReducibleNodes);

    //
    // Update color information if it's a leaf node.
    //
    if ((ppNode.value).value.bIsLeaf) {
      (ppNode.value).value.nPixelCount++;
      (ppNode.value).value.nRedSum += r;
      (ppNode.value).value.nGreenSum += g;
      (ppNode.value).value.nBlueSum += b;
    }

    //
    // Recurse a level deeper if the node is not a leaf.
    //
    else {
      let shift: int = 7 - nLevel;
      let nIndex: int = (((r & mask[nLevel]) >> shift) << 2) | (((g & mask[nLevel]) >> shift) << 1) | ((b & mask[nLevel]) >> shift);
      AddColor(addressof((ppNode.value).value.pChild[nIndex]), r, g, b, nColorBits, nLevel + 1, pLeafCount, pReducibleNodes);
    }
  }

  CreateNode(nLevel: UINT, nColorBits: UINT, pLeafCount: Pointer<UINT>, pReducibleNodes: Pointer<Pointer<NODE>>): Pointer<NODE> {
    let pNode: Pointer<NODE>;

    if ((pNode = HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, sizeof(NODE))) == null)
      return null;

    pNode.value.bIsLeaf = (nLevel == nColorBits) ? true : false;
    if (pNode.value.bIsLeaf)
      (pLeafCount.value)++;
    else {
      pNode.value.pNext = pReducibleNodes[nLevel];
      pReducibleNodes[nLevel] = pNode;
    }
    return pNode;
  }

  ReduceTree(nColorBits: UINT, pLeafCount: Pointer<UINT>, pReducibleNodes: Pointer<Pointer<NODE>>): void {
    //
    // Find the deepest level containing at least one reducible node.
    //
    for (let i: int = nColorBits - 1; (i > 0) && (pReducibleNodes[i] == null); i--)
      ;

    //
    // Reduce the node most recently added to the list at level i.
    //
    let pNode: Pointer<NODE> = pReducibleNodes[i];
    pReducibleNodes[i] = pNode.value.pNext;

    let nRedSum: UINT = 0;
    let nGreenSum: UINT = 0;
    let nBlueSum: UINT = 0;
    let nChildren: UINT = 0;

    for (i = 0; i < 8; i++) {
      if (pNode.value.pChild[i] != null) {
        nRedSum += pNode.value.pChild[i].value.nRedSum;
        nGreenSum += pNode.value.pChild[i].value.nGreenSum;
        nBlueSum += pNode.value.pChild[i].value.nBlueSum;
        pNode.value.nPixelCount += pNode.value.pChild[i].value.nPixelCount;
        HeapFree(GetProcessHeap(), 0, pNode.value.pChild[i]);
        pNode.value.pChild[i] = null;
        nChildren++;
      }
    }

    pNode.value.bIsLeaf = true;
    pNode.value.nRedSum = nRedSum;
    pNode.value.nGreenSum = nGreenSum;
    pNode.value.nBlueSum = nBlueSum;
    pLeafCount.value -= (nChildren - 1);
  }

  DeleteTree(ppNode: Pointer<Pointer<NODE>>): void {
    for (let i: int = 0; i < 8; i++) {
      if ((ppNode.value).value.pChild[i] != null)
        DeleteTree(addressof((ppNode.value).value.pChild[i]));
    }
    HeapFree(GetProcessHeap(), 0, ppNode.value);
    ppNode.value = null;
  }

  GetPaletteColors(pTree: Pointer<NODE>, prgb: Pointer<RGBQUAD>, pIndex: Pointer<UINT>): void {
    if (pTree.value.bIsLeaf) {
      prgb[pIndex.value].rgbRed = ((pTree.value.nRedSum) / (pTree.value.nPixelCount));
      prgb[pIndex.value].rgbGreen = ((pTree.value.nGreenSum) / (pTree.value.nPixelCount));
      prgb[pIndex.value].rgbBlue = ((pTree.value.nBlueSum) / (pTree.value.nPixelCount));
      prgb[pIndex.value].rgbReserved = 0;
      (pIndex.value)++;
    } else {
      for (let i: int = 0; i < 8; i++) {
        if (pTree.value.pChild[i] != null)
          GetPaletteColors(pTree.value.pChild[i], prgb, pIndex);
      }
    }
  }

  GetColorCount(): UINT {
    return m_nLeafCount;
  }

  GetColorTable(prgb: Pointer<RGBQUAD>): void {
    let nIndex: UINT = 0;
    GetPaletteColors(m_pTree, prgb, addressof(nIndex));
  }
}
