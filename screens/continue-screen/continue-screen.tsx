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
import {setAuthUserType} from "../../redux/auth";

interface DispatchProps {
	setAuthUserType: (userType: string) => void
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

const HEADER_TEXT: TextStyle = {
	color: colors.companyGreenTwo,
	fontSize: 20,
	marginTop: 30,
	fontFamily: fonts.PoppinsLight
};

const NEXT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 100,
	borderWidth: 1,
	borderColor: colors.borderColor,
	width: 288,
	height: 50,
	marginTop: 20,
	shadowColor: colors.companyGreenTwo,
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.1,
	elevation: 1,
};

const NEXT_BUTTON_TEXT: TextStyle = {
	fontSize: 12,
	fontFamily: fonts.PoppinsMedium,
	color: colors.darkGreen,
};

const BOTTOM_TEXT: TextStyle = {
	color: colors.darkPurple,
	fontSize: 10,
	marginTop: 20,
	fontFamily: fonts.PoppinsLight
};

class Continue extends React.Component<NavigationScreenProps & Props> {
	
	public render(): React.ReactNode {
		
		const { navigation, setAuthUserType } = this.props
		
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
					
					<Image
						source={images.continueAppLogo}
						resizeMethod={'auto'}
						resizeMode='cover'
					/>

				</ImageBackground>
				
				<Text
					style={HEADER_TEXT}
				>
					{translate(`continue.header`)}
				</Text>
				
				<Button
					style={NEXT_BUTTON}
					textStyle={NEXT_BUTTON_TEXT}
					onPress={() => {
						setAuthUserType('individual')
						navigation.navigate('indSignUp')
					}}
					tx={`intro.screenOneHeader`}
				/>
				
				<Button
					style={NEXT_BUTTON}
					textStyle={NEXT_BUTTON_TEXT}
					onPress={() => navigation.navigate('docSignUp')}
					tx={`intro.screenTwoHeader`}
				/>

				<Button
					style={NEXT_BUTTON}
					textStyle={NEXT_BUTTON_TEXT}
					onPress={() => navigation.navigate('comSignUp')}
					tx={`intro.screenThreeHeader`}
				/>

				<Text
					style={BOTTOM_TEXT}
				>
					{translate(`continue.termsAndConditions`)}
				</Text>
			</View>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	setAuthUserType: (userType: string) => dispatch(setAuthUserType(userType))
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
});

export const ContinueScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Continue);
