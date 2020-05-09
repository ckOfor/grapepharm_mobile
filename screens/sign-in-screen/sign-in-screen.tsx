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
import {signUpIndividualAsync, signUpCredentials} from "../../redux/auth";

interface DispatchProps {
	signUpAsync: (values: signUpCredentials) => void
}

interface StateProps {
	authUserType: string
	authEmail: string
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
	
	emailInput: NativeMethodsMixinStatic | any
	passwordInput: NativeMethodsMixinStatic | any
	formik: NativeMethodsMixinStatic | any;
	
	submit = (values: signUpCredentials) => {
		// this.props.signUpAsync(values)
	}
	
	public render(): React.ReactNode {
		
		const {
			navigation, authUserType, authEmail, isLoading
		} = this.props
		
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
									onSubmit={this.submit}
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
													onSubmitEditing={() => this.confirmPasswordInput.focus()}
												/>
											
											
											</View>
										</View>
									)}
								</Formik>
								
								<TouchableOpacity
									onPress={() => console.tron.log('Forget!')}
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
										style={CONTINUE_BUTTON}
										textStyle={CONTINUE_BUTTON_TEXT}
										disabled={isLoading}
										onPress={() => this.formik.handleSubmit()}
									>
										{
											isLoading
												? <ActivityIndicator size="small" color={colors.white} />
												: <Text style={CONTINUE_BUTTON_TEXT}>{translate(`common.logIn`)}</Text>
										}
									</Button>
								</View>
							
							
							</View>
							
							<View
								style={BOTTOM_VIEW}
							>
								
								<TouchableOpacity
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
									// onPress={() => navigation.navigate('indSignUp')}
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
	signUpAsync: (values: signUpCredentials) => dispatch(signUpIndividualAsync(values)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authUserType: state.auth.userType,
	authEmail: state.auth.email,
	isLoading: state.auth.loading,
});

export const SignInScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(SignIn);
