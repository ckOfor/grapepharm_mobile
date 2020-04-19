import {
  DeviceState,
  DeviceAction,
  SET_ONLINE,
  REQUEST_LOCATION_SUCCESS
} from "./device.types"

const initialState: DeviceState = {
  isOnline: false,
  location: {
    coords: {
      latitude: null,
      longitude: null,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: null
  }
}

export function deviceReducer(
  state: DeviceState = initialState,
  action: DeviceAction
): DeviceState {
  switch (action.type) {
    case SET_ONLINE:
      return {
        ...state,
        isOnline: action.payload
      }

    case REQUEST_LOCATION_SUCCESS:
      return {
        ...state,
        location: action.payload
      }

    default:
      return state
  }
}
