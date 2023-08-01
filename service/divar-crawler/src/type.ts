import type {AlwatrDocumentObject} from '@alwatr/storage-engine';

export interface PostData extends AlwatrDocumentObject {
  phoneNumber?: number;
  title?: string;
}

export interface Token extends AlwatrDocumentObject {
  token: string;
  limitTime?: number;
}

export interface Message extends AlwatrDocumentObject {
  text: string;
}
