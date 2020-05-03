// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform, Image, ImageStyle, Text, TextStyle
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";

// redux
import { ApplicationState } from "../../redux";

// components
import { Button } from "../../components/button";

// styles
import {Layout} from "../../constants";
import {colors, fonts, images} from "../../theme";
import {translate} from "../../i18n";
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

class IntroOne extends React.Component<NavigationScreenProps & Props> {
	
	onSwipe = (gestureName: any, gestureState: any) => {
		const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
		this.setState({gestureName: gestureName});
		switch (gestureName) {
			case SWIPE_LEFT:
				this.props.navigation.navigate('introTwo');
				break;
			case SWIPE_RIGHT:
				console.log('')
				break;
		}
	};
	
	onSwipeLeft() {
		this.props.navigation.navigate('introTwo')
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
				onSwipeLeft={(state) => console.log('')}
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
						source={images.individualIcon}
						resizeMethod={'auto'}
						resizeMode='cover'
					/>
					
					<Text
						style={HEADER_TEXT}
					>
						{translate(`intro.screenOneHeader`)}
					</Text>
					
					<Text
						style={DESCRIPTION}
					>
						{translate(`intro.screenOneDescription`)}
					</Text>
					
					<Image
						style={DOT_ICON}
						source={images.dotIcon}
						resizeMethod={'auto'}
						resizeMode='cover'
					/>
					
					
					<Button
						style={NEXT_BUTTON}
						textStyle={NEXT_BUTTON_TEXT}
						onPress={() => navigation.navigate('introTwo')}
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

export const IntroOneScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(IntroOne);
