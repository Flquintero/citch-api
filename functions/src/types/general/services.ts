export interface IUpdateObject {
  pathId: string; // {{collections}}/{{id}}
  updateData: { [property: string]: any };
}

export interface IReadObject {
  id: string;
}

export interface ITokenHeaders {
  idToken: unknown;
  appCheckToken: unknown;
}
