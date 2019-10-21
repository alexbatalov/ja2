type real = float;

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
