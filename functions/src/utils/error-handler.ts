let $axiosErrorHandler = async (error: any) => {
  return error.response.data.error;
};
let $firestormErrorHandler = async (error: any) => {
  if (!error.code)
    return {
      code: 400,
      message: error,
    };
  return error;
};
let $facebookErrorHandler = async (error: any) => {
  let returnError = error;
  if (error.data) {
    if (error.data.error.error_user_msg) {
      returnError = error.data.error.error_user_msg;
    } else if (error.data.error.message) {
      returnError = error.data.error.message;
    }
  }
  return returnError;
};
let $genericErrorHandler = async (error: { [property: string]: string | number }) => {
  return { ...error };
};
export { $axiosErrorHandler, $firestormErrorHandler, $genericErrorHandler, $facebookErrorHandler };
