// Redux
import { ThunkAction } from "redux-thunk"
import { Action } from "redux"
import { ApplicationState } from ".."
import {
	signUpCredentials,
	IUser,
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
} from "./auth.types";

// APIs
import {
	signUpIndividual as apiSignUpIndividual,
	signUpDoctor as apiSignUpDoctor,
	signUpCompany as apiSignUpCompany,
} from "../../services/api"
import {notify} from "../startup";

export const setFCMToken = (payload: string) => ({
	type: SET_FCM_TOKEN,
	payload
})

export const setAuthFullName = (payload: string) => ({
	type: SET_AUTH_FULL_NAME,
	payload
})

export const setAuthEmail = (payload: string) => ({
	type: SET_AUTH_EMAIL,
	payload
})

export const setAuthUserType = (payload: string) => ({
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

export const signUpIndividualAsync = (values: signUpCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { fullName, email } = values
	const notificationId = getState().auth.notificationId
	const newValues = {
		...values,
		notificationId
	}
	
	dispatch(setAuthUserType('individual'))
	dispatch(setAuthFullName(fullName))
	dispatch(setAuthEmail(email))
	dispatch(signUpIndividual())
	
	try {
		const result = await apiSignUpIndividual(newValues)
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signUpIndividualSuccess())
			dispatch(setUserDetails(data))
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

export const signUpDoctor = () => ({
	type: SIGN_UP_DOCTOR,
})

export const signUpDoctorFailure = () => ({
	type: SIGN_UP_DOCTOR_FAILURE,
})

export const signUpDoctorSuccess = () => ({
	type: SIGN_UP_DOCTOR_SUCCESS,
})

export const signUpDoctorAsync = (values: signUpCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { fullName, email, folioNumber } = values
	const notificationId = getState().auth.notificationId
	const newValues = {
		...values,
		notificationId
	}
	
	dispatch(setAuthUserType('individual'))
	dispatch(setAuthFullName(fullName))
	dispatch(setAuthEmail(email))
	dispatch(setAuthFolioNumber(folioNumber))
	dispatch(signUpDoctor())

	try {
		const result = await apiSignUpDoctor(newValues)
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signUpDoctorSuccess())
			dispatch(setUserDetails(data))
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

export const signUpCompanyAsync = (values: signUpCredentials): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {
	const { companyName, email } = values
	const notificationId = getState().auth.notificationId
	const newValues = {
		...values,
		notificationId
	}
	
	dispatch(setAuthUserType('individual'))
	dispatch(setAuthEmail(email))
	dispatch(setAuthCompanyName(companyName))
	dispatch(signUpCompany())
	
	try {
		const result = await apiSignUpCompany(newValues)
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signUpCompanySuccess())
			dispatch(setUserDetails(data))
		} else {
			dispatch(notify(`${message}`, 'danger'))
			dispatch(signUpCompanyFailure())
		}
	} catch ({ message }) {
		dispatch(signUpCompanyFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}
