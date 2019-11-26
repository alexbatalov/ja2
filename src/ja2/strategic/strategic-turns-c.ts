namespace ja2 {

const NUM_SEC_PER_STRATEGIC_TURN = (NUM_SEC_IN_MIN * 15); // Every fifteen minutes

let guiLastStrategicTime: UINT32 = 0;
let guiLastTacticalRealTime: UINT32 = 0;

export function StrategicTurnsNewGame(): void {
  // Sync game start time
  SyncStrategicTurnTimes();
}

export function SyncStrategicTurnTimes(): void {
  guiLastStrategicTime = GetWorldTotalSeconds();
  guiLastTacticalRealTime = GetJA2Clock();
}

export function HandleStrategicTurn(): void {
  let uiTime: UINT32;
  let uiCheckTime: UINT32 = <UINT32><unknown>undefined;

  // OK, DO THIS CHECK EVERY ONCE AND A WHILE...
  if (COUNTERDONE(Enum386.STRATEGIC_OVERHEAD)) {
    RESETCOUNTER(Enum386.STRATEGIC_OVERHEAD);

    // if the game is paused, or we're in mapscreen and time is not being compressed
    if ((GamePaused() == true) || ((guiCurrentScreen == Enum26.MAP_SCREEN) && !IsTimeBeingCompressed())) {
      // don't do any of this
      return;
    }

    // Kris -- What to do?
    if (giTimeCompressMode == Enum130.NOT_USING_TIME_COMPRESSION) {
      SetGameTimeCompressionLevel(Enum130.TIME_COMPRESS_X1);
    }

    uiTime = GetJA2Clock();

    // Do not handle turns update if in turnbased combat
    if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
      guiLastTacticalRealTime = uiTime;
    } else {
      if (giTimeCompressMode == Enum130.TIME_COMPRESS_X1 || giTimeCompressMode == 0) {
        uiCheckTime = NUM_REAL_SEC_PER_TACTICAL_TURN;
      } else {
        // OK, if we have compressed time...., adjust our check value to be faster....
        if (giTimeCompressSpeeds[giTimeCompressMode] > 0) {
          uiCheckTime = NUM_REAL_SEC_PER_TACTICAL_TURN / (giTimeCompressSpeeds[giTimeCompressMode] * RT_COMPRESSION_TACTICAL_TURN_MODIFIER);
        }
      }

      if ((uiTime - guiLastTacticalRealTime) > uiCheckTime) {
        HandleTacticalEndTurn();

        guiLastTacticalRealTime = uiTime;
      }
    }
  }
}

export function HandleStrategicTurnImplicationsOfExitingCombatMode(): void {
  SyncStrategicTurnTimes();
  HandleTacticalEndTurn();
}

}
