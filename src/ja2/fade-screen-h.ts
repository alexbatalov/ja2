const FADE_OUT_VERSION_ONE = 1;
const FADE_OUT_VERSION_FASTER = 2;
const FADE_OUT_VERSION_SIDE = 3;
const FADE_OUT_SQUARE = 4;
const FADE_OUT_REALFADE = 5;

const FADE_IN_VERSION_ONE = 10;
const FADE_IN_SQUARE = 11;
const FADE_IN_REALFADE = 12;

type FADE_HOOK = () => void;

extern FADE_HOOK gFadeInDoneCallback;
extern FADE_HOOK gFadeOutDoneCallback;

type FADE_FUNCTION = () => void;

BOOLEAN gfFadeInitialized;
BOOLEAN gfFadeIn;
INT8 gbFadeType;
FADE_FUNCTION gFadeFunction;
BOOLEAN gfFadeInVideo;
