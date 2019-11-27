namespace ja2 {

export function VSetEqual(a: vector_3): vector_3 {
  let c: vector_3 = createVector3();

  //	c.x = a->x;
  //	c.y = a->y;
  //	c.z = a->z;
  copyVector3(c, a);

  return c;
}

export function VSubtract(a: vector_3, b: vector_3): vector_3 {
  let c: vector_3 = createVector3();

  c.x = a.x - b.x;
  c.y = a.y - b.y;
  c.z = a.z - b.z;

  return c;
}

export function VAdd(a: vector_3, b: vector_3): vector_3 {
  let c: vector_3 = createVector3();

  c.x = a.x + b.x;
  c.y = a.y + b.y;
  c.z = a.z + b.z;

  return c;
}

export function VMultScalar(a: vector_3, b: FLOAT): vector_3 {
  let c: vector_3 = createVector3();

  c.x = a.x * b;
  c.y = a.y * b;
  c.z = a.z * b;

  return c;
}

export function VDivScalar(a: vector_3, b: FLOAT): vector_3 {
  let c: vector_3 = createVector3();

  c.x = a.x / b;
  c.y = a.y / b;
  c.z = a.z / b;

  return c;
}

export function VDotProduct(a: vector_3, b: vector_3): FLOAT {
  return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

function VPerpDotProduct(a: vector_3, b: vector_3): FLOAT {
  return (a.x * b.x) - (a.y * b.y) - (a.z * b.z);
}

export function VCrossProduct(a: vector_3, b: vector_3): vector_3 {
  let c: vector_3 = createVector3();

  c.x = (a.y * b.z) - (a.z * b.y);
  c.y = (a.x * b.z) - (a.z * b.x);
  c.z = (a.x * b.y) - (a.y * b.x);

  return c;
}

function VGetPerpendicular(a: vector_3): vector_3 {
  let c: vector_3 = createVector3();

  c.x = -a.y;
  c.y = a.x;
  c.z = a.z;

  return c;
}

export function VGetLength(a: vector_3): FLOAT {
  return Math.sqrt((a.x * a.x) + (a.y * a.y) + (a.z * a.z));
}

export function VGetNormal(a: vector_3): vector_3 {
  let c: vector_3 = createVector3();
  let OneOverLength: FLOAT;
  let Length: FLOAT;

  Length = VGetLength(a);

  if (Length == 0) {
    c.x = 0;
    c.y = 0;
    c.z = 0;
  } else {
    OneOverLength = 1 / Length;

    c.x = OneOverLength * a.x;
    c.y = OneOverLength * a.y;
    c.z = OneOverLength * a.z;
  }
  return c;
}

}
