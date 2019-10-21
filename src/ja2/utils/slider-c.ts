///////////////////////////////////////////////////
//
//	Defines
//
///////////////////////////////////////////////////

const DEFUALT_SLIDER_SIZE = 7;

const STEEL_SLIDER_WIDTH = 42;
const STEEL_SLIDER_HEIGHT = 25;

interface SLIDER {
  uiSliderID: UINT32;

  ubStyle: UINT8;
  usPosX: UINT16;
  usPosY: UINT16;
  usWidth: UINT16;
  usHeight: UINT16;
  usNumberOfIncrements: UINT16;
  SliderChangeCallback: SLIDER_CHANGE_CALLBACK;

  usCurrentIncrement: UINT16;

  usBackGroundColor: UINT16;

  ScrollAreaMouseRegion: MOUSE_REGION;

  uiSliderBoxImage: UINT32;
  usCurrentSliderBoxPosition: UINT16;

  LastRect: SGPRect;

  uiFlags: UINT32;

  ubSliderWidth: UINT8;
  ubSliderHeight: UINT8;

  pNext: Pointer<SLIDER>;
  pPrev: Pointer<SLIDER>;
}

// ddd

///////////////////////////////////////////////////
//
//	Global Variables
//
///////////////////////////////////////////////////

let pSliderHead: Pointer<SLIDER> = NULL;
let guiCurrentSliderID: UINT32 = 1;

let gfSliderInited: BOOLEAN = FALSE;

let gfCurrentSliderIsAnchored: BOOLEAN = FALSE; // if true, the current selected slider mouse button is down
let gpCurrentSlider: Pointer<SLIDER> = NULL;

let guiSliderBoxImage: UINT32 = 0;
// ggg

///////////////////////////////////////////////////
//
//	Function Prototypes
//
///////////////////////////////////////////////////

// ppp

///////////////////////////////////////////////////
//
//	Functions
//
///////////////////////////////////////////////////

function InitSlider(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // load Slider Box Graphic graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\SliderBox.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSliderBoxImage));

  gfSliderInited = TRUE;

  return TRUE;
}

function ShutDownSlider(): void {
  let pRemove: Pointer<SLIDER> = NULL;
  let pTemp: Pointer<SLIDER> = NULL;

  AssertMsg(gfSliderInited, "Trying to ShutDown the Slider System when it was never inited");

  // Do a cehck to see if there are still active nodes
  pTemp = pSliderHead;
  while (pTemp) {
    pRemove = pTemp;
    pTemp = pTemp->pNext;
    RemoveSliderBar(pRemove->uiSliderID);

    // Report an error
  }

  // if so report an errror
  gfSliderInited = 0;
  DeleteVideoObjectFromIndex(guiSliderBoxImage);
}

function AddSlider(ubStyle: UINT8, usCursor: UINT16, usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usNumberOfIncrements: UINT16, sPriority: INT8, SliderChangeCallback: SLIDER_CHANGE_CALLBACK, uiFlags: UINT32): INT32 {
  let pTemp: Pointer<SLIDER> = NULL;
  let pNewSlider: Pointer<SLIDER> = NULL;
  let iNewID: INT32 = 0;
  let cnt: UINT32 = 0;
  let usIncrementWidth: UINT16 = 0;

  AssertMsg(gfSliderInited, "Trying to Add a Slider Bar when the Slider System was never inited");

  // checks
  if (ubStyle >= NUM_SLIDER_STYLES)
    return -1;

  pNewSlider = MemAlloc(sizeof(SLIDER));
  if (pNewSlider == NULL) {
    return -1;
  }
  memset(pNewSlider, 0, sizeof(SLIDER));

  // Assign the settings to the current slider
  pNewSlider->ubStyle = ubStyle;
  pNewSlider->usPosX = usPosX;
  pNewSlider->usPosY = usPosY;
  //	pNewSlider->usWidth = usWidth;
  pNewSlider->usNumberOfIncrements = usNumberOfIncrements;
  pNewSlider->SliderChangeCallback = SliderChangeCallback;
  pNewSlider->usCurrentIncrement = 0;
  pNewSlider->usBackGroundColor = Get16BPPColor(FROMRGB(255, 255, 255));
  pNewSlider->uiFlags = uiFlags;

  // Get a new Identifier for the slider
  // Temp just increment for now
  pNewSlider->uiSliderID = guiCurrentSliderID;

  // increment counter
  guiCurrentSliderID++;

  //
  // Create the mouse regions for each increment in the slider
  //

  // add the region
  usPosX = pNewSlider->usPosX;
  usPosY = pNewSlider->usPosY;

  // Add the last one, the width will be whatever is left over
  switch (ubStyle) {
    case SLIDER_VERTICAL_STEEL:

      pNewSlider->uiFlags |= SLIDER_VERTICAL;
      pNewSlider->usWidth = STEEL_SLIDER_WIDTH;
      pNewSlider->usHeight = usWidth;
      pNewSlider->ubSliderWidth = STEEL_SLIDER_WIDTH;
      pNewSlider->ubSliderHeight = STEEL_SLIDER_HEIGHT;

      MSYS_DefineRegion(&pNewSlider->ScrollAreaMouseRegion, (UINT16)(usPosX - pNewSlider->usWidth / 2), usPosY, (UINT16)(usPosX + pNewSlider->usWidth / 2), (UINT16)(pNewSlider->usPosY + pNewSlider->usHeight), sPriority, usCursor, SelectedSliderMovementCallBack, SelectedSliderButtonCallBack);
      MSYS_SetRegionUserData(&pNewSlider->ScrollAreaMouseRegion, 1, pNewSlider->uiSliderID);
      break;

    case SLIDER_DEFAULT_STYLE:
    default:

      pNewSlider->uiFlags |= SLIDER_HORIZONTAL;
      pNewSlider->usWidth = usWidth;
      pNewSlider->usHeight = DEFUALT_SLIDER_SIZE;

      MSYS_DefineRegion(&pNewSlider->ScrollAreaMouseRegion, usPosX, (UINT16)(usPosY - DEFUALT_SLIDER_SIZE), (UINT16)(pNewSlider->usPosX + pNewSlider->usWidth), (UINT16)(usPosY + DEFUALT_SLIDER_SIZE), sPriority, usCursor, SelectedSliderMovementCallBack, SelectedSliderButtonCallBack);
      MSYS_SetRegionUserData(&pNewSlider->ScrollAreaMouseRegion, 1, pNewSlider->uiSliderID);
      break;
  }

  //
  //	Load the graphic image for the slider box
  //

  // add the slider into the list
  pTemp = pSliderHead;

  // if its the first time in
  if (pSliderHead == NULL) {
    pSliderHead = pNewSlider;
    pNewSlider->pNext = NULL;
  } else {
    while (pTemp->pNext != NULL) {
      pTemp = pTemp->pNext;
    }

    pTemp->pNext = pNewSlider;
    pNewSlider->pPrev = pTemp;
    pNewSlider->pNext = NULL;
  }

  CalculateNewSliderBoxPosition(pNewSlider);

  return pNewSlider->uiSliderID;
}

function RenderAllSliderBars(): void {
  let pTemp: Pointer<SLIDER> = NULL;

  // set the currently selectd slider bar
  if (gfLeftButtonState && gpCurrentSlider != NULL) {
    let usPosY: UINT16 = 0;

    if (gusMouseYPos < gpCurrentSlider->usPosY)
      usPosY = 0;
    else
      usPosY = gusMouseYPos - gpCurrentSlider->usPosY;

    // if the mouse
    CalculateNewSliderIncrement(gpCurrentSlider->uiSliderID, usPosY);
  } else {
    gpCurrentSlider = NULL;
  }

  pTemp = pSliderHead;

  while (pTemp) {
    RenderSelectedSliderBar(pTemp);

    pTemp = pTemp->pNext;
  }
}

function RenderSelectedSliderBar(pSlider: Pointer<SLIDER>): void {
  if (pSlider->uiFlags & SLIDER_VERTICAL) {
  } else {
    // display the background ( the bar )
    OptDisplayLine((UINT16)(pSlider->usPosX + 1), (UINT16)(pSlider->usPosY - 1), (UINT16)(pSlider->usPosX + pSlider->usWidth - 1), (UINT16)(pSlider->usPosY - 1), pSlider->usBackGroundColor);
    OptDisplayLine(pSlider->usPosX, pSlider->usPosY, (UINT16)(pSlider->usPosX + pSlider->usWidth), pSlider->usPosY, pSlider->usBackGroundColor);
    OptDisplayLine((UINT16)(pSlider->usPosX + 1), (UINT16)(pSlider->usPosY + 1), (UINT16)(pSlider->usPosX + pSlider->usWidth - 1), (UINT16)(pSlider->usPosY + 1), pSlider->usBackGroundColor);

    // invalidate the area
    InvalidateRegion(pSlider->usPosX, pSlider->usPosY - 2, pSlider->usPosX + pSlider->usWidth + 1, pSlider->usPosY + 2);
  }

  RenderSliderBox(pSlider);
}

function RenderSliderBox(pSlider: Pointer<SLIDER>): void {
  let hPixHandle: HVOBJECT;
  let SrcRect: SGPRect;
  let DestRect: SGPRect;

  if (pSlider->uiFlags & SLIDER_VERTICAL) {
    // fill out the settings for the current dest and source rects
    SrcRect.iLeft = 0;
    SrcRect.iTop = 0;
    SrcRect.iRight = pSlider->ubSliderWidth;
    SrcRect.iBottom = pSlider->ubSliderHeight;

    DestRect.iLeft = pSlider->usPosX - pSlider->ubSliderWidth / 2;
    DestRect.iTop = pSlider->usCurrentSliderBoxPosition - pSlider->ubSliderHeight / 2;
    DestRect.iRight = DestRect.iLeft + pSlider->ubSliderWidth;
    DestRect.iBottom = DestRect.iTop + pSlider->ubSliderHeight;

    // If it is not the first time to render the slider
    if (!(pSlider->LastRect.iLeft == 0 && pSlider->LastRect.iRight == 0)) {
      // Restore the old rect
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, (UINT16)pSlider->LastRect.iLeft, (UINT16)pSlider->LastRect.iTop, pSlider->ubSliderWidth, pSlider->ubSliderHeight);

      // invalidate the old area
      InvalidateRegion(pSlider->LastRect.iLeft, pSlider->LastRect.iTop, pSlider->LastRect.iRight, pSlider->LastRect.iBottom);
    }

    // Blit the new rect
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, (UINT16)DestRect.iLeft, (UINT16)DestRect.iTop, pSlider->ubSliderWidth, pSlider->ubSliderHeight);
  } else {
    // fill out the settings for the current dest and source rects
    SrcRect.iLeft = 0;
    SrcRect.iTop = 0;
    SrcRect.iRight = pSlider->ubSliderWidth;
    SrcRect.iBottom = pSlider->ubSliderHeight;

    DestRect.iLeft = pSlider->usCurrentSliderBoxPosition;
    DestRect.iTop = pSlider->usPosY - DEFUALT_SLIDER_SIZE;
    DestRect.iRight = DestRect.iLeft + pSlider->ubSliderWidth;
    DestRect.iBottom = DestRect.iTop + pSlider->ubSliderHeight;

    // If it is not the first time to render the slider
    if (!(pSlider->LastRect.iLeft == 0 && pSlider->LastRect.iRight == 0)) {
      // Restore the old rect
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, (UINT16)pSlider->LastRect.iLeft, (UINT16)pSlider->LastRect.iTop, 8, 15);
    }

    // save the new rect
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, (UINT16)DestRect.iLeft, (UINT16)DestRect.iTop, 8, 15);
  }

  // Save the new rect location
  pSlider->LastRect = DestRect;

  if (pSlider->uiFlags & SLIDER_VERTICAL) {
    // display the slider box
    GetVideoObject(&hPixHandle, guiSliderBoxImage);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, pSlider->LastRect.iLeft, pSlider->LastRect.iTop, VO_BLT_SRCTRANSPARENCY, NULL);

    // invalidate the area
    InvalidateRegion(pSlider->LastRect.iLeft, pSlider->LastRect.iTop, pSlider->LastRect.iRight, pSlider->LastRect.iBottom);
  } else {
    // display the slider box
    GetVideoObject(&hPixHandle, guiSliderBoxImage);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, pSlider->usCurrentSliderBoxPosition, pSlider->usPosY - DEFUALT_SLIDER_SIZE, VO_BLT_SRCTRANSPARENCY, NULL);

    // invalidate the area
    InvalidateRegion(pSlider->usCurrentSliderBoxPosition, pSlider->usPosY - DEFUALT_SLIDER_SIZE, pSlider->usCurrentSliderBoxPosition + 9, pSlider->usPosY + DEFUALT_SLIDER_SIZE);
  }
}

function RemoveSliderBar(uiSliderID: UINT32): void {
  let pTemp: Pointer<SLIDER> = NULL;
  let pNodeToRemove: Pointer<SLIDER> = NULL;
  //	UINT32	cnt;

  pTemp = pSliderHead;

  // Get the required slider
  while (pTemp && pTemp->uiSliderID != uiSliderID) {
    pTemp = pTemp->pNext;
  }

  // if we could not find the required slider
  if (pTemp == NULL) {
    // return an error
    return;
  }

  pNodeToRemove = pTemp;

  if (pTemp == pSliderHead)
    pSliderHead = pSliderHead->pNext;

  // Detach the node.
  if (pTemp->pNext)
    pTemp->pNext->pPrev = pTemp->pPrev;

  if (pTemp->pPrev)
    pTemp->pPrev->pNext = pTemp->pNext;

  MSYS_RemoveRegion(&pNodeToRemove->ScrollAreaMouseRegion);

  // if its the last node
  if (pNodeToRemove == pSliderHead)
    pSliderHead = NULL;

  // Remove the slider node
  MemFree(pNodeToRemove);
  pNodeToRemove = NULL;
}

function SelectedSliderMovementCallBack(pRegion: Pointer<MOUSE_REGION>, reason: INT32): void {
  let uiSelectedSlider: UINT32;
  let pSlider: Pointer<SLIDER> = NULL;

  // if we already have an anchored slider bar
  if (gpCurrentSlider != NULL)
    return;

  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion->uiFlags &= (~BUTTON_CLICKED_ON);

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == NULL)
        return;

      // set the currently selectd slider bar
      if (gfLeftButtonState) {
        gpCurrentSlider = pSlider;
      }

      if (pSlider->uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeXPos);
      }
    }
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    pRegion->uiFlags |= BUTTON_CLICKED_ON;

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == NULL)
        return;

      // set the currently selectd slider bar
      //			gpCurrentSlider = pSlider;

      if (pSlider->uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeXPos);
      }
    }
  }

  else if (reason & MSYS_CALLBACK_REASON_MOVE) {
    pRegion->uiFlags |= BUTTON_CLICKED_ON;

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == NULL)
        return;

      // set the currently selectd slider bar
      //			gpCurrentSlider = pSlider;

      if (pSlider->uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeXPos);
      }
    }
  }
}

function SelectedSliderButtonCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let uiSelectedSlider: UINT32;
  let pSlider: Pointer<SLIDER> = NULL;

  // if we already have an anchored slider bar
  if (gpCurrentSlider != NULL)
    return;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);

    pSlider = GetSliderFromID(uiSelectedSlider);
    if (pSlider == NULL)
      return;

    /*		// set the currently selectd slider bar
                    if( gfLeftButtonState )
                    {
                            gpCurrentSlider = pSlider;
                    }
    */

    if (pSlider->uiFlags & SLIDER_VERTICAL) {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeYPos);
    } else {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeXPos);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);

    pSlider = GetSliderFromID(uiSelectedSlider);
    if (pSlider == NULL)
      return;

    // set the currently selectd slider bar
    /*		if( gfLeftButtonState )
                    {
                            gpCurrentSlider = pSlider;
                    }
    */

    if (pSlider->uiFlags & SLIDER_VERTICAL) {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeYPos);
    } else {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion->RelativeXPos);
    }
  }

  else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
  }
}

function CalculateNewSliderIncrement(uiSliderID: UINT32, usPos: UINT16): void {
  let dNewIncrement: FLOAT = 0.0;
  let pSlider: Pointer<SLIDER>;
  let usOldIncrement: UINT16;
  let fLastSpot: BOOLEAN = FALSE;
  let fFirstSpot: BOOLEAN = FALSE;

  pSlider = GetSliderFromID(uiSliderID);
  if (pSlider == NULL)
    return;

  usOldIncrement = pSlider->usCurrentIncrement;

  if (pSlider->uiFlags & SLIDER_VERTICAL) {
    if (usPos >= (UINT16)(pSlider->usHeight * (FLOAT).99))
      fLastSpot = TRUE;

    if (usPos <= (UINT16)(pSlider->usHeight * (FLOAT).01))
      fFirstSpot = TRUE;

    // pSlider->usNumberOfIncrements
    if (fFirstSpot)
      dNewIncrement = 0;
    else if (fLastSpot)
      dNewIncrement = pSlider->usNumberOfIncrements;
    else
      dNewIncrement = (usPos / (FLOAT)pSlider->usHeight) * pSlider->usNumberOfIncrements;
  } else {
    dNewIncrement = (usPos / (FLOAT)pSlider->usWidth) * pSlider->usNumberOfIncrements;
  }

  pSlider->usCurrentIncrement = (UINT16)(dNewIncrement + .5);

  CalculateNewSliderBoxPosition(pSlider);

  // if the the new value is different
  if (usOldIncrement != pSlider->usCurrentIncrement) {
    if (pSlider->uiFlags & SLIDER_VERTICAL) {
      // Call the call back for the slider
      (*(pSlider->SliderChangeCallback))(pSlider->usNumberOfIncrements - pSlider->usCurrentIncrement);
    } else {
      // Call the call back for the slider
      (*(pSlider->SliderChangeCallback))(pSlider->usCurrentIncrement);
    }
  }
}

function OptDisplayLine(usStartX: UINT16, usStartY: UINT16, EndX: UINT16, EndY: UINT16, iColor: INT16): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);

  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // draw the line
  LineDraw(FALSE, usStartX, usStartY, EndX, EndY, iColor, pDestBuf);

  // unlock frame buffer
  UnLockVideoSurface(FRAME_BUFFER);
}

function CalculateNewSliderBoxPosition(pSlider: Pointer<SLIDER>): void {
  let usMaxPos: UINT16;

  if (pSlider->uiFlags & SLIDER_VERTICAL) {
    // if the box is in the last position
    if (pSlider->usCurrentIncrement >= (pSlider->usNumberOfIncrements)) {
      pSlider->usCurrentSliderBoxPosition = pSlider->usPosY + pSlider->usHeight; // - pSlider->ubSliderHeight / 2;	// - minus box width
    }

    // else if the box is in the first position
    else if (pSlider->usCurrentIncrement == 0) {
      pSlider->usCurrentSliderBoxPosition = pSlider->usPosY; // - pSlider->ubSliderHeight / 2;
    } else {
      pSlider->usCurrentSliderBoxPosition = pSlider->usPosY + (UINT16)((pSlider->usHeight / (FLOAT)pSlider->usNumberOfIncrements) * pSlider->usCurrentIncrement);
    }

    usMaxPos = pSlider->usPosY + pSlider->usHeight; // - pSlider->ubSliderHeight//2 + 1;

    // if the box is past the edge, move it back
    if (pSlider->usCurrentSliderBoxPosition > usMaxPos)
      pSlider->usCurrentSliderBoxPosition = usMaxPos;
  } else {
    // if the box is in the last position
    if (pSlider->usCurrentIncrement == (pSlider->usNumberOfIncrements)) {
      pSlider->usCurrentSliderBoxPosition = pSlider->usPosX + pSlider->usWidth - 8 + 1; // - minus box width
    } else {
      pSlider->usCurrentSliderBoxPosition = pSlider->usPosX + (UINT16)((pSlider->usWidth / (FLOAT)pSlider->usNumberOfIncrements) * pSlider->usCurrentIncrement);
    }
    usMaxPos = pSlider->usPosX + pSlider->usWidth - 8 + 1;

    // if the box is past the edge, move it back
    if (pSlider->usCurrentSliderBoxPosition > usMaxPos)
      pSlider->usCurrentSliderBoxPosition = usMaxPos;
  }
}

function GetSliderFromID(uiSliderID: UINT32): Pointer<SLIDER> {
  let pTemp: Pointer<SLIDER> = NULL;

  pTemp = pSliderHead;

  // Get the required slider
  while (pTemp && pTemp->uiSliderID != uiSliderID) {
    pTemp = pTemp->pNext;
  }

  // if we couldnt find the right slider
  if (pTemp == NULL)
    return NULL;

  return pTemp;
}

function SetSliderValue(uiSliderID: UINT32, uiNewValue: UINT32): void {
  let pSlider: Pointer<SLIDER> = NULL;

  pSlider = GetSliderFromID(uiSliderID);
  if (pSlider == NULL)
    return;

  if (uiNewValue >= pSlider->usNumberOfIncrements)
    return;

  if (pSlider->uiFlags & SLIDER_VERTICAL)
    pSlider->usCurrentIncrement = pSlider->usNumberOfIncrements - (UINT16)uiNewValue;
  else
    pSlider->usCurrentIncrement = (UINT16)uiNewValue;

  CalculateNewSliderBoxPosition(pSlider);
}
