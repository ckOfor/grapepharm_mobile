// third-parties
import firebase from "react-native-firebase";
import { ThunkAction } from "redux-thunk"
import { Action } from "redux"

// Redux
import { ApplicationState } from ".."
import {
	authCredentials,
	SET_AUTH_EMAIL,
	SET_AUTH_FULL_NAME,
	SET_AUTH_USER_TYPE,
	SIGN_UP_INDIVIDUAL,
	SIGN_UP_INDIVIDUAL_FAILURE,
	SIGN_UP_INDIVIDUAL_SUCCESS,
	SET_USER_DETAILS,
	SET_FCM_TOKEN,
	SET_AUTH_FOLIO_NUMBER,
	SIGN_UP_DOCTOR,
	SIGN_UP_DOCTOR_FAILURE,
	SIGN_UP_DOCTOR_SUCCESS,
	SIGN_UP_COMPANY,
	SIGN_UP_COMPANY_FAILURE,
	SIGN_UP_COMPANY_SUCCESS,
	SET_AUTH_COMPANY_NAME,
	SET_AUTH_PASSWORD,
	SIGN_IN_USER_WITH_BIOMETRICS,
	SIGN_IN_USER_WITH_BIOMETRICS_SUCCESS,
	SIGN_IN_USER_WITH_BIOMETRICS_FAILURE,
	SIGN_IN_USER,
	SIGN_IN_USER_FAILURE,
	SIGN_IN_USER_SUCCESS,
	FORGOT_PASSWORD,
	FORGOT_PASSWORD_FAILURE,
	FORGOT_PASSWORD_SUCCESS,
	forgotPasswordFields,
	EDIT_PASSWORD,
	EDIT_PASSWORD_FAILURE,
	EDIT_PASSWORD_SUCCESS,
	UPDATE_USER_PROFILE_PICTURE,
	UPDATE_USER_PROFILE_PICTURE_FAILURE,
	UPDATE_USER_PROFILE_PICTURE_SUCCESS,
	FETCH_PREDICTIONS,
	FETCH_PREDICTIONS_FAILURE,
	FETCH_PREDICTIONS_SUCCESS,
	SAVE_PREDICTIONS,
	CLEAR_PREDICTIONS,
	SAVE_LOCATION_GEOMETRY,
	SAVE_LOCATION_NAME,
	SAVE_LOCATION_ADDRESS,
	SAVE_LOCATION_DETAILS,
	FETCH_PREDICTION_FROM_SERVER,
	FETCH_PREDICTION_FROM_SERVER_FAILURE,
	FETCH_PREDICTION_FROM_SERVER_SUCCESS,
	SET_PHONE_NUMBER,
	SET_DELIVERY_FEE,
} from "./auth.types";
import { notify } from "../startup";
import axios from 'axios'
import { RN_GOOGLE_MAPS_IOS_API_KEY } from "react-native-dotenv"

// APIs
import {
	signUpIndividual as apiSignUpIndividual,
	signUpDoctor as apiSignUpDoctor,
	signUpCompany as apiSignUpCompany,
	signInUser as apiSignInUser,
	forgotPassword as apiForgotPassword,
	editPassword as apiEditPassword,
	fetchPredictionsFromServer as apiFetchPredictionsFromServer,
	fetchLatitudeAndLongitudeFromServer as apiFetchLatitudeAndLongitudeFromServer
} from "../../services/api"
import { NavigationActions } from "react-navigation";

export const setFCMToken = (payload: string) => ({
	type: SET_FCM_TOKEN,
	payload
})

export const setAuthFullName = (payload: string | undefined) => ({
	type: SET_AUTH_FULL_NAME,
	payload
})

export const setAuthEmail = (payload: string) => ({
	type: SET_AUTH_EMAIL,
	payload
})

export const setAuthPassword = (payload: string | undefined) => ({
	type: SET_AUTH_PASSWORD,
	payload
})

export const setAuthUserType = (payload: string | undefined) => ({
	type: SET_AUTH_USER_TYPE,
	payload
})

export const setAuthFolioNumber = (payload: string | undefined) => ({
	type: SET_AUTH_FOLIO_NUMBER,
	payload
})

export const signUpIndividual = () => ({
	type: SIGN_UP_INDIVIDUAL,
})

export const signUpIndividualFailure = () => ({
	type: SIGN_UP_INDIVIDUAL_FAILURE,
})

export const signUpIndividualSuccess = () => ({
	type: SIGN_UP_INDIVIDUAL_SUCCESS,
})

export const setUserDetails = (user: { details: any }) => ({ type: SET_USER_DETAILS, payload: user })

export const signUpIndividualAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { fullName, email, password, authType } = values
	const notificationId = getState().auth.notificationId
	const newValues = {
		...values,
		notificationId
	}
	
	dispatch(setAuthFullName(fullName))
	dispatch(setAuthEmail(email))
	dispatch(setAuthUserType(authType))
	dispatch(setAuthPassword(password))
	dispatch(signUpIndividual())
	
	try {
		const result = await apiSignUpIndividual(newValues)
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signUpIndividualSuccess())
			dispatch(setUserDetails(data))
			if(authType === "email") {
				dispatch(NavigationActions.navigate({ routeName: 'signIn' }))
			}
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(signUpIndividualFailure())
		}
	} catch ({ message }) {
		dispatch(signUpIndividualFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const setAuthCompanyName = (payload: string | undefined) => ({
	type: SET_AUTH_COMPANY_NAME,
	payload
})

export const setPhoneNumber = (payload: string | undefined) => ({
	type: SET_PHONE_NUMBER,
	payload
})

export const setDeliveryFee= (payload: string | undefined) => ({
	type: SET_DELIVERY_FEE,
	payload
})

export const signUpDoctor = () => ({
	type: SIGN_UP_DOCTOR,
})

export const signUpDoctorFailure = () => ({
	type: SIGN_UP_DOCTOR_FAILURE,
})

export const signUpDoctorSuccess = () => ({
	type: SIGN_UP_DOCTOR_SUCCESS,
})

export const signUpDoctorAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { fullName, email, folioNumber, password } = values
	const notificationId = getState().auth.notificationId
	const newValues = {
		...values,
		notificationId
	}
	
	dispatch(setAuthFullName(fullName))
	dispatch(setAuthEmail(email))
	dispatch(setAuthPassword(password))
	dispatch(setAuthFolioNumber(folioNumber))
	dispatch(signUpDoctor())

	try {
		const result = await apiSignUpDoctor(newValues)
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signUpDoctorSuccess())
			dispatch(setUserDetails(data))
			dispatch(NavigationActions.navigate({ routeName: 'signIn' }))
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(signUpDoctorFailure())
		}
	} catch ({ message }) {
		dispatch(signUpDoctorFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const signUpCompany = () => ({
	type: SIGN_UP_COMPANY,
})

export const signUpCompanyFailure = () => ({
	type: SIGN_UP_COMPANY_FAILURE,
})

export const signUpCompanySuccess = () => ({
	type: SIGN_UP_COMPANY_SUCCESS,
})

export const signUpCompanyAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { companyName, email, password } = values
	const notificationId = getState().auth.notificationId
	const locationName = getState().auth.locationName
	const locationAddress = getState().auth.locationAddress
	const locationDetails = getState().auth.locationDetails
	
	const newValues = {
		...values,
		notificationId,
		locationName,
		locationAddress,
		locationDetails
	}
	
	dispatch(setAuthEmail(email))
	dispatch(setAuthPassword(password))
	dispatch(setAuthCompanyName(companyName))
	dispatch(signUpCompany())
	
	try {
		const result = await apiSignUpCompany(newValues)
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signUpCompanySuccess())
			dispatch(setUserDetails(data))
			dispatch(NavigationActions.navigate({ routeName: 'verification' }))
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(signUpCompanyFailure())
		}
	} catch ({ message }) {
		dispatch(signUpCompanyFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}


export const signInUserWithBiometrics = () => ({
	type: SIGN_IN_USER_WITH_BIOMETRICS,
})

export const signInUserWithBiometricsFailure = () => ({
	type: SIGN_IN_USER_WITH_BIOMETRICS_FAILURE,
})

export const signInUserWithBiometricsSuccess = () => ({
	type: SIGN_IN_USER_WITH_BIOMETRICS_SUCCESS,
})

export const signInUserWithBiometricsAsync = (): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const email = getState().auth.email
	const password = getState().auth.password
	const notificationId = getState().auth.notificationId
	const userType = getState().auth.userType.toLocaleLowerCase()
	
	dispatch(setAuthEmail(email))
	dispatch(setAuthPassword(password))
	dispatch(signInUserWithBiometrics())
	
	try {
		const result = await apiSignInUser({ email, password, notificationId, userType })
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signInUserWithBiometricsSuccess())
			dispatch(setUserDetails(data))
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(signInUserWithBiometricsFailure())
		}
	} catch ({ message }) {
		dispatch(signInUserWithBiometricsFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const signInUser = () => ({
	type: SIGN_IN_USER,
})

export const signInUserFailure = () => ({
	type: SIGN_IN_USER_FAILURE,
})

export const signInUserSuccess = () => ({
	type: SIGN_IN_USER_SUCCESS,
})

export const signInUserAsync = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { email, password, authType, fullName } = values
	const notificationId = getState().auth.notificationId
	const userType = getState().auth.userType.toLocaleLowerCase()

	dispatch(setAuthEmail(email))
	dispatch(setAuthFullName(fullName))
	dispatch(setAuthPassword(password))
	dispatch(signInUser())
	
	try {
		const result = await apiSignInUser({ email, password, notificationId, userType, authType, fullName })
		const { status, message, data } = result.data
		
		if (status) {
			// dispatch(notify(`${message}`, 'success'))
			dispatch(signInUserSuccess())
			dispatch(setUserDetails(data))

			if (message === "Activation email has been sent") {
				dispatch(NavigationActions.navigate({ routeName: 'verification' }))
			}

			if(data.userType === "pharmacy" && data.status === "pending") {
				dispatch(NavigationActions.navigate({ routeName: 'verification' }))
			}

			if(data.status === "suspended") {
				dispatch(notify(`Your account has been ${data.status}`, 'danger'))
				return
			}
			
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(signInUserFailure())
		}
	} catch ({ message }) {
		dispatch(signInUserFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const forgotPassword = () => ({
	type: FORGOT_PASSWORD,
})

export const forgotPasswordFailure = () => ({
	type: FORGOT_PASSWORD_FAILURE,
})

export const forgotPasswordSuccess = () => ({
	type: FORGOT_PASSWORD_SUCCESS,
})

export const forgotPasswordAsync = (email: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const userType = getState().auth.userType.toLocaleLowerCase()

	dispatch(setAuthEmail(email))
	dispatch(forgotPassword())

	try {
		const result = await apiForgotPassword({ email, userType })
		const { status, message } = result.data

		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(forgotPasswordSuccess())
			dispatch(NavigationActions.navigate({ routeName: 'forgotPassword' }))
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(forgotPasswordFailure())
		}
	} catch ({ message }) {
		dispatch(forgotPasswordFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const editPassword = () => ({
	type: EDIT_PASSWORD,
})

export const editPasswordFailure = () => ({
	type: EDIT_PASSWORD_FAILURE,
})

export const editPasswordSuccess = () => ({
	type: EDIT_PASSWORD_SUCCESS,
})

export const editPasswordAsync = (values: forgotPasswordFields): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { code, password } = values
	const userType = getState().auth.userType.toLocaleLowerCase()
	const email = getState().auth.email
	
	dispatch(editPassword())
	
	try {
		const result = await apiEditPassword({ email, code, userType, password })
		const { status, message } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(editPasswordSuccess())
			dispatch(NavigationActions.navigate({ routeName: 'signIn' }))
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(editPasswordFailure())
		}
	} catch ({ message }) {
		dispatch(editPasswordFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const updateUserProfilePicture = () => ({
	type: UPDATE_USER_PROFILE_PICTURE
})

export const updateUserProfilePictureFailure = () => ({
	type: UPDATE_USER_PROFILE_PICTURE_FAILURE
})

export const updateUserProfilePictureSuccess = () => ({
	type: UPDATE_USER_PROFILE_PICTURE_SUCCESS
})


const fetchPredictions = () => ({
	type: FETCH_PREDICTIONS
})

const fetchPredictionsFailure = () => ({
	type: FETCH_PREDICTIONS_FAILURE
})

const fetchPredictionsSuccess = () => ({
	type: FETCH_PREDICTIONS_SUCCESS
})

const savePredictions = (payload: Array<any>) => ({
	type: SAVE_PREDICTIONS,
	payload
})

const clearPredictions = () => ({
	type: CLEAR_PREDICTIONS
})

export const fetchPredictionsAsync = (searchKey: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
	> => async (dispatch, getState) => {
	
	dispatch(fetchPredictions())
	
	try {
		await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKey.replace(' ', '+')}&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${RN_GOOGLE_MAPS_IOS_API_KEY}&region=NG`)
			.then((response) => {
				console.tron.log(response.data.predictions[0].description)
				dispatch(fetchPredictionsSuccess())
				dispatch(savePredictions(response.data.predictions))
			})
			.catch(err => {
				console.tron.log(err)
				console.tron.log(err.response.data.error)
				dispatch(fetchPredictionsFailure())
			})
	} catch (error) {
		console.tron.log(error)
		dispatch(fetchPredictionsFailure())
	}
}

export const fetchPredictionsFromServer = () => ({
	type: FETCH_PREDICTION_FROM_SERVER,
})

export const fetchPredictionsFromServerFailure = () => ({
	type: FETCH_PREDICTION_FROM_SERVER_FAILURE,
})

export const fetchPredictionsFromServerSuccess = () => ({
	type: FETCH_PREDICTION_FROM_SERVER_SUCCESS,
})

export const fetchPredictionsFromServerAsync = (searchKey: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {

	dispatch(fetchPredictionsFromServer())

	try {
		const result = await apiFetchPredictionsFromServer(searchKey)
		const { status, message, data } = result.data
		console.tron.log(data, "FASNN")

		if (status) {
			dispatch(fetchPredictionsFromServerSuccess())
			dispatch(savePredictions(data.predictions))
		} else {
			// dispatch(notify(`${message}`, 'danger'))
			dispatch(fetchPredictionsFromServerFailure())
		}
	} catch ({ message }) {
		dispatch(fetchPredictionsFromServerFailure())
		// dispatch(notify(`${message}`, 'danger'))
	}
}

const saveUserLocationName = (payload: string) => ({
	type: SAVE_LOCATION_NAME,
	payload
})

const saveUserLocationAddress = (payload: string) => ({
	type: SAVE_LOCATION_ADDRESS,
	payload
})

const saveUserLocationDetails = (payload: Array<any>) => ({
	type: SAVE_LOCATION_DETAILS,
	payload
})

const saveUserLocationGeometry = (payload: Array<any>) => ({
	type: SAVE_LOCATION_GEOMETRY,
	payload
})

export const getLatLngFromAddress = (description: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
	> => async (dispatch, getState) => {
	console.tron.log(description)
	
	try {
		await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${description.replace(' ', '%')}&sensor=false&key=${RN_GOOGLE_MAPS_IOS_API_KEY}`)
			.then((response) => {
				dispatch(clearPredictions())
				dispatch(saveUserLocationAddress(response.data.results[0].formatted_address))
				dispatch(saveUserLocationName(response.data.results[0].formatted_address))
				dispatch(saveUserLocationDetails(response.data.results[0]))
				dispatch(saveUserLocationGeometry(response.data.results[0].geometry.location))
			})
			.catch(err => {
				console.tron.log(err)
				console.tron.log(err.response.data.error)
			})
	} catch (error) {
		console.tron.log(error)
	}
}

export const saveCompanyDetails = (values: authCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { companyName, email, password, phoneNumber, deliveryFee } = values
	
	dispatch(setAuthCompanyName(companyName))
	dispatch(setAuthEmail(email))
	dispatch(setAuthPassword(password))
	dispatch(setPhoneNumber(phoneNumber))
	dispatch(setDeliveryFee(deliveryFee))

	dispatch(NavigationActions.navigate({ routeName: 'comSignUpTwo', params: {
		values
	} }))

}

export const getLatLngFromAddressUsingServer = (searchKey: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	try {
		const result = await apiFetchLatitudeAndLongitudeFromServer(searchKey)
		const { status, message, data } = result.data
		console.tron.log(data[0])

		if (status) {
			dispatch(saveUserLocationAddress(data[0].formattedAddress))
			dispatch(saveUserLocationName(data[0].formattedAddress))
			dispatch(saveUserLocationDetails(data[0]))
		} else {
			// dispatch(notify(`${message}`, 'danger'))
			dispatch(fetchPredictionsFromServerFailure())
		}
	} catch ({ message }) {
		dispatch(fetchPredictionsFromServerFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}
