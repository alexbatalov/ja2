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

export function copyVector3(destination: vector_3, source: vector_3) {
  destination.x = source.x;
  destination.y = source.y;
  destination.z = source.z;
}

export function resetVector3(o: vector_3) {
  o.x = 0;
  o.y = 0;
  o.z = 0;
}

export function readVector3(o: vector_3, buffer: Buffer, offset: number = 0): number {
  o.x = buffer.readFloatLE(offset); offset += 4;
  o.y = buffer.readFloatLE(offset); offset += 4;
  o.z = buffer.readFloatLE(offset); offset += 4;
  return offset;
}

export function writeVector3(o: vector_3, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeFloatLE(o.x, offset);
  offset = buffer.writeFloatLE(o.y, offset);
  offset = buffer.writeFloatLE(o.z, offset);
  return offset;
}

interface matrix_3x3 {
  aElements: FLOAT[][] /* [3][3] */;
}

// DEFINES
const RADIANS_FROM = (d: number) => ((d * Math.PI) / 180);
const DEGREES_FROM = (r: number) => ((r * 180) / Math.PI);

}
