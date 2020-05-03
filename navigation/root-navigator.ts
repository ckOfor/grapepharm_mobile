import { createSwitchNavigator } from "react-navigation";
import { IntroNavigator } from "./auth-navigator";
import { MainNavigator } from "./main-navigator";

export const RootNavigator = createSwitchNavigator({
  Intro: { screen: IntroNavigator },
  Main: { screen: MainNavigator },
});
