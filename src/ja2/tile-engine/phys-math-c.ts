function VSetEqual(a: Pointer<vector_3>): vector_3 {
  let c: vector_3;

  //	c.x = a->x;
  //	c.y = a->y;
  //	c.z = a->z;
  memcpy(&c, a, sizeof(vector_3));

  return c;
}

function VSubtract(a: Pointer<vector_3>, b: Pointer<vector_3>): vector_3 {
  let c: vector_3;

  c.x = a->x - b->x;
  c.y = a->y - b->y;
  c.z = a->z - b->z;

  return c;
}

function VAdd(a: Pointer<vector_3>, b: Pointer<vector_3>): vector_3 {
  let c: vector_3;

  c.x = a->x + b->x;
  c.y = a->y + b->y;
  c.z = a->z + b->z;

  return c;
}

function VMultScalar(a: Pointer<vector_3>, b: real): vector_3 {
  let c: vector_3;

  c.x = a->x * b;
  c.y = a->y * b;
  c.z = a->z * b;

  return c;
}

function VDivScalar(a: Pointer<vector_3>, b: real): vector_3 {
  let c: vector_3;

  c.x = a->x / b;
  c.y = a->y / b;
  c.z = a->z / b;

  return c;
}

function VDotProduct(a: Pointer<vector_3>, b: Pointer<vector_3>): real {
  return (a->x * b->x) + (a->y * b->y) + (a->z * b->z);
}

function VPerpDotProduct(a: Pointer<vector_3>, b: Pointer<vector_3>): real {
  return (a->x * b->x) - (a->y * b->y) - (a->z * b->z);
}

function VCrossProduct(a: Pointer<vector_3>, b: Pointer<vector_3>): vector_3 {
  let c: vector_3;

  c.x = (a->y * b->z) - (a->z * b->y);
  c.y = (a->x * b->z) - (a->z * b->x);
  c.z = (a->x * b->y) - (a->y * b->x);

  return c;
}

function VGetPerpendicular(a: Pointer<vector_3>): vector_3 {
  let c: vector_3;

  c.x = -a->y;
  c.y = a->x;
  c.z = a->z;

  return c;
}

function VGetLength(a: Pointer<vector_3>): real {
  return sqrt((a->x * a->x) + (a->y * a->y) + (a->z * a->z));
}

function VGetNormal(a: Pointer<vector_3>): vector_3 {
  let c: vector_3;
  let OneOverLength: real;
  let Length: real;

  Length = VGetLength(a);

  if (Length == 0) {
    c.x = 0;
    c.y = 0;
    c.z = 0;
  } else {
    OneOverLength = 1 / Length;

    c.x = OneOverLength * a->x;
    c.y = OneOverLength * a->y;
    c.z = OneOverLength * a->z;
  }
  return c;
}
