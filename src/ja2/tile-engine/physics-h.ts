export interface REAL_OBJECT {
  fAllocated: boolean;
  fAlive: boolean;
  fApplyFriction: boolean;
  fColliding: boolean;
  fZOnRest: boolean;
  fVisible: boolean;
  fInWater: boolean;
  fTestObject: boolean;
  fTestEndedWithCollision: boolean;
  fTestPositionNotSet: boolean;

  TestZTarget: real;
  OneOverMass: real;
  AppliedMu: real;

  Position: vector_3;
  TestTargetPosition: vector_3;
  OldPosition: vector_3;
  Velocity: vector_3;
  OldVelocity: vector_3;
  InitialForce: vector_3;
  Force: vector_3;
  CollisionNormal: vector_3;
  CollisionVelocity: vector_3;
  CollisionElasticity: real;

  sGridNo: INT16;
  iID: INT32;
  pNode: Pointer<LEVELNODE>;
  pShadow: Pointer<LEVELNODE>;

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

export const NUM_OBJECT_SLOTS = 50;
