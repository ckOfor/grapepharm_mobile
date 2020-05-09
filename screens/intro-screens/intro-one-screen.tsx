// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform, Image, ImageStyle, Text, TextStyle, Alert
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as Permissions from 'expo-permissions';

// redux
import { ApplicationState } from "../../redux";

// components
import { Button } from "../../components/button";

// styles
import {Layout} from "../../constants";
import {colors, fonts, images} from "../../theme";
import {translate} from "../../i18n";
import GestureRecognizer, {swipeDirections} from "react-native-swipe-gestures";
import {checkNotificationPermissionAsync} from "../../redux/startup";
import firebase from "react-native-firebase";

interface DispatchProps {
	checkNotificationPermission: () => Permissions.PermissionStatus | any
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
	color: colors.darkGreen,
	fontSize: 20,
	marginTop: 30,
	fontFamily: fonts.PoppinsSemiBold
};

const DESCRIPTION: TextStyle = {
	color: colors.darkGreen,
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
	
	componentDidMount() {
		this.props.checkNotificationPermission()
		this.createNotificationListeners(); //add this line
	}
	
	//Remove listeners allocated in createNotificationListeners()
	componentWillUnmount() {
		// @ts-ignore
		this.notificationListener();
		// @ts-ignore
		this.notificationOpenedListener();
	}
	
	async createNotificationListeners() {
		console.log('createNotificationListeners')
		/*
		* Triggered when a particular notification has been received in foreground
		* */
		// @ts-ignore
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const { title, body } = notification;
			this.showAlert(title, body);
			console.log('notificationListener')
		});
		
		/*
		* If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		* */
		// @ts-ignore
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const { title, body } = notificationOpen.notification;
			this.showAlert(title, body)
			console.log('notificationOpenedListener');
		});
		
		/*
		* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		* */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification;
			this.showAlert(title, body);
			console.log('notificationOpen');
		}

		/*
		* Triggered for data only payload in foreground
		* */
		// @ts-ignore
		this.messageListener = firebase.messaging().onMessage((message) => {
			//process data message
			console.log(JSON.stringify(message));
		});
	}

	// @ts-ignore
	showAlert(title, body) {
		Alert.alert(
			title, body,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false },
		);
	}
	
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
							: <StatusBar barStyle={"dark-content"} translucent />
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
	checkNotificationPermission: () => dispatch(checkNotificationPermissionAsync()),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({

});

export const IntroOneScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(IntroOne);
