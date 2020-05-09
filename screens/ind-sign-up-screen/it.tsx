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

// redux
import { ApplicationState } from "../../redux";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import {TextField} from "../../components/text-field";
import {Button} from "../../components/button";

interface DispatchProps {

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
		.required("common.fieldRequired"),
	email: Yup.string()
		.email("common.fieldValidEmail")
		.required("common.fieldRequired"),
	password: Yup.string()
		.min(4, "common.fieldTooShort")
		.required("common.fieldRequired"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'common.passwordMatch')
		.required("common.fieldRequired"),
})

const ROOT: ViewStyle = {
	height: '100%',
	alignItems: 'center'
};

const BACKGROUND_IMAGE: ImageStyle = {
	width: '100%',
	height: Layout.window.height,
};

const BACKGROUND_VIEW: ViewStyle = {
	alignItems: 'center',
	justifyContent: 'center'
}

const TOP_VIEW: ViewStyle = {
	backgroundColor: '#FFFFFF',
	height: Layout.window.height > 700 ? Layout.window.height / 1.4 : Layout.window.height / 1.5,
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
	marginTop: 30,
	fontFamily: fonts.MontserratBold,
	alignSelf: 'center'
};

const HEADER_VIEW: ViewStyle = {
	marginLeft: 30,
	marginTop: 30,
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
	marginTop: Layout.window.height / 20
}

const BOTTOM_TEXT: TextStyle = {
	color: colors.darkPurple,
	fontSize: 13,
	marginTop: 20,
	fontFamily: fonts.PoppinsLight
};

const FIELD: ViewStyle = {
	alignItems: 'center',
	marginTop: 30
}

const CONTINUE_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 100,
	width: Layout.window.width / 1.4,
	// marginTop: 25,
	backgroundColor: colors.purple
}

const CONTINUE_BUTTON_TEXT: TextStyle = {
	fontSize: 12,
	fontFamily: fonts.gibsonRegular,
	color: colors.palette.white,
	textTransform: 'uppercase'
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
	
	submit = (values: MyFormValues) => {
	
	}
	
	public render(): React.ReactNode {
		
		const {
			navigation, authFullName, authEmail, isLoading
		} = this.props
		
		return (
			<KeyboardAvoidingView
				enabled={true}
				// behavior={"padding"}
				keyboardVerticalOffset={150}
				// keyboardVerticalOffset={ Layout.window.height > 700 ? -100 : 50 }
			>
				<ScrollView
					contentContainerStyle={ROOT}
				>
					<ImageBackground
						source={images.authBackground}
						style={BACKGROUND_IMAGE}
						resizeMethod={'auto'}
						resizeMode='stretch'
					>
						
						{
							Platform.OS === "ios"
								? <StatusBar barStyle={"light-content"} />
								: <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.companyGreenTwo} />
						}
						
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
									
									<TouchableOpacity>
										<Text
											style={CHANGE_TEXT}
										>
											{translate(`common.change`)}
										</Text>
									</TouchableOpacity>
								</View>
								
								<Formik
									initialValues={{
										fullName: "",
										email: "",
										password: "",
										confirmPassword: "",
									}}
									validationSchema={schema}
									onSubmit={this.submit}
									enableReinitialize
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
														handleSubmit()
														Keyboard.dismiss()
													}}
												/>
												
												<Button
													style={CONTINUE_BUTTON}
													textStyle={CONTINUE_BUTTON_TEXT}
													disabled={!isValid || isLoading}
													onPress={() => handleSubmit()}
												>
													{
														isLoading
															? <ActivityIndicator size="small" color={colors.palette.white} />
															: <Text style={CONTINUE_BUTTON_TEXT}>{translate(`signUp.signUp`)}</Text>
													}
												</Button>
											</View>
										</View>
									)}
								</Formik>
								
								<Formik
									initialValues={{
										fullName: "",
										email: "",
										password: "",
										confirmPassword: "",
									}}
									validationSchema={schema}
									onSubmit={this.submit}
									enableReinitialize
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
														handleSubmit()
														Keyboard.dismiss()
													}}
												/>
												
												<Button
													style={CONTINUE_BUTTON}
													textStyle={CONTINUE_BUTTON_TEXT}
													disabled={!isValid || isLoading}
													onPress={() => handleSubmit()}
												>
													{
														isLoading
															? <ActivityIndicator size="small" color={colors.palette.white} />
															: <Text style={CONTINUE_BUTTON_TEXT}>{translate(`signUp.signUp`)}</Text>
													}
												</Button>
											</View>
										</View>
									)}
								</Formik>
							
							
							</View>
							
							<TouchableOpacity
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
