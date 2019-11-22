namespace ja2 {

let guiBOTTOMPANEL: UINT32 = 0;
let guiRIGHTPANEL: UINT32 = 0;
export let guiRENDERBUFFER: UINT32 = 0;
export let guiSAVEBUFFER: UINT32 = 0;
export let guiEXTRABUFFER: UINT32 = 0;

export let gfExtraBuffer: boolean = false;

export function InitializeSystemVideoObjects(): boolean {
  return true;
}

export function InitializeGameVideoObjects(): boolean {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  let usWidth: UINT16;
  let usHeight: UINT16;
  let ubBitDepth: UINT8;

  // Create render buffer
  ({ usWidth, usHeight, ubBitDepth } = GetCurrentVideoSettings());
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = usWidth;
  vs_desc.usHeight = usHeight;
  vs_desc.ubBitDepth = ubBitDepth;

  if (!AddVideoSurface(addressof(vs_desc), addressof(guiSAVEBUFFER))) {
    return false;
  }

  if (!AddVideoSurface(addressof(vs_desc), addressof(guiEXTRABUFFER))) {
    return false;
  }
  gfExtraBuffer = true;

  guiRENDERBUFFER = FRAME_BUFFER;

  return true;
}

}
