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
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import firebase from "react-native-firebase";


// redux
import { ApplicationState } from "../../redux";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";
import {
	authCredentials,
	signInUserWithBiometricsAsync,
	signInUserAsync,
	forgotPasswordAsync
} from "../../redux/auth";
import {notify} from "../../redux/startup";

interface DispatchProps {
	signInUserWithBiometricsAsync: () => void
	signInUserAsync: (values: authCredentials) => void
	notify: (message:string, type: string) => void
	forgotPasswordAsync: (email: string) => void
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
	height: Layout.window.height / 5
}

const BOTTOM_TEXT: TextStyle = {
	color: colors.darkPurple,
	fontSize: 13,
	fontFamily: fonts.PoppinsLight,
	marginBottom: 10
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

const SOCIAL_VIEW: ViewStyle = {
	margin: 30,
	flexDirection: 'row',
	alignSelf: 'center',
	justifyContent: "space-around",
	width: '50%'
};

const SOCIAL_TEXT: TextStyle = {
	...FORGOT_PASSWORD,
	// color: colors.socialText,
	fontSize: 16,
	marginTop: 5
};

const SOCIAL_ICON: ImageStyle = {
	width: 35,
	height: 35,
};

const OR: TextStyle = {
	color: colors.companyGreen,
	fontSize: 16,
	marginTop: 10,
};

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
		const { signInUserWithBiometricsAsync, notify } = this.props
		let result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Biometric Scan.'});
		if (result.success) {
			notify('Bio-Authentication succeeded.', 'success')
			signInUserWithBiometricsAsync()
		} else {
			notify('Bio-Authentication failed or canceled.', 'danger')
		}
	};
	
	loginWIthBiometrics = () => {
		return this.props.authPassword === ""
			? this.props.notify('No GrapePharm account found, create an account or login.', 'danger')
			: this.checkDeviceForHardware()
	}
	
	onLogin = (values: authCredentials) => {
		const { signInUserAsync } = this.props;
		signInUserAsync(values)
	}
	
	onForgetPassword = async () => {
		this.props.forgotPasswordAsync(this.formik.values.email)
	}
	
	onFacebookLoginOrRegister = () => {
		const { notify, signInUserAsync } = this.props
		this.setState({ loading: true })
		LoginManager.logInWithPermissions(['public_profile', 'email'])
			.then((result) => {
				if (result.isCancelled) {
					return Promise.reject(new Error('The user cancelled the request'));
				}
				// Retrieve the access token
				return AccessToken.getCurrentAccessToken();
			})
			.then((data) => {
				// Create a new Firebase credential with the token
				const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
				// Login with the credential
				return firebase.auth().signInWithCredential(credential);
			})
			.then((user) => {
				this.setState({ loading: false })
				// If you need to do anything with the user, do it here
				// The user will be logged in automatically by the
				// `onAuthStateChanged` listener we set up in App.js earlier
				// console.tron.log(user)
				const userInformation = {
					password: user.user.uid,
					fullName: user.user.displayName,
					email: user.user.email,
					authType: 'facebook'
				}
				// @ts-ignore
				signInUserAsync(userInformation)
			})
			.catch((error) => {
				this.setState({ loading: false })
				const { code, message } = error;
				notify(message, 'danger')
				// For details of error codes, see the docs
				// The message contains the default Firebase string
				// representation of the error
			});
	}
	
	onGoogleLoginOrRegister = () => {
		const { notify, signInUserAsync } = this.props
		this.setState({ googleLoading: true })
		console.tron.log('kkkkk')
		GoogleSignin.signIn()
			.then((data) => {
				// Create a new Firebase credential with the token
				const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
				// Login with the credential
				return firebase.auth().signInWithCredential(credential);
			})
			.then((user) => {
				// setAuthPassword(user.user.uid)
				// If you need to do anything with the user, do it here
				// The user will be logged in automatically by the
				// `onAuthStateChanged` listener we set up in App.js earlier
				console.tron.log(user)
				const userInformation = {
					password: user.user.uid,
					email: user.user.email,
					fullName: user.user.displayName,
					authType: 'facebook'
				}
				// @ts-ignore
				signInUserAsync(userInformation)
				this.setState({ googleLoading: false })
			})
			.catch((error) => {
				console.tron.log(error)
				const { code, message } = error;
				console.log(message)
				console.log(code)
				notify(`${message}`, 'danger')
				// For details of error codes, see the docs
				// The message contains the default Firebase string
				// representation of the error
				this.setState({ googleLoading: false })
			});
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
							
							{
								authUserType === "Individual" && (
									<View
										style={SOCIAL_VIEW}
									>
										<Text
											style={SOCIAL_TEXT}
										>
											{translate(`signIn.continue`)}
										</Text>
										
										<View
											style={{
												flexDirection: "row",
											}}
										>
											<TouchableOpacity
												disabled={isLoading || loading}
												onPress={this.onFacebookLoginOrRegister}
											>
												<Image
													source={images.facebookIcon}
													style={[SOCIAL_ICON, { marginRight: 10 }]}
												/>
											</TouchableOpacity>
											
											<Text
												style={[OR, { marginRight: 10 }]}
											>
												{translate(`signIn.or`)}
											</Text>
											
											<TouchableOpacity
												disabled={isLoading || loading}
												onPress={this.onGoogleLoginOrRegister}
											>
												<Image
													source={images.googleIcon}
													style={SOCIAL_ICON}
												/>
											</TouchableOpacity>
										</View>
									</View>
								)
							}
							
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
	forgotPasswordAsync: (email: string) => dispatch(forgotPasswordAsync(email)),
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
