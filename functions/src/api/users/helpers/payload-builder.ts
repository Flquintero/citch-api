let _getCreateUserPayload = async (requestBody: Request['body']) => {
  return {
    ...requestBody,
    type: 'OWNER',
    enabled: 'false',
  };
};

let _getCreateOrganizationPayload = async (userPathId: string, requestBody: any) => {
  const { email, fullName } = requestBody;
  return {
    email,
    fullName: fullName,
    owner: userPathId,
    type: 'OWNER',
    enabled: 'false',
  };
};

export { _getCreateUserPayload, _getCreateOrganizationPayload };
