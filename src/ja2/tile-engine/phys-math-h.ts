typedef float real;

const REAL_MAX = FLT_MAX;
const REAL_MIN = FLT_MIN;

const PI2 = 3.14159265358979323846;
const Epsilon2 = 0.00001;

interface vector_3 {
  x: real;
  y: real;
  z: real;
}

interface matrix_3x3 {
  aElements: real[][] /* [3][3] */;
}

// DEFINES
const RADIANS_FROM = (d) => ((d * PI2) / 180);
const DEGREES_FROM = (r) => ((r * 180) / PI2);

vector_3 VSetEqual(vector_3 *a);
vector_3 VSubtract(vector_3 *a, vector_3 *b);
vector_3 VAdd(vector_3 *a, vector_3 *b);
vector_3 VMultScalar(vector_3 *a, real b);
vector_3 VDivScalar(vector_3 *a, real b);
real VDotProduct(vector_3 *a, vector_3 *b);
real VPerpDotProduct(vector_3 *a, vector_3 *b);
vector_3 VGetPerpendicular(vector_3 *a);
real VGetLength(vector_3 *a);
vector_3 VGetNormal(vector_3 *a);
vector_3 VCrossProduct(vector_3 *a, vector_3 *b);
