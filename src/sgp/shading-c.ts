namespace ja2 {

let Shaded8BPPPalettes: SGPPaletteEntry[][] /* [HVOBJECT_SHADE_TABLES + 3][256] */ = createArrayFrom(HVOBJECT_SHADE_TABLES + 3, () => createArrayFrom(256, createSGPPaletteEntry));
export let ubColorTables: UINT8[][] /* [HVOBJECT_SHADE_TABLES + 3][256] */;

let IntensityTable: UINT16[] /* [65536] */;
let ShadeTable: UINT16[] /* [65536] */;
export let White16BPPPalette: UINT16[] /* [256] */;
let guiShadePercent: FLOAT = 0.48;
let guiBrightPercent: FLOAT = 1.1;

function ShadesCalculateTables(p8BPPPalette: Pointer<SGPPaletteEntry>): boolean {
  let uiCount: UINT32;

  // Green palette
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[0], 0, 255, 0, true);
  // Blue palette
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[HVOBJECT_SHADE_TABLES], 0, 0, 255, true);
  // Yellow palette
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[HVOBJECT_SHADE_TABLES + 1], 255, 255, 0, true);
  // Red palette
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[HVOBJECT_SHADE_TABLES + 2], 255, 0, 0, true);

  // these are the brightening tables, 115%-150% brighter than original
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[1], 293, 293, 293, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[2], 281, 281, 281, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[3], 268, 268, 268, false);

  // palette 4 is the non-modified palette.
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[4], 255, 255, 255, false);

  // the rest are darkening tables, right down to all-black.
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[5], 195, 195, 195, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[6], 165, 165, 165, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[7], 135, 135, 135, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[8], 105, 105, 105, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[9], 75, 75, 75, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[10], 45, 45, 45, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[11], 36, 36, 36, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[12], 27, 27, 27, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[13], 18, 18, 18, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[14], 9, 9, 9, false);
  ShadesCalculatePalette(p8BPPPalette, Shaded8BPPPalettes[15], 0, 0, 0, false);

  // Remap the shade colors to the original palette
  for (uiCount = 0; uiCount < (HVOBJECT_SHADE_TABLES + 3); uiCount++) {
    FindIndecies(Shaded8BPPPalettes[uiCount], p8BPPPalette, ubColorTables[uiCount]);
    ubColorTables[uiCount][0] = 0;
  }

  return true;
}

function ShadesCalculatePalette(pSrcPalette: Pointer<SGPPaletteEntry>, pDestPalette: Pointer<SGPPaletteEntry>, usRed: UINT16, usGreen: UINT16, usBlue: UINT16, fMono: boolean): boolean {
  let cnt: UINT32;
  let lumin: UINT32;
  let rmod: UINT32;
  let gmod: UINT32;
  let bmod: UINT32;

  Assert(pSrcPalette != null);
  Assert(pDestPalette != null);

  for (cnt = 0; cnt < 256; cnt++) {
    if (fMono) {
      lumin = (pSrcPalette[cnt].peRed * 299 / 1000) + (pSrcPalette[cnt].peGreen * 587 / 1000) + (pSrcPalette[cnt].peBlue * 114 / 1000);
      rmod = usRed * lumin / 255;
      gmod = usGreen * lumin / 255;
      bmod = usBlue * lumin / 255;
    } else {
      rmod = (usRed * pSrcPalette[cnt].peRed / 255);
      gmod = (usGreen * pSrcPalette[cnt].peGreen / 255);
      bmod = (usBlue * pSrcPalette[cnt].peBlue / 255);
    }

    pDestPalette[cnt].peRed = Math.min(rmod, 255);
    pDestPalette[cnt].peGreen = Math.min(gmod, 255);
    pDestPalette[cnt].peBlue = Math.min(bmod, 255);
  }

  return true;
}

function FindIndecies(pSrcPalette: Pointer<SGPPaletteEntry>, pMapPalette: Pointer<SGPPaletteEntry>, pTable: Pointer<UINT8>): void {
  let usCurIndex: UINT16;
  let usCurDelta: UINT16;
  let usCurCount: UINT16;
  let pSavedPtr: Pointer<UINT32>;

  asm(`
    // Assumes:
    // ESI = Pointer to source palette (shaded values)
    // EDI = Pointer to original palette (palette we'll end up using!)
    // EBX = Pointer to array of indecies

    mov esi, pSrcPalette
    mov edi, pMapPalette
    mov ebx, pTable

    mov BYTE PTR [ebx],0              ; Index 0 is always 0, for trans col
    inc ebx

    add esi,4                         ; Goto next color entry
    add edi,4
    mov pSavedPtr, edi                ; Save pointer to original pal

    mov usCurCount, 255               ; We'll check cols 1-255

    DoNextIndex:

    mov edi, pSavedPtr                ; Restore saved ptr
    mov usCurIndex, 256               ; Set found index & delta to some
    mov usCurDelta, 0ffffh            ; val so we get at least 1 col.

    mov ecx,255                       ; Check cols 1-255 of orig pal
    push ebx
    xor bx,bx

    NextColor:
    xor ah,ah                         ; Calc delta between shaded color
    mov al,[edi]                      ; and a color in the orig palette.
    mov bl,[esi]                      ; Formula:
    sub ax,bx                         ; Delta = abs(red-origred) +
    or ax,ax                          ;         abs(green-origgreen) +
    jns NC1
    neg ax
    NC1:mov dx,ax                     ;         abs(blue-origblue)
    xor ah,ah
    mov al,[edi+1]
    mov bl,[esi+1]
    sub ax,bx
    or ax,ax                          ;         abs(green-origgreen) +
    jns NC2
    neg ax
    NC2:add dx,ax
    xor ah,ah
    mov al,[edi+2]
    mov bl,[esi+2]
    sub ax,bx
    or ax,ax                          ;         abs(green-origgreen) +
    jns NC3
    neg ax
    NC3:add dx,ax

    cmp dx,usCurDelta                 ; If delta < old delta
    jae NotThisCol                    ; Save this delta and it's
    mov ax,256                        ; palette index
    mov [usCurDelta],dx
    sub   ax,cx
    mov [usCurIndex],ax
    NotThisCol:
    add edi,4                         ; Try next color in orginal pal
    dec cx
    jnz   NextColor

    pop ebx
    mov ax,usCurIndex                 ; By now, usCurIndex holds pal index
    mov [ebx],al                      ; of closest color in orig pal
    inc ebx                           ; so save it, then repeat above
    add esi,4                         ; for the other cols in shade pal
    dec usCurCount
    jnz DoNextIndex
  `);
}

/**********************************************************************************************
 BuildShadeTable

        Builds a 16-bit color shading table. This function should be called only after the current
        video adapter's pixel format is known (IE: GetRgbDistribution() has been called, and the
        globals for masks and shifts have been initialized by that function), and before any
        blitting is done.

        Using the table is a straight lookup. The pixel to be shaded down is used as the index into
        the table and the entry at that point will be a pixel that is 25% darker.

**********************************************************************************************/
export function BuildShadeTable(): void {
  let red: UINT16;
  let green: UINT16;
  let blue: UINT16;
  let index: UINT16;

  for (red = 0; red < 256; red += 4)
    for (green = 0; green < 256; green += 4)
      for (blue = 0; blue < 256; blue += 4) {
        index = Get16BPPColor(FROMRGB(red, green, blue));
        ShadeTable[index] = Get16BPPColor(FROMRGB(red * guiShadePercent, green * guiShadePercent, blue * guiShadePercent));
      }

  memset(White16BPPPalette, 65535, sizeof(White16BPPPalette));
}

/**********************************************************************************************
 BuildIntensityTable

        Builds a 16-bit color shading table. This function should be called only after the current
        video adapter's pixel format is known (IE: GetRgbDistribution() has been called, and the
        globals for masks and shifts have been initialized by that function), and before any
        blitting is done.



**********************************************************************************************/
export function BuildIntensityTable(): void {
  let red: UINT16;
  let green: UINT16;
  let blue: UINT16;
  let index: UINT16;
  let dShadedPercent: FLOAT = 0.80;

  for (red = 0; red < 256; red += 4)
    for (green = 0; green < 256; green += 4)
      for (blue = 0; blue < 256; blue += 4) {
        index = Get16BPPColor(FROMRGB(red, green, blue));
        IntensityTable[index] = Get16BPPColor(FROMRGB(red * dShadedPercent, green * dShadedPercent, blue * dShadedPercent));
      }
}

export function SetShadeTablePercent(uiShadePercent: FLOAT): void {
  guiShadePercent = uiShadePercent;
  BuildShadeTable();
}

function Init8BitTables(): void {
  let Pal: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);
  let uiCount: UINT32;

  // calculate a grey-scale table for the default palette
  for (uiCount = 0; uiCount < 256; uiCount++) {
    Pal[uiCount].peRed = (uiCount % 128) + 128;
    Pal[uiCount].peGreen = (uiCount % 128) + 128;
    Pal[uiCount].peBlue = (uiCount % 128) + 128;
  }

  Pal[0].peRed = 0;
  Pal[0].peGreen = 0;
  Pal[0].peBlue = 0;

  Set8BPPPalette(Shaded8BPPPalettes[4]);
}

function Set8BitModePalette(pPal: Pointer<SGPPaletteEntry>): boolean {
  ShadesCalculateTables(pPal);
  Set8BPPPalette(pPal);
  return true;
}

}
