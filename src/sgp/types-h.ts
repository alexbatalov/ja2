namespace ja2 {

// *** SIR-TECH TYPE DEFINITIONS ***

// These two types are defined by VC6 and were causing redefinition
// problems, but JA2 is compiled with VC5

// HEY WIZARDRY DUDES, JA2 ISN'T THE ONLY PROGRAM WE COMPILE! :-)

export type UINT32 = number;
export type INT32 = number;

// integers
export type UINT8 = number;
export type INT8 = number;
export type UINT16 = number;
export type INT16 = number;
// floats
export type FLOAT = number;
export type DOUBLE = number;
// strings
export type CHAR8 = number;
// other
export type PTR = Pointer<void>;
export type BYTE = UINT8;
export type HWFILE = UINT32;
export const SGPFILENAME_LEN = 100;

// *** SIR-TECH TYPE DEFINITIONS ***

export const BAD_INDEX = -1;

const NULL_HANDLE = 65535;

const ST_EPSILON = 0.00001; // define a sir-tech epsilon value

export interface RECT {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface SGPRect {
  iLeft: INT32;
  iTop: INT32;
  iRight: INT32;
  iBottom: INT32;
}

export function createSGPRectFrom(iLeft: INT32, iTop: INT32, iRight: INT32, iBottom: INT32): SGPRect {
  return {
    iLeft,
    iTop,
    iRight,
    iBottom,
  };
}

export interface SGPPoint {
  iX: INT32;
  iY: INT32;
}

export function createSGPPointFrom(iX: INT32, iY: INT32): SGPPoint {
  return {
    iX,
    iY,
  };
}

interface SGPRange {
  Min: INT32;
  Max: INT32;
}

type VECTOR2 = FLOAT[] /* [2] */; // 2d vector (2x1 matrix)
type VECTOR3 = FLOAT[] /* [3] */; // 3d vector (3x1 matrix)
type VECTOR4 = FLOAT[] /* [4] */; // 4d vector (4x1 matrix)

type IVECTOR2 = INT32[] /* [2] */; // 2d vector (2x1 matrix)
type IVECTOR3 = INT32[] /* [3] */; // 3d vector (3x1 matrix)
type IVECTOR4 = INT32[] /* [4] */; // 4d vector (4x1 matrix)

type MATRIX3 = VECTOR3[] /* [3] */; // 3x3 matrix
type MATRIX4 = VECTOR4[] /* [4] */; // 4x4 matrix

export type ANGLE = VECTOR3; // angle return array
type COLOR = VECTOR4; // rgba color array

}
