let $axiosErrorHandler = async (error: any) => {
  return error.response.data.error;
};
export { $axiosErrorHandler };
