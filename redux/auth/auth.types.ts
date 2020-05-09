export const SET_FCM_TOKEN = "SET_FCM_TOKEN"
type SetFCMTokenAction = {
	type: typeof SET_FCM_TOKEN
	payload: string
}

export const SET_AUTH_FULL_NAME = "SET_AUTH_FULL_NAME"
type SetAuthFullNameAction = {
	type: typeof SET_AUTH_FULL_NAME
	payload: string
};

export const SET_AUTH_EMAIL = "SET_AUTH_EMAIL"
type SetAuthEmailAction = {
	type: typeof SET_AUTH_EMAIL
	payload: string
};

export const SET_AUTH_USER_TYPE = "SET_AUTH_USER_TYPE"
type SetAuthUserTypeAction = {
	type: typeof SET_AUTH_USER_TYPE
	payload: string
};

export const SIGN_UP_INDIVIDUAL = "SIGN_UP_INDIVIDUAL"
type SignUpIndividualAction = {
	type: typeof SIGN_UP_INDIVIDUAL
}

export const SIGN_UP_INDIVIDUAL_FAILURE = "SIGN_UP_INDIVIDUAL_FAILURE"
type SignUpIndividualActionFailure = {
	type: typeof SIGN_UP_INDIVIDUAL_FAILURE
}

export const SIGN_UP_INDIVIDUAL_SUCCESS = "SIGN_UP_INDIVIDUAL_SUCCESS"
type SignUpIndividualActionSuccess = {
	type: typeof SIGN_UP_INDIVIDUAL_SUCCESS
	payload: string
}

export const SET_USER_DETAILS = "SET_USER_DETAILS"
type setUserDetails = {
	type: typeof SET_USER_DETAILS
	payload: IUser
}

export type IUser = {
	id: number
	fullName: string
	email: string
	password: string
	phoneNumber: string
	notificationId?: string
	grapePharmId: string
	pictureURL: string
	address: string
	city: string
	state: string
	country: string
	ratings: number
	gender: string
	cart: Array<any>
	latitude: string
	longitude: string
	DOB: string
	cardDetails: Array<any>
	status: string
	userType:string
	suspensionReason: string
	updatedAt: string
	createdAt: string
}

export type signUpCredentials = {
	fullName: string
	email: string
	password: string
	userType?: string
	notificationId?: string
}

export type AuthState = {
	fullName: string
	email: string
	userType: string
	notificationId: string
	loading: boolean
	user: IUser | []
}

export type AuthAction =
	| SetAuthFullNameAction
	| SetAuthEmailAction
	| SetAuthUserTypeAction
	| SignUpIndividualAction
	| SignUpIndividualActionFailure
	| SignUpIndividualActionSuccess
	| setUserDetails
	| SetFCMTokenAction