namespace ja2 {

const NUM_LIGHT_EFFECT_SLOTS = 25;

// GLOBAL FOR LIGHT LISTING
let gLightEffectData: LIGHTEFFECT[] /* [NUM_LIGHT_EFFECT_SLOTS] */ = createArrayFrom(NUM_LIGHT_EFFECT_SLOTS, createLightEffect);
let guiNumLightEffects: UINT32 = 0;

function GetFreeLightEffect(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
    if ((gLightEffectData[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumLightEffects < NUM_LIGHT_EFFECT_SLOTS)
    return guiNumLightEffects++;

  return -1;
}

function RecountLightEffects(): void {
  let uiCount: INT32;

  for (uiCount = guiNumLightEffects - 1; (uiCount >= 0); uiCount--) {
    if ((gLightEffectData[uiCount].fAllocated)) {
      guiNumLightEffects = (uiCount + 1);
      break;
    }
  }
}

function UpdateLightingSprite(pLight: LIGHTEFFECT): void {
  let LightName: string /* CHAR8[20] */;
  // Build light....

  LightName = sprintf("Light%d", pLight.bRadius);

  // Delete old one if one exists...
  if (pLight.iLight != (-1)) {
    LightSpriteDestroy(pLight.iLight);
    pLight.iLight = -1;
  }

  // Effect light.....
  if ((pLight.iLight = LightSpriteCreate(LightName, 0)) == (-1)) {
    // Could not light!
    return;
  }

  LightSpritePower(pLight.iLight, true);
  //	LightSpriteFake( pLight->iLight );
  LightSpritePosition(pLight.iLight, Math.trunc(CenterX(pLight.sGridNo) / CELL_X_SIZE), Math.trunc(CenterY(pLight.sGridNo) / CELL_Y_SIZE));
}

export function NewLightEffect(sGridNo: INT16, bType: INT8): INT32 {
  let pLight: LIGHTEFFECT;
  let iLightIndex: INT32;
  let ubDuration: UINT8 = 0;
  let ubStartRadius: UINT8 = 0;

  if ((iLightIndex = GetFreeLightEffect()) == (-1))
    return -1;

  resetLightEffect(gLightEffectData[iLightIndex]);

  pLight = gLightEffectData[iLightIndex];

  // Set some values...
  pLight.sGridNo = sGridNo;
  pLight.bType = bType;
  pLight.iLight = -1;
  pLight.uiTimeOfLastUpdate = GetWorldTotalSeconds();

  switch (bType) {
    case Enum305.LIGHT_FLARE_MARK_1:

      ubDuration = 6;
      ubStartRadius = 6;
      break;
  }

  pLight.ubDuration = ubDuration;
  pLight.bRadius = ubStartRadius;
  pLight.bAge = 0;
  pLight.fAllocated = true;

  UpdateLightingSprite(pLight);

  // Handle sight here....
  AllTeamsLookForAll(false);

  return iLightIndex;
}

function RemoveLightEffectFromTile(sGridNo: INT16): void {
  let pLight: LIGHTEFFECT;
  let cnt: UINT32;

  // Set to unallocated....
  for (cnt = 0; cnt < guiNumLightEffects; cnt++) {
    pLight = gLightEffectData[cnt];

    if (pLight.fAllocated) {
      if (pLight.sGridNo == sGridNo) {
        pLight.fAllocated = false;

        // Remove light....
        if (pLight.iLight != (-1)) {
          LightSpriteDestroy(pLight.iLight);
        }
        break;
      }
    }
  }
}

export function DecayLightEffects(uiTime: UINT32): void {
  let pLight: LIGHTEFFECT;
  let cnt: UINT32;
  let cnt2: UINT32;
  let fDelete: boolean = false;
  let usNumUpdates: UINT16 = 1;

  // age all active tear gas clouds, deactivate those that are just dispersing
  for (cnt = 0; cnt < guiNumLightEffects; cnt++) {
    pLight = gLightEffectData[cnt];

    fDelete = false;

    if (pLight.fAllocated) {
      // ATE: Do this every so ofte, to acheive the effect we want...
      if ((uiTime - pLight.uiTimeOfLastUpdate) > 350) {
        usNumUpdates = Math.trunc((uiTime - pLight.uiTimeOfLastUpdate) / 350);

        pLight.uiTimeOfLastUpdate = uiTime;

        for (cnt2 = 0; cnt2 < usNumUpdates; cnt2++) {
          pLight.bAge++;

          // if this cloud remains effective (duration not reached)
          if (pLight.bAge < pLight.ubDuration) {
            // calculate the new cloud radius
            // cloud expands by 1 every turn outdoors, and every other turn indoors
            if ((pLight.bAge % 2)) {
              pLight.bRadius--;
            }

            if (pLight.bRadius == 0) {
              // Delete...
              fDelete = true;
              break;
            } else {
              UpdateLightingSprite(pLight);
            }
          } else {
            fDelete = true;
            break;
          }
        }

        if (fDelete) {
          pLight.fAllocated = false;

          if (pLight.iLight != (-1)) {
            LightSpriteDestroy(pLight.iLight);
          }
        }

        // Handle sight here....
        AllTeamsLookForAll(false);
      }
    }
  }
}

export function SaveLightEffectsToSaveGameFile(hFile: HWFILE): boolean {
  /*
  UINT32	uiNumBytesWritten;
  UINT32	uiNumberOfLights=0;
  UINT32	uiCnt;

  //loop through and count the number of active slots
  for( uiCnt=0; uiCnt<guiNumLightEffects; uiCnt++)
  {
          if( gLightEffectData[ uiCnt ].fAllocated )
          {
                  uiNumberOfLights++;
          }
  }

  //Save the Number of Light Effects
  FileWrite( hFile, &uiNumberOfLights, sizeof( UINT32 ), &uiNumBytesWritten );
  if( uiNumBytesWritten != sizeof( UINT32 ) )
  {
          return( FALSE );
  }


  //if there are lights to save
  if( uiNumberOfLights != 0 )
  {
          //loop through and save each active slot
          for( uiCnt=0; uiCnt < guiNumLightEffects; uiCnt++)
          {
                  if( gLightEffectData[ uiCnt ].fAllocated )
                  {
                          //Save the Light effect Data
                          FileWrite( hFile, &gLightEffectData[ uiCnt ], sizeof( LIGHTEFFECT ), &uiNumBytesWritten );
                          if( uiNumBytesWritten != sizeof( LIGHTEFFECT ) )
                          {
                                  return( FALSE );
                          }
                  }
          }
  }
*/
  return true;
}

export function LoadLightEffectsFromLoadGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let uiCount: UINT32;
  let buffer: Buffer;

  // no longer need to load Light effects.  They are now in temp files
  if (guiSaveGameVersion < 76) {
    gLightEffectData.forEach(resetLightEffect);

    // Load the Number of Light Effects
    buffer = Buffer.allocUnsafe(4);
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      return false;
    }

    guiNumLightEffects = buffer.readUInt32LE(0);

    // if there are lights saved.
    if (guiNumLightEffects != 0) {
      // loop through and apply the light effects to the map
      buffer = Buffer.allocUnsafe(LIGHT_EFFECT_SIZE);
      for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
        // Load the Light effect Data
        uiNumBytesRead = FileRead(hFile, buffer, LIGHT_EFFECT_SIZE);
        if (uiNumBytesRead != LIGHT_EFFECT_SIZE) {
          return false;
        }

        readLightEffect(gLightEffectData[uiCount], buffer);
      }
    }

    // loop through and apply the light effects to the map
    for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
      if (gLightEffectData[uiCount].fAllocated)
        UpdateLightingSprite(gLightEffectData[uiCount]);
    }
  }

  return true;
}

export function SaveLightEffectsToMapTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let uiNumLightEffects: UINT32 = 0;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  let zMapName: string /* CHAR8[128] */;
  let uiCnt: UINT32;
  let buffer: Buffer;

  // get the name of the map
  zMapName = GetMapTempFileName(SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // delete file the file.
  FileDelete(zMapName);

  // loop through and count the number of Light effects
  for (uiCnt = 0; uiCnt < guiNumLightEffects; uiCnt++) {
    if (gLightEffectData[uiCnt].fAllocated)
      uiNumLightEffects++;
  }

  // if there are no Light effects
  if (uiNumLightEffects == 0) {
    // set the fact that there are no Light effects for this sector
    ReSetSectorFlag(sMapX, sMapY, bMapZ, SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS);

    return true;
  }

  // Open the file for writing
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Save the Number of Light Effects
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumLightEffects, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    // Close the file
    FileClose(hFile);

    return false;
  }

  // loop through and save the number of Light effects
  buffer = Buffer.allocUnsafe(LIGHT_EFFECT_SIZE);
  for (uiCnt = 0; uiCnt < guiNumLightEffects; uiCnt++) {
    // if the Light is active
    if (gLightEffectData[uiCnt].fAllocated) {
      // Save the Light effect Data
      writeLightEffect(gLightEffectData[uiCnt], buffer);
      uiNumBytesWritten = FileWrite(hFile, buffer, LIGHT_EFFECT_SIZE);
      if (uiNumBytesWritten != LIGHT_EFFECT_SIZE) {
        // Close the file
        FileClose(hFile);

        return false;
      }
    }
  }

  // Close the file
  FileClose(hFile);

  SetSectorFlag(sMapX, sMapY, bMapZ, SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS);

  return true;
}

export function LoadLightEffectsFromMapTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let uiNumBytesRead: UINT32;
  let uiCount: UINT32;
  let uiCnt: UINT32 = 0;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  let zMapName: string /* CHAR8[128] */;
  let buffer: Buffer;

  zMapName = GetMapTempFileName(SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Open the file for reading, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening file
    return false;
  }

  // Clear out the old list
  ResetLightEffects();

  // Load the Number of Light Effects
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hFile);
    return false;
  }

  guiNumLightEffects = buffer.readUInt32LE(0);

  // loop through and load the list
  buffer = Buffer.allocUnsafe(LIGHT_EFFECT_SIZE);
  for (uiCnt = 0; uiCnt < guiNumLightEffects; uiCnt++) {
    // Load the Light effect Data
    uiNumBytesRead = FileRead(hFile, buffer, LIGHT_EFFECT_SIZE);
    if (uiNumBytesRead != LIGHT_EFFECT_SIZE) {
      FileClose(hFile);
      return false;
    }

    readLightEffect(gLightEffectData[uiCnt], buffer);
  }

  // loop through and apply the light effects to the map
  for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
    if (gLightEffectData[uiCount].fAllocated)
      UpdateLightingSprite(gLightEffectData[uiCount]);
  }

  FileClose(hFile);

  return true;
}

export function ResetLightEffects(): void {
  // Clear out the old list
  gLightEffectData.forEach(resetLightEffect);
  guiNumLightEffects = 0;
}

}
