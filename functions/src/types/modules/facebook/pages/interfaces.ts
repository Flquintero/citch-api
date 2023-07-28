import {
  EFacebookPageLinkedStatus,
  EInstagramPostMediaType,
  EInstagramPostPlacement,
} from "./enums";

export interface IFacebookPageCheckInListOfPagesData {
  pageId: string;
  pages: IFacebookPage[];
  pagesTotalCount: number;
  pageLimit: number;
  pagesNext: string; // URL
  currentIndex: number;
}

export interface IFacebookPage {
  id: string;
  name?: string;
  picture?: IFacebookPicture;
  access_token?: string;
}

export interface IFacebookPicture {
  data: { height: number; is_silhouette: boolean; url: string; width: number };
}

export interface IFacebookPageLinkedStatus {
  status: EFacebookPageLinkedStatus;
}

export interface IInstagramPost {
  id: string;
  shortcode?: string;
  media_type?: EInstagramPostMediaType;
  media_product_type?: EInstagramPostPlacement;
}
