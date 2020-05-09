import {
	AuthAction,
	AuthState, IUser,
	SET_AUTH_EMAIL,
	SET_AUTH_FULL_NAME,
	SET_AUTH_USER_TYPE, SET_USER_DETAILS,
	SIGN_UP_INDIVIDUAL,
	SIGN_UP_INDIVIDUAL_FAILURE,
	SIGN_UP_INDIVIDUAL_SUCCESS
} from "./auth.types"

const initialState: AuthState = {
	fullName: "",
	email: "",
	userType: "",
	notificationId: "",
	loading: false,
	user: []
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
		
		case SIGN_UP_INDIVIDUAL:
			return {
				...state,
				loading: true
			}
		
		case SIGN_UP_INDIVIDUAL_FAILURE:
		case SIGN_UP_INDIVIDUAL_SUCCESS:
			return {
				...state,
				loading: false
			}
		
		case SET_USER_DETAILS:
			return {
				...state,
				user: action.payload
			}
		
		case "SET_FCM_TOKEN":
			return {
				...state,
				notificationId: action.payload
			}
		
		default:
			return state
	}
}