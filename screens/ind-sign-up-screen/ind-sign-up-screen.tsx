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
	NativeMethodsMixinStatic, Keyboard, ScrollView, ActivityIndicator
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { GoogleSignin } from '@react-native-community/google-signin';

// redux
import { ApplicationState } from "../../redux";
import { signUpIndividualAsync, authCredentials, signInUserAsync } from "../../redux/auth";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";

// Utils
import { fullNameRegExp } from "../../utils/regexes";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import {notify} from "../../redux/startup";

interface DispatchProps {
	signUpIndividualAsync: (values: authCredentials) => void
	signInUserAsync: (values: authCredentials) => void
	notify: (message:string, type: string) => void
}

interface StateProps {
	authFullName: string
	authUserType: string
	authEmail: string
	isLoading: boolean
}

interface MyFormValues {
	fullName: string
	email: string
	password: string
	confirmPassword: string
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps


const schema = Yup.object().shape({
	fullName: Yup.string()
		.min(4, "common.fieldTooShort")
		.matches(fullNameRegExp, "common.fullNameError")
		.required("common.fullNameError"),
	email: Yup.string()
		.email("common.emailError")
		.required("common.fieldRequired"),
	password: Yup.string()
		.min(6, "common.passwordError")
		.required("common.fieldRequired"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'common.confirmPassword')
		.required("common.fieldRequired"),
})

const ROOT: ViewStyle = {
	// height: '100%',
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
	// height: '100%',
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
	flexDirection: 'row',
	margin: 50
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

const AGE_TEXT: TextStyle = {
	color: colors.darkGreen,
	fontFamily: fonts.PoppinsMedium,
	marginLeft: 35,
};

const TICK_TEXT: TextStyle = {
	...CHANGE_TEXT,
	width: '70%',
	fontFamily: fonts.PoppinsRegular,
};

const AGE_ICON: ImageStyle = {
	marginBottom: 5
};

const AGE_RESTRICTION_VIEW: TextStyle = {
	marginLeft: 25,
	marginTop: 10,
	marginBottom: 20,
	flexDirection: 'row',
	width: Layout.window.width / 1.3,
	justifyContent: 'space-between'
};

const BUTTON_VIEW: ViewStyle = {
	marginBottom: 20
}

const SOCIAL_VIEW: ViewStyle = {
	margin: 30,
	flexDirection: 'row',
	alignSelf: 'center',
	justifyContent: "space-around",
	width: '50%'
};

const FORGOT_PASSWORD: TextStyle = {
	color: colors.companyGreenTwo,
	fontSize: 12,
	fontFamily: fonts.PoppinsRegular,
	marginRight: 30,
	alignSelf: "flex-end"
};

const SOCIAL_TEXT: TextStyle = {
	...FORGOT_PASSWORD,
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

const BOTTOM_TEXT_LOGIN: TextStyle = {
	...BOTTOM_TEXT,
	color: colors.companyGreenTwo,
	fontFamily: fonts.PoppinsMedium
};

class IndSignUp extends React.Component<NavigationScreenProps & Props> {
	
	fullNameInput: NativeMethodsMixinStatic | any
	emailInput: NativeMethodsMixinStatic | any
	passwordInput: NativeMethodsMixinStatic | any
	confirmPasswordInput: NativeMethodsMixinStatic | any
	formik: NativeMethodsMixinStatic | any;
	
	state={
		termsAndConditions: false,
		loading: false
	}
	
	componentDidMount() {
		GoogleSignin.configure({
			// scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
			webClientId: '273507072258-d7qp1o9m701j9gi0unfv47a6e9q0ocve.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
			offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
			hostedDomain: '', // specifies a hosted domain restriction
			loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
			forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
			accountName: '', // [Android] specifies an account name on the device that should be used
			iosClientId: '273507072258-6einj7inhebaaqi7n907nci58iru33j2.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
		});
	}
	
	onEmailRegister = (values: authCredentials) => {
		this.props.signUpIndividualAsync({
			...values,
			authType: 'email'
		})
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
					email: user.user.email,
					fullName: user.user.displayName,
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
				// this.setState({ googleLoading: false })
			});
	}
	
	public render(): React.ReactNode {
		
		const {
			navigation, authFullName, authEmail, isLoading, authUserType
		} = this.props
		
		const { termsAndConditions, loading } = this.state
		
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
							? <StatusBar barStyle={"light-content"}/>
							: <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.companyGreenTwo}/>
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
									{translate(`common.signUp`)}
								</Text>
								
								<View
									style={HEADER_VIEW}
								>
									<Text
										style={USER_TYPE}
									>
										{translate(`indSignUp.userText`)}
									</Text>
									
									<TouchableOpacity
										onPress={() => navigation.navigate('continue')}
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
										fullName: authFullName,
										email: authEmail,
										password: "",
										confirmPassword: "",
									}}
									validationSchema={schema}
									onSubmit={this.onEmailRegister}
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
													name="fullName"
													keyboardType="default"
													placeholderTx="common.fullNamePlaceHolder"
													value={values.fullName}
													onChangeText={handleChange("fullName")}
													onBlur={handleBlur("fullName")}
													autoCapitalize="words"
													returnKeyType="next"
													isInvalid={!isValid}
													fieldError={errors.fullName}
													onSubmitEditing={() => this.emailInput.focus()}
													forwardedRef={i => {
														this.fullNameInput = i
													}}
												/>
												
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
													onSubmitEditing={() => this.confirmPasswordInput.focus()}
												/>
												
												<TextField
													name="confirmPassword"
													secureTextEntry
													placeholderTx="common.confirmPasswordPlaceHolder"
													value={values.confirmPassword}
													onChangeText={handleChange("confirmPassword")}
													onBlur={handleBlur("confirmPassword")}
													autoCapitalize="none"
													returnKeyType="done"
													isInvalid={!isValid}
													fieldError={errors.confirmPassword}
													forwardedRef={i => {
														this.confirmPasswordInput = i
													}}
													blurOnSubmit={false}
													onSubmitEditing={() => {
														Keyboard.dismiss()
													}}
												/>
											
											</View>
										</View>
									)}
								</Formik>
								
								<Text
									style={AGE_TEXT}
								>
									{translate(`indSignUp.ageVerification`)}
								</Text>
								
								<View
									style={AGE_RESTRICTION_VIEW}
								>
									<Text
										style={TICK_TEXT}
									>
										{translate(`indSignUp.ageDescription`)}
									</Text>
									
									<TouchableOpacity
										onPress={() => this.setState({termsAndConditions: !termsAndConditions})}
									>
										<Image
											source={termsAndConditions ? images.ageCheckBoxTrue : images.ageCheckBoxFalse}
											style={AGE_ICON}
										/>
									</TouchableOpacity>
								</View>
								
								<View
									style={BUTTON_VIEW}
								>
									<TouchableOpacity
										style={{
											alignSelf: 'center'
										}}
										disabled={isLoading || loading || !termsAndConditions}
										onPress={() => this.formik.handleSubmit()}
									>
										{
											isLoading && (
												<ImageBackground
													style={{
														width: 257.71,
														height: 45,
														alignItems: 'center',
														justifyContent: 'center'
													}}
													source={images.btnBKC}
												>
													<ActivityIndicator
														color={colors.white}
													/>
												</ImageBackground>
											)
										}
										
										{
											!isLoading && (
												<Image
													source={images.registerBTN}
												/>
											)
										}
									</TouchableOpacity>
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
												disabled={isLoading || loading || !termsAndConditions}
												onPress={this.onFacebookLoginOrRegister}
											>
												<Image
													source={images.facebookIcon}
													style={[SOCIAL_ICON, {marginRight: 10}]}
												/>
											</TouchableOpacity>
											
											<Text
												style={[OR, {marginRight: 10}]}
											>
												{translate(`signIn.or`)}
											</Text>
											
											<TouchableOpacity
												disabled={isLoading || loading || !termsAndConditions}
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
							
							<TouchableOpacity
								onPress={() => navigation.navigate('signIn')}
								style={BOTTOM_VIEW}
							>
								
								<Text
									style={BOTTOM_TEXT}
								>
									{translate(`common.exitingUser`)}
								</Text>
								
								<Text
									style={BOTTOM_TEXT_LOGIN}
								>
									{translate(`common.logIn`)}
								</Text>
							
							</TouchableOpacity>
						</View>
					</ImageBackground>
				
				</ScrollView>
			
			</KeyboardAvoidingView>
		);
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	signUpIndividualAsync: (values: authCredentials) => dispatch(signUpIndividualAsync(values)),
	signInUserAsync: (values: authCredentials) => dispatch(signInUserAsync(values)),
	notify: (message:string, type: string) => dispatch(notify(message, type)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authFullName: state.auth.fullName,
	authUserType: state.auth.userType,
	authEmail: state.auth.email,
	isLoading: state.auth.loading,
});

export const IndSignUpScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(IndSignUp);
