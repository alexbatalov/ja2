namespace ja2 {

export let ClippingRect: SGPRect = createSGPRectFrom(0, 0, 640, 480);
// 555      565
export let guiTranslucentMask: UINT32 = 0x3def; // 0x7bef;		// mask for halving 5,6,5

// GLOBALS for pre-calculating skip values
let gLeftSkip: INT32;
let gRightSkip: INT32;
let gTopSkip: INT32;
let gBottomSkip: INT32;
let gfUsePreCalcSkips: boolean = false;

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNBClipTranslucent

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        NOT updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("Translucents").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZNBClipTranslucent(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let uiLineFlag: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));
  uiLineFlag = (iTempY & 1);

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:
    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL2

    xor eax, eax
    mov edx, p16BPPPalette
    mov al, [esi]
    mov ax, [edx+eax*2]
    shr eax, 1
    and eax, [guiTranslucentMask]

    xor edx, edx
    mov dx, [edi]
    shr edx, 1
    and edx, [guiTranslucentMask]

    add eax, edx

    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZTranslucent

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("Translucents").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZTranslucent(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let usHeight: UINT32;
  let usWidth: UINT32;
  let uiOffset: UINT32;
  let LineSkip: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let p16BPPPalette: Uint16Array;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let uiLineFlag: UINT32;
  let pTrav: ETRLEObject;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));
  uiLineFlag = (iTempY & 1);

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx
    // mov edx, p16BPPPalette

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:
    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL5

    mov ax, usZValue
    mov [ebx], ax

    xor eax, eax
    mov edx, p16BPPPalette
    mov al, [esi]
    mov ax, [edx+eax*2]
    shr eax, 1
    and eax, guiTranslucentMask

    xor edx, edx
    mov dx, [edi]
    shr edx, 1
    and edx, guiTranslucentMask

    add eax, edx
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    xor uiLineFlag, 1
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNBTranslucent

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        NOT updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("Translucents").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZNBTranslucent(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let usHeight: UINT32;
  let usWidth: UINT32;
  let uiOffset: UINT32;
  let LineSkip: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let p16BPPPalette: Uint16Array;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let uiLineFlag: UINT32;
  let pTrav: ETRLEObject;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));
  uiLineFlag = (iTempY & 1);

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx
    mov edx, p16BPPPalette

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:
    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL5

    xor edx, edx
    xor eax, eax
    mov edx, p16BPPPalette
    mov al, [esi]
    mov ax, [edx+eax*2]
    shr eax, 1
    mov dx, [edi]
    and eax, [guiTranslucentMask]

    shr edx, 1
    and edx, [guiTranslucentMask]

    add eax, edx
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    xor uiLineFlag, 1
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 InitZBuffer

        Allocates and initializes a Z buffer for use with the Z buffer blitters. Doesn't really do
        much except allocate a chunk of memory, and zero it.

**********************************************************************************************/
export function InitZBuffer(uiPitch: UINT32, uiHeight: UINT32): Uint8ClampedArray {
  let pBuffer: Uint8ClampedArray;

  pBuffer = new Uint8ClampedArray(uiPitch * uiHeight);

  return pBuffer;
}

/**********************************************************************************************
 ShutdownZBuffer

        Frees up the memory allocated for the Z buffer.

**********************************************************************************************/
export function ShutdownZBuffer(pBuffer: Uint8ClampedArray): boolean {
  return true;
}

//*****************************************************************************
//** 16 Bit Blitters
//**
//*****************************************************************************

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferMonoShadowClip

        Uses a bitmap an 8BPP template for blitting. Anywhere a 1 appears in the bitmap, a shadow
        is blitted to the destination (a black pixel). Any other value above zero is considered a
        forground color, and zero is background. If the parameter for the background color is zero,
        transparency is used for the background.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferMonoShadowClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null, usForeground: UINT16, usBackground: UINT16, usShadow: UINT16): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;
  let foregroundColor = GetRGBColor(usForeground);
  let shadowColor = GetRGBColor(usShadow);
  let backgroundColor = usBackground ? GetRGBColor(usBackground) : 0x00;
  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];
        if (byte === 0 && backgroundColor === 0) {
          DestPtr += 4;
        } else {
          rgb = (byte === 1 ? shadowColor : (byte ? foregroundColor : backgroundColor));
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;
        }
      }
    }
  }

  return true;
}

/**********************************************************************************************
        Blt16BPPTo16BPP

        Copies a rect of 16 bit data from a video buffer to a buffer position of the brush
        in the data area, for later blitting. Used to copy background information for mercs
        etc. to their unblit buffer, for later reblitting. Does NOT clip.

**********************************************************************************************/
export function Blt16BPPTo16BPP(pDest: Uint8ClampedArray, uiDestPitch: UINT32, pSrc: Uint8ClampedArray, uiSrcPitch: UINT32, iDestXPos: INT32, iDestYPos: INT32, iSrcXPos: INT32, iSrcYPos: INT32, uiWidth: UINT32, uiHeight: UINT32): boolean {
  let pSrcPtr: number;
  let pDestPtr: number;
  let uiLineSkipDest: UINT32;
  let uiLineSkipSrc: UINT32;

  Assert(pDest != null);
  Assert(pSrc != null);

  pSrcPtr = ((iSrcYPos * uiSrcPitch) + (iSrcXPos * 4));
  pDestPtr = ((iDestYPos * uiDestPitch) + (iDestXPos * 4));
  uiLineSkipDest = uiDestPitch - (uiWidth * 4);
  uiLineSkipSrc = uiSrcPitch - (uiWidth * 4);

  let x: number;
  let y: number;
  for (y = 0; y < uiHeight; y++) {
    pDest.set(pSrc.subarray(pSrcPtr, pSrcPtr + uiWidth * 4), pDestPtr);
    pDestPtr += uiWidth * 4;
    pSrcPtr += uiWidth * 4;

    pDestPtr += uiLineSkipDest;
    pSrcPtr += uiLineSkipSrc;
  }

  return true;
}

/**********************************************************************************************
        Blt16BPPTo16BPPTrans

        Copies a rect of 16 bit data from a video buffer to a buffer position of the brush
        in the data area, for later blitting. Used to copy background information for mercs
        etc. to their unblit buffer, for later reblitting. Does NOT clip. Transparent color is
        not copied.

**********************************************************************************************/
export function Blt16BPPTo16BPPTrans(pDest: Uint8ClampedArray, uiDestPitch: UINT32, pSrc: Uint8ClampedArray, uiSrcPitch: UINT32, iDestXPos: INT32, iDestYPos: INT32, iSrcXPos: INT32, iSrcYPos: INT32, uiWidth: UINT32, uiHeight: UINT32, usTrans: UINT16): boolean {
  let pSrcPtr: number;
  let pDestPtr: number;
  let uiLineSkipDest: UINT32;
  let uiLineSkipSrc: UINT32;

  Assert(pDest != null);
  Assert(pSrc != null);

  pSrcPtr = ((iSrcYPos * uiSrcPitch) + (iSrcXPos * 4));
  pDestPtr = ((iDestYPos * uiDestPitch) + (iDestXPos * 4));
  uiLineSkipDest = uiDestPitch - (uiWidth * 4);
  uiLineSkipSrc = uiSrcPitch - (uiWidth * 4);


  let x: number;
  let y: number;
  let rgb = GetRGBColor(usTrans);
  let r = SGPGetRValue(rgb);
  let g = SGPGetGValue(rgb);
  let b = SGPGetBValue(rgb);
  for (y = 0; y < uiHeight; y++) {
    for (x = 0; x < uiWidth; x++) {
      if (pSrc[pSrcPtr] === r && pSrc[pSrcPtr + 1] === g && pSrc[pSrcPtr + 2] === b) {
        pSrcPtr += 4;
        pDestPtr += 4;
      } else {
        pDest[pDestPtr++] = pSrc[pSrcPtr++];
        pDest[pDestPtr++] = pSrc[pSrcPtr++];
        pDest[pDestPtr++] = pSrc[pSrcPtr++];
        pDest[pDestPtr++] = pSrc[pSrcPtr++];
      }
    }

    pDestPtr += uiLineSkipDest;
    pSrcPtr += uiLineSkipSrc;
  }

  return true;
}

/**********************************************************************************************
        Blt16BPPTo16BPPMirror

        Copies a rect of 16 bit data from a video buffer to a buffer position of the brush
        in the data area, for later blitting. Used to copy background information for mercs
        etc. to their unblit buffer, for later reblitting. Does NOT clip.

**********************************************************************************************/
export function Blt16BPPTo16BPPMirror(pDest: Uint8ClampedArray, uiDestPitch: UINT32, pSrc: Uint8ClampedArray, uiSrcPitch: UINT32, iDestXPos: INT32, iDestYPos: INT32, iSrcXPos: INT32, iSrcYPos: INT32, uiWidth: UINT32, uiHeight: UINT32): boolean {
  let pSrcPtr: Pointer<UINT16>;
  let pDestPtr: Pointer<UINT16>;
  let uiLineSkipDest: UINT32;
  let uiLineSkipSrc: UINT32;
  let RightSkip: INT32;
  let LeftSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let clipregion: SGPRect | null = null;

  Assert(pDest != null);
  Assert(pSrc != null);

  // Add to start position of dest buffer
  iTempX = iDestXPos;
  iTempY = iDestYPos;

  if (clipregion == null) {
    ClipX1 = 0; // ClippingRect.iLeft;
    ClipY1 = 0; // ClippingRect.iTop;
    ClipX2 = 640; // ClippingRect.iRight;
    ClipY2 = 480; // ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), uiWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + uiWidth)) - ClipX2, uiWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), uiHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + uiHeight)) - ClipY2, uiHeight);

  iTempX = Math.max(ClipX1, iDestXPos);
  iTempY = Math.max(ClipY1, iDestYPos);

  // calculate the remaining rows and columns to blit
  BlitLength = (uiWidth - LeftSkip - RightSkip);
  BlitHeight = (uiHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= uiWidth) || (RightSkip >= uiWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= uiHeight) || (BottomSkip >= uiHeight))
    return true;

  pSrcPtr = (pSrc + (TopSkip * uiSrcPitch) + (RightSkip * 2));
  pDestPtr = (pDest + (iTempY * uiDestPitch) + (iTempX * 2) + ((BlitLength - 1) * 2));
  uiLineSkipDest = uiDestPitch; //+((BlitLength-1)*2);
  uiLineSkipSrc = uiSrcPitch - (BlitLength * 2);

  asm(`
    mov esi, pSrcPtr
    mov edi, pDestPtr
    mov ebx, BlitHeight

    BlitNewLine:

    mov ecx, BlitLength
    // add edi, ecx
    // add edi, ecx

    BlitNTL2:

    mov ax, [esi]
    mov [edi], ax
    inc esi
    dec edi
    inc esi
    dec edi
    dec ecx
    jnz BlitNTL2

    add edi, BlitLength
    add esi, uiLineSkipSrc
    add edi, BlitLength
    add edi, uiLineSkipDest
    dec ebx
    jnz BlitNewLine
  `);

  return true;
}

/***********************************************************************************************
        Blt8BPPTo8BPP

        Copies a rect of an 8 bit data from a video buffer to a buffer position of the brush
        in the data area, for later blitting. Used to copy background information for mercs
        etc. to their unblit buffer, for later reblitting. Does NOT clip.

**********************************************************************************************/
export function Blt8BPPTo8BPP(pDest: Uint8ClampedArray, uiDestPitch: UINT32, pSrc: Uint8ClampedArray, uiSrcPitch: UINT32, iDestXPos: INT32, iDestYPos: INT32, iSrcXPos: INT32, iSrcYPos: INT32, uiWidth: UINT32, uiHeight: UINT32): boolean {
  let pSrcPtr: Pointer<UINT8>;
  let pDestPtr: Pointer<UINT8>;
  let uiLineSkipDest: UINT32;
  let uiLineSkipSrc: UINT32;

  Assert(pDest != null);
  Assert(pSrc != null);

  pSrcPtr = pSrc + (iSrcYPos * uiSrcPitch) + (iSrcXPos);
  pDestPtr = pDest + (iDestYPos * uiDestPitch) + (iDestXPos);
  uiLineSkipDest = uiDestPitch - (uiWidth);
  uiLineSkipSrc = uiSrcPitch - (uiWidth);

  asm(`
    mov esi, pSrcPtr
    mov edi, pDestPtr
    mov ebx, uiHeight
    cld

    BlitNewLine:
    mov ecx, uiWidth

    clc
    rcr ecx, 1
    jnc Blit2
    movsb

    Blit2:
    clc
    rcr ecx, 1
    jnc Blit3

    movsw

    Blit3:
    or ecx, ecx
    jz BlitLineDone

    rep movsd

    BlitLineDone:

    add edi, uiLineSkipDest
    add esi, uiLineSkipSrc
    dec ebx
    jnz BlitNewLine
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZPixelate

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("pixelates").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZPixelate(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let usHeight: UINT32;
  let usWidth: UINT32;
  let uiOffset: UINT32;
  let LineSkip: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let p16BPPPalette: Uint16Array;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let uiLineFlag: UINT32;
  let pTrav: ETRLEObject;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));
  uiLineFlag = (iTempY & 1);

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx
    mov edx, p16BPPPalette

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:

    test uiLineFlag, 1
    jz BlitNTL6

    test edi, 2
    jz BlitNTL5
    jmp BlitNTL7

    BlitNTL6:
    test edi, 2
    jnz BlitNTL5

    BlitNTL7:
    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL5

    mov ax, usZValue
    mov [ebx], ax

    xor eax, eax
    mov al, [esi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    xor uiLineFlag, 1
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZPixelateObscured

        // OK LIKE NORMAL PIXELATE BUT ONLY PIXELATES STUFF BELOW Z level

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("pixelates").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZPixelateObscured(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let usHeight: UINT32;
  let usWidth: UINT32;
  let uiOffset: UINT32;
  let LineSkip: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let p16BPPPalette: Uint16Array;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let uiLineFlag: UINT32;
  let pTrav: ETRLEObject;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));
  uiLineFlag = (iTempY & 1);

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;
  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      uiLineFlag ^= 1;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) < usZValue) {
          rgb = GetRGBColor(p16BPPPalette[byte]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          if (uiLineFlag & 1) {
            if (DestPtr & 4) {
              rgb = GetRGBColor(p16BPPPalette[byte]);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            if (DestPtr & 4) {
              DestPtr += 4;
            } else {
              rgb = GetRGBColor(p16BPPPalette[byte]);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;

              setZValue(pZBuffer, ZPtr, usZValue);
            }
          }
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNBPixelate

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        NOT updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("pixelates").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZNBPixelate(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let usHeight: UINT32;
  let usWidth: UINT32;
  let uiOffset: UINT32;
  let LineSkip: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let p16BPPPalette: Uint16Array;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let uiLineFlag: UINT32;
  let pTrav: ETRLEObject;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));
  uiLineFlag = (iTempY & 1);

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx
    mov edx, p16BPPPalette

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:

    test uiLineFlag, 1
    jz BlitNTL6

    test edi, 2
    jz BlitNTL5
    jmp BlitNTL7

    BlitNTL6:
    test edi, 2
    jnz BlitNTL5

    BlitNTL7:
    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL5

    // ATE: DONOT WRITE Z VALUE
    // mov ax, usZValue
    // mov [ebx], ax

    xor eax, eax
    mov al, [esi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    xor uiLineFlag, 1
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNBClipPixelate

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        NOT updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("pixelates").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZNBClipPixelate(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let uiLineFlag: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));
  uiLineFlag = (iTempY & 1);

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:

    test uiLineFlag, 1
    jz BlitNTL6

    test edi, 2
    jz BlitNTL2
    jmp BlitNTL7

    BlitNTL6:
    test edi, 2
    jnz BlitNTL2

    BlitNTL7:
    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL2

    // mov ax, usZValue
    // mov [ebx], ax

    xor eax, eax

    mov al, [esi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    xor uiLineFlag, 1
    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZ

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZ(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;
  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          rgb = GetRGBColor(p16BPPPalette[byte]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNB

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on. The Z value is
        NOT updated by this version. The Z-buffer is 16 bit, and	must be the same dimensions
        (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZNB(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;
  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          rgb = GetRGBColor(p16BPPPalette[byte]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNBColor

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on. The Z value is
        NOT updated by this version. The Z-buffer is 16 bit, and	must be the same dimensions
        (including Pitch) as the destination. Any pixels that fail the Z test, are written
        to with the specified color value.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferTransZNBColor(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Uint16Array, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, usColor: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    xor eax, eax

    BlitNTL4:

    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL5

    xor ah, ah
    mov al, [esi]
    mov ax, [edx+eax*2]
    mov [edi], ax
    jmp BlitNTL6

    BlitNTL5:
    mov ax, usColor
    mov [edi], ax

    BlitNTL6:
    inc esi
    inc edi
    inc ebx
    inc edi
    inc ebx
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadow

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. If the source pixel is 254,
        it is considered a shadow, and the destination buffer is darkened rather than blitted on.
        The Z-buffer is 16 bit, and	must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadow(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:

    xor eax, eax
    mov al, [esi]
    cmp al, 254
    jne BlitNTL6

    mov ax, [edi]
    mov ax, ShadeTable[eax*2]
    mov [edi], ax
    jmp BlitNTL5

    BlitNTL6:
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowZ

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. If the source pixel is 254,
        it is considered a shadow, and the destination buffer is darkened rather than blitted on.
        The Z-buffer is 16 bit, and	must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadowZ(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL5

    mov ax, usZValue
    mov [ebx], ax

    xor eax, eax
    mov al, [esi]
    cmp al, 254
    jne BlitNTL6

    mov ax, [edi]
    mov ax, ShadeTable[eax*2]
    mov [edi], ax
    jmp BlitNTL5

    BlitNTL6:
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowZNB

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on. The Z value is NOT
        updated. If the source pixel is 254, it is considered a shadow, and the destination
        buffer is darkened rather than blitted on. The Z-buffer is 16 bit, and must be the same
        dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadowZNB(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let color: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          if (byte === 254) {
            if (getZValue(pZBuffer, ZPtr) < usZValue) {
              color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
              rgb = GetRGBColor(ShadeTable[color]);

              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);

            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;
          }
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowZNBObscured

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on. The Z value is NOT
        updated. If the source pixel is 254, it is considered a shadow, and the destination
        buffer is darkened rather than blitted on. The Z-buffer is 16 bit, and must be the same
        dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadowZNBObscured(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let uiLineFlag: UINT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));
  uiLineFlag = (iTempY & 1);

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let color: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      uiLineFlag ^= 1;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          if (byte === 254) {
            if (getZValue(pZBuffer, ZPtr) < usZValue) {
              color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
              rgb = GetRGBColor(ShadeTable[color]);

              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);

            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;
          }
        } else {
          if (byte === 254) {
            DestPtr += 4;
          } else {
            if (uiLineFlag & 1) {
              if (DestPtr & 4) {
                rgb = GetRGBColor(p16BPPPalette[byte]);

                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              } else {
                DestPtr += 4;
              }
            } else {
              if (DestPtr & 4) {
                DestPtr += 4;
              } else {
                rgb = GetRGBColor(p16BPPPalette[byte]);

                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              }
            }
          }
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowZClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination. Pixels with a value of
        254 are shaded instead of blitted.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadowZClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL2

    mov ax, usZValue
    mov [ebx], ax

    xor eax, eax

    mov al, [esi]
    cmp al, 254
    jne BlitNTL3

    mov ax, [edi]
    mov ax, ShadeTable[eax*2]
    mov [edi], ax
    jmp BlitNTL2

    BlitNTL3:
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination. Pixels with a value of
        254 are shaded instead of blitted.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadowClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:
    xor eax, eax

    mov al, [esi]
    cmp al, 254
    jne BlitNTL3

    mov ax, [edi]
    mov ax, ShadeTable[eax*2]
    mov [edi], ax
    jmp BlitNTL2

    BlitNTL3:
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowZNBClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on.
        The Z-buffer is 16 bit, and	must be the same dimensions (including Pitch) as the
        destination. Pixels with a value of	254 are shaded instead of blitted. The Z buffer is
        NOT updated.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadowZNBClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let color: number;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          if (byte === 254) {
            if (getZValue(pZBuffer, ZPtr) < usZValue) {
              color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
              rgb = GetRGBColor(ShadeTable[color]);

              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);

            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;
          }
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowZNBClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on.
        The Z-buffer is 16 bit, and	must be the same dimensions (including Pitch) as the
        destination. Pixels with a value of	254 are shaded instead of blitted. The Z buffer is
        NOT updated.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransShadowZNBObscuredClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let uiLineFlag: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));
  uiLineFlag = (iTempY & 1);

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let color: number;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
      uiLineFlag ^= 1;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      uiLineFlag ^= 1;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          if (byte === 254) {
            if (getZValue(pZBuffer, ZPtr) < usZValue) {
              color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
              rgb = GetRGBColor(ShadeTable[color]);

              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);

            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;
          }
        } else {
          if (byte === 254) {
            DestPtr += 4;
          } else {
            if (uiLineFlag & 1) {
              if (DestPtr & 4) {
                rgb = GetRGBColor(p16BPPPalette[byte]);

                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              } else {
                DestPtr += 4;
              }
            } else {
              if (DestPtr & 4) {
                DestPtr += 4;
              } else {
                rgb = GetRGBColor(p16BPPPalette[byte]);

                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              }
            }
          }
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransShadowZNBClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below OR EQUAL! that of the current pixel, it is written on.
        The Z-buffer is 16 bit, and	must be the same dimensions (including Pitch) as the
        destination. Pixels with a value of	254 are shaded instead of blitted. The Z buffer is
        NOT updated.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferTransShadowBelowOrEqualZNBClip(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Uint16Array, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null, p16BPPPalette: Uint16Array): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:

    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL2

    xor eax, eax

    mov al, [esi]
    cmp al, 254
    jne BlitNTL3

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL2

    mov ax, [edi]
    mov ax, ShadeTable[eax*2]
    mov [edi], ax
    jmp BlitNTL2

    BlitNTL3:
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferShadowZ

        Creates a shadow using a brush, but modifies the destination buffer only if the current
        Z level is equal to higher than what's in the Z buffer at that pixel location. It
        updates the Z buffer with the new Z level.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferShadowZ(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let color: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) < usZValue) {
          color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
          rgb = GetRGBColor(ShadeTable[color]);

          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferShadowZClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferShadowZClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let color: number;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) < usZValue) {
          color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
          rgb = GetRGBColor(ShadeTable[color]);

          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferShadowZNB

        Creates a shadow using a brush, but modifies the destination buffer only if the current
        Z level is equal to higher than what's in the Z buffer at that pixel location. It does
        NOT update the Z buffer with the new Z value.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferShadowZNB(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET ShadeTable
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL5

    xor eax, eax
    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferShadowZNBClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, the Z value is
        not updated,	for any non-transparent pixels. The Z-buffer is 16 bit, and	must be the
        same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferShadowZNBClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET ShadeTable
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL2

    xor eax, eax

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          rgb = GetRGBColor(p16BPPPalette[byte]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNBClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on. The Z value is NOT
        updated in this version. The Z-buffer is 16 bit, and must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZNBClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          rgb = GetRGBColor(p16BPPPalette[byte]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZNBClipColor

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on. The Z value is NOT
        updated in this version. The Z-buffer is 16 bit, and must be the same dimensions (including
        Pitch) as the destination. Any pixels that fail the Z test are written to with the
        specified pixel value.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferTransZNBClipColor(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Uint16Array, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null, usColor: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx
    xor eax, eax

    BlitNTL1:

    mov ax, [ebx]
    cmp ax, usZValue
    ja BlitNTL2

    xor ah, ah
    mov al, [esi]
    mov ax, [edx+eax*2]
    mov [edi], ax
    jmp BlitNTL3

    BlitNTL2:

    mov ax, usColor
    mov [edi], ax

    BlitNTL3:
    inc esi
    inc edi
    inc ebx
    inc edi
    inc ebx
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataSubTo16BPPBuffer

        Blits a subrect from a flat 8 bit surface to a 16-bit buffer.

**********************************************************************************************/
export function Blt8BPPDataSubTo16BPPBuffer(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVSurface: SGPVSurface, pSrcBuffer: Uint8ClampedArray, uiSrcPitch: UINT32, iX: INT32, iY: INT32, pRect: SGPRect): boolean {
  let p16BPPPalette: Uint16Array;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let LeftSkip: UINT32;
  let RightSkip: UINT32;
  let TopSkip: UINT32;
  let BlitLength: UINT32;
  let SrcSkip: UINT32;
  let BlitHeight: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVSurface != null);
  Assert(pSrcBuffer != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  usHeight = hSrcVSurface.usHeight;
  usWidth = hSrcVSurface.usWidth;

  // Add to start position of dest buffer
  iTempX = iX;
  iTempY = iY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  LeftSkip = pRect.iLeft;
  RightSkip = usWidth - pRect.iRight;
  TopSkip = pRect.iTop * uiSrcPitch;
  BlitLength = pRect.iRight - pRect.iLeft;
  BlitHeight = pRect.iBottom - pRect.iTop;
  SrcSkip = uiSrcPitch - BlitLength;

  SrcPtr = (TopSkip + LeftSkip);
  DestPtr = ((uiDestPitchBYTES * iTempY) + (iTempX * 4));
  p16BPPPalette = hSrcVSurface.p16BPPPalette;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let byte: number;
  let color: number;
  let x: number;
  let y: number;

  for (y = 0; y < BlitHeight; y++) {
    for (x = 0; x < BlitLength; x++) {
      byte = pSrcBuffer[SrcPtr++];
      color = GetRGBColor(p16BPPPalette[byte]);
      pBuffer[DestPtr++] = SGPGetRValue(color);
      pBuffer[DestPtr++] = SGPGetGValue(color);
      pBuffer[DestPtr++] = SGPGetBValue(color);
      pBuffer[DestPtr++] = 0xFF;
    }
    SrcPtr += SrcSkip;
    DestPtr += LineSkip;
  }

  asm(`
    mov esi, SrcPtr // pointer to current line start address in source
    mov edi, DestPtr // pointer to current line start address in destination
    mov ebx, BlitHeight // line counter (goes top to bottom)
    mov edx, p16BPPPalette // conversion table

    sub eax, eax
    sub ecx, ecx

    NewRow:
    mov ecx, BlitLength // pixels to blit count

    BlitLoop:
    mov al, [esi]
    xor ah, ah

    shl eax, 1 // make it into a word index
    mov ax, [edx+eax] // get 16-bit version of 8-bit pixel
    mov [edi], ax // store it in destination buffer

    inc edi
    inc esi
    inc edi
    dec ecx
    jnz BlitLoop

    add esi, SrcSkip // move line pointers down one line
    add edi, LineSkip

    dec ebx // check line counter
    jnz NewRow // done blitting, exit

    // DoneBlit: // finished blit
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBuffer

        Blits from a flat surface to a 16-bit buffer.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBuffer(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVSurface: SGPVSurface, pSrcBuffer: Uint8ClampedArray, iX: INT32, iY: INT32): boolean {
  let p16BPPPalette: Uint16Array;
  //	UINT32 uiOffset;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  //	ETRLEObject *pTrav;
  let iTempX: INT32;
  let iTempY: INT32;
  let rows: UINT32;

  // Assertions
  Assert(hSrcVSurface != null);
  Assert(pSrcBuffer != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  usHeight = hSrcVSurface.usHeight;
  usWidth = hSrcVSurface.usWidth;

  // Add to start position of dest buffer
  iTempX = iX;
  iTempY = iY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = pSrcBuffer;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVSurface.p16BPPPalette;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr // pointer to current line start address in source
    mov edi, DestPtr // pointer to current line start address in destination
    mov ecx, usHeight // line counter (goes top to bottom)
    mov rows, ecx
    mov edx, p16BPPPalette

    sub eax, eax
    sub ecx, ecx

    mov ebx, usWidth // column counter (goes right to left)
    dec ebx

    ReadMask:
    test usWidth, 1
    jz BlitWord

    xor eax, eax // clear out the top 24 bits
    mov al, [esi+ebx]

    shl eax, 1 // make it into a word index
    mov ax, [edx+eax] // get 16-bit version of 8-bit pixel
    mov [edi+ebx*2], ax // store it in destination buffer

    dec ebx
    js DoneRow

    BlitWord:

    test usWidth, 2
    jz SetupDwords

    mov ax, [esi+ebx-1]
    mov cl, ah
    sub ah, ah
    and ecx, 0ffH
    shl eax, 1
    shl ecx, 1
    mov ax, [edx+eax]
    mov cx, [edx+ecx]
    shl ecx, 16
    mov cx, ax
    mov [edi+ebx*2-2], ecx

    sub ebx, 2
    js DoneRow

    SetupDwords:

    BlitDwords:

    mov ax, [esi+ebx-1]
    mov cl, ah
    sub ah, ah
    and ecx, 0ffH
    shl eax, 1
    shl ecx, 1
    mov ax, [edx+eax]
    mov cx, [edx+ecx]
    shl ecx, 16
    mov cx, ax
    mov [edi+ebx*2-2], ecx

    mov ax, [esi+ebx-3]
    mov cl, ah
    sub ah, ah
    and ecx, 0ffH
    shl eax, 1
    shl ecx, 1
    mov ax, [edx+eax]
    mov cx, [edx+ecx]
    shl ecx, 16
    mov cx, ax
    mov [edi+ebx*2-6], ecx

    sub ebx, 4 // decrement column counter
    jns BlitDwords // loop until one line is done

    DoneRow:
    dec rows // check line counter
    jz DoneBlit // done blitting, exit

    add esi, usWidth // move line pointers down one line
    add edi, uiDestPitchBYTES
    mov ebx, usWidth // column counter (goes right to left)
    dec ebx
    jmp ReadMask

    DoneBlit: // finished blit
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferHalf

        Blits from a flat surface to a 16-bit buffer, dividing the source image into
exactly half the size.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferHalf(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVSurface: SGPVSurface, pSrcBuffer: Uint8ClampedArray, uiSrcPitch: UINT32, iX: INT32, iY: INT32): boolean {
  let p16BPPPalette: Uint16Array;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let uiSrcSkip: UINT32;

  // Assertions
  Assert(hSrcVSurface != null);
  Assert(pSrcBuffer != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  usHeight = hSrcVSurface.usHeight;
  usWidth = hSrcVSurface.usWidth;

  // Add to start position of dest buffer
  iTempX = iX;
  iTempY = iY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = 0;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVSurface.p16BPPPalette;
  LineSkip = (uiDestPitchBYTES - (usWidth & 0xfffffffe) * 2);
  uiSrcSkip = (uiSrcPitch * 2) - (usWidth & 0xfffffffe);

  usHeight >>>= 1;
  usWidth >>>= 1;

  let x: number;
  let y: number;
  let byte: number;
  let rgb: number;

  for (y = 0; y < usHeight; y++) {
    for (x = 0; x < usWidth; x++) {
      byte = pSrcBuffer[SrcPtr++];
      SrcPtr++;

      rgb = GetRGBColor(p16BPPPalette[byte]);
      pBuffer[DestPtr++] = SGPGetRValue(rgb);
      pBuffer[DestPtr++] = SGPGetGValue(rgb);
      pBuffer[DestPtr++] = SGPGetBValue(rgb);
      pBuffer[DestPtr++] = 0xFF;
    }

    SrcPtr += uiSrcSkip;
    DestPtr += LineSkip;
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferHalfRect

        Blits from a flat surface to a 16-bit buffer, dividing the source image into
exactly half the size, from a sub-region.
        - Source rect is in source units.
        - In order to make sure the same pixels are skipped, always align the top and
                left coordinates to the same factor of two.
        - A rect specifying an odd number of pixels will divide out to an even
                number of pixels blitted to the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferHalfRect(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVSurface: SGPVSurface, pSrcBuffer: Uint8ClampedArray, uiSrcPitch: UINT32, iX: INT32, iY: INT32, pRect: SGPRect): boolean {
  let p16BPPPalette: Uint16Array;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let iTempX: INT32;
  let iTempY: INT32;
  let uiSrcSkip: UINT32;

  // Assertions
  Assert(hSrcVSurface != null);
  Assert(pSrcBuffer != null);
  Assert(pBuffer != null);
  Assert(pRect != null);

  // Get Offsets from Index into structure
  usWidth = (pRect.iRight - pRect.iLeft);
  usHeight = (pRect.iBottom - pRect.iTop);

  // Add to start position of dest buffer
  iTempX = iX;
  iTempY = iY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }
  if (usWidth <= 0) {
    return false;
  }
  if (usHeight <= 0) {
    return false;
  }
  if (usHeight > hSrcVSurface.usHeight) {
    return false;
  }
  if (usWidth > hSrcVSurface.usWidth) {
    return false;
  }

  SrcPtr = (uiSrcPitch * pRect.iTop) + (pRect.iLeft);
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVSurface.p16BPPPalette;
  LineSkip = (uiDestPitchBYTES - (usWidth & 0xfffffffe) * 2);
  uiSrcSkip = (uiSrcPitch * 2) - (usWidth & 0xfffffffe);

  usHeight >>>= 1;
  usWidth >>>= 1;

  let x: number;
  let y: number;
  let byte: number;
  let rgb: number;

  for (y = 0; y < usHeight; y++) {
    for (x = 0; x < usWidth; x++) {
      byte = pSrcBuffer[SrcPtr++];
      SrcPtr++;

      rgb = GetRGBColor(p16BPPPalette[byte]);
      pBuffer[DestPtr++] = SGPGetRValue(rgb);
      pBuffer[DestPtr++] = SGPGetGValue(rgb);
      pBuffer[DestPtr++] = SGPGetBValue(rgb);
      pBuffer[DestPtr++] = 0xFF;
    }

    SrcPtr += uiSrcSkip;
    DestPtr += LineSkip;
  }

  asm(`
    mov esi, SrcPtr // pointer to current line start address in source
    mov edi, DestPtr // pointer to current line start address in destination
    mov ebx, usHeight // line counter (goes top to bottom)
    shr ebx, 1 // half the rows
    mov edx, p16BPPPalette

    xor eax, eax

    BlitSetup:
    mov ecx, usWidth
    shr ecx, 1 // divide the width by 2

    ReadMask:
    mov al, [esi]
    xor ah, ah
    inc esi // skip one source byte
    inc esi

    shl eax, 1 // make it into a word index
    mov ax, [edx+eax] // get 16-bit version of 8-bit pixel
    mov [edi], ax // store it in destination buffer
    inc edi // next pixel
    inc edi

    dec ecx
    jnz ReadMask

    // DoneRow:

    add esi, uiSrcSkip // move source pointer down one line
    add edi, LineSkip

    dec ebx // check line counter
    jnz BlitSetup // done blitting, exit

    // DoneBlit: // finished blit
  `);

  return true;
}

/****************************INCOMPLETE***********************************************/

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferMask

        Blits an image into the destination buffer, using an ETRLE brush as a source, another ETRLE
        for a mask, and a 16-bit buffer as a destination.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferMask(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, hMaskObject: SGPVObject, iMOX: INT32, iMOY: INT32, usMask: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let uiMOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let usMHeight: UINT32;
  let usMWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let MaskPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Get Offsets from Index into structure for mask
  pTrav = addressof(hMaskObject.value.pETRLEObject[usMask]);
  usMHeight = pTrav.usHeight;
  usMWidth = pTrav.usWidth;
  uiMOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  MaskPtr = hMaskObject.value.pPixData + uiMOffset + (iMOY * usMWidth) + iMOX;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    clc
    rcr cl, 1
    jnc BlitNTL2

    mov bl, [esi]
    mov ax, [edx+ebx*2]
    mov [edi], ax

    inc esi
    add edi, 2

    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    mov bl, [esi]
    mov ax, [edx+ebx*2]
    mov [edi], ax

    mov bl, [esi+1]
    mov ax, [edx+ebx*2]
    mov [edi+2], ax

    add esi, 2
    add edi, 4

    BlitNTL3:

    or cl, cl
    jz BlitDispatch

    xor ebx, ebx

    BlitNTL4:

    mov bl, [esi]
    mov ax, [edx+ebx*2]
    mov [edi], ax

    mov bl, [esi+1]
    mov ax, [edx+ebx*2]
    mov [edi+2], ax

    mov bl, [esi+2]
    mov ax, [edx+ebx*2]
    mov [edi+4], ax

    mov bl, [esi+3]
    mov ax, [edx+ebx*2]
    mov [edi+6], ax

    add esi, 4
    add edi, 8
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

export function SetClippingRect(clip: SGPRect): void {
  Assert(clip != null);
  Assert(clip.iLeft < clip.iRight);
  Assert(clip.iTop < clip.iBottom);

  copySGPRect(ClippingRect, clip);
}

export function GetClippingRect(clip: SGPRect): void {
  Assert(clip != null);

  copySGPRect(clip, ClippingRect);
}

/**********************************************************************************************
        Blt16BPPBufferPixelateRectWithColor

                Given an 8x8 pattern and a color, pixelates an area by repeatedly "applying the color" to pixels whereever there
                is a non-zero value in the pattern.

                KM:  Added Nov. 23, 1998
                This is all the code that I moved from Blt16BPPBufferPixelateRect().
                This function now takes a color field (which previously was
                always black.  The 3rd assembler line in this function:

                                mov		ax, usColor				// color of pixel

                used to be:

                                xor   eax, eax					// color of pixel (black or 0)

          This was the only internal modification I made other than adding the usColor argument.

*********************************************************************************************/
function Blt16BPPBufferPixelateRectWithColor(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, area: SGPRect, Pattern: UINT8[][] /* [8][8] */, usColor: UINT16): boolean {
  let width: INT32;
  let height: INT32;
  let LineSkip: UINT32;
  let DestPtr: number;
  let iLeft: INT32;
  let iTop: INT32;
  let iRight: INT32;
  let iBottom: INT32;

  // Assertions
  Assert(pBuffer != null);
  Assert(Pattern != null);

  iLeft = Math.max(ClippingRect.iLeft, area.iLeft);
  iTop = Math.max(ClippingRect.iTop, area.iTop);
  iRight = Math.min(ClippingRect.iRight - 1, area.iRight);
  iBottom = Math.min(ClippingRect.iBottom - 1, area.iBottom);

  DestPtr = ((iTop * (uiDestPitchBYTES)) + iLeft * 4);
  width = iRight - iLeft + 1;
  height = iBottom - iTop + 1;
  LineSkip = (uiDestPitchBYTES - (width * 4));

  if (width < 1) {
    return false;
  }
  if (height < 1) {
    return false;
  }

  const rgb = GetRGBColor(usColor);
  const r = SGPGetRValue(rgb);
  const g = SGPGetGValue(rgb);
  const b = SGPGetBValue(rgb);

  let x: number;
  let y: number;
  let color: number;
  let patternColumn: number;
  let patternRow: number;

  patternColumn = 0;
  patternRow = 0;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      if (Pattern[patternRow % 8][patternColumn % 8] === 0x00) {
        DestPtr += 4;
      } else {
        pBuffer[DestPtr++] = r;
        pBuffer[DestPtr++] = g;
        pBuffer[DestPtr++] = b;
        pBuffer[DestPtr++] = 0xFF;
      }

      patternColumn++;
    }

    DestPtr += LineSkip;
    patternColumn = 0;
    patternRow++;
  }

  return true;
}

// KM:  Modified Nov. 23, 1998
// Original prototype (this function) didn't have a color field.  I've added the color field to
// Blt16BPPBufferPixelateRectWithColor(), moved the previous implementation of this function there, and added
// the modification to allow a specific color.
export function Blt16BPPBufferPixelateRect(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, area: SGPRect, Pattern: UINT8[][] /* [8][8] */): boolean {
  return Blt16BPPBufferPixelateRectWithColor(pBuffer, uiDestPitchBYTES, area, Pattern, 0);
}

/**********************************************************************************************
        Blt16BPPBufferHatchRect

                A wrapper for Blt16BPPBufferPixelateRect(), it automatically sends a hatch pattern to it
                of the specified color

*********************************************************************************************/
function Blt16BPPBufferHatchRectWithColor(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, area: SGPRect, usColor: UINT16): boolean {
  let Pattern: UINT8[][] /* [8][8] */ = [
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
  ];
  return Blt16BPPBufferPixelateRectWithColor(pBuffer, uiDestPitchBYTES, area, Pattern, usColor);
}

// Uses black hatch color
export function Blt16BPPBufferHatchRect(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, area: SGPRect): boolean {
  let Pattern: UINT8[][] /* [8][8] */ = [
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
  ];
  return Blt16BPPBufferPixelateRectWithColor(pBuffer, uiDestPitchBYTES, area, Pattern, 0);
}

export function Blt16BPPBufferLooseHatchRectWithColor(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, area: SGPRect, usColor: UINT16): boolean {
  let Pattern: UINT8[][] /* [8][8] */ = [
    [ 1, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ];
  return Blt16BPPBufferPixelateRectWithColor(pBuffer, uiDestPitchBYTES, area, Pattern, usColor);
}

function Blt16BPPBufferLooseHatchRect(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, area: SGPRect): boolean {
  let Pattern: UINT8[][] /* [8][8] */ = [
    [ 1, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ];
  return Blt16BPPBufferPixelateRectWithColor(pBuffer, uiDestPitchBYTES, area, Pattern, 0);
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferShadow

        Modifies the destination buffer. Darkens the destination pixels by 25%, using the source
        image as a mask. Any Non-zero index pixels are used to darken destination pixels.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferShadow(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let color: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];
        if (byte !== 0x00) {
          color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
          rgb = GetRGBColor(ShadeTable[color]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;
        } else {
          DestPtr += 4;
        }
      }
    }
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransparent

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination.

**********************************************************************************************/

export function Blt8BPPDataTo16BPPBufferTransparent(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;
  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];
        rgb = GetRGBColor(p16BPPPalette[byte]);
        pBuffer[DestPtr++] = SGPGetRValue(rgb);
        pBuffer[DestPtr++] = SGPGetGValue(rgb);
        pBuffer[DestPtr++] = SGPGetBValue(rgb);
        pBuffer[DestPtr++] = 0xFF;
      }
    }
  }

  return true;
}

//*****************************************************************************************
// Blt8BPPDataTo16BPPBufferTransMirror
//
// Blits an 8bpp ETRLE to a 16-bit buffer, mirroring the image, with transparency.
//
// Returns BOOLEAN            - TRUE if successful
//
//  UINT16 *pBuffer           - 16bpp Destination buffer
// UINT32 uiDestPitchBYTES    - Destination pitch in bytes
// HVOBJECT hSrcVObject       - Source VOBJECT handle
// INT32 iX                   - X-location of blit
// INT32 iY                   - Y-location of blit
// UINT16 usIndex             - VOBJECT image index to blit from
//
// Created:  7/28/99 Derek Beland
//*****************************************************************************************
function Blt8BPPDataTo16BPPBufferTransMirror(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let uiDestSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  //	iTempX = iX + pTrav->sOffsetX;
  iTempX = iX + usWidth - pTrav.sOffsetX - 1;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  uiDestSkip = (uiDestPitchBYTES + (usWidth * 2));

  asm(`
    // esi = pointer to source data
    // edi = pointer to destination buffer
    // eax = 16bpp pixel
    // ebx = 8bpp pixel
    // ecx = repeat count
    // edx = pointer to 8->16bpp conversion table

    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx

    BlitDispatch:

    // pick up a new byte
    mov cl, [esi]
    inc esi
    or cl, cl
    // if bit 7 is set, the run is transparent
    js BlitTransparent
    // if the byte is zero, it marks the end of current line
    jz BlitDoneLine

    // BlitNonTransLoop:

    // else we have a normal run of non-transparent bytes
    // blit one byte of the count
    clc
    rcr cl, 1
    jnc BlitNTL2

    mov bl, [esi]
    mov ax, [edx+ebx*2]
    mov [edi], ax

    inc esi
    sub edi, 2

    // blit one word of the count
    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    mov bl, [esi]
    mov ax, [edx+ebx*2]
    mov [edi], ax

    mov bl, [esi+1]
    mov ax, [edx+ebx*2]
    mov [edi-2], ax

    add esi, 2
    sub edi, 4

    // blit the rest four at a time (unrolled loop)
    BlitNTL3:

    or cl, cl
    jz BlitDispatch

    xor ebx, ebx

    BlitNTL4:

    mov bl, [esi]
    mov ax, [edx+ebx*2]
    mov [edi], ax

    mov bl, [esi+1]
    mov ax, [edx+ebx*2]
    mov [edi-2], ax

    mov bl, [esi+2]
    mov ax, [edx+ebx*2]
    mov [edi-4], ax

    mov bl, [esi+3]
    mov ax, [edx+ebx*2]
    mov [edi-6], ax

    add esi, 4
    sub edi, 8
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    sub edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, uiDestSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransparentClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. Clips the brush.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransparentClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];
        rgb = GetRGBColor(p16BPPPalette[byte]);
        pBuffer[DestPtr++] = SGPGetRValue(rgb);
        pBuffer[DestPtr++] = SGPGetGValue(rgb);
        pBuffer[DestPtr++] = SGPGetBValue(rgb);
        pBuffer[DestPtr++] = 0xFF;
      }
    }
  }

  return true;
}

/**********************************************************************************************
 BltIsClipped

        Determines whether a given blit will need clipping or not. Returns TRUE/FALSE.

**********************************************************************************************/
export function BltIsClipped(hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let usHeight: UINT32;
  let usWidth: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  if (Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth))
    return true;

  if (Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth))
    return true;

  if (Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight))
    return true;

  if (Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight))
    return true;

  return false;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferShadowClip

        Modifies the destination buffer. Darkens the destination pixels by 25%, using the source
        image as a mask. Any Non-zero index pixels are used to darken destination pixels. Blitter
        clips brush if it doesn't fit on the viewport.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferShadowClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let color: number;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];
        if (byte !== 0x00) {
          color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
          rgb = GetRGBColor(ShadeTable[color]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;
        } else {
          DestPtr += 4;
        }
      }
    }
  }

  return true;
}

/**********************************************************************************************
        Blt16BPPBufferShadowRect

                Darkens a rectangular area by 25%. This blitter is used by ShadowVideoObjectRect.

        pBuffer						Pointer to a 16BPP buffer
        uiDestPitchBytes	Pitch of the destination surface
        area							An SGPRect, the area to darken

*********************************************************************************************/
export function Blt16BPPBufferShadowRect(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, area: SGPRect): boolean {
  let width: INT32;
  let height: INT32;
  let LineSkip: UINT32;
  let DestPtr: number;

  // Assertions
  Assert(pBuffer != null);

  // Clipping
  if (area.iLeft < ClippingRect.iLeft)
    area.iLeft = ClippingRect.iLeft;
  if (area.iTop < ClippingRect.iTop)
    area.iTop = ClippingRect.iTop;
  if (area.iRight >= ClippingRect.iRight)
    area.iRight = ClippingRect.iRight - 1;
  if (area.iBottom >= ClippingRect.iBottom)
    area.iBottom = ClippingRect.iBottom - 1;
  // CHECKF(area->iLeft >= ClippingRect.iLeft );
  // CHECKF(area->iTop >= ClippingRect.iTop );
  // CHECKF(area->iRight <= ClippingRect.iRight );
  // CHECKF(area->iBottom <= ClippingRect.iBottom );

  DestPtr = (area.iTop * uiDestPitchBYTES) + area.iLeft * 4;
  width = area.iRight - area.iLeft + 1;
  height = area.iBottom - area.iTop + 1;
  LineSkip = (uiDestPitchBYTES - (width * 4));

  if (width < 1) {
    return false;
  }
  if (height < 1) {
    return false;
  }

  let colors = ShadeTable;
  let x: number;
  let y: number;
  let color: number;
  let rgb: number;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
      rgb = GetRGBColor(colors[color]);
      pBuffer[DestPtr++] = SGPGetRValue(rgb);
      pBuffer[DestPtr++] = SGPGetGValue(rgb);
      pBuffer[DestPtr++] = SGPGetBValue(rgb);
      pBuffer[DestPtr++] = 0xFF;
    }

    DestPtr += LineSkip;
  }

  return true;
}

/**********************************************************************************************
        Blt16BPPBufferShadowRect

                Darkens a rectangular area by 25%. This blitter is used by ShadowVideoObjectRect.

        pBuffer						Pointer to a 16BPP buffer
        uiDestPitchBytes	Pitch of the destination surface
        area							An SGPRect, the area to darken

*********************************************************************************************/
export function Blt16BPPBufferShadowRectAlternateTable(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, area: SGPRect): boolean {
  let width: INT32;
  let height: INT32;
  let LineSkip: UINT32;
  let DestPtr: number;

  // Assertions
  Assert(pBuffer != null);

  // Clipping
  if (area.iLeft < ClippingRect.iLeft)
    area.iLeft = ClippingRect.iLeft;
  if (area.iTop < ClippingRect.iTop)
    area.iTop = ClippingRect.iTop;
  if (area.iRight >= ClippingRect.iRight)
    area.iRight = ClippingRect.iRight - 1;
  if (area.iBottom >= ClippingRect.iBottom)
    area.iBottom = ClippingRect.iBottom - 1;
  // CHECKF(area->iLeft >= ClippingRect.iLeft );
  // CHECKF(area->iTop >= ClippingRect.iTop );
  // CHECKF(area->iRight <= ClippingRect.iRight );
  // CHECKF(area->iBottom <= ClippingRect.iBottom );

  DestPtr = (area.iTop * uiDestPitchBYTES) + area.iLeft * 4;
  width = area.iRight - area.iLeft + 1;
  height = area.iBottom - area.iTop + 1;
  LineSkip = (uiDestPitchBYTES - (width * 4));

  if (width < 1) {
    return false;
  }
  if (height < 1) {
    return false;
  }

  let colors = IntensityTable;
  let x: number;
  let y: number;
  let color: number;
  let rgb: number;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
      rgb = GetRGBColor(colors[color]);
      pBuffer[DestPtr++] = SGPGetRValue(rgb);
      pBuffer[DestPtr++] = SGPGetGValue(rgb);
      pBuffer[DestPtr++] = SGPGetBValue(rgb);
      DestPtr++;
    }

    DestPtr += LineSkip;
  }

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferMonoShadow

        Uses a bitmap an 8BPP template for blitting. Anywhere a 1 appears in the bitmap, a shadow
        is blitted to the destination (a black pixel). Any other value above zero is considered a
        forground color, and zero is background. If the parameter for the background color is zero,
        transparency is used for the background.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferMonoShadow(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, usForeground: UINT16, usBackground: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    xor ebx, ebx

    BlitNTL4:

    mov bl, [esi]
    cmp bl, 1
    jb BlitNTL5

    // write a black shadow
    xor ax, ax
    mov [edi], ax

    inc esi
    add edi, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitNTL5:
    or bl, bl
    jz BlitNTL6

    mov ax, usForeground
    mov [edi], ax

    inc esi
    add edi, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitNTL6:
    cmp usBackground, 0
    je BlitNTL7

    mov ax, usBackground
    mov [edi], ax

    BlitNTL7:
    inc esi
    add edi, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:
    and ecx, 07fH

    mov ax, usBackground
    or ax, ax
    jz BTrans1

    rep stosw
    jmp BlitDispatch

    BTrans1:
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/*
BOOLEAN Blt8BPPDataTo16BPPBufferFullTransparent( HVOBJECT hDestVObject, HVOBJECT hSrcVObject, UINT16 usX, UINT16 usY, SGPRect *srcRect )
{
        UINT32 uiSrcStart, uiDestStart, uiNumLines, uiLineSize;
//	UINT32 rows, cols;
        UINT8 *pSrc; //, *pSrcTemp;
        UINT16 *pDest; //*pDestTemp,
        UINT32	uiSrcPitch, uiDestPitch;
        UINT16 *p16BPPPalette;
        UINT16 usEffectiveSrcWidth;
        UINT16 usEffectiveDestWidth;
        UINT16 us16BPPSrcTransColor;
        UINT16 us16BPPDestTransColor;
//	UINT16 us16BPPValue;
        UINT32 count;
        UINT8  maskcolor;

        // Assertions
        Assert( hSrcVObject != NULL );
        Assert( hDestVObject != NULL );

        // Validations
        CHECKF( usX >= 0 );
        CHECKF( usY >= 0 );
        CHECKF( srcRect->iRight > srcRect->iLeft );
        CHECKF( srcRect->iBottom > srcRect->iTop );

        p16BPPPalette = hSrcVObject->p16BPPPalette;
        CHECKF( p16BPPPalette != NULL );

        // Lock Data
        pSrc = LockVideoObjectBuffer( hSrcVObject, &uiSrcPitch );

        // Effective width ( in PIXELS ) is Pitch ( in bytes ) converted to pitch ( IN PIXELS )
        usEffectiveSrcWidth = (UINT16)( uiSrcPitch / ( hSrcVObject->ubBitDepth / 8 ) );

        pDest = (UINT16*)LockVideoObjectBuffer( hDestVObject, &uiDestPitch );

        // Effective width ( in PIXELS ) is Pitch ( in bytes ) converted to pitch ( IN PIXELS )
        usEffectiveDestWidth = (UINT16)( uiDestPitch / ( hDestVObject->ubBitDepth / 8 ) );

        // Determine memcopy coordinates
        uiSrcStart = srcRect->iTop * usEffectiveSrcWidth + srcRect->iLeft;
        uiDestStart = usY * usEffectiveDestWidth + usX;
        uiNumLines = ( srcRect->iBottom - srcRect->iTop );
        uiLineSize = ( srcRect->iRight - srcRect->iLeft );

        CHECKF( hDestVObject->usWidth >= uiLineSize );
        CHECKF( hDestVObject->usHeight >= uiNumLines );

        // Find 16 BPP transparent color
        us16BPPSrcTransColor = Get16BPPColor( hSrcVObject->TransparentColor );
        for(count=0; (count < 256) && (p16BPPPalette[count]!=us16BPPSrcTransColor); count++);

        if(count==256)
        {
                DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, String( "Transparency color does not exist in palette table for source object" ));
                maskcolor=0;
        }
        else
                        maskcolor=(UINT8)count;

        us16BPPDestTransColor = Get16BPPColor( hDestVObject->TransparentColor );

        // Convert to Pixel specification
        pDest = pDest + uiDestStart;
        pSrc =  pSrc + uiSrcStart;

        __asm {
                mov		esi, pSrc						// pointer to current line start address in source
                mov		edi, pDest					// pointer to current line start address in destination
                mov		ecx, uiNumLines			// line counter (goes top to bottom)
                mov		edx, p16BPPPalette

                mov		ebx, uiLineSize			// column counter (goes right to left)
                dec		ebx

ReadMask:
                mov		ax, [edi+ebx*2]
                cmp		ax, us16BPPDestTransColor
                je		NextColumn
                xor		eax, eax						// clear out the top 24 bits
                mov		al, [esi+ebx]
                cmp		al, maskcolor
                je		NextColumn

                shl		eax, 1							// make it into a word index
                mov		ax, [edx+eax]				// get 16-bit version of 8-bit pixel
                mov		[edi+ebx*2], ax

NextColumn:
                dec		ebx									// decrement column counter
                jns		ReadMask						// loop until one line is done

                dec		ecx									// check line counter
                jz		DoneBlit						// done blitting, exit

                add		esi, uiSrcPitch			// move line pointers down one line
                add		edi, uiDestPitch
                mov		ebx, uiLineSize			// column counter (goes right to left)
                dec		ebx
                jmp		ReadMask						// back into blitting on next line

DoneBlit:											// finished blit
                }

        ReleaseVideoObjectBuffer( hSrcVObject );
        ReleaseVideoObjectBuffer( hDestVObject );

        return( TRUE );

}	*/

// UTILITY FUNCTIONS FOR BLITTING
/*
BOOLEAN ClipReleatedSrcAndDestRectangles( HVOBJECT hDestVObject, HVOBJECT hSrcVObject, RECT *DestRect, RECT *SrcRect )
{

        Assert( hDestVObject != NULL );
        Assert( hSrcVObject != NULL );

        // Check for invalid start positions and clip by ignoring blit
        if ( DestRect->iLeft >= hDestVObject->usWidth || DestRect->iTop >= hDestVObject->usHeight )
        {
                return( FALSE );
        }

        if ( SrcRect->iLeft >= hSrcVObject->usWidth || SrcRect->iTop >= hSrcVObject->usHeight )
        {
                return( FALSE );
        }

        // For overruns
        // Clip destination rectangles
        if ( DestRect->iRight > hDestVObject->usWidth )
        {
                // Both have to be modified or by default streching occurs
                DestRect->iRight = hDestVObject->usWidth;
                SrcRect->iRight = SrcRect->iLeft + ( DestRect->iRight - DestRect->iLeft );
        }
        if ( DestRect->iBottom > hDestVObject->usHeight )
        {
                // Both have to be modified or by default streching occurs
                DestRect->iBottom = hDestVObject->usHeight;
                SrcRect->iBottom = SrcRect->iTop + ( DestRect->iBottom - DestRect->iTop );
        }

        // Clip src rectangles
        if ( SrcRect->iRight > hSrcVObject->usWidth )
        {
                // Both have to be modified or by default streching occurs
                SrcRect->iRight = hSrcVObject->usWidth;
                DestRect->iRight = DestRect->iLeft  + ( SrcRect->iRight - SrcRect->iLeft );
        }
        if ( SrcRect->iBottom > hSrcVObject->usHeight )
        {
                // Both have to be modified or by default streching occurs
                SrcRect->iBottom = hSrcVObject->usHeight;
                DestRect->iBottom = DestRect->iTop + ( SrcRect->iBottom - SrcRect->iTop );
        }

        // For underruns
        // Clip destination rectangles
        if ( DestRect->iLeft < 0 )
        {
                // Both have to be modified or by default streching occurs
                DestRect->iLeft = 0;
                SrcRect->iLeft = SrcRect->iRight - ( DestRect->iRight - DestRect->iLeft );
        }
        if ( DestRect->iTop < 0 )
        {
                // Both have to be modified or by default streching occurs
                DestRect->iTop = 0;
                SrcRect->iTop = SrcRect->iBottom - ( DestRect->iBottom - DestRect->iTop );
        }

        // Clip src rectangles
        if ( SrcRect->iLeft < 0 )
        {
                // Both have to be modified or by default streching occurs
                SrcRect->iLeft = 0;
                DestRect->iLeft = DestRect->iRight  - ( SrcRect->iRight - SrcRect->iLeft );
        }
        if ( SrcRect->iTop < 0 )
        {
                // Both have to be modified or by default streching occurs
                SrcRect->iTop = 0;
                DestRect->iTop = DestRect->iBottom - ( SrcRect->iBottom - SrcRect->iTop );
        }

        return( TRUE );
}


BOOLEAN FillSurface( HVOBJECT hDestVObject, blt_fx *pBltFx )
{
        DDBLTFX				 BlitterFX;

        Assert( hDestVObject != NULL );
        CHECKF( pBltFx != NULL );

        BlitterFX.dwSize = sizeof( DDBLTFX );
        BlitterFX.dwFillColor = pBltFx->ColorFill;

        DDBltSurface( (LPDIRECTDRAWSURFACE2)hDestVObject->pSurfaceData, NULL, NULL, NULL, DDBLT_COLORFILL, &BlitterFX );

        if ( hDestVObject->fFlags & VOBJECT_VIDEO_MEM_USAGE && !hDestVObject->fFlags & VOBJECT_RESERVED_SURFACE )
        {
                UpdateBackupSurface( hDestVObject );
        }

        return( TRUE );
}

BOOLEAN FillSurfaceRect( HVOBJECT hDestVObject, blt_fx *pBltFx )
{
        DDBLTFX				 BlitterFX;

        Assert( hDestVObject != NULL );
        CHECKF( pBltFx != NULL );

        BlitterFX.dwSize = sizeof( DDBLTFX );
        BlitterFX.dwFillColor = pBltFx->ColorFill;

        DDBltSurface( (LPDIRECTDRAWSURFACE2)hDestVObject->pSurfaceData, (LPRECT)&(pBltFx->FillRect), NULL, NULL, DDBLT_COLORFILL, &BlitterFX );

        if ( hDestVObject->fFlags & VOBJECT_VIDEO_MEM_USAGE && !hDestVObject->fFlags & VOBJECT_RESERVED_SURFACE )
        {
                UpdateBackupSurface( hDestVObject );
        }

        return( TRUE );
}


BOOLEAN BltVObjectUsingDD( HVOBJECT hDestVObject, HVOBJECT hSrcVObject, UINT32 fBltFlags, INT32 iDestX, INT32 iDestY, RECT *SrcRect )
{
        UINT32		uiDDFlags;
        RECT			DestRect;

  // Blit using the correct blitter
        if ( fBltFlags & VO_BLT_FAST )
        {

                // Validations
                CHECKF( iDestX >= 0 );
                CHECKF( iDestY >= 0 );

                // Default flags
                uiDDFlags = 0;

                // Convert flags into DD flags, ( for transparency use, etc )
                if ( fBltFlags & VO_BLT_USECOLORKEY )
                {
                        uiDDFlags != DDBLTFAST_SRCCOLORKEY;
                }

                // Convert flags into DD flags, ( for transparency use, etc )
                if ( fBltFlags & VO_BLT_USEDESTCOLORKEY )
                {
                        uiDDFlags != DDBLTFAST_DESTCOLORKEY;
                }

                if ( uiDDFlags == 0 )
                {
                        // Default here is no colorkey
                        uiDDFlags = DDBLTFAST_NOCOLORKEY;
                }

                DDBltFastSurface( (LPDIRECTDRAWSURFACE2)hDestVObject->pSurfaceData, iDestX, iDestY, (LPDIRECTDRAWSURFACE2)hSrcVObject->pSurfaceData, SrcRect, uiDDFlags );

        }
        else
        {
                // Normal, specialized blit for clipping, etc

                // Default flags
                uiDDFlags = DDBLT_WAIT;

                // Convert flags into DD flags, ( for transparency use, etc )
                if ( fBltFlags & VO_BLT_USECOLORKEY )
                {
                        uiDDFlags |= DDBLT_KEYSRC;
                }

                // Setup dest rectangle
                DestRect.top =  (int)iDestY;
                DestRect.left = (int)iDestX;
                DestRect.bottom = (int)iDestY + ( SrcRect->iBottom - SrcRect->iTop );
                DestRect.right = (int)iDestX + ( SrcRect->iRight - SrcRect->iLeft );

                // Do Clipping of rectangles
                if ( !ClipReleatedSrcAndDestRectangles( hDestVObject, hSrcVObject, &DestRect, SrcRect ) )
                {
                        // Returns false because dest start is > dest size
                        return( TRUE );
                }

                DDBltSurface( (LPDIRECTDRAWSURFACE2)hDestVObject->pSurfaceData, &DestRect, (LPDIRECTDRAWSURFACE2)hSrcVObject->pSurfaceData,
                                                        SrcRect, uiDDFlags, NULL );

        }

        // Update backup surface with new data
        if ( hDestVObject->fFlags & VOBJECT_VIDEO_MEM_USAGE && !hDestVObject->fFlags & VOBJECT_RESERVED_SURFACE )
        {
                UpdateBackupSurface( hDestVObject );
        }

        return( TRUE );
}


// Blt to backup buffer
BOOLEAN UpdateBackupSurface( HVOBJECT hVObject )
{
        RECT		aRect;

        // Assertions
        Assert( hVObject != NULL );

        // Validations
        CHECKF( hVObject->pSavedSurfaceData != NULL );

        aRect.top = (int)0;
        aRect.left = (int)0;
        aRect.bottom = (int)hVObject->usHeight;
        aRect.right = (int)hVObject->usWidth;

        // Copy all contents into backup buffer
        DDBltFastSurface( (LPDIRECTDRAWSURFACE2)hVObject->pSurfaceData, 0, 0, (LPDIRECTDRAWSURFACE2)hVObject->pSavedSurfaceData, &aRect, DDBLTFAST_NOCOLORKEY );

        return( TRUE );

}

*/

function FillRect8BPP(pBuffer: Pointer<UINT8>, uiDestPitchBYTES: UINT32, x1: INT32, y1: INT32, x2: INT32, y2: INT32, color: UINT8): boolean {
  let x1real: INT32;
  let y1real: INT32;
  let x2real: INT32;
  let y2real: INT32;
  let linelength: UINT32;
  let lines: UINT32;
  let lineskip: UINT32;
  let startoffset: Pointer<UINT8>;

  // check parameters
  Assert(pBuffer != null);
  Assert(uiDestPitchBYTES > 0);
  Assert(x2 > x1);
  Assert(y2 > y1);

  // clip edges of rect if hanging off screen

  x1real = Math.max(0, x1);
  x2real = Math.min(639, x2);
  y1real = Math.max(0, y1);
  y2real = Math.min(479, y2);

  startoffset = pBuffer + (y1real * uiDestPitchBYTES) + x1real;
  lines = y2real - y1real + 1;
  linelength = x2real - x1real + 1;
  lineskip = uiDestPitchBYTES - linelength;

  asm(`
    mov edi, startoffset
    mov al, color
    mov ah, al
    shl eax, 16
    mov al, color
    mov ah, al
    mov edx, lines
    mov ebx, linelength

    // edi = destination pointer
    // eax = dword of color value
    // ebx = line length
    // ecx = column counter
    // edx = row counter

    LineLoop:

    mov ecx, ebx

    clc
    rcr ecx, 1
    jnc FL2

    mov [edi], al
    inc edi

    FL2:
    clc
    rcr ecx, 1
    jnc FL3
    mov [edi], ax
    add edi, 2

    FL3:
    or ecx, ecx
    jz FillLineEnd

    rep stosd

    FillLineEnd:
    add edi, lineskip
    dec edx
    jnz LineLoop
  `);
  return true;
}

function FillRect16BPP(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, x1: INT32, y1: INT32, x2: INT32, y2: INT32, color: UINT16): boolean {
  let x1real: INT32;
  let y1real: INT32;
  let x2real: INT32;
  let y2real: INT32;
  let linelength: UINT32;
  let lines: UINT32;
  let lineskip: UINT32;
  let startoffset: Pointer<UINT16>;

  // check parameters
  Assert(pBuffer != null);
  Assert(uiDestPitchBYTES > 0);
  Assert(x2 > x1);
  Assert(y2 > y1);

  // clip edges of rect if hanging off screen

  x1real = Math.max(0, x1);
  x2real = Math.min(639, x2);
  y1real = Math.max(0, y1);
  y2real = Math.min(479, y2);

  startoffset = pBuffer + (y1real * uiDestPitchBYTES / 2) + x1real;
  lines = y2real - y1real + 1;
  linelength = x2real - x1real + 1;
  lineskip = uiDestPitchBYTES - (linelength * 2);

  asm(`
    mov edi, startoffset
    mov ax, color
    shl eax, 16
    mov ax, color
    mov edx, lines
    mov ebx, linelength

    // edi = destination pointer
    // eax = dword of color value
    // ebx = line length
    // ecx = column counter
    // edx = row counter

    LineLoop:
    mov ecx, ebx

    clc
    rcr ecx, 1
    jnc FL2

    mov [edi], ax
    add edi, 2

    FL2:
    or ecx, ecx
    jz FillLineEnd

    rep stosd

    FillLineEnd:
    add edi, lineskip
    dec edx
    jnz LineLoop
  `);
  return true;
}

/**********************************************************************************************
 BltIsClippedOrOffScreen

        Determines whether a given blit will need clipping or not. Returns TRUE/FALSE.

**********************************************************************************************/
export function BltIsClippedOrOffScreen(hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): UINT8 {
  let usHeight: UINT32;
  let usWidth: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  gLeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  gRightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  gTopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  gBottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  gfUsePreCalcSkips = true;

  // check if whole thing is clipped
  if ((gLeftSkip >= usWidth) || (gRightSkip >= usWidth))
    return -1;

  // check if whole thing is clipped
  if ((gTopSkip >= usHeight) || (gBottomSkip >= usHeight))
    return -1;

  if (gLeftSkip)
    return 1;

  if (gRightSkip)
    return 1;

  if (gTopSkip)
    return 1;

  if (gBottomSkip)
    return 1;

  return 0;
}

// Blt8BPPDataTo16BPPBufferOutline
// ATE New blitter for rendering a differrent color for value 254. Can be transparent if fDoOutline is FALSE
export function Blt8BPPDataTo16BPPBufferOutline(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let p16BPPPalette: Uint16Array;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));
  p16BPPPalette = hSrcVObject.pShadeCurrent;

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];
        if (byte === 254) {
          if (fDoOutline) {
            rgb = GetRGBColor(s16BPPColor);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;
          } else {
            DestPtr += 4;
          }
        } else {
          rgb = GetRGBColor(p16BPPPalette[byte]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;
        }
      }
    }
  }

  return true;
}

// ATE New blitter for rendering a differrent color for value 254. Can be transparent if fDoOutline is FALSE
export function Blt8BPPDataTo16BPPBufferOutlineClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, s16BPPColor: INT16, fDoOutline: boolean, clipregion: SGPRect | null): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let p16BPPPalette: Uint16Array;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));
  p16BPPPalette = hSrcVObject.pShadeCurrent;

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:
    xor eax, eax

    mov al, [esi]
    cmp al, 254
    jne BlitNTL3

    // DO OUTLINE
    // ONLY IF WE WANT IT!
    mov al, fDoOutline;
    cmp al, 1
    jne BlitNTL2

    mov ax, s16BPPColor
    mov [edi], ax
    jmp BlitNTL2

    BlitNTL3:
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

export function Blt8BPPDataTo16BPPBufferOutlineZClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, s16BPPColor: INT16, fDoOutline: boolean, clipregion: SGPRect | null): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let p16BPPPalette: Uint16Array;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);

  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));
  p16BPPPalette = hSrcVObject.pShadeCurrent;

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          if (byte === 254) {
            if (fDoOutline) {
              rgb = GetRGBColor(s16BPPColor);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;

            setZValue(pZBuffer, ZPtr, usZValue);
          }
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

export function Blt8BPPDataTo16BPPBufferOutlineZPixelateObscuredClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, s16BPPColor: INT16, fDoOutline: boolean, clipregion: SGPRect | null): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let p16BPPPalette: Uint16Array;
  let uiLineFlag: UINT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);

  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  uiLineFlag = (iTempY & 1);

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
      uiLineFlag ^= 1;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      uiLineFlag ^= 1;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          if (byte === 254) {
            if (fDoOutline) {
              rgb = GetRGBColor(s16BPPColor);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;
          }

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          if (uiLineFlag & 1) {
            if (DestPtr & 4) {
              if (byte === 254) {
                if (fDoOutline) {
                  rgb = GetRGBColor(s16BPPColor);
                  pBuffer[DestPtr++] = SGPGetRValue(rgb);
                  pBuffer[DestPtr++] = SGPGetGValue(rgb);
                  pBuffer[DestPtr++] = SGPGetBValue(rgb);
                  pBuffer[DestPtr++] = 0xFF;
                } else {
                  DestPtr += 4;
                }
              } else {
                rgb = GetRGBColor(p16BPPPalette[byte]);
                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              }
            } else {
              DestPtr += 4;
            }
          } else {
            if (DestPtr & 4) {
              DestPtr += 4;
            } else {
              if (byte === 254) {
                if (fDoOutline) {
                  rgb = GetRGBColor(s16BPPColor);
                  pBuffer[DestPtr++] = SGPGetRValue(rgb);
                  pBuffer[DestPtr++] = SGPGetGValue(rgb);
                  pBuffer[DestPtr++] = SGPGetBValue(rgb);
                  pBuffer[DestPtr++] = 0xFF;
                } else {
                  DestPtr += 4;
                }
              } else {
                rgb = GetRGBColor(p16BPPPalette[byte]);
                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              }

              setZValue(pZBuffer, ZPtr, usZValue);
            }
          }
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

export function Blt8BPPDataTo16BPPBufferOutlineShadow(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let p16BPPPalette: Uint16Array;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));
  p16BPPPalette = hSrcVObject.pShadeCurrent;

  let pPixData = hSrcVObject.pPixData;
  let x: number;
  let y: number;
  let byte: number;
  let runLength: number;
  let color: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];
        if (byte === 254) {
          DestPtr += 4;
        } else {
          color = Get16BPPColor(FROMRGB(pBuffer[DestPtr], pBuffer[DestPtr + 1], pBuffer[DestPtr + 2]));
          rgb = GetRGBColor(ShadeTable[color]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;
        }
      }
    }
  }

  return true;
}

export function Blt8BPPDataTo16BPPBufferOutlineShadowClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET ShadeTable
    xor eax, eax
    mov ebx, TopSkip
    xor ecx, ecx

    or ebx, ebx // check for nothing clipped on top
    jz LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    // Check for outline as well
    mov cl, [esi]
    cmp cl, 254
    je TopSkipLoop
    //

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec ebx
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov ebx, LeftSkip // check for nothing clipped on the left
    or ebx, ebx
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, ebx
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, ebx // skip partial run, jump into normal loop for rest
    sub ecx, ebx
    mov ebx, BlitLength
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub ebx, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, ebx
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, ebx // skip partial run, jump into normal loop for rest
    mov ebx, BlitLength
    jmp BlitTransparent

    LSTrans1:
    sub ebx, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov ebx, BlitLength
    mov Unblitted, 0

    BlitDispatch:

    or ebx, ebx // Check to see if we're done blitting
    jz RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop:

    cmp ecx, ebx
    jbe BNTrans1

    sub ecx, ebx
    mov Unblitted, ecx
    mov ecx, ebx

    BNTrans1:
    sub ebx, ecx

    clc
    rcr cl, 1
    jnc BlitNTL2

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    inc esi
    add edi, 2

    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    mov ax, [edi+2]
    mov ax, [edx+eax*2]
    mov [edi+2], ax

    add esi, 2
    add edi, 4

    BlitNTL3:

    or cl, cl
    jz BlitLineEnd

    BlitNTL4:

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    mov ax, [edi+2]
    mov ax, [edx+eax*2]
    mov [edi+2], ax

    mov ax, [edi+4]
    mov ax, [edx+eax*2]
    mov [edi+4], ax

    mov ax, [edi+6]
    mov ax, [edx+eax*2]
    mov [edi+6], ax

    add esi, 4
    add edi, 8
    dec cl
    jnz BlitNTL4

    BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    cmp ecx, ebx
    jbe BTrans1

    mov ecx, ebx

    BTrans1:

    sub ebx, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    RightSkipLoop:

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

export function Blt8BPPDataTo16BPPBufferOutlineZ(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) <= usZValue) {
          if (byte === 254) {
            if (fDoOutline) {
              rgb = GetRGBColor(s16BPPColor);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;

            setZValue(pZBuffer, ZPtr, usZValue);
          }
        } else {
          DestPtr += 4;
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

export function Blt8BPPDataTo16BPPBufferOutlineZPixelateObscured(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let uiLineFlag: UINT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  ZPtr = (uiDestPitchBYTES * iTempY) + (iTempX * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 4));
  uiLineFlag = (iTempY & 1);

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;
  let rgb: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      uiLineFlag ^= 1;
      continue;
    }

    runLength = byte & 0x7F;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) < usZValue) {
          if (byte === 254) {
            if (fDoOutline) {
              rgb = GetRGBColor(s16BPPColor);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            rgb = GetRGBColor(p16BPPPalette[byte]);
            pBuffer[DestPtr++] = SGPGetRValue(rgb);
            pBuffer[DestPtr++] = SGPGetGValue(rgb);
            pBuffer[DestPtr++] = SGPGetBValue(rgb);
            pBuffer[DestPtr++] = 0xFF;
          }

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          if (uiLineFlag & 1) {
            if (DestPtr & 4) {
              if (byte === 254) {
                if (fDoOutline) {
                  rgb = GetRGBColor(s16BPPColor);
                  pBuffer[DestPtr++] = SGPGetRValue(rgb);
                  pBuffer[DestPtr++] = SGPGetGValue(rgb);
                  pBuffer[DestPtr++] = SGPGetBValue(rgb);
                  pBuffer[DestPtr++] = 0xFF;
                } else {
                  DestPtr += 4;
                }
              } else {
                rgb = GetRGBColor(p16BPPPalette[byte]);
                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              }
            } else {
              DestPtr += 4;
            }
          } else {
            if (DestPtr & 4) {
              DestPtr += 4;
            } else {
              if (byte === 254) {
                if (fDoOutline) {
                  rgb = GetRGBColor(s16BPPColor);
                  pBuffer[DestPtr++] = SGPGetRValue(rgb);
                  pBuffer[DestPtr++] = SGPGetGValue(rgb);
                  pBuffer[DestPtr++] = SGPGetBValue(rgb);
                  pBuffer[DestPtr++] = 0xFF;
                } else {
                  DestPtr += 4;
                }
              } else {
                rgb = GetRGBColor(p16BPPPalette[byte]);
                pBuffer[DestPtr++] = SGPGetRValue(rgb);
                pBuffer[DestPtr++] = SGPGetGValue(rgb);
                pBuffer[DestPtr++] = SGPGetBValue(rgb);
                pBuffer[DestPtr++] = 0xFF;
              }

              setZValue(pZBuffer, ZPtr, usZValue);
            }
          }
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

// This is the same as above, but DONOT WRITE to Z!
export function Blt8BPPDataTo16BPPBufferOutlineZNB(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    xor eax, eax

    BlitNTL4:

    mov ax, usZValue
    cmp ax, [ebx]
    jb BlitNTL5

    // CHECK FOR OUTLINE, BLIT DIFFERENTLY IF WE WANT IT TO!
    mov al, [esi]
    cmp al, 254
    jne BlitNTL6

    // DO OUTLINE
    // ONLY IF WE WANT IT!
    mov al, fDoOutline;
    cmp al, 1
    jne BlitNTL5

    mov ax, s16BPPColor
    mov [edi], ax
    jmp BlitNTL5

    BlitNTL6:

    // Donot write to z-buffer
    // mov [ebx], ax

    xor ah, ah
    mov al, [esi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    inc edi
    inc ebx
    inc edi
    inc ebx

    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferIntensityZ

        Creates a shadow using a brush, but modifies the destination buffer only if the current
        Z level is equal to higher than what's in the Z buffer at that pixel location. It
        updates the Z buffer with the new Z level.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferIntensityZ(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET IntensityTable
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL5

    xor eax, eax
    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax
    mov ax, usZValue
    mov [ebx], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferIntensityZClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferIntensityZClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET IntensityTable
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL2

    mov ax, usZValue
    mov [ebx], ax

    xor eax, eax

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferIntensityZNB

        Creates a shadow using a brush, but modifies the destination buffer only if the current
        Z level is equal to higher than what's in the Z buffer at that pixel location. It does
        NOT update the Z buffer with the new Z value.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferIntensityZNB(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET IntensityTable
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    BlitNTL4:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL5

    xor eax, eax
    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferIntensityZNBClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, the Z value is
        not updated,	for any non-transparent pixels. The Z-buffer is 16 bit, and	must be the
        same dimensions (including Pitch) as the destination.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferIntensityZNBClip(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Uint16Array, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET IntensityTable
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov eax, LeftSkip
    mov LSCount, eax
    or eax, eax
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop: // blit non-transparent pixels

    cmp ecx, LSCount
    jbe BNTrans1

    sub ecx, LSCount
    mov Unblitted, ecx
    mov ecx, LSCount

    BNTrans1:
    sub LSCount, ecx

    BlitNTL1:

    mov ax, [ebx]
    cmp ax, usZValue
    jae BlitNTL2

    xor eax, eax

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2
    dec cl
    jnz BlitNTL1

    // BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH
    cmp ecx, LSCount
    jbe BTrans1

    mov ecx, LSCount

    BTrans1:

    sub LSCount, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    RightSkipLoop: // skip along until we hit and end-of-line marker

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferIntensityClip

        Modifies the destination buffer. Darkens the destination pixels by 25%, using the source
        image as a mask. Any Non-zero index pixels are used to darken destination pixels. Blitter
        clips brush if it doesn't fit on the viewport.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferIntensityClip(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, OFFSET IntensityTable
    xor eax, eax
    mov ebx, TopSkip
    xor ecx, ecx

    or ebx, ebx // check for nothing clipped on top
    jz LeftSkipSetup

    TopSkipLoop: // Skips the number of lines clipped at the top

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec ebx
    jnz TopSkipLoop

    LeftSkipSetup:

    mov Unblitted, 0
    mov ebx, LeftSkip // check for nothing clipped on the left
    or ebx, ebx
    jz BlitLineSetup

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, ebx
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, ebx // skip partial run, jump into normal loop for rest
    sub ecx, ebx
    mov ebx, BlitLength
    mov Unblitted, 0
    jmp BlitNonTransLoop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub ebx, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, ebx
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, ebx // skip partial run, jump into normal loop for rest
    mov ebx, BlitLength
    jmp BlitTransparent

    LSTrans1:
    sub ebx, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    BlitLineSetup: // Does any actual blitting (trans/non) for the line
    mov ebx, BlitLength
    mov Unblitted, 0

    BlitDispatch:

    or ebx, ebx // Check to see if we're done blitting
    jz RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent

    BlitNonTransLoop:

    cmp ecx, ebx
    jbe BNTrans1

    sub ecx, ebx
    mov Unblitted, ecx
    mov ecx, ebx

    BNTrans1:
    sub ebx, ecx

    clc
    rcr cl, 1
    jnc BlitNTL2

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    inc esi
    add edi, 2

    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    mov ax, [edi+2]
    mov ax, [edx+eax*2]
    mov [edi+2], ax

    add esi, 2
    add edi, 4

    BlitNTL3:

    or cl, cl
    jz BlitLineEnd

    BlitNTL4:

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    mov ax, [edi+2]
    mov ax, [edx+eax*2]
    mov [edi+2], ax

    mov ax, [edi+4]
    mov ax, [edx+eax*2]
    mov [edi+4], ax

    mov ax, [edi+6]
    mov ax, [edx+eax*2]
    mov [edi+6], ax

    add esi, 4
    add edi, 8
    dec cl
    jnz BlitNTL4

    BlitLineEnd:
    add esi, Unblitted
    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    cmp ecx, ebx
    jbe BTrans1

    mov ecx, ebx

    BTrans1:

    sub ebx, ecx
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    RightSkipLoop:

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip

    jmp LeftSkipSetup

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferIntensity

        Modifies the destination buffer. Darkens the destination pixels by 25%, using the source
        image as a mask. Any Non-zero index pixels are used to darken destination pixels.

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferIntensity(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  // Validations
  if (iTempX < 0) {
    return false;
  }
  if (iTempY < 0) {
    return false;
  }

  SrcPtr = hSrcVObject.pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  asm(`
    mov esi, SrcPtr
    mov edi, DestPtr
    xor eax, eax
    mov ebx, usHeight
    xor ecx, ecx
    mov edx, OFFSET IntensityTable

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    xor eax, eax

    add esi, ecx

    clc
    rcr cl, 1
    jnc BlitNTL2

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    add edi, 2

    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    mov ax, [edi+2]
    mov ax, [edx+eax*2]
    mov [edi+2], ax

    add edi, 4

    BlitNTL3:

    or cl, cl
    jz BlitDispatch

    BlitNTL4:

    mov ax, [edi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    mov ax, [edi+2]
    mov ax, [edx+eax*2]
    mov [edi+2], ax

    mov ax, [edi+4]
    mov ax, [edx+eax*2]
    mov [edi+4], ax

    mov ax, [edi+6]
    mov ax, [edx+eax*2]
    mov [edi+6], ax

    add edi, 8
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec ebx
    jz BlitDone
    add edi, LineSkip
    jmp BlitDispatch

    BlitDone:
  `);

  return true;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZClipPixelateObscured

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        NOT updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        Blits every second pixel ("pixelates").

**********************************************************************************************/
export function Blt8BPPDataTo16BPPBufferTransZClipPixelateObscured(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, pZBuffer: Uint8ClampedArray, usZValue: UINT16, hSrcVObject: SGPVObject, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: SGPRect | null): boolean {
  let p16BPPPalette: Uint16Array;
  let uiOffset: UINT32;
  let uiLineFlag: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: number;
  let DestPtr: number;
  let ZPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;

  // Assertions
  Assert(hSrcVObject != null);
  Assert(pBuffer != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav.sOffsetX;
  iTempY = iY + pTrav.sOffsetY;

  if (clipregion == null) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion.iLeft;
    ClipY1 = clipregion.iTop;
    ClipX2 = clipregion.iRight;
    ClipY2 = clipregion.iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = Math.min(ClipX1 - Math.min(ClipX1, iTempX), usWidth);
  RightSkip = Math.min(Math.max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = Math.min(ClipY1 - Math.min(ClipY1, iTempY), usHeight);
  BottomSkip = Math.min(Math.max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return true;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return true;

  SrcPtr = uiOffset;
  DestPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  ZPtr = (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 4);
  p16BPPPalette = hSrcVObject.pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 4));
  uiLineFlag = (iTempY & 1);

  let pPixData = hSrcVObject.pPixData;
  let remainingSkip: number;
  let remainingBlitLength: number;
  let byte: number;
  let runLength: number;
  let isTransparent: boolean;
  let rgb: number;

  while (TopSkip) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      TopSkip--;
      uiLineFlag ^= 1;
    }
  }

  remainingSkip = LeftSkip;
  remainingBlitLength = BlitLength;

  while (BlitHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      BlitHeight--;
      DestPtr += LineSkip;
      ZPtr += LineSkip;
      uiLineFlag ^= 1;
      remainingSkip = LeftSkip;
      remainingBlitLength = BlitLength;
      continue;
    }

    runLength = byte & 0x7F;
    isTransparent = Boolean(byte & 0x80);

    if (remainingSkip) {
      if (remainingSkip > runLength) {
        if (!isTransparent) {
          SrcPtr += runLength;
        }
        remainingSkip -= runLength;
        continue;
      }

      if (!isTransparent) {
        SrcPtr += remainingSkip;
      }
      runLength -= remainingSkip;
      remainingSkip = 0;
    }

    if (runLength > remainingBlitLength) {
      runLength = remainingBlitLength;
    }

    remainingBlitLength -= runLength;

    if (byte & 0x80) {
      DestPtr += runLength * 4;
      ZPtr += runLength * 4;
    } else {
      while (runLength--) {
        byte = pPixData[SrcPtr++];

        if (getZValue(pZBuffer, ZPtr) < usZValue) {
          rgb = GetRGBColor(p16BPPPalette[byte]);
          pBuffer[DestPtr++] = SGPGetRValue(rgb);
          pBuffer[DestPtr++] = SGPGetGValue(rgb);
          pBuffer[DestPtr++] = SGPGetBValue(rgb);
          pBuffer[DestPtr++] = 0xFF;

          setZValue(pZBuffer, ZPtr, usZValue);
        } else {
          if (uiLineFlag & 1) {
            if (DestPtr & 4) {
              rgb = GetRGBColor(p16BPPPalette[byte]);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            } else {
              DestPtr += 4;
            }
          } else {
            if (DestPtr & 4) {
              DestPtr += 4;
            } else {
              rgb = GetRGBColor(p16BPPPalette[byte]);
              pBuffer[DestPtr++] = SGPGetRValue(rgb);
              pBuffer[DestPtr++] = SGPGetGValue(rgb);
              pBuffer[DestPtr++] = SGPGetBValue(rgb);
              pBuffer[DestPtr++] = 0xFF;
            }
          }
        }

        ZPtr += 4;
      }
    }
  }

  return true;
}

}
