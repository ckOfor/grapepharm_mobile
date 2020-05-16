// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform,
	ImageBackground,
	ImageStyle,
	Text,
	TextStyle,
	Image,
	TouchableOpacity,
	KeyboardAvoidingView,
	NativeMethodsMixinStatic, Keyboard, ActivityIndicator, ScrollView, Alert
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import * as LocalAuthentication from 'expo-local-authentication';
import Expo from 'expo'
import firebase from 'react-native-firebase';

// redux
import { ApplicationState } from "../../redux";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";
import {authCredentials, signInUserWithBiometricsAsync, signInUserAsync} from "../../redux/auth";
import {notify} from "../../redux/startup";

interface DispatchProps {
	signInUserWithBiometricsAsync: () => void
	signInUserAsync: (values: authCredentials) => void
	notify: (message:string, type: string) => void
}

interface StateProps {
	authUserType: string
	authEmail: string
	authPassword: string
	isLoading: boolean
}

interface MyFormValues {
	email: string
	password: string
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps


const schema = Yup.object().shape({
	email: Yup.string()
		.email("common.emailError")
		.required("common.fieldRequired"),
	password: Yup.string()
		.min(6, "common.passwordError")
		.required("common.fieldRequired"),
})

const ROOT: ViewStyle = {
	alignItems: 'center',
};

const SCROLL_VIEW: ViewStyle = {
	height: '100%',
	backgroundColor: colors.AuthBG
};

const BACKGROUND_IMAGE: ImageStyle = {
	width: '100%',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
};

const BACKGROUND_VIEW: ViewStyle = {
	alignItems: 'center',
	justifyContent: 'center'
}

const TOP_VIEW: ViewStyle = {
	backgroundColor: '#FFFFFF',
	width: Layout.window.width / 1.1,
	borderRadius: 15,
	borderWidth: 1,
	borderColor: colors.borderColor,
	shadowColor: colors.companyGreenTwo,
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.1,
	elevation: 2,
}

const HEADER_TEXT: TextStyle = {
	color: colors.darkGreen,
	fontSize: 22,
	marginTop: 20,
	fontFamily: fonts.MontserratBold,
	alignSelf: 'center'
};

const HEADER_VIEW: ViewStyle = {
	marginLeft: 30,
	marginTop: 20,
	flexDirection: 'row',
	alignItems: 'center'
};

const USER_TYPE: TextStyle = {
	color: colors.darkGreen,
	fontSize: 17,
	fontFamily: fonts.PoppinsMedium
};

const CHANGE_TEXT: TextStyle = {
	color: colors.darkPurple,
	fontSize: 12,
	marginLeft: 10,
	fontFamily: fonts.PoppinsLight,
};

const BOTTOM_VIEW: ViewStyle = {
	flexDirection: 'column',
	justifyContent: 'space-between',
	margin: 50,
	height: Layout.window.height / 5
}

const BOTTOM_TEXT: TextStyle = {
	color: colors.darkPurple,
	fontSize: 13,
	fontFamily: fonts.PoppinsLight
};

const FIELD: ViewStyle = {
	alignItems: 'center',
	marginTop: 20
}

const FORGOT_PASSWORD: TextStyle = {
	color: colors.companyGreenTwo,
	fontSize: 12,
	fontFamily: fonts.PoppinsRegular,
	marginRight: 30,
	alignSelf: "flex-end"
};

const BUTTON_VIEW: ViewStyle = {
	margin: 40
}

const CONTINUE_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 100,
	width: Layout.window.width / 1.8,
	backgroundColor: colors.companyGreenTwo
}

const CONTINUE_BUTTON_TEXT: TextStyle = {
	fontSize: 14,
	fontFamily: fonts.PoppinsSemiBold,
	color: colors.palette.white,
}

const BOTTOM_TEXT_LOGIN: TextStyle = {
	...BOTTOM_TEXT,
	color: colors.companyGreenTwo,
	fontFamily: fonts.PoppinsMedium
};

class SignIn extends React.Component<NavigationScreenProps & Props> {
	state={
		compatible: false,
		loading: false
	}
	
	emailInput: NativeMethodsMixinStatic | any
	passwordInput: NativeMethodsMixinStatic | any
	formik: NativeMethodsMixinStatic | any;
	
	checkDeviceForHardware = async () => {
		let compatible = await LocalAuthentication.hasHardwareAsync()
		console.log(compatible)
		this.setState({ compatible });

		if (!compatible) {
			this.props.notify('Current device does not have the necessary hardware to use this functionality.', 'danger')
		} else {
			this.checkForBiometrics()
		}
	}
	
	checkForBiometrics = async () => {
		let biometricRecords = await LocalAuthentication.isEnrolledAsync();
		if (!biometricRecords) {
			this.props.notify('Please ensure you have set up biometrics in your OS settings.', 'error' )
		} else {
			this.handleLoginPress();
		}
	};
	
	handleLoginPress = () => {
		if (Platform.OS === 'android') {
			this.showAndroidAlert();
		} else {
			this.scanBiometrics();
		}
	};
	
	showAndroidAlert = () => {
		Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
		this.scanBiometrics();
	};
	
	scanBiometrics = async () => {
		const { signInUserWithBiometricsAsync, notify, authPassword, authEmail } = this.props
		let result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Biometric Scan.'});
		if (result.success) {
			notify('Bio-Authentication succeeded.', 'success')
			this.setState({ loading: true })
			
			firebase.auth().signInWithEmailAndPassword(authEmail, authPassword)
				.then((user) => {
					// If you need to do anything with the user, do it here
					// The user will be logged in automatically by the
					// `onAuthStateChanged` listener we set up in App.js earlier
					signInUserWithBiometricsAsync()
					this.setState({ loading: false })
				})
				.catch((error) => {
					const { code, message } = error;
					// For details of error codes, see the docs
					// The message contains the default Firebase string
					// representation of the error
					console.tron.log(error)
					this.setState({ loading: false })
					notify(`${message}`, 'danger')
				});
			
		} else {
			notify('Bio-Authentication failed or canceled.', 'danger')
		}
	};
	
	loginWIthBiometrics = () => {
		return this.props.authPassword === ""
			? this.props.notify('No GrapePharm account found, create an account or login.', 'danger')
			: this.checkDeviceForHardware()
	}
	
	onLogin = (values: { email: string; password: string; }) => {
		const { email, password } = values;
		const { signInUserAsync, notify } = this.props;
		
		this.setState({ loading: true })

		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((user) => {
				// If you need to do anything with the user, do it here
				// The user will be logged in automatically by the
				// `onAuthStateChanged` listener we set up in App.js earlier
				console.tron.log(user)
				signInUserAsync(values)
				this.setState({ loading: false })
			})
			.catch((error) => {
				const { code, message } = error;
				// For details of error codes, see the docs
				// The message contains the default Firebase string
				// representation of the error
				console.tron.log(error)
				this.setState({ loading: false })
				notify(`${message}`, 'danger')
			});
	}
	
	onForgetPassword = async () => {
		this.setState({ loading: true })
		
		const auth = firebase.auth();
		const emailAddress = this.formik.values.email.toString().trim();
		console.tron.log(emailAddress.trim())
		

		try {
			const result = await auth.sendPasswordResetEmail(emailAddress)
			console.log(result)
			this.setState({ loading: false })
			this.props.notify(`Please check your email...`, 'success')
			// this.props.notify(`${}`, 'success')
		} catch (error) {
			console.tron.log(error)
			this.setState({ loading: false })
			this.props.notify(`${error.message}`, 'danger')
		}
	}
	
	
	public render(): React.ReactNode {
		
		const {
			navigation, authUserType, authEmail, isLoading
		} = this.props
		
		const { loading } = this.state
		
		return (
			<KeyboardAvoidingView
				enabled={true}
				behavior={Platform.OS === "ios" ? "padding" : null}
			>
				<ScrollView
					contentContainerStyle={ROOT}
					showsVerticalScrollIndicator={false}
					alwaysBounceHorizontal={false}
					alwaysBounceVertical={false}
					style={SCROLL_VIEW}
				>
					
					{
						Platform.OS === "ios"
							? <StatusBar barStyle={"light-content"} />
							: <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.companyGreenTwo} />
					}
					
					<ImageBackground
						source={images.authBackground}
						style={BACKGROUND_IMAGE}
						resizeMethod={'auto'}
						resizeMode='stretch'
					>
						<Header
							leftIcon="arrowBackWhite"
							navigation={navigation}
							onLeftPress={() => navigation.goBack()}
							style={{
								backgroundColor: 'transparent'
							}}
						/>
						
						<View
							style={BACKGROUND_VIEW}
						>
							<View
								style={TOP_VIEW}
							>
								
								<Text
									style={HEADER_TEXT}
								>
									{translate(`common.logIn`)}
								</Text>
								
								<View
									style={HEADER_VIEW}
								>
									<Text
										style={USER_TYPE}
									>
										{authUserType}
									</Text>
									
									<TouchableOpacity
										onPress={() => navigation.goBack()}
									>
										<Text
											style={CHANGE_TEXT}
										>
											{translate(`common.change`)}
										</Text>
									</TouchableOpacity>
								</View>
								
								<Formik
									initialValues={{
										email: authEmail,
										password: "",
									}}
									validationSchema={schema}
									onSubmit={this.onLogin}
									validateOnChange={false}
									validateOnBlur={false}
									enableReinitialize
									innerRef={p => (this.formik = p)}
								>
									{({
										  values,
										  handleChange,
										  handleBlur,
										  errors,
										  isValid,
										  handleSubmit
									  }: FormikProps<MyFormValues>) => (
										<View>
											
											<View
												style={FIELD}
											>
												
												<TextField
													name="email"
													keyboardType="email-address"
													placeholderTx="common.emailPlaceHolder"
													value={values.email}
													onChangeText={handleChange("email")}
													onBlur={handleBlur("email")}
													autoCapitalize="none"
													returnKeyType="next"
													isInvalid={!isValid}
													fieldError={errors.email}
													onSubmitEditing={() => this.passwordInput.focus()}
													forwardedRef={i => {
														this.emailInput = i
													}}
												/>
												
												<TextField
													name="password"
													secureTextEntry
													placeholderTx="common.passwordPlaceHolder"
													value={values.password}
													onChangeText={handleChange("password")}
													onBlur={handleBlur("password")}
													autoCapitalize="none"
													returnKeyType="done"
													isInvalid={!isValid}
													fieldError={errors.password}
													forwardedRef={i => {
														this.passwordInput = i
													}}
													blurOnSubmit={false}
													onSubmitEditing={() => Keyboard.dismiss()}
												/>
											
											
											</View>
										</View>
									)}
								</Formik>
								
								<TouchableOpacity
									onPress={() => this.onForgetPassword()}
								>
									<Text
										style={FORGOT_PASSWORD}
									>
										{translate(`common.forgotPassword`)}
									</Text>
								</TouchableOpacity>
								
								
								<View
									style={BUTTON_VIEW}
								>
									<Button
										loading={isLoading || loading}
										style={CONTINUE_BUTTON}
										textStyle={CONTINUE_BUTTON_TEXT}
										disabled={isLoading || loading}
										onPress={() => this.formik.handleSubmit()}
									>
										<Text style={CONTINUE_BUTTON_TEXT}>{translate(`common.logIn`)}</Text>
									</Button>
								</View>
							
							
							</View>
							
							<View
								style={BOTTOM_VIEW}
							>
								<TouchableOpacity
									onPress={() => this.loginWIthBiometrics()}
									style={{
										justifyContent: 'space-between',
										alignSelf: "center"
									}}
								>
									<Text
										style={BOTTOM_TEXT}
									>
										{translate(`signIn.fingerPrint`)}
									</Text>
									
									<Image
										source={images.fingerPrint}
										style={{
											alignSelf: "center",
											marginTop: 15
										}}
									/>
								</TouchableOpacity>
								
								<TouchableOpacity
									onPress={() => {
										if(authUserType === "Individual") {
											navigation.navigate('indSignUp')
										} else if(authUserType === "Doctor") {
											navigation.navigate('docSignUp')
										} else if(authUserType === "Company") {
											navigation.navigate('comSignUp')
										}
									}}
									style={{
										flexDirection: "row"
									}}
								>
									<Text
										style={BOTTOM_TEXT}
									>
										{translate(`signIn.signUp`)}
									</Text>
									
									<Text
										style={BOTTOM_TEXT_LOGIN}
									>
										{translate(`common.signUp`)}
									</Text>
								</TouchableOpacity>
							
							</View>
						</View>
					</ImageBackground>
				
				</ScrollView>
			
			</KeyboardAvoidingView>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	signInUserWithBiometricsAsync: () => dispatch(signInUserWithBiometricsAsync()),
	signInUserAsync: (values: authCredentials) => dispatch(signInUserAsync(values)),
	notify: (message:string, type: string) => dispatch(notify(message, type)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authUserType: state.auth.userType,
	authEmail: state.auth.email,
	authPassword: state.auth.password,
	isLoading: state.auth.loading,
});

export const SignInScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(SignIn);
