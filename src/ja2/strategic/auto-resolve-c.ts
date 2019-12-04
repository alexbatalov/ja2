namespace ja2 {

//#include "vtuneapi.h"

//#define INVULNERABILITY

export let gfTransferTacticalOppositionToAutoResolve: boolean = false;

// button images
const enum Enum119 {
  PAUSE_BUTTON,
  PLAY_BUTTON,
  FAST_BUTTON,
  FINISH_BUTTON,
  YES_BUTTON,
  NO_BUTTON,
  BANDAGE_BUTTON,
  RETREAT_BUTTON,
  DONEWIN_BUTTON,
  DONELOSE_BUTTON,
  NUM_AR_BUTTONS,
}

interface SOLDIERCELL {
  pSoldier: SOLDIERTYPE /* Pointer<SOLDIERCELL> */;
  pRegion: MOUSE_REGION | null; // only used for player mercs.
  uiVObjectID: UINT32;
  usIndex: UINT16;
  uiFlags: UINT32;
  usFrame: UINT16;

  xp: INT16;
  yp: INT16;

  usAttack: UINT16;
  usDefence: UINT16;

  usNextAttack: UINT16;
  usNextHit: UINT16[] /* [3] */;
  usHitDamage: UINT16[] /* [3] */;
  pAttacker: SOLDIERCELL[] /* Pointer<SOLDIERCELL>[3] */;
  uiFlashTime: UINT32;
  bWeaponSlot: INT8;
}

function createSoldierCell(): SOLDIERCELL {
  return {
    pSoldier: <SOLDIERTYPE><unknown>null,
    pRegion: null,
    uiVObjectID: 0,
    usIndex: 0,
    uiFlags: 0,
    usFrame: 0,
    xp: 0,
    yp: 0,
    usAttack: 0,
    usDefence: 0,
    usNextAttack: 0,
    usNextHit: createArray(3, 0),
    usHitDamage: createArray(3, 0),
    pAttacker: createArray(3, <SOLDIERCELL><unknown>null),
    uiFlashTime: 0,
    bWeaponSlot: 0,
  };
}

function resetSoldierCell(o: SOLDIERCELL) {
  o.pSoldier = <SOLDIERTYPE><unknown>null;
  o.pRegion = null;
  o.uiVObjectID = 0;
  o.usIndex = 0;
  o.uiFlags = 0;
  o.usFrame = 0;
  o.xp = 0;
  o.yp = 0;
  o.usAttack = 0;
  o.usDefence = 0;
  o.usNextAttack = 0;
  o.usNextHit.fill(0);
  o.usHitDamage.fill(0);
  o.pAttacker.fill(<SOLDIERCELL><unknown>null);
  o.uiFlashTime = 0;
  o.bWeaponSlot = 0;
}

interface AUTORESOLVE_STRUCT {
  pRobotCell: SOLDIERCELL | null;

  // IDs into the graphic images
  iPanelImages: INT32;
  iButton: INT32[] /* [NUM_AR_BUTTONS] */;
  iButtonImage: INT32[] /* [NUM_AR_BUTTONS] */;
  iFaces: INT32; // for generic civs and enemies
  iMercFaces: INT32[] /* [20] */; // for each merc face
  iIndent: INT32;
  iInterfaceBuffer: INT32;
  iNumMercFaces: INT32;
  iActualMercFaces: INT32; // this represents the real number of merc faces.  Because
                           // my debug mode allows to freely add and subtract mercs, we
                           // can add/remove temp mercs, but we don't want to remove the
                           // actual mercs.
  uiTimeSlice: UINT32;
  uiTotalElapsedBattleTimeInMilliseconds: UINT32;

  uiPrevTime: UINT32;
  uiCurrTime: UINT32;

  uiStartExpanding: UINT32;
  uiEndExpanding: UINT32;
  uiPreRandomIndex: UINT32;

  Rect: SGPRect;
  ExRect: SGPRect;

  usPlayerAttack: UINT16;
  usPlayerDefence: UINT16;
  usEnemyAttack: UINT16;
  usEnemyDefence: UINT16;

  sWidth: INT16;
  sHeight: INT16;

  sCenterStartX: INT16;

  ubEnemyLeadership: UINT8;
  ubPlayerLeadership: UINT8;

  ubMercs: UINT8;
  ubCivs: UINT8;
  ubEnemies: UINT8;

  ubAdmins: UINT8;
  ubTroops: UINT8;
  ubElites: UINT8;

  ubYMCreatures: UINT8;
  ubYFCreatures: UINT8;
  ubAMCreatures: UINT8;
  ubAFCreatures: UINT8;

  ubAliveMercs: UINT8;
  ubAliveCivs: UINT8;
  ubAliveEnemies: UINT8;

  ubMercCols: UINT8;
  ubMercRows: UINT8;

  ubEnemyCols: UINT8;
  ubEnemyRows: UINT8;

  ubCivCols: UINT8;
  ubCivRows: UINT8;

  ubTimeModifierPercentage: UINT8;

  ubSectorX: UINT8;
  ubSectorY: UINT8;

  bVerticalOffset: INT8;

  fRenderAutoResolve: boolean;
  fExitAutoResolve: boolean;
  fPaused: boolean;
  fDebugInfo: boolean;
  ubBattleStatus: UINT8 /* boolean */;
  fUnlimitedAmmo: boolean;
  fSound: boolean;
  ubPlayerDefenceAdvantage: UINT8 /* boolean */;
  ubEnemyDefenceAdvantage: UINT8 /* boolean */;
  fInstantFinish: boolean;
  fAllowCapture: boolean;
  fPlayerRejectedSurrenderOffer: boolean;
  fPendingSurrender: boolean;
  fExpanding: boolean;
  fShowInterface: boolean;
  fEnteringAutoResolve: boolean;
  fMoraleEventsHandled: boolean;
  fCaptureNotPermittedDueToEPCs: boolean;

  AutoResolveRegion: MOUSE_REGION;
}

function createAutoResolveStruct(): AUTORESOLVE_STRUCT {
  return {
    pRobotCell: null,
    iPanelImages: 0,
    iButton: createArray(Enum119.NUM_AR_BUTTONS, 0),
    iButtonImage: createArray(Enum119.NUM_AR_BUTTONS, 0),
    iFaces: 0,
    iMercFaces: createArray(20, 0),
    iIndent: 0,
    iInterfaceBuffer: 0,
    iNumMercFaces: 0,
    iActualMercFaces: 0,
    uiTimeSlice: 0,
    uiTotalElapsedBattleTimeInMilliseconds: 0,
    uiPrevTime: 0,
    uiCurrTime: 0,
    uiStartExpanding: 0,
    uiEndExpanding: 0,
    uiPreRandomIndex: 0,
    Rect: createSGPRect(),
    ExRect: createSGPRect(),
    usPlayerAttack: 0,
    usPlayerDefence: 0,
    usEnemyAttack: 0,
    usEnemyDefence: 0,
    sWidth: 0,
    sHeight: 0,
    sCenterStartX: 0,
    ubEnemyLeadership: 0,
    ubPlayerLeadership: 0,
    ubMercs: 0,
    ubCivs: 0,
    ubEnemies: 0,
    ubAdmins: 0,
    ubTroops: 0,
    ubElites: 0,
    ubYMCreatures: 0,
    ubYFCreatures: 0,
    ubAMCreatures: 0,
    ubAFCreatures: 0,
    ubAliveMercs: 0,
    ubAliveCivs: 0,
    ubAliveEnemies: 0,
    ubMercCols: 0,
    ubMercRows: 0,
    ubEnemyCols: 0,
    ubEnemyRows: 0,
    ubCivCols: 0,
    ubCivRows: 0,
    ubTimeModifierPercentage: 0,
    ubSectorX: 0,
    ubSectorY: 0,
    bVerticalOffset: 0,
    fRenderAutoResolve: false,
    fExitAutoResolve: false,
    fPaused: false,
    fDebugInfo: false,
    ubBattleStatus: 0,
    fUnlimitedAmmo: false,
    fSound: false,
    ubPlayerDefenceAdvantage: 0,
    ubEnemyDefenceAdvantage: 0,
    fInstantFinish: false,
    fAllowCapture: false,
    fPlayerRejectedSurrenderOffer: false,
    fPendingSurrender: false,
    fExpanding: false,
    fShowInterface: false,
    fEnteringAutoResolve: false,
    fMoraleEventsHandled: false,
    fCaptureNotPermittedDueToEPCs: false,
    AutoResolveRegion: createMouseRegion(),
  };
}

// Classifies the type of soldier the soldier cell is
const CELL_MERC = 0x00000001;
const CELL_MILITIA = 0x00000002;
const CELL_ELITE = 0x00000004;
const CELL_TROOP = 0x00000008;
const CELL_ADMIN = 0x00000010;
const CELL_AF_CREATURE = 0x00000020;
const CELL_AM_CREATURE = 0x00000040;
const CELL_YF_CREATURE = 0x00000080;
const CELL_YM_CREATURE = 0x00000100;
// The team leader is the one with the highest leadership.
// There can only be one teamleader per side (mercs/civs and enemies)
const CELL_TEAMLEADER = 0x00000200;
// Combat flags
const CELL_FIREDATTARGET = 0x00000400;
const CELL_DODGEDATTACK = 0x00000800;
const CELL_HITBYATTACKER = 0x00001000;
const CELL_HITLASTFRAME = 0x00002000;
// Cell statii
const CELL_SHOWRETREATTEXT = 0x00004000;
const CELL_RETREATING = 0x00008000;
const CELL_RETREATED = 0x00010000;
const CELL_DIRTY = 0x00020000;
const CELL_PROCESSED = 0x00040000;
const CELL_ASSIGNED = 0x00080000;
const CELL_EPC = 0x00100000;
const CELL_ROBOT = 0x00200000;

// Combined flags
const CELL_PLAYER = (CELL_MERC | CELL_MILITIA);
const CELL_ENEMY = (CELL_ELITE | CELL_TROOP | CELL_ADMIN);
const CELL_CREATURE = (CELL_AF_CREATURE | CELL_AM_CREATURE | CELL_YF_CREATURE | CELL_YM_CREATURE);
const CELL_FEMALECREATURE = (CELL_AF_CREATURE | CELL_YF_CREATURE);
const CELL_MALECREATURE = (CELL_AM_CREATURE | CELL_YM_CREATURE);
const CELL_YOUNGCREATURE = (CELL_YF_CREATURE | CELL_YM_CREATURE);
const CELL_INVOLVEDINCOMBAT = (CELL_FIREDATTARGET | CELL_DODGEDATTACK | CELL_HITBYATTACKER);

const enum Enum120 {
  BATTLE_IN_PROGRESS,
  BATTLE_VICTORY,
  BATTLE_DEFEAT,
  BATTLE_RETREAT,
  BATTLE_SURRENDERED,
  BATTLE_CAPTURED,
}

// panel pieces
const enum Enum121 {
  TL_BORDER,
  T_BORDER,
  TR_BORDER,
  L_BORDER,
  C_TEXTURE,
  R_BORDER,
  BL_BORDER,
  B_BORDER,
  BR_BORDER,
  TOP_MIDDLE,
  AUTO_MIDDLE,
  BOT_MIDDLE,
  MERC_PANEL,
  OTHER_PANEL,
}

// generic face images
const enum Enum122 {
  ADMIN_FACE,
  TROOP_FACE,
  ELITE_FACE,
  MILITIA1_FACE,
  MILITIA2_FACE,
  MILITIA3_FACE,
  YM_CREATURE_FACE,
  AM_CREATURE_FACE,
  YF_CREATURE_FACE,
  AF_CREATURE_FACE,
  HUMAN_SKULL,
  CREATURE_SKULL,
  ELITEF_FACE,
  MILITIA1F_FACE,
  MILITIA2F_FACE,
  MILITIA3F_FACE,
}

// Autoresolve sets this variable which defaults to -1 when not needed.
export let gsEnemyGainedControlOfSectorID: INT16 = -1;
export let gsCiviliansEatenByMonsters: INT16 = -1;

// Dynamic globals -- to conserve memory, all global variables are allocated upon entry
// and deleted before we leave.
let gpAR: AUTORESOLVE_STRUCT = <AUTORESOLVE_STRUCT><unknown>null;
let gpMercs: SOLDIERCELL[] = <SOLDIERCELL[]><unknown>null;
let gpCivs: SOLDIERCELL[] = <SOLDIERCELL[]><unknown>null;
let gpEnemies: SOLDIERCELL[] = <SOLDIERCELL[]><unknown>null;

// Simple wrappers for autoresolve sounds that are played.
function PlayAutoResolveSample(usNum: UINT32, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): void {
  if (gpAR.fSound) {
    PlayJA2Sample(usNum, usRate, ubVolume, ubLoops, uiPan);
  }
}

function PlayAutoResolveSampleFromFile(szFileName: string /* STR8 */, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): void {
  if (gpAR.fSound) {
    PlayJA2SampleFromFile(szFileName, usRate, ubVolume, ubLoops, uiPan);
  }
}

function EliminateAllMercs(): void {
  let pAttacker: SOLDIERCELL | null = null;
  let i: INT32;
  let iNum: INT32 = 0;
  if (gpAR) {
    for (i = 0; i < gpAR.ubEnemies; i++) {
      if (gpEnemies[i].pSoldier.bLife) {
        pAttacker = gpEnemies[i];
        break;
      }
    }
    if (pAttacker) {
      for (i = 0; i < gpAR.ubMercs; i++) {
        if (gpMercs[i].pSoldier.bLife) {
          iNum++;
          gpMercs[i].pSoldier.bLife = 1;
          gpMercs[i].usNextHit[0] = (250 * iNum);
          gpMercs[i].usHitDamage[0] = 100;
          gpMercs[i].pAttacker[0] = pAttacker;
        }
      }
    }
  }
}

function EliminateAllFriendlies(): void {
  let i: INT32;
  if (gpAR) {
    for (i = 0; i < gpAR.ubMercs; i++) {
      gpMercs[i].pSoldier.bLife = 0;
    }
    gpAR.ubAliveMercs = 0;
    for (i = 0; i < gpAR.ubCivs; i++) {
      gpCivs[i].pSoldier.bLife = 0;
    }
    gpAR.ubAliveCivs = 0;
  }
}

export function EliminateAllEnemies(ubSectorX: UINT8, ubSectorY: UINT8): void {
  let pGroup: GROUP | null;
  let pDeleteGroup: GROUP;
  let pSector: SECTORINFO;
  let i: INT32;
  let ubNumEnemies: UINT8[] /* [NUM_ENEMY_RANKS] */ = createArray(Enum188.NUM_ENEMY_RANKS, 0);
  let ubRankIndex: UINT8;

  // Clear any possible battle locator
  gfBlitBattleSectorLocator = false;

  pGroup = gpGroupList;
  pSector = SectorInfo[SECTOR(ubSectorX, ubSectorY)];

  // if we're doing this from the Pre-Battle interface, gpAR is NULL, and RemoveAutoResolveInterface(0 won't happen, so
  // we must process the enemies killed right here & give out loyalty bonuses as if the battle had been fought & won
  if (!gpAR) {
    ({ ubNumAdmins: ubNumEnemies[0], ubNumTroops: ubNumEnemies[1], ubNumElites: ubNumEnemies[2] } = GetNumberOfEnemiesInSector(ubSectorX, ubSectorY));

    for (ubRankIndex = 0; ubRankIndex < Enum188.NUM_ENEMY_RANKS; ubRankIndex++) {
      for (i = 0; i < ubNumEnemies[ubRankIndex]; i++) {
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_ENEMY_KILLED, ubSectorX, ubSectorY, 0);
        TrackEnemiesKilled(Enum189.ENEMY_KILLED_IN_AUTO_RESOLVE, RankIndexToSoldierClass(ubRankIndex));
      }
    }

    HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_WON, ubSectorX, ubSectorY, 0);
  }

  if (!gpAR || gpAR.ubBattleStatus != Enum120.BATTLE_IN_PROGRESS) {
    // Remove the defend force here.
    pSector.ubNumTroops = 0;
    pSector.ubNumElites = 0;
    pSector.ubNumAdmins = 0;
    pSector.ubNumCreatures = 0;
    pSector.bLastKnownEnemies = 0;
    // Remove the mobile forces here, but only if battle is over.
    while (pGroup) {
      if (!pGroup.fPlayer && pGroup.ubSectorX == ubSectorX && pGroup.ubSectorY == ubSectorY) {
        ClearPreviousAIGroupAssignment(pGroup);
        pDeleteGroup = pGroup;
        pGroup = pGroup.next;
        if (gpBattleGroup == pDeleteGroup)
          gpBattleGroup = null;
        RemovePGroup(pDeleteGroup);
      } else
        pGroup = pGroup.next;
    }
    if (gpBattleGroup) {
      CalculateNextMoveIntention(gpBattleGroup);
    }
    // set this sector as taken over
    SetThisSectorAsPlayerControlled(ubSectorX, ubSectorY, 0, true);
    RecalculateSectorWeight(SECTOR(ubSectorX, ubSectorY));

    // dirty map panel
    fMapPanelDirty = true;
  }

  if (gpAR) {
    for (i = 0; i < gpAR.ubEnemies; i++) {
      gpEnemies[i].pSoldier.bLife = 0;
    }
    gpAR.ubAliveEnemies = 0;
  }
  gpBattleGroup = null;
}

const ORIG_LEFT = 26;
const ORIG_TOP = 53;
const ORIG_RIGHT = 92;
const ORIG_BOTTOM = 84;

function DoTransitionFromPreBattleInterfaceToAutoResolve(): void {
  let SrcRect: SGPRect = createSGPRect();
  let DstRect: SGPRect = createSGPRect();
  let uiStartTime: UINT32;
  let uiCurrTime: UINT32;
  let iPercentage: INT32;
  let iFactor: INT32;
  let uiTimeRange: UINT32;
  let sStartLeft: INT16;
  let sEndLeft: INT16;
  let sStartTop: INT16;
  let sEndTop: INT16;
  let iLeft: INT32;
  let iTop: INT32;
  let iWidth: INT32;
  let iHeight: INT32;

  PauseTime(false);

  gpAR.fShowInterface = true;

  SrcRect.iLeft = gpAR.Rect.iLeft;
  SrcRect.iTop = gpAR.Rect.iTop;
  SrcRect.iRight = gpAR.Rect.iRight;
  SrcRect.iBottom = gpAR.Rect.iBottom;

  iWidth = SrcRect.iRight - SrcRect.iLeft + 1;
  iHeight = SrcRect.iBottom - SrcRect.iTop + 1;

  uiTimeRange = 1000;
  iPercentage = 0;
  uiStartTime = GetJA2Clock();

  sStartLeft = 59;
  sStartTop = 69;
  sEndLeft = SrcRect.iLeft + gpAR.sWidth / 2;
  sEndTop = SrcRect.iTop + gpAR.sHeight / 2;

  // save the prebattle/mapscreen interface background
  BlitBufferToBuffer(FRAME_BUFFER, guiEXTRABUFFER, 0, 0, 640, 480);

  // render the autoresolve panel
  RenderAutoResolve();
  RenderButtons();
  RenderButtonsFastHelp();
  // save it
  BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, SrcRect.iLeft, SrcRect.iTop, SrcRect.iRight, SrcRect.iBottom);

  // hide the autoresolve
  BlitBufferToBuffer(guiEXTRABUFFER, FRAME_BUFFER, SrcRect.iLeft, SrcRect.iTop, SrcRect.iRight, SrcRect.iBottom);

  PlayJA2SampleFromFile("SOUNDS\\Laptop power up (8-11).wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  while (iPercentage < 100) {
    uiCurrTime = GetJA2Clock();
    iPercentage = (uiCurrTime - uiStartTime) * 100 / uiTimeRange;
    iPercentage = Math.min(iPercentage, 100);

    // Factor the percentage so that it is modified by a gravity falling acceleration effect.
    iFactor = (iPercentage - 50) * 2;
    if (iPercentage < 50)
      iPercentage = (iPercentage + iPercentage * iFactor * 0.01 + 0.5);
    else
      iPercentage = (iPercentage + (100 - iPercentage) * iFactor * 0.01 + 0.05);

    // Calculate the center point.
    iLeft = sStartLeft + (sEndLeft - sStartLeft + 1) * iPercentage / 100;
    iTop = sStartTop + (sEndTop - sStartTop + 1) * iPercentage / 100;

    DstRect.iLeft = iLeft - iWidth * iPercentage / 200;
    DstRect.iRight = DstRect.iLeft + Math.max(iWidth * iPercentage / 100, 1);
    DstRect.iTop = iTop - iHeight * iPercentage / 200;
    DstRect.iBottom = DstRect.iTop + Math.max(iHeight * iPercentage / 100, 1);

    BltStretchVideoSurface(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 0, SrcRect, DstRect);
    InvalidateScreen();
    RefreshScreen(null);

    // Restore the previous rect.
    BlitBufferToBuffer(guiEXTRABUFFER, FRAME_BUFFER, DstRect.iLeft, DstRect.iTop, (DstRect.iRight - DstRect.iLeft + 1), (DstRect.iBottom - DstRect.iTop + 1));
  }
  // BlitBufferToBuffer( FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 640, 480 );
}

export function EnterAutoResolveMode(ubSectorX: UINT8, ubSectorY: UINT8): void {
  // Set up mapscreen for removal
  SetPendingNewScreen(Enum26.AUTORESOLVE_SCREEN);
  CreateDestroyMapInvButton();
  RenderButtons();

  // Allocate memory for all the globals while we are in this mode.
  gpAR = createAutoResolveStruct();
  Assert(gpAR);
  // Mercs -- 20 max
  gpMercs = createArrayFrom(20, createSoldierCell);
  Assert(gpMercs);
  // Militia -- MAX_ALLOWABLE_MILITIA_PER_SECTOR max
  gpCivs = createArrayFrom(MAX_ALLOWABLE_MILITIA_PER_SECTOR, createSoldierCell);
  Assert(gpCivs);
  // Enemies -- 32 max
  gpEnemies = createArrayFrom(32, createSoldierCell);
  Assert(gpEnemies);

  // Set up autoresolve
  gpAR.fEnteringAutoResolve = true;
  gpAR.ubSectorX = ubSectorX;
  gpAR.ubSectorY = ubSectorY;
  gpAR.ubBattleStatus = Enum120.BATTLE_IN_PROGRESS;
  gpAR.uiTimeSlice = 1000;
  gpAR.uiTotalElapsedBattleTimeInMilliseconds = 0;
  gpAR.fSound = true;
  gpAR.fMoraleEventsHandled = false;
  gpAR.uiPreRandomIndex = guiPreRandomIndex;

  // Determine who gets the defensive advantage
  switch (gubEnemyEncounterCode) {
    case Enum164.ENEMY_ENCOUNTER_CODE:
      gpAR.ubPlayerDefenceAdvantage = 21; // Skewed to the player's advantage for convenience purposes.
      break;
    case Enum164.ENEMY_INVASION_CODE:
      gpAR.ubPlayerDefenceAdvantage = 0;
      break;
    case Enum164.CREATURE_ATTACK_CODE:
      gpAR.ubPlayerDefenceAdvantage = 0;
      break;
    default:
// shouldn't happen
      break;
  }
}

export function AutoResolveScreenInit(): boolean {
  return true;
}

export function AutoResolveScreenShutdown(): boolean {
  gpBattleGroup = null;
  return true;
}

export function AutoResolveScreenHandle(): UINT32 {
  RestoreBackgroundRects();

  if (!gpAR) {
    gfEnteringMapScreen = 1;
    return Enum26.MAP_SCREEN;
  }
  if (gpAR.fEnteringAutoResolve) {
    let pDestBuf: Pointer<UINT8>;
    let uiDestPitchBYTES: UINT32;
    let ClipRect: SGPRect = createSGPRect();
    gpAR.fEnteringAutoResolve = false;
    // Take the framebuffer, shade it, and save it to the SAVEBUFFER.
    ClipRect.iLeft = 0;
    ClipRect.iTop = 0;
    ClipRect.iRight = 640;
    ClipRect.iBottom = 480;
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, ClipRect);
    UnLockVideoSurface(FRAME_BUFFER);
    BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 640, 480);
    KillPreBattleInterface();
    CalculateAutoResolveInfo();
    CalculateSoldierCells(false);
    CreateAutoResolveInterface();
    DetermineTeamLeader(true); // friendly team
    DetermineTeamLeader(false); // enemy team
    CalculateAttackValues();
    if (gfExtraBuffer)
      DoTransitionFromPreBattleInterfaceToAutoResolve();
    else
      gpAR.fExpanding = true;
    gpAR.fRenderAutoResolve = true;
  }
  if (gpAR.fExitAutoResolve) {
    gfEnteringMapScreen = 1;
    RemoveAutoResolveInterface(true);
    return Enum26.MAP_SCREEN;
  }
  if (gpAR.fPendingSurrender) {
    gpAR.uiPrevTime = gpAR.uiCurrTime = GetJA2Clock();
  } else if (gpAR.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS && !gpAR.fExpanding) {
    ProcessBattleFrame();
  }
  HandleAutoResolveInput();
  RenderAutoResolve();

  SaveBackgroundRects();
  RenderButtons();
  RenderButtonsFastHelp();
  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
  return Enum26.AUTORESOLVE_SCREEN;
}

function RefreshMerc(pSoldier: SOLDIERTYPE): void {
  pSoldier.bLife = pSoldier.bLifeMax;
  pSoldier.bBleeding = 0;
  pSoldier.bBreath = pSoldier.bBreathMax = 100;
  pSoldier.sBreathRed = 0;
  if (gpAR.pRobotCell) {
    UpdateRobotControllerGivenRobot(gpAR.pRobotCell.pSoldier);
  }
  // gpAR->fUnlimitedAmmo = TRUE;
}

// Now assign the pSoldier->ubGroupIDs for the enemies, so we know where to remove them.  Start with
// stationary groups first.
function AssociateEnemiesWithStrategicGroups(): void {
  let pSector: SECTORINFO;
  let pGroup: GROUP | null;
  let ubNumAdmins: UINT8;
  let ubNumTroops: UINT8;
  let ubNumElites: UINT8;
  let ubNumElitesInGroup: UINT8;
  let ubNumTroopsInGroup: UINT8;
  let ubNumAdminsInGroup: UINT8;
  let i: INT32;

  if (gubEnemyEncounterCode == Enum164.CREATURE_ATTACK_CODE)
    return;

  pSector = SectorInfo[SECTOR(gpAR.ubSectorX, gpAR.ubSectorY)];

  // grab the number of each type in the stationary sector
  ubNumAdmins = pSector.ubNumAdmins;
  ubNumTroops = pSector.ubNumTroops;
  ubNumElites = pSector.ubNumElites;

  // Now go through our enemies in the autoresolve array, and assign the ubGroupID to the soldier
  // Stationary groups have a group ID of 0
  for (i = 0; i < gpAR.ubEnemies; i++) {
    if (gpEnemies[i].uiFlags & CELL_ELITE && ubNumElites) {
      gpEnemies[i].pSoldier.ubGroupID = 0;
      gpEnemies[i].uiFlags |= CELL_ASSIGNED;
      ubNumElites--;
    } else if (gpEnemies[i].uiFlags & CELL_TROOP && ubNumTroops) {
      gpEnemies[i].pSoldier.ubGroupID = 0;
      gpEnemies[i].uiFlags |= CELL_ASSIGNED;
      ubNumTroops--;
    } else if (gpEnemies[i].uiFlags & CELL_ADMIN && ubNumAdmins) {
      gpEnemies[i].pSoldier.ubGroupID = 0;
      gpEnemies[i].uiFlags |= CELL_ASSIGNED;
      ubNumAdmins--;
    }
  }

  ubNumAdmins = gpAR.ubAdmins - pSector.ubNumAdmins;
  ubNumTroops = gpAR.ubTroops - pSector.ubNumTroops;
  ubNumElites = gpAR.ubElites - pSector.ubNumElites;

  if (!ubNumElites && !ubNumTroops && !ubNumAdmins) {
    // All troops accounted for.
    return;
  }

  // Now assign the rest of the soldiers to groups
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.fPlayer && pGroup.ubSectorX == gpAR.ubSectorX && pGroup.ubSectorY == gpAR.ubSectorY) {
      ubNumElitesInGroup = (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites;
      ubNumTroopsInGroup = (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops;
      ubNumAdminsInGroup = (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins;
      for (i = 0; i < gpAR.ubEnemies; i++) {
        if (!(gpEnemies[i].uiFlags & CELL_ASSIGNED)) {
          if (ubNumElites && ubNumElitesInGroup) {
            gpEnemies[i].pSoldier.ubGroupID = pGroup.ubGroupID;
            gpEnemies[i].uiFlags |= CELL_ASSIGNED;
            ubNumElites--;
            ubNumElitesInGroup--;
          } else if (ubNumTroops && ubNumTroopsInGroup) {
            gpEnemies[i].pSoldier.ubGroupID = pGroup.ubGroupID;
            gpEnemies[i].uiFlags |= CELL_ASSIGNED;
            ubNumTroops--;
            ubNumTroopsInGroup--;
          } else if (ubNumAdmins && ubNumAdminsInGroup) {
            gpEnemies[i].pSoldier.ubGroupID = pGroup.ubGroupID;
            gpEnemies[i].uiFlags |= CELL_ASSIGNED;
            ubNumAdmins--;
            ubNumAdminsInGroup--;
          }
        }
      }
    }
    pGroup = pGroup.next;
  }
}

function CalculateSoldierCells(fReset: boolean): void {
  let i: INT32;
  let x: INT32;
  let y: INT32;
  let index: INT32;
  let iStartY: INT32;
  let iTop: INT32;
  let gapStartRow: INT32;
  let iMaxTeamSize: INT32;

  gpAR.ubAliveMercs = gpAR.ubMercs;
  gpAR.ubAliveCivs = gpAR.ubCivs;
  gpAR.ubAliveEnemies = gpAR.ubEnemies;

  iMaxTeamSize = Math.max(gpAR.ubMercs + gpAR.ubCivs, gpAR.ubEnemies);

  if (iMaxTeamSize > 12) {
    gpAR.ubTimeModifierPercentage = (118 - iMaxTeamSize * 1.5);
  } else {
    gpAR.ubTimeModifierPercentage = 100;
  }
  gpAR.uiTimeSlice = gpAR.uiTimeSlice * gpAR.ubTimeModifierPercentage / 100;

  iTop = 240 - gpAR.sHeight / 2;
  if (iTop > 120)
    iTop -= 40;

  if (gpAR.ubMercs) {
    iStartY = iTop + (gpAR.sHeight - ((gpAR.ubMercRows + gpAR.ubCivRows) * 47 + 7)) / 2 + 6;
    y = gpAR.ubMercRows;
    x = gpAR.ubMercCols;
    i = gpAR.ubMercs;
    gapStartRow = gpAR.ubMercRows - gpAR.ubMercRows * gpAR.ubMercCols + gpAR.ubMercs;
    for (x = 0; x < gpAR.ubMercCols; x++)
      for (y = 0; i && y < gpAR.ubMercRows; y++, i--) {
        index = y * gpAR.ubMercCols + gpAR.ubMercCols - x - 1;
        if (y >= gapStartRow)
          index -= y - gapStartRow + 1;
        Assert(index >= 0 && index < gpAR.ubMercs);
        gpMercs[index].xp = gpAR.sCenterStartX + 3 - 55 * (x + 1);
        gpMercs[index].yp = iStartY + y * 47;
        gpMercs[index].uiFlags = CELL_MERC;
        if (AM_AN_EPC(gpMercs[index].pSoldier)) {
          if (AM_A_ROBOT(gpMercs[index].pSoldier)) {
            // treat robot as a merc for the purpose of combat.
            gpMercs[index].uiFlags |= CELL_ROBOT;
          } else {
            gpMercs[index].uiFlags |= CELL_EPC;
          }
        }
        gpMercs[index].pRegion = createMouseRegion();
        Assert(gpMercs[index].pRegion);
        MSYS_DefineRegion(<MOUSE_REGION>gpMercs[index].pRegion, gpMercs[index].xp, gpMercs[index].yp, (gpMercs[index].xp + 50), (gpMercs[index].yp + 44), MSYS_PRIORITY_HIGH, 0, MercCellMouseMoveCallback, MercCellMouseClickCallback);
        if (fReset)
          RefreshMerc(gpMercs[index].pSoldier);
        if (!gpMercs[index].pSoldier.bLife)
          gpAR.ubAliveMercs--;
      }
  }
  if (gpAR.ubCivs) {
    iStartY = iTop + (gpAR.sHeight - ((gpAR.ubMercRows + gpAR.ubCivRows) * 47 + 7)) / 2 + gpAR.ubMercRows * 47 + 5;
    y = gpAR.ubCivRows;
    x = gpAR.ubCivCols;
    i = gpAR.ubCivs;
    gapStartRow = gpAR.ubCivRows - gpAR.ubCivRows * gpAR.ubCivCols + gpAR.ubCivs;
    for (x = 0; x < gpAR.ubCivCols; x++)
      for (y = 0; i && y < gpAR.ubCivRows; y++, i--) {
        index = y * gpAR.ubCivCols + gpAR.ubCivCols - x - 1;
        if (y >= gapStartRow)
          index -= y - gapStartRow + 1;
        Assert(index >= 0 && index < gpAR.ubCivs);
        gpCivs[index].xp = gpAR.sCenterStartX + 3 - 55 * (x + 1);
        gpCivs[index].yp = iStartY + y * 47;
        gpCivs[index].uiFlags |= CELL_MILITIA;
      }
  }
  if (gpAR.ubEnemies) {
    iStartY = iTop + (gpAR.sHeight - (gpAR.ubEnemyRows * 47 + 7)) / 2 + 5;
    y = gpAR.ubEnemyRows;
    x = gpAR.ubEnemyCols;
    i = gpAR.ubEnemies;
    gapStartRow = gpAR.ubEnemyRows - gpAR.ubEnemyRows * gpAR.ubEnemyCols + gpAR.ubEnemies;
    for (x = 0; x < gpAR.ubEnemyCols; x++)
      for (y = 0; i && y < gpAR.ubEnemyRows; y++, i--) {
        index = y * gpAR.ubEnemyCols + x;
        if (y > gapStartRow)
          index -= y - gapStartRow;
        Assert(index >= 0 && index < gpAR.ubEnemies);
        gpEnemies[index].xp = (gpAR.sCenterStartX + 141 + 55 * x);
        gpEnemies[index].yp = iStartY + y * 47;
        if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
          if (index < gpAR.ubElites)
            gpEnemies[index].uiFlags = CELL_ELITE;
          else if (index < gpAR.ubElites + gpAR.ubTroops)
            gpEnemies[index].uiFlags = CELL_TROOP;
          else
            gpEnemies[index].uiFlags = CELL_ADMIN;
        } else {
          if (index < gpAR.ubAFCreatures)
            gpEnemies[index].uiFlags = CELL_AF_CREATURE;
          else if (index < gpAR.ubAMCreatures + gpAR.ubAFCreatures)
            gpEnemies[index].uiFlags = CELL_AM_CREATURE;
          else if (index < gpAR.ubYFCreatures + gpAR.ubAMCreatures + gpAR.ubAFCreatures)
            gpEnemies[index].uiFlags = CELL_YF_CREATURE;
          else
            gpEnemies[index].uiFlags = CELL_YM_CREATURE;
        }
      }
  }
}

function RenderSoldierCell(pCell: SOLDIERCELL): void {
  let x: UINT8;
  if (pCell.uiFlags & CELL_MERC) {
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 36, pCell.yp + 2, pCell.xp + 44, pCell.yp + 30, 0);
    BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.iPanelImages, Enum121.MERC_PANEL, pCell.xp, pCell.yp, VO_BLT_SRCTRANSPARENCY, null);
    RenderSoldierCellBars(pCell);
    x = 0;
  } else {
    BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.iPanelImages, Enum121.OTHER_PANEL, pCell.xp, pCell.yp, VO_BLT_SRCTRANSPARENCY, null);
    x = 6;
  }
  if (!pCell.pSoldier.bLife) {
    SetObjectHandleShade(pCell.uiVObjectID, 0);
    if (!(pCell.uiFlags & CELL_CREATURE))
      BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.iFaces, Enum122.HUMAN_SKULL, pCell.xp + 3 + x, pCell.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
    else
      BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.iFaces, Enum122.CREATURE_SKULL, pCell.xp + 3 + x, pCell.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    if (pCell.uiFlags & CELL_HITBYATTACKER) {
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 3 + x, pCell.yp + 3, pCell.xp + 33 + x, pCell.yp + 29, 65535);
    } else if (pCell.uiFlags & CELL_HITLASTFRAME) {
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 3 + x, pCell.yp + 3, pCell.xp + 33 + x, pCell.yp + 29, 0);
      SetObjectHandleShade(pCell.uiVObjectID, 1);
      BltVideoObjectFromIndex(FRAME_BUFFER, pCell.uiVObjectID, pCell.usIndex, pCell.xp + 3 + x, pCell.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
    } else {
      SetObjectHandleShade(pCell.uiVObjectID, 0);
      BltVideoObjectFromIndex(FRAME_BUFFER, pCell.uiVObjectID, pCell.usIndex, pCell.xp + 3 + x, pCell.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
    }
  }

  if (pCell.pSoldier.bLife > 0 && pCell.pSoldier.bLife < OKLIFE && !(pCell.uiFlags & (CELL_HITBYATTACKER | CELL_HITLASTFRAME | CELL_CREATURE))) {
    // Merc is unconcious (and not taking damage), so darken his portrait.
    let pDestBuf: Pointer<UINT8>;
    let uiDestPitchBYTES: UINT32;
    let ClipRect: SGPRect = createSGPRect();
    ClipRect.iLeft = pCell.xp + 3 + x;
    ClipRect.iTop = pCell.yp + 3;
    ClipRect.iRight = pCell.xp + 33 + x;
    ClipRect.iBottom = pCell.yp + 29;
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, ClipRect);
    UnLockVideoSurface(FRAME_BUFFER);
  }

  // Draw the health text
  RenderSoldierCellHealth(pCell);

  DrawDebugText(pCell);

  if (!(pCell.uiFlags & CELL_RETREATING))
    pCell.uiFlags &= ~CELL_DIRTY;

  InvalidateRegion(pCell.xp, pCell.yp, pCell.xp + 50, pCell.yp + 44);

  // Adjust flags accordingly
  if (pCell.uiFlags & CELL_HITBYATTACKER) {
    pCell.uiFlags &= ~CELL_HITBYATTACKER;
    pCell.uiFlags |= CELL_HITLASTFRAME | CELL_DIRTY;
    pCell.uiFlashTime = GetJA2Clock() + 150;
  } else if (pCell.uiFlags & CELL_HITLASTFRAME) {
    if (pCell.uiFlashTime < GetJA2Clock()) {
      pCell.uiFlags &= ~CELL_HITLASTFRAME;
    }
    pCell.uiFlags |= CELL_DIRTY;
  }
}

function RenderSoldierCellBars(pCell: SOLDIERCELL): void {
  let iStartY: INT32;
  // HEALTH BAR
  if (!pCell.pSoldier.bLife)
    return;
  // yellow one for bleeding
  iStartY = pCell.yp + 29 - 25 * pCell.pSoldier.bLifeMax / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 37, iStartY, pCell.xp + 38, pCell.yp + 29, Get16BPPColor(FROMRGB(107, 107, 57)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 38, iStartY, pCell.xp + 39, pCell.yp + 29, Get16BPPColor(FROMRGB(222, 181, 115)));
  // pink one for bandaged.
  iStartY += 25 * pCell.pSoldier.bBleeding / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 37, iStartY, pCell.xp + 38, pCell.yp + 29, Get16BPPColor(FROMRGB(156, 57, 57)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 38, iStartY, pCell.xp + 39, pCell.yp + 29, Get16BPPColor(FROMRGB(222, 132, 132)));
  // red one for actual health
  iStartY = pCell.yp + 29 - 25 * pCell.pSoldier.bLife / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 37, iStartY, pCell.xp + 38, pCell.yp + 29, Get16BPPColor(FROMRGB(107, 8, 8)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 38, iStartY, pCell.xp + 39, pCell.yp + 29, Get16BPPColor(FROMRGB(206, 0, 0)));
  // BREATH BAR
  iStartY = pCell.yp + 29 - 25 * pCell.pSoldier.bBreathMax / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 41, iStartY, pCell.xp + 42, pCell.yp + 29, Get16BPPColor(FROMRGB(8, 8, 132)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 42, iStartY, pCell.xp + 43, pCell.yp + 29, Get16BPPColor(FROMRGB(8, 8, 107)));
  // MORALE BAR
  iStartY = pCell.yp + 29 - 25 * pCell.pSoldier.bMorale / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 45, iStartY, pCell.xp + 46, pCell.yp + 29, Get16BPPColor(FROMRGB(8, 156, 8)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.xp + 46, iStartY, pCell.xp + 47, pCell.yp + 29, Get16BPPColor(FROMRGB(8, 107, 8)));
}

function BuildInterfaceBuffer(): void {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  let usUselessWidth: UINT16;
  let usUselessHeight: UINT16;
  let ubBitDepth: UINT8;
  let ClipRect: SGPRect = createSGPRect();
  let DestRect: SGPRect = createSGPRect();
  let x: INT32;
  let y: INT32;

  // Setup the blitting clip regions, so we don't draw outside of the region (for excess panelling)
  gpAR.Rect.iLeft = 320 - gpAR.sWidth / 2;
  gpAR.Rect.iRight = gpAR.Rect.iLeft + gpAR.sWidth;
  gpAR.Rect.iTop = 240 - gpAR.sHeight / 2;
  if (gpAR.Rect.iTop > 120)
    gpAR.Rect.iTop -= 40;
  gpAR.Rect.iBottom = gpAR.Rect.iTop + gpAR.sHeight;

  DestRect.iLeft = 0;
  DestRect.iTop = 0;
  DestRect.iRight = gpAR.sWidth;
  DestRect.iBottom = gpAR.sHeight;

  // create buffer for the transition slot for merc items.  This slot contains the newly
  // selected item graphic in it's inventory size version.  This buffer is then scaled down
  // into the associated merc inventory panel slot buffer which is approximately 20% smaller.
  ({ usWidth: usUselessWidth, usHeight: usUselessHeight, ubBitDepth } = GetCurrentVideoSettings());
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = gpAR.sWidth;
  vs_desc.usHeight = gpAR.sHeight;
  vs_desc.ubBitDepth = ubBitDepth;
  if ((gpAR.iInterfaceBuffer = AddVideoSurface(vs_desc)) === -1)
    AssertMsg(false, "Failed to allocate memory for autoresolve interface buffer.");

  GetClippingRect(ClipRect);
  SetClippingRect(DestRect);

  // Blit the back panels...
  for (y = DestRect.iTop; y < DestRect.iBottom; y += 40) {
    for (x = DestRect.iLeft; x < DestRect.iRight; x += 50) {
      BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.C_TEXTURE, x, y, VO_BLT_SRCTRANSPARENCY, 0);
    }
  }
  // Blit the left and right edges
  for (y = DestRect.iTop; y < DestRect.iBottom; y += 40) {
    x = DestRect.iLeft;
    BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.L_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
    x = DestRect.iRight - 3;
    BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.R_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
  }
  // Blit the top and bottom edges
  for (x = DestRect.iLeft; x < DestRect.iRight; x += 50) {
    y = DestRect.iTop;
    BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.T_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
    y = DestRect.iBottom - 3;
    BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.B_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
  }
  // Blit the 4 corners
  BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.TL_BORDER, DestRect.iLeft, DestRect.iTop, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.TR_BORDER, DestRect.iRight - 10, DestRect.iTop, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.BL_BORDER, DestRect.iLeft, DestRect.iBottom - 9, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.BR_BORDER, DestRect.iRight - 10, DestRect.iBottom - 9, VO_BLT_SRCTRANSPARENCY, null);

  // Blit the center pieces
  x = gpAR.sCenterStartX - gpAR.Rect.iLeft;
  y = 0;
  // Top
  BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.TOP_MIDDLE, x, y, VO_BLT_SRCTRANSPARENCY, null);
  // Middle
  for (y = 40; y < gpAR.sHeight - 40; y += 40) {
    BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.AUTO_MIDDLE, x, y, VO_BLT_SRCTRANSPARENCY, null);
  }
  y = gpAR.sHeight - 40;
  BltVideoObjectFromIndex(gpAR.iInterfaceBuffer, gpAR.iPanelImages, Enum121.BOT_MIDDLE, x, y, VO_BLT_SRCTRANSPARENCY, null);

  SetClippingRect(ClipRect);
}

function ExpandWindow(): void {
  let OldRect: SGPRect = createSGPRect();
  let uiDestPitchBYTES: UINT32;
  let uiCurrentTime: UINT32;
  let uiTimeRange: UINT32;
  let uiPercent: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let i: INT32;

  if (!gpAR.ExRect.iLeft && !gpAR.ExRect.iRight) {
    // First time
    gpAR.ExRect.iLeft = ORIG_LEFT;
    gpAR.ExRect.iTop = ORIG_TOP;
    gpAR.ExRect.iRight = ORIG_RIGHT;
    gpAR.ExRect.iBottom = ORIG_BOTTOM;
    gpAR.uiStartExpanding = GetJA2Clock();
    gpAR.uiEndExpanding = gpAR.uiStartExpanding + 333;
    for (i = 0; i < Enum119.DONEWIN_BUTTON; i++)
      HideButton(gpAR.iButton[i]);
  } else {
    // Restore the previous area
    // left
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.ExRect.iLeft, gpAR.ExRect.iTop, 1, (gpAR.ExRect.iBottom - gpAR.ExRect.iTop + 1));
    InvalidateRegion(gpAR.ExRect.iLeft, gpAR.ExRect.iTop, gpAR.ExRect.iLeft + 1, gpAR.ExRect.iBottom + 1);
    // right
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.ExRect.iRight, gpAR.ExRect.iTop, 1, (gpAR.ExRect.iBottom - gpAR.ExRect.iTop + 1));
    InvalidateRegion(gpAR.ExRect.iRight, gpAR.ExRect.iTop, gpAR.ExRect.iRight + 1, gpAR.ExRect.iBottom + 1);
    // top
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.ExRect.iLeft, gpAR.ExRect.iTop, (gpAR.ExRect.iRight - gpAR.ExRect.iLeft + 1), 1);
    InvalidateRegion(gpAR.ExRect.iLeft, gpAR.ExRect.iTop, gpAR.ExRect.iRight + 1, gpAR.ExRect.iTop + 1);
    // bottom
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.ExRect.iLeft, gpAR.ExRect.iBottom, (gpAR.ExRect.iRight - gpAR.ExRect.iLeft + 1), 1);
    InvalidateRegion(gpAR.ExRect.iLeft, gpAR.ExRect.iBottom, gpAR.ExRect.iRight + 1, gpAR.ExRect.iBottom + 1);

    uiCurrentTime = GetJA2Clock();
    if (uiCurrentTime >= gpAR.uiStartExpanding && uiCurrentTime <= gpAR.uiEndExpanding) {
      // Debug purposes
      OldRect.iLeft = ORIG_LEFT;
      OldRect.iTop = ORIG_TOP;
      OldRect.iRight = ORIG_RIGHT;
      OldRect.iBottom = ORIG_BOTTOM;

      uiTimeRange = gpAR.uiEndExpanding - gpAR.uiStartExpanding;
      uiPercent = (uiCurrentTime - gpAR.uiStartExpanding) * 100 / uiTimeRange;

      // Left
      if (OldRect.iLeft <= gpAR.Rect.iLeft)
        gpAR.ExRect.iLeft = OldRect.iLeft + (gpAR.Rect.iLeft - OldRect.iLeft) * uiPercent / 100;
      else
        gpAR.ExRect.iLeft = gpAR.Rect.iLeft + (OldRect.iLeft - gpAR.Rect.iLeft) * uiPercent / 100;
      // Top
      if (OldRect.iTop <= gpAR.Rect.iTop)
        gpAR.ExRect.iTop = OldRect.iTop + (gpAR.Rect.iTop - OldRect.iTop) * uiPercent / 100;
      else
        gpAR.ExRect.iTop = gpAR.Rect.iTop + (OldRect.iTop - gpAR.Rect.iTop) * uiPercent / 100;
      // Right
      if (OldRect.iRight <= gpAR.Rect.iRight)
        gpAR.ExRect.iRight = OldRect.iRight + (gpAR.Rect.iRight - OldRect.iRight) * uiPercent / 100;
      else
        gpAR.ExRect.iRight = gpAR.Rect.iRight + (OldRect.iRight - gpAR.Rect.iRight) * uiPercent / 100;
      // Bottom
      if (OldRect.iBottom <= gpAR.Rect.iBottom)
        gpAR.ExRect.iBottom = OldRect.iBottom + (gpAR.Rect.iBottom - OldRect.iBottom) * uiPercent / 100;
      else
        gpAR.ExRect.iBottom = gpAR.Rect.iBottom + (OldRect.iBottom - gpAR.Rect.iBottom) * uiPercent / 100;
    } else {
      // expansion done -- final frame
      gpAR.ExRect.iLeft = gpAR.Rect.iLeft;
      gpAR.ExRect.iTop = gpAR.Rect.iTop;
      gpAR.ExRect.iRight = gpAR.Rect.iRight;
      gpAR.ExRect.iBottom = gpAR.Rect.iBottom;
      gpAR.fExpanding = false;
      gpAR.fShowInterface = true;
    }
  }

  // The new rect now determines the state of the current rectangle.
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, gpAR.ExRect.iLeft, gpAR.ExRect.iTop, gpAR.ExRect.iRight, gpAR.ExRect.iBottom, Get16BPPColor(FROMRGB(200, 200, 100)), pDestBuf);
  UnLockVideoSurface(FRAME_BUFFER);
  // left
  InvalidateRegion(gpAR.ExRect.iLeft, gpAR.ExRect.iTop, gpAR.ExRect.iLeft + 1, gpAR.ExRect.iBottom + 1);
  // right
  InvalidateRegion(gpAR.ExRect.iRight, gpAR.ExRect.iTop, gpAR.ExRect.iRight + 1, gpAR.ExRect.iBottom + 1);
  // top
  InvalidateRegion(gpAR.ExRect.iLeft, gpAR.ExRect.iTop, gpAR.ExRect.iRight + 1, gpAR.ExRect.iTop + 1);
  // bottom
  InvalidateRegion(gpAR.ExRect.iLeft, gpAR.ExRect.iBottom, gpAR.ExRect.iRight + 1, gpAR.ExRect.iBottom + 1);
}

export function VirtualSoldierDressWound(pSoldier: SOLDIERTYPE, pVictim: SOLDIERTYPE, pKit: OBJECTTYPE, sKitPts: INT16, sStatus: INT16): UINT32 {
  let uiDressSkill: UINT32;
  let uiPossible: UINT32;
  let uiActual: UINT32;
  let uiMedcost: UINT32;
  let uiDeficiency: UINT32;
  let uiAvailAPs: UINT32;
  let uiUsedAPs: UINT32;
  let bBelowOKlife: UINT8;
  let bPtsLeft: UINT8;

  if (pVictim.bBleeding < 1)
    return 0; // nothing to do, shouldn't have even been called!
  if (pVictim.bLife == 0)
    return 0;

  // calculate wound-dressing skill (3x medical,  2x equip,1x level, 1x dex)
  uiDressSkill = ((3 * EffectiveMedical(pSoldier)) + // medical knowledge
                  (2 * sStatus) + // state of medical kit
                  (10 * EffectiveExpLevel(pSoldier)) + // battle injury experience
                  EffectiveDexterity(pSoldier)) /
                 7; // general "handiness"

  // try to use every AP that the merc has left
  uiAvailAPs = pSoldier.bActionPoints;

  // OK, If we are in real-time, use another value...
  if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    // Set to a value which looks good based on out tactical turns duration
    uiAvailAPs = RT_FIRST_AID_GAIN_MODIFIER;
  }

  // calculate how much bandaging CAN be done this turn
  uiPossible = (uiAvailAPs * uiDressSkill) / 50; // max rate is 2 * fullAPs

  // if no healing is possible (insufficient APs or insufficient dressSkill)
  if (!uiPossible)
    return 0;

  if (pSoldier.inv[0].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
    uiPossible += (uiPossible / 2); // add extra 50 %

  uiActual = uiPossible; // start by assuming maximum possible

  // figure out how far below OKLIFE the victim is
  if (pVictim.bLife >= OKLIFE)
    bBelowOKlife = 0;
  else
    bBelowOKlife = OKLIFE - pVictim.bLife;

  // figure out how many healing pts we need to stop dying (2x cost)
  uiDeficiency = (2 * bBelowOKlife);

  // if, after that, the patient will still be bleeding
  if ((pVictim.bBleeding - bBelowOKlife) > 0) {
    // then add how many healing pts we need to stop bleeding (1x cost)
    uiDeficiency += (pVictim.bBleeding - bBelowOKlife);
  }

  // now, make sure we weren't going to give too much
  if (uiActual > uiDeficiency) // if we were about to apply too much
    uiActual = uiDeficiency; // reduce actual not to waste anything

  // now make sure we HAVE that much
  if (pKit.usItem == Enum225.MEDICKIT) {
    uiMedcost = uiActual / 2; // cost is only half
    if (uiMedcost == 0 && uiActual > 0)
      uiMedcost = 1;
    if (uiMedcost > sKitPts) // if we can't afford this
    {
      uiMedcost = sKitPts; // what CAN we afford?
      uiActual = uiMedcost * 2; // give double this as aid
    }
  } else {
    uiMedcost = uiActual;
    if (uiMedcost == 0 && uiActual > 0)
      uiMedcost = 1;
    if (uiMedcost > sKitPts) // can't afford it
      uiMedcost = uiActual = sKitPts; // recalc cost AND aid
  }

  bPtsLeft = uiActual;
  // heal real life points first (if below OKLIFE) because we don't want the
  // patient still DYING if bandages run out, or medic is disabled/distracted!
  // NOTE: Dressing wounds for life below OKLIFE now costs 2 pts/life point!
  if (bPtsLeft && pVictim.bLife < OKLIFE) {
    // if we have enough points to bring him all the way to OKLIFE this turn
    if (bPtsLeft >= (2 * bBelowOKlife)) {
      // raise life to OKLIFE
      pVictim.bLife = OKLIFE;
      // reduce bleeding by the same number of life points healed up
      pVictim.bBleeding -= bBelowOKlife;
      // use up appropriate # of actual healing points
      bPtsLeft -= (2 * bBelowOKlife);
    } else {
      pVictim.bLife += (bPtsLeft / 2);
      pVictim.bBleeding -= (bPtsLeft / 2);
      bPtsLeft = bPtsLeft % 2; // if ptsLeft was odd, ptsLeft = 1
    }

    // this should never happen any more, but make sure bleeding not negative
    if (pVictim.bBleeding < 0)
      pVictim.bBleeding = 0;

    // if this healing brought the patient out of the worst of it, cancel dying
    if (pVictim.bLife >= OKLIFE) {
      // turn off merc QUOTE flags
      pVictim.fDyingComment = false;
    }

    if (pVictim.bBleeding <= MIN_BLEEDING_THRESHOLD) {
      pVictim.fWarnedAboutBleeding = false;
    }
  }

  // if any healing points remain, apply that to any remaining bleeding (1/1)
  // DON'T spend any APs/kit pts to cure bleeding until merc is no longer dying
  // if ( bPtsLeft && pVictim->bBleeding && !pVictim->dying)
  if (bPtsLeft && pVictim.bBleeding) {
    // if we have enough points to bandage all remaining bleeding this turn
    if (bPtsLeft >= pVictim.bBleeding) {
      bPtsLeft -= pVictim.bBleeding;
      pVictim.bBleeding = 0;
    } else // bandage what we can
    {
      pVictim.bBleeding -= bPtsLeft;
      bPtsLeft = 0;
    }
  }
  // if there are any ptsLeft now, then we didn't actually get to use them
  uiActual -= bPtsLeft;

  // usedAPs equals (actionPts) * (%of possible points actually used)
  uiUsedAPs = (uiActual * uiAvailAPs) / uiPossible;

  if (pSoldier.inv[0].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
    uiUsedAPs = (uiUsedAPs * 2) / 3; // reverse 50% bonus by taking 2/3rds

  if (uiActual / 2)
    // MEDICAL GAIN (actual / 2):  Helped someone by giving first aid
    StatChange(pSoldier, MEDICALAMT, ((uiActual / 2)), 0);

  if (uiActual / 4)
    // DEXTERITY GAIN (actual / 4):  Helped someone by giving first aid
    StatChange(pSoldier, DEXTAMT, ((uiActual / 4)), 0);

  return uiMedcost;
}

function FindMedicalKit(): OBJECTTYPE | null {
  let i: INT32;
  let iSlot: INT32;
  for (i = 0; i < gpAR.ubMercs; i++) {
    iSlot = FindObjClass(gpMercs[i].pSoldier, IC_MEDKIT);
    if (iSlot != NO_SLOT) {
      return gpMercs[i].pSoldier.inv[iSlot];
    }
  }
  return null;
}

function AutoBandageMercs(): UINT32 {
  let i: INT32;
  let iBest: INT32;
  let uiPointsUsed: UINT32;
  let uiCurrPointsUsed: UINT32;
  let uiMaxPointsUsed: UINT32;
  let uiParallelPointsUsed: UINT32;
  let usKitPts: UINT16;
  let pKit: OBJECTTYPE | null = null;
  let fFound: boolean = false;
  let fComplete: boolean = true;
  let bSlot: INT8;
  let cnt: INT8;

  // Do we have any doctors?  If so, bandage selves first.
  fFound = false;
  uiMaxPointsUsed = uiParallelPointsUsed = 0;
  for (i = 0; i < gpAR.ubMercs; i++) {
    if (gpMercs[i].pSoldier.bLife >= OKLIFE && !gpMercs[i].pSoldier.bCollapsed && gpMercs[i].pSoldier.bMedical > 0 && (bSlot = FindObjClass(gpMercs[i].pSoldier, IC_MEDKIT)) != NO_SLOT) {
      fFound = true;
      // bandage self first!
      uiCurrPointsUsed = 0;
      cnt = 0;
      while (gpMercs[i].pSoldier.bBleeding) {
        pKit = gpMercs[i].pSoldier.inv[bSlot];
        usKitPts = TotalPoints(pKit);
        if (!usKitPts) {
          // attempt to find another kit before stopping
          if ((bSlot = FindObjClass(gpMercs[i].pSoldier, IC_MEDKIT)) != NO_SLOT)
            continue;
          break;
        }
        uiPointsUsed = VirtualSoldierDressWound(gpMercs[i].pSoldier, gpMercs[i].pSoldier, pKit, usKitPts, usKitPts);
        UseKitPoints(pKit, uiPointsUsed, gpMercs[i].pSoldier);
        uiCurrPointsUsed += uiPointsUsed;
        cnt++;
        if (cnt > 50)
          break;
      }
      if (uiCurrPointsUsed > uiMaxPointsUsed)
        uiMaxPointsUsed = uiCurrPointsUsed;
      if (!pKit)
        break;
    }
  }

  // Find the best rated doctor to do all of the bandaging.
  iBest = 0;
  for (i = 0; i < gpAR.ubMercs; i++) {
    if (gpMercs[i].pSoldier.bLife >= OKLIFE && !gpMercs[i].pSoldier.bCollapsed && gpMercs[i].pSoldier.bMedical > 0) {
      if (gpMercs[i].pSoldier.bMedical > gpMercs[iBest].pSoldier.bMedical) {
        iBest = i;
      }
    }
  }

  for (i = 0; i < gpAR.ubMercs; i++) {
    while (gpMercs[i].pSoldier.bBleeding && gpMercs[i].pSoldier.bLife) {
      // This merc needs medical attention
      if (!pKit) {
        pKit = FindMedicalKit();
        if (!pKit) {
          fComplete = false;
          break;
        }
      }
      usKitPts = TotalPoints(pKit);
      if (!usKitPts) {
        pKit = null;
        fComplete = false;
        continue;
      }
      uiPointsUsed = VirtualSoldierDressWound(gpMercs[iBest].pSoldier, gpMercs[i].pSoldier, pKit, usKitPts, usKitPts);
      UseKitPoints(pKit, uiPointsUsed, gpMercs[i].pSoldier);
      uiParallelPointsUsed += uiPointsUsed;
      fComplete = true;
    }
  }
  if (fComplete) {
    DoScreenIndependantMessageBox(gzLateLocalizedString[13], MSG_BOX_FLAG_OK, AutoBandageFinishedCallback);
  } else {
    DoScreenIndependantMessageBox(gzLateLocalizedString[10], MSG_BOX_FLAG_OK, AutoBandageFinishedCallback);
  }

  gpAR.uiTotalElapsedBattleTimeInMilliseconds += uiParallelPointsUsed * 200;
  return 1;
}

function RenderAutoResolve(): void {
  let i: INT32;
  let hVSurface: HVSURFACE;
  let xp: INT32;
  let yp: INT32;
  let pCell: SOLDIERCELL | null = null;
  let index: INT32 = 0;
  let str: string /* UINT16[100] */ = <string><unknown>undefined;
  let bTownId: UINT8 = 0;
  let ubGood: UINT8;
  let ubBad: UINT8;

  if (gpAR.fExpanding) {
    // animate the expansion of the window.
    ExpandWindow();
    return;
  } else if (gpAR.fShowInterface) {
    // After expanding the window, we now show the interface
    if (gpAR.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS && !gpAR.fPendingSurrender) {
      for (i = 0; i < Enum119.DONEWIN_BUTTON; i++)
        ShowButton(gpAR.iButton[i]);
      HideButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
      HideButton(gpAR.iButton[Enum119.YES_BUTTON]);
      HideButton(gpAR.iButton[Enum119.NO_BUTTON]);
      gpAR.fShowInterface = false;
    } else if (gpAR.ubBattleStatus == Enum120.BATTLE_VICTORY) {
      ShowButton(gpAR.iButton[Enum119.DONEWIN_BUTTON]);
      ShowButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
    } else {
      ShowButton(gpAR.iButton[Enum119.DONELOSE_BUTTON]);
    }
  }

  if (!gpAR.fRenderAutoResolve && !gpAR.fDebugInfo) {
    // update the dirty cells only
    for (i = 0; i < gpAR.ubMercs; i++) {
      if (gpMercs[i].uiFlags & CELL_DIRTY) {
        RenderSoldierCell(gpMercs[i]);
      }
    }
    for (i = 0; i < gpAR.ubCivs; i++) {
      if (gpCivs[i].uiFlags & CELL_DIRTY) {
        RenderSoldierCell(gpCivs[i]);
      }
    }
    for (i = 0; i < gpAR.ubEnemies; i++) {
      if (gpEnemies[i].uiFlags & CELL_DIRTY) {
        RenderSoldierCell(gpEnemies[i]);
      }
    }
    return;
  }
  gpAR.fRenderAutoResolve = false;

  hVSurface = GetVideoSurface(gpAR.iInterfaceBuffer);
  BltVideoSurfaceToVideoSurface(ghFrameBuffer, hVSurface, 0, gpAR.Rect.iLeft, gpAR.Rect.iTop, VO_BLT_SRCTRANSPARENCY, 0);

  for (i = 0; i < gpAR.ubMercs; i++) {
    RenderSoldierCell(gpMercs[i]);
  }
  for (i = 0; i < gpAR.ubCivs; i++) {
    RenderSoldierCell(gpCivs[i]);
  }
  for (i = 0; i < gpAR.ubEnemies; i++) {
    RenderSoldierCell(gpEnemies[i]);
  }

  // Render the titles
  SetFont(FONT10ARIALBOLD());
  SetFontForeground(FONT_WHITE);
  SetFontShadow(FONT_NEARBLACK);

  switch (gubEnemyEncounterCode) {
    case Enum164.ENEMY_ENCOUNTER_CODE:
      str = gpStrategicString[Enum365.STR_AR_ENCOUNTER_HEADER];
      break;
    case Enum164.ENEMY_INVASION_CODE:
    case Enum164.CREATURE_ATTACK_CODE:
      str = gpStrategicString[Enum365.STR_AR_DEFEND_HEADER];
      break;
  }

  xp = gpAR.sCenterStartX + 70 - StringPixLength(str, FONT10ARIALBOLD()) / 2;
  yp = gpAR.Rect.iTop + 15;
  mprintf(xp, yp, str);

  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_GRAY2);
  SetFontShadow(FONT_NEARBLACK);

  str = GetSectorIDString(gpAR.ubSectorX, gpAR.ubSectorY, 0, true);
  xp = gpAR.sCenterStartX + 70 - StringPixLength(str, FONT10ARIAL()) / 2;
  yp += 11;
  mprintf(xp, yp, str);

  // Display the remaining forces
  ubGood = (gpAR.ubAliveMercs + gpAR.ubAliveCivs);
  ubBad = gpAR.ubAliveEnemies;
  str = swprintf(gzLateLocalizedString[17], ubGood, ubBad);

  SetFont(FONT14ARIAL());
  if (ubGood * 3 <= ubBad * 2) {
    SetFontForeground(FONT_LTRED);
  } else if (ubGood * 2 >= ubBad * 3) {
    SetFontForeground(FONT_LTGREEN);
  } else {
    SetFontForeground(FONT_YELLOW);
  }

  xp = gpAR.sCenterStartX + 70 - StringPixLength(str, FONT14ARIAL()) / 2;
  yp += 11;
  mprintf(xp, yp, str);

  if (gpAR.fPendingSurrender) {
    DisplayWrappedString((gpAR.sCenterStartX + 16), (230 + gpAR.bVerticalOffset), 108, 2, FONT10ARIAL(), FONT_YELLOW, gpStrategicString[Enum365.STR_ENEMY_SURRENDER_OFFER], FONT_BLACK, false, LEFT_JUSTIFIED);
  }

  if (gpAR.ubBattleStatus != Enum120.BATTLE_IN_PROGRESS) {
    // Handle merc morale, Global loyalty, and change of sector control
    if (!gpAR.fMoraleEventsHandled) {
      gpAR.uiTotalElapsedBattleTimeInMilliseconds *= 3;
      gpAR.fMoraleEventsHandled = true;
      if (CheckFact(Enum170.FACT_FIRST_BATTLE_FOUGHT, 0) == false) {
        // this was the first battle against the army
        SetFactTrue(Enum170.FACT_FIRST_BATTLE_FOUGHT);
        if (gpAR.ubBattleStatus == Enum120.BATTLE_VICTORY) {
          SetFactTrue(Enum170.FACT_FIRST_BATTLE_WON);
        }
        SetTheFirstBattleSector((gpAR.ubSectorX + gpAR.ubSectorY * MAP_WORLD_X));
        HandleFirstBattleEndingWhileInTown(gpAR.ubSectorX, gpAR.ubSectorY, 0, true);
      }

      switch (gpAR.ubBattleStatus) {
        case Enum120.BATTLE_VICTORY:
          HandleMoraleEvent(null, Enum234.MORALE_BATTLE_WON, gpAR.ubSectorX, gpAR.ubSectorY, 0);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_WON, gpAR.ubSectorX, gpAR.ubSectorY, 0);

          SectorInfo[SECTOR(gpAR.ubSectorX, gpAR.ubSectorY)].bLastKnownEnemies = 0;
          SetThisSectorAsPlayerControlled(gpAR.ubSectorX, gpAR.ubSectorY, 0, true);

          SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);
          LogBattleResults(Enum165.LOG_VICTORY);
          break;

        case Enum120.BATTLE_SURRENDERED:
        case Enum120.BATTLE_CAPTURED:
          for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
            if (MercPtrs[i].bActive && MercPtrs[i].bLife && !(MercPtrs[i].uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(MercPtrs[i])) {
              // Merc is active and alive, and not a vehicle or robot
              if (PlayerMercInvolvedInThisCombat(MercPtrs[i])) {
                // This morale event is PER INDIVIDUAL SOLDIER
                HandleMoraleEvent(MercPtrs[i], Enum234.MORALE_MERC_CAPTURED, gpAR.ubSectorX, gpAR.ubSectorY, 0);
              }
            }
          }
          HandleMoraleEvent(null, Enum234.MORALE_HEARD_BATTLE_LOST, gpAR.ubSectorX, gpAR.ubSectorY, 0);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_LOST, gpAR.ubSectorX, gpAR.ubSectorY, 0);

          SetMusicMode(Enum328.MUSIC_TACTICAL_DEATH);
          gsEnemyGainedControlOfSectorID = SECTOR(gpAR.ubSectorX, gpAR.ubSectorY);
          break;
        case Enum120.BATTLE_DEFEAT:
          HandleMoraleEvent(null, Enum234.MORALE_HEARD_BATTLE_LOST, gpAR.ubSectorX, gpAR.ubSectorY, 0);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_LOST, gpAR.ubSectorX, gpAR.ubSectorY, 0);
          if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.ubSectorX, gpAR.ubSectorY);
          } else {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.ubSectorX, gpAR.ubSectorY);
            gsCiviliansEatenByMonsters = gpAR.ubAliveEnemies;
          }
          SetMusicMode(Enum328.MUSIC_TACTICAL_DEATH);
          LogBattleResults(Enum165.LOG_DEFEAT);
          break;

        case Enum120.BATTLE_RETREAT:

          // Tack on 5 minutes for retreat.
          gpAR.uiTotalElapsedBattleTimeInMilliseconds += 300000;

          HandleLoyaltyImplicationsOfMercRetreat(RETREAT_AUTORESOLVE, gpAR.ubSectorX, gpAR.ubSectorY, 0);
          if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.ubSectorX, gpAR.ubSectorY);
          } else if (gpAR.ubAliveEnemies) {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.ubSectorX, gpAR.ubSectorY);
            gsCiviliansEatenByMonsters = gpAR.ubAliveEnemies;
          }
          break;
      }
    }
    // Render the end battle condition.
    switch (gpAR.ubBattleStatus) {
      case Enum120.BATTLE_VICTORY:
        SetFontForeground(FONT_LTGREEN);
        str = gpStrategicString[Enum365.STR_AR_OVER_VICTORY];
        break;
      case Enum120.BATTLE_SURRENDERED:
      case Enum120.BATTLE_CAPTURED:
        if (gpAR.ubBattleStatus == Enum120.BATTLE_SURRENDERED) {
          str = gpStrategicString[Enum365.STR_AR_OVER_SURRENDERED];
        } else {
          DisplayWrappedString((gpAR.sCenterStartX + 16), 310, 108, 2, FONT10ARIAL(), FONT_YELLOW, gpStrategicString[Enum365.STR_ENEMY_CAPTURED], FONT_BLACK, false, LEFT_JUSTIFIED);
          str = gpStrategicString[Enum365.STR_AR_OVER_CAPTURED];
        }
        SetFontForeground(FONT_RED);
        break;
      case Enum120.BATTLE_DEFEAT:
        SetFontForeground(FONT_RED);
        str = gpStrategicString[Enum365.STR_AR_OVER_DEFEAT];
        break;
      case Enum120.BATTLE_RETREAT:
        SetFontForeground(FONT_YELLOW);
        str = gpStrategicString[Enum365.STR_AR_OVER_RETREATED];
        break;
    }
    // Render the results of the battle.
    SetFont(BLOCKFONT2());
    xp = gpAR.sCenterStartX + 12;
    yp = 218 + gpAR.bVerticalOffset;
    BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.iIndent, 0, xp, yp, VO_BLT_SRCTRANSPARENCY, null);
    xp = gpAR.sCenterStartX + 70 - StringPixLength(str, BLOCKFONT2()) / 2;
    yp = 227 + gpAR.bVerticalOffset;
    mprintf(xp, yp, str);

    // Render the total battle time elapsed.
    SetFont(FONT10ARIAL());
    str = swprintf("%s:  %dm %02ds", gpStrategicString[Enum365.STR_AR_TIME_ELAPSED], gpAR.uiTotalElapsedBattleTimeInMilliseconds / 60000, (gpAR.uiTotalElapsedBattleTimeInMilliseconds % 60000) / 1000);
    xp = gpAR.sCenterStartX + 70 - StringPixLength(str, FONT10ARIAL()) / 2;
    yp = 290 + gpAR.bVerticalOffset;
    SetFontForeground(FONT_YELLOW);
    mprintf(xp, yp, str);
  }

  MarkButtonsDirty();
  InvalidateScreen();
}

function CreateAutoResolveInterface(): void {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let i: INT32;
  let index: INT32;
  let hVObject: HVOBJECT;
  let ubGreenMilitia: UINT8;
  let ubRegMilitia: UINT8;
  let ubEliteMilitia: UINT8;
  // Setup new autoresolve blanket interface.
  MSYS_DefineRegion(gpAR.AutoResolveRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGH - 1, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  gpAR.fRenderAutoResolve = true;
  gpAR.fExitAutoResolve = false;

  // Load the general panel image pieces, to be combined to make the dynamically sized window.
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = "Interface\\AutoResolve.sti";
  if (!(gpAR.iPanelImages = AddVideoObject(VObjectDesc))) {
    AssertMsg(0, "Failed to load Interface\\AutoResolve.sti");
  }

  // Load the button images file, and assign it to the first button.
  /* OLD BEFORE THE MEDICAL BUTTON WAS ADDED
  gpAR->iButtonImage[ PAUSE_BUTTON ] = LoadButtonImage( "Interface\\AutoBtns.sti", -1, 0, -1, 6, -1 );
  if( gpAR->iButtonImage[ PAUSE_BUTTON ] == -1 )
  {
          AssertMsg( 0, "Failed to load Interface\\AutoBtns.sti" );
  }

  //Have the other buttons hook into the first button containing the images.
  gpAR->iButtonImage[ PLAY_BUTTON ]			= UseLoadedButtonImage( gpAR->iButtonImage[ PAUSE_BUTTON ], -1, 1, -1, 7, -1 );
  gpAR->iButtonImage[ FAST_BUTTON ]			= UseLoadedButtonImage( gpAR->iButtonImage[ PAUSE_BUTTON ], -1, 2, -1, 8, -1 );
  gpAR->iButtonImage[ FINISH_BUTTON ]		= UseLoadedButtonImage( gpAR->iButtonImage[ PAUSE_BUTTON ], -1, 3, -1, 9, -1 );
  gpAR->iButtonImage[ YES_BUTTON ]			= UseLoadedButtonImage( gpAR->iButtonImage[ PAUSE_BUTTON ], -1, 4, -1, 10, -1 );
  gpAR->iButtonImage[ NO_BUTTON ]				= UseLoadedButtonImage( gpAR->iButtonImage[ PAUSE_BUTTON ], -1, 5, -1, 11, -1 );
  gpAR->iButtonImage[ RETREAT_BUTTON ]	= UseLoadedButtonImage( gpAR->iButtonImage[ PAUSE_BUTTON ], -1, 12, -1, 13, -1 );
  gpAR->iButtonImage[ DONE_BUTTON ]			= UseLoadedButtonImage( gpAR->iButtonImage[ PAUSE_BUTTON ], -1, 14, -1, 15, -1 );
  */
  gpAR.iButtonImage[Enum119.PAUSE_BUTTON] = LoadButtonImage("Interface\\AutoBtns.sti", -1, 0, -1, 7, -1);
  if (gpAR.iButtonImage[Enum119.PAUSE_BUTTON] == -1) {
    AssertMsg(0, "Failed to load Interface\\AutoBtns.sti");
  }

  // Have the other buttons hook into the first button containing the images.
  gpAR.iButtonImage[Enum119.PLAY_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 1, -1, 8, -1);
  gpAR.iButtonImage[Enum119.FAST_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 2, -1, 9, -1);
  gpAR.iButtonImage[Enum119.FINISH_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 3, -1, 10, -1);
  gpAR.iButtonImage[Enum119.YES_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 4, -1, 11, -1);
  gpAR.iButtonImage[Enum119.NO_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 5, -1, 12, -1);
  gpAR.iButtonImage[Enum119.BANDAGE_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 6, -1, 13, -1);
  gpAR.iButtonImage[Enum119.RETREAT_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 14, -1, 15, -1);
  gpAR.iButtonImage[Enum119.DONEWIN_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 14, -1, 15, -1);
  gpAR.iButtonImage[Enum119.DONELOSE_BUTTON] = UseLoadedButtonImage(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], -1, 16, -1, 17, -1);

  // Load the generic faces for civs and enemies
  VObjectDesc.ImageFile = "Interface\\SmFaces.sti";
  if (!(gpAR.iFaces = AddVideoObject(VObjectDesc))) {
    AssertMsg(0, "Failed to load Interface\\SmFaces.sti");
  }
  if ((hVObject = GetVideoObject(gpAR.iFaces))) {
    hVObject.value.pShades[0] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 255, 255, 255, false);
    hVObject.value.pShades[1] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 250, 25, 25, true);
  }

  // Add the battle over panels
  VObjectDesc.ImageFile = "Interface\\indent.sti";
  if (!(gpAR.iIndent = AddVideoObject(VObjectDesc))) {
    AssertMsg(0, "Failed to load Interface\\indent.sti");
  }

  // add all the faces now
  for (i = 0; i < gpAR.ubMercs; i++) {
    let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
    // Load the face
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%02d.sti", gMercProfiles[gpMercs[i].pSoldier.ubProfile].ubFaceIndex);
    if (!(gpMercs[i].uiVObjectID = AddVideoObject(VObjectDesc))) {
      VObjectDesc.ImageFile = "Faces\\65Face\\speck.sti";
      if (!(gpMercs[i].uiVObjectID = AddVideoObject(VObjectDesc))) {
        AssertMsg(0, FormatString("Failed to load %Faces\\65Face\\%02d.sti or it's placeholder, speck.sti", gMercProfiles[gpMercs[i].pSoldier.ubProfile].ubFaceIndex));
      }
    }
    if ((hVObject = GetVideoObject(gpMercs[i].uiVObjectID))) {
      hVObject.value.pShades[0] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 255, 255, 255, false);
      hVObject.value.pShades[1] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 250, 25, 25, true);
    }
  }

  ubEliteMilitia = MilitiaInSectorOfRank(gpAR.ubSectorX, gpAR.ubSectorY, Enum126.ELITE_MILITIA);
  ubRegMilitia = MilitiaInSectorOfRank(gpAR.ubSectorX, gpAR.ubSectorY, Enum126.REGULAR_MILITIA);
  ubGreenMilitia = MilitiaInSectorOfRank(gpAR.ubSectorX, gpAR.ubSectorY, Enum126.GREEN_MILITIA);
  while (ubEliteMilitia + ubRegMilitia + ubGreenMilitia < gpAR.ubCivs) {
    switch (PreRandom(3)) {
      case 0:
        ubEliteMilitia++;
        break;
      case 1:
        ubRegMilitia++;
        break;
      case 2:
        ubGreenMilitia++;
        break;
    }
  }
  for (i = 0; i < gpAR.ubCivs; i++) {
    // reset counter of how many mortars this team has rolled
    ResetMortarsOnTeamCount();

    if (i < ubEliteMilitia) {
      gpCivs[i].pSoldier = <SOLDIERTYPE>TacticalCreateMilitia(Enum262.SOLDIER_CLASS_ELITE_MILITIA);
      if (gpCivs[i].pSoldier.ubBodyType == Enum194.REGFEMALE) {
        gpCivs[i].usIndex = Enum122.MILITIA3F_FACE;
      } else {
        gpCivs[i].usIndex = Enum122.MILITIA3_FACE;
      }
    } else if (i < ubRegMilitia + ubEliteMilitia) {
      gpCivs[i].pSoldier = <SOLDIERTYPE>TacticalCreateMilitia(Enum262.SOLDIER_CLASS_REG_MILITIA);
      if (gpCivs[i].pSoldier.ubBodyType == Enum194.REGFEMALE) {
        gpCivs[i].usIndex = Enum122.MILITIA2F_FACE;
      } else {
        gpCivs[i].usIndex = Enum122.MILITIA2_FACE;
      }
    } else if (i < ubGreenMilitia + ubRegMilitia + ubEliteMilitia) {
      gpCivs[i].pSoldier = <SOLDIERTYPE>TacticalCreateMilitia(Enum262.SOLDIER_CLASS_GREEN_MILITIA);
      if (gpCivs[i].pSoldier.ubBodyType == Enum194.REGFEMALE) {
        gpCivs[i].usIndex = Enum122.MILITIA1F_FACE;
      } else {
        gpCivs[i].usIndex = Enum122.MILITIA1_FACE;
      }
    } else {
      AssertMsg(0, "Attempting to illegally create a militia soldier.");
    }
    if (!gpCivs[i].pSoldier) {
      AssertMsg(0, "Failed to create militia soldier for autoresolve.");
    }
    gpCivs[i].uiVObjectID = gpAR.iFaces;
    gpCivs[i].pSoldier.sSectorX = gpAR.ubSectorX;
    gpCivs[i].pSoldier.sSectorY = gpAR.ubSectorY;
    gpCivs[i].pSoldier.name = gpStrategicString[Enum365.STR_AR_MILITIA_NAME];
  }
  if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
    for (i = 0, index = 0; i < gpAR.ubElites; i++, index++) {
      gpEnemies[index].pSoldier = <SOLDIERTYPE>TacticalCreateEliteEnemy();
      gpEnemies[index].uiVObjectID = gpAR.iFaces;
      if (gpEnemies[i].pSoldier.ubBodyType == Enum194.REGFEMALE) {
        gpEnemies[index].usIndex = Enum122.ELITEF_FACE;
      } else {
        gpEnemies[index].usIndex = Enum122.ELITE_FACE;
      }
      gpEnemies[index].pSoldier.sSectorX = gpAR.ubSectorX;
      gpEnemies[index].pSoldier.sSectorY = gpAR.ubSectorY;
      gpEnemies[index].pSoldier.name = gpStrategicString[Enum365.STR_AR_ELITE_NAME];
    }
    for (i = 0; i < gpAR.ubTroops; i++, index++) {
      gpEnemies[index].pSoldier = <SOLDIERTYPE>TacticalCreateArmyTroop();
      gpEnemies[index].uiVObjectID = gpAR.iFaces;
      gpEnemies[index].usIndex = Enum122.TROOP_FACE;
      gpEnemies[index].pSoldier.sSectorX = gpAR.ubSectorX;
      gpEnemies[index].pSoldier.sSectorY = gpAR.ubSectorY;
      gpEnemies[index].pSoldier.name = gpStrategicString[Enum365.STR_AR_TROOP_NAME];
    }
    for (i = 0; i < gpAR.ubAdmins; i++, index++) {
      gpEnemies[index].pSoldier = <SOLDIERTYPE>TacticalCreateAdministrator();
      gpEnemies[index].uiVObjectID = gpAR.iFaces;
      gpEnemies[index].usIndex = Enum122.ADMIN_FACE;
      gpEnemies[index].pSoldier.sSectorX = gpAR.ubSectorX;
      gpEnemies[index].pSoldier.sSectorY = gpAR.ubSectorY;
      gpEnemies[index].pSoldier.name = gpStrategicString[Enum365.STR_AR_ADMINISTRATOR_NAME];
    }
    AssociateEnemiesWithStrategicGroups();
  } else {
    for (i = 0, index = 0; i < gpAR.ubAFCreatures; i++, index++) {
      gpEnemies[index].pSoldier = <SOLDIERTYPE>TacticalCreateCreature(Enum194.ADULTFEMALEMONSTER);
      gpEnemies[index].uiVObjectID = gpAR.iFaces;
      gpEnemies[index].usIndex = Enum122.AF_CREATURE_FACE;
      gpEnemies[index].pSoldier.sSectorX = gpAR.ubSectorX;
      gpEnemies[index].pSoldier.sSectorY = gpAR.ubSectorY;
      gpEnemies[index].pSoldier.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
    for (i = 0; i < gpAR.ubAMCreatures; i++, index++) {
      gpEnemies[index].pSoldier = <SOLDIERTYPE>TacticalCreateCreature(Enum194.AM_MONSTER);
      gpEnemies[index].uiVObjectID = gpAR.iFaces;
      gpEnemies[index].usIndex = Enum122.AM_CREATURE_FACE;
      gpEnemies[index].pSoldier.sSectorX = gpAR.ubSectorX;
      gpEnemies[index].pSoldier.sSectorY = gpAR.ubSectorY;
      gpEnemies[index].pSoldier.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
    for (i = 0; i < gpAR.ubYFCreatures; i++, index++) {
      gpEnemies[index].pSoldier = <SOLDIERTYPE>TacticalCreateCreature(Enum194.YAF_MONSTER);
      gpEnemies[index].uiVObjectID = gpAR.iFaces;
      gpEnemies[index].usIndex = Enum122.YF_CREATURE_FACE;
      gpEnemies[index].pSoldier.sSectorX = gpAR.ubSectorX;
      gpEnemies[index].pSoldier.sSectorY = gpAR.ubSectorY;
      gpEnemies[index].pSoldier.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
    for (i = 0; i < gpAR.ubYMCreatures; i++, index++) {
      gpEnemies[index].pSoldier = <SOLDIERTYPE>TacticalCreateCreature(Enum194.YAM_MONSTER);
      gpEnemies[index].uiVObjectID = gpAR.iFaces;
      gpEnemies[index].usIndex = Enum122.YM_CREATURE_FACE;
      gpEnemies[index].pSoldier.sSectorX = gpAR.ubSectorX;
      gpEnemies[index].pSoldier.sSectorY = gpAR.ubSectorY;
      gpEnemies[index].pSoldier.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
  }

  if (gpAR.ubSectorX == gWorldSectorX && gpAR.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
    CheckAndHandleUnloadingOfCurrentWorld();
  } else {
    gfBlitBattleSectorLocator = false;
  }

  // Build the interface buffer, and blit the "shaded" background.  This info won't
  // change from now on, but will be used to restore text.
  BuildInterfaceBuffer();
  BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, 0, 0, 640, 480);

  // If we are bumping up the interface, then also use that piece of info to
  // move the buttons up by the same amount.
  gpAR.bVerticalOffset = 240 - gpAR.sHeight / 2 > 120 ? -40 : 0;

  // Create the buttons -- subject to relocation
  gpAR.iButton[Enum119.PLAY_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.PLAY_BUTTON], (gpAR.sCenterStartX + 11), (240 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), PlayButtonCallback);
  gpAR.iButton[Enum119.FAST_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.FAST_BUTTON], (gpAR.sCenterStartX + 51), (240 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), FastButtonCallback);
  gpAR.iButton[Enum119.FINISH_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.FINISH_BUTTON], (gpAR.sCenterStartX + 91), (240 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), FinishButtonCallback);
  gpAR.iButton[Enum119.PAUSE_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.PAUSE_BUTTON], (gpAR.sCenterStartX + 11), (274 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), PauseButtonCallback);

  gpAR.iButton[Enum119.RETREAT_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.RETREAT_BUTTON], (gpAR.sCenterStartX + 51), (274 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), RetreatButtonCallback);
  if (!gpAR.ubMercs) {
    DisableButton(gpAR.iButton[Enum119.RETREAT_BUTTON]);
  }
  SpecifyGeneralButtonTextAttributes(gpAR.iButton[Enum119.RETREAT_BUTTON], gpStrategicString[Enum365.STR_AR_RETREAT_BUTTON], BLOCKFONT2(), 169, FONT_NEARBLACK);

  gpAR.iButton[Enum119.BANDAGE_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.BANDAGE_BUTTON], (gpAR.sCenterStartX + 11), (245 + gpAR.bVerticalOffset), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BandageButtonCallback);

  gpAR.iButton[Enum119.DONEWIN_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.DONEWIN_BUTTON], (gpAR.sCenterStartX + 51), (245 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DoneButtonCallback);
  SpecifyGeneralButtonTextAttributes(gpAR.iButton[Enum119.DONEWIN_BUTTON], gpStrategicString[Enum365.STR_AR_DONE_BUTTON], BLOCKFONT2(), 169, FONT_NEARBLACK);

  gpAR.iButton[Enum119.DONELOSE_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.DONELOSE_BUTTON], (gpAR.sCenterStartX + 25), (245 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DoneButtonCallback);
  SpecifyGeneralButtonTextAttributes(gpAR.iButton[Enum119.DONELOSE_BUTTON], gpStrategicString[Enum365.STR_AR_DONE_BUTTON], BLOCKFONT2(), 169, FONT_NEARBLACK);
  gpAR.iButton[Enum119.YES_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.YES_BUTTON], (gpAR.sCenterStartX + 21), (257 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), AcceptSurrenderCallback);
  gpAR.iButton[Enum119.NO_BUTTON] = QuickCreateButton(gpAR.iButtonImage[Enum119.NO_BUTTON], (gpAR.sCenterStartX + 81), (257 + gpAR.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), RejectSurrenderCallback);
  HideButton(gpAR.iButton[Enum119.YES_BUTTON]);
  HideButton(gpAR.iButton[Enum119.NO_BUTTON]);
  HideButton(gpAR.iButton[Enum119.DONEWIN_BUTTON]);
  HideButton(gpAR.iButton[Enum119.DONELOSE_BUTTON]);
  HideButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
  ButtonList[gpAR.iButton[Enum119.PLAY_BUTTON]].uiFlags |= BUTTON_CLICKED_ON;
}

function RemoveAutoResolveInterface(fDeleteForGood: boolean): void {
  let i: INT32;
  let ubCurrentRank: UINT8;
  let ubCurrentGroupID: UINT8 = 0;
  let fFirstGroup: boolean = true;

  // VtResumeSampling();

  MSYS_RemoveRegion(gpAR.AutoResolveRegion);
  DeleteVideoObjectFromIndex(gpAR.iPanelImages);
  DeleteVideoObjectFromIndex(gpAR.iFaces);
  DeleteVideoObjectFromIndex(gpAR.iIndent);
  DeleteVideoSurfaceFromIndex(gpAR.iInterfaceBuffer);

  if (fDeleteForGood) {
    // Delete the soldier instances -- done when we are completely finished.

    // KM: By request of AM, I have added this bleeding event in cases where autoresolve is
    //	  complete and there are bleeding mercs remaining.  AM coded the internals
    //    of the strategic event.
    for (i = 0; i < gpAR.ubMercs; i++) {
      if (gpMercs[i].pSoldier.bBleeding && gpMercs[i].pSoldier.bLife) {
        // ARM: only one event is needed regardless of how many are bleeding
        AddStrategicEvent(Enum132.EVENT_BANDAGE_BLEEDING_MERCS, GetWorldTotalMin() + 1, 0);
        break;
      }
    }

    // ARM: Update assignment flashing: Doctors may now have new patients or lost them all, etc.
    gfReEvaluateEveryonesNothingToDo = true;

    if (gpAR.pRobotCell) {
      UpdateRobotControllerGivenRobot(gpAR.pRobotCell.pSoldier);
    }
    for (i = 0; i < gpAR.iNumMercFaces; i++) {
      if (i >= gpAR.iActualMercFaces)
        TacticalRemoveSoldierPointer(gpMercs[i].pSoldier, false);
      else {
        // Record finishing information for our mercs
        if (!gpMercs[i].pSoldier.bLife) {
          StrategicHandlePlayerTeamMercDeath(gpMercs[i].pSoldier);

          // now remove character from a squad
          RemoveCharacterFromSquads(gpMercs[i].pSoldier);
          ChangeSoldiersAssignment(gpMercs[i].pSoldier, Enum117.ASSIGNMENT_DEAD);

          AddDeadSoldierToUnLoadedSector(gpAR.ubSectorX, gpAR.ubSectorY, 0, gpMercs[i].pSoldier, RandomGridNo(), ADD_DEAD_SOLDIER_TO_SWEETSPOT);
        } else if (gpAR.ubBattleStatus == Enum120.BATTLE_SURRENDERED || gpAR.ubBattleStatus == Enum120.BATTLE_CAPTURED) {
          EnemyCapturesPlayerSoldier(gpMercs[i].pSoldier);
        } else if (gpAR.ubBattleStatus == Enum120.BATTLE_VICTORY) {
          // merc is alive, so group them at the center gridno.
          gpMercs[i].pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_CENTER;
        }
        gMercProfiles[gpMercs[i].pSoldier.ubProfile].usBattlesFought++;
      }
    }
    for (i = 0; i < gpAR.iNumMercFaces; i++) {
      if (gpAR.ubBattleStatus == Enum120.BATTLE_VICTORY && gpMercs[i].pSoldier.bLife >= OKLIFE) {
        if (gpMercs[i].pSoldier.ubGroupID != ubCurrentGroupID) {
          ubCurrentGroupID = gpMercs[i].pSoldier.ubGroupID;

          // look for NPCs to stop for, anyone is too tired to keep going, if all OK rebuild waypoints & continue movement
          // NOTE: Only the first group found will stop for NPCs, it's just too much hassle to stop them all
          PlayerGroupArrivedSafelyInSector(GetGroup(gpMercs[i].pSoldier.ubGroupID), fFirstGroup);
          fFirstGroup = false;
        }
      }
      gpMercs[i].pSoldier = <SOLDIERTYPE><unknown>null;
    }

    // End capture squence....
    if (gpAR.ubBattleStatus == Enum120.BATTLE_SURRENDERED || gpAR.ubBattleStatus == Enum120.BATTLE_CAPTURED) {
      EndCaptureSequence();
    }
  }
  // Delete all of the faces.
  for (i = 0; i < gpAR.iNumMercFaces; i++) {
    if (gpMercs[i].uiVObjectID != -1)
      DeleteVideoObjectFromIndex(gpMercs[i].uiVObjectID);
    gpMercs[i].uiVObjectID = -1;
    if (gpMercs[i].pRegion) {
      MSYS_RemoveRegion(gpMercs[i].pRegion);
      MemFree(gpMercs[i].pRegion);
      gpMercs[i].pRegion = null;
    }
  }
  // Delete all militia
  gbGreenToElitePromotions = 0;
  gbGreenToRegPromotions = 0;
  gbRegToElitePromotions = 0;
  gbMilitiaPromotions = 0;
  for (i = 0; i < MAX_ALLOWABLE_MILITIA_PER_SECTOR; i++) {
    if (gpCivs[i].pSoldier) {
      ubCurrentRank = 255;
      switch (gpCivs[i].pSoldier.ubSoldierClass) {
        case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
          ubCurrentRank = Enum126.GREEN_MILITIA;
          break;
        case Enum262.SOLDIER_CLASS_REG_MILITIA:
          ubCurrentRank = Enum126.REGULAR_MILITIA;
          break;
        case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
          ubCurrentRank = Enum126.ELITE_MILITIA;
          break;
        default:
          break;
      }
      if (fDeleteForGood && gpCivs[i].pSoldier.bLife < OKLIFE / 2) {
        AddDeadSoldierToUnLoadedSector(gpAR.ubSectorX, gpAR.ubSectorY, 0, gpCivs[i].pSoldier, RandomGridNo(), ADD_DEAD_SOLDIER_TO_SWEETSPOT);
        StrategicRemoveMilitiaFromSector(gpAR.ubSectorX, gpAR.ubSectorY, ubCurrentRank, 1);
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_NATIVE_KILLED, gpAR.ubSectorX, gpAR.ubSectorY, 0);
      } else {
        let ubPromotions: UINT8;
        // this will check for promotions and handle them for you
        if (fDeleteForGood && (gpCivs[i].pSoldier.ubMilitiaKills > 0) && (ubCurrentRank < Enum126.ELITE_MILITIA)) {
          ubPromotions = CheckOneMilitiaForPromotion(gpAR.ubSectorX, gpAR.ubSectorY, ubCurrentRank, gpCivs[i].pSoldier.ubMilitiaKills);
          if (ubPromotions) {
            if (ubPromotions == 2) {
              gbGreenToElitePromotions++;
              gbMilitiaPromotions++;
            } else if (gpCivs[i].pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_GREEN_MILITIA) {
              gbGreenToRegPromotions++;
              gbMilitiaPromotions++;
            } else if (gpCivs[i].pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_REG_MILITIA) {
              gbRegToElitePromotions++;
              gbMilitiaPromotions++;
            }
          }
        }
      }
      TacticalRemoveSoldierPointer(gpCivs[i].pSoldier, false);
      resetSoldierCell(gpCivs[i]);
    }
  }

  // Record and process all enemy deaths
  for (i = 0; i < 32; i++) {
    if (gpEnemies[i].pSoldier) {
      if (fDeleteForGood && gpEnemies[i].pSoldier.bLife < OKLIFE) {
        TrackEnemiesKilled(Enum189.ENEMY_KILLED_IN_AUTO_RESOLVE, gpEnemies[i].pSoldier.ubSoldierClass);
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_ENEMY_KILLED, gpAR.ubSectorX, gpAR.ubSectorY, 0);
        ProcessQueenCmdImplicationsOfDeath(gpEnemies[i].pSoldier);
        AddDeadSoldierToUnLoadedSector(gpAR.ubSectorX, gpAR.ubSectorY, 0, gpEnemies[i].pSoldier, RandomGridNo(), ADD_DEAD_SOLDIER_TO_SWEETSPOT);
      }
    }
  }
  // Eliminate all excess soldiers (as more than 32 can exist in the same battle.
  // Autoresolve only processes 32, so the excess is slaughtered as the player never
  // knew they existed.
  if (fDeleteForGood) {
    // Warp the game time accordingly
    if (gpAR.ubBattleStatus == Enum120.BATTLE_VICTORY) {
      // Get rid of any extra enemies that could be here.  It is possible for the number of total enemies to exceed 32, but
      // autoresolve can only process 32.  We basically cheat by eliminating the rest of them.
      EliminateAllEnemies(gpAR.ubSectorX, gpAR.ubSectorY);
    } else {
      // The enemy won, so repoll movement.
      ResetMovementForEnemyGroupsInLocation(gpAR.ubSectorX, gpAR.ubSectorY);
    }
  }
  // Physically delete the soldiers now.
  for (i = 0; i < 32; i++) {
    if (gpEnemies[i].pSoldier) {
      TacticalRemoveSoldierPointer(gpEnemies[i].pSoldier, false);
      resetSoldierCell(gpEnemies[i]);
    }
  }

  for (i = 0; i < Enum119.NUM_AR_BUTTONS; i++) {
    UnloadButtonImage(gpAR.iButtonImage[i]);
    RemoveButton(gpAR.iButton[i]);
  }
  if (fDeleteForGood) {
    // Warp the game time accordingly

    WarpGameTime(gpAR.uiTotalElapsedBattleTimeInMilliseconds / 1000, Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS);

    // Deallocate all of the global memory.
    // Everything internal to them, should have already been deleted.
    gpAR = <AUTORESOLVE_STRUCT><unknown>null;

    gpMercs = <SOLDIERCELL[]><unknown>null;

    gpCivs = <SOLDIERCELL[]><unknown>null;

    gpEnemies = <SOLDIERCELL[]><unknown>null;
  }

  // KM : Aug 09, 1999 Patch fix -- Would break future dialog while time compressing
  gTacticalStatus.ubCurrentTeam = gbPlayerNum;

  gpBattleGroup = null;

  if (gubEnemyEncounterCode == Enum164.CREATURE_ATTACK_CODE) {
    gubNumCreaturesAttackingTown = 0;
    gubSectorIDOfCreatureAttack = 0;
  }
  // VtPauseSampling();
}

function PauseButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.iButton[Enum119.PLAY_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.FAST_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.FINISH_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.fPaused = true;
  }
}

function PlayButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.iButton[Enum119.PAUSE_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.FAST_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.FINISH_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.uiTimeSlice = 1000 * gpAR.ubTimeModifierPercentage / 100;
    gpAR.fPaused = false;
  }
}

function FastButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.iButton[Enum119.PAUSE_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.PLAY_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.FINISH_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.uiTimeSlice = 4000;
    gpAR.fPaused = false;
  }
}

function FinishButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.iButton[Enum119.PAUSE_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.PLAY_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.iButton[Enum119.FAST_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.uiTimeSlice = 0xffffffff;
    gpAR.fSound = false;
    gpAR.fPaused = false;
    PlayJA2StreamingSample(Enum330.AUTORESOLVE_FINISHFX, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  }
}

function RetreatButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let i: INT32;
    for (i = 0; i < gpAR.ubMercs; i++) {
      if (!(gpMercs[i].uiFlags & (CELL_RETREATING | CELL_RETREATED))) {
        gpMercs[i].uiFlags |= CELL_RETREATING | CELL_DIRTY;
        // Gets to retreat after a total of 2 attacks.
        gpMercs[i].usNextAttack = ((1000 + gpMercs[i].usNextAttack * 2 + PreRandom(2000 - gpMercs[i].usAttack)) * 2);
        gpAR.usPlayerAttack -= gpMercs[i].usAttack;
        gpMercs[i].usAttack = 0;
      }
    }
    if (gpAR.pRobotCell) {
      // if robot is retreating, set the retreat time to be the same as the robot's controller.
      let ubRobotControllerID: UINT8;

      ubRobotControllerID = gpAR.pRobotCell.pSoldier.ubRobotRemoteHolderID;

      if (ubRobotControllerID == NOBODY) {
        gpAR.pRobotCell.uiFlags &= ~CELL_RETREATING;
        gpAR.pRobotCell.uiFlags |= CELL_DIRTY;
        gpAR.pRobotCell.usNextAttack = 0xffff;
        return;
      }
      for (i = 0; i < gpAR.ubMercs; i++) {
        if (ubRobotControllerID == gpMercs[i].pSoldier.ubID) {
          // Found the controller, make the robot's retreat time match the contollers.
          gpAR.pRobotCell.usNextAttack = gpMercs[i].usNextAttack;
          return;
        }
      }
    }
  }
}

function DetermineBandageButtonState(): void {
  let i: INT32;
  let pKit: OBJECTTYPE | null = null;
  let fFound: boolean = false;

  // Does anyone need bandaging?
  for (i = 0; i < gpAR.ubMercs; i++) {
    if (gpMercs[i].pSoldier.bBleeding && gpMercs[i].pSoldier.bLife) {
      fFound = true;
      break;
    }
  }
  if (!fFound) {
    DisableButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
    SetButtonFastHelpText(gpAR.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[11]);
    return;
  }

  // Do we have any doctors?
  fFound = false;
  for (i = 0; i < gpAR.ubMercs; i++) {
    if (gpMercs[i].pSoldier.bLife >= OKLIFE && !gpMercs[i].pSoldier.bCollapsed && gpMercs[i].pSoldier.bMedical > 0) {
      fFound = true;
    }
  }
  if (!fFound) {
    // No doctors
    DisableButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
    SetButtonFastHelpText(gpAR.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[8]);
    return;
  }

  // Do have a kit?
  pKit = FindMedicalKit();
  if (!pKit) {
    // No kits
    DisableButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
    SetButtonFastHelpText(gpAR.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[9]);
    return;
  }

  // Allow bandaging.
  EnableButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
  SetButtonFastHelpText(gpAR.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[12]);
}

function BandageButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    AutoBandageMercs();
    SetupDoneInterface();
  }
}

function DoneButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gpAR.fExitAutoResolve = true;
  }
}

function MercCellMouseMoveCallback(reg: MOUSE_REGION, reason: INT32): void {
  // Find the merc with the same region.
  let i: INT32;
  let pCell: SOLDIERCELL | null = null;
  for (i = 0; i < gpAR.ubMercs; i++) {
    if (gpMercs[i].pRegion == reg) {
      pCell = gpMercs[i];
      break;
    }
  }
  Assert(pCell);
  if (gpAR.fPendingSurrender) {
    // Can't setup retreats when pending surrender.
    pCell.uiFlags &= ~CELL_SHOWRETREATTEXT;
    pCell.uiFlags |= CELL_DIRTY;
    return;
  }
  if (reg.uiFlags & MSYS_MOUSE_IN_AREA) {
    if (!(pCell.uiFlags & CELL_SHOWRETREATTEXT))
      pCell.uiFlags |= CELL_SHOWRETREATTEXT | CELL_DIRTY;
  } else {
    if (pCell.uiFlags & CELL_SHOWRETREATTEXT) {
      pCell.uiFlags &= ~CELL_SHOWRETREATTEXT;
      pCell.uiFlags |= CELL_DIRTY;
    }
  }
}

function MercCellMouseClickCallback(reg: MOUSE_REGION, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // Find the merc with the same region.
    let i: INT32;
    let pCell: SOLDIERCELL | null = null;

    if (gpAR.fPendingSurrender) {
      // Can't setup retreats when pending surrender.
      return;
    }

    for (i = 0; i < gpAR.ubMercs; i++) {
      if (gpMercs[i].pRegion == reg) {
        pCell = gpMercs[i];
        break;
      }
    }

    if ((<SOLDIERCELL>pCell).uiFlags & (CELL_RETREATING | CELL_RETREATED)) {
      // already retreated/retreating.
      return;
    }

    Assert(pCell);

    if (pCell == gpAR.pRobotCell) {
      // robot retreats only when controller retreats
      return;
    }

    pCell.uiFlags |= CELL_RETREATING | CELL_DIRTY;
    // Gets to retreat after a total of 2 attacks.
    pCell.usNextAttack = ((1000 + pCell.usNextAttack * 5 + PreRandom(2000 - pCell.usAttack)) * 2);
    gpAR.usPlayerAttack -= pCell.usAttack;
    pCell.usAttack = 0;

    if (gpAR.pRobotCell) {
      // if controller is retreating, make the robot retreat too.
      let ubRobotControllerID: UINT8;

      ubRobotControllerID = gpAR.pRobotCell.pSoldier.ubRobotRemoteHolderID;

      if (ubRobotControllerID == NOBODY) {
        gpAR.pRobotCell.uiFlags &= ~CELL_RETREATING;
        gpAR.pRobotCell.uiFlags |= CELL_DIRTY;
        gpAR.pRobotCell.usNextAttack = 0xffff;
      } else if (ubRobotControllerID == pCell.pSoldier.ubID) {
        // Found the controller, make the robot's retreat time match the contollers.
        gpAR.pRobotCell.uiFlags |= CELL_RETREATING | CELL_DIRTY;
        gpAR.pRobotCell.usNextAttack = pCell.usNextAttack;
        gpAR.usPlayerAttack -= gpAR.pRobotCell.usAttack;
        gpAR.pRobotCell.usAttack = 0;
        return;
      }
    }
  }
}

// Determine how many players, militia, and enemies that are going at it, and use these values
// to figure out how many rows and columns we can use.  The will effect the size of the panel.
function CalculateAutoResolveInfo(): void {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let pGroup: GROUP | null;
  let pPlayer: PLAYERGROUP | null;
  Assert(gpAR.ubSectorX >= 1 && gpAR.ubSectorX <= 16);
  Assert(gpAR.ubSectorY >= 1 && gpAR.ubSectorY <= 16);

  if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
    ({ ubNumAdmins: gpAR.ubAdmins, ubNumTroops: gpAR.ubTroops, ubNumElites: gpAR.ubElites } = GetNumberOfEnemiesInSector(gpAR.ubSectorX, gpAR.ubSectorY));
    gpAR.ubEnemies = Math.min(gpAR.ubAdmins + gpAR.ubTroops + gpAR.ubElites, 32);
  } else {
    if (gfTransferTacticalOppositionToAutoResolve) {
      ({
        ubNumCreatures: gubNumCreaturesAttackingTown,
        ubNumYoungMales: gpAR.ubYMCreatures,
        ubNumYoungFemales: gpAR.ubYFCreatures,
        ubNumAdultMales: gpAR.ubAMCreatures,
        ubNumAdultFemales: gpAR.ubAFCreatures,
      } = DetermineCreatureTownCompositionBasedOnTacticalInformation(gpAR.ubYMCreatures, gpAR.ubYFCreatures, gpAR.ubAMCreatures, gpAR.ubAFCreatures));
    } else {
      ({
        ubNumYoungMales: gpAR.ubYMCreatures,
        ubNumYoungFemales: gpAR.ubYFCreatures,
        ubNumAdultMales: gpAR.ubAMCreatures,
        ubNumAdultFemales: gpAR.ubAFCreatures,
      } = DetermineCreatureTownComposition(gubNumCreaturesAttackingTown, gpAR.ubYMCreatures, gpAR.ubYFCreatures, gpAR.ubAMCreatures, gpAR.ubAFCreatures));
    }
    gpAR.ubEnemies = Math.min(gpAR.ubYMCreatures + gpAR.ubYFCreatures + gpAR.ubAMCreatures + gpAR.ubAFCreatures, 32);
  }
  gfTransferTacticalOppositionToAutoResolve = false;
  gpAR.ubCivs = CountAllMilitiaInSector(gpAR.ubSectorX, gpAR.ubSectorY);
  gpAR.ubMercs = 0;
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  pGroup = gpGroupList;
  while (pGroup) {
    if (PlayerGroupInvolvedInThisCombat(pGroup)) {
      pPlayer = pGroup.pPlayerList;
      while (pPlayer) {
        // NOTE: Must check each merc individually, e.g. Robot without controller is an uninvolved merc on an involved group!
        if (PlayerMercInvolvedInThisCombat(pPlayer.pSoldier)) {
          gpMercs[gpAR.ubMercs].pSoldier = pPlayer.pSoldier;

          //!!! CLEAR OPPCOUNT HERE.  All of these soldiers are guaranteed to not be in tactical anymore.
          // ClearOppCount( pPlayer->pSoldier );

          gpAR.ubMercs++;
          if (AM_AN_EPC(pPlayer.pSoldier)) {
            gpAR.fCaptureNotPermittedDueToEPCs = true;
          }
          if (AM_A_ROBOT(pPlayer.pSoldier)) {
            gpAR.pRobotCell = gpMercs[gpAR.ubMercs - 1];
            UpdateRobotControllerGivenRobot(gpAR.pRobotCell.pSoldier);
          }
        }
        pPlayer = pPlayer.next;
      }
    }
    pGroup = pGroup.next;
  }
  gpAR.iNumMercFaces = gpAR.ubMercs;
  gpAR.iActualMercFaces = gpAR.ubMercs;

  CalculateRowsAndColumns();
}

function ResetAutoResolveInterface(): void {
  guiPreRandomIndex = gpAR.uiPreRandomIndex;

  RemoveAutoResolveInterface(false);

  gpAR.ubBattleStatus = Enum120.BATTLE_IN_PROGRESS;

  if (!gpAR.ubCivs && !gpAR.ubMercs)
    gpAR.ubCivs = 1;

  // Make sure the number of enemy portraits is the same as needed.
  // The debug keypresses may add or remove more than one at a time.
  while (gpAR.ubElites + gpAR.ubAdmins + gpAR.ubTroops > gpAR.ubEnemies) {
    switch (PreRandom(5)) {
      case 0:
        if (gpAR.ubElites) {
          gpAR.ubElites--;
          break;
        }
      case 1:
      case 2:
        if (gpAR.ubAdmins) {
          gpAR.ubAdmins--;
          break;
        }
      case 3:
      case 4:
        if (gpAR.ubTroops) {
          gpAR.ubTroops--;
          break;
        }
    }
  }
  while (gpAR.ubElites + gpAR.ubAdmins + gpAR.ubTroops < gpAR.ubEnemies) {
    switch (PreRandom(5)) {
      case 0:
        gpAR.ubElites++;
        break;
      case 1:
      case 2:
        gpAR.ubAdmins++;
        break;
      case 3:
      case 4:
        gpAR.ubTroops++;
        break;
    }
  }

  // Do the same for the player mercs.
  while (gpAR.iNumMercFaces > gpAR.ubMercs && gpAR.iNumMercFaces > gpAR.iActualMercFaces) {
    // Removing temp mercs
    gpAR.iNumMercFaces--;
    TacticalRemoveSoldierPointer(gpMercs[gpAR.iNumMercFaces].pSoldier, false);
    gpMercs[gpAR.iNumMercFaces].pSoldier = <SOLDIERTYPE><unknown>null;
  }
  while (gpAR.iNumMercFaces < gpAR.ubMercs && gpAR.iNumMercFaces >= gpAR.iActualMercFaces) {
    CreateTempPlayerMerc();
  }

  if (gpAR.uiTimeSlice == 0xffffffff) {
    gpAR.fSound = true;
  }
  gpAR.uiTimeSlice = 1000;
  gpAR.uiTotalElapsedBattleTimeInMilliseconds = 0;
  gpAR.uiCurrTime = 0;
  gpAR.fPlayerRejectedSurrenderOffer = false;
  gpAR.fPendingSurrender = false;
  CalculateRowsAndColumns();
  CalculateSoldierCells(true);
  CreateAutoResolveInterface();
  DetermineTeamLeader(true); // friendly team
  DetermineTeamLeader(false); // enemy team
  CalculateAttackValues();
}

function CalculateRowsAndColumns(): void {
  // now that we have the number on each team, calculate the number of rows and columns to be used on
  // the player's sides.  NOTE:  Militia won't appear on the same row as mercs.
  if (!gpAR.ubMercs) {
    // 0
    gpAR.ubMercCols = gpAR.ubMercRows = 0;
  } else if (gpAR.ubMercs < 5) {
    // 1-4
    gpAR.ubMercCols = 1;
    gpAR.ubMercRows = gpAR.ubMercs;
  } else if (gpAR.ubMercs < 9 || gpAR.ubMercs == 10) {
    // 5-8, 10
    gpAR.ubMercCols = 2;
    gpAR.ubMercRows = (gpAR.ubMercs + 1) / 2;
  } else if (gpAR.ubMercs < 16) {
    // 9, 11-15
    gpAR.ubMercCols = 3;
    gpAR.ubMercRows = (gpAR.ubMercs + 2) / 3;
  } else {
    // 16-MAX_STRATEGIC_TEAM_SIZE
    gpAR.ubMercCols = 4;
    gpAR.ubMercRows = (gpAR.ubMercs + 3) / 4;
  }

  if (!gpAR.ubCivs) {
    gpAR.ubCivCols = gpAR.ubCivRows = 0;
  } else if (gpAR.ubCivs < 5) {
    // 1-4
    gpAR.ubCivCols = 1;
    gpAR.ubCivRows = gpAR.ubCivs;
  } else if (gpAR.ubCivs < 9 || gpAR.ubCivs == 10) {
    // 5-8, 10
    gpAR.ubCivCols = 2;
    gpAR.ubCivRows = (gpAR.ubCivs + 1) / 2;
  } else if (gpAR.ubCivs < 16) {
    // 9, 11-15
    gpAR.ubCivCols = 3;
    gpAR.ubCivRows = (gpAR.ubCivs + 2) / 3;
  } else {
    // 16-MAX_ALLOWABLE_MILITIA_PER_SECTOR
    gpAR.ubCivCols = 4;
    gpAR.ubCivRows = (gpAR.ubCivs + 3) / 4;
  }

  if (!gpAR.ubEnemies) {
    gpAR.ubEnemyCols = gpAR.ubEnemyRows = 0;
  } else if (gpAR.ubEnemies < 5) {
    // 1-4
    gpAR.ubEnemyCols = 1;
    gpAR.ubEnemyRows = gpAR.ubEnemies;
  } else if (gpAR.ubEnemies < 9 || gpAR.ubEnemies == 10) {
    // 5-8, 10
    gpAR.ubEnemyCols = 2;
    gpAR.ubEnemyRows = (gpAR.ubEnemies + 1) / 2;
  } else if (gpAR.ubEnemies < 16) {
    // 9, 11-15
    gpAR.ubEnemyCols = 3;
    gpAR.ubEnemyRows = (gpAR.ubEnemies + 2) / 3;
  } else {
    // 16-32
    gpAR.ubEnemyCols = 4;
    gpAR.ubEnemyRows = (gpAR.ubEnemies + 3) / 4;
  }

  // Now, that we have the number of mercs, militia, and enemies, it is possible that there
  // may be some conflicts.  Our goal is to make the window as small as possible.  Bumping up
  // the number of columns to 5 or rows to 10 will force one or both axes to go full screen.  If we
  // have high numbers of both, then we will have to.

  // Step one:  equalize the number of columns for both the mercs and civs.
  if (gpAR.ubMercs && gpAR.ubCivs && gpAR.ubMercCols != gpAR.ubCivCols) {
    if (gpAR.ubMercCols < gpAR.ubCivCols) {
      gpAR.ubMercCols = gpAR.ubCivCols;
      gpAR.ubMercRows = (gpAR.ubMercs + gpAR.ubMercCols - 1) / gpAR.ubMercCols;
    } else {
      gpAR.ubCivCols = gpAR.ubMercCols;
      gpAR.ubCivRows = (gpAR.ubCivs + gpAR.ubCivCols - 1) / gpAR.ubCivCols;
    }
  }
  // If we have both mercs and militia, we must make sure that the height to width ratio is never higher than
  // a factor of two.
  if (gpAR.ubMercs && gpAR.ubCivs && gpAR.ubMercRows + gpAR.ubCivRows > 4) {
    if (gpAR.ubMercCols * 2 < gpAR.ubMercRows + gpAR.ubCivRows) {
      gpAR.ubMercCols++;
      gpAR.ubMercRows = (gpAR.ubMercs + gpAR.ubMercCols - 1) / gpAR.ubMercCols;
      gpAR.ubCivCols++;
      gpAR.ubCivRows = (gpAR.ubCivs + gpAR.ubCivCols - 1) / gpAR.ubCivCols;
    }
  }

  if (gpAR.ubMercRows + gpAR.ubCivRows > 9) {
    if (gpAR.ubMercCols < 5) {
      // bump it up
      gpAR.ubMercCols++;
      gpAR.ubMercRows = (gpAR.ubMercs + gpAR.ubMercCols - 1) / gpAR.ubMercCols;
    }
    if (gpAR.ubCivCols < 5) {
      // match it up with the mercs
      gpAR.ubCivCols = gpAR.ubMercCols;
      gpAR.ubCivRows = (gpAR.ubCivs + gpAR.ubCivCols - 1) / gpAR.ubCivCols;
    }
  }

  if (gpAR.ubMercCols + gpAR.ubEnemyCols == 9)
    gpAR.sWidth = 640;
  else
    gpAR.sWidth = 146 + 55 * (Math.max(Math.max(gpAR.ubMercCols, gpAR.ubCivCols), 2) + Math.max(gpAR.ubEnemyCols, 2));

  gpAR.sCenterStartX = 323 - gpAR.sWidth / 2 + Math.max(Math.max(gpAR.ubMercCols, 2), Math.max(gpAR.ubCivCols, 2)) * 55;

  // Anywhere from 48*3 to 48*10
  gpAR.sHeight = 48 * Math.max(3, Math.max(gpAR.ubMercRows + gpAR.ubCivRows, gpAR.ubEnemyRows));
  // Make it an even multiple of 40 (rounding up).
  gpAR.sHeight += 39;
  gpAR.sHeight /= 40;
  gpAR.sHeight *= 40;

  // Here is a extremely bitchy case.  The formulae throughout this module work for most cases.
  // However, when combining mercs and civs, the column must be the same.  However, we retract that
  // in cases where there are less mercs than available to fill up *most* of the designated space.
  if (gpAR.ubMercs && gpAR.ubCivs) {
    if (gpAR.ubMercRows * gpAR.ubMercCols > gpAR.ubMercs + gpAR.ubMercRows)
      gpAR.ubMercCols--;
    if (gpAR.ubCivRows * gpAR.ubCivCols > gpAR.ubCivs + gpAR.ubCivRows)
      gpAR.ubCivCols--;
  }
}

function HandleAutoResolveInput(): void {
  let InputEvent: InputAtom = createInputAtom();
  let fResetAutoResolve: boolean = false;
  while (DequeueEvent(InputEvent)) {
    if (InputEvent.usEvent == KEY_DOWN || InputEvent.usEvent == KEY_REPEAT) {
      switch (InputEvent.usParam) {
        case SPACE:
          gpAR.fPaused = !gpAR.fPaused;
          if (gpAR.fPaused) {
            ButtonList[gpAR.iButton[Enum119.PAUSE_BUTTON]].uiFlags |= BUTTON_CLICKED_ON;
            ButtonList[gpAR.iButton[Enum119.PLAY_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
            ButtonList[gpAR.iButton[Enum119.FAST_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
            ButtonList[gpAR.iButton[Enum119.FINISH_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
          } else {
            ButtonList[gpAR.iButton[Enum119.PAUSE_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
            ButtonList[gpAR.iButton[Enum119.PLAY_BUTTON]].uiFlags |= BUTTON_CLICKED_ON;
          }
          break;
        case 'x'.charCodeAt(0):
          if (_KeyDown(ALT)) {
            HandleShortCutExitState();
          }
          break;
      }
    }
  }
  if (fResetAutoResolve) {
    ResetAutoResolveInterface();
  }
}

function RenderSoldierCellHealth(pCell: SOLDIERCELL): void {
  let cnt: INT32;
  let cntStart: INT32;
  let xp: INT32;
  let yp: INT32;
  let pStr: string /* Pointer<UINT16> */;
  let str: string /* UINT16[20] */;
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;
  let uiSrcPitchBYTES: UINT32;
  let uiDestPitchBYTES: UINT32;
  let usColor: UINT16;

  SetFont(SMALLCOMPFONT());
  // Restore the background before drawing text.
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  pSrcBuf = LockVideoSurface(gpAR.iInterfaceBuffer, addressof(uiSrcPitchBYTES));
  xp = pCell.xp + 2;
  yp = pCell.yp + 32;
  Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, xp, yp, xp - gpAR.Rect.iLeft, yp - gpAR.Rect.iTop, 46, 10);
  UnLockVideoSurface(gpAR.iInterfaceBuffer);
  UnLockVideoSurface(FRAME_BUFFER);

  if (pCell.pSoldier.bLife) {
    if (pCell.pSoldier.bLife == pCell.pSoldier.bLifeMax) {
      cntStart = 4;
    } else {
      cntStart = 0;
    }
    for (cnt = cntStart; cnt < 6; cnt++) {
      if (pCell.pSoldier.bLife < bHealthStrRanges[cnt]) {
        break;
      }
    }
    switch (cnt) {
      case 0: // DYING
      case 1: // CRITICAL
        usColor = FONT_RED;
        break;
      case 2: // WOUNDED
      case 3: // POOR
        usColor = FONT_YELLOW;
        break;
      default: // REST
        usColor = FONT_GRAY1;
        break;
    }
    if (cnt > 3 && pCell.pSoldier.bLife != pCell.pSoldier.bLifeMax) {
      // Merc has taken damage, even though his life if good.
      usColor = FONT_YELLOW;
    }
    if (pCell.pSoldier.bLife == pCell.pSoldier.bLifeMax)
      usColor = FONT_GRAY1;
    pStr = zHealthStr[cnt];
  } else {
    str = pCell.pSoldier.name;
    pStr = str.toUpperCase();
    usColor = FONT_BLACK;
  }

  // Draw the retreating text, if applicable
  if (pCell.uiFlags & CELL_RETREATED && gpAR.ubBattleStatus != Enum120.BATTLE_VICTORY) {
    usColor = FONT_LTGREEN;
    str = gpStrategicString[Enum365.STR_AR_MERC_RETREATED];
    pStr = str;
  } else if (pCell.uiFlags & CELL_RETREATING && gpAR.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS) {
    if (pCell.pSoldier.bLife >= OKLIFE) {
      // Retreating is shared with the status string.  Alternate between the
      // two every 450 milliseconds
      if (GetJA2Clock() % 900 < 450) {
        // override the health string with the retreating string.
        usColor = FONT_LTRED;
        str = gpStrategicString[Enum365.STR_AR_MERC_RETREATING];
        pStr = str;
      }
    }
  } else if (pCell.uiFlags & CELL_SHOWRETREATTEXT && gpAR.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS) {
    if (pCell.pSoldier.bLife >= OKLIFE) {
      SetFontForeground(FONT_YELLOW);
      str = gpStrategicString[Enum365.STR_AR_MERC_RETREAT];
      xp = pCell.xp + 25 - StringPixLength(pStr, SMALLCOMPFONT()) / 2;
      yp = pCell.yp + 12;
      mprintf(xp, yp, str);
    }
  }
  SetFontForeground(usColor);
  xp = pCell.xp + 25 - StringPixLength(pStr, SMALLCOMPFONT()) / 2;
  yp = pCell.yp + 33;
  mprintf(xp, yp, pStr);
}

function GetUnusedMercProfileID(): UINT8 {
  let ubRandom: UINT8 = 0;
  let i: INT32;
  let fUnique: boolean = false;
  while (!fUnique) {
    ubRandom = PreRandom(40);
    for (i = 0; i < 19; i++) {
      fUnique = true;
      if (Menptr[i].ubProfile == ubRandom) {
        fUnique = false;
        break;
      }
    }
  }
  return ubRandom;
}

/* static */ let CreateTempPlayerMerc__iSoldierCount: INT32 = 0;
function CreateTempPlayerMerc(): void {
  let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let ubID: UINT8;

  // Init the merc create structure with basic information
  MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
  MercCreateStruct.ubProfile = GetUnusedMercProfileID();
  MercCreateStruct.sSectorX = gpAR.ubSectorX;
  MercCreateStruct.sSectorY = gpAR.ubSectorY;
  MercCreateStruct.bSectorZ = 0;
  MercCreateStruct.fPlayerMerc = true;
  MercCreateStruct.fCopyProfileItemsOver = true;

  // Create the player soldier

  gpMercs[gpAR.iNumMercFaces].pSoldier = <SOLDIERTYPE>TacticalCreateSoldier(MercCreateStruct, addressof(ubID));
  if (gpMercs[gpAR.iNumMercFaces].pSoldier) {
    gpAR.iNumMercFaces++;
  }
}

function DetermineTeamLeader(fFriendlyTeam: boolean): void {
  let i: INT32;
  let pBestLeaderCell: SOLDIERCELL | null = null;
  // For each team (civs and players count as same team), find the merc with the best
  // leadership ability.
  if (fFriendlyTeam) {
    gpAR.ubPlayerLeadership = 0;
    for (i = 0; i < gpAR.ubMercs; i++) {
      if (gpMercs[i].pSoldier.bLeadership > gpAR.ubPlayerLeadership) {
        gpAR.ubPlayerLeadership = gpMercs[i].pSoldier.bLeadership;
        pBestLeaderCell = gpMercs[i];
      }
    }
    for (i = 0; i < gpAR.ubCivs; i++) {
      if (gpCivs[i].pSoldier.bLeadership > gpAR.ubPlayerLeadership) {
        gpAR.ubPlayerLeadership = gpCivs[i].pSoldier.bLeadership;
        pBestLeaderCell = gpCivs[i];
      }
    }

    if (pBestLeaderCell) {
      // Assign the best leader the honour of team leader.
      pBestLeaderCell.uiFlags |= CELL_TEAMLEADER;
    }
    return;
  }
  // ENEMY TEAM
  gpAR.ubEnemyLeadership = 0;
  for (i = 0; i < gpAR.ubEnemies; i++) {
    if (gpEnemies[i].pSoldier.bLeadership > gpAR.ubEnemyLeadership) {
      gpAR.ubEnemyLeadership = gpEnemies[i].pSoldier.bLeadership;
      pBestLeaderCell = gpEnemies[i];
    }
  }
  if (pBestLeaderCell) {
    // Assign the best enemy leader the honour of team leader
    pBestLeaderCell.uiFlags |= CELL_TEAMLEADER;
  }
}

function ResetNextAttackCounter(pCell: SOLDIERCELL): void {
  pCell.usNextAttack = Math.min(1000 - pCell.usAttack, 800);
  pCell.usNextAttack = (1000 + pCell.usNextAttack * 5 + PreRandom(2000 - pCell.usAttack));
  if (pCell.uiFlags & CELL_CREATURE) {
    pCell.usNextAttack = pCell.usNextAttack * 8 / 10;
  }
}

function CalculateAttackValues(): void {
  let i: INT32;
  let pCell: SOLDIERCELL;
  let pSoldier: SOLDIERTYPE;
  let usBonus: UINT16;
  let usBestAttack: UINT16 = 0xffff;
  let usBreathStrengthPercentage: UINT16;
  // INT16 sOutnumberBonus = 0;
  let sMaxBonus: INT16 = 0;
  // PLAYER TEAM
  gpAR.usPlayerAttack = 0;
  gpAR.usPlayerDefence = 0;

  // if( gpAR->ubEnemies )
  //{
  //	//bonus equals 20 if good guys outnumber bad guys 2 to 1.
  //	sMaxBonus = 20;
  //	sOutnumberBonus = (INT16)(gpAR->ubMercs + gpAR->ubCivs) * sMaxBonus / gpAR->ubEnemies - sMaxBonus;
  //	sOutnumberBonus = (INT16)min( sOutnumberBonus, max( sMaxBonus, 0 ) );
  //}

  for (i = 0; i < gpAR.ubMercs; i++) {
    pCell = gpMercs[i];
    pSoldier = pCell.pSoldier;
    if (!pSoldier.bLife)
      continue;
    pCell.usAttack = pSoldier.bStrength + pSoldier.bDexterity + pSoldier.bWisdom + pSoldier.bMarksmanship + pSoldier.bMorale;
    // Give player controlled mercs a significant bonus to compensate for lack of control
    // as the player would typically do much better in tactical.
    if (pCell.usAttack < 1000) {
      // A player with 500 attack will be augmented to 625
      // A player with 600 attack will be augmented to 700
      pCell.usAttack = (pCell.usAttack + (1000 - pCell.usAttack) / 4);
    }
    usBreathStrengthPercentage = 100 - (100 - pCell.pSoldier.bBreathMax) / 3;
    pCell.usAttack = pCell.usAttack * usBreathStrengthPercentage / 100;
    pCell.usDefence = pSoldier.bAgility + pSoldier.bWisdom + pSoldier.bBreathMax + pSoldier.bMedical + pSoldier.bMorale;
    // 100 team leadership adds a bonus of 10%,
    usBonus = 100 + gpAR.ubPlayerLeadership / 10; // + sOutnumberBonus;

    // bExpLevel adds a bonus of 7% per level after 2, level 1 soldiers get a 7% decrease
    // usBonus += 7 * (pSoldier->bExpLevel-2);
    usBonus += gpAR.ubPlayerDefenceAdvantage;
    pCell.usAttack = pCell.usAttack * usBonus / 100;
    pCell.usDefence = pCell.usDefence * usBonus / 100;

    if (pCell.uiFlags & CELL_EPC) {
      // strengthen the defense (seeing the mercs will keep them safe).
      pCell.usAttack = 0;
      pCell.usDefence = 1000;
    }

    pCell.usAttack = Math.min(pCell.usAttack, 1000);
    pCell.usDefence = Math.min(pCell.usDefence, 1000);

    gpAR.usPlayerAttack += pCell.usAttack;
    gpAR.usPlayerDefence += pCell.usDefence;
    ResetNextAttackCounter(pCell);
    if (i > 8) {
      // Too many mercs, delay attack entry of extra mercs.
      pCell.usNextAttack += ((i - 8) * 2000);
    }
    if (pCell.usNextAttack < usBestAttack)
      usBestAttack = pCell.usNextAttack;
  }
  // CIVS
  for (i = 0; i < gpAR.ubCivs; i++) {
    pCell = gpCivs[i];
    pSoldier = pCell.pSoldier;
    pCell.usAttack = pSoldier.bStrength + pSoldier.bDexterity + pSoldier.bWisdom + pSoldier.bMarksmanship + pSoldier.bMorale;
    pCell.usAttack = pCell.usAttack * pSoldier.bBreath / 100;
    pCell.usDefence = pSoldier.bAgility + pSoldier.bWisdom + pSoldier.bBreathMax + pSoldier.bMedical + pSoldier.bMorale;
    // 100 team leadership adds a bonus of 10%
    usBonus = 100 + gpAR.ubPlayerLeadership / 10; // + sOutnumberBonus;
    // bExpLevel adds a bonus of 7% per level after 2, level 1 soldiers get a 7% decrease
    // usBonus += 7 * (pSoldier->bExpLevel-2);
    usBonus += gpAR.ubPlayerDefenceAdvantage;
    pCell.usAttack = pCell.usAttack * usBonus / 100;
    pCell.usDefence = pCell.usDefence * usBonus / 100;

    pCell.usAttack = Math.min(pCell.usAttack, 1000);
    pCell.usDefence = Math.min(pCell.usDefence, 1000);

    gpAR.usPlayerAttack += pCell.usAttack;
    gpAR.usPlayerDefence += pCell.usDefence;
    ResetNextAttackCounter(pCell);
    if (i > 6) {
      // Too many militia, delay attack entry of extra mercs.
      pCell.usNextAttack += ((i - 4) * 2000);
    }
    if (pCell.usNextAttack < usBestAttack)
      usBestAttack = pCell.usNextAttack;
  }
  // ENEMIES
  gpAR.usEnemyAttack = 0;
  gpAR.usEnemyDefence = 0;
  // if( gpAR->ubMercs + gpAR->ubCivs )
  //{
  //	//bonus equals 20 if good guys outnumber bad guys 2 to 1.
  //	sMaxBonus = 20;
  //	sOutnumberBonus = (INT16)gpAR->ubEnemies * sMaxBonus / (gpAR->ubMercs + gpAR->ubCivs) - sMaxBonus;
  //	sOutnumberBonus = (INT16)min( sOutnumberBonus, max( sMaxBonus, 0 ) );
  //}

  for (i = 0; i < gpAR.ubEnemies; i++) {
    pCell = gpEnemies[i];
    pSoldier = pCell.pSoldier;
    pCell.usAttack = pSoldier.bStrength + pSoldier.bDexterity + pSoldier.bWisdom + pSoldier.bMarksmanship + pSoldier.bMorale;
    pCell.usAttack = pCell.usAttack * pSoldier.bBreath / 100;
    pCell.usDefence = pSoldier.bAgility + pSoldier.bWisdom + pSoldier.bBreathMax + pSoldier.bMedical + pSoldier.bMorale;
    // 100 team leadership adds a bonus of 10%
    usBonus = 100 + gpAR.ubPlayerLeadership / 10; // + sOutnumberBonus;
    // bExpLevel adds a bonus of 7% per level after 2, level 1 soldiers get a 7% decrease
    // usBonus += 7 * (pSoldier->bExpLevel-2);
    usBonus += gpAR.ubEnemyDefenceAdvantage;
    pCell.usAttack = pCell.usAttack * usBonus / 100;
    pCell.usDefence = pCell.usDefence * usBonus / 100;

    pCell.usAttack = Math.min(pCell.usAttack, 1000);
    pCell.usDefence = Math.min(pCell.usDefence, 1000);

    gpAR.usEnemyAttack += pCell.usAttack;
    gpAR.usEnemyDefence += pCell.usDefence;
    ResetNextAttackCounter(pCell);

    if (i > 4 && !(pCell.uiFlags & CELL_CREATURE)) {
      // Too many enemies, delay attack entry of extra mercs.
      pCell.usNextAttack += ((i - 4) * 1000);
    }

    if (pCell.usNextAttack < usBestAttack)
      usBestAttack = pCell.usNextAttack;
  }
  // Now, because we are starting a new battle, we want to get the ball rolling a bit earlier.  So,
  // we will take the usBestAttack value and subtract 60% of it from everybody's next attack.
  usBestAttack = usBestAttack * 60 / 100;
  for (i = 0; i < gpAR.ubMercs; i++)
    gpMercs[i].usNextAttack -= usBestAttack;
  for (i = 0; i < gpAR.ubCivs; i++)
    gpCivs[i].usNextAttack -= usBestAttack;
  for (i = 0; i < gpAR.ubEnemies; i++)
    gpEnemies[i].usNextAttack -= usBestAttack;
}

function DrawDebugText(pCell: SOLDIERCELL): void {
  let xp: INT32;
  let yp: INT32;
  if (!gpAR.fDebugInfo)
    return;
  SetFont(SMALLCOMPFONT());
  SetFontForeground(FONT_WHITE);
  xp = pCell.xp + 4;
  yp = pCell.yp + 4;
  if (pCell.uiFlags & CELL_TEAMLEADER) {
    // debug str
    mprintf(xp, yp, "LEADER");
    yp += 9;
  }
  mprintf(xp, yp, "AT: %d", pCell.usAttack);
  yp += 9;
  mprintf(xp, yp, "DF: %d", pCell.usDefence);
  yp += 9;

  xp = pCell.xp;
  yp = pCell.yp - 4;
  SetFont(LARGEFONT1());
  SetFontShadow(FONT_NEARBLACK);
  if (pCell.uiFlags & CELL_FIREDATTARGET) {
    SetFontForeground(FONT_YELLOW);
    mprintf(xp, yp, "FIRE");
    pCell.uiFlags &= ~CELL_FIREDATTARGET;
    yp += 13;
  }
  if (pCell.uiFlags & CELL_DODGEDATTACK) {
    SetFontForeground(FONT_BLUE);
    mprintf(xp, yp, "MISS");
    pCell.uiFlags &= ~CELL_DODGEDATTACK;
    yp += 13;
  }
  if (pCell.uiFlags & CELL_HITBYATTACKER) {
    SetFontForeground(FONT_RED);
    mprintf(xp, yp, "HIT");
    pCell.uiFlags &= ~CELL_HITBYATTACKER;
    yp += 13;
  }
}

function ChooseTarget(pAttacker: SOLDIERCELL): SOLDIERCELL {
  let iAvailableTargets: INT32;
  let index: INT32;
  let iRandom: INT32 = -1;
  let pTarget: SOLDIERCELL;
  let usSavedDefence: UINT16;
  // Determine what team we are attacking
  if (pAttacker.uiFlags & (CELL_ENEMY | CELL_CREATURE)) {
    // enemy team attacking a player
    iAvailableTargets = gpAR.ubMercs + gpAR.ubCivs;
    index = 0;
    usSavedDefence = gpAR.usPlayerDefence;
    while (iAvailableTargets) {
      pTarget = (index < gpAR.ubMercs) ? gpMercs[index] : gpCivs[index - gpAR.ubMercs];
      if (!pTarget.pSoldier.bLife || pTarget.uiFlags & CELL_RETREATED) {
        index++;
        iAvailableTargets--;
        continue;
      }
      iRandom = PreRandom(gpAR.usPlayerDefence);
      gpAR.usPlayerDefence -= pTarget.usDefence;
      if (iRandom < pTarget.usDefence) {
        gpAR.usPlayerDefence = usSavedDefence;
        return pTarget;
      }
      index++;
      iAvailableTargets--;
    }
    if (!IsBattleOver()) {
      AssertMsg(0, FormatString("***Please send PRIOR save and screenshot of this message***  iAvailableTargets %d, index %d, iRandom %d, defence %d. ", iAvailableTargets, index, iRandom, gpAR.usPlayerDefence));
    }
  } else {
    // player team attacking an enemy
    iAvailableTargets = gpAR.ubEnemies;
    index = 0;
    usSavedDefence = gpAR.usEnemyDefence;
    while (iAvailableTargets) {
      pTarget = gpEnemies[index];
      if (!pTarget.pSoldier.bLife) {
        index++;
        iAvailableTargets--;
        continue;
      }
      iRandom = PreRandom(gpAR.usEnemyDefence);
      gpAR.usEnemyDefence -= pTarget.usDefence;
      if (iRandom < pTarget.usDefence) {
        gpAR.usEnemyDefence = usSavedDefence;
        return pTarget;
      }
      index++;
      iAvailableTargets--;
    }
  }
  AssertMsg(false, "Error in ChooseTarget logic for choosing enemy target.");
  return <SOLDIERCELL><unknown>null;
}

function FireAShot(pAttacker: SOLDIERCELL): boolean {
  let pItem: OBJECTTYPE;
  let pSoldier: SOLDIERTYPE;
  let i: INT32;

  pSoldier = pAttacker.pSoldier;

  if (pAttacker.uiFlags & CELL_MALECREATURE) {
    PlayAutoResolveSample(Enum330.ACR_SPIT, RATE_11025, 50, 1, MIDDLEPAN);
    pAttacker.bWeaponSlot = Enum261.SECONDHANDPOS;
    return true;
  }
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    pItem = pSoldier.inv[i];

    if (Item[pItem.usItem].usItemClass == IC_GUN) {
      pAttacker.bWeaponSlot = i;
      if (gpAR.fUnlimitedAmmo) {
        PlayAutoResolveSample(Weapon[pItem.usItem].sSound, RATE_11025, 50, 1, MIDDLEPAN);
        return true;
      }
      if (!pItem.ubGunShotsLeft) {
        AutoReload(pSoldier);
        if (pItem.ubGunShotsLeft && Weapon[pItem.usItem].sLocknLoadSound) {
          PlayAutoResolveSample(Weapon[pItem.usItem].sLocknLoadSound, RATE_11025, 50, 1, MIDDLEPAN);
        }
      }
      if (pItem.ubGunShotsLeft) {
        PlayAutoResolveSample(Weapon[pItem.usItem].sSound, RATE_11025, 50, 1, MIDDLEPAN);
        if (pAttacker.uiFlags & CELL_MERC) {
          gMercProfiles[pAttacker.pSoldier.ubProfile].usShotsFired++;
          // MARKSMANSHIP GAIN: Attacker fires a shot

          StatChange(pAttacker.pSoldier, MARKAMT, 3, 0);
        }
        pItem.ubGunShotsLeft--;
        return true;
      }
    }
  }
  pAttacker.bWeaponSlot = -1;
  return false;
}

function AttackerHasKnife(pAttacker: SOLDIERCELL): boolean {
  let i: INT32;
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    if (Item[pAttacker.pSoldier.inv[i].usItem].usItemClass == IC_BLADE) {
      pAttacker.bWeaponSlot = i;
      return true;
    }
  }
  pAttacker.bWeaponSlot = -1;
  return false;
}

function TargetHasLoadedGun(pSoldier: SOLDIERTYPE): boolean {
  let i: INT32;
  let pItem: OBJECTTYPE;
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    pItem = pSoldier.inv[i];
    if (Item[pItem.usItem].usItemClass == IC_GUN) {
      if (gpAR.fUnlimitedAmmo) {
        return true;
      }
      if (pItem.ubGunShotsLeft) {
        return true;
      }
    }
  }
  return false;
}

function AttackTarget(pAttacker: SOLDIERCELL, pTarget: SOLDIERCELL): void {
  let usAttack: UINT16;
  let usDefence: UINT16;
  let ubImpact: UINT8;
  let ubLocation: UINT8;
  let ubAccuracy: UINT8;
  let iRandom: INT32;
  let iImpact: INT32;
  let iNewLife: INT32;
  let fMelee: boolean = false;
  let fKnife: boolean = false;
  let fClaw: boolean = false;
  let bAttackIndex: INT8 = -1;

  pAttacker.uiFlags |= CELL_FIREDATTARGET | CELL_DIRTY;
  if (pAttacker.usAttack < 950)
    usAttack = (pAttacker.usAttack + PreRandom(1000 - pAttacker.usAttack));
  else
    usAttack = (950 + PreRandom(50));
  if (pTarget.uiFlags & CELL_RETREATING && !(pAttacker.uiFlags & CELL_FEMALECREATURE)) {
    // Attacking a retreating merc is harder.  Modify the attack value to 70% of it's value.
    // This allows retreaters to have a better chance of escaping.
    usAttack = usAttack * 7 / 10;
  }
  if (pTarget.usDefence < 950)
    usDefence = (pTarget.usDefence + PreRandom(1000 - pTarget.usDefence));
  else
    usDefence = (950 + PreRandom(50));
  if (pAttacker.uiFlags & CELL_FEMALECREATURE) {
    pAttacker.bWeaponSlot = Enum261.HANDPOS;
    fMelee = true;
    fClaw = true;
  } else if (!FireAShot(pAttacker)) {
    // Maybe look for a weapon, such as a knife or grenade?
    fMelee = true;
    fKnife = AttackerHasKnife(pAttacker);
    if (TargetHasLoadedGun(pTarget.pSoldier)) {
      // Penalty to attack with melee weapons against target with loaded gun.
      if (!(pAttacker.uiFlags & CELL_CREATURE)) {
        // except for creatures
        if (fKnife)
          usAttack = usAttack * 6 / 10;
        else
          usAttack = usAttack * 4 / 10;
      }
    }
  }
  // Set up a random delay for the hit or miss.
  if (!fMelee) {
    if (!pTarget.usNextHit[0]) {
      bAttackIndex = 0;
    } else if (!pTarget.usNextHit[1]) {
      bAttackIndex = 1;
    } else if (!pTarget.usNextHit[2]) {
      bAttackIndex = 2;
    }
    if (bAttackIndex != -1) {
      pTarget.usNextHit[bAttackIndex] = (50 + PreRandom(400));
      pTarget.pAttacker[bAttackIndex] = pAttacker;
    }
  }
  if (usAttack < usDefence) {
    if (pTarget.pSoldier.bLife >= OKLIFE || !PreRandom(5)) {
      // Attacker misses -- use up a round of ammo.  If target is unconcious, then 80% chance of hitting.
      pTarget.uiFlags |= CELL_DODGEDATTACK | CELL_DIRTY;
      if (fMelee) {
        if (fKnife)
          PlayAutoResolveSample(Enum330.MISS_KNIFE, RATE_11025, 50, 1, MIDDLEPAN);
        else if (fClaw) {
          if (Chance(50)) {
            PlayAutoResolveSample(Enum330.ACR_SWIPE, RATE_11025, 50, 1, MIDDLEPAN);
          } else {
            PlayAutoResolveSample(Enum330.ACR_LUNGE, RATE_11025, 50, 1, MIDDLEPAN);
          }
        } else
          PlayAutoResolveSample(Enum330.SWOOSH_1 + PreRandom(6), RATE_11025, 50, 1, MIDDLEPAN);
        if (pTarget.uiFlags & CELL_MERC)
          // AGILITY GAIN: Target "dodged" an attack
          StatChange(pTarget.pSoldier, AGILAMT, 5, 0);
      }
      return;
    }
  }
  // Attacker hits
  if (!fMelee) {
    ubImpact = Weapon[pAttacker.pSoldier.inv[pAttacker.bWeaponSlot].usItem].ubImpact;
    iRandom = PreRandom(100);
    if (iRandom < 15)
      ubLocation = AIM_SHOT_HEAD;
    else if (iRandom < 30)
      ubLocation = AIM_SHOT_LEGS;
    else
      ubLocation = AIM_SHOT_TORSO;
    ubAccuracy = ((usAttack - usDefence + PreRandom(usDefence - pTarget.usDefence)) / 10);
    iImpact = BulletImpact(pAttacker.pSoldier, pTarget.pSoldier, ubLocation, ubImpact, ubAccuracy, null);

    if (bAttackIndex == -1) {
      // tack damage on to end of last hit
      pTarget.usHitDamage[2] += iImpact;
    } else {
      pTarget.usHitDamage[bAttackIndex] = iImpact;
    }
  } else {
    let pItem: OBJECTTYPE;
    let tempItem: OBJECTTYPE = createObjectType();
    PlayAutoResolveSample((Enum330.BULLET_IMPACT_1 + PreRandom(3)), RATE_11025, 50, 1, MIDDLEPAN);
    if (!pTarget.pSoldier.bLife) {
      // Soldier already dead (can't kill him again!)
      return;
    }

    ubAccuracy = ((usAttack - usDefence + PreRandom(usDefence - pTarget.usDefence)) / 10);

    // Determine attacking weapon.
    pAttacker.pSoldier.usAttackingWeapon = 0;
    if (pAttacker.bWeaponSlot != -1) {
      pItem = pAttacker.pSoldier.inv[pAttacker.bWeaponSlot];
      if (Item[pItem.usItem].usItemClass & IC_WEAPON)
        pAttacker.pSoldier.usAttackingWeapon = pAttacker.pSoldier.inv[pAttacker.bWeaponSlot].usItem;
    }

    if (pAttacker.bWeaponSlot != Enum261.HANDPOS) {
      // switch items
      copyObjectType(tempItem, pAttacker.pSoldier.inv[Enum261.HANDPOS]);
      copyObjectType(pAttacker.pSoldier.inv[Enum261.HANDPOS], pAttacker.pSoldier.inv[pAttacker.bWeaponSlot]);
      iImpact = HTHImpact(pAttacker.pSoldier, pTarget.pSoldier, ubAccuracy, (fKnife || fClaw));
      copyObjectType(pAttacker.pSoldier.inv[pAttacker.bWeaponSlot], pAttacker.pSoldier.inv[Enum261.HANDPOS]);
      copyObjectType(pAttacker.pSoldier.inv[Enum261.HANDPOS], tempItem);
    } else {
      iImpact = HTHImpact(pAttacker.pSoldier, pTarget.pSoldier, ubAccuracy, (fKnife || fClaw));
    }

    iNewLife = pTarget.pSoldier.bLife - iImpact;

    if (pAttacker.uiFlags & CELL_MERC) {
      // Attacker is a player, so increment the number of shots that hit.
      gMercProfiles[pAttacker.pSoldier.ubProfile].usShotsHit++;
      // MARKSMANSHIP GAIN: Attacker's shot hits
      StatChange(pAttacker.pSoldier, MARKAMT, 6, 0); // in addition to 3 for taking a shot
    }
    if (pTarget.uiFlags & CELL_MERC) {
      // Target is a player, so increment the times he has been wounded.
      gMercProfiles[pTarget.pSoldier.ubProfile].usTimesWounded++;
      // EXPERIENCE GAIN: Took some damage
      StatChange(pTarget.pSoldier, EXPERAMT, (5 * (iImpact / 10)), 0);
    }
    if (pTarget.pSoldier.bLife >= CONSCIOUSNESS || pTarget.uiFlags & CELL_CREATURE) {
      if (gpAR.fSound)
        DoMercBattleSound(pTarget.pSoldier, (Enum259.BATTLE_SOUND_HIT1 + PreRandom(2)));
    }
    if (!(pTarget.uiFlags & CELL_CREATURE) && iNewLife < OKLIFE && pTarget.pSoldier.bLife >= OKLIFE) {
      // the hit caused the merc to fall.  Play the falling sound
      PlayAutoResolveSample(Enum330.FALL_1, RATE_11025, 50, 1, MIDDLEPAN);
      pTarget.uiFlags &= ~CELL_RETREATING;
    }
    if (iNewLife <= 0) {
      // soldier has been killed
      if (pAttacker.uiFlags & CELL_MERC) {
        // Player killed the enemy soldier -- update his stats as well as any assisters.
        gMercProfiles[pAttacker.pSoldier.ubProfile].usKills++;
        gStrategicStatus.usPlayerKills++;
      } else if (pAttacker.uiFlags & CELL_MILITIA) {
        pAttacker.pSoldier.ubMilitiaKills += 2;
      }
      if (pTarget.uiFlags & CELL_MERC && gpAR.fSound) {
        PlayAutoResolveSample(Enum330.DOORCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        PlayAutoResolveSample(Enum330.HEADCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      }
    }
    // Adjust the soldiers stats based on the damage.
    pTarget.pSoldier.bLife = Math.max(iNewLife, 0);
    if (pTarget.uiFlags & CELL_MERC && gpAR.pRobotCell) {
      UpdateRobotControllerGivenRobot(gpAR.pRobotCell.pSoldier);
    }
    if (fKnife || fClaw) {
      if (pTarget.pSoldier.bLifeMax - pTarget.pSoldier.bBleeding - iImpact >= pTarget.pSoldier.bLife)
        pTarget.pSoldier.bBleeding += iImpact;
      else
        pTarget.pSoldier.bBleeding = (pTarget.pSoldier.bLifeMax - pTarget.pSoldier.bLife);
    }
    if (!pTarget.pSoldier.bLife) {
      gpAR.fRenderAutoResolve = true;
          if (pTarget.uiFlags & CELL_MERC) {
        gpAR.usPlayerAttack -= pTarget.usAttack;
        gpAR.usPlayerDefence -= pTarget.usDefence;
        gpAR.ubAliveMercs--;
        pTarget.usAttack = 0;
        pTarget.usDefence = 0;
      } else if (pTarget.uiFlags & CELL_MILITIA) {
        gpAR.usPlayerAttack -= pTarget.usAttack;
        gpAR.usPlayerDefence -= pTarget.usDefence;
        gpAR.ubAliveCivs--;
        pTarget.usAttack = 0;
        pTarget.usDefence = 0;
      } else if (pTarget.uiFlags & (CELL_ENEMY | CELL_CREATURE)) {
        gpAR.usEnemyAttack -= pTarget.usAttack;
        gpAR.usEnemyDefence -= pTarget.usDefence;
        gpAR.ubAliveEnemies--;
        pTarget.usAttack = 0;
        pTarget.usDefence = 0;
      }
    }
    pTarget.uiFlags |= CELL_HITBYATTACKER | CELL_DIRTY;
  }
}

function TargetHitCallback(pTarget: SOLDIERCELL, index: INT32): void {
  let iNewLife: INT32;
  let pAttacker: SOLDIERCELL;
  if (!pTarget.pSoldier.bLife) {
    // Soldier already dead (can't kill him again!)
    return;
  }
  pAttacker = pTarget.pAttacker[index];

  // creatures get damage reduction bonuses
  switch (pTarget.pSoldier.ubBodyType) {
    case Enum194.LARVAE_MONSTER:
    case Enum194.INFANT_MONSTER:
      break;
    case Enum194.YAF_MONSTER:
    case Enum194.YAM_MONSTER:
      pTarget.usHitDamage[index] = (pTarget.usHitDamage[index] + 2) / 4;
      break;
    case Enum194.ADULTFEMALEMONSTER:
    case Enum194.AM_MONSTER:
      pTarget.usHitDamage[index] = (pTarget.usHitDamage[index] + 3) / 6;
      break;
    case Enum194.QUEENMONSTER:
      pTarget.usHitDamage[index] = (pTarget.usHitDamage[index] + 4) / 8;
      break;
  }

  iNewLife = pTarget.pSoldier.bLife - pTarget.usHitDamage[index];
  if (!pTarget.usHitDamage[index]) {
    // bullet missed -- play a ricochet sound.
    if (pTarget.uiFlags & CELL_MERC)
      // AGILITY GAIN: Target "dodged" an attack
      StatChange(pTarget.pSoldier, AGILAMT, 5, 0);
    PlayAutoResolveSample(Enum330.MISS_1 + PreRandom(8), RATE_11025, 50, 1, MIDDLEPAN);
    return;
  }

  if (pAttacker.uiFlags & CELL_MERC) {
    // Attacker is a player, so increment the number of shots that hit.
    gMercProfiles[pAttacker.pSoldier.ubProfile].usShotsHit++;
    // MARKSMANSHIP GAIN: Attacker's shot hits
    StatChange(pAttacker.pSoldier, MARKAMT, 6, 0); // in addition to 3 for taking a shot
  }
  if (pTarget.uiFlags & CELL_MERC && pTarget.usHitDamage[index]) {
    // Target is a player, so increment the times he has been wounded.
    gMercProfiles[pTarget.pSoldier.ubProfile].usTimesWounded++;
    // EXPERIENCE GAIN: Took some damage
    StatChange(pTarget.pSoldier, EXPERAMT, (5 * (pTarget.usHitDamage[index] / 10)), 0);
  }

  // bullet hit -- play an impact sound and a merc hit sound
  PlayAutoResolveSample((Enum330.BULLET_IMPACT_1 + PreRandom(3)), RATE_11025, 50, 1, MIDDLEPAN);

  if (pTarget.pSoldier.bLife >= CONSCIOUSNESS) {
    if (gpAR.fSound)
      DoMercBattleSound(pTarget.pSoldier, (Enum259.BATTLE_SOUND_HIT1 + PreRandom(2)));
  }
  if (iNewLife < OKLIFE && pTarget.pSoldier.bLife >= OKLIFE) {
    // the hit caused the merc to fall.  Play the falling sound
    PlayAutoResolveSample(Enum330.FALL_1, RATE_11025, 50, 1, MIDDLEPAN);
    pTarget.uiFlags &= ~CELL_RETREATING;
  }
  if (iNewLife <= 0) {
    // soldier has been killed
    if (pTarget.pAttacker[index].uiFlags & CELL_PLAYER) {
      // Player killed the enemy soldier -- update his stats as well as any assisters.
      let pKiller: SOLDIERCELL | null;
      let pAssister1: SOLDIERCELL | null;
      let pAssister2: SOLDIERCELL | null;
      pKiller = pTarget.pAttacker[index];
      pAssister1 = pTarget.pAttacker[index < 2 ? index + 1 : 0];
      pAssister2 = pTarget.pAttacker[index > 0 ? index - 1 : 2];
      if (pKiller == pAssister1)
        pAssister1 = null;
      if (pKiller == pAssister2)
        pAssister2 = null;
      if (pAssister1 == pAssister2)
        pAssister2 = null;
      if (pKiller) {
        if (pKiller.uiFlags & CELL_MERC) {
          gMercProfiles[pKiller.pSoldier.ubProfile].usKills++;
          gStrategicStatus.usPlayerKills++;
          // EXPERIENCE CLASS GAIN:  Earned a kill
          StatChange(pKiller.pSoldier, EXPERAMT, (10 * pTarget.pSoldier.bLevel), 0);
          HandleMoraleEvent(pKiller.pSoldier, Enum234.MORALE_KILLED_ENEMY, gpAR.ubSectorX, gpAR.ubSectorY, 0);
        } else if (pKiller.uiFlags & CELL_MILITIA)
          pKiller.pSoldier.ubMilitiaKills += 2;
      }
      if (pAssister1) {
        if (pAssister1.uiFlags & CELL_MERC) {
          gMercProfiles[pAssister1.pSoldier.ubProfile].usAssists++;
          // EXPERIENCE CLASS GAIN:  Earned an assist
          StatChange(pAssister1.pSoldier, EXPERAMT, (5 * pTarget.pSoldier.bLevel), 0);
        } else if (pAssister1.uiFlags & CELL_MILITIA)
          pAssister1.pSoldier.ubMilitiaKills++;
      } else if (pAssister2) {
        if (pAssister2.uiFlags & CELL_MERC) {
          gMercProfiles[pAssister2.pSoldier.ubProfile].usAssists++;
          // EXPERIENCE CLASS GAIN:  Earned an assist
          StatChange(pAssister2.pSoldier, EXPERAMT, (5 * pTarget.pSoldier.bLevel), 0);
        } else if (pAssister2.uiFlags & CELL_MILITIA)
          pAssister2.pSoldier.ubMilitiaKills++;
      }
    }
    if (pTarget.uiFlags & CELL_MERC && gpAR.fSound) {
      PlayAutoResolveSample(Enum330.DOORCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      PlayAutoResolveSample(Enum330.HEADCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    }
    if (iNewLife < -60 && !(pTarget.uiFlags & CELL_CREATURE)) {
      // High damage death
      if (gpAR.fSound) {
        if (PreRandom(3))
          PlayAutoResolveSample(Enum330.BODY_SPLAT_1, RATE_11025, 50, 1, MIDDLEPAN);
        else
          PlayAutoResolveSample(Enum330.HEADSPLAT_1, RATE_11025, 50, 1, MIDDLEPAN);
      }
    } else {
      // Normal death
      if (gpAR.fSound) {
        DoMercBattleSound(pTarget.pSoldier, Enum259.BATTLE_SOUND_DIE1);
      }
    }
  }
  // Adjust the soldiers stats based on the damage.
  pTarget.pSoldier.bLife = Math.max(iNewLife, 0);
  if (pTarget.uiFlags & CELL_MERC && gpAR.pRobotCell) {
    UpdateRobotControllerGivenRobot(gpAR.pRobotCell.pSoldier);
  }

  if (pTarget.pSoldier.bLifeMax - pTarget.pSoldier.bBleeding - pTarget.usHitDamage[index] >= pTarget.pSoldier.bLife)
    pTarget.pSoldier.bBleeding += pTarget.usHitDamage[index];
  else
    pTarget.pSoldier.bBleeding = (pTarget.pSoldier.bLifeMax - pTarget.pSoldier.bLife);
  if (!pTarget.pSoldier.bLife) {
    gpAR.fRenderAutoResolve = true;
    if (pTarget.uiFlags & CELL_MERC) {
      gpAR.usPlayerAttack -= pTarget.usAttack;
      gpAR.usPlayerDefence -= pTarget.usDefence;
      gpAR.ubAliveMercs--;
      pTarget.usAttack = 0;
      pTarget.usDefence = 0;
    } else if (pTarget.uiFlags & CELL_MILITIA) {
      gpAR.usPlayerAttack -= pTarget.usAttack;
      gpAR.usPlayerDefence -= pTarget.usDefence;
      gpAR.ubAliveCivs--;
      pTarget.usAttack = 0;
      pTarget.usDefence = 0;
    } else if (pTarget.uiFlags & (CELL_ENEMY | CELL_CREATURE)) {
      gpAR.usEnemyAttack -= pTarget.usAttack;
      gpAR.usEnemyDefence -= pTarget.usDefence;
      gpAR.ubAliveEnemies--;
      pTarget.usAttack = 0;
      pTarget.usDefence = 0;
    }
  }
  pTarget.uiFlags |= CELL_HITBYATTACKER | CELL_DIRTY;
}

function Delay(uiMilliseconds: UINT32): void {
  let iTime: INT32;
  iTime = GetJA2Clock();
  while (GetJA2Clock() < iTime + uiMilliseconds)
    ;
}

function IsBattleOver(): boolean {
  let i: INT32;
  let iNumInvolvedMercs: INT32 = 0;
  let iNumMercsRetreated: INT32 = 0;
  let fOnlyEPCsLeft: boolean = true;
  if (gpAR.ubBattleStatus != Enum120.BATTLE_IN_PROGRESS)
    return true;
  for (i = 0; i < gpAR.ubMercs; i++) {
    if (!(gpMercs[i].uiFlags & CELL_RETREATED) && gpMercs[i].pSoldier.bLife) {
      if (!(gpMercs[i].uiFlags & CELL_EPC)) {
        fOnlyEPCsLeft = false;
        iNumInvolvedMercs++;
      }
    }
    if (gpMercs[i].uiFlags & CELL_RETREATED) {
      iNumMercsRetreated++;
    }
  }
  if (gpAR.pRobotCell) {
    // Do special robot checks
    let pRobot: SOLDIERTYPE;
    pRobot = gpAR.pRobotCell.pSoldier;
    if (pRobot.ubRobotRemoteHolderID == NOBODY) {
      // Robot can't fight anymore.
      gpAR.usPlayerAttack -= gpAR.pRobotCell.usAttack;
      gpAR.pRobotCell.usAttack = 0;
      if (iNumInvolvedMercs == 1 && !gpAR.ubAliveCivs) {
        // Robot is the only one left in battle, so instantly kill him.
        DoMercBattleSound(pRobot, Enum259.BATTLE_SOUND_DIE1);
        pRobot.bLife = 0;
        gpAR.ubAliveMercs--;
        iNumInvolvedMercs = 0;
      }
    }
  }
  if (!gpAR.ubAliveCivs && !iNumInvolvedMercs && iNumMercsRetreated) {
    // RETREATED
    gpAR.ubBattleStatus = Enum120.BATTLE_RETREAT;

    // wake everyone up
    WakeUpAllMercsInSectorUnderAttack();

    RetreatAllInvolvedPlayerGroups();
  } else if (!gpAR.ubAliveCivs && !iNumInvolvedMercs) {
    // DEFEAT
    if (fOnlyEPCsLeft) {
      // Kill the EPCs.
      for (i = 0; i < gpAR.ubMercs; i++) {
        if (gpMercs[i].uiFlags & CELL_EPC) {
          DoMercBattleSound(gpMercs[i].pSoldier, Enum259.BATTLE_SOUND_DIE1);
          gpMercs[i].pSoldier.bLife = 0;
          gpAR.ubAliveMercs--;
        }
      }
    }
    for (i = 0; i < gpAR.ubEnemies; i++) {
      if (gpEnemies[i].pSoldier.bLife) {
        if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
          DoMercBattleSound(gpEnemies[i].pSoldier, Enum259.BATTLE_SOUND_LAUGH1);
        } else {
          PlayJA2Sample(Enum330.ACR_EATFLESH, RATE_11025, 50, 1, MIDDLEPAN);
        }
        break;
      }
    }
    gpAR.ubBattleStatus = Enum120.BATTLE_DEFEAT;
  } else if (!gpAR.ubAliveEnemies) {
    // VICTORY
    gpAR.ubBattleStatus = Enum120.BATTLE_VICTORY;
  } else {
    return false;
  }
  SetupDoneInterface();
  return true;
}

//#define TESTSURRENDER

function AttemptPlayerCapture(): boolean {
  let i: INT32;
  let fConcious: boolean;
  let iConciousEnemies: INT32;

  // Only attempt capture if day is less than four.
  if (GetWorldDay() < STARTDAY_ALLOW_PLAYER_CAPTURE_FOR_RESCUE && !gpAR.fAllowCapture) {
    return false;
  }
  if (gpAR.fPlayerRejectedSurrenderOffer) {
    return false;
  }
  if (gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE) {
    return false;
  }
  if (gpAR.fCaptureNotPermittedDueToEPCs) {
    // EPCs make things much more difficult when considering capture.  Simply don't allow it.
    return false;
  }
  // Only attempt capture of mercs if there are 2 or 3 of them alive
  if (gpAR.ubAliveCivs || gpAR.ubAliveMercs < 2 || gpAR.ubAliveMercs > 3) {
    return false;
  }
  // if the number of alive enemies doesn't double the number of alive mercs, don't offer surrender.
  if (gpAR.ubAliveEnemies < gpAR.ubAliveMercs * 2) {
    return false;
  }
  // make sure that these enemies are actually concious!
  iConciousEnemies = 0;
  for (i = 0; i < gpAR.ubEnemies; i++) {
    if (gpEnemies[i].pSoldier.bLife >= OKLIFE) {
      iConciousEnemies++;
    }
  }
  if (iConciousEnemies < gpAR.ubAliveMercs * 2) {
    return false;
  }

  // So far, the conditions are right.  Now, we will determine if the the remaining players are
  // wounded and/or unconcious.  If any are concious, we will prompt for a surrender, otherwise,
  // it is automatic.
  fConcious = false;
  for (i = 0; i < gpAR.ubMercs; i++) {
    // if any of the 2 or 3 mercs has more than 60% life, then return.
    if (gpMercs[i].uiFlags & CELL_ROBOT) {
      return false;
    }
    if (gpMercs[i].pSoldier.bLife * 100 > gpMercs[i].pSoldier.bLifeMax * 60) {
      return false;
    }
    if (gpMercs[i].pSoldier.bLife >= OKLIFE) {
      fConcious = true;
    }
  }
  if (fConcious) {
    if (PreRandom(100) < 2) {
      SetupSurrenderInterface();
    }
  } else if (PreRandom(100) < 25) {
    BeginCaptureSquence();

    gpAR.ubBattleStatus = Enum120.BATTLE_CAPTURED;
    gpAR.fRenderAutoResolve = true;
    SetupDoneInterface();
  }
  return true;
}

function SetupDoneInterface(): void {
  let i: INT32;
  gpAR.fRenderAutoResolve = true;

  HideButton(gpAR.iButton[Enum119.PAUSE_BUTTON]);
  HideButton(gpAR.iButton[Enum119.PLAY_BUTTON]);
  HideButton(gpAR.iButton[Enum119.FAST_BUTTON]);
  HideButton(gpAR.iButton[Enum119.FINISH_BUTTON]);
  HideButton(gpAR.iButton[Enum119.RETREAT_BUTTON]);
  HideButton(gpAR.iButton[Enum119.YES_BUTTON]);
  HideButton(gpAR.iButton[Enum119.NO_BUTTON]);
  if (gpAR.ubBattleStatus == Enum120.BATTLE_VICTORY && gpAR.ubAliveMercs) {
    ShowButton(gpAR.iButton[Enum119.DONEWIN_BUTTON]);
    ShowButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
  } else {
    ShowButton(gpAR.iButton[Enum119.DONELOSE_BUTTON]);
  }
  DetermineBandageButtonState();
  for (i = 0; i < gpAR.ubMercs; i++) {
    // So they can't retreat!
    MSYS_DisableRegion(<MOUSE_REGION>gpMercs[i].pRegion);
  }
}

function SetupSurrenderInterface(): void {
  HideButton(gpAR.iButton[Enum119.PAUSE_BUTTON]);
  HideButton(gpAR.iButton[Enum119.PLAY_BUTTON]);
  HideButton(gpAR.iButton[Enum119.FAST_BUTTON]);
  HideButton(gpAR.iButton[Enum119.FINISH_BUTTON]);
  HideButton(gpAR.iButton[Enum119.RETREAT_BUTTON]);
  HideButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
  HideButton(gpAR.iButton[Enum119.DONEWIN_BUTTON]);
  HideButton(gpAR.iButton[Enum119.DONELOSE_BUTTON]);
  ShowButton(gpAR.iButton[Enum119.YES_BUTTON]);
  ShowButton(gpAR.iButton[Enum119.NO_BUTTON]);
  gpAR.fRenderAutoResolve = true;
  gpAR.fPendingSurrender = true;
}

function HideSurrenderInterface(): void {
  HideButton(gpAR.iButton[Enum119.PAUSE_BUTTON]);
  HideButton(gpAR.iButton[Enum119.PLAY_BUTTON]);
  HideButton(gpAR.iButton[Enum119.FAST_BUTTON]);
  HideButton(gpAR.iButton[Enum119.FINISH_BUTTON]);
  HideButton(gpAR.iButton[Enum119.RETREAT_BUTTON]);
  HideButton(gpAR.iButton[Enum119.BANDAGE_BUTTON]);
  HideButton(gpAR.iButton[Enum119.DONEWIN_BUTTON]);
  HideButton(gpAR.iButton[Enum119.DONELOSE_BUTTON]);
  HideButton(gpAR.iButton[Enum119.YES_BUTTON]);
  HideButton(gpAR.iButton[Enum119.NO_BUTTON]);
  gpAR.fPendingSurrender = false;
  gpAR.fRenderAutoResolve = true;
}

function AcceptSurrenderCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    BeginCaptureSquence();

    gpAR.ubBattleStatus = Enum120.BATTLE_SURRENDERED;
    gpAR.fPendingSurrender = false;
    SetupDoneInterface();
  }
}

function RejectSurrenderCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gpAR.fPlayerRejectedSurrenderOffer = true;
    HideSurrenderInterface();
  }
}

/* static */ let ProcessBattleFrame__iTimeSlice: INT32 = 0;
/* static */ let ProcessBattleFrame__fContinue: boolean = false;
/* static */ let ProcessBattleFrame__uiSlice: UINT32 = 0;
/* static */ let ProcessBattleFrame__iTotal: INT32 = 0;
/* static */ let ProcessBattleFrame__iMercs: INT32 = 0;
/* static */ let ProcessBattleFrame__iCivs: INT32 = 0;
/* static */ let ProcessBattleFrame__iEnemies: INT32 = 0;
/* static */ let ProcessBattleFrame__iMercsLeft: INT32 = 0;
/* static */ let ProcessBattleFrame__iCivsLeft: INT32 = 0;
/* static */ let ProcessBattleFrame__iEnemiesLeft: INT32 = 0;
function ProcessBattleFrame(): void {
  let iRandom: INT32;
  let i: INT32;
  let pAttacker: SOLDIERCELL;
  let pTarget: SOLDIERCELL;
  let uiDiff: UINT32;
  let found: boolean = false;
  let iTime: INT32;
  let iAttacksThisFrame: INT32;

  pAttacker = <SOLDIERCELL><unknown>null;
  iAttacksThisFrame = 0;

  if (ProcessBattleFrame__fContinue) {
    gpAR.uiCurrTime = GetJA2Clock();
    ProcessBattleFrame__fContinue = false;
    goto("CONTINUE_BATTLE");
  }
  // determine how much real-time has passed since the last frame
  if (gpAR.uiCurrTime) {
    gpAR.uiPrevTime = gpAR.uiCurrTime;
    gpAR.uiCurrTime = GetJA2Clock();
  } else {
    gpAR.uiCurrTime = GetJA2Clock();
    return;
  }
  if (gpAR.fPaused)
    return;

  uiDiff = gpAR.uiCurrTime - gpAR.uiPrevTime;
  if (gpAR.uiTimeSlice < 0xffffffff) {
    ProcessBattleFrame__iTimeSlice = uiDiff * gpAR.uiTimeSlice / 1000;
  } else {
    // largest positive signed value
    ProcessBattleFrame__iTimeSlice = 0x7fffffff;
  }

  while (ProcessBattleFrame__iTimeSlice > 0) {
    ProcessBattleFrame__uiSlice = Math.min(ProcessBattleFrame__iTimeSlice, 1000);
    if (gpAR.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS)
      gpAR.uiTotalElapsedBattleTimeInMilliseconds += ProcessBattleFrame__uiSlice;

    // Now process each of the players
    ProcessBattleFrame__iTotal = gpAR.ubMercs + gpAR.ubCivs + gpAR.ubEnemies + 1;
    ProcessBattleFrame__iMercs = ProcessBattleFrame__iMercsLeft = gpAR.ubMercs;
    ProcessBattleFrame__iCivs = ProcessBattleFrame__iCivsLeft = gpAR.ubCivs;
    ProcessBattleFrame__iEnemies = ProcessBattleFrame__iEnemiesLeft = gpAR.ubEnemies;
    for (i = 0; i < gpAR.ubMercs; i++)
      gpMercs[i].uiFlags &= ~CELL_PROCESSED;
    for (i = 0; i < gpAR.ubCivs; i++)
      gpCivs[i].uiFlags &= ~CELL_PROCESSED;
    for (i = 0; i < gpAR.ubEnemies; i++)
      gpEnemies[i].uiFlags &= ~CELL_PROCESSED;
    while (--ProcessBattleFrame__iTotal) {
      let cnt: INT32;
      if (ProcessBattleFrame__iTimeSlice != 0x7fffffff && GetJA2Clock() > gpAR.uiCurrTime + 17 || !gpAR.fInstantFinish && iAttacksThisFrame > (gpAR.ubMercs + gpAR.ubCivs + gpAR.ubEnemies) / 4) {
        // We have spent too much time in here.  In order to maintain 60FPS, we will
        // leave now, which will allow for updating of the graphics (and mouse cursor),
        // and all of the necessary locals are saved via static variables.  It'll check
        // the fContinue flag, and goto the CONTINUE_BATTLE label the next time this function
        // is called.
        ProcessBattleFrame__fContinue = true;
        return;
      }
    CONTINUE_BATTLE:
      if (IsBattleOver() || gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE && AttemptPlayerCapture())
        return;

      iRandom = PreRandom(ProcessBattleFrame__iTotal);
      found = false;
      if (ProcessBattleFrame__iMercs && iRandom < ProcessBattleFrame__iMercsLeft) {
        ProcessBattleFrame__iMercsLeft--;
        while (!found) {
          iRandom = PreRandom(ProcessBattleFrame__iMercs);
          pAttacker = gpMercs[iRandom];
          if (!(pAttacker.uiFlags & CELL_PROCESSED)) {
            pAttacker.uiFlags |= CELL_PROCESSED;
            found = true;
          }
        }
      } else if (ProcessBattleFrame__iCivs && iRandom < ProcessBattleFrame__iMercsLeft + ProcessBattleFrame__iCivsLeft) {
        ProcessBattleFrame__iCivsLeft--;
        while (!found) {
          iRandom = PreRandom(ProcessBattleFrame__iCivs);
          pAttacker = gpCivs[iRandom];
          if (!(pAttacker.uiFlags & CELL_PROCESSED)) {
            pAttacker.uiFlags |= CELL_PROCESSED;
            found = true;
          }
        }
      } else if (ProcessBattleFrame__iEnemies && ProcessBattleFrame__iEnemiesLeft) {
        ProcessBattleFrame__iEnemiesLeft--;
        while (!found) {
          iRandom = PreRandom(ProcessBattleFrame__iEnemies);
          pAttacker = gpEnemies[iRandom];
          if (!(pAttacker.uiFlags & CELL_PROCESSED)) {
            pAttacker.uiFlags |= CELL_PROCESSED;
            found = true;
          }
        }
      } else
        AssertMsg(0, "Logic error in ProcessBattleFrame()");
      // Apply damage and play miss/hit sounds if delay between firing and hit has expired.
      if (!(pAttacker.uiFlags & CELL_RETREATED)) {
        for (cnt = 0; cnt < 3; cnt++) {
          // Check if any incoming bullets have hit the target.
          if (pAttacker.usNextHit[cnt]) {
            iTime = pAttacker.usNextHit[cnt];
            iTime -= ProcessBattleFrame__uiSlice;
            if (iTime >= 0) {
              // Bullet still on route.
              pAttacker.usNextHit[cnt] = iTime;
            } else {
              // Bullet is going to hit/miss.
              TargetHitCallback(pAttacker, cnt);
              pAttacker.usNextHit[cnt] = 0;
            }
          }
        }
      }
      if (pAttacker.pSoldier.bLife < OKLIFE || pAttacker.uiFlags & CELL_RETREATED) {
        if (!(pAttacker.uiFlags & CELL_CREATURE) || !pAttacker.pSoldier.bLife)
          continue; // can't attack if you are unconcious or not around (Or a live creature)
      }
      iTime = pAttacker.usNextAttack;
      iTime -= ProcessBattleFrame__uiSlice;
      if (iTime > 0) {
        pAttacker.usNextAttack = iTime;
        continue;
      } else {
        if (pAttacker.uiFlags & CELL_RETREATING) {
          // The merc has successfully retreated.  Remove the stats, and continue on.
          if (pAttacker == gpAR.pRobotCell) {
            if (gpAR.pRobotCell.pSoldier.ubRobotRemoteHolderID == NOBODY) {
              gpAR.pRobotCell.uiFlags &= ~CELL_RETREATING;
              gpAR.pRobotCell.uiFlags |= CELL_DIRTY;
              gpAR.pRobotCell.usNextAttack = 0xffff;
              continue;
            }
          }
          gpAR.usPlayerDefence -= pAttacker.usDefence;
          pAttacker.usDefence = 0;
          pAttacker.uiFlags |= CELL_RETREATED;
          continue;
        }
        if (pAttacker.usAttack) {
          pTarget = ChooseTarget(pAttacker);
          if (pAttacker.uiFlags & CELL_CREATURE && PreRandom(100) < 7)
            PlayAutoResolveSample(Enum330.ACR_SMELL_THREAT + PreRandom(2), RATE_11025, 50, 1, MIDDLEPAN);
          else
            AttackTarget(pAttacker, pTarget);
          ResetNextAttackCounter(pAttacker);
          pAttacker.usNextAttack += iTime; // tack on the remainder
          iAttacksThisFrame++;
        }
      }
    }
    if (ProcessBattleFrame__iTimeSlice != 0x7fffffff) //|| !gpAR->fInstantFinish )
    {
      ProcessBattleFrame__iTimeSlice -= 1000;
    }
  }
}

export function IsAutoResolveActive(): boolean {
  // is the autoresolve up or not?
  if (gpAR) {
    return true;
  }
  return false;
}

export function GetAutoResolveSectorID(): UINT8 {
  if (gpAR) {
    return SECTOR(gpAR.ubSectorX, gpAR.ubSectorY);
  }
  return 0xff;
}

// Returns TRUE if a battle is happening or sector is loaded
export function GetCurrentBattleSectorXYZ(): { sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16 } {
  let sSectorX: INT16;
  let sSectorY: INT16;
  let sSectorZ: INT16;

  if (gpAR) {
    sSectorX = gpAR.ubSectorX;
    sSectorY = gpAR.ubSectorY;
    sSectorZ = 0;
    return { sSectorX, sSectorY, sSectorZ };
  } else if (gfPreBattleInterfaceActive) {
    sSectorX = gubPBSectorX;
    sSectorY = gubPBSectorY;
    sSectorZ = gubPBSectorZ;
    return { sSectorX, sSectorY, sSectorZ };
  } else if (gfWorldLoaded) {
    sSectorX = gWorldSectorX;
    sSectorY = gWorldSectorY;
    sSectorZ = gbWorldSectorZ;
    return { sSectorX, sSectorY, sSectorZ };
  } else {
    sSectorX = 0;
    sSectorY = 0;
    sSectorZ = -1;
    return { sSectorX, sSectorY, sSectorZ };
  }
}

// Returns TRUE if a battle is happening ONLY
export function GetCurrentBattleSectorXYZAndReturnTRUEIfThereIsABattle(psSectorX: Pointer<INT16>, psSectorY: Pointer<INT16>, psSectorZ: Pointer<INT16>): boolean {
  if (gpAR) {
    psSectorX.value = gpAR.ubSectorX;
    psSectorY.value = gpAR.ubSectorY;
    psSectorZ.value = 0;
    return true;
  } else if (gfPreBattleInterfaceActive) {
    psSectorX.value = gubPBSectorX;
    psSectorY.value = gubPBSectorY;
    psSectorZ.value = gubPBSectorZ;
    return true;
  } else if (gfWorldLoaded) {
    psSectorX.value = gWorldSectorX;
    psSectorY.value = gWorldSectorY;
    psSectorZ.value = gbWorldSectorZ;
    if (gTacticalStatus.fEnemyInSector) {
      return true;
    }
    return false;
  } else {
    psSectorX.value = 0;
    psSectorY.value = 0;
    psSectorZ.value = -1;
    return false;
  }
}

function AutoBandageFinishedCallback(ubResult: UINT8): void {
  SetupDoneInterface();
}

}
