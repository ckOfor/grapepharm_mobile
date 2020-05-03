// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform, Image, Text, TextStyle, ImageStyle
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
import GestureRecognizer, {swipeDirections} from "react-native-swipe-gestures";

interface DispatchProps {

}

interface StateProps {

}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: '100%',
	width: '100%',
	alignItems: 'center',
	justifyContent: 'center'
};

const HEADER_TEXT: TextStyle = {
	color: '#00545B',
	fontSize: 20,
	marginTop: 30,
	fontFamily: fonts.PoppinsSemiBold
};

const DESCRIPTION: TextStyle = {
	color: '#00545B',
	fontSize: 14,
	marginTop: 10,
	fontFamily: fonts.PoppinsLight
};

const DOT_ICON: ImageStyle = {
	marginTop:  Layout.window.height / 10
};

const NEXT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 100,
	borderWidth: 2,
	borderColor: colors.companyGreen,
	width: 168.17,
	height: 50,
	marginTop: Layout.window.height / 10,
};

const NEXT_BUTTON_TEXT: TextStyle = {
	fontSize: 12,
	fontFamily: fonts.PoppinsSemiBold,
	color: colors.companyGreen,
};

class IntroTwo extends React.Component<NavigationScreenProps & Props> {
	
	onSwipe = (gestureName: any, gestureState: any) => {
		const { navigation } = this.props;
		
		const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
		this.setState({gestureName: gestureName});
		switch (gestureName) {
			case SWIPE_LEFT:
				navigation.navigate('introThree');
				break;
			case SWIPE_RIGHT:
				navigation.navigate('introOne');
				break;
		}
	};
	
	onSwipeLeft() {
		this.props.navigation.navigate('introThree')
	}
	
	onSwipeRight() {
		this.props.navigation.navigate('introOne')
	}
	
	public render(): React.ReactNode {
		
		const { navigation } = this.props;
		
		const config = {
			velocityThreshold: 0.3,
			directionalOffsetThreshold: 80
		};
		
		return (
			<GestureRecognizer
				onSwipe={(direction, state) => this.onSwipe(direction, state)}
				config={config}
				onSwipeLeft={(state) => this.onSwipeLeft()}
				onSwipeRight={(state) => this.onSwipeRight()}
			>
				<View
					style={ROOT}
				>
					{
						Platform.OS === "ios"
							? <StatusBar barStyle="dark-content" />
							: <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.purple} />
					}
					
					<Image
						source={images.doctorsIcon}
						resizeMethod={'auto'}
						resizeMode='cover'
					/>
					
					<Text
						style={HEADER_TEXT}
					>
						{translate(`intro.screenTwoHeader`)}
					</Text>
					
					<Text
						style={DESCRIPTION}
					>
						{translate(`intro.screenTwoDescription`)}
					</Text>
					
					<Image
						style={DOT_ICON}
						source={images.dotTwoIcon}
						resizeMethod={'auto'}
						resizeMode='cover'
					/>
					
					<Button
						style={NEXT_BUTTON}
						textStyle={NEXT_BUTTON_TEXT}
						onPress={() => navigation.navigate('introThree')}
						tx={`intro.screenOneButtonText`}
					/>
				</View>
			</GestureRecognizer>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({

});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({

});

export const IntroTwoScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(IntroTwo);
