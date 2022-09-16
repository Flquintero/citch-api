import axios, { AxiosRequestConfig } from 'axios';
import { ITokenHeaders } from '../types/general/services';
import { secrets } from '../config/firebase';

export interface ApiRequestOptions extends AxiosRequestConfig {
  apiVersion?: string;
}

let $apiRequest: (options: ApiRequestOptions) => Promise<any>;
let $firestormApiRequest: (options: ApiRequestOptions, headers: ITokenHeaders) => Promise<any>;

const apiRequestAxiosInstance = axios.create();

$apiRequest = async function apiRequest(options: ApiRequestOptions) {
  try {
    const response = await getApiResponse(options);
    return response?.data;
  } catch (e) {
    throw e;
  }
};
$firestormApiRequest = async function apiRequest(
  options: ApiRequestOptions,
  headers: ITokenHeaders
) {
  try {
    const response = await getFirestormApiResponse(options, headers);
    return response?.data;
  } catch (e) {
    throw e;
  }
};

function getApiResponse(options: ApiRequestOptions) {
  const requestObj = {
    ...options,
    baseURL: secrets.VUE_APP_BASE_API_URL, // change the env var when we use it
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };

  return apiRequestAxiosInstance.request(requestObj);
}

function getFirestormApiResponse(options: ApiRequestOptions, headers: ITokenHeaders) {
  const { idToken, appCheckToken } = headers;
  const requestObj = {
    ...options,
    baseURL: `https://firestore.googleapis.com/v1/projects/${secrets.APP_FIREBASE_PROJECT_ID}/databases/(default)/documents`,
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'X-Firebase-Token': `${appCheckToken}`,
    },
  };

  console.log('REQUEST', requestObj);

  return apiRequestAxiosInstance.request(requestObj);
}

export { $apiRequest, $firestormApiRequest };
