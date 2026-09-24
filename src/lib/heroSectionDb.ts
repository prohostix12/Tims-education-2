export const HERO_CONTENT_COLLECTION = "hero_content";

export interface HeroContentDoc {
  _id?: any;
  id?: string;
  eyebrow: string;
  headingMain: string;
  headingHighlight: string;
  subtitle: string;
  updatedAt?: Date | string;
}

export const DEFAULT_HERO_CONTENT: HeroContentDoc = {
  eyebrow: "BEST ONLINE DEGREE PLATFORM",
  headingMain: "18+ Years of Experience.",
  headingHighlight: "One Commitment to Your Future.",
  subtitle:
    "Explore 10th & Plus Two, degree, postgraduate, diploma and skill programs with expert guidance to help you choose the right course and university.",
};

let heroMemoryStore: HeroContentDoc = { ...DEFAULT_HERO_CONTENT };

export function getHeroMemoryStore(): HeroContentDoc {
  return heroMemoryStore;
}

export function setHeroMemoryStore(data: Partial<HeroContentDoc>) {
  heroMemoryStore = {
    ...heroMemoryStore,
    ...data,
  };
}
