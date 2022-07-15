let $axiosErrorHandler = async (error: any) => {
  console.log('err', error);
  return error.response.data.error;
};
export { $axiosErrorHandler };
