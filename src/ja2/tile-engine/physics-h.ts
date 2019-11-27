namespace ja2 {

export interface REAL_OBJECT {
  fAllocated: boolean;
  fAlive: boolean;
  fApplyFriction: boolean;
  fColliding: boolean;
  fZOnRest: boolean;
  fVisible: boolean;
  fInWater: boolean;
  fTestObject: UINT8 /* boolean */;
  fTestEndedWithCollision: boolean;
  fTestPositionNotSet: boolean;

  TestZTarget: FLOAT;
  OneOverMass: FLOAT;
  AppliedMu: FLOAT;

  Position: vector_3;
  TestTargetPosition: vector_3;
  OldPosition: vector_3;
  Velocity: vector_3;
  OldVelocity: vector_3;
  InitialForce: vector_3;
  Force: vector_3;
  CollisionNormal: vector_3;
  CollisionVelocity: vector_3;
  CollisionElasticity: FLOAT;

  sGridNo: INT16;
  iID: INT32;
  pNode: LEVELNODE | null;
  pShadow: LEVELNODE | null;

  sConsecutiveCollisions: INT16;
  sConsecutiveZeroVelocityCollisions: INT16;
  iOldCollisionCode: INT32;

  dLifeLength: FLOAT;
  dLifeSpan: FLOAT;
  Obj: OBJECTTYPE;
  fFirstTimeMoved: boolean;
  sFirstGridNo: INT16;
  ubOwner: UINT8;
  ubActionCode: UINT8;
  uiActionData: UINT32;
  fDropItem: boolean;
  uiNumTilesMoved: UINT32;
  fCatchGood: boolean;
  fAttemptedCatch: boolean;
  fCatchAnimOn: boolean;
  fCatchCheckDone: boolean;
  fEndedWithCollisionPositionSet: boolean;
  EndedWithCollisionPosition: vector_3;
  fHaveHitGround: boolean;
  fPotentialForDebug: boolean;
  sLevelNodeGridNo: INT16;
  iSoundID: INT32;
  ubLastTargetTakenDamage: UINT8;
  ubPadding: UINT8[] /* [1] */;
}

export function createRealObject(): REAL_OBJECT {
  return {
    fAllocated: false,
    fAlive: false,
    fApplyFriction: false,
    fColliding: false,
    fZOnRest: false,
    fVisible: false,
    fInWater: false,
    fTestObject: 0,
    fTestEndedWithCollision: false,
    fTestPositionNotSet: false,

    TestZTarget: 0,
    OneOverMass: 0,
    AppliedMu: 0,

    Position: createVector3(),
    TestTargetPosition: createVector3(),
    OldPosition: createVector3(),
    Velocity: createVector3(),
    OldVelocity: createVector3(),
    InitialForce: createVector3(),
    Force: createVector3(),
    CollisionNormal: createVector3(),
    CollisionVelocity: createVector3(),
    CollisionElasticity: 0,

    sGridNo: 0,
    iID: 0,
    pNode: null,
    pShadow: null,

    sConsecutiveCollisions: 0,
    sConsecutiveZeroVelocityCollisions: 0,
    iOldCollisionCode: 0,

    dLifeLength: 0,
    dLifeSpan: 0,
    Obj: createObjectType(),
    fFirstTimeMoved: false,
    sFirstGridNo: 0,
    ubOwner: 0,
    ubActionCode: 0,
    uiActionData: 0,
    fDropItem: false,
    uiNumTilesMoved: 0,
    fCatchGood: false,
    fAttemptedCatch: false,
    fCatchAnimOn: false,
    fCatchCheckDone: false,
    fEndedWithCollisionPositionSet: false,
    EndedWithCollisionPosition: createVector3(),
    fHaveHitGround: false,
    fPotentialForDebug: false,
    sLevelNodeGridNo: 0,
    iSoundID: 0,
    ubLastTargetTakenDamage: 0,
    ubPadding: createArray(1, 0),
  };
}

export function resetRealObject(o: REAL_OBJECT) {
  o.fAllocated = false;
  o.fAlive = false;
  o.fApplyFriction = false;
  o.fColliding = false;
  o.fZOnRest = false;
  o.fVisible = false;
  o.fInWater = false;
  o.fTestObject = 0;
  o.fTestEndedWithCollision = false;
  o.fTestPositionNotSet = false;

  o.TestZTarget = 0;
  o.OneOverMass = 0;
  o.AppliedMu = 0;

  resetVector3(o.Position);
  resetVector3(o.TestTargetPosition);
  resetVector3(o.OldPosition);
  resetVector3(o.Velocity);
  resetVector3(o.OldVelocity);
  resetVector3(o.InitialForce);
  resetVector3(o.Force);
  resetVector3(o.CollisionNormal);
  resetVector3(o.CollisionVelocity);
  o.CollisionElasticity = 0;

  o.sGridNo = 0;
  o.iID = 0;
  o.pNode = null;
  o.pShadow = null;

  o.sConsecutiveCollisions = 0;
  o.sConsecutiveZeroVelocityCollisions = 0;
  o.iOldCollisionCode = 0;

  o.dLifeLength = 0;
  o.dLifeSpan = 0;
  resetObjectType(o.Obj);
  o.fFirstTimeMoved = false;
  o.sFirstGridNo = 0;
  o.ubOwner = 0;
  o.ubActionCode = 0;
  o.uiActionData = 0;
  o.fDropItem = false;
  o.uiNumTilesMoved = 0;
  o.fCatchGood = false;
  o.fAttemptedCatch = false;
  o.fCatchAnimOn = false;
  o.fCatchCheckDone = false;
  o.fEndedWithCollisionPositionSet = false;
  resetVector3(o.EndedWithCollisionPosition);
  o.fHaveHitGround = false;
  o.fPotentialForDebug = false;
  o.sLevelNodeGridNo = 0;
  o.iSoundID = 0;
  o.ubLastTargetTakenDamage = 0;
  o.ubPadding.fill(0);
}

export const REAL_OBJECT_SIZE = 256;

export function readRealObject(o: REAL_OBJECT, buffer: Buffer, offset: number = 0): number {
  o.fAllocated = Boolean(buffer.readUInt8(offset++));
  o.fAlive = Boolean(buffer.readUInt8(offset++));
  o.fApplyFriction = Boolean(buffer.readUInt8(offset++));
  o.fColliding = Boolean(buffer.readUInt8(offset++));
  o.fZOnRest = Boolean(buffer.readUInt8(offset++));
  o.fVisible = Boolean(buffer.readUInt8(offset++));
  o.fInWater = Boolean(buffer.readUInt8(offset++));
  o.fTestObject = buffer.readUInt8(offset++);
  o.fTestEndedWithCollision = Boolean(buffer.readUInt8(offset++));
  o.fTestPositionNotSet = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding

  o.TestZTarget = buffer.readFloatLE(offset); offset += 4;
  o.OneOverMass = buffer.readFloatLE(offset); offset += 4;
  o.AppliedMu = buffer.readFloatLE(offset); offset += 4;

  offset = readVector3(o.Position, buffer, offset);
  offset = readVector3(o.TestTargetPosition, buffer, offset);
  offset = readVector3(o.OldPosition, buffer, offset);
  offset = readVector3(o.Velocity, buffer, offset);
  offset = readVector3(o.OldVelocity, buffer, offset);
  offset = readVector3(o.InitialForce, buffer, offset);
  offset = readVector3(o.Force, buffer, offset);
  offset = readVector3(o.CollisionNormal, buffer, offset);
  offset = readVector3(o.CollisionVelocity, buffer, offset);
  o.CollisionElasticity = buffer.readFloatLE(offset); offset += 4;

  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.iID = buffer.readInt32LE(offset); offset += 4;
  o.pNode = null; offset += 4; // pointer
  o.pShadow = null; offset += 4; // pointer

  o.sConsecutiveCollisions = buffer.readInt16LE(offset); offset += 2;
  o.sConsecutiveZeroVelocityCollisions = buffer.readInt16LE(offset); offset += 2;
  o.iOldCollisionCode = buffer.readInt32LE(offset); offset += 4;

  o.dLifeLength = buffer.readFloatLE(offset); offset += 4;
  o.dLifeSpan = buffer.readFloatLE(offset); offset += 4;
  offset = readObjectType(o.Obj, buffer, offset);
  o.fFirstTimeMoved = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sFirstGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubOwner = buffer.readUInt8(offset++);
  o.ubActionCode = buffer.readUInt8(offset++);
  offset += 2; // padding
  o.uiActionData = buffer.readUInt32LE(offset); offset += 4;
  o.fDropItem = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.uiNumTilesMoved = buffer.readUInt32LE(offset); offset += 4;
  o.fCatchGood = Boolean(buffer.readUInt8(offset++));
  o.fAttemptedCatch = Boolean(buffer.readUInt8(offset++));
  o.fCatchAnimOn = Boolean(buffer.readUInt8(offset++));
  o.fCatchCheckDone = Boolean(buffer.readUInt8(offset++));
  o.fEndedWithCollisionPositionSet = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  offset = readVector3(o.EndedWithCollisionPosition, buffer, offset);
  o.fHaveHitGround = Boolean(buffer.readUInt8(offset++));
  o.fPotentialForDebug = Boolean(buffer.readUInt8(offset++));
  o.sLevelNodeGridNo = buffer.readInt16LE(offset); offset += 2;
  o.iSoundID = buffer.readInt32LE(offset); offset += 4;
  o.ubLastTargetTakenDamage = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubPadding, buffer, offset, 1);
  offset += 2; // padding

  return offset;
}

export function writeRealObject(o: REAL_OBJECT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fAllocated), offset);
  offset = buffer.writeUInt8(Number(o.fAlive), offset);
  offset = buffer.writeUInt8(Number(o.fApplyFriction), offset);
  offset = buffer.writeUInt8(Number(o.fColliding), offset);
  offset = buffer.writeUInt8(Number(o.fZOnRest), offset);
  offset = buffer.writeUInt8(Number(o.fVisible), offset);
  offset = buffer.writeUInt8(Number(o.fInWater), offset);
  offset = buffer.writeUInt8(o.fTestObject, offset);
  offset = buffer.writeUInt8(Number(o.fTestEndedWithCollision), offset);
  offset = buffer.writeUInt8(Number(o.fTestPositionNotSet), offset);
  offset = writePadding(buffer, offset, 2);

  offset = buffer.writeFloatLE(o.TestZTarget, offset);
  offset = buffer.writeFloatLE(o.OneOverMass, offset);
  offset = buffer.writeFloatLE(o.AppliedMu, offset);

  offset = writeVector3(o.Position, buffer, offset);
  offset = writeVector3(o.TestTargetPosition, buffer, offset);
  offset = writeVector3(o.OldPosition, buffer, offset);
  offset = writeVector3(o.Velocity, buffer, offset);
  offset = writeVector3(o.OldVelocity, buffer, offset);
  offset = writeVector3(o.InitialForce, buffer, offset);
  offset = writeVector3(o.Force, buffer, offset);
  offset = writeVector3(o.CollisionNormal, buffer, offset);
  offset = writeVector3(o.CollisionVelocity, buffer, offset);
  offset = buffer.writeFloatLE(o.CollisionElasticity, offset);

  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = writePadding(buffer, offset, 2);
  offset = buffer.writeInt32LE(o.iID, offset);
  offset = writePadding(buffer, offset, 4); // pNode (pointer)
  offset = writePadding(buffer, offset, 4); // pShadow (pointer)

  offset = buffer.writeInt16LE(o.sConsecutiveCollisions, offset);
  offset = buffer.writeInt16LE(o.sConsecutiveZeroVelocityCollisions, offset);
  offset = buffer.writeInt32LE(o.iOldCollisionCode, offset);

  offset = buffer.writeFloatLE(o.dLifeLength, offset);
  offset = buffer.writeFloatLE(o.dLifeSpan, offset);
  offset = writeObjectType(o.Obj, buffer, offset);
  offset = buffer.writeUInt8(Number(o.fFirstTimeMoved), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sFirstGridNo, offset);
  offset = buffer.writeUInt8(o.ubOwner, offset);
  offset = buffer.writeUInt8(o.ubActionCode, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeUInt32LE(o.uiActionData, offset);
  offset = buffer.writeUInt8(Number(o.fDropItem), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiNumTilesMoved, offset);
  offset = buffer.writeUInt8(Number(o.fCatchGood), offset);
  offset = buffer.writeUInt8(Number(o.fAttemptedCatch), offset);
  offset = buffer.writeUInt8(Number(o.fCatchAnimOn), offset);
  offset = buffer.writeUInt8(Number(o.fCatchCheckDone), offset);
  offset = buffer.writeUInt8(Number(o.fEndedWithCollisionPositionSet), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = writeVector3(o.EndedWithCollisionPosition, buffer, offset);
  offset = buffer.writeUInt8(Number(o.fHaveHitGround), offset);
  offset = buffer.writeUInt8(Number(o.fPotentialForDebug), offset);
  offset = buffer.writeInt16LE(o.sLevelNodeGridNo, offset);
  offset = buffer.writeInt32LE(o.iSoundID, offset);
  offset = buffer.writeUInt8(o.ubLastTargetTakenDamage, offset);
  offset = writeUIntArray(o.ubPadding, buffer, offset, 1);
  offset = writePadding(buffer, offset, 2); // padding

  return offset;
}

export const NUM_OBJECT_SLOTS = 50;

}
