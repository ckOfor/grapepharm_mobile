import { createStackNavigator } from "react-navigation";
import {IntroOneScreen, IntroTwoScreen, IntroThreeScreen } from "../screens/intro-screens";
import { ContinueScreen } from "../screens/continue-screen/continue-screen";

export const IntroNavigator = createStackNavigator({
	introOne: {
		screen: IntroOneScreen,
		navigationOptions: {
			header: null
		}
	},
	introTwo: {
		screen: IntroTwoScreen,
		navigationOptions: {
			header: null
		}
	},
	introThree: {
		screen: IntroThreeScreen,
		navigationOptions: {
			header: null
		}
	},
	continue: {
		screen: ContinueScreen,
		navigationOptions: {
			header: null
		}
	},
	
});
