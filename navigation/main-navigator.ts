import { createBottomTabNavigator } from "react-navigation";
import { DEFAULT_BOTTOM_NAVIGATION } from "./navigation-config";
import { LandingNavigator } from "./landing-navigator";
import { RecordsScreen } from "../screens/records/records";
import { CartScreen } from "../screens/cart";
import { NotificationsScreen } from "../screens/notifications";
import { AccountScreen } from "../screens/acount";

export const MainNavigator = createBottomTabNavigator({
  landing: {
    screen: LandingNavigator,
    navigationOptions: {
      header: null
    }
  },
  records: {
    screen: RecordsScreen,
    navigationOptions: {
      header: null
    }
  },
  cart: {
    screen: CartScreen,
    navigationOptions: {
      header: null
    }
  },
  notifications: {
    screen: NotificationsScreen,
    navigationOptions: {
      header: null
    }
  },
  account: {
    screen: AccountScreen,
    navigationOptions: {
      header: null
    }
  },
}, DEFAULT_BOTTOM_NAVIGATION);
