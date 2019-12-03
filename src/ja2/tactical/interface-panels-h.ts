namespace ja2 {

export const enum Enum220 {
  STANCEUP_BUTTON = 0,
  UPDOWN_BUTTON,
  CLIMB_BUTTON,
  STANCEDOWN_BUTTON,
  HANDCURSOR_BUTTON,
  PREVMERC_BUTTON,
  NEXTMERC_BUTTON,
  OPTIONS_BUTTON,
  BURSTMODE_BUTTON,
  LOOK_BUTTON,
  TALK_BUTTON,
  MUTE_BUTTON,
  SM_DONE_BUTTON,
  SM_MAP_SCREEN_BUTTON,
  NUM_SM_BUTTONS,
}

export const enum Enum221 {
  TEAM_DONE_BUTTON = 0,
  TEAM_MAP_SCREEN_BUTTON,
  CHANGE_SQUAD_BUTTON,
  NUM_TEAM_BUTTONS,
}

export const NEW_ITEM_CYCLE_COUNT = 19;
export const NEW_ITEM_CYCLES = 4;
export const NUM_TEAM_SLOTS = 6;

export const PASSING_ITEM_DISTANCE_OKLIFE = 3;
export const PASSING_ITEM_DISTANCE_NOTOKLIFE = 2;

export const SHOW_LOCATOR_NORMAL = 1;
export const SHOW_LOCATOR_FAST = 2;

interface TEAM_PANEL_SLOTS_TYPE {
  ubID: UINT8;
  fOccupied: boolean;
}

function createTeamPanelSlotsType(): TEAM_PANEL_SLOTS_TYPE {
  return {
    ubID: 0,
    fOccupied: false,
  };
}

export let gTeamPanel: TEAM_PANEL_SLOTS_TYPE[] /* [NUM_TEAM_SLOTS] */ = createArrayFrom(NUM_TEAM_SLOTS, createTeamPanelSlotsType);

export let gSMPanelRegion: MOUSE_REGION = createMouseRegion();

// void DisableSMPpanelButtonsWhenInShopKeeperInterface( );

}
