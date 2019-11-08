namespace ja2 {

export let gGameLibaries: LibraryInitHeader[] /* [] */ = [
  // Library Name					Can be	Init at start
  //													on cd
  createLibraryInitHeaderFrom("Data.slf", false, true),
  createLibraryInitHeaderFrom("Ambient.slf", false, true),
  createLibraryInitHeaderFrom("Anims.slf", false, true),
  createLibraryInitHeaderFrom("BattleSnds.slf", false, true),
  createLibraryInitHeaderFrom("BigItems.slf", false, true),
  createLibraryInitHeaderFrom("BinaryData.slf", false, true),
  createLibraryInitHeaderFrom("Cursors.slf", false, true),
  createLibraryInitHeaderFrom("Faces.slf", false, true),
  createLibraryInitHeaderFrom("Fonts.slf", false, true),
  createLibraryInitHeaderFrom("Interface.slf", false, true),
  createLibraryInitHeaderFrom("Laptop.slf", false, true),
  createLibraryInitHeaderFrom("Maps.slf", true, true),
  createLibraryInitHeaderFrom("MercEdt.slf", false, true),
  createLibraryInitHeaderFrom("Music.slf", true, true),
  createLibraryInitHeaderFrom("Npc_Speech.slf", true, true),
  createLibraryInitHeaderFrom("NpcData.slf", false, true),
  createLibraryInitHeaderFrom("RadarMaps.slf", false, true),
  createLibraryInitHeaderFrom("Sounds.slf", false, true),
  createLibraryInitHeaderFrom("Speech.slf", true, true),
  //	{ "TileCache.slf",				FALSE, TRUE },
  createLibraryInitHeaderFrom("TileSets.slf", true, true),
  createLibraryInitHeaderFrom("LoadScreens.slf", true, true),
  createLibraryInitHeaderFrom("Intro.slf", true, true),

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

}
