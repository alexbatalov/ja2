// globals

// video object handles
let guiBACKGROUND: UINT32;
let guiIMPSYMBOL: UINT32;
let guiBEGININDENT: UINT32;
let guiACTIVATIONINDENT: UINT32;
let guiFRONTPAGEINDENT: UINT32;
let guiFULLNAMEINDENT: UINT32;
let guiNAMEINDENT: UINT32;
let guiNICKNAMEINDENT: UINT32;
let guiGENDERINDENT: UINT32;
let guiSMALLFRAME: UINT32;
let guiANALYSE: UINT32;
let guiATTRIBUTEGRAPH: UINT32;
let guiATTRIBUTEGRAPHBAR: UINT32;
let guiSMALLSILHOUETTE: UINT32;
let guiLARGESILHOUETTE: UINT32;
let guiPORTRAITFRAME: UINT32;
let guiSLIDERBAR: UINT32;
let guiATTRIBUTEFRAME: UINT32;
let guiATTRIBUTESCREENINDENT1: UINT32;
let guiATTRIBUTESCREENINDENT2: UINT32;
let guiATTRIBUTEBAR: UINT32;
let guiBUTTON2IMAGE: UINT32;
let guiBUTTON1IMAGE: UINT32;
let guiBUTTON4IMAGE: UINT32;
let guiPORTRAITFRAME: UINT32;
let guiMAININDENT: UINT32;
let guiLONGINDENT: UINT32;
let guiSHORTINDENT: UINT32;
let guiSHORTHINDENT: UINT32;
let guiSHORT2INDENT: UINT32;
let guiLONGHINDENT: UINT32;
let guiQINDENT: UINT32;
let guiA1INDENT: UINT32;
let guiA2INDENT: UINT32;
let guiAVGMERCINDENT: UINT32;
let guiABOUTUSINDENT: UINT32;
let guiSHORT2HINDENT: UINT32;

// position defines
const CHAR_PROFILE_BACKGROUND_TILE_WIDTH = 125;
const CHAR_PROFILE_BACKGROUND_TILE_HEIGHT = 100;

function LoadProfileBackGround(): boolean {
  let VObjectDesc: VOBJECT_DESC;

  // this procedure will load in the graphics for the generic background

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\MetalBackGround.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBACKGROUND)));

  return true;
}

function RemoveProfileBackGround(): void {
  // remove background
  DeleteVideoObjectFromIndex(guiBACKGROUND);

  return;
}

function RenderProfileBackGround(): void {
  let hHandle: HVOBJECT;
  let iCurrentHeight: INT32 = 0;
  let iCounter: INT32 = 0;

  // this procedure will render the generic backgound to the screen

  // get the video object
  GetVideoObject(addressof(hHandle), guiBACKGROUND);

  // render each row 5 times wide, 5 tiles high
  for (iCounter = 0; iCounter < 4; iCounter++) {
    // blt background to screen from left to right
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 0 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 1 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 2 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 3 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
  }

  // dirty buttons
  MarkButtonsDirty();

  // force refresh of screen
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, 640, 480);

  return;
}

function LoadIMPSymbol(): boolean {
  // this procedure will load the IMP main symbol into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_IMPSYMBOL);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiIMPSYMBOL)));

  return true;
}

function DeleteIMPSymbol(): void {
  // remove IMP symbol
  DeleteVideoObjectFromIndex(guiIMPSYMBOL);

  return;
}

function RenderIMPSymbol(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiIMPSYMBOL);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadBeginIndent(): boolean {
  // this procedure will load the indent main symbol into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BeginScreenIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBEGININDENT)));

  return true;
}

function DeleteBeginIndent(): void {
  // remove indent symbol

  DeleteVideoObjectFromIndex(guiBEGININDENT);

  return;
}

function RenderBeginIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiBEGININDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadActivationIndent(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\ActivationIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiACTIVATIONINDENT)));

  return true;
}

function DeleteActivationIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiACTIVATIONINDENT);

  return;
}

function RenderActivationIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiACTIVATIONINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadFrontPageIndent(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\FrontPageIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFRONTPAGEINDENT)));

  return true;
}

function DeleteFrontPageIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiFRONTPAGEINDENT);

  return;
}

function RenderFrontPageIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiFRONTPAGEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAnalyse(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Analyze.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiANALYSE)));

  return true;
}

function DeleteAnalyse(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiANALYSE);

  return;
}

function RenderAnalyse(sX: INT16, sY: INT16, bImageNumber: INT8): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiANALYSE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, bImageNumber, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAttributeGraph(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Attributegraph.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiATTRIBUTEGRAPH)));

  return true;
}

function DeleteAttributeGraph(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiATTRIBUTEGRAPH);

  return;
}

function RenderAttributeGraph(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiATTRIBUTEGRAPH);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAttributeGraphBar(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\AttributegraphBar.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiATTRIBUTEGRAPHBAR)));

  return true;
}

function DeleteAttributeBarGraph(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiATTRIBUTEGRAPHBAR);

  return;
}

function RenderAttributeBarGraph(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiATTRIBUTEGRAPHBAR);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadFullNameIndent(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\FullNameIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFULLNAMEINDENT)));

  return true;
}

function DeleteFullNameIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiFULLNAMEINDENT);

  return;
}

function RenderFullNameIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiFULLNAMEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadNickNameIndent(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\NickName.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiNICKNAMEINDENT)));

  return true;
}

function DeleteNickNameIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiNICKNAMEINDENT);

  return;
}

function RenderNickNameIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiNICKNAMEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadNameIndent(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\NameIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiNAMEINDENT)));

  return true;
}

function DeleteNameIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiNAMEINDENT);

  return;
}

function RenderNameIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiNAMEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadGenderIndent(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\GenderIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiGENDERINDENT)));

  return true;
}

function DeleteGenderIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiGENDERINDENT);

  return;
}

function RenderGenderIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiGENDERINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadSmallFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\SmallFrame.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSMALLFRAME)));

  return true;
}

function DeleteSmallFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSMALLFRAME);

  return;
}

function RenderSmallFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiSMALLFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadSmallSilhouette(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\SmallSilhouette.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSMALLSILHOUETTE)));

  return true;
}

function DeleteSmallSilhouette(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSMALLSILHOUETTE);

  return;
}

function RenderSmallSilhouette(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiSMALLSILHOUETTE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadLargeSilhouette(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\largesilhouette.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiLARGESILHOUETTE)));

  return true;
}

function DeleteLargeSilhouette(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiLARGESILHOUETTE);

  return;
}

function RenderLargeSilhouette(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiLARGESILHOUETTE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAttributeFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributeframe.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiATTRIBUTEFRAME)));

  return true;
}

function DeleteAttributeFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiATTRIBUTEFRAME);

  return;
}

function RenderAttributeFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;
  let iCounter: INT32 = 0;
  let sCurrentY: INT16 = 0;

  // get the video object
  GetVideoObject(addressof(hHandle), guiATTRIBUTEFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  sCurrentY += 10;
  for (iCounter = 0; iCounter < 10; iCounter++) {
    // blt to sX, sY relative to upper left corner
    BltVideoObject(FRAME_BUFFER, hHandle, 2, LAPTOP_SCREEN_UL_X + sX + 134, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hHandle, 1, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hHandle, 3, LAPTOP_SCREEN_UL_X + sX + 368, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, null);

    sCurrentY += 20;
  }

  BltVideoObject(FRAME_BUFFER, hHandle, 4, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function RenderAttributeFrameForIndex(sX: INT16, sY: INT16, iIndex: INT32): void {
  let sCurrentY: INT16 = 0;
  let hHandle: HVOBJECT;

  // valid index?
  if (iIndex == -1) {
    return;
  }

  sCurrentY = (10 + (iIndex * 20));

  // get the video object
  GetVideoObject(addressof(hHandle), guiATTRIBUTEFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 2, LAPTOP_SCREEN_UL_X + sX + 134, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, null);

  RenderAttrib2IndentFrame(350, 42);

  // amt of bonus pts
  DrawBonusPointsRemaining();

  // render attribute boxes
  RenderAttributeBoxes();

  InvalidateRegion(LAPTOP_SCREEN_UL_X + sX + 134, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, LAPTOP_SCREEN_UL_X + sX + 400, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY + 21);

  return;
}

function LoadSliderBar(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributeslider.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSLIDERBAR)));

  return true;
}

function DeleteSliderBar(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSLIDERBAR);

  return;
}

function RenderSliderBar(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiSLIDERBAR);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadButton2Image(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\button_2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBUTTON2IMAGE)));

  return true;
}

function DeleteButton2Image(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiBUTTON2IMAGE);

  return;
}

function RenderButton2Image(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiBUTTON2IMAGE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadButton4Image(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\button_4.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBUTTON4IMAGE)));

  return true;
}

function DeleteButton4Image(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiBUTTON4IMAGE);

  return;
}

function RenderButton4Image(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiBUTTON4IMAGE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadButton1Image(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\button_1.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBUTTON1IMAGE)));

  return true;
}

function DeleteButton1Image(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiBUTTON1IMAGE);

  return;
}

function RenderButton1Image(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiBUTTON1IMAGE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadPortraitFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Voice_PortraitFrame.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiPORTRAITFRAME)));

  return true;
}

function DeletePortraitFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiPORTRAITFRAME);

  return;
}

function RenderPortraitFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiPORTRAITFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadMainIndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\mainprofilepageindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiMAININDENT)));

  return true;
}

function DeleteMainIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiMAININDENT);

  return;
}

function RenderMainIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiMAININDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadQtnLongIndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\longindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiLONGINDENT)));

  return true;
}

function DeleteQtnLongIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiLONGINDENT);

  return;
}

function RenderQtnLongIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiLONGINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadQtnShortIndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSHORTINDENT)));

  return true;
}

function DeleteQtnShortIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORTINDENT);

  return;
}

function RenderQtnShortIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiSHORTINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadQtnLongIndentHighFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\longindenthigh.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiLONGHINDENT)));

  return true;
}

function DeleteQtnLongIndentHighFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiLONGHINDENT);

  return;
}

function RenderQtnLongIndentHighFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiLONGHINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadQtnShortIndentHighFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindenthigh.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSHORTHINDENT)));

  return true;
}

function DeleteQtnShortIndentHighFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORTHINDENT);

  return;
}

function RenderQtnShortIndentHighFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiSHORTHINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadQtnIndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\questionindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiQINDENT)));

  return true;
}

function DeleteQtnIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiQINDENT);

  return;
}

function RenderQtnIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiQINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAttrib1IndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributescreenindent_1.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiA1INDENT)));

  return true;
}

function DeleteAttrib1IndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiA1INDENT);

  return;
}

function RenderAttrib1IndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiA1INDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAttrib2IndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributescreenindent_2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiA2INDENT)));

  return true;
}

function DeleteAttrib2IndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiA2INDENT);

  return;
}

function RenderAttrib2IndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiA2INDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAvgMercIndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\anaveragemercindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiAVGMERCINDENT)));

  return true;
}

function DeleteAvgMercIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiAVGMERCINDENT);

  return;
}

function RenderAvgMercIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiAVGMERCINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadAboutUsIndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\aboutusindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiABOUTUSINDENT)));

  return true;
}

function DeleteAboutUsIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiABOUTUSINDENT);

  return;
}

function RenderAboutUsIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiABOUTUSINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadQtnShort2IndentFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindent2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSHORT2INDENT)));

  return true;
}

function DeleteQtnShort2IndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORT2INDENT);

  return;
}

function RenderQtnShort2IndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiSHORT2INDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadQtnShort2IndentHighFrame(): boolean {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindent2High.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSHORT2HINDENT)));

  return true;
}

function DeleteQtnShort2IndentHighFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORT2HINDENT);

  return;
}

function RenderQtnShort2IndentHighFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(addressof(hHandle), guiSHORT2HINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

  return;
}
