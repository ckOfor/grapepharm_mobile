import { createSwitchNavigator } from "react-navigation";
import { IntroNavigator } from "./intro-navigator";
import { AuthNavigator } from "./auth-navigator";
import { MainNavigator } from "./main-navigator";

export const RootNavigator = createSwitchNavigator({
  Intro: { screen: IntroNavigator },
  Auth: { screen: AuthNavigator },
  Main: { screen: MainNavigator },
});
