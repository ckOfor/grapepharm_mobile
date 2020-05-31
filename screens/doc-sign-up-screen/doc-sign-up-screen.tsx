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
	TouchableOpacity,
	KeyboardAvoidingView,
	NativeMethodsMixinStatic, Keyboard, ScrollView, ActivityIndicator, Image
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";

// redux
import { ApplicationState } from "../../redux";
import { authCredentials, signUpDoctorAsync } from "../../redux/auth";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";

// utils
import { folioNumberRegExp, fullNameRegExp } from "../../utils/regexes";
import {formatFolioNumber} from "../../utils/formatters";

interface DispatchProps {
	signUpDoctorAsync: (values: authCredentials) => void
}

interface StateProps {
	authFullName: string
	authEmail: string
	authFolioNumber: string
	isLoading: boolean
}

interface MyFormValues {
	fullName: string
	email: string
	password: string
	confirmPassword: string
	folioNumber: string
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const schema = Yup.object().shape({
	fullName: Yup.string()
		.min(4, "common.fieldTooShort")
		.matches(fullNameRegExp, "common.fullNameError")
		.required("common.fullNameError"),
	folioNumber: Yup.string()
		.matches(folioNumberRegExp, "common.folioNumberInvalid")
		.required("common.folioNumberError"),
	email: Yup.string()
		.email("common.emailError")
		.required("common.fieldRequired"),
	password: Yup.string()
		.min(6, "common.passwordError")
		.required("common.fieldRequired"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'common.confirmPassword')
		.required("common.fieldRequired")
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

const BUTTON_VIEW: ViewStyle = {
	marginBottom: 30
}

const BOTTOM_TEXT_LOGIN: TextStyle = {
	...BOTTOM_TEXT,
	color: colors.companyGreenTwo,
	fontFamily: fonts.PoppinsMedium
};

class DocSignUp extends React.Component<NavigationScreenProps & Props> {
	
	fullNameInput: NativeMethodsMixinStatic | any
	emailInput: NativeMethodsMixinStatic | any
	passwordInput: NativeMethodsMixinStatic | any
	confirmPasswordInput: NativeMethodsMixinStatic | any
	folioNumberInput: NativeMethodsMixinStatic | any
	formik: NativeMethodsMixinStatic | any;
	
	state={
		loading: false
	}
	
	onEmailRegister = (values: authCredentials) => {
		this.props.signUpDoctorAsync({
			...values,
			authType: 'email'
		})
	}
	
	public render(): React.ReactNode {
		
		const {
			navigation, authFullName, authEmail, authFolioNumber, isLoading
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
									{translate(`common.signUp`)}
								</Text>
								
								<View
									style={HEADER_VIEW}
								>
									<Text
										style={USER_TYPE}
									>
										{translate(`docSignUp.userText`)}
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
										folioNumber: authFolioNumber,
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
													onSubmitEditing={() => this.folioNumberInput.focus()}
												/>
												
												<TextField
													name="folioNumber"
													keyboardType="default"
													placeholderTx="common.folioNumberPlaceHolder"
													value={formatFolioNumber(values.folioNumber)}
													onChangeText={handleChange("folioNumber")}
													onBlur={handleBlur("folioNumber")}
													autoCapitalize="none"
													returnKeyType="next"
													isInvalid={!isValid}
													fieldError={errors.folioNumber}
													// onSubmitEditing={() => this.emailInput.focus()}
													forwardedRef={i => {
														this.folioNumberInput = i
													}}
													onSubmitEditing={()=> {
														Keyboard.dismiss()
													}}
												/>
												
												<View
													style={BUTTON_VIEW}
												>
													<TouchableOpacity
														style={{
															alignSelf: 'center'
														}}
														disabled={isLoading}
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
										</View>
									)}
									
								</Formik>
							
							
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
	signUpDoctorAsync: (values: authCredentials) => dispatch(signUpDoctorAsync(values))
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authFullName: state.auth.fullName,
	authEmail: state.auth.email,
	authFolioNumber: state.auth.folioNumber,
	isLoading: state.auth.loading,
});

export const DocSignUpScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(DocSignUp);
