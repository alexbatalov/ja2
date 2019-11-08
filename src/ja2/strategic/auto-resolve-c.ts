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
  pSoldier: Pointer<SOLDIERTYPE>;
  pRegion: Pointer<MOUSE_REGION>; // only used for player mercs.
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
  pAttacker: Pointer<SOLDIERCELL>[] /* [3] */;
  uiFlashTime: UINT32;
  bWeaponSlot: INT8;
}

interface AUTORESOLVE_STRUCT {
  pRobotCell: Pointer<SOLDIERCELL>;

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
  ubBattleStatus: boolean;
  fUnlimitedAmmo: boolean;
  fSound: boolean;
  ubPlayerDefenceAdvantage: boolean;
  ubEnemyDefenceAdvantage: boolean;
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
let gpAR: Pointer<AUTORESOLVE_STRUCT> = null;
let gpMercs: Pointer<SOLDIERCELL> = null;
let gpCivs: Pointer<SOLDIERCELL> = null;
let gpEnemies: Pointer<SOLDIERCELL> = null;

// Simple wrappers for autoresolve sounds that are played.
function PlayAutoResolveSample(usNum: UINT32, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): void {
  if (gpAR.value.fSound) {
    PlayJA2Sample(usNum, usRate, ubVolume, ubLoops, uiPan);
  }
}

function PlayAutoResolveSampleFromFile(szFileName: string /* STR8 */, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): void {
  if (gpAR.value.fSound) {
    PlayJA2SampleFromFile(szFileName, usRate, ubVolume, ubLoops, uiPan);
  }
}

function EliminateAllMercs(): void {
  let pAttacker: Pointer<SOLDIERCELL> = null;
  let i: INT32;
  let iNum: INT32 = 0;
  if (gpAR) {
    for (i = 0; i < gpAR.value.ubEnemies; i++) {
      if (gpEnemies[i].pSoldier.value.bLife) {
        pAttacker = addressof(gpEnemies[i]);
        break;
      }
    }
    if (pAttacker) {
      for (i = 0; i < gpAR.value.ubMercs; i++) {
        if (gpMercs[i].pSoldier.value.bLife) {
          iNum++;
          gpMercs[i].pSoldier.value.bLife = 1;
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
    for (i = 0; i < gpAR.value.ubMercs; i++) {
      gpMercs[i].pSoldier.value.bLife = 0;
    }
    gpAR.value.ubAliveMercs = 0;
    for (i = 0; i < gpAR.value.ubCivs; i++) {
      gpCivs[i].pSoldier.value.bLife = 0;
    }
    gpAR.value.ubAliveCivs = 0;
  }
}

export function EliminateAllEnemies(ubSectorX: UINT8, ubSectorY: UINT8): void {
  let pGroup: Pointer<GROUP>;
  let pDeleteGroup: Pointer<GROUP>;
  let pSector: Pointer<SECTORINFO>;
  let i: INT32;
  let ubNumEnemies: UINT8[] /* [NUM_ENEMY_RANKS] */;
  let ubRankIndex: UINT8;

  // Clear any possible battle locator
  gfBlitBattleSectorLocator = false;

  pGroup = gpGroupList;
  pSector = addressof(SectorInfo[SECTOR(ubSectorX, ubSectorY)]);

  // if we're doing this from the Pre-Battle interface, gpAR is NULL, and RemoveAutoResolveInterface(0 won't happen, so
  // we must process the enemies killed right here & give out loyalty bonuses as if the battle had been fought & won
  if (!gpAR) {
    GetNumberOfEnemiesInSector(ubSectorX, ubSectorY, addressof(ubNumEnemies[0]), addressof(ubNumEnemies[1]), addressof(ubNumEnemies[2]));

    for (ubRankIndex = 0; ubRankIndex < Enum188.NUM_ENEMY_RANKS; ubRankIndex++) {
      for (i = 0; i < ubNumEnemies[ubRankIndex]; i++) {
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_ENEMY_KILLED, ubSectorX, ubSectorY, 0);
        TrackEnemiesKilled(Enum189.ENEMY_KILLED_IN_AUTO_RESOLVE, RankIndexToSoldierClass(ubRankIndex));
      }
    }

    HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_WON, ubSectorX, ubSectorY, 0);
  }

  if (!gpAR || gpAR.value.ubBattleStatus != Enum120.BATTLE_IN_PROGRESS) {
    // Remove the defend force here.
    pSector.value.ubNumTroops = 0;
    pSector.value.ubNumElites = 0;
    pSector.value.ubNumAdmins = 0;
    pSector.value.ubNumCreatures = 0;
    pSector.value.bLastKnownEnemies = 0;
    // Remove the mobile forces here, but only if battle is over.
    while (pGroup) {
      if (!pGroup.value.fPlayer && pGroup.value.ubSectorX == ubSectorX && pGroup.value.ubSectorY == ubSectorY) {
        ClearPreviousAIGroupAssignment(pGroup);
        pDeleteGroup = pGroup;
        pGroup = pGroup.value.next;
        if (gpBattleGroup == pDeleteGroup)
          gpBattleGroup = null;
        RemovePGroup(pDeleteGroup);
      } else
        pGroup = pGroup.value.next;
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
    for (i = 0; i < gpAR.value.ubEnemies; i++) {
      gpEnemies[i].pSoldier.value.bLife = 0;
    }
    gpAR.value.ubAliveEnemies = 0;
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

  gpAR.value.fShowInterface = true;

  SrcRect.iLeft = gpAR.value.Rect.iLeft;
  SrcRect.iTop = gpAR.value.Rect.iTop;
  SrcRect.iRight = gpAR.value.Rect.iRight;
  SrcRect.iBottom = gpAR.value.Rect.iBottom;

  iWidth = SrcRect.iRight - SrcRect.iLeft + 1;
  iHeight = SrcRect.iBottom - SrcRect.iTop + 1;

  uiTimeRange = 1000;
  iPercentage = 0;
  uiStartTime = GetJA2Clock();

  sStartLeft = 59;
  sStartTop = 69;
  sEndLeft = SrcRect.iLeft + gpAR.value.sWidth / 2;
  sEndTop = SrcRect.iTop + gpAR.value.sHeight / 2;

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

    BltStretchVideoSurface(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 0, addressof(SrcRect), addressof(DstRect));
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
  gpAR = MemAlloc(sizeof(AUTORESOLVE_STRUCT));
  Assert(gpAR);
  memset(gpAR, 0, sizeof(AUTORESOLVE_STRUCT));
  // Mercs -- 20 max
  gpMercs = MemAlloc(sizeof(SOLDIERCELL) * 20);
  Assert(gpMercs);
  memset(gpMercs, 0, sizeof(SOLDIERCELL) * 20);
  // Militia -- MAX_ALLOWABLE_MILITIA_PER_SECTOR max
  gpCivs = MemAlloc(sizeof(SOLDIERCELL) * MAX_ALLOWABLE_MILITIA_PER_SECTOR);
  Assert(gpCivs);
  memset(gpCivs, 0, sizeof(SOLDIERCELL) * MAX_ALLOWABLE_MILITIA_PER_SECTOR);
  // Enemies -- 32 max
  gpEnemies = MemAlloc(sizeof(SOLDIERCELL) * 32);
  Assert(gpEnemies);
  memset(gpEnemies, 0, sizeof(SOLDIERCELL) * 32);

  // Set up autoresolve
  gpAR.value.fEnteringAutoResolve = true;
  gpAR.value.ubSectorX = ubSectorX;
  gpAR.value.ubSectorY = ubSectorY;
  gpAR.value.ubBattleStatus = Enum120.BATTLE_IN_PROGRESS;
  gpAR.value.uiTimeSlice = 1000;
  gpAR.value.uiTotalElapsedBattleTimeInMilliseconds = 0;
  gpAR.value.fSound = true;
  gpAR.value.fMoraleEventsHandled = false;
  gpAR.value.uiPreRandomIndex = guiPreRandomIndex;

  // Determine who gets the defensive advantage
  switch (gubEnemyEncounterCode) {
    case Enum164.ENEMY_ENCOUNTER_CODE:
      gpAR.value.ubPlayerDefenceAdvantage = 21; // Skewed to the player's advantage for convenience purposes.
      break;
    case Enum164.ENEMY_INVASION_CODE:
      gpAR.value.ubPlayerDefenceAdvantage = 0;
      break;
    case Enum164.CREATURE_ATTACK_CODE:
      gpAR.value.ubPlayerDefenceAdvantage = 0;
      break;
    default:
// shouldn't happen
      break;
  }
}

export function AutoResolveScreenInit(): UINT32 {
  return true;
}

export function AutoResolveScreenShutdown(): UINT32 {
  gpBattleGroup = null;
  return true;
}

export function AutoResolveScreenHandle(): UINT32 {
  RestoreBackgroundRects();

  if (!gpAR) {
    gfEnteringMapScreen = true;
    return Enum26.MAP_SCREEN;
  }
  if (gpAR.value.fEnteringAutoResolve) {
    let pDestBuf: Pointer<UINT8>;
    let uiDestPitchBYTES: UINT32;
    let ClipRect: SGPRect = createSGPRect();
    gpAR.value.fEnteringAutoResolve = false;
    // Take the framebuffer, shade it, and save it to the SAVEBUFFER.
    ClipRect.iLeft = 0;
    ClipRect.iTop = 0;
    ClipRect.iRight = 640;
    ClipRect.iBottom = 480;
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, addressof(ClipRect));
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
      gpAR.value.fExpanding = true;
    gpAR.value.fRenderAutoResolve = true;
  }
  if (gpAR.value.fExitAutoResolve) {
    gfEnteringMapScreen = true;
    RemoveAutoResolveInterface(true);
    return Enum26.MAP_SCREEN;
  }
  if (gpAR.value.fPendingSurrender) {
    gpAR.value.uiPrevTime = gpAR.value.uiCurrTime = GetJA2Clock();
  } else if (gpAR.value.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS && !gpAR.value.fExpanding) {
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

function RefreshMerc(pSoldier: Pointer<SOLDIERTYPE>): void {
  pSoldier.value.bLife = pSoldier.value.bLifeMax;
  pSoldier.value.bBleeding = 0;
  pSoldier.value.bBreath = pSoldier.value.bBreathMax = 100;
  pSoldier.value.sBreathRed = 0;
  if (gpAR.value.pRobotCell) {
    UpdateRobotControllerGivenRobot(gpAR.value.pRobotCell.value.pSoldier);
  }
  // gpAR->fUnlimitedAmmo = TRUE;
}

// Now assign the pSoldier->ubGroupIDs for the enemies, so we know where to remove them.  Start with
// stationary groups first.
function AssociateEnemiesWithStrategicGroups(): void {
  let pSector: Pointer<SECTORINFO>;
  let pGroup: Pointer<GROUP>;
  let ubNumAdmins: UINT8;
  let ubNumTroops: UINT8;
  let ubNumElites: UINT8;
  let ubNumElitesInGroup: UINT8;
  let ubNumTroopsInGroup: UINT8;
  let ubNumAdminsInGroup: UINT8;
  let i: INT32;

  if (gubEnemyEncounterCode == Enum164.CREATURE_ATTACK_CODE)
    return;

  pSector = addressof(SectorInfo[SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY)]);

  // grab the number of each type in the stationary sector
  ubNumAdmins = pSector.value.ubNumAdmins;
  ubNumTroops = pSector.value.ubNumTroops;
  ubNumElites = pSector.value.ubNumElites;

  // Now go through our enemies in the autoresolve array, and assign the ubGroupID to the soldier
  // Stationary groups have a group ID of 0
  for (i = 0; i < gpAR.value.ubEnemies; i++) {
    if (gpEnemies[i].uiFlags & CELL_ELITE && ubNumElites) {
      gpEnemies[i].pSoldier.value.ubGroupID = 0;
      gpEnemies[i].uiFlags |= CELL_ASSIGNED;
      ubNumElites--;
    } else if (gpEnemies[i].uiFlags & CELL_TROOP && ubNumTroops) {
      gpEnemies[i].pSoldier.value.ubGroupID = 0;
      gpEnemies[i].uiFlags |= CELL_ASSIGNED;
      ubNumTroops--;
    } else if (gpEnemies[i].uiFlags & CELL_ADMIN && ubNumAdmins) {
      gpEnemies[i].pSoldier.value.ubGroupID = 0;
      gpEnemies[i].uiFlags |= CELL_ASSIGNED;
      ubNumAdmins--;
    }
  }

  ubNumAdmins = gpAR.value.ubAdmins - pSector.value.ubNumAdmins;
  ubNumTroops = gpAR.value.ubTroops - pSector.value.ubNumTroops;
  ubNumElites = gpAR.value.ubElites - pSector.value.ubNumElites;

  if (!ubNumElites && !ubNumTroops && !ubNumAdmins) {
    // All troops accounted for.
    return;
  }

  // Now assign the rest of the soldiers to groups
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.value.fPlayer && pGroup.value.ubSectorX == gpAR.value.ubSectorX && pGroup.value.ubSectorY == gpAR.value.ubSectorY) {
      ubNumElitesInGroup = pGroup.value.pEnemyGroup.value.ubNumElites;
      ubNumTroopsInGroup = pGroup.value.pEnemyGroup.value.ubNumTroops;
      ubNumAdminsInGroup = pGroup.value.pEnemyGroup.value.ubNumAdmins;
      for (i = 0; i < gpAR.value.ubEnemies; i++) {
        if (!(gpEnemies[i].uiFlags & CELL_ASSIGNED)) {
          if (ubNumElites && ubNumElitesInGroup) {
            gpEnemies[i].pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
            gpEnemies[i].uiFlags |= CELL_ASSIGNED;
            ubNumElites--;
            ubNumElitesInGroup--;
          } else if (ubNumTroops && ubNumTroopsInGroup) {
            gpEnemies[i].pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
            gpEnemies[i].uiFlags |= CELL_ASSIGNED;
            ubNumTroops--;
            ubNumTroopsInGroup--;
          } else if (ubNumAdmins && ubNumAdminsInGroup) {
            gpEnemies[i].pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
            gpEnemies[i].uiFlags |= CELL_ASSIGNED;
            ubNumAdmins--;
            ubNumAdminsInGroup--;
          }
        }
      }
    }
    pGroup = pGroup.value.next;
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

  gpAR.value.ubAliveMercs = gpAR.value.ubMercs;
  gpAR.value.ubAliveCivs = gpAR.value.ubCivs;
  gpAR.value.ubAliveEnemies = gpAR.value.ubEnemies;

  iMaxTeamSize = Math.max(gpAR.value.ubMercs + gpAR.value.ubCivs, gpAR.value.ubEnemies);

  if (iMaxTeamSize > 12) {
    gpAR.value.ubTimeModifierPercentage = (118 - iMaxTeamSize * 1.5);
  } else {
    gpAR.value.ubTimeModifierPercentage = 100;
  }
  gpAR.value.uiTimeSlice = gpAR.value.uiTimeSlice * gpAR.value.ubTimeModifierPercentage / 100;

  iTop = 240 - gpAR.value.sHeight / 2;
  if (iTop > 120)
    iTop -= 40;

  if (gpAR.value.ubMercs) {
    iStartY = iTop + (gpAR.value.sHeight - ((gpAR.value.ubMercRows + gpAR.value.ubCivRows) * 47 + 7)) / 2 + 6;
    y = gpAR.value.ubMercRows;
    x = gpAR.value.ubMercCols;
    i = gpAR.value.ubMercs;
    gapStartRow = gpAR.value.ubMercRows - gpAR.value.ubMercRows * gpAR.value.ubMercCols + gpAR.value.ubMercs;
    for (x = 0; x < gpAR.value.ubMercCols; x++)
      for (y = 0; i && y < gpAR.value.ubMercRows; y++, i--) {
        index = y * gpAR.value.ubMercCols + gpAR.value.ubMercCols - x - 1;
        if (y >= gapStartRow)
          index -= y - gapStartRow + 1;
        Assert(index >= 0 && index < gpAR.value.ubMercs);
        gpMercs[index].xp = gpAR.value.sCenterStartX + 3 - 55 * (x + 1);
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
        gpMercs[index].pRegion = MemAlloc(sizeof(MOUSE_REGION));
        Assert(gpMercs[index].pRegion);
        memset(gpMercs[index].pRegion, 0, sizeof(MOUSE_REGION));
        MSYS_DefineRegion(gpMercs[index].pRegion, gpMercs[index].xp, gpMercs[index].yp, (gpMercs[index].xp + 50), (gpMercs[index].yp + 44), MSYS_PRIORITY_HIGH, 0, MercCellMouseMoveCallback, MercCellMouseClickCallback);
        if (fReset)
          RefreshMerc(gpMercs[index].pSoldier);
        if (!gpMercs[index].pSoldier.value.bLife)
          gpAR.value.ubAliveMercs--;
      }
  }
  if (gpAR.value.ubCivs) {
    iStartY = iTop + (gpAR.value.sHeight - ((gpAR.value.ubMercRows + gpAR.value.ubCivRows) * 47 + 7)) / 2 + gpAR.value.ubMercRows * 47 + 5;
    y = gpAR.value.ubCivRows;
    x = gpAR.value.ubCivCols;
    i = gpAR.value.ubCivs;
    gapStartRow = gpAR.value.ubCivRows - gpAR.value.ubCivRows * gpAR.value.ubCivCols + gpAR.value.ubCivs;
    for (x = 0; x < gpAR.value.ubCivCols; x++)
      for (y = 0; i && y < gpAR.value.ubCivRows; y++, i--) {
        index = y * gpAR.value.ubCivCols + gpAR.value.ubCivCols - x - 1;
        if (y >= gapStartRow)
          index -= y - gapStartRow + 1;
        Assert(index >= 0 && index < gpAR.value.ubCivs);
        gpCivs[index].xp = gpAR.value.sCenterStartX + 3 - 55 * (x + 1);
        gpCivs[index].yp = iStartY + y * 47;
        gpCivs[index].uiFlags |= CELL_MILITIA;
      }
  }
  if (gpAR.value.ubEnemies) {
    iStartY = iTop + (gpAR.value.sHeight - (gpAR.value.ubEnemyRows * 47 + 7)) / 2 + 5;
    y = gpAR.value.ubEnemyRows;
    x = gpAR.value.ubEnemyCols;
    i = gpAR.value.ubEnemies;
    gapStartRow = gpAR.value.ubEnemyRows - gpAR.value.ubEnemyRows * gpAR.value.ubEnemyCols + gpAR.value.ubEnemies;
    for (x = 0; x < gpAR.value.ubEnemyCols; x++)
      for (y = 0; i && y < gpAR.value.ubEnemyRows; y++, i--) {
        index = y * gpAR.value.ubEnemyCols + x;
        if (y > gapStartRow)
          index -= y - gapStartRow;
        Assert(index >= 0 && index < gpAR.value.ubEnemies);
        gpEnemies[index].xp = (gpAR.value.sCenterStartX + 141 + 55 * x);
        gpEnemies[index].yp = iStartY + y * 47;
        if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
          if (index < gpAR.value.ubElites)
            gpEnemies[index].uiFlags = CELL_ELITE;
          else if (index < gpAR.value.ubElites + gpAR.value.ubTroops)
            gpEnemies[index].uiFlags = CELL_TROOP;
          else
            gpEnemies[index].uiFlags = CELL_ADMIN;
        } else {
          if (index < gpAR.value.ubAFCreatures)
            gpEnemies[index].uiFlags = CELL_AF_CREATURE;
          else if (index < gpAR.value.ubAMCreatures + gpAR.value.ubAFCreatures)
            gpEnemies[index].uiFlags = CELL_AM_CREATURE;
          else if (index < gpAR.value.ubYFCreatures + gpAR.value.ubAMCreatures + gpAR.value.ubAFCreatures)
            gpEnemies[index].uiFlags = CELL_YF_CREATURE;
          else
            gpEnemies[index].uiFlags = CELL_YM_CREATURE;
        }
      }
  }
}

function RenderSoldierCell(pCell: Pointer<SOLDIERCELL>): void {
  let x: UINT8;
  if (pCell.value.uiFlags & CELL_MERC) {
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 36, pCell.value.yp + 2, pCell.value.xp + 44, pCell.value.yp + 30, 0);
    BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.value.iPanelImages, Enum121.MERC_PANEL, pCell.value.xp, pCell.value.yp, VO_BLT_SRCTRANSPARENCY, null);
    RenderSoldierCellBars(pCell);
    x = 0;
  } else {
    BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.value.iPanelImages, Enum121.OTHER_PANEL, pCell.value.xp, pCell.value.yp, VO_BLT_SRCTRANSPARENCY, null);
    x = 6;
  }
  if (!pCell.value.pSoldier.value.bLife) {
    SetObjectHandleShade(pCell.value.uiVObjectID, 0);
    if (!(pCell.value.uiFlags & CELL_CREATURE))
      BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.value.iFaces, Enum122.HUMAN_SKULL, pCell.value.xp + 3 + x, pCell.value.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
    else
      BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.value.iFaces, Enum122.CREATURE_SKULL, pCell.value.xp + 3 + x, pCell.value.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    if (pCell.value.uiFlags & CELL_HITBYATTACKER) {
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 3 + x, pCell.value.yp + 3, pCell.value.xp + 33 + x, pCell.value.yp + 29, 65535);
    } else if (pCell.value.uiFlags & CELL_HITLASTFRAME) {
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 3 + x, pCell.value.yp + 3, pCell.value.xp + 33 + x, pCell.value.yp + 29, 0);
      SetObjectHandleShade(pCell.value.uiVObjectID, 1);
      BltVideoObjectFromIndex(FRAME_BUFFER, pCell.value.uiVObjectID, pCell.value.usIndex, pCell.value.xp + 3 + x, pCell.value.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
    } else {
      SetObjectHandleShade(pCell.value.uiVObjectID, 0);
      BltVideoObjectFromIndex(FRAME_BUFFER, pCell.value.uiVObjectID, pCell.value.usIndex, pCell.value.xp + 3 + x, pCell.value.yp + 3, VO_BLT_SRCTRANSPARENCY, null);
    }
  }

  if (pCell.value.pSoldier.value.bLife > 0 && pCell.value.pSoldier.value.bLife < OKLIFE && !(pCell.value.uiFlags & (CELL_HITBYATTACKER | CELL_HITLASTFRAME | CELL_CREATURE))) {
    // Merc is unconcious (and not taking damage), so darken his portrait.
    let pDestBuf: Pointer<UINT8>;
    let uiDestPitchBYTES: UINT32;
    let ClipRect: SGPRect = createSGPRect();
    ClipRect.iLeft = pCell.value.xp + 3 + x;
    ClipRect.iTop = pCell.value.yp + 3;
    ClipRect.iRight = pCell.value.xp + 33 + x;
    ClipRect.iBottom = pCell.value.yp + 29;
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, addressof(ClipRect));
    UnLockVideoSurface(FRAME_BUFFER);
  }

  // Draw the health text
  RenderSoldierCellHealth(pCell);

  DrawDebugText(pCell);

  if (!(pCell.value.uiFlags & CELL_RETREATING))
    pCell.value.uiFlags &= ~CELL_DIRTY;

  InvalidateRegion(pCell.value.xp, pCell.value.yp, pCell.value.xp + 50, pCell.value.yp + 44);

  // Adjust flags accordingly
  if (pCell.value.uiFlags & CELL_HITBYATTACKER) {
    pCell.value.uiFlags &= ~CELL_HITBYATTACKER;
    pCell.value.uiFlags |= CELL_HITLASTFRAME | CELL_DIRTY;
    pCell.value.uiFlashTime = GetJA2Clock() + 150;
  } else if (pCell.value.uiFlags & CELL_HITLASTFRAME) {
    if (pCell.value.uiFlashTime < GetJA2Clock()) {
      pCell.value.uiFlags &= ~CELL_HITLASTFRAME;
    }
    pCell.value.uiFlags |= CELL_DIRTY;
  }
}

function RenderSoldierCellBars(pCell: Pointer<SOLDIERCELL>): void {
  let iStartY: INT32;
  // HEALTH BAR
  if (!pCell.value.pSoldier.value.bLife)
    return;
  // yellow one for bleeding
  iStartY = pCell.value.yp + 29 - 25 * pCell.value.pSoldier.value.bLifeMax / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 37, iStartY, pCell.value.xp + 38, pCell.value.yp + 29, Get16BPPColor(FROMRGB(107, 107, 57)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 38, iStartY, pCell.value.xp + 39, pCell.value.yp + 29, Get16BPPColor(FROMRGB(222, 181, 115)));
  // pink one for bandaged.
  iStartY += 25 * pCell.value.pSoldier.value.bBleeding / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 37, iStartY, pCell.value.xp + 38, pCell.value.yp + 29, Get16BPPColor(FROMRGB(156, 57, 57)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 38, iStartY, pCell.value.xp + 39, pCell.value.yp + 29, Get16BPPColor(FROMRGB(222, 132, 132)));
  // red one for actual health
  iStartY = pCell.value.yp + 29 - 25 * pCell.value.pSoldier.value.bLife / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 37, iStartY, pCell.value.xp + 38, pCell.value.yp + 29, Get16BPPColor(FROMRGB(107, 8, 8)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 38, iStartY, pCell.value.xp + 39, pCell.value.yp + 29, Get16BPPColor(FROMRGB(206, 0, 0)));
  // BREATH BAR
  iStartY = pCell.value.yp + 29 - 25 * pCell.value.pSoldier.value.bBreathMax / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 41, iStartY, pCell.value.xp + 42, pCell.value.yp + 29, Get16BPPColor(FROMRGB(8, 8, 132)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 42, iStartY, pCell.value.xp + 43, pCell.value.yp + 29, Get16BPPColor(FROMRGB(8, 8, 107)));
  // MORALE BAR
  iStartY = pCell.value.yp + 29 - 25 * pCell.value.pSoldier.value.bMorale / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 45, iStartY, pCell.value.xp + 46, pCell.value.yp + 29, Get16BPPColor(FROMRGB(8, 156, 8)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, pCell.value.xp + 46, iStartY, pCell.value.xp + 47, pCell.value.yp + 29, Get16BPPColor(FROMRGB(8, 107, 8)));
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
  gpAR.value.Rect.iLeft = 320 - gpAR.value.sWidth / 2;
  gpAR.value.Rect.iRight = gpAR.value.Rect.iLeft + gpAR.value.sWidth;
  gpAR.value.Rect.iTop = 240 - gpAR.value.sHeight / 2;
  if (gpAR.value.Rect.iTop > 120)
    gpAR.value.Rect.iTop -= 40;
  gpAR.value.Rect.iBottom = gpAR.value.Rect.iTop + gpAR.value.sHeight;

  DestRect.iLeft = 0;
  DestRect.iTop = 0;
  DestRect.iRight = gpAR.value.sWidth;
  DestRect.iBottom = gpAR.value.sHeight;

  // create buffer for the transition slot for merc items.  This slot contains the newly
  // selected item graphic in it's inventory size version.  This buffer is then scaled down
  // into the associated merc inventory panel slot buffer which is approximately 20% smaller.
  GetCurrentVideoSettings(addressof(usUselessWidth), addressof(usUselessHeight), addressof(ubBitDepth));
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = gpAR.value.sWidth;
  vs_desc.usHeight = gpAR.value.sHeight;
  vs_desc.ubBitDepth = ubBitDepth;
  if (!AddVideoSurface(addressof(vs_desc), addressof(gpAR.value.iInterfaceBuffer)))
    AssertMsg(0, "Failed to allocate memory for autoresolve interface buffer.");

  GetClippingRect(addressof(ClipRect));
  SetClippingRect(addressof(DestRect));

  // Blit the back panels...
  for (y = DestRect.iTop; y < DestRect.iBottom; y += 40) {
    for (x = DestRect.iLeft; x < DestRect.iRight; x += 50) {
      BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.C_TEXTURE, x, y, VO_BLT_SRCTRANSPARENCY, 0);
    }
  }
  // Blit the left and right edges
  for (y = DestRect.iTop; y < DestRect.iBottom; y += 40) {
    x = DestRect.iLeft;
    BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.L_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
    x = DestRect.iRight - 3;
    BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.R_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
  }
  // Blit the top and bottom edges
  for (x = DestRect.iLeft; x < DestRect.iRight; x += 50) {
    y = DestRect.iTop;
    BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.T_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
    y = DestRect.iBottom - 3;
    BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.B_BORDER, x, y, VO_BLT_SRCTRANSPARENCY, 0);
  }
  // Blit the 4 corners
  BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.TL_BORDER, DestRect.iLeft, DestRect.iTop, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.TR_BORDER, DestRect.iRight - 10, DestRect.iTop, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.BL_BORDER, DestRect.iLeft, DestRect.iBottom - 9, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.BR_BORDER, DestRect.iRight - 10, DestRect.iBottom - 9, VO_BLT_SRCTRANSPARENCY, null);

  // Blit the center pieces
  x = gpAR.value.sCenterStartX - gpAR.value.Rect.iLeft;
  y = 0;
  // Top
  BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.TOP_MIDDLE, x, y, VO_BLT_SRCTRANSPARENCY, null);
  // Middle
  for (y = 40; y < gpAR.value.sHeight - 40; y += 40) {
    BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.AUTO_MIDDLE, x, y, VO_BLT_SRCTRANSPARENCY, null);
  }
  y = gpAR.value.sHeight - 40;
  BltVideoObjectFromIndex(gpAR.value.iInterfaceBuffer, gpAR.value.iPanelImages, Enum121.BOT_MIDDLE, x, y, VO_BLT_SRCTRANSPARENCY, null);

  SetClippingRect(addressof(ClipRect));
}

function ExpandWindow(): void {
  let OldRect: SGPRect = createSGPRect();
  let uiDestPitchBYTES: UINT32;
  let uiCurrentTime: UINT32;
  let uiTimeRange: UINT32;
  let uiPercent: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let i: INT32;

  if (!gpAR.value.ExRect.iLeft && !gpAR.value.ExRect.iRight) {
    // First time
    gpAR.value.ExRect.iLeft = ORIG_LEFT;
    gpAR.value.ExRect.iTop = ORIG_TOP;
    gpAR.value.ExRect.iRight = ORIG_RIGHT;
    gpAR.value.ExRect.iBottom = ORIG_BOTTOM;
    gpAR.value.uiStartExpanding = GetJA2Clock();
    gpAR.value.uiEndExpanding = gpAR.value.uiStartExpanding + 333;
    for (i = 0; i < Enum119.DONEWIN_BUTTON; i++)
      HideButton(gpAR.value.iButton[i]);
  } else {
    // Restore the previous area
    // left
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iTop, 1, (gpAR.value.ExRect.iBottom - gpAR.value.ExRect.iTop + 1));
    InvalidateRegion(gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iTop, gpAR.value.ExRect.iLeft + 1, gpAR.value.ExRect.iBottom + 1);
    // right
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.value.ExRect.iRight, gpAR.value.ExRect.iTop, 1, (gpAR.value.ExRect.iBottom - gpAR.value.ExRect.iTop + 1));
    InvalidateRegion(gpAR.value.ExRect.iRight, gpAR.value.ExRect.iTop, gpAR.value.ExRect.iRight + 1, gpAR.value.ExRect.iBottom + 1);
    // top
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iTop, (gpAR.value.ExRect.iRight - gpAR.value.ExRect.iLeft + 1), 1);
    InvalidateRegion(gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iTop, gpAR.value.ExRect.iRight + 1, gpAR.value.ExRect.iTop + 1);
    // bottom
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iBottom, (gpAR.value.ExRect.iRight - gpAR.value.ExRect.iLeft + 1), 1);
    InvalidateRegion(gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iBottom, gpAR.value.ExRect.iRight + 1, gpAR.value.ExRect.iBottom + 1);

    uiCurrentTime = GetJA2Clock();
    if (uiCurrentTime >= gpAR.value.uiStartExpanding && uiCurrentTime <= gpAR.value.uiEndExpanding) {
      // Debug purposes
      OldRect.iLeft = ORIG_LEFT;
      OldRect.iTop = ORIG_TOP;
      OldRect.iRight = ORIG_RIGHT;
      OldRect.iBottom = ORIG_BOTTOM;

      uiTimeRange = gpAR.value.uiEndExpanding - gpAR.value.uiStartExpanding;
      uiPercent = (uiCurrentTime - gpAR.value.uiStartExpanding) * 100 / uiTimeRange;

      // Left
      if (OldRect.iLeft <= gpAR.value.Rect.iLeft)
        gpAR.value.ExRect.iLeft = OldRect.iLeft + (gpAR.value.Rect.iLeft - OldRect.iLeft) * uiPercent / 100;
      else
        gpAR.value.ExRect.iLeft = gpAR.value.Rect.iLeft + (OldRect.iLeft - gpAR.value.Rect.iLeft) * uiPercent / 100;
      // Top
      if (OldRect.iTop <= gpAR.value.Rect.iTop)
        gpAR.value.ExRect.iTop = OldRect.iTop + (gpAR.value.Rect.iTop - OldRect.iTop) * uiPercent / 100;
      else
        gpAR.value.ExRect.iTop = gpAR.value.Rect.iTop + (OldRect.iTop - gpAR.value.Rect.iTop) * uiPercent / 100;
      // Right
      if (OldRect.iRight <= gpAR.value.Rect.iRight)
        gpAR.value.ExRect.iRight = OldRect.iRight + (gpAR.value.Rect.iRight - OldRect.iRight) * uiPercent / 100;
      else
        gpAR.value.ExRect.iRight = gpAR.value.Rect.iRight + (OldRect.iRight - gpAR.value.Rect.iRight) * uiPercent / 100;
      // Bottom
      if (OldRect.iBottom <= gpAR.value.Rect.iBottom)
        gpAR.value.ExRect.iBottom = OldRect.iBottom + (gpAR.value.Rect.iBottom - OldRect.iBottom) * uiPercent / 100;
      else
        gpAR.value.ExRect.iBottom = gpAR.value.Rect.iBottom + (OldRect.iBottom - gpAR.value.Rect.iBottom) * uiPercent / 100;
    } else {
      // expansion done -- final frame
      gpAR.value.ExRect.iLeft = gpAR.value.Rect.iLeft;
      gpAR.value.ExRect.iTop = gpAR.value.Rect.iTop;
      gpAR.value.ExRect.iRight = gpAR.value.Rect.iRight;
      gpAR.value.ExRect.iBottom = gpAR.value.Rect.iBottom;
      gpAR.value.fExpanding = false;
      gpAR.value.fShowInterface = true;
    }
  }

  // The new rect now determines the state of the current rectangle.
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iTop, gpAR.value.ExRect.iRight, gpAR.value.ExRect.iBottom, Get16BPPColor(FROMRGB(200, 200, 100)), pDestBuf);
  UnLockVideoSurface(FRAME_BUFFER);
  // left
  InvalidateRegion(gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iTop, gpAR.value.ExRect.iLeft + 1, gpAR.value.ExRect.iBottom + 1);
  // right
  InvalidateRegion(gpAR.value.ExRect.iRight, gpAR.value.ExRect.iTop, gpAR.value.ExRect.iRight + 1, gpAR.value.ExRect.iBottom + 1);
  // top
  InvalidateRegion(gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iTop, gpAR.value.ExRect.iRight + 1, gpAR.value.ExRect.iTop + 1);
  // bottom
  InvalidateRegion(gpAR.value.ExRect.iLeft, gpAR.value.ExRect.iBottom, gpAR.value.ExRect.iRight + 1, gpAR.value.ExRect.iBottom + 1);
}

export function VirtualSoldierDressWound(pSoldier: Pointer<SOLDIERTYPE>, pVictim: Pointer<SOLDIERTYPE>, pKit: Pointer<OBJECTTYPE>, sKitPts: INT16, sStatus: INT16): UINT32 {
  let uiDressSkill: UINT32;
  let uiPossible: UINT32;
  let uiActual: UINT32;
  let uiMedcost: UINT32;
  let uiDeficiency: UINT32;
  let uiAvailAPs: UINT32;
  let uiUsedAPs: UINT32;
  let bBelowOKlife: UINT8;
  let bPtsLeft: UINT8;

  if (pVictim.value.bBleeding < 1)
    return 0; // nothing to do, shouldn't have even been called!
  if (pVictim.value.bLife == 0)
    return 0;

  // calculate wound-dressing skill (3x medical,  2x equip,1x level, 1x dex)
  uiDressSkill = ((3 * EffectiveMedical(pSoldier)) + // medical knowledge
                  (2 * sStatus) + // state of medical kit
                  (10 * EffectiveExpLevel(pSoldier)) + // battle injury experience
                  EffectiveDexterity(pSoldier)) /
                 7; // general "handiness"

  // try to use every AP that the merc has left
  uiAvailAPs = pSoldier.value.bActionPoints;

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

  if (pSoldier.value.inv[0].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
    uiPossible += (uiPossible / 2); // add extra 50 %

  uiActual = uiPossible; // start by assuming maximum possible

  // figure out how far below OKLIFE the victim is
  if (pVictim.value.bLife >= OKLIFE)
    bBelowOKlife = 0;
  else
    bBelowOKlife = OKLIFE - pVictim.value.bLife;

  // figure out how many healing pts we need to stop dying (2x cost)
  uiDeficiency = (2 * bBelowOKlife);

  // if, after that, the patient will still be bleeding
  if ((pVictim.value.bBleeding - bBelowOKlife) > 0) {
    // then add how many healing pts we need to stop bleeding (1x cost)
    uiDeficiency += (pVictim.value.bBleeding - bBelowOKlife);
  }

  // now, make sure we weren't going to give too much
  if (uiActual > uiDeficiency) // if we were about to apply too much
    uiActual = uiDeficiency; // reduce actual not to waste anything

  // now make sure we HAVE that much
  if (pKit.value.usItem == Enum225.MEDICKIT) {
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
  if (bPtsLeft && pVictim.value.bLife < OKLIFE) {
    // if we have enough points to bring him all the way to OKLIFE this turn
    if (bPtsLeft >= (2 * bBelowOKlife)) {
      // raise life to OKLIFE
      pVictim.value.bLife = OKLIFE;
      // reduce bleeding by the same number of life points healed up
      pVictim.value.bBleeding -= bBelowOKlife;
      // use up appropriate # of actual healing points
      bPtsLeft -= (2 * bBelowOKlife);
    } else {
      pVictim.value.bLife += (bPtsLeft / 2);
      pVictim.value.bBleeding -= (bPtsLeft / 2);
      bPtsLeft = bPtsLeft % 2; // if ptsLeft was odd, ptsLeft = 1
    }

    // this should never happen any more, but make sure bleeding not negative
    if (pVictim.value.bBleeding < 0)
      pVictim.value.bBleeding = 0;

    // if this healing brought the patient out of the worst of it, cancel dying
    if (pVictim.value.bLife >= OKLIFE) {
      // turn off merc QUOTE flags
      pVictim.value.fDyingComment = false;
    }

    if (pVictim.value.bBleeding <= MIN_BLEEDING_THRESHOLD) {
      pVictim.value.fWarnedAboutBleeding = false;
    }
  }

  // if any healing points remain, apply that to any remaining bleeding (1/1)
  // DON'T spend any APs/kit pts to cure bleeding until merc is no longer dying
  // if ( bPtsLeft && pVictim->bBleeding && !pVictim->dying)
  if (bPtsLeft && pVictim.value.bBleeding) {
    // if we have enough points to bandage all remaining bleeding this turn
    if (bPtsLeft >= pVictim.value.bBleeding) {
      bPtsLeft -= pVictim.value.bBleeding;
      pVictim.value.bBleeding = 0;
    } else // bandage what we can
    {
      pVictim.value.bBleeding -= bPtsLeft;
      bPtsLeft = 0;
    }
  }
  // if there are any ptsLeft now, then we didn't actually get to use them
  uiActual -= bPtsLeft;

  // usedAPs equals (actionPts) * (%of possible points actually used)
  uiUsedAPs = (uiActual * uiAvailAPs) / uiPossible;

  if (pSoldier.value.inv[0].usItem == Enum225.MEDICKIT) // using the GOOD medic stuff
    uiUsedAPs = (uiUsedAPs * 2) / 3; // reverse 50% bonus by taking 2/3rds

  if (uiActual / 2)
    // MEDICAL GAIN (actual / 2):  Helped someone by giving first aid
    StatChange(pSoldier, MEDICALAMT, ((uiActual / 2)), false);

  if (uiActual / 4)
    // DEXTERITY GAIN (actual / 4):  Helped someone by giving first aid
    StatChange(pSoldier, DEXTAMT, ((uiActual / 4)), false);

  return uiMedcost;
}

function FindMedicalKit(): Pointer<OBJECTTYPE> {
  let i: INT32;
  let iSlot: INT32;
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    iSlot = FindObjClass(gpMercs[i].pSoldier, IC_MEDKIT);
    if (iSlot != NO_SLOT) {
      return addressof(gpMercs[i].pSoldier.value.inv[iSlot]);
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
  let pKit: Pointer<OBJECTTYPE> = null;
  let fFound: boolean = false;
  let fComplete: boolean = true;
  let bSlot: INT8;
  let cnt: INT8;

  // Do we have any doctors?  If so, bandage selves first.
  fFound = false;
  uiMaxPointsUsed = uiParallelPointsUsed = 0;
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    if (gpMercs[i].pSoldier.value.bLife >= OKLIFE && !gpMercs[i].pSoldier.value.bCollapsed && gpMercs[i].pSoldier.value.bMedical > 0 && (bSlot = FindObjClass(gpMercs[i].pSoldier, IC_MEDKIT)) != NO_SLOT) {
      fFound = true;
      // bandage self first!
      uiCurrPointsUsed = 0;
      cnt = 0;
      while (gpMercs[i].pSoldier.value.bBleeding) {
        pKit = addressof(gpMercs[i].pSoldier.value.inv[bSlot]);
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
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    if (gpMercs[i].pSoldier.value.bLife >= OKLIFE && !gpMercs[i].pSoldier.value.bCollapsed && gpMercs[i].pSoldier.value.bMedical > 0) {
      if (gpMercs[i].pSoldier.value.bMedical > gpMercs[iBest].pSoldier.value.bMedical) {
        iBest = i;
      }
    }
  }

  for (i = 0; i < gpAR.value.ubMercs; i++) {
    while (gpMercs[i].pSoldier.value.bBleeding && gpMercs[i].pSoldier.value.bLife) {
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

  gpAR.value.uiTotalElapsedBattleTimeInMilliseconds += uiParallelPointsUsed * 200;
  return 1;
}

function RenderAutoResolve(): void {
  let i: INT32;
  let hVSurface: HVSURFACE;
  let xp: INT32;
  let yp: INT32;
  let pCell: Pointer<SOLDIERCELL> = null;
  let index: INT32 = 0;
  let str: string /* UINT16[100] */;
  let bTownId: UINT8 = 0;
  let ubGood: UINT8;
  let ubBad: UINT8;

  if (gpAR.value.fExpanding) {
    // animate the expansion of the window.
    ExpandWindow();
    return;
  } else if (gpAR.value.fShowInterface) {
    // After expanding the window, we now show the interface
    if (gpAR.value.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS && !gpAR.value.fPendingSurrender) {
      for (i = 0; i < Enum119.DONEWIN_BUTTON; i++)
        ShowButton(gpAR.value.iButton[i]);
      HideButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
      HideButton(gpAR.value.iButton[Enum119.YES_BUTTON]);
      HideButton(gpAR.value.iButton[Enum119.NO_BUTTON]);
      gpAR.value.fShowInterface = false;
    } else if (gpAR.value.ubBattleStatus == Enum120.BATTLE_VICTORY) {
      ShowButton(gpAR.value.iButton[Enum119.DONEWIN_BUTTON]);
      ShowButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
    } else {
      ShowButton(gpAR.value.iButton[Enum119.DONELOSE_BUTTON]);
    }
  }

  if (!gpAR.value.fRenderAutoResolve && !gpAR.value.fDebugInfo) {
    // update the dirty cells only
    for (i = 0; i < gpAR.value.ubMercs; i++) {
      if (gpMercs[i].uiFlags & CELL_DIRTY) {
        RenderSoldierCell(addressof(gpMercs[i]));
      }
    }
    for (i = 0; i < gpAR.value.ubCivs; i++) {
      if (gpCivs[i].uiFlags & CELL_DIRTY) {
        RenderSoldierCell(addressof(gpCivs[i]));
      }
    }
    for (i = 0; i < gpAR.value.ubEnemies; i++) {
      if (gpEnemies[i].uiFlags & CELL_DIRTY) {
        RenderSoldierCell(addressof(gpEnemies[i]));
      }
    }
    return;
  }
  gpAR.value.fRenderAutoResolve = false;

  GetVideoSurface(addressof(hVSurface), gpAR.value.iInterfaceBuffer);
  BltVideoSurfaceToVideoSurface(ghFrameBuffer, hVSurface, 0, gpAR.value.Rect.iLeft, gpAR.value.Rect.iTop, VO_BLT_SRCTRANSPARENCY, 0);

  for (i = 0; i < gpAR.value.ubMercs; i++) {
    RenderSoldierCell(addressof(gpMercs[i]));
  }
  for (i = 0; i < gpAR.value.ubCivs; i++) {
    RenderSoldierCell(addressof(gpCivs[i]));
  }
  for (i = 0; i < gpAR.value.ubEnemies; i++) {
    RenderSoldierCell(addressof(gpEnemies[i]));
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

  xp = gpAR.value.sCenterStartX + 70 - StringPixLength(str, FONT10ARIALBOLD()) / 2;
  yp = gpAR.value.Rect.iTop + 15;
  mprintf(xp, yp, str);

  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_GRAY2);
  SetFontShadow(FONT_NEARBLACK);

  GetSectorIDString(gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0, str, true);
  xp = gpAR.value.sCenterStartX + 70 - StringPixLength(str, FONT10ARIAL()) / 2;
  yp += 11;
  mprintf(xp, yp, str);

  // Display the remaining forces
  ubGood = (gpAR.value.ubAliveMercs + gpAR.value.ubAliveCivs);
  ubBad = gpAR.value.ubAliveEnemies;
  str = swprintf(gzLateLocalizedString[17], ubGood, ubBad);

  SetFont(FONT14ARIAL());
  if (ubGood * 3 <= ubBad * 2) {
    SetFontForeground(FONT_LTRED);
  } else if (ubGood * 2 >= ubBad * 3) {
    SetFontForeground(FONT_LTGREEN);
  } else {
    SetFontForeground(FONT_YELLOW);
  }

  xp = gpAR.value.sCenterStartX + 70 - StringPixLength(str, FONT14ARIAL()) / 2;
  yp += 11;
  mprintf(xp, yp, str);

  if (gpAR.value.fPendingSurrender) {
    DisplayWrappedString((gpAR.value.sCenterStartX + 16), (230 + gpAR.value.bVerticalOffset), 108, 2, FONT10ARIAL(), FONT_YELLOW, gpStrategicString[Enum365.STR_ENEMY_SURRENDER_OFFER], FONT_BLACK, false, LEFT_JUSTIFIED);
  }

  if (gpAR.value.ubBattleStatus != Enum120.BATTLE_IN_PROGRESS) {
    // Handle merc morale, Global loyalty, and change of sector control
    if (!gpAR.value.fMoraleEventsHandled) {
      gpAR.value.uiTotalElapsedBattleTimeInMilliseconds *= 3;
      gpAR.value.fMoraleEventsHandled = true;
      if (CheckFact(Enum170.FACT_FIRST_BATTLE_FOUGHT, 0) == false) {
        // this was the first battle against the army
        SetFactTrue(Enum170.FACT_FIRST_BATTLE_FOUGHT);
        if (gpAR.value.ubBattleStatus == Enum120.BATTLE_VICTORY) {
          SetFactTrue(Enum170.FACT_FIRST_BATTLE_WON);
        }
        SetTheFirstBattleSector((gpAR.value.ubSectorX + gpAR.value.ubSectorY * MAP_WORLD_X));
        HandleFirstBattleEndingWhileInTown(gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0, true);
      }

      switch (gpAR.value.ubBattleStatus) {
        case Enum120.BATTLE_VICTORY:
          HandleMoraleEvent(null, Enum234.MORALE_BATTLE_WON, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_WON, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);

          SectorInfo[SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY)].bLastKnownEnemies = 0;
          SetThisSectorAsPlayerControlled(gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0, true);

          SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);
          LogBattleResults(Enum165.LOG_VICTORY);
          break;

        case Enum120.BATTLE_SURRENDERED:
        case Enum120.BATTLE_CAPTURED:
          for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
            if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && !(MercPtrs[i].value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(MercPtrs[i])) {
              // Merc is active and alive, and not a vehicle or robot
              if (PlayerMercInvolvedInThisCombat(MercPtrs[i])) {
                // This morale event is PER INDIVIDUAL SOLDIER
                HandleMoraleEvent(MercPtrs[i], Enum234.MORALE_MERC_CAPTURED, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
              }
            }
          }
          HandleMoraleEvent(null, Enum234.MORALE_HEARD_BATTLE_LOST, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_LOST, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);

          SetMusicMode(Enum328.MUSIC_TACTICAL_DEATH);
          gsEnemyGainedControlOfSectorID = SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
          break;
        case Enum120.BATTLE_DEFEAT:
          HandleMoraleEvent(null, Enum234.MORALE_HEARD_BATTLE_LOST, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_LOST, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
          if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
          } else {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
            gsCiviliansEatenByMonsters = gpAR.value.ubAliveEnemies;
          }
          SetMusicMode(Enum328.MUSIC_TACTICAL_DEATH);
          LogBattleResults(Enum165.LOG_DEFEAT);
          break;

        case Enum120.BATTLE_RETREAT:

          // Tack on 5 minutes for retreat.
          gpAR.value.uiTotalElapsedBattleTimeInMilliseconds += 300000;

          HandleLoyaltyImplicationsOfMercRetreat(RETREAT_AUTORESOLVE, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
          if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
          } else if (gpAR.value.ubAliveEnemies) {
            gsEnemyGainedControlOfSectorID = SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
            gsCiviliansEatenByMonsters = gpAR.value.ubAliveEnemies;
          }
          break;
      }
    }
    // Render the end battle condition.
    switch (gpAR.value.ubBattleStatus) {
      case Enum120.BATTLE_VICTORY:
        SetFontForeground(FONT_LTGREEN);
        str = gpStrategicString[Enum365.STR_AR_OVER_VICTORY];
        break;
      case Enum120.BATTLE_SURRENDERED:
      case Enum120.BATTLE_CAPTURED:
        if (gpAR.value.ubBattleStatus == Enum120.BATTLE_SURRENDERED) {
          str = gpStrategicString[Enum365.STR_AR_OVER_SURRENDERED];
        } else {
          DisplayWrappedString((gpAR.value.sCenterStartX + 16), 310, 108, 2, FONT10ARIAL(), FONT_YELLOW, gpStrategicString[Enum365.STR_ENEMY_CAPTURED], FONT_BLACK, false, LEFT_JUSTIFIED);
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
    xp = gpAR.value.sCenterStartX + 12;
    yp = 218 + gpAR.value.bVerticalOffset;
    BltVideoObjectFromIndex(FRAME_BUFFER, gpAR.value.iIndent, 0, xp, yp, VO_BLT_SRCTRANSPARENCY, null);
    xp = gpAR.value.sCenterStartX + 70 - StringPixLength(str, BLOCKFONT2()) / 2;
    yp = 227 + gpAR.value.bVerticalOffset;
    mprintf(xp, yp, str);

    // Render the total battle time elapsed.
    SetFont(FONT10ARIAL());
    str = swprintf("%s:  %dm %02ds", gpStrategicString[Enum365.STR_AR_TIME_ELAPSED], gpAR.value.uiTotalElapsedBattleTimeInMilliseconds / 60000, (gpAR.value.uiTotalElapsedBattleTimeInMilliseconds % 60000) / 1000);
    xp = gpAR.value.sCenterStartX + 70 - StringPixLength(str, FONT10ARIAL()) / 2;
    yp = 290 + gpAR.value.bVerticalOffset;
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
  MSYS_DefineRegion(addressof(gpAR.value.AutoResolveRegion), 0, 0, 640, 480, MSYS_PRIORITY_HIGH - 1, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  gpAR.value.fRenderAutoResolve = true;
  gpAR.value.fExitAutoResolve = false;

  // Load the general panel image pieces, to be combined to make the dynamically sized window.
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = "Interface\\AutoResolve.sti";
  if (!AddVideoObject(addressof(VObjectDesc), addressof(gpAR.value.iPanelImages))) {
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
  gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON] = LoadButtonImage("Interface\\AutoBtns.sti", -1, 0, -1, 7, -1);
  if (gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON] == -1) {
    AssertMsg(0, "Failed to load Interface\\AutoBtns.sti");
  }

  // Have the other buttons hook into the first button containing the images.
  gpAR.value.iButtonImage[Enum119.PLAY_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 1, -1, 8, -1);
  gpAR.value.iButtonImage[Enum119.FAST_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 2, -1, 9, -1);
  gpAR.value.iButtonImage[Enum119.FINISH_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 3, -1, 10, -1);
  gpAR.value.iButtonImage[Enum119.YES_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 4, -1, 11, -1);
  gpAR.value.iButtonImage[Enum119.NO_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 5, -1, 12, -1);
  gpAR.value.iButtonImage[Enum119.BANDAGE_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 6, -1, 13, -1);
  gpAR.value.iButtonImage[Enum119.RETREAT_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 14, -1, 15, -1);
  gpAR.value.iButtonImage[Enum119.DONEWIN_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 14, -1, 15, -1);
  gpAR.value.iButtonImage[Enum119.DONELOSE_BUTTON] = UseLoadedButtonImage(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], -1, 16, -1, 17, -1);

  // Load the generic faces for civs and enemies
  VObjectDesc.ImageFile = "Interface\\SmFaces.sti";
  if (!AddVideoObject(addressof(VObjectDesc), addressof(gpAR.value.iFaces))) {
    AssertMsg(0, "Failed to load Interface\\SmFaces.sti");
  }
  if (GetVideoObject(addressof(hVObject), gpAR.value.iFaces)) {
    hVObject.value.pShades[0] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 255, 255, 255, false);
    hVObject.value.pShades[1] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 250, 25, 25, true);
  }

  // Add the battle over panels
  VObjectDesc.ImageFile = "Interface\\indent.sti";
  if (!AddVideoObject(addressof(VObjectDesc), addressof(gpAR.value.iIndent))) {
    AssertMsg(0, "Failed to load Interface\\indent.sti");
  }

  // add all the faces now
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
    // Load the face
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%02d.sti", gMercProfiles[gpMercs[i].pSoldier.value.ubProfile].ubFaceIndex);
    if (!AddVideoObject(addressof(VObjectDesc), addressof(gpMercs[i].uiVObjectID))) {
      VObjectDesc.ImageFile = "Faces\\65Face\\speck.sti";
      if (!AddVideoObject(addressof(VObjectDesc), addressof(gpMercs[i].uiVObjectID))) {
        AssertMsg(0, String("Failed to load %Faces\\65Face\\%02d.sti or it's placeholder, speck.sti", gMercProfiles[gpMercs[i].pSoldier.value.ubProfile].ubFaceIndex));
      }
    }
    if (GetVideoObject(addressof(hVObject), gpMercs[i].uiVObjectID)) {
      hVObject.value.pShades[0] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 255, 255, 255, false);
      hVObject.value.pShades[1] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 250, 25, 25, true);
    }
  }

  ubEliteMilitia = MilitiaInSectorOfRank(gpAR.value.ubSectorX, gpAR.value.ubSectorY, Enum126.ELITE_MILITIA);
  ubRegMilitia = MilitiaInSectorOfRank(gpAR.value.ubSectorX, gpAR.value.ubSectorY, Enum126.REGULAR_MILITIA);
  ubGreenMilitia = MilitiaInSectorOfRank(gpAR.value.ubSectorX, gpAR.value.ubSectorY, Enum126.GREEN_MILITIA);
  while (ubEliteMilitia + ubRegMilitia + ubGreenMilitia < gpAR.value.ubCivs) {
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
  for (i = 0; i < gpAR.value.ubCivs; i++) {
    // reset counter of how many mortars this team has rolled
    ResetMortarsOnTeamCount();

    if (i < ubEliteMilitia) {
      gpCivs[i].pSoldier = TacticalCreateMilitia(Enum262.SOLDIER_CLASS_ELITE_MILITIA);
      if (gpCivs[i].pSoldier.value.ubBodyType == Enum194.REGFEMALE) {
        gpCivs[i].usIndex = Enum122.MILITIA3F_FACE;
      } else {
        gpCivs[i].usIndex = Enum122.MILITIA3_FACE;
      }
    } else if (i < ubRegMilitia + ubEliteMilitia) {
      gpCivs[i].pSoldier = TacticalCreateMilitia(Enum262.SOLDIER_CLASS_REG_MILITIA);
      if (gpCivs[i].pSoldier.value.ubBodyType == Enum194.REGFEMALE) {
        gpCivs[i].usIndex = Enum122.MILITIA2F_FACE;
      } else {
        gpCivs[i].usIndex = Enum122.MILITIA2_FACE;
      }
    } else if (i < ubGreenMilitia + ubRegMilitia + ubEliteMilitia) {
      gpCivs[i].pSoldier = TacticalCreateMilitia(Enum262.SOLDIER_CLASS_GREEN_MILITIA);
      if (gpCivs[i].pSoldier.value.ubBodyType == Enum194.REGFEMALE) {
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
    gpCivs[i].uiVObjectID = gpAR.value.iFaces;
    gpCivs[i].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
    gpCivs[i].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
    gpCivs[i].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_MILITIA_NAME];
  }
  if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
    for (i = 0, index = 0; i < gpAR.value.ubElites; i++, index++) {
      gpEnemies[index].pSoldier = TacticalCreateEliteEnemy();
      gpEnemies[index].uiVObjectID = gpAR.value.iFaces;
      if (gpEnemies[i].pSoldier.value.ubBodyType == Enum194.REGFEMALE) {
        gpEnemies[index].usIndex = Enum122.ELITEF_FACE;
      } else {
        gpEnemies[index].usIndex = Enum122.ELITE_FACE;
      }
      gpEnemies[index].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
      gpEnemies[index].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
      gpEnemies[index].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_ELITE_NAME];
    }
    for (i = 0; i < gpAR.value.ubTroops; i++, index++) {
      gpEnemies[index].pSoldier = TacticalCreateArmyTroop();
      gpEnemies[index].uiVObjectID = gpAR.value.iFaces;
      gpEnemies[index].usIndex = Enum122.TROOP_FACE;
      gpEnemies[index].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
      gpEnemies[index].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
      gpEnemies[index].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_TROOP_NAME];
    }
    for (i = 0; i < gpAR.value.ubAdmins; i++, index++) {
      gpEnemies[index].pSoldier = TacticalCreateAdministrator();
      gpEnemies[index].uiVObjectID = gpAR.value.iFaces;
      gpEnemies[index].usIndex = Enum122.ADMIN_FACE;
      gpEnemies[index].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
      gpEnemies[index].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
      gpEnemies[index].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_ADMINISTRATOR_NAME];
    }
    AssociateEnemiesWithStrategicGroups();
  } else {
    for (i = 0, index = 0; i < gpAR.value.ubAFCreatures; i++, index++) {
      gpEnemies[index].pSoldier = TacticalCreateCreature(Enum194.ADULTFEMALEMONSTER);
      gpEnemies[index].uiVObjectID = gpAR.value.iFaces;
      gpEnemies[index].usIndex = Enum122.AF_CREATURE_FACE;
      gpEnemies[index].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
      gpEnemies[index].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
      gpEnemies[index].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
    for (i = 0; i < gpAR.value.ubAMCreatures; i++, index++) {
      gpEnemies[index].pSoldier = TacticalCreateCreature(Enum194.AM_MONSTER);
      gpEnemies[index].uiVObjectID = gpAR.value.iFaces;
      gpEnemies[index].usIndex = Enum122.AM_CREATURE_FACE;
      gpEnemies[index].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
      gpEnemies[index].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
      gpEnemies[index].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
    for (i = 0; i < gpAR.value.ubYFCreatures; i++, index++) {
      gpEnemies[index].pSoldier = TacticalCreateCreature(Enum194.YAF_MONSTER);
      gpEnemies[index].uiVObjectID = gpAR.value.iFaces;
      gpEnemies[index].usIndex = Enum122.YF_CREATURE_FACE;
      gpEnemies[index].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
      gpEnemies[index].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
      gpEnemies[index].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
    for (i = 0; i < gpAR.value.ubYMCreatures; i++, index++) {
      gpEnemies[index].pSoldier = TacticalCreateCreature(Enum194.YAM_MONSTER);
      gpEnemies[index].uiVObjectID = gpAR.value.iFaces;
      gpEnemies[index].usIndex = Enum122.YM_CREATURE_FACE;
      gpEnemies[index].pSoldier.value.sSectorX = gpAR.value.ubSectorX;
      gpEnemies[index].pSoldier.value.sSectorY = gpAR.value.ubSectorY;
      gpEnemies[index].pSoldier.value.name = gpStrategicString[Enum365.STR_AR_CREATURE_NAME];
    }
  }

  if (gpAR.value.ubSectorX == gWorldSectorX && gpAR.value.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
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
  gpAR.value.bVerticalOffset = 240 - gpAR.value.sHeight / 2 > 120 ? -40 : 0;

  // Create the buttons -- subject to relocation
  gpAR.value.iButton[Enum119.PLAY_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.PLAY_BUTTON], (gpAR.value.sCenterStartX + 11), (240 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), PlayButtonCallback);
  gpAR.value.iButton[Enum119.FAST_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.FAST_BUTTON], (gpAR.value.sCenterStartX + 51), (240 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), FastButtonCallback);
  gpAR.value.iButton[Enum119.FINISH_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.FINISH_BUTTON], (gpAR.value.sCenterStartX + 91), (240 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), FinishButtonCallback);
  gpAR.value.iButton[Enum119.PAUSE_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.PAUSE_BUTTON], (gpAR.value.sCenterStartX + 11), (274 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), PauseButtonCallback);

  gpAR.value.iButton[Enum119.RETREAT_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.RETREAT_BUTTON], (gpAR.value.sCenterStartX + 51), (274 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), RetreatButtonCallback);
  if (!gpAR.value.ubMercs) {
    DisableButton(gpAR.value.iButton[Enum119.RETREAT_BUTTON]);
  }
  SpecifyGeneralButtonTextAttributes(gpAR.value.iButton[Enum119.RETREAT_BUTTON], gpStrategicString[Enum365.STR_AR_RETREAT_BUTTON], BLOCKFONT2(), 169, FONT_NEARBLACK);

  gpAR.value.iButton[Enum119.BANDAGE_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.BANDAGE_BUTTON], (gpAR.value.sCenterStartX + 11), (245 + gpAR.value.bVerticalOffset), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BandageButtonCallback);

  gpAR.value.iButton[Enum119.DONEWIN_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.DONEWIN_BUTTON], (gpAR.value.sCenterStartX + 51), (245 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DoneButtonCallback);
  SpecifyGeneralButtonTextAttributes(gpAR.value.iButton[Enum119.DONEWIN_BUTTON], gpStrategicString[Enum365.STR_AR_DONE_BUTTON], BLOCKFONT2(), 169, FONT_NEARBLACK);

  gpAR.value.iButton[Enum119.DONELOSE_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.DONELOSE_BUTTON], (gpAR.value.sCenterStartX + 25), (245 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DoneButtonCallback);
  SpecifyGeneralButtonTextAttributes(gpAR.value.iButton[Enum119.DONELOSE_BUTTON], gpStrategicString[Enum365.STR_AR_DONE_BUTTON], BLOCKFONT2(), 169, FONT_NEARBLACK);
  gpAR.value.iButton[Enum119.YES_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.YES_BUTTON], (gpAR.value.sCenterStartX + 21), (257 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), AcceptSurrenderCallback);
  gpAR.value.iButton[Enum119.NO_BUTTON] = QuickCreateButton(gpAR.value.iButtonImage[Enum119.NO_BUTTON], (gpAR.value.sCenterStartX + 81), (257 + gpAR.value.bVerticalOffset), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), RejectSurrenderCallback);
  HideButton(gpAR.value.iButton[Enum119.YES_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.NO_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.DONEWIN_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.DONELOSE_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
  ButtonList[gpAR.value.iButton[Enum119.PLAY_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
}

function RemoveAutoResolveInterface(fDeleteForGood: boolean): void {
  let i: INT32;
  let ubCurrentRank: UINT8;
  let ubCurrentGroupID: UINT8 = 0;
  let fFirstGroup: boolean = true;

  // VtResumeSampling();

  MSYS_RemoveRegion(addressof(gpAR.value.AutoResolveRegion));
  DeleteVideoObjectFromIndex(gpAR.value.iPanelImages);
  DeleteVideoObjectFromIndex(gpAR.value.iFaces);
  DeleteVideoObjectFromIndex(gpAR.value.iIndent);
  DeleteVideoSurfaceFromIndex(gpAR.value.iInterfaceBuffer);

  if (fDeleteForGood) {
    // Delete the soldier instances -- done when we are completely finished.

    // KM: By request of AM, I have added this bleeding event in cases where autoresolve is
    //	  complete and there are bleeding mercs remaining.  AM coded the internals
    //    of the strategic event.
    for (i = 0; i < gpAR.value.ubMercs; i++) {
      if (gpMercs[i].pSoldier.value.bBleeding && gpMercs[i].pSoldier.value.bLife) {
        // ARM: only one event is needed regardless of how many are bleeding
        AddStrategicEvent(Enum132.EVENT_BANDAGE_BLEEDING_MERCS, GetWorldTotalMin() + 1, 0);
        break;
      }
    }

    // ARM: Update assignment flashing: Doctors may now have new patients or lost them all, etc.
    gfReEvaluateEveryonesNothingToDo = true;

    if (gpAR.value.pRobotCell) {
      UpdateRobotControllerGivenRobot(gpAR.value.pRobotCell.value.pSoldier);
    }
    for (i = 0; i < gpAR.value.iNumMercFaces; i++) {
      if (i >= gpAR.value.iActualMercFaces)
        TacticalRemoveSoldierPointer(gpMercs[i].pSoldier, false);
      else {
        // Record finishing information for our mercs
        if (!gpMercs[i].pSoldier.value.bLife) {
          StrategicHandlePlayerTeamMercDeath(gpMercs[i].pSoldier);

          // now remove character from a squad
          RemoveCharacterFromSquads(gpMercs[i].pSoldier);
          ChangeSoldiersAssignment(gpMercs[i].pSoldier, Enum117.ASSIGNMENT_DEAD);

          AddDeadSoldierToUnLoadedSector(gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0, gpMercs[i].pSoldier, RandomGridNo(), ADD_DEAD_SOLDIER_TO_SWEETSPOT);
        } else if (gpAR.value.ubBattleStatus == Enum120.BATTLE_SURRENDERED || gpAR.value.ubBattleStatus == Enum120.BATTLE_CAPTURED) {
          EnemyCapturesPlayerSoldier(gpMercs[i].pSoldier);
        } else if (gpAR.value.ubBattleStatus == Enum120.BATTLE_VICTORY) {
          // merc is alive, so group them at the center gridno.
          gpMercs[i].pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_CENTER;
        }
        gMercProfiles[gpMercs[i].pSoldier.value.ubProfile].usBattlesFought++;
      }
    }
    for (i = 0; i < gpAR.value.iNumMercFaces; i++) {
      if (gpAR.value.ubBattleStatus == Enum120.BATTLE_VICTORY && gpMercs[i].pSoldier.value.bLife >= OKLIFE) {
        if (gpMercs[i].pSoldier.value.ubGroupID != ubCurrentGroupID) {
          ubCurrentGroupID = gpMercs[i].pSoldier.value.ubGroupID;

          // look for NPCs to stop for, anyone is too tired to keep going, if all OK rebuild waypoints & continue movement
          // NOTE: Only the first group found will stop for NPCs, it's just too much hassle to stop them all
          PlayerGroupArrivedSafelyInSector(GetGroup(gpMercs[i].pSoldier.value.ubGroupID), fFirstGroup);
          fFirstGroup = false;
        }
      }
      gpMercs[i].pSoldier = null;
    }

    // End capture squence....
    if (gpAR.value.ubBattleStatus == Enum120.BATTLE_SURRENDERED || gpAR.value.ubBattleStatus == Enum120.BATTLE_CAPTURED) {
      EndCaptureSequence();
    }
  }
  // Delete all of the faces.
  for (i = 0; i < gpAR.value.iNumMercFaces; i++) {
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
      switch (gpCivs[i].pSoldier.value.ubSoldierClass) {
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
      if (fDeleteForGood && gpCivs[i].pSoldier.value.bLife < OKLIFE / 2) {
        AddDeadSoldierToUnLoadedSector(gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0, gpCivs[i].pSoldier, RandomGridNo(), ADD_DEAD_SOLDIER_TO_SWEETSPOT);
        StrategicRemoveMilitiaFromSector(gpAR.value.ubSectorX, gpAR.value.ubSectorY, ubCurrentRank, 1);
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_NATIVE_KILLED, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
      } else {
        let ubPromotions: UINT8;
        // this will check for promotions and handle them for you
        if (fDeleteForGood && (gpCivs[i].pSoldier.value.ubMilitiaKills > 0) && (ubCurrentRank < Enum126.ELITE_MILITIA)) {
          ubPromotions = CheckOneMilitiaForPromotion(gpAR.value.ubSectorX, gpAR.value.ubSectorY, ubCurrentRank, gpCivs[i].pSoldier.value.ubMilitiaKills);
          if (ubPromotions) {
            if (ubPromotions == 2) {
              gbGreenToElitePromotions++;
              gbMilitiaPromotions++;
            } else if (gpCivs[i].pSoldier.value.ubSoldierClass == Enum262.SOLDIER_CLASS_GREEN_MILITIA) {
              gbGreenToRegPromotions++;
              gbMilitiaPromotions++;
            } else if (gpCivs[i].pSoldier.value.ubSoldierClass == Enum262.SOLDIER_CLASS_REG_MILITIA) {
              gbRegToElitePromotions++;
              gbMilitiaPromotions++;
            }
          }
        }
      }
      TacticalRemoveSoldierPointer(gpCivs[i].pSoldier, false);
      memset(addressof(gpCivs[i]), 0, sizeof(SOLDIERCELL));
    }
  }

  // Record and process all enemy deaths
  for (i = 0; i < 32; i++) {
    if (gpEnemies[i].pSoldier) {
      if (fDeleteForGood && gpEnemies[i].pSoldier.value.bLife < OKLIFE) {
        TrackEnemiesKilled(Enum189.ENEMY_KILLED_IN_AUTO_RESOLVE, gpEnemies[i].pSoldier.value.ubSoldierClass);
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_ENEMY_KILLED, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
        ProcessQueenCmdImplicationsOfDeath(gpEnemies[i].pSoldier);
        AddDeadSoldierToUnLoadedSector(gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0, gpEnemies[i].pSoldier, RandomGridNo(), ADD_DEAD_SOLDIER_TO_SWEETSPOT);
      }
    }
  }
  // Eliminate all excess soldiers (as more than 32 can exist in the same battle.
  // Autoresolve only processes 32, so the excess is slaughtered as the player never
  // knew they existed.
  if (fDeleteForGood) {
    // Warp the game time accordingly
    if (gpAR.value.ubBattleStatus == Enum120.BATTLE_VICTORY) {
      // Get rid of any extra enemies that could be here.  It is possible for the number of total enemies to exceed 32, but
      // autoresolve can only process 32.  We basically cheat by eliminating the rest of them.
      EliminateAllEnemies(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
    } else {
      // The enemy won, so repoll movement.
      ResetMovementForEnemyGroupsInLocation(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
    }
  }
  // Physically delete the soldiers now.
  for (i = 0; i < 32; i++) {
    if (gpEnemies[i].pSoldier) {
      TacticalRemoveSoldierPointer(gpEnemies[i].pSoldier, false);
      memset(addressof(gpEnemies[i]), 0, sizeof(SOLDIERCELL));
    }
  }

  for (i = 0; i < Enum119.NUM_AR_BUTTONS; i++) {
    UnloadButtonImage(gpAR.value.iButtonImage[i]);
    RemoveButton(gpAR.value.iButton[i]);
  }
  if (fDeleteForGood) {
    // Warp the game time accordingly

    WarpGameTime(gpAR.value.uiTotalElapsedBattleTimeInMilliseconds / 1000, Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS);

    // Deallocate all of the global memory.
    // Everything internal to them, should have already been deleted.
    MemFree(gpAR);
    gpAR = null;

    MemFree(gpMercs);
    gpMercs = null;

    MemFree(gpCivs);
    gpCivs = null;

    MemFree(gpEnemies);
    gpEnemies = null;
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

function PauseButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.value.iButton[Enum119.PLAY_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.FAST_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.FINISH_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.value.fPaused = true;
  }
}

function PlayButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.value.iButton[Enum119.PAUSE_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.FAST_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.FINISH_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.value.uiTimeSlice = 1000 * gpAR.value.ubTimeModifierPercentage / 100;
    gpAR.value.fPaused = false;
  }
}

function FastButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.value.iButton[Enum119.PAUSE_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.PLAY_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.FINISH_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.value.uiTimeSlice = 4000;
    gpAR.value.fPaused = false;
  }
}

function FinishButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[gpAR.value.iButton[Enum119.PAUSE_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.PLAY_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[gpAR.value.iButton[Enum119.FAST_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    gpAR.value.uiTimeSlice = 0xffffffff;
    gpAR.value.fSound = false;
    gpAR.value.fPaused = false;
    PlayJA2StreamingSample(Enum330.AUTORESOLVE_FINISHFX, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  }
}

function RetreatButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let i: INT32;
    for (i = 0; i < gpAR.value.ubMercs; i++) {
      if (!(gpMercs[i].uiFlags & (CELL_RETREATING | CELL_RETREATED))) {
        gpMercs[i].uiFlags |= CELL_RETREATING | CELL_DIRTY;
        // Gets to retreat after a total of 2 attacks.
        gpMercs[i].usNextAttack = ((1000 + gpMercs[i].usNextAttack * 2 + PreRandom(2000 - gpMercs[i].usAttack)) * 2);
        gpAR.value.usPlayerAttack -= gpMercs[i].usAttack;
        gpMercs[i].usAttack = 0;
      }
    }
    if (gpAR.value.pRobotCell) {
      // if robot is retreating, set the retreat time to be the same as the robot's controller.
      let ubRobotControllerID: UINT8;

      ubRobotControllerID = gpAR.value.pRobotCell.value.pSoldier.value.ubRobotRemoteHolderID;

      if (ubRobotControllerID == NOBODY) {
        gpAR.value.pRobotCell.value.uiFlags &= ~CELL_RETREATING;
        gpAR.value.pRobotCell.value.uiFlags |= CELL_DIRTY;
        gpAR.value.pRobotCell.value.usNextAttack = 0xffff;
        return;
      }
      for (i = 0; i < gpAR.value.ubMercs; i++) {
        if (ubRobotControllerID == gpMercs[i].pSoldier.value.ubID) {
          // Found the controller, make the robot's retreat time match the contollers.
          gpAR.value.pRobotCell.value.usNextAttack = gpMercs[i].usNextAttack;
          return;
        }
      }
    }
  }
}

function DetermineBandageButtonState(): void {
  let i: INT32;
  let pKit: Pointer<OBJECTTYPE> = null;
  let fFound: boolean = false;

  // Does anyone need bandaging?
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    if (gpMercs[i].pSoldier.value.bBleeding && gpMercs[i].pSoldier.value.bLife) {
      fFound = true;
      break;
    }
  }
  if (!fFound) {
    DisableButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
    SetButtonFastHelpText(gpAR.value.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[11]);
    return;
  }

  // Do we have any doctors?
  fFound = false;
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    if (gpMercs[i].pSoldier.value.bLife >= OKLIFE && !gpMercs[i].pSoldier.value.bCollapsed && gpMercs[i].pSoldier.value.bMedical > 0) {
      fFound = true;
    }
  }
  if (!fFound) {
    // No doctors
    DisableButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
    SetButtonFastHelpText(gpAR.value.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[8]);
    return;
  }

  // Do have a kit?
  pKit = FindMedicalKit();
  if (!pKit) {
    // No kits
    DisableButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
    SetButtonFastHelpText(gpAR.value.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[9]);
    return;
  }

  // Allow bandaging.
  EnableButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
  SetButtonFastHelpText(gpAR.value.iButton[Enum119.BANDAGE_BUTTON], gzLateLocalizedString[12]);
}

function BandageButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    AutoBandageMercs();
    SetupDoneInterface();
  }
}

function DoneButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gpAR.value.fExitAutoResolve = true;
  }
}

function MercCellMouseMoveCallback(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  // Find the merc with the same region.
  let i: INT32;
  let pCell: Pointer<SOLDIERCELL> = null;
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    if (gpMercs[i].pRegion == reg) {
      pCell = addressof(gpMercs[i]);
      break;
    }
  }
  Assert(pCell);
  if (gpAR.value.fPendingSurrender) {
    // Can't setup retreats when pending surrender.
    pCell.value.uiFlags &= ~CELL_SHOWRETREATTEXT;
    pCell.value.uiFlags |= CELL_DIRTY;
    return;
  }
  if (reg.value.uiFlags & MSYS_MOUSE_IN_AREA) {
    if (!(pCell.value.uiFlags & CELL_SHOWRETREATTEXT))
      pCell.value.uiFlags |= CELL_SHOWRETREATTEXT | CELL_DIRTY;
  } else {
    if (pCell.value.uiFlags & CELL_SHOWRETREATTEXT) {
      pCell.value.uiFlags &= ~CELL_SHOWRETREATTEXT;
      pCell.value.uiFlags |= CELL_DIRTY;
    }
  }
}

function MercCellMouseClickCallback(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // Find the merc with the same region.
    let i: INT32;
    let pCell: Pointer<SOLDIERCELL> = null;

    if (gpAR.value.fPendingSurrender) {
      // Can't setup retreats when pending surrender.
      return;
    }

    for (i = 0; i < gpAR.value.ubMercs; i++) {
      if (gpMercs[i].pRegion == reg) {
        pCell = addressof(gpMercs[i]);
        break;
      }
    }

    if (pCell.value.uiFlags & (CELL_RETREATING | CELL_RETREATED)) {
      // already retreated/retreating.
      return;
    }

    Assert(pCell);

    if (pCell == gpAR.value.pRobotCell) {
      // robot retreats only when controller retreats
      return;
    }

    pCell.value.uiFlags |= CELL_RETREATING | CELL_DIRTY;
    // Gets to retreat after a total of 2 attacks.
    pCell.value.usNextAttack = ((1000 + pCell.value.usNextAttack * 5 + PreRandom(2000 - pCell.value.usAttack)) * 2);
    gpAR.value.usPlayerAttack -= pCell.value.usAttack;
    pCell.value.usAttack = 0;

    if (gpAR.value.pRobotCell) {
      // if controller is retreating, make the robot retreat too.
      let ubRobotControllerID: UINT8;

      ubRobotControllerID = gpAR.value.pRobotCell.value.pSoldier.value.ubRobotRemoteHolderID;

      if (ubRobotControllerID == NOBODY) {
        gpAR.value.pRobotCell.value.uiFlags &= ~CELL_RETREATING;
        gpAR.value.pRobotCell.value.uiFlags |= CELL_DIRTY;
        gpAR.value.pRobotCell.value.usNextAttack = 0xffff;
      } else if (ubRobotControllerID == pCell.value.pSoldier.value.ubID) {
        // Found the controller, make the robot's retreat time match the contollers.
        gpAR.value.pRobotCell.value.uiFlags |= CELL_RETREATING | CELL_DIRTY;
        gpAR.value.pRobotCell.value.usNextAttack = pCell.value.usNextAttack;
        gpAR.value.usPlayerAttack -= gpAR.value.pRobotCell.value.usAttack;
        gpAR.value.pRobotCell.value.usAttack = 0;
        return;
      }
    }
  }
}

// Determine how many players, militia, and enemies that are going at it, and use these values
// to figure out how many rows and columns we can use.  The will effect the size of the panel.
function CalculateAutoResolveInfo(): void {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP>;
  Assert(gpAR.value.ubSectorX >= 1 && gpAR.value.ubSectorX <= 16);
  Assert(gpAR.value.ubSectorY >= 1 && gpAR.value.ubSectorY <= 16);

  if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
    GetNumberOfEnemiesInSector(gpAR.value.ubSectorX, gpAR.value.ubSectorY, addressof(gpAR.value.ubAdmins), addressof(gpAR.value.ubTroops), addressof(gpAR.value.ubElites));
    gpAR.value.ubEnemies = Math.min(gpAR.value.ubAdmins + gpAR.value.ubTroops + gpAR.value.ubElites, 32);
  } else {
    if (gfTransferTacticalOppositionToAutoResolve) {
      DetermineCreatureTownCompositionBasedOnTacticalInformation(addressof(gubNumCreaturesAttackingTown), addressof(gpAR.value.ubYMCreatures), addressof(gpAR.value.ubYFCreatures), addressof(gpAR.value.ubAMCreatures), addressof(gpAR.value.ubAFCreatures));
    } else {
      DetermineCreatureTownComposition(gubNumCreaturesAttackingTown, addressof(gpAR.value.ubYMCreatures), addressof(gpAR.value.ubYFCreatures), addressof(gpAR.value.ubAMCreatures), addressof(gpAR.value.ubAFCreatures));
    }
    gpAR.value.ubEnemies = Math.min(gpAR.value.ubYMCreatures + gpAR.value.ubYFCreatures + gpAR.value.ubAMCreatures + gpAR.value.ubAFCreatures, 32);
  }
  gfTransferTacticalOppositionToAutoResolve = false;
  gpAR.value.ubCivs = CountAllMilitiaInSector(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
  gpAR.value.ubMercs = 0;
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  pGroup = gpGroupList;
  while (pGroup) {
    if (PlayerGroupInvolvedInThisCombat(pGroup)) {
      pPlayer = pGroup.value.pPlayerList;
      while (pPlayer) {
        // NOTE: Must check each merc individually, e.g. Robot without controller is an uninvolved merc on an involved group!
        if (PlayerMercInvolvedInThisCombat(pPlayer.value.pSoldier)) {
          gpMercs[gpAR.value.ubMercs].pSoldier = pPlayer.value.pSoldier;

          //!!! CLEAR OPPCOUNT HERE.  All of these soldiers are guaranteed to not be in tactical anymore.
          // ClearOppCount( pPlayer->pSoldier );

          gpAR.value.ubMercs++;
          if (AM_AN_EPC(pPlayer.value.pSoldier)) {
            gpAR.value.fCaptureNotPermittedDueToEPCs = true;
          }
          if (AM_A_ROBOT(pPlayer.value.pSoldier)) {
            gpAR.value.pRobotCell = addressof(gpMercs[gpAR.value.ubMercs - 1]);
            UpdateRobotControllerGivenRobot(gpAR.value.pRobotCell.value.pSoldier);
          }
        }
        pPlayer = pPlayer.value.next;
      }
    }
    pGroup = pGroup.value.next;
  }
  gpAR.value.iNumMercFaces = gpAR.value.ubMercs;
  gpAR.value.iActualMercFaces = gpAR.value.ubMercs;

  CalculateRowsAndColumns();
}

function ResetAutoResolveInterface(): void {
  guiPreRandomIndex = gpAR.value.uiPreRandomIndex;

  RemoveAutoResolveInterface(false);

  gpAR.value.ubBattleStatus = Enum120.BATTLE_IN_PROGRESS;

  if (!gpAR.value.ubCivs && !gpAR.value.ubMercs)
    gpAR.value.ubCivs = 1;

  // Make sure the number of enemy portraits is the same as needed.
  // The debug keypresses may add or remove more than one at a time.
  while (gpAR.value.ubElites + gpAR.value.ubAdmins + gpAR.value.ubTroops > gpAR.value.ubEnemies) {
    switch (PreRandom(5)) {
      case 0:
        if (gpAR.value.ubElites) {
          gpAR.value.ubElites--;
          break;
        }
      case 1:
      case 2:
        if (gpAR.value.ubAdmins) {
          gpAR.value.ubAdmins--;
          break;
        }
      case 3:
      case 4:
        if (gpAR.value.ubTroops) {
          gpAR.value.ubTroops--;
          break;
        }
    }
  }
  while (gpAR.value.ubElites + gpAR.value.ubAdmins + gpAR.value.ubTroops < gpAR.value.ubEnemies) {
    switch (PreRandom(5)) {
      case 0:
        gpAR.value.ubElites++;
        break;
      case 1:
      case 2:
        gpAR.value.ubAdmins++;
        break;
      case 3:
      case 4:
        gpAR.value.ubTroops++;
        break;
    }
  }

  // Do the same for the player mercs.
  while (gpAR.value.iNumMercFaces > gpAR.value.ubMercs && gpAR.value.iNumMercFaces > gpAR.value.iActualMercFaces) {
    // Removing temp mercs
    gpAR.value.iNumMercFaces--;
    TacticalRemoveSoldierPointer(gpMercs[gpAR.value.iNumMercFaces].pSoldier, false);
    gpMercs[gpAR.value.iNumMercFaces].pSoldier = null;
  }
  while (gpAR.value.iNumMercFaces < gpAR.value.ubMercs && gpAR.value.iNumMercFaces >= gpAR.value.iActualMercFaces) {
    CreateTempPlayerMerc();
  }

  if (gpAR.value.uiTimeSlice == 0xffffffff) {
    gpAR.value.fSound = true;
  }
  gpAR.value.uiTimeSlice = 1000;
  gpAR.value.uiTotalElapsedBattleTimeInMilliseconds = 0;
  gpAR.value.uiCurrTime = 0;
  gpAR.value.fPlayerRejectedSurrenderOffer = false;
  gpAR.value.fPendingSurrender = false;
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
  if (!gpAR.value.ubMercs) {
    // 0
    gpAR.value.ubMercCols = gpAR.value.ubMercRows = 0;
  } else if (gpAR.value.ubMercs < 5) {
    // 1-4
    gpAR.value.ubMercCols = 1;
    gpAR.value.ubMercRows = gpAR.value.ubMercs;
  } else if (gpAR.value.ubMercs < 9 || gpAR.value.ubMercs == 10) {
    // 5-8, 10
    gpAR.value.ubMercCols = 2;
    gpAR.value.ubMercRows = (gpAR.value.ubMercs + 1) / 2;
  } else if (gpAR.value.ubMercs < 16) {
    // 9, 11-15
    gpAR.value.ubMercCols = 3;
    gpAR.value.ubMercRows = (gpAR.value.ubMercs + 2) / 3;
  } else {
    // 16-MAX_STRATEGIC_TEAM_SIZE
    gpAR.value.ubMercCols = 4;
    gpAR.value.ubMercRows = (gpAR.value.ubMercs + 3) / 4;
  }

  if (!gpAR.value.ubCivs) {
    gpAR.value.ubCivCols = gpAR.value.ubCivRows = 0;
  } else if (gpAR.value.ubCivs < 5) {
    // 1-4
    gpAR.value.ubCivCols = 1;
    gpAR.value.ubCivRows = gpAR.value.ubCivs;
  } else if (gpAR.value.ubCivs < 9 || gpAR.value.ubCivs == 10) {
    // 5-8, 10
    gpAR.value.ubCivCols = 2;
    gpAR.value.ubCivRows = (gpAR.value.ubCivs + 1) / 2;
  } else if (gpAR.value.ubCivs < 16) {
    // 9, 11-15
    gpAR.value.ubCivCols = 3;
    gpAR.value.ubCivRows = (gpAR.value.ubCivs + 2) / 3;
  } else {
    // 16-MAX_ALLOWABLE_MILITIA_PER_SECTOR
    gpAR.value.ubCivCols = 4;
    gpAR.value.ubCivRows = (gpAR.value.ubCivs + 3) / 4;
  }

  if (!gpAR.value.ubEnemies) {
    gpAR.value.ubEnemyCols = gpAR.value.ubEnemyRows = 0;
  } else if (gpAR.value.ubEnemies < 5) {
    // 1-4
    gpAR.value.ubEnemyCols = 1;
    gpAR.value.ubEnemyRows = gpAR.value.ubEnemies;
  } else if (gpAR.value.ubEnemies < 9 || gpAR.value.ubEnemies == 10) {
    // 5-8, 10
    gpAR.value.ubEnemyCols = 2;
    gpAR.value.ubEnemyRows = (gpAR.value.ubEnemies + 1) / 2;
  } else if (gpAR.value.ubEnemies < 16) {
    // 9, 11-15
    gpAR.value.ubEnemyCols = 3;
    gpAR.value.ubEnemyRows = (gpAR.value.ubEnemies + 2) / 3;
  } else {
    // 16-32
    gpAR.value.ubEnemyCols = 4;
    gpAR.value.ubEnemyRows = (gpAR.value.ubEnemies + 3) / 4;
  }

  // Now, that we have the number of mercs, militia, and enemies, it is possible that there
  // may be some conflicts.  Our goal is to make the window as small as possible.  Bumping up
  // the number of columns to 5 or rows to 10 will force one or both axes to go full screen.  If we
  // have high numbers of both, then we will have to.

  // Step one:  equalize the number of columns for both the mercs and civs.
  if (gpAR.value.ubMercs && gpAR.value.ubCivs && gpAR.value.ubMercCols != gpAR.value.ubCivCols) {
    if (gpAR.value.ubMercCols < gpAR.value.ubCivCols) {
      gpAR.value.ubMercCols = gpAR.value.ubCivCols;
      gpAR.value.ubMercRows = (gpAR.value.ubMercs + gpAR.value.ubMercCols - 1) / gpAR.value.ubMercCols;
    } else {
      gpAR.value.ubCivCols = gpAR.value.ubMercCols;
      gpAR.value.ubCivRows = (gpAR.value.ubCivs + gpAR.value.ubCivCols - 1) / gpAR.value.ubCivCols;
    }
  }
  // If we have both mercs and militia, we must make sure that the height to width ratio is never higher than
  // a factor of two.
  if (gpAR.value.ubMercs && gpAR.value.ubCivs && gpAR.value.ubMercRows + gpAR.value.ubCivRows > 4) {
    if (gpAR.value.ubMercCols * 2 < gpAR.value.ubMercRows + gpAR.value.ubCivRows) {
      gpAR.value.ubMercCols++;
      gpAR.value.ubMercRows = (gpAR.value.ubMercs + gpAR.value.ubMercCols - 1) / gpAR.value.ubMercCols;
      gpAR.value.ubCivCols++;
      gpAR.value.ubCivRows = (gpAR.value.ubCivs + gpAR.value.ubCivCols - 1) / gpAR.value.ubCivCols;
    }
  }

  if (gpAR.value.ubMercRows + gpAR.value.ubCivRows > 9) {
    if (gpAR.value.ubMercCols < 5) {
      // bump it up
      gpAR.value.ubMercCols++;
      gpAR.value.ubMercRows = (gpAR.value.ubMercs + gpAR.value.ubMercCols - 1) / gpAR.value.ubMercCols;
    }
    if (gpAR.value.ubCivCols < 5) {
      // match it up with the mercs
      gpAR.value.ubCivCols = gpAR.value.ubMercCols;
      gpAR.value.ubCivRows = (gpAR.value.ubCivs + gpAR.value.ubCivCols - 1) / gpAR.value.ubCivCols;
    }
  }

  if (gpAR.value.ubMercCols + gpAR.value.ubEnemyCols == 9)
    gpAR.value.sWidth = 640;
  else
    gpAR.value.sWidth = 146 + 55 * (Math.max(Math.max(gpAR.value.ubMercCols, gpAR.value.ubCivCols), 2) + Math.max(gpAR.value.ubEnemyCols, 2));

  gpAR.value.sCenterStartX = 323 - gpAR.value.sWidth / 2 + Math.max(Math.max(gpAR.value.ubMercCols, 2), Math.max(gpAR.value.ubCivCols, 2)) * 55;

  // Anywhere from 48*3 to 48*10
  gpAR.value.sHeight = 48 * Math.max(3, Math.max(gpAR.value.ubMercRows + gpAR.value.ubCivRows, gpAR.value.ubEnemyRows));
  // Make it an even multiple of 40 (rounding up).
  gpAR.value.sHeight += 39;
  gpAR.value.sHeight /= 40;
  gpAR.value.sHeight *= 40;

  // Here is a extremely bitchy case.  The formulae throughout this module work for most cases.
  // However, when combining mercs and civs, the column must be the same.  However, we retract that
  // in cases where there are less mercs than available to fill up *most* of the designated space.
  if (gpAR.value.ubMercs && gpAR.value.ubCivs) {
    if (gpAR.value.ubMercRows * gpAR.value.ubMercCols > gpAR.value.ubMercs + gpAR.value.ubMercRows)
      gpAR.value.ubMercCols--;
    if (gpAR.value.ubCivRows * gpAR.value.ubCivCols > gpAR.value.ubCivs + gpAR.value.ubCivRows)
      gpAR.value.ubCivCols--;
  }
}

function HandleAutoResolveInput(): void {
  let InputEvent: InputAtom = createInputAtom();
  let fResetAutoResolve: boolean = false;
  while (DequeueEvent(addressof(InputEvent))) {
    if (InputEvent.usEvent == KEY_DOWN || InputEvent.usEvent == KEY_REPEAT) {
      switch (InputEvent.usParam) {
        case SPACE:
          gpAR.value.fPaused ^= true;
          if (gpAR.value.fPaused) {
            ButtonList[gpAR.value.iButton[Enum119.PAUSE_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
            ButtonList[gpAR.value.iButton[Enum119.PLAY_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
            ButtonList[gpAR.value.iButton[Enum119.FAST_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
            ButtonList[gpAR.value.iButton[Enum119.FINISH_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
          } else {
            ButtonList[gpAR.value.iButton[Enum119.PAUSE_BUTTON]].value.uiFlags &= ~BUTTON_CLICKED_ON;
            ButtonList[gpAR.value.iButton[Enum119.PLAY_BUTTON]].value.uiFlags |= BUTTON_CLICKED_ON;
          }
          break;
        case 'x':
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

function RenderSoldierCellHealth(pCell: Pointer<SOLDIERCELL>): void {
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
  pSrcBuf = LockVideoSurface(gpAR.value.iInterfaceBuffer, addressof(uiSrcPitchBYTES));
  xp = pCell.value.xp + 2;
  yp = pCell.value.yp + 32;
  Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, xp, yp, xp - gpAR.value.Rect.iLeft, yp - gpAR.value.Rect.iTop, 46, 10);
  UnLockVideoSurface(gpAR.value.iInterfaceBuffer);
  UnLockVideoSurface(FRAME_BUFFER);

  if (pCell.value.pSoldier.value.bLife) {
    if (pCell.value.pSoldier.value.bLife == pCell.value.pSoldier.value.bLifeMax) {
      cntStart = 4;
    } else {
      cntStart = 0;
    }
    for (cnt = cntStart; cnt < 6; cnt++) {
      if (pCell.value.pSoldier.value.bLife < bHealthStrRanges[cnt]) {
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
    if (cnt > 3 && pCell.value.pSoldier.value.bLife != pCell.value.pSoldier.value.bLifeMax) {
      // Merc has taken damage, even though his life if good.
      usColor = FONT_YELLOW;
    }
    if (pCell.value.pSoldier.value.bLife == pCell.value.pSoldier.value.bLifeMax)
      usColor = FONT_GRAY1;
    pStr = zHealthStr[cnt];
  } else {
    str = pCell.value.pSoldier.value.name;
    pStr = _wcsupr(str);
    usColor = FONT_BLACK;
  }

  // Draw the retreating text, if applicable
  if (pCell.value.uiFlags & CELL_RETREATED && gpAR.value.ubBattleStatus != Enum120.BATTLE_VICTORY) {
    usColor = FONT_LTGREEN;
    str = gpStrategicString[Enum365.STR_AR_MERC_RETREATED];
    pStr = str;
  } else if (pCell.value.uiFlags & CELL_RETREATING && gpAR.value.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS) {
    if (pCell.value.pSoldier.value.bLife >= OKLIFE) {
      // Retreating is shared with the status string.  Alternate between the
      // two every 450 milliseconds
      if (GetJA2Clock() % 900 < 450) {
        // override the health string with the retreating string.
        usColor = FONT_LTRED;
        str = gpStrategicString[Enum365.STR_AR_MERC_RETREATING];
        pStr = str;
      }
    }
  } else if (pCell.value.uiFlags & CELL_SHOWRETREATTEXT && gpAR.value.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS) {
    if (pCell.value.pSoldier.value.bLife >= OKLIFE) {
      SetFontForeground(FONT_YELLOW);
      str = gpStrategicString[Enum365.STR_AR_MERC_RETREAT];
      xp = pCell.value.xp + 25 - StringPixLength(pStr, SMALLCOMPFONT()) / 2;
      yp = pCell.value.yp + 12;
      mprintf(xp, yp, str);
    }
  }
  SetFontForeground(usColor);
  xp = pCell.value.xp + 25 - StringPixLength(pStr, SMALLCOMPFONT()) / 2;
  yp = pCell.value.yp + 33;
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

function CreateTempPlayerMerc(): void {
  let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  /* static */ let iSoldierCount: INT32 = 0;
  let ubID: UINT8;

  // Init the merc create structure with basic information
  memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
  MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
  MercCreateStruct.ubProfile = GetUnusedMercProfileID();
  MercCreateStruct.sSectorX = gpAR.value.ubSectorX;
  MercCreateStruct.sSectorY = gpAR.value.ubSectorY;
  MercCreateStruct.bSectorZ = 0;
  MercCreateStruct.fPlayerMerc = true;
  MercCreateStruct.fCopyProfileItemsOver = true;

  // Create the player soldier

  gpMercs[gpAR.value.iNumMercFaces].pSoldier = TacticalCreateSoldier(addressof(MercCreateStruct), addressof(ubID));
  if (gpMercs[gpAR.value.iNumMercFaces].pSoldier) {
    gpAR.value.iNumMercFaces++;
  }
}

function DetermineTeamLeader(fFriendlyTeam: boolean): void {
  let i: INT32;
  let pBestLeaderCell: Pointer<SOLDIERCELL> = null;
  // For each team (civs and players count as same team), find the merc with the best
  // leadership ability.
  if (fFriendlyTeam) {
    gpAR.value.ubPlayerLeadership = 0;
    for (i = 0; i < gpAR.value.ubMercs; i++) {
      if (gpMercs[i].pSoldier.value.bLeadership > gpAR.value.ubPlayerLeadership) {
        gpAR.value.ubPlayerLeadership = gpMercs[i].pSoldier.value.bLeadership;
        pBestLeaderCell = addressof(gpMercs[i]);
      }
    }
    for (i = 0; i < gpAR.value.ubCivs; i++) {
      if (gpCivs[i].pSoldier.value.bLeadership > gpAR.value.ubPlayerLeadership) {
        gpAR.value.ubPlayerLeadership = gpCivs[i].pSoldier.value.bLeadership;
        pBestLeaderCell = addressof(gpCivs[i]);
      }
    }

    if (pBestLeaderCell) {
      // Assign the best leader the honour of team leader.
      pBestLeaderCell.value.uiFlags |= CELL_TEAMLEADER;
    }
    return;
  }
  // ENEMY TEAM
  gpAR.value.ubEnemyLeadership = 0;
  for (i = 0; i < gpAR.value.ubEnemies; i++) {
    if (gpEnemies[i].pSoldier.value.bLeadership > gpAR.value.ubEnemyLeadership) {
      gpAR.value.ubEnemyLeadership = gpEnemies[i].pSoldier.value.bLeadership;
      pBestLeaderCell = addressof(gpEnemies[i]);
    }
  }
  if (pBestLeaderCell) {
    // Assign the best enemy leader the honour of team leader
    pBestLeaderCell.value.uiFlags |= CELL_TEAMLEADER;
  }
}

function ResetNextAttackCounter(pCell: Pointer<SOLDIERCELL>): void {
  pCell.value.usNextAttack = Math.min(1000 - pCell.value.usAttack, 800);
  pCell.value.usNextAttack = (1000 + pCell.value.usNextAttack * 5 + PreRandom(2000 - pCell.value.usAttack));
  if (pCell.value.uiFlags & CELL_CREATURE) {
    pCell.value.usNextAttack = pCell.value.usNextAttack * 8 / 10;
  }
}

function CalculateAttackValues(): void {
  let i: INT32;
  let pCell: Pointer<SOLDIERCELL>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usBonus: UINT16;
  let usBestAttack: UINT16 = 0xffff;
  let usBreathStrengthPercentage: UINT16;
  // INT16 sOutnumberBonus = 0;
  let sMaxBonus: INT16 = 0;
  // PLAYER TEAM
  gpAR.value.usPlayerAttack = 0;
  gpAR.value.usPlayerDefence = 0;

  // if( gpAR->ubEnemies )
  //{
  //	//bonus equals 20 if good guys outnumber bad guys 2 to 1.
  //	sMaxBonus = 20;
  //	sOutnumberBonus = (INT16)(gpAR->ubMercs + gpAR->ubCivs) * sMaxBonus / gpAR->ubEnemies - sMaxBonus;
  //	sOutnumberBonus = (INT16)min( sOutnumberBonus, max( sMaxBonus, 0 ) );
  //}

  for (i = 0; i < gpAR.value.ubMercs; i++) {
    pCell = addressof(gpMercs[i]);
    pSoldier = pCell.value.pSoldier;
    if (!pSoldier.value.bLife)
      continue;
    pCell.value.usAttack = pSoldier.value.bStrength + pSoldier.value.bDexterity + pSoldier.value.bWisdom + pSoldier.value.bMarksmanship + pSoldier.value.bMorale;
    // Give player controlled mercs a significant bonus to compensate for lack of control
    // as the player would typically do much better in tactical.
    if (pCell.value.usAttack < 1000) {
      // A player with 500 attack will be augmented to 625
      // A player with 600 attack will be augmented to 700
      pCell.value.usAttack = (pCell.value.usAttack + (1000 - pCell.value.usAttack) / 4);
    }
    usBreathStrengthPercentage = 100 - (100 - pCell.value.pSoldier.value.bBreathMax) / 3;
    pCell.value.usAttack = pCell.value.usAttack * usBreathStrengthPercentage / 100;
    pCell.value.usDefence = pSoldier.value.bAgility + pSoldier.value.bWisdom + pSoldier.value.bBreathMax + pSoldier.value.bMedical + pSoldier.value.bMorale;
    // 100 team leadership adds a bonus of 10%,
    usBonus = 100 + gpAR.value.ubPlayerLeadership / 10; // + sOutnumberBonus;

    // bExpLevel adds a bonus of 7% per level after 2, level 1 soldiers get a 7% decrease
    // usBonus += 7 * (pSoldier->bExpLevel-2);
    usBonus += gpAR.value.ubPlayerDefenceAdvantage;
    pCell.value.usAttack = pCell.value.usAttack * usBonus / 100;
    pCell.value.usDefence = pCell.value.usDefence * usBonus / 100;

    if (pCell.value.uiFlags & CELL_EPC) {
      // strengthen the defense (seeing the mercs will keep them safe).
      pCell.value.usAttack = 0;
      pCell.value.usDefence = 1000;
    }

    pCell.value.usAttack = Math.min(pCell.value.usAttack, 1000);
    pCell.value.usDefence = Math.min(pCell.value.usDefence, 1000);

    gpAR.value.usPlayerAttack += pCell.value.usAttack;
    gpAR.value.usPlayerDefence += pCell.value.usDefence;
    ResetNextAttackCounter(pCell);
    if (i > 8) {
      // Too many mercs, delay attack entry of extra mercs.
      pCell.value.usNextAttack += ((i - 8) * 2000);
    }
    if (pCell.value.usNextAttack < usBestAttack)
      usBestAttack = pCell.value.usNextAttack;
  }
  // CIVS
  for (i = 0; i < gpAR.value.ubCivs; i++) {
    pCell = addressof(gpCivs[i]);
    pSoldier = pCell.value.pSoldier;
    pCell.value.usAttack = pSoldier.value.bStrength + pSoldier.value.bDexterity + pSoldier.value.bWisdom + pSoldier.value.bMarksmanship + pSoldier.value.bMorale;
    pCell.value.usAttack = pCell.value.usAttack * pSoldier.value.bBreath / 100;
    pCell.value.usDefence = pSoldier.value.bAgility + pSoldier.value.bWisdom + pSoldier.value.bBreathMax + pSoldier.value.bMedical + pSoldier.value.bMorale;
    // 100 team leadership adds a bonus of 10%
    usBonus = 100 + gpAR.value.ubPlayerLeadership / 10; // + sOutnumberBonus;
    // bExpLevel adds a bonus of 7% per level after 2, level 1 soldiers get a 7% decrease
    // usBonus += 7 * (pSoldier->bExpLevel-2);
    usBonus += gpAR.value.ubPlayerDefenceAdvantage;
    pCell.value.usAttack = pCell.value.usAttack * usBonus / 100;
    pCell.value.usDefence = pCell.value.usDefence * usBonus / 100;

    pCell.value.usAttack = Math.min(pCell.value.usAttack, 1000);
    pCell.value.usDefence = Math.min(pCell.value.usDefence, 1000);

    gpAR.value.usPlayerAttack += pCell.value.usAttack;
    gpAR.value.usPlayerDefence += pCell.value.usDefence;
    ResetNextAttackCounter(pCell);
    if (i > 6) {
      // Too many militia, delay attack entry of extra mercs.
      pCell.value.usNextAttack += ((i - 4) * 2000);
    }
    if (pCell.value.usNextAttack < usBestAttack)
      usBestAttack = pCell.value.usNextAttack;
  }
  // ENEMIES
  gpAR.value.usEnemyAttack = 0;
  gpAR.value.usEnemyDefence = 0;
  // if( gpAR->ubMercs + gpAR->ubCivs )
  //{
  //	//bonus equals 20 if good guys outnumber bad guys 2 to 1.
  //	sMaxBonus = 20;
  //	sOutnumberBonus = (INT16)gpAR->ubEnemies * sMaxBonus / (gpAR->ubMercs + gpAR->ubCivs) - sMaxBonus;
  //	sOutnumberBonus = (INT16)min( sOutnumberBonus, max( sMaxBonus, 0 ) );
  //}

  for (i = 0; i < gpAR.value.ubEnemies; i++) {
    pCell = addressof(gpEnemies[i]);
    pSoldier = pCell.value.pSoldier;
    pCell.value.usAttack = pSoldier.value.bStrength + pSoldier.value.bDexterity + pSoldier.value.bWisdom + pSoldier.value.bMarksmanship + pSoldier.value.bMorale;
    pCell.value.usAttack = pCell.value.usAttack * pSoldier.value.bBreath / 100;
    pCell.value.usDefence = pSoldier.value.bAgility + pSoldier.value.bWisdom + pSoldier.value.bBreathMax + pSoldier.value.bMedical + pSoldier.value.bMorale;
    // 100 team leadership adds a bonus of 10%
    usBonus = 100 + gpAR.value.ubPlayerLeadership / 10; // + sOutnumberBonus;
    // bExpLevel adds a bonus of 7% per level after 2, level 1 soldiers get a 7% decrease
    // usBonus += 7 * (pSoldier->bExpLevel-2);
    usBonus += gpAR.value.ubEnemyDefenceAdvantage;
    pCell.value.usAttack = pCell.value.usAttack * usBonus / 100;
    pCell.value.usDefence = pCell.value.usDefence * usBonus / 100;

    pCell.value.usAttack = Math.min(pCell.value.usAttack, 1000);
    pCell.value.usDefence = Math.min(pCell.value.usDefence, 1000);

    gpAR.value.usEnemyAttack += pCell.value.usAttack;
    gpAR.value.usEnemyDefence += pCell.value.usDefence;
    ResetNextAttackCounter(pCell);

    if (i > 4 && !(pCell.value.uiFlags & CELL_CREATURE)) {
      // Too many enemies, delay attack entry of extra mercs.
      pCell.value.usNextAttack += ((i - 4) * 1000);
    }

    if (pCell.value.usNextAttack < usBestAttack)
      usBestAttack = pCell.value.usNextAttack;
  }
  // Now, because we are starting a new battle, we want to get the ball rolling a bit earlier.  So,
  // we will take the usBestAttack value and subtract 60% of it from everybody's next attack.
  usBestAttack = usBestAttack * 60 / 100;
  for (i = 0; i < gpAR.value.ubMercs; i++)
    gpMercs[i].usNextAttack -= usBestAttack;
  for (i = 0; i < gpAR.value.ubCivs; i++)
    gpCivs[i].usNextAttack -= usBestAttack;
  for (i = 0; i < gpAR.value.ubEnemies; i++)
    gpEnemies[i].usNextAttack -= usBestAttack;
}

function DrawDebugText(pCell: Pointer<SOLDIERCELL>): void {
  let xp: INT32;
  let yp: INT32;
  if (!gpAR.value.fDebugInfo)
    return;
  SetFont(SMALLCOMPFONT());
  SetFontForeground(FONT_WHITE);
  xp = pCell.value.xp + 4;
  yp = pCell.value.yp + 4;
  if (pCell.value.uiFlags & CELL_TEAMLEADER) {
    // debug str
    mprintf(xp, yp, "LEADER");
    yp += 9;
  }
  mprintf(xp, yp, "AT: %d", pCell.value.usAttack);
  yp += 9;
  mprintf(xp, yp, "DF: %d", pCell.value.usDefence);
  yp += 9;

  xp = pCell.value.xp;
  yp = pCell.value.yp - 4;
  SetFont(LARGEFONT1());
  SetFontShadow(FONT_NEARBLACK);
  if (pCell.value.uiFlags & CELL_FIREDATTARGET) {
    SetFontForeground(FONT_YELLOW);
    mprintf(xp, yp, "FIRE");
    pCell.value.uiFlags &= ~CELL_FIREDATTARGET;
    yp += 13;
  }
  if (pCell.value.uiFlags & CELL_DODGEDATTACK) {
    SetFontForeground(FONT_BLUE);
    mprintf(xp, yp, "MISS");
    pCell.value.uiFlags &= ~CELL_DODGEDATTACK;
    yp += 13;
  }
  if (pCell.value.uiFlags & CELL_HITBYATTACKER) {
    SetFontForeground(FONT_RED);
    mprintf(xp, yp, "HIT");
    pCell.value.uiFlags &= ~CELL_HITBYATTACKER;
    yp += 13;
  }
}

function ChooseTarget(pAttacker: Pointer<SOLDIERCELL>): Pointer<SOLDIERCELL> {
  let iAvailableTargets: INT32;
  let index: INT32;
  let iRandom: INT32 = -1;
  let pTarget: Pointer<SOLDIERCELL> = null;
  let usSavedDefence: UINT16;
  // Determine what team we are attacking
  if (pAttacker.value.uiFlags & (CELL_ENEMY | CELL_CREATURE)) {
    // enemy team attacking a player
    iAvailableTargets = gpAR.value.ubMercs + gpAR.value.ubCivs;
    index = 0;
    usSavedDefence = gpAR.value.usPlayerDefence;
    while (iAvailableTargets) {
      pTarget = (index < gpAR.value.ubMercs) ? addressof(gpMercs[index]) : addressof(gpCivs[index - gpAR.value.ubMercs]);
      if (!pTarget.value.pSoldier.value.bLife || pTarget.value.uiFlags & CELL_RETREATED) {
        index++;
        iAvailableTargets--;
        continue;
      }
      iRandom = PreRandom(gpAR.value.usPlayerDefence);
      gpAR.value.usPlayerDefence -= pTarget.value.usDefence;
      if (iRandom < pTarget.value.usDefence) {
        gpAR.value.usPlayerDefence = usSavedDefence;
        return pTarget;
      }
      index++;
      iAvailableTargets--;
    }
    if (!IsBattleOver()) {
      AssertMsg(0, String("***Please send PRIOR save and screenshot of this message***  iAvailableTargets %d, index %d, iRandom %d, defence %d. ", iAvailableTargets, index, iRandom, gpAR.value.usPlayerDefence));
    }
  } else {
    // player team attacking an enemy
    iAvailableTargets = gpAR.value.ubEnemies;
    index = 0;
    usSavedDefence = gpAR.value.usEnemyDefence;
    while (iAvailableTargets) {
      pTarget = addressof(gpEnemies[index]);
      if (!pTarget.value.pSoldier.value.bLife) {
        index++;
        iAvailableTargets--;
        continue;
      }
      iRandom = PreRandom(gpAR.value.usEnemyDefence);
      gpAR.value.usEnemyDefence -= pTarget.value.usDefence;
      if (iRandom < pTarget.value.usDefence) {
        gpAR.value.usEnemyDefence = usSavedDefence;
        return pTarget;
      }
      index++;
      iAvailableTargets--;
    }
  }
  AssertMsg(0, "Error in ChooseTarget logic for choosing enemy target.");
  return null;
}

function FireAShot(pAttacker: Pointer<SOLDIERCELL>): boolean {
  let pItem: Pointer<OBJECTTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;

  pSoldier = pAttacker.value.pSoldier;

  if (pAttacker.value.uiFlags & CELL_MALECREATURE) {
    PlayAutoResolveSample(Enum330.ACR_SPIT, RATE_11025, 50, 1, MIDDLEPAN);
    pAttacker.value.bWeaponSlot = Enum261.SECONDHANDPOS;
    return true;
  }
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    pItem = addressof(pSoldier.value.inv[i]);

    if (Item[pItem.value.usItem].usItemClass == IC_GUN) {
      pAttacker.value.bWeaponSlot = i;
      if (gpAR.value.fUnlimitedAmmo) {
        PlayAutoResolveSample(Weapon[pItem.value.usItem].sSound, RATE_11025, 50, 1, MIDDLEPAN);
        return true;
      }
      if (!pItem.value.ubGunShotsLeft) {
        AutoReload(pSoldier);
        if (pItem.value.ubGunShotsLeft && Weapon[pItem.value.usItem].sLocknLoadSound) {
          PlayAutoResolveSample(Weapon[pItem.value.usItem].sLocknLoadSound, RATE_11025, 50, 1, MIDDLEPAN);
        }
      }
      if (pItem.value.ubGunShotsLeft) {
        PlayAutoResolveSample(Weapon[pItem.value.usItem].sSound, RATE_11025, 50, 1, MIDDLEPAN);
        if (pAttacker.value.uiFlags & CELL_MERC) {
          gMercProfiles[pAttacker.value.pSoldier.value.ubProfile].usShotsFired++;
          // MARKSMANSHIP GAIN: Attacker fires a shot

          StatChange(pAttacker.value.pSoldier, MARKAMT, 3, false);
        }
        pItem.value.ubGunShotsLeft--;
        return true;
      }
    }
  }
  pAttacker.value.bWeaponSlot = -1;
  return false;
}

function AttackerHasKnife(pAttacker: Pointer<SOLDIERCELL>): boolean {
  let i: INT32;
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    if (Item[pAttacker.value.pSoldier.value.inv[i].usItem].usItemClass == IC_BLADE) {
      pAttacker.value.bWeaponSlot = i;
      return true;
    }
  }
  pAttacker.value.bWeaponSlot = -1;
  return false;
}

function TargetHasLoadedGun(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  let i: INT32;
  let pItem: Pointer<OBJECTTYPE>;
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    pItem = addressof(pSoldier.value.inv[i]);
    if (Item[pItem.value.usItem].usItemClass == IC_GUN) {
      if (gpAR.value.fUnlimitedAmmo) {
        return true;
      }
      if (pItem.value.ubGunShotsLeft) {
        return true;
      }
    }
  }
  return false;
}

function AttackTarget(pAttacker: Pointer<SOLDIERCELL>, pTarget: Pointer<SOLDIERCELL>): void {
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

  pAttacker.value.uiFlags |= CELL_FIREDATTARGET | CELL_DIRTY;
  if (pAttacker.value.usAttack < 950)
    usAttack = (pAttacker.value.usAttack + PreRandom(1000 - pAttacker.value.usAttack));
  else
    usAttack = (950 + PreRandom(50));
  if (pTarget.value.uiFlags & CELL_RETREATING && !(pAttacker.value.uiFlags & CELL_FEMALECREATURE)) {
    // Attacking a retreating merc is harder.  Modify the attack value to 70% of it's value.
    // This allows retreaters to have a better chance of escaping.
    usAttack = usAttack * 7 / 10;
  }
  if (pTarget.value.usDefence < 950)
    usDefence = (pTarget.value.usDefence + PreRandom(1000 - pTarget.value.usDefence));
  else
    usDefence = (950 + PreRandom(50));
  if (pAttacker.value.uiFlags & CELL_FEMALECREATURE) {
    pAttacker.value.bWeaponSlot = Enum261.HANDPOS;
    fMelee = true;
    fClaw = true;
  } else if (!FireAShot(pAttacker)) {
    // Maybe look for a weapon, such as a knife or grenade?
    fMelee = true;
    fKnife = AttackerHasKnife(pAttacker);
    if (TargetHasLoadedGun(pTarget.value.pSoldier)) {
      // Penalty to attack with melee weapons against target with loaded gun.
      if (!(pAttacker.value.uiFlags & CELL_CREATURE)) {
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
    if (!pTarget.value.usNextHit[0]) {
      bAttackIndex = 0;
    } else if (!pTarget.value.usNextHit[1]) {
      bAttackIndex = 1;
    } else if (!pTarget.value.usNextHit[2]) {
      bAttackIndex = 2;
    }
    if (bAttackIndex != -1) {
      pTarget.value.usNextHit[bAttackIndex] = (50 + PreRandom(400));
      pTarget.value.pAttacker[bAttackIndex] = pAttacker;
    }
  }
  if (usAttack < usDefence) {
    if (pTarget.value.pSoldier.value.bLife >= OKLIFE || !PreRandom(5)) {
      // Attacker misses -- use up a round of ammo.  If target is unconcious, then 80% chance of hitting.
      pTarget.value.uiFlags |= CELL_DODGEDATTACK | CELL_DIRTY;
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
        if (pTarget.value.uiFlags & CELL_MERC)
          // AGILITY GAIN: Target "dodged" an attack
          StatChange(pTarget.value.pSoldier, AGILAMT, 5, false);
      }
      return;
    }
  }
  // Attacker hits
  if (!fMelee) {
    ubImpact = Weapon[pAttacker.value.pSoldier.value.inv[pAttacker.value.bWeaponSlot].usItem].ubImpact;
    iRandom = PreRandom(100);
    if (iRandom < 15)
      ubLocation = AIM_SHOT_HEAD;
    else if (iRandom < 30)
      ubLocation = AIM_SHOT_LEGS;
    else
      ubLocation = AIM_SHOT_TORSO;
    ubAccuracy = ((usAttack - usDefence + PreRandom(usDefence - pTarget.value.usDefence)) / 10);
    iImpact = BulletImpact(pAttacker.value.pSoldier, pTarget.value.pSoldier, ubLocation, ubImpact, ubAccuracy, null);

    if (bAttackIndex == -1) {
      // tack damage on to end of last hit
      pTarget.value.usHitDamage[2] += iImpact;
    } else {
      pTarget.value.usHitDamage[bAttackIndex] = iImpact;
    }
  } else {
    let pItem: Pointer<OBJECTTYPE>;
    let tempItem: OBJECTTYPE = createObjectType();
    PlayAutoResolveSample((Enum330.BULLET_IMPACT_1 + PreRandom(3)), RATE_11025, 50, 1, MIDDLEPAN);
    if (!pTarget.value.pSoldier.value.bLife) {
      // Soldier already dead (can't kill him again!)
      return;
    }

    ubAccuracy = ((usAttack - usDefence + PreRandom(usDefence - pTarget.value.usDefence)) / 10);

    // Determine attacking weapon.
    pAttacker.value.pSoldier.value.usAttackingWeapon = 0;
    if (pAttacker.value.bWeaponSlot != -1) {
      pItem = addressof(pAttacker.value.pSoldier.value.inv[pAttacker.value.bWeaponSlot]);
      if (Item[pItem.value.usItem].usItemClass & IC_WEAPON)
        pAttacker.value.pSoldier.value.usAttackingWeapon = pAttacker.value.pSoldier.value.inv[pAttacker.value.bWeaponSlot].usItem;
    }

    if (pAttacker.value.bWeaponSlot != Enum261.HANDPOS) {
      // switch items
      memcpy(addressof(tempItem), addressof(pAttacker.value.pSoldier.value.inv[Enum261.HANDPOS]), sizeof(OBJECTTYPE));
      memcpy(addressof(pAttacker.value.pSoldier.value.inv[Enum261.HANDPOS]), addressof(pAttacker.value.pSoldier.value.inv[pAttacker.value.bWeaponSlot]), sizeof(OBJECTTYPE));
      iImpact = HTHImpact(pAttacker.value.pSoldier, pTarget.value.pSoldier, ubAccuracy, (fKnife | fClaw));
      memcpy(addressof(pAttacker.value.pSoldier.value.inv[pAttacker.value.bWeaponSlot]), addressof(pAttacker.value.pSoldier.value.inv[Enum261.HANDPOS]), sizeof(OBJECTTYPE));
      memcpy(addressof(pAttacker.value.pSoldier.value.inv[Enum261.HANDPOS]), addressof(tempItem), sizeof(OBJECTTYPE));
    } else {
      iImpact = HTHImpact(pAttacker.value.pSoldier, pTarget.value.pSoldier, ubAccuracy, (fKnife || fClaw));
    }

    iNewLife = pTarget.value.pSoldier.value.bLife - iImpact;

    if (pAttacker.value.uiFlags & CELL_MERC) {
      // Attacker is a player, so increment the number of shots that hit.
      gMercProfiles[pAttacker.value.pSoldier.value.ubProfile].usShotsHit++;
      // MARKSMANSHIP GAIN: Attacker's shot hits
      StatChange(pAttacker.value.pSoldier, MARKAMT, 6, false); // in addition to 3 for taking a shot
    }
    if (pTarget.value.uiFlags & CELL_MERC) {
      // Target is a player, so increment the times he has been wounded.
      gMercProfiles[pTarget.value.pSoldier.value.ubProfile].usTimesWounded++;
      // EXPERIENCE GAIN: Took some damage
      StatChange(pTarget.value.pSoldier, EXPERAMT, (5 * (iImpact / 10)), false);
    }
    if (pTarget.value.pSoldier.value.bLife >= CONSCIOUSNESS || pTarget.value.uiFlags & CELL_CREATURE) {
      if (gpAR.value.fSound)
        DoMercBattleSound(pTarget.value.pSoldier, (Enum259.BATTLE_SOUND_HIT1 + PreRandom(2)));
    }
    if (!(pTarget.value.uiFlags & CELL_CREATURE) && iNewLife < OKLIFE && pTarget.value.pSoldier.value.bLife >= OKLIFE) {
      // the hit caused the merc to fall.  Play the falling sound
      PlayAutoResolveSample(Enum330.FALL_1, RATE_11025, 50, 1, MIDDLEPAN);
      pTarget.value.uiFlags &= ~CELL_RETREATING;
    }
    if (iNewLife <= 0) {
      // soldier has been killed
      if (pAttacker.value.uiFlags & CELL_MERC) {
        // Player killed the enemy soldier -- update his stats as well as any assisters.
        gMercProfiles[pAttacker.value.pSoldier.value.ubProfile].usKills++;
        gStrategicStatus.usPlayerKills++;
      } else if (pAttacker.value.uiFlags & CELL_MILITIA) {
        pAttacker.value.pSoldier.value.ubMilitiaKills += 2;
      }
      if (pTarget.value.uiFlags & CELL_MERC && gpAR.value.fSound) {
        PlayAutoResolveSample(Enum330.DOORCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        PlayAutoResolveSample(Enum330.HEADCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      }
    }
    // Adjust the soldiers stats based on the damage.
    pTarget.value.pSoldier.value.bLife = Math.max(iNewLife, 0);
    if (pTarget.value.uiFlags & CELL_MERC && gpAR.value.pRobotCell) {
      UpdateRobotControllerGivenRobot(gpAR.value.pRobotCell.value.pSoldier);
    }
    if (fKnife || fClaw) {
      if (pTarget.value.pSoldier.value.bLifeMax - pTarget.value.pSoldier.value.bBleeding - iImpact >= pTarget.value.pSoldier.value.bLife)
        pTarget.value.pSoldier.value.bBleeding += iImpact;
      else
        pTarget.value.pSoldier.value.bBleeding = (pTarget.value.pSoldier.value.bLifeMax - pTarget.value.pSoldier.value.bLife);
    }
    if (!pTarget.value.pSoldier.value.bLife) {
      gpAR.value.fRenderAutoResolve = true;
          if (pTarget.value.uiFlags & CELL_MERC) {
        gpAR.value.usPlayerAttack -= pTarget.value.usAttack;
        gpAR.value.usPlayerDefence -= pTarget.value.usDefence;
        gpAR.value.ubAliveMercs--;
        pTarget.value.usAttack = 0;
        pTarget.value.usDefence = 0;
      } else if (pTarget.value.uiFlags & CELL_MILITIA) {
        gpAR.value.usPlayerAttack -= pTarget.value.usAttack;
        gpAR.value.usPlayerDefence -= pTarget.value.usDefence;
        gpAR.value.ubAliveCivs--;
        pTarget.value.usAttack = 0;
        pTarget.value.usDefence = 0;
      } else if (pTarget.value.uiFlags & (CELL_ENEMY | CELL_CREATURE)) {
        gpAR.value.usEnemyAttack -= pTarget.value.usAttack;
        gpAR.value.usEnemyDefence -= pTarget.value.usDefence;
        gpAR.value.ubAliveEnemies--;
        pTarget.value.usAttack = 0;
        pTarget.value.usDefence = 0;
      }
    }
    pTarget.value.uiFlags |= CELL_HITBYATTACKER | CELL_DIRTY;
  }
}

function TargetHitCallback(pTarget: Pointer<SOLDIERCELL>, index: INT32): void {
  let iNewLife: INT32;
  let pAttacker: Pointer<SOLDIERCELL>;
  if (!pTarget.value.pSoldier.value.bLife) {
    // Soldier already dead (can't kill him again!)
    return;
  }
  pAttacker = pTarget.value.pAttacker[index];

  // creatures get damage reduction bonuses
  switch (pTarget.value.pSoldier.value.ubBodyType) {
    case Enum194.LARVAE_MONSTER:
    case Enum194.INFANT_MONSTER:
      break;
    case Enum194.YAF_MONSTER:
    case Enum194.YAM_MONSTER:
      pTarget.value.usHitDamage[index] = (pTarget.value.usHitDamage[index] + 2) / 4;
      break;
    case Enum194.ADULTFEMALEMONSTER:
    case Enum194.AM_MONSTER:
      pTarget.value.usHitDamage[index] = (pTarget.value.usHitDamage[index] + 3) / 6;
      break;
    case Enum194.QUEENMONSTER:
      pTarget.value.usHitDamage[index] = (pTarget.value.usHitDamage[index] + 4) / 8;
      break;
  }

  iNewLife = pTarget.value.pSoldier.value.bLife - pTarget.value.usHitDamage[index];
  if (!pTarget.value.usHitDamage[index]) {
    // bullet missed -- play a ricochet sound.
    if (pTarget.value.uiFlags & CELL_MERC)
      // AGILITY GAIN: Target "dodged" an attack
      StatChange(pTarget.value.pSoldier, AGILAMT, 5, false);
    PlayAutoResolveSample(Enum330.MISS_1 + PreRandom(8), RATE_11025, 50, 1, MIDDLEPAN);
    return;
  }

  if (pAttacker.value.uiFlags & CELL_MERC) {
    // Attacker is a player, so increment the number of shots that hit.
    gMercProfiles[pAttacker.value.pSoldier.value.ubProfile].usShotsHit++;
    // MARKSMANSHIP GAIN: Attacker's shot hits
    StatChange(pAttacker.value.pSoldier, MARKAMT, 6, false); // in addition to 3 for taking a shot
  }
  if (pTarget.value.uiFlags & CELL_MERC && pTarget.value.usHitDamage[index]) {
    // Target is a player, so increment the times he has been wounded.
    gMercProfiles[pTarget.value.pSoldier.value.ubProfile].usTimesWounded++;
    // EXPERIENCE GAIN: Took some damage
    StatChange(pTarget.value.pSoldier, EXPERAMT, (5 * (pTarget.value.usHitDamage[index] / 10)), false);
  }

  // bullet hit -- play an impact sound and a merc hit sound
  PlayAutoResolveSample((Enum330.BULLET_IMPACT_1 + PreRandom(3)), RATE_11025, 50, 1, MIDDLEPAN);

  if (pTarget.value.pSoldier.value.bLife >= CONSCIOUSNESS) {
    if (gpAR.value.fSound)
      DoMercBattleSound(pTarget.value.pSoldier, (Enum259.BATTLE_SOUND_HIT1 + PreRandom(2)));
  }
  if (iNewLife < OKLIFE && pTarget.value.pSoldier.value.bLife >= OKLIFE) {
    // the hit caused the merc to fall.  Play the falling sound
    PlayAutoResolveSample(Enum330.FALL_1, RATE_11025, 50, 1, MIDDLEPAN);
    pTarget.value.uiFlags &= ~CELL_RETREATING;
  }
  if (iNewLife <= 0) {
    // soldier has been killed
    if (pTarget.value.pAttacker[index].value.uiFlags & CELL_PLAYER) {
      // Player killed the enemy soldier -- update his stats as well as any assisters.
      let pKiller: Pointer<SOLDIERCELL>;
      let pAssister1: Pointer<SOLDIERCELL>;
      let pAssister2: Pointer<SOLDIERCELL>;
      pKiller = pTarget.value.pAttacker[index];
      pAssister1 = pTarget.value.pAttacker[index < 2 ? index + 1 : 0];
      pAssister2 = pTarget.value.pAttacker[index > 0 ? index - 1 : 2];
      if (pKiller == pAssister1)
        pAssister1 = null;
      if (pKiller == pAssister2)
        pAssister2 = null;
      if (pAssister1 == pAssister2)
        pAssister2 = null;
      if (pKiller) {
        if (pKiller.value.uiFlags & CELL_MERC) {
          gMercProfiles[pKiller.value.pSoldier.value.ubProfile].usKills++;
          gStrategicStatus.usPlayerKills++;
          // EXPERIENCE CLASS GAIN:  Earned a kill
          StatChange(pKiller.value.pSoldier, EXPERAMT, (10 * pTarget.value.pSoldier.value.bLevel), false);
          HandleMoraleEvent(pKiller.value.pSoldier, Enum234.MORALE_KILLED_ENEMY, gpAR.value.ubSectorX, gpAR.value.ubSectorY, 0);
        } else if (pKiller.value.uiFlags & CELL_MILITIA)
          pKiller.value.pSoldier.value.ubMilitiaKills += 2;
      }
      if (pAssister1) {
        if (pAssister1.value.uiFlags & CELL_MERC) {
          gMercProfiles[pAssister1.value.pSoldier.value.ubProfile].usAssists++;
          // EXPERIENCE CLASS GAIN:  Earned an assist
          StatChange(pAssister1.value.pSoldier, EXPERAMT, (5 * pTarget.value.pSoldier.value.bLevel), false);
        } else if (pAssister1.value.uiFlags & CELL_MILITIA)
          pAssister1.value.pSoldier.value.ubMilitiaKills++;
      } else if (pAssister2) {
        if (pAssister2.value.uiFlags & CELL_MERC) {
          gMercProfiles[pAssister2.value.pSoldier.value.ubProfile].usAssists++;
          // EXPERIENCE CLASS GAIN:  Earned an assist
          StatChange(pAssister2.value.pSoldier, EXPERAMT, (5 * pTarget.value.pSoldier.value.bLevel), false);
        } else if (pAssister2.value.uiFlags & CELL_MILITIA)
          pAssister2.value.pSoldier.value.ubMilitiaKills++;
      }
    }
    if (pTarget.value.uiFlags & CELL_MERC && gpAR.value.fSound) {
      PlayAutoResolveSample(Enum330.DOORCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      PlayAutoResolveSample(Enum330.HEADCR_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    }
    if (iNewLife < -60 && !(pTarget.value.uiFlags & CELL_CREATURE)) {
      // High damage death
      if (gpAR.value.fSound) {
        if (PreRandom(3))
          PlayAutoResolveSample(Enum330.BODY_SPLAT_1, RATE_11025, 50, 1, MIDDLEPAN);
        else
          PlayAutoResolveSample(Enum330.HEADSPLAT_1, RATE_11025, 50, 1, MIDDLEPAN);
      }
    } else {
      // Normal death
      if (gpAR.value.fSound) {
        DoMercBattleSound(pTarget.value.pSoldier, Enum259.BATTLE_SOUND_DIE1);
      }
    }
  }
  // Adjust the soldiers stats based on the damage.
  pTarget.value.pSoldier.value.bLife = Math.max(iNewLife, 0);
  if (pTarget.value.uiFlags & CELL_MERC && gpAR.value.pRobotCell) {
    UpdateRobotControllerGivenRobot(gpAR.value.pRobotCell.value.pSoldier);
  }

  if (pTarget.value.pSoldier.value.bLifeMax - pTarget.value.pSoldier.value.bBleeding - pTarget.value.usHitDamage[index] >= pTarget.value.pSoldier.value.bLife)
    pTarget.value.pSoldier.value.bBleeding += pTarget.value.usHitDamage[index];
  else
    pTarget.value.pSoldier.value.bBleeding = (pTarget.value.pSoldier.value.bLifeMax - pTarget.value.pSoldier.value.bLife);
  if (!pTarget.value.pSoldier.value.bLife) {
    gpAR.value.fRenderAutoResolve = true;
    if (pTarget.value.uiFlags & CELL_MERC) {
      gpAR.value.usPlayerAttack -= pTarget.value.usAttack;
      gpAR.value.usPlayerDefence -= pTarget.value.usDefence;
      gpAR.value.ubAliveMercs--;
      pTarget.value.usAttack = 0;
      pTarget.value.usDefence = 0;
    } else if (pTarget.value.uiFlags & CELL_MILITIA) {
      gpAR.value.usPlayerAttack -= pTarget.value.usAttack;
      gpAR.value.usPlayerDefence -= pTarget.value.usDefence;
      gpAR.value.ubAliveCivs--;
      pTarget.value.usAttack = 0;
      pTarget.value.usDefence = 0;
    } else if (pTarget.value.uiFlags & (CELL_ENEMY | CELL_CREATURE)) {
      gpAR.value.usEnemyAttack -= pTarget.value.usAttack;
      gpAR.value.usEnemyDefence -= pTarget.value.usDefence;
      gpAR.value.ubAliveEnemies--;
      pTarget.value.usAttack = 0;
      pTarget.value.usDefence = 0;
    }
  }
  pTarget.value.uiFlags |= CELL_HITBYATTACKER | CELL_DIRTY;
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
  if (gpAR.value.ubBattleStatus != Enum120.BATTLE_IN_PROGRESS)
    return true;
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    if (!(gpMercs[i].uiFlags & CELL_RETREATED) && gpMercs[i].pSoldier.value.bLife) {
      if (!(gpMercs[i].uiFlags & CELL_EPC)) {
        fOnlyEPCsLeft = false;
        iNumInvolvedMercs++;
      }
    }
    if (gpMercs[i].uiFlags & CELL_RETREATED) {
      iNumMercsRetreated++;
    }
  }
  if (gpAR.value.pRobotCell) {
    // Do special robot checks
    let pRobot: Pointer<SOLDIERTYPE>;
    pRobot = gpAR.value.pRobotCell.value.pSoldier;
    if (pRobot.value.ubRobotRemoteHolderID == NOBODY) {
      // Robot can't fight anymore.
      gpAR.value.usPlayerAttack -= gpAR.value.pRobotCell.value.usAttack;
      gpAR.value.pRobotCell.value.usAttack = 0;
      if (iNumInvolvedMercs == 1 && !gpAR.value.ubAliveCivs) {
        // Robot is the only one left in battle, so instantly kill him.
        DoMercBattleSound(pRobot, Enum259.BATTLE_SOUND_DIE1);
        pRobot.value.bLife = 0;
        gpAR.value.ubAliveMercs--;
        iNumInvolvedMercs = 0;
      }
    }
  }
  if (!gpAR.value.ubAliveCivs && !iNumInvolvedMercs && iNumMercsRetreated) {
    // RETREATED
    gpAR.value.ubBattleStatus = Enum120.BATTLE_RETREAT;

    // wake everyone up
    WakeUpAllMercsInSectorUnderAttack();

    RetreatAllInvolvedPlayerGroups();
  } else if (!gpAR.value.ubAliveCivs && !iNumInvolvedMercs) {
    // DEFEAT
    if (fOnlyEPCsLeft) {
      // Kill the EPCs.
      for (i = 0; i < gpAR.value.ubMercs; i++) {
        if (gpMercs[i].uiFlags & CELL_EPC) {
          DoMercBattleSound(gpMercs[i].pSoldier, Enum259.BATTLE_SOUND_DIE1);
          gpMercs[i].pSoldier.value.bLife = 0;
          gpAR.value.ubAliveMercs--;
        }
      }
    }
    for (i = 0; i < gpAR.value.ubEnemies; i++) {
      if (gpEnemies[i].pSoldier.value.bLife) {
        if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
          DoMercBattleSound(gpEnemies[i].pSoldier, Enum259.BATTLE_SOUND_LAUGH1);
        } else {
          PlayJA2Sample(Enum330.ACR_EATFLESH, RATE_11025, 50, 1, MIDDLEPAN);
        }
        break;
      }
    }
    gpAR.value.ubBattleStatus = Enum120.BATTLE_DEFEAT;
  } else if (!gpAR.value.ubAliveEnemies) {
    // VICTORY
    gpAR.value.ubBattleStatus = Enum120.BATTLE_VICTORY;
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
  if (GetWorldDay() < STARTDAY_ALLOW_PLAYER_CAPTURE_FOR_RESCUE && !gpAR.value.fAllowCapture) {
    return false;
  }
  if (gpAR.value.fPlayerRejectedSurrenderOffer) {
    return false;
  }
  if (gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE) {
    return false;
  }
  if (gpAR.value.fCaptureNotPermittedDueToEPCs) {
    // EPCs make things much more difficult when considering capture.  Simply don't allow it.
    return false;
  }
  // Only attempt capture of mercs if there are 2 or 3 of them alive
  if (gpAR.value.ubAliveCivs || gpAR.value.ubAliveMercs < 2 || gpAR.value.ubAliveMercs > 3) {
    return false;
  }
  // if the number of alive enemies doesn't double the number of alive mercs, don't offer surrender.
  if (gpAR.value.ubAliveEnemies < gpAR.value.ubAliveMercs * 2) {
    return false;
  }
  // make sure that these enemies are actually concious!
  iConciousEnemies = 0;
  for (i = 0; i < gpAR.value.ubEnemies; i++) {
    if (gpEnemies[i].pSoldier.value.bLife >= OKLIFE) {
      iConciousEnemies++;
    }
  }
  if (iConciousEnemies < gpAR.value.ubAliveMercs * 2) {
    return false;
  }

  // So far, the conditions are right.  Now, we will determine if the the remaining players are
  // wounded and/or unconcious.  If any are concious, we will prompt for a surrender, otherwise,
  // it is automatic.
  fConcious = false;
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    // if any of the 2 or 3 mercs has more than 60% life, then return.
    if (gpMercs[i].uiFlags & CELL_ROBOT) {
      return false;
    }
    if (gpMercs[i].pSoldier.value.bLife * 100 > gpMercs[i].pSoldier.value.bLifeMax * 60) {
      return false;
    }
    if (gpMercs[i].pSoldier.value.bLife >= OKLIFE) {
      fConcious = true;
    }
  }
  if (fConcious) {
    if (PreRandom(100) < 2) {
      SetupSurrenderInterface();
    }
  } else if (PreRandom(100) < 25) {
    BeginCaptureSquence();

    gpAR.value.ubBattleStatus = Enum120.BATTLE_CAPTURED;
    gpAR.value.fRenderAutoResolve = true;
    SetupDoneInterface();
  }
  return true;
}

function SetupDoneInterface(): void {
  let i: INT32;
  gpAR.value.fRenderAutoResolve = true;

  HideButton(gpAR.value.iButton[Enum119.PAUSE_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.PLAY_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.FAST_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.FINISH_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.RETREAT_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.YES_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.NO_BUTTON]);
  if (gpAR.value.ubBattleStatus == Enum120.BATTLE_VICTORY && gpAR.value.ubAliveMercs) {
    ShowButton(gpAR.value.iButton[Enum119.DONEWIN_BUTTON]);
    ShowButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
  } else {
    ShowButton(gpAR.value.iButton[Enum119.DONELOSE_BUTTON]);
  }
  DetermineBandageButtonState();
  for (i = 0; i < gpAR.value.ubMercs; i++) {
    // So they can't retreat!
    MSYS_DisableRegion(gpMercs[i].pRegion);
  }
}

function SetupSurrenderInterface(): void {
  HideButton(gpAR.value.iButton[Enum119.PAUSE_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.PLAY_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.FAST_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.FINISH_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.RETREAT_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.DONEWIN_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.DONELOSE_BUTTON]);
  ShowButton(gpAR.value.iButton[Enum119.YES_BUTTON]);
  ShowButton(gpAR.value.iButton[Enum119.NO_BUTTON]);
  gpAR.value.fRenderAutoResolve = true;
  gpAR.value.fPendingSurrender = true;
}

function HideSurrenderInterface(): void {
  HideButton(gpAR.value.iButton[Enum119.PAUSE_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.PLAY_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.FAST_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.FINISH_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.RETREAT_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.BANDAGE_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.DONEWIN_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.DONELOSE_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.YES_BUTTON]);
  HideButton(gpAR.value.iButton[Enum119.NO_BUTTON]);
  gpAR.value.fPendingSurrender = false;
  gpAR.value.fRenderAutoResolve = true;
}

function AcceptSurrenderCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    BeginCaptureSquence();

    gpAR.value.ubBattleStatus = Enum120.BATTLE_SURRENDERED;
    gpAR.value.fPendingSurrender = false;
    SetupDoneInterface();
  }
}

function RejectSurrenderCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gpAR.value.fPlayerRejectedSurrenderOffer = true;
    HideSurrenderInterface();
  }
}

function ProcessBattleFrame(): void {
  let iRandom: INT32;
  let i: INT32;
  let pAttacker: Pointer<SOLDIERCELL>;
  let pTarget: Pointer<SOLDIERCELL>;
  let uiDiff: UINT32;
  /* static */ let iTimeSlice: INT32 = 0;
  /* static */ let fContinue: boolean = false;
  /* static */ let uiSlice: UINT32 = 0;
  /* static */ let iTotal: INT32 = 0;
  /* static */ let iMercs: INT32 = 0;
  /* static */ let iCivs: INT32 = 0;
  /* static */ let iEnemies: INT32 = 0;
  /* static */ let iMercsLeft: INT32 = 0;
  /* static */ let iCivsLeft: INT32 = 0;
  /* static */ let iEnemiesLeft: INT32 = 0;
  let found: boolean = false;
  let iTime: INT32;
  let iAttacksThisFrame: INT32;

  pAttacker = null;
  iAttacksThisFrame = 0;

  if (fContinue) {
    gpAR.value.uiCurrTime = GetJA2Clock();
    fContinue = false;
    goto("CONTINUE_BATTLE");
  }
  // determine how much real-time has passed since the last frame
  if (gpAR.value.uiCurrTime) {
    gpAR.value.uiPrevTime = gpAR.value.uiCurrTime;
    gpAR.value.uiCurrTime = GetJA2Clock();
  } else {
    gpAR.value.uiCurrTime = GetJA2Clock();
    return;
  }
  if (gpAR.value.fPaused)
    return;

  uiDiff = gpAR.value.uiCurrTime - gpAR.value.uiPrevTime;
  if (gpAR.value.uiTimeSlice < 0xffffffff) {
    iTimeSlice = uiDiff * gpAR.value.uiTimeSlice / 1000;
  } else {
    // largest positive signed value
    iTimeSlice = 0x7fffffff;
  }

  while (iTimeSlice > 0) {
    uiSlice = Math.min(iTimeSlice, 1000);
    if (gpAR.value.ubBattleStatus == Enum120.BATTLE_IN_PROGRESS)
      gpAR.value.uiTotalElapsedBattleTimeInMilliseconds += uiSlice;

    // Now process each of the players
    iTotal = gpAR.value.ubMercs + gpAR.value.ubCivs + gpAR.value.ubEnemies + 1;
    iMercs = iMercsLeft = gpAR.value.ubMercs;
    iCivs = iCivsLeft = gpAR.value.ubCivs;
    iEnemies = iEnemiesLeft = gpAR.value.ubEnemies;
    for (i = 0; i < gpAR.value.ubMercs; i++)
      gpMercs[i].uiFlags &= ~CELL_PROCESSED;
    for (i = 0; i < gpAR.value.ubCivs; i++)
      gpCivs[i].uiFlags &= ~CELL_PROCESSED;
    for (i = 0; i < gpAR.value.ubEnemies; i++)
      gpEnemies[i].uiFlags &= ~CELL_PROCESSED;
    while (--iTotal) {
      let cnt: INT32;
      if (iTimeSlice != 0x7fffffff && GetJA2Clock() > gpAR.value.uiCurrTime + 17 || !gpAR.value.fInstantFinish && iAttacksThisFrame > (gpAR.value.ubMercs + gpAR.value.ubCivs + gpAR.value.ubEnemies) / 4) {
        // We have spent too much time in here.  In order to maintain 60FPS, we will
        // leave now, which will allow for updating of the graphics (and mouse cursor),
        // and all of the necessary locals are saved via static variables.  It'll check
        // the fContinue flag, and goto the CONTINUE_BATTLE label the next time this function
        // is called.
        fContinue = true;
        return;
      }
    CONTINUE_BATTLE:
      if (IsBattleOver() || gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE && AttemptPlayerCapture())
        return;

      iRandom = PreRandom(iTotal);
      found = false;
      if (iMercs && iRandom < iMercsLeft) {
        iMercsLeft--;
        while (!found) {
          iRandom = PreRandom(iMercs);
          pAttacker = addressof(gpMercs[iRandom]);
          if (!(pAttacker.value.uiFlags & CELL_PROCESSED)) {
            pAttacker.value.uiFlags |= CELL_PROCESSED;
            found = true;
          }
        }
      } else if (iCivs && iRandom < iMercsLeft + iCivsLeft) {
        iCivsLeft--;
        while (!found) {
          iRandom = PreRandom(iCivs);
          pAttacker = addressof(gpCivs[iRandom]);
          if (!(pAttacker.value.uiFlags & CELL_PROCESSED)) {
            pAttacker.value.uiFlags |= CELL_PROCESSED;
            found = true;
          }
        }
      } else if (iEnemies && iEnemiesLeft) {
        iEnemiesLeft--;
        while (!found) {
          iRandom = PreRandom(iEnemies);
          pAttacker = addressof(gpEnemies[iRandom]);
          if (!(pAttacker.value.uiFlags & CELL_PROCESSED)) {
            pAttacker.value.uiFlags |= CELL_PROCESSED;
            found = true;
          }
        }
      } else
        AssertMsg(0, "Logic error in ProcessBattleFrame()");
      // Apply damage and play miss/hit sounds if delay between firing and hit has expired.
      if (!(pAttacker.value.uiFlags & CELL_RETREATED)) {
        for (cnt = 0; cnt < 3; cnt++) {
          // Check if any incoming bullets have hit the target.
          if (pAttacker.value.usNextHit[cnt]) {
            iTime = pAttacker.value.usNextHit[cnt];
            iTime -= uiSlice;
            if (iTime >= 0) {
              // Bullet still on route.
              pAttacker.value.usNextHit[cnt] = iTime;
            } else {
              // Bullet is going to hit/miss.
              TargetHitCallback(pAttacker, cnt);
              pAttacker.value.usNextHit[cnt] = 0;
            }
          }
        }
      }
      if (pAttacker.value.pSoldier.value.bLife < OKLIFE || pAttacker.value.uiFlags & CELL_RETREATED) {
        if (!(pAttacker.value.uiFlags & CELL_CREATURE) || !pAttacker.value.pSoldier.value.bLife)
          continue; // can't attack if you are unconcious or not around (Or a live creature)
      }
      iTime = pAttacker.value.usNextAttack;
      iTime -= uiSlice;
      if (iTime > 0) {
        pAttacker.value.usNextAttack = iTime;
        continue;
      } else {
        if (pAttacker.value.uiFlags & CELL_RETREATING) {
          // The merc has successfully retreated.  Remove the stats, and continue on.
          if (pAttacker == gpAR.value.pRobotCell) {
            if (gpAR.value.pRobotCell.value.pSoldier.value.ubRobotRemoteHolderID == NOBODY) {
              gpAR.value.pRobotCell.value.uiFlags &= ~CELL_RETREATING;
              gpAR.value.pRobotCell.value.uiFlags |= CELL_DIRTY;
              gpAR.value.pRobotCell.value.usNextAttack = 0xffff;
              continue;
            }
          }
          gpAR.value.usPlayerDefence -= pAttacker.value.usDefence;
          pAttacker.value.usDefence = 0;
          pAttacker.value.uiFlags |= CELL_RETREATED;
          continue;
        }
        if (pAttacker.value.usAttack) {
          pTarget = ChooseTarget(pAttacker);
          if (pAttacker.value.uiFlags & CELL_CREATURE && PreRandom(100) < 7)
            PlayAutoResolveSample(Enum330.ACR_SMELL_THREAT + PreRandom(2), RATE_11025, 50, 1, MIDDLEPAN);
          else
            AttackTarget(pAttacker, pTarget);
          ResetNextAttackCounter(pAttacker);
          pAttacker.value.usNextAttack += iTime; // tack on the remainder
          iAttacksThisFrame++;
        }
      }
    }
    if (iTimeSlice != 0x7fffffff) //|| !gpAR->fInstantFinish )
    {
      iTimeSlice -= 1000;
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
    return SECTOR(gpAR.value.ubSectorX, gpAR.value.ubSectorY);
  }
  return 0xff;
}

// Returns TRUE if a battle is happening or sector is loaded
export function GetCurrentBattleSectorXYZ(psSectorX: Pointer<INT16>, psSectorY: Pointer<INT16>, psSectorZ: Pointer<INT16>): boolean {
  if (gpAR) {
    psSectorX.value = gpAR.value.ubSectorX;
    psSectorY.value = gpAR.value.ubSectorY;
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
    return true;
  } else {
    psSectorX.value = 0;
    psSectorY.value = 0;
    psSectorZ.value = -1;
    return false;
  }
}

// Returns TRUE if a battle is happening ONLY
export function GetCurrentBattleSectorXYZAndReturnTRUEIfThereIsABattle(psSectorX: Pointer<INT16>, psSectorY: Pointer<INT16>, psSectorZ: Pointer<INT16>): boolean {
  if (gpAR) {
    psSectorX.value = gpAR.value.ubSectorX;
    psSectorY.value = gpAR.value.ubSectorY;
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
