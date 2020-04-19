import { createSwitchNavigator } from "react-navigation";
import { MainNavigator } from "./main-navigator";

export const RootNavigator = createSwitchNavigator({
  Main: { screen: MainNavigator },
});
