export type DistanceEducationData = {
  videoUrl: string;
  videoType: "upload" | "youtube" | "instagram" | "direct";
  heading: string;
  subheading: string;
  badgeValue: string;
  badgeLabel: string;
  highlights: string[];
  updatedAt?: string;
};

export const DEFAULT_DISTANCE_EDUCATION_DATA: DistanceEducationData = {
  videoUrl: "/images/stories/Campus_video1.mp4",
  videoType: "upload",
  heading: "Best Distance Education Centre in Kerala \u2013 Building Futures with Flexible Learning",
  subheading: "Why Students Choose Us",
  badgeValue: "18+ Years",
  badgeLabel: "Guiding Students Forward",
  highlights: [
    "Simple Admission Procedures",
    "Clear, Ongoing Support",
    "Experienced Mentors",
    "Reliable University Tie-ups",
  ],
};
