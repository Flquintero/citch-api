let _getCreateUserPayload = async (requestBody: Request['body']) => {
  return {
    ...requestBody,
    type: 'OWNER',
    enabled: 'false',
  };
};

export { _getCreateUserPayload };
