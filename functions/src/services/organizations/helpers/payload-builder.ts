let _getCreateOrganizationPayload = async (requestBody: any) => {
  const { email, fullName, userDocReference } = requestBody;
  return {
    email,
    fullName: fullName,
    owner: userDocReference,
    type: 'OWNER',
    enabled: 'false',
  };
};

export { _getCreateOrganizationPayload };
