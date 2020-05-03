// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";

// redux
import { ApplicationState } from "../../redux";

// styles
import {Layout} from "../../constants";
import { colors } from "../../theme";

interface DispatchProps {

}

interface StateProps {

}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: Layout.window.height
};

class Landing extends React.Component<NavigationScreenProps & Props> {
	
	public render(): React.ReactNode {
		
		return (
			<View
				style={ROOT}
			>
				{
					Platform.OS === "ios"
						? <StatusBar barStyle="dark-content" />
						: <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.purple} />
				}
			</View>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({

});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({

});

export const LandingScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Landing);
