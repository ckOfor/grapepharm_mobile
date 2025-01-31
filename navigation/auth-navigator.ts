import { createStackNavigator } from "react-navigation";
import { ContinueScreen } from "../screens/continue-screen/continue-screen";
import { IndSignUpScreen } from "../screens/ind-sign-up-screen";
import { DocSignUpScreen } from "../screens/doc-sign-up-screen";
import { ComSignUpScreen, ComSignUpScreenTwo } from "../screens/com-sign-up-screen";
import { SignInScreen } from "../screens/sign-in-screen";
import { ForgotPasswordScreen } from "../screens/forgot-password";
import { VerificationScreen } from "../screens/verification/Verification";

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
	comSignUpTwo: {
		screen: ComSignUpScreenTwo,
		navigationOptions: {
			header: null
		}
	},
	signIn: {
		screen: SignInScreen,
		navigationOptions: {
			header: null
		}
	},
	forgotPassword: {
		screen: ForgotPasswordScreen,
		navigationOptions: {
			header: null
		}
	},
	verification: {
		screen: VerificationScreen,
		navigationOptions: {
			header: null
		}
	},
});
