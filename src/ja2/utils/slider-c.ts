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

  pNext: SLIDER | null;
  pPrev: SLIDER | null;
}

function createSlider(): SLIDER {
  return {
    uiSliderID: 0,
    ubStyle: 0,
    usPosX: 0,
    usPosY: 0,
    usWidth: 0,
    usHeight: 0,
    usNumberOfIncrements: 0,
    SliderChangeCallback: <SLIDER_CHANGE_CALLBACK><unknown>null,
    usCurrentIncrement: 0,
    usBackGroundColor: 0,
    ScrollAreaMouseRegion: createMouseRegion(),
    uiSliderBoxImage: 0,
    usCurrentSliderBoxPosition: 0,
    LastRect: createSGPRect(),
    uiFlags: 0,
    ubSliderWidth: 0,
    ubSliderHeight: 0,
    pNext: null,
    pPrev: null,
  };
}

// ddd

///////////////////////////////////////////////////
//
//	Global Variables
//
///////////////////////////////////////////////////

let pSliderHead: SLIDER | null = null;
let guiCurrentSliderID: UINT32 = 1;

let gfSliderInited: boolean = false;

let gfCurrentSliderIsAnchored: boolean = false; // if true, the current selected slider mouse button is down
let gpCurrentSlider: SLIDER | null = null;

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
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load Slider Box Graphic graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\SliderBox.sti");
  if (!(guiSliderBoxImage = AddVideoObject(VObjectDesc))) {
    return false;
  }

  gfSliderInited = true;

  return true;
}

export function ShutDownSlider(): void {
  let pRemove: SLIDER | null = null;
  let pTemp: SLIDER | null = null;

  AssertMsg(gfSliderInited, "Trying to ShutDown the Slider System when it was never inited");

  // Do a cehck to see if there are still active nodes
  pTemp = pSliderHead;
  while (pTemp) {
    pRemove = pTemp;
    pTemp = pTemp.pNext;
    RemoveSliderBar(pRemove.uiSliderID);

    // Report an error
  }

  // if so report an errror
  gfSliderInited = false;
  DeleteVideoObjectFromIndex(guiSliderBoxImage);
}

export function AddSlider(ubStyle: UINT8, usCursor: UINT16, usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usNumberOfIncrements: UINT16, sPriority: INT8, SliderChangeCallback: SLIDER_CHANGE_CALLBACK, uiFlags: UINT32): INT32 {
  let pTemp: SLIDER | null = null;
  let pNewSlider: SLIDER;
  let iNewID: INT32 = 0;
  let cnt: UINT32 = 0;
  let usIncrementWidth: UINT16 = 0;

  AssertMsg(gfSliderInited, "Trying to Add a Slider Bar when the Slider System was never inited");

  // checks
  if (ubStyle >= Enum329.NUM_SLIDER_STYLES)
    return -1;

  pNewSlider = createSlider();

  // Assign the settings to the current slider
  pNewSlider.ubStyle = ubStyle;
  pNewSlider.usPosX = usPosX;
  pNewSlider.usPosY = usPosY;
  //	pNewSlider->usWidth = usWidth;
  pNewSlider.usNumberOfIncrements = usNumberOfIncrements;
  pNewSlider.SliderChangeCallback = SliderChangeCallback;
  pNewSlider.usCurrentIncrement = 0;
  pNewSlider.usBackGroundColor = Get16BPPColor(FROMRGB(255, 255, 255));
  pNewSlider.uiFlags = uiFlags;

  // Get a new Identifier for the slider
  // Temp just increment for now
  pNewSlider.uiSliderID = guiCurrentSliderID;

  // increment counter
  guiCurrentSliderID++;

  //
  // Create the mouse regions for each increment in the slider
  //

  // add the region
  usPosX = pNewSlider.usPosX;
  usPosY = pNewSlider.usPosY;

  // Add the last one, the width will be whatever is left over
  switch (ubStyle) {
    case Enum329.SLIDER_VERTICAL_STEEL:

      pNewSlider.uiFlags |= SLIDER_VERTICAL;
      pNewSlider.usWidth = STEEL_SLIDER_WIDTH;
      pNewSlider.usHeight = usWidth;
      pNewSlider.ubSliderWidth = STEEL_SLIDER_WIDTH;
      pNewSlider.ubSliderHeight = STEEL_SLIDER_HEIGHT;

      MSYS_DefineRegion(pNewSlider.ScrollAreaMouseRegion, (usPosX - pNewSlider.usWidth / 2), usPosY, (usPosX + pNewSlider.usWidth / 2), (pNewSlider.usPosY + pNewSlider.usHeight), sPriority, usCursor, SelectedSliderMovementCallBack, SelectedSliderButtonCallBack);
      MSYS_SetRegionUserData(pNewSlider.ScrollAreaMouseRegion, 1, pNewSlider.uiSliderID);
      break;

    case Enum329.SLIDER_DEFAULT_STYLE:
    default:

      pNewSlider.uiFlags |= SLIDER_HORIZONTAL;
      pNewSlider.usWidth = usWidth;
      pNewSlider.usHeight = DEFUALT_SLIDER_SIZE;

      MSYS_DefineRegion(pNewSlider.ScrollAreaMouseRegion, usPosX, (usPosY - DEFUALT_SLIDER_SIZE), (pNewSlider.usPosX + pNewSlider.usWidth), (usPosY + DEFUALT_SLIDER_SIZE), sPriority, usCursor, SelectedSliderMovementCallBack, SelectedSliderButtonCallBack);
      MSYS_SetRegionUserData(pNewSlider.ScrollAreaMouseRegion, 1, pNewSlider.uiSliderID);
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
    pNewSlider.pNext = null;
  } else {
    while ((<SLIDER>pTemp).pNext != null) {
      pTemp = (<SLIDER>pTemp).pNext;
    }

    (<SLIDER>pTemp).pNext = pNewSlider;
    pNewSlider.pPrev = pTemp;
    pNewSlider.pNext = null;
  }

  CalculateNewSliderBoxPosition(pNewSlider);

  return pNewSlider.uiSliderID;
}

export function RenderAllSliderBars(): void {
  let pTemp: SLIDER | null = null;

  // set the currently selectd slider bar
  if (gfLeftButtonState && gpCurrentSlider != null) {
    let usPosY: UINT16 = 0;

    if (gusMouseYPos < gpCurrentSlider.usPosY)
      usPosY = 0;
    else
      usPosY = gusMouseYPos - gpCurrentSlider.usPosY;

    // if the mouse
    CalculateNewSliderIncrement(gpCurrentSlider.uiSliderID, usPosY);
  } else {
    gpCurrentSlider = null;
  }

  pTemp = pSliderHead;

  while (pTemp) {
    RenderSelectedSliderBar(pTemp);

    pTemp = pTemp.pNext;
  }
}

function RenderSelectedSliderBar(pSlider: SLIDER): void {
  if (pSlider.uiFlags & SLIDER_VERTICAL) {
  } else {
    // display the background ( the bar )
    OptDisplayLine((pSlider.usPosX + 1), (pSlider.usPosY - 1), (pSlider.usPosX + pSlider.usWidth - 1), (pSlider.usPosY - 1), pSlider.usBackGroundColor);
    OptDisplayLine(pSlider.usPosX, pSlider.usPosY, (pSlider.usPosX + pSlider.usWidth), pSlider.usPosY, pSlider.usBackGroundColor);
    OptDisplayLine((pSlider.usPosX + 1), (pSlider.usPosY + 1), (pSlider.usPosX + pSlider.usWidth - 1), (pSlider.usPosY + 1), pSlider.usBackGroundColor);

    // invalidate the area
    InvalidateRegion(pSlider.usPosX, pSlider.usPosY - 2, pSlider.usPosX + pSlider.usWidth + 1, pSlider.usPosY + 2);
  }

  RenderSliderBox(pSlider);
}

function RenderSliderBox(pSlider: SLIDER): void {
  let hPixHandle: SGPVObject;
  let SrcRect: SGPRect = createSGPRect();
  let DestRect: SGPRect = createSGPRect();

  if (pSlider.uiFlags & SLIDER_VERTICAL) {
    // fill out the settings for the current dest and source rects
    SrcRect.iLeft = 0;
    SrcRect.iTop = 0;
    SrcRect.iRight = pSlider.ubSliderWidth;
    SrcRect.iBottom = pSlider.ubSliderHeight;

    DestRect.iLeft = pSlider.usPosX - pSlider.ubSliderWidth / 2;
    DestRect.iTop = pSlider.usCurrentSliderBoxPosition - pSlider.ubSliderHeight / 2;
    DestRect.iRight = DestRect.iLeft + pSlider.ubSliderWidth;
    DestRect.iBottom = DestRect.iTop + pSlider.ubSliderHeight;

    // If it is not the first time to render the slider
    if (!(pSlider.LastRect.iLeft == 0 && pSlider.LastRect.iRight == 0)) {
      // Restore the old rect
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, pSlider.LastRect.iLeft, pSlider.LastRect.iTop, pSlider.ubSliderWidth, pSlider.ubSliderHeight);

      // invalidate the old area
      InvalidateRegion(pSlider.LastRect.iLeft, pSlider.LastRect.iTop, pSlider.LastRect.iRight, pSlider.LastRect.iBottom);
    }

    // Blit the new rect
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, pSlider.ubSliderWidth, pSlider.ubSliderHeight);
  } else {
    // fill out the settings for the current dest and source rects
    SrcRect.iLeft = 0;
    SrcRect.iTop = 0;
    SrcRect.iRight = pSlider.ubSliderWidth;
    SrcRect.iBottom = pSlider.ubSliderHeight;

    DestRect.iLeft = pSlider.usCurrentSliderBoxPosition;
    DestRect.iTop = pSlider.usPosY - DEFUALT_SLIDER_SIZE;
    DestRect.iRight = DestRect.iLeft + pSlider.ubSliderWidth;
    DestRect.iBottom = DestRect.iTop + pSlider.ubSliderHeight;

    // If it is not the first time to render the slider
    if (!(pSlider.LastRect.iLeft == 0 && pSlider.LastRect.iRight == 0)) {
      // Restore the old rect
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, pSlider.LastRect.iLeft, pSlider.LastRect.iTop, 8, 15);
    }

    // save the new rect
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, 8, 15);
  }

  // Save the new rect location
  pSlider.LastRect = DestRect;

  if (pSlider.uiFlags & SLIDER_VERTICAL) {
    // display the slider box
    hPixHandle = GetVideoObject(guiSliderBoxImage);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, pSlider.LastRect.iLeft, pSlider.LastRect.iTop, VO_BLT_SRCTRANSPARENCY, null);

    // invalidate the area
    InvalidateRegion(pSlider.LastRect.iLeft, pSlider.LastRect.iTop, pSlider.LastRect.iRight, pSlider.LastRect.iBottom);
  } else {
    // display the slider box
    hPixHandle = GetVideoObject(guiSliderBoxImage);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, pSlider.usCurrentSliderBoxPosition, pSlider.usPosY - DEFUALT_SLIDER_SIZE, VO_BLT_SRCTRANSPARENCY, null);

    // invalidate the area
    InvalidateRegion(pSlider.usCurrentSliderBoxPosition, pSlider.usPosY - DEFUALT_SLIDER_SIZE, pSlider.usCurrentSliderBoxPosition + 9, pSlider.usPosY + DEFUALT_SLIDER_SIZE);
  }
}

export function RemoveSliderBar(uiSliderID: UINT32): void {
  let pTemp: SLIDER | null = null;
  let pNodeToRemove: SLIDER | null = null;
  //	UINT32	cnt;

  pTemp = pSliderHead;

  // Get the required slider
  while (pTemp && pTemp.uiSliderID != uiSliderID) {
    pTemp = pTemp.pNext;
  }

  // if we could not find the required slider
  if (pTemp == null) {
    // return an error
    return;
  }

  pNodeToRemove = pTemp;

  if (pTemp == pSliderHead)
    pSliderHead = pSliderHead.pNext;

  // Detach the node.
  if (pTemp.pNext)
    pTemp.pNext.pPrev = pTemp.pPrev;

  if (pTemp.pPrev)
    pTemp.pPrev.pNext = pTemp.pNext;

  MSYS_RemoveRegion(pNodeToRemove.ScrollAreaMouseRegion);

  // if its the last node
  if (pNodeToRemove == pSliderHead)
    pSliderHead = null;

  // Remove the slider node
  pNodeToRemove = null;
}

function SelectedSliderMovementCallBack(pRegion: MOUSE_REGION, reason: INT32): void {
  let uiSelectedSlider: UINT32;
  let pSlider: SLIDER | null = null;

  // if we already have an anchored slider bar
  if (gpCurrentSlider != null)
    return;

  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion.uiFlags &= (~BUTTON_CLICKED_ON);

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == null)
        return;

      // set the currently selectd slider bar
      if (gfLeftButtonState) {
        gpCurrentSlider = pSlider;
      }

      if (pSlider.uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeXPos);
      }
    }
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    pRegion.uiFlags |= BUTTON_CLICKED_ON;

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == null)
        return;

      // set the currently selectd slider bar
      //			gpCurrentSlider = pSlider;

      if (pSlider.uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeXPos);
      }
    }
  }

  else if (reason & MSYS_CALLBACK_REASON_MOVE) {
    pRegion.uiFlags |= BUTTON_CLICKED_ON;

    if (gfLeftButtonState) {
      uiSelectedSlider = MSYS_GetRegionUserData(pRegion, 1);
      pSlider = GetSliderFromID(uiSelectedSlider);
      if (pSlider == null)
        return;

      // set the currently selectd slider bar
      //			gpCurrentSlider = pSlider;

      if (pSlider.uiFlags & SLIDER_VERTICAL) {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeYPos);
      } else {
        CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeXPos);
      }
    }
  }
}

function SelectedSliderButtonCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  let uiSelectedSlider: UINT32;
  let pSlider: SLIDER | null = null;

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

    if (pSlider.uiFlags & SLIDER_VERTICAL) {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeYPos);
    } else {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeXPos);
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

    if (pSlider.uiFlags & SLIDER_VERTICAL) {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeYPos);
    } else {
      CalculateNewSliderIncrement(uiSelectedSlider, pRegion.RelativeXPos);
    }
  }

  else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
  }
}

function CalculateNewSliderIncrement(uiSliderID: UINT32, usPos: UINT16): void {
  let dNewIncrement: FLOAT = 0.0;
  let pSlider: SLIDER | null;
  let usOldIncrement: UINT16;
  let fLastSpot: boolean = false;
  let fFirstSpot: boolean = false;

  pSlider = GetSliderFromID(uiSliderID);
  if (pSlider == null)
    return;

  usOldIncrement = pSlider.usCurrentIncrement;

  if (pSlider.uiFlags & SLIDER_VERTICAL) {
    if (usPos >= (pSlider.usHeight * .99))
      fLastSpot = true;

    if (usPos <= (pSlider.usHeight * .01))
      fFirstSpot = true;

    // pSlider->usNumberOfIncrements
    if (fFirstSpot)
      dNewIncrement = 0;
    else if (fLastSpot)
      dNewIncrement = pSlider.usNumberOfIncrements;
    else
      dNewIncrement = (usPos / pSlider.usHeight) * pSlider.usNumberOfIncrements;
  } else {
    dNewIncrement = (usPos / pSlider.usWidth) * pSlider.usNumberOfIncrements;
  }

  pSlider.usCurrentIncrement = (dNewIncrement + .5);

  CalculateNewSliderBoxPosition(pSlider);

  // if the the new value is different
  if (usOldIncrement != pSlider.usCurrentIncrement) {
    if (pSlider.uiFlags & SLIDER_VERTICAL) {
      // Call the call back for the slider
      pSlider.SliderChangeCallback(pSlider.usNumberOfIncrements - pSlider.usCurrentIncrement);
    } else {
      // Call the call back for the slider
      pSlider.SliderChangeCallback(pSlider.usCurrentIncrement);
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

function CalculateNewSliderBoxPosition(pSlider: SLIDER): void {
  let usMaxPos: UINT16;

  if (pSlider.uiFlags & SLIDER_VERTICAL) {
    // if the box is in the last position
    if (pSlider.usCurrentIncrement >= (pSlider.usNumberOfIncrements)) {
      pSlider.usCurrentSliderBoxPosition = pSlider.usPosY + pSlider.usHeight; // - pSlider->ubSliderHeight / 2;	// - minus box width
    }

    // else if the box is in the first position
    else if (pSlider.usCurrentIncrement == 0) {
      pSlider.usCurrentSliderBoxPosition = pSlider.usPosY; // - pSlider->ubSliderHeight / 2;
    } else {
      pSlider.usCurrentSliderBoxPosition = pSlider.usPosY + ((pSlider.usHeight / pSlider.usNumberOfIncrements) * pSlider.usCurrentIncrement);
    }

    usMaxPos = pSlider.usPosY + pSlider.usHeight; // - pSlider->ubSliderHeight//2 + 1;

    // if the box is past the edge, move it back
    if (pSlider.usCurrentSliderBoxPosition > usMaxPos)
      pSlider.usCurrentSliderBoxPosition = usMaxPos;
  } else {
    // if the box is in the last position
    if (pSlider.usCurrentIncrement == (pSlider.usNumberOfIncrements)) {
      pSlider.usCurrentSliderBoxPosition = pSlider.usPosX + pSlider.usWidth - 8 + 1; // - minus box width
    } else {
      pSlider.usCurrentSliderBoxPosition = pSlider.usPosX + ((pSlider.usWidth / pSlider.usNumberOfIncrements) * pSlider.usCurrentIncrement);
    }
    usMaxPos = pSlider.usPosX + pSlider.usWidth - 8 + 1;

    // if the box is past the edge, move it back
    if (pSlider.usCurrentSliderBoxPosition > usMaxPos)
      pSlider.usCurrentSliderBoxPosition = usMaxPos;
  }
}

function GetSliderFromID(uiSliderID: UINT32): SLIDER | null {
  let pTemp: SLIDER | null = null;

  pTemp = pSliderHead;

  // Get the required slider
  while (pTemp && pTemp.uiSliderID != uiSliderID) {
    pTemp = pTemp.pNext;
  }

  // if we couldnt find the right slider
  if (pTemp == null)
    return null;

  return pTemp;
}

export function SetSliderValue(uiSliderID: UINT32, uiNewValue: UINT32): void {
  let pSlider: SLIDER | null = null;

  pSlider = GetSliderFromID(uiSliderID);
  if (pSlider == null)
    return;

  if (uiNewValue >= pSlider.usNumberOfIncrements)
    return;

  if (pSlider.uiFlags & SLIDER_VERTICAL)
    pSlider.usCurrentIncrement = pSlider.usNumberOfIncrements - uiNewValue;
  else
    pSlider.usCurrentIncrement = uiNewValue;

  CalculateNewSliderBoxPosition(pSlider);
}

}
