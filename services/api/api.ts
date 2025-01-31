// a library to wrap and simplify api calls
import apisauce from "apisauce"
import { RN_API_ENDPOINT_BASE } from "react-native-dotenv"
import * as Types from "./api.types"
import { getGeneralApiProblem } from "./api-problem"
import {authCredentials, forgotPasswordFields} from "../../redux/auth";

const api = apisauce.create({
  // base URL is read from the "constructor"
  baseURL: RN_API_ENDPOINT_BASE,
  // here are some default headers
  headers: {
    "Cache-Control": "no-cache",
    Accept: 'application/json',
    ContentType: 'application/json',
  },
  // 10 second timeout...
  timeout: 30000
})

/**
 * Process the api response
 */
const processResponse = async (response: any): Promise<any> => {
  // the typical ways to die when calling an api
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) {
      console.tron.error({ ...response, message: response.config.url })
      return problem
    }
  }

  // we're good
  // replace with `data` once api change is made.
  return { kind: "ok", data: response.data }
}

const signUpIndividual = async (values: authCredentials): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/individual/signup", {
    ...values
  })
  return processResponse(response)
}

const signUpDoctor = async (values: authCredentials): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/doctor/signup", {
    ...values
  })
  return processResponse(response)
}

const signUpCompany = async (values: authCredentials): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/company/signup", {
    ...values
  })
  return processResponse(response)
}

const signInUser = async (values: authCredentials): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/${values.userType}/signin`, {
    ...values
  })
  return processResponse(response)
}

const forgotPassword = async (values: authCredentials): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/${values.userType}/reset/password`, {
    ...values
  })
  return processResponse(response)
}

const editPassword = async (values: forgotPasswordFields): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/${values.userType}/edit/password`, {
    ...values
  })
  return processResponse(response)
}

const fetchPredictionsFromServer = async (searchKey: string): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/google/search`, {
    searchKey
  })
  return processResponse(response)
}

const fetchLatitudeAndLongitudeFromServer = async (searchKey: string): Promise<
  Types.getResponse
  > => {
  const response = await api.post( `/google/geocode`, {
    searchKey
  })
  return processResponse(response)
}

export {
  signUpIndividual,
  signUpDoctor,
  signUpCompany,
  signInUser,
  forgotPassword,
  editPassword,
  fetchPredictionsFromServer,
  fetchLatitudeAndLongitudeFromServer
}
