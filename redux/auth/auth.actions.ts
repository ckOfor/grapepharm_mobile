// Redux
import { ThunkAction } from "redux-thunk"
import { Action } from "redux"
import { ApplicationState } from ".."
import {
	signUpCredentials, IUser,
	SET_AUTH_EMAIL, SET_AUTH_FULL_NAME, SET_AUTH_USER_TYPE, SIGN_UP_INDIVIDUAL, SIGN_UP_INDIVIDUAL_FAILURE,
	SIGN_UP_INDIVIDUAL_SUCCESS, SET_USER_DETAILS, SET_FCM_TOKEN,
} from "./auth.types";

// APIs
import {
	signUp as apiSignUp,
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

export const signUpIndividual = () => ({
	type: SIGN_UP_INDIVIDUAL,
})

export const signUpIndividualFailure = () => ({
	type: SIGN_UP_INDIVIDUAL_FAILURE,
})

export const signUpIndividualSuccess = (data: any) => ({
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
		const result = await apiSignUp(newValues)
		const { status, message, data } = result.data
		
		if (status) {
			dispatch(notify(`${message}`, 'success'))
			dispatch(signUpIndividualSuccess(data))
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
