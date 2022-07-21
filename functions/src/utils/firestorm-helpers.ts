let $getDocumentId = async (pathId: string) => {
  return pathId.split('/')[1];
};
export { $getDocumentId };
