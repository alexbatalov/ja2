const BUFFER_READY = 0x00;
const BUFFER_BUSY = 0x01;
const BUFFER_DIRTY = 0x02;
const BUFFER_DISABLED = 0x03;

const MAX_CURSOR_WIDTH = 64;
const MAX_CURSOR_HEIGHT = 64;
const VIDEO_NO_CURSOR = 0xFFFF;

extern HWND ghWindow;
extern UINT32 guiMouseBufferState; // BUFFER_READY, BUFFER_DIRTY, BUFFER_DISABLED

// 8-bit palette globals

extern SGPPaletteEntry gSgpPalette[256];
extern LPDIRECTDRAWPALETTE gpDirectDrawPalette;
