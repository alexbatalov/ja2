const ANIMATED_CURSOR = 0x02;
const USE_EXTERN_VO_CURSOR = 0x04;
const USE_OUTLINE_BLITTER = 0x08;

const EXTERN_CURSOR = 0xFFF0;
const EXTERN2_CURSOR = 0xFFE0;
const MAX_COMPOSITES = 5;
const CENTER_SUBCURSOR = 31000;
const HIDE_SUBCURSOR = 32000;

const CENTER_CURSOR = 32000;
const RIGHT_CURSOR = 32001;
const LEFT_CURSOR = 32002;
const TOP_CURSOR = 32003;
const BOTTOM_CURSOR = 32004;

const CURSOR_TO_FLASH = 0x01;
const CURSOR_TO_FLASH2 = 0x02;
const CURSOR_TO_SUB_CONDITIONALLY = 0x04;
const DELAY_START_CURSOR = 0x08;
const CURSOR_TO_PLAY_SOUND = 0x10;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cursor Database
//
///////////////////////////////////////////////////////////////////////////////////////////////////

interface CursorFileData {
  ubFilename: UINT8[] /* [MAX_FILENAME_LEN] */;
  fLoaded: BOOLEAN;
  uiIndex: UINT32;
  ubFlags: UINT8;
  ubNumberOfFrames: UINT8;
  hVObject: HVOBJECT;
}

interface CursorImage {
  uiFileIndex: UINT32;
  uiSubIndex: UINT16;
  uiCurrentFrame: UINT32;
  usPosX: INT16;
  usPosY: INT16;
}

interface CursorData {
  Composites: CursorImage[] /* [MAX_COMPOSITES] */;
  usNumComposites: UINT16;
  sOffsetX: INT16;
  sOffsetY: INT16;
  usHeight: UINT16;
  usWidth: UINT16;
  bFlags: UINT8;
  bFlashIndex: UINT8;
}

extern INT16 gsGlobalCursorYOffset;

// Globals for cursor database offset values
extern INT16 gsCurMouseOffsetX;
extern INT16 gsCurMouseOffsetY;
extern UINT16 gsCurMouseHeight;
extern UINT16 gsCurMouseWidth;

extern UINT32 guiExternVo;
extern UINT16 gusExternVoSubIndex;
extern UINT32 guiExtern2Vo;
extern UINT16 gusExtern2VoSubIndex;
extern BOOLEAN gfExternUse2nd;

type MOUSEBLT_HOOK = () => void;
