namespace ja2 {

export function GetMLGFilename(usMLGGraphicID: UINT16): string {
// FIXME: Language-specific code
// #if defined(ENGLISH) || defined(FRENCH)
  switch (usMLGGraphicID) {
    case Enum326.MLG_AIMSYMBOL:
      return "LAPTOP\\AimSymbol.sti";
    case Enum326.MLG_BOBBYNAME:
      return "LAPTOP\\BobbyName.sti";
    case Enum326.MLG_BOBBYRAYAD21:
      return "LAPTOP\\BobbyRayAd_21.sti";
    case Enum326.MLG_BOBBYRAYLINK:
      return "LAPTOP\\BobbyRayLink.sti";
    case Enum326.MLG_CLOSED:
      return "LAPTOP\\Closed.sti";
    case Enum326.MLG_CONFIRMORDER:
      return "LAPTOP\\ConfirmOrder.sti";
    case Enum326.MLG_DESKTOP:
      return "LAPTOP\\desktop.pcx";
    case Enum326.MLG_FUNERALAD9:
      return "LAPTOP\\FuneralAd_9.sti";
    case Enum326.MLG_GOLDPIECEBUTTONS:
      return "INTERFACE\\goldpiecebuttons.sti";
    case Enum326.MLG_HISTORY:
      return "LAPTOP\\history.sti";
    case Enum326.MLG_INSURANCEAD10:
      return "LAPTOP\\insurancead_10.sti";
    case Enum326.MLG_INSURANCELINK:
      return "LAPTOP\\insurancelink.sti";
    case Enum326.MLG_INSURANCETITLE:
      return "LAPTOP\\largetitle.sti";
    case Enum326.MLG_LARGEFLORISTSYMBOL:
      return "LAPTOP\\LargeSymbol.sti";
    case Enum326.MLG_SMALLFLORISTSYMBOL:
      return "LAPTOP\\SmallSymbol.sti";
    case Enum326.MLG_MCGILLICUTTYS:
      return "LAPTOP\\McGillicuttys.sti";
    case Enum326.MLG_MORTUARY:
      return "LAPTOP\\Mortuary.sti";
    case Enum326.MLG_MORTUARYLINK:
      return "LAPTOP\\MortuaryLink.sti";
    case Enum326.MLG_ORDERGRID:
      return "LAPTOP\\OrderGrid.sti";
    case Enum326.MLG_PREBATTLEPANEL:
      return "INTERFACE\\PreBattlePanel.sti";
    case Enum326.MLG_SMALLTITLE:
      return "LAPTOP\\SmallTitle.sti";
    case Enum326.MLG_STATSBOX:
      return "LAPTOP\\StatsBox.sti";
    case Enum326.MLG_STOREPLAQUE:
      return "LAPTOP\\BobbyStorePlaque.sti";
    case Enum326.MLG_TITLETEXT:
      return "LOADSCREENS\\titletext.sti";
    case Enum326.MLG_TOALUMNI:
      return "LAPTOP\\ToAlumni.sti";
    case Enum326.MLG_TOMUGSHOTS:
      return "LAPTOP\\ToMugShots.sti";
    case Enum326.MLG_TOSTATS:
      return "LAPTOP\\ToStats.sti";
    case Enum326.MLG_WARNING:
      return "LAPTOP\\Warning.sti";
    case Enum326.MLG_YOURAD13:
      return "LAPTOP\\YourAd_13.sti";
    case Enum326.MLG_OPTIONHEADER:
      return "INTERFACE\\optionscreenaddons.sti";
    case Enum326.MLG_LOADSAVEHEADER:
      return "INTERFACE\\loadscreenaddons.sti";
    case Enum326.MLG_SPLASH:
      return "INTERFACE\\splash.sti";
    case Enum326.MLG_IMPSYMBOL:
      return "LAPTOP\\IMPSymbol.sti";
  }

// #elif defined(GERMAN)
//   switch (usMLGGraphicID) {
//     case MLG_AIMSYMBOL:
//       // Same graphic (no translation needed)
//       sprintf(filename, "LAPTOP\\AimSymbol.sti");
//       return TRUE;
//     case MLG_BOBBYNAME:
//       // Same graphic (no translation needed)
//       sprintf(filename, "LAPTOP\\BobbyName.sti");
//       return TRUE;
//     case MLG_BOBBYRAYAD21:
//       // Same graphic (no translation needed)
//       sprintf(filename, "LAPTOP\\BobbyRayAd_21.sti");
//       return TRUE;
//     case MLG_BOBBYRAYLINK:
//       sprintf(filename, "GERMAN\\BobbyRayLink_german.sti");
//       return TRUE;
//     case MLG_CLOSED:
//       sprintf(filename, "GERMAN\\Closed_german.sti");
//       return TRUE;
//     case MLG_CONFIRMORDER:
//       sprintf(filename, "GERMAN\\ConfirmOrder_german.sti");
//       return TRUE;
//     case MLG_DESKTOP:
//       sprintf(filename, "GERMAN\\desktop_german.pcx");
//       return TRUE;
//     case MLG_FUNERALAD9:
//       sprintf(filename, "GERMAN\\FuneralAd_12_german.sti");
//       return TRUE;
//     case MLG_GOLDPIECEBUTTONS:
//       sprintf(filename, "GERMAN\\goldpiecebuttons_german.sti");
//       return TRUE;
//     case MLG_HISTORY:
//       sprintf(filename, "GERMAN\\history_german.sti");
//       return TRUE;
//     case MLG_IMPSYMBOL:
//       sprintf(filename, "German\\IMPSymbol_german.sti");
//       return TRUE;
//     case MLG_INSURANCEAD10:
//       sprintf(filename, "GERMAN\\insurancead_10_german.sti");
//       return TRUE;
//     case MLG_INSURANCELINK:
//       sprintf(filename, "GERMAN\\insurancelink_german.sti");
//       return TRUE;
//     case MLG_INSURANCETITLE:
//       sprintf(filename, "GERMAN\\largetitle_german.sti");
//       return TRUE;
//     case MLG_LARGEFLORISTSYMBOL:
//       sprintf(filename, "GERMAN\\LargeSymbol_german.sti");
//       return TRUE;
//     case MLG_SMALLFLORISTSYMBOL:
//       sprintf(filename, "GERMAN\\SmallSymbol_german.sti");
//       return TRUE;
//     case MLG_MCGILLICUTTYS:
//       sprintf(filename, "GERMAN\\McGillicuttys_german.sti");
//       return TRUE;
//     case MLG_MORTUARY:
//       sprintf(filename, "GERMAN\\Mortuary_german.sti");
//       return TRUE;
//     case MLG_MORTUARYLINK:
//       sprintf(filename, "GERMAN\\MortuaryLink_german.sti");
//       return TRUE;
//     case MLG_PREBATTLEPANEL:
//       sprintf(filename, "GERMAN\\PreBattlePanel_german.sti");
//       return TRUE;
//     case MLG_SMALLTITLE:
//       sprintf(filename, "GERMAN\\SmallTitle_german.sti");
//       return TRUE;
//     case MLG_STATSBOX:
//       // Same file
//       sprintf(filename, "LAPTOP\\StatsBox.sti");
//       return TRUE;
//     case MLG_STOREPLAQUE:
//       sprintf(filename, "GERMAN\\StorePlaque_german.sti");
//       return TRUE;
//     case MLG_TITLETEXT:
//       sprintf(filename, "GERMAN\\titletext_german.sti");
//       return TRUE;
//     case MLG_TOALUMNI:
//       sprintf(filename, "GERMAN\\ToAlumni_german.sti");
//       return TRUE;
//     case MLG_TOMUGSHOTS:
//       sprintf(filename, "GERMAN\\ToMugShots_german.sti");
//       return TRUE;
//     case MLG_TOSTATS:
//       sprintf(filename, "GERMAN\\ToStats_german.sti");
//       return TRUE;
//     case MLG_WARNING:
//       sprintf(filename, "GERMAN\\Warning_german.sti");
//       return TRUE;
//     case MLG_YOURAD13:
//       sprintf(filename, "GERMAN\\YourAd_13_german.sti");
//       return TRUE;
//     case MLG_OPTIONHEADER:
//       sprintf(filename, "GERMAN\\optionscreenaddons_german.sti");
//       return TRUE;
//     case MLG_LOADSAVEHEADER:
//       sprintf(filename, "GERMAN\\loadscreenaddons_german.sti");
//       return TRUE;
//     case MLG_ORDERGRID:
//       // Same file
//       sprintf(filename, "LAPTOP\\OrderGrid.sti");
//       return TRUE;
//     case MLG_SPLASH:
//       sprintf(filename, "German\\splash_german.sti");
//       return TRUE;
//   }
//
// #else
//
//   UINT8 zLanguage[64];
//
//   // The foreign language defined determines the name of the directory and filename.
//   // For example, the German version of:
//   //
//   //		"LAPTOP\\IMPSymbol.sti"
//   //
//   //	would become:
//   //
//   //		"GERMAN\\IMPSymbol_German.sti"
//
// #if defined(DUTCH)
//   sprintf(zLanguage, "DUTCH");
// #elif defined(FRENCH)
//   sprintf(zLanguage, "FRENCH");
// #elif defined(GERMAN)
//   sprintf(zLanguage, "GERMAN");
// #elif defined(ITALIAN)
//   sprintf(zLanguage, "ITALIAN");
// #elif defined(POLISH)
//   sprintf(zLanguage, "POLISH");
// #elif defined(RUSSIAN)
//   sprintf(zLanguage, "RUSSIAN");
// #endif
//
//   switch (usMLGGraphicID) {
//     case MLG_AIMSYMBOL:
//       sprintf(filename, "%s\\AimSymbol_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_BOBBYNAME:
//       sprintf(filename, "%s\\BobbyName_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_BOBBYRAYAD21:
//       sprintf(filename, "%s\\BobbyRayAd_21_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_BOBBYRAYLINK:
//       sprintf(filename, "%s\\BobbyRayLink_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_CLOSED:
//       sprintf(filename, "%s\\Closed_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_CONFIRMORDER:
//       sprintf(filename, "%s\\ConfirmOrder_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_DESKTOP:
//       sprintf(filename, "%s\\desktop_%s.pcx", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_FUNERALAD9:
//       sprintf(filename, "%s\\FuneralAd_9_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_GOLDPIECEBUTTONS:
//       sprintf(filename, "%s\\goldpiecebuttons_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_HISTORY:
//       sprintf(filename, "%s\\history_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_INSURANCEAD10:
//       sprintf(filename, "%s\\insurancead_10_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_INSURANCELINK:
//       sprintf(filename, "%s\\insurancelink_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_INSURANCETITLE:
//       sprintf(filename, "%s\\largetitle_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_LARGEFLORISTSYMBOL:
//       sprintf(filename, "%s\\LargeSymbol_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_ORDERGRID:
//       sprintf(filename, "%s\\OrderGrid_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_SMALLFLORISTSYMBOL:
//       sprintf(filename, "%s\\SmallSymbol_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_STATSBOX:
//       sprintf(filename, "%s\\StatsBox_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_MCGILLICUTTYS:
//       sprintf(filename, "%s\\McGillicuttys_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_MORTUARY:
//       sprintf(filename, "%s\\Mortuary_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_MORTUARYLINK:
//       sprintf(filename, "%s\\MortuaryLink_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_PREBATTLEPANEL:
//       sprintf(filename, "%s\\PreBattlePanel_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_SMALLTITLE:
//       sprintf(filename, "%s\\SmallTitle_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_STOREPLAQUE:
//       sprintf(filename, "%s\\StorePlaque_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_TITLETEXT:
//       sprintf(filename, "%s\\titletext_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_TOALUMNI:
//       sprintf(filename, "%s\\ToAlumni_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_TOMUGSHOTS:
//       sprintf(filename, "%s\\ToMugShots_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_TOSTATS:
//       sprintf(filename, "%s\\ToStats_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_WARNING:
//       sprintf(filename, "%s\\Warning_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_YOURAD13:
//       sprintf(filename, "%s\\YourAd_13_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_OPTIONHEADER:
//       sprintf(filename, "%s\\optionscreenaddons_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_LOADSAVEHEADER:
//       sprintf(filename, "%s\\loadscreenaddons_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_SPLASH:
//       sprintf(filename, "%s\\splash_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//     case MLG_IMPSYMBOL:
//       sprintf(filename, "%s\\IMPSymbol_%s.sti", zLanguage, zLanguage);
//       return TRUE;
//   }
// #endif

  throw new Error('Should be unreachable');
}

}
