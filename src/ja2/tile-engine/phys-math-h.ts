namespace ja2 {

export type real = float;

const REAL_MAX = FLT_MAX;
const REAL_MIN = FLT_MIN;

const Epsilon2 = 0.00001;

export interface vector_3 {
  x: real;
  y: real;
  z: real;
}

interface matrix_3x3 {
  aElements: real[][] /* [3][3] */;
}

// DEFINES
const RADIANS_FROM = (d) => ((d * Math.PI) / 180);
const DEGREES_FROM = (r) => ((r * 180) / Math.PI);

}
