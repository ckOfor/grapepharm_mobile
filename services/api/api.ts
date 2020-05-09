// a library to wrap and simplify api calls
import apisauce from "apisauce"
import { RN_API_ENDPOINT_BASE } from "react-native-dotenv"
import * as Types from "./api.types"
import { getGeneralApiProblem } from "./api-problem"
import {signUpCredentials} from "../../redux/auth";

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
  timeout: 10000
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

const signUp = async (values: signUpCredentials): Promise<
  Types.getResponse
  > => {
  const response = await api.post("/individual/signup", {
    ...values
  })
  return processResponse(response)
}

export {
  signUp,
}
