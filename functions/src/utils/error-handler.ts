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
let $genericErrorHandler = async (error: { [property: string]: string | number }) => {
  return { ...error };
};
export { $axiosErrorHandler, $firestormErrorHandler, $genericErrorHandler };
