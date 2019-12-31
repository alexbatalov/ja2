namespace ja2 {

const NO_TEST_OBJECT = 0;
const TEST_OBJECT_NO_COLLISIONS = 1;
const TEST_OBJECT_ANY_COLLISION = 2;
const TEST_OBJECT_NOTWALLROOF_COLLISIONS = 3;

const OUTDOORS_START_ANGLE = (Math.PI / 4);
const INDOORS_START_ANGLE = (Math.PI / 30);
//#define INDOORS_START_ANGLE									(FLOAT)( 0 )
const GLAUNCHER_START_ANGLE = (Math.PI / 8);
const GLAUNCHER_HIGHER_LEVEL_START_ANGLE = (Math.PI / 6);

const GET_THROW_HEIGHT = (l: number) => ((l * 256));
const GET_SOLDIER_THROW_HEIGHT = (l: number) => ((l * 256) + STANDING_HEIGHT);

const GET_OBJECT_LEVEL = (z: number) => (((z + 10) / HEIGHT_UNITS));
const OBJECT_DETONATE_ON_IMPACT = (o: REAL_OBJECT) => ((o.Obj.usItem == Enum225.MORTAR_SHELL)); // && ( o->ubActionCode == THROW_ARM_ITEM || pObject->fTestObject ) )

const MAX_INTEGRATIONS = 8;

const TIME_MULTI = 1.8;

//#define					TIME_MULTI			2.2

const DELTA_T = (1.0 * TIME_MULTI);

const GRAVITY = (9.8 * 2.5);
//#define					GRAVITY						( 9.8 * 2.8 )

export let ObjectSlots: REAL_OBJECT[] /* [NUM_OBJECT_SLOTS] */ = createArrayFrom(NUM_OBJECT_SLOTS, createRealObject);
export let guiNumObjectSlots: UINT32 = 0;
let fDampingActive: boolean = false;
// real						Kdl	= (float)0.5;					// LINEAR DAMPENING ( WIND RESISTANCE )
let Kdl: FLOAT = (0.1 * TIME_MULTI); // LINEAR DAMPENING ( WIND RESISTANCE )

const EPSILONV = 0.5;
const EPSILONP = () => 0.01;
const EPSILONPZ = 3;

const CALCULATE_OBJECT_MASS = (m: number) => ((m * 2));
const SCALE_VERT_VAL_TO_HORZ = (f: number) => ((f / HEIGHT_UNITS) * CELL_X_SIZE);
const SCALE_HORZ_VAL_TO_VERT = (f: number) => ((f / CELL_X_SIZE) * HEIGHT_UNITS);

/// OBJECT POOL FUNCTIONS
function GetFreeObjectSlot(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumObjectSlots; uiCount++) {
    if ((ObjectSlots[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumObjectSlots < NUM_OBJECT_SLOTS)
    return guiNumObjectSlots++;

  return -1;
}

function RecountObjectSlots(): void {
  let uiCount: INT32;

  for (uiCount = guiNumObjectSlots - 1; (uiCount >= 0); uiCount--) {
    if ((ObjectSlots[uiCount].fAllocated)) {
      guiNumObjectSlots = (uiCount + 1);
      return;
    }
  }

  guiNumObjectSlots = 0;
}

export function CreatePhysicalObject(pGameObj: OBJECTTYPE, dLifeLength: FLOAT, xPos: FLOAT, yPos: FLOAT, zPos: FLOAT, xForce: FLOAT, yForce: FLOAT, zForce: FLOAT, ubOwner: UINT8, ubActionCode: UINT8, uiActionData: UINT32): INT32 {
  let iObjectIndex: INT32;
  let mass: FLOAT;
  let pObject: REAL_OBJECT;

  if ((iObjectIndex = GetFreeObjectSlot()) == (-1))
    return -1;

  pObject = ObjectSlots[iObjectIndex];

  resetRealObject(pObject);

  // OK, GET OBJECT DATA AND COPY
  copyObjectType(pObject.Obj, pGameObj);

  // Get mass
  mass = CALCULATE_OBJECT_MASS(Item[pGameObj.usItem].ubWeight);

  // If mass is z, make it something!
  if (mass == 0) {
    mass = 10;
  }

  // OK, mass determines the smoothness of the physics integration
  // For gameplay, we will use mass for maybe max throw distance
  mass = 60;

  // Set lifelength
  pObject.dLifeLength = dLifeLength;

  pObject.fAllocated = true;
  pObject.fAlive = true;
  pObject.fApplyFriction = false;
  pObject.iSoundID = NO_SAMPLE;

  // Set values
  pObject.OneOverMass = 1 / mass;
  pObject.Position.x = xPos;
  pObject.Position.y = yPos;
  pObject.Position.z = zPos;
  pObject.fVisible = true;
  pObject.ubOwner = ubOwner;
  pObject.ubActionCode = ubActionCode;
  pObject.uiActionData = uiActionData;
  pObject.fDropItem = true;
  pObject.ubLastTargetTakenDamage = NOBODY;

  pObject.fFirstTimeMoved = true;

  pObject.InitialForce.x = SCALE_VERT_VAL_TO_HORZ(xForce);
  pObject.InitialForce.y = SCALE_VERT_VAL_TO_HORZ(yForce);
  pObject.InitialForce.z = zForce;

  pObject.InitialForce = VDivScalar(pObject.InitialForce, TIME_MULTI);
  pObject.InitialForce = VMultScalar(pObject.InitialForce, 1.5);

  // Calculate gridNo
  pObject.sGridNo = MAPROWCOLTOPOS(Math.trunc(yPos / CELL_Y_SIZE), Math.trunc(xPos / CELL_X_SIZE));
  pObject.iID = iObjectIndex;
  pObject.pNode = null;
  pObject.pShadow = null;

  // If gridno not equal to NOWHERE, use sHeight of alnd....
  if (pObject.sGridNo != NOWHERE) {
    pObject.Position.z += CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.sGridNo].sHeight);
    pObject.EndedWithCollisionPosition.z += CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.sGridNo].sHeight);
  }

  PhysicsDebugMsg(FormatString("NewPhysics Object"));

  return iObjectIndex;
}

function RemoveObjectSlot(iObject: INT32): boolean {
  if (iObject >= NUM_OBJECT_SLOTS) {
    return false;
  }

  ObjectSlots[iObject].fAllocated = false;

  RecountObjectSlots();

  return true;
}

export function SimulateWorld(): void {
  let cnt: UINT32;
  let pObject: REAL_OBJECT;

  if (COUNTERDONE(Enum386.PHYSICSUPDATE)) {
    RESETCOUNTER(Enum386.PHYSICSUPDATE);

    for (cnt = 0; cnt < guiNumObjectSlots; cnt++) {
      // CHECK FOR ALLOCATED
      if (ObjectSlots[cnt].fAllocated) {
        // Get object
        pObject = ObjectSlots[cnt];

        SimulateObject(pObject, DELTA_T);
      }
    }
  }
}

export function RemoveAllPhysicsObjects(): void {
  let cnt: UINT32;

  for (cnt = 0; cnt < guiNumObjectSlots; cnt++) {
    // CHECK FOR ALLOCATED
    if (ObjectSlots[cnt].fAllocated) {
      PhysicsDeleteObject(ObjectSlots[cnt]);
    }
  }
}

function SimulateObject(pObject: REAL_OBJECT, deltaT: FLOAT): void {
  let DeltaTime: FLOAT = 0;
  let CurrentTime: FLOAT = 0;
  let TargetTime: FLOAT = DeltaTime;
  let iCollisionID: INT32 = 0;
  let iCollisionID__Pointer = createPointer(() => iCollisionID, (v) => iCollisionID = v);
  let fEndThisObject: boolean = false;

  if (!PhysicsUpdateLife(pObject, deltaT)) {
    return;
  }

  if (pObject.fAlive) {
    CurrentTime = 0;
    TargetTime = deltaT;

    // Do subtime here....
    DeltaTime = deltaT / 10;

    if (!PhysicsComputeForces(pObject)) {
      return;
    }

    while (CurrentTime < TargetTime) {
      if (!PhysicsIntegrate(pObject, DeltaTime)) {
        fEndThisObject = true;
        break;
      }

      if (!PhysicsHandleCollisions(pObject, iCollisionID__Pointer, DeltaTime)) {
        fEndThisObject = true;
        break;
      }

      if (iCollisionID != Enum229.COLLISION_NONE) {
        break;
      }

      CurrentTime += DeltaTime;
    }

    if (fEndThisObject) {
      return;
    }

    if (!PhysicsMoveObject(pObject)) {
      return;
    }
  }
}

function PhysicsComputeForces(pObject: REAL_OBJECT): boolean {
  let vTemp: vector_3 = createVector3();

  // Calculate forces
  pObject.Force = VSetEqual(pObject.InitialForce);

  // Note: Only apply gravity if we are not resting on some structure surface
  if (!pObject.fZOnRest) {
    pObject.Force.z -= GRAVITY;
  }

  // Set intial force to zero
  pObject.InitialForce = VMultScalar(pObject.InitialForce, 0);

  if (pObject.fApplyFriction) {
    vTemp = VMultScalar(pObject.Velocity, -pObject.AppliedMu);
    pObject.Force = VAdd(vTemp, pObject.Force);

    pObject.fApplyFriction = false;
  }

  if (fDampingActive) {
    vTemp = VMultScalar(pObject.Velocity, -Kdl);
    pObject.Force = VAdd(vTemp, pObject.Force);
  }

  return true;
}

function PhysicsUpdateLife(pObject: REAL_OBJECT, DeltaTime: FLOAT): boolean {
  let bLevel: UINT8 = 0;

  pObject.dLifeSpan += DeltaTime;

  // End life if time has ran out or we are stationary
  if (pObject.dLifeLength != -1) {
    if (pObject.dLifeSpan > pObject.dLifeLength) {
      pObject.fAlive = false;
    }
  }

  // End life if we are out of bounds....
  if (!GridNoOnVisibleWorldTile(pObject.sGridNo)) {
    pObject.fAlive = false;
  }

  if (!pObject.fAlive) {
    pObject.fAlive = false;

    if (!pObject.fTestObject) {
      if (pObject.iSoundID != NO_SAMPLE) {
        SoundStop(pObject.iSoundID);
      }

      if (pObject.ubActionCode == Enum258.THROW_ARM_ITEM && !pObject.fInWater) {
        HandleArmedObjectImpact(pObject);
      } else {
        // If we are in water, and we are a sinkable item...
        if (!pObject.fInWater || !(Item[pObject.Obj.usItem].fFlags & ITEM_SINKS)) {
          if (pObject.fDropItem) {
            // ATE: If we have collided with roof last...
            if (pObject.iOldCollisionCode == Enum229.COLLISION_ROOF) {
              bLevel = 1;
            }

            // ATE; If an armed object, don't add....
            if (pObject.ubActionCode != Enum258.THROW_ARM_ITEM) {
              AddItemToPool(pObject.sGridNo, pObject.Obj, 1, bLevel, 0, -1);
            }
          }
        }
      }

      // Make impact noise....
      if (pObject.Obj.usItem == Enum225.ROCK || pObject.Obj.usItem == Enum225.ROCK2) {
        MakeNoise(pObject.ubOwner, pObject.sGridNo, 0, gpWorldLevelData[pObject.sGridNo].ubTerrainID, (9 + PreRandom(9)), Enum236.NOISE_ROCK_IMPACT);
      } else if (Item[pObject.Obj.usItem].usItemClass & IC_GRENADE) {
        MakeNoise(pObject.ubOwner, pObject.sGridNo, 0, gpWorldLevelData[pObject.sGridNo].ubTerrainID, (9 + PreRandom(9)), Enum236.NOISE_GRENADE_IMPACT);
      }

      if (!pObject.fTestObject && pObject.iOldCollisionCode == Enum229.COLLISION_GROUND) {
        PlayJA2Sample(Enum330.THROW_IMPACT_2, RATE_11025, SoundVolume(MIDVOLUME, pObject.sGridNo), 1, SoundDir(pObject.sGridNo));
      }

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., PHYSICS OBJECT DONE effect gone off"));
      ReduceAttackBusyCount(pObject.ubOwner, false);

      // ATE: Handle end of animation...
      if (pObject.fCatchAnimOn) {
        let pSoldier: SOLDIERTYPE;

        pObject.fCatchAnimOn = false;

        // Get intended target
        pSoldier = MercPtrs[pObject.uiActionData];

        // Catch anim.....
        switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
          case ANIM_STAND:

            pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CATCH, 0, false);
            break;

          case ANIM_CROUCH:

            pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CROUCH_CATCH, 0, false);
            break;
        }

        PlayJA2Sample(Enum330.CATCH_OBJECT, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
      }
    }

    PhysicsDeleteObject(pObject);
    return false;
  }

  return true;
}

function PhysicsIntegrate(pObject: REAL_OBJECT, DeltaTime: FLOAT): boolean {
  let vTemp: vector_3 = createVector3();

  // Save old position
  pObject.OldPosition = VSetEqual(pObject.Position);
  pObject.OldVelocity = VSetEqual(pObject.Velocity);

  vTemp = VMultScalar(pObject.Velocity, DeltaTime);
  pObject.Position = VAdd(pObject.Position, vTemp);

  // Save test TargetPosition
  if (pObject.fTestPositionNotSet) {
    pObject.TestTargetPosition = VSetEqual(pObject.Position);
  }

  vTemp = VMultScalar(pObject.Force, (DeltaTime * pObject.OneOverMass));
  pObject.Velocity = VAdd(pObject.Velocity, vTemp);

  if (pObject.fPotentialForDebug) {
    PhysicsDebugMsg(FormatString("Object %d: Force		%f %f %f", pObject.iID, pObject.Force.x, pObject.Force.y, pObject.Force.z));
    PhysicsDebugMsg(FormatString("Object %d: Velocity %f %f %f", pObject.iID, pObject.Velocity.x, pObject.Velocity.y, pObject.Velocity.z));
    PhysicsDebugMsg(FormatString("Object %d: Position %f %f %f", pObject.iID, pObject.Position.x, pObject.Position.y, pObject.Position.z));
    PhysicsDebugMsg(FormatString("Object %d: Delta Pos %f %f %f", pObject.iID, (pObject.OldPosition.x - pObject.Position.x), (pObject.OldPosition.y - pObject.Position.y), (pObject.OldPosition.z - pObject.Position.z)));
  }

  if (pObject.Obj.usItem == Enum225.MORTAR_SHELL && !pObject.fTestObject && pObject.ubActionCode == Enum258.THROW_ARM_ITEM) {
    // Start soud if we have reached our max height
    if (pObject.OldVelocity.z >= 0 && pObject.Velocity.z < 0) {
      if (pObject.iSoundID == NO_SAMPLE) {
        pObject.iSoundID = PlayJA2Sample(Enum330.MORTAR_WHISTLE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      }
    }
  }

  return true;
}

function PhysicsHandleCollisions(pObject: REAL_OBJECT, piCollisionID: Pointer<INT32>, DeltaTime: FLOAT): boolean {
  let dDeltaX: FLOAT;
  let dDeltaY: FLOAT;
  let dDeltaZ: FLOAT;

  if (PhysicsCheckForCollisions(pObject, piCollisionID)) {
    dDeltaX = pObject.Position.x - pObject.OldPosition.x;
    dDeltaY = pObject.Position.y - pObject.OldPosition.y;
    dDeltaZ = pObject.Position.z - pObject.OldPosition.z;

    if (dDeltaX <= EPSILONV && dDeltaX >= -EPSILONV && dDeltaY <= EPSILONV && dDeltaY >= -EPSILONV) {
      pObject.sConsecutiveZeroVelocityCollisions++;
    }

    if (pObject.sConsecutiveZeroVelocityCollisions > 3) {
      // We will continue with our Z velocity
      pObject.Velocity.x = 0;
      pObject.Velocity.y = 0;

      // Check that we are not colliding with structure z
      // if ( *piCollisionID == COLLISION_STRUCTURE_Z || *piCollisionID == COLLISION_ROOF )
      if (piCollisionID.value == Enum229.COLLISION_STRUCTURE_Z || piCollisionID.value == Enum229.COLLISION_ROOF || piCollisionID.value == Enum229.COLLISION_GROUND) {
        pObject.Velocity.z = 0;

        // Set us not alive!
        pObject.fAlive = false;
      }

      piCollisionID.value = Enum229.COLLISION_NONE;
    } else {
      // Set position back to before collision
      pObject.Position = VSetEqual(pObject.OldPosition);
      // Set old position!
      pObject.OldPosition.x = pObject.Position.y - dDeltaX;
      pObject.OldPosition.y = pObject.Position.x - dDeltaY;
      pObject.OldPosition.z = pObject.Position.z - dDeltaZ;

      PhysicsResolveCollision(pObject, pObject.CollisionVelocity, pObject.CollisionNormal, pObject.CollisionElasticity);
    }

    if (pObject.Position.z < 0) {
      pObject.Position.z = 0;
    }
    // otherwise, continue falling downwards!

    // TO STOP?

    // Check for delta position values
    if (dDeltaZ <= EPSILONP() && dDeltaZ >= -EPSILONP() && dDeltaY <= EPSILONP() && dDeltaY >= -EPSILONP() && dDeltaX <= EPSILONP() && dDeltaX >= -EPSILONP()) {
      // pObject->fAlive = FALSE;
      // return( FALSE );
    }

    // Check for repeated collisions...
    // if ( pObject->iOldCollisionCode == COLLISION_ROOF || pObject->iOldCollisionCode == COLLISION_GROUND || pObject->iOldCollisionCode == COLLISION_WATER )
    {
      // ATE: This is a safeguard
      if (pObject.sConsecutiveCollisions > 30) {
        pObject.fAlive = false;
        return false;
      }
    }

    // Check for -ve velocity still...
    // if ( pObject->Velocity.z <= EPSILONV && pObject->Velocity.z >= -EPSILONV &&
    //		 pObject->Velocity.y <= EPSILONV && pObject->Velocity.y >= -EPSILONV &&
    //		 pObject->Velocity.x <= EPSILONV && pObject->Velocity.x >= -EPSILONV )
    //{
    // PhysicsDeleteObject( pObject );
    //	pObject->fAlive = FALSE;
    //	return( FALSE );
    //}
  }

  return true;
}

function PhysicsDeleteObject(pObject: REAL_OBJECT): void {
  if (pObject.fAllocated) {
    if (pObject.pNode != null) {
      RemoveStructFromLevelNode(pObject.sLevelNodeGridNo, pObject.pNode);
    }

    if (pObject.pShadow != null) {
      RemoveShadowFromLevelNode(pObject.sLevelNodeGridNo, pObject.pShadow);
    }

    RemoveObjectSlot(pObject.iID);
  }
}

function PhysicsCheckForCollisions(pObject: REAL_OBJECT, piCollisionID: Pointer<INT32>): boolean {
  let vTemp: vector_3 = createVector3();
  let dDeltaX: FLOAT;
  let dDeltaY: FLOAT;
  let dDeltaZ: FLOAT;
  let dX: FLOAT;
  let dY: FLOAT;
  let dZ: FLOAT;
  let iCollisionCode: INT32 = Enum229.COLLISION_NONE;
  let fDoCollision: boolean = false;
  let dElasity: FLOAT = 1;
  let usStructureID: UINT16 = 0;
  let dNormalX: FLOAT = 0;
  let dNormalY: FLOAT = 0;
  let dNormalZ: FLOAT = 0;
  let sGridNo: INT16;

  // Checkf for collisions
  dX = pObject.Position.x;
  dY = pObject.Position.y;
  dZ = pObject.Position.z;

  vTemp.x = 0;
  vTemp.y = 0;
  vTemp.z = 0;

  dDeltaX = dX - pObject.OldPosition.x;
  dDeltaY = dY - pObject.OldPosition.y;
  dDeltaZ = dZ - pObject.OldPosition.z;

  // Round delta pos to nearest 0.01
  // dDeltaX = (float)( (int)dDeltaX * 100 ) / 100;
  // dDeltaY = (float)( (int)dDeltaY * 100 ) / 100;
  // dDeltaZ = (float)( (int)dDeltaZ * 100 ) / 100;

  // SKIP FIRST GRIDNO, WE'LL COLLIDE WITH OURSELVES....
  if (pObject.fTestObject != TEST_OBJECT_NO_COLLISIONS) {
    iCollisionCode = CheckForCollision(dX, dY, dZ, dDeltaX, dDeltaY, dDeltaZ, createPointer(() => usStructureID, (v) => usStructureID = v), createPointer(() => dNormalX, (v) => dNormalX = v), createPointer(() => dNormalY, (v) => dNormalY = v), createPointer(() => dNormalZ, (v) => dNormalZ = v));
  } else if (pObject.fTestObject == TEST_OBJECT_NO_COLLISIONS) {
    iCollisionCode = Enum229.COLLISION_NONE;

    // Are we on a downward slope?
    if (dZ < pObject.TestZTarget && dDeltaZ < 0) {
      if (pObject.fTestPositionNotSet) {
        if (pObject.TestZTarget > 32) {
          pObject.fTestPositionNotSet = false;
          pObject.TestZTarget = 0;
        } else {
          iCollisionCode = Enum229.COLLISION_GROUND;
        }
      } else {
        iCollisionCode = Enum229.COLLISION_GROUND;
      }
    }
  }

  // If a test object and we have collided with something ( should only be ground ( or roof? ) )
  // Or destination?
  if (pObject.fTestObject == TEST_OBJECT_ANY_COLLISION) {
    if (iCollisionCode != Enum229.COLLISION_GROUND && iCollisionCode != Enum229.COLLISION_ROOF && iCollisionCode != Enum229.COLLISION_WATER && iCollisionCode != Enum229.COLLISION_NONE) {
      pObject.fTestEndedWithCollision = true;
      pObject.fAlive = false;
      return false;
    }
  }

  if (pObject.fTestObject == TEST_OBJECT_NOTWALLROOF_COLLISIONS) {
    // So we don't collide with ourselves.....
    if (iCollisionCode != Enum229.COLLISION_WATER && iCollisionCode != Enum229.COLLISION_GROUND && iCollisionCode != Enum229.COLLISION_NONE && iCollisionCode != Enum229.COLLISION_ROOF && iCollisionCode != Enum229.COLLISION_INTERIOR_ROOF && iCollisionCode != Enum229.COLLISION_WALL_SOUTHEAST && iCollisionCode != Enum229.COLLISION_WALL_SOUTHWEST && iCollisionCode != Enum229.COLLISION_WALL_NORTHEAST && iCollisionCode != Enum229.COLLISION_WALL_NORTHWEST) {
      if (pObject.fFirstTimeMoved || pObject.sFirstGridNo == pObject.sGridNo) {
        iCollisionCode = Enum229.COLLISION_NONE;
      }

      // If we are NOT a wall or window, ignore....
      if (pObject.uiNumTilesMoved < 4) {
        switch (iCollisionCode) {
          case Enum229.COLLISION_MERC:
          case Enum229.COLLISION_STRUCTURE:
          case Enum229.COLLISION_STRUCTURE_Z:

            // Set to no collision ( we shot past )
            iCollisionCode = Enum229.COLLISION_NONE;
            break;
        }
      }
    }

    switch (iCollisionCode) {
      // End test with any collision NOT a wall, roof...
      case Enum229.COLLISION_STRUCTURE:
      case Enum229.COLLISION_STRUCTURE_Z:

        // OK, if it's mercs... don't stop
        if (usStructureID >= INVALID_STRUCTURE_ID) {
          pObject.fTestEndedWithCollision = true;

          if (!pObject.fEndedWithCollisionPositionSet) {
            pObject.fEndedWithCollisionPositionSet = true;
            pObject.EndedWithCollisionPosition = VSetEqual(pObject.Position);
          }
          iCollisionCode = Enum229.COLLISION_NONE;
        } else {
          if (!pObject.fEndedWithCollisionPositionSet) {
            pObject.fEndedWithCollisionPositionSet = true;
            pObject.EndedWithCollisionPosition = VSetEqual(pObject.Position);
          }
        }
        break;

      case Enum229.COLLISION_ROOF:

        if (!pObject.fEndedWithCollisionPositionSet) {
          pObject.fEndedWithCollisionPositionSet = true;
          pObject.EndedWithCollisionPosition = VSetEqual(pObject.Position);
        }
        break;

      case Enum229.COLLISION_WATER:
      case Enum229.COLLISION_GROUND:
      case Enum229.COLLISION_MERC:
      case Enum229.COLLISION_INTERIOR_ROOF:
      case Enum229.COLLISION_NONE:
      case Enum229.COLLISION_WINDOW_SOUTHEAST:
      case Enum229.COLLISION_WINDOW_SOUTHWEST:
      case Enum229.COLLISION_WINDOW_NORTHEAST:
      case Enum229.COLLISION_WINDOW_NORTHWEST:

        // Here we just keep going..
        break;

      default:

        // THis is for walls, windows, etc
        // here, we set test ended with collision, but keep going...
        pObject.fTestEndedWithCollision = true;
        break;
    }
  }

  if (pObject.fTestObject != TEST_OBJECT_NOTWALLROOF_COLLISIONS) {
    if (iCollisionCode != Enum229.COLLISION_WATER && iCollisionCode != Enum229.COLLISION_GROUND && iCollisionCode != Enum229.COLLISION_NONE && iCollisionCode != Enum229.COLLISION_ROOF && iCollisionCode != Enum229.COLLISION_INTERIOR_ROOF && iCollisionCode != Enum229.COLLISION_WALL_SOUTHEAST && iCollisionCode != Enum229.COLLISION_WALL_SOUTHWEST && iCollisionCode != Enum229.COLLISION_WALL_NORTHEAST && iCollisionCode != Enum229.COLLISION_WALL_NORTHWEST) {
      // So we don't collide with ourselves.....
      if (pObject.fFirstTimeMoved || pObject.sFirstGridNo == pObject.sGridNo) {
        iCollisionCode = Enum229.COLLISION_NONE;
      }

      // If we are NOT a wall or window, ignore....
      if (pObject.uiNumTilesMoved < 4) {
        switch (iCollisionCode) {
          case Enum229.COLLISION_MERC:
          case Enum229.COLLISION_STRUCTURE:
          case Enum229.COLLISION_STRUCTURE_Z:

            // Set to no collision ( we shot past )
            iCollisionCode = Enum229.COLLISION_NONE;
            break;
        }
      }
    }
  }

  piCollisionID.value = iCollisionCode;

  // If We hit the ground
  if (iCollisionCode > Enum229.COLLISION_NONE) {
    if (pObject.iOldCollisionCode == iCollisionCode) {
      pObject.sConsecutiveCollisions++;
    } else {
      pObject.sConsecutiveCollisions = 1;
    }

    if (iCollisionCode == Enum229.COLLISION_WINDOW_NORTHWEST || iCollisionCode == Enum229.COLLISION_WINDOW_NORTHEAST || iCollisionCode == Enum229.COLLISION_WINDOW_SOUTHWEST || iCollisionCode == Enum229.COLLISION_WINDOW_SOUTHEAST) {
      if (!pObject.fTestObject) {
        // Break window!
        PhysicsDebugMsg(FormatString("Object %d: Collision Window", pObject.iID));

        sGridNo = MAPROWCOLTOPOS(Math.trunc(pObject.Position.y / CELL_Y_SIZE), Math.trunc(pObject.Position.x / CELL_X_SIZE));

        ObjectHitWindow(sGridNo, usStructureID, false, true);
      }
      piCollisionID.value = Enum229.COLLISION_NONE;
      return false;
    }

    // ATE: IF detonate on impact, stop now!
    if (OBJECT_DETONATE_ON_IMPACT(pObject)) {
      pObject.fAlive = false;
      return true;
    }

    if (iCollisionCode == Enum229.COLLISION_GROUND) {
      vTemp.x = 0;
      vTemp.y = 0;
      vTemp.z = -1;

      pObject.fApplyFriction = true;
      // pObject->AppliedMu			= (float)(0.54 * TIME_MULTI );
      pObject.AppliedMu = (0.34 * TIME_MULTI);

      // dElasity = (float)1.5;
      dElasity = 1.3;

      fDoCollision = true;

      if (!pObject.fTestObject && !pObject.fHaveHitGround) {
        PlayJA2Sample(Enum330.THROW_IMPACT_2, RATE_11025, SoundVolume(MIDVOLUME, pObject.sGridNo), 1, SoundDir(pObject.sGridNo));
      }

      pObject.fHaveHitGround = true;
    } else if (iCollisionCode == Enum229.COLLISION_WATER) {
      let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
      let pNode: ANITILE;

      // Continue going...
      pObject.fApplyFriction = true;
      pObject.AppliedMu = (1.54 * TIME_MULTI);

      sGridNo = MAPROWCOLTOPOS(Math.trunc(pObject.Position.y / CELL_Y_SIZE), Math.trunc(pObject.Position.x / CELL_X_SIZE));

      // Make thing unalive...
      pObject.fAlive = false;

      // If first time...
      if (pObject.fVisible) {
        if (pObject.fTestObject == NO_TEST_OBJECT) {
          // Make invisible
          pObject.fVisible = false;

          // JA25 CJC Oct 13 1999 - if node pointer is null don't try to set flags inside it!
          if (pObject.pNode) {
            pObject.pNode.uiFlags |= LEVELNODE_HIDDEN;
          }

          pObject.fInWater = true;

          // Make ripple
          AniParams.sGridNo = sGridNo;
          AniParams.ubLevelID = ANI_STRUCT_LEVEL;
          AniParams.usTileType = Enum313.THIRDMISS;
          AniParams.usTileIndex = Enum312.THIRDMISS1;
          AniParams.sDelay = 50;
          AniParams.sStartFrame = 0;
          AniParams.uiFlags = ANITILE_FORWARD;

          if (pObject.ubActionCode == Enum258.THROW_ARM_ITEM) {
            AniParams.ubKeyFrame1 = 11;
            AniParams.uiKeyFrame1Code = Enum311.ANI_KEYFRAME_CHAIN_WATER_EXPLOSION;
            AniParams.uiUserData = pObject.Obj.usItem;
            AniParams.ubUserData2 = pObject.ubOwner;
          }

          pNode = <ANITILE>CreateAnimationTile(AniParams);

          // Adjust for absolute positioning
          pNode.pLevelNode.uiFlags |= LEVELNODE_USEABSOLUTEPOS;

          pNode.pLevelNode.sRelativeX = pObject.Position.x;
          pNode.pLevelNode.sRelativeY = pObject.Position.y;
          pNode.pLevelNode.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.Position.z);
        }
      }
    } else if (iCollisionCode == Enum229.COLLISION_ROOF || iCollisionCode == Enum229.COLLISION_INTERIOR_ROOF) {
      vTemp.x = 0;
      vTemp.y = 0;
      vTemp.z = -1;

      pObject.fApplyFriction = true;
      pObject.AppliedMu = (0.54 * TIME_MULTI);

      dElasity = 1.4;

      fDoCollision = true;
    }
    // else if ( iCollisionCode == COLLISION_INTERIOR_ROOF )
    //{
    //	vTemp.x = 0;
    //	vTemp.y = 0;
    //		vTemp.z = 1;

    //	pObject->fApplyFriction = TRUE;
    //	pObject->AppliedMu			= (float)(0.54 * TIME_MULTI );

    //	dElasity = (float)1.4;

    //	fDoCollision = TRUE;

    //}
    else if (iCollisionCode == Enum229.COLLISION_STRUCTURE_Z) {
      if (CheckForCatcher(pObject, usStructureID)) {
        return false;
      }

      CheckForObjectHittingMerc(pObject, usStructureID);

      vTemp.x = 0;
      vTemp.y = 0;
      vTemp.z = -1;

      pObject.fApplyFriction = true;
      pObject.AppliedMu = (0.54 * TIME_MULTI);

      dElasity = 1.2;

      fDoCollision = true;
    } else if (iCollisionCode == Enum229.COLLISION_WALL_SOUTHEAST || iCollisionCode == Enum229.COLLISION_WALL_SOUTHWEST || iCollisionCode == Enum229.COLLISION_WALL_NORTHEAST || iCollisionCode == Enum229.COLLISION_WALL_NORTHWEST) {
      // A wall, do stuff
      vTemp.x = dNormalX;
      vTemp.y = dNormalY;
      vTemp.z = dNormalZ;

      fDoCollision = true;

      dElasity = 1.1;
    } else {
      let vIncident: vector_3 = createVector3();

      if (CheckForCatcher(pObject, usStructureID)) {
        return false;
      }

      CheckForObjectHittingMerc(pObject, usStructureID);

      vIncident.x = dDeltaX;
      vIncident.y = dDeltaY;
      vIncident.z = 0;
      // Nomralize

      vIncident = VGetNormal(vIncident);

      // vTemp.x = -1;
      // vTemp.y = 0;
      // vTemp.z = 0;
      vTemp.x = -1 * vIncident.x;
      vTemp.y = -1 * vIncident.y;
      vTemp.z = 0;

      fDoCollision = true;

      dElasity = 1.1;
    }

    if (fDoCollision) {
      pObject.CollisionNormal.x = vTemp.x;
      pObject.CollisionNormal.y = vTemp.y;
      pObject.CollisionNormal.z = vTemp.z;
      pObject.CollisionElasticity = dElasity;
      pObject.iOldCollisionCode = iCollisionCode;

      // Save collision velocity
      pObject.CollisionVelocity = VSetEqual(pObject.OldVelocity);

      if (pObject.fPotentialForDebug) {
        PhysicsDebugMsg(FormatString("Object %d: Collision %d", pObject.iID, iCollisionCode));
        PhysicsDebugMsg(FormatString("Object %d: Collision Normal %f %f %f", pObject.iID, vTemp.x, vTemp.y, vTemp.z));
        PhysicsDebugMsg(FormatString("Object %d: Collision OldPos %f %f %f", pObject.iID, pObject.Position.x, pObject.Position.y, pObject.Position.z));
        PhysicsDebugMsg(FormatString("Object %d: Collision Velocity %f %f %f", pObject.iID, pObject.CollisionVelocity.x, pObject.CollisionVelocity.y, pObject.CollisionVelocity.z));
      }

      pObject.fColliding = true;
    } else {
      pObject.fColliding = false;
      pObject.sConsecutiveCollisions = 0;
      pObject.sConsecutiveZeroVelocityCollisions = 0;
      pObject.fHaveHitGround = false;
    }
  }

  return fDoCollision;
}

function PhysicsResolveCollision(pObject: REAL_OBJECT, pVelocity: vector_3, pNormal: vector_3, CoefficientOfRestitution: FLOAT): void {
  let ImpulseNumerator: FLOAT;
  let Impulse: FLOAT;
  let vTemp: vector_3 = createVector3();

  ImpulseNumerator = -1 * CoefficientOfRestitution * VDotProduct(pVelocity, pNormal);

  Impulse = ImpulseNumerator;

  vTemp = VMultScalar(pNormal, Impulse);

  pObject.Velocity = VAdd(pObject.Velocity, vTemp);
}

function PhysicsMoveObject(pObject: REAL_OBJECT): boolean {
  let pNode: LEVELNODE;
  let sNewGridNo: INT16;
  let sTileIndex: INT16;
  let pTrav: ETRLEObject;
  let hVObject: SGPVObject;

  // Determine new gridno
  sNewGridNo = MAPROWCOLTOPOS(Math.trunc(pObject.Position.y / CELL_Y_SIZE), Math.trunc(pObject.Position.x / CELL_X_SIZE));

  if (pObject.fFirstTimeMoved) {
    pObject.fFirstTimeMoved = false;
    pObject.sFirstGridNo = sNewGridNo;
  }

  // CHECK FOR RANGE< IF INVALID, REMOVE!
  if (sNewGridNo == -1) {
    PhysicsDeleteObject(pObject);
    return false;
  }

  // Look at old gridno
  if (sNewGridNo != pObject.sGridNo || pObject.pNode == null) {
    if (pObject.fVisible) {
      if (CheckForCatchObject(pObject)) {
        pObject.fVisible = false;
      }
    }

    if (pObject.fVisible) {
      // Add smoke trails...
      if (pObject.Obj.usItem == Enum225.MORTAR_SHELL && pObject.uiNumTilesMoved > 2 && pObject.ubActionCode == Enum258.THROW_ARM_ITEM) {
        if (sNewGridNo != pObject.sGridNo) {
          let AniParams: ANITILE_PARAMS = createAnimatedTileParams();

          AniParams.sGridNo = sNewGridNo;
          AniParams.ubLevelID = ANI_STRUCT_LEVEL;
          AniParams.sDelay = (100 + PreRandom(100));
          AniParams.sStartFrame = 0;
          AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_ALWAYS_TRANSLUCENT;
          AniParams.sX = pObject.Position.x;
          AniParams.sY = pObject.Position.y;
          AniParams.sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.Position.z);

          AniParams.zCachedFile = "TILECACHE\\MSLE_SMK.STI";

          CreateAnimationTile(AniParams);
        }
      } else if (pObject.uiNumTilesMoved > 0) {
        if (sNewGridNo != pObject.sGridNo) {
          // We're at a new gridno!
          if (pObject.pNode != null) {
            RemoveStructFromLevelNode(pObject.sLevelNodeGridNo, pObject.pNode);
          }

          // We're at a new gridno!
          if (pObject.pShadow != null) {
            RemoveShadowFromLevelNode(pObject.sLevelNodeGridNo, pObject.pShadow);
          }

          // Now get graphic index
          sTileIndex = GetTileGraphicForItem(Item[pObject.Obj.usItem]);
          // sTileIndex = BULLETTILE1;

          // Set new gridno, add
          pNode = <LEVELNODE>AddStructToTail(sNewGridNo, sTileIndex);
          pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT | LEVELNODE_PHYSICSOBJECT | LEVELNODE_DYNAMIC);

          // Set levelnode
          pObject.pNode = pNode;

          // Add shadow
          AddShadowToHead(sNewGridNo, sTileIndex);
          pNode = <LEVELNODE>gpWorldLevelData[sNewGridNo].pShadowHead;
          pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT | LEVELNODE_PHYSICSOBJECT | LEVELNODE_DYNAMIC);

          // Set levelnode
          pObject.pShadow = pNode;

          pObject.sLevelNodeGridNo = sNewGridNo;
        }
      }
    } else {
      // Remove!
      if (pObject.pNode != null) {
        RemoveStructFromLevelNode(pObject.sLevelNodeGridNo, pObject.pNode);
      }

      // We're at a new gridno!
      if (pObject.pShadow != null) {
        RemoveShadowFromLevelNode(pObject.sLevelNodeGridNo, pObject.pShadow);
      }

      pObject.pNode = null;
      pObject.pShadow = null;
    }

    if (sNewGridNo != pObject.sGridNo) {
      pObject.uiNumTilesMoved++;
    }

    pObject.sGridNo = sNewGridNo;

    if (pObject.fPotentialForDebug) {
      PhysicsDebugMsg(FormatString("Object %d: uiNumTilesMoved: %d", pObject.iID, pObject.uiNumTilesMoved));
    }
  }

  if (pObject.fVisible) {
    if (pObject.Obj.usItem != Enum225.MORTAR_SHELL || pObject.ubActionCode != Enum258.THROW_ARM_ITEM) {
      if (pObject.pNode != null) {
        // OK, get offsets
        hVObject = gTileDatabase[pObject.pNode.usIndex].hTileSurface;
        pTrav = hVObject.pETRLEObject[gTileDatabase[pObject.pNode.usIndex].usRegionIndex];

        // Add new object / update position
        // Update position data
        pObject.pNode.sRelativeX = pObject.Position.x; // + pTrav->sOffsetX;
        pObject.pNode.sRelativeY = pObject.Position.y; // + pTrav->sOffsetY;
        pObject.pNode.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.Position.z);

        // Update position data
        (<LEVELNODE>pObject.pShadow).sRelativeX = pObject.Position.x; // + pTrav->sOffsetX;
        (<LEVELNODE>pObject.pShadow).sRelativeY = pObject.Position.y; // + pTrav->sOffsetY;
        (<LEVELNODE>pObject.pShadow).sRelativeZ = gpWorldLevelData[pObject.sGridNo].sHeight;
      }
    }
  }

  return true;
}

function ObjectHitWindow(sGridNo: INT16, usStructureID: UINT16, fBlowWindowSouth: boolean, fLargeForce: boolean): void {
  let SWindowHit: EV_S_WINDOWHIT = createEvSWindowHit();
  SWindowHit.sGridNo = sGridNo;
  SWindowHit.usStructureID = usStructureID;
  SWindowHit.fBlowWindowSouth = fBlowWindowSouth;
  SWindowHit.fLargeForce = fLargeForce;
  // AddGameEvent( S_WINDOWHIT, 0, &SWindowHit );

  WindowHit(sGridNo, usStructureID, fBlowWindowSouth, fLargeForce);
}

function FindBestForceForTrajectory(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dzDegrees: FLOAT, pItem: OBJECTTYPE, psGridNo: Pointer<INT16>, pdMagForce: Pointer<FLOAT>): vector_3 {
  let vDirNormal: vector_3 = createVector3();
  let vPosition: vector_3 = createVector3();
  let vForce: vector_3 = createVector3();
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let dForce: FLOAT = 20;
  let dRange: FLOAT;
  let dPercentDiff: FLOAT = 0;
  let dTestRange: FLOAT;
  let dTestDiff: FLOAT;
  let iNumChecks: INT32 = 0;

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(sSrcGridNo));

  // Set position
  vPosition.x = sSrcX;
  vPosition.y = sSrcY;
  vPosition.z = sStartZ;

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(vDirNormal);

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dzDegrees);

  // Get range
  dRange = GetRangeInCellCoordsFromGridNoDiff(sGridNo, sSrcGridNo);

  // calculate force needed
  { dForce = (12 * (Math.sqrt((GRAVITY * dRange) / Math.sin(2 * dzDegrees)))); }

  do {
    // This first force is just an estimate...
    // now di a binary search to find best value....
    iNumChecks++;

    // Now use a force
    vForce.x = dForce * vDirNormal.x;
    vForce.y = dForce * vDirNormal.y;
    vForce.z = dForce * vDirNormal.z;

    dTestRange = CalculateObjectTrajectory(sEndZ, pItem, vPosition, vForce, psGridNo);

    // What's the diff?
    dTestDiff = dTestRange - dRange;

    // How have we done?
    // < 5% off...
    if (Math.abs((dTestDiff / dRange)) < .01) {
      break;
    }

    if (iNumChecks > MAX_INTEGRATIONS) {
      break;
    }

    // What is the Percentage difference?
    dPercentDiff = dForce * (dTestDiff / dRange);

    // Adjust force accordingly
    dForce = dForce - ((dPercentDiff) / 2);
  } while (true);

  // OK, we have our force, calculate change to get through without collide
  // if ( ChanceToGetThroughObjectTrajectory( sEndZ, pItem, &vPosition, &vForce, NULL ) == 0 )
  {
    // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"Chance to get through throw is 0." );
  }

  if (pdMagForce) {
    (pdMagForce.value) = dForce;
  }

  return vForce;
}

function FindFinalGridNoGivenDirectionGridNoForceAngle(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dForce: FLOAT, dzDegrees: FLOAT, pItem: OBJECTTYPE): INT16 {
  let vDirNormal: vector_3 = createVector3();
  let vPosition: vector_3 = createVector3();
  let vForce: vector_3 = createVector3();
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let dRange: FLOAT;
  let sEndGridNo: INT16 = 0;

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(sSrcGridNo));

  // Set position
  vPosition.x = sSrcX;
  vPosition.y = sSrcY;
  vPosition.z = sStartZ;

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(vDirNormal);

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dzDegrees);

  // Get range
  dRange = GetRangeInCellCoordsFromGridNoDiff(sGridNo, sSrcGridNo);

  // Now use a force
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  CalculateObjectTrajectory(sEndZ, pItem, vPosition, vForce, createPointer(() => sEndGridNo, (v) => sEndGridNo = v));

  return sEndGridNo;
}

function FindBestAngleForTrajectory(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dForce: FLOAT, pItem: OBJECTTYPE, psGridNo: Pointer<INT16>): FLOAT {
  let vDirNormal: vector_3 = createVector3();
  let vPosition: vector_3 = createVector3();
  let vForce: vector_3 = createVector3();
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let dRange: FLOAT;
  let dzDegrees: FLOAT = (Math.PI / 8);
  let dPercentDiff: FLOAT = 0;
  let dTestRange: FLOAT;
  let dTestDiff: FLOAT;
  let iNumChecks: INT32 = 0;

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(sSrcGridNo));

  // Set position
  vPosition.x = sSrcX;
  vPosition.y = sSrcY;
  vPosition.z = sStartZ;

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(vDirNormal);

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dzDegrees);

  // Get range
  dRange = GetRangeInCellCoordsFromGridNoDiff(sGridNo, sSrcGridNo);

  do {
    // This first direction is just an estimate...
    // now do a binary search to find best value....
    iNumChecks++;

    // Now use a force
    vForce.x = dForce * vDirNormal.x;
    vForce.y = dForce * vDirNormal.y;
    vForce.z = dForce * vDirNormal.z;

    dTestRange = CalculateObjectTrajectory(sEndZ, pItem, vPosition, vForce, psGridNo);

    // What's the diff?
    dTestDiff = dTestRange - dRange;

    // How have we done?
    // < 5% off...
    if (Math.abs((dTestDiff / dRange)) < .05) {
      break;
    }

    if (iNumChecks > MAX_INTEGRATIONS) {
      break;
    }

    // What is the Percentage difference?
    dPercentDiff = dzDegrees * (dTestDiff / dRange);

    // Adjust degrees accordingly
    dzDegrees = dzDegrees - (dPercentDiff / 2);

    // OK, If our angle is too far either way, giveup!
    if (Math.abs(dzDegrees) >= (Math.PI / 2) || Math.abs(dzDegrees) <= 0.005) {
      // Use 0.....
      dzDegrees = 0;
      // From degrees, calculate Z portion of normal
      vDirNormal.z = Math.sin(dzDegrees);
      // Now use a force
      vForce.x = dForce * vDirNormal.x;
      vForce.y = dForce * vDirNormal.y;
      vForce.z = dForce * vDirNormal.z;
      dTestRange = CalculateObjectTrajectory(sEndZ, pItem, vPosition, vForce, psGridNo);
      return (dzDegrees);
    }

    // From degrees, calculate Z portion of normal
    vDirNormal.z = Math.sin(dzDegrees);
  } while (true);

  // OK, we have our force, calculate change to get through without collide
  // if ( ChanceToGetThroughObjectTrajectory( sEndZ, pItem, &vPosition, &vForce ) == 0 )
  //{
  //	ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"Chance to get through throw is 0." );
  //}

  return dzDegrees;
}

function FindTrajectory(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dForce: FLOAT, dzDegrees: FLOAT, pItem: OBJECTTYPE, psGridNo: Pointer<INT16>): void {
  let vDirNormal: vector_3 = createVector3();
  let vPosition: vector_3 = createVector3();
  let vForce: vector_3 = createVector3();
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(sSrcGridNo));

  // Set position
  vPosition.x = sSrcX;
  vPosition.y = sSrcY;
  vPosition.z = sStartZ;

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(vDirNormal);

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dzDegrees);

  // Now use a force
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  CalculateObjectTrajectory(sEndZ, pItem, vPosition, vForce, psGridNo);
}

// OK, this will, given a target Z, INVTYPE, source, target gridnos, initial force vector, will
// return range

function CalculateObjectTrajectory(sTargetZ: INT16, pItem: OBJECTTYPE, vPosition: vector_3, vForce: vector_3, psFinalGridNo: Pointer<INT16>): FLOAT {
  let iID: INT32;
  let pObject: REAL_OBJECT;
  let dDiffX: FLOAT;
  let dDiffY: FLOAT;
  let sGridNo: INT16;

  if (psFinalGridNo) {
    (psFinalGridNo.value) = NOWHERE;
  }

  // OK, create a physics object....
  iID = CreatePhysicalObject(pItem, -1, vPosition.x, vPosition.y, vPosition.z, vForce.x, vForce.y, vForce.z, NOBODY, Enum258.NO_THROW_ACTION, 0);

  if (iID == -1) {
    return -1;
  }

  pObject = ObjectSlots[iID];

  // Set some special values...
  pObject.fTestObject = TEST_OBJECT_NO_COLLISIONS;
  pObject.TestZTarget = sTargetZ;
  pObject.fTestPositionNotSet = true;
  pObject.fVisible = false;

  // Alrighty, move this beast until it dies....
  while (pObject.fAlive) {
    SimulateObject(pObject, DELTA_T);
  }

  // Calculate gridno from last position
  sGridNo = MAPROWCOLTOPOS(Math.trunc(pObject.Position.y / CELL_Y_SIZE), Math.trunc(pObject.Position.x / CELL_X_SIZE));

  PhysicsDeleteObject(pObject);

  // get new x, y, z values
  dDiffX = (pObject.TestTargetPosition.x - vPosition.x);
  dDiffY = (pObject.TestTargetPosition.y - vPosition.y);

  if (psFinalGridNo) {
    (psFinalGridNo.value) = sGridNo;
  }

  return Math.sqrt((dDiffX * dDiffX) + (dDiffY * dDiffY));
}

function ChanceToGetThroughObjectTrajectory(sTargetZ: INT16, pItem: OBJECTTYPE, vPosition: vector_3, vForce: vector_3, psNewGridNo: Pointer<INT16>, pbLevel: Pointer<INT8>, fFromUI: boolean): INT32 {
  let iID: INT32;
  let pObject: REAL_OBJECT;

  // OK, create a physics object....
  iID = CreatePhysicalObject(pItem, -1, vPosition.x, vPosition.y, vPosition.z, vForce.x, vForce.y, vForce.z, NOBODY, Enum258.NO_THROW_ACTION, 0);

  if (iID == -1) {
    return -1;
  }

  pObject = ObjectSlots[iID];

  // Set some special values...
  pObject.fTestObject = TEST_OBJECT_NOTWALLROOF_COLLISIONS;
  pObject.fTestPositionNotSet = true;
  pObject.TestZTarget = sTargetZ;
  pObject.fVisible = false;
  // pObject->fPotentialForDebug = TRUE;

  // Alrighty, move this beast until it dies....
  while (pObject.fAlive) {
    SimulateObject(pObject, DELTA_T);
  }

  if (psNewGridNo != null) {
    // Calculate gridno from last position

    // If NOT from UI, use exact collision position
    if (fFromUI) {
      (psNewGridNo.value) = MAPROWCOLTOPOS(Math.trunc(pObject.Position.y / CELL_Y_SIZE), Math.trunc(pObject.Position.x / CELL_X_SIZE));
    } else {
      (psNewGridNo.value) = MAPROWCOLTOPOS(Math.trunc(pObject.EndedWithCollisionPosition.y / CELL_Y_SIZE), Math.trunc(pObject.EndedWithCollisionPosition.x / CELL_X_SIZE));
    }

    (pbLevel.value) = GET_OBJECT_LEVEL(pObject.EndedWithCollisionPosition.z - CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[(psNewGridNo.value)].sHeight));
  }

  PhysicsDeleteObject(pObject);

  // See If we collided
  if (pObject.fTestEndedWithCollision) {
    return 0;
  }
  return 100;
}

export function CalculateLaunchItemAngle(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubHeight: UINT8, dForce: FLOAT, pItem: OBJECTTYPE, psGridNo: Pointer<INT16>): FLOAT {
  let dAngle: FLOAT;
  let sSrcX: INT16;
  let sSrcY: INT16;

  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(pSoldier.sGridNo));

  dAngle = FindBestAngleForTrajectory(pSoldier.sGridNo, sGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.bLevel), ubHeight, dForce, pItem, psGridNo);

  // new we have defaut angle value...
  return dAngle;
}

function CalculateLaunchItemBasicParams(pSoldier: SOLDIERTYPE, pItem: OBJECTTYPE, sGridNo: INT16, ubLevel: UINT8, sEndZ: INT16, pdMagForce: Pointer<FLOAT>, pdDegrees: Pointer<FLOAT>, psFinalGridNo: Pointer<INT16>, fArmed: boolean): void {
  let sInterGridNo: INT16;
  let sStartZ: INT16;
  let dMagForce: FLOAT = 0;
  let dMaxForce: FLOAT;
  let dMinForce: FLOAT;
  let dDegrees: FLOAT;
  let dNewDegrees: FLOAT;
  let fThroughIntermediateGridNo: boolean = false;
  let usLauncher: UINT16;
  let fIndoors: boolean = false;
  let fLauncher: boolean = false;
  let fMortar: boolean = false;
  let fGLauncher: boolean = false;
  let sMinRange: INT16 = 0;

  // Start with default degrees/ force
  dDegrees = OUTDOORS_START_ANGLE;
  sStartZ = GET_SOLDIER_THROW_HEIGHT(pSoldier.bLevel);

  // Are we armed, and are we throwing a LAUNCHABLE?

  usLauncher = GetLauncherFromLaunchable(pItem.usItem);

  if (fArmed && (usLauncher == Enum225.MORTAR || pItem.usItem == Enum225.MORTAR)) {
    // Start at 0....
    sStartZ = (pSoldier.bLevel * 256);
    fMortar = true;
    sMinRange = MIN_MORTAR_RANGE;
    // fLauncher = TRUE;
  }

  if (fArmed && (usLauncher == Enum225.GLAUNCHER || usLauncher == Enum225.UNDER_GLAUNCHER || pItem.usItem == Enum225.GLAUNCHER || pItem.usItem == Enum225.UNDER_GLAUNCHER)) {
    // OK, look at target level and decide angle to use...
    if (ubLevel == 1) {
      // dDegrees  = GLAUNCHER_START_ANGLE;
      dDegrees = GLAUNCHER_HIGHER_LEVEL_START_ANGLE;
    } else {
      dDegrees = GLAUNCHER_START_ANGLE;
    }
    fGLauncher = true;
    sMinRange = MIN_MORTAR_RANGE;
    // fLauncher = TRUE;
  }

  // CHANGE DEGREE VALUES BASED ON IF WE ARE INSIDE, ETC
  // ARE WE INSIDE?

  if (gfCaves || gfBasement) {
    // Adjust angle....
    dDegrees = INDOORS_START_ANGLE;
    fIndoors = true;
  }

  if ((IsRoofPresentAtGridno(pSoldier.sGridNo)) && pSoldier.bLevel == 0) {
    // Adjust angle....
    dDegrees = INDOORS_START_ANGLE;
    fIndoors = true;
  }

  // IS OUR TARGET INSIDE?
  if (IsRoofPresentAtGridno(sGridNo) && ubLevel == 0) {
    // Adjust angle....
    dDegrees = INDOORS_START_ANGLE;
    fIndoors = true;
  }

  // OK, look if we can go through a windows here...
  if (ubLevel == 0) {
    sInterGridNo = SoldierToLocationWindowTest(pSoldier, sGridNo);
  } else {
    sInterGridNo = NOWHERE;
  }

  if (sInterGridNo != NOWHERE) {
    // IF so, adjust target height, gridno....
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "Through a window!");

    fThroughIntermediateGridNo = true;
  }

  if (!fLauncher) {
    // Find force for basic
    FindBestForceForTrajectory(pSoldier.sGridNo, sGridNo, sStartZ, sEndZ, dDegrees, pItem, psFinalGridNo, createPointer(() => dMagForce, (v) => dMagForce = v));

    // Adjust due to max range....
    dMaxForce = CalculateSoldierMaxForce(pSoldier, dDegrees, pItem, fArmed);

    if (fIndoors) {
      dMaxForce = dMaxForce * 2;
    }

    if (dMagForce > dMaxForce) {
      dMagForce = dMaxForce;
    }

    // ATE: If we are a mortar, make sure we are at min.
    if (fMortar || fGLauncher) {
      // find min force
      dMinForce = CalculateForceFromRange(Math.trunc(sMinRange / 10), (Math.PI / 4));

      if (dMagForce < dMinForce) {
        dMagForce = dMinForce;
      }
    }

    if (fThroughIntermediateGridNo) {
      // Given this power, now try and go through this window....
      dDegrees = FindBestAngleForTrajectory(pSoldier.sGridNo, sInterGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.bLevel), 150, dMagForce, pItem, psFinalGridNo);
    }
  } else {
    // Use MAX force, vary angle....
    dMagForce = CalculateSoldierMaxForce(pSoldier, dDegrees, pItem, fArmed);

    if (ubLevel == 0) {
      dMagForce = (dMagForce * 1.25);
    }

    FindTrajectory(pSoldier.sGridNo, sGridNo, sStartZ, sEndZ, dMagForce, dDegrees, pItem, psFinalGridNo);

    if (ubLevel == 1 && !fThroughIntermediateGridNo) {
      // Is there a guy here...?
      if (WhoIsThere2(sGridNo, ubLevel) != NO_SOLDIER) {
        dMagForce = (dMagForce * 0.85);

        // Yep, try to get angle...
        dNewDegrees = FindBestAngleForTrajectory(pSoldier.sGridNo, sGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.bLevel), 150, dMagForce, pItem, psFinalGridNo);

        if (dNewDegrees != 0) {
          dDegrees = dNewDegrees;
        }
      }
    }

    if (fThroughIntermediateGridNo) {
      dDegrees = FindBestAngleForTrajectory(pSoldier.sGridNo, sInterGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.bLevel), 150, dMagForce, pItem, psFinalGridNo);
    }
  }

  (pdMagForce.value) = dMagForce;
  (pdDegrees.value) = dDegrees;
}

export function CalculateLaunchItemChanceToGetThrough(pSoldier: SOLDIERTYPE, pItem: OBJECTTYPE, sGridNo: INT16, ubLevel: UINT8, sEndZ: INT16, psFinalGridNo: Pointer<INT16>, fArmed: boolean, pbLevel: Pointer<INT8>, fFromUI: boolean): boolean {
  let dForce: FLOAT = 0;
  let dDegrees: FLOAT = 0;
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let vForce: vector_3 = createVector3();
  let vPosition: vector_3 = createVector3();
  let vDirNormal: vector_3 = createVector3();

  // Ge7t basic launch params...
  CalculateLaunchItemBasicParams(pSoldier, pItem, sGridNo, ubLevel, sEndZ, createPointer(() => dForce, (v) => dForce = v), createPointer(() => dDegrees, (v) => dDegrees = v), psFinalGridNo, fArmed);

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(pSoldier.sGridNo));

  // Set position
  vPosition.x = sSrcX;
  vPosition.y = sSrcY;
  vPosition.z = GET_SOLDIER_THROW_HEIGHT(pSoldier.bLevel);

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(vDirNormal);

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dDegrees);

  // Do force....
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  // OK, we have our force, calculate change to get through without collide
  if (ChanceToGetThroughObjectTrajectory(sEndZ, pItem, vPosition, vForce, psFinalGridNo, pbLevel, fFromUI) == 0) {
    return false;
  }

  if ((pbLevel.value) != ubLevel) {
    return false;
  }

  if (!fFromUI && (psFinalGridNo.value) != sGridNo) {
    return false;
  }

  return true;
}

function CalculateForceFromRange(sRange: INT16, dDegrees: FLOAT): FLOAT {
  let dMagForce: FLOAT = 0;
  let sSrcGridNo: INT16;
  let sDestGridNo: INT16;
  let Object: OBJECTTYPE = createObjectType();
  let sFinalGridNo: INT16 = 0;

  // OK, use a fake gridno, find the new gridno based on range, use height of merc, end height of ground,
  // 45 degrees
  sSrcGridNo = 4408;
  sDestGridNo = 4408 + (sRange * WORLD_COLS);

  // Use a grenade objecttype
  CreateItem(Enum225.HAND_GRENADE, 100, Object);

  FindBestForceForTrajectory(sSrcGridNo, sDestGridNo, GET_SOLDIER_THROW_HEIGHT(0), 0, dDegrees, Object, createPointer(() => sFinalGridNo, (v) => sFinalGridNo = v), createPointer(() => dMagForce, (v) => dMagForce = v));

  return dMagForce;
}

function CalculateSoldierMaxForce(pSoldier: SOLDIERTYPE, dDegrees: FLOAT, pItem: OBJECTTYPE, fArmed: boolean): FLOAT {
  let uiMaxRange: INT32;
  let dMagForce: FLOAT;

  dDegrees = (Math.PI / 4);

  uiMaxRange = CalcMaxTossRange(pSoldier, pItem.usItem, fArmed);

  dMagForce = CalculateForceFromRange(uiMaxRange, dDegrees);

  return dMagForce;
}

const MAX_MISS_BY = 30;
const MIN_MISS_BY = 1;
const MAX_MISS_RADIUS = 5;

export function CalculateLaunchItemParamsForThrow(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubLevel: UINT8, sEndZ: INT16, pItem: OBJECTTYPE, bMissBy: INT8, ubActionCode: UINT8, uiActionData: UINT32): void {
  let dForce: FLOAT = 0;
  let dDegrees: FLOAT = 0;
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let vForce: vector_3 = createVector3();
  let vDirNormal: vector_3 = createVector3();
  let sFinalGridNo: INT16 = 0;
  let fArmed: boolean = false;
  let usLauncher: UINT16;
  let sStartZ: INT16;
  let bMinMissRadius: INT8;
  let bMaxMissRadius: INT8;
  let bMaxRadius: INT8;
  let fScale: FLOAT;

  // Set target ID if anyone
  pSoldier.ubTargetID = WhoIsThere2(sGridNo, ubLevel);

  if (ubActionCode == Enum258.THROW_ARM_ITEM) {
    fArmed = true;
  }

  if (bMissBy < 0) {
    // then we hit!
    bMissBy = 0;
  }

  // if ( 0 )
  if (bMissBy > 0) {
    // Max the miss variance
    if (bMissBy > MAX_MISS_BY) {
      bMissBy = MAX_MISS_BY;
    }

    // Min the miss varience...
    if (bMissBy < MIN_MISS_BY) {
      bMissBy = MIN_MISS_BY;
    }

    // Adjust position, force, angle

    // Default to max radius...
    bMaxRadius = 5;

    // scale if pyth spaces away is too far
    if (PythSpacesAway(sGridNo, pSoldier.sGridNo) < (bMaxRadius / 1.5)) {
      bMaxRadius = Math.trunc(PythSpacesAway(sGridNo, pSoldier.sGridNo) / 2);
    }

    // Get radius
    fScale = (bMissBy / MAX_MISS_BY);

    bMaxMissRadius = Math.trunc(bMaxRadius * fScale);

    // Limit max radius...
    if (bMaxMissRadius > 4) {
      bMaxMissRadius = 4;
    }

    bMinMissRadius = bMaxMissRadius - 1;

    if (bMinMissRadius < 2) {
      bMinMissRadius = 2;
    }

    if (bMaxMissRadius < bMinMissRadius) {
      bMaxMissRadius = bMinMissRadius;
    }

    sGridNo = RandomGridFromRadius(sGridNo, bMinMissRadius, bMaxMissRadius);
  }

  // Get basic launch params...
  CalculateLaunchItemBasicParams(pSoldier, pItem, sGridNo, ubLevel, sEndZ, createPointer(() => dForce, (v) => dForce = v), createPointer(() => dDegrees, (v) => dDegrees = v), createPointer(() => sFinalGridNo, (v) => sFinalGridNo = v), fArmed);

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(pSoldier.sGridNo));

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(vDirNormal);

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dDegrees);

  // Do force....
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  // Allocate Throw Parameters
  pSoldier.pThrowParams = createThrowParams();

  pSoldier.pTempObject = createObjectType();

  copyObjectType(pSoldier.pTempObject, pItem);
  pSoldier.pThrowParams.dX = sSrcX;
  pSoldier.pThrowParams.dY = sSrcY;

  sStartZ = GET_SOLDIER_THROW_HEIGHT(pSoldier.bLevel);
  usLauncher = GetLauncherFromLaunchable(pItem.usItem);
  if (fArmed && usLauncher == Enum225.MORTAR) {
    // Start at 0....
    sStartZ = (pSoldier.bLevel * 256) + 50;
  }

  pSoldier.pThrowParams.dZ = sStartZ;
  pSoldier.pThrowParams.dForceX = vForce.x;
  pSoldier.pThrowParams.dForceY = vForce.y;
  pSoldier.pThrowParams.dForceZ = vForce.z;
  pSoldier.pThrowParams.dLifeSpan = -1;
  pSoldier.pThrowParams.ubActionCode = ubActionCode;
  pSoldier.pThrowParams.uiActionData = uiActionData;

  // Dirty interface
  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
}

function CheckForCatcher(pObject: REAL_OBJECT, usStructureID: UINT16): boolean {
  // Do we want to catch?
  if (pObject.fTestObject == NO_TEST_OBJECT) {
    if (pObject.ubActionCode == Enum258.THROW_TARGET_MERC_CATCH) {
      // Is it a guy?
      if (usStructureID < INVALID_STRUCTURE_ID) {
        // Is it the same guy?
        if (usStructureID == pObject.uiActionData) {
          if (DoCatchObject(pObject)) {
            pObject.fAlive = false;
            return true;
          }
        }
      }
    }
  }
  return false;
}

function CheckForObjectHittingMerc(pObject: REAL_OBJECT, usStructureID: UINT16): void {
  let pSoldier: SOLDIERTYPE;
  let sDamage: INT16;
  let sBreath: INT16;

  // Do we want to catch?
  if (pObject.fTestObject == NO_TEST_OBJECT) {
    // Is it a guy?
    if (usStructureID < INVALID_STRUCTURE_ID) {
      if (pObject.ubLastTargetTakenDamage != usStructureID) {
        pSoldier = MercPtrs[usStructureID];

        sDamage = 1;
        sBreath = 0;

        EVENT_SoldierGotHit(pSoldier, NOTHING, sDamage, sBreath, pSoldier.bDirection, 0, pObject.ubOwner, FIRE_WEAPON_TOSSED_OBJECT_SPECIAL, 0, 0, NOWHERE);

        pObject.ubLastTargetTakenDamage = (usStructureID);
      }
    }
  }
}

function CheckForCatchObject(pObject: REAL_OBJECT): boolean {
  let pSoldier: SOLDIERTYPE;
  let uiSpacesAway: UINT32;

  // Do we want to catch?
  if (pObject.fTestObject == NO_TEST_OBJECT) {
    if (pObject.ubActionCode == Enum258.THROW_TARGET_MERC_CATCH) {
      pSoldier = MercPtrs[pObject.uiActionData];

      // Is it a guy?
      // Are we close to this guy?
      uiSpacesAway = PythSpacesAway(pObject.sGridNo, pSoldier.sGridNo);

      if (uiSpacesAway < 4 && !pObject.fAttemptedCatch) {
        if (pSoldier.usAnimState != Enum193.CATCH_STANDING && pSoldier.usAnimState != Enum193.CATCH_CROUCHED && pSoldier.usAnimState != Enum193.LOWER_RIFLE) {
          if (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_STAND) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CATCH_STANDING, 0, false);
          } else if (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_CROUCH) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CATCH_CROUCHED, 0, false);
          }

          pObject.fCatchAnimOn = true;
        }
      }

      pObject.fAttemptedCatch = true;

      if (uiSpacesAway <= 1 && !pObject.fCatchCheckDone) {
        if (AttemptToCatchObject(pObject)) {
          return true;
        }
      }
    }
  }
  return false;
}

function AttemptToCatchObject(pObject: REAL_OBJECT): boolean {
  let pSoldier: SOLDIERTYPE;
  let ubChanceToCatch: UINT8;

  // Get intended target
  pSoldier = MercPtrs[pObject.uiActionData];

  // OK, get chance to catch
  // base it on...? CC? Dexterity?
  ubChanceToCatch = 50 + Math.trunc(EffectiveDexterity(pSoldier) / 2);

  pObject.fCatchCheckDone = true;

  if (PreRandom(100) > ubChanceToCatch) {
    return false;
  }

  pObject.fCatchGood = true;

  return true;
}

function DoCatchObject(pObject: REAL_OBJECT): boolean {
  let pSoldier: SOLDIERTYPE;
  let fGoodCatch: boolean = false;
  let usItem: UINT16;

  // Get intended target
  pSoldier = MercPtrs[pObject.uiActionData];

  // Catch anim.....
  switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
    case ANIM_STAND:

      pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CATCH, 0, false);
      break;

    case ANIM_CROUCH:

      pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CROUCH_CATCH, 0, false);
      break;
  }

  PlayJA2Sample(Enum330.CATCH_OBJECT, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));

  pObject.fCatchAnimOn = false;

  if (!pObject.fCatchGood) {
    return false;
  }

  // Get item
  usItem = pObject.Obj.usItem;

  // Transfer object
  fGoodCatch = AutoPlaceObject(pSoldier, pObject.Obj, true);

  // Report success....
  if (fGoodCatch) {
    pObject.fDropItem = false;

    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_MERC_CAUGHT_ITEM], pSoldier.name, ShortItemNames[usItem]);
  }

  return true;
}

//#define TESTDUDEXPLOSIVES

function HandleArmedObjectImpact(pObject: REAL_OBJECT): void {
  let sZ: INT16;
  let fDoImpact: boolean = false;
  let fCheckForDuds: boolean = false;
  let pObj: OBJECTTYPE;
  let iTrapped: INT32 = 0;
  let usFlags: UINT16 = 0;
  let bLevel: INT8 = 0;

  // Calculate pixel position of z
  sZ = CONVERT_HEIGHTUNITS_TO_PIXELS((pObject.Position.z)) - gpWorldLevelData[pObject.sGridNo].sHeight;

  // get OBJECTTYPE
  pObj = pObject.Obj;

  // ATE: Make sure number of objects is 1...
  pObj.ubNumberOfObjects = 1;

  if (Item[pObj.usItem].usItemClass & IC_GRENADE) {
    fCheckForDuds = true;
  }

  if (pObj.usItem == Enum225.MORTAR_SHELL) {
    fCheckForDuds = true;
  }

  if (Item[pObj.usItem].usItemClass & IC_THROWN) {
    AddItemToPool(pObject.sGridNo, pObj, INVISIBLE, bLevel, usFlags, 0);
  }

  if (fCheckForDuds) {
    // If we landed on anything other than the floor, always! go off...
    if (sZ != 0 || pObject.fInWater || (pObj.bStatus[0] >= USABLE && (PreRandom(100) < pObj.bStatus[0] + PreRandom(50))))
    {
      fDoImpact = true;
    } else // didn't go off!
    {
      if (pObj.bStatus[0] >= USABLE && PreRandom(100) < pObj.bStatus[0] + PreRandom(50))
      {
        iTrapped = PreRandom(4) + 2;
      }

      if (iTrapped) {
        // Start timed bomb...
        usFlags |= WORLD_ITEM_ARMED_BOMB;

        pObj.bDetonatorType = Enum224.BOMB_TIMED;
        pObj.bDelay = (1 + PreRandom(2));
      }

      // ATE: If we have collided with roof last...
      if (pObject.iOldCollisionCode == Enum229.COLLISION_ROOF) {
        bLevel = 1;
      }

      // Add item to pool....
      AddItemToPool(pObject.sGridNo, pObj, INVISIBLE, bLevel, usFlags, 0);

      // All teams lok for this...
      NotifySoldiersToLookforItems();

      if (pObject.ubOwner != NOBODY) {
        DoMercBattleSound(MercPtrs[pObject.ubOwner], (Enum259.BATTLE_SOUND_CURSE1));
      }
    }
  } else {
    fDoImpact = true;
  }

  if (fDoImpact) {
    if (pObject.Obj.usItem == Enum225.BREAK_LIGHT) {
      // Add a light effect...
      NewLightEffect(pObject.sGridNo, Enum305.LIGHT_FLARE_MARK_1);
    } else if (Item[pObject.Obj.usItem].usItemClass & IC_GRENADE) {
      /* ARM: Removed.  Rewards even missed throws, and pulling a pin doesn't really teach anything about explosives
                              if ( MercPtrs[ pObject->ubOwner ]->bTeam == gbPlayerNum && gTacticalStatus.uiFlags & INCOMBAT )
                              {
                                      // tossed grenade, not a dud, so grant xp
                                      // EXPLOSIVES GAIN (10):  Tossing grenade
              if ( pObject->ubOwner != NOBODY )
              {
                                        StatChange( MercPtrs[ pObject->ubOwner ], EXPLODEAMT, 10, FALSE );
              }
                              }
      */

      IgniteExplosion(pObject.ubOwner, pObject.Position.x, pObject.Position.y, sZ, pObject.sGridNo, pObject.Obj.usItem, GET_OBJECT_LEVEL(pObject.Position.z - CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.sGridNo].sHeight)));
    } else if (pObject.Obj.usItem == Enum225.MORTAR_SHELL) {
      sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.Position.z);

      IgniteExplosion(pObject.ubOwner, pObject.Position.x, pObject.Position.y, sZ, pObject.sGridNo, pObject.Obj.usItem, GET_OBJECT_LEVEL(pObject.Position.z - CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.sGridNo].sHeight)));
    }
  }
}

export function SavePhysicsTableToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let usCnt: UINT16 = 0;
  let usPhysicsCount: UINT32 = 0;
  let buffer: Buffer;

  for (usCnt = 0; usCnt < NUM_OBJECT_SLOTS; usCnt++) {
    // if the REAL_OBJECT is active, save it
    if (ObjectSlots[usCnt].fAllocated) {
      usPhysicsCount++;
    }
  }

  // Save the number of REAL_OBJECTs in the array
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(usPhysicsCount, 0);

  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  if (usPhysicsCount != 0) {
    buffer = Buffer.allocUnsafe(REAL_OBJECT_SIZE);
    for (usCnt = 0; usCnt < NUM_OBJECT_SLOTS; usCnt++) {
      // if the REAL_OBJECT is active, save it
      if (ObjectSlots[usCnt].fAllocated) {
        // Save the the REAL_OBJECT structure
        writeRealObject(ObjectSlots[usCnt], buffer);
        uiNumBytesWritten = FileWrite(hFile, buffer, REAL_OBJECT_SIZE);
        if (uiNumBytesWritten != REAL_OBJECT_SIZE) {
          return false;
        }
      }
    }
  }

  return true;
}

export function LoadPhysicsTableFromSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let usCnt: UINT16 = 0;
  let buffer: Buffer;

  // make sure the objects are not allocated
  ObjectSlots.forEach(resetRealObject);

  // Load the number of REAL_OBJECTs in the array
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    return false;
  }

  guiNumObjectSlots = buffer.readUInt32LE(0);

  // loop through and add the objects
  buffer = Buffer.allocUnsafe(REAL_OBJECT_SIZE);
  for (usCnt = 0; usCnt < guiNumObjectSlots; usCnt++) {
    // Load the the REAL_OBJECT structure
    uiNumBytesRead = FileRead(hFile, buffer, REAL_OBJECT_SIZE);
    if (uiNumBytesRead != REAL_OBJECT_SIZE) {
      return false;
    }

    readRealObject(ObjectSlots[usCnt], buffer);

    ObjectSlots[usCnt].pNode = null;
    ObjectSlots[usCnt].pShadow = null;
    ObjectSlots[usCnt].iID = usCnt;
  }

  return true;
}

function RandomGridFromRadius(sSweetGridNo: INT16, ubMinRadius: INT8, ubMaxRadius: INT8): UINT16 {
  let sX: INT16;
  let sY: INT16;
  let sGridNo: INT16 = <INT16><unknown>undefined;
  let leftmost: INT32;
  let fFound: boolean = false;
  let cnt: UINT32 = 0;

  if (ubMaxRadius == 0 || ubMinRadius == 0) {
    return sSweetGridNo;
  }

  do {
    sX = PreRandom(ubMaxRadius);
    sY = PreRandom(ubMaxRadius);

    if ((sX < ubMinRadius || sY < ubMinRadius) && ubMaxRadius != ubMinRadius) {
      continue;
    }

    if (PreRandom(2) == 0) {
      sX = sX * -1;
    }

    if (PreRandom(2) == 0) {
      sY = sY * -1;
    }

    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * sY)) / WORLD_COLS) * WORLD_COLS;

    sGridNo = sSweetGridNo + (WORLD_COLS * sY) + sX;

    if (sGridNo == sSweetGridNo) {
      continue;
    }

    if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
      fFound = true;
    }

    cnt++;

    if (cnt > 50) {
      return NOWHERE;
    }
  } while (!fFound);

  return sGridNo;
}

}
