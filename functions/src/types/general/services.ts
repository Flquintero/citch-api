export interface IUpdateObject {
  pathId: string; // {{collections}}/{{id}}
  updateData: { [property: string]: any };
}
