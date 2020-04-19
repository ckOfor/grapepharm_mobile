export interface Coords {
  latitude: number | null
  longitude: number | null
  altitude: number | null
  accuracy: number | null
  altitudeAccuracy?: number | null
  heading: number | null
  speed: number | null
}
export interface LocationNode {
  coords: Coords
  timestamp: number
}

export type DeviceState = {
  isOnline: boolean
  location: LocationNode
}

export const SET_ONLINE = "SET_ONLINE"
export type SetOnline = {
  type: typeof SET_ONLINE
  payload: boolean
}

export const REQUEST_LOCATION = "REQUEST_LOCATION"
export const REQUEST_LOCATION_SUCCESS = "REQUEST_LOCATION_SUCCESS"
export type RequestLocation = {
  type: typeof REQUEST_LOCATION
}
export type RequestLocationSuccess = {
  type: typeof REQUEST_LOCATION_SUCCESS
  payload: LocationNode
}

export type DeviceAction = SetOnline | RequestLocation | RequestLocationSuccess
