import { createStackNavigator } from "react-navigation";
import { ContinueScreen } from "../screens/continue-screen/continue-screen";
import { IndSignUpScreen } from "../screens/ind-sign-up-screen";
import { DocSignUpScreen } from "../screens/doc-sign-up-screen";
import { ComSignUpScreen } from "../screens/com-sign-up-screen";

export const AuthNavigator = createStackNavigator({
	continue: {
		screen: ContinueScreen,
		navigationOptions: {
			header: null
		}
	},
	indSignUp: {
		screen: IndSignUpScreen,
		navigationOptions: {
			header: null
		}
	},
	docSignUp: {
		screen: DocSignUpScreen,
		navigationOptions: {
			header: null
		}
	},
	comSignUp: {
		screen: ComSignUpScreen,
		navigationOptions: {
			header: null
		}
	},
});
