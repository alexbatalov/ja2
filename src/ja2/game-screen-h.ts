namespace ja2 {

const ARE_IN_FADE_IN = () => (gfFadeIn || gfFadeInitialized);

export type MODAL_HOOK = () => void;

export const TACTICAL_MODAL_NOMOUSE = 1;
export const TACTICAL_MODAL_WITHMOUSE = 2;

}
