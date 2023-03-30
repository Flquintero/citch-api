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
  if (error.response) {
    returnError = {
      code: error.response.data.code,
      title: error.response.data.error_user_title,
      message: error.response.data.error_user_msg,
    };
  }
  console.log("ERROR HANDLER FB", returnError);
  return returnError;
};
let $genericErrorHandler = async (error: {
  [property: string]: string | number;
}) => {
  return { ...error };
};
export {
  $axiosErrorHandler,
  $firestormErrorHandler,
  $genericErrorHandler,
  $facebookErrorHandler,
};
