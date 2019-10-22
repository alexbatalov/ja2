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

function LoadProfileBackGround(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // this procedure will load in the graphics for the generic background

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\MetalBackGround.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBACKGROUND));

  return TRUE;
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
  GetVideoObject(&hHandle, guiBACKGROUND);

  // render each row 5 times wide, 5 tiles high
  for (iCounter = 0; iCounter < 4; iCounter++) {
    // blt background to screen from left to right
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 0 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 1 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 2 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + 3 * CHAR_PROFILE_BACKGROUND_TILE_WIDTH, LAPTOP_SCREEN_WEB_UL_Y + iCounter * CHAR_PROFILE_BACKGROUND_TILE_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
  }

  // dirty buttons
  MarkButtonsDirty();

  // force refresh of screen
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, 640, 480);

  return;
}

function LoadIMPSymbol(): BOOLEAN {
  // this procedure will load the IMP main symbol into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, MLG_IMPSYMBOL);
  CHECKF(AddVideoObject(&VObjectDesc, &guiIMPSYMBOL));

  return TRUE;
}

function DeleteIMPSymbol(): void {
  // remove IMP symbol
  DeleteVideoObjectFromIndex(guiIMPSYMBOL);

  return;
}

function RenderIMPSymbol(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiIMPSYMBOL);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadBeginIndent(): BOOLEAN {
  // this procedure will load the indent main symbol into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BeginScreenIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBEGININDENT));

  return TRUE;
}

function DeleteBeginIndent(): void {
  // remove indent symbol

  DeleteVideoObjectFromIndex(guiBEGININDENT);

  return;
}

function RenderBeginIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiBEGININDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadActivationIndent(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\ActivationIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiACTIVATIONINDENT));

  return TRUE;
}

function DeleteActivationIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiACTIVATIONINDENT);

  return;
}

function RenderActivationIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiACTIVATIONINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadFrontPageIndent(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\FrontPageIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiFRONTPAGEINDENT));

  return TRUE;
}

function DeleteFrontPageIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiFRONTPAGEINDENT);

  return;
}

function RenderFrontPageIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiFRONTPAGEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAnalyse(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Analyze.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiANALYSE));

  return TRUE;
}

function DeleteAnalyse(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiANALYSE);

  return;
}

function RenderAnalyse(sX: INT16, sY: INT16, bImageNumber: INT8): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiANALYSE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, bImageNumber, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAttributeGraph(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Attributegraph.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiATTRIBUTEGRAPH));

  return TRUE;
}

function DeleteAttributeGraph(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiATTRIBUTEGRAPH);

  return;
}

function RenderAttributeGraph(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiATTRIBUTEGRAPH);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAttributeGraphBar(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\AttributegraphBar.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiATTRIBUTEGRAPHBAR));

  return TRUE;
}

function DeleteAttributeBarGraph(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiATTRIBUTEGRAPHBAR);

  return;
}

function RenderAttributeBarGraph(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiATTRIBUTEGRAPHBAR);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadFullNameIndent(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\FullNameIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiFULLNAMEINDENT));

  return TRUE;
}

function DeleteFullNameIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiFULLNAMEINDENT);

  return;
}

function RenderFullNameIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiFULLNAMEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadNickNameIndent(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\NickName.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiNICKNAMEINDENT));

  return TRUE;
}

function DeleteNickNameIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiNICKNAMEINDENT);

  return;
}

function RenderNickNameIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiNICKNAMEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadNameIndent(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\NameIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiNAMEINDENT));

  return TRUE;
}

function DeleteNameIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiNAMEINDENT);

  return;
}

function RenderNameIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiNAMEINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadGenderIndent(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\GenderIndent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiGENDERINDENT));

  return TRUE;
}

function DeleteGenderIndent(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiGENDERINDENT);

  return;
}

function RenderGenderIndent(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiGENDERINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadSmallFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\SmallFrame.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSMALLFRAME));

  return TRUE;
}

function DeleteSmallFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSMALLFRAME);

  return;
}

function RenderSmallFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiSMALLFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadSmallSilhouette(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\SmallSilhouette.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSMALLSILHOUETTE));

  return TRUE;
}

function DeleteSmallSilhouette(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSMALLSILHOUETTE);

  return;
}

function RenderSmallSilhouette(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiSMALLSILHOUETTE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadLargeSilhouette(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\largesilhouette.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiLARGESILHOUETTE));

  return TRUE;
}

function DeleteLargeSilhouette(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiLARGESILHOUETTE);

  return;
}

function RenderLargeSilhouette(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiLARGESILHOUETTE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAttributeFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributeframe.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiATTRIBUTEFRAME));

  return TRUE;
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
  GetVideoObject(&hHandle, guiATTRIBUTEFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  sCurrentY += 10;
  for (iCounter = 0; iCounter < 10; iCounter++) {
    // blt to sX, sY relative to upper left corner
    BltVideoObject(FRAME_BUFFER, hHandle, 2, LAPTOP_SCREEN_UL_X + sX + 134, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(FRAME_BUFFER, hHandle, 1, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(FRAME_BUFFER, hHandle, 3, LAPTOP_SCREEN_UL_X + sX + 368, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, NULL);

    sCurrentY += 20;
  }

  BltVideoObject(FRAME_BUFFER, hHandle, 4, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, NULL);

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
  GetVideoObject(&hHandle, guiATTRIBUTEFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 2, LAPTOP_SCREEN_UL_X + sX + 134, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, VO_BLT_SRCTRANSPARENCY, NULL);

  RenderAttrib2IndentFrame(350, 42);

  // amt of bonus pts
  DrawBonusPointsRemaining();

  // render attribute boxes
  RenderAttributeBoxes();

  InvalidateRegion(LAPTOP_SCREEN_UL_X + sX + 134, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY, LAPTOP_SCREEN_UL_X + sX + 400, LAPTOP_SCREEN_WEB_UL_Y + sY + sCurrentY + 21);

  return;
}

function LoadSliderBar(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributeslider.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSLIDERBAR));

  return TRUE;
}

function DeleteSliderBar(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSLIDERBAR);

  return;
}

function RenderSliderBar(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiSLIDERBAR);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadButton2Image(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\button_2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBUTTON2IMAGE));

  return TRUE;
}

function DeleteButton2Image(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiBUTTON2IMAGE);

  return;
}

function RenderButton2Image(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiBUTTON2IMAGE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadButton4Image(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\button_4.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBUTTON4IMAGE));

  return TRUE;
}

function DeleteButton4Image(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiBUTTON4IMAGE);

  return;
}

function RenderButton4Image(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiBUTTON4IMAGE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadButton1Image(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\button_1.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBUTTON1IMAGE));

  return TRUE;
}

function DeleteButton1Image(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiBUTTON1IMAGE);

  return;
}

function RenderButton1Image(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiBUTTON1IMAGE);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadPortraitFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Voice_PortraitFrame.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiPORTRAITFRAME));

  return TRUE;
}

function DeletePortraitFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiPORTRAITFRAME);

  return;
}

function RenderPortraitFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiPORTRAITFRAME);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadMainIndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\mainprofilepageindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiMAININDENT));

  return TRUE;
}

function DeleteMainIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiMAININDENT);

  return;
}

function RenderMainIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiMAININDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadQtnLongIndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\longindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiLONGINDENT));

  return TRUE;
}

function DeleteQtnLongIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiLONGINDENT);

  return;
}

function RenderQtnLongIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiLONGINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadQtnShortIndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSHORTINDENT));

  return TRUE;
}

function DeleteQtnShortIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORTINDENT);

  return;
}

function RenderQtnShortIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiSHORTINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadQtnLongIndentHighFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\longindenthigh.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiLONGHINDENT));

  return TRUE;
}

function DeleteQtnLongIndentHighFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiLONGHINDENT);

  return;
}

function RenderQtnLongIndentHighFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiLONGHINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadQtnShortIndentHighFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindenthigh.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSHORTHINDENT));

  return TRUE;
}

function DeleteQtnShortIndentHighFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORTHINDENT);

  return;
}

function RenderQtnShortIndentHighFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiSHORTHINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadQtnIndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\questionindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiQINDENT));

  return TRUE;
}

function DeleteQtnIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiQINDENT);

  return;
}

function RenderQtnIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiQINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAttrib1IndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributescreenindent_1.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiA1INDENT));

  return TRUE;
}

function DeleteAttrib1IndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiA1INDENT);

  return;
}

function RenderAttrib1IndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiA1INDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAttrib2IndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\attributescreenindent_2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiA2INDENT));

  return TRUE;
}

function DeleteAttrib2IndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiA2INDENT);

  return;
}

function RenderAttrib2IndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiA2INDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAvgMercIndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\anaveragemercindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiAVGMERCINDENT));

  return TRUE;
}

function DeleteAvgMercIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiAVGMERCINDENT);

  return;
}

function RenderAvgMercIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiAVGMERCINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadAboutUsIndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\aboutusindent.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiABOUTUSINDENT));

  return TRUE;
}

function DeleteAboutUsIndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiABOUTUSINDENT);

  return;
}

function RenderAboutUsIndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiABOUTUSINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadQtnShort2IndentFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindent2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSHORT2INDENT));

  return TRUE;
}

function DeleteQtnShort2IndentFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORT2INDENT);

  return;
}

function RenderQtnShort2IndentFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiSHORT2INDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function LoadQtnShort2IndentHighFrame(): BOOLEAN {
  // this procedure will load the activation indent into memory
  let VObjectDesc: VOBJECT_DESC;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\shortindent2High.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiSHORT2HINDENT));

  return TRUE;
}

function DeleteQtnShort2IndentHighFrame(): void {
  // remove activation indent symbol
  DeleteVideoObjectFromIndex(guiSHORT2HINDENT);

  return;
}

function RenderQtnShort2IndentHighFrame(sX: INT16, sY: INT16): void {
  let hHandle: HVOBJECT;

  // get the video object
  GetVideoObject(&hHandle, guiSHORT2HINDENT);

  // blt to sX, sY relative to upper left corner
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}
