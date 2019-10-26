// ATE: Use this define to enable winfonts in JA2
// #define     WINFONTS

export const USE_WINFONTS = () => (false);

export const GET_WINFONT = () => (giCurWinFont);
export const SET_USE_WINFONTS = (fSet) => (gfUseWinFonts = fSet);
export const SET_WINFONT = (fFont) => (giCurWinFont = fFont);

// INT32						gpMilitaryFont1;
// HVOBJECT				gvoMilitaryFont1;

// Defines
export const LARGEFONT1 = () => gpLargeFontType1;
export const SMALLFONT1 = () => gpSmallFontType1;
export const TINYFONT1 = () => gpTinyFontType1;
export const FONT12POINT1 = () => gp12PointFont1;
const CLOCKFONT = () => gpClockFont;
export const COMPFONT = () => gpCompFont;
export const SMALLCOMPFONT = () => gpSmallCompFont;
export const FONT10ROMAN = () => gp10PointRoman;
export const FONT12ROMAN = () => gp12PointRoman;
export const FONT14SANSERIF = () => gp14PointSansSerif;
export const MILITARYFONT1 = () => BLOCKFONT(); // gpMilitaryFont1
export const FONT10ARIAL = () => gp10PointArial;
export const FONT14ARIAL = () => gp14PointArial;
export const FONT12ARIAL = () => gp12PointArial;
export const FONT10ARIALBOLD = () => gp10PointArialBold;
export const BLOCKFONT = () => gpBlockyFont;
export const BLOCKFONT2 = () => gpBlockyFont2;
export const FONT12ARIALFIXEDWIDTH = () => gp12PointArialFixedFont;
export const FONT16ARIAL = () => gp16PointArial;
export const BLOCKFONTNARROW = () => gpBlockFontNarrow;
export const FONT14HUMANIST = () => gp14PointHumanist;

// FIXME: Language-specific code
// #ifdef ENGLISH
export const HUGEFONT = () => gpHugeFont;
// #else
// #define HUGEFONT gp16PointArial
// #endif

export const FONT_SHADE_RED = 6;
export const FONT_SHADE_BLUE = 1;
export const FONT_SHADE_GREEN = 2;
export const FONT_SHADE_YELLOW = 3;
export const FONT_SHADE_NEUTRAL = 4;
export const FONT_SHADE_WHITE = 5;

export const FONT_MCOLOR_BLACK = 0;
export const FONT_MCOLOR_WHITE = 208;
export const FONT_MCOLOR_DKWHITE = 134;
export const FONT_MCOLOR_DKWHITE2 = 134;
export const FONT_MCOLOR_LTGRAY = 134;
export const FONT_MCOLOR_LTGRAY2 = 134;
export const FONT_MCOLOR_DKGRAY = 136;
export const FONT_MCOLOR_LTBLUE = 203;
export const FONT_MCOLOR_LTRED = 162;
export const FONT_MCOLOR_RED = 163;
export const FONT_MCOLOR_DKRED = 164;
export const FONT_MCOLOR_LTGREEN = 184;
export const FONT_MCOLOR_LTYELLOW = 144;

// Grayscale font colors
export const FONT_WHITE = 208; // lightest color
export const FONT_GRAY1 = 133;
export const FONT_GRAY2 = 134; // light gray
export const FONT_GRAY3 = 135;
export const FONT_GRAY4 = 136; // gray
const FONT_GRAY5 = 137;
const FONT_GRAY6 = 138;
export const FONT_GRAY7 = 139; // dark gray
const FONT_GRAY8 = 140;
export const FONT_NEARBLACK = 141;
export const FONT_BLACK = 0; // darkest color
// Color font colors
export const FONT_LTRED = 162;
export const FONT_RED = 163;
export const FONT_DKRED = 218;
export const FONT_ORANGE = 76;
export const FONT_YELLOW = 145;
export const FONT_DKYELLOW = 80;
export const FONT_LTGREEN = 184;
export const FONT_GREEN = 185;
export const FONT_DKGREEN = 186;
export const FONT_LTBLUE = 71;
export const FONT_BLUE = 203;
export const FONT_DKBLUE = 205;

export const FONT_BEIGE = 130;
export const FONT_METALGRAY = 94;
const FONT_BURGUNDY = 172;
export const FONT_LTKHAKI = 88;
const FONT_KHAKI = 198;
export const FONT_DKKHAKI = 201;
