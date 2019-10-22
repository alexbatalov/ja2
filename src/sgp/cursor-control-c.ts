///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cursor Database
//
///////////////////////////////////////////////////////////////////////////////////////////////////

let gfCursorDatabaseInit: BOOLEAN = FALSE;

let gpCursorFileDatabase: Pointer<CursorFileData>;
let gpCursorDatabase: Pointer<CursorData>;
let gsGlobalCursorYOffset: INT16 = 0;
let gsCurMouseOffsetX: INT16 = 0;
let gsCurMouseOffsetY: INT16 = 0;
let gsCurMouseHeight: UINT16 = 0;
let gsCurMouseWidth: UINT16 = 0;
let gusNumDataFiles: UINT16 = 0;
let guiExternVo: UINT32;
let gusExternVoSubIndex: UINT16;
let guiExtern2Vo: UINT32;
let gusExtern2VoSubIndex: UINT16;
let guiOldSetCursor: UINT32 = 0;
let guiDelayTimer: UINT32 = 0;

let gMouseBltOverride: MOUSEBLT_HOOK = NULL;

function BltToMouseCursorFromVObject(hVObject: HVOBJECT, usVideoObjectSubIndex: UINT16, usXPos: UINT16, usYPos: UINT16): BOOLEAN {
  let ReturnValue: BOOLEAN;

  ReturnValue = BltVideoObject(MOUSE_BUFFER, hVObject, usVideoObjectSubIndex, usXPos, usYPos, VO_BLT_SRCTRANSPARENCY, NULL);

  return ReturnValue;
}

function BltToMouseCursorFromVObjectWithOutline(hVObject: HVOBJECT, usVideoObjectSubIndex: UINT16, usXPos: UINT16, usYPos: UINT16): BOOLEAN {
  let ReturnValue: BOOLEAN;
  let pTrav: Pointer<ETRLEObject>;
  let sXPos: INT16;
  let sYPos: INT16;

  // Adjust for offsets
  pTrav = &(hVObject.value.pETRLEObject[usVideoObjectSubIndex]);

  sXPos = 0;
  sYPos = 0;

  // Remove offsets...
  sXPos -= pTrav.value.sOffsetX;
  sYPos -= pTrav.value.sOffsetY;

  // Center!
  sXPos += ((gsCurMouseWidth - pTrav.value.usWidth) / 2);
  sYPos += ((gsCurMouseHeight - pTrav.value.usHeight) / 2);

  ReturnValue = BltVideoObjectOutline(MOUSE_BUFFER, hVObject, usVideoObjectSubIndex, sXPos, sYPos, Get16BPPColor(FROMRGB(0, 255, 0)), TRUE);

  return ReturnValue;
}

// THESE TWO PARAMETERS MUST POINT TO STATIC OR GLOBAL DATA, NOT AUTOMATIC VARIABLES
function InitCursorDatabase(pCursorFileData: Pointer<CursorFileData>, pCursorData: Pointer<CursorData>, suNumDataFiles: UINT16): void {
  // Set global values!

  gpCursorFileDatabase = pCursorFileData;
  gpCursorDatabase = pCursorData;
  gusNumDataFiles = suNumDataFiles;
  gfCursorDatabaseInit = TRUE;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cursor Handlers
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function LoadCursorData(uiCursorIndex: UINT32): BOOLEAN {
  // Load cursor data will load all data required for the cursor specified by this index
  let pCurData: Pointer<CursorData>;
  let pCurImage: Pointer<CursorImage>;
  let cnt: UINT32;
  let sMaxHeight: INT16 = -1;
  let sMaxWidth: INT16 = -1;
  let pTrav: Pointer<ETRLEObject>;

  pCurData = &(gpCursorDatabase[uiCursorIndex]);

  for (cnt = 0; cnt < pCurData.value.usNumComposites; cnt++) {
    pCurImage = &(pCurData.value.Composites[cnt]);

    if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].fLoaded == FALSE) {
      //
      // The file containing the video object hasn't been loaded yet. Let's load it now
      //
      let VideoObjectDescription: VOBJECT_DESC;
      // FIRST LOAD AS AN HIMAGE SO WE CAN GET AUX DATA!
      let hImage: HIMAGE;
      let pAuxData: Pointer<AuxObjectData>;

      // ATE: First check if we are using an extern vo cursor...
      if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR) {
        // Let's check if we have NOT NULL here...
        if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject == NULL) {
          // Something wrong here...
        }
      } else {
        hImage = CreateImage(gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFilename, IMAGE_ALLDATA);
        if (hImage == NULL) {
          return FALSE;
        }

        VideoObjectDescription.fCreateFlags = VOBJECT_CREATE_FROMHIMAGE;
        VideoObjectDescription.hImage = hImage;

        if (!AddVideoObject(&VideoObjectDescription, &(gpCursorFileDatabase[pCurImage.value.uiFileIndex].uiIndex))) {
          return FALSE;
        }

        // Check for animated tile
        if (hImage.value.uiAppDataSize > 0) {
          // Valid auxiliary data, so get # od frames from data
          pAuxData = hImage.value.pAppData;

          if (pAuxData.value.fFlags & AUX_ANIMATED_TILE) {
            gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFlags |= ANIMATED_CURSOR;
            gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubNumberOfFrames = pAuxData.value.ubNumberOfFrames;
          }
        }

        // the hImage is no longer needed
        DestroyImage(hImage);

        // Save hVObject....
        GetVideoObject(&(gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject), gpCursorFileDatabase[pCurImage.value.uiFileIndex].uiIndex);
      }

      gpCursorFileDatabase[pCurImage.value.uiFileIndex].fLoaded = TRUE;
    }

    // Get ETRLE Data for this video object
    pTrav = &(gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject.value.pETRLEObject[pCurImage.value.uiSubIndex]);

    if (!pTrav) {
      return FALSE;
    }

    if (pTrav.value.usHeight > sMaxHeight) {
      sMaxHeight = pTrav.value.usHeight;
    }

    if (pTrav.value.usWidth > sMaxWidth) {
      sMaxWidth = pTrav.value.usWidth;
    }
  }

  pCurData.value.usHeight = sMaxHeight;
  pCurData.value.usWidth = sMaxWidth;

  if (pCurData.value.sOffsetX == CENTER_CURSOR) {
    pCurData.value.sOffsetX = (pCurData.value.usWidth / 2);
  }
  if (pCurData.value.sOffsetX == RIGHT_CURSOR) {
    pCurData.value.sOffsetX = pCurData.value.usWidth;
  }
  if (pCurData.value.sOffsetX == LEFT_CURSOR) {
    pCurData.value.sOffsetX = 0;
  }

  if (pCurData.value.sOffsetY == CENTER_CURSOR) {
    pCurData.value.sOffsetY = (pCurData.value.usHeight / 2);
  }
  if (pCurData.value.sOffsetY == BOTTOM_CURSOR) {
    pCurData.value.sOffsetY = pCurData.value.usHeight;
  }
  if (pCurData.value.sOffsetY == TOP_CURSOR) {
    pCurData.value.sOffsetY = 0;
  }

  gsCurMouseOffsetX = pCurData.value.sOffsetX;
  gsCurMouseOffsetY = pCurData.value.sOffsetY;
  gsCurMouseHeight = pCurData.value.usHeight;
  gsCurMouseWidth = pCurData.value.usWidth;

  // Adjust relative offsets
  for (cnt = 0; cnt < pCurData.value.usNumComposites; cnt++) {
    pCurImage = &(pCurData.value.Composites[cnt]);

    // Get ETRLE Data for this video object
    pTrav = &(gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject.value.pETRLEObject[pCurImage.value.uiSubIndex]);

    if (!pTrav) {
      return FALSE;
    }

    if (pCurImage.value.usPosX == CENTER_SUBCURSOR) {
      pCurImage.value.usPosX = pCurData.value.sOffsetX - (pTrav.value.usWidth / 2);
    }

    if (pCurImage.value.usPosY == CENTER_SUBCURSOR) {
      pCurImage.value.usPosY = pCurData.value.sOffsetY - (pTrav.value.usHeight / 2);
    }
  }

  return TRUE;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function UnLoadCursorData(uiCursorIndex: UINT32): void {
  // This function will unload add data used for this cursor
  //
  // Ok, first we make sure that the video object file is indeed loaded. Once this is verified, we will
  // move on to the deletion
  //
  let pCurData: Pointer<CursorData>;
  let pCurImage: Pointer<CursorImage>;
  let cnt: UINT32;

  pCurData = &(gpCursorDatabase[uiCursorIndex]);

  for (cnt = 0; cnt < pCurData.value.usNumComposites; cnt++) {
    pCurImage = &(pCurData.value.Composites[cnt]);

    if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].fLoaded) {
      if (!(gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR)) {
        DeleteVideoObjectFromIndex(gpCursorFileDatabase[pCurImage.value.uiFileIndex].uiIndex);
        gpCursorFileDatabase[pCurImage.value.uiFileIndex].uiIndex = 0;
      }
      gpCursorFileDatabase[pCurImage.value.uiFileIndex].fLoaded = FALSE;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function CursorDatabaseClear(): void {
  let uiIndex: UINT32;

  for (uiIndex = 0; uiIndex < gusNumDataFiles; uiIndex++) {
    if (gpCursorFileDatabase[uiIndex].fLoaded == TRUE) {
      if (!(gpCursorFileDatabase[uiIndex].ubFlags & USE_EXTERN_VO_CURSOR)) {
        DeleteVideoObjectFromIndex(gpCursorFileDatabase[uiIndex].uiIndex);
        gpCursorFileDatabase[uiIndex].uiIndex = 0;
      }

      gpCursorFileDatabase[uiIndex].fLoaded = FALSE;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function SetCurrentCursorFromDatabase(uiCursorIndex: UINT32): BOOLEAN {
  let ReturnValue: BOOLEAN = TRUE;
  let usSubIndex: UINT16;
  let pCurData: Pointer<CursorData>;
  let pCurImage: Pointer<CursorImage>;
  let cnt: UINT32;
  let sCenterValX: INT16;
  let sCenterValY: INT16;
  let hVObject: HVOBJECT;
  let pTrav: Pointer<ETRLEObject>;
  let usEffHeight: UINT16;
  let usEffWidth: UINT16;

  if (gfCursorDatabaseInit) {
    // Enter mouse buffer mutex
    // EnterMutex(MOUSE_BUFFER_MUTEX, __LINE__, __FILE__);

    // If the current cursor is the first index, disable cursors

    if (uiCursorIndex == VIDEO_NO_CURSOR) {
      EraseMouseCursor();

      SetMouseCursorProperties(0, 0, 5, 5);
      DirtyCursor();

      // EnableCursor( FALSE );
    } else {
      // CHECK FOR EXTERN CURSOR
      if (uiCursorIndex == EXTERN_CURSOR || uiCursorIndex == EXTERN2_CURSOR) {
        let sSubX: INT16;
        let sSubY: INT16;
        let hVObjectTemp: HVOBJECT;
        let pTravTemp: Pointer<ETRLEObject>;

        // Erase old cursor
        EraseMouseCursor();

        if (uiCursorIndex == EXTERN2_CURSOR) {
          // Get ETRLE values
          GetVideoObject(&hVObject, guiExtern2Vo);
          pTrav = &(hVObject.value.pETRLEObject[gusExtern2VoSubIndex]);
        } else {
          // Get ETRLE values
          GetVideoObject(&hVObject, guiExternVo);
          pTrav = &(hVObject.value.pETRLEObject[gusExternVoSubIndex]);
        }

        // Determine center
        sCenterValX = 0;
        sCenterValY = 0;

        // Effective height
        usEffHeight = pTrav.value.usHeight + pTrav.value.sOffsetY;
        usEffWidth = pTrav.value.usWidth + pTrav.value.sOffsetX;

        // ATE: Check for extern 2nd...
        if (uiCursorIndex == EXTERN2_CURSOR) {
          BltVideoObjectOutlineFromIndex(MOUSE_BUFFER, guiExtern2Vo, gusExtern2VoSubIndex, 0, 0, 0, FALSE);

          // Get ETRLE values
          GetVideoObject(&hVObjectTemp, guiExternVo);
          pTravTemp = &(hVObjectTemp.value.pETRLEObject[gusExternVoSubIndex]);

          sSubX = (pTrav.value.usWidth - pTravTemp.value.usWidth - pTravTemp.value.sOffsetX) / 2;
          sSubY = (pTrav.value.usHeight - pTravTemp.value.usHeight - pTravTemp.value.sOffsetY) / 2;

          BltVideoObjectOutlineFromIndex(MOUSE_BUFFER, guiExternVo, gusExternVoSubIndex, sSubX, sSubY, 0, FALSE);
        } else {
          BltVideoObjectOutlineFromIndex(MOUSE_BUFFER, guiExternVo, gusExternVoSubIndex, 0, 0, 0, FALSE);
        }

        // Hook into hook function
        if (gMouseBltOverride != NULL) {
          gMouseBltOverride();
        }

        SetMouseCursorProperties((usEffWidth / 2), (usEffHeight / 2), (usEffHeight), (usEffWidth));
        DirtyCursor();
      } else {
        pCurData = &(gpCursorDatabase[uiCursorIndex]);

        // First check if we are a differnet curosr...
        if (uiCursorIndex != guiOldSetCursor) {
          // OK, check if we are a delay cursor...
          if (pCurData.value.bFlags & DELAY_START_CURSOR) {
            guiDelayTimer = GetTickCount();
          }
        }

        guiOldSetCursor = uiCursorIndex;

        // Olny update if delay timer has elapsed...
        if (pCurData.value.bFlags & DELAY_START_CURSOR) {
          if ((GetTickCount() - guiDelayTimer) < 1000) {
            EraseMouseCursor();

            SetMouseCursorProperties(0, 0, 5, 5);
            DirtyCursor();

            return TRUE;
          }
        }

        //
        // Call LoadCursorData to make sure that the video object is loaded
        //
        LoadCursorData(uiCursorIndex);

        // Erase old cursor
        EraseMouseCursor();
        // NOW ACCOMODATE COMPOSITE CURSORS
        pCurData = &(gpCursorDatabase[uiCursorIndex]);

        for (cnt = 0; cnt < pCurData.value.usNumComposites; cnt++) {
          // Check if we are a flashing cursor!
          if (pCurData.value.bFlags & CURSOR_TO_FLASH) {
            if (cnt <= 1) {
              if (pCurData.value.bFlashIndex != cnt) {
                continue;
              }
            }
          }
          // Check if we are a sub cursor!
          // IN this case, do all frames but
          // skip the 1st or second!

          if (pCurData.value.bFlags & CURSOR_TO_SUB_CONDITIONALLY) {
            if (pCurData.value.bFlags & CURSOR_TO_FLASH) {
              if (cnt <= 1) {
                if (pCurData.value.bFlashIndex != cnt) {
                  continue;
                }
              }
            } else if (pCurData.value.bFlags & CURSOR_TO_FLASH2) {
              if (cnt <= 2 && cnt > 0) {
                if (pCurData.value.bFlashIndex != cnt) {
                  continue;
                }
              }
            } else {
              if (cnt <= 1) {
                if (pCurData.value.bFlashIndex != cnt) {
                  continue;
                }
              }
            }
          }

          pCurImage = &(pCurData.value.Composites[cnt]);

          // Adjust sub-index if cursor is animated
          if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFlags & ANIMATED_CURSOR) {
            usSubIndex = pCurImage.value.uiCurrentFrame;
          } else {
            usSubIndex = pCurImage.value.uiSubIndex;
          }

          if (pCurImage.value.usPosX != HIDE_SUBCURSOR && pCurImage.value.usPosY != HIDE_SUBCURSOR) {
            // Blit cursor at position in mouse buffer
            if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFlags & USE_OUTLINE_BLITTER) {
              ReturnValue = BltToMouseCursorFromVObjectWithOutline(gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject, usSubIndex, pCurImage.value.usPosX, pCurImage.value.usPosY);
            } else {
              ReturnValue = BltToMouseCursorFromVObject(gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject, usSubIndex, pCurImage.value.usPosX, pCurImage.value.usPosY);
            }
            if (!ReturnValue) {
              return FALSE;
            }
          }

          // if ( pCurData->bFlags & CURSOR_TO_FLASH )
          //{
          //	break;
          //}
        }

        // Hook into hook function
        if (gMouseBltOverride != NULL) {
          gMouseBltOverride();
        }

        sCenterValX = pCurData.value.sOffsetX;
        sCenterValY = pCurData.value.sOffsetY;

        SetMouseCursorProperties(sCenterValX, (sCenterValY + gsGlobalCursorYOffset), pCurData.value.usHeight, pCurData.value.usWidth);
        DirtyCursor();
      }
    }
  } else {
    if (uiCursorIndex == VIDEO_NO_CURSOR) {
      EraseMouseCursor();

      SetMouseCursorProperties(0, 0, 5, 5);
      DirtyCursor();

      // EnableCursor( FALSE );
    } else {
      SetCurrentCursor(uiCursorIndex, 0, 0);
      ReturnValue = TRUE;
    }
  }

  return ReturnValue;
}

function SetMouseBltHook(pMouseBltOverride: MOUSEBLT_HOOK): void {
  gMouseBltOverride = pMouseBltOverride;
}

// Sets an external video object as cursor file data....
function SetExternVOData(uiCursorIndex: UINT32, hVObject: HVOBJECT, usSubIndex: UINT16): void {
  let pCurData: Pointer<CursorData>;
  let pCurImage: Pointer<CursorImage>;
  let cnt: UINT32;

  pCurData = &(gpCursorDatabase[uiCursorIndex]);

  for (cnt = 0; cnt < pCurData.value.usNumComposites; cnt++) {
    pCurImage = &(pCurData.value.Composites[cnt]);

    if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR) {
      // OK, set Video Object here....

      // If loaded, unload...
      UnLoadCursorData(uiCursorIndex);

      // Set extern vo
      gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject = hVObject;
      pCurImage.value.uiSubIndex = usSubIndex;

      // Reload....
      LoadCursorData(uiCursorIndex);
    }
  }
}

function RemoveExternVOData(uiCursorIndex: UINT32): void {
  let pCurData: Pointer<CursorData>;
  let pCurImage: Pointer<CursorImage>;
  let cnt: UINT32;

  pCurData = &(gpCursorDatabase[uiCursorIndex]);

  for (cnt = 0; cnt < pCurData.value.usNumComposites; cnt++) {
    pCurImage = &(pCurData.value.Composites[cnt]);

    if (gpCursorFileDatabase[pCurImage.value.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR) {
      gpCursorFileDatabase[pCurImage.value.uiFileIndex].hVObject = NULL;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
