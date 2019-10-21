// ATE: Use this define to enable winfonts in JA2
// #define     WINFONTS

const USE_WINFONTS = () => (FALSE);

const GET_WINFONT = () => (giCurWinFont);
const SET_USE_WINFONTS = (fSet) => (gfUseWinFonts = fSet);
const SET_WINFONT = (fFont) => (giCurWinFont = fFont);

// INT32						gpMilitaryFont1;
// HVOBJECT				gvoMilitaryFont1;

// Defines
const LARGEFONT1 = () => gpLargeFontType1;
const SMALLFONT1 = () => gpSmallFontType1;
const TINYFONT1 = () => gpTinyFontType1;
const FONT12POINT1 = () => gp12PointFont1;
const CLOCKFONT = () => gpClockFont;
const COMPFONT = () => gpCompFont;
const SMALLCOMPFONT = () => gpSmallCompFont;
const FONT10ROMAN = () => gp10PointRoman;
const FONT12ROMAN = () => gp12PointRoman;
const FONT14SANSERIF = () => gp14PointSansSerif;
const MILITARYFONT1 = () => BLOCKFONT(); // gpMilitaryFont1
const FONT10ARIAL = () => gp10PointArial;
const FONT14ARIAL = () => gp14PointArial;
const FONT12ARIAL = () => gp12PointArial;
const FONT10ARIALBOLD = () => gp10PointArialBold;
const BLOCKFONT = () => gpBlockyFont;
const BLOCKFONT2 = () => gpBlockyFont2;
const FONT12ARIALFIXEDWIDTH = () => gp12PointArialFixedFont;
const FONT16ARIAL = () => gp16PointArial;
const BLOCKFONTNARROW = () => gpBlockFontNarrow;
const FONT14HUMANIST = () => gp14PointHumanist;

// FIXME: Language-specific code
// #ifdef ENGLISH
const HUGEFONT = () => gpHugeFont;
// #else
// #define HUGEFONT gp16PointArial
// #endif

const FONT_SHADE_RED = 6;
const FONT_SHADE_BLUE = 1;
const FONT_SHADE_GREEN = 2;
const FONT_SHADE_YELLOW = 3;
const FONT_SHADE_NEUTRAL = 4;
const FONT_SHADE_WHITE = 5;

const FONT_MCOLOR_BLACK = 0;
const FONT_MCOLOR_WHITE = 208;
const FONT_MCOLOR_DKWHITE = 134;
const FONT_MCOLOR_DKWHITE2 = 134;
const FONT_MCOLOR_LTGRAY = 134;
const FONT_MCOLOR_LTGRAY2 = 134;
const FONT_MCOLOR_DKGRAY = 136;
const FONT_MCOLOR_LTBLUE = 203;
const FONT_MCOLOR_LTRED = 162;
const FONT_MCOLOR_RED = 163;
const FONT_MCOLOR_DKRED = 164;
const FONT_MCOLOR_LTGREEN = 184;
const FONT_MCOLOR_LTYELLOW = 144;

// Grayscale font colors
const FONT_WHITE = 208; // lightest color
const FONT_GRAY1 = 133;
const FONT_GRAY2 = 134; // light gray
const FONT_GRAY3 = 135;
const FONT_GRAY4 = 136; // gray
const FONT_GRAY5 = 137;
const FONT_GRAY6 = 138;
const FONT_GRAY7 = 139; // dark gray
const FONT_GRAY8 = 140;
const FONT_NEARBLACK = 141;
const FONT_BLACK = 0; // darkest color
// Color font colors
const FONT_LTRED = 162;
const FONT_RED = 163;
const FONT_DKRED = 218;
const FONT_ORANGE = 76;
const FONT_YELLOW = 145;
const FONT_DKYELLOW = 80;
const FONT_LTGREEN = 184;
const FONT_GREEN = 185;
const FONT_DKGREEN = 186;
const FONT_LTBLUE = 71;
const FONT_BLUE = 203;
const FONT_DKBLUE = 205;

const FONT_BEIGE = 130;
const FONT_METALGRAY = 94;
const FONT_BURGUNDY = 172;
const FONT_LTKHAKI = 88;
const FONT_KHAKI = 198;
const FONT_DKKHAKI = 201;
