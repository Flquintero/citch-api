import { db } from '../../config/firebase';

//pathId = {{collection}}/{{id}}

// ids are returned as paths {{collection}}/{{id}} so when we want the id we use this method
let $getDocumentId = async (pathId: string) => {
  return pathId.split('/')[1];
};
// to assign a document a reference to another we have to set it to be an officiaal reference if not its treated as string
// so we use this method to turn into reference
let $toDocReference = async (pathId: string) => {
  return db.doc(pathId);
};
export { $getDocumentId, $toDocReference };
