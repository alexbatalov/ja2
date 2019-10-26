export const SLIDER_VERTICAL = 0x00000001;
export const SLIDER_HORIZONTAL = 0x00000002;

// defines for the different styles of sliders
export const enum Enum329 {
  SLIDER_DEFAULT_STYLE,

  SLIDER_VERTICAL_STEEL,

  NUM_SLIDER_STYLES,
}

export type SLIDER_CHANGE_CALLBACK = (a: INT32) => void;

/*

ubStyle
usPosX
usPosY
usWidth
usNumberOfIncrements
sPriority
SliderChangeCallback
        void SliderChangeCallBack( INT32 iNewValue )
*/
