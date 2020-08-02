// react
import React from "react"

// react-native
import {
	StatusBar,
	Platform,
	KeyboardAvoidingView,
  NativeMethodsMixinStatic,
  Image,
  View,
  Text,
  TouchableOpacity
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { GoogleSignin } from '@react-native-community/google-signin';

// components
import { Header } from "../../components/header";
import { Icon } from "../../components/icon";

// redux
import { ApplicationState } from "../../redux";
import { signUpIndividualAsync, authCredentials, signInUserAsync } from "../../redux/auth";

// styles
import { colors, images, fonts } from "../../theme";
import { Layout } from "../../constants";

// Utils
import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import {notify} from "../../redux/startup";
import { translate } from "../../i18n";

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


class Verification extends React.Component<NavigationScreenProps & Props> {
	
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
					
        {
          Platform.OS === "ios"
            ? <StatusBar barStyle={"dark-content"}/>
            : <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.companyGreenTwo}/>
        }	

        <TouchableOpacity
          onPress={() => navigation.navigate('signIn')}
          style={{
            marginTop: 70,
            marginLeft: 30,
          }}
        >
          <Image
            source={require('../../components/icon/icons/arrow-left.png')}
          />
        </TouchableOpacity>
        <View
          style={{
            height: '80%',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <Image
            source={images.verificationIcon}
          />

          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: colors.darkGreen,
              fontSize: 20,
              fontFamily: fonts.PoppinsMedium
            }}
          >
            {translate(`verification.message`)}
          </Text>
        </View>	
			
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

export const VerificationScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Verification);
