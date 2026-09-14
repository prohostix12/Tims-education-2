import { ObjectId } from "mongodb";

export const ONLINE_DEGREE_STREAMS_COLLECTION = "online_degree_streams";

export interface OnlineDegreeCourse {
  id: string;
  name: string;
  eligibility: string;
  status: "Published" | "Draft";
  order: number;
}

export interface OnlineDegreeStreamDoc {
  id?: string;
  _id?: ObjectId | string;
  streamId: string;
  label: string;
  status: "Published" | "Draft";
  order: number;
  courses: OnlineDegreeCourse[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

declare global {
  // eslint-disable-next-line no-var
  var _onlineDegreeMemoryStore: OnlineDegreeStreamDoc[] | undefined;
}

if (!global._onlineDegreeMemoryStore) {
  global._onlineDegreeMemoryStore = [];
}

export const getOnlineDegreeMemoryStore = (): OnlineDegreeStreamDoc[] => {
  if (!global._onlineDegreeMemoryStore) {
    global._onlineDegreeMemoryStore = [];
  }
  return global._onlineDegreeMemoryStore;
};

export const setOnlineDegreeMemoryStore = (store: OnlineDegreeStreamDoc[]) => {
  global._onlineDegreeMemoryStore = store;
};
