namespace ja2 {

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

let pSliderHead: Pointer<SLIDER> = null;
let guiCurrentSliderID: UINT32 = 1;

let gfSliderInited: boolean = false;

let gfCurrentSliderIsAnchored: boolean = false; // if true, the current selected slider mouse button is down
let gpCurrentSlider: Pointer<SLIDER> = null;

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

export function InitSlider(): boolean {
  let VObjectDesc: VOBJECT_DESC;

  // load Slider Box Graphic graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\SliderBox.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSliderBoxImage))) {
    return false;
  }

  gfSliderInited = true;

  return true;
}

export function ShutDownSlider(): void {
  let pRemove: Pointer<SLIDER> = null;
  let pTemp: Pointer<SLIDER> = null;

  AssertMsg(gfSliderInited, "Trying to ShutDown the Slider System when it was never inited");

  // Do a cehck to see if there are still active nodes
  pTemp = pSliderHead;
  while (pTemp) {
    pRemove = pTemp;
    pTemp = pTemp.value.pNext;
    RemoveSliderBar(pRemove.value.uiSliderID);

    // Report an error
  }

  // if so report an errror
  gfSliderInited = 0;
  DeleteVideoObjectFromIndex(guiSliderBoxImage);
}

export function AddSlider(ubStyle: UINT8, usCursor: UINT16, usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usNumberOfIncrements: UINT16, sPriority: INT8, SliderChangeCallback: SLIDER_CHANGE_CALLBACK, uiFlags: UINT32): INT32 {
  let pTemp: Pointer<SLIDER> = null;
  let pNewSlider: Pointer<SLIDER> = null;
  let iNewID: INT32 = 0;
  let cnt: UINT32 = 0;
  let usIncrementWidth: UINT16 = 0;

  AssertMsg(gfSliderInited, "Trying to Add a Slider Bar when the Slider System was never inited");

  // checks
  if (ubStyle >= Enum329.NUM_SLIDER_STYLES)
    return -1;

  pNewSlider = MemAlloc(sizeof(SLIDER));
  if (pNewSlider == null) {
    return -1;
  }
  memset(pNewSlider, 0, sizeof(SLIDER));

  // Assign the settings to the current slider
  pNewSlider.value.ubStyle = ubStyle;
  pNewSlider.value.usPosX = usPosX;
  pNewSlider.value.usPosY = usPosY;
  //	pNewSlider->usWidth = usWidth;
  pNewSlider.value.usNumberOfIncrements = usNumberOfIncrements;
  pNewSlider.value.SliderChangeCallback = SliderChangeCallback;
  pNewSlider.value.usCurrentIncrement = 0;
  pNewSlider.value.usBackGroundColor = Get16BPPColor(FROMRGB(255, 255, 255));
  pNewSlider.value.uiFlags = uiFlags;

  // Get a new Identifier for the slider
  // Temp just increment for now
  pNewSlider.value.uiSliderID = guiCurrentSliderID;

  // increment counter
  guiCurrentSliderID++;

  //
  // Create the mouse regions for each increment in the slider
  //

  // add the region
  usPosX = pNewSlider.value.usPosX;
  usPosY = pNewSlider.value.usPosY;

  // Add the last one, the width will be whatever is left over
  switch (ubStyle) {
    case Enum329.SLIDER_VERTICAL_STEEL:

      pNewSlider.value.uiFlags |= SLIDER_VERTICAL;
      pNewSlider.value.usWidth = STEEL_SLIDER_WIDTH;
      pNewSlider.value.usHeight = usWidth;
      pNewSlider.value.ubSliderWidth = STEEL_SLIDER_WIDTH;
      pNewSlider.value.ubSliderHeight = STEEL_SLIDER_HEIGHT;

      MSYS_DefineRegion(addressof(pNewSlider.value.ScrollAreaMouseRegion), (usPosX - pNewSlider.value.usWidth / 2), usPosY, (usPosX + pNewSlider.value.usWidth / 2), (pNewSlider.value.usPosY + pNewSlider.value.usHeight), sPriority, usCursor, SelectedSliderMovementCallBack, SelectedSliderButtonCallBack);
      MSYS_SetRegionUserData(addressof(pNewSlider.value.ScrollAreaMouseRegion), 1, pNewSlider.value.uiSliderID);
      break;

    case Enum329.SLIDER_DEFAULT_STYLE:
    default:

      pNewSlider.value.uiFlags |= SLIDER_HORIZONTAL;
      pNewSlider.value.usWidth = usWidth;
      pNewSlider.value.usHeight = DEFUALT_SLIDER_SIZE;

      MSYS_DefineRegion(addressof(pNewSlider.value.ScrollAreaMouseRegion), usPosX, (usPosY - DEFUALT_SLIDER_SIZE), (pNewSlider.value.usPosX + pNewSlider.value.usWidth), (usPosY + DEFUALT_SLIDER_SIZE), sPriority, usCursor, SelectedSliderMovementCallBack, SelectedSliderButtonCallBack);
      MSYS_SetRegionUserData(addressof(pNewSlider.value.ScrollAreaMouseRegion), 1, pNewSlider.value.uiSliderID);
      break;
  }

  //
  //	Load the graphic image for the slider box
  //

  // add the slider into the list
  pTemp = pSliderHead;

  // if its the first time in
  if (pSliderHead == null) {
    pSliderHead = pNewSlider;
    pNewSlider.value.pNext = null;
  } else {
    while (pTemp.value.pNext != null) {
      pTemp = pTemp.value.pNext;
    }

    pTemp.value.pNext = pNewSlider;
    pNewSlider.value.pPrev = pTemp;
    pNewSlider.value.pNext = null;
  }

  CalculateNewSliderBoxPosition(pNewSlider);

  return pNewSlider.value.uiSliderID;
}

export function RenderAllSliderBars(): void {
  let pTemp: Pointer<SLIDER> = null;

  // set the currently selectd slider bar
  if (gfLeftButtonState && gpCurrentSlider != null) {
    let usPosY: UINT16 = 0;

    if (gusMouseYPos < gpCurrentSlider.value.usPosY)
      usPosY = 0;
    else
      usPosY = gusMouseYPos - gpCurrentSlider.value.usPosY;

    // if the mouse
    CalculateNewSliderIncrement(gpCurrentSlider.value.uiSliderID, usPosY);
  } else {
    gpCurrentSlider = null;
  }

  pTemp = pSliderHead;

  while (pTemp) {
    RenderSelectedSliderBar(pTemp);

    pTemp = pTemp.value.pNext;
  }
}

function RenderSelectedSliderBar(pSlider: Pointer<SLIDER>): void {
  if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
  } else {
    // display the background ( the bar )
    OptDisplayLine((pSlider.value.usPosX + 1), (pSlider.value.usPosY - 1), (pSlider.value.usPosX + pSlider.value.usWidth - 1), (pSlider.value.usPosY - 1), pSlider.value.usBackGroundColor);
    OptDisplayLine(pSlider.value.usPosX, pSlider.value.usPosY, (pSlider.value.usPosX + pSlider.value.usWidth), pSlider.value.usPosY, pSlider.value.usBackGroundColor);
    OptDisplayLine((pSlider.value.usPosX + 1), (pSlider.value.usPosY + 1), (pSlider.value.usPosX + pSlider.value.usWidth - 1), (pSlider.value.usPosY + 1), pSlider.value.usBackGroundColor);

    // invalidate the area
    InvalidateRegion(pSlider.value.usPosX, pSlider.value.usPosY - 2, pSlider.value.usPosX + pSlider.value.usWidth + 1, pSlider.value.usPosY + 2);
  }

  RenderSliderBox(pSlider);
}

function RenderSliderBox(pSlider: Pointer<SLIDER>): void {
  let hPixHandle: HVOBJECT;
  let SrcRect: SGPRect;
  let DestRect: SGPRect;

  if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
    // fill out the settings for the current dest and source rects
    SrcRect.iLeft = 0;
    SrcRect.iTop = 0;
    SrcRect.iRight = pSlider.value.ubSliderWidth;
    SrcRect.iBottom = pSlider.value.ubSliderHeight;

    DestRect.iLeft = pSlider.value.usPosX - pSlider.value.ubSliderWidth / 2;
    DestRect.iTop = pSlider.value.usCurrentSliderBoxPosition - pSlider.value.ubSliderHeight / 2;
    DestRect.iRight = DestRect.iLeft + pSlider.value.ubSliderWidth;
    DestRect.iBottom = DestRect.iTop + pSlider.value.ubSliderHeight;

    // If it is not the first time to render the slider
    if (!(pSlider.value.LastRect.iLeft == 0 && pSlider.value.LastRect.iRight == 0)) {
      // Restore the old rect
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, pSlider.value.LastRect.iLeft, pSlider.value.LastRect.iTop, pSlider.value.ubSliderWidth, pSlider.value.ubSliderHeight);

      // invalidate the old area
      InvalidateRegion(pSlider.value.LastRect.iLeft, pSlider.value.LastRect.iTop, pSlider.value.LastRect.iRight, pSlider.value.LastRect.iBottom);
    }

    // Blit the new rect
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, pSlider.value.ubSliderWidth, pSlider.value.ubSliderHeight);
  } else {
    // fill out the settings for the current dest and source rects
    SrcRect.iLeft = 0;
    SrcRect.iTop = 0;
    SrcRect.iRight = pSlider.value.ubSliderWidth;
    SrcRect.iBottom = pSlider.value.ubSliderHeight;

    DestRect.iLeft = pSlider.value.usCurrentSliderBoxPosition;
    DestRect.iTop = pSlider.value.usPosY - DEFUALT_SLIDER_SIZE;
    DestRect.iRight = DestRect.iLeft + pSlider.value.ubSliderWidth;
    DestRect.iBottom = DestRect.iTop + pSlider.value.ubSliderHeight;

    // If it is not the first time to render the slider
    if (!(pSlider.value.LastRect.iLeft == 0 && pSlider.value.LastRect.iRight == 0)) {
      // Restore the old rect
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, pSlider.value.LastRect.iLeft, pSlider.value.LastRect.iTop, 8, 15);
    }

    // save the new rect
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, 8, 15);
  }

  // Save the new rect location
  pSlider.value.LastRect = DestRect;

  if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
    // display the slider box
    GetVideoObject(addressof(hPixHandle), guiSliderBoxImage);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, pSlider.value.LastRect.iLeft, pSlider.value.LastRect.iTop, VO_BLT_SRCTRANSPARENCY, null);

    // invalidate the area
    InvalidateRegion(pSlider.value.LastRect.iLeft, pSlider.value.LastRect.iTop, pSlider.value.LastRect.iRight, pSlider.value.LastRect.iBottom);
  } else {
    // display the slider box
    GetVideoObject(addressof(hPixHandle), guiSliderBoxImage);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, pSlider.value.usCurrentSliderBoxPosition, pSlider.value.usPosY - DEFUALT_SLIDER_SIZE, VO_BLT_SRCTRANSPARENCY, null);

    // invalidate the area
    InvalidateRegion(pSlider.value.usCurrentSliderBoxPosition, pSlider.value.usPosY - DEFUALT_SLIDER_SIZE, pSlider.value.usCurrentSliderBoxPosition + 9, pSlider.value.usPosY + DEFUALT_SLIDER_SIZE);
  }
}

export function RemoveSliderBar(uiSliderID: UINT32): void {
  let pTemp: Pointer<SLIDER> = null;
  let pNodeToRemove: Pointer<SLIDER> = null;
  //	UINT32	cnt;

  pTemp = pSliderHead;

  // Get the required slider
  while (pTemp && pTemp.value.uiSliderID != uiSliderID) {
    pTemp = pTemp.value.pNext;
  }

  // if we could not find the required slider
  if (pTemp == null) {
    // return an error
    return;
  }

  pNodeToRemove = pTemp;

  if (pTemp == pSliderHead)
    pSliderHead = pSliderHead.value.pNext;

  // Detach the node.
  if (pTemp.value.pNext)
    pTemp.value.pNext.value.pPrev = pTemp.value.pPrev;

  if (pTemp.value.pPrev)
    pTemp.value.pPrev.value.pNext = pTemp.value.pNext;

  MSYS_RemoveRegion(addressof(pNodeToRemove.value.ScrollAreaMouseRegion));

  // if its the last node
  if (pNodeToRemove == pSliderHead)
    pSliderHead = null;

  // Remove the slider node
  MemFree(pNodeToRemove);
  pNodeToRemove = null;
}

function SelectedSliderMovementCallBack(pRegion: Pointer<MOUSE_REGION>, reason: INT32): void {
  let uiSelectedSlider: UINT32;
  let pSlider: Pointer<SLIDER> = null;

  // if we already have an anchored slider bar
  if (gpCurrentSlider != null)
    return;

  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion.value.uiFlags &= (~BUTTON_CLICKED_ON);

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == null)
        return;

      // set the currently selectd slider bar
      if (gfLeftButtonState) {
        gpCurrentSlider = pSlider;
      }

      if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeXPos);
      }
    }
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    pRegion.value.uiFlags |= BUTTON_CLICKED_ON;

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == null)
        return;

      // set the currently selectd slider bar
      //			gpCurrentSlider = pSlider;

      if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeXPos);
      }
    }
  }

  else if (reason & MSYS_CALLBACK_REASON_MOVE) {
    pRegion.value.uiFlags |= BUTTON_CLICKED_ON;

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == null)
        return;

      // set the currently selectd slider bar
      //			gpCurrentSlider = pSlider;

      if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeXPos);
      }
    }
  }
}

function SelectedSliderButtonCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let uiSelectedSlider: UINT32;
  let pSlider: Pointer<SLIDER> = null;

  // if we already have an anchored slider bar
  if (gpCurrentSlider != null)
    return;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);

    pSlider = GetSliderFromID(uiSelectedSlider);
    if (pSlider == null)
      return;

    /*		// set the currently selectd slider bar
                    if( gfLeftButtonState )
                    {
                            gpCurrentSlider = pSlider;
                    }
    */

    if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeYPos);
    } else {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeXPos);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);

    pSlider = GetSliderFromID(uiSelectedSlider);
    if (pSlider == null)
      return;

    // set the currently selectd slider bar
    /*		if( gfLeftButtonState )
                    {
                            gpCurrentSlider = pSlider;
                    }
    */

    if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeYPos);
    } else {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.value.RelativeXPos);
    }
  }

  else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
  }
}

function CalculateNewSliderIncrement(uiSliderID: UINT32, usPos: UINT16): void {
  let dNewIncrement: FLOAT = 0.0;
  let pSlider: Pointer<SLIDER>;
  let usOldIncrement: UINT16;
  let fLastSpot: boolean = false;
  let fFirstSpot: boolean = false;

  pSlider = GetSliderFromID(uiSliderID);
  if (pSlider == null)
    return;

  usOldIncrement = pSlider.value.usCurrentIncrement;

  if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
    if (usPos >= (pSlider.value.usHeight * .99))
      fLastSpot = true;

    if (usPos <= (pSlider.value.usHeight * .01))
      fFirstSpot = true;

    // pSlider->usNumberOfIncrements
    if (fFirstSpot)
      dNewIncrement = 0;
    else if (fLastSpot)
      dNewIncrement = pSlider.value.usNumberOfIncrements;
    else
      dNewIncrement = (usPos / pSlider.value.usHeight) * pSlider.value.usNumberOfIncrements;
  } else {
    dNewIncrement = (usPos / pSlider.value.usWidth) * pSlider.value.usNumberOfIncrements;
  }

  pSlider.value.usCurrentIncrement = (dNewIncrement + .5);

  CalculateNewSliderBoxPosition(pSlider);

  // if the the new value is different
  if (usOldIncrement != pSlider.value.usCurrentIncrement) {
    if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
      // Call the call back for the slider
      ((pSlider.value.SliderChangeCallback).value)(pSlider.value.usNumberOfIncrements - pSlider.value.usCurrentIncrement);
    } else {
      // Call the call back for the slider
      ((pSlider.value.SliderChangeCallback).value)(pSlider.value.usCurrentIncrement);
    }
  }
}

function OptDisplayLine(usStartX: UINT16, usStartY: UINT16, EndX: UINT16, EndY: UINT16, iColor: INT16): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // draw the line
  LineDraw(false, usStartX, usStartY, EndX, EndY, iColor, pDestBuf);

  // unlock frame buffer
  UnLockVideoSurface(FRAME_BUFFER);
}

function CalculateNewSliderBoxPosition(pSlider: Pointer<SLIDER>): void {
  let usMaxPos: UINT16;

  if (pSlider.value.uiFlags & SLIDER_VERTICAL) {
    // if the box is in the last position
    if (pSlider.value.usCurrentIncrement >= (pSlider.value.usNumberOfIncrements)) {
      pSlider.value.usCurrentSliderBoxPosition = pSlider.value.usPosY + pSlider.value.usHeight; // - pSlider->ubSliderHeight / 2;	// - minus box width
    }

    // else if the box is in the first position
    else if (pSlider.value.usCurrentIncrement == 0) {
      pSlider.value.usCurrentSliderBoxPosition = pSlider.value.usPosY; // - pSlider->ubSliderHeight / 2;
    } else {
      pSlider.value.usCurrentSliderBoxPosition = pSlider.value.usPosY + ((pSlider.value.usHeight / pSlider.value.usNumberOfIncrements) * pSlider.value.usCurrentIncrement);
    }

    usMaxPos = pSlider.value.usPosY + pSlider.value.usHeight; // - pSlider->ubSliderHeight//2 + 1;

    // if the box is past the edge, move it back
    if (pSlider.value.usCurrentSliderBoxPosition > usMaxPos)
      pSlider.value.usCurrentSliderBoxPosition = usMaxPos;
  } else {
    // if the box is in the last position
    if (pSlider.value.usCurrentIncrement == (pSlider.value.usNumberOfIncrements)) {
      pSlider.value.usCurrentSliderBoxPosition = pSlider.value.usPosX + pSlider.value.usWidth - 8 + 1; // - minus box width
    } else {
      pSlider.value.usCurrentSliderBoxPosition = pSlider.value.usPosX + ((pSlider.value.usWidth / pSlider.value.usNumberOfIncrements) * pSlider.value.usCurrentIncrement);
    }
    usMaxPos = pSlider.value.usPosX + pSlider.value.usWidth - 8 + 1;

    // if the box is past the edge, move it back
    if (pSlider.value.usCurrentSliderBoxPosition > usMaxPos)
      pSlider.value.usCurrentSliderBoxPosition = usMaxPos;
  }
}

function GetSliderFromID(uiSliderID: UINT32): Pointer<SLIDER> {
  let pTemp: Pointer<SLIDER> = null;

  pTemp = pSliderHead;

  // Get the required slider
  while (pTemp && pTemp.value.uiSliderID != uiSliderID) {
    pTemp = pTemp.value.pNext;
  }

  // if we couldnt find the right slider
  if (pTemp == null)
    return null;

  return pTemp;
}

export function SetSliderValue(uiSliderID: UINT32, uiNewValue: UINT32): void {
  let pSlider: Pointer<SLIDER> = null;

  pSlider = GetSliderFromID(uiSliderID);
  if (pSlider == null)
    return;

  if (uiNewValue >= pSlider.value.usNumberOfIncrements)
    return;

  if (pSlider.value.uiFlags & SLIDER_VERTICAL)
    pSlider.value.usCurrentIncrement = pSlider.value.usNumberOfIncrements - uiNewValue;
  else
    pSlider.value.usCurrentIncrement = uiNewValue;

  CalculateNewSliderBoxPosition(pSlider);
}

}
