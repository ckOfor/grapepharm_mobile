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
import * as ImagePicker from 'expo-image-picker';
import CryptoJS from 'crypto-js';
import * as DocumentPicker from 'expo-document-picker';
import * as firebase from 'firebase/app';
import 'firebase/storage';

// redux
import { ApplicationState } from "../../redux";
import {
	authCredentials, fetchPredictionsAsync, getLatLngFromAddress,
	signUpCompanyAsync,
	updateUserProfilePicture,
	updateUserProfilePictureFailure, updateUserProfilePictureSuccess, saveCompanyDetails
} from "../../redux/auth";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";
import {formatPhoneNumber, formatFolioNumber} from "../../utils/formatters";
import {notify} from "../../redux/startup";

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyB3Dx-so_MRgX_IkamyiWo0fMRyoq_SeLA",
	authDomain: "grapepharm.firebaseapp.com",
	databaseURL: "https://grapepharm.firebaseio.com",
	projectId: "grapepharm",
	storageBucket: "grapepharm.appspot.com",
	messagingSenderId: "273507072258",
	appId: "1:273507072258:web:c45ad46f01d88217ed2a1b",
	measurementId: "G-WXD6EQGN38"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

interface DispatchProps {
	signUpCompanyAsync: (values: authCredentials) => void
	updateUserProfilePicture: () => void
	updateUserProfilePictureFailure: () => void
	updateUserProfilePictureSuccess: () => void
	notify: (message: string, type: string) => void
	fetchPredictionsAsync: (searchKey: string) => void
	getLatLngFromAddress: (description: string) => void
	saveCompanyDetails: (values: authCredentials) => void
}

interface StateProps {
	authCompanyName: string
	authEmail: string
	authPhoneNumber: string
	authDeliveryFee: string
	isLoading: boolean
	predictions: Array<any>
	locationName: string
}

interface MyFormValues {
	companyName: string
	email: string
	password: string
	confirmPassword: string
	phoneNumber: string
	deliveryFee: string
}

interface ComSignUpProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ComSignUpProps

const schema = Yup.object().shape({
	companyName: Yup.string()
		.min(3, "common.fieldTooShort")
		.required("common.fullNameError"),
	phoneNumber: Yup.string()
		.min(10, "common.fieldTooShort")
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
	deliveryFee: Yup.string()
		.required("common.fieldRequired"),
})

const ROOT: ViewStyle = {
	alignItems: 'center',
};

const SCROLL_VIEW: ViewStyle = {
	// height: '100%',
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

const BUTTON_VIEW: ViewStyle = {
	marginBottom: 20
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
	phoneNumberInput: NativeMethodsMixinStatic | any
	addressInput: NativeMethodsMixinStatic | any
	deliveryFeeInput: NativeMethodsMixinStatic | any

	state={
		pharmacy: true,
		manufacturer: false,
		imagesFiles: [],
		pictures: [],
		file: '',
		fileName: '',
    searchPlacesModal: false,
		companyImages: [],
		documentName: '',
		pdfURL: ''
	}
	
	async componentDidMount() {
		if (Platform.OS === "ios") {
			const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	}
	
	submit = (values: authCredentials) => {
		console.tron.log('Called')
		const { navigation, notify, saveCompanyDetails } = this.props;
		const newValues = {
			...values,
			authType: 'email'
		}

		if(values.deliveryFee > 9) {
			// navigation.navigate('comSignUpTwo', {
			// 	values: newValues
			// })
			saveCompanyDetails(newValues)
		} else {
			notify('Invalid delivery price', 'error')
		}
	}
	
	public render(): React.ReactNode {

		const {
			navigation, authCompanyName, authEmail, isLoading, fetchPredictionsAsync, predictions, getLatLngFromAddress, locationName,
			authDeliveryFee, authPhoneNumber
		} = this.props
		
		const { pharmacy, manufacturer, imagesFiles, fileName, searchPlacesModal, companyImages } = this.state
		
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
					bounces={false}
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
										phoneNumber: authPhoneNumber,
										deliveryFee: authDeliveryFee,
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
													returnKeyType="next"
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
													returnKeyType="next"
													isInvalid={!isValid}
													fieldError={errors.confirmPassword}
													forwardedRef={i => {
														this.confirmPasswordInput = i
													}}
													blurOnSubmit={false}
													onSubmitEditing={() => this.phoneNumberInput.focus()}
												/>
												
												<TextField
													name="phoneNumber"
													placeholderTx="comSignUp.phoneNumberPlaceHolder"
													value={formatPhoneNumber(values.phoneNumber)}
													onChangeText={handleChange("phoneNumber")}
													onBlur={handleBlur("phoneNumber")}
													autoCapitalize="none"
													returnKeyType="next"
													isInvalid={!isValid}
													fieldError={errors.phoneNumber}
													forwardedRef={i => {
														this.phoneNumberInput = i
													}}
													blurOnSubmit={false}
													onSubmitEditing={() => this.deliveryFeeInput.focus()}
												/>
												
						
												<TextField
													name="deliveryFee"
													placeholderTx="common.deliveryFee"
													value={formatFolioNumber(values.deliveryFee)}
													onChangeText={handleChange("deliveryFee")}
													onBlur={handleBlur("deliveryFee")}
													autoCapitalize="none"
													returnKeyType="done"
													isInvalid={!isValid}
													fieldError={errors.deliveryFee}
													forwardedRef={i => {
														this.deliveryFeeInput = i
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
													source={images.continueBTN}
												/>
											)
										}
									</TouchableOpacity>
								</View>
							
							
							</View>
							
							<TouchableOpacity
								onPress={() => navigation.goBack()}
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
	signUpCompanyAsync: (values: authCredentials) => dispatch(signUpCompanyAsync(values)),
	updateUserProfilePicture: () => dispatch(updateUserProfilePicture()),
	updateUserProfilePictureFailure: () => dispatch(updateUserProfilePictureFailure()),
	updateUserProfilePictureSuccess: () => dispatch(updateUserProfilePictureSuccess()),
	notify: (message: string, type: string) => dispatch(notify(message, type)),
	fetchPredictionsAsync: (searchKey: string) => dispatch(fetchPredictionsAsync(searchKey)),
	getLatLngFromAddress: (description: string) => dispatch(getLatLngFromAddress(description)),
	saveCompanyDetails: (values: authCredentials) => dispatch(saveCompanyDetails(values)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authCompanyName: state.auth.companyName,
	authEmail: state.auth.email,
	authPhoneNumber: state.auth.phoneNumber,
	authDeliveryFee: state.auth.deliveryFee,
	isLoading: state.auth.loading,
	predictions: state.auth.predictions,
	locationName: state.auth.locationName,
});

export const ComSignUpScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(ComSignUp);
