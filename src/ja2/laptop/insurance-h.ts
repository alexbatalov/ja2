const INS_FONT_COLOR = 2;
const INS_FONT_COLOR_RED = FONT_MCOLOR_RED;
const INS_FONT_BIG = () => FONT14ARIAL();
const INS_FONT_MED = () => FONT12ARIAL();
const INS_FONT_SMALL = () => FONT10ARIAL();

const INS_FONT_BTN_COLOR = FONT_MCOLOR_WHITE;
const INS_FONT_BTN_SHADOW_COLOR = 2;

const INS_FONT_SHADOW = FONT_MCOLOR_WHITE;

const INSURANCE_BULLET_TEXT_OFFSET_X = 21;

const INS_INFO_LEFT_ARROW_BUTTON_X = 71 + LAPTOP_SCREEN_UL_X;
const INS_INFO_LEFT_ARROW_BUTTON_Y = 354 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_INFO_RIGHT_ARROW_BUTTON_X = 409 + LAPTOP_SCREEN_UL_X;
const INS_INFO_RIGHT_ARROW_BUTTON_Y = INS_INFO_LEFT_ARROW_BUTTON_Y;

void GameInitInsurance();
BOOLEAN EnterInsurance();
void ExitInsurance();
void HandleInsurance();
void RenderInsurance();

BOOLEAN InitInsuranceDefaults();
void DisplayInsuranceDefaults();
void RemoveInsuranceDefaults();
void DisplaySmallRedLineWithShadow(UINT16 usStartX, UINT16 usStartY, UINT16 EndX, UINT16 EndY);
void GetInsuranceText(UINT8 ubNumber, STR16 pString);
