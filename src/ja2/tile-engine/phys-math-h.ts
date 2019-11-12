namespace ja2 {

const Epsilon2 = 0.00001;

export interface vector_3 {
  x: FLOAT;
  y: FLOAT;
  z: FLOAT;
}

export function createVector3(): vector_3 {
  return {
    x: 0,
    y: 0,
    z: 0,
  };
}

interface matrix_3x3 {
  aElements: FLOAT[][] /* [3][3] */;
}

// DEFINES
const RADIANS_FROM = (d: number) => ((d * Math.PI) / 180);
const DEGREES_FROM = (r: number) => ((r * 180) / Math.PI);

}
