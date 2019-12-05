namespace ja2 {

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cursor Database
//
///////////////////////////////////////////////////////////////////////////////////////////////////

let gfCursorDatabaseInit: boolean = false;

let gpCursorFileDatabase: CursorFileData[];
let gpCursorDatabase: CursorData[];
export let gsGlobalCursorYOffset: INT16 = 0;
let gsCurMouseOffsetX: INT16 = 0;
let gsCurMouseOffsetY: INT16 = 0;
export let gsCurMouseHeight: UINT16 = 0;
export let gsCurMouseWidth: UINT16 = 0;
let gusNumDataFiles: UINT16 = 0;
export let guiExternVo: UINT32;
export let gusExternVoSubIndex: UINT16;
let guiExtern2Vo: UINT32;
let gusExtern2VoSubIndex: UINT16;
let guiOldSetCursor: UINT32 = 0;
let guiDelayTimer: UINT32 = 0;

let gMouseBltOverride: MOUSEBLT_HOOK | null = null;

function BltToMouseCursorFromVObject(hVObject: SGPVObject, usVideoObjectSubIndex: UINT16, usXPos: UINT16, usYPos: UINT16): boolean {
  let ReturnValue: boolean;

  ReturnValue = BltVideoObject(MOUSE_BUFFER, hVObject, usVideoObjectSubIndex, usXPos, usYPos, VO_BLT_SRCTRANSPARENCY, null);

  return ReturnValue;
}

function BltToMouseCursorFromVObjectWithOutline(hVObject: SGPVObject, usVideoObjectSubIndex: UINT16, usXPos: UINT16, usYPos: UINT16): boolean {
  let ReturnValue: boolean;
  let pTrav: ETRLEObject;
  let sXPos: INT16;
  let sYPos: INT16;

  // Adjust for offsets
  pTrav = hVObject.pETRLEObject[usVideoObjectSubIndex];

  sXPos = 0;
  sYPos = 0;

  // Remove offsets...
  sXPos -= pTrav.sOffsetX;
  sYPos -= pTrav.sOffsetY;

  // Center!
  sXPos += ((gsCurMouseWidth - pTrav.usWidth) / 2);
  sYPos += ((gsCurMouseHeight - pTrav.usHeight) / 2);

  ReturnValue = BltVideoObjectOutline(MOUSE_BUFFER, hVObject, usVideoObjectSubIndex, sXPos, sYPos, Get16BPPColor(FROMRGB(0, 255, 0)), true);

  return ReturnValue;
}

// THESE TWO PARAMETERS MUST POINT TO STATIC OR GLOBAL DATA, NOT AUTOMATIC VARIABLES
export function InitCursorDatabase(pCursorFileData: CursorFileData[], pCursorData: CursorData[], suNumDataFiles: UINT16): void {
  // Set global values!

  gpCursorFileDatabase = pCursorFileData;
  gpCursorDatabase = pCursorData;
  gusNumDataFiles = suNumDataFiles;
  gfCursorDatabaseInit = true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cursor Handlers
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function LoadCursorData(uiCursorIndex: UINT32): boolean {
  // Load cursor data will load all data required for the cursor specified by this index
  let pCurData: CursorData;
  let pCurImage: CursorImage;
  let cnt: UINT32;
  let sMaxHeight: INT16 = -1;
  let sMaxWidth: INT16 = -1;
  let pTrav: ETRLEObject;

  pCurData = gpCursorDatabase[uiCursorIndex];

  for (cnt = 0; cnt < pCurData.usNumComposites; cnt++) {
    pCurImage = pCurData.Composites[cnt];

    if (gpCursorFileDatabase[pCurImage.uiFileIndex].fLoaded == false) {
      //
      // The file containing the video object hasn't been loaded yet. Let's load it now
      //
      let VideoObjectDescription: VOBJECT_DESC = createVObjectDesc();
      // FIRST LOAD AS AN HIMAGE SO WE CAN GET AUX DATA!
      let hImage: ImageType;
      let pAuxData: AuxObjectData;

      // ATE: First check if we are using an extern vo cursor...
      if (gpCursorFileDatabase[pCurImage.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR) {
        // Let's check if we have NOT NULL here...
        if (gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject == null) {
          // Something wrong here...
        }
      } else {
        hImage = CreateImage(gpCursorFileDatabase[pCurImage.uiFileIndex].ubFilename, IMAGE_ALLDATA);
        if (hImage == null) {
          return false;
        }

        VideoObjectDescription.fCreateFlags = VOBJECT_CREATE_FROMHIMAGE;
        VideoObjectDescription.hImage = hImage;

        if (!(gpCursorFileDatabase[pCurImage.uiFileIndex].uiIndex = AddVideoObject(VideoObjectDescription))) {
          return false;
        }

        // Check for animated tile
        if (hImage.uiAppDataSize > 0) {
          // Valid auxiliary data, so get # od frames from data
          pAuxData = createAuxObjectData();
          readAuxObjectData(pAuxData, hImage.pAppData);

          if (pAuxData.fFlags & AUX_ANIMATED_TILE) {
            gpCursorFileDatabase[pCurImage.uiFileIndex].ubFlags |= ANIMATED_CURSOR;
            gpCursorFileDatabase[pCurImage.uiFileIndex].ubNumberOfFrames = pAuxData.ubNumberOfFrames;
          }
        }

        // the hImage is no longer needed
        DestroyImage(hImage);

        // Save hVObject....
        gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject = GetVideoObject(gpCursorFileDatabase[pCurImage.uiFileIndex].uiIndex);
      }

      gpCursorFileDatabase[pCurImage.uiFileIndex].fLoaded = true;
    }

    // Get ETRLE Data for this video object
    pTrav = gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject.pETRLEObject[pCurImage.uiSubIndex];

    if (!pTrav) {
      return false;
    }

    if (pTrav.usHeight > sMaxHeight) {
      sMaxHeight = pTrav.usHeight;
    }

    if (pTrav.usWidth > sMaxWidth) {
      sMaxWidth = pTrav.usWidth;
    }
  }

  pCurData.usHeight = sMaxHeight;
  pCurData.usWidth = sMaxWidth;

  if (pCurData.sOffsetX == CENTER_CURSOR) {
    pCurData.sOffsetX = (pCurData.usWidth / 2);
  }
  if (pCurData.sOffsetX == RIGHT_CURSOR) {
    pCurData.sOffsetX = pCurData.usWidth;
  }
  if (pCurData.sOffsetX == LEFT_CURSOR) {
    pCurData.sOffsetX = 0;
  }

  if (pCurData.sOffsetY == CENTER_CURSOR) {
    pCurData.sOffsetY = (pCurData.usHeight / 2);
  }
  if (pCurData.sOffsetY == BOTTOM_CURSOR) {
    pCurData.sOffsetY = pCurData.usHeight;
  }
  if (pCurData.sOffsetY == TOP_CURSOR) {
    pCurData.sOffsetY = 0;
  }

  gsCurMouseOffsetX = pCurData.sOffsetX;
  gsCurMouseOffsetY = pCurData.sOffsetY;
  gsCurMouseHeight = pCurData.usHeight;
  gsCurMouseWidth = pCurData.usWidth;

  // Adjust relative offsets
  for (cnt = 0; cnt < pCurData.usNumComposites; cnt++) {
    pCurImage = pCurData.Composites[cnt];

    // Get ETRLE Data for this video object
    pTrav = gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject.pETRLEObject[pCurImage.uiSubIndex];

    if (!pTrav) {
      return false;
    }

    if (pCurImage.usPosX == CENTER_SUBCURSOR) {
      pCurImage.usPosX = pCurData.sOffsetX - (pTrav.usWidth / 2);
    }

    if (pCurImage.usPosY == CENTER_SUBCURSOR) {
      pCurImage.usPosY = pCurData.sOffsetY - (pTrav.usHeight / 2);
    }
  }

  return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function UnLoadCursorData(uiCursorIndex: UINT32): void {
  // This function will unload add data used for this cursor
  //
  // Ok, first we make sure that the video object file is indeed loaded. Once this is verified, we will
  // move on to the deletion
  //
  let pCurData: CursorData;
  let pCurImage: CursorImage;
  let cnt: UINT32;

  pCurData = gpCursorDatabase[uiCursorIndex];

  for (cnt = 0; cnt < pCurData.usNumComposites; cnt++) {
    pCurImage = pCurData.Composites[cnt];

    if (gpCursorFileDatabase[pCurImage.uiFileIndex].fLoaded) {
      if (!(gpCursorFileDatabase[pCurImage.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR)) {
        DeleteVideoObjectFromIndex(gpCursorFileDatabase[pCurImage.uiFileIndex].uiIndex);
        gpCursorFileDatabase[pCurImage.uiFileIndex].uiIndex = 0;
      }
      gpCursorFileDatabase[pCurImage.uiFileIndex].fLoaded = false;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function CursorDatabaseClear(): void {
  let uiIndex: UINT32;

  for (uiIndex = 0; uiIndex < gusNumDataFiles; uiIndex++) {
    if (gpCursorFileDatabase[uiIndex].fLoaded == true) {
      if (!(gpCursorFileDatabase[uiIndex].ubFlags & USE_EXTERN_VO_CURSOR)) {
        DeleteVideoObjectFromIndex(gpCursorFileDatabase[uiIndex].uiIndex);
        gpCursorFileDatabase[uiIndex].uiIndex = 0;
      }

      gpCursorFileDatabase[uiIndex].fLoaded = false;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function SetCurrentCursorFromDatabase(uiCursorIndex: UINT32): boolean {
  let ReturnValue: boolean = true;
  let usSubIndex: UINT16;
  let pCurData: CursorData;
  let pCurImage: CursorImage;
  let cnt: UINT32;
  let sCenterValX: INT16;
  let sCenterValY: INT16;
  let hVObject: SGPVObject;
  let pTrav: ETRLEObject;
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
        let hVObjectTemp: SGPVObject;
        let pTravTemp: ETRLEObject;

        // Erase old cursor
        EraseMouseCursor();

        if (uiCursorIndex == EXTERN2_CURSOR) {
          // Get ETRLE values
          hVObject = GetVideoObject(guiExtern2Vo);
          pTrav = hVObject.pETRLEObject[gusExtern2VoSubIndex];
        } else {
          // Get ETRLE values
          hVObject = GetVideoObject(guiExternVo);
          pTrav = hVObject.pETRLEObject[gusExternVoSubIndex];
        }

        // Determine center
        sCenterValX = 0;
        sCenterValY = 0;

        // Effective height
        usEffHeight = pTrav.usHeight + pTrav.sOffsetY;
        usEffWidth = pTrav.usWidth + pTrav.sOffsetX;

        // ATE: Check for extern 2nd...
        if (uiCursorIndex == EXTERN2_CURSOR) {
          BltVideoObjectOutlineFromIndex(MOUSE_BUFFER, guiExtern2Vo, gusExtern2VoSubIndex, 0, 0, 0, false);

          // Get ETRLE values
          hVObjectTemp = GetVideoObject(guiExternVo);
          pTravTemp = hVObjectTemp.pETRLEObject[gusExternVoSubIndex];

          sSubX = (pTrav.usWidth - pTravTemp.usWidth - pTravTemp.sOffsetX) / 2;
          sSubY = (pTrav.usHeight - pTravTemp.usHeight - pTravTemp.sOffsetY) / 2;

          BltVideoObjectOutlineFromIndex(MOUSE_BUFFER, guiExternVo, gusExternVoSubIndex, sSubX, sSubY, 0, false);
        } else {
          BltVideoObjectOutlineFromIndex(MOUSE_BUFFER, guiExternVo, gusExternVoSubIndex, 0, 0, 0, false);
        }

        // Hook into hook function
        if (gMouseBltOverride != null) {
          gMouseBltOverride();
        }

        SetMouseCursorProperties((usEffWidth / 2), (usEffHeight / 2), (usEffHeight), (usEffWidth));
        DirtyCursor();
      } else {
        pCurData = gpCursorDatabase[uiCursorIndex];

        // First check if we are a differnet curosr...
        if (uiCursorIndex != guiOldSetCursor) {
          // OK, check if we are a delay cursor...
          if (pCurData.bFlags & DELAY_START_CURSOR) {
            guiDelayTimer = GetTickCount();
          }
        }

        guiOldSetCursor = uiCursorIndex;

        // Olny update if delay timer has elapsed...
        if (pCurData.bFlags & DELAY_START_CURSOR) {
          if ((GetTickCount() - guiDelayTimer) < 1000) {
            EraseMouseCursor();

            SetMouseCursorProperties(0, 0, 5, 5);
            DirtyCursor();

            return true;
          }
        }

        //
        // Call LoadCursorData to make sure that the video object is loaded
        //
        LoadCursorData(uiCursorIndex);

        // Erase old cursor
        EraseMouseCursor();
        // NOW ACCOMODATE COMPOSITE CURSORS
        pCurData = gpCursorDatabase[uiCursorIndex];

        for (cnt = 0; cnt < pCurData.usNumComposites; cnt++) {
          // Check if we are a flashing cursor!
          if (pCurData.bFlags & CURSOR_TO_FLASH) {
            if (cnt <= 1) {
              if (pCurData.bFlashIndex != cnt) {
                continue;
              }
            }
          }
          // Check if we are a sub cursor!
          // IN this case, do all frames but
          // skip the 1st or second!

          if (pCurData.bFlags & CURSOR_TO_SUB_CONDITIONALLY) {
            if (pCurData.bFlags & CURSOR_TO_FLASH) {
              if (cnt <= 1) {
                if (pCurData.bFlashIndex != cnt) {
                  continue;
                }
              }
            } else if (pCurData.bFlags & CURSOR_TO_FLASH2) {
              if (cnt <= 2 && cnt > 0) {
                if (pCurData.bFlashIndex != cnt) {
                  continue;
                }
              }
            } else {
              if (cnt <= 1) {
                if (pCurData.bFlashIndex != cnt) {
                  continue;
                }
              }
            }
          }

          pCurImage = pCurData.Composites[cnt];

          // Adjust sub-index if cursor is animated
          if (gpCursorFileDatabase[pCurImage.uiFileIndex].ubFlags & ANIMATED_CURSOR) {
            usSubIndex = pCurImage.uiCurrentFrame;
          } else {
            usSubIndex = pCurImage.uiSubIndex;
          }

          if (pCurImage.usPosX != HIDE_SUBCURSOR && pCurImage.usPosY != HIDE_SUBCURSOR) {
            // Blit cursor at position in mouse buffer
            if (gpCursorFileDatabase[pCurImage.uiFileIndex].ubFlags & USE_OUTLINE_BLITTER) {
              ReturnValue = BltToMouseCursorFromVObjectWithOutline(gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject, usSubIndex, pCurImage.usPosX, pCurImage.usPosY);
            } else {
              ReturnValue = BltToMouseCursorFromVObject(gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject, usSubIndex, pCurImage.usPosX, pCurImage.usPosY);
            }
            if (!ReturnValue) {
              return false;
            }
          }

          // if ( pCurData->bFlags & CURSOR_TO_FLASH )
          //{
          //	break;
          //}
        }

        // Hook into hook function
        if (gMouseBltOverride != null) {
          gMouseBltOverride();
        }

        sCenterValX = pCurData.sOffsetX;
        sCenterValY = pCurData.sOffsetY;

        SetMouseCursorProperties(sCenterValX, (sCenterValY + gsGlobalCursorYOffset), pCurData.usHeight, pCurData.usWidth);
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
      ReturnValue = true;
    }
  }

  return ReturnValue;
}

export function SetMouseBltHook(pMouseBltOverride: MOUSEBLT_HOOK): void {
  gMouseBltOverride = pMouseBltOverride;
}

// Sets an external video object as cursor file data....
export function SetExternVOData(uiCursorIndex: UINT32, hVObject: SGPVObject, usSubIndex: UINT16): void {
  let pCurData: CursorData;
  let pCurImage: CursorImage;
  let cnt: UINT32;

  pCurData = gpCursorDatabase[uiCursorIndex];

  for (cnt = 0; cnt < pCurData.usNumComposites; cnt++) {
    pCurImage = pCurData.Composites[cnt];

    if (gpCursorFileDatabase[pCurImage.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR) {
      // OK, set Video Object here....

      // If loaded, unload...
      UnLoadCursorData(uiCursorIndex);

      // Set extern vo
      gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject = hVObject;
      pCurImage.uiSubIndex = usSubIndex;

      // Reload....
      LoadCursorData(uiCursorIndex);
    }
  }
}

function RemoveExternVOData(uiCursorIndex: UINT32): void {
  let pCurData: CursorData;
  let pCurImage: CursorImage;
  let cnt: UINT32;

  pCurData = gpCursorDatabase[uiCursorIndex];

  for (cnt = 0; cnt < pCurData.usNumComposites; cnt++) {
    pCurImage = pCurData.Composites[cnt];

    if (gpCursorFileDatabase[pCurImage.uiFileIndex].ubFlags & USE_EXTERN_VO_CURSOR) {
      gpCursorFileDatabase[pCurImage.uiFileIndex].hVObject = <SGPVObject><unknown>null;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

}
