let guiBOTTOMPANEL: UINT32 = 0;
let guiRIGHTPANEL: UINT32 = 0;
let guiRENDERBUFFER: UINT32 = 0;
let guiSAVEBUFFER: UINT32 = 0;
let guiEXTRABUFFER: UINT32 = 0;

let gfExtraBuffer: BOOLEAN = FALSE;

function InitializeSystemVideoObjects(): BOOLEAN {
  return TRUE;
}

function InitializeGameVideoObjects(): BOOLEAN {
  let vs_desc: VSURFACE_DESC;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let ubBitDepth: UINT8;

  // Create render buffer
  GetCurrentVideoSettings(&usWidth, &usHeight, &ubBitDepth);
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = usWidth;
  vs_desc.usHeight = usHeight;
  vs_desc.ubBitDepth = ubBitDepth;

  CHECKF(AddVideoSurface(&vs_desc, &guiSAVEBUFFER));

  CHECKF(AddVideoSurface(&vs_desc, &guiEXTRABUFFER));
  gfExtraBuffer = TRUE;

  guiRENDERBUFFER = FRAME_BUFFER;

  return TRUE;
}
