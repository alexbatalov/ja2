let gfAniEditMode: BOOLEAN = FALSE;
/* static */ let usStartAnim: UINT16 = 0;
/* static */ let ubStartHeight: UINT8 = 0;
/* static */ let pSoldier: Pointer<SOLDIERTYPE>;

/* static */ let fOKFiles: BOOLEAN = FALSE;
/* static */ let ubNumStates: UINT8 = 0;
/* static */ let pusStates: Pointer<UINT16> = NULL;
/* static */ let ubCurLoadedState: INT8 = 0;

function CycleAnimations(): void {
  let cnt: INT32;

  // FInd the next animation with start height the same...
  for (cnt = usStartAnim + 1; cnt < NUMANIMATIONSTATES; cnt++) {
    if (gAnimControl[cnt].ubHeight == ubStartHeight) {
      usStartAnim = cnt;
      EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, TRUE);
      return;
    }
  }

  usStartAnim = 0;
  EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, TRUE);
}

function AniEditScreenInit(): UINT32 {
  return TRUE;
}

// The ShutdownGame function will free up/undo all things that were started in InitializeGame()
// It will also be responsible to making sure that all Gaming Engine tasks exit properly

function AniEditScreenShutdown(): UINT32 {
  return TRUE;
}

function AniEditScreenHandle(): UINT32 {
  let InputEvent: InputAtom;
  /* static */ let fFirstTime: BOOLEAN = TRUE;
  /* static */ let usOldState: UINT16;
  /* static */ let fToggle: BOOLEAN = FALSE;
  /* static */ let fToggle2: BOOLEAN = FALSE;

  //	EV_S_SETPOSITION SSetPosition;

  // Make backups
  if (fFirstTime) {
    gfAniEditMode = TRUE;

    usStartAnim = 0;
    ubStartHeight = ANIM_STAND;

    fFirstTime = FALSE;
    fToggle = FALSE;
    fToggle2 = FALSE;
    ubCurLoadedState = 0;

    pSoldier = MercPtrs[gusSelectedSoldier];

    gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

    EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, TRUE);

    BuildListFile();
  }

  /////////////////////////////////////////////////////
  StartFrameBufferRender();

  RenderWorld();

  ExecuteBaseDirtyRectQueue();

  /////////////////////////////////////////////////////
  EndFrameBufferRender();

  SetFont(LARGEFONT1);
  mprintf(0, 0, "SOLDIER ANIMATION VIEWER");
  gprintfdirty(0, 0, "SOLDIER ANIMATION VIEWER");

  mprintf(0, 20, "Current Animation: %S %S", gAnimControl[usStartAnim].zAnimStr, gAnimSurfaceDatabase[pSoldier->usAnimSurface].Filename);
  gprintfdirty(0, 20, "Current Animation: %S %S", gAnimControl[usStartAnim].zAnimStr, gAnimSurfaceDatabase[pSoldier->usAnimSurface].Filename);

  switch (ubStartHeight) {
    case ANIM_STAND:

      mprintf(0, 40, "Current Stance: STAND");
      break;

    case ANIM_CROUCH:

      mprintf(0, 40, "Current Stance: CROUCH");
      break;

    case ANIM_PRONE:

      mprintf(0, 40, "Current Stance: PRONE");
      break;
  }
  gprintfdirty(0, 40, "Current Animation: %S", gAnimControl[usStartAnim].zAnimStr);

  if (fToggle) {
    mprintf(0, 60, "FORCE ON");
    gprintfdirty(0, 60, "FORCE OFF");
  }

  if (fToggle2) {
    mprintf(0, 70, "LOADED ORDER ON");
    gprintfdirty(0, 70, "LOADED ORDER ON");

    mprintf(0, 90, "LOADED ORDER : %S", gAnimControl[pusStates[ubCurLoadedState]].zAnimStr);
    gprintfdirty(0, 90, "LOADED ORDER : %S", gAnimControl[pusStates[ubCurLoadedState]].zAnimStr);
  }

  if (DequeueEvent(&InputEvent) == TRUE) {
    if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ESC)) {
      fFirstTime = TRUE;

      gfAniEditMode = FALSE;

      fFirstTimeInGameScreen = TRUE;

      gTacticalStatus.uiFlags &= (~LOADING_SAVED_GAME);

      if (fOKFiles) {
        MemFree(pusStates);
      }

      fOKFiles = FALSE;

      return GAME_SCREEN;
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == SPACE)) {
      if (!fToggle && !fToggle2) {
        CycleAnimations();
      }
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == 's')) {
      if (!fToggle) {
        let usAnim: UINT16 = 0;
        usOldState = usStartAnim;

        switch (ubStartHeight) {
          case ANIM_STAND:

            usAnim = STANDING;
            break;

          case ANIM_CROUCH:

            usAnim = CROUCHING;
            break;

          case ANIM_PRONE:

            usAnim = PRONE;
            break;
        }

        EVENT_InitNewSoldierAnim(pSoldier, usAnim, 0, TRUE);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, usOldState, 0, TRUE);
      }

      fToggle = !fToggle;
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == 'l')) {
      if (!fToggle2) {
        usOldState = usStartAnim;

        EVENT_InitNewSoldierAnim(pSoldier, pusStates[ubCurLoadedState], 0, TRUE);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, usOldState, 0, TRUE);
      }

      fToggle2 = !fToggle2;
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == PGUP)) {
      if (fOKFiles && fToggle2) {
        ubCurLoadedState++;

        if (ubCurLoadedState == ubNumStates) {
          ubCurLoadedState = 0;
        }

        EVENT_InitNewSoldierAnim(pSoldier, pusStates[ubCurLoadedState], 0, TRUE);
      }
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == PGDN)) {
      if (fOKFiles && fToggle2) {
        ubCurLoadedState--;

        if (ubCurLoadedState == 0) {
          ubCurLoadedState = ubNumStates;
        }

        EVENT_InitNewSoldierAnim(pSoldier, pusStates[ubCurLoadedState], 0, TRUE);
      }
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == 'c')) {
      // CLEAR!
      usStartAnim = 0;
      EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, TRUE);
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == ENTER)) {
      if (ubStartHeight == ANIM_STAND) {
        ubStartHeight = ANIM_CROUCH;
      } else if (ubStartHeight == ANIM_CROUCH) {
        ubStartHeight = ANIM_PRONE;
      } else {
        ubStartHeight = ANIM_STAND;
      }
    }
  }

  return ANIEDIT_SCREEN;
}

function GetAnimStateFromName(zName: Pointer<INT8>): UINT16 {
  let cnt: INT32;

  // FInd the next animation with start height the same...
  for (cnt = 0; cnt < NUMANIMATIONSTATES; cnt++) {
    if (stricmp(gAnimControl[cnt].zAnimStr, zName) == 0) {
      return cnt;
    }
  }

  return 5555;
}

function BuildListFile(): void {
  let infoFile: Pointer<FILE>;
  let currFilename: char[] /* [128] */;
  let numEntries: int = 0;
  let cnt: int;
  let usState: UINT16;
  let zError: INT16[] /* [128] */;

  // Verify the existance of the header text file.
  infoFile = fopen("ANITEST.DAT", "rb");
  if (!infoFile) {
    return;
  }
  // count STIs inside header and verify each one's existance.
  while (!feof(infoFile)) {
    fgets(currFilename, 128, infoFile);
    // valid entry in header, continue on...

    numEntries++;
  }
  fseek(infoFile, 0, SEEK_SET); // reset header file

  // Allocate array
  pusStates = MemAlloc(sizeof(UINT16) * numEntries);

  fOKFiles = TRUE;

  cnt = 0;
  while (!feof(infoFile)) {
    fgets(currFilename, 128, infoFile);

    // Remove newline
    currFilename[strlen(currFilename) - 1] = '\0';
    currFilename[strlen(currFilename) - 1] = '\0';

    usState = GetAnimStateFromName(currFilename);

    if (usState != 5555) {
      cnt++;
      ubNumStates = cnt;
      pusStates[cnt] = usState;
    } else {
      swprintf(zError, "Animation str %S is not known: ", currFilename);
      DoMessageBox(MSG_BOX_BASIC_STYLE, zError, ANIEDIT_SCREEN, MSG_BOX_FLAG_YESNO, NULL, NULL);
      fclose(infoFile);
      return;
    }
  }
}
