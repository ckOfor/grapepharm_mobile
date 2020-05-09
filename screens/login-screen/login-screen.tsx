// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform, ImageBackground, ImageStyle, Text, TextStyle, Image
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";

// redux
import { ApplicationState } from "../../redux";

// styles
import {Layout} from "../../constants";
import {colors, fonts, images} from "../../theme";
import {translate} from "../../i18n";
import {Button} from "../../components/button";

interface DispatchProps {

}

interface StateProps {

}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: '100%',
	alignItems: 'center'
};

const backgroundImageStyle: ImageStyle = {
	width: '100%',
	height: Layout.window.height / 2,
	alignItems: 'center',
	justifyContent: 'center'
};

class Login extends React.Component<NavigationScreenProps & Props> {
	
	public render(): React.ReactNode {
		
		return (
			<View
				style={ROOT}
			>
				<ImageBackground
					source={images.continueBackgroundLogo}
					style={backgroundImageStyle}
					resizeMethod={'auto'}
					resizeMode='stretch'
				>
					
					{
						Platform.OS === "ios"
							? <StatusBar barStyle={"light-content"} />
							: <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.companyGreenTwo} />
					}
				</ImageBackground>
			</View>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({

});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({

});

export const LoginScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Login);
