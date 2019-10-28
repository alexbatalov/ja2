namespace ja2 {

// *** SIR-TECH TYPE DEFINITIONS ***

// These two types are defined by VC6 and were causing redefinition
// problems, but JA2 is compiled with VC5

// HEY WIZARDRY DUDES, JA2 ISN'T THE ONLY PROGRAM WE COMPILE! :-)

export type UINT32 = unsigned_int;
export type INT32 = signed_int;

// integers
export type UINT8 = unsigned_char;
export type INT8 = signed_char;
export type UINT16 = unsigned_short;
export type INT16 = signed_short;
// floats
export type FLOAT = float;
export type DOUBLE = double;
// strings
export type CHAR8 = char;
// flags (individual bits used)
type FLAGS8 = unsigned_char;
type FLAGS16 = unsigned_short;
type FLAGS32 = unsigned_long;
// other
export type PTR = Pointer<void>;
type HNDL = unsigned_short;
export type BYTE = UINT8;
export type HWFILE = UINT32;
export const SGPFILENAME_LEN = 100;

// *** SIR-TECH TYPE DEFINITIONS ***

export const BAD_INDEX = -1;

const NULL_HANDLE = 65535;

const ST_EPSILON = 0.00001; // define a sir-tech epsilon value

export interface SGPRect {
  iLeft: INT32;
  iTop: INT32;
  iRight: INT32;
  iBottom: INT32;
}

export interface SGPPoint {
  iX: INT32;
  iY: INT32;
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
