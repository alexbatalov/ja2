const BROKEN_LINK__FONT = () => FONT12ARIAL();
const BROKEN_LINK__COLOR = FONT_MCOLOR_BLACK;

const BROKEN_LINK__MESSAGE_X = LAPTOP_SCREEN_UL_X + 20;
const BROKEN_LINK__MESSAGE_Y = LAPTOP_SCREEN_UL_Y + 50;
const BROKEN_LINK__MESSAGE_WIDTH = (LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X);

const BROKEN_LINK__SITE_NOT_FOUND_Y = LAPTOP_SCREEN_UL_Y + 65;

function EnterBrokenLink(): BOOLEAN {
  //	RenderBrokenLink();
  return TRUE;
}

function ExitBrokenLink(): void {
}

function HandleBrokenLink(): void {
}

function RenderBrokenLink(): void {
  // Color fill the laptop white
  DrawBrokenLinkWhiteBackground();

  SetFontShadow(NO_SHADOW);

  // Put up a message saying the link is dead
  DisplayWrappedString(BROKEN_LINK__MESSAGE_X, BROKEN_LINK__MESSAGE_Y, BROKEN_LINK__MESSAGE_WIDTH, 2, BROKEN_LINK__FONT(), BROKEN_LINK__COLOR, BrokenLinkText[Enum379.BROKEN_LINK_TXT_ERROR_404], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Put up a message saying the link is dead
  DisplayWrappedString(BROKEN_LINK__MESSAGE_X, BROKEN_LINK__SITE_NOT_FOUND_Y, BROKEN_LINK__MESSAGE_WIDTH, 2, BROKEN_LINK__FONT(), BROKEN_LINK__COLOR, BrokenLinkText[Enum379.BROKEN_LINK_TXT_SITE_NOT_FOUND], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  SetFontShadow(DEFAULT_SHADOW);

  InvalidateRegion(0, 0, 640, 480);
}

function DrawBrokenLinkWhiteBackground(): void {
  ColorFillVideoSurfaceArea(FRAME_BUFFER, LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y, Get16BPPColor(FROMRGB(255, 255, 255)));
}
