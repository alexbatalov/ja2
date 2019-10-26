// *** SIR-TECH TYPE DEFINITIONS ***

// These two types are defined by VC6 and were causing redefinition
// problems, but JA2 is compiled with VC5

// HEY WIZARDRY DUDES, JA2 ISN'T THE ONLY PROGRAM WE COMPILE! :-)

type UINT32 = unsigned_int;
type INT32 = signed_int;

// integers
type UINT8 = unsigned_char;
type INT8 = signed_char;
type UINT16 = unsigned_short;
type INT16 = signed_short;
// floats
type FLOAT = float;
type DOUBLE = double;
// strings
type CHAR8 = char;
type CHAR16 = wchar_t;
type STR = Pointer<char>;
type STR8 = Pointer<char>;
type STR16 = Pointer<wchar_t>;
// flags (individual bits used)
type FLAGS8 = unsigned_char;
type FLAGS16 = unsigned_short;
type FLAGS32 = unsigned_long;
// other
type PTR = Pointer<void>;
type HNDL = unsigned_short;
type BYTE = UINT8;
type STRING512 = CHAR8[] /* [512] */;
type HWFILE = UINT32;
const SGPFILENAME_LEN = 100;
type SGPFILENAME = CHAR8[] /* [SGPFILENAME_LEN] */;

// *** SIR-TECH TYPE DEFINITIONS ***

const BAD_INDEX = -1;

const NULL_HANDLE = 65535;

const ST_EPSILON = 0.00001; // define a sir-tech epsilon value

interface SGPRect {
  iLeft: INT32;
  iTop: INT32;
  iRight: INT32;
  iBottom: INT32;
}

interface SGPPoint {
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

type ANGLE = VECTOR3; // angle return array
type COLOR = VECTOR4; // rgba color array
