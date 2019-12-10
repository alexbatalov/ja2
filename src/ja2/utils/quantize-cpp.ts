namespace ja2 {

export class CQuantizer {
  protected m_pTree: NODE;
  protected m_nLeafCount: UINT32;
  protected m_pReducibleNodes: NODE[] /* [9] */;
  protected m_nMaxColors: UINT32;
  protected m_nColorBits: UINT32;

  constructor(nMaxColors: UINT32, nColorBits: UINT32) {
    this.m_pTree = <NODE><unknown>null;
    this.m_nLeafCount = 0;
    this.m_pReducibleNodes = createArray(9, <NODE><unknown>null);
    this.m_nMaxColors = nMaxColors;
    this.m_nColorBits = nColorBits;
  }

  ProcessImage(pData: Uint8ClampedArray, iWidth: number, iHeight: number): boolean {
    let pbBits: number;
    let r: BYTE;
    let g: BYTE;
    let b: BYTE;
    let i: number;
    let j: number;

    pbBits = 0;
    for (i = 0; i < iHeight; i++) {
      for (j = 0; j < iWidth; j++) {
        b = pData[pbBits++];
        g = pData[pbBits++];
        r = pData[pbBits++];
        this.AddColor(createPointer(() => this.m_pTree, (v) => this.m_pTree = v), r, g, b, this.m_nColorBits, 0, createPointer(() => this.m_nLeafCount, (v) => this.m_nLeafCount = v), this.m_pReducibleNodes);
        while (this.m_nLeafCount > this.m_nMaxColors)
          this.ReduceTree(this.m_nColorBits, createPointer(() => this.m_nLeafCount, (v) => this.m_nLeafCount = v), this.m_pReducibleNodes);
      }
      // Padding
      // pbBits ++;
    }
    return true;
  }

  GetLeftShiftCount(dwVal: number): number {
    let nCount: number = 0;
    for (let i: number = 0; i < 4 * 8; i++) {
      if (dwVal & 1)
        nCount++;
      dwVal >>= 1;
    }
    return 8 - nCount;
  }

  GetRightShiftCount(dwVal: number): number {
    for (let i: number = 0; i < 4 * 8; i++) {
      if (dwVal & 1)
        return i;
      dwVal >>= 1;
    }
    return -1;
  }

  AddColor(ppNode: Pointer<NODE | null>, r: BYTE, g: BYTE, b: BYTE, nColorBits: UINT32, nLevel: UINT32, pLeafCount: Pointer<UINT32>, pReducibleNodes: NODE[]): void {
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
      ppNode.value = this.CreateNode(nLevel, nColorBits, pLeafCount, pReducibleNodes);

    //
    // Update color information if it's a leaf node.
    //
    if ((ppNode.value).bIsLeaf) {
      (ppNode.value).nPixelCount++;
      (ppNode.value).nRedSum += r;
      (ppNode.value).nGreenSum += g;
      (ppNode.value).nBlueSum += b;
    }

    //
    // Recurse a level deeper if the node is not a leaf.
    //
    else {
      let shift: number = 7 - nLevel;
      let nIndex: number = (((r & mask[nLevel]) >> shift) << 2) | (((g & mask[nLevel]) >> shift) << 1) | ((b & mask[nLevel]) >> shift);
      this.AddColor(createElementPointer((ppNode.value).pChild, nIndex), r, g, b, nColorBits, nLevel + 1, pLeafCount, pReducibleNodes);
    }
  }

  CreateNode(nLevel: UINT32, nColorBits: UINT32, pLeafCount: Pointer<UINT32>, pReducibleNodes: NODE[]): NODE {
    let pNode: NODE;

    pNode = createNode();

    pNode.bIsLeaf = (nLevel == nColorBits) ? true : false;
    if (pNode.bIsLeaf)
      (pLeafCount.value)++;
    else {
      pNode.pNext = pReducibleNodes[nLevel];
      pReducibleNodes[nLevel] = pNode;
    }
    return pNode;
  }

  ReduceTree(nColorBits: UINT32, pLeafCount: Pointer<UINT32>, pReducibleNodes: NODE[]): void {
    //
    // Find the deepest level containing at least one reducible node.
    //
    let i;
    for (i = nColorBits - 1; (i > 0) && (pReducibleNodes[i] == null); i--)
      ;

    //
    // Reduce the node most recently added to the list at level i.
    //
    let pNode: NODE = pReducibleNodes[i];
    pReducibleNodes[i] = <NODE>pNode.pNext;

    let nRedSum: UINT32 = 0;
    let nGreenSum: UINT32 = 0;
    let nBlueSum: UINT32 = 0;
    let nChildren: UINT32 = 0;

    for (i = 0; i < 8; i++) {
      if (pNode.pChild[i] != null) {
        nRedSum += pNode.pChild[i].nRedSum;
        nGreenSum += pNode.pChild[i].nGreenSum;
        nBlueSum += pNode.pChild[i].nBlueSum;
        pNode.nPixelCount += pNode.pChild[i].nPixelCount;
        pNode.pChild[i] = <NODE><unknown>null;
        nChildren++;
      }
    }

    pNode.bIsLeaf = true;
    pNode.nRedSum = nRedSum;
    pNode.nGreenSum = nGreenSum;
    pNode.nBlueSum = nBlueSum;
    pLeafCount.value -= (nChildren - 1);
  }

  GetPaletteColors(pTree: NODE, prgb: SGPPaletteEntry[], pIndex: Pointer<UINT32>): void {
    if (pTree.bIsLeaf) {
      prgb[pIndex.value].peRed = ((pTree.nRedSum) / (pTree.nPixelCount));
      prgb[pIndex.value].peGreen = ((pTree.nGreenSum) / (pTree.nPixelCount));
      prgb[pIndex.value].peBlue = ((pTree.nBlueSum) / (pTree.nPixelCount));
      prgb[pIndex.value].peFlags = 0;
      (pIndex.value)++;
    } else {
      for (let i: number = 0; i < 8; i++) {
        if (pTree.pChild[i] != null)
          this.GetPaletteColors(pTree.pChild[i], prgb, pIndex);
      }
    }
  }

  GetColorCount(): UINT32 {
    return this.m_nLeafCount;
  }

  GetColorTable(prgb: SGPPaletteEntry[]): void {
    let nIndex: UINT32 = 0;
    this.GetPaletteColors(this.m_pTree, prgb, createPointer(() => nIndex, (v) => nIndex = v));
  }
}

}
