/****************************************************************************************
 * JA2 Lighting Module
 *
 *		Tile-based, ray-casted lighting system.
 *
 *		Lights are precalculated into linked lists containing offsets from 0,0, and a light
 * level to add at that tile. Lists are constructed by casting a ray from the origin of
 * the light, and each tile stopped at is stored as a node in the list. To draw the light
 * during runtime, you traverse the list, checking at each tile that it isn't of the type
 * that can obscure light. If it is, you keep traversing the list until you hit a node
 * with a marker LIGHT_NEW_RAY, which means you're back at the origin, and have skipped
 * the remainder of the last ray.
 *
 * Written by Derek Beland, April 14, 1997
 *
 ***************************************************************************************/

const DISTANCE_SCALE = 4;
const LIGHT_DUSK_CUTOFF = 8;
const LIGHT_DECAY = 0.9; // shade level decay per tile distance

// lightlist node flags
const LIGHT_NODE_DRAWN = 0x00000001; // light node duplicate marker
const LIGHT_ROOF_ONLY = 0x00001000; // light only rooftops
const LIGHT_IGNORE_WALLS = 0x00002000; // doesn't take walls into account
const LIGHT_BACKLIGHT = 0x00004000; // light does not light objs, trees
const LIGHT_NEW_RAY = 0x00008000; // start of new ray in linked list
const LIGHT_EVERYTHING = 0x00010000; // light up everything
const LIGHT_FAKE = 0x10000000; // "fake" light	for display only

// standard light file symbols

const LIGHT_OMNI_R1 = "LTO1.LHT";
const LIGHT_OMNI_R2 = "LTO2.LHT";
const LIGHT_OMNI_R3 = "LTO3.LHT";
const LIGHT_OMNI_R4 = "LTO4.LHT";
const LIGHT_OMNI_R5 = "LTO5.LHT";
const LIGHT_OMNI_R6 = "LTO6.LHT";
const LIGHT_OMNI_R7 = "LTO7.LHT";
const LIGHT_OMNI_R8 = "LTO8.LHT";

const MAX_LIGHT_TEMPLATES = 32; // maximum number of light types
const MAX_LIGHT_SPRITES = 256; // maximum number of light types
const SHADE_MIN = 15; // DARKEST shade value
const SHADE_MAX = 1; // LIGHTEST shade value

// light sprite flags
const LIGHT_SPR_ACTIVE = 0x0001;
const LIGHT_SPR_ON = 0x0002;
const LIGHT_SPR_ANIMATE = 0x0004;
const LIGHT_SPR_ERASE = 0x0008;
const LIGHT_SPR_REDRAW = 0x0010;
const LIGHT_SPR_ONROOF = 0x0020;
const MERC_LIGHT = 0x0040;
const LIGHT_PRIMETIME = 0x0080; // light turns goes on in evening, turns off at bedtime.
const LIGHT_NIGHTTIME = 0x0100; // light stays on when dark outside

const COLOR_RED = 162;
const COLOR_BLUE = 203;
const COLOR_YELLOW = 144;
const COLOR_GREEN = 184;
const COLOR_LTGREY = 134;
const COLOR_DKGREY = 136;
const COLOR_BROWN = 80;
const COLOR_PURPLE = 160;
const COLOR_ORANGE = 76;
const COLOR_WHITE = 208;
const COLOR_BLACK = 72;

// stucture of node in linked list for lights
interface LIGHT_NODE {
  iDX: INT16;
  iDY: INT16;

  uiFlags: UINT8;
  ubLight: UINT8;
}

// structure of light instance, or sprite (a copy of the template)
interface LIGHT_SPRITE {
  iX: INT16;
  iY: INT16;

  iOldX: INT16;
  iOldY: INT16;

  iAnimSpeed: INT16;
  iTemplate: INT32;
  uiFlags: UINT32;
  uiLightType: UINT32;
}

// Low-Level Template Interface

// High-Level Sprite Interface

// system variables
extern LIGHT_NODE *pLightList[MAX_LIGHT_TEMPLATES];
extern UINT16 usTemplateSize[MAX_LIGHT_TEMPLATES];
extern UINT16 *pLightRayList[MAX_LIGHT_TEMPLATES];
extern UINT16 usRaySize[MAX_LIGHT_TEMPLATES];
extern INT16 LightHeight[MAX_LIGHT_TEMPLATES];
extern INT16 LightWidth[MAX_LIGHT_TEMPLATES];
extern INT16 LightXOffset[MAX_LIGHT_TEMPLATES];
extern INT16 LightYOffset[MAX_LIGHT_TEMPLATES];
extern INT16 LightMapLeft[MAX_LIGHT_TEMPLATES];
extern INT16 LightMapTop[MAX_LIGHT_TEMPLATES];
extern INT16 LightMapRight[MAX_LIGHT_TEMPLATES];
extern INT16 LightMapBottom[MAX_LIGHT_TEMPLATES];
extern STR pLightNames[MAX_LIGHT_TEMPLATES];

// Sprite data
extern LIGHT_SPRITE LightSprites[MAX_LIGHT_SPRITES];

// Lighting system general data
extern UINT8 ubAmbientLightLevel;
extern UINT8 gubNumLightColors;

// Lighting colors
extern UINT8 gubNumLightColors;
extern SGPPaletteEntry gpLightColors[3];

// macros
const LightSpriteGetType = (x) => (LightSprites[x].uiLightType);
const LightSpriteGetTypeName = (x) => (pLightNames[LightSprites[x].iTemplate]);
const LightGetAmbient = () => (ubAmbientLightLevel);
