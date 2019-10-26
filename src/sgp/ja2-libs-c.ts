export let gGameLibaries: LibraryInitHeader[] /* [] */ = [
  // Library Name					Can be	Init at start
  //													on cd
  [ "Data.slf", false, true ],
  [ "Ambient.slf", false, true ],
  [ "Anims.slf", false, true ],
  [ "BattleSnds.slf", false, true ],
  [ "BigItems.slf", false, true ],
  [ "BinaryData.slf", false, true ],
  [ "Cursors.slf", false, true ],
  [ "Faces.slf", false, true ],
  [ "Fonts.slf", false, true ],
  [ "Interface.slf", false, true ],
  [ "Laptop.slf", false, true ],
  [ "Maps.slf", true, true ],
  [ "MercEdt.slf", false, true ],
  [ "Music.slf", true, true ],
  [ "Npc_Speech.slf", true, true ],
  [ "NpcData.slf", false, true ],
  [ "RadarMaps.slf", false, true ],
  [ "Sounds.slf", false, true ],
  [ "Speech.slf", true, true ],
  //	{ "TileCache.slf",				FALSE, TRUE },
  [ "TileSets.slf", true, true ],
  [ "LoadScreens.slf", true, true ],
  [ "Intro.slf", true, true ],

// FIXME: Language-specific code
// #ifdef GERMAN
//   { "German.slf", FALSE, TRUE },
// #endif
//
// #ifdef POLISH
//   { "Polish.slf", FALSE, TRUE },
// #endif
//
// #ifdef DUTCH
//   { "Dutch.slf", FALSE, TRUE },
// #endif
//
// #ifdef ITALIAN
//   { "Italian.slf", FALSE, TRUE },
// #endif
//
// #ifdef RUSSIAN
//   { "Russian.slf", FALSE, TRUE },
// #endif
];
