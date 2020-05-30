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

export const SET_AUTH_PASSWORD = "SET_AUTH_PASSWORD"
type SetAuthPasswordAction = {
	type: typeof SET_AUTH_PASSWORD
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
}

export const SET_AUTH_FOLIO_NUMBER = "SET_AUTH_FOLIO_NUMBER"
type SetAuthFolioNumberAction = {
	type: typeof SET_AUTH_FOLIO_NUMBER
	payload: string
};

export const SIGN_UP_DOCTOR = "SIGN_UP_DOCTOR"
type SignUpDoctorAction = {
	type: typeof SIGN_UP_DOCTOR
}

export const SIGN_UP_DOCTOR_FAILURE = "SIGN_UP_DOCTOR_FAILURE"
type SignUpDoctorActionFailure = {
	type: typeof SIGN_UP_DOCTOR_FAILURE
}

export const SIGN_UP_DOCTOR_SUCCESS = "SIGN_UP_DOCTOR_SUCCESS"
type SignUpDoctorActionSuccess = {
	type: typeof SIGN_UP_DOCTOR_SUCCESS
}

export const SET_USER_DETAILS = "SET_USER_DETAILS"
type setUserDetails = {
	type: typeof SET_USER_DETAILS
	payload: IUser
}

export const SET_AUTH_COMPANY_NAME = "SET_AUTH_COMPANY_NAME"
type SetAuthCompanyNameAction = {
	type: typeof SET_AUTH_COMPANY_NAME
	payload: string
};

export const SIGN_UP_COMPANY = "SIGN_UP_COMPANY"
type SignUpCompanyAction = {
	type: typeof SIGN_UP_COMPANY
}

export const SIGN_UP_COMPANY_FAILURE = "SIGN_UP_COMPANY_FAILURE"
type SignUpCompanyActionFailure = {
	type: typeof SIGN_UP_COMPANY_FAILURE
}

export const SIGN_UP_COMPANY_SUCCESS = "SIGN_UP_COMPANY_SUCCESS"
type SignUpCompanyActionSuccess = {
	type: typeof SIGN_UP_COMPANY_SUCCESS
}

export const SIGN_IN_USER_WITH_BIOMETRICS = "SIGN_IN_USER_WITH_BIOMETRICS"
type SignInUserWithBiometricsAction = {
	type: typeof SIGN_IN_USER_WITH_BIOMETRICS
}

export const SIGN_IN_USER_WITH_BIOMETRICS_FAILURE = "SIGN_IN_USER_WITH_BIOMETRICS_FAILURE"
type SignInUserWithBiometricsActionFailure = {
	type: typeof SIGN_IN_USER_WITH_BIOMETRICS_FAILURE
}

export const SIGN_IN_USER_WITH_BIOMETRICS_SUCCESS = "SIGN_IN_USER_WITH_BIOMETRICS_SUCCESS"
type SignInUserWithBiometricsActionSuccess = {
	type: typeof SIGN_IN_USER_WITH_BIOMETRICS_SUCCESS
}

export const SIGN_IN_USER = "SIGN_IN_USER"
type SignInUser = {
	type: typeof SIGN_IN_USER
}

export const SIGN_IN_USER_FAILURE = "SIGN_IN_USER_FAILURE"
type SignInUserFailure = {
	type: typeof SIGN_IN_USER_FAILURE
}

export const SIGN_IN_USER_SUCCESS = "SIGN_IN_USER_SUCCESS"
type SignInUserSuccess = {
	type: typeof SIGN_IN_USER_SUCCESS
}

export const FORGOT_PASSWORD = "FORGOT_PASSWORD"
type ForgotPassword = {
	type: typeof FORGOT_PASSWORD
}

export const FORGOT_PASSWORD_FAILURE = "FORGOT_PASSWORD_FAILURE"
type ForgotPasswordFailure = {
	type: typeof FORGOT_PASSWORD_FAILURE
}

export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS"
type ForgotPasswordSuccess = {
	type: typeof FORGOT_PASSWORD_SUCCESS
}

export const EDIT_PASSWORD = "EDIT_PASSWORD"
type editPassword = {
	type: typeof EDIT_PASSWORD
}

export const EDIT_PASSWORD_FAILURE = "EDIT_PASSWORD_FAILURE"
type editPasswordFailure = {
	type: typeof EDIT_PASSWORD_FAILURE
}

export const EDIT_PASSWORD_SUCCESS = "EDIT_PASSWORD_SUCCESS"
type editPasswordSuccess = {
	type: typeof EDIT_PASSWORD_SUCCESS
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
	licenseRegNumber: string
	annualPractisingLicense: string
	approvedBy: string
}

export type authCredentials = {
	fullName?: string
	authType?: string
	companyName?: string
	email: string
	password?: string
	userType?: string
	folioNumber?: string
	notificationId?: string
}

export type forgotPasswordFields = {
	code: string
	password?: string
	confirmPassword?: string
	userType?: string
	email?: string
}

export type AuthState = {
	fullName: string
	companyName: string
	email: string
	password: string
	userType: string
	notificationId: string
	loading: boolean
	folioNumber: string
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
	| SignUpDoctorAction
	| SignUpDoctorActionFailure
	| SignUpDoctorActionSuccess
	| SetAuthFolioNumberAction
	| SetAuthCompanyNameAction
	| SignUpCompanyAction
	| SignUpCompanyActionFailure
	| SignUpCompanyActionSuccess
	| SetAuthPasswordAction
	| SignInUserWithBiometricsAction
	| SignInUserWithBiometricsActionFailure
	| SignInUserWithBiometricsActionSuccess
	| SignInUser
	| SignInUserFailure
	| SignInUserSuccess
	| ForgotPassword
	| ForgotPasswordFailure
	| ForgotPasswordSuccess
	| editPassword
	| editPasswordFailure
	| editPasswordSuccess