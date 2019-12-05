namespace ja2 {

const MAX_ON_DUTY_SOLDIERS = 6;

/////////////////////////////////////////////////////////////////////////////////////
//											UI SYSTEM DESCRIPTION
//
//	The UI system here decouples event determination from event execution. IN other words,
//	first any user input is gathered and analysed for an event to happen. Once the event is determined,
//	it is then executed. For example, if the left mouse button is used to select a guy, it does not
//  execute the code to selected the guy, rather it sets a flag to a particular event, in this case
//	the I_SELECT_MERC event is set. The code then executes this event after all input is analysed. In
//  this way, more than one input method from the user will cause the came event to occur and hence no
//  duplication of code. Also, events have cetain charactoristics. The select merc event is executed just
//  once and then returns to the previous event. Most events are set to run continuously until new
//  input changes to another event. Other events have a 'SNAP-BACK' feature which snap the mouse back to
//  it's position before the event was executed.  Another issue is UI modes. In order to filter out input
//  depending on other flags, for example we do not want to cancel the confirm when a user moves to another
//	tile unless we are in the 'confirm' mode.  This could be done by flags ( and in effect it is ) where
//  if staements are used, but here at input collection time, we can switch on our current mode to handle
//  input differently based on the mode. Doing it this way also allows us to group certain commands togther
//  like menu commands which are initialized and deleted in the same manner.
//
//	UI_EVENTS
/////////////
//
//	UI_EVENTS have flags to itendtify themselves with special charactoristics, a UI_MODE catagory which
//  signifies the UI mode this event will cause the system to move to. Also, a pointer to a handle function is
//  used to actually handle the particular event. UI_EVENTS also have a couple of param variables and a number
//  of boolean flags used during run-time to determine states of events.
//
////////////////////////////////////////////////////////////////////////////////////////////////

// LOCAL DEFINES
const GO_MOVE_ONE = 40;
const GO_MOVE_TWO = 80;
const GO_MOVE_THREE = 100;

let gsTreeRevealXPos: INT16;
let gsTreeRevealYPos: INT16;

let gpRequesterMerc: SOLDIERTYPE | null /* Pointer<SOLDIERTYPE> */ = null;
let gpRequesterTargetMerc: SOLDIERTYPE | null /* Pointer<SOLDIERTYPE> */ = null;
let gsRequesterGridNo: INT16;
let gsOverItemsGridNo: INT16 = NOWHERE;
let gsOverItemsLevel: INT16 = 0;
let gfUIInterfaceSetBusy: boolean = false;
let guiUIInterfaceBusyTime: UINT32 = 0;

let gfTacticalForceNoCursor: boolean /* UINT32 */ = false;
let gpInvTileThatCausedMoveConfirm: LEVELNODE /* Pointer<LEVELNODE> */;
export let gfResetUIMovementOptimization: boolean = false;
let gfResetUIItemCursorOptimization: boolean = false;
let gfBeginVehicleCursor: boolean = false;
let gsOutOfRangeGridNo: UINT16 = NOWHERE;
let gubOutOfRangeMerc: UINT8 = NOBODY;
let gfOKForExchangeCursor: boolean = false;
let guiUIInterfaceSwapCursorsTime: UINT32 = 0;
export let gsJumpOverGridNo: INT16 = 0;

let gEvents: UI_EVENT[] /* [NUM_UI_EVENTS] */ = [
  createUIEventFrom(0, Enum206.IDLE_MODE, UIHandleIDoNothing, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.IDLE_MODE, UIHandleExit, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleNewMerc, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleNewBadMerc, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleSelectMerc, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleEnterEditMode, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleEnterPalEditMode, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleEndTurn, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleTestHit, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleChangeLevel, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.IDLE_MODE, UIHandleIOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.IDLE_MODE, UIHandleIChangeToIdle, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.IDLE_MODE, UIHandleILoadLevel, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleISoldierDebug, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleILOSDebug, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleILevelNodeDebug, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleIGotoDemoMode, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleILoadFirstLevel, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleILoadSecondLevel, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleILoadThirdLevel, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleILoadFourthLevel, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.DONT_CHANGEMODE, UIHandleILoadFifthLevel, false, false, 0, [ 0, 0, 0 ]),

  createUIEventFrom(0, Enum206.ENEMYS_TURN_MODE, UIHandleIETOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleIETEndTurn, false, false, 0, [ 0, 0, 0 ]),

  createUIEventFrom(0, Enum206.MOVE_MODE, UIHandleMOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.ACTION_MODE, UIHandleMChangeToAction, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.HANDCURSOR_MODE, UIHandleMChangeToHandMode, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleMCycleMovement, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.CONFIRM_MOVE_MODE, UIHandleMCycleMoveAll, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SNAPMOUSE, Enum206.ADJUST_STANCE_MODE, UIHandleMAdjustStanceMode, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.POPUP_MODE, UIHandlePOPUPMSG, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.ACTION_MODE, UIHandleAOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleAChangeToMove, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.CONFIRM_ACTION_MODE, UIHandleAChangeToConfirmAction, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleAEndAction, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SNAPMOUSE, Enum206.MENU_MODE, UIHandleMovementMenu, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SNAPMOUSE, Enum206.MENU_MODE, UIHandlePositionMenu, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.CONFIRM_MOVE_MODE, UIHandleCWait, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleCMoveMerc, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.CONFIRM_MOVE_MODE, UIHandleCOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.MOVE_MODE, UIHandlePADJAdjustStance, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.CONFIRM_ACTION_MODE, UIHandleCAOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.ACTION_MODE, UIHandleCAMercShoot, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.ACTION_MODE, UIHandleCAEndConfirmAction, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.HANDCURSOR_MODE, UIHandleHCOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.GETTINGITEM_MODE, UIHandleHCGettingItem, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.LOOKCURSOR_MODE, UIHandleLCOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.LOOKCURSOR_MODE, UIHandleLCChangeToLook, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleLCLook, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.TALKINGMENU_MODE, UIHandleTATalkingMenu, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.TALKCURSOR_MODE, UIHandleTOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.TALKCURSOR_MODE, UIHandleTChangeToTalking, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.LOCKUI_MODE, UIHandleLUIOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.LOCKUI_MODE, UIHandleLUIBeginLock, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleLUIEndLock, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.OPENDOOR_MENU_MODE, UIHandleOpenDoorMenu, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.LOCKOURTURN_UI_MODE, UIHandleLAOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.LOCKOURTURN_UI_MODE, UIHandleLABeginLockOurTurn, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(UIEVENT_SINGLEEVENT, Enum206.MOVE_MODE, UIHandleLAEndLockOurTurn, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.EXITSECTORMENU_MODE, UIHandleEXExitSectorMenu, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.RUBBERBAND_MODE, UIHandleRubberBandOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.JUMPOVER_MODE, UIHandleJumpOverOnTerrain, false, false, 0, [ 0, 0, 0 ]),
  createUIEventFrom(0, Enum206.MOVE_MODE, UIHandleJumpOver, false, false, 0, [ 0, 0, 0 ]),
];

export let gCurrentUIMode: UI_MODE = Enum206.IDLE_MODE;
let gOldUIMode: UI_MODE = Enum206.IDLE_MODE;
export let guiCurrentEvent: UINT32 = Enum207.I_DO_NOTHING;
export let guiCurrentEvent__Pointer = createPointer(() => guiCurrentEvent, (v) => guiCurrentEvent = v);
let guiOldEvent: UINT32 = Enum207.I_DO_NOTHING;
export let guiCurrentUICursor: UINT32 = Enum210.NO_UICURSOR;
let guiNewUICursor: UINT32 = Enum210.NORMAL_SNAPUICURSOR;
export let guiPendingOverrideEvent: UINT32 = Enum207.I_DO_NOTHING;
let gusSavedMouseX: UINT16;
let gusSavedMouseY: UINT16;
export let gUIKeyboardHook: UIKEYBOARD_HOOK | null = null;
export let gUIActionModeChangeDueToMouseOver: boolean = false;

let gfDisplayTimerCursor: boolean = false;
let guiTimerCursorID: UINT32 = 0;
let guiTimerLastUpdate: UINT32 = 0;
let guiTimerCursorDelay: UINT32 = 0;

export let gzLocation: string /* INT16[20] */;
let gfLocation: boolean = false;

export let gzIntTileLocation: string /* INT16[20] */;
export let gfUIIntTileLocation: boolean;

export let gzIntTileLocation2: string /* INT16[20] */;
export let gfUIIntTileLocation2: boolean;

export let gDisableRegion: MOUSE_REGION = createMouseRegion();
export let gfDisableRegionActive: boolean = false;

export let gUserTurnRegion: MOUSE_REGION = createMouseRegion();
export let gfUserTurnRegionActive: boolean = false;

// For use with mouse button query routines
export let fRightButtonDown: boolean = false;
export let fLeftButtonDown: boolean = false;
export let fIgnoreLeftUp: boolean = false;

let gUITargetReady: boolean = false;
export let gUITargetShotWaiting: boolean = false;
let gsUITargetShotGridNo: UINT16 = NOWHERE;
export let gUIUseReverse: boolean = false;

export let gRubberBandRect: SGPRect = createSGPRectFrom(0, 0, 0, 0);
export let gRubberBandActive: boolean = false;
export let gfIgnoreOnSelectedGuy: boolean = false;
let gfViewPortAdjustedForSouth: boolean = false;

let guiCreateGuyIndex: INT16 = 0;
// Temp values for placing bad guys
let guiCreateBadGuyIndex: INT16 = 8;

// FLAGS
// These flags are set for a single frame execution and then are reset for the next iteration.
export let gfUIDisplayActionPoints: boolean = false;
export let gfUIDisplayActionPointsInvalid: boolean = false;
export let gfUIDisplayActionPointsBlack: boolean = false;
export let gfUIDisplayActionPointsCenter: boolean = false;

export let gUIDisplayActionPointsOffY: INT16 = 0;
export let gUIDisplayActionPointsOffX: INT16 = 0;
let gfUIDoNotHighlightSelMerc: boolean = false;
export let gfUIHandleSelection: UINT8 /* boolean */ = 0;
export let gfUIHandleSelectionAboveGuy: boolean = false;
export let gfUIInDeadlock: boolean = false;
export let gUIDeadlockedSoldier: UINT8 = NOBODY;
export let gfUIHandleShowMoveGrid: UINT8 /* boolean */ = 0;
export let gsUIHandleShowMoveGridLocation: UINT16 = NOWHERE;
export let gfUIOverItemPool: boolean = false;
export let gfUIOverItemPoolGridNo: INT16 = 0;
export let gsCurrentActionPoints: INT16 = 1;
export let gfUIHandlePhysicsTrajectory: boolean = false;
export let gfUIMouseOnValidCatcher: UINT8 /* boolean */ = 0;
export let gubUIValidCatcherID: UINT8 = 0;

export let gfUIConfirmExitArrows: boolean = false;

export let gfUIShowCurIntTile: boolean = false;

export let gfUIWaitingForUserSpeechAdvance: boolean = false; // Waiting for key input/mouse click to advance speech
let gfUIKeyCheatModeOn: boolean = false; // Sets cool cheat keys on
export let gfUIAllMoveOn: UINT8 /* boolean */ = 0; // Sets to all move
export let gfUICanBeginAllMoveCycle: boolean = false; // GEts set so we know that the next right-click is a move-call inc\stead of a movement cycle through

export let gsSelectedGridNo: INT16 = 0;
export let gsSelectedLevel: INT16 = Enum214.I_GROUND_LEVEL;
export let gsSelectedGuy: INT16 = NO_SOLDIER;

let gfUIDisplayDamage: boolean = false;
let gbDamage: INT8 = 0;
let gsDamageGridNo: UINT16 = 0;

export let gfUIRefreshArrows: boolean = false;

// Thse flags are not re-set after each frame
export let gfPlotNewMovement: boolean = false;
let gfPlotNewMovementNOCOST: boolean = false;
export let guiShowUPDownArrows: UINT32 = ARROWS_HIDE_UP | ARROWS_HIDE_DOWN;
let gbAdjustStanceDiff: INT8 = 0;
let gbClimbID: INT8 = 0;

export let gfUIShowExitEast: boolean = false;
export let gfUIShowExitWest: boolean = false;
export let gfUIShowExitNorth: boolean = false;
export let gfUIShowExitSouth: boolean = false;
let gfUIShowExitExitGrid: boolean = false;

let gfUINewStateForIntTile: boolean = false;

export let gfUIForceReExamineCursorData: boolean = false;

// MAIN TACTICAL UI HANDLER
/* static */ let HandleTacticalUI__pOldIntTile: LEVELNODE | null /* Pointer<LEVELNODE> */;
export function HandleTacticalUI(): UINT32 {
  let ReturnVal: UINT32 = Enum26.GAME_SCREEN;
  let uiNewEvent: UINT32 = 0;
  let uiNewEvent__Pointer = createPointer(() => uiNewEvent, (v) => uiNewEvent = v);
  let usMapPos: UINT16 = 0;
  let pIntTile: LEVELNODE | null;

  // RESET FLAGS
  gfUIDisplayActionPoints = false;
  gfUIDisplayActionPointsInvalid = false;
  gfUIDisplayActionPointsBlack = false;
  gfUIDisplayActionPointsCenter = false;
  gfUIDoNotHighlightSelMerc = false;
  gfUIHandleSelection = NO_GUY_SELECTION;
  gfUIHandleSelectionAboveGuy = false;
  gfUIDisplayDamage = false;
  guiShowUPDownArrows = ARROWS_HIDE_UP | ARROWS_HIDE_DOWN;
  gfUIBodyHitLocation = false;
  gfUIIntTileLocation = false;
  gfUIIntTileLocation2 = false;
  // gfUIForceReExamineCursorData		= FALSE;
  gfUINewStateForIntTile = false;
  gfUIShowExitExitGrid = false;
  gfUIOverItemPool = false;
  gfUIHandlePhysicsTrajectory = false;
  gfUIMouseOnValidCatcher = 0;
  gfIgnoreOnSelectedGuy = false;

  // Set old event value
  guiOldEvent = uiNewEvent = guiCurrentEvent;

  if (gfUIInterfaceSetBusy) {
    if ((GetJA2Clock() - guiUIInterfaceBusyTime) > 25000) {
      gfUIInterfaceSetBusy = false;

      // UNLOCK UI
      UnSetUIBusy(gusSelectedSoldier);

      // Decrease global busy  counter...
      gTacticalStatus.ubAttackBusyCount = 0;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Setting attack busy count to 0 due to ending AI lock"));

      guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
      UIHandleLUIEndLock(null);
    }
  }

  if ((GetJA2Clock() - guiUIInterfaceSwapCursorsTime) > 1000) {
    gfOKForExchangeCursor = !gfOKForExchangeCursor;
    guiUIInterfaceSwapCursorsTime = GetJA2Clock();
  }

  // OK, do a check for on an int tile...
  pIntTile = GetCurInteractiveTile();

  if (pIntTile != HandleTacticalUI__pOldIntTile) {
    gfUINewStateForIntTile = true;

    HandleTacticalUI__pOldIntTile = pIntTile;
  }

  if (guiPendingOverrideEvent == Enum207.I_DO_NOTHING) {
    // When we are here, guiCurrentEvent is set to the last event
    // Within the input gathering phase, it may change

    // GATHER INPUT
    // Any new event will overwrite previous events. Therefore,
    // PRIOTITIES GO LIKE THIS:
    //						Mouse Movement
    //						Keyboard Polling
    //						Mouse Buttons
    //						Keyboard Queued Events ( will override always )

    // SWITCH ON INPUT GATHERING, DEPENDING ON MODE
    // IF WE ARE NOT IN COMBAT OR IN REALTIME COMBAT
    if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
      // FROM MOUSE POSITION
      GetRTMousePositionInput(uiNewEvent__Pointer);
      // FROM KEYBOARD POLLING
      GetPolledKeyboardInput(uiNewEvent__Pointer);
      // FROM MOUSE CLICKS
      GetRTMouseButtonInput(uiNewEvent__Pointer);
      // FROM KEYBOARD
      GetKeyboardInput(uiNewEvent__Pointer);
    } else {
      // FROM MOUSE POSITION
      GetTBMousePositionInput(uiNewEvent__Pointer);
      // FROM KEYBOARD POLLING
      GetPolledKeyboardInput(uiNewEvent__Pointer);
      // FROM MOUSE CLICKS
      GetTBMouseButtonInput(uiNewEvent__Pointer);
      // FROM KEYBOARD
      GetKeyboardInput(uiNewEvent__Pointer);
    }
  } else {
    uiNewEvent = guiPendingOverrideEvent;
    guiPendingOverrideEvent = Enum207.I_DO_NOTHING;
  }

  if (HandleItemPickupMenu()) {
    uiNewEvent = Enum207.A_CHANGE_TO_MOVE;
  }

  // Set Current event to new one!
  guiCurrentEvent = uiNewEvent;

  // ATE: New! Get flags for over soldier or not...
  gfUIFullTargetFound = false;
  gfUISelectiveTargetFound = false;

  if (GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    // Look for soldier full
    if (FindSoldier(usMapPos, createPointer(() => gusUIFullTargetID, (v) => gusUIFullTargetID = v), createPointer(() => guiUIFullTargetFlags, (v) => guiUIFullTargetFlags = v), (FINDSOLDIERSAMELEVEL(gsInterfaceLevel)))) {
      gfUIFullTargetFound = true;
    }

    // Look for soldier selective
    if (FindSoldier(usMapPos, createPointer(() => gusUISelectiveTargetID, (v) => gusUISelectiveTargetID = v), createPointer(() => guiUISelectiveTargetFlags, (v) => guiUISelectiveTargetFlags = v), FINDSOLDIERSELECTIVESAMELEVEL(gsInterfaceLevel))) {
      gfUISelectiveTargetFound = true;
    }
  }

  // Check if current event has changed and clear event if so, to prepare it for execution
  // Clearing it does things like set first time flag, param variavles, etc
  if (uiNewEvent != guiOldEvent) {
    // Snap mouse back if it's that type
    if (gEvents[guiOldEvent].uiFlags & UIEVENT_SNAPMOUSE) {
      SimulateMouseMovement(gusSavedMouseX, gusSavedMouseY);
    }

    ClearEvent(gEvents[uiNewEvent]);
  }

  // Restore not scrolling from stance adjust....
  if (gOldUIMode == Enum206.ADJUST_STANCE_MODE) {
    gfIgnoreScrolling = false;
  }

  // IF this event is of type snap mouse, save position
  if (gEvents[uiNewEvent].uiFlags & UIEVENT_SNAPMOUSE && gEvents[uiNewEvent].fFirstTime) {
    // Save mouse position
    gusSavedMouseX = gusMouseXPos;
    gusSavedMouseY = gusMouseYPos;
  }

  // HANDLE UI EVENT
  ReturnVal = gEvents[uiNewEvent].HandleEvent(gEvents[uiNewEvent]);

  if (gfInOpenDoorMenu) {
    return ReturnVal;
  }

  // Set first time flag to false, now that it has been executed
  gEvents[uiNewEvent].fFirstTime = false;

  // Check if UI mode has changed from previous event
  if (gEvents[uiNewEvent].ChangeToUIMode != gCurrentUIMode && (gEvents[uiNewEvent].ChangeToUIMode != Enum206.DONT_CHANGEMODE)) {
    gEvents[uiNewEvent].uiMenuPreviousMode = gCurrentUIMode;

    gOldUIMode = gCurrentUIMode;

    gCurrentUIMode = gEvents[uiNewEvent].ChangeToUIMode;

    // CHANGE MODE - DO SPECIAL THINGS IF WE ENTER THIS MODE
    switch (gCurrentUIMode) {
      case Enum206.ACTION_MODE:
        ErasePath(true);
        break;
    }
  }

  // Check if menu event is done and if so set to privious mode
  // This is needed to hook into the interface stuff which sets the fDoneMenu flag
  if (gEvents[uiNewEvent].fDoneMenu == true) {
    if (gCurrentUIMode == Enum206.MENU_MODE || gCurrentUIMode == Enum206.POPUP_MODE || gCurrentUIMode == Enum206.LOOKCURSOR_MODE) {
      gCurrentUIMode = gEvents[uiNewEvent].uiMenuPreviousMode;
    }
  }
  // Check to return to privious mode
  // If the event is a single event, return to previous
  if (gEvents[uiNewEvent].uiFlags & UIEVENT_SINGLEEVENT) {
    // ATE: OK - don't revert to single event if our mouse is not
    // in viewport - rather use m_on_t event
    if ((gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
      guiCurrentEvent = guiOldEvent;
    } else {
      // ATE: Check first that some modes are met....
      if (gCurrentUIMode != Enum206.HANDCURSOR_MODE && gCurrentUIMode != Enum206.LOOKCURSOR_MODE && gCurrentUIMode != Enum206.TALKCURSOR_MODE) {
        guiCurrentEvent = Enum207.M_ON_TERRAIN;
      }
    }
  }

  // Donot display APs if not in combat
  if (!(gTacticalStatus.uiFlags & INCOMBAT) || (gTacticalStatus.uiFlags & REALTIME)) {
    gfUIDisplayActionPoints = false;
  }

  // Will set the cursor but only if different
  SetUIMouseCursor();

  // ATE: Check to reset selected guys....
  if (gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
    // If not in MOVE_MODE, CONFIRM_MOVE_MODE, RUBBERBAND_MODE, stop....
    if (gCurrentUIMode != Enum206.MOVE_MODE && gCurrentUIMode != Enum206.CONFIRM_MOVE_MODE && gCurrentUIMode != Enum206.RUBBERBAND_MODE && gCurrentUIMode != Enum206.ADJUST_STANCE_MODE && gCurrentUIMode != Enum206.TALKCURSOR_MODE && gCurrentUIMode != Enum206.LOOKCURSOR_MODE) {
      ResetMultiSelection();
    }
  }

  return ReturnVal;
}

/* static */ let SetUIMouseCursor__sOldExitGridNo: INT16 = NOWHERE;
/* static */ let SetUIMouseCursor__fOkForExit: UINT8 /* boolean */ = 0;
function SetUIMouseCursor(): void {
  let uiCursorFlags: UINT32;
  let uiTraverseTimeInMinutes: UINT32 = 0;
  let uiTraverseTimeInMinutes__Pointer = createPointer(() => uiTraverseTimeInMinutes, (v) => uiTraverseTimeInMinutes = v);
  let fForceUpdateNewCursor: boolean = false;
  let fUpdateNewCursor: boolean = true;

  // Check if we moved from confirm mode on exit arrows
  // If not in move mode, return!
  if (gCurrentUIMode == Enum206.MOVE_MODE) {
    if (gfUIConfirmExitArrows) {
      uiCursorFlags = GetCursorMovementFlags();

      if (uiCursorFlags & MOUSE_MOVING) {
        gfUIConfirmExitArrows = false;
      }
    }

    if (gfUIShowExitEast) {
      gfUIDisplayActionPoints = false;
      ErasePath(true);

      if (OKForSectorExit(Enum186.EAST_STRATEGIC_MOVE, 0, uiTraverseTimeInMinutes__Pointer)) {
        if (gfUIConfirmExitArrows) {
          guiNewUICursor = Enum210.CONFIRM_EXIT_EAST_UICURSOR;
        } else {
          guiNewUICursor = Enum210.EXIT_EAST_UICURSOR;
        }
      } else {
        guiNewUICursor = Enum210.NOEXIT_EAST_UICURSOR;
      }

      if (gusMouseXPos < 635) {
        gfUIShowExitEast = false;
      }
    }

    if (gfUIShowExitWest) {
      gfUIDisplayActionPoints = false;
      ErasePath(true);

      if (OKForSectorExit(Enum186.WEST_STRATEGIC_MOVE, 0, uiTraverseTimeInMinutes__Pointer)) {
        if (gfUIConfirmExitArrows) {
          guiNewUICursor = Enum210.CONFIRM_EXIT_WEST_UICURSOR;
        } else {
          guiNewUICursor = Enum210.EXIT_WEST_UICURSOR;
        }
      } else {
        guiNewUICursor = Enum210.NOEXIT_WEST_UICURSOR;
      }

      if (gusMouseXPos > 5) {
        gfUIShowExitWest = false;
      }
    }

    if (gfUIShowExitNorth) {
      gfUIDisplayActionPoints = false;
      ErasePath(true);

      if (OKForSectorExit(Enum186.NORTH_STRATEGIC_MOVE, 0, uiTraverseTimeInMinutes__Pointer)) {
        if (gfUIConfirmExitArrows) {
          guiNewUICursor = Enum210.CONFIRM_EXIT_NORTH_UICURSOR;
        } else {
          guiNewUICursor = Enum210.EXIT_NORTH_UICURSOR;
        }
      } else {
        guiNewUICursor = Enum210.NOEXIT_NORTH_UICURSOR;
      }

      if (gusMouseYPos > 5) {
        gfUIShowExitNorth = false;
      }
    }

    if (gfUIShowExitSouth) {
      gfUIDisplayActionPoints = false;
      ErasePath(true);

      if (OKForSectorExit(Enum186.SOUTH_STRATEGIC_MOVE, 0, uiTraverseTimeInMinutes__Pointer)) {
        if (gfUIConfirmExitArrows) {
          guiNewUICursor = Enum210.CONFIRM_EXIT_SOUTH_UICURSOR;
        } else {
          guiNewUICursor = Enum210.EXIT_SOUTH_UICURSOR;
        }
      } else {
        guiNewUICursor = Enum210.NOEXIT_SOUTH_UICURSOR;
      }

      if (gusMouseYPos < 478) {
        gfUIShowExitSouth = false;

        // Define region for viewport
        MSYS_RemoveRegion(gViewportRegion);

        MSYS_DefineRegion(gViewportRegion, 0, 0, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y, MSYS_PRIORITY_NORMAL, VIDEO_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

        // Adjust where we blit our cursor!
        gsGlobalCursorYOffset = 0;
        SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);
      } else {
        if (gfScrollPending || gfScrollInertia) {
        } else {
          // Adjust viewport to edge of screen!
          // Define region for viewport
          MSYS_RemoveRegion(gViewportRegion);
          MSYS_DefineRegion(gViewportRegion, 0, 0, gsVIEWPORT_END_X, 480, MSYS_PRIORITY_NORMAL, VIDEO_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

          gsGlobalCursorYOffset = (480 - gsVIEWPORT_WINDOW_END_Y);
          SetCurrentCursorFromDatabase(gUICursors[guiNewUICursor].usFreeCursorName);

          gfViewPortAdjustedForSouth = true;
        }
      }
    } else {
      if (gfViewPortAdjustedForSouth) {
        // Define region for viewport
        MSYS_RemoveRegion(gViewportRegion);

        MSYS_DefineRegion(gViewportRegion, 0, 0, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y, MSYS_PRIORITY_NORMAL, VIDEO_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

        // Adjust where we blit our cursor!
        gsGlobalCursorYOffset = 0;
        SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);

        gfViewPortAdjustedForSouth = false;
      }
    }

    if (gfUIShowExitExitGrid) {
      let usMapPos: UINT16 = 0;
      let ubRoomNum: UINT8;

      gfUIDisplayActionPoints = false;
      ErasePath(true);

      if (GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
        if (gusSelectedSoldier != NOBODY && MercPtrs[gusSelectedSoldier].bLevel == 0) {
          // ATE: Is this place revealed?
          if ((ubRoomNum = InARoom(usMapPos)) === -1 || ((ubRoomNum = InARoom(usMapPos)) !== -1 && gpWorldLevelData[usMapPos].uiFlags & MAPELEMENT_REVEALED)) {
            if (SetUIMouseCursor__sOldExitGridNo != usMapPos) {
              SetUIMouseCursor__fOkForExit = OKForSectorExit(-1, usMapPos, uiTraverseTimeInMinutes__Pointer);
              SetUIMouseCursor__sOldExitGridNo = usMapPos;
            }

            if (SetUIMouseCursor__fOkForExit) {
              if (gfUIConfirmExitArrows) {
                guiNewUICursor = Enum210.CONFIRM_EXIT_GRID_UICURSOR;
              } else {
                guiNewUICursor = Enum210.EXIT_GRID_UICURSOR;
              }
            } else {
              guiNewUICursor = Enum210.NOEXIT_GRID_UICURSOR;
            }
          }
        }
      }
    } else {
      SetUIMouseCursor__sOldExitGridNo = NOWHERE;
    }
  } else {
    gsGlobalCursorYOffset = 0;
  }

  if (gfDisplayTimerCursor) {
    SetUICursor(guiTimerCursorID);

    fUpdateNewCursor = false;

    if ((GetJA2Clock() - guiTimerLastUpdate) > guiTimerCursorDelay) {
      gfDisplayTimerCursor = false;

      // OK, timer may be different, update...
      fForceUpdateNewCursor = true;
      fUpdateNewCursor = true;
    }
  }

  if (fUpdateNewCursor) {
    if (!gfTacticalForceNoCursor) {
      if (guiNewUICursor != guiCurrentUICursor || fForceUpdateNewCursor) {
        SetUICursor(guiNewUICursor);

        guiCurrentUICursor = guiNewUICursor;
      }
    }
  }
}

export function SetUIKeyboardHook(KeyboardHookFnc: UIKEYBOARD_HOOK | null): void {
  gUIKeyboardHook = KeyboardHookFnc;
}

function ClearEvent(pUIEvent: UI_EVENT): void {
  pUIEvent.uiParams.fill(0);
  pUIEvent.fDoneMenu = false;
  pUIEvent.fFirstTime = true;
  pUIEvent.uiMenuPreviousMode = 0;
}

export function EndMenuEvent(uiEvent: UINT32): void {
  gEvents[uiEvent].fDoneMenu = true;
}

// HANDLER FUCNTIONS

function UIHandleIDoNothing(pUIEvent: UI_EVENT): UINT32 {
  guiNewUICursor = Enum210.NORMAL_SNAPUICURSOR;

  return Enum26.GAME_SCREEN;
}

function UIHandleExit(pUIEvent: UI_EVENT): UINT32 {
  gfProgramIsRunning = false;
  return Enum26.GAME_SCREEN;
}

/* static */ let UIHandleNewMerc__ubTemp: UINT8 = 3;
/* static */ let UIHandleNewMerc__iSoldierCount: INT32 = 0;
function UIHandleNewMerc(pUIEvent: UI_EVENT): UINT32 {
  let usMapPos: INT16 = 0;
  let HireMercStruct: MERC_HIRE_STRUCT = createMercHireStruct();
  let bReturnCode: INT8;
  let pSoldier: SOLDIERTYPE;

  // Get Grid Corrdinates of mouse
  if (GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    UIHandleNewMerc__ubTemp += 2;

    HireMercStruct.ubProfileID = UIHandleNewMerc__ubTemp;

    // DEF: temp
    HireMercStruct.sSectorX = gWorldSectorX;
    HireMercStruct.sSectorY = gWorldSectorY;
    HireMercStruct.bSectorZ = gbWorldSectorZ;
    HireMercStruct.ubInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    HireMercStruct.usInsertionData = usMapPos;
    HireMercStruct.fCopyProfileItemsOver = true;
    HireMercStruct.iTotalContractLength = 7;

    // specify when the merc should arrive
    HireMercStruct.uiTimeTillMercArrives = 0;

    // if we succesfully hired the merc
    bReturnCode = HireMerc(HireMercStruct);

    if (bReturnCode == MERC_HIRE_FAILED) {
      ScreenMsg(FONT_ORANGE, MSG_BETAVERSION, "Merc hire failed:  Either already hired or dislikes you.");
    } else if (bReturnCode == MERC_HIRE_OVER_20_MERCS_HIRED) {
      ScreenMsg(FONT_ORANGE, MSG_BETAVERSION, "Can't hire more than 20 mercs.");
    } else {
      // Get soldier from profile
      pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(UIHandleNewMerc__ubTemp, false);

      MercArrivesCallback(pSoldier.ubID);
      SelectSoldier(pSoldier.ubID, false, true);
    }
  }
  return Enum26.GAME_SCREEN;
}

function UIHandleNewBadMerc(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let usMapPos: UINT16 = 0;
  let usRandom: UINT16;

  // Get map postion and place the enemy there.
  if (GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    // Are we an OK dest?
    if (!IsLocationSittable(usMapPos, false)) {
      return Enum26.GAME_SCREEN;
    }

    usRandom = Random(10);
    if (usRandom < 4)
      pSoldier = TacticalCreateAdministrator();
    else if (usRandom < 8)
      pSoldier = TacticalCreateArmyTroop();
    else
      pSoldier = TacticalCreateEliteEnemy();

    // Add soldier strategic info, so it doesn't break the counters!
    if (pSoldier) {
      if (!gbWorldSectorZ) {
        let pSector: SECTORINFO = SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];
        switch (pSoldier.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            pSector.ubNumAdmins++;
            pSector.ubAdminsInBattle++;
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            pSector.ubNumTroops++;
            pSector.ubTroopsInBattle++;
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            pSector.ubNumElites++;
            pSector.ubElitesInBattle++;
            break;
        }
      } else {
        let pSector: UNDERGROUND_SECTORINFO | null = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
        if (pSector) {
          switch (pSoldier.ubSoldierClass) {
            case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
              pSector.ubNumAdmins++;
              pSector.ubAdminsInBattle++;
              break;
            case Enum262.SOLDIER_CLASS_ARMY:
              pSector.ubNumTroops++;
              pSector.ubTroopsInBattle++;
              break;
            case Enum262.SOLDIER_CLASS_ELITE:
              pSector.ubNumElites++;
              pSector.ubElitesInBattle++;
              break;
          }
        }
      }

      pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      pSoldier.usStrategicInsertionData = usMapPos;
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      AllTeamsLookForAll(NO_INTERRUPTS);
    }
  }
  return Enum26.GAME_SCREEN;
}

function UIHandleEnterEditMode(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.EDIT_SCREEN;
}

function UIHandleEnterPalEditMode(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.PALEDIT_SCREEN;
}

export function UIHandleEndTurn(pUIEvent: UI_EVENT | null): UINT32 {
  // CANCEL FROM PLANNING MODE!
  if (InUIPlanMode()) {
    EndUIPlan();
  }

  // ATE: If we have an item pointer end it!
  CancelItemPointer();

  // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[ ENDING_TURN ] );

  if (CheckForEndOfCombatMode(false)) {
    // do nothing...
  } else {
    if (FileExists("..\\AutoSave.pls") && CanGameBeSaved()) {
      // Save the game
      guiPreviousOptionScreen = guiCurrentScreen;
      SaveGame(SAVE__END_TURN_NUM, createPointer(() => "End Turn Auto Save", (v) => {}));
    }

    // End our turn!
    EndTurn(gbPlayerNum + 1);
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleTestHit(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE;
  let bDamage: INT8;

  // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
  if (gfUIFullTargetFound) {
    // Get Soldier
    pSoldier = <SOLDIERTYPE>GetSoldier(gusUIFullTargetID);

    if (_KeyDown(SHIFT)) {
      pSoldier.bBreath -= 30;

      if (pSoldier.bBreath < 0)
        pSoldier.bBreath = 0;

      bDamage = 1;
    } else {
      if (Random(2)) {
        bDamage = 20;
      } else {
        bDamage = 25;
      }
    }

    gTacticalStatus.ubAttackBusyCount++;

    EVENT_SoldierGotHit(pSoldier, 1, bDamage, 10, pSoldier.bDirection, 320, NOBODY, FIRE_WEAPON_NO_SPECIAL, pSoldier.bAimShotLocation, 0, NOWHERE);
  }
  return Enum26.GAME_SCREEN;
}

export function ChangeInterfaceLevel(sLevel: INT16): void {
  // Only if different!
  if (sLevel == gsInterfaceLevel) {
    return;
  }

  gsInterfaceLevel = sLevel;

  if (gsInterfaceLevel == 1) {
    gsRenderHeight += ROOF_LEVEL_HEIGHT;
    gTacticalStatus.uiFlags |= SHOW_ALL_ROOFS;
    InvalidateWorldRedundency();
  } else if (gsInterfaceLevel == 0) {
    gsRenderHeight -= ROOF_LEVEL_HEIGHT;
    gTacticalStatus.uiFlags &= (~SHOW_ALL_ROOFS);
    InvalidateWorldRedundency();
  }

  SetRenderFlags(RENDER_FLAG_FULL);
  // Remove any interactive tiles we could be over!
  BeginCurInteractiveTileCheck(INTILE_CHECK_SELECTIVE);
  gfPlotNewMovement = true;
  ErasePath(false);
}

export function UIHandleChangeLevel(pUIEvent: UI_EVENT | null): UINT32 {
  if (gsInterfaceLevel == 0) {
    ChangeInterfaceLevel(1);
  } else if (gsInterfaceLevel == 1) {
    ChangeInterfaceLevel(0);
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleSelectMerc(pUIEvent: UI_EVENT): UINT32 {
  let iCurrentSquad: INT32;

  // Get merc index at mouse and set current selection
  if (gfUIFullTargetFound) {
    iCurrentSquad = CurrentSquad();

    InternalSelectSoldier(gusUIFullTargetID, true, false, true);

    // If different, display message
    if (CurrentSquad() != iCurrentSquad) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SQUAD_ACTIVE], (CurrentSquad() + 1));
    }
  }

  return Enum26.GAME_SCREEN;
}

/* static */ let UIHandleMOnTerrain__sGridNoForItemsOver: INT16;
/* static */ let UIHandleMOnTerrain__bLevelForItemsOver: INT8;
/* static */ let UIHandleMOnTerrain__uiItemsOverTimer: UINT32;
/* static */ let UIHandleMOnTerrain__fOverItems: boolean;
function UIHandleMOnTerrain(pUIEvent: UI_EVENT | null): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let usMapPos: UINT16 = 0;
  let fSetCursor: boolean = false;
  let uiCursorFlags: UINT32;
  let pIntNode: LEVELNODE | null;
  let ExitGrid: EXITGRID = createExitGrid();
  let sIntTileGridNo: INT16 = 0;
  let fContinue: boolean = true;
  let pItemPool: ITEM_POOL | null;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  gUIActionModeChangeDueToMouseOver = false;

  // If we are a vehicle..... just show an X
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    if ((OK_ENTERABLE_VEHICLE(pSoldier))) {
      if (!UIHandleOnMerc(true)) {
        guiNewUICursor = Enum210.FLOATING_X_UICURSOR;
        return Enum26.GAME_SCREEN;
      }
    }
  }

  // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
  if (!UIHandleOnMerc(true)) {
    // Are we over items...
    if ((pItemPool = GetItemPool(usMapPos, gsInterfaceLevel)) && ITEMPOOL_VISIBLE(pItemPool)) {
      // Are we already in...
      if (UIHandleMOnTerrain__fOverItems) {
        // Is this the same level & gridno...
        if (gsInterfaceLevel == UIHandleMOnTerrain__bLevelForItemsOver && usMapPos == UIHandleMOnTerrain__sGridNoForItemsOver) {
          // Check timer...
          if ((GetJA2Clock() - UIHandleMOnTerrain__uiItemsOverTimer) > 1500) {
            // Change to hand curso mode
            guiPendingOverrideEvent = Enum207.M_CHANGE_TO_HANDMODE;
            gsOverItemsGridNo = usMapPos;
            gsOverItemsLevel = gsInterfaceLevel;
            UIHandleMOnTerrain__fOverItems = false;
          }
        } else {
          UIHandleMOnTerrain__uiItemsOverTimer = GetJA2Clock();
          UIHandleMOnTerrain__bLevelForItemsOver = gsInterfaceLevel;
          UIHandleMOnTerrain__sGridNoForItemsOver = usMapPos;
        }
      } else {
        UIHandleMOnTerrain__fOverItems = true;

        UIHandleMOnTerrain__uiItemsOverTimer = GetJA2Clock();
        UIHandleMOnTerrain__bLevelForItemsOver = gsInterfaceLevel;
        UIHandleMOnTerrain__sGridNoForItemsOver = usMapPos;
      }
    } else {
      UIHandleMOnTerrain__fOverItems = false;
    }

    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      if (pSoldier.sGridNo == NOWHERE) {
        let i: number = 0;
      }

      if (GetExitGrid(usMapPos, ExitGrid) && pSoldier.bLevel == 0) {
        gfUIShowExitExitGrid = true;
      }

      // ATE: Draw invalidc cursor if heights different
      if (gpWorldLevelData[usMapPos].sHeight != gpWorldLevelData[pSoldier.sGridNo].sHeight) {
        // ERASE PATH
        ErasePath(true);

        guiNewUICursor = Enum210.FLOATING_X_UICURSOR;

        return Enum26.GAME_SCREEN;
      }
    }

    // DO SOME CURSOR POSITION FLAGS SETTING
    uiCursorFlags = GetCursorMovementFlags();

    if (gusSelectedSoldier != NO_SOLDIER) {
      // Get Soldier Pointer
      pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);

      // Get interactvie tile node
      pIntNode = GetCurInteractiveTileGridNo(createPointer(() => sIntTileGridNo, (v) => sIntTileGridNo = v));

      // Check were we are
      // CHECK IF WE CAN MOVE HERE
      // THIS IS JUST A CRUDE TEST FOR NOW
      if (pSoldier.bLife < OKLIFE) {
        let ubID: UINT8;
        // Show reg. cursor
        // GO INTO IDLE MODE
        // guiPendingOverrideEvent = I_CHANGE_TO_IDLE;
        // gusSelectedSoldier = NO_SOLDIER;
        ubID = FindNextActiveAndAliveMerc(pSoldier, false, false);

        if (ubID != NOBODY) {
          SelectSoldier(ubID, false, false);
        } else {
          gusSelectedSoldier = NO_SOLDIER;
          // Change UI mode to reflact that we are selected
          guiPendingOverrideEvent = Enum207.I_ON_TERRAIN;
        }
      } else if ((UIOKMoveDestination(pSoldier, usMapPos) != 1) && pIntNode == null) {
        // ERASE PATH
        ErasePath(true);

        guiNewUICursor = Enum210.CANNOT_MOVE_UICURSOR;
      } else {
        if (!UIHandleInteractiveTilesAndItemsOnTerrain(pSoldier, usMapPos, false, true)) {
          // Are we in combat?
          if ((gTacticalStatus.uiFlags & INCOMBAT) && (gTacticalStatus.uiFlags & TURNBASED)) {
            // If so, draw path, etc
            fSetCursor = HandleUIMovementCursor(pSoldier, uiCursorFlags, usMapPos, 0);
          } else {
            // Donot draw path until confirm
            fSetCursor = true;

            // If so, draw path, etc
            fSetCursor = HandleUIMovementCursor(pSoldier, uiCursorFlags, usMapPos, 0);

            // ErasePath( TRUE );
          }
        } else {
          fSetCursor = true;
        }
      }
    } else {
      // IF GUSSELECTEDSOLDIER != NOSOLDIER
      guiNewUICursor = Enum210.NORMAL_SNAPUICURSOR;
    }
  } else {
    if (ValidQuickExchangePosition()) {
      // Do new cursor!
      guiNewUICursor = Enum210.EXCHANGE_PLACES_UICURSOR;
    }
  }

  {
    // if ( fSetCursor && guiNewUICursor != ENTER_VEHICLE_UICURSOR )
    if (fSetCursor && !gfBeginVehicleCursor) {
      SetMovementModeCursor(<SOLDIERTYPE>pSoldier);
    }
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleMovementMenu(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;

  // Get soldier
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  // Popup Menu
  if (pUIEvent.fFirstTime) {
    // Pop-up menu
    PopupMovementMenu(pUIEvent);

    // Change cusror to normal
    guiNewUICursor = Enum210.NORMAL_FREEUICURSOR;
  }

  // Check for done flag
  if (pUIEvent.fDoneMenu) {
    PopDownMovementMenu();

    // Excecute command, if user hit a button
    if (pUIEvent.uiParams[1] == true) {
      if (pUIEvent.uiParams[2] == MOVEMENT_MENU_LOOK) {
        guiPendingOverrideEvent = Enum207.LC_CHANGE_TO_LOOK;
      } else if (pUIEvent.uiParams[2] == MOVEMENT_MENU_HAND) {
        guiPendingOverrideEvent = Enum207.HC_ON_TERRAIN;
      } else if (pUIEvent.uiParams[2] == MOVEMENT_MENU_ACTIONC) {
        guiPendingOverrideEvent = Enum207.M_CHANGE_TO_ACTION;
      } else if (pUIEvent.uiParams[2] == MOVEMENT_MENU_TALK) {
        guiPendingOverrideEvent = Enum207.T_CHANGE_TO_TALKING;
      } else {
        // Change stance based on params!
        switch (pUIEvent.uiParams[0]) {
          case MOVEMENT_MENU_RUN:

            if (pSoldier.usUIMovementMode != Enum193.WALKING && pSoldier.usUIMovementMode != Enum193.RUNNING) {
              UIHandleSoldierStanceChange(pSoldier.ubID, ANIM_STAND);
              pSoldier.fUIMovementFast = true;
            } else {
              pSoldier.fUIMovementFast = true;
              pSoldier.usUIMovementMode = Enum193.RUNNING;
              gfPlotNewMovement = true;
            }
            break;

          case MOVEMENT_MENU_WALK:

            UIHandleSoldierStanceChange(pSoldier.ubID, ANIM_STAND);
            break;

          case MOVEMENT_MENU_SWAT:

            UIHandleSoldierStanceChange(pSoldier.ubID, ANIM_CROUCH);
            break;

          case MOVEMENT_MENU_PRONE:

            UIHandleSoldierStanceChange(pSoldier.ubID, ANIM_PRONE);
            break;
        }

        guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;

        // pSoldier->usUIMovementMode = (INT8)pUIEvent->uiParams[ 0 ];
      }
    }
  }

  return Enum26.GAME_SCREEN;
}

function UIHandlePositionMenu(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.GAME_SCREEN;
}

function UIHandleAOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let usMapPos: UINT16 = 0;
  let pSoldier: SOLDIERTYPE | null;
  //	INT16							sTargetXPos, sTargetYPos;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if (gpItemPointer != null) {
    return Enum26.GAME_SCREEN;
  }

  // Get soldier to determine range
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    // ATE: Add stuff here to display a system message if we are targeting smeothing and
    //  are out of range.
    // Are we using a gun?
    if (GetActionModeCursor(pSoldier) == TARGETCURS) {
      SetActionModeDoorCursorText();

      // Yep, she's a gun.
      // Are we in range?
      if (!InRange(pSoldier, usMapPos)) {
        // Are we over a guy?
        if (gfUIFullTargetFound) {
          // No, ok display message IF this is the first time at this gridno
          if (gsOutOfRangeGridNo != MercPtrs[gusUIFullTargetID].sGridNo || gubOutOfRangeMerc != gusSelectedSoldier) {
            // Display
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.OUT_OF_RANGE_STRING]);

            // PlayJA2Sample( TARGET_OUT_OF_RANGE, RATE_11025, MIDVOLUME, 1, MIDDLEPAN );

            // Set
            gsOutOfRangeGridNo = MercPtrs[gusUIFullTargetID].sGridNo;
            gubOutOfRangeMerc = gusSelectedSoldier;
          }
        }
      }
    }

    guiNewUICursor = GetProperItemCursor(gusSelectedSoldier, pSoldier.inv[Enum261.HANDPOS].usItem, usMapPos, false);

    // Show UI ON GUY
    UIHandleOnMerc(false);

    // If we are in realtime, and in a stationary animation, follow!
    if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
      if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY && pSoldier.ubPendingAction == NO_PENDING_ACTION) {
        // Check if we have a shot waiting!
        if (gUITargetShotWaiting) {
          guiPendingOverrideEvent = Enum207.CA_MERC_SHOOT;
        }

        if (!gUITargetReady) {
          // Move to proper stance + direction!
          // Convert our grid-not into an XY
          //	ConvertGridNoToXY( usMapPos, &sTargetXPos, &sTargetYPos );

          // Ready weapon
          //		SoldierReadyWeapon( pSoldier, sTargetXPos, sTargetYPos, FALSE );

          gUITargetReady = true;
        }
      } else {
        gUITargetReady = false;
      }
    }
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleMChangeToAction(pUIEvent: UI_EVENT): UINT32 {
  gUITargetShotWaiting = false;

  EndPhysicsTrajectoryUI();

  // guiNewUICursor = CONFIRM_MOVE_UICURSOR;

  return Enum26.GAME_SCREEN;
}

function UIHandleMChangeToHandMode(pUIEvent: UI_EVENT): UINT32 {
  ErasePath(false);

  return Enum26.GAME_SCREEN;
}

function UIHandleAChangeToMove(pUIEvent: UI_EVENT): UINT32 {
  // Set merc glow back to normal
  // ( could have been set when in target cursor )
  SetMercGlowNormal();

  // gsOutOfRangeGridNo = NOWHERE;

  gfPlotNewMovement = true;

  return Enum26.GAME_SCREEN;
}

function UIHandleCWait(pUIEvent: UI_EVENT): UINT32 {
  let usMapPos: UINT16 = 0;
  let pSoldier: SOLDIERTYPE | null;
  let fSetCursor: boolean;
  let uiCursorFlags: UINT32;
  let pInvTile: LEVELNODE | null;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    pInvTile = GetCurInteractiveTile();

    if (pInvTile && gpInvTileThatCausedMoveConfirm != pInvTile) {
      // Get out og this mode...
      guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
      return Enum26.GAME_SCREEN;
    }

    uiCursorFlags = GetCursorMovementFlags();

    if (pInvTile != null) {
      fSetCursor = HandleUIMovementCursor(pSoldier, uiCursorFlags, usMapPos, MOVEUI_TARGET_INTTILES);

      // Set UI CURSOR
      guiNewUICursor = GetInteractiveTileCursor(guiNewUICursor, true);

      // Make red tile under spot... if we've previously found one...
      if (gfUIHandleShowMoveGrid) {
        gfUIHandleShowMoveGrid = 2;
      }

      return Enum26.GAME_SCREEN;
    }

    // Display action points
    gfUIDisplayActionPoints = true;

    // Determine if we can afford!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
      gfUIDisplayActionPointsInvalid = true;
    }

    SetConfirmMovementModeCursor(pSoldier, false);

    // If we are not in combat, draw path here!
    if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
      // DrawUIMovementPath( pSoldier, usMapPos,  0 );
      fSetCursor = HandleUIMovementCursor(pSoldier, uiCursorFlags, usMapPos, 0);
    }
  }

  return Enum26.GAME_SCREEN;
}

// NOTE, ONCE AT THIS FUNCTION, WE HAVE ASSUMED TO HAVE CHECKED FOR ENOUGH APS THROUGH
// SelectedMercCanAffordMove
function UIHandleCMoveMerc(pUIEvent: UI_EVENT): UINT32 {
  let usMapPos: UINT16 = 0;
  let pSoldier: SOLDIERTYPE | null;
  let sDestGridNo: INT16;
  let sActionGridNo: INT16;
  let pStructure: STRUCTURE | null = <STRUCTURE><unknown>null;
  let ubDirection: UINT8 = 0;
  let fAllMove: number /* boolean */;
  let bLoop: INT8;
  let pIntTile: LEVELNODE | null;
  let sIntTileGridNo: INT16 = 0;
  let fOldFastMove: boolean;

  if (gusSelectedSoldier != NO_SOLDIER) {
    fAllMove = gfUIAllMoveOn;
    gfUIAllMoveOn = 0;

    if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
      return Enum26.GAME_SCREEN;
    }

    // ERASE PATH
    ErasePath(true);

    if (fAllMove) {
      gfGetNewPathThroughPeople = true;

      // Loop through all mercs and make go!
      // TODO: Only our squad!
      for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID, pSoldier = MercPtrs[bLoop]; bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++, pSoldier = MercPtrs[bLoop]) {
        if (OK_CONTROLLABLE_MERC(pSoldier) && pSoldier.bAssignment == CurrentSquad() && !pSoldier.fMercAsleep) {
          // If we can't be controlled, returninvalid...
          if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
            if (!CanRobotBeControlled(pSoldier)) {
              continue;
            }
          }

          AdjustNoAPToFinishMove(pSoldier, false);

          fOldFastMove = pSoldier.fUIMovementFast;

          if (fAllMove == 2) {
            pSoldier.fUIMovementFast = true;
            pSoldier.usUIMovementMode = Enum193.RUNNING;
          } else {
            pSoldier.fUIMovementFast = false;
            pSoldier.usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight);
          }

          // Remove any previous actions
          pSoldier.ubPendingAction = NO_PENDING_ACTION;

          // if ( !( gTacticalStatus.uiFlags & INCOMBAT ) && ( gAnimControl[ pSoldier->usAnimState ].uiFlags & ANIM_MOVING ) )
          //{
          //	pSoldier->sRTPendingMovementGridNo = usMapPos;
          //	pSoldier->usRTPendingMovementAnim  = pSoldier->usUIMovementMode;
          //}
          // else
          if (EVENT_InternalGetNewSoldierPath(pSoldier, usMapPos, pSoldier.usUIMovementMode, 1, false)) {
            InternalDoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1, BATTLE_SND_LOWER_VOLUME);
          } else {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.NO_PATH_FOR_MERC], pSoldier.name);
          }

          pSoldier.fUIMovementFast = fOldFastMove;
        }
      }
      gfGetNewPathThroughPeople = false;

      // RESET MOVE FAST FLAG
      SetConfirmMovementModeCursor(pSoldier, true);

      gfUIAllMoveOn = 0;
    } else {
      // Get soldier
      if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
        // FOR REALTIME - DO MOVEMENT BASED ON STANCE!
        if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
          pSoldier.usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight);
        }

        sDestGridNo = usMapPos;

        // Get structure info for in tile!
        pIntTile = GetCurInteractiveTileGridNoAndStructure(createPointer(() => sIntTileGridNo, (v) => sIntTileGridNo = v), createPointer(() => pStructure, (v) => pStructure = v));

        // We should not have null here if we are given this flag...
        if (pIntTile != null) {
          sActionGridNo = FindAdjacentGridEx(pSoldier, sIntTileGridNo, createPointer(() => ubDirection, (v) => ubDirection = v), null, false, true);
          if (sActionGridNo != -1) {
            SetUIBusy(pSoldier.ubID);

            // Set dest gridno
            sDestGridNo = sActionGridNo;

            // check if we are at this location
            if (pSoldier.sGridNo == sDestGridNo) {
              StartInteractiveObject(sIntTileGridNo, pStructure.usStructureID, pSoldier, ubDirection);
              InteractWithInteractiveObject(pSoldier, pStructure, ubDirection);
              return Enum26.GAME_SCREEN;
            }
          } else {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
            return Enum26.GAME_SCREEN;
          }
        }

        SetUIBusy(pSoldier.ubID);

        if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
          // RESET MOVE FAST FLAG
          SetConfirmMovementModeCursor(pSoldier, true);

          if (!gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
            pSoldier.fUIMovementFast = false;
          }

          // StartLooseCursor( usMapPos, 0 );
        }

        if (gTacticalStatus.fAtLeastOneGuyOnMultiSelect && pIntTile == null) {
          HandleMultiSelectionMove(sDestGridNo);
        } else {
          if (gUIUseReverse) {
            pSoldier.bReverse = true;
          } else {
            pSoldier.bReverse = false;
          }

          // Remove any previous actions
          pSoldier.ubPendingAction = NO_PENDING_ACTION;

          { EVENT_InternalGetNewSoldierPath(pSoldier, sDestGridNo, pSoldier.usUIMovementMode, 1, pSoldier.fNoAPToFinishMove); }

          if (pSoldier.usPathDataSize > 5) {
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);
          }

          // HANDLE ANY INTERACTIVE OBJECTS HERE!
          if (pIntTile != null) {
            StartInteractiveObject(sIntTileGridNo, pStructure.usStructureID, pSoldier, ubDirection);
          }
        }
      }
    }
  }
  return Enum26.GAME_SCREEN;
}

function UIHandleMCycleMoveAll(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  if (gfUICanBeginAllMoveCycle) {
    gfUIAllMoveOn = 1;
    gfUICanBeginAllMoveCycle = false;
  }
  return Enum26.GAME_SCREEN;
}

function UIHandleMCycleMovement(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let fGoodMode: boolean = false;

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  gfUIAllMoveOn = 0;

  if (pSoldier.ubBodyType == Enum194.ROBOTNOWEAPON) {
    pSoldier.usUIMovementMode = Enum193.WALKING;
    gfPlotNewMovement = true;
    return Enum26.GAME_SCREEN;
  }

  do {
    // Cycle gmovement state
    if (pSoldier.usUIMovementMode == Enum193.RUNNING) {
      pSoldier.usUIMovementMode = Enum193.WALKING;
      if (IsValidMovementMode(pSoldier, Enum193.WALKING)) {
        fGoodMode = true;
      }
    } else if (pSoldier.usUIMovementMode == Enum193.WALKING) {
      pSoldier.usUIMovementMode = Enum193.SWATTING;
      if (IsValidMovementMode(pSoldier, Enum193.SWATTING)) {
        fGoodMode = true;
      }
    } else if (pSoldier.usUIMovementMode == Enum193.SWATTING) {
      pSoldier.usUIMovementMode = Enum193.CRAWLING;
      if (IsValidMovementMode(pSoldier, Enum193.CRAWLING)) {
        fGoodMode = true;
      }
    } else if (pSoldier.usUIMovementMode == Enum193.CRAWLING) {
      pSoldier.fUIMovementFast = true;
      pSoldier.usUIMovementMode = Enum193.RUNNING;
      if (IsValidMovementMode(pSoldier, Enum193.RUNNING)) {
        fGoodMode = true;
      }
    }
  } while (fGoodMode != true);

  gfPlotNewMovement = true;

  return Enum26.GAME_SCREEN;
}

function UIHandleCOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.GAME_SCREEN;
}

/* static */ let UIHandleMAdjustStanceMode__gusAnchorMouseY: UINT16;
/* static */ let UIHandleMAdjustStanceMode__usOldMouseY: UINT16;
/* static */ let UIHandleMAdjustStanceMode__ubNearHeigherLevel: boolean;
/* static */ let UIHandleMAdjustStanceMode__ubNearLowerLevel: boolean;
/* static */ let UIHandleMAdjustStanceMode__ubUpHeight: UINT8;
/* static */ let UIHandleMAdjustStanceMode__ubDownDepth: UINT8;
/* static */ let UIHandleMAdjustStanceMode__uiOldShowUPDownArrows: UINT32;
function UIHandleMAdjustStanceMode(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let fCheck: boolean = false;
  let iPosDiff: INT32;
  let bNewDirection: INT8 = 0;
  let bNewDirection__Pointer = createPointer(() => bNewDirection, (v) => bNewDirection = v);

  // Change cusror to normal
  guiNewUICursor = Enum210.NO_UICURSOR;

  if (pUIEvent.fFirstTime) {
    UIHandleMAdjustStanceMode__gusAnchorMouseY = gusMouseYPos;
    UIHandleMAdjustStanceMode__usOldMouseY = gusMouseYPos;
    UIHandleMAdjustStanceMode__ubNearHeigherLevel = false;
    UIHandleMAdjustStanceMode__ubNearLowerLevel = false;

    guiShowUPDownArrows = ARROWS_SHOW_DOWN_BESIDE | ARROWS_SHOW_UP_BESIDE;
    UIHandleMAdjustStanceMode__uiOldShowUPDownArrows = guiShowUPDownArrows;

    gbAdjustStanceDiff = 0;
    gbClimbID = 0;

    gfIgnoreScrolling = true;

    // Get soldier current height of animation
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      // IF we are on a basic level...(temp)
      if (pSoldier.bLevel == 0) {
        if (FindHeigherLevel(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, bNewDirection__Pointer)) {
          UIHandleMAdjustStanceMode__ubNearHeigherLevel = true;
        }
      }

      // IF we are higher...
      if (pSoldier.bLevel > 0) {
        if (FindLowerLevel(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, bNewDirection__Pointer)) {
          UIHandleMAdjustStanceMode__ubNearLowerLevel = true;
        }
      }

      switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
        case ANIM_STAND:
          if (UIHandleMAdjustStanceMode__ubNearHeigherLevel) {
            UIHandleMAdjustStanceMode__ubUpHeight = 1;
            UIHandleMAdjustStanceMode__ubDownDepth = 2;
          } else if (UIHandleMAdjustStanceMode__ubNearLowerLevel) {
            UIHandleMAdjustStanceMode__ubUpHeight = 0;
            UIHandleMAdjustStanceMode__ubDownDepth = 3;
          } else {
            UIHandleMAdjustStanceMode__ubUpHeight = 0;
            UIHandleMAdjustStanceMode__ubDownDepth = 2;
          }
          break;

        case ANIM_CROUCH:
          if (UIHandleMAdjustStanceMode__ubNearHeigherLevel) {
            UIHandleMAdjustStanceMode__ubUpHeight = 2;
            UIHandleMAdjustStanceMode__ubDownDepth = 1;
          } else if (UIHandleMAdjustStanceMode__ubNearLowerLevel) {
            UIHandleMAdjustStanceMode__ubUpHeight = 1;
            UIHandleMAdjustStanceMode__ubDownDepth = 2;
          } else {
            UIHandleMAdjustStanceMode__ubUpHeight = 1;
            UIHandleMAdjustStanceMode__ubDownDepth = 1;
          }
          break;

        case ANIM_PRONE:
          if (UIHandleMAdjustStanceMode__ubNearHeigherLevel) {
            UIHandleMAdjustStanceMode__ubUpHeight = 3;
            UIHandleMAdjustStanceMode__ubDownDepth = 0;
          } else if (UIHandleMAdjustStanceMode__ubNearLowerLevel) {
            UIHandleMAdjustStanceMode__ubUpHeight = 2;
            UIHandleMAdjustStanceMode__ubDownDepth = 1;
          } else {
            UIHandleMAdjustStanceMode__ubUpHeight = 2;
            UIHandleMAdjustStanceMode__ubDownDepth = 0;
          }
          break;
      }
    }
  }

  // Check if delta X has changed alot since last time
  iPosDiff = Math.abs((UIHandleMAdjustStanceMode__usOldMouseY - gusMouseYPos));

  // guiShowUPDownArrows = ARROWS_SHOW_DOWN_BESIDE | ARROWS_SHOW_UP_BESIDE;
  guiShowUPDownArrows = UIHandleMAdjustStanceMode__uiOldShowUPDownArrows;

  {
    if (UIHandleMAdjustStanceMode__gusAnchorMouseY > gusMouseYPos) {
      // Get soldier
      if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
        if (iPosDiff < GO_MOVE_ONE && UIHandleMAdjustStanceMode__ubUpHeight >= 1) {
          // Change arrows to move down arrow + show
          // guiShowUPDownArrows = ARROWS_SHOW_UP_ABOVE_Y;
          guiShowUPDownArrows = ARROWS_SHOW_DOWN_BESIDE | ARROWS_SHOW_UP_BESIDE;
          gbAdjustStanceDiff = 0;
          gbClimbID = 0;
        } else if (iPosDiff > GO_MOVE_ONE && iPosDiff < GO_MOVE_TWO && UIHandleMAdjustStanceMode__ubUpHeight >= 1) {
          // guiShowUPDownArrows = ARROWS_SHOW_UP_ABOVE_G;
          if (UIHandleMAdjustStanceMode__ubUpHeight == 1 && UIHandleMAdjustStanceMode__ubNearHeigherLevel) {
            guiShowUPDownArrows = ARROWS_SHOW_UP_ABOVE_CLIMB;
            gbClimbID = 1;
          } else {
            guiShowUPDownArrows = ARROWS_SHOW_UP_ABOVE_Y;
            gbClimbID = 0;
          }
          gbAdjustStanceDiff = 1;
        } else if (iPosDiff >= GO_MOVE_TWO && iPosDiff < GO_MOVE_THREE && UIHandleMAdjustStanceMode__ubUpHeight >= 2) {
          if (UIHandleMAdjustStanceMode__ubUpHeight == 2 && UIHandleMAdjustStanceMode__ubNearHeigherLevel) {
            guiShowUPDownArrows = ARROWS_SHOW_UP_ABOVE_CLIMB;
            gbClimbID = 1;
          } else {
            guiShowUPDownArrows = ARROWS_SHOW_UP_ABOVE_YY;
            gbClimbID = 0;
          }
          gbAdjustStanceDiff = 2;
        } else if (iPosDiff >= GO_MOVE_THREE && UIHandleMAdjustStanceMode__ubUpHeight >= 3) {
          if (UIHandleMAdjustStanceMode__ubUpHeight == 3 && UIHandleMAdjustStanceMode__ubNearHeigherLevel) {
            guiShowUPDownArrows = ARROWS_SHOW_UP_ABOVE_CLIMB;
            gbClimbID = 1;
          }
        }
      }
    }

    if (UIHandleMAdjustStanceMode__gusAnchorMouseY < gusMouseYPos) {
      // Get soldier
      if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
        if (iPosDiff < GO_MOVE_ONE && UIHandleMAdjustStanceMode__ubDownDepth >= 1) {
          // Change arrows to move down arrow + show
          // guiShowUPDownArrows = ARROWS_SHOW_DOWN_BELOW_Y;
          guiShowUPDownArrows = ARROWS_SHOW_DOWN_BESIDE | ARROWS_SHOW_UP_BESIDE;
          gbAdjustStanceDiff = 0;
          gbClimbID = 0;
        } else if (iPosDiff >= GO_MOVE_ONE && iPosDiff < GO_MOVE_TWO && UIHandleMAdjustStanceMode__ubDownDepth >= 1) {
          //						guiShowUPDownArrows = ARROWS_SHOW_DOWN_BELOW_G;
          if (UIHandleMAdjustStanceMode__ubDownDepth == 1 && UIHandleMAdjustStanceMode__ubNearLowerLevel) {
            guiShowUPDownArrows = ARROWS_SHOW_DOWN_CLIMB;
            gbClimbID = -1;
          } else {
            guiShowUPDownArrows = ARROWS_SHOW_DOWN_BELOW_Y;
            gbClimbID = 0;
          }
          gbAdjustStanceDiff = -1;
        } else if (iPosDiff > GO_MOVE_TWO && iPosDiff < GO_MOVE_THREE && UIHandleMAdjustStanceMode__ubDownDepth >= 2) {
          // guiShowUPDownArrows = ARROWS_SHOW_DOWN_BELOW_GG;
          if (UIHandleMAdjustStanceMode__ubDownDepth == 2 && UIHandleMAdjustStanceMode__ubNearLowerLevel) {
            guiShowUPDownArrows = ARROWS_SHOW_DOWN_CLIMB;
            gbClimbID = -1;
          } else {
            guiShowUPDownArrows = ARROWS_SHOW_DOWN_BELOW_YY;
            gbClimbID = 0;
          }
          gbAdjustStanceDiff = -2;
        } else if (iPosDiff > GO_MOVE_THREE && UIHandleMAdjustStanceMode__ubDownDepth >= 3) {
          // guiShowUPDownArrows = ARROWS_SHOW_DOWN_BELOW_GG;
          if (UIHandleMAdjustStanceMode__ubDownDepth == 3 && UIHandleMAdjustStanceMode__ubNearLowerLevel) {
            guiShowUPDownArrows = ARROWS_SHOW_DOWN_CLIMB;
            gbClimbID = -1;
          }
        }
      }
    }
  }

  UIHandleMAdjustStanceMode__uiOldShowUPDownArrows = guiShowUPDownArrows;

  return Enum26.GAME_SCREEN;
}

function UIHandleAChangeToConfirmAction(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    HandleLeftClickCursor(pSoldier);
  }

  ResetBurstLocations();

  return Enum26.GAME_SCREEN;
}

function UIHandleCAOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let usMapPos: UINT16 = 0;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    guiNewUICursor = GetProperItemCursor(gusSelectedSoldier, pSoldier.inv[Enum261.HANDPOS].usItem, usMapPos, true);

    UIHandleOnMerc(false);
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleMercAttack(pSoldier: SOLDIERTYPE, pTargetSoldier: SOLDIERTYPE | null, usMapPos: UINT16): void {
  let iHandleReturn: INT32;
  let sTargetGridNo: INT16;
  let bTargetLevel: INT8;
  let usItem: UINT16;
  let pIntNode: LEVELNODE | null;
  let pStructure: STRUCTURE | null = <STRUCTURE><unknown>null;
  let sGridNo: INT16 = 0;
  let sNewGridNo: INT16;
  let ubItemCursor: UINT8;

  // get cursor
  ubItemCursor = GetActionModeCursor(pSoldier);

  if (!(gTacticalStatus.uiFlags & INCOMBAT) && pTargetSoldier && Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass & IC_WEAPON) {
    if (NPCFirstDraw(pSoldier, pTargetSoldier)) {
      // go into turnbased for that person
      CancelAIAction(pTargetSoldier, 1);
      AddToShouldBecomeHostileOrSayQuoteList(pTargetSoldier.ubID);
      // MakeCivHostile( pTargetSoldier, 2 );
      // TriggerNPCWithIHateYouQuote( pTargetSoldier->ubProfile );
      return;
    }
  }

  // Set aim time to one in UI
  pSoldier.bAimTime = (pSoldier.bShownAimTime / 2);
  usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

  // ATE: Check if we are targeting an interactive tile, and adjust gridno accordingly...
  pIntNode = GetCurInteractiveTileGridNoAndStructure(createPointer(() => sGridNo, (v) => sGridNo = v), createPointer(() => pStructure, (v) => pStructure = v));

  if (pTargetSoldier != null) {
    sTargetGridNo = pTargetSoldier.sGridNo;
    bTargetLevel = pTargetSoldier.bLevel;
  } else {
    sTargetGridNo = usMapPos;
    bTargetLevel = gsInterfaceLevel;

    if (pIntNode != null) {
      // Change gridno....
      sTargetGridNo = sGridNo;
    }
  }

  // here, change gridno if we're targeting ourselves....
  if (pIntNode != null) {
    // Are we in the same gridno?
    if (sGridNo == pSoldier.sGridNo && ubItemCursor != AIDCURS) {
      // Get orientation....
      switch (pStructure.ubWallOrientation) {
        case Enum314.OUTSIDE_TOP_LEFT:
        case Enum314.INSIDE_TOP_LEFT:

          sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTH));
          break;

        case Enum314.OUTSIDE_TOP_RIGHT:
        case Enum314.INSIDE_TOP_RIGHT:

          sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.EAST));
          break;

        default:
          sNewGridNo = sGridNo;
      }

      // Set target gridno to this one...
      sTargetGridNo = sNewGridNo;

      // now set target cube height
      // CJC says to hardcode this value :)
      pSoldier.bTargetCubeLevel = 2;
    } else {
      // ATE: Refine this a bit - if we have nobody as a target...
      if (pTargetSoldier == null) {
        sTargetGridNo = sGridNo;
      }
    }
  }

  // Cannot be fire if we are already in a fire animation....
  // this is to stop the shooting trigger/happy duded from contiously pressing fire...
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_FIRE) {
      return;
    }
  }

  // If in turn-based mode - return to movement
  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    // Reset some flags for cont move...
    pSoldier.sFinalDestination = pSoldier.sGridNo;
    pSoldier.bGoodContPath = false;
    //  guiPendingOverrideEvent = A_CHANGE_TO_MOVE;
  }

  if (pSoldier.bWeaponMode == Enum265.WM_ATTACHED) {
    iHandleReturn = HandleItem(pSoldier, sTargetGridNo, bTargetLevel, Enum225.UNDER_GLAUNCHER, true);
  } else {
    iHandleReturn = HandleItem(pSoldier, sTargetGridNo, bTargetLevel, pSoldier.inv[Enum261.HANDPOS].usItem, true);
  }

  if (iHandleReturn < 0) {
    if (iHandleReturn == ITEM_HANDLE_RELOADING) {
      guiNewUICursor = Enum210.ACTION_TARGET_RELOADING;
      return;
    }

    if (iHandleReturn == ITEM_HANDLE_NOROOM) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, pMessageStrings[Enum333.MSG_CANT_FIRE_HERE]);
      return;
    }
  }

  if (gTacticalStatus.uiFlags & TURNBASED && !(gTacticalStatus.uiFlags & INCOMBAT)) {
    HandleUICursorRTFeedback(pSoldier);
  }

  gfUIForceReExamineCursorData = true;
}

function AttackRequesterCallback(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    gTacticalStatus.ubLastRequesterTargetID = (<SOLDIERTYPE>gpRequesterTargetMerc).ubProfile;

    UIHandleMercAttack(<SOLDIERTYPE>gpRequesterMerc, gpRequesterTargetMerc, gsRequesterGridNo);
  }
}

function UIHandleCAMercShoot(pUIEvent: UI_EVENT): UINT32 {
  let usMapPos: UINT16 = 0;
  let pSoldier: SOLDIERTYPE | null;
  let pTSoldier: SOLDIERTYPE | null = null;
  let fDidRequester: boolean = false;

  if (gusSelectedSoldier != NO_SOLDIER) {
    if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
      return Enum26.GAME_SCREEN;
    }

    // Get soldier
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      // Get target guy...
      if (gfUIFullTargetFound) {
        // Get target soldier, if one exists
        pTSoldier = MercPtrs[gusUIFullTargetID];
      }

      if (pTSoldier != null) {
        // If this is one of our own guys.....pop up requiester...
        if ((pTSoldier.bTeam == gbPlayerNum || pTSoldier.bTeam == MILITIA_TEAM) && Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass != IC_MEDKIT && pSoldier.inv[Enum261.HANDPOS].usItem != Enum225.GAS_CAN && gTacticalStatus.ubLastRequesterTargetID != pTSoldier.ubProfile && (pTSoldier.ubID != pSoldier.ubID)) {
          let zStr: string /* INT16[200] */;

          gpRequesterMerc = pSoldier;
          gpRequesterTargetMerc = pTSoldier;
          gsRequesterGridNo = usMapPos;

          fDidRequester = true;

          zStr = swprintf(TacticalStr[Enum335.ATTACK_OWN_GUY_PROMPT], pTSoldier.name);

          DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zStr, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, AttackRequesterCallback, null);
        }
      }

      if (!fDidRequester) {
        UIHandleMercAttack(pSoldier, pTSoldier, usMapPos);
      }
    }
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleAEndAction(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let sTargetXPos: INT16;
  let sTargetYPos: INT16;
  let usMapPos: UINT16 = 0;

  // Get gridno at this location
  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
      if (gUITargetReady) {
        // Move to proper stance + direction!
        // Convert our grid-not into an XY
        ({ sX: sTargetXPos, sY: sTargetYPos } = ConvertGridNoToXY(usMapPos));

        // UNReady weapon
        SoldierReadyWeapon(pSoldier, sTargetXPos, sTargetYPos, true);

        gUITargetReady = false;
      }
    }
  }
  return Enum26.GAME_SCREEN;
}

function UIHandleCAEndConfirmAction(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    HandleEndConfirmCursor(pSoldier);
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleIOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let usMapPos: UINT16 = 0;

  // Get gridno at this location
  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if (!UIHandleOnMerc(true)) {
    // Check if dest is OK
    // if ( !NewOKDestination( usMapPos, FALSE ) || IsRoofVisible( usMapPos ) )
    ////{
    //	guiNewUICursor = CANNOT_MOVE_UICURSOR;
    //}
    // else
    { guiNewUICursor = Enum210.NORMAL_SNAPUICURSOR; }
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleIChangeToIdle(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.GAME_SCREEN;
}

function UIHandlePADJAdjustStance(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let ubNewStance: UINT8;
  let fChangeStance: boolean = false;

  guiShowUPDownArrows = ARROWS_HIDE_UP | ARROWS_HIDE_DOWN;

  gfIgnoreScrolling = false;

  if (gusSelectedSoldier != NO_SOLDIER && gbAdjustStanceDiff != 0) {
    // Get soldier
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      ubNewStance = GetAdjustedAnimHeight(gAnimControl[pSoldier.usAnimState].ubEndHeight, gbAdjustStanceDiff);

      if (gbClimbID == 1) {
        BeginSoldierClimbUpRoof(pSoldier);
      } else if (gbClimbID == -1) {
        BeginSoldierClimbDownRoof(pSoldier);
      } else {
        // Set state to result
        UIHandleSoldierStanceChange(pSoldier.ubID, ubNewStance);
      }

      // Once we have APs, we can safely reset nomove flag!
      // AdjustNoAPToFinishMove( pSoldier, FALSE );
    }
  }
  return Enum26.GAME_SCREEN;
}

function GetAdjustedAnimHeight(ubAnimHeight: UINT8, bChange: INT8): UINT8 {
  let ubNewAnimHeight: UINT8 = ubAnimHeight;

  if (ubAnimHeight == ANIM_STAND) {
    if (bChange == -1) {
      ubNewAnimHeight = ANIM_CROUCH;
    }
    if (bChange == -2) {
      ubNewAnimHeight = ANIM_PRONE;
    }
    if (bChange == 1) {
      ubNewAnimHeight = 50;
    }
  } else if (ubAnimHeight == ANIM_CROUCH) {
    if (bChange == 1) {
      ubNewAnimHeight = ANIM_STAND;
    }
    if (bChange == -1) {
      ubNewAnimHeight = ANIM_PRONE;
    }
    if (bChange == -2) {
      ubNewAnimHeight = 55;
    }
  } else if (ubAnimHeight == ANIM_PRONE) {
    if (bChange == -1) {
      ubNewAnimHeight = 55;
    }
    if (bChange == 1) {
      ubNewAnimHeight = ANIM_CROUCH;
    }
    if (bChange == 2) {
      ubNewAnimHeight = ANIM_STAND;
    }
  }

  return ubNewAnimHeight;
}

export function HandleObjectHighlighting(): void {
  let pSoldier: SOLDIERTYPE;
  let usMapPos: UINT16 = 0;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return;
  }

  // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
  if (gfUIFullTargetFound) {
    // Get Soldier
    pSoldier = <SOLDIERTYPE>GetSoldier(gusUIFullTargetID);

    // If an enemy, and in a given mode, highlight
    if (guiUIFullTargetFlags & ENEMY_MERC) {
      switch (gCurrentUIMode) {
        case Enum206.CONFIRM_MOVE_MODE:
        case Enum206.MENU_MODE:

          break;

        case Enum206.MOVE_MODE:
        case Enum206.CONFIRM_ACTION_MODE:
        // case ACTION_MODE:
        case Enum206.IDLE_MODE:

          // Set as selected
          // pSoldier->pCurrentShade = pSoldier->pShades[ 1 ];
          break;
      }
    } else if (guiUIFullTargetFlags & OWNED_MERC) {
      // Check for selected
      pSoldier.pCurrentShade = pSoldier.pShades[0];
      gfUIDoNotHighlightSelMerc = true;
    }
  }
}

export function AdjustSoldierCreationStartValues(): void {
  let cnt: INT32;
  let pSoldier: SOLDIERTYPE;

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  guiCreateGuyIndex = cnt;

  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (!pSoldier.bActive) {
      guiCreateGuyIndex = cnt;
      break;
    }
  }

  cnt = gTacticalStatus.Team[gbPlayerNum].bLastID + 1;
  guiCreateBadGuyIndex = cnt;

  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[LAST_TEAM].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (!pSoldier.bActive && cnt > gTacticalStatus.Team[gbPlayerNum].bLastID) {
      guiCreateBadGuyIndex = cnt;
      break;
    }
  }
}

export function SelectedMercCanAffordAttack(): boolean {
  let pSoldier: SOLDIERTYPE | null;
  let pTargetSoldier: SOLDIERTYPE;
  let usMapPos: UINT16 = 0;
  let sTargetGridNo: INT16;
  let fEnoughPoints: boolean = true;
  let sAPCost: INT16;
  let ubItemCursor: UINT8;
  let usInHand: UINT16;

  if (gusSelectedSoldier != NO_SOLDIER) {
    if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
      return true;
    }

    // Get soldier
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
      // LOOK IN GUY'S HAND TO CHECK LOCATION
      usInHand = pSoldier.inv[Enum261.HANDPOS].usItem;

      // Get cursor value
      ubItemCursor = GetActionModeCursor(pSoldier);

      if (ubItemCursor == INVALIDCURS) {
        return false;
      }

      if (ubItemCursor == BOMBCURS) {
        // Check as...
        if (EnoughPoints(pSoldier, GetTotalAPsToDropBomb(pSoldier, usMapPos), 0, true)) {
          return true;
        }
      } else if (ubItemCursor == REMOTECURS) {
        // Check as...
        if (EnoughPoints(pSoldier, GetAPsToUseRemote(pSoldier), 0, true)) {
          return true;
        }
      } else {
        // Look for a soldier at this position
        if (gfUIFullTargetFound) {
          // GetSoldier
          pTargetSoldier = <SOLDIERTYPE>GetSoldier(gusUIFullTargetID);
          sTargetGridNo = pTargetSoldier.sGridNo;
        } else {
          sTargetGridNo = usMapPos;
        }

        sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, 1, (pSoldier.bShownAimTime / 2));

        if (EnoughPoints(pSoldier, sAPCost, 0, true)) {
          return true;
        } else {
          // Play curse....
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
        }
      }
    }
  }

  return false;
}

export function SelectedMercCanAffordMove(): boolean {
  let pSoldier: SOLDIERTYPE | null;
  let sAPCost: UINT16 = 0;
  let sBPCost: INT16 = 0;
  let usMapPos: UINT16 = 0;
  let pIntTile: LEVELNODE | null;

  // Get soldier
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
    if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
      return true;
    }

    // IF WE ARE OVER AN INTERACTIVE TILE, GIVE GRIDNO OF POSITION
    pIntTile = GetCurInteractiveTile();

    if (pIntTile != null) {
      // CHECK APS
      if (EnoughPoints(pSoldier, gsCurrentActionPoints, 0, true)) {
        return true;
      } else {
        return false;
      }
    }

    // Take the first direction!
    sAPCost = PtsToMoveDirection(pSoldier, guiPathingData[0]);

    sAPCost += GetAPsToChangeStance(pSoldier, gAnimControl[pSoldier.usUIMovementMode].ubHeight);

    if (EnoughPoints(pSoldier, sAPCost, 0, true)) {
      return true;
    } else {
      // OK, remember where we were trying to get to.....
      pSoldier.sContPathLocation = usMapPos;
      pSoldier.bGoodContPath = true;
    }
  }

  return false;
}

export function GetMercClimbDirection(ubSoldierID: UINT8): { fNearLowerLevel: boolean, fNearHeigherLevel: boolean } {
  let fNearLowerLevel: boolean;
  let fNearHeigherLevel: boolean;

  let bNewDirection: INT8 = 0;
  let bNewDirection__Pointer = createPointer(() => bNewDirection, (v) => bNewDirection = v);
  let pSoldier: SOLDIERTYPE | null;

  fNearLowerLevel = false;
  fNearHeigherLevel = false;

  if ((pSoldier = GetSoldier(ubSoldierID)) === null) {
    return { fNearLowerLevel, fNearHeigherLevel };
  }

  // Check if we are close / can climb
  if (pSoldier.bLevel == 0) {
    // See if we are not in a building!
    if (FindHeigherLevel(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, bNewDirection__Pointer)) {
      fNearHeigherLevel = true;
    }
  }

  // IF we are higher...
  if (pSoldier.bLevel > 0) {
    if (FindLowerLevel(pSoldier, pSoldier.sGridNo, pSoldier.bDirection, bNewDirection__Pointer)) {
      fNearLowerLevel = true;
    }
  }

  return { fNearLowerLevel, fNearHeigherLevel };
}

function RemoveTacticalCursor(): void {
  guiNewUICursor = Enum210.NO_UICURSOR;
  ErasePath(true);
}

function UIHandlePOPUPMSG(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.GAME_SCREEN;
}

function UIHandleHCOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let usMapPos: UINT16 = 0;
  let pSoldier: SOLDIERTYPE | null;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  // If we are out of breath, no cursor...
  if (pSoldier.bBreath < OKBREATH && pSoldier.bCollapsed) {
    guiNewUICursor = Enum210.INVALID_ACTION_UICURSOR;
  } else {
    if (gsOverItemsGridNo != NOWHERE && (usMapPos != gsOverItemsGridNo || gsInterfaceLevel != gsOverItemsLevel)) {
      gsOverItemsGridNo = NOWHERE;
      guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
    } else {
      guiNewUICursor = Enum210.NORMALHANDCURSOR_UICURSOR;

      UIHandleInteractiveTilesAndItemsOnTerrain(pSoldier, usMapPos, true, false);
    }
  }
  return Enum26.GAME_SCREEN;
}

function UIHandleHCGettingItem(pUIEvent: UI_EVENT): UINT32 {
  guiNewUICursor = Enum210.NORMAL_FREEUICURSOR;

  return Enum26.GAME_SCREEN;
}

function UIHandleTATalkingMenu(pUIEvent: UI_EVENT): UINT32 {
  guiNewUICursor = Enum210.NORMAL_FREEUICURSOR;

  return Enum26.GAME_SCREEN;
}

function UIHandleEXExitSectorMenu(pUIEvent: UI_EVENT): UINT32 {
  guiNewUICursor = Enum210.NORMAL_FREEUICURSOR;

  return Enum26.GAME_SCREEN;
}

function UIHandleOpenDoorMenu(pUIEvent: UI_EVENT): UINT32 {
  guiNewUICursor = Enum210.NORMAL_FREEUICURSOR;

  return Enum26.GAME_SCREEN;
}

export function ToggleHandCursorMode(puiNewEvent: Pointer<UINT32>): void {
  // Toggle modes
  if (gCurrentUIMode == Enum206.HANDCURSOR_MODE) {
    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
  } else {
    puiNewEvent.value = Enum207.M_CHANGE_TO_HANDMODE;
  }
}

export function ToggleTalkCursorMode(puiNewEvent: Pointer<UINT32>): void {
  // Toggle modes
  if (gCurrentUIMode == Enum206.TALKCURSOR_MODE) {
    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
  } else {
    puiNewEvent.value = Enum207.T_CHANGE_TO_TALKING;
  }
}

export function ToggleLookCursorMode(puiNewEvent: Pointer<UINT32> | null): void {
  // Toggle modes
  if (gCurrentUIMode == Enum206.LOOKCURSOR_MODE) {
    guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
    HandleTacticalUI();
  } else {
    guiPendingOverrideEvent = Enum207.LC_CHANGE_TO_LOOK;
    HandleTacticalUI();
  }
}

export function UIHandleOnMerc(fMovementMode: boolean): boolean {
  let pSoldier: SOLDIERTYPE;
  let usSoldierIndex: UINT16;
  let uiMercFlags: UINT32;
  let usMapPos: UINT16 = 0;
  let fFoundMerc: boolean = false;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return true;
  }

  // if ( fMovementMode )
  //{
  //	fFoundMerc			= gfUISelectiveTargetFound;
  //	usSoldierIndex	= gusUISelectiveTargetID;
  //	uiMercFlags			= guiUISelectiveTargetFlags;
  //}
  // else
  {
    fFoundMerc = gfUIFullTargetFound;
    usSoldierIndex = gusUIFullTargetID;
    uiMercFlags = guiUIFullTargetFlags;
  }

  // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
  if (fFoundMerc) {
    // Get Soldier
    pSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

    if (uiMercFlags & OWNED_MERC) {
      // ATE: Check if this is an empty vehicle.....
      // if ( OK_ENTERABLE_VEHICLE( pSoldier ) && GetNumberInVehicle( pSoldier->bVehicleID ) == 0 )
      //{
      //	return( FALSE );
      //}

      // If not unconscious, select
      if (!(uiMercFlags & UNCONSCIOUS_MERC)) {
        if (fMovementMode) {
          // ERASE PATH
          ErasePath(true);

          // Show cursor with highlight on selected merc
          guiNewUICursor = Enum210.NO_UICURSOR;

          // IF selected, do selection one
          if ((uiMercFlags & SELECTED_MERC)) {
            // Add highlight to guy in interface.c
            gfUIHandleSelection = SELECTED_GUY_SELECTION;

            if (gpItemPointer == null) {
              // Don't do this unless we want to

              // Check if buddy is stationary!
              if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY || pSoldier.fNoAPToFinishMove) {
                guiShowUPDownArrows = ARROWS_SHOW_DOWN_BESIDE | ARROWS_SHOW_UP_BESIDE;
              }
            }
          } else {
            // if ( ( uiMercFlags & ONDUTY_MERC ) && !( uiMercFlags & NOINTERRUPT_MERC ) )
            if (!(uiMercFlags & NOINTERRUPT_MERC)) {
              // Add highlight to guy in interface.c
              gfUIHandleSelection = NONSELECTED_GUY_SELECTION;
            } else {
              gfUIHandleSelection = ENEMY_GUY_SELECTION;
              gfUIHandleSelectionAboveGuy = true;
            }
          }
        }
      }

      // If not dead, show above guy!
      if (!(uiMercFlags & DEAD_MERC)) {
        if (fMovementMode) {
          // ERASE PATH
          ErasePath(true);

          // Show cursor with highlight on selected merc
          guiNewUICursor = Enum210.NO_UICURSOR;

          gsSelectedGridNo = pSoldier.sGridNo;
          gsSelectedLevel = pSoldier.bLevel;
        }

        gsSelectedGuy = usSoldierIndex;
        gfUIHandleSelectionAboveGuy = true;
      }
    } else if (((uiMercFlags & ENEMY_MERC) || (uiMercFlags & NEUTRAL_MERC)) && (uiMercFlags & VISIBLE_MERC)) {
      // ATE: If we are a vehicle, let the mouse cursor be a wheel...
      if ((OK_ENTERABLE_VEHICLE(pSoldier))) {
        return false;
      } else {
        if (fMovementMode) {
          // Check if this guy is on the enemy team....
          if (!pSoldier.bNeutral && (pSoldier.bSide != gbPlayerNum)) {
            gUIActionModeChangeDueToMouseOver = true;

            guiPendingOverrideEvent = Enum207.M_CHANGE_TO_ACTION;
            // Return FALSE
            return false;
          } else {
            // ERASE PATH
            ErasePath(true);

            // Show cursor with highlight on selected merc
            guiNewUICursor = Enum210.NO_UICURSOR;
            // Show cursor with highlight
            gfUIHandleSelection = ENEMY_GUY_SELECTION;
            gsSelectedGridNo = pSoldier.sGridNo;
            gsSelectedLevel = pSoldier.bLevel;
          }
        }

        gfUIHandleSelectionAboveGuy = true;
        gsSelectedGuy = usSoldierIndex;
      }
    } else {
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        return false;
      }
    }
  } else {
    gfIgnoreOnSelectedGuy = false;

    return false;
  }

  return true;
}

function UIHandleILoadLevel(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.INIT_SCREEN;
}

function UIHandleISoldierDebug(pUIEvent: UI_EVENT): UINT32 {
  // Use soldier display pages
  SetDebugRenderHook(DebugSoldierPage1, 0);
  SetDebugRenderHook(DebugSoldierPage2, 1);
  SetDebugRenderHook(DebugSoldierPage3, 2);
  SetDebugRenderHook(DebugSoldierPage4, 3);
  gCurDebugPage = 1;

  return Enum26.DEBUG_SCREEN;
}

function UIHandleILOSDebug(pUIEvent: UI_EVENT): UINT32 {
  SetDebugRenderHook(DebugStructurePage1, 0);
  return Enum26.DEBUG_SCREEN;
}

function UIHandleILevelNodeDebug(pUIEvent: UI_EVENT): UINT32 {
  SetDebugRenderHook(DebugLevelNodePage, 0);
  return Enum26.DEBUG_SCREEN;
}

function UIHandleIETOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  // guiNewUICursor = CANNOT_MOVE_UICURSOR;
  guiNewUICursor = Enum210.NO_UICURSOR;

  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  return Enum26.GAME_SCREEN;
}

export function UIHandleSoldierStanceChange(ubSoldierID: UINT8, bNewStance: INT8): void {
  let pSoldier: SOLDIERTYPE;

  pSoldier = MercPtrs[ubSoldierID];

  // Is this a valid stance for our position?
  if (!IsValidStance(pSoldier, bNewStance)) {
    if (pSoldier.bCollapsed && pSoldier.bBreath < OKBREATH) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[4], pSoldier.name);
    } else {
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.VEHICLES_NO_STANCE_CHANGE_STR]);
      } else if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.ROBOT_NO_STANCE_CHANGE_STR]);
      } else {
        if (pSoldier.bCollapsed) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, pMessageStrings[Enum333.MSG_CANT_CHANGE_STANCE], pSoldier.name);
        } else {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_STANCE_CHANGE_STR], pSoldier.name);
        }
      }
    }
    return;
  }

  // IF turn-based - adjust stance now!
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    pSoldier.fTurningFromPronePosition = 0;

    // Check if we have enough APS
    if (SoldierCanAffordNewStance(pSoldier, bNewStance)) {
      // Adjust stance
      // ChangeSoldierStance( pSoldier, bNewStance );
      SendChangeSoldierStanceEvent(pSoldier, bNewStance);

      pSoldier.sFinalDestination = pSoldier.sGridNo;
      pSoldier.bGoodContPath = false;
    } else
      return;
  }

  // If realtime- change walking animation!
  if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    // If we are stationary, do something else!
    if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY) {
      // Change stance normally
      SendChangeSoldierStanceEvent(pSoldier, bNewStance);
    } else {
      // Pick moving animation based on stance

      // LOCK VARIBLE FOR NO UPDATE INDEX...
      pSoldier.usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, bNewStance);

      if (pSoldier.usUIMovementMode == Enum193.CRAWLING && gAnimControl[pSoldier.usAnimState].ubEndHeight != ANIM_PRONE) {
        pSoldier.usDontUpdateNewGridNoOnMoveAnimChange = LOCKED_NO_NEWGRIDNO;
        pSoldier.bPathStored = false;
      } else {
        pSoldier.usDontUpdateNewGridNoOnMoveAnimChange = 1;
      }

      ChangeSoldierState(pSoldier, pSoldier.usUIMovementMode, 0, false);
    }
  }

  // Set UI value for soldier
  SetUIbasedOnStance(pSoldier, bNewStance);

  gfUIStanceDifferent = true;

  // ATE: If we are being serviced...stop...
  // InternalReceivingSoldierCancelServices( pSoldier, FALSE );
  InternalGivingSoldierCancelServices(pSoldier, false);
  // gfPlotNewMovement   = TRUE;
}

function UIHandleIETEndTurn(pUIEvent: UI_EVENT): UINT32 {
  return Enum26.GAME_SCREEN;
}

function UIHandleIGotoDemoMode(pUIEvent: UI_EVENT): UINT32 {
  return EnterTacticalDemoMode();
}

function UIHandleILoadFirstLevel(pUIEvent: UI_EVENT): UINT32 {
  gubCurrentScene = 0;
  return Enum26.INIT_SCREEN;
}

function UIHandleILoadSecondLevel(pUIEvent: UI_EVENT): UINT32 {
  gubCurrentScene = 1;
  return Enum26.INIT_SCREEN;
}

function UIHandleILoadThirdLevel(pUIEvent: UI_EVENT): UINT32 {
  gubCurrentScene = 2;
  return Enum26.INIT_SCREEN;
}

function UIHandleILoadFourthLevel(pUIEvent: UI_EVENT): UINT32 {
  gubCurrentScene = 3;
  return Enum26.INIT_SCREEN;
}

function UIHandleILoadFifthLevel(pUIEvent: UI_EVENT): UINT32 {
  gubCurrentScene = 4;
  return Enum26.INIT_SCREEN;
}

/* static */ let GetCursorMovementFlags__fStationary: boolean = false;
/* static */ let GetCursorMovementFlags__usOldMouseXPos: UINT16 = 32000;
/* static */ let GetCursorMovementFlags__usOldMouseYPos: UINT16 = 32000;
/* static */ let GetCursorMovementFlags__usOldMapPos: UINT16 = 32000;
/* static */ let GetCursorMovementFlags__uiSameFrameCursorFlags: UINT32;
/* static */ let GetCursorMovementFlags__uiOldFrameNumber: UINT32 = 99999;
export function GetCursorMovementFlags(): UINT32 {
  let uiCursorFlags: UINT32;

  let usMapPos: UINT16 = 0;
  let sXPos: INT16;
  let sYPos: INT16;

  // Check if this is the same frame as before, return already calculated value if so!
  if (GetCursorMovementFlags__uiOldFrameNumber == guiGameCycleCounter) {
    uiCursorFlags = GetCursorMovementFlags__uiSameFrameCursorFlags;
    return uiCursorFlags;
  }

  GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v));
  ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(usMapPos));

  uiCursorFlags = 0;

  if (gusMouseXPos != GetCursorMovementFlags__usOldMouseXPos || gusMouseYPos != GetCursorMovementFlags__usOldMouseYPos) {
    uiCursorFlags |= MOUSE_MOVING;

    // IF CURSOR WAS PREVIOUSLY STATIONARY, MAKE THE ADDITIONAL CHECK OF GRID POS CHANGE
    if (GetCursorMovementFlags__fStationary && GetCursorMovementFlags__usOldMapPos == usMapPos) {
      uiCursorFlags |= MOUSE_MOVING_IN_TILE;
    } else {
      GetCursorMovementFlags__fStationary = false;
      uiCursorFlags |= MOUSE_MOVING_NEW_TILE;
    }
  } else {
    uiCursorFlags |= MOUSE_STATIONARY;
    GetCursorMovementFlags__fStationary = true;
  }

  GetCursorMovementFlags__usOldMapPos = usMapPos;
  GetCursorMovementFlags__usOldMouseXPos = gusMouseXPos;
  GetCursorMovementFlags__usOldMouseYPos = gusMouseYPos;

  GetCursorMovementFlags__uiOldFrameNumber = guiGameCycleCounter;
  GetCursorMovementFlags__uiSameFrameCursorFlags = uiCursorFlags;

  return uiCursorFlags;
}

/* static */ let HandleUIMovementCursor__usTargetID: UINT16 = NOBODY;
/* static */ let HandleUIMovementCursor__fTargetFound: boolean = false;
export function HandleUIMovementCursor(pSoldier: SOLDIERTYPE, uiCursorFlags: UINT32, usMapPos: UINT16, uiFlags: UINT32): boolean {
  let fSetCursor: boolean = false;
  let fCalculated: boolean = false;
  let fTargetFoundAndLookingForOne: boolean = false;
  let fIntTileFoundAndLookingForOne: boolean = false;

  // Determine if we can afford!
  if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
    gfUIDisplayActionPointsInvalid = true;
  }

  // Check if we're stationary
  if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) || ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STATIONARY) || pSoldier.fNoAPToFinishMove) || pSoldier.ubID >= MAX_NUM_SOLDIERS) {
    // If we are targeting a merc for some reason, don't go thorugh normal channels if we are on someone now
    if (uiFlags == MOVEUI_TARGET_MERCS || uiFlags == MOVEUI_TARGET_MERCSFORAID) {
      if (gfUIFullTargetFound != HandleUIMovementCursor__fTargetFound || HandleUIMovementCursor__usTargetID != gusUIFullTargetID || gfResetUIMovementOptimization) {
        gfResetUIMovementOptimization = false;

        // ERASE PATH
        ErasePath(true);

        // Try and get a path right away
        DrawUIMovementPath(pSoldier, usMapPos, uiFlags);
      }

      // Save for next time...
      HandleUIMovementCursor__fTargetFound = gfUIFullTargetFound;
      HandleUIMovementCursor__usTargetID = gusUIFullTargetID;

      if (HandleUIMovementCursor__fTargetFound) {
        fTargetFoundAndLookingForOne = true;
      }
    }

    if (uiFlags == MOVEUI_TARGET_ITEMS) {
      gfUIOverItemPool = true;
      gfUIOverItemPoolGridNo = usMapPos;
    } else if (uiFlags == MOVEUI_TARGET_MERCSFORAID) {
      // Set values for AP display...
      gfUIDisplayActionPointsCenter = true;
    }

    // IF CURSOR IS MOVING
    if ((uiCursorFlags & MOUSE_MOVING) || gfUINewStateForIntTile) {
      // SHOW CURSOR
      fSetCursor = true;

      // IF CURSOR WAS PREVIOUSLY STATIONARY, MAKE THE ADDITIONAL CHECK OF GRID POS CHANGE
      if (((uiCursorFlags & MOUSE_MOVING_NEW_TILE) && !fTargetFoundAndLookingForOne) || gfUINewStateForIntTile) {
        // ERASE PATH
        ErasePath(true);

        // Reset counter
        RESETCOUNTER(Enum386.PATHFINDCOUNTER);

        gfPlotNewMovement = true;
      }

      if (uiCursorFlags & MOUSE_MOVING_IN_TILE) {
        gfUIDisplayActionPoints = true;
      }
    }

    if (uiCursorFlags & MOUSE_STATIONARY) {
      // CURSOR IS STATIONARY
      if (_KeyDown(SHIFT) && !gfPlotNewMovementNOCOST) {
        gfPlotNewMovementNOCOST = true;
        gfPlotNewMovement = true;
      }
      if (!(_KeyDown(SHIFT)) && gfPlotNewMovementNOCOST) {
        gfPlotNewMovementNOCOST = false;
        gfPlotNewMovement = true;
      }

      // ONLY DIPSLAY PATH AFTER A DELAY
      if (COUNTERDONE(Enum386.PATHFINDCOUNTER)) {
        // Reset counter
        RESETCOUNTER(Enum386.PATHFINDCOUNTER);

        if (gfPlotNewMovement) {
          DrawUIMovementPath(pSoldier, usMapPos, uiFlags);

          gfPlotNewMovement = false;
        }
      }

      fSetCursor = true;

      // DISPLAY POINTS EVEN WITHOUT DELAY
      // ONLY IF GFPLOT NEW MOVEMENT IS FALSE!
      if (!gfPlotNewMovement) {
        if (gsCurrentActionPoints < 0 || ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
          gfUIDisplayActionPoints = false;
        } else {
          gfUIDisplayActionPoints = true;

          if (uiFlags == MOVEUI_TARGET_INTTILES) {
            // Set values for AP display...
            gUIDisplayActionPointsOffX = 22;
            gUIDisplayActionPointsOffY = 15;
          }
          if (uiFlags == MOVEUI_TARGET_BOMB) {
            // Set values for AP display...
            gUIDisplayActionPointsOffX = 22;
            gUIDisplayActionPointsOffY = 15;
          } else if (uiFlags == MOVEUI_TARGET_ITEMS) {
            // Set values for AP display...
            gUIDisplayActionPointsOffX = 22;
            gUIDisplayActionPointsOffY = 15;
          } else {
            switch (pSoldier.usUIMovementMode) {
              case Enum193.WALKING:

                gUIDisplayActionPointsOffY = 10;
                gUIDisplayActionPointsOffX = 10;
                break;

              case Enum193.RUNNING:
                gUIDisplayActionPointsOffY = 15;
                gUIDisplayActionPointsOffX = 21;
                break;
            }
          }
        }
      }
    }
  } else {
    // THE MERC IS MOVING
    // We're moving, erase path, change cursor
    ErasePath(true);

    fSetCursor = true;
  }

  return fSetCursor;
}

function DrawUIMovementPath(pSoldier: SOLDIERTYPE, usMapPos: UINT16, uiFlags: UINT32): INT8 {
  let sAPCost: INT16 = 0;
  let sAPCost__Pointer = createPointer(() => sAPCost, (v) => sAPCost = v);
  let sBPCost: INT16 = 0;
  let sBPCost__Pointer = createPointer(() => sBPCost, (v) => sBPCost = v);
  let sActionGridNo: INT16;
  let pStructure: STRUCTURE | null = <STRUCTURE><unknown>null;
  let pStructure__Pointer = createPointer(() => pStructure, (v) => pStructure = v);
  let fOnInterTile: boolean = false;
  let ubDirection: UINT8 = 0;
  let ubDirection__Pointer = createPointer(() => ubDirection, (v) => ubDirection = v);
  //	ITEM_POOL					*pItemPool;
  let sAdjustedGridNo: INT16 = 0;
  let sAdjustedGridNo__Pointer = createPointer(() => sAdjustedGridNo, (v) => sAdjustedGridNo = v);
  let sIntTileGridNo: INT16 = 0;
  let sIntTileGridNo__Pointer = createPointer(() => sIntTileGridNo, (v) => sIntTileGridNo = v);
  let pIntTile: LEVELNODE | null;
  let bReturnCode: INT8 = 0;
  let fPlot: UINT8 /* boolean */;
  let ubMercID: UINT8 = 0;
  let ubMercID__Pointer = createPointer(() => ubMercID, (v) => ubMercID = v);

  if ((gTacticalStatus.uiFlags & INCOMBAT) && (gTacticalStatus.uiFlags & TURNBASED) || _KeyDown(SHIFT)) {
    fPlot = PLOT;
  } else {
    fPlot = NO_PLOT;
  }

  sActionGridNo = usMapPos;
  sAPCost = 0;

  ErasePath(false);

  // IF WE ARE OVER AN INTERACTIVE TILE, GIVE GRIDNO OF POSITION
  if (uiFlags == MOVEUI_TARGET_INTTILES) {
    // Get structure info for in tile!
    pIntTile = GetCurInteractiveTileGridNoAndStructure(sIntTileGridNo__Pointer, pStructure__Pointer);

    // We should not have null here if we are given this flag...
    if (pIntTile != null) {
      sActionGridNo = FindAdjacentGridEx(pSoldier, sIntTileGridNo, ubDirection__Pointer, null, false, true);
      if (sActionGridNo == -1) {
        sActionGridNo = sIntTileGridNo;
      }
      CalcInteractiveObjectAPs(sIntTileGridNo, pStructure, sAPCost__Pointer, sBPCost__Pointer);
      // sAPCost += UIPlotPath( pSoldier, sActionGridNo, NO_COPYROUTE, PLOT, TEMPORARY, (UINT16)pSoldier->usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier->bActionPoints);
      sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (sActionGridNo != pSoldier.sGridNo) {
        gfUIHandleShowMoveGrid = 1;
        gsUIHandleShowMoveGridLocation = sActionGridNo;
      }

      // Add cost for stance change....
      sAPCost += GetAPsToChangeStance(pSoldier, ANIM_STAND);
    } else {
      sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);
    }
  } else if (uiFlags == MOVEUI_TARGET_WIREFENCE) {
    sActionGridNo = FindAdjacentGridEx(pSoldier, usMapPos, ubDirection__Pointer, null, false, true);
    if (sActionGridNo == -1) {
      sAPCost = 0;
    } else {
      sAPCost = GetAPsToCutFence(pSoldier);

      sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (sActionGridNo != pSoldier.sGridNo) {
        gfUIHandleShowMoveGrid = 1;
        gsUIHandleShowMoveGridLocation = sActionGridNo;
      }
    }
  } else if (uiFlags == MOVEUI_TARGET_JAR) {
    sActionGridNo = FindAdjacentGridEx(pSoldier, usMapPos, ubDirection__Pointer, null, false, true);
    if (sActionGridNo == -1) {
      sActionGridNo = usMapPos;
    }

    sAPCost = GetAPsToUseJar(pSoldier, sActionGridNo);

    sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

    if (sActionGridNo != pSoldier.sGridNo) {
      gfUIHandleShowMoveGrid = 1;
      gsUIHandleShowMoveGridLocation = sActionGridNo;
    }
  } else if (uiFlags == MOVEUI_TARGET_CAN) {
    // Get structure info for in tile!
    pIntTile = GetCurInteractiveTileGridNoAndStructure(sIntTileGridNo__Pointer, pStructure__Pointer);

    // We should not have null here if we are given this flag...
    if (pIntTile != null) {
      sActionGridNo = FindAdjacentGridEx(pSoldier, sIntTileGridNo, ubDirection__Pointer, null, false, true);
      if (sActionGridNo != -1) {
        sAPCost = AP_ATTACH_CAN;
        sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

        if (sActionGridNo != pSoldier.sGridNo) {
          gfUIHandleShowMoveGrid = 1;
          gsUIHandleShowMoveGridLocation = sActionGridNo;
        }
      }
    } else {
      sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);
    }
  } else if (uiFlags == MOVEUI_TARGET_REPAIR) {
    // For repair, check if we are over a vehicle, then get gridnot to edge of that vehicle!
    if (IsRepairableStructAtGridNo(usMapPos, ubMercID__Pointer) == 2) {
      let sNewGridNo: INT16;
      let ubDirection: UINT8;

      sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.usUIMovementMode, 5, ubDirection__Pointer, 0, MercPtrs[ubMercID]);

      if (sNewGridNo != NOWHERE) {
        usMapPos = sNewGridNo;
      }
    }

    sActionGridNo = FindAdjacentGridEx(pSoldier, usMapPos, ubDirection__Pointer, null, false, true);
    if (sActionGridNo == -1) {
      sActionGridNo = usMapPos;
    }

    sAPCost = GetAPsToBeginRepair(pSoldier);

    sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

    if (sActionGridNo != pSoldier.sGridNo) {
      gfUIHandleShowMoveGrid = 1;
      gsUIHandleShowMoveGridLocation = sActionGridNo;
    }
  } else if (uiFlags == MOVEUI_TARGET_REFUEL) {
    // For repair, check if we are over a vehicle, then get gridnot to edge of that vehicle!
    if (IsRefuelableStructAtGridNo(usMapPos, ubMercID__Pointer) == <boolean><unknown>2) {
      let sNewGridNo: INT16;
      let ubDirection: UINT8;

      sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.usUIMovementMode, 5, ubDirection__Pointer, 0, MercPtrs[ubMercID]);

      if (sNewGridNo != NOWHERE) {
        usMapPos = sNewGridNo;
      }
    }

    sActionGridNo = FindAdjacentGridEx(pSoldier, usMapPos, ubDirection__Pointer, null, false, true);
    if (sActionGridNo == -1) {
      sActionGridNo = usMapPos;
    }

    sAPCost = GetAPsToRefuelVehicle(pSoldier);

    sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

    if (sActionGridNo != pSoldier.sGridNo) {
      gfUIHandleShowMoveGrid = 1;
      gsUIHandleShowMoveGridLocation = sActionGridNo;
    }
  } else if (uiFlags == MOVEUI_TARGET_MERCS) {
    let sGotLocation: INT16 = NOWHERE;
    let fGotAdjacent: boolean = false;

    // Check if we are on a target
    if (gfUIFullTargetFound) {
      let cnt: INT32;
      let sSpot: INT16;
      let ubGuyThere: UINT8;

      for (cnt = 0; cnt < Enum245.NUM_WORLD_DIRECTIONS; cnt++) {
        sSpot = NewGridNo(pSoldier.sGridNo, DirectionInc(cnt));

        // Make sure movement costs are OK....
        if (gubWorldMovementCosts[sSpot][cnt][gsInterfaceLevel] >= TRAVELCOST_BLOCKED) {
          continue;
        }

        // Check for who is there...
        ubGuyThere = WhoIsThere2(sSpot, pSoldier.bLevel);

        if (ubGuyThere == MercPtrs[gusUIFullTargetID].ubID) {
          // We've got a guy here....
          // Who is the one we want......
          sGotLocation = sSpot;
          sAdjustedGridNo = MercPtrs[gusUIFullTargetID].sGridNo;
          ubDirection = cnt;
          break;
        }
      }

      if (sGotLocation == NOWHERE) {
        sActionGridNo = FindAdjacentGridEx(pSoldier, MercPtrs[gusUIFullTargetID].sGridNo, ubDirection__Pointer, sAdjustedGridNo__Pointer, true, false);

        if (sActionGridNo == -1) {
          sGotLocation = NOWHERE;
        } else {
          sGotLocation = sActionGridNo;
        }
        fGotAdjacent = true;
      }
    } else {
      sAdjustedGridNo = usMapPos;
      sGotLocation = sActionGridNo;
      fGotAdjacent = true;
    }

    if (sGotLocation != NOWHERE) {
      sAPCost += MinAPsToAttack(pSoldier, sAdjustedGridNo, 1);
      sAPCost += UIPlotPath(pSoldier, sGotLocation, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (sGotLocation != pSoldier.sGridNo && fGotAdjacent) {
        gfUIHandleShowMoveGrid = 1;
        gsUIHandleShowMoveGridLocation = sGotLocation;
      }
    }
  } else if (uiFlags == MOVEUI_TARGET_STEAL) {
    // Check if we are on a target
    if (gfUIFullTargetFound) {
      sActionGridNo = FindAdjacentGridEx(pSoldier, MercPtrs[gusUIFullTargetID].sGridNo, ubDirection__Pointer, sAdjustedGridNo__Pointer, true, false);
      if (sActionGridNo == -1) {
        sActionGridNo = sAdjustedGridNo;
      }
      sAPCost += AP_STEAL_ITEM;
      // CJC August 13 2002: take into account stance in AP prediction
      if (!(PTR_STANDING(pSoldier))) {
        sAPCost += GetAPsToChangeStance(pSoldier, ANIM_STAND);
      }
      sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (sActionGridNo != pSoldier.sGridNo) {
        gfUIHandleShowMoveGrid = 1;
        gsUIHandleShowMoveGridLocation = sActionGridNo;
      }
    }
  } else if (uiFlags == MOVEUI_TARGET_BOMB) {
    sAPCost += GetAPsToDropBomb(pSoldier);
    sAPCost += UIPlotPath(pSoldier, usMapPos, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

    gfUIHandleShowMoveGrid = 1;
    gsUIHandleShowMoveGridLocation = usMapPos;
  } else if (uiFlags == MOVEUI_TARGET_MERCSFORAID) {
    if (gfUIFullTargetFound) {
      sActionGridNo = FindAdjacentGridEx(pSoldier, MercPtrs[gusUIFullTargetID].sGridNo, ubDirection__Pointer, sAdjustedGridNo__Pointer, true, false);

      // Try again at another gridno...
      if (sActionGridNo == -1) {
        sActionGridNo = FindAdjacentGridEx(pSoldier, usMapPos, ubDirection__Pointer, sAdjustedGridNo__Pointer, true, false);

        if (sActionGridNo == -1) {
          sActionGridNo = sAdjustedGridNo;
        }
      }
      sAPCost += GetAPsToBeginFirstAid(pSoldier);
      sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);
      if (sActionGridNo != pSoldier.sGridNo) {
        gfUIHandleShowMoveGrid = 1;
        gsUIHandleShowMoveGridLocation = sActionGridNo;
      }
    }
  } else if (uiFlags == MOVEUI_TARGET_ITEMS) {
    // if ( GetItemPool( usMapPos, &pItemPool, pSoldier->bLevel ) )
    {
      // if ( ITEMPOOL_VISIBLE( pItemPool ) )
      {
        sActionGridNo = AdjustGridNoForItemPlacement(pSoldier, sActionGridNo);

        if (pSoldier.sGridNo != sActionGridNo) {
          sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);
          if (sAPCost != 0) {
            sAPCost += AP_PICKUP_ITEM;
          }
        } else {
          sAPCost += AP_PICKUP_ITEM;
        }

        if (sActionGridNo != pSoldier.sGridNo) {
          gfUIHandleShowMoveGrid = 1;
          gsUIHandleShowMoveGridLocation = sActionGridNo;
        }
      }
    }
  } else {
    sAPCost += UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, fPlot, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);
  }

  if (gTacticalStatus.uiFlags & SHOW_AP_LEFT) {
    gsCurrentActionPoints = pSoldier.bActionPoints - sAPCost;
  } else {
    gsCurrentActionPoints = sAPCost;
  }

  return bReturnCode;
}

export function UIMouseOnValidAttackLocation(pSoldier: SOLDIERTYPE): boolean {
  let usInHand: UINT16;
  let fGuyHere: boolean = false;
  let pTSoldier: SOLDIERTYPE;
  let ubItemCursor: UINT8;
  let usMapPos: UINT16 = 0;

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return false;
  }

  // LOOK IN GUY'S HAND TO CHECK LOCATION
  usInHand = pSoldier.inv[Enum261.HANDPOS].usItem;

  // Get cursor value
  ubItemCursor = GetActionModeCursor(pSoldier);

  if (ubItemCursor == INVALIDCURS) {
    return false;
  }

  if (ubItemCursor == WIRECUTCURS) {
    if (IsCuttableWireFenceAtGridNo(usMapPos) && pSoldier.bLevel == 0) {
      return true;
    } else {
      return false;
    }
  }

  if (ubItemCursor == REPAIRCURS) {
    if (gfUIFullTargetFound) {
      usMapPos = MercPtrs[gusUIFullTargetID].sGridNo;
    }

    if (IsRepairableStructAtGridNo(usMapPos, null) && pSoldier.bLevel == 0) {
      return true;
    } else {
      return false;
    }
  }

  if (ubItemCursor == REFUELCURS) {
    if (gfUIFullTargetFound) {
      usMapPos = MercPtrs[gusUIFullTargetID].sGridNo;
    }

    if (IsRefuelableStructAtGridNo(usMapPos, null) && pSoldier.bLevel == 0) {
      return true;
    } else {
      return false;
    }
  }

  if (ubItemCursor == BOMBCURS) {
    if (usMapPos == pSoldier.sGridNo) {
      return true;
    }

    if (!NewOKDestination(pSoldier, usMapPos, true, pSoldier.bLevel)) {
      return false;
    }
  }

  // SEE IF THERE IS SOMEBODY HERE
  if (gfUIFullTargetFound && ubItemCursor != KNIFECURS) {
    fGuyHere = true;

    if (guiUIFullTargetFlags & SELECTED_MERC && Item[usInHand].usItemClass != IC_MEDKIT) {
      return false;
    }
  }

  if (!CanPlayerUseRocketRifle(pSoldier, true)) {
    return false;
  }

  // if ( Item[ usInHand ].usItemClass == IC_BLADE && usInHand != THROWING_KNIFE )
  //{
  //	if ( !fGuyHere )
  //	{
  //	return( FALSE );
  //	}
  //}

  if (Item[usInHand].usItemClass == IC_PUNCH) {
    if (!fGuyHere) {
      return false;
    }
  }

  // if ( Item[ usInHand ].usItemClass == IC_BLADE )
  //{
  //	if ( !fGuyHere )
  //	{
  //		return( FALSE );
  //	}
  //}

  if (Item[usInHand].usItemClass == IC_MEDKIT) {
    if (!fGuyHere) {
      return false;
    }

    // IF a guy's here, chack if they need medical help!
    pTSoldier = MercPtrs[gusUIFullTargetID];

    // If we are a vehicle...
    if ((pTSoldier.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_ROBOT))) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_DO_FIRST_AID_STR], pTSoldier.name);
      return false;
    }

    if (pSoldier.bMedical == 0) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, pMessageStrings[Enum333.MSG_MERC_HAS_NO_MEDSKILL], pSoldier.name);
      return false;
    }

    if (pTSoldier.bBleeding == 0 && pTSoldier.bLife != pTSoldier.bLifeMax) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[19], pTSoldier.name);
      return false;
    }

    if (pTSoldier.bBleeding == 0 && pTSoldier.bLife >= OKLIFE) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_NO_NEED_FIRST_AID_STR], pTSoldier.name);
      return false;
    }
  }

  return true;
}

export function UIOkForItemPickup(pSoldier: SOLDIERTYPE, sGridNo: INT16): boolean {
  let sAPCost: INT16;
  let pItemPool: ITEM_POOL | null;

  sAPCost = GetAPsToPickupItem(pSoldier, sGridNo);

  if (sAPCost == 0) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
  } else {
    if ((pItemPool = GetItemPool(sGridNo, pSoldier.bLevel))) {
      // if ( !ITEMPOOL_VISIBLE( pItemPool ) )
      {
        //		return( FALSE );
      }
    }

    if (EnoughPoints(pSoldier, sAPCost, 0, true)) {
      return true;
    }
  }

  return false;
}

function SoldierCanAffordNewStance(pSoldier: SOLDIERTYPE, ubDesiredStance: UINT8): boolean {
  let bCurrentHeight: INT8;
  let bAP: UINT8 = 0;
  let bBP: UINT8 = 0;

  bCurrentHeight = (ubDesiredStance - gAnimControl[pSoldier.usAnimState].ubEndHeight);

  // Now change to appropriate animation

  switch (bCurrentHeight) {
    case ANIM_STAND - ANIM_CROUCH:
    case ANIM_CROUCH - ANIM_STAND:

      bAP = AP_CROUCH;
      bBP = BP_CROUCH;
      break;

    case ANIM_STAND - ANIM_PRONE:
    case ANIM_PRONE - ANIM_STAND:

      bAP = AP_CROUCH + AP_PRONE;
      bBP = BP_CROUCH + BP_PRONE;
      break;

    case ANIM_CROUCH - ANIM_PRONE:
    case ANIM_PRONE - ANIM_CROUCH:

      bAP = AP_PRONE;
      bBP = BP_PRONE;
      break;
  }

  return EnoughPoints(pSoldier, bAP, bBP, true);
}

function SetUIbasedOnStance(pSoldier: SOLDIERTYPE, bNewStance: INT8): void {
  // Set UI based on our stance!
  switch (bNewStance) {
    case ANIM_STAND:
      pSoldier.usUIMovementMode = Enum193.WALKING;
      break;

    case ANIM_CROUCH:
      pSoldier.usUIMovementMode = Enum193.SWATTING;
      break;

    case ANIM_PRONE:
      pSoldier.usUIMovementMode = Enum193.CRAWLING;
      break;
  }

  // Set UI cursor!
}

function SetMovementModeCursor(pSoldier: SOLDIERTYPE): void {
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    if ((OK_ENTERABLE_VEHICLE(pSoldier))) {
      guiNewUICursor = Enum210.MOVE_VEHICLE_UICURSOR;
    } else {
      // Change mouse cursor based on type of movement we want to do
      switch (pSoldier.usUIMovementMode) {
        case Enum193.WALKING:
          guiNewUICursor = Enum210.MOVE_WALK_UICURSOR;
          break;

        case Enum193.RUNNING:
          guiNewUICursor = Enum210.MOVE_RUN_UICURSOR;
          break;

        case Enum193.SWATTING:
          guiNewUICursor = Enum210.MOVE_SWAT_UICURSOR;
          break;

        case Enum193.CRAWLING:
          guiNewUICursor = Enum210.MOVE_PRONE_UICURSOR;
          break;
      }
    }
  }

  if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gfUIAllMoveOn) {
      guiNewUICursor = Enum210.ALL_MOVE_REALTIME_UICURSOR;
    } else {
      // if ( pSoldier->fUIMovementFast )
      //{
      //	BeginDisplayTimedCursor( MOVE_RUN_REALTIME_UICURSOR, 300 );
      //}

      guiNewUICursor = Enum210.MOVE_REALTIME_UICURSOR;
    }
  }

  guiNewUICursor = GetInteractiveTileCursor(guiNewUICursor, false);
}

function SetConfirmMovementModeCursor(pSoldier: SOLDIERTYPE, fFromMove: boolean): void {
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gfUIAllMoveOn) {
      if ((OK_ENTERABLE_VEHICLE(pSoldier))) {
        guiNewUICursor = Enum210.ALL_MOVE_VEHICLE_UICURSOR;
      } else {
        // Change mouse cursor based on type of movement we want to do
        switch (pSoldier.usUIMovementMode) {
          case Enum193.WALKING:
            guiNewUICursor = Enum210.ALL_MOVE_WALK_UICURSOR;
            break;

          case Enum193.RUNNING:
            guiNewUICursor = Enum210.ALL_MOVE_RUN_UICURSOR;
            break;

          case Enum193.SWATTING:
            guiNewUICursor = Enum210.ALL_MOVE_SWAT_UICURSOR;
            break;

          case Enum193.CRAWLING:
            guiNewUICursor = Enum210.ALL_MOVE_PRONE_UICURSOR;
            break;
        }
      }
    } else {
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        guiNewUICursor = Enum210.CONFIRM_MOVE_VEHICLE_UICURSOR;
      } else {
        // Change mouse cursor based on type of movement we want to do
        switch (pSoldier.usUIMovementMode) {
          case Enum193.WALKING:
            guiNewUICursor = Enum210.CONFIRM_MOVE_WALK_UICURSOR;
            break;

          case Enum193.RUNNING:
            guiNewUICursor = Enum210.CONFIRM_MOVE_RUN_UICURSOR;
            break;

          case Enum193.SWATTING:
            guiNewUICursor = Enum210.CONFIRM_MOVE_SWAT_UICURSOR;
            break;

          case Enum193.CRAWLING:
            guiNewUICursor = Enum210.CONFIRM_MOVE_PRONE_UICURSOR;
            break;
        }
      }
    }
  }

  if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gfUIAllMoveOn) {
      if (gfUIAllMoveOn == 2) {
        BeginDisplayTimedCursor(Enum210.MOVE_RUN_REALTIME_UICURSOR, 300);
      } else {
        guiNewUICursor = Enum210.ALL_MOVE_REALTIME_UICURSOR;
      }
    } else {
      if (pSoldier.fUIMovementFast && pSoldier.usAnimState == Enum193.RUNNING && fFromMove) {
        BeginDisplayTimedCursor(Enum210.MOVE_RUN_REALTIME_UICURSOR, 300);
      }

      guiNewUICursor = Enum210.CONFIRM_MOVE_REALTIME_UICURSOR;
    }
  }

  guiNewUICursor = GetInteractiveTileCursor(guiNewUICursor, true);
}

function UIHandleLCOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let sFacingDir: INT16;
  let sXPos: INT16 = 0;
  let sYPos: INT16 = 0;

  guiNewUICursor = Enum210.LOOK_UICURSOR;

  // Get soldier
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  gfUIDisplayActionPoints = true;

  gUIDisplayActionPointsOffX = 14;
  gUIDisplayActionPointsOffY = 7;

  // Get soldier
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  GetMouseXY(createPointer(() => sXPos, (v) => sXPos = v), createPointer(() => sYPos, (v) => sYPos = v));

  // Get direction from mouse pos
  sFacingDir = GetDirectionFromXY(sXPos, sYPos, pSoldier);

  // Set # of APs
  if (sFacingDir != pSoldier.bDirection) {
    gsCurrentActionPoints = GetAPsToLook(pSoldier);
  } else {
    gsCurrentActionPoints = 0;
  }

  // Determine if we can afford!
  if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
    gfUIDisplayActionPointsInvalid = true;
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleLCChangeToLook(pUIEvent: UI_EVENT): UINT32 {
  ErasePath(true);

  return Enum26.GAME_SCREEN;
}

function MakeSoldierTurn(pSoldier: SOLDIERTYPE, sXPos: INT16, sYPos: INT16): boolean {
  let sFacingDir: INT16;
  let sAPCost: INT16;

  // Get direction from mouse pos
  sFacingDir = GetDirectionFromXY(sXPos, sYPos, pSoldier);

  if (sFacingDir != pSoldier.bDirection) {
    sAPCost = GetAPsToLook(pSoldier);

    // Check AP cost...
    if (!EnoughPoints(pSoldier, sAPCost, 0, true)) {
      return false;
    }

    // ATE: make stationary if...
    if (pSoldier.fNoAPToFinishMove) {
      SoldierGotoStationaryStance(pSoldier);
    }

    // DEF:  made it an event
    SendSoldierSetDesiredDirectionEvent(pSoldier, sFacingDir);

    pSoldier.bTurningFromUI = true;

    // ATE: Hard-code here previous event to ui busy event...
    guiOldEvent = Enum207.LA_BEGINUIOURTURNLOCK;

    return true;
  }

  return false;
}

function UIHandleLCLook(pUIEvent: UI_EVENT): UINT32 {
  let sXPos: INT16 = 0;
  let sYPos: INT16 = 0;
  let pSoldier: SOLDIERTYPE | null;
  let cnt: INT32;

  if (!GetMouseXY(createPointer(() => sXPos, (v) => sXPos = v), createPointer(() => sYPos, (v) => sYPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if (gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
    // OK, loop through all guys who are 'multi-selected' and
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
      if (pSoldier.bActive && pSoldier.bInSector) {
        if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
          MakeSoldierTurn(pSoldier, sXPos, sYPos);
        }
      }
    }
  } else {
    // Get soldier
    if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
      return Enum26.GAME_SCREEN;
    }

    if (MakeSoldierTurn(pSoldier, sXPos, sYPos)) {
      SetUIBusy(pSoldier.ubID);
    }
  }
  return Enum26.GAME_SCREEN;
}

function UIHandleTOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let ubTargID: UINT8 = 0;
  let uiRange: UINT32;
  let usMapPos: UINT16 = 0;
  let fValidTalkableGuy: boolean = false;
  let sTargetGridNo: INT16;
  let sDistVisible: INT16;

  // Get soldier
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if (ValidQuickExchangePosition()) {
    // Do new cursor!
    guiPendingOverrideEvent = Enum207.M_ON_TERRAIN;
    return UIHandleMOnTerrain(pUIEvent);
  }

  sTargetGridNo = usMapPos;

  UIHandleOnMerc(false);

  // CHECK FOR VALID TALKABLE GUY HERE
  fValidTalkableGuy = IsValidTalkableNPCFromMouse(createPointer(() => ubTargID, (v) => ubTargID = v), false, true, false);

  // USe cursor based on distance
  // Get distance away
  if (fValidTalkableGuy) {
    sTargetGridNo = MercPtrs[ubTargID].sGridNo;
  }

  uiRange = GetRangeFromGridNoDiff(pSoldier.sGridNo, sTargetGridNo);

  // ATE: Check if we have good LOS
  // is he close enough to see that gridno if he turns his head?
  sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sTargetGridNo, pSoldier.bLevel);

  if (uiRange <= NPC_TALK_RADIUS) {
    if (fValidTalkableGuy) {
      guiNewUICursor = Enum210.TALK_A_UICURSOR;
    } else {
      guiNewUICursor = Enum210.TALK_NA_UICURSOR;
    }
  } else {
    if (fValidTalkableGuy) {
      // guiNewUICursor = TALK_OUT_RANGE_A_UICURSOR;
      guiNewUICursor = Enum210.TALK_A_UICURSOR;
    } else {
      guiNewUICursor = Enum210.TALK_OUT_RANGE_NA_UICURSOR;
    }
  }

  if (fValidTalkableGuy) {
    if (!SoldierTo3DLocationLineOfSightTest(pSoldier, sTargetGridNo, pSoldier.bLevel, 3, sDistVisible, true)) {
      //. ATE: Make range far, so we alternate cursors...
      guiNewUICursor = Enum210.TALK_OUT_RANGE_A_UICURSOR;
    }
  }

  gfUIDisplayActionPoints = true;

  gUIDisplayActionPointsOffX = 8;
  gUIDisplayActionPointsOffY = 3;

  // Set # of APs
  gsCurrentActionPoints = 6;

  // Determine if we can afford!
  if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
    gfUIDisplayActionPointsInvalid = true;
  }

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gfUIFullTargetFound) {
      PauseRT(true);
    } else {
      PauseRT(false);
    }
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleTChangeToTalking(pUIEvent: UI_EVENT): UINT32 {
  ErasePath(true);

  return Enum26.GAME_SCREEN;
}

function UIHandleLUIOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  // guiNewUICursor = NO_UICURSOR;
  //	SetCurrentCursorFromDatabase( VIDEO_NO_CURSOR );

  return Enum26.GAME_SCREEN;
}

function UIHandleLUIBeginLock(pUIEvent: UI_EVENT): UINT32 {
  // Don't let both versions of the locks to happen at the same time!
  // ( They are mutually exclusive )!
  UIHandleLAEndLockOurTurn(null);

  if (!gfDisableRegionActive) {
    gfDisableRegionActive = true;

    RemoveTacticalCursor();
    // SetCurrentCursorFromDatabase( VIDEO_NO_CURSOR );

    MSYS_DefineRegion(gDisableRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_WAIT, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
    // Add region
    MSYS_AddRegion(gDisableRegion);

    // guiPendingOverrideEvent = LOCKUI_MODE;

    // UnPause time!
    PauseGame();
    LockPauseState(16);
  }

  return Enum26.GAME_SCREEN;
}

export function UIHandleLUIEndLock(pUIEvent: UI_EVENT | null): UINT32 {
  if (gfDisableRegionActive) {
    gfDisableRegionActive = false;

    // Add region
    MSYS_RemoveRegion(gDisableRegion);
    RefreshMouseRegions();

    // SetCurrentCursorFromDatabase( guiCurrentUICursor );

    guiForceRefreshMousePositionCalculation = true;
    UIHandleMOnTerrain(null);

    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      SetCurrentCursorFromDatabase(gUICursors[guiNewUICursor].usFreeCursorName);
    }

    guiPendingOverrideEvent = Enum207.M_ON_TERRAIN;
    HandleTacticalUI();

    // ATE: Only if NOT in conversation!
    if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
      // UnPause time!
      UnLockPauseState();
      UnPauseGame();
    }
  }

  return Enum26.GAME_SCREEN;
}

export function CheckForDisabledRegionRemove(): void {
  if (gfDisableRegionActive) {
    gfDisableRegionActive = false;

    // Remove region
    MSYS_RemoveRegion(gDisableRegion);

    UnLockPauseState();
    UnPauseGame();
  }

  if (gfUserTurnRegionActive) {
    gfUserTurnRegionActive = false;

    gfUIInterfaceSetBusy = false;

    // Remove region
    MSYS_RemoveRegion(gUserTurnRegion);

    UnLockPauseState();
    UnPauseGame();
  }
}

function UIHandleLAOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  // guiNewUICursor = NO_UICURSOR;
  // SetCurrentCursorFromDatabase( VIDEO_NO_CURSOR );

  return Enum26.GAME_SCREEN;
}

function GetGridNoScreenXY(sGridNo: INT16, pScreenX: Pointer<INT16>, pScreenY: Pointer<INT16>): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let sTempX_S: INT16;
  let sTempY_S: INT16;
  let sXPos: INT16;
  let sYPos: INT16;

  ({ sCellX: sXPos, sCellY: sYPos } = ConvertGridNoToCellXY(sGridNo));

  // Get 'TRUE' merc position
  sOffsetX = sXPos - gsRenderCenterX;
  sOffsetY = sYPos - gsRenderCenterY;

  ({ sScreenX: sTempX_S, sScreenY: sTempY_S } = FromCellToScreenCoordinates(sOffsetX, sOffsetY));

  sScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + sTempX_S;
  sScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + sTempY_S;

  // Adjust for offset position on screen
  sScreenX -= gsRenderWorldOffsetX;
  sScreenY -= gsRenderWorldOffsetY;
  sScreenY -= gpWorldLevelData[sGridNo].sHeight;

  // Adjust based on interface level

  // Adjust for render height
  sScreenY += gsRenderHeight;

  // Adjust y offset!
  sScreenY += (WORLD_TILE_Y / 2);

  (pScreenX.value) = sScreenX;
  (pScreenY.value) = sScreenY;
}

export function EndMultiSoldierSelection(fAcknowledge: boolean): void {
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;
  let pFirstSoldier: SOLDIERTYPE | null = null;
  let fSelectedSoldierInBatch: boolean = false;

  gTacticalStatus.fAtLeastOneGuyOnMultiSelect = false;

  // OK, loop through all guys who are 'multi-selected' and
  // check if our currently selected guy is amoung the
  // lucky few.. if not, change to a guy who is...
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.bInSector) {
      if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
        gTacticalStatus.fAtLeastOneGuyOnMultiSelect = true;

        if (pSoldier.ubID != gusSelectedSoldier && pFirstSoldier == null) {
          pFirstSoldier = pSoldier;
        }

        if (pSoldier.ubID == gusSelectedSoldier) {
          fSelectedSoldierInBatch = true;
        }

        if (!gGameSettings.fOptions[Enum8.TOPTION_MUTE_CONFIRMATIONS] && fAcknowledge)
          InternalDoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_ATTN1, BATTLE_SND_LOWER_VOLUME);

        if (pSoldier.fMercAsleep) {
          PutMercInAwakeState(pSoldier);
        }
      }
    }
  }

  // If here, select the first guy...
  if (pFirstSoldier != null && !fSelectedSoldierInBatch) {
    SelectSoldier(pFirstSoldier.ubID, true, true);
  }
}

export function StopRubberBandedMercFromMoving(): void {
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;

  if (!gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
    return;
  }

  // OK, loop through all guys who are 'multi-selected' and
  // check if our currently selected guy is amoung the
  // lucky few.. if not, change to a guy who is...
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.bInSector) {
      if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
        pSoldier.fDelayedMovement = 0;
        pSoldier.sFinalDestination = pSoldier.sGridNo;
        StopSoldier(pSoldier);
      }
    }
  }
}

export function EndRubberBanding(): void {
  if (gRubberBandActive) {
    FreeMouseCursor();
    gfIgnoreScrolling = false;

    EndMultiSoldierSelection(true);

    gRubberBandActive = false;
  }
}

function HandleMultiSelectionMove(sDestGridNo: INT16): boolean {
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;
  let fAtLeastOneMultiSelect: boolean = false;
  let fMoveFast: boolean = false;

  // OK, loop through all guys who are 'multi-selected' and
  // Make them move....

  // Do a loop first to see if the selected guy is told to go fast...
  gfGetNewPathThroughPeople = true;

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.bInSector) {
      if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
        if (pSoldier.ubID == gusSelectedSoldier) {
          fMoveFast = pSoldier.fUIMovementFast;
          break;
        }
      }
    }
  }

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.bInSector) {
      if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
        // If we can't be controlled, returninvalid...
        if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
          if (!CanRobotBeControlled(pSoldier)) {
            continue;
          }
        }

        pSoldier.fUIMovementFast = fMoveFast;
        pSoldier.usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight);

        pSoldier.fUIMovementFast = false;

        if (gUIUseReverse) {
          pSoldier.bReverse = true;
        } else {
          pSoldier.bReverse = false;
        }

        // Remove any previous actions
        pSoldier.ubPendingAction = NO_PENDING_ACTION;

        if (EVENT_InternalGetNewSoldierPath(pSoldier, sDestGridNo, pSoldier.usUIMovementMode, 1, pSoldier.fNoAPToFinishMove)) {
          InternalDoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1, BATTLE_SND_LOWER_VOLUME);
        } else {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.NO_PATH_FOR_MERC], pSoldier.name);
        }

        fAtLeastOneMultiSelect = true;
      }
    }
  }
  gfGetNewPathThroughPeople = false;

  return fAtLeastOneMultiSelect;
}

export function ResetMultiSelection(): void {
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // OK, loop through all guys who are 'multi-selected' and
  // Make them move....

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.bInSector) {
      if (pSoldier.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
        pSoldier.uiStatusFlags &= (~SOLDIER_MULTI_SELECTED);
      }
    }
  }

  gTacticalStatus.fAtLeastOneGuyOnMultiSelect = false;
}

function UIHandleRubberBandOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE;
  let cnt: INT32;
  let sScreenX: INT16 = 0;
  let sScreenX__Pointer = createPointer(() => sScreenX, (v) => sScreenX = v);
  let sScreenY: INT16 = 0;
  let sScreenY__Pointer = createPointer(() => sScreenY, (v) => sScreenY = v);
  let iTemp: INT32;
  let aRect: SGPRect = createSGPRect();
  let fAtLeastOne: boolean = false;

  guiNewUICursor = Enum210.NO_UICURSOR;
  // SetCurrentCursorFromDatabase( VIDEO_NO_CURSOR );

  gRubberBandRect.iRight = gusMouseXPos;
  gRubberBandRect.iBottom = gusMouseYPos;

  // Copy into temp rect
  copySGPRect(aRect, gRubberBandRect);

  if (aRect.iRight < aRect.iLeft) {
    iTemp = aRect.iLeft;
    aRect.iLeft = aRect.iRight;
    aRect.iRight = iTemp;
  }

  if (aRect.iBottom < aRect.iTop) {
    iTemp = aRect.iTop;
    aRect.iTop = aRect.iBottom;
    aRect.iBottom = iTemp;
  }

  // ATE:Check at least for one guy that's in point!
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    // Check if this guy is OK to control....
    if (OK_CONTROLLABLE_MERC(pSoldier) && !(pSoldier.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_PASSENGER | SOLDIER_DRIVER))) {
      // Get screen pos of gridno......
      GetGridNoScreenXY(pSoldier.sGridNo, sScreenX__Pointer, sScreenY__Pointer);

      // ATE: If we are in a hiehger interface level, subttrasct....
      if (gsInterfaceLevel == 1) {
        sScreenY -= 50;
      }

      if (IsPointInScreenRect(sScreenX, sScreenY, aRect)) {
        fAtLeastOne = true;
      }
    }
  }

  if (!fAtLeastOne) {
    return Enum26.GAME_SCREEN;
  }

  // ATE: Now loop through our guys and see if any fit!
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    // Check if this guy is OK to control....
    if (OK_CONTROLLABLE_MERC(pSoldier) && !(pSoldier.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_PASSENGER | SOLDIER_DRIVER))) {
      if (!_KeyDown(ALT)) {
        pSoldier.uiStatusFlags &= (~SOLDIER_MULTI_SELECTED);
      }

      // Get screen pos of gridno......
      GetGridNoScreenXY(pSoldier.sGridNo, sScreenX__Pointer, sScreenY__Pointer);

      // ATE: If we are in a hiehger interface level, subttrasct....
      if (gsInterfaceLevel == 1) {
        sScreenY -= 50;
      }

      if (IsPointInScreenRect(sScreenX, sScreenY, aRect)) {
        // Adjust this guy's flag...
        pSoldier.uiStatusFlags |= SOLDIER_MULTI_SELECTED;
      }
    }
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleJumpOverOnTerrain(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let usMapPos: UINT16 = 0;

  // Here, first get map screen
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if (!IsValidJumpLocation(pSoldier, usMapPos, false)) {
    guiPendingOverrideEvent = Enum207.M_ON_TERRAIN;
    return Enum26.GAME_SCREEN;
  }

  // Display APs....
  gsCurrentActionPoints = GetAPsToJumpOver(pSoldier);

  gfUIDisplayActionPoints = true;
  gfUIDisplayActionPointsCenter = true;

  guiNewUICursor = Enum210.JUMP_OVER_UICURSOR;

  return Enum26.GAME_SCREEN;
}

function UIHandleJumpOver(pUIEvent: UI_EVENT): UINT32 {
  let pSoldier: SOLDIERTYPE | null;
  let usMapPos: UINT16 = 0;
  let bDirection: INT8;

  // Here, first get map screen
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return Enum26.GAME_SCREEN;
  }

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return Enum26.GAME_SCREEN;
  }

  if (!IsValidJumpLocation(pSoldier, usMapPos, false)) {
    return Enum26.GAME_SCREEN;
  }

  SetUIBusy(pSoldier.ubID);

  // OK, Start jumping!
  // Remove any previous actions
  pSoldier.ubPendingAction = NO_PENDING_ACTION;

  // Get direction to goto....
  bDirection = GetDirectionFromGridNo(usMapPos, pSoldier);

  pSoldier.fDontChargeTurningAPs = true;
  EVENT_InternalSetSoldierDesiredDirection(pSoldier, bDirection, false, pSoldier.usAnimState);
  pSoldier.fTurningUntilDone = true;
  // ATE: Reset flag to go back to prone...
  // pSoldier->fTurningFromPronePosition = TURNING_FROM_PRONE_OFF;
  pSoldier.usPendingAnimation = Enum193.JUMP_OVER_BLOCKING_PERSON;

  return Enum26.GAME_SCREEN;
}

function UIHandleLABeginLockOurTurn(pUIEvent: UI_EVENT): UINT32 {
  // Don't let both versions of the locks to happen at the same time!
  // ( They are mutually exclusive )!
  UIHandleLUIEndLock(null);

  if (!gfUserTurnRegionActive) {
    gfUserTurnRegionActive = true;

    gfUIInterfaceSetBusy = true;
    guiUIInterfaceBusyTime = GetJA2Clock();

    // guiNewUICursor = NO_UICURSOR;
    // SetCurrentCursorFromDatabase( VIDEO_NO_CURSOR );

    MSYS_DefineRegion(gUserTurnRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_WAIT, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
    // Add region
    MSYS_AddRegion(gUserTurnRegion);

    // guiPendingOverrideEvent = LOCKOURTURN_UI_MODE;

    ErasePath(true);

    // Pause time!
    PauseGame();
    LockPauseState(17);
  }

  return Enum26.GAME_SCREEN;
}

function UIHandleLAEndLockOurTurn(pUIEvent: UI_EVENT | null): UINT32 {
  if (gfUserTurnRegionActive) {
    gfUserTurnRegionActive = false;

    gfUIInterfaceSetBusy = false;

    // Add region
    MSYS_RemoveRegion(gUserTurnRegion);
    RefreshMouseRegions();
    // SetCurrentCursorFromDatabase( guiCurrentUICursor );

    gfPlotNewMovement = true;

    guiForceRefreshMousePositionCalculation = true;
    UIHandleMOnTerrain(null);

    if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
      SetCurrentCursorFromDatabase(gUICursors[guiNewUICursor].usFreeCursorName);
    }
    guiPendingOverrideEvent = Enum207.M_ON_TERRAIN;
    HandleTacticalUI();

    TurnOffTeamsMuzzleFlashes(gbPlayerNum);

    // UnPause time!
    UnLockPauseState();
    UnPauseGame();
  }

  return Enum26.GAME_SCREEN;
}

export function IsValidTalkableNPCFromMouse(pubSoldierID: Pointer<UINT8>, fGive: boolean, fAllowMercs: boolean, fCheckCollapsed: boolean): boolean {
  // Check if there is a guy here to talk to!
  if (gfUIFullTargetFound) {
    pubSoldierID.value = gusUIFullTargetID;
    return IsValidTalkableNPC(gusUIFullTargetID, fGive, fAllowMercs, fCheckCollapsed);
  }

  return false;
}

export function IsValidTalkableNPC(ubSoldierID: UINT8, fGive: boolean, fAllowMercs: boolean, fCheckCollapsed: boolean): boolean {
  let pSoldier: SOLDIERTYPE = MercPtrs[ubSoldierID];
  let fValidGuy: boolean = false;

  if (gusSelectedSoldier != NOBODY) {
    if (AM_A_ROBOT(MercPtrs[gusSelectedSoldier])) {
      return false;
    }
  }

  // CHECK IF ACTIVE!
  if (!pSoldier.bActive) {
    return false;
  }

  // CHECK IF DEAD
  if (pSoldier.bLife == 0) {
    return false;
  }

  if (pSoldier.bCollapsed && fCheckCollapsed) {
    return false;
  }

  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    return false;
  }

  // IF BAD GUY - CHECK VISIVILITY
  if (pSoldier.bTeam != gbPlayerNum) {
    if (pSoldier.bVisible == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
      return false;
    }
  }

  if (pSoldier.ubProfile != NO_PROFILE && pSoldier.ubProfile >= FIRST_RPC && !RPC_RECRUITED(pSoldier) && !AM_AN_EPC(pSoldier)) {
    fValidGuy = true;
  }

  // Check for EPC...
  if (pSoldier.ubProfile != NO_PROFILE && (gCurrentUIMode == Enum206.TALKCURSOR_MODE || fGive) && AM_AN_EPC(pSoldier)) {
    fValidGuy = true;
  }

  // ATE: We can talk to our own teammates....
  if (pSoldier.bTeam == gbPlayerNum && fAllowMercs) {
    fValidGuy = true;
  }

  if (GetCivType(pSoldier) != CIV_TYPE_NA && !fGive) {
    fValidGuy = true;
  }

  // Alright, let's do something special here for robot...
  if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
    if (fValidGuy == true && !fGive) {
      // Can't talk to robots!
      fValidGuy = false;
    }
  }

  // OK, check if they are stationary or not....
  // Do some checks common to all..
  if (fValidGuy) {
    if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_MOVING) && !(gTacticalStatus.uiFlags & INCOMBAT)) {
      return false;
    }

    return true;
  }

  return false;
}

export function HandleTalkInit(): boolean {
  let sAPCost: INT16;
  let pSoldier: SOLDIERTYPE | null;
  let pTSoldier: SOLDIERTYPE;
  let uiRange: UINT32;
  let usMapPos: UINT16 = 0;
  let sGoodGridNo: INT16;
  let ubNewDirection: UINT8 = 0;
  let ubQuoteNum: UINT8;
  let ubDiceRoll: UINT8;
  let sDistVisible: INT16;
  let sActionGridNo: INT16;
  let ubDirection: UINT8 = 0;

  // Get soldier
  if ((pSoldier = GetSoldier(gusSelectedSoldier)) === null) {
    return false;
  }

  if (!GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    return false;
  }

  // Check if there is a guy here to talk to!
  if (gfUIFullTargetFound) {
    // Is he a valid NPC?
    if (IsValidTalkableNPC(gusUIFullTargetID, false, true, false)) {
      pTSoldier = <SOLDIERTYPE>GetSoldier(gusUIFullTargetID);

      if (pTSoldier.ubID != pSoldier.ubID) {
        // ATE: Check if we have good LOS
        // is he close enough to see that gridno if he turns his head?
        sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, pTSoldier.sGridNo, pTSoldier.bLevel);

        // Check LOS!
        if (!SoldierTo3DLocationLineOfSightTest(pSoldier, pTSoldier.sGridNo, pTSoldier.bLevel, 3, sDistVisible, true)) {
          if (pTSoldier.ubProfile != NO_PROFILE) {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_LOS_TO_TALK_TARGET], pSoldier.name, pTSoldier.name);
          } else {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[45], pSoldier.name);
          }
          return false;
        }
      }

      if (pTSoldier.bCollapsed) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[21], pTSoldier.name);
        return false;
      }

      // If Q on, turn off.....
      if (guiCurrentScreen == Enum26.DEBUG_SCREEN) {
        gfExitDebugScreen = true;
      }

      // ATE: if our own guy...
      if (pTSoldier.bTeam == gbPlayerNum && !AM_AN_EPC(pTSoldier)) {
        if (pTSoldier.ubProfile == Enum268.DIMITRI) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[32], pTSoldier.name);
          return false;
        }

        // Randomize quote to use....

        // If buddy had a social trait...
        if (gMercProfiles[pTSoldier.ubProfile].bAttitude != Enum271.ATT_NORMAL) {
          ubDiceRoll = Random(3);
        } else {
          ubDiceRoll = Random(2);
        }

        // If we are a PC, only use 0
        if (pTSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__PLAYER_CHARACTER) {
          ubDiceRoll = 0;
        }

        switch (ubDiceRoll) {
          case 0:

            ubQuoteNum = Enum202.QUOTE_NEGATIVE_COMPANY;
            break;

          case 1:

            if (QuoteExp_PassingDislike[pTSoldier.ubProfile]) {
              ubQuoteNum = Enum202.QUOTE_PASSING_DISLIKE;
            } else {
              ubQuoteNum = Enum202.QUOTE_NEGATIVE_COMPANY;
            }
            break;

          case 2:

            ubQuoteNum = Enum202.QUOTE_SOCIAL_TRAIT;
            break;

          default:

            ubQuoteNum = Enum202.QUOTE_NEGATIVE_COMPANY;
            break;
        }

        if (pTSoldier.ubProfile == Enum268.IRA) {
          ubQuoteNum = Enum202.QUOTE_PASSING_DISLIKE;
        }

        TacticalCharacterDialogue(pTSoldier, ubQuoteNum);

        return false;
      }

      // Check distance
      uiRange = GetRangeFromGridNoDiff(pSoldier.sGridNo, usMapPos);

      // Double check path
      if (GetCivType(pTSoldier) != CIV_TYPE_NA) {
        // ATE: If one is already active, just remove it!
        if (ShutDownQuoteBoxIfActive()) {
          return false;
        }
      }

      if (uiRange > NPC_TALK_RADIUS) {
        // First get an adjacent gridno....
        sActionGridNo = FindAdjacentGridEx(pSoldier, pTSoldier.sGridNo, createPointer(() => ubDirection, (v) => ubDirection = v), null, false, true);

        if (sActionGridNo == -1) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
          return false;
        }

        if (UIPlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints) == 0) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
          return false;
        }

        // Walk up and talk to buddy....
        gfNPCCircularDistLimit = true;
        sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, pSoldier.usUIMovementMode, pTSoldier.sGridNo, (NPC_TALK_RADIUS - 1), createPointer(() => ubNewDirection, (v) => ubNewDirection = v), true);
        gfNPCCircularDistLimit = false;

        // First calculate APs and validate...
        sAPCost = AP_TALK;
        // sAPCost += UIPlotPath( pSoldier, sGoodGridNo, NO_COPYROUTE, FALSE, TEMPORARY, (UINT16)pSoldier->usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier->bActionPoints );

        // Check AP cost...
        if (!EnoughPoints(pSoldier, sAPCost, 0, true)) {
          return false;
        }

        // Now walkup to talk....
        pSoldier.ubPendingAction = Enum257.MERC_TALK;
        pSoldier.uiPendingActionData1 = pTSoldier.ubID;
        pSoldier.ubPendingActionAnimCount = 0;

        // WALK UP TO DEST FIRST
        EVENT_InternalGetNewSoldierPath(pSoldier, sGoodGridNo, pSoldier.usUIMovementMode, 1, pSoldier.fNoAPToFinishMove);

        return false;
      } else {
        sAPCost = AP_TALK;

        // Check AP cost...
        if (!EnoughPoints(pSoldier, sAPCost, 0, true)) {
          return false;
        }

        // OK, startup!
        PlayerSoldierStartTalking(pSoldier, pTSoldier.ubID, false);
      }

      if (GetCivType(pTSoldier) != CIV_TYPE_NA) {
        return false;
      } else {
        return true;
      }
    }
  }

  return false;
}

export function SetUIBusy(ubID: UINT8): void {
  if ((gTacticalStatus.uiFlags & INCOMBAT) && (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.ubCurrentTeam == gbPlayerNum)) {
    if (gusSelectedSoldier == ubID) {
      guiPendingOverrideEvent = Enum207.LA_BEGINUIOURTURNLOCK;
      HandleTacticalUI();
    }
  }
}

export function UnSetUIBusy(ubID: UINT8): void {
  if ((gTacticalStatus.uiFlags & INCOMBAT) && (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.ubCurrentTeam == gbPlayerNum)) {
    if (!gTacticalStatus.fUnLockUIAfterHiddenInterrupt) {
      if (gusSelectedSoldier == ubID) {
        guiPendingOverrideEvent = Enum207.LA_ENDUIOUTURNLOCK;
        HandleTacticalUI();

        // Set grace period...
        gTacticalStatus.uiTactialTurnLimitClock = GetJA2Clock();
      }
    }
    // player getting control back so reset all muzzle flashes
  }
}

export function BeginDisplayTimedCursor(uiCursorID: UINT32, uiDelay: UINT32): void {
  gfDisplayTimerCursor = true;
  guiTimerCursorID = uiCursorID;
  guiTimerLastUpdate = GetJA2Clock();
  guiTimerCursorDelay = uiDelay;
}

/* static */ let UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool: boolean = false;
/* static */ let UIHandleInteractiveTilesAndItemsOnTerrain__fOverEnemy: boolean = false;
function UIHandleInteractiveTilesAndItemsOnTerrain(pSoldier: SOLDIERTYPE, usMapPos: INT16, fUseOKCursor: boolean, fItemsOnlyIfOnIntTiles: boolean): INT8 {
  let pItemPool: ITEM_POOL | null;
  let fSetCursor: boolean;
  let uiCursorFlags: UINT32;
  let pIntTile: LEVELNODE | null;
  let sActionGridNo: INT16;
  let sIntTileGridNo: INT16 = 0;
  let fContinue: boolean = true;
  let pStructure: STRUCTURE | null = <STRUCTURE><unknown>null;
  let fPoolContainsHiddenItems: boolean = false;
  let pTSoldier: SOLDIERTYPE;

  if (gfResetUIItemCursorOptimization) {
    gfResetUIItemCursorOptimization = false;
    UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool = false;
    UIHandleInteractiveTilesAndItemsOnTerrain__fOverEnemy = false;
  }

  uiCursorFlags = GetCursorMovementFlags();

  // Default gridno to mouse pos
  sActionGridNo = usMapPos;

  // Look for being on a merc....
  // Steal.....
  UIHandleOnMerc(false);

  gfBeginVehicleCursor = false;

  if (gfUIFullTargetFound) {
    pTSoldier = MercPtrs[gusUIFullTargetID];

    if (OK_ENTERABLE_VEHICLE(pTSoldier) && pTSoldier.bVisible != -1) {
      // grab number of occupants in vehicles
      if (fItemsOnlyIfOnIntTiles) {
        if (!OKUseVehicle(pTSoldier.ubProfile)) {
          // Set UI CURSOR....
          guiNewUICursor = Enum210.CANNOT_MOVE_UICURSOR;

          gfBeginVehicleCursor = true;
          return 1;
        } else {
          if (GetNumberInVehicle(pTSoldier.bVehicleID) == 0) {
            // Set UI CURSOR....
            guiNewUICursor = Enum210.ENTER_VEHICLE_UICURSOR;

            gfBeginVehicleCursor = true;
            return 1;
          }
        }
      } else {
        // Set UI CURSOR....
        guiNewUICursor = Enum210.ENTER_VEHICLE_UICURSOR;
        return 1;
      }
    }

    if (!fItemsOnlyIfOnIntTiles) {
      if ((guiUIFullTargetFlags & ENEMY_MERC) && !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
        if (!UIHandleInteractiveTilesAndItemsOnTerrain__fOverEnemy) {
          UIHandleInteractiveTilesAndItemsOnTerrain__fOverEnemy = true;
          gfPlotNewMovement = true;
        }

        // Set UI CURSOR
        if (fUseOKCursor || ((gTacticalStatus.uiFlags & INCOMBAT) && (gTacticalStatus.uiFlags & TURNBASED))) {
          guiNewUICursor = Enum210.OKHANDCURSOR_UICURSOR;
        } else {
          guiNewUICursor = Enum210.NORMALHANDCURSOR_UICURSOR;
        }

        fSetCursor = HandleUIMovementCursor(pSoldier, uiCursorFlags, sActionGridNo, MOVEUI_TARGET_STEAL);

        // Display action points
        gfUIDisplayActionPoints = true;

        // Determine if we can afford!
        if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
          gfUIDisplayActionPointsInvalid = true;
        }

        return 0;
      }
    }
  }

  if (UIHandleInteractiveTilesAndItemsOnTerrain__fOverEnemy) {
    ErasePath(true);
    UIHandleInteractiveTilesAndItemsOnTerrain__fOverEnemy = false;
    gfPlotNewMovement = true;
  }

  // If we are over an interactive struct, adjust gridno to this....
  pIntTile = ConditionalGetCurInteractiveTileGridNoAndStructure(createPointer(() => sIntTileGridNo, (v) => sIntTileGridNo = v), createPointer(() => pStructure, (v) => pStructure = v), false);
  gpInvTileThatCausedMoveConfirm = <LEVELNODE>pIntTile;

  if (pIntTile != null) {
    sActionGridNo = sIntTileGridNo;
  }

  // Check if we are over an item pool
  if ((pItemPool = GetItemPool(sActionGridNo, pSoldier.bLevel))) {
    // If we want only on int tiles, and we have no int tiles.. ignore items!
    if (fItemsOnlyIfOnIntTiles && pIntTile == null) {
    } else if (fItemsOnlyIfOnIntTiles && pIntTile != null && (pStructure.fFlags & STRUCTURE_HASITEMONTOP)) {
      // if in this mode, we don't want to automatically show hand cursor over items on strucutres
    }
    // else if ( pIntTile != NULL && ( pStructure->fFlags & ( STRUCTURE_SWITCH | STRUCTURE_ANYDOOR ) ) )
    else if (pIntTile != null && (pStructure.fFlags & (STRUCTURE_SWITCH))) {
      // We don't want switches messing around with items ever!
    } else if ((pIntTile != null && (pStructure.fFlags & (STRUCTURE_ANYDOOR))) && (sActionGridNo != usMapPos || fItemsOnlyIfOnIntTiles)) {
      // Next we look for if we are over a door and if the mouse position is != base door position, ignore items!
    } else {
      fPoolContainsHiddenItems = DoesItemPoolContainAnyHiddenItems(pItemPool);

      // Adjust this if we have not visited this gridno yet...
      if (fPoolContainsHiddenItems) {
        if (!(gpWorldLevelData[sActionGridNo].uiFlags & MAPELEMENT_REVEALED)) {
          fPoolContainsHiddenItems = false;
        }
      }

      if (ITEMPOOL_VISIBLE(pItemPool) || fPoolContainsHiddenItems) {
        if (!UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool) {
          UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool = true;
          gfPlotNewMovement = true;
        }

        // Set UI CURSOR
        if (fUseOKCursor || ((gTacticalStatus.uiFlags & INCOMBAT) && (gTacticalStatus.uiFlags & TURNBASED))) {
          guiNewUICursor = Enum210.OKHANDCURSOR_UICURSOR;
        } else {
          guiNewUICursor = Enum210.NORMALHANDCURSOR_UICURSOR;
        }

        fSetCursor = HandleUIMovementCursor(pSoldier, uiCursorFlags, sActionGridNo, MOVEUI_TARGET_ITEMS);

        // Display action points
        gfUIDisplayActionPoints = true;

        if (gsOverItemsGridNo == sActionGridNo) {
          gfPlotNewMovement = true;
        }

        // Determine if we can afford!
        if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
          gfUIDisplayActionPointsInvalid = true;
        }

        fContinue = false;
      }
    }
  }

  if (fContinue) {
    // Try interactive tiles now....
    if (pIntTile != null) {
      if (UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool) {
        ErasePath(true);
        UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool = false;
        gfPlotNewMovement = true;
      }

      HandleUIMovementCursor(pSoldier, uiCursorFlags, usMapPos, MOVEUI_TARGET_INTTILES);

      // Set UI CURSOR
      guiNewUICursor = GetInteractiveTileCursor(guiNewUICursor, fUseOKCursor);
    } else {
      if (!fItemsOnlyIfOnIntTiles) {
        // Let's at least show where the merc will walk to if they go here...
        if (!UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool) {
          UIHandleInteractiveTilesAndItemsOnTerrain__fOverPool = true;
          gfPlotNewMovement = true;
        }

        fSetCursor = HandleUIMovementCursor(pSoldier, uiCursorFlags, sActionGridNo, MOVEUI_TARGET_ITEMS);

        // Display action points
        gfUIDisplayActionPoints = true;

        // Determine if we can afford!
        if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
          gfUIDisplayActionPointsInvalid = true;
        }
      }
    }
  }

  if (pIntTile == null) {
    return 0;
  } else {
    return 1;
  }
}

export function HandleTacticalUILoseCursorFromOtherScreen(): void {
  SetUICursor(0);

  gfTacticalForceNoCursor = true;

  ErasePath(true);

  GameScreens[Enum26.GAME_SCREEN].HandleScreen();

  gfTacticalForceNoCursor = false;

  SetUICursor(guiCurrentUICursor);
}

export function SelectedGuyInBusyAnimation(): boolean {
  let pSoldier: SOLDIERTYPE;

  if (gusSelectedSoldier != NOBODY) {
    pSoldier = MercPtrs[gusSelectedSoldier];

    if (pSoldier.usAnimState == Enum193.LOB_ITEM || pSoldier.usAnimState == Enum193.THROW_ITEM || pSoldier.usAnimState == Enum193.PICKUP_ITEM || pSoldier.usAnimState == Enum193.DROP_ITEM || pSoldier.usAnimState == Enum193.OPEN_DOOR || pSoldier.usAnimState == Enum193.OPEN_STRUCT || pSoldier.usAnimState == Enum193.OPEN_STRUCT || pSoldier.usAnimState == Enum193.END_OPEN_DOOR || pSoldier.usAnimState == Enum193.END_OPEN_LOCKED_DOOR || pSoldier.usAnimState == Enum193.ADJACENT_GET_ITEM || pSoldier.usAnimState == Enum193.DROP_ADJACENT_OBJECT ||

        pSoldier.usAnimState == Enum193.OPEN_DOOR_CROUCHED || pSoldier.usAnimState == Enum193.BEGIN_OPENSTRUCT_CROUCHED || pSoldier.usAnimState == Enum193.CLOSE_DOOR_CROUCHED || pSoldier.usAnimState == Enum193.OPEN_DOOR_CROUCHED || pSoldier.usAnimState == Enum193.OPEN_STRUCT_CROUCHED || pSoldier.usAnimState == Enum193.END_OPENSTRUCT_CROUCHED || pSoldier.usAnimState == Enum193.END_OPEN_DOOR_CROUCHED || pSoldier.usAnimState == Enum193.END_OPEN_LOCKED_DOOR_CROUCHED || pSoldier.usAnimState == Enum193.END_OPENSTRUCT_LOCKED_CROUCHED || pSoldier.usAnimState == Enum193.BEGIN_OPENSTRUCT) {
      return true;
    }
  }

  return false;
}

export function GotoHeigherStance(pSoldier: SOLDIERTYPE): void {
  let fNearHeigherLevel: boolean;
  let fNearLowerLevel: boolean;

  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      // Nowhere
      // Try to climb
      ({ fNearLowerLevel, fNearHeigherLevel } = GetMercClimbDirection(pSoldier.ubID));

      if (fNearHeigherLevel) {
        BeginSoldierClimbUpRoof(pSoldier);
      }
      break;

    case ANIM_CROUCH:

      HandleStanceChangeFromUIKeys(ANIM_STAND);
      break;

    case ANIM_PRONE:

      HandleStanceChangeFromUIKeys(ANIM_CROUCH);
      break;
  }
}

export function GotoLowerStance(pSoldier: SOLDIERTYPE): void {
  let fNearHeigherLevel: boolean;
  let fNearLowerLevel: boolean;

  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      HandleStanceChangeFromUIKeys(ANIM_CROUCH);
      break;

    case ANIM_CROUCH:

      HandleStanceChangeFromUIKeys(ANIM_PRONE);
      break;

    case ANIM_PRONE:

      // Nowhere
      // Try to climb
      ({ fNearLowerLevel, fNearHeigherLevel } = GetMercClimbDirection(pSoldier.ubID));

      if (fNearLowerLevel) {
        BeginSoldierClimbDownRoof(pSoldier);
      }
      break;
  }
}

/* static */ let SetInterfaceHeightLevel__sOldHeight: INT16 = 0;
export function SetInterfaceHeightLevel(): void {
  let sHeight: INT16;
  let sGridNo: INT16;

  if (gfBasement || gfCaves) {
    gsRenderHeight = 0;
    SetInterfaceHeightLevel__sOldHeight = 0;

    return;
  }

  // ATE: Use an entry point to determine what height to use....
  if (gMapInformation.sNorthGridNo != -1)
    sGridNo = gMapInformation.sNorthGridNo;
  else if (gMapInformation.sEastGridNo != -1)
    sGridNo = gMapInformation.sEastGridNo;
  else if (gMapInformation.sSouthGridNo != -1)
    sGridNo = gMapInformation.sSouthGridNo;
  else if (gMapInformation.sWestGridNo != -1)
    sGridNo = gMapInformation.sWestGridNo;
  else {
    Assert(0);
    return;
  }

  sHeight = gpWorldLevelData[sGridNo].sHeight;

  if (sHeight != SetInterfaceHeightLevel__sOldHeight) {
    gsRenderHeight = sHeight;

    if (gsInterfaceLevel > 0) {
      gsRenderHeight += ROOF_LEVEL_HEIGHT;
    }

    SetRenderFlags(RENDER_FLAG_FULL);
    ErasePath(false);

    SetInterfaceHeightLevel__sOldHeight = sHeight;
  }
}

/* static */ let ValidQuickExchangePosition__fOldOnValidGuy: boolean = false;
export function ValidQuickExchangePosition(): boolean {
  let pSoldier: SOLDIERTYPE | null;
  let pOverSoldier: SOLDIERTYPE;
  let sDistVisible: INT16 = 0;
  let fOnValidGuy: boolean = false;

  // Check if we over a civ
  if (gfUIFullTargetFound) {
    pOverSoldier = MercPtrs[gusUIFullTargetID];

    // KM: Replaced this older if statement for the new one which allows exchanging with militia
    // if ( ( pOverSoldier->bSide != gbPlayerNum ) && pOverSoldier->bNeutral  )
    if ((pOverSoldier.bTeam != gbPlayerNum && pOverSoldier.bNeutral) || (pOverSoldier.bTeam == MILITIA_TEAM && pOverSoldier.bSide == 0)) {
      // hehe - don't allow animals to exchange places
      if (!(pOverSoldier.uiStatusFlags & (SOLDIER_ANIMAL))) {
        // OK, we have a civ , now check if they are near selected guy.....
        if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
          if (PythSpacesAway(pSoldier.sGridNo, pOverSoldier.sGridNo) == 1) {
            // Check if we have LOS to them....
            sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, pOverSoldier.sGridNo, pOverSoldier.bLevel);

            if (SoldierTo3DLocationLineOfSightTest(pSoldier, pOverSoldier.sGridNo, pOverSoldier.bLevel, 3, sDistVisible, true)) {
              // ATE:
              // Check that the path is good!
              if (FindBestPath(pSoldier, pOverSoldier.sGridNo, pSoldier.bLevel, pSoldier.usUIMovementMode, NO_COPYROUTE, PATH_IGNORE_PERSON_AT_DEST) == 1) {
                fOnValidGuy = true;
              }
            }
          }
        }
      }
    }
  }

  if (ValidQuickExchangePosition__fOldOnValidGuy != fOnValidGuy) {
    // Update timer....
    // ATE: Adjust clock for automatic swapping so that the 'feel' is there....
    guiUIInterfaceSwapCursorsTime = GetJA2Clock();
    // Default it!
    gfOKForExchangeCursor = true;
  }

  // Update old value.....
  ValidQuickExchangePosition__fOldOnValidGuy = fOnValidGuy;

  if (!gfOKForExchangeCursor) {
    fOnValidGuy = false;
  }

  return fOnValidGuy;
}

// This function contains the logic for allowing the player
// to jump over people.
export function IsValidJumpLocation(pSoldier: SOLDIERTYPE, sGridNo: INT16, fCheckForPath: boolean): boolean {
  let sFourGrids: INT16[] /* [4] */ = createArray(4, 0);
  let sDistance: INT16 = 0;
  let sSpot: INT16;
  let sIntSpot: INT16;
  let sDirs: INT16[] /* [4] */ = [
    Enum245.NORTH,
    Enum245.EAST,
    Enum245.SOUTH,
    Enum245.WEST,
  ];
  let cnt: INT32;
  let ubGuyThere: UINT8;
  let ubMovementCost: UINT8;
  let iDoorGridNo: INT32 = 0;
  let iDoorGridNo__Pointer = createPointer(() => iDoorGridNo, (v) => iDoorGridNo = v);

  // First check that action point cost is zero so far
  // ie: NO PATH!
  if (gsCurrentActionPoints != 0 && fCheckForPath) {
    return false;
  }

  // Loop through positions...
  for (cnt = 0; cnt < 4; cnt++) {
    // MOVE OUT TWO DIRECTIONS
    sIntSpot = NewGridNo(sGridNo, DirectionInc(sDirs[cnt]));

    // ATE: Check our movement costs for going through walls!
    ubMovementCost = gubWorldMovementCosts[sIntSpot][sDirs[cnt]][pSoldier.bLevel];
    if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
      ubMovementCost = DoorTravelCost(pSoldier, sIntSpot, ubMovementCost, (pSoldier.bTeam == gbPlayerNum), iDoorGridNo__Pointer);
    }

    // If we have hit an obstacle, STOP HERE
    if (ubMovementCost >= TRAVELCOST_BLOCKED) {
      // no good, continue
      continue;
    }

    // TWICE AS FAR!
    sFourGrids[cnt] = sSpot = NewGridNo(sIntSpot, DirectionInc(sDirs[cnt]));

    // Is the soldier we're looking at here?
    ubGuyThere = WhoIsThere2(sSpot, pSoldier.bLevel);

    // Alright folks, here we are!
    if (ubGuyThere == pSoldier.ubID) {
      // Double check OK destination......
      if (NewOKDestination(pSoldier, sGridNo, true, gsInterfaceLevel)) {
        // If the soldier in the middle of doing stuff?
        if (!pSoldier.fTurningUntilDone) {
          // OK, NOW check if there is a guy in between us
          //
          //
          ubGuyThere = WhoIsThere2(sIntSpot, pSoldier.bLevel);

          // Is there a guy and is he prone?
          if (ubGuyThere != NOBODY && ubGuyThere != pSoldier.ubID && gAnimControl[MercPtrs[ubGuyThere].usAnimState].ubHeight == ANIM_PRONE) {
            // It's a GO!
            return true;
          }
        }
      }
    }
  }

  return false;
}

}
