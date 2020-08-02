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

// components
import { Header } from "../../components/header";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";

// redux
import { ApplicationState } from "../../redux";
import {
	authCredentials, fetchPredictionsAsync, getLatLngFromAddress,
	signUpCompanyAsync,
	updateUserProfilePicture,
	updateUserProfilePictureFailure, updateUserProfilePictureSuccess, fetchPredictionsFromServerAsync, getLatLngFromAddressUsingServer
} from "../../redux/auth";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { translate } from "../../i18n";
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
	fetchPredictionsFromServerAsync: (searchKey: string) => void
	getLatLngFromAddress: (description: string) => void
	getLatLngFromAddressUsingServer: (description: string) => void
}

interface StateProps {
	authCompanyName: string
	authEmail: string
	isLoading: boolean
	predictions: Array<any>
	locationName: string
}

interface MyFormValues {
	address: string
}

interface ComSignUpProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ComSignUpProps

const schema = Yup.object().shape({
	address: Yup.string()
		.min(3, "common.fieldTooShort")
		.required("common.fullNameError"),
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

const ADD: ViewStyle = {
	flexDirection: "row",
	marginBottom: 20
}

const ADD_ICON: ImageStyle = {
	marginLeft: 15
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


const NEXT_BUTTON: ViewStyle = {
	alignSelf: "center",
	justifyContent: "center",
	borderRadius: 10,
	borderWidth: 1,
	borderColor: colors.uploadImage,
	width: 288,
	height: 50,
	marginTop: 20,
	marginBottom: 20,
};

const NEXT_BUTTON_TEXT: TextStyle = {
	fontSize: 12,
	fontFamily: fonts.PoppinsMedium,
	color: colors.uploadImage,
	marginLeft: 10
};

const SEARCH_MODAL_VIEW: ViewStyle = {
	alignItems: 'center',
	marginBottom: 10,
}

const SEARCH_MODAL: ViewStyle = {
	backgroundColor: '#FFF',
	borderColor: 'transparent',
	width: Layout.window.width / 1.2,
	flexDirection: 'column',
	zIndex: 1,
}

const MODAL_BUTTON_TEXT: TextStyle = {
	marginTop: 10,
	marginBottom: 10,
	fontSize: 15,
	color: colors.blue1,
}

class ComSignUpTwo extends React.Component<NavigationScreenProps & Props> {

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
    pdfURL: '',
		values: {},
		uploadingDoc: false,
		uploadingImage: false,
		currentImageName: ''
	}
	
	async componentDidMount() {
		if (Platform.OS === "ios") {
			const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
		
    this.setState({
      values: this.props.navigation.state.params.values
    })
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
      values: nextProps.navigation.state.params.values
    })
	}
	
	submit = (formValue: authCredentials) => {
		const { manufacturer, imagesFiles, pdfURL, values } = this.state
		const { signUpCompanyAsync, notify } = this.props;
		const newValues = {
			...formValue,
			companyType: manufacturer ? "manufacturer" : "pharmacy",
			authType: 'email',
			...values
		}
		// signUpCompanyAsync(newValues)

		if (imagesFiles.length < 0) {
			notify('Add at least one image', 'danger')
		} else if (pdfURL === '') {
			notify("Upload company's license", 'danger')
		} else {
			this.sendToServer()
     }
	}

	sendToServer = () => {
		const { values, pdfURL, pictures, imagesFiles } = this.state
		console.tron.log(values)
		// @ts-ignore
		this.props.signUpCompanyAsync({
			...values,
			license: pdfURL,
			pictures: imagesFiles,
		})
	}

	pickImage = async () => {
		await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
      allowsMultipleSelection: true,
		})
		.then((result) => {
			if(result.type !== 'cancel') {
				console.tron.log(result, "RESULT")
				const currentImageName = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
				this.setState({ 
					uploadingImage: true,
					// imagesFiles: [...imagesFiles, result.uri],
					// companyImages: [...companyImages, result.base64],
				 })
				return this.uriToImageBlob(result.uri, currentImageName, `.${result.uri.split('.').pop()}`)
			}
		})
		.then((file) => {
			const { blob, name, type } = file
			console.tron.log(file, "FILE")
			return this.uploadImageToFirebase(blob, name, type)
    })
    .catch((error) => {
			console.tron.log(error)
			this.setState({ 
				uploadingImage: false,
			})
    })
	};

	uriToImageBlob = (uri: string, name: string, type: string) => {

		console.tron.log(uri, name, type,"CALLED")

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve({
          blob: xhr.response, 
          name, 
          type
        });
      };
      
      xhr.onerror = function(error) {
				// something went wrong
				console.tron.log("uriToBlob failed", error)
				this.setState({ 
					uploadingImage: false,
				})
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
			xhr.open('GET', uri, true);
			console.tron.log("uriToBlob Success", uri)
      
      xhr.send(null);
    });
	}

	fetchImage = () => {
		const { notify } = this.props
		const { imagesFiles } = this.state
		var storageRef = firebase.storage().ref();
		// Create a reference to the file we want to download
		var starsRef = storageRef.child(`${this.state.currentImageName}`);

		starsRef.getDownloadURL()
			.then((imgURL) => {
				console.tron.log(imgURL, "URL")
				this.setState({
					imagesFiles: [...imagesFiles, imgURL],
					uploadingImage: false
				})
			})
			.catch((error) => {
				this.setState({
					uploadingImage: false
				})
				console.tron.log(error, "ERROR")
				switch (error.code) {
					case 'storage/object-not-found':
						// File doesn't exist
						notify(`File doesn't exist`, 'error')
						break;

					case 'storage/unauthorized':
						notify(`User doesn't have permission to access the object`, 'error')
						// User doesn't have permission to access the object
						break;
			
					case 'storage/canceled':
						// User canceled the upload
						notify(`User canceled the upload`, 'error')
						break;

					case 'storage/unknown':
						notify(`Unknown error occurred`, 'error')
						// Unknown error occurred, inspect the server response
						break;
				}
			})
	}

	uploadImageToFirebase = (blob: any, name: string, type: string) => {
		const currentImageName = `images/${name}`

		this.setState({ 
			uploadingImage: true,
			currentImageName
		})

    var storageRef = firebase.storage().ref();
      storageRef.child(currentImageName).put(blob, {
        contentType: `${type}`
      }).then(()=>{
				this.fetchImage()
      }).catch((error)=>{
        console.tron.log(error.message, "ERROR ERROR")
				console.tron.log(error)
				this.setState({ 
					uploadingDoc: false
				})
      });
  }
  
	uploadDocument = async () => {
    await DocumentPicker.getDocumentAsync({})
    .then((result) => {
			console.tron.log(result)

			if(result.type !== 'cancel') {
				this.setState({ file: result.uri, fileName: result.name })
				return this.uriToBlob(result.uri, result.name, `.${result.uri.split('.').pop()}`);
			}

		})
    .then((file) => {
      const { blob, name, type } = file
			return this.uploadToFirebase(blob, name, type)
    })
    .catch((error) => {
      console.tron.log(error)
    })
	}
	
  
  uriToBlob = (uri: string, name: string, type: string) => {

		console.tron.log(uri, name, type,"CALLED")
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve({
          blob: xhr.response, 
          name, 
          type
        });
      };
      
      xhr.onerror = function(error) {
				// something went wrong
				console.tron.log("uriToBlob failed", error)
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      
      xhr.send(null);
    });
	}
	
	fetchPDF = () => {
		const { notify } = this.props
		var storageRef = firebase.storage().ref();
		// Create a reference to the file we want to download
		var starsRef = storageRef.child(`${this.state.documentName}`);

		starsRef.getDownloadURL()
			.then((pdfURL) => {
				// console.tron.log(pdfURL, "URL")
				this.setState({
					pdfURL,
					uploadingDoc: false
				})
			})
			.catch((error) => {
				this.setState({
					uploadingDoc: false
				})
				console.tron.log(error, "ERROR")
				switch (error.code) {
					case 'storage/object-not-found':
						// File doesn't exist
						notify(`File doesn't exist`, 'error')
						break;

					case 'storage/unauthorized':
						notify(`User doesn't have permission to access the object`, 'error')
						// User doesn't have permission to access the object
						break;
			
					case 'storage/canceled':
						// User canceled the upload
						notify(`User canceled the upload`, 'error')
						break;

					case 'storage/unknown':
						notify(`Unknown error occurred`, 'error')
						// Unknown error occurred, inspect the server response
						break;
				}
			})
	}

  uploadToFirebase = (blob: any, name: string, type: string) => {
		const generateNewjId = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
		const documentName = `license/${generateNewjId}_${name}`

		this.setState({ 
			documentName,
			uploadingDoc: true
		})

    var storageRef = firebase.storage().ref();
      storageRef.child(documentName).put(blob, {
        contentType: `${type}`
      }).then(()=>{
				this.fetchPDF()
      }).catch((error)=>{
        console.tron.log(error.message, "ERROR ERROR")
				console.tron.log(error)
				this.setState({ 
					documentName,
					uploadingDoc: false
				})
        // reject(error);
      });
  }

	public render(): React.ReactNode {
		console.tron.log(this.state, "STATE")

		const {
			navigation, authCompanyName, authEmail, isLoading, fetchPredictionsFromServerAsync, predictions, getLatLngFromAddress, locationName,
			signUpCompanyAsync, getLatLngFromAddressUsingServer
		} = this.props
		
		const { 
			documentName, pdfURL, pharmacy, manufacturer, imagesFiles, fileName, searchPlacesModal, companyImages, values, uploadingDoc, uploadingImage
		 } = this.state

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
										address: locationName,
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
													name="address"
													placeholderTx="comSignUp.addressPlaceHolder"
													value={values.address}
													onChangeText={handleChange("address")}
													onChange={() => fetchPredictionsFromServerAsync(this.formik.values.address)}
													onFocus={() => {
														this.setState({
															searchPlacesModal: true,
														})
													}}
													// onBlur={() => {
													// 	this.setState({
													// 		searchPlacesModal: false,
													// 	})
													// }}
													autoCapitalize="none"
													returnKeyType="done"
													isInvalid={!isValid}
													fieldError={errors.address}
													forwardedRef={i => {
														this.addressInput = i
													}}
													blurOnSubmit={false}
												
												/>
												
												{
													searchPlacesModal && (
														<ScrollView
															contentContainerStyle={SEARCH_MODAL_VIEW}
														>
															
															<View
																style={SEARCH_MODAL}
															>
																{
																	predictions.map((prediction, index) => {
																		return (
																			<TouchableOpacity
																				key={index}
																				style={{
																					marginLeft: 20,
																					marginRight: 10,
																				}}
																				onPress={() => {
																					// alert('djds')
																					console.tron.log(prediction, "PREDICTION")
																					getLatLngFromAddressUsingServer(prediction.description)
																					this.setState({
																						searchPlacesModal: false
																					})
																				}}
																			>
																				<Text
																					style={MODAL_BUTTON_TEXT}
																				>
																					{prediction.description}
																				</Text>
																			</TouchableOpacity>
																		)
																	})
																}
															</View>
															
														</ScrollView>
													)
												}
											
											</View>
										</View>
									)}
								</Formik>
								

								{
									!searchPlacesModal && (
										<View>
												
											<View
												style={ADD}
											>
												<Text
													style={REGISTER}
												>
													{translate(`comSignUp.addImage`)}
												</Text>
												
												<TouchableOpacity
													onPress={this.pickImage}
												>
													{
														uploadingImage 
														?
															<ActivityIndicator
																style={[ADD_ICON]}
																color={colors.companyGreenTwo}
															/>
														: 
															<Image
																source={images.addIcon}
																style={ADD_ICON}
															/>
													}
													
												</TouchableOpacity>
											</View>
											
											
											<View
												style={{
													flexDirection: "row",
													marginLeft: 20,
													marginBottom: imagesFiles.length < 1 ? 10 : 0,
												}}
											>
												{
													imagesFiles && imagesFiles.map((image, index) => {
														
														console.tron.log(image)
														return (
															<View>
																<ImageBackground
																	style={{
																		width: 55,
																		height: 55,
																		margin: 10,
																		marginTop: 0,
																		alignItems: "flex-end",
																	}}
																	source={{ uri: image }}
																	imageStyle={{
																		borderRadius: 10,
																	}}
																>
																	<TouchableOpacity
																		onPress={() => {
																			const deletedItem = imagesFiles.filter((item, newIndex) => {
																				return  newIndex !== index && item
																			})
																			
																			const deletedCompanyImage = companyImages.filter((item, newIndex) => {
																				return  newIndex !== index && item
																			})
																			
																			this.setState({
																				imagesFiles: deletedItem,
																				companyImages: deletedCompanyImage
																			})
																		}}
																	>
																		<Image
																			source={images.cancelIconRed}
																		/>
																	</TouchableOpacity>
																</ImageBackground>
															</View>
														)
													})
												}
											</View>
											
											<Text
												style={REGISTER}
											>
												{translate(`comSignUp.license`)}
											</Text>
											
											<Button
												style={NEXT_BUTTON}
												textStyle={NEXT_BUTTON_TEXT}
												onPress={() => {
													this.uploadDocument()
												}}
												tx={`intro.screenOneHeader`}
											>
												<View
													style={{
														flexDirection: "row",
														justifyContent: "space-evenly"
													}}
												>
													<Image source={images.addIcon} />
													
													<Text
														style={NEXT_BUTTON_TEXT}
													>
														{translate(`comSignUp.uploadFile`)}
													</Text>
												</View>
											</Button>
											
											<View
												style={{
													flexDirection: "row",
													marginBottom: 20
												}}
											>
												<Text
													style={[REGISTER, { color: colors.companyGreenTwo, marginTop: 5 }]}
												>
													{translate(`comSignUp.fileName`, {
														fileName
													})}
												</Text>
												
												{
													documentName !== '' && (
														<TouchableOpacity
															onPress={() => this.setState({
																fileName: '',
																file: '',
																pdfURL: ''
															})}
														>
															{
																!uploadingDoc
																	? 
																		<View>
																			{
																				fileName !== '' && (
																					<Image
																						source={images.cancelIconRed}
																						style={ADD_ICON}
																					/>
																				)
																			}
																		</View>
																	: 
																		<ActivityIndicator
																			style={[ADD_ICON, { margin: 6 }]}
																			color={colors.companyGreenTwo}
																		/>
															}
														</TouchableOpacity>
													)
												}
											</View>
											
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
													disabled={isLoading || uploadingImage || uploadingDoc}
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
									)
								}
							</View>
							
							{
								!searchPlacesModal && (
									<TouchableOpacity
										onPress={this.pickImage}
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
								)
							}
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
	fetchPredictionsFromServerAsync: (searchKey: string) => dispatch(fetchPredictionsFromServerAsync(searchKey)),
	getLatLngFromAddress: (description: string) => dispatch(getLatLngFromAddress(description)),
	getLatLngFromAddressUsingServer: (description: string) => dispatch(getLatLngFromAddressUsingServer(description)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authCompanyName: state.auth.companyName,
	authEmail: state.auth.email,
	isLoading: state.auth.loading,
	predictions: state.auth.predictions,
	locationName: state.auth.locationName,
});

export const ComSignUpScreenTwo = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(ComSignUpTwo);
