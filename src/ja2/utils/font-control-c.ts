namespace ja2 {

export let giCurWinFont: INT32 = 0;
export let gfUseWinFonts: boolean = false;

// Global variables for video objects
export let gpLargeFontType1: INT32;
export let gvoLargeFontType1: SGPVObject;

export let gpSmallFontType1: INT32;
let gvoSmallFontType1: SGPVObject;

export let gpTinyFontType1: INT32;
let gvoTinyFontType1: SGPVObject;

export let gp12PointFont1: INT32;
let gvo12PointFont1: SGPVObject;

export let gpClockFont: INT32;
let gvoClockFont: SGPVObject;

export let gpCompFont: INT32;
let gvoCompFont: SGPVObject;

export let gpSmallCompFont: INT32;
let gvoSmallCompFont: SGPVObject;

export let gp10PointRoman: INT32;
let gvo10PointRoman: SGPVObject;

export let gp12PointRoman: INT32;
let gvo12PointRoman: SGPVObject;

export let gp14PointSansSerif: INT32;
let gvo14PointSansSerif: SGPVObject;

// INT32						gpMilitaryFont1;
// HVOBJECT				gvoMilitaryFont1;

export let gp10PointArial: INT32;
let gvo10PointArial: SGPVObject;

export let gp10PointArialBold: INT32;
let gvo10PointArialBold: SGPVObject;

export let gp14PointArial: INT32;
let gvo14PointArial: SGPVObject;

export let gp12PointArial: INT32;
let gvo12PointArial: SGPVObject;

export let gpBlockyFont: INT32;
let gvoBlockyFont: SGPVObject;

export let gpBlockyFont2: INT32;
let gvoBlockyFont2: SGPVObject;

export let gp12PointArialFixedFont: INT32;
let gvo12PointArialFixedFont: SGPVObject;

export let gp16PointArial: INT32;
let gvo16PointArial: SGPVObject;

export let gpBlockFontNarrow: INT32;
let gvoBlockFontNarrow: SGPVObject;

export let gp14PointHumanist: INT32;
let gvo14PointHumanist: SGPVObject;

// FIXME: Language-specific code
// #ifdef ENGLISH
export let gpHugeFont: INT32;
let gvoHugeFont: SGPVObject;
// #endif

export let giSubTitleWinFont: INT32;

let gfFontsInit: boolean = false;

export function InitializeFonts(): boolean {
  let zWinFontName: string /* INT16[128] */;
  let Color: COLORVAL;

  // Initialize fonts
  //	gpLargeFontType1  = LoadFontFile( "FONTS\\lfont1.sti" );
  gpLargeFontType1 = LoadFontFile("FONTS\\LARGEFONT1.sti");
  gvoLargeFontType1 = GetFontObject(gpLargeFontType1);
  if (!CreateFontPaletteTables(gvoLargeFontType1)) {
    return false;
  }

  //	gpSmallFontType1  = LoadFontFile( "FONTS\\6b-font.sti" );
  gpSmallFontType1 = LoadFontFile("FONTS\\SMALLFONT1.sti");
  gvoSmallFontType1 = GetFontObject(gpSmallFontType1);
  if (!CreateFontPaletteTables(gvoSmallFontType1)) {
    return false;
  }

  //	gpTinyFontType1  = LoadFontFile( "FONTS\\tfont1.sti" );
  gpTinyFontType1 = LoadFontFile("FONTS\\TINYFONT1.sti");
  gvoTinyFontType1 = GetFontObject(gpTinyFontType1);
  if (!CreateFontPaletteTables(gvoTinyFontType1)) {
    return false;
  }

  //	gp12PointFont1	= LoadFontFile( "FONTS\\font-12.sti" );
  gp12PointFont1 = LoadFontFile("FONTS\\FONT12POINT1.sti");
  gvo12PointFont1 = GetFontObject(gp12PointFont1);
  if (!CreateFontPaletteTables(gvo12PointFont1)) {
    return false;
  }

  //  gpClockFont  = LoadFontFile( "FONTS\\DIGI.sti" );
  gpClockFont = LoadFontFile("FONTS\\CLOCKFONT.sti");
  gvoClockFont = GetFontObject(gpClockFont);
  if (!CreateFontPaletteTables(gvoClockFont)) {
    return false;
  }

  //  gpCompFont  = LoadFontFile( "FONTS\\compfont.sti" );
  gpCompFont = LoadFontFile("FONTS\\COMPFONT.sti");
  gvoCompFont = GetFontObject(gpCompFont);
  if (!CreateFontPaletteTables(gvoCompFont)) {
    return false;
  }

  //  gpSmallCompFont  = LoadFontFile( "FONTS\\scfont.sti" );
  gpSmallCompFont = LoadFontFile("FONTS\\SMALLCOMPFONT.sti");
  gvoSmallCompFont = GetFontObject(gpSmallCompFont);
  if (!CreateFontPaletteTables(gvoSmallCompFont)) {
    return false;
  }

  //  gp10PointRoman  = LoadFontFile( "FONTS\\Roman10.sti" );
  gp10PointRoman = LoadFontFile("FONTS\\FONT10ROMAN.sti");
  gvo10PointRoman = GetFontObject(gp10PointRoman);
  if (!CreateFontPaletteTables(gvo10PointRoman)) {
    return false;
  }

  //  gp12PointRoman  = LoadFontFile( "FONTS\\Roman12.sti" );
  gp12PointRoman = LoadFontFile("FONTS\\FONT12ROMAN.sti");
  gvo12PointRoman = GetFontObject(gp12PointRoman);
  if (!CreateFontPaletteTables(gvo12PointRoman)) {
    return false;
  }

  //  gp14PointSansSerif  = LoadFontFile( "FONTS\\SansSerif14.sti" );
  gp14PointSansSerif = LoadFontFile("FONTS\\FONT14SANSERIF.sti");
  gvo14PointSansSerif = GetFontObject(gp14PointSansSerif);
  if (!CreateFontPaletteTables(gvo14PointSansSerif)) {
    return false;
  }

  //	DEF:	Removed.  Replaced with BLOCKFONT
  //  gpMilitaryFont1  = LoadFontFile( "FONTS\\milfont.sti" );
  //  gvoMilitaryFont1 = GetFontObject( gpMilitaryFont1);
  //  CHECKF( CreateFontPaletteTables( gvoMilitaryFont1) );

  //  gp10PointArial  = LoadFontFile( "FONTS\\Arial10.sti" );
  gp10PointArial = LoadFontFile("FONTS\\FONT10ARIAL.sti");
  gvo10PointArial = GetFontObject(gp10PointArial);
  if (!CreateFontPaletteTables(gvo10PointArial)) {
    return false;
  }

  //  gp14PointArial  = LoadFontFile( "FONTS\\Arial14.sti" );
  gp14PointArial = LoadFontFile("FONTS\\FONT14ARIAL.sti");
  gvo14PointArial = GetFontObject(gp14PointArial);
  if (!CreateFontPaletteTables(gvo14PointArial)) {
    return false;
  }

  //  gp10PointArialBold  = LoadFontFile( "FONTS\\Arial10Bold2.sti" );
  gp10PointArialBold = LoadFontFile("FONTS\\FONT10ARIALBOLD.sti");
  gvo10PointArialBold = GetFontObject(gp10PointArialBold);
  if (!CreateFontPaletteTables(gvo10PointArialBold)) {
    return false;
  }

  //  gp12PointArial  = LoadFontFile( "FONTS\\Arial12.sti" );
  gp12PointArial = LoadFontFile("FONTS\\FONT12ARIAL.sti");
  gvo12PointArial = GetFontObject(gp12PointArial);
  if (!CreateFontPaletteTables(gvo12PointArial)) {
    return false;
  }

  //	gpBlockyFont  = LoadFontFile( "FONTS\\FONT2.sti" );
  gpBlockyFont = LoadFontFile("FONTS\\BLOCKFONT.sti");
  gvoBlockyFont = GetFontObject(gpBlockyFont);
  if (!CreateFontPaletteTables(gvoBlockyFont)) {
    return false;
  }

  //	gpBlockyFont2  = LoadFontFile( "FONTS\\interface_font.sti" );
  gpBlockyFont2 = LoadFontFile("FONTS\\BLOCKFONT2.sti");
  gvoBlockyFont2 = GetFontObject(gpBlockyFont2);
  if (!CreateFontPaletteTables(gvoBlockyFont2)) {
    return false;
  }

  //	gp12PointArialFixedFont = LoadFontFile( "FONTS\\Arial12FixedWidth.sti" );
  gp12PointArialFixedFont = LoadFontFile("FONTS\\FONT12ARIALFIXEDWIDTH.sti");
  gvo12PointArialFixedFont = GetFontObject(gp12PointArialFixedFont);
  if (!CreateFontPaletteTables(gvo12PointArialFixedFont)) {
    return false;
  }

  gp16PointArial = LoadFontFile("FONTS\\FONT16ARIAL.sti");
  gvo16PointArial = GetFontObject(gp16PointArial);
  if (!CreateFontPaletteTables(gvo16PointArial)) {
    return false;
  }

  gpBlockFontNarrow = LoadFontFile("FONTS\\BLOCKFONTNARROW.sti");
  gvoBlockFontNarrow = GetFontObject(gpBlockFontNarrow);
  if (!CreateFontPaletteTables(gvoBlockFontNarrow)) {
    return false;
  }

  gp14PointHumanist = LoadFontFile("FONTS\\FONT14HUMANIST.sti");
  gvo14PointHumanist = GetFontObject(gp14PointHumanist);
  if (!CreateFontPaletteTables(gvo14PointHumanist)) {
    return false;
  }

// FIXME: Language-specific code
// #ifdef ENGLISH
  gpHugeFont = LoadFontFile("FONTS\\HUGEFONT.sti");
  gvoHugeFont = GetFontObject(gpHugeFont);
  if (!CreateFontPaletteTables(gvoHugeFont)) {
    return false;
  }
// #endif

  // Set default for font system
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  gfFontsInit = true;

  // ATE: Init WinFont System and any winfonts we wish...

  return true;
}

export function ShutdownFonts(): void {
  UnloadFont(gpLargeFontType1);
  UnloadFont(gpSmallFontType1);
  UnloadFont(gpTinyFontType1);
  UnloadFont(gp12PointFont1);
  UnloadFont(gpClockFont);
  UnloadFont(gpCompFont);
  UnloadFont(gpSmallCompFont);
  UnloadFont(gp10PointRoman);
  UnloadFont(gp12PointRoman);
  UnloadFont(gp14PointSansSerif);
  //	UnloadFont( gpMilitaryFont1);
  UnloadFont(gp10PointArial);
  UnloadFont(gp10PointArialBold);
  UnloadFont(gp14PointArial);
  UnloadFont(gpBlockyFont);
  UnloadFont(gp12PointArialFixedFont);
// FIXME: Language-specific code
// #ifdef ENGLISH
  UnloadFont(gpHugeFont);
// #endif

  // ATE: Shutdown any win fonts
}

// Set shades for fonts
export function SetFontShade(uiFontID: UINT32, bColorID: INT8): boolean {
  let pFont: SGPVObject;

  if (bColorID <= 0) {
    return false;
  }
  if (bColorID >= 16) {
    return false;
  }

  pFont = GetFontObject(uiFontID);

  pFont.pShadeCurrent = pFont.pShades[bColorID];

  return true;
}

function CreateFontPaletteTables(pObj: SGPVObject): boolean {
  let count: UINT32;
  let Pal: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);

  for (count = 0; count < 16; count++) {
    if ((count == 4) && (pObj.p16BPPPalette == pObj.pShades[count]))
      pObj.pShades[count] = <Uint16Array><unknown>null;
    else if (pObj.pShades[count] != null) {
      pObj.pShades[count] = <Uint16Array><unknown>null;
    }
  }

  // Build white palette
  for (count = 0; count < 256; count++) {
    Pal[count].peRed = 255;
    Pal[count].peGreen = 255;
    Pal[count].peBlue = 255;
  }

  pObj.pShades[FONT_SHADE_RED] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 255, 0, 0, true);
  pObj.pShades[FONT_SHADE_BLUE] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 0, 0, 255, true);
  pObj.pShades[FONT_SHADE_GREEN] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 0, 255, 0, true);
  pObj.pShades[FONT_SHADE_YELLOW] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 255, 255, 0, true);
  pObj.pShades[FONT_SHADE_NEUTRAL] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 255, 255, 255, false);

  pObj.pShades[FONT_SHADE_WHITE] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 255, 255, 255, true);

  // the rest are darkening tables, right down to all-black.
  pObj.pShades[0] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 165, 165, 165, false);
  pObj.pShades[7] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 135, 135, 135, false);
  pObj.pShades[8] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 105, 105, 105, false);
  pObj.pShades[9] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 75, 75, 75, false);
  pObj.pShades[10] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 45, 45, 45, false);
  pObj.pShades[11] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 36, 36, 36, false);
  pObj.pShades[12] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 27, 27, 27, false);
  pObj.pShades[13] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 18, 18, 18, false);
  pObj.pShades[14] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 9, 9, 9, false);
  pObj.pShades[15] = Create16BPPPaletteShaded(pObj.pPaletteEntry, 0, 0, 0, false);

  // Set current shade table to neutral color
  pObj.pShadeCurrent = pObj.pShades[4];

  // check to make sure every table got a palette
  // for(count=0; (count < HVOBJECT_SHADE_TABLES) && (pObj->pShades[count]!=NULL); count++);

  // return the result of the check
  // return(count==HVOBJECT_SHADE_TABLES);
  return true;
}

export function WFGetFontHeight(FontNum: INT32): UINT16 {
  // return how many Y pixels we used
  return GetFontHeight(FontNum);
}

export function WFStringPixLength(string: string /* Pointer<UINT16> */, UseFont: INT32): INT16 {
  // return how many Y pixels we used
  return StringPixLength(string, UseFont);
}

}
