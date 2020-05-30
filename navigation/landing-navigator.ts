import { createStackNavigator } from "react-navigation";
import { DEFAULT_BOTTOM_NAVIGATION } from "./navigation-config";
import { LandingScreen } from "../screens/landing-screen";
import { SearchScreen } from "../screens/search";

export const LandingNavigator = createStackNavigator({
	landing: {
		screen: LandingScreen,
		navigationOptions: {
			header: null
		}
	},
	search: {
		screen: SearchScreen,
		navigationOptions: {
			header: null,
			tabBarVisible: false,
		}
	},
});
