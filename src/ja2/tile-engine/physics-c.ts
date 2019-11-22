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
const OBJECT_DETONATE_ON_IMPACT = (o: Pointer<REAL_OBJECT>) => ((o.value.Obj.usItem == Enum225.MORTAR_SHELL)); // && ( o->ubActionCode == THROW_ARM_ITEM || pObject->fTestObject ) )

const MAX_INTEGRATIONS = 8;

const TIME_MULTI = 1.8;

//#define					TIME_MULTI			2.2

const DELTA_T = (1.0 * TIME_MULTI);

const GRAVITY = (9.8 * 2.5);
//#define					GRAVITY						( 9.8 * 2.8 )

export let ObjectSlots: REAL_OBJECT[] /* [NUM_OBJECT_SLOTS] */;
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

export function CreatePhysicalObject(pGameObj: Pointer<OBJECTTYPE>, dLifeLength: FLOAT, xPos: FLOAT, yPos: FLOAT, zPos: FLOAT, xForce: FLOAT, yForce: FLOAT, zForce: FLOAT, ubOwner: UINT8, ubActionCode: UINT8, uiActionData: UINT32): INT32 {
  let iObjectIndex: INT32;
  let mass: FLOAT;
  let pObject: Pointer<REAL_OBJECT>;

  if ((iObjectIndex = GetFreeObjectSlot()) == (-1))
    return -1;

  pObject = addressof(ObjectSlots[iObjectIndex]);

  memset(pObject, 0, sizeof(REAL_OBJECT));

  // OK, GET OBJECT DATA AND COPY
  memcpy(addressof(pObject.value.Obj), pGameObj, sizeof(OBJECTTYPE));

  // Get mass
  mass = CALCULATE_OBJECT_MASS(Item[pGameObj.value.usItem].ubWeight);

  // If mass is z, make it something!
  if (mass == 0) {
    mass = 10;
  }

  // OK, mass determines the smoothness of the physics integration
  // For gameplay, we will use mass for maybe max throw distance
  mass = 60;

  // Set lifelength
  pObject.value.dLifeLength = dLifeLength;

  pObject.value.fAllocated = true;
  pObject.value.fAlive = true;
  pObject.value.fApplyFriction = false;
  pObject.value.iSoundID = NO_SAMPLE;

  // Set values
  pObject.value.OneOverMass = 1 / mass;
  pObject.value.Position.x = xPos;
  pObject.value.Position.y = yPos;
  pObject.value.Position.z = zPos;
  pObject.value.fVisible = true;
  pObject.value.ubOwner = ubOwner;
  pObject.value.ubActionCode = ubActionCode;
  pObject.value.uiActionData = uiActionData;
  pObject.value.fDropItem = true;
  pObject.value.ubLastTargetTakenDamage = NOBODY;

  pObject.value.fFirstTimeMoved = true;

  pObject.value.InitialForce.x = SCALE_VERT_VAL_TO_HORZ(xForce);
  pObject.value.InitialForce.y = SCALE_VERT_VAL_TO_HORZ(yForce);
  pObject.value.InitialForce.z = zForce;

  pObject.value.InitialForce = VDivScalar(addressof(pObject.value.InitialForce), TIME_MULTI);
  pObject.value.InitialForce = VMultScalar(addressof(pObject.value.InitialForce), 1.5);

  // Calculate gridNo
  pObject.value.sGridNo = MAPROWCOLTOPOS((yPos / CELL_Y_SIZE), (xPos / CELL_X_SIZE));
  pObject.value.iID = iObjectIndex;
  pObject.value.pNode = null;
  pObject.value.pShadow = null;

  // If gridno not equal to NOWHERE, use sHeight of alnd....
  if (pObject.value.sGridNo != NOWHERE) {
    pObject.value.Position.z += CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.value.sGridNo].sHeight);
    pObject.value.EndedWithCollisionPosition.z += CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.value.sGridNo].sHeight);
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
  let pObject: Pointer<REAL_OBJECT>;

  if (COUNTERDONE(Enum386.PHYSICSUPDATE)) {
    RESETCOUNTER(Enum386.PHYSICSUPDATE);

    for (cnt = 0; cnt < guiNumObjectSlots; cnt++) {
      // CHECK FOR ALLOCATED
      if (ObjectSlots[cnt].fAllocated) {
        // Get object
        pObject = addressof(ObjectSlots[cnt]);

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
      PhysicsDeleteObject(addressof(ObjectSlots[cnt]));
    }
  }
}

function SimulateObject(pObject: Pointer<REAL_OBJECT>, deltaT: FLOAT): void {
  let DeltaTime: FLOAT = 0;
  let CurrentTime: FLOAT = 0;
  let TargetTime: FLOAT = DeltaTime;
  let iCollisionID: INT32;
  let fEndThisObject: boolean = false;

  if (!PhysicsUpdateLife(pObject, deltaT)) {
    return;
  }

  if (pObject.value.fAlive) {
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

      if (!PhysicsHandleCollisions(pObject, addressof(iCollisionID), DeltaTime)) {
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

function PhysicsComputeForces(pObject: Pointer<REAL_OBJECT>): boolean {
  let vTemp: vector_3 = createVector3();

  // Calculate forces
  pObject.value.Force = VSetEqual(addressof(pObject.value.InitialForce));

  // Note: Only apply gravity if we are not resting on some structure surface
  if (!pObject.value.fZOnRest) {
    pObject.value.Force.z -= GRAVITY;
  }

  // Set intial force to zero
  pObject.value.InitialForce = VMultScalar(addressof(pObject.value.InitialForce), 0);

  if (pObject.value.fApplyFriction) {
    vTemp = VMultScalar(addressof(pObject.value.Velocity), -pObject.value.AppliedMu);
    pObject.value.Force = VAdd(addressof(vTemp), addressof(pObject.value.Force));

    pObject.value.fApplyFriction = false;
  }

  if (fDampingActive) {
    vTemp = VMultScalar(addressof(pObject.value.Velocity), -Kdl);
    pObject.value.Force = VAdd(addressof(vTemp), addressof(pObject.value.Force));
  }

  return true;
}

function PhysicsUpdateLife(pObject: Pointer<REAL_OBJECT>, DeltaTime: FLOAT): boolean {
  let bLevel: UINT8 = 0;

  pObject.value.dLifeSpan += DeltaTime;

  // End life if time has ran out or we are stationary
  if (pObject.value.dLifeLength != -1) {
    if (pObject.value.dLifeSpan > pObject.value.dLifeLength) {
      pObject.value.fAlive = false;
    }
  }

  // End life if we are out of bounds....
  if (!GridNoOnVisibleWorldTile(pObject.value.sGridNo)) {
    pObject.value.fAlive = false;
  }

  if (!pObject.value.fAlive) {
    pObject.value.fAlive = false;

    if (!pObject.value.fTestObject) {
      if (pObject.value.iSoundID != NO_SAMPLE) {
        SoundStop(pObject.value.iSoundID);
      }

      if (pObject.value.ubActionCode == Enum258.THROW_ARM_ITEM && !pObject.value.fInWater) {
        HandleArmedObjectImpact(pObject);
      } else {
        // If we are in water, and we are a sinkable item...
        if (!pObject.value.fInWater || !(Item[pObject.value.Obj.usItem].fFlags & ITEM_SINKS)) {
          if (pObject.value.fDropItem) {
            // ATE: If we have collided with roof last...
            if (pObject.value.iOldCollisionCode == Enum229.COLLISION_ROOF) {
              bLevel = 1;
            }

            // ATE; If an armed object, don't add....
            if (pObject.value.ubActionCode != Enum258.THROW_ARM_ITEM) {
              AddItemToPool(pObject.value.sGridNo, addressof(pObject.value.Obj), 1, bLevel, 0, -1);
            }
          }
        }
      }

      // Make impact noise....
      if (pObject.value.Obj.usItem == Enum225.ROCK || pObject.value.Obj.usItem == Enum225.ROCK2) {
        MakeNoise(pObject.value.ubOwner, pObject.value.sGridNo, 0, gpWorldLevelData[pObject.value.sGridNo].ubTerrainID, (9 + PreRandom(9)), Enum236.NOISE_ROCK_IMPACT);
      } else if (Item[pObject.value.Obj.usItem].usItemClass & IC_GRENADE) {
        MakeNoise(pObject.value.ubOwner, pObject.value.sGridNo, 0, gpWorldLevelData[pObject.value.sGridNo].ubTerrainID, (9 + PreRandom(9)), Enum236.NOISE_GRENADE_IMPACT);
      }

      if (!pObject.value.fTestObject && pObject.value.iOldCollisionCode == Enum229.COLLISION_GROUND) {
        PlayJA2Sample(Enum330.THROW_IMPACT_2, RATE_11025, SoundVolume(MIDVOLUME, pObject.value.sGridNo), 1, SoundDir(pObject.value.sGridNo));
      }

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., PHYSICS OBJECT DONE effect gone off"));
      ReduceAttackBusyCount(pObject.value.ubOwner, false);

      // ATE: Handle end of animation...
      if (pObject.value.fCatchAnimOn) {
        let pSoldier: Pointer<SOLDIERTYPE>;

        pObject.value.fCatchAnimOn = false;

        // Get intended target
        pSoldier = MercPtrs[pObject.value.uiActionData];

        // Catch anim.....
        switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
          case ANIM_STAND:

            pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CATCH, 0, false);
            break;

          case ANIM_CROUCH:

            pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CROUCH_CATCH, 0, false);
            break;
        }

        PlayJA2Sample(Enum330.CATCH_OBJECT, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
      }
    }

    PhysicsDeleteObject(pObject);
    return false;
  }

  return true;
}

function PhysicsIntegrate(pObject: Pointer<REAL_OBJECT>, DeltaTime: FLOAT): boolean {
  let vTemp: vector_3 = createVector3();

  // Save old position
  pObject.value.OldPosition = VSetEqual(addressof(pObject.value.Position));
  pObject.value.OldVelocity = VSetEqual(addressof(pObject.value.Velocity));

  vTemp = VMultScalar(addressof(pObject.value.Velocity), DeltaTime);
  pObject.value.Position = VAdd(addressof(pObject.value.Position), addressof(vTemp));

  // Save test TargetPosition
  if (pObject.value.fTestPositionNotSet) {
    pObject.value.TestTargetPosition = VSetEqual(addressof(pObject.value.Position));
  }

  vTemp = VMultScalar(addressof(pObject.value.Force), (DeltaTime * pObject.value.OneOverMass));
  pObject.value.Velocity = VAdd(addressof(pObject.value.Velocity), addressof(vTemp));

  if (pObject.value.fPotentialForDebug) {
    PhysicsDebugMsg(FormatString("Object %d: Force		%f %f %f", pObject.value.iID, pObject.value.Force.x, pObject.value.Force.y, pObject.value.Force.z));
    PhysicsDebugMsg(FormatString("Object %d: Velocity %f %f %f", pObject.value.iID, pObject.value.Velocity.x, pObject.value.Velocity.y, pObject.value.Velocity.z));
    PhysicsDebugMsg(FormatString("Object %d: Position %f %f %f", pObject.value.iID, pObject.value.Position.x, pObject.value.Position.y, pObject.value.Position.z));
    PhysicsDebugMsg(FormatString("Object %d: Delta Pos %f %f %f", pObject.value.iID, (pObject.value.OldPosition.x - pObject.value.Position.x), (pObject.value.OldPosition.y - pObject.value.Position.y), (pObject.value.OldPosition.z - pObject.value.Position.z)));
  }

  if (pObject.value.Obj.usItem == Enum225.MORTAR_SHELL && !pObject.value.fTestObject && pObject.value.ubActionCode == Enum258.THROW_ARM_ITEM) {
    // Start soud if we have reached our max height
    if (pObject.value.OldVelocity.z >= 0 && pObject.value.Velocity.z < 0) {
      if (pObject.value.iSoundID == NO_SAMPLE) {
        pObject.value.iSoundID = PlayJA2Sample(Enum330.MORTAR_WHISTLE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      }
    }
  }

  return true;
}

function PhysicsHandleCollisions(pObject: Pointer<REAL_OBJECT>, piCollisionID: Pointer<INT32>, DeltaTime: FLOAT): boolean {
  let dDeltaX: FLOAT;
  let dDeltaY: FLOAT;
  let dDeltaZ: FLOAT;

  if (PhysicsCheckForCollisions(pObject, piCollisionID)) {
    dDeltaX = pObject.value.Position.x - pObject.value.OldPosition.x;
    dDeltaY = pObject.value.Position.y - pObject.value.OldPosition.y;
    dDeltaZ = pObject.value.Position.z - pObject.value.OldPosition.z;

    if (dDeltaX <= EPSILONV && dDeltaX >= -EPSILONV && dDeltaY <= EPSILONV && dDeltaY >= -EPSILONV) {
      pObject.value.sConsecutiveZeroVelocityCollisions++;
    }

    if (pObject.value.sConsecutiveZeroVelocityCollisions > 3) {
      // We will continue with our Z velocity
      pObject.value.Velocity.x = 0;
      pObject.value.Velocity.y = 0;

      // Check that we are not colliding with structure z
      // if ( *piCollisionID == COLLISION_STRUCTURE_Z || *piCollisionID == COLLISION_ROOF )
      if (piCollisionID.value == Enum229.COLLISION_STRUCTURE_Z || piCollisionID.value == Enum229.COLLISION_ROOF || piCollisionID.value == Enum229.COLLISION_GROUND) {
        pObject.value.Velocity.z = 0;

        // Set us not alive!
        pObject.value.fAlive = false;
      }

      piCollisionID.value = Enum229.COLLISION_NONE;
    } else {
      // Set position back to before collision
      pObject.value.Position = VSetEqual(addressof(pObject.value.OldPosition));
      // Set old position!
      pObject.value.OldPosition.x = pObject.value.Position.y - dDeltaX;
      pObject.value.OldPosition.y = pObject.value.Position.x - dDeltaY;
      pObject.value.OldPosition.z = pObject.value.Position.z - dDeltaZ;

      PhysicsResolveCollision(pObject, addressof(pObject.value.CollisionVelocity), addressof(pObject.value.CollisionNormal), pObject.value.CollisionElasticity);
    }

    if (pObject.value.Position.z < 0) {
      pObject.value.Position.z = 0;
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
      if (pObject.value.sConsecutiveCollisions > 30) {
        pObject.value.fAlive = false;
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

function PhysicsDeleteObject(pObject: Pointer<REAL_OBJECT>): void {
  if (pObject.value.fAllocated) {
    if (pObject.value.pNode != null) {
      RemoveStructFromLevelNode(pObject.value.sLevelNodeGridNo, pObject.value.pNode);
    }

    if (pObject.value.pShadow != null) {
      RemoveShadowFromLevelNode(pObject.value.sLevelNodeGridNo, pObject.value.pShadow);
    }

    RemoveObjectSlot(pObject.value.iID);
  }
}

function PhysicsCheckForCollisions(pObject: Pointer<REAL_OBJECT>, piCollisionID: Pointer<INT32>): boolean {
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
  let usStructureID: UINT16;
  let dNormalX: FLOAT;
  let dNormalY: FLOAT;
  let dNormalZ: FLOAT;
  let sGridNo: INT16;

  // Checkf for collisions
  dX = pObject.value.Position.x;
  dY = pObject.value.Position.y;
  dZ = pObject.value.Position.z;

  vTemp.x = 0;
  vTemp.y = 0;
  vTemp.z = 0;

  dDeltaX = dX - pObject.value.OldPosition.x;
  dDeltaY = dY - pObject.value.OldPosition.y;
  dDeltaZ = dZ - pObject.value.OldPosition.z;

  // Round delta pos to nearest 0.01
  // dDeltaX = (float)( (int)dDeltaX * 100 ) / 100;
  // dDeltaY = (float)( (int)dDeltaY * 100 ) / 100;
  // dDeltaZ = (float)( (int)dDeltaZ * 100 ) / 100;

  // SKIP FIRST GRIDNO, WE'LL COLLIDE WITH OURSELVES....
  if (pObject.value.fTestObject != TEST_OBJECT_NO_COLLISIONS) {
    iCollisionCode = CheckForCollision(dX, dY, dZ, dDeltaX, dDeltaY, dDeltaZ, addressof(usStructureID), addressof(dNormalX), addressof(dNormalY), addressof(dNormalZ));
  } else if (pObject.value.fTestObject == TEST_OBJECT_NO_COLLISIONS) {
    iCollisionCode = Enum229.COLLISION_NONE;

    // Are we on a downward slope?
    if (dZ < pObject.value.TestZTarget && dDeltaZ < 0) {
      if (pObject.value.fTestPositionNotSet) {
        if (pObject.value.TestZTarget > 32) {
          pObject.value.fTestPositionNotSet = false;
          pObject.value.TestZTarget = 0;
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
  if (pObject.value.fTestObject == TEST_OBJECT_ANY_COLLISION) {
    if (iCollisionCode != Enum229.COLLISION_GROUND && iCollisionCode != Enum229.COLLISION_ROOF && iCollisionCode != Enum229.COLLISION_WATER && iCollisionCode != Enum229.COLLISION_NONE) {
      pObject.value.fTestEndedWithCollision = true;
      pObject.value.fAlive = false;
      return false;
    }
  }

  if (pObject.value.fTestObject == TEST_OBJECT_NOTWALLROOF_COLLISIONS) {
    // So we don't collide with ourselves.....
    if (iCollisionCode != Enum229.COLLISION_WATER && iCollisionCode != Enum229.COLLISION_GROUND && iCollisionCode != Enum229.COLLISION_NONE && iCollisionCode != Enum229.COLLISION_ROOF && iCollisionCode != Enum229.COLLISION_INTERIOR_ROOF && iCollisionCode != Enum229.COLLISION_WALL_SOUTHEAST && iCollisionCode != Enum229.COLLISION_WALL_SOUTHWEST && iCollisionCode != Enum229.COLLISION_WALL_NORTHEAST && iCollisionCode != Enum229.COLLISION_WALL_NORTHWEST) {
      if (pObject.value.fFirstTimeMoved || pObject.value.sFirstGridNo == pObject.value.sGridNo) {
        iCollisionCode = Enum229.COLLISION_NONE;
      }

      // If we are NOT a wall or window, ignore....
      if (pObject.value.uiNumTilesMoved < 4) {
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
          pObject.value.fTestEndedWithCollision = true;

          if (!pObject.value.fEndedWithCollisionPositionSet) {
            pObject.value.fEndedWithCollisionPositionSet = true;
            pObject.value.EndedWithCollisionPosition = VSetEqual(addressof(pObject.value.Position));
          }
          iCollisionCode = Enum229.COLLISION_NONE;
        } else {
          if (!pObject.value.fEndedWithCollisionPositionSet) {
            pObject.value.fEndedWithCollisionPositionSet = true;
            pObject.value.EndedWithCollisionPosition = VSetEqual(addressof(pObject.value.Position));
          }
        }
        break;

      case Enum229.COLLISION_ROOF:

        if (!pObject.value.fEndedWithCollisionPositionSet) {
          pObject.value.fEndedWithCollisionPositionSet = true;
          pObject.value.EndedWithCollisionPosition = VSetEqual(addressof(pObject.value.Position));
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
        pObject.value.fTestEndedWithCollision = true;
        break;
    }
  }

  if (pObject.value.fTestObject != TEST_OBJECT_NOTWALLROOF_COLLISIONS) {
    if (iCollisionCode != Enum229.COLLISION_WATER && iCollisionCode != Enum229.COLLISION_GROUND && iCollisionCode != Enum229.COLLISION_NONE && iCollisionCode != Enum229.COLLISION_ROOF && iCollisionCode != Enum229.COLLISION_INTERIOR_ROOF && iCollisionCode != Enum229.COLLISION_WALL_SOUTHEAST && iCollisionCode != Enum229.COLLISION_WALL_SOUTHWEST && iCollisionCode != Enum229.COLLISION_WALL_NORTHEAST && iCollisionCode != Enum229.COLLISION_WALL_NORTHWEST) {
      // So we don't collide with ourselves.....
      if (pObject.value.fFirstTimeMoved || pObject.value.sFirstGridNo == pObject.value.sGridNo) {
        iCollisionCode = Enum229.COLLISION_NONE;
      }

      // If we are NOT a wall or window, ignore....
      if (pObject.value.uiNumTilesMoved < 4) {
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
    if (pObject.value.iOldCollisionCode == iCollisionCode) {
      pObject.value.sConsecutiveCollisions++;
    } else {
      pObject.value.sConsecutiveCollisions = 1;
    }

    if (iCollisionCode == Enum229.COLLISION_WINDOW_NORTHWEST || iCollisionCode == Enum229.COLLISION_WINDOW_NORTHEAST || iCollisionCode == Enum229.COLLISION_WINDOW_SOUTHWEST || iCollisionCode == Enum229.COLLISION_WINDOW_SOUTHEAST) {
      if (!pObject.value.fTestObject) {
        // Break window!
        PhysicsDebugMsg(FormatString("Object %d: Collision Window", pObject.value.iID));

        sGridNo = MAPROWCOLTOPOS((pObject.value.Position.y / CELL_Y_SIZE), (pObject.value.Position.x / CELL_X_SIZE));

        ObjectHitWindow(sGridNo, usStructureID, false, true);
      }
      piCollisionID.value = Enum229.COLLISION_NONE;
      return false;
    }

    // ATE: IF detonate on impact, stop now!
    if (OBJECT_DETONATE_ON_IMPACT(pObject)) {
      pObject.value.fAlive = false;
      return true;
    }

    if (iCollisionCode == Enum229.COLLISION_GROUND) {
      vTemp.x = 0;
      vTemp.y = 0;
      vTemp.z = -1;

      pObject.value.fApplyFriction = true;
      // pObject->AppliedMu			= (float)(0.54 * TIME_MULTI );
      pObject.value.AppliedMu = (0.34 * TIME_MULTI);

      // dElasity = (float)1.5;
      dElasity = 1.3;

      fDoCollision = true;

      if (!pObject.value.fTestObject && !pObject.value.fHaveHitGround) {
        PlayJA2Sample(Enum330.THROW_IMPACT_2, RATE_11025, SoundVolume(MIDVOLUME, pObject.value.sGridNo), 1, SoundDir(pObject.value.sGridNo));
      }

      pObject.value.fHaveHitGround = true;
    } else if (iCollisionCode == Enum229.COLLISION_WATER) {
      let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
      let pNode: Pointer<ANITILE>;

      // Continue going...
      pObject.value.fApplyFriction = true;
      pObject.value.AppliedMu = (1.54 * TIME_MULTI);

      sGridNo = MAPROWCOLTOPOS((pObject.value.Position.y / CELL_Y_SIZE), (pObject.value.Position.x / CELL_X_SIZE));

      // Make thing unalive...
      pObject.value.fAlive = false;

      // If first time...
      if (pObject.value.fVisible) {
        if (pObject.value.fTestObject == NO_TEST_OBJECT) {
          // Make invisible
          pObject.value.fVisible = false;

          // JA25 CJC Oct 13 1999 - if node pointer is null don't try to set flags inside it!
          if (pObject.value.pNode) {
            pObject.value.pNode.value.uiFlags |= LEVELNODE_HIDDEN;
          }

          pObject.value.fInWater = true;

          // Make ripple
          memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
          AniParams.sGridNo = sGridNo;
          AniParams.ubLevelID = ANI_STRUCT_LEVEL;
          AniParams.usTileType = Enum313.THIRDMISS;
          AniParams.usTileIndex = Enum312.THIRDMISS1;
          AniParams.sDelay = 50;
          AniParams.sStartFrame = 0;
          AniParams.uiFlags = ANITILE_FORWARD;

          if (pObject.value.ubActionCode == Enum258.THROW_ARM_ITEM) {
            AniParams.ubKeyFrame1 = 11;
            AniParams.uiKeyFrame1Code = Enum311.ANI_KEYFRAME_CHAIN_WATER_EXPLOSION;
            AniParams.uiUserData = pObject.value.Obj.usItem;
            AniParams.ubUserData2 = pObject.value.ubOwner;
          }

          pNode = CreateAnimationTile(addressof(AniParams));

          // Adjust for absolute positioning
          pNode.value.pLevelNode.value.uiFlags |= LEVELNODE_USEABSOLUTEPOS;

          pNode.value.pLevelNode.value.sRelativeX = pObject.value.Position.x;
          pNode.value.pLevelNode.value.sRelativeY = pObject.value.Position.y;
          pNode.value.pLevelNode.value.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.value.Position.z);
        }
      }
    } else if (iCollisionCode == Enum229.COLLISION_ROOF || iCollisionCode == Enum229.COLLISION_INTERIOR_ROOF) {
      vTemp.x = 0;
      vTemp.y = 0;
      vTemp.z = -1;

      pObject.value.fApplyFriction = true;
      pObject.value.AppliedMu = (0.54 * TIME_MULTI);

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

      pObject.value.fApplyFriction = true;
      pObject.value.AppliedMu = (0.54 * TIME_MULTI);

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

      vIncident = VGetNormal(addressof(vIncident));

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
      pObject.value.CollisionNormal.x = vTemp.x;
      pObject.value.CollisionNormal.y = vTemp.y;
      pObject.value.CollisionNormal.z = vTemp.z;
      pObject.value.CollisionElasticity = dElasity;
      pObject.value.iOldCollisionCode = iCollisionCode;

      // Save collision velocity
      pObject.value.CollisionVelocity = VSetEqual(addressof(pObject.value.OldVelocity));

      if (pObject.value.fPotentialForDebug) {
        PhysicsDebugMsg(FormatString("Object %d: Collision %d", pObject.value.iID, iCollisionCode));
        PhysicsDebugMsg(FormatString("Object %d: Collision Normal %f %f %f", pObject.value.iID, vTemp.x, vTemp.y, vTemp.z));
        PhysicsDebugMsg(FormatString("Object %d: Collision OldPos %f %f %f", pObject.value.iID, pObject.value.Position.x, pObject.value.Position.y, pObject.value.Position.z));
        PhysicsDebugMsg(FormatString("Object %d: Collision Velocity %f %f %f", pObject.value.iID, pObject.value.CollisionVelocity.x, pObject.value.CollisionVelocity.y, pObject.value.CollisionVelocity.z));
      }

      pObject.value.fColliding = true;
    } else {
      pObject.value.fColliding = false;
      pObject.value.sConsecutiveCollisions = 0;
      pObject.value.sConsecutiveZeroVelocityCollisions = 0;
      pObject.value.fHaveHitGround = false;
    }
  }

  return fDoCollision;
}

function PhysicsResolveCollision(pObject: Pointer<REAL_OBJECT>, pVelocity: Pointer<vector_3>, pNormal: Pointer<vector_3>, CoefficientOfRestitution: FLOAT): void {
  let ImpulseNumerator: FLOAT;
  let Impulse: FLOAT;
  let vTemp: vector_3 = createVector3();

  ImpulseNumerator = -1 * CoefficientOfRestitution * VDotProduct(pVelocity, pNormal);

  Impulse = ImpulseNumerator;

  vTemp = VMultScalar(pNormal, Impulse);

  pObject.value.Velocity = VAdd(addressof(pObject.value.Velocity), addressof(vTemp));
}

function PhysicsMoveObject(pObject: Pointer<REAL_OBJECT>): boolean {
  let pNode: Pointer<LEVELNODE>;
  let sNewGridNo: INT16;
  let sTileIndex: INT16;
  let pTrav: Pointer<ETRLEObject>;
  let hVObject: HVOBJECT;

  // Determine new gridno
  sNewGridNo = MAPROWCOLTOPOS((pObject.value.Position.y / CELL_Y_SIZE), (pObject.value.Position.x / CELL_X_SIZE));

  if (pObject.value.fFirstTimeMoved) {
    pObject.value.fFirstTimeMoved = false;
    pObject.value.sFirstGridNo = sNewGridNo;
  }

  // CHECK FOR RANGE< IF INVALID, REMOVE!
  if (sNewGridNo == -1) {
    PhysicsDeleteObject(pObject);
    return false;
  }

  // Look at old gridno
  if (sNewGridNo != pObject.value.sGridNo || pObject.value.pNode == null) {
    if (pObject.value.fVisible) {
      if (CheckForCatchObject(pObject)) {
        pObject.value.fVisible = false;
      }
    }

    if (pObject.value.fVisible) {
      // Add smoke trails...
      if (pObject.value.Obj.usItem == Enum225.MORTAR_SHELL && pObject.value.uiNumTilesMoved > 2 && pObject.value.ubActionCode == Enum258.THROW_ARM_ITEM) {
        if (sNewGridNo != pObject.value.sGridNo) {
          let AniParams: ANITILE_PARAMS = createAnimatedTileParams();

          AniParams.sGridNo = sNewGridNo;
          AniParams.ubLevelID = ANI_STRUCT_LEVEL;
          AniParams.sDelay = (100 + PreRandom(100));
          AniParams.sStartFrame = 0;
          AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_ALWAYS_TRANSLUCENT;
          AniParams.sX = pObject.value.Position.x;
          AniParams.sY = pObject.value.Position.y;
          AniParams.sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.value.Position.z);

          AniParams.zCachedFile = "TILECACHE\\MSLE_SMK.STI";

          CreateAnimationTile(addressof(AniParams));
        }
      } else if (pObject.value.uiNumTilesMoved > 0) {
        if (sNewGridNo != pObject.value.sGridNo) {
          // We're at a new gridno!
          if (pObject.value.pNode != null) {
            RemoveStructFromLevelNode(pObject.value.sLevelNodeGridNo, pObject.value.pNode);
          }

          // We're at a new gridno!
          if (pObject.value.pShadow != null) {
            RemoveShadowFromLevelNode(pObject.value.sLevelNodeGridNo, pObject.value.pShadow);
          }

          // Now get graphic index
          sTileIndex = GetTileGraphicForItem(addressof(Item[pObject.value.Obj.usItem]));
          // sTileIndex = BULLETTILE1;

          // Set new gridno, add
          pNode = AddStructToTail(sNewGridNo, sTileIndex);
          pNode.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.value.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT | LEVELNODE_PHYSICSOBJECT | LEVELNODE_DYNAMIC);

          // Set levelnode
          pObject.value.pNode = pNode;

          // Add shadow
          AddShadowToHead(sNewGridNo, sTileIndex);
          pNode = gpWorldLevelData[sNewGridNo].pShadowHead;
          pNode.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          pNode.value.uiFlags |= (LEVELNODE_USEABSOLUTEPOS | LEVELNODE_IGNOREHEIGHT | LEVELNODE_PHYSICSOBJECT | LEVELNODE_DYNAMIC);

          // Set levelnode
          pObject.value.pShadow = pNode;

          pObject.value.sLevelNodeGridNo = sNewGridNo;
        }
      }
    } else {
      // Remove!
      if (pObject.value.pNode != null) {
        RemoveStructFromLevelNode(pObject.value.sLevelNodeGridNo, pObject.value.pNode);
      }

      // We're at a new gridno!
      if (pObject.value.pShadow != null) {
        RemoveShadowFromLevelNode(pObject.value.sLevelNodeGridNo, pObject.value.pShadow);
      }

      pObject.value.pNode = null;
      pObject.value.pShadow = null;
    }

    if (sNewGridNo != pObject.value.sGridNo) {
      pObject.value.uiNumTilesMoved++;
    }

    pObject.value.sGridNo = sNewGridNo;

    if (pObject.value.fPotentialForDebug) {
      PhysicsDebugMsg(FormatString("Object %d: uiNumTilesMoved: %d", pObject.value.iID, pObject.value.uiNumTilesMoved));
    }
  }

  if (pObject.value.fVisible) {
    if (pObject.value.Obj.usItem != Enum225.MORTAR_SHELL || pObject.value.ubActionCode != Enum258.THROW_ARM_ITEM) {
      if (pObject.value.pNode != null) {
        // OK, get offsets
        hVObject = gTileDatabase[pObject.value.pNode.value.usIndex].hTileSurface;
        pTrav = addressof(hVObject.value.pETRLEObject[gTileDatabase[pObject.value.pNode.value.usIndex].usRegionIndex]);

        // Add new object / update position
        // Update position data
        pObject.value.pNode.value.sRelativeX = pObject.value.Position.x; // + pTrav->sOffsetX;
        pObject.value.pNode.value.sRelativeY = pObject.value.Position.y; // + pTrav->sOffsetY;
        pObject.value.pNode.value.sRelativeZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.value.Position.z);

        // Update position data
        pObject.value.pShadow.value.sRelativeX = pObject.value.Position.x; // + pTrav->sOffsetX;
        pObject.value.pShadow.value.sRelativeY = pObject.value.Position.y; // + pTrav->sOffsetY;
        pObject.value.pShadow.value.sRelativeZ = gpWorldLevelData[pObject.value.sGridNo].sHeight;
      }
    }
  }

  return true;
}

function ObjectHitWindow(sGridNo: INT16, usStructureID: UINT16, fBlowWindowSouth: boolean, fLargeForce: boolean): void {
  let SWindowHit: EV_S_WINDOWHIT;
  SWindowHit.sGridNo = sGridNo;
  SWindowHit.usStructureID = usStructureID;
  SWindowHit.fBlowWindowSouth = fBlowWindowSouth;
  SWindowHit.fLargeForce = fLargeForce;
  // AddGameEvent( S_WINDOWHIT, 0, &SWindowHit );

  WindowHit(sGridNo, usStructureID, fBlowWindowSouth, fLargeForce);
}

function FindBestForceForTrajectory(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dzDegrees: FLOAT, pItem: Pointer<OBJECTTYPE>, psGridNo: Pointer<INT16>, pdMagForce: Pointer<FLOAT>): vector_3 {
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
  vDirNormal = VGetNormal(addressof(vDirNormal));

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

    dTestRange = CalculateObjectTrajectory(sEndZ, pItem, addressof(vPosition), addressof(vForce), psGridNo);

    // What's the diff?
    dTestDiff = dTestRange - dRange;

    // How have we done?
    // < 5% off...
    if (fabs((dTestDiff / dRange)) < .01) {
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

function FindFinalGridNoGivenDirectionGridNoForceAngle(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dForce: FLOAT, dzDegrees: FLOAT, pItem: Pointer<OBJECTTYPE>): INT16 {
  let vDirNormal: vector_3 = createVector3();
  let vPosition: vector_3 = createVector3();
  let vForce: vector_3 = createVector3();
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let dRange: FLOAT;
  let sEndGridNo: INT16;

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
  vDirNormal = VGetNormal(addressof(vDirNormal));

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dzDegrees);

  // Get range
  dRange = GetRangeInCellCoordsFromGridNoDiff(sGridNo, sSrcGridNo);

  // Now use a force
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  CalculateObjectTrajectory(sEndZ, pItem, addressof(vPosition), addressof(vForce), addressof(sEndGridNo));

  return sEndGridNo;
}

function FindBestAngleForTrajectory(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dForce: FLOAT, pItem: Pointer<OBJECTTYPE>, psGridNo: Pointer<INT16>): FLOAT {
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
  vDirNormal = VGetNormal(addressof(vDirNormal));

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

    dTestRange = CalculateObjectTrajectory(sEndZ, pItem, addressof(vPosition), addressof(vForce), psGridNo);

    // What's the diff?
    dTestDiff = dTestRange - dRange;

    // How have we done?
    // < 5% off...
    if (fabs((dTestDiff / dRange)) < .05) {
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
    if (fabs(dzDegrees) >= (Math.PI / 2) || fabs(dzDegrees) <= 0.005) {
      // Use 0.....
      dzDegrees = 0;
      // From degrees, calculate Z portion of normal
      vDirNormal.z = Math.sin(dzDegrees);
      // Now use a force
      vForce.x = dForce * vDirNormal.x;
      vForce.y = dForce * vDirNormal.y;
      vForce.z = dForce * vDirNormal.z;
      dTestRange = CalculateObjectTrajectory(sEndZ, pItem, addressof(vPosition), addressof(vForce), psGridNo);
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

function FindTrajectory(sSrcGridNo: INT16, sGridNo: INT16, sStartZ: INT16, sEndZ: INT16, dForce: FLOAT, dzDegrees: FLOAT, pItem: Pointer<OBJECTTYPE>, psGridNo: Pointer<INT16>): void {
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
  vDirNormal = VGetNormal(addressof(vDirNormal));

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dzDegrees);

  // Now use a force
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  CalculateObjectTrajectory(sEndZ, pItem, addressof(vPosition), addressof(vForce), psGridNo);
}

// OK, this will, given a target Z, INVTYPE, source, target gridnos, initial force vector, will
// return range

function CalculateObjectTrajectory(sTargetZ: INT16, pItem: Pointer<OBJECTTYPE>, vPosition: Pointer<vector_3>, vForce: Pointer<vector_3>, psFinalGridNo: Pointer<INT16>): FLOAT {
  let iID: INT32;
  let pObject: Pointer<REAL_OBJECT>;
  let dDiffX: FLOAT;
  let dDiffY: FLOAT;
  let sGridNo: INT16;

  if (psFinalGridNo) {
    (psFinalGridNo.value) = NOWHERE;
  }

  // OK, create a physics object....
  iID = CreatePhysicalObject(pItem, -1, vPosition.value.x, vPosition.value.y, vPosition.value.z, vForce.value.x, vForce.value.y, vForce.value.z, NOBODY, Enum258.NO_THROW_ACTION, 0);

  if (iID == -1) {
    return -1;
  }

  pObject = addressof(ObjectSlots[iID]);

  // Set some special values...
  pObject.value.fTestObject = TEST_OBJECT_NO_COLLISIONS;
  pObject.value.TestZTarget = sTargetZ;
  pObject.value.fTestPositionNotSet = true;
  pObject.value.fVisible = false;

  // Alrighty, move this beast until it dies....
  while (pObject.value.fAlive) {
    SimulateObject(pObject, DELTA_T);
  }

  // Calculate gridno from last position
  sGridNo = MAPROWCOLTOPOS((pObject.value.Position.y / CELL_Y_SIZE), (pObject.value.Position.x / CELL_X_SIZE));

  PhysicsDeleteObject(pObject);

  // get new x, y, z values
  dDiffX = (pObject.value.TestTargetPosition.x - vPosition.value.x);
  dDiffY = (pObject.value.TestTargetPosition.y - vPosition.value.y);

  if (psFinalGridNo) {
    (psFinalGridNo.value) = sGridNo;
  }

  return Math.sqrt((dDiffX * dDiffX) + (dDiffY * dDiffY));
}

function ChanceToGetThroughObjectTrajectory(sTargetZ: INT16, pItem: Pointer<OBJECTTYPE>, vPosition: Pointer<vector_3>, vForce: Pointer<vector_3>, psNewGridNo: Pointer<INT16>, pbLevel: Pointer<INT8>, fFromUI: boolean): INT32 {
  let iID: INT32;
  let pObject: Pointer<REAL_OBJECT>;

  // OK, create a physics object....
  iID = CreatePhysicalObject(pItem, -1, vPosition.value.x, vPosition.value.y, vPosition.value.z, vForce.value.x, vForce.value.y, vForce.value.z, NOBODY, Enum258.NO_THROW_ACTION, 0);

  if (iID == -1) {
    return -1;
  }

  pObject = addressof(ObjectSlots[iID]);

  // Set some special values...
  pObject.value.fTestObject = TEST_OBJECT_NOTWALLROOF_COLLISIONS;
  pObject.value.fTestPositionNotSet = true;
  pObject.value.TestZTarget = sTargetZ;
  pObject.value.fVisible = false;
  // pObject->fPotentialForDebug = TRUE;

  // Alrighty, move this beast until it dies....
  while (pObject.value.fAlive) {
    SimulateObject(pObject, DELTA_T);
  }

  if (psNewGridNo != null) {
    // Calculate gridno from last position

    // If NOT from UI, use exact collision position
    if (fFromUI) {
      (psNewGridNo.value) = MAPROWCOLTOPOS((pObject.value.Position.y / CELL_Y_SIZE), (pObject.value.Position.x / CELL_X_SIZE));
    } else {
      (psNewGridNo.value) = MAPROWCOLTOPOS((pObject.value.EndedWithCollisionPosition.y / CELL_Y_SIZE), (pObject.value.EndedWithCollisionPosition.x / CELL_X_SIZE));
    }

    (pbLevel.value) = GET_OBJECT_LEVEL(pObject.value.EndedWithCollisionPosition.z - CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[(psNewGridNo.value)].sHeight));
  }

  PhysicsDeleteObject(pObject);

  // See If we collided
  if (pObject.value.fTestEndedWithCollision) {
    return 0;
  }
  return 100;
}

export function CalculateLaunchItemAngle(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubHeight: UINT8, dForce: FLOAT, pItem: Pointer<OBJECTTYPE>, psGridNo: Pointer<INT16>): FLOAT {
  let dAngle: FLOAT;
  let sSrcX: INT16;
  let sSrcY: INT16;

  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(pSoldier.value.sGridNo));

  dAngle = FindBestAngleForTrajectory(pSoldier.value.sGridNo, sGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.value.bLevel), ubHeight, dForce, pItem, psGridNo);

  // new we have defaut angle value...
  return dAngle;
}

function CalculateLaunchItemBasicParams(pSoldier: Pointer<SOLDIERTYPE>, pItem: Pointer<OBJECTTYPE>, sGridNo: INT16, ubLevel: UINT8, sEndZ: INT16, pdMagForce: Pointer<FLOAT>, pdDegrees: Pointer<FLOAT>, psFinalGridNo: Pointer<INT16>, fArmed: boolean): void {
  let sInterGridNo: INT16;
  let sStartZ: INT16;
  let dMagForce: FLOAT;
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
  sStartZ = GET_SOLDIER_THROW_HEIGHT(pSoldier.value.bLevel);

  // Are we armed, and are we throwing a LAUNCHABLE?

  usLauncher = GetLauncherFromLaunchable(pItem.value.usItem);

  if (fArmed && (usLauncher == Enum225.MORTAR || pItem.value.usItem == Enum225.MORTAR)) {
    // Start at 0....
    sStartZ = (pSoldier.value.bLevel * 256);
    fMortar = true;
    sMinRange = MIN_MORTAR_RANGE;
    // fLauncher = TRUE;
  }

  if (fArmed && (usLauncher == Enum225.GLAUNCHER || usLauncher == Enum225.UNDER_GLAUNCHER || pItem.value.usItem == Enum225.GLAUNCHER || pItem.value.usItem == Enum225.UNDER_GLAUNCHER)) {
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

  if ((IsRoofPresentAtGridno(pSoldier.value.sGridNo)) && pSoldier.value.bLevel == 0) {
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
    FindBestForceForTrajectory(pSoldier.value.sGridNo, sGridNo, sStartZ, sEndZ, dDegrees, pItem, psFinalGridNo, addressof(dMagForce));

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
      dMinForce = CalculateForceFromRange((sMinRange / 10), (Math.PI / 4));

      if (dMagForce < dMinForce) {
        dMagForce = dMinForce;
      }
    }

    if (fThroughIntermediateGridNo) {
      // Given this power, now try and go through this window....
      dDegrees = FindBestAngleForTrajectory(pSoldier.value.sGridNo, sInterGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.value.bLevel), 150, dMagForce, pItem, psFinalGridNo);
    }
  } else {
    // Use MAX force, vary angle....
    dMagForce = CalculateSoldierMaxForce(pSoldier, dDegrees, pItem, fArmed);

    if (ubLevel == 0) {
      dMagForce = (dMagForce * 1.25);
    }

    FindTrajectory(pSoldier.value.sGridNo, sGridNo, sStartZ, sEndZ, dMagForce, dDegrees, pItem, psFinalGridNo);

    if (ubLevel == 1 && !fThroughIntermediateGridNo) {
      // Is there a guy here...?
      if (WhoIsThere2(sGridNo, ubLevel) != NO_SOLDIER) {
        dMagForce = (dMagForce * 0.85);

        // Yep, try to get angle...
        dNewDegrees = FindBestAngleForTrajectory(pSoldier.value.sGridNo, sGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.value.bLevel), 150, dMagForce, pItem, psFinalGridNo);

        if (dNewDegrees != 0) {
          dDegrees = dNewDegrees;
        }
      }
    }

    if (fThroughIntermediateGridNo) {
      dDegrees = FindBestAngleForTrajectory(pSoldier.value.sGridNo, sInterGridNo, GET_SOLDIER_THROW_HEIGHT(pSoldier.value.bLevel), 150, dMagForce, pItem, psFinalGridNo);
    }
  }

  (pdMagForce.value) = dMagForce;
  (pdDegrees.value) = dDegrees;
}

export function CalculateLaunchItemChanceToGetThrough(pSoldier: Pointer<SOLDIERTYPE>, pItem: Pointer<OBJECTTYPE>, sGridNo: INT16, ubLevel: UINT8, sEndZ: INT16, psFinalGridNo: Pointer<INT16>, fArmed: boolean, pbLevel: Pointer<INT8>, fFromUI: boolean): boolean {
  let dForce: FLOAT;
  let dDegrees: FLOAT;
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let vForce: vector_3 = createVector3();
  let vPosition: vector_3 = createVector3();
  let vDirNormal: vector_3 = createVector3();

  // Ge7t basic launch params...
  CalculateLaunchItemBasicParams(pSoldier, pItem, sGridNo, ubLevel, sEndZ, addressof(dForce), addressof(dDegrees), psFinalGridNo, fArmed);

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(pSoldier.value.sGridNo));

  // Set position
  vPosition.x = sSrcX;
  vPosition.y = sSrcY;
  vPosition.z = GET_SOLDIER_THROW_HEIGHT(pSoldier.value.bLevel);

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(addressof(vDirNormal));

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dDegrees);

  // Do force....
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  // OK, we have our force, calculate change to get through without collide
  if (ChanceToGetThroughObjectTrajectory(sEndZ, pItem, addressof(vPosition), addressof(vForce), psFinalGridNo, pbLevel, fFromUI) == 0) {
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
  let dMagForce: FLOAT;
  let sSrcGridNo: INT16;
  let sDestGridNo: INT16;
  let Object: OBJECTTYPE = createObjectType();
  let sFinalGridNo: INT16;

  // OK, use a fake gridno, find the new gridno based on range, use height of merc, end height of ground,
  // 45 degrees
  sSrcGridNo = 4408;
  sDestGridNo = 4408 + (sRange * WORLD_COLS);

  // Use a grenade objecttype
  CreateItem(Enum225.HAND_GRENADE, 100, addressof(Object));

  FindBestForceForTrajectory(sSrcGridNo, sDestGridNo, GET_SOLDIER_THROW_HEIGHT(0), 0, dDegrees, addressof(Object), addressof(sFinalGridNo), addressof(dMagForce));

  return dMagForce;
}

function CalculateSoldierMaxForce(pSoldier: Pointer<SOLDIERTYPE>, dDegrees: FLOAT, pItem: Pointer<OBJECTTYPE>, fArmed: boolean): FLOAT {
  let uiMaxRange: INT32;
  let dMagForce: FLOAT;

  dDegrees = (Math.PI / 4);

  uiMaxRange = CalcMaxTossRange(pSoldier, pItem.value.usItem, fArmed);

  dMagForce = CalculateForceFromRange(uiMaxRange, dDegrees);

  return dMagForce;
}

const MAX_MISS_BY = 30;
const MIN_MISS_BY = 1;
const MAX_MISS_RADIUS = 5;

export function CalculateLaunchItemParamsForThrow(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubLevel: UINT8, sEndZ: INT16, pItem: Pointer<OBJECTTYPE>, bMissBy: INT8, ubActionCode: UINT8, uiActionData: UINT32): void {
  let dForce: FLOAT;
  let dDegrees: FLOAT;
  let sDestX: INT16;
  let sDestY: INT16;
  let sSrcX: INT16;
  let sSrcY: INT16;
  let vForce: vector_3 = createVector3();
  let vDirNormal: vector_3 = createVector3();
  let sFinalGridNo: INT16;
  let fArmed: boolean = false;
  let usLauncher: UINT16;
  let sStartZ: INT16;
  let bMinMissRadius: INT8;
  let bMaxMissRadius: INT8;
  let bMaxRadius: INT8;
  let fScale: FLOAT;

  // Set target ID if anyone
  pSoldier.value.ubTargetID = WhoIsThere2(sGridNo, ubLevel);

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
    if (PythSpacesAway(sGridNo, pSoldier.value.sGridNo) < (bMaxRadius / 1.5)) {
      bMaxRadius = PythSpacesAway(sGridNo, pSoldier.value.sGridNo) / 2;
    }

    // Get radius
    fScale = (bMissBy / MAX_MISS_BY);

    bMaxMissRadius = (bMaxRadius * fScale);

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
  CalculateLaunchItemBasicParams(pSoldier, pItem, sGridNo, ubLevel, sEndZ, addressof(dForce), addressof(dDegrees), addressof(sFinalGridNo), fArmed);

  // Get XY from gridno
  ({ sX: sDestX, sY: sDestY } = ConvertGridNoToCenterCellXY(sGridNo));
  ({ sX: sSrcX, sY: sSrcY } = ConvertGridNoToCenterCellXY(pSoldier.value.sGridNo));

  // OK, get direction normal
  vDirNormal.x = (sDestX - sSrcX);
  vDirNormal.y = (sDestY - sSrcY);
  vDirNormal.z = 0;

  // NOmralize
  vDirNormal = VGetNormal(addressof(vDirNormal));

  // From degrees, calculate Z portion of normal
  vDirNormal.z = Math.sin(dDegrees);

  // Do force....
  vForce.x = dForce * vDirNormal.x;
  vForce.y = dForce * vDirNormal.y;
  vForce.z = dForce * vDirNormal.z;

  // Allocate Throw Parameters
  pSoldier.value.pThrowParams = MemAlloc(sizeof(THROW_PARAMS));
  memset(pSoldier.value.pThrowParams, 0, sizeof(THROW_PARAMS));

  pSoldier.value.pTempObject = MemAlloc(sizeof(OBJECTTYPE));

  memcpy(pSoldier.value.pTempObject, pItem, sizeof(OBJECTTYPE));
  pSoldier.value.pThrowParams.value.dX = sSrcX;
  pSoldier.value.pThrowParams.value.dY = sSrcY;

  sStartZ = GET_SOLDIER_THROW_HEIGHT(pSoldier.value.bLevel);
  usLauncher = GetLauncherFromLaunchable(pItem.value.usItem);
  if (fArmed && usLauncher == Enum225.MORTAR) {
    // Start at 0....
    sStartZ = (pSoldier.value.bLevel * 256) + 50;
  }

  pSoldier.value.pThrowParams.value.dZ = sStartZ;
  pSoldier.value.pThrowParams.value.dForceX = vForce.x;
  pSoldier.value.pThrowParams.value.dForceY = vForce.y;
  pSoldier.value.pThrowParams.value.dForceZ = vForce.z;
  pSoldier.value.pThrowParams.value.dLifeSpan = -1;
  pSoldier.value.pThrowParams.value.ubActionCode = ubActionCode;
  pSoldier.value.pThrowParams.value.uiActionData = uiActionData;

  // Dirty interface
  DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
}

function CheckForCatcher(pObject: Pointer<REAL_OBJECT>, usStructureID: UINT16): boolean {
  // Do we want to catch?
  if (pObject.value.fTestObject == NO_TEST_OBJECT) {
    if (pObject.value.ubActionCode == Enum258.THROW_TARGET_MERC_CATCH) {
      // Is it a guy?
      if (usStructureID < INVALID_STRUCTURE_ID) {
        // Is it the same guy?
        if (usStructureID == pObject.value.uiActionData) {
          if (DoCatchObject(pObject)) {
            pObject.value.fAlive = false;
            return true;
          }
        }
      }
    }
  }
  return false;
}

function CheckForObjectHittingMerc(pObject: Pointer<REAL_OBJECT>, usStructureID: UINT16): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sDamage: INT16;
  let sBreath: INT16;

  // Do we want to catch?
  if (pObject.value.fTestObject == NO_TEST_OBJECT) {
    // Is it a guy?
    if (usStructureID < INVALID_STRUCTURE_ID) {
      if (pObject.value.ubLastTargetTakenDamage != usStructureID) {
        pSoldier = MercPtrs[usStructureID];

        sDamage = 1;
        sBreath = 0;

        EVENT_SoldierGotHit(pSoldier, NOTHING, sDamage, sBreath, pSoldier.value.bDirection, 0, pObject.value.ubOwner, FIRE_WEAPON_TOSSED_OBJECT_SPECIAL, 0, 0, NOWHERE);

        pObject.value.ubLastTargetTakenDamage = (usStructureID);
      }
    }
  }
}

function CheckForCatchObject(pObject: Pointer<REAL_OBJECT>): boolean {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiSpacesAway: UINT32;

  // Do we want to catch?
  if (pObject.value.fTestObject == NO_TEST_OBJECT) {
    if (pObject.value.ubActionCode == Enum258.THROW_TARGET_MERC_CATCH) {
      pSoldier = MercPtrs[pObject.value.uiActionData];

      // Is it a guy?
      // Are we close to this guy?
      uiSpacesAway = PythSpacesAway(pObject.value.sGridNo, pSoldier.value.sGridNo);

      if (uiSpacesAway < 4 && !pObject.value.fAttemptedCatch) {
        if (pSoldier.value.usAnimState != Enum193.CATCH_STANDING && pSoldier.value.usAnimState != Enum193.CATCH_CROUCHED && pSoldier.value.usAnimState != Enum193.LOWER_RIFLE) {
          if (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CATCH_STANDING, 0, false);
          } else if (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_CROUCH) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.CATCH_CROUCHED, 0, false);
          }

          pObject.value.fCatchAnimOn = true;
        }
      }

      pObject.value.fAttemptedCatch = true;

      if (uiSpacesAway <= 1 && !pObject.value.fCatchCheckDone) {
        if (AttemptToCatchObject(pObject)) {
          return true;
        }
      }
    }
  }
  return false;
}

function AttemptToCatchObject(pObject: Pointer<REAL_OBJECT>): boolean {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubChanceToCatch: UINT8;

  // Get intended target
  pSoldier = MercPtrs[pObject.value.uiActionData];

  // OK, get chance to catch
  // base it on...? CC? Dexterity?
  ubChanceToCatch = 50 + EffectiveDexterity(pSoldier) / 2;

  pObject.value.fCatchCheckDone = true;

  if (PreRandom(100) > ubChanceToCatch) {
    return false;
  }

  pObject.value.fCatchGood = true;

  return true;
}

function DoCatchObject(pObject: Pointer<REAL_OBJECT>): boolean {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fGoodCatch: boolean = false;
  let usItem: UINT16;

  // Get intended target
  pSoldier = MercPtrs[pObject.value.uiActionData];

  // Catch anim.....
  switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
    case ANIM_STAND:

      pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CATCH, 0, false);
      break;

    case ANIM_CROUCH:

      pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.END_CROUCH_CATCH, 0, false);
      break;
  }

  PlayJA2Sample(Enum330.CATCH_OBJECT, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));

  pObject.value.fCatchAnimOn = false;

  if (!pObject.value.fCatchGood) {
    return false;
  }

  // Get item
  usItem = pObject.value.Obj.usItem;

  // Transfer object
  fGoodCatch = AutoPlaceObject(pSoldier, addressof(pObject.value.Obj), true);

  // Report success....
  if (fGoodCatch) {
    pObject.value.fDropItem = false;

    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_MERC_CAUGHT_ITEM], pSoldier.value.name, ShortItemNames[usItem]);
  }

  return true;
}

//#define TESTDUDEXPLOSIVES

function HandleArmedObjectImpact(pObject: Pointer<REAL_OBJECT>): void {
  let sZ: INT16;
  let fDoImpact: boolean = false;
  let fCheckForDuds: boolean = false;
  let pObj: Pointer<OBJECTTYPE>;
  let iTrapped: INT32 = 0;
  let usFlags: UINT16 = 0;
  let bLevel: INT8 = 0;

  // Calculate pixel position of z
  sZ = CONVERT_HEIGHTUNITS_TO_PIXELS((pObject.value.Position.z)) - gpWorldLevelData[pObject.value.sGridNo].sHeight;

  // get OBJECTTYPE
  pObj = addressof(pObject.value.Obj);

  // ATE: Make sure number of objects is 1...
  pObj.value.ubNumberOfObjects = 1;

  if (Item[pObj.value.usItem].usItemClass & IC_GRENADE) {
    fCheckForDuds = true;
  }

  if (pObj.value.usItem == Enum225.MORTAR_SHELL) {
    fCheckForDuds = true;
  }

  if (Item[pObj.value.usItem].usItemClass & IC_THROWN) {
    AddItemToPool(pObject.value.sGridNo, pObj, INVISIBLE, bLevel, usFlags, 0);
  }

  if (fCheckForDuds) {
    // If we landed on anything other than the floor, always! go off...
    if (sZ != 0 || pObject.value.fInWater || (pObj.value.bStatus[0] >= USABLE && (PreRandom(100) < pObj.value.bStatus[0] + PreRandom(50))))
    {
      fDoImpact = true;
    } else // didn't go off!
    {
      if (pObj.value.bStatus[0] >= USABLE && PreRandom(100) < pObj.value.bStatus[0] + PreRandom(50))
      {
        iTrapped = PreRandom(4) + 2;
      }

      if (iTrapped) {
        // Start timed bomb...
        usFlags |= WORLD_ITEM_ARMED_BOMB;

        pObj.value.bDetonatorType = Enum224.BOMB_TIMED;
        pObj.value.bDelay = (1 + PreRandom(2));
      }

      // ATE: If we have collided with roof last...
      if (pObject.value.iOldCollisionCode == Enum229.COLLISION_ROOF) {
        bLevel = 1;
      }

      // Add item to pool....
      AddItemToPool(pObject.value.sGridNo, pObj, INVISIBLE, bLevel, usFlags, 0);

      // All teams lok for this...
      NotifySoldiersToLookforItems();

      if (pObject.value.ubOwner != NOBODY) {
        DoMercBattleSound(MercPtrs[pObject.value.ubOwner], (Enum259.BATTLE_SOUND_CURSE1));
      }
    }
  } else {
    fDoImpact = true;
  }

  if (fDoImpact) {
    if (pObject.value.Obj.usItem == Enum225.BREAK_LIGHT) {
      // Add a light effect...
      NewLightEffect(pObject.value.sGridNo, Enum305.LIGHT_FLARE_MARK_1);
    } else if (Item[pObject.value.Obj.usItem].usItemClass & IC_GRENADE) {
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

      IgniteExplosion(pObject.value.ubOwner, pObject.value.Position.x, pObject.value.Position.y, sZ, pObject.value.sGridNo, pObject.value.Obj.usItem, GET_OBJECT_LEVEL(pObject.value.Position.z - CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.value.sGridNo].sHeight)));
    } else if (pObject.value.Obj.usItem == Enum225.MORTAR_SHELL) {
      sZ = CONVERT_HEIGHTUNITS_TO_PIXELS(pObject.value.Position.z);

      IgniteExplosion(pObject.value.ubOwner, pObject.value.Position.x, pObject.value.Position.y, sZ, pObject.value.sGridNo, pObject.value.Obj.usItem, GET_OBJECT_LEVEL(pObject.value.Position.z - CONVERT_PIXELS_TO_HEIGHTUNITS(gpWorldLevelData[pObject.value.sGridNo].sHeight)));
    }
  }
}

export function SavePhysicsTableToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let usCnt: UINT16 = 0;
  let usPhysicsCount: UINT32 = 0;

  for (usCnt = 0; usCnt < NUM_OBJECT_SLOTS; usCnt++) {
    // if the REAL_OBJECT is active, save it
    if (ObjectSlots[usCnt].fAllocated) {
      usPhysicsCount++;
    }
  }

  // Save the number of REAL_OBJECTs in the array
  FileWrite(hFile, addressof(usPhysicsCount), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return false;
  }

  if (usPhysicsCount != 0) {
    for (usCnt = 0; usCnt < NUM_OBJECT_SLOTS; usCnt++) {
      // if the REAL_OBJECT is active, save it
      if (ObjectSlots[usCnt].fAllocated) {
        // Save the the REAL_OBJECT structure
        FileWrite(hFile, addressof(ObjectSlots[usCnt]), sizeof(REAL_OBJECT), addressof(uiNumBytesWritten));
        if (uiNumBytesWritten != sizeof(REAL_OBJECT)) {
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

  // make sure the objects are not allocated
  memset(ObjectSlots, 0, NUM_OBJECT_SLOTS * sizeof(REAL_OBJECT));

  // Load the number of REAL_OBJECTs in the array
  FileRead(hFile, addressof(guiNumObjectSlots), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return false;
  }

  // loop through and add the objects
  for (usCnt = 0; usCnt < guiNumObjectSlots; usCnt++) {
    // Load the the REAL_OBJECT structure
    FileRead(hFile, addressof(ObjectSlots[usCnt]), sizeof(REAL_OBJECT), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(REAL_OBJECT)) {
      return false;
    }

    ObjectSlots[usCnt].pNode = null;
    ObjectSlots[usCnt].pShadow = null;
    ObjectSlots[usCnt].iID = usCnt;
  }

  return true;
}

function RandomGridFromRadius(sSweetGridNo: INT16, ubMinRadius: INT8, ubMaxRadius: INT8): UINT16 {
  let sX: INT16;
  let sY: INT16;
  let sGridNo: INT16;
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

    leftmost = ((sSweetGridNo + (WORLD_COLS * sY)) / WORLD_COLS) * WORLD_COLS;

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
