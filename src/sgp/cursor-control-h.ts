namespace ja2 {

export const ANIMATED_CURSOR = 0x02;
export const USE_EXTERN_VO_CURSOR = 0x04;
export const USE_OUTLINE_BLITTER = 0x08;

export const EXTERN_CURSOR = 0xFFF0;
export const EXTERN2_CURSOR = 0xFFE0;
const MAX_COMPOSITES = 5;
export const CENTER_SUBCURSOR = 31000;
export const HIDE_SUBCURSOR = 32000;

export const CENTER_CURSOR = 32000;
export const RIGHT_CURSOR = 32001;
export const LEFT_CURSOR = 32002;
export const TOP_CURSOR = 32003;
export const BOTTOM_CURSOR = 32004;

export const CURSOR_TO_FLASH = 0x01;
export const CURSOR_TO_FLASH2 = 0x02;
export const CURSOR_TO_SUB_CONDITIONALLY = 0x04;
export const DELAY_START_CURSOR = 0x08;
export const CURSOR_TO_PLAY_SOUND = 0x10;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cursor Database
//
///////////////////////////////////////////////////////////////////////////////////////////////////

export interface CursorFileData {
  ubFilename: string /* UINT8[MAX_FILENAME_LEN] */;
  fLoaded: boolean;
  uiIndex: UINT32;
  ubFlags: UINT8;
  ubNumberOfFrames: UINT8;
  hVObject: HVOBJECT;
}

export interface CursorImage {
  uiFileIndex: UINT32;
  uiSubIndex: UINT16;
  uiCurrentFrame: UINT32;
  usPosX: INT16;
  usPosY: INT16;
}

export interface CursorData {
  Composites: CursorImage[] /* [MAX_COMPOSITES] */;
  usNumComposites: UINT16;
  sOffsetX: INT16;
  sOffsetY: INT16;
  usHeight: UINT16;
  usWidth: UINT16;
  bFlags: UINT8;
  bFlashIndex: UINT8;
}

export type MOUSEBLT_HOOK = () => void;

}
