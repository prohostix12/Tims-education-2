import { ObjectId } from "mongodb";

export const POST_GRADUATION_STREAMS_COLLECTION = "post_graduation_streams";

export interface PostGraduationCourse {
  id: string;
  name: string;
  eligibility: string;
  status: "Published" | "Draft";
  order: number;
}

export interface PostGraduationStreamDoc {
  id?: string;
  _id?: ObjectId | string;
  streamId: string;
  label: string;
  status: "Published" | "Draft";
  order: number;
  courses: PostGraduationCourse[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

declare global {
  // eslint-disable-next-line no-var
  var _postGraduationMemoryStore: PostGraduationStreamDoc[] | undefined;
}

if (!global._postGraduationMemoryStore) {
  global._postGraduationMemoryStore = [];
}

export const getPostGraduationMemoryStore = (): PostGraduationStreamDoc[] => {
  if (!global._postGraduationMemoryStore) {
    global._postGraduationMemoryStore = [];
  }
  return global._postGraduationMemoryStore;
};

export const setPostGraduationMemoryStore = (store: PostGraduationStreamDoc[]) => {
  global._postGraduationMemoryStore = store;
};
