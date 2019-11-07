namespace ja2 {

export let GameScreens: Screens[] /* [MAX_SCREENS] */ = [
  createScreensFrom(EditScreenInit, EditScreenHandle, EditScreenShutdown),
  createScreensFrom(SavingScreenInitialize, SavingScreenHandle, SavingScreenShutdown), // Title Screen
  createScreensFrom(LoadingScreenInitialize, LoadingScreenHandle, LoadingScreenShutdown), // Title Screen
  createScreensFrom(ErrorScreenInitialize, ErrorScreenHandle, ErrorScreenShutdown), // Title Screen
  createScreensFrom(InitScreenInitialize, InitScreenHandle, InitScreenShutdown), // Title Screen
  createScreensFrom(MainGameScreenInit, MainGameScreenHandle, MainGameScreenShutdown),
  createScreensFrom(AniEditScreenInit, AniEditScreenHandle, AniEditScreenShutdown),
  createScreensFrom(PalEditScreenInit, PalEditScreenHandle, PalEditScreenShutdown),
  createScreensFrom(DebugScreenInit, DebugScreenHandle, DebugScreenShutdown),
  createScreensFrom(MapScreenInit, MapScreenHandle, MapScreenShutdown),
  createScreensFrom(LaptopScreenInit, LaptopScreenHandle, LaptopScreenShutdown),
  createScreensFrom(LoadSaveScreenInit, LoadSaveScreenHandle, LoadSaveScreenShutdown),
  createScreensFrom(MapUtilScreenInit, MapUtilScreenHandle, MapUtilScreenShutdown),
  createScreensFrom(FadeScreenInit, FadeScreenHandle, FadeScreenShutdown),
  createScreensFrom(MessageBoxScreenInit, MessageBoxScreenHandle, MessageBoxScreenShutdown),
  createScreensFrom(MainMenuScreenInit, MainMenuScreenHandle, MainMenuScreenShutdown),
  createScreensFrom(AutoResolveScreenInit, AutoResolveScreenHandle, AutoResolveScreenShutdown),
  createScreensFrom(SaveLoadScreenInit, SaveLoadScreenHandle, SaveLoadScreenShutdown),
  createScreensFrom(OptionsScreenInit, OptionsScreenHandle, OptionsScreenShutdown),
  createScreensFrom(ShopKeeperScreenInit, ShopKeeperScreenHandle, ShopKeeperScreenShutdown),
  createScreensFrom(SexScreenInit, SexScreenHandle, SexScreenShutdown),
  createScreensFrom(GameInitOptionsScreenInit, GameInitOptionsScreenHandle, GameInitOptionsScreenShutdown),
  createScreensFrom(DemoExitScreenInit, DemoExitScreenHandle, DemoExitScreenShutdown),
  createScreensFrom(IntroScreenInit, IntroScreenHandle, IntroScreenShutdown),
  createScreensFrom(CreditScreenInit, CreditScreenHandle, CreditScreenShutdown),

  createScreensFrom(QuestDebugScreenInit, QuestDebugScreenHandle, QuestDebugScreenShutdown),
];

}
