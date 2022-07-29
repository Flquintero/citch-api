import axios, { AxiosRequestConfig } from 'axios';

export interface ApiRequestOptions extends AxiosRequestConfig {
  apiVersion?: string;
}

let $apiRequest: (options: ApiRequestOptions) => Promise<any>;

const apiRequestAxiosInstance = axios.create();

$apiRequest = async function apiRequest(options: ApiRequestOptions) {
  try {
    const response = await getApiResponse(options);
    return response?.data;
  } catch (e) {
    throw e;
  }
};

function getApiResponse(options: ApiRequestOptions) {
  const requestObj = {
    ...options,
    baseURL: process.env.VUE_APP_BASE_API_URL,
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };

  return apiRequestAxiosInstance.request(requestObj);
}

export { $apiRequest };
