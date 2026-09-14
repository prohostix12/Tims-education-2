import { ObjectId } from "mongodb";

export const SSL_CARDS_COLLECTION = "sslc_content_cards";

export interface SslcCardDoc {
  id?: string;
  _id?: ObjectId | string;
  section: "admission" | "on-demand" | "course-structure";
  number: string;
  heading: string;
  image: string;
  descriptionHtml: string;
  status: "Published" | "Draft";
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

declare global {
  // eslint-disable-next-line no-var
  var _sslcCardsMemoryStore: SslcCardDoc[] | undefined;
}

if (!global._sslcCardsMemoryStore) {
  global._sslcCardsMemoryStore = [];
}

export const getMemoryStore = (): SslcCardDoc[] => {
  if (!global._sslcCardsMemoryStore) {
    global._sslcCardsMemoryStore = [];
  }
  return global._sslcCardsMemoryStore;
};

export const setMemoryStore = (store: SslcCardDoc[]) => {
  global._sslcCardsMemoryStore = store;
};
