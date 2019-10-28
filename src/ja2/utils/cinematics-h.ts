namespace ja2 {

export interface SMKFLIC {
  cFilename: string /* Pointer<CHAR8> */;
  //		HFILE										hFileHandle;
  hFileHandle: HWFILE;
  SmackHandle: Pointer<Smack>;
  SmackBuffer: Pointer<SmackBuf>;
  uiFlags: UINT32;
  lpDDS: LPDIRECTDRAWSURFACE2;
  hWindow: HWND;
  uiFrame: UINT32;

  uiLeft: UINT32;
  uiTop: UINT32;
}

/*
//--------------------------------------------------------------------------
// Prototypes etc. for our functions that make use of the Smacker library.
//
// Written by Derek Beland, Jan 11, 1995

#define FLICSOUNDID		"BLAH"	// ID for smack flic w/ sound :)

interface SMPLARRAY {

  long: unsigned;
  offset: unsigned;

  long: unsigned;
  length: unsigned;
}

extern SmackBuf *sbuf;
extern Smack *smk;
extern int smktag;
extern HANDLE smkhandle;
extern int SmackFlicIsOpened;
extern int SmackFlicIsPlaying;


HANDLE OpenSmackFlic(char *fname,Smack **s,u32);
int GetNextCue(void);
void PlayCueSamples(void);
void InitFlicSamples(HANDLE fhandle);
void FreeFlicSamples(void);

int SmackPlayFlic(char *,u32);
void SmackShowNextFrame(void);
void CloseSmackFlic(void);
void InitPal(HWND wh);
*/

}
