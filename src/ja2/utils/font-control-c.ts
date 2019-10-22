let giCurWinFont: INT32 = 0;
let gfUseWinFonts: BOOLEAN = FALSE;

// Global variables for video objects
let gpLargeFontType1: INT32;
let gvoLargeFontType1: HVOBJECT;

let gpSmallFontType1: INT32;
let gvoSmallFontType1: HVOBJECT;

let gpTinyFontType1: INT32;
let gvoTinyFontType1: HVOBJECT;

let gp12PointFont1: INT32;
let gvo12PointFont1: HVOBJECT;

let gpClockFont: INT32;
let gvoClockFont: HVOBJECT;

let gpCompFont: INT32;
let gvoCompFont: HVOBJECT;

let gpSmallCompFont: INT32;
let gvoSmallCompFont: HVOBJECT;

let gp10PointRoman: INT32;
let gvo10PointRoman: HVOBJECT;

let gp12PointRoman: INT32;
let gvo12PointRoman: HVOBJECT;

let gp14PointSansSerif: INT32;
let gvo14PointSansSerif: HVOBJECT;

// INT32						gpMilitaryFont1;
// HVOBJECT				gvoMilitaryFont1;

let gp10PointArial: INT32;
let gvo10PointArial: HVOBJECT;

let gp10PointArialBold: INT32;
let gvo10PointArialBold: HVOBJECT;

let gp14PointArial: INT32;
let gvo14PointArial: HVOBJECT;

let gp12PointArial: INT32;
let gvo12PointArial: HVOBJECT;

let gpBlockyFont: INT32;
let gvoBlockyFont: HVOBJECT;

let gpBlockyFont2: INT32;
let gvoBlockyFont2: HVOBJECT;

let gp12PointArialFixedFont: INT32;
let gvo12PointArialFixedFont: HVOBJECT;

let gp16PointArial: INT32;
let gvo16PointArial: HVOBJECT;

let gpBlockFontNarrow: INT32;
let gvoBlockFontNarrow: HVOBJECT;

let gp14PointHumanist: INT32;
let gvo14PointHumanist: HVOBJECT;

// FIXME: Language-specific code
// #ifdef ENGLISH
let gpHugeFont: INT32;
let gvoHugeFont: HVOBJECT;
// #endif

let giSubTitleWinFont: INT32;

let gfFontsInit: BOOLEAN = FALSE;

function InitializeFonts(): BOOLEAN {
  let zWinFontName: INT16[] /* [128] */;
  let Color: COLORVAL;

  // Initialize fonts
  //	gpLargeFontType1  = LoadFontFile( "FONTS\\lfont1.sti" );
  gpLargeFontType1 = LoadFontFile("FONTS\\LARGEFONT1.sti");
  gvoLargeFontType1 = GetFontObject(gpLargeFontType1);
  CHECKF(CreateFontPaletteTables(gvoLargeFontType1));

  //	gpSmallFontType1  = LoadFontFile( "FONTS\\6b-font.sti" );
  gpSmallFontType1 = LoadFontFile("FONTS\\SMALLFONT1.sti");
  gvoSmallFontType1 = GetFontObject(gpSmallFontType1);
  CHECKF(CreateFontPaletteTables(gvoSmallFontType1));

  //	gpTinyFontType1  = LoadFontFile( "FONTS\\tfont1.sti" );
  gpTinyFontType1 = LoadFontFile("FONTS\\TINYFONT1.sti");
  gvoTinyFontType1 = GetFontObject(gpTinyFontType1);
  CHECKF(CreateFontPaletteTables(gvoTinyFontType1));

  //	gp12PointFont1	= LoadFontFile( "FONTS\\font-12.sti" );
  gp12PointFont1 = LoadFontFile("FONTS\\FONT12POINT1.sti");
  gvo12PointFont1 = GetFontObject(gp12PointFont1);
  CHECKF(CreateFontPaletteTables(gvo12PointFont1));

  //  gpClockFont  = LoadFontFile( "FONTS\\DIGI.sti" );
  gpClockFont = LoadFontFile("FONTS\\CLOCKFONT.sti");
  gvoClockFont = GetFontObject(gpClockFont);
  CHECKF(CreateFontPaletteTables(gvoClockFont));

  //  gpCompFont  = LoadFontFile( "FONTS\\compfont.sti" );
  gpCompFont = LoadFontFile("FONTS\\COMPFONT.sti");
  gvoCompFont = GetFontObject(gpCompFont);
  CHECKF(CreateFontPaletteTables(gvoCompFont));

  //  gpSmallCompFont  = LoadFontFile( "FONTS\\scfont.sti" );
  gpSmallCompFont = LoadFontFile("FONTS\\SMALLCOMPFONT.sti");
  gvoSmallCompFont = GetFontObject(gpSmallCompFont);
  CHECKF(CreateFontPaletteTables(gvoSmallCompFont));

  //  gp10PointRoman  = LoadFontFile( "FONTS\\Roman10.sti" );
  gp10PointRoman = LoadFontFile("FONTS\\FONT10ROMAN.sti");
  gvo10PointRoman = GetFontObject(gp10PointRoman);
  CHECKF(CreateFontPaletteTables(gvo10PointRoman));

  //  gp12PointRoman  = LoadFontFile( "FONTS\\Roman12.sti" );
  gp12PointRoman = LoadFontFile("FONTS\\FONT12ROMAN.sti");
  gvo12PointRoman = GetFontObject(gp12PointRoman);
  CHECKF(CreateFontPaletteTables(gvo12PointRoman));

  //  gp14PointSansSerif  = LoadFontFile( "FONTS\\SansSerif14.sti" );
  gp14PointSansSerif = LoadFontFile("FONTS\\FONT14SANSERIF.sti");
  gvo14PointSansSerif = GetFontObject(gp14PointSansSerif);
  CHECKF(CreateFontPaletteTables(gvo14PointSansSerif));

  //	DEF:	Removed.  Replaced with BLOCKFONT
  //  gpMilitaryFont1  = LoadFontFile( "FONTS\\milfont.sti" );
  //  gvoMilitaryFont1 = GetFontObject( gpMilitaryFont1);
  //  CHECKF( CreateFontPaletteTables( gvoMilitaryFont1) );

  //  gp10PointArial  = LoadFontFile( "FONTS\\Arial10.sti" );
  gp10PointArial = LoadFontFile("FONTS\\FONT10ARIAL.sti");
  gvo10PointArial = GetFontObject(gp10PointArial);
  CHECKF(CreateFontPaletteTables(gvo10PointArial));

  //  gp14PointArial  = LoadFontFile( "FONTS\\Arial14.sti" );
  gp14PointArial = LoadFontFile("FONTS\\FONT14ARIAL.sti");
  gvo14PointArial = GetFontObject(gp14PointArial);
  CHECKF(CreateFontPaletteTables(gvo14PointArial));

  //  gp10PointArialBold  = LoadFontFile( "FONTS\\Arial10Bold2.sti" );
  gp10PointArialBold = LoadFontFile("FONTS\\FONT10ARIALBOLD.sti");
  gvo10PointArialBold = GetFontObject(gp10PointArialBold);
  CHECKF(CreateFontPaletteTables(gvo10PointArialBold));

  //  gp12PointArial  = LoadFontFile( "FONTS\\Arial12.sti" );
  gp12PointArial = LoadFontFile("FONTS\\FONT12ARIAL.sti");
  gvo12PointArial = GetFontObject(gp12PointArial);
  CHECKF(CreateFontPaletteTables(gvo12PointArial));

  //	gpBlockyFont  = LoadFontFile( "FONTS\\FONT2.sti" );
  gpBlockyFont = LoadFontFile("FONTS\\BLOCKFONT.sti");
  gvoBlockyFont = GetFontObject(gpBlockyFont);
  CHECKF(CreateFontPaletteTables(gvoBlockyFont));

  //	gpBlockyFont2  = LoadFontFile( "FONTS\\interface_font.sti" );
  gpBlockyFont2 = LoadFontFile("FONTS\\BLOCKFONT2.sti");
  gvoBlockyFont2 = GetFontObject(gpBlockyFont2);
  CHECKF(CreateFontPaletteTables(gvoBlockyFont2));

  //	gp12PointArialFixedFont = LoadFontFile( "FONTS\\Arial12FixedWidth.sti" );
  gp12PointArialFixedFont = LoadFontFile("FONTS\\FONT12ARIALFIXEDWIDTH.sti");
  gvo12PointArialFixedFont = GetFontObject(gp12PointArialFixedFont);
  CHECKF(CreateFontPaletteTables(gvo12PointArialFixedFont));

  gp16PointArial = LoadFontFile("FONTS\\FONT16ARIAL.sti");
  gvo16PointArial = GetFontObject(gp16PointArial);
  CHECKF(CreateFontPaletteTables(gvo16PointArial));

  gpBlockFontNarrow = LoadFontFile("FONTS\\BLOCKFONTNARROW.sti");
  gvoBlockFontNarrow = GetFontObject(gpBlockFontNarrow);
  CHECKF(CreateFontPaletteTables(gvoBlockFontNarrow));

  gp14PointHumanist = LoadFontFile("FONTS\\FONT14HUMANIST.sti");
  gvo14PointHumanist = GetFontObject(gp14PointHumanist);
  CHECKF(CreateFontPaletteTables(gvo14PointHumanist));

// FIXME: Language-specific code
// #ifdef ENGLISH
  gpHugeFont = LoadFontFile("FONTS\\HUGEFONT.sti");
  gvoHugeFont = GetFontObject(gpHugeFont);
  CHECKF(CreateFontPaletteTables(gvoHugeFont));
// #endif

  // Set default for font system
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, FALSE);

  gfFontsInit = TRUE;

  // ATE: Init WinFont System and any winfonts we wish...

  return TRUE;
}

function ShutdownFonts(): void {
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
function SetFontShade(uiFontID: UINT32, bColorID: INT8): BOOLEAN {
  let pFont: HVOBJECT;

  CHECKF(bColorID > 0);
  CHECKF(bColorID < 16);

  pFont = GetFontObject(uiFontID);

  pFont->pShadeCurrent = pFont->pShades[bColorID];

  return TRUE;
}

function CreateFontPaletteTables(pObj: HVOBJECT): UINT16 {
  let count: UINT32;
  let Pal: SGPPaletteEntry[] /* [256] */;

  for (count = 0; count < 16; count++) {
    if ((count == 4) && (pObj->p16BPPPalette == pObj->pShades[count]))
      pObj->pShades[count] = NULL;
    else if (pObj->pShades[count] != NULL) {
      MemFree(pObj->pShades[count]);
      pObj->pShades[count] = NULL;
    }
  }

  // Build white palette
  for (count = 0; count < 256; count++) {
    Pal[count].peRed = 255;
    Pal[count].peGreen = 255;
    Pal[count].peBlue = 255;
  }

  pObj->pShades[FONT_SHADE_RED] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 255, 0, 0, TRUE);
  pObj->pShades[FONT_SHADE_BLUE] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 0, 0, 255, TRUE);
  pObj->pShades[FONT_SHADE_GREEN] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 0, 255, 0, TRUE);
  pObj->pShades[FONT_SHADE_YELLOW] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 255, 255, 0, TRUE);
  pObj->pShades[FONT_SHADE_NEUTRAL] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 255, 255, 255, FALSE);

  pObj->pShades[FONT_SHADE_WHITE] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 255, 255, 255, TRUE);

  // the rest are darkening tables, right down to all-black.
  pObj->pShades[0] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 165, 165, 165, FALSE);
  pObj->pShades[7] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 135, 135, 135, FALSE);
  pObj->pShades[8] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 105, 105, 105, FALSE);
  pObj->pShades[9] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 75, 75, 75, FALSE);
  pObj->pShades[10] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 45, 45, 45, FALSE);
  pObj->pShades[11] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 36, 36, 36, FALSE);
  pObj->pShades[12] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 27, 27, 27, FALSE);
  pObj->pShades[13] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 18, 18, 18, FALSE);
  pObj->pShades[14] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 9, 9, 9, FALSE);
  pObj->pShades[15] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 0, 0, 0, FALSE);

  // Set current shade table to neutral color
  pObj->pShadeCurrent = pObj->pShades[4];

  // check to make sure every table got a palette
  // for(count=0; (count < HVOBJECT_SHADE_TABLES) && (pObj->pShades[count]!=NULL); count++);

  // return the result of the check
  // return(count==HVOBJECT_SHADE_TABLES);
  return TRUE;
}

function WFGetFontHeight(FontNum: INT32): UINT16 {
  if (USE_WINFONTS()) {
    // return how many Y pixels we used
    return GetWinFontHeight("a\0", GET_WINFONT());
  } else {
    // return how many Y pixels we used
    return GetFontHeight(FontNum);
  }
}

function WFStringPixLength(string: Pointer<UINT16>, UseFont: INT32): INT16 {
  if (USE_WINFONTS()) {
    // return how many Y pixels we used
    return WinFontStringPixLength(string, GET_WINFONT());
  } else {
    // return how many Y pixels we used
    return StringPixLength(string, UseFont);
  }
}
