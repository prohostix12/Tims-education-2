import { ObjectId } from "mongodb";

export const DIPLOMA_STREAMS_COLLECTION = "diploma_streams";

export interface DiplomaCourse {
  id: string;
  name: string;
  eligibility: string;
  status: "Published" | "Draft";
  order: number;
}

export interface DiplomaStreamDoc {
  id?: string;
  _id?: ObjectId;
  streamId: string;
  label: string;
  status: "Published" | "Draft";
  order: number;
  courses: DiplomaCourse[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

declare global {
  // eslint-disable-next-line no-var
  var _diplomaMemoryStore: DiplomaStreamDoc[] | undefined;
}

if (!global._diplomaMemoryStore) {
  global._diplomaMemoryStore = [];
}

export const getDiplomaMemoryStore = (): DiplomaStreamDoc[] => {
  if (!global._diplomaMemoryStore) {
    global._diplomaMemoryStore = [];
  }
  return global._diplomaMemoryStore;
};

export const setDiplomaMemoryStore = (store: DiplomaStreamDoc[]) => {
  global._diplomaMemoryStore = store;
};
