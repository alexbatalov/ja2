let guiBOTTOMPANEL: UINT32 = 0;
let guiRIGHTPANEL: UINT32 = 0;
let guiRENDERBUFFER: UINT32 = 0;
let guiSAVEBUFFER: UINT32 = 0;
let guiEXTRABUFFER: UINT32 = 0;

let gfExtraBuffer: boolean = false;

function InitializeSystemVideoObjects(): boolean {
  return true;
}

function InitializeGameVideoObjects(): boolean {
  let vs_desc: VSURFACE_DESC;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let ubBitDepth: UINT8;

  // Create render buffer
  GetCurrentVideoSettings(addressof(usWidth), addressof(usHeight), addressof(ubBitDepth));
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = usWidth;
  vs_desc.usHeight = usHeight;
  vs_desc.ubBitDepth = ubBitDepth;

  CHECKF(AddVideoSurface(addressof(vs_desc), addressof(guiSAVEBUFFER)));

  CHECKF(AddVideoSurface(addressof(vs_desc), addressof(guiEXTRABUFFER)));
  gfExtraBuffer = true;

  guiRENDERBUFFER = FRAME_BUFFER;

  return true;
}
