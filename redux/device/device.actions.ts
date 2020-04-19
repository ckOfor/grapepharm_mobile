import { ThunkAction } from "redux-thunk"
import * as Location from "expo-location"
import { Action } from "redux"
import {
  SET_ONLINE,
  LocationNode,
  REQUEST_LOCATION,
  REQUEST_LOCATION_SUCCESS
} from "./device.types"
import { ApplicationState } from ".."
// import { RN_GOOGLE_MAPS_IOS_API_KEY } from "react-native-dotenv"
// import {saveRideLocation, saveRideLocationAddress, saveRideLocationName} from "../ride";
import axios from 'axios'
import {NavigationActions} from "react-navigation";
import {store} from "../../App";

/**
 *  Actions
 */

export const setOnline = (isOnline: boolean) => ({
  type: SET_ONLINE,
  payload: isOnline
})

export const requestLocation = () => ({
  type: REQUEST_LOCATION
})
const fetchUserLocationSuccess = (payload: LocationNode) => ({
  type: REQUEST_LOCATION_SUCCESS,
  payload
})

/**
 * Thunks
 */
export const fetchUserLocationAsync = (): ThunkAction<
  void,
  ApplicationState,
  null,
  Action<any>
> => async (dispatch, getState) => {
  dispatch(requestLocation())
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: 0,
      distanceInterval: 0,
      timeInterval: 0,
      timeout: 5000
    })
    console.tron.log("locationlocation")
    console.tron.log(location)
    dispatch(fetchUserLocationSuccess(location))
    dispatch(fetchUserLocationAPIAsync(location))
  } catch (error) {}
}

export const fetchUserLocationAPIAsync = (location): ThunkAction<
  void,
  ApplicationState,
  null,
  Action<any>
  > => async (dispatch, getState) => {
  
  // const state = getState()
  // const coords = state.device.location.coords
  // const latitude = coords.latitude
  // const longitude = coords.longitude
  //
  // try {
  //
  //   await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true&key=${RN_GOOGLE_MAPS_IOS_API_KEY}`)
  //     .then((response) => {
  //       console.tron.log(response)
  //       // dispatch(saveRideLocationAddress(response.data.results[0].formatted_address))
  //       // dispatch(saveRideLocationName(response.data.results[0].formatted_address))
  //       // dispatch(saveRideLocation(response.data.results[0]))
  //     })
  //     .catch(err => {
  //       console.tron.log(err)
  //       console.tron.log(err.response.data.error)
  //     })
  // } catch (error) {
  //
  // }
}


export const goBack = (): ThunkAction<
  void,
  ApplicationState,
  null,
  Action<any>
  > => async (dispatch, getState) => {
  
  store.dispatch(NavigationActions.navigate({ routeName: 'home' }))
}



