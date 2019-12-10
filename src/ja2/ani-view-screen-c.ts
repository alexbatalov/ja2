namespace ja2 {

const fs: typeof import('fs') = require('fs');

export let gfAniEditMode: boolean = false;
/* static */ let usStartAnim: UINT16 = 0;
/* static */ let ubStartHeight: UINT8 = 0;
/* static */ let pSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;

/* static */ let fOKFiles: boolean = false;
/* static */ let ubNumStates: UINT8 = 0;
/* static */ let pusStates: UINT16[] /* Pointer<UINT16> */ = <UINT16[]><unknown>null;
/* static */ let ubCurLoadedState: INT8 = 0;

function CycleAnimations(): void {
  let cnt: INT32;

  // FInd the next animation with start height the same...
  for (cnt = usStartAnim + 1; cnt < Enum193.NUMANIMATIONSTATES; cnt++) {
    if (gAnimControl[cnt].ubHeight == ubStartHeight) {
      usStartAnim = cnt;
      EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, true);
      return;
    }
  }

  usStartAnim = 0;
  EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, true);
}

export function AniEditScreenInit(): boolean {
  return true;
}

// The ShutdownGame function will free up/undo all things that were started in InitializeGame()
// It will also be responsible to making sure that all Gaming Engine tasks exit properly

export function AniEditScreenShutdown(): boolean {
  return true;
}

/* static */ let AniEditScreenHandle__fFirstTime: boolean = true;
/* static */ let AniEditScreenHandle__usOldState: UINT16;
/* static */ let AniEditScreenHandle__fToggle: boolean = false;
/* static */ let AniEditScreenHandle__fToggle2: boolean = false;
export function AniEditScreenHandle(): UINT32 {
  let InputEvent: InputAtom = createInputAtom();

  //	EV_S_SETPOSITION SSetPosition;

  // Make backups
  if (AniEditScreenHandle__fFirstTime) {
    gfAniEditMode = true;

    usStartAnim = 0;
    ubStartHeight = ANIM_STAND;

    AniEditScreenHandle__fFirstTime = false;
    AniEditScreenHandle__fToggle = false;
    AniEditScreenHandle__fToggle2 = false;
    ubCurLoadedState = 0;

    pSoldier = MercPtrs[gusSelectedSoldier];

    gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

    EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, true);

    BuildListFile();
  }

  /////////////////////////////////////////////////////
  StartFrameBufferRender();

  RenderWorld();

  ExecuteBaseDirtyRectQueue();

  /////////////////////////////////////////////////////
  EndFrameBufferRender();

  SetFont(LARGEFONT1());
  mprintf(0, 0, "SOLDIER ANIMATION VIEWER");
  gprintfdirty(0, 0, "SOLDIER ANIMATION VIEWER");

  mprintf(0, 20, "Current Animation: %S %S", gAnimControl[usStartAnim].zAnimStr, gAnimSurfaceDatabase[pSoldier.usAnimSurface].Filename);
  gprintfdirty(0, 20, "Current Animation: %S %S", gAnimControl[usStartAnim].zAnimStr, gAnimSurfaceDatabase[pSoldier.usAnimSurface].Filename);

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

  if (AniEditScreenHandle__fToggle) {
    mprintf(0, 60, "FORCE ON");
    gprintfdirty(0, 60, "FORCE OFF");
  }

  if (AniEditScreenHandle__fToggle2) {
    mprintf(0, 70, "LOADED ORDER ON");
    gprintfdirty(0, 70, "LOADED ORDER ON");

    mprintf(0, 90, "LOADED ORDER : %S", gAnimControl[pusStates[ubCurLoadedState]].zAnimStr);
    gprintfdirty(0, 90, "LOADED ORDER : %S", gAnimControl[pusStates[ubCurLoadedState]].zAnimStr);
  }

  if (DequeueEvent(InputEvent) == true) {
    if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ESC)) {
      AniEditScreenHandle__fFirstTime = true;

      gfAniEditMode = false;

      fFirstTimeInGameScreen = true;

      gTacticalStatus.uiFlags &= (~LOADING_SAVED_GAME);

      if (fOKFiles) {
        pusStates = <UINT16[]><unknown>null;
      }

      fOKFiles = false;

      return Enum26.GAME_SCREEN;
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == SPACE)) {
      if (!AniEditScreenHandle__fToggle && !AniEditScreenHandle__fToggle2) {
        CycleAnimations();
      }
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == 's'.charCodeAt(0))) {
      if (!AniEditScreenHandle__fToggle) {
        let usAnim: UINT16 = 0;
        AniEditScreenHandle__usOldState = usStartAnim;

        switch (ubStartHeight) {
          case ANIM_STAND:

            usAnim = Enum193.STANDING;
            break;

          case ANIM_CROUCH:

            usAnim = Enum193.CROUCHING;
            break;

          case ANIM_PRONE:

            usAnim = Enum193.PRONE;
            break;
        }

        EVENT_InitNewSoldierAnim(pSoldier, usAnim, 0, true);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, AniEditScreenHandle__usOldState, 0, true);
      }

      AniEditScreenHandle__fToggle = !AniEditScreenHandle__fToggle;
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == 'l'.charCodeAt(0))) {
      if (!AniEditScreenHandle__fToggle2) {
        AniEditScreenHandle__usOldState = usStartAnim;

        EVENT_InitNewSoldierAnim(pSoldier, pusStates[ubCurLoadedState], 0, true);
      } else {
        EVENT_InitNewSoldierAnim(pSoldier, AniEditScreenHandle__usOldState, 0, true);
      }

      AniEditScreenHandle__fToggle2 = !AniEditScreenHandle__fToggle2;
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == PGUP)) {
      if (fOKFiles && AniEditScreenHandle__fToggle2) {
        ubCurLoadedState++;

        if (ubCurLoadedState == ubNumStates) {
          ubCurLoadedState = 0;
        }

        EVENT_InitNewSoldierAnim(pSoldier, pusStates[ubCurLoadedState], 0, true);
      }
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == PGDN)) {
      if (fOKFiles && AniEditScreenHandle__fToggle2) {
        ubCurLoadedState--;

        if (ubCurLoadedState == 0) {
          ubCurLoadedState = ubNumStates;
        }

        EVENT_InitNewSoldierAnim(pSoldier, pusStates[ubCurLoadedState], 0, true);
      }
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == 'c'.charCodeAt(0))) {
      // CLEAR!
      usStartAnim = 0;
      EVENT_InitNewSoldierAnim(pSoldier, usStartAnim, 0, true);
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

  return Enum26.ANIEDIT_SCREEN;
}

function GetAnimStateFromName(zName: string /* Pointer<INT8> */): UINT16 {
  let cnt: INT32;

  // FInd the next animation with start height the same...
  for (cnt = 0; cnt < Enum193.NUMANIMATIONSTATES; cnt++) {
    if (gAnimControl[cnt].zAnimStr.toLowerCase() === zName.toLowerCase()) {
      return cnt;
    }
  }

  return 5555;
}

function BuildListFile(): void {
  let infoFile: number;
  let currFilename: string /* char[128] */;
  let numEntries: number = 0;
  let cnt: number;
  let usState: UINT16;
  let zError: string /* INT16[128] */;

  // Verify the existance of the header text file.
  if (!fs.existsSync('ANITEST.DAT')) {
    return;
  }

  // count STIs inside header and verify each one's existance.
  const fileNames = fs.readFileSync('ANITEST.DAT', { encoding: 'ascii' }).split('\n');
  numEntries = fileNames.length;

  // Allocate array
  pusStates = createArray(numEntries, 0);

  fOKFiles = true;

  cnt = 0;
  for (currFilename of fileNames) {
    usState = GetAnimStateFromName(currFilename);

    if (usState != 5555) {
      cnt++;
      ubNumStates = cnt;
      pusStates[cnt] = usState;
    } else {
      zError = swprintf("Animation str %S is not known: ", currFilename);
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zError, Enum26.ANIEDIT_SCREEN, MSG_BOX_FLAG_YESNO, null, null);
      return;
    }
  }
}

}
