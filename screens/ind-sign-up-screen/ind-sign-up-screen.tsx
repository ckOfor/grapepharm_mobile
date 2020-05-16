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
	NativeMethodsMixinStatic, Keyboard, ActivityIndicator, ScrollView
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import firebase from 'react-native-firebase';

// redux
import { ApplicationState } from "../../redux";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import {TextField} from "../../components/text-field";
import {Button} from "../../components/button";
import {signUpIndividualAsync, authCredentials} from "../../redux/auth";
import {fullNameRegExp} from "../../utils/regexes";
import {notify} from "../../redux/startup";

interface DispatchProps {
	signUpAsync: (values: authCredentials) => void
	notify: (message: string, type: string)  => void
}

interface StateProps {
	authFullName: string
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
	// fontSize: 15,
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
	marginBottom: 15
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
	
	onRegister = (values: { email: string; password: string; }) => {
		const { email, password } = values;
		const { signUpAsync, notify } = this.props;
		
		this.setState({ loading: true })
		
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((user) => {
				// If you need to do anything with the user, do it here
				// The user will be logged in automatically by the
				// `onAuthStateChanged` listener we set up in App.js earlier
				console.tron.log(user)
				signUpAsync(values)
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
	
	public render(): React.ReactNode {
		
		const {
			navigation, authFullName, authEmail, isLoading
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
									onSubmit={this.onRegister}
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
													onSubmitEditing={()=> {
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
										onPress={() => this.setState({ termsAndConditions: !termsAndConditions })}
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
									<Button
										loading={isLoading || loading}
										style={CONTINUE_BUTTON}
										textStyle={CONTINUE_BUTTON_TEXT}
										disabled={isLoading || !termsAndConditions || loading}
										onPress={() => this.formik.handleSubmit()}
									>
										<Text style={CONTINUE_BUTTON_TEXT}>{translate(`common.register`)}</Text>
									</Button>
								</View>
								
							
							</View>
							
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
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	signUpAsync: (values: authCredentials) => dispatch(signUpIndividualAsync(values)),
	notify: (message: string, type: string) => dispatch(notify(message, type)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authFullName: state.auth.fullName,
	authEmail: state.auth.email,
	isLoading: state.auth.loading,
});

export const IndSignUpScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(IndSignUp);
