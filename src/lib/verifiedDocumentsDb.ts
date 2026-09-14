import { ObjectId } from "mongodb";

export const VERIFIED_DOCS_COLLECTION = "verified_documents";

export interface VerifiedDocumentDoc {
  id?: string;
  _id?: ObjectId | string;
  title: string;
  pdfUrl: string;
  fileName?: string;
  status: "Published" | "Draft";
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

declare global {
  // eslint-disable-next-line no-var
  var _verifiedDocsMemoryStore: VerifiedDocumentDoc[] | undefined;
}

if (!global._verifiedDocsMemoryStore) {
  global._verifiedDocsMemoryStore = [];
}

export const getVerifiedDocsMemoryStore = (): VerifiedDocumentDoc[] => {
  if (!global._verifiedDocsMemoryStore) {
    global._verifiedDocsMemoryStore = [];
  }
  return global._verifiedDocsMemoryStore;
};

export const setVerifiedDocsMemoryStore = (store: VerifiedDocumentDoc[]) => {
  global._verifiedDocsMemoryStore = store;
};
