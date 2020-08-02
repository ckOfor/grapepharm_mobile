import {
	AuthAction,
	AuthState,
	EDIT_PASSWORD,
	EDIT_PASSWORD_FAILURE,
	EDIT_PASSWORD_SUCCESS,
	FORGOT_PASSWORD,
	FORGOT_PASSWORD_FAILURE,
	FORGOT_PASSWORD_SUCCESS,
	SAVE_LOCATION_ADDRESS,
	SAVE_LOCATION_DETAILS,
	SAVE_LOCATION_GEOMETRY,
	SAVE_LOCATION_NAME,
	SAVE_PREDICTIONS,
	SET_AUTH_COMPANY_NAME,
	SET_AUTH_EMAIL,
	SET_AUTH_FOLIO_NUMBER,
	SET_AUTH_FULL_NAME,
	SET_AUTH_PASSWORD,
	SET_AUTH_USER_TYPE,
	SET_FCM_TOKEN,
	SET_USER_DETAILS,
	SIGN_IN_USER,
	SIGN_IN_USER_FAILURE,
	SIGN_IN_USER_SUCCESS,
	SIGN_IN_USER_WITH_BIOMETRICS,
	SIGN_IN_USER_WITH_BIOMETRICS_FAILURE,
	SIGN_IN_USER_WITH_BIOMETRICS_SUCCESS,
	SIGN_UP_COMPANY,
	SIGN_UP_COMPANY_FAILURE,
	SIGN_UP_COMPANY_SUCCESS,
	SIGN_UP_DOCTOR,
	SIGN_UP_DOCTOR_FAILURE,
	SIGN_UP_DOCTOR_SUCCESS,
	SIGN_UP_INDIVIDUAL,
	SIGN_UP_INDIVIDUAL_FAILURE,
	SIGN_UP_INDIVIDUAL_SUCCESS,
	UPDATE_USER_PROFILE_PICTURE,
	UPDATE_USER_PROFILE_PICTURE_FAILURE,
	UPDATE_USER_PROFILE_PICTURE_SUCCESS,
	SET_PHONE_NUMBER,
	SET_DELIVERY_FEE
} from "./auth.types"

const initialState: AuthState = {
	fullName: "",
	companyName: "",
	email: "",
	password: "",
	userType: "",
	notificationId: "",
	folioNumber: "",
	loading: false,
	user: [],
	predictions: [],
	locationGeometry:[],
	locationName: '',
	locationAddress: '',
	locationDetails: [],
	phoneNumber: '',
	deliveryFee: ''
}

export function authReducer(
	state = initialState,
	action: AuthAction
): AuthState {
	switch (action.type) {

		case SET_AUTH_FULL_NAME:
			return {
				...state,
				fullName: action.payload
			}
		
		case SET_AUTH_EMAIL:
			return {
				...state,
				email: action.payload
			}

		case SET_AUTH_USER_TYPE:
			return {
				...state,
				userType: action.payload
			}
		
		case SET_AUTH_FOLIO_NUMBER:
			return {
				...state,
				folioNumber: action.payload
			}
		
		case SAVE_LOCATION_NAME:
			return {
				...state,
				locationName: action.payload
			}
		
		case SAVE_LOCATION_ADDRESS:
			return {
				...state,
				locationAddress: action.payload
			}
		
		case SAVE_LOCATION_GEOMETRY:
			return {
				...state,
				locationGeometry: action.payload
			}
		
		case SAVE_LOCATION_DETAILS:
			return {
				...state,
				locationDetails: action.payload
			}
		
		case SAVE_PREDICTIONS:
			return {
				...state,
				predictions: action.payload
			}
		
		case SIGN_UP_INDIVIDUAL:
		case SIGN_UP_DOCTOR:
		case SIGN_UP_COMPANY:
		case SIGN_IN_USER_WITH_BIOMETRICS:
		case SIGN_IN_USER:
		case FORGOT_PASSWORD:
		case EDIT_PASSWORD:
		case UPDATE_USER_PROFILE_PICTURE:
			return {
				...state,
				loading: true
			}
		
		case SIGN_UP_INDIVIDUAL_FAILURE:
		case SIGN_UP_INDIVIDUAL_SUCCESS:
		case SIGN_UP_DOCTOR_FAILURE:
		case SIGN_UP_DOCTOR_SUCCESS:
		case SIGN_UP_COMPANY_FAILURE:
		case SIGN_UP_COMPANY_SUCCESS:
		case SIGN_IN_USER_WITH_BIOMETRICS_FAILURE:
		case SIGN_IN_USER_WITH_BIOMETRICS_SUCCESS:
		case SIGN_IN_USER_FAILURE:
		case SIGN_IN_USER_SUCCESS:
		case FORGOT_PASSWORD_FAILURE:
		case FORGOT_PASSWORD_SUCCESS:
		case EDIT_PASSWORD_FAILURE:
		case EDIT_PASSWORD_SUCCESS:
		case UPDATE_USER_PROFILE_PICTURE_FAILURE:
		case UPDATE_USER_PROFILE_PICTURE_SUCCESS:
			return {
				...state,
				loading: false
			}
		
		case SET_USER_DETAILS:
			return {
				...state,
				user: action.payload
			}
		
		case SET_FCM_TOKEN:
			return {
				...state,
				notificationId: action.payload
			}
		
		case SET_AUTH_COMPANY_NAME:
			return {
				...state,
				companyName: action.payload
			}

		case SET_PHONE_NUMBER:
			return {
				...state,
				phoneNumber: action.payload
			}

		case SET_DELIVERY_FEE:
			return {
				...state,
				deliveryFee: action.payload
			}
	
		case SET_AUTH_PASSWORD:
			return {
				...state,
				password: action.payload
			}
		
		default:
			return state
	}
}