void EnterImpHomePage(void);
void RenderImpHomePage(void);
void ExitImpHomePage(void);
void HandleImpHomePage(void);

// minimun glow time
const MIN_GLOW_DELTA = 100;
const CURSOR_HEIGHT = () => GetFontHeight(FONT14ARIAL()) + 6;

extern INT32 GlowColorsList[][3];
