import { createBottomTabNavigator } from "react-navigation";
import { DEFAULT_BOTTOM_NAVIGATION } from "./navigation-config";
import { LandingScreen } from "../screens/landing-screen";

export const MainNavigator = createBottomTabNavigator({
  landing: {
    screen: LandingScreen,
    navigationOptions: {
      header: null
    }
  },
}, DEFAULT_BOTTOM_NAVIGATION);
