// react
import React from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Platform, ImageBackground, ImageStyle, Text, TextStyle, Image, TouchableOpacity,
	KeyboardAvoidingView, NativeMethodsMixinStatic, Keyboard, ScrollView, ActivityIndicator
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";

// redux
import { ApplicationState } from "../../redux";
import { authCredentials, signUpCompanyAsync } from "../../redux/auth";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";

interface DispatchProps {
	signUpCompanyAsync: (values: authCredentials) => void
}

interface StateProps {
	authCompanyName: string
	authEmail: string
	isLoading: boolean
}

interface MyFormValues {
	companyName: string
	email: string
	password: string
	confirmPassword: string
}

interface ComSignUpProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ComSignUpProps

const schema = Yup.object().shape({
	companyName: Yup.string()
		.min(3, "common.fieldTooShort")
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

const REGISTER: TextStyle = {
	color: colors.darkGreen,
	fontFamily: fonts.PoppinsMedium,
	marginLeft: 35,
};

const TICK_TEXT: TextStyle = {
	color: colors.darkPurple,
	fontSize: 13,
	marginLeft: 15,
	fontFamily: fonts.PoppinsRegular,
};

const AGE_ICON: ImageStyle = {
	marginBottom: 5
};

const AGE_RESTRICTION_VIEW: TextStyle = {
	marginLeft: 35,
	marginBottom: 20,
	width: Layout.window.width / 3,
};

const RADIO_VIEW: TextStyle = {
	marginTop: 10,
	flexDirection: 'row',
};

const BUTTON_VIEW: ViewStyle = {
	marginBottom: 30
}

const BOTTOM_TEXT_LOGIN: TextStyle = {
	...BOTTOM_TEXT,
	color: colors.companyGreenTwo,
	fontFamily: fonts.PoppinsMedium
};

class ComSignUp extends React.Component<NavigationScreenProps & Props> {

	companyNameInput: NativeMethodsMixinStatic | any
	emailInput: NativeMethodsMixinStatic | any
	passwordInput: NativeMethodsMixinStatic | any
	confirmPasswordInput: NativeMethodsMixinStatic | any
	formik: NativeMethodsMixinStatic | any;

	state={
		pharmacy: true,
		manufacturer: false,
	}

	submit = (values: authCredentials) => {
		const { manufacturer } = this.state
		const { signUpCompanyAsync } = this.props;
		const newValues = {
			...values,
			companyType: manufacturer ? "manufacturer" : "pharmacy",
			authType: 'email'
		}
		signUpCompanyAsync(newValues)
	}

	public render(): React.ReactNode {
		
		const {
			navigation, authCompanyName, authEmail, isLoading
		} = this.props
		
		const { pharmacy, manufacturer } = this.state
		
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
										{translate(`comSignUp.company`)}
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
										companyName: authCompanyName,
										email: authEmail,
										password: "",
										confirmPassword: "",
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
													name="companyName"
													keyboardType="default"
													placeholderTx="common.companyNamePlaceHolder"
													value={values.companyName}
													onChangeText={handleChange("companyName")}
													onBlur={handleBlur("companyName")}
													autoCapitalize="words"
													returnKeyType="next"
													isInvalid={!isValid}
													fieldError={errors.companyName}
													onSubmitEditing={() => this.emailInput.focus()}
													forwardedRef={i => {
														this.companyNameInput = i
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
									style={REGISTER}
								>
									{translate(`comSignUp.registerAs`)}
								</Text>
								
								<View
									style={AGE_RESTRICTION_VIEW}
								>
									<View
										style={RADIO_VIEW}
									>
										<TouchableOpacity
											onPress={() => !pharmacy && this.setState({ pharmacy : !pharmacy, manufacturer: !manufacturer })}
										>
											<Image
												source={pharmacy ? images.ageCheckBoxTrue : images.ageCheckBoxFalse}
												style={AGE_ICON}
											/>
										</TouchableOpacity>
										
										<Text
											style={[TICK_TEXT, { color: pharmacy ? colors.companyGreenTwo : colors.darkPurple }]}
										
										>
											{translate(`comSignUp.pharmacy`)}
										</Text>
									</View>
									
									{/*<View*/}
									{/*	style={RADIO_VIEW}*/}
									{/*>*/}
									{/*	<TouchableOpacity*/}
									{/*		onPress={() => !manufacturer && this.setState({ pharmacy : !pharmacy, manufacturer: !manufacturer })}*/}
									{/*	>*/}
									{/*		<Image*/}
									{/*			source={manufacturer ? images.ageCheckBoxTrue : images.ageCheckBoxFalse}*/}
									{/*			style={AGE_ICON}*/}
									{/*		/>*/}
									{/*	</TouchableOpacity>*/}
									{/*	*/}
									{/*	<Text*/}
									{/*		style={[TICK_TEXT, { color: manufacturer ? colors.companyGreenTwo : colors.darkPurple }]}*/}
									{/*	>*/}
									{/*		{translate(`comSignUp.manufacturer`)}*/}
									{/*	</Text>*/}
									{/*</View>*/}
									
								</View>
								
								
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
	signUpCompanyAsync: (values: authCredentials) => dispatch(signUpCompanyAsync(values))
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authCompanyName: state.auth.companyName,
	authEmail: state.auth.email,
	isLoading: state.auth.loading,
});

export const ComSignUpScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(ComSignUp);
