const NUM_LIGHT_EFFECT_SLOTS = 25;

// GLOBAL FOR LIGHT LISTING
let gLightEffectData: LIGHTEFFECT[] /* [NUM_LIGHT_EFFECT_SLOTS] */;
let guiNumLightEffects: UINT32 = 0;

function GetFreeLightEffect(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
    if ((gLightEffectData[uiCount].fAllocated == FALSE))
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

function UpdateLightingSprite(pLight: Pointer<LIGHTEFFECT>): void {
  let LightName: CHAR8[] /* [20] */;
  // Build light....

  sprintf(LightName, "Light%d", pLight.value.bRadius);

  // Delete old one if one exists...
  if (pLight.value.iLight != (-1)) {
    LightSpriteDestroy(pLight.value.iLight);
    pLight.value.iLight = -1;
  }

  // Effect light.....
  if ((pLight.value.iLight = LightSpriteCreate(LightName, 0)) == (-1)) {
    // Could not light!
    return;
  }

  LightSpritePower(pLight.value.iLight, TRUE);
  //	LightSpriteFake( pLight->iLight );
  LightSpritePosition(pLight.value.iLight, (CenterX(pLight.value.sGridNo) / CELL_X_SIZE), (CenterY(pLight.value.sGridNo) / CELL_Y_SIZE));
}

function NewLightEffect(sGridNo: INT16, bType: INT8): INT32 {
  let pLight: Pointer<LIGHTEFFECT>;
  let iLightIndex: INT32;
  let ubDuration: UINT8 = 0;
  let ubStartRadius: UINT8 = 0;

  if ((iLightIndex = GetFreeLightEffect()) == (-1))
    return -1;

  memset(addressof(gLightEffectData[iLightIndex]), 0, sizeof(LIGHTEFFECT));

  pLight = addressof(gLightEffectData[iLightIndex]);

  // Set some values...
  pLight.value.sGridNo = sGridNo;
  pLight.value.bType = bType;
  pLight.value.iLight = -1;
  pLight.value.uiTimeOfLastUpdate = GetWorldTotalSeconds();

  switch (bType) {
    case LIGHT_FLARE_MARK_1:

      ubDuration = 6;
      ubStartRadius = 6;
      break;
  }

  pLight.value.ubDuration = ubDuration;
  pLight.value.bRadius = ubStartRadius;
  pLight.value.bAge = 0;
  pLight.value.fAllocated = TRUE;

  UpdateLightingSprite(pLight);

  // Handle sight here....
  AllTeamsLookForAll(FALSE);

  return iLightIndex;
}

function RemoveLightEffectFromTile(sGridNo: INT16): void {
  let pLight: Pointer<LIGHTEFFECT>;
  let cnt: UINT32;

  // Set to unallocated....
  for (cnt = 0; cnt < guiNumLightEffects; cnt++) {
    pLight = addressof(gLightEffectData[cnt]);

    if (pLight.value.fAllocated) {
      if (pLight.value.sGridNo == sGridNo) {
        pLight.value.fAllocated = FALSE;

        // Remove light....
        if (pLight.value.iLight != (-1)) {
          LightSpriteDestroy(pLight.value.iLight);
        }
        break;
      }
    }
  }
}

function DecayLightEffects(uiTime: UINT32): void {
  let pLight: Pointer<LIGHTEFFECT>;
  let cnt: UINT32;
  let cnt2: UINT32;
  let fDelete: BOOLEAN = FALSE;
  let usNumUpdates: UINT16 = 1;

  // age all active tear gas clouds, deactivate those that are just dispersing
  for (cnt = 0; cnt < guiNumLightEffects; cnt++) {
    pLight = addressof(gLightEffectData[cnt]);

    fDelete = FALSE;

    if (pLight.value.fAllocated) {
      // ATE: Do this every so ofte, to acheive the effect we want...
      if ((uiTime - pLight.value.uiTimeOfLastUpdate) > 350) {
        usNumUpdates = ((uiTime - pLight.value.uiTimeOfLastUpdate) / 350);

        pLight.value.uiTimeOfLastUpdate = uiTime;

        for (cnt2 = 0; cnt2 < usNumUpdates; cnt2++) {
          pLight.value.bAge++;

          // if this cloud remains effective (duration not reached)
          if (pLight.value.bAge < pLight.value.ubDuration) {
            // calculate the new cloud radius
            // cloud expands by 1 every turn outdoors, and every other turn indoors
            if ((pLight.value.bAge % 2)) {
              pLight.value.bRadius--;
            }

            if (pLight.value.bRadius == 0) {
              // Delete...
              fDelete = TRUE;
              break;
            } else {
              UpdateLightingSprite(pLight);
            }
          } else {
            fDelete = TRUE;
            break;
          }
        }

        if (fDelete) {
          pLight.value.fAllocated = FALSE;

          if (pLight.value.iLight != (-1)) {
            LightSpriteDestroy(pLight.value.iLight);
          }
        }

        // Handle sight here....
        AllTeamsLookForAll(FALSE);
      }
    }
  }
}

function SaveLightEffectsToSaveGameFile(hFile: HWFILE): BOOLEAN {
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
  return TRUE;
}

function LoadLightEffectsFromLoadGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let uiCount: UINT32;

  // no longer need to load Light effects.  They are now in temp files
  if (guiSaveGameVersion < 76) {
    memset(gLightEffectData, 0, sizeof(LIGHTEFFECT) * NUM_LIGHT_EFFECT_SLOTS);

    // Load the Number of Light Effects
    FileRead(hFile, addressof(guiNumLightEffects), sizeof(UINT32), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(UINT32)) {
      return FALSE;
    }

    // if there are lights saved.
    if (guiNumLightEffects != 0) {
      // loop through and apply the light effects to the map
      for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
        // Load the Light effect Data
        FileRead(hFile, addressof(gLightEffectData[uiCount]), sizeof(LIGHTEFFECT), addressof(uiNumBytesRead));
        if (uiNumBytesRead != sizeof(LIGHTEFFECT)) {
          return FALSE;
        }
      }
    }

    // loop through and apply the light effects to the map
    for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
      if (gLightEffectData[uiCount].fAllocated)
        UpdateLightingSprite(addressof(gLightEffectData[uiCount]));
    }
  }

  return TRUE;
}

function SaveLightEffectsToMapTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): BOOLEAN {
  let uiNumLightEffects: UINT32 = 0;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  let zMapName: CHAR8[] /* [128] */;
  let uiCnt: UINT32;

  // get the name of the map
  GetMapTempFileName(SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, zMapName, sMapX, sMapY, bMapZ);

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

    return TRUE;
  }

  // Open the file for writing
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
  if (hFile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // Save the Number of Light Effects
  FileWrite(hFile, addressof(uiNumLightEffects), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    // Close the file
    FileClose(hFile);

    return FALSE;
  }

  // loop through and save the number of Light effects
  for (uiCnt = 0; uiCnt < guiNumLightEffects; uiCnt++) {
    // if the Light is active
    if (gLightEffectData[uiCnt].fAllocated) {
      // Save the Light effect Data
      FileWrite(hFile, addressof(gLightEffectData[uiCnt]), sizeof(LIGHTEFFECT), addressof(uiNumBytesWritten));
      if (uiNumBytesWritten != sizeof(LIGHTEFFECT)) {
        // Close the file
        FileClose(hFile);

        return FALSE;
      }
    }
  }

  // Close the file
  FileClose(hFile);

  SetSectorFlag(sMapX, sMapY, bMapZ, SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS);

  return TRUE;
}

function LoadLightEffectsFromMapTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let uiCount: UINT32;
  let uiCnt: UINT32 = 0;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  let zMapName: CHAR8[] /* [128] */;

  GetMapTempFileName(SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, zMapName, sMapX, sMapY, bMapZ);

  // Open the file for reading, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hFile == 0) {
    // Error opening file
    return FALSE;
  }

  // Clear out the old list
  ResetLightEffects();

  // Load the Number of Light Effects
  FileRead(hFile, addressof(guiNumLightEffects), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    FileClose(hFile);
    return FALSE;
  }

  // loop through and load the list
  for (uiCnt = 0; uiCnt < guiNumLightEffects; uiCnt++) {
    // Load the Light effect Data
    FileRead(hFile, addressof(gLightEffectData[uiCnt]), sizeof(LIGHTEFFECT), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(LIGHTEFFECT)) {
      FileClose(hFile);
      return FALSE;
    }
  }

  // loop through and apply the light effects to the map
  for (uiCount = 0; uiCount < guiNumLightEffects; uiCount++) {
    if (gLightEffectData[uiCount].fAllocated)
      UpdateLightingSprite(addressof(gLightEffectData[uiCount]));
  }

  FileClose(hFile);

  return TRUE;
}

function ResetLightEffects(): void {
  // Clear out the old list
  memset(gLightEffectData, 0, sizeof(LIGHTEFFECT) * NUM_LIGHT_EFFECT_SLOTS);
  guiNumLightEffects = 0;
}
