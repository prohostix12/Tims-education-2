import { ObjectId } from "mongodb";

export const SKILL_COURSES_COLLECTION = "skill_courses";

export interface SkillCourseItem {
  id: string;
  _id?: ObjectId | string;
  title: string;
  category: string;
  duration: string;
  eligibility: string;
  description: string;
  topics: string[];
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

declare global {
  // eslint-disable-next-line no-var
  var _skillCoursesMemoryStore: SkillCourseItem[] | undefined;
}

if (!global._skillCoursesMemoryStore) {
  global._skillCoursesMemoryStore = [];
}

export const getSkillCoursesMemoryStore = (): SkillCourseItem[] => {
  if (!global._skillCoursesMemoryStore) {
    global._skillCoursesMemoryStore = [];
  }
  return global._skillCoursesMemoryStore;
};

export const setSkillCoursesMemoryStore = (store: SkillCourseItem[]) => {
  global._skillCoursesMemoryStore = store;
};
