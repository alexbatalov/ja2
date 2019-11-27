namespace ja2 {

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

export const DISTANCE_SCALE = 4;
export const LIGHT_DUSK_CUTOFF = 8;
export const LIGHT_DECAY = 0.9; // shade level decay per tile distance

// lightlist node flags
export const LIGHT_NODE_DRAWN = 0x00000001; // light node duplicate marker
export const LIGHT_ROOF_ONLY = 0x00001000; // light only rooftops
export const LIGHT_IGNORE_WALLS = 0x00002000; // doesn't take walls into account
export const LIGHT_BACKLIGHT = 0x00004000; // light does not light objs, trees
export const LIGHT_NEW_RAY = 0x00008000; // start of new ray in linked list
export const LIGHT_EVERYTHING = 0x00010000; // light up everything
export const LIGHT_FAKE = 0x10000000; // "fake" light	for display only

// standard light file symbols

const LIGHT_OMNI_R1 = "LTO1.LHT";
const LIGHT_OMNI_R2 = "LTO2.LHT";
const LIGHT_OMNI_R3 = "LTO3.LHT";
const LIGHT_OMNI_R4 = "LTO4.LHT";
const LIGHT_OMNI_R5 = "LTO5.LHT";
const LIGHT_OMNI_R6 = "LTO6.LHT";
const LIGHT_OMNI_R7 = "LTO7.LHT";
const LIGHT_OMNI_R8 = "LTO8.LHT";

export const MAX_LIGHT_TEMPLATES = 32; // maximum number of light types
export const MAX_LIGHT_SPRITES = 256; // maximum number of light types
export const SHADE_MIN = 15; // DARKEST shade value
export const SHADE_MAX = 1; // LIGHTEST shade value

// light sprite flags
export const LIGHT_SPR_ACTIVE = 0x0001;
export const LIGHT_SPR_ON = 0x0002;
const LIGHT_SPR_ANIMATE = 0x0004;
export const LIGHT_SPR_ERASE = 0x0008;
export const LIGHT_SPR_REDRAW = 0x0010;
export const LIGHT_SPR_ONROOF = 0x0020;
export const MERC_LIGHT = 0x0040;
export const LIGHT_PRIMETIME = 0x0080; // light turns goes on in evening, turns off at bedtime.
export const LIGHT_NIGHTTIME = 0x0100; // light stays on when dark outside

export const COLOR_RED = 162;
export const COLOR_BLUE = 203;
const COLOR_YELLOW = 144;
export const COLOR_GREEN = 184;
const COLOR_LTGREY = 134;
const COLOR_DKGREY = 136;
const COLOR_BROWN = 80;
const COLOR_PURPLE = 160;
const COLOR_ORANGE = 76;
const COLOR_WHITE = 208;
const COLOR_BLACK = 72;

// stucture of node in linked list for lights
export interface LIGHT_NODE {
  iDX: INT16;
  iDY: INT16;

  uiFlags: UINT8;
  ubLight: UINT8;
}

export function createLightNode(): LIGHT_NODE {
  return {
    iDX: 0,
    iDY: 0,
    uiFlags: 0,
    ubLight: 0,
  };
}

export const LIGHT_NODE_SIZE = 6;

export function readLightNode(o: LIGHT_NODE, buffer: Buffer, offset: number = 0): number {
  o.iDX = buffer.readInt16LE(offset); offset += 2;
  o.iDY = buffer.readInt16LE(offset); offset += 2;
  o.uiFlags = buffer.readUInt8(offset++);
  o.ubLight = buffer.readUInt8(offset++);
  return offset;
}

export function writeLightNode(o: LIGHT_NODE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.iDX, offset);
  offset = buffer.writeInt16LE(o.iDY, offset);
  offset = buffer.writeUInt8(o.uiFlags, offset);
  offset = buffer.writeUInt8(o.ubLight, offset);
  return offset;
}

// structure of light instance, or sprite (a copy of the template)
export interface LIGHT_SPRITE {
  iX: INT16;
  iY: INT16;

  iOldX: INT16;
  iOldY: INT16;

  iAnimSpeed: INT16;
  iTemplate: INT32;
  uiFlags: UINT32;
  uiLightType: UINT32;
}

export function createLightSprite(): LIGHT_SPRITE {
  return {
    iX: 0,
    iY: 0,
    iOldX: 0,
    iOldY: 0,
    iAnimSpeed: 0,
    iTemplate: 0,
    uiFlags: 0,
    uiLightType: 0,
  };
}

export function resetLightSprite(o: LIGHT_SPRITE) {
  o.iX = 0;
  o.iY = 0;
  o.iOldX = 0;
  o.iOldY = 0;
  o.iAnimSpeed = 0;
  o.iTemplate = 0;
  o.uiFlags = 0;
  o.uiLightType = 0;
}

export const LIGHT_SPRITE_SIZE = 24;

export function readLightSprite(o: LIGHT_SPRITE, buffer: Buffer, offset: number = 0): number {
  o.iX = buffer.readInt16LE(offset); offset += 2;
  o.iY = buffer.readInt16LE(offset); offset += 2;
  o.iOldX = buffer.readInt16LE(offset); offset += 2;
  o.iOldY = buffer.readInt16LE(offset); offset += 2;
  o.iAnimSpeed = buffer.readInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.iTemplate = buffer.readInt32LE(offset); offset += 4;
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  o.uiLightType = buffer.readUInt32LE(offset); offset += 4;
  return offset;
}

export function writeLightSprite(o: LIGHT_SPRITE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.iX, offset);
  offset = buffer.writeInt16LE(o.iY, offset);
  offset = buffer.writeInt16LE(o.iOldX, offset);
  offset = buffer.writeInt16LE(o.iOldY, offset);
  offset = buffer.writeInt16LE(o.iAnimSpeed, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeInt32LE(o.iTemplate, offset);
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = buffer.writeUInt32LE(o.uiLightType, offset);
  return offset;
}

// Low-Level Template Interface

// High-Level Sprite Interface

// macros
const LightSpriteGetType = (x: number) => (LightSprites[x].uiLightType);
export const LightSpriteGetTypeName = (x: number) => (pLightNames[LightSprites[x].iTemplate]);
export const LightGetAmbient = () => (ubAmbientLightLevel);

}
