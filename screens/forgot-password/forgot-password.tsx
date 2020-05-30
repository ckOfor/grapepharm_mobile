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
import {
	editPasswordAsync,
	forgotPasswordFields,
} from "../../redux/auth";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";
import {formatResetPasswordCode} from "../../utils/formatters";

interface DispatchProps {
	editPasswordAsync: (values: forgotPasswordFields) => void
}

interface StateProps {
	authUserType: string
	authEmail: string
	authPassword: string
	isLoading: boolean
}

interface MyFormValues {
	confirmPassword: string;
	code: string
	password: string
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const schema = Yup.object().shape({
	code: Yup.string()
		.min(6,"common.codeLength")
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
	margin: 30
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

class ForgotPassword extends React.Component<NavigationScreenProps & Props> {
	state={
		compatible: false,
		loading: false
	}
	
	passwordInput: NativeMethodsMixinStatic | any
	confirmPasswordInput: NativeMethodsMixinStatic | any
	formik: NativeMethodsMixinStatic | any;
	
	onReset = (values: forgotPasswordFields) => {
		this.props.editPasswordAsync(values)
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
									{translate(`forgot.header`)}
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
										code: "",
										password: "",
										confirmPassword: "",
									}}
									validationSchema={schema}
									onSubmit={this.onReset}
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
													name="code"
													keyboardType="default"
													placeholderTx="common.codePlatform"
													value={formatResetPasswordCode(values.code)}
													onChangeText={handleChange("code")}
													onBlur={handleBlur("code")}
													autoCapitalize="none"
													returnKeyType="next"
													isInvalid={!isValid}
													fieldError={errors.code}
													onSubmitEditing={() => this.passwordInput.focus()}
													forwardedRef={i => {
														this.passwordInput = i
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
													onSubmitEditing={() => Keyboard.dismiss()}
												/>
												
											</View>
										</View>
									)}
								</Formik>
								
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
										<Text style={CONTINUE_BUTTON_TEXT}>{translate(`forgot.reset`)}</Text>
									</Button>
								</View>
							
							
							</View>
							
						</View>
					</ImageBackground>
				
				</ScrollView>
			
			</KeyboardAvoidingView>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	editPasswordAsync: (values: forgotPasswordFields) => dispatch(editPasswordAsync(values))
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authUserType: state.auth.userType,
	authEmail: state.auth.email,
	authPassword: state.auth.password,
	isLoading: state.auth.loading,
});

export const ForgotPasswordScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(ForgotPassword);
