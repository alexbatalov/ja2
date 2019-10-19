const AIM_FI_LEFT_CLICK_TEXT_X = 116;
const AIM_FI_LEFT_CLICK_TEXT_Y = 35 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_FI_CLICK_DESC_TEXT_Y_OFFSET = 16;

const AIM_FI_RIGHT_CLICK_TEXT_X = 500;

const AIM_FI_CLICK_TEXT_WIDTH = 110;

const AIM_FI_HELP_FONT = () => FONT10ARIAL();
const AIM_FI_HELP_TITLE_FONT = () => FONT12ARIAL();
const AIM_FI_HELP_COLOR = FONT_MCOLOR_WHITE;

void GameInitAimFacialIndex();
BOOLEAN EnterAimFacialIndex();
void ExitAimFacialIndex();
void HandleAimFacialIndex();
BOOLEAN RenderAimFacialIndex();

BOOLEAN DisplayAimFIMugShot();