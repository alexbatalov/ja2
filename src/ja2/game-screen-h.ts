const ARE_IN_FADE_IN = () => (gfFadeIn || gfFadeInitialized);

type MODAL_HOOK = () => void;

BOOLEAN gfGameScreenLocateToSoldier;
BOOLEAN gfEnteringMapScreen;
UINT8 gubPreferredInitialSelectedGuy;

const TACTICAL_MODAL_NOMOUSE = 1;
const TACTICAL_MODAL_WITHMOUSE = 2;

extern MODAL_HOOK gModalDoneCallback;
