#ifndef __STRATEGIC_ALL_H
#define __STRATEGIC_ALL_H

#include <stdio.h>
#include "types.h"
#include "english.h"
#include "Timer Control.h"
#include "vsurface.h"
#include "Button System.h"
#include "Font Control.h"
#include "Simple Render Utils.h"
#include "Editor Taskbar Utils.h"
#include "line.h"
#include "input.h"
#include "vobject_blitters.h"
#include "Text Input.h"
#include "mousesystem.h"
#include "strategicmap.h"
#include "Fileman.h"
#include "Map Information.h"
#include "render dirty.h"
#include "Game Clock.h"
#include "Campaign Types.h"
#include "Campaign Init.h"
#include "cheats.h"
#include "Queen Command.h"
#include "overhead.h"
#include "Strategic Movement.h"
#include "GameSettings.h"
#include "Game Event Hook.h"
#include "Creature Spreading.h"
#include "message.h"
#include "Game Init.h"
#include "Assignments.h"
#include "Soldier Control.h"
#include "Item Types.h"
#include "Strategic.h"
#include "Items.h"
#include <stdlib.h>
#include "Map Screen Interface.h"
#include "Soldier Profile Type.h"
#include "Soldier Profile.h"
#include "Campaign.h"
#include "Text.h"
#include "dialogue control.h"
#include "NPC.h"
#include "Strategic Town Loyalty.h"
#include "animation control.h"
#include "mapscreen.h"
#include "Squads.h"
#include "Map Screen Helicopter.h"
#include "PopUpBox.h"
#include "Vehicles.h"
#include "Strategic Merc Handler.h"
#include "Merc Contract.h"
#include "Map Screen Interface Map.h"
#include "laptop.h"
#include "Finances.h"
#include "LaptopSave.h"
#include "renderworld.h"
#include "Interface Control.h"
#include "Interface.h"
#include "Soldier Find.h"
#include "ai.h"
#include "utilities.h"
#include "random.h"
#include "Soldier Add.h"
#include "Isometric Utils.h"
#include "Soldier Macros.h"
#include "Explosion Control.h"
#include "SkillCheck.h"
#include "Quests.h"
#include "Town Militia.h"
#include "Map Screen Interface Border.h"
#include "math.h"
#include "Strategic Pathing.h"
#include "Auto Resolve.h"
#include "Music Control.h"
#include "PreBattle Interface.h"
#include "Player Command.h"
#include "gameloop.h"
#include "screenids.h"
#include "vObject.h"
#include "video.h"
#include "gamescreen.h"
#include "sysutil.h"
#include "Soldier Create.h"
#include "Weapons.h"
#include "Sound Control.h"
#include "Tactical Save.h"
#include "Strategic Status.h"
#include "WordWrap.h"
#include "Animation Data.h"
#include "Strategic AI.h"
#include "rt time defines.h"
#include "morale.h"
#include "himage.h"
#include "Soldier Init List.h"
#include "lighting.h"
#include "Strategic Mines.h"
#include "jascreens.h"
#include "Map Edgepoints.h"
#include "opplist.h"
#include "sgp.h"
#include "environment.h"
#include "Game Events.h"
#include "MercTextBox.h"
#include "Event Pump.h"
#include "soundman.h"
#include "Ambient Control.h"
#include "AimMembers.h"
#include "Strategic Event Handler.h"
#include "BobbyR.h"
#include "mercs.h"
#include "email.h"
#include "Merc Hiring.h"
#include "Insurance Contract.h"
#include "Scheduling.h"
#include "BobbyRGuns.h"
#include "Arms Dealer Init.h"
#include "Strategic town reputation.h"
#include "air raid.h"
#include "meanwhile.h"
#include "MemMan.h"
#include "Debug.h"
#include "worlddef.h"
#include "fade screen.h"
#include "history.h"
#include "merc entering.h"
#include <String.h>
#include "worldman.h"
#include "tiledat.h"
#include "WCheck.h"
#include "Map Screen Interface Map Inventory.h"
#include "Map Screen Interface Bottom.h"
#include "Radar Screen.h"
#include "cursors.h"
#include "Options Screen.h"
#include "Cursor Control.h"
#include "Interface Items.h"
#include "Interface Utils.h"
#include "World Items.h"
#include "Multi Language Graphic Utils.h"
#include "Font.h"
#include "Militia Control.h"
#include "Map Screen Interface TownMine Info.h"
#include "Handle UI.h"
#include "Handle Items.h"
#include <stdarg.h>
#include <time.h>
#include "screens.h"
#include <wchar.h>
#include <tchar.h>
#include "Interface Cursors.h"
#include "Interface Panels.h"
#include "sys globals.h"
#include "faces.h"
#include "strategic turns.h"
#include "Personnel.h"
#include "Animated ProgressBar.h"
#include "GameVersion.h"
#include "SaveLoadScreen.h"
#include "messageboxscreen.h"
#include "rotting corpses.h"
#include "Tactical Placement GUI.h"
#include "Overhead Types.h"
#include "Soldier Ani.h"
#include "Types.h"
#include "Quest Debug System.h"
#include "WCheck.h"
#include "Font Control.h"
#include "Video.h"
#include "Game Clock.h"
#include "Render Dirty.h"
#include "WordWrap.h"
#include "Interface.h"
#include "Cursors.h"
#include "Quests.h"
#include "stdio.h"
#include "QuestText.h"
#include "Soldier Profile.h"
#include "Utilities.h"
#include "Text.h"
#include "Text Input.h"
#include "Soldier Create.h"
#include "strategicmap.h"
#include "soldier add.h"
#include "Opplist.h"
#include "Handle Items.h"
#include "Game Clock.h"
#include "environment.h"
#include "dialogue control.h"
#include "Soldier Control.h"
#include "overhead.h"
#include "AimMembers.h"
#include "MessageBoxScreen.h"
#include "Stdio.h"
#include "english.h"
#include "line.h"
#include "Keys.h"
#include "Interface Dialogue.h"
#include "SysUtil.h"
#include "Message.h"
#include "Interface Dialogue.h"
#include "Render Fun.h"
#include "Boxing.h"
#include <memory.h>
#include "Keys.h"
#include "Structure Wrap.h"
#include "SaveLoadMap.h"
#include "aim.h"
#include <windows.h>
#include "Inventory Choosing.h"
#include "LOS.h"
#include "Tactical Turns.h"
#include <math.h>
#include "worlddat.h"
#include "Exit Grids.h"
#include "pathai.h"
#include "Shade Table Util.h"
#include "points.h"
#include "JA2 Demo Ads.h"
#include "Bullets.h"
#include "physics.h"
#include "_JA25EnglishText.h"

#endif
