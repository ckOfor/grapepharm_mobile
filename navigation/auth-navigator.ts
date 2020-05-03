import { createStackNavigator } from "react-navigation";
import { ContinueScreen } from "../screens/continue-screen/continue-screen";

export const AuthNavigator = createStackNavigator({
	continue: {
		screen: ContinueScreen,
		navigationOptions: {
			header: null
		}
	},
});
